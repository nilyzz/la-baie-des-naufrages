// Game module — Morpion (Tic-Tac-Toe), solo + duo + multijoueur.
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

let ticTacToeBoardState = Array(9).fill('');
let ticTacToeRenderedBoardState = Array(9).fill('');
let ticTacToeCurrentPlayer = 'anchor';
let ticTacToeScores = { anchor: 0, skull: 0 };
let ticTacToeFinished = false;
let ticTacToeMode = 'solo';
let ticTacToeAiTimeout = null;
let ticTacToeMenuVisible = true;
let ticTacToeMenuShowingRules = false;
let ticTacToeMenuClosing = false;
let ticTacToeMenuEntering = false;
let ticTacToeMenuResult = null;
let ticTacToeOutcomeMenuTimeout = null;
let ticTacToeLastFinishedStateKey = '';

let activeGameTabAccessor = () => null;
export function setTicTacToeActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        ticTacToeBoard: $('ticTacToeBoard'),
        ticTacToeTable: $('ticTacToeTable'),
        ticTacToeTurnDisplay: $('ticTacToeTurnDisplay'),
        ticTacToeScoreDisplay: $('ticTacToeScoreDisplay'),
        ticTacToeHelpText: $('ticTacToeHelpText'),
        ticTacToeRestartButton: $('ticTacToeRestartButton'),
        ticTacToeModeButtons: document.querySelectorAll('[data-tictactoe-mode]'),
        ticTacToeMenuOverlay: $('ticTacToeMenuOverlay'),
        ticTacToeMenuEyebrow: $('ticTacToeMenuEyebrow'),
        ticTacToeMenuTitle: $('ticTacToeMenuTitle'),
        ticTacToeMenuText: $('ticTacToeMenuText'),
        ticTacToeMenuActionButton: $('ticTacToeMenuActionButton'),
        ticTacToeMenuRulesButton: $('ticTacToeMenuRulesButton')
    };
}

export function isMultiplayerTicTacToeActive() {
    const room = getMultiplayerActiveRoom();
    return room?.gameId === 'ticTacToe' && Boolean(room?.gameState);
}

export function getMultiplayerTicTacToePlayer() {
    return getMultiplayerActiveRoom()?.players?.find((player) => player.isYou) || null;
}

export function getMultiplayerTicTacToeRole() {
    return getMultiplayerTicTacToePlayer()?.symbol || null;
}

export function getMultiplayerTicTacToeTurnLabel() {
    if (ticTacToeFinished) {
        return '-';
    }

    const currentRole = getMultiplayerTicTacToeRole();
    if (!currentRole) {
        return ticTacToeCurrentPlayer === 'anchor' ? 'Joueur 1' : 'Joueur 2';
    }

    return ticTacToeCurrentPlayer === currentRole ? 'Toi' : 'Adversaire';
}

export function getMultiplayerTicTacToeScoreLabel() {
    const currentRole = getMultiplayerTicTacToeRole();

    if (currentRole === 'skull') {
        return `Toi ${ticTacToeScores.skull} - ${ticTacToeScores.anchor} Adv.`;
    }

    return `Toi ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} Adv.`;
}

export function getMultiplayerTicTacToeHelpText() {
    const room = getMultiplayerActiveRoom();
    const playerCount = room?.playerCount || 0;
    const currentRole = getMultiplayerTicTacToeRole();

    if (playerCount < 2) {
        return "En attente d'un adversaire pour lancer la manche.";
    }

    if (ticTacToeFinished) {
        if (room?.gameState?.winner === 'draw') {
            return 'Match nul. Relance une manche pour vous départager.';
        }

        if (room?.gameState?.winner === currentRole) {
            return 'Victoire. Ton \u00e9quipage tient le pont.';
        }

        return "D\u00e9faite. L'adversaire prend le pont.";
    }

    if (!currentRole) {
        return 'La manche est en cours entre les deux joueurs.';
    }

    return ticTacToeCurrentPlayer === currentRole
        ? '\u00c0 toi de jouer.'
        : "Au tour de l'adversaire.";
}

export function updateTicTacToeHud() {
    const { ticTacToeTurnDisplay, ticTacToeScoreDisplay, ticTacToeHelpText, ticTacToeModeButtons } = dom();
    if (isMultiplayerTicTacToeActive()) {
        if (ticTacToeTurnDisplay) ticTacToeTurnDisplay.textContent = getMultiplayerTicTacToeTurnLabel();
        if (ticTacToeScoreDisplay) ticTacToeScoreDisplay.textContent = getMultiplayerTicTacToeScoreLabel();
        if (ticTacToeHelpText) ticTacToeHelpText.textContent = getMultiplayerTicTacToeHelpText();
        ticTacToeModeButtons.forEach((button) => {
            button.classList.remove('is-active');
            button.disabled = true;
        });
        return;
    }

    if (ticTacToeTurnDisplay) ticTacToeTurnDisplay.textContent = ticTacToeFinished
        ? '-'
        : (ticTacToeCurrentPlayer === 'anchor'
            ? (ticTacToeMode === 'duo' ? 'Joueur 1' : 'Toi')
            : (ticTacToeMode === 'duo' ? 'Joueur 2' : 'IA'));
    if (ticTacToeScoreDisplay) ticTacToeScoreDisplay.textContent = ticTacToeMode === 'duo'
        ? `J1 ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} J2`
        : `Toi ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} IA`;
    if (ticTacToeHelpText) ticTacToeHelpText.textContent = ticTacToeMode === 'duo'
        ? 'Mode 2 joueurs : jouez chacun votre tour sur la même grille.'
        : "Mode 1 joueur: aligne trois symboles contre l'IA pirate.";
    ticTacToeModeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.tictactoeMode === ticTacToeMode);
        button.disabled = false;
    });
}

export function renderTicTacToeBoard() {
    const { ticTacToeBoard } = dom();
    if (!ticTacToeBoard) return;
    const winningLine = getTicTacToeWinner() || [];
    ticTacToeBoard.innerHTML = ticTacToeBoardState.map((cell, index) => {
        const isNewMove = Boolean(cell) && ticTacToeRenderedBoardState[index] !== cell;
        const isWinningCell = winningLine.includes(index);
        return `
        <button
            type="button"
            class="tictactoe-cell${cell ? ` is-${cell}` : ''}${isNewMove ? ' is-new-move' : ''}${isWinningCell ? ' is-winning-cell' : ''}"
            data-index="${index}"
            aria-label="${cell ? (cell === 'anchor' ? 'Case ancre' : 'Case pirate') : 'Case vide'}"
        >
            <span aria-hidden="true">${cell === 'anchor' ? '\u2693' : cell === 'skull' ? '\u2620' : ''}</span>
        </button>
    `;
    }).join('');
    ticTacToeRenderedBoardState = [...ticTacToeBoardState];
}

export function getTicTacToeRulesText() {
    return "Placez chacun votre symbole à tour de rôle. Le premier à aligner trois cases gagne la manche. En solo, tu affrontes l'IA pirate.";
}

export function renderTicTacToeMenu() {
    const { ticTacToeMenuOverlay, ticTacToeTable, ticTacToeMenuEyebrow, ticTacToeMenuTitle, ticTacToeMenuText, ticTacToeMenuActionButton, ticTacToeMenuRulesButton } = dom();
    if (!ticTacToeMenuOverlay || !ticTacToeTable) {
        return;
    }

    syncGameMenuOverlayBounds(ticTacToeMenuOverlay, ticTacToeTable);
    ticTacToeMenuOverlay.classList.toggle('hidden', !ticTacToeMenuVisible);
    ticTacToeMenuOverlay.classList.toggle('is-closing', ticTacToeMenuClosing);
    ticTacToeMenuOverlay.classList.toggle('is-entering', ticTacToeMenuEntering);
    ticTacToeTable.classList.toggle('is-menu-open', ticTacToeMenuVisible);

    if (!ticTacToeMenuVisible) {
        return;
    }

    const room = getMultiplayerActiveRoom();
    const isOutcome = Boolean(ticTacToeMenuResult);

    if (ticTacToeMenuEyebrow) {
        ticTacToeMenuEyebrow.textContent = ticTacToeMenuShowingRules
            ? 'R\u00e8gles'
            : (isOutcome ? 'Fin de manche' : 'Baie strat\u00e9gique');
    }

    if (ticTacToeMenuTitle) {
        ticTacToeMenuTitle.textContent = ticTacToeMenuShowingRules
            ? 'Rappel rapide'
            : (ticTacToeMenuResult === 'win'
                ? 'Victoire'
                : (ticTacToeMenuResult === 'loss'
                    ? 'D\u00e9faite'
                    : (ticTacToeMenuResult === 'draw' ? 'Match nul' : 'Morpion')));
    }

    if (ticTacToeMenuText) {
        ticTacToeMenuText.textContent = ticTacToeMenuShowingRules
            ? getTicTacToeRulesText()
            : (ticTacToeMenuResult === 'win'
                ? (ticTacToeMode === 'duo' ? 'Le joueur 1 prend le pont. Relancez une nouvelle manche.' : 'Ton \u00e9quipage tient le pont. Relance une nouvelle manche.')
                : (ticTacToeMenuResult === 'loss'
                    ? (ticTacToeMode === 'duo' ? 'Le joueur 2 prend le pont. Relancez une nouvelle manche.' : "L'IA pirate prend le pont. Relance une nouvelle manche.")
                    : (ticTacToeMenuResult === 'draw'
                        ? "Personne ne prend l'avantage. Relance une nouvelle manche."
                        : ((isMultiplayerTicTacToeActive() && !room?.gameLaunched)
                            ? 'Quand tous les joueurs sont pr\u00eats, la manche de morpion commence automatiquement.'
                            : "Aligne trois symboles avant l'\u00e9quipage adverse pour prendre le pont."))));
    }

    if (ticTacToeMenuActionButton) {
        ticTacToeMenuActionButton.textContent = ticTacToeMenuShowingRules
            ? 'Retour'
            : ((isMultiplayerTicTacToeActive() && !room?.gameLaunched)
                ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                : (isOutcome ? 'Relancer la partie' : 'Lancer la partie'));
    }

    if (ticTacToeMenuRulesButton) {
        ticTacToeMenuRulesButton.textContent = 'R\u00e8gles';
        ticTacToeMenuRulesButton.hidden = ticTacToeMenuShowingRules;
    }
}

export function closeTicTacToeMenu() {
    ticTacToeMenuClosing = true;
    ticTacToeMenuEntering = false;
    renderTicTacToeMenu();
    window.setTimeout(() => {
        ticTacToeMenuClosing = false;
        ticTacToeMenuVisible = false;
        ticTacToeMenuShowingRules = false;
        ticTacToeMenuEntering = false;
        renderTicTacToeMenu();
    }, 220);
}

export function showTicTacToeMenu() {
    ticTacToeMenuVisible = true;
    ticTacToeMenuShowingRules = false;
    ticTacToeMenuClosing = false;
    ticTacToeMenuEntering = true;
    renderTicTacToeMenu();
    window.setTimeout(() => {
        ticTacToeMenuEntering = false;
        renderTicTacToeMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function showTicTacToeMenuWithDelay() {
    if (ticTacToeOutcomeMenuTimeout) {
        window.clearTimeout(ticTacToeOutcomeMenuTimeout);
        ticTacToeOutcomeMenuTimeout = null;
    }

    ticTacToeMenuVisible = false;
    ticTacToeMenuShowingRules = false;
    ticTacToeMenuClosing = false;
    ticTacToeMenuEntering = false;
    renderTicTacToeMenu();

    ticTacToeOutcomeMenuTimeout = window.setTimeout(() => {
        ticTacToeOutcomeMenuTimeout = null;
        showTicTacToeMenu();
    }, GRID_OUTCOME_MENU_DELAY_MS);
}

export function getTicTacToeWinner() {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return lines.find(([a, b, c]) => {
        return ticTacToeBoardState[a]
            && ticTacToeBoardState[a] === ticTacToeBoardState[b]
            && ticTacToeBoardState[a] === ticTacToeBoardState[c];
    }) || null;
}

export function getTicTacToeWinnerForBoard(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return lines.find(([a, b, c]) => (
        board[a]
        && board[a] === board[b]
        && board[a] === board[c]
    )) || null;
}

export function getTicTacToeEmptyCells() {
    return ticTacToeBoardState
        .map((value, index) => value ? null : index)
        .filter((value) => value !== null);
}

export function getBestTicTacToeAiMove() {
    const emptyCells = getTicTacToeEmptyCells();
    if (!emptyCells.length) {
        return null;
    }

    const aiPlayer = 'skull';
    const humanPlayer = 'anchor';
    const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

    const findFinishingMove = (player) => emptyCells.find((index) => {
        const board = [...ticTacToeBoardState];
        board[index] = player;
        return Boolean(getTicTacToeWinnerForBoard(board));
    });

    const winningMove = findFinishingMove(aiPlayer);
    if (winningMove !== undefined) {
        return winningMove;
    }

    const blockingMove = findFinishingMove(humanPlayer);
    if (blockingMove !== undefined) {
        return blockingMove;
    }

    if (emptyCells.includes(4)) {
        return 4;
    }

    const forkCandidates = emptyCells.filter((index) => {
        const board = [...ticTacToeBoardState];
        board[index] = aiPlayer;
        const futureWins = emptyCells
            .filter((candidate) => candidate !== index)
            .filter((candidate) => {
                const nextBoard = [...board];
                nextBoard[candidate] = aiPlayer;
                return Boolean(getTicTacToeWinnerForBoard(nextBoard));
            });
        return futureWins.length >= 2;
    });
    if (forkCandidates.length) {
        return preferredOrder.find((index) => forkCandidates.includes(index)) ?? forkCandidates[0];
    }

    return preferredOrder.find((index) => emptyCells.includes(index)) ?? emptyCells[0];
}

export function syncMultiplayerTicTacToeState() {
    const room = getMultiplayerActiveRoom();
    if (!isMultiplayerTicTacToeActive()) {
        ticTacToeLastFinishedStateKey = '';
        if (ticTacToeOutcomeMenuTimeout) {
            window.clearTimeout(ticTacToeOutcomeMenuTimeout);
            ticTacToeOutcomeMenuTimeout = null;
        }
        return;
    }

    if (ticTacToeAiTimeout) {
        window.clearTimeout(ticTacToeAiTimeout);
        ticTacToeAiTimeout = null;
    }

    ticTacToeBoardState = Array.isArray(room.gameState.board)
        ? [...room.gameState.board]
        : Array(9).fill('');
    ticTacToeCurrentPlayer = room.gameState.currentPlayer || 'anchor';
    ticTacToeFinished = Boolean(room.gameState.finished);
    ticTacToeScores = {
        anchor: Number(room.gameState.scores?.anchor || 0),
        skull: Number(room.gameState.scores?.skull || 0)
    };

    // Ferme automatiquement le menu « Mettre prêt » quand le serveur a
    // effectivement lancé la partie (tous les joueurs prêts).
    if (room.gameLaunched && ticTacToeMenuVisible && !ticTacToeMenuResult) {
        ticTacToeMenuVisible = false;
        ticTacToeMenuClosing = false;
        renderTicTacToeMenu();
    } else {
        renderTicTacToeMenu();
    }

    updateTicTacToeHud();
    renderTicTacToeBoard();

    if (!ticTacToeFinished) {
        ticTacToeLastFinishedStateKey = '';
        if (ticTacToeOutcomeMenuTimeout) {
            window.clearTimeout(ticTacToeOutcomeMenuTimeout);
            ticTacToeOutcomeMenuTimeout = null;
        }
        return;
    }

    const finishedStateKey = `${room.gameState.round}:${room.gameState.winner}`;
    if (finishedStateKey === ticTacToeLastFinishedStateKey) {
        return;
    }

    ticTacToeLastFinishedStateKey = finishedStateKey;

    if (activeGameTabAccessor() !== 'ticTacToe') {
        return;
    }

    if (room.gameState.winner === 'draw') {
        ticTacToeMenuResult = 'draw';
    } else if (room.gameState.winner === getMultiplayerTicTacToeRole()) {
        ticTacToeMenuResult = 'win';
    } else {
        ticTacToeMenuResult = 'loss';
    }

    showTicTacToeMenuWithDelay();
}

export function initializeTicTacToe(showMenu = true) {
    if (isMultiplayerTicTacToeActive()) {
        closeGameOverModal();
        const room = getMultiplayerActiveRoom();
        // Tant que la partie n'est pas lancée (gameLaunched=false), garde le
        // menu visible pour que les joueurs puissent cliquer « Mettre prêt ».
        const waitingForReady = !room?.gameLaunched;
        ticTacToeMenuVisible = waitingForReady;
        ticTacToeMenuShowingRules = false;
        ticTacToeMenuClosing = false;
        ticTacToeMenuEntering = false;
        renderTicTacToeMenu();
        syncMultiplayerTicTacToeState();
        return;
    }

    if (ticTacToeAiTimeout) {
        window.clearTimeout(ticTacToeAiTimeout);
        ticTacToeAiTimeout = null;
    }

    closeGameOverModal();
    if (ticTacToeOutcomeMenuTimeout) {
        window.clearTimeout(ticTacToeOutcomeMenuTimeout);
        ticTacToeOutcomeMenuTimeout = null;
    }
    ticTacToeBoardState = Array(9).fill('');
    ticTacToeRenderedBoardState = Array(9).fill('');
    ticTacToeCurrentPlayer = 'anchor';
    ticTacToeFinished = false;
    ticTacToeMenuResult = null;
    updateTicTacToeHud();
    renderTicTacToeBoard();
    if (showMenu) {
        showTicTacToeMenu();
    } else {
        ticTacToeMenuVisible = false;
        ticTacToeMenuShowingRules = false;
        ticTacToeMenuClosing = false;
        renderTicTacToeMenu();
    }
}

export function finishTicTacToeRound(winner) {
    const { ticTacToeHelpText } = dom();
    ticTacToeFinished = true;

    if (winner === 'anchor') {
        ticTacToeScores.anchor += 1;
        if (ticTacToeHelpText) ticTacToeHelpText.textContent = ticTacToeMode === 'duo' ? 'Le joueur 1 tient le pont.' : 'Victoire. Ton \u00e9quipage tient le pont.';
        ticTacToeMenuResult = 'win';
    } else if (winner === 'skull') {
        ticTacToeScores.skull += 1;
        if (ticTacToeHelpText) ticTacToeHelpText.textContent = ticTacToeMode === 'duo' ? 'Le joueur 2 prend le pont.' : "D\u00e9faite. L'IA pirate prend le pont.";
        ticTacToeMenuResult = 'loss';
    } else {
        if (ticTacToeHelpText) ticTacToeHelpText.textContent = "Match nul. Personne ne prend l'avantage.";
        ticTacToeMenuResult = 'draw';
    }

    updateTicTacToeHud();
    renderTicTacToeBoard();
    showTicTacToeMenuWithDelay();
}

export function handleTicTacToeMove(index, player = 'anchor') {
    const { ticTacToeHelpText } = dom();
    if (isMultiplayerTicTacToeActive()) {
        const socket = getMultiplayerSocket();
        if (!socket?.connected) {
            setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
            return;
        }

        socket.emit('tictactoe:move', { index });
        return;
    }

    if (ticTacToeFinished || ticTacToeBoardState[index] || ticTacToeCurrentPlayer !== player) {
        return;
    }

    ticTacToeBoardState[index] = player;
    const winningLine = getTicTacToeWinner();

    if (winningLine) {
        finishTicTacToeRound(player);
        return;
    }

    if (ticTacToeBoardState.every(Boolean)) {
        finishTicTacToeRound('draw');
        return;
    }

    ticTacToeCurrentPlayer = player === 'anchor' ? 'skull' : 'anchor';
    updateTicTacToeHud();
    renderTicTacToeBoard();

    if (ticTacToeCurrentPlayer === 'skull' && ticTacToeMode === 'solo') {
        if (ticTacToeHelpText) ticTacToeHelpText.textContent = "L'IA pirate prepare sa riposte.";
        ticTacToeAiTimeout = window.setTimeout(() => {
            ticTacToeAiTimeout = null;
            if (ticTacToeFinished) {
                return;
            }

            const chosenIndex = getBestTicTacToeAiMove();
            if (chosenIndex === null) {
                return;
            }

            handleTicTacToeMove(chosenIndex, 'skull');
        }, 320);
    } else if (!ticTacToeFinished) {
        if (ticTacToeHelpText) ticTacToeHelpText.textContent = ticTacToeMode === 'duo'
            ? (ticTacToeCurrentPlayer === 'anchor' ? 'Au joueur 1 de jouer.' : 'Au joueur 2 de jouer.')
            : '\u00c0 toi de jouer.';
    }
}

export function setTicTacToeMode(nextMode) {
    if (isMultiplayerTicTacToeActive()) {
        setMultiplayerStatus('Le mode est piloté par la room en ligne.');
        return;
    }

    if (!['solo', 'duo'].includes(nextMode)) {
        return;
    }

    ticTacToeMode = nextMode;
    ticTacToeScores = { anchor: 0, skull: 0 };
    initializeTicTacToe();
}

export function getTicTacToeMode() { return ticTacToeMode; }
export function getTicTacToeFinished() { return ticTacToeFinished; }
export function getTicTacToeBoardState() { return ticTacToeBoardState; }
export function getTicTacToeCurrentPlayer() { return ticTacToeCurrentPlayer; }
export function getTicTacToeScores() { return ticTacToeScores; }
export function getTicTacToeMenuVisible() { return ticTacToeMenuVisible; }
export function setTicTacToeMenuVisible(v) { ticTacToeMenuVisible = Boolean(v); }
export function setTicTacToeMenuShowingRules(v) { ticTacToeMenuShowingRules = Boolean(v); }
export function getTicTacToeMenuShowingRules() { return ticTacToeMenuShowingRules; }
export function getTicTacToeMenuResult() { return ticTacToeMenuResult; }
export function setTicTacToeMenuResult(v) { ticTacToeMenuResult = v; }
