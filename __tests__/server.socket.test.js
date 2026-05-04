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

    // Both ready → launchRoomGame fires automatically; server emits room:updated twice
    guest.emit('room:toggle-ready');
    await Promise.all([
        oncePredicate(host, 'room:updated', (p) => p.gameLaunched),
        oncePredicate(guest, 'room:updated', (p) => p.gameLaunched),
    ]);
    // Drain the second batch of room:updated emitted by the toggle-ready handler
    await new Promise((r) => setTimeout(r, 30));
    return { code, host, guest };
}

describe('connexion', () => {
    it('se connecte au serveur', async () => {
        const s = connect();
        await connected(s);
        expect(s.connected).toBe(true);
    });
});

describe('room:create (rejoindre comme hôte)', () => {
    it('reçoit room:joined avec isHost=true', async () => {
        const code = await createRoomCode();
        const s = connect();
        await connected(s);
        const p = once(s, 'room:joined');
        s.emit('room:create', { code, playerName: 'Capitaine' });
        const payload = await p;
        expect(payload.code).toBe(code);
        expect(payload.players).toHaveLength(1);
        expect(payload.players[0].name).toBe('Capitaine');
        expect(payload.players[0].isHost).toBe(true);
        expect(payload.players[0].isYou).toBe(true);
    });

    it("émet room:error si la room n'existe pas", async () => {
        const s = connect();
        await connected(s);
        const p = once(s, 'room:error');
        s.emit('room:create', { code: 'XXXXXX', playerName: 'X' });
        const err = await p;
        expect(err.message).toMatch(/existe pas/i);
    });
});

describe('room:join (rejoindre comme invité)', () => {
    it('les deux joueurs reçoivent room:updated avec 2 joueurs', async () => {
        const code = await createRoomCode();
        const host = await joinAsHost(code, 'Capitaine');
        const hostUpdate = once(host, 'room:updated');
        const guest = connect();
        await connected(guest);
        const guestJoined = once(guest, 'room:joined');
        guest.emit('room:join', { code, playerName: 'Matelot' });
        const [guestPayload] = await Promise.all([guestJoined, hostUpdate]);
        expect(guestPayload.players).toHaveLength(2);
        expect(guestPayload.players.find((p) => p.isYou)?.isHost).toBe(false);
    });

    it("émet room:error pour un code invalide", async () => {
        const s = connect();
        await connected(s);
        const p = once(s, 'room:error');
        s.emit('room:join', { code: 'XXXXXX', playerName: 'X' });
        const err = await p;
        expect(err.message).toMatch(/invalide/i);
    });

    it('refuse quand la room est pleine', async () => {
        const code = await createRoomCode('ticTacToe');
        await joinAsHost(code, 'J1');
        await joinAsGuest(code, 'J2');
        const s = connect();
        await connected(s);
        const p = once(s, 'room:error');
        s.emit('room:join', { code, playerName: 'J3' });
        const err = await p;
        expect(err.message).toMatch(/compl/i);
    });
});

describe('room:update-game', () => {
    it("l'hôte change le jeu", async () => {
        const code = await createRoomCode('ticTacToe');
        const host = await joinAsHost(code);
        const update = once(host, 'room:updated');
        host.emit('room:update-game', { gameId: 'connect4' });
        const payload = await update;
        expect(payload.gameId).toBe('connect4');
    });

    it("l'invité ne peut pas changer le jeu", async () => {
        const code = await createRoomCode('ticTacToe');
        await joinAsHost(code);
        const guest = await joinAsGuest(code);
        const p = once(guest, 'room:error');
        guest.emit('room:update-game', { gameId: 'connect4' });
        const err = await p;
        expect(err.message).toMatch(/hôte/i);
    });
});

describe('room:toggle-ready + lancement automatique', () => {
    it('game se lance quand les deux joueurs sont prêts', async () => {
        const code = await createRoomCode('ticTacToe');
        const host = await joinAsHost(code, 'H');
        const guest = await joinAsGuest(code, 'G');

        host.emit('room:toggle-ready');
        await once(host, 'room:updated');

        guest.emit('room:toggle-ready');
        const payload = await oncePredicate(host, 'room:updated', (p) => p.gameLaunched);
        expect(payload.gameLaunched).toBe(true);
        expect(payload.gameState).toBeDefined();
    });
});

describe('tictactoe', () => {
    it('un coup valide (anchor) émet room:updated aux deux joueurs', async () => {
        const { host, guest } = await readyRoom();
        const guestUpdate = once(guest, 'room:updated');
        host.emit('tictactoe:move', { index: 4 });
        const payload = await guestUpdate;
        expect(payload.gameState.board[4]).toBe('anchor');
    });

    it("jouer en dehors de son tour est silencieusement ignoré", async () => {
        const { host, guest } = await readyRoom();

        // Host joue index 0 — attendre la mise à jour des deux côtés
        const bothUpdated = Promise.all([once(host, 'room:updated'), once(guest, 'room:updated')]);
        host.emit('tictactoe:move', { index: 0 });
        await bothUpdated;

        // Tour du guest — host joue à nouveau (silencieusement ignoré)
        let fired = false;
        host.once('room:updated', () => { fired = true; });
        host.emit('tictactoe:move', { index: 1 });
        await new Promise((r) => setTimeout(r, 200));
        expect(fired).toBe(false);
    });

    it('index invalide déclenche room:error', async () => {
        const { host } = await readyRoom();
        const err = once(host, 'room:error');
        host.emit('tictactoe:move', { index: 99 });
        await expect(err).resolves.toMatchObject({ message: expect.stringMatching(/invalide/i) });
    });

    it('détecte le gagnant', async () => {
        const { host, guest } = await readyRoom();
        // H=0, G=3, H=1, G=4, H=2 → victoire H (ligne 0-1-2)
        const moves = [
            { player: host, index: 0 },
            { player: guest, index: 3 },
            { player: host, index: 1 },
            { player: guest, index: 4 },
        ];
        for (const { player, index } of moves) {
            const upd = Promise.all([once(host, 'room:updated'), once(guest, 'room:updated')]);
            player.emit('tictactoe:move', { index });
            await upd;
        }
        const final = once(host, 'room:updated');
        host.emit('tictactoe:move', { index: 2 });
        const payload = await final;
        expect(payload.gameState.finished).toBe(true);
        expect(payload.gameState.winner).toBe('anchor');
    });

    it("l'hôte peut relancer la partie", async () => {
        const { host } = await readyRoom();
        const p = once(host, 'room:updated');
        host.emit('tictactoe:restart');
        const payload = await p;
        expect(payload.gameState.board.every((c) => c === '')).toBe(true);
    });
});

describe('connect4', () => {
    it('jouer une colonne émet room:updated', async () => {
        const { host, guest } = await readyRoom('connect4');
        const upd = once(guest, 'room:updated');
        host.emit('connect4:move', { col: 3 });
        const payload = await upd;
        expect(payload.gameState).toBeDefined();
        expect(payload.gameState.lastMove).toMatchObject({ col: 3 });
    });

    it('détecte la victoire verticale', async () => {
        const { host, guest } = await readyRoom('connect4');
        // H col 0 ×3, G col 1 ×3, puis H col 0 → 4 pions verticaux → victoire
        const sequence = [
            { player: host, col: 0 }, { player: guest, col: 1 },
            { player: host, col: 0 }, { player: guest, col: 1 },
            { player: host, col: 0 }, { player: guest, col: 1 },
        ];
        for (const { player, col } of sequence) {
            const upd = Promise.all([once(host, 'room:updated'), once(guest, 'room:updated')]);
            player.emit('connect4:move', { col });
            await upd;
        }
        const final = once(host, 'room:updated');
        host.emit('connect4:move', { col: 0 });
        const payload = await final;
        expect(payload.gameState.finished).toBe(true);
        expect(payload.gameState.winner).toBe('player');
    });
});

describe('checkers', () => {
    it('premier coup valide (rouge) émet room:updated', async () => {
        const { host, guest } = await readyRoom('checkers');
        const guestUpd = once(guest, 'room:updated');
        // Pion rouge en (5,0) → (4,1) : première diagonale libre
        host.emit('checkers:move', { fromRow: 5, fromCol: 0, toRow: 4, toCol: 1 });
        const payload = await guestUpd;
        expect(payload.gameState.board[4][1]).toMatchObject({ color: 'red' });
        expect(payload.gameState.board[5][0]).toBeNull();
        expect(payload.gameState.turn).toBe('black');
    });

    it('coup depuis une case vide est silencieusement ignoré', async () => {
        const { host } = await readyRoom('checkers');
        let fired = false;
        host.once('room:updated', () => { fired = true; });
        host.emit('checkers:move', { fromRow: 4, fromCol: 0, toRow: 3, toCol: 1 });
        await new Promise((r) => setTimeout(r, 150));
        expect(fired).toBe(false);
    });
});

describe('room:chat:send', () => {
    it('les deux joueurs reçoivent le message (game lancée)', async () => {
        const { host, guest } = await readyRoom();
        const guestMsg = once(guest, 'room:updated');
        host.emit('room:chat:send', { message: 'Ahoy !' });
        const payload = await guestMsg;
        const last = payload.chatMessages.at(-1);
        expect(last.text).toBe('Ahoy !');
        expect(last.playerName).toBe('H');
    });

    it("chat impossible avant le lancement de la partie", async () => {
        const code = await createRoomCode();
        const host = await joinAsHost(code, 'H');
        await joinAsGuest(code, 'G');
        const err = once(host, 'room:error');
        host.emit('room:chat:send', { message: 'Trop tôt' });
        await expect(err).resolves.toMatchObject({ message: expect.any(String) });
    });
});

describe('disconnect', () => {
    it("le joueur restant reçoit room:updated quand l'autre se déconnecte", async () => {
        const code = await createRoomCode();
        const host = await joinAsHost(code, 'H');
        const guest = await joinAsGuest(code, 'G');
        const hostUpdate = once(host, 'room:updated');
        guest.disconnect();
        const payload = await hostUpdate;
        expect(payload.players).toHaveLength(1);
    });
});
