// Game module — Bataille (battleship), solo vs IA / duo local / multijoueur.
// Extracted verbatim from script.js during the ES-modules migration.

import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';
import { shuffleArray } from '../core/utils.js';
import {
    getMultiplayerActiveRoom,
    getMultiplayerSocket,
    isCurrentPlayerMultiplayerReady,
    getMultiplayerReadySummary
} from '../multiplayer/state.js';

export const BATTLESHIP_SIZE = 8;
export const BATTLESHIP_SHIPS = [4, 3, 3, 2, 2];

let battleshipPlayerGrid = [];
let battleshipEnemyGrid = [];
let battleshipPlayerRemainingShips = 0;
let battleshipEnemyRemainingShips = 0;
let battleshipFinished = false;
let battleshipAiTargets = [];
let battleshipAwaitingAi = false;
let battleshipMode = 'solo';
let battleshipCurrentTurn = 'captain1';
let battleshipMenuVisible = true;
let battleshipMenuShowingRules = false;
let battleshipMenuClosing = false;
let battleshipMenuEntering = false;
let battleshipMenuResult = null;
let battleshipLastFinishedStateKey = '';

let activeGameTabAccessor = () => null;
export function setBattleshipActiveGameTabAccessor(fn) {
    if (typeof fn === 'function') activeGameTabAccessor = fn;
}

const $ = (id) => document.getElementById(id);
function dom() {
    return {
        battleshipGame: $('battleshipGame'),
        battleshipPlayerBoard: $('battleshipPlayerBoard'),
        battleshipEnemyBoard: $('battleshipEnemyBoard'),
        battleshipTable: $('battleshipTable'),
        battleshipMenuOverlay: $('battleshipMenuOverlay'),
        battleshipMenuEyebrow: $('battleshipMenuEyebrow'),
        battleshipMenuTitle: $('battleshipMenuTitle'),
        battleshipMenuText: $('battleshipMenuText'),
        battleshipMenuActionButton: $('battleshipMenuActionButton'),
        battleshipMenuRulesButton: $('battleshipMenuRulesButton'),
        battleshipPlayerShipsDisplay: $('battleshipPlayerShipsDisplay'),
        battleshipEnemyShipsDisplay: $('battleshipEnemyShipsDisplay'),
        battleshipPlayerLabel: $('battleshipPlayerLabel'),
        battleshipEnemyLabel: $('battleshipEnemyLabel'),
        battleshipPlayerBoardLabel: $('battleshipPlayerBoardLabel'),
        battleshipEnemyBoardLabel: $('battleshipEnemyBoardLabel'),
        battleshipStatusText: $('battleshipStatusText'),
        battleshipRestartButton: $('battleshipRestartButton'),
        battleshipModeButtons: document.querySelectorAll('[data-battleship-mode]')
    };
}

export function isMultiplayerBattleshipActive() {
    const multiplayerActiveRoom = getMultiplayerActiveRoom();
    return multiplayerActiveRoom?.gameId === 'battleship' && Boolean(multiplayerActiveRoom?.gameState);
}

export function getMultiplayerBattleshipRole() {
    return getMultiplayerActiveRoom()?.players?.find((player) => player.isYou)?.symbol || null;
}

export function createBattleshipGrid() {
    return Array.from({ length: BATTLESHIP_SIZE }, () => Array.from({ length: BATTLESHIP_SIZE }, () => ({
        hasShip: false,
        hit: false,
        shipId: null
    })));
}

export function placeBattleshipFleet(grid) {
    let shipId = 0;

    BATTLESHIP_SHIPS.forEach((length) => {
        let placed = false;

        while (!placed) {
            const horizontal = Math.random() > 0.5;
            const row = Math.floor(Math.random() * BATTLESHIP_SIZE);
            const col = Math.floor(Math.random() * BATTLESHIP_SIZE);
            const cells = [];

            for (let index = 0; index < length; index += 1) {
                const nextRow = row + (horizontal ? 0 : index);
                const nextCol = col + (horizontal ? index : 0);

                if (nextRow >= BATTLESHIP_SIZE || nextCol >= BATTLESHIP_SIZE || grid[nextRow][nextCol].hasShip) {
                    cells.length = 0;
                    break;
                }

                cells.push({ row: nextRow, col: nextCol });
            }

            if (!cells.length) {
                continue;
            }

            cells.forEach((cell) => {
                grid[cell.row][cell.col].hasShip = true;
                grid[cell.row][cell.col].shipId = shipId;
            });

            shipId += 1;
            placed = true;
        }
    });
}

export function countRemainingBattleshipShips(grid) {
    const ships = new Map();

    grid.forEach((row) => {
        row.forEach((cell) => {
            if (cell.shipId === null) {
                return;
            }

            const ship = ships.get(cell.shipId) || { total: 0, hits: 0 };
            ship.total += 1;
            if (cell.hit) {
                ship.hits += 1;
            }
            ships.set(cell.shipId, ship);
        });
    });

    return [...ships.values()].filter((ship) => ship.hits < ship.total).length;
}

export function updateBattleshipHud() {
    const {
        battleshipPlayerLabel,
        battleshipEnemyLabel,
        battleshipPlayerBoardLabel,
        battleshipEnemyBoardLabel,
        battleshipPlayerShipsDisplay,
        battleshipEnemyShipsDisplay
    } = dom();
    if (isMultiplayerBattleshipActive()) {
        battleshipPlayerLabel.textContent = 'Ta flotte';
        battleshipEnemyLabel.textContent = 'Flotte adverse';
        battleshipPlayerBoardLabel.textContent = 'Ta flotte';
        battleshipEnemyBoardLabel.textContent = 'Flotte adverse';
        battleshipPlayerShipsDisplay.textContent = String(battleshipPlayerRemainingShips);
        battleshipEnemyShipsDisplay.textContent = String(battleshipEnemyRemainingShips);
        return;
    }

    const isCaptainOneTurn = battleshipMode === 'solo' || battleshipCurrentTurn === 'captain1';
    const playerLabel = battleshipMode === 'solo'
        ? 'Ta flotte'
        : (isCaptainOneTurn ? 'Flotte capitaine 1' : 'Flotte capitaine 2');
    const enemyLabel = battleshipMode === 'solo'
        ? 'Flotte adverse'
        : (isCaptainOneTurn ? 'Flotte capitaine 2' : 'Flotte capitaine 1');

    battleshipPlayerLabel.textContent = playerLabel;
    battleshipEnemyLabel.textContent = enemyLabel;
    battleshipPlayerBoardLabel.textContent = playerLabel;
    battleshipEnemyBoardLabel.textContent = enemyLabel;
    battleshipPlayerShipsDisplay.textContent = String(isCaptainOneTurn ? battleshipPlayerRemainingShips : battleshipEnemyRemainingShips);
    battleshipEnemyShipsDisplay.textContent = String(isCaptainOneTurn ? battleshipEnemyRemainingShips : battleshipPlayerRemainingShips);
}

export function setBattleshipMode(mode) {
    const { battleshipModeButtons } = dom();
    battleshipMode = mode === 'duo' ? 'duo' : 'solo';
    battleshipCurrentTurn = 'captain1';
    battleshipModeButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.battleshipMode === battleshipMode);
    });
    initializeBattleship();
}

export function getBattleshipTurnContext() {
    if (battleshipMode === 'solo' || battleshipCurrentTurn === 'captain1') {
        return {
            attackerName: battleshipMode === 'solo' ? 'Toi' : 'Capitaine 1',
            defenderName: battleshipMode === 'solo' ? 'la flotte ennemie' : 'Capitaine 2',
            playerGrid: battleshipPlayerGrid,
            enemyGrid: battleshipEnemyGrid
        };
    }

    return {
        attackerName: 'Capitaine 2',
        defenderName: 'Capitaine 1',
        playerGrid: battleshipEnemyGrid,
        enemyGrid: battleshipPlayerGrid
    };
}

export function getBattleshipShipSegmentClass(grid, rowIndex, colIndex) {
    const cell = grid[rowIndex]?.[colIndex];

    if (!cell?.hasShip || cell.shipId === null) {
        return '';
    }

    const topSame = grid[rowIndex - 1]?.[colIndex]?.shipId === cell.shipId;
    const bottomSame = grid[rowIndex + 1]?.[colIndex]?.shipId === cell.shipId;
    const leftSame = grid[rowIndex]?.[colIndex - 1]?.shipId === cell.shipId;
    const rightSame = grid[rowIndex]?.[colIndex + 1]?.shipId === cell.shipId;

    if (!topSame && !bottomSame && !leftSame && !rightSame) {
        return 'is-single';
    }

    if (leftSame || rightSame) {
        if (!leftSame) {
            return 'is-head-horizontal';
        }

        if (!rightSame) {
            return 'is-tail-horizontal';
        }

        return 'is-body-horizontal';
    }

    if (!topSame) {
        return 'is-head-vertical';
    }

    if (!bottomSame) {
        return 'is-tail-vertical';
    }

    return 'is-body-vertical';
}

export function renderBattleshipBoard(boardElement, grid, revealShips = false, boardType = 'enemy') {
    boardElement.innerHTML = grid.map((row, rowIndex) => row.map((cell, colIndex) => {
        const classes = ['battleship-cell'];
        let innerMarkup = '';
        let label = '';
        const shouldShowShip = (revealShips && cell.hasShip) || (cell.hit && cell.hasShip);

        if (shouldShowShip) {
            classes.push('has-ship');
            innerMarkup = `<span class="battleship-ship ${getBattleshipShipSegmentClass(grid, rowIndex, colIndex)}" aria-hidden="true"></span>`;
        }

        if (cell.hit && cell.hasShip) {
            classes.push('is-hit');
            label = 'âœ•';
        } else if (cell.hit) {
            classes.push('is-miss');
            label = 'â€¢';
        }

        return `
            <button
                type="button"
                class="${classes.join(' ')}"
                data-board="${boardType}"
                data-row="${rowIndex}"
                data-col="${colIndex}"
                aria-label="Case ${rowIndex + 1}-${colIndex + 1}"
            >${innerMarkup}</button>
        `;
    }).join('')).join('');
}

export function renderBattleship() {
    const { battleshipPlayerBoard, battleshipEnemyBoard } = dom();
    const context = getBattleshipTurnContext();
    renderBattleshipBoard(battleshipPlayerBoard, context.playerGrid, true, 'player');
    renderBattleshipBoard(battleshipEnemyBoard, context.enemyGrid, false, 'enemy');
    updateBattleshipHud();
}

export function getBattleshipRulesText() {
    return 'Chaque flotte place 5 navires al\u00e9atoirement dans la baie. Clique sur la grille ennemie pour ouvrir le feu. Touche tous leurs navires avant qu\u2019ils ne coulent les tiens. En solo, un ennemi IA riposte apr\u00e8s chaque tir.';
}

export function renderBattleshipMenu() {
    const {
        battleshipMenuOverlay,
        battleshipTable,
        battleshipMenuEyebrow,
        battleshipMenuTitle,
        battleshipMenuText,
        battleshipMenuActionButton,
        battleshipMenuRulesButton
    } = dom();
    if (!battleshipMenuOverlay || !battleshipTable) {
        return;
    }

    syncGameMenuOverlayBounds(battleshipMenuOverlay, battleshipTable);
    battleshipMenuOverlay.classList.toggle('hidden', !battleshipMenuVisible);
    battleshipMenuOverlay.classList.toggle('is-closing', battleshipMenuClosing);
    battleshipMenuOverlay.classList.toggle('is-entering', battleshipMenuEntering);
    battleshipTable.classList.toggle('is-menu-open', battleshipMenuVisible);

    if (!battleshipMenuVisible) {
        return;
    }

    const hasResult = Boolean(battleshipMenuResult);

    if (battleshipMenuEyebrow) {
        battleshipMenuEyebrow.textContent = battleshipMenuShowingRules
            ? 'R\u00e8gles'
            : (hasResult ? battleshipMenuResult.eyebrow : 'Bataille navale de la baie');
    }

    if (battleshipMenuTitle) {
        battleshipMenuTitle.textContent = battleshipMenuShowingRules
            ? 'Rappel rapide'
            : (hasResult ? battleshipMenuResult.title : 'Bataille');
    }

    if (battleshipMenuText) {
        battleshipMenuText.textContent = battleshipMenuShowingRules
            ? getBattleshipRulesText()
            : (hasResult
                ? battleshipMenuResult.text
                : 'Rep\u00e8re les navires ennemis et coule toute leur flotte avant qu\u2019ils ne coulent la tienne.');
    }

    if (battleshipMenuActionButton) {
        const roomForMenu = getMultiplayerActiveRoom();
        const waitingForReady = isMultiplayerBattleshipActive() && !roomForMenu?.gameLaunched;
        battleshipMenuActionButton.textContent = battleshipMenuShowingRules
            ? 'Retour'
            : (waitingForReady
                ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                : (hasResult ? 'Relancer la bataille' : 'Lancer la bataille'));
    }

    if (battleshipMenuRulesButton) {
        battleshipMenuRulesButton.textContent = 'R\u00e8gles';
        battleshipMenuRulesButton.hidden = battleshipMenuShowingRules;
    }
}

export function closeBattleshipMenu() {
    battleshipMenuClosing = true;
    renderBattleshipMenu();
    window.setTimeout(() => {
        battleshipMenuClosing = false;
        battleshipMenuVisible = false;
        battleshipMenuShowingRules = false;
        battleshipMenuEntering = false;
        battleshipMenuResult = null;
        renderBattleshipMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function revealBattleshipOutcomeMenu(title, text, eyebrow) {
    const { battleshipStatusText } = dom();
    battleshipMenuVisible = true;
    battleshipMenuResult = { title, text, eyebrow };
    battleshipMenuShowingRules = false;
    battleshipMenuClosing = false;
    battleshipMenuEntering = true;

    if (battleshipStatusText) {
        battleshipStatusText.textContent = text;
    }

    renderBattleshipMenu();
    window.setTimeout(() => {
        battleshipMenuEntering = false;
        renderBattleshipMenu();
    }, UNO_MENU_CLOSE_DURATION_MS);
}

export function initializeBattleship() {
    const { battleshipStatusText } = dom();
    if (isMultiplayerBattleshipActive()) {
        const room = getMultiplayerActiveRoom();
        battleshipMenuVisible = !room?.gameLaunched;
        battleshipMenuResult = null;
        battleshipMenuShowingRules = false;
        battleshipMenuClosing = false;
        battleshipMenuEntering = false;
        renderBattleshipMenu();
        syncMultiplayerBattleshipState();
        return;
    }

    battleshipPlayerGrid = createBattleshipGrid();
    battleshipEnemyGrid = createBattleshipGrid();
    placeBattleshipFleet(battleshipPlayerGrid);
    placeBattleshipFleet(battleshipEnemyGrid);
    battleshipPlayerRemainingShips = BATTLESHIP_SHIPS.length;
    battleshipEnemyRemainingShips = BATTLESHIP_SHIPS.length;
    battleshipFinished = false;
    battleshipAwaitingAi = false;
    battleshipCurrentTurn = 'captain1';
    battleshipMenuResult = null;
    battleshipMenuShowingRules = false;
    battleshipMenuClosing = false;
    battleshipMenuEntering = false;
    battleshipAiTargets = shuffleArray(
        Array.from({ length: BATTLESHIP_SIZE * BATTLESHIP_SIZE }, (_, index) => ({
            row: Math.floor(index / BATTLESHIP_SIZE),
            col: index % BATTLESHIP_SIZE
        }))
    );
    battleshipStatusText.textContent = battleshipMode === 'solo'
        ? 'Choisis une case dans la grille ennemie pour ouvrir le feu.'
        : 'Capitaine 1 ouvre le duel. Choisis une case dans la grille ennemie.';
    renderBattleship();
    renderBattleshipMenu();
}

export function finishBattleship(playerWon) {
    const { battleshipStatusText } = dom();
    if (battleshipMode === 'duo') {
        battleshipFinished = true;
        const context = getBattleshipTurnContext();
        const winnerName = playerWon ? context.attackerName : context.defenderName;
        battleshipStatusText.textContent = `${winnerName} remporte la bataille dans la baie.`;
        revealBattleshipOutcomeMenu(
            'Bataille terminée',
            `${winnerName} gagne la bataille navale.`,
            'Pont en liesse'
        );
        return;
    }

    battleshipFinished = true;
    battleshipStatusText.textContent = playerWon
        ? 'Victoire. La flotte adverse sombre dans la baie.'
        : 'Défaite. Ta flotte a été coulée.';
    revealBattleshipOutcomeMenu(
        playerWon ? 'Flotte ennemie coulée' : 'Flotte coulée',
        playerWon ? 'La bataille navale est remportée.' : 'La flotte ennemie gagne la bataille.',
        playerWon ? 'Victoire en baie' : 'Cap sur le port'
    );
}

export function runBattleshipAiTurn() {
    const { battleshipStatusText } = dom();
    if (battleshipMode !== 'solo') {
        return;
    }

    if (battleshipFinished) {
        return;
    }

    const nextTarget = battleshipAiTargets.find((target) => !battleshipPlayerGrid[target.row][target.col].hit);

    if (!nextTarget) {
        return;
    }

    const targetCell = battleshipPlayerGrid[nextTarget.row][nextTarget.col];
    targetCell.hit = true;

    if (targetCell.hasShip) {
        battleshipPlayerRemainingShips = countRemainingBattleshipShips(battleshipPlayerGrid);
        battleshipStatusText.textContent = "L'ennemi a touché un de tes navires.";

        if (battleshipPlayerRemainingShips === 0) {
            renderBattleship();
            finishBattleship(false);
            return;
        }
    } else {
        battleshipStatusText.textContent = "L'ennemi a manqué son tir.";
    }

    battleshipAwaitingAi = false;
    renderBattleship();
}

export function handleBattleshipShot(row, col) {
    const { battleshipStatusText } = dom();
    if (battleshipMode === 'duo') {
        if (battleshipFinished || battleshipAwaitingAi) {
            return;
        }

        const context = getBattleshipTurnContext();
        const targetCell = context.enemyGrid[row]?.[col];

        if (!targetCell || targetCell.hit) {
            return;
        }

        closeGameOverModal();
        targetCell.hit = true;

        if (targetCell.hasShip) {
            if (battleshipCurrentTurn === 'captain1') {
                battleshipEnemyRemainingShips = countRemainingBattleshipShips(battleshipEnemyGrid);
            } else {
                battleshipPlayerRemainingShips = countRemainingBattleshipShips(battleshipPlayerGrid);
            }

            battleshipStatusText.textContent = `Touche. ${context.attackerName} frappe un navire de ${context.defenderName}.`;
            renderBattleship();

            const defenderRemainingShips = battleshipCurrentTurn === 'captain1'
                ? battleshipEnemyRemainingShips
                : battleshipPlayerRemainingShips;

            if (defenderRemainingShips === 0) {
                finishBattleship(true);
                return;
            }
        } else {
            battleshipStatusText.textContent = `Dans l'eau. ${context.defenderName} prend maintenant la barre.`;
            renderBattleship();
        }

        battleshipCurrentTurn = battleshipCurrentTurn === 'captain1' ? 'captain2' : 'captain1';
        renderBattleship();
        return;
    }

    if (battleshipFinished || battleshipAwaitingAi) {
        return;
    }

    const targetCell = battleshipEnemyGrid[row]?.[col];

    if (!targetCell || targetCell.hit) {
        return;
    }

    closeGameOverModal();
    targetCell.hit = true;
    battleshipAwaitingAi = true;

    if (targetCell.hasShip) {
        battleshipEnemyRemainingShips = countRemainingBattleshipShips(battleshipEnemyGrid);
        battleshipStatusText.textContent = 'Touché. Tu viens de frapper un navire ennemi.';
        renderBattleship();

        if (battleshipEnemyRemainingShips === 0) {
            finishBattleship(true);
            return;
        }
    }

    if (!targetCell.hasShip) {
        battleshipStatusText.textContent = "Dans l'eau. La flotte ennemie réplique.";
        renderBattleship();
    }

    window.setTimeout(() => {
        runBattleshipAiTurn();
    }, 420);
}

export function syncMultiplayerBattleshipState() {
    const { battleshipStatusText } = dom();
    const multiplayerActiveRoom = getMultiplayerActiveRoom();
    if (!isMultiplayerBattleshipActive()) {
        battleshipLastFinishedStateKey = '';
        return;
    }

    // Ferme auto le menu « Mettre prêt » quand la partie est vraiment lancée
    // et re-render à chaque sync pour que le compteur ready (X/2) se mette à jour.
    if (multiplayerActiveRoom?.gameLaunched && battleshipMenuVisible && !battleshipMenuResult) {
        battleshipMenuVisible = false;
    }
    renderBattleshipMenu();

    battleshipPlayerGrid = multiplayerActiveRoom.gameState.yourBoard.map((row) => row.map((cell) => ({ ...cell })));
    battleshipEnemyGrid = multiplayerActiveRoom.gameState.enemyBoard.map((row) => row.map((cell) => ({ ...cell })));
    battleshipPlayerRemainingShips = Number(multiplayerActiveRoom.gameState.yourRemainingShips || 0);
    battleshipEnemyRemainingShips = Number(multiplayerActiveRoom.gameState.enemyRemainingShips || 0);
    battleshipCurrentTurn = multiplayerActiveRoom.gameState.currentTurn || 'captain1';
    battleshipFinished = Boolean(multiplayerActiveRoom.gameState.winner);
    battleshipAwaitingAi = false;

    const yourRole = getMultiplayerBattleshipRole();
    const isYourTurn = battleshipCurrentTurn === yourRole;
    battleshipStatusText.textContent = multiplayerActiveRoom.gameState.winner
        ? (multiplayerActiveRoom.gameState.winner === yourRole
            ? 'Victoire. Tu coules la flotte adverse.'
            : "D\u00e9faite. L'adversaire remporte la bataille.")
        : (isYourTurn
            ? "\u00c0 toi de tirer sur la flotte adverse."
            : "Attends le tir de l'adversaire.");
    renderBattleship();

    if (!multiplayerActiveRoom.gameState.winner) {
        battleshipLastFinishedStateKey = '';
        closeGameOverModal();
        return;
    }

    const nextFinishedKey = `${multiplayerActiveRoom.gameState.round}:${multiplayerActiveRoom.gameState.winner || 'none'}`;
    if (nextFinishedKey === battleshipLastFinishedStateKey || activeGameTabAccessor() !== 'battleship') {
        return;
    }

    battleshipLastFinishedStateKey = nextFinishedKey;

    if (multiplayerActiveRoom.gameState.winner === yourRole) {
        revealBattleshipOutcomeMenu(
            'Flotte ennemie coulée',
            'Tu remportes cette bataille navale en ligne.',
            'Victoire en baie'
        );
    } else {
        revealBattleshipOutcomeMenu(
            'Flotte coulée',
            "L'adversaire remporte cette bataille navale.",
            'Cap sur le port'
        );
    }
}

// State accessors for wiring in script.js.
export function getBattleshipMode() { return battleshipMode; }
export function getBattleshipFinished() { return battleshipFinished; }
export function getBattleshipAwaitingAi() { return battleshipAwaitingAi; }
export function getBattleshipCurrentTurn() { return battleshipCurrentTurn; }
export function getBattleshipPlayerGrid() { return battleshipPlayerGrid; }
export function getBattleshipEnemyGrid() { return battleshipEnemyGrid; }
export function getBattleshipPlayerRemainingShips() { return battleshipPlayerRemainingShips; }
export function getBattleshipEnemyRemainingShips() { return battleshipEnemyRemainingShips; }
export function getBattleshipMenuVisible() { return battleshipMenuVisible; }
export function setBattleshipMenuVisible(v) { battleshipMenuVisible = Boolean(v); }
export function getBattleshipMenuShowingRules() { return battleshipMenuShowingRules; }
export function setBattleshipMenuShowingRules(v) { battleshipMenuShowingRules = Boolean(v); }
export function getBattleshipMenuClosing() { return battleshipMenuClosing; }
export function getBattleshipMenuResult() { return battleshipMenuResult; }
export function setBattleshipMenuResult(v) { battleshipMenuResult = v; }
export function resetBattleshipMultiplayerTrackers() {
    battleshipLastFinishedStateKey = '';
}
