// Game module — Memory (Pont des souvenirs).
// Extracted verbatim from script.js during the ES-modules migration.
// Cohabitation: script.js's IIFE still owns its own copy of the same code.

import { shuffleArray } from '../core/utils.js';
import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';

export const MEMORY_ICONS = ['\u2693', '\u{1F980}', '\u{1F419}', '\u{1F991}', '\u{1FAB8}', '\u{1F99E}', '\u{1F420}', '\u{1F9ED}'];

// --- module-level state ---
let memoryCards = [];
let memoryFlippedIndices = [];
let memoryMatchedPairs = 0;
let memoryMoves = 0;
let memoryLockBoard = false;
let memoryMismatchTimeout = null;
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
        memoryPairsDisplay: $('memoryPairsDisplay'),
        memoryMovesDisplay: $('memoryMovesDisplay'),
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

export function updateMemoryHud() {
    const { memoryPairsDisplay, memoryMovesDisplay, memoryHelpText } = dom();
    if (memoryPairsDisplay) memoryPairsDisplay.textContent = `${memoryMatchedPairs} / 8`;
    if (memoryMovesDisplay) memoryMovesDisplay.textContent = String(memoryMoves);
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

    if (!memoryMenuVisible) {
        return;
    }

    const hasResult = memoryMenuResult;
    if (memoryMenuEyebrow) {
        memoryMenuEyebrow.textContent = memoryMenuShowingRules ? 'R\u00e8gles' : (hasResult ? 'Fin de r\u00e9colte' : 'Pont des souvenirs');
    }
    if (memoryMenuTitle) {
        memoryMenuTitle.textContent = memoryMenuShowingRules ? 'Rappel rapide' : (hasResult ? 'Memory termin\u00e9' : 'Memory');
    }
    if (memoryMenuText) {
        memoryMenuText.textContent = memoryMenuShowingRules
            ? getMemoryRulesText()
            : (hasResult
                ? `Toutes les paires ont \u00e9t\u00e9 retrouv\u00e9es en ${memoryMoves} coups.`
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
        renderMemoryMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealMemoryOutcomeMenu() {
    memoryMenuVisible = true;
    memoryMenuResult = true;
    memoryMenuShowingRules = false;
    memoryMenuClosing = false;
    memoryMenuEntering = true;
    const { memoryHelpText } = dom();
    if (memoryHelpText) {
        memoryHelpText.textContent = `Toutes les paires ont \u00e9t\u00e9 retrouv\u00e9es en ${memoryMoves} coups.`;
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
                class="memory-card-tile${isRevealed ? ' is-revealed' : ''}${card.isMatched ? ' is-matched' : ''}${card.isRevealing ? ' is-revealing' : ''}${card.isReturning ? ' is-returning' : ''}"
                data-index="${index}"
                aria-label="${isRevealed ? `Carte ${card.icon}` : 'Carte retourn\u00e9e'}"
            >
                <div class="memory-card-inner" aria-hidden="true">
                    <div class="memory-card-face memory-card-front">${card.icon}</div>
                    <div class="memory-card-face memory-card-back"><span class="card-back-emblem"></span></div>
                </div>
            </button>
        `;
    }).join('');
    renderMemoryMenu();
}

export function initializeMemory() {
    if (memoryMismatchTimeout) {
        window.clearTimeout(memoryMismatchTimeout);
        memoryMismatchTimeout = null;
    }

    const deck = shuffleArray([...MEMORY_ICONS, ...MEMORY_ICONS]).map((icon, index) => ({
        id: `${icon}-${index}`,
        icon,
        isFlipped: false,
        isMatched: false,
        isRevealing: false,
        isReturning: false
    }));

    memoryCards = deck;
    memoryFlippedIndices = [];
    memoryMatchedPairs = 0;
    memoryMoves = 0;
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
    }, 340);

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
        firstCard.isRevealing = false;
        secondCard.isRevealing = false;
        memoryMatchedPairs += 1;
        memoryFlippedIndices = [];
        updateMemoryHud();
        renderMemoryBoard();

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
        }, 340);
    }, 720);
}

// --- introspection helpers (for the eventual cutover) ---
export function getMemoryState() {
    return {
        memoryCards,
        memoryFlippedIndices: [...memoryFlippedIndices],
        memoryMatchedPairs,
        memoryMoves,
        memoryLockBoard,
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
