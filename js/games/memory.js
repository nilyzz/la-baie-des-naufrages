// Game module — Memory (Pont des souvenirs).
// Extracted verbatim from script.js during the ES-modules migration.
// Cohabitation: script.js's IIFE still owns its own copy of the same code.

import { shuffleArray } from '../core/utils.js';
import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';

export const MEMORY_BEST_KEY = 'baie-des-naufrages-memory-best';
export const MEMORY_ICONS = ['\u2693', '\u{1F980}', '\u{1F419}', '\u{1F991}', '\u{1FAB8}', '\u{1F99E}', '\u{1F420}', '\u{1F9ED}'];
export const MEMORY_SYMBOLS = [
    { icon: '\u2693', label: 'ancre', theme: 'anchor' },
    { icon: '\u{1F980}', label: 'crabe', theme: 'crab' },
    { icon: '\u{1F419}', label: 'pieuvre', theme: 'octopus' },
    { icon: '\u{1F991}', label: 'calamar', theme: 'squid' },
    { icon: '\u{1FAB8}', label: 'corail', theme: 'coral' },
    { icon: '\u{1F99E}', label: 'homard', theme: 'lobster' },
    { icon: '\u{1F420}', label: 'poisson', theme: 'fish' },
    { icon: '\u{1F9ED}', label: 'boussole', theme: 'compass' }
];

function readMemoryBestScore() {
    if (typeof window === 'undefined') {
        return { moves: 0, elapsedMs: 0 };
    }

    const storedValue = window.localStorage.getItem(MEMORY_BEST_KEY);
    if (!storedValue) {
        return { moves: 0, elapsedMs: 0 };
    }

    const legacyMoves = Number(storedValue);
    if (Number.isFinite(legacyMoves) && legacyMoves > 0) {
        return { moves: legacyMoves, elapsedMs: 0 };
    }

    try {
        const parsed = JSON.parse(storedValue);
        const moves = Number(parsed?.moves || 0);
        const elapsedMs = Number(parsed?.elapsedMs || 0);
        return {
            moves: Number.isFinite(moves) ? moves : 0,
            elapsedMs: Number.isFinite(elapsedMs) ? elapsedMs : 0
        };
    } catch {
        return { moves: 0, elapsedMs: 0 };
    }
}

// --- module-level state ---
let memoryBestScore = readMemoryBestScore();
let memoryCards = [];
let memoryFlippedIndices = [];
let memoryMatchedPairs = 0;
let memoryMoves = 0;
let memoryLockBoard = false;
let memoryMismatchTimeout = null;
let memoryDealTimeout = null;
const memoryMatchFxTimeouts = new Set();
let memoryTimerInterval = null;
let memoryTimerStartedAt = null;
let memoryElapsedMs = 0;
let memoryMenuVisible = true;
let memoryMenuShowingRules = false;
let memoryMenuClosing = false;
let memoryMenuEntering = false;
let memoryMenuResult = false;

// --- lazy DOM refs ---
const $ = (id) => document.getElementById(id);

function dom() {
    return {
        memoryBoard: $('memoryBoard'),
        memoryMovesDisplay: $('memoryMovesDisplay'),
        memoryTimerDisplay: $('memoryTimerDisplay'),
        memoryBestMovesDisplay: $('memoryBestMovesDisplay'),
        memoryHelpText: $('memoryHelpText'),
        memoryTable: $('memoryTable'),
        memoryMenuOverlay: $('memoryMenuOverlay'),
        memoryMenuEyebrow: $('memoryMenuEyebrow'),
        memoryMenuTitle: $('memoryMenuTitle'),
        memoryMenuText: $('memoryMenuText'),
        memoryMenuActionButton: $('memoryMenuActionButton'),
        memoryMenuRulesButton: $('memoryMenuRulesButton')
    };
}

function formatMemoryTimer(elapsedMs) {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatMemoryBestScore() {
    if (!memoryBestScore.moves) {
        return '—';
    }

    if (!memoryBestScore.elapsedMs) {
        return `${memoryBestScore.moves}`;
    }

    return `${memoryBestScore.moves} · ${formatMemoryTimer(memoryBestScore.elapsedMs)}`;
}

function isMemoryScoreBetter(moves, elapsedMs) {
    if (!memoryBestScore.moves) {
        return true;
    }

    if (moves !== memoryBestScore.moves) {
        return moves < memoryBestScore.moves;
    }

    if (!memoryBestScore.elapsedMs) {
        return true;
    }

    return elapsedMs < memoryBestScore.elapsedMs;
}

function getMemoryOutcomeTitle() {
    if (memoryMoves <= 16) {
        return 'Mémoire de capitaine';
    }

    if (memoryMoves <= 22) {
        return 'Belle traversée';
    }

    return 'Pont retrouvé';
}

function syncMemoryElapsedTime() {
    if (memoryTimerStartedAt !== null) {
        memoryElapsedMs = Date.now() - memoryTimerStartedAt;
    }
}

function stopMemoryTimer() {
    syncMemoryElapsedTime();
    if (memoryTimerInterval !== null) {
        window.clearInterval(memoryTimerInterval);
        memoryTimerInterval = null;
    }
    memoryTimerStartedAt = null;
}

function startMemoryTimer() {
    stopMemoryTimer();
    memoryTimerStartedAt = Date.now() - memoryElapsedMs;
    memoryTimerInterval = window.setInterval(() => {
        syncMemoryElapsedTime();
        updateMemoryHud();
    }, 1000);
}

function clearMemoryRoundTimers() {
    if (memoryMismatchTimeout) {
        window.clearTimeout(memoryMismatchTimeout);
        memoryMismatchTimeout = null;
    }

    if (memoryDealTimeout) {
        window.clearTimeout(memoryDealTimeout);
        memoryDealTimeout = null;
    }

    if (memoryMatchFxTimeouts.size) {
        memoryMatchFxTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
        memoryMatchFxTimeouts.clear();
    }
}

export function updateMemoryHud() {
    const { memoryMovesDisplay, memoryTimerDisplay, memoryBestMovesDisplay, memoryHelpText } = dom();
    if (memoryMovesDisplay) memoryMovesDisplay.textContent = String(memoryMoves);
    if (memoryTimerDisplay) memoryTimerDisplay.textContent = formatMemoryTimer(memoryElapsedMs);
    if (memoryBestMovesDisplay) memoryBestMovesDisplay.textContent = formatMemoryBestScore();
    if (memoryHelpText && !memoryMenuResult) {
        memoryHelpText.textContent = 'Retourne les cartes du pont et retrouve toutes les paires marines.';
    }
}

export function getMemoryRulesText() {
    return "Retourne deux cartes à la fois pour retrouver chaque paire. Quand les deux symboles correspondent, ils restent visibles jusqu'à vider tout le pont.";
}

export function renderMemoryMenu() {
    const { memoryMenuOverlay, memoryTable, memoryMenuEyebrow, memoryMenuTitle, memoryMenuText, memoryMenuActionButton, memoryMenuRulesButton } = dom();
    if (!memoryMenuOverlay || !memoryTable) {
        return;
    }

    syncGameMenuOverlayBounds(memoryMenuOverlay, memoryTable);
    memoryMenuOverlay.classList.toggle('hidden', !memoryMenuVisible);
    memoryMenuOverlay.classList.toggle('is-closing', memoryMenuClosing);
    memoryMenuOverlay.classList.toggle('is-entering', memoryMenuEntering);
    memoryTable.classList.toggle('is-menu-open', memoryMenuVisible);
    memoryTable.classList.toggle('is-memory-complete', memoryMenuVisible && memoryMenuResult);

    if (!memoryMenuVisible) {
        return;
    }

    const hasResult = memoryMenuResult;
    if (memoryMenuEyebrow) {
        memoryMenuEyebrow.textContent = memoryMenuShowingRules ? 'R\u00e8gles' : (hasResult ? 'Fin de r\u00e9colte' : 'Pont des souvenirs');
    }
    if (memoryMenuTitle) {
        memoryMenuTitle.textContent = memoryMenuShowingRules ? 'Rappel rapide' : (hasResult ? getMemoryOutcomeTitle() : 'Memory');
    }
    if (memoryMenuText) {
        memoryMenuText.textContent = memoryMenuShowingRules
            ? getMemoryRulesText()
            : (hasResult
                ? `Partie termin\u00e9e en ${memoryMoves} coups et ${formatMemoryTimer(memoryElapsedMs)}. Meilleur\u00a0: ${formatMemoryBestScore()}.`
                : 'Retourne les cartes du pont et retrouve toutes les paires marines.');
    }
    if (memoryMenuActionButton) {
        memoryMenuActionButton.textContent = memoryMenuShowingRules
            ? 'Retour'
            : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
    }
    if (memoryMenuRulesButton) {
        memoryMenuRulesButton.textContent = 'R\u00e8gles';
        memoryMenuRulesButton.hidden = memoryMenuShowingRules;
    }
}

export function startMemoryLaunchSequence() {
    memoryMenuClosing = true;
    renderMemoryMenu();
    window.setTimeout(() => {
        memoryMenuClosing = false;
        memoryMenuVisible = false;
        memoryMenuShowingRules = false;
        memoryMenuEntering = false;
        memoryMenuResult = false;
        memoryLockBoard = true;
        memoryCards.forEach((card, index) => {
            card.isDealing = true;
            card.dealOrder = index;
        });
        renderMemoryMenu();
        renderMemoryBoard();

        memoryDealTimeout = window.setTimeout(() => {
            memoryCards.forEach((card) => {
                card.isDealing = false;
            });
            memoryLockBoard = false;
            memoryDealTimeout = null;
            startMemoryTimer();
            renderMemoryBoard();
        }, 760);
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealMemoryOutcomeMenu() {
    stopMemoryTimer();
    memoryMenuVisible = true;
    memoryMenuResult = true;
    memoryMenuShowingRules = false;
    memoryMenuClosing = false;
    memoryMenuEntering = true;
    const { memoryHelpText } = dom();
    if (memoryHelpText) {
        memoryHelpText.textContent = `Toutes les paires ont \u00e9t\u00e9 retrouv\u00e9es en ${memoryMoves} coups et ${formatMemoryTimer(memoryElapsedMs)}.`;
    }
    renderMemoryMenu();
    window.setTimeout(() => {
        memoryMenuEntering = false;
        renderMemoryMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function renderMemoryBoard() {
    const { memoryBoard } = dom();
    if (!memoryBoard) return;

    memoryBoard.innerHTML = memoryCards.map((card, index) => {
        const isRevealed = card.isMatched || card.isFlipped;
        return `
            <button
                type="button"
                class="memory-card-tile memory-symbol-${card.theme}${isRevealed ? ' is-revealed' : ''}${card.isMatched ? ' is-matched' : ''}${card.isMatchCelebrating ? ' is-match-celebrating' : ''}${card.isRevealing ? ' is-revealing' : ''}${card.isReturning ? ' is-returning' : ''}${card.isDealing ? ' is-dealing' : ''}"
                data-index="${index}"
                style="--memory-deal-index: ${card.dealOrder || index};"
                aria-label="${isRevealed ? `Carte ${card.label}` : 'Carte retourn\u00e9e'}"
            >
                <div class="memory-card-inner" aria-hidden="true">
                    <div class="memory-card-face memory-card-front">
                        <span class="memory-card-symbol">${card.icon}</span>
                        <span class="memory-card-glint"></span>
                    </div>
                    <div class="memory-card-face memory-card-back">
                        <span class="card-back-emblem"></span>
                    </div>
                </div>
            </button>
        `;
    }).join('');
    renderMemoryMenu();
}

export function initializeMemory() {
    clearMemoryRoundTimers();
    stopMemoryTimer();

    const deck = shuffleArray([...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS]).map((symbol, index) => ({
        id: `${symbol.icon}-${index}`,
        icon: symbol.icon,
        label: symbol.label,
        theme: symbol.theme,
        dealOrder: index,
        isFlipped: false,
        isMatched: false,
        isMatchCelebrating: false,
        isDealing: false,
        isRevealing: false,
        isReturning: false
    }));

    memoryCards = deck;
    memoryFlippedIndices = [];
    memoryMatchedPairs = 0;
    memoryMoves = 0;
    memoryElapsedMs = 0;
    memoryLockBoard = false;
    memoryMenuVisible = true;
    memoryMenuShowingRules = false;
    memoryMenuClosing = false;
    memoryMenuEntering = false;
    memoryMenuResult = false;
    updateMemoryHud();
    renderMemoryBoard();
}

export function finishMemory() {
    stopMemoryTimer();
    if (isMemoryScoreBetter(memoryMoves, memoryElapsedMs)) {
        memoryBestScore = {
            moves: memoryMoves,
            elapsedMs: memoryElapsedMs
        };
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(MEMORY_BEST_KEY, JSON.stringify(memoryBestScore));
        }
    }
    updateMemoryHud();
    revealMemoryOutcomeMenu();
}

export function handleMemoryCardFlip(index) {
    if (memoryLockBoard || memoryMenuVisible || memoryMenuClosing) {
        return;
    }

    const card = memoryCards[index];

    if (!card || card.isMatched || card.isFlipped) {
        return;
    }

    card.isReturning = false;
    card.isRevealing = true;
    card.isFlipped = true;
    memoryFlippedIndices.push(index);
    renderMemoryBoard();

    window.setTimeout(() => {
        if (!memoryCards[index]) {
            return;
        }
        memoryCards[index].isRevealing = false;
        renderMemoryBoard();
    }, 240);

    if (memoryFlippedIndices.length < 2) {
        return;
    }

    memoryMoves += 1;
    const [firstIndex, secondIndex] = memoryFlippedIndices;
    const firstCard = memoryCards[firstIndex];
    const secondCard = memoryCards[secondIndex];

    if (firstCard.icon === secondCard.icon) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        firstCard.isMatchCelebrating = true;
        secondCard.isMatchCelebrating = true;
        firstCard.isRevealing = false;
        secondCard.isRevealing = false;
        memoryMatchedPairs += 1;
        memoryFlippedIndices = [];
        updateMemoryHud();
        renderMemoryBoard();

        const matchFxTimeout = window.setTimeout(() => {
            firstCard.isMatchCelebrating = false;
            secondCard.isMatchCelebrating = false;
            memoryMatchFxTimeouts.delete(matchFxTimeout);
            renderMemoryBoard();
        }, 520);
        memoryMatchFxTimeouts.add(matchFxTimeout);

        if (memoryMatchedPairs === MEMORY_ICONS.length) {
            finishMemory();
        }
        return;
    }

    updateMemoryHud();
    memoryLockBoard = true;
    memoryMismatchTimeout = window.setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        firstCard.isRevealing = false;
        secondCard.isRevealing = false;
        firstCard.isReturning = true;
        secondCard.isReturning = true;
        renderMemoryBoard();

        memoryMismatchTimeout = window.setTimeout(() => {
            firstCard.isReturning = false;
            secondCard.isReturning = false;
            memoryFlippedIndices = [];
            memoryLockBoard = false;
            renderMemoryBoard();
        }, 220);
    }, 430);
}

// --- introspection helpers (for the eventual cutover) ---
export function getMemoryState() {
    return {
        memoryCards,
        memoryFlippedIndices: [...memoryFlippedIndices],
        memoryMatchedPairs,
        memoryMoves,
        memoryBestScore: { ...memoryBestScore },
        memoryLockBoard,
        memoryElapsedMs,
        memoryMenuVisible,
        memoryMenuShowingRules,
        memoryMenuClosing,
        memoryMenuEntering,
        memoryMenuResult
    };
}

export function setMemoryMenuVisible(visible) {
    memoryMenuVisible = Boolean(visible);
}

export function setMemoryMenuShowingRules(showing) {
    memoryMenuShowingRules = Boolean(showing);
}

export function getMemoryMenuVisible() { return memoryMenuVisible; }
export function getMemoryMenuClosing() { return memoryMenuClosing; }
export function getMemoryMenuShowingRules() { return memoryMenuShowingRules; }
export function getMemoryMenuResult() { return memoryMenuResult; }
