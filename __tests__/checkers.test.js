import { describe, it, expect } from 'vitest';
import {
    CHECKERS_SIZE,
    CHECKERS_DIRECTIONS,
    createInitialCheckersBoard
} from '../js/games/checkers.js';

describe('constantes', () => {
    it('CHECKERS_SIZE vaut 8', () => {
        expect(CHECKERS_SIZE).toBe(8);
    });

    it('CHECKERS_DIRECTIONS contient red et black', () => {
        expect(CHECKERS_DIRECTIONS).toHaveProperty('red');
        expect(CHECKERS_DIRECTIONS).toHaveProperty('black');
    });

    it('les rouges avancent vers le haut (rowStep négatif)', () => {
        CHECKERS_DIRECTIONS.red.forEach(([rowStep]) => {
            expect(rowStep).toBeLessThan(0);
        });
    });

    it('les noirs avancent vers le bas (rowStep positif)', () => {
        CHECKERS_DIRECTIONS.black.forEach(([rowStep]) => {
            expect(rowStep).toBeGreaterThan(0);
        });
    });
});

describe('createInitialCheckersBoard', () => {
    it('retourne une grille 8×8', () => {
        const board = createInitialCheckersBoard();
        expect(board).toHaveLength(CHECKERS_SIZE);
        board.forEach((row) => expect(row).toHaveLength(CHECKERS_SIZE));
    });

    it('les pions noirs sont dans les rangées 0-2', () => {
        const board = createInitialCheckersBoard();
        for (let row = 0; row < 3; row += 1) {
            for (let col = 0; col < CHECKERS_SIZE; col += 1) {
                const cell = board[row][col];
                if (cell !== null) {
                    expect(cell.color).toBe('black');
                    expect(cell.king).toBe(false);
                }
            }
        }
    });

    it('les pions rouges sont dans les rangées 5-7', () => {
        const board = createInitialCheckersBoard();
        for (let row = 5; row < CHECKERS_SIZE; row += 1) {
            for (let col = 0; col < CHECKERS_SIZE; col += 1) {
                const cell = board[row][col];
                if (cell !== null) {
                    expect(cell.color).toBe('red');
                    expect(cell.king).toBe(false);
                }
            }
        }
    });

    it('les rangées 3-4 (milieu) sont vides', () => {
        const board = createInitialCheckersBoard();
        for (let col = 0; col < CHECKERS_SIZE; col += 1) {
            expect(board[3][col]).toBeNull();
            expect(board[4][col]).toBeNull();
        }
    });

    it('les pièces sont uniquement sur les cases sombres (row+col impair)', () => {
        const board = createInitialCheckersBoard();
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell !== null) {
                    expect((rowIndex + colIndex) % 2).toBe(1);
                }
            });
        });
    });

    it('12 pions noirs et 12 pions rouges en position initiale', () => {
        const board = createInitialCheckersBoard();
        const cells = board.flat().filter(Boolean);
        const blacks = cells.filter((c) => c.color === 'black');
        const reds = cells.filter((c) => c.color === 'red');
        expect(blacks).toHaveLength(12);
        expect(reds).toHaveLength(12);
    });

    it('retourne des tableaux distincts à chaque appel', () => {
        const a = createInitialCheckersBoard();
        const b = createInitialCheckersBoard();
        a[0][1].color = 'mutated';
        expect(b[0][1].color).toBe('black');
    });
});
