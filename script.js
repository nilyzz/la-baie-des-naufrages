document.addEventListener('DOMContentLoaded', () => {
    const PASSWORD = '0';
    const STORAGE_KEY = 'baie-des-naufrages-movies';
    const SESSION_KEY = 'baie-des-naufrages-session';
    const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000;
    const defaultPoster = 'https://placehold.co/600x900/0f172a/f8fafc?text=Affiche';
    const defaultMovies = [
        {
            id: crypto.randomUUID(),
            title: 'Pirates des Caraibes',
            director: 'Gore Verbinski',
            releaseDate: '2003-08-13',
            duration: 143,
            rating: 18,
            posterUrl: 'https://placehold.co/600x900/1e293b/f8fafc?text=Pirates+des+Caraibes',
            comment: 'Une aventure culte avec une energie unique.'
        },
        {
            id: crypto.randomUUID(),
            title: 'Interstellar',
            director: 'Christopher Nolan',
            releaseDate: '2014-11-05',
            duration: 169,
            rating: 19,
            posterUrl: 'https://placehold.co/600x900/1e293b/f8fafc?text=Interstellar',
            comment: 'Visuellement immense et tres prenant.'
        },
        {
            id: crypto.randomUUID(),
            title: 'Le Seigneur des anneaux : La Communaute de l anneau',
            director: 'Peter Jackson',
            releaseDate: '2001-12-19',
            duration: 178,
            rating: 17.5,
            posterUrl: 'https://placehold.co/600x900/1e293b/f8fafc?text=Le+Seigneur+des+anneaux',
            comment: 'Un voyage epique qui pose des bases parfaites.'
        }
    ];

    const loginView = document.getElementById('loginView');
    const servicesView = document.getElementById('servicesView');
    const appView = document.getElementById('appView');
    const gamesView = document.getElementById('gamesView');
    const mathView = document.getElementById('mathView');
    const siteHeader = document.getElementById('siteHeader');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('passwordInput');
    const passwordMessage = document.getElementById('passwordMessage');
    const pageBackButton = document.getElementById('pageBackButton');
    const logoutButton = document.getElementById('logoutButton');
    const serviceCards = document.querySelectorAll('.service-card');
    const backToServicesButtons = document.querySelectorAll('[data-back-to-services="true"]');
    const cinemaHeaderNav = document.getElementById('cinemaHeaderNav');
    const gamesHeaderNav = document.getElementById('gamesHeaderNav');
    const mathHeaderNav = document.getElementById('mathHeaderNav');
    const navButtons = document.querySelectorAll('.nav-button');
    const cinemaNavButtons = document.querySelectorAll('#cinemaHeaderNav .nav-button');
    const mathNavButtons = document.querySelectorAll('#mathHeaderNav .nav-button');
    const panels = document.querySelectorAll('.panel');
    const searchInput = document.getElementById('searchInput');
    const catalogGrid = document.getElementById('catalogGrid');
    const emptyCatalogMessage = document.getElementById('emptyCatalogMessage');
    const movieForm = document.getElementById('movieForm');
    const movieIdInput = document.getElementById('movieId');
    const titleInput = document.getElementById('titleInput');
    const directorInput = document.getElementById('directorInput');
    const releaseDateInput = document.getElementById('releaseDateInput');
    const durationInput = document.getElementById('durationInput');
    const ratingInput = document.getElementById('ratingInput');
    const posterInput = document.getElementById('posterInput');
    const commentInput = document.getElementById('commentInput');
    const resetFormButton = document.getElementById('resetFormButton');
    const formMessage = document.getElementById('formMessage');
    const manageList = document.getElementById('manageList');
    const movieCount = document.getElementById('movieCount');
    const averageRating = document.getElementById('averageRating');
    const confirmModal = document.getElementById('confirmModal');
    const confirmText = document.getElementById('confirmText');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const minesweeperBoard = document.getElementById('minesweeperBoard');
    const minesweeperGame = document.getElementById('minesweeperGame');
    const mineCountDisplay = document.getElementById('mineCountDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const restartGameButton = document.getElementById('restartGameButton');
    const gameTabs = document.querySelectorAll('[data-game-tab]');
    const gamesHomeButton = document.querySelector('[data-game-home="true"]');
    const gameHomeTiles = document.querySelectorAll('[data-open-game]');
    const gameOverModal = document.getElementById('gameOverModal');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverText = document.getElementById('gameOverText');
    const snakeGame = document.getElementById('snakeGame');
    const pongGame = document.getElementById('pongGame');
    const sudokuGame = document.getElementById('sudokuGame');
    const game2048 = document.getElementById('game2048');
    const aimGame = document.getElementById('aimGame');
    const memoryGame = document.getElementById('memoryGame');
    const ticTacToeGame = document.getElementById('ticTacToeGame');
    const battleshipGame = document.getElementById('battleshipGame');
    const gamesHomePanel = document.getElementById('gamesHomePanel');
    const snakeBoard = document.getElementById('snakeBoard');
    const snakeScoreDisplay = document.getElementById('snakeScoreDisplay');
    const snakeBestScoreDisplay = document.getElementById('snakeBestScoreDisplay');
    const snakeStartButton = document.getElementById('snakeStartButton');
    const pongBoard = document.getElementById('pongBoard');
    const pongCountdown = document.getElementById('pongCountdown');
    const pongPlayerPaddle = document.getElementById('pongPlayerPaddle');
    const pongAiPaddle = document.getElementById('pongAiPaddle');
    const pongBall = document.getElementById('pongBall');
    const pongPlayerScoreDisplay = document.getElementById('pongPlayerScoreDisplay');
    const pongAiScoreDisplay = document.getElementById('pongAiScoreDisplay');
    const pongStartButton = document.getElementById('pongStartButton');
    const sudokuBoard = document.getElementById('sudokuBoard');
    const sudokuFilledDisplay = document.getElementById('sudokuFilledDisplay');
    const sudokuDifficultyDisplay = document.getElementById('sudokuDifficultyDisplay');
    const sudokuRestartButton = document.getElementById('sudokuRestartButton');
    const sudokuHelpText = document.getElementById('sudokuHelpText');
    const game2048Board = document.getElementById('game2048Board');
    const game2048ScoreDisplay = document.getElementById('game2048ScoreDisplay');
    const game2048BestScoreDisplay = document.getElementById('game2048BestScoreDisplay');
    const game2048RestartButton = document.getElementById('game2048RestartButton');
    const aimBoard = document.getElementById('aimBoard');
    const aimScoreDisplay = document.getElementById('aimScoreDisplay');
    const aimTimerDisplay = document.getElementById('aimTimerDisplay');
    const aimBestScoreDisplay = document.getElementById('aimBestScoreDisplay');
    const aimStartButton = document.getElementById('aimStartButton');
    const memoryBoard = document.getElementById('memoryBoard');
    const memoryPairsDisplay = document.getElementById('memoryPairsDisplay');
    const memoryMovesDisplay = document.getElementById('memoryMovesDisplay');
    const memoryRestartButton = document.getElementById('memoryRestartButton');
    const ticTacToeBoard = document.getElementById('ticTacToeBoard');
    const ticTacToeTurnDisplay = document.getElementById('ticTacToeTurnDisplay');
    const ticTacToeScoreDisplay = document.getElementById('ticTacToeScoreDisplay');
    const ticTacToeHelpText = document.getElementById('ticTacToeHelpText');
    const ticTacToeRestartButton = document.getElementById('ticTacToeRestartButton');
    const battleshipPlayerBoard = document.getElementById('battleshipPlayerBoard');
    const battleshipEnemyBoard = document.getElementById('battleshipEnemyBoard');
    const battleshipPlayerShipsDisplay = document.getElementById('battleshipPlayerShipsDisplay');
    const battleshipEnemyShipsDisplay = document.getElementById('battleshipEnemyShipsDisplay');
    const battleshipStatusText = document.getElementById('battleshipStatusText');
    const battleshipRestartButton = document.getElementById('battleshipRestartButton');
    const mathPanels = document.querySelectorAll('.math-panel');
    const calculatorDisplay = document.getElementById('calculatorDisplay');
    const calculatorStatus = document.getElementById('calculatorStatus');
    const calculatorKeys = document.querySelectorAll('.calculator-key');
    const converterCategory = document.getElementById('converterCategory');
    const converterValue = document.getElementById('converterValue');
    const converterFrom = document.getElementById('converterFrom');
    const converterTo = document.getElementById('converterTo');
    const converterSwapButton = document.getElementById('converterSwapButton');
    const converterConvertButton = document.getElementById('converterConvertButton');
    const converterResult = document.getElementById('converterResult');
    const percentageRate = document.getElementById('percentageRate');
    const percentageBase = document.getElementById('percentageBase');
    const percentageButton = document.getElementById('percentageButton');
    const percentageResult = document.getElementById('percentageResult');
    const ruleThreeA = document.getElementById('ruleThreeA');
    const ruleThreeB = document.getElementById('ruleThreeB');
    const ruleThreeC = document.getElementById('ruleThreeC');
    const ruleThreeButton = document.getElementById('ruleThreeButton');
    const ruleThreeResult = document.getElementById('ruleThreeResult');
    const circleRadius = document.getElementById('circleRadius');
    const circleButton = document.getElementById('circleButton');
    const circleResult = document.getElementById('circleResult');

    const BOARD_SIZE = 14;
    const TOTAL_MINES = 36;
    const SNAKE_SIZE = 16;
    const SNAKE_TICK_MS = 165;
    const SNAKE_BEST_KEY = 'baie-des-naufrages-snake-best';
    const PONG_TARGET_SCORE = 7;
    const SUDOKU_SIZE = 9;
    const GAME_2048_SIZE = 4;
    const GAME_2048_BEST_KEY = 'baie-des-naufrages-2048-best';
    const AIM_GRID_SIZE = 6;
    const AIM_TARGET_COUNT = 5;
    const AIM_ROUND_SECONDS = 30;
    const AIM_HIT_SCORE = 12;
    const AIM_MISS_SCORE = 5;
    const AIM_BEST_KEY = 'baie-des-naufrages-aim-best';
    const MEMORY_ICONS = ['⚓', '🦀', '🐚', '🦑', '🪸', '🦞', '🐠', '🧭'];
    const BATTLESHIP_SIZE = 8;
    const BATTLESHIP_SHIPS = [4, 3, 3, 2, 2];
    const SUDOKU_DIFFICULTIES = [
        { difficulty: 'Calme', removals: 38 },
        { difficulty: 'Brise', removals: 46 },
        { difficulty: 'Cap', removals: 52 }
    ];
    const UNIT_GROUPS = {
        length: {
            label: 'Longueur',
            units: [
                { value: 'mm', label: 'Millimetre', factor: 0.001 },
                { value: 'cm', label: 'Centimetre', factor: 0.01 },
                { value: 'm', label: 'Metre', factor: 1 },
                { value: 'km', label: 'Kilometre', factor: 1000 }
            ]
        },
        mass: {
            label: 'Masse',
            units: [
                { value: 'mg', label: 'Milligramme', factor: 0.000001 },
                { value: 'g', label: 'Gramme', factor: 0.001 },
                { value: 'kg', label: 'Kilogramme', factor: 1 },
                { value: 't', label: 'Tonne', factor: 1000 }
            ]
        },
        time: {
            label: 'Temps',
            units: [
                { value: 's', label: 'Seconde', factor: 1 },
                { value: 'min', label: 'Minute', factor: 60 },
                { value: 'h', label: 'Heure', factor: 3600 },
                { value: 'd', label: 'Jour', factor: 86400 }
            ]
        },
        temperature: {
            label: 'Temperature',
            units: [
                { value: 'c', label: 'Celsius' },
                { value: 'f', label: 'Fahrenheit' },
                { value: 'k', label: 'Kelvin' }
            ]
        }
    };

    let movies = loadMovies();
    let searchTerm = '';
    let movieIdToDelete = null;
    let currentView = loginView;
    let gameBoard = [];
    let flagsPlaced = 0;
    let timer = 0;
    let timerInterval = null;
    let gameStarted = false;
    let gameFinished = false;
    let sessionTimeout = null;
    let activeGameTab = 'home';
    let snake = [];
    let snakeDirection = { x: 1, y: 0 };
    let snakeNextDirection = { x: 1, y: 0 };
    let snakeFoods = [];
    let snakeScore = 0;
    let snakeBestScore = Number(window.localStorage.getItem(SNAKE_BEST_KEY)) || 0;
    let snakeInterval = null;
    let snakeRunning = false;
    let snakeJustAte = false;
    let snakeDirectionQueue = [];
    let snakeOverlayLayer = null;
    let snakeSegmentElements = [];
    let snakeFoodElements = new Map();
    let pongRunning = false;
    let pongAnimationFrame = null;
    let pongLastFrame = 0;
    let pongPlayerScore = 0;
    let pongAiScore = 0;
    let pongKeys = new Set();
    let pongState = null;
    let pongPaused = false;
    let pongCountdownTimer = null;
    let pongCountdownCompleteTimer = null;
    let sudokuPuzzle = null;
    let sudokuBoardState = [];
    let sudokuSelectedCell = null;
    let sudokuSolved = false;
    let sudokuFailed = false;
    let sudokuScore = 0;
    let sudokuMistakes = 0;
    let sudokuCombo = 0;
    let sudokuElapsedSeconds = 0;
    let sudokuTimerInterval = null;
    let sudokuFeedbackCell = null;
    let sudokuFeedbackTimeout = null;
    let game2048Grid = [];
    let game2048Tiles = [];
    let game2048Score = 0;
    let game2048BestScore = Number(window.localStorage.getItem(GAME_2048_BEST_KEY)) || 0;
    let game2048TileLayer = null;
    let game2048TileElements = new Map();
    let game2048NextTileId = 1;
    let game2048Animating = false;
    let game2048AnimationTimeout = null;
    let game2048QueuedMove = null;
    let aimTargets = [];
    let aimScore = 0;
    let aimBestScore = Number(window.localStorage.getItem(AIM_BEST_KEY)) || 0;
    let aimTimeRemaining = AIM_ROUND_SECONDS;
    let aimRoundRunning = false;
    let aimRoundCompleted = false;
    let aimTimerInterval = null;
    let memoryCards = [];
    let memoryFlippedIndices = [];
    let memoryMatchedPairs = 0;
    let memoryMoves = 0;
    let memoryLockBoard = false;
    let memoryMismatchTimeout = null;
    let ticTacToeBoardState = Array(9).fill('');
    let ticTacToeCurrentPlayer = 'X';
    let ticTacToeScores = { X: 0, O: 0 };
    let ticTacToeFinished = false;
    let battleshipPlayerGrid = [];
    let battleshipEnemyGrid = [];
    let battleshipPlayerRemainingShips = 0;
    let battleshipEnemyRemainingShips = 0;
    let battleshipFinished = false;
    let battleshipAiTargets = [];
    let battleshipAwaitingAi = false;
    let activeMathTab = 'mathCalculatorPanel';

    function loadSession() {
        try {
            const storedSession = window.localStorage.getItem(SESSION_KEY);

            if (!storedSession) {
                return null;
            }

            const session = JSON.parse(storedSession);

            if (!session?.authenticated || !session.lastActivity) {
                return null;
            }

            if (Date.now() - Number(session.lastActivity) > SESSION_TIMEOUT_MS) {
                clearSession();
                return null;
            }

            return session;
        } catch (error) {
            console.error('Impossible de lire la session sauvegardee.', error);
            clearSession();
            return null;
        }
    }

    function saveSession(partialSession = {}) {
        const currentSession = loadSession() || {};
        const nextSession = {
            authenticated: true,
            lastActivity: Date.now(),
            lastDestination: currentSession.lastDestination || 'services',
            ...currentSession,
            ...partialSession
        };

        window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        scheduleSessionTimeout();
    }

    function clearSession() {
        if (sessionTimeout) {
            window.clearTimeout(sessionTimeout);
            sessionTimeout = null;
        }

        window.localStorage.removeItem(SESSION_KEY);
    }

    function scheduleSessionTimeout() {
        const session = loadSession();

        if (sessionTimeout) {
            window.clearTimeout(sessionTimeout);
            sessionTimeout = null;
        }

        if (!session) {
            return;
        }

        const timeRemaining = SESSION_TIMEOUT_MS - (Date.now() - Number(session.lastActivity));

        if (timeRemaining <= 0) {
            clearSession();
            return;
        }

        sessionTimeout = window.setTimeout(() => {
            clearSession();
            window.location.reload();
        }, timeRemaining);
    }

    function registerActivity() {
        const session = loadSession();

        if (!session) {
            return;
        }

        saveSession({
            ...session,
            lastActivity: Date.now()
        });
    }

    function loadMovies() {
        const storedMovies = window.localStorage.getItem(STORAGE_KEY);

        if (!storedMovies) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMovies));
            return [...defaultMovies];
        }

        try {
            return JSON.parse(storedMovies).map((movie) => ({
                ...movie,
                duration: Number(movie.duration) || 0,
                posterUrl: movie.posterUrl || defaultPoster
            }));
        } catch (error) {
            console.error('Impossible de lire les films sauvegardes.', error);
            return [...defaultMovies];
        }
    }

    function saveMovies() {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    }

    function setHeaderMode(mode = 'none') {
        const showCinemaHeader = mode === 'cinema';
        const showGamesHeader = mode === 'games';
        const showMathHeader = mode === 'math';

        cinemaHeaderNav.classList.toggle('hidden', !showCinemaHeader);
        gamesHeaderNav.classList.toggle('hidden', !showGamesHeader);
        mathHeaderNav.classList.toggle('hidden', !showMathHeader);
    }

    function transitionToView(nextView, options = {}) {
        const {
            showHeader = false,
            headerMode = 'none',
            onComplete
        } = options;

        currentView.classList.add('view-leaving');

        window.setTimeout(() => {
            currentView.classList.remove('view-active', 'view-leaving');
            currentView.setAttribute('aria-hidden', 'true');

            siteHeader.classList.toggle('hidden', !showHeader);
            siteHeader.setAttribute('aria-hidden', String(!showHeader));
            setHeaderMode(headerMode);
            logoutButton?.classList.toggle('hidden', nextView === loginView);
            pageBackButton?.classList.toggle('hidden', nextView !== appView && nextView !== gamesView && nextView !== mathView);

            nextView.classList.add('view-active');
            nextView.setAttribute('aria-hidden', 'false');
            currentView = nextView;

            if (typeof onComplete === 'function') {
                onComplete();
            }
        }, 450);
    }

    function showViewImmediately(nextView, options = {}) {
        const {
            showHeader = false,
            headerMode = 'none',
            onComplete
        } = options;

        document.querySelectorAll('.view').forEach((view) => {
            view.classList.remove('view-active', 'view-leaving');
            view.setAttribute('aria-hidden', 'true');
        });

        siteHeader.classList.toggle('hidden', !showHeader);
        siteHeader.setAttribute('aria-hidden', String(!showHeader));
        setHeaderMode(headerMode);
        logoutButton?.classList.toggle('hidden', nextView === loginView);
        pageBackButton?.classList.toggle('hidden', nextView !== appView && nextView !== gamesView && nextView !== mathView);

        nextView.classList.add('view-active');
        nextView.setAttribute('aria-hidden', 'false');
        currentView = nextView;

        if (typeof onComplete === 'function') {
            onComplete();
        }
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
        transitionToView(appView, {
            showHeader: true,
            headerMode: 'cinema',
            onComplete: () => activatePanel('dashboardSection')
        });
    }

    function showGames() {
        if (!gameBoard.length) {
            initializeGame();
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

    function returnToServices() {
        closeGameOverModal();
        saveSession({ lastDestination: 'services' });
        transitionToView(servicesView, {
            headerMode: 'none'
        });
    }

    function activatePanel(targetId) {
        cinemaNavButtons.forEach((button) => {
            const isActive = button.dataset.target === targetId;
            button.classList.toggle('is-active', isActive);
        });

        panels.forEach((panel) => {
            panel.classList.toggle('panel-active', panel.id === targetId);
        });
    }

    function activateMathPanel(targetId) {
        activeMathTab = targetId;

        mathNavButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.mathTab === targetId);
        });

        mathPanels.forEach((panel) => {
            panel.classList.toggle('math-panel-active', panel.id === targetId);
        });
    }

    function formatMathNumber(value, digits = 6) {
        if (!Number.isFinite(value)) {
            return 'Impossible';
        }

        const rounded = Number(value.toFixed(digits));
        return new Intl.NumberFormat('fr-FR', {
            maximumFractionDigits: digits
        }).format(rounded);
    }

    function normalizeCalculatorExpression(expression) {
        return expression
            .replace(/,/g, '.')
            .replace(/[x×]/gi, '*')
            .replace(/[÷]/g, '/')
            .replace(/\bpi\b/gi, 'Math.PI')
            .replace(/\bsqrt\(/gi, 'Math.sqrt(')
            .replace(/\^/g, '**');
    }

    function evaluateCalculatorExpression() {
        const rawExpression = calculatorDisplay.value.trim();

        if (!rawExpression) {
            calculatorStatus.textContent = 'Entre une expression a calculer.';
            calculatorStatus.classList.remove('feedback-success');
            calculatorStatus.classList.add('feedback-error');
            return;
        }

        const normalizedExpression = normalizeCalculatorExpression(rawExpression);

        if (!/^(?:[0-9+\-*/().%\s]|Math\.PI|Math\.sqrt)+$/.test(normalizedExpression)) {
            calculatorStatus.textContent = 'Expression invalide.';
            calculatorStatus.classList.remove('feedback-success');
            calculatorStatus.classList.add('feedback-error');
            return;
        }

        try {
            const result = Function(`"use strict"; return (${normalizedExpression});`)();

            if (!Number.isFinite(result)) {
                throw new Error('Resultat non fini');
            }

            calculatorDisplay.value = String(Number(result.toFixed(10)));
            calculatorStatus.textContent = `Resultat: ${formatMathNumber(result, 10)}`;
            calculatorStatus.classList.remove('feedback-error');
            calculatorStatus.classList.add('feedback-success');
        } catch (error) {
            calculatorStatus.textContent = 'Calcul impossible. Verifie l expression.';
            calculatorStatus.classList.remove('feedback-success');
            calculatorStatus.classList.add('feedback-error');
        }
    }

    function populateConverterUnits(categoryKey) {
        const group = UNIT_GROUPS[categoryKey];

        if (!group) {
            return;
        }

        const optionsMarkup = group.units.map((unit) => `
            <option value="${unit.value}">${unit.label}</option>
        `).join('');

        converterFrom.innerHTML = optionsMarkup;
        converterTo.innerHTML = optionsMarkup;
        converterTo.selectedIndex = Math.min(1, group.units.length - 1);
    }

    function convertTemperature(value, from, to) {
        let celsiusValue = value;

        if (from === 'f') {
            celsiusValue = (value - 32) * (5 / 9);
        } else if (from === 'k') {
            celsiusValue = value - 273.15;
        }

        if (to === 'f') {
            return (celsiusValue * 9 / 5) + 32;
        }

        if (to === 'k') {
            return celsiusValue + 273.15;
        }

        return celsiusValue;
    }

    function convertUnits() {
        const categoryKey = converterCategory.value;
        const group = UNIT_GROUPS[categoryKey];
        const value = Number(converterValue.value);

        if (!group || Number.isNaN(value)) {
            converterResult.textContent = 'Entre une valeur valide pour convertir.';
            return;
        }

        const from = converterFrom.value;
        const to = converterTo.value;
        let result = value;

        if (categoryKey === 'temperature') {
            result = convertTemperature(value, from, to);
        } else {
            const fromUnit = group.units.find((unit) => unit.value === from);
            const toUnit = group.units.find((unit) => unit.value === to);

            if (!fromUnit || !toUnit) {
                converterResult.textContent = 'Conversion indisponible.';
                return;
            }

            result = (value * fromUnit.factor) / toUnit.factor;
        }

        const fromLabel = group.units.find((unit) => unit.value === from)?.label || from;
        const toLabel = group.units.find((unit) => unit.value === to)?.label || to;
        converterResult.textContent = `${formatMathNumber(value)} ${fromLabel} = ${formatMathNumber(result)} ${toLabel}`;
    }

    function initializeConverter() {
        converterCategory.innerHTML = Object.entries(UNIT_GROUPS).map(([value, group]) => `
            <option value="${value}">${group.label}</option>
        `).join('');

        populateConverterUnits(converterCategory.value || 'length');
    }

    function calculatePercentage() {
        const rate = Number(percentageRate.value);
        const base = Number(percentageBase.value);

        if (Number.isNaN(rate) || Number.isNaN(base)) {
            percentageResult.textContent = 'Entre un pourcentage et une valeur valides.';
            return;
        }

        const result = (rate / 100) * base;
        percentageResult.textContent = `${formatMathNumber(rate)}% de ${formatMathNumber(base)} = ${formatMathNumber(result)}`;
    }

    function calculateRuleOfThree() {
        const a = Number(ruleThreeA.value);
        const b = Number(ruleThreeB.value);
        const c = Number(ruleThreeC.value);

        if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(c) || a === 0) {
            ruleThreeResult.textContent = 'Entre trois valeurs valides et un a different de 0.';
            return;
        }

        const result = (b * c) / a;
        ruleThreeResult.textContent = `Si ${formatMathNumber(a)} correspond a ${formatMathNumber(b)}, alors ${formatMathNumber(c)} correspond a ${formatMathNumber(result)}.`;
    }

    function calculateCircle() {
        const radius = Number(circleRadius.value);

        if (Number.isNaN(radius) || radius < 0) {
            circleResult.textContent = 'Entre un rayon valide.';
            return;
        }

        const diameter = radius * 2;
        const circumference = 2 * Math.PI * radius;
        const area = Math.PI * radius * radius;

        circleResult.textContent = `Diametre: ${formatMathNumber(diameter)} | Circonference: ${formatMathNumber(circumference)} | Aire: ${formatMathNumber(area)}`;
    }

    function formatDate(dateString) {
        return new Intl.DateTimeFormat('fr-FR').format(new Date(dateString));
    }

    function formatDuration(minutes) {
        const value = Number(minutes);

        if (!value) {
            return 'Duree inconnue';
        }

        const hours = Math.floor(value / 60);
        const remainingMinutes = value % 60;

        if (!hours) {
            return `${remainingMinutes} min`;
        }

        if (!remainingMinutes) {
            return `${hours}h`;
        }

        return `${hours}h${String(remainingMinutes).padStart(2, '0')}`;
    }

    function getFilteredMovies() {
        if (!searchTerm) {
            return movies;
        }

        const normalizedSearch = searchTerm.trim().toLowerCase();

        return movies.filter((movie) => {
            return movie.title.toLowerCase().includes(normalizedSearch)
                || movie.director.toLowerCase().includes(normalizedSearch);
        });
    }

    function renderStats() {
        const count = movies.length;
        const total = movies.reduce((sum, movie) => sum + Number(movie.rating), 0);
        const average = count ? (total / count).toFixed(1) : '0.0';

        movieCount.textContent = `${count} film${count > 1 ? 's' : ''}`;
        averageRating.textContent = `${average} / 20`;
    }

    function renderCatalog() {
        const filteredMovies = getFilteredMovies();

        catalogGrid.innerHTML = filteredMovies.map((movie) => `
            <article class="movie-card">
                <div class="movie-poster-shell">
                    <span class="rating-badge rating-badge-floating">${Number(movie.rating).toFixed(1)} / 20</span>
                    <img
                        class="movie-poster"
                        src="${movie.posterUrl || defaultPoster}"
                        alt="Affiche de ${movie.title}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='${defaultPoster}';"
                    >
                </div>

                <div class="card movie-card-body">
                    <h4>${movie.title}</h4>
                    <div class="movie-meta">
                        <p><strong>Sortie :</strong> ${formatDate(movie.releaseDate)}</p>
                        <p><strong>Realisateur :</strong> ${movie.director}</p>
                        <p><strong>Duree :</strong> ${formatDuration(movie.duration)}</p>
                    </div>
                    <p class="movie-comment">${movie.comment || 'Aucun commentaire pour le moment.'}</p>
                </div>
            </article>
        `).join('');

        emptyCatalogMessage.classList.toggle('hidden', filteredMovies.length > 0);
    }

    function renderManageList() {
        if (!movies.length) {
            manageList.innerHTML = '<p class="empty-state">Aucun film enregistre pour le moment.</p>';
            return;
        }

        manageList.innerHTML = movies.map((movie) => `
            <article class="manage-item">
                <div class="manage-item-copy">
                    <h4>${movie.title}</h4>
                    <p>${movie.director} | ${formatDuration(movie.duration)} | ${Number(movie.rating).toFixed(1)} / 20</p>
                </div>

                <div class="manage-item-actions">
                    <button type="button" class="secondary-button manage-action" data-action="edit" data-id="${movie.id}">Modifier</button>
                    <button type="button" class="danger-button manage-action" data-action="delete" data-id="${movie.id}" data-title="${movie.title}">Supprimer</button>
                </div>
            </article>
        `).join('');
    }

    function renderAll() {
        renderStats();
        renderCatalog();
        renderManageList();
    }

    function showGamePanel(tabId) {
        activeGameTab = tabId;
        gamesHomeButton?.classList.toggle('is-active', tabId === 'home');
        gamesHomePanel.classList.toggle('games-panel-active', tabId === 'home');
        minesweeperGame.classList.toggle('games-panel-active', tabId === 'minesweeper');
        snakeGame.classList.toggle('games-panel-active', tabId === 'snake');
        pongGame.classList.toggle('games-panel-active', tabId === 'pong');
        sudokuGame.classList.toggle('games-panel-active', tabId === 'sudoku');
        game2048.classList.toggle('games-panel-active', tabId === '2048');
        aimGame.classList.toggle('games-panel-active', tabId === 'aim');
        memoryGame.classList.toggle('games-panel-active', tabId === 'memory');
        ticTacToeGame.classList.toggle('games-panel-active', tabId === 'ticTacToe');
        battleshipGame.classList.toggle('games-panel-active', tabId === 'battleship');

        if (tabId !== 'snake') {
            closeGameOverModal();
        }
    }

    function showGamesHome() {
        cleanupActiveGameForNavigation('home');
        showGamePanel('home');
    }

    function cleanupActiveGameForNavigation(nextTab) {
        const previousTab = activeGameTab;

        if (previousTab === 'minesweeper' && nextTab !== 'minesweeper') {
            initializeGame();
        }

        if (previousTab === 'snake' && nextTab !== 'snake') {
            stopSnake();
            initializeSnake();
        }

        if (previousTab === 'pong' && nextTab !== 'pong') {
            stopPong();
            initializePong();
        }

        if (previousTab === 'sudoku' && nextTab !== 'sudoku') {
            initializeSudoku();
        }

        if (previousTab === '2048' && nextTab !== '2048') {
            initialize2048();
        }

        if (previousTab === 'aim' && nextTab !== 'aim') {
            initializeAim();
        }

        if (previousTab === 'memory' && nextTab !== 'memory') {
            initializeMemory();
        }

        if (previousTab === 'ticTacToe' && nextTab !== 'ticTacToe') {
            initializeTicTacToe();
        }

        if (previousTab === 'battleship' && nextTab !== 'battleship') {
            initializeBattleship();
        }
    }

    function shuffleArray(items) {
        const array = [...items];

        for (let index = array.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
        }

        return array;
    }

    function updateMemoryHud() {
        memoryPairsDisplay.textContent = `${memoryMatchedPairs} / 8`;
        memoryMovesDisplay.textContent = String(memoryMoves);
    }

    function renderMemoryBoard() {
        memoryBoard.innerHTML = memoryCards.map((card, index) => {
            const isRevealed = card.isMatched || card.isFlipped;

            return `
                <button
                    type="button"
                    class="memory-card-tile${isRevealed ? ' is-revealed' : ''}${card.isMatched ? ' is-matched' : ''}"
                    data-index="${index}"
                    aria-label="${isRevealed ? `Carte ${card.icon}` : 'Carte retournee'}"
                >
                    <span class="memory-card-face memory-card-front" aria-hidden="true">${card.icon}</span>
                    <span class="memory-card-face memory-card-back" aria-hidden="true">BN</span>
                </button>
            `;
        }).join('');
    }

    function initializeMemory() {
        if (memoryMismatchTimeout) {
            window.clearTimeout(memoryMismatchTimeout);
            memoryMismatchTimeout = null;
        }

        const deck = shuffleArray([...MEMORY_ICONS, ...MEMORY_ICONS]).map((icon, index) => ({
            id: `${icon}-${index}`,
            icon,
            isFlipped: false,
            isMatched: false
        }));

        memoryCards = deck;
        memoryFlippedIndices = [];
        memoryMatchedPairs = 0;
        memoryMoves = 0;
        memoryLockBoard = false;
        updateMemoryHud();
        renderMemoryBoard();
    }

    function finishMemory() {
        openGameOverModal('Memory termine', `Toutes les paires ont ete retrouvees en ${memoryMoves} coups.`);
    }

    function handleMemoryCardFlip(index) {
        if (memoryLockBoard) {
            return;
        }

        const card = memoryCards[index];

        if (!card || card.isMatched || card.isFlipped) {
            return;
        }

        card.isFlipped = true;
        memoryFlippedIndices.push(index);
        renderMemoryBoard();

        if (memoryFlippedIndices.length < 2) {
            return;
        }

        memoryMoves += 1;
        const [firstIndex, secondIndex] = memoryFlippedIndices;
        const firstCard = memoryCards[firstIndex];
        const secondCard = memoryCards[secondIndex];

        if (firstCard.icon === secondCard.icon) {
            firstCard.isMatched = true;
            secondCard.isMatched = true;
            memoryMatchedPairs += 1;
            memoryFlippedIndices = [];
            updateMemoryHud();
            renderMemoryBoard();

            if (memoryMatchedPairs === MEMORY_ICONS.length) {
                finishMemory();
            }
            return;
        }

        updateMemoryHud();
        memoryLockBoard = true;
        memoryMismatchTimeout = window.setTimeout(() => {
            firstCard.isFlipped = false;
            secondCard.isFlipped = false;
            memoryFlippedIndices = [];
            memoryLockBoard = false;
            renderMemoryBoard();
        }, 720);
    }

    function updateTicTacToeHud() {
        ticTacToeTurnDisplay.textContent = ticTacToeFinished ? '-' : ticTacToeCurrentPlayer;
        ticTacToeScoreDisplay.textContent = `X ${ticTacToeScores.X} - ${ticTacToeScores.O} O`;
    }

    function renderTicTacToeBoard() {
        ticTacToeBoard.innerHTML = ticTacToeBoardState.map((cell, index) => `
            <button
                type="button"
                class="tictactoe-cell${cell ? ` is-${cell.toLowerCase()}` : ''}"
                data-index="${index}"
                aria-label="${cell ? `Case ${cell}` : 'Case vide'}"
            >
                <span aria-hidden="true">${cell}</span>
            </button>
        `).join('');
    }

    function getTicTacToeWinner() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return lines.find(([a, b, c]) => {
            return ticTacToeBoardState[a]
                && ticTacToeBoardState[a] === ticTacToeBoardState[b]
                && ticTacToeBoardState[a] === ticTacToeBoardState[c];
        }) || null;
    }

    function initializeTicTacToe() {
        ticTacToeBoardState = Array(9).fill('');
        ticTacToeCurrentPlayer = 'X';
        ticTacToeFinished = false;
        ticTacToeHelpText.textContent = 'Aligne trois symboles pour gagner le duel sur le pont.';
        updateTicTacToeHud();
        renderTicTacToeBoard();
    }

    function handleTicTacToeMove(index) {
        if (ticTacToeFinished || ticTacToeBoardState[index]) {
            return;
        }

        ticTacToeBoardState[index] = ticTacToeCurrentPlayer;
        const winningLine = getTicTacToeWinner();

        if (winningLine) {
            ticTacToeFinished = true;
            ticTacToeScores[ticTacToeCurrentPlayer] += 1;
            ticTacToeHelpText.textContent = `Le capitaine ${ticTacToeCurrentPlayer} remporte le duel.`;
            updateTicTacToeHud();
            renderTicTacToeBoard();
            return;
        }

        if (ticTacToeBoardState.every(Boolean)) {
            ticTacToeFinished = true;
            ticTacToeHelpText.textContent = 'Match nul. Les deux equipages restent a quai.';
            updateTicTacToeHud();
            renderTicTacToeBoard();
            return;
        }

        ticTacToeCurrentPlayer = ticTacToeCurrentPlayer === 'X' ? 'O' : 'X';
        ticTacToeHelpText.textContent = `Au tour du capitaine ${ticTacToeCurrentPlayer}.`;
        updateTicTacToeHud();
        renderTicTacToeBoard();
    }

    function createBattleshipGrid() {
        return Array.from({ length: BATTLESHIP_SIZE }, () => Array.from({ length: BATTLESHIP_SIZE }, () => ({
            hasShip: false,
            hit: false,
            shipId: null
        })));
    }

    function placeBattleshipFleet(grid) {
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

    function countRemainingBattleshipShips(grid) {
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

    function updateBattleshipHud() {
        battleshipPlayerShipsDisplay.textContent = String(battleshipPlayerRemainingShips);
        battleshipEnemyShipsDisplay.textContent = String(battleshipEnemyRemainingShips);
    }

    function getBattleshipShipSegmentClass(grid, rowIndex, colIndex) {
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

    function renderBattleshipBoard(boardElement, grid, revealShips = false, boardType = 'enemy') {
        boardElement.innerHTML = grid.map((row, rowIndex) => row.map((cell, colIndex) => {
            const classes = ['battleship-cell'];
            let innerMarkup = '';
            const shouldShowShip = (revealShips && cell.hasShip) || (cell.hit && cell.hasShip);

            if (shouldShowShip) {
                classes.push('has-ship');
                innerMarkup = `<span class="battleship-ship ${getBattleshipShipSegmentClass(grid, rowIndex, colIndex)}" aria-hidden="true"></span>`;
            }

            if (cell.hit && cell.hasShip) {
                classes.push('is-hit');
                label = '✕';
            } else if (cell.hit) {
                classes.push('is-miss');
                label = '•';
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

    function renderBattleship() {
        renderBattleshipBoard(battleshipPlayerBoard, battleshipPlayerGrid, true, 'player');
        renderBattleshipBoard(battleshipEnemyBoard, battleshipEnemyGrid, false, 'enemy');
        updateBattleshipHud();
    }

    function initializeBattleship() {
        battleshipPlayerGrid = createBattleshipGrid();
        battleshipEnemyGrid = createBattleshipGrid();
        placeBattleshipFleet(battleshipPlayerGrid);
        placeBattleshipFleet(battleshipEnemyGrid);
        battleshipPlayerRemainingShips = BATTLESHIP_SHIPS.length;
        battleshipEnemyRemainingShips = BATTLESHIP_SHIPS.length;
        battleshipFinished = false;
        battleshipAwaitingAi = false;
        battleshipAiTargets = shuffleArray(
            Array.from({ length: BATTLESHIP_SIZE * BATTLESHIP_SIZE }, (_, index) => ({
                row: Math.floor(index / BATTLESHIP_SIZE),
                col: index % BATTLESHIP_SIZE
            }))
        );
        battleshipStatusText.textContent = 'Choisis une case dans la grille ennemie pour ouvrir le feu.';
        renderBattleship();
    }

    function finishBattleship(playerWon) {
        battleshipFinished = true;
        battleshipStatusText.textContent = playerWon
            ? 'Victoire. La flotte adverse sombre dans la baie.'
            : 'Defaite. Ta flotte a ete coulee.';
        openGameOverModal(
            playerWon ? 'Victoire' : 'C est perdu',
            playerWon ? 'La bataille navale est remportee.' : 'La flotte ennemie gagne la bataille.'
        );
    }

    function runBattleshipAiTurn() {
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
            battleshipStatusText.textContent = 'L ennemi a touche un de tes navires.';

            if (battleshipPlayerRemainingShips === 0) {
                renderBattleship();
                finishBattleship(false);
                return;
            }
        } else {
            battleshipStatusText.textContent = 'L ennemi a manque son tir.';
        }

        battleshipAwaitingAi = false;
        renderBattleship();
    }

    function handleBattleshipShot(row, col) {
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
            battleshipStatusText.textContent = 'Touche. Tu viens de frapper un navire ennemi.';
            renderBattleship();

            if (battleshipEnemyRemainingShips === 0) {
                finishBattleship(true);
                return;
            }
        }

        if (!targetCell.hasShip) {
            battleshipStatusText.textContent = 'Dans l eau. La flotte ennemie replique.';
            renderBattleship();
        }

        window.setTimeout(() => {
            runBattleshipAiTurn();
        }, 420);
    }

    function updateAimHud() {
        aimScoreDisplay.textContent = String(aimScore);
        aimTimerDisplay.textContent = String(aimTimeRemaining);
        aimBestScoreDisplay.textContent = String(aimBestScore);
        aimStartButton.textContent = aimRoundRunning ? 'Bordee en cours' : 'Nouvelle bordee';
    }

    function getAimFreeCells(excludedKey = null) {
        const occupied = new Set(
            aimTargets
                .filter((target) => `${target.row}-${target.col}` !== excludedKey)
                .map((target) => `${target.row}-${target.col}`)
        );
        const freeCells = [];

        for (let row = 0; row < AIM_GRID_SIZE; row += 1) {
            for (let col = 0; col < AIM_GRID_SIZE; col += 1) {
                const key = `${row}-${col}`;

                if (!occupied.has(key)) {
                    freeCells.push({ row, col });
                }
            }
        }

        return freeCells;
    }

    function pickRandomAimCell(excludedKey = null) {
        const freeCells = getAimFreeCells(excludedKey);

        if (!freeCells.length) {
            return null;
        }

        return freeCells[Math.floor(Math.random() * freeCells.length)];
    }

    function createAimTargets() {
        aimTargets = [];

        while (aimTargets.length < AIM_TARGET_COUNT) {
            const nextCell = pickRandomAimCell();

            if (!nextCell) {
                break;
            }

            aimTargets.push({
                id: crypto.randomUUID(),
                row: nextCell.row,
                col: nextCell.col
            });
        }
    }

    function renderAimBoard() {
        aimBoard.innerHTML = Array.from({ length: AIM_GRID_SIZE * AIM_GRID_SIZE }, (_, index) => {
            const row = Math.floor(index / AIM_GRID_SIZE);
            const col = index % AIM_GRID_SIZE;
            const target = aimTargets.find((item) => item.row === row && item.col === col);

            return `
                <button
                    type="button"
                    class="aim-cell${target ? ' aim-cell-has-target' : ''}"
                    data-row="${row}"
                    data-col="${col}"
                    ${target ? `data-target-id="${target.id}"` : ''}
                    aria-label="${target ? 'Oursin a toucher' : 'Case d eau'}"
                >
                    ${target ? '<span class="aim-target" aria-hidden="true"></span>' : ''}
                </button>
            `;
        }).join('');
    }

    function stopAimRound() {
        if (aimTimerInterval) {
            window.clearInterval(aimTimerInterval);
            aimTimerInterval = null;
        }

        aimRoundRunning = false;
        updateAimHud();
    }

    function initializeAim() {
        stopAimRound();
        aimScore = 0;
        aimTimeRemaining = AIM_ROUND_SECONDS;
        aimRoundCompleted = false;
        createAimTargets();
        updateAimHud();
        renderAimBoard();
    }

    function finishAimRound() {
        stopAimRound();
        aimRoundCompleted = true;

        if (aimScore > aimBestScore) {
            aimBestScore = aimScore;
            window.localStorage.setItem(AIM_BEST_KEY, String(aimBestScore));
        }

        updateAimHud();
        openGameOverModal(
            'Fin de la bordee',
            `Tu as inscrit ${aimScore} touches avant la fin de la maree.`
        );
    }

    function startAimRound() {
        closeGameOverModal();
        aimRoundRunning = true;
        updateAimHud();

        aimTimerInterval = window.setInterval(() => {
            aimTimeRemaining -= 1;
            updateAimHud();

            if (aimTimeRemaining <= 0) {
                finishAimRound();
            }
        }, 1000);
    }

    function handleAimTargetHit(targetId) {
        if (aimRoundCompleted || aimTimeRemaining <= 0) {
            return;
        }

        if (!aimRoundRunning) {
            startAimRound();
        }

        const target = aimTargets.find((item) => item.id === targetId);

        if (!target) {
            return;
        }

        aimScore += AIM_HIT_SCORE;
        const nextCell = pickRandomAimCell(`${target.row}-${target.col}`);

        if (nextCell) {
            target.row = nextCell.row;
            target.col = nextCell.col;
        }

        updateAimHud();
        renderAimBoard();
        aimBoard.classList.remove('is-splashing');
        void aimBoard.offsetWidth;
        aimBoard.classList.add('is-splashing');
    }

    function handleAimMiss() {
        if (!aimRoundRunning || aimRoundCompleted || aimTimeRemaining <= 0) {
            return;
        }

        aimScore = Math.max(0, aimScore - AIM_MISS_SCORE);
        updateAimHud();
        aimBoard.classList.remove('is-rumbling');
        void aimBoard.offsetWidth;
        aimBoard.classList.add('is-rumbling');
    }

    function updatePongHud() {
        pongPlayerScoreDisplay.textContent = String(pongPlayerScore);
        pongAiScoreDisplay.textContent = String(pongAiScore);
        if (pongPaused) {
            pongStartButton.textContent = 'Reprendre le duel';
            return;
        }

        pongStartButton.textContent = pongRunning ? 'Duel en cours' : 'Lancer le duel';
    }

    function createPongRoundState() {
        const boardWidth = pongBoard.clientWidth || 700;
        const boardHeight = pongBoard.clientHeight || Math.round(boardWidth * 9 / 16);
        const paddleHeight = 92;
        const paddleWidth = 14;
        const ballSize = 16;
        const paddleOffset = 22;
        const centerY = (boardHeight - paddleHeight) / 2;
        const serveDirection = Math.random() > 0.5 ? 1 : -1;
        const verticalDirection = (Math.random() * 2) - 1;

        return {
            boardWidth,
            boardHeight,
            paddleHeight,
            paddleWidth,
            paddleOffset,
            ballSize,
            playerY: centerY,
            aiY: centerY,
            aiTargetY: centerY,
            playerSpeed: 380,
            aiSpeed: 320,
            ballX: (boardWidth - ballSize) / 2,
            ballY: (boardHeight - ballSize) / 2,
            ballVelocityX: 388 * serveDirection,
            ballVelocityY: 228 * verticalDirection,
            countdownActive: true
        };
    }

    function clearPongCountdownTimers() {
        if (pongCountdownTimer) {
            window.clearTimeout(pongCountdownTimer);
            pongCountdownTimer = null;
        }

        if (pongCountdownCompleteTimer) {
            window.clearTimeout(pongCountdownCompleteTimer);
            pongCountdownCompleteTimer = null;
        }
    }

    function hidePongCountdown() {
        clearPongCountdownTimers();
        pongCountdown.textContent = '';
        pongCountdown.classList.add('hidden');
        pongCountdown.setAttribute('aria-hidden', 'true');
    }

    function showPongCountdownValue(label) {
        pongCountdown.textContent = label;
        pongCountdown.classList.remove('hidden');
        pongCountdown.setAttribute('aria-hidden', 'false');
    }

    function startPongCountdown(onComplete) {
        clearPongCountdownTimers();

        if (!pongState) {
            return;
        }

        pongState.countdownActive = true;

        const sequence = ['3', '2', '1', 'Partez'];
        let stepIndex = 0;

        const runStep = () => {
            showPongCountdownValue(sequence[stepIndex]);

            if (stepIndex === sequence.length - 1) {
                pongCountdownCompleteTimer = window.setTimeout(() => {
                    hidePongCountdown();
                    if (pongState) {
                        pongState.countdownActive = false;
                    }
                    onComplete?.();
                }, 460);
                return;
            }

            stepIndex += 1;
            pongCountdownTimer = window.setTimeout(runStep, 620);
        };

        runStep();
    }

    function renderPong() {
        if (!pongState) {
            return;
        }

        pongPlayerPaddle.style.transform = `translate(${pongState.paddleOffset}px, ${pongState.playerY}px)`;
        pongAiPaddle.style.transform = `translate(${pongState.boardWidth - pongState.paddleOffset - pongState.paddleWidth}px, ${pongState.aiY}px)`;
        pongBall.style.transform = `translate(${pongState.ballX}px, ${pongState.ballY}px)`;
    }

    function getPongBounceVelocityY(impact) {
        const clampedImpact = Math.max(-1, Math.min(1, impact));
        const nextVelocityY = clampedImpact * 305;

        if (Math.abs(nextVelocityY) < 115) {
            return (clampedImpact >= 0 ? 1 : -1) * 115;
        }

        return nextVelocityY;
    }

    function resetPongRound() {
        pongState = createPongRoundState();
        renderPong();
    }

    function resetPongMatch() {
        pongPlayerScore = 0;
        pongAiScore = 0;
        resetPongRound();
        updatePongHud();
    }

    function stopPong() {
        if (pongAnimationFrame) {
            window.cancelAnimationFrame(pongAnimationFrame);
            pongAnimationFrame = null;
        }

        hidePongCountdown();
        pongRunning = false;
        pongPaused = false;
        pongLastFrame = 0;
        updatePongHud();
    }

    function pausePong() {
        if (!pongRunning || !pongState || pongState.countdownActive) {
            return;
        }

        if (pongAnimationFrame) {
            window.cancelAnimationFrame(pongAnimationFrame);
            pongAnimationFrame = null;
        }

        pongRunning = false;
        pongPaused = true;
        pongLastFrame = 0;
        updatePongHud();
    }

    function resumePong() {
        if (!pongPaused || !pongState) {
            return;
        }

        pongRunning = true;
        pongPaused = false;
        pongLastFrame = 0;
        updatePongHud();
        pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
    }

    function finishPongMatch(playerWon) {
        stopPong();
        openGameOverModal(
            playerWon ? 'Victoire' : 'C est perdu',
            playerWon ? 'Le duel est gagne. La baie t acclame.' : 'L IA remporte la manche. Le courant t echappe.'
        );
    }

    function scorePongPoint(playerWon) {
        if (playerWon) {
            pongPlayerScore += 1;
        } else {
            pongAiScore += 1;
        }

        updatePongHud();

        if (pongPlayerScore >= PONG_TARGET_SCORE || pongAiScore >= PONG_TARGET_SCORE) {
            finishPongMatch(pongPlayerScore >= PONG_TARGET_SCORE);
            return;
        }

        resetPongRound();
        startPongCountdown();
    }

    function updatePongFrame(timestamp) {
        if (!pongRunning || !pongState) {
            return;
        }

        if (!pongLastFrame) {
            pongLastFrame = timestamp;
        }

        const delta = Math.min((timestamp - pongLastFrame) / 1000, 0.032);
        pongLastFrame = timestamp;

        const playerDirection = (pongKeys.has('ArrowUp') || pongKeys.has('z') || pongKeys.has('Z') ? -1 : 0)
            + (pongKeys.has('ArrowDown') || pongKeys.has('s') || pongKeys.has('S') ? 1 : 0);

        pongState.playerY += playerDirection * pongState.playerSpeed * delta;
        pongState.playerY = Math.max(0, Math.min(pongState.playerY, pongState.boardHeight - pongState.paddleHeight));

        const ballCenter = pongState.ballY + (pongState.ballSize / 2);
        const anticipatedCenter = ballCenter + (pongState.ballVelocityY * 0.08);
        const desiredAiY = Math.max(
            0,
            Math.min(
                anticipatedCenter - (pongState.paddleHeight / 2),
                pongState.boardHeight - pongState.paddleHeight
            )
        );
        const trackingStrength = Math.min(1, delta * 5.4);
        pongState.aiTargetY += (desiredAiY - pongState.aiTargetY) * trackingStrength;
        const aiDelta = pongState.aiTargetY - pongState.aiY;
        const aiStep = Math.sign(aiDelta) * Math.min(Math.abs(aiDelta), pongState.aiSpeed * delta);
        pongState.aiY += aiStep;
        pongState.aiY = Math.max(0, Math.min(pongState.aiY, pongState.boardHeight - pongState.paddleHeight));

        if (pongState.countdownActive) {
            renderPong();
            if (pongRunning) {
                pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
            }
            return;
        }

        pongState.ballX += pongState.ballVelocityX * delta;
        pongState.ballY += pongState.ballVelocityY * delta;

        if (pongState.ballY < 0) {
            pongState.ballY = Math.abs(pongState.ballY);
            pongState.ballVelocityY = Math.abs(pongState.ballVelocityY);
        }

        const maxBallY = pongState.boardHeight - pongState.ballSize;

        if (pongState.ballY > maxBallY) {
            pongState.ballY = maxBallY - (pongState.ballY - maxBallY);
            pongState.ballVelocityY = -Math.abs(pongState.ballVelocityY);
        }

        const playerPaddleX = pongState.paddleOffset;
        const aiPaddleX = pongState.boardWidth - pongState.paddleOffset - pongState.paddleWidth;

        const hitsPlayer = pongState.ballX <= playerPaddleX + pongState.paddleWidth
            && pongState.ballX + pongState.ballSize >= playerPaddleX
            && pongState.ballY + pongState.ballSize >= pongState.playerY
            && pongState.ballY <= pongState.playerY + pongState.paddleHeight
            && pongState.ballVelocityX < 0;

        if (hitsPlayer) {
            const impact = ((pongState.ballY + (pongState.ballSize / 2)) - (pongState.playerY + (pongState.paddleHeight / 2))) / (pongState.paddleHeight / 2);
            pongState.ballX = playerPaddleX + pongState.paddleWidth;
            pongState.ballVelocityX = Math.abs(pongState.ballVelocityX) + 20;
            pongState.ballVelocityY = getPongBounceVelocityY(impact);
        }

        const hitsAi = pongState.ballX + pongState.ballSize >= aiPaddleX
            && pongState.ballX <= aiPaddleX + pongState.paddleWidth
            && pongState.ballY + pongState.ballSize >= pongState.aiY
            && pongState.ballY <= pongState.aiY + pongState.paddleHeight
            && pongState.ballVelocityX > 0;

        if (hitsAi) {
            const impact = ((pongState.ballY + (pongState.ballSize / 2)) - (pongState.aiY + (pongState.paddleHeight / 2))) / (pongState.paddleHeight / 2);
            pongState.ballX = aiPaddleX - pongState.ballSize;
            pongState.ballVelocityX = -(Math.abs(pongState.ballVelocityX) + 20);
            pongState.ballVelocityY = getPongBounceVelocityY(impact);
        }

        if (pongState.ballX + pongState.ballSize < 0) {
            scorePongPoint(false);
        } else if (pongState.ballX > pongState.boardWidth) {
            scorePongPoint(true);
        }

        renderPong();

        if (pongRunning) {
            pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
        }
    }

    function initializePong() {
        stopPong();
        resetPongMatch();
    }

    function startPong() {
        closeGameOverModal();
        pongKeys.clear();
        resetPongMatch();
        pongRunning = true;
        pongPaused = false;
        updatePongHud();
        startPongCountdown();
        pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
    }

    function countSudokuFilledCells() {
        return sudokuBoardState.flat().filter((value) => value !== 0).length;
    }

    function stopSudokuTimer() {
        if (sudokuTimerInterval) {
            window.clearInterval(sudokuTimerInterval);
            sudokuTimerInterval = null;
        }
    }

    function startSudokuTimer() {
        stopSudokuTimer();
        sudokuTimerInterval = window.setInterval(() => {
            sudokuElapsedSeconds += 1;
            refreshSudokuHud();
        }, 1000);
    }

    function clearSudokuFeedback(shouldRender = true) {
        if (sudokuFeedbackTimeout) {
            window.clearTimeout(sudokuFeedbackTimeout);
            sudokuFeedbackTimeout = null;
        }

        sudokuFeedbackCell = null;

        if (shouldRender) {
            renderSudoku();
        }
    }

    function setSudokuFeedback(row, col, type) {
        if (sudokuFeedbackTimeout) {
            window.clearTimeout(sudokuFeedbackTimeout);
        }

        sudokuFeedbackCell = { row, col, type };
        sudokuFeedbackTimeout = window.setTimeout(() => {
            sudokuFeedbackCell = null;
            sudokuFeedbackTimeout = null;
            renderSudoku();
        }, 320);
    }

    function getSudokuDifficultyBaseScore() {
        const scoreByDifficulty = {
            Calme: 80,
            Brise: 120,
            Cap: 165
        };

        return scoreByDifficulty[sudokuPuzzle?.difficulty] || 80;
    }

    function calculateSudokuPoints() {
        const baseScore = getSudokuDifficultyBaseScore();
        const streakMultiplier = 1 + (Math.min(sudokuCombo, 6) * 0.18);
        const timeMultiplier = Math.max(0.65, 1.45 - (sudokuElapsedSeconds / 240));

        return Math.round(baseScore * streakMultiplier * timeMultiplier);
    }

    function shuffleArray(values) {
        const nextValues = [...values];

        for (let index = nextValues.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [nextValues[index], nextValues[swapIndex]] = [nextValues[swapIndex], nextValues[index]];
        }

        return nextValues;
    }

    function createSudokuEmptyBoard() {
        return Array.from({ length: SUDOKU_SIZE }, () => Array(SUDOKU_SIZE).fill(0));
    }

    function cloneSudokuBoard(board) {
        return board.map((row) => [...row]);
    }

    function getSudokuBoxStart(index) {
        return Math.floor(index / 3) * 3;
    }

    function isSudokuPrefilled(row, col) {
        return sudokuPuzzle?.puzzle[(row * SUDOKU_SIZE) + col] !== '.';
    }

    function getSudokuValue(row, col) {
        return sudokuBoardState[row]?.[col] || 0;
    }

    function getSudokuSelectedValue() {
        if (!sudokuSelectedCell) {
            return 0;
        }

        return getSudokuValue(sudokuSelectedCell.row, sudokuSelectedCell.col);
    }

    function getSudokuCandidates(board, row, col) {
        if (board[row][col] !== 0) {
            return [];
        }

        const usedValues = new Set();

        for (let index = 0; index < SUDOKU_SIZE; index += 1) {
            usedValues.add(board[row][index]);
            usedValues.add(board[index][col]);
        }

        const boxRow = getSudokuBoxStart(row);
        const boxCol = getSudokuBoxStart(col);

        for (let rowIndex = boxRow; rowIndex < boxRow + 3; rowIndex += 1) {
            for (let colIndex = boxCol; colIndex < boxCol + 3; colIndex += 1) {
                usedValues.add(board[rowIndex][colIndex]);
            }
        }

        return shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((value) => !usedValues.has(value)));
    }

    function findSudokuBestCell(board) {
        let bestCell = null;
        let bestCandidates = null;

        for (let row = 0; row < SUDOKU_SIZE; row += 1) {
            for (let col = 0; col < SUDOKU_SIZE; col += 1) {
                if (board[row][col] !== 0) {
                    continue;
                }

                const candidates = getSudokuCandidates(board, row, col);

                if (!bestCandidates || candidates.length < bestCandidates.length) {
                    bestCell = { row, col };
                    bestCandidates = candidates;
                }

                if (bestCandidates?.length === 1) {
                    return {
                        ...bestCell,
                        candidates: bestCandidates
                    };
                }
            }
        }

        if (!bestCell || !bestCandidates) {
            return null;
        }

        return {
            ...bestCell,
            candidates: bestCandidates
        };
    }

    function solveSudokuBoard(board) {
        const nextCell = findSudokuBestCell(board);

        if (!nextCell) {
            return true;
        }

        if (!nextCell.candidates.length) {
            return false;
        }

        for (const candidate of nextCell.candidates) {
            board[nextCell.row][nextCell.col] = candidate;

            if (solveSudokuBoard(board)) {
                return true;
            }
        }

        board[nextCell.row][nextCell.col] = 0;
        return false;
    }

    function countSudokuSolutions(board, limit = 2) {
        const nextCell = findSudokuBestCell(board);

        if (!nextCell) {
            return 1;
        }

        if (!nextCell.candidates.length) {
            return 0;
        }

        let solutionCount = 0;

        for (const candidate of nextCell.candidates) {
            board[nextCell.row][nextCell.col] = candidate;
            solutionCount += countSudokuSolutions(board, limit);

            if (solutionCount >= limit) {
                board[nextCell.row][nextCell.col] = 0;
                return solutionCount;
            }
        }

        board[nextCell.row][nextCell.col] = 0;
        return solutionCount;
    }

    function generateSudokuPuzzle() {
        const difficultyConfig = SUDOKU_DIFFICULTIES[Math.floor(Math.random() * SUDOKU_DIFFICULTIES.length)];
        const solutionBoard = createSudokuEmptyBoard();
        solveSudokuBoard(solutionBoard);

        const puzzleBoard = cloneSudokuBoard(solutionBoard);
        const positions = shuffleArray(Array.from({ length: SUDOKU_SIZE * SUDOKU_SIZE }, (_, index) => index));
        let removedCells = 0;

        positions.forEach((position) => {
            if (removedCells >= difficultyConfig.removals) {
                return;
            }

            const row = Math.floor(position / SUDOKU_SIZE);
            const col = position % SUDOKU_SIZE;
            const previousValue = puzzleBoard[row][col];

            puzzleBoard[row][col] = 0;

            const solutionCount = countSudokuSolutions(cloneSudokuBoard(puzzleBoard), 2);

            if (solutionCount !== 1) {
                puzzleBoard[row][col] = previousValue;
                return;
            }

            removedCells += 1;
        });

        return {
            difficulty: difficultyConfig.difficulty,
            puzzle: puzzleBoard.flat().map((value) => value || '.').join(''),
            solution: solutionBoard.flat().join('')
        };
    }

    function isSudokuRelated(row, col, activeRow, activeCol) {
        if (activeRow === null || activeCol === null) {
            return false;
        }

        if (row === activeRow || col === activeCol) {
            return true;
        }

        return getSudokuBoxStart(row) === getSudokuBoxStart(activeRow)
            && getSudokuBoxStart(col) === getSudokuBoxStart(activeCol);
    }

    function isSudokuConflict(row, col) {
        const value = getSudokuValue(row, col);

        if (!value) {
            return false;
        }

        for (let index = 0; index < SUDOKU_SIZE; index += 1) {
            if (index !== col && getSudokuValue(row, index) === value) {
                return true;
            }

            if (index !== row && getSudokuValue(index, col) === value) {
                return true;
            }
        }

        const boxRow = getSudokuBoxStart(row);
        const boxCol = getSudokuBoxStart(col);

        for (let rowIndex = boxRow; rowIndex < boxRow + 3; rowIndex += 1) {
            for (let colIndex = boxCol; colIndex < boxCol + 3; colIndex += 1) {
                if ((rowIndex !== row || colIndex !== col) && getSudokuValue(rowIndex, colIndex) === value) {
                    return true;
                }
            }
        }

        return false;
    }

    function isSudokuSolved() {
        if (!sudokuPuzzle) {
            return false;
        }

        return sudokuBoardState.every((row, rowIndex) => row.every((value, colIndex) => {
            const solutionValue = Number(sudokuPuzzle.solution[(rowIndex * SUDOKU_SIZE) + colIndex]);
            return value === solutionValue;
        }));
    }

    function updateSudokuHud() {
        sudokuFilledDisplay.textContent = String(sudokuScore);
        sudokuDifficultyDisplay.textContent = sudokuSolved ? 'Résolu' : (sudokuPuzzle?.difficulty || 'Calme');
        sudokuRestartButton.textContent = sudokuSolved ? 'Nouvelle grille' : 'Nouvelle grille';
    }

    function refreshSudokuHud() {
        sudokuFilledDisplay.textContent = String(sudokuScore);
        sudokuDifficultyDisplay.textContent = `${sudokuMistakes} / 3`;
        sudokuRestartButton.textContent = 'Nouvelle grille';
        sudokuHelpText.textContent = sudokuSolved
            ? `Grille resolue. Cap ${sudokuPuzzle?.difficulty || 'Calme'} termine en ${sudokuElapsedSeconds}s.`
            : `Cap ${sudokuPuzzle?.difficulty || 'Calme'} • Combo ${sudokuCombo} • ${countSudokuFilledCells()} / 81 cases • ${sudokuElapsedSeconds}s`;
    }

    function renderSudoku() {
        if (!sudokuPuzzle) {
            return;
        }

        const activeRow = sudokuSelectedCell?.row ?? null;
        const activeCol = sudokuSelectedCell?.col ?? null;
        const selectedValue = getSudokuSelectedValue();

        sudokuBoard.innerHTML = sudokuBoardState.map((row, rowIndex) => row.map((value, colIndex) => {
            const classes = ['sudoku-cell'];

            if (isSudokuPrefilled(rowIndex, colIndex)) {
                classes.push('is-prefilled');
            }

            if (isSudokuRelated(rowIndex, colIndex, activeRow, activeCol)) {
                classes.push('is-related');
            }

            if (activeRow === rowIndex && activeCol === colIndex) {
                classes.push('is-selected');
            }

            if (selectedValue && value === selectedValue && !(activeRow === rowIndex && activeCol === colIndex)) {
                classes.push('is-matching-value');
            }

            if (isSudokuConflict(rowIndex, colIndex)) {
                classes.push('is-conflict');
            }

            if (sudokuSolved) {
                classes.push('is-solved');
            }

            if (sudokuFeedbackCell?.row === rowIndex && sudokuFeedbackCell?.col === colIndex) {
                classes.push(sudokuFeedbackCell.type === 'correct' ? 'is-correct' : 'is-wrong');
            }

            if (colIndex === 2 || colIndex === 5) {
                classes.push('is-border-right');
            }

            if (rowIndex === 2 || rowIndex === 5) {
                classes.push('is-border-bottom');
            }

            return `
                <button
                    type="button"
                    class="${classes.join(' ')}"
                    data-row="${rowIndex}"
                    data-col="${colIndex}"
                    aria-label="Case Sudoku ${rowIndex + 1}-${colIndex + 1}"
                >${value || ''}</button>
            `;
        }).join('')).join('');

        refreshSudokuHud();
    }

    function initializeSudoku() {
        closeGameOverModal();
        stopSudokuTimer();
        clearSudokuFeedback(false);
        sudokuSolved = false;
        sudokuFailed = false;
        sudokuSelectedCell = null;
        sudokuScore = 0;
        sudokuMistakes = 0;
        sudokuCombo = 0;
        sudokuElapsedSeconds = 0;
        sudokuPuzzle = generateSudokuPuzzle();
        sudokuBoardState = Array.from({ length: SUDOKU_SIZE }, (_, rowIndex) => (
            Array.from({ length: SUDOKU_SIZE }, (_, colIndex) => {
                const rawValue = sudokuPuzzle.puzzle[(rowIndex * SUDOKU_SIZE) + colIndex];
                return rawValue === '.' ? 0 : Number(rawValue);
            })
        ));
        renderSudoku();
        startSudokuTimer();
    }

    function updateSudokuCell(row, col, nextValue) {
        if (!sudokuPuzzle || sudokuSolved || sudokuFailed || isSudokuPrefilled(row, col)) {
            return;
        }

        if (nextValue === 0) {
            sudokuBoardState[row][col] = 0;
            sudokuCombo = 0;
            renderSudoku();
            return;
        }

        const solutionValue = Number(sudokuPuzzle.solution[(row * SUDOKU_SIZE) + col]);

        if (nextValue !== solutionValue) {
            sudokuMistakes += 1;
            sudokuCombo = 0;
            setSudokuFeedback(row, col, 'wrong');
            renderSudoku();

            if (sudokuMistakes >= 3) {
                sudokuFailed = true;
                stopSudokuTimer();
                openGameOverModal('C est perdu', 'Trois erreurs. Le navire s est perdu dans le brouillard.');
            }

            return;
        }

        if (sudokuBoardState[row][col] === nextValue) {
            return;
        }

        sudokuBoardState[row][col] = nextValue;
        sudokuCombo += 1;
        sudokuScore += calculateSudokuPoints();
        sudokuSolved = isSudokuSolved();
        setSudokuFeedback(row, col, 'correct');

        if (sudokuSolved) {
            stopSudokuTimer();
        }

        renderSudoku();
    }

    function create2048EmptyGrid() {
        return Array.from({ length: GAME_2048_SIZE }, () => Array(GAME_2048_SIZE).fill(null));
    }

    function update2048Hud() {
        game2048ScoreDisplay.textContent = String(game2048Score);
        game2048BestScoreDisplay.textContent = String(game2048BestScore);
    }

    function ensure2048Board() {
        if (game2048TileLayer) {
            return;
        }

        const background = document.createElement('div');
        background.className = 'game-2048-background';
        background.innerHTML = Array.from({ length: GAME_2048_SIZE * GAME_2048_SIZE }, () => (
            '<div class="game-2048-cell game-2048-empty" aria-hidden="true"></div>'
        )).join('');

        game2048TileLayer = document.createElement('div');
        game2048TileLayer.className = 'game-2048-tiles';

        game2048Board.innerHTML = '';
        game2048Board.append(background, game2048TileLayer);
    }

    function sync2048Grid() {
        game2048Grid = create2048EmptyGrid();

        game2048Tiles.forEach((tile) => {
            game2048Grid[tile.row][tile.col] = tile.id;
        });
    }

    function get2048Geometry() {
        const styles = window.getComputedStyle(game2048Board);
        const gap = parseFloat(styles.getPropertyValue('--game-2048-gap')) || 10;
        const padding = parseFloat(styles.getPropertyValue('--game-2048-padding')) || 10;
        const innerSize = game2048Board.clientWidth - (padding * 2);
        const cellSize = (innerSize - (gap * (GAME_2048_SIZE - 1))) / GAME_2048_SIZE;

        return {
            gap,
            padding,
            cellSize
        };
    }

    function place2048TileElement(element, row, col, geometry) {
        const offsetX = col * (geometry.cellSize + geometry.gap);
        const offsetY = row * (geometry.cellSize + geometry.gap);

        element.style.width = `${geometry.cellSize}px`;
        element.style.height = `${geometry.cellSize}px`;
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    function get2048EmptyCells() {
        const emptyCells = [];

        game2048Grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === null) {
                    emptyCells.push({ row: rowIndex, col: colIndex });
                }
            });
        });

        return emptyCells;
    }

    function create2048Tile(value, row, col, isFresh = false) {
        return {
            id: `tile-${game2048NextTileId += 1}`,
            value,
            row,
            col,
            isFresh
        };
    }

    function add2048Tile(isFresh = true) {
        const emptyCells = get2048EmptyCells();

        if (!emptyCells.length) {
            return null;
        }

        const nextCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const nextTile = create2048Tile(Math.random() < 0.9 ? 2 : 4, nextCell.row, nextCell.col, isFresh);
        game2048Tiles.push(nextTile);
        sync2048Grid();
        return nextTile;
    }

    function get2048TileClasses(tile) {
        const classes = ['game-2048-tile', `game-2048-value-${tile.value}`];

        if (tile.value >= 128) {
            classes.push('game-2048-cell-small');
        }

        if (tile.value >= 1024) {
            classes.push('game-2048-cell-xsmall');
        }

        if (tile.isFresh) {
            classes.push('game-2048-cell-fresh');
        }

        return classes.join(' ');
    }

    function render2048() {
        ensure2048Board();
        const geometry = get2048Geometry();
        const activeIds = new Set();

        game2048Tiles.forEach((tile) => {
            let tileElement = game2048TileElements.get(tile.id);

            if (!tileElement) {
                tileElement = document.createElement('div');
                tileElement.dataset.tileId = tile.id;
                tileElement.style.transition = 'none';
                game2048TileElements.set(tile.id, tileElement);
            }

            tileElement.className = get2048TileClasses(tile);
            tileElement.textContent = tile.value;
            place2048TileElement(tileElement, tile.row, tile.col, geometry);
            
            if (!tileElement.isConnected) {
                game2048TileLayer.appendChild(tileElement);
                window.requestAnimationFrame(() => {
                    tileElement.style.transition = '';
                });
            }

            activeIds.add(tile.id);
        });

        Array.from(game2048TileElements.keys()).forEach((tileId) => {
            if (activeIds.has(tileId)) {
                return;
            }

            const tileElement = game2048TileElements.get(tileId);

            if (tileElement) {
                tileElement.remove();
            }

            game2048TileElements.delete(tileId);
        });

        game2048Tiles.forEach((tile) => {
            tile.isFresh = false;
        });
    }

    function initialize2048() {
        if (game2048AnimationTimeout) {
            window.clearTimeout(game2048AnimationTimeout);
            game2048AnimationTimeout = null;
        }

        game2048Animating = false;
        game2048QueuedMove = null;
        game2048Tiles = [];
        game2048Grid = create2048EmptyGrid();
        game2048TileElements.forEach((element) => element.remove());
        game2048TileElements.clear();
        game2048Score = 0;
        add2048Tile(true);
        add2048Tile(true);
        update2048Hud();
        render2048();
    }

    function get2048TargetPosition(lineIndex, targetIndex, direction) {
        if (direction === 'left') {
            return { row: lineIndex, col: targetIndex };
        }

        if (direction === 'right') {
            return { row: lineIndex, col: GAME_2048_SIZE - 1 - targetIndex };
        }

        if (direction === 'up') {
            return { row: targetIndex, col: lineIndex };
        }

        return { row: GAME_2048_SIZE - 1 - targetIndex, col: lineIndex };
    }

    function get2048LineTiles(lineIndex, direction) {
        const ids = [];

        for (let index = 0; index < GAME_2048_SIZE; index += 1) {
            let row;
            let col;

            if (direction === 'left') {
                row = lineIndex;
                col = index;
            } else if (direction === 'right') {
                row = lineIndex;
                col = GAME_2048_SIZE - 1 - index;
            } else if (direction === 'up') {
                row = index;
                col = lineIndex;
            } else {
                row = GAME_2048_SIZE - 1 - index;
                col = lineIndex;
            }

            const tileId = game2048Grid[row][col];

            if (tileId !== null) {
                ids.push(tileId);
            }
        }

        return ids;
    }

    function move2048(direction) {
        if (game2048Animating) {
            game2048QueuedMove = direction;
            return;
        }

        ensure2048Board();

        const tileMap = new Map(game2048Tiles.map((tile) => [tile.id, { ...tile }]));
        const targetById = new Map();
        const finalTiles = [];
        let gainedScore = 0;
        let hasChanged = false;

        for (let lineIndex = 0; lineIndex < GAME_2048_SIZE; lineIndex += 1) {
            const lineIds = get2048LineTiles(lineIndex, direction);
            const result = [];

            lineIds.forEach((tileId) => {
                const tile = tileMap.get(tileId);
                const last = result[result.length - 1];

                if (last && last.value === tile.value && !last.merged) {
                    last.ids.push(tileId);
                    last.merged = true;
                    gainedScore += tile.value * 2;
                } else {
                    result.push({
                        value: tile.value,
                        ids: [tileId],
                        merged: false
                    });
                }
            });

            result.forEach((entry, targetIndex) => {
                const target = get2048TargetPosition(lineIndex, targetIndex, direction);
                entry.ids.forEach((tileId) => {
                    targetById.set(tileId, target);
                    const tile = tileMap.get(tileId);

                    if (tile.row !== target.row || tile.col !== target.col) {
                        hasChanged = true;
                    }
                });

                if (entry.ids.length === 1) {
                    const sourceTile = tileMap.get(entry.ids[0]);
                    finalTiles.push({
                        ...sourceTile,
                        row: target.row,
                        col: target.col,
                        isFresh: false
                    });
                } else {
                    finalTiles.push(create2048Tile(entry.value * 2, target.row, target.col, true));
                    hasChanged = true;
                }
            });
        }

        if (!hasChanged) {
            return;
        }

        const geometry = get2048Geometry();
        const tileElements = new Map();

        game2048TileLayer.querySelectorAll('.game-2048-tile').forEach((element) => {
            tileElements.set(element.dataset.tileId, element);
        });

        game2048Animating = true;

        tileElements.forEach((element, tileId) => {
            const target = targetById.get(tileId);

            if (!target) {
                return;
            }

            place2048TileElement(element, target.row, target.col, geometry);
        });

        game2048AnimationTimeout = window.setTimeout(() => {
            game2048Score += gainedScore;

            if (game2048Score > game2048BestScore) {
                game2048BestScore = game2048Score;
                window.localStorage.setItem(GAME_2048_BEST_KEY, String(game2048BestScore));
            }

            game2048Tiles = finalTiles;
            sync2048Grid();
            add2048Tile(true);
            update2048Hud();
            render2048();
            game2048Animating = false;
            game2048AnimationTimeout = null;

            const hasMovesLeft = game2048Tiles.length < GAME_2048_SIZE * GAME_2048_SIZE
                || game2048Tiles.some((tile) => (
                    game2048Tiles.some((otherTile) => (
                        otherTile.id !== tile.id
                        && otherTile.value === tile.value
                        && (
                            (otherTile.row === tile.row && Math.abs(otherTile.col - tile.col) === 1)
                            || (otherTile.col === tile.col && Math.abs(otherTile.row - tile.row) === 1)
                        )
                    ))
                ));

            if (!hasMovesLeft) {
                openGameOverModal('C est perdu', 'La marée t a bloque. Plus aucun coup possible.');
                game2048QueuedMove = null;
                return;
            }

            if (game2048QueuedMove) {
                const queuedMove = game2048QueuedMove;
                game2048QueuedMove = null;
                window.requestAnimationFrame(() => {
                    move2048(queuedMove);
                });
            }
        }, 120);
    }

    function createEmptyBoard() {
        return Array.from({ length: BOARD_SIZE }, (_, row) => (
            Array.from({ length: BOARD_SIZE }, (_, col) => ({
                row,
                col,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
                justRevealed: false
            }))
        ));
    }

    function clearRevealHighlights(shouldRender = false) {
        gameBoard.forEach((row) => {
            row.forEach((cell) => {
                cell.justRevealed = false;
            });
        });

        if (shouldRender) {
            renderBoard();
        }
    }

    function getCell(row, col) {
        return gameBoard[row]?.[col] || null;
    }

    function getNeighbors(row, col) {
        const neighbors = [];

        for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
            for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
                if (rowOffset === 0 && colOffset === 0) {
                    continue;
                }

                const neighbor = getCell(row + rowOffset, col + colOffset);

                if (neighbor) {
                    neighbors.push(neighbor);
                }
            }
        }

        return neighbors;
    }

    function getSafeZone(firstRow, firstCol) {
        const safeCells = new Set();

        for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
            for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
                const row = firstRow + rowOffset;
                const col = firstCol + colOffset;
                const cell = getCell(row, col);

                if (cell) {
                    safeCells.add(`${row}-${col}`);
                }
            }
        }

        return safeCells;
    }

    function placeMines(firstRow, firstCol) {
        let minesPlaced = 0;
        const safeZone = getSafeZone(firstRow, firstCol);

        while (minesPlaced < TOTAL_MINES) {
            const row = Math.floor(Math.random() * BOARD_SIZE);
            const col = Math.floor(Math.random() * BOARD_SIZE);
            const cell = getCell(row, col);

            if (!cell || cell.isMine || safeZone.has(`${row}-${col}`)) {
                continue;
            }

            cell.isMine = true;
            minesPlaced += 1;
        }

        gameBoard.forEach((row) => {
            row.forEach((cell) => {
                cell.adjacentMines = cell.isMine
                    ? 0
                    : getNeighbors(cell.row, cell.col).filter((neighbor) => neighbor.isMine).length;
            });
        });
    }

    function updateCounters() {
        mineCountDisplay.textContent = String(TOTAL_MINES - flagsPlaced);
        timerDisplay.textContent = String(timer);
    }

    function updateFace(label) {
        restartGameButton.textContent = label;
    }

    function updateRestartButtonLabel() {
        updateFace(gameStarted ? 'Changer de cap' : 'Aller en mer');
    }

    function openGameOverModal(title = 'C est perdu', text = 'Le joueur s est noye.') {
        gameOverTitle.textContent = title;
        gameOverText.textContent = text;
        gameOverModal.classList.remove('hidden');
        gameOverModal.setAttribute('aria-hidden', 'false');
    }

    function closeGameOverModal() {
        gameOverModal.classList.add('hidden');
        gameOverModal.setAttribute('aria-hidden', 'true');
    }

    function stopSnake() {
        if (snakeInterval) {
            window.clearInterval(snakeInterval);
            snakeInterval = null;
        }

        snakeRunning = false;
    }

    function updateSnakeHud() {
        snakeScoreDisplay.textContent = String(snakeScore);
        snakeBestScoreDisplay.textContent = String(snakeBestScore);
        snakeStartButton.textContent = snakeRunning ? 'Changer de cap' : 'Lancer la traversee';
    }

    function getRandomSnakeFood(existingFoods = []) {
        const freeCells = [];

        for (let row = 0; row < SNAKE_SIZE; row += 1) {
            for (let col = 0; col < SNAKE_SIZE; col += 1) {
                const occupiedBySnake = snake.some((segment) => segment.row === row && segment.col === col);
                const occupiedByFood = existingFoods.some((food) => food.row === row && food.col === col);

                if (!occupiedBySnake && !occupiedByFood) {
                    freeCells.push({ row, col });
                }
            }
        }

        if (!freeCells.length) {
            return null;
        }

        return freeCells[Math.floor(Math.random() * freeCells.length)];
    }

    function refillSnakeFoods() {
        while (snakeFoods.length < 10) {
            const nextFood = getRandomSnakeFood(snakeFoods);

            if (!nextFood) {
                break;
            }

            snakeFoods.push(nextFood);
        }
    }

    function ensureSnakeBoard() {
        if (snakeOverlayLayer) {
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'snake-grid';
        grid.innerHTML = Array.from({ length: SNAKE_SIZE * SNAKE_SIZE }, (_, index) => {
            const row = Math.floor(index / SNAKE_SIZE);
            const col = index % SNAKE_SIZE;
            const classes = ['snake-bg-cell'];

            if ((row + col) % 2 === 1) {
                classes.push('snake-bg-cell-alt');
            }

            return `<div class="${classes.join(' ')}" aria-hidden="true"></div>`;
        }).join('');

        snakeOverlayLayer = document.createElement('div');
        snakeOverlayLayer.className = 'snake-overlay';

        snakeBoard.innerHTML = '';
        snakeBoard.append(grid, snakeOverlayLayer);
    }

    function getSnakeGeometry() {
        const styles = window.getComputedStyle(snakeBoard);
        const gap = parseFloat(styles.getPropertyValue('--snake-gap')) || 4;
        const padding = parseFloat(styles.getPropertyValue('--snake-padding')) || 10;
        const innerSize = snakeBoard.clientWidth - (padding * 2);
        const cellSize = (innerSize - (gap * (SNAKE_SIZE - 1))) / SNAKE_SIZE;

        return {
            gap,
            padding,
            cellSize
        };
    }

    function placeSnakeEntity(element, row, col, geometry) {
        const offsetX = col * (geometry.cellSize + geometry.gap);
        const offsetY = row * (geometry.cellSize + geometry.gap);

        element.style.width = `${geometry.cellSize}px`;
        element.style.height = `${geometry.cellSize}px`;
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    function getSnakeHeadRotation() {
        if (snakeDirection.x === 1) {
            return 'rotate(90deg)';
        }

        if (snakeDirection.x === -1) {
            return 'rotate(-90deg)';
        }

        if (snakeDirection.y === 1) {
            return 'rotate(180deg)';
        }

        return 'rotate(0deg)';
    }

    function renderSnake() {
        ensureSnakeBoard();

        if (!snakeOverlayLayer) {
            return;
        }

        const geometry = getSnakeGeometry();

        while (snakeSegmentElements.length < snake.length) {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'snake-entity snake-entity-body';
            snakeOverlayLayer.append(segmentElement);
            snakeSegmentElements.push(segmentElement);
        }

        while (snakeSegmentElements.length > snake.length) {
            const segmentElement = snakeSegmentElements.pop();
            segmentElement?.remove();
        }

        snakeSegmentElements.forEach((segmentElement, index) => {
            const segment = snake[index];

            segmentElement.classList.toggle('snake-entity-head', index === 0);
            segmentElement.classList.toggle('snake-entity-body', index !== 0);
            placeSnakeEntity(segmentElement, segment.row, segment.col, geometry);
            segmentElement.style.setProperty('--snake-head-rotation', index === 0 ? getSnakeHeadRotation() : 'rotate(0deg)');
        });

        const nextFoodKeys = new Set();

        snakeFoods.forEach((food) => {
            const key = `${food.row}-${food.col}`;
            nextFoodKeys.add(key);

            let foodElement = snakeFoodElements.get(key);

            if (!foodElement) {
                foodElement = document.createElement('div');
                foodElement.className = 'snake-entity snake-entity-food';
                if (snakeJustAte) {
                    foodElement.classList.add('snake-cell-food-pop');
                }

                snakeOverlayLayer.append(foodElement);
                snakeFoodElements.set(key, foodElement);
            }

            placeSnakeEntity(foodElement, food.row, food.col, geometry);
        });

        snakeFoodElements.forEach((foodElement, key) => {
            if (nextFoodKeys.has(key)) {
                return;
            }

            foodElement.remove();
            snakeFoodElements.delete(key);
        });

        snakeJustAte = false;
    }

    function initializeSnake() {
        stopSnake();
        snakeFoodElements.forEach((element) => element.remove());
        snakeFoodElements.clear();
        snake = [
            { row: 8, col: 6 },
            { row: 8, col: 5 },
            { row: 8, col: 4 }
        ];
        snakeDirection = { x: 1, y: 0 };
        snakeNextDirection = { x: 1, y: 0 };
        snakeDirectionQueue = [];
        snakeFoods = [];
        refillSnakeFoods();
        snakeScore = 0;
        snakeJustAte = false;
        updateSnakeHud();
        renderSnake();
    }

    function finishSnakeRun() {
        stopSnake();

        if (snakeScore > snakeBestScore) {
            snakeBestScore = snakeScore;
            window.localStorage.setItem(SNAKE_BEST_KEY, String(snakeBestScore));
        }

        updateSnakeHud();
        openGameOverModal('C est perdu', 'Le serpent s est ecrase contre la coque.');
    }

    function moveSnake() {
        while (snakeDirectionQueue.length) {
            const queuedDirection = snakeDirectionQueue.shift();
            const isOpposite = snakeDirection.x + queuedDirection.x === 0
                && snakeDirection.y + queuedDirection.y === 0;

            if (isOpposite) {
                continue;
            }

            snakeNextDirection = queuedDirection;
            break;
        }

        snakeDirection = { ...snakeNextDirection };
        const head = snake[0];
        const nextHead = {
            row: head.row + snakeDirection.y,
            col: head.col + snakeDirection.x
        };
        const eatenFoodIndex = snakeFoods.findIndex((food) => food.row === nextHead.row && food.col === nextHead.col);
        const willGrow = eatenFoodIndex >= 0;

        const hitsWall = nextHead.row < 0
            || nextHead.row >= SNAKE_SIZE
            || nextHead.col < 0
            || nextHead.col >= SNAKE_SIZE;

        const bodyToCheck = willGrow ? snake : snake.slice(0, -1);
        const hitsSelf = bodyToCheck.some((segment) => segment.row === nextHead.row && segment.col === nextHead.col);

        if (hitsWall || hitsSelf) {
            finishSnakeRun();
            return;
        }

        snake.unshift(nextHead);

        if (eatenFoodIndex >= 0) {
            snakeScore += 1;
            snakeFoods.splice(eatenFoodIndex, 1);
            refillSnakeFoods();
            snakeJustAte = true;

            if (!snakeFoods.length) {
                if (snakeScore > snakeBestScore) {
                    snakeBestScore = snakeScore;
                    window.localStorage.setItem(SNAKE_BEST_KEY, String(snakeBestScore));
                }

                stopSnake();
            }
        } else {
            snake.pop();
        }

        updateSnakeHud();
        renderSnake();
    }

    function startSnake() {
        closeGameOverModal();
        initializeSnake();
        snakeRunning = true;
        updateSnakeHud();
        snakeInterval = window.setInterval(moveSnake, SNAKE_TICK_MS);
    }

    function startTimer() {
        if (timerInterval) {
            return;
        }

        timerInterval = window.setInterval(() => {
            timer += 1;
            timerDisplay.textContent = String(timer);
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            window.clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function initializeGame() {
        stopTimer();
        gameBoard = createEmptyBoard();
        flagsPlaced = 0;
        timer = 0;
        gameStarted = false;
        gameFinished = false;
        minesweeperBoard.classList.remove('is-shaking');
        minesweeperBoard.classList.remove('is-rumbling');
        closeGameOverModal();
        updateRestartButtonLabel();
        updateCounters();
        renderBoard();
    }

    function revealAllMines(explodedCell = null) {
        gameBoard.forEach((row) => {
            row.forEach((cell) => {
                if (cell.isMine) {
                    cell.isRevealed = true;
                }
            });
        });

        if (explodedCell) {
            explodedCell.isExploded = true;
        }
    }

    function revealAdjacentEmptyCells(startCell) {
        const queue = [startCell];
        const revealedCells = [];

        while (queue.length) {
            const currentCell = queue.shift();

            if (!currentCell || currentCell.isRevealed || currentCell.isFlagged) {
                continue;
            }

            currentCell.isRevealed = true;
            currentCell.justRevealed = true;
            revealedCells.push(currentCell);

            if (currentCell.adjacentMines !== 0) {
                continue;
            }

            getNeighbors(currentCell.row, currentCell.col).forEach((neighbor) => {
                if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) {
                    queue.push(neighbor);
                }
            });
        }

        return revealedCells;
    }

    function checkWin() {
        const hasWon = gameBoard.every((row) => row.every((cell) => (
            cell.isMine || cell.isRevealed
        )));

        if (!hasWon) {
            return;
        }

        gameFinished = true;
        stopTimer();
        updateRestartButtonLabel();

        gameBoard.forEach((row) => {
            row.forEach((cell) => {
                if (cell.isMine && !cell.isFlagged) {
                    cell.isFlagged = true;
                }
            });
        });

        flagsPlaced = TOTAL_MINES;
        updateCounters();
        renderBoard();
    }

    function toggleFlag(row, col) {
        if (gameFinished) {
            return;
        }

        const cell = getCell(row, col);

        if (!cell || cell.isRevealed) {
            return;
        }

        if (!cell.isFlagged && flagsPlaced >= TOTAL_MINES) {
            return;
        }

        clearRevealHighlights();
        cell.isFlagged = !cell.isFlagged;
        flagsPlaced += cell.isFlagged ? 1 : -1;
        updateCounters();
        renderBoard();
    }

    function revealCell(row, col) {
        const cell = getCell(row, col);
        let newlyRevealedCells = [];

        if (!cell || cell.isRevealed || cell.isFlagged || gameFinished) {
            return;
        }

        clearRevealHighlights();

        if (!gameStarted) {
            placeMines(row, col);
            gameStarted = true;
            startTimer();
            updateRestartButtonLabel();
        }

        if (cell.isMine) {
            cell.isRevealed = true;
            gameFinished = true;
            stopTimer();
            revealAllMines(cell);
            updateRestartButtonLabel();
            minesweeperBoard.classList.remove('is-rumbling');
            minesweeperBoard.classList.remove('is-shaking');
            void minesweeperBoard.offsetWidth;
            minesweeperBoard.classList.add('is-shaking');
            renderBoard();
            openGameOverModal('C est perdu', 'Le joueur s est noye.');
            return;
        }

        if (cell.adjacentMines === 0) {
            newlyRevealedCells = revealAdjacentEmptyCells(cell);
        } else {
            cell.isRevealed = true;
            cell.justRevealed = true;
            newlyRevealedCells = [cell];
        }

        if (newlyRevealedCells.length >= 6) {
            minesweeperBoard.classList.remove('is-rumbling');
            void minesweeperBoard.offsetWidth;
            minesweeperBoard.classList.add('is-rumbling');
        }

        renderBoard();
        window.setTimeout(() => {
            clearRevealHighlights();
        }, 120);
        checkWin();
    }

    function renderBoard() {
        minesweeperBoard.innerHTML = gameBoard.map((row) => row.map((cell) => {
            const classes = ['minesweeper-cell'];
            let label = '';
            let particles = '';

            if (cell.isRevealed) {
                classes.push('is-revealed');

                if (cell.justRevealed) {
                    classes.push('is-newly-revealed');
                }

                if (cell.isMine) {
                    classes.push('is-mine');
                    label = '&#9760;';
                } else if (cell.adjacentMines > 0) {
                    classes.push(`minesweeper-cell-value-${cell.adjacentMines}`);
                    label = String(cell.adjacentMines);
                }

                if (cell.justRevealed && !cell.isMine) {
                    particles = `
                        <span class="reveal-particle reveal-particle-a" aria-hidden="true"></span>
                        <span class="reveal-particle reveal-particle-b" aria-hidden="true"></span>
                        <span class="reveal-particle reveal-particle-c" aria-hidden="true"></span>
                        <span class="reveal-particle reveal-particle-d" aria-hidden="true"></span>
                    `;
                }
            } else if (cell.isFlagged) {
                classes.push('is-flagged');
                label = '&#127988;&#8205;&#9760;&#65039;';
            } else if ((cell.row + cell.col) % 2 === 1) {
                classes.push('is-pattern-alt');
            }

            if (cell.isExploded) {
                classes.push('is-exploded');
            }

            return `
                <button
                    type="button"
                    class="${classes.join(' ')}"
                    data-row="${cell.row}"
                    data-col="${cell.col}"
                    aria-label="Case ${cell.row + 1}-${cell.col + 1}"
                >${particles}<span class="minesweeper-cell-label">${label}</span></button>
            `;
        }).join('')).join('');
    }

    function clearFormMessage() {
        formMessage.textContent = '';
        formMessage.classList.remove('feedback-success', 'feedback-error');
    }

    function resetForm() {
        movieForm.reset();
        movieIdInput.value = '';
        posterInput.value = '';
    }

    function fillForm(movie) {
        movieIdInput.value = movie.id;
        titleInput.value = movie.title;
        directorInput.value = movie.director;
        releaseDateInput.value = movie.releaseDate;
        durationInput.value = movie.duration;
        ratingInput.value = movie.rating;
        posterInput.value = movie.posterUrl || '';
        commentInput.value = movie.comment || '';
        activatePanel('manageSection');
        titleInput.focus();
        formMessage.textContent = 'Mode modification active.';
        formMessage.classList.remove('feedback-error');
        formMessage.classList.add('feedback-success');
    }

    function openDeleteModal(movieId, movieTitle) {
        movieIdToDelete = movieId;
        confirmText.textContent = `Tu vas supprimer "${movieTitle}" du catalogue.`;
        confirmModal.classList.remove('hidden');
        confirmModal.setAttribute('aria-hidden', 'false');
    }

    function closeDeleteModal() {
        movieIdToDelete = null;
        confirmModal.classList.add('hidden');
        confirmModal.setAttribute('aria-hidden', 'true');
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (passwordInput.value === PASSWORD) {
            passwordMessage.textContent = 'Acces autorise. Choisis maintenant ton navire.';
            passwordMessage.classList.remove('feedback-error');
            passwordMessage.classList.add('feedback-success');
            saveSession({ lastDestination: 'services' });
            showServices();
            return;
        }

        passwordMessage.textContent = 'Mot de passe incorrect.';
        passwordMessage.classList.remove('feedback-success');
        passwordMessage.classList.add('feedback-error');
        passwordInput.select();
    });

    cinemaNavButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activatePanel(button.dataset.target);
        });
    });

    mathNavButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activateMathPanel(button.dataset.mathTab);
        });
    });

    serviceCards.forEach((card) => {
        card.addEventListener('click', () => {
            if (card.dataset.service === 'cinema') {
                showCinema();
                return;
            }

            if (card.dataset.service === 'math') {
                showMath();
                return;
            }

            showGames();
        });
    });

    backToServicesButtons.forEach((button) => {
        button.addEventListener('click', () => {
            returnToServices();
        });
    });

    logoutButton?.addEventListener('click', () => {
        closeGameOverModal();
        clearSession();
        passwordInput.value = '';
        passwordMessage.textContent = '';
        passwordMessage.classList.remove('feedback-success', 'feedback-error');
        showViewImmediately(loginView, {
            headerMode: 'none'
        });
        passwordInput.focus();
    });

    function openSelectedGame(nextTab) {
        cleanupActiveGameForNavigation(nextTab);

        showGamePanel(nextTab);

        if (nextTab === 'snake') {
            initializeSnake();
            closeGameOverModal();
            return;
        }

        if (nextTab === 'pong') {
            initializePong();
            closeGameOverModal();
            return;
        }

        if (nextTab === '2048') {
            initialize2048();
            return;
        }

        if (nextTab === 'sudoku') {
            initializeSudoku();
            return;
        }

        if (nextTab === 'aim') {
            initializeAim();
            return;
        }

        if (nextTab === 'memory') {
            initializeMemory();
            return;
        }

        if (nextTab === 'ticTacToe') {
            initializeTicTacToe();
            return;
        }

        if (nextTab === 'battleship') {
            initializeBattleship();
            return;
        }

        initializeGame();
    }

    gameHomeTiles.forEach((tile) => {
        tile.addEventListener('click', () => {
            openSelectedGame(tile.dataset.openGame);
        });
    });

    gamesHomeButton?.addEventListener('click', () => {
        showGamesHome();
    });

    minesweeperBoard.addEventListener('click', (event) => {
        const cellButton = event.target.closest('.minesweeper-cell');

        if (!cellButton) {
            return;
        }

        const row = Number(cellButton.dataset.row);
        const col = Number(cellButton.dataset.col);
        revealCell(row, col);
    });

    minesweeperBoard.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        const cellButton = event.target.closest('.minesweeper-cell');

        if (!cellButton) {
            return;
        }
        toggleFlag(Number(cellButton.dataset.row), Number(cellButton.dataset.col));
    });

    restartGameButton.addEventListener('click', () => {
        initializeGame();
    });

    snakeStartButton.addEventListener('click', () => {
        startSnake();
    });

    pongStartButton.addEventListener('click', () => {
        startPong();
    });

    sudokuBoard.addEventListener('click', (event) => {
        const cellButton = event.target.closest('.sudoku-cell');

        if (!cellButton) {
            return;
        }

        const row = Number(cellButton.dataset.row);
        const col = Number(cellButton.dataset.col);

        sudokuSelectedCell = { row, col };
        renderSudoku();
    });

    sudokuRestartButton.addEventListener('click', () => {
        initializeSudoku();
    });

    game2048RestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initialize2048();
    });

    aimStartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeAim();
    });

    aimBoard.addEventListener('click', (event) => {
        const cellButton = event.target.closest('.aim-cell');

        if (!cellButton) {
            return;
        }

        const targetId = cellButton.dataset.targetId;

        if (targetId) {
            handleAimTargetHit(targetId);
            return;
        }

        handleAimMiss();
    });

    memoryRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeMemory();
    });

    memoryBoard.addEventListener('click', (event) => {
        const cardButton = event.target.closest('.memory-card-tile');

        if (!cardButton) {
            return;
        }

        handleMemoryCardFlip(Number(cardButton.dataset.index));
    });

    ticTacToeRestartButton.addEventListener('click', () => {
        initializeTicTacToe();
    });

    ticTacToeBoard.addEventListener('click', (event) => {
        const cellButton = event.target.closest('.tictactoe-cell');

        if (!cellButton) {
            return;
        }

        handleTicTacToeMove(Number(cellButton.dataset.index));
    });

    battleshipRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeBattleship();
    });

    battleshipEnemyBoard.addEventListener('click', (event) => {
        const cellButton = event.target.closest('.battleship-cell');

        if (!cellButton) {
            return;
        }

        handleBattleshipShot(Number(cellButton.dataset.row), Number(cellButton.dataset.col));
    });

    calculatorKeys.forEach((button) => {
        button.addEventListener('click', () => {
            const { action, value } = button.dataset;

            if (action === 'clear') {
                calculatorDisplay.value = '';
                calculatorStatus.textContent = '';
                calculatorStatus.classList.remove('feedback-success', 'feedback-error');
                return;
            }

            if (action === 'backspace') {
                calculatorDisplay.value = calculatorDisplay.value.slice(0, -1);
                return;
            }

            if (action === 'evaluate') {
                evaluateCalculatorExpression();
                return;
            }

            const start = calculatorDisplay.selectionStart ?? calculatorDisplay.value.length;
            const end = calculatorDisplay.selectionEnd ?? calculatorDisplay.value.length;
            calculatorDisplay.setRangeText(value || '', start, end, 'end');
            calculatorDisplay.focus();
        });
    });

    calculatorDisplay.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            evaluateCalculatorExpression();
        }
    });

    converterCategory.addEventListener('change', () => {
        populateConverterUnits(converterCategory.value);
    });

    converterSwapButton.addEventListener('click', () => {
        const previousFrom = converterFrom.value;
        converterFrom.value = converterTo.value;
        converterTo.value = previousFrom;
        convertUnits();
    });

    converterConvertButton.addEventListener('click', () => {
        convertUnits();
    });

    percentageButton.addEventListener('click', () => {
        calculatePercentage();
    });

    ruleThreeButton.addEventListener('click', () => {
        calculateRuleOfThree();
    });

    circleButton.addEventListener('click', () => {
        calculateCircle();
    });

    searchInput.addEventListener('input', (event) => {
        searchTerm = event.target.value;
        renderCatalog();
    });

    movieForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const ratingValue = Number(ratingInput.value);
        const durationValue = Number(durationInput.value);

        if (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 20) {
            formMessage.textContent = 'La note doit etre comprise entre 0 et 20.';
            formMessage.classList.remove('feedback-success');
            formMessage.classList.add('feedback-error');
            return;
        }

        if (Number.isNaN(durationValue) || durationValue <= 0) {
            formMessage.textContent = 'La duree doit etre un nombre positif.';
            formMessage.classList.remove('feedback-success');
            formMessage.classList.add('feedback-error');
            return;
        }

        const movieData = {
            id: movieIdInput.value || crypto.randomUUID(),
            title: titleInput.value.trim(),
            director: directorInput.value.trim(),
            releaseDate: releaseDateInput.value,
            duration: durationValue,
            rating: ratingValue,
            posterUrl: posterInput.value.trim() || defaultPoster,
            comment: commentInput.value.trim()
        };

        if (movieIdInput.value) {
            movies = movies.map((movie) => movie.id === movieData.id ? movieData : movie);
            formMessage.textContent = 'Film modifie avec succes.';
        } else {
            movies = [movieData, ...movies];
            formMessage.textContent = 'Film ajoute a la baie.';
        }

        formMessage.classList.remove('feedback-error');
        formMessage.classList.add('feedback-success');
        saveMovies();
        renderAll();
        resetForm();
    });

    resetFormButton.addEventListener('click', () => {
        resetForm();
        clearFormMessage();
    });

    manageList.addEventListener('click', (event) => {
        const button = event.target.closest('.manage-action');

        if (!button) {
            return;
        }

        const movie = movies.find((item) => item.id === button.dataset.id);

        if (!movie) {
            return;
        }

        if (button.dataset.action === 'edit') {
            fillForm(movie);
            return;
        }

        openDeleteModal(movie.id, movie.title);
    });

    cancelDeleteButton.addEventListener('click', () => {
        closeDeleteModal();
    });

    confirmDeleteButton.addEventListener('click', () => {
        if (!movieIdToDelete) {
            closeDeleteModal();
            return;
        }

        movies = movies.filter((item) => item.id !== movieIdToDelete);
        saveMovies();
        renderAll();

        if (movieIdInput.value === movieIdToDelete) {
            resetForm();
        }

        formMessage.textContent = 'Film supprime du catalogue.';
        formMessage.classList.remove('feedback-success');
        formMessage.classList.add('feedback-error');
        closeDeleteModal();
    });

    confirmModal.addEventListener('click', (event) => {
        if (event.target.dataset.closeModal === 'true') {
            closeDeleteModal();
        }
    });

    gameOverModal.addEventListener('click', (event) => {
        if (event.target.dataset.closeGameOver === 'true') {
            closeGameOverModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !confirmModal.classList.contains('hidden')) {
            closeDeleteModal();
        }

        if (event.key === 'Escape' && !gameOverModal.classList.contains('hidden')) {
            closeGameOverModal();
        }

        const directions = {
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 },
            z: { x: 0, y: -1 },
            Z: { x: 0, y: -1 },
            s: { x: 0, y: 1 },
            S: { x: 0, y: 1 },
            q: { x: -1, y: 0 },
            Q: { x: -1, y: 0 },
            d: { x: 1, y: 0 },
            D: { x: 1, y: 0 }
        };

        const nextDirection = directions[event.key];

        if (activeGameTab === 'snake' && nextDirection) {
            event.preventDefault();

            const lastQueuedDirection = snakeDirectionQueue[snakeDirectionQueue.length - 1];
            const referenceDirection = lastQueuedDirection || snakeNextDirection || snakeDirection;
            const isOpposite = referenceDirection.x + nextDirection.x === 0
                && referenceDirection.y + nextDirection.y === 0;
            const isSameDirection = referenceDirection.x === nextDirection.x
                && referenceDirection.y === nextDirection.y;

            if (isOpposite || isSameDirection) {
                return;
            }

            if (snakeDirectionQueue.length >= 2) {
                return;
            }

            snakeDirectionQueue.push(nextDirection);
            return;
        }

        if (activeGameTab === 'pong' && ['ArrowUp', 'ArrowDown', 'z', 'Z', 's', 'S'].includes(event.key)) {
            event.preventDefault();
            pongKeys.add(event.key);
            return;
        }

        if (activeGameTab === 'pong' && event.code === 'Space') {
            event.preventDefault();

            if (pongPaused) {
                resumePong();
            } else {
                pausePong();
            }

            return;
        }

        if (activeGameTab === 'sudoku') {
            const digit = Number(event.key);

            if (!sudokuSelectedCell || sudokuSolved) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) && sudokuSelectedCell) {
                    event.preventDefault();
                }
            }

            if (digit >= 1 && digit <= 9 && sudokuSelectedCell) {
                event.preventDefault();
                updateSudokuCell(sudokuSelectedCell.row, sudokuSelectedCell.col, digit);
                return;
            }

            if ((event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') && sudokuSelectedCell) {
                event.preventDefault();
                updateSudokuCell(sudokuSelectedCell.row, sudokuSelectedCell.col, 0);
                return;
            }

            if (sudokuSelectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                const offsets = {
                    ArrowUp: { row: -1, col: 0 },
                    ArrowDown: { row: 1, col: 0 },
                    ArrowLeft: { row: 0, col: -1 },
                    ArrowRight: { row: 0, col: 1 }
                };
                const offset = offsets[event.key];
                const nextRow = Math.min(SUDOKU_SIZE - 1, Math.max(0, sudokuSelectedCell.row + offset.row));
                const nextCol = Math.min(SUDOKU_SIZE - 1, Math.max(0, sudokuSelectedCell.col + offset.col));
                sudokuSelectedCell = { row: nextRow, col: nextCol };
                renderSudoku();
                return;
            }
        }

        if (activeGameTab !== '2048') {
            return;
        }

        const moves2048 = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right',
            z: 'up',
            Z: 'up',
            s: 'down',
            S: 'down',
            q: 'left',
            Q: 'left',
            d: 'right',
            D: 'right'
        };

        const nextMove2048 = moves2048[event.key];

        if (!nextMove2048) {
            return;
        }

        event.preventDefault();
        move2048(nextMove2048);
    });

    ['click', 'keydown', 'mousemove', 'touchstart'].forEach((eventName) => {
        document.addEventListener(eventName, registerActivity, { passive: true });
    });

    document.addEventListener('keyup', (event) => {
        pongKeys.delete(event.key);
    });

    window.addEventListener('resize', () => {
        if (activeGameTab === 'snake') {
            renderSnake();
        }

        if (activeGameTab === 'pong') {
            resetPongRound();
        }

        if (activeGameTab === '2048') {
            render2048();
        }
    });

    renderAll();
    showGamePanel('home');
    initializeGame();
    initializeSnake();
    initializePong();
    initializeSudoku();
    initialize2048();
    initializeAim();
    initializeMemory();
    initializeTicTacToe();
    initializeBattleship();
    initializeConverter();
    activateMathPanel('mathCalculatorPanel');

    const activeSession = loadSession();

    if (activeSession) {
        if (activeSession.lastDestination === 'cinema') {
            showViewImmediately(appView, {
                showHeader: true,
                headerMode: 'cinema',
                onComplete: () => activatePanel('dashboardSection')
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
        } else {
            showViewImmediately(servicesView, {
                headerMode: 'none'
            });
        }

        scheduleSessionTimeout();
    }
});
