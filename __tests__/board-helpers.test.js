import { describe, it, expect } from 'vitest';
import {
    CHESS_SIZE,
    isInsideGameGrid,
    getBoardMoveAnimationMetadata,
    getBoardMoveAnimationKey,
    isBoardCaptureCell
} from '../js/games/_shared/board-helpers.js';

describe('board-helpers', () => {
    describe('CHESS_SIZE', () => {
        it('vaut 8', () => {
            expect(CHESS_SIZE).toBe(8);
        });
    });

    describe('isInsideGameGrid', () => {
        it('accepte les cases valides', () => {
            expect(isInsideGameGrid(0, 0)).toBe(true);
            expect(isInsideGameGrid(7, 7)).toBe(true);
            expect(isInsideGameGrid(3, 5)).toBe(true);
        });

        it('refuse les cases hors grille', () => {
            expect(isInsideGameGrid(-1, 0)).toBe(false);
            expect(isInsideGameGrid(0, -1)).toBe(false);
            expect(isInsideGameGrid(8, 0)).toBe(false);
            expect(isInsideGameGrid(0, 8)).toBe(false);
        });

        it('respecte la taille personnalisée', () => {
            expect(isInsideGameGrid(5, 5, 6)).toBe(true);
            expect(isInsideGameGrid(6, 0, 6)).toBe(false);
        });
    });

    describe('getBoardMoveAnimationKey', () => {
        it('retourne chaîne vide si pas de dernier mouvement', () => {
            expect(getBoardMoveAnimationKey(null)).toBe('');
            expect(getBoardMoveAnimationKey(undefined)).toBe('');
        });

        it('retourne une clé string pour un mouvement valide', () => {
            const key = getBoardMoveAnimationKey({ fromRow: 1, fromCol: 2, toRow: 3, toCol: 4 });
            expect(typeof key).toBe('string');
            expect(key.length).toBeGreaterThan(0);
        });

        it('produit des clés distinctes pour des mouvements différents', () => {
            const k1 = getBoardMoveAnimationKey({ fromRow: 0, fromCol: 0, toRow: 1, toCol: 0 });
            const k2 = getBoardMoveAnimationKey({ fromRow: 0, fromCol: 0, toRow: 2, toCol: 0 });
            expect(k1).not.toBe(k2);
        });
    });

    describe('getBoardMoveAnimationMetadata', () => {
        it('retourne vide si pas de dernier mouvement', () => {
            const { className, style } = getBoardMoveAnimationMetadata(null, 3, 3);
            expect(className).toBe('');
            expect(style).toBe('');
        });

        it('retourne vide si la case ne correspond pas à la destination', () => {
            const move = { fromRow: 0, fromCol: 0, toRow: 1, toCol: 0 };
            const { className } = getBoardMoveAnimationMetadata(move, 0, 0);
            expect(className).toBe('');
        });

        it('retourne is-moving pour la case de destination', () => {
            const move = { fromRow: 6, fromCol: 3, toRow: 4, toCol: 3, pieceType: 'pawn' };
            const { className } = getBoardMoveAnimationMetadata(move, 4, 3);
            expect(className).toContain('is-moving');
        });

        it('ajoute is-capture-move si le mouvement est une capture', () => {
            const move = {
                fromRow: 5, fromCol: 2, toRow: 4, toCol: 3,
                pieceType: 'pawn', capture: { row: 4, col: 3 }
            };
            const { className } = getBoardMoveAnimationMetadata(move, 4, 3);
            expect(className).toContain('is-capture-move');
        });

        it('ajoute is-knight-move pour un cavalier', () => {
            const move = {
                fromRow: 7, fromCol: 1, toRow: 5, toCol: 2, pieceType: 'knight'
            };
            const { className } = getBoardMoveAnimationMetadata(move, 5, 2);
            expect(className).toContain('is-knight-move');
        });
    });

    describe('isBoardCaptureCell', () => {
        it('retourne false si pas de capture', () => {
            expect(isBoardCaptureCell(null, 3, 4)).toBe(false);
            expect(isBoardCaptureCell({ capture: null }, 3, 4)).toBe(false);
        });

        it('retourne true si la case est la case capturée', () => {
            const move = { capture: { row: 3, col: 4 } };
            expect(isBoardCaptureCell(move, 3, 4)).toBe(true);
        });

        it('retourne false si la case ne correspond pas', () => {
            const move = { capture: { row: 3, col: 4 } };
            expect(isBoardCaptureCell(move, 2, 4)).toBe(false);
            expect(isBoardCaptureCell(move, 3, 5)).toBe(false);
        });
    });
});
