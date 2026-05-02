import { GAME_FILTER_TAGS } from '../../core/constants.js';

const DISCOVERY_TABS = new Set(['home', 'solo', 'multiplayer']);
const GAME_PANEL_IDS = {
    home: 'gamesHomePanel',
    solo: 'gamesSoloPanel',
    multiplayer: 'gamesMultiplayerPanel',
    minesweeper: 'minesweeperGame',
    snake: 'snakeGame',
    pong: 'pongGame',
    sudoku: 'sudokuGame',
    2048: 'game2048',
    aim: 'aimGame',
    memory: 'memoryGame',
    ticTacToe: 'ticTacToeGame',
    battleship: 'battleshipGame',
    tetris: 'tetrisGame',
    pacman: 'pacmanGame',
    solitaire: 'solitaireGame',
    connect4: 'connect4Game',
    rhythm: 'rhythmGame',
    flappy: 'flappyGame',
    flowFree: 'flowFreeGame',
    magicSort: 'magicSortGame',
    mentalMath: 'mentalMathGame',
    candyCrush: 'candyCrushGame',
    harborRun: 'harborRunGame',
    stacker: 'stackerGame',
    coinClicker: 'coinClickerGame',
    chess: 'chessGame',
    checkers: 'checkersGame',
    airHockey: 'airHockeyGame',
    reaction: 'reactionGame',
    baieBerry: 'baieBerryGame',
    breakout: 'breakoutGame',
    blockBlast: 'blockBlastGame',
    uno: 'unoGame',
    bomb: 'bombGame'
};

let activeGamesSection = 'home';
let activeGamesFilter = 'all';
let activeGameTab = 'home';
let gamesGridDominoFrame = null;
let gamesGridDominoCleanupTimer = null;
const gameHomeTileReplayTimers = new WeakMap();

function getById(id) {
    return document.getElementById(id);
}

function getGameHomeTiles() {
    return document.querySelectorAll('[data-open-game]');
}

function getCurrentGamesGrid(tabId = activeGameTab) {
    if (tabId === 'solo') {
        return getById('gamesSoloPanel')?.querySelector('.games-home-grid') || null;
    }

    if (tabId === 'multiplayer') {
        return getById('gamesMultiplayerPanel')?.querySelector('.games-home-grid') || null;
    }

    return getById('gamesHomePanel')?.querySelector('.games-home-grid') || null;
}

function getVisibleGameHomeTiles(grid = getCurrentGamesGrid()) {
    if (!grid) {
        return [];
    }

    return Array.from(grid.querySelectorAll('[data-open-game]')).filter((tile) => !tile.hidden);
}

export function syncGamesGridDominoOrder(grid = getCurrentGamesGrid()) {
    getVisibleGameHomeTiles(grid).forEach((tile, index) => {
        tile.style.setProperty('--domino-order', String(index));
    });
}

export function clearGamesGridDominoAnimation() {
    if (gamesGridDominoFrame !== null) {
        window.cancelAnimationFrame(gamesGridDominoFrame);
        gamesGridDominoFrame = null;
    }

    if (gamesGridDominoCleanupTimer) {
        window.clearTimeout(gamesGridDominoCleanupTimer);
        gamesGridDominoCleanupTimer = null;
    }

    document.querySelectorAll('.games-home-grid.is-domino-running').forEach((activeGrid) => {
        activeGrid.classList.remove('is-domino-running');
    });
}

export function playGamesGridDominoAnimation(grid = getCurrentGamesGrid()) {
    const visibleTiles = getVisibleGameHomeTiles(grid);
    clearGamesGridDominoAnimation();

    if (!visibleTiles.length) {
        return;
    }

    grid?.classList.add('is-domino-running');
    visibleTiles.forEach((tile, index) => {
        tile.style.setProperty('--domino-order', String(index));
        tile.classList.remove('is-domino-entering');
    });

    gamesGridDominoFrame = window.requestAnimationFrame(() => {
        gamesGridDominoFrame = window.requestAnimationFrame(() => {
            visibleTiles.forEach((tile) => {
                tile.classList.add('is-domino-entering');
                tile.addEventListener('animationend', (event) => {
                    if (event.animationName === 'gameHomeTileDominoIn') {
                        tile.classList.remove('is-domino-entering');
                    }
                }, { once: true });
            });
            gamesGridDominoFrame = null;
        });
    });

    const totalDuration = 620 + Math.max(0, visibleTiles.length - 1) * 58;
    gamesGridDominoCleanupTimer = window.setTimeout(() => {
        visibleTiles.forEach((tile) => {
            tile.classList.remove('is-domino-entering');
        });
        grid?.classList.remove('is-domino-running');
        gamesGridDominoCleanupTimer = null;
    }, totalDuration);
}

export function replayGameHomeTileAnimation(tile) {
    const currentGrid = getCurrentGamesGrid();
    if (!tile || tile.hidden || !currentGrid || tile.closest('.games-home-grid') !== currentGrid) {
        return;
    }

    if (currentGrid.classList.contains('is-domino-running')) {
        return;
    }

    const previousTimer = gameHomeTileReplayTimers.get(tile);
    if (previousTimer) {
        window.clearTimeout(previousTimer);
    }

    tile.classList.remove('is-domino-replaying');
    void tile.offsetWidth;
    tile.classList.add('is-domino-replaying');

    const cleanupTimer = window.setTimeout(() => {
        tile.classList.remove('is-domino-replaying');
        gameHomeTileReplayTimers.delete(tile);
    }, 380);

    gameHomeTileReplayTimers.set(tile, cleanupTimer);
}

export function updateGamesFilters() {
    const currentGrid = getCurrentGamesGrid();
    const currentTiles = currentGrid ? Array.from(currentGrid.querySelectorAll('[data-open-game]')) : [];
    const query = (getById('gamesFilterSearchInput')?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    getGameHomeTiles().forEach((tile) => {
        if (!currentGrid || tile.closest('.games-home-grid') !== currentGrid) {
            tile.hidden = false;
            return;
        }

        const title = tile.querySelector('.game-home-title')?.textContent?.trim().toLowerCase() || '';
        const tags = GAME_FILTER_TAGS[tile.dataset.openGame] || [];
        const matchesQuery = !query || title.includes(query);
        const matchesFilter = activeGamesFilter === 'all' || tags.includes(activeGamesFilter);
        const isVisible = matchesQuery && matchesFilter;
        tile.hidden = !isVisible;

        if (isVisible) {
            visibleCount += 1;
        }
    });

    const gamesFilterCount = getById('gamesFilterCount');
    if (gamesFilterCount) {
        const label = currentTiles.length > 1 ? 'jeux visibles' : 'jeu visible';
        gamesFilterCount.textContent = `${visibleCount} ${label}`;
    }

    const gamesFilterHint = getById('gamesFilterHint');
    if (gamesFilterHint) {
        gamesFilterHint.textContent = visibleCount
            ? ''
            : 'Aucun jeu ne correspond a cette recherche. Essaie un autre mot ou un autre filtre.';
    }

    syncGamesGridDominoOrder(currentGrid);
}

export function showGamePanel(tabId, options = {}) {
    const {
        updateMultiplayerChatPanel,
        closeGameOverModal,
        updateMultiplayerLobby
    } = options;
    activeGameTab = tabId;
    const isDiscoveryPanel = DISCOVERY_TABS.has(tabId);
    const visibleSection = DISCOVERY_TABS.has(tabId) ? tabId : activeGamesSection;

    document.querySelectorAll('[data-games-section]').forEach((button) => {
        button.classList.toggle('is-active', visibleSection === button.dataset.gamesSection);
    });
    document.querySelector('#gamesView .games-layout')?.classList.toggle('games-layout-focus', !isDiscoveryPanel);
    getById('gamesFiltersCard')?.classList.toggle('hidden', !isDiscoveryPanel);

    Object.entries(GAME_PANEL_IDS).forEach(([panelTab, panelId]) => {
        getById(panelId)?.classList.toggle('games-panel-active', tabId === panelTab);
    });

    updateMultiplayerChatPanel?.();

    if (tabId !== 'snake') {
        closeGameOverModal?.();
    }

    updateMultiplayerLobby?.();
    updateGamesFilters();

    if (isDiscoveryPanel) {
        playGamesGridDominoAnimation();
    }

    return activeGameTab;
}

export function showGamesSection(section, options = {}) {
    activeGamesSection = section;
    options.cleanupActiveGameForNavigation?.(section);
    return showGamePanel(section, options);
}

export function showGamesHome(options = {}) {
    return showGamesSection('home', options);
}

export function bindGamesNavigationControls(options = {}) {
    const {
        openSelectedGame,
        setSelectedMultiplayerGame,
        setMultiplayerEntryMode,
        showGamesSection: showGamesSectionCallback = (section) => showGamesSection(section, options)
    } = options;

    getGameHomeTiles().forEach((tile) => {
        tile.addEventListener('click', () => {
            if (tile.dataset.multiplayerGameSelect) {
                setSelectedMultiplayerGame?.(tile.dataset.multiplayerGameSelect);
                setMultiplayerEntryMode?.('create');
                return;
            }

            openSelectedGame?.(tile.dataset.openGame);
        });

        tile.addEventListener('pointerenter', () => {
            replayGameHomeTileAnimation(tile);
        });

        tile.addEventListener('focus', () => {
            replayGameHomeTileAnimation(tile);
        });
    });

    document.querySelectorAll('[data-games-section]').forEach((button) => {
        button.addEventListener('click', () => {
            showGamesSectionCallback(button.dataset.gamesSection || 'home');
        });
    });

    getById('gamesFilterSearchInput')?.addEventListener('input', () => {
        updateGamesFilters();
    });

    document.querySelectorAll('[data-games-filter]').forEach((button) => {
        button.addEventListener('click', () => {
            activeGamesFilter = button.dataset.gamesFilter || 'all';
            document.querySelectorAll('[data-games-filter]').forEach((chip) => {
                chip.classList.toggle('is-active', chip === button);
            });
            updateGamesFilters();
        });
    });
}
