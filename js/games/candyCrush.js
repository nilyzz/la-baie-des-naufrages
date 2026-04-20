// Game module — Coin Crush (CandyCrush).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';
import { shuffleArray } from '../core/utils.js';

export const CANDY_CRUSH_SIZE = 8;
export const CANDY_CRUSH_TARGET_SCORE = 4000;
export const CANDY_CRUSH_START_MOVES = 35;
export const CANDY_CRUSH_TYPES = ['coral', 'lagoon', 'sun', 'mint', 'shell'];
export const CANDY_CRUSH_COLORS = {
    coral: 'linear-gradient(180deg, #fb7185, #be123c)',
    lagoon: 'linear-gradient(180deg, #38bdf8, #1d4ed8)',
    sun: 'linear-gradient(180deg, #facc15, #d97706)',
    mint: 'linear-gradient(180deg, #34d399, #0f766e)',
    shell: 'linear-gradient(180deg, #c084fc, #7c3aed)'
};

let candyCrushGrid = [];
let candyCrushSelectedCell = null;
let candyCrushScore = 0;
let candyCrushMoves = 18;
let candyCrushAnimating = false;
let candyCrushPointerStart = null;
let candyCrushMenuVisible = true;
let candyCrushMenuShowingRules = false;
let candyCrushMenuClosing = false;
let candyCrushMenuEntering = false;
let candyCrushMenuResult = null;

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        candyCrushBoard: $('candyCrushBoard'),
        candyCrushTable: $('candyCrushTable'),
        candyCrushScoreDisplay: $('candyCrushScoreDisplay'),
        candyCrushMovesDisplay: $('candyCrushMovesDisplay'),
        candyCrushHelpText: $('candyCrushHelpText'),
        candyCrushRestartButton: $('candyCrushRestartButton'),
        candyCrushMenuOverlay: $('candyCrushMenuOverlay'),
        candyCrushMenuEyebrow: $('candyCrushMenuEyebrow'),
        candyCrushMenuTitle: $('candyCrushMenuTitle'),
        candyCrushMenuText: $('candyCrushMenuText'),
        candyCrushMenuActionButton: $('candyCrushMenuActionButton'),
        candyCrushMenuRulesButton: $('candyCrushMenuRulesButton')
    };
}

function waitMs(duration) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, duration);
    });
}

function getRandomCandyType() {
    return CANDY_CRUSH_TYPES[Math.floor(Math.random() * CANDY_CRUSH_TYPES.length)];
}

export function updateCandyCrushHud() {
    const { candyCrushScoreDisplay, candyCrushMovesDisplay } = dom();
    if (candyCrushScoreDisplay) candyCrushScoreDisplay.textContent = String(candyCrushScore);
    if (candyCrushMovesDisplay) candyCrushMovesDisplay.textContent = String(candyCrushMoves);
}

export function renderCandyCrush() {
    const { candyCrushBoard } = dom();
    updateCandyCrushHud();
    if (!candyCrushBoard) return;
    candyCrushBoard.innerHTML = candyCrushGrid.map((row, rowIndex) => row.map((cell, colIndex) => `
        <button
            type="button"
            class="candycrush-cell${candyCrushSelectedCell?.row === rowIndex && candyCrushSelectedCell?.col === colIndex ? ' is-selected' : ''}"
            data-candy-row="${rowIndex}"
            data-candy-col="${colIndex}"
            data-candy-type="${cell}"
            style="--candy-fill: ${CANDY_CRUSH_COLORS[cell]}"
        ></button>
    `).join('')).join('');
}

async function animateCandyCrushFall(changedKeys = new Set()) {
    const { candyCrushBoard } = dom();
    changedKeys.forEach((key) => {
        const [row, col] = key.split('-');
        const element = candyCrushBoard?.querySelector(`[data-candy-row="${row}"][data-candy-col="${col}"]`);
        element?.classList.add('is-falling');
    });

    await waitMs(220);
}

export function findCandyCrushMatches() {
    const matches = new Set();

    for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
        let streak = 1;

        for (let colIndex = 1; colIndex <= CANDY_CRUSH_SIZE; colIndex += 1) {
            const current = candyCrushGrid[rowIndex][colIndex];
            const previous = candyCrushGrid[rowIndex][colIndex - 1];

            if (current && current === previous) {
                streak += 1;
            } else {
                if (streak >= 3) {
                    for (let offset = 1; offset <= streak; offset += 1) {
                        matches.add(`${rowIndex}-${colIndex - offset}`);
                    }
                }
                streak = 1;
            }
        }
    }

    for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
        let streak = 1;

        for (let rowIndex = 1; rowIndex <= CANDY_CRUSH_SIZE; rowIndex += 1) {
            const current = candyCrushGrid[rowIndex]?.[colIndex];
            const previous = candyCrushGrid[rowIndex - 1]?.[colIndex];

            if (current && current === previous) {
                streak += 1;
            } else {
                if (streak >= 3) {
                    for (let offset = 1; offset <= streak; offset += 1) {
                        matches.add(`${rowIndex - offset}-${colIndex}`);
                    }
                }
                streak = 1;
            }
        }
    }

    return matches;
}

function collapseCandyCrushGrid() {
    const previousGrid = candyCrushGrid.map((row) => [...row]);
    const changedKeys = new Set();

    for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
        const compacted = [];

        for (let rowIndex = CANDY_CRUSH_SIZE - 1; rowIndex >= 0; rowIndex -= 1) {
            const cell = candyCrushGrid[rowIndex][colIndex];
            if (cell) {
                compacted.push(cell);
            }
        }

        for (let rowIndex = CANDY_CRUSH_SIZE - 1; rowIndex >= 0; rowIndex -= 1) {
            candyCrushGrid[rowIndex][colIndex] = compacted[CANDY_CRUSH_SIZE - 1 - rowIndex] || null;
        }

        for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
            if (!candyCrushGrid[rowIndex][colIndex]) {
                candyCrushGrid[rowIndex][colIndex] = getRandomCandyType();
            }
        }
    }

    for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
        for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
            if (candyCrushGrid[rowIndex][colIndex] !== previousGrid[rowIndex][colIndex]) {
                changedKeys.add(`${rowIndex}-${colIndex}`);
            }
        }
    }

    return changedKeys;
}

function hasCandyCrushPossibleMove() {
    for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
        for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
            const directions = [
                { row: 0, col: 1 },
                { row: 1, col: 0 }
            ];

            for (const direction of directions) {
                const nextRow = rowIndex + direction.row;
                const nextCol = colIndex + direction.col;

                if (nextRow >= CANDY_CRUSH_SIZE || nextCol >= CANDY_CRUSH_SIZE) {
                    continue;
                }

                swapCandyCells({ row: rowIndex, col: colIndex }, { row: nextRow, col: nextCol });
                const hasMatch = findCandyCrushMatches().size > 0;
                swapCandyCells({ row: rowIndex, col: colIndex }, { row: nextRow, col: nextCol });

                if (hasMatch) {
                    return true;
                }
            }
        }
    }

    return false;
}

function shuffleCandyCrushBoard() {
    const candies = shuffleArray(candyCrushGrid.flat());
    let cursor = 0;

    for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
        for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
            candyCrushGrid[rowIndex][colIndex] = candies[cursor];
            cursor += 1;
        }
    }
}

function ensureCandyCrushPlayable() {
    let attempts = 0;

    while ((!hasCandyCrushPossibleMove() || findCandyCrushMatches().size > 0) && attempts < 20) {
        shuffleCandyCrushBoard();
        attempts += 1;
    }
}

export function resolveCandyCrushBoard() {
    let chainCount = 0;

    while (true) {
        const matches = findCandyCrushMatches();
        if (!matches.size) {
            break;
        }

        chainCount += 1;
        candyCrushScore += matches.size * (10 * chainCount);
        matches.forEach((key) => {
            const [row, col] = key.split('-').map(Number);
            candyCrushGrid[row][col] = null;
        });
        collapseCandyCrushGrid();
    }
}

export function getCandyCrushRulesText() {
    return 'Fais glisser une pi\u00e8ce vers une case voisine pour former un alignement de 3 tr\u00e9sors identiques ou plus. Chaque alignement casse la ligne et fait tomber la cale. Atteins l\u2019objectif de score avant d\u2019\u00e9puiser tes coups.';
}

export function renderCandyCrushMenu() {
    const { candyCrushMenuOverlay, candyCrushTable, candyCrushMenuEyebrow, candyCrushMenuTitle, candyCrushMenuText, candyCrushMenuActionButton, candyCrushMenuRulesButton } = dom();
    if (!candyCrushMenuOverlay || !candyCrushTable) {
        return;
    }

    syncGameMenuOverlayBounds(candyCrushMenuOverlay, candyCrushTable);
    candyCrushMenuOverlay.classList.toggle('hidden', !candyCrushMenuVisible);
    candyCrushMenuOverlay.classList.toggle('is-closing', candyCrushMenuClosing);
    candyCrushMenuOverlay.classList.toggle('is-entering', candyCrushMenuEntering);
    candyCrushTable.classList.toggle('is-menu-open', candyCrushMenuVisible);

    if (!candyCrushMenuVisible) {
        return;
    }

    const hasResult = Boolean(candyCrushMenuResult);

    if (candyCrushMenuEyebrow) {
        candyCrushMenuEyebrow.textContent = candyCrushMenuShowingRules
            ? 'R\u00e8gles'
            : (hasResult ? candyCrushMenuResult.eyebrow : 'Cale \u00e0 confiseries marines');
    }

    if (candyCrushMenuTitle) {
        candyCrushMenuTitle.textContent = candyCrushMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult ? candyCrushMenuResult.title : 'Coin Crush');
    }

    if (candyCrushMenuText) {
        candyCrushMenuText.textContent = candyCrushMenuShowingRules
            ? getCandyCrushRulesText()
            : (hasResult
                ? candyCrushMenuResult.text
                : 'Glisse les tr\u00e9sors marins pour former des alignements de 3 ou plus avant d\u2019\u00e9puiser ta r\u00e9serve de coups.');
    }

    if (candyCrushMenuActionButton) {
        candyCrushMenuActionButton.textContent = candyCrushMenuShowingRules
            ? 'Retour'
            : (hasResult ? 'Relancer la cale' : 'Lancer la cale');
    }

    if (candyCrushMenuRulesButton) {
        candyCrushMenuRulesButton.textContent = 'R\u00e8gles';
        candyCrushMenuRulesButton.hidden = candyCrushMenuShowingRules;
    }
}

export function closeCandyCrushMenu() {
    candyCrushMenuClosing = true;
    renderCandyCrushMenu();
    window.setTimeout(() => {
        candyCrushMenuClosing = false;
        candyCrushMenuVisible = false;
        candyCrushMenuShowingRules = false;
        candyCrushMenuEntering = false;
        candyCrushMenuResult = null;
        renderCandyCrushMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealCandyCrushOutcomeMenu(title, text, eyebrow) {
    candyCrushMenuVisible = true;
    candyCrushMenuResult = { title, text, eyebrow };
    candyCrushMenuShowingRules = false;
    candyCrushMenuClosing = false;
    candyCrushMenuEntering = true;

    const { candyCrushHelpText } = dom();
    if (candyCrushHelpText) {
        candyCrushHelpText.textContent = text;
    }

    renderCandyCrushMenu();
    window.setTimeout(() => {
        candyCrushMenuEntering = false;
        renderCandyCrushMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeCandyCrush() {
    closeGameOverModal();
    candyCrushGrid = Array.from({ length: CANDY_CRUSH_SIZE }, () => Array(CANDY_CRUSH_SIZE).fill(null));

    for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
        for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
            let nextCandy = getRandomCandyType();
            while (
                (colIndex >= 2 && nextCandy === candyCrushGrid[rowIndex][colIndex - 1] && nextCandy === candyCrushGrid[rowIndex][colIndex - 2])
                || (rowIndex >= 2 && nextCandy === candyCrushGrid[rowIndex - 1][colIndex] && nextCandy === candyCrushGrid[rowIndex - 2][colIndex])
            ) {
                nextCandy = getRandomCandyType();
            }
            candyCrushGrid[rowIndex][colIndex] = nextCandy;
        }
    }

    candyCrushSelectedCell = null;
    candyCrushScore = 0;
    candyCrushMoves = CANDY_CRUSH_START_MOVES;
    candyCrushAnimating = false;
    candyCrushPointerStart = null;
    candyCrushMenuResult = null;
    candyCrushMenuShowingRules = false;
    candyCrushMenuClosing = false;
    candyCrushMenuEntering = false;
    ensureCandyCrushPlayable();
    const { candyCrushHelpText } = dom();
    if (candyCrushHelpText) candyCrushHelpText.textContent = 'Fais glisser une pi\u00e8ce vers une voisine pour former des alignements de 3 tr\u00e9sors ou plus.';
    renderCandyCrush();
    renderCandyCrushMenu();
}

function areCandyCellsAdjacent(firstCell, secondCell) {
    return Math.abs(firstCell.row - secondCell.row) + Math.abs(firstCell.col - secondCell.col) === 1;
}

function swapCandyCells(firstCell, secondCell) {
    const temp = candyCrushGrid[firstCell.row][firstCell.col];
    candyCrushGrid[firstCell.row][firstCell.col] = candyCrushGrid[secondCell.row][secondCell.col];
    candyCrushGrid[secondCell.row][secondCell.col] = temp;
}

async function animateCandyCrushSwap(firstCell, secondCell, revert = false) {
    const { candyCrushBoard } = dom();
    const firstElement = candyCrushBoard?.querySelector(`[data-candy-row="${firstCell.row}"][data-candy-col="${firstCell.col}"]`);
    const secondElement = candyCrushBoard?.querySelector(`[data-candy-row="${secondCell.row}"][data-candy-col="${secondCell.col}"]`);
    if (!firstElement || !secondElement) {
        return;
    }

    const firstRect = firstElement.getBoundingClientRect();
    const secondRect = secondElement.getBoundingClientRect();
    const deltaX = secondRect.left - firstRect.left;
    const deltaY = secondRect.top - firstRect.top;

    firstElement.style.transition = 'transform 180ms ease';
    secondElement.style.transition = 'transform 180ms ease';
    firstElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    secondElement.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
    if (revert) {
        firstElement.classList.add('is-bouncing');
        secondElement.classList.add('is-bouncing');
    }

    await waitMs(190);
}

async function animateCandyCrushMatches(matches) {
    const { candyCrushBoard } = dom();
    matches.forEach((key) => {
        const [row, col] = key.split('-');
        const element = candyCrushBoard?.querySelector(`[data-candy-row="${row}"][data-candy-col="${col}"]`);
        if (element) {
            element.classList.add('is-crushing');
            element.insertAdjacentHTML('beforeend', `
                <span class="candy-hit-particle candy-hit-particle-a" aria-hidden="true"></span>
                <span class="candy-hit-particle candy-hit-particle-b" aria-hidden="true"></span>
                <span class="candy-hit-particle candy-hit-particle-c" aria-hidden="true"></span>
                <span class="candy-hit-particle candy-hit-particle-d" aria-hidden="true"></span>
                <span class="candy-hit-particle candy-hit-particle-e" aria-hidden="true"></span>
            `);
        }
    });

    await waitMs(320);
}

async function resolveCandyCrushBoardAnimated() {
    let chainCount = 0;

    while (true) {
        const matches = findCandyCrushMatches();
        if (!matches.size) {
            break;
        }

        chainCount += 1;
        await animateCandyCrushMatches(matches);
        candyCrushScore += matches.size * (10 * chainCount);
        matches.forEach((key) => {
            const [row, col] = key.split('-').map(Number);
            candyCrushGrid[row][col] = null;
        });
        const changedKeys = collapseCandyCrushGrid();
        renderCandyCrush();
        await animateCandyCrushFall(changedKeys);
    }
}

export async function tryCandyCrushSwap(firstCell, secondCell) {
    const { candyCrushHelpText } = dom();
    if (candyCrushAnimating || candyCrushMoves <= 0) {
        return;
    }

    if (!areCandyCellsAdjacent(firstCell, secondCell)) {
        candyCrushSelectedCell = secondCell;
        renderCandyCrush();
        return;
    }

    candyCrushAnimating = true;
    candyCrushSelectedCell = null;
    await animateCandyCrushSwap(firstCell, secondCell);
    swapCandyCells(firstCell, secondCell);
    renderCandyCrush();
    const matches = findCandyCrushMatches();

    if (!matches.size) {
        await animateCandyCrushSwap(secondCell, firstCell, true);
        swapCandyCells(firstCell, secondCell);
        renderCandyCrush();
        if (candyCrushHelpText) candyCrushHelpText.textContent = 'Aucun alignement. Essaie un autre glissement.';
        candyCrushAnimating = false;
        return;
    }

    candyCrushMoves -= 1;
    if (candyCrushHelpText) candyCrushHelpText.textContent = 'Belle combinaison. Les tresors s effondrent dans la cale.';
    renderCandyCrush();
    await resolveCandyCrushBoardAnimated();
    ensureCandyCrushPlayable();
    renderCandyCrush();
    candyCrushAnimating = false;

    if (candyCrushScore >= CANDY_CRUSH_TARGET_SCORE) {
        revealCandyCrushOutcomeMenu(
            'Cale vidée',
            `Objectif atteint avec ${candyCrushScore} points. Coups restants : ${candyCrushMoves}.`,
            'Trésors rassemblés'
        );
        return;
    }

    if (candyCrushMoves <= 0) {
        revealCandyCrushOutcomeMenu(
            'Réserve épuisée',
            `Plus de coups disponibles. Score final : ${candyCrushScore}.`,
            'Cale vide'
        );
    }
}

export function getCandyCrushSelectedCell() { return candyCrushSelectedCell; }
export function setCandyCrushSelectedCell(v) { candyCrushSelectedCell = v; }
export function getCandyCrushPointerStart() { return candyCrushPointerStart; }
export function setCandyCrushPointerStart(v) { candyCrushPointerStart = v; }
export function getCandyCrushAnimating() { return candyCrushAnimating; }
export function getCandyCrushMenuVisible() { return candyCrushMenuVisible; }
export function setCandyCrushMenuVisible(v) { candyCrushMenuVisible = Boolean(v); }
export function setCandyCrushMenuShowingRules(v) { candyCrushMenuShowingRules = Boolean(v); }
export function getCandyCrushMenuShowingRules() { return candyCrushMenuShowingRules; }
export function getCandyCrushMenuClosing() { return candyCrushMenuClosing; }
