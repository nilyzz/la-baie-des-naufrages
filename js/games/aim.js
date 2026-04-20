// Game module — OursAim (Canon de bord).
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

let aimTargets = [];
let aimScore = 0;
let aimBestScore = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(AIM_BEST_KEY)) : 0) || 0;
let aimRoundSeconds = AIM_DEFAULT_ROUND_SECONDS;
let aimTimeRemaining = AIM_DEFAULT_ROUND_SECONDS;
let aimRoundRunning = false;
let aimRoundCompleted = false;
let aimTimerInterval = null;
let aimHitEffectKey = null;
let aimHitEffectTimeout = null;
let aimSpawnEffectKey = null;
let aimSpawnEffectTimeout = null;
let aimMenuVisible = true;
let aimMenuShowingRules = false;
let aimMenuClosing = false;
let aimMenuEntering = false;
let aimMenuResult = null;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        aimBoard: $('aimBoard'),
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

export function updateAimHud() {
    const { aimScoreDisplay, aimTimerDisplay, aimBestScoreDisplay, aimStartButton, aimDurationButtons } = dom();
    if (aimScoreDisplay) aimScoreDisplay.textContent = String(aimScore);
    if (aimTimerDisplay) aimTimerDisplay.textContent = String(aimTimeRemaining);
    if (aimBestScoreDisplay) aimBestScoreDisplay.textContent = String(aimBestScore);
    if (aimStartButton) aimStartButton.textContent = aimRoundRunning ? 'Bordée en cours' : 'Nouvelle bordée';
    aimDurationButtons.forEach((button) => {
        button.classList.toggle('is-active', Number(button.dataset.aimDuration) === aimRoundSeconds);
    });
}

function getAimFreeCells(excludedKey = null) {
    const occupied = new Set(
        aimTargets
            .filter((target) => `${target.row}-${target.col}` !== excludedKey)
            .map((target) => `${target.row}-${target.col}`)
    );
    const freeCells = [];
    for (let row = 0; row < AIM_GRID_SIZE; row += 1) {
        for (let col = 0; col < AIM_GRID_SIZE; col += 1) {
            const key = `${row}-${col}`;
            if (key !== excludedKey && !occupied.has(key)) {
                freeCells.push({ row, col });
            }
        }
    }
    return freeCells;
}

function pickRandomAimCell(excludedKey = null) {
    const freeCells = getAimFreeCells(excludedKey);
    if (!freeCells.length) return null;
    return freeCells[Math.floor(Math.random() * freeCells.length)];
}

export function createAimTargets() {
    aimTargets = [];
    while (aimTargets.length < AIM_TARGET_COUNT) {
        const nextCell = pickRandomAimCell();
        if (!nextCell) break;
        aimTargets.push({
            id: crypto.randomUUID(),
            row: nextCell.row,
            col: nextCell.col
        });
    }
}

export function renderAimBoard() {
    const { aimBoard } = dom();
    if (!aimBoard) return;
    aimBoard.innerHTML = Array.from({ length: AIM_GRID_SIZE * AIM_GRID_SIZE }, (_, index) => {
        const row = Math.floor(index / AIM_GRID_SIZE);
        const col = index % AIM_GRID_SIZE;
        const target = aimTargets.find((item) => item.row === row && item.col === col);
        const effectKey = `${row}-${col}`;
        const hitEffect = aimHitEffectKey === effectKey;
        const spawnEffect = aimSpawnEffectKey === effectKey;
        const shouldRenderTarget = Boolean(target) || hitEffect;
        const targetClasses = [
            'aim-target',
            spawnEffect ? 'is-spawning' : '',
            hitEffect && !target ? 'is-dispersing' : ''
        ].filter(Boolean).join(' ');

        return `
            <button
                type="button"
                class="aim-cell${target ? ' aim-cell-has-target' : ''}${hitEffect ? ' is-hit-effect' : ''}"
                data-row="${row}"
                data-col="${col}"
                ${target ? `data-target-id="${target.id}"` : ''}
                aria-label="${target ? 'Oursin à toucher' : "Case d'eau"}"
            >
                ${shouldRenderTarget ? `<span class="${targetClasses}" aria-hidden="true"></span>` : ''}
                ${hitEffect ? `
                    <span class="aim-hit-particle aim-hit-particle-a" aria-hidden="true"></span>
                    <span class="aim-hit-particle aim-hit-particle-b" aria-hidden="true"></span>
                    <span class="aim-hit-particle aim-hit-particle-c" aria-hidden="true"></span>
                    <span class="aim-hit-particle aim-hit-particle-d" aria-hidden="true"></span>
                    <span class="aim-hit-particle aim-hit-particle-e" aria-hidden="true"></span>
                ` : ''}
            </button>
        `;
    }).join('');
}

export function stopAimRound() {
    if (aimTimerInterval) {
        window.clearInterval(aimTimerInterval);
        aimTimerInterval = null;
    }
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
        'Bordée terminée',
        `Tu as inscrit ${aimScore} touches avant la fin de la marée. Record : ${aimBestScore}.`,
        'Canon calé'
    );
}

export function startAimRound() {
    closeGameOverModal();
    aimRoundRunning = true;
    updateAimHud();

    aimTimerInterval = window.setInterval(() => {
        aimTimeRemaining -= 1;
        updateAimHud();
        if (aimTimeRemaining <= 0) {
            finishAimRound();
        }
    }, 1000);
}

export function handleAimTargetHit(targetId) {
    if (aimRoundCompleted || aimTimeRemaining <= 0) return;
    if (!aimRoundRunning) startAimRound();

    const target = aimTargets.find((item) => item.id === targetId);
    if (!target) return;

    aimScore += AIM_HIT_SCORE;
    aimHitEffectKey = `${target.row}-${target.col}`;
    const nextCell = pickRandomAimCell(`${target.row}-${target.col}`);
    if (nextCell) {
        target.row = nextCell.row;
        target.col = nextCell.col;
        aimSpawnEffectKey = `${target.row}-${target.col}`;
    }

    updateAimHud();
    renderAimBoard();
    if (aimHitEffectTimeout) window.clearTimeout(aimHitEffectTimeout);
    aimHitEffectTimeout = window.setTimeout(() => {
        aimHitEffectKey = null;
        renderAimBoard();
    }, 320);
    if (aimSpawnEffectTimeout) window.clearTimeout(aimSpawnEffectTimeout);
    aimSpawnEffectTimeout = window.setTimeout(() => {
        aimSpawnEffectKey = null;
        if (!aimHitEffectKey) renderAimBoard();
    }, 280);
    const { aimBoard } = dom();
    if (aimBoard) {
        aimBoard.classList.remove('is-splashing');
        void aimBoard.offsetWidth;
        aimBoard.classList.add('is-splashing');
    }
}

export function handleAimMiss() {
    if (!aimRoundRunning || aimRoundCompleted || aimTimeRemaining <= 0) return;
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
    return 'Clique chaque oursin qui appara\u00eet dans la baie avant qu\u2019il ne disparaisse. Un tir sur l\u2019eau t\u2019enl\u00e8ve des points. Choisis la dur\u00e9e de la bord\u00e9e (20 / 40 / 60 s) et marque le plus de touches avant la fin.';
}

export function renderAimMenu() {
    const { aimMenuOverlay, aimTable, aimMenuEyebrow, aimMenuTitle, aimMenuText, aimMenuActionButton, aimMenuRulesButton } = dom();
    if (!aimMenuOverlay || !aimTable) return;
    syncGameMenuOverlayBounds(aimMenuOverlay, aimTable);
    aimMenuOverlay.classList.toggle('hidden', !aimMenuVisible);
    aimMenuOverlay.classList.toggle('is-closing', aimMenuClosing);
    aimMenuOverlay.classList.toggle('is-entering', aimMenuEntering);
    aimTable.classList.toggle('is-menu-open', aimMenuVisible);
    if (!aimMenuVisible) return;
    const hasResult = Boolean(aimMenuResult);
    if (aimMenuEyebrow) aimMenuEyebrow.textContent = aimMenuShowingRules ? 'R\u00e8gles' : (hasResult ? aimMenuResult.eyebrow : 'Canon de bord');
    if (aimMenuTitle) aimMenuTitle.textContent = aimMenuShowingRules ? 'Rappel rapide' : (hasResult ? aimMenuResult.title : 'OursAim');
    if (aimMenuText) aimMenuText.textContent = aimMenuShowingRules ? getAimRulesText() : (hasResult ? aimMenuResult.text : 'Cinq oursins se cachent dans la baie. Touche-les au plus vite pour marquer, mais un tir dans l\u2019eau te co\u00fbte des points.');
    if (aimMenuActionButton) aimMenuActionButton.textContent = aimMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la bord\u00e9e' : 'Lancer la bord\u00e9e');
    if (aimMenuRulesButton) { aimMenuRulesButton.textContent = 'R\u00e8gles'; aimMenuRulesButton.hidden = aimMenuShowingRules; }
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
    aimHitEffectKey = null;
    aimSpawnEffectKey = null;
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
