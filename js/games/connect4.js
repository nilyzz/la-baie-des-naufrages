// Game module — Coin 4 (Connect4), solo/duo/multijoueur avec IA minimax.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS, GRID_OUTCOME_MENU_DELAY_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';
import {
    getMultiplayerActiveRoom,
    getMultiplayerSocket,
    getMultiplayerReadySummary,
    isCurrentPlayerMultiplayerReady
} from '../multiplayer/state.js';
import { setMultiplayerStatus } from '../multiplayer/status.js';

export const CONNECT4_ROWS = 6;
export const CONNECT4_COLS = 7;

let connect4BoardState = [];
let connect4CurrentPlayer = 'player';
let connect4Scores = { player: 0, ai: 0 };
let connect4Finished = false;
let connect4AiTimeout = null;
let connect4Mode = 'solo';
let connect4DropAnimationKey = null;
let connect4DropAnimationState = null;
let connect4DropAnimationTimeout = null;
let connect4OutcomeWinner = null;
let connect4MenuVisible = true;
let connect4MenuShowingRules = false;
let connect4MenuClosing = false;
let connect4MenuEntering = false;
let connect4MenuResult = false;
let connect4OutcomeMenuTimeout = null;
let connect4LastFinishedStateKey = '';
let connect4LastMoveAnimationKey = '';

let activeGameTabAccessor = () => null;
export function setConnect4ActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        connect4Board: $('connect4Board'),
        connect4Table: $('connect4Table'),
        connect4TurnDisplay: $('connect4TurnDisplay'),
        connect4ScoreDisplay: $('connect4ScoreDisplay'),
        connect4HelpText: $('connect4HelpText'),
        connect4ModeButtons: document.querySelectorAll('[data-connect4-mode]'),
        connect4MenuOverlay: $('connect4MenuOverlay'),
        connect4MenuEyebrow: $('connect4MenuEyebrow'),
        connect4MenuTitle: $('connect4MenuTitle'),
        connect4MenuText: $('connect4MenuText'),
        connect4MenuActionButton: $('connect4MenuActionButton'),
        connect4MenuRulesButton: $('connect4MenuRulesButton')
    };
}

export function isMultiplayerConnect4Active() {
    const room = getMultiplayerActiveRoom();
    return room?.gameId === 'connect4' && Boolean(room?.gameState);
}

export function getMultiplayerConnect4Player() {
    return getMultiplayerActiveRoom()?.players?.find((player) => player.isYou) || null;
}

export function getMultiplayerConnect4Role() {
    return getMultiplayerConnect4Player()?.symbol || null;
}

export function getMultiplayerConnect4TurnLabel() {
    if (connect4Finished) {
        return '-';
    }

    const currentRole = getMultiplayerConnect4Role();
    if (!currentRole) {
        return connect4CurrentPlayer === 'player' ? 'Joueur 1' : 'Joueur 2';
    }

    return connect4CurrentPlayer === currentRole ? 'Toi' : 'Adversaire';
}

export function getMultiplayerConnect4ScoreLabel() {
    const currentRole = getMultiplayerConnect4Role();

    if (currentRole === 'ai') {
        return `Toi ${connect4Scores.ai} - ${connect4Scores.player} Adv.`;
    }

    return `Toi ${connect4Scores.player} - ${connect4Scores.ai} Adv.`;
}

export function getMultiplayerConnect4HelpText() {
    const room = getMultiplayerActiveRoom();
    const playerCount = room?.playerCount || 0;
    const currentRole = getMultiplayerConnect4Role();

    if (playerCount < 2) {
        return "En attente d'un adversaire pour lancer la manche.";
    }

    if (connect4Finished) {
        if (room?.gameState?.winner === 'draw') {
            return 'La grille est pleine. Relance une manche pour vous départager.';
        }

        if (room?.gameState?.winner === currentRole) {
            return 'Victoire. Tu controles la colonne du pont.';
        }

        return "D\u00e9faite. L'adversaire aligne quatre jetons.";
    }

    if (!currentRole) {
        return 'La manche est en cours entre les deux joueurs.';
    }

    return connect4CurrentPlayer === currentRole
        ? '\u00c0 toi de jouer.'
        : "Au tour de l'adversaire.";
}

export function getConnect4RulesText() {
    return "Largue un jeton dans une colonne pour former une ligne de quatre, à l'horizontale, à la verticale ou en diagonale avant ton rival.";
}

export function renderConnect4Menu() {
    const { connect4MenuOverlay, connect4Table, connect4MenuEyebrow, connect4MenuTitle, connect4MenuText, connect4MenuActionButton, connect4MenuRulesButton } = dom();
    if (!connect4MenuOverlay || !connect4Table) {
        return;
    }

    syncGameMenuOverlayBounds(connect4MenuOverlay, connect4Table);
    connect4MenuOverlay.classList.toggle('hidden', !connect4MenuVisible);
    connect4MenuOverlay.classList.toggle('is-closing', connect4MenuClosing);
    connect4MenuOverlay.classList.toggle('is-entering', connect4MenuEntering);
    connect4Table.classList.toggle('is-menu-open', connect4MenuVisible);

    if (!connect4MenuVisible) {
        return;
    }

    const room = getMultiplayerActiveRoom();
    const multiplayerConnect4 = isMultiplayerConnect4Active();
    const hasResult = connect4MenuResult && connect4Finished;
    const winner = multiplayerConnect4 ? room?.gameState?.winner : connect4OutcomeWinner;
    if (connect4MenuEyebrow) {
        connect4MenuEyebrow.textContent = connect4MenuShowingRules ? 'R\u00e8gles' : (hasResult ? 'Fin de manche' : 'Pont des corsaires');
    }
    if (connect4MenuTitle) {
        connect4MenuTitle.textContent = connect4MenuShowingRules
            ? 'Rappel rapide'
            : (hasResult
                ? (multiplayerConnect4
                    ? (winner === 'draw' ? 'Match nul' : (winner === getMultiplayerConnect4Role() ? 'Victoire' : "C'est perdu"))
                    : (connect4Mode === 'duo'
                        ? (winner === 'draw' ? 'Match nul' : `${winner === 'player' ? 'Joueur 1' : 'Joueur 2'} gagne`)
                        : (winner === 'draw' ? 'Match nul' : (winner === 'player' ? 'Victoire' : "C'est perdu"))))
                : 'Coin 4');
    }
    if (connect4MenuText) {
        connect4MenuText.textContent = connect4MenuShowingRules
            ? getConnect4RulesText()
            : (hasResult
                ? (multiplayerConnect4
                    ? (winner === 'draw'
                        ? 'La grille est pleine. Il faudra relancer une manche pour vous départager.'
                        : (winner === getMultiplayerConnect4Role()
                            ? 'Tu remportes cette manche de Coin 4 en ligne.'
                            : "L'adversaire remporte cette manche de Coin 4."))
                    : (connect4Mode === 'duo'
                        ? (winner === 'draw'
                            ? "La grille est pleine. Aucun des deux capitaines ne prend l'avantage."
                            : `Le ${winner === 'player' ? 'joueur 1' : 'joueur 2'} aligne quatre jetons.`)
                        : (winner === 'draw'
                            ? 'La grille est pleine. La manche se termine sans vainqueur.'
                            : (winner === 'player'
                                ? 'Tu remportes cette manche de Coin 4.'
                                : "L'IA remporte cette manche de Coin 4."))))
                : ((multiplayerConnect4 && !room?.gameLaunched)
                    ? 'Quand tous les joueurs sont pr\u00eats, la manche de Coin 4 se lance automatiquement.'
                    : 'Choisis ton mode puis prends possession du pont en alignant quatre jetons avant ton rival.'));
    }
    if (connect4MenuActionButton) {
        connect4MenuActionButton.textContent = connect4MenuShowingRules
            ? 'Retour'
            : ((multiplayerConnect4 && !room?.gameLaunched)
                ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie'));
    }
    if (connect4MenuRulesButton) {
        connect4MenuRulesButton.textContent = 'R\u00e8gles';
        connect4MenuRulesButton.hidden = connect4MenuShowingRules;
    }
}

export function startConnect4LaunchSequence() {
    connect4MenuClosing = true;
    renderConnect4Menu();
    window.setTimeout(() => {
        connect4MenuClosing = false;
        connect4MenuVisible = false;
        connect4MenuShowingRules = false;
        connect4MenuEntering = false;
        connect4MenuResult = false;
        renderConnect4Menu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealConnect4OutcomeMenu() {
    connect4MenuVisible = true;
    connect4MenuResult = true;
    connect4MenuShowingRules = false;
    connect4MenuClosing = false;
    connect4MenuEntering = true;
    renderConnect4Menu();
    window.setTimeout(() => {
        connect4MenuEntering = false;
        renderConnect4Menu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealConnect4OutcomeMenuWithDelay() {
    if (connect4OutcomeMenuTimeout) {
        window.clearTimeout(connect4OutcomeMenuTimeout);
        connect4OutcomeMenuTimeout = null;
    }

    connect4MenuVisible = false;
    connect4MenuShowingRules = false;
    connect4MenuClosing = false;
    connect4MenuEntering = false;
    renderConnect4Menu();

    connect4OutcomeMenuTimeout = window.setTimeout(() => {
        connect4OutcomeMenuTimeout = null;
        revealConnect4OutcomeMenu();
    }, GRID_OUTCOME_MENU_DELAY_MS);
}

export function syncMultiplayerConnect4State() {
    const room = getMultiplayerActiveRoom();
    if (!isMultiplayerConnect4Active()) {
        connect4LastFinishedStateKey = '';
        connect4LastMoveAnimationKey = '';
        connect4OutcomeWinner = null;
        return;
    }

    // Ferme auto le menu « Mettre prêt » quand la partie est vraiment lancée.
    {
        const room = getMultiplayerActiveRoom();
        if (room?.gameLaunched && connect4MenuVisible && !connect4MenuResult) {
            connect4MenuVisible = false;
            renderConnect4Menu();
        }
    }

    if (connect4AiTimeout) {
        window.clearTimeout(connect4AiTimeout);
        connect4AiTimeout = null;
    }

    if (connect4DropAnimationTimeout) {
        window.clearTimeout(connect4DropAnimationTimeout);
        connect4DropAnimationTimeout = null;
    }

    closeGameOverModal();
    connect4BoardState = Array.isArray(room.gameState.board)
        ? room.gameState.board.map((row) => [...row])
        : Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(null));
    connect4CurrentPlayer = room.gameState.currentPlayer || 'player';
    connect4Finished = Boolean(room.gameState.finished);
    connect4Scores = {
        player: Number(room.gameState.scores?.player || 0),
        ai: Number(room.gameState.scores?.ai || 0)
    };
    connect4DropAnimationKey = null;
    connect4DropAnimationState = null;
    connect4OutcomeWinner = room.gameState.winner || null;
    connect4MenuVisible = false;
    connect4MenuShowingRules = false;
    connect4MenuClosing = false;
    connect4MenuResult = connect4Finished;

    if (connect4OutcomeMenuTimeout) {
        window.clearTimeout(connect4OutcomeMenuTimeout);
        connect4OutcomeMenuTimeout = null;
    }

    renderConnect4();

    const lastMove = room.gameState.lastMove;
    const nextAnimationKey = lastMove ? `${room.gameState.round}:${lastMove.row}:${lastMove.col}:${lastMove.token}` : '';

    if (lastMove && nextAnimationKey !== connect4LastMoveAnimationKey) {
        window.requestAnimationFrame(() => {
            playConnect4DropAnimation(lastMove.row, lastMove.col, lastMove.token);
        });
    }
    connect4LastMoveAnimationKey = nextAnimationKey;

    if (Array.isArray(room.gameState.winningLine)) {
        highlightConnect4Line(room.gameState.winningLine);
    }

    updateConnect4Hud();

    if (!connect4Finished) {
        connect4LastFinishedStateKey = '';
        connect4MenuResult = false;
        return;
    }

    const finishedStateKey = `${room.gameState.round}:${room.gameState.winner}`;
    if (finishedStateKey === connect4LastFinishedStateKey) {
        return;
    }

    connect4LastFinishedStateKey = finishedStateKey;

    if (activeGameTabAccessor() !== 'connect4') {
        return;
    }
    revealConnect4OutcomeMenuWithDelay();
}

export function updateConnect4Hud() {
    const { connect4TurnDisplay, connect4ScoreDisplay, connect4HelpText, connect4ModeButtons } = dom();
    if (isMultiplayerConnect4Active()) {
        if (connect4TurnDisplay) connect4TurnDisplay.textContent = getMultiplayerConnect4TurnLabel();
        if (connect4ScoreDisplay) connect4ScoreDisplay.textContent = getMultiplayerConnect4ScoreLabel();
        if (connect4HelpText) connect4HelpText.textContent = getMultiplayerConnect4HelpText();
        connect4ModeButtons.forEach((button) => {
            button.classList.remove('is-active');
            button.disabled = true;
        });
        return;
    }

    const currentPlayerLabel = connect4CurrentPlayer === 'player'
        ? (connect4Mode === 'duo' ? 'Joueur 1' : 'Toi')
        : (connect4Mode === 'duo' ? 'Joueur 2' : 'IA');
    if (connect4TurnDisplay) connect4TurnDisplay.textContent = currentPlayerLabel;
    if (connect4ScoreDisplay) connect4ScoreDisplay.textContent = connect4Mode === 'duo'
        ? `J1 ${connect4Scores.player} - ${connect4Scores.ai} J2`
        : `Toi ${connect4Scores.player} - ${connect4Scores.ai} IA`;
    if (connect4HelpText) connect4HelpText.textContent = connect4Mode === 'duo'
        ? 'Mode 2 joueurs: cliquez chacun votre tour sur une colonne pour faire tomber un jeton.'
        : "Mode 1 joueur: clique une colonne pour y larguer un jeton contre l'IA.";
    connect4ModeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.connect4Mode === connect4Mode);
        button.disabled = false;
    });
}

export function renderConnect4() {
    const { connect4Board } = dom();
    if (!connect4Board) return;
    connect4Board.innerHTML = `${connect4BoardState.map((row, rowIndex) => row.map((cell, colIndex) => `
        <button
            type="button"
            class="connect4-cell${cell === 'player' ? ' is-player' : ''}${cell === 'ai' ? ' is-ai' : ''}${connect4DropAnimationKey === `${rowIndex}-${colIndex}` ? ' is-drop-target' : ''}"
            data-row="${rowIndex}"
            data-col="${colIndex}"
            ${cell ? `data-connect4-token="${cell}"` : ''}
            aria-label="Colonne ${colIndex + 1}"
        ></button>
    `).join('')).join('')}
    ${connect4DropAnimationState ? `
        <div
            class="connect4-drop-piece ${connect4DropAnimationState.token === 'player' ? 'is-player' : 'is-ai'}"
            style="left: ${connect4DropAnimationState.left}px; top: ${connect4DropAnimationState.top}px; width: ${connect4DropAnimationState.size}px; height: ${connect4DropAnimationState.size}px; --connect4-drop-distance: ${connect4DropAnimationState.distance}px;"
            aria-hidden="true"
        ><span class="connect4-drop-piece-skull">&#9760;</span></div>
    ` : ''}`;
    renderConnect4Menu();
}

export function initializeConnect4() {
    if (isMultiplayerConnect4Active()) {
        const room = getMultiplayerActiveRoom();
        connect4MenuVisible = !room?.gameLaunched;
        connect4MenuShowingRules = false;
        connect4MenuClosing = false;
        connect4MenuEntering = false;
        renderConnect4Menu();
        syncMultiplayerConnect4State();
        return;
    }

    if (connect4AiTimeout) {
        window.clearTimeout(connect4AiTimeout);
        connect4AiTimeout = null;
    }
    if (connect4DropAnimationTimeout) {
        window.clearTimeout(connect4DropAnimationTimeout);
        connect4DropAnimationTimeout = null;
    }

    closeGameOverModal();
    connect4BoardState = Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(null));
    connect4CurrentPlayer = 'player';
    connect4Finished = false;
    connect4DropAnimationKey = null;
    connect4DropAnimationState = null;
    connect4OutcomeWinner = null;
    connect4MenuVisible = true;
    connect4MenuShowingRules = false;
    connect4MenuClosing = false;
    connect4MenuEntering = false;
    connect4MenuResult = false;
    if (connect4OutcomeMenuTimeout) {
        window.clearTimeout(connect4OutcomeMenuTimeout);
        connect4OutcomeMenuTimeout = null;
    }
    updateConnect4Hud();
    renderConnect4();
}

export function getConnect4DropRow(col) {
    for (let row = CONNECT4_ROWS - 1; row >= 0; row -= 1) {
        if (!connect4BoardState[row][col]) {
            return row;
        }
    }

    return -1;
}

export function getConnect4Winner(board, token) {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (let row = 0; row < CONNECT4_ROWS; row += 1) {
        for (let col = 0; col < CONNECT4_COLS; col += 1) {
            if (board[row][col] !== token) {
                continue;
            }

            for (const [rowOffset, colOffset] of directions) {
                const line = [[row, col]];

                for (let step = 1; step < 4; step += 1) {
                    const nextRow = row + (rowOffset * step);
                    const nextCol = col + (colOffset * step);

                    if (
                        nextRow < 0
                        || nextRow >= CONNECT4_ROWS
                        || nextCol < 0
                        || nextCol >= CONNECT4_COLS
                        || board[nextRow][nextCol] !== token
                    ) {
                        break;
                    }

                    line.push([nextRow, nextCol]);
                }

                if (line.length === 4) {
                    return line;
                }
            }
        }
    }

    return null;
}

function getConnect4DropRowForBoard(board, col) {
    for (let row = CONNECT4_ROWS - 1; row >= 0; row -= 1) {
        if (!board[row][col]) {
            return row;
        }
    }

    return -1;
}

function cloneConnect4Board(board) {
    return board.map((row) => [...row]);
}

function getConnect4AvailableColumns(board) {
    return Array.from({ length: CONNECT4_COLS }, (_, index) => index)
        .filter((col) => getConnect4DropRowForBoard(board, col) !== -1);
}

function dropConnect4TokenOnBoard(board, col, token) {
    const row = getConnect4DropRowForBoard(board, col);
    if (row === -1) {
        return null;
    }

    const nextBoard = cloneConnect4Board(board);
    nextBoard[row][col] = token;
    return { board: nextBoard, row };
}

function evaluateConnect4Window(windowCells) {
    const aiCount = windowCells.filter((cell) => cell === 'ai').length;
    const playerCount = windowCells.filter((cell) => cell === 'player').length;
    const emptyCount = windowCells.filter((cell) => !cell).length;

    if (aiCount && playerCount) {
        return 0;
    }

    if (aiCount === 4) {
        return 100000;
    }

    if (playerCount === 4) {
        return -100000;
    }

    if (aiCount === 3 && emptyCount === 1) {
        return 120;
    }

    if (aiCount === 2 && emptyCount === 2) {
        return 18;
    }

    if (playerCount === 3 && emptyCount === 1) {
        return -135;
    }

    if (playerCount === 2 && emptyCount === 2) {
        return -20;
    }

    if (aiCount === 1 && emptyCount === 3) {
        return 4;
    }

    if (playerCount === 1 && emptyCount === 3) {
        return -4;
    }

    return 0;
}

function evaluateConnect4Board(board) {
    let score = 0;
    const centerCol = Math.floor(CONNECT4_COLS / 2);
    const centerCells = board.map((row) => row[centerCol]);
    score += centerCells.filter((cell) => cell === 'ai').length * 9;
    score -= centerCells.filter((cell) => cell === 'player').length * 9;

    for (let row = 0; row < CONNECT4_ROWS; row += 1) {
        for (let col = 0; col <= CONNECT4_COLS - 4; col += 1) {
            score += evaluateConnect4Window([
                board[row][col],
                board[row][col + 1],
                board[row][col + 2],
                board[row][col + 3]
            ]);
        }
    }

    for (let row = 0; row <= CONNECT4_ROWS - 4; row += 1) {
        for (let col = 0; col < CONNECT4_COLS; col += 1) {
            score += evaluateConnect4Window([
                board[row][col],
                board[row + 1][col],
                board[row + 2][col],
                board[row + 3][col]
            ]);
        }
    }

    for (let row = 0; row <= CONNECT4_ROWS - 4; row += 1) {
        for (let col = 0; col <= CONNECT4_COLS - 4; col += 1) {
            score += evaluateConnect4Window([
                board[row][col],
                board[row + 1][col + 1],
                board[row + 2][col + 2],
                board[row + 3][col + 3]
            ]);
        }
    }

    for (let row = 0; row <= CONNECT4_ROWS - 4; row += 1) {
        for (let col = 3; col < CONNECT4_COLS; col += 1) {
            score += evaluateConnect4Window([
                board[row][col],
                board[row + 1][col - 1],
                board[row + 2][col - 2],
                board[row + 3][col - 3]
            ]);
        }
    }

    return score;
}

function minimaxConnect4(board, depth, maximizingPlayer, alpha, beta) {
    if (getConnect4Winner(board, 'ai')) {
        return 1000000 + depth;
    }

    if (getConnect4Winner(board, 'player')) {
        return -1000000 - depth;
    }

    const availableCols = getConnect4AvailableColumns(board);
    if (!availableCols.length) {
        return 0;
    }

    if (depth === 0) {
        return evaluateConnect4Board(board);
    }

    if (maximizingPlayer) {
        let bestScore = -Infinity;

        for (const col of availableCols) {
            const nextMove = dropConnect4TokenOnBoard(board, col, 'ai');
            if (!nextMove) {
                continue;
            }

            const score = minimaxConnect4(nextMove.board, depth - 1, false, alpha, beta);
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);

            if (beta <= alpha) {
                break;
            }
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const col of availableCols) {
        const nextMove = dropConnect4TokenOnBoard(board, col, 'player');
        if (!nextMove) {
            continue;
        }

        const score = minimaxConnect4(nextMove.board, depth - 1, true, alpha, beta);
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);

        if (beta <= alpha) {
            break;
        }
    }

    return bestScore;
}

export function highlightConnect4Line(line) {
    const { connect4Board } = dom();
    line.forEach(([row, col]) => {
        connect4Board?.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.classList.add('is-winning');
    });
}

export function playConnect4DropAnimation(row, col, token) {
    const { connect4Board } = dom();
    connect4DropAnimationKey = `${row}-${col}`;
    renderConnect4();
    const targetCell = connect4Board?.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if (targetCell) {
        const boardPaddingTop = Number.parseFloat(window.getComputedStyle(connect4Board).paddingTop) || 0;
        connect4DropAnimationState = {
            token,
            left: targetCell.offsetLeft,
            top: targetCell.offsetTop,
            size: targetCell.offsetWidth,
            distance: Math.max(0, targetCell.offsetTop - boardPaddingTop + 6)
        };
        renderConnect4();
    }

    if (connect4DropAnimationTimeout) {
        window.clearTimeout(connect4DropAnimationTimeout);
    }

    connect4DropAnimationTimeout = window.setTimeout(() => {
        if (connect4DropAnimationKey === `${row}-${col}`) {
            connect4DropAnimationKey = null;
            connect4DropAnimationState = null;
            renderConnect4();

            const room = getMultiplayerActiveRoom();
            if (isMultiplayerConnect4Active() && Array.isArray(room.gameState.winningLine)) {
                highlightConnect4Line(room.gameState.winningLine);
            }
        }
        connect4DropAnimationTimeout = null;
    }, 380);
}

function chooseConnect4AiColumn() {
    const availableCols = getConnect4AvailableColumns(connect4BoardState);

    for (const col of availableCols) {
        const preview = dropConnect4TokenOnBoard(connect4BoardState, col, 'ai');
        if (preview && getConnect4Winner(preview.board, 'ai')) {
            return col;
        }
    }

    for (const col of availableCols) {
        const preview = dropConnect4TokenOnBoard(connect4BoardState, col, 'player');
        if (preview && getConnect4Winner(preview.board, 'player')) {
            return col;
        }
    }

    let bestScore = -Infinity;
    let bestColumns = [];

    availableCols.forEach((col) => {
        const preview = dropConnect4TokenOnBoard(connect4BoardState, col, 'ai');
        if (!preview) {
            return;
        }

        let score = minimaxConnect4(preview.board, 4, false, -Infinity, Infinity);
        score += (3 - Math.abs(3 - col)) * 4;
        score += Math.random() * 0.18;

        if (score > bestScore) {
            bestScore = score;
            bestColumns = [col];
        } else if (Math.abs(score - bestScore) < 0.001) {
            bestColumns.push(col);
        }
    });

    const preferred = [3, 2, 4, 1, 5, 0, 6];
    return preferred.find((col) => bestColumns.includes(col))
        ?? bestColumns[Math.floor(Math.random() * bestColumns.length)]
        ?? availableCols[0];
}

function finishConnect4(winner, line = null) {
    const { connect4HelpText } = dom();
    connect4Finished = true;
    connect4OutcomeWinner = winner;

    if (line) {
        highlightConnect4Line(line);
    }

    if (winner === 'player') {
        connect4Scores.player += 1;
        if (connect4HelpText) connect4HelpText.textContent = connect4Mode === 'duo' ? 'Le joueur 1 aligne quatre jetons.' : 'Victoire. Tu controles la colonne du pont.';
    } else if (winner === 'ai') {
        connect4Scores.ai += 1;
        if (connect4HelpText) connect4HelpText.textContent = connect4Mode === 'duo' ? 'Le joueur 2 aligne quatre jetons.' : "L'IA a aligne quatre jetons.";
    } else {
        if (connect4HelpText) connect4HelpText.textContent = "La grille est pleine. Aucun navire ne prend l'avantage.";
    }

    updateConnect4Hud();
    revealConnect4OutcomeMenuWithDelay();
}

function dropConnect4Token(col, token) {
    const row = getConnect4DropRow(col);

    if (row === -1) {
        return false;
    }

    connect4BoardState[row][col] = token;
    playConnect4DropAnimation(row, col, token);

    const winningLine = getConnect4Winner(connect4BoardState, token);

    if (winningLine) {
        finishConnect4(token, winningLine);
        return true;
    }

    if (connect4BoardState.every((line) => line.every(Boolean))) {
        finishConnect4('draw');
    }

    return true;
}

function runConnect4AiTurn() {
    if (connect4Finished || connect4Mode !== 'solo') {
        return;
    }

    const { connect4HelpText } = dom();
    dropConnect4Token(chooseConnect4AiColumn(), 'ai');
    connect4CurrentPlayer = 'player';
    updateConnect4Hud();

    if (!connect4Finished) {
        if (connect4HelpText) connect4HelpText.textContent = 'Ton tour. Choisis la meilleure colonne.';
    }
}

export function handleConnect4Move(col) {
    const { connect4HelpText } = dom();
    if (connect4MenuVisible || connect4MenuClosing) {
        return;
    }

    if (isMultiplayerConnect4Active()) {
        const socket = getMultiplayerSocket();
        if (!socket?.connected) {
            setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
            return;
        }

        socket.emit('connect4:move', { col });
        return;
    }

    if (connect4Finished || connect4CurrentPlayer !== 'player') {
        if (!(connect4Mode === 'duo' && !connect4Finished && connect4CurrentPlayer === 'ai')) {
            return;
        }
    }

    const activeToken = connect4CurrentPlayer;

    if (!dropConnect4Token(col, activeToken) || connect4Finished) {
        updateConnect4Hud();
        return;
    }

    if (connect4Mode === 'duo') {
        connect4CurrentPlayer = activeToken === 'player' ? 'ai' : 'player';
        updateConnect4Hud();
        return;
    }

    connect4CurrentPlayer = 'ai';
    if (connect4HelpText) connect4HelpText.textContent = "L'IA calcule sa r\u00e9ponse...";
    updateConnect4Hud();
    connect4AiTimeout = window.setTimeout(() => {
        connect4AiTimeout = null;
        runConnect4AiTurn();
    }, 320);
}

export function setConnect4Mode(nextMode) {
    if (isMultiplayerConnect4Active()) {
        setMultiplayerStatus('Le mode est piloté par la room en ligne.');
        return;
    }

    if (!['solo', 'duo'].includes(nextMode)) {
        return;
    }

    connect4Mode = nextMode;
    connect4Scores = { player: 0, ai: 0 };
    initializeConnect4();
}

export function getConnect4Mode() { return connect4Mode; }
export function getConnect4Finished() { return connect4Finished; }
export function getConnect4BoardState() { return connect4BoardState; }
export function getConnect4MenuVisible() { return connect4MenuVisible; }
export function setConnect4MenuVisible(v) { connect4MenuVisible = Boolean(v); }
export function setConnect4MenuShowingRules(v) { connect4MenuShowingRules = Boolean(v); }
export function getConnect4MenuShowingRules() { return connect4MenuShowingRules; }
export function getConnect4MenuResult() { return connect4MenuResult; }
