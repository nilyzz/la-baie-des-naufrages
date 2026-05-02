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
    const siteHeader = document.getElementById('siteHeader');
    const loginForm = document.getElementById('loginForm');
    const pageBackButton = document.getElementById('pageBackButton');
    const logoutButton = document.getElementById('logoutButton');
    const searchInput = document.getElementById('searchInput');
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
    const catalogResetFiltersButton = document.getElementById('catalogResetFiltersButton');
    const manageList = document.getElementById('manageList');
    const excelImportStatus = document.getElementById('excelImportStatus');
    const excelSourceName = document.getElementById('excelSourceName');
    const movieCount = document.getElementById('movieCount');
    const averageRating = document.getElementById('averageRating');
    const confirmModal = document.getElementById('confirmModal');
    const confirmText = document.getElementById('confirmText');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const legalNoticeModal = document.getElementById('legalNoticeModal');
    const minesweeperBoard = document.getElementById('minesweeperBoard');
    const minesweeperGame = document.getElementById('minesweeperGame');
    const mineCountDisplay = document.getElementById('mineCountDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const restartGameButton = document.getElementById('restartGameButton');
    const minesweeperHelpText = document.getElementById('minesweeperHelpText');
    const minesweeperTable = document.getElementById('minesweeperTable');
    const minesweeperMenuOverlay = document.getElementById('minesweeperMenuOverlay');
    const minesweeperMenuEyebrow = document.getElementById('minesweeperMenuEyebrow');
    const minesweeperMenuTitle = document.getElementById('minesweeperMenuTitle');
    const minesweeperMenuText = document.getElementById('minesweeperMenuText');
    const minesweeperMenuActionButton = document.getElementById('minesweeperMenuActionButton');
    const minesweeperMenuRulesButton = document.getElementById('minesweeperMenuRulesButton');
    const minesweeperGridSizeButtons = document.querySelectorAll('[data-minesweeper-grid-size]');
    const multiplayerChatCard = document.getElementById('multiplayerChatCard');
    const multiplayerChatSubtitle = document.getElementById('multiplayerChatSubtitle');
    const multiplayerChatMessages = document.getElementById('multiplayerChatMessages');
    const multiplayerChatForm = document.getElementById('multiplayerChatForm');
    const multiplayerChatInput = document.getElementById('multiplayerChatInput');
    const multiplayerChatSendButton = document.getElementById('multiplayerChatSendButton');
    const gameOverModal = document.getElementById('gameOverModal');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverText = document.getElementById('gameOverText');
    const multiplayerLobbyStatus = document.getElementById('multiplayerLobbyStatus');
    const multiplayerCreateModeButton = document.getElementById('multiplayerCreateModeButton');
    const multiplayerJoinModeButton = document.getElementById('multiplayerJoinModeButton');
    const multiplayerCreatePanel = document.getElementById('multiplayerCreatePanel');
    const multiplayerJoinPanel = document.getElementById('multiplayerJoinPanel');
    const multiplayerCreatePlayerField = document.getElementById('multiplayerCreatePlayerField');
    const multiplayerCreatePlayerNameInput = document.getElementById('multiplayerCreatePlayerNameInput');
    const multiplayerJoinPlayerField = document.getElementById('multiplayerJoinPlayerField');
    const multiplayerJoinPlayerNameInput = document.getElementById('multiplayerJoinPlayerNameInput');
    const multiplayerJoinCodeField = document.getElementById('multiplayerJoinCodeField');
    const multiplayerJoinRoomCodeInput = document.getElementById('multiplayerJoinRoomCodeInput');
    const multiplayerCreateRoomButton = document.getElementById('multiplayerCreateRoomButton');
    const multiplayerJoinRoomButton = document.getElementById('multiplayerJoinRoomButton');
    const multiplayerCopyCodeButton = document.getElementById('multiplayerCopyCodeButton');
    const multiplayerCurrentRoomCode = document.getElementById('multiplayerCurrentRoomCode');
    const multiplayerLobbyPlayersBlock = document.getElementById('multiplayerLobbyPlayersBlock');
    const multiplayerRoomPlayers = document.getElementById('multiplayerRoomPlayers');
    const multiplayerGameTiles = document.querySelectorAll('[data-multiplayer-game-select]');
    let multiplayerCreateLeaveButton = null;
    // GAME_FILTER_TAGS : expose sur window par js/core/constants.js via js/main.js.
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
    const gamesSoloPanel = document.getElementById('gamesSoloPanel');
    const gamesMultiplayerPanel = document.getElementById('gamesMultiplayerPanel');
    const snakeBoard = document.getElementById('snakeBoard');
    const snakeScoreDisplay = document.getElementById('snakeScoreDisplay');
    const snakeBestScoreDisplay = document.getElementById('snakeBestScoreDisplay');
    const snakeStartButton = document.getElementById('snakeStartButton');
    const snakeHelpText = document.getElementById('snakeHelpText');
    const snakeTable = document.getElementById('snakeTable');
    const snakeMenuOverlay = document.getElementById('snakeMenuOverlay');
    const snakeMenuEyebrow = document.getElementById('snakeMenuEyebrow');
    const snakeMenuTitle = document.getElementById('snakeMenuTitle');
    const snakeMenuText = document.getElementById('snakeMenuText');
    const snakeMenuActionButton = document.getElementById('snakeMenuActionButton');
    const snakeMenuRulesButton = document.getElementById('snakeMenuRulesButton');
    const snakeGridSizeButtons = document.querySelectorAll('[data-snake-grid-size]');
    const pongBoard = document.getElementById('pongBoard');
    const pongTable = document.getElementById('pongTable');
    const pongCountdown = document.getElementById('pongCountdown');
    const pongPlayerPaddle = document.getElementById('pongPlayerPaddle');
    const pongAiPaddle = document.getElementById('pongAiPaddle');
    const pongBall = document.getElementById('pongBall');
    const pongPlayerScoreDisplay = document.getElementById('pongPlayerScoreDisplay');
    const pongAiScoreDisplay = document.getElementById('pongAiScoreDisplay');
    const pongLeftLabel = document.getElementById('pongLeftLabel');
    const pongRightLabel = document.getElementById('pongRightLabel');
    const pongHelpText = document.getElementById('pongHelpText');
    const pongModeButtons = document.querySelectorAll('[data-pong-mode]');
    const pongMenuOverlay = document.getElementById('pongMenuOverlay');
    const pongMenuEyebrow = document.getElementById('pongMenuEyebrow');
    const pongMenuTitle = document.getElementById('pongMenuTitle');
    const pongMenuText = document.getElementById('pongMenuText');
    const pongMenuActionButton = document.getElementById('pongMenuActionButton');
    const pongMenuRulesButton = document.getElementById('pongMenuRulesButton');
    const sudokuBoard = document.getElementById('sudokuBoard');
    const sudokuFilledDisplay = document.getElementById('sudokuFilledDisplay');
    const sudokuMistakesDisplay = document.getElementById('sudokuMistakesDisplay');
    const sudokuTimerDisplay = document.getElementById('sudokuTimerDisplay');
    const sudokuDifficultyButton = document.getElementById('sudokuDifficultyButton');
    const sudokuRestartButton = document.getElementById('sudokuRestartButton');
    const sudokuHelpText = document.getElementById('sudokuHelpText');
    const sudokuTable = document.getElementById('sudokuTable');
    const sudokuMenuOverlay = document.getElementById('sudokuMenuOverlay');
    const sudokuMenuEyebrow = document.getElementById('sudokuMenuEyebrow');
    const sudokuMenuTitle = document.getElementById('sudokuMenuTitle');
    const sudokuMenuText = document.getElementById('sudokuMenuText');
    const sudokuMenuActionButton = document.getElementById('sudokuMenuActionButton');
    const sudokuMenuRulesButton = document.getElementById('sudokuMenuRulesButton');
    const game2048Board = document.getElementById('game2048Board');
    const game2048Table = document.getElementById('game2048Table');
    const game2048ScoreDisplay = document.getElementById('game2048ScoreDisplay');
    const game2048BestScoreDisplay = document.getElementById('game2048BestScoreDisplay');
    const game2048RestartButton = document.getElementById('game2048RestartButton');
    const game2048MenuOverlay = document.getElementById('game2048MenuOverlay');
    const game2048MenuEyebrow = document.getElementById('game2048MenuEyebrow');
    const game2048MenuTitle = document.getElementById('game2048MenuTitle');
    const game2048MenuText = document.getElementById('game2048MenuText');
    const game2048MenuActionButton = document.getElementById('game2048MenuActionButton');
    const game2048MenuRulesButton = document.getElementById('game2048MenuRulesButton');
    const aimBoard = document.getElementById('aimBoard');
    const aimTable = document.getElementById('aimTable');
    const aimScoreDisplay = document.getElementById('aimScoreDisplay');
    const aimTimerDisplay = document.getElementById('aimTimerDisplay');
    const aimBestScoreDisplay = document.getElementById('aimBestScoreDisplay');
    const aimStartButton = document.getElementById('aimStartButton');
    const aimDurationButtons = document.querySelectorAll('[data-aim-duration]');
    const aimMenuOverlay = document.getElementById('aimMenuOverlay');
    const aimMenuEyebrow = document.getElementById('aimMenuEyebrow');
    const aimMenuTitle = document.getElementById('aimMenuTitle');
    const aimMenuText = document.getElementById('aimMenuText');
    const aimMenuActionButton = document.getElementById('aimMenuActionButton');
    const aimMenuRulesButton = document.getElementById('aimMenuRulesButton');
    const memoryBoard = document.getElementById('memoryBoard');
    const memoryPairsDisplay = document.getElementById('memoryPairsDisplay');
    const memoryMovesDisplay = document.getElementById('memoryMovesDisplay');
    const memoryHelpText = document.getElementById('memoryHelpText');
    const memoryTable = document.getElementById('memoryTable');
    const memoryMenuOverlay = document.getElementById('memoryMenuOverlay');
    const memoryMenuEyebrow = document.getElementById('memoryMenuEyebrow');
    const memoryMenuTitle = document.getElementById('memoryMenuTitle');
    const memoryMenuText = document.getElementById('memoryMenuText');
    const memoryMenuActionButton = document.getElementById('memoryMenuActionButton');
    const memoryMenuRulesButton = document.getElementById('memoryMenuRulesButton');
    const ticTacToeBoard = document.getElementById('ticTacToeBoard');
    const ticTacToeTable = document.getElementById('ticTacToeTable');
    const ticTacToeTurnDisplay = document.getElementById('ticTacToeTurnDisplay');
    const ticTacToeScoreDisplay = document.getElementById('ticTacToeScoreDisplay');
    const ticTacToeHelpText = document.getElementById('ticTacToeHelpText');
    const ticTacToeRestartButton = document.getElementById('ticTacToeRestartButton');
    const ticTacToeModeButtons = document.querySelectorAll('[data-tictactoe-mode]');
    const ticTacToeMenuOverlay = document.getElementById('ticTacToeMenuOverlay');
    const ticTacToeMenuEyebrow = document.getElementById('ticTacToeMenuEyebrow');
    const ticTacToeMenuTitle = document.getElementById('ticTacToeMenuTitle');
    const ticTacToeMenuText = document.getElementById('ticTacToeMenuText');
    const ticTacToeMenuActionButton = document.getElementById('ticTacToeMenuActionButton');
    const ticTacToeMenuRulesButton = document.getElementById('ticTacToeMenuRulesButton');
    const battleshipPlayerBoard = document.getElementById('battleshipPlayerBoard');
    const battleshipEnemyBoard = document.getElementById('battleshipEnemyBoard');
    const battleshipTable = document.getElementById('battleshipTable');
    const battleshipMenuOverlay = document.getElementById('battleshipMenuOverlay');
    const battleshipMenuEyebrow = document.getElementById('battleshipMenuEyebrow');
    const battleshipMenuTitle = document.getElementById('battleshipMenuTitle');
    const battleshipMenuText = document.getElementById('battleshipMenuText');
    const battleshipMenuActionButton = document.getElementById('battleshipMenuActionButton');
    const battleshipMenuRulesButton = document.getElementById('battleshipMenuRulesButton');
    const battleshipPlayerShipsDisplay = document.getElementById('battleshipPlayerShipsDisplay');
    const battleshipEnemyShipsDisplay = document.getElementById('battleshipEnemyShipsDisplay');
    const battleshipPlayerLabel = document.getElementById('battleshipPlayerLabel');
    const battleshipEnemyLabel = document.getElementById('battleshipEnemyLabel');
    const battleshipPlayerBoardLabel = document.getElementById('battleshipPlayerBoardLabel');
    const battleshipEnemyBoardLabel = document.getElementById('battleshipEnemyBoardLabel');
    const battleshipStatusText = document.getElementById('battleshipStatusText');
    const battleshipRestartButton = document.getElementById('battleshipRestartButton');
    const tetrisBoard = document.getElementById('tetrisBoard');
    const tetrisTable = document.getElementById('tetrisTable');
    const tetrisScoreDisplay = document.getElementById('tetrisScoreDisplay');
    const tetrisLinesDisplay = document.getElementById('tetrisLinesDisplay');
    const tetrisStartButton = document.getElementById('tetrisStartButton');
    const tetrisHelpText = document.getElementById('tetrisHelpText');
    const tetrisMenuOverlay = document.getElementById('tetrisMenuOverlay');
    const tetrisMenuEyebrow = document.getElementById('tetrisMenuEyebrow');
    const tetrisMenuTitle = document.getElementById('tetrisMenuTitle');
    const tetrisMenuText = document.getElementById('tetrisMenuText');
    const tetrisMenuActionButton = document.getElementById('tetrisMenuActionButton');
    const tetrisMenuRulesButton = document.getElementById('tetrisMenuRulesButton');
    const pacmanBoard = document.getElementById('pacmanBoard');
    const pacmanTable = document.getElementById('pacmanTable');
    const pacmanScoreDisplay = document.getElementById('pacmanScoreDisplay');
    const pacmanLivesDisplay = document.getElementById('pacmanLivesDisplay');
    const pacmanStartButton = document.getElementById('pacmanStartButton');
    const pacmanHelpText = document.getElementById('pacmanHelpText');
    const pacmanMenuOverlay = document.getElementById('pacmanMenuOverlay');
    const pacmanMenuEyebrow = document.getElementById('pacmanMenuEyebrow');
    const pacmanMenuTitle = document.getElementById('pacmanMenuTitle');
    const pacmanMenuText = document.getElementById('pacmanMenuText');
    const pacmanMenuActionButton = document.getElementById('pacmanMenuActionButton');
    const pacmanMenuRulesButton = document.getElementById('pacmanMenuRulesButton');
    const solitaireStock = document.getElementById('solitaireStock');
    const solitaireWaste = document.getElementById('solitaireWaste');
    const solitaireFoundations = document.getElementById('solitaireFoundations');
    const solitaireTableau = document.getElementById('solitaireTableau');
    const solitaireTable = document.getElementById('solitaireTable');
    const solitaireStockDisplay = document.getElementById('solitaireStockDisplay');
    const solitaireFoundationsDisplay = document.getElementById('solitaireFoundationsDisplay');
    const solitaireRestartButton = document.getElementById('solitaireRestartButton');
    const solitaireHelpText = document.getElementById('solitaireHelpText');
    const solitaireMenuOverlay = document.getElementById('solitaireMenuOverlay');
    const solitaireMenuEyebrow = document.getElementById('solitaireMenuEyebrow');
    const solitaireMenuTitle = document.getElementById('solitaireMenuTitle');
    const solitaireMenuText = document.getElementById('solitaireMenuText');
    const solitaireMenuActionButton = document.getElementById('solitaireMenuActionButton');
    const solitaireMenuRulesButton = document.getElementById('solitaireMenuRulesButton');
    const connect4Board = document.getElementById('connect4Board');
    const connect4TurnDisplay = document.getElementById('connect4TurnDisplay');
    const connect4ScoreDisplay = document.getElementById('connect4ScoreDisplay');
    const connect4HelpText = document.getElementById('connect4HelpText');
    const connect4Table = document.getElementById('connect4Table');
    const connect4MenuOverlay = document.getElementById('connect4MenuOverlay');
    const connect4MenuEyebrow = document.getElementById('connect4MenuEyebrow');
    const connect4MenuTitle = document.getElementById('connect4MenuTitle');
    const connect4MenuText = document.getElementById('connect4MenuText');
    const connect4MenuActionButton = document.getElementById('connect4MenuActionButton');
    const connect4MenuRulesButton = document.getElementById('connect4MenuRulesButton');
    const connect4ModeButtons = document.querySelectorAll('[data-connect4-mode]');
    const rhythmBoard = document.getElementById('rhythmBoard');
    const rhythmTable = document.getElementById('rhythmTable');
    const rhythmScoreDisplay = document.getElementById('rhythmScoreDisplay');
    const rhythmStreakDisplay = document.getElementById('rhythmStreakDisplay');
    const rhythmMissesDisplay = document.getElementById('rhythmMissesDisplay');
    const rhythmTimerDisplay = document.getElementById('rhythmTimerDisplay');
    const rhythmHelpText = document.getElementById('rhythmHelpText');
    const rhythmStartButton = document.getElementById('rhythmStartButton');
    const rhythmMenuOverlay = document.getElementById('rhythmMenuOverlay');
    const rhythmMenuEyebrow = document.getElementById('rhythmMenuEyebrow');
    const rhythmMenuTitle = document.getElementById('rhythmMenuTitle');
    const rhythmMenuText = document.getElementById('rhythmMenuText');
    const rhythmMenuActionButton = document.getElementById('rhythmMenuActionButton');
    const rhythmMenuRulesButton = document.getElementById('rhythmMenuRulesButton');
    const flappyBoard = document.getElementById('flappyBoard');
    const flappyScoreDisplay = document.getElementById('flappyScoreDisplay');
    const flappyBestDisplay = document.getElementById('flappyBestDisplay');
    const flappyHelpText = document.getElementById('flappyHelpText');
    const flappyTable = document.getElementById('flappyTable');
    const flappyMenuOverlay = document.getElementById('flappyMenuOverlay');
    const flappyMenuEyebrow = document.getElementById('flappyMenuEyebrow');
    const flappyMenuTitle = document.getElementById('flappyMenuTitle');
    const flappyMenuText = document.getElementById('flappyMenuText');
    const flappyMenuActionButton = document.getElementById('flappyMenuActionButton');
    const flappyMenuRulesButton = document.getElementById('flappyMenuRulesButton');
    const flowFreeGame = document.getElementById('flowFreeGame');
    const flowFreeBoard = document.getElementById('flowFreeBoard');
    const flowFreeTable = document.getElementById('flowFreeTable');
    const flowFreePairsDisplay = document.getElementById('flowFreePairsDisplay');
    const flowFreeMovesDisplay = document.getElementById('flowFreeMovesDisplay');
    const flowFreeHelpText = document.getElementById('flowFreeHelpText');
    const flowFreeRestartButton = document.getElementById('flowFreeRestartButton');
    const flowFreeMenuOverlay = document.getElementById('flowFreeMenuOverlay');
    const flowFreeMenuEyebrow = document.getElementById('flowFreeMenuEyebrow');
    const flowFreeMenuTitle = document.getElementById('flowFreeMenuTitle');
    const flowFreeMenuText = document.getElementById('flowFreeMenuText');
    const flowFreeMenuActionButton = document.getElementById('flowFreeMenuActionButton');
    const flowFreeMenuRulesButton = document.getElementById('flowFreeMenuRulesButton');
    const magicSortGame = document.getElementById('magicSortGame');
    const magicSortBoard = document.getElementById('magicSortBoard');
    const magicSortTable = document.getElementById('magicSortTable');
    const magicSortSolvedDisplay = document.getElementById('magicSortSolvedDisplay');
    const magicSortMovesDisplay = document.getElementById('magicSortMovesDisplay');
    const magicSortHelpText = document.getElementById('magicSortHelpText');
    const magicSortRestartButton = document.getElementById('magicSortRestartButton');
    const magicSortMenuOverlay = document.getElementById('magicSortMenuOverlay');
    const magicSortMenuEyebrow = document.getElementById('magicSortMenuEyebrow');
    const magicSortMenuTitle = document.getElementById('magicSortMenuTitle');
    const magicSortMenuText = document.getElementById('magicSortMenuText');
    const magicSortMenuActionButton = document.getElementById('magicSortMenuActionButton');
    const magicSortMenuRulesButton = document.getElementById('magicSortMenuRulesButton');
    const mentalMathGame = document.getElementById('mentalMathGame');
    const mentalMathScoreDisplay = document.getElementById('mentalMathScoreDisplay');
    const mentalMathRoundDisplay = document.getElementById('mentalMathRoundDisplay');
    const mentalMathHelpText = document.getElementById('mentalMathHelpText');
    const mentalMathTable = document.getElementById('mentalMathTable');
    const mentalMathMenuOverlay = document.getElementById('mentalMathMenuOverlay');
    const mentalMathMenuEyebrow = document.getElementById('mentalMathMenuEyebrow');
    const mentalMathMenuTitle = document.getElementById('mentalMathMenuTitle');
    const mentalMathMenuText = document.getElementById('mentalMathMenuText');
    const mentalMathMenuActionButton = document.getElementById('mentalMathMenuActionButton');
    const mentalMathMenuRulesButton = document.getElementById('mentalMathMenuRulesButton');
    const mentalMathQuestion = document.getElementById('mentalMathQuestion');
    const mentalMathForm = document.getElementById('mentalMathForm');
    const mentalMathAnswerInput = document.getElementById('mentalMathAnswerInput');
    const mentalMathSubmitButton = document.getElementById('mentalMathSubmitButton');
    const mentalMathKeypadButtons = document.querySelectorAll('[data-mental-math-key], [data-mental-math-action]');
    const mentalMathFeedback = document.getElementById('mentalMathFeedback');
    const candyCrushGame = document.getElementById('candyCrushGame');
    const candyCrushBoard = document.getElementById('candyCrushBoard');
    const candyCrushTable = document.getElementById('candyCrushTable');
    const candyCrushScoreDisplay = document.getElementById('candyCrushScoreDisplay');
    const candyCrushMovesDisplay = document.getElementById('candyCrushMovesDisplay');
    const candyCrushHelpText = document.getElementById('candyCrushHelpText');
    const candyCrushRestartButton = document.getElementById('candyCrushRestartButton');
    const candyCrushMenuOverlay = document.getElementById('candyCrushMenuOverlay');
    const candyCrushMenuEyebrow = document.getElementById('candyCrushMenuEyebrow');
    const candyCrushMenuTitle = document.getElementById('candyCrushMenuTitle');
    const candyCrushMenuText = document.getElementById('candyCrushMenuText');
    const candyCrushMenuActionButton = document.getElementById('candyCrushMenuActionButton');
    const candyCrushMenuRulesButton = document.getElementById('candyCrushMenuRulesButton');
    const harborRunGame = document.getElementById('harborRunGame');
    const harborRunBoard = document.getElementById('harborRunBoard');
    const harborRunTable = document.getElementById('harborRunTable');
    const harborRunScoreDisplay = document.getElementById('harborRunScoreDisplay');
    const harborRunBestDisplay = document.getElementById('harborRunBestDisplay');
    const harborRunHelpText = document.getElementById('harborRunHelpText');
    const harborRunStartButton = document.getElementById('harborRunStartButton');
    const harborRunMenuOverlay = document.getElementById('harborRunMenuOverlay');
    const harborRunMenuEyebrow = document.getElementById('harborRunMenuEyebrow');
    const harborRunMenuTitle = document.getElementById('harborRunMenuTitle');
    const harborRunMenuText = document.getElementById('harborRunMenuText');
    const harborRunMenuActionButton = document.getElementById('harborRunMenuActionButton');
    const harborRunMenuRulesButton = document.getElementById('harborRunMenuRulesButton');
    const stackerGame = document.getElementById('stackerGame');
    const stackerBoard = document.getElementById('stackerBoard');
    const stackerTable = document.getElementById('stackerTable');
    const stackerScoreDisplay = document.getElementById('stackerScoreDisplay');
    const stackerBestDisplay = document.getElementById('stackerBestDisplay');
    const stackerHelpText = document.getElementById('stackerHelpText');
    const stackerStartButton = document.getElementById('stackerStartButton');
    const stackerMenuOverlay = document.getElementById('stackerMenuOverlay');
    const stackerMenuEyebrow = document.getElementById('stackerMenuEyebrow');
    const stackerMenuTitle = document.getElementById('stackerMenuTitle');
    const stackerMenuText = document.getElementById('stackerMenuText');
    const stackerMenuActionButton = document.getElementById('stackerMenuActionButton');
    const stackerMenuRulesButton = document.getElementById('stackerMenuRulesButton');
    const coinClickerGame = document.getElementById('coinClickerGame');
    const coinClickerTable = document.getElementById('coinClickerTable');
    const coinClickerScoreDisplay = document.getElementById('coinClickerScoreDisplay');
    const coinClickerPowerDisplay = document.getElementById('coinClickerPowerDisplay');
    const coinClickerMultiplierDisplay = document.getElementById('coinClickerMultiplierDisplay');
    const coinClickerAutoDisplay = document.getElementById('coinClickerAutoDisplay');
    const coinClickerHelpText = document.getElementById('coinClickerHelpText');
    const coinClickerButton = document.getElementById('coinClickerButton');
    const coinClickerShop = document.getElementById('coinClickerShop');
    const coinClickerResetButton = document.getElementById('coinClickerResetButton');
    const coinClickerMenuOverlay = document.getElementById('coinClickerMenuOverlay');
    const coinClickerMenuEyebrow = document.getElementById('coinClickerMenuEyebrow');
    const coinClickerMenuTitle = document.getElementById('coinClickerMenuTitle');
    const coinClickerMenuText = document.getElementById('coinClickerMenuText');
    const coinClickerMenuActionButton = document.getElementById('coinClickerMenuActionButton');
    const coinClickerMenuRulesButton = document.getElementById('coinClickerMenuRulesButton');

    // Bridge ESM — Coin Clicker est maintenant géré par js/games/coinClicker.js.
    // Ces alias permettent au reste de script.js (listeners, tab-switch, bootstrap)
    // d'appeler le module sans réécrire chaque identifiant.
    const __cc = window.__baie.coinClicker;
    const COIN_CLICKER_UPGRADES = __cc.COIN_CLICKER_UPGRADES;
    const saveCoinClickerState = __cc.saveCoinClickerState;
    const getCoinClickerUpgradeCost = __cc.getCoinClickerUpgradeCost;
    const getCoinClickerCoinsPerClick = __cc.getCoinClickerCoinsPerClick;
    const renderCoinClicker = __cc.renderCoinClicker;
    const startCoinClickerAutoLoop = __cc.startCoinClickerAutoLoop;
    const renderCoinClickerMenu = __cc.renderCoinClickerMenu;
    const closeCoinClickerMenu = __cc.closeCoinClickerMenu;
    const initializeCoinClicker = __cc.initializeCoinClicker;

    // Bridge ESM — Rythme géré par js/games/rhythm.js.
    const __rh = window.__baie.rhythm;
    const renderRhythmMenu = __rh.renderRhythmMenu;
    const closeRhythmMenu = __rh.closeRhythmMenu;
    const startRhythm = __rh.startRhythm;
    const handleRhythmHit = __rh.handleRhythmHit;
    const initializeRhythm = __rh.initializeRhythm;

    // Bridge ESM — Reaction géré par js/games/reaction.js.
    const __rx = window.__baie.reaction;
    const initializeReaction = __rx.initializeReaction;
    const renderReactionMenu = __rx.renderReactionMenu;
    const closeReactionMenu = __rx.closeReactionMenu;
    const startReactionRound = __rx.startReactionRound;
    const handleReactionAttempt = __rx.handleReactionAttempt;

    // Bridge ESM — OursAim géré par js/games/aim.js.
    const __am = window.__baie.aim;
    const initializeAim = __am.initializeAim;
    const renderAimMenu = __am.renderAimMenu;
    const closeAimMenu = __am.closeAimMenu;
    const startAimRound = __am.startAimRound;
    const handleAimTargetHit = __am.handleAimTargetHit;
    const handleAimMiss = __am.handleAimMiss;
    const setAimRoundDuration = __am.setAimRoundDuration;

    // Bridge ESM — MentalMath géré par js/games/mentalMath.js.
    const __mm = window.__baie.mentalMath;
    const initializeMentalMath = __mm.initializeMentalMath;
    const renderMentalMathMenu = __mm.renderMentalMathMenu;
    const startMentalMathLaunchSequence = __mm.startMentalMathLaunchSequence;
    const submitMentalMathAnswer = __mm.submitMentalMathAnswer;
    const handleMentalMathKeypadInput = __mm.handleMentalMathKeypadInput;
    const handleMentalMathKeypadAction = __mm.handleMentalMathKeypadAction;

    // Bridge ESM — Snake géré par js/games/snake.js.
    const __sn = window.__baie.snake;
    const initializeSnake = __sn.initializeSnake;
    const renderSnake = __sn.renderSnake;
    const renderSnakeMenu = __sn.renderSnakeMenu;
    const closeSnakeMenu = __sn.closeSnakeMenu;
    const startSnake = __sn.startSnake;
    const queueSnakeDirectionInput = __sn.queueSnakeDirectionInput;
    const setSnakeGridSize = __sn.setSnakeGridSize;
    const stopSnake = __sn.stopSnake;

    // Bridge ESM — Tetris géré par js/games/tetris.js.
    const __tt = window.__baie.tetris;
    const initializeTetris = __tt.initializeTetris;
    const renderTetrisMenu = __tt.renderTetrisMenu;
    const closeTetrisMenu = __tt.closeTetrisMenu;
    const startTetris = __tt.startTetris;
    const dropTetrisStep = __tt.dropTetrisStep;
    const moveTetrisHorizontally = __tt.moveTetrisHorizontally;
    const rotateTetrisPiece = __tt.rotateTetrisPiece;
    const hardDropTetrisPiece = __tt.hardDropTetrisPiece;

    // Bridge ESM — 2048 géré par js/games/game2048.js.
    const __g2 = window.__baie.game2048;
    const initialize2048 = __g2.initialize2048;
    const render2048 = __g2.render2048;
    const render2048Menu = __g2.render2048Menu;
    const close2048Menu = __g2.close2048Menu;
    const move2048 = __g2.move2048;
    const reveal2048OutcomeMenu = __g2.reveal2048OutcomeMenu;

    // Bridge ESM — Flappy géré par js/games/flappy.js.
    const __fl = window.__baie.flappy;
    const initializeFlappy = __fl.initializeFlappy;
    const renderFlappyMenu = __fl.renderFlappyMenu;
    const startFlappyLaunchSequence = __fl.startFlappyLaunchSequence;
    const flapFlappyBird = __fl.flapFlappyBird;

    // Bridge ESM — Pacman géré par js/games/pacman.js.
    const __pm = window.__baie.pacman;
    const initializePacman = __pm.initializePacman;
    const renderPacmanMenu = __pm.renderPacmanMenu;
    const startPacman = __pm.startPacman;
    const trySetPacmanDirection = __pm.trySetPacmanDirection;
    const closePacmanMenu = __pm.closePacmanMenu;
    const renderPacman = __pm.renderPacman;
    const stopPacman = __pm.stopPacman;

    // Bridge ESM — Breakout géré par js/games/breakout.js.
    const __bk = window.__baie.breakout;
    const initializeBreakout = __bk.initializeBreakout;
    const renderBreakoutMenu = __bk.renderBreakoutMenu;
    const startBreakoutLaunchSequence = __bk.startBreakoutLaunchSequence;
    const updateBreakout = __bk.updateBreakout;
    const drawBreakout = __bk.drawBreakout;
    const stopBreakout = __bk.stopBreakout;

    // Bridge ESM — Memory géré par js/games/memory.js.
    const __mem = window.__baie.memory;
    const initializeMemory = __mem.initializeMemory;
    const renderMemoryMenu = __mem.renderMemoryMenu;
    const startMemoryLaunchSequence = __mem.startMemoryLaunchSequence;
    const handleMemoryCardFlip = __mem.handleMemoryCardFlip;

    // Bridge ESM — Magic Sort géré par js/games/magicSort.js.
    const __ms = window.__baie.magicSort;
    const initializeMagicSort = __ms.initializeMagicSort;
    const renderMagicSortMenu = __ms.renderMagicSortMenu;
    const closeMagicSortMenu = __ms.closeMagicSortMenu;
    const handleMagicSortTubeClick = __ms.handleMagicSortTubeClick;

    // Bridge ESM — HarborRun géré par js/games/harborRun.js.
    const __hr = window.__baie.harborRun;
    const initializeHarborRun = __hr.initializeHarborRun;
    const renderHarborRunMenu = __hr.renderHarborRunMenu;
    const closeHarborRunMenu = __hr.closeHarborRunMenu;
    const startHarborRun = __hr.startHarborRun;
    const moveHarborRun = __hr.moveHarborRun;
    const renderHarborRun = __hr.renderHarborRun;

    // Bridge ESM — Minesweeper géré par js/games/minesweeper.js.
    const __mw = window.__baie.minesweeper;
    const initializeGame = __mw.initializeGame;
    const renderMinesweeperMenu = __mw.renderMinesweeperMenu;
    const closeMinesweeperMenu = __mw.closeMinesweeperMenu;
    const setMinesweeperGridSize = __mw.setMinesweeperGridSize;
    const revealCell = __mw.revealCell;
    const toggleFlag = __mw.toggleFlag;

    // Bridge ESM — Stacker géré par js/games/stacker.js.
    const __st = window.__baie.stacker;
    const initializeStacker = __st.initializeStacker;
    const renderStackerMenu = __st.renderStackerMenu;
    const closeStackerMenu = __st.closeStackerMenu;
    const startStacker = __st.startStacker;
    const dropStackerLayer = __st.dropStackerLayer;

    // Bridge ESM — Solitaire géré par js/games/solitaire.js.
    const __sol = window.__baie.solitaire;
    const initializeSolitaire = __sol.initializeSolitaire;
    const renderSolitaire = __sol.renderSolitaire;
    const renderSolitaireMenu = __sol.renderSolitaireMenu;
    const closeSolitaireMenu = __sol.closeSolitaireMenu;
    const drawSolitaireCard = __sol.drawSolitaireCard;
    const selectSolitaireSource = __sol.selectSolitaireSource;
    const moveSelectedSolitaireToFoundation = __sol.moveSelectedSolitaireToFoundation;
    const moveSelectedSolitaireToTableau = __sol.moveSelectedSolitaireToTableau;
    const clearSolitaireSelection = __sol.clearSolitaireSelection;

    // Bridge ESM — Sudoku géré par js/games/sudoku.js.
    const __su = window.__baie.sudoku;
    const initializeSudoku = __su.initializeSudoku;
    const renderSudokuMenu = __su.renderSudokuMenu;
    const closeSudokuMenu = __su.closeSudokuMenu;
    const renderSudoku = __su.renderSudoku;
    const updateSudokuCell = __su.updateSudokuCell;
    const setSudokuSelectedCell = __su.setSudokuSelectedCell;
    const cycleSudokuDifficulty = __su.cycleSudokuDifficulty;
    const startSudokuTimer = __su.startSudokuTimer;
    const stopSudokuTimer = __su.stopSudokuTimer;

    // Bridge ESM — BlockBlast géré par js/games/blockBlast.js.
    const __bb = window.__baie.blockBlast;
    const initializeBlockBlast = __bb.initializeBlockBlast;
    const renderBlockBlast = __bb.renderBlockBlast;
    const renderBlockBlastMenu = __bb.renderBlockBlastMenu;
    const closeBlockBlastMenu = __bb.closeBlockBlastMenu;
    const placeBlockBlastPiece = __bb.placeBlockBlastPiece;
    const placeBlockBlastPieceAtIndex = __bb.placeBlockBlastPieceAtIndex;
    const updateBlockBlastPreview = __bb.updateBlockBlastPreview;
    const clearBlockBlastPreview = __bb.clearBlockBlastPreview;
    const getBlockBlastAnchorFromPoint = __bb.getBlockBlastAnchorFromPoint;
    const stopBlockBlastDrag = __bb.stopBlockBlastDrag;
    const canPlaceBlockBlastPiece = __bb.canPlaceBlockBlastPiece;
    const renderBlockBlastPieces = __bb.renderBlockBlastPieces;

    // Bridge ESM — CandyCrush géré par js/games/candyCrush.js.
    const __cc2 = window.__baie.candyCrush;
    const initializeCandyCrush = __cc2.initializeCandyCrush;
    const renderCandyCrush = __cc2.renderCandyCrush;
    const renderCandyCrushMenu = __cc2.renderCandyCrushMenu;
    const closeCandyCrushMenu = __cc2.closeCandyCrushMenu;
    const tryCandyCrushSwap = __cc2.tryCandyCrushSwap;

    // Bridge ESM — BaieBerry géré par js/games/baieBerry.js.
    const __bb2 = window.__baie.baieBerry;
    const initializeBaieBerry = __bb2.initializeBaieBerry;
    const renderBaieBerryMenu = __bb2.renderBaieBerryMenu;
    const startBaieBerryLaunchSequence = __bb2.startBaieBerryLaunchSequence;
    const drawBaieBerry = __bb2.drawBaieBerry;
    const updateBaieBerry = __bb2.updateBaieBerry;
    const dropBaieBerryAt = __bb2.dropBaieBerryAt;
    const updateBaieBerryDropGuide = __bb2.updateBaieBerryDropGuide;
    const stopBaieBerry = __bb2.stopBaieBerry;

    // Bridge ESM — FlowFree géré par js/games/flowFree.js.
    const __ff = window.__baie.flowFree;
    const initializeFlowFree = __ff.initializeFlowFree;
    const renderFlowFree = __ff.renderFlowFree;
    const renderFlowFreeMenu = __ff.renderFlowFreeMenu;
    const closeFlowFreeMenu = __ff.closeFlowFreeMenu;
    const startFlowFreePath = __ff.startFlowFreePath;
    const extendFlowFreePath = __ff.extendFlowFreePath;
    const stopFlowFreePath = __ff.stopFlowFreePath;
    const scheduleFlowFreeRender = __ff.scheduleFlowFreeRender;
    const flushFlowFreePendingTarget = __ff.flushFlowFreePendingTarget;

    // Bridge ESM — Checkers géré par js/games/checkers.js.
    const __ck = window.__baie.checkers;
    const initializeCheckers = __ck.initializeCheckers;
    const renderCheckersMenu = __ck.renderCheckersMenu;
    const startCheckersLaunchSequence = __ck.startCheckersLaunchSequence;
    const handleCheckersCellClick = __ck.handleCheckersCellClick;
    const handleCheckersPiecePointerDown = __ck.handleCheckersPiecePointerDown;
    const handleCheckersPointerMove = __ck.handleCheckersPointerMove;
    const handleCheckersPointerUp = __ck.handleCheckersPointerUp;
    const setCheckersMode = __ck.setCheckersMode;
    const isMultiplayerCheckersActive = __ck.isMultiplayerCheckersActive;
    const syncMultiplayerCheckersState = __ck.syncMultiplayerCheckersState;
    const renderCheckers = __ck.renderCheckers;
    const maybeOpenCheckersOutcomeModal = __ck.maybeOpenCheckersOutcomeModal;
    const maybePlayCheckersCaptureFx = __ck.maybePlayCheckersCaptureFx;
    const scheduleCheckersMoveAnimationClear = __ck.scheduleCheckersMoveAnimationClear;

    // Bridge ESM — TicTacToe géré par js/games/ticTacToe.js.
    const __ttt = window.__baie.ticTacToe;
    const initializeTicTacToe = __ttt.initializeTicTacToe;
    const renderTicTacToeMenu = __ttt.renderTicTacToeMenu;
    const closeTicTacToeMenu = __ttt.closeTicTacToeMenu;
    const showTicTacToeMenu = __ttt.showTicTacToeMenu;
    const handleTicTacToeMove = __ttt.handleTicTacToeMove;
    const setTicTacToeMode = __ttt.setTicTacToeMode;
    const isMultiplayerTicTacToeActive = __ttt.isMultiplayerTicTacToeActive;
    const syncMultiplayerTicTacToeState = __ttt.syncMultiplayerTicTacToeState;

    // Bridge ESM — Connect4 géré par js/games/connect4.js.
    const __c4 = window.__baie.connect4;
    const initializeConnect4 = __c4.initializeConnect4;
    const renderConnect4Menu = __c4.renderConnect4Menu;
    const startConnect4LaunchSequence = __c4.startConnect4LaunchSequence;
    const handleConnect4Move = __c4.handleConnect4Move;
    const setConnect4Mode = __c4.setConnect4Mode;
    const isMultiplayerConnect4Active = __c4.isMultiplayerConnect4Active;
    const syncMultiplayerConnect4State = __c4.syncMultiplayerConnect4State;

    // Bridge ESM — Battleship géré par js/games/battleship.js.
    const __bs = window.__baie.battleship;
    const initializeBattleship = __bs.initializeBattleship;
    const renderBattleship = __bs.renderBattleship;
    const renderBattleshipMenu = __bs.renderBattleshipMenu;
    const closeBattleshipMenu = __bs.closeBattleshipMenu;
    const handleBattleshipShot = __bs.handleBattleshipShot;
    const setBattleshipMode = __bs.setBattleshipMode;
    const isMultiplayerBattleshipActive = __bs.isMultiplayerBattleshipActive;
    const syncMultiplayerBattleshipState = __bs.syncMultiplayerBattleshipState;

    // Bridge ESM — Bomb géré par js/games/bomb.js.
    const __bm = window.__baie.bomb;
    const initializeBomb = __bm.initializeBomb;
    const renderBomb = __bm.renderBomb;
    const renderBombMenu = __bm.renderBombMenu;
    const closeBombMenu = __bm.closeBombMenu;
    const handleBombLocalSubmit = __bm.handleBombLocalSubmit;
    const startBombLocalRound = __bm.startBombLocalRound;
    const isBombLocalActive = __bm.isBombLocalActive;
    const isMultiplayerBombActive = __bm.isMultiplayerBombActive;
    const stopBombTimerLoop = __bm.stopBombTimerLoop;
    const startBombTimerLoop = __bm.startBombTimerLoop;
    const syncMultiplayerBombState = __bm.syncMultiplayerBombState;
    const maybeOpenBombOutcomeModal = __bm.maybeOpenBombOutcomeModal;
    const renderBombPlayers = __bm.renderBombPlayers;
    const renderBombUsedWords = __bm.renderBombUsedWords;

    // Bridge ESM — Chess géré par js/games/chess.js.
    const __ch = window.__baie.chess;
    const initializeChess = __ch.initializeChess;
    const renderChess = __ch.renderChess;
    const renderChessMenu = __ch.renderChessMenu;
    const startChessLaunchSequence = __ch.startChessLaunchSequence;
    const handleChessCellClick = __ch.handleChessCellClick;
    const handleChessPiecePointerDown = __ch.handleChessPiecePointerDown;
    const handleChessPointerMove = __ch.handleChessPointerMove;
    const handleChessPointerUp = __ch.handleChessPointerUp;
    const setChessMode = __ch.setChessMode;
    const isMultiplayerChessActive = __ch.isMultiplayerChessActive;
    const syncMultiplayerChessState = __ch.syncMultiplayerChessState;
    const maybeOpenChessOutcomeModal = __ch.maybeOpenChessOutcomeModal;
    const maybePlayChessCaptureFx = __ch.maybePlayChessCaptureFx;
    const scheduleChessMoveAnimationClear = __ch.scheduleChessMoveAnimationClear;

    // Bridge ESM — Uno géré par js/games/uno.js.
    const __uno = window.__baie.uno;
    const initializeUno = __uno.initializeUno;
    const renderUno = __uno.renderUno;
    const renderUnoMenu = __uno.renderUnoMenu;
    const startUnoLaunchSequence = __uno.startUnoLaunchSequence;
    const setUnoMode = __uno.setUnoMode;
    const isMultiplayerUnoActive = __uno.isMultiplayerUnoActive;
    const syncMultiplayerUnoState = __uno.syncMultiplayerUnoState;
    const handleSoloUnoCardPlay = __uno.handleSoloUnoCardPlay;
    const drawSoloUnoCard = __uno.drawSoloUnoCard;
    const chooseSoloUnoColor = __uno.chooseSoloUnoColor;
    const maybeOpenUnoOutcomeModal = __uno.maybeOpenUnoOutcomeModal;
    const showUnoEvent = __uno.showUnoEvent;
    const getUnoDisplayColor = __uno.getUnoDisplayColor;

    // Bridge ESM — AirHockey géré par js/games/airHockey.js.
    const __ah = window.__baie.airHockey;
    const initializeAirHockey = __ah.initializeAirHockey;
    const renderAirHockey = __ah.renderAirHockey;
    const renderAirHockeyMenu = __ah.renderAirHockeyMenu;
    const closeAirHockeyMenu = __ah.closeAirHockeyMenu;
    const setAirHockeyMode = __ah.setAirHockeyMode;
    const isMultiplayerAirHockeyActive = __ah.isMultiplayerAirHockeyActive;
    const syncMultiplayerAirHockeyState = __ah.syncMultiplayerAirHockeyState;
    const pushMultiplayerAirHockeyInput = __ah.pushMultiplayerAirHockeyInput;
    const startAirHockeyCountdown = __ah.startAirHockeyCountdown;
    const launchAirHockeyPuck = __ah.launchAirHockeyPuck;
    const stopAirHockeyRuntime = __ah.stopAirHockeyRuntime;
    const updateAirHockey = __ah.updateAirHockey;

    // Bridge ESM — Pong géré par js/games/pong.js.
    const __pg = window.__baie.pong;
    const initializePong = __pg.initializePong;
    const renderPong = __pg.renderPong;
    const renderPongMenu = __pg.renderPongMenu;
    const startPong = __pg.startPong;
    const stopPong = __pg.stopPong;
    const setPongMode = __pg.setPongMode;
    const isMultiplayerPongActive = __pg.isMultiplayerPongActive;
    const syncMultiplayerPongState = __pg.syncMultiplayerPongState;
    const pushMultiplayerPongInput = __pg.pushMultiplayerPongInput;
    const startPongLaunchSequence = __pg.startPongLaunchSequence;
    const resetPongRound = __pg.resetPongRound;
    const resetPongMatch = __pg.resetPongMatch;
    const pausePong = __pg.pausePong;
    const resumePong = __pg.resumePong;

    // Bridge ESM — js/multiplayer/state.js est la source de vérité que lisent
    // les 9 modules games/ (getMultiplayerActiveRoom / getMultiplayerSocket).
    // script.js garde ses variables locales, il faut donc propager chaque
    // mutation au module pour que isMultiplayer<Game>Active() voie la room.
    const __mpState = window.__baie.multiplayerState;
    function syncMultiplayerStateBridge() {
        __mpState.setMultiplayerSocket(multiplayerSocket);
        __mpState.setMultiplayerActiveRoom(multiplayerActiveRoom);
        __mpState.setMultiplayerSelectedGameId(multiplayerSelectedGameId);
        __mpState.setMultiplayerEntryMode(multiplayerEntryMode);
        __mpState.setMultiplayerBusy(multiplayerBusy);
        __mpState.setMultiplayerChatSignature(multiplayerChatSignature);
    }

    const chessGame = document.getElementById('chessGame');
    const chessBoard = document.getElementById('chessBoard');
    const chessTurnDisplay = document.getElementById('chessTurnDisplay');
    const chessStatusDisplay = document.getElementById('chessStatusDisplay');
    const chessHelpText = document.getElementById('chessHelpText');
    const chessTable = document.getElementById('chessTable');
    const chessMenuOverlay = document.getElementById('chessMenuOverlay');
    const chessMenuEyebrow = document.getElementById('chessMenuEyebrow');
    const chessMenuTitle = document.getElementById('chessMenuTitle');
    const chessMenuText = document.getElementById('chessMenuText');
    const chessMenuActionButton = document.getElementById('chessMenuActionButton');
    const chessMenuRulesButton = document.getElementById('chessMenuRulesButton');
    const chessModeButtons = document.querySelectorAll('[data-chess-mode]');
    const checkersGame = document.getElementById('checkersGame');
    const checkersBoard = document.getElementById('checkersBoard');
    const checkersTurnDisplay = document.getElementById('checkersTurnDisplay');
    const checkersCountDisplay = document.getElementById('checkersCountDisplay');
    const checkersHelpText = document.getElementById('checkersHelpText');
    const checkersTable = document.getElementById('checkersTable');
    const checkersMenuOverlay = document.getElementById('checkersMenuOverlay');
    const checkersMenuEyebrow = document.getElementById('checkersMenuEyebrow');
    const checkersMenuTitle = document.getElementById('checkersMenuTitle');
    const checkersMenuText = document.getElementById('checkersMenuText');
    const checkersMenuActionButton = document.getElementById('checkersMenuActionButton');
    const checkersMenuRulesButton = document.getElementById('checkersMenuRulesButton');
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
    const airHockeyMenuOverlay = document.getElementById('airHockeyMenuOverlay');
    const airHockeyMenuEyebrow = document.getElementById('airHockeyMenuEyebrow');
    const airHockeyMenuTitle = document.getElementById('airHockeyMenuTitle');
    const airHockeyMenuText = document.getElementById('airHockeyMenuText');
    const airHockeyMenuActionButton = document.getElementById('airHockeyMenuActionButton');
    const airHockeyMenuRulesButton = document.getElementById('airHockeyMenuRulesButton');
    const reactionGame = document.getElementById('reactionGame');
    const reactionLastDisplay = document.getElementById('reactionLastDisplay');
    const reactionBestDisplay = document.getElementById('reactionBestDisplay');
    const reactionHelpText = document.getElementById('reactionHelpText');
    const reactionTable = document.getElementById('reactionTable');
    const reactionMenuOverlay = document.getElementById('reactionMenuOverlay');
    const reactionMenuEyebrow = document.getElementById('reactionMenuEyebrow');
    const reactionMenuTitle = document.getElementById('reactionMenuTitle');
    const reactionMenuText = document.getElementById('reactionMenuText');
    const reactionMenuActionButton = document.getElementById('reactionMenuActionButton');
    const reactionMenuRulesButton = document.getElementById('reactionMenuRulesButton');
    const reactionLantern = document.getElementById('reactionLantern');
    const baieBerryGame = document.getElementById('baieBerryGame');
    const baieBerryCanvas = document.getElementById('baieBerryCanvas');
    const baieBerryContext = baieBerryCanvas?.getContext('2d');
    const baieBerryTable = document.getElementById('baieBerryTable');
    const baieBerryStage = baieBerryGame?.querySelector('.baieberry-stage');
    const baieBerryDropLine = document.getElementById('baieBerryDropLine');
    const baieBerryDropGuide = document.getElementById('baieBerryDropGuide');
    const baieBerryScoreDisplay = document.getElementById('baieBerryScoreDisplay');
    const baieBerryBestDisplay = document.getElementById('baieBerryBestDisplay');
    const baieBerryNextDisplay = document.getElementById('baieBerryNextDisplay');
    const baieBerryObjectiveDisplay = { textContent: '' };
    const baieBerryHelpText = document.getElementById('baieBerryHelpText');
    const baieBerryMenuOverlay = document.getElementById('baieBerryMenuOverlay');
    const baieBerryMenuEyebrow = document.getElementById('baieBerryMenuEyebrow');
    const baieBerryMenuTitle = document.getElementById('baieBerryMenuTitle');
    const baieBerryMenuText = document.getElementById('baieBerryMenuText');
    const baieBerryMenuActionButton = document.getElementById('baieBerryMenuActionButton');
    const baieBerryMenuRulesButton = document.getElementById('baieBerryMenuRulesButton');
    const breakoutGame = document.getElementById('breakoutGame');
    const breakoutCanvas = document.getElementById('breakoutCanvas');
    const breakoutContext = breakoutCanvas?.getContext('2d');
    const breakoutScoreDisplay = document.getElementById('breakoutScoreDisplay');
    const breakoutLivesDisplay = document.getElementById('breakoutLivesDisplay');
    const breakoutHelpText = document.getElementById('breakoutHelpText');
    const breakoutTable = document.getElementById('breakoutTable');
    const breakoutMenuOverlay = document.getElementById('breakoutMenuOverlay');
    const breakoutMenuEyebrow = document.getElementById('breakoutMenuEyebrow');
    const breakoutMenuTitle = document.getElementById('breakoutMenuTitle');
    const breakoutMenuText = document.getElementById('breakoutMenuText');
    const breakoutMenuActionButton = document.getElementById('breakoutMenuActionButton');
    const breakoutMenuRulesButton = document.getElementById('breakoutMenuRulesButton');
    const blockBlastGame = document.getElementById('blockBlastGame');
    const blockBlastBoard = document.getElementById('blockBlastBoard');
    const blockBlastTable = document.getElementById('blockBlastTable');
    const blockBlastPieces = document.getElementById('blockBlastPieces');
    const blockBlastScoreDisplay = document.getElementById('blockBlastScoreDisplay');
    const blockBlastComboDisplay = document.getElementById('blockBlastComboDisplay');
    const blockBlastHelpText = document.getElementById('blockBlastHelpText');
    const blockBlastStartButton = document.getElementById('blockBlastStartButton');
    const blockBlastMenuOverlay = document.getElementById('blockBlastMenuOverlay');
    const blockBlastMenuEyebrow = document.getElementById('blockBlastMenuEyebrow');
    const blockBlastMenuTitle = document.getElementById('blockBlastMenuTitle');
    const blockBlastMenuText = document.getElementById('blockBlastMenuText');
    const blockBlastMenuActionButton = document.getElementById('blockBlastMenuActionButton');
    const blockBlastMenuRulesButton = document.getElementById('blockBlastMenuRulesButton');
    const unoGame = document.getElementById('unoGame');
    const unoModeButtons = document.querySelectorAll('[data-uno-mode]');
    const unoModeDisplay = document.getElementById('unoModeDisplay');
    const unoHandCountDisplay = document.getElementById('unoHandCountDisplay');
    const unoHelpText = document.getElementById('unoHelpText');
    const unoOpponentsTop = document.getElementById('unoOpponentsTop');
    const unoOpponentsLeft = document.getElementById('unoOpponentsLeft');
    const unoOpponentsRight = document.getElementById('unoOpponentsRight');
    const unoDrawButton = document.getElementById('unoDrawButton');
    const unoDiscardPile = document.getElementById('unoDiscardPile');
    const unoTurnDisplay = document.getElementById('unoTurnDisplay');
    const unoColorPicker = document.getElementById('unoColorPicker');
    const unoColorChoiceButtons = document.querySelectorAll('[data-uno-color]');
    const unoEventBanner = document.getElementById('unoEventBanner');
    const unoHand = document.getElementById('unoHand');
    const unoTable = unoGame?.querySelector('.uno-table') || null;
    const unoMenuOverlay = document.getElementById('unoMenuOverlay');
    const unoMenuEyebrow = document.getElementById('unoMenuEyebrow');
    const unoMenuTitle = document.getElementById('unoMenuTitle');
    const unoMenuText = document.getElementById('unoMenuText');
    const unoMenuActionButton = document.getElementById('unoMenuActionButton');
    const unoMenuRulesButton = document.getElementById('unoMenuRulesButton');
    const bombGame = document.getElementById('bombGame');
    const bombTable = document.getElementById('bombTable');
    const bombSyllableDisplay = document.getElementById('bombSyllableDisplay');
    const bombSpotlightSyllable = document.getElementById('bombSpotlightSyllable');
    const bombTimerDisplay = document.getElementById('bombTimerDisplay');
    const bombTurnDisplay = document.getElementById('bombTurnDisplay');
    const bombHelpText = document.getElementById('bombHelpText');
    const bombStatusBanner = document.getElementById('bombStatusBanner');
    const bombSpotlightPlayer = document.getElementById('bombSpotlightPlayer');
    const bombPlayersBoard = document.getElementById('bombPlayersBoard');
    const bombUsedWords = document.getElementById('bombUsedWords');
    const bombWordForm = document.getElementById('bombWordForm');
    const bombWordInput = document.getElementById('bombWordInput');
    const bombWordSubmitButton = document.getElementById('bombWordSubmitButton');
    const bombRestartButton = document.getElementById('bombRestartButton');
    const bombMenuOverlay = document.getElementById('bombMenuOverlay');
    const bombMenuEyebrow = document.getElementById('bombMenuEyebrow');
    const bombMenuTitle = document.getElementById('bombMenuTitle');
    const bombMenuText = document.getElementById('bombMenuText');
    const bombMenuActionButton = document.getElementById('bombMenuActionButton');
    const bombMenuRulesButton = document.getElementById('bombMenuRulesButton');
    const bombMenuModeButtons = document.querySelectorAll('[data-bomb-mode]');
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
    let multiplayerSocket = null;
    let multiplayerActiveRoom = null;
    let multiplayerBusy = false;
    let multiplayerSelectedGameId = null;
    let multiplayerEntryMode = 'create';
    let multiplayerChatSignature = '';
    let ticTacToeLastFinishedStateKey = '';
    let activeGameTab = 'home';
    // Bridge pour les modules ESM : expose l'onglet actif courant.
    if (typeof window !== 'undefined') {
        window.__baieActiveGameTab = () => activeGameTab;
    }
    // UNO_MENU_CLOSE_DURATION_MS et GRID_OUTCOME_MENU_DELAY_MS : exposees sur window par js/main.js.
    let activeMathTab = 'mathCalculatorPanel';
    let activeMusicTab = 'musicHomePanel';

    // loadSession, saveSession, clearSession, scheduleSessionTimeout, registerActivity : exposes sur window par js/main.js (source = js/core/session.js).

    function loadMovies() {
        return [];
    }

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
            onComplete: () => activatePanel('dashboardSection')
        });
    }

    function showGames() {
        if (!__mw.isMinesweeperInitialized()) {
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
        window.activatePanel(targetId);
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
            loadMovies
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

    function updateCatalogResultsSummary(filteredMovies) {
        window.updateCatalogResultsSummary(getCinemaCatalogContext(), filteredMovies);
    }

    function getFilteredMovies() {
        return window.getFilteredMovies(getCinemaCatalogContext());
    }

    function renderStats() {
        window.renderStats(getCinemaCatalogContext());
    }

    function renderCatalog() {
        return window.renderCatalog(getCinemaCatalogContext());
    }

    function renderManageList() {
        window.renderManageList(getCinemaCatalogContext());
    }

    function renderAll() {
        applyCinemaCatalogState(window.renderCinemaCatalogAll(getCinemaCatalogContext()));
    }

    function closeDeleteModal() {
        window.closeConfirmModal();
    }

    // openLegalNoticeModal / closeLegalNoticeModal : exposes sur window par js/main.js (source = js/core/modals.js).

    function getSelectedMultiplayerGame() {
        syncMultiplayerStateBridge();
        return window.getSelectedMultiplayerGame(multiplayerSelectedGameId);
    }

    function getSelectedMultiplayerGameLabel() {
        syncMultiplayerStateBridge();
        return window.getSelectedMultiplayerGameLabel();
    }

    // getMultiplayerGameLabel : expose sur window par js/main.js (source = js/multiplayer/status.js).

    function getCurrentMultiplayerPlayer() {
        syncMultiplayerStateBridge();
        return __mpState.getCurrentMultiplayerPlayer();
    }

    function isCurrentMultiplayerHost() {
        syncMultiplayerStateBridge();
        return __mpState.isCurrentMultiplayerHost();
    }

    function getMultiplayerReadySummary() {
        syncMultiplayerStateBridge();
        return __mpState.getMultiplayerReadySummary();
    }

    function isCurrentPlayerMultiplayerReady() {
        syncMultiplayerStateBridge();
        return __mpState.isCurrentPlayerMultiplayerReady();
    }

    function isMultiplayerLaunchPending(gameId = multiplayerActiveRoom?.gameId) {
        syncMultiplayerStateBridge();
        return __mpState.isMultiplayerLaunchPending(gameId);
    }

    function syncMultiplayerEntryModeAccess() {
        syncMultiplayerStateBridge();
        window.syncMultiplayerEntryModeAccess();
        multiplayerEntryMode = __mpState.getMultiplayerEntryMode();
        multiplayerCreateLeaveButton = document.getElementById('multiplayerCreateLeaveButton');
    }

    function ensureMultiplayerCreateLeaveButton() {
        syncMultiplayerStateBridge();
        multiplayerCreateLeaveButton = window.ensureMultiplayerCreateLeaveButton(() => leaveMultiplayerRoom());
        return multiplayerCreateLeaveButton;
    }

    function getPreferredMultiplayerPlayerName(preferredSource = multiplayerEntryMode) {
        syncMultiplayerStateBridge();
        return window.getPreferredMultiplayerPlayerName(preferredSource);
    }

    function getMultiplayerRoomUiSignature(room) {
        if (!room) {
            return 'no-room';
        }

        const playersSignature = Array.isArray(room.players)
            ? room.players.map((player) => `${player.id}:${player.name}:${player.isHost ? 'h' : '-'}:${player.isYou ? 'y' : '-'}:${player.roomReady ? 'r' : '-'}`).join('|')
            : '';

        return [
            room.code || '',
            room.gameId || '',
            room.hostId || '',
            Number(room.playerCount || 0),
            Number(room.maxPlayers || 0),
            Number(room.readyCount || 0),
            Boolean(room.gameLaunched),
            playersSignature
        ].join('::');
    }

    function syncMultiplayerPlayerNames(source = 'create') {
        syncMultiplayerStateBridge();
        return window.syncMultiplayerPlayerNames(source);
    }

    function setMultiplayerEntryMode(mode) {
        multiplayerEntryMode = mode === 'join' ? 'join' : 'create';
        syncMultiplayerStateBridge();
        return window.setMultiplayerEntryMode(multiplayerEntryMode);
    }

    // setMultiplayerStatus : expose sur window par js/main.js (source = js/multiplayer/status.js).

    function renderMultiplayerPlayers() {
        syncMultiplayerStateBridge();
        return window.renderMultiplayerPlayers(multiplayerActiveRoom);
    }

    function isMultiplayerChatVisible() {
        return Boolean(
            multiplayerActiveRoom?.code
            && multiplayerActiveRoom?.gameLaunched
            && MULTIPLAYER_SUPPORTED_GAMES[activeGameTab]
            && multiplayerActiveRoom.gameId === activeGameTab
        );
    }

    function renderMultiplayerChatMessages() {
        syncMultiplayerStateBridge();
        multiplayerChatSignature = window.renderMultiplayerChatMessages(multiplayerActiveRoom);
        syncMultiplayerStateBridge();
        return multiplayerChatSignature;
    }

    function updateMultiplayerChatPanel() {
        syncMultiplayerStateBridge();
        multiplayerChatSignature = window.updateMultiplayerChatPanel({
            activeRoom: multiplayerActiveRoom,
            socket: multiplayerSocket,
            activeGameTab
        });
        syncMultiplayerStateBridge();
        return multiplayerChatSignature;
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

    function updateMultiplayerGameTileSelection() {
        syncMultiplayerStateBridge();
        return window.updateMultiplayerGameTileSelection();
    }

    function syncGameMenuOverlayBounds(overlayElement, hostElement) {
        return window.syncGameMenuOverlayBounds(overlayElement, hostElement);
    }

    function syncAllGameMenuOverlayBounds() {
        return window.syncAllGameMenuOverlayBounds();
    }





    function updateMultiplayerLobby(preserveStatus = false) {
        syncMultiplayerStateBridge();
        window.updateMultiplayerLobby({
            preserveStatus,
            onLeave: () => leaveMultiplayerRoom(),
            activeGameTab
        });
        multiplayerEntryMode = __mpState.getMultiplayerEntryMode();
        multiplayerCreateLeaveButton = document.getElementById('multiplayerCreateLeaveButton');
        multiplayerChatSignature = __mpState.getMultiplayerChatSignature();
    }

    // loadSocketIoClient, getMultiplayerServerOrigin, getMultiplayerApiUrl : exposes sur window par js/main.js (source = js/multiplayer/connection.js).

    async function ensureMultiplayerConnection() {
        if (multiplayerSocket?.connected) {
            return multiplayerSocket;
        }

        const ioFactory = await loadSocketIoClient();

        if (!multiplayerSocket) {
            multiplayerSocket = ioFactory(getMultiplayerServerOrigin(), {
                transports: ['websocket', 'polling']
            });
            syncMultiplayerStateBridge();

            multiplayerSocket.on('connect', () => {
                setMultiplayerStatus('Connexion multijoueur etablie.');
                syncMultiplayerStateBridge();
            });

            multiplayerSocket.on('room:joined', (room) => {
                multiplayerActiveRoom = room;
                if (MULTIPLAYER_SUPPORTED_GAMES[room.gameId]) {
                    multiplayerSelectedGameId = room.gameId;
                }
                multiplayerEntryMode = isCurrentMultiplayerHost() ? 'create' : 'join';
                syncMultiplayerStateBridge();
                syncMultiplayerAirHockeyState();
                syncMultiplayerBattleshipState();
                syncMultiplayerPongState();
                syncMultiplayerTicTacToeState();
                syncMultiplayerConnect4State();
                syncMultiplayerChessState();
                syncMultiplayerCheckersState();
                syncMultiplayerUnoState();
                syncMultiplayerBombState();
                syncMultiplayerEntryModeAccess();
                updateMultiplayerLobby();
                updateMultiplayerChatPanel();
            });

            multiplayerSocket.on('room:updated', (room) => {
                const previousUiSignature = getMultiplayerRoomUiSignature(multiplayerActiveRoom);
                multiplayerActiveRoom = room;
                if (MULTIPLAYER_SUPPORTED_GAMES[room.gameId]) {
                    multiplayerSelectedGameId = room.gameId;
                }
                multiplayerEntryMode = isCurrentMultiplayerHost() ? 'create' : 'join';
                syncMultiplayerStateBridge();
                syncMultiplayerAirHockeyState();
                syncMultiplayerBattleshipState();
                syncMultiplayerPongState();
                syncMultiplayerTicTacToeState();
                syncMultiplayerConnect4State();
                syncMultiplayerChessState();
                syncMultiplayerCheckersState();
                syncMultiplayerUnoState();
                syncMultiplayerBombState();
                const nextUiSignature = getMultiplayerRoomUiSignature(room);
                if (previousUiSignature !== nextUiSignature) {
                    syncMultiplayerEntryModeAccess();
                    updateMultiplayerLobby();
                }
                updateMultiplayerChatPanel();
            });

            multiplayerSocket.on('room:error', ({ message }) => {
                setMultiplayerStatus(message || 'Une erreur room est survenue.');
            });

            multiplayerSocket.on('room:left', () => {
                multiplayerActiveRoom = null;
                multiplayerEntryMode = 'create';
                syncMultiplayerStateBridge();
                __ah.resetAirHockeyMultiplayerTrackers();
                ticTacToeLastFinishedStateKey = '';
                __bm.setBombState(null);
                stopBombTimerLoop();
                multiplayerCurrentRoomCode.textContent = '-';
                multiplayerLobbyPlayersBlock?.classList.add('hidden');
                if (multiplayerJoinRoomCodeInput) {
                    multiplayerJoinRoomCodeInput.value = '';
                }
                closeGameOverModal();
                if (activeGameTab === 'battleship') {
                    initializeBattleship();
                }
                if (activeGameTab === 'airHockey') {
                    initializeAirHockey();
                }
                if (activeGameTab === 'pong') {
                    initializePong();
                }
                if (activeGameTab === 'uno') {
                    initializeUno();
                }
                if (activeGameTab === 'bomb') {
                    initializeBomb();
                }
                syncMultiplayerEntryModeAccess();
                updateMultiplayerLobby();
                updateMultiplayerChatPanel();
            });

            multiplayerSocket.on('room:game:start', ({ gameId }) => {
                setMultiplayerStatus(`${getMultiplayerGameLabel(gameId)} se lance pour toute la room.`);
                // room:game:start ouvre juste la vue du jeu pour tous les clients.
                // gameLaunched n'est pas encore true ici : il le deviendra quand
                // le serveur aura exécuté launchRoomGame (tous les joueurs prêts),
                // et le room:updated qui suit mettra à jour multiplayerActiveRoom.
                if (gameId === 'uno') {
                    __uno.setUnoMenuVisible(true);
                    __uno.setUnoMenuShowingRules(false);
                    __uno.setUnoMenuClosing(false);
                }
                openSelectedGame(gameId);
                updateMultiplayerChatPanel();
            });

            multiplayerSocket.on('disconnect', () => {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
            });
        }

        if (multiplayerSocket.connected) {
            return multiplayerSocket;
        }

        await new Promise((resolve, reject) => {
            multiplayerSocket.once('connect', resolve);
            multiplayerSocket.once('connect_error', () => reject(new Error('Serveur multijoueur inaccessible.')));
        });

        return multiplayerSocket;
    }

    async function createMultiplayerRoom() {
        const selectedGame = getSelectedMultiplayerGame();

        if (multiplayerActiveRoom?.code) {
            await launchMultiplayerGame();
            return;
        }

        if (!selectedGame || multiplayerBusy) {
            updateMultiplayerLobby();
            return;
        }

        multiplayerBusy = true;
        updateMultiplayerLobby();
        setMultiplayerStatus(`Création d'une room pour ${MULTIPLAYER_SUPPORTED_GAMES[selectedGame]}...`);

        try {
            const response = await fetch(getMultiplayerApiUrl('/api/rooms'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gameId: selectedGame
                })
            });

            if (!response.ok) {
                throw new Error('Impossible de creer la room.');
            }

            const room = await response.json();
            syncMultiplayerPlayerNames('create');
            const socket = await ensureMultiplayerConnection();
            socket.emit('room:create', {
                code: room.code,
                playerName: getPreferredMultiplayerPlayerName('create')
            });
        } catch (error) {
            setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
        } finally {
            multiplayerBusy = false;
            updateMultiplayerLobby(true);
        }
    }

    async function joinMultiplayerRoom() {
        if (multiplayerActiveRoom?.code) {
            await leaveMultiplayerRoom();
            return;
        }

        const roomCode = multiplayerJoinRoomCodeInput.value.trim().toUpperCase();

        if (!roomCode || multiplayerBusy) {
            setMultiplayerStatus('Entre un code de room valide pour rejoindre une partie.');
            return;
        }

        multiplayerBusy = true;
        updateMultiplayerLobby();
        setMultiplayerStatus(`Connexion à la room ${roomCode}...`);

        try {
            syncMultiplayerPlayerNames('join');
            const socket = await ensureMultiplayerConnection();
            socket.emit('room:join', {
                code: roomCode,
                playerName: getPreferredMultiplayerPlayerName('join')
            });
        } catch (error) {
            setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
        } finally {
            multiplayerBusy = false;
            updateMultiplayerLobby(true);
        }
    }

    async function leaveMultiplayerRoom() {
        syncMultiplayerStateBridge();
        if (!multiplayerActiveRoom?.code) {
            return window.leaveMultiplayerRoom(multiplayerSocket, multiplayerActiveRoom);
        }
        const socket = multiplayerSocket?.connected ? multiplayerSocket : await ensureMultiplayerConnection();
        return window.leaveMultiplayerRoom(socket, multiplayerActiveRoom);
    }

    async function copyMultiplayerRoomCode() {
        syncMultiplayerStateBridge();
        return window.copyMultiplayerRoomCode(multiplayerActiveRoom);
    }

    async function toggleMultiplayerReady() {
        if (!multiplayerActiveRoom?.code) {
            setMultiplayerStatus('Aucune room active a preparer.');
            return;
        }

        try {
            const socket = await ensureMultiplayerConnection();
            socket.emit('room:toggle-ready');
            setMultiplayerStatus(`${isCurrentPlayerMultiplayerReady() ? 'Retrait du statut pr\u00eat' : 'Pr\u00e9paration'} pour ${getMultiplayerGameLabel(multiplayerActiveRoom.gameId)}...`);
        } catch (error) {
            setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
        }
    }

    async function launchMultiplayerGame() {
        if (!multiplayerActiveRoom?.code) {
            return;
        }

        try {
            const socket = await ensureMultiplayerConnection();
            socket.emit('room:launch-game');
            setMultiplayerStatus(`Lancement de ${getMultiplayerGameLabel(multiplayerActiveRoom.gameId)}...`);
        } catch (error) {
            setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
        }
    }

    function showGamePanel(tabId) {
        activeGameTab = window.showGamePanel(tabId, {
            updateMultiplayerChatPanel,
            closeGameOverModal,
            updateMultiplayerLobby
        });
    }

    function updateGamesFilters() {
        window.updateGamesFilters();
    }

    function showGamesHome() {
        activeGameTab = window.showGamesHome({
            cleanupActiveGameForNavigation,
            updateMultiplayerChatPanel,
            closeGameOverModal,
            updateMultiplayerLobby
        });
    }

    function showGamesSection(section) {
        activeGameTab = window.showGamesSection(section, {
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

        if (multiplayerActiveRoom?.code) {
            if (!isCurrentMultiplayerHost()) {
                setMultiplayerStatus("Seul l'hôte peut changer le jeu du salon.");
                return;
            }

            if (multiplayerActiveRoom.gameId === gameId) {
                multiplayerSelectedGameId = gameId;
                updateMultiplayerLobby();
                return;
            }

            try {
                const socket = await ensureMultiplayerConnection();
                multiplayerSelectedGameId = gameId;
                socket.emit('room:update-game', { gameId });
                setMultiplayerStatus(`Jeu du salon change pour ${getMultiplayerGameLabel(gameId)}...`);
            } catch (error) {
                setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
            }
            return;
        }

        multiplayerSelectedGameId = gameId;
        updateMultiplayerLobby();
    }

    function cleanupActiveGameForNavigation(nextTab) {
        window.__baie.gameLifecycle.cleanupActiveGameForNavigation(nextTab, activeGameTab, window.__baie);
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
        onActivateCinemaPanel: activatePanel,
        onActivateMathPanel: activateMathPanel,
        onActivateMusicPanel: activateMusicPanel
    });





    function openSelectedGame(nextTab) {
        window.__baie.gameLifecycle.openSelectedGame(nextTab, activeGameTab, window.__baie, { setSelectedMultiplayerGame, closeGameOverModal });
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

    minesweeperMenuActionButton?.addEventListener('click', () => {
        if (__mw.getMinesweeperMenuShowingRules()) {
            __mw.setMinesweeperMenuShowingRules(false);
            renderMinesweeperMenu();
            return;
        }

        initializeGame();
        closeMinesweeperMenu();
    });

    minesweeperMenuRulesButton?.addEventListener('click', () => {
        __mw.setMinesweeperMenuShowingRules(true);
        renderMinesweeperMenu();
    });

    minesweeperGridSizeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setMinesweeperGridSize(button.dataset.minesweeperGridSize);
        });
    });

    snakeStartButton.addEventListener('click', () => {
        startSnake();
    });

    snakeMenuActionButton?.addEventListener('click', () => {
        if (__sn.getSnakeMenuShowingRules()) {
            __sn.setSnakeMenuShowingRules(false);
            renderSnakeMenu();
            return;
        }

        startSnake();
        closeSnakeMenu();
    });

    snakeMenuRulesButton?.addEventListener('click', () => {
        __sn.setSnakeMenuShowingRules(true);
        renderSnakeMenu();
    });

    snakeGridSizeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setSnakeGridSize(button.dataset.snakeGridSize);
        });
    });

    pongMenuActionButton?.addEventListener('click', () => {
        if (__pg.getPongMenuShowingRules()) {
            __pg.setPongMenuShowingRules(false);
            renderPongMenu();
            return;
        }

        if (isMultiplayerPongActive()) {
            if (isMultiplayerLaunchPending('pong')) {
                toggleMultiplayerReady();
                return;
            }

            startPong();
            return;
        }

        initializePong();
        startPongLaunchSequence(() => {
            startPong();
        });
    });

    pongMenuRulesButton?.addEventListener('click', () => {
        __pg.setPongMenuShowingRules(!__pg.getPongMenuShowingRules());
        renderPongMenu();
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

        setSudokuSelectedCell(row, col);
        renderSudoku();
    });

    sudokuRestartButton.addEventListener('click', () => {
        initializeSudoku(!__su.getSudokuMenuVisible());
    });

    sudokuDifficultyButton?.addEventListener('click', () => {
        cycleSudokuDifficulty();
        initializeSudoku(!__su.getSudokuMenuVisible());
    });

    sudokuMenuActionButton?.addEventListener('click', () => {
        if (__su.getSudokuMenuShowingRules()) {
            __su.setSudokuMenuShowingRules(false);
            renderSudokuMenu();
            return;
        }

        initializeSudoku(true);
        closeSudokuMenu();
    });

    sudokuMenuRulesButton?.addEventListener('click', () => {
        __su.setSudokuMenuShowingRules(true);
        renderSudokuMenu();
    });

    game2048RestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initialize2048();
    });

    game2048MenuActionButton?.addEventListener('click', () => {
        if (__g2.get2048MenuShowingRules()) {
            __g2.set2048MenuShowingRules(false);
            render2048Menu();
            return;
        }

        if (__g2.get2048MenuResult()) {
            initialize2048();
            close2048Menu();
            return;
        }

        close2048Menu();
    });

    game2048MenuRulesButton?.addEventListener('click', () => {
        __g2.set2048MenuShowingRules(!__g2.get2048MenuShowingRules());
        render2048Menu();
    });

    window.bindTouchGameControls({
        getActiveGameTab: () => activeGameTab,
        is2048Blocked: () => __g2.get2048MenuVisible(),
        move2048,
        queueSnakeDirectionInput,
        isPacmanBlocked: () => __pm.getPacmanMenuVisible() || __pm.getPacmanMenuClosing(),
        setPacmanNextDirection: (direction) => __pm.setPacmanNextDirection(direction),
        isTetrisBlocked: () => __tt.getTetrisMenuVisible() || __tt.getTetrisMenuClosing(),
        moveTetrisHorizontally,
        dropTetrisStep,
        rotateTetrisPiece
    });

    aimMenuActionButton?.addEventListener('click', () => {
        if (__am.getAimMenuShowingRules()) {
            __am.setAimMenuShowingRules(false);
            renderAimMenu();
            return;
        }
        initializeAim();
        closeAimMenu();
        window.setTimeout(() => { startAimRound(); }, UNO_MENU_CLOSE_DURATION_MS);
    });

    aimMenuRulesButton?.addEventListener('click', () => {
        __am.setAimMenuShowingRules(true);
        renderAimMenu();
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
        if (__am.getAimMenuVisible() || __am.getAimMenuClosing()) return;
        event.preventDefault();
        startAimRound();
        const targetButton = event.target.closest('.aim-target-shell[data-target-id]');
        const targetId = targetButton?.dataset.targetId;

        if (targetId) {
            handleAimTargetHit(targetId);
            return;
        }

        handleAimMiss();
    });

    memoryMenuActionButton?.addEventListener('click', () => {
        if (__mem.getMemoryMenuShowingRules()) {
            __mem.setMemoryMenuShowingRules(false);
            renderMemoryMenu();
            return;
        }

        closeGameOverModal();
        initializeMemory();
        startMemoryLaunchSequence();
    });

    memoryMenuRulesButton?.addEventListener('click', () => {
        __mem.setMemoryMenuShowingRules(!__mem.getMemoryMenuShowingRules());
        renderMemoryMenu();
    });

    memoryBoard.addEventListener('click', (event) => {
        const cardButton = event.target.closest('.memory-card-tile');

        if (!cardButton) {
            return;
        }

        handleMemoryCardFlip(Number(cardButton.dataset.index));
    });

    ticTacToeRestartButton.addEventListener('click', () => {
        if (isMultiplayerTicTacToeActive()) {
            if (!multiplayerSocket?.connected) {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }

            multiplayerSocket.emit('tictactoe:restart');
            return;
        }

        initializeTicTacToe();
    });

    ticTacToeMenuActionButton?.addEventListener('click', () => {
        if (__ttt.getTicTacToeMenuShowingRules()) {
            __ttt.setTicTacToeMenuShowingRules(false);
            renderTicTacToeMenu();
            return;
        }

        if (__ttt.getTicTacToeMenuResult()) {
            if (isMultiplayerTicTacToeActive()) {
                multiplayerSocket?.emit('tictactoe:restart');
                __ttt.setTicTacToeMenuVisible(false);
                __ttt.setTicTacToeMenuResult(null);
                renderTicTacToeMenu();
                return;
            }

            initializeTicTacToe(false);
            return;
        }

        if (isMultiplayerTicTacToeActive() && isMultiplayerLaunchPending('ticTacToe')) {
            toggleMultiplayerReady();
            return;
        }

        __ttt.setTicTacToeMenuResult(null);
        closeTicTacToeMenu();
    });

    ticTacToeMenuRulesButton?.addEventListener('click', () => {
        __ttt.setTicTacToeMenuShowingRules(!__ttt.getTicTacToeMenuShowingRules());
        renderTicTacToeMenu();
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

        const mode = __ttt.getTicTacToeMode();
        handleTicTacToeMove(
            Number(cellButton.dataset.index),
            mode === 'duo' ? __ttt.getTicTacToeCurrentPlayer() : 'anchor'
        );
    });

    battleshipRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        if (isMultiplayerBattleshipActive()) {
            multiplayerSocket?.emit('battleship:restart');
            return;
        }
        initializeBattleship();
    });

    battleshipMenuActionButton?.addEventListener('click', () => {
        if (__bs.getBattleshipMenuShowingRules()) {
            __bs.setBattleshipMenuShowingRules(false);
            renderBattleshipMenu();
            return;
        }

        if (isMultiplayerBattleshipActive() && isMultiplayerLaunchPending('battleship')) {
            toggleMultiplayerReady();
            return;
        }

        if (isMultiplayerBattleshipActive()) {
            multiplayerSocket?.emit('battleship:restart');
        } else {
            initializeBattleship();
        }
        closeBattleshipMenu();
    });

    battleshipMenuRulesButton?.addEventListener('click', () => {
        __bs.setBattleshipMenuShowingRules(true);
        renderBattleshipMenu();
    });

    tetrisStartButton.addEventListener('click', () => {
        startTetris();
    });

    tetrisMenuActionButton?.addEventListener('click', () => {
        if (__tt.getTetrisMenuShowingRules()) {
            __tt.setTetrisMenuShowingRules(false);
            renderTetrisMenu();
            return;
        }

        initializeTetris();
        closeTetrisMenu();
        window.setTimeout(() => {
            startTetris();
        }, UNO_MENU_CLOSE_DURATION_MS);
    });

    tetrisMenuRulesButton?.addEventListener('click', () => {
        __tt.setTetrisMenuShowingRules(true);
        renderTetrisMenu();
    });

    pacmanStartButton.addEventListener('click', () => {
        startPacman();
    });

    pacmanMenuActionButton?.addEventListener('click', () => {
        if (__pm.getPacmanMenuShowingRules()) {
            __pm.setPacmanMenuShowingRules(false);
            renderPacmanMenu();
            return;
        }

        initializePacman();
        closePacmanMenu();
        window.setTimeout(() => {
            startPacman();
        }, UNO_MENU_CLOSE_DURATION_MS);
    });

    pacmanMenuRulesButton?.addEventListener('click', () => {
        __pm.setPacmanMenuShowingRules(true);
        renderPacmanMenu();
    });

    solitaireMenuActionButton?.addEventListener('click', () => {
        if (__sol.getSolitaireMenuShowingRules()) {
            __sol.setSolitaireMenuShowingRules(false);
            renderSolitaireMenu();
            return;
        }
        initializeSolitaire();
        closeSolitaireMenu();
    });

    solitaireMenuRulesButton?.addEventListener('click', () => {
        __sol.setSolitaireMenuShowingRules(true);
        renderSolitaireMenu();
    });

    solitaireRestartButton.addEventListener('click', () => {
        initializeSolitaire();
    });

    connect4MenuActionButton?.addEventListener('click', () => {
        if (__c4.getConnect4MenuShowingRules()) {
            __c4.setConnect4MenuShowingRules(false);
            renderConnect4Menu();
            return;
        }

        if (isMultiplayerConnect4Active()) {
            if (!multiplayerSocket?.connected) {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }

            if (isMultiplayerLaunchPending('connect4')) {
                toggleMultiplayerReady();
                return;
            }

            multiplayerSocket.emit('connect4:restart');
            __c4.setConnect4MenuVisible(false);
            __c4.setConnect4MenuResult(false);
            renderConnect4Menu();
            return;
        }

        initializeConnect4();
        startConnect4LaunchSequence();
    });

    connect4MenuRulesButton?.addEventListener('click', () => {
        __c4.setConnect4MenuShowingRules(!__c4.getConnect4MenuShowingRules());
        renderConnect4Menu();
    });

    connect4ModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setConnect4Mode(button.dataset.connect4Mode);
        });
    });

    rhythmMenuActionButton?.addEventListener('click', () => {
        if (__rh.getRhythmMenuShowingRules()) {
            __rh.setRhythmMenuShowingRules(false);
            renderRhythmMenu();
            return;
        }
        closeRhythmMenu();
        window.setTimeout(() => { startRhythm(); }, UNO_MENU_CLOSE_DURATION_MS);
    });

    rhythmMenuRulesButton?.addEventListener('click', () => {
        __rh.setRhythmMenuShowingRules(true);
        renderRhythmMenu();
    });

    rhythmStartButton.addEventListener('click', () => {
        startRhythm();
    });

    flappyMenuActionButton?.addEventListener('click', () => {
        if (__fl.getFlappyMenuShowingRules()) {
            __fl.setFlappyMenuShowingRules(false);
            renderFlappyMenu();
            return;
        }

        initializeFlappy();
        startFlappyLaunchSequence();
    });

    flappyMenuRulesButton?.addEventListener('click', () => {
        __fl.setFlappyMenuShowingRules(!__fl.getFlappyMenuShowingRules());
        renderFlappyMenu();
    });

    flowFreeMenuActionButton?.addEventListener('click', () => {
        if (__ff.getFlowFreeMenuShowingRules()) {
            __ff.setFlowFreeMenuShowingRules(false);
            renderFlowFreeMenu();
            return;
        }
        initializeFlowFree();
        closeFlowFreeMenu();
    });

    flowFreeMenuRulesButton?.addEventListener('click', () => {
        __ff.setFlowFreeMenuShowingRules(true);
        renderFlowFreeMenu();
    });

    flowFreeRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeFlowFree();
    });

    magicSortMenuActionButton?.addEventListener('click', () => {
        if (__ms.getMagicSortMenuShowingRules()) {
            __ms.setMagicSortMenuShowingRules(false);
            renderMagicSortMenu();
            return;
        }
        initializeMagicSort();
        closeMagicSortMenu();
    });

    magicSortMenuRulesButton?.addEventListener('click', () => {
        __ms.setMagicSortMenuShowingRules(true);
        renderMagicSortMenu();
    });

    magicSortRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeMagicSort();
    });

    mentalMathMenuActionButton?.addEventListener('click', () => {
        if (__mm.getMentalMathMenuShowingRules()) {
            __mm.setMentalMathMenuShowingRules(false);
            renderMentalMathMenu();
            return;
        }

        initializeMentalMath();
        startMentalMathLaunchSequence();
    });

    mentalMathMenuRulesButton?.addEventListener('click', () => {
        __mm.setMentalMathMenuShowingRules(!__mm.getMentalMathMenuShowingRules());
        renderMentalMathMenu();
    });

    mentalMathForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        submitMentalMathAnswer();
    });

    mentalMathKeypadButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.dataset.mentalMathKey;
            const action = button.dataset.mentalMathAction;

            if (key) {
                handleMentalMathKeypadInput(key);
                return;
            }

            if (action) {
                handleMentalMathKeypadAction(action);
            }
        });
    });

    mentalMathAnswerInput?.addEventListener('input', () => {
        mentalMathAnswerInput.value = mentalMathAnswerInput.value.replace(/\D/g, '');
    });

    document.addEventListener('keydown', (event) => {
        if (activeGameTab !== 'mentalMath' || __mm.getMentalMathMenuVisible() || __mm.getMentalMathMenuClosing()) {
            return;
        }

        if (!__mm.getMentalMathRoundRunning()) {
            return;
        }

        if (/^\d$/.test(event.key)) {
            event.preventDefault();
            handleMentalMathKeypadInput(event.key);
            return;
        }

        if (event.key === 'Backspace') {
            event.preventDefault();
            handleMentalMathKeypadAction('backspace');
            return;
        }

        if (event.key === 'Delete') {
            event.preventDefault();
            handleMentalMathKeypadAction('clear');
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            submitMentalMathAnswer();
        }
    });

    candyCrushRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeCandyCrush();
    });

    candyCrushMenuActionButton?.addEventListener('click', () => {
        if (__cc2.getCandyCrushMenuShowingRules()) {
            __cc2.setCandyCrushMenuShowingRules(false);
            renderCandyCrushMenu();
            return;
        }

        initializeCandyCrush();
        closeCandyCrushMenu();
    });

    candyCrushMenuRulesButton?.addEventListener('click', () => {
        __cc2.setCandyCrushMenuShowingRules(true);
        renderCandyCrushMenu();
    });

    harborRunStartButton.addEventListener('click', () => {
        closeGameOverModal();
        startHarborRun();
    });

    harborRunMenuActionButton?.addEventListener('click', () => {
        if (__hr.getHarborRunMenuShowingRules()) {
            __hr.setHarborRunMenuShowingRules(false);
            renderHarborRunMenu();
            return;
        }

        initializeHarborRun();
        closeHarborRunMenu();
        window.setTimeout(() => {
            startHarborRun();
        }, UNO_MENU_CLOSE_DURATION_MS);
    });

    harborRunMenuRulesButton?.addEventListener('click', () => {
        __hr.setHarborRunMenuShowingRules(true);
        renderHarborRunMenu();
    });

    stackerStartButton.addEventListener('click', () => {
        dropStackerLayer();
    });

    stackerMenuActionButton?.addEventListener('click', () => {
        if (__st.getStackerMenuShowingRules()) {
            __st.setStackerMenuShowingRules(false);
            renderStackerMenu();
            return;
        }

        initializeStacker();
        closeStackerMenu();
    });

    stackerMenuRulesButton?.addEventListener('click', () => {
        __st.setStackerMenuShowingRules(true);
        renderStackerMenu();
    });

    coinClickerButton?.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) {
            return;
        }

        if (__cc.getCoinClickerMenuVisible() || __cc.getCoinClickerMenuClosing()) {
            return;
        }

        const state = __cc.getCoinClickerState();
        state.coins += getCoinClickerCoinsPerClick();
        saveCoinClickerState();
        renderCoinClicker();
    });

    coinClickerButton?.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
        }
    });

    coinClickerResetButton?.addEventListener('click', () => {
        initializeCoinClicker(true);
    });

    coinClickerMenuActionButton?.addEventListener('click', () => {
        if (__cc.getCoinClickerMenuShowingRules()) {
            __cc.setCoinClickerMenuShowingRules(false);
            renderCoinClickerMenu();
            return;
        }

        closeCoinClickerMenu();
    });

    coinClickerMenuRulesButton?.addEventListener('click', () => {
        __cc.setCoinClickerMenuShowingRules(true);
        renderCoinClickerMenu();
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
        const state = __cc.getCoinClickerState();

        if (state.coins < cost) {
            return;
        }

        state.coins -= cost;
        state.upgrades[upgrade.id] += 1;
        if (upgrade.effectType === 'click') {
            state.clickPower += upgrade.bonus;
        } else if (upgrade.effectType === 'multiplier') {
            state.multiplier += upgrade.bonus;
        } else if (upgrade.effectType === 'auto') {
            state.autoPower += upgrade.bonus;
        }
        coinClickerHelpText.textContent = upgrade.effectType === 'auto'
            ? 'Le butin tombe maintenant tout seul dans la cale.'
            : (upgrade.effectType === 'multiplier'
                ? 'Ton butin vaut plus à chaque clic.'
                : 'Tes clics frappent plus fort sur la caisse.');
        saveCoinClickerState();
        renderCoinClicker();
    });

    chessMenuActionButton?.addEventListener('click', () => {
        if (__ch.getChessMenuShowingRules()) {
            __ch.setChessMenuShowingRules(false);
            renderChessMenu();
            return;
        }

        if (multiplayerActiveRoom?.gameId === 'chess') {
            toggleMultiplayerReady();
            return;
        }

        initializeChess();
        startChessLaunchSequence();
    });

    chessMenuRulesButton?.addEventListener('click', () => {
        __ch.setChessMenuShowingRules(!__ch.getChessMenuShowingRules());
        renderChessMenu();
    });

    chessModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setChessMode(button.dataset.chessMode);
        });
    });

    chessBoard?.addEventListener('pointerdown', (event) => {
        const piece = event.target.closest('[data-chess-piece]');
        if (!piece) {
            return;
        }

        const [row, col] = piece.dataset.chessPiece.split('-').map(Number);
        handleChessPiecePointerDown(event, row, col);
    });

    window.addEventListener('pointermove', handleChessPointerMove);
    window.addEventListener('pointerup', handleChessPointerUp);
    window.addEventListener('pointercancel', handleChessPointerUp);

    chessBoard?.addEventListener('click', (event) => {
        if (__ch.getChessSuppressNextClick()) {
            __ch.setChessSuppressNextClick(false);
            return;
        }

        const cell = event.target.closest('[data-chess-cell]');

        if (!cell) {
            return;
        }

        const [row, col] = cell.dataset.chessCell.split('-').map(Number);
        handleChessCellClick(row, col);
    });

    checkersMenuActionButton?.addEventListener('click', () => {
        if (__ck.getCheckersMenuShowingRules()) {
            __ck.setCheckersMenuShowingRules(false);
            renderCheckersMenu();
            return;
        }

        if (isMultiplayerCheckersActive()) {
            if (!multiplayerSocket?.connected) {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }

            if (isMultiplayerLaunchPending('checkers')) {
                toggleMultiplayerReady();
                return;
            }

            multiplayerSocket.emit('checkers:restart');
            __ck.setCheckersMenuVisible(false);
            __ck.setCheckersMenuResult(false);
            renderCheckersMenu();
            return;
        }

        initializeCheckers();
        startCheckersLaunchSequence();
    });

    checkersMenuRulesButton?.addEventListener('click', () => {
        __ck.setCheckersMenuShowingRules(!__ck.getCheckersMenuShowingRules());
        renderCheckersMenu();
    });

    checkersModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setCheckersMode(button.dataset.checkersMode);
        });
    });

    checkersBoard?.addEventListener('pointerdown', (event) => {
        const piece = event.target.closest('[data-checkers-piece]');
        if (!piece) {
            return;
        }

        const [row, col] = piece.dataset.checkersPiece.split('-').map(Number);
        handleCheckersPiecePointerDown(event, row, col);
    });

    window.addEventListener('pointermove', handleCheckersPointerMove);
    window.addEventListener('pointerup', handleCheckersPointerUp);
    window.addEventListener('pointercancel', handleCheckersPointerUp);

    checkersBoard?.addEventListener('click', (event) => {
        if (__ck.getCheckersSuppressNextClick()) {
            __ck.setCheckersSuppressNextClick(false);
            return;
        }

        const cell = event.target.closest('[data-checkers-cell]');

        if (!cell) {
            return;
        }

        const [row, col] = cell.dataset.checkersCell.split('-').map(Number);
        handleCheckersCellClick(row, col);
    });

    airHockeyModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (isMultiplayerAirHockeyActive()) {
                setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
                return;
            }

            const mode = button.dataset.airhockeyMode;
            setAirHockeyMode(mode);
            airHockeyModeButtons.forEach((item) => item.classList.toggle('is-active', item === button));
            airHockeyHelpText.textContent = mode === 'solo'
                ? "Joueur gauche : ZQSD. La droite est pilotée par l'IA."
                : 'Joueur gauche : ZQSD. Joueur droit : flèches directionnelles.';
            initializeAirHockey();
        });
    });

    airHockeyStartButton?.addEventListener('click', () => {
        if (!isMultiplayerAirHockeyActive()) {
            initializeAirHockey(false);
        }
        launchAirHockeyPuck();
    });

    airHockeyMenuActionButton?.addEventListener('click', () => {
        if (__ah.getAirHockeyMenuShowingRules()) {
            __ah.setAirHockeyMenuShowingRules(false);
            renderAirHockeyMenu();
            return;
        }

        if (isMultiplayerAirHockeyActive() && isMultiplayerLaunchPending('airHockey')) {
            toggleMultiplayerReady();
            return;
        }

        if (!isMultiplayerAirHockeyActive()) {
            initializeAirHockey(false);
        }
        launchAirHockeyPuck();
        closeAirHockeyMenu();
    });

    airHockeyMenuRulesButton?.addEventListener('click', () => {
        __ah.setAirHockeyMenuShowingRules(true);
        renderAirHockeyMenu();
    });

    reactionMenuActionButton?.addEventListener('click', () => {
        if (__rx.getReactionMenuShowingRules()) {
            __rx.setReactionMenuShowingRules(false);
            renderReactionMenu();
            return;
        }

        startReactionRound();
        closeReactionMenu();
    });

    reactionMenuRulesButton?.addEventListener('click', () => {
        __rx.setReactionMenuShowingRules(true);
        renderReactionMenu();
    });

    reactionLantern?.addEventListener('click', (event) => {
        event.stopPropagation();
        handleReactionAttempt();
    });

    reactionTable?.addEventListener('click', (event) => {
        if (__rx.getReactionMenuVisible() || __rx.getReactionMenuClosing()) {
            return;
        }

        if (event.target === reactionMenuOverlay) {
            return;
        }

        handleReactionAttempt();
    });

    baieBerryMenuActionButton?.addEventListener('click', () => {
        if (__bb2.getBaieBerryMenuShowingRules()) {
            __bb2.setBaieBerryMenuShowingRules(false);
            renderBaieBerryMenu();
            return;
        }

        initializeBaieBerry();
        startBaieBerryLaunchSequence();
    });

    baieBerryMenuRulesButton?.addEventListener('click', () => {
        __bb2.setBaieBerryMenuShowingRules(!__bb2.getBaieBerryMenuShowingRules());
        renderBaieBerryMenu();
    });

    baieBerryCanvas?.addEventListener('pointermove', (event) => {
        if (__bb2.getBaieBerryMenuVisible() || __bb2.getBaieBerryMenuClosing()) {
            return;
        }
        const bounds = baieBerryCanvas.getBoundingClientRect();
        const scaleX = baieBerryCanvas.width / bounds.width;
        const x = (event.clientX - bounds.left) * scaleX;
        __bb2.setBaieBerryLastPointerX(x);
        updateBaieBerryDropGuide(x);
    });

    baieBerryCanvas?.addEventListener('click', (event) => {
        if (__bb2.getBaieBerryMenuVisible() || __bb2.getBaieBerryMenuClosing()) {
            return;
        }
        const bounds = baieBerryCanvas.getBoundingClientRect();
        const scaleX = baieBerryCanvas.width / bounds.width;
        dropBaieBerryAt((event.clientX - bounds.left) * scaleX);
    });

    breakoutMenuActionButton?.addEventListener('click', () => {
        if (__bk.getBreakoutMenuShowingRules()) {
            __bk.setBreakoutMenuShowingRules(false);
            renderBreakoutMenu();
            return;
        }

        initializeBreakout();
        startBreakoutLaunchSequence();
    });

    breakoutMenuRulesButton?.addEventListener('click', () => {
        __bk.setBreakoutMenuShowingRules(!__bk.getBreakoutMenuShowingRules());
        renderBreakoutMenu();
    });

    blockBlastMenuActionButton?.addEventListener('click', () => {
        if (__bb.getBlockBlastMenuShowingRules()) {
            __bb.setBlockBlastMenuShowingRules(false);
            renderBlockBlastMenu();
            return;
        }
        initializeBlockBlast();
        closeBlockBlastMenu();
    });

    blockBlastMenuRulesButton?.addEventListener('click', () => {
        __bb.setBlockBlastMenuShowingRules(true);
        renderBlockBlastMenu();
    });

    blockBlastStartButton?.addEventListener('click', () => {
        initializeBlockBlast();
    });

    blockBlastPieces?.addEventListener('pointerdown', (event) => {
        if (__bb.getBlockBlastMenuVisible() || __bb.getBlockBlastMenuClosing()) return;
        const pieceButton = event.target.closest('[data-blockblast-piece]');
        const state = __bb.getBlockBlastState();
        if (!pieceButton || !state) {
            return;
        }

        const index = Number(pieceButton.dataset.blockblastPiece);
        const piece = state.pieces[index];
        if (!piece) {
            return;
        }

        event.preventDefault();
        __bb.setBlockBlastSuppressClick(false);
        stopBlockBlastDrag();
        __bb.setBlockBlastDragState({
            pointerId: event.pointerId,
            pieceIndex: index,
            piece,
            sourceElement: pieceButton,
            startX: event.clientX,
            startY: event.clientY,
            moved: false
        });
    });

    document.addEventListener('pointermove', (event) => {
        const drag = __bb.getBlockBlastDragState();
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }

        const dragDistance = Math.hypot(
            event.clientX - drag.startX,
            event.clientY - drag.startY
        );
        if (dragDistance > 6) {
            drag.moved = true;
            __bb.setBlockBlastSuppressClick(true);
        }

        const anchor = getBlockBlastAnchorFromPoint(event.clientX, event.clientY);
        if (!anchor) {
            clearBlockBlastPreview();
            return;
        }

        updateBlockBlastPreview(drag.piece, anchor.row, anchor.col);
    });

    document.addEventListener('pointerup', (event) => {
        const drag = __bb.getBlockBlastDragState();
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }

        const anchor = getBlockBlastAnchorFromPoint(event.clientX, event.clientY);
        const shouldPlace = drag.moved
            && anchor
            && canPlaceBlockBlastPiece(drag.piece, anchor.row, anchor.col);
        const draggedPieceIndex = drag.pieceIndex;

        stopBlockBlastDrag();

        if (shouldPlace) {
            placeBlockBlastPieceAtIndex(draggedPieceIndex, anchor.row, anchor.col);
        }

        if (__bb.getBlockBlastSuppressClick()) {
            window.setTimeout(() => {
                __bb.setBlockBlastSuppressClick(false);
            }, 0);
        }
    });

    document.addEventListener('pointercancel', (event) => {
        const drag = __bb.getBlockBlastDragState();
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }

        stopBlockBlastDrag();
        __bb.setBlockBlastSuppressClick(false);
    });

    blockBlastPieces?.addEventListener('click', (event) => {
        if (__bb.getBlockBlastSuppressClick()) {
            __bb.setBlockBlastSuppressClick(false);
            return;
        }

        const pieceButton = event.target.closest('[data-blockblast-piece]');
        const state = __bb.getBlockBlastState();
        if (!pieceButton || !state) {
            return;
        }

        const index = Number(pieceButton.dataset.blockblastPiece);
        if (!state.pieces[index]) {
            return;
        }

        const current = __bb.getBlockBlastSelectedPieceIndex();
        __bb.setBlockBlastSelectedPieceIndex(current === index ? null : index);
        clearBlockBlastPreview();
        renderBlockBlastPieces();
    });

    blockBlastBoard?.addEventListener('click', (event) => {
        if (__bb.getBlockBlastMenuVisible() || __bb.getBlockBlastMenuClosing()) return;
        if (__bb.getBlockBlastSuppressClick()) {
            __bb.setBlockBlastSuppressClick(false);
            return;
        }

        const cellButton = event.target.closest('[data-blockblast-row]');
        if (!cellButton) {
            return;
        }

        placeBlockBlastPiece(
            Number(cellButton.dataset.blockblastRow),
            Number(cellButton.dataset.blockblastCol)
        );
    });

    unoModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.unoMode === 'online') {
                showGamesSection('multiplayer');
                setSelectedMultiplayerGame('uno');
                setMultiplayerEntryMode('create');
                return;
            }

            setUnoMode(button.dataset.unoMode);
        });
    });

    unoDrawButton?.addEventListener('click', () => {
        if (__uno.getUnoDrawRequestPending()) {
            return;
        }

        if (isMultiplayerUnoActive()) {
            __uno.setUnoDrawRequestPending(true);
            __uno.setUnoPendingDrawAnimation(true);
            multiplayerSocket?.emit('uno:draw-card');
            return;
        }

        __uno.setUnoDrawRequestPending(true);
        drawSoloUnoCard();
    });

    unoMenuActionButton?.addEventListener('click', () => {
        if (__uno.getUnoMenuShowingRules()) {
            __uno.setUnoMenuShowingRules(false);
            renderUnoMenu();
            return;
        }

        if (__uno.getUnoMenuResult() && (isMultiplayerUnoActive() || multiplayerActiveRoom?.gameId === 'uno')) {
            __uno.setUnoMenuResult(null);
            __uno.setUnoMenuVisible(false);
            showGamePanel('multiplayer');
            return;
        }

        if (isMultiplayerUnoActive()) {
            toggleMultiplayerReady();
            return;
        }

        initializeUno();
        startUnoLaunchSequence();
    });

    unoMenuRulesButton?.addEventListener('click', () => {
        __uno.setUnoMenuShowingRules(!__uno.getUnoMenuShowingRules());
        renderUnoMenu();
    });

    unoColorChoiceButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const color = button.dataset.unoColor;
            if (!color) {
                return;
            }

            if (isMultiplayerUnoActive()) {
                if (__uno.getUnoColorChoicePending()) {
                    return;
                }
                __uno.setUnoColorChoicePending(true);
                unoColorPicker.classList.add('is-waiting');
                showUnoEvent(`Couleur ${getUnoDisplayColor(color).toLowerCase()} choisie...`);
                const existingTimer = __uno.getUnoColorChoiceTimer();
                if (existingTimer) {
                    window.clearTimeout(existingTimer);
                }
                __uno.setUnoColorChoiceTimer(window.setTimeout(() => {
                    __uno.setUnoColorChoiceTimer(null);
                    multiplayerSocket?.emit('uno:choose-color', { color });
                }, 500));
                return;
            }

            chooseSoloUnoColor(color);
        });
    });

    unoHand?.addEventListener('click', (event) => {
        const cardButton = event.target.closest('[data-uno-card-index]');
        if (!cardButton) {
            return;
        }

        const cardIndex = Number(cardButton.dataset.unoCardIndex);
        if (isMultiplayerUnoActive()) {
            __uno.setUnoPendingPlayAnimation(cardButton.outerHTML);
            multiplayerSocket?.emit('uno:play-card', { cardIndex });
            return;
        }

        handleSoloUnoCardPlay(cardIndex);
    });

    bombWordForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        if (__bm.getBombMenuVisible() || __bm.getBombMenuClosing()) {
            return;
        }

        const value = bombWordInput?.value?.trim() || '';
        if (!value) {
            return;
        }

        if (isMultiplayerBombActive()) {
            multiplayerSocket?.emit('bomb:submit-word', { word: value });
            bombWordInput.value = '';
            return;
        }

        if (isBombLocalActive()) {
            handleBombLocalSubmit(value);
            bombWordInput.value = '';
            bombWordInput?.focus();
            return;
        }
    });

    bombRestartButton?.addEventListener('click', () => {
        if (isMultiplayerBombActive()) {
            multiplayerSocket?.emit('bomb:restart');
            return;
        }

        if (isBombLocalActive() || __bm.getBombLocalState()) {
            startBombLocalRound();
        }
    });

    bombMenuModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const mode = button.dataset.bombMode;
            if (mode === 'local' || mode === 'online') {
                __bm.setBombSelectedMode(mode);
                renderBombMenu();
            }
        });
    });

    bombMenuActionButton?.addEventListener('click', () => {
        if (__bm.getBombMenuShowingRules()) {
            __bm.setBombMenuShowingRules(false);
            renderBombMenu();
            return;
        }

        if (isMultiplayerBombActive() && isMultiplayerLaunchPending('bomb')) {
            toggleMultiplayerReady();
            return;
        }

        if (__bm.getBombSelectedMode() === 'local') {
            startBombLocalRound();
            closeBombMenu();
            return;
        }

        __bm.setBombLocalState(null);
        __bm.setBombState(null);
        stopBombTimerLoop();
        closeBombMenu();
        renderBomb();
    });

    bombMenuRulesButton?.addEventListener('click', () => {
        __bm.setBombMenuShowingRules(true);
        renderBombMenu();
    });

    battleshipEnemyBoard.addEventListener('click', (event) => {
        if (__bs.getBattleshipMenuVisible() || __bs.getBattleshipMenuClosing()) {
            return;
        }

        const cellButton = event.target.closest('.battleship-cell');

        if (!cellButton) {
            return;
        }

        if (isMultiplayerBattleshipActive()) {
            multiplayerSocket?.emit('battleship:shot', {
                row: Number(cellButton.dataset.row),
                col: Number(cellButton.dataset.col)
            });
            return;
        }

        handleBattleshipShot(Number(cellButton.dataset.row), Number(cellButton.dataset.col));
    });

    solitaireStock.addEventListener('click', (event) => {
        if (__sol.getSolitaireMenuVisible() || __sol.getSolitaireMenuClosing()) return;
        const actionButton = event.target.closest('[data-solitaire-action]');

        if (!actionButton) {
            return;
        }

        drawSolitaireCard();
    });

    solitaireWaste.addEventListener('click', (event) => {
        if (__sol.getSolitaireMenuVisible() || __sol.getSolitaireMenuClosing()) return;
        const wasteCard = event.target.closest('[data-solitaire-source="waste"]');

        if (!wasteCard) {
            return;
        }

        if (__sol.getSolitaireSelectedSource()?.type === 'waste') {
            clearSolitaireSelection();
            renderSolitaire();
            return;
        }

        selectSolitaireSource({ type: 'waste' });
    });

    solitaireFoundations.addEventListener('click', (event) => {
        if (__sol.getSolitaireMenuVisible() || __sol.getSolitaireMenuClosing()) return;
        const foundationButton = event.target.closest('[data-solitaire-foundation]');

        if (!foundationButton) {
            return;
        }

        const suit = foundationButton.dataset.solitaireFoundation;

        if (__sol.getSolitaireSelectedSource()) {
            if (moveSelectedSolitaireToFoundation(suit)) {
                return;
            }

            clearSolitaireSelection();
            renderSolitaire();
            return;
        }

        if (__sol.getSolitaireFoundationCount(suit)) {
            selectSolitaireSource({ type: 'foundation', suit });
        }
    });

    solitaireTableau.addEventListener('click', (event) => {
        if (__sol.getSolitaireMenuVisible() || __sol.getSolitaireMenuClosing()) return;
        const tableauCard = event.target.closest('[data-solitaire-tableau]');
        const columnTarget = event.target.closest('[data-solitaire-column]');

        if (tableauCard) {
            const col = Number(tableauCard.dataset.solitaireTableau);
            const index = Number(tableauCard.dataset.solitaireIndex);

            if (__sol.getSolitaireSelectedSource()) {
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

        if (columnTarget && __sol.getSolitaireSelectedSource()) {
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
        if (__rh.getRhythmMenuVisible() || __rh.getRhythmMenuClosing()) return;
        const pad = event.target.closest('[data-rhythm-lane]');

        if (!pad) {
            return;
        }

        handleRhythmHit(Number(pad.dataset.rhythmLane));
    });

    flappyBoard.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        if (__fl.getFlappyMenuVisible() || __fl.getFlappyMenuClosing()) {
            return;
        }
        flapFlappyBird();
    });

    flappyBoard.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    flowFreeBoard.addEventListener('pointerdown', (event) => {
        if (__ff.getFlowFreeMenuVisible() || __ff.getFlowFreeMenuClosing()) return;
        const cellButton = event.target.closest('.flowfree-cell');
        if (!cellButton) {
            return;
        }

        if (typeof flowFreeBoard.setPointerCapture === 'function') {
            flowFreeBoard.setPointerCapture(event.pointerId);
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
        if (!__ff.getFlowFreePointerDown()) {
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

    document.addEventListener('pointerup', (event) => {
        if (__ff.getFlowFreePointerDown()) {
            const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
            const cellButton = hoveredElement?.closest('.flowfree-cell');
            if (cellButton) {
                extendFlowFreePath(
                    Number(cellButton.dataset.flowRow),
                    Number(cellButton.dataset.flowCol)
                );
            }
            flushFlowFreePendingTarget();
            stopFlowFreePath();
        }
    });

    flowFreeBoard.addEventListener('pointerup', (event) => {
        if (typeof flowFreeBoard.releasePointerCapture === 'function' && flowFreeBoard.hasPointerCapture?.(event.pointerId)) {
            flowFreeBoard.releasePointerCapture(event.pointerId);
        }
    });

    flowFreeBoard.addEventListener('pointercancel', (event) => {
        if (typeof flowFreeBoard.releasePointerCapture === 'function' && flowFreeBoard.hasPointerCapture?.(event.pointerId)) {
            flowFreeBoard.releasePointerCapture(event.pointerId);
        }
        if (__ff.getFlowFreePointerDown()) {
            flushFlowFreePendingTarget();
            stopFlowFreePath();
        }
    });

    magicSortBoard.addEventListener('pointerdown', (event) => {
        if (__ms.getMagicSortMenuVisible() || __ms.getMagicSortMenuClosing()) return;
        const tubeButton = event.target.closest('[data-magic-sort-tube]');
        if (!tubeButton) {
            return;
        }

        handleMagicSortTubeClick(Number(tubeButton.dataset.magicSortTube));
    });

    candyCrushBoard.addEventListener('pointerdown', (event) => {
        if (__cc2.getCandyCrushMenuVisible() || __cc2.getCandyCrushMenuClosing()) {
            return;
        }
        const cellButton = event.target.closest('.candycrush-cell');
        if (!cellButton) {
            return;
        }

        const start = {
            row: Number(cellButton.dataset.candyRow),
            col: Number(cellButton.dataset.candyCol)
        };
        __cc2.setCandyCrushPointerStart(start);
        __cc2.setCandyCrushSelectedCell(start);
        renderCandyCrush();
    });

    candyCrushBoard.addEventListener('pointerup', async (event) => {
        if (__cc2.getCandyCrushMenuVisible() || __cc2.getCandyCrushMenuClosing()) {
            __cc2.setCandyCrushPointerStart(null);
            return;
        }
        const cellButton = event.target.closest('.candycrush-cell');
        const start = __cc2.getCandyCrushPointerStart();
        if (!cellButton || !start) {
            __cc2.setCandyCrushPointerStart(null);
            return;
        }

        const targetCell = {
            row: Number(cellButton.dataset.candyRow),
            col: Number(cellButton.dataset.candyCol)
        };

        __cc2.setCandyCrushPointerStart(null);
        await tryCandyCrushSwap(start, targetCell);
    });

    candyCrushBoard.addEventListener('pointerleave', () => {
        __cc2.setCandyCrushPointerStart(null);
        __cc2.setCandyCrushSelectedCell(null);
        if (!__cc2.getCandyCrushAnimating()) {
            renderCandyCrush();
        }
    });

    harborRunBoard.addEventListener('pointerdown', (event) => {
        if (__hr.getHarborRunMenuVisible() || __hr.getHarborRunMenuClosing()) {
            return;
        }

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

    __math.bindMathControls();

    window.bindCinemaCatalogControls({
        getContext: getCinemaCatalogContext,
        setState: applyCinemaCatalogState,
        renderCatalog,
        renderCatalogFilters
    });

    window.bindConfirmModalControls({ onClose: closeDeleteModal });

    window.bindCoreModalControls();
    window.bindEscapeModalControls({
        closeDeleteModal,
        closeLegalNoticeModal,
        closeGameOverModal
    });

    const directionalRepeatGuard = window.createDirectionalRepeatGuard();

    document.addEventListener('keyup', (event) => {
        directionalRepeatGuard.release(event);
    });

    document.addEventListener('keydown', (event) => {
        const targetTag = event.target?.tagName;
        const isTypingTarget = ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag) || event.target?.isContentEditable;

        if (__music.handlePianoKeyDown(event, {
            active: currentView === musicView && activeMusicTab === 'pianoPanel',
            isTypingTarget
        })) {
            return;
        }

        if (directionalRepeatGuard.shouldBlock(event, isTypingTarget)) {
            event.preventDefault();
            return;
        }

        if (!isTypingTarget && event.code === 'Space') {
            const activePanel = document.querySelector('.games-panel.games-panel-active');
            if (activePanel) {
                const actionBtn = activePanel.querySelector('[id$="MenuActionButton"]:not([hidden])');
                if (actionBtn) {
                    const overlay = actionBtn.closest('[id$="MenuOverlay"]');
                    if (overlay && !overlay.classList.contains('hidden') && !overlay.classList.contains('is-closing')) {
                        event.preventDefault();
                        actionBtn.click();
                        return;
                    }
                }
            }
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
            queueSnakeDirectionInput(nextDirection);
            return;
        }

        if (activeGameTab === 'pong' && ['ArrowUp', 'ArrowDown', 'z', 'Z', 's', 'S'].includes(event.key)) {
            event.preventDefault();
            __pg.getPongKeys().add(event.key);
            if (isMultiplayerPongActive()) {
                pushMultiplayerPongInput();
            }
            return;
        }

        if (activeGameTab === 'pong' && event.code === 'Space') {
            event.preventDefault();

            if (isMultiplayerPongActive()) {
                return;
            }

            if (__pg.getPongPaused()) {
                resumePong();
            } else {
                pausePong();
            }

            return;
        }

        if (activeGameTab === 'tetris') {
            if (__tt.getTetrisMenuVisible() || __tt.getTetrisMenuClosing()) {
                return;
            }
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
            if (__pm.getPacmanMenuVisible() || __pm.getPacmanMenuClosing()) {
                return;
            }
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
                __pm.setPacmanNextDirection(nextPacmanDirection);
                return;
            }
        }

        if (activeGameTab === 'rhythm') {
            if (__rh.getRhythmMenuVisible() || __rh.getRhythmMenuClosing()) return;
            const rhythmLane = {
                q: 0,
                Q: 0,
                s: 1,
                S: 1,
                d: 2,
                D: 2
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
            if (__hr.getHarborRunMenuVisible() || __hr.getHarborRunMenuClosing()) {
                return;
            }
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
                __ah.getAirHockeyKeys().add(normalizedKey);
                if (isMultiplayerAirHockeyActive()) {
                    pushMultiplayerAirHockeyInput();
                }
                return;
            }
        }

        if (activeGameTab === 'breakout') {
            if (__bk.getBreakoutMenuVisible() || __bk.getBreakoutMenuClosing()) {
                if (['Space', 'ArrowLeft', 'ArrowRight', 'KeyQ', 'KeyD'].includes(event.code)) {
                    event.preventDefault();
                }
                return;
            }

            const normalizedKey = event.key.toLowerCase();
            if (['q', 'd', 'arrowleft', 'arrowright'].includes(normalizedKey)) {
                event.preventDefault();
                __bk.getBreakoutKeys().add(normalizedKey);
                return;
            }

            if (event.code === 'Space') {
                event.preventDefault();
                __bk.resumeBreakoutLoop();
                return;
            }
        }

        if (activeGameTab === 'sudoku') {
            const digit = Number(event.key);
            const sudokuSel = __su.getSudokuSelectedCell();

            if (!sudokuSel || __su.getSudokuSolved()) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) && sudokuSel) {
                    event.preventDefault();
                }
            }

            if (digit >= 1 && digit <= 9 && sudokuSel) {
                event.preventDefault();
                updateSudokuCell(sudokuSel.row, sudokuSel.col, digit);
                return;
            }

            if ((event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') && sudokuSel) {
                event.preventDefault();
                updateSudokuCell(sudokuSel.row, sudokuSel.col, 0);
                return;
            }

            if (sudokuSel && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                const offsets = {
                    ArrowUp: { row: -1, col: 0 },
                    ArrowDown: { row: 1, col: 0 },
                    ArrowLeft: { row: 0, col: -1 },
                    ArrowRight: { row: 0, col: 1 }
                };
                const offset = offsets[event.key];
                const nextRow = Math.min(8, Math.max(0, sudokuSel.row + offset.row));
                const nextCol = Math.min(8, Math.max(0, sudokuSel.col + offset.col));
                setSudokuSelectedCell(nextRow, nextCol);
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

    window.bindSessionActivityTracking();

    window.bindGameKeyReleaseControls({
        handlePianoKeyUp: __music.handlePianoKeyUp,
        isPianoActive: () => currentView === musicView && activeMusicTab === 'pianoPanel',
        getPongKeys: () => __pg.getPongKeys(),
        isMultiplayerPongActive: () => activeGameTab === 'pong' && isMultiplayerPongActive(),
        pushMultiplayerPongInput,
        getAirHockeyKeys: () => __ah.getAirHockeyKeys(),
        isMultiplayerAirHockeyActive: () => activeGameTab === 'airHockey' && isMultiplayerAirHockeyActive(),
        pushMultiplayerAirHockeyInput,
        getBreakoutKeys: () => __bk.getBreakoutKeys()
    });

    window.bindResponsiveGameResize({
        getActiveGameTab: () => activeGameTab,
        syncAllGameMenuOverlayBounds,
        renderSnake,
        isMultiplayerPongActive,
        syncMultiplayerPongState,
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
    });

    window.bindMultiplayerLobbyControls({
        onCreateRoom: createMultiplayerRoom,
        onJoinRoom: joinMultiplayerRoom,
        onCopyCode: copyMultiplayerRoomCode,
        onSendChat: sendMultiplayerChatMessage,
        onSyncPlayerNames: syncMultiplayerPlayerNames
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
    initializeGame();
    renderMinesweeperMenu();
    renderStackerMenu();
    renderPacmanMenu();
    renderTetrisMenu();
    renderBattleshipMenu();
    renderHarborRunMenu();
    renderCoinClickerMenu();
    renderCandyCrushMenu();
    renderFlowFreeMenu();
    renderMagicSortMenu();
    renderBlockBlastMenu();
    renderAimMenu();
    renderRhythmMenu();
    renderSolitaireMenu();
    renderBombMenu();
    setMultiplayerEntryMode('create');
    setSelectedMultiplayerGame(multiplayerGameTiles[0]?.dataset.multiplayerGameSelect || 'ticTacToe');
    startCoinClickerAutoLoop();
    __math.initializeConverter();
    activateMathPanel('mathCalculatorPanel');
    activateMusicPanel('musicHomePanel');
    __music.renderPiano();
    syncAllGameMenuOverlayBounds();

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





