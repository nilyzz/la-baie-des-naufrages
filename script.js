document.addEventListener('DOMContentLoaded', () => {
    // MULTIPLAYER_SUPPORTED_GAMES : expose sur window par js/core/constants.js via js/main.js.

    const loginView = document.getElementById('loginView');
    const servicesView = document.getElementById('servicesView');
    const appView = document.getElementById('appView');
    const gamesView = document.getElementById('gamesView');
    const mathView = document.getElementById('mathView');
    const musicView = document.getElementById('musicView');
    const loginForm = document.getElementById('loginForm');
    const multiplayerChatInput = document.getElementById('multiplayerChatInput');
    const multiplayerGameTiles = document.querySelectorAll('[data-multiplayer-game-select]');

    // Aliases courts vers les modules de jeux exposés sur window.__baie.
    const __cc = window.__baie.coinClicker;
    const __rh = window.__baie.rhythm;
    const __am = window.__baie.aim;
    const __sn = window.__baie.snake;
    const __tt = window.__baie.tetris;
    const __g2 = window.__baie.game2048;
    const __fl = window.__baie.flappy;
    const __pm = window.__baie.pacman;
    const __bk = window.__baie.breakout;
    const __ms = window.__baie.magicSort;
    const __hr = window.__baie.harborRun;
    const __mw = window.__baie.minesweeper;
    const __st = window.__baie.stacker;
    const __sol = window.__baie.solitaire;
    const __bb = window.__baie.blockBlast;
    const __cc2 = window.__baie.candyCrush;
    const __bb2 = window.__baie.baieBerry;
    const __ff = window.__baie.flowFree;
    const __bs = window.__baie.battleship;
    const __bm = window.__baie.bomb;
    const __ah = window.__baie.airHockey;
    const __pg = window.__baie.pong;
    const __mpState = window.__baie.multiplayerState;
    const __math = window.__baie.math;
    const __music = window.__baie.music;
    const __cin = window.__baie.cinema;

    let currentView = loginView;
    const getActiveGameTab = window.__baieActiveGameTab;
    let activeMathTab = 'mathCalculatorPanel';
    let activeMusicTab = 'musicHomePanel';

    // loadSession, saveSession, clearSession, scheduleSessionTimeout : exposes sur window par js/main.js (source = js/core/session.js).

    function transitionToView(nextView, options = {}) {
        window.transitionToView(currentView, nextView, {
            ...options,
            onBeforeLeave: () => {
                if (currentView === musicView && nextView !== musicView) {
                    __music.stopAllPianoNotes();
                }
            },
            onViewChanged: (view) => {
                currentView = view;
            }
        });
    }

    function showViewImmediately(nextView, options = {}) {
        window.showViewImmediately(nextView, {
            ...options,
            onBeforeLeave: () => {
                if (currentView === musicView && nextView !== musicView) {
                    __music.stopAllPianoNotes();
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
        transitionToView(servicesView, {
            headerMode: 'none'
        });
    }

    function showCinema() {
        closeGameOverModal();
        saveSession({ lastDestination: 'cinema' });
        __cin.ensureMoviesLoaded();
        transitionToView(appView, {
            showHeader: true,
            headerMode: 'cinema',
            onComplete: () => window.activatePanel('dashboardSection')
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

    function showMath() {
        closeGameOverModal();
        saveSession({ lastDestination: 'math' });
        transitionToView(mathView, {
            showHeader: true,
            headerMode: 'math',
            onComplete: () => activateMathPanel(activeMathTab)
        });
    }

    function showMusic() {
        closeGameOverModal();
        saveSession({ lastDestination: 'music' });
        transitionToView(musicView, {
            showHeader: true,
            headerMode: 'music',
            onComplete: () => activateMusicPanel(activeMusicTab)
        });
    }

    function activateMathPanel(targetId) {
        activeMathTab = window.activateMathPanel(targetId);
    }

    function activateMusicPanel(targetId) {
        activeMusicTab = window.activateMusicPanel(targetId, {
            onPianoPanel: () => __music.renderPiano()
        });
    }

    // Fonctions math (bindMathControls, initializeConverter, calculate*, etc.) : exposees sur window par js/main.js (source = js/navires/math.js).

    // closeLegalNoticeModal, closeGameOverModal : exposes sur window par js/main.js (source = js/core/modals.js).
    // setMultiplayerStatus, getMultiplayerGameLabel : exposes sur window par js/main.js (source = js/multiplayer/status.js).

    function updateMultiplayerChatPanel() {
        return window.updateMultiplayerChatPanel({
            activeRoom: __mpState.getMultiplayerActiveRoom(),
            socket: __mpState.getMultiplayerSocket(),
            activeGameTab: getActiveGameTab()
        });
    }

    function updateMultiplayerLobby(preserveStatus = false) {
        window.updateMultiplayerLobby({
            preserveStatus,
            onLeave: () => leaveMultiplayerRoom(),
            activeGameTab: getActiveGameTab()
        });
    }

    // loadSocketIoClient, getMultiplayerServerOrigin, getMultiplayerApiUrl : exposes sur window par js/main.js (source = js/multiplayer/connection.js).
    // ensureMultiplayerConnection + room action functions : extraites dans js/multiplayer/session.js.

    const {
        ensureMultiplayerConnection,
        createMultiplayerRoom,
        joinMultiplayerRoom,
        leaveMultiplayerRoom,
        copyMultiplayerRoomCode,
        toggleMultiplayerReady
    } = window.bindMultiplayerSession({
        getActiveGameTab,
        openSelectedGame: (gameId) => openSelectedGame(gameId)
    });

    const sendMultiplayerChatMessage = window.__baie.multiplayerChat.bindMultiplayerChat({
        getActiveGameTab,
        ensureMultiplayerConnection,
        multiplayerChatInput
    });

    const _navCbs = { cleanupActiveGameForNavigation, updateMultiplayerChatPanel, closeGameOverModal, updateMultiplayerLobby };

    function showGamePanel(tabId) { window.showGamePanel(tabId, _navCbs); }
    function showGamesHome() { window.showGamesHome(_navCbs); }
    function showGamesSection(section) { window.showGamesSection(section, _navCbs); }

    async function setSelectedMultiplayerGame(gameId) {
        if (!MULTIPLAYER_SUPPORTED_GAMES[gameId]) {
            return;
        }

        if (__mpState.getMultiplayerActiveRoom()?.code) {
            if (!__mpState.isCurrentMultiplayerHost()) {
                setMultiplayerStatus("Seul l'hôte peut changer le jeu du salon.");
                return;
            }

            if (__mpState.getMultiplayerActiveRoom().gameId === gameId) {
                __mpState.setMultiplayerSelectedGameId(gameId);
                updateMultiplayerLobby();
                return;
            }

            try {
                const socket = await ensureMultiplayerConnection();
                __mpState.setMultiplayerSelectedGameId(gameId);
                socket.emit('room:update-game', { gameId });
                setMultiplayerStatus(`Jeu du salon change pour ${getMultiplayerGameLabel(gameId)}...`);
            } catch (error) {
                setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
            }
            return;
        }

        __mpState.setMultiplayerSelectedGameId(gameId);
        updateMultiplayerLobby();
    }

    function cleanupActiveGameForNavigation(nextTab) {
        window.__baie.gameLifecycle.cleanupActiveGameForNavigation(nextTab, getActiveGameTab(), window.__baie);
    }

    window.bindAppShellControls({
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
            showViewImmediately(loginView, {
                headerMode: 'none'
            });
            loginForm.querySelector('button[type="submit"]')?.focus();
        },
        onActivateCinemaPanel: window.activatePanel,
        onActivateMathPanel: activateMathPanel,
        onActivateMusicPanel: activateMusicPanel
    });

    function openSelectedGame(nextTab) {
        window.__baie.gameLifecycle.openSelectedGame(nextTab, getActiveGameTab(), window.__baie, { setSelectedMultiplayerGame, closeGameOverModal });
    }

    window.bindGamesNavigationControls({
        openSelectedGame,
        setSelectedMultiplayerGame,
        setMultiplayerEntryMode: window.setMultiplayerEntryMode,
        showGamesSection
    });

    __music.bindMusicControls({
        onActivateMusicPanel: activateMusicPanel
    });

    window.bindAllGameEventControls({
        getSocket: () => __mpState.getMultiplayerSocket(),
        getActiveRoom: () => __mpState.getMultiplayerActiveRoom(),
        getActiveGameTab,
        isMultiplayerLaunchPending: (gameId = __mpState.getMultiplayerActiveRoom()?.gameId) => __mpState.isMultiplayerLaunchPending(gameId),
        toggleMultiplayerReady,
        setMultiplayerStatus,
        showGamePanel,
        showGamesSection,
        setSelectedMultiplayerGame,
        setMultiplayerEntryMode: window.setMultiplayerEntryMode,
        openSelectedGame,
        closeGameOverModal
    });

    __math.bindMathControls();

    window.bindCinemaCatalogControls({
        getContext: __cin.getCinemaCatalogContext,
        setState: __cin.applyCinemaCatalogState
    });

    window.bindConfirmModalControls({ onClose: window.closeConfirmModal });

    window.bindCoreModalControls();
    window.bindEscapeModalControls({
        closeDeleteModal: window.closeConfirmModal,
        closeLegalNoticeModal,
        closeGameOverModal
    });

    window.bindGlobalKeyboardControls({
        getActiveGameTab,
        isPianoActive: () => currentView === musicView && activeMusicTab === 'pianoPanel',
        isMultiplayerPongActive: __pg.isMultiplayerPongActive,
        pushMultiplayerPongInput: __pg.pushMultiplayerPongInput,
        isMultiplayerAirHockeyActive: __ah.isMultiplayerAirHockeyActive,
        pushMultiplayerAirHockeyInput: __ah.pushMultiplayerAirHockeyInput
    });

    window.bindSessionActivityTracking();

    window.bindGameKeyReleaseControls({
        handlePianoKeyUp: __music.handlePianoKeyUp,
        isPianoActive: () => currentView === musicView && activeMusicTab === 'pianoPanel',
        getPongKeys: () => __pg.getPongKeys(),
        isMultiplayerPongActive: () => getActiveGameTab() === 'pong' && __pg.isMultiplayerPongActive(),
        pushMultiplayerPongInput: __pg.pushMultiplayerPongInput,
        getAirHockeyKeys: () => __ah.getAirHockeyKeys(),
        isMultiplayerAirHockeyActive: () => getActiveGameTab() === 'airHockey' && __ah.isMultiplayerAirHockeyActive(),
        pushMultiplayerAirHockeyInput: __ah.pushMultiplayerAirHockeyInput,
        getBreakoutKeys: () => __bk.getBreakoutKeys()
    });

    window.bindResponsiveGameResize({
        getActiveGameTab,
        syncAllGameMenuOverlayBounds: window.syncAllGameMenuOverlayBounds,
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

    window.bindMultiplayerLobbyControls({
        onCreateRoom: createMultiplayerRoom,
        onJoinRoom: joinMultiplayerRoom,
        onCopyCode: copyMultiplayerRoomCode,
        onSendChat: sendMultiplayerChatMessage,
        onSyncPlayerNames: window.syncMultiplayerPlayerNames
    });

    __cin.initCinemaCatalogState();
    __cin.renderCinemaCatalogAll();
    // film.xlsx (~137KB) n'est chargé qu'à la première visite du cinéma
    // (voir ensureMoviesLoaded dans showCinema). Si la session précédente
    // s'est terminée sur le cinéma, on le précharge pour éviter l'attente.
    if (loadSession()?.lastDestination === 'cinema') {
        __cin.importMoviesFromCinema();
    }
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
    window.setMultiplayerEntryMode('create');
    setSelectedMultiplayerGame(multiplayerGameTiles[0]?.dataset.multiplayerGameSelect || 'ticTacToe');
    __cc.startCoinClickerAutoLoop();
    __math.initializeConverter();
    activateMathPanel('mathCalculatorPanel');
    activateMusicPanel('musicHomePanel');
    __music.renderPiano();
    window.syncAllGameMenuOverlayBounds();

    const activeSession = loadSession();

    if (activeSession) {
        if (activeSession.lastDestination === 'cinema') {
            showViewImmediately(appView, {
                showHeader: true,
                headerMode: 'cinema',
                onComplete: () => window.activatePanel('dashboardSection')
            });
        } else if (activeSession.lastDestination === 'games') {
            showViewImmediately(gamesView, {
                showHeader: true,
                headerMode: 'games',
                onComplete: () => showGamesHome()
            });
        } else if (activeSession.lastDestination === 'math') {
            showViewImmediately(mathView, {
                showHeader: true,
                headerMode: 'math',
                onComplete: () => activateMathPanel(activeMathTab)
            });
        } else if (activeSession.lastDestination === 'music') {
            showViewImmediately(musicView, {
                showHeader: true,
                headerMode: 'music',
                onComplete: () => activateMusicPanel(activeMusicTab)
            });
        } else {
            showViewImmediately(servicesView, {
                headerMode: 'none'
            });
        }

        scheduleSessionTimeout();
    }
});