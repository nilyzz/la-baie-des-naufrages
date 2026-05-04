import { beforeEach, describe, it, expect } from 'vitest';
import { loadSession, saveSession, clearSession, registerActivity } from '../js/core/session.js';
import { SESSION_KEY, SESSION_TIMEOUT_MS } from '../js/core/constants.js';

beforeEach(() => {
    localStorage.clear();
});

describe('loadSession', () => {
    it('retourne null si localStorage vide', () => {
        expect(loadSession()).toBeNull();
    });

    it('retourne null si la clé de session est absente', () => {
        localStorage.setItem('autre-clé', '{}');
        expect(loadSession()).toBeNull();
    });

    it('retourne null si le JSON est invalide', () => {
        localStorage.setItem(SESSION_KEY, 'pas-du-json{{{');
        expect(loadSession()).toBeNull();
    });

    it('retourne null si authenticated est absent', () => {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ lastActivity: Date.now() }));
        expect(loadSession()).toBeNull();
    });

    it('retourne null si lastActivity est absent', () => {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ authenticated: true }));
        expect(loadSession()).toBeNull();
    });

    it('retourne la session si elle est valide et récente', () => {
        const session = { authenticated: true, lastActivity: Date.now(), pseudo: 'Marin' };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        const loaded = loadSession();
        expect(loaded).not.toBeNull();
        expect(loaded.pseudo).toBe('Marin');
    });

    it('retourne null et efface si la session est expirée', () => {
        const oldActivity = Date.now() - SESSION_TIMEOUT_MS - 1000;
        const session = { authenticated: true, lastActivity: oldActivity };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        expect(loadSession()).toBeNull();
        expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });
});

describe('saveSession', () => {
    it('persiste la session dans localStorage', () => {
        saveSession({ pseudo: 'Corsaire' });
        expect(localStorage.getItem(SESSION_KEY)).not.toBeNull();
    });

    it('la session sauvegardée est lisible par loadSession', () => {
        saveSession({ pseudo: 'Corsaire' });
        const loaded = loadSession();
        expect(loaded).not.toBeNull();
        expect(loaded.pseudo).toBe('Corsaire');
    });

    it('authenticated est toujours true après saveSession', () => {
        saveSession({});
        expect(loadSession()?.authenticated).toBe(true);
    });

    it('met à jour lastActivity à maintenant', () => {
        const before = Date.now();
        saveSession({});
        const after = Date.now();
        const loaded = loadSession();
        expect(loaded.lastActivity).toBeGreaterThanOrEqual(before);
        expect(loaded.lastActivity).toBeLessThanOrEqual(after);
    });

    it('merge les propriétés avec la session existante', () => {
        saveSession({ pseudo: 'Marin', score: 42 });
        saveSession({ score: 99 });
        const loaded = loadSession();
        expect(loaded.pseudo).toBe('Marin');
        expect(loaded.score).toBe(99);
    });

    it('définit lastDestination par défaut à "services"', () => {
        saveSession({});
        expect(loadSession()?.lastDestination).toBe('services');
    });
});

describe('clearSession', () => {
    it('supprime la session du localStorage', () => {
        saveSession({ pseudo: 'Test' });
        clearSession();
        expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it('loadSession retourne null après clearSession', () => {
        saveSession({});
        clearSession();
        expect(loadSession()).toBeNull();
    });
});

describe('registerActivity', () => {
    it('ne fait rien si aucune session active', () => {
        registerActivity();
        expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it('met à jour lastActivity sans changer les autres propriétés', () => {
        saveSession({ pseudo: 'Navigateur', lastActivity: Date.now() - 60_000 });
        const before = loadSession().lastActivity;
        registerActivity();
        const after = loadSession().lastActivity;
        expect(after).toBeGreaterThan(before);
        expect(loadSession().pseudo).toBe('Navigateur');
    });
});
