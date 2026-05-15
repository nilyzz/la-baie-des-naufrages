// Game module — Rythme (Cadence des marins).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';
import { formatTenthsTimer } from '../core/utils.js';

export const RHYTHM_LANES = ['\u2190', '\u2193', '\u2192'];
export const RHYTHM_MAX_MISSES = 10;
export const RHYTHM_BEST_KEY = 'baie-des-naufrages-rhythm-best';
export const RHYTHM_NOTE_START_Y = 14;
export const RHYTHM_HIT_Y = 470;
export const RHYTHM_MISS_Y = 540;
export const RHYTHM_BURST_Y = 448;
export const RHYTHM_NOTE_HEIGHT = 46;
export const RHYTHM_HIT_WINDOW = 54;
export const RHYTHM_PERFECT_WINDOW = 18;
export const RHYTHM_TIMING_HINT_WINDOW = 132;

const RHYTHM_LANE_NAMES = ['fl\u00e8che gauche', 'fl\u00e8che bas', 'fl\u00e8che droite'];
const RHYTHM_LANE_SOUNDS = [
    { base: 246.94, good: 329.63, perfect: 493.88, type: 'triangle' },
    { base: 329.63, good: 440, perfect: 659.25, type: 'sine' },
    { base: 392, good: 523.25, perfect: 783.99, type: 'square' }
];
const RHYTHM_PATTERNS = [
    [1, 0, 1, 2],
    [0, 1, 2],
    [2, 1, 0],
    [0, 2, 1, 2],
    [1, 1, 0, 2],
    [2, 0, 1, 0]
];

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
let rhythmRunBestAtStart = rhythmBestScore;
let rhythmHadNewRecord = false;
let rhythmRunning = false;
let rhythmStartedAt = 0;
let rhythmLastFrame = 0;
let rhythmSpawnTimer = 0;
let rhythmPatternQueue = [];
let rhythmPatternCursor = 0;
let rhythmPatternGap = 560;
let rhythmAnimationFrame = null;
let rhythmPadHighlightTimeout = null;
let rhythmBoardEffectTimeout = null;
let rhythmBursts = [];
let rhythmAudioContext = null;
const rhythmNoteEls = new Map();
const rhythmBurstEls = new Map();


const $ = (id) => document.getElementById(id);

function dom() {
    return {
        rhythmBoard: $('rhythmBoard'),
        rhythmTable: $('rhythmTable'),
        rhythmScoreDisplay: $('rhythmScoreDisplay'),
        rhythmBestDisplay: $('rhythmStreakDisplay'),
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

export function updateRhythmHud(elapsedMs = 0) {
    const { rhythmBoard, rhythmScoreDisplay, rhythmBestDisplay, rhythmMissesDisplay, rhythmTimerDisplay } = dom();
    rhythmScoreDisplay.textContent = String(rhythmScore);
    rhythmBestDisplay.textContent = String(rhythmBestScore);
    rhythmMissesDisplay.textContent = `${rhythmMisses} / ${RHYTHM_MAX_MISSES}`;
    rhythmTimerDisplay.textContent = formatTenthsTimer(elapsedMs);

    if (rhythmBoard) {
        rhythmBoard.classList.toggle('is-combo', rhythmStreak >= 6);
        rhythmBoard.classList.toggle('is-high-combo', rhythmStreak >= 12);
        rhythmBoard.classList.toggle('is-new-record', rhythmHadNewRecord);
        rhythmBoard.style.setProperty('--rhythm-combo-heat', String(Math.min(rhythmStreak, 18) / 18));
        rhythmBoard.style.setProperty('--rhythm-tempo-percent', `${Math.round(18 + (getRhythmTempoLevel() * 82))}%`);
    }

    rhythmBestDisplay.closest('.rhythm-counter-block')?.classList.toggle('is-new-record', rhythmHadNewRecord);
}

export function renderRhythmBoard() {
    const { rhythmBoard } = dom();
    rhythmBoard.innerHTML = `
        <div class="rhythm-sky-glow"></div>
        <div class="rhythm-stars" aria-hidden="true"></div>
        <div class="rhythm-moon"></div>
        <div class="rhythm-aurora" aria-hidden="true"></div>
        <div class="rhythm-island rhythm-island-left"></div>
        <div class="rhythm-island rhythm-island-right"></div>
        <div class="rhythm-sea"></div>
        <div class="rhythm-equalizer" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
        <div class="rhythm-tempo-meter" aria-hidden="true"><span class="rhythm-tempo-label">Tempo</span><span class="rhythm-tempo-track"><span></span></span></div>
        <div class="rhythm-lanes" style="grid-template-columns: repeat(${RHYTHM_LANES.length}, minmax(0, 1fr));">${RHYTHM_LANES.map(() => '<div class="rhythm-lane"></div>').join('')}</div>
        <div class="rhythm-target-band" aria-hidden="true">
            <span class="rhythm-hit-window-grid">${RHYTHM_LANES.map((key) => `<span class="rhythm-hit-window"><span>${key}</span></span>`).join('')}</span>
        </div>
        <div class="rhythm-notes"></div>
        <div class="rhythm-feedback"></div>
        <div class="rhythm-pads" style="grid-template-columns: repeat(${RHYTHM_LANES.length}, minmax(0, 1fr));">${RHYTHM_LANES.map((key, index) => `<button type="button" class="rhythm-pad" data-rhythm-lane="${index}" aria-label="${RHYTHM_LANE_NAMES[index]}">${key}</button>`).join('')}</div>
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
    const { rhythmBoard } = dom();
    rhythmBoard?.classList.remove('is-running', 'is-combo', 'is-high-combo', 'is-new-record', 'is-hit-flash', 'is-miss-flash');
}

export function getRhythmRulesText() {
    return `Appuie sur ${RHYTHM_LANE_NAMES.join(', ')} quand le centre de la note traverse la ligne lumineuse. Le tempo acc\u00e9l\u00e8re tant que tu tiens. Au-del\u00e0 de 10 fautes, la cadence s\u2019arr\u00eate.`;
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
    if (rhythmMenuText) rhythmMenuText.textContent = rhythmMenuShowingRules ? getRhythmRulesText() : (hasResult ? rhythmMenuResult.text : 'Survis au tempo avec les fl\u00e8ches gauche, bas et droite. La cadence acc\u00e9l\u00e8re jusqu\u2019\u00e0 10 fautes.');
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
    rhythmNoteEls.clear();
    rhythmBurstEls.clear();
    rhythmNotes = [];
    rhythmScore = 0;
    rhythmStreak = 0;
    rhythmMisses = 0;
    rhythmRunBestAtStart = rhythmBestScore;
    rhythmHadNewRecord = false;
    rhythmBursts = [];
    rhythmStartedAt = 0;
    rhythmLastFrame = 0;
    rhythmSpawnTimer = 0;
    rhythmPatternQueue = [];
    rhythmPatternCursor = 0;
    rhythmPatternGap = 560;
    rhythmMenuResult = null;
    rhythmMenuShowingRules = false;
    rhythmMenuClosing = false;
    rhythmMenuEntering = false;
    const { rhythmHelpText, rhythmStartButton } = dom();
    rhythmHelpText.textContent = `Protège le navire avec les flèches gauche, bas et droite. Vise la ligne lumineuse.`;
    rhythmHelpText.textContent = `Vise la ligne lumineuse avec les fl\u00e8ches. Le tempo acc\u00e9l\u00e8re jusqu'\u00e0 10 fautes.`;
    rhythmStartButton.textContent = 'Lancer la cadence';
    updateRhythmHud();
    renderRhythmBoard();
    renderRhythmMenu();
}

function getRhythmAudioContext() {
    if (typeof window === 'undefined') {
        return null;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return null;
    }

    if (!rhythmAudioContext) {
        rhythmAudioContext = new AudioContextClass();
    }

    if (rhythmAudioContext.state === 'suspended') {
        rhythmAudioContext.resume().catch(() => {});
    }

    return rhythmAudioContext;
}

function playRhythmTone({ frequency, endFrequency = frequency, duration = 0.08, type = 'sine', volume = 0.025, attack = 0.006, release = 0.05, delay = 0 }) {
    const audioContext = getRhythmAudioContext();
    if (!audioContext) {
        return;
    }

    const now = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + release + 0.02);
}

function playRhythmSound(effect, lane = 0) {
    const laneSound = RHYTHM_LANE_SOUNDS[lane] || RHYTHM_LANE_SOUNDS[0];

    if (effect === 'start') {
        playRhythmTone({ frequency: 196, endFrequency: 392, duration: 0.12, type: 'triangle', volume: 0.026 });
        playRhythmTone({ frequency: 294, endFrequency: 588, duration: 0.12, type: 'sine', volume: 0.018, delay: 0.08 });
        return;
    }

    if (effect === 'spawn') {
        playRhythmTone({ frequency: laneSound.base, endFrequency: laneSound.base * 0.82, duration: 0.035, type: laneSound.type, volume: 0.008, attack: 0.002, release: 0.035 });
        return;
    }

    if (effect === 'good') {
        playRhythmTone({ frequency: laneSound.good, endFrequency: laneSound.good * 1.12, duration: 0.06, type: laneSound.type, volume: 0.021, release: 0.06 });
        return;
    }

    if (effect === 'perfect') {
        playRhythmTone({ frequency: laneSound.perfect, endFrequency: laneSound.perfect * 1.18, duration: 0.078, type: laneSound.type, volume: 0.024, release: 0.07 });
        playRhythmTone({ frequency: laneSound.perfect * 2, endFrequency: laneSound.perfect * 2.18, duration: 0.05, type: 'triangle', volume: 0.011, delay: 0.045 });
        return;
    }

    if (effect === 'miss') {
        playRhythmTone({ frequency: 132, endFrequency: 72, duration: 0.12, type: 'sawtooth', volume: 0.018, attack: 0.004, release: 0.08 });
        return;
    }

    if (effect === 'early') {
        playRhythmTone({ frequency: laneSound.base * 1.45, endFrequency: laneSound.base * 1.08, duration: 0.08, type: 'square', volume: 0.014, attack: 0.003, release: 0.06 });
        return;
    }

    if (effect === 'late') {
        playRhythmTone({ frequency: laneSound.base * 0.82, endFrequency: laneSound.base * 0.58, duration: 0.11, type: 'sawtooth', volume: 0.015, attack: 0.004, release: 0.08 });
        return;
    }

    if (effect === 'finish') {
        playRhythmTone({ frequency: 330, endFrequency: 440, duration: 0.08, type: 'triangle', volume: 0.018 });
        playRhythmTone({ frequency: 440, endFrequency: 660, duration: 0.1, type: 'sine', volume: 0.016, delay: 0.08 });
    }
}

function getRhythmBoardHeight() {
    return dom().rhythmBoard?.getBoundingClientRect().height || 620;
}

function getRhythmHitY() {
    return Math.round((getRhythmBoardHeight() * 0.76) - (RHYTHM_NOTE_HEIGHT / 2));
}

function getRhythmMissY() {
    return Math.round(getRhythmBoardHeight() - 86);
}

function getRhythmBurstY() {
    return getRhythmHitY() - 24;
}

function getRhythmPatternGap() {
    const elapsedSeconds = rhythmStartedAt ? (performance.now() - rhythmStartedAt) / 1000 : 0;
    const survivalPressure = Math.min(240, elapsedSeconds * 7.5);
    const scorePressure = Math.min(110, rhythmScore * 0.28);
    const streakPush = Math.min(58, rhythmStreak * 3);
    return Math.max(235, 760 - survivalPressure - scorePressure - streakPush);
}

function getRhythmTempoLevel() {
    const gap = getRhythmPatternGap();
    return Math.max(0, Math.min(1, (760 - gap) / 525));
}

function getRhythmNoteSpeed(delta) {
    const elapsedSeconds = rhythmStartedAt ? (performance.now() - rhythmStartedAt) / 1000 : 0;
    const survivalBoost = Math.min(0.18, elapsedSeconds * 0.0032);
    const scoreBoost = Math.min(0.12, rhythmScore * 0.00018);
    return delta * (0.24 + survivalBoost + scoreBoost);
}

function updateRhythmBestScore() {
    if (rhythmScore <= rhythmBestScore) {
        return;
    }

    rhythmBestScore = rhythmScore;
    window.localStorage.setItem(RHYTHM_BEST_KEY, String(rhythmBestScore));

    if (!rhythmHadNewRecord && rhythmScore > rhythmRunBestAtStart) {
        rhythmHadNewRecord = true;
        queueRhythmBurst({
            lane: 1,
            label: 'RECORD',
            type: 'is-record'
        });
        playRhythmSound('perfect', 1);
    }
}

function refreshRhythmPatternQueue() {
    const patternSeed = Math.floor((rhythmScore / 40) + rhythmStreak + rhythmMisses + performance.now()) % RHYTHM_PATTERNS.length;
    const pattern = RHYTHM_PATTERNS[patternSeed] || RHYTHM_PATTERNS[0];
    rhythmPatternQueue = pattern.slice();
    rhythmPatternCursor = 0;
    rhythmPatternGap = getRhythmPatternGap();
}

function spawnRhythmNote(timestamp, lane) {
    rhythmNotes.push({
        id: `${timestamp}-${Math.random()}`,
        lane,
        y: RHYTHM_NOTE_START_Y
    });
    playRhythmSound('spawn', lane);
}

function queueRhythmBurst({ id = `burst-${performance.now()}-${Math.random()}`, lane, label, type, y = getRhythmBurstY() }) {
    rhythmBursts.push({ id, lane, y, label, type });
}

function missRhythmLane(lane, label = 'RATE', type = 'is-miss', sound = 'miss') {
    rhythmStreak = 0;
    rhythmMisses += 1;
    highlightRhythmPad(lane, 'fail');
    triggerRhythmBoardEffect('is-miss-flash');
    playRhythmSound(sound, lane);
    queueRhythmBurst({ lane, label, type });
}

function findClosestRhythmNote(lane, hitY) {
    let closest = null;
    rhythmNotes.forEach((note, index) => {
        if (note.lane !== lane) {
            return;
        }

        const distance = Math.abs(note.y - hitY);
        if (!closest || distance < closest.distance) {
            closest = { note, index, distance };
        }
    });
    return closest;
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
    if (!notesLayer) return;

    const activeNoteIds = new Set(rhythmNotes.map((n) => n.id));
    for (const [id, el] of rhythmNoteEls) {
        if (!activeNoteIds.has(id)) { el.remove(); rhythmNoteEls.delete(id); }
    }
    for (const note of rhythmNotes) {
        let el = rhythmNoteEls.get(note.id);
        if (!el) {
            el = document.createElement('div');
            el.className = `rhythm-note lane-${note.lane}`;
            el.style.left = `${((note.lane + 0.5) * 100) / RHYTHM_LANES.length}%`;
            el.innerHTML = `<span class="rhythm-note-key">${RHYTHM_LANES[note.lane]}</span><span class="rhythm-note-spark"></span>`;
            notesLayer.appendChild(el);
            rhythmNoteEls.set(note.id, el);
        }
        const distanceToHit = Math.abs(note.y - getRhythmHitY());
        el.classList.toggle('is-approaching', distanceToHit <= RHYTHM_TIMING_HINT_WINDOW);
        el.classList.toggle('is-perfect-zone', distanceToHit <= RHYTHM_PERFECT_WINDOW);
        el.style.top = `${note.y}px`;
    }

    if (feedbackLayer) {
        const activeBurstIds = new Set(rhythmBursts.map((b) => b.id));
        for (const [id, el] of rhythmBurstEls) {
            if (!activeBurstIds.has(id)) { el.remove(); rhythmBurstEls.delete(id); }
        }
        for (const burst of rhythmBursts) {
            let el = rhythmBurstEls.get(burst.id);
            if (!el) {
                el = document.createElement('div');
                el.className = `rhythm-burst ${burst.type}`;
                el.style.left = `${((burst.lane + 0.5) * 100) / RHYTHM_LANES.length}%`;
                el.textContent = burst.label;
                feedbackLayer.appendChild(el);
                rhythmBurstEls.set(burst.id, el);
            }
            el.style.top = `${burst.y}px`;
        }
    }
}

export function finishRhythm() {
    stopRhythm();
    playRhythmSound('miss');
    const { rhythmHelpText, rhythmStartButton } = dom();
    const elapsedText = formatTenthsTimer(performance.now() - rhythmStartedAt);
    const recordLabel = rhythmHadNewRecord ? ' Nouveau record.' : '';
    rhythmHelpText.textContent = `Cadence rompue apres ${elapsedText}. Score ${rhythmScore}. Record ${rhythmBestScore}.${recordLabel}`;
    rhythmStartButton.textContent = 'Relancer la cadence';
    revealRhythmOutcomeMenu(
        rhythmHadNewRecord ? 'Nouveau record' : 'Cadence rompue',
        `Temps : ${elapsedText}. Score : ${rhythmScore}. Record : ${rhythmBestScore}.`,
        '10 fautes'
    );
}

export function startRhythm() {
    initializeRhythm();
    rhythmRunning = true;
    rhythmStartedAt = performance.now();
    rhythmLastFrame = rhythmStartedAt;
    const { rhythmBoard, rhythmStartButton } = dom();
    rhythmBoard?.classList.add('is-running');
    rhythmStartButton.textContent = 'Cadence en cours';
    playRhythmSound('start');

    const step = (timestamp) => {
        if (!rhythmRunning) {
            return;
        }

        const delta = timestamp - rhythmLastFrame;
        rhythmLastFrame = timestamp;
        rhythmSpawnTimer += delta;

        if (!rhythmPatternQueue.length || rhythmPatternCursor >= rhythmPatternQueue.length) {
            refreshRhythmPatternQueue();
        }

        if (rhythmSpawnTimer >= rhythmPatternGap) {
            rhythmSpawnTimer = 0;
            const nextLane = rhythmPatternQueue[rhythmPatternCursor] ?? Math.floor(Math.random() * RHYTHM_LANES.length);
            rhythmPatternCursor += 1;
            rhythmPatternGap = getRhythmPatternGap() + (rhythmPatternCursor >= rhythmPatternQueue.length ? 160 : 0);
            spawnRhythmNote(timestamp, nextLane);
        }

        rhythmNotes = rhythmNotes.filter((note) => {
            note.y += getRhythmNoteSpeed(delta);
            if (note.y > getRhythmMissY()) {
                missRhythmLane(note.lane);
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
        const elapsedMs = timestamp - rhythmStartedAt;
        updateRhythmHud(elapsedMs);

        updateRhythmBestScore();

        if (rhythmMisses >= RHYTHM_MAX_MISSES) {
            finishRhythm();
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

    const hitY = getRhythmHitY();
    const closest = findClosestRhythmNote(lane, hitY);
    const noteIndex = closest && closest.distance <= RHYTHM_HIT_WINDOW ? closest.index : -1;

    if (noteIndex !== -1) {
        const note = rhythmNotes[noteIndex];
        const distance = closest.distance;
        rhythmNotes.splice(noteIndex, 1);
        rhythmStreak += 1;
        const isPerfect = distance <= RHYTHM_PERFECT_WINDOW;
        rhythmScore += (isPerfect ? 18 : 10) + (Math.min(rhythmStreak, 12) * 2);
        updateRhythmBestScore();
        highlightRhythmPad(lane, 'success');
        triggerRhythmBoardEffect('is-hit-flash');
        playRhythmSound(isPerfect ? 'perfect' : 'good', lane);
        queueRhythmBurst({
            id: `${note.id}-hit`,
            lane,
            label: isPerfect ? 'PARFAIT' : 'BIEN',
            type: isPerfect ? 'is-perfect' : 'is-good'
        });
        renderRhythmNotes();
    } else if (closest && closest.distance <= RHYTHM_TIMING_HINT_WINDOW) {
        const isEarly = closest.note.y < hitY;
        rhythmNotes.splice(closest.index, 1);
        missRhythmLane(
            lane,
            isEarly ? 'TROP TOT' : 'TROP TARD',
            isEarly ? 'is-early' : 'is-late',
            isEarly ? 'early' : 'late'
        );
        renderRhythmNotes();
    } else {
        missRhythmLane(lane);
    }

    if (rhythmMisses >= RHYTHM_MAX_MISSES) {
        updateRhythmHud(performance.now() - rhythmStartedAt);
        renderRhythmNotes();
        finishRhythm();
        return;
    }

    updateRhythmHud(performance.now() - rhythmStartedAt);
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

