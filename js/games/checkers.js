// Game module — Dames (Checkers), solo/duo/multijoueur avec IA simple.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import {
    isInsideGameGrid,
    getBoardMoveAnimationMetadata,
    getBoardMoveAnimationKey,
    isBoardCaptureCell,
    spawnBoardCaptureParticles
} from './_shared/board-helpers.js';
import { closeGameOverModal } from '../core/modals.js';
import {
    getMultiplayerActiveRoom,
    getMultiplayerSocket,
    getMultiplayerReadySummary,
    isCurrentPlayerMultiplayerReady
} from '../multiplayer/state.js';
import { setMultiplayerStatus } from '../multiplayer/status.js';

export const CHECKERS_SIZE = 8;
export const CHECKERS_DIRECTIONS = {
    red: [[-1, -1], [-1, 1]],
    black: [[1, -1], [1, 1]]
};

let checkersState = null;
let checkersSelectedSquare = null;
let checkersMode = 'solo';
let checkersAiTimeout = null;
let checkersLastMoveResetTimer = null;
let checkersMenuVisible = true;
let checkersMenuShowingRules = false;
let checkersMenuClosing = false;
let checkersMenuEntering = false;
let checkersMenuResult = false;
let checkersLastMoveAnimationKey = '';
let checkersLastFinishedStateKey = '';
let checkersLastCaptureFxKey = '';

let activeGameTabAccessor = () => null;
export function setCheckersActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        checkersGame: $('checkersGame'),
        checkersBoard: $('checkersBoard'),
        checkersTurnDisplay: $('checkersTurnDisplay'),
        checkersCountDisplay: $('checkersCountDisplay'),
        checkersHelpText: $('checkersHelpText'),
        checkersTable: $('checkersTable'),
        checkersMenuOverlay: $('checkersMenuOverlay'),
        checkersMenuEyebrow: $('checkersMenuEyebrow'),
        checkersMenuTitle: $('checkersMenuTitle'),
        checkersMenuText: $('checkersMenuText'),
        checkersMenuActionButton: $('checkersMenuActionButton'),
        checkersMenuRulesButton: $('checkersMenuRulesButton'),
        checkersModeButtons: document.querySelectorAll('[data-checkers-mode]')
    };
}

// --- Multiplayer helpers ---
export function isMultiplayerCheckersActive() {
    const room = getMultiplayerActiveRoom();
    return room?.gameId === 'checkers' && Boolean(room?.gameState);
}

export function getMultiplayerCheckersRole() {
    return getMultiplayerActiveRoom()?.players?.find((player) => player.isYou)?.symbol || null;
}

// --- Checkers core ---
export function createInitialCheckersBoard() {
    const board = Array.from({ length: CHECKERS_SIZE }, () => Array.from({ length: CHECKERS_SIZE }, () => null));

    for (let row = 0; row < CHECKERS_SIZE; row += 1) {
        for (let col = 0; col < CHECKERS_SIZE; col += 1) {
            if ((row + col) % 2 === 0) {
                continue;
            }
            if (row < 3) {
                board[row][col] = { color: 'black', king: false };
            } else if (row > 4) {
                board[row][col] = { color: 'red', king: false };
            }
        }
    }

    return board;
}

export function initializeCheckers() {
    if (isMultiplayerCheckersActive()) {
        const room = getMultiplayerActiveRoom();
        checkersMenuVisible = !room?.gameLaunched;
        checkersMenuShowingRules = false;
        checkersMenuClosing = false;
        checkersMenuEntering = false;
        renderCheckersMenu();
        syncMultiplayerCheckersState();
        return;
    }

    checkersLastMoveAnimationKey = '';
    checkersLastCaptureFxKey = '';
    if (checkersLastMoveResetTimer) {
        window.clearTimeout(checkersLastMoveResetTimer);
        checkersLastMoveResetTimer = null;
    }
    if (checkersAiTimeout) {
        window.clearTimeout(checkersAiTimeout);
        checkersAiTimeout = null;
    }
    checkersState = {
        board: createInitialCheckersBoard(),
        turn: 'red',
        winner: null,
        lastMove: null
    };
    checkersSelectedSquare = null;
    checkersMenuVisible = true;
    checkersMenuShowingRules = false;
    checkersMenuClosing = false;
    checkersMenuEntering = false;
    checkersMenuResult = false;
    renderCheckers();
}

export function isCheckersAiTurn() {
    return checkersMode === 'solo' && checkersState && !checkersState.winner && checkersState.turn === 'black';
}

export function getCheckersMoves(row, col) {
    const piece = checkersState?.board[row][col];

    if (!piece || piece.color !== checkersState.turn || checkersState.winner) {
        return [];
    }

    const directions = piece.king ? [...CHECKERS_DIRECTIONS.red, ...CHECKERS_DIRECTIONS.black] : CHECKERS_DIRECTIONS[piece.color];
    const moves = [];

    directions.forEach(([rowStep, colStep]) => {
        const nextRow = row + rowStep;
        const nextCol = col + colStep;
        if (!isInsideGameGrid(nextRow, nextCol, CHECKERS_SIZE)) {
            return;
        }

        const target = checkersState.board[nextRow][nextCol];
        if (!target) {
            moves.push({ row: nextRow, col: nextCol, capture: null });
            return;
        }

        if (target.color === piece.color) {
            return;
        }

        const jumpRow = nextRow + rowStep;
        const jumpCol = nextCol + colStep;
        if (isInsideGameGrid(jumpRow, jumpCol, CHECKERS_SIZE) && !checkersState.board[jumpRow][jumpCol]) {
            moves.push({ row: jumpRow, col: jumpCol, capture: { row: nextRow, col: nextCol } });
        }
    });

    return moves;
}

export function scheduleCheckersMoveAnimationClear() {
    if (checkersLastMoveResetTimer) {
        window.clearTimeout(checkersLastMoveResetTimer);
    }

    if (!checkersState?.lastMove) {
        return;
    }

    checkersLastMoveResetTimer = window.setTimeout(() => {
        checkersLastMoveResetTimer = null;
        if (!checkersState?.lastMove) {
            return;
        }
        checkersState.lastMove = null;
        renderCheckers();
    }, 360);
}

export function maybePlayCheckersCaptureFx() {
    const { checkersBoard } = dom();
    const move = checkersState?.lastMove;
    if (!move?.capture) {
        checkersLastCaptureFxKey = '';
        return;
    }

    const fxKey = `${move.fromRow}:${move.fromCol}:${move.toRow}:${move.toCol}:${move.capture.row}:${move.capture.col}:${move.captureColor || 'none'}`;
    if (fxKey === checkersLastCaptureFxKey) {
        return;
    }

    checkersLastCaptureFxKey = fxKey;
    window.requestAnimationFrame(() => {
        spawnBoardCaptureParticles(checkersBoard, move.capture.row, move.capture.col, move.captureColor === 'black' ? 'dark' : 'red');
    });
}

export function maybeOpenCheckersOutcomeModal() {
    if (!checkersState?.winner) {
        checkersLastFinishedStateKey = '';
        return;
    }

    const move = checkersState.lastMove;
    const finishedKey = `solo:${checkersState.winner}:${move?.fromRow ?? '-'}:${move?.fromCol ?? '-'}:${move?.toRow ?? '-'}:${move?.toCol ?? '-'}`;
    if (finishedKey === checkersLastFinishedStateKey) {
        return;
    }

    checkersLastFinishedStateKey = finishedKey;
    revealCheckersOutcomeMenu();
}

export function renderCheckers() {
    const { checkersBoard, checkersTurnDisplay, checkersCountDisplay, checkersHelpText, checkersModeButtons } = dom();
    const legalMoves = checkersSelectedSquare ? getCheckersMoves(checkersSelectedSquare.row, checkersSelectedSquare.col) : [];
    const blackCount = checkersState.board.flat().filter((piece) => piece?.color === 'black').length;
    const redCount = checkersState.board.flat().filter((piece) => piece?.color === 'red').length;
    const nextAnimationKey = getBoardMoveAnimationKey(checkersState.lastMove);
    const shouldAnimateLastMove = Boolean(checkersState.lastMove) && nextAnimationKey !== checkersLastMoveAnimationKey;
    checkersTurnDisplay.textContent = checkersState.winner
        ? '-'
        : (isMultiplayerCheckersActive()
            ? (checkersState.turn === getMultiplayerCheckersRole() ? 'Toi' : 'Adversaire')
            : (checkersState.turn === 'red' ? (checkersMode === 'solo' ? 'Toi' : 'Rouges') : (checkersMode === 'solo' ? 'IA' : 'Noirs')));
    checkersCountDisplay.textContent = `${blackCount}/${redCount}`;
    checkersHelpText.textContent = isMultiplayerCheckersActive()
        ? (checkersState.winner
            ? (checkersState.winner === getMultiplayerCheckersRole() ? 'Tu remportes la partie.' : "L'adversaire remporte la partie.")
            : (checkersState.turn === getMultiplayerCheckersRole() ? '\u00c0 toi de jouer.' : "Au tour de l'adversaire."))
        : (checkersMode === 'solo'
            ? 'Mode 1 joueur : rouges contre IA. Roi à la promotion.'
            : 'Mode 2 joueurs : rouges et noirs en tour par tour. Roi à la promotion.');
    checkersModeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.checkersMode === checkersMode);
        button.disabled = isMultiplayerCheckersActive();
    });
    checkersBoard.innerHTML = checkersState.board.map((rowItems, row) => rowItems.map((piece, col) => {
        const dark = (row + col) % 2 === 1;
        const selected = checkersSelectedSquare?.row === row && checkersSelectedSquare?.col === col;
        const playable = legalMoves.some((move) => move.row === row && move.col === col);
        const captureHit = isBoardCaptureCell(checkersState.lastMove, row, col);
        const pieceAnimation = getBoardMoveAnimationMetadata(shouldAnimateLastMove ? checkersState.lastMove : null, row, col);
        return `
            <button type="button" class="checkers-cell ${dark ? 'is-dark' : 'is-light'} ${selected ? 'is-selected' : ''} ${playable ? 'is-move' : ''} ${captureHit ? 'is-capture-hit' : ''}" data-checkers-cell="${row}-${col}">
                ${piece ? `<span class="checkers-piece ${piece.color === 'red' ? 'is-red' : 'is-black'} ${piece.king ? 'is-king' : ''} ${pieceAnimation.className}" ${pieceAnimation.style}></span>` : ''}
            </button>
        `;
    }).join('')).join('');

    if (checkersState.lastMove && shouldAnimateLastMove) {
        scheduleCheckersMoveAnimationClear();
    }
    checkersLastMoveAnimationKey = nextAnimationKey;
    maybePlayCheckersCaptureFx();
    maybeOpenCheckersOutcomeModal();
    renderCheckersMenu();
}

export function getCheckersRulesText() {
    return 'Déplace tes pions en diagonale. Capture en sautant par-dessus un pion adverse, et un pion promu devient roi quand il atteint le bout du plateau.';
}

export function renderCheckersMenu() {
    const { checkersMenuOverlay, checkersTable, checkersMenuEyebrow, checkersMenuTitle, checkersMenuText, checkersMenuActionButton, checkersMenuRulesButton } = dom();
    if (!checkersMenuOverlay || !checkersTable) {
        return;
    }

    syncGameMenuOverlayBounds(checkersMenuOverlay, checkersTable);
    checkersMenuOverlay.classList.toggle('hidden', !checkersMenuVisible);
    checkersMenuOverlay.classList.toggle('is-closing', checkersMenuClosing);
    checkersMenuOverlay.classList.toggle('is-entering', checkersMenuEntering);
    checkersTable.classList.toggle('is-menu-open', checkersMenuVisible);

    if (!checkersMenuVisible) {
        return;
    }

    const multiplayerActiveRoom = getMultiplayerActiveRoom();
    const multiplayerCheckers = isMultiplayerCheckersActive();
    const hasResult = checkersMenuResult && Boolean(checkersState?.winner);
    if (checkersMenuEyebrow) {
        checkersMenuEyebrow.textContent = checkersMenuShowingRules ? 'R\u00e8gles' : (hasResult ? 'Fin de partie' : 'Baie strat\u00e9gique');
    }
    if (checkersMenuTitle) {
        checkersMenuTitle.textContent = checkersMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult
                ? (multiplayerCheckers
                    ? (checkersState.winner === getMultiplayerCheckersRole() ? 'Victoire' : "C'est perdu")
                    : (checkersMode === 'solo'
                        ? (checkersState.winner === 'red' ? 'Victoire' : "C'est perdu")
                        : `${checkersState.winner === 'red' ? 'Rouges' : 'Noirs'} gagnent`))
                : 'Dames');
    }
    if (checkersMenuText) {
        checkersMenuText.textContent = checkersMenuShowingRules
            ? getCheckersRulesText()
            : (hasResult
                ? (multiplayerCheckers
                    ? (checkersState.winner === getMultiplayerCheckersRole() ? 'Tu remportes cette partie de dames en ligne.' : "L'adversaire remporte cette partie de dames.")
                    : (checkersMode === 'solo'
                        ? (checkersState.winner === 'red' ? 'Tu remportes la partie de dames.' : "L'IA remporte la partie de dames.")
                        : `${checkersState.winner === 'red' ? 'Les Rouges' : 'Les Noirs'} remportent la partie de dames.`))
                : ((multiplayerCheckers && !multiplayerActiveRoom?.gameLaunched)
                    ? 'Quand tous les joueurs sont pr\u00eats, la partie de dames commence automatiquement.'
                    : "Installe les pions et choisis ton mode avant d'engager la partie."));
    }
    if (checkersMenuActionButton) {
        checkersMenuActionButton.textContent = checkersMenuShowingRules
            ? 'Retour'
            : ((multiplayerCheckers && !multiplayerActiveRoom?.gameLaunched)
                ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie'));
    }
    if (checkersMenuRulesButton) {
        checkersMenuRulesButton.textContent = 'R\u00e8gles';
        checkersMenuRulesButton.hidden = checkersMenuShowingRules;
    }
}

export function startCheckersLaunchSequence() {
    checkersMenuClosing = true;
    renderCheckersMenu();
    window.setTimeout(() => {
        checkersMenuClosing = false;
        checkersMenuVisible = false;
        checkersMenuShowingRules = false;
        checkersMenuEntering = false;
        checkersMenuResult = false;
        renderCheckersMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealCheckersOutcomeMenu() {
    checkersMenuShowingRules = false;
    checkersMenuClosing = false;
    checkersMenuEntering = true;
    checkersMenuVisible = true;
    checkersMenuResult = true;
    renderCheckersMenu();
    window.setTimeout(() => {
        checkersMenuEntering = false;
        renderCheckersMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function handleCheckersCellClick(row, col) {
    if (checkersMenuVisible || checkersMenuClosing) {
        return;
    }

    if (isMultiplayerCheckersActive()) {
        if (checkersState.winner || checkersState.turn !== getMultiplayerCheckersRole()) {
            return;
        }

        const piece = checkersState.board[row][col];
        if (piece && piece.color === checkersState.turn) {
            checkersSelectedSquare = { row, col };
            renderCheckers();
            return;
        }

        if (!checkersSelectedSquare) {
            return;
        }

        const move = getCheckersMoves(checkersSelectedSquare.row, checkersSelectedSquare.col).find((candidate) => candidate.row === row && candidate.col === col);
        if (!move) {
            checkersSelectedSquare = null;
            renderCheckers();
            return;
        }

        getMultiplayerSocket()?.emit('checkers:move', {
            fromRow: checkersSelectedSquare.row,
            fromCol: checkersSelectedSquare.col,
            toRow: row,
            toCol: col
        });
        return;
    }

    if (checkersState.winner || isCheckersAiTurn()) {
        return;
    }

    const piece = checkersState.board[row][col];
    if (piece && piece.color === checkersState.turn) {
        checkersSelectedSquare = { row, col };
        renderCheckers();
        return;
    }

    if (!checkersSelectedSquare) {
        return;
    }

    const move = getCheckersMoves(checkersSelectedSquare.row, checkersSelectedSquare.col).find((candidate) => candidate.row === row && candidate.col === col);
    if (!move) {
        checkersSelectedSquare = null;
        renderCheckers();
        return;
    }

    applyCheckersMove(checkersSelectedSquare.row, checkersSelectedSquare.col, row, col);
}

export function applyCheckersMove(fromRow, fromCol, toRow, toCol) {
    const movingPiece = checkersState.board[fromRow][fromCol];
    if (!movingPiece || movingPiece.color !== checkersState.turn || checkersState.winner) {
        return false;
    }

    const move = getCheckersMoves(fromRow, fromCol).find((candidate) => candidate.row === toRow && candidate.col === toCol);
    if (!move) {
        return false;
    }

    const nextPiece = { ...movingPiece };
    const capturedPiece = move.capture ? checkersState.board[move.capture.row][move.capture.col] : null;
    checkersState.board[fromRow][fromCol] = null;
    checkersState.board[toRow][toCol] = nextPiece;

    if (move.capture) {
        checkersState.board[move.capture.row][move.capture.col] = null;
    }

    if ((nextPiece.color === 'red' && toRow === 0) || (nextPiece.color === 'black' && toRow === CHECKERS_SIZE - 1)) {
        nextPiece.king = true;
    }

    checkersState.lastMove = {
        fromRow,
        fromCol,
        toRow,
        toCol,
        pieceType: movingPiece.king ? 'king' : 'checker',
        capture: move.capture ? { ...move.capture } : null,
        captureColor: capturedPiece?.color || null
    };

    const redCount = checkersState.board.flat().filter((item) => item?.color === 'red').length;
    const blackCount = checkersState.board.flat().filter((item) => item?.color === 'black').length;

    if (!redCount || !blackCount) {
        checkersState.winner = redCount ? 'red' : 'black';
    } else {
        checkersState.turn = checkersState.turn === 'red' ? 'black' : 'red';
        if (!getCheckersAllMoves(checkersState.turn).length) {
            checkersState.winner = nextPiece.color;
        }
    }

    checkersSelectedSquare = null;
    renderCheckers();
    maybePlayCheckersAi();
    return true;
}

export function getCheckersAllMoves(color) {
    const moves = [];

    for (let row = 0; row < CHECKERS_SIZE; row += 1) {
        for (let col = 0; col < CHECKERS_SIZE; col += 1) {
            const piece = checkersState.board[row][col];
            if (!piece || piece.color !== color) {
                continue;
            }

            getCheckersMoves(row, col).forEach((move) => {
                moves.push({
                    fromRow: row,
                    fromCol: col,
                    ...move,
                    piece
                });
            });
        }
    }

    return moves;
}

export function maybePlayCheckersAi() {
    if (!isCheckersAiTurn()) {
        return;
    }

    if (checkersAiTimeout) {
        window.clearTimeout(checkersAiTimeout);
    }

    checkersAiTimeout = window.setTimeout(() => {
        checkersAiTimeout = null;

        if (!isCheckersAiTurn()) {
            return;
        }

        const moves = getCheckersAllMoves('black');
        if (!moves.length) {
            checkersState.winner = 'red';
            renderCheckers();
            return;
        }

        let bestScore = -Infinity;
        let bestMoves = [];

        moves.forEach((move) => {
            let score = Math.random() * 0.3;
            if (move.capture) {
                score += 10;
            }
            if (!move.piece.king && move.row === CHECKERS_SIZE - 1) {
                score += 6;
            }
            score += move.row * 0.25;
            if (move.col >= 2 && move.col <= 5) {
                score += 0.6;
            }

            if (score > bestScore) {
                bestScore = score;
                bestMoves = [move];
            } else if (Math.abs(score - bestScore) < 0.001) {
                bestMoves.push(move);
            }
        });

        const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        applyCheckersMove(selectedMove.fromRow, selectedMove.fromCol, selectedMove.row, selectedMove.col);
    }, 420);
}

export function setCheckersMode(nextMode) {
    if (isMultiplayerCheckersActive()) {
        setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
        return;
    }

    if (!nextMode || nextMode === checkersMode) {
        return;
    }

    checkersMode = nextMode;
    initializeCheckers();
}

export function syncMultiplayerCheckersState() {
    const multiplayerActiveRoom = getMultiplayerActiveRoom();
    if (!isMultiplayerCheckersActive()) {
        checkersLastFinishedStateKey = '';
        checkersLastMoveAnimationKey = '';
        checkersLastCaptureFxKey = '';
        return;
    }

    // Ferme auto le menu « Mettre prêt » quand la partie est vraiment lancée
    // et re-render à chaque sync pour que le compteur ready (X/2) se mette à jour.
    {
        const room = getMultiplayerActiveRoom();
        if (room?.gameLaunched && checkersMenuVisible && !checkersMenuResult) {
            checkersMenuVisible = false;
        }
        renderCheckersMenu();
    }

    if (checkersLastMoveResetTimer) {
        window.clearTimeout(checkersLastMoveResetTimer);
        checkersLastMoveResetTimer = null;
    }
    if (checkersAiTimeout) {
        window.clearTimeout(checkersAiTimeout);
        checkersAiTimeout = null;
    }

    checkersState = {
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
    checkersSelectedSquare = null;
    // Garde le menu visible tant que tous les joueurs n'ont pas cliqué prêt.
    checkersMenuVisible = !multiplayerActiveRoom.gameLaunched;
    checkersMenuShowingRules = false;
    checkersMenuClosing = false;
    checkersMenuResult = Boolean(multiplayerActiveRoom.gameState.winner);
    if (!checkersState.lastMove) {
        checkersLastMoveAnimationKey = '';
    }
    renderCheckers();

    const nextFinishedKey = `${multiplayerActiveRoom.gameState.round}:${multiplayerActiveRoom.gameState.winner || 'none'}`;
    if (!multiplayerActiveRoom.gameState.winner) {
        checkersLastFinishedStateKey = '';
        checkersMenuEntering = false;
        checkersMenuResult = false;
        closeGameOverModal();
        return;
    }

    if (nextFinishedKey === checkersLastFinishedStateKey || activeGameTabAccessor() !== 'checkers') {
        return;
    }

    checkersLastFinishedStateKey = nextFinishedKey;
    revealCheckersOutcomeMenu();
}

// --- Accessors for module state (parity with connect4.js) ---
export function getCheckersMode() { return checkersMode; }
export function getCheckersState() { return checkersState; }
export function getCheckersSelectedSquare() { return checkersSelectedSquare; }
export function getCheckersMenuVisible() { return checkersMenuVisible; }
export function setCheckersMenuVisible(v) { checkersMenuVisible = Boolean(v); }
export function getCheckersMenuShowingRules() { return checkersMenuShowingRules; }
export function setCheckersMenuShowingRules(v) { checkersMenuShowingRules = Boolean(v); }
export function getCheckersMenuResult() { return checkersMenuResult; }
export function setCheckersMenuResult(v) { checkersMenuResult = Boolean(v); }
export function getCheckersMenuClosing() { return checkersMenuClosing; }
