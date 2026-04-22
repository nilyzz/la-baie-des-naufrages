// Game module â€” OursAim (Canon de bord).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const AIM_GRID_SIZE = 6;
export const AIM_TARGET_COUNT = 5;
export const AIM_DEFAULT_ROUND_SECONDS = 20;
export const AIM_HIT_SCORE = 12;
export const AIM_MISS_SCORE = 5;
export const AIM_BEST_KEY = 'baie-des-naufrages-aim-best';
export const AIM_TARGET_SIZE_RATIO = 0.18;
export const AIM_TARGET_MIN_DISTANCE = 0.19;

let aimTargets = [];
let aimScore = 0;
let aimBestScore = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(AIM_BEST_KEY)) : 0) || 0;
let aimRoundSeconds = AIM_DEFAULT_ROUND_SECONDS;
let aimTimeRemaining = AIM_DEFAULT_ROUND_SECONDS;
let aimRoundRunning = false;
let aimRoundCompleted = false;
let aimTimerInterval = null;
let aimHitEffectPosition = null;
let aimHitEffectTimeout = null;
let aimSpawnEffectPosition = null;
let aimSpawnEffectTimeout = null;
let aimCountdownTimer = null;
let aimCountdownCompleteTimer = null;
let aimCountdownActive = false;
let aimMenuVisible = true;
let aimMenuShowingRules = false;
let aimMenuClosing = false;
let aimMenuEntering = false;
let aimMenuResult = null;
let aimLayoutFrame = null;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        aimGame: $('aimGame'),
        aimBoard: $('aimBoard'),
        aimCountdown: $('aimCountdown'),
        aimScoreDisplay: $('aimScoreDisplay'),
        aimTimerDisplay: $('aimTimerDisplay'),
        aimBestScoreDisplay: $('aimBestScoreDisplay'),
        aimStartButton: $('aimStartButton'),
        aimTable: $('aimTable'),
        aimMenuOverlay: $('aimMenuOverlay'),
        aimMenuEyebrow: $('aimMenuEyebrow'),
        aimMenuTitle: $('aimMenuTitle'),
        aimMenuText: $('aimMenuText'),
        aimMenuActionButton: $('aimMenuActionButton'),
        aimMenuRulesButton: $('aimMenuRulesButton'),
        aimDurationButtons: document.querySelectorAll('[data-aim-duration]')
    };
}

function getAimStyleValue(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function syncAimLayout({ rerenderBoard = true } = {}) {
    const { aimGame, aimBoard, aimMenuOverlay, aimTable } = dom();
    const aimTopbar = aimGame?.querySelector('.aim-topbar');
    const aimDurationSwitch = aimGame?.querySelector('.aim-duration-switch');
    const aimHelp = aimGame?.querySelector('.aim-help');
    if (!aimGame || !aimBoard || !aimTable) return;

    if (!aimGame.classList.contains('games-panel-active') || aimGame.clientHeight <= 0) {
        aimTable.style.removeProperty('height');
        if (aimMenuOverlay) {
            syncGameMenuOverlayBounds(aimMenuOverlay, aimTable);
        }
        return;
    }

    const cardStyles = window.getComputedStyle(aimGame);
    const topbarStyles = aimTopbar ? window.getComputedStyle(aimTopbar) : null;
    const durationStyles = aimDurationSwitch ? window.getComputedStyle(aimDurationSwitch) : null;
    const helpStyles = aimHelp ? window.getComputedStyle(aimHelp) : null;
    const availableHeight = aimGame.clientHeight
        - getAimStyleValue(cardStyles.paddingTop)
        - getAimStyleValue(cardStyles.paddingBottom)
        - (aimTopbar ? aimTopbar.offsetHeight + getAimStyleValue(topbarStyles?.marginBottom) : 0)
        - (aimDurationSwitch ? aimDurationSwitch.offsetHeight + getAimStyleValue(durationStyles?.marginBottom) : 0)
        - (aimHelp ? aimHelp.offsetHeight + getAimStyleValue(helpStyles?.marginBottom) : 0)
        - 8;

    if (availableHeight > 0) {
        aimTable.style.height = `${availableHeight}px`;
    } else {
        aimTable.style.removeProperty('height');
    }

    if (rerenderBoard && aimBoard.clientWidth > 0 && aimBoard.clientHeight > 0) {
        renderAimBoard();
    }

    if (aimMenuOverlay) {
        syncGameMenuOverlayBounds(aimMenuOverlay, aimTable);
    }
}

function scheduleAimLayoutSync(options) {
    if (aimLayoutFrame !== null) {
        window.cancelAnimationFrame(aimLayoutFrame);
    }

    aimLayoutFrame = window.requestAnimationFrame(() => {
        aimLayoutFrame = null;
        syncAimLayout(options);
    });
}

function clearAimCountdownTimers() {
    if (aimCountdownTimer) {
        window.clearTimeout(aimCountdownTimer);
        aimCountdownTimer = null;
    }
    if (aimCountdownCompleteTimer) {
        window.clearTimeout(aimCountdownCompleteTimer);
        aimCountdownCompleteTimer = null;
    }
}

function getAimBoardMetrics(aimBoard) {
    const boardWidth = Math.max(0, aimBoard?.clientWidth || 0);
    const boardHeight = Math.max(0, aimBoard?.clientHeight || boardWidth);
    const targetSize = Math.max(58, Math.min(96, Math.round(Math.min(boardWidth, boardHeight) * AIM_TARGET_SIZE_RATIO)));
    return {
        boardWidth,
        boardHeight,
        targetSize,
        maxLeft: Math.max(0, boardWidth - targetSize),
        maxTop: Math.max(0, boardHeight - targetSize)
    };
}

function getAimPositionDistance(left, right) {
    if (!left || !right) {
        return Infinity;
    }

    const leftCenterX = left.x + (left.sizeRatio / 2);
    const leftCenterY = left.y + (left.sizeRatio / 2);
    const rightCenterX = right.x + (right.sizeRatio / 2);
    const rightCenterY = right.y + (right.sizeRatio / 2);
    return Math.hypot(leftCenterX - rightCenterX, leftCenterY - rightCenterY);
}

function pickRandomAimPosition(excludedId = null) {
    const sizeRatio = AIM_TARGET_SIZE_RATIO;
    const maxCoordinate = Math.max(0, 1 - sizeRatio);
    const occupiedTargets = aimTargets.filter((target) => target.id !== excludedId);
    let fallbackPosition = null;

    for (let attempt = 0; attempt < 80; attempt += 1) {
        const nextPosition = {
            x: Math.random() * maxCoordinate,
            y: Math.random() * maxCoordinate,
            sizeRatio
        };

        if (!fallbackPosition) {
            fallbackPosition = nextPosition;
        }

        const isFarEnough = occupiedTargets.every((target) => getAimPositionDistance(nextPosition, target) >= AIM_TARGET_MIN_DISTANCE);
        if (isFarEnough) {
            return nextPosition;
        }
    }

    return fallbackPosition;
}

export function updateAimHud() {
    const { aimScoreDisplay, aimTimerDisplay, aimBestScoreDisplay, aimStartButton, aimDurationButtons } = dom();
    if (aimScoreDisplay) aimScoreDisplay.textContent = String(aimScore);
    if (aimTimerDisplay) aimTimerDisplay.textContent = String(aimTimeRemaining);
    if (aimBestScoreDisplay) aimBestScoreDisplay.textContent = String(aimBestScore);
    if (aimStartButton) {
        aimStartButton.textContent = aimRoundRunning
            ? 'Bordee en cours'
            : (aimCountdownActive ? 'A l abordage...' : 'Nouvelle bordee');
    }
    aimDurationButtons.forEach((button) => {
        button.classList.toggle('is-active', Number(button.dataset.aimDuration) === aimRoundSeconds);
    });
}

export function createAimTargets() {
    aimTargets = [];
    while (aimTargets.length < AIM_TARGET_COUNT) {
        const nextPosition = pickRandomAimPosition();
        if (!nextPosition) break;
        aimTargets.push({
            id: crypto.randomUUID(),
            x: nextPosition.x,
            y: nextPosition.y,
            sizeRatio: nextPosition.sizeRatio
        });
    }
}

export function renderAimBoard() {
    const { aimBoard } = dom();
    if (!aimBoard) return;

    const { maxLeft, maxTop, targetSize } = getAimBoardMetrics(aimBoard);
    const renderTargetInner = (className) => `<span class="${className}" aria-hidden="true"></span>`;
    const renderHitParticles = () => `
        <span class="aim-hit-particle aim-hit-particle-a" aria-hidden="true"></span>
        <span class="aim-hit-particle aim-hit-particle-b" aria-hidden="true"></span>
        <span class="aim-hit-particle aim-hit-particle-c" aria-hidden="true"></span>
        <span class="aim-hit-particle aim-hit-particle-d" aria-hidden="true"></span>
        <span class="aim-hit-particle aim-hit-particle-e" aria-hidden="true"></span>
    `;
    const renderTargetButton = (target, extraTargetClass = '') => {
        const left = Math.round(target.x * maxLeft);
        const top = Math.round(target.y * maxTop);
        const targetClasses = ['aim-target', extraTargetClass].filter(Boolean).join(' ');
        return `
            <button
                type="button"
                class="aim-target-shell"
                data-target-id="${target.id}"
                style="left:${left}px;top:${top}px;width:${targetSize}px;height:${targetSize}px;"
                aria-label="Oursin a toucher"
            >
                ${renderTargetInner(targetClasses)}
            </button>
        `;
    };
    const renderEffect = (position, targetClassName, withParticles = false) => {
        if (!position) {
            return '';
        }

        const left = Math.round(position.x * maxLeft);
        const top = Math.round(position.y * maxTop);
        return `
            <span class="aim-target-shell is-effect" style="left:${left}px;top:${top}px;width:${targetSize}px;height:${targetSize}px;" aria-hidden="true">
                ${renderTargetInner(targetClassName)}
                ${withParticles ? renderHitParticles() : ''}
            </span>
        `;
    };

    aimBoard.innerHTML = [
        ...aimTargets.map((target) => renderTargetButton(target, aimSpawnEffectPosition?.id === target.id ? 'is-spawning' : '')),
        renderEffect(aimHitEffectPosition, 'aim-target is-dispersing', Boolean(aimHitEffectPosition))
    ].join('');
}

export function hideAimCountdown() {
    const { aimCountdown } = dom();
    if (!aimCountdown) {
        return;
    }

    aimCountdown.textContent = '';
    aimCountdown.classList.add('hidden');
    aimCountdown.setAttribute('aria-hidden', 'true');
}

export function showAimCountdown(label) {
    const { aimCountdown } = dom();
    if (!aimCountdown) {
        return;
    }

    aimCountdown.textContent = label;
    aimCountdown.classList.remove('hidden');
    aimCountdown.setAttribute('aria-hidden', 'false');
}

export function startAimCountdown(onComplete) {
    clearAimCountdownTimers();
    hideAimCountdown();
    aimCountdownActive = true;
    updateAimHud();

    const steps = ['3', '2', '1', 'GO'];
    let stepIndex = 0;

    const runStep = () => {
        const currentLabel = steps[stepIndex];

        if (currentLabel === undefined) {
            aimCountdownCompleteTimer = window.setTimeout(() => {
                hideAimCountdown();
                onComplete?.();
            }, 260);
            return;
        }

        showAimCountdown(currentLabel);
        stepIndex += 1;
        aimCountdownTimer = window.setTimeout(runStep, 620);
    };

    runStep();
}

export function stopAimRound() {
    if (aimTimerInterval) {
        window.clearInterval(aimTimerInterval);
        aimTimerInterval = null;
    }
    clearAimCountdownTimers();
    hideAimCountdown();
    aimCountdownActive = false;
    aimRoundRunning = false;
    updateAimHud();
}

export function finishAimRound() {
    stopAimRound();
    aimRoundCompleted = true;

    if (aimScore > aimBestScore) {
        aimBestScore = aimScore;
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(AIM_BEST_KEY, String(aimBestScore));
        }
    }

    updateAimHud();
    revealAimOutcomeMenu(
        'Bordee terminee',
        `Tu as inscrit ${aimScore} touches avant la fin de la maree. Record : ${aimBestScore}.`,
        'Canon cale'
    );
}

export function startAimRound() {
    closeGameOverModal();
    if (aimRoundCompleted || aimTimeRemaining <= 0 || aimRoundRunning || aimCountdownActive) {
        return;
    }

    startAimCountdown(() => {
        aimCountdownActive = false;
        aimRoundRunning = true;
        updateAimHud();

        aimTimerInterval = window.setInterval(() => {
            aimTimeRemaining -= 1;
            updateAimHud();
            if (aimTimeRemaining <= 0) {
                finishAimRound();
            }
        }, 1000);
    });
}

export function handleAimTargetHit(targetId) {
    if (aimRoundCompleted || aimTimeRemaining <= 0 || !aimRoundRunning || aimCountdownActive) return;

    const target = aimTargets.find((item) => item.id === targetId);
    if (!target) return;

    aimScore += AIM_HIT_SCORE;
    aimHitEffectPosition = {
        x: target.x,
        y: target.y,
        sizeRatio: target.sizeRatio
    };

    const nextPosition = pickRandomAimPosition(target.id);
    if (nextPosition) {
        target.x = nextPosition.x;
        target.y = nextPosition.y;
        target.sizeRatio = nextPosition.sizeRatio;
        aimSpawnEffectPosition = {
            id: target.id,
            x: target.x,
            y: target.y,
            sizeRatio: target.sizeRatio
        };
    }

    updateAimHud();
    renderAimBoard();
    if (aimHitEffectTimeout) window.clearTimeout(aimHitEffectTimeout);
    aimHitEffectTimeout = window.setTimeout(() => {
        aimHitEffectPosition = null;
        renderAimBoard();
    }, 320);
    if (aimSpawnEffectTimeout) window.clearTimeout(aimSpawnEffectTimeout);
    aimSpawnEffectTimeout = window.setTimeout(() => {
        aimSpawnEffectPosition = null;
        if (!aimHitEffectPosition) renderAimBoard();
    }, 280);
    const { aimBoard } = dom();
    if (aimBoard) {
        aimBoard.classList.remove('is-splashing');
        void aimBoard.offsetWidth;
        aimBoard.classList.add('is-splashing');
    }
}

export function handleAimMiss() {
    if (!aimRoundRunning || aimRoundCompleted || aimTimeRemaining <= 0 || aimCountdownActive) return;
    aimScore = Math.max(0, aimScore - AIM_MISS_SCORE);
    updateAimHud();
    const { aimBoard } = dom();
    if (aimBoard) {
        aimBoard.classList.remove('is-rumbling');
        void aimBoard.offsetWidth;
        aimBoard.classList.add('is-rumbling');
    }
}

export function getAimRulesText() {
    return 'Clique chaque oursin qui apparait dans la baie avant qu il ne disparaisse. Un tir sur l eau t enleve des points. Choisis la duree de la bordee (20 / 40 / 60 s) et marque le plus de touches avant la fin.';
}

export function renderAimMenu() {
    const { aimMenuOverlay, aimTable, aimMenuEyebrow, aimMenuTitle, aimMenuText, aimMenuActionButton, aimMenuRulesButton } = dom();
    if (!aimMenuOverlay || !aimTable) return;
    syncAimLayout({ rerenderBoard: false });
    aimMenuOverlay.classList.toggle('hidden', !aimMenuVisible);
    aimMenuOverlay.classList.toggle('is-closing', aimMenuClosing);
    aimMenuOverlay.classList.toggle('is-entering', aimMenuEntering);
    aimTable.classList.toggle('is-menu-open', aimMenuVisible);
    if (!aimMenuVisible) return;
    const hasResult = Boolean(aimMenuResult);
    if (aimMenuEyebrow) aimMenuEyebrow.textContent = aimMenuShowingRules ? 'Regles' : (hasResult ? aimMenuResult.eyebrow : 'Canon de bord');
    if (aimMenuTitle) aimMenuTitle.textContent = aimMenuShowingRules ? 'Rappel rapide' : (hasResult ? aimMenuResult.title : 'OursAim');
    if (aimMenuText) aimMenuText.textContent = aimMenuShowingRules ? getAimRulesText() : (hasResult ? aimMenuResult.text : 'Cinq oursins se cachent dans la baie. Touche-les au plus vite pour marquer, mais un tir dans l eau te coute des points.');
    if (aimMenuActionButton) aimMenuActionButton.textContent = aimMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la bordee' : 'Lancer la bordee');
    if (aimMenuRulesButton) { aimMenuRulesButton.textContent = 'Regles'; aimMenuRulesButton.hidden = aimMenuShowingRules; }
}

export function closeAimMenu() {
    aimMenuClosing = true;
    renderAimMenu();
    window.setTimeout(() => {
        aimMenuClosing = false;
        aimMenuVisible = false;
        aimMenuShowingRules = false;
        aimMenuEntering = false;
        aimMenuResult = null;
        renderAimMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealAimOutcomeMenu(title, text, eyebrow) {
    aimMenuVisible = true;
    aimMenuResult = { title, text, eyebrow };
    aimMenuShowingRules = false;
    aimMenuClosing = false;
    aimMenuEntering = true;
    renderAimMenu();
    window.setTimeout(() => { aimMenuEntering = false; renderAimMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeAim() {
    stopAimRound();
    if (aimHitEffectTimeout) { window.clearTimeout(aimHitEffectTimeout); aimHitEffectTimeout = null; }
    if (aimSpawnEffectTimeout) { window.clearTimeout(aimSpawnEffectTimeout); aimSpawnEffectTimeout = null; }
    aimHitEffectPosition = null;
    aimSpawnEffectPosition = null;
    aimScore = 0;
    aimTimeRemaining = aimRoundSeconds;
    aimRoundCompleted = false;
    aimMenuResult = null;
    aimMenuShowingRules = false;
    aimMenuClosing = false;
    aimMenuEntering = false;
    const { aimBoard } = dom();
    aimBoard?.classList.remove('is-rumbling', 'is-splashing');
    createAimTargets();
    updateAimHud();
    renderAimBoard();
    renderAimMenu();
    scheduleAimLayoutSync();
}

export function setAimRoundDuration(seconds) {
    if (![20, 40, 60].includes(seconds) || aimRoundSeconds === seconds) return;
    aimRoundSeconds = seconds;
    initializeAim();
}

export function setAimMenuVisible(v) { aimMenuVisible = Boolean(v); }
export function setAimMenuShowingRules(v) { aimMenuShowingRules = Boolean(v); }
export function getAimMenuVisible() { return aimMenuVisible; }
export function getAimMenuClosing() { return aimMenuClosing; }
export function getAimMenuShowingRules() { return aimMenuShowingRules; }

window.addEventListener('resize', scheduleAimLayoutSync);
