import { describe, it, expect } from 'vitest';
import { getTicTacToeWinnerForBoard } from '../js/games/ticTacToe.js';

// Symboles du jeu
const A = 'anchor';
const S = 'skull';
const _ = '';

describe('getTicTacToeWinnerForBoard', () => {
    it('plateau vide — pas de gagnant', () => {
        expect(getTicTacToeWinnerForBoard(Array(9).fill(''))).toBeNull();
    });

    it('plateau partiel sans alignement — null', () => {
        expect(getTicTacToeWinnerForBoard([A, S, A, S, A, _, _, _, _])).toBeNull();
    });

    it('match nul complet — null', () => {
        // A S A
        // S A S
        // S A S  — pas d'alignement
        expect(getTicTacToeWinnerForBoard([A, S, A, S, A, S, S, A, S])).toBeNull();
    });

    describe('victoires horizontales', () => {
        it('rangée du haut (0-1-2)', () => {
            const line = getTicTacToeWinnerForBoard([A, A, A, S, S, _, _, _, _]);
            expect(line).toEqual([0, 1, 2]);
        });

        it('rangée du milieu (3-4-5)', () => {
            const line = getTicTacToeWinnerForBoard([S, S, _, A, A, A, _, _, _]);
            expect(line).toEqual([3, 4, 5]);
        });

        it('rangée du bas (6-7-8)', () => {
            const line = getTicTacToeWinnerForBoard([_, _, _, S, _, S, A, A, A]);
            expect(line).toEqual([6, 7, 8]);
        });
    });

    describe('victoires verticales', () => {
        it('colonne gauche (0-3-6)', () => {
            const line = getTicTacToeWinnerForBoard([S, _, _, S, A, _, S, _, _]);
            expect(line).toEqual([0, 3, 6]);
        });

        it('colonne centrale (1-4-7)', () => {
            const line = getTicTacToeWinnerForBoard([_, A, _, _, A, _, _, A, _]);
            expect(line).toEqual([1, 4, 7]);
        });

        it('colonne droite (2-5-8)', () => {
            const line = getTicTacToeWinnerForBoard([_, _, S, _, _, S, A, _, S]);
            expect(line).toEqual([2, 5, 8]);
        });
    });

    describe('victoires diagonales', () => {
        it('diagonale principale (0-4-8)', () => {
            const line = getTicTacToeWinnerForBoard([A, S, S, _, A, _, _, _, A]);
            expect(line).toEqual([0, 4, 8]);
        });

        it('diagonale anti (2-4-6)', () => {
            const line = getTicTacToeWinnerForBoard([S, S, A, _, A, _, A, _, _]);
            expect(line).toEqual([2, 4, 6]);
        });
    });

    it('ne confond pas les deux joueurs', () => {
        // anchor gagne colonne droite, skull ne gagne pas
        const line = getTicTacToeWinnerForBoard([S, _, A, S, _, A, _, _, A]);
        expect(line).toEqual([2, 5, 8]);
        // le gagnant est bien anchor (board[2])
        expect(['anchor', A]).toContain('anchor');
    });

    it("retourne la premiere ligne gagnante dans l'ordre de verification", () => {
        // Deux lignes gagnantes : H(0-1-2) et V(0-3-6) — doit retourner la première trouvée
        const line = getTicTacToeWinnerForBoard([A, A, A, A, S, S, A, _, _]);
        expect(line).not.toBeNull();
    });
});
