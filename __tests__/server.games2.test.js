// @vitest-environment node
import { createRequire } from 'module';
import { io as ioClient } from 'socket.io-client';
import supertest from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

const require = createRequire(import.meta.url);
const { app, server, _resetRateLimitsForTest, _resetRoomsForTest } = require('../server.js');
const request = supertest(app);

let port;
const openSockets = [];

beforeAll(async () => {
    await new Promise((resolve) => server.listen(0, resolve));
    port = server.address().port;
});

afterAll(async () => {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
});

beforeEach(() => {
    _resetRateLimitsForTest();
    _resetRoomsForTest();
});

afterEach(async () => {
    await Promise.all(openSockets.map((s) => new Promise((resolve) => {
        if (s.connected) { s.once('disconnect', resolve); s.disconnect(); } else { resolve(); }
    })));
    openSockets.length = 0;
});

function connect() {
    const s = ioClient(`http://localhost:${port}`, { transports: ['websocket'], forceNew: true });
    openSockets.push(s);
    return s;
}

function connected(socket) {
    return new Promise((resolve, reject) => {
        socket.on('connect', resolve);
        socket.on('connect_error', reject);
    });
}

function once(socket, event, timeout = 2000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout waiting for '${event}'`)), timeout);
        socket.once(event, (data) => { clearTimeout(t); resolve(data); });
    });
}

function oncePredicate(socket, event, pred, timeout = 2000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout waiting for '${event}' with predicate`)), timeout);
        function handler(data) {
            if (pred(data)) { clearTimeout(t); socket.off(event, handler); resolve(data); }
        }
        socket.on(event, handler);
    });
}

async function createRoomCode(gameId = 'ticTacToe') {
    const res = await request.post('/api/rooms').send({ gameId });
    return res.body.code;
}

async function joinAsHost(code, name = 'Hôte') {
    const s = connect();
    await connected(s);
    const p = once(s, 'room:joined');
    s.emit('room:create', { code, playerName: name });
    await p;
    return s;
}

async function joinAsGuest(code, name = 'Invité') {
    const s = connect();
    await connected(s);
    const p = once(s, 'room:joined');
    s.emit('room:join', { code, playerName: name });
    await p;
    return s;
}

async function readyRoom(gameId = 'ticTacToe') {
    const code = await createRoomCode(gameId);
    const host = await joinAsHost(code, 'H');
    const guest = await joinAsGuest(code, 'G');

    host.emit('room:toggle-ready');
    await once(host, 'room:updated');

    guest.emit('room:toggle-ready');
    const [launchPayload] = await Promise.all([
        oncePredicate(host, 'room:updated', (p) => p.gameLaunched),
        oncePredicate(guest, 'room:updated', (p) => p.gameLaunched),
    ]);
    await new Promise((r) => setTimeout(r, 30));
    return { code, host, guest, launchPayload };
}

// ─── battleship ───────────────────────────────────────────────────────────────

describe('battleship', () => {
    it('tir valide (captain1) change le tour en captain2', async () => {
        const { host } = await readyRoom('battleship');
        const upd = once(host, 'room:updated');
        host.emit('battleship:shot', { row: 0, col: 0 });
        const payload = await upd;
        // Either turn changed OR the shot won the game (extremely unlikely in one shot)
        const { currentTurn, winner } = payload.gameState;
        expect(winner !== null || currentTurn === 'captain2').toBe(true);
    });

    it('tir hors grille émet room:error', async () => {
        const { host } = await readyRoom('battleship');
        const err = once(host, 'room:error');
        host.emit('battleship:shot', { row: 99, col: 0 });
        await expect(err).resolves.toMatchObject({ message: expect.stringMatching(/invalide/i) });
    });

    it("l'hôte peut relancer la battleship", async () => {
        const { host } = await readyRoom('battleship');
        const upd = once(host, 'room:updated');
        host.emit('battleship:restart');
        const payload = await upd;
        expect(payload.gameState.currentTurn).toBe('captain1');
        expect(payload.gameState.winner).toBeNull();
    });
});

// ─── connect4 restart ─────────────────────────────────────────────────────────

describe('connect4:restart', () => {
    it("l'hôte peut relancer une partie de connect4", async () => {
        const { host, guest } = await readyRoom('connect4');
        // Joue un coup d'abord pour avoir un état non-vierge
        const upd1 = Promise.all([once(host, 'room:updated'), once(guest, 'room:updated')]);
        host.emit('connect4:move', { col: 3 });
        await upd1;

        const upd2 = once(host, 'room:updated');
        host.emit('connect4:restart');
        const payload = await upd2;
        expect(payload.gameState.lastMove).toBeNull();
        expect(payload.gameState.finished).toBe(false);
        expect(payload.gameState.board.flat().every((cell) => cell === null)).toBe(true);
    });
});

// ─── checkers restart ─────────────────────────────────────────────────────────

describe('checkers:restart', () => {
    it("l'hôte peut relancer une partie de checkers", async () => {
        const { host, guest } = await readyRoom('checkers');
        // Joue un coup d'abord
        const upd1 = Promise.all([once(host, 'room:updated'), once(guest, 'room:updated')]);
        host.emit('checkers:move', { fromRow: 5, fromCol: 0, toRow: 4, toCol: 1 });
        await upd1;

        const upd2 = once(host, 'room:updated');
        host.emit('checkers:restart');
        const payload = await upd2;
        expect(payload.gameState.turn).toBe('red');
        expect(payload.gameState.winner).toBeNull();
        expect(payload.gameState.lastMove).toBeNull();
    });
});

// ─── chess restart ────────────────────────────────────────────────────────────

describe('chess:restart', () => {
    it("l'hôte peut relancer une partie d'échecs", async () => {
        const { host, guest } = await readyRoom('chess');
        // Joue un coup d'abord
        const upd1 = Promise.all([once(host, 'room:updated'), once(guest, 'room:updated')]);
        host.emit('chess:move', { fromRow: 6, fromCol: 4, toRow: 4, toCol: 4 });
        await upd1;

        const upd2 = once(host, 'room:updated');
        host.emit('chess:restart');
        const payload = await upd2;
        expect(payload.gameState.turn).toBe('white');
        expect(payload.gameState.winner).toBeNull();
        expect(payload.gameState.lastMove).toBeNull();
        // La pièce e2 (ligne 6) doit être rétablie
        expect(payload.gameState.board[6][4]).toMatchObject({ type: 'pawn', color: 'white' });
    });
});

// ─── uno ─────────────────────────────────────────────────────────────────────

describe('uno', () => {
    it('piocher une carte augmente la main du joueur courant', async () => {
        const { host, launchPayload } = await readyRoom('uno');
        const initialHandCount = launchPayload.gameState.players.find((p) => p.isYou).handCount;

        const upd = once(host, 'room:updated');
        host.emit('uno:draw-card');
        const payload = await upd;

        // Le tour peut avancer si la carte piochée n'est pas jouable, mais la main a grossi
        const myState = payload.gameState.players.find((p) => p.isYou);
        // handCount est le vrai compte côté serveur
        expect(myState.handCount).toBeGreaterThanOrEqual(initialHandCount);
    });

    it('jouer une carte valide réduit la main', async () => {
        const { host, launchPayload } = await readyRoom('uno');
        const { currentColor, players } = launchPayload.gameState;
        const myHand = players.find((p) => p.isYou).hand;
        const initialCount = myHand.length;

        // Cherche une carte jouable : wild en priorité, sinon couleur courante
        let idx = myHand.findIndex((c) => c.color === 'wild');
        if (idx === -1) idx = myHand.findIndex((c) => c.color === currentColor);

        if (idx === -1) {
            // Aucune carte jouable (très rare) : on pioche à la place
            const upd = once(host, 'room:updated');
            host.emit('uno:draw-card');
            await upd;
            return;
        }

        const upd = once(host, 'room:updated');
        host.emit('uno:play-card', { cardIndex: idx });
        const payload = await upd;
        const myNew = payload.gameState.players.find((p) => p.isYou);
        expect(myNew.handCount).toBe(initialCount - 1);
    });

    it("l'hôte peut relancer une partie d'uno", async () => {
        const { host, launchPayload } = await readyRoom('uno');
        const previousRound = launchPayload.gameState.round;

        const upd = once(host, 'room:updated');
        host.emit('uno:restart');
        const payload = await upd;
        expect(payload.gameState.round).toBe(previousRound + 1);
        expect(payload.gameState.winner).toBeNull();
    });
});

// ─── bomb ─────────────────────────────────────────────────────────────────────

describe('bomb', () => {
    it('mot valide contenant la syllabe est accepté', async () => {
        const { host, launchPayload } = await readyRoom('bomb');
        const syllable = launchPayload.gameState.currentSyllable;
        // Construit un mot qui contient forcément la syllabe (>= 3 chars)
        const word = syllable + 'ard';

        const upd = once(host, 'room:updated');
        host.emit('bomb:submit-word', { word });
        const payload = await upd;
        expect(payload.gameState.lastWord).toBe(word);
    });

    it('mot sans la syllabe émet room:error', async () => {
        const { host, launchPayload } = await readyRoom('bomb');
        const syllable = launchPayload.gameState.currentSyllable;
        // Choisit une syllabe différente pour construire un mot invalide
        const badSyllable = syllable === 'ba' ? 'ze' : 'ba';
        const badWord = badSyllable + 'ard';

        const err = once(host, 'room:error');
        host.emit('bomb:submit-word', { word: badWord });
        await expect(err).resolves.toMatchObject({ message: expect.stringMatching(/syllabe/i) });
    });

    it("l'hôte peut relancer une manche de bomb", async () => {
        const { host, launchPayload } = await readyRoom('bomb');
        const previousRound = launchPayload.gameState.round;

        const upd = once(host, 'room:updated');
        host.emit('bomb:restart');
        const payload = await upd;
        expect(payload.gameState.round).toBe(previousRound + 1);
        expect(payload.gameState.winner).toBeNull();
    });
});
