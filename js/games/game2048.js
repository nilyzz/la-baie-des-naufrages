// Game module — 2048.
// Extracted verbatim from script.js during the ES-modules migration.

import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { openGameOverModal, closeGameOverModal } from '../core/modals.js';

export const GAME_2048_SIZE = 4;
export const GAME_2048_BEST_KEY = 'baie-des-naufrages-2048-best';

let game2048Grid = [];
let game2048Tiles = [];
let game2048Score = 0;
let game2048BestScore = (typeof window !== 'undefined' ? Number(window.localStorage.getItem(GAME_2048_BEST_KEY)) : 0) || 0;
let game2048TileLayer = null;
let game2048TileElements = new Map();
let game2048NextTileId = 1;
let game2048Animating = false;
let game2048AnimationTimeout = null;
let game2048QueuedMove = null;
let game2048MenuVisible = true;
let game2048MenuShowingRules = false;
let game2048MenuClosing = false;
let game2048MenuResult = false;

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        game2048Board: $('game2048Board'),
        game2048ScoreDisplay: $('game2048ScoreDisplay'),
        game2048BestScoreDisplay: $('game2048BestScoreDisplay'),
        game2048Table: $('game2048Table'),
        game2048MenuOverlay: $('game2048MenuOverlay'),
        game2048MenuEyebrow: $('game2048MenuEyebrow'),
        game2048MenuTitle: $('game2048MenuTitle'),
        game2048MenuText: $('game2048MenuText'),
        game2048MenuActionButton: $('game2048MenuActionButton'),
        game2048MenuRulesButton: $('game2048MenuRulesButton')
    };
}

function create2048EmptyGrid() {
    return Array.from({ length: GAME_2048_SIZE }, () => Array(GAME_2048_SIZE).fill(null));
}

export function update2048Hud() {
    const { game2048ScoreDisplay, game2048BestScoreDisplay } = dom();
    if (game2048ScoreDisplay) game2048ScoreDisplay.textContent = String(game2048Score);
    if (game2048BestScoreDisplay) game2048BestScoreDisplay.textContent = String(game2048BestScore);
}

export function get2048RulesText() {
    return 'Flèches ou ZQSD pour faire glisser toutes les tuiles. Quand deux valeurs identiques se rencontrent, elles fusionnent. Atteins 2048 et évite de bloquer toute la grille.';
}

export function render2048Menu() {
    const { game2048MenuOverlay, game2048Table, game2048MenuEyebrow, game2048MenuTitle, game2048MenuText, game2048MenuActionButton, game2048MenuRulesButton } = dom();
    if (!game2048MenuOverlay || !game2048Table) return;

    syncGameMenuOverlayBounds(game2048MenuOverlay, game2048Table);
    game2048MenuOverlay.classList.toggle('hidden', !game2048MenuVisible);
    game2048MenuOverlay.classList.toggle('is-closing', game2048MenuClosing);
    game2048Table.classList.toggle('is-menu-open', game2048MenuVisible);

    if (!game2048MenuVisible) return;

    const hasResult = Boolean(game2048MenuResult);
    if (game2048MenuEyebrow) game2048MenuEyebrow.textContent = game2048MenuShowingRules ? 'R\u00e8gles' : (hasResult ? 'Maree bloqu\u00e9e' : 'Baie d arcade');
    if (game2048MenuTitle) game2048MenuTitle.textContent = game2048MenuShowingRules ? 'Rappel rapide' : (hasResult ? "C'est perdu" : '2048');
    if (game2048MenuText) game2048MenuText.textContent = game2048MenuShowingRules
        ? get2048RulesText()
        : (hasResult
            ? `La mar\u00e9e t'a bloqu\u00e9. Score ${game2048Score}. Record ${game2048BestScore}. Relance une nouvelle mar\u00e9e.`
            : 'Fais glisser les tuiles pour fusionner les valeurs et atteindre 2048 sans bloqu\u00e9r la grille.');
    if (game2048MenuActionButton) game2048MenuActionButton.textContent = game2048MenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
    if (game2048MenuRulesButton) { game2048MenuRulesButton.textContent = 'R\u00e8gles'; game2048MenuRulesButton.hidden = game2048MenuShowingRules; }
}

export function close2048Menu() {
    game2048MenuClosing = true;
    render2048Menu();
    window.setTimeout(() => {
        game2048MenuClosing = false;
        game2048MenuVisible = false;
        game2048MenuShowingRules = false;
        game2048MenuResult = false;
        render2048Menu();
    }, 220);
}

export function reveal2048OutcomeMenu() {
    game2048MenuVisible = true;
    game2048MenuResult = true;
    game2048MenuShowingRules = false;
    game2048MenuClosing = false;
    render2048Menu();
}

function ensure2048Board() {
    if (game2048TileLayer) return;
    const { game2048Board } = dom();
    if (!game2048Board) return;

    const background = document.createElement('div');
    background.className = 'game-2048-background';
    background.innerHTML = Array.from({ length: GAME_2048_SIZE * GAME_2048_SIZE }, () => (
        '<div class="game-2048-cell game-2048-empty" aria-hidden="true"></div>'
    )).join('');

    game2048TileLayer = document.createElement('div');
    game2048TileLayer.className = 'game-2048-tiles';

    game2048Board.innerHTML = '';
    game2048Board.append(background, game2048TileLayer);
}

function sync2048Grid() {
    game2048Grid = create2048EmptyGrid();
    game2048Tiles.forEach((tile) => {
        game2048Grid[tile.row][tile.col] = tile.id;
    });
}

function get2048Geometry() {
    const { game2048Board } = dom();
    if (!game2048Board) return { gap: 10, padding: 10, cellSize: 70 };
    const styles = window.getComputedStyle(game2048Board);
    const gap = parseFloat(styles.getPropertyValue('--game-2048-gap')) || 10;
    const padding = parseFloat(styles.getPropertyValue('--game-2048-padding')) || 10;
    const innerSize = game2048Board.clientWidth - (padding * 2);
    const cellSize = (innerSize - (gap * (GAME_2048_SIZE - 1))) / GAME_2048_SIZE;
    return { gap, padding, cellSize };
}

function place2048TileElement(element, row, col, geometry) {
    const offsetX = col * (geometry.cellSize + geometry.gap);
    const offsetY = row * (geometry.cellSize + geometry.gap);
    element.style.width = `${geometry.cellSize}px`;
    element.style.height = `${geometry.cellSize}px`;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

function get2048EmptyCells() {
    const emptyCells = [];
    game2048Grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === null) emptyCells.push({ row: rowIndex, col: colIndex });
        });
    });
    return emptyCells;
}

function create2048Tile(value, row, col, isFresh = false) {
    return { id: `tile-${game2048NextTileId += 1}`, value, row, col, isFresh };
}

function add2048Tile(isFresh = true) {
    const emptyCells = get2048EmptyCells();
    if (!emptyCells.length) return null;
    const nextCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const nextTile = create2048Tile(Math.random() < 0.9 ? 2 : 4, nextCell.row, nextCell.col, isFresh);
    game2048Tiles.push(nextTile);
    sync2048Grid();
    return nextTile;
}

function get2048TileClasses(tile) {
    const classes = ['game-2048-tile', `game-2048-value-${tile.value}`];
    if (tile.value >= 128) classes.push('game-2048-cell-small');
    if (tile.value >= 1024) classes.push('game-2048-cell-xsmall');
    if (tile.isFresh) classes.push('game-2048-cell-fresh');
    return classes.join(' ');
}

export function render2048() {
    ensure2048Board();
    if (!game2048TileLayer) return;
    const geometry = get2048Geometry();
    const activeIds = new Set();

    game2048Tiles.forEach((tile) => {
        let tileElement = game2048TileElements.get(tile.id);
        if (!tileElement) {
            tileElement = document.createElement('div');
            tileElement.dataset.tileId = tile.id;
            tileElement.style.transition = 'none';
            game2048TileElements.set(tile.id, tileElement);
        }
        tileElement.className = get2048TileClasses(tile);
        tileElement.textContent = tile.value;
        place2048TileElement(tileElement, tile.row, tile.col, geometry);
        if (!tileElement.isConnected) {
            game2048TileLayer.appendChild(tileElement);
            window.requestAnimationFrame(() => { tileElement.style.transition = ''; });
        }
        activeIds.add(tile.id);
    });

    Array.from(game2048TileElements.keys()).forEach((tileId) => {
        if (activeIds.has(tileId)) return;
        const tileElement = game2048TileElements.get(tileId);
        if (tileElement) tileElement.remove();
        game2048TileElements.delete(tileId);
    });

    game2048Tiles.forEach((tile) => { tile.isFresh = false; });
}

export function initialize2048() {
    closeGameOverModal();
    if (game2048AnimationTimeout) {
        window.clearTimeout(game2048AnimationTimeout);
        game2048AnimationTimeout = null;
    }
    game2048Animating = false;
    game2048QueuedMove = null;
    game2048Tiles = [];
    game2048Grid = create2048EmptyGrid();
    game2048TileElements.forEach((element) => element.remove());
    game2048TileElements.clear();
    game2048Score = 0;
    add2048Tile(true);
    add2048Tile(true);
    update2048Hud();
    render2048();
    game2048MenuVisible = true;
    game2048MenuShowingRules = false;
    game2048MenuClosing = false;
    game2048MenuResult = false;
    render2048Menu();
}

function get2048TargetPosition(lineIndex, targetIndex, direction) {
    if (direction === 'left') return { row: lineIndex, col: targetIndex };
    if (direction === 'right') return { row: lineIndex, col: GAME_2048_SIZE - 1 - targetIndex };
    if (direction === 'up') return { row: targetIndex, col: lineIndex };
    return { row: GAME_2048_SIZE - 1 - targetIndex, col: lineIndex };
}

function get2048LineTiles(lineIndex, direction) {
    const ids = [];
    for (let index = 0; index < GAME_2048_SIZE; index += 1) {
        let row, col;
        if (direction === 'left') { row = lineIndex; col = index; }
        else if (direction === 'right') { row = lineIndex; col = GAME_2048_SIZE - 1 - index; }
        else if (direction === 'up') { row = index; col = lineIndex; }
        else { row = GAME_2048_SIZE - 1 - index; col = lineIndex; }
        const tileId = game2048Grid[row][col];
        if (tileId !== null) ids.push(tileId);
    }
    return ids;
}

/**
 * `activeGameTab` guard is injected by the caller (script.js IIFE still owns
 * that variable). Default true so the module works when wired up standalone.
 */
export function move2048(direction, { isActiveTab = true } = {}) {
    if (game2048MenuVisible || !isActiveTab) return;

    if (game2048Animating) {
        game2048QueuedMove = direction;
        return;
    }

    ensure2048Board();
    if (!game2048TileLayer) return;

    const tileMap = new Map(game2048Tiles.map((tile) => [tile.id, { ...tile }]));
    const targetById = new Map();
    const finalTiles = [];
    let gainedScore = 0;
    let hasChanged = false;

    for (let lineIndex = 0; lineIndex < GAME_2048_SIZE; lineIndex += 1) {
        const lineIds = get2048LineTiles(lineIndex, direction);
        const result = [];

        lineIds.forEach((tileId) => {
            const tile = tileMap.get(tileId);
            const last = result[result.length - 1];
            if (last && last.value === tile.value && !last.merged) {
                last.ids.push(tileId);
                last.merged = true;
                gainedScore += tile.value * 2;
            } else {
                result.push({ value: tile.value, ids: [tileId], merged: false });
            }
        });

        result.forEach((entry, targetIndex) => {
            const target = get2048TargetPosition(lineIndex, targetIndex, direction);
            entry.ids.forEach((tileId) => {
                targetById.set(tileId, target);
                const tile = tileMap.get(tileId);
                if (tile.row !== target.row || tile.col !== target.col) hasChanged = true;
            });

            if (entry.ids.length === 1) {
                const sourceTile = tileMap.get(entry.ids[0]);
                finalTiles.push({ ...sourceTile, row: target.row, col: target.col, isFresh: false });
            } else {
                finalTiles.push(create2048Tile(entry.value * 2, target.row, target.col, true));
                hasChanged = true;
            }
        });
    }

    if (!hasChanged) return;

    const geometry = get2048Geometry();
    const tileElements = new Map();
    game2048TileLayer.querySelectorAll('.game-2048-tile').forEach((element) => {
        tileElements.set(element.dataset.tileId, element);
    });

    game2048Animating = true;

    tileElements.forEach((element, tileId) => {
        const target = targetById.get(tileId);
        if (!target) return;
        place2048TileElement(element, target.row, target.col, geometry);
    });

    game2048AnimationTimeout = window.setTimeout(() => {
        game2048Score += gainedScore;
        if (game2048Score > game2048BestScore) {
            game2048BestScore = game2048Score;
            if (typeof window !== 'undefined') window.localStorage.setItem(GAME_2048_BEST_KEY, String(game2048BestScore));
        }
        game2048Tiles = finalTiles;
        sync2048Grid();
        add2048Tile(true);
        update2048Hud();
        render2048();
        game2048Animating = false;
        game2048AnimationTimeout = null;

        const hasMovesLeft = game2048Tiles.length < GAME_2048_SIZE * GAME_2048_SIZE
            || game2048Tiles.some((tile) => (
                game2048Tiles.some((otherTile) => (
                    otherTile.id !== tile.id
                    && otherTile.value === tile.value
                    && (
                        (otherTile.row === tile.row && Math.abs(otherTile.col - tile.col) === 1)
                        || (otherTile.col === tile.col && Math.abs(otherTile.row - tile.row) === 1)
                    )
                ))
            ));

        if (!hasMovesLeft) {
            openGameOverModal("C'est perdu", "La marée t'a bloqué. Plus aucun coup possible.");
            game2048QueuedMove = null;
            return;
        }

        if (game2048QueuedMove) {
            const queuedMove = game2048QueuedMove;
            game2048QueuedMove = null;
            window.requestAnimationFrame(() => { move2048(queuedMove, { isActiveTab }); });
        }
    }, 120);
}

export function set2048MenuVisible(v) { game2048MenuVisible = Boolean(v); }
export function set2048MenuShowingRules(v) { game2048MenuShowingRules = Boolean(v); }
export function get2048MenuVisible() { return game2048MenuVisible; }
export function get2048MenuResult() { return game2048MenuResult; }
export function get2048MenuShowingRules() { return game2048MenuShowingRules; }
export function get2048MenuClosing() { return game2048MenuClosing; }
