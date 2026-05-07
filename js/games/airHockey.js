// Game module — Sea Hockey (airHockey), solo/duo/multijoueur avec IA simple.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';

export const AIR_HOCKEY_GOAL_SCORE = 5;
export const AIR_HOCKEY_SPEED = 340;
export const AIR_HOCKEY_CENTER_GAP = 8;
export const AIR_HOCKEY_PADDLE_RADIUS = 34;
export const AIR_HOCKEY_PUCK_RADIUS = 22;
export const AIR_HOCKEY_PUCK_MAX_SPEED = 700;

let airHockeyMode = 'solo';
let airHockeyState = null;
let _airHockeyTouchPos = null;
const airHockeyKeys = new Set();
let airHockeyAnimationFrame = null;
let airHockeyLastFrame = 0;
let airHockeyCountdownActive = false;
let airHockeyCountdownTimer = null;
let airHockeyCountdownCompleteTimer = null;
let airHockeyMenuVisible = true;
let airHockeyMenuShowingRules = false;
let airHockeyMenuClosing = false;
let airHockeyMenuEntering = false;
let airHockeyMenuResult = null;


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

export function setAirHockeyTouchPos(boardX, boardY) {
    _airHockeyTouchPos = { x: boardX, y: boardY };
}

export function clearAirHockeyTouchPos() {
    _airHockeyTouchPos = null;
}

export function renderAirHockey() {
    const { airHockeyLeftScoreDisplay, airHockeyRightScoreDisplay, airHockeyLeftPaddle, airHockeyRightPaddle, airHockeyPuck } = dom();
    const currentAirHockeyState = airHockeyState;

    if (!currentAirHockeyState) {
        return;
    }

    airHockeyLeftScoreDisplay.textContent = String(currentAirHockeyState.leftScore);
    airHockeyRightScoreDisplay.textContent = String(currentAirHockeyState.rightScore);
    airHockeyLeftPaddle.style.transform = `translate3d(${currentAirHockeyState.left.x - currentAirHockeyState.left.radius}px, ${currentAirHockeyState.left.y - currentAirHockeyState.left.radius}px, 0)`;
    airHockeyRightPaddle.style.transform = `translate3d(${currentAirHockeyState.right.x - currentAirHockeyState.right.radius}px, ${currentAirHockeyState.right.y - currentAirHockeyState.right.radius}px, 0)`;
    airHockeyPuck.style.transform = `translate3d(${currentAirHockeyState.puck.x - currentAirHockeyState.puck.radius}px, ${currentAirHockeyState.puck.y - currentAirHockeyState.puck.radius}px, 0)`;
}

export function stopAirHockeyRuntime() {
    if (airHockeyAnimationFrame) {
        window.cancelAnimationFrame(airHockeyAnimationFrame);
        airHockeyAnimationFrame = null;
    }
    airHockeyLastFrame = 0;
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
                : 'Choisis ton mode puis engage le palet sur le pont glissant de la baie.');
    }
    if (airHockeyMenuActionButton) {
        airHockeyMenuActionButton.textContent = airHockeyMenuShowingRules
            ? 'Retour'
            : (hasResult ? 'Relancer le duel' : 'Lancer le duel');
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
    airHockeyMenuResult = null;
    airHockeyMenuShowingRules = false;
    airHockeyMenuClosing = false;
    airHockeyMenuEntering = false;

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

export function startAirHockeyLaunchSequence() {
    initializeAirHockey(false);
    closeAirHockeyMenu();
    window.setTimeout(() => {
        const { airHockeyPuck, airHockeyLeftPaddle, airHockeyRightPaddle } = dom();
        for (const el of [airHockeyPuck, airHockeyLeftPaddle, airHockeyRightPaddle]) {
            if (!el) continue;
            el.classList.add('is-spawning');
            el.addEventListener('animationend', () => el.classList.remove('is-spawning'), { once: true });
        }
        launchAirHockeyPuck();
    }, UNO_MENU_CLOSE_DURATION_MS);
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

    if (_airHockeyTouchPos && !airHockeyControlsLocked) {
        const prev = { x: airHockeyState.left.x, y: airHockeyState.left.y };
        const speed = 560;
        const dx = _airHockeyTouchPos.x - airHockeyState.left.x;
        const dy = _airHockeyTouchPos.y - airHockeyState.left.y;
        const dist = Math.hypot(dx, dy);
        const step = Math.min(dist, speed * delta);
        if (dist > 1) {
            airHockeyState.left.x += (dx / dist) * step;
            airHockeyState.left.y += (dy / dist) * step;
        }
        airHockeyState.left.vx = delta ? (airHockeyState.left.x - prev.x) / delta : 0;
        airHockeyState.left.vy = delta ? (airHockeyState.left.y - prev.y) / delta : 0;
    } else {
        movePaddle(airHockeyState.left, 'z', 's', 'q', 'd');
    }
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
