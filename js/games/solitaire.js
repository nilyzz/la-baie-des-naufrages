// Game module - Solitaire (Cabine du capitaine).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';
import { shuffleArray } from '../core/utils.js';

export const SOLITAIRE_SUITS = ['spades', 'hearts', 'clubs', 'diamonds'];
export const SOLITAIRE_SUIT_SYMBOLS = {
    spades: '\u2660',
    hearts: '\u2665',
    clubs: '\u2663',
    diamonds: '\u2666'
};

let solitaireStockCards = [];
let solitaireWasteCards = [];
let solitaireFoundationsState = { spades: [], hearts: [], clubs: [], diamonds: [] };
let solitaireTableauColumns = [];
let solitaireSelectedSource = null;
let solitaireMenuVisible = true;
let solitaireMenuShowingRules = false;
let solitaireMenuClosing = false;
let solitaireMenuEntering = false;
let solitaireMenuResult = null;
let solitaireDragState = null;
let solitaireAnimatedCardIds = new Set();
let solitaireAnimationOrigins = new Map();
let solitaireAnimationTimings = new Map();
let solitaireFlippedCardIds = new Set();
let solitaireFoundationAnimatedCardIds = new Set();
let solitaireAudioContext = null;
let solitaireScore = 0;
let solitaireTimerStartedAt = null;
let solitaireElapsedMs = 0;
let solitaireTimerInterval = null;

const SOLITAIRE_TABLEAU_CARD_OFFSET = 28;
const SOLITAIRE_DRAG_OFFSET_THRESHOLD = 10;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        solitaireStock: $('solitaireStock'),
        solitaireWaste: $('solitaireWaste'),
        solitaireFoundations: $('solitaireFoundations'),
        solitaireTableau: $('solitaireTableau'),
        solitaireTable: $('solitaireTable'),
        solitaireScoreDisplay: $('solitaireScoreDisplay'),
        solitaireTimerDisplay: $('solitaireTimerDisplay'),
        solitaireRestartButton: $('solitaireRestartButton'),
        solitaireHelpText: $('solitaireHelpText'),
        solitaireMenuOverlay: $('solitaireMenuOverlay'),
        solitaireMenuEyebrow: $('solitaireMenuEyebrow'),
        solitaireMenuTitle: $('solitaireMenuTitle'),
        solitaireMenuText: $('solitaireMenuText'),
        solitaireMenuActionButton: $('solitaireMenuActionButton'),
        solitaireMenuRulesButton: $('solitaireMenuRulesButton')
    };
}

function getSolitaireCardColor(suit) {
    return ['hearts', 'diamonds'].includes(suit) ? 'red' : 'black';
}

function getSolitaireCardRankLabel(rank) {
    const rankMap = {
        1: 'A',
        11: 'V',
        12: 'D',
        13: 'R'
    };

    return rankMap[rank] || String(rank);
}

function getSolitaireCardLabel(card) {
    return `${getSolitaireCardRankLabel(card.rank)}${SOLITAIRE_SUIT_SYMBOLS[card.suit]}`;
}

function getSolitaireCardFaceMarkup(card) {
    const rank = getSolitaireCardRankLabel(card.rank);
    const suit = SOLITAIRE_SUIT_SYMBOLS[card.suit];

    return `
        <span class="solitaire-card-corner">
            <span class="solitaire-card-rank">${rank}</span>
            <span class="solitaire-card-suit">${suit}</span>
        </span>
        <span class="solitaire-card-center">${suit}</span>
        <span class="solitaire-card-corner is-bottom" aria-hidden="true">
            <span class="solitaire-card-rank">${rank}</span>
            <span class="solitaire-card-suit">${suit}</span>
        </span>
    `;
}

function getSolitaireCardButtonMarkup(card, options = {}) {
    const {
        classes = [],
        style = '',
        attributes = ''
    } = options;
    const className = ['solitaire-playing-card', getSolitaireCardColor(card.suit), ...classes].filter(Boolean).join(' ');
    const styleAttribute = style ? ` style="${style}"` : '';
    const label = getSolitaireCardLabel(card);

    return `
        <button
            type="button"
            class="${className}"
            aria-label="${label}"
            data-solitaire-card-id="${card.id}"
            ${attributes}${styleAttribute}
        >${getSolitaireCardFaceMarkup(card)}</button>
    `;
}

function createSolitaireDeck() {
    return shuffleArray(SOLITAIRE_SUITS.flatMap((suit) => Array.from({ length: 13 }, (_, index) => ({
        id: crypto.randomUUID(),
        suit,
        rank: index + 1,
        faceUp: false
    }))));
}

export function updateSolitaireHud() {
    const { solitaireScoreDisplay, solitaireTimerDisplay } = dom();

    if (solitaireScoreDisplay) {
        solitaireScoreDisplay.textContent = String(solitaireScore);
    }

    if (solitaireTimerDisplay) {
        solitaireTimerDisplay.textContent = formatSolitaireTimer(solitaireElapsedMs);
    }
}

function formatSolitaireTimer(elapsedMs) {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function syncSolitaireElapsedTime() {
    if (solitaireTimerStartedAt !== null) {
        solitaireElapsedMs = Date.now() - solitaireTimerStartedAt;
    }
}

function stopSolitaireTimer() {
    syncSolitaireElapsedTime();
    if (solitaireTimerInterval !== null) {
        window.clearInterval(solitaireTimerInterval);
        solitaireTimerInterval = null;
    }
    solitaireTimerStartedAt = null;
}

function startSolitaireTimer() {
    stopSolitaireTimer();
    solitaireTimerStartedAt = Date.now() - solitaireElapsedMs;
    solitaireTimerInterval = window.setInterval(() => {
        syncSolitaireElapsedTime();
        updateSolitaireHud();
    }, 1000);
}

function resetSolitaireHudState() {
    stopSolitaireTimer();
    solitaireScore = 0;
    solitaireElapsedMs = 0;
}

function adjustSolitaireScore(delta) {
    solitaireScore = Math.max(0, solitaireScore + delta);
}

function setSolitaireHelpMessage(message) {
    const { solitaireHelpText } = dom();
    if (solitaireHelpText) {
        solitaireHelpText.textContent = message;
    }
}

function stageSolitaireCardAnimations(cards) {
    if (!Array.isArray(cards) || !cards.length) {
        return;
    }

    cards.forEach((card) => {
        if (card?.id) {
            solitaireAnimatedCardIds.add(card.id);
        }
    });
}

function stageSolitaireFlippedCard(card) {
    if (card?.id) {
        solitaireFlippedCardIds.add(card.id);
    }
}

function stageSolitaireFoundationCard(card) {
    if (card?.id) {
        solitaireFoundationAnimatedCardIds.add(card.id);
    }
}

function getSolitaireAudioContext() {
    if (typeof window === 'undefined') {
        return null;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return null;
    }

    if (!solitaireAudioContext) {
        solitaireAudioContext = new AudioContextClass();
    }

    if (solitaireAudioContext.state === 'suspended') {
        solitaireAudioContext.resume().catch(() => {});
    }

    return solitaireAudioContext;
}

function playSolitaireTone({ frequency, duration = 0.08, type = 'sine', volume = 0.02, attack = 0.01, release = 0.06 }) {
    const audioContext = getSolitaireAudioContext();
    if (!audioContext) {
        return;
    }

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + release + 0.02);
}

function playSolitaireSound(effect) {
    if (effect === 'draw') {
        playSolitaireTone({ frequency: 420, duration: 0.04, type: 'triangle', volume: 0.018, attack: 0.004, release: 0.05 });
        return;
    }

    if (effect === 'move') {
        playSolitaireTone({ frequency: 320, duration: 0.05, type: 'triangle', volume: 0.014, attack: 0.004, release: 0.05 });
        return;
    }

    if (effect === 'flip') {
        playSolitaireTone({ frequency: 540, duration: 0.045, type: 'square', volume: 0.012, attack: 0.002, release: 0.04 });
        return;
    }

    if (effect === 'foundation') {
        playSolitaireTone({ frequency: 620, duration: 0.05, type: 'triangle', volume: 0.018, attack: 0.004, release: 0.06 });
        window.setTimeout(() => {
            playSolitaireTone({ frequency: 880, duration: 0.06, type: 'sine', volume: 0.016, attack: 0.004, release: 0.08 });
        }, 36);
    }
}

function stageSolitaireAnimationOrigin(card, rect) {
    stageSolitaireAnimationOriginWithTiming(card, rect);
}

function stageSolitaireAnimationOriginWithTiming(card, rect, timing = {}) {
    if (!card?.id || !rect) {
        return;
    }

    solitaireAnimationOrigins.set(card.id, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
    });

    if (timing.delay !== undefined || timing.duration !== undefined) {
        solitaireAnimationTimings.set(card.id, {
            delay: timing.delay ?? 0,
            duration: timing.duration ?? 420
        });
    }
}

function captureSolitaireCardRects() {
    return new Map(Array.from(document.querySelectorAll('[data-solitaire-card-id]')).map((element) => [
        element.dataset.solitaireCardId,
        element.getBoundingClientRect()
    ]));
}

function animateSolitaireCardLayout(previousRects) {
    if (!(previousRects instanceof Map) && !(solitaireAnimationOrigins instanceof Map)) {
        return;
    }

    Array.from(document.querySelectorAll('[data-solitaire-card-id]')).forEach((element) => {
        const previousRect = previousRects.get(element.dataset.solitaireCardId)
            || solitaireAnimationOrigins.get(element.dataset.solitaireCardId);
        if (!previousRect) {
            return;
        }

        const nextRect = element.getBoundingClientRect();
        const deltaX = previousRect.left - nextRect.left;
        const deltaY = previousRect.top - nextRect.top;

        if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
            return;
        }

        element.animate([
            {
                transform: `translate(${deltaX}px, ${deltaY}px)`,
                boxShadow: '0 24px 38px -22px rgba(15, 23, 42, 0.48)'
            },
            {
                transform: 'translate(0, 0)',
                boxShadow: getComputedStyle(element).boxShadow
            }
        ], {
            duration: solitaireAnimationTimings.get(element.dataset.solitaireCardId)?.duration ?? 420,
            delay: solitaireAnimationTimings.get(element.dataset.solitaireCardId)?.delay ?? 0,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'backwards'
        });
    });

    solitaireAnimationOrigins = new Map();
    solitaireAnimationTimings = new Map();
}

function isValidSolitaireRun(column, startIndex) {
    for (let index = startIndex; index < column.length - 1; index += 1) {
        const current = column[index];
        const next = column[index + 1];

        if (!current.faceUp || !next.faceUp) {
            return false;
        }

        if (getSolitaireCardColor(current.suit) === getSolitaireCardColor(next.suit) || current.rank !== next.rank + 1) {
            return false;
        }
    }

    return true;
}

function areSameSolitaireSource(left, right) {
    if (!left || !right || left.type !== right.type) {
        return false;
    }

    if (left.type === 'tableau') {
        return left.col === right.col && left.index === right.index;
    }

    if (left.type === 'foundation') {
        return left.suit === right.suit;
    }

    return true;
}

export function getSolitaireMovableCards(source) {
    if (!source) {
        return [];
    }

    if (source.type === 'waste') {
        return solitaireWasteCards.length ? [solitaireWasteCards[solitaireWasteCards.length - 1]] : [];
    }

    if (source.type === 'foundation') {
        const pile = solitaireFoundationsState[source.suit];
        return pile.length ? [pile[pile.length - 1]] : [];
    }

    if (source.type === 'tableau') {
        const column = solitaireTableauColumns[source.col] || [];
        const cards = column.slice(source.index);
        return isValidSolitaireRun(column, source.index) ? cards : [];
    }

    return [];
}

function removeSolitaireSourceCards(source, count) {
    if (source.type === 'waste') {
        solitaireWasteCards.splice(-count, count);
        return;
    }

    if (source.type === 'foundation') {
        solitaireFoundationsState[source.suit].splice(-count, count);
        return;
    }

    if (source.type === 'tableau') {
        solitaireTableauColumns[source.col].splice(source.index, count);
        const column = solitaireTableauColumns[source.col];

        if (column.length && !column[column.length - 1].faceUp) {
            column[column.length - 1].faceUp = true;
            stageSolitaireFlippedCard(column[column.length - 1]);
            playSolitaireSound('flip');
            adjustSolitaireScore(5);
        }
    }
}

function canPlaceSolitaireOnFoundation(card, suit) {
    const pile = solitaireFoundationsState[suit];
    const expectedRank = pile.length + 1;
    return card.suit === suit && card.rank === expectedRank;
}

function findSolitaireFoundationTarget(card, options = {}) {
    const {
        allowEmptyFoundation = true
    } = options;

    if (!card) {
        return null;
    }

    return SOLITAIRE_SUITS.find((suit) => {
        if (!canPlaceSolitaireOnFoundation(card, suit)) {
            return false;
        }

        if (!allowEmptyFoundation && solitaireFoundationsState[suit].length === 0) {
            return false;
        }

        return true;
    }) || null;
}

function canPlaceSolitaireOnTableau(cards, col) {
    const firstCard = cards[0];
    const column = solitaireTableauColumns[col];
    const targetCard = column[column.length - 1];

    if (!targetCard) {
        return firstCard.rank === 13;
    }

    return targetCard.faceUp
        && getSolitaireCardColor(targetCard.suit) !== getSolitaireCardColor(firstCard.suit)
        && targetCard.rank === firstCard.rank + 1;
}

function findSolitaireAutoTableauDestination(source) {
    const movableCards = getSolitaireMovableCards(source);

    if (!movableCards.length) {
        return null;
    }

    let emptyColumn = null;

    for (let col = 0; col < solitaireTableauColumns.length; col += 1) {
        if (source.type === 'tableau' && source.col === col) {
            continue;
        }

        if (!canPlaceSolitaireOnTableau(movableCards, col)) {
            continue;
        }

        if (solitaireTableauColumns[col].length) {
            return col;
        }

        if (emptyColumn === null) {
            emptyColumn = col;
        }
    }

    return emptyColumn;
}

function hasSolitaireSourceTableauMove(source) {
    const movableCards = getSolitaireMovableCards(source);

    if (!movableCards.length) {
        return false;
    }

    return solitaireTableauColumns.some((_, col) => {
        if (source.type === 'tableau' && source.col === col) {
            return false;
        }

        return canPlaceSolitaireOnTableau(movableCards, col);
    });
}

function hasSolitaireSourceFoundationMove(source) {
    const movableCards = getSolitaireMovableCards(source);

    return movableCards.length === 1 && Boolean(findSolitaireFoundationTarget(movableCards[0]));
}

function hasSolitaireAvailableMove() {
    if (solitaireStockCards.length || solitaireWasteCards.length) {
        return true;
    }

    for (let col = 0; col < solitaireTableauColumns.length; col += 1) {
        const column = solitaireTableauColumns[col];

        for (let index = 0; index < column.length; index += 1) {
            const card = column[index];
            if (!card.faceUp) {
                continue;
            }

            const source = { type: 'tableau', col, index };
            if (hasSolitaireSourceFoundationMove(source) || hasSolitaireSourceTableauMove(source)) {
                return true;
            }
        }
    }

    for (const suit of SOLITAIRE_SUITS) {
        const source = { type: 'foundation', suit };
        if (getSolitaireMovableCards(source).length && hasSolitaireSourceTableauMove(source)) {
            return true;
        }
    }

    return false;
}

export function getSolitaireFoundationCount(suit) {
    return solitaireFoundationsState[suit]?.length ?? 0;
}

export function clearSolitaireSelection() {
    solitaireSelectedSource = null;
}

function finalizeSolitaireTurn(helpText, autoMovedCount = 0) {
    clearSolitaireSelection();

    if (autoMovedCount > 0) {
        const suffix = autoMovedCount > 1 ? ` ${autoMovedCount} cartes ont rejoint les fondations.` : ' 1 carte a rejoint les fondations.';
        setSolitaireHelpMessage(`${helpText}${suffix}`);
    } else {
        setSolitaireHelpMessage(helpText);
    }

    renderSolitaire();
    if (checkSolitaireWin()) {
        return;
    }

    if (!hasSolitaireAvailableMove()) {
        revealSolitaireOutcomeMenu(
            'Cul-de-sac',
            'Plus aucun coup n est disponible. Relance une nouvelle donne pour reprendre la traversee.',
            'Pont bloque'
        );
    }
}

function moveSolitaireSourceToFoundation(source, suit, options = {}) {
    const {
        render = true,
        helpText = 'Carte placee sur une fondation.',
        autoFoundation = true
    } = options;
    const movableCards = getSolitaireMovableCards(source);

    if (movableCards.length !== 1 || !canPlaceSolitaireOnFoundation(movableCards[0], suit)) {
        return false;
    }

    removeSolitaireSourceCards(source, 1);
    solitaireFoundationsState[suit].push(movableCards[0]);
    stageSolitaireFoundationCard(movableCards[0]);

    if (render) {
        const autoMovedCards = autoFoundation ? runSolitaireAutoFoundation() : [];
        stageSolitaireCardAnimations([movableCards[0], ...autoMovedCards]);
        [movableCards[0], ...autoMovedCards].forEach(stageSolitaireFoundationCard);
        adjustSolitaireScore(10 + (autoMovedCards.length * 10));
        playSolitaireSound('foundation');
        finalizeSolitaireTurn(helpText, autoMovedCards.length);
    } else {
        clearSolitaireSelection();
    }

    return true;
}

function moveSolitaireSourceToTableau(source, col, options = {}) {
    const {
        render = true,
        helpText = 'Pile deplacee sur une colonne du pont.',
        autoFoundation = true
    } = options;
    const movableCards = getSolitaireMovableCards(source);

    if (!movableCards.length || !canPlaceSolitaireOnTableau(movableCards, col)) {
        return false;
    }

    removeSolitaireSourceCards(source, movableCards.length);
    solitaireTableauColumns[col].push(...movableCards);

    if (render) {
        const autoMovedCards = autoFoundation ? runSolitaireAutoFoundation() : [];
        stageSolitaireCardAnimations([...movableCards, ...autoMovedCards]);
        adjustSolitaireScore(5 + (autoMovedCards.length * 10));
        playSolitaireSound('move');
        finalizeSolitaireTurn(helpText, autoMovedCards.length);
    } else {
        clearSolitaireSelection();
    }

    return true;
}

function findNextSolitaireAutoFoundationMove() {
        const wasteTopCard = solitaireWasteCards[solitaireWasteCards.length - 1];
    const wasteSuit = findSolitaireFoundationTarget(wasteTopCard, { allowEmptyFoundation: false });

    if (wasteSuit) {
        return {
            source: { type: 'waste' },
            suit: wasteSuit
        };
    }

    for (let col = 0; col < solitaireTableauColumns.length; col += 1) {
        const column = solitaireTableauColumns[col];
        const topCard = column[column.length - 1];

        if (!topCard?.faceUp) {
            continue;
        }

        const suit = findSolitaireFoundationTarget(topCard, { allowEmptyFoundation: false });

        if (suit) {
            return {
                source: { type: 'tableau', col, index: column.length - 1 },
                suit
            };
        }
    }

    return null;
}

export function runSolitaireAutoFoundation() {
    const movedCards = [];
    let safety = 0;

    while (safety < 52) {
        safety += 1;
        const move = findNextSolitaireAutoFoundationMove();

        if (!move) {
            break;
        }

        moveSolitaireSourceToFoundation(move.source, move.suit, {
            render: false,
            autoFoundation: false
        });
        const foundationPile = solitaireFoundationsState[move.suit];
        const movedCard = foundationPile[foundationPile.length - 1];
        if (movedCard) {
            movedCards.push(movedCard);
        }
    }

    return movedCards;
}

export function tryAutoMoveSolitaireSource(source, options = {}) {
    const {
        allowEmptyFoundation = false
    } = options;
    const movableCards = getSolitaireMovableCards(source);

    if (!movableCards.length) {
        return false;
    }

    if (movableCards.length === 1) {
        const foundationSuit = findSolitaireFoundationTarget(movableCards[0], { allowEmptyFoundation });
        if (foundationSuit && movableCards[0].rank === 1) {
            return moveSolitaireSourceToFoundation(source, foundationSuit, {
                helpText: 'As range automatiquement sur une fondation.'
            });
        }
    }

    const tableauCol = findSolitaireAutoTableauDestination(source);
    if (tableauCol !== null) {
        return moveSolitaireSourceToTableau(source, tableauCol, {
            helpText: movableCards.length > 1
                ? 'Suite de cartes deplacee automatiquement.'
                : 'Carte deplacee automatiquement.'
        });
    }

    if (movableCards.length === 1) {
        const foundationSuit = findSolitaireFoundationTarget(movableCards[0], { allowEmptyFoundation });
        if (foundationSuit) {
            return moveSolitaireSourceToFoundation(source, foundationSuit, {
                helpText: 'Carte rangee automatiquement.'
            });
        }
    }

    return false;
}

function getSolitaireDragSourceElements(source) {
    if (!source) {
        return [];
    }

    if (source.type === 'waste') {
        const element = document.querySelector('#solitaireWaste [data-solitaire-source="waste"]');
        return element ? [element] : [];
    }

    if (source.type === 'foundation') {
        const element = document.querySelector(`#solitaireFoundations [data-solitaire-foundation="${source.suit}"]`);
        return element ? [element] : [];
    }

    if (source.type === 'tableau') {
        return Array.from(document.querySelectorAll(
            `#solitaireTableau [data-solitaire-tableau="${source.col}"]`
        )).slice(source.index);
    }

    return [];
}

function buildSolitaireDragPreview(cards, width, height) {
    const preview = document.createElement('div');
    preview.className = 'solitaire-drag-preview';
    preview.setAttribute('aria-hidden', 'true');
    preview.style.width = `${width}px`;
    preview.style.height = `${height + ((cards.length - 1) * SOLITAIRE_TABLEAU_CARD_OFFSET)}px`;

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `solitaire-drag-card ${getSolitaireCardColor(card.suit)}`;
        cardElement.style.top = `${index * SOLITAIRE_TABLEAU_CARD_OFFSET}px`;
        cardElement.style.width = `${width}px`;
        cardElement.style.minHeight = `${height}px`;
        cardElement.innerHTML = getSolitaireCardFaceMarkup(card);
        preview.appendChild(cardElement);
    });

    return preview;
}

function cleanupSolitaireDragArtifacts() {
    if (!solitaireDragState) {
        return;
    }

    solitaireDragState.sourceElements.forEach((element) => {
        element.classList.remove('is-drag-origin');
    });

    solitaireDragState.dropTargets.forEach((element) => {
        element.classList.remove('is-drop-target');
    });

    solitaireDragState.preview?.remove();
    solitaireDragState = null;
}

function getSolitaireDropCandidateFromPoint(clientX, clientY) {
    const target = document.elementFromPoint(clientX, clientY);

    if (!target) {
        return null;
    }

    const foundation = target.closest('[data-solitaire-foundation]');
    if (foundation) {
        return {
            type: 'foundation',
            suit: foundation.dataset.solitaireFoundation,
            element: foundation
        };
    }

    const tableauCard = target.closest('[data-solitaire-tableau]');
    if (tableauCard) {
        return {
            type: 'tableau',
            col: Number(tableauCard.dataset.solitaireTableau),
            element: tableauCard.closest('[data-solitaire-column]') || tableauCard
        };
    }

    const tableauColumn = target.closest('[data-solitaire-column]');
    if (tableauColumn) {
        return {
            type: 'tableau',
            col: Number(tableauColumn.dataset.solitaireColumn),
            element: tableauColumn
        };
    }

    return null;
}

function refreshSolitaireDragDropTarget(clientX, clientY) {
    if (!solitaireDragState) {
        return;
    }

    solitaireDragState.dropTargets.forEach((element) => {
        element.classList.remove('is-drop-target');
    });
    solitaireDragState.dropTargets = [];

    const candidate = getSolitaireDropCandidateFromPoint(clientX, clientY);
    if (!candidate) {
        solitaireDragState.dropCandidate = null;
        return;
    }

    const source = solitaireDragState.source;
    let isValid = false;

    if (candidate.type === 'foundation') {
        const card = solitaireDragState.cards[0];
        isValid = solitaireDragState.cards.length === 1 && canPlaceSolitaireOnFoundation(card, candidate.suit);
    } else if (candidate.type === 'tableau' && !Number.isNaN(candidate.col)) {
        isValid = !(source.type === 'tableau' && source.col === candidate.col)
            && canPlaceSolitaireOnTableau(solitaireDragState.cards, candidate.col);
    }

    if (!isValid) {
        solitaireDragState.dropCandidate = null;
        return;
    }

    candidate.element?.classList.add('is-drop-target');
    solitaireDragState.dropTargets = candidate.element ? [candidate.element] : [];
    solitaireDragState.dropCandidate = candidate;
}

function updateSolitaireDragPreviewPosition(clientX, clientY) {
    if (!solitaireDragState?.preview) {
        return;
    }

    const x = clientX - solitaireDragState.offsetX;
    const y = clientY - solitaireDragState.offsetY;
    solitaireDragState.preview.style.transform = `translate(${x}px, ${y}px)`;
}

export function beginSolitaireDrag(source, anchorElement, pointer) {
    const cards = getSolitaireMovableCards(source);

    if (!anchorElement || !cards.length) {
        return false;
    }

    cleanupSolitaireDragArtifacts();

    const rect = anchorElement.getBoundingClientRect();
    const sourceElements = getSolitaireDragSourceElements(source);
    const preview = buildSolitaireDragPreview(cards, rect.width, rect.height);
    if (!document.body) {
        return false;
    }

    document.body.appendChild(preview);
    sourceElements.forEach((element) => {
        element.classList.add('is-drag-origin');
    });

    solitaireDragState = {
        source,
        cards,
        sourceElements,
        preview,
        pointerId: pointer.pointerId,
        offsetX: pointer.clientX - rect.left,
        offsetY: pointer.clientY - rect.top,
        startX: pointer.clientX,
        startY: pointer.clientY,
        dropTargets: [],
        dropCandidate: null
    };

    updateSolitaireDragPreviewPosition(pointer.clientX, pointer.clientY);
    refreshSolitaireDragDropTarget(pointer.clientX, pointer.clientY);
    return true;
}

export function updateSolitaireDrag(pointer) {
    if (!solitaireDragState || pointer.pointerId !== solitaireDragState.pointerId) {
        return false;
    }

    updateSolitaireDragPreviewPosition(pointer.clientX, pointer.clientY);
    refreshSolitaireDragDropTarget(pointer.clientX, pointer.clientY);
    return true;
}

export function dropSolitaireDrag(pointer) {
    if (!solitaireDragState || pointer.pointerId !== solitaireDragState.pointerId) {
        return false;
    }

    const { source, dropCandidate } = solitaireDragState;
    cleanupSolitaireDragArtifacts();

    if (!dropCandidate) {
        renderSolitaire();
        return false;
    }

    if (dropCandidate.type === 'foundation') {
        return moveSolitaireSourceToFoundation(source, dropCandidate.suit, {
            helpText: 'Carte glissee vers une fondation.'
        });
    }

    if (dropCandidate.type === 'tableau') {
        return moveSolitaireSourceToTableau(source, dropCandidate.col, {
            helpText: 'Pile glissee vers une nouvelle colonne.'
        });
    }

    renderSolitaire();
    return false;
}

export function cancelSolitaireDrag() {
    if (!solitaireDragState) {
        return;
    }

    cleanupSolitaireDragArtifacts();
    renderSolitaire();
}

export function getSolitaireDragThreshold() {
    return SOLITAIRE_DRAG_OFFSET_THRESHOLD;
}

export function isSolitaireDragging() {
    return Boolean(solitaireDragState);
}

function checkSolitaireWin() {
    const foundationCount = SOLITAIRE_SUITS.reduce((total, suit) => total + solitaireFoundationsState[suit].length, 0);

    if (foundationCount === 52) {
        stopSolitaireTimer();
        setSolitaireHelpMessage('Le pont est range. Toutes les fondations sont completes.');
        revealSolitaireOutcomeMenu(
            'Fondations completes',
            'Les 52 cartes sont rangees sur les fondations. Belle traversee, capitaine.',
            'Cabine rangee'
        );
        return true;
    }

    return false;
}

export function renderSolitaire() {
    const previousRects = captureSolitaireCardRects();
    const { solitaireStock, solitaireWaste, solitaireFoundations, solitaireTableau } = dom();
    updateSolitaireHud();

    if (solitaireStock) {
        solitaireStock.innerHTML = solitaireStockCards.length
            ? '<button type="button" class="solitaire-playing-card-back" data-solitaire-action="draw"><span class="card-back-emblem"></span></button>'
            : '<button type="button" class="solitaire-playing-card-placeholder" data-solitaire-action="recycle">\u21ba</button>';
    }

    if (solitaireWaste) {
        const visibleWasteCards = solitaireWasteCards.slice(-3);
        solitaireWaste.innerHTML = visibleWasteCards.length
            ? visibleWasteCards.map((card, index) => {
                const isTopCard = index === visibleWasteCards.length - 1;
                const stackOffset = (visibleWasteCards.length - 1 - index) * 5;

                return getSolitaireCardButtonMarkup(card, {
                    classes: [
                        isTopCard && solitaireSelectedSource?.type === 'waste' ? 'is-selected' : '',
                        solitaireAnimatedCardIds.has(card.id) ? 'is-animated' : '',
                        solitaireFlippedCardIds.has(card.id) ? 'is-flipped' : '',
                        solitaireFoundationAnimatedCardIds.has(card.id) ? 'is-foundation-flight' : '',
                        !isTopCard ? 'is-waste-underlay' : ''
                    ],
                    style: `top:0; left:${stackOffset}px; z-index:${10 + index};`,
                    attributes: isTopCard ? 'data-solitaire-source="waste"' : 'tabindex="-1" aria-hidden="true"'
                });
            }).join('')
            : '<div class="solitaire-playing-card-placeholder">Defausse</div>';
    }

    if (solitaireFoundations) {
        solitaireFoundations.innerHTML = SOLITAIRE_SUITS.map((suit) => {
            const topCard = solitaireFoundationsState[suit][solitaireFoundationsState[suit].length - 1];
            const isSelected = solitaireSelectedSource?.type === 'foundation' && solitaireSelectedSource.suit === suit;

            return topCard
                ? getSolitaireCardButtonMarkup(topCard, {
                    classes: [isSelected ? 'is-selected' : '', solitaireAnimatedCardIds.has(topCard.id) ? 'is-animated' : '', solitaireFoundationAnimatedCardIds.has(topCard.id) ? 'is-foundation-flight' : ''],
                    attributes: `data-solitaire-foundation="${suit}"`
                })
                : `<button type="button" class="solitaire-playing-card-placeholder foundation-${suit}" data-solitaire-foundation="${suit}">${SOLITAIRE_SUIT_SYMBOLS[suit]}</button>`;
        }).join('');
    }

    if (solitaireTableau) {
        solitaireTableau.innerHTML = solitaireTableauColumns.map((column, colIndex) => `
            <div class="solitaire-column" data-solitaire-column="${colIndex}">
                ${column.length ? column.map((card, cardIndex) => {
                    const isSelectable = card.faceUp;
                    const isSelected = solitaireSelectedSource?.type === 'tableau'
                        && solitaireSelectedSource.col === colIndex
                        && solitaireSelectedSource.index === cardIndex;

                    if (!card.faceUp) {
                        return `
                            <button
                                type="button"
                                class="solitaire-playing-card is-hidden"
                                data-solitaire-card-id="${card.id}"
                                style="top:${cardIndex * SOLITAIRE_TABLEAU_CARD_OFFSET}px"
                            ><span class="card-back-emblem"></span></button>
                        `;
                    }

                    return getSolitaireCardButtonMarkup(card, {
                        classes: [isSelected ? 'is-selected' : '', solitaireAnimatedCardIds.has(card.id) ? 'is-animated' : '', solitaireFlippedCardIds.has(card.id) ? 'is-flipped' : '', solitaireFoundationAnimatedCardIds.has(card.id) ? 'is-foundation-flight' : ''],
                        style: `top:${cardIndex * SOLITAIRE_TABLEAU_CARD_OFFSET}px`,
                        attributes: isSelectable
                            ? `data-solitaire-tableau="${colIndex}" data-solitaire-index="${cardIndex}"`
                            : ''
                    });
                }).join('') : '<button type="button" class="solitaire-playing-card-placeholder solitaire-column-empty" data-solitaire-column-target="true"></button>'}
            </div>
        `).join('');
    }

    animateSolitaireCardLayout(previousRects);
    solitaireAnimatedCardIds = new Set();
    solitaireFlippedCardIds = new Set();
    solitaireFoundationAnimatedCardIds = new Set();
}

export function drawSolitaireCard() {
    closeGameOverModal();

    if (solitaireStockCards.length) {
        const stockRect = document.querySelector('#solitaireStock [data-solitaire-action]')?.getBoundingClientRect() || null;
        const card = solitaireStockCards.pop();
        card.faceUp = true;
        solitaireWasteCards.push(card);
        if (stockRect) {
            stageSolitaireAnimationOrigin(card, stockRect);
        }
        stageSolitaireCardAnimations([card]);
        playSolitaireSound('draw');
        clearSolitaireSelection();
        setSolitaireHelpMessage('Carte piochee. Clique la carte si tu veux la deplacer.');
        renderSolitaire();
        return;
    }

    if (solitaireWasteCards.length) {
        solitaireStockCards = solitaireWasteCards.reverse().map((card) => ({
            ...card,
            faceUp: false
        }));
        solitaireWasteCards = [];
    }

    clearSolitaireSelection();
    setSolitaireHelpMessage('La pioche a ete recyclee.');
    renderSolitaire();
}

export function selectSolitaireSource(source) {
    const movableCards = getSolitaireMovableCards(source);

    if (!movableCards.length) {
        clearSolitaireSelection();
        renderSolitaire();
        return;
    }

    solitaireSelectedSource = source;
    renderSolitaire();
}

export function moveSelectedSolitaireToFoundation(suit) {
    return moveSolitaireSourceToFoundation(solitaireSelectedSource, suit);
}

export function moveSelectedSolitaireToTableau(col) {
    return moveSolitaireSourceToTableau(solitaireSelectedSource, col);
}

export function getSolitaireRulesText() {
    return 'Clique ou glisse une carte pour la deplacer. Sur les colonnes, alterne rouge et noir en descendant. Monte les quatre fondations de l\'As au Roi par couleur. La pioche se recycle quand elle est epuisee.';
}

export function renderSolitaireMenu() {
    const {
        solitaireMenuOverlay,
        solitaireTable,
        solitaireMenuEyebrow,
        solitaireMenuTitle,
        solitaireMenuText,
        solitaireMenuActionButton,
        solitaireMenuRulesButton
    } = dom();

    if (!solitaireMenuOverlay || !solitaireTable) {
        return;
    }

    syncGameMenuOverlayBounds(solitaireMenuOverlay, solitaireTable);
    solitaireMenuOverlay.classList.toggle('hidden', !solitaireMenuVisible);
    solitaireMenuOverlay.classList.toggle('is-closing', solitaireMenuClosing);
    solitaireMenuOverlay.classList.toggle('is-entering', solitaireMenuEntering);
    solitaireTable.classList.toggle('is-menu-open', solitaireMenuVisible);

    if (!solitaireMenuVisible) {
        return;
    }

    const hasResult = Boolean(solitaireMenuResult);

    if (solitaireMenuEyebrow) {
        solitaireMenuEyebrow.textContent = solitaireMenuShowingRules ? 'Regles' : (hasResult ? solitaireMenuResult.eyebrow : 'Cabine du capitaine');
    }

    if (solitaireMenuTitle) {
        solitaireMenuTitle.textContent = solitaireMenuShowingRules ? 'Rappel rapide' : (hasResult ? solitaireMenuResult.title : 'Solitaire');
    }

    if (solitaireMenuText) {
        solitaireMenuText.textContent = solitaireMenuShowingRules
            ? getSolitaireRulesText()
            : (hasResult ? solitaireMenuResult.text : 'Trie les cartes du capitaine dans les quatre fondations en suivant couleurs et valeurs.');
    }

    if (solitaireMenuActionButton) {
        solitaireMenuActionButton.textContent = solitaireMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la donne' : 'Lancer la donne');
    }

    if (solitaireMenuRulesButton) {
        solitaireMenuRulesButton.textContent = 'Regles';
        solitaireMenuRulesButton.hidden = solitaireMenuShowingRules;
    }
}

export function closeSolitaireMenu() {
    solitaireMenuClosing = true;
    renderSolitaireMenu();
    window.setTimeout(() => {
        solitaireMenuClosing = false;
        solitaireMenuVisible = false;
        solitaireMenuShowingRules = false;
        solitaireMenuEntering = false;
        solitaireMenuResult = null;
        renderSolitaireMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealSolitaireOutcomeMenu(title, text, eyebrow) {
    stopSolitaireTimer();
    solitaireMenuVisible = true;
    solitaireMenuResult = { title, text, eyebrow };
    solitaireMenuShowingRules = false;
    solitaireMenuClosing = false;
    solitaireMenuEntering = true;
    setSolitaireHelpMessage(text);
    renderSolitaireMenu();
    window.setTimeout(() => {
        solitaireMenuEntering = false;
        renderSolitaireMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeSolitaire() {
    closeGameOverModal();
    cancelSolitaireDrag();
    resetSolitaireHudState();
    const stockSlotRect = dom().solitaireStock?.getBoundingClientRect() || null;

    const deck = createSolitaireDeck();
    solitaireStockCards = [];
    solitaireWasteCards = [];
    solitaireFoundationsState = { spades: [], hearts: [], clubs: [], diamonds: [] };
    solitaireTableauColumns = Array.from({ length: 7 }, () => []);
    clearSolitaireSelection();

    for (let col = 0; col < 7; col += 1) {
        for (let depth = 0; depth <= col; depth += 1) {
            const card = deck.pop();
            card.faceUp = depth === col;
            solitaireTableauColumns[col].push(card);

            if (stockSlotRect) {
                const dealIndex = ((col * (col + 1)) / 2) + depth;
                stageSolitaireAnimationOriginWithTiming(card, stockSlotRect, {
                    delay: dealIndex * 46,
                    duration: 540
                });
            }
        }
    }

    solitaireStockCards = deck.map((card) => ({ ...card, faceUp: false }));
    solitaireMenuResult = null;
    solitaireMenuShowingRules = false;
    solitaireMenuClosing = false;
    solitaireMenuEntering = false;
    setSolitaireHelpMessage('Place d abord les As sur les fondations, puis les cartes suivantes s y rangeront automatiquement quand c est possible.');
    startSolitaireTimer();
    renderSolitaire();
    renderSolitaireMenu();
}

export function prepareSolitaireMenuState() {
    closeGameOverModal();
    cancelSolitaireDrag();
    resetSolitaireHudState();
    solitaireStockCards = [];
    solitaireWasteCards = [];
    solitaireFoundationsState = { spades: [], hearts: [], clubs: [], diamonds: [] };
    solitaireTableauColumns = Array.from({ length: 7 }, () => []);
    clearSolitaireSelection();
    solitaireMenuResult = null;
    solitaireMenuShowingRules = false;
    solitaireMenuClosing = false;
    solitaireMenuEntering = false;
    setSolitaireHelpMessage('Lance une nouvelle donne pour voir le capitaine distribuer les cartes.');
    renderSolitaire();
    renderSolitaireMenu();
}

export function isSameSolitaireSource(left, right) {
    return areSameSolitaireSource(left, right);
}

export function getSolitaireSelectedSource() {
    return solitaireSelectedSource;
}

export function getSolitaireMenuVisible() {
    return solitaireMenuVisible;
}

export function setSolitaireMenuVisible(value) {
    solitaireMenuVisible = Boolean(value);
}

export function setSolitaireMenuShowingRules(value) {
    solitaireMenuShowingRules = Boolean(value);
}

export function getSolitaireMenuShowingRules() {
    return solitaireMenuShowingRules;
}

export function getSolitaireMenuClosing() {
    return solitaireMenuClosing;
}
