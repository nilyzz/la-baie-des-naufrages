// Game module — Sea Hockey (airHockey), solo/duo/multijoueur avec IA simple.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import {
    getMultiplayerActiveRoom,
    getMultiplayerSocket,
    getMultiplayerReadySummary,
    isCurrentPlayerMultiplayerReady,
    getCurrentMultiplayerPlayer
} from '../multiplayer/state.js';
import { setMultiplayerStatus } from '../multiplayer/status.js';

export const AIR_HOCKEY_GOAL_SCORE = 5;
export const AIR_HOCKEY_SPEED = 340;
export const AIR_HOCKEY_CENTER_GAP = 8;
export const AIR_HOCKEY_PADDLE_RADIUS = 34;
export const AIR_HOCKEY_PUCK_RADIUS = 22;
export const AIR_HOCKEY_PUCK_MAX_SPEED = 700;

let airHockeyMode = 'solo';
let airHockeyState = null;
let airHockeyDisplayState = null;
let airHockeyKeys = new Set();
let airHockeyAnimationFrame = null;
let airHockeyRenderAnimationFrame = null;
let airHockeyLastFrame = 0;
let airHockeyRenderLastFrame = 0;
let airHockeyCountdownActive = false;
let airHockeyCountdownEndsAt = 0;
let airHockeyLastFinishedStateKey = '';
let airHockeyMultiplayerInput = { x: 0, y: 0 };
let airHockeyLocalPredicted = null;
let airHockeyCountdownTimer = null;
let airHockeyCountdownCompleteTimer = null;
let airHockeyMenuVisible = true;
let airHockeyMenuShowingRules = false;
let airHockeyMenuClosing = false;
let airHockeyMenuEntering = false;
let airHockeyMenuResult = null;

let activeGameTabAccessor = () => null;
export function setAirHockeyActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        airHockeyGame: $('airHockeyGame'),
        airHockeyBoard: $('airHockeyBoard'),
        airHockeyPuck: $('airHockeyPuck'),
        airHockeyLeftPaddle: $('airHockeyLeftPaddle'),
        airHockeyRightPaddle: $('airHockeyRightPaddle'),
        airHockeyCountdown: $('airHockeyCountdown'),
        airHockeyLeftScoreDisplay: $('airHockeyLeftScoreDisplay'),
        airHockeyRightScoreDisplay: $('airHockeyRightScoreDisplay'),
        airHockeyHelpText: $('airHockeyHelpText'),
        airHockeyStartButton: $('airHockeyStartButton'),
        airHockeyModeButtons: document.querySelectorAll('[data-airhockey-mode]'),
        airHockeyMenuOverlay: $('airHockeyMenuOverlay'),
        airHockeyMenuEyebrow: $('airHockeyMenuEyebrow'),
        airHockeyMenuTitle: $('airHockeyMenuTitle'),
        airHockeyMenuText: $('airHockeyMenuText'),
        airHockeyMenuActionButton: $('airHockeyMenuActionButton'),
        airHockeyMenuRulesButton: $('airHockeyMenuRulesButton')
    };
}

export function isMultiplayerAirHockeyActive() {
    const room = getMultiplayerActiveRoom();
    return room?.gameId === 'airHockey' && Boolean(room?.gameState);
}

export function getMultiplayerAirHockeyRole() {
    return getMultiplayerActiveRoom()?.players?.find((player) => player.isYou)?.symbol || null;
}

export function getMultiplayerAirHockeyInput() {
    const vertical = (airHockeyKeys.has('s') || airHockeyKeys.has('arrowdown') ? 1 : 0) - (airHockeyKeys.has('z') || airHockeyKeys.has('arrowup') ? 1 : 0);
    const horizontal = (airHockeyKeys.has('d') || airHockeyKeys.has('arrowright') ? 1 : 0) - (airHockeyKeys.has('q') || airHockeyKeys.has('arrowleft') ? 1 : 0);
    const magnitude = Math.hypot(horizontal, vertical);

    if (magnitude > 1) {
        return {
            x: horizontal / magnitude,
            y: vertical / magnitude
        };
    }

    return { x: horizontal, y: vertical };
}

export function pushMultiplayerAirHockeyInput() {
    const socket = getMultiplayerSocket();
    if (!isMultiplayerAirHockeyActive() || !socket?.connected) {
        return;
    }

    const nextInput = getMultiplayerAirHockeyInput();
    const sameInput = Math.abs(nextInput.x - airHockeyMultiplayerInput.x) < 0.001 && Math.abs(nextInput.y - airHockeyMultiplayerInput.y) < 0.001;

    if (sameInput) {
        return;
    }

    airHockeyMultiplayerInput = nextInput;
    socket.emit('airhockey:input', nextInput);
    ensureMultiplayerAirHockeyRenderLoop();
}

export function resetMultiplayerAirHockeyInput() {
    airHockeyKeys.clear();
    airHockeyLocalPredicted = null;
    const socket = getMultiplayerSocket();
    if (!isMultiplayerAirHockeyActive() || !socket?.connected) {
        airHockeyMultiplayerInput = { x: 0, y: 0 };
        return;
    }

    airHockeyMultiplayerInput = { x: 0, y: 0 };
    socket.emit('airhockey:input', { x: 0, y: 0 });
}

export function ensureMultiplayerAirHockeyRenderLoop() {
    if (airHockeyRenderAnimationFrame || !isMultiplayerAirHockeyActive()) {
        return;
    }

    const tick = (timestamp) => {
        airHockeyRenderAnimationFrame = null;

        if (!isMultiplayerAirHockeyActive() || !airHockeyState || !airHockeyDisplayState) {
            airHockeyRenderLastFrame = 0;
            return;
        }

        if (airHockeyState.finished || airHockeyMenuVisible) {
            airHockeyRenderLastFrame = 0;
            renderAirHockey();
            return;
        }

        if (!airHockeyRenderLastFrame) {
            airHockeyRenderLastFrame = timestamp;
        }

        const delta = Math.min((timestamp - airHockeyRenderLastFrame) / 1000, 0.05);
        airHockeyRenderLastFrame = timestamp;
        const role = getMultiplayerAirHockeyRole();
        const input = getMultiplayerAirHockeyInput();
        const paddleCorrection = Math.min(1, delta * 10);
        const puckCorrection = Math.min(1, delta * 9);
        const shouldSimulatePuck = airHockeyState.running && !airHockeyState.countdownActive && !getMultiplayerActiveRoom()?.gameState?.finished;

        if (role === 'left') {
            if (!airHockeyLocalPredicted) {
                airHockeyLocalPredicted = { x: airHockeyState.left.x, y: airHockeyState.left.y };
            }
            airHockeyLocalPredicted.x += input.x * AIR_HOCKEY_SPEED * delta;
            airHockeyLocalPredicted.y += input.y * AIR_HOCKEY_SPEED * delta;
            airHockeyLocalPredicted.x = Math.max(airHockeyState.left.radius, Math.min((airHockeyState.width * 0.5) - AIR_HOCKEY_CENTER_GAP - airHockeyState.left.radius, airHockeyLocalPredicted.x));
            airHockeyLocalPredicted.y = Math.max(airHockeyState.left.radius, Math.min(airHockeyState.height - airHockeyState.left.radius, airHockeyLocalPredicted.y));
            if (input.x === 0 && input.y === 0) {
                const gapX = airHockeyState.left.x - airHockeyLocalPredicted.x;
                const gapY = airHockeyState.left.y - airHockeyLocalPredicted.y;
                if (Math.abs(gapX) <= 18) {
                    airHockeyLocalPredicted.x += gapX * paddleCorrection;
                }
                if (Math.abs(gapY) <= 18) {
                    airHockeyLocalPredicted.y += gapY * paddleCorrection;
                }
            }
            airHockeyDisplayState.left.x = airHockeyLocalPredicted.x;
            airHockeyDisplayState.left.y = airHockeyLocalPredicted.y;
            airHockeyDisplayState.right.x += (airHockeyState.right.x - airHockeyDisplayState.right.x) * paddleCorrection;
            airHockeyDisplayState.right.y += (airHockeyState.right.y - airHockeyDisplayState.right.y) * paddleCorrection;
        } else if (role === 'right') {
            if (!airHockeyLocalPredicted) {
                airHockeyLocalPredicted = { x: airHockeyState.right.x, y: airHockeyState.right.y };
            }
            airHockeyLocalPredicted.x += input.x * AIR_HOCKEY_SPEED * delta;
            airHockeyLocalPredicted.y += input.y * AIR_HOCKEY_SPEED * delta;
            airHockeyLocalPredicted.x = Math.max((airHockeyState.width * 0.5) + AIR_HOCKEY_CENTER_GAP + airHockeyState.right.radius, Math.min(airHockeyState.width - airHockeyState.right.radius, airHockeyLocalPredicted.x));
            airHockeyLocalPredicted.y = Math.max(airHockeyState.right.radius, Math.min(airHockeyState.height - airHockeyState.right.radius, airHockeyLocalPredicted.y));
            if (input.x === 0 && input.y === 0) {
                const gapX = airHockeyState.right.x - airHockeyLocalPredicted.x;
                const gapY = airHockeyState.right.y - airHockeyLocalPredicted.y;
                if (Math.abs(gapX) <= 18) {
                    airHockeyLocalPredicted.x += gapX * paddleCorrection;
                }
                if (Math.abs(gapY) <= 18) {
                    airHockeyLocalPredicted.y += gapY * paddleCorrection;
                }
            }
            airHockeyDisplayState.right.x = airHockeyLocalPredicted.x;
            airHockeyDisplayState.right.y = airHockeyLocalPredicted.y;
            airHockeyDisplayState.left.x += (airHockeyState.left.x - airHockeyDisplayState.left.x) * paddleCorrection;
            airHockeyDisplayState.left.y += (airHockeyState.left.y - airHockeyDisplayState.left.y) * paddleCorrection;
        } else {
            airHockeyDisplayState.left.x += (airHockeyState.left.x - airHockeyDisplayState.left.x) * paddleCorrection;
            airHockeyDisplayState.left.y += (airHockeyState.left.y - airHockeyDisplayState.left.y) * paddleCorrection;
            airHockeyDisplayState.right.x += (airHockeyState.right.x - airHockeyDisplayState.right.x) * paddleCorrection;
            airHockeyDisplayState.right.y += (airHockeyState.right.y - airHockeyDisplayState.right.y) * paddleCorrection;
        }

        if (shouldSimulatePuck) {
            airHockeyDisplayState.puck.x += airHockeyState.puck.vx * delta;
            airHockeyDisplayState.puck.y += airHockeyState.puck.vy * delta;
        }
        airHockeyDisplayState.puck.x += (airHockeyState.puck.x - airHockeyDisplayState.puck.x) * puckCorrection;
        airHockeyDisplayState.puck.y += (airHockeyState.puck.y - airHockeyDisplayState.puck.y) * puckCorrection;

        const remainingMs = Math.max(0, airHockeyCountdownEndsAt - Date.now());
        if (remainingMs) {
            showAirHockeyCountdown(remainingMs > 1860 ? '3' : remainingMs > 1240 ? '2' : remainingMs > 620 ? '1' : 'GO');
        } else {
            hideAirHockeyCountdown();
        }

        renderAirHockey();
        airHockeyRenderAnimationFrame = window.requestAnimationFrame(tick);
    };

    airHockeyRenderAnimationFrame = window.requestAnimationFrame(tick);
}

export function syncMultiplayerAirHockeyState() {
    const { airHockeyLeftScoreDisplay, airHockeyRightScoreDisplay, airHockeyModeButtons, airHockeyStartButton, airHockeyHelpText } = dom();
    if (!isMultiplayerAirHockeyActive()) {
        stopAirHockeyRuntime();
        airHockeyDisplayState = null;
        airHockeyLocalPredicted = null;
        airHockeyCountdownEndsAt = 0;
        airHockeyLastFinishedStateKey = '';
        return;
    }

    // Ferme auto le menu « Mettre prêt » quand la partie est vraiment lancée.
    {
        const room = getMultiplayerActiveRoom();
        if (room?.gameLaunched && airHockeyMenuVisible && !airHockeyMenuResult) {
            airHockeyMenuVisible = false;
            renderAirHockeyMenu();
        }
    }

    if (airHockeyAnimationFrame) {
        window.cancelAnimationFrame(airHockeyAnimationFrame);
        airHockeyAnimationFrame = null;
    }
    airHockeyLastFrame = 0;
    hideAirHockeyCountdown();

    const nextState = getMultiplayerActiveRoom().gameState;
    airHockeyState = {
        leftScore: Number(nextState.leftScore || 0),
        rightScore: Number(nextState.rightScore || 0),
        running: Boolean(nextState.running),
        servingSide: nextState.servingSide || 'left',
        width: Number(nextState.width || 720),
        height: Number(nextState.height || 360),
        left: { ...nextState.left },
        right: { ...nextState.right },
        puck: { ...nextState.puck },
        countdownActive: Boolean(nextState.countdownEndsAt && nextState.countdownEndsAt > Date.now()),
        finished: Boolean(nextState.finished),
        winner: nextState.winner || null,
        round: Number(nextState.round || 0)
    };

    const shouldSnap = !airHockeyDisplayState
        || airHockeyDisplayState.round !== airHockeyState.round
        || Math.abs(airHockeyDisplayState.puck.x - airHockeyState.puck.x) > 120
        || Math.abs(airHockeyDisplayState.puck.y - airHockeyState.puck.y) > 80;

    if (shouldSnap) {
        airHockeyDisplayState = JSON.parse(JSON.stringify(airHockeyState));
        airHockeyLocalPredicted = getMultiplayerAirHockeyRole() === 'right'
            ? { x: airHockeyState.right.x, y: airHockeyState.right.y }
            : { x: airHockeyState.left.x, y: airHockeyState.left.y };
    } else {
        airHockeyDisplayState.round = airHockeyState.round;
    }

    airHockeyCountdownEndsAt = Number(nextState.countdownEndsAt || 0);
    if (airHockeyCountdownEndsAt > Date.now()) {
        const remainingMs = Math.max(0, airHockeyCountdownEndsAt - Date.now());
        showAirHockeyCountdown(remainingMs > 1860 ? '3' : remainingMs > 1240 ? '2' : remainingMs > 620 ? '1' : 'GO');
    } else {
        hideAirHockeyCountdown();
    }
    airHockeyLeftScoreDisplay.textContent = String(airHockeyState.leftScore);
    airHockeyRightScoreDisplay.textContent = String(airHockeyState.rightScore);
    airHockeyModeButtons.forEach((button) => {
        button.classList.remove('is-active');
        button.disabled = true;
    });
    airHockeyStartButton.textContent = getCurrentMultiplayerPlayer()?.isHost ? 'Lancer' : 'En attente';
    airHockeyStartButton.disabled = !getCurrentMultiplayerPlayer()?.isHost || (getMultiplayerActiveRoom()?.playerCount || 0) < 2;
    airHockeyHelpText.textContent = airHockeyState.finished
        ? (airHockeyState.winner === getMultiplayerAirHockeyRole() ? 'Victoire. Le palet finit dans les filets adverses.' : "D\u00e9faite. L'adversaire remporte le duel.")
        : (airHockeyState.running ? 'Déplace ton palet avec fluidité. Premier à 5.' : "Attends que l'hôte lance le duel.");

    if (airHockeyState.finished) {
        stopAirHockeyRuntime();
        resetMultiplayerAirHockeyInput();
    }

    renderAirHockey();
    if (!airHockeyState.finished) {
        ensureMultiplayerAirHockeyRenderLoop();
        pushMultiplayerAirHockeyInput();
    }

    if (!airHockeyState.finished) {
        airHockeyLastFinishedStateKey = '';
        return;
    }

    const finishedKey = `${airHockeyState.round}:${airHockeyState.winner || 'none'}`;
    if (finishedKey === airHockeyLastFinishedStateKey || activeGameTabAccessor() !== 'airHockey') {
        return;
    }

    airHockeyLastFinishedStateKey = finishedKey;
    if (airHockeyState.winner === getMultiplayerAirHockeyRole()) {
        revealAirHockeyOutcomeMenu(
            'Victoire',
            'Tu remportes ce duel de Sea Hockey en ligne.',
            'Pont en liesse'
        );
    } else {
        revealAirHockeyOutcomeMenu(
            "C'est perdu",
            "L'adversaire remporte ce duel de Sea Hockey.",
            'Duel termin\u00e9'
        );
    }
}

export function renderAirHockey() {
    const { airHockeyLeftScoreDisplay, airHockeyRightScoreDisplay, airHockeyLeftPaddle, airHockeyRightPaddle, airHockeyPuck } = dom();
    const currentAirHockeyState = isMultiplayerAirHockeyActive() && airHockeyDisplayState ? airHockeyDisplayState : airHockeyState;

    if (!currentAirHockeyState) {
        return;
    }

    airHockeyLeftScoreDisplay.textContent = String(currentAirHockeyState.leftScore);
    airHockeyRightScoreDisplay.textContent = String(currentAirHockeyState.rightScore);
    airHockeyLeftPaddle.style.transform = `translate(${currentAirHockeyState.left.x - currentAirHockeyState.left.radius}px, ${currentAirHockeyState.left.y - currentAirHockeyState.left.radius}px)`;
    airHockeyRightPaddle.style.transform = `translate(${currentAirHockeyState.right.x - currentAirHockeyState.right.radius}px, ${currentAirHockeyState.right.y - currentAirHockeyState.right.radius}px)`;
    airHockeyPuck.style.transform = `translate(${currentAirHockeyState.puck.x - currentAirHockeyState.puck.radius}px, ${currentAirHockeyState.puck.y - currentAirHockeyState.puck.radius}px)`;
}

export function stopAirHockeyRuntime() {
    if (airHockeyAnimationFrame) {
        window.cancelAnimationFrame(airHockeyAnimationFrame);
        airHockeyAnimationFrame = null;
    }
    if (airHockeyRenderAnimationFrame) {
        window.cancelAnimationFrame(airHockeyRenderAnimationFrame);
        airHockeyRenderAnimationFrame = null;
    }
    airHockeyLastFrame = 0;
    airHockeyRenderLastFrame = 0;
    hideAirHockeyCountdown();
}

export function getAirHockeyDimensions() {
    const { airHockeyBoard } = dom();
    return {
        width: airHockeyBoard?.clientWidth || 720,
        height: airHockeyBoard?.clientHeight || 360
    };
}

export function getAirHockeyGoalBounds() {
    const { height } = getAirHockeyDimensions();
    const goalHeight = height * 0.48;
    const top = (height - goalHeight) / 2;

    return {
        top,
        bottom: top + goalHeight
    };
}

export function clampAirHockeySpeed() {
    const puck = airHockeyState?.puck;

    if (!puck) {
        return;
    }

    const speed = Math.hypot(puck.vx, puck.vy);
    const maxSpeed = AIR_HOCKEY_PUCK_MAX_SPEED;

    if (speed <= maxSpeed || !speed) {
        return;
    }

    const scale = maxSpeed / speed;
    puck.vx *= scale;
    puck.vy *= scale;
}

export function hideAirHockeyCountdown() {
    const { airHockeyCountdown } = dom();
    if (airHockeyCountdownTimer) {
        window.clearTimeout(airHockeyCountdownTimer);
        airHockeyCountdownTimer = null;
    }

    if (airHockeyCountdownCompleteTimer) {
        window.clearTimeout(airHockeyCountdownCompleteTimer);
        airHockeyCountdownCompleteTimer = null;
    }

    airHockeyCountdownActive = false;

    if (!airHockeyCountdown) {
        return;
    }

    airHockeyCountdown.textContent = '';
    airHockeyCountdown.classList.add('hidden');
    airHockeyCountdown.setAttribute('aria-hidden', 'true');
}

export function getAirHockeyRulesText() {
    return "Le joueur gauche se déplace avec ZQSD. En solo, la droite est pilotée par l'IA. En duo local, la droite se joue aux flèches. Premier à 5 buts.";
}

export function renderAirHockeyMenu() {
    const { airHockeyMenuOverlay, airHockeyBoard, airHockeyMenuEyebrow, airHockeyMenuTitle, airHockeyMenuText, airHockeyMenuActionButton, airHockeyMenuRulesButton } = dom();
    if (!airHockeyMenuOverlay || !airHockeyBoard) {
        return;
    }

    syncGameMenuOverlayBounds(airHockeyMenuOverlay, airHockeyBoard);
    airHockeyMenuOverlay.classList.toggle('hidden', !airHockeyMenuVisible);
    airHockeyMenuOverlay.classList.toggle('is-closing', airHockeyMenuClosing);
    airHockeyMenuOverlay.classList.toggle('is-entering', airHockeyMenuEntering);
    airHockeyBoard.classList.toggle('is-menu-open', airHockeyMenuVisible);

    if (!airHockeyMenuVisible) {
        return;
    }

    const hasResult = Boolean(airHockeyMenuResult);
    if (airHockeyMenuEyebrow) {
        airHockeyMenuEyebrow.textContent = airHockeyMenuShowingRules
            ? 'R\u00e8gles'
            : (hasResult ? airHockeyMenuResult.eyebrow : 'Duel de pont');
    }
    if (airHockeyMenuTitle) {
        airHockeyMenuTitle.textContent = airHockeyMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult ? airHockeyMenuResult.title : 'Sea Hockey');
    }
    if (airHockeyMenuText) {
        airHockeyMenuText.textContent = airHockeyMenuShowingRules
            ? getAirHockeyRulesText()
            : (hasResult
                ? airHockeyMenuResult.text
                : ((isMultiplayerAirHockeyActive() && !getMultiplayerActiveRoom()?.gameLaunched)
                    ? 'Quand tous les joueurs sont pr\u00eats, le duel de Sea Hockey commence automatiquement.'
                    : 'Choisis ton mode puis engage le palet sur le pont glissant de la baie.'));
    }
    if (airHockeyMenuActionButton) {
        airHockeyMenuActionButton.textContent = airHockeyMenuShowingRules
            ? 'Retour'
            : ((isMultiplayerAirHockeyActive() && !getMultiplayerActiveRoom()?.gameLaunched)
                ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                : (hasResult ? 'Relancer le duel' : 'Lancer le duel'));
    }
    if (airHockeyMenuRulesButton) {
        airHockeyMenuRulesButton.textContent = 'R\u00e8gles';
        airHockeyMenuRulesButton.hidden = airHockeyMenuShowingRules;
    }
}

export function closeAirHockeyMenu() {
    airHockeyMenuClosing = true;
    renderAirHockeyMenu();
    window.setTimeout(() => {
        airHockeyMenuClosing = false;
        airHockeyMenuVisible = false;
        airHockeyMenuShowingRules = false;
        airHockeyMenuEntering = false;
        airHockeyMenuResult = null;
        renderAirHockeyMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealAirHockeyOutcomeMenu(title, text, eyebrow) {
    const { airHockeyHelpText } = dom();
    airHockeyMenuVisible = true;
    airHockeyMenuResult = { title, text, eyebrow };
    airHockeyMenuShowingRules = false;
    airHockeyMenuClosing = false;
    airHockeyMenuEntering = true;
    airHockeyHelpText.textContent = text;
    renderAirHockeyMenu();
    window.setTimeout(() => {
        airHockeyMenuEntering = false;
        renderAirHockeyMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function showAirHockeyCountdown(label) {
    const { airHockeyCountdown } = dom();
    if (!airHockeyCountdown) {
        return;
    }

    airHockeyCountdown.textContent = label;
    airHockeyCountdown.classList.remove('hidden');
    airHockeyCountdown.setAttribute('aria-hidden', 'false');
}

export function startAirHockeyCountdown(onComplete) {
    hideAirHockeyCountdown();
    airHockeyCountdownActive = true;

    const steps = ['3', '2', '1', 'GO'];
    let stepIndex = 0;

    const runStep = () => {
        const currentLabel = steps[stepIndex];

        if (currentLabel === undefined) {
            airHockeyCountdownCompleteTimer = window.setTimeout(() => {
                hideAirHockeyCountdown();
                onComplete?.();
            }, 260);
            return;
        }

        showAirHockeyCountdown(currentLabel);
        stepIndex += 1;
        airHockeyCountdownTimer = window.setTimeout(runStep, 620);
    };

    runStep();
}

export function positionAirHockeyPuck(servingSide = Math.random() > 0.5 ? 'left' : 'right') {
    const { width, height } = getAirHockeyDimensions();
    const spawnX = servingSide === 'left' ? width * 0.25 : width * 0.75;

    airHockeyState.servingSide = servingSide;
    airHockeyState.running = false;
    airHockeyState.puck.x = spawnX;
    airHockeyState.puck.y = height * 0.5;
    airHockeyState.puck.vx = 0;
    airHockeyState.puck.vy = 0;
}

export function initializeAirHockey(resetScores = true) {
    const { airHockeyHelpText } = dom();
    stopAirHockeyRuntime();
    airHockeyRenderLastFrame = 0;
    airHockeyDisplayState = null;
    airHockeyLocalPredicted = null;
    airHockeyMenuResult = null;
    airHockeyMenuShowingRules = false;
    airHockeyMenuClosing = false;
    airHockeyMenuEntering = false;

    if (isMultiplayerAirHockeyActive()) {
        const room = getMultiplayerActiveRoom();
        airHockeyMenuVisible = !room?.gameLaunched;
        renderAirHockeyMenu();
        syncMultiplayerAirHockeyState();
        return;
    }

    const { width, height } = getAirHockeyDimensions();
    airHockeyState = {
        leftScore: resetScores ? 0 : airHockeyState?.leftScore || 0,
        rightScore: resetScores ? 0 : airHockeyState?.rightScore || 0,
        running: false,
        left: { x: width * 0.16, y: height * 0.5, radius: AIR_HOCKEY_PADDLE_RADIUS, vx: 0, vy: 0 },
        right: { x: width * 0.84, y: height * 0.5, radius: AIR_HOCKEY_PADDLE_RADIUS, vx: 0, vy: 0 },
        puck: { x: width * 0.5, y: height * 0.5, vx: 0, vy: 0, radius: AIR_HOCKEY_PUCK_RADIUS },
        servingSide: 'left'
    };
    hideAirHockeyCountdown();
    positionAirHockeyPuck();
    airHockeyHelpText.textContent = 'La balle attend dans un camp. Clique sur Lancer pour engager la partie de Sea Hockey.';
    renderAirHockey();
    renderAirHockeyMenu();
}

export function launchAirHockeyPuck() {
    const { airHockeyHelpText } = dom();
    if (isMultiplayerAirHockeyActive()) {
        const socket = getMultiplayerSocket();
        if (!socket?.connected) {
            setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
            return;
        }

        if (!getCurrentMultiplayerPlayer()?.isHost) {
            setMultiplayerStatus("Seul l'hôte peut lancer le duel.");
            return;
        }

        socket.emit('airhockey:start');
        setMultiplayerStatus('Le duel de Sea Hockey se prepare pour tout le salon.');
        return;
    }

    if (airHockeyCountdownActive) {
        return;
    }

    airHockeyState.puck.vx = 0;
    airHockeyState.puck.vy = 0;
    airHockeyState.running = false;
    airHockeyHelpText.textContent = 'Pr\u00e9paration de l\u2019engagement\u2026';
    startAirHockeyCountdown(() => {
        airHockeyState.running = true;
        airHockeyHelpText.textContent = airHockeyState.servingSide === 'left'
            ? "Engagement à gauche. Va toucher la balle pour lancer l'action."
            : "Engagement à droite. Va toucher la balle pour lancer l'action.";
        if (!airHockeyAnimationFrame) {
            airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
        }
    });
}

export function handleAirHockeyPoint(side) {
    const { airHockeyHelpText } = dom();
    airHockeyState[side === 'left' ? 'leftScore' : 'rightScore'] += 1;
    if (airHockeyState.leftScore >= AIR_HOCKEY_GOAL_SCORE || airHockeyState.rightScore >= AIR_HOCKEY_GOAL_SCORE) {
        airHockeyState.running = false;
        airHockeyState.puck.vx = 0;
        airHockeyState.puck.vy = 0;
        airHockeyKeys.clear();
        stopAirHockeyRuntime();
        const winnerLabel = airHockeyState.leftScore > airHockeyState.rightScore ? 'Le joueur gauche' : 'Le joueur droit';
        revealAirHockeyOutcomeMenu(
            'Duel termin\u00e9',
            `${winnerLabel} gagne ${airHockeyState.leftScore} a ${airHockeyState.rightScore}.`,
            'Pont en liesse'
        );
        return;
    }

    initializeAirHockey(false);
    positionAirHockeyPuck(side === 'left' ? 'right' : 'left');
    airHockeyHelpText.textContent = 'But marqu\u00e9. Nouvel engagement en pr\u00e9paration\u2026';
    startAirHockeyCountdown(() => {
        airHockeyState.running = true;
        airHockeyHelpText.textContent = airHockeyState.servingSide === 'left'
            ? "Engagement à gauche. Va toucher la balle pour lancer l'action."
            : "Engagement à droite. Va toucher la balle pour lancer l'action.";
        if (!airHockeyAnimationFrame) {
            airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
        }
    });
}

export function updateAirHockey(timestamp) {
    if (!airHockeyState) {
        return;
    }
    const { width, height } = getAirHockeyDimensions();

    if (!airHockeyLastFrame) {
        airHockeyLastFrame = timestamp;
    }

    const delta = Math.min(0.032, (timestamp - airHockeyLastFrame) / 1000);
    airHockeyLastFrame = timestamp;
    const airHockeyControlsLocked = airHockeyCountdownActive || !airHockeyState.running;

    const movePaddle = (paddle, up, down, left, right) => {
        if (airHockeyControlsLocked) {
            paddle.vx = 0;
            paddle.vy = 0;
            return;
        }

        const speed = 280;
        const previousX = paddle.x;
        const previousY = paddle.y;
        let moveX = ((airHockeyKeys.has(right) ? 1 : 0) - (airHockeyKeys.has(left) ? 1 : 0));
        let moveY = ((airHockeyKeys.has(down) ? 1 : 0) - (airHockeyKeys.has(up) ? 1 : 0));
        const magnitude = Math.hypot(moveX, moveY);

        if (magnitude > 1) {
            moveX /= magnitude;
            moveY /= magnitude;
        }

        paddle.x += moveX * speed * delta;
        paddle.y += moveY * speed * delta;
        paddle.y = Math.max(paddle.radius, Math.min(height - paddle.radius, paddle.y));
        paddle.vx = delta ? (paddle.x - previousX) / delta : 0;
        paddle.vy = delta ? (paddle.y - previousY) / delta : 0;
    };

    movePaddle(airHockeyState.left, 'z', 's', 'q', 'd');
    airHockeyState.left.x = Math.max(airHockeyState.left.radius, Math.min((width * 0.5) - AIR_HOCKEY_CENTER_GAP - airHockeyState.left.radius, airHockeyState.left.x));
    airHockeyState.left.vx = delta ? Math.max(-280, Math.min(280, airHockeyState.left.vx)) : 0;
    airHockeyState.left.vy = delta ? Math.max(-280, Math.min(280, airHockeyState.left.vy)) : 0;

    if (airHockeyMode === 'duo') {
        movePaddle(airHockeyState.right, 'arrowup', 'arrowdown', 'arrowleft', 'arrowright');
    } else if (!airHockeyControlsLocked) {
        const previousX = airHockeyState.right.x;
        const previousY = airHockeyState.right.y;
        const targetX = airHockeyState.puck.x > (width * 0.5) ? airHockeyState.puck.x : width * 0.84;
        airHockeyState.right.x += Math.max(-180 * delta, Math.min(180 * delta, targetX - airHockeyState.right.x));
        airHockeyState.right.y += Math.max(-200 * delta, Math.min(200 * delta, airHockeyState.puck.y - airHockeyState.right.y));
        airHockeyState.right.y = Math.max(airHockeyState.right.radius, Math.min(height - airHockeyState.right.radius, airHockeyState.right.y));
        airHockeyState.right.vx = delta ? (airHockeyState.right.x - previousX) / delta : 0;
        airHockeyState.right.vy = delta ? (airHockeyState.right.y - previousY) / delta : 0;
    } else {
        airHockeyState.right.vx = 0;
        airHockeyState.right.vy = 0;
    }
    airHockeyState.right.x = Math.max((width * 0.5) + AIR_HOCKEY_CENTER_GAP + airHockeyState.right.radius, Math.min(width - airHockeyState.right.radius, airHockeyState.right.x));

    if (airHockeyState.running && !airHockeyCountdownActive) {

        const puck = airHockeyState.puck;
        puck.x += puck.vx * delta;
        puck.y += puck.vy * delta;
        puck.vx *= 0.9975;
        puck.vy *= 0.9975;
        const goalBounds = getAirHockeyGoalBounds();

        if (puck.y <= puck.radius || puck.y >= height - puck.radius) {
            puck.vy *= -1;
            puck.y = Math.max(puck.radius, Math.min(height - puck.radius, puck.y));
        }

        const puckInGoalOpening = puck.y >= goalBounds.top + puck.radius && puck.y <= goalBounds.bottom - puck.radius;

        if (puck.x <= puck.radius) {
            if (puckInGoalOpening) {
                handleAirHockeyPoint('right');
                renderAirHockey();
                if (!airHockeyMenuVisible) {
                    airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
                }
                return;
            }

            puck.x = puck.radius;
            puck.vx = Math.abs(puck.vx);
        }

        if (puck.x >= width - puck.radius) {
            if (puckInGoalOpening) {
                handleAirHockeyPoint('left');
                renderAirHockey();
                if (!airHockeyMenuVisible) {
                    airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
                }
                return;
            }

            puck.x = width - puck.radius;
            puck.vx = -Math.abs(puck.vx);
        }

        [airHockeyState.left, airHockeyState.right].forEach((paddle) => {
            const dx = puck.x - paddle.x;
            const dy = puck.y - paddle.y;
            const rawDistance = Math.hypot(dx, dy);
            const distance = rawDistance || 0.001;
            const minDistance = puck.radius + paddle.radius;

            if (distance < minDistance) {
                let nx = dx / distance;
                let ny = dy / distance;
                const paddleMotion = Math.hypot(paddle.vx, paddle.vy);

                if (rawDistance < 0.5) {
                    if (paddleMotion > 1) {
                        nx = paddle.vx / paddleMotion;
                        ny = paddle.vy / paddleMotion;
                    } else {
                        nx = paddle === airHockeyState.left ? 1 : -1;
                        ny = 0;
                    }
                }

                const overlap = minDistance - distance;
                puck.x += nx * (overlap + 0.5);
                puck.y += ny * (overlap + 0.5);

                const relativeVx = puck.vx - paddle.vx;
                const relativeVy = puck.vy - paddle.vy;
                const approachSpeed = (relativeVx * nx) + (relativeVy * ny);
                const paddleSpeed = paddleMotion;

                if (approachSpeed < 0) {
                    const bounce = -(1.35 * approachSpeed);
                    const carry = Math.min(220, paddleSpeed * 0.55);
                    puck.vx += (bounce + carry) * nx + (paddle.vx * 0.32);
                    puck.vy += (bounce + carry) * ny + (paddle.vy * 0.32);
                } else {
                    puck.vx += nx * (44 + paddleSpeed * 0.1);
                    puck.vy += ny * (44 + paddleSpeed * 0.1);
                }

                clampAirHockeySpeed();
            }
        });

    }

    renderAirHockey();
    airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
}

// State accessors for wiring in script.js.
export function getAirHockeyMode() { return airHockeyMode; }
export function setAirHockeyMode(v) { airHockeyMode = v; }
export function getAirHockeyState() { return airHockeyState; }
export function getAirHockeyKeys() { return airHockeyKeys; }
export function getAirHockeyMenuVisible() { return airHockeyMenuVisible; }
export function setAirHockeyMenuVisible(v) { airHockeyMenuVisible = Boolean(v); }
export function getAirHockeyMenuShowingRules() { return airHockeyMenuShowingRules; }
export function setAirHockeyMenuShowingRules(v) { airHockeyMenuShowingRules = Boolean(v); }
export function getAirHockeyMenuClosing() { return airHockeyMenuClosing; }
export function getAirHockeyMenuResult() { return airHockeyMenuResult; }
export function setAirHockeyMenuResult(v) { airHockeyMenuResult = v; }
export function getAirHockeyCountdownActive() { return airHockeyCountdownActive; }
export function resetAirHockeyMultiplayerTrackers() {
    airHockeyLastFinishedStateKey = '';
    airHockeyMultiplayerInput = { x: 0, y: 0 };
    airHockeyDisplayState = null;
    airHockeyLocalPredicted = null;
    airHockeyCountdownEndsAt = 0;
}
