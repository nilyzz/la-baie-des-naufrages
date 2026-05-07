// Game module - Snake (Serpent de mer).
// Extracted from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const SNAKE_SIZE = 13;
export const SNAKE_TICK_MS = 165;
export const SNAKE_BEST_KEY = 'baie-des-naufrages-snake-best';
export const SNAKE_GRID_SIZE_KEY = 'baie-des-naufrages-snake-grid-size';
export const SNAKE_BEST_BY_SIZE_KEY = 'baie-des-naufrages-snake-best-by-size';
export const SNAKE_GRID_SIZES = [10, 13, 16];

const SNAKE_LEGACY_GRID_SIZE_MAP = {
    15: 13,
    20: 16
};

let snake = [];
let snakeDirection = { x: 1, y: 0 };
let snakeNextDirection = { x: 1, y: 0 };
let snakeFoods = [];
let snakeScore = 0;
let snakeGridSize = loadSnakeGridSize();
const snakeBestScoresBySize = loadSnakeBestScores();
let snakeBestScore = getSnakeBestScoreForSize(snakeGridSize);
let snakeRafId = null;
let snakeNextTick = 0;
let snakeRunning = false;
let snakeJustAte = false;
let snakeDirectionQueue = [];
let snakeOverlayLayer = null;
let snakeSegmentElements = [];
let snakeFoodElements = new Map();
let snakeMenuVisible = true;
let snakeMenuShowingRules = false;
let snakeMenuClosing = false;
let snakeMenuEntering = false;
let snakeMenuResult = null;
let snakeHeadAngle = 90; // accumulated angle — évite le bug CSS arc le plus long

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        snakeBoard: $('snakeBoard'),
        snakeScoreDisplay: $('snakeScoreDisplay'),
        snakeBestScoreDisplay: $('snakeBestScoreDisplay'),
        snakeStartButton: $('snakeStartButton'),
        snakeHelpText: $('snakeHelpText'),
        snakeTable: $('snakeTable'),
        snakeMenuOverlay: $('snakeMenuOverlay'),
        snakeMenuEyebrow: $('snakeMenuEyebrow'),
        snakeMenuTitle: $('snakeMenuTitle'),
        snakeMenuText: $('snakeMenuText'),
        snakeMenuActionButton: $('snakeMenuActionButton'),
        snakeMenuRulesButton: $('snakeMenuRulesButton'),
        snakeGridSizePicker: $('snakeGridSizePicker'),
        snakeGridSizeButtons: document.querySelectorAll('[data-snake-grid-size]')
    };
}

function normalizeSnakeGridSize(value) {
    const numericValue = Number.parseInt(value, 10);
    if (SNAKE_GRID_SIZES.includes(numericValue)) return numericValue;
    return SNAKE_LEGACY_GRID_SIZE_MAP[numericValue] || SNAKE_SIZE;
}

function createDefaultSnakeBestScores() {
    return Object.fromEntries(SNAKE_GRID_SIZES.map((size) => [String(size), 0]));
}

function loadSnakeGridSize() {
    if (typeof window === 'undefined') return SNAKE_SIZE;
    return normalizeSnakeGridSize(window.localStorage.getItem(SNAKE_GRID_SIZE_KEY));
}

function loadSnakeBestScores() {
    const scores = createDefaultSnakeBestScores();

    if (typeof window === 'undefined') return scores;

    try {
        const parsed = JSON.parse(window.localStorage.getItem(SNAKE_BEST_BY_SIZE_KEY) || 'null');
        if (parsed && typeof parsed === 'object') {
            Object.entries(parsed).forEach(([rawSize, rawScore]) => {
                const nextSize = normalizeSnakeGridSize(rawSize);
                const nextScore = Number(rawScore);
                if (Number.isFinite(nextScore) && nextScore >= 0) {
                    const key = String(nextSize);
                    scores[key] = Math.max(scores[key] || 0, Math.floor(nextScore));
                }
            });
        }
    } catch {
        // Ignore malformed persisted data and keep defaults.
    }

    const legacyBestScore = Number(window.localStorage.getItem(SNAKE_BEST_KEY));
    if (Number.isFinite(legacyBestScore) && legacyBestScore > scores[String(SNAKE_SIZE)]) {
        scores[String(SNAKE_SIZE)] = Math.floor(legacyBestScore);
    }

    return scores;
}

function getSnakeBestScoreForSize(size) {
    return snakeBestScoresBySize[String(normalizeSnakeGridSize(size))] || 0;
}

function persistSnakeGridSize() {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SNAKE_GRID_SIZE_KEY, String(snakeGridSize));
}

function persistSnakeBestScores() {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SNAKE_BEST_BY_SIZE_KEY, JSON.stringify(snakeBestScoresBySize));
    window.localStorage.setItem(SNAKE_BEST_KEY, String(getSnakeBestScoreForSize(SNAKE_SIZE)));
}

function syncSnakeBestScore() {
    snakeBestScore = getSnakeBestScoreForSize(snakeGridSize);
}

function updateSnakeBestScore(nextScore) {
    if (nextScore <= snakeBestScore) return;
    snakeBestScore = nextScore;
    snakeBestScoresBySize[String(snakeGridSize)] = nextScore;
    persistSnakeBestScores();
}

function resetSnakeBoardElements() {
    snakeOverlayLayer = null;
    snakeSegmentElements = [];
    snakeFoodElements = new Map();
}

function renderSnakeGridSizeButtons() {
    const { snakeGridSizePicker, snakeGridSizeButtons } = dom();

    if (snakeGridSizePicker) {
        snakeGridSizePicker.hidden = snakeMenuShowingRules;
    }

    snakeGridSizeButtons.forEach((button) => {
        const buttonSize = normalizeSnakeGridSize(button.dataset.snakeGridSize);
        const isActive = buttonSize === snakeGridSize;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

export function stopSnake() {
    if (snakeRafId) {
        window.cancelAnimationFrame(snakeRafId);
        snakeRafId = null;
    }
    snakeRunning = false;
}

function snakeLoop(timestamp) {
    if (!snakeRunning) return;
    if (timestamp >= snakeNextTick) {
        snakeNextTick = timestamp + SNAKE_TICK_MS;
        moveSnake();
    }
    snakeRafId = window.requestAnimationFrame(snakeLoop);
}

export function getSnakeRulesText() {
    return 'Utilise les fl\u00e8ches ou ZQSD pour tourner. Chaque lanterne ramass\u00e9e allonge le serpent. \u00c9vite les bords et ta propre queue pour garder le cap.';
}

export function renderSnakeMenu() {
    const {
        snakeMenuOverlay,
        snakeTable,
        snakeMenuEyebrow,
        snakeMenuTitle,
        snakeMenuText,
        snakeMenuActionButton,
        snakeMenuRulesButton
    } = dom();
    if (!snakeMenuOverlay || !snakeTable) return;

    syncGameMenuOverlayBounds(snakeMenuOverlay, snakeTable);
    snakeMenuOverlay.classList.toggle('hidden', !snakeMenuVisible);
    snakeMenuOverlay.classList.toggle('is-closing', snakeMenuClosing);
    snakeMenuOverlay.classList.toggle('is-entering', snakeMenuEntering);
    snakeTable.classList.toggle('is-menu-open', snakeMenuVisible);

    if (!snakeMenuVisible) return;

    const hasResult = Boolean(snakeMenuResult);

    if (snakeMenuEyebrow) {
        snakeMenuEyebrow.textContent = snakeMenuShowingRules ? 'R\u00e8gles' : (hasResult ? snakeMenuResult.eyebrow : 'Serpent de mer');
    }
    if (snakeMenuTitle) {
        snakeMenuTitle.textContent = snakeMenuShowingRules ? 'Rappel rapide' : (hasResult ? snakeMenuResult.title : 'Snake');
    }
    if (snakeMenuText) {
        snakeMenuText.textContent = snakeMenuShowingRules
            ? getSnakeRulesText()
            : (hasResult ? snakeMenuResult.text : 'Glisse entre les courants, ramasse les lanternes et allonge ton serpent sans heurter la coque.');
    }
    if (snakeMenuActionButton) {
        snakeMenuActionButton.textContent = snakeMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
    }
    if (snakeMenuRulesButton) {
        snakeMenuRulesButton.textContent = 'R\u00e8gles';
        snakeMenuRulesButton.hidden = snakeMenuShowingRules;
    }

    renderSnakeGridSizeButtons();
}

export function closeSnakeMenu() {
    snakeMenuClosing = true;
    renderSnakeMenu();
    window.setTimeout(() => {
        snakeMenuClosing = false;
        snakeMenuVisible = false;
        snakeMenuShowingRules = false;
        snakeMenuEntering = false;
        snakeMenuResult = null;
        renderSnakeMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealSnakeOutcomeMenu(title, text, eyebrow) {
    snakeMenuVisible = true;
    snakeMenuResult = { title, text, eyebrow };
    snakeMenuShowingRules = false;
    snakeMenuClosing = false;
    snakeMenuEntering = true;
    const { snakeHelpText } = dom();
    if (snakeHelpText) snakeHelpText.textContent = text;
    renderSnakeMenu();
    window.setTimeout(() => {
        snakeMenuEntering = false;
        renderSnakeMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function updateSnakeHud() {
    const { snakeScoreDisplay, snakeBestScoreDisplay, snakeStartButton } = dom();
    if (snakeScoreDisplay) snakeScoreDisplay.textContent = String(snakeScore);
    if (snakeBestScoreDisplay) snakeBestScoreDisplay.textContent = String(snakeBestScore);
    if (snakeStartButton) snakeStartButton.textContent = snakeRunning ? 'Changer de cap' : 'Lancer la travers\u00e9e';
}

export function queueSnakeDirectionInput(nextDirection) {
    if (!nextDirection) return;

    const lastQueuedDirection = snakeDirectionQueue[snakeDirectionQueue.length - 1];
    const referenceDirection = lastQueuedDirection || snakeNextDirection || snakeDirection;
    const isOpposite = referenceDirection.x + nextDirection.x === 0
        && referenceDirection.y + nextDirection.y === 0;
    const isSameDirection = referenceDirection.x === nextDirection.x
        && referenceDirection.y === nextDirection.y;

    if (isOpposite || isSameDirection || snakeDirectionQueue.length >= 2) return;

    snakeDirectionQueue.push(nextDirection);
}

function getRandomSnakeFood(existingFoods = []) {
    const freeCells = [];
    for (let row = 0; row < snakeGridSize; row += 1) {
        for (let col = 0; col < snakeGridSize; col += 1) {
            const occupiedBySnake = snake.some((segment) => segment.row === row && segment.col === col);
            const occupiedByFood = existingFoods.some((food) => food.row === row && food.col === col);
            if (!occupiedBySnake && !occupiedByFood) {
                freeCells.push({ row, col });
            }
        }
    }
    if (!freeCells.length) return null;
    return freeCells[Math.floor(Math.random() * freeCells.length)];
}

function refillSnakeFoods() {
    while (snakeFoods.length < 10) {
        const nextFood = getRandomSnakeFood(snakeFoods);
        if (!nextFood) break;
        snakeFoods.push(nextFood);
    }
}

function ensureSnakeBoard() {
    const { snakeBoard } = dom();
    snakeBoard?.style.setProperty('--snake-size', String(snakeGridSize));

    if (snakeOverlayLayer) {
        const grid = snakeBoard?.querySelector('.snake-grid');
        const expectedCells = snakeGridSize * snakeGridSize;
        if (grid?.children.length === expectedCells) return;
    }

    resetSnakeBoardElements();

    const grid = document.createElement('div');
    grid.className = 'snake-grid';
    grid.innerHTML = Array.from({ length: snakeGridSize * snakeGridSize }, (_, index) => {
        const row = Math.floor(index / snakeGridSize);
        const col = index % snakeGridSize;
        const classes = ['snake-bg-cell'];
        if ((row + col) % 2 === 1) classes.push('snake-bg-cell-alt');
        return `<div class="${classes.join(' ')}" aria-hidden="true"></div>`;
    }).join('');

    snakeOverlayLayer = document.createElement('div');
    snakeOverlayLayer.className = 'snake-overlay';

    if (snakeBoard) {
        snakeBoard.innerHTML = '';
        snakeBoard.append(grid, snakeOverlayLayer);
    }
}

function getSnakeGeometry() {
    const { snakeBoard } = dom();
    if (!snakeBoard) return { gap: 4, padding: 10, cellSize: 10 };
    const styles = window.getComputedStyle(snakeBoard);
    const gap = parseFloat(styles.getPropertyValue('--snake-gap')) || 4;
    const padding = parseFloat(styles.getPropertyValue('--snake-padding')) || 10;
    const innerSize = snakeBoard.clientWidth - (padding * 2);
    const cellSize = (innerSize - (gap * (snakeGridSize - 1))) / snakeGridSize;
    return { gap, padding, cellSize };
}

function placeSnakeEntity(element, row, col, geometry) {
    const offsetX = col * (geometry.cellSize + geometry.gap);
    const offsetY = row * (geometry.cellSize + geometry.gap);
    element.style.width = `${geometry.cellSize}px`;
    element.style.height = `${geometry.cellSize}px`;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

function updateSnakeHeadAngle() {
    let target;
    if      (snakeDirection.x === 1)  target = 90;
    else if (snakeDirection.x === -1) target = 270;
    else if (snakeDirection.y === 1)  target = 180;
    else                              target = 0;
    const current = ((snakeHeadAngle % 360) + 360) % 360;
    let delta = target - current;
    if (delta > 180)  delta -= 360;
    if (delta < -180) delta += 360;
    snakeHeadAngle += delta;
}

export function renderSnake() {
    ensureSnakeBoard();
    if (!snakeOverlayLayer) return;

    const geometry = getSnakeGeometry();

    while (snakeSegmentElements.length < snake.length) {
        const segmentElement = document.createElement('div');
        segmentElement.className = 'snake-entity snake-entity-body';
        snakeOverlayLayer.append(segmentElement);
        snakeSegmentElements.push(segmentElement);
    }

    while (snakeSegmentElements.length > snake.length) {
        const segmentElement = snakeSegmentElements.pop();
        segmentElement?.remove();
    }

    snakeSegmentElements.forEach((segmentElement, index) => {
        const segment = snake[index];
        segmentElement.classList.toggle('snake-entity-head', index === 0);
        segmentElement.classList.toggle('snake-entity-body', index !== 0);
        placeSnakeEntity(segmentElement, segment.row, segment.col, geometry);
        if (index === 0) { updateSnakeHeadAngle(); segmentElement.style.setProperty('--snake-head-angle', `${snakeHeadAngle}deg`); }
        else segmentElement.style.setProperty('--snake-head-angle', '90deg');
    });

    const nextFoodKeys = new Set();
    snakeFoods.forEach((food) => {
        const key = `${food.row}-${food.col}`;
        nextFoodKeys.add(key);
        let foodElement = snakeFoodElements.get(key);
        if (!foodElement) {
            foodElement = document.createElement('div');
            foodElement.className = 'snake-entity snake-entity-food';
            if (snakeJustAte) foodElement.classList.add('snake-cell-food-pop');
            snakeOverlayLayer.append(foodElement);
            snakeFoodElements.set(key, foodElement);
        }
        placeSnakeEntity(foodElement, food.row, food.col, geometry);
    });

    snakeFoodElements.forEach((foodElement, key) => {
        if (nextFoodKeys.has(key)) return;
        foodElement.remove();
        snakeFoodElements.delete(key);
    });

    snakeJustAte = false;
}

export function initializeSnake() {
    const centerRow = Math.floor(snakeGridSize / 2);
    const centerCol = Math.floor(snakeGridSize / 2);
    stopSnake();
    snakeHeadAngle = 90;
    snakeMenuResult = null;
    snakeMenuShowingRules = false;
    snakeMenuClosing = false;
    snakeMenuEntering = false;
    syncSnakeBestScore();
    snakeFoodElements.forEach((element) => element.remove());
    snakeFoodElements.clear();
    snake = [
        { row: centerRow, col: centerCol },
        { row: centerRow, col: centerCol - 1 },
        { row: centerRow, col: centerCol - 2 }
    ];
    snakeDirection = { x: 1, y: 0 };
    snakeNextDirection = { x: 1, y: 0 };
    snakeDirectionQueue = [];
    snakeFoods = [];
    refillSnakeFoods();
    snakeScore = 0;
    snakeJustAte = false;
    const { snakeHelpText } = dom();
    if (snakeHelpText) {
        snakeHelpText.textContent = 'Fl\u00e8ches ou ZQSD pour tourner. Attrape les lanternes sans percuter la coque.';
    }
    updateSnakeHud();
    renderSnake();
    renderSnakeMenu();
}

function finishSnakeRun() {
    stopSnake();
    updateSnakeBestScore(snakeScore);
    updateSnakeHud();
    revealSnakeOutcomeMenu(
        'Coque heurt\u00e9e',
        `Le serpent a percut\u00e9 la coque. Score final : ${snakeScore}.`,
        'Fin de travers\u00e9e'
    );
}

function moveSnake() {
    while (snakeDirectionQueue.length) {
        const queuedDirection = snakeDirectionQueue.shift();
        const isOpposite = snakeDirection.x + queuedDirection.x === 0
            && snakeDirection.y + queuedDirection.y === 0;
        if (isOpposite) continue;
        snakeNextDirection = queuedDirection;
        break;
    }

    snakeDirection = { ...snakeNextDirection };
    const head = snake[0];
    const nextHead = {
        row: head.row + snakeDirection.y,
        col: head.col + snakeDirection.x
    };
    const eatenFoodIndex = snakeFoods.findIndex((food) => food.row === nextHead.row && food.col === nextHead.col);
    const willGrow = eatenFoodIndex >= 0;

    const hitsWall = nextHead.row < 0 || nextHead.row >= snakeGridSize || nextHead.col < 0 || nextHead.col >= snakeGridSize;
    const bodyToCheck = willGrow ? snake : snake.slice(0, -1);
    const hitsSelf = bodyToCheck.some((segment) => segment.row === nextHead.row && segment.col === nextHead.col);

    if (hitsWall || hitsSelf) {
        finishSnakeRun();
        return;
    }

    snake.unshift(nextHead);

    if (eatenFoodIndex >= 0) {
        snakeScore += 1;
        snakeFoods.splice(eatenFoodIndex, 1);
        refillSnakeFoods();
        snakeJustAte = true;

        if (!snakeFoods.length) {
            updateSnakeBestScore(snakeScore);
            stopSnake();
            updateSnakeHud();
            revealSnakeOutcomeMenu(
                'Mer nettoy\u00e9e',
                `Toutes les lanternes ont \u00e9t\u00e9 ramass\u00e9es. Score final : ${snakeScore}.`,
                'Travers\u00e9e parfaite'
            );
            return;
        }
    } else {
        snake.pop();
    }

    updateSnakeHud();
    renderSnake();
}

export function startSnakeLaunchSequence() {
    closeGameOverModal();
    snakeMenuClosing = true;
    renderSnakeMenu();
    window.setTimeout(() => {
        snakeMenuClosing = false;
        snakeMenuVisible = false;
        snakeMenuShowingRules = false;
        snakeMenuEntering = false;
        snakeMenuResult = null;
        renderSnakeMenu();
        initializeSnake();
        snakeSegmentElements.forEach((el, index) => {
            const m = (el.style.transform || '').match(/translate\(([^,]+),([^)]+)\)/);
            el.style.setProperty('--snake-tx', m ? m[1].trim() : '0px');
            el.style.setProperty('--snake-ty', m ? m[2].trim() : '0px');
            el.classList.add('is-spawning');
            el.style.setProperty('--spawn-index', String(index));
        });
        window.setTimeout(() => {
            snakeSegmentElements.forEach((el) => {
                el.classList.remove('is-spawning');
                el.style.removeProperty('--spawn-index');
                el.style.removeProperty('--snake-tx');
                el.style.removeProperty('--snake-ty');
            });
            snakeRunning = true;
            snakeNextTick = performance.now() + SNAKE_TICK_MS;
            snakeRafId = window.requestAnimationFrame(snakeLoop);
        }, 480);
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function startSnake() {
    closeGameOverModal();
    initializeSnake();
    snakeRunning = true;
    updateSnakeHud();
    snakeNextTick = performance.now() + SNAKE_TICK_MS;
    snakeRafId = window.requestAnimationFrame(snakeLoop);
}

export function setSnakeGridSize(nextSize) {
    const normalizedSize = normalizeSnakeGridSize(nextSize);
    if (normalizedSize === snakeGridSize) return;

    snakeGridSize = normalizedSize;
    syncSnakeBestScore();
    persistSnakeGridSize();
    initializeSnake();
}

export function setSnakeMenuVisible(v) { snakeMenuVisible = Boolean(v); }
export function setSnakeMenuShowingRules(v) { snakeMenuShowingRules = Boolean(v); }
export function getSnakeMenuVisible() { return snakeMenuVisible; }
export function getSnakeMenuClosing() { return snakeMenuClosing; }
export function getSnakeRunning() { return snakeRunning; }
export function getSnakeMenuShowingRules() { return snakeMenuShowingRules; }
export function getSnakeGridSize() { return snakeGridSize; }
