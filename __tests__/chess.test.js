import { describe, it, expect } from 'vitest';
import {
    CHESS_SIZE,
    createChessPiece,
    createInitialChessBoard,
    getChessOpponentColor,
    getChessKingPositionForState,
    isChessSquareUnderAttack,
    isChessKingInCheckForState,
    applyChessMoveToState,
    getChessAttackMoves,
    cloneChessStateSnapshot
} from '../js/games/chess.js';

function emptyState() {
    return {
        board: Array.from({ length: CHESS_SIZE }, () => Array(CHESS_SIZE).fill(null)),
        turn: 'white',
        enPassantTarget: null,
        lastMove: null,
        winner: null
    };
}

function stateWith(pieces) {
    const state = emptyState();
    for (const { row, col, type, color, hasMoved } of pieces) {
        state.board[row][col] = createChessPiece(type, color);
        if (hasMoved) {
            state.board[row][col].hasMoved = true;
        }
    }
    return state;
}

describe('createChessPiece', () => {
    it('crée une pièce avec type et couleur', () => {
        const piece = createChessPiece('queen', 'white');
        expect(piece.type).toBe('queen');
        expect(piece.color).toBe('white');
    });

    it('hasMoved est false par défaut', () => {
        expect(createChessPiece('pawn', 'black').hasMoved).toBe(false);
    });

    it('crée des objets indépendants', () => {
        const p1 = createChessPiece('rook', 'white');
        const p2 = createChessPiece('rook', 'white');
        p1.hasMoved = true;
        expect(p2.hasMoved).toBe(false);
    });
});

describe('createInitialChessBoard', () => {
    it('retourne un plateau 8×8', () => {
        const board = createInitialChessBoard();
        expect(board).toHaveLength(CHESS_SIZE);
        for (const row of board) {
            expect(row).toHaveLength(CHESS_SIZE);
        }
    });

    it('les rangées du milieu sont vides', () => {
        const board = createInitialChessBoard();
        for (let row = 2; row <= 5; row += 1) {
            for (let col = 0; col < CHESS_SIZE; col += 1) {
                expect(board[row][col]).toBeNull();
            }
        }
    });

    it('les pions noirs sont en rangée 1', () => {
        const board = createInitialChessBoard();
        for (let col = 0; col < CHESS_SIZE; col += 1) {
            expect(board[1][col]?.type).toBe('pawn');
            expect(board[1][col]?.color).toBe('black');
        }
    });

    it('les pions blancs sont en rangée 6', () => {
        const board = createInitialChessBoard();
        for (let col = 0; col < CHESS_SIZE; col += 1) {
            expect(board[6][col]?.type).toBe('pawn');
            expect(board[6][col]?.color).toBe('white');
        }
    });

    it('les rois sont en colonne 4', () => {
        const board = createInitialChessBoard();
        expect(board[0][4]?.type).toBe('king');
        expect(board[0][4]?.color).toBe('black');
        expect(board[7][4]?.type).toBe('king');
        expect(board[7][4]?.color).toBe('white');
    });

    it('les tours blanches sont aux angles', () => {
        const board = createInitialChessBoard();
        expect(board[7][0]?.type).toBe('rook');
        expect(board[7][7]?.type).toBe('rook');
    });
});

describe('getChessOpponentColor', () => {
    it('white → black', () => expect(getChessOpponentColor('white')).toBe('black'));
    it('black → white', () => expect(getChessOpponentColor('black')).toBe('white'));
});

describe('getChessKingPositionForState', () => {
    it('trouve le roi blanc', () => {
        const state = stateWith([{ row: 4, col: 4, type: 'king', color: 'white' }]);
        expect(getChessKingPositionForState(state, 'white')).toEqual({ row: 4, col: 4 });
    });

    it('retourne null si pas de roi', () => {
        expect(getChessKingPositionForState(emptyState(), 'white')).toBeNull();
    });

    it('ne confond pas les deux rois', () => {
        const state = stateWith([
            { row: 0, col: 4, type: 'king', color: 'black' },
            { row: 7, col: 4, type: 'king', color: 'white' }
        ]);
        expect(getChessKingPositionForState(state, 'white')).toEqual({ row: 7, col: 4 });
        expect(getChessKingPositionForState(state, 'black')).toEqual({ row: 0, col: 4 });
    });
});

describe('isChessSquareUnderAttack', () => {
    it('une tour attaque sur sa rangée', () => {
        const state = stateWith([{ row: 3, col: 0, type: 'rook', color: 'black' }]);
        expect(isChessSquareUnderAttack(state, 3, 5, 'black')).toBe(true);
    });

    it('une tour est bloquée par une pièce', () => {
        const state = stateWith([
            { row: 3, col: 0, type: 'rook', color: 'black' },
            { row: 3, col: 2, type: 'pawn', color: 'black' }
        ]);
        expect(isChessSquareUnderAttack(state, 3, 5, 'black')).toBe(false);
    });

    it('un fou attaque en diagonale', () => {
        const state = stateWith([{ row: 0, col: 0, type: 'bishop', color: 'white' }]);
        expect(isChessSquareUnderAttack(state, 4, 4, 'white')).toBe(true);
    });

    it('un cavalier attaque en L', () => {
        const state = stateWith([{ row: 4, col: 4, type: 'knight', color: 'black' }]);
        expect(isChessSquareUnderAttack(state, 2, 3, 'black')).toBe(true);
        expect(isChessSquareUnderAttack(state, 2, 5, 'black')).toBe(true);
        expect(isChessSquareUnderAttack(state, 3, 3, 'black')).toBe(false);
    });

    it('un pion blanc attaque en diagonale vers le haut', () => {
        const state = stateWith([{ row: 4, col: 3, type: 'pawn', color: 'white' }]);
        expect(isChessSquareUnderAttack(state, 3, 2, 'white')).toBe(true);
        expect(isChessSquareUnderAttack(state, 3, 4, 'white')).toBe(true);
        expect(isChessSquareUnderAttack(state, 3, 3, 'white')).toBe(false);
    });

    it("case hors portée n'est pas attaquée", () => {
        const state = stateWith([{ row: 0, col: 0, type: 'rook', color: 'black' }]);
        expect(isChessSquareUnderAttack(state, 1, 1, 'black')).toBe(false);
    });
});

describe('isChessKingInCheckForState', () => {
    it('roi non menacé', () => {
        const state = stateWith([
            { row: 7, col: 4, type: 'king', color: 'white' },
            { row: 0, col: 0, type: 'rook', color: 'black' }
        ]);
        expect(isChessKingInCheckForState(state, 'white')).toBe(false);
    });

    it('roi en échec par une tour', () => {
        const state = stateWith([
            { row: 7, col: 4, type: 'king', color: 'white' },
            { row: 0, col: 4, type: 'rook', color: 'black' }
        ]);
        expect(isChessKingInCheckForState(state, 'white')).toBe(true);
    });

    it('roi en échec par un cavalier', () => {
        const state = stateWith([
            { row: 7, col: 4, type: 'king', color: 'white' },
            { row: 5, col: 3, type: 'knight', color: 'black' }
        ]);
        expect(isChessKingInCheckForState(state, 'white')).toBe(true);
    });

    it('retourne false si pas de roi', () => {
        expect(isChessKingInCheckForState(emptyState(), 'white')).toBe(false);
    });
});

describe('applyChessMoveToState', () => {
    it('déplace une pièce', () => {
        const state = stateWith([{ row: 6, col: 4, type: 'pawn', color: 'white' }]);
        const next = applyChessMoveToState(state, 6, 4, 4, 4);
        expect(next.board[6][4]).toBeNull();
        expect(next.board[4][4]?.type).toBe('pawn');
    });

    it('change le tour après le mouvement', () => {
        const state = stateWith([{ row: 6, col: 4, type: 'pawn', color: 'white' }]);
        state.turn = 'white';
        const next = applyChessMoveToState(state, 6, 4, 5, 4);
        expect(next.turn).toBe('black');
    });

    it('marque hasMoved = true sur la pièce déplacée', () => {
        const state = stateWith([{ row: 7, col: 0, type: 'rook', color: 'white' }]);
        const next = applyChessMoveToState(state, 7, 0, 5, 0);
        expect(next.board[5][0].hasMoved).toBe(true);
    });

    it("ne modifie pas l'état source", () => {
        const state = stateWith([{ row: 6, col: 0, type: 'pawn', color: 'white' }]);
        applyChessMoveToState(state, 6, 0, 5, 0);
        expect(state.board[6][0]?.type).toBe('pawn');
    });

    it('enregistre le mouvement dans lastMove', () => {
        const state = stateWith([{ row: 6, col: 3, type: 'pawn', color: 'white' }]);
        const next = applyChessMoveToState(state, 6, 3, 5, 3);
        expect(next.lastMove).toMatchObject({ fromRow: 6, fromCol: 3, toRow: 5, toCol: 3 });
    });

    it('capture une pièce adverse', () => {
        const state = stateWith([
            { row: 5, col: 3, type: 'pawn', color: 'white' },
            { row: 4, col: 4, type: 'pawn', color: 'black' }
        ]);
        const next = applyChessMoveToState(state, 5, 3, 4, 4);
        expect(next.board[4][4]?.color).toBe('white');
    });

    it('détecte la victoire quand le roi est capturé', () => {
        const state = stateWith([
            { row: 4, col: 4, type: 'queen', color: 'white' },
            { row: 4, col: 6, type: 'king', color: 'black' }
        ]);
        const next = applyChessMoveToState(state, 4, 4, 4, 6);
        expect(next.winner).toBe('white');
    });

    it("promotion automatique d'un pion atteignant la derniere rangee", () => {
        const state = stateWith([{ row: 1, col: 2, type: 'pawn', color: 'white' }]);
        const next = applyChessMoveToState(state, 1, 2, 0, 2);
        expect(next.board[0][2]?.type).toBe('queen');
        expect(next.board[0][2]?.color).toBe('white');
    });

    it('en passant — la cible en passant est définie après avance de deux cases', () => {
        const state = stateWith([{ row: 6, col: 3, type: 'pawn', color: 'white' }]);
        const next = applyChessMoveToState(state, 6, 3, 4, 3);
        expect(next.enPassantTarget).toEqual({ row: 5, col: 3 });
    });

    it("retourne l'etat inchange si la case source est vide", () => {
        const state = emptyState();
        const next = applyChessMoveToState(state, 3, 3, 4, 4);
        expect(next).toBe(state);
    });
});
