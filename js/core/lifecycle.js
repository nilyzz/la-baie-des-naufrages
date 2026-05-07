import { loadSession, scheduleSessionTimeout, registerActivity } from './session.js';

export function bindSessionActivityTracking() {
    ['click', 'keydown', 'mousemove', 'touchstart'].forEach((eventName) => {
        document.addEventListener(eventName, registerActivity, { passive: true });
    });
}

export function bindEscapeModalControls(options = {}) {
    const {
        closeDeleteModal,
        closeLegalNoticeModal,
        closeGameOverModal
    } = options;

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') {
            return;
        }

        const confirmModal = document.getElementById('confirmModal');
        if (confirmModal && !confirmModal.classList.contains('hidden')) {
            closeDeleteModal?.();
        }

        const legalNoticeModal = document.getElementById('legalNoticeModal');
        if (legalNoticeModal && !legalNoticeModal.classList.contains('hidden')) {
            closeLegalNoticeModal?.();
        }

        const gameOverModal = document.getElementById('gameOverModal');
        if (gameOverModal && !gameOverModal.classList.contains('hidden')) {
            closeGameOverModal?.();
        }
    });
}

export function bindResponsiveGameResize(options = {}) {
    const {
        getActiveGameTab,
        syncAllGameMenuOverlayBounds,
        renderSnake,
        resetPongRound,
        initializeAirHockey,
        renderAirHockey,
        render2048,
        renderPacman,
        renderFlappy,
        renderHarborRun,
        renderStacker,
        drawBaieBerry,
        drawBreakout
    } = options;
    let resizeFrame = null;

    window.addEventListener('resize', () => {
        if (resizeFrame !== null) {
            window.cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = window.requestAnimationFrame(() => {
            resizeFrame = null;
            syncAllGameMenuOverlayBounds?.();

            const activeGameTab = getActiveGameTab?.();

            if (activeGameTab === 'snake') {
                renderSnake?.();
            }

            if (activeGameTab === 'pong') {
                resetPongRound?.();
            }

            if (activeGameTab === 'airHockey') {
                initializeAirHockey?.(false);
                renderAirHockey?.();
            }

            if (activeGameTab === '2048') {
                render2048?.();
            }

            if (activeGameTab === 'pacman') {
                renderPacman?.();
            }

            if (activeGameTab === 'flappy') {
                renderFlappy?.();
            }

            if (activeGameTab === 'harborRun') {
                renderHarborRun?.();
            }

            if (activeGameTab === 'stacker') {
                renderStacker?.();
            }

            if (activeGameTab === 'baieBerry') {
                drawBaieBerry?.();
            }

            if (activeGameTab === 'breakout') {
                drawBreakout?.();
            }
        });
    });
}

export function runInitialAppStartup(options = {}) {
    const {
        renderAll,
        importMoviesFromExcel,
        setMoviesLoadStarted,
        showGamePanel,
        updateMultiplayerLobby,
        initializeGame,
        renderMenus = [],
        setMultiplayerEntryMode,
        setSelectedMultiplayerGame,
        getDefaultMultiplayerGameId,
        startCoinClickerAutoLoop,
        initializeConverter,
        activateMathPanel,
        activateMusicPanel,
        renderPiano,
        syncAllGameMenuOverlayBounds,
        showViewImmediately,
        views = {},
        activatePanel,
        showGamesHome,
        activeMathTab = 'mathCalculatorPanel',
        activeMusicTab = 'musicHomePanel'
    } = options;

    renderAll?.();

    if (loadSession()?.lastDestination === 'cinema') {
        importMoviesFromExcel?.();
        setMoviesLoadStarted?.(true);
    }

    showGamePanel?.('home');
    updateMultiplayerLobby?.();
    initializeGame?.();
    renderMenus.forEach((renderMenu) => renderMenu?.());
    setMultiplayerEntryMode?.('create');
    setSelectedMultiplayerGame?.(getDefaultMultiplayerGameId?.() || 'ticTacToe');
    startCoinClickerAutoLoop?.();
    initializeConverter?.();
    activateMathPanel?.('mathCalculatorPanel');
    activateMusicPanel?.('musicHomePanel');
    renderPiano?.();
    syncAllGameMenuOverlayBounds?.();

    const activeSession = loadSession();
    if (!activeSession) {
        return;
    }

    if (activeSession.lastDestination === 'cinema') {
        showViewImmediately?.(views.appView, {
            showHeader: true,
            headerMode: 'cinema',
            onComplete: () => activatePanel?.('dashboardSection')
        });
    } else if (activeSession.lastDestination === 'games') {
        showViewImmediately?.(views.gamesView, {
            showHeader: true,
            headerMode: 'games',
            onComplete: () => showGamesHome?.()
        });
    } else if (activeSession.lastDestination === 'math') {
        showViewImmediately?.(views.mathView, {
            showHeader: true,
            headerMode: 'math',
            onComplete: () => activateMathPanel?.(activeMathTab)
        });
    } else if (activeSession.lastDestination === 'music') {
        showViewImmediately?.(views.musicView, {
            showHeader: true,
            headerMode: 'music',
            onComplete: () => activateMusicPanel?.(activeMusicTab)
        });
    } else {
        showViewImmediately?.(views.servicesView, {
            headerMode: 'none'
        });
    }

    scheduleSessionTimeout();
}
