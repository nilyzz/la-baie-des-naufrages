// Game module — Flappy (Baiely Bird).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const FLAPPY_BEST_KEY = 'baie-des-naufrages-flappy-best';
export const FLAPPY_BIRD_WIDTH = 46;
export const FLAPPY_BIRD_HEIGHT = 36;
export const FLAPPY_PIPE_WIDTH = 86;
export const FLAPPY_BIRD_OFFSET_X = 0.24;
export const FLAPPY_BASE_SPAWN_INTERVAL = 1720;
export const FLAPPY_MIN_SPAWN_INTERVAL = 1240;
export const FLAPPY_BASE_PIPE_SPEED = 0.176;
export const FLAPPY_MAX_PIPE_SPEED = 0.244;

let flappyBirdY = 0;
let flappyBirdVelocity = 0;
let flappyPipes = [];
let flappyScore = 0;
let flappyBestScore = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(FLAPPY_BEST_KEY)) : 0) || 0;
let flappyRunning = false;
let flappyAnimationFrame = null;
let flappyLastFrame = 0;
let flappySpawnTimer = 0;
let flappyBackdropOffset = 0;
let flappySplashParticles = [];
let flappySplashTimeout = null;
let flappyMenuVisible = true;
let flappyMenuShowingRules = false;
let flappyMenuClosing = false;
let flappyMenuEntering = false;
let flappyMenuResultReason = '';

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        flappyBoard: $('flappyBoard'),
        flappyScoreDisplay: $('flappyScoreDisplay'),
        flappyBestDisplay: $('flappyBestDisplay'),
        flappyHelpText: $('flappyHelpText'),
        flappyTable: $('flappyTable'),
        flappyMenuOverlay: $('flappyMenuOverlay'),
        flappyMenuEyebrow: $('flappyMenuEyebrow'),
        flappyMenuTitle: $('flappyMenuTitle'),
        flappyMenuText: $('flappyMenuText'),
        flappyMenuActionButton: $('flappyMenuActionButton'),
        flappyMenuRulesButton: $('flappyMenuRulesButton')
    };
}

export function renderFlappy() {
    const { flappyBoard } = dom();
    if (!flappyBoard) return;
    const boardWidth = flappyBoard.clientWidth;
    const boardHeight = flappyBoard.clientHeight;
    const birdX = Math.max(42, boardWidth * FLAPPY_BIRD_OFFSET_X);
    const birdY = Math.max(0, Math.min(boardHeight - FLAPPY_BIRD_HEIGHT, flappyBirdY));
    const birdRotation = Math.max(-24, Math.min(68, flappyBirdVelocity * 4.4));
    const farOffset = -(flappyBackdropOffset * 0.18);
    const nearOffset = -(flappyBackdropOffset * 0.34);
    const beachOffset = -(flappyBackdropOffset * 0.52);
    const cloudAOffset = -(flappyBackdropOffset * 0.08);
    const cloudBOffset = -(flappyBackdropOffset * 0.12);

    flappyBoard.innerHTML = `
        <div class="flappy-cloud flappy-cloud-a" style="transform:translateX(${cloudAOffset}px);"></div>
        <div class="flappy-cloud flappy-cloud-b" style="transform:translateX(${cloudBOffset}px);"></div>
        <div class="flappy-backdrop flappy-backdrop-far" style="transform:translateX(${farOffset}px);"></div>
        <div class="flappy-backdrop flappy-backdrop-near" style="transform:translateX(${nearOffset}px);"></div>
        <div class="flappy-cove" style="transform:translateX(${nearOffset}px);"></div>
        <div class="flappy-rock-arch" style="transform:translateX(${nearOffset}px);"></div>
        <div class="flappy-beach" style="transform:translateX(${beachOffset}px);"></div>
        <div class="flappy-palm flappy-palm-left" style="transform:translateX(${beachOffset}px) scale(0.92);"></div>
        <div class="flappy-palm flappy-palm-right" style="transform:translateX(${beachOffset}px) scale(1.04);"></div>
        <div class="flappy-bird" style="left:${birdX}px; top:${birdY}px; transform:rotate(${birdRotation}deg);"></div>
        ${flappyPipes.map((pipe) => `
            <div class="flappy-pipe flappy-pipe-top" style="left:${pipe.x}px; top:0; height:${pipe.gapTop}px;"></div>
            <div class="flappy-pipe flappy-pipe-bottom" style="left:${pipe.x}px; bottom:0; height:${boardHeight - pipe.gapBottom}px;"></div>
        `).join('')}
        ${flappySplashParticles.map((particle) => `
            <span
                class="flappy-splash"
                style="left:${particle.x}px; top:${particle.y}px; width:${particle.size}px; height:${particle.size}px; --flappy-splash-dx:${particle.dx}px; --flappy-splash-dy:${particle.dy}px; --flappy-splash-delay:${particle.delay}ms;"
            ></span>
        `).join('')}
        <div class="flappy-ground"></div>
    `;
}

export function stopFlappy() {
    flappyRunning = false;
    if (flappyAnimationFrame) {
        window.cancelAnimationFrame(flappyAnimationFrame);
        flappyAnimationFrame = null;
    }
}

export function getFlappyRulesText() {
    return "Appuie sur espace, clique ou tapote pour battre des ailes. Traverse entre les arches sans toucher le ciel, les obstacles ou l'eau.";
}

export function renderFlappyMenu() {
    const { flappyMenuOverlay, flappyTable, flappyMenuEyebrow, flappyMenuTitle, flappyMenuText, flappyMenuActionButton, flappyMenuRulesButton } = dom();
    if (!flappyMenuOverlay || !flappyTable) return;

    syncGameMenuOverlayBounds(flappyMenuOverlay, flappyTable);
    flappyMenuOverlay.classList.toggle('hidden', !flappyMenuVisible);
    flappyMenuOverlay.classList.toggle('is-closing', flappyMenuClosing);
    flappyMenuOverlay.classList.toggle('is-entering', flappyMenuEntering);
    flappyTable.classList.toggle('is-menu-open', flappyMenuVisible);

    if (!flappyMenuVisible) return;

    const hasFlappyResult = Boolean(flappyMenuResultReason);

    if (flappyMenuEyebrow) flappyMenuEyebrow.textContent = flappyMenuShowingRules ? 'R\u00e8gles' : (hasFlappyResult ? 'Fin de vol' : "Baie d'arcade");
    if (flappyMenuTitle) {
        flappyMenuTitle.textContent = flappyMenuShowingRules
            ? 'Rappel rapide'
            : (flappyMenuResultReason === 'water'
                ? "Tu t'es noyé"
                : (flappyMenuResultReason === 'sky'
                    ? "C'est perdu"
                    : (flappyMenuResultReason === 'pipe'
                    ? "Tu t'es cogné contre une arche"
                    : (hasFlappyResult ? 'Partie perdue' : 'Baiely Bird'))));
    }
    if (flappyMenuText) {
        flappyMenuText.textContent = flappyMenuShowingRules
            ? getFlappyRulesText()
            : (flappyMenuResultReason === 'water'
                ? `Ton oiseau a fini dans l'eau. Score ${flappyScore}. Record ${flappyBestScore}.`
                : (flappyMenuResultReason === 'sky'
                    ? `Ton oiseau a perdu le contrôle en touchant le ciel. Score ${flappyScore}. Record ${flappyBestScore}.`
                    : (flappyMenuResultReason === 'pipe'
                    ? `Ton oiseau a touché une arche. Score ${flappyScore}. Record ${flappyBestScore}.`
                    : (hasFlappyResult
                        ? `Partie termin\u00e9e. Score ${flappyScore}. Record ${flappyBestScore}.`
                        : 'Prepare ton envol avant de battre des ailes entre les arches.'))));
    }
    if (flappyMenuActionButton) flappyMenuActionButton.textContent = flappyMenuShowingRules ? 'Retour' : (hasFlappyResult ? 'Relancer la partie' : 'Lancer la partie');
    if (flappyMenuRulesButton) { flappyMenuRulesButton.textContent = 'R\u00e8gles'; flappyMenuRulesButton.hidden = flappyMenuShowingRules; }
}

export function startFlappyLaunchSequence() {
    flappyMenuClosing = true;
    renderFlappyMenu();
    window.setTimeout(() => {
        flappyMenuClosing = false;
        flappyMenuVisible = false;
        flappyMenuShowingRules = false;
        flappyMenuEntering = false;
        flappyMenuResultReason = '';
        startFlappy(false);
        renderFlappyMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeFlappy() {
    stopFlappy();
    closeGameOverModal();
    if (flappySplashTimeout) {
        window.clearTimeout(flappySplashTimeout);
        flappySplashTimeout = null;
    }
    flappySplashParticles = [];
    const { flappyBoard, flappyHelpText, flappyScoreDisplay, flappyBestDisplay } = dom();
    flappyBirdY = Math.max(64, (flappyBoard?.clientHeight || 400) * 0.4);
    flappyBirdVelocity = 0;
    flappyPipes = [];
    flappyScore = 0;
    flappyBackdropOffset = 0;
    if (flappyHelpText) flappyHelpText.textContent = 'Espace, clic ou tap pour faire battre les ailes du perroquet pirate et passer entre les mats.';
    if (flappyScoreDisplay) flappyScoreDisplay.textContent = '0';
    if (flappyBestDisplay) flappyBestDisplay.textContent = String(flappyBestScore);
    flappyMenuVisible = true;
    flappyMenuShowingRules = false;
    flappyMenuClosing = false;
    flappyMenuEntering = false;
    flappyMenuResultReason = '';
    renderFlappyMenu();
    renderFlappy();
}

function createFlappySplash(boardWidth, boardHeight, impactY = null) {
    const waterTop = boardHeight * 0.86;
    const splashX = Math.max(42, boardWidth * FLAPPY_BIRD_OFFSET_X) + (FLAPPY_BIRD_WIDTH * 0.5);
    const surfaceImpactY = impactY ?? waterTop;
    const splashY = Math.max(waterTop - 10, Math.min(waterTop + 6, surfaceImpactY - 3));

    flappySplashParticles = Array.from({ length: 11 }, (_, index) => {
        const spread = index - 5;
        return {
            x: splashX + (spread * 6),
            y: splashY + Math.abs(spread % 2),
            dx: spread * 4.5,
            dy: -18 - (Math.abs(spread) * 2.4),
            size: 8 + ((index + 1) % 3) * 3,
            delay: index * 8
        };
    });

    if (flappySplashTimeout) window.clearTimeout(flappySplashTimeout);
    flappySplashTimeout = window.setTimeout(() => {
        flappySplashParticles = [];
        flappySplashTimeout = null;
        renderFlappy();
    }, 760);
}

function finishFlappy(reason = 'pipe', impactY = null) {
    stopFlappy();
    const { flappyBoard, flappyHelpText } = dom();
    if (reason === 'water' && flappyBoard) {
        createFlappySplash(flappyBoard.clientWidth, flappyBoard.clientHeight, impactY);
        renderFlappy();
    }
    if (flappyHelpText) flappyHelpText.textContent = `Crash. Score ${flappyScore}. Record ${flappyBestScore}.`;
    flappyMenuResultReason = ['water', 'pipe', 'sky'].includes(reason) ? reason : 'other';
    flappyMenuShowingRules = false;
    flappyMenuClosing = false;
    flappyMenuEntering = true;
    flappyMenuVisible = true;
    renderFlappyMenu();
    window.setTimeout(() => {
        flappyMenuEntering = false;
        renderFlappyMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function flapFlappyBird() {
    if (flappyMenuVisible || flappyMenuClosing) return;
    if (!flappyRunning) {
        startFlappy();
        return;
    }
    flappyBirdVelocity = -5.2;
}

export function startFlappy(shouldReset = true) {
    if (shouldReset) initializeFlappy();
    flappyRunning = true;
    flappyLastFrame = performance.now();
    flappySpawnTimer = 0;
    flappyBirdVelocity = -5.2;

    const step = (timestamp) => {
        if (!flappyRunning) return;

        const delta = Math.min(32, timestamp - flappyLastFrame);
        flappyLastFrame = timestamp;
        const { flappyBoard, flappyScoreDisplay, flappyBestDisplay } = dom();
        if (!flappyBoard) return;
        const boardWidth = flappyBoard.clientWidth;
        const boardHeight = flappyBoard.clientHeight;
        const groundTop = boardHeight * 0.86;
        const birdX = Math.max(42, boardWidth * FLAPPY_BIRD_OFFSET_X);

        flappyBirdVelocity += delta * 0.0125;
        flappyBirdY += flappyBirdVelocity * (delta / 16);
        flappySpawnTimer += delta;

        const spawnInterval = Math.max(FLAPPY_MIN_SPAWN_INTERVAL, FLAPPY_BASE_SPAWN_INTERVAL - (flappyScore * 20));

        if (flappySpawnTimer >= spawnInterval) {
            flappySpawnTimer = 0;
            const baseGapSize = Math.max(188, boardHeight * 0.385);
            const gapReduction = Math.min(78, flappyScore * 5.5);
            const gapSize = Math.max(118, baseGapSize - gapReduction);
            const minCenter = boardHeight * 0.24;
            const maxCenter = boardHeight * 0.62;
            const gapCenter = minCenter + (Math.random() * (maxCenter - minCenter));
            flappyPipes.push({
                x: boardWidth + 56,
                gapTop: Math.max(42, gapCenter - (gapSize / 2)),
                gapBottom: Math.min(groundTop - 36, gapCenter + (gapSize / 2)),
                scored: false
            });
        }

        flappyPipes = flappyPipes.filter((pipe) => pipe.x > -120);
        const pipeSpeed = Math.min(FLAPPY_MAX_PIPE_SPEED, FLAPPY_BASE_PIPE_SPEED + (flappyScore * 0.0024));
        flappyPipes.forEach((pipe) => {
            pipe.x -= delta * pipeSpeed;
            if (!pipe.scored && pipe.x + FLAPPY_PIPE_WIDTH < birdX) {
                pipe.scored = true;
                flappyScore += 1;
                if (flappyScoreDisplay) flappyScoreDisplay.textContent = String(flappyScore);
                if (flappyScore > flappyBestScore) {
                    flappyBestScore = flappyScore;
                    if (flappyBestDisplay) flappyBestDisplay.textContent = String(flappyBestScore);
                    if (typeof window !== 'undefined') window.localStorage.setItem(FLAPPY_BEST_KEY, String(flappyBestScore));
                }
            }
        });
        flappyBackdropOffset += delta * pipeSpeed;

        const hitboxInsetX = 10;
        const hitboxInsetTop = 7;
        const hitboxInsetBottom = 9;
        const pipeInsetX = 8;
        const birdTop = flappyBirdY + hitboxInsetTop;
        const birdBottom = flappyBirdY + FLAPPY_BIRD_HEIGHT - hitboxInsetBottom;
        const birdLeft = birdX + hitboxInsetX;
        const birdRight = birdX + FLAPPY_BIRD_WIDTH - hitboxInsetX;
        const hitPipe = flappyPipes.some((pipe) => (
            birdRight > pipe.x + pipeInsetX
            && birdLeft < pipe.x + FLAPPY_PIPE_WIDTH - pipeInsetX
            && (birdTop < pipe.gapTop || birdBottom > pipe.gapBottom)
        ));
        const hitSky = flappyBirdY <= 0;
        const hitWater = flappyBirdY + FLAPPY_BIRD_HEIGHT >= boardHeight;

        if (hitSky || hitWater || hitPipe) {
            renderFlappy();
            finishFlappy(hitWater ? 'water' : (hitSky ? 'sky' : 'pipe'), flappyBirdY + FLAPPY_BIRD_HEIGHT);
            return;
        }

        renderFlappy();
        flappyAnimationFrame = window.requestAnimationFrame(step);
    };

    flappyAnimationFrame = window.requestAnimationFrame(step);
}

export function setFlappyMenuVisible(v) { flappyMenuVisible = Boolean(v); }
export function setFlappyMenuShowingRules(v) { flappyMenuShowingRules = Boolean(v); }
export function getFlappyMenuVisible() { return flappyMenuVisible; }
export function getFlappyRunning() { return flappyRunning; }
export function getFlappyMenuShowingRules() { return flappyMenuShowingRules; }
export function getFlappyMenuClosing() { return flappyMenuClosing; }
