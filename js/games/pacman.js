// Game module — Baie-Man (Pac-Man) — remaster v2.44

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

// ── Map (21 × 21) ──────────────────────────────────────────────────────────
// # wall  . pellet  O power-pellet  D ghost-door  G ghost-spawn  (space) empty
export const PACMAN_LAYOUT = [
    '#####################',
    '#.........#.........#',
    '#.###.###.#.###.###.#',
    '#O.................O#',
    '#.###.###.#.###.###.#',
    '#...................#',
    '#.###.#.#####.#.###.#',
    '#.###.#.#####.#.###.#',
    '#.....#.......#.....#',
    '#####.###DDD###.#####',
    '      # GGGGG #      ',
    '#####.#########.#####',
    '#.....#.......#.....#',
    '#.###.#.#####.#.###.#',
    '#.###.#.#####.#.###.#',
    '#...................#',
    '#.###.###.#.###.###.#',
    '#O.................O#',
    '#.###.###.#.###.###.#',
    '#.........#.........#',
    '#####################',
];

const GRID_ROWS = 21;
const GRID_COLS = 21;
const TUNNEL_ROW = 10;
const GHOST_HOUSE_ROW = 10;
const GHOST_HOUSE_EXIT_COL = 10;
const FRIGHTENED_DURATION = 38;
const FRIGHTENED_FLASH_AT = 10;
const GAME_TICK_MS = 180;

const GHOST_DEFS = [
    { id: 'ghost-a', ai: 'blinky', startRow: 10, startCol: 10, startDir: { row: 0, col: 1 },  releaseDelay: 0  },
    { id: 'ghost-b', ai: 'pinky',  startRow: 10, startCol: 10, startDir: { row: 0, col: -1 }, releaseDelay: 5  },
    { id: 'ghost-c', ai: 'inky',   startRow: 10, startCol: 8,  startDir: { row: 0, col: 1 },  releaseDelay: 12 },
    { id: 'ghost-d', ai: 'clyde',  startRow: 10, startCol: 12, startDir: { row: 0, col: -1 }, releaseDelay: 20 },
];

const SCATTER_TARGETS = {
    blinky: { row: 0,  col: 20 },
    pinky:  { row: 0,  col: 0  },
    inky:   { row: 20, col: 20 },
    clyde:  { row: 20, col: 0  },
};

// ── State ───────────────────────────────────────────────────────────────────
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
let pacmanFrightenedTimer = 0;
let pacmanGhostEatenCombo = 0;

// ── DOM helpers ─────────────────────────────────────────────────────────────
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
        pacmanMenuRulesButton: $('pacmanMenuRulesButton'),
    };
}

// ── Grid helpers ─────────────────────────────────────────────────────────────
function createPacmanGrid() {
    return PACMAN_LAYOUT.map((row) => row.split('').map((c) => {
        if (c === '#') return 'wall';
        if (c === '.') return 'pellet';
        if (c === 'O') return 'power';
        if (c === 'D') return 'door';
        if (c === 'G') return 'spawn';
        return 'empty';
    }));
}

function getNextPos(row, col, dir) {
    let nr = row + dir.row;
    let nc = col + dir.col;
    if (row === TUNNEL_ROW || nr === TUNNEL_ROW) {
        if (nc < 0) nc = GRID_COLS - 1;
        else if (nc >= GRID_COLS) nc = 0;
    }
    return { row: nr, col: nc };
}

function isPacmanWall(row, col) {
    const c = pacmanGrid[row]?.[col];
    return !c || c === 'wall' || c === 'door' || c === 'spawn';
}

function isGhostWall(row, col, ghost) {
    const c = pacmanGrid[row]?.[col];
    if (!c || c === 'wall') return true;
    if (c === 'door')  return ghost.state !== 'leaving' && ghost.state !== 'eaten';
    if (c === 'spawn') return ghost.state !== 'house'   && ghost.state !== 'leaving' && ghost.state !== 'eaten';
    return false;
}

// ── BFS (for eaten-ghost navigation) ────────────────────────────────────────
function bfsNextMove(startRow, startCol, targetRow, targetCol, ghost) {
    if (startRow === targetRow && startCol === targetCol) return { row: 0, col: 0 };
    const queue = [{ row: startRow, col: startCol, firstMove: null }];
    const visited = new Set([`${startRow},${startCol}`]);
    const DIRS = [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }];
    while (queue.length) {
        const { row, col, firstMove } = queue.shift();
        for (const d of DIRS) {
            const next = getNextPos(row, col, d);
            if (next.row < 0 || next.row >= GRID_ROWS) continue;
            const key = `${next.row},${next.col}`;
            if (visited.has(key) || isGhostWall(next.row, next.col, ghost)) continue;
            const move = firstMove || d;
            if (next.row === targetRow && next.col === targetCol) return move;
            visited.add(key);
            queue.push({ row: next.row, col: next.col, firstMove: move });
        }
    }
    return null;
}

// ── Ghost AI ─────────────────────────────────────────────────────────────────
function getGhostTarget(ghost) {
    const blinky = pacmanGhosts[0]; // always index 0
    switch (ghost.ai) {
        case 'blinky':
            return { row: pacmanPosition.row, col: pacmanPosition.col };
        case 'pinky': {
            const ahead = 4;
            return {
                row: Math.max(0, Math.min(GRID_ROWS - 1, pacmanPosition.row + pacmanDirection.row * ahead)),
                col: Math.max(0, Math.min(GRID_COLS - 1, pacmanPosition.col + pacmanDirection.col * ahead)),
            };
        }
        case 'inky': {
            const pivot = {
                row: pacmanPosition.row + pacmanDirection.row * 2,
                col: pacmanPosition.col + pacmanDirection.col * 2,
            };
            return {
                row: Math.max(0, Math.min(GRID_ROWS - 1, pivot.row + (pivot.row - blinky.row))),
                col: Math.max(0, Math.min(GRID_COLS - 1, pivot.col + (pivot.col - blinky.col))),
            };
        }
        case 'clyde': {
            const dist = Math.abs(ghost.row - pacmanPosition.row) + Math.abs(ghost.col - pacmanPosition.col);
            return dist > 8
                ? { row: pacmanPosition.row, col: pacmanPosition.col }
                : SCATTER_TARGETS.clyde;
        }
        default: return { row: pacmanPosition.row, col: pacmanPosition.col };
    }
}

const MOVE_DIRS = [{ row: -1, col: 0 }, { row: 0, col: -1 }, { row: 1, col: 0 }, { row: 0, col: 1 }];

function moveGhostNormal(ghost) {
    const target = getGhostTarget(ghost);
    const reverse = { row: -ghost.direction.row, col: -ghost.direction.col };
    const options = MOVE_DIRS.filter((d) => {
        if (d.row === reverse.row && d.col === reverse.col) return false;
        const n = getNextPos(ghost.row, ghost.col, d);
        return !isGhostWall(n.row, n.col, ghost);
    });
    if (!options.length) return;
    let best = options[0];
    let bestDist = Infinity;
    for (const d of options) {
        const n = getNextPos(ghost.row, ghost.col, d);
        const dist = Math.abs(n.row - target.row) + Math.abs(n.col - target.col);
        if (dist < bestDist) { bestDist = dist; best = d; }
    }
    const n = getNextPos(ghost.row, ghost.col, best);
    ghost.row = n.row; ghost.col = n.col; ghost.direction = best;
}

function moveGhostFrightened(ghost) {
    const options = MOVE_DIRS.filter((d) => {
        const n = getNextPos(ghost.row, ghost.col, d);
        return !isGhostWall(n.row, n.col, ghost);
    });
    if (!options.length) return;
    const d = options[Math.floor(Math.random() * options.length)];
    const n = getNextPos(ghost.row, ghost.col, d);
    ghost.row = n.row; ghost.col = n.col; ghost.direction = d;
}

function moveGhostLeaving(ghost) {
    if (ghost.col !== GHOST_HOUSE_EXIT_COL) {
        const dc = ghost.col < GHOST_HOUSE_EXIT_COL ? 1 : -1;
        ghost.col += dc;
        ghost.direction = { row: 0, col: dc };
    } else {
        ghost.row -= 1;
        ghost.direction = { row: -1, col: 0 };
        const cell = pacmanGrid[ghost.row]?.[ghost.col];
        if (cell !== 'door' && cell !== 'spawn') ghost.state = 'normal';
    }
}

function moveGhostEaten(ghost) {
    if (ghost.row === GHOST_HOUSE_ROW && ghost.col === GHOST_HOUSE_EXIT_COL) {
        ghost.state = 'house';
        ghost.releaseDelay = 6;
        ghost.direction = { row: 0, col: 1 };
        return;
    }
    const move = bfsNextMove(ghost.row, ghost.col, GHOST_HOUSE_ROW, GHOST_HOUSE_EXIT_COL, ghost);
    if (move) {
        const n = getNextPos(ghost.row, ghost.col, move);
        ghost.row = n.row; ghost.col = n.col; ghost.direction = move;
    }
}

function moveGhost(ghost) {
    switch (ghost.state) {
        case 'house':
            ghost.releaseDelay--;
            if (ghost.releaseDelay <= 0) {
                ghost.state = 'leaving';
            } else {
                const dc = ghost.direction.col || 1;
                const nc = ghost.col + dc;
                if (!isGhostWall(GHOST_HOUSE_ROW, nc, ghost)) {
                    ghost.col = nc;
                } else {
                    const ndc = -dc;
                    const nc2 = ghost.col + ndc;
                    if (!isGhostWall(GHOST_HOUSE_ROW, nc2, ghost)) {
                        ghost.col = nc2;
                        ghost.direction = { row: 0, col: ndc };
                    }
                }
            }
            break;
        case 'leaving':   moveGhostLeaving(ghost);   break;
        case 'normal':    moveGhostNormal(ghost);     break;
        case 'frightened':moveGhostFrightened(ghost); break;
        case 'eaten':     moveGhostEaten(ghost);      break;
    }
}

// ── Actors reset ──────────────────────────────────────────────────────────────
function resetPacmanActors() {
    pacmanPosition    = { row: 1, col: 1 };
    pacmanDirection   = { row: 0, col: 0 };
    pacmanNextDirection = { row: 0, col: 0 };
    pacmanFrightenedTimer = 0;
    pacmanGhostEatenCombo = 0;
    pacmanGhosts = GHOST_DEFS.map((def) => ({
        id: def.id,
        ai: def.ai,
        row: def.startRow,
        col: def.startCol,
        direction: { ...def.startDir },
        state: 'house',
        releaseDelay: def.releaseDelay,
    }));
}

// ── HUD ───────────────────────────────────────────────────────────────────────
export function updatePacmanHud() {
    const { pacmanScoreDisplay, pacmanLivesDisplay, pacmanStartButton } = dom();
    if (pacmanScoreDisplay) pacmanScoreDisplay.textContent = String(pacmanScore);
    if (pacmanLivesDisplay) pacmanLivesDisplay.textContent = String(pacmanLives);
    if (pacmanStartButton) {
        pacmanStartButton.textContent = (pacmanRunning || pacmanCountdownActive)
            ? 'Chasse en cours' : 'Lancer la chasse';
    }
}

function getPacmanRotation() {
    if (pacmanDirection.col === 1)  return '90deg';
    if (pacmanDirection.col === -1) return '-90deg';
    if (pacmanDirection.row === -1) return '0deg';
    if (pacmanDirection.row === 1)  return '180deg';
    return '90deg';
}

// ── Countdown ────────────────────────────────────────────────────────────────
function clearPacmanCountdownTimers() {
    if (pacmanCountdownTimer)         { window.clearTimeout(pacmanCountdownTimer);         pacmanCountdownTimer = null; }
    if (pacmanCountdownCompleteTimer) { window.clearTimeout(pacmanCountdownCompleteTimer); pacmanCountdownCompleteTimer = null; }
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
    let i = 0;
    const runStep = () => {
        showPacmanCountdownValue(sequence[i]);
        if (i === sequence.length - 1) {
            pacmanCountdownCompleteTimer = window.setTimeout(() => {
                hidePacmanCountdown();
                pacmanCountdownActive = false;
                updatePacmanHud();
                onComplete?.();
            }, 460);
            return;
        }
        i++;
        pacmanCountdownTimer = window.setTimeout(runStep, 620);
    };
    runStep();
}

// ── Board build ───────────────────────────────────────────────────────────────
function buildPacmanBoard() {
    const { pacmanBoard } = dom();
    if (!pacmanBoard) return;
    const rows = pacmanGrid.length;
    const cols = pacmanGrid[0].length;
    pacmanBoard.style.setProperty('--pacman-cols', String(cols));

    const cellsHtml = Array.from({ length: rows * cols }, (_, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const cell = pacmanGrid[r][c];
        const hasDot = cell === 'pellet' || cell === 'power';
        return `<div class="pacman-cell pacman-cell-${cell}" data-row="${r}" data-col="${c}">${hasDot ? '<span class="pacman-pellet" aria-hidden="true"></span>' : ''}</div>`;
    }).join('');

    pacmanBoard.innerHTML = `
        <div id="pacmanCountdown" class="pacman-countdown hidden" aria-hidden="true"></div>
        <div class="pacman-grid">${cellsHtml}</div>
        <div class="pacman-overlay" aria-hidden="true">
            <span class="pacman-hero"></span>
            ${pacmanGhosts.map((g) => `<span class="pacman-ghost ${g.id}"></span>`).join('')}
        </div>`;

    pacmanCellElements  = Array.from(pacmanBoard.querySelectorAll('.pacman-cell'));
    pacmanCountdownEl   = pacmanBoard.querySelector('#pacmanCountdown');
    pacmanHeroElement   = pacmanBoard.querySelector('.pacman-hero');
    pacmanGhostElements = Array.from(pacmanBoard.querySelectorAll('.pacman-ghost'));
    hidePacmanCountdown();
}

function getPacmanGeometry() {
    const { pacmanBoard } = dom();
    const styles = window.getComputedStyle(pacmanBoard);
    const gap     = parseFloat(styles.getPropertyValue('--pacman-gap'))     || 2;
    const padding = parseFloat(styles.getPropertyValue('--pacman-padding')) || 8;
    const cols    = pacmanGrid[0].length;
    const inner   = pacmanBoard.clientWidth - padding * 2;
    const cellSize = (inner - gap * (cols - 1)) / cols;
    return { gap, padding, cellSize };
}

function placePacmanEntity(el, row, col, geo) {
    if (!el) return;
    const isGhost = el.classList.contains('pacman-ghost');
    const mult = isGhost ? 0.78 : 1;
    const size = geo.cellSize * mult;
    const center = (geo.cellSize - size) / 2;
    el.style.width  = `${size}px`;
    el.style.height = `${size}px`;
    el.style.setProperty('--pacman-x', `${col * (geo.cellSize + geo.gap) + center}px`);
    el.style.setProperty('--pacman-y', `${row * (geo.cellSize + geo.gap) + center}px`);
}

// ── Render ────────────────────────────────────────────────────────────────────
export function renderPacman() {
    const { pacmanBoard } = dom();
    if (!pacmanBoard) return;
    if (!pacmanBoard.querySelector('.pacman-grid')) buildPacmanBoard();

    pacmanCellElements.forEach((el) => {
        const r = Number(el.dataset.row);
        const c = Number(el.dataset.col);
        const cell = pacmanGrid[r][c];
        // Update class efficiently
        el.className = `pacman-cell pacman-cell-${cell}`;
        el.dataset.row = r;
        el.dataset.col = c;
        const dot = el.querySelector('.pacman-pellet');
        const hasDot = cell === 'pellet' || cell === 'power';
        if (hasDot && !dot) {
            const s = document.createElement('span');
            s.className = 'pacman-pellet';
            s.setAttribute('aria-hidden', 'true');
            el.appendChild(s);
        } else if (dot) {
            dot.classList.toggle('hidden', !hasDot);
        }
    });

    const geo = getPacmanGeometry();

    placePacmanEntity(pacmanHeroElement, pacmanPosition.row, pacmanPosition.col, geo);
    pacmanHeroElement?.style.setProperty('--pacman-rotation', getPacmanRotation());

    pacmanGhosts.forEach((ghost, i) => {
        const el = pacmanGhostElements[i];
        if (!el) return;
        el.classList.remove('is-frightened', 'is-frightened-flash', 'is-eaten');
        if (ghost.state === 'frightened') {
            el.classList.add(pacmanFrightenedTimer <= FRIGHTENED_FLASH_AT ? 'is-frightened-flash' : 'is-frightened');
        } else if (ghost.state === 'eaten') {
            el.classList.add('is-eaten');
        }
        placePacmanEntity(el, ghost.row, ghost.col, geo);
    });

    updatePacmanHud();
}

// ── Stop ──────────────────────────────────────────────────────────────────────
export function stopPacman() {
    clearPacmanCountdownTimers();
    pacmanCountdownActive = false;
    hidePacmanCountdown();
    if (pacmanInterval) { window.clearInterval(pacmanInterval); pacmanInterval = null; }
    pacmanRunning = false;
    updatePacmanHud();
}

// ── Direction ─────────────────────────────────────────────────────────────────
export function trySetPacmanDirection(direction) {
    const n = getNextPos(pacmanPosition.row, pacmanPosition.col, direction);
    if (!isPacmanWall(n.row, n.col)) { pacmanDirection = direction; return true; }
    return false;
}

// ── Collision ─────────────────────────────────────────────────────────────────
function handlePacmanCollision() {
    for (const ghost of pacmanGhosts) {
        if (ghost.state === 'eaten' || ghost.state === 'house' || ghost.state === 'leaving') continue;
        if (ghost.row !== pacmanPosition.row || ghost.col !== pacmanPosition.col) continue;

        if (ghost.state === 'frightened') {
            ghost.state = 'eaten';
            const pts = 200 * (1 << Math.min(pacmanGhostEatenCombo, 3));
            pacmanScore += pts;
            pacmanGhostEatenCombo++;
            return false;
        }

        // Normal ghost — lose life
        pacmanLives--;
        if (pacmanLives <= 0) {
            resetPacmanAfterHit();
            revealPacmanOutcomeMenu(
                'Chasse terminée',
                `Les esprits du brouillard t’ont capturé. Perles ramassées : ${pacmanScore}.`,
                'Cap sur le port'
            );
            return true;
        }
        resetPacmanAfterHit();
        return true;
    }
    return false;
}

function resetPacmanAfterHit() {
    stopPacman();
    resetPacmanActors();
    const { pacmanHelpText } = dom();
    if (pacmanHelpText) {
        pacmanHelpText.textContent = pacmanLives > 0
            ? "Un esprit t’a touché. Relance la chasse pour reprendre la baie."
            : "Les esprits du brouillard t’ont rattrapé.";
    }
    renderPacman();
    if (pacmanLives > 0) {
        startPacmanCountdown(() => {
            pacmanRunning = true;
            updatePacmanHud();
            pacmanInterval = window.setInterval(runPacmanTick, GAME_TICK_MS);
        });
    }
}

// ── Game tick ─────────────────────────────────────────────────────────────────
function runPacmanTick() {
    if (!pacmanRunning || pacmanCountdownActive) return;

    // Frightened timer
    if (pacmanFrightenedTimer > 0) {
        pacmanFrightenedTimer--;
        if (pacmanFrightenedTimer === 0) {
            pacmanGhosts.forEach((g) => { if (g.state === 'frightened') g.state = 'normal'; });
            pacmanGhostEatenCombo = 0;
        }
    }

    // Player direction
    if (pacmanNextDirection.row !== 0 || pacmanNextDirection.col !== 0) {
        trySetPacmanDirection(pacmanNextDirection);
    }

    // Player movement
    if (pacmanDirection.row !== 0 || pacmanDirection.col !== 0) {
        const n = getNextPos(pacmanPosition.row, pacmanPosition.col, pacmanDirection);
        if (!isPacmanWall(n.row, n.col)) pacmanPosition = n;
    }

    // Collect pellet
    const cell = pacmanGrid[pacmanPosition.row][pacmanPosition.col];
    if (cell === 'pellet') {
        pacmanGrid[pacmanPosition.row][pacmanPosition.col] = 'empty';
        pacmanScore += 10;
        pacmanPellets--;
    } else if (cell === 'power') {
        pacmanGrid[pacmanPosition.row][pacmanPosition.col] = 'empty';
        pacmanScore += 50;
        pacmanPellets--;
        pacmanFrightenedTimer = FRIGHTENED_DURATION;
        pacmanGhostEatenCombo = 0;
        pacmanGhosts.forEach((g) => {
            if (g.state === 'normal') {
                g.state = 'frightened';
                g.direction = { row: -g.direction.row, col: -g.direction.col };
            }
        });
    }

    if (handlePacmanCollision()) return;

    pacmanGhosts.forEach(moveGhost);

    if (handlePacmanCollision()) return;

    if (pacmanPellets === 0) {
        stopPacman();
        const { pacmanHelpText } = dom();
        if (pacmanHelpText) pacmanHelpText.textContent = 'La baie est nettoyée !';
        revealPacmanOutcomeMenu(
            'Port nettoyé',
            `Toutes les perles de la baie ont été ramassées. Score final : ${pacmanScore}.`,
            'Chasse réussie'
        );
        return;
    }

    renderPacman();
}

// ── Menu ──────────────────────────────────────────────────────────────────────
export function getPacmanRulesText() {
    return 'Déplace Baie-Man avec les flèches ou ZQSD. Ramasse toutes les perles du labyrinthe. Les grosses perles lumineuses rendent les esprits vulnérables : fonce dessus ! Trois captures et la chasse s’arrête.';
}

export function renderPacmanMenu() {
    const { pacmanMenuOverlay, pacmanTable, pacmanMenuEyebrow, pacmanMenuTitle, pacmanMenuText, pacmanMenuActionButton, pacmanMenuRulesButton } = dom();
    if (!pacmanMenuOverlay || !pacmanTable) return;

    syncGameMenuOverlayBounds(pacmanMenuOverlay, pacmanTable);
    pacmanMenuOverlay.classList.toggle('hidden', !pacmanMenuVisible);
    pacmanMenuOverlay.classList.toggle('is-closing', pacmanMenuClosing);
    pacmanMenuOverlay.classList.toggle('is-entering', pacmanMenuEntering);
    pacmanTable.classList.toggle('is-menu-open', pacmanMenuVisible);

    if (!pacmanMenuVisible) return;

    const hasResult = Boolean(pacmanMenuResult);

    if (pacmanMenuEyebrow) {
        pacmanMenuEyebrow.textContent = pacmanMenuShowingRules ? 'Règles' : (hasResult ? pacmanMenuResult.eyebrow : 'Labyrinthe du port');
    }
    if (pacmanMenuTitle) {
        pacmanMenuTitle.textContent = pacmanMenuShowingRules ? 'Rappel rapide' : (hasResult ? pacmanMenuResult.title : 'Baie-Man');
    }
    if (pacmanMenuText) {
        pacmanMenuText.textContent = pacmanMenuShowingRules
            ? getPacmanRulesText()
            : (hasResult ? pacmanMenuResult.text : 'Ramasse toutes les perles de la baie sans te faire attraper par les esprits du brouillard.');
    }
    if (pacmanMenuActionButton) {
        pacmanMenuActionButton.textContent = pacmanMenuShowingRules
            ? 'Retour' : (hasResult ? 'Relancer la chasse' : 'Lancer la chasse');
    }
    if (pacmanMenuRulesButton) {
        pacmanMenuRulesButton.textContent = 'Règles';
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
    if (pacmanHelpText) pacmanHelpText.textContent = text;
    renderPacmanMenu();
    window.setTimeout(() => { pacmanMenuEntering = false; renderPacmanMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
}

// ── Init / Start ──────────────────────────────────────────────────────────────
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
    // Clear player starting cell
    if (pacmanGrid[1][1] === 'pellet') pacmanGrid[1][1] = 'empty';
    pacmanPellets = pacmanGrid.flat().filter((c) => c === 'pellet' || c === 'power').length;
    buildPacmanBoard();
    renderPacman();
    renderPacmanMenu();
}

export function startPacman() {
    closeGameOverModal();
    if (pacmanRunning || pacmanCountdownActive) return;
    if (pacmanLives <= 0 || pacmanPellets <= 0) initializePacman();
    startPacmanCountdown(() => {
        pacmanRunning = true;
        updatePacmanHud();
        pacmanInterval = window.setInterval(runPacmanTick, GAME_TICK_MS);
    });
}

// ── Exports ───────────────────────────────────────────────────────────────────
export function setPacmanNextDirection(d)     { pacmanNextDirection = d; }
export function getPacmanRunning()            { return pacmanRunning; }
export function getPacmanMenuVisible()        { return pacmanMenuVisible; }
export function setPacmanMenuVisible(v)       { pacmanMenuVisible = Boolean(v); }
export function setPacmanMenuShowingRules(v)  { pacmanMenuShowingRules = Boolean(v); }
export function getPacmanMenuShowingRules()   { return pacmanMenuShowingRules; }
export function getPacmanMenuClosing()        { return pacmanMenuClosing; }
