// Game module — Rope Line (FlowFree).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';
import { shuffleArray } from '../core/utils.js';

export const FLOW_FREE_SIZE = 7;
export const FLOW_FREE_COLORS = [
    '#ef4444',
    '#2563eb',
    '#f59e0b',
    '#16a34a',
    '#7c3aed',
    '#ea580c',
    '#db2777',
    '#0891b2',
    '#f8fafc',
    '#65a30d'
];

let flowFreeCells = [];
let flowFreeLevel = null;
let flowFreePaths = new Map();
let flowFreeCompleted = new Set();
let flowFreeMoves = 0;
let flowFreeMenuVisible = true;
let flowFreeMenuShowingRules = false;
let flowFreeMenuClosing = false;
let flowFreeMenuEntering = false;
let flowFreeMenuResult = null;
let flowFreeActiveColor = null;
let flowFreePointerDown = false;
let flowFreeRenderFrame = null;
let flowFreeLastHoverKey = null;
let flowFreePendingTarget = null;
let flowFreeCatchupFrame = null;
let flowFreeCompletionAnimationToken = 0;
let flowFreeSpawning = new Set();
let flowFreeSpawnTimers = new Map();
let flowFreeDespawning = new Map();
let flowFreeDespawnTimer = null;

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        flowFreeBoard: $('flowFreeBoard'),
        flowFreeTable: $('flowFreeTable'),
        flowFreePairsDisplay: $('flowFreePairsDisplay'),
        flowFreeMovesDisplay: $('flowFreeMovesDisplay'),
        flowFreeHelpText: $('flowFreeHelpText'),
        flowFreeRestartButton: $('flowFreeRestartButton'),
        flowFreeMenuOverlay: $('flowFreeMenuOverlay'),
        flowFreeMenuEyebrow: $('flowFreeMenuEyebrow'),
        flowFreeMenuTitle: $('flowFreeMenuTitle'),
        flowFreeMenuText: $('flowFreeMenuText'),
        flowFreeMenuActionButton: $('flowFreeMenuActionButton'),
        flowFreeMenuRulesButton: $('flowFreeMenuRulesButton')
    };
}

export function createFlowFreeBasePath(size) {
    return Array.from({ length: size }, (_, rowIndex) => (
        Array.from({ length: size }, (_, stepIndex) => ({
            row: rowIndex,
            col: rowIndex % 2 === 0 ? stepIndex : (size - 1 - stepIndex)
        }))
    )).flat();
}

export function transformFlowFreePath(path, size) {
    const transpose = Math.random() < 0.5;
    const flipX = Math.random() < 0.5;
    const flipY = Math.random() < 0.5;
    const reversed = Math.random() < 0.5;

    const transformed = path.map((cell) => {
        let row = cell.row;
        let col = cell.col;

        if (transpose) {
            [row, col] = [col, row];
        }

        if (flipY) {
            row = size - 1 - row;
        }

        if (flipX) {
            col = size - 1 - col;
        }

        return { row, col };
    });

    return reversed ? transformed.reverse() : transformed;
}

export function generateFlowFreeSegmentLengths(totalCells) {
    const lengths = [];
    let remaining = totalCells;

    while (remaining > 0) {
        const remainingSlots = Math.ceil(remaining / 9);
        const minLength = lengths.length >= 4 ? 5 : 6;
        const maxLength = Math.min(10, remaining - ((remainingSlots - 1) * 4));
        let nextLength = Math.min(maxLength, minLength + Math.floor(Math.random() * Math.max(1, maxLength - minLength + 1)));

        if (remaining - nextLength > 0 && remaining - nextLength < 4) {
            nextLength = remaining;
        }

        lengths.push(nextLength);
        remaining -= nextLength;
    }

    if (lengths[lengths.length - 1] < 4 && lengths.length > 1) {
        const deficit = 4 - lengths[lengths.length - 1];
        lengths[lengths.length - 2] -= deficit;
        lengths[lengths.length - 1] += deficit;
    }

    return lengths;
}

export function generateFlowFreeLevel() {
    const basePath = createFlowFreeBasePath(FLOW_FREE_SIZE);
    const fullPath = transformFlowFreePath(basePath, FLOW_FREE_SIZE);
    const segmentLengths = generateFlowFreeSegmentLengths(fullPath.length);
    const colorPool = shuffleArray(FLOW_FREE_COLORS).slice(0, segmentLengths.length);
    let offset = 0;

    return {
        size: FLOW_FREE_SIZE,
        pairs: segmentLengths.map((length, index) => {
            const cells = fullPath.slice(offset, offset + length);
            offset += length;

            return {
                color: colorPool[index],
                start: { ...cells[0] },
                end: { ...cells[cells.length - 1] },
                solution: cells.map((cell) => ({ ...cell }))
            };
        })
    };
}

function getFlowFreePairByColor(color) {
    return flowFreeLevel?.pairs.find((pair) => pair.color === color) || null;
}

export function updateFlowFreeHud() {
    const { flowFreePairsDisplay, flowFreeMovesDisplay } = dom();
    if (flowFreePairsDisplay) flowFreePairsDisplay.textContent = `${flowFreeCompleted.size} / ${flowFreeLevel?.pairs.length || 0}`;
    if (flowFreeMovesDisplay) flowFreeMovesDisplay.textContent = String(flowFreeMoves);
}

function setFlowFreePath(color, nextPath) {
    const previousPath = flowFreePaths.get(color) || [];
    const previousKeys = new Set(previousPath.map((cell) => `${cell.row}-${cell.col}`));

    flowFreeCells.forEach((row) => {
        row.forEach((cell) => {
            if (cell.color === color && !cell.isAnchor) {
                cell.color = null;
            }
        });
    });

    nextPath.forEach((cell, index) => {
        if (index === 0) {
            return;
        }

        const boardCell = flowFreeCells[cell.row][cell.col];
        if (!boardCell.isAnchor) {
            boardCell.color = color;
            const key = `${cell.row}-${cell.col}`;
            if (!previousKeys.has(key)) {
                flowFreeSpawning.add(key);

                const existingTimer = flowFreeSpawnTimers.get(key);
                if (existingTimer) {
                    window.clearTimeout(existingTimer);
                }

                const timer = window.setTimeout(() => {
                    flowFreeSpawning.delete(key);
                    flowFreeSpawnTimers.delete(key);
                    scheduleFlowFreeRender();
                }, 180);

                flowFreeSpawnTimers.set(key, timer);
            }
        }
    });

    flowFreePaths.set(color, nextPath.map((cell) => ({ ...cell })));
}

export function renderFlowFree() {
    const { flowFreeBoard } = dom();
    flowFreeRenderFrame = null;
    updateFlowFreeHud();
    if (!flowFreeBoard) return;
    const connectionMap = new Map();

    flowFreePaths.forEach((path, color) => {
        path.forEach((cell, index) => {
            const key = `${cell.row}-${cell.col}`;
            const connections = connectionMap.get(key) || { top: 0, right: 0, bottom: 0, left: 0, color };
            const previousCell = path[index - 1];
            const nextCell = path[index + 1];

            [previousCell, nextCell].forEach((linkedCell) => {
                if (!linkedCell) {
                    return;
                }

                if (linkedCell.row === cell.row - 1 && linkedCell.col === cell.col) {
                    connections.top = 1;
                } else if (linkedCell.row === cell.row + 1 && linkedCell.col === cell.col) {
                    connections.bottom = 1;
                } else if (linkedCell.row === cell.row && linkedCell.col === cell.col - 1) {
                    connections.left = 1;
                } else if (linkedCell.row === cell.row && linkedCell.col === cell.col + 1) {
                    connections.right = 1;
                }
            });

            connectionMap.set(key, connections);
        });
    });

    flowFreeDespawning.forEach((connection, key) => {
        connectionMap.set(key, connection);
    });

    flowFreeBoard.innerHTML = flowFreeCells.map((row, rowIndex) => row.map((cell, colIndex) => {
        const classes = ['flowfree-cell'];

        if (cell.isAnchor) {
            classes.push('is-anchor');
        }

        if (cell.color) {
            classes.push('is-filled');
        }

        if (flowFreeActiveColor && cell.color === flowFreeActiveColor) {
            classes.push('is-selected');
        }

        const connectionKey = `${rowIndex}-${colIndex}`;
        const connection = connectionMap.get(connectionKey) || { top: 0, right: 0, bottom: 0, left: 0 };
        const despawnConnection = flowFreeDespawning.get(connectionKey);
        const top = connection.top;
        const right = connection.right;
        const bottom = connection.bottom;
        const left = connection.left;

        if (despawnConnection) {
            classes.push('is-despawning');
        }

        if (flowFreeSpawning.has(connectionKey) && !despawnConnection) {
            classes.push('is-spawning');
        }

        return `
            <button
                type="button"
                class="${classes.join(' ')}"
                data-flow-row="${rowIndex}"
                data-flow-col="${colIndex}"
                style="
                    --flow-color: ${(despawnConnection?.color || cell.color) || 'transparent'};
                    --flow-top: ${top};
                    --flow-right: ${right};
                    --flow-bottom: ${bottom};
                    --flow-left: ${left};
                "
            ></button>
        `;
    }).join('')).join('');
}

export function scheduleFlowFreeRender() {
    if (flowFreeRenderFrame !== null) {
        return;
    }

    flowFreeRenderFrame = window.requestAnimationFrame(() => {
        renderFlowFree();
    });
}

function buildFlowFreeConnectionMap(path, color) {
    const connectionMap = new Map();

    path.forEach((cell, index) => {
        const key = `${cell.row}-${cell.col}`;
        const connections = connectionMap.get(key) || { top: 0, right: 0, bottom: 0, left: 0, color };
        const previousCell = path[index - 1];
        const nextCell = path[index + 1];

        [previousCell, nextCell].forEach((linkedCell) => {
            if (!linkedCell) {
                return;
            }

            if (linkedCell.row === cell.row - 1 && linkedCell.col === cell.col) {
                connections.top = 1;
            } else if (linkedCell.row === cell.row + 1 && linkedCell.col === cell.col) {
                connections.bottom = 1;
            } else if (linkedCell.row === cell.row && linkedCell.col === cell.col - 1) {
                connections.left = 1;
            } else if (linkedCell.row === cell.row && linkedCell.col === cell.col + 1) {
                connections.right = 1;
            }
        });

        connectionMap.set(key, connections);
    });

    return connectionMap;
}

function despawnFlowFreePath(color) {
    const path = flowFreePaths.get(color) || [];
    if (path.length <= 1) {
        return;
    }

    if (flowFreeDespawnTimer) {
        window.clearTimeout(flowFreeDespawnTimer);
        flowFreeDespawnTimer = null;
    }

    const despawnMap = buildFlowFreeConnectionMap(path, color);
    const startCell = path[0];
    despawnMap.delete(`${startCell.row}-${startCell.col}`);
    flowFreeDespawning = despawnMap;
    setFlowFreePath(color, [startCell]);
    scheduleFlowFreeRender();

    flowFreeDespawnTimer = window.setTimeout(() => {
        flowFreeDespawning = new Map();
        flowFreeDespawnTimer = null;
        scheduleFlowFreeRender();
    }, 220);
}

export function getFlowFreeRulesText() {
    return 'Clique une bou\u00e9e et trace un cordage color\u00e9 jusqu\u2019\u00e0 sa jumelle sans croiser les autres courants. Remplis toutes les cases du quai pour terminer la carte.';
}

export function renderFlowFreeMenu() {
    const { flowFreeMenuOverlay, flowFreeTable, flowFreeMenuEyebrow, flowFreeMenuTitle, flowFreeMenuText, flowFreeMenuActionButton, flowFreeMenuRulesButton } = dom();
    if (!flowFreeMenuOverlay || !flowFreeTable) return;
    syncGameMenuOverlayBounds(flowFreeMenuOverlay, flowFreeTable);
    flowFreeMenuOverlay.classList.toggle('hidden', !flowFreeMenuVisible);
    flowFreeMenuOverlay.classList.toggle('is-closing', flowFreeMenuClosing);
    flowFreeMenuOverlay.classList.toggle('is-entering', flowFreeMenuEntering);
    flowFreeTable.classList.toggle('is-menu-open', flowFreeMenuVisible);
    if (!flowFreeMenuVisible) return;
    const hasResult = Boolean(flowFreeMenuResult);
    if (flowFreeMenuEyebrow) flowFreeMenuEyebrow.textContent = flowFreeMenuShowingRules ? 'R\u00e8gles' : (hasResult ? flowFreeMenuResult.eyebrow : 'Cordages du quai');
    if (flowFreeMenuTitle) flowFreeMenuTitle.textContent = flowFreeMenuShowingRules ? 'Rappel rapide' : (hasResult ? flowFreeMenuResult.title : 'Rope Line');
    if (flowFreeMenuText) flowFreeMenuText.textContent = flowFreeMenuShowingRules ? getFlowFreeRulesText() : (hasResult ? flowFreeMenuResult.text : 'Relie chaque paire de bou\u00e9es avec un cordage color\u00e9 et remplis toutes les cases du quai.');
    if (flowFreeMenuActionButton) flowFreeMenuActionButton.textContent = flowFreeMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer le trac\u00e9' : 'Lancer le trac\u00e9');
    if (flowFreeMenuRulesButton) { flowFreeMenuRulesButton.textContent = 'R\u00e8gles'; flowFreeMenuRulesButton.hidden = flowFreeMenuShowingRules; }
}

export function closeFlowFreeMenu() {
    flowFreeMenuClosing = true;
    renderFlowFreeMenu();
    window.setTimeout(() => {
        flowFreeMenuClosing = false;
        flowFreeMenuVisible = false;
        flowFreeMenuShowingRules = false;
        flowFreeMenuEntering = false;
        flowFreeMenuResult = null;
        renderFlowFreeMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealFlowFreeOutcomeMenu(title, text, eyebrow) {
    flowFreeMenuVisible = true;
    flowFreeMenuResult = { title, text, eyebrow };
    flowFreeMenuShowingRules = false;
    flowFreeMenuClosing = false;
    flowFreeMenuEntering = true;
    const { flowFreeHelpText } = dom();
    if (flowFreeHelpText) flowFreeHelpText.textContent = text;
    renderFlowFreeMenu();
    window.setTimeout(() => { flowFreeMenuEntering = false; renderFlowFreeMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeFlowFree() {
    closeGameOverModal();
    flowFreeLevel = generateFlowFreeLevel();
    const { flowFreeBoard, flowFreeHelpText } = dom();
    if (flowFreeBoard) flowFreeBoard.style.gridTemplateColumns = `repeat(${flowFreeLevel.size}, minmax(0, 1fr))`;
    flowFreeCells = Array.from({ length: flowFreeLevel.size }, () => (
        Array.from({ length: flowFreeLevel.size }, () => ({ color: null, isAnchor: false }))
    ));
    flowFreePaths = new Map();
    flowFreeCompleted = new Set();
    flowFreeMoves = 0;
    flowFreeActiveColor = null;
    flowFreePointerDown = false;
    flowFreeLastHoverKey = null;
    flowFreePendingTarget = null;
    if (flowFreeCatchupFrame !== null) {
        window.cancelAnimationFrame(flowFreeCatchupFrame);
        flowFreeCatchupFrame = null;
    }
    flowFreeSpawning = new Set();
    flowFreeSpawnTimers.forEach((timer) => window.clearTimeout(timer));
    flowFreeSpawnTimers = new Map();
    flowFreeDespawning = new Map();
    if (flowFreeDespawnTimer) {
        window.clearTimeout(flowFreeDespawnTimer);
        flowFreeDespawnTimer = null;
    }

    flowFreeLevel.pairs.forEach((pair) => {
        const startCell = flowFreeCells[pair.start.row][pair.start.col];
        const endCell = flowFreeCells[pair.end.row][pair.end.col];
        startCell.color = pair.color;
        endCell.color = pair.color;
        startCell.isAnchor = true;
        endCell.isAnchor = true;
        flowFreePaths.set(pair.color, [{ ...pair.start }]);
    });

    if (flowFreeHelpText) flowFreeHelpText.textContent = 'Relie chaque paire sans croiser les courants et couvre toutes les cases du plateau.';
    flowFreeMenuResult = null;
    flowFreeMenuShowingRules = false;
    flowFreeMenuClosing = false;
    flowFreeMenuEntering = false;
    renderFlowFreeMenu();
    renderFlowFree();
}

export function startFlowFreePath(row, col) {
    const cell = flowFreeCells[row][col];
    if (!cell?.color) {
        return;
    }

    const existingPath = flowFreePaths.get(cell.color) || [];
    const existingIndex = existingPath.findIndex((pathCell) => pathCell.row === row && pathCell.col === col);

    flowFreeMoves += 1;
    flowFreeActiveColor = cell.color;
    flowFreePointerDown = true;
    flowFreeCompleted.delete(cell.color);
    setFlowFreePath(
        cell.color,
        cell.isAnchor
            ? [{ row, col }]
            : existingIndex >= 0
                ? existingPath.slice(0, existingIndex + 1)
                : [{ row, col }]
    );
    flowFreeLastHoverKey = `${row}-${col}`;
    const { flowFreeHelpText } = dom();
    if (flowFreeHelpText) flowFreeHelpText.textContent = "Trace maintenant le courant jusqu'à la bouée jumelle.";
    scheduleFlowFreeRender();
}

export function extendFlowFreePathStep(row, col, options = {}) {
    const { deferRender = false } = options;
    if (!flowFreePointerDown || !flowFreeActiveColor) {
        return 'inactive';
    }

    const path = flowFreePaths.get(flowFreeActiveColor) || [];
    const lastCell = path[path.length - 1];

    if (!lastCell) {
        return 'blocked';
    }

    const distance = Math.abs(lastCell.row - row) + Math.abs(lastCell.col - col);
    if (distance !== 1) {
        return 'blocked';
    }

    const targetCell = flowFreeCells[row][col];
    if (!targetCell) {
        return 'blocked';
    }

    const hoverKey = `${row}-${col}`;
    if (flowFreeLastHoverKey === hoverKey) {
        return 'duplicate';
    }
    flowFreeLastHoverKey = hoverKey;

    const existingIndex = path.findIndex((cell) => cell.row === row && cell.col === col);
    if (existingIndex >= 0) {
        setFlowFreePath(flowFreeActiveColor, path.slice(0, existingIndex + 1));
        flowFreeCompleted.delete(flowFreeActiveColor);
        if (!deferRender) {
            scheduleFlowFreeRender();
        }
        return 'advanced';
    }

    if (targetCell.color && targetCell.color !== flowFreeActiveColor) {
        return 'blocked';
    }

    const pair = getFlowFreePairByColor(flowFreeActiveColor);
    if (!pair) {
        return 'blocked';
    }

    const isOtherAnchor = targetCell.isAnchor
        && ((row === pair.start.row && col === pair.start.col) || (row === pair.end.row && col === pair.end.col));

    if (targetCell.isAnchor && !isOtherAnchor) {
        return 'blocked';
    }

    const nextPath = [...path, { row, col }];
    setFlowFreePath(flowFreeActiveColor, nextPath);

    const startCell = nextPath[0];
    const reachedEnd = (startCell.row === pair.start.row && startCell.col === pair.start.col
        && row === pair.end.row && col === pair.end.col)
        || (startCell.row === pair.end.row && startCell.col === pair.end.col
        && row === pair.start.row && col === pair.start.col);

    if (!targetCell.isAnchor) {
        animateFlowFreeCellAppearance(row, col, flowFreeActiveColor);
    }

    const { flowFreeHelpText } = dom();

    if (reachedEnd) {
        renderFlowFree();
        animateFlowFreeCompletedPath(nextPath, flowFreeActiveColor);
        flowFreeCompleted.add(flowFreeActiveColor);
        if (flowFreeHelpText) flowFreeHelpText.textContent = 'Un courant est ferme. Plus que quelques liaisons.';

        const allCellsFilled = flowFreeCells.every((rowCells) => rowCells.every((cell) => Boolean(cell.color)));
        if (flowFreeCompleted.size === flowFreeLevel.pairs.length && allCellsFilled) {
            if (flowFreeHelpText) flowFreeHelpText.textContent = 'Tous les courants sont reliés. Le port est sécurisé.';
            renderFlowFree();
            revealFlowFreeOutcomeMenu('Courants reliés', `Toutes les liaisons sont terminées en ${flowFreeMoves} tracés.`, 'Port sécurisé');
            flowFreePointerDown = false;
            flowFreeActiveColor = null;
            flowFreeLastHoverKey = null;
            return 'completed';
        }
        if (flowFreeHelpText) flowFreeHelpText.textContent = allCellsFilled
            ? 'Toutes les cases sont remplies. Termine les dernieres liaisons.'
            : 'Un courant est ferme. Les cases libres doivent aussi etre couvertes.';
        flowFreePointerDown = false;
        flowFreeActiveColor = null;
        flowFreeLastHoverKey = null;
        if (!deferRender) {
            scheduleFlowFreeRender();
        }
        return 'completed';
    } else {
        flowFreeCompleted.delete(flowFreeActiveColor);
    }

    if (!deferRender) {
        scheduleFlowFreeRender();
    }
    return 'advanced';
}

export function extendFlowFreePath(row, col) {
    if (!flowFreePointerDown || !flowFreeActiveColor) {
        return;
    }
    flowFreePendingTarget = { row, col };

    if (flowFreeCatchupFrame === null) {
        processFlowFreePendingPath();
    }
}

export function flushFlowFreePendingTarget() {
    if (!flowFreePointerDown || !flowFreeActiveColor || !flowFreePendingTarget) {
        return;
    }

    while (flowFreePointerDown && flowFreeActiveColor && flowFreePendingTarget) {
        const stepResult = processFlowFreePendingPathSync();
        if (stepResult !== 'advanced') {
            break;
        }
    }
}

function finalizeFlowFreePathIfComplete(color) {
    if (!color) {
        return false;
    }

    const pair = getFlowFreePairByColor(color);
    const path = flowFreePaths.get(color) || [];
    const startCell = path[0];
    const endCell = path[path.length - 1];

    if (!pair || !startCell || !endCell) {
        return false;
    }

    const connectsAnchors = (
        startCell.row === pair.start.row
        && startCell.col === pair.start.col
        && endCell.row === pair.end.row
        && endCell.col === pair.end.col
    ) || (
        startCell.row === pair.end.row
        && startCell.col === pair.end.col
        && endCell.row === pair.start.row
        && endCell.col === pair.start.col
    );

    if (!connectsAnchors) {
        return false;
    }

    renderFlowFree();
    animateFlowFreeCompletedPath(path, color);
    flowFreeCompleted.add(color);

    const { flowFreeHelpText } = dom();
    const allCellsFilled = flowFreeCells.every((rowCells) => rowCells.every((cell) => Boolean(cell.color)));
    if (flowFreeHelpText) flowFreeHelpText.textContent = allCellsFilled
        ? 'Toutes les cases sont remplies. Termine les dernieres liaisons.'
        : 'Un courant est ferme. Les cases libres doivent aussi etre couvertes.';

    if (flowFreeCompleted.size === flowFreeLevel.pairs.length && allCellsFilled) {
        if (flowFreeHelpText) flowFreeHelpText.textContent = 'Tous les courants sont relies. Le port est securise.';
        renderFlowFree();
        revealFlowFreeOutcomeMenu('Courants reliés', `Toutes les liaisons sont terminées en ${flowFreeMoves} tracés.`, 'Port sécurisé');
    }

    return true;
}

function snapFlowFreePathToMatchingAnchor(color) {
    if (!color) {
        return;
    }

    const pair = getFlowFreePairByColor(color);
    const path = flowFreePaths.get(color) || [];
    const startCell = path[0];
    const endCell = path[path.length - 1];

    if (!pair || !startCell || !endCell) {
        return;
    }

    const targetAnchor = (startCell.row === pair.start.row && startCell.col === pair.start.col)
        ? pair.end
        : pair.start;

    if (endCell.row === targetAnchor.row && endCell.col === targetAnchor.col) {
        return;
    }

    const distance = Math.abs(endCell.row - targetAnchor.row) + Math.abs(endCell.col - targetAnchor.col);
    if (distance !== 1) {
        return;
    }

    setFlowFreePath(color, [...path, { row: targetAnchor.row, col: targetAnchor.col }]);
}

function processFlowFreePendingPathSync() {
    if (!flowFreePointerDown || !flowFreeActiveColor || !flowFreePendingTarget) {
        return 'inactive';
    }

    const path = flowFreePaths.get(flowFreeActiveColor) || [];
    const lastCell = path[path.length - 1];

    if (!lastCell) {
        flowFreePendingTarget = null;
        return 'inactive';
    }

    const rowDiff = flowFreePendingTarget.row - lastCell.row;
    const colDiff = flowFreePendingTarget.col - lastCell.col;
    const distance = Math.abs(rowDiff) + Math.abs(colDiff);

    if (distance === 0) {
        flowFreePendingTarget = null;
        return 'inactive';
    }

    const nextRow = rowDiff !== 0 && Math.abs(rowDiff) >= Math.abs(colDiff)
        ? lastCell.row + Math.sign(rowDiff)
        : lastCell.row;
    const nextCol = nextRow === lastCell.row
        ? lastCell.col + Math.sign(colDiff)
        : lastCell.col;

    const stepResult = extendFlowFreePathStep(nextRow, nextCol, { deferRender: true });
    scheduleFlowFreeRender();

    if (stepResult === 'completed' || stepResult === 'inactive') {
        flowFreePendingTarget = null;
        return stepResult;
    }

    if (stepResult !== 'advanced') {
        flowFreePendingTarget = null;
        return stepResult;
    }

    const updatedPath = flowFreePaths.get(flowFreeActiveColor) || [];
    const updatedLastCell = updatedPath[updatedPath.length - 1];
    if (!updatedLastCell) {
        flowFreePendingTarget = null;
        return 'inactive';
    }

    const remainingDistance = Math.abs(flowFreePendingTarget.row - updatedLastCell.row)
        + Math.abs(flowFreePendingTarget.col - updatedLastCell.col);

    if (remainingDistance === 0) {
        flowFreePendingTarget = null;
    }

    return 'advanced';
}

export function stopFlowFreePath() {
    const activeColor = flowFreeActiveColor;
    snapFlowFreePathToMatchingAnchor(activeColor);
    const completedOnRelease = finalizeFlowFreePathIfComplete(activeColor);
    flowFreePointerDown = false;
    flowFreeActiveColor = null;
    flowFreeLastHoverKey = null;
    flowFreePendingTarget = null;
    if (flowFreeCatchupFrame !== null) {
        window.cancelAnimationFrame(flowFreeCatchupFrame);
        flowFreeCatchupFrame = null;
    }
    if (!completedOnRelease && activeColor && !flowFreeCompleted.has(activeColor)) {
        despawnFlowFreePath(activeColor);
        return;
    }

    scheduleFlowFreeRender();
}

function animateFlowFreeCellAppearance(row, col, color) {
    const { flowFreeBoard } = dom();
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            const cellElement = flowFreeBoard?.querySelector(`[data-flow-row="${row}"][data-flow-col="${col}"]`);
            if (!cellElement || typeof cellElement.animate !== 'function') {
                return;
            }

            cellElement.animate([
                {
                    transform: 'scale(0.72)',
                    opacity: 0.55,
                    boxShadow: `0 0 0 0 ${color}00`
                },
                {
                    transform: 'scale(1.08)',
                    opacity: 1,
                    boxShadow: `0 0 0 10px ${color}33`
                },
                {
                    transform: 'scale(1)',
                    opacity: 1,
                    boxShadow: `0 0 0 0 ${color}00`
                }
            ], {
                duration: 220,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
            });
        });
    });
}

function animateFlowFreeCompletedPath(path, color) {
    const { flowFreeBoard } = dom();
    flowFreeCompletionAnimationToken += 1;
    const animationToken = flowFreeCompletionAnimationToken;

    const getPathElements = () => path.map((cell) => (
        flowFreeBoard?.querySelector(`[data-flow-row="${cell.row}"][data-flow-col="${cell.col}"]`)
    ));

    const runAnimation = (elements) => {
        if (animationToken !== flowFreeCompletionAnimationToken) {
            return;
        }

        elements.forEach((cellElement, index) => {
            if (!cellElement || typeof cellElement.animate !== 'function') {
                return;
            }

            cellElement.getAnimations?.().forEach((animation) => animation.cancel());
            cellElement.animate([
                {
                    transform: 'scale(1)',
                    boxShadow: `0 0 0 0 ${color}00`,
                    filter: 'brightness(1)'
                },
                {
                    transform: 'scale(1.12)',
                    boxShadow: `0 0 0 12px ${color}40`,
                    filter: 'brightness(1.18)'
                },
                {
                    transform: 'scale(1)',
                    boxShadow: `0 0 0 0 ${color}00`,
                    filter: 'brightness(1)'
                }
            ], {
                duration: 360,
                delay: index * 26,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'both'
            });
        });
    };

    const startWhenReady = (attempt = 0) => {
        if (animationToken !== flowFreeCompletionAnimationToken) {
            return;
        }

        window.requestAnimationFrame(() => {
            if (animationToken !== flowFreeCompletionAnimationToken) {
                return;
            }

            const elements = getPathElements();
            if (elements.some((element) => !element)) {
                if (attempt < 5) {
                    startWhenReady(attempt + 1);
                }
                return;
            }

            runAnimation(elements);
            window.requestAnimationFrame(() => {
                if (animationToken !== flowFreeCompletionAnimationToken) {
                    return;
                }

                runAnimation(elements);
                window.requestAnimationFrame(() => {
                    if (animationToken !== flowFreeCompletionAnimationToken) {
                        return;
                    }

                    runAnimation(elements);
                });
            });
        });
    };

    startWhenReady();

    window.setTimeout(() => {
        if (animationToken !== flowFreeCompletionAnimationToken) {
            return;
        }

        const elements = getPathElements();
        if (elements.some((element) => !element)) {
            return;
        }

        runAnimation(elements);
    }, 48);
}

function processFlowFreePendingPath() {
    flowFreeCatchupFrame = null;
    const stepResult = processFlowFreePendingPathSync();
    if (stepResult !== 'advanced' || !flowFreePendingTarget) {
        return;
    }

    flowFreeCatchupFrame = window.requestAnimationFrame(processFlowFreePendingPath);
}

export function getFlowFreeMenuVisible() { return flowFreeMenuVisible; }
export function setFlowFreeMenuVisible(v) { flowFreeMenuVisible = Boolean(v); }
export function setFlowFreeMenuShowingRules(v) { flowFreeMenuShowingRules = Boolean(v); }
export function getFlowFreeMenuShowingRules() { return flowFreeMenuShowingRules; }
export function getFlowFreeMenuClosing() { return flowFreeMenuClosing; }
export function getFlowFreePointerDown() { return flowFreePointerDown; }
