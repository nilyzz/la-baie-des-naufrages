// Game module — Mental Math (Jeu Calcul).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const MENTAL_MATH_START_TIME_MS = 15000;
export const MENTAL_MATH_TICK_MS = 100;
export const MENTAL_MATH_BASE_REWARD_MS = 1800;
export const MENTAL_MATH_FAST_REWARD_MS = 1200;
export const MENTAL_MATH_FAST_WINDOW_MS = 4000;
export const MENTAL_MATH_MAX_TIME_MS = 30000;

let mentalMathScore = 0;
let mentalMathCurrentQuestion = null;
let mentalMathTimeRemainingMs = MENTAL_MATH_START_TIME_MS;
let mentalMathTimerInterval = null;
let mentalMathRoundRunning = false;
let mentalMathQuestionStartedAt = 0;
let mentalMathMenuVisible = true;
let mentalMathMenuShowingRules = false;
let mentalMathMenuClosing = false;
let mentalMathMenuEntering = false;
let mentalMathMenuResult = false;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        mentalMathScoreDisplay: $('mentalMathScoreDisplay'),
        mentalMathRoundDisplay: $('mentalMathRoundDisplay'),
        mentalMathQuestion: $('mentalMathQuestion'),
        mentalMathAnswerInput: $('mentalMathAnswerInput'),
        mentalMathSubmitButton: $('mentalMathSubmitButton'),
        mentalMathFeedback: $('mentalMathFeedback'),
        mentalMathHelpText: $('mentalMathHelpText'),
        mentalMathTable: $('mentalMathTable'),
        mentalMathMenuOverlay: $('mentalMathMenuOverlay'),
        mentalMathMenuEyebrow: $('mentalMathMenuEyebrow'),
        mentalMathMenuTitle: $('mentalMathMenuTitle'),
        mentalMathMenuText: $('mentalMathMenuText'),
        mentalMathMenuActionButton: $('mentalMathMenuActionButton'),
        mentalMathMenuRulesButton: $('mentalMathMenuRulesButton'),
        mentalMathKeypadButtons: document.querySelectorAll('[data-mentalmath-keypad]')
    };
}

export function updateMentalMathHud() {
    const { mentalMathScoreDisplay, mentalMathRoundDisplay } = dom();
    if (mentalMathScoreDisplay) mentalMathScoreDisplay.textContent = String(mentalMathScore);
    if (mentalMathRoundDisplay) mentalMathRoundDisplay.textContent = `${Math.max(0, mentalMathTimeRemainingMs / 1000).toFixed(1)}s`;
}

export function generateMentalMathQuestion(score) {
    const difficulty = Math.min(4, Math.floor(score / 4));
    const operationRoll = Math.floor(Math.random() * 4);

    if (operationRoll === 0) {
        const a = 12 + Math.floor(Math.random() * (18 + (difficulty * 10)));
        const b = 4 + Math.floor(Math.random() * (14 + (difficulty * 8)));
        return { prompt: `${a} + ${b}`, answer: a + b };
    }
    if (operationRoll === 1) {
        const a = 30 + Math.floor(Math.random() * (25 + (difficulty * 12)));
        const b = 8 + Math.floor(Math.random() * (18 + (difficulty * 6)));
        return { prompt: `${a} - ${b}`, answer: a - b };
    }
    if (operationRoll === 2) {
        const a = 3 + Math.floor(Math.random() * (5 + difficulty));
        const b = 4 + Math.floor(Math.random() * (7 + difficulty));
        return { prompt: `${a} x ${b}`, answer: a * b };
    }
    const divisor = 2 + Math.floor(Math.random() * (5 + difficulty));
    const quotient = 3 + Math.floor(Math.random() * (6 + difficulty));
    return { prompt: `${divisor * quotient} / ${divisor}`, answer: quotient };
}

export function renderMentalMathQuestion() {
    updateMentalMathHud();
    const { mentalMathQuestion, mentalMathAnswerInput, mentalMathSubmitButton, mentalMathKeypadButtons } = dom();
    if (mentalMathQuestion) mentalMathQuestion.textContent = mentalMathCurrentQuestion?.prompt || '--';
    if (mentalMathAnswerInput) {
        mentalMathAnswerInput.value = '';
        mentalMathAnswerInput.disabled = !mentalMathRoundRunning;
    }
    if (mentalMathSubmitButton) mentalMathSubmitButton.disabled = !mentalMathRoundRunning;
    mentalMathKeypadButtons.forEach((button) => {
        button.disabled = !mentalMathRoundRunning;
    });
    // Note: activeGameTab check is skipped here since it's IIFE state.
    // Caller can manage blur() if needed after calling this.
}

export function getMentalMathRulesText() {
    return 'Le chrono descend en continu. Réponds juste et vite pour gagner du temps, enchaîner les calculs et faire grimper ton score avant la fin.';
}

export function renderMentalMathMenu() {
    const { mentalMathMenuOverlay, mentalMathTable, mentalMathMenuEyebrow, mentalMathMenuTitle, mentalMathMenuText, mentalMathMenuActionButton, mentalMathMenuRulesButton } = dom();
    if (!mentalMathMenuOverlay || !mentalMathTable) return;

    syncGameMenuOverlayBounds(mentalMathMenuOverlay, mentalMathTable);
    mentalMathMenuOverlay.classList.toggle('hidden', !mentalMathMenuVisible);
    mentalMathMenuOverlay.classList.toggle('is-closing', mentalMathMenuClosing);
    mentalMathMenuOverlay.classList.toggle('is-entering', mentalMathMenuEntering);
    mentalMathTable.classList.toggle('is-menu-open', mentalMathMenuVisible);

    if (!mentalMathMenuVisible) return;

    if (mentalMathMenuEyebrow) {
        mentalMathMenuEyebrow.textContent = mentalMathMenuShowingRules ? 'R\u00e8gles' : (mentalMathMenuResult ? 'Fin de partie' : "Baie d'arcade");
    }
    if (mentalMathMenuTitle) {
        mentalMathMenuTitle.textContent = mentalMathMenuShowingRules
            ? 'Rappel rapide'
            : (mentalMathMenuResult ? 'Temps ecoule' : 'Jeu Calcul');
    }
    if (mentalMathMenuText) {
        mentalMathMenuText.textContent = mentalMathMenuShowingRules
            ? getMentalMathRulesText()
            : (mentalMathMenuResult
                ? `Tu as enchaine ${mentalMathScore} bonne${mentalMathScore > 1 ? 's' : ''} r\u00e9ponse${mentalMathScore > 1 ? 's' : ''}.`
                : 'Prepare-toi a enchainer les calculs avant que le chrono ne te rattrape.');
    }
    if (mentalMathMenuActionButton) {
        mentalMathMenuActionButton.textContent = mentalMathMenuShowingRules
            ? 'Retour'
            : (mentalMathMenuResult ? 'Relancer la partie' : 'Lancer la partie');
    }
    if (mentalMathMenuRulesButton) {
        mentalMathMenuRulesButton.textContent = 'R\u00e8gles';
        mentalMathMenuRulesButton.hidden = mentalMathMenuShowingRules;
    }
}

export function startMentalMathLaunchSequence() {
    mentalMathMenuClosing = true;
    renderMentalMathMenu();
    window.setTimeout(() => {
        mentalMathMenuClosing = false;
        mentalMathMenuVisible = false;
        mentalMathMenuShowingRules = false;
        mentalMathMenuEntering = false;
        mentalMathMenuResult = false;
        startMentalMathRound();
        renderMentalMathMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealMentalMathOutcomeMenu() {
    mentalMathMenuShowingRules = false;
    mentalMathMenuClosing = false;
    mentalMathMenuEntering = true;
    mentalMathMenuVisible = true;
    mentalMathMenuResult = true;
    renderMentalMathMenu();
    window.setTimeout(() => {
        mentalMathMenuEntering = false;
        renderMentalMathMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function stopMentalMathTimer() {
    if (mentalMathTimerInterval) {
        window.clearInterval(mentalMathTimerInterval);
        mentalMathTimerInterval = null;
    }
}

export function finishMentalMathRound() {
    stopMentalMathTimer();
    mentalMathRoundRunning = false;
    mentalMathTimeRemainingMs = 0;
    const { mentalMathFeedback, mentalMathHelpText } = dom();
    if (mentalMathFeedback) mentalMathFeedback.textContent = `Temps ecoule. Score final : ${mentalMathScore}.`;
    if (mentalMathHelpText) mentalMathHelpText.textContent = "La mar\u00e9e s'est retir\u00e9e. Relance une partie pour tenter de battre ton score.";
    renderMentalMathQuestion();
    revealMentalMathOutcomeMenu();
}

export function startMentalMathTimer() {
    stopMentalMathTimer();
    mentalMathTimerInterval = window.setInterval(() => {
        mentalMathTimeRemainingMs = Math.max(0, mentalMathTimeRemainingMs - MENTAL_MATH_TICK_MS);
        updateMentalMathHud();
        if (mentalMathTimeRemainingMs <= 0) finishMentalMathRound();
    }, MENTAL_MATH_TICK_MS);
}

export function advanceMentalMathQuestion() {
    mentalMathCurrentQuestion = generateMentalMathQuestion(mentalMathScore);
    mentalMathQuestionStartedAt = performance.now();
    renderMentalMathQuestion();
}

export function startMentalMathRound() {
    mentalMathRoundRunning = true;
    mentalMathQuestionStartedAt = performance.now();
    const { mentalMathFeedback, mentalMathHelpText } = dom();
    if (mentalMathFeedback) mentalMathFeedback.textContent = '';
    if (mentalMathHelpText) mentalMathHelpText.textContent = 'Le chrono file. Réponds vite et juste pour regagner du temps.';
    renderMentalMathQuestion();
    startMentalMathTimer();
}

export function initializeMentalMath() {
    closeGameOverModal();
    stopMentalMathTimer();
    mentalMathScore = 0;
    mentalMathCurrentQuestion = generateMentalMathQuestion(0);
    mentalMathTimeRemainingMs = MENTAL_MATH_START_TIME_MS;
    mentalMathRoundRunning = false;
    mentalMathQuestionStartedAt = performance.now();
    mentalMathMenuVisible = true;
    mentalMathMenuShowingRules = false;
    mentalMathMenuClosing = false;
    mentalMathMenuEntering = false;
    mentalMathMenuResult = false;
    const { mentalMathFeedback, mentalMathHelpText } = dom();
    if (mentalMathFeedback) mentalMathFeedback.textContent = '';
    if (mentalMathHelpText) mentalMathHelpText.textContent = 'Le chrono descend. Réponds juste et vite pour regagner un peu de temps et pousser ton score au plus haut.';
    renderMentalMathQuestion();
    renderMentalMathMenu();
}

export function submitMentalMathAnswer() {
    if (!mentalMathCurrentQuestion || !mentalMathRoundRunning) return;
    const { mentalMathAnswerInput, mentalMathFeedback, mentalMathHelpText } = dom();
    if (!mentalMathAnswerInput) return;
    const userAnswer = Number(mentalMathAnswerInput.value);
    if (Number.isNaN(userAnswer)) {
        if (mentalMathFeedback) mentalMathFeedback.textContent = 'Entre une r\u00e9ponse avant de valider.';
        return;
    }

    if (userAnswer === mentalMathCurrentQuestion.answer) {
        const responseTimeMs = Math.max(0, performance.now() - mentalMathQuestionStartedAt);
        const fastRewardRatio = Math.max(0, (MENTAL_MATH_FAST_WINDOW_MS - responseTimeMs) / MENTAL_MATH_FAST_WINDOW_MS);
        const timeReward = MENTAL_MATH_BASE_REWARD_MS + (MENTAL_MATH_FAST_REWARD_MS * fastRewardRatio);
        mentalMathScore += 1;
        mentalMathTimeRemainingMs = Math.min(MENTAL_MATH_MAX_TIME_MS, mentalMathTimeRemainingMs + timeReward);
        if (mentalMathFeedback) mentalMathFeedback.textContent = `Bonne r\u00e9ponse. +${(timeReward / 1000).toFixed(1)}s`;
        if (mentalMathHelpText) mentalMathHelpText.textContent = 'Belle r\u00e9ponse. Encha\u00eene pour garder la mar\u00e9e avec toi.';
    } else {
        if (mentalMathFeedback) mentalMathFeedback.textContent = `Presque. Il fallait ${mentalMathCurrentQuestion.answer}.`;
        if (mentalMathHelpText) mentalMathHelpText.textContent = 'Pas de bonus cette fois. Repars vite sur le calcul suivant.';
    }

    advanceMentalMathQuestion();
}

export function handleMentalMathKeypadInput(value) {
    if (!mentalMathRoundRunning) return;
    const { mentalMathAnswerInput } = dom();
    if (!mentalMathAnswerInput) return;
    mentalMathAnswerInput.value = `${mentalMathAnswerInput.value}${value}`.slice(0, 6);
}

export function handleMentalMathKeypadAction(action) {
    if (!mentalMathRoundRunning) return;
    const { mentalMathAnswerInput } = dom();
    if (!mentalMathAnswerInput) return;
    if (action === 'backspace') {
        mentalMathAnswerInput.value = mentalMathAnswerInput.value.slice(0, -1);
        return;
    }
    if (action === 'clear') {
        mentalMathAnswerInput.value = '';
    }
}

export function setMentalMathMenuVisible(v) { mentalMathMenuVisible = Boolean(v); }
export function setMentalMathMenuShowingRules(v) { mentalMathMenuShowingRules = Boolean(v); }
export function getMentalMathRoundRunning() { return mentalMathRoundRunning; }
export function getMentalMathMenuVisible() { return mentalMathMenuVisible; }
export function getMentalMathMenuClosing() { return mentalMathMenuClosing; }
export function getMentalMathMenuShowingRules() { return mentalMathMenuShowingRules; }
