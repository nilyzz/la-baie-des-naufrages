import * as game2048 from './js/games/game2048.js';
import * as aimModule from './js/games/aim.js';
import * as airHockey from './js/games/airHockey.js';
import * as baieBerry from './js/games/baieBerry.js';
import * as battleship from './js/games/battleship.js';
import * as blockBlast from './js/games/blockBlast.js';
import * as bomb from './js/games/bomb.js';
import * as breakout from './js/games/breakout.js';
import * as candyCrush from './js/games/candyCrush.js';
import * as coinClicker from './js/games/coinClicker.js';
import * as flappy from './js/games/flappy.js';
import * as flowFree from './js/games/flowFree.js';
import * as harborRun from './js/games/harborRun.js';
import * as magicSort from './js/games/magicSort.js';
import * as minesweeper from './js/games/minesweeper.js';
import * as pacman from './js/games/pacman.js';
import * as pong from './js/games/pong.js';
import * as rhythm from './js/games/rhythm.js';
import * as snake from './js/games/snake.js';
import * as solitaire from './js/games/solitaire.js';
import * as stacker from './js/games/stacker.js';
import * as tetris from './js/games/tetris.js';

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
import { openSelectedGame as _openSelectedGame, cleanupActiveGameForNavigation } from './js/games/_shared/game-lifecycle.js';
import { bindAllGameEventControls } from './js/games/_shared/game-event-bindings.js';

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

    const __cc = coinClicker;
    const __rh = rhythm;
    const __am = aimModule;
    const __sn = snake;
    const __tt = tetris;
    const __g2 = game2048;
    const __fl = flappy;
    const __pm = pacman;
    const __bk = breakout;
    const __ms = magicSort;
    const __hr = harborRun;
    const __mw = minesweeper;
    const __st = stacker;
    const __sol = solitaire;
    const __bb = blockBlast;
    const __cc2 = candyCrush;
    const __bb2 = baieBerry;
    const __ff = flowFree;
    const __bs = battleship;
    const __bm = bomb;
    const __ah = airHockey;
    const __pg = pong;

    // Navires chargés à la demande (lazy)
    let cinemaModule = null;
    let mathModule = null;
    let musicModule = null;

    let currentView = loginView;
    let activeMathTab = 'mathCalculatorPanel';
    let activeMusicTab = 'musicHomePanel';

    async function loadCinema() {
        if (!cinemaModule) {
            cinemaModule = await import('./js/navires/cinema.js');
            cinemaModule.initCinemaCatalogState();
            cinemaModule.renderCinemaCatalogAll();
            cinemaModule.bindCinemaCatalogControls({
                getContext: cinemaModule.getCinemaCatalogContext,
                setState: cinemaModule.applyCinemaCatalogState
            });
        }
        return cinemaModule;
    }

    async function loadMath() {
        if (!mathModule) {
            mathModule = await import('./js/navires/math.js');
            mathModule.bindMathControls();
            mathModule.initializeConverter();
        }
        return mathModule;
    }

    async function loadMusic() {
        if (!musicModule) {
            musicModule = await import('./js/navires/music.js');
            musicModule.bindMusicControls({ onActivateMusicPanel: activateMusicPanel });
            musicModule.renderPiano();
        }
        return musicModule;
    }

    function transitionToView(nextView, options = {}) {
        _transitionToView(currentView, nextView, {
            ...options,
            onBeforeLeave: () => {
                if (currentView === musicView && nextView !== musicView) {
                    musicModule?.stopAllPianoNotes();
                }
            },
            onViewChanged: (view) => {
                currentView = view;
            }
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
            onViewChanged: (view) => {
                currentView = view;
            }
        });
    }

    function showServices() {
        closeGameOverModal();
        saveSession({ lastDestination: 'services' });
        transitionToView(servicesView, { headerMode: 'none' });
    }

    async function showCinema() {
        closeGameOverModal();
        saveSession({ lastDestination: 'cinema' });
        const cin = await loadCinema();
        cin.ensureMoviesLoaded();
        transitionToView(appView, {
            showHeader: true,
            headerMode: 'cinema',
            onComplete: () => activatePanel('dashboardSection')
        });
    }

    function showGames() {
        if (!__mw.isMinesweeperInitialized()) {
            __mw.initializeGame();
        }
        closeGameOverModal();
        saveSession({ lastDestination: 'games' });
        transitionToView(gamesView, {
            showHeader: true,
            headerMode: 'games',
            onComplete: () => showGamesHome()
        });
    }

    async function showMath() {
        closeGameOverModal();
        saveSession({ lastDestination: 'math' });
        await loadMath();
        transitionToView(mathView, {
            showHeader: true,
            headerMode: 'math',
            onComplete: () => activateMathPanel(activeMathTab)
        });
    }

    async function showMusic() {
        closeGameOverModal();
        saveSession({ lastDestination: 'music' });
        await loadMusic();
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
        cleanupActiveGameForNavigation: (nextTab) => cleanupActiveGameForNavigation(nextTab, getActiveGameTab()),
        updateMultiplayerChatPanel,
        closeGameOverModal,
        updateMultiplayerLobby
    };

    function showGamePanel(tabId) { _showGamePanel(tabId, _navCbs); }
    function showGamesHome() { _showGamesHome(_navCbs); }
    function showGamesSection(section) { _showGamesSection(section, _navCbs); }

    function openSelectedGame(nextTab) {
        _openSelectedGame(nextTab, getActiveGameTab(), { setSelectedMultiplayerGame, closeGameOverModal });
    }

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

    bindAllGameEventControls({
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
        isMultiplayerPongActive: __pg.isMultiplayerPongActive,
        pushMultiplayerPongInput: __pg.pushMultiplayerPongInput,
        isMultiplayerAirHockeyActive: __ah.isMultiplayerAirHockeyActive,
        pushMultiplayerAirHockeyInput: __ah.pushMultiplayerAirHockeyInput
    });

    bindSessionActivityTracking();

    bindGameKeyReleaseControls({
        handlePianoKeyUp: (note) => musicModule?.handlePianoKeyUp(note),
        isPianoActive: () => currentView === musicView && activeMusicTab === 'pianoPanel',
        getPongKeys: () => __pg.getPongKeys(),
        isMultiplayerPongActive: () => getActiveGameTab() === 'pong' && __pg.isMultiplayerPongActive(),
        pushMultiplayerPongInput: __pg.pushMultiplayerPongInput,
        getAirHockeyKeys: () => __ah.getAirHockeyKeys(),
        isMultiplayerAirHockeyActive: () => getActiveGameTab() === 'airHockey' && __ah.isMultiplayerAirHockeyActive(),
        pushMultiplayerAirHockeyInput: __ah.pushMultiplayerAirHockeyInput,
        getBreakoutKeys: () => __bk.getBreakoutKeys()
    });

    bindResponsiveGameResize({
        getActiveGameTab,
        syncAllGameMenuOverlayBounds,
        renderSnake: __sn.renderSnake,
        isMultiplayerPongActive: __pg.isMultiplayerPongActive,
        syncMultiplayerPongState: __pg.syncMultiplayerPongState,
        resetPongRound: __pg.resetPongRound,
        initializeAirHockey: __ah.initializeAirHockey,
        renderAirHockey: __ah.renderAirHockey,
        render2048: __g2.render2048,
        renderPacman: __pm.renderPacman,
        renderFlappy: __fl.renderFlappy,
        renderHarborRun: __hr.renderHarborRun,
        renderStacker: __st.renderStacker,
        drawBaieBerry: __bb2.drawBaieBerry,
        drawBreakout: __bk.drawBreakout
    });

    bindMultiplayerLobbyControls({
        onCreateRoom: createMultiplayerRoom,
        onJoinRoom: joinMultiplayerRoom,
        onCopyCode: copyMultiplayerRoomCode,
        onSendChat: sendMultiplayerChatMessage,
        onSyncPlayerNames: syncMultiplayerPlayerNames
    });

    showGamePanel('home');
    updateMultiplayerLobby();
    __mw.initializeGame();
    __mw.renderMinesweeperMenu();
    __st.renderStackerMenu();
    __pm.renderPacmanMenu();
    __tt.renderTetrisMenu();
    __bs.renderBattleshipMenu();
    __hr.renderHarborRunMenu();
    __cc.renderCoinClickerMenu();
    __cc2.renderCandyCrushMenu();
    __ff.renderFlowFreeMenu();
    __ms.renderMagicSortMenu();
    __bb.renderBlockBlastMenu();
    __am.renderAimMenu();
    __rh.renderRhythmMenu();
    __sol.renderSolitaireMenu();
    __bm.renderBombMenu();
    setMultiplayerEntryMode('create');
    setSelectedMultiplayerGame(multiplayerGameTiles[0]?.dataset.multiplayerGameSelect || 'ticTacToe');
    __cc.startCoinClickerAutoLoop();
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
            showViewImmediately(gamesView, {
                showHeader: true,
                headerMode: 'games',
                onComplete: () => showGamesHome()
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
