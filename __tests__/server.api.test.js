// @vitest-environment node
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { createRequire } from 'module';
import supertest from 'supertest';

const require = createRequire(import.meta.url);
const { app, _resetRateLimitsForTest } = require('../server.js');
const request = supertest(app);

beforeEach(() => {
    _resetRateLimitsForTest();
});

const VALID_GAME_IDS = ['chess', 'connect4', 'pong', 'ticTacToe', 'battleship', 'checkers', 'airHockey', 'uno', 'bomb'];

// ─── /api/health ────────────────────────────────────────────────────────────

describe('GET /api/health', () => {
    it('retourne 200 avec ok:true', async () => {
        const res = await request.get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    it('inclut le nombre de salons (entier >= 0)', async () => {
        const res = await request.get('/api/health');
        expect(typeof res.body.rooms).toBe('number');
        expect(res.body.rooms).toBeGreaterThanOrEqual(0);
    });
});

// ─── /api/rooms ─────────────────────────────────────────────────────────────

describe('POST /api/rooms', () => {
    it('crée un salon avec un gameId valide', async () => {
        const res = await request.post('/api/rooms').send({ gameId: 'chess' });
        expect(res.status).toBe(201);
        expect(typeof res.body.code).toBe('string');
        expect(res.body.code.length).toBeGreaterThan(0);
        expect(res.body.gameId).toBe('chess');
    });

    it('le code de salon ne contient que des caractères alphanumériques', async () => {
        const res = await request.post('/api/rooms').send({ gameId: 'pong' });
        expect(res.body.code).toMatch(/^[A-Z0-9]+$/);
    });

    it('accepte tous les jeux multijoueur valides', async () => {
        for (const gameId of VALID_GAME_IDS) {
            const res = await request.post('/api/rooms').send({ gameId });
            expect(res.status, `gameId=${gameId} doit créer un salon`).toBe(201);
            expect(res.body.gameId).toBe(gameId);
        }
    });

    it('refuse un gameId inconnu → 400', async () => {
        const res = await request.post('/api/rooms').send({ gameId: 'inexistant' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('invalid-game-id');
    });

    it('refuse un gameId vide → 400', async () => {
        const res = await request.post('/api/rooms').send({ gameId: '' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('invalid-game-id');
    });

    it('refuse un body sans gameId → 400', async () => {
        const res = await request.post('/api/rooms').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('invalid-game-id');
    });

    it('refuse un body invalide (JSON malformé) → 400', async () => {
        const res = await request
            .post('/api/rooms')
            .set('Content-Type', 'application/json')
            .send('{ invalid json }');
        expect(res.status).toBe(400);
    });

    it('deux créations consécutives produisent des codes différents', async () => {
        const [r1, r2] = await Promise.all([
            request.post('/api/rooms').send({ gameId: 'connect4' }),
            request.post('/api/rooms').send({ gameId: 'connect4' })
        ]);
        expect(r1.body.code).not.toBe(r2.body.code);
    });
});

// ─── /api/rooms/:code ────────────────────────────────────────────────────────

describe('GET /api/rooms/:code', () => {
    let roomCode;

    beforeAll(async () => {
        const res = await request.post('/api/rooms').send({ gameId: 'ticTacToe' });
        roomCode = res.body.code;
    });

    it('retourne 404 pour un code inconnu', async () => {
        const res = await request.get('/api/rooms/XXXXXX');
        expect(res.status).toBe(404);
    });

    it('retourne 200 pour un salon existant', async () => {
        const res = await request.get(`/api/rooms/${roomCode}`);
        expect(res.status).toBe(200);
    });

    it('le payload contient le code et le gameId', async () => {
        const res = await request.get(`/api/rooms/${roomCode}`);
        expect(res.body.code).toBe(roomCode);
        expect(res.body.gameId).toBe('ticTacToe');
    });

    it('le code en minuscules trouve quand même le salon (normalisation uppercase)', async () => {
        const res = await request.get(`/api/rooms/${roomCode.toLowerCase()}`);
        // getRoom() fait .toUpperCase() → insensible à la casse
        expect(res.status).toBe(200);
    });
});

// ─── /api/posters/resolve ───────────────────────────────────────────────────

describe('POST /api/posters/resolve', () => {
    it('accepte un tableau vide et retourne resolutions:[]', async () => {
        const res = await request.post('/api/posters/resolve').send({ movies: [] });
        expect(res.status).toBe(200);
        expect(res.body.resolutions).toEqual([]);
    });

    it('ignore les champs movies non-tableau', async () => {
        const res = await request.post('/api/posters/resolve').send({ movies: 'pas-un-tableau' });
        expect(res.status).toBe(200);
        expect(res.body.resolutions).toEqual([]);
    });

    it('limite à 100 films max (ne plante pas sur un grand tableau)', async () => {
        const movies = Array.from({ length: 150 }, (_, i) => ({ id: i, title: `Film ${i}` }));
        const res = await request.post('/api/posters/resolve').send({ movies });
        expect(res.status).toBe(200);
        expect(res.body.resolutions).toHaveLength(100);
    });

    it('renvoie 429 après 5 requêtes depuis la même IP', async () => {
        // Le rate-limit est 5/min par IP — dépasser cette limite depuis ::ffff:127.0.0.1
        // Note: les requêtes précédentes dans ce describe ont déjà consommé du quota,
        // donc on sature et on vérifie qu'on obtient bien 429.
        let got429 = false;
        for (let i = 0; i < 8; i += 1) {
            const res = await request.post('/api/posters/resolve').send({ movies: [] });
            if (res.status === 429) {
                got429 = true;
                expect(res.body.error).toBe('too-many-requests');
                break;
            }
        }
        expect(got429).toBe(true);
    });
});

// ─── Fichiers sensibles ───────────────────────────────────────────────────────

describe('Protection des fichiers sensibles', () => {
    const sensitiveFiles = [
        '/server.js',
        '/package.json',
        '/package-lock.json',
        '/film.xlsx',
        '/posters-cache.json',
        '/render.yaml',
        '/.env'
    ];

    for (const filePath of sensitiveFiles) {
        it(`GET ${filePath} → 403`, async () => {
            const res = await request.get(filePath);
            expect(res.status).toBe(403);
        });
    }
});

// ─── Headers de sécurité ─────────────────────────────────────────────────────

describe('Headers de sécurité', () => {
    it('X-Content-Type-Options: nosniff', async () => {
        const res = await request.get('/api/health');
        expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('X-Frame-Options: SAMEORIGIN', async () => {
        const res = await request.get('/api/health');
        expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('Referrer-Policy présent', async () => {
        const res = await request.get('/api/health');
        expect(res.headers['referrer-policy']).toBeTruthy();
    });
});

// ─── Headers de cache ────────────────────────────────────────────────────────

describe('Cache-Control sur assets statiques', () => {
    it('sw.js → no-cache', async () => {
        const res = await request.get('/sw.js');
        expect(res.headers['cache-control']).toContain('no-cache');
    });

    it('style.min.css → immutable', async () => {
        const res = await request.get('/style.min.css');
        expect(res.headers['cache-control']).toContain('immutable');
        expect(res.headers['cache-control']).toContain('max-age=31536000');
    });

    it('js/main.bundle.min.js → immutable', async () => {
        const res = await request.get('/js/main.bundle.min.js');
        expect(res.headers['cache-control']).toContain('immutable');
    });
});
