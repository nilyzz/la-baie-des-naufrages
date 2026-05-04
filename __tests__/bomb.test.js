import { describe, it, expect } from 'vitest';
import {
    pickRandomBombSyllable,
    createBombLocalState,
    cloneBombState,
    getBombLocalRulesText
} from '../js/games/bomb.js';

describe('pickRandomBombSyllable', () => {
    it('retourne une chaîne non vide', () => {
        const syllable = pickRandomBombSyllable();
        expect(typeof syllable).toBe('string');
        expect(syllable.length).toBeGreaterThan(0);
    });

    it('retourne seulement des lettres minuscules', () => {
        for (let i = 0; i < 20; i += 1) {
            expect(pickRandomBombSyllable()).toMatch(/^[a-z]+$/);
        }
    });

    it('produit des valeurs variées sur plusieurs appels', () => {
        const results = new Set();
        for (let i = 0; i < 100; i += 1) {
            results.add(pickRandomBombSyllable());
        }
        expect(results.size).toBeGreaterThan(5);
    });
});

describe('createBombLocalState', () => {
    it('retourne deux joueurs locaux', () => {
        const state = createBombLocalState();
        expect(state.players).toHaveLength(2);
        expect(state.players[0].id).toBe('local-1');
        expect(state.players[1].id).toBe('local-2');
    });

    it('démarre au tour du joueur 0', () => {
        const state = createBombLocalState();
        expect(state.currentPlayerIndex).toBe(0);
    });

    it('currentSyllable est une syllabe valide', () => {
        const state = createBombLocalState();
        expect(state.currentSyllable).toMatch(/^[a-z]+$/);
    });

    it('aucun gagnant au départ', () => {
        const state = createBombLocalState();
        expect(state.winner).toBeNull();
    });

    it('usedWords est vide au départ', () => {
        const state = createBombLocalState();
        expect(state.usedWords).toHaveLength(0);
    });

    it('turnDeadlineAt est dans le futur', () => {
        const before = Date.now();
        const state = createBombLocalState();
        expect(state.turnDeadlineAt).toBeGreaterThan(before);
    });

    it('round démarre à 1', () => {
        expect(createBombLocalState().round).toBe(1);
    });
});

describe('cloneBombState', () => {
    it('retourne null si l\'entrée est null', () => {
        expect(cloneBombState(null)).toBeNull();
    });

    it('retourne un objet indépendant', () => {
        const state = createBombLocalState();
        const clone = cloneBombState(state);
        clone.currentSyllable = 'zz';
        expect(state.currentSyllable).not.toBe('zz');
    });

    it('copie les joueurs en profondeur', () => {
        const state = createBombLocalState();
        const clone = cloneBombState(state);
        clone.players[0].eliminated = true;
        expect(state.players[0].eliminated).toBe(false);
    });

    it('copie les usedWords en profondeur', () => {
        const state = createBombLocalState();
        state.usedWords.push({ value: 'test', normalized: 'test', by: 'local-1' });
        const clone = cloneBombState(state);
        clone.usedWords[0].value = 'mutated';
        expect(state.usedWords[0].value).toBe('test');
    });

    it('préserve toutes les propriétés scalaires', () => {
        const state = createBombLocalState();
        const clone = cloneBombState(state);
        expect(clone.currentPlayerIndex).toBe(state.currentPlayerIndex);
        expect(clone.currentSyllable).toBe(state.currentSyllable);
        expect(clone.winner).toBe(state.winner);
        expect(clone.turnCount).toBe(state.turnCount);
        expect(clone.round).toBe(state.round);
    });
});

describe('getBombLocalRulesText', () => {
    it('retourne une chaîne non vide', () => {
        const text = getBombLocalRulesText();
        expect(typeof text).toBe('string');
        expect(text.length).toBeGreaterThan(0);
    });
});
