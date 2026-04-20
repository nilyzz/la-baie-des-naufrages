// Game module — Baie-Man (Pac-Man).
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const PACMAN_LAYOUT = [
    '#############',
    '#...........#',
    '#.###.###.#.#',
    '#...........#',
    '#.###.#.###.#',
    '#.....#.....#',
    '###.#.#.#.###',
    '#...#...#...#',
    '#.#.#####.#.#',
    '#...........#',
    '#.###.#.###.#',
    '#.....#.....#',
    '#############'
];

let pacmanGrid = [];
let pacmanPosition = { row: 1, col: 1 };
let pacmanDirection = { row: 0, col: 0 };
let pacmanNextDirection = { row: 0, col: 0 };
let pacmanGhosts = [];
let pacmanScore = 0;
let pacmanLives = 3;
let pacmanPellets = 0;
let pacmanRunning = false;
let pacmanInterval = null;
let pacmanCountdownActive = false;
let pacmanCountdownTimer = null;
let pacmanCountdownCompleteTimer = null;
let pacmanCellElements = [];
let pacmanHeroElement = null;
let pacmanGhostElements = [];
let pacmanCountdownEl = null;
let pacmanMenuVisible = true;
let pacmanMenuShowingRules = false;
let pacmanMenuClosing = false;
let pacmanMenuEntering = false;
let pacmanMenuResult = null;

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        pacmanBoard: $('pacmanBoard'),
        pacmanTable: $('pacmanTable'),
        pacmanScoreDisplay: $('pacmanScoreDisplay'),
        pacmanLivesDisplay: $('pacmanLivesDisplay'),
        pacmanStartButton: $('pacmanStartButton'),
        pacmanHelpText: $('pacmanHelpText'),
        pacmanMenuOverlay: $('pacmanMenuOverlay'),
        pacmanMenuEyebrow: $('pacmanMenuEyebrow'),
        pacmanMenuTitle: $('pacmanMenuTitle'),
        pacmanMenuText: $('pacmanMenuText'),
        pacmanMenuActionButton: $('pacmanMenuActionButton'),
        pacmanMenuRulesButton: $('pacmanMenuRulesButton')
    };
}

function createPacmanGrid() {
    return PACMAN_LAYOUT.map((row) => row.split('').map((cell) => {
        if (cell === '#') return 'wall';
        if (cell === '.') return 'pellet';
        return 'empty';
    }));
}

function isPacmanWall(row, col) {
    return pacmanGrid[row]?.[col] === 'wall';
}

function resetPacmanActors() {
    pacmanPosition = { row: 1, col: 1 };
    pacmanDirection = { row: 0, col: 0 };
    pacmanNextDirection = { row: 0, col: 0 };
    pacmanGhosts = [
        { row: 7, col: 6, direction: { row: 0, col: -1 }, className: 'ghost-a' },
        { row: 7, col: 5, direction: { row: 0, col: 1 }, className: 'ghost-b' },
        { row: 7, col: 7, direction: { row: -1, col: 0 }, className: 'ghost-c' }
    ];
}

export function updatePacmanHud() {
    const { pacmanScoreDisplay, pacmanLivesDisplay, pacmanStartButton } = dom();
    if (pacmanScoreDisplay) pacmanScoreDisplay.textContent = String(pacmanScore);
    if (pacmanLivesDisplay) pacmanLivesDisplay.textContent = String(pacmanLives);
    if (pacmanStartButton) pacmanStartButton.textContent = (pacmanRunning || pacmanCountdownActive) ? 'Chasse en cours' : 'Lancer la chasse';
}

function getPacmanRotation() {
    if (pacmanDirection.col === 1) return '90deg';
    if (pacmanDirection.col === -1) return '-90deg';
    if (pacmanDirection.row === -1) return '0deg';
    if (pacmanDirection.row === 1) return '180deg';
    return '90deg';
}

function clearPacmanCountdownTimers() {
    if (pacmanCountdownTimer) {
        window.clearTimeout(pacmanCountdownTimer);
        pacmanCountdownTimer = null;
    }
    if (pacmanCountdownCompleteTimer) {
        window.clearTimeout(pacmanCountdownCompleteTimer);
        pacmanCountdownCompleteTimer = null;
    }
}

function hidePacmanCountdown() {
    clearPacmanCountdownTimers();
    if (!pacmanCountdownEl) return;
    pacmanCountdownEl.textContent = '';
    pacmanCountdownEl.classList.add('hidden');
    pacmanCountdownEl.setAttribute('aria-hidden', 'true');
}

function showPacmanCountdownValue(label) {
    if (!pacmanCountdownEl) return;
    pacmanCountdownEl.textContent = label;
    pacmanCountdownEl.classList.remove('hidden');
    pacmanCountdownEl.setAttribute('aria-hidden', 'false');
}

function startPacmanCountdown(onComplete) {
    clearPacmanCountdownTimers();
    pacmanCountdownActive = true;
    updatePacmanHud();

    const sequence = ['3', '2', '1', 'Partez'];
    let stepIndex = 0;

    const runStep = () => {
        showPacmanCountdownValue(sequence[stepIndex]);

        if (stepIndex === sequence.length - 1) {
            pacmanCountdownCompleteTimer = window.setTimeout(() => {
                hidePacmanCountdown();
                pacmanCountdownActive = false;
                updatePacmanHud();
                onComplete?.();
            }, 460);
            return;
        }

        stepIndex += 1;
        pacmanCountdownTimer = window.setTimeout(runStep, 620);
    };

    runStep();
}

function buildPacmanBoard() {
    const { pacmanBoard } = dom();
    if (!pacmanBoard) return;
    const rows = pacmanGrid.length;
    const cols = pacmanGrid[0].length;
    pacmanBoard.style.setProperty('--pacman-cols', String(cols));
    pacmanBoard.innerHTML = `
        <div id="pacmanCountdown" class="pacman-countdown hidden" aria-hidden="true"></div>
        <div class="pacman-grid">
            ${Array.from({ length: rows * cols }, (_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const cell = pacmanGrid[row][col];

        return `
            <div class="pacman-cell pacman-cell-${cell}" data-row="${row}" data-col="${col}">
                ${cell === 'pellet' ? '<span class="pacman-pellet" aria-hidden="true"></span>' : ''}
            </div>
        `;
            }).join('')}
        </div>
        <div class="pacman-overlay" aria-hidden="true">
            <span class="pacman-hero"></span>
            ${pacmanGhosts.map((ghost) => `<span class="pacman-ghost ${ghost.className}"></span>`).join('')}
        </div>
    `;

    pacmanCellElements = Array.from(pacmanBoard.querySelectorAll('.pacman-cell'));
    pacmanCountdownEl = pacmanBoard.querySelector('#pacmanCountdown');
    pacmanHeroElement = pacmanBoard.querySelector('.pacman-hero');
    pacmanGhostElements = Array.from(pacmanBoard.querySelectorAll('.pacman-ghost'));
    hidePacmanCountdown();
}

function getPacmanGeometry() {
    const { pacmanBoard } = dom();
    const styles = window.getComputedStyle(pacmanBoard);
    const gap = parseFloat(styles.getPropertyValue('--pacman-gap')) || 4;
    const padding = parseFloat(styles.getPropertyValue('--pacman-padding')) || 10;
    const cols = pacmanGrid[0].length;
    const innerSize = pacmanBoard.clientWidth - (padding * 2);
    const cellSize = (innerSize - (gap * (cols - 1))) / cols;

    return { gap, padding, cellSize };
}

function placePacmanEntity(element, row, col, geometry) {
    if (!element) return;
    const isGhost = element.classList.contains('pacman-ghost');
    const sizeMultiplier = isGhost ? 0.76 : 1;
    const entitySize = geometry.cellSize * sizeMultiplier;
    const centerOffset = (geometry.cellSize - entitySize) / 2;
    const offsetX = (col * (geometry.cellSize + geometry.gap)) + centerOffset;
    const offsetY = (row * (geometry.cellSize + geometry.gap)) + centerOffset;
    element.style.width = `${entitySize}px`;
    element.style.height = `${entitySize}px`;
    element.style.setProperty('--pacman-x', `${offsetX}px`);
    element.style.setProperty('--pacman-y', `${offsetY}px`);
}

export function renderPacman() {
    const { pacmanBoard } = dom();
    if (!pacmanBoard) return;
    if (!pacmanBoard.querySelector('.pacman-grid')) {
        buildPacmanBoard();
    }

    pacmanCellElements.forEach((cellElement) => {
        const row = Number(cellElement.dataset.row);
        const col = Number(cellElement.dataset.col);
        const hasPellet = pacmanGrid[row][col] === 'pellet';
        cellElement.classList.toggle('pacman-cell-empty', pacmanGrid[row][col] === 'empty');
        cellElement.classList.toggle('pacman-cell-pellet', hasPellet);

        const pellet = cellElement.querySelector('.pacman-pellet');

        if (pellet) {
            pellet.classList.toggle('hidden', !hasPellet);
        }
    });

    const geometry = getPacmanGeometry();
    placePacmanEntity(pacmanHeroElement, pacmanPosition.row, pacmanPosition.col, geometry);
    pacmanHeroElement?.style.setProperty('--pacman-rotation', getPacmanRotation());
    pacmanGhosts.forEach((ghost, index) => {
        placePacmanEntity(pacmanGhostElements[index], ghost.row, ghost.col, geometry);
    });

    updatePacmanHud();
}

export function stopPacman() {
    clearPacmanCountdownTimers();
    pacmanCountdownActive = false;
    hidePacmanCountdown();

    if (pacmanInterval) {
        window.clearInterval(pacmanInterval);
        pacmanInterval = null;
    }

    pacmanRunning = false;
    updatePacmanHud();
}

export function trySetPacmanDirection(direction) {
    const nextRow = pacmanPosition.row + direction.row;
    const nextCol = pacmanPosition.col + direction.col;

    if (!isPacmanWall(nextRow, nextCol)) {
        pacmanDirection = direction;
        return true;
    }

    return false;
}

function movePacmanGhost(ghost) {
    const options = [
        ghost.direction,
        { row: 1, col: 0 },
        { row: -1, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: -1 }
    ].filter((direction, index, array) => direction
        && array.findIndex((candidate) => candidate.row === direction.row && candidate.col === direction.col) === index)
        .filter((direction) => !isPacmanWall(ghost.row + direction.row, ghost.col + direction.col));

    const preferred = options.find((direction) => ghost.row + direction.row === pacmanPosition.row
        || ghost.col + direction.col === pacmanPosition.col);
    const nextDirection = preferred || options[Math.floor(Math.random() * options.length)] || ghost.direction;

    ghost.direction = nextDirection;
    ghost.row += nextDirection.row;
    ghost.col += nextDirection.col;
}

function resetPacmanAfterHit() {
    stopPacman();
    resetPacmanActors();
    const { pacmanHelpText } = dom();
    if (pacmanHelpText) {
        pacmanHelpText.textContent = pacmanLives > 0
            ? "Un esprit t'a touché. Relance la chasse pour reprendre la baie."
            : "Les esprits du brouillard t'ont rattrapé.";
    }
    renderPacman();

    if (pacmanLives > 0) {
        startPacmanCountdown(() => {
            pacmanRunning = true;
            updatePacmanHud();
            pacmanInterval = window.setInterval(runPacmanTick, 220);
        });
    }
}

function handlePacmanCollision(previousPacmanPosition = pacmanPosition, previousGhostPositions = pacmanGhosts) {
    const touched = pacmanGhosts.some((ghost, index) => {
        const previousGhostPosition = previousGhostPositions[index] || ghost;
        const sameCellNow = ghost.row === pacmanPosition.row && ghost.col === pacmanPosition.col;
        const crossedPaths = previousGhostPosition.row === pacmanPosition.row
            && previousGhostPosition.col === pacmanPosition.col
            && ghost.row === previousPacmanPosition.row
            && ghost.col === previousPacmanPosition.col;

        return sameCellNow || crossedPaths;
    });

    if (!touched) {
        return false;
    }

    pacmanLives -= 1;

    if (pacmanLives <= 0) {
        resetPacmanAfterHit();
        revealPacmanOutcomeMenu(
            'Chasse terminée',
            `Les esprits du brouillard t'ont capturé. Perles ramassées : ${pacmanScore}.`,
            'Cap sur le port'
        );
        return true;
    }

    resetPacmanAfterHit();
    return true;
}

function runPacmanTick() {
    if (!pacmanRunning || pacmanCountdownActive) {
        return;
    }

    const previousPacmanPosition = { ...pacmanPosition };
    const previousGhostPositions = pacmanGhosts.map((ghost) => ({ row: ghost.row, col: ghost.col }));

    if (pacmanNextDirection.row !== 0 || pacmanNextDirection.col !== 0) {
        trySetPacmanDirection(pacmanNextDirection);
    }

    if (pacmanDirection.row !== 0 || pacmanDirection.col !== 0) {
        const nextRow = pacmanPosition.row + pacmanDirection.row;
        const nextCol = pacmanPosition.col + pacmanDirection.col;

        if (!isPacmanWall(nextRow, nextCol)) {
            pacmanPosition = { row: nextRow, col: nextCol };
        }
    }

    if (pacmanGrid[pacmanPosition.row][pacmanPosition.col] === 'pellet') {
        pacmanGrid[pacmanPosition.row][pacmanPosition.col] = 'empty';
        pacmanScore += 10;
        pacmanPellets -= 1;
    }

    if (handlePacmanCollision(previousPacmanPosition, previousGhostPositions)) {
        return;
    }

    pacmanGhosts.forEach((ghost) => {
        movePacmanGhost(ghost);
    });

    if (handlePacmanCollision(previousPacmanPosition, previousGhostPositions)) {
        return;
    }

    if (pacmanPellets === 0) {
        stopPacman();
        const { pacmanHelpText } = dom();
        if (pacmanHelpText) pacmanHelpText.textContent = 'La baie est nettoyée. Plus aucune perle à  ramasser.';
        revealPacmanOutcomeMenu(
            'Port nettoyé',
            `Toutes les perles de la baie ont été ramassées. Score final : ${pacmanScore}.`,
            'Chasse réussie'
        );
    }

    renderPacman();
}

export function getPacmanRulesText() {
    return 'D\u00e9place Baie-Man avec les fl\u00e8ches ou ZQSD. Ramasse toutes les perles du labyrinthe pour nettoyer le port. Si un esprit du brouillard te rattrape, tu perds une vie. Trois captures et la chasse s\u2019arr\u00eate.';
}

export function renderPacmanMenu() {
    const { pacmanMenuOverlay, pacmanTable, pacmanMenuEyebrow, pacmanMenuTitle, pacmanMenuText, pacmanMenuActionButton, pacmanMenuRulesButton } = dom();
    if (!pacmanMenuOverlay || !pacmanTable) {
        return;
    }

    syncGameMenuOverlayBounds(pacmanMenuOverlay, pacmanTable);
    pacmanMenuOverlay.classList.toggle('hidden', !pacmanMenuVisible);
    pacmanMenuOverlay.classList.toggle('is-closing', pacmanMenuClosing);
    pacmanMenuOverlay.classList.toggle('is-entering', pacmanMenuEntering);
    pacmanTable.classList.toggle('is-menu-open', pacmanMenuVisible);

    if (!pacmanMenuVisible) {
        return;
    }

    const hasResult = Boolean(pacmanMenuResult);

    if (pacmanMenuEyebrow) {
        pacmanMenuEyebrow.textContent = pacmanMenuShowingRules
            ? 'R\u00e8gles'
            : (hasResult ? pacmanMenuResult.eyebrow : 'Labyrinthe du port');
    }

    if (pacmanMenuTitle) {
        pacmanMenuTitle.textContent = pacmanMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult ? pacmanMenuResult.title : 'Baie-Man');
    }

    if (pacmanMenuText) {
        pacmanMenuText.textContent = pacmanMenuShowingRules
            ? getPacmanRulesText()
            : (hasResult
                ? pacmanMenuResult.text
                : 'Ramasse toutes les perles de la baie sans te faire attraper par les esprits du brouillard.');
    }

    if (pacmanMenuActionButton) {
        pacmanMenuActionButton.textContent = pacmanMenuShowingRules
            ? 'Retour'
            : (hasResult ? 'Relancer la chasse' : 'Lancer la chasse');
    }

    if (pacmanMenuRulesButton) {
        pacmanMenuRulesButton.textContent = 'R\u00e8gles';
        pacmanMenuRulesButton.hidden = pacmanMenuShowingRules;
    }
}

export function closePacmanMenu() {
    pacmanMenuClosing = true;
    renderPacmanMenu();
    window.setTimeout(() => {
        pacmanMenuClosing = false;
        pacmanMenuVisible = false;
        pacmanMenuShowingRules = false;
        pacmanMenuEntering = false;
        pacmanMenuResult = null;
        renderPacmanMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealPacmanOutcomeMenu(title, text, eyebrow) {
    pacmanMenuVisible = true;
    pacmanMenuResult = { title, text, eyebrow };
    pacmanMenuShowingRules = false;
    pacmanMenuClosing = false;
    pacmanMenuEntering = true;

    const { pacmanHelpText } = dom();
    if (pacmanHelpText) {
        pacmanHelpText.textContent = text;
    }

    renderPacmanMenu();
    window.setTimeout(() => {
        pacmanMenuEntering = false;
        renderPacmanMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializePacman() {
    closeGameOverModal();
    stopPacman();
    pacmanGrid = createPacmanGrid();
    pacmanScore = 0;
    pacmanLives = 3;
    pacmanMenuResult = null;
    pacmanMenuShowingRules = false;
    pacmanMenuClosing = false;
    pacmanMenuEntering = false;
    const { pacmanHelpText } = dom();
    if (pacmanHelpText) pacmanHelpText.textContent = 'Ramasse toutes les perles de la baie sans te faire attraper par les esprits du brouillard.';
    resetPacmanActors();
    if (pacmanGrid[pacmanPosition.row][pacmanPosition.col] === 'pellet') {
        pacmanGrid[pacmanPosition.row][pacmanPosition.col] = 'empty';
    }
    pacmanPellets = pacmanGrid.flat().filter((cell) => cell === 'pellet').length;
    buildPacmanBoard();
    renderPacman();
    renderPacmanMenu();
}

export function startPacman() {
    closeGameOverModal();

    if (pacmanRunning || pacmanCountdownActive) {
        return;
    }

    if (pacmanLives <= 0 || pacmanPellets <= 0) {
        initializePacman();
    }

    startPacmanCountdown(() => {
        pacmanRunning = true;
        updatePacmanHud();
        pacmanInterval = window.setInterval(runPacmanTick, 220);
    });
}

export function setPacmanNextDirection(d) { pacmanNextDirection = d; }
export function getPacmanRunning() { return pacmanRunning; }
export function getPacmanMenuVisible() { return pacmanMenuVisible; }
export function setPacmanMenuVisible(v) { pacmanMenuVisible = Boolean(v); }
export function setPacmanMenuShowingRules(v) { pacmanMenuShowingRules = Boolean(v); }
export function getPacmanMenuShowingRules() { return pacmanMenuShowingRules; }
export function getPacmanMenuClosing() { return pacmanMenuClosing; }
