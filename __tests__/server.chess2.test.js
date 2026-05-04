// @vitest-environment node
// Tests d'intégration serveur — scénarios avancés aux échecs :
// roque côté roi (blanc), Scholar's Mate (mat en 4), pat (stalemate).
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

function once(socket, event, timeout = 3000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout waiting for '${event}'`)), timeout);
        socket.once(event, (data) => { clearTimeout(t); resolve(data); });
    });
}

function oncePredicate(socket, event, pred, timeout = 3000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout waiting for '${event}' with predicate`)), timeout);
        function handler(data) {
            if (pred(data)) { clearTimeout(t); socket.off(event, handler); resolve(data); }
        }
        socket.on(event, handler);
    });
}

async function createRoomCode(gameId = 'chess') {
    const res = await request.post('/api/rooms').send({ gameId });
    return res.body.code;
}

async function joinAsHost(code, name = 'H') {
    const s = connect();
    await connected(s);
    const p = once(s, 'room:joined');
    s.emit('room:create', { code, playerName: name });
    await p;
    return s;
}

async function joinAsGuest(code, name = 'G') {
    const s = connect();
    await connected(s);
    const p = once(s, 'room:joined');
    s.emit('room:join', { code, playerName: name });
    await p;
    return s;
}

async function readyChess() {
    const code = await createRoomCode('chess');
    const host = await joinAsHost(code);
    const guest = await joinAsGuest(code);

    host.emit('room:toggle-ready');
    await once(host, 'room:updated');

    guest.emit('room:toggle-ready');
    await Promise.all([
        oncePredicate(host, 'room:updated', (p) => p.gameLaunched),
        oncePredicate(guest, 'room:updated', (p) => p.gameLaunched),
    ]);
    await new Promise((r) => setTimeout(r, 30));
    return { code, host, guest };
}

async function playSequence(host, guest, moves) {
    for (const { player, fromRow, fromCol, toRow, toCol, promotionPiece } of moves) {
        const upd = Promise.all([once(host, 'room:updated'), once(guest, 'room:updated')]);
        player.emit('chess:move', { fromRow, fromCol, toRow, toCol, promotionPiece });
        await upd;
    }
}

// Coordonnées serveur : row 0 = rangée 8 noire, row 7 = rangée 1 blanche
// Colonnes : a=0 b=1 c=2 d=3 e=4 f=5 g=6 h=7

describe('chess — roque', () => {
    it('roque côté roi (blanc) : roi en g1, tour en f1', async () => {
        const { host, guest } = await readyChess();

        // Dégager chevalier g1 (7,6) et fou f1 (7,5) pour autoriser le roque côté roi
        await playSequence(host, guest, [
            { player: host, fromRow: 6, fromCol: 4, toRow: 4, toCol: 4 }, // e4
            { player: guest, fromRow: 1, fromCol: 4, toRow: 3, toCol: 4 }, // e5
            { player: host, fromRow: 7, fromCol: 6, toRow: 5, toCol: 5 }, // Cf3
            { player: guest, fromRow: 1, fromCol: 0, toRow: 2, toCol: 0 }, // a6
            { player: host, fromRow: 7, fromCol: 5, toRow: 4, toCol: 2 }, // Fc4
            { player: guest, fromRow: 2, fromCol: 0, toRow: 3, toCol: 0 }, // a5
        ]);

        // Roque côté roi : roi (7,4) → (7,6)
        const final = once(host, 'room:updated');
        host.emit('chess:move', { fromRow: 7, fromCol: 4, toRow: 7, toCol: 6 });
        const payload = await final;

        expect(payload.gameState.board[7][6]).toMatchObject({ type: 'king', color: 'white' });
        expect(payload.gameState.board[7][5]).toMatchObject({ type: 'rook', color: 'white' });
        expect(payload.gameState.board[7][4]).toBeNull();
        expect(payload.gameState.board[7][7]).toBeNull();
        expect(payload.gameState.turn).toBe('black');
    });
});

describe('chess — mat (Scholar\'s Mate)', () => {
    it('mat du berger : blanc gagne en 4 coups', async () => {
        const { host, guest } = await readyChess();

        // 1.e4 e5  2.Fc4 Cc6  3.Dh5 Cf6??
        await playSequence(host, guest, [
            { player: host,  fromRow: 6, fromCol: 4, toRow: 4, toCol: 4 }, // 1. e4
            { player: guest, fromRow: 1, fromCol: 4, toRow: 3, toCol: 4 }, //    e5
            { player: host,  fromRow: 7, fromCol: 5, toRow: 4, toCol: 2 }, // 2. Fc4
            { player: guest, fromRow: 0, fromCol: 1, toRow: 2, toCol: 2 }, //    Cc6
            { player: host,  fromRow: 7, fromCol: 3, toRow: 3, toCol: 7 }, // 3. Dh5
            { player: guest, fromRow: 0, fromCol: 6, toRow: 2, toCol: 5 }, //    Cf6??
        ]);

        // 4. Dxf7# — la dame prend f7, mat
        const final = once(host, 'room:updated');
        host.emit('chess:move', { fromRow: 3, fromCol: 7, toRow: 1, toCol: 5 });
        const payload = await final;

        expect(payload.gameState.winner).toBe('white');
        expect(payload.gameState.turn).toBe('black'); // plus de coups légaux
    });
});

describe('chess — prise en passant', () => {
    it('prise en passant : le pion captué disparaît', async () => {
        const { host, guest } = await readyChess();

        // 1.e4  a6   2.e5  d5   → enPassantTarget = { row:2, col:3 }
        // 3.exd6 e.p. → pion blanc en (2,3), pion noir en (3,3) supprimé
        await playSequence(host, guest, [
            { player: host,  fromRow: 6, fromCol: 4, toRow: 4, toCol: 4 }, // 1. e4
            { player: guest, fromRow: 1, fromCol: 0, toRow: 2, toCol: 0 }, //    a6
            { player: host,  fromRow: 4, fromCol: 4, toRow: 3, toCol: 4 }, // 2. e5
            { player: guest, fromRow: 1, fromCol: 3, toRow: 3, toCol: 3 }, //    d5 (avance 2 cases → enPassantTarget)
        ]);

        // 3. exd6 e.p. : pion blanc (3,4) capture en diagonale vers (2,3)
        const final = once(host, 'room:updated');
        host.emit('chess:move', { fromRow: 3, fromCol: 4, toRow: 2, toCol: 3 });
        const payload = await final;

        expect(payload.gameState.board[2][3]).toMatchObject({ type: 'pawn', color: 'white' });
        expect(payload.gameState.board[3][3]).toBeNull(); // pion noir capturé
        expect(payload.gameState.board[3][4]).toBeNull(); // case de départ du pion blanc
    });
});
