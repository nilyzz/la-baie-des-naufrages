// Game module — Échecs (Chess), solo/duo/multijoueur avec IA minimax.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import {
    CHESS_SIZE,
    isInsideGameGrid,
    getBoardMoveAnimationMetadata,
    getBoardMoveAnimationKey,
    isBoardCaptureCell,
    spawnBoardCaptureParticles
} from './_shared/board-helpers.js';
import { closeGameOverModal } from '../core/modals.js';
import {
    getMultiplayerActiveRoom,
    getMultiplayerSocket
} from '../multiplayer/state.js';
import { setMultiplayerStatus } from '../multiplayer/status.js';

export { CHESS_SIZE };
export const CHESS_PIECES = {
    pawn: { white: '\u2659', black: '\u265F' },
    rook: { white: '\u2656', black: '\u265C' },
    knight: { white: '\u2658', black: '\u265E' },
    bishop: { white: '\u2657', black: '\u265D' },
    queen: { white: '\u2655', black: '\u265B' },
    king: { white: '\u2654', black: '\u265A' }
};

let chessState = null;
let chessSelectedSquare = null;
let chessMode = 'solo';
let chessDragState = null;
let chessSuppressNextClick = false;
let chessAiTimeout = null;
let chessLastMoveResetTimer = null;
let chessLastMoveAnimationKey = '';
let chessLastFinishedStateKey = '';
let chessLastCaptureFxKey = '';
let chessMenuVisible = true;
let chessMenuShowingRules = false;
let chessMenuClosing = false;
let chessMenuEntering = false;
let chessOutcomeMenuTimer = null;
let chessOutcomeMenuEnterTimer = null;

let activeGameTabAccessor = () => null;
export function setChessActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        chessGame: $('chessGame'),
        chessBoard: $('chessBoard'),
        chessTurnDisplay: $('chessTurnDisplay'),
        chessStatusDisplay: $('chessStatusDisplay'),
        chessHelpText: $('chessHelpText'),
        chessTable: $('chessTable'),
        chessMenuOverlay: $('chessMenuOverlay'),
        chessMenuEyebrow: $('chessMenuEyebrow'),
        chessMenuTitle: $('chessMenuTitle'),
        chessMenuText: $('chessMenuText'),
        chessMenuActionButton: $('chessMenuActionButton'),
        chessMenuRulesButton: $('chessMenuRulesButton'),
        chessModeButtons: document.querySelectorAll('[data-chess-mode]')
    };
}

// --- Multiplayer helpers ---
export function isMultiplayerChessActive() {
    const room = getMultiplayerActiveRoom();
    return room?.gameId === 'chess' && Boolean(room?.gameState);
}

export function getMultiplayerChessRole() {
    return getMultiplayerActiveRoom()?.players?.find((player) => player.isYou)?.symbol || null;
}

// --- Chess core ---
export function createChessPiece(type, color) {
    return { type, color, hasMoved: false };
}

export function createInitialChessBoard() {
    const board = Array.from({ length: CHESS_SIZE }, () => Array.from({ length: CHESS_SIZE }, () => null));
    const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

    backRank.forEach((type, col) => {
        board[0][col] = createChessPiece(type, 'black');
        board[1][col] = createChessPiece('pawn', 'black');
        board[6][col] = createChessPiece('pawn', 'white');
        board[7][col] = createChessPiece(type, 'white');
    });

    return board;
}

export function initializeChess() {
    if (getMultiplayerActiveRoom()?.gameId === 'chess') {
        syncMultiplayerChessState();
        return;
    }

    chessLastCaptureFxKey = '';
    if (chessLastMoveResetTimer) {
        window.clearTimeout(chessLastMoveResetTimer);
        chessLastMoveResetTimer = null;
    }
    if (chessOutcomeMenuTimer) {
        window.clearTimeout(chessOutcomeMenuTimer);
        chessOutcomeMenuTimer = null;
    }
    if (chessOutcomeMenuEnterTimer) {
        window.clearTimeout(chessOutcomeMenuEnterTimer);
        chessOutcomeMenuEnterTimer = null;
    }
    if (chessAiTimeout) {
        window.clearTimeout(chessAiTimeout);
        chessAiTimeout = null;
    }
    chessState = {
        board: createInitialChessBoard(),
        turn: 'white',
        winner: null,
        lastMove: null
    };
    chessLastMoveAnimationKey = '';
    chessSelectedSquare = null;
    chessMenuVisible = true;
    chessMenuShowingRules = false;
    chessMenuClosing = false;
    chessMenuEntering = false;
    renderChessMenu();
    renderChess();
}

export function getChessRulesText() {
    return "Les pièces se déplacent selon les règles classiques. La promotion devient une reine et le roque est disponible. La prise en passant n'est pas gérée ici.";
}

export function getChessReadySummary() {
    const multiplayerActiveRoom = getMultiplayerActiveRoom();
    const readyCount = Number(multiplayerActiveRoom?.chessReadyCount || 0);
    const readyTotal = Number(multiplayerActiveRoom?.chessReadyTotal || multiplayerActiveRoom?.playerCount || 0);
    return `${readyCount}/${readyTotal || 0}`;
}

export function getChessMenuOutcomeContent() {
    if (!chessState?.winner) {
        return null;
    }

    if (isMultiplayerChessActive()) {
        return chessState.winner === getMultiplayerChessRole()
            ? {
                eyebrow: 'Victoire',
                title: 'Tu remportes la partie',
                text: '\u00c9chec et mat. Tu peux te remettre pr\u00eat pour relancer une manche.'
            }
            : {
                eyebrow: 'D\u00e9faite',
                title: "C'est perdu",
                text: "\u00c9chec et mat. L'adversaire remporte la partie. Tu peux te remettre pr\u00eat pour la suivante."
            };
    }

    if (chessMode === 'solo') {
        return chessState.winner === 'white'
            ? {
                eyebrow: 'Victoire',
                title: 'Tu remportes la partie',
                text: 'Le roi adverse tombe. Tu peux relancer une nouvelle partie ou relire les règles.'
            }
            : {
                eyebrow: 'D\u00e9faite',
                title: "C'est perdu",
                text: 'Ton roi est mat. Relance une partie pour retenter ta chance.'
            };
    }

    return {
        eyebrow: 'Fin de partie',
        title: chessState.winner === 'white' ? 'Blancs gagnent' : 'Noirs gagnent',
        text: `\u00c9chec et mat. ${chessState.winner === 'white' ? 'Les Blancs' : 'Les Noirs'} remportent la partie.`
    };
}

export function revealChessOutcomeMenuWithDelay() {
    if (chessOutcomeMenuTimer) {
        window.clearTimeout(chessOutcomeMenuTimer);
        chessOutcomeMenuTimer = null;
    }
    if (chessOutcomeMenuEnterTimer) {
        window.clearTimeout(chessOutcomeMenuEnterTimer);
        chessOutcomeMenuEnterTimer = null;
    }

    chessMenuVisible = false;
    chessMenuShowingRules = false;
    chessMenuClosing = false;
    chessMenuEntering = false;
    renderChessMenu();

    chessOutcomeMenuTimer = window.setTimeout(() => {
        chessOutcomeMenuTimer = null;
        chessMenuVisible = true;
        chessMenuShowingRules = false;
        chessMenuClosing = false;
        chessMenuEntering = true;
        renderChessMenu();

        chessOutcomeMenuEnterTimer = window.setTimeout(() => {
            chessOutcomeMenuEnterTimer = null;
            chessMenuEntering = false;
            renderChessMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }, 420);
}

export function renderChessMenu() {
    const { chessMenuOverlay, chessTable, chessMenuEyebrow, chessMenuTitle, chessMenuText, chessMenuActionButton, chessMenuRulesButton } = dom();
    if (!chessMenuOverlay || !chessTable) {
        return;
    }

    syncGameMenuOverlayBounds(chessMenuOverlay, chessTable);
    const multiplayerActiveRoom = getMultiplayerActiveRoom();
    const isOnline = multiplayerActiveRoom?.gameId === 'chess';
    const roomStarted = Boolean(multiplayerActiveRoom?.chessStarted);
    const currentPlayer = multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
    const outcomeContent = getChessMenuOutcomeContent();
    const hasResult = Boolean(outcomeContent);
    const readyLabel = currentPlayer?.chessReady ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat';
    const actionLabel = isOnline
        ? `${readyLabel} (${getChessReadySummary()})`
        : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
    const baseText = isOnline
        ? "Quand les deux joueurs sont pr\u00eats, la partie d'\u00e9checs commence automatiquement."
        : "Installe les pièces et choisis ton mode avant d'engager la partie.";

    chessMenuVisible = isOnline ? (!roomStarted || hasResult) : chessMenuVisible;

    chessMenuOverlay.classList.toggle('hidden', !chessMenuVisible);
    chessMenuOverlay.classList.toggle('is-closing', chessMenuClosing);
    chessMenuOverlay.classList.toggle('is-entering', chessMenuEntering);
    chessTable.classList.toggle('is-menu-open', chessMenuVisible);

    if (!chessMenuVisible) {
        return;
    }

    if (chessMenuEyebrow) {
        chessMenuEyebrow.textContent = chessMenuShowingRules ? 'R\u00e8gles' : (outcomeContent?.eyebrow || 'Baie strat\u00e9gique');
    }
    if (chessMenuTitle) {
        chessMenuTitle.textContent = chessMenuShowingRules ? 'Rappel rapide' : (outcomeContent?.title || '\u00c9checs');
    }
    if (chessMenuText) {
        chessMenuText.textContent = chessMenuShowingRules
            ? getChessRulesText()
            : (outcomeContent?.text || baseText);
    }
    if (chessMenuActionButton) {
        chessMenuActionButton.textContent = chessMenuShowingRules ? 'Retour' : actionLabel;
    }
    if (chessMenuRulesButton) {
        chessMenuRulesButton.textContent = 'R\u00e8gles';
        chessMenuRulesButton.hidden = chessMenuShowingRules;
    }
}

export function startChessLaunchSequence() {
    chessMenuClosing = true;
    renderChessMenu();
    window.setTimeout(() => {
        chessMenuClosing = false;
        chessMenuVisible = false;
        chessMenuShowingRules = false;
        chessMenuEntering = false;
        renderChessMenu();
        renderChess();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function isChessAiTurn() {
    return chessMode === 'solo' && chessState && !chessState.winner && chessState.turn === 'black';
}

export function getChessOpponentColor(color) {
    return color === 'white' ? 'black' : 'white';
}

export function getChessKingPositionForState(state, color) {
    for (let row = 0; row < CHESS_SIZE; row += 1) {
        for (let col = 0; col < CHESS_SIZE; col += 1) {
            const piece = state?.board?.[row]?.[col];
            if (piece?.type === 'king' && piece.color === color) {
                return { row, col };
            }
        }
    }

    return null;
}

export function isChessSquareUnderAttack(state, targetRow, targetCol, attackerColor) {
    for (let row = 0; row < CHESS_SIZE; row += 1) {
        for (let col = 0; col < CHESS_SIZE; col += 1) {
            const piece = state?.board?.[row]?.[col];
            if (!piece || piece.color !== attackerColor) {
                continue;
            }

            if (getChessAttackMoves(state, row, col).some((move) => move.row === targetRow && move.col === targetCol)) {
                return true;
            }
        }
    }

    return false;
}

export function isChessKingInCheckForState(state, color) {
    const kingPosition = getChessKingPositionForState(state, color);
    if (!kingPosition) {
        return false;
    }

    return isChessSquareUnderAttack(state, kingPosition.row, kingPosition.col, getChessOpponentColor(color));
}

export function canChessCastle(state, row, col, side) {
    const king = state?.board?.[row]?.[col];
    if (!king || king.type !== 'king' || king.hasMoved) {
        return null;
    }

    const rookCol = side === 'king' ? CHESS_SIZE - 1 : 0;
    const rook = state.board[row]?.[rookCol];
    if (!rook || rook.type !== 'rook' || rook.color !== king.color || rook.hasMoved) {
        return null;
    }

    const direction = side === 'king' ? 1 : -1;
    const targetCol = col + (direction * 2);

    for (let nextCol = col + direction; nextCol !== rookCol; nextCol += direction) {
        if (state.board[row][nextCol]) {
            return null;
        }
    }

    if (isChessKingInCheckForState(state, king.color)) {
        return null;
    }

    const opponentColor = getChessOpponentColor(king.color);
    for (let step = 1; step <= 2; step += 1) {
        const passingCol = col + (direction * step);
        if (isChessSquareUnderAttack(state, row, passingCol, opponentColor)) {
            return null;
        }
    }

    return { row, col: targetCol, castle: side };
}

export function shouldFlipChessBoardPerspective() {
    return isMultiplayerChessActive() && getMultiplayerChessRole() === 'black';
}

export function getDisplayChessPosition(row, col) {
    if (!shouldFlipChessBoardPerspective()) {
        return { row, col };
    }

    return {
        row: CHESS_SIZE - 1 - row,
        col: CHESS_SIZE - 1 - col
    };
}

export function getBoardChessPosition(displayRow, displayCol) {
    if (!shouldFlipChessBoardPerspective()) {
        return { row: displayRow, col: displayCol };
    }

    return {
        row: CHESS_SIZE - 1 - displayRow,
        col: CHESS_SIZE - 1 - displayCol
    };
}


export function cloneChessStateSnapshot(state) {
    return {
        ...state,
        board: state.board.map((row) => row.map((piece) => (piece ? { ...piece } : null))),
        lastMove: state.lastMove
            ? {
                ...state.lastMove,
                capture: state.lastMove.capture ? { ...state.lastMove.capture } : null
            }
            : null
    };
}

export function applyChessMoveToState(state, fromRow, fromCol, toRow, toCol) {
    const movingPiece = state.board[fromRow][fromCol];
    if (!movingPiece) {
        return state;
    }

    const nextState = cloneChessStateSnapshot(state);
    const nextPiece = { ...movingPiece, hasMoved: true };
    const capturedPiece = nextState.board[toRow][toCol];
    nextState.board[toRow][toCol] = nextPiece;
    nextState.board[fromRow][fromCol] = null;

    if (nextPiece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
        const rookFromCol = toCol > fromCol ? CHESS_SIZE - 1 : 0;
        const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
        const rookPiece = nextState.board[toRow][rookFromCol];
        if (rookPiece) {
            nextState.board[toRow][rookToCol] = { ...rookPiece, hasMoved: true };
            nextState.board[toRow][rookFromCol] = null;
        }
    }

    if (nextPiece.type === 'pawn' && (toRow === 0 || toRow === CHESS_SIZE - 1)) {
        nextState.board[toRow][toCol] = createChessPiece('queen', nextPiece.color);
        nextState.board[toRow][toCol].hasMoved = true;
    }

    nextState.lastMove = {
        fromRow,
        fromCol,
        toRow,
        toCol,
        pieceType: movingPiece.type,
        capture: capturedPiece ? { row: toRow, col: toCol } : null,
        captureColor: capturedPiece?.color || null
    };
    nextState.turn = movingPiece.color === 'white' ? 'black' : 'white';
    nextState.winner = capturedPiece?.type === 'king' ? movingPiece.color : null;

    return nextState;
}

export function getChessPieceGlyph(type) {
    switch (type) {
    case 'pawn':
        return '\u265F';
    case 'rook':
        return '\u265C';
    case 'knight':
        return '\u265E';
    case 'bishop':
        return '\u265D';
    case 'queen':
        return '\u265B';
    case 'king':
        return '\u265A';
    default:
        return '';
    }
}

export function getChessAttackMoves(state, row, col) {
    const piece = state?.board?.[row]?.[col];
    if (!piece) {
        return [];
    }

    const moves = [];
    const addMove = (nextRow, nextCol) => {
        if (!isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
            return;
        }
        const target = state.board[nextRow][nextCol];
        if (!target || target.color !== piece.color) {
            moves.push({ row: nextRow, col: nextCol });
        }
    };
    const addSlideMoves = (directions) => {
        directions.forEach(([rowStep, colStep]) => {
            let nextRow = row + rowStep;
            let nextCol = col + colStep;

            while (isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
                const target = state.board[nextRow][nextCol];
                if (!target) {
                    moves.push({ row: nextRow, col: nextCol });
                } else {
                    if (target.color !== piece.color) {
                        moves.push({ row: nextRow, col: nextCol });
                    }
                    break;
                }
                nextRow += rowStep;
                nextCol += colStep;
            }
        });
    };

    if (piece.type === 'pawn') {
        const direction = piece.color === 'white' ? -1 : 1;
        [-1, 1].forEach((deltaCol) => {
            const attackRow = row + direction;
            const attackCol = col + deltaCol;
            if (isInsideGameGrid(attackRow, attackCol, CHESS_SIZE)) {
                moves.push({ row: attackRow, col: attackCol });
            }
        });
        return moves;
    }

    if (piece.type === 'rook') {
        addSlideMoves([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        return moves;
    }

    if (piece.type === 'bishop') {
        addSlideMoves([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
        return moves;
    }

    if (piece.type === 'queen') {
        addSlideMoves([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
        return moves;
    }

    if (piece.type === 'knight') {
        [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([rowStep, colStep]) => addMove(row + rowStep, col + colStep));
        return moves;
    }

    if (piece.type === 'king') {
        [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([rowStep, colStep]) => addMove(row + rowStep, col + colStep));
    }

    return moves;
}

export function getChessKingPosition(color) {
    return getChessKingPositionForState(chessState, color);
}

export function isChessKingInCheck(color) {
    return isChessKingInCheckForState(chessState, color);
}

export function getChessMovesForState(state, row, col) {
    const piece = state?.board?.[row]?.[col];

    if (!piece || piece.color !== state.turn || state.winner) {
        return [];
    }

    const moves = [];
    const addMove = (nextRow, nextCol) => {
        if (!isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
            return;
        }

        const target = state.board[nextRow][nextCol];
        if (!target || target.color !== piece.color) {
            moves.push({ row: nextRow, col: nextCol });
        }
    };
    const addSlideMoves = (directions) => {
        directions.forEach(([rowStep, colStep]) => {
            let nextRow = row + rowStep;
            let nextCol = col + colStep;

            while (isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
                const target = state.board[nextRow][nextCol];

                if (!target) {
                    moves.push({ row: nextRow, col: nextCol });
                } else {
                    if (target.color !== piece.color) {
                        moves.push({ row: nextRow, col: nextCol });
                    }
                    break;
                }

                nextRow += rowStep;
                nextCol += colStep;
            }
        });
    };

    if (piece.type === 'pawn') {
        const direction = piece.color === 'white' ? -1 : 1;
        if (isInsideGameGrid(row + direction, col, CHESS_SIZE) && !state.board[row + direction][col]) {
            moves.push({ row: row + direction, col });
            const doubleRow = row + direction * 2;
            const startRow = piece.color === 'white' ? 6 : 1;
            if (row === startRow && !state.board[doubleRow][col]) {
                moves.push({ row: doubleRow, col });
            }
        }

        [-1, 1].forEach((deltaCol) => {
            const attackRow = row + direction;
            const attackCol = col + deltaCol;
            if (!isInsideGameGrid(attackRow, attackCol, CHESS_SIZE)) {
                return;
            }
            const target = state.board[attackRow][attackCol];
            if (target && target.color !== piece.color) {
                moves.push({ row: attackRow, col: attackCol });
            }
        });
    }

    if (piece.type === 'rook') {
        addSlideMoves([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    }

    if (piece.type === 'bishop') {
        addSlideMoves([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    }

    if (piece.type === 'queen') {
        addSlideMoves([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
    }

    if (piece.type === 'knight') {
        [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([rowStep, colStep]) => addMove(row + rowStep, col + colStep));
    }

    if (piece.type === 'king') {
        [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([rowStep, colStep]) => addMove(row + rowStep, col + colStep));
    }

    const kingPiece = piece.type === 'king' ? piece : null;
    if (kingPiece) {
        const kingSideCastle = canChessCastle(state, row, col, 'king');
        const queenSideCastle = canChessCastle(state, row, col, 'queen');
        if (kingSideCastle) {
            moves.push(kingSideCastle);
        }
        if (queenSideCastle) {
            moves.push(queenSideCastle);
        }
    }

    return moves.filter((move) => {
        const previewState = applyChessMoveToState(state, row, col, move.row, move.col);
        return !isChessKingInCheckForState(previewState, piece.color);
    });
}

export function getChessMoves(row, col) {
    return getChessMovesForState(chessState, row, col);
}

export function canInteractWithChessPiece(row, col) {
    const piece = chessState?.board?.[row]?.[col];
    if (!piece || chessState?.winner) {
        return false;
    }

    if (isMultiplayerChessActive()) {
        return chessState.turn === getMultiplayerChessRole() && piece.color === chessState.turn;
    }

    return !isChessAiTurn() && piece.color === chessState.turn;
}

export function getChessMoveFromSelection(row, col) {
    if (!chessSelectedSquare) {
        return null;
    }

    return getChessMoves(chessSelectedSquare.row, chessSelectedSquare.col)
        .find((candidate) => candidate.row === row && candidate.col === col) || null;
}

export function submitChessMove(toRow, toCol) {
    const move = getChessMoveFromSelection(toRow, toCol);
    if (!move || !chessSelectedSquare) {
        return false;
    }

    if (isMultiplayerChessActive()) {
        getMultiplayerSocket()?.emit('chess:move', {
            fromRow: chessSelectedSquare.row,
            fromCol: chessSelectedSquare.col,
            toRow,
            toCol
        });
        return true;
    }

    return applyChessMove(chessSelectedSquare.row, chessSelectedSquare.col, toRow, toCol);
}

export function clearChessDragState(shouldRender = true) {
    const { chessBoard } = dom();
    chessDragState = null;
    chessBoard?.classList.remove('is-dragging-piece');
    document.querySelector('.chess-drag-ghost')?.remove();
    if (shouldRender) {
        renderChess();
    }
}

export function updateChessDragPointer(clientX, clientY) {
    const { chessBoard } = dom();
    if (!chessDragState || !chessDragState.dragging || !chessBoard) {
        return;
    }

    chessDragState.pointerX = clientX;
    chessDragState.pointerY = clientY;

    const hoveredCell = document.elementFromPoint(clientX, clientY)?.closest?.('[data-chess-cell]');
    chessDragState.hoveredCell = hoveredCell?.dataset?.chessCell || null;

    renderChess();
}

export function startChessPieceDrag(clientX, clientY) {
    const { chessBoard } = dom();
    if (!chessDragState) {
        return;
    }

    chessDragState.dragging = true;
    chessDragState.pointerX = clientX;
    chessDragState.pointerY = clientY;
    chessBoard?.classList.add('is-dragging-piece');
    updateChessDragPointer(clientX, clientY);
}

export function renderChessDragGhost() {
    document.querySelector('.chess-drag-ghost')?.remove();

    if (!chessDragState?.dragging) {
        return;
    }

    const piece = chessState?.board?.[chessDragState.row]?.[chessDragState.col];
    if (!piece) {
        return;
    }

    const ghost = document.createElement('div');
    ghost.className = `chess-drag-ghost chess-piece chess-piece-${piece.color} chess-piece-${piece.type}`;
    ghost.textContent = getChessPieceGlyph(piece.type);
    ghost.style.left = `${chessDragState.pointerX}px`;
    ghost.style.top = `${chessDragState.pointerY}px`;
    document.body.appendChild(ghost);
}

export function finishChessPieceDrag(clientX, clientY) {
    if (!chessDragState) {
        return;
    }

    const wasDragging = chessDragState.dragging;
    const source = { row: chessDragState.row, col: chessDragState.col };
    const legalMove = wasDragging
        ? (() => {
            const hoveredCell = document.elementFromPoint(clientX, clientY)?.closest?.('[data-chess-cell]');
            if (!hoveredCell?.dataset?.chessCell) {
                return null;
            }
            const [targetRow, targetCol] = hoveredCell.dataset.chessCell.split('-').map(Number);
            return getChessMoves(source.row, source.col)
                .find((candidate) => candidate.row === targetRow && candidate.col === targetCol) || null;
        })()
        : null;

    chessSuppressNextClick = wasDragging;
    clearChessDragState(false);
    chessSelectedSquare = source;

    if (legalMove) {
        submitChessMove(legalMove.row, legalMove.col);
        return;
    }

    renderChess();
}

export function handleChessPiecePointerDown(event, row, col) {
    if (event.button !== 0 || !canInteractWithChessPiece(row, col)) {
        return;
    }

    chessSelectedSquare = { row, col };
    chessDragState = {
        row,
        col,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        pointerX: event.clientX,
        pointerY: event.clientY,
        dragging: false,
        hoveredCell: null
    };
    renderChess();
}

export function handleChessPointerMove(event) {
    if (!chessDragState || chessDragState.pointerId !== event.pointerId) {
        return;
    }

    const distance = Math.hypot(event.clientX - chessDragState.startX, event.clientY - chessDragState.startY);
    if (!chessDragState.dragging && distance >= 8) {
        startChessPieceDrag(event.clientX, event.clientY);
        return;
    }

    updateChessDragPointer(event.clientX, event.clientY);
}

export function handleChessPointerUp(event) {
    if (!chessDragState || chessDragState.pointerId !== event.pointerId) {
        return;
    }

    finishChessPieceDrag(event.clientX, event.clientY);
}

export function scheduleChessMoveAnimationClear() {
    if (chessLastMoveResetTimer) {
        window.clearTimeout(chessLastMoveResetTimer);
    }

    if (!chessState?.lastMove) {
        return;
    }

    chessLastMoveResetTimer = window.setTimeout(() => {
        chessLastMoveResetTimer = null;
        if (!chessState?.lastMove) {
            return;
        }
        chessState.lastMove = null;
        renderChess();
    }, 360);
}

export function maybePlayChessCaptureFx() {
    const { chessBoard } = dom();
    const move = chessState?.lastMove;
    if (!move?.capture) {
        chessLastCaptureFxKey = '';
        return;
    }

    const fxKey = `${move.fromRow}:${move.fromCol}:${move.toRow}:${move.toCol}:${move.capture.row}:${move.capture.col}:${move.captureColor || 'none'}`;
    if (fxKey === chessLastCaptureFxKey) {
        return;
    }

    chessLastCaptureFxKey = fxKey;
    window.requestAnimationFrame(() => {
        spawnBoardCaptureParticles(
            chessBoard,
            move.capture.row,
            move.capture.col,
            move.captureColor === 'black' ? 'dark' : 'light',
            getDisplayChessPosition
        );
    });
}

export function maybeOpenChessOutcomeModal() {
    if (!chessState?.winner) {
        chessLastFinishedStateKey = '';
        return;
    }

    const move = chessState.lastMove;
    const finishedKey = `solo:${chessState.winner}:${move?.fromRow ?? '-'}:${move?.fromCol ?? '-'}:${move?.toRow ?? '-'}:${move?.toCol ?? '-'}`;
    if (finishedKey === chessLastFinishedStateKey) {
        return;
    }

    chessLastFinishedStateKey = finishedKey;
    revealChessOutcomeMenuWithDelay();
}

export function renderChess() {
    const { chessBoard, chessTurnDisplay, chessStatusDisplay, chessHelpText, chessModeButtons } = dom();
    const legalMoves = chessSelectedSquare ? getChessMoves(chessSelectedSquare.row, chessSelectedSquare.col) : [];
    const whiteInCheck = isChessKingInCheck('white');
    const blackInCheck = isChessKingInCheck('black');
    const checkedColor = whiteInCheck ? 'white' : (blackInCheck ? 'black' : null);
    const checkedKingPosition = checkedColor ? getChessKingPosition(checkedColor) : null;
    const nextAnimationKey = getBoardMoveAnimationKey(chessState.lastMove);
    const shouldAnimateLastMove = Boolean(chessState.lastMove) && nextAnimationKey !== chessLastMoveAnimationKey;
    chessBoard.classList.toggle('is-check', Boolean(checkedColor) && !chessState.winner);
    chessBoard.classList.toggle('is-checkmate', Boolean(chessState.winner));
    if (isMultiplayerChessActive()) {
        const currentRole = getMultiplayerChessRole();
        chessTurnDisplay.textContent = chessState.turn === currentRole ? 'Toi' : 'Adversaire';
        chessStatusDisplay.textContent = chessState.winner
            ? (chessState.winner === currentRole ? 'Victoire' : 'D\u00e9faite')
            : (checkedColor === currentRole ? '\u00c9chec' : (checkedColor ? 'Tu mets \u00e9chec' : 'En cours'));
        chessHelpText.textContent = chessState.winner
            ? (chessState.winner === currentRole ? "\u00c9chec et mat. Tu contr\u00f4les l'\u00e9chiquier." : "\u00c9chec et mat. L'adversaire contr\u00f4le l'\u00e9chiquier.")
            : (chessState.turn === currentRole
                ? (checkedColor === currentRole ? 'Ton roi est en \u00e9chec.' : '\u00c0 toi de jouer.')
                : (checkedColor ? 'Le roi est en echec.' : "Au tour de l'adversaire."));
    } else {
        chessTurnDisplay.textContent = chessState.turn === 'white'
            ? (chessMode === 'solo' ? 'Toi' : 'Blancs')
            : (chessMode === 'solo' ? 'IA' : 'Noirs');
        chessStatusDisplay.textContent = chessState.winner
            ? `${chessState.winner === 'white' ? (chessMode === 'solo' ? 'Toi' : 'Blancs') : (chessMode === 'solo' ? 'IA' : 'Noirs')} gagnent`
            : (checkedColor
                ? `\u00c9chec ${checkedColor === 'white' ? 'blanc' : 'noir'}`
                : 'En cours');
        chessHelpText.textContent = chessState.winner
            ? `\u00c9chec et mat. ${chessState.winner === 'white' ? (chessMode === 'solo' ? 'Tu remportes' : 'Les Blancs remportent') : (chessMode === 'solo' ? "L'IA remporte" : 'Les Noirs remportent')} la partie.`
            : (chessMode === 'solo'
                ? (checkedColor === 'white' ? 'Ton roi est en echec.' : (checkedColor === 'black' ? 'Le roi adverse est en echec.' : 'Mode 1 joueur: blancs contre IA. Promotion en reine, avec roque.'))
                : (checkedColor ? `Le roi ${checkedColor === 'white' ? 'blanc' : 'noir'} est en echec.` : 'Mode 2 joueurs: blancs et noirs en tour par tour. Promotion en reine, avec roque.'));
    }
    chessModeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.chessMode === chessMode);
        button.disabled = isMultiplayerChessActive();
    });
    chessBoard.innerHTML = Array.from({ length: CHESS_SIZE }, (_, displayRow) => Array.from({ length: CHESS_SIZE }, (_, displayCol) => {
        const { row, col } = getBoardChessPosition(displayRow, displayCol);
        const piece = chessState.board[row][col];
        const dark = (row + col) % 2 === 1;
        const selected = chessSelectedSquare?.row === row && chessSelectedSquare?.col === col;
        const playable = legalMoves.some((move) => move.row === row && move.col === col);
        const captureHit = isBoardCaptureCell(chessState.lastMove, row, col);
        const pieceAnimation = getBoardMoveAnimationMetadata(
            shouldAnimateLastMove ? chessState.lastMove : null,
            row,
            col,
            shouldFlipChessBoardPerspective()
        );
        const checkedKing = checkedKingPosition?.row === row && checkedKingPosition?.col === col;
        const rankLabel = displayCol === 0 ? String(CHESS_SIZE - row) : '';
        const fileLabel = displayRow === CHESS_SIZE - 1 ? String.fromCharCode(97 + col) : '';
        return `
            <button
                type="button"
                class="chess-cell ${dark ? 'is-dark' : 'is-light'} ${selected ? 'is-selected' : ''} ${playable ? 'is-move' : ''} ${captureHit ? 'is-capture-hit' : ''} ${checkedKing ? 'is-check-king' : ''}"
                data-chess-cell="${row}-${col}"
            >
                ${rankLabel ? `<span class="chess-coordinate chess-coordinate-rank">${rankLabel}</span>` : ''}
                ${fileLabel ? `<span class="chess-coordinate chess-coordinate-file">${fileLabel}</span>` : ''}
                ${piece ? `<span class="chess-piece chess-piece-${piece.color} chess-piece-${piece.type} ${pieceAnimation.className}${chessDragState?.row === row && chessDragState?.col === col ? ' is-drag-source' : ''}${chessDragState?.hoveredCell === `${row}-${col}` && legalMoves.some((move) => move.row === row && move.col === col) ? ' is-drag-target' : ''}" ${pieceAnimation.style} data-chess-piece="${row}-${col}">${getChessPieceGlyph(piece.type)}</span>` : ''}
            </button>
        `;
    }).join('')).join('');
    renderChessDragGhost();

    if (chessState.lastMove && shouldAnimateLastMove) {
        scheduleChessMoveAnimationClear();
    }
    chessLastMoveAnimationKey = nextAnimationKey;
    maybePlayChessCaptureFx();
    maybeOpenChessOutcomeModal();
}

export function handleChessCellClick(row, col) {
    const piece = chessState.board[row][col];
    if (piece && canInteractWithChessPiece(row, col)) {
        chessSelectedSquare = { row, col };
        renderChess();
        return;
    }

    if (!chessSelectedSquare) {
        return;
    }

    if (!submitChessMove(row, col)) {
        chessSelectedSquare = null;
        renderChess();
        return;
    }
}

export function applyChessMove(fromRow, fromCol, toRow, toCol) {
    const movingPiece = chessState.board[fromRow][fromCol];
    if (!movingPiece || movingPiece.color !== chessState.turn || chessState.winner) {
        return false;
    }

    const legalMove = getChessMoves(fromRow, fromCol).find((candidate) => candidate.row === toRow && candidate.col === toCol);
    if (!legalMove) {
        return false;
    }

    const nextPiece = { ...movingPiece, hasMoved: true };
    const capturedPiece = chessState.board[toRow][toCol];
    chessState.board[toRow][toCol] = nextPiece;
    chessState.board[fromRow][fromCol] = null;

    if (nextPiece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
        const rookFromCol = toCol > fromCol ? CHESS_SIZE - 1 : 0;
        const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
        const rookPiece = chessState.board[toRow][rookFromCol];
        if (rookPiece) {
            chessState.board[toRow][rookToCol] = { ...rookPiece, hasMoved: true };
            chessState.board[toRow][rookFromCol] = null;
        }
    }

    if (nextPiece.type === 'pawn' && (toRow === 0 || toRow === CHESS_SIZE - 1)) {
        chessState.board[toRow][toCol] = createChessPiece('queen', nextPiece.color);
    }

    chessSelectedSquare = null;
    chessState.lastMove = {
        fromRow,
        fromCol,
        toRow,
        toCol,
        pieceType: movingPiece.type,
        capture: capturedPiece ? { row: toRow, col: toCol } : null,
        captureColor: capturedPiece?.color || null
    };

    if (capturedPiece?.type === 'king') {
        chessState.winner = nextPiece.color;
    } else {
        chessState.turn = chessState.turn === 'white' ? 'black' : 'white';
        if (!getChessAllMoves(chessState.turn).length) {
            chessState.winner = nextPiece.color;
        }
    }

    renderChess();
    maybePlayChessAi();
    return true;
}

export function getChessAllMovesForState(state, color) {
    const moves = [];

    for (let row = 0; row < CHESS_SIZE; row += 1) {
        for (let col = 0; col < CHESS_SIZE; col += 1) {
            const piece = state.board[row][col];
            if (!piece || piece.color !== color) {
                continue;
            }

            const legalMoves = getChessMovesForState(state, row, col);
            legalMoves.forEach((move) => {
                moves.push({
                    fromRow: row,
                    fromCol: col,
                    toRow: move.row,
                    toCol: move.col,
                    piece,
                    target: state.board[move.row][move.col]
                });
            });
        }
    }

    return moves;
}

export function getChessAllMoves(color) {
    return getChessAllMovesForState(chessState, color);
}

export function evaluateChessBoard(state) {
    const pieceValues = {
        pawn: 100,
        knight: 320,
        bishop: 335,
        rook: 500,
        queen: 900,
        king: 20000
    };
    const centerBonusByType = {
        pawn: 8,
        knight: 18,
        bishop: 14,
        rook: 6,
        queen: 8,
        king: 4
    };

    let score = 0;

    for (let row = 0; row < CHESS_SIZE; row += 1) {
        for (let col = 0; col < CHESS_SIZE; col += 1) {
            const piece = state.board[row][col];
            if (!piece) {
                continue;
            }

            const baseValue = pieceValues[piece.type] || 0;
            const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col);
            const centerBonus = Math.max(0, 4 - centerDistance) * (centerBonusByType[piece.type] || 0);
            const developmentBonus = piece.type === 'pawn'
                ? (piece.color === 'black' ? row * 5 : (7 - row) * 5)
                : 0;
            const movedBonus = piece.hasMoved && piece.type !== 'pawn' ? 6 : 0;
            const contribution = baseValue + centerBonus + developmentBonus + movedBonus;

            score += piece.color === 'black' ? contribution : -contribution;
        }
    }

    const blackMoves = getChessAllMovesForState(state, 'black').length;
    const whiteMoves = getChessAllMovesForState(state, 'white').length;
    score += (blackMoves - whiteMoves) * 3;

    if (isChessKingInCheckForState(state, 'white')) {
        score += 28;
    }

    if (isChessKingInCheckForState(state, 'black')) {
        score -= 28;
    }

    return score;
}

export function minimaxChess(state, depth, maximizingPlayer, alpha, beta) {
    if (state.winner === 'black') {
        return 1000000 + depth;
    }

    if (state.winner === 'white') {
        return -1000000 - depth;
    }

    if (depth === 0) {
        return evaluateChessBoard(state);
    }

    const color = maximizingPlayer ? 'black' : 'white';
    const moves = getChessAllMovesForState(state, color);

    if (!moves.length) {
        return maximizingPlayer ? -1000000 - depth : 1000000 + depth;
    }

    if (maximizingPlayer) {
        let bestScore = -Infinity;

        for (const move of moves) {
            const nextState = applyChessMoveToState(state, move.fromRow, move.fromCol, move.toRow, move.toCol);
            const score = minimaxChess(nextState, depth - 1, false, alpha, beta);
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);

            if (beta <= alpha) {
                break;
            }
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const move of moves) {
        const nextState = applyChessMoveToState(state, move.fromRow, move.fromCol, move.toRow, move.toCol);
        const score = minimaxChess(nextState, depth - 1, true, alpha, beta);
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);

        if (beta <= alpha) {
            break;
        }
    }

    return bestScore;
}

export function maybePlayChessAi() {
    if (!isChessAiTurn()) {
        return;
    }

    if (chessAiTimeout) {
        window.clearTimeout(chessAiTimeout);
    }

    chessAiTimeout = window.setTimeout(() => {
        chessAiTimeout = null;

        if (!isChessAiTurn()) {
            return;
        }

        const moves = getChessAllMoves('black');
        if (!moves.length) {
            chessState.winner = 'white';
            renderChess();
            return;
        }

        let bestScore = -Infinity;
        let bestMoves = [];
        const searchDepth = moves.length <= 10 ? 3 : 2;

        moves.forEach((move) => {
            const previewState = applyChessMoveToState(chessState, move.fromRow, move.fromCol, move.toRow, move.toCol);
            let score = minimaxChess(previewState, searchDepth - 1, false, -Infinity, Infinity);
            score += Math.random() * 0.12;

            if (move.target) {
                score += 14;
            }

            if (move.piece.type === 'king' && Math.abs(move.toCol - move.fromCol) === 2) {
                score += 20;
            }

            if (score > bestScore) {
                bestScore = score;
                bestMoves = [move];
            } else if (Math.abs(score - bestScore) < 0.001) {
                bestMoves.push(move);
            }
        });

        const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        applyChessMove(selectedMove.fromRow, selectedMove.fromCol, selectedMove.toRow, selectedMove.toCol);
    }, 420);
}

export function setChessMode(nextMode) {
    if (isMultiplayerChessActive()) {
        setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
        return;
    }

    if (!nextMode || nextMode === chessMode) {
        return;
    }

    chessMode = nextMode;
    initializeChess();
}

export function syncMultiplayerChessState() {
    const multiplayerActiveRoom = getMultiplayerActiveRoom();
    if (!isMultiplayerChessActive()) {
        chessLastMoveAnimationKey = '';
        chessLastFinishedStateKey = '';
        chessLastCaptureFxKey = '';
        return;
    }

    if (chessLastMoveResetTimer) {
        window.clearTimeout(chessLastMoveResetTimer);
        chessLastMoveResetTimer = null;
    }
    if (chessOutcomeMenuTimer) {
        window.clearTimeout(chessOutcomeMenuTimer);
        chessOutcomeMenuTimer = null;
    }
    if (chessOutcomeMenuEnterTimer) {
        window.clearTimeout(chessOutcomeMenuEnterTimer);
        chessOutcomeMenuEnterTimer = null;
    }
    if (chessAiTimeout) {
        window.clearTimeout(chessAiTimeout);
        chessAiTimeout = null;
    }

    chessState = {
        board: multiplayerActiveRoom.gameState.board.map((row) => row.map((piece) => (piece ? { ...piece } : null))),
        turn: multiplayerActiveRoom.gameState.turn,
        winner: multiplayerActiveRoom.gameState.winner,
        lastMove: multiplayerActiveRoom.gameState.lastMove
            ? {
                ...multiplayerActiveRoom.gameState.lastMove,
                capture: multiplayerActiveRoom.gameState.lastMove.capture
                    ? { ...multiplayerActiveRoom.gameState.lastMove.capture }
                    : null
            }
            : null
    };
    chessSelectedSquare = null;
    renderChessMenu();
    renderChess();

    const nextFinishedKey = `${multiplayerActiveRoom.gameState.round}:${multiplayerActiveRoom.gameState.winner || 'none'}`;
    if (!multiplayerActiveRoom.gameState.winner) {
        chessLastFinishedStateKey = '';
        chessMenuEntering = false;
        closeGameOverModal();
        return;
    }

    if (nextFinishedKey === chessLastFinishedStateKey || activeGameTabAccessor() !== 'chess') {
        return;
    }

    chessLastFinishedStateKey = nextFinishedKey;
    revealChessOutcomeMenuWithDelay();
}

// --- Accessors for module state (parity with connect4.js / checkers.js) ---
export function getChessMode() { return chessMode; }
export function getChessState() { return chessState; }
export function getChessSelectedSquare() { return chessSelectedSquare; }
export function getChessDragState() { return chessDragState; }
export function getChessSuppressNextClick() { return chessSuppressNextClick; }
export function setChessSuppressNextClick(v) { chessSuppressNextClick = Boolean(v); }
export function getChessMenuVisible() { return chessMenuVisible; }
export function setChessMenuVisible(v) { chessMenuVisible = Boolean(v); }
export function getChessMenuShowingRules() { return chessMenuShowingRules; }
export function setChessMenuShowingRules(v) { chessMenuShowingRules = Boolean(v); }
