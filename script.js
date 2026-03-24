document.addEventListener('DOMContentLoaded', () => {
    const SESSION_KEY = 'baie-des-naufrages-session';
    const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000;
    const defaultPoster = 'https://placehold.co/600x900/0f172a/f8fafc?text=Affiche';
    const EXCEL_FILE_CANDIDATES = [
        'film.xlsx',
        'film.xls',
        'film.xlsm',
        'films.xlsx',
        'films.xls',
        'films.xlsm',
        'cinema.xlsx',
        'cinema.xls',
        'cinema.xlsm'
    ];

    const loginView = document.getElementById('loginView');
    const servicesView = document.getElementById('servicesView');
    const appView = document.getElementById('appView');
    const gamesView = document.getElementById('gamesView');
    const mathView = document.getElementById('mathView');
    const musicView = document.getElementById('musicView');
    const siteHeader = document.getElementById('siteHeader');
    const loginForm = document.getElementById('loginForm');
    const pageBackButton = document.getElementById('pageBackButton');
    const logoutButton = document.getElementById('logoutButton');
    const serviceCards = document.querySelectorAll('.service-card');
    const backToServicesButtons = document.querySelectorAll('[data-back-to-services="true"]');
    const cinemaHeaderNav = document.getElementById('cinemaHeaderNav');
    const gamesHeaderNav = document.getElementById('gamesHeaderNav');
    const mathHeaderNav = document.getElementById('mathHeaderNav');
    const musicHeaderNav = document.getElementById('musicHeaderNav');
    const navButtons = document.querySelectorAll('.nav-button');
    const cinemaNavButtons = document.querySelectorAll('#cinemaHeaderNav .nav-button');
    const mathNavButtons = document.querySelectorAll('#mathHeaderNav .nav-button');
    const musicNavButtons = document.querySelectorAll('#musicHeaderNav .nav-button');
    const panels = document.querySelectorAll('.panel');
    const searchInput = document.getElementById('searchInput');
    const catalogGrid = document.getElementById('catalogGrid');
    const emptyCatalogMessage = document.getElementById('emptyCatalogMessage');
    const manageList = document.getElementById('manageList');
    const excelImportStatus = document.getElementById('excelImportStatus');
    const excelSourceName = document.getElementById('excelSourceName');
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
    const tetrisGame = document.getElementById('tetrisGame');
    const pacmanGame = document.getElementById('pacmanGame');
    const solitaireGame = document.getElementById('solitaireGame');
    const connect4Game = document.getElementById('connect4Game');
    const rhythmGame = document.getElementById('rhythmGame');
    const flappyGame = document.getElementById('flappyGame');
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
    const pongLeftLabel = document.getElementById('pongLeftLabel');
    const pongRightLabel = document.getElementById('pongRightLabel');
    const pongHelpText = document.getElementById('pongHelpText');
    const pongModeButtons = document.querySelectorAll('[data-pong-mode]');
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
    const aimDurationButtons = document.querySelectorAll('[data-aim-duration]');
    const memoryBoard = document.getElementById('memoryBoard');
    const memoryPairsDisplay = document.getElementById('memoryPairsDisplay');
    const memoryMovesDisplay = document.getElementById('memoryMovesDisplay');
    const memoryRestartButton = document.getElementById('memoryRestartButton');
    const ticTacToeBoard = document.getElementById('ticTacToeBoard');
    const ticTacToeTurnDisplay = document.getElementById('ticTacToeTurnDisplay');
    const ticTacToeScoreDisplay = document.getElementById('ticTacToeScoreDisplay');
    const ticTacToeHelpText = document.getElementById('ticTacToeHelpText');
    const ticTacToeRestartButton = document.getElementById('ticTacToeRestartButton');
    const ticTacToeModeButtons = document.querySelectorAll('[data-tictactoe-mode]');
    const battleshipPlayerBoard = document.getElementById('battleshipPlayerBoard');
    const battleshipEnemyBoard = document.getElementById('battleshipEnemyBoard');
    const battleshipPlayerShipsDisplay = document.getElementById('battleshipPlayerShipsDisplay');
    const battleshipEnemyShipsDisplay = document.getElementById('battleshipEnemyShipsDisplay');
    const battleshipStatusText = document.getElementById('battleshipStatusText');
    const battleshipRestartButton = document.getElementById('battleshipRestartButton');
    const tetrisBoard = document.getElementById('tetrisBoard');
    const tetrisScoreDisplay = document.getElementById('tetrisScoreDisplay');
    const tetrisLinesDisplay = document.getElementById('tetrisLinesDisplay');
    const tetrisStartButton = document.getElementById('tetrisStartButton');
    const tetrisHelpText = document.getElementById('tetrisHelpText');
    const pacmanBoard = document.getElementById('pacmanBoard');
    const pacmanScoreDisplay = document.getElementById('pacmanScoreDisplay');
    const pacmanLivesDisplay = document.getElementById('pacmanLivesDisplay');
    const pacmanStartButton = document.getElementById('pacmanStartButton');
    const pacmanHelpText = document.getElementById('pacmanHelpText');
    let pacmanCountdown = document.getElementById('pacmanCountdown');
    const solitaireStock = document.getElementById('solitaireStock');
    const solitaireWaste = document.getElementById('solitaireWaste');
    const solitaireFoundations = document.getElementById('solitaireFoundations');
    const solitaireTableau = document.getElementById('solitaireTableau');
    const solitaireStockDisplay = document.getElementById('solitaireStockDisplay');
    const solitaireFoundationsDisplay = document.getElementById('solitaireFoundationsDisplay');
    const solitaireRestartButton = document.getElementById('solitaireRestartButton');
    const solitaireHelpText = document.getElementById('solitaireHelpText');
    const connect4Board = document.getElementById('connect4Board');
    const connect4TurnDisplay = document.getElementById('connect4TurnDisplay');
    const connect4ScoreDisplay = document.getElementById('connect4ScoreDisplay');
    const connect4HelpText = document.getElementById('connect4HelpText');
    const connect4RestartButton = document.getElementById('connect4RestartButton');
    const connect4ModeButtons = document.querySelectorAll('[data-connect4-mode]');
    const rhythmBoard = document.getElementById('rhythmBoard');
    const rhythmScoreDisplay = document.getElementById('rhythmScoreDisplay');
    const rhythmStreakDisplay = document.getElementById('rhythmStreakDisplay');
    const rhythmTimerDisplay = document.getElementById('rhythmTimerDisplay');
    const rhythmHelpText = document.getElementById('rhythmHelpText');
    const rhythmStartButton = document.getElementById('rhythmStartButton');
    const flappyBoard = document.getElementById('flappyBoard');
    const flappyScoreDisplay = document.getElementById('flappyScoreDisplay');
    const flappyBestDisplay = document.getElementById('flappyBestDisplay');
    const flappyHelpText = document.getElementById('flappyHelpText');
    const flappyStartButton = document.getElementById('flappyStartButton');
    const flowFreeGame = document.getElementById('flowFreeGame');
    const flowFreeBoard = document.getElementById('flowFreeBoard');
    const flowFreePairsDisplay = document.getElementById('flowFreePairsDisplay');
    const flowFreeMovesDisplay = document.getElementById('flowFreeMovesDisplay');
    const flowFreeHelpText = document.getElementById('flowFreeHelpText');
    const flowFreeRestartButton = document.getElementById('flowFreeRestartButton');
    const magicSortGame = document.getElementById('magicSortGame');
    const magicSortBoard = document.getElementById('magicSortBoard');
    const magicSortSolvedDisplay = document.getElementById('magicSortSolvedDisplay');
    const magicSortMovesDisplay = document.getElementById('magicSortMovesDisplay');
    const magicSortHelpText = document.getElementById('magicSortHelpText');
    const magicSortRestartButton = document.getElementById('magicSortRestartButton');
    const mentalMathGame = document.getElementById('mentalMathGame');
    const mentalMathScoreDisplay = document.getElementById('mentalMathScoreDisplay');
    const mentalMathRoundDisplay = document.getElementById('mentalMathRoundDisplay');
    const mentalMathHelpText = document.getElementById('mentalMathHelpText');
    const mentalMathRestartButton = document.getElementById('mentalMathRestartButton');
    const mentalMathQuestion = document.getElementById('mentalMathQuestion');
    const mentalMathForm = document.getElementById('mentalMathForm');
    const mentalMathAnswerInput = document.getElementById('mentalMathAnswerInput');
    const mentalMathSubmitButton = document.getElementById('mentalMathSubmitButton');
    const mentalMathFeedback = document.getElementById('mentalMathFeedback');
    const candyCrushGame = document.getElementById('candyCrushGame');
    const candyCrushBoard = document.getElementById('candyCrushBoard');
    const candyCrushScoreDisplay = document.getElementById('candyCrushScoreDisplay');
    const candyCrushMovesDisplay = document.getElementById('candyCrushMovesDisplay');
    const candyCrushHelpText = document.getElementById('candyCrushHelpText');
    const candyCrushRestartButton = document.getElementById('candyCrushRestartButton');
    const harborRunGame = document.getElementById('harborRunGame');
    const harborRunBoard = document.getElementById('harborRunBoard');
    const harborRunScoreDisplay = document.getElementById('harborRunScoreDisplay');
    const harborRunBestDisplay = document.getElementById('harborRunBestDisplay');
    const harborRunHelpText = document.getElementById('harborRunHelpText');
    const harborRunStartButton = document.getElementById('harborRunStartButton');
    const stackerGame = document.getElementById('stackerGame');
    const stackerBoard = document.getElementById('stackerBoard');
    const stackerScoreDisplay = document.getElementById('stackerScoreDisplay');
    const stackerBestDisplay = document.getElementById('stackerBestDisplay');
    const stackerHelpText = document.getElementById('stackerHelpText');
    const stackerStartButton = document.getElementById('stackerStartButton');
    const coinClickerGame = document.getElementById('coinClickerGame');
    const coinClickerScoreDisplay = document.getElementById('coinClickerScoreDisplay');
    const coinClickerPowerDisplay = document.getElementById('coinClickerPowerDisplay');
    const coinClickerMultiplierDisplay = document.getElementById('coinClickerMultiplierDisplay');
    const coinClickerAutoDisplay = document.getElementById('coinClickerAutoDisplay');
    const coinClickerHelpText = document.getElementById('coinClickerHelpText');
    const coinClickerButton = document.getElementById('coinClickerButton');
    const coinClickerShop = document.getElementById('coinClickerShop');
    const coinClickerResetButton = document.getElementById('coinClickerResetButton');
    const chessGame = document.getElementById('chessGame');
    const chessBoard = document.getElementById('chessBoard');
    const chessTurnDisplay = document.getElementById('chessTurnDisplay');
    const chessStatusDisplay = document.getElementById('chessStatusDisplay');
    const chessHelpText = document.getElementById('chessHelpText');
    const chessResetButton = document.getElementById('chessResetButton');
    const chessModeButtons = document.querySelectorAll('[data-chess-mode]');
    const checkersGame = document.getElementById('checkersGame');
    const checkersBoard = document.getElementById('checkersBoard');
    const checkersTurnDisplay = document.getElementById('checkersTurnDisplay');
    const checkersCountDisplay = document.getElementById('checkersCountDisplay');
    const checkersHelpText = document.getElementById('checkersHelpText');
    const checkersResetButton = document.getElementById('checkersResetButton');
    const checkersModeButtons = document.querySelectorAll('[data-checkers-mode]');
    const airHockeyGame = document.getElementById('airHockeyGame');
    const airHockeyBoard = document.getElementById('airHockeyBoard');
    const airHockeyPuck = document.getElementById('airHockeyPuck');
    const airHockeyLeftPaddle = document.getElementById('airHockeyLeftPaddle');
    const airHockeyRightPaddle = document.getElementById('airHockeyRightPaddle');
    const airHockeyCountdown = document.getElementById('airHockeyCountdown');
    const airHockeyLeftScoreDisplay = document.getElementById('airHockeyLeftScoreDisplay');
    const airHockeyRightScoreDisplay = document.getElementById('airHockeyRightScoreDisplay');
    const airHockeyHelpText = document.getElementById('airHockeyHelpText');
    const airHockeyStartButton = document.getElementById('airHockeyStartButton');
    const airHockeyModeButtons = document.querySelectorAll('[data-airhockey-mode]');
    const reactionGame = document.getElementById('reactionGame');
    const reactionLastDisplay = document.getElementById('reactionLastDisplay');
    const reactionBestDisplay = document.getElementById('reactionBestDisplay');
    const reactionHelpText = document.getElementById('reactionHelpText');
    const reactionStartButton = document.getElementById('reactionStartButton');
    const reactionLantern = document.getElementById('reactionLantern');
    const baieBerryGame = document.getElementById('baieBerryGame');
    const baieBerryCanvas = document.getElementById('baieBerryCanvas');
    const baieBerryDropGuide = document.getElementById('baieBerryDropGuide');
    const baieBerryScoreDisplay = document.getElementById('baieBerryScoreDisplay');
    const baieBerryNextDisplay = document.getElementById('baieBerryNextDisplay');
    const baieBerryHelpText = document.getElementById('baieBerryHelpText');
    const baieBerryStartButton = document.getElementById('baieBerryStartButton');
    const breakoutGame = document.getElementById('breakoutGame');
    const breakoutCanvas = document.getElementById('breakoutCanvas');
    const breakoutScoreDisplay = document.getElementById('breakoutScoreDisplay');
    const breakoutLivesDisplay = document.getElementById('breakoutLivesDisplay');
    const breakoutHelpText = document.getElementById('breakoutHelpText');
    const breakoutStartButton = document.getElementById('breakoutStartButton');
    const mathPanels = document.querySelectorAll('.math-panel');
    const musicPanels = document.querySelectorAll('.music-panel');
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
    const musicHomePanel = document.getElementById('musicHomePanel');
    const pianoPanel = document.getElementById('pianoPanel');
    const instrumentTiles = document.querySelectorAll('[data-open-instrument]');
    const pianoKeyboard = document.getElementById('pianoKeyboard');
    const pianoResetButton = document.getElementById('pianoResetButton');
    const pianoHelpText = document.getElementById('pianoHelpText');

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
    const AIM_DEFAULT_ROUND_SECONDS = 30;
    const AIM_HIT_SCORE = 12;
    const AIM_MISS_SCORE = 5;
    const AIM_BEST_KEY = 'baie-des-naufrages-aim-best';
    const CONNECT4_ROWS = 6;
    const CONNECT4_COLS = 7;
    const MEMORY_ICONS = ['⚓', '🦀', '🐚', '🦑', '🪸', '🦞', '🐠', '🧭'];
    const BATTLESHIP_SIZE = 8;
    const BATTLESHIP_SHIPS = [4, 3, 3, 2, 2];
    const TETRIS_ROWS = 18;
    const TETRIS_COLS = 10;
    const TETRIS_TICK_MS = 420;
    const RHYTHM_LANES = ['Q', 'S', 'D', 'F'];
    const RHYTHM_DURATION_MS = 20000;
    const RHYTHM_BEST_KEY = 'baie-des-naufrages-rhythm-best';
    const FLAPPY_BEST_KEY = 'baie-des-naufrages-flappy-best';
    const HARBOR_RUN_BEST_KEY = 'baie-des-naufrages-harbor-run-best';
    const STACKER_BEST_KEY = 'baie-des-naufrages-stacker-best';
    const COIN_CLICKER_STORAGE_KEY = 'baie-des-naufrages-coin-clicker';
    const REACTION_BEST_KEY = 'baie-des-naufrages-reaction-best';
    const BAIE_BERRY_BEST_KEY = 'baie-des-naufrages-baieberry-best';
    const BREAKOUT_BEST_KEY = 'baie-des-naufrages-breakout-best';
    const FLOW_FREE_SIZE = 7;
    const FLOW_FREE_COLORS = ['#fb7185', '#38bdf8', '#facc15', '#34d399', '#c084fc', '#f97316', '#22d3ee', '#60a5fa', '#e879f9', '#84cc16'];
    const MAGIC_SORT_COLORS = {
        pink: '#f472b6',
        gold: '#facc15',
        mint: '#34d399',
        sky: '#38bdf8',
        coral: '#fb7185',
        violet: '#a78bfa'
    };
    const MAGIC_SORT_TUBE_CAPACITY = 4;
    const MAGIC_SORT_FILLED_TUBES = 6;
    const MAGIC_SORT_EMPTY_TUBES = 2;
    const MENTAL_MATH_TOTAL_ROUNDS = 10;
    const CHESS_SIZE = 8;
    const CHECKERS_SIZE = 8;
    const AIR_HOCKEY_GOAL_SCORE = 5;
    const CANDY_CRUSH_SIZE = 8;
    const CANDY_CRUSH_TARGET_SCORE = 4000;
    const CANDY_CRUSH_START_MOVES = 35;
    const CANDY_CRUSH_TYPES = ['coral', 'lagoon', 'sun', 'mint', 'shell'];
    const CANDY_CRUSH_COLORS = {
        coral: 'linear-gradient(180deg, #fb7185, #be123c)',
        lagoon: 'linear-gradient(180deg, #38bdf8, #1d4ed8)',
        sun: 'linear-gradient(180deg, #facc15, #d97706)',
        mint: 'linear-gradient(180deg, #34d399, #0f766e)',
        shell: 'linear-gradient(180deg, #c084fc, #7c3aed)'
    };
    const HARBOR_RUN_LANES = [18, 50, 82];
    const STACKER_TARGET_LAYERS = 12;
    const COIN_CLICKER_UPGRADES = [
        { id: 'captain', label: 'Capitaine', baseCost: 15, effectType: 'click', bonus: 1, description: '+1 par clic' },
        { id: 'hook', label: 'Crochet en or', baseCost: 60, effectType: 'multiplier', bonus: 0.2, description: '+0,20 multiplicateur' },
        { id: 'parrot', label: 'Perroquet mousse', baseCost: 110, effectType: 'auto', bonus: 1, description: '+1 piece / sec' },
        { id: 'harbor', label: 'Port marchand', baseCost: 260, effectType: 'auto', bonus: 4, description: '+4 pieces / sec' },
        { id: 'fleet', label: 'Flotte doree', baseCost: 420, effectType: 'click', bonus: 8, description: '+8 par clic' },
        { id: 'treasury', label: 'Tresor royal', baseCost: 760, effectType: 'multiplier', bonus: 0.5, description: '+0,50 multiplicateur' }
    ];
    const CHESS_PIECES = {
        pawn: { white: '♙', black: '♟' },
        rook: { white: '♖', black: '♜' },
        knight: { white: '♘', black: '♞' },
        bishop: { white: '♗', black: '♝' },
        queen: { white: '♕', black: '♛' },
        king: { white: '♔', black: '♚' }
    };
    const CHECKERS_DIRECTIONS = {
        red: [[-1, -1], [-1, 1]],
        black: [[1, -1], [1, 1]]
    };
    const BAIE_BERRY_FRUITS = [
        { name: 'Myrtille', radius: 16, color: '#60a5fa', score: 10 },
        { name: 'Framboise', radius: 21, color: '#fb7185', score: 24 },
        { name: 'Groseille', radius: 28, color: '#f97316', score: 56 },
        { name: 'Mure', radius: 36, color: '#a78bfa', score: 120 },
        { name: 'Cassis', radius: 46, color: '#4338ca', score: 260 },
        { name: 'Baie Royale', radius: 58, color: '#facc15', score: 560 }
    ];
    const TETRIS_PIECES = {
        I: { color: '#38bdf8', shape: [[1, 1, 1, 1]] },
        O: { color: '#facc15', shape: [[1, 1], [1, 1]] },
        T: { color: '#a855f7', shape: [[0, 1, 0], [1, 1, 1]] },
        L: { color: '#fb923c', shape: [[1, 0], [1, 0], [1, 1]] },
        J: { color: '#3b82f6', shape: [[0, 1], [0, 1], [1, 1]] },
        S: { color: '#34d399', shape: [[0, 1, 1], [1, 1, 0]] },
        Z: { color: '#f87171', shape: [[1, 1, 0], [0, 1, 1]] }
    };
    const PACMAN_LAYOUT = [
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
    const SOLITAIRE_SUITS = ['spades', 'hearts', 'clubs', 'diamonds'];
    const SOLITAIRE_SUIT_SYMBOLS = {
        spades: '♠',
        hearts: '♥',
        clubs: '♣',
        diamonds: '♦'
    };
    const SUDOKU_DIFFICULTIES = [
        { difficulty: 'Calme', removals: 38 },
        { difficulty: 'Brise', removals: 46 },
        { difficulty: 'Cap', removals: 52 }
    ];
    const PIANO_NOTES = [
        { id: 'c4', key: 'a', keyLabel: 'A', note: 'C4', frequency: 261.63, type: 'white' },
        { id: 'cs4', note: 'C#4', frequency: 277.18, type: 'black', anchor: 0.7, keyLabel: 'W' },
        { id: 'd4', key: 's', keyLabel: 'S', note: 'D4', frequency: 293.66, type: 'white' },
        { id: 'ds4', note: 'D#4', frequency: 311.13, type: 'black', anchor: 1.7, keyLabel: 'E' },
        { id: 'e4', key: 'd', keyLabel: 'D', note: 'E4', frequency: 329.63, type: 'white' },
        { id: 'f4', key: 'f', keyLabel: 'F', note: 'F4', frequency: 349.23, type: 'white' },
        { id: 'fs4', note: 'F#4', frequency: 369.99, type: 'black', anchor: 3.7, keyLabel: 'T' },
        { id: 'g4', key: 'g', keyLabel: 'G', note: 'G4', frequency: 392, type: 'white' },
        { id: 'gs4', note: 'G#4', frequency: 415.3, type: 'black', anchor: 4.7, keyLabel: 'Y' },
        { id: 'a4', key: 'h', keyLabel: 'H', note: 'A4', frequency: 440, type: 'white' },
        { id: 'as4', note: 'A#4', frequency: 466.16, type: 'black', anchor: 5.7, keyLabel: 'U' },
        { id: 'b4', key: 'j', keyLabel: 'J', note: 'B4', frequency: 493.88, type: 'white' },
        { id: 'c5', key: 'k', keyLabel: 'K', note: 'C5', frequency: 523.25, type: 'white' },
        { id: 'cs5', note: 'C#5', frequency: 554.37, type: 'black', anchor: 7.7, keyLabel: 'Maj+W' },
        { id: 'd5', key: 'a', keyLabel: 'Maj+S', note: 'D5', frequency: 587.33, type: 'white', shiftKey: 's' },
        { id: 'ds5', note: 'D#5', frequency: 622.25, type: 'black', anchor: 8.7, keyLabel: 'Maj+E' },
        { id: 'e5', key: 'd', keyLabel: 'Maj+D', note: 'E5', frequency: 659.25, type: 'white', shiftKey: 'd' },
        { id: 'f5', key: 'f', keyLabel: 'Maj+F', note: 'F5', frequency: 698.46, type: 'white', shiftKey: 'f' },
        { id: 'fs5', note: 'F#5', frequency: 739.99, type: 'black', anchor: 10.7, keyLabel: 'Maj+T' },
        { id: 'g5', key: 'g', keyLabel: 'Maj+G', note: 'G5', frequency: 783.99, type: 'white', shiftKey: 'g' },
        { id: 'gs5', note: 'G#5', frequency: 830.61, type: 'black', anchor: 11.7, keyLabel: 'Maj+Y' },
        { id: 'a5', key: 'h', keyLabel: 'Maj+H', note: 'A5', frequency: 880, type: 'white', shiftKey: 'h' },
        { id: 'as5', note: 'A#5', frequency: 932.33, type: 'black', anchor: 12.7, keyLabel: 'Maj+U' },
        { id: 'b5', key: 'j', keyLabel: 'Maj+J', note: 'B5', frequency: 987.77, type: 'white', shiftKey: 'j' },
        { id: 'c6', key: 'k', keyLabel: 'Maj+K', note: 'C6', frequency: 1046.5, type: 'white', shiftKey: 'k' }
    ];
    const PIANO_NOTE_MAP = new Map(PIANO_NOTES.map((note) => [note.id, note]));
    const PIANO_KEYBOARD_LAYOUT = new Map([
        ['a', { base: 'c4' }],
        ['w', { base: 'cs4', shifted: 'cs5' }],
        ['s', { base: 'd4', shifted: 'd5' }],
        ['e', { base: 'ds4', shifted: 'ds5' }],
        ['d', { base: 'e4', shifted: 'e5' }],
        ['f', { base: 'f4', shifted: 'f5' }],
        ['t', { base: 'fs4', shifted: 'fs5' }],
        ['g', { base: 'g4', shifted: 'g5' }],
        ['y', { base: 'gs4', shifted: 'gs5' }],
        ['h', { base: 'a4', shifted: 'a5' }],
        ['u', { base: 'as4', shifted: 'as5' }],
        ['j', { base: 'b4', shifted: 'b5' }],
        ['k', { base: 'c5', shifted: 'c6' }]
    ]);
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

    let movies = [];
    let searchTerm = '';
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
    let pongMode = 'solo';
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
    let aimRoundSeconds = AIM_DEFAULT_ROUND_SECONDS;
    let aimTimeRemaining = AIM_DEFAULT_ROUND_SECONDS;
    let aimRoundRunning = false;
    let aimRoundCompleted = false;
    let aimTimerInterval = null;
    let aimHitEffectKey = null;
    let aimHitEffectTimeout = null;
    let aimSpawnEffectKey = null;
    let aimSpawnEffectTimeout = null;
    let memoryCards = [];
    let memoryFlippedIndices = [];
    let memoryMatchedPairs = 0;
    let memoryMoves = 0;
    let memoryLockBoard = false;
    let memoryMismatchTimeout = null;
    let ticTacToeBoardState = Array(9).fill('');
    let ticTacToeCurrentPlayer = 'anchor';
    let ticTacToeScores = { anchor: 0, skull: 0 };
    let ticTacToeFinished = false;
    let ticTacToeMode = 'solo';
    let ticTacToeAiTimeout = null;
    let battleshipPlayerGrid = [];
    let battleshipEnemyGrid = [];
    let battleshipPlayerRemainingShips = 0;
    let battleshipEnemyRemainingShips = 0;
    let battleshipFinished = false;
    let battleshipAiTargets = [];
    let battleshipAwaitingAi = false;
    let tetrisGrid = [];
    let tetrisPiece = null;
    let tetrisScore = 0;
    let tetrisLines = 0;
    let tetrisRunning = false;
    let tetrisInterval = null;
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
    let solitaireStockCards = [];
    let solitaireWasteCards = [];
    let solitaireFoundationsState = { spades: [], hearts: [], clubs: [], diamonds: [] };
    let solitaireTableauColumns = [];
    let solitaireSelectedSource = null;
    let connect4BoardState = [];
    let connect4CurrentPlayer = 'player';
    let connect4Scores = { player: 0, ai: 0 };
    let connect4Finished = false;
    let connect4AiTimeout = null;
    let connect4Mode = 'solo';
    let connect4DropAnimationKey = null;
    let connect4DropAnimationState = null;
    let connect4DropAnimationTimeout = null;
    let rhythmNotes = [];
    let rhythmScore = 0;
    let rhythmStreak = 0;
    let rhythmBestScore = Number(window.localStorage.getItem(RHYTHM_BEST_KEY)) || 0;
    let rhythmRunning = false;
    let rhythmStartedAt = 0;
    let rhythmLastFrame = 0;
    let rhythmSpawnTimer = 0;
    let rhythmAnimationFrame = null;
    let rhythmPadHighlightTimeout = null;
    let flappyBirdY = 0;
    let flappyBirdVelocity = 0;
    let flappyPipes = [];
    let flappyScore = 0;
    let flappyBestScore = Number(window.localStorage.getItem(FLAPPY_BEST_KEY)) || 0;
    let flappyRunning = false;
    let flappyAnimationFrame = null;
    let flappyLastFrame = 0;
    let flappySpawnTimer = 0;
    let flappyBackdropOffset = 0;
    let flappySplashParticles = [];
    let flappySplashTimeout = null;
    const FLAPPY_BIRD_WIDTH = 46;
    const FLAPPY_BIRD_HEIGHT = 36;
    const FLAPPY_PIPE_WIDTH = 86;
    const FLAPPY_BIRD_OFFSET_X = 0.24;
    let flowFreeCells = [];
    let flowFreeLevel = null;
    let flowFreePaths = new Map();
    let flowFreeCompleted = new Set();
    let flowFreeMoves = 0;
    let flowFreeActiveColor = null;
    let flowFreePointerDown = false;
    let flowFreeRenderFrame = null;
    let flowFreeLastHoverKey = null;
    let flowFreeSpawning = new Set();
    let flowFreeSpawnTimers = new Map();
    let flowFreeDespawning = new Map();
    let flowFreeDespawnTimer = null;
    let magicSortTubes = [];
    let magicSortSelectedTube = null;
    let magicSortMoves = 0;
    let mentalMathScore = 0;
    let mentalMathRound = 0;
    let mentalMathCurrentQuestion = null;
    let candyCrushGrid = [];
    let candyCrushSelectedCell = null;
    let candyCrushScore = 0;
    let candyCrushMoves = 18;
    let candyCrushAnimating = false;
    let candyCrushPointerStart = null;
    let harborRunLane = 1;
    let harborRunObstacles = [];
    let harborRunScore = 0;
    let harborRunBestScore = Number(window.localStorage.getItem(HARBOR_RUN_BEST_KEY)) || 0;
    let harborRunRunning = false;
    let harborRunAnimationFrame = null;
    let harborRunLastFrame = 0;
    let harborRunSpawnTimer = 0;
    let harborRunSafeLane = 1;
    let harborRunBackdropOffset = 0;
    let stackerLayers = [];
    let stackerCurrentLayer = null;
    let stackerFragments = [];
    let stackerScore = 0;
    let stackerBestScore = Number(window.localStorage.getItem(STACKER_BEST_KEY)) || 0;
    let stackerRunning = false;
    let stackerAnimationFrame = null;
    let stackerLastFrame = 0;
    let coinClickerState = {
        coins: 0,
        clickPower: 1,
        multiplier: 1,
        autoPower: 0,
        upgrades: Object.fromEntries(COIN_CLICKER_UPGRADES.map((upgrade) => [upgrade.id, 0]))
    };
    let coinClickerAutoTimer = null;
    let coinClickerLastAutoTick = performance.now();
    let chessState = null;
    let chessSelectedSquare = null;
    let chessMode = 'solo';
    let chessAiTimeout = null;
    let checkersState = null;
    let checkersSelectedSquare = null;
    let checkersMode = 'solo';
    let checkersAiTimeout = null;
    let airHockeyMode = 'solo';
    let airHockeyState = null;
    let airHockeyKeys = new Set();
    let airHockeyAnimationFrame = null;
    let airHockeyLastFrame = 0;
    let airHockeyCountdownActive = false;
    let airHockeyCountdownTimer = null;
    let airHockeyCountdownCompleteTimer = null;
    let reactionState = 'idle';
    let reactionBestTime = Number(window.localStorage.getItem(REACTION_BEST_KEY)) || null;
    let reactionStartTime = 0;
    let reactionTimeout = null;
    let baieBerryState = null;
    let baieBerryAnimationFrame = null;
    let baieBerryLastFrame = 0;
    let baieBerryBestScore = Number(window.localStorage.getItem(BAIE_BERRY_BEST_KEY)) || 0;
    let baieBerryNextFruitId = 1;
    let breakoutState = null;
    let breakoutAnimationFrame = null;
    let breakoutLastFrame = 0;
    let breakoutKeys = new Set();
    let breakoutBestScore = Number(window.localStorage.getItem(BREAKOUT_BEST_KEY)) || 0;
    let activeMathTab = 'mathCalculatorPanel';
    let activeMusicTab = 'musicHomePanel';
    let pianoAudioContext = null;
    let pianoMasterGain = null;
    let pianoActiveNotes = new Map();
    let pianoSustainActive = false;
    let pianoPointerId = null;
    let pianoPointerNoteId = null;

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
        return [];
    }

    function setHeaderMode(mode = 'none') {
        const showCinemaHeader = mode === 'cinema';
        const showGamesHeader = mode === 'games';
        const showMathHeader = mode === 'math';
        const showMusicHeader = mode === 'music';

        cinemaHeaderNav.classList.toggle('hidden', !showCinemaHeader);
        gamesHeaderNav.classList.toggle('hidden', !showGamesHeader);
        mathHeaderNav.classList.toggle('hidden', !showMathHeader);
        musicHeaderNav.classList.toggle('hidden', !showMusicHeader);
    }

    function transitionToView(nextView, options = {}) {
        const {
            showHeader = false,
            headerMode = 'none',
            onComplete
        } = options;

        currentView.classList.add('view-leaving');

        window.setTimeout(() => {
            if (currentView === musicView && nextView !== musicView) {
                stopAllPianoNotes();
            }

            currentView.classList.remove('view-active', 'view-leaving');
            currentView.setAttribute('aria-hidden', 'true');

            siteHeader.classList.toggle('hidden', !showHeader);
            siteHeader.setAttribute('aria-hidden', String(!showHeader));
            setHeaderMode(headerMode);
            logoutButton?.classList.toggle('hidden', nextView === loginView);
            pageBackButton?.classList.toggle('hidden', nextView !== appView && nextView !== gamesView && nextView !== mathView && nextView !== musicView);

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

        if (currentView === musicView && nextView !== musicView) {
            stopAllPianoNotes();
        }

        siteHeader.classList.toggle('hidden', !showHeader);
        siteHeader.setAttribute('aria-hidden', String(!showHeader));
        setHeaderMode(headerMode);
        logoutButton?.classList.toggle('hidden', nextView === loginView);
        pageBackButton?.classList.toggle('hidden', nextView !== appView && nextView !== gamesView && nextView !== mathView && nextView !== musicView);

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

    function activateMusicPanel(targetId) {
        activeMusicTab = targetId;

        musicNavButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.musicTab === targetId);
        });

        musicPanels.forEach((panel) => {
            panel.classList.toggle('music-panel-active', panel.id === targetId);
        });

        if (targetId === 'pianoPanel') {
            renderPiano();
        }
    }

    function ensurePianoAudio() {
        if (!pianoAudioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) {
                pianoHelpText.textContent = 'Le navigateur ne prend pas en charge le son du piano.';
                return false;
            }

            pianoAudioContext = new AudioContextClass();
            pianoMasterGain = pianoAudioContext.createGain();
            pianoMasterGain.gain.value = 0.2;
            pianoMasterGain.connect(pianoAudioContext.destination);
        }

        if (pianoAudioContext.state === 'suspended') {
            pianoAudioContext.resume();
        }

        return true;
    }

    function renderPiano() {
        if (!pianoKeyboard) {
            return;
        }

        const whiteKeys = PIANO_NOTES.filter((note) => note.type === 'white');
        const blackKeys = PIANO_NOTES.filter((note) => note.type === 'black');
        pianoKeyboard.style.setProperty('--white-key-count', String(whiteKeys.length));

        pianoKeyboard.innerHTML = `
            <div class="piano-white-keys">
                ${whiteKeys.map((note) => `
                    <button
                        type="button"
                        class="piano-key piano-key-white${pianoActiveNotes.has(note.id) ? ' is-active' : ''}"
                        data-piano-key="${note.id}"
                        aria-label="${note.note} touche ${note.keyLabel}"
                    >
                        <span class="piano-key-note">${note.note}</span>
                        <span class="piano-key-label">${note.keyLabel}</span>
                    </button>
                `).join('')}
            </div>
            <div class="piano-black-keys">
                ${blackKeys.map((note) => `
                    <button
                        type="button"
                        class="piano-key piano-key-black${pianoActiveNotes.has(note.id) ? ' is-active' : ''}"
                        data-piano-key="${note.id}"
                        style="left: calc(${note.anchor} * ((100% - (var(--white-key-gap) * (var(--white-key-count) - 1))) / var(--white-key-count)) + ${note.anchor} * var(--white-key-gap));"
                        aria-label="${note.note} touche ${note.keyLabel}"
                    >
                        <span class="piano-key-note">${note.note}</span>
                        <span class="piano-key-label">${note.keyLabel}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    function updatePianoHelpText(note = null) {
        if (note) {
            pianoHelpText.textContent = `${note.note} en cours. ${pianoSustainActive ? 'Pedale active. ' : ''}Commande: ${note.keyLabel}.`;
            return;
        }

        if (pianoSustainActive) {
            pianoHelpText.textContent = 'Pedale active. Espace maintient les notes, relache Espace pour couper celles qui ne sont plus tenues.';
            return;
        }

        pianoHelpText.textContent = 'Utilise A a K. Maintiens Maj pour l octave au-dessus, Espace pour la pedale, ou clique directement sur le clavier.';
    }

    function releasePianoAudioNote(noteId) {
        const activeNote = pianoActiveNotes.get(noteId);

        if (!activeNote || !pianoAudioContext) {
            return;
        }

        const now = pianoAudioContext.currentTime;
        activeNote.noteGain.gain.cancelScheduledValues(now);
        activeNote.noteGain.gain.setValueAtTime(Math.max(activeNote.noteGain.gain.value, 0.0001), now);
        activeNote.noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        activeNote.oscillator.stop(now + 0.14);
        activeNote.overtone.stop(now + 0.14);
        pianoActiveNotes.delete(noteId);
    }

    function startPianoNote(noteId, source = 'keyboard') {
        const note = PIANO_NOTE_MAP.get(noteId);

        if (!note || !ensurePianoAudio()) {
            return;
        }

        const activeNote = pianoActiveNotes.get(noteId);

        if (activeNote) {
            activeNote.sources.add(source);
            activeNote.sustained = false;
            updatePianoHelpText(note);
            renderPiano();
            return;
        }

        const now = pianoAudioContext.currentTime;
        const oscillator = pianoAudioContext.createOscillator();
        const overtone = pianoAudioContext.createOscillator();
        const noteGain = pianoAudioContext.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(note.frequency, now);
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(note.frequency * 2, now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.14);

        oscillator.connect(noteGain);
        overtone.connect(noteGain);
        noteGain.connect(pianoMasterGain);

        oscillator.start(now);
        overtone.start(now);

        pianoActiveNotes.set(noteId, {
            oscillator,
            overtone,
            noteGain,
            sources: new Set([source]),
            sustained: false
        });
        updatePianoHelpText(note);
        renderPiano();
    }

    function stopPianoNote(noteId, source = 'keyboard', force = false) {
        const activeNote = pianoActiveNotes.get(noteId);

        if (!activeNote) {
            return;
        }

        if (force) {
            releasePianoAudioNote(noteId);
            updatePianoHelpText();
            renderPiano();
            return;
        }

        activeNote.sources.delete(source);

        if (activeNote.sources.size) {
            renderPiano();
            return;
        }

        if (pianoSustainActive) {
            activeNote.sustained = true;
            updatePianoHelpText();
            renderPiano();
            return;
        }

        releasePianoAudioNote(noteId);
        updatePianoHelpText();
        renderPiano();
    }

    function stopAllPianoNotes(force = true) {
        [...pianoActiveNotes.keys()].forEach((noteId) => stopPianoNote(noteId, 'all', force));
    }

    function releaseSustainedPianoNotes() {
        [...pianoActiveNotes.entries()].forEach(([noteId, activeNote]) => {
            if (!activeNote.sources.size) {
                releasePianoAudioNote(noteId);
            }
        });

        updatePianoHelpText();
        renderPiano();
    }

    function getPianoNoteIdFromKeyboardEvent(event) {
        const layout = PIANO_KEYBOARD_LAYOUT.get(event.key.toLowerCase());

        if (!layout) {
            return null;
        }

        return event.shiftKey && layout.shifted ? layout.shifted : layout.base;
    }

    function releaseKeyboardPianoKey(event) {
        const layout = PIANO_KEYBOARD_LAYOUT.get(event.key.toLowerCase());

        if (!layout) {
            return false;
        }

        stopPianoNote(layout.base, 'keyboard');

        if (layout.shifted) {
            stopPianoNote(layout.shifted, 'keyboard');
        }

        return true;
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
        if (!dateString) {
            return 'Date inconnue';
        }

        const parsedDate = new Date(dateString);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Date inconnue';
        }

        return new Intl.DateTimeFormat('fr-FR').format(parsedDate);
    }

    function formatRating(value) {
        const rating = Number(value);

        if (!Number.isFinite(rating)) {
            return 'Non note';
        }

        return `${rating.toFixed(1)} / 20`;
    }

    function normalizeHeader(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '');
    }

    function getFirstFilledValue(record, keys) {
        for (const key of keys) {
            const value = record[key];

            if (value !== undefined && value !== null && String(value).trim() !== '') {
                return value;
            }
        }

        return '';
    }

    function parseNumberValue(value) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        const normalizedValue = String(value || '').replace(',', '.').trim();
        const parsedValue = Number(normalizedValue);

        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    function parseExcelDateValue(value) {
        if (!value && value !== 0) {
            return '';
        }

        if (value instanceof Date && !Number.isNaN(value.getTime())) {
            return value.toISOString().slice(0, 10);
        }

        if (typeof value === 'number' && window.XLSX?.SSF) {
            const parsedCode = window.XLSX.SSF.parse_date_code(value);

            if (parsedCode) {
                const month = String(parsedCode.m).padStart(2, '0');
                const day = String(parsedCode.d).padStart(2, '0');
                return `${parsedCode.y}-${month}-${day}`;
            }
        }

        const normalizedValue = String(value).trim();

        if (!normalizedValue) {
            return '';
        }

        const isoMatch = normalizedValue.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);

        if (isoMatch) {
            const [, year, month, day] = isoMatch;
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        const frenchMatch = normalizedValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);

        if (frenchMatch) {
            const [, day, month, year] = frenchMatch;
            const normalizedYear = year.length === 2 ? `20${year}` : year;
            return `${normalizedYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        const parsedDate = new Date(normalizedValue);

        if (Number.isNaN(parsedDate.getTime())) {
            return '';
        }

        return parsedDate.toISOString().slice(0, 10);
    }

    function normalizeMovieRow(row) {
        const normalizedRecord = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
        );

        const title = String(getFirstFilledValue(normalizedRecord, [
            'titre',
            'title',
            'nom',
            'film'
        ])).trim();

        if (!title) {
            return null;
        }

        const ratingValue = parseNumberValue(getFirstFilledValue(normalizedRecord, [
            'note',
            'rating',
            'score'
        ]));
        const durationValue = parseNumberValue(getFirstFilledValue(normalizedRecord, [
            'duree',
            'duration',
            'temps'
        ]));
        const releaseDate = parseExcelDateValue(getFirstFilledValue(normalizedRecord, [
            'date',
            'datesortie',
            'sortie',
            'releasedate'
        ]));
        const genre = String(getFirstFilledValue(normalizedRecord, [
            'genre',
            'categorie',
            'type'
        ])).trim();
        const director = String(getFirstFilledValue(normalizedRecord, [
            'realisateur',
            'director',
            'auteur'
        ])).trim();
        const posterUrl = String(getFirstFilledValue(normalizedRecord, [
            'affiche',
            'poster',
            'posterurl',
            'image',
            'img'
        ])).trim();
        const comment = String(getFirstFilledValue(normalizedRecord, [
            'commentaire',
            'comment',
            'avis',
            'description'
        ])).trim();

        return {
            id: crypto.randomUUID(),
            title,
            director,
            genre,
            releaseDate,
            duration: durationValue || 0,
            rating: ratingValue,
            posterUrl: posterUrl || defaultPoster,
            comment
        };
    }

    function parseMoviesFromWorkbook(arrayBuffer) {
        const workbook = window.XLSX.read(arrayBuffer, {
            type: 'array',
            cellDates: true
        });
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
            return [];
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rows = window.XLSX.utils.sheet_to_json(worksheet, {
            defval: ''
        });

        return rows
            .map((row) => normalizeMovieRow(row))
            .filter(Boolean);
    }

    function setExcelImportFeedback(message, type = '') {
        if (!excelImportStatus) {
            return;
        }

        excelImportStatus.textContent = message;
        excelImportStatus.classList.remove('feedback-success', 'feedback-error');

        if (type === 'success') {
            excelImportStatus.classList.add('feedback-success');
        }

        if (type === 'error') {
            excelImportStatus.classList.add('feedback-error');
        }
    }

    async function importMoviesFromExcel() {
        if (!window.XLSX) {
            setExcelImportFeedback('Lecture Excel indisponible pour le moment.', 'error');
            renderAll();
            return;
        }

        setExcelImportFeedback('Recherche du fichier Excel du cinema...', '');

        for (const fileName of EXCEL_FILE_CANDIDATES) {
            try {
                const response = await fetch(fileName, { cache: 'no-store' });

                if (!response.ok) {
                    continue;
                }

                const fileBuffer = await response.arrayBuffer();
                const importedMovies = parseMoviesFromWorkbook(fileBuffer);

                movies = importedMovies;
                renderAll();
                setExcelImportFeedback(
                    importedMovies.length
                        ? `${importedMovies.length} film${importedMovies.length > 1 ? 's importes' : ' importe'} depuis Excel.`
                        : 'Le fichier Excel a ete trouve, mais aucune ligne film exploitable n a ete lue.',
                    importedMovies.length ? 'success' : 'error'
                );

                if (excelSourceName) {
                    excelSourceName.textContent = `Source detectee : ${fileName}`;
                }

                return;
            } catch (error) {
                console.error(`Impossible de lire ${fileName}.`, error);
            }
        }

        movies = loadMovies();
        renderAll();
        setExcelImportFeedback('Aucun fichier Excel detecte a la racine du depot.', 'error');

        if (excelSourceName) {
            excelSourceName.textContent = 'Ajoute par exemple film.xlsx ou film.xls a cote de index.html.';
        }
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
        const ratedMovies = movies.filter((movie) => Number.isFinite(Number(movie.rating)));
        const total = ratedMovies.reduce((sum, movie) => sum + Number(movie.rating), 0);
        const average = ratedMovies.length ? (total / ratedMovies.length).toFixed(1) : null;

        movieCount.textContent = `${count} film${count > 1 ? 's' : ''}`;
        averageRating.textContent = average ? `${average} / 20` : 'Non note';
    }

    function renderCatalog() {
        const filteredMovies = getFilteredMovies();

        catalogGrid.innerHTML = filteredMovies.map((movie) => `
            <article class="movie-card">
                <div class="movie-poster-shell">
                    <span class="rating-badge rating-badge-floating">${formatRating(movie.rating)}</span>
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
                        <p><strong>Genre :</strong> ${movie.genre || 'Inconnu'}</p>
                        <p><strong>Realisateur :</strong> ${movie.director || 'Inconnu'}</p>
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
            manageList.innerHTML = '<p class="empty-state">Aucun film importe pour le moment.</p>';
            return;
        }

        manageList.innerHTML = movies.map((movie) => `
            <article class="manage-item">
                <div class="manage-item-copy">
                    <h4>${movie.title}</h4>
                    <p>${movie.genre || 'Genre inconnu'} | ${movie.director || 'Realisateur inconnu'} | ${formatDuration(movie.duration)} | ${formatRating(movie.rating)}</p>
                </div>
            </article>
        `).join('');
    }

    function renderAll() {
        renderStats();
        renderCatalog();
        renderManageList();
    }

    function closeDeleteModal() {
        confirmModal.classList.add('hidden');
        confirmModal.setAttribute('aria-hidden', 'true');
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
        tetrisGame.classList.toggle('games-panel-active', tabId === 'tetris');
        pacmanGame.classList.toggle('games-panel-active', tabId === 'pacman');
        solitaireGame.classList.toggle('games-panel-active', tabId === 'solitaire');
        connect4Game.classList.toggle('games-panel-active', tabId === 'connect4');
        rhythmGame.classList.toggle('games-panel-active', tabId === 'rhythm');
        flappyGame.classList.toggle('games-panel-active', tabId === 'flappy');
        flowFreeGame.classList.toggle('games-panel-active', tabId === 'flowFree');
        magicSortGame.classList.toggle('games-panel-active', tabId === 'magicSort');
        mentalMathGame.classList.toggle('games-panel-active', tabId === 'mentalMath');
        candyCrushGame.classList.toggle('games-panel-active', tabId === 'candyCrush');
        harborRunGame.classList.toggle('games-panel-active', tabId === 'harborRun');
        stackerGame.classList.toggle('games-panel-active', tabId === 'stacker');
        coinClickerGame.classList.toggle('games-panel-active', tabId === 'coinClicker');
        chessGame.classList.toggle('games-panel-active', tabId === 'chess');
        checkersGame.classList.toggle('games-panel-active', tabId === 'checkers');
        airHockeyGame.classList.toggle('games-panel-active', tabId === 'airHockey');
        reactionGame.classList.toggle('games-panel-active', tabId === 'reaction');
        baieBerryGame.classList.toggle('games-panel-active', tabId === 'baieBerry');
        breakoutGame.classList.toggle('games-panel-active', tabId === 'breakout');

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

        if (previousTab === 'tetris' && nextTab !== 'tetris') {
            initializeTetris();
        }

        if (previousTab === 'pacman' && nextTab !== 'pacman') {
            initializePacman();
        }

        if (previousTab === 'solitaire' && nextTab !== 'solitaire') {
            initializeSolitaire();
        }

        if (previousTab === 'connect4' && nextTab !== 'connect4') {
            initializeConnect4();
        }

        if (previousTab === 'rhythm' && nextTab !== 'rhythm') {
            initializeRhythm();
        }

        if (previousTab === 'flappy' && nextTab !== 'flappy') {
            initializeFlappy();
        }

        if (previousTab === 'flowFree' && nextTab !== 'flowFree') {
            initializeFlowFree();
        }

        if (previousTab === 'magicSort' && nextTab !== 'magicSort') {
            initializeMagicSort();
        }

        if (previousTab === 'mentalMath' && nextTab !== 'mentalMath') {
            initializeMentalMath();
        }

        if (previousTab === 'candyCrush' && nextTab !== 'candyCrush') {
            initializeCandyCrush();
        }

        if (previousTab === 'harborRun' && nextTab !== 'harborRun') {
            initializeHarborRun();
        }

        if (previousTab === 'stacker' && nextTab !== 'stacker') {
            initializeStacker();
        }

        if (previousTab === 'coinClicker' && nextTab !== 'coinClicker') {
            saveCoinClickerState();
        }

        if (previousTab === 'chess' && nextTab !== 'chess') {
            initializeChess();
        }

        if (previousTab === 'checkers' && nextTab !== 'checkers') {
            initializeCheckers();
        }

        if (previousTab === 'airHockey' && nextTab !== 'airHockey') {
            initializeAirHockey();
        }

        if (previousTab === 'reaction' && nextTab !== 'reaction') {
            initializeReaction();
        }

        if (previousTab === 'baieBerry' && nextTab !== 'baieBerry') {
            initializeBaieBerry();
        }

        if (previousTab === 'breakout' && nextTab !== 'breakout') {
            initializeBreakout();
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

    function waitMs(duration) {
        return new Promise((resolve) => {
            window.setTimeout(resolve, duration);
        });
    }

    function createFlowFreeBasePath(size) {
        return Array.from({ length: size }, (_, rowIndex) => (
            Array.from({ length: size }, (_, stepIndex) => ({
                row: rowIndex,
                col: rowIndex % 2 === 0 ? stepIndex : (size - 1 - stepIndex)
            }))
        )).flat();
    }

    function transformFlowFreePath(path, size) {
        const transpose = Math.random() < 0.5;
        const flipX = Math.random() < 0.5;
        const flipY = Math.random() < 0.5;
        const reversed = Math.random() < 0.5;

        const transformed = path.map((cell) => {
            let row = cell.row;
            let col = cell.col;

            if (transpose) {
                [row, col] = [col, row];
            }

            if (flipY) {
                row = size - 1 - row;
            }

            if (flipX) {
                col = size - 1 - col;
            }

            return { row, col };
        });

        return reversed ? transformed.reverse() : transformed;
    }

    function generateFlowFreeSegmentLengths(totalCells) {
        const lengths = [];
        let remaining = totalCells;

        while (remaining > 0) {
            const remainingSlots = Math.ceil(remaining / 9);
            const minLength = lengths.length >= 4 ? 5 : 6;
            const maxLength = Math.min(10, remaining - ((remainingSlots - 1) * 4));
            let nextLength = Math.min(maxLength, minLength + Math.floor(Math.random() * Math.max(1, maxLength - minLength + 1)));

            if (remaining - nextLength > 0 && remaining - nextLength < 4) {
                nextLength = remaining;
            }

            lengths.push(nextLength);
            remaining -= nextLength;
        }

        if (lengths[lengths.length - 1] < 4 && lengths.length > 1) {
            const deficit = 4 - lengths[lengths.length - 1];
            lengths[lengths.length - 2] -= deficit;
            lengths[lengths.length - 1] += deficit;
        }

        return lengths;
    }

    function generateFlowFreeLevel() {
        const basePath = createFlowFreeBasePath(FLOW_FREE_SIZE);
        const fullPath = transformFlowFreePath(basePath, FLOW_FREE_SIZE);
        const segmentLengths = generateFlowFreeSegmentLengths(fullPath.length);
        const colorPool = shuffleArray(FLOW_FREE_COLORS).slice(0, segmentLengths.length);
        let offset = 0;

        return {
            size: FLOW_FREE_SIZE,
            pairs: segmentLengths.map((length, index) => {
                const cells = fullPath.slice(offset, offset + length);
                offset += length;

                return {
                    color: colorPool[index],
                    start: { ...cells[0] },
                    end: { ...cells[cells.length - 1] },
                    solution: cells.map((cell) => ({ ...cell }))
                };
            })
        };
    }

    function getMagicSortValidMoves(tubes) {
        const moves = [];

        tubes.forEach((fromTube, fromIndex) => {
            if (!fromTube.length) {
                return;
            }

            const movingColor = fromTube[fromTube.length - 1];
            let contiguousCount = 0;

            for (let cursor = fromTube.length - 1; cursor >= 0; cursor -= 1) {
                if (fromTube[cursor] !== movingColor) {
                    break;
                }
                contiguousCount += 1;
            }

            tubes.forEach((toTube, toIndex) => {
                if (fromIndex === toIndex || toTube.length >= 4) {
                    return;
                }

                const topTarget = toTube[toTube.length - 1];
                if (topTarget && topTarget !== movingColor) {
                    return;
                }

                const amount = Math.min(contiguousCount, 4 - toTube.length);
                if (!amount) {
                    return;
                }

                moves.push({ fromIndex, toIndex, amount });
            });
        });

        return moves;
    }

    function applyMagicSortMove(tubes, move) {
        const fromTube = tubes[move.fromIndex];
        const toTube = tubes[move.toIndex];

        for (let step = 0; step < move.amount; step += 1) {
            toTube.push(fromTube.pop());
        }
    }

    function generateMagicSortLevel() {
        const colorKeys = shuffleArray(Object.keys(MAGIC_SORT_COLORS)).slice(0, MAGIC_SORT_FILLED_TUBES);

        function getTubeTopInfo(tube) {
            if (!tube.length) {
                return null;
            }

            const color = tube[tube.length - 1];
            let count = 1;

            for (let cursor = tube.length - 2; cursor >= 0; cursor -= 1) {
                if (tube[cursor] !== color) {
                    break;
                }
                count += 1;
            }

            return { color, count };
        }

        function getMixedTubeCount(tubes) {
            return tubes.filter((tube) => tube.length > 1 && !tube.every((color) => color === tube[0])).length;
        }

        for (let attempt = 0; attempt < 24; attempt += 1) {
            const tubes = colorKeys.map((color) => Array(MAGIC_SORT_TUBE_CAPACITY).fill(color));
            tubes.push(...Array.from({ length: MAGIC_SORT_EMPTY_TUBES }, () => []));

            const reverseMoves = 32 + Math.floor(Math.random() * 20);

            for (let moveIndex = 0; moveIndex < reverseMoves; moveIndex += 1) {
                const sourceOptions = tubes
                    .map((tube, index) => ({ tube, index, top: getTubeTopInfo(tube) }))
                    .filter(({ top }) => Boolean(top));

                if (!sourceOptions.length) {
                    break;
                }

                const { index: sourceIndex, top } = sourceOptions[Math.floor(Math.random() * sourceOptions.length)];
                const destinationOptions = tubes
                    .map((tube, index) => ({ tube, index }))
                    .filter(({ tube, index }) => index !== sourceIndex && tube.length < MAGIC_SORT_TUBE_CAPACITY);

                if (!destinationOptions.length) {
                    continue;
                }

                const { index: destinationIndex, tube: destinationTube } = destinationOptions[Math.floor(Math.random() * destinationOptions.length)];
                const movableCount = Math.min(top.count, MAGIC_SORT_TUBE_CAPACITY - destinationTube.length);
                const amount = 1 + Math.floor(Math.random() * movableCount);

                for (let step = 0; step < amount; step += 1) {
                    destinationTube.push(tubes[sourceIndex].pop());
                }
            }

            if (getMixedTubeCount(tubes) >= 3) {
                return tubes.map((tube) => [...tube]);
            }
        }

        const fallbackColors = colorKeys.slice(0, 4);
        return [
            [fallbackColors[0], fallbackColors[1], fallbackColors[2], fallbackColors[3]],
            [fallbackColors[2], fallbackColors[3], fallbackColors[1], fallbackColors[0]],
            [fallbackColors[1], fallbackColors[0], fallbackColors[3], fallbackColors[2]],
            [fallbackColors[3], fallbackColors[2], fallbackColors[0], fallbackColors[1]],
            [],
            [],
            [],
            []
        ];
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
                    class="memory-card-tile${isRevealed ? ' is-revealed' : ''}${card.isMatched ? ' is-matched' : ''}${card.isRevealing ? ' is-revealing' : ''}${card.isReturning ? ' is-returning' : ''}"
                    data-index="${index}"
                    aria-label="${isRevealed ? `Carte ${card.icon}` : 'Carte retournee'}"
                >
                    <div class="memory-card-inner" aria-hidden="true">
                        <div class="memory-card-face memory-card-front">${card.icon}</div>
                        <div class="memory-card-face memory-card-back"><span class="card-back-emblem"></span></div>
                    </div>
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
            isMatched: false,
            isRevealing: false,
            isReturning: false
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

        card.isReturning = false;
        card.isRevealing = true;
        card.isFlipped = true;
        memoryFlippedIndices.push(index);
        renderMemoryBoard();

        window.setTimeout(() => {
            if (!memoryCards[index]) {
                return;
            }

            memoryCards[index].isRevealing = false;
            renderMemoryBoard();
        }, 340);

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
            firstCard.isRevealing = false;
            secondCard.isRevealing = false;
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
            firstCard.isRevealing = false;
            secondCard.isRevealing = false;
            firstCard.isReturning = true;
            secondCard.isReturning = true;
            renderMemoryBoard();

            memoryMismatchTimeout = window.setTimeout(() => {
                firstCard.isReturning = false;
                secondCard.isReturning = false;
                memoryFlippedIndices = [];
                memoryLockBoard = false;
                renderMemoryBoard();
            }, 340);
        }, 720);
    }

    function updateTicTacToeHud() {
        ticTacToeTurnDisplay.textContent = ticTacToeFinished
            ? '-'
            : (ticTacToeCurrentPlayer === 'anchor'
                ? (ticTacToeMode === 'duo' ? 'Joueur 1' : 'Toi')
                : (ticTacToeMode === 'duo' ? 'Joueur 2' : 'IA'));
        ticTacToeScoreDisplay.textContent = ticTacToeMode === 'duo'
            ? `J1 ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} J2`
            : `Toi ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} IA`;
        ticTacToeHelpText.textContent = ticTacToeMode === 'duo'
            ? 'Mode 2 joueurs: jouez chacun votre tour sur la meme grille.'
            : 'Mode 1 joueur: aligne trois symboles contre l IA pirate.';
        ticTacToeModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.tictactoeMode === ticTacToeMode);
        });
    }

    function renderTicTacToeBoard() {
        ticTacToeBoard.innerHTML = ticTacToeBoardState.map((cell, index) => `
            <button
                type="button"
                class="tictactoe-cell${cell ? ` is-${cell}` : ''}"
                data-index="${index}"
                aria-label="${cell ? (cell === 'anchor' ? 'Case ancre' : 'Case pirate') : 'Case vide'}"
            >
                <span aria-hidden="true">${cell === 'anchor' ? '⚓' : cell === 'skull' ? '☠' : ''}</span>
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
        if (ticTacToeAiTimeout) {
            window.clearTimeout(ticTacToeAiTimeout);
            ticTacToeAiTimeout = null;
        }
        closeGameOverModal();
        ticTacToeBoardState = Array(9).fill('');
        ticTacToeCurrentPlayer = 'anchor';
        ticTacToeFinished = false;
        ticTacToeHelpText.textContent = 'Place tes ancres contre l’IA pirate pour aligner trois symboles.';
        updateTicTacToeHud();
        renderTicTacToeBoard();
    }

    function getTicTacToeEmptyCells() {
        return ticTacToeBoardState
            .map((value, index) => value ? null : index)
            .filter((value) => value !== null);
    }

    function finishTicTacToeRound(winner) {
        ticTacToeFinished = true;

        if (winner === 'anchor') {
            ticTacToeScores.anchor += 1;
            ticTacToeHelpText.textContent = 'Victoire. Ton équipage tient le pont.';
            openGameOverModal('Victoire', 'Tu as battu l’IA pirate au morpion.');
        } else if (winner === 'skull') {
            ticTacToeScores.skull += 1;
            ticTacToeHelpText.textContent = 'Défaite. L’IA pirate prend le pont.';
            openGameOverModal('C’est perdu', 'L’IA pirate remporte le duel.');
        } else {
            ticTacToeHelpText.textContent = 'Match nul. Personne ne prend l’avantage.';
            openGameOverModal('Match nul', 'La manche se termine sans vainqueur.');
        }

        updateTicTacToeHud();
        renderTicTacToeBoard();
    }

    function handleTicTacToeMove(index, player = 'anchor') {
        if (ticTacToeFinished || ticTacToeBoardState[index] || ticTacToeCurrentPlayer !== player) {
            return;
        }

        ticTacToeBoardState[index] = player;
        const winningLine = getTicTacToeWinner();

        if (winningLine) {
            finishTicTacToeRound(player);
            return;
        }

        if (ticTacToeBoardState.every(Boolean)) {
            finishTicTacToeRound('draw');
            return;
        }

        ticTacToeCurrentPlayer = player === 'anchor' ? 'skull' : 'anchor';
        ticTacToeHelpText.textContent = ticTacToeCurrentPlayer === 'anchor'
            ? 'À toi de jouer.'
            : 'L’IA pirate prépare sa riposte.';
        updateTicTacToeHud();
        renderTicTacToeBoard();

        if (ticTacToeCurrentPlayer === 'skull') {
            window.setTimeout(() => {
                const emptyCells = getTicTacToeEmptyCells();

                if (!emptyCells.length || ticTacToeFinished) {
                    return;
                }

                const chosenIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                handleTicTacToeMove(chosenIndex, 'skull');
            }, 320);
        }
    }

    function updateTicTacToeHud() {
        ticTacToeTurnDisplay.textContent = ticTacToeFinished
            ? '-'
            : (ticTacToeCurrentPlayer === 'anchor'
                ? (ticTacToeMode === 'duo' ? 'Joueur 1' : 'Toi')
                : (ticTacToeMode === 'duo' ? 'Joueur 2' : 'IA'));
        ticTacToeScoreDisplay.textContent = ticTacToeMode === 'duo'
            ? `J1 ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} J2`
            : `Toi ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} IA`;
        ticTacToeHelpText.textContent = ticTacToeMode === 'duo'
            ? 'Mode 2 joueurs: jouez chacun votre tour sur la meme grille.'
            : 'Mode 1 joueur: aligne trois symboles contre l IA pirate.';
        ticTacToeModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.tictactoeMode === ticTacToeMode);
        });
    }

    function initializeTicTacToe() {
        if (ticTacToeAiTimeout) {
            window.clearTimeout(ticTacToeAiTimeout);
            ticTacToeAiTimeout = null;
        }

        closeGameOverModal();
        ticTacToeBoardState = Array(9).fill('');
        ticTacToeCurrentPlayer = 'anchor';
        ticTacToeFinished = false;
        updateTicTacToeHud();
        renderTicTacToeBoard();
    }

    function finishTicTacToeRound(winner) {
        ticTacToeFinished = true;

        if (winner === 'anchor') {
            ticTacToeScores.anchor += 1;
            ticTacToeHelpText.textContent = ticTacToeMode === 'duo' ? 'Le joueur 1 tient le pont.' : 'Victoire. Ton equipage tient le pont.';
            openGameOverModal('Victoire', ticTacToeMode === 'duo' ? 'Le joueur 1 remporte la manche de morpion.' : 'Tu as battu l IA pirate au morpion.');
        } else if (winner === 'skull') {
            ticTacToeScores.skull += 1;
            ticTacToeHelpText.textContent = ticTacToeMode === 'duo' ? 'Le joueur 2 prend le pont.' : 'Defaite. L IA pirate prend le pont.';
            openGameOverModal(ticTacToeMode === 'duo' ? 'Joueur 2 gagne' : 'C est perdu', ticTacToeMode === 'duo' ? 'Le joueur 2 remporte le duel de morpion.' : 'L IA pirate remporte le duel.');
        } else {
            ticTacToeHelpText.textContent = 'Match nul. Personne ne prend l avantage.';
            openGameOverModal('Match nul', 'La manche se termine sans vainqueur.');
        }

        updateTicTacToeHud();
        renderTicTacToeBoard();
    }

    function handleTicTacToeMove(index, player = 'anchor') {
        if (ticTacToeFinished || ticTacToeBoardState[index] || ticTacToeCurrentPlayer !== player) {
            return;
        }

        ticTacToeBoardState[index] = player;
        const winningLine = getTicTacToeWinner();

        if (winningLine) {
            finishTicTacToeRound(player);
            return;
        }

        if (ticTacToeBoardState.every(Boolean)) {
            finishTicTacToeRound('draw');
            return;
        }

        ticTacToeCurrentPlayer = player === 'anchor' ? 'skull' : 'anchor';
        updateTicTacToeHud();
        renderTicTacToeBoard();

        if (ticTacToeCurrentPlayer === 'skull' && ticTacToeMode === 'solo') {
            ticTacToeHelpText.textContent = 'L IA pirate prepare sa riposte.';
            ticTacToeAiTimeout = window.setTimeout(() => {
                ticTacToeAiTimeout = null;
                const emptyCells = getTicTacToeEmptyCells();

                if (!emptyCells.length || ticTacToeFinished) {
                    return;
                }

                const chosenIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                handleTicTacToeMove(chosenIndex, 'skull');
            }, 320);
        } else if (!ticTacToeFinished) {
            ticTacToeHelpText.textContent = ticTacToeMode === 'duo'
                ? (ticTacToeCurrentPlayer === 'anchor' ? 'Au joueur 1 de jouer.' : 'Au joueur 2 de jouer.')
                : 'A toi de jouer.';
        }
    }

    function setTicTacToeMode(nextMode) {
        if (!['solo', 'duo'].includes(nextMode)) {
            return;
        }

        ticTacToeMode = nextMode;
        ticTacToeScores = { anchor: 0, skull: 0 };
        initializeTicTacToe();
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
            : 'Défaite. Ta flotte a été coulée.';
        openGameOverModal(
            playerWon ? 'Victoire' : 'C’est perdu',
            playerWon ? 'La bataille navale est remportée.' : 'La flotte ennemie gagne la bataille.'
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

    function createEmptyTetrisGrid() {
        return Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill(''));
    }

    function updateTetrisHud() {
        tetrisScoreDisplay.textContent = String(tetrisScore);
        tetrisLinesDisplay.textContent = String(tetrisLines);
        tetrisStartButton.textContent = tetrisRunning ? 'Cale en cours' : 'Lancer la cale';
    }

    function createRandomTetrisPiece() {
        const types = Object.keys(TETRIS_PIECES);
        const type = types[Math.floor(Math.random() * types.length)];
        const piece = TETRIS_PIECES[type];

        return {
            type,
            color: piece.color,
            shape: piece.shape.map((row) => [...row]),
            row: 0,
            col: Math.floor((TETRIS_COLS - piece.shape[0].length) / 2)
        };
    }

    function rotateTetrisShape(shape) {
        return shape[0].map((_, colIndex) => shape.map((row) => row[colIndex]).reverse());
    }

    function canPlaceTetrisPiece(piece, nextRow = piece.row, nextCol = piece.col, nextShape = piece.shape) {
        return nextShape.every((shapeRow, rowIndex) => shapeRow.every((value, colIndex) => {
            if (!value) {
                return true;
            }

            const boardRow = nextRow + rowIndex;
            const boardCol = nextCol + colIndex;

            return boardCol >= 0
                && boardCol < TETRIS_COLS
                && boardRow >= 0
                && boardRow < TETRIS_ROWS
                && !tetrisGrid[boardRow][boardCol];
        }));
    }

    function renderTetris() {
        const displayGrid = tetrisGrid.map((row) => [...row]);

        if (tetrisPiece) {
            tetrisPiece.shape.forEach((shapeRow, rowIndex) => {
                shapeRow.forEach((value, colIndex) => {
                    if (!value) {
                        return;
                    }

                    const boardRow = tetrisPiece.row + rowIndex;
                    const boardCol = tetrisPiece.col + colIndex;

                    if (boardRow >= 0 && boardRow < TETRIS_ROWS && boardCol >= 0 && boardCol < TETRIS_COLS) {
                        displayGrid[boardRow][boardCol] = tetrisPiece.color;
                    }
                });
            });
        }

        tetrisBoard.innerHTML = displayGrid.map((row) => row.map((cell) => `
            <div class="tetris-cell${cell ? ' is-filled' : ''}"${cell ? ` style="--tetris-color:${cell}"` : ''}></div>
        `).join('')).join('');

        updateTetrisHud();
    }

    function stopTetris() {
        if (tetrisInterval) {
            window.clearInterval(tetrisInterval);
            tetrisInterval = null;
        }

        tetrisRunning = false;
        updateTetrisHud();
    }

    function clearTetrisLines() {
        let cleared = 0;
        tetrisGrid = tetrisGrid.filter((row) => {
            const complete = row.every(Boolean);

            if (complete) {
                cleared += 1;
            }

            return !complete;
        });

        while (tetrisGrid.length < TETRIS_ROWS) {
            tetrisGrid.unshift(Array(TETRIS_COLS).fill(''));
        }

        if (cleared) {
            tetrisLines += cleared;
            tetrisScore += [0, 100, 260, 460, 700][cleared] || (cleared * 200);
            tetrisHelpText.textContent = cleared > 1
                ? `Belle manœuvre. ${cleared} lignes nettoyées dans la cale.`
                : 'Une ligne libérée dans la cale.';
        }
    }

    function spawnTetrisPiece() {
        tetrisPiece = createRandomTetrisPiece();

        if (!canPlaceTetrisPiece(tetrisPiece)) {
            stopTetris();
            tetrisPiece = null;
            tetrisHelpText.textContent = 'La cale est pleine. Relance une traversée.';
            openGameOverModal('C’est perdu', `La cargaison s’est empilée. Score : ${tetrisScore}.`);
            renderTetris();
        }
    }

    function lockTetrisPiece() {
        tetrisPiece.shape.forEach((shapeRow, rowIndex) => {
            shapeRow.forEach((value, colIndex) => {
                if (!value) {
                    return;
                }

                const boardRow = tetrisPiece.row + rowIndex;
                const boardCol = tetrisPiece.col + colIndex;

                if (boardRow >= 0 && boardRow < TETRIS_ROWS && boardCol >= 0 && boardCol < TETRIS_COLS) {
                    tetrisGrid[boardRow][boardCol] = tetrisPiece.color;
                }
            });
        });

        clearTetrisLines();
        spawnTetrisPiece();
    }

    function dropTetrisStep() {
        if (!tetrisRunning || !tetrisPiece) {
            return;
        }

        if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row + 1, tetrisPiece.col)) {
            tetrisPiece.row += 1;
            renderTetris();
            return;
        }

        lockTetrisPiece();
        renderTetris();
    }

    function moveTetrisHorizontally(offset) {
        if (!tetrisRunning || !tetrisPiece) {
            return;
        }

        if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col + offset)) {
            tetrisPiece.col += offset;
            renderTetris();
        }
    }

    function rotateTetrisPiece() {
        if (!tetrisRunning || !tetrisPiece) {
            return;
        }

        const rotatedShape = rotateTetrisShape(tetrisPiece.shape);

        if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col, rotatedShape)) {
            tetrisPiece.shape = rotatedShape;
            renderTetris();
            return;
        }

        if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col - 1, rotatedShape)) {
            tetrisPiece.col -= 1;
            tetrisPiece.shape = rotatedShape;
            renderTetris();
            return;
        }

        if (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row, tetrisPiece.col + 1, rotatedShape)) {
            tetrisPiece.col += 1;
            tetrisPiece.shape = rotatedShape;
            renderTetris();
        }
    }

    function hardDropTetrisPiece() {
        if (!tetrisRunning || !tetrisPiece) {
            return;
        }

        while (canPlaceTetrisPiece(tetrisPiece, tetrisPiece.row + 1, tetrisPiece.col)) {
            tetrisPiece.row += 1;
        }

        tetrisScore += 18;
        lockTetrisPiece();
        renderTetris();
    }

    function initializeTetris() {
        closeGameOverModal();
        stopTetris();
        tetrisGrid = createEmptyTetrisGrid();
        tetrisPiece = createRandomTetrisPiece();
        tetrisScore = 0;
        tetrisLines = 0;
        tetrisHelpText.textContent = 'Empile les caisses. Flèches ou ZQSD pour bouger, haut ou Z pour pivoter, espace pour tomber.';
        renderTetris();
    }

    function startTetris() {
        closeGameOverModal();

        if (tetrisRunning) {
            return;
        }

        if (!tetrisPiece) {
            initializeTetris();
        }

        tetrisRunning = true;
        updateTetrisHud();
        tetrisInterval = window.setInterval(dropTetrisStep, TETRIS_TICK_MS);
    }

    function createPacmanGrid() {
        return PACMAN_LAYOUT.map((row) => row.split('').map((cell) => {
            if (cell === '#') {
                return 'wall';
            }

            if (cell === '.') {
                return 'pellet';
            }

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

    function updatePacmanHud() {
        pacmanScoreDisplay.textContent = String(pacmanScore);
        pacmanLivesDisplay.textContent = String(pacmanLives);
        pacmanStartButton.textContent = (pacmanRunning || pacmanCountdownActive) ? 'Chasse en cours' : 'Lancer la chasse';
    }

    function getPacmanRotation() {
        if (pacmanDirection.col === 1) {
            return '90deg';
        }

        if (pacmanDirection.col === -1) {
            return '-90deg';
        }

        if (pacmanDirection.row === -1) {
            return '0deg';
        }

        if (pacmanDirection.row === 1) {
            return '180deg';
        }

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
        pacmanCountdown.textContent = '';
        pacmanCountdown.classList.add('hidden');
        pacmanCountdown.setAttribute('aria-hidden', 'true');
    }

    function showPacmanCountdownValue(label) {
        pacmanCountdown.textContent = label;
        pacmanCountdown.classList.remove('hidden');
        pacmanCountdown.setAttribute('aria-hidden', 'false');
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
        pacmanCountdown = pacmanBoard.querySelector('#pacmanCountdown');
        pacmanHeroElement = pacmanBoard.querySelector('.pacman-hero');
        pacmanGhostElements = Array.from(pacmanBoard.querySelectorAll('.pacman-ghost'));
        hidePacmanCountdown();
    }

    function getPacmanGeometry() {
        const styles = window.getComputedStyle(pacmanBoard);
        const gap = parseFloat(styles.getPropertyValue('--pacman-gap')) || 4;
        const padding = parseFloat(styles.getPropertyValue('--pacman-padding')) || 10;
        const cols = pacmanGrid[0].length;
        const innerSize = pacmanBoard.clientWidth - (padding * 2);
        const cellSize = (innerSize - (gap * (cols - 1))) / cols;

        return {
            gap,
            padding,
            cellSize
        };
    }

    function placePacmanEntity(element, row, col, geometry) {
        if (!element) {
            return;
        }

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

    function renderPacman() {
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

    function stopPacman() {
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

    function trySetPacmanDirection(direction) {
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
        pacmanHelpText.textContent = pacmanLives > 0
            ? 'Un esprit t’a touché. Relance la chasse pour reprendre la baie.'
            : 'Les esprits du brouillard t’ont rattrapé.';
        renderPacman();

        if (pacmanLives > 0) {
            startPacmanCountdown(() => {
                pacmanRunning = true;
                updatePacmanHud();
                pacmanInterval = window.setInterval(runPacmanTick, 190);
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
            openGameOverModal('C’est perdu', `Les esprits du brouillard t’ont capturé. Score : ${pacmanScore}.`);
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
            pacmanHelpText.textContent = 'La baie est nettoyée. Plus aucune perle à ramasser.';
            openGameOverModal('Victoire', `Tu as vidé la baie de ses perles. Score : ${pacmanScore}.`);
        }

        renderPacman();
    }

    function initializePacman() {
        closeGameOverModal();
        stopPacman();
        pacmanGrid = createPacmanGrid();
        pacmanScore = 0;
        pacmanLives = 3;
        pacmanHelpText.textContent = 'Ramasse toutes les perles de la baie sans te faire attraper par les esprits du brouillard.';
        resetPacmanActors();
        if (pacmanGrid[pacmanPosition.row][pacmanPosition.col] === 'pellet') {
            pacmanGrid[pacmanPosition.row][pacmanPosition.col] = 'empty';
        }
        pacmanPellets = pacmanGrid.flat().filter((cell) => cell === 'pellet').length;
        buildPacmanBoard();
        renderPacman();
    }

    function startPacman() {
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
            pacmanInterval = window.setInterval(runPacmanTick, 190);
        });
    }

    function getSolitaireCardColor(suit) {
        return ['hearts', 'diamonds'].includes(suit) ? 'red' : 'black';
    }

    function getSolitaireCardLabel(card) {
        const rankMap = {
            1: 'A',
            11: 'V',
            12: 'D',
            13: 'R'
        };

        return `${rankMap[card.rank] || card.rank}${SOLITAIRE_SUIT_SYMBOLS[card.suit]}`;
    }

    function createSolitaireDeck() {
        return shuffleArray(SOLITAIRE_SUITS.flatMap((suit) => Array.from({ length: 13 }, (_, index) => ({
            id: crypto.randomUUID(),
            suit,
            rank: index + 1,
            faceUp: false
        }))));
    }

    function updateSolitaireHud() {
        const foundationCount = SOLITAIRE_SUITS.reduce((total, suit) => total + solitaireFoundationsState[suit].length, 0);
        solitaireStockDisplay.textContent = String(solitaireStockCards.length);
        solitaireFoundationsDisplay.textContent = `${foundationCount} / 52`;
    }

    function isValidSolitaireRun(column, startIndex) {
        for (let index = startIndex; index < column.length - 1; index += 1) {
            const current = column[index];
            const next = column[index + 1];

            if (!current.faceUp || !next.faceUp) {
                return false;
            }

            if (getSolitaireCardColor(current.suit) === getSolitaireCardColor(next.suit) || current.rank !== next.rank + 1) {
                return false;
            }
        }

        return true;
    }

    function getSolitaireMovableCards(source) {
        if (!source) {
            return [];
        }

        if (source.type === 'waste') {
            return solitaireWasteCards.length ? [solitaireWasteCards[solitaireWasteCards.length - 1]] : [];
        }

        if (source.type === 'foundation') {
            const pile = solitaireFoundationsState[source.suit];
            return pile.length ? [pile[pile.length - 1]] : [];
        }

        if (source.type === 'tableau') {
            const column = solitaireTableauColumns[source.col] || [];
            const cards = column.slice(source.index);
            return isValidSolitaireRun(column, source.index) ? cards : [];
        }

        return [];
    }

    function removeSolitaireSourceCards(source, count) {
        if (source.type === 'waste') {
            solitaireWasteCards.splice(-count, count);
            return;
        }

        if (source.type === 'foundation') {
            solitaireFoundationsState[source.suit].splice(-count, count);
            return;
        }

        if (source.type === 'tableau') {
            solitaireTableauColumns[source.col].splice(source.index, count);
            const column = solitaireTableauColumns[source.col];

            if (column.length && !column[column.length - 1].faceUp) {
                column[column.length - 1].faceUp = true;
            }
        }
    }

    function canPlaceSolitaireOnFoundation(card, suit) {
        const pile = solitaireFoundationsState[suit];
        const expectedRank = pile.length + 1;
        return card.suit === suit && card.rank === expectedRank;
    }

    function canPlaceSolitaireOnTableau(cards, col) {
        const firstCard = cards[0];
        const column = solitaireTableauColumns[col];
        const targetCard = column[column.length - 1];

        if (!targetCard) {
            return firstCard.rank === 13;
        }

        return targetCard.faceUp
            && getSolitaireCardColor(targetCard.suit) !== getSolitaireCardColor(firstCard.suit)
            && targetCard.rank === firstCard.rank + 1;
    }

    function clearSolitaireSelection() {
        solitaireSelectedSource = null;
    }

    function checkSolitaireWin() {
        const foundationCount = SOLITAIRE_SUITS.reduce((total, suit) => total + solitaireFoundationsState[suit].length, 0);

        if (foundationCount === 52) {
            solitaireHelpText.textContent = 'Le pont est rangé. Toutes les fondations sont complètes.';
            openGameOverModal('Victoire', 'Tu as réussi le solitaire du navire.');
        }
    }

    function renderSolitaire() {
        updateSolitaireHud();

        solitaireStock.innerHTML = solitaireStockCards.length
            ? '<button type="button" class="solitaire-playing-card-back" data-solitaire-action="draw"><span class="card-back-emblem"></span></button>'
            : '<button type="button" class="solitaire-playing-card-placeholder" data-solitaire-action="recycle">↺</button>';

        const wasteTopCard = solitaireWasteCards[solitaireWasteCards.length - 1];
        solitaireWaste.innerHTML = wasteTopCard
            ? `<button type="button" class="solitaire-playing-card${solitaireSelectedSource?.type === 'waste' ? ' is-selected' : ''} ${getSolitaireCardColor(wasteTopCard.suit)}" data-solitaire-source="waste">${getSolitaireCardLabel(wasteTopCard)}</button>`
            : '<div class="solitaire-playing-card-placeholder">Défausse</div>';

        solitaireFoundations.innerHTML = SOLITAIRE_SUITS.map((suit) => {
            const topCard = solitaireFoundationsState[suit][solitaireFoundationsState[suit].length - 1];
            const isSelected = solitaireSelectedSource?.type === 'foundation' && solitaireSelectedSource.suit === suit;

            return topCard
                ? `<button type="button" class="solitaire-playing-card${isSelected ? ' is-selected' : ''} ${getSolitaireCardColor(topCard.suit)}" data-solitaire-foundation="${suit}">${getSolitaireCardLabel(topCard)}</button>`
                : `<button type="button" class="solitaire-playing-card-placeholder foundation-${suit}" data-solitaire-foundation="${suit}">${SOLITAIRE_SUIT_SYMBOLS[suit]}</button>`;
        }).join('');

        solitaireTableau.innerHTML = solitaireTableauColumns.map((column, colIndex) => `
            <div class="solitaire-column" data-solitaire-column="${colIndex}">
                ${column.length ? column.map((card, cardIndex) => {
                    const isSelectable = card.faceUp;
                    const isSelected = solitaireSelectedSource?.type === 'tableau'
                        && solitaireSelectedSource.col === colIndex
                        && solitaireSelectedSource.index === cardIndex;

                    return `
                        <button
                            type="button"
                            class="solitaire-playing-card${card.faceUp ? ` ${getSolitaireCardColor(card.suit)}` : ' is-hidden'}${isSelected ? ' is-selected' : ''}"
                            style="top:${cardIndex * 28}px"
                            ${isSelectable ? `data-solitaire-tableau="${colIndex}" data-solitaire-index="${cardIndex}"` : ''}
                        >${card.faceUp ? getSolitaireCardLabel(card) : '<span class="card-back-emblem"></span>'}</button>
                    `;
                }).join('') : '<button type="button" class="solitaire-playing-card-placeholder solitaire-column-empty" data-solitaire-column-target="true"></button>'}
            </div>
        `).join('');
    }

    function drawSolitaireCard() {
        closeGameOverModal();

        if (solitaireStockCards.length) {
            const card = solitaireStockCards.pop();
            card.faceUp = true;
            solitaireWasteCards.push(card);
        } else if (solitaireWasteCards.length) {
            solitaireStockCards = solitaireWasteCards.reverse().map((card) => ({
                ...card,
                faceUp: false
            }));
            solitaireWasteCards = [];
        }

        clearSolitaireSelection();
        renderSolitaire();
    }

    function selectSolitaireSource(source) {
        const movableCards = getSolitaireMovableCards(source);

        if (!movableCards.length) {
            clearSolitaireSelection();
            renderSolitaire();
            return;
        }

        solitaireSelectedSource = source;
        renderSolitaire();
    }

    function moveSelectedSolitaireToFoundation(suit) {
        const movableCards = getSolitaireMovableCards(solitaireSelectedSource);

        if (movableCards.length !== 1 || !canPlaceSolitaireOnFoundation(movableCards[0], suit)) {
            return false;
        }

        removeSolitaireSourceCards(solitaireSelectedSource, 1);
        solitaireFoundationsState[suit].push(movableCards[0]);
        clearSolitaireSelection();
        solitaireHelpText.textContent = 'Carte placée sur une fondation.';
        renderSolitaire();
        checkSolitaireWin();
        return true;
    }

    function moveSelectedSolitaireToTableau(col) {
        const movableCards = getSolitaireMovableCards(solitaireSelectedSource);

        if (!movableCards.length || !canPlaceSolitaireOnTableau(movableCards, col)) {
            return false;
        }

        removeSolitaireSourceCards(solitaireSelectedSource, movableCards.length);
        solitaireTableauColumns[col].push(...movableCards);
        clearSolitaireSelection();
        solitaireHelpText.textContent = 'Pile déplacée sur une colonne du pont.';
        renderSolitaire();
        checkSolitaireWin();
        return true;
    }

    function initializeSolitaire() {
        closeGameOverModal();
        const deck = createSolitaireDeck();
        solitaireStockCards = [];
        solitaireWasteCards = [];
        solitaireFoundationsState = { spades: [], hearts: [], clubs: [], diamonds: [] };
        solitaireTableauColumns = Array.from({ length: 7 }, () => []);
        clearSolitaireSelection();

        for (let col = 0; col < 7; col += 1) {
            for (let depth = 0; depth <= col; depth += 1) {
                const card = deck.pop();
                card.faceUp = depth === col;
                solitaireTableauColumns[col].push(card);
            }
        }

        solitaireStockCards = deck.map((card) => ({ ...card, faceUp: false }));
        solitaireHelpText.textContent = 'Clique une carte pour la sélectionner puis clique sa destination. La pioche se recycle quand elle est vide.';
        renderSolitaire();
    }

    function updateConnect4Hud() {
        const currentPlayerLabel = connect4CurrentPlayer === 'player'
            ? (connect4Mode === 'duo' ? 'Joueur 1' : 'Toi')
            : (connect4Mode === 'duo' ? 'Joueur 2' : 'IA');
        connect4TurnDisplay.textContent = currentPlayerLabel;
        connect4ScoreDisplay.textContent = connect4Mode === 'duo'
            ? `J1 ${connect4Scores.player} - ${connect4Scores.ai} J2`
            : `Toi ${connect4Scores.player} - ${connect4Scores.ai} IA`;
        connect4HelpText.textContent = connect4Mode === 'duo'
            ? 'Mode 2 joueurs: cliquez chacun votre tour sur une colonne pour faire tomber un jeton.'
            : 'Mode 1 joueur: clique une colonne pour y larguer un jeton contre l IA.';
        connect4ModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.connect4Mode === connect4Mode);
        });
    }

    function renderConnect4() {
        connect4Board.innerHTML = `${connect4BoardState.map((row, rowIndex) => row.map((cell, colIndex) => `
            <button
                type="button"
                class="connect4-cell${cell === 'player' ? ' is-player' : ''}${cell === 'ai' ? ' is-ai' : ''}${connect4DropAnimationKey === `${rowIndex}-${colIndex}` ? ' is-drop-target' : ''}"
                data-row="${rowIndex}"
                data-col="${colIndex}"
                ${cell ? `data-connect4-token="${cell}"` : ''}
                aria-label="Colonne ${colIndex + 1}"
            ></button>
        `).join('')).join('')}
        ${connect4DropAnimationState ? `
            <div
                class="connect4-drop-piece ${connect4DropAnimationState.token === 'player' ? 'is-player' : 'is-ai'}"
                style="left: ${connect4DropAnimationState.left}px; top: ${connect4DropAnimationState.top}px; width: ${connect4DropAnimationState.size}px; height: ${connect4DropAnimationState.size}px; --connect4-drop-distance: ${connect4DropAnimationState.distance}px;"
                aria-hidden="true"
            ><span class="connect4-drop-piece-skull">☠</span></div>
        ` : ''}`;
    }

    function initializeConnect4() {
        if (connect4AiTimeout) {
            window.clearTimeout(connect4AiTimeout);
            connect4AiTimeout = null;
        }
        if (connect4DropAnimationTimeout) {
            window.clearTimeout(connect4DropAnimationTimeout);
            connect4DropAnimationTimeout = null;
        }

        closeGameOverModal();
        connect4BoardState = Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(null));
        connect4CurrentPlayer = 'player';
        connect4Finished = false;
        connect4DropAnimationKey = null;
        connect4DropAnimationState = null;
        updateConnect4Hud();
        renderConnect4();
    }

    function getConnect4DropRow(col) {
        for (let row = CONNECT4_ROWS - 1; row >= 0; row -= 1) {
            if (!connect4BoardState[row][col]) {
                return row;
            }
        }

        return -1;
    }

    function getConnect4Winner(board, token) {
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

        for (let row = 0; row < CONNECT4_ROWS; row += 1) {
            for (let col = 0; col < CONNECT4_COLS; col += 1) {
                if (board[row][col] !== token) {
                    continue;
                }

                for (const [rowOffset, colOffset] of directions) {
                    const line = [[row, col]];

                    for (let step = 1; step < 4; step += 1) {
                        const nextRow = row + (rowOffset * step);
                        const nextCol = col + (colOffset * step);

                        if (
                            nextRow < 0
                            || nextRow >= CONNECT4_ROWS
                            || nextCol < 0
                            || nextCol >= CONNECT4_COLS
                            || board[nextRow][nextCol] !== token
                        ) {
                            break;
                        }

                        line.push([nextRow, nextCol]);
                    }

                    if (line.length === 4) {
                        return line;
                    }
                }
            }
        }

        return null;
    }

    function highlightConnect4Line(line) {
        line.forEach(([row, col]) => {
            connect4Board.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.classList.add('is-winning');
        });
    }

    function chooseConnect4AiColumn() {
        const availableCols = Array.from({ length: CONNECT4_COLS }, (_, index) => index).filter((col) => getConnect4DropRow(col) !== -1);

        for (const col of availableCols) {
            const row = getConnect4DropRow(col);
            const preview = connect4BoardState.map((line) => [...line]);
            preview[row][col] = 'ai';
            if (getConnect4Winner(preview, 'ai')) {
                return col;
            }
        }

        for (const col of availableCols) {
            const row = getConnect4DropRow(col);
            const preview = connect4BoardState.map((line) => [...line]);
            preview[row][col] = 'player';
            if (getConnect4Winner(preview, 'player')) {
                return col;
            }
        }

        const preferred = [3, 2, 4, 1, 5, 0, 6];
        return preferred.find((col) => availableCols.includes(col)) ?? availableCols[0];
    }

    function finishConnect4(winner, line = null) {
        connect4Finished = true;

        if (line) {
            highlightConnect4Line(line);
        }

        if (winner === 'player') {
            connect4Scores.player += 1;
            connect4HelpText.textContent = connect4Mode === 'duo' ? 'Le joueur 1 aligne quatre jetons.' : 'Victoire. Tu controles la colonne du pont.';
            openGameOverModal('Victoire', connect4Mode === 'duo' ? 'Le joueur 1 remporte la manche de Puissance 4.' : 'Tu as battu l IA au Puissance 4.');
        } else if (winner === 'ai') {
            connect4Scores.ai += 1;
            connect4HelpText.textContent = connect4Mode === 'duo' ? 'Le joueur 2 aligne quatre jetons.' : 'L IA a aligne quatre jetons.';
            openGameOverModal(connect4Mode === 'duo' ? 'Joueur 2 gagne' : 'C est perdu', connect4Mode === 'duo' ? 'Le joueur 2 remporte la manche de Puissance 4.' : 'L IA remporte la manche de Puissance 4.');
        } else {
            connect4HelpText.textContent = 'La grille est pleine. Aucun navire ne prend l avantage.';
            openGameOverModal('Match nul', 'Plus de place. La manche de Puissance 4 se termine sans vainqueur.');
        }

        updateConnect4Hud();
    }

    function dropConnect4Token(col, token) {
        const row = getConnect4DropRow(col);

        if (row === -1) {
            return false;
        }

        connect4BoardState[row][col] = token;
        connect4DropAnimationKey = `${row}-${col}`;
        renderConnect4();
        const targetCell = connect4Board.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        if (targetCell) {
            const boardPaddingTop = Number.parseFloat(window.getComputedStyle(connect4Board).paddingTop) || 0;
            connect4DropAnimationState = {
                token,
                left: targetCell.offsetLeft,
                top: targetCell.offsetTop,
                size: targetCell.offsetWidth,
                distance: Math.max(0, targetCell.offsetTop - boardPaddingTop + 6)
            };
            renderConnect4();
        }

        if (connect4DropAnimationTimeout) {
            window.clearTimeout(connect4DropAnimationTimeout);
        }
        connect4DropAnimationTimeout = window.setTimeout(() => {
            if (connect4DropAnimationKey === `${row}-${col}`) {
                connect4DropAnimationKey = null;
                connect4DropAnimationState = null;
                renderConnect4();
            }
            connect4DropAnimationTimeout = null;
        }, 380);

        const winningLine = getConnect4Winner(connect4BoardState, token);

        if (winningLine) {
            finishConnect4(token, winningLine);
            return true;
        }

        if (connect4BoardState.every((line) => line.every(Boolean))) {
            finishConnect4('draw');
        }

        return true;
    }

    function runConnect4AiTurn() {
        if (connect4Finished || connect4Mode !== 'solo') {
            return;
        }

        dropConnect4Token(chooseConnect4AiColumn(), 'ai');
        connect4CurrentPlayer = 'player';
        updateConnect4Hud();

        if (!connect4Finished) {
            connect4HelpText.textContent = 'Ton tour. Choisis la meilleure colonne.';
        }
    }

    function handleConnect4Move(col) {
        if (connect4Finished || connect4CurrentPlayer !== 'player') {
            if (!(connect4Mode === 'duo' && !connect4Finished && connect4CurrentPlayer === 'ai')) {
                return;
            }
        }

        const activeToken = connect4CurrentPlayer;

        if (!dropConnect4Token(col, activeToken) || connect4Finished) {
            updateConnect4Hud();
            return;
        }

        if (connect4Mode === 'duo') {
            connect4CurrentPlayer = activeToken === 'player' ? 'ai' : 'player';
            updateConnect4Hud();
            return;
        }

        connect4CurrentPlayer = 'ai';
        connect4HelpText.textContent = 'L IA calcule sa reponse...';
        updateConnect4Hud();
        connect4AiTimeout = window.setTimeout(() => {
            connect4AiTimeout = null;
            runConnect4AiTurn();
        }, 320);
    }

    function setConnect4Mode(nextMode) {
        if (!['solo', 'duo'].includes(nextMode)) {
            return;
        }

        connect4Mode = nextMode;
        connect4Scores = { player: 0, ai: 0 };
        initializeConnect4();
    }

    function updateRhythmHud(timeRemainingMs = RHYTHM_DURATION_MS) {
        rhythmScoreDisplay.textContent = String(rhythmScore);
        rhythmStreakDisplay.textContent = String(rhythmStreak);
        rhythmTimerDisplay.textContent = String(Math.max(0, Math.ceil(timeRemainingMs / 1000)));
    }

    function renderRhythmBoard() {
        rhythmBoard.innerHTML = `
            <div class="rhythm-lanes">${RHYTHM_LANES.map(() => '<div class="rhythm-lane"></div>').join('')}</div>
            <div class="rhythm-notes"></div>
            <div class="rhythm-pads">${RHYTHM_LANES.map((key, index) => `<button type="button" class="rhythm-pad" data-rhythm-lane="${index}">${key}</button>`).join('')}</div>
        `;
    }

    function stopRhythm() {
        rhythmRunning = false;
        if (rhythmAnimationFrame) {
            window.cancelAnimationFrame(rhythmAnimationFrame);
            rhythmAnimationFrame = null;
        }
        if (rhythmPadHighlightTimeout) {
            window.clearTimeout(rhythmPadHighlightTimeout);
            rhythmPadHighlightTimeout = null;
        }
    }

    function initializeRhythm() {
        stopRhythm();
        closeGameOverModal();
        rhythmNotes = [];
        rhythmScore = 0;
        rhythmStreak = 0;
        rhythmStartedAt = 0;
        rhythmLastFrame = 0;
        rhythmSpawnTimer = 0;
        rhythmHelpText.textContent = `Tape ${RHYTHM_LANES.join(', ')} au bon moment quand les notes atteignent la ligne de frappe.`;
        rhythmStartButton.textContent = 'Lancer la cadence';
        updateRhythmHud();
        renderRhythmBoard();
    }

    function highlightRhythmPad(lane) {
        const pad = rhythmBoard.querySelector(`[data-rhythm-lane="${lane}"]`);
        pad?.classList.add('is-active');
        if (rhythmPadHighlightTimeout) {
            window.clearTimeout(rhythmPadHighlightTimeout);
        }
        rhythmPadHighlightTimeout = window.setTimeout(() => {
            rhythmBoard.querySelectorAll('.rhythm-pad').forEach((element) => element.classList.remove('is-active'));
        }, 110);
    }

    function renderRhythmNotes() {
        const notesLayer = rhythmBoard.querySelector('.rhythm-notes');
        if (!notesLayer) {
            return;
        }

        notesLayer.innerHTML = rhythmNotes.map((note) => `
            <div class="rhythm-note lane-${note.lane}" style="left:calc(${note.lane} * 25% + 11px); top:${note.y}px"></div>
        `).join('');
    }

    function finishRhythm() {
        stopRhythm();
        rhythmHelpText.textContent = `Cadence terminee. Score ${rhythmScore}. Record ${rhythmBestScore}.`;
        rhythmStartButton.textContent = 'Relancer la cadence';
        openGameOverModal('Fin de cadence', `Score : ${rhythmScore}. Record : ${rhythmBestScore}.`);
    }

    function startRhythm() {
        initializeRhythm();
        rhythmRunning = true;
        rhythmStartedAt = performance.now();
        rhythmLastFrame = rhythmStartedAt;
        rhythmStartButton.textContent = 'Cadence en cours';

        const step = (timestamp) => {
            if (!rhythmRunning) {
                return;
            }

            const delta = timestamp - rhythmLastFrame;
            rhythmLastFrame = timestamp;
            rhythmSpawnTimer += delta;

            if (rhythmSpawnTimer >= 520) {
                rhythmSpawnTimer = 0;
                rhythmNotes.push({ lane: Math.floor(Math.random() * RHYTHM_LANES.length), y: -24 });
            }

            rhythmNotes = rhythmNotes.filter((note) => {
                note.y += (delta * 0.34);
                if (note.y > 360) {
                    rhythmStreak = 0;
                    return false;
                }
                return true;
            });

            renderRhythmNotes();
            const timeRemaining = RHYTHM_DURATION_MS - (timestamp - rhythmStartedAt);
            updateRhythmHud(timeRemaining);

            if (rhythmScore > rhythmBestScore) {
                rhythmBestScore = rhythmScore;
                window.localStorage.setItem(RHYTHM_BEST_KEY, String(rhythmBestScore));
            }

            if (timeRemaining <= 0) {
                finishRhythm();
                return;
            }

            rhythmAnimationFrame = window.requestAnimationFrame(step);
        };

        rhythmAnimationFrame = window.requestAnimationFrame(step);
    }

    function handleRhythmHit(lane) {
        highlightRhythmPad(lane);

        if (!rhythmRunning) {
            startRhythm();
            return;
        }

        const noteIndex = rhythmNotes.findIndex((note) => note.lane === lane && Math.abs(note.y - 330) <= 36);

        if (noteIndex !== -1) {
            rhythmNotes.splice(noteIndex, 1);
            rhythmStreak += 1;
            rhythmScore += 10 + (Math.min(rhythmStreak, 12) * 2);
            renderRhythmNotes();
        } else {
            rhythmStreak = 0;
        }

        updateRhythmHud(RHYTHM_DURATION_MS - (performance.now() - rhythmStartedAt));
    }

    function renderFlappy() {
        const boardWidth = flappyBoard.clientWidth;
        const boardHeight = flappyBoard.clientHeight;
        const birdX = Math.max(42, boardWidth * FLAPPY_BIRD_OFFSET_X);
        const birdY = Math.max(0, Math.min(boardHeight - FLAPPY_BIRD_HEIGHT, flappyBirdY));
        const birdRotation = Math.max(-24, Math.min(68, flappyBirdVelocity * 4.4));
        const farOffset = -(flappyBackdropOffset * 0.18);
        const nearOffset = -(flappyBackdropOffset * 0.34);
        const beachOffset = -(flappyBackdropOffset * 0.52);
        const cloudAOffset = -(flappyBackdropOffset * 0.08);
        const cloudBOffset = -(flappyBackdropOffset * 0.12);

        flappyBoard.innerHTML = `
            <div class="flappy-cloud flappy-cloud-a" style="transform:translateX(${cloudAOffset}px);"></div>
            <div class="flappy-cloud flappy-cloud-b" style="transform:translateX(${cloudBOffset}px);"></div>
            <div class="flappy-backdrop flappy-backdrop-far" style="transform:translateX(${farOffset}px);"></div>
            <div class="flappy-backdrop flappy-backdrop-near" style="transform:translateX(${nearOffset}px);"></div>
            <div class="flappy-cove" style="transform:translateX(${nearOffset}px);"></div>
            <div class="flappy-rock-arch" style="transform:translateX(${nearOffset}px);"></div>
            <div class="flappy-beach" style="transform:translateX(${beachOffset}px);"></div>
            <div class="flappy-palm flappy-palm-left" style="transform:translateX(${beachOffset}px) scale(0.92);"></div>
            <div class="flappy-palm flappy-palm-right" style="transform:translateX(${beachOffset}px) scale(1.04);"></div>
            <div class="flappy-bird" style="left:${birdX}px; top:${birdY}px; transform:rotate(${birdRotation}deg);"></div>
            ${flappyPipes.map((pipe) => `
                <div class="flappy-pipe flappy-pipe-top" style="left:${pipe.x}px; top:0; height:${pipe.gapTop}px;"></div>
                <div class="flappy-pipe flappy-pipe-bottom" style="left:${pipe.x}px; bottom:0; height:${boardHeight - pipe.gapBottom}px;"></div>
            `).join('')}
            ${flappySplashParticles.map((particle) => `
                <span
                    class="flappy-splash"
                    style="left:${particle.x}px; top:${particle.y}px; width:${particle.size}px; height:${particle.size}px; --flappy-splash-dx:${particle.dx}px; --flappy-splash-dy:${particle.dy}px; --flappy-splash-delay:${particle.delay}ms;"
                ></span>
            `).join('')}
            <div class="flappy-ground"></div>
        `;
    }

    function stopFlappy() {
        flappyRunning = false;
        if (flappyAnimationFrame) {
            window.cancelAnimationFrame(flappyAnimationFrame);
            flappyAnimationFrame = null;
        }
    }

    function initializeFlappy() {
        stopFlappy();
        closeGameOverModal();
        if (flappySplashTimeout) {
            window.clearTimeout(flappySplashTimeout);
            flappySplashTimeout = null;
        }
        flappySplashParticles = [];
        flappyBirdY = Math.max(64, flappyBoard.clientHeight * 0.4);
        flappyBirdVelocity = 0;
        flappyPipes = [];
        flappyScore = 0;
        flappyBackdropOffset = 0;
        flappyHelpText.textContent = 'Espace, clic ou tap pour faire battre les ailes du perroquet pirate et passer entre les mats.';
        flappyStartButton.textContent = 'Lancer le vol';
        flappyScoreDisplay.textContent = '0';
        flappyBestDisplay.textContent = String(flappyBestScore);
        renderFlappy();
    }

    function createFlappySplash(boardWidth, boardHeight, impactY = null) {
        const waterTop = boardHeight * 0.86;
        const splashX = Math.max(42, boardWidth * FLAPPY_BIRD_OFFSET_X) + (FLAPPY_BIRD_WIDTH * 0.5);
        const surfaceImpactY = impactY ?? waterTop;
        const splashY = Math.max(waterTop - 10, Math.min(waterTop + 6, surfaceImpactY - 3));

        flappySplashParticles = Array.from({ length: 11 }, (_, index) => {
            const spread = index - 5;
            return {
                x: splashX + (spread * 6),
                y: splashY + Math.abs(spread % 2),
                dx: spread * 4.5,
                dy: -18 - (Math.abs(spread) * 2.4),
                size: 8 + ((index + 1) % 3) * 3,
                delay: index * 8
            };
        });

        if (flappySplashTimeout) {
            window.clearTimeout(flappySplashTimeout);
        }

        flappySplashTimeout = window.setTimeout(() => {
            flappySplashParticles = [];
            flappySplashTimeout = null;
            renderFlappy();
        }, 760);
    }

    function finishFlappy(reason = 'pipe', impactY = null) {
        stopFlappy();
        if (reason === 'water') {
            createFlappySplash(flappyBoard.clientWidth, flappyBoard.clientHeight, impactY);
            renderFlappy();
        }
        flappyHelpText.textContent = `Crash. Score ${flappyScore}. Record ${flappyBestScore}.`;
        flappyStartButton.textContent = 'Relancer le vol';
        openGameOverModal('C est perdu', `Ton oiseau a touche une arche. Score : ${flappyScore}.`);
    }

    function flapFlappyBird() {
        if (!flappyRunning) {
            startFlappy();
            return;
        }

        flappyBirdVelocity = -5.2;
    }

    function startFlappy() {
        initializeFlappy();
        flappyRunning = true;
        flappyLastFrame = performance.now();
        flappySpawnTimer = 0;
        flappyStartButton.textContent = 'Vol en cours';
        flappyBirdVelocity = -5.2;

        const step = (timestamp) => {
            if (!flappyRunning) {
                return;
            }

            const delta = Math.min(32, timestamp - flappyLastFrame);
            flappyLastFrame = timestamp;
            const boardWidth = flappyBoard.clientWidth;
            const boardHeight = flappyBoard.clientHeight;
            const groundTop = boardHeight * 0.86;
            const birdX = Math.max(42, boardWidth * FLAPPY_BIRD_OFFSET_X);

            flappyBirdVelocity += delta * 0.0125;
            flappyBirdY += flappyBirdVelocity * (delta / 16);
            flappySpawnTimer += delta;

            if (flappySpawnTimer >= 1780) {
                flappySpawnTimer = 0;
                const baseGapSize = Math.max(196, boardHeight * 0.4);
                const gapReduction = Math.min(54, flappyScore * 4);
                const gapSize = Math.max(142, baseGapSize - gapReduction);
                const minCenter = boardHeight * 0.24;
                const maxCenter = boardHeight * 0.62;
                const gapCenter = minCenter + (Math.random() * (maxCenter - minCenter));
                flappyPipes.push({
                    x: boardWidth + 56,
                    gapTop: Math.max(42, gapCenter - (gapSize / 2)),
                    gapBottom: Math.min(groundTop - 36, gapCenter + (gapSize / 2)),
                    scored: false
                });
            }

            flappyPipes = flappyPipes.filter((pipe) => pipe.x > -120);
            flappyPipes.forEach((pipe) => {
                pipe.x -= delta * 0.17;

                if (!pipe.scored && pipe.x + FLAPPY_PIPE_WIDTH < birdX) {
                    pipe.scored = true;
                    flappyScore += 1;
                    flappyScoreDisplay.textContent = String(flappyScore);

                    if (flappyScore > flappyBestScore) {
                        flappyBestScore = flappyScore;
                        flappyBestDisplay.textContent = String(flappyBestScore);
                        window.localStorage.setItem(FLAPPY_BEST_KEY, String(flappyBestScore));
                    }
                }
            });
            flappyBackdropOffset += delta * 0.17;

            const hitboxInsetX = 10;
            const hitboxInsetTop = 7;
            const hitboxInsetBottom = 9;
            const pipeInsetX = 8;
            const birdTop = flappyBirdY + hitboxInsetTop;
            const birdBottom = flappyBirdY + FLAPPY_BIRD_HEIGHT - hitboxInsetBottom;
            const birdLeft = birdX + hitboxInsetX;
            const birdRight = birdX + FLAPPY_BIRD_WIDTH - hitboxInsetX;
            const hitPipe = flappyPipes.some((pipe) => (
                birdRight > pipe.x + pipeInsetX
                && birdLeft < pipe.x + FLAPPY_PIPE_WIDTH - pipeInsetX
                && (birdTop < pipe.gapTop || birdBottom > pipe.gapBottom)
            ));
            const hitSky = flappyBirdY <= 0;
            const hitWater = flappyBirdY + FLAPPY_BIRD_HEIGHT >= boardHeight;

            if (hitSky || hitWater || hitPipe) {
                renderFlappy();
                finishFlappy(hitWater ? 'water' : 'pipe', flappyBirdY + FLAPPY_BIRD_HEIGHT);
                return;
            }

            renderFlappy();
            flappyAnimationFrame = window.requestAnimationFrame(step);
        };

        flappyAnimationFrame = window.requestAnimationFrame(step);
    }

    function updateAimHud() {
        aimScoreDisplay.textContent = String(aimScore);
        aimTimerDisplay.textContent = String(aimTimeRemaining);
        aimBestScoreDisplay.textContent = String(aimBestScore);
        aimStartButton.textContent = aimRoundRunning ? 'Bordée en cours' : 'Nouvelle bordée';
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

                if (key !== excludedKey && !occupied.has(key)) {
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
            const effectKey = `${row}-${col}`;
            const hitEffect = aimHitEffectKey === effectKey;
            const spawnEffect = aimSpawnEffectKey === effectKey;
            const shouldRenderTarget = Boolean(target) || hitEffect;
            const targetClasses = [
                'aim-target',
                spawnEffect ? 'is-spawning' : '',
                hitEffect && !target ? 'is-dispersing' : ''
            ].filter(Boolean).join(' ');

            return `
                <button
                    type="button"
                    class="aim-cell${target ? ' aim-cell-has-target' : ''}${hitEffect ? ' is-hit-effect' : ''}"
                    data-row="${row}"
                    data-col="${col}"
                    ${target ? `data-target-id="${target.id}"` : ''}
                    aria-label="${target ? 'Oursin a toucher' : 'Case d eau'}"
                >
                    ${shouldRenderTarget ? `<span class="${targetClasses}" aria-hidden="true"></span>` : ''}
                    ${hitEffect ? `
                        <span class="aim-hit-particle aim-hit-particle-a" aria-hidden="true"></span>
                        <span class="aim-hit-particle aim-hit-particle-b" aria-hidden="true"></span>
                        <span class="aim-hit-particle aim-hit-particle-c" aria-hidden="true"></span>
                        <span class="aim-hit-particle aim-hit-particle-d" aria-hidden="true"></span>
                        <span class="aim-hit-particle aim-hit-particle-e" aria-hidden="true"></span>
                    ` : ''}
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
        if (aimHitEffectTimeout) {
            window.clearTimeout(aimHitEffectTimeout);
            aimHitEffectTimeout = null;
        }
        if (aimSpawnEffectTimeout) {
            window.clearTimeout(aimSpawnEffectTimeout);
            aimSpawnEffectTimeout = null;
        }
        aimHitEffectKey = null;
        aimSpawnEffectKey = null;
        aimScore = 0;
        aimTimeRemaining = aimRoundSeconds;
        aimRoundCompleted = false;
        aimBoard.classList.remove('is-rumbling', 'is-splashing');
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
            'Fin de la bordée',
            `Tu as inscrit ${aimScore} touches avant la fin de la marée.`
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
        aimHitEffectKey = `${target.row}-${target.col}`;
        const nextCell = pickRandomAimCell(`${target.row}-${target.col}`);

        if (nextCell) {
            target.row = nextCell.row;
            target.col = nextCell.col;
            aimSpawnEffectKey = `${target.row}-${target.col}`;
        }

        updateAimHud();
        renderAimBoard();
        if (aimHitEffectTimeout) {
            window.clearTimeout(aimHitEffectTimeout);
        }
        aimHitEffectTimeout = window.setTimeout(() => {
            aimHitEffectKey = null;
            renderAimBoard();
        }, 320);
        if (aimSpawnEffectTimeout) {
            window.clearTimeout(aimSpawnEffectTimeout);
        }
        aimSpawnEffectTimeout = window.setTimeout(() => {
            aimSpawnEffectKey = null;
            if (!aimHitEffectKey) {
                renderAimBoard();
            }
        }, 280);
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

    function updateAimHud() {
        aimScoreDisplay.textContent = String(aimScore);
        aimTimerDisplay.textContent = String(aimTimeRemaining);
        aimBestScoreDisplay.textContent = String(aimBestScore);
        aimStartButton.textContent = aimRoundRunning ? 'Bordée en cours' : 'Nouvelle bordée';
        aimDurationButtons.forEach((button) => {
            button.classList.toggle('is-active', Number(button.dataset.aimDuration) === aimRoundSeconds);
        });
    }

    function initializeAim() {
        stopAimRound();
        if (aimHitEffectTimeout) {
            window.clearTimeout(aimHitEffectTimeout);
            aimHitEffectTimeout = null;
        }
        if (aimSpawnEffectTimeout) {
            window.clearTimeout(aimSpawnEffectTimeout);
            aimSpawnEffectTimeout = null;
        }
        aimHitEffectKey = null;
        aimSpawnEffectKey = null;
        aimScore = 0;
        aimTimeRemaining = aimRoundSeconds;
        aimRoundCompleted = false;
        aimBoard.classList.remove('is-rumbling', 'is-splashing');
        createAimTargets();
        updateAimHud();
        renderAimBoard();
    }

    function setAimRoundDuration(seconds) {
        if (![30, 60, 90].includes(seconds) || aimRoundSeconds === seconds) {
            return;
        }

        aimRoundSeconds = seconds;
        initializeAim();
    }

    function updatePongHud() {
        pongPlayerScoreDisplay.textContent = String(pongPlayerScore);
        pongAiScoreDisplay.textContent = String(pongAiScore);
        pongLeftLabel.textContent = pongMode === 'duo' ? 'Joueur 1' : 'Toi';
        pongRightLabel.textContent = pongMode === 'duo' ? 'Joueur 2' : 'IA';
        pongHelpText.innerHTML = pongMode === 'duo'
            ? 'Mode 2 joueurs: gauche avec Z/S, droite avec fl&egrave;ches haut/bas. Premier &agrave; 7.'
            : 'Mode 1 joueur: Z/S ou fl&egrave;ches pour jouer contre l IA. Premier &agrave; 7.';
        pongModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.pongMode === pongMode);
        });
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
            aiSpeed: pongMode === 'duo' ? 380 : 248,
            ballX: (boardWidth - ballSize) / 2,
            ballY: (boardHeight - ballSize) / 2,
            ballVelocityX: 388 * serveDirection,
            ballVelocityY: 228 * verticalDirection,
            countdownActive: true,
            aiDriftTimer: 0
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
            playerWon ? 'Victoire' : 'C’est perdu',
            playerWon ? 'Le duel est gagné. La baie t’acclame.' : 'L’IA remporte la manche. Le courant t’échappe.'
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
            finishPongOutcome(pongPlayerScore >= PONG_TARGET_SCORE);
            return;
        }

        resetPongRound();
        startPongCountdown();
    }

    function finishPongOutcome(playerWon) {
        stopPong();
        openGameOverModal(
            playerWon ? 'Victoire' : (pongMode === 'duo' ? 'Joueur 2 gagne' : 'C est perdu'),
            playerWon
                ? (pongMode === 'duo' ? 'Le joueur 1 remporte le duel.' : 'Le duel est gagne. La baie t acclame.')
                : (pongMode === 'duo' ? 'Le joueur 2 remporte le duel sur le clavier.' : 'L IA remporte la manche. Le courant t echappe.')
        );
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

        const leftDirection = (pongKeys.has('z') || pongKeys.has('Z') || (pongMode === 'solo' && pongKeys.has('ArrowUp')) ? -1 : 0)
            + (pongKeys.has('s') || pongKeys.has('S') || (pongMode === 'solo' && pongKeys.has('ArrowDown')) ? 1 : 0);

        pongState.playerY += leftDirection * pongState.playerSpeed * delta;
        pongState.playerY = Math.max(0, Math.min(pongState.playerY, pongState.boardHeight - pongState.paddleHeight));

        if (pongMode === 'duo') {
            const rightDirection = (pongKeys.has('ArrowUp') ? -1 : 0) + (pongKeys.has('ArrowDown') ? 1 : 0);
            pongState.aiY += rightDirection * pongState.playerSpeed * delta;
        } else {
            const ballCenter = pongState.ballY + (pongState.ballSize / 2);
            const anticipatedCenter = ballCenter + (pongState.ballVelocityY * 0.045);
            const desiredAiY = Math.max(
                0,
                Math.min(
                    anticipatedCenter - (pongState.paddleHeight / 2),
                    pongState.boardHeight - pongState.paddleHeight
                )
            );
            pongState.aiDriftTimer = Math.max(0, (pongState.aiDriftTimer || 0) - delta);
            if (pongState.aiDriftTimer <= 0) {
                pongState.aiTargetY = desiredAiY + ((Math.random() - 0.5) * 36);
                pongState.aiDriftTimer = 0.16 + (Math.random() * 0.12);
            }
            const trackingStrength = Math.min(1, delta * 2.8);
            pongState.aiY += (pongState.aiTargetY - pongState.aiY) * trackingStrength;
        }
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

    function setPongMode(nextMode) {
        if (!['solo', 'duo'].includes(nextMode)) {
            return;
        }

        pongMode = nextMode;
        initializePong();
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
                openGameOverModal('C’est perdu', 'Trois erreurs. Le navire s’est perdu dans le brouillard.');
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
                openGameOverModal('C’est perdu', 'La marée t’a bloqué. Plus aucun coup possible.');
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

    function openGameOverModal(title = 'C’est perdu', text = 'Le joueur s’est noyé.') {
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
        openGameOverModal('C’est perdu', 'Le serpent s’est écrasé contre la coque.');
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
            openGameOverModal('C’est perdu', 'Le joueur s’est noyé.');
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

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveSession({ lastDestination: 'services' });
        showServices();
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

    musicNavButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activateMusicPanel(button.dataset.musicTab);
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

            if (card.dataset.service === 'music') {
                showMusic();
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
        showViewImmediately(loginView, {
            headerMode: 'none'
        });
        loginForm.querySelector('button[type="submit"]')?.focus();
    });

    function getFlowFreePairByColor(color) {
        return flowFreeLevel?.pairs.find((pair) => pair.color === color) || null;
    }

    function updateFlowFreeHud() {
        flowFreePairsDisplay.textContent = `${flowFreeCompleted.size} / ${flowFreeLevel?.pairs.length || 0}`;
        flowFreeMovesDisplay.textContent = String(flowFreeMoves);
    }

    function setFlowFreePath(color, nextPath) {
        const previousPath = flowFreePaths.get(color) || [];
        const previousKeys = new Set(previousPath.map((cell) => `${cell.row}-${cell.col}`));

        flowFreeCells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.color === color && !cell.isAnchor) {
                    cell.color = null;
                }
            });
        });

        nextPath.forEach((cell, index) => {
            if (index === 0) {
                return;
            }

            const boardCell = flowFreeCells[cell.row][cell.col];
            if (!boardCell.isAnchor) {
                boardCell.color = color;
                const key = `${cell.row}-${cell.col}`;
                if (!previousKeys.has(key)) {
                    flowFreeSpawning.add(key);

                    const existingTimer = flowFreeSpawnTimers.get(key);
                    if (existingTimer) {
                        window.clearTimeout(existingTimer);
                    }

                    const timer = window.setTimeout(() => {
                        flowFreeSpawning.delete(key);
                        flowFreeSpawnTimers.delete(key);
                        scheduleFlowFreeRender();
                    }, 180);

                    flowFreeSpawnTimers.set(key, timer);
                }
            }
        });

        flowFreePaths.set(color, nextPath.map((cell) => ({ ...cell })));
    }

    function renderFlowFree() {
        flowFreeRenderFrame = null;
        updateFlowFreeHud();
        const connectionMap = new Map();

        flowFreePaths.forEach((path, color) => {
            path.forEach((cell, index) => {
                const key = `${cell.row}-${cell.col}`;
                const connections = connectionMap.get(key) || { top: 0, right: 0, bottom: 0, left: 0, color };
                const previousCell = path[index - 1];
                const nextCell = path[index + 1];

                [previousCell, nextCell].forEach((linkedCell) => {
                    if (!linkedCell) {
                        return;
                    }

                    if (linkedCell.row === cell.row - 1 && linkedCell.col === cell.col) {
                        connections.top = 1;
                    } else if (linkedCell.row === cell.row + 1 && linkedCell.col === cell.col) {
                        connections.bottom = 1;
                    } else if (linkedCell.row === cell.row && linkedCell.col === cell.col - 1) {
                        connections.left = 1;
                    } else if (linkedCell.row === cell.row && linkedCell.col === cell.col + 1) {
                        connections.right = 1;
                    }
                });

                connectionMap.set(key, connections);
            });
        });

        flowFreeDespawning.forEach((connection, key) => {
            connectionMap.set(key, connection);
        });

        flowFreeBoard.innerHTML = flowFreeCells.map((row, rowIndex) => row.map((cell, colIndex) => {
            const classes = ['flowfree-cell'];

            if (cell.isAnchor) {
                classes.push('is-anchor');
            }

            if (cell.color) {
                classes.push('is-filled');
            }

            if (flowFreeActiveColor && cell.color === flowFreeActiveColor) {
                classes.push('is-selected');
            }

            const connectionKey = `${rowIndex}-${colIndex}`;
            const connection = connectionMap.get(connectionKey) || { top: 0, right: 0, bottom: 0, left: 0 };
            const despawnConnection = flowFreeDespawning.get(connectionKey);
            const top = connection.top;
            const right = connection.right;
            const bottom = connection.bottom;
            const left = connection.left;

            if (despawnConnection) {
                classes.push('is-despawning');
            }

            if (flowFreeSpawning.has(connectionKey) && !despawnConnection) {
                classes.push('is-spawning');
            }

            return `
                <button
                    type="button"
                    class="${classes.join(' ')}"
                    data-flow-row="${rowIndex}"
                    data-flow-col="${colIndex}"
                    style="
                        --flow-color: ${(despawnConnection?.color || cell.color) || 'transparent'};
                        --flow-top: ${top};
                        --flow-right: ${right};
                        --flow-bottom: ${bottom};
                        --flow-left: ${left};
                    "
                ></button>
            `;
        }).join('')).join('');
    }

    function scheduleFlowFreeRender() {
        if (flowFreeRenderFrame !== null) {
            return;
        }

        flowFreeRenderFrame = window.requestAnimationFrame(() => {
            renderFlowFree();
        });
    }

    function buildFlowFreeConnectionMap(path, color) {
        const connectionMap = new Map();

        path.forEach((cell, index) => {
            const key = `${cell.row}-${cell.col}`;
            const connections = connectionMap.get(key) || { top: 0, right: 0, bottom: 0, left: 0, color };
            const previousCell = path[index - 1];
            const nextCell = path[index + 1];

            [previousCell, nextCell].forEach((linkedCell) => {
                if (!linkedCell) {
                    return;
                }

                if (linkedCell.row === cell.row - 1 && linkedCell.col === cell.col) {
                    connections.top = 1;
                } else if (linkedCell.row === cell.row + 1 && linkedCell.col === cell.col) {
                    connections.bottom = 1;
                } else if (linkedCell.row === cell.row && linkedCell.col === cell.col - 1) {
                    connections.left = 1;
                } else if (linkedCell.row === cell.row && linkedCell.col === cell.col + 1) {
                    connections.right = 1;
                }
            });

            connectionMap.set(key, connections);
        });

        return connectionMap;
    }

    function despawnFlowFreePath(color) {
        const path = flowFreePaths.get(color) || [];
        if (path.length <= 1) {
            return;
        }

        if (flowFreeDespawnTimer) {
            window.clearTimeout(flowFreeDespawnTimer);
            flowFreeDespawnTimer = null;
        }

        const despawnMap = buildFlowFreeConnectionMap(path, color);
        const startCell = path[0];
        despawnMap.delete(`${startCell.row}-${startCell.col}`);
        flowFreeDespawning = despawnMap;
        setFlowFreePath(color, [startCell]);
        scheduleFlowFreeRender();

        flowFreeDespawnTimer = window.setTimeout(() => {
            flowFreeDespawning = new Map();
            flowFreeDespawnTimer = null;
            scheduleFlowFreeRender();
        }, 220);
    }

    function initializeFlowFree() {
        closeGameOverModal();
        flowFreeLevel = generateFlowFreeLevel();
        flowFreeBoard.style.gridTemplateColumns = `repeat(${flowFreeLevel.size}, minmax(0, 1fr))`;
        flowFreeCells = Array.from({ length: flowFreeLevel.size }, () => (
            Array.from({ length: flowFreeLevel.size }, () => ({ color: null, isAnchor: false }))
        ));
        flowFreePaths = new Map();
        flowFreeCompleted = new Set();
        flowFreeMoves = 0;
        flowFreeActiveColor = null;
        flowFreePointerDown = false;
        flowFreeLastHoverKey = null;
        flowFreeSpawning = new Set();
        flowFreeSpawnTimers.forEach((timer) => window.clearTimeout(timer));
        flowFreeSpawnTimers = new Map();
        flowFreeDespawning = new Map();
        if (flowFreeDespawnTimer) {
            window.clearTimeout(flowFreeDespawnTimer);
            flowFreeDespawnTimer = null;
        }

        flowFreeLevel.pairs.forEach((pair) => {
            const startCell = flowFreeCells[pair.start.row][pair.start.col];
            const endCell = flowFreeCells[pair.end.row][pair.end.col];
            startCell.color = pair.color;
            endCell.color = pair.color;
            startCell.isAnchor = true;
            endCell.isAnchor = true;
            flowFreePaths.set(pair.color, [{ ...pair.start }]);
        });

        flowFreeHelpText.textContent = 'Relie chaque paire sans croiser les courants et couvre toutes les cases du plateau.';
        renderFlowFree();
    }

    function startFlowFreePath(row, col) {
        const cell = flowFreeCells[row][col];
        if (!cell?.color) {
            return;
        }

        const existingPath = flowFreePaths.get(cell.color) || [];
        const existingIndex = existingPath.findIndex((pathCell) => pathCell.row === row && pathCell.col === col);

        flowFreeMoves += 1;
        flowFreeActiveColor = cell.color;
        flowFreePointerDown = true;
        flowFreeCompleted.delete(cell.color);
        setFlowFreePath(
            cell.color,
            cell.isAnchor
                ? [{ row, col }]
                : existingIndex >= 0
                    ? existingPath.slice(0, existingIndex + 1)
                    : [{ row, col }]
        );
        flowFreeLastHoverKey = `${row}-${col}`;
        flowFreeHelpText.textContent = 'Trace maintenant le courant jusqu a la bouee jumelle.';
        scheduleFlowFreeRender();
    }

    function extendFlowFreePath(row, col) {
        if (!flowFreePointerDown || !flowFreeActiveColor) {
            return;
        }

        const path = flowFreePaths.get(flowFreeActiveColor) || [];
        const lastCell = path[path.length - 1];

        if (!lastCell) {
            return;
        }

        const distance = Math.abs(lastCell.row - row) + Math.abs(lastCell.col - col);
        if (distance !== 1) {
            return;
        }

        const targetCell = flowFreeCells[row][col];
        if (!targetCell) {
            return;
        }

        const hoverKey = `${row}-${col}`;
        if (flowFreeLastHoverKey === hoverKey) {
            return;
        }
        flowFreeLastHoverKey = hoverKey;

        const existingIndex = path.findIndex((cell) => cell.row === row && cell.col === col);
        if (existingIndex >= 0) {
            setFlowFreePath(flowFreeActiveColor, path.slice(0, existingIndex + 1));
            flowFreeCompleted.delete(flowFreeActiveColor);
            scheduleFlowFreeRender();
            return;
        }

        if (targetCell.color && targetCell.color !== flowFreeActiveColor) {
            return;
        }

        const pair = getFlowFreePairByColor(flowFreeActiveColor);
        if (!pair) {
            return;
        }

        const isOtherAnchor = targetCell.isAnchor
            && ((row === pair.start.row && col === pair.start.col) || (row === pair.end.row && col === pair.end.col));

        if (targetCell.isAnchor && !isOtherAnchor) {
            return;
        }

        const nextPath = [...path, { row, col }];
        setFlowFreePath(flowFreeActiveColor, nextPath);

        const startCell = nextPath[0];
        const reachedEnd = (startCell.row === pair.start.row && startCell.col === pair.start.col
            && row === pair.end.row && col === pair.end.col)
            || (startCell.row === pair.end.row && startCell.col === pair.end.col
            && row === pair.start.row && col === pair.start.col);

        if (reachedEnd) {
            flowFreeCompleted.add(flowFreeActiveColor);
            flowFreeHelpText.textContent = 'Un courant est ferme. Plus que quelques liaisons.';

            const allCellsFilled = flowFreeCells.every((rowCells) => rowCells.every((cell) => Boolean(cell.color)));
            if (flowFreeCompleted.size === flowFreeLevel.pairs.length && allCellsFilled) {
                flowFreeHelpText.textContent = 'Tous les courants sont relies. Le port est securise.';
                renderFlowFree();
                openGameOverModal('Courants relies', `Toutes les liaisons sont terminees en ${flowFreeMoves} tracés.`);
                flowFreePointerDown = false;
                flowFreeActiveColor = null;
                return;
            }
            flowFreeHelpText.textContent = allCellsFilled
                ? 'Toutes les cases sont remplies. Termine les dernieres liaisons.'
                : 'Un courant est ferme. Les cases libres doivent aussi etre couvertes.';
        } else {
            flowFreeCompleted.delete(flowFreeActiveColor);
        }

        scheduleFlowFreeRender();
    }

    function stopFlowFreePath() {
        const activeColor = flowFreeActiveColor;
        flowFreePointerDown = false;
        flowFreeActiveColor = null;
        flowFreeLastHoverKey = null;
        if (activeColor && !flowFreeCompleted.has(activeColor)) {
            despawnFlowFreePath(activeColor);
            return;
        }

        scheduleFlowFreeRender();
    }

    function updateMagicSortHud() {
        const solvedTubes = magicSortTubes.filter((tube) => (
            tube.length === 4 && tube.every((color) => color === tube[0])
        )).length;
        const targetTubes = new Set(magicSortTubes.flat().filter(Boolean)).size;

        magicSortSolvedDisplay.textContent = `${solvedTubes} / ${targetTubes}`;
        magicSortMovesDisplay.textContent = String(magicSortMoves);
    }

    function renderMagicSort() {
        updateMagicSortHud();
        magicSortBoard.innerHTML = magicSortTubes.map((tube, tubeIndex) => {
            const slots = Array.from({ length: 4 }, (_, slotIndex) => {
                const color = tube[slotIndex];
                const fill = color ? MAGIC_SORT_COLORS[color] : 'rgba(255, 255, 255, 0.06)';
                return `<span class="magicsort-layer" style="background: ${fill};"></span>`;
            }).join('');

            return `
                <div class="magicsort-tube${magicSortSelectedTube === tubeIndex ? ' is-selected' : ''}">
                    <button type="button" class="magicsort-tube-button" data-magic-sort-tube="${tubeIndex}">
                        ${slots}
                    </button>
                </div>
            `;
        }).join('');
    }

    function initializeMagicSort() {
        closeGameOverModal();
        magicSortTubes = generateMagicSortLevel();
        magicSortSelectedTube = null;
        magicSortMoves = 0;
        magicSortHelpText.textContent = 'Verse les couleurs d un recipient a l autre pour obtenir des tubes uniformes. Chaque partie melange les fioles differemment.';
        renderMagicSort();
    }

    function isMagicSortSolved() {
        return magicSortTubes.every((tube) => (
            tube.length === 0 || (tube.length === 4 && tube.every((color) => color === tube[0]))
        ));
    }

    function handleMagicSortTubeClick(index) {
        const sourceTube = magicSortTubes[index];

        if (magicSortSelectedTube === null) {
            if (!sourceTube.length) {
                return;
            }

            magicSortSelectedTube = index;
            magicSortHelpText.textContent = 'Choisis maintenant le tube de destination.';
            renderMagicSort();
            return;
        }

        if (magicSortSelectedTube === index) {
            magicSortSelectedTube = null;
            magicSortHelpText.textContent = 'Selection annulee.';
            renderMagicSort();
            return;
        }

        const fromTube = magicSortTubes[magicSortSelectedTube];
        const toTube = magicSortTubes[index];

        if (!fromTube.length || toTube.length === 4) {
            magicSortSelectedTube = null;
            renderMagicSort();
            return;
        }

        const movingColor = fromTube[fromTube.length - 1];
        const topTarget = toTube[toTube.length - 1];
        if (topTarget && topTarget !== movingColor) {
            magicSortHelpText.textContent = 'Les couleurs doivent correspondre pour verser.';
            magicSortSelectedTube = null;
            renderMagicSort();
            return;
        }

        let contiguousCount = 0;
        for (let cursor = fromTube.length - 1; cursor >= 0; cursor -= 1) {
            if (fromTube[cursor] !== movingColor) {
                break;
            }
            contiguousCount += 1;
        }

        const movableCount = Math.min(contiguousCount, 4 - toTube.length);
        if (!movableCount) {
            magicSortSelectedTube = null;
            renderMagicSort();
            return;
        }

        for (let step = 0; step < movableCount; step += 1) {
            toTube.push(fromTube.pop());
        }

        magicSortMoves += 1;
        magicSortSelectedTube = null;
        magicSortHelpText.textContent = 'Bien joue. Continue de trier les fioles.';
        renderMagicSort();

        if (isMagicSortSolved()) {
            magicSortHelpText.textContent = 'Toutes les fioles sont rangees.';
            openGameOverModal('Tri reussi', `Les couleurs sont rangees en ${magicSortMoves} coups.`);
        }
    }

    function updateMentalMathHud() {
        mentalMathScoreDisplay.textContent = String(mentalMathScore);
        mentalMathRoundDisplay.textContent = `${Math.min(mentalMathRound, MENTAL_MATH_TOTAL_ROUNDS)} / ${MENTAL_MATH_TOTAL_ROUNDS}`;
    }

    function generateMentalMathQuestion(round) {
        const difficulty = Math.min(4, Math.floor((round - 1) / 3));
        const operationRoll = Math.floor(Math.random() * 4);

        if (operationRoll === 0) {
            const a = 12 + Math.floor(Math.random() * (18 + (difficulty * 10)));
            const b = 4 + Math.floor(Math.random() * (14 + (difficulty * 8)));
            return { prompt: `${a} + ${b}`, answer: a + b };
        }

        if (operationRoll === 1) {
            const a = 30 + Math.floor(Math.random() * (25 + (difficulty * 12)));
            const b = 8 + Math.floor(Math.random() * (18 + (difficulty * 6)));
            return { prompt: `${a} - ${b}`, answer: a - b };
        }

        if (operationRoll === 2) {
            const a = 3 + Math.floor(Math.random() * (5 + difficulty));
            const b = 4 + Math.floor(Math.random() * (7 + difficulty));
            return { prompt: `${a} x ${b}`, answer: a * b };
        }

        const divisor = 2 + Math.floor(Math.random() * (5 + difficulty));
        const quotient = 3 + Math.floor(Math.random() * (6 + difficulty));
        return { prompt: `${divisor * quotient} / ${divisor}`, answer: quotient };
    }

    function renderMentalMathQuestion() {
        updateMentalMathHud();
        mentalMathQuestion.textContent = mentalMathCurrentQuestion?.prompt || '--';
        mentalMathAnswerInput.value = '';
        if (activeGameTab === 'mentalMath') {
            mentalMathAnswerInput.focus();
        }
    }

    function advanceMentalMathQuestion() {
        if (mentalMathRound > MENTAL_MATH_TOTAL_ROUNDS) {
            mentalMathHelpText.textContent = 'La traversee mentale est terminee.';
            openGameOverModal('Quiz termine', `Tu as obtenu ${mentalMathScore} / ${MENTAL_MATH_TOTAL_ROUNDS}.`);
            mentalMathRound = MENTAL_MATH_TOTAL_ROUNDS;
            updateMentalMathHud();
            return;
        }

        mentalMathCurrentQuestion = generateMentalMathQuestion(mentalMathRound);
        renderMentalMathQuestion();
    }

    function initializeMentalMath() {
        closeGameOverModal();
        mentalMathScore = 0;
        mentalMathRound = 1;
        mentalMathCurrentQuestion = null;
        mentalMathFeedback.textContent = '';
        mentalMathHelpText.textContent = 'Resolvez 10 calculs avant la fin de la traversee.';
        advanceMentalMathQuestion();
    }

    function submitMentalMathAnswer() {
        if (!mentalMathCurrentQuestion) {
            return;
        }

        const userAnswer = Number(mentalMathAnswerInput.value);
        if (Number.isNaN(userAnswer)) {
            mentalMathFeedback.textContent = 'Entre une reponse avant de valider.';
            return;
        }

        if (userAnswer === mentalMathCurrentQuestion.answer) {
            mentalMathScore += 1;
            mentalMathFeedback.textContent = 'Bonne reponse.';
            mentalMathHelpText.textContent = 'Le capitaine approuve ce calcul.';
        } else {
            mentalMathFeedback.textContent = `Presque. Il fallait ${mentalMathCurrentQuestion.answer}.`;
            mentalMathHelpText.textContent = 'On garde le cap, meme apres une erreur.';
        }

        mentalMathRound += 1;
        advanceMentalMathQuestion();
    }

    function getRandomCandyType() {
        return CANDY_CRUSH_TYPES[Math.floor(Math.random() * CANDY_CRUSH_TYPES.length)];
    }

    function updateCandyCrushHud() {
        candyCrushScoreDisplay.textContent = String(candyCrushScore);
        candyCrushMovesDisplay.textContent = String(candyCrushMoves);
    }

    function renderCandyCrush() {
        updateCandyCrushHud();
        candyCrushBoard.innerHTML = candyCrushGrid.map((row, rowIndex) => row.map((cell, colIndex) => `
            <button
                type="button"
                class="candycrush-cell${candyCrushSelectedCell?.row === rowIndex && candyCrushSelectedCell?.col === colIndex ? ' is-selected' : ''}"
                data-candy-row="${rowIndex}"
                data-candy-col="${colIndex}"
                data-candy-type="${cell}"
                style="--candy-fill: ${CANDY_CRUSH_COLORS[cell]}"
            ></button>
        `).join('')).join('');
    }

    async function animateCandyCrushFall(changedKeys = new Set()) {
        changedKeys.forEach((key) => {
            const [row, col] = key.split('-');
            const element = candyCrushBoard.querySelector(`[data-candy-row="${row}"][data-candy-col="${col}"]`);
            element?.classList.add('is-falling');
        });

        await waitMs(220);
    }

    function findCandyCrushMatches() {
        const matches = new Set();

        for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
            let streak = 1;

            for (let colIndex = 1; colIndex <= CANDY_CRUSH_SIZE; colIndex += 1) {
                const current = candyCrushGrid[rowIndex][colIndex];
                const previous = candyCrushGrid[rowIndex][colIndex - 1];

                if (current && current === previous) {
                    streak += 1;
                } else {
                    if (streak >= 3) {
                        for (let offset = 1; offset <= streak; offset += 1) {
                            matches.add(`${rowIndex}-${colIndex - offset}`);
                        }
                    }
                    streak = 1;
                }
            }
        }

        for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
            let streak = 1;

            for (let rowIndex = 1; rowIndex <= CANDY_CRUSH_SIZE; rowIndex += 1) {
                const current = candyCrushGrid[rowIndex]?.[colIndex];
                const previous = candyCrushGrid[rowIndex - 1]?.[colIndex];

                if (current && current === previous) {
                    streak += 1;
                } else {
                    if (streak >= 3) {
                        for (let offset = 1; offset <= streak; offset += 1) {
                            matches.add(`${rowIndex - offset}-${colIndex}`);
                        }
                    }
                    streak = 1;
                }
            }
        }

        return matches;
    }

    function collapseCandyCrushGrid() {
        const previousGrid = candyCrushGrid.map((row) => [...row]);
        const changedKeys = new Set();

        for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
            const compacted = [];

            for (let rowIndex = CANDY_CRUSH_SIZE - 1; rowIndex >= 0; rowIndex -= 1) {
                const cell = candyCrushGrid[rowIndex][colIndex];
                if (cell) {
                    compacted.push(cell);
                }
            }

            for (let rowIndex = CANDY_CRUSH_SIZE - 1; rowIndex >= 0; rowIndex -= 1) {
                candyCrushGrid[rowIndex][colIndex] = compacted[CANDY_CRUSH_SIZE - 1 - rowIndex] || null;
            }

            for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
                if (!candyCrushGrid[rowIndex][colIndex]) {
                    candyCrushGrid[rowIndex][colIndex] = getRandomCandyType();
                }
            }
        }

        for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
            for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
                if (candyCrushGrid[rowIndex][colIndex] !== previousGrid[rowIndex][colIndex]) {
                    changedKeys.add(`${rowIndex}-${colIndex}`);
                }
            }
        }

        return changedKeys;
    }

    function hasCandyCrushPossibleMove() {
        for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
            for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
                const directions = [
                    { row: 0, col: 1 },
                    { row: 1, col: 0 }
                ];

                for (const direction of directions) {
                    const nextRow = rowIndex + direction.row;
                    const nextCol = colIndex + direction.col;

                    if (nextRow >= CANDY_CRUSH_SIZE || nextCol >= CANDY_CRUSH_SIZE) {
                        continue;
                    }

                    swapCandyCells({ row: rowIndex, col: colIndex }, { row: nextRow, col: nextCol });
                    const hasMatch = findCandyCrushMatches().size > 0;
                    swapCandyCells({ row: rowIndex, col: colIndex }, { row: nextRow, col: nextCol });

                    if (hasMatch) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function shuffleCandyCrushBoard() {
        const candies = shuffleArray(candyCrushGrid.flat());
        let cursor = 0;

        for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
            for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
                candyCrushGrid[rowIndex][colIndex] = candies[cursor];
                cursor += 1;
            }
        }
    }

    function ensureCandyCrushPlayable() {
        let attempts = 0;

        while ((!hasCandyCrushPossibleMove() || findCandyCrushMatches().size > 0) && attempts < 20) {
            shuffleCandyCrushBoard();
            attempts += 1;
        }
    }

    function resolveCandyCrushBoard() {
        let chainCount = 0;

        while (true) {
            const matches = findCandyCrushMatches();
            if (!matches.size) {
                break;
            }

            chainCount += 1;
            candyCrushScore += matches.size * (10 * chainCount);
            matches.forEach((key) => {
                const [row, col] = key.split('-').map(Number);
                candyCrushGrid[row][col] = null;
            });
            collapseCandyCrushGrid();
        }
    }

    function initializeCandyCrush() {
        closeGameOverModal();
        candyCrushGrid = Array.from({ length: CANDY_CRUSH_SIZE }, () => Array(CANDY_CRUSH_SIZE).fill(null));

        for (let rowIndex = 0; rowIndex < CANDY_CRUSH_SIZE; rowIndex += 1) {
            for (let colIndex = 0; colIndex < CANDY_CRUSH_SIZE; colIndex += 1) {
                let nextCandy = getRandomCandyType();
                while (
                    (colIndex >= 2 && nextCandy === candyCrushGrid[rowIndex][colIndex - 1] && nextCandy === candyCrushGrid[rowIndex][colIndex - 2])
                    || (rowIndex >= 2 && nextCandy === candyCrushGrid[rowIndex - 1][colIndex] && nextCandy === candyCrushGrid[rowIndex - 2][colIndex])
                ) {
                    nextCandy = getRandomCandyType();
                }
                candyCrushGrid[rowIndex][colIndex] = nextCandy;
            }
        }

        candyCrushSelectedCell = null;
        candyCrushScore = 0;
        candyCrushMoves = CANDY_CRUSH_START_MOVES;
        candyCrushAnimating = false;
        candyCrushPointerStart = null;
        ensureCandyCrushPlayable();
        candyCrushHelpText.textContent = 'Fais glisser une piece vers une voisine pour former des alignements de 3 tresors ou plus.';
        renderCandyCrush();
    }

    function areCandyCellsAdjacent(firstCell, secondCell) {
        return Math.abs(firstCell.row - secondCell.row) + Math.abs(firstCell.col - secondCell.col) === 1;
    }

    function swapCandyCells(firstCell, secondCell) {
        const temp = candyCrushGrid[firstCell.row][firstCell.col];
        candyCrushGrid[firstCell.row][firstCell.col] = candyCrushGrid[secondCell.row][secondCell.col];
        candyCrushGrid[secondCell.row][secondCell.col] = temp;
    }

    async function animateCandyCrushSwap(firstCell, secondCell, revert = false) {
        const firstElement = candyCrushBoard.querySelector(`[data-candy-row="${firstCell.row}"][data-candy-col="${firstCell.col}"]`);
        const secondElement = candyCrushBoard.querySelector(`[data-candy-row="${secondCell.row}"][data-candy-col="${secondCell.col}"]`);
        if (!firstElement || !secondElement) {
            return;
        }

        const firstRect = firstElement.getBoundingClientRect();
        const secondRect = secondElement.getBoundingClientRect();
        const deltaX = secondRect.left - firstRect.left;
        const deltaY = secondRect.top - firstRect.top;

        firstElement.style.transition = 'transform 180ms ease';
        secondElement.style.transition = 'transform 180ms ease';
        firstElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        secondElement.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
        if (revert) {
            firstElement.classList.add('is-bouncing');
            secondElement.classList.add('is-bouncing');
        }

        await waitMs(190);
    }

    async function animateCandyCrushMatches(matches) {
        matches.forEach((key) => {
            const [row, col] = key.split('-');
            const element = candyCrushBoard.querySelector(`[data-candy-row="${row}"][data-candy-col="${col}"]`);
            if (element) {
                element.classList.add('is-crushing');
                element.insertAdjacentHTML('beforeend', `
                    <span class="candy-hit-particle candy-hit-particle-a" aria-hidden="true"></span>
                    <span class="candy-hit-particle candy-hit-particle-b" aria-hidden="true"></span>
                    <span class="candy-hit-particle candy-hit-particle-c" aria-hidden="true"></span>
                    <span class="candy-hit-particle candy-hit-particle-d" aria-hidden="true"></span>
                    <span class="candy-hit-particle candy-hit-particle-e" aria-hidden="true"></span>
                `);
            }
        });

        await waitMs(320);
    }

    async function resolveCandyCrushBoardAnimated() {
        let chainCount = 0;

        while (true) {
            const matches = findCandyCrushMatches();
            if (!matches.size) {
                break;
            }

            chainCount += 1;
            await animateCandyCrushMatches(matches);
            candyCrushScore += matches.size * (10 * chainCount);
            matches.forEach((key) => {
                const [row, col] = key.split('-').map(Number);
                candyCrushGrid[row][col] = null;
            });
            const changedKeys = collapseCandyCrushGrid();
            renderCandyCrush();
            await animateCandyCrushFall(changedKeys);
        }
    }

    async function tryCandyCrushSwap(firstCell, secondCell) {
        if (candyCrushAnimating || candyCrushMoves <= 0) {
            return;
        }

        if (!areCandyCellsAdjacent(firstCell, secondCell)) {
            candyCrushSelectedCell = secondCell;
            renderCandyCrush();
            return;
        }

        candyCrushAnimating = true;
        candyCrushSelectedCell = null;
        await animateCandyCrushSwap(firstCell, secondCell);
        swapCandyCells(firstCell, secondCell);
        renderCandyCrush();
        const matches = findCandyCrushMatches();

        if (!matches.size) {
            await animateCandyCrushSwap(secondCell, firstCell, true);
            swapCandyCells(firstCell, secondCell);
            renderCandyCrush();
            candyCrushHelpText.textContent = 'Aucun alignement. Essaie un autre glissement.';
            candyCrushAnimating = false;
            return;
        }

        candyCrushMoves -= 1;
        candyCrushHelpText.textContent = 'Belle combinaison. Les tresors s effondrent dans la cale.';
        renderCandyCrush();
        await resolveCandyCrushBoardAnimated();
        ensureCandyCrushPlayable();
        renderCandyCrush();
        candyCrushAnimating = false;

        if (candyCrushScore >= CANDY_CRUSH_TARGET_SCORE) {
            openGameOverModal('Cale videe', `Objectif atteint avec ${candyCrushScore} points.`);
            return;
        }

        if (candyCrushMoves <= 0) {
            openGameOverModal('Fin de reserve', `Plus de coups. Score final : ${candyCrushScore}.`);
        }
    }

    function updateHarborRunHud() {
        harborRunScoreDisplay.textContent = String(harborRunScore);
        harborRunBestDisplay.textContent = String(harborRunBestScore);
        harborRunStartButton.textContent = harborRunRunning ? 'En course' : 'Lancer la route';
    }

    function renderHarborRun() {
        const farOffset = (harborRunBackdropOffset * 0.22) % 180;
        const midOffset = (harborRunBackdropOffset * 0.42) % 210;
        const nearOffset = (harborRunBackdropOffset * 0.72) % 160;
        const foamOffset = (harborRunBackdropOffset * 0.95) % 140;
        const backdropMarkup = `
            <div class="harborrun-backdrop harborrun-backdrop-far" style="background-position: center ${farOffset}px;"></div>
            <div class="harborrun-backdrop harborrun-backdrop-mid" style="background-position: center ${midOffset}px;"></div>
            <div class="harborrun-waves harborrun-waves-near" style="background-position: center ${nearOffset}px;"></div>
            <div class="harborrun-foam" style="background-position: center ${foamOffset}px;"></div>
        `;
        const playerMarkup = `<div class="harborrun-player" style="left: ${HARBOR_RUN_LANES[harborRunLane]}%;"></div>`;
        const obstaclesMarkup = harborRunObstacles.map((obstacle) => `
            <div
                class="harborrun-obstacle type-${obstacle.type}"
                style="left: ${HARBOR_RUN_LANES[obstacle.lane]}%; top: ${obstacle.y}%;"
            ></div>
        `).join('');

        harborRunBoard.innerHTML = `${backdropMarkup}${playerMarkup}${obstaclesMarkup}`;
        updateHarborRunHud();
    }

    function stopHarborRun() {
        harborRunRunning = false;
        if (harborRunAnimationFrame) {
            window.cancelAnimationFrame(harborRunAnimationFrame);
            harborRunAnimationFrame = null;
        }
        harborRunLastFrame = 0;
        updateHarborRunHud();
    }

    function initializeHarborRun() {
        closeGameOverModal();
        stopHarborRun();
        harborRunLane = 1;
        harborRunSafeLane = 1;
        harborRunObstacles = [];
        harborRunScore = 0;
        harborRunSpawnTimer = 0;
        harborRunBackdropOffset = 0;
        harborRunStartButton.textContent = 'Lancer la route';
        harborRunHelpText.textContent = 'Guide ton navire entre navires, epaves et rochers avec plus de marge pour passer.';
        renderHarborRun();
    }

    function moveHarborRun(direction) {
        harborRunLane = Math.max(0, Math.min(HARBOR_RUN_LANES.length - 1, harborRunLane + direction));
        renderHarborRun();
    }

    function startHarborRun() {
        if (harborRunRunning) {
            return;
        }

        closeGameOverModal();
        initializeHarborRun();
        harborRunRunning = true;
        harborRunHelpText.textContent = 'Garde le cap. La mer s accelere peu a peu a mesure que tu avances.';
        updateHarborRunHud();
        harborRunAnimationFrame = window.requestAnimationFrame(runHarborRunFrame);
    }

    function runHarborRunFrame(timestamp) {
        if (!harborRunRunning) {
            return;
        }

        if (!harborRunLastFrame) {
            harborRunLastFrame = timestamp;
        }

        const deltaMs = timestamp - harborRunLastFrame;
        harborRunLastFrame = timestamp;
        harborRunSpawnTimer += deltaMs;

        if (harborRunSpawnTimer >= Math.max(560, 980 - (harborRunScore * 8))) {
            const hasRecentWave = harborRunObstacles.some((obstacle) => obstacle.y < 28);

            if (!hasRecentWave) {
                harborRunSpawnTimer = 0;
                const accessibleOpenLanes = [harborRunSafeLane - 1, harborRunSafeLane, harborRunSafeLane + 1]
                    .filter((lane) => lane >= 0 && lane < HARBOR_RUN_LANES.length);
                const nextOpenLane = accessibleOpenLanes[Math.floor(Math.random() * accessibleOpenLanes.length)];
                harborRunSafeLane = nextOpenLane;
                const blockedLanes = [0, 1, 2].filter((lane) => lane !== nextOpenLane);
                const nearestObstacleY = harborRunObstacles.reduce((nearest, obstacle) => (
                    obstacle.y > nearest ? obstacle.y : nearest
                ), -100);
                const canSpawnDouble = harborRunScore > 10 && nearestObstacleY > 42 && Math.random() < 0.18;
                const obstacleLanes = canSpawnDouble
                    ? blockedLanes
                    : [blockedLanes[Math.floor(Math.random() * blockedLanes.length)]];

                obstacleLanes.forEach((lane) => {
                    harborRunObstacles.push({
                        lane,
                        y: -18,
                        passed: false,
                        type: ['ship', 'wreck', 'rock'][Math.floor(Math.random() * 3)]
                    });
                });
            }
        }

        const speed = 28 + Math.min(54, harborRunScore * 1.45);
        harborRunBackdropOffset += (deltaMs / 1000) * speed * 5.6;
        harborRunObstacles.forEach((obstacle) => {
            obstacle.y += (deltaMs / 1000) * speed;
            if (!obstacle.passed && obstacle.y > 94) {
                obstacle.passed = true;
                harborRunScore += 1;
                if (harborRunScore > harborRunBestScore) {
                    harborRunBestScore = harborRunScore;
                    window.localStorage.setItem(HARBOR_RUN_BEST_KEY, String(harborRunBestScore));
                }
            }
        });

        harborRunObstacles = harborRunObstacles.filter((obstacle) => obstacle.y < 118);
        harborRunObstacles.sort((firstObstacle, secondObstacle) => firstObstacle.y - secondObstacle.y);

        const collided = harborRunObstacles.some((obstacle) => (
            obstacle.lane === harborRunLane
            && obstacle.y > 78
            && obstacle.y < 96
        ));

        if (collided) {
            stopHarborRun();
            harborRunHelpText.textContent = 'Collision dans le port.';
            renderHarborRun();
            openGameOverModal('Carambolage', `Distance parcourue : ${harborRunScore}.`);
            return;
        }

        renderHarborRun();
        harborRunAnimationFrame = window.requestAnimationFrame(runHarborRunFrame);
    }

    const STACKER_LAYER_HEIGHT = 26;
    const STACKER_BASE_BOTTOM = 68;

    function getStackerBottom(level) {
        return STACKER_BASE_BOTTOM + ((level - 1) * (STACKER_LAYER_HEIGHT - 1));
    }

    function getStackerPalette(level) {
        const palettes = [
            { left: '#d4a15d', right: '#8b5a2b' },
            { left: '#ca6b4a', right: '#7a3420' },
            { left: '#4ea9a1', right: '#1f5d59' },
            { left: '#d9b34f', right: '#8f6221' },
            { left: '#7f8fc8', right: '#475281' },
            { left: '#76a85a', right: '#44662e' }
        ];

        return palettes[level % palettes.length];
    }

    function getStackerCameraOffset() {
        return Math.max(0, getStackerBottom(Math.max(0, stackerScore)) - 180);
    }

    function updateStackerHud() {
        stackerScoreDisplay.textContent = String(stackerScore);
        stackerBestDisplay.textContent = String(stackerBestScore);
        stackerStartButton.textContent = stackerRunning ? 'Empiler' : 'Lancer la tour';
    }

    function renderStacker() {
        const cameraOffset = getStackerCameraOffset();
        const backdropOffset = Math.min(cameraOffset * 0.18, 48);
        const foregroundOffset = Math.min(cameraOffset * 0.28, 72);
        const layersMarkup = stackerLayers.map((layer) => `
            <div
                class="stacker-layer"
                style="
                    width: ${layer.width}%;
                    left: ${layer.left}%;
                    bottom: ${getStackerBottom(layer.level) - cameraOffset}px;
                    --stack-left: ${layer.colorLeft};
                    --stack-right: ${layer.colorRight};
                "
            ></div>
        `).join('');
        const fragmentsMarkup = stackerFragments.map((fragment) => `
            <div
                class="stacker-fragment"
                style="
                    width: ${fragment.width}%;
                    left: ${fragment.left}%;
                    bottom: ${fragment.bottom - cameraOffset}px;
                    --stack-fragment-x: ${fragment.offsetX || 0}px;
                    --stack-fragment-rotation: ${fragment.rotation || 0}deg;
                    --stack-left: ${fragment.colorLeft};
                    --stack-right: ${fragment.colorRight};
                "
            ></div>
        `).join('');
        const currentMarkup = stackerCurrentLayer ? `
            <div
                class="stacker-current"
                style="
                    width: ${stackerCurrentLayer.width}%;
                    left: ${stackerCurrentLayer.left}%;
                    bottom: ${getStackerBottom(stackerCurrentLayer.level) - cameraOffset}px;
                    --stack-left: ${stackerCurrentLayer.colorLeft};
                    --stack-right: ${stackerCurrentLayer.colorRight};
                "
            ></div>
        ` : '';

        stackerBoard.innerHTML = `
            <div class="stacker-cloud stacker-cloud-a"></div>
            <div class="stacker-cloud stacker-cloud-b"></div>
            <div class="stacker-backdrop stacker-backdrop-far" style="transform: translateY(${backdropOffset}px);"></div>
            <div class="stacker-backdrop stacker-backdrop-near" style="transform: translateY(${foregroundOffset}px);"></div>
            ${layersMarkup}
            ${fragmentsMarkup}
            ${currentMarkup}
            <div class="stacker-waterline" style="bottom: ${-cameraOffset}px;"></div>
        `;
        updateStackerHud();
    }

    function stopStacker() {
        stackerRunning = false;
        if (stackerAnimationFrame) {
            window.cancelAnimationFrame(stackerAnimationFrame);
            stackerAnimationFrame = null;
        }
        stackerLastFrame = 0;
        updateStackerHud();
    }

    function createNextStackerLayer(level, width, fromLeft = true) {
        const palette = getStackerPalette(level);
        return {
            level,
            width,
            left: fromLeft ? width / 2 : 100 - (width / 2),
            direction: fromLeft ? 1 : -1,
            speed: 34 + (level * 2),
            colorLeft: palette.left,
            colorRight: palette.right
        };
    }

    function initializeStacker() {
        closeGameOverModal();
        stopStacker();
        const basePalette = getStackerPalette(1);
        stackerLayers = [{
            level: 1,
            width: 72,
            left: 50,
            colorLeft: basePalette.left,
            colorRight: basePalette.right
        }];
        stackerFragments = [];
        stackerCurrentLayer = createNextStackerLayer(2, 72, true);
        stackerScore = 0;
        stackerHelpText.textContent = 'Clique ou appuie sur Espace au bon moment pour empiler les couches du phare.';
        renderStacker();
    }

    function runStackerFrame(timestamp) {
        if (!stackerRunning || !stackerCurrentLayer) {
            return;
        }

        if (!stackerLastFrame) {
            stackerLastFrame = timestamp;
        }

        const deltaMs = timestamp - stackerLastFrame;
        stackerLastFrame = timestamp;
        const delta = (deltaMs / 1000) * stackerCurrentLayer.speed;
        const minLeft = stackerCurrentLayer.width / 2;
        const maxLeft = 100 - (stackerCurrentLayer.width / 2);

        stackerFragments = stackerFragments
            .map((fragment) => ({
                ...fragment,
                velocityX: fragment.velocityX * 0.995,
                velocityY: fragment.velocityY + (deltaMs / 1000) * 180,
                offsetX: (fragment.offsetX || 0) + ((fragment.velocityX * deltaMs) / 1000),
                bottom: fragment.bottom - ((fragment.velocityY * deltaMs) / 1000),
                rotation: (fragment.rotation || 0) + (((fragment.spin || 0) * deltaMs) / 1000)
            }))
            .filter((fragment) => fragment.bottom > -140 && Math.abs(fragment.offsetX || 0) < 360);

        stackerCurrentLayer.left += delta * stackerCurrentLayer.direction;
        if (stackerCurrentLayer.left <= minLeft) {
            stackerCurrentLayer.left = minLeft;
            stackerCurrentLayer.direction = 1;
        } else if (stackerCurrentLayer.left >= maxLeft) {
            stackerCurrentLayer.left = maxLeft;
            stackerCurrentLayer.direction = -1;
        }

        renderStacker();
        stackerAnimationFrame = window.requestAnimationFrame(runStackerFrame);
    }

    function startStacker() {
        if (stackerRunning) {
            return;
        }

        closeGameOverModal();
        stackerRunning = true;
        stackerHelpText.textContent = 'Empile les couches sans perdre l alignement.';
        stackerStartButton.textContent = 'Empiler';
        updateStackerHud();
        stackerAnimationFrame = window.requestAnimationFrame(runStackerFrame);
    }

    function dropStackerLayer() {
        if (!stackerCurrentLayer) {
            return;
        }

        if (!stackerRunning) {
            startStacker();
            return;
        }

        const previousLayer = stackerLayers[stackerLayers.length - 1];
        const previousLeft = previousLayer.left - (previousLayer.width / 2);
        const previousRight = previousLayer.left + (previousLayer.width / 2);
        const currentLeft = stackerCurrentLayer.left - (stackerCurrentLayer.width / 2);
        const currentRight = stackerCurrentLayer.left + (stackerCurrentLayer.width / 2);
        const overlap = Math.min(previousRight, currentRight) - Math.max(previousLeft, currentLeft);
        const currentBottom = getStackerBottom(stackerCurrentLayer.level);

        if (overlap <= 0) {
            stackerFragments.push({
                width: stackerCurrentLayer.width,
                left: stackerCurrentLayer.left,
                bottom: currentBottom,
                offsetX: 0,
                velocityX: stackerCurrentLayer.direction * 96,
                velocityY: 36,
                rotation: 0,
                spin: stackerCurrentLayer.direction * 170,
                colorLeft: stackerCurrentLayer.colorLeft,
                colorRight: stackerCurrentLayer.colorRight
            });
            stackerCurrentLayer = null;
            stopStacker();
            stackerHelpText.textContent = 'La couche est tombee dans la baie.';
            renderStacker();
            openGameOverModal('Tour ecroulee', `Tu as empile ${stackerScore} etages.`);
            return;
        }

        const center = Math.max(previousLeft, currentLeft) + (overlap / 2);
        const nextLevel = stackerCurrentLayer.level;
        const trimmedWidth = stackerCurrentLayer.width - overlap;

        if (trimmedWidth > 0) {
            const trimmedOnLeft = currentLeft < previousLeft;
            const fragmentLeft = trimmedOnLeft
                ? currentLeft + (trimmedWidth / 2)
                : currentRight - (trimmedWidth / 2);

            stackerFragments.push({
                width: trimmedWidth,
                left: fragmentLeft,
                bottom: currentBottom,
                offsetX: 0,
                velocityX: trimmedOnLeft ? -118 : 118,
                velocityY: 28,
                rotation: 0,
                spin: trimmedOnLeft ? -150 : 150,
                colorLeft: stackerCurrentLayer.colorLeft,
                colorRight: stackerCurrentLayer.colorRight
            });
        }

        const lockedPalette = getStackerPalette(nextLevel);

        stackerLayers.push({
            level: nextLevel,
            width: overlap,
            left: center,
            colorLeft: lockedPalette.left,
            colorRight: lockedPalette.right
        });
        stackerScore = stackerLayers.length - 1;

        if (stackerScore > stackerBestScore) {
            stackerBestScore = stackerScore;
            window.localStorage.setItem(STACKER_BEST_KEY, String(stackerBestScore));
        }

        stackerCurrentLayer = createNextStackerLayer(nextLevel + 1, overlap, nextLevel % 2 === 1);
        stackerHelpText.textContent = overlap < previousLayer.width
            ? 'Oups, une partie est tombee. Continue de monter.'
            : 'Empilement parfait. La tour prend de la hauteur.';
        renderStacker();
    }

    function loadCoinClickerState() {
        try {
            const storedState = JSON.parse(window.localStorage.getItem(COIN_CLICKER_STORAGE_KEY) || 'null');

            if (!storedState) {
                return;
            }

            coinClickerState.coins = Number(storedState.coins) || 0;
            coinClickerState.clickPower = Number(storedState.clickPower) || 1;
            coinClickerState.multiplier = Math.max(1, Number(storedState.multiplier) || 1);
            coinClickerState.autoPower = Math.max(0, Number(storedState.autoPower) || 0);
            COIN_CLICKER_UPGRADES.forEach((upgrade) => {
                coinClickerState.upgrades[upgrade.id] = Number(storedState.upgrades?.[upgrade.id]) || 0;
            });
        } catch (error) {
            console.error('Impossible de relire Coin Clicker.', error);
        }
    }

    function saveCoinClickerState() {
        window.localStorage.setItem(COIN_CLICKER_STORAGE_KEY, JSON.stringify(coinClickerState));
    }

    function getCoinClickerUpgradeCost(upgrade) {
        return Math.round(upgrade.baseCost * (1.7 ** (coinClickerState.upgrades[upgrade.id] || 0)));
    }

    function getCoinClickerCoinsPerClick() {
        return coinClickerState.clickPower * coinClickerState.multiplier;
    }

    function getCoinClickerCoinsPerSecond() {
        return coinClickerState.autoPower * coinClickerState.multiplier;
    }

    function renderCoinClicker() {
        coinClickerScoreDisplay.textContent = Math.floor(coinClickerState.coins).toLocaleString('fr-FR');
        coinClickerPowerDisplay.textContent = getCoinClickerCoinsPerClick().toLocaleString('fr-FR', {
            minimumFractionDigits: getCoinClickerCoinsPerClick() % 1 === 0 ? 0 : 1,
            maximumFractionDigits: 1
        });
        coinClickerMultiplierDisplay.textContent = `x${coinClickerState.multiplier.toFixed(2)}`;
        coinClickerAutoDisplay.textContent = getCoinClickerCoinsPerSecond().toLocaleString('fr-FR', {
            minimumFractionDigits: getCoinClickerCoinsPerSecond() % 1 === 0 ? 0 : 1,
            maximumFractionDigits: 1
        });
        coinClickerShop.innerHTML = COIN_CLICKER_UPGRADES.map((upgrade) => {
            const cost = getCoinClickerUpgradeCost(upgrade);
            const level = coinClickerState.upgrades[upgrade.id] || 0;
            return `
                <button type="button" class="coinclicker-upgrade ${coinClickerState.coins < cost ? 'is-disabled' : ''}" data-coin-upgrade="${upgrade.id}">
                    <span class="coinclicker-upgrade-title">${upgrade.label}</span>
                    <strong class="coinclicker-upgrade-bonus">${upgrade.description}</strong>
                    <span class="coinclicker-upgrade-meta">Niveau ${level} · ${cost} pieces</span>
                </button>
            `;
        }).join('');
    }

    function startCoinClickerAutoLoop() {
        if (coinClickerAutoTimer) {
            return;
        }

        coinClickerLastAutoTick = performance.now();
        coinClickerAutoTimer = window.setInterval(() => {
            const now = performance.now();
            const deltaSeconds = (now - coinClickerLastAutoTick) / 1000;
            coinClickerLastAutoTick = now;
            const passiveGain = getCoinClickerCoinsPerSecond() * deltaSeconds;

            if (passiveGain <= 0) {
                return;
            }

            coinClickerState.coins += passiveGain;
            saveCoinClickerState();
            renderCoinClicker();
        }, 250);
    }

    function initializeCoinClicker(reset = false) {
        if (reset) {
            coinClickerState = {
                coins: 0,
                clickPower: 1,
                multiplier: 1,
                autoPower: 0,
                upgrades: Object.fromEntries(COIN_CLICKER_UPGRADES.map((upgrade) => [upgrade.id, 0]))
            };
            saveCoinClickerState();
            coinClickerHelpText.textContent = 'Nouvelle fortune lancee. Clique pour remplir la caisse, puis automatise ton butin.';
        } else {
            loadCoinClickerState();
        }

        coinClickerLastAutoTick = performance.now();
        renderCoinClicker();
    }

    function createChessPiece(type, color) {
        return { type, color };
    }

    function createInitialChessBoard() {
        const board = Array.from({ length: CHESS_SIZE }, () => Array.from({ length: CHESS_SIZE }, () => null));
        const backRank = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

        backRank.forEach((type, col) => {
            board[0][col] = createChessPiece(type, 'black');
            board[1][col] = createChessPiece('pawn', 'black');
            board[6][col] = createChessPiece('pawn', 'white');
            board[7][col] = createChessPiece(type, 'white');
        });

        return board;
    }

    function initializeChess() {
        if (chessAiTimeout) {
            window.clearTimeout(chessAiTimeout);
            chessAiTimeout = null;
        }
        chessState = {
            board: createInitialChessBoard(),
            turn: 'white',
            winner: null
        };
        chessSelectedSquare = null;
        renderChess();
    }

    function isChessAiTurn() {
        return chessMode === 'solo' && chessState && !chessState.winner && chessState.turn === 'black';
    }

    function isInsideGameGrid(row, col, size = 8) {
        return row >= 0 && row < size && col >= 0 && col < size;
    }

    function getChessMoves(row, col) {
        const piece = chessState?.board[row][col];

        if (!piece || piece.color !== chessState.turn || chessState.winner) {
            return [];
        }

        const moves = [];
        const addMove = (nextRow, nextCol) => {
            if (!isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
                return;
            }

            const target = chessState.board[nextRow][nextCol];
            if (!target || target.color !== piece.color) {
                moves.push({ row: nextRow, col: nextCol });
            }
        };
        const addSlideMoves = (directions) => {
            directions.forEach(([rowStep, colStep]) => {
                let nextRow = row + rowStep;
                let nextCol = col + colStep;

                while (isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
                    const target = chessState.board[nextRow][nextCol];

                    if (!target) {
                        moves.push({ row: nextRow, col: nextCol });
                    } else {
                        if (target.color !== piece.color) {
                            moves.push({ row: nextRow, col: nextCol });
                        }
                        break;
                    }

                    nextRow += rowStep;
                    nextCol += colStep;
                }
            });
        };

        if (piece.type === 'pawn') {
            const direction = piece.color === 'white' ? -1 : 1;
            if (isInsideGameGrid(row + direction, col, CHESS_SIZE) && !chessState.board[row + direction][col]) {
                moves.push({ row: row + direction, col });
                const doubleRow = row + direction * 2;
                const startRow = piece.color === 'white' ? 6 : 1;
                if (row === startRow && !chessState.board[doubleRow][col]) {
                    moves.push({ row: doubleRow, col });
                }
            }

            [-1, 1].forEach((deltaCol) => {
                const attackRow = row + direction;
                const attackCol = col + deltaCol;
                if (!isInsideGameGrid(attackRow, attackCol, CHESS_SIZE)) {
                    return;
                }
                const target = chessState.board[attackRow][attackCol];
                if (target && target.color !== piece.color) {
                    moves.push({ row: attackRow, col: attackCol });
                }
            });
        }

        if (piece.type === 'rook') {
            addSlideMoves([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        }

        if (piece.type === 'bishop') {
            addSlideMoves([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
        }

        if (piece.type === 'queen') {
            addSlideMoves([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
        }

        if (piece.type === 'knight') {
            [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([rowStep, colStep]) => addMove(row + rowStep, col + colStep));
        }

        if (piece.type === 'king') {
            [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([rowStep, colStep]) => addMove(row + rowStep, col + colStep));
        }

        return moves;
    }

    function renderChess() {
        const legalMoves = chessSelectedSquare ? getChessMoves(chessSelectedSquare.row, chessSelectedSquare.col) : [];
        chessTurnDisplay.textContent = chessState.turn === 'white'
            ? (chessMode === 'solo' ? 'Toi' : 'Blancs')
            : (chessMode === 'solo' ? 'IA' : 'Noirs');
        chessStatusDisplay.textContent = chessState.winner
            ? `${chessState.winner === 'white' ? (chessMode === 'solo' ? 'Toi' : 'Blancs') : (chessMode === 'solo' ? 'IA' : 'Noirs')} gagnent`
            : (chessMode === 'solo' && chessState.turn === 'black' ? 'IA joue' : 'En cours');
        chessHelpText.textContent = chessMode === 'solo'
            ? 'Mode 1 joueur: blancs contre IA. Promotion en reine, sans roque.'
            : 'Mode 2 joueurs: blancs et noirs en tour par tour. Promotion en reine, sans roque.';
        chessModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.chessMode === chessMode);
        });
        chessBoard.innerHTML = chessState.board.map((rowItems, row) => rowItems.map((piece, col) => {
            const dark = (row + col) % 2 === 1;
            const selected = chessSelectedSquare?.row === row && chessSelectedSquare?.col === col;
            const playable = legalMoves.some((move) => move.row === row && move.col === col);
            const rankLabel = col === 0 ? String(CHESS_SIZE - row) : '';
            const fileLabel = row === CHESS_SIZE - 1 ? String.fromCharCode(97 + col) : '';
            return `
                <button
                    type="button"
                    class="chess-cell ${dark ? 'is-dark' : 'is-light'} ${selected ? 'is-selected' : ''} ${playable ? 'is-move' : ''}"
                    data-chess-cell="${row}-${col}"
                >
                    ${rankLabel ? `<span class="chess-coordinate chess-coordinate-rank">${rankLabel}</span>` : ''}
                    ${fileLabel ? `<span class="chess-coordinate chess-coordinate-file">${fileLabel}</span>` : ''}
                    ${piece ? `<span class="chess-piece">${CHESS_PIECES[piece.type][piece.color]}</span>` : ''}
                </button>
            `;
        }).join('')).join('');
    }

    function handleChessCellClick(row, col) {
        if (chessState.winner || isChessAiTurn()) {
            return;
        }

        const piece = chessState.board[row][col];
        if (piece && piece.color === chessState.turn) {
            chessSelectedSquare = { row, col };
            renderChess();
            return;
        }

        if (!chessSelectedSquare) {
            return;
        }

        const move = getChessMoves(chessSelectedSquare.row, chessSelectedSquare.col).find((candidate) => candidate.row === row && candidate.col === col);
        if (!move) {
            chessSelectedSquare = null;
            renderChess();
            return;
        }

        applyChessMove(chessSelectedSquare.row, chessSelectedSquare.col, row, col);
    }

    function applyChessMove(fromRow, fromCol, toRow, toCol) {
        const movingPiece = chessState.board[fromRow][fromCol];
        if (!movingPiece || movingPiece.color !== chessState.turn || chessState.winner) {
            return false;
        }

        const legalMove = getChessMoves(fromRow, fromCol).find((candidate) => candidate.row === toRow && candidate.col === toCol);
        if (!legalMove) {
            return false;
        }

        const nextPiece = { ...movingPiece };
        const capturedPiece = chessState.board[toRow][toCol];
        chessState.board[toRow][toCol] = nextPiece;
        chessState.board[fromRow][fromCol] = null;

        if (nextPiece.type === 'pawn' && (toRow === 0 || toRow === CHESS_SIZE - 1)) {
            chessState.board[toRow][toCol] = createChessPiece('queen', nextPiece.color);
        }

        chessSelectedSquare = null;

        if (capturedPiece?.type === 'king') {
            chessState.winner = nextPiece.color;
        } else {
            chessState.turn = chessState.turn === 'white' ? 'black' : 'white';
            if (!getChessAllMoves(chessState.turn).length) {
                chessState.winner = nextPiece.color;
            }
        }

        renderChess();
        maybePlayChessAi();
        return true;
    }

    function getChessAllMoves(color) {
        const moves = [];

        for (let row = 0; row < CHESS_SIZE; row += 1) {
            for (let col = 0; col < CHESS_SIZE; col += 1) {
                const piece = chessState.board[row][col];
                if (!piece || piece.color !== color) {
                    continue;
                }

                const legalMoves = getChessMoves(row, col);
                legalMoves.forEach((move) => {
                    moves.push({
                        fromRow: row,
                        fromCol: col,
                        toRow: move.row,
                        toCol: move.col,
                        piece,
                        target: chessState.board[move.row][move.col]
                    });
                });
            }
        }

        return moves;
    }

    function maybePlayChessAi() {
        if (!isChessAiTurn()) {
            return;
        }

        if (chessAiTimeout) {
            window.clearTimeout(chessAiTimeout);
        }

        chessAiTimeout = window.setTimeout(() => {
            chessAiTimeout = null;

            if (!isChessAiTurn()) {
                return;
            }

            const pieceValues = {
                pawn: 1,
                knight: 3,
                bishop: 3,
                rook: 5,
                queen: 9,
                king: 100
            };

            const moves = getChessAllMoves('black');
            if (!moves.length) {
                chessState.winner = 'white';
                renderChess();
                return;
            }

            let bestScore = -Infinity;
            let bestMoves = [];

            moves.forEach((move) => {
                let score = Math.random() * 0.3;

                if (move.target) {
                    score += (pieceValues[move.target.type] || 0) * 10;
                }
                if (move.toRow === CHESS_SIZE - 1 || move.toRow === 0) {
                    score += move.piece.type === 'pawn' ? 4 : 0;
                }
                if (move.piece.type === 'pawn') {
                    score += move.toRow * 0.35;
                }
                if (move.toCol >= 2 && move.toCol <= 5 && move.toRow >= 2 && move.toRow <= 5) {
                    score += 1.5;
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [move];
                } else if (Math.abs(score - bestScore) < 0.001) {
                    bestMoves.push(move);
                }
            });

            const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
            applyChessMove(selectedMove.fromRow, selectedMove.fromCol, selectedMove.toRow, selectedMove.toCol);
        }, 420);
    }

    function setChessMode(nextMode) {
        if (!nextMode || nextMode === chessMode) {
            return;
        }

        chessMode = nextMode;
        initializeChess();
    }

    function createInitialCheckersBoard() {
        const board = Array.from({ length: CHECKERS_SIZE }, () => Array.from({ length: CHECKERS_SIZE }, () => null));

        for (let row = 0; row < CHECKERS_SIZE; row += 1) {
            for (let col = 0; col < CHECKERS_SIZE; col += 1) {
                if ((row + col) % 2 === 0) {
                    continue;
                }
                if (row < 3) {
                    board[row][col] = { color: 'black', king: false };
                } else if (row > 4) {
                    board[row][col] = { color: 'red', king: false };
                }
            }
        }

        return board;
    }

    function initializeCheckers() {
        if (checkersAiTimeout) {
            window.clearTimeout(checkersAiTimeout);
            checkersAiTimeout = null;
        }
        checkersState = {
            board: createInitialCheckersBoard(),
            turn: 'red',
            winner: null
        };
        checkersSelectedSquare = null;
        renderCheckers();
    }

    function isCheckersAiTurn() {
        return checkersMode === 'solo' && checkersState && !checkersState.winner && checkersState.turn === 'black';
    }

    function getCheckersMoves(row, col) {
        const piece = checkersState?.board[row][col];

        if (!piece || piece.color !== checkersState.turn || checkersState.winner) {
            return [];
        }

        const directions = piece.king ? [...CHECKERS_DIRECTIONS.red, ...CHECKERS_DIRECTIONS.black] : CHECKERS_DIRECTIONS[piece.color];
        const moves = [];

        directions.forEach(([rowStep, colStep]) => {
            const nextRow = row + rowStep;
            const nextCol = col + colStep;
            if (!isInsideGameGrid(nextRow, nextCol, CHECKERS_SIZE)) {
                return;
            }

            const target = checkersState.board[nextRow][nextCol];
            if (!target) {
                moves.push({ row: nextRow, col: nextCol, capture: null });
                return;
            }

            if (target.color === piece.color) {
                return;
            }

            const jumpRow = nextRow + rowStep;
            const jumpCol = nextCol + colStep;
            if (isInsideGameGrid(jumpRow, jumpCol, CHECKERS_SIZE) && !checkersState.board[jumpRow][jumpCol]) {
                moves.push({ row: jumpRow, col: jumpCol, capture: { row: nextRow, col: nextCol } });
            }
        });

        return moves;
    }

    function renderCheckers() {
        const legalMoves = checkersSelectedSquare ? getCheckersMoves(checkersSelectedSquare.row, checkersSelectedSquare.col) : [];
        const blackCount = checkersState.board.flat().filter((piece) => piece?.color === 'black').length;
        const redCount = checkersState.board.flat().filter((piece) => piece?.color === 'red').length;
        checkersTurnDisplay.textContent = checkersState.winner
            ? `${checkersState.winner === 'red' ? (checkersMode === 'solo' ? 'Toi' : 'Rouges') : (checkersMode === 'solo' ? 'IA' : 'Noirs')} gagnent`
            : (checkersState.turn === 'red' ? (checkersMode === 'solo' ? 'Toi' : 'Rouges') : (checkersMode === 'solo' ? 'IA' : 'Noirs'));
        checkersCountDisplay.textContent = `${blackCount}/${redCount}`;
        checkersHelpText.textContent = checkersMode === 'solo'
            ? 'Mode 1 joueur: rouges contre IA. Roi a la promotion.'
            : 'Mode 2 joueurs: rouges et noirs en tour par tour. Roi a la promotion.';
        checkersModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.checkersMode === checkersMode);
        });
        checkersBoard.innerHTML = checkersState.board.map((rowItems, row) => rowItems.map((piece, col) => {
            const dark = (row + col) % 2 === 1;
            const selected = checkersSelectedSquare?.row === row && checkersSelectedSquare?.col === col;
            const playable = legalMoves.some((move) => move.row === row && move.col === col);
            return `
                <button type="button" class="checkers-cell ${dark ? 'is-dark' : 'is-light'} ${selected ? 'is-selected' : ''} ${playable ? 'is-move' : ''}" data-checkers-cell="${row}-${col}">
                    ${piece ? `<span class="checkers-piece ${piece.color === 'red' ? 'is-red' : 'is-black'} ${piece.king ? 'is-king' : ''}"></span>` : ''}
                </button>
            `;
        }).join('')).join('');
    }

    function handleCheckersCellClick(row, col) {
        if (checkersState.winner || isCheckersAiTurn()) {
            return;
        }

        const piece = checkersState.board[row][col];
        if (piece && piece.color === checkersState.turn) {
            checkersSelectedSquare = { row, col };
            renderCheckers();
            return;
        }

        if (!checkersSelectedSquare) {
            return;
        }

        const move = getCheckersMoves(checkersSelectedSquare.row, checkersSelectedSquare.col).find((candidate) => candidate.row === row && candidate.col === col);
        if (!move) {
            checkersSelectedSquare = null;
            renderCheckers();
            return;
        }

        applyCheckersMove(checkersSelectedSquare.row, checkersSelectedSquare.col, row, col);
    }

    function applyCheckersMove(fromRow, fromCol, toRow, toCol) {
        const movingPiece = checkersState.board[fromRow][fromCol];
        if (!movingPiece || movingPiece.color !== checkersState.turn || checkersState.winner) {
            return false;
        }

        const move = getCheckersMoves(fromRow, fromCol).find((candidate) => candidate.row === toRow && candidate.col === toCol);
        if (!move) {
            return false;
        }

        const nextPiece = { ...movingPiece };
        checkersState.board[fromRow][fromCol] = null;
        checkersState.board[toRow][toCol] = nextPiece;

        if (move.capture) {
            checkersState.board[move.capture.row][move.capture.col] = null;
        }

        if ((nextPiece.color === 'red' && toRow === 0) || (nextPiece.color === 'black' && toRow === CHECKERS_SIZE - 1)) {
            nextPiece.king = true;
        }

        const redCount = checkersState.board.flat().filter((item) => item?.color === 'red').length;
        const blackCount = checkersState.board.flat().filter((item) => item?.color === 'black').length;

        if (!redCount || !blackCount) {
            checkersState.winner = redCount ? 'red' : 'black';
        } else {
            checkersState.turn = checkersState.turn === 'red' ? 'black' : 'red';
            if (!getCheckersAllMoves(checkersState.turn).length) {
                checkersState.winner = nextPiece.color;
            }
        }

        checkersSelectedSquare = null;
        renderCheckers();
        maybePlayCheckersAi();
        return true;
    }

    function getCheckersAllMoves(color) {
        const moves = [];

        for (let row = 0; row < CHECKERS_SIZE; row += 1) {
            for (let col = 0; col < CHECKERS_SIZE; col += 1) {
                const piece = checkersState.board[row][col];
                if (!piece || piece.color !== color) {
                    continue;
                }

                getCheckersMoves(row, col).forEach((move) => {
                    moves.push({
                        fromRow: row,
                        fromCol: col,
                        ...move,
                        piece
                    });
                });
            }
        }

        return moves;
    }

    function maybePlayCheckersAi() {
        if (!isCheckersAiTurn()) {
            return;
        }

        if (checkersAiTimeout) {
            window.clearTimeout(checkersAiTimeout);
        }

        checkersAiTimeout = window.setTimeout(() => {
            checkersAiTimeout = null;

            if (!isCheckersAiTurn()) {
                return;
            }

            const moves = getCheckersAllMoves('black');
            if (!moves.length) {
                checkersState.winner = 'red';
                renderCheckers();
                return;
            }

            let bestScore = -Infinity;
            let bestMoves = [];

            moves.forEach((move) => {
                let score = Math.random() * 0.3;
                if (move.capture) {
                    score += 10;
                }
                if (!move.piece.king && move.row === CHECKERS_SIZE - 1) {
                    score += 6;
                }
                score += move.row * 0.25;
                if (move.col >= 2 && move.col <= 5) {
                    score += 0.6;
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [move];
                } else if (Math.abs(score - bestScore) < 0.001) {
                    bestMoves.push(move);
                }
            });

            const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
            applyCheckersMove(selectedMove.fromRow, selectedMove.fromCol, selectedMove.row, selectedMove.col);
        }, 420);
    }

    function setCheckersMode(nextMode) {
        if (!nextMode || nextMode === checkersMode) {
            return;
        }

        checkersMode = nextMode;
        initializeCheckers();
    }

    function renderAirHockey() {
        if (!airHockeyState) {
            return;
        }

        airHockeyLeftScoreDisplay.textContent = String(airHockeyState.leftScore);
        airHockeyRightScoreDisplay.textContent = String(airHockeyState.rightScore);
        airHockeyLeftPaddle.style.transform = `translate(${airHockeyState.left.x - airHockeyState.left.radius}px, ${airHockeyState.left.y - airHockeyState.left.radius}px)`;
        airHockeyRightPaddle.style.transform = `translate(${airHockeyState.right.x - airHockeyState.right.radius}px, ${airHockeyState.right.y - airHockeyState.right.radius}px)`;
        airHockeyPuck.style.transform = `translate(${airHockeyState.puck.x - airHockeyState.puck.radius}px, ${airHockeyState.puck.y - airHockeyState.puck.radius}px)`;
    }

    function getAirHockeyDimensions() {
        return {
            width: airHockeyBoard?.clientWidth || 720,
            height: airHockeyBoard?.clientHeight || 360
        };
    }

    function getAirHockeyGoalBounds() {
        const { height } = getAirHockeyDimensions();
        const goalHeight = height * 0.48;
        const top = (height - goalHeight) / 2;

        return {
            top,
            bottom: top + goalHeight
        };
    }

    function clampAirHockeySpeed() {
        const puck = airHockeyState?.puck;

        if (!puck) {
            return;
        }

        const speed = Math.hypot(puck.vx, puck.vy);
        const maxSpeed = 520;

        if (speed <= maxSpeed || !speed) {
            return;
        }

        const scale = maxSpeed / speed;
        puck.vx *= scale;
        puck.vy *= scale;
    }

    function hideAirHockeyCountdown() {
        if (airHockeyCountdownTimer) {
            window.clearTimeout(airHockeyCountdownTimer);
            airHockeyCountdownTimer = null;
        }

        if (airHockeyCountdownCompleteTimer) {
            window.clearTimeout(airHockeyCountdownCompleteTimer);
            airHockeyCountdownCompleteTimer = null;
        }

        airHockeyCountdownActive = false;

        if (!airHockeyCountdown) {
            return;
        }

        airHockeyCountdown.textContent = '';
        airHockeyCountdown.classList.add('hidden');
        airHockeyCountdown.setAttribute('aria-hidden', 'true');
    }

    function showAirHockeyCountdown(label) {
        if (!airHockeyCountdown) {
            return;
        }

        airHockeyCountdown.textContent = label;
        airHockeyCountdown.classList.remove('hidden');
        airHockeyCountdown.setAttribute('aria-hidden', 'false');
    }

    function startAirHockeyCountdown(onComplete) {
        hideAirHockeyCountdown();
        airHockeyCountdownActive = true;

        const steps = ['3', '2', '1', 'GO'];
        let stepIndex = 0;

        const runStep = () => {
            const currentLabel = steps[stepIndex];

            if (currentLabel === undefined) {
                airHockeyCountdownCompleteTimer = window.setTimeout(() => {
                    hideAirHockeyCountdown();
                    onComplete?.();
                }, 260);
                return;
            }

            showAirHockeyCountdown(currentLabel);
            stepIndex += 1;
            airHockeyCountdownTimer = window.setTimeout(runStep, 620);
        };

        runStep();
    }

    function positionAirHockeyPuck(servingSide = Math.random() > 0.5 ? 'left' : 'right') {
        const { width, height } = getAirHockeyDimensions();
        const spawnX = servingSide === 'left' ? width * 0.25 : width * 0.75;

        airHockeyState.servingSide = servingSide;
        airHockeyState.running = false;
        airHockeyState.puck.x = spawnX;
        airHockeyState.puck.y = height * 0.5;
        airHockeyState.puck.vx = 0;
        airHockeyState.puck.vy = 0;
    }

    function initializeAirHockey(resetScores = true) {
        const { width, height } = getAirHockeyDimensions();
        airHockeyState = {
            leftScore: resetScores ? 0 : airHockeyState?.leftScore || 0,
            rightScore: resetScores ? 0 : airHockeyState?.rightScore || 0,
            running: false,
            left: { x: width * 0.16, y: height * 0.5, radius: 27, vx: 0, vy: 0 },
            right: { x: width * 0.84, y: height * 0.5, radius: 27, vx: 0, vy: 0 },
            puck: { x: width * 0.5, y: height * 0.5, vx: 0, vy: 0, radius: 22 },
            servingSide: 'left'
        };
        hideAirHockeyCountdown();
        positionAirHockeyPuck();
        airHockeyHelpText.textContent = 'La balle attend dans un camp. Clique sur Lancer pour engager.';
        renderAirHockey();

        if (!airHockeyAnimationFrame) {
            airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
        }
    }

    function launchAirHockeyPuck() {
        if (airHockeyCountdownActive) {
            return;
        }

        airHockeyState.puck.vx = 0;
        airHockeyState.puck.vy = 0;
        airHockeyState.running = false;
        airHockeyHelpText.textContent = 'Preparation de l engagement...';
        startAirHockeyCountdown(() => {
            airHockeyState.running = true;
            airHockeyHelpText.textContent = airHockeyState.servingSide === 'left'
                ? 'Engagement a gauche. Va toucher la balle pour lancer l action.'
                : 'Engagement a droite. Va toucher la balle pour lancer l action.';
        });
    }

    function handleAirHockeyPoint(side) {
        airHockeyState[side === 'left' ? 'leftScore' : 'rightScore'] += 1;
        if (airHockeyState.leftScore >= AIR_HOCKEY_GOAL_SCORE || airHockeyState.rightScore >= AIR_HOCKEY_GOAL_SCORE) {
            airHockeyHelpText.textContent = `${airHockeyState.leftScore > airHockeyState.rightScore ? 'Le joueur gauche' : 'Le joueur droit'} gagne.`;
            initializeAirHockey(false);
            return;
        }

        initializeAirHockey(false);
        positionAirHockeyPuck(side === 'left' ? 'right' : 'left');
        airHockeyHelpText.textContent = 'But marque. Nouvel engagement en preparation...';
        startAirHockeyCountdown(() => {
            airHockeyState.running = true;
            airHockeyHelpText.textContent = airHockeyState.servingSide === 'left'
                ? 'Engagement a gauche. Va toucher la balle pour lancer l action.'
                : 'Engagement a droite. Va toucher la balle pour lancer l action.';
        });
    }

    function updateAirHockey(timestamp) {
        if (!airHockeyState) {
            return;
        }
        const { width, height } = getAirHockeyDimensions();

        if (!airHockeyLastFrame) {
            airHockeyLastFrame = timestamp;
        }

        const delta = Math.min(0.032, (timestamp - airHockeyLastFrame) / 1000);
        airHockeyLastFrame = timestamp;
        const airHockeyControlsLocked = airHockeyCountdownActive || !airHockeyState.running;

        const movePaddle = (paddle, up, down, left, right) => {
            if (airHockeyControlsLocked) {
                paddle.vx = 0;
                paddle.vy = 0;
                return;
            }

            const speed = 280;
            const previousX = paddle.x;
            const previousY = paddle.y;
            let moveX = ((airHockeyKeys.has(right) ? 1 : 0) - (airHockeyKeys.has(left) ? 1 : 0));
            let moveY = ((airHockeyKeys.has(down) ? 1 : 0) - (airHockeyKeys.has(up) ? 1 : 0));
            const magnitude = Math.hypot(moveX, moveY);

            if (magnitude > 1) {
                moveX /= magnitude;
                moveY /= magnitude;
            }

            paddle.x += moveX * speed * delta;
            paddle.y += moveY * speed * delta;
            paddle.y = Math.max(paddle.radius, Math.min(height - paddle.radius, paddle.y));
            paddle.vx = delta ? (paddle.x - previousX) / delta : 0;
            paddle.vy = delta ? (paddle.y - previousY) / delta : 0;
        };

        movePaddle(airHockeyState.left, 'z', 's', 'q', 'd');
        airHockeyState.left.x = Math.max(airHockeyState.left.radius, Math.min((width * 0.5) - 30 - airHockeyState.left.radius, airHockeyState.left.x));
        airHockeyState.left.vx = delta ? Math.max(-280, Math.min(280, airHockeyState.left.vx)) : 0;
        airHockeyState.left.vy = delta ? Math.max(-280, Math.min(280, airHockeyState.left.vy)) : 0;

        if (airHockeyMode === 'duo') {
            movePaddle(airHockeyState.right, 'arrowup', 'arrowdown', 'arrowleft', 'arrowright');
        } else if (!airHockeyControlsLocked) {
            const previousX = airHockeyState.right.x;
            const previousY = airHockeyState.right.y;
            const targetX = airHockeyState.puck.x > (width * 0.5) ? airHockeyState.puck.x : width * 0.84;
            airHockeyState.right.x += Math.max(-180 * delta, Math.min(180 * delta, targetX - airHockeyState.right.x));
            airHockeyState.right.y += Math.max(-200 * delta, Math.min(200 * delta, airHockeyState.puck.y - airHockeyState.right.y));
            airHockeyState.right.y = Math.max(airHockeyState.right.radius, Math.min(height - airHockeyState.right.radius, airHockeyState.right.y));
            airHockeyState.right.vx = delta ? (airHockeyState.right.x - previousX) / delta : 0;
            airHockeyState.right.vy = delta ? (airHockeyState.right.y - previousY) / delta : 0;
        } else {
            airHockeyState.right.vx = 0;
            airHockeyState.right.vy = 0;
        }
        airHockeyState.right.x = Math.max((width * 0.5) + 30 + airHockeyState.right.radius, Math.min(width - airHockeyState.right.radius, airHockeyState.right.x));

        if (airHockeyState.running && !airHockeyCountdownActive) {

            const puck = airHockeyState.puck;
            puck.x += puck.vx * delta;
            puck.y += puck.vy * delta;
            puck.vx *= 0.996;
            puck.vy *= 0.996;
            const goalBounds = getAirHockeyGoalBounds();

            if (puck.y <= puck.radius || puck.y >= height - puck.radius) {
                puck.vy *= -1;
                puck.y = Math.max(puck.radius, Math.min(height - puck.radius, puck.y));
            }

            const puckInGoalOpening = puck.y >= goalBounds.top + puck.radius && puck.y <= goalBounds.bottom - puck.radius;

            if (puck.x <= puck.radius) {
                if (puckInGoalOpening) {
                    handleAirHockeyPoint('right');
                    renderAirHockey();
                    airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
                    return;
                }

                puck.x = puck.radius;
                puck.vx = Math.abs(puck.vx);
            }

            if (puck.x >= width - puck.radius) {
                if (puckInGoalOpening) {
                    handleAirHockeyPoint('left');
                    renderAirHockey();
                    airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
                    return;
                }

                puck.x = width - puck.radius;
                puck.vx = -Math.abs(puck.vx);
            }

            [airHockeyState.left, airHockeyState.right].forEach((paddle) => {
                const dx = puck.x - paddle.x;
                const dy = puck.y - paddle.y;
                const rawDistance = Math.hypot(dx, dy);
                const distance = rawDistance || 0.001;
                const minDistance = puck.radius + paddle.radius;

                if (distance < minDistance) {
                    let nx = dx / distance;
                    let ny = dy / distance;
                    const paddleMotion = Math.hypot(paddle.vx, paddle.vy);

                    if (rawDistance < 0.5) {
                        if (paddleMotion > 1) {
                            nx = paddle.vx / paddleMotion;
                            ny = paddle.vy / paddleMotion;
                        } else {
                            nx = paddle === airHockeyState.left ? 1 : -1;
                            ny = 0;
                        }
                    }

                    const overlap = minDistance - distance;
                    puck.x += nx * (overlap + 0.5);
                    puck.y += ny * (overlap + 0.5);

                    const relativeVx = puck.vx - paddle.vx;
                    const relativeVy = puck.vy - paddle.vy;
                    const approachSpeed = (relativeVx * nx) + (relativeVy * ny);
                    const paddleSpeed = paddleMotion;

                    if (approachSpeed < 0) {
                        const bounce = -(1.35 * approachSpeed);
                        const carry = Math.min(220, paddleSpeed * 0.55);
                        puck.vx += (bounce + carry) * nx + (paddle.vx * 0.32);
                        puck.vy += (bounce + carry) * ny + (paddle.vy * 0.32);
                    } else {
                        puck.vx += nx * (28 + paddleSpeed * 0.08);
                        puck.vy += ny * (28 + paddleSpeed * 0.08);
                    }

                    clampAirHockeySpeed();
                }
            });

        }

        renderAirHockey();
        airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
    }

    function initializeReaction() {
        reactionState = 'idle';
        reactionStartTime = 0;
        window.clearTimeout(reactionTimeout);
        reactionLantern.classList.remove('is-armed', 'is-lit');
        reactionLastDisplay.textContent = '-';
        reactionBestDisplay.textContent = reactionBestTime ? `${reactionBestTime} ms` : '-';
        reactionHelpText.textContent = 'Attends que la lanterne s allume, puis clique le plus vite possible.';
    }

    function startReactionRound() {
        initializeReaction();
        reactionState = 'armed';
        reactionLantern.classList.add('is-armed');
        reactionHelpText.textContent = 'Patiente... la lanterne va s allumer.';
        reactionTimeout = window.setTimeout(() => {
            reactionState = 'lit';
            reactionLantern.classList.remove('is-armed');
            reactionLantern.classList.add('is-lit');
            reactionStartTime = performance.now();
        }, 1200 + Math.random() * 2400);
    }

    function getRandomBaieBerryIndex() {
        return Math.floor(Math.random() * Math.min(4, BAIE_BERRY_FRUITS.length));
    }

    function updateBaieBerryDropGuide(positionX = null) {
        if (!baieBerryDropGuide || !baieBerryState) {
            return;
        }

        const nextFruit = BAIE_BERRY_FRUITS[baieBerryState.nextLevel];
        const guideSize = Math.max(28, nextFruit.radius * 1.6);
        const clampedX = positionX === null
            ? (baieBerryCanvas.width / 2)
            : Math.max(nextFruit.radius, Math.min(baieBerryCanvas.width - nextFruit.radius, positionX));

        baieBerryDropGuide.style.width = `${guideSize}px`;
        baieBerryDropGuide.style.height = `${guideSize}px`;
        baieBerryDropGuide.style.transform = `translateX(${clampedX - (guideSize / 2)}px)`;
        baieBerryDropGuide.style.setProperty('--baieberry-guide-color', nextFruit.color);
    }

    function drawBaieBerryFruit(context, fruit, alpha = 1) {
        const config = BAIE_BERRY_FRUITS[fruit.level];
        const mergeScale = fruit.mergeProgress ? (1 + (fruit.mergeProgress * 0.14)) : 1;
        const gradient = context.createRadialGradient(
            -config.radius * 0.35,
            -config.radius * 0.42,
            config.radius * 0.08,
            0,
            0,
            config.radius
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
        gradient.addColorStop(0.16, config.color);
        gradient.addColorStop(0.72, config.color);
        gradient.addColorStop(1, 'rgba(15,23,42,0.68)');

        context.save();
        context.globalAlpha = alpha;
        context.translate(fruit.x, fruit.y);
        context.rotate(fruit.rotation || 0);
        context.scale(mergeScale, mergeScale);
        context.beginPath();
        context.fillStyle = gradient;
        context.arc(0, 0, config.radius, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.strokeStyle = 'rgba(255,255,255,0.2)';
        context.lineWidth = Math.max(2, config.radius * 0.08);
        context.arc(0, 0, config.radius * 0.82, Math.PI * 1.12, Math.PI * 1.84);
        context.stroke();

        context.beginPath();
        context.fillStyle = 'rgba(255,255,255,0.24)';
        context.ellipse(
            -config.radius * 0.28,
            -config.radius * 0.34,
            config.radius * 0.24,
            config.radius * 0.14,
            -0.4,
            0,
            Math.PI * 2
        );
        context.fill();

        context.beginPath();
        context.strokeStyle = 'rgba(34,197,94,0.92)';
        context.lineWidth = Math.max(2, config.radius * 0.07);
        context.moveTo(0, -config.radius * 0.92);
        context.quadraticCurveTo(
            config.radius * 0.08,
            -config.radius * 1.18,
            config.radius * 0.26,
            -config.radius * 1.04
        );
        context.stroke();

        context.beginPath();
        context.fillStyle = 'rgba(74, 222, 128, 0.95)';
        context.ellipse(
            config.radius * 0.12,
            -config.radius * 0.96,
            config.radius * 0.18,
            config.radius * 0.1,
            0.45,
            0,
            Math.PI * 2
        );
        context.fill();
        context.restore();
    }

    function drawBaieBerry() {
        const context = baieBerryCanvas?.getContext('2d');
        if (!context || !baieBerryState) {
            return;
        }

        context.clearRect(0, 0, baieBerryCanvas.width, baieBerryCanvas.height);
        const backdrop = context.createLinearGradient(0, 0, 0, baieBerryCanvas.height);
        backdrop.addColorStop(0, '#dbeafe');
        backdrop.addColorStop(0.18, '#93c5fd');
        backdrop.addColorStop(0.65, '#38bdf8');
        backdrop.addColorStop(1, '#0f766e');
        context.fillStyle = backdrop;
        context.fillRect(0, 0, baieBerryCanvas.width, baieBerryCanvas.height);

        context.fillStyle = 'rgba(255,255,255,0.14)';
        for (let bubbleIndex = 0; bubbleIndex < 10; bubbleIndex += 1) {
            const x = 30 + (bubbleIndex * 34) % baieBerryCanvas.width;
            const y = 26 + (bubbleIndex * 57) % baieBerryCanvas.height;
            const radius = 4 + (bubbleIndex % 3) * 2;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }

        context.fillStyle = 'rgba(255,255,255,0.1)';
        context.fillRect(18, 12, baieBerryCanvas.width - 36, 6);
        context.fillStyle = 'rgba(255,255,255,0.08)';
        context.fillRect(12, baieBerryCanvas.height - 28, baieBerryCanvas.width - 24, 12);

        baieBerryState.fruits.forEach((fruit) => {
            drawBaieBerryFruit(context, fruit);
        });
    }

    function initializeBaieBerry() {
        baieBerryState = {
            fruits: [],
            nextLevel: getRandomBaieBerryIndex(),
            score: 0,
            gameOver: false,
            mergePairs: new Map()
        };
        baieBerryScoreDisplay.textContent = '0';
        baieBerryNextDisplay.textContent = BAIE_BERRY_FRUITS[baieBerryState.nextLevel].name;
        baieBerryHelpText.textContent = `Record actuel: ${baieBerryBestScore}`;
        updateBaieBerryDropGuide();
        drawBaieBerry();

        if (!baieBerryAnimationFrame) {
            baieBerryAnimationFrame = window.requestAnimationFrame(updateBaieBerry);
        }
    }

    function dropBaieBerryAt(x) {
        if (!baieBerryState || baieBerryState.gameOver) {
            return;
        }

        const level = baieBerryState.nextLevel;
        const radius = BAIE_BERRY_FRUITS[level].radius;
        baieBerryState.fruits.push({
            id: baieBerryNextFruitId++,
            x: Math.max(radius, Math.min(baieBerryCanvas.width - radius, x)),
            y: radius + 4,
            vx: 0,
            vy: 0,
            rotation: 0,
            mergeProgress: 0,
            level
        });
        baieBerryState.nextLevel = getRandomBaieBerryIndex();
        baieBerryNextDisplay.textContent = BAIE_BERRY_FRUITS[baieBerryState.nextLevel].name;
        updateBaieBerryDropGuide(x);
    }

    function updateBaieBerry(timestamp) {
        if (!baieBerryState) {
            return;
        }

        if (!baieBerryLastFrame) {
            baieBerryLastFrame = timestamp;
        }

        const delta = Math.min(0.032, (timestamp - baieBerryLastFrame) / 1000);
        baieBerryLastFrame = timestamp;

        if (!baieBerryState.gameOver) {
            const activeMergeKeys = new Set();
            baieBerryState.fruits.forEach((fruit) => {
                const radius = BAIE_BERRY_FRUITS[fruit.level].radius;
                fruit.vy += 620 * delta;
                fruit.x += fruit.vx * delta;
                fruit.y += fruit.vy * delta;
                fruit.rotation = (fruit.rotation || 0) + ((fruit.vx * delta) / Math.max(12, radius));
                fruit.vx *= fruit.y >= baieBerryCanvas.height - radius - 1 ? 0.992 : 0.998;
                fruit.mergeProgress = 0;

                if (fruit.x < radius || fruit.x > baieBerryCanvas.width - radius) {
                    fruit.x = Math.max(radius, Math.min(baieBerryCanvas.width - radius, fruit.x));
                    fruit.vx *= -0.35;
                }

                if (fruit.y > baieBerryCanvas.height - radius) {
                    fruit.y = baieBerryCanvas.height - radius;
                    fruit.vy *= -0.18;
                    fruit.vx *= 0.98;
                }
            });

            for (let index = 0; index < baieBerryState.fruits.length; index += 1) {
                const fruitA = baieBerryState.fruits[index];
                for (let compareIndex = index + 1; compareIndex < baieBerryState.fruits.length; compareIndex += 1) {
                    const fruitB = baieBerryState.fruits[compareIndex];
                    const radiusA = BAIE_BERRY_FRUITS[fruitA.level].radius;
                    const radiusB = BAIE_BERRY_FRUITS[fruitB.level].radius;
                    const dx = fruitB.x - fruitA.x;
                    const dy = fruitB.y - fruitA.y;
                    const distance = Math.hypot(dx, dy) || 0.001;
                    const minDistance = radiusA + radiusB;

                    if (distance < minDistance) {
                        const overlap = minDistance - distance;
                        const nx = dx / distance;
                        const ny = dy / distance;
                        fruitA.x -= nx * overlap * 0.5;
                        fruitA.y -= ny * overlap * 0.5;
                        fruitB.x += nx * overlap * 0.5;
                        fruitB.y += ny * overlap * 0.5;
                        const sidePush = overlap * 7;
                        fruitA.vx -= nx * sidePush;
                        fruitB.vx += nx * sidePush;
                        fruitA.vy *= 0.94;
                        fruitB.vy *= 0.94;

                        const mergeThreshold = minDistance * 0.96;

                        if (fruitA.level === fruitB.level && fruitA.level < BAIE_BERRY_FRUITS.length - 1 && distance <= mergeThreshold) {
                            const mergeKey = [fruitA.id, fruitB.id].sort((firstId, secondId) => firstId - secondId).join('-');
                            activeMergeKeys.add(mergeKey);
                            const mergeState = baieBerryState.mergePairs.get(mergeKey) || { time: 0 };
                            mergeState.time = Math.min(0.2, mergeState.time + delta);
                            baieBerryState.mergePairs.set(mergeKey, mergeState);

                            const mergeProgress = Math.min(1, mergeState.time / 0.12);
                            fruitA.mergeProgress = Math.max(fruitA.mergeProgress || 0, mergeProgress);
                            fruitB.mergeProgress = Math.max(fruitB.mergeProgress || 0, mergeProgress);

                            if (mergeState.time >= 0.12) {
                                const nextLevel = fruitA.level + 1;
                                baieBerryState.score += BAIE_BERRY_FRUITS[nextLevel].score;
                                baieBerryState.fruits.splice(compareIndex, 1);
                                baieBerryState.fruits.splice(index, 1, {
                                    id: baieBerryNextFruitId++,
                                    x: (fruitA.x + fruitB.x) / 2,
                                    y: (fruitA.y + fruitB.y) / 2,
                                    vx: 0,
                                    vy: -90,
                                    rotation: ((fruitA.rotation || 0) + (fruitB.rotation || 0)) / 2,
                                    mergeProgress: 0,
                                    level: nextLevel
                                });
                                baieBerryState.mergePairs.delete(mergeKey);
                                baieBerryScoreDisplay.textContent = String(baieBerryState.score);
                                if (baieBerryState.score > baieBerryBestScore) {
                                    baieBerryBestScore = baieBerryState.score;
                                    window.localStorage.setItem(BAIE_BERRY_BEST_KEY, String(baieBerryBestScore));
                                }
                                break;
                            }
                        }
                    }
                }
            }

            baieBerryState.mergePairs.forEach((mergeState, mergeKey) => {
                if (!activeMergeKeys.has(mergeKey)) {
                    mergeState.time = Math.max(0, mergeState.time - (delta * 1.6));

                    if (mergeState.time <= 0) {
                        baieBerryState.mergePairs.delete(mergeKey);
                    }
                }
            });

            if (baieBerryState.fruits.some((fruit) => fruit.y < 18 && Math.abs(fruit.vy) < 40)) {
                baieBerryState.gameOver = true;
                baieBerryHelpText.textContent = `Recolte terminee. Score ${baieBerryState.score}.`;
            }
        }

        drawBaieBerry();
        baieBerryAnimationFrame = window.requestAnimationFrame(updateBaieBerry);
    }

    function createBreakoutBricks() {
        return Array.from({ length: 5 }, (_, row) => (
            Array.from({ length: 8 }, (_, col) => ({
                x: 28 + col * 63,
                y: 42 + row * 28,
                width: 54,
                height: 16,
                alive: true,
                color: `hsl(${row * 50 + col * 9} 82% 62%)`
            }))
        )).flat();
    }

    function drawBreakout() {
        const context = breakoutCanvas?.getContext('2d');
        if (!context || !breakoutState) {
            return;
        }

        context.clearRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);
        context.fillStyle = '#082f49';
        context.fillRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);

        breakoutState.bricks.forEach((brick) => {
            if (!brick.alive) {
                return;
            }
            context.fillStyle = brick.color;
            context.fillRect(brick.x, brick.y, brick.width, brick.height);
        });

        context.fillStyle = '#f8fafc';
        context.fillRect(breakoutState.paddle.x, breakoutState.paddle.y, breakoutState.paddle.width, breakoutState.paddle.height);
        context.beginPath();
        context.fillStyle = '#facc15';
        context.arc(breakoutState.ball.x, breakoutState.ball.y, breakoutState.ball.radius, 0, Math.PI * 2);
        context.fill();
    }

    function initializeBreakout() {
        breakoutState = {
            score: 0,
            lives: 3,
            running: false,
            paddle: { x: 230, y: 388, width: 100, height: 12 },
            ball: { x: 280, y: 290, vx: 190, vy: -220, radius: 8 },
            bricks: createBreakoutBricks()
        };
        breakoutScoreDisplay.textContent = '0';
        breakoutLivesDisplay.textContent = '3';
        breakoutHelpText.textContent = `Record actuel: ${breakoutBestScore}. Lance la balle quand tu veux.`;
        drawBreakout();

        if (!breakoutAnimationFrame) {
            breakoutAnimationFrame = window.requestAnimationFrame(updateBreakout);
        }
    }

    function updateBreakout(timestamp) {
        if (!breakoutState) {
            return;
        }

        if (!breakoutLastFrame) {
            breakoutLastFrame = timestamp;
        }

        const delta = Math.min(0.032, (timestamp - breakoutLastFrame) / 1000);
        breakoutLastFrame = timestamp;

        if (breakoutState.running) {
            const speed = 360;
            if (breakoutKeys.has('arrowleft') || breakoutKeys.has('q')) {
                breakoutState.paddle.x -= speed * delta;
            }
            if (breakoutKeys.has('arrowright') || breakoutKeys.has('d')) {
                breakoutState.paddle.x += speed * delta;
            }
            breakoutState.paddle.x = Math.max(0, Math.min(breakoutCanvas.width - breakoutState.paddle.width, breakoutState.paddle.x));

            breakoutState.ball.x += breakoutState.ball.vx * delta;
            breakoutState.ball.y += breakoutState.ball.vy * delta;

            if (breakoutState.ball.x <= breakoutState.ball.radius || breakoutState.ball.x >= breakoutCanvas.width - breakoutState.ball.radius) {
                breakoutState.ball.vx *= -1;
            }
            if (breakoutState.ball.y <= breakoutState.ball.radius) {
                breakoutState.ball.vy *= -1;
            }
            if (breakoutState.ball.y + breakoutState.ball.radius >= breakoutState.paddle.y
                && breakoutState.ball.x >= breakoutState.paddle.x
                && breakoutState.ball.x <= breakoutState.paddle.x + breakoutState.paddle.width
                && breakoutState.ball.vy > 0) {
                breakoutState.ball.vy *= -1;
                breakoutState.ball.vx = ((breakoutState.ball.x - (breakoutState.paddle.x + breakoutState.paddle.width / 2)) / 50) * 240;
            }

            breakoutState.bricks.forEach((brick) => {
                if (!brick.alive) {
                    return;
                }
                if (breakoutState.ball.x + breakoutState.ball.radius > brick.x
                    && breakoutState.ball.x - breakoutState.ball.radius < brick.x + brick.width
                    && breakoutState.ball.y + breakoutState.ball.radius > brick.y
                    && breakoutState.ball.y - breakoutState.ball.radius < brick.y + brick.height) {
                    brick.alive = false;
                    breakoutState.ball.vy *= -1;
                    breakoutState.score += 25;
                    breakoutScoreDisplay.textContent = String(breakoutState.score);
                    if (breakoutState.score > breakoutBestScore) {
                        breakoutBestScore = breakoutState.score;
                        window.localStorage.setItem(BREAKOUT_BEST_KEY, String(breakoutBestScore));
                    }
                }
            });

            if (breakoutState.ball.y > breakoutCanvas.height + 20) {
                breakoutState.lives -= 1;
                breakoutLivesDisplay.textContent = String(breakoutState.lives);
                breakoutState.running = false;
                breakoutState.ball.x = 280;
                breakoutState.ball.y = 290;
                breakoutState.ball.vx = 190;
                breakoutState.ball.vy = -220;
                breakoutHelpText.textContent = breakoutState.lives > 0 ? 'Balle perdue. Clique relancer.' : `Partie terminee. Score ${breakoutState.score}.`;
            }

            if (breakoutState.bricks.every((brick) => !brick.alive)) {
                breakoutState.running = false;
                breakoutHelpText.textContent = `Victoire ! Score ${breakoutState.score}.`;
            }
        }

        drawBreakout();
        breakoutAnimationFrame = window.requestAnimationFrame(updateBreakout);
    }

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

        if (nextTab === 'tetris') {
            initializeTetris();
            return;
        }

        if (nextTab === 'pacman') {
            initializePacman();
            return;
        }

        if (nextTab === 'solitaire') {
            initializeSolitaire();
            return;
        }

        if (nextTab === 'connect4') {
            initializeConnect4();
            return;
        }

        if (nextTab === 'rhythm') {
            initializeRhythm();
            return;
        }

        if (nextTab === 'flappy') {
            initializeFlappy();
            return;
        }

        if (nextTab === 'flowFree') {
            initializeFlowFree();
            return;
        }

        if (nextTab === 'magicSort') {
            initializeMagicSort();
            return;
        }

        if (nextTab === 'mentalMath') {
            initializeMentalMath();
            return;
        }

        if (nextTab === 'candyCrush') {
            initializeCandyCrush();
            return;
        }

        if (nextTab === 'harborRun') {
            initializeHarborRun();
            return;
        }

        if (nextTab === 'stacker') {
            initializeStacker();
            return;
        }

        if (nextTab === 'coinClicker') {
            initializeCoinClicker();
            return;
        }

        if (nextTab === 'chess') {
            initializeChess();
            return;
        }

        if (nextTab === 'checkers') {
            initializeCheckers();
            return;
        }

        if (nextTab === 'airHockey') {
            initializeAirHockey();
            return;
        }

        if (nextTab === 'reaction') {
            initializeReaction();
            return;
        }

        if (nextTab === 'baieBerry') {
            initializeBaieBerry();
            return;
        }

        if (nextTab === 'breakout') {
            initializeBreakout();
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

    instrumentTiles.forEach((tile) => {
        tile.addEventListener('click', () => {
            if (tile.dataset.openInstrument === 'piano') {
                activateMusicPanel('pianoPanel');
            }
        });
    });

    pianoResetButton?.addEventListener('click', () => {
        pianoSustainActive = false;
        stopAllPianoNotes(true);
        pianoPointerId = null;
        pianoPointerNoteId = null;

        if (pianoAudioContext?.state === 'closed') {
            pianoAudioContext = null;
            pianoMasterGain = null;
        }

        renderPiano();
        updatePianoHelpText();
    });

    pianoKeyboard?.addEventListener('pointerdown', (event) => {
        const keyButton = event.target.closest('[data-piano-key]');

        if (!keyButton) {
            return;
        }

        event.preventDefault();
        activateMusicPanel('pianoPanel');
        pianoPointerId = event.pointerId;
        pianoPointerNoteId = keyButton.dataset.pianoKey;
        pianoKeyboard.setPointerCapture?.(event.pointerId);
        startPianoNote(pianoPointerNoteId, 'pointer');
    });

    pianoKeyboard?.addEventListener('pointermove', (event) => {
        if (event.pointerId !== pianoPointerId) {
            return;
        }

        const elementAtPoint = document.elementFromPoint(event.clientX, event.clientY);
        const keyButton = elementAtPoint?.closest?.('[data-piano-key]');
        const nextNoteId = keyButton?.dataset.pianoKey || null;

        if (nextNoteId === pianoPointerNoteId) {
            return;
        }

        if (pianoPointerNoteId) {
            stopPianoNote(pianoPointerNoteId, 'pointer');
        }

        pianoPointerNoteId = nextNoteId;

        if (pianoPointerNoteId) {
            startPianoNote(pianoPointerNoteId, 'pointer');
        }
    });

    pianoKeyboard?.addEventListener('pointerup', (event) => {
        if (event.pointerId !== pianoPointerId) {
            return;
        }

        if (pianoPointerNoteId) {
            stopPianoNote(pianoPointerNoteId, 'pointer');
        }

        pianoPointerId = null;
        pianoPointerNoteId = null;
        pianoKeyboard.releasePointerCapture?.(event.pointerId);
    });

    pianoKeyboard?.addEventListener('pointercancel', (event) => {
        if (event.pointerId !== pianoPointerId) {
            return;
        }

        if (pianoPointerNoteId) {
            stopPianoNote(pianoPointerNoteId, 'pointer');
        }

        pianoPointerId = null;
        pianoPointerNoteId = null;
    });

    pianoKeyboard?.addEventListener('lostpointercapture', () => {
        if (pianoPointerNoteId) {
            stopPianoNote(pianoPointerNoteId, 'pointer');
        }

        pianoPointerId = null;
        pianoPointerNoteId = null;
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

    pongModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setPongMode(button.dataset.pongMode);
        });
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

    aimDurationButtons.forEach((button) => {
        button.addEventListener('click', () => {
            closeGameOverModal();
            setAimRoundDuration(Number(button.dataset.aimDuration));
        });
    });

    aimBoard.addEventListener('pointerdown', (event) => {
        const cellButton = event.target.closest('.aim-cell');

        if (!cellButton) {
            return;
        }

        event.preventDefault();

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

    ticTacToeModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setTicTacToeMode(button.dataset.tictactoeMode);
        });
    });

    ticTacToeBoard.addEventListener('click', (event) => {
        const cellButton = event.target.closest('.tictactoe-cell');

        if (!cellButton) {
            return;
        }

        handleTicTacToeMove(
            Number(cellButton.dataset.index),
            ticTacToeMode === 'duo' ? ticTacToeCurrentPlayer : 'anchor'
        );
    });

    battleshipRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeBattleship();
    });

    tetrisStartButton.addEventListener('click', () => {
        startTetris();
    });

    pacmanStartButton.addEventListener('click', () => {
        startPacman();
    });

    solitaireRestartButton.addEventListener('click', () => {
        initializeSolitaire();
    });

    connect4RestartButton.addEventListener('click', () => {
        initializeConnect4();
    });

    connect4ModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setConnect4Mode(button.dataset.connect4Mode);
        });
    });

    rhythmStartButton.addEventListener('click', () => {
        startRhythm();
    });

    flappyStartButton.addEventListener('click', () => {
        startFlappy();
    });

    flowFreeRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeFlowFree();
    });

    magicSortRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeMagicSort();
    });

    mentalMathRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeMentalMath();
    });

    mentalMathForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        submitMentalMathAnswer();
    });

    candyCrushRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeCandyCrush();
    });

    harborRunStartButton.addEventListener('click', () => {
        closeGameOverModal();
        startHarborRun();
    });

    stackerStartButton.addEventListener('click', () => {
        closeGameOverModal();
        dropStackerLayer();
    });

    coinClickerButton?.addEventListener('click', () => {
        coinClickerState.coins += getCoinClickerCoinsPerClick();
        saveCoinClickerState();
        renderCoinClicker();
    });

    coinClickerResetButton?.addEventListener('click', () => {
        initializeCoinClicker(true);
    });

    coinClickerShop?.addEventListener('click', (event) => {
        const upgradeButton = event.target.closest('[data-coin-upgrade]');

        if (!upgradeButton) {
            return;
        }

        const upgrade = COIN_CLICKER_UPGRADES.find((item) => item.id === upgradeButton.dataset.coinUpgrade);

        if (!upgrade) {
            return;
        }

        const cost = getCoinClickerUpgradeCost(upgrade);

        if (coinClickerState.coins < cost) {
            return;
        }

        coinClickerState.coins -= cost;
        coinClickerState.upgrades[upgrade.id] += 1;
        if (upgrade.effectType === 'click') {
            coinClickerState.clickPower += upgrade.bonus;
        } else if (upgrade.effectType === 'multiplier') {
            coinClickerState.multiplier += upgrade.bonus;
        } else if (upgrade.effectType === 'auto') {
            coinClickerState.autoPower += upgrade.bonus;
        }
        coinClickerHelpText.textContent = upgrade.effectType === 'auto'
            ? 'Le butin tombe maintenant tout seul dans la cale.'
            : (upgrade.effectType === 'multiplier'
                ? 'Ton butin vaut plus a chaque clic.'
                : 'Tes clics frappent plus fort sur la caisse.');
        saveCoinClickerState();
        renderCoinClicker();
    });

    chessResetButton?.addEventListener('click', () => {
        initializeChess();
    });

    chessModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setChessMode(button.dataset.chessMode);
        });
    });

    chessBoard?.addEventListener('click', (event) => {
        const cell = event.target.closest('[data-chess-cell]');

        if (!cell) {
            return;
        }

        const [row, col] = cell.dataset.chessCell.split('-').map(Number);
        handleChessCellClick(row, col);
    });

    checkersResetButton?.addEventListener('click', () => {
        initializeCheckers();
    });

    checkersModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setCheckersMode(button.dataset.checkersMode);
        });
    });

    checkersBoard?.addEventListener('click', (event) => {
        const cell = event.target.closest('[data-checkers-cell]');

        if (!cell) {
            return;
        }

        const [row, col] = cell.dataset.checkersCell.split('-').map(Number);
        handleCheckersCellClick(row, col);
    });

    airHockeyModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            airHockeyMode = button.dataset.airhockeyMode;
            airHockeyModeButtons.forEach((item) => item.classList.toggle('is-active', item === button));
            airHockeyHelpText.textContent = airHockeyMode === 'solo'
                ? 'Joueur gauche: ZQSD. La droite est pilotee par l IA.'
                : 'Joueur gauche: ZQSD. Joueur droit: fleches directionnelles.';
            initializeAirHockey();
        });
    });

    airHockeyStartButton?.addEventListener('click', () => {
        initializeAirHockey(false);
        launchAirHockeyPuck();
    });

    reactionStartButton?.addEventListener('click', () => {
        startReactionRound();
    });

    reactionLantern?.addEventListener('click', () => {
        if (reactionState === 'armed') {
            window.clearTimeout(reactionTimeout);
            initializeReaction();
            reactionHelpText.textContent = 'Trop tot. Attends vraiment l allumage.';
            return;
        }

        if (reactionState !== 'lit') {
            return;
        }

        const reactionTime = Math.round(performance.now() - reactionStartTime);
        reactionState = 'done';
        reactionLantern.classList.remove('is-lit');
        reactionLastDisplay.textContent = `${reactionTime} ms`;
        if (!reactionBestTime || reactionTime < reactionBestTime) {
            reactionBestTime = reactionTime;
            window.localStorage.setItem(REACTION_BEST_KEY, String(reactionBestTime));
        }
        reactionBestDisplay.textContent = reactionBestTime ? `${reactionBestTime} ms` : '-';
        reactionHelpText.textContent = 'Bien joue. Relance pour tenter un meilleur reflexe.';
    });

    baieBerryStartButton?.addEventListener('click', () => {
        initializeBaieBerry();
    });

    baieBerryCanvas?.addEventListener('pointermove', (event) => {
        const bounds = baieBerryCanvas.getBoundingClientRect();
        const scaleX = baieBerryCanvas.width / bounds.width;
        const x = (event.clientX - bounds.left) * scaleX;
        updateBaieBerryDropGuide(x);
    });

    baieBerryCanvas?.addEventListener('click', (event) => {
        const bounds = baieBerryCanvas.getBoundingClientRect();
        const scaleX = baieBerryCanvas.width / bounds.width;
        dropBaieBerryAt((event.clientX - bounds.left) * scaleX);
    });

    breakoutStartButton?.addEventListener('click', () => {
        if (!breakoutState || breakoutState.lives <= 0) {
            initializeBreakout();
        }
        breakoutState.running = true;
    });

    battleshipEnemyBoard.addEventListener('click', (event) => {
        const cellButton = event.target.closest('.battleship-cell');

        if (!cellButton) {
            return;
        }

        handleBattleshipShot(Number(cellButton.dataset.row), Number(cellButton.dataset.col));
    });

    solitaireStock.addEventListener('click', (event) => {
        const actionButton = event.target.closest('[data-solitaire-action]');

        if (!actionButton) {
            return;
        }

        drawSolitaireCard();
    });

    solitaireWaste.addEventListener('click', (event) => {
        const wasteCard = event.target.closest('[data-solitaire-source="waste"]');

        if (!wasteCard) {
            return;
        }

        if (solitaireSelectedSource?.type === 'waste') {
            clearSolitaireSelection();
            renderSolitaire();
            return;
        }

        selectSolitaireSource({ type: 'waste' });
    });

    solitaireFoundations.addEventListener('click', (event) => {
        const foundationButton = event.target.closest('[data-solitaire-foundation]');

        if (!foundationButton) {
            return;
        }

        const suit = foundationButton.dataset.solitaireFoundation;

        if (solitaireSelectedSource) {
            if (moveSelectedSolitaireToFoundation(suit)) {
                return;
            }

            clearSolitaireSelection();
            renderSolitaire();
            return;
        }

        if (solitaireFoundationsState[suit].length) {
            selectSolitaireSource({ type: 'foundation', suit });
        }
    });

    solitaireTableau.addEventListener('click', (event) => {
        const tableauCard = event.target.closest('[data-solitaire-tableau]');
        const columnTarget = event.target.closest('[data-solitaire-column]');

        if (tableauCard) {
            const col = Number(tableauCard.dataset.solitaireTableau);
            const index = Number(tableauCard.dataset.solitaireIndex);

            if (solitaireSelectedSource) {
                if (moveSelectedSolitaireToTableau(col)) {
                    return;
                }

                clearSolitaireSelection();
                renderSolitaire();
                return;
            }

            selectSolitaireSource({ type: 'tableau', col, index });
            return;
        }

        if (columnTarget && solitaireSelectedSource) {
            const col = Number(columnTarget.dataset.solitaireColumn);

            if (!Number.isNaN(col) && moveSelectedSolitaireToTableau(col)) {
                return;
            }

            clearSolitaireSelection();
            renderSolitaire();
        }
    });

    connect4Board.addEventListener('click', (event) => {
        const cellButton = event.target.closest('.connect4-cell');

        if (!cellButton) {
            return;
        }

        handleConnect4Move(Number(cellButton.dataset.col));
    });

    rhythmBoard.addEventListener('click', (event) => {
        const pad = event.target.closest('[data-rhythm-lane]');

        if (!pad) {
            return;
        }

        handleRhythmHit(Number(pad.dataset.rhythmLane));
    });

    flappyBoard.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        flapFlappyBird();
    });

    flowFreeBoard.addEventListener('pointerdown', (event) => {
        const cellButton = event.target.closest('.flowfree-cell');
        if (!cellButton) {
            return;
        }

        startFlowFreePath(
            Number(cellButton.dataset.flowRow),
            Number(cellButton.dataset.flowCol)
        );
    });

    flowFreeBoard.addEventListener('pointerover', (event) => {
        const cellButton = event.target.closest('.flowfree-cell');
        if (!cellButton) {
            return;
        }

        extendFlowFreePath(
            Number(cellButton.dataset.flowRow),
            Number(cellButton.dataset.flowCol)
        );
    });

    flowFreeBoard.addEventListener('pointermove', (event) => {
        if (!flowFreePointerDown) {
            return;
        }

        const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
        const cellButton = hoveredElement?.closest('.flowfree-cell');
        if (!cellButton) {
            return;
        }

        extendFlowFreePath(
            Number(cellButton.dataset.flowRow),
            Number(cellButton.dataset.flowCol)
        );
    });

    document.addEventListener('pointerup', () => {
        if (flowFreePointerDown) {
            stopFlowFreePath();
        }
    });

    magicSortBoard.addEventListener('pointerdown', (event) => {
        const tubeButton = event.target.closest('[data-magic-sort-tube]');
        if (!tubeButton) {
            return;
        }

        handleMagicSortTubeClick(Number(tubeButton.dataset.magicSortTube));
    });

    candyCrushBoard.addEventListener('pointerdown', (event) => {
        const cellButton = event.target.closest('.candycrush-cell');
        if (!cellButton) {
            return;
        }

        candyCrushPointerStart = {
            row: Number(cellButton.dataset.candyRow),
            col: Number(cellButton.dataset.candyCol)
        };
        candyCrushSelectedCell = candyCrushPointerStart;
        renderCandyCrush();
    });

    candyCrushBoard.addEventListener('pointerup', async (event) => {
        const cellButton = event.target.closest('.candycrush-cell');
        if (!cellButton || !candyCrushPointerStart) {
            candyCrushPointerStart = null;
            return;
        }

        const targetCell = {
            row: Number(cellButton.dataset.candyRow),
            col: Number(cellButton.dataset.candyCol)
        };

        const startCell = candyCrushPointerStart;
        candyCrushPointerStart = null;
        await tryCandyCrushSwap(startCell, targetCell);
    });

    candyCrushBoard.addEventListener('pointerleave', () => {
        candyCrushPointerStart = null;
        candyCrushSelectedCell = null;
        if (!candyCrushAnimating) {
            renderCandyCrush();
        }
    });

    harborRunBoard.addEventListener('pointerdown', (event) => {
        const bounds = harborRunBoard.getBoundingClientRect();
        const relativeX = event.clientX - bounds.left;
        const zone = relativeX / bounds.width;

        if (zone < 0.33) {
            moveHarborRun(-1);
            return;
        }

        if (zone > 0.66) {
            moveHarborRun(1);
        }
    });

    stackerBoard.addEventListener('pointerdown', () => {
        dropStackerLayer();
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

        const targetTag = event.target?.tagName;
        const isTypingTarget = ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag) || event.target?.isContentEditable;
        const pianoNoteId = getPianoNoteIdFromKeyboardEvent(event);

        if (currentView === musicView && activeMusicTab === 'pianoPanel' && event.code === 'Space' && !isTypingTarget) {
            event.preventDefault();
            if (!pianoSustainActive) {
                pianoSustainActive = true;
                updatePianoHelpText();
                renderPiano();
            }
            return;
        }

        if (currentView === musicView && activeMusicTab === 'pianoPanel' && pianoNoteId && !isTypingTarget && !event.repeat) {
            event.preventDefault();
            startPianoNote(pianoNoteId, 'keyboard');
            return;
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

        if (activeGameTab === 'tetris') {
            if (['ArrowLeft', 'q', 'Q'].includes(event.key)) {
                event.preventDefault();
                moveTetrisHorizontally(-1);
                return;
            }

            if (['ArrowRight', 'd', 'D'].includes(event.key)) {
                event.preventDefault();
                moveTetrisHorizontally(1);
                return;
            }

            if (['ArrowDown', 's', 'S'].includes(event.key)) {
                event.preventDefault();
                dropTetrisStep();
                return;
            }

            if (['ArrowUp', 'z', 'Z'].includes(event.key)) {
                event.preventDefault();
                rotateTetrisPiece();
                return;
            }

            if (event.code === 'Space') {
                event.preventDefault();
                hardDropTetrisPiece();
                return;
            }
        }

        if (activeGameTab === 'pacman') {
            const pacmanDirections = {
                ArrowUp: { row: -1, col: 0 },
                ArrowDown: { row: 1, col: 0 },
                ArrowLeft: { row: 0, col: -1 },
                ArrowRight: { row: 0, col: 1 },
                z: { row: -1, col: 0 },
                Z: { row: -1, col: 0 },
                s: { row: 1, col: 0 },
                S: { row: 1, col: 0 },
                q: { row: 0, col: -1 },
                Q: { row: 0, col: -1 },
                d: { row: 0, col: 1 },
                D: { row: 0, col: 1 }
            };
            const nextPacmanDirection = pacmanDirections[event.key];

            if (nextPacmanDirection) {
                event.preventDefault();
                pacmanNextDirection = nextPacmanDirection;
                return;
            }
        }

        if (activeGameTab === 'rhythm') {
            const rhythmLane = {
                q: 0,
                Q: 0,
                s: 1,
                S: 1,
                d: 2,
                D: 2,
                f: 3,
                F: 3
            }[event.key];

            if (rhythmLane !== undefined) {
                event.preventDefault();
                handleRhythmHit(rhythmLane);
                return;
            }
        }

        if (activeGameTab === 'flappy' && event.code === 'Space') {
            event.preventDefault();
            flapFlappyBird();
            return;
        }

        if (activeGameTab === 'harborRun') {
            if (['ArrowLeft', 'q', 'Q', 'a', 'A'].includes(event.key)) {
                event.preventDefault();
                moveHarborRun(-1);
                return;
            }

            if (['ArrowRight', 'd', 'D'].includes(event.key)) {
                event.preventDefault();
                moveHarborRun(1);
                return;
            }
        }

        if (activeGameTab === 'stacker' && event.code === 'Space') {
            event.preventDefault();
            dropStackerLayer();
            return;
        }

        if (activeGameTab === 'airHockey') {
            const normalizedKey = event.key.toLowerCase();
            if (['z', 'q', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(normalizedKey)) {
                event.preventDefault();
                airHockeyKeys.add(normalizedKey);
                return;
            }
        }

        if (activeGameTab === 'breakout') {
            const normalizedKey = event.key.toLowerCase();
            if (['q', 'd', 'arrowleft', 'arrowright'].includes(normalizedKey)) {
                event.preventDefault();
                breakoutKeys.add(normalizedKey);
                return;
            }

            if (event.code === 'Space') {
                event.preventDefault();
                if (!breakoutState || breakoutState.lives <= 0) {
                    initializeBreakout();
                }
                breakoutState.running = true;
                return;
            }
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
        if (currentView === musicView && activeMusicTab === 'pianoPanel' && event.code === 'Space') {
            pianoSustainActive = false;
            releaseSustainedPianoNotes();
            return;
        }

        if (currentView === musicView && activeMusicTab === 'pianoPanel' && releaseKeyboardPianoKey(event)) {
            return;
        }

        pongKeys.delete(event.key);
        airHockeyKeys.delete(event.key.toLowerCase());
        breakoutKeys.delete(event.key.toLowerCase());
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

        if (activeGameTab === 'pacman') {
            renderPacman();
        }

        if (activeGameTab === 'flappy') {
            renderFlappy();
        }

        if (activeGameTab === 'harborRun') {
            renderHarborRun();
        }

        if (activeGameTab === 'stacker') {
            renderStacker();
        }

        if (activeGameTab === 'airHockey') {
            renderAirHockey();
        }

        if (activeGameTab === 'baieBerry') {
            drawBaieBerry();
        }

        if (activeGameTab === 'breakout') {
            drawBreakout();
        }
    });

    renderAll();
    importMoviesFromExcel();
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
    initializeTetris();
    initializePacman();
    initializeSolitaire();
    initializeConnect4();
    initializeRhythm();
    initializeFlappy();
    initializeFlowFree();
    initializeMagicSort();
    initializeMentalMath();
    initializeCandyCrush();
    initializeHarborRun();
    initializeStacker();
    initializeCoinClicker();
    startCoinClickerAutoLoop();
    initializeChess();
    initializeCheckers();
    initializeAirHockey();
    initializeReaction();
    initializeBaieBerry();
    initializeBreakout();
    initializeConverter();
    activateMathPanel('mathCalculatorPanel');
    activateMusicPanel('musicHomePanel');
    renderPiano();

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
