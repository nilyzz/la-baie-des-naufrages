// Game module — Block Line (BlockBlast).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const BLOCK_BLAST_SIZE = 8;
export const BLOCK_BLAST_BEST_KEY = 'baie-des-naufrages-block-blast-best';
export const BLOCK_BLAST_SHAPES = [
    { key: 'single', cells: [[0, 0]], color: 'sun' },
    { key: 'domino', cells: [[0, 0], [1, 0]], color: 'lagoon' },
    { key: 'trio', cells: [[0, 0], [1, 0], [2, 0]], color: 'gold' },
    { key: 'quad', cells: [[0, 0], [1, 0], [2, 0], [3, 0]], color: 'reef' },
    { key: 'square', cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: 'sand' },
    { key: 'l-small', cells: [[0, 0], [0, 1], [1, 1]], color: 'coral' },
    { key: 'l-tall', cells: [[0, 0], [0, 1], [0, 2], [1, 2]], color: 'sun' },
    { key: 't-small', cells: [[0, 0], [1, 0], [2, 0], [1, 1]], color: 'gold' },
    { key: 'zig', cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: 'lagoon' },
    { key: 'pillar', cells: [[0, 0], [0, 1], [0, 2], [0, 3]], color: 'reef' }
];

let blockBlastState = null;
let blockBlastBestScore = (typeof window !== 'undefined' && Number(window.localStorage.getItem(BLOCK_BLAST_BEST_KEY))) || 0;
let blockBlastSelectedPieceIndex = null;
let blockBlastPreview = null;
let blockBlastDragState = null;
let blockBlastSuppressClick = false;
let blockBlastMenuVisible = true;
let blockBlastMenuShowingRules = false;
let blockBlastMenuClosing = false;
let blockBlastMenuEntering = false;
let blockBlastMenuResult = null;

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        blockBlastBoard: $('blockBlastBoard'),
        blockBlastTable: $('blockBlastTable'),
        blockBlastPieces: $('blockBlastPieces'),
        blockBlastScoreDisplay: $('blockBlastScoreDisplay'),
        blockBlastComboDisplay: $('blockBlastComboDisplay'),
        blockBlastHelpText: $('blockBlastHelpText'),
        blockBlastStartButton: $('blockBlastStartButton'),
        blockBlastMenuOverlay: $('blockBlastMenuOverlay'),
        blockBlastMenuEyebrow: $('blockBlastMenuEyebrow'),
        blockBlastMenuTitle: $('blockBlastMenuTitle'),
        blockBlastMenuText: $('blockBlastMenuText'),
        blockBlastMenuActionButton: $('blockBlastMenuActionButton'),
        blockBlastMenuRulesButton: $('blockBlastMenuRulesButton')
    };
}

function createBlockBlastPiece(template) {
    return {
        id: `${template.key}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        key: template.key,
        color: template.color,
        cells: template.cells.map(([x, y]) => ({ x, y })),
        width: Math.max(...template.cells.map(([x]) => x)) + 1,
        height: Math.max(...template.cells.map(([, y]) => y)) + 1
    };
}

function createBlockBlastBoard() {
    return Array.from({ length: BLOCK_BLAST_SIZE }, () => Array.from({ length: BLOCK_BLAST_SIZE }, () => null));
}

function generateBlockBlastPieces() {
    const pool = [...BLOCK_BLAST_SHAPES];
    const picks = [];

    while (picks.length < 3) {
        const index = Math.floor(Math.random() * pool.length);
        const [template] = pool.splice(index, 1);
        picks.push(createBlockBlastPiece(template));
    }

    return picks;
}

export function canPlaceBlockBlastPiece(piece, anchorRow, anchorCol) {
    if (!piece || !blockBlastState) {
        return false;
    }

    return piece.cells.every((cell) => {
        const row = anchorRow + cell.y;
        const col = anchorCol + cell.x;
        return row >= 0
            && row < BLOCK_BLAST_SIZE
            && col >= 0
            && col < BLOCK_BLAST_SIZE
            && !blockBlastState.board[row][col];
    });
}

export function canAnyBlockBlastPieceFit() {
    if (!blockBlastState) {
        return false;
    }

    return blockBlastState.pieces.some((piece) => {
        if (!piece) {
            return false;
        }

        for (let row = 0; row < BLOCK_BLAST_SIZE; row += 1) {
            for (let col = 0; col < BLOCK_BLAST_SIZE; col += 1) {
                if (canPlaceBlockBlastPiece(piece, row, col)) {
                    return true;
                }
            }
        }

        return false;
    });
}

export function updateBlockBlastHud() {
    const { blockBlastScoreDisplay, blockBlastComboDisplay } = dom();
    if (!blockBlastState) {
        return;
    }

    if (blockBlastScoreDisplay) blockBlastScoreDisplay.textContent = String(blockBlastState.score);
    if (blockBlastComboDisplay) blockBlastComboDisplay.textContent = `x${Math.max(1, blockBlastState.combo)}`;
}

export function clearBlockBlastPreview(shouldRender = true) {
    if (!blockBlastPreview) {
        return;
    }

    blockBlastPreview = null;
    if (shouldRender) {
        renderBlockBlastBoard();
    }
}

export function updateBlockBlastPreview(piece, anchorRow, anchorCol) {
    if (!piece || !Number.isInteger(anchorRow) || !Number.isInteger(anchorCol)) {
        clearBlockBlastPreview();
        return false;
    }

    const keys = piece.cells
        .map((cell) => ({ row: anchorRow + cell.y, col: anchorCol + cell.x }))
        .filter((cell) => (
            cell.row >= 0
            && cell.row < BLOCK_BLAST_SIZE
            && cell.col >= 0
            && cell.col < BLOCK_BLAST_SIZE
        ))
        .map((cell) => `${cell.row}-${cell.col}`);
    const valid = canPlaceBlockBlastPiece(piece, anchorRow, anchorCol);
    const nextPreview = { keys, valid, row: anchorRow, col: anchorCol };
    const previewChanged = !blockBlastPreview
        || blockBlastPreview.valid !== nextPreview.valid
        || blockBlastPreview.row !== nextPreview.row
        || blockBlastPreview.col !== nextPreview.col
        || blockBlastPreview.keys.length !== nextPreview.keys.length
        || blockBlastPreview.keys.some((key, index) => key !== nextPreview.keys[index]);

    blockBlastPreview = nextPreview;
    if (previewChanged) {
        renderBlockBlastBoard();
    }

    return valid;
}

export function getBlockBlastAnchorFromPoint(clientX, clientY) {
    const { blockBlastBoard } = dom();
    if (!blockBlastBoard) {
        return null;
    }

    const bounds = blockBlastBoard.getBoundingClientRect();
    if (clientX < bounds.left || clientX > bounds.right || clientY < bounds.top || clientY > bounds.bottom) {
        return null;
    }

    const relativeX = (clientX - bounds.left) / bounds.width;
    const relativeY = (clientY - bounds.top) / bounds.height;

    return {
        row: Math.max(0, Math.min(BLOCK_BLAST_SIZE - 1, Math.floor(relativeY * BLOCK_BLAST_SIZE))),
        col: Math.max(0, Math.min(BLOCK_BLAST_SIZE - 1, Math.floor(relativeX * BLOCK_BLAST_SIZE)))
    };
}

export function stopBlockBlastDrag() {
    blockBlastDragState = null;
    clearBlockBlastPreview();
}

export function renderBlockBlastPieces() {
    const { blockBlastPieces } = dom();
    if (!blockBlastPieces || !blockBlastState) {
        return;
    }

    blockBlastPieces.innerHTML = blockBlastState.pieces.map((piece, index) => {
        if (!piece) {
            return '<div class="blockblast-piece-slot is-empty"></div>';
        }

        return `
            <button
                type="button"
                class="blockblast-piece${blockBlastSelectedPieceIndex === index ? ' is-selected' : ''}"
                data-blockblast-piece="${index}"
                style="--piece-columns:${piece.width}; --piece-rows:${piece.height};"
                aria-label="Piece ${index + 1}"
            >
                ${piece.cells.map((cell) => `<span class="blockblast-piece-cell is-${piece.color}" style="grid-column:${cell.x + 1}; grid-row:${cell.y + 1};"></span>`).join('')}
            </button>
        `;
    }).join('');
}

export function renderBlockBlastBoard() {
    const { blockBlastBoard } = dom();
    if (!blockBlastBoard || !blockBlastState) {
        return;
    }

    const previewKeys = new Set(blockBlastPreview?.keys || []);
    const previewClassName = blockBlastPreview
        ? (blockBlastPreview.valid ? ' is-preview-valid' : ' is-preview-invalid')
        : '';

    blockBlastBoard.innerHTML = blockBlastState.board.map((row, rowIndex) => row.map((cell, colIndex) => {
        const clearing = blockBlastState.clearingCells?.some((entry) => entry.row === rowIndex && entry.col === colIndex);
        const preview = previewKeys.has(`${rowIndex}-${colIndex}`);
        return `
            <button
                type="button"
                class="blockblast-cell${cell ? ` is-filled is-${cell.color}` : ''}${clearing ? ' is-clearing' : ''}${preview ? previewClassName : ''}"
                data-blockblast-row="${rowIndex}"
                data-blockblast-col="${colIndex}"
                aria-label="Case ${rowIndex + 1}-${colIndex + 1}"
            ></button>
        `;
    }).join('')).join('');
}

export function renderBlockBlast() {
    updateBlockBlastHud();
    renderBlockBlastBoard();
    renderBlockBlastPieces();
}

function finishBlockBlast() {
    if (!blockBlastState) {
        return;
    }

    const { blockBlastHelpText } = dom();
    if (blockBlastHelpText) blockBlastHelpText.textContent = `Le pont est saturé. Score final ${blockBlastState.score}. Record ${blockBlastBestScore}.`;
    revealBlockBlastOutcomeMenu(
        'Pont saturé',
        `Plus aucune pièce ne rentre. Score final : ${blockBlastState.score}. Record : ${blockBlastBestScore}.`,
        'Marée bloquée'
    );
}

function refillBlockBlastPiecesIfNeeded() {
    if (!blockBlastState) {
        return;
    }

    if (blockBlastState.pieces.every((piece) => !piece)) {
        blockBlastState.pieces = generateBlockBlastPieces();
        blockBlastSelectedPieceIndex = null;
        const { blockBlastHelpText } = dom();
        if (blockBlastHelpText) blockBlastHelpText.textContent = 'Nouvelle cargaison sur le quai. Continue a liberer des lignes.';
    }
}

function clearBlockBlastLines() {
    if (!blockBlastState) {
        return;
    }

    const { blockBlastHelpText } = dom();
    const rowsToClear = [];
    const colsToClear = [];

    for (let row = 0; row < BLOCK_BLAST_SIZE; row += 1) {
        if (blockBlastState.board[row].every(Boolean)) {
            rowsToClear.push(row);
        }
    }

    for (let col = 0; col < BLOCK_BLAST_SIZE; col += 1) {
        if (blockBlastState.board.every((row) => row[col])) {
            colsToClear.push(col);
        }
    }

    const uniqueCells = new Map();
    rowsToClear.forEach((row) => {
        for (let col = 0; col < BLOCK_BLAST_SIZE; col += 1) {
            uniqueCells.set(`${row}-${col}`, { row, col });
        }
    });
    colsToClear.forEach((col) => {
        for (let row = 0; row < BLOCK_BLAST_SIZE; row += 1) {
            uniqueCells.set(`${row}-${col}`, { row, col });
        }
    });

    const cleared = [...uniqueCells.values()];
    blockBlastState.clearingCells = cleared;

    if (!cleared.length) {
        blockBlastState.combo = 1;
        if (blockBlastHelpText) blockBlastHelpText.textContent = 'Pose les formes pour préparer un gros nettoyage.';
        return;
    }

    cleared.forEach(({ row, col }) => {
        blockBlastState.board[row][col] = null;
    });

    blockBlastState.score += cleared.length * 12 * Math.max(1, blockBlastState.combo);
    blockBlastState.combo += 1;

    if (blockBlastState.score > blockBlastBestScore) {
        blockBlastBestScore = blockBlastState.score;
        window.localStorage.setItem(BLOCK_BLAST_BEST_KEY, String(blockBlastBestScore));
    }

    if (blockBlastHelpText) blockBlastHelpText.textContent = `${cleared.length} cases liberees. La mer reprend de l air.`;
    renderBlockBlast();

    window.setTimeout(() => {
        if (!blockBlastState) {
            return;
        }
        blockBlastState.clearingCells = [];
        renderBlockBlastBoard();
    }, 220);
}

export function placeBlockBlastPieceAtIndex(pieceIndex, row, col) {
    if (!blockBlastState || pieceIndex === null) {
        return;
    }

    const piece = blockBlastState.pieces[pieceIndex];
    const { blockBlastHelpText } = dom();
    if (!piece || !canPlaceBlockBlastPiece(piece, row, col)) {
        if (blockBlastHelpText) blockBlastHelpText.textContent = 'Cette forme ne rentre pas ici. Cherche un autre coin du plateau.';
        return;
    }

    piece.cells.forEach((cell) => {
        blockBlastState.board[row + cell.y][col + cell.x] = { color: piece.color };
    });

    blockBlastState.score += piece.cells.length * 4;
    blockBlastState.pieces[pieceIndex] = null;
    blockBlastSelectedPieceIndex = null;
    clearBlockBlastPreview(false);
    clearBlockBlastLines();
    refillBlockBlastPiecesIfNeeded();
    renderBlockBlast();

    if (!canAnyBlockBlastPieceFit()) {
        finishBlockBlast();
    }
}

export function placeBlockBlastPiece(row, col) {
    if (blockBlastSelectedPieceIndex === null) {
        return;
    }

    placeBlockBlastPieceAtIndex(blockBlastSelectedPieceIndex, row, col);
}

export function getBlockBlastRulesText() {
    return 'Fais glisser une pi\u00e8ce de la r\u00e9serve sur le pont. Remplis une ligne ou une colonne enti\u00e8re pour la nettoyer et faire grimper le combo. La partie s\u2019arr\u00eate d\u00e8s qu\u2019aucune pi\u00e8ce ne peut plus \u00eatre pos\u00e9e.';
}

export function renderBlockBlastMenu() {
    const { blockBlastMenuOverlay, blockBlastTable, blockBlastMenuEyebrow, blockBlastMenuTitle, blockBlastMenuText, blockBlastMenuActionButton, blockBlastMenuRulesButton } = dom();
    if (!blockBlastMenuOverlay || !blockBlastTable) return;
    syncGameMenuOverlayBounds(blockBlastMenuOverlay, blockBlastTable);
    blockBlastMenuOverlay.classList.toggle('hidden', !blockBlastMenuVisible);
    blockBlastMenuOverlay.classList.toggle('is-closing', blockBlastMenuClosing);
    blockBlastMenuOverlay.classList.toggle('is-entering', blockBlastMenuEntering);
    blockBlastTable.classList.toggle('is-menu-open', blockBlastMenuVisible);
    if (!blockBlastMenuVisible) return;
    const hasResult = Boolean(blockBlastMenuResult);
    if (blockBlastMenuEyebrow) blockBlastMenuEyebrow.textContent = blockBlastMenuShowingRules ? 'R\u00e8gles' : (hasResult ? blockBlastMenuResult.eyebrow : 'Ligne de cargaison');
    if (blockBlastMenuTitle) blockBlastMenuTitle.textContent = blockBlastMenuShowingRules ? 'Rappel rapide' : (hasResult ? blockBlastMenuResult.title : 'Block Line');
    if (blockBlastMenuText) blockBlastMenuText.textContent = blockBlastMenuShowingRules ? getBlockBlastRulesText() : (hasResult ? blockBlastMenuResult.text : 'Pose les pi\u00e8ces de cargaison sur le pont pour former des lignes et colonnes compl\u00e8tes. Tiens le plus longtemps possible.');
    if (blockBlastMenuActionButton) blockBlastMenuActionButton.textContent = blockBlastMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la mar\u00e9e' : 'Lancer la mar\u00e9e');
    if (blockBlastMenuRulesButton) { blockBlastMenuRulesButton.textContent = 'R\u00e8gles'; blockBlastMenuRulesButton.hidden = blockBlastMenuShowingRules; }
}

export function closeBlockBlastMenu() {
    blockBlastMenuClosing = true;
    renderBlockBlastMenu();
    window.setTimeout(() => {
        blockBlastMenuClosing = false;
        blockBlastMenuVisible = false;
        blockBlastMenuShowingRules = false;
        blockBlastMenuEntering = false;
        blockBlastMenuResult = null;
        renderBlockBlastMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealBlockBlastOutcomeMenu(title, text, eyebrow) {
    blockBlastMenuVisible = true;
    blockBlastMenuResult = { title, text, eyebrow };
    blockBlastMenuShowingRules = false;
    blockBlastMenuClosing = false;
    blockBlastMenuEntering = true;
    const { blockBlastHelpText } = dom();
    if (blockBlastHelpText) blockBlastHelpText.textContent = text;
    renderBlockBlastMenu();
    window.setTimeout(() => { blockBlastMenuEntering = false; renderBlockBlastMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeBlockBlast() {
    closeGameOverModal();
    blockBlastState = {
        board: createBlockBlastBoard(),
        pieces: generateBlockBlastPieces(),
        score: 0,
        combo: 1,
        clearingCells: []
    };
    blockBlastSelectedPieceIndex = null;
    clearBlockBlastPreview(false);
    stopBlockBlastDrag();
    const { blockBlastHelpText } = dom();
    if (blockBlastHelpText) blockBlastHelpText.textContent = 'Fais glisser une forme sur le pont. Efface des lignes pour garder la baie dégagée.';
    blockBlastMenuResult = null;
    blockBlastMenuShowingRules = false;
    blockBlastMenuClosing = false;
    blockBlastMenuEntering = false;
    renderBlockBlastMenu();
    renderBlockBlast();
}

export function getBlockBlastState() { return blockBlastState; }
export function getBlockBlastDragState() { return blockBlastDragState; }
export function setBlockBlastDragState(v) { blockBlastDragState = v; }
export function getBlockBlastSelectedPieceIndex() { return blockBlastSelectedPieceIndex; }
export function setBlockBlastSelectedPieceIndex(v) { blockBlastSelectedPieceIndex = v; }
export function getBlockBlastSuppressClick() { return blockBlastSuppressClick; }
export function setBlockBlastSuppressClick(v) { blockBlastSuppressClick = Boolean(v); }
export function getBlockBlastMenuVisible() { return blockBlastMenuVisible; }
export function setBlockBlastMenuVisible(v) { blockBlastMenuVisible = Boolean(v); }
export function setBlockBlastMenuShowingRules(v) { blockBlastMenuShowingRules = Boolean(v); }
export function getBlockBlastMenuShowingRules() { return blockBlastMenuShowingRules; }
export function getBlockBlastMenuClosing() { return blockBlastMenuClosing; }
