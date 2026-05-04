import { describe, it, expect } from 'vitest';
import {
    CONNECT4_ROWS,
    CONNECT4_COLS,
    getConnect4Winner
} from '../js/games/connect4.js';

function emptyBoard() {
    return Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(null));
}

function dropToken(board, col, token) {
    for (let row = CONNECT4_ROWS - 1; row >= 0; row -= 1) {
        if (!board[row][col]) {
            board[row][col] = token;
            return row;
        }
    }
    return -1;
}

describe('Connect4 — constantes', () => {
    it('CONNECT4_ROWS = 6', () => expect(CONNECT4_ROWS).toBe(6));
    it('CONNECT4_COLS = 7', () => expect(CONNECT4_COLS).toBe(7));
});

describe('getConnect4Winner', () => {
    it('retourne null sur un plateau vide', () => {
        expect(getConnect4Winner(emptyBoard(), 'player')).toBeNull();
    });

    it('retourne null si moins de 4 jetons alignés', () => {
        const board = emptyBoard();
        dropToken(board, 0, 'player');
        dropToken(board, 1, 'player');
        dropToken(board, 2, 'player');
        expect(getConnect4Winner(board, 'player')).toBeNull();
    });

    it('détecte un alignement horizontal', () => {
        const board = emptyBoard();
        [0, 1, 2, 3].forEach((col) => dropToken(board, col, 'player'));
        const line = getConnect4Winner(board, 'player');
        expect(line).not.toBeNull();
        expect(line).toHaveLength(4);
    });

    it('les cases horizontales gagnantes sont sur la même rangée', () => {
        const board = emptyBoard();
        [3, 4, 5, 6].forEach((col) => dropToken(board, col, 'ai'));
        const line = getConnect4Winner(board, 'ai');
        const rows = line.map(([r]) => r);
        expect(new Set(rows).size).toBe(1);
    });

    it('détecte un alignement vertical', () => {
        const board = emptyBoard();
        [0, 1, 2, 3].forEach(() => dropToken(board, 2, 'player'));
        const line = getConnect4Winner(board, 'player');
        expect(line).not.toBeNull();
        expect(line).toHaveLength(4);
    });

    it('les cases verticales gagnantes sont dans la même colonne', () => {
        const board = emptyBoard();
        [0, 1, 2, 3].forEach(() => dropToken(board, 4, 'ai'));
        const line = getConnect4Winner(board, 'ai');
        const cols = line.map(([, c]) => c);
        expect(new Set(cols).size).toBe(1);
    });

    it('détecte une diagonale descendante (↘)', () => {
        const board = emptyBoard();
        // Remplir pour aligner la diagonale : (2,0),(3,1),(4,2),(5,3)
        // col 0 : 1 pion (row 5 libre pour player → drop)
        // col 1 : 2 pions de remplissage + player
        // col 2 : 3 pions de remplissage + player
        // col 3 : 4 pions de remplissage + player
        dropToken(board, 0, 'player');                       // row 5
        dropToken(board, 1, 'ai'); dropToken(board, 1, 'player');   // rows 5,4
        dropToken(board, 2, 'ai'); dropToken(board, 2, 'ai'); dropToken(board, 2, 'player'); // rows 5,4,3
        dropToken(board, 3, 'ai'); dropToken(board, 3, 'ai'); dropToken(board, 3, 'ai'); dropToken(board, 3, 'player'); // rows 5,4,3,2
        const line = getConnect4Winner(board, 'player');
        expect(line).not.toBeNull();
        expect(line).toHaveLength(4);
    });

    it('ne confond pas les jetons adverses', () => {
        const board = emptyBoard();
        [0, 1, 2, 3].forEach((col) => dropToken(board, col, 'player'));
        expect(getConnect4Winner(board, 'ai')).toBeNull();
    });

    it('retourne exactement 4 cases dans la ligne gagnante', () => {
        const board = emptyBoard();
        [0, 1, 2, 3, 4].forEach((col) => dropToken(board, col, 'player'));
        const line = getConnect4Winner(board, 'player');
        expect(line).toHaveLength(4);
    });

    it('les cases gagnantes sont des paires [ligne, colonne]', () => {
        const board = emptyBoard();
        [0, 1, 2, 3].forEach((col) => dropToken(board, col, 'player'));
        const line = getConnect4Winner(board, 'player');
        for (const cell of line) {
            expect(cell).toHaveLength(2);
            expect(Number.isInteger(cell[0])).toBe(true);
            expect(Number.isInteger(cell[1])).toBe(true);
        }
    });
});
