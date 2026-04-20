// Game module — Snake (Serpent de mer).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const SNAKE_SIZE = 14;
export const SNAKE_TICK_MS = 165;
export const SNAKE_BEST_KEY = 'baie-des-naufrages-snake-best';

let snake = [];
let snakeDirection = { x: 1, y: 0 };
let snakeNextDirection = { x: 1, y: 0 };
let snakeFoods = [];
let snakeScore = 0;
let snakeBestScore = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(SNAKE_BEST_KEY)) : 0) || 0;
let snakeInterval = null;
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
        snakeMenuRulesButton: $('snakeMenuRulesButton')
    };
}

export function stopSnake() {
    if (snakeInterval) {
        window.clearInterval(snakeInterval);
        snakeInterval = null;
    }
    snakeRunning = false;
}

export function getSnakeRulesText() {
    return 'Utilise les flèches ou ZQSD pour tourner. Chaque lanterne ramassée allonge le serpent. Évite les bords et ta propre queue pour garder le cap.';
}

export function renderSnakeMenu() {
    const { snakeMenuOverlay, snakeTable, snakeMenuEyebrow, snakeMenuTitle, snakeMenuText, snakeMenuActionButton, snakeMenuRulesButton } = dom();
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
    if (snakeStartButton) snakeStartButton.textContent = snakeRunning ? 'Changer de cap' : 'Lancer la traversée';
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
    for (let row = 0; row < SNAKE_SIZE; row += 1) {
        for (let col = 0; col < SNAKE_SIZE; col += 1) {
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
    snakeBoard?.style.setProperty('--snake-size', String(SNAKE_SIZE));

    if (snakeOverlayLayer) {
        const grid = snakeBoard?.querySelector('.snake-grid');
        const expectedCells = SNAKE_SIZE * SNAKE_SIZE;
        if (grid?.children.length === expectedCells) return;
    }

    const grid = document.createElement('div');
    grid.className = 'snake-grid';
    grid.innerHTML = Array.from({ length: SNAKE_SIZE * SNAKE_SIZE }, (_, index) => {
        const row = Math.floor(index / SNAKE_SIZE);
        const col = index % SNAKE_SIZE;
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
    const cellSize = (innerSize - (gap * (SNAKE_SIZE - 1))) / SNAKE_SIZE;
    return { gap, padding, cellSize };
}

function placeSnakeEntity(element, row, col, geometry) {
    const offsetX = col * (geometry.cellSize + geometry.gap);
    const offsetY = row * (geometry.cellSize + geometry.gap);
    element.style.width = `${geometry.cellSize}px`;
    element.style.height = `${geometry.cellSize}px`;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

function getSnakeHeadRotation() {
    if (snakeDirection.x === 1) return 'rotate(90deg)';
    if (snakeDirection.x === -1) return 'rotate(-90deg)';
    if (snakeDirection.y === 1) return 'rotate(180deg)';
    return 'rotate(0deg)';
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
        segmentElement.style.setProperty('--snake-head-rotation', index === 0 ? getSnakeHeadRotation() : 'rotate(0deg)');
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
    const centerRow = Math.floor(SNAKE_SIZE / 2);
    const centerCol = Math.floor(SNAKE_SIZE / 2);
    stopSnake();
    snakeMenuResult = null;
    snakeMenuShowingRules = false;
    snakeMenuClosing = false;
    snakeMenuEntering = false;
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
    if (snakeScore > snakeBestScore) {
        snakeBestScore = snakeScore;
        if (typeof window !== 'undefined') window.localStorage.setItem(SNAKE_BEST_KEY, String(snakeBestScore));
    }
    updateSnakeHud();
    revealSnakeOutcomeMenu(
        'Coque heurtée',
        `Le serpent a percuté la coque. Score final : ${snakeScore}.`,
        'Fin de traversée'
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

    const hitsWall = nextHead.row < 0 || nextHead.row >= SNAKE_SIZE || nextHead.col < 0 || nextHead.col >= SNAKE_SIZE;
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
            if (snakeScore > snakeBestScore) {
                snakeBestScore = snakeScore;
                if (typeof window !== 'undefined') window.localStorage.setItem(SNAKE_BEST_KEY, String(snakeBestScore));
            }
            stopSnake();
            updateSnakeHud();
            revealSnakeOutcomeMenu(
                'Mer nettoyée',
                `Toutes les lanternes ont été ramassées. Score final : ${snakeScore}.`,
                'Traversée parfaite'
            );
            return;
        }
    } else {
        snake.pop();
    }

    updateSnakeHud();
    renderSnake();
}

export function startSnake() {
    closeGameOverModal();
    initializeSnake();
    snakeRunning = true;
    updateSnakeHud();
    snakeInterval = window.setInterval(moveSnake, SNAKE_TICK_MS);
}

export function setSnakeMenuVisible(v) { snakeMenuVisible = Boolean(v); }
export function setSnakeMenuShowingRules(v) { snakeMenuShowingRules = Boolean(v); }
export function getSnakeMenuVisible() { return snakeMenuVisible; }
export function getSnakeMenuClosing() { return snakeMenuClosing; }
export function getSnakeRunning() { return snakeRunning; }
export function getSnakeMenuShowingRules() { return snakeMenuShowingRules; }
