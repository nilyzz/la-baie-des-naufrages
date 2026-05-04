// @vitest-environment node
// Tests d'intégration serveur — pong:start et airhockey:start
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

async function createRoomCode(gameId) {
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

async function readyRoom(gameId) {
    const code = await createRoomCode(gameId);
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

// ─── pong ─────────────────────────────────────────────────────────────────────

describe('pong', () => {
    it("pong:start démarre le round (running = true)", async () => {
        const { host } = await readyRoom('pong');
        const upd = once(host, 'room:updated');
        host.emit('pong:start');
        const payload = await upd;
        expect(payload.gameState.running).toBe(true);
        expect(payload.gameState.countdownEndsAt).toBeGreaterThan(0);
    });

    it("seul l'hôte peut lancer le pong", async () => {
        const { guest } = await readyRoom('pong');
        const err = once(guest, 'room:error');
        guest.emit('pong:start');
        await expect(err).resolves.toMatchObject({ message: expect.stringMatching(/hôte/i) });
    });

    it("pong:input met à jour la direction sans émettre room:updated", async () => {
        const { host } = await readyRoom('pong');
        // Lancer d'abord
        const startUpd = once(host, 'room:updated');
        host.emit('pong:start');
        await startUpd;

        // pong:input ne doit pas déclencher room:updated
        let fired = false;
        host.once('room:updated', () => { fired = true; });
        host.emit('pong:input', { direction: 1 });
        await new Promise((r) => setTimeout(r, 150));
        expect(fired).toBe(false);
    });
});

// ─── airhockey ────────────────────────────────────────────────────────────────

describe('airhockey', () => {
    it("airhockey:start démarre le round (running = true)", async () => {
        const { host } = await readyRoom('airHockey');
        const upd = once(host, 'room:updated');
        host.emit('airhockey:start');
        const payload = await upd;
        expect(payload.gameState.running).toBe(true);
    });

    it("seul l'hôte peut lancer l'air hockey", async () => {
        const { guest } = await readyRoom('airHockey');
        const err = once(guest, 'room:error');
        guest.emit('airhockey:start');
        await expect(err).resolves.toMatchObject({ message: expect.stringMatching(/hôte/i) });
    });

    it("airhockey:input ne déclenche pas room:updated", async () => {
        const { host } = await readyRoom('airHockey');
        const startUpd = once(host, 'room:updated');
        host.emit('airhockey:start');
        await startUpd;

        let fired = false;
        host.once('room:updated', () => { fired = true; });
        host.emit('airhockey:input', { x: 100, y: 200 });
        await new Promise((r) => setTimeout(r, 150));
        expect(fired).toBe(false);
    });
});
