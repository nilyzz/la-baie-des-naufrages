import * as multiplayerState from './js/multiplayer/state.js';

import { loadSession, saveSession, clearSession, scheduleSessionTimeout } from './js/core/session.js';
import { closeGameOverModal, closeLegalNoticeModal, closeConfirmModal, bindCoreModalControls, bindConfirmModalControls } from './js/core/modals.js';
import { transitionToView as _transitionToView, showViewImmediately as _showViewImmediately, activatePanel, activateMathPanel as _activateMathPanel, activateMusicPanel as _activateMusicPanel } from './js/core/router.js';
import { bindAppShellControls } from './js/core/app-shell.js';
import { bindSessionActivityTracking, bindEscapeModalControls, bindResponsiveGameResize } from './js/core/lifecycle.js';
import { setMultiplayerStatus, syncMultiplayerPlayerNames } from './js/multiplayer/status.js';
import { updateMultiplayerChatPanel as _updateMpChatPanel, updateMultiplayerLobby as _updateMpLobby, bindMultiplayerLobbyControls, setMultiplayerEntryMode } from './js/multiplayer/lobby.js';
import { bindMultiplayerSession, bindSetSelectedMultiplayerGame } from './js/multiplayer/session.js';
import { bindMultiplayerChat } from './js/multiplayer/chat.js';
import { syncAllGameMenuOverlayBounds } from './js/games/_shared/menu-overlay.js';
import { showGamePanel as _showGamePanel, showGamesHome as _showGamesHome, showGamesSection as _showGamesSection, bindGamesNavigationControls, getActiveGameTab } from './js/games/_shared/navigation.js';
import { bindGameKeyReleaseControls, bindGlobalKeyboardControls } from './js/games/_shared/keyboard.js';

document.addEventListener('DOMContentLoaded', () => {

    const loginView = document.getElementById('loginView');
    const servicesView = document.getElementById('servicesView');
    const appView = document.getElementById('appView');
    const gamesView = document.getElementById('gamesView');
    const mathView = document.getElementById('mathView');
    const musicView = document.getElementById('musicView');
    const loginForm = document.getElementById('loginForm');
    const multiplayerChatInput = document.getElementById('multiplayerChatInput');
    const multiplayerGameTiles = document.querySelectorAll('[data-multiplayer-game-select]');

    // Chunks lazy — chargés à la première navigation vers la section correspondante
    let lifecycleBundle = null;
    let gameEventBundle = null;
    let cinemaModule = null;
    let mathModule = null;
    let musicModule = null;

    // Promise-cache : empêche la double-initialisation si appelé deux fois avant resolve
    let _gamesBundleP = null;
    let _cinemaP = null;
    let _mathP = null;
    let _musicP = null;

    let currentView = loginView;
    let activeMathTab = 'mathCalculatorPanel';
    let activeMusicTab = 'musicHomePanel';

    // --- Lazy loaders ---

    async function loadGamesBundle() {
        if (!_gamesBundleP) {
            _gamesBundleP = Promise.all([
                import('./js/games/_shared/game-lifecycle.js'),
                import('./js/games/_shared/game-event-bindings.js'),
            ]).then(([lb, geb]) => {
                lifecycleBundle = lb;
                gameEventBundle = geb;

                const g = (id) => lifecycleBundle.getGameModule(id);

                g('minesweeper')?.initializeGame();
                g('minesweeper')?.renderMinesweeperMenu();
                g('stacker')?.renderStackerMenu();
                g('pacman')?.renderPacmanMenu();
                g('tetris')?.renderTetrisMenu();
                g('battleship')?.renderBattleshipMenu();
                g('harborRun')?.renderHarborRunMenu();
                g('coinClicker')?.renderCoinClickerMenu();
                g('candyCrush')?.renderCandyCrushMenu();
                g('flowFree')?.renderFlowFreeMenu();
                g('magicSort')?.renderMagicSortMenu();
                g('blockBlast')?.renderBlockBlastMenu();
                g('aim')?.renderAimMenu();
                g('rhythm')?.renderRhythmMenu();
                g('solitaire')?.renderSolitaireMenu();
                g('bomb')?.renderBombMenu();
                g('coinClicker')?.startCoinClickerAutoLoop();

                gameEventBundle.bindAllGameEventControls({
                    getSocket: () => multiplayerState.getMultiplayerSocket(),
                    getActiveRoom: () => multiplayerState.getMultiplayerActiveRoom(),
                    getActiveGameTab,
                    isMultiplayerLaunchPending: (gameId = multiplayerState.getMultiplayerActiveRoom()?.gameId) => multiplayerState.isMultiplayerLaunchPending(gameId),
                    toggleMultiplayerReady,
                    setMultiplayerStatus,
                    showGamePanel,
                    showGamesSection,
                    setSelectedMultiplayerGame,
                    setMultiplayerEntryMode,
                    openSelectedGame,
                    closeGameOverModal
                });
            });
        }
        await _gamesBundleP;
        return lifecycleBundle;
    }

    async function loadCinema() {
        if (!_cinemaP) {
            _cinemaP = import('./js/navires/cinema.js').then((mod) => {
                cinemaModule = mod;
                mod.initCinemaCatalogState();
                mod.renderCinemaCatalogAll();
                mod.bindCinemaCatalogControls({
                    getContext: mod.getCinemaCatalogContext,
                    setState: mod.applyCinemaCatalogState
                });
            });
        }
        await _cinemaP;
        return cinemaModule;
    }

    async function loadMath() {
        if (!_mathP) {
            _mathP = import('./js/navires/math.js').then((mod) => {
                mathModule = mod;
                mod.bindMathControls();
                mod.initializeConverter();
            });
        }
        await _mathP;
        return mathModule;
    }

    async function loadMusic() {
        if (!_musicP) {
            _musicP = import('./js/navires/music.js').then((mod) => {
                musicModule = mod;
                mod.bindMusicControls({ onActivateMusicPanel: activateMusicPanel });
                mod.renderPiano();
            });
        }
        await _musicP;
        return musicModule;
    }

    // --- Helpers pour modules paresseux ---

    function game(id) { return lifecycleBundle?.getGameModule(id); }

    // --- Transitions de vue ---

    function transitionToView(nextView, options = {}) {
        _transitionToView(currentView, nextView, {
            ...options,
            onBeforeLeave: () => {
                if (currentView === musicView && nextView !== musicView) {
                    musicModule?.stopAllPianoNotes();
                }
            },
            onViewChanged: (view) => { currentView = view; }
        });
    }

    function showViewImmediately(nextView, options = {}) {
        _showViewImmediately(nextView, {
            ...options,
            onBeforeLeave: () => {
                if (currentView === musicView && nextView !== musicView) {
                    musicModule?.stopAllPianoNotes();
                }
            },
            onViewChanged: (view) => { currentView = view; }
        });
    }

    // --- Navigation principale ---

    function showServices() {
        closeGameOverModal();
        saveSession({ lastDestination: 'services' });
        transitionToView(servicesView, { headerMode: 'none' });
    }

    async function showCinema() {
        closeGameOverModal();
        saveSession({ lastDestination: 'cinema' });
        document.body.classList.add('is-lazy-loading');
        const cin = await loadCinema().finally(() => document.body.classList.remove('is-lazy-loading'));
        cin.ensureMoviesLoaded();
        transitionToView(appView, {
            showHeader: true,
            headerMode: 'cinema',
            onComplete: () => activatePanel('dashboardSection')
        });
    }

    async function showGames() {
        closeGameOverModal();
        saveSession({ lastDestination: 'games' });
        document.body.classList.add('is-lazy-loading');
        await loadGamesBundle().finally(() => document.body.classList.remove('is-lazy-loading'));
        transitionToView(gamesView, {
            showHeader: true,
            headerMode: 'games',
            onComplete: () => showGamesHome()
        });
    }

    async function showMath() {
        closeGameOverModal();
        saveSession({ lastDestination: 'math' });
        document.body.classList.add('is-lazy-loading');
        await loadMath().finally(() => document.body.classList.remove('is-lazy-loading'));
        transitionToView(mathView, {
            showHeader: true,
            headerMode: 'math',
            onComplete: () => activateMathPanel(activeMathTab)
        });
    }

    async function showMusic() {
        closeGameOverModal();
        saveSession({ lastDestination: 'music' });
        document.body.classList.add('is-lazy-loading');
        await loadMusic().finally(() => document.body.classList.remove('is-lazy-loading'));
        transitionToView(musicView, {
            showHeader: true,
            headerMode: 'music',
            onComplete: () => activateMusicPanel(activeMusicTab)
        });
    }

    function activateMathPanel(targetId) {
        activeMathTab = _activateMathPanel(targetId);
    }

    function activateMusicPanel(targetId) {
        activeMusicTab = _activateMusicPanel(targetId, {
            onPianoPanel: () => musicModule?.renderPiano()
        });
    }

    function updateMultiplayerChatPanel() {
        return _updateMpChatPanel({
            activeRoom: multiplayerState.getMultiplayerActiveRoom(),
            socket: multiplayerState.getMultiplayerSocket(),
            activeGameTab: getActiveGameTab()
        });
    }

    function updateMultiplayerLobby(preserveStatus = false) {
        _updateMpLobby({
            preserveStatus,
            onLeave: () => leaveMultiplayerRoom(),
            activeGameTab: getActiveGameTab()
        });
    }

    const {
        ensureMultiplayerConnection,
        createMultiplayerRoom,
        joinMultiplayerRoom,
        leaveMultiplayerRoom,
        copyMultiplayerRoomCode,
        toggleMultiplayerReady
    } = bindMultiplayerSession({
        getActiveGameTab,
        openSelectedGame: (gameId) => openSelectedGame(gameId)
    });

    const sendMultiplayerChatMessage = bindMultiplayerChat({
        getActiveGameTab,
        ensureMultiplayerConnection,
        multiplayerChatInput
    });

    const setSelectedMultiplayerGame = bindSetSelectedMultiplayerGame({
        ensureMultiplayerConnection,
        updateMultiplayerLobby
    });

    const _navCbs = {
        cleanupActiveGameForNavigation: (nextTab) => {
            lifecycleBundle?.cleanupActiveGameForNavigation(nextTab, getActiveGameTab());
        },
        updateMultiplayerChatPanel,
        closeGameOverModal,
        updateMultiplayerLobby
    };

    function showGamePanel(tabId) { _showGamePanel(tabId, _navCbs); }
    function showGamesHome() { _showGamesHome(_navCbs); }
    function showGamesSection(section) { _showGamesSection(section, _navCbs); }

    async function openSelectedGame(nextTab) {
        const lifecycle = await loadGamesBundle();
        lifecycle.openSelectedGame(nextTab, getActiveGameTab(), { setSelectedMultiplayerGame, closeGameOverModal });
    }

    // --- Bindings shell ---

    bindAppShellControls({
        onLogin: () => {
            saveSession({ lastDestination: 'services' });
            showServices();
        },
        onCinema: showCinema,
        onGames: showGames,
        onMath: showMath,
        onMusic: showMusic,
        onBackToServices: showServices,
        onLogout: () => {
            closeGameOverModal();
            clearSession();
            showViewImmediately(loginView, { headerMode: 'none' });
            loginForm.querySelector('button[type="submit"]')?.focus();
        },
        onActivateCinemaPanel: activatePanel,
        onActivateMathPanel: activateMathPanel,
        onActivateMusicPanel: activateMusicPanel
    });

    bindGamesNavigationControls({
        openSelectedGame,
        setSelectedMultiplayerGame,
        setMultiplayerEntryMode,
        showGamesSection
    });

    bindConfirmModalControls({ onClose: closeConfirmModal });
    bindCoreModalControls();
    bindEscapeModalControls({
        closeDeleteModal: closeConfirmModal,
        closeLegalNoticeModal,
        closeGameOverModal
    });

    bindGlobalKeyboardControls({
        getActiveGameTab,
        isPianoActive: () => currentView === musicView && activeMusicTab === 'pianoPanel',
        isMultiplayerPongActive: () => game('pong')?.isMultiplayerPongActive() ?? false,
        pushMultiplayerPongInput: (i) => game('pong')?.pushMultiplayerPongInput(i),
        isMultiplayerAirHockeyActive: () => game('airHockey')?.isMultiplayerAirHockeyActive() ?? false,
        pushMultiplayerAirHockeyInput: (i) => game('airHockey')?.pushMultiplayerAirHockeyInput(i)
    });

    bindSessionActivityTracking();

    bindGameKeyReleaseControls({
        handlePianoKeyUp: (note) => musicModule?.handlePianoKeyUp(note),
        isPianoActive: () => currentView === musicView && activeMusicTab === 'pianoPanel',
        getPongKeys: () => game('pong')?.getPongKeys() ?? [],
        isMultiplayerPongActive: () => getActiveGameTab() === 'pong' && (game('pong')?.isMultiplayerPongActive() ?? false),
        pushMultiplayerPongInput: (i) => game('pong')?.pushMultiplayerPongInput(i),
        getAirHockeyKeys: () => game('airHockey')?.getAirHockeyKeys() ?? [],
        isMultiplayerAirHockeyActive: () => getActiveGameTab() === 'airHockey' && (game('airHockey')?.isMultiplayerAirHockeyActive() ?? false),
        pushMultiplayerAirHockeyInput: (i) => game('airHockey')?.pushMultiplayerAirHockeyInput(i),
        getBreakoutKeys: () => game('breakout')?.getBreakoutKeys() ?? []
    });

    bindResponsiveGameResize({
        getActiveGameTab,
        syncAllGameMenuOverlayBounds,
        renderSnake: (...a) => game('snake')?.renderSnake(...a),
        isMultiplayerPongActive: () => game('pong')?.isMultiplayerPongActive() ?? false,
        syncMultiplayerPongState: (...a) => game('pong')?.syncMultiplayerPongState(...a),
        resetPongRound: (...a) => game('pong')?.resetPongRound(...a),
        initializeAirHockey: (...a) => game('airHockey')?.initializeAirHockey(...a),
        renderAirHockey: (...a) => game('airHockey')?.renderAirHockey(...a),
        render2048: (...a) => game('game2048')?.render2048(...a),
        renderPacman: (...a) => game('pacman')?.renderPacman(...a),
        renderFlappy: (...a) => game('flappy')?.renderFlappy(...a),
        renderHarborRun: (...a) => game('harborRun')?.renderHarborRun(...a),
        renderStacker: (...a) => game('stacker')?.renderStacker(...a),
        drawBaieBerry: (...a) => game('baieBerry')?.drawBaieBerry(...a),
        drawBreakout: (...a) => game('breakout')?.drawBreakout(...a)
    });

    bindMultiplayerLobbyControls({
        onCreateRoom: createMultiplayerRoom,
        onJoinRoom: joinMultiplayerRoom,
        onCopyCode: copyMultiplayerRoomCode,
        onSendChat: sendMultiplayerChatMessage,
        onSyncPlayerNames: syncMultiplayerPlayerNames
    });

    // Précharger le chunk du service au survol/touch — navigation perçue comme instantanée
    document.querySelectorAll('.service-card').forEach((card) => {
        const prefetch = () => {
            const svc = card.dataset.service;
            if (svc === 'cinema') loadCinema();
            else if (svc === 'math') loadMath();
            else if (svc === 'music') loadMusic();
            else loadGamesBundle();
        };
        card.addEventListener('mouseenter', prefetch, { once: true });
        card.addEventListener('touchstart', prefetch, { once: true, passive: true });
    });

    showGamePanel('home');
    updateMultiplayerLobby();
    setMultiplayerEntryMode('create');
    setSelectedMultiplayerGame(multiplayerGameTiles[0]?.dataset.multiplayerGameSelect || 'ticTacToe');
    activateMathPanel('mathCalculatorPanel');
    activateMusicPanel('musicHomePanel');
    syncAllGameMenuOverlayBounds();

    const activeSession = loadSession();

    if (activeSession) {
        if (activeSession.lastDestination === 'cinema') {
            loadCinema().then((cin) => {
                cin.importMoviesFromCinema();
                showViewImmediately(appView, {
                    showHeader: true,
                    headerMode: 'cinema',
                    onComplete: () => activatePanel('dashboardSection')
                });
            });
        } else if (activeSession.lastDestination === 'games') {
            loadGamesBundle().then(() => {
                showViewImmediately(gamesView, {
                    showHeader: true,
                    headerMode: 'games',
                    onComplete: () => showGamesHome()
                });
            });
        } else if (activeSession.lastDestination === 'math') {
            loadMath().then(() => {
                showViewImmediately(mathView, {
                    showHeader: true,
                    headerMode: 'math',
                    onComplete: () => activateMathPanel(activeMathTab)
                });
            });
        } else if (activeSession.lastDestination === 'music') {
            loadMusic().then(() => {
                showViewImmediately(musicView, {
                    showHeader: true,
                    headerMode: 'music',
                    onComplete: () => activateMusicPanel(activeMusicTab)
                });
            });
        } else {
            showViewImmediately(servicesView, { headerMode: 'none' });
        }

        scheduleSessionTimeout();
    }
});
