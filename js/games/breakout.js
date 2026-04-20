// Game module — Break It (Breakout).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const BREAKOUT_BEST_KEY = 'baie-des-naufrages-breakout-best';
export const BREAKOUT_BALL_SPEED = 320;
export const BREAKOUT_MAX_STEP_DISTANCE = 4;

let breakoutState = null;
let breakoutAnimationFrame = null;
let breakoutLastFrame = 0;
let breakoutKeys = new Set();
let breakoutBestScore = (typeof window !== 'undefined' && Number(window.localStorage.getItem(BREAKOUT_BEST_KEY))) || 0;
let breakoutRemainingBricks = 0;
let breakoutMenuVisible = true;
let breakoutMenuShowingRules = false;
let breakoutMenuClosing = false;
let breakoutMenuResult = null;

const $ = (id) => document.getElementById(id);
function dom() {
    const breakoutCanvas = $('breakoutCanvas');
    return {
        breakoutCanvas,
        breakoutContext: breakoutCanvas?.getContext('2d'),
        breakoutScoreDisplay: $('breakoutScoreDisplay'),
        breakoutLivesDisplay: $('breakoutLivesDisplay'),
        breakoutHelpText: $('breakoutHelpText'),
        breakoutTable: $('breakoutTable'),
        breakoutMenuOverlay: $('breakoutMenuOverlay'),
        breakoutMenuEyebrow: $('breakoutMenuEyebrow'),
        breakoutMenuTitle: $('breakoutMenuTitle'),
        breakoutMenuText: $('breakoutMenuText'),
        breakoutMenuActionButton: $('breakoutMenuActionButton'),
        breakoutMenuRulesButton: $('breakoutMenuRulesButton')
    };
}

function setBreakoutBallVelocity(directionX, directionY) {
    const magnitude = Math.hypot(directionX, directionY) || 1;
    breakoutState.ball.vx = (directionX / magnitude) * BREAKOUT_BALL_SPEED;
    breakoutState.ball.vy = (directionY / magnitude) * BREAKOUT_BALL_SPEED;
}

function resetBreakoutBall() {
    const { breakoutCanvas } = dom();
    breakoutState.ball.x = breakoutCanvas.width / 2;
    breakoutState.ball.y = breakoutCanvas.height * 0.68;
    setBreakoutBallVelocity(0.45, -1);
}

function resolveBreakoutBrickCollision(brick, previousX, previousY) {
    const { ball } = breakoutState;
    const radius = ball.radius;
    const crossedFromLeft = previousX + radius <= brick.x;
    const crossedFromRight = previousX - radius >= brick.x + brick.width;
    const crossedFromTop = previousY + radius <= brick.y;
    const crossedFromBottom = previousY - radius >= brick.y + brick.height;

    if (crossedFromLeft) {
        ball.x = brick.x - radius;
        ball.vx = -Math.abs(ball.vx);
        return;
    }

    if (crossedFromRight) {
        ball.x = brick.x + brick.width + radius;
        ball.vx = Math.abs(ball.vx);
        return;
    }

    if (crossedFromTop) {
        ball.y = brick.y - radius;
        ball.vy = -Math.abs(ball.vy);
        return;
    }

    if (crossedFromBottom) {
        ball.y = brick.y + brick.height + radius;
        ball.vy = Math.abs(ball.vy);
        return;
    }

    const overlapLeft = ball.x + radius - brick.x;
    const overlapRight = brick.x + brick.width - (ball.x - radius);
    const overlapTop = ball.y + radius - brick.y;
    const overlapBottom = brick.y + brick.height - (ball.y - radius);
    const horizontalOverlap = Math.min(overlapLeft, overlapRight);
    const verticalOverlap = Math.min(overlapTop, overlapBottom);

    if (horizontalOverlap < verticalOverlap) {
        if (overlapLeft < overlapRight) {
            ball.x = brick.x - radius;
            ball.vx = -Math.abs(ball.vx);
        } else {
            ball.x = brick.x + brick.width + radius;
            ball.vx = Math.abs(ball.vx);
        }
        return;
    }

    if (overlapTop < overlapBottom) {
        ball.y = brick.y - radius;
        ball.vy = -Math.abs(ball.vy);
    } else {
        ball.y = brick.y + brick.height + radius;
        ball.vy = Math.abs(ball.vy);
    }
}

function drawBreakoutRoundedRect(context, x, y, width, height, radius) {
    const clampedRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + clampedRadius, y);
    context.lineTo(x + width - clampedRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + clampedRadius);
    context.lineTo(x + width, y + height - clampedRadius);
    context.quadraticCurveTo(x + width, y + height, x + width - clampedRadius, y + height);
    context.lineTo(x + clampedRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - clampedRadius);
    context.lineTo(x, y + clampedRadius);
    context.quadraticCurveTo(x, y, x + clampedRadius, y);
    context.closePath();
}

function createBreakoutBricks() {
    const { breakoutCanvas } = dom();
    const rows = 5;
    const cols = 8;
    const sidePadding = 38;
    const topOffset = 28;
    const gapX = 10;
    const gapY = 8;
    const brickWidth = ((breakoutCanvas.width - (sidePadding * 2)) - (gapX * (cols - 1))) / cols;
    const brickHeight = 16;
    const rowThemes = [
        { top: '#facc15', bottom: '#d97706' },
        { top: '#fb7185', bottom: '#be123c' },
        { top: '#38bdf8', bottom: '#2563eb' },
        { top: '#34d399', bottom: '#0f766e' },
        { top: '#c084fc', bottom: '#7c3aed' }
    ];

    return Array.from({ length: rows }, (_, row) => (
        Array.from({ length: cols }, (_, col) => ({
            x: sidePadding + col * (brickWidth + gapX),
            y: topOffset + row * (brickHeight + gapY),
            width: brickWidth,
            height: brickHeight,
            alive: true,
            theme: rowThemes[row % rowThemes.length]
        }))
    )).flat();
}

function drawBreakoutBackdrop() {
    const { breakoutContext, breakoutCanvas } = dom();
    const skyGradient = breakoutContext.createLinearGradient(0, 0, 0, breakoutCanvas.height);
    skyGradient.addColorStop(0, '#7dd3fc');
    skyGradient.addColorStop(0.48, '#38bdf8');
    skyGradient.addColorStop(0.72, '#0f766e');
    skyGradient.addColorStop(1, '#082f49');
    breakoutContext.fillStyle = skyGradient;
    breakoutContext.fillRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);

    const sunGlow = breakoutContext.createRadialGradient(118, 88, 12, 118, 88, 92);
    sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
    sunGlow.addColorStop(0.4, 'rgba(251, 191, 36, 0.42)');
    sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    breakoutContext.fillStyle = sunGlow;
    breakoutContext.beginPath();
    breakoutContext.arc(118, 88, 92, 0, Math.PI * 2);
    breakoutContext.fill();

    breakoutContext.fillStyle = 'rgba(255, 255, 255, 0.68)';
    breakoutContext.beginPath();
    breakoutContext.ellipse(154, 74, 28, 14, 0, 0, Math.PI * 2);
    breakoutContext.ellipse(186, 72, 34, 18, 0, 0, Math.PI * 2);
    breakoutContext.ellipse(216, 78, 24, 12, 0, 0, Math.PI * 2);
    breakoutContext.fill();

    breakoutContext.fillStyle = 'rgba(15, 23, 42, 0.26)';
    breakoutContext.beginPath();
    breakoutContext.moveTo(0, breakoutCanvas.height * 0.68);
    breakoutContext.lineTo(86, breakoutCanvas.height * 0.54);
    breakoutContext.lineTo(148, breakoutCanvas.height * 0.62);
    breakoutContext.lineTo(222, breakoutCanvas.height * 0.48);
    breakoutContext.lineTo(304, breakoutCanvas.height * 0.67);
    breakoutContext.lineTo(0, breakoutCanvas.height * 0.67);
    breakoutContext.closePath();
    breakoutContext.fill();

    breakoutContext.fillStyle = 'rgba(15, 23, 42, 0.38)';
    breakoutContext.beginPath();
    breakoutContext.moveTo(breakoutCanvas.width * 0.58, breakoutCanvas.height * 0.68);
    breakoutContext.lineTo(breakoutCanvas.width * 0.68, breakoutCanvas.height * 0.56);
    breakoutContext.lineTo(breakoutCanvas.width * 0.78, breakoutCanvas.height * 0.61);
    breakoutContext.lineTo(breakoutCanvas.width * 0.88, breakoutCanvas.height * 0.5);
    breakoutContext.lineTo(breakoutCanvas.width, breakoutCanvas.height * 0.68);
    breakoutContext.closePath();
    breakoutContext.fill();

    breakoutContext.strokeStyle = 'rgba(255,255,255,0.18)';
    breakoutContext.lineWidth = 2;
    for (let wave = 0; wave < 5; wave += 1) {
        const waveY = breakoutCanvas.height - 86 + wave * 13;
        breakoutContext.beginPath();
        breakoutContext.moveTo(0, waveY);
        for (let x = 0; x <= breakoutCanvas.width; x += 36) {
            breakoutContext.quadraticCurveTo(x + 18, waveY - 8, x + 36, waveY);
        }
        breakoutContext.stroke();
    }
}

function drawBreakoutBrick(brick) {
    const { breakoutContext } = dom();
    const gradient = breakoutContext.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.height);
    gradient.addColorStop(0, brick.theme.top);
    gradient.addColorStop(1, brick.theme.bottom);

    drawBreakoutRoundedRect(breakoutContext, brick.x, brick.y, brick.width, brick.height, 6);
    breakoutContext.fillStyle = gradient;
    breakoutContext.fill();
    breakoutContext.strokeStyle = 'rgba(255, 248, 220, 0.28)';
    breakoutContext.lineWidth = 1;
    breakoutContext.stroke();

    breakoutContext.fillStyle = 'rgba(255, 255, 255, 0.18)';
    breakoutContext.fillRect(brick.x + 7, brick.y + 3, brick.width - 14, 3);
}

function drawBreakoutPaddle() {
    const { breakoutContext } = dom();
    const { paddle } = breakoutState;
    const hullGradient = breakoutContext.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    hullGradient.addColorStop(0, '#f59e0b');
    hullGradient.addColorStop(1, '#7c2d12');

    drawBreakoutRoundedRect(breakoutContext, paddle.x, paddle.y, paddle.width, paddle.height, 8);
    breakoutContext.fillStyle = hullGradient;
    breakoutContext.fill();

    breakoutContext.fillStyle = 'rgba(255, 248, 220, 0.9)';
    breakoutContext.fillRect(paddle.x + paddle.width * 0.48, paddle.y - 14, 3, 14);
    breakoutContext.beginPath();
    breakoutContext.moveTo(paddle.x + paddle.width * 0.5, paddle.y - 14);
    breakoutContext.lineTo(paddle.x + paddle.width * 0.7, paddle.y - 6);
    breakoutContext.lineTo(paddle.x + paddle.width * 0.5, paddle.y + 2);
    breakoutContext.closePath();
    breakoutContext.fill();
}

function drawBreakoutBall() {
    const { breakoutContext } = dom();
    const { ball } = breakoutState;
    const ballGradient = breakoutContext.createRadialGradient(ball.x - 2, ball.y - 2, 2, ball.x, ball.y, ball.radius + 2);
    ballGradient.addColorStop(0, '#fef3c7');
    ballGradient.addColorStop(0.42, '#facc15');
    ballGradient.addColorStop(1, '#b45309');

    breakoutContext.beginPath();
    breakoutContext.fillStyle = ballGradient;
    breakoutContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    breakoutContext.fill();
    breakoutContext.strokeStyle = 'rgba(120, 53, 15, 0.52)';
    breakoutContext.lineWidth = 1.2;
    breakoutContext.stroke();
}

export function drawBreakout() {
    const { breakoutContext, breakoutCanvas } = dom();
    if (!breakoutContext || !breakoutState) {
        return;
    }

    breakoutContext.clearRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);
    drawBreakoutBackdrop();

    breakoutState.bricks.forEach((brick) => {
        if (!brick.alive) {
            return;
        }
        drawBreakoutBrick(brick);
    });

    drawBreakoutPaddle();
    drawBreakoutBall();
}

export function getBreakoutRulesText() {
    return 'Déplace la raquette avec Q, D ou les flèches. La balle rebondit selon la zone touchée sur le bateau. Casse toutes les briques sans perdre tes trois vies.';
}

export function renderBreakoutMenu() {
    const { breakoutMenuOverlay, breakoutTable, breakoutMenuEyebrow, breakoutMenuTitle, breakoutMenuText, breakoutMenuActionButton, breakoutMenuRulesButton } = dom();
    if (!breakoutMenuOverlay || !breakoutTable) {
        return;
    }

    syncGameMenuOverlayBounds(breakoutMenuOverlay, breakoutTable);
    breakoutMenuOverlay.classList.toggle('hidden', !breakoutMenuVisible);
    breakoutMenuOverlay.classList.toggle('is-closing', breakoutMenuClosing);
    breakoutTable.classList.toggle('is-menu-open', breakoutMenuVisible);

    if (!breakoutMenuVisible) {
        return;
    }

    const hasResult = Boolean(breakoutMenuResult);

    if (breakoutMenuEyebrow) {
        breakoutMenuEyebrow.textContent = breakoutMenuShowingRules
            ? 'R\u00e8gles'
            : (hasResult ? breakoutMenuResult.eyebrow : 'Baie d arcade');
    }
    if (breakoutMenuTitle) {
        breakoutMenuTitle.textContent = breakoutMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult ? breakoutMenuResult.title : 'Break It');
    }
    if (breakoutMenuText) {
        breakoutMenuText.textContent = breakoutMenuShowingRules
            ? getBreakoutRulesText()
            : (hasResult
                ? breakoutMenuResult.text
                : "Prépare ta traversée avant d'envoyer la balle sur les briques.");
    }
    if (breakoutMenuActionButton) {
        breakoutMenuActionButton.textContent = breakoutMenuShowingRules
            ? 'Retour'
            : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
    }
    if (breakoutMenuRulesButton) {
        breakoutMenuRulesButton.textContent = 'R\u00e8gles';
        breakoutMenuRulesButton.hidden = breakoutMenuShowingRules;
    }
}

export function startBreakoutLaunchSequence() {
    breakoutMenuClosing = true;
    renderBreakoutMenu();
    window.setTimeout(() => {
        breakoutMenuClosing = false;
        breakoutMenuVisible = false;
        breakoutMenuShowingRules = false;
        breakoutMenuResult = null;
        if (breakoutState) {
            breakoutState.running = true;
        }
        if (!breakoutAnimationFrame) {
            breakoutAnimationFrame = window.requestAnimationFrame(updateBreakout);
        }
        renderBreakoutMenu();
        drawBreakout();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeBreakout() {
    const { breakoutCanvas, breakoutScoreDisplay, breakoutLivesDisplay, breakoutHelpText } = dom();
    const paddleWidth = 92;
    const paddleHeight = 11;
    closeGameOverModal();
    stopBreakout();
    breakoutState = {
        score: 0,
        lives: 3,
        running: false,
        paddle: {
            x: (breakoutCanvas.width - paddleWidth) / 2,
            y: breakoutCanvas.height - 34,
            width: paddleWidth,
            height: paddleHeight
        },
        ball: {
            x: breakoutCanvas.width / 2,
            y: breakoutCanvas.height * 0.62,
            vx: 0,
            vy: 0,
            radius: 7
        },
        bricks: createBreakoutBricks()
    };
    breakoutRemainingBricks = breakoutState.bricks.length;
    resetBreakoutBall();
    if (breakoutScoreDisplay) breakoutScoreDisplay.textContent = '0';
    if (breakoutLivesDisplay) breakoutLivesDisplay.textContent = '3';
    if (breakoutHelpText) breakoutHelpText.textContent = `Record actuel: ${breakoutBestScore}. Lance la balle quand tu veux.`;
    breakoutMenuVisible = true;
    breakoutMenuShowingRules = false;
    breakoutMenuClosing = false;
    breakoutMenuResult = null;
    renderBreakoutMenu();
    drawBreakout();
}

export function revealBreakoutOutcomeMenu(title, text, eyebrow) {
    breakoutMenuVisible = true;
    breakoutMenuShowingRules = false;
    breakoutMenuClosing = false;
    breakoutMenuResult = { title, text, eyebrow };
    renderBreakoutMenu();
}

export function stopBreakout() {
    if (breakoutAnimationFrame) {
        window.cancelAnimationFrame(breakoutAnimationFrame);
        breakoutAnimationFrame = null;
    }
    breakoutLastFrame = 0;
}

export function updateBreakout(timestamp) {
    const { breakoutCanvas, breakoutScoreDisplay, breakoutLivesDisplay, breakoutHelpText } = dom();
    if (!breakoutState) {
        return;
    }

    if (!breakoutLastFrame) {
        breakoutLastFrame = timestamp;
    }

    const delta = Math.min(0.032, (timestamp - breakoutLastFrame) / 1000);
    breakoutLastFrame = timestamp;

    if (breakoutState.running) {
        const speed = 360;
        if (breakoutKeys.has('arrowleft') || breakoutKeys.has('q')) {
            breakoutState.paddle.x -= speed * delta;
        }
        if (breakoutKeys.has('arrowright') || breakoutKeys.has('d')) {
            breakoutState.paddle.x += speed * delta;
        }
        breakoutState.paddle.x = Math.max(0, Math.min(breakoutCanvas.width - breakoutState.paddle.width, breakoutState.paddle.x));

        const maxDistance = Math.max(
            Math.abs(breakoutState.ball.vx),
            Math.abs(breakoutState.ball.vy)
        ) * delta;
        const stepCount = Math.max(1, Math.ceil(maxDistance / BREAKOUT_MAX_STEP_DISTANCE));
        const stepDelta = delta / stepCount;

        for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
            const previousX = breakoutState.ball.x;
            const previousY = breakoutState.ball.y;

            breakoutState.ball.x += breakoutState.ball.vx * stepDelta;
            breakoutState.ball.y += breakoutState.ball.vy * stepDelta;

            if (breakoutState.ball.x <= breakoutState.ball.radius) {
                breakoutState.ball.x = breakoutState.ball.radius;
                breakoutState.ball.vx = Math.abs(breakoutState.ball.vx);
            } else if (breakoutState.ball.x >= breakoutCanvas.width - breakoutState.ball.radius) {
                breakoutState.ball.x = breakoutCanvas.width - breakoutState.ball.radius;
                breakoutState.ball.vx = -Math.abs(breakoutState.ball.vx);
            }

            if (breakoutState.ball.y <= breakoutState.ball.radius) {
                breakoutState.ball.y = breakoutState.ball.radius;
                breakoutState.ball.vy = Math.abs(breakoutState.ball.vy);
            }

            if (breakoutState.ball.y + breakoutState.ball.radius >= breakoutState.paddle.y
                && breakoutState.ball.y - breakoutState.ball.radius <= breakoutState.paddle.y + breakoutState.paddle.height
                && breakoutState.ball.x + breakoutState.ball.radius >= breakoutState.paddle.x
                && breakoutState.ball.x - breakoutState.ball.radius <= breakoutState.paddle.x + breakoutState.paddle.width
                && breakoutState.ball.vy > 0) {
                breakoutState.ball.y = breakoutState.paddle.y - breakoutState.ball.radius;
                const normalizedOffset = Math.max(-1, Math.min(1, (
                    breakoutState.ball.x - (breakoutState.paddle.x + breakoutState.paddle.width / 2)
                ) / (breakoutState.paddle.width / 2)));
                const bounceAngle = normalizedOffset * (Math.PI / 3);
                setBreakoutBallVelocity(Math.sin(bounceAngle), -Math.cos(bounceAngle));
            }

            const collidedBrick = breakoutState.bricks.find((brick) => (
                brick.alive
                && breakoutState.ball.x + breakoutState.ball.radius > brick.x
                && breakoutState.ball.x - breakoutState.ball.radius < brick.x + brick.width
                && breakoutState.ball.y + breakoutState.ball.radius > brick.y
                && breakoutState.ball.y - breakoutState.ball.radius < brick.y + brick.height
            ));

            if (collidedBrick) {
                collidedBrick.alive = false;
                breakoutRemainingBricks = Math.max(0, breakoutRemainingBricks - 1);
                resolveBreakoutBrickCollision(collidedBrick, previousX, previousY);
                breakoutState.score += 25;
                if (breakoutScoreDisplay) breakoutScoreDisplay.textContent = String(breakoutState.score);
                if (breakoutState.score > breakoutBestScore) {
                    breakoutBestScore = breakoutState.score;
                    window.localStorage.setItem(BREAKOUT_BEST_KEY, String(breakoutBestScore));
                }
            }

            if (breakoutState.ball.y - breakoutState.ball.radius > breakoutCanvas.height) {
                breakoutState.lives -= 1;
                if (breakoutLivesDisplay) breakoutLivesDisplay.textContent = String(breakoutState.lives);
                breakoutState.running = false;
                resetBreakoutBall();
                if (breakoutHelpText) breakoutHelpText.textContent = breakoutState.lives > 0 ? 'Balle perdue. Clique relancer.' : `Partie termin\u00e9e. Score ${breakoutState.score}.`;
                if (breakoutState.lives <= 0) {
                    revealBreakoutOutcomeMenu(
                        'Partie termin\u00e9e',
                        `Score ${breakoutState.score}. Record ${breakoutBestScore}.`,
                        'Pont en cale seche'
                    );
                }
                stopBreakout();
                drawBreakout();
                break;
            }

            if (breakoutRemainingBricks === 0) {
                breakoutState.running = false;
                if (breakoutHelpText) breakoutHelpText.textContent = `Victoire ! Score ${breakoutState.score}.`;
                revealBreakoutOutcomeMenu(
                    'Victoire',
                    `Toutes les briques sont tombees. Score ${breakoutState.score}. Record ${breakoutBestScore}.`,
                    'Pont en liesse'
                );
                stopBreakout();
                drawBreakout();
                break;
            }
        }
    }

    drawBreakout();
    if (breakoutState.running) {
        breakoutAnimationFrame = window.requestAnimationFrame(updateBreakout);
    } else {
        breakoutAnimationFrame = null;
    }
}

export function getBreakoutKeys() { return breakoutKeys; }
export function getBreakoutState() { return breakoutState; }
export function getBreakoutMenuVisible() { return breakoutMenuVisible; }
export function setBreakoutMenuVisible(v) { breakoutMenuVisible = Boolean(v); }
export function setBreakoutMenuShowingRules(v) { breakoutMenuShowingRules = Boolean(v); }
export function getBreakoutMenuShowingRules() { return breakoutMenuShowingRules; }
export function getBreakoutMenuResult() { return breakoutMenuResult; }
export function setBreakoutMenuResult(v) { breakoutMenuResult = v; }
export function getBreakoutMenuClosing() { return breakoutMenuClosing; }

// Reprend la boucle d'animation après un Space — équivalent du vieux bloc
// dans script.js. Initialise si besoin et garantit qu'une seule RAF tourne.
export function resumeBreakoutLoop() {
    if (!breakoutState || breakoutState.lives <= 0) {
        initializeBreakout();
    }
    breakoutState.running = true;
    if (!breakoutAnimationFrame) {
        breakoutAnimationFrame = window.requestAnimationFrame(updateBreakout);
    }
}
