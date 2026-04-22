// Game module — Baietris (Tetris).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const TETRIS_ROWS = 18;
export const TETRIS_COLS = 10;
export const TETRIS_TICK_MS = 420;
const TETRIS_MAX_BOARD_WIDTH = 320;
export const TETRIS_PIECES = {
    I: { color: '#38bdf8', shape: [[1, 1, 1, 1]] },
    O: { color: '#facc15', shape: [[1, 1], [1, 1]] },
    T: { color: '#a855f7', shape: [[0, 1, 0], [1, 1, 1]] },
    L: { color: '#fb923c', shape: [[1, 0], [1, 0], [1, 1]] },
    J: { color: '#3b82f6', shape: [[0, 1], [0, 1], [1, 1]] },
    S: { color: '#34d399', shape: [[0, 1, 1], [1, 1, 0]] },
    Z: { color: '#f87171', shape: [[1, 1, 0], [0, 1, 1]] }
};

let tetrisGrid = [];
let tetrisPiece = null;
let tetrisScore = 0;
let tetrisLines = 0;
let tetrisRunning = false;
let tetrisInterval = null;
let tetrisMenuVisible = true;
let tetrisMenuShowingRules = false;
let tetrisMenuClosing = false;
let tetrisMenuEntering = false;
let tetrisMenuResult = null;
let tetrisLayoutFrame = null;

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        tetrisGame: $('tetrisGame'),
        tetrisBoard: $('tetrisBoard'),
        tetrisScoreDisplay: $('tetrisScoreDisplay'),
        tetrisLinesDisplay: $('tetrisLinesDisplay'),
        tetrisStartButton: $('tetrisStartButton'),
        tetrisHelpText: $('tetrisHelpText'),
        tetrisTable: $('tetrisTable'),
        tetrisMenuOverlay: $('tetrisMenuOverlay'),
        tetrisMenuEyebrow: $('tetrisMenuEyebrow'),
        tetrisMenuTitle: $('tetrisMenuTitle'),
        tetrisMenuText: $('tetrisMenuText'),
        tetrisMenuActionButton: $('tetrisMenuActionButton'),
        tetrisMenuRulesButton: $('tetrisMenuRulesButton')
    };
}

function getTetrisStyleValue(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function syncTetrisLayout() {
    const { tetrisGame, tetrisTable, tetrisHelpText } = dom();
    const tetrisTopbar = tetrisGame?.querySelector('.tetris-topbar');
    if (!tetrisGame || !tetrisTable || !tetrisTopbar) return;

    if (!tetrisGame.classList.contains('games-panel-active') || tetrisGame.clientHeight <= 0) {
        tetrisTable.style.removeProperty('width');
        return;
    }

    const cardStyles = window.getComputedStyle(tetrisGame);
    const topbarStyles = window.getComputedStyle(tetrisTopbar);
    const helpStyles = tetrisHelpText ? window.getComputedStyle(tetrisHelpText) : null;
    const availableWidth = tetrisGame.clientWidth
        - getTetrisStyleValue(cardStyles.paddingLeft)
        - getTetrisStyleValue(cardStyles.paddingRight);
    const availableHeight = tetrisGame.clientHeight
        - getTetrisStyleValue(cardStyles.paddingTop)
        - getTetrisStyleValue(cardStyles.paddingBottom)
        - tetrisTopbar.offsetHeight
        - getTetrisStyleValue(topbarStyles.marginBottom)
        - (tetrisHelpText
            ? tetrisHelpText.offsetHeight + getTetrisStyleValue(helpStyles?.marginBottom)
            : 0)
        - 6;

    if (availableWidth <= 0 || availableHeight <= 0) {
        tetrisTable.style.removeProperty('width');
        return;
    }

    const nextWidth = Math.min(
        TETRIS_MAX_BOARD_WIDTH,
        availableWidth,
        Math.floor((availableHeight * TETRIS_COLS) / TETRIS_ROWS)
    );

    if (nextWidth > 0) {
        tetrisTable.style.width = `${nextWidth}px`;
    }
}

function scheduleTetrisLayoutSync() {
    if (tetrisLayoutFrame !== null) {
        window.cancelAnimationFrame(tetrisLayoutFrame);
    }

    tetrisLayoutFrame = window.requestAnimationFrame(() => {
        tetrisLayoutFrame = null;
        syncTetrisLayout();
        const { tetrisMenuOverlay, tetrisTable } = dom();
        if (tetrisMenuOverlay && tetrisTable) {
            syncGameMenuOverlayBounds(tetrisMenuOverlay, tetrisTable);
        }
    });
}

function createEmptyTetrisGrid() {
    return Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill(''));
}

export function updateTetrisHud() {
    const { tetrisScoreDisplay, tetrisLinesDisplay, tetrisStartButton } = dom();
    if (tetrisScoreDisplay) tetrisScoreDisplay.textContent = String(tetrisScore);
    if (tetrisLinesDisplay) tetrisLinesDisplay.textContent = String(tetrisLines);
    if (tetrisStartButton) tetrisStartButton.textContent = tetrisRunning ? 'Cale en cours' : 'Lancer la cale';
}

function createRandomTetrisPiece() {
    const types = Object.keys(TETRIS_PIECES);
    const type = types[Math.floor(Math.random() * types.length)];
    const piece = TETRIS_PIECES[type];
    return {
        type,
        color: piece.color,
        shape: piece.shape.map((row) => [...row]),
        row: 0,
        col: Math.floor((TETRIS_COLS - piece.shape[0].length) / 2)
    };
}

function rotateTetrisShape(shape) {
    return shape[0].map((_, colIndex) => shape.map((row) => row[colIndex]).reverse());
}

function canPlaceTetrisPiece(piece, nextRow = piece.row, nextCol = piece.col, nextShape = piece.shape) {
    return nextShape.every((shapeRow, rowIndex) => shapeRow.every((value, colIndex) => {
        if (!value) return true;
        const boardRow = nextRow + rowIndex;
        const boardCol = nextCol + colIndex;
        return boardCol >= 0 && boardCol < TETRIS_COLS && boardRow >= 0 && boardRow < TETRIS_ROWS && !tetrisGrid[boardRow][boardCol];
    }));
}

export function renderTetris() {
    const { tetrisBoard } = dom();
    if (!tetrisBoard) return;
    const displayGrid = tetrisGrid.map((row) => [...row]);
    if (tetrisPiece) {
        tetrisPiece.shape.forEach((shapeRow, rowIndex) => {
            shapeRow.forEach((value, colIndex) => {
                if (!value) return;
                const boardRow = tetrisPiece.row + rowIndex;
                const boardCol = tetrisPiece.col + colIndex;
                if (boardRow >= 0 && boardRow < TETRIS_ROWS && boardCol >= 0 && boardCol < TETRIS_COLS) {
                    displayGrid[boardRow][boardCol] = tetrisPiece.color;
                }
            });
        });
    }
    tetrisBoard.innerHTML = displayGrid.map((row) => row.map((cell) => `
        <div class="tetris-cell${cell ? ' is-filled' : ''}"${cell ? ` style="--tetris-color:${cell}"` : ''}></div>
    `).join('')).join('');
    updateTetrisHud();
}

export function stopTetris() {
    if (tetrisInterval) {
        window.clearInterval(tetrisInterval);
        tetrisInterval = null;
    }
    tetrisRunning = false;
    updateTetrisHud();
}

function clearTetrisLines() {
    let cleared = 0;
    tetrisGrid = tetrisGrid.filter((row) => {
        const complete = row.every(Boolean);
        if (complete) cleared += 1;
        return !complete;
    });
    while (tetrisGrid.length < TETRIS_ROWS) {
        tetrisGrid.unshift(Array(TETRIS_COLS).fill(''));
    }
    if (cleared) {
        tetrisLines += cleared;
        tetrisScore += [0, 100, 260, 460, 700][cleared] || (cleared * 200);
        const { tetrisHelpText } = dom();
        if (tetrisHelpText) {
            tetrisHelpText.textContent = cleared > 1
                ? `Belle manœuvre. ${cleared} lignes nettoyées dans la cale.`
                : 'Une ligne libérée dans la cale.';
        }
    }
}

function spawnTetrisPiece() {
    tetrisPiece = createRandomTetrisPiece();
    if (!canPlaceTetrisPiece(tetrisPiece)) {
        stopTetris();
        tetrisPiece = null;
        const { tetrisHelpText } = dom();
        if (tetrisHelpText) tetrisHelpText.textContent = 'La cale est pleine. Relance une traversée.';
        revealTetrisOutcomeMenu(
            'Cale pleine',
            `La cargaison a dépassé le pont. Score final : ${tetrisScore}. Lignes nettoyées : ${tetrisLines}.`,
            'Fin de cargaison'
        );
        renderTetris();
    }
}

function lockTetrisPiece() {
    tetrisPiece.shape.forEach((shapeRow, rowIndex) => {
        shapeRow.forEach((value, colIndex) => {
            if (!value) return;
            const boardRow = tetrisPiece.row + rowIndex;
            const boardCol = tetrisPiece.col + colIndex;
            if (boardRow >= 0 && boardRow < TETRIS_ROWS && boardCol >= 0 && boardCol < TETRIS_COLS) {
                tetrisGrid[boardRow][boardCol] = tetrisPiece.color;
            }
        });
    });
    clearTetrisLines();
    spawnTetrisPiece();
}

export function dropTetrisStep() {
    if (!tetrisRunning || !tetrisPiece) return;
    if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row + 1, tetrisPiece.col)) {
        tetrisPiece.row += 1;
        renderTetris();
        return;
    }
    lockTetrisPiece();
    renderTetris();
}

export function moveTetrisHorizontally(offset) {
    if (!tetrisRunning || !tetrisPiece) return;
    if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col + offset)) {
        tetrisPiece.col += offset;
        renderTetris();
    }
}

export function rotateTetrisPiece() {
    if (!tetrisRunning || !tetrisPiece) return;
    const rotatedShape = rotateTetrisShape(tetrisPiece.shape);
    if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col, rotatedShape)) {
        tetrisPiece.shape = rotatedShape;
        renderTetris();
        return;
    }
    if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col - 1, rotatedShape)) {
        tetrisPiece.col -= 1;
        tetrisPiece.shape = rotatedShape;
        renderTetris();
        return;
    }
    if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col + 1, rotatedShape)) {
        tetrisPiece.col += 1;
        tetrisPiece.shape = rotatedShape;
        renderTetris();
    }
}

export function hardDropTetrisPiece() {
    if (!tetrisRunning || !tetrisPiece) return;
    while (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row + 1, tetrisPiece.col)) {
        tetrisPiece.row += 1;
    }
    tetrisScore += 18;
    lockTetrisPiece();
    renderTetris();
}

export function getTetrisRulesText() {
    return 'D\u00e9place la caisse qui tombe avec les fl\u00e8ches ou ZQSD. Haut ou Z pour la pivoter, bas ou S pour acc\u00e9l\u00e9rer sa descente, Espace pour la faire chuter d\u2019un coup. Compl\u00e8te une ligne enti\u00e8re pour la nettoyer. Si la pile touche le pont, la cale est pleine.';
}

export function renderTetrisMenu() {
    const { tetrisMenuOverlay, tetrisTable, tetrisMenuEyebrow, tetrisMenuTitle, tetrisMenuText, tetrisMenuActionButton, tetrisMenuRulesButton } = dom();
    if (!tetrisMenuOverlay || !tetrisTable) return;
    syncTetrisLayout();
    syncGameMenuOverlayBounds(tetrisMenuOverlay, tetrisTable);
    tetrisMenuOverlay.classList.toggle('hidden', !tetrisMenuVisible);
    tetrisMenuOverlay.classList.toggle('is-closing', tetrisMenuClosing);
    tetrisMenuOverlay.classList.toggle('is-entering', tetrisMenuEntering);
    tetrisTable.classList.toggle('is-menu-open', tetrisMenuVisible);
    if (!tetrisMenuVisible) return;
    const hasResult = Boolean(tetrisMenuResult);
    if (tetrisMenuEyebrow) tetrisMenuEyebrow.textContent = tetrisMenuShowingRules ? 'R\u00e8gles' : (hasResult ? tetrisMenuResult.eyebrow : 'Cale de cargaison');
    if (tetrisMenuTitle) tetrisMenuTitle.textContent = tetrisMenuShowingRules ? 'Rappel rapide' : (hasResult ? tetrisMenuResult.title : 'Baietris');
    if (tetrisMenuText) tetrisMenuText.textContent = tetrisMenuShowingRules ? getTetrisRulesText() : (hasResult ? tetrisMenuResult.text : 'Empile les caisses dans la cale du navire sans laisser la pile atteindre le pont.');
    if (tetrisMenuActionButton) tetrisMenuActionButton.textContent = tetrisMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la cale' : 'Lancer la cale');
    if (tetrisMenuRulesButton) { tetrisMenuRulesButton.textContent = 'R\u00e8gles'; tetrisMenuRulesButton.hidden = tetrisMenuShowingRules; }
}

export function closeTetrisMenu() {
    tetrisMenuClosing = true;
    renderTetrisMenu();
    window.setTimeout(() => {
        tetrisMenuClosing = false;
        tetrisMenuVisible = false;
        tetrisMenuShowingRules = false;
        tetrisMenuEntering = false;
        tetrisMenuResult = null;
        renderTetrisMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealTetrisOutcomeMenu(title, text, eyebrow) {
    tetrisMenuVisible = true;
    tetrisMenuResult = { title, text, eyebrow };
    tetrisMenuShowingRules = false;
    tetrisMenuClosing = false;
    tetrisMenuEntering = true;
    const { tetrisHelpText } = dom();
    if (tetrisHelpText) tetrisHelpText.textContent = text;
    renderTetrisMenu();
    window.setTimeout(() => {
        tetrisMenuEntering = false;
        renderTetrisMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeTetris() {
    closeGameOverModal();
    stopTetris();
    tetrisGrid = createEmptyTetrisGrid();
    tetrisPiece = createRandomTetrisPiece();
    tetrisScore = 0;
    tetrisLines = 0;
    tetrisMenuResult = null;
    tetrisMenuShowingRules = false;
    tetrisMenuClosing = false;
    tetrisMenuEntering = false;
    const { tetrisHelpText } = dom();
    if (tetrisHelpText) tetrisHelpText.textContent = 'Empile les caisses. Fl\u00e8ches ou ZQSD pour bouger, haut ou Z pour pivoter, espace pour tomber.';
    renderTetris();
    renderTetrisMenu();
    scheduleTetrisLayoutSync();
}

export function startTetris() {
    closeGameOverModal();
    if (tetrisRunning) return;
    if (!tetrisPiece) initializeTetris();
    tetrisRunning = true;
    updateTetrisHud();
    tetrisInterval = window.setInterval(dropTetrisStep, TETRIS_TICK_MS);
}

export function setTetrisMenuVisible(v) { tetrisMenuVisible = Boolean(v); }
export function setTetrisMenuShowingRules(v) { tetrisMenuShowingRules = Boolean(v); }
export function getTetrisMenuVisible() { return tetrisMenuVisible; }
export function getTetrisRunning() { return tetrisRunning; }
export function getTetrisMenuShowingRules() { return tetrisMenuShowingRules; }
export function getTetrisMenuClosing() { return tetrisMenuClosing; }

window.addEventListener('resize', scheduleTetrisLayoutSync);
