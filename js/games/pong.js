// Game module — Pong, solo/duo/multijoueur avec IA d'anticipation.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal, openGameOverModal } from '../core/modals.js';
import {
    getMultiplayerActiveRoom,
    getMultiplayerSocket,
    getMultiplayerReadySummary,
    isCurrentPlayerMultiplayerReady,
    getCurrentMultiplayerPlayer
} from '../multiplayer/state.js';
import { setMultiplayerStatus } from '../multiplayer/status.js';

export const PONG_TARGET_SCORE = 7;
export const PONG_SERVE_SPEED_X = 388;
export const PONG_SERVE_SPEED_Y = 228;
export const PONG_FIRST_RETURN_SPEED_X = 760;
export const PONG_FIRST_RETURN_Y_MULTIPLIER = 1.6;
export const PONG_RALLY_SPEED_INCREMENT = 20;
export const PONG_MAX_STEP_SECONDS = 1 / 120;

let pongLastFinishedStateKey = '';
let pongRunning = false;
let pongAnimationFrame = null;
let pongLastFrame = 0;
let pongRenderAnimationFrame = null;
let pongRenderLastFrame = 0;
let pongLastNetworkSyncAt = 0;
let pongLocalPredictedPaddleY = null;
let pongPlayerScore = 0;
let pongAiScore = 0;
let pongKeys = new Set();
let pongState = null;
let pongDisplayState = null;
let pongPaused = false;
let pongMultiplayerInputDirection = 0;
let pongCountdownEndsAt = 0;
let pongCountdownTimer = null;
let pongCountdownCompleteTimer = null;
let pongMode = 'solo';
let pongMenuVisible = true;
let pongMenuShowingRules = false;
let pongMenuClosing = false;
let pongMenuEntering = false;
let pongMenuResult = null;
let pongBoardMetrics = null;
let pongRenderMetrics = null;

let activeGameTabAccessor = () => null;
export function setPongActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        pongBoard: $('pongBoard'),
        pongTable: $('pongTable'),
        pongCountdown: $('pongCountdown'),
        pongPlayerPaddle: $('pongPlayerPaddle'),
        pongAiPaddle: $('pongAiPaddle'),
        pongBall: $('pongBall'),
        pongPlayerScoreDisplay: $('pongPlayerScoreDisplay'),
        pongAiScoreDisplay: $('pongAiScoreDisplay'),
        pongLeftLabel: $('pongLeftLabel'),
        pongRightLabel: $('pongRightLabel'),
        pongHelpText: $('pongHelpText'),
        pongModeButtons: document.querySelectorAll('[data-pong-mode]'),
        pongMenuOverlay: $('pongMenuOverlay'),
        pongMenuEyebrow: $('pongMenuEyebrow'),
        pongMenuTitle: $('pongMenuTitle'),
        pongMenuText: $('pongMenuText'),
        pongMenuActionButton: $('pongMenuActionButton'),
        pongMenuRulesButton: $('pongMenuRulesButton')
    };
}

export function isMultiplayerPongActive() {
    const room = getMultiplayerActiveRoom();
    return room?.gameId === 'pong' && Boolean(room?.gameState);
}

export function getMultiplayerPongRole() {
    return getMultiplayerActiveRoom()?.players?.find((player) => player.isYou)?.symbol || null;
}

export function getMultiplayerPongInputDirection() {
    const upPressed = pongKeys.has('z') || pongKeys.has('Z') || pongKeys.has('ArrowUp');
    const downPressed = pongKeys.has('s') || pongKeys.has('S') || pongKeys.has('ArrowDown');

    if (upPressed && !downPressed) {
        return -1;
    }

    if (downPressed && !upPressed) {
        return 1;
    }

    return 0;
}

export function getPongRulesText() {
    return 'Déplace ta raquette avec Z et S ou avec les flèches. Renvoie la balle sans la laisser filer et marque 7 points pour gagner le duel.';
}

export function getPongMenuOutcomeContent() {
    if (isMultiplayerPongActive()) {
        const gameState = getMultiplayerActiveRoom()?.gameState;
        if (!gameState?.finished) {
            return null;
        }

        return gameState.winner === getMultiplayerPongRole()
            ? {
                eyebrow: 'Victoire',
                title: 'Tu remportes le duel',
                text: 'Belle trajectoire. Remets-toi en selle pour une nouvelle manche.'
            }
            : {
                eyebrow: 'D\u00e9faite',
                title: "C'est perdu",
                text: "L'adversaire remporte le duel. Tu peux patienter ou relancer si tu es l'hôte."
            };
    }

    if (!pongMenuResult) {
        return null;
    }

    if (pongMode === 'duo') {
        return pongMenuResult === 'left'
            ? {
                eyebrow: 'Fin de duel',
                title: 'Joueur 1 gagne',
                text: 'La balle échappe au joueur 2. Relance une manche quand vous voulez.'
            }
            : {
                eyebrow: 'Fin de duel',
                title: 'Joueur 2 gagne',
                text: 'La balle échappe au joueur 1. Relance une manche quand vous voulez.'
            };
    }

    return pongMenuResult === 'win'
        ? {
            eyebrow: 'Victoire',
            title: 'Tu remportes le duel',
            text: 'Belle série. Relance une partie ou relis les règles avant de repartir.'
        }
        : {
            eyebrow: 'D\u00e9faite',
            title: "C'est perdu",
            text: 'L autre rive t echappe cette fois. Relance une partie pour retenter ta chance.'
        };
}

export function renderPongMenu() {
    const { pongMenuOverlay, pongTable, pongMenuEyebrow, pongMenuTitle, pongMenuText, pongMenuActionButton, pongMenuRulesButton } = dom();
    if (!pongMenuOverlay || !pongTable) {
        return;
    }

    syncGameMenuOverlayBounds(pongMenuOverlay, pongTable);
    const room = getMultiplayerActiveRoom();
    const isOnline = room?.gameId === 'pong';
    const gameState = room?.gameState || null;
    const countdownActive = Boolean(gameState?.countdownEndsAt && Number(gameState.countdownEndsAt) > Date.now());
    const roomStarted = Boolean(gameState?.running || countdownActive);
    const roomFinished = Boolean(gameState?.finished);
    const waitingForReady = isOnline && !room?.gameLaunched;
    const hasEnoughPlayers = Number(room?.playerCount || 0) >= 2;
    const outcomeContent = getPongMenuOutcomeContent();
    const hasResult = Boolean(outcomeContent);
    const actionLabel = waitingForReady
        ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
        : (isOnline
            ? (roomFinished ? 'Relancer le duel' : 'Lancer le duel')
            : (hasResult ? 'Relancer le duel' : 'Lancer le duel'));
    const baseText = waitingForReady
        ? 'Quand tous les joueurs sont pr\u00eats, toute la room bascule automatiquement sur le terrain.'
        : (isOnline
            ? 'Quand le duel se lance, toute la room bascule sur le terrain.'
            : 'Choisis ton mode, puis lance le duel dans la baie.');

    pongMenuVisible = isOnline ? (!roomStarted || roomFinished) : pongMenuVisible;

    pongMenuOverlay.classList.toggle('hidden', !pongMenuVisible);
    pongMenuOverlay.classList.toggle('is-closing', pongMenuClosing);
    pongMenuOverlay.classList.toggle('is-entering', pongMenuEntering);
    pongTable.classList.toggle('is-menu-open', pongMenuVisible);

    if (!pongMenuVisible) {
        return;
    }

    if (pongMenuEyebrow) {
        pongMenuEyebrow.textContent = pongMenuShowingRules ? 'R\u00e8gles' : (outcomeContent?.eyebrow || "Baie d'arcade");
    }
    if (pongMenuTitle) {
        pongMenuTitle.textContent = pongMenuShowingRules ? 'Rappel rapide' : (outcomeContent?.title || 'Pong');
    }
    if (pongMenuText) {
        pongMenuText.textContent = pongMenuShowingRules ? getPongRulesText() : (outcomeContent?.text || baseText);
    }
    if (pongMenuActionButton) {
        pongMenuActionButton.textContent = pongMenuShowingRules ? 'Retour' : actionLabel;
        pongMenuActionButton.disabled = pongMenuShowingRules
            ? false
            : (waitingForReady ? false : (isOnline ? !hasEnoughPlayers : false));
    }
    if (pongMenuRulesButton) {
        pongMenuRulesButton.textContent = 'R\u00e8gles';
        pongMenuRulesButton.hidden = pongMenuShowingRules;
    }
}

export function startPongLaunchSequence(onComplete = null) {
    pongMenuClosing = true;
    renderPongMenu();
    window.setTimeout(() => {
        pongMenuClosing = false;
        pongMenuVisible = false;
        pongMenuShowingRules = false;
        pongMenuEntering = false;
        renderPongMenu();
        onComplete?.();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealPongOutcomeMenuWithDelay() {
    pongMenuVisible = false;
    pongMenuShowingRules = false;
    pongMenuClosing = false;
    pongMenuEntering = false;
    renderPongMenu();

    window.setTimeout(() => {
        pongMenuVisible = true;
        pongMenuShowingRules = false;
        pongMenuClosing = false;
        pongMenuEntering = true;
        renderPongMenu();

        window.setTimeout(() => {
            pongMenuEntering = false;
            renderPongMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }, 420);
}

export function pushMultiplayerPongInput() {
    const socket = getMultiplayerSocket();
    if (!isMultiplayerPongActive() || !socket?.connected) {
        return;
    }

    const nextDirection = getMultiplayerPongInputDirection();
    if (nextDirection === pongMultiplayerInputDirection) {
        return;
    }

    pongMultiplayerInputDirection = nextDirection;
    socket.emit('pong:input', { direction: nextDirection });
}

export function syncMultiplayerPongState() {
    const { pongBoard } = dom();
    if (!isMultiplayerPongActive()) {
        pongLastFinishedStateKey = '';
        pongMultiplayerInputDirection = 0;
        pongCountdownEndsAt = 0;
        pongDisplayState = null;
        pongLocalPredictedPaddleY = null;
        pongRenderLastFrame = 0;
        return;
    }

    if (pongAnimationFrame) {
        window.cancelAnimationFrame(pongAnimationFrame);
        pongAnimationFrame = null;
    }
    pongRunning = false;
    pongPaused = false;
    pongLastFrame = 0;
    clearPongCountdownTimers();
    closeGameOverModal();

    const room = getMultiplayerActiveRoom();
    const nextState = room.gameState;
    pongLastNetworkSyncAt = Date.now();
    pongState = {
        boardWidth: Number(nextState.boardWidth || (pongBoard?.clientWidth || 700)),
        boardHeight: Number(nextState.boardHeight || (pongBoard?.clientHeight || 394)),
        paddleHeight: Number(nextState.paddleHeight || 104),
        paddleWidth: Number(nextState.paddleWidth || 24),
        paddleOffset: Number(nextState.paddleOffset || 22),
        ballSize: Number(nextState.ballSize || 16),
        playerY: Number(nextState.leftY || 0),
        aiY: Number(nextState.rightY || 0),
        aiTargetY: Number(nextState.rightY || 0),
        playerSpeed: 380,
        aiSpeed: 380,
        ballX: Number(nextState.ballX || 0),
        ballY: Number(nextState.ballY || 0),
        ballVelocityX: Number(nextState.ballVelocityX || 0),
        ballVelocityY: Number(nextState.ballVelocityY || 0),
        countdownActive: Boolean(nextState.countdownEndsAt && nextState.countdownEndsAt > Date.now()),
        round: Number(nextState.round || 0)
    };
    const shouldSnapDisplay = !pongDisplayState
        || pongDisplayState.round !== pongState.round
        || Math.abs(pongDisplayState.ballX - pongState.ballX) > 140
        || Math.abs(pongDisplayState.ballY - pongState.ballY) > 120;
    const role = getMultiplayerPongRole();

    if (shouldSnapDisplay) {
        pongDisplayState = { ...pongState };
        pongLocalPredictedPaddleY = role === 'right' ? pongState.aiY : pongState.playerY;
    } else {
        pongDisplayState = {
            ...pongDisplayState,
            boardWidth: pongState.boardWidth,
            boardHeight: pongState.boardHeight,
            paddleHeight: pongState.paddleHeight,
            paddleWidth: pongState.paddleWidth,
            paddleOffset: pongState.paddleOffset,
            ballSize: pongState.ballSize,
            round: pongState.round
        };

        if (pongLocalPredictedPaddleY === null) {
            pongLocalPredictedPaddleY = role === 'right' ? pongState.aiY : pongState.playerY;
        }
    }

    pongPlayerScore = Number(nextState.leftScore || 0);
    pongAiScore = Number(nextState.rightScore || 0);
    pongRunning = Boolean(nextState.running);
    pongPaused = false;
    pongCountdownEndsAt = Number(nextState.countdownEndsAt || 0);

    if (!pongState.countdownActive) {
        hidePongCountdown();
    }

    updatePongHud();
    renderPong();
    ensureMultiplayerPongRenderLoop();
    pushMultiplayerPongInput();

    if (!nextState.finished) {
        pongLastFinishedStateKey = '';
        return;
    }

    const finishedStateKey = `${nextState.round}:${nextState.winner || 'none'}`;
    if (finishedStateKey === pongLastFinishedStateKey || activeGameTabAccessor() !== 'pong') {
        return;
    }

    pongLastFinishedStateKey = finishedStateKey;
    revealPongOutcomeMenuWithDelay();
}

export function updatePongHud() {
    const { pongPlayerScoreDisplay, pongAiScoreDisplay, pongLeftLabel, pongRightLabel, pongHelpText, pongModeButtons } = dom();
    pongPlayerScoreDisplay.textContent = String(pongPlayerScore);
    pongAiScoreDisplay.textContent = String(pongAiScore);
    if (isMultiplayerPongActive()) {
        const room = getMultiplayerActiveRoom();
        const currentRole = getMultiplayerPongRole();
        pongLeftLabel.textContent = currentRole === 'left' ? 'Toi' : 'Adversaire';
        pongRightLabel.textContent = currentRole === 'right' ? 'Toi' : 'Adversaire';
        if (room?.playerCount < 2) {
            pongHelpText.innerHTML = 'Salon en attente. Il faut deux joueurs pour lancer le duel.';
        } else if (room?.gameState?.finished) {
            pongHelpText.innerHTML = room.gameState.winner === currentRole
                ? "Victoire. Clique sur le bouton central si tu es l'hôte pour relancer."
                : "D\u00e9faite. Attends que l'h\u00f4te relance un nouveau duel.";
        } else if (room?.gameState?.running) {
            pongHelpText.innerHTML = 'Utilise Z/S ou les flèches pour déplacer ta raquette. Premier à 7.';
        } else {
            pongHelpText.innerHTML = "Attends que l'hôte lance le duel de Pong.";
        }
        pongModeButtons.forEach((button) => {
            button.classList.remove('is-active');
            button.disabled = true;
        });
        renderPongMenu();
        return;
    }

    pongLeftLabel.textContent = pongMode === 'duo' ? 'Joueur 1' : 'Toi';
    pongRightLabel.textContent = pongMode === 'duo' ? 'Joueur 2' : 'IA';
    pongHelpText.innerHTML = pongMode === 'duo'
        ? 'Mode 2 joueurs: gauche avec Z/S, droite avec fl&egrave;ches haut/bas. Premier &agrave; 7.'
        : "Mode 1 joueur: Z/S ou fl&egrave;ches pour jouer contre l'IA. Premier &agrave; 7.";
    pongModeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.pongMode === pongMode);
        button.disabled = false;
    });
    renderPongMenu();
}

export function createPongRoundState() {
    const { pongBoard } = dom();
    const boardWidth = pongBoard.clientWidth || 700;
    const boardHeight = pongBoard.clientHeight || Math.round(boardWidth * 9 / 16);
    const paddleHeight = 104;
    const paddleWidth = 24;
    const ballSize = 20;
    const paddleOffset = 22;
    const centerY = (boardHeight - paddleHeight) / 2;
    const serveDirection = Math.random() > 0.5 ? 1 : -1;
    const verticalDirection = (Math.random() * 2) - 1;

    return {
        boardWidth,
        boardHeight,
        paddleHeight,
        paddleWidth,
        paddleOffset,
        ballSize,
        playerY: centerY,
        aiY: centerY,
        aiTargetY: centerY,
        playerSpeed: 380,
        aiSpeed: pongMode === 'duo' ? 380 : 312,
        ballX: (boardWidth - ballSize) / 2,
        ballY: (boardHeight - ballSize) / 2,
        ballVelocityX: PONG_SERVE_SPEED_X * serveDirection,
        ballVelocityY: PONG_SERVE_SPEED_Y * verticalDirection,
        countdownActive: true,
        aiDriftTimer: 0,
        serveBoostPending: true
    };
}

export function clearPongCountdownTimers() {
    if (pongCountdownTimer) {
        window.clearTimeout(pongCountdownTimer);
        pongCountdownTimer = null;
    }

    if (pongCountdownCompleteTimer) {
        window.clearTimeout(pongCountdownCompleteTimer);
        pongCountdownCompleteTimer = null;
    }
}

export function hidePongCountdown() {
    const { pongCountdown } = dom();
    clearPongCountdownTimers();
    pongCountdown.textContent = '';
    pongCountdown.classList.add('hidden');
    pongCountdown.setAttribute('aria-hidden', 'true');
}

export function showPongCountdownValue(label) {
    const { pongCountdown } = dom();
    pongCountdown.textContent = label;
    pongCountdown.classList.remove('hidden');
    pongCountdown.setAttribute('aria-hidden', 'false');
}

export function getMultiplayerPongCountdownLabel() {
    const remainingMs = Math.max(0, pongCountdownEndsAt - Date.now());

    if (!remainingMs) {
        return null;
    }

    if (remainingMs > 1860) {
        return '3';
    }

    if (remainingMs > 1240) {
        return '2';
    }

    if (remainingMs > 620) {
        return '1';
    }

    return 'Partez';
}

export function clampPongY(y, activeState = pongState) {
    if (!activeState) {
        return y;
    }

    return Math.max(0, Math.min(y, activeState.boardHeight - activeState.paddleHeight));
}

export function ensureMultiplayerPongRenderLoop() {
    if (pongRenderAnimationFrame || !isMultiplayerPongActive()) {
        return;
    }

    const tick = (timestamp) => {
        pongRenderAnimationFrame = null;

        if (!isMultiplayerPongActive() || !pongState || !pongDisplayState) {
            pongRenderLastFrame = 0;
            return;
        }

        if (!pongRenderLastFrame) {
            pongRenderLastFrame = timestamp;
        }

        const delta = Math.min((timestamp - pongRenderLastFrame) / 1000, 0.05);
        pongRenderLastFrame = timestamp;
        const role = getMultiplayerPongRole();
        const inputDirection = getMultiplayerPongInputDirection();
        const paddleSmoothing = Math.min(1, delta * 22);
        const ownServerY = role === 'right' ? pongState.aiY : pongState.playerY;

        if (pongLocalPredictedPaddleY === null) {
            pongLocalPredictedPaddleY = ownServerY;
        }

        if (role === 'left') {
            pongLocalPredictedPaddleY = clampPongY(pongLocalPredictedPaddleY + (inputDirection * pongState.playerSpeed * delta));
            if (Math.abs(pongState.playerY - pongLocalPredictedPaddleY) > 6) {
                pongLocalPredictedPaddleY = pongState.playerY;
            }
            if (inputDirection === 0) {
                const catchupGap = pongState.playerY - pongLocalPredictedPaddleY;
                pongLocalPredictedPaddleY += catchupGap * Math.min(1, delta * 16);
            }
            pongDisplayState.playerY = pongLocalPredictedPaddleY;
            pongDisplayState.aiY = Math.abs(pongState.aiY - pongDisplayState.aiY) > 6
                ? pongState.aiY
                : (pongDisplayState.aiY + ((pongState.aiY - pongDisplayState.aiY) * paddleSmoothing));
        } else if (role === 'right') {
            pongLocalPredictedPaddleY = clampPongY(pongLocalPredictedPaddleY + (inputDirection * pongState.playerSpeed * delta));
            if (Math.abs(pongState.aiY - pongLocalPredictedPaddleY) > 6) {
                pongLocalPredictedPaddleY = pongState.aiY;
            }
            if (inputDirection === 0) {
                const catchupGap = pongState.aiY - pongLocalPredictedPaddleY;
                pongLocalPredictedPaddleY += catchupGap * Math.min(1, delta * 16);
            }
            pongDisplayState.aiY = pongLocalPredictedPaddleY;
            pongDisplayState.playerY = Math.abs(pongState.playerY - pongDisplayState.playerY) > 6
                ? pongState.playerY
                : (pongDisplayState.playerY + ((pongState.playerY - pongDisplayState.playerY) * paddleSmoothing));
        } else {
            pongDisplayState.playerY = Math.abs(pongState.playerY - pongDisplayState.playerY) > 6
                ? pongState.playerY
                : (pongDisplayState.playerY + ((pongState.playerY - pongDisplayState.playerY) * paddleSmoothing));
            pongDisplayState.aiY = Math.abs(pongState.aiY - pongDisplayState.aiY) > 6
                ? pongState.aiY
                : (pongDisplayState.aiY + ((pongState.aiY - pongDisplayState.aiY) * paddleSmoothing));
        }

        pongDisplayState.ballX = pongState.ballX;
        pongDisplayState.ballY = pongState.ballY;

        const countdownLabel = getMultiplayerPongCountdownLabel();
        if (countdownLabel) {
            showPongCountdownValue(countdownLabel);
        } else {
            hidePongCountdown();
        }

        renderPong();
        pongRenderAnimationFrame = window.requestAnimationFrame(tick);
    };

    pongRenderAnimationFrame = window.requestAnimationFrame(tick);
}

export function startPongCountdown(onComplete) {
    clearPongCountdownTimers();

    if (!pongState) {
        return;
    }

    pongState.countdownActive = true;

    const sequence = ['3', '2', '1', 'Partez'];
    let stepIndex = 0;

    const runStep = () => {
        showPongCountdownValue(sequence[stepIndex]);

        if (stepIndex === sequence.length - 1) {
            pongCountdownCompleteTimer = window.setTimeout(() => {
                hidePongCountdown();
                if (pongState) {
                    pongState.countdownActive = false;
                }
                onComplete?.();
            }, 460);
            return;
        }

        stepIndex += 1;
        pongCountdownTimer = window.setTimeout(runStep, 620);
    };

    runStep();
}

export function renderPong() {
    const { pongBoard, pongPlayerPaddle, pongAiPaddle, pongBall } = dom();
    const activePongState = isMultiplayerPongActive() && pongDisplayState ? pongDisplayState : pongState;

    if (!activePongState) {
        return;
    }

    if (!pongBoardMetrics
        || pongBoardMetrics.boardWidth !== activePongState.boardWidth
        || pongBoardMetrics.boardHeight !== activePongState.boardHeight) {
        const renderWidth = pongBoard.clientWidth || activePongState.boardWidth;
        const renderHeight = pongBoard.clientHeight || activePongState.boardHeight;
        pongBoardMetrics = {
            boardWidth: activePongState.boardWidth,
            boardHeight: activePongState.boardHeight,
            scaleX: renderWidth / activePongState.boardWidth,
            scaleY: renderHeight / activePongState.boardHeight
        };
    }

    const { scaleX, scaleY } = pongBoardMetrics;
    const leftX = activePongState.paddleOffset * scaleX;
    const rightX = (activePongState.boardWidth - activePongState.paddleOffset - activePongState.paddleWidth) * scaleX;
    const paddleWidth = `${activePongState.paddleWidth * scaleX}px`;
    const paddleHeight = `${activePongState.paddleHeight * scaleY}px`;
    const ballSize = `${activePongState.ballSize * scaleX}px`;

    if (!pongRenderMetrics
        || pongRenderMetrics.paddleWidth !== paddleWidth
        || pongRenderMetrics.paddleHeight !== paddleHeight
        || pongRenderMetrics.ballSize !== ballSize) {
        pongPlayerPaddle.style.width = paddleWidth;
        pongPlayerPaddle.style.height = paddleHeight;
        pongAiPaddle.style.width = paddleWidth;
        pongAiPaddle.style.height = paddleHeight;
        pongBall.style.width = ballSize;
        pongBall.style.height = ballSize;
        pongRenderMetrics = {
            paddleWidth,
            paddleHeight,
            ballSize
        };
    }

    pongPlayerPaddle.style.transform = `translate3d(${leftX.toFixed(2)}px, ${(activePongState.playerY * scaleY).toFixed(2)}px, 0)`;
    pongAiPaddle.style.transform = `translate3d(${rightX.toFixed(2)}px, ${(activePongState.aiY * scaleY).toFixed(2)}px, 0)`;
    pongBall.style.transform = `translate3d(${(activePongState.ballX * scaleX).toFixed(2)}px, ${(activePongState.ballY * scaleY).toFixed(2)}px, 0)`;
}

export function getPongBounceVelocityY(impact) {
    const clampedImpact = Math.max(-1, Math.min(1, impact));
    const nextVelocityY = clampedImpact * 305;

    if (Math.abs(nextVelocityY) < 115) {
        return (clampedImpact >= 0 ? 1 : -1) * 115;
    }

    return nextVelocityY;
}

export function getPongReturnVelocityX(currentVelocityX, serveBoostPending) {
    const nextSpeedX = serveBoostPending
        ? Math.max(Math.abs(currentVelocityX) + PONG_RALLY_SPEED_INCREMENT, PONG_FIRST_RETURN_SPEED_X)
        : (Math.abs(currentVelocityX) + PONG_RALLY_SPEED_INCREMENT);

    return Math.sign(currentVelocityX || 1) * nextSpeedX;
}

export function getPongReturnVelocityY(impact, serveBoostPending) {
    const nextVelocityY = getPongBounceVelocityY(impact);
    return serveBoostPending ? (nextVelocityY * PONG_FIRST_RETURN_Y_MULTIPLIER) : nextVelocityY;
}

export function updatePongStep(delta) {
    const leftDirection = (pongKeys.has('z') || pongKeys.has('Z') || (pongMode === 'solo' && pongKeys.has('ArrowUp')) ? -1 : 0)
        + (pongKeys.has('s') || pongKeys.has('S') || (pongMode === 'solo' && pongKeys.has('ArrowDown')) ? 1 : 0);

    pongState.playerY += leftDirection * pongState.playerSpeed * delta;
    pongState.playerY = Math.max(0, Math.min(pongState.playerY, pongState.boardHeight - pongState.paddleHeight));

    if (pongMode === 'duo') {
        const rightDirection = (pongKeys.has('ArrowUp') ? -1 : 0) + (pongKeys.has('ArrowDown') ? 1 : 0);
        pongState.aiY += rightDirection * pongState.playerSpeed * delta;
    } else {
        const ballCenter = pongState.ballY + (pongState.ballSize / 2);
        const approachingAi = pongState.ballVelocityX > 0;
        const anticipationTime = approachingAi ? 0.085 : 0.03;
        const anticipatedCenter = ballCenter + (pongState.ballVelocityY * anticipationTime);
        const desiredAiY = approachingAi
            ? Math.max(
                0,
                Math.min(
                    anticipatedCenter - (pongState.paddleHeight / 2),
                    pongState.boardHeight - pongState.paddleHeight
                )
            )
            : ((pongState.boardHeight - pongState.paddleHeight) / 2);
        pongState.aiTargetY += (desiredAiY - pongState.aiTargetY) * Math.min(1, delta * (approachingAi ? 7.5 : 4.5));
        const targetDelta = pongState.aiTargetY - pongState.aiY;
        const maxStep = pongState.aiSpeed * delta * (approachingAi ? 1 : 0.72);
        pongState.aiY += Math.max(-maxStep, Math.min(maxStep, targetDelta));
    }
    pongState.aiY = Math.max(0, Math.min(pongState.aiY, pongState.boardHeight - pongState.paddleHeight));

    pongState.ballX += pongState.ballVelocityX * delta;
    pongState.ballY += pongState.ballVelocityY * delta;

    if (pongState.ballY < 0) {
        pongState.ballY = Math.abs(pongState.ballY);
        pongState.ballVelocityY = Math.abs(pongState.ballVelocityY);
    }

    const maxBallY = pongState.boardHeight - pongState.ballSize;

    if (pongState.ballY > maxBallY) {
        pongState.ballY = maxBallY - (pongState.ballY - maxBallY);
        pongState.ballVelocityY = -Math.abs(pongState.ballVelocityY);
    }

    const playerPaddleX = pongState.paddleOffset;
    const aiPaddleX = pongState.boardWidth - pongState.paddleOffset - pongState.paddleWidth;

    const hitsPlayer = pongState.ballX <= playerPaddleX + pongState.paddleWidth
        && pongState.ballX + pongState.ballSize >= playerPaddleX
        && pongState.ballY + pongState.ballSize >= pongState.playerY
        && pongState.ballY <= pongState.playerY + pongState.paddleHeight
        && pongState.ballVelocityX < 0;

    if (hitsPlayer) {
        const impact = ((pongState.ballY + (pongState.ballSize / 2)) - (pongState.playerY + (pongState.paddleHeight / 2))) / (pongState.paddleHeight / 2);
        const serveBoostPending = pongState.serveBoostPending;
        pongState.ballX = playerPaddleX + pongState.paddleWidth;
        pongState.ballVelocityX = Math.abs(getPongReturnVelocityX(pongState.ballVelocityX, serveBoostPending));
        pongState.ballVelocityY = getPongReturnVelocityY(impact, serveBoostPending);
        pongState.serveBoostPending = false;
    }

    const hitsAi = pongState.ballX + pongState.ballSize >= aiPaddleX
        && pongState.ballX <= aiPaddleX + pongState.paddleWidth
        && pongState.ballY + pongState.ballSize >= pongState.aiY
        && pongState.ballY <= pongState.aiY + pongState.paddleHeight
        && pongState.ballVelocityX > 0;

    if (hitsAi) {
        const impact = ((pongState.ballY + (pongState.ballSize / 2)) - (pongState.aiY + (pongState.paddleHeight / 2))) / (pongState.paddleHeight / 2);
        const serveBoostPending = pongState.serveBoostPending;
        pongState.ballX = aiPaddleX - pongState.ballSize;
        pongState.ballVelocityX = -Math.abs(getPongReturnVelocityX(pongState.ballVelocityX, serveBoostPending));
        pongState.ballVelocityY = getPongReturnVelocityY(impact, serveBoostPending);
        pongState.serveBoostPending = false;
    }

    if (pongState.ballX + pongState.ballSize < 0) {
        scorePongPoint(false);
        return true;
    }

    if (pongState.ballX > pongState.boardWidth) {
        scorePongPoint(true);
        return true;
    }

    return false;
}

export function resetPongRound() {
    pongState = createPongRoundState();
    renderPong();
}

export function resetPongMatch() {
    pongPlayerScore = 0;
    pongAiScore = 0;
    resetPongRound();
    updatePongHud();
}

export function stopPong() {
    if (pongAnimationFrame) {
        window.cancelAnimationFrame(pongAnimationFrame);
        pongAnimationFrame = null;
    }

    if (pongRenderAnimationFrame) {
        window.cancelAnimationFrame(pongRenderAnimationFrame);
        pongRenderAnimationFrame = null;
    }

    hidePongCountdown();
    pongRunning = false;
    pongPaused = false;
    pongLastFrame = 0;
    pongRenderLastFrame = 0;
    pongBoardMetrics = null;
    pongRenderMetrics = null;
    pongDisplayState = null;
    pongLocalPredictedPaddleY = null;
    pongLastNetworkSyncAt = 0;
    pongCountdownEndsAt = 0;
    updatePongHud();
}

export function pausePong() {
    if (!pongRunning || !pongState || pongState.countdownActive) {
        return;
    }

    if (pongAnimationFrame) {
        window.cancelAnimationFrame(pongAnimationFrame);
        pongAnimationFrame = null;
    }

    pongRunning = false;
    pongPaused = true;
    pongLastFrame = 0;
    updatePongHud();
}

export function resumePong() {
    if (!pongPaused || !pongState) {
        return;
    }

    pongRunning = true;
    pongPaused = false;
    pongLastFrame = 0;
    updatePongHud();
    pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
}

export function finishPongMatch(playerWon) {
    stopPong();
    openGameOverModal(
        playerWon ? 'Victoire' : "C'est perdu",
        playerWon ? "Le duel est gagné. La baie t'acclame." : "L'IA remporte la manche. Le courant t'échappe."
    );
}

export function scorePongPoint(playerWon) {
    if (playerWon) {
        pongPlayerScore += 1;
    } else {
        pongAiScore += 1;
    }

    updatePongHud();

    if (pongPlayerScore >= PONG_TARGET_SCORE || pongAiScore >= PONG_TARGET_SCORE) {
        finishPongOutcome(pongPlayerScore >= PONG_TARGET_SCORE);
        return;
    }

    resetPongRound();
    startPongCountdown();
}

export function finishPongOutcome(playerWon) {
    stopPong();
    pongMenuResult = pongMode === 'duo' ? (playerWon ? 'left' : 'right') : (playerWon ? 'win' : 'loss');
    revealPongOutcomeMenuWithDelay();
}

export function updatePongFrame(timestamp) {
    if (!pongRunning || !pongState) {
        return;
    }

    if (!pongLastFrame) {
        pongLastFrame = timestamp;
    }

    const delta = Math.min((timestamp - pongLastFrame) / 1000, 0.032);
    pongLastFrame = timestamp;

    if (pongState.countdownActive) {
        renderPong();
        if (pongRunning) {
            pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
        }
        return;
    }

    let remainingDelta = delta;

    while (remainingDelta > 0 && pongRunning && pongState && !pongState.countdownActive) {
        const stepDelta = Math.min(remainingDelta, PONG_MAX_STEP_SECONDS);
        const pointScored = updatePongStep(stepDelta);
        remainingDelta -= stepDelta;

        if (pointScored) {
            break;
        }
    }

    renderPong();

    if (pongRunning) {
        pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
    }
}

export function initializePong() {
    if (isMultiplayerPongActive()) {
        pongMenuResult = null;
        syncMultiplayerPongState();
        return;
    }

    stopPong();
    resetPongMatch();
    pongMenuResult = null;
    pongMenuVisible = true;
    pongMenuShowingRules = false;
    pongMenuClosing = false;
    pongMenuEntering = false;
    renderPongMenu();
}

export function setPongMode(nextMode) {
    if (isMultiplayerPongActive()) {
        setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
        return;
    }

    if (!['solo', 'duo'].includes(nextMode)) {
        return;
    }

    pongMode = nextMode;
    initializePong();
}

export function startPong() {
    if (isMultiplayerPongActive()) {
        const socket = getMultiplayerSocket();
        if (!socket?.connected) {
            setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
            return;
        }

        if (!getCurrentMultiplayerPlayer()?.isHost) {
            setMultiplayerStatus("Seul l'hôte peut lancer le duel.");
            return;
        }

        socket.emit('pong:start');
        setMultiplayerStatus('Le duel de Pong se prepare pour tout le salon.');
        return;
    }

    closeGameOverModal();
    pongKeys.clear();
    pongLastNetworkSyncAt = 0;
    pongMenuResult = null;
    resetPongMatch();
    pongRunning = true;
    pongPaused = false;
    updatePongHud();
    startPongCountdown();
    pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
}

// State accessors for wiring in script.js.
export function getPongMode() { return pongMode; }
export function getPongState() { return pongState; }
export function getPongRunning() { return pongRunning; }
export function getPongPaused() { return pongPaused; }
export function getPongKeys() { return pongKeys; }
export function getPongMenuVisible() { return pongMenuVisible; }
export function setPongMenuVisible(v) { pongMenuVisible = Boolean(v); }
export function getPongMenuShowingRules() { return pongMenuShowingRules; }
export function setPongMenuShowingRules(v) { pongMenuShowingRules = Boolean(v); }
export function getPongMenuClosing() { return pongMenuClosing; }
export function getPongMenuResult() { return pongMenuResult; }
export function setPongMenuResult(v) { pongMenuResult = v; }
