document.addEventListener('DOMContentLoaded', () => {
    // Constantes LEGAL_NOTICE_ANIMATION_MS, SESSION_KEY, SESSION_TIMEOUT_MS,
    // MULTIPLAYER_SERVER_URL : exposee sur window par
    // js/main.js (source de verite = js/core/constants.js et js/multiplayer/connection.js).
    const defaultPoster = 'https://placehold.co/600x900/0f172a/f8fafc?text=Affiche';
    // MULTIPLAYER_SUPPORTED_GAMES : expose sur window par js/core/constants.js via js/main.js.

    const loginView = document.getElementById('loginView');
    const servicesView = document.getElementById('servicesView');
    const appView = document.getElementById('appView');
    const gamesView = document.getElementById('gamesView');
    const mathView = document.getElementById('mathView');
    const musicView = document.getElementById('musicView');
    const catalogGrid = document.getElementById('catalogGrid');
    const emptyCatalogMessage = document.getElementById('emptyCatalogMessage');
    const catalogResultsSummary = document.getElementById('catalogResultsSummary');
    const catalogGenreFilterGroup = document.getElementById('catalogGenreFilterGroup');
    const catalogDirectorFilterBlock = document.getElementById('catalogDirectorFilterBlock');
    const catalogReleaseFilterBlock = document.getElementById('catalogReleaseFilterBlock');
    const catalogRatingFilterBlock = document.getElementById('catalogRatingFilterBlock');
    const catalogReleaseFilterSelect = document.getElementById('catalogReleaseFilterSelect');
    const catalogRatingFilterSelect = document.getElementById('catalogRatingFilterSelect');
    const catalogSortFilterSelect = document.getElementById('catalogSortFilterSelect');
    const catalogDirectorFilterInput = document.getElementById('catalogDirectorFilterInput');
    const catalogDirectorSuggestions = document.getElementById('catalogDirectorSuggestions');
    const manageList = document.getElementById('manageList');
    const excelImportStatus = document.getElementById('excelImportStatus');
    const excelSourceName = document.getElementById('excelSourceName');
    const movieCount = document.getElementById('movieCount');
    const averageRating = document.getElementById('averageRating');
    const loginForm = document.getElementById('loginForm');
    const multiplayerChatInput = document.getElementById('multiplayerChatInput');
    const multiplayerGameTiles = document.querySelectorAll('[data-multiplayer-game-select]');
    // GAME_FILTER_TAGS : expose sur window par js/core/constants.js via js/main.js.

    // d'appeler le module sans réécrire chaque identifiant.
    const __cc = window.__baie.coinClicker;

    const __rh = window.__baie.rhythm;

    const __rx = window.__baie.reaction;

    const __am = window.__baie.aim;

    const __mm = window.__baie.mentalMath;

    const __sn = window.__baie.snake;

    const __tt = window.__baie.tetris;

    const __g2 = window.__baie.game2048;

    const __fl = window.__baie.flappy;

    const __pm = window.__baie.pacman;

    const __bk = window.__baie.breakout;

    const __mem = window.__baie.memory;

    const __ms = window.__baie.magicSort;

    const __hr = window.__baie.harborRun;

    const __mw = window.__baie.minesweeper;

    const __st = window.__baie.stacker;

    const __sol = window.__baie.solitaire;

    const __su = window.__baie.sudoku;

    const __bb = window.__baie.blockBlast;

    const __cc2 = window.__baie.candyCrush;

    const __bb2 = window.__baie.baieBerry;

    const __ff = window.__baie.flowFree;

    const __ck = window.__baie.checkers;

    const __ttt = window.__baie.ticTacToe;

    const __c4 = window.__baie.connect4;

    const __bs = window.__baie.battleship;

    const __bm = window.__baie.bomb;

    const __ch = window.__baie.chess;

    const __uno = window.__baie.uno;

    const __ah = window.__baie.airHockey;

    const __pg = window.__baie.pong;

    const __mpState = window.__baie.multiplayerState;

    const musicHomePanel = document.getElementById('musicHomePanel');
    const pianoPanel = document.getElementById('pianoPanel');
    // PIANO_NOTES, PIANO_NOTE_MAP, PIANO_KEYBOARD_LAYOUT, UNIT_GROUPS : exposes sur window par js/main.js.
    const __math = window.__baie.math;
    const __music = window.__baie.music;

    let movies = [];
    let searchTerm = '';
    let catalogSelectedGenres = new Set();
    let catalogReleaseFilter = 'all';
    let catalogMinimumRatingFilter = 'all';
    let catalogSortMode = 'default';
    let catalogDirectorTerm = '';
    let currentView = loginView;
    // Bridge pour les modules ESM : getActiveGameTab() lit l'état canonique de navigation.js via main.js.
    const getActiveGameTab = window.__baieActiveGameTab;
    // UNO_MENU_CLOSE_DURATION_MS et GRID_OUTCOME_MENU_DELAY_MS : exposees sur window par js/main.js.
    let activeMathTab = 'mathCalculatorPanel';
    let activeMusicTab = 'musicHomePanel';

    // loadSession, saveSession, clearSession, scheduleSessionTimeout, registerActivity : exposes sur window par js/main.js (source = js/core/session.js).

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

    let moviesLoadStarted = false;
    function ensureMoviesLoaded() {
        if (moviesLoadStarted) return;
        moviesLoadStarted = true;
        importMoviesFromExcel();
    }

    function showCinema() {
        closeGameOverModal();
        saveSession({ lastDestination: 'cinema' });
        ensureMoviesLoaded();
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

    function returnToServices() {
        closeGameOverModal();
        saveSession({ lastDestination: 'services' });
        transitionToView(servicesView, {
            headerMode: 'none'
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

    async function importMoviesFromExcel() {
        return window.importMoviesFromExcelModule({
            excelImportStatus,
            excelSourceName,
            defaultPoster,
            setMovies: (nextMovies) => {
                movies = nextMovies;
            },
            renderAll,
            loadMovies: () => []
        });
    }

    function getCinemaCatalogContext() {
        return {
            movies,
            searchTerm,
            catalogSelectedGenres,
            catalogReleaseFilter,
            catalogMinimumRatingFilter,
            catalogSortMode,
            catalogDirectorTerm,
            defaultPoster,
            catalogGrid,
            emptyCatalogMessage,
            catalogResultsSummary,
            catalogGenreFilterGroup,
            catalogDirectorFilterBlock,
            catalogReleaseFilterBlock,
            catalogRatingFilterBlock,
            catalogReleaseFilterSelect,
            catalogRatingFilterSelect,
            catalogSortFilterSelect,
            catalogDirectorFilterInput,
            catalogDirectorSuggestions,
            manageList,
            movieCount,
            averageRating
        };
    }

    function applyCinemaCatalogState(nextState = {}) {
        searchTerm = nextState.searchTerm ?? searchTerm;
        catalogSelectedGenres = nextState.catalogSelectedGenres || catalogSelectedGenres;
        catalogReleaseFilter = nextState.catalogReleaseFilter || catalogReleaseFilter;
        catalogMinimumRatingFilter = nextState.catalogMinimumRatingFilter || catalogMinimumRatingFilter;
        catalogSortMode = nextState.catalogSortMode || catalogSortMode;
        catalogDirectorTerm = nextState.catalogDirectorTerm ?? catalogDirectorTerm;
    }

    function renderCatalogFilters() {
        applyCinemaCatalogState(window.renderCatalogFilters(getCinemaCatalogContext()));
    }

    function renderCatalog() {
        return window.renderCatalog(getCinemaCatalogContext());
    }

    function renderAll() {
        applyCinemaCatalogState(window.renderCinemaCatalogAll(getCinemaCatalogContext()));
    }

    // openLegalNoticeModal / closeLegalNoticeModal : exposes sur window par js/main.js (source = js/core/modals.js).

    function isMultiplayerLaunchPending(gameId = __mpState.getMultiplayerActiveRoom()?.gameId) {
        return __mpState.isMultiplayerLaunchPending(gameId);
    }

    function setMultiplayerEntryMode(mode) {
        return window.setMultiplayerEntryMode(mode);
    }

    // setMultiplayerStatus : expose sur window par js/main.js (source = js/multiplayer/status.js).

    function isMultiplayerChatVisible() {
        const room = __mpState.getMultiplayerActiveRoom();
        const tab = getActiveGameTab();
        return Boolean(
            room?.code
            && room?.gameLaunched
            && MULTIPLAYER_SUPPORTED_GAMES[tab]
            && room.gameId === tab
        );
    }

    function updateMultiplayerChatPanel() {
        return window.updateMultiplayerChatPanel({
            activeRoom: __mpState.getMultiplayerActiveRoom(),
            socket: __mpState.getMultiplayerSocket(),
            activeGameTab: getActiveGameTab()
        });
    }

    let multiplayerChatLastSentAt = 0;
    const MULTIPLAYER_CHAT_COOLDOWN_MS = 3000;

    async function sendMultiplayerChatMessage() {
        const message = multiplayerChatInput?.value.trim() || '';
        if (!message) {
            return;
        }

        if (!isMultiplayerChatVisible()) {
            setMultiplayerStatus('Le chat sera disponible une fois la partie lanc\u00e9e.');
            return;
        }

        const now = Date.now();
        const remaining = MULTIPLAYER_CHAT_COOLDOWN_MS - (now - multiplayerChatLastSentAt);
        if (remaining > 0) {
            setMultiplayerStatus(`Attends ${Math.ceil(remaining / 1000)}s avant le prochain message.`);
            return;
        }

        multiplayerChatLastSentAt = now;

        try {
            const socket = await ensureMultiplayerConnection();
            socket.emit('room:chat:send', { message });
            multiplayerChatInput.value = '';
            multiplayerChatInput.focus();
        } catch (error) {
            setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
        }
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

    function showGamePanel(tabId) {
        window.showGamePanel(tabId, {
            updateMultiplayerChatPanel,
            closeGameOverModal,
            updateMultiplayerLobby
        });
    }

    function showGamesHome() {
        window.showGamesHome({
            cleanupActiveGameForNavigation,
            updateMultiplayerChatPanel,
            closeGameOverModal,
            updateMultiplayerLobby
        });
    }

    function showGamesSection(section) {
        window.showGamesSection(section, {
            cleanupActiveGameForNavigation,
            updateMultiplayerChatPanel,
            closeGameOverModal,
            updateMultiplayerLobby
        });
    }

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
        onBackToServices: returnToServices,
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
        setMultiplayerEntryMode,
        showGamesSection
    });

    __music.bindMusicControls({
        onActivateMusicPanel: activateMusicPanel
    });

    window.bindAllGameEventControls({
        getSocket: () => __mpState.getMultiplayerSocket(),
        getActiveRoom: () => __mpState.getMultiplayerActiveRoom(),
        getActiveGameTab,
        isMultiplayerLaunchPending,
        toggleMultiplayerReady,
        setMultiplayerStatus,
        showGamePanel: window.showGamePanel,
        showGamesSection,
        setSelectedMultiplayerGame,
        setMultiplayerEntryMode,
        openSelectedGame,
        closeGameOverModal
    });

    __math.bindMathControls();

    window.bindCinemaCatalogControls({
        getContext: getCinemaCatalogContext,
        setState: applyCinemaCatalogState,
        renderCatalog,
        renderCatalogFilters
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

    renderAll();
    // film.xlsx (~137KB) n'est chargé qu'à la première visite du cinéma
    // (voir ensureMoviesLoaded dans showCinema). Si la session précédente
    // s'est terminée sur le cinéma, on le précharge pour éviter l'attente.
    if (loadSession()?.lastDestination === 'cinema') {
        importMoviesFromExcel();
        moviesLoadStarted = true;
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
    setMultiplayerEntryMode('create');
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
