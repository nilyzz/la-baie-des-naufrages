// Game module — Rythme (Cadence des marins).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const RHYTHM_LANES = ['Q', 'S', 'D'];
export const RHYTHM_DURATION_MS = 30000;
export const RHYTHM_MAX_MISSES = 10;
export const RHYTHM_BEST_KEY = 'baie-des-naufrages-rhythm-best';
export const RHYTHM_NOTE_START_Y = 14;
export const RHYTHM_HIT_Y = 348;
export const RHYTHM_MISS_Y = 410;
export const RHYTHM_BURST_Y = 324;

let rhythmMenuVisible = true;
let rhythmMenuShowingRules = false;
let rhythmMenuClosing = false;
let rhythmMenuEntering = false;
let rhythmMenuResult = null;
let rhythmNotes = [];
let rhythmScore = 0;
let rhythmStreak = 0;
let rhythmMisses = 0;
let rhythmBestScore = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(RHYTHM_BEST_KEY)) : 0) || 0;
let rhythmRunning = false;
let rhythmStartedAt = 0;
let rhythmLastFrame = 0;
let rhythmSpawnTimer = 0;
let rhythmAnimationFrame = null;
let rhythmPadHighlightTimeout = null;
let rhythmBoardEffectTimeout = null;
let rhythmBursts = [];

let activeGameTabAccessor = () => null;
export function setRhythmActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        rhythmBoard: $('rhythmBoard'),
        rhythmTable: $('rhythmTable'),
        rhythmScoreDisplay: $('rhythmScoreDisplay'),
        rhythmStreakDisplay: $('rhythmStreakDisplay'),
        rhythmMissesDisplay: $('rhythmMissesDisplay'),
        rhythmTimerDisplay: $('rhythmTimerDisplay'),
        rhythmHelpText: $('rhythmHelpText'),
        rhythmStartButton: $('rhythmStartButton'),
        rhythmMenuOverlay: $('rhythmMenuOverlay'),
        rhythmMenuEyebrow: $('rhythmMenuEyebrow'),
        rhythmMenuTitle: $('rhythmMenuTitle'),
        rhythmMenuText: $('rhythmMenuText'),
        rhythmMenuActionButton: $('rhythmMenuActionButton'),
        rhythmMenuRulesButton: $('rhythmMenuRulesButton')
    };
}

export function updateRhythmHud(timeRemainingMs = RHYTHM_DURATION_MS) {
    const { rhythmScoreDisplay, rhythmStreakDisplay, rhythmMissesDisplay, rhythmTimerDisplay } = dom();
    rhythmScoreDisplay.textContent = String(rhythmScore);
    rhythmStreakDisplay.textContent = String(rhythmStreak);
    rhythmMissesDisplay.textContent = `${rhythmMisses} / ${RHYTHM_MAX_MISSES}`;
    rhythmTimerDisplay.textContent = String(Math.max(0, Math.ceil(timeRemainingMs / 1000)));
}

export function renderRhythmBoard() {
    const { rhythmBoard } = dom();
    rhythmBoard.innerHTML = `
        <div class="rhythm-sky-glow"></div>
        <div class="rhythm-moon"></div>
        <div class="rhythm-island rhythm-island-left"></div>
        <div class="rhythm-island rhythm-island-right"></div>
        <div class="rhythm-sea"></div>
        <div class="rhythm-lanes" style="grid-template-columns: repeat(${RHYTHM_LANES.length}, minmax(0, 1fr));">${RHYTHM_LANES.map(() => '<div class="rhythm-lane"></div>').join('')}</div>
        <div class="rhythm-target-band" aria-hidden="true"></div>
        <div class="rhythm-notes"></div>
        <div class="rhythm-feedback"></div>
        <div class="rhythm-pads" style="grid-template-columns: repeat(${RHYTHM_LANES.length}, minmax(0, 1fr));">${RHYTHM_LANES.map((key, index) => `<button type="button" class="rhythm-pad" data-rhythm-lane="${index}">${key}</button>`).join('')}</div>
    `;
}

export function stopRhythm() {
    rhythmRunning = false;
    if (rhythmAnimationFrame) {
        window.cancelAnimationFrame(rhythmAnimationFrame);
        rhythmAnimationFrame = null;
    }
    if (rhythmPadHighlightTimeout) {
        window.clearTimeout(rhythmPadHighlightTimeout);
        rhythmPadHighlightTimeout = null;
    }
}

export function getRhythmRulesText() {
    return `Appuie sur ${RHYTHM_LANES.join(', ')} au bon moment quand la note croise la ligne d\u2019impact. Encha\u00eene les touches parfaites pour faire monter la s\u00e9rie. Au-del\u00e0 de 10 fautes, la cadence s\u2019arr\u00eate.`;
}

export function renderRhythmMenu() {
    const { rhythmMenuOverlay, rhythmTable, rhythmMenuEyebrow, rhythmMenuTitle, rhythmMenuText, rhythmMenuActionButton, rhythmMenuRulesButton } = dom();
    if (!rhythmMenuOverlay || !rhythmTable) return;
    syncGameMenuOverlayBounds(rhythmMenuOverlay, rhythmTable);
    rhythmMenuOverlay.classList.toggle('hidden', !rhythmMenuVisible);
    rhythmMenuOverlay.classList.toggle('is-closing', rhythmMenuClosing);
    rhythmMenuOverlay.classList.toggle('is-entering', rhythmMenuEntering);
    rhythmTable.classList.toggle('is-menu-open', rhythmMenuVisible);
    if (!rhythmMenuVisible) return;
    const hasResult = Boolean(rhythmMenuResult);
    if (rhythmMenuEyebrow) rhythmMenuEyebrow.textContent = rhythmMenuShowingRules ? 'R\u00e8gles' : (hasResult ? rhythmMenuResult.eyebrow : 'Cadence des marins');
    if (rhythmMenuTitle) rhythmMenuTitle.textContent = rhythmMenuShowingRules ? 'Rappel rapide' : (hasResult ? rhythmMenuResult.title : 'Rythme');
    if (rhythmMenuText) rhythmMenuText.textContent = rhythmMenuShowingRules ? getRhythmRulesText() : (hasResult ? rhythmMenuResult.text : 'Garde le tempo avec Q, S et D pour accompagner la chanson des marins. Trop de fautes et la cadence s\u2019arr\u00eate.');
    if (rhythmMenuActionButton) rhythmMenuActionButton.textContent = rhythmMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la cadence' : 'Lancer la cadence');
    if (rhythmMenuRulesButton) { rhythmMenuRulesButton.textContent = 'R\u00e8gles'; rhythmMenuRulesButton.hidden = rhythmMenuShowingRules; }
}

export function closeRhythmMenu() {
    rhythmMenuClosing = true;
    renderRhythmMenu();
    window.setTimeout(() => {
        rhythmMenuClosing = false;
        rhythmMenuVisible = false;
        rhythmMenuShowingRules = false;
        rhythmMenuEntering = false;
        rhythmMenuResult = null;
        renderRhythmMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealRhythmOutcomeMenu(title, text, eyebrow) {
    rhythmMenuVisible = true;
    rhythmMenuResult = { title, text, eyebrow };
    rhythmMenuShowingRules = false;
    rhythmMenuClosing = false;
    rhythmMenuEntering = true;
    const { rhythmHelpText } = dom();
    if (rhythmHelpText) rhythmHelpText.textContent = text;
    renderRhythmMenu();
    window.setTimeout(() => { rhythmMenuEntering = false; renderRhythmMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeRhythm() {
    stopRhythm();
    closeGameOverModal();
    rhythmNotes = [];
    rhythmScore = 0;
    rhythmStreak = 0;
    rhythmMisses = 0;
    rhythmBursts = [];
    rhythmStartedAt = 0;
    rhythmLastFrame = 0;
    rhythmSpawnTimer = 0;
    rhythmMenuResult = null;
    rhythmMenuShowingRules = false;
    rhythmMenuClosing = false;
    rhythmMenuEntering = false;
    const { rhythmHelpText, rhythmStartButton } = dom();
    rhythmHelpText.textContent = `Protège le navire avec ${RHYTHM_LANES.join(', ')}. Tiens jusqu'à la fin sans trop rater.`;
    rhythmStartButton.textContent = 'Lancer la cadence';
    updateRhythmHud();
    renderRhythmBoard();
    renderRhythmMenu();
}

export function triggerRhythmBoardEffect(effectClass) {
    const { rhythmBoard } = dom();
    if (!rhythmBoard) {
        return;
    }

    rhythmBoard.classList.remove('is-hit-flash', 'is-miss-flash');
    void rhythmBoard.offsetWidth;
    rhythmBoard.classList.add(effectClass);

    if (rhythmBoardEffectTimeout) {
        window.clearTimeout(rhythmBoardEffectTimeout);
    }

    rhythmBoardEffectTimeout = window.setTimeout(() => {
        rhythmBoard.classList.remove('is-hit-flash', 'is-miss-flash');
        rhythmBoardEffectTimeout = null;
    }, 280);
}

export function highlightRhythmPad(lane, state = 'active') {
    const { rhythmBoard } = dom();
    const pads = rhythmBoard.querySelectorAll('.rhythm-pad');
    pads.forEach((element) => element.classList.remove('is-active', 'is-success', 'is-fail'));
    const pad = rhythmBoard.querySelector(`[data-rhythm-lane="${lane}"]`);
    pad?.classList.add('is-active');
    if (state === 'success') {
        pad?.classList.add('is-success');
    } else if (state === 'fail') {
        pad?.classList.add('is-fail');
    }
    if (rhythmPadHighlightTimeout) {
        window.clearTimeout(rhythmPadHighlightTimeout);
    }
    rhythmPadHighlightTimeout = window.setTimeout(() => {
        rhythmBoard.querySelectorAll('.rhythm-pad').forEach((element) => element.classList.remove('is-active', 'is-success', 'is-fail'));
    }, 110);
}

export function renderRhythmNotes() {
    const { rhythmBoard } = dom();
    const notesLayer = rhythmBoard.querySelector('.rhythm-notes');
    const feedbackLayer = rhythmBoard.querySelector('.rhythm-feedback');
    if (!notesLayer) {
        return;
    }

    notesLayer.innerHTML = rhythmNotes.map((note) => {
        const laneCenter = ((note.lane + 0.5) * 100) / RHYTHM_LANES.length;
        return `<div class="rhythm-note lane-${note.lane}" style="left:${laneCenter}%; top:${note.y}px"></div>`;
    }).join('');

    if (feedbackLayer) {
        feedbackLayer.innerHTML = rhythmBursts.map((burst) => {
            const laneCenter = ((burst.lane + 0.5) * 100) / RHYTHM_LANES.length;
            return `<div class="rhythm-burst ${burst.type}" style="left:${laneCenter}%; top:${burst.y}px">${burst.label}</div>`;
        }).join('');
    }
}

export function finishRhythm(reason = 'time') {
    stopRhythm();
    const { rhythmHelpText, rhythmStartButton } = dom();
    rhythmHelpText.textContent = reason === 'misses'
        ? `La coque a trop souffert. Score ${rhythmScore}. Record ${rhythmBestScore}.`
        : `Traversée terminée. Score ${rhythmScore}. Record ${rhythmBestScore}.`;
    rhythmStartButton.textContent = 'Relancer la cadence';
    revealRhythmOutcomeMenu(
        reason === 'misses' ? 'Navire submergé' : 'Fin de cadence',
        `Score : ${rhythmScore}. Record : ${rhythmBestScore}.`,
        reason === 'misses' ? 'Coque noyée' : 'Marins fatigués'
    );
}

export function startRhythm() {
    initializeRhythm();
    rhythmRunning = true;
    rhythmStartedAt = performance.now();
    rhythmLastFrame = rhythmStartedAt;
    const { rhythmStartButton } = dom();
    rhythmStartButton.textContent = 'Cadence en cours';

    const step = (timestamp) => {
        if (!rhythmRunning) {
            return;
        }

        const delta = timestamp - rhythmLastFrame;
        rhythmLastFrame = timestamp;
        rhythmSpawnTimer += delta;

        const spawnInterval = Math.max(320, 620 - Math.min(220, rhythmScore * 1.4));
        if (rhythmSpawnTimer >= spawnInterval) {
            rhythmSpawnTimer = 0;
            rhythmNotes.push({
                id: `${timestamp}-${Math.random()}`,
                lane: Math.floor(Math.random() * RHYTHM_LANES.length),
                y: RHYTHM_NOTE_START_Y
            });
        }

        rhythmNotes = rhythmNotes.filter((note) => {
            note.y += (delta * 0.31) + Math.min(0.16, rhythmScore * 0.0006 * delta);
            if (note.y > RHYTHM_MISS_Y) {
                rhythmStreak = 0;
                rhythmMisses += 1;
                rhythmBursts.push({
                    id: `${note.id}-miss`,
                    lane: note.lane,
                    y: RHYTHM_BURST_Y,
                    label: 'RATE',
                    type: 'is-miss'
                });
                return false;
            }
            return true;
        });

        rhythmBursts = rhythmBursts.filter((burst) => {
            burst.y -= delta * 0.05;
            burst.life = (burst.life || 420) - delta;
            return burst.life > 0;
        });

        renderRhythmNotes();
        const timeRemaining = RHYTHM_DURATION_MS - (timestamp - rhythmStartedAt);
        updateRhythmHud(timeRemaining);

        if (rhythmScore > rhythmBestScore) {
            rhythmBestScore = rhythmScore;
            window.localStorage.setItem(RHYTHM_BEST_KEY, String(rhythmBestScore));
        }

        if (rhythmMisses >= RHYTHM_MAX_MISSES) {
            finishRhythm('misses');
            return;
        }

        if (timeRemaining <= 0) {
            finishRhythm('time');
            return;
        }

        rhythmAnimationFrame = window.requestAnimationFrame(step);
    };

    rhythmAnimationFrame = window.requestAnimationFrame(step);
}

export function handleRhythmHit(lane) {
    if (!rhythmRunning) {
        highlightRhythmPad(lane, 'active');
        startRhythm();
        return;
    }

    const noteIndex = rhythmNotes.findIndex((note) => note.lane === lane && Math.abs(note.y - RHYTHM_HIT_Y) <= 44);

    if (noteIndex !== -1) {
        const note = rhythmNotes[noteIndex];
        const distance = Math.abs(note.y - RHYTHM_HIT_Y);
        rhythmNotes.splice(noteIndex, 1);
        rhythmStreak += 1;
        const isPerfect = distance <= 16;
        rhythmScore += (isPerfect ? 18 : 10) + (Math.min(rhythmStreak, 12) * 2);
        highlightRhythmPad(lane, 'success');
        triggerRhythmBoardEffect('is-hit-flash');
        rhythmBursts.push({
            id: `${note.id}-hit`,
            lane,
            y: RHYTHM_BURST_Y,
            label: isPerfect ? 'PARFAIT' : 'BIEN',
            type: isPerfect ? 'is-perfect' : 'is-good'
        });
        renderRhythmNotes();
    } else {
        rhythmStreak = 0;
        rhythmMisses += 1;
        highlightRhythmPad(lane, 'fail');
        triggerRhythmBoardEffect('is-miss-flash');
        rhythmBursts.push({
            id: `mistap-${performance.now()}`,
            lane,
            y: RHYTHM_BURST_Y,
            label: 'RATE',
            type: 'is-miss'
        });
    }

    if (rhythmMisses >= RHYTHM_MAX_MISSES) {
        updateRhythmHud(RHYTHM_DURATION_MS - (performance.now() - rhythmStartedAt));
        renderRhythmNotes();
        finishRhythm('misses');
        return;
    }

    updateRhythmHud(RHYTHM_DURATION_MS - (performance.now() - rhythmStartedAt));
}

export function setRhythmMenuVisible(visible) {
    rhythmMenuVisible = Boolean(visible);
}

export function setRhythmMenuShowingRules(showing) {
    rhythmMenuShowingRules = Boolean(showing);
}

export function getRhythmMenuVisible() {
    return rhythmMenuVisible;
}

export function getRhythmMenuClosing() {
    return rhythmMenuClosing;
}

export function getRhythmMenuShowingRules() {
    return rhythmMenuShowingRules;
}
