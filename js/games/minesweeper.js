// Game module - Minesweeper (Demineur).
// Extracted from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';
import { formatTenthsTimer } from '../core/utils.js';

export const BOARD_SIZE = 13;
export const TOTAL_MINES = 30;
export const MINESWEEPER_GRID_SIZE_KEY = 'baie-des-naufrages-minesweeper-grid-size';
export const MINESWEEPER_GRID_SIZES = [10, 13, 16];

const MINESWEEPER_MINE_COUNTS = {
    10: 18,
    13: 30,
    16: 45
};

let gameBoard = [];
let currentBoardSize = loadMinesweeperGridSize();
let currentTotalMines = getMinesweeperMineCount(currentBoardSize);
let flagsPlaced = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;
let gameFinished = false;
let minesweeperMenuVisible = true;
let minesweeperMenuShowingRules = false;
let minesweeperMenuClosing = false;
let minesweeperMenuEntering = false;
let minesweeperMenuResult = null;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        minesweeperBoard: $('minesweeperBoard'),
        mineCountDisplay: $('mineCountDisplay'),
        timerDisplay: $('timerDisplay'),
        restartGameButton: $('restartGameButton'),
        minesweeperHelpText: $('minesweeperHelpText'),
        minesweeperTable: $('minesweeperTable'),
        minesweeperMenuOverlay: $('minesweeperMenuOverlay'),
        minesweeperMenuEyebrow: $('minesweeperMenuEyebrow'),
        minesweeperMenuTitle: $('minesweeperMenuTitle'),
        minesweeperMenuText: $('minesweeperMenuText'),
        minesweeperMenuActionButton: $('minesweeperMenuActionButton'),
        minesweeperMenuRulesButton: $('minesweeperMenuRulesButton'),
        minesweeperGridSizePicker: $('minesweeperGridSizePicker'),
        minesweeperGridSizeButtons: document.querySelectorAll('[data-minesweeper-grid-size]')
    };
}

function normalizeMinesweeperGridSize(value) {
    const numericValue = Number.parseInt(value, 10);
    return MINESWEEPER_GRID_SIZES.includes(numericValue) ? numericValue : BOARD_SIZE;
}

function getMinesweeperMineCount(size) {
    return MINESWEEPER_MINE_COUNTS[normalizeMinesweeperGridSize(size)] || TOTAL_MINES;
}

function loadMinesweeperGridSize() {
    if (typeof window === 'undefined') return BOARD_SIZE;
    return normalizeMinesweeperGridSize(window.localStorage.getItem(MINESWEEPER_GRID_SIZE_KEY));
}

function persistMinesweeperGridSize() {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(MINESWEEPER_GRID_SIZE_KEY, String(currentBoardSize));
}

function syncCurrentMinesweeperPreset() {
    currentTotalMines = getMinesweeperMineCount(currentBoardSize);
}

function renderMinesweeperGridSizeButtons() {
    const { minesweeperGridSizePicker, minesweeperGridSizeButtons } = dom();

    if (minesweeperGridSizePicker) {
        minesweeperGridSizePicker.hidden = minesweeperMenuShowingRules;
    }

    minesweeperGridSizeButtons.forEach((button) => {
        const buttonSize = normalizeMinesweeperGridSize(button.dataset.minesweeperGridSize);
        const isActive = buttonSize === currentBoardSize;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

function createEmptyBoard() {
    return Array.from({ length: currentBoardSize }, (_, row) => (
        Array.from({ length: currentBoardSize }, (_, col) => ({
            row,
            col,
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
            justRevealed: false
        }))
    ));
}

function clearRevealHighlights(shouldRender = false) {
    gameBoard.forEach((row) => {
        row.forEach((cell) => {
            cell.justRevealed = false;
        });
    });
    if (shouldRender) renderBoard();
}

function getCell(row, col) {
    return gameBoard[row]?.[col] || null;
}

function getNeighbors(row, col) {
    const neighbors = [];
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
            if (rowOffset === 0 && colOffset === 0) continue;
            const neighbor = getCell(row + rowOffset, col + colOffset);
            if (neighbor) neighbors.push(neighbor);
        }
    }
    return neighbors;
}

function getSafeZone(firstRow, firstCol) {
    const safeCells = new Set();
    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
            const row = firstRow + rowOffset;
            const col = firstCol + colOffset;
            const cell = getCell(row, col);
            if (cell) safeCells.add(`${row}-${col}`);
        }
    }
    return safeCells;
}

function placeMines(firstRow, firstCol) {
    let minesPlaced = 0;
    const safeZone = getSafeZone(firstRow, firstCol);
    while (minesPlaced < currentTotalMines) {
        const row = Math.floor(Math.random() * currentBoardSize);
        const col = Math.floor(Math.random() * currentBoardSize);
        const cell = getCell(row, col);
        if (!cell || cell.isMine || safeZone.has(`${row}-${col}`)) continue;
        cell.isMine = true;
        minesPlaced += 1;
    }
    gameBoard.forEach((row) => {
        row.forEach((cell) => {
            cell.adjacentMines = cell.isMine ? 0 : getNeighbors(cell.row, cell.col).filter((neighbor) => neighbor.isMine).length;
        });
    });
}

export function updateCounters() {
    const { mineCountDisplay, timerDisplay } = dom();
    if (mineCountDisplay) mineCountDisplay.textContent = String(currentTotalMines - flagsPlaced);
    if (timerDisplay) timerDisplay.textContent = formatTenthsTimer(timer);
}

export function getMinesweeperRulesText() {
    return 'Clique sur une case pour r\u00e9v\u00e9ler le r\u00e9cif. Les chiffres indiquent combien de mines touchent la case. Clique droit pour poser un drapeau et ouvre toutes les cases s\u00fbres pour gagner.';
}

export function renderMinesweeperMenu() {
    const {
        minesweeperMenuOverlay,
        minesweeperTable,
        minesweeperMenuEyebrow,
        minesweeperMenuTitle,
        minesweeperMenuText,
        minesweeperMenuActionButton,
        minesweeperMenuRulesButton
    } = dom();
    if (!minesweeperMenuOverlay || !minesweeperTable) return;

    syncGameMenuOverlayBounds(minesweeperMenuOverlay, minesweeperTable);
    minesweeperMenuOverlay.classList.toggle('hidden', !minesweeperMenuVisible);
    minesweeperMenuOverlay.classList.toggle('is-closing', minesweeperMenuClosing);
    minesweeperMenuOverlay.classList.toggle('is-entering', minesweeperMenuEntering);
    minesweeperTable.classList.toggle('is-menu-open', minesweeperMenuVisible);

    if (!minesweeperMenuVisible) return;

    const hasResult = Boolean(minesweeperMenuResult);
    if (minesweeperMenuEyebrow) {
        minesweeperMenuEyebrow.textContent = minesweeperMenuShowingRules ? 'R\u00e8gles' : (hasResult ? minesweeperMenuResult.eyebrow : 'Champ de mines du r\u00e9cif');
    }
    if (minesweeperMenuTitle) {
        minesweeperMenuTitle.textContent = minesweeperMenuShowingRules ? 'Rappel rapide' : (hasResult ? minesweeperMenuResult.title : 'D\u00e9mineur');
    }
    if (minesweeperMenuText) {
        minesweeperMenuText.textContent = minesweeperMenuShowingRules
            ? getMinesweeperRulesText()
            : (hasResult ? minesweeperMenuResult.text : 'Rep\u00e8re les zones s\u00fbres du r\u00e9cif, pose tes drapeaux et traverse sans toucher une mine.');
    }
    if (minesweeperMenuActionButton) {
        minesweeperMenuActionButton.textContent = minesweeperMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
    }
    if (minesweeperMenuRulesButton) {
        minesweeperMenuRulesButton.textContent = 'R\u00e8gles';
        minesweeperMenuRulesButton.hidden = minesweeperMenuShowingRules;
    }

    renderMinesweeperGridSizeButtons();
}

export function closeMinesweeperMenu() {
    minesweeperMenuClosing = true;
    renderMinesweeperMenu();
    window.setTimeout(() => {
        minesweeperMenuClosing = false;
        minesweeperMenuVisible = false;
        minesweeperMenuShowingRules = false;
        minesweeperMenuEntering = false;
        minesweeperMenuResult = null;
        renderMinesweeperMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealMinesweeperOutcomeMenu(title, text, eyebrow) {
    minesweeperMenuVisible = true;
    minesweeperMenuResult = { title, text, eyebrow };
    minesweeperMenuShowingRules = false;
    minesweeperMenuClosing = false;
    minesweeperMenuEntering = true;

    const { minesweeperHelpText } = dom();
    if (minesweeperHelpText) minesweeperHelpText.textContent = text;

    renderMinesweeperMenu();
    window.setTimeout(() => {
        minesweeperMenuEntering = false;
        renderMinesweeperMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

function updateFace(label) {
    const { restartGameButton } = dom();
    if (restartGameButton) restartGameButton.textContent = label;
}

function updateRestartButtonLabel() {
    updateFace(gameStarted ? 'Changer de cap' : 'Aller en mer');
}

function startTimer() {
    if (timerInterval) return;
    timerInterval = window.setInterval(() => {
        timer += 100;
        const { timerDisplay } = dom();
        if (timerDisplay) timerDisplay.textContent = formatTenthsTimer(timer);
    }, 100);
}

function stopTimer() {
    if (timerInterval) {
        window.clearInterval(timerInterval);
        timerInterval = null;
    }
}

export function initializeGame() {
    syncCurrentMinesweeperPreset();
    stopTimer();
    gameBoard = createEmptyBoard();
    flagsPlaced = 0;
    timer = 0;
    gameStarted = false;
    gameFinished = false;
    const { minesweeperBoard, minesweeperHelpText } = dom();
    minesweeperBoard?.classList.remove('is-shaking');
    minesweeperBoard?.classList.remove('is-rumbling');
    closeGameOverModal();
    minesweeperMenuResult = null;
    minesweeperMenuShowingRules = false;
    minesweeperMenuClosing = false;
    minesweeperMenuEntering = false;
    if (minesweeperHelpText) minesweeperHelpText.textContent = 'Clic gauche pour r\u00e9v\u00e9ler. Clic droit pour poser un drapeau.';
    updateRestartButtonLabel();
    updateCounters();
    renderBoard();
    renderMinesweeperMenu();
}

function revealAllMines(explodedCell = null) {
    gameBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell.isMine) cell.isRevealed = true;
        });
    });
    if (explodedCell) explodedCell.isExploded = true;
}

function revealAdjacentEmptyCells(startCell) {
    const queue = [startCell];
    const revealedCells = [];
    while (queue.length) {
        const currentCell = queue.shift();
        if (!currentCell || currentCell.isRevealed || currentCell.isFlagged) continue;
        currentCell.isRevealed = true;
        currentCell.justRevealed = true;
        revealedCells.push(currentCell);
        if (currentCell.adjacentMines !== 0) continue;
        getNeighbors(currentCell.row, currentCell.col).forEach((neighbor) => {
            if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) queue.push(neighbor);
        });
    }
    return revealedCells;
}

function checkWin() {
    const hasWon = gameBoard.every((row) => row.every((cell) => cell.isMine || cell.isRevealed));
    if (!hasWon) return;
    gameFinished = true;
    stopTimer();
    updateRestartButtonLabel();
    gameBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell.isMine && !cell.isFlagged) cell.isFlagged = true;
        });
    });
    flagsPlaced = currentTotalMines;
    updateCounters();
    renderBoard();
    revealMinesweeperOutcomeMenu(
        'R\u00e9cif travers\u00e9',
        `Toutes les zones s\u00fbres ont \u00e9t\u00e9 d\u00e9gag\u00e9es en ${formatTenthsTimer(timer)}.`,
        'Travers\u00e9e r\u00e9ussie'
    );
}

export function toggleFlag(row, col) {
    if (gameFinished) return;
    const cell = getCell(row, col);
    if (!cell || cell.isRevealed) return;
    if (!cell.isFlagged && flagsPlaced >= currentTotalMines) return;
    clearRevealHighlights();
    cell.isFlagged = !cell.isFlagged;
    flagsPlaced += cell.isFlagged ? 1 : -1;
    updateCounters();
    renderBoard();
}

export function revealCell(row, col) {
    const cell = getCell(row, col);
    let newlyRevealedCells = [];
    if (!cell || cell.isRevealed || cell.isFlagged || gameFinished) return;

    clearRevealHighlights();

    if (!gameStarted) {
        placeMines(row, col);
        gameStarted = true;
        startTimer();
        updateRestartButtonLabel();
    }

    const { minesweeperBoard } = dom();

    if (cell.isMine) {
        cell.isRevealed = true;
        gameFinished = true;
        stopTimer();
        revealAllMines(cell);
        updateRestartButtonLabel();
        if (minesweeperBoard) {
            minesweeperBoard.classList.remove('is-rumbling');
            minesweeperBoard.classList.remove('is-shaking');
            void minesweeperBoard.offsetWidth;
            minesweeperBoard.classList.add('is-shaking');
        }
        renderBoard();
        revealMinesweeperOutcomeMenu(
            'Mine d\u00e9clench\u00e9e',
            `La travers\u00e9e s'arr\u00eate apr\u00e8s ${formatTenthsTimer(timer)}. Repars avec un nouveau trac\u00e9.`,
            'R\u00e9cif en alerte'
        );
        return;
    }

    if (cell.adjacentMines === 0) {
        newlyRevealedCells = revealAdjacentEmptyCells(cell);
    } else {
        cell.isRevealed = true;
        cell.justRevealed = true;
        newlyRevealedCells = [cell];
    }

    if (newlyRevealedCells.length >= 6 && minesweeperBoard) {
        minesweeperBoard.classList.remove('is-rumbling');
        void minesweeperBoard.offsetWidth;
        minesweeperBoard.classList.add('is-rumbling');
    }

    renderBoard();
    window.setTimeout(() => {
        clearRevealHighlights();
    }, 120);
    checkWin();
}

export function renderBoard() {
    const { minesweeperBoard } = dom();
    if (!minesweeperBoard) return;

    minesweeperBoard.style.setProperty('--minesweeper-size', String(currentBoardSize));
    minesweeperBoard.innerHTML = gameBoard.map((row) => row.map((cell) => {
        const classes = ['minesweeper-cell'];
        let label = '';
        let particles = '';

        if (cell.isRevealed) {
            classes.push('is-revealed');
            if (cell.justRevealed) classes.push('is-newly-revealed');
            if (cell.isMine) {
                classes.push('is-mine');
                label = '&#9760;';
            } else if (cell.adjacentMines > 0) {
                classes.push(`minesweeper-cell-value-${cell.adjacentMines}`);
                label = String(cell.adjacentMines);
            }
            if (cell.justRevealed && !cell.isMine) {
                particles = `
                    <span class="reveal-particle reveal-particle-a" aria-hidden="true"></span>
                    <span class="reveal-particle reveal-particle-b" aria-hidden="true"></span>
                    <span class="reveal-particle reveal-particle-c" aria-hidden="true"></span>
                    <span class="reveal-particle reveal-particle-d" aria-hidden="true"></span>
                `;
            }
        } else if (cell.isFlagged) {
            classes.push('is-flagged');
            label = '&#127988;&#8205;&#9760;&#65039;';
        } else if ((cell.row + cell.col) % 2 === 1) {
            classes.push('is-pattern-alt');
        }

        if (cell.isExploded) classes.push('is-exploded');

        return `
            <button
                type="button"
                class="${classes.join(' ')}"
                data-row="${cell.row}"
                data-col="${cell.col}"
                aria-label="Case ${cell.row + 1}-${cell.col + 1}"
            >${particles}<span class="minesweeper-cell-label">${label}</span></button>
        `;
    }).join('')).join('');
}

export function setMinesweeperGridSize(nextSize) {
    const normalizedSize = normalizeMinesweeperGridSize(nextSize);
    if (normalizedSize === currentBoardSize) return;

    currentBoardSize = normalizedSize;
    syncCurrentMinesweeperPreset();
    persistMinesweeperGridSize();
    initializeGame();
}

export function setMinesweeperMenuVisible(v) { minesweeperMenuVisible = Boolean(v); }
export function setMinesweeperMenuShowingRules(v) { minesweeperMenuShowingRules = Boolean(v); }
export function getMinesweeperMenuVisible() { return minesweeperMenuVisible; }
export function getMinesweeperGameStarted() { return gameStarted; }
export function getMinesweeperGameFinished() { return gameFinished; }
export function getMinesweeperMenuShowingRules() { return minesweeperMenuShowingRules; }
export function getMinesweeperMenuClosing() { return minesweeperMenuClosing; }
export function isMinesweeperInitialized() { return gameBoard.length > 0; }
export function getMinesweeperGridSize() { return currentBoardSize; }
