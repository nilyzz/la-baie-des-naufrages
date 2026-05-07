// Game module — Baietris (Tetris).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const TETRIS_BEST_KEY = 'baie-des-naufrages-tetris-best';
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

let tetrisBestScore = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(TETRIS_BEST_KEY)) : 0) || 0;
let tetrisGrid = [];
let tetrisPiece = null;
let tetrisNextQueue = [];
let tetrisScore = 0;
let tetrisLines = 0;
let tetrisRunning = false;
let tetrisRafId = null;
let tetrisNextTick = 0;
let tetrisMenuVisible = true;
let tetrisMenuShowingRules = false;
let tetrisMenuClosing = false;
let tetrisMenuEntering = false;
let tetrisMenuResult = null;
let tetrisLayoutFrame = null;
let tetrisRenderedQueueSignature = '';
let tetrisBoardSpawnTimeout = null;
let tetrisBoardClearTimeout = null;
let tetrisHudPulseTimeout = null;
let tetrisClearingRows = [];
let tetrisClearParticles = [];
let tetrisResolvingClear = false;

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        tetrisGame: $('tetrisGame'),
        tetrisStage: $('tetrisStage'),
        tetrisBoard: $('tetrisBoard'),
        tetrisNextQueue: $('tetrisNextQueue'),
        tetrisScoreDisplay: $('tetrisScoreDisplay'),
        tetrisLinesDisplay: $('tetrisLinesDisplay'),
        tetrisBestScoreDisplay: $('tetrisBestScoreDisplay'),
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

function restartTetrisAnimationClass(element, className) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
}

function triggerTetrisBoardAnimation(className, timeoutMs) {
    const { tetrisBoard } = dom();
    if (!tetrisBoard) return;
    const timeoutKey = className === 'is-line-clearing' ? 'clear' : 'spawn';
    if (timeoutKey === 'clear' && tetrisBoardClearTimeout) {
        window.clearTimeout(tetrisBoardClearTimeout);
        tetrisBoardClearTimeout = null;
    }
    if (timeoutKey === 'spawn' && tetrisBoardSpawnTimeout) {
        window.clearTimeout(tetrisBoardSpawnTimeout);
        tetrisBoardSpawnTimeout = null;
    }
    restartTetrisAnimationClass(tetrisBoard, className);
    const timeoutId = window.setTimeout(() => {
        tetrisBoard.classList.remove(className);
        if (timeoutKey === 'clear') {
            tetrisBoardClearTimeout = null;
        } else {
            tetrisBoardSpawnTimeout = null;
        }
    }, timeoutMs);
    if (timeoutKey === 'clear') {
        tetrisBoardClearTimeout = timeoutId;
    } else {
        tetrisBoardSpawnTimeout = timeoutId;
    }
}

function triggerTetrisHudPulse() {
    const { tetrisScoreDisplay, tetrisLinesDisplay } = dom();
    restartTetrisAnimationClass(tetrisScoreDisplay, 'is-updating');
    restartTetrisAnimationClass(tetrisLinesDisplay, 'is-updating');
    if (tetrisHudPulseTimeout) {
        window.clearTimeout(tetrisHudPulseTimeout);
    }
    tetrisHudPulseTimeout = window.setTimeout(() => {
        tetrisScoreDisplay?.classList.remove('is-updating');
        tetrisLinesDisplay?.classList.remove('is-updating');
        tetrisHudPulseTimeout = null;
    }, 420);
}

function buildTetrisClearParticles(rows) {
    const particles = [];
    rows.forEach((row) => {
        for (let index = 0; index < 8; index += 1) {
            particles.push({
                row,
                left: 8 + (index * 11.5),
                driftX: (index - 3.5) * 7,
                driftY: -24 - ((index % 3) * 10),
                delay: index * 18
            });
        }
    });
    return particles;
}

function syncTetrisLayout() {
    const { tetrisGame, tetrisTable, tetrisHelpText } = dom();
    const tetrisTopbar = tetrisGame?.querySelector('.tetris-topbar');
    if (!tetrisGame || !tetrisTable || !tetrisTopbar) return;

    if (!tetrisGame.classList.contains('games-panel-active') || tetrisGame.clientHeight <= 0) {
        tetrisTable.style.removeProperty('width');
        tetrisGame.style.removeProperty('--tetris-table-width');
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
        tetrisGame.style.removeProperty('--tetris-table-width');
        return;
    }

    const nextWidth = Math.min(
        TETRIS_MAX_BOARD_WIDTH,
        availableWidth,
        Math.floor((availableHeight * TETRIS_COLS) / TETRIS_ROWS)
    );

    if (nextWidth > 0) {
        tetrisTable.style.width = `${nextWidth}px`;
        tetrisGame.style.setProperty('--tetris-table-width', `${nextWidth}px`);
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

function createRandomTetrisType() {
    const types = Object.keys(TETRIS_PIECES);
    return types[Math.floor(Math.random() * types.length)];
}

export function updateTetrisHud() {
    const { tetrisScoreDisplay, tetrisLinesDisplay, tetrisBestScoreDisplay, tetrisStartButton } = dom();
    if (tetrisScoreDisplay) tetrisScoreDisplay.textContent = String(tetrisScore);
    if (tetrisLinesDisplay) tetrisLinesDisplay.textContent = String(tetrisLines);
    if (tetrisBestScoreDisplay) tetrisBestScoreDisplay.textContent = String(tetrisBestScore);
    if (tetrisStartButton) tetrisStartButton.textContent = tetrisRunning ? 'Cale en cours' : 'Lancer la cale';
}

function createTetrisPiece(type) {
    const piece = TETRIS_PIECES[type];
    return {
        type,
        color: piece.color,
        shape: piece.shape.map((row) => [...row]),
        row: 0,
        col: Math.floor((TETRIS_COLS - piece.shape[0].length) / 2)
    };
}

function fillTetrisQueue() {
    while (tetrisNextQueue.length < 3) {
        tetrisNextQueue.push(createRandomTetrisType());
    }
}

function renderTetrisNextQueue() {
    const { tetrisNextQueue: tetrisNextQueueElement } = dom();
    if (!tetrisNextQueueElement) return;

    const labels = ['1re', '2e', '3e'];
    const previewTypes = tetrisRunning ? tetrisNextQueue.slice(0, 3) : [null, null, null];
    const nextSignature = `${tetrisRunning ? 'running' : 'idle'}:${previewTypes.map((type) => type || '-').join('|')}`;
    if (nextSignature === tetrisRenderedQueueSignature) {
        return;
    }
    tetrisRenderedQueueSignature = nextSignature;

    tetrisNextQueueElement.innerHTML = previewTypes.map((type, index) => {
        const piece = type ? TETRIS_PIECES[type] : null;
        const previewGrid = Array.from({ length: 4 }, () => Array(4).fill(''));

        if (piece) {
            const rowOffset = Math.floor((4 - piece.shape.length) / 2);
            const colOffset = Math.floor((4 - piece.shape[0].length) / 2);

            piece.shape.forEach((shapeRow, rowIndex) => {
                shapeRow.forEach((value, colIndex) => {
                    if (!value) return;
                    previewGrid[rowOffset + rowIndex][colOffset + colIndex] = piece.color;
                });
            });
        }

        return `
            <div class="tetris-next-item${tetrisRunning && index === 0 ? ' is-incoming' : ''}">
                <span class="tetris-next-label">${labels[index] || `${index + 1}e`}</span>
                <div class="tetris-next-preview" aria-hidden="true">
                    ${previewGrid.map((row) => row.map((cell) => `
                        <div class="tetris-next-cell${cell ? ' is-filled' : ''}"${cell ? ` style="--tetris-color:${cell}"` : ''}></div>
                    `).join('')).join('')}
                </div>
            </div>
        `;
    }).join('');
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
    tetrisBoard.classList.toggle('is-live', tetrisRunning);
    const displayGrid = tetrisGrid.map((row) => row.map((cell) => cell ? { color: cell, active: false } : null));
    if (tetrisPiece && tetrisRunning) {
        tetrisPiece.shape.forEach((shapeRow, rowIndex) => {
            shapeRow.forEach((value, colIndex) => {
                if (!value) return;
                const boardRow = tetrisPiece.row + rowIndex;
                const boardCol = tetrisPiece.col + colIndex;
                if (boardRow >= 0 && boardRow < TETRIS_ROWS && boardCol >= 0 && boardCol < TETRIS_COLS) {
                    displayGrid[boardRow][boardCol] = { color: tetrisPiece.color, active: true };
                }
            });
        });
    }
    tetrisBoard.innerHTML = displayGrid.map((row, rowIndex) => row.map((cell) => `
        <div class="tetris-cell${cell ? ` is-filled${cell.active ? ' is-active-piece' : ''}` : ''}${tetrisClearingRows.includes(rowIndex) ? ' is-clearing-row' : ''}"${cell ? ` style="--tetris-color:${cell.color}"` : ''}></div>
    `).join('')).join('') + tetrisClearParticles.map((particle) => `
        <span
            class="tetris-clear-particle"
            style="--tetris-particle-left:${particle.left}%;--tetris-particle-top:${((particle.row + 0.5) / TETRIS_ROWS) * 100}%;--tetris-particle-drift-x:${particle.driftX}px;--tetris-particle-drift-y:${particle.driftY}px;animation-delay:${particle.delay}ms;"
            aria-hidden="true"
        ></span>
    `).join('');
    renderTetrisNextQueue();
    updateTetrisHud();
}

export function stopTetris() {
    if (tetrisRafId) {
        window.cancelAnimationFrame(tetrisRafId);
        tetrisRafId = null;
    }
    tetrisRunning = false;
    updateTetrisHud();
}

function tetrisLoop(timestamp) {
    if (!tetrisRunning) return;
    if (timestamp >= tetrisNextTick) {
        tetrisNextTick = timestamp + TETRIS_TICK_MS;
        dropTetrisStep();
    }
    tetrisRafId = window.requestAnimationFrame(tetrisLoop);
}

function clearTetrisLines() {
    const completedRows = [];
    tetrisGrid.forEach((row, rowIndex) => {
        if (row.every(Boolean)) {
            completedRows.push(rowIndex);
        }
    });
    if (!completedRows.length) {
        return false;
    }
    tetrisResolvingClear = true;
    tetrisClearingRows = completedRows;
    tetrisClearParticles = buildTetrisClearParticles(completedRows);
    tetrisLines += completedRows.length;
    tetrisScore += [0, 100, 260, 460, 700][completedRows.length] || (completedRows.length * 200);
    triggerTetrisBoardAnimation('is-line-clearing', 520);
    triggerTetrisHudPulse();
    const { tetrisHelpText } = dom();
    if (tetrisHelpText) {
        tetrisHelpText.textContent = completedRows.length > 1
            ? `Belle manœuvre. ${completedRows.length} lignes nettoyées dans la cale.`
            : 'Une ligne libérée dans la cale.';
    }
    renderTetris();
    window.setTimeout(() => {
        tetrisGrid = tetrisGrid.filter((_, rowIndex) => !completedRows.includes(rowIndex));
        while (tetrisGrid.length < TETRIS_ROWS) {
            tetrisGrid.unshift(Array(TETRIS_COLS).fill(''));
        }
        tetrisClearingRows = [];
        tetrisClearParticles = [];
        tetrisResolvingClear = false;
        spawnTetrisPiece();
        renderTetris();
    }, 340);
    return true;
}

function spawnTetrisPiece() {
    fillTetrisQueue();
    const nextType = tetrisNextQueue.shift() || createRandomTetrisType();
    tetrisPiece = createTetrisPiece(nextType);
    fillTetrisQueue();
    if (tetrisRunning) {
        triggerTetrisBoardAnimation('is-piece-spawning', 420);
    }
    if (!canPlaceTetrisPiece(tetrisPiece)) {
        stopTetris();
        tetrisPiece = null;
        if (tetrisScore > tetrisBestScore) {
            tetrisBestScore = tetrisScore;
            if (typeof window !== 'undefined') window.localStorage.setItem(TETRIS_BEST_KEY, String(tetrisBestScore));
        }
        updateTetrisHud();
        const { tetrisHelpText } = dom();
        if (tetrisHelpText) tetrisHelpText.textContent = 'La cale est pleine. Relance une traversée.';
        revealTetrisOutcomeMenu(
            'Cale pleine',
            `La cargaison a dépassé le pont. Score : ${tetrisScore}. Record : ${tetrisBestScore}. Lignes : ${tetrisLines}.`,
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
    if (clearTetrisLines()) {
        return;
    }
    spawnTetrisPiece();
}

export function dropTetrisStep() {
    if (!tetrisRunning || !tetrisPiece || tetrisResolvingClear) return;
    if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row + 1, tetrisPiece.col)) {
        tetrisPiece.row += 1;
        renderTetris();
        return;
    }
    lockTetrisPiece();
    renderTetris();
}

export function moveTetrisHorizontally(offset) {
    if (!tetrisRunning || !tetrisPiece || tetrisResolvingClear) return;
    if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col + offset)) {
        tetrisPiece.col += offset;
        renderTetris();
    }
}

export function rotateTetrisPiece() {
    if (!tetrisRunning || !tetrisPiece || tetrisResolvingClear) return;
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
    if (!tetrisRunning || !tetrisPiece || tetrisResolvingClear) return;
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
    const { tetrisStage, tetrisMenuOverlay, tetrisTable, tetrisMenuEyebrow, tetrisMenuTitle, tetrisMenuText, tetrisMenuActionButton, tetrisMenuRulesButton } = dom();
    if (!tetrisMenuOverlay || !tetrisTable) return;
    syncTetrisLayout();
    syncGameMenuOverlayBounds(tetrisMenuOverlay, tetrisTable);
    tetrisMenuOverlay.classList.toggle('hidden', !tetrisMenuVisible);
    tetrisMenuOverlay.classList.toggle('is-closing', tetrisMenuClosing);
    tetrisMenuOverlay.classList.toggle('is-entering', tetrisMenuEntering);
    tetrisTable.classList.toggle('is-menu-open', tetrisMenuVisible);
    tetrisStage?.classList.toggle('is-menu-open', tetrisMenuVisible);
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
    tetrisNextQueue = [];
    spawnTetrisPiece();
    tetrisScore = 0;
    tetrisLines = 0;
    tetrisMenuResult = null;
    tetrisMenuShowingRules = false;
    tetrisMenuClosing = false;
    tetrisMenuEntering = false;
    tetrisRenderedQueueSignature = '';
    tetrisClearingRows = [];
    tetrisClearParticles = [];
    tetrisResolvingClear = false;
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
    renderTetris();
    updateTetrisHud();
    tetrisNextTick = performance.now() + TETRIS_TICK_MS;
    tetrisRafId = window.requestAnimationFrame(tetrisLoop);
}

export function setTetrisMenuVisible(v) { tetrisMenuVisible = Boolean(v); }
export function setTetrisMenuShowingRules(v) { tetrisMenuShowingRules = Boolean(v); }
export function getTetrisMenuVisible() { return tetrisMenuVisible; }
export function getTetrisRunning() { return tetrisRunning; }
export function getTetrisMenuShowingRules() { return tetrisMenuShowingRules; }
export function getTetrisMenuClosing() { return tetrisMenuClosing; }

window.addEventListener('resize', scheduleTetrisLayoutSync);
