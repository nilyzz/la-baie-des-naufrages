// Game module — Solitaire (Cabine du capitaine).
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

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        solitaireStock: $('solitaireStock'),
        solitaireWaste: $('solitaireWaste'),
        solitaireFoundations: $('solitaireFoundations'),
        solitaireTableau: $('solitaireTableau'),
        solitaireTable: $('solitaireTable'),
        solitaireStockDisplay: $('solitaireStockDisplay'),
        solitaireFoundationsDisplay: $('solitaireFoundationsDisplay'),
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

function getSolitaireCardLabel(card) {
    const rankMap = {
        1: 'A',
        11: 'V',
        12: 'D',
        13: 'R'
    };

    return `${rankMap[card.rank] || card.rank}${SOLITAIRE_SUIT_SYMBOLS[card.suit]}`;
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
    const { solitaireStockDisplay, solitaireFoundationsDisplay } = dom();
    const foundationCount = SOLITAIRE_SUITS.reduce((total, suit) => total + solitaireFoundationsState[suit].length, 0);
    if (solitaireStockDisplay) solitaireStockDisplay.textContent = String(solitaireStockCards.length);
    if (solitaireFoundationsDisplay) solitaireFoundationsDisplay.textContent = `${foundationCount} / 52`;
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
        }
    }
}

function canPlaceSolitaireOnFoundation(card, suit) {
    const pile = solitaireFoundationsState[suit];
    const expectedRank = pile.length + 1;
    return card.suit === suit && card.rank === expectedRank;
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

export function getSolitaireFoundationCount(suit) {
    return solitaireFoundationsState[suit]?.length ?? 0;
}

export function clearSolitaireSelection() {
    solitaireSelectedSource = null;
}

function checkSolitaireWin() {
    const foundationCount = SOLITAIRE_SUITS.reduce((total, suit) => total + solitaireFoundationsState[suit].length, 0);

    if (foundationCount === 52) {
        const { solitaireHelpText } = dom();
        if (solitaireHelpText) solitaireHelpText.textContent = 'Le pont est rangé. Toutes les fondations sont complètes.';
        revealSolitaireOutcomeMenu(
            'Fondations complètes',
            'Les 52 cartes sont rangées sur les fondations. Belle traversée, capitaine.',
            'Cabine rangée'
        );
    }
}

export function renderSolitaire() {
    const { solitaireStock, solitaireWaste, solitaireFoundations, solitaireTableau } = dom();
    updateSolitaireHud();

    if (solitaireStock) solitaireStock.innerHTML = solitaireStockCards.length
        ? '<button type="button" class="solitaire-playing-card-back" data-solitaire-action="draw"><span class="card-back-emblem"></span></button>'
        : '<button type="button" class="solitaire-playing-card-placeholder" data-solitaire-action="recycle">â†º</button>';

    const wasteTopCard = solitaireWasteCards[solitaireWasteCards.length - 1];
    if (solitaireWaste) solitaireWaste.innerHTML = wasteTopCard
        ? `<button type="button" class="solitaire-playing-card${solitaireSelectedSource?.type === 'waste' ? ' is-selected' : ''} ${getSolitaireCardColor(wasteTopCard.suit)}" data-solitaire-source="waste">${getSolitaireCardLabel(wasteTopCard)}</button>`
        : '<div class="solitaire-playing-card-placeholder">Défausse</div>';

    if (solitaireFoundations) solitaireFoundations.innerHTML = SOLITAIRE_SUITS.map((suit) => {
        const topCard = solitaireFoundationsState[suit][solitaireFoundationsState[suit].length - 1];
        const isSelected = solitaireSelectedSource?.type === 'foundation' && solitaireSelectedSource.suit === suit;

        return topCard
            ? `<button type="button" class="solitaire-playing-card${isSelected ? ' is-selected' : ''} ${getSolitaireCardColor(topCard.suit)}" data-solitaire-foundation="${suit}">${getSolitaireCardLabel(topCard)}</button>`
            : `<button type="button" class="solitaire-playing-card-placeholder foundation-${suit}" data-solitaire-foundation="${suit}">${SOLITAIRE_SUIT_SYMBOLS[suit]}</button>`;
    }).join('');

    if (solitaireTableau) solitaireTableau.innerHTML = solitaireTableauColumns.map((column, colIndex) => `
        <div class="solitaire-column" data-solitaire-column="${colIndex}">
            ${column.length ? column.map((card, cardIndex) => {
                const isSelectable = card.faceUp;
                const isSelected = solitaireSelectedSource?.type === 'tableau'
                    && solitaireSelectedSource.col === colIndex
                    && solitaireSelectedSource.index === cardIndex;

                return `
                    <button
                        type="button"
                        class="solitaire-playing-card${card.faceUp ? ` ${getSolitaireCardColor(card.suit)}` : ' is-hidden'}${isSelected ? ' is-selected' : ''}"
                        style="top:${cardIndex * 28}px"
                        ${isSelectable ? `data-solitaire-tableau="${colIndex}" data-solitaire-index="${cardIndex}"` : ''}
                    >${card.faceUp ? getSolitaireCardLabel(card) : '<span class="card-back-emblem"></span>'}</button>
                `;
            }).join('') : '<button type="button" class="solitaire-playing-card-placeholder solitaire-column-empty" data-solitaire-column-target="true"></button>'}
        </div>
    `).join('');
}

export function drawSolitaireCard() {
    closeGameOverModal();

    if (solitaireStockCards.length) {
        const card = solitaireStockCards.pop();
        card.faceUp = true;
        solitaireWasteCards.push(card);
    } else if (solitaireWasteCards.length) {
        solitaireStockCards = solitaireWasteCards.reverse().map((card) => ({
            ...card,
            faceUp: false
        }));
        solitaireWasteCards = [];
    }

    clearSolitaireSelection();
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
    const movableCards = getSolitaireMovableCards(solitaireSelectedSource);

    if (movableCards.length !== 1 || !canPlaceSolitaireOnFoundation(movableCards[0], suit)) {
        return false;
    }

    removeSolitaireSourceCards(solitaireSelectedSource, 1);
    solitaireFoundationsState[suit].push(movableCards[0]);
    clearSolitaireSelection();
    const { solitaireHelpText } = dom();
    if (solitaireHelpText) solitaireHelpText.textContent = 'Carte placée sur une fondation.';
    renderSolitaire();
    checkSolitaireWin();
    return true;
}

export function moveSelectedSolitaireToTableau(col) {
    const movableCards = getSolitaireMovableCards(solitaireSelectedSource);

    if (!movableCards.length || !canPlaceSolitaireOnTableau(movableCards, col)) {
        return false;
    }

    removeSolitaireSourceCards(solitaireSelectedSource, movableCards.length);
    solitaireTableauColumns[col].push(...movableCards);
    clearSolitaireSelection();
    const { solitaireHelpText } = dom();
    if (solitaireHelpText) solitaireHelpText.textContent = 'Pile déplacée sur une colonne du pont.';
    renderSolitaire();
    checkSolitaireWin();
    return true;
}

export function getSolitaireRulesText() {
    return 'Clique une carte pour la s\u00e9lectionner puis clique sa destination. Sur les colonnes, alterne couleurs rouge/noir en descendant. Monte les quatre fondations de l\u2019As au Roi par couleur. La pioche se recycle quand elle est \u00e9puis\u00e9e.';
}

export function renderSolitaireMenu() {
    const { solitaireMenuOverlay, solitaireTable, solitaireMenuEyebrow, solitaireMenuTitle, solitaireMenuText, solitaireMenuActionButton, solitaireMenuRulesButton } = dom();
    if (!solitaireMenuOverlay || !solitaireTable) return;
    syncGameMenuOverlayBounds(solitaireMenuOverlay, solitaireTable);
    solitaireMenuOverlay.classList.toggle('hidden', !solitaireMenuVisible);
    solitaireMenuOverlay.classList.toggle('is-closing', solitaireMenuClosing);
    solitaireMenuOverlay.classList.toggle('is-entering', solitaireMenuEntering);
    solitaireTable.classList.toggle('is-menu-open', solitaireMenuVisible);
    if (!solitaireMenuVisible) return;
    const hasResult = Boolean(solitaireMenuResult);
    if (solitaireMenuEyebrow) solitaireMenuEyebrow.textContent = solitaireMenuShowingRules ? 'R\u00e8gles' : (hasResult ? solitaireMenuResult.eyebrow : 'Cabine du capitaine');
    if (solitaireMenuTitle) solitaireMenuTitle.textContent = solitaireMenuShowingRules ? 'Rappel rapide' : (hasResult ? solitaireMenuResult.title : 'Solitaire');
    if (solitaireMenuText) solitaireMenuText.textContent = solitaireMenuShowingRules ? getSolitaireRulesText() : (hasResult ? solitaireMenuResult.text : 'Trie les cartes du capitaine dans les quatre fondations en suivant couleurs et valeurs.');
    if (solitaireMenuActionButton) solitaireMenuActionButton.textContent = solitaireMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la donne' : 'Lancer la donne');
    if (solitaireMenuRulesButton) { solitaireMenuRulesButton.textContent = 'R\u00e8gles'; solitaireMenuRulesButton.hidden = solitaireMenuShowingRules; }
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
    solitaireMenuVisible = true;
    solitaireMenuResult = { title, text, eyebrow };
    solitaireMenuShowingRules = false;
    solitaireMenuClosing = false;
    solitaireMenuEntering = true;
    const { solitaireHelpText } = dom();
    if (solitaireHelpText) solitaireHelpText.textContent = text;
    renderSolitaireMenu();
    window.setTimeout(() => { solitaireMenuEntering = false; renderSolitaireMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeSolitaire() {
    closeGameOverModal();
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
        }
    }

    solitaireStockCards = deck.map((card) => ({ ...card, faceUp: false }));
    const { solitaireHelpText } = dom();
    if (solitaireHelpText) solitaireHelpText.textContent = 'Clique une carte pour la sélectionner puis clique sa destination. La pioche se recycle quand elle est vide.';
    solitaireMenuResult = null;
    solitaireMenuShowingRules = false;
    solitaireMenuClosing = false;
    solitaireMenuEntering = false;
    renderSolitaire();
    renderSolitaireMenu();
}

export function getSolitaireSelectedSource() { return solitaireSelectedSource; }
export function getSolitaireMenuVisible() { return solitaireMenuVisible; }
export function setSolitaireMenuVisible(v) { solitaireMenuVisible = Boolean(v); }
export function setSolitaireMenuShowingRules(v) { solitaireMenuShowingRules = Boolean(v); }
export function getSolitaireMenuShowingRules() { return solitaireMenuShowingRules; }
export function getSolitaireMenuClosing() { return solitaireMenuClosing; }
