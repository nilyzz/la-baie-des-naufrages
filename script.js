document.addEventListener('DOMContentLoaded', () => {
    const LEGAL_NOTICE_ANIMATION_MS = 220;
    const SESSION_KEY = 'baie-des-naufrages-session';
    const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000;
    const multiplayerServerMeta = document.querySelector('meta[name="multiplayer-server-url"]');
    const MULTIPLAYER_SERVER_URL = String(window.BAIE_MULTIPLAYER_SERVER_URL || multiplayerServerMeta?.content || '')
        .trim()
        .replace(/\/+$/, '');
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
    const MULTIPLAYER_SUPPORTED_GAMES = {
        airHockey: 'Sea Hockey',
        battleship: 'Bataille',
        pong: 'Pong',
        ticTacToe: 'Morpion',
        connect4: 'Coin 4',
        chess: '\u00c9checs',
        checkers: 'Dames',
        uno: 'Buno',
        bomb: 'La Bombe'
    };

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
    const siteAds = document.querySelector('.site-ads');
    const navButtons = document.querySelectorAll('.nav-button');
    const cinemaNavButtons = document.querySelectorAll('#cinemaHeaderNav .nav-button');
    const mathNavButtons = document.querySelectorAll('#mathHeaderNav .nav-button');
    const musicNavButtons = document.querySelectorAll('#musicHeaderNav .nav-button');
    const allViews = document.querySelectorAll('.view');
    const panels = document.querySelectorAll('.panel');
    const searchInput = document.getElementById('searchInput');
    const catalogGrid = document.getElementById('catalogGrid');
    const emptyCatalogMessage = document.getElementById('emptyCatalogMessage');
    const catalogResultsSummary = document.getElementById('catalogResultsSummary');
    const catalogGenreFilterGroup = document.getElementById('catalogGenreFilterGroup');
    const catalogReleaseFilterSelect = document.getElementById('catalogReleaseFilterSelect');
    const catalogLetterFilterSelect = document.getElementById('catalogLetterFilterSelect');
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
    const openLegalNoticeButton = document.getElementById('openLegalNoticeButton');
    const closeLegalNoticeButton = document.getElementById('closeLegalNoticeButton');
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
    const gameTabs = document.querySelectorAll('[data-game-tab]');
    const gamesSectionButtons = document.querySelectorAll('[data-games-section]');
    const gameHomeTiles = document.querySelectorAll('[data-open-game]');
    const gamesLayout = document.querySelector('#gamesView .games-layout');
    const gamesFiltersCard = document.getElementById('gamesFiltersCard');
    const gamesFilterSearchInput = document.getElementById('gamesFilterSearchInput');
    const gamesFilterButtons = document.querySelectorAll('[data-games-filter]');
    const gamesFilterCount = document.getElementById('gamesFilterCount');
    const gamesFilterHint = document.getElementById('gamesFilterHint');
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
    const GAME_FILTER_TAGS = {
        '2048': ['puzzle'],
        airHockey: ['arcade', 'reflexe'],
        flappy: ['arcade', 'reflexe'],
        baieBerry: ['arcade', 'puzzle'],
        battleship: ['strategie', 'puzzle', 'table'],
        breakout: ['arcade', 'reflexe'],
        blockBlast: ['puzzle', 'strategie'],
        mentalMath: ['puzzle', 'reflexe'],
        coinClicker: ['arcade'],
        candyCrush: ['puzzle'],
        checkers: ['strategie', 'table'],
        minesweeper: ['puzzle', 'strategie'],
        chess: ['strategie', 'table'],
        aim: ['reflexe', 'arcade'],
        memory: ['puzzle', 'reflexe', 'carte'],
        harborRun: ['arcade', 'reflexe'],
        ticTacToe: ['strategie', 'table'],
        pacman: ['arcade', 'reflexe'],
        pong: ['arcade', 'reflexe'],
        reaction: ['reflexe'],
        solitaire: ['strategie', 'puzzle', 'carte'],
        connect4: ['strategie', 'table'],
        rhythm: ['reflexe', 'arcade'],
        flowFree: ['puzzle'],
        magicSort: ['puzzle'],
        snake: ['arcade', 'reflexe'],
        stacker: ['arcade', 'reflexe'],
        sudoku: ['puzzle', 'strategie'],
        tetris: ['puzzle', 'reflexe'],
        uno: ['strategie', 'arcade', 'carte'],
        bomb: ['arcade', 'reflexe']
    };
    let activeGamesFilter = 'all';
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
    const battleshipModeButtons = document.querySelectorAll('[data-battleship-mode]');
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
    let pacmanCountdown = document.getElementById('pacmanCountdown');
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
    const SNAKE_SIZE = 14;
    const SNAKE_TICK_MS = 165;
    const SNAKE_BEST_KEY = 'baie-des-naufrages-snake-best';
    const PONG_TARGET_SCORE = 7;
    const SUDOKU_SIZE = 9;
    const GAME_2048_SIZE = 4;
    const GAME_2048_BEST_KEY = 'baie-des-naufrages-2048-best';
    const AIM_GRID_SIZE = 6;
    const AIM_TARGET_COUNT = 5;
    const AIM_DEFAULT_ROUND_SECONDS = 20;
    const AIM_HIT_SCORE = 12;
    const AIM_MISS_SCORE = 5;
    const AIM_BEST_KEY = 'baie-des-naufrages-aim-best';
    const CONNECT4_ROWS = 6;
    const CONNECT4_COLS = 7;
    const MEMORY_ICONS = ['\u2693', '\u{1F980}', '\u{1F419}', '\u{1F991}', '\u{1FAB8}', '\u{1F99E}', '\u{1F420}', '\u{1F9ED}'];
    const BATTLESHIP_SIZE = 8;
    const BLOCK_BLAST_SIZE = 8;
    const BLOCK_BLAST_BEST_KEY = 'baie-des-naufrages-block-blast-best';
    const UNO_COLORS = ['red', 'yellow', 'green', 'blue'];
    const BLOCK_BLAST_SHAPES = [
        { key: 'single', cells: [[0, 0]], color: 'sun' },
        { key: 'domino', cells: [[0, 0], [1, 0]], color: 'lagoon' },
        { key: 'trio', cells: [[0, 0], [1, 0], [2, 0]], color: 'gold' },
        { key: 'quad', cells: [[0, 0], [1, 0], [2, 0], [3, 0]], color: 'reef' },
        { key: 'square', cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: 'sand' },
        { key: 'l-small', cells: [[0, 0], [0, 1], [1, 1]], color: 'coral' },
        { key: 'l-tall', cells: [[0, 0], [0, 1], [0, 2], [1, 2]], color: 'sun' },
        { key: 't-small', cells: [[0, 0], [1, 0], [2, 0], [1, 1]], color: 'gold' },
        { key: 'zig', cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: 'lagoon' },
        { key: 'pillar', cells: [[0, 0], [0, 1], [0, 2], [0, 3]], color: 'reef' }
    ];
    const BATTLESHIP_SHIPS = [4, 3, 3, 2, 2];
    const TETRIS_ROWS = 18;
    const TETRIS_COLS = 10;
    const TETRIS_TICK_MS = 420;
    const RHYTHM_LANES = ['Q', 'S', 'D'];
    const RHYTHM_DURATION_MS = 30000;
    const RHYTHM_MAX_MISSES = 10;
    const RHYTHM_BEST_KEY = 'baie-des-naufrages-rhythm-best';
    const RHYTHM_NOTE_START_Y = 14;
    const RHYTHM_HIT_Y = 348;
    const RHYTHM_MISS_Y = 410;
    const RHYTHM_BURST_Y = 324;
    const FLAPPY_BEST_KEY = 'baie-des-naufrages-flappy-best';
    const HARBOR_RUN_BEST_KEY = 'baie-des-naufrages-harbor-run-best';
    const STACKER_BEST_KEY = 'baie-des-naufrages-stacker-best';
    const COIN_CLICKER_STORAGE_KEY = 'baie-des-naufrages-coin-clicker';
    const REACTION_BEST_KEY = 'baie-des-naufrages-reaction-best';
    const BAIE_BERRY_BEST_KEY = 'baie-des-naufrages-baieberry-best';
    const BAIE_BERRY_DANGER_LINE_Y = 74;
    const BAIE_BERRY_DANGER_DURATION_MS = 1600;
    const BAIE_BERRY_DANGER_GRACE_MS = 700;
    const BAIE_BERRY_COMBO_WINDOW_MS = 1400;
    const BAIE_BERRY_SHAKE_DECAY = 0.9;
    const BAIE_BERRY_DROP_COOLDOWN_MS = 500;
    const BREAKOUT_BEST_KEY = 'baie-des-naufrages-breakout-best';
    const BREAKOUT_BALL_SPEED = 320;
    const BREAKOUT_MAX_STEP_DISTANCE = 4;
    const FLOW_FREE_SIZE = 7;
    const FLOW_FREE_COLORS = [
        '#ef4444',
        '#2563eb',
        '#f59e0b',
        '#16a34a',
        '#7c3aed',
        '#ea580c',
        '#db2777',
        '#0891b2',
        '#f8fafc',
        '#65a30d'
    ];
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
    const MENTAL_MATH_START_TIME_MS = 15000;
    const MENTAL_MATH_TICK_MS = 100;
    const MENTAL_MATH_BASE_REWARD_MS = 1800;
    const MENTAL_MATH_FAST_REWARD_MS = 1200;
    const MENTAL_MATH_FAST_WINDOW_MS = 4000;
    const MENTAL_MATH_MAX_TIME_MS = 30000;
    const CHESS_SIZE = 8;
    const CHECKERS_SIZE = 8;
    const AIR_HOCKEY_GOAL_SCORE = 5;
    const AIR_HOCKEY_SPEED = 340;
    const AIR_HOCKEY_CENTER_GAP = 8;
    const AIR_HOCKEY_PADDLE_RADIUS = 34;
    const AIR_HOCKEY_PUCK_RADIUS = 22;
    const AIR_HOCKEY_PUCK_MAX_SPEED = 700;
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
        { id: 'parrot', label: 'Perroquet mousse', baseCost: 110, effectType: 'auto', bonus: 1, description: '+1 pièce / sec' },
        { id: 'harbor', label: 'Port marchand', baseCost: 260, effectType: 'auto', bonus: 4, description: '+4 pièces / sec' },
        { id: 'fleet', label: 'Flotte dorée', baseCost: 420, effectType: 'click', bonus: 8, description: '+8 par clic' },
        { id: 'treasury', label: 'Trésor royal', baseCost: 760, effectType: 'multiplier', bonus: 0.5, description: '+0,50 multiplicateur' }
    ];
    const CHESS_PIECES = {
        pawn: { white: '\u2659', black: '\u265F' },
        rook: { white: '\u2656', black: '\u265C' },
        knight: { white: '\u2658', black: '\u265E' },
        bishop: { white: '\u2657', black: '\u265D' },
        queen: { white: '\u2655', black: '\u265B' },
        king: { white: '\u2654', black: '\u265A' }
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
        { name: 'Baie Royale', radius: 58, color: '#facc15', score: 560 },
        { name: 'Perle Marine', radius: 72, color: '#2dd4bf', score: 1120 },
        { name: 'Rubis des Flots', radius: 88, color: '#ef4444', score: 2240 },
        { name: 'Couronne Abyssale', radius: 106, color: '#0f172a', score: 4480 }
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
        spades: '\u2660',
        hearts: '\u2665',
        clubs: '\u2663',
        diamonds: '\u2666'
    };
    const SUDOKU_DIFFICULTIES = [
        { difficulty: 'Moussaillon', removals: 38 },
        { difficulty: 'Pirate', removals: 46 },
        { difficulty: 'Capitaine', removals: 52 }
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
    let catalogSelectedGenres = new Set();
    let catalogReleaseFilter = 'all';
    let catalogLetterFilter = 'all';
    let catalogMinimumRatingFilter = 'all';
    let catalogSortMode = 'title-asc';
    let catalogDirectorTerm = '';
    let currentView = loginView;
    let siteAdsEnterTimer = null;
    let gamesFiltersEnterTimer = null;
    let activeGamesSection = 'home';
    let multiplayerSocket = null;
    let multiplayerActiveRoom = null;
    let multiplayerBusy = false;
    let multiplayerSelectedGameId = null;
    let multiplayerEntryMode = 'create';
    let multiplayerChatSignature = '';
    let ticTacToeLastFinishedStateKey = '';
    let battleshipLastFinishedStateKey = '';
    let pongLastFinishedStateKey = '';
    let connect4LastFinishedStateKey = '';
    let connect4LastMoveAnimationKey = '';
    let chessLastMoveAnimationKey = '';
    let checkersLastMoveAnimationKey = '';
    let chessLastFinishedStateKey = '';
    let checkersLastFinishedStateKey = '';
    let bombLastFinishedStateKey = '';
    let chessLastCaptureFxKey = '';
    let checkersLastCaptureFxKey = '';
    let chessMenuVisible = true;
    let chessMenuShowingRules = false;
    let chessMenuClosing = false;
    let chessMenuEntering = false;
    let chessOutcomeMenuTimer = null;
    let chessOutcomeMenuEnterTimer = null;
    let gameBoard = [];
    let flagsPlaced = 0;
    let timer = 0;
    let timerInterval = null;
    let gameStarted = false;
    let gameFinished = false;
    let minesweeperMenuVisible = true;
    let minesweeperMenuShowingRules = false;
    let minesweeperMenuClosing = false;
    let minesweeperMenuEntering = false;
    let minesweeperMenuResult = null;
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
    let snakeMenuVisible = true;
    let snakeMenuShowingRules = false;
    let snakeMenuClosing = false;
    let snakeMenuEntering = false;
    let snakeMenuResult = null;
    let pongRunning = false;
    let pongAnimationFrame = null;
    let pongLastFrame = 0;
    let pongRenderAnimationFrame = null;
    let pongRenderLastFrame = 0;
    let pongLastNetworkSyncAt = 0;
    let pongLocalPredictedPaddleY = null;
    let pongPlayerScore = 0;
    let pongAiScore = 0;
    let pongKeys = new Set();
    let pongState = null;
    let pongDisplayState = null;
    let pongPaused = false;
    let pongMultiplayerInputDirection = 0;
    let pongCountdownEndsAt = 0;
    let pongCountdownTimer = null;
    let pongCountdownCompleteTimer = null;
    let pongMode = 'solo';
    let pongMenuVisible = true;
    let pongMenuShowingRules = false;
    let pongMenuClosing = false;
    let pongMenuEntering = false;
    let pongMenuResult = null;
    let bombState = null;
    let bombTimerInterval = null;
    let bombMenuVisible = true;
    let bombMenuShowingRules = false;
    let bombMenuClosing = false;
    let bombMenuEntering = false;
    let bombSelectedMode = 'local';
    let bombLocalState = null;
    let pongBoardMetrics = null;
    let pongRenderMetrics = null;
    const PONG_SERVE_SPEED_X = 388;
    const PONG_SERVE_SPEED_Y = 228;
    const PONG_FIRST_RETURN_SPEED_X = 760;
    const PONG_FIRST_RETURN_Y_MULTIPLIER = 1.6;
    const PONG_RALLY_SPEED_INCREMENT = 20;
    const PONG_MAX_STEP_SECONDS = 1 / 120;
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
    let sudokuTimerStarted = false;
    let sudokuFeedbackCell = null;
    let sudokuFeedbackTimeout = null;
    let sudokuStatusTimeout = null;
    let sudokuDifficultyIndex = 0;
    let sudokuMenuVisible = true;
    let sudokuMenuShowingRules = false;
    let sudokuMenuClosing = false;
    let sudokuMenuEntering = false;
    let sudokuMenuResult = null;
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
    let game2048MenuVisible = true;
    let game2048MenuShowingRules = false;
    let game2048MenuClosing = false;
    let game2048MenuResult = false;
    let game2048TouchStartX = null;
    let game2048TouchStartY = null;
    let snakeTouchStartX = null;
    let snakeTouchStartY = null;
    let pacmanTouchStartX = null;
    let pacmanTouchStartY = null;
    let tetrisTouchStartX = null;
    let tetrisTouchStartY = null;
    let aimMenuVisible = true;
    let aimMenuShowingRules = false;
    let aimMenuClosing = false;
    let aimMenuEntering = false;
    let aimMenuResult = null;
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
    let memoryMenuVisible = true;
    let memoryMenuShowingRules = false;
    let memoryMenuClosing = false;
    let memoryMenuEntering = false;
    let memoryMenuResult = false;
    let ticTacToeBoardState = Array(9).fill('');
    let ticTacToeRenderedBoardState = Array(9).fill('');
    let ticTacToeCurrentPlayer = 'anchor';
    let ticTacToeScores = { anchor: 0, skull: 0 };
    let ticTacToeFinished = false;
    let ticTacToeMode = 'solo';
    let ticTacToeAiTimeout = null;
    let ticTacToeMenuVisible = true;
    let ticTacToeMenuShowingRules = false;
    let ticTacToeMenuClosing = false;
    let ticTacToeMenuEntering = false;
    let ticTacToeMenuResult = null;
    let ticTacToeOutcomeMenuTimeout = null;
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
    let tetrisGrid = [];
    let tetrisPiece = null;
    let tetrisScore = 0;
    let tetrisLines = 0;
    let tetrisRunning = false;
    let tetrisInterval = null;
    let tetrisMenuVisible = true;
    let tetrisMenuShowingRules = false;
    let tetrisMenuClosing = false;
    let tetrisMenuEntering = false;
    let tetrisMenuResult = null;
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
    let pacmanMenuVisible = true;
    let pacmanMenuShowingRules = false;
    let pacmanMenuClosing = false;
    let pacmanMenuEntering = false;
    let pacmanMenuResult = null;
    let solitaireStockCards = [];
    let solitaireWasteCards = [];
    let solitaireFoundationsState = { spades: [], hearts: [], clubs: [], diamonds: [] };
    let solitaireTableauColumns = [];
    let solitaireSelectedSource = null;
    let solitaireMenuVisible = true;
    let solitaireMenuShowingRules = false;
    let solitaireMenuClosing = false;
    let solitaireMenuEntering = false;
    let solitaireMenuResult = null;
    let connect4BoardState = [];
    let connect4CurrentPlayer = 'player';
    let connect4Scores = { player: 0, ai: 0 };
    let connect4Finished = false;
    let connect4AiTimeout = null;
    let connect4Mode = 'solo';
    let connect4DropAnimationKey = null;
    let connect4DropAnimationState = null;
    let connect4DropAnimationTimeout = null;
    let connect4OutcomeWinner = null;
    let connect4MenuVisible = true;
    let connect4MenuShowingRules = false;
    let connect4MenuClosing = false;
    let connect4MenuEntering = false;
    let connect4MenuResult = false;
    let connect4OutcomeMenuTimeout = null;
    let rhythmMenuVisible = true;
    let rhythmMenuShowingRules = false;
    let rhythmMenuClosing = false;
    let rhythmMenuEntering = false;
    let rhythmMenuResult = null;
    let rhythmNotes = [];
    let rhythmScore = 0;
    let rhythmStreak = 0;
    let rhythmMisses = 0;
    let rhythmBestScore = Number(window.localStorage.getItem(RHYTHM_BEST_KEY)) || 0;
    let rhythmRunning = false;
    let rhythmStartedAt = 0;
    let rhythmLastFrame = 0;
    let rhythmSpawnTimer = 0;
    let rhythmAnimationFrame = null;
    let rhythmPadHighlightTimeout = null;
    let rhythmBoardEffectTimeout = null;
    let rhythmBursts = [];
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
    let flappyMenuVisible = true;
    let flappyMenuShowingRules = false;
    let flappyMenuClosing = false;
    let flappyMenuEntering = false;
    let flappyMenuResultReason = '';
    const FLAPPY_BIRD_WIDTH = 46;
    const FLAPPY_BIRD_HEIGHT = 36;
    const FLAPPY_PIPE_WIDTH = 86;
    const FLAPPY_BIRD_OFFSET_X = 0.24;
    const FLAPPY_BASE_SPAWN_INTERVAL = 1720;
    const FLAPPY_MIN_SPAWN_INTERVAL = 1240;
    const FLAPPY_BASE_PIPE_SPEED = 0.176;
    const FLAPPY_MAX_PIPE_SPEED = 0.244;
    let flowFreeCells = [];
    let flowFreeLevel = null;
    let flowFreePaths = new Map();
    let flowFreeCompleted = new Set();
    let flowFreeMoves = 0;
    let flowFreeMenuVisible = true;
    let flowFreeMenuShowingRules = false;
    let flowFreeMenuClosing = false;
    let flowFreeMenuEntering = false;
    let flowFreeMenuResult = null;
    let flowFreeActiveColor = null;
    let flowFreePointerDown = false;
    let flowFreeRenderFrame = null;
    let flowFreeLastHoverKey = null;
    let flowFreePendingTarget = null;
    let flowFreeCatchupFrame = null;
    let flowFreeCompletionAnimationToken = 0;
    let flowFreeSpawning = new Set();
    let flowFreeSpawnTimers = new Map();
    let flowFreeDespawning = new Map();
    let flowFreeDespawnTimer = null;
    let magicSortTubes = [];
    let magicSortSelectedTube = null;
    let magicSortMoves = 0;
    let magicSortMenuVisible = true;
    let magicSortMenuShowingRules = false;
    let magicSortMenuClosing = false;
    let magicSortMenuEntering = false;
    let magicSortMenuResult = null;
    let mentalMathScore = 0;
    let mentalMathCurrentQuestion = null;
    let mentalMathTimeRemainingMs = MENTAL_MATH_START_TIME_MS;
    let mentalMathTimerInterval = null;
    let mentalMathRoundRunning = false;
    let mentalMathQuestionStartedAt = 0;
    let mentalMathMenuVisible = true;
    let mentalMathMenuShowingRules = false;
    let mentalMathMenuClosing = false;
    let mentalMathMenuEntering = false;
    let mentalMathMenuResult = false;
    let candyCrushGrid = [];
    let candyCrushSelectedCell = null;
    let candyCrushScore = 0;
    let candyCrushMoves = 18;
    let candyCrushAnimating = false;
    let candyCrushPointerStart = null;
    let candyCrushMenuVisible = true;
    let candyCrushMenuShowingRules = false;
    let candyCrushMenuClosing = false;
    let candyCrushMenuEntering = false;
    let candyCrushMenuResult = null;
    let harborRunLane = 1;
    let harborRunVisualLane = 1;
    let harborRunObstacles = [];
    let harborRunScore = 0;
    let harborRunBestScore = Number(window.localStorage.getItem(HARBOR_RUN_BEST_KEY)) || 0;
    let harborRunRunning = false;
    let harborRunAnimationFrame = null;
    let harborRunLastFrame = 0;
    let harborRunSpawnTimer = 0;
    let harborRunSafeLane = 1;
    let harborRunBackdropOffset = 0;
    let harborRunMenuVisible = true;
    let harborRunMenuShowingRules = false;
    let harborRunMenuClosing = false;
    let harborRunMenuEntering = false;
    let harborRunMenuResult = null;
    let stackerLayers = [];
    let stackerCurrentLayer = null;
    let stackerFragments = [];
    let stackerScore = 0;
    let stackerBestScore = Number(window.localStorage.getItem(STACKER_BEST_KEY)) || 0;
    let stackerRunning = false;
    let stackerAnimationFrame = null;
    let stackerLastFrame = 0;
    let stackerMenuVisible = true;
    let stackerMenuShowingRules = false;
    let stackerMenuClosing = false;
    let stackerMenuEntering = false;
    let stackerMenuResult = null;
    let coinClickerMenuVisible = true;
    let coinClickerMenuShowingRules = false;
    let coinClickerMenuClosing = false;
    let coinClickerMenuEntering = false;
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
    let chessDragState = null;
    let chessSuppressNextClick = false;
    let chessAiTimeout = null;
    let chessLastMoveResetTimer = null;
    let checkersState = null;
    let checkersSelectedSquare = null;
    let checkersMode = 'solo';
    let checkersAiTimeout = null;
    let checkersLastMoveResetTimer = null;
    let checkersMenuVisible = true;
    let checkersMenuShowingRules = false;
    let checkersMenuClosing = false;
    let checkersMenuEntering = false;
    let checkersMenuResult = false;
    let airHockeyMode = 'solo';
    let airHockeyState = null;
    let airHockeyDisplayState = null;
    let airHockeyKeys = new Set();
    let airHockeyAnimationFrame = null;
    let airHockeyRenderAnimationFrame = null;
    let airHockeyLastFrame = 0;
    let airHockeyRenderLastFrame = 0;
    let airHockeyCountdownActive = false;
    let airHockeyCountdownEndsAt = 0;
    let airHockeyLastFinishedStateKey = '';
    let airHockeyMultiplayerInput = { x: 0, y: 0 };
    let airHockeyLocalPredicted = null;
    let airHockeyCountdownTimer = null;
    let airHockeyCountdownCompleteTimer = null;
    let airHockeyMenuVisible = true;
    let airHockeyMenuShowingRules = false;
    let airHockeyMenuClosing = false;
    let airHockeyMenuEntering = false;
    let airHockeyMenuResult = null;
    let reactionState = 'idle';
    let reactionBestTime = Number(window.localStorage.getItem(REACTION_BEST_KEY)) || null;
    let reactionStartTime = 0;
    let reactionTimeout = null;
    let reactionMenuVisible = true;
    let reactionMenuShowingRules = false;
    let reactionMenuClosing = false;
    let reactionMenuEntering = false;
    let reactionMenuResult = null;
    let baieBerryState = null;
    let baieBerryAnimationFrame = null;
    let baieBerryLastFrame = 0;
    let baieBerryBestScore = Number(window.localStorage.getItem(BAIE_BERRY_BEST_KEY)) || 0;
    let baieBerryNextFruitId = 1;
    let baieBerryLastPointerX = null;
    let baieBerryDropLineTimer = null;
    let baieBerryLastDropAt = 0;
    let baieBerryMenuVisible = true;
    let baieBerryMenuShowingRules = false;
    let baieBerryMenuClosing = false;
    let baieBerryMenuEntering = false;
    let baieBerryMenuResult = false;
    let breakoutState = null;
    let breakoutAnimationFrame = null;
    let breakoutLastFrame = 0;
    let breakoutKeys = new Set();
    let breakoutBestScore = Number(window.localStorage.getItem(BREAKOUT_BEST_KEY)) || 0;
    let breakoutRemainingBricks = 0;
    let breakoutMenuVisible = true;
    let breakoutMenuShowingRules = false;
    let breakoutMenuClosing = false;
    let breakoutMenuResult = null;
    let blockBlastState = null;
    let blockBlastBestScore = Number(window.localStorage.getItem(BLOCK_BLAST_BEST_KEY)) || 0;
    let blockBlastSelectedPieceIndex = null;
    let blockBlastPreview = null;
    let blockBlastDragState = null;
    let blockBlastSuppressClick = false;
    let blockBlastMenuVisible = true;
    let blockBlastMenuShowingRules = false;
    let blockBlastMenuClosing = false;
    let blockBlastMenuEntering = false;
    let blockBlastMenuResult = null;
    let unoMode = 'solo';
    let unoState = null;
    let unoAiTimeout = null;
    let unoPendingColorContext = null;
    let unoLastWinnerKey = '';
    let unoEventBannerTimer = null;
    let unoLastPlayedCardId = '';
    let unoLastDrawnCardId = '';
    let unoPreviousOpponentCounts = new Map();
    let unoOpponentDrawFx = new Map();
    let unoPendingOpponentDrawAnimations = new Map();
    let unoColorChoiceTimer = null;
    let unoColorChoicePending = false;
    let unoPendingPlayAnimation = null;
    let unoPendingDrawAnimation = false;
    let unoDrawRequestPending = false;
    let unoLastRenderedTopCardId = '';
    let unoMenuVisible = true;
    let unoMenuShowingRules = false;
    let unoMenuClosing = false;
    const UNO_MENU_CLOSE_DURATION_MS = 260;
    const GRID_OUTCOME_MENU_DELAY_MS = 650;
    let resizeFrame = null;
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

    function syncSiteAdsVisibility(targetView, options = {}) {
        if (!siteAds) {
            return;
        }

        const { immediate = false } = options;
        const shouldHide = shouldHideSiteAdsForView(targetView);

        if (shouldHide) {
            window.clearTimeout(siteAdsEnterTimer);
            siteAds.classList.remove('site-ads-entering');
        }

        siteAds.classList.toggle('site-ads-no-transition', immediate);
        siteAds.classList.toggle('site-ads-hidden', shouldHide);

        if (immediate) {
            window.requestAnimationFrame(() => {
                siteAds.classList.remove('site-ads-no-transition');
            });
        }
    }

    function playSiteAdsEntrance() {
        if (!siteAds) {
            return;
        }

        window.clearTimeout(siteAdsEnterTimer);
        siteAds.classList.remove('site-ads-entering');
        void siteAds.offsetWidth;
        siteAds.classList.add('site-ads-entering');
        siteAdsEnterTimer = window.setTimeout(() => {
            siteAds.classList.remove('site-ads-entering');
        }, 550);
    }

    function syncGamesFiltersCardVisibility(targetView, options = {}) {
        if (!gamesFiltersCard) {
            return;
        }

        const { immediate = false } = options;
        const shouldHide = targetView !== gamesView;

        gamesFiltersCard.classList.toggle('games-filters-card-no-transition', immediate);
        gamesFiltersCard.classList.toggle('games-filters-card-hidden', shouldHide);

        if (immediate) {
            window.requestAnimationFrame(() => {
                gamesFiltersCard.classList.remove('games-filters-card-no-transition');
            });
        }
    }

    function playGamesFiltersEntrance() {
        if (!gamesFiltersCard) {
            return;
        }

        window.clearTimeout(gamesFiltersEnterTimer);
        gamesFiltersCard.classList.remove('games-filters-card-entering');
        void gamesFiltersCard.offsetWidth;
        gamesFiltersCard.classList.add('games-filters-card-entering');
        gamesFiltersEnterTimer = window.setTimeout(() => {
            gamesFiltersCard.classList.remove('games-filters-card-entering');
        }, 550);
    }

    function shouldHideSiteAdsForView(view) {
        return view === loginView || view === servicesView || view === appView;
    }

    function transitionToView(nextView, options = {}) {
        const {
            showHeader = false,
            headerMode = 'none',
            onComplete
        } = options;
        const shouldHideAdsOnCurrentView = shouldHideSiteAdsForView(currentView);
        const shouldHideAdsOnNextView = shouldHideSiteAdsForView(nextView);
        const shouldHideGamesFiltersOnCurrentView = currentView !== gamesView;
        const shouldHideGamesFiltersOnNextView = nextView !== gamesView;

        currentView.classList.add('view-leaving');

        if (shouldHideAdsOnNextView) {
            syncSiteAdsVisibility(nextView);
        }

        if (shouldHideGamesFiltersOnNextView) {
            syncGamesFiltersCardVisibility(nextView);
        }

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

            if (!shouldHideAdsOnNextView && shouldHideAdsOnCurrentView) {
                syncSiteAdsVisibility(nextView);
                playSiteAdsEntrance();
            }

            if (!shouldHideGamesFiltersOnNextView && shouldHideGamesFiltersOnCurrentView) {
                syncGamesFiltersCardVisibility(nextView);
                playGamesFiltersEntrance();
            }

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

        allViews.forEach((view) => {
            view.classList.remove('view-active', 'view-leaving');
            view.setAttribute('aria-hidden', 'true');
        });

        if (currentView === musicView && nextView !== musicView) {
            stopAllPianoNotes();
        }

        siteHeader.classList.toggle('hidden', !showHeader);
        siteHeader.setAttribute('aria-hidden', String(!showHeader));
        setHeaderMode(headerMode);
        syncSiteAdsVisibility(nextView, { immediate: true });
        syncGamesFiltersCardVisibility(nextView, { immediate: true });
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
            pianoHelpText.textContent = `${note.note} en cours. ${pianoSustainActive ? 'Pédale active. ' : ''}Commande : ${note.keyLabel}.`;
            return;
        }

        if (pianoSustainActive) {
            pianoHelpText.textContent = 'Pédale active. Espace maintient les notes, relâche Espace pour couper celles qui ne sont plus tenues.';
            return;
        }

        pianoHelpText.textContent = "Utilise A à K. Maintiens Maj pour l'octave au-dessus, Espace pour la pédale, ou clique directement sur le clavier.";
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
        const mathFunctions = ['sqrt', 'cbrt', 'abs', 'exp', 'log', 'log2', 'log10', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'floor', 'ceil', 'round', 'sign'];
        let normalized = expression
            .replace(/(\d),(\d)/g, '$1.$2')
            .replace(/[xÃ—]/gi, '*')
            .replace(/[Ã·]/g, '/')
            .replace(/\bpi\b/gi, 'Math.PI')
            .replace(/\be\b/g, 'Math.E')
            .replace(/\^/g, '**');

        mathFunctions.forEach((name) => {
            normalized = normalized.replace(new RegExp(`\\b${name}\\(`, 'gi'), `Math.${name}(`);
        });

        return normalized;
    }

    function evaluateCalculatorExpression() {
        const rawExpression = calculatorDisplay.value.trim();

        if (!rawExpression) {
            calculatorStatus.textContent = 'Entre une expression à calculer.';
            calculatorStatus.classList.remove('feedback-success');
            calculatorStatus.classList.add('feedback-error');
            return;
        }

        const normalizedExpression = normalizeCalculatorExpression(rawExpression);

        if (!/^(?:[0-9+\-*/().%\s]|Math\.(?:PI|E|abs|sqrt|cbrt|exp|log|log2|log10|sin|cos|tan|asin|acos|atan|floor|ceil|round|sign))+$/.test(normalizedExpression)) {
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
            calculatorStatus.textContent = `Résultat : ${formatMathNumber(result, 10)}`;
            calculatorStatus.classList.remove('feedback-error');
            calculatorStatus.classList.add('feedback-success');
        } catch (error) {
            calculatorStatus.textContent = "Calcul impossible. Vérifie l'expression.";
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
            ruleThreeResult.textContent = 'Entre trois valeurs valides et un a différent de 0.';
            return;
        }

        const result = (b * c) / a;
        ruleThreeResult.textContent = `Si ${formatMathNumber(a)} correspond à ${formatMathNumber(b)}, alors ${formatMathNumber(c)} correspond à ${formatMathNumber(result)}.`;
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

        circleResult.textContent = `Diamètre : ${formatMathNumber(diameter)} | Circonférence : ${formatMathNumber(circumference)} | Aire : ${formatMathNumber(area)}`;
    }

    function formatDate(dateString) {
        if (!dateString) {
            return 'Date inconnue';
        }

        if (/^\d{4}$/.test(String(dateString).trim())) {
            return String(dateString).trim();
        }

        const parsedDate = new Date(dateString);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Date inconnue';
        }

        return new Intl.DateTimeFormat('fr-FR').format(parsedDate);
    }

    function formatExcelDisplayValue(value) {
        if (!value && value !== 0) {
            return '';
        }

        if (value instanceof Date && !Number.isNaN(value.getTime())) {
            return new Intl.DateTimeFormat('fr-FR').format(value);
        }

        return String(value).trim();
    }

    function formatRating(value) {
        return formatRatingWithScale(value, 20);
    }

    function formatRatingWithScale(value, scale = 20) {
        const rating = Number(value);
        const normalizedScale = Number(scale);

        if (!Number.isFinite(rating)) {
            return 'Non note';
        }

        const formattedRating = Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
        return `${formattedRating} / ${Number.isFinite(normalizedScale) && normalizedScale > 0 ? normalizedScale : 20}`;
    }

    function getRatingBadgeTone(value, scale = 20) {
        const rating = Number(value);
        const normalizedScale = Number(scale);
        const safeScale = Number.isFinite(normalizedScale) && normalizedScale > 0 ? normalizedScale : 20;

        if (!Number.isFinite(rating)) {
            return 'is-unrated';
        }

        const ratio = Math.max(0, Math.min(1, rating / safeScale));

        if (ratio < 0.3) {
            return 'is-poor';
        }
        if (ratio < 0.5) {
            return 'is-rough';
        }
        if (ratio < 0.65) {
            return 'is-fair';
        }
        if (ratio < 0.8) {
            return 'is-good';
        }
        if (ratio < 0.9) {
            return 'is-great';
        }
        return 'is-excellent';
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

        if (/^\d{4}$/.test(normalizedValue)) {
            return normalizedValue;
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
            'film',
            'films'
        ])).trim();

        if (!title) {
            return null;
        }

        const ratingValue = parseNumberValue(getFirstFilledValue(normalizedRecord, [
            'note',
            'rating',
            'score',
            'notesur20',
            'notesur5'
        ]));
        const hasNoteSur5Column = normalizedRecord.notesur5 !== undefined && String(normalizedRecord.notesur5).trim() !== '';
        const hasNoteSur20Column = normalizedRecord.notesur20 !== undefined && String(normalizedRecord.notesur20).trim() !== '';
        const ratingScale = hasNoteSur20Column || (Number.isFinite(ratingValue) && ratingValue > 5)
            ? 20
            : (hasNoteSur5Column ? 5 : 20);
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
        const directorLink = String(getFirstFilledValue(normalizedRecord, [
            'realisateurlink',
            'directorlink',
            'auteurlink'
        ])).trim();
        const posterUrl = String(getFirstFilledValue(normalizedRecord, [
            'affiche',
            'poster',
            'posterurl',
            'image',
            'img'
        ])).trim();
        const releaseDisplay = formatExcelDisplayValue(getFirstFilledValue(normalizedRecord, [
            'dateaffichage',
            'date',
            'datesortie',
            'sortie',
            'releasedate'
        ]));

        return {
            id: crypto.randomUUID(),
            title,
            director,
            directorLink,
            genre,
            releaseDate,
            releaseDisplay,
            ratingScale,
            duration: durationValue || 0,
            rating: ratingValue,
            posterUrl: posterUrl || defaultPoster
        };
    }

    function parseMoviesFromFixedColumns(worksheet) {
        if (!worksheet?.['!ref'] || !window.XLSX?.utils) {
            return [];
        }

        const range = window.XLSX.utils.decode_range(worksheet['!ref']);
        const moviesFromColumns = [];
        const columnMap = {
            films: 'CA',
            date: 'CB',
            dateaffichage: 'CB',
            genre: 'CC',
            realisateur: 'CD',
            realisateurlink: 'CD',
            notesur20: 'CE'
        };

        for (let rowNumber = 2; rowNumber <= range.e.r + 1; rowNumber += 1) {
            const row = Object.fromEntries(Object.entries(columnMap).map(([key, column]) => {
                const cell = worksheet[`${column}${rowNumber}`];

                if (key === 'dateaffichage') {
                    return [key, cell?.w ?? cell?.v ?? ''];
                }

                if (key === 'realisateurlink') {
                    return [key, cell?.l?.Target ?? ''];
                }

                return [key, cell?.v ?? ''];
            }));
            const normalizedMovie = normalizeMovieRow(row);

            if (normalizedMovie) {
                moviesFromColumns.push(normalizedMovie);
            }
        }

        return moviesFromColumns;
    }

    function parseMoviesFromWorksheetRows(worksheet) {
        if (!worksheet?.['!ref'] || !window.XLSX?.utils) {
            return [];
        }

        const range = window.XLSX.utils.decode_range(worksheet['!ref']);
        const headersByColumn = new Map();
        const moviesFromRows = [];

        for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
            const headerCellAddress = window.XLSX.utils.encode_cell({ c: columnIndex, r: range.s.r });
            const headerValue = worksheet[headerCellAddress]?.v;

            if (headerValue !== undefined && headerValue !== null && String(headerValue).trim() !== '') {
                headersByColumn.set(columnIndex, normalizeHeader(headerValue));
            }
        }

        for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex += 1) {
            const rowRecord = {};

            headersByColumn.forEach((headerKey, columnIndex) => {
                const cellAddress = window.XLSX.utils.encode_cell({ c: columnIndex, r: rowIndex });
                const cell = worksheet[cellAddress];

                if (!cell) {
                    rowRecord[headerKey] = '';
                    return;
                }

                rowRecord[headerKey] = cell.v ?? '';

                if (headerKey === 'date') {
                    rowRecord.dateaffichage = cell.w ?? cell.v ?? '';
                }

                if (headerKey === 'realisateur' && cell.l?.Target) {
                    rowRecord.realisateurlink = cell.l.Target;
                }
            });

            const normalizedMovie = normalizeMovieRow(rowRecord);

            if (normalizedMovie) {
                moviesFromRows.push(normalizedMovie);
            }
        }

        return moviesFromRows;
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
        const importedRows = parseMoviesFromWorksheetRows(worksheet);

        if (importedRows.length) {
            const shouldUseTwentyPointScale = importedRows.some((movie) => Number(movie.rating) > 5);
            return shouldUseTwentyPointScale
                ? importedRows.map((movie) => ({ ...movie, ratingScale: 20 }))
                : importedRows;
        }

        const fallbackRows = parseMoviesFromFixedColumns(worksheet);
        const shouldUseTwentyPointScale = fallbackRows.some((movie) => Number(movie.rating) > 5);
        return shouldUseTwentyPointScale
            ? fallbackRows.map((movie) => ({ ...movie, ratingScale: 20 }))
            : fallbackRows;
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

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 8000);

        try {
            for (const fileName of EXCEL_FILE_CANDIDATES) {
                if (controller.signal.aborted) {
                    break;
                }
                try {
                    const response = await fetch(fileName, { cache: 'no-store', signal: controller.signal });

                    if (!response.ok) {
                        continue;
                    }

                    const fileBuffer = await response.arrayBuffer();
                    const importedMovies = await enrichMoviesWithRemotePosters(parseMoviesFromWorkbook(fileBuffer));

                    movies = importedMovies;
                    renderAll();
                    setExcelImportFeedback(
                        importedMovies.length
                            ? `${importedMovies.length} film${importedMovies.length > 1 ? 's importés' : ' importé'} depuis Excel.`
                            : "Le fichier Excel a été trouvé, mais aucune ligne film exploitable n'a été lue.",
                        importedMovies.length ? 'success' : 'error'
                    );

                    if (excelSourceName) {
                        excelSourceName.textContent = `Source détectée : ${fileName}`;
                    }

                    return;
                } catch (error) {
                    if (error?.name === 'AbortError') {
                        break;
                    }
                    console.error(`Impossible de lire ${fileName}.`, error);
                }
            }

            movies = loadMovies();
            renderAll();
            setExcelImportFeedback('Aucun fichier Excel trouvé. Place un fichier film.xlsx à la racine du dépôt pour importer des films.', 'error');

            if (excelSourceName) {
                excelSourceName.textContent = 'Ajoute par exemple film.xlsx ou film.xls à côté de index.html.';
            }
        } finally {
            window.clearTimeout(timeoutId);
        }
    }

    function formatDuration(minutes) {
        const value = Number(minutes);

        if (!value) {
            return 'xxhxx';
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

    function sanitizeImageUrl(url) {
        const value = String(url || '').trim();

        if (!value) {
            return defaultPoster;
        }

        try {
            const parsedUrl = new URL(value, window.location.href);
            if (['http:', 'https:'].includes(parsedUrl.protocol)) {
                return parsedUrl.href;
            }
        } catch (_error) {
            return defaultPoster;
        }

        return defaultPoster;
    }

    function buildDirectorSearchUrl(directorName, fallbackUrl = '') {
        const normalizedName = String(directorName || '').trim();

        if (normalizedName) {
            return `https://www.google.com/search?q=${encodeURIComponent(normalizedName)}`;
        }

        return String(fallbackUrl || '').trim();
    }

    async function enrichMoviesWithRemotePosters(importedMovies) {
        const moviesNeedingPoster = importedMovies.filter((movie) => !movie.posterUrl || movie.posterUrl === defaultPoster);

        if (!moviesNeedingPoster.length) {
            return importedMovies;
        }

        try {
            const response = await fetch('/api/posters/resolve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    movies: moviesNeedingPoster.map((movie) => ({
                        id: movie.id,
                        title: movie.title,
                        releaseDate: movie.releaseDate,
                        releaseDisplay: movie.releaseDisplay
                    }))
                })
            });

            if (!response.ok) {
                return importedMovies;
            }

            const payload = await response.json();
            const posterUrlsById = new Map(
                Array.isArray(payload?.resolutions)
                    ? payload.resolutions.map((item) => [item.id, item.posterUrl])
                    : []
            );

            return importedMovies.map((movie) => {
                const resolvedPosterUrl = posterUrlsById.get(movie.id);
                return resolvedPosterUrl ? { ...movie, posterUrl: resolvedPosterUrl } : movie;
            });
        } catch (_error) {
            return importedMovies;
        }
    }

    function normalizeCatalogText(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    function getMovieGenreTokens(movie) {
        return Array.from(new Set(
            String(movie?.genre || '')
                .split(/[,/;|]+/)
                .map((entry) => entry.trim())
                .filter(Boolean)
        ));
    }

    function getMovieReleaseYear(movie) {
        const directYear = Number(String(movie?.releaseDate || '').slice(0, 4));
        if (Number.isFinite(directYear) && directYear > 1800) {
            return directYear;
        }

        const fallbackMatch = String(movie?.releaseDisplay || '').match(/(19|20)\d{2}/);
        return fallbackMatch ? Number(fallbackMatch[0]) : null;
    }

    function getMovieRatingOutOfTwenty(movie) {
        const rating = Number(movie?.rating);
        const scale = Number(movie?.ratingScale || 20);
        if (!Number.isFinite(rating) || !Number.isFinite(scale) || scale <= 0) {
            return null;
        }
        return (rating / scale) * 20;
    }

    function getMovieTitleLetter(movie) {
        const normalizedTitle = normalizeCatalogText(movie?.title);
        if (!normalizedTitle) {
            return '#';
        }

        const firstCharacter = normalizedTitle.charAt(0).toUpperCase();
        return /[A-Z]/.test(firstCharacter) ? firstCharacter : '#';
    }

    function syncCatalogSelectOptions(selectElement, options, currentValue) {
        if (!selectElement) {
            return;
        }

        const previousValue = currentValue ?? selectElement.value;
        selectElement.textContent = '';
        const fragment = document.createDocumentFragment();

        options.forEach(({ value, label }) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            fragment.appendChild(option);
        });

        selectElement.appendChild(fragment);
        selectElement.value = options.some((option) => option.value === previousValue)
            ? previousValue
            : (options[0]?.value || '');
    }

    function renderCatalogFilters() {
        const genreCounts = new Map();
        const directorNames = new Set();
        const titleLetters = new Set();

        movies.forEach((movie) => {
            getMovieGenreTokens(movie).forEach((genre) => {
                genreCounts.set(genre, Number(genreCounts.get(genre) || 0) + 1);
            });

            if (movie.director) {
                directorNames.add(movie.director);
            }

            titleLetters.add(getMovieTitleLetter(movie));
        });

        catalogSelectedGenres = new Set([...catalogSelectedGenres].filter((genre) => genreCounts.has(genre)));

        if (catalogGenreFilterGroup) {
            catalogGenreFilterGroup.textContent = '';
            const fragment = document.createDocumentFragment();
            const sortedGenres = [...genreCounts.entries()].sort((left, right) => left[0].localeCompare(right[0], 'fr'));

            if (!sortedGenres.length) {
                const empty = document.createElement('p');
                empty.className = 'catalog-filter-empty';
                empty.textContent = "Les genres appara\u00eetront ici apr\u00e8s l'import.";
                fragment.appendChild(empty);
            } else {
                sortedGenres.forEach(([genre, count]) => {
                    const label = document.createElement('label');
                    label.className = 'catalog-genre-option';

                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.name = 'catalogGenreFilter';
                    input.value = genre;
                    input.checked = catalogSelectedGenres.has(genre);

                    const copy = document.createElement('span');
                    copy.className = 'catalog-genre-option-copy';
                    copy.textContent = genre;

                    const meta = document.createElement('span');
                    meta.className = 'catalog-genre-option-count';
                    meta.textContent = String(count);

                    label.append(input, copy, meta);
                    fragment.appendChild(label);
                });
            }

            catalogGenreFilterGroup.appendChild(fragment);
        }

        syncCatalogSelectOptions(catalogReleaseFilterSelect, [
            { value: 'all', label: 'Toutes les p\u00e9riodes' },
            { value: '2020+', label: "2020 \u00e0 aujourd'hui" },
            { value: '2010s', label: 'Ann\u00e9es 2010' },
            { value: '2000s', label: 'Ann\u00e9es 2000' },
            { value: '1990s', label: 'Ann\u00e9es 1990' },
            { value: '1980s', label: 'Ann\u00e9es 1980' },
            { value: 'before-1980', label: 'Avant 1980' }
        ], catalogReleaseFilter);
        catalogReleaseFilter = catalogReleaseFilterSelect?.value || 'all';

        syncCatalogSelectOptions(catalogLetterFilterSelect, [
            { value: 'all', label: 'Toutes les initiales' },
            ...[...titleLetters].sort().map((letter) => ({ value: letter, label: letter === '#' ? 'Titres num\u00e9riques / autres' : letter }))
        ], catalogLetterFilter);
        catalogLetterFilter = catalogLetterFilterSelect?.value || 'all';

        syncCatalogSelectOptions(catalogRatingFilterSelect, [
            { value: 'all', label: 'Toutes les notes' },
            { value: '16', label: '16 / 20 et plus' },
            { value: '14', label: '14 / 20 et plus' },
            { value: '12', label: '12 / 20 et plus' },
            { value: '10', label: '10 / 20 et plus' },
            { value: '8', label: '8 / 20 et plus' }
        ], catalogMinimumRatingFilter);
        catalogMinimumRatingFilter = catalogRatingFilterSelect?.value || 'all';

        syncCatalogSelectOptions(catalogSortFilterSelect, [
            { value: 'title-asc', label: 'Titre A \u00e0 Z' },
            { value: 'title-desc', label: 'Titre Z \u00e0 A' },
            { value: 'rating-desc', label: 'Note d\u00e9croissante' },
            { value: 'rating-asc', label: 'Note croissante' },
            { value: 'release-desc', label: 'Sortie la plus r\u00e9cente' },
            { value: 'release-asc', label: 'Sortie la plus ancienne' },
            { value: 'director-asc', label: 'R\u00e9alisateur A \u00e0 Z' }
        ], catalogSortMode);
        catalogSortMode = catalogSortFilterSelect?.value || 'title-asc';

        if (catalogDirectorSuggestions) {
            catalogDirectorSuggestions.textContent = '';
            const fragment = document.createDocumentFragment();
            [...directorNames].sort((left, right) => left.localeCompare(right, 'fr')).forEach((directorName) => {
                const option = document.createElement('option');
                option.value = directorName;
                fragment.appendChild(option);
            });
            catalogDirectorSuggestions.appendChild(fragment);
        }

        if (catalogDirectorFilterInput && catalogDirectorFilterInput.value !== catalogDirectorTerm) {
            catalogDirectorFilterInput.value = catalogDirectorTerm;
        }
    }

    function updateCatalogResultsSummary(filteredMovies) {
        if (!catalogResultsSummary) {
            return;
        }

        const activeFilters = [
            searchTerm,
            catalogDirectorTerm,
            catalogReleaseFilter !== 'all' ? catalogReleaseFilter : '',
            catalogLetterFilter !== 'all' ? catalogLetterFilter : '',
            catalogMinimumRatingFilter !== 'all' ? catalogMinimumRatingFilter : '',
            catalogSortMode !== 'title-asc' ? catalogSortMode : '',
            catalogSelectedGenres.size ? 'genres' : ''
        ].filter(Boolean).length;

        if (!movies.length) {
            catalogResultsSummary.textContent = 'Le panneau sera prêt dès que les films seront importés.';
            return;
        }

        catalogResultsSummary.textContent = activeFilters
            ? `${filteredMovies.length} film${filteredMovies.length > 1 ? 's correspondent' : ' correspond'} aux filtres sur ${movies.length}.`
            : `${movies.length} film${movies.length > 1 ? 's disponibles' : ' disponible'} dans le catalogue.`;
    }

    function getFilteredMovies() {
        const normalizedSearch = normalizeCatalogText(searchTerm);
        const normalizedDirectorSearch = normalizeCatalogText(catalogDirectorTerm);
        const minimumRating = catalogMinimumRatingFilter === 'all' ? null : Number(catalogMinimumRatingFilter);

        const filteredMovies = movies.filter((movie) => {
            if (normalizedSearch) {
                const titleMatches = normalizeCatalogText(movie.title).includes(normalizedSearch);
                const directorMatches = normalizeCatalogText(movie.director).includes(normalizedSearch);
                if (!titleMatches && !directorMatches) {
                    return false;
                }
            }

            if (normalizedDirectorSearch && !normalizeCatalogText(movie.director).includes(normalizedDirectorSearch)) {
                return false;
            }

            if (catalogSelectedGenres.size) {
                const movieGenres = new Set(getMovieGenreTokens(movie));
                if (![...catalogSelectedGenres].every((genre) => movieGenres.has(genre))) {
                    return false;
                }
            }

            if (catalogLetterFilter !== 'all' && getMovieTitleLetter(movie) !== catalogLetterFilter) {
                return false;
            }

            const releaseYear = getMovieReleaseYear(movie);
            if (catalogReleaseFilter === '2020+' && (!releaseYear || releaseYear < 2020)) {
                return false;
            }
            if (catalogReleaseFilter === '2010s' && (!releaseYear || releaseYear < 2010 || releaseYear > 2019)) {
                return false;
            }
            if (catalogReleaseFilter === '2000s' && (!releaseYear || releaseYear < 2000 || releaseYear > 2009)) {
                return false;
            }
            if (catalogReleaseFilter === '1990s' && (!releaseYear || releaseYear < 1990 || releaseYear > 1999)) {
                return false;
            }
            if (catalogReleaseFilter === '1980s' && (!releaseYear || releaseYear < 1980 || releaseYear > 1989)) {
                return false;
            }
            if (catalogReleaseFilter === 'before-1980' && (!releaseYear || releaseYear >= 1980)) {
                return false;
            }

            if (minimumRating !== null) {
                const ratingOnTwenty = getMovieRatingOutOfTwenty(movie);
                if (!Number.isFinite(ratingOnTwenty) || ratingOnTwenty < minimumRating) {
                    return false;
                }
            }

            return true;
        });

        const compareText = (left, right) => String(left || '').localeCompare(String(right || ''), 'fr', { sensitivity: 'base' });

        filteredMovies.sort((left, right) => {
            if (catalogSortMode === 'title-desc') {
                return compareText(right.title, left.title);
            }
            if (catalogSortMode === 'rating-desc') {
                return (getMovieRatingOutOfTwenty(right) ?? -Infinity) - (getMovieRatingOutOfTwenty(left) ?? -Infinity);
            }
            if (catalogSortMode === 'rating-asc') {
                return (getMovieRatingOutOfTwenty(left) ?? Infinity) - (getMovieRatingOutOfTwenty(right) ?? Infinity);
            }
            if (catalogSortMode === 'release-desc') {
                return (getMovieReleaseYear(right) ?? -Infinity) - (getMovieReleaseYear(left) ?? -Infinity);
            }
            if (catalogSortMode === 'release-asc') {
                return (getMovieReleaseYear(left) ?? Infinity) - (getMovieReleaseYear(right) ?? Infinity);
            }
            if (catalogSortMode === 'director-asc') {
                return compareText(left.director, right.director) || compareText(left.title, right.title);
            }
            return compareText(left.title, right.title);
        });

        return filteredMovies;
    }

    function renderStats() {
        const count = movies.length;
        const ratedMovies = movies.filter((movie) => Number.isFinite(Number(movie.rating)));
        const total = ratedMovies.reduce((sum, movie) => sum + Number(movie.rating), 0);
        const average = ratedMovies.length ? (total / ratedMovies.length).toFixed(1) : null;
        const ratingScale = ratedMovies[0]?.ratingScale || movies[0]?.ratingScale || 20;

        movieCount.textContent = `${count} film${count > 1 ? 's' : ''}`;
        averageRating.textContent = average ? `${average} / ${ratingScale}` : 'Non note';
    }

    function renderCatalog() {
        const filteredMovies = getFilteredMovies();
        updateCatalogResultsSummary(filteredMovies);
        catalogGrid.textContent = '';
        const fragment = document.createDocumentFragment();

        filteredMovies.forEach((movie) => {
            const article = document.createElement('article');
            article.className = 'movie-card';

            const posterShell = document.createElement('div');
            posterShell.className = 'movie-poster-shell';

            const ratingBadge = document.createElement('span');
            ratingBadge.className = `rating-badge rating-badge-floating ${getRatingBadgeTone(movie.rating, movie.ratingScale)}`;
            ratingBadge.textContent = formatRatingWithScale(movie.rating, movie.ratingScale);

            const poster = document.createElement('img');
            poster.className = 'movie-poster';
            poster.src = sanitizeImageUrl(movie.posterUrl);
            poster.alt = `Affiche de ${movie.title}`;
            poster.loading = 'lazy';
            poster.addEventListener('error', () => {
                poster.src = defaultPoster;
            }, { once: true });

            posterShell.append(ratingBadge, poster);

            const body = document.createElement('div');
            body.className = 'card movie-card-body';

            const title = document.createElement('h4');
            title.textContent = movie.title;

            const meta = document.createElement('div');
            meta.className = 'movie-meta';

            const releaseAndDuration = document.createElement('p');
            releaseAndDuration.textContent = `${movie.releaseDisplay || formatDate(movie.releaseDate)} • ${formatDuration(movie.duration)}`;

            const genre = document.createElement('p');
            genre.textContent = movie.genre || 'Inconnu';

            const director = document.createElement('p');
            if (movie.directorLink) {
                const directorLink = document.createElement('a');
                directorLink.href = buildDirectorSearchUrl(movie.director, movie.directorLink);
                directorLink.target = '_blank';
                directorLink.rel = 'noreferrer noopener';
                directorLink.textContent = movie.director || 'Inconnu';
                director.appendChild(directorLink);
            } else {
                director.textContent = movie.director || 'Inconnu';
            }

            meta.append(releaseAndDuration, genre, director);

            body.append(title, meta);
            article.append(posterShell, body);
            fragment.appendChild(article);
        });

        catalogGrid.appendChild(fragment);

        emptyCatalogMessage.classList.toggle('hidden', filteredMovies.length > 0);
    }

    function renderManageList() {
        if (!movies.length) {
            manageList.innerHTML = '<p class="empty-state">Aucun film importé pour le moment.</p>';
            return;
        }

        manageList.textContent = '';
        const fragment = document.createDocumentFragment();

        movies.forEach((movie) => {
            const article = document.createElement('article');
            article.className = 'manage-item';

            const copy = document.createElement('div');
            copy.className = 'manage-item-copy';

            const title = document.createElement('h4');
            title.textContent = movie.title;

            const details = document.createElement('p');
            details.textContent = `${movie.genre || 'Genre inconnu'} | ${movie.director || 'Réalisateur inconnu'} | ${formatDuration(movie.duration)} | ${formatRatingWithScale(movie.rating, movie.ratingScale)}`;

            copy.append(title, details);
            article.appendChild(copy);
            fragment.appendChild(article);
        });

        manageList.appendChild(fragment);
    }

    function renderAll() {
        renderStats();
        renderCatalogFilters();
        renderCatalog();
        renderManageList();
    }

    function closeDeleteModal() {
        confirmModal.classList.add('hidden');
        confirmModal.setAttribute('aria-hidden', 'true');
    }

    function openLegalNoticeModal() {
        if (!legalNoticeModal) {
            return;
        }

        legalNoticeModal.classList.remove('hidden');
        window.requestAnimationFrame(() => {
            legalNoticeModal.classList.add('modal-visible');
        });
        legalNoticeModal.setAttribute('aria-hidden', 'false');
        closeLegalNoticeButton?.focus();
    }

    function closeLegalNoticeModal() {
        if (!legalNoticeModal) {
            return;
        }

        legalNoticeModal.classList.remove('modal-visible');
        legalNoticeModal.setAttribute('aria-hidden', 'true');

        window.setTimeout(() => {
            if (!legalNoticeModal.classList.contains('modal-visible')) {
                legalNoticeModal.classList.add('hidden');
                openLegalNoticeButton?.focus();
            }
        }, LEGAL_NOTICE_ANIMATION_MS);
    }

    function getSelectedMultiplayerGame() {
        const fallbackGameId = multiplayerGameTiles[0]?.dataset.multiplayerGameSelect || null;
        const activeGameId = MULTIPLAYER_SUPPORTED_GAMES[multiplayerSelectedGameId]
            ? multiplayerSelectedGameId
            : fallbackGameId;
        return MULTIPLAYER_SUPPORTED_GAMES[activeGameId] ? activeGameId : null;
    }

    function getSelectedMultiplayerGameLabel() {
        const gameId = getSelectedMultiplayerGame();
        return gameId ? MULTIPLAYER_SUPPORTED_GAMES[gameId] : 'Aucun';
    }

    function getMultiplayerGameLabel(gameId) {
        return MULTIPLAYER_SUPPORTED_GAMES[gameId] || 'Jeu inconnu';
    }

    function getCurrentMultiplayerPlayer() {
        return multiplayerActiveRoom?.players?.find((player) => player.isYou)
            || multiplayerActiveRoom?.players?.find((player) => player.id === multiplayerSocket?.id)
            || null;
    }

    function isCurrentMultiplayerHost() {
        const currentPlayer = getCurrentMultiplayerPlayer();
        return Boolean(currentPlayer?.isHost || (multiplayerSocket?.id && multiplayerActiveRoom?.hostId === multiplayerSocket.id));
    }

    function getMultiplayerReadySummary() {
        const readyCount = Number(multiplayerActiveRoom?.readyCount || 0);
        const readyTotal = Number(multiplayerActiveRoom?.readyTotal || multiplayerActiveRoom?.playerCount || 0);
        return `${readyCount}/${readyTotal || 0}`;
    }

    function isCurrentPlayerMultiplayerReady() {
        return Boolean(getCurrentMultiplayerPlayer()?.roomReady);
    }

    function isMultiplayerLaunchPending(gameId = multiplayerActiveRoom?.gameId) {
        return multiplayerActiveRoom?.gameId === gameId && !multiplayerActiveRoom?.gameLaunched;
    }

    function syncMultiplayerEntryModeAccess() {
        const currentPlayer = getCurrentMultiplayerPlayer();
        const hasActiveRoom = Boolean(multiplayerActiveRoom?.code && currentPlayer);
        const isHost = isCurrentMultiplayerHost();
        const isGuest = hasActiveRoom && !isHost;

        if (multiplayerCreateModeButton) {
            multiplayerCreateModeButton.disabled = isGuest;
        }

        if (multiplayerJoinModeButton) {
            multiplayerJoinModeButton.disabled = isHost;
        }

        if (hasActiveRoom) {
            multiplayerEntryMode = isHost ? 'create' : 'join';
        }

        if (multiplayerCreateLeaveButton) {
            multiplayerCreateLeaveButton.hidden = !isHost;
        }
    }

    function ensureMultiplayerCreateLeaveButton() {
        if (multiplayerCreateLeaveButton || !multiplayerCopyCodeButton?.parentElement) {
            return;
        }

        multiplayerCreateLeaveButton = document.createElement('button');
        multiplayerCreateLeaveButton.type = 'button';
        multiplayerCreateLeaveButton.id = 'multiplayerCreateLeaveButton';
        multiplayerCreateLeaveButton.className = 'secondary-button multiplayer-button-danger';
        multiplayerCreateLeaveButton.textContent = 'Quitter le salon';
        multiplayerCreateLeaveButton.hidden = true;
        multiplayerCreateLeaveButton.addEventListener('click', () => {
            leaveMultiplayerRoom();
        });
        multiplayerCopyCodeButton.parentElement.appendChild(multiplayerCreateLeaveButton);
    }

    function getPreferredMultiplayerPlayerName(preferredSource = multiplayerEntryMode) {
        const createName = multiplayerCreatePlayerNameInput?.value.trim() || '';
        const joinName = multiplayerJoinPlayerNameInput?.value.trim() || '';

        if (preferredSource === 'join') {
            return joinName || createName;
        }

        return createName || joinName;
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
        if (source === 'create' && multiplayerJoinPlayerNameInput && !multiplayerJoinPlayerNameInput.value.trim()) {
            multiplayerJoinPlayerNameInput.value = multiplayerCreatePlayerNameInput?.value.trim() || '';
        }

        if (source === 'join' && multiplayerCreatePlayerNameInput && !multiplayerCreatePlayerNameInput.value.trim()) {
            multiplayerCreatePlayerNameInput.value = multiplayerJoinPlayerNameInput?.value.trim() || '';
        }
    }

    function setMultiplayerEntryMode(mode) {
        multiplayerEntryMode = mode === 'join' ? 'join' : 'create';
        multiplayerCreateModeButton?.classList.toggle('is-active', multiplayerEntryMode === 'create');
        multiplayerJoinModeButton?.classList.toggle('is-active', multiplayerEntryMode === 'join');
        multiplayerCreatePanel?.classList.toggle('is-active', multiplayerEntryMode === 'create');
        multiplayerJoinPanel?.classList.toggle('is-active', multiplayerEntryMode === 'join');
    }

    function setMultiplayerStatus(message) {
        multiplayerLobbyStatus.textContent = message;
    }

    function renderMultiplayerPlayers() {
        if (!multiplayerActiveRoom?.players?.length) {
            multiplayerRoomPlayers.textContent = "Personne n'a embarqué pour l'instant.";
            return;
        }

        multiplayerRoomPlayers.textContent = '';
        const fragment = document.createDocumentFragment();

        multiplayerActiveRoom.players.forEach((player) => {
            const pill = document.createElement('span');
            pill.className = 'multiplayer-lobby-player-pill';

            if (player.isYou) {
                pill.classList.add('is-you');
            }
            if (player.isHost) {
                pill.classList.add('is-host');
            }

            const suffix = [player.isHost ? 'hôte' : '', player.isYou ? 'toi' : ''].filter(Boolean).join(' - ');
            pill.textContent = `${player.name}${suffix ? ` (${suffix})` : ''}`;
            fragment.appendChild(pill);
        });

        multiplayerRoomPlayers.appendChild(fragment);
    }

    function isMultiplayerChatVisible() {
        return Boolean(
            multiplayerActiveRoom?.code
            && multiplayerActiveRoom?.gameLaunched
            && MULTIPLAYER_SUPPORTED_GAMES[activeGameTab]
            && multiplayerActiveRoom.gameId === activeGameTab
        );
    }

    function formatMultiplayerChatTime(timestamp) {
        if (!timestamp) {
            return '';
        }

        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(timestamp));
    }

    function renderMultiplayerChatMessages() {
        if (!multiplayerChatMessages) {
            return;
        }

        const messages = Array.isArray(multiplayerActiveRoom?.chatMessages) ? multiplayerActiveRoom.chatMessages : [];
        multiplayerChatMessages.textContent = '';

        if (!messages.length) {
            const emptyState = document.createElement('p');
            emptyState.className = 'multiplayer-chat-empty';
            emptyState.textContent = 'La partie est lanc\u00e9e. \u00c9cris le premier message \u00e0 ton \u00e9quipage.';
            multiplayerChatMessages.appendChild(emptyState);
            multiplayerChatSignature = '';
            return;
        }

        const fragment = document.createDocumentFragment();
        messages.forEach((message) => {
            const item = document.createElement('article');
            item.className = 'multiplayer-chat-message';
            if (message.isYou) {
                item.classList.add('is-you');
            }

            const meta = document.createElement('div');
            meta.className = 'multiplayer-chat-message-meta';

            const author = document.createElement('strong');
            author.className = 'multiplayer-chat-message-author';
            author.textContent = message.playerName || 'Equipage';

            const time = document.createElement('span');
            time.textContent = formatMultiplayerChatTime(message.createdAt);

            const text = document.createElement('p');
            text.className = 'multiplayer-chat-message-text';
            text.textContent = message.text || '';

            meta.append(author, time);
            item.append(meta, text);
            fragment.appendChild(item);
        });

        multiplayerChatMessages.appendChild(fragment);
        const nextSignature = messages.map((message) => message.id).join('|');
        multiplayerChatMessages.scrollTop = multiplayerChatMessages.scrollHeight;
        multiplayerChatSignature = nextSignature;
    }

    function updateMultiplayerChatPanel() {
        if (!multiplayerChatCard || !multiplayerChatInput || !multiplayerChatSendButton) {
            return;
        }

        const chatVisible = isMultiplayerChatVisible();
        multiplayerChatCard.classList.toggle('hidden', !chatVisible);
        multiplayerChatCard.classList.toggle('is-visible', chatVisible);

        const canSend = Boolean(chatVisible && multiplayerSocket?.connected);
        multiplayerChatInput.disabled = !canSend;
        multiplayerChatSendButton.disabled = !canSend;

        if (multiplayerChatSubtitle) {
            multiplayerChatSubtitle.textContent = chatVisible
                ? `Salon ${multiplayerActiveRoom.code} sur ${getMultiplayerGameLabel(multiplayerActiveRoom.gameId)}.`
                : "Le chat apparaît quand l'hôte lance la partie en ligne.";
        }

        if (!chatVisible) {
            multiplayerChatMessages.textContent = '';
            const emptyState = document.createElement('p');
            emptyState.className = 'multiplayer-chat-empty';
            emptyState.textContent = multiplayerActiveRoom?.code
                ? 'Le salon attend encore le lancement de la partie.'
                : 'Rejoins un salon multijoueur pour ouvrir le chat de bord.';
            multiplayerChatMessages.appendChild(emptyState);
            multiplayerChatSignature = '';
            multiplayerChatInput.value = '';
            return;
        }

        renderMultiplayerChatMessages();
    }

    async function sendMultiplayerChatMessage() {
        const message = multiplayerChatInput?.value.trim() || '';
        if (!message) {
            return;
        }

        if (!isMultiplayerChatVisible()) {
            setMultiplayerStatus('Le chat sera disponible une fois la partie lanc\u00e9e.');
            return;
        }

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
        multiplayerGameTiles.forEach((tile) => {
            tile.classList.toggle('is-selected', tile.dataset.multiplayerGameSelect === getSelectedMultiplayerGame());
        });
    }

    function syncGameMenuOverlayBounds(overlayElement, hostElement) {
        if (!overlayElement || !hostElement) {
            return;
        }

        const cardElement = hostElement.closest('.games-panel');
        if (!cardElement) {
            return;
        }

        overlayElement.style.inset = 'auto';
        overlayElement.style.top = `${-hostElement.offsetTop}px`;
        overlayElement.style.left = `${-hostElement.offsetLeft}px`;
        overlayElement.style.width = `${cardElement.clientWidth}px`;
        overlayElement.style.height = `${cardElement.clientHeight}px`;
    }

    function syncAllGameMenuOverlayBounds() {
        syncGameMenuOverlayBounds(minesweeperMenuOverlay, minesweeperTable);
        syncGameMenuOverlayBounds(snakeMenuOverlay, snakeTable);
        syncGameMenuOverlayBounds(pongMenuOverlay, pongTable);
        syncGameMenuOverlayBounds(sudokuMenuOverlay, sudokuTable);
        syncGameMenuOverlayBounds(game2048MenuOverlay, game2048Table);
        syncGameMenuOverlayBounds(memoryMenuOverlay, memoryTable);
        syncGameMenuOverlayBounds(ticTacToeMenuOverlay, ticTacToeTable);
        syncGameMenuOverlayBounds(connect4MenuOverlay, connect4Table);
        syncGameMenuOverlayBounds(flappyMenuOverlay, flappyTable);
        syncGameMenuOverlayBounds(mentalMathMenuOverlay, mentalMathTable);
        syncGameMenuOverlayBounds(chessMenuOverlay, chessTable);
        syncGameMenuOverlayBounds(checkersMenuOverlay, checkersTable);
        syncGameMenuOverlayBounds(airHockeyMenuOverlay, airHockeyBoard);
        syncGameMenuOverlayBounds(reactionMenuOverlay, reactionTable);
        syncGameMenuOverlayBounds(baieBerryMenuOverlay, baieBerryGame);
        syncGameMenuOverlayBounds(breakoutMenuOverlay, breakoutTable);
        syncGameMenuOverlayBounds(unoMenuOverlay, unoTable);
        syncGameMenuOverlayBounds(stackerMenuOverlay, stackerTable);
        syncGameMenuOverlayBounds(pacmanMenuOverlay, pacmanTable);
        syncGameMenuOverlayBounds(tetrisMenuOverlay, tetrisTable);
        syncGameMenuOverlayBounds(battleshipMenuOverlay, battleshipTable);
        syncGameMenuOverlayBounds(harborRunMenuOverlay, harborRunTable);
        syncGameMenuOverlayBounds(coinClickerMenuOverlay, coinClickerTable);
        syncGameMenuOverlayBounds(candyCrushMenuOverlay, candyCrushTable);
        syncGameMenuOverlayBounds(flowFreeMenuOverlay, flowFreeTable);
        syncGameMenuOverlayBounds(magicSortMenuOverlay, magicSortTable);
        syncGameMenuOverlayBounds(blockBlastMenuOverlay, blockBlastTable);
        syncGameMenuOverlayBounds(aimMenuOverlay, aimTable);
        syncGameMenuOverlayBounds(rhythmMenuOverlay, rhythmTable);
        syncGameMenuOverlayBounds(solitaireMenuOverlay, solitaireTable);
        syncGameMenuOverlayBounds(bombMenuOverlay, bombTable);
    }

    function getBoardMoveAnimationMetadata(lastMove, row, col, flip = false) {
        if (!lastMove || lastMove.toRow !== row || lastMove.toCol !== col) {
            return { className: '', style: '' };
        }

        const direction = flip ? -1 : 1;
        const moveX = (Number(lastMove.fromCol) - Number(lastMove.toCol)) * direction;
        const moveY = (Number(lastMove.fromRow) - Number(lastMove.toRow)) * direction;
        const isKnightMove = lastMove.pieceType === 'knight' && Math.abs(moveX) + Math.abs(moveY) === 3 && Math.abs(moveX) > 0 && Math.abs(moveY) > 0;
        const className = [
            'is-moving',
            lastMove.capture ? 'is-capture-move' : '',
            isKnightMove ? 'is-knight-move' : ''
        ].filter(Boolean).join(' ');
        const midX = Math.abs(moveX) === 2 ? 0 : moveX;
        const midY = Math.abs(moveY) === 2 ? 0 : moveY;
        const style = `style="--move-x:${moveX}; --move-y:${moveY}; --move-mid-x:${midX}; --move-mid-y:${midY};"`;
        return { className, style };
    }

    function getBoardMoveAnimationKey(lastMove) {
        if (!lastMove) {
            return '';
        }

        return [
            lastMove.pieceType,
            lastMove.fromRow,
            lastMove.fromCol,
            lastMove.toRow,
            lastMove.toCol,
            lastMove.capture?.row ?? '-',
            lastMove.capture?.col ?? '-',
            lastMove.captureColor ?? '-'
        ].join(':');
    }

    function isBoardCaptureCell(lastMove, row, col) {
        if (!lastMove?.capture) {
            return false;
        }

        return lastMove.capture.row === row && lastMove.capture.col === col;
    }

    function scheduleChessMoveAnimationClear() {
        if (chessLastMoveResetTimer) {
            window.clearTimeout(chessLastMoveResetTimer);
        }

        if (!chessState?.lastMove) {
            return;
        }

        chessLastMoveResetTimer = window.setTimeout(() => {
            chessLastMoveResetTimer = null;
            if (!chessState?.lastMove) {
                return;
            }
            chessState.lastMove = null;
            renderChess();
        }, 360);
    }

    function scheduleCheckersMoveAnimationClear() {
        if (checkersLastMoveResetTimer) {
            window.clearTimeout(checkersLastMoveResetTimer);
        }

        if (!checkersState?.lastMove) {
            return;
        }

        checkersLastMoveResetTimer = window.setTimeout(() => {
            checkersLastMoveResetTimer = null;
            if (!checkersState?.lastMove) {
                return;
            }
            checkersState.lastMove = null;
            renderCheckers();
        }, 360);
    }

    function spawnBoardCaptureParticles(boardElement, row, col, tone = 'light', positionMapper = null) {
        if (!boardElement) {
            return;
        }

        const fragment = document.createDocumentFragment();
        const particleCount = 9;
        const displayPosition = positionMapper ? positionMapper(Number(row), Number(col)) : { row: Number(row), col: Number(col) };
        const originX = `${((displayPosition.col + 0.5) / CHESS_SIZE) * 100}%`;
        const originY = `${((displayPosition.row + 0.5) / CHESS_SIZE) * 100}%`;
        for (let index = 0; index < particleCount; index += 1) {
            const particle = document.createElement('span');
            particle.className = `board-capture-particle is-${tone}`;
            const angle = (Math.PI * 2 * index) / particleCount;
            const distance = 12 + Math.random() * 20;
            particle.style.setProperty('--particle-origin-x', originX);
            particle.style.setProperty('--particle-origin-y', originY);
            particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance}px`);
            particle.style.setProperty('--particle-delay', `${Math.random() * 70}ms`);
            particle.style.setProperty('--particle-size', `${4 + Math.random() * 5}px`);
            fragment.appendChild(particle);
        }

        boardElement.appendChild(fragment);
        window.setTimeout(() => {
            boardElement.querySelectorAll('.board-capture-particle').forEach((particle) => particle.remove());
        }, 520);
    }

    function maybePlayChessCaptureFx() {
        const move = chessState?.lastMove;
        if (!move?.capture) {
            chessLastCaptureFxKey = '';
            return;
        }

        const fxKey = `${move.fromRow}:${move.fromCol}:${move.toRow}:${move.toCol}:${move.capture.row}:${move.capture.col}:${move.captureColor || 'none'}`;
        if (fxKey === chessLastCaptureFxKey) {
            return;
        }

        chessLastCaptureFxKey = fxKey;
        window.requestAnimationFrame(() => {
            spawnBoardCaptureParticles(
                chessBoard,
                move.capture.row,
                move.capture.col,
                move.captureColor === 'black' ? 'dark' : 'light',
                getDisplayChessPosition
            );
        });
    }

    function maybePlayCheckersCaptureFx() {
        const move = checkersState?.lastMove;
        if (!move?.capture) {
            checkersLastCaptureFxKey = '';
            return;
        }

        const fxKey = `${move.fromRow}:${move.fromCol}:${move.toRow}:${move.toCol}:${move.capture.row}:${move.capture.col}:${move.captureColor || 'none'}`;
        if (fxKey === checkersLastCaptureFxKey) {
            return;
        }

        checkersLastCaptureFxKey = fxKey;
        window.requestAnimationFrame(() => {
            spawnBoardCaptureParticles(checkersBoard, move.capture.row, move.capture.col, move.captureColor === 'black' ? 'dark' : 'red');
        });
    }

    function getChessAttackMoves(state, row, col) {
        const piece = state?.board?.[row]?.[col];
        if (!piece) {
            return [];
        }

        const moves = [];
        const addMove = (nextRow, nextCol) => {
            if (!isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
                return;
            }
            const target = state.board[nextRow][nextCol];
            if (!target || target.color !== piece.color) {
                moves.push({ row: nextRow, col: nextCol });
            }
        };
        const addSlideMoves = (directions) => {
            directions.forEach(([rowStep, colStep]) => {
                let nextRow = row + rowStep;
                let nextCol = col + colStep;

                while (isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
                    const target = state.board[nextRow][nextCol];
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
            [-1, 1].forEach((deltaCol) => {
                const attackRow = row + direction;
                const attackCol = col + deltaCol;
                if (isInsideGameGrid(attackRow, attackCol, CHESS_SIZE)) {
                    moves.push({ row: attackRow, col: attackCol });
                }
            });
            return moves;
        }

        if (piece.type === 'rook') {
            addSlideMoves([[1, 0], [-1, 0], [0, 1], [0, -1]]);
            return moves;
        }

        if (piece.type === 'bishop') {
            addSlideMoves([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
            return moves;
        }

        if (piece.type === 'queen') {
            addSlideMoves([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
            return moves;
        }

        if (piece.type === 'knight') {
            [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([rowStep, colStep]) => addMove(row + rowStep, col + colStep));
            return moves;
        }

        if (piece.type === 'king') {
            [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([rowStep, colStep]) => addMove(row + rowStep, col + colStep));
        }

        return moves;
    }

    function getChessKingPosition(color) {
        return getChessKingPositionForState(chessState, color);
    }

    function isChessKingInCheck(color) {
        return isChessKingInCheckForState(chessState, color);
    }

    function maybeOpenChessOutcomeModal() {
        if (!chessState?.winner) {
            chessLastFinishedStateKey = '';
            return;
        }

        const move = chessState.lastMove;
        const finishedKey = `solo:${chessState.winner}:${move?.fromRow ?? '-'}:${move?.fromCol ?? '-'}:${move?.toRow ?? '-'}:${move?.toCol ?? '-'}`;
        if (finishedKey === chessLastFinishedStateKey) {
            return;
        }

        chessLastFinishedStateKey = finishedKey;
        revealChessOutcomeMenuWithDelay();
    }

    function maybeOpenCheckersOutcomeModal() {
        if (!checkersState?.winner) {
            checkersLastFinishedStateKey = '';
            return;
        }

        const move = checkersState.lastMove;
        const finishedKey = `solo:${checkersState.winner}:${move?.fromRow ?? '-'}:${move?.fromCol ?? '-'}:${move?.toRow ?? '-'}:${move?.toCol ?? '-'}`;
        if (finishedKey === checkersLastFinishedStateKey) {
            return;
        }

        checkersLastFinishedStateKey = finishedKey;
        revealCheckersOutcomeMenu();
    }

    function updateMultiplayerLobby(preserveStatus = false) {
        ensureMultiplayerCreateLeaveButton();
        syncMultiplayerEntryModeAccess();
        if (multiplayerCreateLeaveButton) {
            multiplayerCreateLeaveButton.disabled = multiplayerBusy;
        }
        const selectedGame = getSelectedMultiplayerGame();
        const selectedLabel = getSelectedMultiplayerGameLabel();
        const canUseMultiplayer = Boolean(selectedGame);
        const activeRoomGameLabel = multiplayerActiveRoom?.gameId && MULTIPLAYER_SUPPORTED_GAMES[multiplayerActiveRoom.gameId]
            ? MULTIPLAYER_SUPPORTED_GAMES[multiplayerActiveRoom.gameId]
            : selectedLabel;
        const currentPlayer = multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
        const hasActiveRoom = Boolean(multiplayerActiveRoom?.code);
        const isHost = isCurrentMultiplayerHost();
        multiplayerCurrentRoomCode.textContent = multiplayerActiveRoom?.code || '-';
        multiplayerLobbyPlayersBlock?.classList.toggle('hidden', !hasActiveRoom);
        multiplayerCreatePlayerField?.classList.toggle('hidden', hasActiveRoom);
        multiplayerJoinPlayerField?.classList.toggle('hidden', hasActiveRoom);
        multiplayerJoinCodeField?.classList.toggle('hidden', hasActiveRoom);
        multiplayerCreateRoomButton.disabled = multiplayerBusy || (!hasActiveRoom && !canUseMultiplayer) || (hasActiveRoom && (!isHost || (multiplayerActiveRoom?.playerCount || 0) < 2 || Boolean(multiplayerActiveRoom?.gameLaunched)));
        multiplayerJoinRoomButton.disabled = multiplayerBusy;
        multiplayerCreateRoomButton.textContent = hasActiveRoom
            ? 'Lancer le jeu'
            : 'Creer le salon';
        multiplayerJoinRoomButton.textContent = hasActiveRoom
            ? 'Quitter le salon'
            : 'Rejoindre avec le code';
        multiplayerJoinRoomButton.classList.toggle('multiplayer-button-success', !hasActiveRoom);
        multiplayerJoinRoomButton.classList.toggle('multiplayer-button-danger', hasActiveRoom);
        multiplayerCopyCodeButton.disabled = !hasActiveRoom;
        updateMultiplayerGameTileSelection();
        renderMultiplayerPlayers();
        updateMultiplayerChatPanel();

        if (preserveStatus) {
            return;
        }

        if (hasActiveRoom) {
            if (multiplayerActiveRoom.playerCount < 2) {
                setMultiplayerStatus(`Salon ${multiplayerActiveRoom.code} cree. Attends un autre joueur avant de lancer ${activeRoomGameLabel}.`);
                return;
            }

            if (!multiplayerActiveRoom.gameLaunched) {
                setMultiplayerStatus(isHost
                    ? `Salon ${multiplayerActiveRoom.code} prêt. Tu peux lancer ${activeRoomGameLabel} quand tout le monde est là.`
                    : `Salon ${multiplayerActiveRoom.code} prêt. Attends que l'hôte lance ${activeRoomGameLabel}.`);
                return;
            }

            setMultiplayerStatus(`${activeRoomGameLabel} est en cours dans le salon ${multiplayerActiveRoom.code}.`);
            return;
        }

        if (!canUseMultiplayer) {
            setMultiplayerStatus('Le multijoueur est pr\u00e9vu pour Bataille, Sea Hockey, Pong, Morpion, Coin 4, \u00c9checs, Dames, Buno et La Bombe.');
            return;
        }

        setMultiplayerStatus('Cree un salon prive ou rejoins-en un avec un code.');
    }

    function loadSocketIoClient() {
        if (window.io) {
            return Promise.resolve(window.io);
        }

        if (!/^https?:$/i.test(window.location.protocol)) {
            return Promise.reject(new Error('Le client Socket.IO demande le site via http:// ou https://.'));
        }

        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[data-socket-io-client="true"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(window.io), { once: true });
                existingScript.addEventListener('error', () => reject(new Error('Impossible de charger Socket.IO.')), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = `${getMultiplayerServerOrigin()}/socket.io/socket.io.js`;
            script.async = true;
            script.dataset.socketIoClient = 'true';
            script.addEventListener('load', () => resolve(window.io), { once: true });
            script.addEventListener('error', () => reject(new Error('Impossible de charger Socket.IO.')), { once: true });
            document.head.appendChild(script);
        });
    }

    function getMultiplayerServerOrigin() {
        return MULTIPLAYER_SERVER_URL || window.location.origin;
    }

    function getMultiplayerApiUrl(path) {
        return `${getMultiplayerServerOrigin()}${path}`;
    }

    async function ensureMultiplayerConnection() {
        if (multiplayerSocket?.connected) {
            return multiplayerSocket;
        }

        const ioFactory = await loadSocketIoClient();

        if (!multiplayerSocket) {
            multiplayerSocket = ioFactory(getMultiplayerServerOrigin(), {
                transports: ['websocket', 'polling']
            });

            multiplayerSocket.on('connect', () => {
                setMultiplayerStatus('Connexion multijoueur etablie.');
            });

            multiplayerSocket.on('room:joined', (room) => {
                multiplayerActiveRoom = room;
                if (MULTIPLAYER_SUPPORTED_GAMES[room.gameId]) {
                    multiplayerSelectedGameId = room.gameId;
                }
                multiplayerEntryMode = isCurrentMultiplayerHost() ? 'create' : 'join';
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
                airHockeyLastFinishedStateKey = '';
                airHockeyMultiplayerInput = { x: 0, y: 0 };
                airHockeyDisplayState = null;
                airHockeyLocalPredicted = null;
                airHockeyCountdownEndsAt = 0;
                pongLastFinishedStateKey = '';
                pongMultiplayerInputDirection = 0;
                pongDisplayState = null;
                pongLocalPredictedPaddleY = null;
                pongCountdownEndsAt = 0;
                connect4LastFinishedStateKey = '';
                ticTacToeLastFinishedStateKey = '';
                battleshipLastFinishedStateKey = '';
                chessLastFinishedStateKey = '';
                checkersLastFinishedStateKey = '';
                unoLastWinnerKey = '';
                bombLastFinishedStateKey = '';
                bombState = null;
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
                if (gameId === 'uno') {
                    unoMenuVisible = true;
                    unoMenuShowingRules = false;
                    unoMenuClosing = false;
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
        if (!multiplayerActiveRoom?.code) {
            return;
        }

        try {
            const socket = await ensureMultiplayerConnection();
            socket.emit('room:leave');
        } catch (error) {
            setMultiplayerStatus(`${error.message} Verifie que le serveur multijoueur est en ligne puis recharge la page.`);
        }
    }

    async function copyMultiplayerRoomCode() {
        if (!multiplayerActiveRoom?.code) {
            setMultiplayerStatus('Aucune room active a copier pour le moment.');
            return;
        }

        try {
            await navigator.clipboard.writeText(multiplayerActiveRoom.code);
            setMultiplayerStatus(`Code ${multiplayerActiveRoom.code} copie dans le presse-papiers.`);
        } catch (_error) {
            setMultiplayerStatus(`Code actif: ${multiplayerActiveRoom.code}`);
        }
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
        activeGameTab = tabId;
        const isDiscoveryPanel = ['home', 'solo', 'multiplayer'].includes(tabId);
        const visibleSection = ['home', 'solo', 'multiplayer'].includes(tabId) ? tabId : activeGamesSection;
        gamesSectionButtons.forEach((button) => {
            button.classList.toggle('is-active', visibleSection === button.dataset.gamesSection);
        });
        gamesLayout?.classList.toggle('games-layout-focus', !isDiscoveryPanel);
        gamesFiltersCard?.classList.toggle('hidden', !isDiscoveryPanel);
        gamesHomePanel.classList.toggle('games-panel-active', tabId === 'home');
        gamesSoloPanel.classList.toggle('games-panel-active', tabId === 'solo');
        gamesMultiplayerPanel.classList.toggle('games-panel-active', tabId === 'multiplayer');
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
        blockBlastGame.classList.toggle('games-panel-active', tabId === 'blockBlast');
        unoGame.classList.toggle('games-panel-active', tabId === 'uno');
        bombGame.classList.toggle('games-panel-active', tabId === 'bomb');
        updateMultiplayerChatPanel();

        if (tabId !== 'snake') {
            closeGameOverModal();
        }

        updateMultiplayerLobby();
        updateGamesFilters();
    }

    function getCurrentGamesGrid() {
        if (activeGameTab === 'solo') {
            return gamesSoloPanel?.querySelector('.games-home-grid') || null;
        }

        if (activeGameTab === 'multiplayer') {
            return gamesMultiplayerPanel?.querySelector('.games-home-grid') || null;
        }

        return gamesHomePanel?.querySelector('.games-home-grid') || null;
    }

    function updateGamesFilters() {
        const currentGrid = getCurrentGamesGrid();
        const currentTiles = currentGrid ? Array.from(currentGrid.querySelectorAll('[data-open-game]')) : [];
        const query = (gamesFilterSearchInput?.value || '').trim().toLowerCase();
        let visibleCount = 0;

        gameHomeTiles.forEach((tile) => {
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

        if (gamesFilterCount) {
            const label = currentTiles.length > 1 ? 'jeux visibles' : 'jeu visible';
            gamesFilterCount.textContent = `${visibleCount} ${label}`;
        }

        if (gamesFilterHint) {
            gamesFilterHint.textContent = visibleCount
                ? ''
                : 'Aucun jeu ne correspond a cette recherche. Essaie un autre mot ou un autre filtre.';
        }
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

    function showGamesHome() {
        showGamesSection('home');
    }

    function showGamesSection(section) {
        activeGamesSection = section;
        cleanupActiveGameForNavigation(section);
        showGamePanel(section);
    }

    function cleanupActiveGameForNavigation(nextTab) {
        const previousTab = activeGameTab;

        if (previousTab === 'minesweeper' && nextTab !== 'minesweeper') {
            minesweeperMenuVisible = true;
            initializeGame();
        }

        if (previousTab === 'snake' && nextTab !== 'snake') {
            snakeMenuVisible = true;
            stopSnake();
            initializeSnake();
        }

        if (previousTab === 'pong' && nextTab !== 'pong') {
            stopPong();
            initializePong();
        }

        if (previousTab === 'sudoku' && nextTab !== 'sudoku') {
            sudokuMenuVisible = true;
            initializeSudoku(false);
        }

        if (previousTab === '2048' && nextTab !== '2048') {
            initialize2048();
        }

        if (previousTab === 'aim' && nextTab !== 'aim') {
            aimMenuVisible = true;
            initializeAim();
        }

        if (previousTab === 'memory' && nextTab !== 'memory') {
            initializeMemory();
        }

        if (previousTab === 'ticTacToe' && nextTab !== 'ticTacToe') {
            initializeTicTacToe();
        }

        if (previousTab === 'battleship' && nextTab !== 'battleship') {
            battleshipMenuVisible = true;
            initializeBattleship();
        }

        if (previousTab === 'tetris' && nextTab !== 'tetris') {
            tetrisMenuVisible = true;
            initializeTetris();
        }

        if (previousTab === 'pacman' && nextTab !== 'pacman') {
            pacmanMenuVisible = true;
            initializePacman();
        }

        if (previousTab === 'solitaire' && nextTab !== 'solitaire') {
            solitaireMenuVisible = true;
            initializeSolitaire();
        }

        if (previousTab === 'connect4' && nextTab !== 'connect4') {
            initializeConnect4();
        }

        if (previousTab === 'rhythm' && nextTab !== 'rhythm') {
            rhythmMenuVisible = true;
            initializeRhythm();
        }

        if (previousTab === 'flappy' && nextTab !== 'flappy') {
            initializeFlappy();
        }

        if (previousTab === 'flowFree' && nextTab !== 'flowFree') {
            flowFreeMenuVisible = true;
            initializeFlowFree();
        }

        if (previousTab === 'magicSort' && nextTab !== 'magicSort') {
            magicSortMenuVisible = true;
            initializeMagicSort();
        }

        if (previousTab === 'mentalMath' && nextTab !== 'mentalMath') {
            initializeMentalMath();
        }

        if (previousTab === 'candyCrush' && nextTab !== 'candyCrush') {
            candyCrushMenuVisible = true;
            initializeCandyCrush();
        }

        if (previousTab === 'harborRun' && nextTab !== 'harborRun') {
            harborRunMenuVisible = true;
            initializeHarborRun();
        }

        if (previousTab === 'stacker' && nextTab !== 'stacker') {
            stackerMenuVisible = true;
            initializeStacker();
        }

        if (previousTab === 'coinClicker' && nextTab !== 'coinClicker') {
            saveCoinClickerState();
            coinClickerMenuVisible = true;
        }

        if (previousTab === 'chess' && nextTab !== 'chess') {
            initializeChess();
        }

        if (previousTab === 'checkers' && nextTab !== 'checkers') {
            initializeCheckers();
        }

        if (previousTab === 'airHockey' && nextTab !== 'airHockey') {
            airHockeyMenuVisible = true;
            if (isMultiplayerAirHockeyActive()) {
                stopAirHockeyRuntime();
            } else {
                initializeAirHockey();
            }
        }

        if (previousTab === 'reaction' && nextTab !== 'reaction') {
            reactionMenuVisible = true;
            initializeReaction();
        }

        if (previousTab === 'baieBerry' && nextTab !== 'baieBerry') {
            stopBaieBerry();
            initializeBaieBerry();
        }

        if (previousTab === 'breakout' && nextTab !== 'breakout') {
            stopBreakout();
            initializeBreakout();
        }

        if (previousTab === 'uno' && nextTab !== 'uno') {
            initializeUno();
        }

        if (previousTab === 'bomb' && nextTab !== 'bomb') {
            stopBombTimerLoop();
            bombLocalState = null;
            bombMenuVisible = true;
            initializeBomb();
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
        if (memoryHelpText && !memoryMenuResult) {
            memoryHelpText.textContent = 'Retourne les cartes du pont et retrouve toutes les paires marines.';
        }
    }

    function getMemoryRulesText() {
        return "Retourne deux cartes à la fois pour retrouver chaque paire. Quand les deux symboles correspondent, ils restent visibles jusqu'à vider tout le pont.";
    }

    function renderMemoryMenu() {
        if (!memoryMenuOverlay || !memoryTable) {
            return;
        }

        syncGameMenuOverlayBounds(memoryMenuOverlay, memoryTable);
        memoryMenuOverlay.classList.toggle('hidden', !memoryMenuVisible);
        memoryMenuOverlay.classList.toggle('is-closing', memoryMenuClosing);
        memoryMenuOverlay.classList.toggle('is-entering', memoryMenuEntering);
        memoryTable.classList.toggle('is-menu-open', memoryMenuVisible);

        if (!memoryMenuVisible) {
            return;
        }

        const hasResult = memoryMenuResult;
        if (memoryMenuEyebrow) {
            memoryMenuEyebrow.textContent = memoryMenuShowingRules ? 'R\u00e8gles' : (hasResult ? 'Fin de r\u00e9colte' : 'Pont des souvenirs');
        }
        if (memoryMenuTitle) {
            memoryMenuTitle.textContent = memoryMenuShowingRules ? 'Rappel rapide' : (hasResult ? 'Memory termin\u00e9' : 'Memory');
        }
        if (memoryMenuText) {
            memoryMenuText.textContent = memoryMenuShowingRules
                ? getMemoryRulesText()
                : (hasResult
                    ? `Toutes les paires ont \u00e9t\u00e9 retrouv\u00e9es en ${memoryMoves} coups.`
                    : 'Retourne les cartes du pont et retrouve toutes les paires marines.');
        }
        if (memoryMenuActionButton) {
            memoryMenuActionButton.textContent = memoryMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
        }
        if (memoryMenuRulesButton) {
            memoryMenuRulesButton.textContent = 'R\u00e8gles';
            memoryMenuRulesButton.hidden = memoryMenuShowingRules;
        }
    }

    function startMemoryLaunchSequence() {
        memoryMenuClosing = true;
        renderMemoryMenu();
        window.setTimeout(() => {
            memoryMenuClosing = false;
            memoryMenuVisible = false;
            memoryMenuShowingRules = false;
            memoryMenuEntering = false;
            memoryMenuResult = false;
            renderMemoryMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealMemoryOutcomeMenu() {
        memoryMenuVisible = true;
        memoryMenuResult = true;
        memoryMenuShowingRules = false;
        memoryMenuClosing = false;
        memoryMenuEntering = true;
        if (memoryHelpText) {
            memoryHelpText.textContent = `Toutes les paires ont \u00e9t\u00e9 retrouv\u00e9es en ${memoryMoves} coups.`;
        }
        renderMemoryMenu();
        window.setTimeout(() => {
            memoryMenuEntering = false;
            renderMemoryMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function renderMemoryBoard() {
        memoryBoard.innerHTML = memoryCards.map((card, index) => {
            const isRevealed = card.isMatched || card.isFlipped;

            return `
                <button
                    type="button"
                    class="memory-card-tile${isRevealed ? ' is-revealed' : ''}${card.isMatched ? ' is-matched' : ''}${card.isRevealing ? ' is-revealing' : ''}${card.isReturning ? ' is-returning' : ''}"
                    data-index="${index}"
                    aria-label="${isRevealed ? `Carte ${card.icon}` : 'Carte retourn\u00e9e'}"
                >
                    <div class="memory-card-inner" aria-hidden="true">
                        <div class="memory-card-face memory-card-front">${card.icon}</div>
                        <div class="memory-card-face memory-card-back"><span class="card-back-emblem"></span></div>
                    </div>
                </button>
            `;
        }).join('');
        renderMemoryMenu();
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
        memoryMenuVisible = true;
        memoryMenuShowingRules = false;
        memoryMenuClosing = false;
        memoryMenuEntering = false;
        memoryMenuResult = false;
        updateMemoryHud();
        renderMemoryBoard();
    }

    function finishMemory() {
        revealMemoryOutcomeMenu();
    }

    function handleMemoryCardFlip(index) {
        if (memoryLockBoard || memoryMenuVisible || memoryMenuClosing) {
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
            ? 'Mode 2 joueurs : jouez chacun votre tour sur la même grille.'
            : "Mode 1 joueur: aligne trois symboles contre l'IA pirate.";
        ticTacToeModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.tictactoeMode === ticTacToeMode);
        });
    }

    function renderTicTacToeBoard() {
        const winningLine = getTicTacToeWinner() || [];
        ticTacToeBoard.innerHTML = ticTacToeBoardState.map((cell, index) => {
            const isNewMove = Boolean(cell) && ticTacToeRenderedBoardState[index] !== cell;
            const isWinningCell = winningLine.includes(index);
            return `
            <button
                type="button"
                class="tictactoe-cell${cell ? ` is-${cell}` : ''}${isNewMove ? ' is-new-move' : ''}${isWinningCell ? ' is-winning-cell' : ''}"
                data-index="${index}"
                aria-label="${cell ? (cell === 'anchor' ? 'Case ancre' : 'Case pirate') : 'Case vide'}"
            >
                <span aria-hidden="true">${cell === 'anchor' ? '\u2693' : cell === 'skull' ? '\u2620' : ''}</span>
            </button>
        `;
        }).join('');
        ticTacToeRenderedBoardState = [...ticTacToeBoardState];
    }

    function getTicTacToeRulesText() {
        return "Placez chacun votre symbole à tour de rôle. Le premier à aligner trois cases gagne la manche. En solo, tu affrontes l'IA pirate.";
    }

    function renderTicTacToeMenu() {
        if (!ticTacToeMenuOverlay || !ticTacToeTable) {
            return;
        }

        syncGameMenuOverlayBounds(ticTacToeMenuOverlay, ticTacToeTable);
        ticTacToeMenuOverlay.classList.toggle('hidden', !ticTacToeMenuVisible);
        ticTacToeMenuOverlay.classList.toggle('is-closing', ticTacToeMenuClosing);
        ticTacToeMenuOverlay.classList.toggle('is-entering', ticTacToeMenuEntering);
        ticTacToeTable.classList.toggle('is-menu-open', ticTacToeMenuVisible);

        if (!ticTacToeMenuVisible) {
            return;
        }

        const isOutcome = Boolean(ticTacToeMenuResult);

        if (ticTacToeMenuEyebrow) {
            ticTacToeMenuEyebrow.textContent = ticTacToeMenuShowingRules
                ? 'R\u00e8gles'
                : (isOutcome ? 'Fin de manche' : 'Baie strat\u00e9gique');
        }

        if (ticTacToeMenuTitle) {
            ticTacToeMenuTitle.textContent = ticTacToeMenuShowingRules
                ? 'Rappel rapide'
                : (ticTacToeMenuResult === 'win'
                    ? 'Victoire'
                    : (ticTacToeMenuResult === 'loss'
                        ? 'D\u00e9faite'
                        : (ticTacToeMenuResult === 'draw' ? 'Match nul' : 'Morpion')));
        }

        if (ticTacToeMenuText) {
            ticTacToeMenuText.textContent = ticTacToeMenuShowingRules
                ? getTicTacToeRulesText()
                : (ticTacToeMenuResult === 'win'
                    ? (ticTacToeMode === 'duo' ? 'Le joueur 1 prend le pont. Relancez une nouvelle manche.' : 'Ton \u00e9quipage tient le pont. Relance une nouvelle manche.')
                    : (ticTacToeMenuResult === 'loss'
                        ? (ticTacToeMode === 'duo' ? 'Le joueur 2 prend le pont. Relancez une nouvelle manche.' : "L'IA pirate prend le pont. Relance une nouvelle manche.")
                        : (ticTacToeMenuResult === 'draw'
                            ? "Personne ne prend l'avantage. Relance une nouvelle manche."
                            : ((isMultiplayerTicTacToeActive() && !multiplayerActiveRoom?.gameLaunched)
                                ? 'Quand tous les joueurs sont pr\u00eats, la manche de morpion commence automatiquement.'
                                : "Aligne trois symboles avant l'\u00e9quipage adverse pour prendre le pont."))));
        }

        if (ticTacToeMenuActionButton) {
            ticTacToeMenuActionButton.textContent = ticTacToeMenuShowingRules
                ? 'Retour'
                : ((isMultiplayerTicTacToeActive() && !multiplayerActiveRoom?.gameLaunched)
                    ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                    : (isOutcome ? 'Relancer la partie' : 'Lancer la partie'));
        }

        if (ticTacToeMenuRulesButton) {
            ticTacToeMenuRulesButton.textContent = 'R\u00e8gles';
            ticTacToeMenuRulesButton.hidden = ticTacToeMenuShowingRules;
        }
    }

    function closeTicTacToeMenu() {
        ticTacToeMenuClosing = true;
        ticTacToeMenuEntering = false;
        renderTicTacToeMenu();
        window.setTimeout(() => {
            ticTacToeMenuClosing = false;
            ticTacToeMenuVisible = false;
            ticTacToeMenuShowingRules = false;
            ticTacToeMenuEntering = false;
            renderTicTacToeMenu();
        }, 220);
    }

    function showTicTacToeMenu() {
        ticTacToeMenuVisible = true;
        ticTacToeMenuShowingRules = false;
        ticTacToeMenuClosing = false;
        ticTacToeMenuEntering = true;
        renderTicTacToeMenu();
        window.setTimeout(() => {
            ticTacToeMenuEntering = false;
            renderTicTacToeMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function showTicTacToeMenuWithDelay() {
        if (ticTacToeOutcomeMenuTimeout) {
            window.clearTimeout(ticTacToeOutcomeMenuTimeout);
            ticTacToeOutcomeMenuTimeout = null;
        }

        ticTacToeMenuVisible = false;
        ticTacToeMenuShowingRules = false;
        ticTacToeMenuClosing = false;
        ticTacToeMenuEntering = false;
        renderTicTacToeMenu();

        ticTacToeOutcomeMenuTimeout = window.setTimeout(() => {
            ticTacToeOutcomeMenuTimeout = null;
            showTicTacToeMenu();
        }, GRID_OUTCOME_MENU_DELAY_MS);
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

    function getTicTacToeWinnerForBoard(board) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return lines.find(([a, b, c]) => (
            board[a]
            && board[a] === board[b]
            && board[a] === board[c]
        )) || null;
    }

    function getBestTicTacToeAiMove() {
        const emptyCells = getTicTacToeEmptyCells();
        if (!emptyCells.length) {
            return null;
        }

        const aiPlayer = 'skull';
        const humanPlayer = 'anchor';
        const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];

        const findFinishingMove = (player) => emptyCells.find((index) => {
            const board = [...ticTacToeBoardState];
            board[index] = player;
            return Boolean(getTicTacToeWinnerForBoard(board));
        });

        const winningMove = findFinishingMove(aiPlayer);
        if (winningMove !== undefined) {
            return winningMove;
        }

        const blockingMove = findFinishingMove(humanPlayer);
        if (blockingMove !== undefined) {
            return blockingMove;
        }

        if (emptyCells.includes(4)) {
            return 4;
        }

        const forkCandidates = emptyCells.filter((index) => {
            const board = [...ticTacToeBoardState];
            board[index] = aiPlayer;
            const futureWins = emptyCells
                .filter((candidate) => candidate !== index)
                .filter((candidate) => {
                    const nextBoard = [...board];
                    nextBoard[candidate] = aiPlayer;
                    return Boolean(getTicTacToeWinnerForBoard(nextBoard));
                });
            return futureWins.length >= 2;
        });
        if (forkCandidates.length) {
            return preferredOrder.find((index) => forkCandidates.includes(index)) ?? forkCandidates[0];
        }

        return preferredOrder.find((index) => emptyCells.includes(index)) ?? emptyCells[0];
    }

    function isMultiplayerTicTacToeActive() {
        return multiplayerActiveRoom?.gameId === 'ticTacToe' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function getMultiplayerTicTacToePlayer() {
        return multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
    }

    function getMultiplayerTicTacToeRole() {
        return getMultiplayerTicTacToePlayer()?.symbol || null;
    }

    function getMultiplayerTicTacToeTurnLabel() {
        if (ticTacToeFinished) {
            return '-';
        }

        const currentRole = getMultiplayerTicTacToeRole();
        if (!currentRole) {
            return ticTacToeCurrentPlayer === 'anchor' ? 'Joueur 1' : 'Joueur 2';
        }

        return ticTacToeCurrentPlayer === currentRole ? 'Toi' : 'Adversaire';
    }

    function getMultiplayerTicTacToeScoreLabel() {
        const currentRole = getMultiplayerTicTacToeRole();

        if (currentRole === 'skull') {
            return `Toi ${ticTacToeScores.skull} - ${ticTacToeScores.anchor} Adv.`;
        }

        return `Toi ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} Adv.`;
    }

    function getMultiplayerTicTacToeHelpText() {
        const playerCount = multiplayerActiveRoom?.playerCount || 0;
        const currentRole = getMultiplayerTicTacToeRole();

        if (playerCount < 2) {
            return "En attente d'un adversaire pour lancer la manche.";
        }

        if (ticTacToeFinished) {
            if (multiplayerActiveRoom?.gameState?.winner === 'draw') {
                return 'Match nul. Relance une manche pour vous départager.';
            }

            if (multiplayerActiveRoom?.gameState?.winner === currentRole) {
                return 'Victoire. Ton \u00e9quipage tient le pont.';
            }

            return "D\u00e9faite. L'adversaire prend le pont.";
        }

        if (!currentRole) {
            return 'La manche est en cours entre les deux joueurs.';
        }

        return ticTacToeCurrentPlayer === currentRole
            ? '\u00c0 toi de jouer.'
            : "Au tour de l'adversaire.";
    }

    function syncMultiplayerTicTacToeState() {
        if (!isMultiplayerTicTacToeActive()) {
            ticTacToeLastFinishedStateKey = '';
            if (ticTacToeOutcomeMenuTimeout) {
                window.clearTimeout(ticTacToeOutcomeMenuTimeout);
                ticTacToeOutcomeMenuTimeout = null;
            }
            return;
        }

        if (ticTacToeAiTimeout) {
            window.clearTimeout(ticTacToeAiTimeout);
            ticTacToeAiTimeout = null;
        }

        ticTacToeBoardState = Array.isArray(multiplayerActiveRoom.gameState.board)
            ? [...multiplayerActiveRoom.gameState.board]
            : Array(9).fill('');
        ticTacToeCurrentPlayer = multiplayerActiveRoom.gameState.currentPlayer || 'anchor';
        ticTacToeFinished = Boolean(multiplayerActiveRoom.gameState.finished);
        ticTacToeScores = {
            anchor: Number(multiplayerActiveRoom.gameState.scores?.anchor || 0),
            skull: Number(multiplayerActiveRoom.gameState.scores?.skull || 0)
        };

        updateTicTacToeHud();
        renderTicTacToeBoard();

        if (!ticTacToeFinished) {
            ticTacToeLastFinishedStateKey = '';
            if (ticTacToeOutcomeMenuTimeout) {
                window.clearTimeout(ticTacToeOutcomeMenuTimeout);
                ticTacToeOutcomeMenuTimeout = null;
            }
            return;
        }

        const finishedStateKey = `${multiplayerActiveRoom.gameState.round}:${multiplayerActiveRoom.gameState.winner}`;
        if (finishedStateKey === ticTacToeLastFinishedStateKey) {
            return;
        }

        ticTacToeLastFinishedStateKey = finishedStateKey;

        if (activeGameTab !== 'ticTacToe') {
            return;
        }

        if (multiplayerActiveRoom.gameState.winner === 'draw') {
            ticTacToeMenuResult = 'draw';
        } else if (multiplayerActiveRoom.gameState.winner === getMultiplayerTicTacToeRole()) {
            ticTacToeMenuResult = 'win';
        } else {
            ticTacToeMenuResult = 'loss';
        }

        showTicTacToeMenuWithDelay();
    }

    function initializeTicTacToe() {
        if (ticTacToeAiTimeout) {
            window.clearTimeout(ticTacToeAiTimeout);
            ticTacToeAiTimeout = null;
        }
        closeGameOverModal();
        if (ticTacToeOutcomeMenuTimeout) {
            window.clearTimeout(ticTacToeOutcomeMenuTimeout);
            ticTacToeOutcomeMenuTimeout = null;
        }
        ticTacToeBoardState = Array(9).fill('');
        ticTacToeRenderedBoardState = Array(9).fill('');
        ticTacToeCurrentPlayer = 'anchor';
        ticTacToeFinished = false;
        ticTacToeHelpText.textContent = "Place tes ancres contre l'IA pirate pour aligner trois symboles.";
        updateTicTacToeHud();
        renderTicTacToeBoard();
    }

    function getTicTacToeEmptyCells() {
        return ticTacToeBoardState
            .map((value, index) => value ? null : index)
            .filter((value) => value !== null);
    }
    function updateTicTacToeHud() {
        if (isMultiplayerTicTacToeActive()) {
            ticTacToeTurnDisplay.textContent = getMultiplayerTicTacToeTurnLabel();
            ticTacToeScoreDisplay.textContent = getMultiplayerTicTacToeScoreLabel();
            ticTacToeHelpText.textContent = getMultiplayerTicTacToeHelpText();
            ticTacToeModeButtons.forEach((button) => {
                button.classList.remove('is-active');
                button.disabled = true;
            });
            return;
        }

        ticTacToeTurnDisplay.textContent = ticTacToeFinished
            ? '-'
            : (ticTacToeCurrentPlayer === 'anchor'
                ? (ticTacToeMode === 'duo' ? 'Joueur 1' : 'Toi')
                : (ticTacToeMode === 'duo' ? 'Joueur 2' : 'IA'));
        ticTacToeScoreDisplay.textContent = ticTacToeMode === 'duo'
            ? `J1 ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} J2`
            : `Toi ${ticTacToeScores.anchor} - ${ticTacToeScores.skull} IA`;
        ticTacToeHelpText.textContent = ticTacToeMode === 'duo'
            ? 'Mode 2 joueurs : jouez chacun votre tour sur la même grille.'
            : "Mode 1 joueur: aligne trois symboles contre l'IA pirate.";
        ticTacToeModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.tictactoeMode === ticTacToeMode);
            button.disabled = false;
        });
    }

    function initializeTicTacToe(showMenu = true) {
        if (isMultiplayerTicTacToeActive()) {
            closeGameOverModal();
            ticTacToeMenuVisible = false;
            ticTacToeMenuShowingRules = false;
            ticTacToeMenuClosing = false;
            ticTacToeMenuEntering = false;
            renderTicTacToeMenu();
            syncMultiplayerTicTacToeState();
            return;
        }

        if (ticTacToeAiTimeout) {
            window.clearTimeout(ticTacToeAiTimeout);
            ticTacToeAiTimeout = null;
        }

        closeGameOverModal();
        if (ticTacToeOutcomeMenuTimeout) {
            window.clearTimeout(ticTacToeOutcomeMenuTimeout);
            ticTacToeOutcomeMenuTimeout = null;
        }
        ticTacToeBoardState = Array(9).fill('');
        ticTacToeCurrentPlayer = 'anchor';
        ticTacToeFinished = false;
        ticTacToeMenuResult = null;
        updateTicTacToeHud();
        renderTicTacToeBoard();
        if (showMenu) {
            showTicTacToeMenu();
        } else {
            ticTacToeMenuVisible = false;
            ticTacToeMenuShowingRules = false;
            ticTacToeMenuClosing = false;
            renderTicTacToeMenu();
        }
    }

    function finishTicTacToeRound(winner) {
        ticTacToeFinished = true;

        if (winner === 'anchor') {
            ticTacToeScores.anchor += 1;
            ticTacToeHelpText.textContent = ticTacToeMode === 'duo' ? 'Le joueur 1 tient le pont.' : 'Victoire. Ton \u00e9quipage tient le pont.';
            ticTacToeMenuResult = 'win';
        } else if (winner === 'skull') {
            ticTacToeScores.skull += 1;
            ticTacToeHelpText.textContent = ticTacToeMode === 'duo' ? 'Le joueur 2 prend le pont.' : "D\u00e9faite. L'IA pirate prend le pont.";
            ticTacToeMenuResult = 'loss';
        } else {
            ticTacToeHelpText.textContent = "Match nul. Personne ne prend l'avantage.";
            ticTacToeMenuResult = 'draw';
        }

        updateTicTacToeHud();
        renderTicTacToeBoard();
        showTicTacToeMenuWithDelay();
    }

    function handleTicTacToeMove(index, player = 'anchor') {
        if (isMultiplayerTicTacToeActive()) {
            if (!multiplayerSocket?.connected) {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }

            multiplayerSocket.emit('tictactoe:move', { index });
            return;
        }

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
            ticTacToeHelpText.textContent = "L'IA pirate prepare sa riposte.";
            ticTacToeAiTimeout = window.setTimeout(() => {
                ticTacToeAiTimeout = null;
                if (ticTacToeFinished) {
                    return;
                }

                const chosenIndex = getBestTicTacToeAiMove();
                if (chosenIndex === null) {
                    return;
                }

                handleTicTacToeMove(chosenIndex, 'skull');
            }, 320);
        } else if (!ticTacToeFinished) {
            ticTacToeHelpText.textContent = ticTacToeMode === 'duo'
                ? (ticTacToeCurrentPlayer === 'anchor' ? 'Au joueur 1 de jouer.' : 'Au joueur 2 de jouer.')
                : '\u00c0 toi de jouer.';
        }
    }

    function setTicTacToeMode(nextMode) {
        if (isMultiplayerTicTacToeActive()) {
            setMultiplayerStatus('Le mode est piloté par la room en ligne.');
            return;
        }

        if (!['solo', 'duo'].includes(nextMode)) {
            return;
        }

        ticTacToeMode = nextMode;
        ticTacToeScores = { anchor: 0, skull: 0 };
        initializeTicTacToe();
    }

    function isMultiplayerConnect4Active() {
        return multiplayerActiveRoom?.gameId === 'connect4' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function getMultiplayerConnect4Player() {
        return multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
    }

    function getMultiplayerConnect4Role() {
        return getMultiplayerConnect4Player()?.symbol || null;
    }

    function getMultiplayerConnect4TurnLabel() {
        if (connect4Finished) {
            return '-';
        }

        const currentRole = getMultiplayerConnect4Role();
        if (!currentRole) {
            return connect4CurrentPlayer === 'player' ? 'Joueur 1' : 'Joueur 2';
        }

        return connect4CurrentPlayer === currentRole ? 'Toi' : 'Adversaire';
    }

    function getMultiplayerConnect4ScoreLabel() {
        const currentRole = getMultiplayerConnect4Role();

        if (currentRole === 'ai') {
            return `Toi ${connect4Scores.ai} - ${connect4Scores.player} Adv.`;
        }

        return `Toi ${connect4Scores.player} - ${connect4Scores.ai} Adv.`;
    }

    function getMultiplayerConnect4HelpText() {
        const playerCount = multiplayerActiveRoom?.playerCount || 0;
        const currentRole = getMultiplayerConnect4Role();

        if (playerCount < 2) {
            return "En attente d'un adversaire pour lancer la manche.";
        }

        if (connect4Finished) {
            if (multiplayerActiveRoom?.gameState?.winner === 'draw') {
                return 'La grille est pleine. Relance une manche pour vous départager.';
            }

            if (multiplayerActiveRoom?.gameState?.winner === currentRole) {
                return 'Victoire. Tu controles la colonne du pont.';
            }

            return "D\u00e9faite. L'adversaire aligne quatre jetons.";
        }

        if (!currentRole) {
            return 'La manche est en cours entre les deux joueurs.';
        }

        return connect4CurrentPlayer === currentRole
            ? '\u00c0 toi de jouer.'
            : "Au tour de l'adversaire.";
    }

    function getConnect4RulesText() {
        return "Largue un jeton dans une colonne pour former une ligne de quatre, à l'horizontale, à la verticale ou en diagonale avant ton rival.";
    }

    function renderConnect4Menu() {
        if (!connect4MenuOverlay || !connect4Table) {
            return;
        }

        syncGameMenuOverlayBounds(connect4MenuOverlay, connect4Table);
        connect4MenuOverlay.classList.toggle('hidden', !connect4MenuVisible);
        connect4MenuOverlay.classList.toggle('is-closing', connect4MenuClosing);
        connect4MenuOverlay.classList.toggle('is-entering', connect4MenuEntering);
        connect4Table.classList.toggle('is-menu-open', connect4MenuVisible);

        if (!connect4MenuVisible) {
            return;
        }

        const multiplayerConnect4 = isMultiplayerConnect4Active();
        const hasResult = connect4MenuResult && connect4Finished;
        const winner = multiplayerConnect4 ? multiplayerActiveRoom?.gameState?.winner : connect4OutcomeWinner;
        if (connect4MenuEyebrow) {
            connect4MenuEyebrow.textContent = connect4MenuShowingRules ? 'R\u00e8gles' : (hasResult ? 'Fin de manche' : 'Pont des corsaires');
        }
        if (connect4MenuTitle) {
            connect4MenuTitle.textContent = connect4MenuShowingRules
                ? 'Rappel rapide'
                : (hasResult
                    ? (multiplayerConnect4
                        ? (winner === 'draw' ? 'Match nul' : (winner === getMultiplayerConnect4Role() ? 'Victoire' : "C'est perdu"))
                        : (connect4Mode === 'duo'
                            ? (winner === 'draw' ? 'Match nul' : `${winner === 'player' ? 'Joueur 1' : 'Joueur 2'} gagne`)
                            : (winner === 'draw' ? 'Match nul' : (winner === 'player' ? 'Victoire' : "C'est perdu"))))
                    : 'Coin 4');
        }
        if (connect4MenuText) {
            connect4MenuText.textContent = connect4MenuShowingRules
                ? getConnect4RulesText()
                : (hasResult
                    ? (multiplayerConnect4
                        ? (winner === 'draw'
                            ? 'La grille est pleine. Il faudra relancer une manche pour vous départager.'
                            : (winner === getMultiplayerConnect4Role()
                                ? 'Tu remportes cette manche de Coin 4 en ligne.'
                                : "L'adversaire remporte cette manche de Coin 4."))
                        : (connect4Mode === 'duo'
                            ? (winner === 'draw'
                                ? "La grille est pleine. Aucun des deux capitaines ne prend l'avantage."
                                : `Le ${winner === 'player' ? 'joueur 1' : 'joueur 2'} aligne quatre jetons.`)
                            : (winner === 'draw'
                                ? 'La grille est pleine. La manche se termine sans vainqueur.'
                                : (winner === 'player'
                                    ? 'Tu remportes cette manche de Coin 4.'
                                    : "L'IA remporte cette manche de Coin 4."))))
                    : ((multiplayerConnect4 && !multiplayerActiveRoom?.gameLaunched)
                        ? 'Quand tous les joueurs sont pr\u00eats, la manche de Coin 4 se lance automatiquement.'
                        : 'Choisis ton mode puis prends possession du pont en alignant quatre jetons avant ton rival.'));
        }
        if (connect4MenuActionButton) {
            connect4MenuActionButton.textContent = connect4MenuShowingRules
                ? 'Retour'
                : ((multiplayerConnect4 && !multiplayerActiveRoom?.gameLaunched)
                    ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                    : (hasResult ? 'Relancer la partie' : 'Lancer la partie'));
        }
        if (connect4MenuRulesButton) {
            connect4MenuRulesButton.textContent = 'R\u00e8gles';
            connect4MenuRulesButton.hidden = connect4MenuShowingRules;
        }
    }

    function startConnect4LaunchSequence() {
        connect4MenuClosing = true;
        renderConnect4Menu();
        window.setTimeout(() => {
            connect4MenuClosing = false;
            connect4MenuVisible = false;
            connect4MenuShowingRules = false;
            connect4MenuEntering = false;
            connect4MenuResult = false;
            renderConnect4Menu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealConnect4OutcomeMenu() {
        connect4MenuVisible = true;
        connect4MenuResult = true;
        connect4MenuShowingRules = false;
        connect4MenuClosing = false;
        connect4MenuEntering = true;
        renderConnect4Menu();
        window.setTimeout(() => {
            connect4MenuEntering = false;
            renderConnect4Menu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealConnect4OutcomeMenuWithDelay() {
        if (connect4OutcomeMenuTimeout) {
            window.clearTimeout(connect4OutcomeMenuTimeout);
            connect4OutcomeMenuTimeout = null;
        }

        connect4MenuVisible = false;
        connect4MenuShowingRules = false;
        connect4MenuClosing = false;
        connect4MenuEntering = false;
        renderConnect4Menu();

        connect4OutcomeMenuTimeout = window.setTimeout(() => {
            connect4OutcomeMenuTimeout = null;
            revealConnect4OutcomeMenu();
        }, GRID_OUTCOME_MENU_DELAY_MS);
    }

    function syncMultiplayerConnect4State() {
        if (!isMultiplayerConnect4Active()) {
            connect4LastFinishedStateKey = '';
            connect4LastMoveAnimationKey = '';
            connect4OutcomeWinner = null;
            return;
        }

        if (connect4AiTimeout) {
            window.clearTimeout(connect4AiTimeout);
            connect4AiTimeout = null;
        }

        if (connect4DropAnimationTimeout) {
            window.clearTimeout(connect4DropAnimationTimeout);
            connect4DropAnimationTimeout = null;
        }

        closeGameOverModal();
        connect4BoardState = Array.isArray(multiplayerActiveRoom.gameState.board)
            ? multiplayerActiveRoom.gameState.board.map((row) => [...row])
            : Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(null));
        connect4CurrentPlayer = multiplayerActiveRoom.gameState.currentPlayer || 'player';
        connect4Finished = Boolean(multiplayerActiveRoom.gameState.finished);
        connect4Scores = {
            player: Number(multiplayerActiveRoom.gameState.scores?.player || 0),
            ai: Number(multiplayerActiveRoom.gameState.scores?.ai || 0)
        };
        connect4DropAnimationKey = null;
        connect4DropAnimationState = null;
        connect4OutcomeWinner = multiplayerActiveRoom.gameState.winner || null;
        connect4MenuVisible = false;
        connect4MenuShowingRules = false;
        connect4MenuClosing = false;
        connect4MenuResult = connect4Finished;

        if (connect4OutcomeMenuTimeout) {
            window.clearTimeout(connect4OutcomeMenuTimeout);
            connect4OutcomeMenuTimeout = null;
        }

        renderConnect4();

        const lastMove = multiplayerActiveRoom.gameState.lastMove;
        const nextAnimationKey = lastMove ? `${multiplayerActiveRoom.gameState.round}:${lastMove.row}:${lastMove.col}:${lastMove.token}` : '';

        if (lastMove && nextAnimationKey !== connect4LastMoveAnimationKey) {
            window.requestAnimationFrame(() => {
                playConnect4DropAnimation(lastMove.row, lastMove.col, lastMove.token);
            });
        }
        connect4LastMoveAnimationKey = nextAnimationKey;

        if (Array.isArray(multiplayerActiveRoom.gameState.winningLine)) {
            highlightConnect4Line(multiplayerActiveRoom.gameState.winningLine);
        }

        updateConnect4Hud();

        if (!connect4Finished) {
            connect4LastFinishedStateKey = '';
            connect4MenuResult = false;
            return;
        }

        const finishedStateKey = `${multiplayerActiveRoom.gameState.round}:${multiplayerActiveRoom.gameState.winner}`;
        if (finishedStateKey === connect4LastFinishedStateKey) {
            return;
        }

        connect4LastFinishedStateKey = finishedStateKey;

        if (activeGameTab !== 'connect4') {
            return;
        }
        revealConnect4OutcomeMenuWithDelay();
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

    function setBattleshipMode(mode) {
        battleshipMode = mode === 'duo' ? 'duo' : 'solo';
        battleshipCurrentTurn = 'captain1';
        battleshipModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.battleshipMode === battleshipMode);
        });
        initializeBattleship();
    }

    function getBattleshipTurnContext() {
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

    function renderBattleship() {
        const context = getBattleshipTurnContext();
        renderBattleshipBoard(battleshipPlayerBoard, context.playerGrid, true, 'player');
        renderBattleshipBoard(battleshipEnemyBoard, context.enemyGrid, false, 'enemy');
        updateBattleshipHud();
    }

    function getBattleshipRulesText() {
        return 'Chaque flotte place 5 navires al\u00e9atoirement dans la baie. Clique sur la grille ennemie pour ouvrir le feu. Touche tous leurs navires avant qu\u2019ils ne coulent les tiens. En solo, un ennemi IA riposte apr\u00e8s chaque tir.';
    }

    function renderBattleshipMenu() {
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
            battleshipMenuActionButton.textContent = battleshipMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la bataille' : 'Lancer la bataille');
        }

        if (battleshipMenuRulesButton) {
            battleshipMenuRulesButton.textContent = 'R\u00e8gles';
            battleshipMenuRulesButton.hidden = battleshipMenuShowingRules;
        }
    }

    function closeBattleshipMenu() {
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

    function revealBattleshipOutcomeMenu(title, text, eyebrow) {
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

    function initializeBattleship() {
        if (isMultiplayerBattleshipActive()) {
            battleshipMenuVisible = false;
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

    function finishBattleship(playerWon) {
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

    function runBattleshipAiTurn() {
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

    function handleBattleshipShot(row, col) {
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
            revealTetrisOutcomeMenu(
                'Cale pleine',
                `La cargaison a dépassé le pont. Score final : ${tetrisScore}. Lignes nettoyées : ${tetrisLines}.`,
                'Fin de cargaison'
            );
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

    function getTetrisRulesText() {
        return 'D\u00e9place la caisse qui tombe avec les fl\u00e8ches ou ZQSD. Haut ou Z pour la pivoter, bas ou S pour acc\u00e9l\u00e9rer sa descente, Espace pour la faire chuter d\u2019un coup. Compl\u00e8te une ligne enti\u00e8re pour la nettoyer. Si la pile touche le pont, la cale est pleine.';
    }

    function renderTetrisMenu() {
        if (!tetrisMenuOverlay || !tetrisTable) {
            return;
        }

        syncGameMenuOverlayBounds(tetrisMenuOverlay, tetrisTable);
        tetrisMenuOverlay.classList.toggle('hidden', !tetrisMenuVisible);
        tetrisMenuOverlay.classList.toggle('is-closing', tetrisMenuClosing);
        tetrisMenuOverlay.classList.toggle('is-entering', tetrisMenuEntering);
        tetrisTable.classList.toggle('is-menu-open', tetrisMenuVisible);

        if (!tetrisMenuVisible) {
            return;
        }

        const hasResult = Boolean(tetrisMenuResult);

        if (tetrisMenuEyebrow) {
            tetrisMenuEyebrow.textContent = tetrisMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? tetrisMenuResult.eyebrow : 'Cale de cargaison');
        }

        if (tetrisMenuTitle) {
            tetrisMenuTitle.textContent = tetrisMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? tetrisMenuResult.title : 'Baietris');
        }

        if (tetrisMenuText) {
            tetrisMenuText.textContent = tetrisMenuShowingRules
                ? getTetrisRulesText()
                : (hasResult
                    ? tetrisMenuResult.text
                    : 'Empile les caisses dans la cale du navire sans laisser la pile atteindre le pont.');
        }

        if (tetrisMenuActionButton) {
            tetrisMenuActionButton.textContent = tetrisMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la cale' : 'Lancer la cale');
        }

        if (tetrisMenuRulesButton) {
            tetrisMenuRulesButton.textContent = 'R\u00e8gles';
            tetrisMenuRulesButton.hidden = tetrisMenuShowingRules;
        }
    }

    function closeTetrisMenu() {
        tetrisMenuClosing = true;
        renderTetrisMenu();
        window.setTimeout(() => {
            tetrisMenuClosing = false;
            tetrisMenuVisible = false;
            tetrisMenuShowingRules = false;
            tetrisMenuEntering = false;
            tetrisMenuResult = null;
            renderTetrisMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealTetrisOutcomeMenu(title, text, eyebrow) {
        tetrisMenuVisible = true;
        tetrisMenuResult = { title, text, eyebrow };
        tetrisMenuShowingRules = false;
        tetrisMenuClosing = false;
        tetrisMenuEntering = true;

        if (tetrisHelpText) {
            tetrisHelpText.textContent = text;
        }

        renderTetrisMenu();
        window.setTimeout(() => {
            tetrisMenuEntering = false;
            renderTetrisMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function initializeTetris() {
        closeGameOverModal();
        stopTetris();
        tetrisGrid = createEmptyTetrisGrid();
        tetrisPiece = createRandomTetrisPiece();
        tetrisScore = 0;
        tetrisLines = 0;
        tetrisMenuResult = null;
        tetrisMenuShowingRules = false;
        tetrisMenuClosing = false;
        tetrisMenuEntering = false;
        tetrisHelpText.textContent = 'Empile les caisses. Fl\u00e8ches ou ZQSD pour bouger, haut ou Z pour pivoter, espace pour tomber.';
        renderTetris();
        renderTetrisMenu();
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
            ? "Un esprit t'a touché. Relance la chasse pour reprendre la baie."
            : "Les esprits du brouillard t'ont rattrapé.";
        renderPacman();

        if (pacmanLives > 0) {
            startPacmanCountdown(() => {
                pacmanRunning = true;
                updatePacmanHud();
                pacmanInterval = window.setInterval(runPacmanTick, 220);
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
            revealPacmanOutcomeMenu(
                'Chasse terminée',
                `Les esprits du brouillard t'ont capturé. Perles ramassées : ${pacmanScore}.`,
                'Cap sur le port'
            );
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
            pacmanHelpText.textContent = 'La baie est nettoyée. Plus aucune perle à  ramasser.';
            revealPacmanOutcomeMenu(
                'Port nettoyé',
                `Toutes les perles de la baie ont été ramassées. Score final : ${pacmanScore}.`,
                'Chasse réussie'
            );
        }

        renderPacman();
    }

    function getPacmanRulesText() {
        return 'D\u00e9place Baie-Man avec les fl\u00e8ches ou ZQSD. Ramasse toutes les perles du labyrinthe pour nettoyer le port. Si un esprit du brouillard te rattrape, tu perds une vie. Trois captures et la chasse s\u2019arr\u00eate.';
    }

    function renderPacmanMenu() {
        if (!pacmanMenuOverlay || !pacmanTable) {
            return;
        }

        syncGameMenuOverlayBounds(pacmanMenuOverlay, pacmanTable);
        pacmanMenuOverlay.classList.toggle('hidden', !pacmanMenuVisible);
        pacmanMenuOverlay.classList.toggle('is-closing', pacmanMenuClosing);
        pacmanMenuOverlay.classList.toggle('is-entering', pacmanMenuEntering);
        pacmanTable.classList.toggle('is-menu-open', pacmanMenuVisible);

        if (!pacmanMenuVisible) {
            return;
        }

        const hasResult = Boolean(pacmanMenuResult);

        if (pacmanMenuEyebrow) {
            pacmanMenuEyebrow.textContent = pacmanMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? pacmanMenuResult.eyebrow : 'Labyrinthe du port');
        }

        if (pacmanMenuTitle) {
            pacmanMenuTitle.textContent = pacmanMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? pacmanMenuResult.title : 'Baie-Man');
        }

        if (pacmanMenuText) {
            pacmanMenuText.textContent = pacmanMenuShowingRules
                ? getPacmanRulesText()
                : (hasResult
                    ? pacmanMenuResult.text
                    : 'Ramasse toutes les perles de la baie sans te faire attraper par les esprits du brouillard.');
        }

        if (pacmanMenuActionButton) {
            pacmanMenuActionButton.textContent = pacmanMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la chasse' : 'Lancer la chasse');
        }

        if (pacmanMenuRulesButton) {
            pacmanMenuRulesButton.textContent = 'R\u00e8gles';
            pacmanMenuRulesButton.hidden = pacmanMenuShowingRules;
        }
    }

    function closePacmanMenu() {
        pacmanMenuClosing = true;
        renderPacmanMenu();
        window.setTimeout(() => {
            pacmanMenuClosing = false;
            pacmanMenuVisible = false;
            pacmanMenuShowingRules = false;
            pacmanMenuEntering = false;
            pacmanMenuResult = null;
            renderPacmanMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealPacmanOutcomeMenu(title, text, eyebrow) {
        pacmanMenuVisible = true;
        pacmanMenuResult = { title, text, eyebrow };
        pacmanMenuShowingRules = false;
        pacmanMenuClosing = false;
        pacmanMenuEntering = true;

        if (pacmanHelpText) {
            pacmanHelpText.textContent = text;
        }

        renderPacmanMenu();
        window.setTimeout(() => {
            pacmanMenuEntering = false;
            renderPacmanMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function initializePacman() {
        closeGameOverModal();
        stopPacman();
        pacmanGrid = createPacmanGrid();
        pacmanScore = 0;
        pacmanLives = 3;
        pacmanMenuResult = null;
        pacmanMenuShowingRules = false;
        pacmanMenuClosing = false;
        pacmanMenuEntering = false;
        pacmanHelpText.textContent = 'Ramasse toutes les perles de la baie sans te faire attraper par les esprits du brouillard.';
        resetPacmanActors();
        if (pacmanGrid[pacmanPosition.row][pacmanPosition.col] === 'pellet') {
            pacmanGrid[pacmanPosition.row][pacmanPosition.col] = 'empty';
        }
        pacmanPellets = pacmanGrid.flat().filter((cell) => cell === 'pellet').length;
        buildPacmanBoard();
        renderPacman();
        renderPacmanMenu();
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
            pacmanInterval = window.setInterval(runPacmanTick, 220);
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
            revealSolitaireOutcomeMenu(
                'Fondations complètes',
                'Les 52 cartes sont rangées sur les fondations. Belle traversée, capitaine.',
                'Cabine rangée'
            );
        }
    }

    function renderSolitaire() {
        updateSolitaireHud();

        solitaireStock.innerHTML = solitaireStockCards.length
            ? '<button type="button" class="solitaire-playing-card-back" data-solitaire-action="draw"><span class="card-back-emblem"></span></button>'
            : '<button type="button" class="solitaire-playing-card-placeholder" data-solitaire-action="recycle">â†º</button>';

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

    function getSolitaireRulesText() {
        return 'Clique une carte pour la s\u00e9lectionner puis clique sa destination. Sur les colonnes, alterne couleurs rouge/noir en descendant. Monte les quatre fondations de l\u2019As au Roi par couleur. La pioche se recycle quand elle est \u00e9puis\u00e9e.';
    }

    function renderSolitaireMenu() {
        if (!solitaireMenuOverlay || !solitaireTable) return;
        syncGameMenuOverlayBounds(solitaireMenuOverlay, solitaireTable);
        solitaireMenuOverlay.classList.toggle('hidden', !solitaireMenuVisible);
        solitaireMenuOverlay.classList.toggle('is-closing', solitaireMenuClosing);
        solitaireMenuOverlay.classList.toggle('is-entering', solitaireMenuEntering);
        solitaireTable.classList.toggle('is-menu-open', solitaireMenuVisible);
        if (!solitaireMenuVisible) return;
        const hasResult = Boolean(solitaireMenuResult);
        if (solitaireMenuEyebrow) solitaireMenuEyebrow.textContent = solitaireMenuShowingRules ? 'R\u00e8gles' : (hasResult ? solitaireMenuResult.eyebrow : 'Cabine du capitaine');
        if (solitaireMenuTitle) solitaireMenuTitle.textContent = solitaireMenuShowingRules ? 'Rappel rapide' : (hasResult ? solitaireMenuResult.title : 'Solitaire');
        if (solitaireMenuText) solitaireMenuText.textContent = solitaireMenuShowingRules ? getSolitaireRulesText() : (hasResult ? solitaireMenuResult.text : 'Trie les cartes du capitaine dans les quatre fondations en suivant couleurs et valeurs.');
        if (solitaireMenuActionButton) solitaireMenuActionButton.textContent = solitaireMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la donne' : 'Lancer la donne');
        if (solitaireMenuRulesButton) { solitaireMenuRulesButton.textContent = 'R\u00e8gles'; solitaireMenuRulesButton.hidden = solitaireMenuShowingRules; }
    }

    function closeSolitaireMenu() {
        solitaireMenuClosing = true;
        renderSolitaireMenu();
        window.setTimeout(() => {
            solitaireMenuClosing = false;
            solitaireMenuVisible = false;
            solitaireMenuShowingRules = false;
            solitaireMenuEntering = false;
            solitaireMenuResult = null;
            renderSolitaireMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealSolitaireOutcomeMenu(title, text, eyebrow) {
        solitaireMenuVisible = true;
        solitaireMenuResult = { title, text, eyebrow };
        solitaireMenuShowingRules = false;
        solitaireMenuClosing = false;
        solitaireMenuEntering = true;
        if (solitaireHelpText) solitaireHelpText.textContent = text;
        renderSolitaireMenu();
        window.setTimeout(() => { solitaireMenuEntering = false; renderSolitaireMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
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
        solitaireMenuResult = null;
        solitaireMenuShowingRules = false;
        solitaireMenuClosing = false;
        solitaireMenuEntering = false;
        renderSolitaire();
        renderSolitaireMenu();
    }

    function updateConnect4Hud() {
        if (isMultiplayerConnect4Active()) {
            connect4TurnDisplay.textContent = getMultiplayerConnect4TurnLabel();
            connect4ScoreDisplay.textContent = getMultiplayerConnect4ScoreLabel();
            connect4HelpText.textContent = getMultiplayerConnect4HelpText();
            connect4ModeButtons.forEach((button) => {
                button.classList.remove('is-active');
                button.disabled = true;
            });
            return;
        }

        const currentPlayerLabel = connect4CurrentPlayer === 'player'
            ? (connect4Mode === 'duo' ? 'Joueur 1' : 'Toi')
            : (connect4Mode === 'duo' ? 'Joueur 2' : 'IA');
        connect4TurnDisplay.textContent = currentPlayerLabel;
        connect4ScoreDisplay.textContent = connect4Mode === 'duo'
            ? `J1 ${connect4Scores.player} - ${connect4Scores.ai} J2`
            : `Toi ${connect4Scores.player} - ${connect4Scores.ai} IA`;
        connect4HelpText.textContent = connect4Mode === 'duo'
            ? 'Mode 2 joueurs: cliquez chacun votre tour sur une colonne pour faire tomber un jeton.'
            : "Mode 1 joueur: clique une colonne pour y larguer un jeton contre l'IA.";
        connect4ModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.connect4Mode === connect4Mode);
            button.disabled = false;
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
            ><span class="connect4-drop-piece-skull">&#9760;</span></div>
        ` : ''}`;
        renderConnect4Menu();
    }

    function initializeConnect4() {
        if (isMultiplayerConnect4Active()) {
            syncMultiplayerConnect4State();
            return;
        }

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
        connect4OutcomeWinner = null;
        connect4MenuVisible = true;
        connect4MenuShowingRules = false;
        connect4MenuClosing = false;
        connect4MenuEntering = false;
        connect4MenuResult = false;
        if (connect4OutcomeMenuTimeout) {
            window.clearTimeout(connect4OutcomeMenuTimeout);
            connect4OutcomeMenuTimeout = null;
        }
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


    function getConnect4DropRowForBoard(board, col) {
        for (let row = CONNECT4_ROWS - 1; row >= 0; row -= 1) {
            if (!board[row][col]) {
                return row;
            }
        }

        return -1;
    }

    function cloneConnect4Board(board) {
        return board.map((row) => [...row]);
    }

    function getConnect4AvailableColumns(board) {
        return Array.from({ length: CONNECT4_COLS }, (_, index) => index)
            .filter((col) => getConnect4DropRowForBoard(board, col) !== -1);
    }

    function dropConnect4TokenOnBoard(board, col, token) {
        const row = getConnect4DropRowForBoard(board, col);
        if (row === -1) {
            return null;
        }

        const nextBoard = cloneConnect4Board(board);
        nextBoard[row][col] = token;
        return { board: nextBoard, row };
    }

    function evaluateConnect4Window(windowCells) {
        const aiCount = windowCells.filter((cell) => cell === 'ai').length;
        const playerCount = windowCells.filter((cell) => cell === 'player').length;
        const emptyCount = windowCells.filter((cell) => !cell).length;

        if (aiCount && playerCount) {
            return 0;
        }

        if (aiCount === 4) {
            return 100000;
        }

        if (playerCount === 4) {
            return -100000;
        }

        if (aiCount === 3 && emptyCount === 1) {
            return 120;
        }

        if (aiCount === 2 && emptyCount === 2) {
            return 18;
        }

        if (playerCount === 3 && emptyCount === 1) {
            return -135;
        }

        if (playerCount === 2 && emptyCount === 2) {
            return -20;
        }

        if (aiCount === 1 && emptyCount === 3) {
            return 4;
        }

        if (playerCount === 1 && emptyCount === 3) {
            return -4;
        }

        return 0;
    }

    function evaluateConnect4Board(board) {
        let score = 0;
        const centerCol = Math.floor(CONNECT4_COLS / 2);
        const centerCells = board.map((row) => row[centerCol]);
        score += centerCells.filter((cell) => cell === 'ai').length * 9;
        score -= centerCells.filter((cell) => cell === 'player').length * 9;

        for (let row = 0; row < CONNECT4_ROWS; row += 1) {
            for (let col = 0; col <= CONNECT4_COLS - 4; col += 1) {
                score += evaluateConnect4Window([
                    board[row][col],
                    board[row][col + 1],
                    board[row][col + 2],
                    board[row][col + 3]
                ]);
            }
        }

        for (let row = 0; row <= CONNECT4_ROWS - 4; row += 1) {
            for (let col = 0; col < CONNECT4_COLS; col += 1) {
                score += evaluateConnect4Window([
                    board[row][col],
                    board[row + 1][col],
                    board[row + 2][col],
                    board[row + 3][col]
                ]);
            }
        }

        for (let row = 0; row <= CONNECT4_ROWS - 4; row += 1) {
            for (let col = 0; col <= CONNECT4_COLS - 4; col += 1) {
                score += evaluateConnect4Window([
                    board[row][col],
                    board[row + 1][col + 1],
                    board[row + 2][col + 2],
                    board[row + 3][col + 3]
                ]);
            }
        }

        for (let row = 0; row <= CONNECT4_ROWS - 4; row += 1) {
            for (let col = 3; col < CONNECT4_COLS; col += 1) {
                score += evaluateConnect4Window([
                    board[row][col],
                    board[row + 1][col - 1],
                    board[row + 2][col - 2],
                    board[row + 3][col - 3]
                ]);
            }
        }

        return score;
    }

    function minimaxConnect4(board, depth, maximizingPlayer, alpha, beta) {
        if (getConnect4Winner(board, 'ai')) {
            return 1000000 + depth;
        }

        if (getConnect4Winner(board, 'player')) {
            return -1000000 - depth;
        }

        const availableCols = getConnect4AvailableColumns(board);
        if (!availableCols.length) {
            return 0;
        }

        if (depth === 0) {
            return evaluateConnect4Board(board);
        }

        if (maximizingPlayer) {
            let bestScore = -Infinity;

            for (const col of availableCols) {
                const nextMove = dropConnect4TokenOnBoard(board, col, 'ai');
                if (!nextMove) {
                    continue;
                }

                const score = minimaxConnect4(nextMove.board, depth - 1, false, alpha, beta);
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);

                if (beta <= alpha) {
                    break;
                }
            }

            return bestScore;
        }

        let bestScore = Infinity;

        for (const col of availableCols) {
            const nextMove = dropConnect4TokenOnBoard(board, col, 'player');
            if (!nextMove) {
                continue;
            }

            const score = minimaxConnect4(nextMove.board, depth - 1, true, alpha, beta);
            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, score);

            if (beta <= alpha) {
                break;
            }
        }

        return bestScore;
    }

    function highlightConnect4Line(line) {
        line.forEach(([row, col]) => {
            connect4Board.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.classList.add('is-winning');
        });
    }

    function playConnect4DropAnimation(row, col, token) {
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

                if (isMultiplayerConnect4Active() && Array.isArray(multiplayerActiveRoom.gameState.winningLine)) {
                    highlightConnect4Line(multiplayerActiveRoom.gameState.winningLine);
                }
            }
            connect4DropAnimationTimeout = null;
        }, 380);
    }

    function chooseConnect4AiColumn() {
        const availableCols = getConnect4AvailableColumns(connect4BoardState);

        for (const col of availableCols) {
            const preview = dropConnect4TokenOnBoard(connect4BoardState, col, 'ai');
            if (preview && getConnect4Winner(preview.board, 'ai')) {
                return col;
            }
        }

        for (const col of availableCols) {
            const preview = dropConnect4TokenOnBoard(connect4BoardState, col, 'player');
            if (preview && getConnect4Winner(preview.board, 'player')) {
                return col;
            }
        }

        let bestScore = -Infinity;
        let bestColumns = [];

        availableCols.forEach((col) => {
            const preview = dropConnect4TokenOnBoard(connect4BoardState, col, 'ai');
            if (!preview) {
                return;
            }

            let score = minimaxConnect4(preview.board, 4, false, -Infinity, Infinity);
            score += (3 - Math.abs(3 - col)) * 4;
            score += Math.random() * 0.18;

            if (score > bestScore) {
                bestScore = score;
                bestColumns = [col];
            } else if (Math.abs(score - bestScore) < 0.001) {
                bestColumns.push(col);
            }
        });

        const preferred = [3, 2, 4, 1, 5, 0, 6];
        return preferred.find((col) => bestColumns.includes(col))
            ?? bestColumns[Math.floor(Math.random() * bestColumns.length)]
            ?? availableCols[0];
    }

    function finishConnect4(winner, line = null) {
        connect4Finished = true;
        connect4OutcomeWinner = winner;

        if (line) {
            highlightConnect4Line(line);
        }

        if (winner === 'player') {
            connect4Scores.player += 1;
            connect4HelpText.textContent = connect4Mode === 'duo' ? 'Le joueur 1 aligne quatre jetons.' : 'Victoire. Tu controles la colonne du pont.';
        } else if (winner === 'ai') {
            connect4Scores.ai += 1;
            connect4HelpText.textContent = connect4Mode === 'duo' ? 'Le joueur 2 aligne quatre jetons.' : "L'IA a aligne quatre jetons.";
        } else {
            connect4HelpText.textContent = "La grille est pleine. Aucun navire ne prend l'avantage.";
        }

        updateConnect4Hud();
        revealConnect4OutcomeMenuWithDelay();
    }

    function dropConnect4Token(col, token) {
        const row = getConnect4DropRow(col);

        if (row === -1) {
            return false;
        }

        connect4BoardState[row][col] = token;
        playConnect4DropAnimation(row, col, token);

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
        if (connect4MenuVisible || connect4MenuClosing) {
            return;
        }

        if (isMultiplayerConnect4Active()) {
            if (!multiplayerSocket?.connected) {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }

            multiplayerSocket.emit('connect4:move', { col });
            return;
        }

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
        connect4HelpText.textContent = "L'IA calcule sa r\u00e9ponse...";
        updateConnect4Hud();
        connect4AiTimeout = window.setTimeout(() => {
            connect4AiTimeout = null;
            runConnect4AiTurn();
        }, 320);
    }

    function setConnect4Mode(nextMode) {
        if (isMultiplayerConnect4Active()) {
            setMultiplayerStatus('Le mode est piloté par la room en ligne.');
            return;
        }

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
        rhythmMissesDisplay.textContent = `${rhythmMisses} / ${RHYTHM_MAX_MISSES}`;
        rhythmTimerDisplay.textContent = String(Math.max(0, Math.ceil(timeRemainingMs / 1000)));
    }

    function renderRhythmBoard() {
        rhythmBoard.innerHTML = `
            <div class="rhythm-sky-glow"></div>
            <div class="rhythm-moon"></div>
            <div class="rhythm-island rhythm-island-left"></div>
            <div class="rhythm-island rhythm-island-right"></div>
            <div class="rhythm-sea"></div>
            <div class="rhythm-lanes" style="grid-template-columns: repeat(${RHYTHM_LANES.length}, minmax(0, 1fr));">${RHYTHM_LANES.map(() => '<div class="rhythm-lane"></div>').join('')}</div>
            <div class="rhythm-target-band" aria-hidden="true"></div>
            <div class="rhythm-notes"></div>
            <div class="rhythm-feedback"></div>
            <div class="rhythm-pads" style="grid-template-columns: repeat(${RHYTHM_LANES.length}, minmax(0, 1fr));">${RHYTHM_LANES.map((key, index) => `<button type="button" class="rhythm-pad" data-rhythm-lane="${index}">${key}</button>`).join('')}</div>
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

    function getRhythmRulesText() {
        return `Appuie sur ${RHYTHM_LANES.join(', ')} au bon moment quand la note croise la ligne d\u2019impact. Encha\u00eene les touches parfaites pour faire monter la s\u00e9rie. Au-del\u00e0 de 10 fautes, la cadence s\u2019arr\u00eate.`;
    }

    function renderRhythmMenu() {
        if (!rhythmMenuOverlay || !rhythmTable) return;
        syncGameMenuOverlayBounds(rhythmMenuOverlay, rhythmTable);
        rhythmMenuOverlay.classList.toggle('hidden', !rhythmMenuVisible);
        rhythmMenuOverlay.classList.toggle('is-closing', rhythmMenuClosing);
        rhythmMenuOverlay.classList.toggle('is-entering', rhythmMenuEntering);
        rhythmTable.classList.toggle('is-menu-open', rhythmMenuVisible);
        if (!rhythmMenuVisible) return;
        const hasResult = Boolean(rhythmMenuResult);
        if (rhythmMenuEyebrow) rhythmMenuEyebrow.textContent = rhythmMenuShowingRules ? 'R\u00e8gles' : (hasResult ? rhythmMenuResult.eyebrow : 'Cadence des marins');
        if (rhythmMenuTitle) rhythmMenuTitle.textContent = rhythmMenuShowingRules ? 'Rappel rapide' : (hasResult ? rhythmMenuResult.title : 'Rythme');
        if (rhythmMenuText) rhythmMenuText.textContent = rhythmMenuShowingRules ? getRhythmRulesText() : (hasResult ? rhythmMenuResult.text : 'Garde le tempo avec Q, S et D pour accompagner la chanson des marins. Trop de fautes et la cadence s\u2019arr\u00eate.');
        if (rhythmMenuActionButton) rhythmMenuActionButton.textContent = rhythmMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la cadence' : 'Lancer la cadence');
        if (rhythmMenuRulesButton) { rhythmMenuRulesButton.textContent = 'R\u00e8gles'; rhythmMenuRulesButton.hidden = rhythmMenuShowingRules; }
    }

    function closeRhythmMenu() {
        rhythmMenuClosing = true;
        renderRhythmMenu();
        window.setTimeout(() => {
            rhythmMenuClosing = false;
            rhythmMenuVisible = false;
            rhythmMenuShowingRules = false;
            rhythmMenuEntering = false;
            rhythmMenuResult = null;
            renderRhythmMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealRhythmOutcomeMenu(title, text, eyebrow) {
        rhythmMenuVisible = true;
        rhythmMenuResult = { title, text, eyebrow };
        rhythmMenuShowingRules = false;
        rhythmMenuClosing = false;
        rhythmMenuEntering = true;
        if (rhythmHelpText) rhythmHelpText.textContent = text;
        renderRhythmMenu();
        window.setTimeout(() => { rhythmMenuEntering = false; renderRhythmMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function initializeRhythm() {
        stopRhythm();
        closeGameOverModal();
        rhythmNotes = [];
        rhythmScore = 0;
        rhythmStreak = 0;
        rhythmMisses = 0;
        rhythmBursts = [];
        rhythmStartedAt = 0;
        rhythmLastFrame = 0;
        rhythmSpawnTimer = 0;
        rhythmMenuResult = null;
        rhythmMenuShowingRules = false;
        rhythmMenuClosing = false;
        rhythmMenuEntering = false;
        rhythmHelpText.textContent = `Protège le navire avec ${RHYTHM_LANES.join(', ')}. Tiens jusqu'à la fin sans trop rater.`;
        rhythmStartButton.textContent = 'Lancer la cadence';
        updateRhythmHud();
        renderRhythmBoard();
        renderRhythmMenu();
    }

    function triggerRhythmBoardEffect(effectClass) {
        if (!rhythmBoard) {
            return;
        }

        rhythmBoard.classList.remove('is-hit-flash', 'is-miss-flash');
        void rhythmBoard.offsetWidth;
        rhythmBoard.classList.add(effectClass);

        if (rhythmBoardEffectTimeout) {
            window.clearTimeout(rhythmBoardEffectTimeout);
        }

        rhythmBoardEffectTimeout = window.setTimeout(() => {
            rhythmBoard.classList.remove('is-hit-flash', 'is-miss-flash');
            rhythmBoardEffectTimeout = null;
        }, 280);
    }

    function highlightRhythmPad(lane, state = 'active') {
        const pads = rhythmBoard.querySelectorAll('.rhythm-pad');
        pads.forEach((element) => element.classList.remove('is-active', 'is-success', 'is-fail'));
        const pad = rhythmBoard.querySelector(`[data-rhythm-lane="${lane}"]`);
        pad?.classList.add('is-active');
        if (state === 'success') {
            pad?.classList.add('is-success');
        } else if (state === 'fail') {
            pad?.classList.add('is-fail');
        }
        if (rhythmPadHighlightTimeout) {
            window.clearTimeout(rhythmPadHighlightTimeout);
        }
        rhythmPadHighlightTimeout = window.setTimeout(() => {
            rhythmBoard.querySelectorAll('.rhythm-pad').forEach((element) => element.classList.remove('is-active', 'is-success', 'is-fail'));
        }, 110);
    }

    function renderRhythmNotes() {
        const notesLayer = rhythmBoard.querySelector('.rhythm-notes');
        const feedbackLayer = rhythmBoard.querySelector('.rhythm-feedback');
        if (!notesLayer) {
            return;
        }

        notesLayer.innerHTML = rhythmNotes.map((note) => {
            const laneCenter = ((note.lane + 0.5) * 100) / RHYTHM_LANES.length;
            return `<div class="rhythm-note lane-${note.lane}" style="left:${laneCenter}%; top:${note.y}px"></div>`;
        }).join('');

        if (feedbackLayer) {
            feedbackLayer.innerHTML = rhythmBursts.map((burst) => {
                const laneCenter = ((burst.lane + 0.5) * 100) / RHYTHM_LANES.length;
                return `<div class="rhythm-burst ${burst.type}" style="left:${laneCenter}%; top:${burst.y}px">${burst.label}</div>`;
            }).join('');
        }
    }

    function finishRhythm(reason = 'time') {
        stopRhythm();
        rhythmHelpText.textContent = reason === 'misses'
            ? `La coque a trop souffert. Score ${rhythmScore}. Record ${rhythmBestScore}.`
            : `Traversée terminée. Score ${rhythmScore}. Record ${rhythmBestScore}.`;
        rhythmStartButton.textContent = 'Relancer la cadence';
        revealRhythmOutcomeMenu(
            reason === 'misses' ? 'Navire submergé' : 'Fin de cadence',
            `Score : ${rhythmScore}. Record : ${rhythmBestScore}.`,
            reason === 'misses' ? 'Coque noyée' : 'Marins fatigués'
        );
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

            const spawnInterval = Math.max(320, 620 - Math.min(220, rhythmScore * 1.4));
            if (rhythmSpawnTimer >= spawnInterval) {
                rhythmSpawnTimer = 0;
                rhythmNotes.push({
                    id: `${timestamp}-${Math.random()}`,
                    lane: Math.floor(Math.random() * RHYTHM_LANES.length),
                    y: RHYTHM_NOTE_START_Y
                });
            }

            rhythmNotes = rhythmNotes.filter((note) => {
                note.y += (delta * 0.31) + Math.min(0.16, rhythmScore * 0.0006 * delta);
                if (note.y > RHYTHM_MISS_Y) {
                    rhythmStreak = 0;
                    rhythmMisses += 1;
                    rhythmBursts.push({
                        id: `${note.id}-miss`,
                        lane: note.lane,
                        y: RHYTHM_BURST_Y,
                        label: 'RATE',
                        type: 'is-miss'
                    });
                    return false;
                }
                return true;
            });

            rhythmBursts = rhythmBursts.filter((burst) => {
                burst.y -= delta * 0.05;
                burst.life = (burst.life || 420) - delta;
                return burst.life > 0;
            });

            renderRhythmNotes();
            const timeRemaining = RHYTHM_DURATION_MS - (timestamp - rhythmStartedAt);
            updateRhythmHud(timeRemaining);

            if (rhythmScore > rhythmBestScore) {
                rhythmBestScore = rhythmScore;
                window.localStorage.setItem(RHYTHM_BEST_KEY, String(rhythmBestScore));
            }

            if (rhythmMisses >= RHYTHM_MAX_MISSES) {
                finishRhythm('misses');
                return;
            }

            if (timeRemaining <= 0) {
                finishRhythm('time');
                return;
            }

            rhythmAnimationFrame = window.requestAnimationFrame(step);
        };

        rhythmAnimationFrame = window.requestAnimationFrame(step);
    }

    function handleRhythmHit(lane) {
        if (!rhythmRunning) {
            highlightRhythmPad(lane, 'active');
            startRhythm();
            return;
        }

        const noteIndex = rhythmNotes.findIndex((note) => note.lane === lane && Math.abs(note.y - RHYTHM_HIT_Y) <= 44);

        if (noteIndex !== -1) {
            const note = rhythmNotes[noteIndex];
            const distance = Math.abs(note.y - RHYTHM_HIT_Y);
            rhythmNotes.splice(noteIndex, 1);
            rhythmStreak += 1;
            const isPerfect = distance <= 16;
            rhythmScore += (isPerfect ? 18 : 10) + (Math.min(rhythmStreak, 12) * 2);
            highlightRhythmPad(lane, 'success');
            triggerRhythmBoardEffect('is-hit-flash');
            rhythmBursts.push({
                id: `${note.id}-hit`,
                lane,
                y: RHYTHM_BURST_Y,
                label: isPerfect ? 'PARFAIT' : 'BIEN',
                type: isPerfect ? 'is-perfect' : 'is-good'
            });
            renderRhythmNotes();
        } else {
            rhythmStreak = 0;
            rhythmMisses += 1;
            highlightRhythmPad(lane, 'fail');
            triggerRhythmBoardEffect('is-miss-flash');
            rhythmBursts.push({
                id: `mistap-${performance.now()}`,
                lane,
                y: RHYTHM_BURST_Y,
                label: 'RATE',
                type: 'is-miss'
            });
        }

        if (rhythmMisses >= RHYTHM_MAX_MISSES) {
            updateRhythmHud(RHYTHM_DURATION_MS - (performance.now() - rhythmStartedAt));
            renderRhythmNotes();
            finishRhythm('misses');
            return;
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

    function getFlappyRulesText() {
        return "Appuie sur espace, clique ou tapote pour battre des ailes. Traverse entre les arches sans toucher le ciel, les obstacles ou l'eau.";
    }

    function renderFlappyMenu() {
        if (!flappyMenuOverlay || !flappyTable) {
            return;
        }

        syncGameMenuOverlayBounds(flappyMenuOverlay, flappyTable);
        flappyMenuOverlay.classList.toggle('hidden', !flappyMenuVisible);
        flappyMenuOverlay.classList.toggle('is-closing', flappyMenuClosing);
        flappyMenuOverlay.classList.toggle('is-entering', flappyMenuEntering);
        flappyTable.classList.toggle('is-menu-open', flappyMenuVisible);

        if (!flappyMenuVisible) {
            return;
        }

        const hasFlappyResult = Boolean(flappyMenuResultReason);

        if (flappyMenuEyebrow) {
            flappyMenuEyebrow.textContent = flappyMenuShowingRules ? 'R\u00e8gles' : (hasFlappyResult ? 'Fin de vol' : "Baie d'arcade");
        }
        if (flappyMenuTitle) {
            flappyMenuTitle.textContent = flappyMenuShowingRules
                ? 'Rappel rapide'
                : (flappyMenuResultReason === 'water'
                    ? "Tu t'es noyé"
                    : (flappyMenuResultReason === 'sky'
                        ? "C'est perdu"
                        : (flappyMenuResultReason === 'pipe'
                        ? "Tu t'es cogné contre une arche"
                        : (hasFlappyResult ? 'Partie perdue' : 'Baiely Bird'))));
        }
        if (flappyMenuText) {
            flappyMenuText.textContent = flappyMenuShowingRules
                ? getFlappyRulesText()
                : (flappyMenuResultReason === 'water'
                    ? `Ton oiseau a fini dans l'eau. Score ${flappyScore}. Record ${flappyBestScore}.`
                    : (flappyMenuResultReason === 'sky'
                        ? `Ton oiseau a perdu le contrôle en touchant le ciel. Score ${flappyScore}. Record ${flappyBestScore}.`
                        : (flappyMenuResultReason === 'pipe'
                        ? `Ton oiseau a touché une arche. Score ${flappyScore}. Record ${flappyBestScore}.`
                        : (hasFlappyResult
                            ? `Partie termin\u00e9e. Score ${flappyScore}. Record ${flappyBestScore}.`
                            : 'Prepare ton envol avant de battre des ailes entre les arches.'))));
        }
        if (flappyMenuActionButton) {
            flappyMenuActionButton.textContent = flappyMenuShowingRules
                ? 'Retour'
                : (hasFlappyResult ? 'Relancer la partie' : 'Lancer la partie');
        }
        if (flappyMenuRulesButton) {
            flappyMenuRulesButton.textContent = 'R\u00e8gles';
            flappyMenuRulesButton.hidden = flappyMenuShowingRules;
        }
    }

    function startFlappyLaunchSequence() {
        flappyMenuClosing = true;
        renderFlappyMenu();
        window.setTimeout(() => {
            flappyMenuClosing = false;
            flappyMenuVisible = false;
            flappyMenuShowingRules = false;
            flappyMenuEntering = false;
            flappyMenuResultReason = '';
            startFlappy(false);
            renderFlappyMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
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
        flappyScoreDisplay.textContent = '0';
        flappyBestDisplay.textContent = String(flappyBestScore);
        flappyMenuVisible = true;
        flappyMenuShowingRules = false;
        flappyMenuClosing = false;
        flappyMenuEntering = false;
        flappyMenuResultReason = '';
        renderFlappyMenu();
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
        flappyMenuResultReason = ['water', 'pipe', 'sky'].includes(reason) ? reason : 'other';
        flappyMenuShowingRules = false;
        flappyMenuClosing = false;
        flappyMenuEntering = true;
        flappyMenuVisible = true;
        renderFlappyMenu();
        window.setTimeout(() => {
            flappyMenuEntering = false;
            renderFlappyMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function flapFlappyBird() {
        if (flappyMenuVisible || flappyMenuClosing) {
            return;
        }

        if (!flappyRunning) {
            startFlappy();
            return;
        }

        flappyBirdVelocity = -5.2;
    }

    function startFlappy(shouldReset = true) {
        if (shouldReset) {
            initializeFlappy();
        }
        flappyRunning = true;
        flappyLastFrame = performance.now();
        flappySpawnTimer = 0;
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

            const spawnInterval = Math.max(FLAPPY_MIN_SPAWN_INTERVAL, FLAPPY_BASE_SPAWN_INTERVAL - (flappyScore * 20));

            if (flappySpawnTimer >= spawnInterval) {
                flappySpawnTimer = 0;
                const baseGapSize = Math.max(188, boardHeight * 0.385);
                const gapReduction = Math.min(78, flappyScore * 5.5);
                const gapSize = Math.max(118, baseGapSize - gapReduction);
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
            const pipeSpeed = Math.min(FLAPPY_MAX_PIPE_SPEED, FLAPPY_BASE_PIPE_SPEED + (flappyScore * 0.0024));
            flappyPipes.forEach((pipe) => {
                pipe.x -= delta * pipeSpeed;

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
            flappyBackdropOffset += delta * pipeSpeed;

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
                finishFlappy(hitWater ? 'water' : (hitSky ? 'sky' : 'pipe'), flappyBirdY + FLAPPY_BIRD_HEIGHT);
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
                    aria-label="${target ? 'Oursin à toucher' : "Case d'eau"}"
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
        revealAimOutcomeMenu(
            'Bordée terminée',
            `Tu as inscrit ${aimScore} touches avant la fin de la marée. Record : ${aimBestScore}.`,
            'Canon calé'
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

    function getAimRulesText() {
        return 'Clique chaque oursin qui appara\u00eet dans la baie avant qu\u2019il ne disparaisse. Un tir sur l\u2019eau t\u2019enl\u00e8ve des points. Choisis la dur\u00e9e de la bord\u00e9e (20 / 40 / 60 s) et marque le plus de touches avant la fin.';
    }

    function renderAimMenu() {
        if (!aimMenuOverlay || !aimTable) return;
        syncGameMenuOverlayBounds(aimMenuOverlay, aimTable);
        aimMenuOverlay.classList.toggle('hidden', !aimMenuVisible);
        aimMenuOverlay.classList.toggle('is-closing', aimMenuClosing);
        aimMenuOverlay.classList.toggle('is-entering', aimMenuEntering);
        aimTable.classList.toggle('is-menu-open', aimMenuVisible);
        if (!aimMenuVisible) return;
        const hasResult = Boolean(aimMenuResult);
        if (aimMenuEyebrow) aimMenuEyebrow.textContent = aimMenuShowingRules ? 'R\u00e8gles' : (hasResult ? aimMenuResult.eyebrow : 'Canon de bord');
        if (aimMenuTitle) aimMenuTitle.textContent = aimMenuShowingRules ? 'Rappel rapide' : (hasResult ? aimMenuResult.title : 'OursAim');
        if (aimMenuText) aimMenuText.textContent = aimMenuShowingRules ? getAimRulesText() : (hasResult ? aimMenuResult.text : 'Cinq oursins se cachent dans la baie. Touche-les au plus vite pour marquer, mais un tir dans l\u2019eau te co\u00fbte des points.');
        if (aimMenuActionButton) aimMenuActionButton.textContent = aimMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la bord\u00e9e' : 'Lancer la bord\u00e9e');
        if (aimMenuRulesButton) { aimMenuRulesButton.textContent = 'R\u00e8gles'; aimMenuRulesButton.hidden = aimMenuShowingRules; }
    }

    function closeAimMenu() {
        aimMenuClosing = true;
        renderAimMenu();
        window.setTimeout(() => {
            aimMenuClosing = false;
            aimMenuVisible = false;
            aimMenuShowingRules = false;
            aimMenuEntering = false;
            aimMenuResult = null;
            renderAimMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealAimOutcomeMenu(title, text, eyebrow) {
        aimMenuVisible = true;
        aimMenuResult = { title, text, eyebrow };
        aimMenuShowingRules = false;
        aimMenuClosing = false;
        aimMenuEntering = true;
        renderAimMenu();
        window.setTimeout(() => { aimMenuEntering = false; renderAimMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
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
        aimMenuResult = null;
        aimMenuShowingRules = false;
        aimMenuClosing = false;
        aimMenuEntering = false;
        aimBoard.classList.remove('is-rumbling', 'is-splashing');
        createAimTargets();
        updateAimHud();
        renderAimBoard();
        renderAimMenu();
    }

    function setAimRoundDuration(seconds) {
        if (![20, 40, 60].includes(seconds) || aimRoundSeconds === seconds) {
            return;
        }

        aimRoundSeconds = seconds;
        initializeAim();
    }

    function isMultiplayerPongActive() {
        return multiplayerActiveRoom?.gameId === 'pong' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function getMultiplayerPongRole() {
        return multiplayerActiveRoom?.players?.find((player) => player.isYou)?.symbol || null;
    }

    function getMultiplayerPongInputDirection() {
        const upPressed = pongKeys.has('z') || pongKeys.has('Z') || pongKeys.has('ArrowUp');
        const downPressed = pongKeys.has('s') || pongKeys.has('S') || pongKeys.has('ArrowDown');

        if (upPressed && !downPressed) {
            return -1;
        }

        if (downPressed && !upPressed) {
            return 1;
        }

        return 0;
    }

    function getPongRulesText() {
        return 'Déplace ta raquette avec Z et S ou avec les flèches. Renvoie la balle sans la laisser filer et marque 7 points pour gagner le duel.';
    }

    function getPongMenuOutcomeContent() {
        if (isMultiplayerPongActive()) {
            const gameState = multiplayerActiveRoom?.gameState;
            if (!gameState?.finished) {
                return null;
            }

            return gameState.winner === getMultiplayerPongRole()
                ? {
                    eyebrow: 'Victoire',
                    title: 'Tu remportes le duel',
                    text: 'Belle trajectoire. Remets-toi en selle pour une nouvelle manche.'
                }
                : {
                    eyebrow: 'D\u00e9faite',
                    title: "C'est perdu",
                    text: "L'adversaire remporte le duel. Tu peux patienter ou relancer si tu es l'hôte."
                };
        }

        if (!pongMenuResult) {
            return null;
        }

        if (pongMode === 'duo') {
            return pongMenuResult === 'left'
                ? {
                    eyebrow: 'Fin de duel',
                    title: 'Joueur 1 gagne',
                    text: 'La balle échappe au joueur 2. Relance une manche quand vous voulez.'
                }
                : {
                    eyebrow: 'Fin de duel',
                    title: 'Joueur 2 gagne',
                    text: 'La balle échappe au joueur 1. Relance une manche quand vous voulez.'
                };
        }

        return pongMenuResult === 'win'
            ? {
                eyebrow: 'Victoire',
                title: 'Tu remportes le duel',
                text: 'Belle série. Relance une partie ou relis les règles avant de repartir.'
            }
            : {
                eyebrow: 'D\u00e9faite',
                title: "C'est perdu",
                text: 'L autre rive t echappe cette fois. Relance une partie pour retenter ta chance.'
            };
    }

    function renderPongMenu() {
        if (!pongMenuOverlay || !pongTable) {
            return;
        }

        syncGameMenuOverlayBounds(pongMenuOverlay, pongTable);
        const isOnline = multiplayerActiveRoom?.gameId === 'pong';
        const gameState = multiplayerActiveRoom?.gameState || null;
        const countdownActive = Boolean(gameState?.countdownEndsAt && Number(gameState.countdownEndsAt) > Date.now());
        const roomStarted = Boolean(gameState?.running || countdownActive);
        const roomFinished = Boolean(gameState?.finished);
        const waitingForReady = isOnline && !multiplayerActiveRoom?.gameLaunched;
        const hasEnoughPlayers = Number(multiplayerActiveRoom?.playerCount || 0) >= 2;
        const outcomeContent = getPongMenuOutcomeContent();
        const hasResult = Boolean(outcomeContent);
        const actionLabel = waitingForReady
            ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
            : (isOnline
                ? (roomFinished ? 'Relancer le duel' : 'Lancer le duel')
                : (hasResult ? 'Relancer le duel' : 'Lancer le duel'));
        const baseText = waitingForReady
            ? 'Quand tous les joueurs sont pr\u00eats, toute la room bascule automatiquement sur le terrain.'
            : (isOnline
                ? 'Quand le duel se lance, toute la room bascule sur le terrain.'
                : 'Choisis ton mode, puis lance le duel dans la baie.');

        pongMenuVisible = isOnline ? (!roomStarted || roomFinished) : pongMenuVisible;

        pongMenuOverlay.classList.toggle('hidden', !pongMenuVisible);
        pongMenuOverlay.classList.toggle('is-closing', pongMenuClosing);
        pongMenuOverlay.classList.toggle('is-entering', pongMenuEntering);
        pongTable.classList.toggle('is-menu-open', pongMenuVisible);

        if (!pongMenuVisible) {
            return;
        }

        if (pongMenuEyebrow) {
            pongMenuEyebrow.textContent = pongMenuShowingRules ? 'R\u00e8gles' : (outcomeContent?.eyebrow || "Baie d'arcade");
        }
        if (pongMenuTitle) {
            pongMenuTitle.textContent = pongMenuShowingRules ? 'Rappel rapide' : (outcomeContent?.title || 'Pong');
        }
        if (pongMenuText) {
            pongMenuText.textContent = pongMenuShowingRules ? getPongRulesText() : (outcomeContent?.text || baseText);
        }
        if (pongMenuActionButton) {
            pongMenuActionButton.textContent = pongMenuShowingRules ? 'Retour' : actionLabel;
            pongMenuActionButton.disabled = pongMenuShowingRules
                ? false
                : (waitingForReady ? false : (isOnline ? !hasEnoughPlayers : false));
        }
        if (pongMenuRulesButton) {
            pongMenuRulesButton.textContent = 'R\u00e8gles';
            pongMenuRulesButton.hidden = pongMenuShowingRules;
        }
    }

    function startPongLaunchSequence(onComplete = null) {
        pongMenuClosing = true;
        renderPongMenu();
        window.setTimeout(() => {
            pongMenuClosing = false;
            pongMenuVisible = false;
            pongMenuShowingRules = false;
            pongMenuEntering = false;
            renderPongMenu();
            onComplete?.();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealPongOutcomeMenuWithDelay() {
        pongMenuVisible = false;
        pongMenuShowingRules = false;
        pongMenuClosing = false;
        pongMenuEntering = false;
        renderPongMenu();

        window.setTimeout(() => {
            pongMenuVisible = true;
            pongMenuShowingRules = false;
            pongMenuClosing = false;
            pongMenuEntering = true;
            renderPongMenu();

            window.setTimeout(() => {
                pongMenuEntering = false;
                renderPongMenu();
            }, UNO_MENU_CLOSE_DURATION_MS);
        }, 420);
    }

    function pushMultiplayerPongInput() {
        if (!isMultiplayerPongActive() || !multiplayerSocket?.connected) {
            return;
        }

        const nextDirection = getMultiplayerPongInputDirection();
        if (nextDirection === pongMultiplayerInputDirection) {
            return;
        }

        pongMultiplayerInputDirection = nextDirection;
        multiplayerSocket.emit('pong:input', { direction: nextDirection });
    }

    function syncMultiplayerPongState() {
        if (!isMultiplayerPongActive()) {
            pongLastFinishedStateKey = '';
            pongMultiplayerInputDirection = 0;
            pongCountdownEndsAt = 0;
            pongDisplayState = null;
            pongLocalPredictedPaddleY = null;
            pongRenderLastFrame = 0;
            return;
        }

        if (pongAnimationFrame) {
            window.cancelAnimationFrame(pongAnimationFrame);
            pongAnimationFrame = null;
        }
        pongRunning = false;
        pongPaused = false;
        pongLastFrame = 0;
        clearPongCountdownTimers();
        closeGameOverModal();

        const nextState = multiplayerActiveRoom.gameState;
        pongLastNetworkSyncAt = Date.now();
        pongState = {
            boardWidth: Number(nextState.boardWidth || (pongBoard?.clientWidth || 700)),
            boardHeight: Number(nextState.boardHeight || (pongBoard?.clientHeight || 394)),
            paddleHeight: Number(nextState.paddleHeight || 104),
            paddleWidth: Number(nextState.paddleWidth || 24),
            paddleOffset: Number(nextState.paddleOffset || 22),
            ballSize: Number(nextState.ballSize || 16),
            playerY: Number(nextState.leftY || 0),
            aiY: Number(nextState.rightY || 0),
            aiTargetY: Number(nextState.rightY || 0),
            playerSpeed: 380,
            aiSpeed: 380,
            ballX: Number(nextState.ballX || 0),
            ballY: Number(nextState.ballY || 0),
            ballVelocityX: Number(nextState.ballVelocityX || 0),
            ballVelocityY: Number(nextState.ballVelocityY || 0),
            countdownActive: Boolean(nextState.countdownEndsAt && nextState.countdownEndsAt > Date.now()),
            round: Number(nextState.round || 0)
        };
        const shouldSnapDisplay = !pongDisplayState
            || pongDisplayState.round !== pongState.round
            || Math.abs(pongDisplayState.ballX - pongState.ballX) > 140
            || Math.abs(pongDisplayState.ballY - pongState.ballY) > 120;
        const role = getMultiplayerPongRole();

        if (shouldSnapDisplay) {
            pongDisplayState = { ...pongState };
            pongLocalPredictedPaddleY = role === 'right' ? pongState.aiY : pongState.playerY;
        } else {
            pongDisplayState = {
                ...pongDisplayState,
                boardWidth: pongState.boardWidth,
                boardHeight: pongState.boardHeight,
                paddleHeight: pongState.paddleHeight,
                paddleWidth: pongState.paddleWidth,
                paddleOffset: pongState.paddleOffset,
                ballSize: pongState.ballSize,
                round: pongState.round
            };

            if (pongLocalPredictedPaddleY === null) {
                pongLocalPredictedPaddleY = role === 'right' ? pongState.aiY : pongState.playerY;
            }
        }

        pongPlayerScore = Number(nextState.leftScore || 0);
        pongAiScore = Number(nextState.rightScore || 0);
        pongRunning = Boolean(nextState.running);
        pongPaused = false;
        pongCountdownEndsAt = Number(nextState.countdownEndsAt || 0);

        if (!pongState.countdownActive) {
            hidePongCountdown();
        }

        updatePongHud();
        renderPong();
        ensureMultiplayerPongRenderLoop();
        pushMultiplayerPongInput();

        if (!nextState.finished) {
            pongLastFinishedStateKey = '';
            return;
        }

        const finishedStateKey = `${nextState.round}:${nextState.winner || 'none'}`;
        if (finishedStateKey === pongLastFinishedStateKey || activeGameTab !== 'pong') {
            return;
        }

        pongLastFinishedStateKey = finishedStateKey;
        revealPongOutcomeMenuWithDelay();
    }

    function updatePongHud() {
        pongPlayerScoreDisplay.textContent = String(pongPlayerScore);
        pongAiScoreDisplay.textContent = String(pongAiScore);
        if (isMultiplayerPongActive()) {
            const currentRole = getMultiplayerPongRole();
            pongLeftLabel.textContent = currentRole === 'left' ? 'Toi' : 'Adversaire';
            pongRightLabel.textContent = currentRole === 'right' ? 'Toi' : 'Adversaire';
            if (multiplayerActiveRoom?.playerCount < 2) {
                pongHelpText.innerHTML = 'Salon en attente. Il faut deux joueurs pour lancer le duel.';
            } else if (multiplayerActiveRoom?.gameState?.finished) {
                pongHelpText.innerHTML = multiplayerActiveRoom.gameState.winner === currentRole
                    ? "Victoire. Clique sur le bouton central si tu es l'hôte pour relancer."
                    : "D\u00e9faite. Attends que l'h\u00f4te relance un nouveau duel.";
            } else if (multiplayerActiveRoom?.gameState?.running) {
                pongHelpText.innerHTML = 'Utilise Z/S ou les flèches pour déplacer ta raquette. Premier à 7.';
            } else {
                pongHelpText.innerHTML = "Attends que l'hôte lance le duel de Pong.";
            }
            pongModeButtons.forEach((button) => {
                button.classList.remove('is-active');
                button.disabled = true;
            });
            renderPongMenu();
            return;
        }

        pongLeftLabel.textContent = pongMode === 'duo' ? 'Joueur 1' : 'Toi';
        pongRightLabel.textContent = pongMode === 'duo' ? 'Joueur 2' : 'IA';
        pongHelpText.innerHTML = pongMode === 'duo'
            ? 'Mode 2 joueurs: gauche avec Z/S, droite avec fl&egrave;ches haut/bas. Premier &agrave; 7.'
            : "Mode 1 joueur: Z/S ou fl&egrave;ches pour jouer contre l'IA. Premier &agrave; 7.";
        pongModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.pongMode === pongMode);
            button.disabled = false;
        });
        renderPongMenu();
    }

    function createPongRoundState() {
        const boardWidth = pongBoard.clientWidth || 700;
        const boardHeight = pongBoard.clientHeight || Math.round(boardWidth * 9 / 16);
        const paddleHeight = 104;
        const paddleWidth = 24;
        const ballSize = 20;
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
            aiSpeed: pongMode === 'duo' ? 380 : 312,
            ballX: (boardWidth - ballSize) / 2,
            ballY: (boardHeight - ballSize) / 2,
            ballVelocityX: PONG_SERVE_SPEED_X * serveDirection,
            ballVelocityY: PONG_SERVE_SPEED_Y * verticalDirection,
            countdownActive: true,
            aiDriftTimer: 0,
            serveBoostPending: true
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

    function getMultiplayerPongCountdownLabel() {
        const remainingMs = Math.max(0, pongCountdownEndsAt - Date.now());

        if (!remainingMs) {
            return null;
        }

        if (remainingMs > 1860) {
            return '3';
        }

        if (remainingMs > 1240) {
            return '2';
        }

        if (remainingMs > 620) {
            return '1';
        }

        return 'Partez';
    }

    function clampPongY(y, activeState = pongState) {
        if (!activeState) {
            return y;
        }

        return Math.max(0, Math.min(y, activeState.boardHeight - activeState.paddleHeight));
    }

    function ensureMultiplayerPongRenderLoop() {
        if (pongRenderAnimationFrame || !isMultiplayerPongActive()) {
            return;
        }

        const tick = (timestamp) => {
            pongRenderAnimationFrame = null;

            if (!isMultiplayerPongActive() || !pongState || !pongDisplayState) {
                pongRenderLastFrame = 0;
                return;
            }

            if (!pongRenderLastFrame) {
                pongRenderLastFrame = timestamp;
            }

            const delta = Math.min((timestamp - pongRenderLastFrame) / 1000, 0.05);
            pongRenderLastFrame = timestamp;
            const role = getMultiplayerPongRole();
            const inputDirection = getMultiplayerPongInputDirection();
            const paddleSmoothing = Math.min(1, delta * 22);
            const ownServerY = role === 'right' ? pongState.aiY : pongState.playerY;

            if (pongLocalPredictedPaddleY === null) {
                pongLocalPredictedPaddleY = ownServerY;
            }

            if (role === 'left') {
                pongLocalPredictedPaddleY = clampPongY(pongLocalPredictedPaddleY + (inputDirection * pongState.playerSpeed * delta));
                if (Math.abs(pongState.playerY - pongLocalPredictedPaddleY) > 6) {
                    pongLocalPredictedPaddleY = pongState.playerY;
                }
                if (inputDirection === 0) {
                    const catchupGap = pongState.playerY - pongLocalPredictedPaddleY;
                    pongLocalPredictedPaddleY += catchupGap * Math.min(1, delta * 16);
                }
                pongDisplayState.playerY = pongLocalPredictedPaddleY;
                pongDisplayState.aiY = Math.abs(pongState.aiY - pongDisplayState.aiY) > 6
                    ? pongState.aiY
                    : (pongDisplayState.aiY + ((pongState.aiY - pongDisplayState.aiY) * paddleSmoothing));
            } else if (role === 'right') {
                pongLocalPredictedPaddleY = clampPongY(pongLocalPredictedPaddleY + (inputDirection * pongState.playerSpeed * delta));
                if (Math.abs(pongState.aiY - pongLocalPredictedPaddleY) > 6) {
                    pongLocalPredictedPaddleY = pongState.aiY;
                }
                if (inputDirection === 0) {
                    const catchupGap = pongState.aiY - pongLocalPredictedPaddleY;
                    pongLocalPredictedPaddleY += catchupGap * Math.min(1, delta * 16);
                }
                pongDisplayState.aiY = pongLocalPredictedPaddleY;
                pongDisplayState.playerY = Math.abs(pongState.playerY - pongDisplayState.playerY) > 6
                    ? pongState.playerY
                    : (pongDisplayState.playerY + ((pongState.playerY - pongDisplayState.playerY) * paddleSmoothing));
            } else {
                pongDisplayState.playerY = Math.abs(pongState.playerY - pongDisplayState.playerY) > 6
                    ? pongState.playerY
                    : (pongDisplayState.playerY + ((pongState.playerY - pongDisplayState.playerY) * paddleSmoothing));
                pongDisplayState.aiY = Math.abs(pongState.aiY - pongDisplayState.aiY) > 6
                    ? pongState.aiY
                    : (pongDisplayState.aiY + ((pongState.aiY - pongDisplayState.aiY) * paddleSmoothing));
            }

            pongDisplayState.ballX = pongState.ballX;
            pongDisplayState.ballY = pongState.ballY;

            const countdownLabel = getMultiplayerPongCountdownLabel();
            if (countdownLabel) {
                showPongCountdownValue(countdownLabel);
            } else {
                hidePongCountdown();
            }

            renderPong();
            pongRenderAnimationFrame = window.requestAnimationFrame(tick);
        };

        pongRenderAnimationFrame = window.requestAnimationFrame(tick);
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
        const activePongState = isMultiplayerPongActive() && pongDisplayState ? pongDisplayState : pongState;

        if (!activePongState) {
            return;
        }

        if (!pongBoardMetrics
            || pongBoardMetrics.boardWidth !== activePongState.boardWidth
            || pongBoardMetrics.boardHeight !== activePongState.boardHeight) {
            const renderWidth = pongBoard.clientWidth || activePongState.boardWidth;
            const renderHeight = pongBoard.clientHeight || activePongState.boardHeight;
            pongBoardMetrics = {
                boardWidth: activePongState.boardWidth,
                boardHeight: activePongState.boardHeight,
                scaleX: renderWidth / activePongState.boardWidth,
                scaleY: renderHeight / activePongState.boardHeight
            };
        }

        const { scaleX, scaleY } = pongBoardMetrics;
        const leftX = activePongState.paddleOffset * scaleX;
        const rightX = (activePongState.boardWidth - activePongState.paddleOffset - activePongState.paddleWidth) * scaleX;
        const paddleWidth = `${activePongState.paddleWidth * scaleX}px`;
        const paddleHeight = `${activePongState.paddleHeight * scaleY}px`;
        const ballSize = `${activePongState.ballSize * scaleX}px`;

        if (!pongRenderMetrics
            || pongRenderMetrics.paddleWidth !== paddleWidth
            || pongRenderMetrics.paddleHeight !== paddleHeight
            || pongRenderMetrics.ballSize !== ballSize) {
            pongPlayerPaddle.style.width = paddleWidth;
            pongPlayerPaddle.style.height = paddleHeight;
            pongAiPaddle.style.width = paddleWidth;
            pongAiPaddle.style.height = paddleHeight;
            pongBall.style.width = ballSize;
            pongBall.style.height = ballSize;
            pongRenderMetrics = {
                paddleWidth,
                paddleHeight,
                ballSize
            };
        }

        pongPlayerPaddle.style.transform = `translate3d(${leftX.toFixed(2)}px, ${(activePongState.playerY * scaleY).toFixed(2)}px, 0)`;
        pongAiPaddle.style.transform = `translate3d(${rightX.toFixed(2)}px, ${(activePongState.aiY * scaleY).toFixed(2)}px, 0)`;
        pongBall.style.transform = `translate3d(${(activePongState.ballX * scaleX).toFixed(2)}px, ${(activePongState.ballY * scaleY).toFixed(2)}px, 0)`;
    }

    function getPongBounceVelocityY(impact) {
        const clampedImpact = Math.max(-1, Math.min(1, impact));
        const nextVelocityY = clampedImpact * 305;

        if (Math.abs(nextVelocityY) < 115) {
            return (clampedImpact >= 0 ? 1 : -1) * 115;
        }

        return nextVelocityY;
    }

    function getPongReturnVelocityX(currentVelocityX, serveBoostPending) {
        const nextSpeedX = serveBoostPending
            ? Math.max(Math.abs(currentVelocityX) + PONG_RALLY_SPEED_INCREMENT, PONG_FIRST_RETURN_SPEED_X)
            : (Math.abs(currentVelocityX) + PONG_RALLY_SPEED_INCREMENT);

        return Math.sign(currentVelocityX || 1) * nextSpeedX;
    }

    function getPongReturnVelocityY(impact, serveBoostPending) {
        const nextVelocityY = getPongBounceVelocityY(impact);
        return serveBoostPending ? (nextVelocityY * PONG_FIRST_RETURN_Y_MULTIPLIER) : nextVelocityY;
    }

    function updatePongStep(delta) {
        const leftDirection = (pongKeys.has('z') || pongKeys.has('Z') || (pongMode === 'solo' && pongKeys.has('ArrowUp')) ? -1 : 0)
            + (pongKeys.has('s') || pongKeys.has('S') || (pongMode === 'solo' && pongKeys.has('ArrowDown')) ? 1 : 0);

        pongState.playerY += leftDirection * pongState.playerSpeed * delta;
        pongState.playerY = Math.max(0, Math.min(pongState.playerY, pongState.boardHeight - pongState.paddleHeight));

        if (pongMode === 'duo') {
            const rightDirection = (pongKeys.has('ArrowUp') ? -1 : 0) + (pongKeys.has('ArrowDown') ? 1 : 0);
            pongState.aiY += rightDirection * pongState.playerSpeed * delta;
        } else {
            const ballCenter = pongState.ballY + (pongState.ballSize / 2);
            const approachingAi = pongState.ballVelocityX > 0;
            const anticipationTime = approachingAi ? 0.085 : 0.03;
            const anticipatedCenter = ballCenter + (pongState.ballVelocityY * anticipationTime);
            const desiredAiY = approachingAi
                ? Math.max(
                    0,
                    Math.min(
                        anticipatedCenter - (pongState.paddleHeight / 2),
                        pongState.boardHeight - pongState.paddleHeight
                    )
                )
                : ((pongState.boardHeight - pongState.paddleHeight) / 2);
            pongState.aiTargetY += (desiredAiY - pongState.aiTargetY) * Math.min(1, delta * (approachingAi ? 7.5 : 4.5));
            const targetDelta = pongState.aiTargetY - pongState.aiY;
            const maxStep = pongState.aiSpeed * delta * (approachingAi ? 1 : 0.72);
            pongState.aiY += Math.max(-maxStep, Math.min(maxStep, targetDelta));
        }
        pongState.aiY = Math.max(0, Math.min(pongState.aiY, pongState.boardHeight - pongState.paddleHeight));

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
            const serveBoostPending = pongState.serveBoostPending;
            pongState.ballX = playerPaddleX + pongState.paddleWidth;
            pongState.ballVelocityX = Math.abs(getPongReturnVelocityX(pongState.ballVelocityX, serveBoostPending));
            pongState.ballVelocityY = getPongReturnVelocityY(impact, serveBoostPending);
            pongState.serveBoostPending = false;
        }

        const hitsAi = pongState.ballX + pongState.ballSize >= aiPaddleX
            && pongState.ballX <= aiPaddleX + pongState.paddleWidth
            && pongState.ballY + pongState.ballSize >= pongState.aiY
            && pongState.ballY <= pongState.aiY + pongState.paddleHeight
            && pongState.ballVelocityX > 0;

        if (hitsAi) {
            const impact = ((pongState.ballY + (pongState.ballSize / 2)) - (pongState.aiY + (pongState.paddleHeight / 2))) / (pongState.paddleHeight / 2);
            const serveBoostPending = pongState.serveBoostPending;
            pongState.ballX = aiPaddleX - pongState.ballSize;
            pongState.ballVelocityX = -Math.abs(getPongReturnVelocityX(pongState.ballVelocityX, serveBoostPending));
            pongState.ballVelocityY = getPongReturnVelocityY(impact, serveBoostPending);
            pongState.serveBoostPending = false;
        }

        if (pongState.ballX + pongState.ballSize < 0) {
            scorePongPoint(false);
            return true;
        }

        if (pongState.ballX > pongState.boardWidth) {
            scorePongPoint(true);
            return true;
        }

        return false;
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

        if (pongRenderAnimationFrame) {
            window.cancelAnimationFrame(pongRenderAnimationFrame);
            pongRenderAnimationFrame = null;
        }

        hidePongCountdown();
        pongRunning = false;
        pongPaused = false;
        pongLastFrame = 0;
        pongRenderLastFrame = 0;
        pongBoardMetrics = null;
        pongRenderMetrics = null;
        pongDisplayState = null;
        pongLocalPredictedPaddleY = null;
        pongLastNetworkSyncAt = 0;
        pongCountdownEndsAt = 0;
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
            playerWon ? 'Victoire' : "C'est perdu",
            playerWon ? "Le duel est gagné. La baie t'acclame." : "L'IA remporte la manche. Le courant t'échappe."
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
        pongMenuResult = pongMode === 'duo' ? (playerWon ? 'left' : 'right') : (playerWon ? 'win' : 'loss');
        revealPongOutcomeMenuWithDelay();
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

        if (pongState.countdownActive) {
            renderPong();
            if (pongRunning) {
                pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
            }
            return;
        }

        let remainingDelta = delta;

        while (remainingDelta > 0 && pongRunning && pongState && !pongState.countdownActive) {
            const stepDelta = Math.min(remainingDelta, PONG_MAX_STEP_SECONDS);
            const pointScored = updatePongStep(stepDelta);
            remainingDelta -= stepDelta;

            if (pointScored) {
                break;
            }
        }

        renderPong();

        if (pongRunning) {
            pongAnimationFrame = window.requestAnimationFrame(updatePongFrame);
        }
    }

    function initializePong() {
        if (isMultiplayerPongActive()) {
            pongMenuResult = null;
            syncMultiplayerPongState();
            return;
        }

        stopPong();
        resetPongMatch();
        pongMenuResult = null;
        pongMenuVisible = true;
        pongMenuShowingRules = false;
        pongMenuClosing = false;
        pongMenuEntering = false;
        renderPongMenu();
    }

    function setPongMode(nextMode) {
        if (isMultiplayerPongActive()) {
            setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
            return;
        }

        if (!['solo', 'duo'].includes(nextMode)) {
            return;
        }

        pongMode = nextMode;
        initializePong();
    }

    function startPong() {
        if (isMultiplayerPongActive()) {
            if (!multiplayerSocket?.connected) {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }

            if (!getCurrentMultiplayerPlayer()?.isHost) {
                setMultiplayerStatus("Seul l'hôte peut lancer le duel.");
                return;
            }

            multiplayerSocket.emit('pong:start');
            setMultiplayerStatus('Le duel de Pong se prepare pour tout le salon.');
            return;
        }

        closeGameOverModal();
        pongKeys.clear();
        pongLastNetworkSyncAt = 0;
        pongMenuResult = null;
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

        sudokuTimerStarted = false;
    }

    function startSudokuTimer() {
        stopSudokuTimer();
        sudokuTimerStarted = true;
        sudokuTimerInterval = window.setInterval(() => {
            sudokuElapsedSeconds += 1;
            refreshSudokuHud();
        }, 1000);
    }

    function getSudokuDefaultHelpText() {
        return 'Clique une case vide puis tape de 1 à 9. Suppr ou retour arrière pour effacer.';
    }

    function clearSudokuStatusMessage() {
        if (sudokuStatusTimeout) {
            window.clearTimeout(sudokuStatusTimeout);
            sudokuStatusTimeout = null;
        }
    }

    function setSudokuStatusMessage(message, durationMs = 1200) {
        if (!sudokuHelpText) {
            return;
        }

        clearSudokuStatusMessage();
        sudokuHelpText.textContent = message;

        if (durationMs <= 0 || sudokuSolved || sudokuFailed) {
            return;
        }

        sudokuStatusTimeout = window.setTimeout(() => {
            sudokuStatusTimeout = null;
            if (!sudokuSolved && !sudokuFailed && sudokuHelpText) {
                sudokuHelpText.textContent = getSudokuDefaultHelpText();
            }
        }, durationMs);
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
            Moussaillon: 10,
            Pirate: 14,
            Capitaine: 18
        };

        return scoreByDifficulty[sudokuPuzzle?.difficulty] || 10;
    }

    function getSudokuRulesText() {
        return "Chaque ligne, chaque colonne et chaque carré de 3 par 3 doit contenir les chiffres de 1 à 9 une seule fois. Clique une case vide puis tape un chiffre. Trois erreurs et la traversée s'arrête.";
    }

    function renderSudokuMenu() {
        if (!sudokuMenuOverlay || !sudokuTable) {
            return;
        }

        syncGameMenuOverlayBounds(sudokuMenuOverlay, sudokuTable);
        sudokuMenuOverlay.classList.toggle('hidden', !sudokuMenuVisible);
        sudokuMenuOverlay.classList.toggle('is-closing', sudokuMenuClosing);
        sudokuMenuOverlay.classList.toggle('is-entering', sudokuMenuEntering);
        sudokuTable.classList.toggle('is-menu-open', sudokuMenuVisible);

        if (!sudokuMenuVisible) {
            return;
        }

        const hasResult = Boolean(sudokuMenuResult);

        if (sudokuMenuEyebrow) {
            sudokuMenuEyebrow.textContent = sudokuMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? sudokuMenuResult.eyebrow : 'Carte de navigation');
        }

        if (sudokuMenuTitle) {
            sudokuMenuTitle.textContent = sudokuMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? sudokuMenuResult.title : 'Sudoku');
        }

        if (sudokuMenuText) {
            sudokuMenuText.textContent = sudokuMenuShowingRules
                ? getSudokuRulesText()
                : (hasResult
                    ? sudokuMenuResult.text
                    : 'Compl\u00e8te la carte sans r\u00e9p\u00e9ter de chiffre sur une ligne, une colonne ou un carr\u00e9 de 3 par 3.');
        }

        if (sudokuMenuActionButton) {
            sudokuMenuActionButton.textContent = sudokuMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
        }

        if (sudokuMenuRulesButton) {
            sudokuMenuRulesButton.textContent = 'R\u00e8gles';
            sudokuMenuRulesButton.hidden = sudokuMenuShowingRules;
        }
    }

    function closeSudokuMenu() {
        sudokuMenuClosing = true;
        renderSudokuMenu();
        window.setTimeout(() => {
            sudokuMenuClosing = false;
            sudokuMenuVisible = false;
            sudokuMenuShowingRules = false;
            sudokuMenuEntering = false;
            sudokuMenuResult = null;
            renderSudokuMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealSudokuOutcomeMenu(title, text, eyebrow) {
        sudokuMenuVisible = true;
        sudokuMenuResult = { title, text, eyebrow };
        sudokuMenuShowingRules = false;
        sudokuMenuClosing = false;
        sudokuMenuEntering = true;

        if (sudokuHelpText) {
            sudokuHelpText.textContent = text;
        }

        renderSudokuMenu();
        window.setTimeout(() => {
            sudokuMenuEntering = false;
            renderSudokuMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
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
        const difficultyConfig = SUDOKU_DIFFICULTIES[sudokuDifficultyIndex] || SUDOKU_DIFFICULTIES[0];
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
        sudokuMistakesDisplay.textContent = `${sudokuMistakes} / 3`;
        sudokuTimerDisplay.textContent = `${sudokuElapsedSeconds}s`;
        if (sudokuDifficultyButton) {
            sudokuDifficultyButton.textContent = `Difficulte : ${sudokuPuzzle?.difficulty || SUDOKU_DIFFICULTIES[sudokuDifficultyIndex]?.difficulty || 'Moussaillon'}`;
        }
        sudokuRestartButton.textContent = sudokuSolved ? 'Nouvelle grille' : 'Nouvelle grille';
    }

    function refreshSudokuHud() {
        sudokuFilledDisplay.textContent = String(sudokuScore);
        sudokuMistakesDisplay.textContent = `${sudokuMistakes} / 3`;
        sudokuTimerDisplay.textContent = `${sudokuElapsedSeconds}s`;
        if (sudokuDifficultyButton) {
            sudokuDifficultyButton.textContent = `Difficulte : ${sudokuPuzzle?.difficulty || SUDOKU_DIFFICULTIES[sudokuDifficultyIndex]?.difficulty || 'Moussaillon'}`;
        }
        sudokuRestartButton.textContent = 'Nouvelle grille';
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

    function initializeSudoku(startTimerImmediately = false) {
        closeGameOverModal();
        stopSudokuTimer();
        clearSudokuFeedback(false);
        clearSudokuStatusMessage();
        sudokuMenuResult = null;
        sudokuMenuShowingRules = false;
        sudokuMenuClosing = false;
        sudokuMenuEntering = false;
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
        if (sudokuHelpText) {
            sudokuHelpText.textContent = getSudokuDefaultHelpText();
        }
        renderSudoku();
        renderSudokuMenu();
        if (startTimerImmediately) {
            startSudokuTimer();
        }
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
            setSudokuStatusMessage('Mauvais chiffre');
            renderSudoku();

            if (sudokuMistakes >= 3) {
                sudokuFailed = true;
                stopSudokuTimer();
                revealSudokuOutcomeMenu(
                    'Carte égarée',
                    "Trois erreurs. Le navire s'est perdu dans le brouillard.",
                    'Cap manqué'
                );
            }

            return;
        }

        if (sudokuBoardState[row][col] === nextValue) {
            return;
        }

        sudokuBoardState[row][col] = nextValue;
        sudokuCombo += 1;
        const gainedPoints = calculateSudokuPoints();
        sudokuScore += gainedPoints;
        sudokuSolved = isSudokuSolved();
        setSudokuFeedback(row, col, 'correct');
        setSudokuStatusMessage(
            sudokuCombo > 1 ? `+${gainedPoints} â€¢ x${sudokuCombo}` : `+${gainedPoints}`
        );

        if (sudokuSolved) {
            stopSudokuTimer();
            revealSudokuOutcomeMenu(
                'Carte complète',
                `Grille résolue. Cap ${sudokuPuzzle?.difficulty || 'Moussaillon'} terminé en ${sudokuElapsedSeconds}s.`,
                'Route tracée'
            );
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

    function get2048RulesText() {
        return 'Flèches ou ZQSD pour faire glisser toutes les tuiles. Quand deux valeurs identiques se rencontrent, elles fusionnent. Atteins 2048 et évite de bloquer toute la grille.';
    }

    function render2048Menu() {
        if (!game2048MenuOverlay || !game2048Table) {
            return;
        }

        syncGameMenuOverlayBounds(game2048MenuOverlay, game2048Table);
        game2048MenuOverlay.classList.toggle('hidden', !game2048MenuVisible);
        game2048MenuOverlay.classList.toggle('is-closing', game2048MenuClosing);
        game2048Table.classList.toggle('is-menu-open', game2048MenuVisible);

        if (!game2048MenuVisible) {
            return;
        }

        const hasResult = Boolean(game2048MenuResult);

        if (game2048MenuEyebrow) {
            game2048MenuEyebrow.textContent = game2048MenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? 'Maree bloqu\u00e9e' : 'Baie d arcade');
        }

        if (game2048MenuTitle) {
            game2048MenuTitle.textContent = game2048MenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? "C'est perdu" : '2048');
        }

        if (game2048MenuText) {
            game2048MenuText.textContent = game2048MenuShowingRules
                ? get2048RulesText()
                : (hasResult
                    ? `La mar\u00e9e t'a bloqu\u00e9. Score ${game2048Score}. Record ${game2048BestScore}. Relance une nouvelle mar\u00e9e.`
                    : 'Fais glisser les tuiles pour fusionner les valeurs et atteindre 2048 sans bloqu\u00e9r la grille.');
        }

        if (game2048MenuActionButton) {
            game2048MenuActionButton.textContent = game2048MenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
        }

        if (game2048MenuRulesButton) {
            game2048MenuRulesButton.textContent = 'R\u00e8gles';
            game2048MenuRulesButton.hidden = game2048MenuShowingRules;
        }
    }

    function close2048Menu() {
        game2048MenuClosing = true;
        render2048Menu();
        window.setTimeout(() => {
            game2048MenuClosing = false;
            game2048MenuVisible = false;
            game2048MenuShowingRules = false;
            game2048MenuResult = false;
            render2048Menu();
        }, 220);
    }

    function reveal2048OutcomeMenu() {
        game2048MenuVisible = true;
        game2048MenuResult = true;
        game2048MenuShowingRules = false;
        game2048MenuClosing = false;
        render2048Menu();
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
        closeGameOverModal();
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
        game2048MenuVisible = true;
        game2048MenuShowingRules = false;
        game2048MenuClosing = false;
        game2048MenuResult = false;
        render2048Menu();
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
        if (game2048MenuVisible || activeGameTab !== '2048') {
            return;
        }

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
                openGameOverModal("C'est perdu", "La marée t'a bloqué. Plus aucun coup possible.");
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

    function getMinesweeperRulesText() {
        return "Clique sur une case pour révéler le récif. Les chiffres indiquent combien de mines touchent la case. Clique droit pour poser un drapeau et ouvre toutes les cases sûres pour gagner.";
    }

    function renderMinesweeperMenu() {
        if (!minesweeperMenuOverlay || !minesweeperTable) {
            return;
        }

        syncGameMenuOverlayBounds(minesweeperMenuOverlay, minesweeperTable);
        minesweeperMenuOverlay.classList.toggle('hidden', !minesweeperMenuVisible);
        minesweeperMenuOverlay.classList.toggle('is-closing', minesweeperMenuClosing);
        minesweeperMenuOverlay.classList.toggle('is-entering', minesweeperMenuEntering);
        minesweeperTable.classList.toggle('is-menu-open', minesweeperMenuVisible);

        if (!minesweeperMenuVisible) {
            return;
        }

        const hasResult = Boolean(minesweeperMenuResult);

        if (minesweeperMenuEyebrow) {
            minesweeperMenuEyebrow.textContent = minesweeperMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? minesweeperMenuResult.eyebrow : 'Champ de mines du r\u00e9cif');
        }

        if (minesweeperMenuTitle) {
            minesweeperMenuTitle.textContent = minesweeperMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? minesweeperMenuResult.title : 'D\u00e9mineur');
        }

        if (minesweeperMenuText) {
            minesweeperMenuText.textContent = minesweeperMenuShowingRules
                ? getMinesweeperRulesText()
                : (hasResult
                    ? minesweeperMenuResult.text
                    : 'Rep\u00e8re les zones s\u00fbres du r\u00e9cif, pose tes drapeaux et traverse sans toucher une mine.');
        }

        if (minesweeperMenuActionButton) {
            minesweeperMenuActionButton.textContent = minesweeperMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
        }

        if (minesweeperMenuRulesButton) {
            minesweeperMenuRulesButton.textContent = 'R\u00e8gles';
            minesweeperMenuRulesButton.hidden = minesweeperMenuShowingRules;
        }
    }

    function closeMinesweeperMenu() {
        minesweeperMenuClosing = true;
        renderMinesweeperMenu();
        window.setTimeout(() => {
            minesweeperMenuClosing = false;
            minesweeperMenuVisible = false;
            minesweeperMenuShowingRules = false;
            minesweeperMenuEntering = false;
            minesweeperMenuResult = null;
            renderMinesweeperMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealMinesweeperOutcomeMenu(title, text, eyebrow) {
        minesweeperMenuVisible = true;
        minesweeperMenuResult = { title, text, eyebrow };
        minesweeperMenuShowingRules = false;
        minesweeperMenuClosing = false;
        minesweeperMenuEntering = true;

        if (minesweeperHelpText) {
            minesweeperHelpText.textContent = text;
        }

        renderMinesweeperMenu();
        window.setTimeout(() => {
            minesweeperMenuEntering = false;
            renderMinesweeperMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function updateFace(label) {
        restartGameButton.textContent = label;
    }

    function updateRestartButtonLabel() {
        updateFace(gameStarted ? 'Changer de cap' : 'Aller en mer');
    }

    function openGameOverModal(title = "C'est perdu", text = "Le joueur s'est noyé.") {
        if (activeGameTab === '2048') {
            reveal2048OutcomeMenu();
            return;
        }

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

    function getSnakeRulesText() {
        return 'Utilise les flèches ou ZQSD pour tourner. Chaque lanterne ramassée allonge le serpent. Évite les bords et ta propre queue pour garder le cap.';
    }

    function renderSnakeMenu() {
        if (!snakeMenuOverlay || !snakeTable) {
            return;
        }

        syncGameMenuOverlayBounds(snakeMenuOverlay, snakeTable);
        snakeMenuOverlay.classList.toggle('hidden', !snakeMenuVisible);
        snakeMenuOverlay.classList.toggle('is-closing', snakeMenuClosing);
        snakeMenuOverlay.classList.toggle('is-entering', snakeMenuEntering);
        snakeTable.classList.toggle('is-menu-open', snakeMenuVisible);

        if (!snakeMenuVisible) {
            return;
        }

        const hasResult = Boolean(snakeMenuResult);

        if (snakeMenuEyebrow) {
            snakeMenuEyebrow.textContent = snakeMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? snakeMenuResult.eyebrow : 'Serpent de mer');
        }

        if (snakeMenuTitle) {
            snakeMenuTitle.textContent = snakeMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? snakeMenuResult.title : 'Snake');
        }

        if (snakeMenuText) {
            snakeMenuText.textContent = snakeMenuShowingRules
                ? getSnakeRulesText()
                : (hasResult
                    ? snakeMenuResult.text
                    : 'Glisse entre les courants, ramasse les lanternes et allonge ton serpent sans heurter la coque.');
        }

        if (snakeMenuActionButton) {
            snakeMenuActionButton.textContent = snakeMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
        }

        if (snakeMenuRulesButton) {
            snakeMenuRulesButton.textContent = 'R\u00e8gles';
            snakeMenuRulesButton.hidden = snakeMenuShowingRules;
        }
    }

    function closeSnakeMenu() {
        snakeMenuClosing = true;
        renderSnakeMenu();
        window.setTimeout(() => {
            snakeMenuClosing = false;
            snakeMenuVisible = false;
            snakeMenuShowingRules = false;
            snakeMenuEntering = false;
            snakeMenuResult = null;
            renderSnakeMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealSnakeOutcomeMenu(title, text, eyebrow) {
        snakeMenuVisible = true;
        snakeMenuResult = { title, text, eyebrow };
        snakeMenuShowingRules = false;
        snakeMenuClosing = false;
        snakeMenuEntering = true;

        if (snakeHelpText) {
            snakeHelpText.textContent = text;
        }

        renderSnakeMenu();
        window.setTimeout(() => {
            snakeMenuEntering = false;
            renderSnakeMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function updateSnakeHud() {
        snakeScoreDisplay.textContent = String(snakeScore);
        snakeBestScoreDisplay.textContent = String(snakeBestScore);
        snakeStartButton.textContent = snakeRunning ? 'Changer de cap' : 'Lancer la traversée';
    }

    function queueSnakeDirectionInput(nextDirection) {
        if (!nextDirection) {
            return;
        }

        const lastQueuedDirection = snakeDirectionQueue[snakeDirectionQueue.length - 1];
        const referenceDirection = lastQueuedDirection || snakeNextDirection || snakeDirection;
        const isOpposite = referenceDirection.x + nextDirection.x === 0
            && referenceDirection.y + nextDirection.y === 0;
        const isSameDirection = referenceDirection.x === nextDirection.x
            && referenceDirection.y === nextDirection.y;

        if (isOpposite || isSameDirection || snakeDirectionQueue.length >= 2) {
            return;
        }

        snakeDirectionQueue.push(nextDirection);
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
        snakeBoard?.style.setProperty('--snake-size', String(SNAKE_SIZE));

        if (snakeOverlayLayer) {
            const grid = snakeBoard?.querySelector('.snake-grid');
            const expectedCells = SNAKE_SIZE * SNAKE_SIZE;
            if (grid?.children.length === expectedCells) {
                return;
            }
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
        const centerRow = Math.floor(SNAKE_SIZE / 2);
        const centerCol = Math.floor(SNAKE_SIZE / 2);
        stopSnake();
        snakeMenuResult = null;
        snakeMenuShowingRules = false;
        snakeMenuClosing = false;
        snakeMenuEntering = false;
        snakeFoodElements.forEach((element) => element.remove());
        snakeFoodElements.clear();
        snake = [
            { row: centerRow, col: centerCol },
            { row: centerRow, col: centerCol - 1 },
            { row: centerRow, col: centerCol - 2 }
        ];
        snakeDirection = { x: 1, y: 0 };
        snakeNextDirection = { x: 1, y: 0 };
        snakeDirectionQueue = [];
        snakeFoods = [];
        refillSnakeFoods();
        snakeScore = 0;
        snakeJustAte = false;
        if (snakeHelpText) {
            snakeHelpText.textContent = 'Fl\u00e8ches ou ZQSD pour tourner. Attrape les lanternes sans percuter la coque.';
        }
        updateSnakeHud();
        renderSnake();
        renderSnakeMenu();
    }

    function finishSnakeRun() {
        stopSnake();

        if (snakeScore > snakeBestScore) {
            snakeBestScore = snakeScore;
            window.localStorage.setItem(SNAKE_BEST_KEY, String(snakeBestScore));
        }

        updateSnakeHud();
        revealSnakeOutcomeMenu(
            'Coque heurtée',
            `Le serpent a percuté la coque. Score final : ${snakeScore}.`,
            'Fin de traversée'
        );
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
                updateSnakeHud();
                revealSnakeOutcomeMenu(
                    'Mer nettoyée',
                    `Toutes les lanternes ont été ramassées. Score final : ${snakeScore}.`,
                    'Traversée parfaite'
                );
                return;
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
        minesweeperMenuResult = null;
        minesweeperMenuShowingRules = false;
        minesweeperMenuClosing = false;
        minesweeperMenuEntering = false;
        if (minesweeperHelpText) {
            minesweeperHelpText.textContent = 'Clic gauche pour révéler. Clic droit pour poser un drapeau.';
        }
        updateRestartButtonLabel();
        updateCounters();
        renderBoard();
        renderMinesweeperMenu();
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
        revealMinesweeperOutcomeMenu(
            'Récif traversé',
            `Toutes les zones sûres ont été dégagées en ${timer} secondes.`,
            'Traversée réussie'
        );
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
            revealMinesweeperOutcomeMenu(
                'Mine déclenchée',
                `La traversée s'arrête après ${timer} secondes. Repars avec un nouveau tracé.`,
                'Récif en alerte'
            );
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

    function getFlowFreeRulesText() {
        return 'Clique une bou\u00e9e et trace un cordage color\u00e9 jusqu\u2019\u00e0 sa jumelle sans croiser les autres courants. Remplis toutes les cases du quai pour terminer la carte.';
    }

    function renderFlowFreeMenu() {
        if (!flowFreeMenuOverlay || !flowFreeTable) return;
        syncGameMenuOverlayBounds(flowFreeMenuOverlay, flowFreeTable);
        flowFreeMenuOverlay.classList.toggle('hidden', !flowFreeMenuVisible);
        flowFreeMenuOverlay.classList.toggle('is-closing', flowFreeMenuClosing);
        flowFreeMenuOverlay.classList.toggle('is-entering', flowFreeMenuEntering);
        flowFreeTable.classList.toggle('is-menu-open', flowFreeMenuVisible);
        if (!flowFreeMenuVisible) return;
        const hasResult = Boolean(flowFreeMenuResult);
        if (flowFreeMenuEyebrow) flowFreeMenuEyebrow.textContent = flowFreeMenuShowingRules ? 'R\u00e8gles' : (hasResult ? flowFreeMenuResult.eyebrow : 'Cordages du quai');
        if (flowFreeMenuTitle) flowFreeMenuTitle.textContent = flowFreeMenuShowingRules ? 'Rappel rapide' : (hasResult ? flowFreeMenuResult.title : 'Rope Line');
        if (flowFreeMenuText) flowFreeMenuText.textContent = flowFreeMenuShowingRules ? getFlowFreeRulesText() : (hasResult ? flowFreeMenuResult.text : 'Relie chaque paire de bou\u00e9es avec un cordage color\u00e9 et remplis toutes les cases du quai.');
        if (flowFreeMenuActionButton) flowFreeMenuActionButton.textContent = flowFreeMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer le trac\u00e9' : 'Lancer le trac\u00e9');
        if (flowFreeMenuRulesButton) { flowFreeMenuRulesButton.textContent = 'R\u00e8gles'; flowFreeMenuRulesButton.hidden = flowFreeMenuShowingRules; }
    }

    function closeFlowFreeMenu() {
        flowFreeMenuClosing = true;
        renderFlowFreeMenu();
        window.setTimeout(() => {
            flowFreeMenuClosing = false;
            flowFreeMenuVisible = false;
            flowFreeMenuShowingRules = false;
            flowFreeMenuEntering = false;
            flowFreeMenuResult = null;
            renderFlowFreeMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealFlowFreeOutcomeMenu(title, text, eyebrow) {
        flowFreeMenuVisible = true;
        flowFreeMenuResult = { title, text, eyebrow };
        flowFreeMenuShowingRules = false;
        flowFreeMenuClosing = false;
        flowFreeMenuEntering = true;
        if (flowFreeHelpText) flowFreeHelpText.textContent = text;
        renderFlowFreeMenu();
        window.setTimeout(() => { flowFreeMenuEntering = false; renderFlowFreeMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
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
        flowFreePendingTarget = null;
        if (flowFreeCatchupFrame !== null) {
            window.cancelAnimationFrame(flowFreeCatchupFrame);
            flowFreeCatchupFrame = null;
        }
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
        flowFreeMenuResult = null;
        flowFreeMenuShowingRules = false;
        flowFreeMenuClosing = false;
        flowFreeMenuEntering = false;
        renderFlowFreeMenu();
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
        flowFreeHelpText.textContent = "Trace maintenant le courant jusqu'à la bouée jumelle.";
        scheduleFlowFreeRender();
    }

    function extendFlowFreePathStep(row, col, options = {}) {
        const { deferRender = false } = options;
        if (!flowFreePointerDown || !flowFreeActiveColor) {
            return 'inactive';
        }

        const path = flowFreePaths.get(flowFreeActiveColor) || [];
        const lastCell = path[path.length - 1];

        if (!lastCell) {
            return 'blocked';
        }

        const distance = Math.abs(lastCell.row - row) + Math.abs(lastCell.col - col);
        if (distance !== 1) {
            return 'blocked';
        }

        const targetCell = flowFreeCells[row][col];
        if (!targetCell) {
            return 'blocked';
        }

        const hoverKey = `${row}-${col}`;
        if (flowFreeLastHoverKey === hoverKey) {
            return 'duplicate';
        }
        flowFreeLastHoverKey = hoverKey;

        const existingIndex = path.findIndex((cell) => cell.row === row && cell.col === col);
        if (existingIndex >= 0) {
            setFlowFreePath(flowFreeActiveColor, path.slice(0, existingIndex + 1));
            flowFreeCompleted.delete(flowFreeActiveColor);
            if (!deferRender) {
                scheduleFlowFreeRender();
            }
            return 'advanced';
        }

        if (targetCell.color && targetCell.color !== flowFreeActiveColor) {
            return 'blocked';
        }

        const pair = getFlowFreePairByColor(flowFreeActiveColor);
        if (!pair) {
            return 'blocked';
        }

        const isOtherAnchor = targetCell.isAnchor
            && ((row === pair.start.row && col === pair.start.col) || (row === pair.end.row && col === pair.end.col));

        if (targetCell.isAnchor && !isOtherAnchor) {
            return 'blocked';
        }

        const nextPath = [...path, { row, col }];
        setFlowFreePath(flowFreeActiveColor, nextPath);

        const startCell = nextPath[0];
        const reachedEnd = (startCell.row === pair.start.row && startCell.col === pair.start.col
            && row === pair.end.row && col === pair.end.col)
            || (startCell.row === pair.end.row && startCell.col === pair.end.col
            && row === pair.start.row && col === pair.start.col);

        if (!targetCell.isAnchor) {
            animateFlowFreeCellAppearance(row, col, flowFreeActiveColor);
        }

        if (reachedEnd) {
            renderFlowFree();
            animateFlowFreeCompletedPath(nextPath, flowFreeActiveColor);
            flowFreeCompleted.add(flowFreeActiveColor);
            flowFreeHelpText.textContent = 'Un courant est ferme. Plus que quelques liaisons.';

            const allCellsFilled = flowFreeCells.every((rowCells) => rowCells.every((cell) => Boolean(cell.color)));
            if (flowFreeCompleted.size === flowFreeLevel.pairs.length && allCellsFilled) {
                flowFreeHelpText.textContent = 'Tous les courants sont reliés. Le port est sécurisé.';
                renderFlowFree();
                revealFlowFreeOutcomeMenu('Courants reliés', `Toutes les liaisons sont terminées en ${flowFreeMoves} tracés.`, 'Port sécurisé');
                flowFreePointerDown = false;
                flowFreeActiveColor = null;
                flowFreeLastHoverKey = null;
                return 'completed';
            }
            flowFreeHelpText.textContent = allCellsFilled
                ? 'Toutes les cases sont remplies. Termine les dernieres liaisons.'
                : 'Un courant est ferme. Les cases libres doivent aussi etre couvertes.';
            flowFreePointerDown = false;
            flowFreeActiveColor = null;
            flowFreeLastHoverKey = null;
            if (!deferRender) {
                scheduleFlowFreeRender();
            }
            return 'completed';
        } else {
            flowFreeCompleted.delete(flowFreeActiveColor);
        }

        if (!deferRender) {
            scheduleFlowFreeRender();
        }
        return 'advanced';
    }

    function extendFlowFreePath(row, col) {
        if (!flowFreePointerDown || !flowFreeActiveColor) {
            return;
        }
        flowFreePendingTarget = { row, col };

        if (flowFreeCatchupFrame === null) {
            processFlowFreePendingPath();
        }
    }

    function flushFlowFreePendingTarget() {
        if (!flowFreePointerDown || !flowFreeActiveColor || !flowFreePendingTarget) {
            return;
        }

        while (flowFreePointerDown && flowFreeActiveColor && flowFreePendingTarget) {
            const stepResult = processFlowFreePendingPathSync();
            if (stepResult !== 'advanced') {
                break;
            }
        }
    }

    function finalizeFlowFreePathIfComplete(color) {
        if (!color) {
            return false;
        }

        const pair = getFlowFreePairByColor(color);
        const path = flowFreePaths.get(color) || [];
        const startCell = path[0];
        const endCell = path[path.length - 1];

        if (!pair || !startCell || !endCell) {
            return false;
        }

        const connectsAnchors = (
            startCell.row === pair.start.row
            && startCell.col === pair.start.col
            && endCell.row === pair.end.row
            && endCell.col === pair.end.col
        ) || (
            startCell.row === pair.end.row
            && startCell.col === pair.end.col
            && endCell.row === pair.start.row
            && endCell.col === pair.start.col
        );

        if (!connectsAnchors) {
            return false;
        }

        renderFlowFree();
        animateFlowFreeCompletedPath(path, color);
        flowFreeCompleted.add(color);

        const allCellsFilled = flowFreeCells.every((rowCells) => rowCells.every((cell) => Boolean(cell.color)));
        flowFreeHelpText.textContent = allCellsFilled
            ? 'Toutes les cases sont remplies. Termine les dernieres liaisons.'
            : 'Un courant est ferme. Les cases libres doivent aussi etre couvertes.';

        if (flowFreeCompleted.size === flowFreeLevel.pairs.length && allCellsFilled) {
            flowFreeHelpText.textContent = 'Tous les courants sont relies. Le port est securise.';
            renderFlowFree();
            openGameOverModal('Courants reliés', `Toutes les liaisons sont termin\u00e9es en ${flowFreeMoves} tracés.`);
        }

        return true;
    }

    function snapFlowFreePathToMatchingAnchor(color) {
        if (!color) {
            return;
        }

        const pair = getFlowFreePairByColor(color);
        const path = flowFreePaths.get(color) || [];
        const startCell = path[0];
        const endCell = path[path.length - 1];

        if (!pair || !startCell || !endCell) {
            return;
        }

        const targetAnchor = (startCell.row === pair.start.row && startCell.col === pair.start.col)
            ? pair.end
            : pair.start;

        if (endCell.row === targetAnchor.row && endCell.col === targetAnchor.col) {
            return;
        }

        const distance = Math.abs(endCell.row - targetAnchor.row) + Math.abs(endCell.col - targetAnchor.col);
        if (distance !== 1) {
            return;
        }

        setFlowFreePath(color, [...path, { row: targetAnchor.row, col: targetAnchor.col }]);
    }

    function processFlowFreePendingPathSync() {
        if (!flowFreePointerDown || !flowFreeActiveColor || !flowFreePendingTarget) {
            return 'inactive';
        }

        const path = flowFreePaths.get(flowFreeActiveColor) || [];
        const lastCell = path[path.length - 1];

        if (!lastCell) {
            flowFreePendingTarget = null;
            return 'inactive';
        }

        const rowDiff = flowFreePendingTarget.row - lastCell.row;
        const colDiff = flowFreePendingTarget.col - lastCell.col;
        const distance = Math.abs(rowDiff) + Math.abs(colDiff);

        if (distance === 0) {
            flowFreePendingTarget = null;
            return 'inactive';
        }

        const nextRow = rowDiff !== 0 && Math.abs(rowDiff) >= Math.abs(colDiff)
            ? lastCell.row + Math.sign(rowDiff)
            : lastCell.row;
        const nextCol = nextRow === lastCell.row
            ? lastCell.col + Math.sign(colDiff)
            : lastCell.col;

        const stepResult = extendFlowFreePathStep(nextRow, nextCol, { deferRender: true });
        scheduleFlowFreeRender();

        if (stepResult === 'completed' || stepResult === 'inactive') {
            flowFreePendingTarget = null;
            return stepResult;
        }

        if (stepResult !== 'advanced') {
            flowFreePendingTarget = null;
            return stepResult;
        }

        const updatedPath = flowFreePaths.get(flowFreeActiveColor) || [];
        const updatedLastCell = updatedPath[updatedPath.length - 1];
        if (!updatedLastCell) {
            flowFreePendingTarget = null;
            return 'inactive';
        }

        const remainingDistance = Math.abs(flowFreePendingTarget.row - updatedLastCell.row)
            + Math.abs(flowFreePendingTarget.col - updatedLastCell.col);

        if (remainingDistance === 0) {
            flowFreePendingTarget = null;
        }

        return 'advanced';
    }

    function stopFlowFreePath() {
        const activeColor = flowFreeActiveColor;
        snapFlowFreePathToMatchingAnchor(activeColor);
        const completedOnRelease = finalizeFlowFreePathIfComplete(activeColor);
        flowFreePointerDown = false;
        flowFreeActiveColor = null;
        flowFreeLastHoverKey = null;
        flowFreePendingTarget = null;
        if (flowFreeCatchupFrame !== null) {
            window.cancelAnimationFrame(flowFreeCatchupFrame);
            flowFreeCatchupFrame = null;
        }
        if (!completedOnRelease && activeColor && !flowFreeCompleted.has(activeColor)) {
            despawnFlowFreePath(activeColor);
            return;
        }

        scheduleFlowFreeRender();
    }

    function animateFlowFreeCellAppearance(row, col, color) {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                const cellElement = flowFreeBoard?.querySelector(`[data-flow-row="${row}"][data-flow-col="${col}"]`);
                if (!cellElement || typeof cellElement.animate !== 'function') {
                    return;
                }

                cellElement.animate([
                    {
                        transform: 'scale(0.72)',
                        opacity: 0.55,
                        boxShadow: `0 0 0 0 ${color}00`
                    },
                    {
                        transform: 'scale(1.08)',
                        opacity: 1,
                        boxShadow: `0 0 0 10px ${color}33`
                    },
                    {
                        transform: 'scale(1)',
                        opacity: 1,
                        boxShadow: `0 0 0 0 ${color}00`
                    }
                ], {
                    duration: 220,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
                });
            });
        });
    }

    function animateFlowFreeCompletedPath(path, color) {
        flowFreeCompletionAnimationToken += 1;
        const animationToken = flowFreeCompletionAnimationToken;

        const getPathElements = () => path.map((cell) => (
            flowFreeBoard?.querySelector(`[data-flow-row="${cell.row}"][data-flow-col="${cell.col}"]`)
        ));

        const runAnimation = (elements) => {
            if (animationToken !== flowFreeCompletionAnimationToken) {
                return;
            }

            elements.forEach((cellElement, index) => {
                if (!cellElement || typeof cellElement.animate !== 'function') {
                    return;
                }

                cellElement.getAnimations?.().forEach((animation) => animation.cancel());
                cellElement.animate([
                    {
                        transform: 'scale(1)',
                        boxShadow: `0 0 0 0 ${color}00`,
                        filter: 'brightness(1)'
                    },
                    {
                        transform: 'scale(1.12)',
                        boxShadow: `0 0 0 12px ${color}40`,
                        filter: 'brightness(1.18)'
                    },
                    {
                        transform: 'scale(1)',
                        boxShadow: `0 0 0 0 ${color}00`,
                        filter: 'brightness(1)'
                    }
                ], {
                    duration: 360,
                    delay: index * 26,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    fill: 'both'
                });
            });
        };

        const startWhenReady = (attempt = 0) => {
            if (animationToken !== flowFreeCompletionAnimationToken) {
                return;
            }

            window.requestAnimationFrame(() => {
                if (animationToken !== flowFreeCompletionAnimationToken) {
                    return;
                }

                const elements = getPathElements();
                if (elements.some((element) => !element)) {
                    if (attempt < 5) {
                        startWhenReady(attempt + 1);
                    }
                    return;
                }

                runAnimation(elements);
                window.requestAnimationFrame(() => {
                    if (animationToken !== flowFreeCompletionAnimationToken) {
                        return;
                    }

                    runAnimation(elements);
                    window.requestAnimationFrame(() => {
                        if (animationToken !== flowFreeCompletionAnimationToken) {
                            return;
                        }

                        runAnimation(elements);
                    });
                });
            });
        };

        startWhenReady();

        window.setTimeout(() => {
            if (animationToken !== flowFreeCompletionAnimationToken) {
                return;
            }

            const elements = getPathElements();
            if (elements.some((element) => !element)) {
                return;
            }

            runAnimation(elements);
        }, 48);
    }

    function processFlowFreePendingPath() {
        flowFreeCatchupFrame = null;
        const stepResult = processFlowFreePendingPathSync();
        if (stepResult !== 'advanced' || !flowFreePendingTarget) {
            return;
        }

        flowFreeCatchupFrame = window.requestAnimationFrame(processFlowFreePendingPath);
    }

    function setBreakoutBallVelocity(directionX, directionY) {
        const magnitude = Math.hypot(directionX, directionY) || 1;
        breakoutState.ball.vx = (directionX / magnitude) * BREAKOUT_BALL_SPEED;
        breakoutState.ball.vy = (directionY / magnitude) * BREAKOUT_BALL_SPEED;
    }

    function resetBreakoutBall() {
        breakoutState.ball.x = breakoutCanvas.width / 2;
        breakoutState.ball.y = breakoutCanvas.height * 0.68;
        setBreakoutBallVelocity(0.45, -1);
    }

    function resolveBreakoutBrickCollision(brick, previousX, previousY) {
        const { ball } = breakoutState;
        const radius = ball.radius;
        const crossedFromLeft = previousX + radius <= brick.x;
        const crossedFromRight = previousX - radius >= brick.x + brick.width;
        const crossedFromTop = previousY + radius <= brick.y;
        const crossedFromBottom = previousY - radius >= brick.y + brick.height;

        if (crossedFromLeft) {
            ball.x = brick.x - radius;
            ball.vx = -Math.abs(ball.vx);
            return;
        }

        if (crossedFromRight) {
            ball.x = brick.x + brick.width + radius;
            ball.vx = Math.abs(ball.vx);
            return;
        }

        if (crossedFromTop) {
            ball.y = brick.y - radius;
            ball.vy = -Math.abs(ball.vy);
            return;
        }

        if (crossedFromBottom) {
            ball.y = brick.y + brick.height + radius;
            ball.vy = Math.abs(ball.vy);
            return;
        }

        const overlapLeft = ball.x + radius - brick.x;
        const overlapRight = brick.x + brick.width - (ball.x - radius);
        const overlapTop = ball.y + radius - brick.y;
        const overlapBottom = brick.y + brick.height - (ball.y - radius);
        const horizontalOverlap = Math.min(overlapLeft, overlapRight);
        const verticalOverlap = Math.min(overlapTop, overlapBottom);

        if (horizontalOverlap < verticalOverlap) {
            if (overlapLeft < overlapRight) {
                ball.x = brick.x - radius;
                ball.vx = -Math.abs(ball.vx);
            } else {
                ball.x = brick.x + brick.width + radius;
                ball.vx = Math.abs(ball.vx);
            }
            return;
        }

        if (overlapTop < overlapBottom) {
            ball.y = brick.y - radius;
            ball.vy = -Math.abs(ball.vy);
        } else {
            ball.y = brick.y + brick.height + radius;
            ball.vy = Math.abs(ball.vy);
        }
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

    function getMagicSortRulesText() {
        return 'Clique une fiole pour la s\u00e9lectionner, puis une autre pour y verser le liquide du dessus. Tu ne peux verser que sur une couleur identique (ou sur une fiole vide). Termine la carte quand chaque fiole ne contient qu\u2019une seule couleur.';
    }

    function renderMagicSortMenu() {
        if (!magicSortMenuOverlay || !magicSortTable) return;
        syncGameMenuOverlayBounds(magicSortMenuOverlay, magicSortTable);
        magicSortMenuOverlay.classList.toggle('hidden', !magicSortMenuVisible);
        magicSortMenuOverlay.classList.toggle('is-closing', magicSortMenuClosing);
        magicSortMenuOverlay.classList.toggle('is-entering', magicSortMenuEntering);
        magicSortTable.classList.toggle('is-menu-open', magicSortMenuVisible);
        if (!magicSortMenuVisible) return;
        const hasResult = Boolean(magicSortMenuResult);
        if (magicSortMenuEyebrow) magicSortMenuEyebrow.textContent = magicSortMenuShowingRules ? 'R\u00e8gles' : (hasResult ? magicSortMenuResult.eyebrow : 'Fioles du vieux navigateur');
        if (magicSortMenuTitle) magicSortMenuTitle.textContent = magicSortMenuShowingRules ? 'Rappel rapide' : (hasResult ? magicSortMenuResult.title : 'Magic Sort');
        if (magicSortMenuText) magicSortMenuText.textContent = magicSortMenuShowingRules ? getMagicSortRulesText() : (hasResult ? magicSortMenuResult.text : 'Verse les couleurs dans les fioles jusqu\u2019\u00e0 ce que chacune n\u2019en contienne plus qu\u2019une.');
        if (magicSortMenuActionButton) magicSortMenuActionButton.textContent = magicSortMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer le tri' : 'Lancer le tri');
        if (magicSortMenuRulesButton) { magicSortMenuRulesButton.textContent = 'R\u00e8gles'; magicSortMenuRulesButton.hidden = magicSortMenuShowingRules; }
    }

    function closeMagicSortMenu() {
        magicSortMenuClosing = true;
        renderMagicSortMenu();
        window.setTimeout(() => {
            magicSortMenuClosing = false;
            magicSortMenuVisible = false;
            magicSortMenuShowingRules = false;
            magicSortMenuEntering = false;
            magicSortMenuResult = null;
            renderMagicSortMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealMagicSortOutcomeMenu(title, text, eyebrow) {
        magicSortMenuVisible = true;
        magicSortMenuResult = { title, text, eyebrow };
        magicSortMenuShowingRules = false;
        magicSortMenuClosing = false;
        magicSortMenuEntering = true;
        if (magicSortHelpText) magicSortHelpText.textContent = text;
        renderMagicSortMenu();
        window.setTimeout(() => { magicSortMenuEntering = false; renderMagicSortMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function initializeMagicSort() {
        closeGameOverModal();
        magicSortTubes = generateMagicSortLevel();
        magicSortSelectedTube = null;
        magicSortMoves = 0;
        magicSortHelpText.textContent = "Verse les couleurs d'un récipient à l'autre pour obtenir des tubes uniformes. Chaque partie mélange les fioles différemment.";
        magicSortMenuResult = null;
        magicSortMenuShowingRules = false;
        magicSortMenuClosing = false;
        magicSortMenuEntering = false;
        renderMagicSortMenu();
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
            magicSortHelpText.textContent = 'Sélection annulée.';
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
            magicSortHelpText.textContent = 'Toutes les fioles sont rangées.';
            revealMagicSortOutcomeMenu(
                'Fioles rangées',
                `Toutes les couleurs ont été triées en ${magicSortMoves} coups.`,
                'Alchimie réussie'
            );
        }
    }

    function updateMentalMathHud() {
        mentalMathScoreDisplay.textContent = String(mentalMathScore);
        mentalMathRoundDisplay.textContent = `${Math.max(0, mentalMathTimeRemainingMs / 1000).toFixed(1)}s`;
    }

    function generateMentalMathQuestion(score) {
        const difficulty = Math.min(4, Math.floor(score / 4));
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
        mentalMathAnswerInput.disabled = !mentalMathRoundRunning;
        mentalMathSubmitButton.disabled = !mentalMathRoundRunning;
        mentalMathKeypadButtons.forEach((button) => {
            button.disabled = !mentalMathRoundRunning;
        });
        if (activeGameTab === 'mentalMath' && mentalMathRoundRunning) {
            mentalMathAnswerInput.blur();
        }
    }

    function getMentalMathRulesText() {
        return 'Le chrono descend en continu. Réponds juste et vite pour gagner du temps, enchaîner les calculs et faire grimper ton score avant la fin.';
    }

    function renderMentalMathMenu() {
        if (!mentalMathMenuOverlay || !mentalMathTable) {
            return;
        }

        syncGameMenuOverlayBounds(mentalMathMenuOverlay, mentalMathTable);
        mentalMathMenuOverlay.classList.toggle('hidden', !mentalMathMenuVisible);
        mentalMathMenuOverlay.classList.toggle('is-closing', mentalMathMenuClosing);
        mentalMathMenuOverlay.classList.toggle('is-entering', mentalMathMenuEntering);
        mentalMathTable.classList.toggle('is-menu-open', mentalMathMenuVisible);

        if (!mentalMathMenuVisible) {
            return;
        }

        if (mentalMathMenuEyebrow) {
            mentalMathMenuEyebrow.textContent = mentalMathMenuShowingRules ? 'R\u00e8gles' : (mentalMathMenuResult ? 'Fin de partie' : "Baie d'arcade");
        }
        if (mentalMathMenuTitle) {
            mentalMathMenuTitle.textContent = mentalMathMenuShowingRules
                ? 'Rappel rapide'
                : (mentalMathMenuResult ? 'Temps ecoule' : 'Jeu Calcul');
        }
        if (mentalMathMenuText) {
            mentalMathMenuText.textContent = mentalMathMenuShowingRules
                ? getMentalMathRulesText()
                : (mentalMathMenuResult
                    ? `Tu as enchaine ${mentalMathScore} bonne${mentalMathScore > 1 ? 's' : ''} r\u00e9ponse${mentalMathScore > 1 ? 's' : ''}.`
                    : 'Prepare-toi a enchainer les calculs avant que le chrono ne te rattrape.');
        }
        if (mentalMathMenuActionButton) {
            mentalMathMenuActionButton.textContent = mentalMathMenuShowingRules
                ? 'Retour'
                : (mentalMathMenuResult ? 'Relancer la partie' : 'Lancer la partie');
        }
        if (mentalMathMenuRulesButton) {
            mentalMathMenuRulesButton.textContent = 'R\u00e8gles';
            mentalMathMenuRulesButton.hidden = mentalMathMenuShowingRules;
        }
    }

    function startMentalMathLaunchSequence() {
        mentalMathMenuClosing = true;
        renderMentalMathMenu();
        window.setTimeout(() => {
            mentalMathMenuClosing = false;
            mentalMathMenuVisible = false;
            mentalMathMenuShowingRules = false;
            mentalMathMenuEntering = false;
            mentalMathMenuResult = false;
            startMentalMathRound();
            renderMentalMathMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealMentalMathOutcomeMenu() {
        mentalMathMenuShowingRules = false;
        mentalMathMenuClosing = false;
        mentalMathMenuEntering = true;
        mentalMathMenuVisible = true;
        mentalMathMenuResult = true;
        renderMentalMathMenu();
        window.setTimeout(() => {
            mentalMathMenuEntering = false;
            renderMentalMathMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function stopMentalMathTimer() {
        if (mentalMathTimerInterval) {
            window.clearInterval(mentalMathTimerInterval);
            mentalMathTimerInterval = null;
        }
    }

    function finishMentalMathRound() {
        stopMentalMathTimer();
        mentalMathRoundRunning = false;
        mentalMathTimeRemainingMs = 0;
        mentalMathFeedback.textContent = `Temps ecoule. Score final : ${mentalMathScore}.`;
        mentalMathHelpText.textContent = "La mar\u00e9e s'est retir\u00e9e. Relance une partie pour tenter de battre ton score.";
        renderMentalMathQuestion();
        revealMentalMathOutcomeMenu();
    }

    function startMentalMathTimer() {
        stopMentalMathTimer();
        mentalMathTimerInterval = window.setInterval(() => {
            mentalMathTimeRemainingMs = Math.max(0, mentalMathTimeRemainingMs - MENTAL_MATH_TICK_MS);
            updateMentalMathHud();

            if (mentalMathTimeRemainingMs <= 0) {
                finishMentalMathRound();
            }
        }, MENTAL_MATH_TICK_MS);
    }

    function advanceMentalMathQuestion() {
        mentalMathCurrentQuestion = generateMentalMathQuestion(mentalMathScore);
        mentalMathQuestionStartedAt = performance.now();
        renderMentalMathQuestion();
    }

    function startMentalMathRound() {
        mentalMathRoundRunning = true;
        mentalMathQuestionStartedAt = performance.now();
        mentalMathFeedback.textContent = '';
        mentalMathHelpText.textContent = 'Le chrono file. Réponds vite et juste pour regagner du temps.';
        renderMentalMathQuestion();
        startMentalMathTimer();
    }

    function initializeMentalMath() {
        closeGameOverModal();
        stopMentalMathTimer();
        mentalMathScore = 0;
        mentalMathCurrentQuestion = generateMentalMathQuestion(0);
        mentalMathTimeRemainingMs = MENTAL_MATH_START_TIME_MS;
        mentalMathRoundRunning = false;
        mentalMathQuestionStartedAt = performance.now();
        mentalMathMenuVisible = true;
        mentalMathMenuShowingRules = false;
        mentalMathMenuClosing = false;
        mentalMathMenuEntering = false;
        mentalMathMenuResult = false;
        mentalMathFeedback.textContent = '';
        mentalMathHelpText.textContent = 'Le chrono descend. Réponds juste et vite pour regagner un peu de temps et pousser ton score au plus haut.';
        renderMentalMathQuestion();
        renderMentalMathMenu();
    }

    function submitMentalMathAnswer() {
        if (!mentalMathCurrentQuestion || !mentalMathRoundRunning) {
            return;
        }

        const userAnswer = Number(mentalMathAnswerInput.value);
        if (Number.isNaN(userAnswer)) {
            mentalMathFeedback.textContent = 'Entre une r\u00e9ponse avant de valider.';
            return;
        }

        if (userAnswer === mentalMathCurrentQuestion.answer) {
            const responseTimeMs = Math.max(0, performance.now() - mentalMathQuestionStartedAt);
            const fastRewardRatio = Math.max(0, (MENTAL_MATH_FAST_WINDOW_MS - responseTimeMs) / MENTAL_MATH_FAST_WINDOW_MS);
            const timeReward = MENTAL_MATH_BASE_REWARD_MS + (MENTAL_MATH_FAST_REWARD_MS * fastRewardRatio);
            mentalMathScore += 1;
            mentalMathTimeRemainingMs = Math.min(MENTAL_MATH_MAX_TIME_MS, mentalMathTimeRemainingMs + timeReward);
            mentalMathFeedback.textContent = `Bonne r\u00e9ponse. +${(timeReward / 1000).toFixed(1)}s`;
            mentalMathHelpText.textContent = 'Belle r\u00e9ponse. Encha\u00eene pour garder la mar\u00e9e avec toi.';
        } else {
            mentalMathFeedback.textContent = `Presque. Il fallait ${mentalMathCurrentQuestion.answer}.`;
            mentalMathHelpText.textContent = 'Pas de bonus cette fois. Repars vite sur le calcul suivant.';
        }

        advanceMentalMathQuestion();
    }

    function handleMentalMathKeypadInput(value) {
        if (!mentalMathRoundRunning || !mentalMathAnswerInput) {
            return;
        }

        mentalMathAnswerInput.value = `${mentalMathAnswerInput.value}${value}`.slice(0, 6);
    }

    function handleMentalMathKeypadAction(action) {
        if (!mentalMathRoundRunning || !mentalMathAnswerInput) {
            return;
        }

        if (action === 'backspace') {
            mentalMathAnswerInput.value = mentalMathAnswerInput.value.slice(0, -1);
            return;
        }

        if (action === 'clear') {
            mentalMathAnswerInput.value = '';
        }
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

    function getCandyCrushRulesText() {
        return 'Fais glisser une pi\u00e8ce vers une case voisine pour former un alignement de 3 tr\u00e9sors identiques ou plus. Chaque alignement casse la ligne et fait tomber la cale. Atteins l\u2019objectif de score avant d\u2019\u00e9puiser tes coups.';
    }

    function renderCandyCrushMenu() {
        if (!candyCrushMenuOverlay || !candyCrushTable) {
            return;
        }

        syncGameMenuOverlayBounds(candyCrushMenuOverlay, candyCrushTable);
        candyCrushMenuOverlay.classList.toggle('hidden', !candyCrushMenuVisible);
        candyCrushMenuOverlay.classList.toggle('is-closing', candyCrushMenuClosing);
        candyCrushMenuOverlay.classList.toggle('is-entering', candyCrushMenuEntering);
        candyCrushTable.classList.toggle('is-menu-open', candyCrushMenuVisible);

        if (!candyCrushMenuVisible) {
            return;
        }

        const hasResult = Boolean(candyCrushMenuResult);

        if (candyCrushMenuEyebrow) {
            candyCrushMenuEyebrow.textContent = candyCrushMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? candyCrushMenuResult.eyebrow : 'Cale \u00e0 confiseries marines');
        }

        if (candyCrushMenuTitle) {
            candyCrushMenuTitle.textContent = candyCrushMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? candyCrushMenuResult.title : 'Coin Crush');
        }

        if (candyCrushMenuText) {
            candyCrushMenuText.textContent = candyCrushMenuShowingRules
                ? getCandyCrushRulesText()
                : (hasResult
                    ? candyCrushMenuResult.text
                    : 'Glisse les tr\u00e9sors marins pour former des alignements de 3 ou plus avant d\u2019\u00e9puiser ta r\u00e9serve de coups.');
        }

        if (candyCrushMenuActionButton) {
            candyCrushMenuActionButton.textContent = candyCrushMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la cale' : 'Lancer la cale');
        }

        if (candyCrushMenuRulesButton) {
            candyCrushMenuRulesButton.textContent = 'R\u00e8gles';
            candyCrushMenuRulesButton.hidden = candyCrushMenuShowingRules;
        }
    }

    function closeCandyCrushMenu() {
        candyCrushMenuClosing = true;
        renderCandyCrushMenu();
        window.setTimeout(() => {
            candyCrushMenuClosing = false;
            candyCrushMenuVisible = false;
            candyCrushMenuShowingRules = false;
            candyCrushMenuEntering = false;
            candyCrushMenuResult = null;
            renderCandyCrushMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealCandyCrushOutcomeMenu(title, text, eyebrow) {
        candyCrushMenuVisible = true;
        candyCrushMenuResult = { title, text, eyebrow };
        candyCrushMenuShowingRules = false;
        candyCrushMenuClosing = false;
        candyCrushMenuEntering = true;

        if (candyCrushHelpText) {
            candyCrushHelpText.textContent = text;
        }

        renderCandyCrushMenu();
        window.setTimeout(() => {
            candyCrushMenuEntering = false;
            renderCandyCrushMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
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
        candyCrushMenuResult = null;
        candyCrushMenuShowingRules = false;
        candyCrushMenuClosing = false;
        candyCrushMenuEntering = false;
        ensureCandyCrushPlayable();
        candyCrushHelpText.textContent = 'Fais glisser une pi\u00e8ce vers une voisine pour former des alignements de 3 tr\u00e9sors ou plus.';
        renderCandyCrush();
        renderCandyCrushMenu();
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
            revealCandyCrushOutcomeMenu(
                'Cale vidée',
                `Objectif atteint avec ${candyCrushScore} points. Coups restants : ${candyCrushMoves}.`,
                'Trésors rassemblés'
            );
            return;
        }

        if (candyCrushMoves <= 0) {
            revealCandyCrushOutcomeMenu(
                'Réserve épuisée',
                `Plus de coups disponibles. Score final : ${candyCrushScore}.`,
                'Cale vide'
            );
        }
    }

    function updateHarborRunHud() {
        harborRunScoreDisplay.textContent = String(harborRunScore);
        harborRunBestDisplay.textContent = String(harborRunBestScore);
        harborRunStartButton.textContent = harborRunRunning ? 'En course' : 'Lancer la route';
    }

    function isHarborRunCollision(obstacle) {
        const boardHeight = harborRunBoard?.clientHeight || 540;
        const playerCenterX = getHarborRunPlayerPosition();
        const obstacleCenterX = HARBOR_RUN_LANES[obstacle.lane];
        const playerWidthPercent = 22;
        const obstacleWidthPercent = obstacle.type === 'rock' ? 18 : 20;
        const horizontalGap = Math.abs(playerCenterX - obstacleCenterX);
        const horizontalHitLimit = ((playerWidthPercent + obstacleWidthPercent) / 2) - 4.5;

        if (horizontalGap > horizontalHitLimit) {
            return false;
        }

        const playerHeightPercent = (82 / boardHeight) * 100;
        const playerBottomPercent = 100 - ((18 / boardHeight) * 100);
        const playerTopPercent = playerBottomPercent - playerHeightPercent + 2.2;
        const playerBottomHitPercent = playerBottomPercent - 2.4;

        const obstacleHeightPx = obstacle.type === 'rock' ? 66 : 78;
        const obstacleHeightPercent = (obstacleHeightPx / boardHeight) * 100;
        const obstacleTopPercent = obstacle.y + (obstacle.type === 'rock' ? 1.4 : 2.2);
        const obstacleBottomPercent = obstacleTopPercent + obstacleHeightPercent - (obstacle.type === 'rock' ? 2.8 : 4.2);

        return obstacleBottomPercent >= playerTopPercent && obstacleTopPercent <= playerBottomHitPercent;
    }

    function getHarborRunPlayerPosition() {
        const safeLaneIndex = Math.max(0, Math.min(HARBOR_RUN_LANES.length - 1, harborRunVisualLane));
        const lowerLaneIndex = Math.floor(safeLaneIndex);
        const upperLaneIndex = Math.min(HARBOR_RUN_LANES.length - 1, lowerLaneIndex + 1);
        const laneProgress = safeLaneIndex - lowerLaneIndex;
        const lowerPosition = HARBOR_RUN_LANES[lowerLaneIndex];
        const upperPosition = HARBOR_RUN_LANES[upperLaneIndex];
        return lowerPosition + ((upperPosition - lowerPosition) * laneProgress);
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
        const playerMarkup = `<div class="harborrun-player" style="left: ${getHarborRunPlayerPosition()}%;"></div>`;
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

    function getHarborRunRulesText() {
        return 'Pilote ton navire dans le chenal du port. Fl\u00e8ches, ZQSD ou clic gauche/droit sur l\u2019\u00e9cran pour changer de voie. \u00c9vite rochers, \u00e9paves et autres bateaux \u2014 la vitesse monte au fil de la course.';
    }

    function renderHarborRunMenu() {
        if (!harborRunMenuOverlay || !harborRunTable) {
            return;
        }

        syncGameMenuOverlayBounds(harborRunMenuOverlay, harborRunTable);
        harborRunMenuOverlay.classList.toggle('hidden', !harborRunMenuVisible);
        harborRunMenuOverlay.classList.toggle('is-closing', harborRunMenuClosing);
        harborRunMenuOverlay.classList.toggle('is-entering', harborRunMenuEntering);
        harborRunTable.classList.toggle('is-menu-open', harborRunMenuVisible);

        if (!harborRunMenuVisible) {
            return;
        }

        const hasResult = Boolean(harborRunMenuResult);

        if (harborRunMenuEyebrow) {
            harborRunMenuEyebrow.textContent = harborRunMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? harborRunMenuResult.eyebrow : 'Course dans le chenal');
        }

        if (harborRunMenuTitle) {
            harborRunMenuTitle.textContent = harborRunMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? harborRunMenuResult.title : 'Navire 2D');
        }

        if (harborRunMenuText) {
            harborRunMenuText.textContent = harborRunMenuShowingRules
                ? getHarborRunRulesText()
                : (hasResult
                    ? harborRunMenuResult.text
                    : 'Guide ton navire entre rochers, \u00e9paves et autres bateaux pendant que la vitesse monte.');
        }

        if (harborRunMenuActionButton) {
            harborRunMenuActionButton.textContent = harborRunMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Reprendre la mer' : 'Prendre la mer');
        }

        if (harborRunMenuRulesButton) {
            harborRunMenuRulesButton.textContent = 'R\u00e8gles';
            harborRunMenuRulesButton.hidden = harborRunMenuShowingRules;
        }
    }

    function closeHarborRunMenu() {
        harborRunMenuClosing = true;
        renderHarborRunMenu();
        window.setTimeout(() => {
            harborRunMenuClosing = false;
            harborRunMenuVisible = false;
            harborRunMenuShowingRules = false;
            harborRunMenuEntering = false;
            harborRunMenuResult = null;
            renderHarborRunMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealHarborRunOutcomeMenu(title, text, eyebrow) {
        harborRunMenuVisible = true;
        harborRunMenuResult = { title, text, eyebrow };
        harborRunMenuShowingRules = false;
        harborRunMenuClosing = false;
        harborRunMenuEntering = true;

        if (harborRunHelpText) {
            harborRunHelpText.textContent = text;
        }

        renderHarborRunMenu();
        window.setTimeout(() => {
            harborRunMenuEntering = false;
            renderHarborRunMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function initializeHarborRun() {
        closeGameOverModal();
        stopHarborRun();
        harborRunLane = 1;
        harborRunVisualLane = 1;
        harborRunSafeLane = 1;
        harborRunObstacles = [];
        harborRunScore = 0;
        harborRunSpawnTimer = 0;
        harborRunBackdropOffset = 0;
        harborRunMenuResult = null;
        harborRunMenuShowingRules = false;
        harborRunMenuClosing = false;
        harborRunMenuEntering = false;
        harborRunStartButton.textContent = 'Lancer la route';
        harborRunHelpText.textContent = 'Guide ton navire entre navires, épaves et rochers avec plus de marge pour passer.';
        renderHarborRun();
        renderHarborRunMenu();
    }

    function moveHarborRun(direction) {
        if (!harborRunRunning) {
            return;
        }

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
        harborRunHelpText.textContent = "Garde le cap. La mer s'accélère peu à peu à mesure que tu avances.";
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
        const laneSmoothing = Math.min(1, (deltaMs / 1000) * 12);
        harborRunVisualLane += (harborRunLane - harborRunVisualLane) * laneSmoothing;
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

        const collided = harborRunObstacles.some((obstacle) => isHarborRunCollision(obstacle));

        if (collided) {
            stopHarborRun();
            harborRunHelpText.textContent = 'Collision dans le port.';
            renderHarborRun();
            revealHarborRunOutcomeMenu(
                'Navire échoué',
                `Collision dans le chenal. Distance parcourue : ${harborRunScore}. Record : ${harborRunBestScore}.`,
                'Cap sur le port'
            );
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

    function getStackerRulesText() {
        return 'Clique sur le plateau ou appuie sur Espace au bon moment pour poser la cargaison qui va et vient. Chaque étage trop décalé se fait rogner. Vise la plus haute tour du port.';
    }

    function renderStackerMenu() {
        if (!stackerMenuOverlay || !stackerTable) {
            return;
        }

        syncGameMenuOverlayBounds(stackerMenuOverlay, stackerTable);
        stackerMenuOverlay.classList.toggle('hidden', !stackerMenuVisible);
        stackerMenuOverlay.classList.toggle('is-closing', stackerMenuClosing);
        stackerMenuOverlay.classList.toggle('is-entering', stackerMenuEntering);
        stackerTable.classList.toggle('is-menu-open', stackerMenuVisible);

        if (!stackerMenuVisible) {
            return;
        }

        const hasResult = Boolean(stackerMenuResult);

        if (stackerMenuEyebrow) {
            stackerMenuEyebrow.textContent = stackerMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? stackerMenuResult.eyebrow : 'Tour de butin');
        }

        if (stackerMenuTitle) {
            stackerMenuTitle.textContent = stackerMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? stackerMenuResult.title : 'Stack 2D');
        }

        if (stackerMenuText) {
            stackerMenuText.textContent = stackerMenuShowingRules
                ? getStackerRulesText()
                : (hasResult
                    ? stackerMenuResult.text
                    : 'Clique ou appuie sur Espace au bon moment pour empiler la cargaison. Vise la plus haute tour du port.');
        }

        if (stackerMenuActionButton) {
            stackerMenuActionButton.textContent = stackerMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
        }

        if (stackerMenuRulesButton) {
            stackerMenuRulesButton.textContent = 'R\u00e8gles';
            stackerMenuRulesButton.hidden = stackerMenuShowingRules;
        }
    }

    function closeStackerMenu() {
        stackerMenuClosing = true;
        renderStackerMenu();
        window.setTimeout(() => {
            stackerMenuClosing = false;
            stackerMenuVisible = false;
            stackerMenuShowingRules = false;
            stackerMenuEntering = false;
            stackerMenuResult = null;
            renderStackerMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealStackerOutcomeMenu(title, text, eyebrow) {
        stackerMenuVisible = true;
        stackerMenuResult = { title, text, eyebrow };
        stackerMenuShowingRules = false;
        stackerMenuClosing = false;
        stackerMenuEntering = true;

        if (stackerHelpText) {
            stackerHelpText.textContent = text;
        }

        renderStackerMenu();
        window.setTimeout(() => {
            stackerMenuEntering = false;
            renderStackerMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
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
        stackerMenuResult = null;
        stackerMenuShowingRules = false;
        stackerMenuClosing = false;
        stackerMenuEntering = false;
        stackerHelpText.textContent = 'Clique ou appuie sur Espace au bon moment pour empiler les couches du phare.';
        renderStacker();
        renderStackerMenu();
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
        stackerHelpText.textContent = "Empile les couches sans perdre l'alignement.";
        stackerStartButton.textContent = 'Empiler';
        updateStackerHud();
        stackerAnimationFrame = window.requestAnimationFrame(runStackerFrame);
    }

    function dropStackerLayer() {
        if (stackerMenuVisible || stackerMenuClosing) {
            return;
        }

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
            stackerHelpText.textContent = 'La couche est tombée dans la baie.';
            renderStacker();
            revealStackerOutcomeMenu(
                'Tour écroulée',
                `La cargaison s'est effondrée après ${stackerScore} étage${stackerScore > 1 ? 's' : ''}. Record : ${stackerBestScore}.`,
                'Cap sur la baie'
            );
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
            ? 'Oups, une partie est tombée. Continue de monter.'
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
                    <span class="coinclicker-upgrade-meta">Niveau ${level} Â· ${cost} pieces</span>
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

    function getCoinClickerRulesText() {
        return 'Clique la pi\u00e8ce pour ajouter des pi\u00e8ces au coffre du capitaine. D\u00e9pense-les dans la boutique du navire pour augmenter le gain par clic, le multiplicateur et le rendement automatique. Ta fortune est sauvegard\u00e9e ; "Nouvelle fortune" remet tout \u00e0 z\u00e9ro.';
    }

    function renderCoinClickerMenu() {
        if (!coinClickerMenuOverlay || !coinClickerTable) {
            return;
        }

        syncGameMenuOverlayBounds(coinClickerMenuOverlay, coinClickerTable);
        coinClickerMenuOverlay.classList.toggle('hidden', !coinClickerMenuVisible);
        coinClickerMenuOverlay.classList.toggle('is-closing', coinClickerMenuClosing);
        coinClickerMenuOverlay.classList.toggle('is-entering', coinClickerMenuEntering);
        coinClickerTable.classList.toggle('is-menu-open', coinClickerMenuVisible);

        if (!coinClickerMenuVisible) {
            return;
        }

        if (coinClickerMenuEyebrow) {
            coinClickerMenuEyebrow.textContent = coinClickerMenuShowingRules
                ? 'R\u00e8gles'
                : 'Tr\u00e9sor du capitaine';
        }

        if (coinClickerMenuTitle) {
            coinClickerMenuTitle.textContent = coinClickerMenuShowingRules
                ? 'Rappel rapide'
                : 'Coin Clicker';
        }

        if (coinClickerMenuText) {
            coinClickerMenuText.textContent = coinClickerMenuShowingRules
                ? getCoinClickerRulesText()
                : 'Clique sur la pi\u00e8ce pour remplir le coffre, puis automatise ton butin gr\u00e2ce \u00e0 la boutique du navire.';
        }

        if (coinClickerMenuActionButton) {
            coinClickerMenuActionButton.textContent = coinClickerMenuShowingRules
                ? 'Retour'
                : 'Lancer la fortune';
        }

        if (coinClickerMenuRulesButton) {
            coinClickerMenuRulesButton.textContent = 'R\u00e8gles';
            coinClickerMenuRulesButton.hidden = coinClickerMenuShowingRules;
        }
    }

    function closeCoinClickerMenu() {
        coinClickerMenuClosing = true;
        renderCoinClickerMenu();
        window.setTimeout(() => {
            coinClickerMenuClosing = false;
            coinClickerMenuVisible = false;
            coinClickerMenuShowingRules = false;
            coinClickerMenuEntering = false;
            renderCoinClickerMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
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
            coinClickerHelpText.textContent = 'Nouvelle fortune lanc\u00e9e. Clique pour remplir la caisse, puis automatise ton butin.';
            coinClickerMenuVisible = true;
            coinClickerMenuShowingRules = false;
            coinClickerMenuClosing = false;
            coinClickerMenuEntering = false;
        } else {
            loadCoinClickerState();
        }

        coinClickerLastAutoTick = performance.now();
        renderCoinClicker();
        renderCoinClickerMenu();
    }

    function createChessPiece(type, color) {
        return { type, color, hasMoved: false };
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
        if (multiplayerActiveRoom?.gameId === 'chess') {
            syncMultiplayerChessState();
            return;
        }

        chessLastCaptureFxKey = '';
        if (chessLastMoveResetTimer) {
            window.clearTimeout(chessLastMoveResetTimer);
            chessLastMoveResetTimer = null;
        }
        if (chessOutcomeMenuTimer) {
            window.clearTimeout(chessOutcomeMenuTimer);
            chessOutcomeMenuTimer = null;
        }
        if (chessOutcomeMenuEnterTimer) {
            window.clearTimeout(chessOutcomeMenuEnterTimer);
            chessOutcomeMenuEnterTimer = null;
        }
        if (chessAiTimeout) {
            window.clearTimeout(chessAiTimeout);
            chessAiTimeout = null;
        }
        chessState = {
            board: createInitialChessBoard(),
            turn: 'white',
            winner: null,
            lastMove: null
        };
        chessLastMoveAnimationKey = '';
        chessSelectedSquare = null;
        chessMenuVisible = true;
        chessMenuShowingRules = false;
        chessMenuClosing = false;
        chessMenuEntering = false;
        renderChessMenu();
        renderChess();
    }

    function getChessRulesText() {
        return "Les pièces se déplacent selon les règles classiques. La promotion devient une reine et le roque est disponible. La prise en passant n'est pas gérée ici.";
    }

    function getChessReadySummary() {
        const readyCount = Number(multiplayerActiveRoom?.chessReadyCount || 0);
        const readyTotal = Number(multiplayerActiveRoom?.chessReadyTotal || multiplayerActiveRoom?.playerCount || 0);
        return `${readyCount}/${readyTotal || 0}`;
    }

    function getChessMenuOutcomeContent() {
        if (!chessState?.winner) {
            return null;
        }

        if (isMultiplayerChessActive()) {
            return chessState.winner === getMultiplayerChessRole()
                ? {
                    eyebrow: 'Victoire',
                    title: 'Tu remportes la partie',
                    text: '\u00c9chec et mat. Tu peux te remettre pr\u00eat pour relancer une manche.'
                }
                : {
                    eyebrow: 'D\u00e9faite',
                    title: "C'est perdu",
                    text: "\u00c9chec et mat. L'adversaire remporte la partie. Tu peux te remettre pr\u00eat pour la suivante."
                };
        }

        if (chessMode === 'solo') {
            return chessState.winner === 'white'
                ? {
                    eyebrow: 'Victoire',
                    title: 'Tu remportes la partie',
                    text: 'Le roi adverse tombe. Tu peux relancer une nouvelle partie ou relire les règles.'
                }
                : {
                    eyebrow: 'D\u00e9faite',
                    title: "C'est perdu",
                    text: 'Ton roi est mat. Relance une partie pour retenter ta chance.'
                };
        }

        return {
            eyebrow: 'Fin de partie',
            title: chessState.winner === 'white' ? 'Blancs gagnent' : 'Noirs gagnent',
            text: `\u00c9chec et mat. ${chessState.winner === 'white' ? 'Les Blancs' : 'Les Noirs'} remportent la partie.`
        };
    }

    function revealChessOutcomeMenuWithDelay() {
        if (chessOutcomeMenuTimer) {
            window.clearTimeout(chessOutcomeMenuTimer);
            chessOutcomeMenuTimer = null;
        }
        if (chessOutcomeMenuEnterTimer) {
            window.clearTimeout(chessOutcomeMenuEnterTimer);
            chessOutcomeMenuEnterTimer = null;
        }

        chessMenuVisible = false;
        chessMenuShowingRules = false;
        chessMenuClosing = false;
        chessMenuEntering = false;
        renderChessMenu();

        chessOutcomeMenuTimer = window.setTimeout(() => {
            chessOutcomeMenuTimer = null;
            chessMenuVisible = true;
            chessMenuShowingRules = false;
            chessMenuClosing = false;
            chessMenuEntering = true;
            renderChessMenu();

            chessOutcomeMenuEnterTimer = window.setTimeout(() => {
                chessOutcomeMenuEnterTimer = null;
                chessMenuEntering = false;
                renderChessMenu();
            }, UNO_MENU_CLOSE_DURATION_MS);
        }, 420);
    }

    function renderChessMenu() {
        if (!chessMenuOverlay || !chessTable) {
            return;
        }

        syncGameMenuOverlayBounds(chessMenuOverlay, chessTable);
        const isOnline = multiplayerActiveRoom?.gameId === 'chess';
        const roomStarted = Boolean(multiplayerActiveRoom?.chessStarted);
        const currentPlayer = multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
        const outcomeContent = getChessMenuOutcomeContent();
        const hasResult = Boolean(outcomeContent);
        const readyLabel = currentPlayer?.chessReady ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat';
        const actionLabel = isOnline
            ? `${readyLabel} (${getChessReadySummary()})`
            : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
        const baseText = isOnline
            ? "Quand les deux joueurs sont pr\u00eats, la partie d'\u00e9checs commence automatiquement."
            : "Installe les pièces et choisis ton mode avant d'engager la partie.";

        chessMenuVisible = isOnline ? (!roomStarted || hasResult) : chessMenuVisible;

        chessMenuOverlay.classList.toggle('hidden', !chessMenuVisible);
        chessMenuOverlay.classList.toggle('is-closing', chessMenuClosing);
        chessMenuOverlay.classList.toggle('is-entering', chessMenuEntering);
        chessTable.classList.toggle('is-menu-open', chessMenuVisible);

        if (!chessMenuVisible) {
            return;
        }

        if (chessMenuEyebrow) {
            chessMenuEyebrow.textContent = chessMenuShowingRules ? 'R\u00e8gles' : (outcomeContent?.eyebrow || 'Baie strat\u00e9gique');
        }
        if (chessMenuTitle) {
            chessMenuTitle.textContent = chessMenuShowingRules ? 'Rappel rapide' : (outcomeContent?.title || '\u00c9checs');
        }
        if (chessMenuText) {
            chessMenuText.textContent = chessMenuShowingRules
                ? getChessRulesText()
                : (outcomeContent?.text || baseText);
        }
        if (chessMenuActionButton) {
            chessMenuActionButton.textContent = chessMenuShowingRules ? 'Retour' : actionLabel;
        }
        if (chessMenuRulesButton) {
            chessMenuRulesButton.textContent = 'R\u00e8gles';
            chessMenuRulesButton.hidden = chessMenuShowingRules;
        }
    }

    function startChessLaunchSequence() {
        chessMenuClosing = true;
        renderChessMenu();
        window.setTimeout(() => {
            chessMenuClosing = false;
            chessMenuVisible = false;
            chessMenuShowingRules = false;
            chessMenuEntering = false;
            renderChessMenu();
            renderChess();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function isChessAiTurn() {
        return chessMode === 'solo' && chessState && !chessState.winner && chessState.turn === 'black';
    }

    function isInsideGameGrid(row, col, size = 8) {
        return row >= 0 && row < size && col >= 0 && col < size;
    }

    function getChessOpponentColor(color) {
        return color === 'white' ? 'black' : 'white';
    }

    function getChessKingPositionForState(state, color) {
        for (let row = 0; row < CHESS_SIZE; row += 1) {
            for (let col = 0; col < CHESS_SIZE; col += 1) {
                const piece = state?.board?.[row]?.[col];
                if (piece?.type === 'king' && piece.color === color) {
                    return { row, col };
                }
            }
        }

        return null;
    }

    function isChessSquareUnderAttack(state, targetRow, targetCol, attackerColor) {
        for (let row = 0; row < CHESS_SIZE; row += 1) {
            for (let col = 0; col < CHESS_SIZE; col += 1) {
                const piece = state?.board?.[row]?.[col];
                if (!piece || piece.color !== attackerColor) {
                    continue;
                }

                if (getChessAttackMoves(state, row, col).some((move) => move.row === targetRow && move.col === targetCol)) {
                    return true;
                }
            }
        }

        return false;
    }

    function isChessKingInCheckForState(state, color) {
        const kingPosition = getChessKingPositionForState(state, color);
        if (!kingPosition) {
            return false;
        }

        return isChessSquareUnderAttack(state, kingPosition.row, kingPosition.col, getChessOpponentColor(color));
    }

    function canChessCastle(state, row, col, side) {
        const king = state?.board?.[row]?.[col];
        if (!king || king.type !== 'king' || king.hasMoved) {
            return null;
        }

        const rookCol = side === 'king' ? CHESS_SIZE - 1 : 0;
        const rook = state.board[row]?.[rookCol];
        if (!rook || rook.type !== 'rook' || rook.color !== king.color || rook.hasMoved) {
            return null;
        }

        const direction = side === 'king' ? 1 : -1;
        const targetCol = col + (direction * 2);

        for (let nextCol = col + direction; nextCol !== rookCol; nextCol += direction) {
            if (state.board[row][nextCol]) {
                return null;
            }
        }

        if (isChessKingInCheckForState(state, king.color)) {
            return null;
        }

        const opponentColor = getChessOpponentColor(king.color);
        for (let step = 1; step <= 2; step += 1) {
            const passingCol = col + (direction * step);
            if (isChessSquareUnderAttack(state, row, passingCol, opponentColor)) {
                return null;
            }
        }

        return { row, col: targetCol, castle: side };
    }

    function shouldFlipChessBoardPerspective() {
        return isMultiplayerChessActive() && getMultiplayerChessRole() === 'black';
    }

    function getDisplayChessPosition(row, col) {
        if (!shouldFlipChessBoardPerspective()) {
            return { row, col };
        }

        return {
            row: CHESS_SIZE - 1 - row,
            col: CHESS_SIZE - 1 - col
        };
    }

    function getBoardChessPosition(displayRow, displayCol) {
        if (!shouldFlipChessBoardPerspective()) {
            return { row: displayRow, col: displayCol };
        }

        return {
            row: CHESS_SIZE - 1 - displayRow,
            col: CHESS_SIZE - 1 - displayCol
        };
    }


    function cloneChessStateSnapshot(state) {
        return {
            ...state,
            board: state.board.map((row) => row.map((piece) => (piece ? { ...piece } : null))),
            lastMove: state.lastMove
                ? {
                    ...state.lastMove,
                    capture: state.lastMove.capture ? { ...state.lastMove.capture } : null
                }
                : null
        };
    }

    function applyChessMoveToState(state, fromRow, fromCol, toRow, toCol) {
        const movingPiece = state.board[fromRow][fromCol];
        if (!movingPiece) {
            return state;
        }

        const nextState = cloneChessStateSnapshot(state);
        const nextPiece = { ...movingPiece, hasMoved: true };
        const capturedPiece = nextState.board[toRow][toCol];
        nextState.board[toRow][toCol] = nextPiece;
        nextState.board[fromRow][fromCol] = null;

        if (nextPiece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
            const rookFromCol = toCol > fromCol ? CHESS_SIZE - 1 : 0;
            const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
            const rookPiece = nextState.board[toRow][rookFromCol];
            if (rookPiece) {
                nextState.board[toRow][rookToCol] = { ...rookPiece, hasMoved: true };
                nextState.board[toRow][rookFromCol] = null;
            }
        }

        if (nextPiece.type === 'pawn' && (toRow === 0 || toRow === CHESS_SIZE - 1)) {
            nextState.board[toRow][toCol] = createChessPiece('queen', nextPiece.color);
            nextState.board[toRow][toCol].hasMoved = true;
        }

        nextState.lastMove = {
            fromRow,
            fromCol,
            toRow,
            toCol,
            pieceType: movingPiece.type,
            capture: capturedPiece ? { row: toRow, col: toCol } : null,
            captureColor: capturedPiece?.color || null
        };
        nextState.turn = movingPiece.color === 'white' ? 'black' : 'white';
        nextState.winner = capturedPiece?.type === 'king' ? movingPiece.color : null;

        return nextState;
    }

    function getChessPieceGlyph(type) {
        switch (type) {
        case 'pawn':
            return '\u265F';
        case 'rook':
            return '\u265C';
        case 'knight':
            return '\u265E';
        case 'bishop':
            return '\u265D';
        case 'queen':
            return '\u265B';
        case 'king':
            return '\u265A';
        default:
            return '';
        }
    }

    function getChessMovesForState(state, row, col) {
        const piece = state?.board?.[row]?.[col];

        if (!piece || piece.color !== state.turn || state.winner) {
            return [];
        }

        const moves = [];
        const addMove = (nextRow, nextCol) => {
            if (!isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
                return;
            }

            const target = state.board[nextRow][nextCol];
            if (!target || target.color !== piece.color) {
                moves.push({ row: nextRow, col: nextCol });
            }
        };
        const addSlideMoves = (directions) => {
            directions.forEach(([rowStep, colStep]) => {
                let nextRow = row + rowStep;
                let nextCol = col + colStep;

                while (isInsideGameGrid(nextRow, nextCol, CHESS_SIZE)) {
                    const target = state.board[nextRow][nextCol];

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
            if (isInsideGameGrid(row + direction, col, CHESS_SIZE) && !state.board[row + direction][col]) {
                moves.push({ row: row + direction, col });
                const doubleRow = row + direction * 2;
                const startRow = piece.color === 'white' ? 6 : 1;
                if (row === startRow && !state.board[doubleRow][col]) {
                    moves.push({ row: doubleRow, col });
                }
            }

            [-1, 1].forEach((deltaCol) => {
                const attackRow = row + direction;
                const attackCol = col + deltaCol;
                if (!isInsideGameGrid(attackRow, attackCol, CHESS_SIZE)) {
                    return;
                }
                const target = state.board[attackRow][attackCol];
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

        const kingPiece = piece.type === 'king' ? piece : null;
        if (kingPiece) {
            const kingSideCastle = canChessCastle(state, row, col, 'king');
            const queenSideCastle = canChessCastle(state, row, col, 'queen');
            if (kingSideCastle) {
                moves.push(kingSideCastle);
            }
            if (queenSideCastle) {
                moves.push(queenSideCastle);
            }
        }

        return moves.filter((move) => {
            const previewState = applyChessMoveToState(state, row, col, move.row, move.col);
            return !isChessKingInCheckForState(previewState, piece.color);
        });
    }

    function getChessMoves(row, col) {
        return getChessMovesForState(chessState, row, col);
    }

    function canInteractWithChessPiece(row, col) {
        const piece = chessState?.board?.[row]?.[col];
        if (!piece || chessState?.winner) {
            return false;
        }

        if (isMultiplayerChessActive()) {
            return chessState.turn === getMultiplayerChessRole() && piece.color === chessState.turn;
        }

        return !isChessAiTurn() && piece.color === chessState.turn;
    }

    function getChessMoveFromSelection(row, col) {
        if (!chessSelectedSquare) {
            return null;
        }

        return getChessMoves(chessSelectedSquare.row, chessSelectedSquare.col)
            .find((candidate) => candidate.row === row && candidate.col === col) || null;
    }

    function submitChessMove(toRow, toCol) {
        const move = getChessMoveFromSelection(toRow, toCol);
        if (!move || !chessSelectedSquare) {
            return false;
        }

        if (isMultiplayerChessActive()) {
            multiplayerSocket?.emit('chess:move', {
                fromRow: chessSelectedSquare.row,
                fromCol: chessSelectedSquare.col,
                toRow,
                toCol
            });
            return true;
        }

        return applyChessMove(chessSelectedSquare.row, chessSelectedSquare.col, toRow, toCol);
    }

    function clearChessDragState(shouldRender = true) {
        chessDragState = null;
        chessBoard?.classList.remove('is-dragging-piece');
        document.querySelector('.chess-drag-ghost')?.remove();
        if (shouldRender) {
            renderChess();
        }
    }

    function updateChessDragPointer(clientX, clientY) {
        if (!chessDragState || !chessDragState.dragging || !chessBoard) {
            return;
        }

        chessDragState.pointerX = clientX;
        chessDragState.pointerY = clientY;

        const hoveredCell = document.elementFromPoint(clientX, clientY)?.closest?.('[data-chess-cell]');
        chessDragState.hoveredCell = hoveredCell?.dataset?.chessCell || null;

        renderChess();
    }

    function startChessPieceDrag(clientX, clientY) {
        if (!chessDragState) {
            return;
        }

        chessDragState.dragging = true;
        chessDragState.pointerX = clientX;
        chessDragState.pointerY = clientY;
        chessBoard?.classList.add('is-dragging-piece');
        updateChessDragPointer(clientX, clientY);
    }

    function renderChessDragGhost() {
        document.querySelector('.chess-drag-ghost')?.remove();

        if (!chessDragState?.dragging) {
            return;
        }

        const piece = chessState?.board?.[chessDragState.row]?.[chessDragState.col];
        if (!piece) {
            return;
        }

        const ghost = document.createElement('div');
        ghost.className = `chess-drag-ghost chess-piece chess-piece-${piece.color} chess-piece-${piece.type}`;
        ghost.textContent = getChessPieceGlyph(piece.type);
        ghost.style.left = `${chessDragState.pointerX}px`;
        ghost.style.top = `${chessDragState.pointerY}px`;
        document.body.appendChild(ghost);
    }

    function finishChessPieceDrag(clientX, clientY) {
        if (!chessDragState) {
            return;
        }

        const wasDragging = chessDragState.dragging;
        const source = { row: chessDragState.row, col: chessDragState.col };
        const legalMove = wasDragging
            ? (() => {
                const hoveredCell = document.elementFromPoint(clientX, clientY)?.closest?.('[data-chess-cell]');
                if (!hoveredCell?.dataset?.chessCell) {
                    return null;
                }
                const [targetRow, targetCol] = hoveredCell.dataset.chessCell.split('-').map(Number);
                return getChessMoves(source.row, source.col)
                    .find((candidate) => candidate.row === targetRow && candidate.col === targetCol) || null;
            })()
            : null;

        chessSuppressNextClick = wasDragging;
        clearChessDragState(false);
        chessSelectedSquare = source;

        if (legalMove) {
            submitChessMove(legalMove.row, legalMove.col);
            return;
        }

        renderChess();
    }

    function handleChessPiecePointerDown(event, row, col) {
        if (event.button !== 0 || !canInteractWithChessPiece(row, col)) {
            return;
        }

        chessSelectedSquare = { row, col };
        chessDragState = {
            row,
            col,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            pointerX: event.clientX,
            pointerY: event.clientY,
            dragging: false,
            hoveredCell: null
        };
        renderChess();
    }

    function handleChessPointerMove(event) {
        if (!chessDragState || chessDragState.pointerId !== event.pointerId) {
            return;
        }

        const distance = Math.hypot(event.clientX - chessDragState.startX, event.clientY - chessDragState.startY);
        if (!chessDragState.dragging && distance >= 8) {
            startChessPieceDrag(event.clientX, event.clientY);
            return;
        }

        updateChessDragPointer(event.clientX, event.clientY);
    }

    function handleChessPointerUp(event) {
        if (!chessDragState || chessDragState.pointerId !== event.pointerId) {
            return;
        }

        finishChessPieceDrag(event.clientX, event.clientY);
    }

    function renderChess() {
        const legalMoves = chessSelectedSquare ? getChessMoves(chessSelectedSquare.row, chessSelectedSquare.col) : [];
        const whiteInCheck = isChessKingInCheck('white');
        const blackInCheck = isChessKingInCheck('black');
        const checkedColor = whiteInCheck ? 'white' : (blackInCheck ? 'black' : null);
        const checkedKingPosition = checkedColor ? getChessKingPosition(checkedColor) : null;
        const nextAnimationKey = getBoardMoveAnimationKey(chessState.lastMove);
        const shouldAnimateLastMove = Boolean(chessState.lastMove) && nextAnimationKey !== chessLastMoveAnimationKey;
        chessBoard.classList.toggle('is-check', Boolean(checkedColor) && !chessState.winner);
        chessBoard.classList.toggle('is-checkmate', Boolean(chessState.winner));
        if (isMultiplayerChessActive()) {
            const currentRole = getMultiplayerChessRole();
            chessTurnDisplay.textContent = chessState.turn === currentRole ? 'Toi' : 'Adversaire';
            chessStatusDisplay.textContent = chessState.winner
                ? (chessState.winner === currentRole ? 'Victoire' : 'D\u00e9faite')
                : (checkedColor === currentRole ? '\u00c9chec' : (checkedColor ? 'Tu mets \u00e9chec' : 'En cours'));
            chessHelpText.textContent = chessState.winner
                ? (chessState.winner === currentRole ? "\u00c9chec et mat. Tu contr\u00f4les l'\u00e9chiquier." : "\u00c9chec et mat. L'adversaire contr\u00f4le l'\u00e9chiquier.")
                : (chessState.turn === currentRole
                    ? (checkedColor === currentRole ? 'Ton roi est en \u00e9chec.' : '\u00c0 toi de jouer.')
                    : (checkedColor ? 'Le roi est en echec.' : "Au tour de l'adversaire."));
        } else {
            chessTurnDisplay.textContent = chessState.turn === 'white'
                ? (chessMode === 'solo' ? 'Toi' : 'Blancs')
                : (chessMode === 'solo' ? 'IA' : 'Noirs');
            chessStatusDisplay.textContent = chessState.winner
                ? `${chessState.winner === 'white' ? (chessMode === 'solo' ? 'Toi' : 'Blancs') : (chessMode === 'solo' ? 'IA' : 'Noirs')} gagnent`
                : (checkedColor
                    ? `\u00c9chec ${checkedColor === 'white' ? 'blanc' : 'noir'}`
                    : 'En cours');
            chessHelpText.textContent = chessState.winner
                ? `\u00c9chec et mat. ${chessState.winner === 'white' ? (chessMode === 'solo' ? 'Tu remportes' : 'Les Blancs remportent') : (chessMode === 'solo' ? "L'IA remporte" : 'Les Noirs remportent')} la partie.`
                : (chessMode === 'solo'
                    ? (checkedColor === 'white' ? 'Ton roi est en echec.' : (checkedColor === 'black' ? 'Le roi adverse est en echec.' : 'Mode 1 joueur: blancs contre IA. Promotion en reine, avec roque.'))
                    : (checkedColor ? `Le roi ${checkedColor === 'white' ? 'blanc' : 'noir'} est en echec.` : 'Mode 2 joueurs: blancs et noirs en tour par tour. Promotion en reine, avec roque.'));
        }
        chessModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.chessMode === chessMode);
            button.disabled = isMultiplayerChessActive();
        });
        chessBoard.innerHTML = Array.from({ length: CHESS_SIZE }, (_, displayRow) => Array.from({ length: CHESS_SIZE }, (_, displayCol) => {
            const { row, col } = getBoardChessPosition(displayRow, displayCol);
            const piece = chessState.board[row][col];
            const dark = (row + col) % 2 === 1;
            const selected = chessSelectedSquare?.row === row && chessSelectedSquare?.col === col;
            const playable = legalMoves.some((move) => move.row === row && move.col === col);
            const captureHit = isBoardCaptureCell(chessState.lastMove, row, col);
            const pieceAnimation = getBoardMoveAnimationMetadata(
                shouldAnimateLastMove ? chessState.lastMove : null,
                row,
                col,
                shouldFlipChessBoardPerspective()
            );
            const checkedKing = checkedKingPosition?.row === row && checkedKingPosition?.col === col;
            const rankLabel = displayCol === 0 ? String(CHESS_SIZE - row) : '';
            const fileLabel = displayRow === CHESS_SIZE - 1 ? String.fromCharCode(97 + col) : '';
            return `
                <button
                    type="button"
                    class="chess-cell ${dark ? 'is-dark' : 'is-light'} ${selected ? 'is-selected' : ''} ${playable ? 'is-move' : ''} ${captureHit ? 'is-capture-hit' : ''} ${checkedKing ? 'is-check-king' : ''}"
                    data-chess-cell="${row}-${col}"
                >
                    ${rankLabel ? `<span class="chess-coordinate chess-coordinate-rank">${rankLabel}</span>` : ''}
                    ${fileLabel ? `<span class="chess-coordinate chess-coordinate-file">${fileLabel}</span>` : ''}
                    ${piece ? `<span class="chess-piece chess-piece-${piece.color} chess-piece-${piece.type} ${pieceAnimation.className}${chessDragState?.row === row && chessDragState?.col === col ? ' is-drag-source' : ''}${chessDragState?.hoveredCell === `${row}-${col}` && legalMoves.some((move) => move.row === row && move.col === col) ? ' is-drag-target' : ''}" ${pieceAnimation.style} data-chess-piece="${row}-${col}">${getChessPieceGlyph(piece.type)}</span>` : ''}
                </button>
            `;
        }).join('')).join('');
        renderChessDragGhost();

        if (chessState.lastMove && shouldAnimateLastMove) {
            scheduleChessMoveAnimationClear();
        }
        chessLastMoveAnimationKey = nextAnimationKey;
        maybePlayChessCaptureFx();
        maybeOpenChessOutcomeModal();
    }

    function handleChessCellClick(row, col) {
        const piece = chessState.board[row][col];
        if (piece && canInteractWithChessPiece(row, col)) {
            chessSelectedSquare = { row, col };
            renderChess();
            return;
        }

        if (!chessSelectedSquare) {
            return;
        }

        if (!submitChessMove(row, col)) {
            chessSelectedSquare = null;
            renderChess();
            return;
        }
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

        const nextPiece = { ...movingPiece, hasMoved: true };
        const capturedPiece = chessState.board[toRow][toCol];
        chessState.board[toRow][toCol] = nextPiece;
        chessState.board[fromRow][fromCol] = null;

        if (nextPiece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
            const rookFromCol = toCol > fromCol ? CHESS_SIZE - 1 : 0;
            const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
            const rookPiece = chessState.board[toRow][rookFromCol];
            if (rookPiece) {
                chessState.board[toRow][rookToCol] = { ...rookPiece, hasMoved: true };
                chessState.board[toRow][rookFromCol] = null;
            }
        }

        if (nextPiece.type === 'pawn' && (toRow === 0 || toRow === CHESS_SIZE - 1)) {
            chessState.board[toRow][toCol] = createChessPiece('queen', nextPiece.color);
        }

        chessSelectedSquare = null;
        chessState.lastMove = {
            fromRow,
            fromCol,
            toRow,
            toCol,
            pieceType: movingPiece.type,
            capture: capturedPiece ? { row: toRow, col: toCol } : null,
            captureColor: capturedPiece?.color || null
        };

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

    function getChessAllMovesForState(state, color) {
        const moves = [];

        for (let row = 0; row < CHESS_SIZE; row += 1) {
            for (let col = 0; col < CHESS_SIZE; col += 1) {
                const piece = state.board[row][col];
                if (!piece || piece.color !== color) {
                    continue;
                }

                const legalMoves = getChessMovesForState(state, row, col);
                legalMoves.forEach((move) => {
                    moves.push({
                        fromRow: row,
                        fromCol: col,
                        toRow: move.row,
                        toCol: move.col,
                        piece,
                        target: state.board[move.row][move.col]
                    });
                });
            }
        }

        return moves;
    }

    function getChessAllMoves(color) {
        return getChessAllMovesForState(chessState, color);
    }

    function evaluateChessBoard(state) {
        const pieceValues = {
            pawn: 100,
            knight: 320,
            bishop: 335,
            rook: 500,
            queen: 900,
            king: 20000
        };
        const centerBonusByType = {
            pawn: 8,
            knight: 18,
            bishop: 14,
            rook: 6,
            queen: 8,
            king: 4
        };

        let score = 0;

        for (let row = 0; row < CHESS_SIZE; row += 1) {
            for (let col = 0; col < CHESS_SIZE; col += 1) {
                const piece = state.board[row][col];
                if (!piece) {
                    continue;
                }

                const baseValue = pieceValues[piece.type] || 0;
                const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col);
                const centerBonus = Math.max(0, 4 - centerDistance) * (centerBonusByType[piece.type] || 0);
                const developmentBonus = piece.type === 'pawn'
                    ? (piece.color === 'black' ? row * 5 : (7 - row) * 5)
                    : 0;
                const movedBonus = piece.hasMoved && piece.type !== 'pawn' ? 6 : 0;
                const contribution = baseValue + centerBonus + developmentBonus + movedBonus;

                score += piece.color === 'black' ? contribution : -contribution;
            }
        }

        const blackMoves = getChessAllMovesForState(state, 'black').length;
        const whiteMoves = getChessAllMovesForState(state, 'white').length;
        score += (blackMoves - whiteMoves) * 3;

        if (isChessKingInCheckForState(state, 'white')) {
            score += 28;
        }

        if (isChessKingInCheckForState(state, 'black')) {
            score -= 28;
        }

        return score;
    }

    function minimaxChess(state, depth, maximizingPlayer, alpha, beta) {
        if (state.winner === 'black') {
            return 1000000 + depth;
        }

        if (state.winner === 'white') {
            return -1000000 - depth;
        }

        if (depth === 0) {
            return evaluateChessBoard(state);
        }

        const color = maximizingPlayer ? 'black' : 'white';
        const moves = getChessAllMovesForState(state, color);

        if (!moves.length) {
            return maximizingPlayer ? -1000000 - depth : 1000000 + depth;
        }

        if (maximizingPlayer) {
            let bestScore = -Infinity;

            for (const move of moves) {
                const nextState = applyChessMoveToState(state, move.fromRow, move.fromCol, move.toRow, move.toCol);
                const score = minimaxChess(nextState, depth - 1, false, alpha, beta);
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, score);

                if (beta <= alpha) {
                    break;
                }
            }

            return bestScore;
        }

        let bestScore = Infinity;

        for (const move of moves) {
            const nextState = applyChessMoveToState(state, move.fromRow, move.fromCol, move.toRow, move.toCol);
            const score = minimaxChess(nextState, depth - 1, true, alpha, beta);
            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, score);

            if (beta <= alpha) {
                break;
            }
        }

        return bestScore;
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

            const moves = getChessAllMoves('black');
            if (!moves.length) {
                chessState.winner = 'white';
                renderChess();
                return;
            }

            let bestScore = -Infinity;
            let bestMoves = [];
            const searchDepth = moves.length <= 10 ? 3 : 2;

            moves.forEach((move) => {
                const previewState = applyChessMoveToState(chessState, move.fromRow, move.fromCol, move.toRow, move.toCol);
                let score = minimaxChess(previewState, searchDepth - 1, false, -Infinity, Infinity);
                score += Math.random() * 0.12;

                if (move.target) {
                    score += 14;
                }

                if (move.piece.type === 'king' && Math.abs(move.toCol - move.fromCol) === 2) {
                    score += 20;
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
        if (isMultiplayerChessActive()) {
            setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
            return;
        }

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
        if (isMultiplayerCheckersActive()) {
            syncMultiplayerCheckersState();
            return;
        }

        checkersLastMoveAnimationKey = '';
        checkersLastCaptureFxKey = '';
        if (checkersLastMoveResetTimer) {
            window.clearTimeout(checkersLastMoveResetTimer);
            checkersLastMoveResetTimer = null;
        }
        if (checkersAiTimeout) {
            window.clearTimeout(checkersAiTimeout);
            checkersAiTimeout = null;
        }
        checkersState = {
            board: createInitialCheckersBoard(),
            turn: 'red',
            winner: null,
            lastMove: null
        };
        checkersSelectedSquare = null;
        checkersMenuVisible = true;
        checkersMenuShowingRules = false;
        checkersMenuClosing = false;
        checkersMenuEntering = false;
        checkersMenuResult = false;
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
        const nextAnimationKey = getBoardMoveAnimationKey(checkersState.lastMove);
        const shouldAnimateLastMove = Boolean(checkersState.lastMove) && nextAnimationKey !== checkersLastMoveAnimationKey;
        checkersTurnDisplay.textContent = checkersState.winner
            ? '-'
            : (isMultiplayerCheckersActive()
                ? (checkersState.turn === getMultiplayerCheckersRole() ? 'Toi' : 'Adversaire')
                : (checkersState.turn === 'red' ? (checkersMode === 'solo' ? 'Toi' : 'Rouges') : (checkersMode === 'solo' ? 'IA' : 'Noirs')));
        checkersCountDisplay.textContent = `${blackCount}/${redCount}`;
        checkersHelpText.textContent = isMultiplayerCheckersActive()
            ? (checkersState.winner
                ? (checkersState.winner === getMultiplayerCheckersRole() ? 'Tu remportes la partie.' : "L'adversaire remporte la partie.")
                : (checkersState.turn === getMultiplayerCheckersRole() ? '\u00c0 toi de jouer.' : "Au tour de l'adversaire."))
            : (checkersMode === 'solo'
                ? 'Mode 1 joueur : rouges contre IA. Roi à la promotion.'
                : 'Mode 2 joueurs : rouges et noirs en tour par tour. Roi à la promotion.');
        checkersModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.checkersMode === checkersMode);
            button.disabled = isMultiplayerCheckersActive();
        });
        checkersBoard.innerHTML = checkersState.board.map((rowItems, row) => rowItems.map((piece, col) => {
            const dark = (row + col) % 2 === 1;
            const selected = checkersSelectedSquare?.row === row && checkersSelectedSquare?.col === col;
            const playable = legalMoves.some((move) => move.row === row && move.col === col);
            const captureHit = isBoardCaptureCell(checkersState.lastMove, row, col);
            const pieceAnimation = getBoardMoveAnimationMetadata(shouldAnimateLastMove ? checkersState.lastMove : null, row, col);
            return `
                <button type="button" class="checkers-cell ${dark ? 'is-dark' : 'is-light'} ${selected ? 'is-selected' : ''} ${playable ? 'is-move' : ''} ${captureHit ? 'is-capture-hit' : ''}" data-checkers-cell="${row}-${col}">
                    ${piece ? `<span class="checkers-piece ${piece.color === 'red' ? 'is-red' : 'is-black'} ${piece.king ? 'is-king' : ''} ${pieceAnimation.className}" ${pieceAnimation.style}></span>` : ''}
                </button>
            `;
        }).join('')).join('');

        if (checkersState.lastMove && shouldAnimateLastMove) {
            scheduleCheckersMoveAnimationClear();
        }
        checkersLastMoveAnimationKey = nextAnimationKey;
        maybePlayCheckersCaptureFx();
        maybeOpenCheckersOutcomeModal();
        renderCheckersMenu();
    }

    function getCheckersRulesText() {
        return 'Déplace tes pions en diagonale. Capture en sautant par-dessus un pion adverse, et un pion promu devient roi quand il atteint le bout du plateau.';
    }

    function renderCheckersMenu() {
        if (!checkersMenuOverlay || !checkersTable) {
            return;
        }

        syncGameMenuOverlayBounds(checkersMenuOverlay, checkersTable);
        checkersMenuOverlay.classList.toggle('hidden', !checkersMenuVisible);
        checkersMenuOverlay.classList.toggle('is-closing', checkersMenuClosing);
        checkersMenuOverlay.classList.toggle('is-entering', checkersMenuEntering);
        checkersTable.classList.toggle('is-menu-open', checkersMenuVisible);

        if (!checkersMenuVisible) {
            return;
        }

        const multiplayerCheckers = isMultiplayerCheckersActive();
        const hasResult = checkersMenuResult && Boolean(checkersState?.winner);
        if (checkersMenuEyebrow) {
            checkersMenuEyebrow.textContent = checkersMenuShowingRules ? 'R\u00e8gles' : (hasResult ? 'Fin de partie' : 'Baie strat\u00e9gique');
        }
        if (checkersMenuTitle) {
            checkersMenuTitle.textContent = checkersMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult
                    ? (multiplayerCheckers
                        ? (checkersState.winner === getMultiplayerCheckersRole() ? 'Victoire' : "C'est perdu")
                        : (checkersMode === 'solo'
                            ? (checkersState.winner === 'red' ? 'Victoire' : "C'est perdu")
                            : `${checkersState.winner === 'red' ? 'Rouges' : 'Noirs'} gagnent`))
                    : 'Dames');
        }
        if (checkersMenuText) {
            checkersMenuText.textContent = checkersMenuShowingRules
                ? getCheckersRulesText()
                : (hasResult
                    ? (multiplayerCheckers
                        ? (checkersState.winner === getMultiplayerCheckersRole() ? 'Tu remportes cette partie de dames en ligne.' : "L'adversaire remporte cette partie de dames.")
                        : (checkersMode === 'solo'
                            ? (checkersState.winner === 'red' ? 'Tu remportes la partie de dames.' : "L'IA remporte la partie de dames.")
                            : `${checkersState.winner === 'red' ? 'Les Rouges' : 'Les Noirs'} remportent la partie de dames.`))
                    : ((multiplayerCheckers && !multiplayerActiveRoom?.gameLaunched)
                        ? 'Quand tous les joueurs sont pr\u00eats, la partie de dames commence automatiquement.'
                        : "Installe les pions et choisis ton mode avant d'engager la partie."));
        }
        if (checkersMenuActionButton) {
            checkersMenuActionButton.textContent = checkersMenuShowingRules
                ? 'Retour'
                : ((multiplayerCheckers && !multiplayerActiveRoom?.gameLaunched)
                    ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                    : (hasResult ? 'Relancer la partie' : 'Lancer la partie'));
        }
        if (checkersMenuRulesButton) {
            checkersMenuRulesButton.textContent = 'R\u00e8gles';
            checkersMenuRulesButton.hidden = checkersMenuShowingRules;
        }
    }

    function startCheckersLaunchSequence() {
        checkersMenuClosing = true;
        renderCheckersMenu();
        window.setTimeout(() => {
            checkersMenuClosing = false;
            checkersMenuVisible = false;
            checkersMenuShowingRules = false;
            checkersMenuEntering = false;
            checkersMenuResult = false;
            renderCheckersMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealCheckersOutcomeMenu() {
        checkersMenuShowingRules = false;
        checkersMenuClosing = false;
        checkersMenuEntering = true;
        checkersMenuVisible = true;
        checkersMenuResult = true;
        renderCheckersMenu();
        window.setTimeout(() => {
            checkersMenuEntering = false;
            renderCheckersMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function handleCheckersCellClick(row, col) {
        if (checkersMenuVisible || checkersMenuClosing) {
            return;
        }

        if (isMultiplayerCheckersActive()) {
            if (checkersState.winner || checkersState.turn !== getMultiplayerCheckersRole()) {
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

            multiplayerSocket?.emit('checkers:move', {
                fromRow: checkersSelectedSquare.row,
                fromCol: checkersSelectedSquare.col,
                toRow: row,
                toCol: col
            });
            return;
        }

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
        const capturedPiece = move.capture ? checkersState.board[move.capture.row][move.capture.col] : null;
        checkersState.board[fromRow][fromCol] = null;
        checkersState.board[toRow][toCol] = nextPiece;

        if (move.capture) {
            checkersState.board[move.capture.row][move.capture.col] = null;
        }

        if ((nextPiece.color === 'red' && toRow === 0) || (nextPiece.color === 'black' && toRow === CHECKERS_SIZE - 1)) {
            nextPiece.king = true;
        }

        checkersState.lastMove = {
            fromRow,
            fromCol,
            toRow,
            toCol,
            pieceType: movingPiece.king ? 'king' : 'checker',
            capture: move.capture ? { ...move.capture } : null,
            captureColor: capturedPiece?.color || null
        };

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
        if (isMultiplayerCheckersActive()) {
            setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
            return;
        }

        if (!nextMode || nextMode === checkersMode) {
            return;
        }

        checkersMode = nextMode;
        initializeCheckers();
    }

    function isMultiplayerChessActive() {
        return multiplayerActiveRoom?.gameId === 'chess' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function getMultiplayerChessRole() {
        return multiplayerActiveRoom?.players?.find((player) => player.isYou)?.symbol || null;
    }

    function syncMultiplayerChessState() {
        if (!isMultiplayerChessActive()) {
            chessLastMoveAnimationKey = '';
            chessLastFinishedStateKey = '';
            chessLastCaptureFxKey = '';
            return;
        }

        if (chessLastMoveResetTimer) {
            window.clearTimeout(chessLastMoveResetTimer);
            chessLastMoveResetTimer = null;
        }
        if (chessOutcomeMenuTimer) {
            window.clearTimeout(chessOutcomeMenuTimer);
            chessOutcomeMenuTimer = null;
        }
        if (chessOutcomeMenuEnterTimer) {
            window.clearTimeout(chessOutcomeMenuEnterTimer);
            chessOutcomeMenuEnterTimer = null;
        }
        if (chessAiTimeout) {
            window.clearTimeout(chessAiTimeout);
            chessAiTimeout = null;
        }

        chessState = {
            board: multiplayerActiveRoom.gameState.board.map((row) => row.map((piece) => (piece ? { ...piece } : null))),
            turn: multiplayerActiveRoom.gameState.turn,
            winner: multiplayerActiveRoom.gameState.winner,
            lastMove: multiplayerActiveRoom.gameState.lastMove
                ? {
                    ...multiplayerActiveRoom.gameState.lastMove,
                    capture: multiplayerActiveRoom.gameState.lastMove.capture
                        ? { ...multiplayerActiveRoom.gameState.lastMove.capture }
                        : null
                }
                : null
        };
        chessSelectedSquare = null;
        renderChessMenu();
        renderChess();

        const nextFinishedKey = `${multiplayerActiveRoom.gameState.round}:${multiplayerActiveRoom.gameState.winner || 'none'}`;
        if (!multiplayerActiveRoom.gameState.winner) {
            chessLastFinishedStateKey = '';
            chessMenuEntering = false;
            closeGameOverModal();
            return;
        }

        if (nextFinishedKey === chessLastFinishedStateKey || activeGameTab !== 'chess') {
            return;
        }

        chessLastFinishedStateKey = nextFinishedKey;
        revealChessOutcomeMenuWithDelay();
    }

    function isMultiplayerCheckersActive() {
        return multiplayerActiveRoom?.gameId === 'checkers' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function getMultiplayerCheckersRole() {
        return multiplayerActiveRoom?.players?.find((player) => player.isYou)?.symbol || null;
    }

    function syncMultiplayerCheckersState() {
        if (!isMultiplayerCheckersActive()) {
            checkersLastFinishedStateKey = '';
            checkersLastMoveAnimationKey = '';
            checkersLastCaptureFxKey = '';
            return;
        }

        if (checkersLastMoveResetTimer) {
            window.clearTimeout(checkersLastMoveResetTimer);
            checkersLastMoveResetTimer = null;
        }
        if (checkersAiTimeout) {
            window.clearTimeout(checkersAiTimeout);
            checkersAiTimeout = null;
        }

        checkersState = {
            board: multiplayerActiveRoom.gameState.board.map((row) => row.map((piece) => (piece ? { ...piece } : null))),
            turn: multiplayerActiveRoom.gameState.turn,
            winner: multiplayerActiveRoom.gameState.winner,
            lastMove: multiplayerActiveRoom.gameState.lastMove
                ? {
                    ...multiplayerActiveRoom.gameState.lastMove,
                    capture: multiplayerActiveRoom.gameState.lastMove.capture
                        ? { ...multiplayerActiveRoom.gameState.lastMove.capture }
                        : null
                }
                : null
        };
        checkersSelectedSquare = null;
        checkersMenuVisible = false;
        checkersMenuShowingRules = false;
        checkersMenuClosing = false;
        checkersMenuResult = Boolean(multiplayerActiveRoom.gameState.winner);
        if (!checkersState.lastMove) {
            checkersLastMoveAnimationKey = '';
        }
        renderCheckers();

        const nextFinishedKey = `${multiplayerActiveRoom.gameState.round}:${multiplayerActiveRoom.gameState.winner || 'none'}`;
        if (!multiplayerActiveRoom.gameState.winner) {
            checkersLastFinishedStateKey = '';
            checkersMenuEntering = false;
            checkersMenuResult = false;
            closeGameOverModal();
            return;
        }

        if (nextFinishedKey === checkersLastFinishedStateKey || activeGameTab !== 'checkers') {
            return;
        }

        checkersLastFinishedStateKey = nextFinishedKey;
        revealCheckersOutcomeMenu();
    }

    function isMultiplayerBattleshipActive() {
        return multiplayerActiveRoom?.gameId === 'battleship' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function getMultiplayerBattleshipRole() {
        return multiplayerActiveRoom?.players?.find((player) => player.isYou)?.symbol || null;
    }

    function syncMultiplayerBattleshipState() {
        if (!isMultiplayerBattleshipActive()) {
            battleshipLastFinishedStateKey = '';
            return;
        }

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
        if (nextFinishedKey === battleshipLastFinishedStateKey || activeGameTab !== 'battleship') {
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

    function isMultiplayerAirHockeyActive() {
        return multiplayerActiveRoom?.gameId === 'airHockey' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function getMultiplayerAirHockeyRole() {
        return multiplayerActiveRoom?.players?.find((player) => player.isYou)?.symbol || null;
    }

    function getMultiplayerAirHockeyInput() {
        const vertical = (airHockeyKeys.has('s') || airHockeyKeys.has('arrowdown') ? 1 : 0) - (airHockeyKeys.has('z') || airHockeyKeys.has('arrowup') ? 1 : 0);
        const horizontal = (airHockeyKeys.has('d') || airHockeyKeys.has('arrowright') ? 1 : 0) - (airHockeyKeys.has('q') || airHockeyKeys.has('arrowleft') ? 1 : 0);
        const magnitude = Math.hypot(horizontal, vertical);

        if (magnitude > 1) {
            return {
                x: horizontal / magnitude,
                y: vertical / magnitude
            };
        }

        return { x: horizontal, y: vertical };
    }

    function pushMultiplayerAirHockeyInput() {
        if (!isMultiplayerAirHockeyActive() || !multiplayerSocket?.connected) {
            return;
        }

        const nextInput = getMultiplayerAirHockeyInput();
        const sameInput = Math.abs(nextInput.x - airHockeyMultiplayerInput.x) < 0.001 && Math.abs(nextInput.y - airHockeyMultiplayerInput.y) < 0.001;

        if (sameInput) {
            return;
        }

        airHockeyMultiplayerInput = nextInput;
        multiplayerSocket.emit('airhockey:input', nextInput);
        ensureMultiplayerAirHockeyRenderLoop();
    }

    function resetMultiplayerAirHockeyInput() {
        airHockeyKeys.clear();
        airHockeyLocalPredicted = null;
        if (!isMultiplayerAirHockeyActive() || !multiplayerSocket?.connected) {
            airHockeyMultiplayerInput = { x: 0, y: 0 };
            return;
        }

        airHockeyMultiplayerInput = { x: 0, y: 0 };
        multiplayerSocket.emit('airhockey:input', { x: 0, y: 0 });
    }

    function ensureMultiplayerAirHockeyRenderLoop() {
        if (airHockeyRenderAnimationFrame || !isMultiplayerAirHockeyActive()) {
            return;
        }

        const tick = (timestamp) => {
            airHockeyRenderAnimationFrame = null;

            if (!isMultiplayerAirHockeyActive() || !airHockeyState || !airHockeyDisplayState) {
                airHockeyRenderLastFrame = 0;
                return;
            }

            if (airHockeyState.finished || airHockeyMenuVisible) {
                airHockeyRenderLastFrame = 0;
                renderAirHockey();
                return;
            }

            if (!airHockeyRenderLastFrame) {
                airHockeyRenderLastFrame = timestamp;
            }

            const delta = Math.min((timestamp - airHockeyRenderLastFrame) / 1000, 0.05);
            airHockeyRenderLastFrame = timestamp;
            const role = getMultiplayerAirHockeyRole();
            const input = getMultiplayerAirHockeyInput();
            const paddleCorrection = Math.min(1, delta * 10);
            const puckCorrection = Math.min(1, delta * 9);
            const shouldSimulatePuck = airHockeyState.running && !airHockeyState.countdownActive && !multiplayerActiveRoom?.gameState?.finished;

            if (role === 'left') {
                if (!airHockeyLocalPredicted) {
                    airHockeyLocalPredicted = { x: airHockeyState.left.x, y: airHockeyState.left.y };
                }
                airHockeyLocalPredicted.x += input.x * AIR_HOCKEY_SPEED * delta;
                airHockeyLocalPredicted.y += input.y * AIR_HOCKEY_SPEED * delta;
                airHockeyLocalPredicted.x = Math.max(airHockeyState.left.radius, Math.min((airHockeyState.width * 0.5) - AIR_HOCKEY_CENTER_GAP - airHockeyState.left.radius, airHockeyLocalPredicted.x));
                airHockeyLocalPredicted.y = Math.max(airHockeyState.left.radius, Math.min(airHockeyState.height - airHockeyState.left.radius, airHockeyLocalPredicted.y));
                if (input.x === 0 && input.y === 0) {
                    const gapX = airHockeyState.left.x - airHockeyLocalPredicted.x;
                    const gapY = airHockeyState.left.y - airHockeyLocalPredicted.y;
                    if (Math.abs(gapX) <= 18) {
                        airHockeyLocalPredicted.x += gapX * paddleCorrection;
                    }
                    if (Math.abs(gapY) <= 18) {
                        airHockeyLocalPredicted.y += gapY * paddleCorrection;
                    }
                }
                airHockeyDisplayState.left.x = airHockeyLocalPredicted.x;
                airHockeyDisplayState.left.y = airHockeyLocalPredicted.y;
                airHockeyDisplayState.right.x += (airHockeyState.right.x - airHockeyDisplayState.right.x) * paddleCorrection;
                airHockeyDisplayState.right.y += (airHockeyState.right.y - airHockeyDisplayState.right.y) * paddleCorrection;
            } else if (role === 'right') {
                if (!airHockeyLocalPredicted) {
                    airHockeyLocalPredicted = { x: airHockeyState.right.x, y: airHockeyState.right.y };
                }
                airHockeyLocalPredicted.x += input.x * AIR_HOCKEY_SPEED * delta;
                airHockeyLocalPredicted.y += input.y * AIR_HOCKEY_SPEED * delta;
                airHockeyLocalPredicted.x = Math.max((airHockeyState.width * 0.5) + AIR_HOCKEY_CENTER_GAP + airHockeyState.right.radius, Math.min(airHockeyState.width - airHockeyState.right.radius, airHockeyLocalPredicted.x));
                airHockeyLocalPredicted.y = Math.max(airHockeyState.right.radius, Math.min(airHockeyState.height - airHockeyState.right.radius, airHockeyLocalPredicted.y));
                if (input.x === 0 && input.y === 0) {
                    const gapX = airHockeyState.right.x - airHockeyLocalPredicted.x;
                    const gapY = airHockeyState.right.y - airHockeyLocalPredicted.y;
                    if (Math.abs(gapX) <= 18) {
                        airHockeyLocalPredicted.x += gapX * paddleCorrection;
                    }
                    if (Math.abs(gapY) <= 18) {
                        airHockeyLocalPredicted.y += gapY * paddleCorrection;
                    }
                }
                airHockeyDisplayState.right.x = airHockeyLocalPredicted.x;
                airHockeyDisplayState.right.y = airHockeyLocalPredicted.y;
                airHockeyDisplayState.left.x += (airHockeyState.left.x - airHockeyDisplayState.left.x) * paddleCorrection;
                airHockeyDisplayState.left.y += (airHockeyState.left.y - airHockeyDisplayState.left.y) * paddleCorrection;
            } else {
                airHockeyDisplayState.left.x += (airHockeyState.left.x - airHockeyDisplayState.left.x) * paddleCorrection;
                airHockeyDisplayState.left.y += (airHockeyState.left.y - airHockeyDisplayState.left.y) * paddleCorrection;
                airHockeyDisplayState.right.x += (airHockeyState.right.x - airHockeyDisplayState.right.x) * paddleCorrection;
                airHockeyDisplayState.right.y += (airHockeyState.right.y - airHockeyDisplayState.right.y) * paddleCorrection;
            }

            if (shouldSimulatePuck) {
                airHockeyDisplayState.puck.x += airHockeyState.puck.vx * delta;
                airHockeyDisplayState.puck.y += airHockeyState.puck.vy * delta;
            }
            airHockeyDisplayState.puck.x += (airHockeyState.puck.x - airHockeyDisplayState.puck.x) * puckCorrection;
            airHockeyDisplayState.puck.y += (airHockeyState.puck.y - airHockeyDisplayState.puck.y) * puckCorrection;

            const remainingMs = Math.max(0, airHockeyCountdownEndsAt - Date.now());
            if (remainingMs) {
                showAirHockeyCountdown(remainingMs > 1860 ? '3' : remainingMs > 1240 ? '2' : remainingMs > 620 ? '1' : 'GO');
            } else {
                hideAirHockeyCountdown();
            }

            renderAirHockey();
            airHockeyRenderAnimationFrame = window.requestAnimationFrame(tick);
        };

        airHockeyRenderAnimationFrame = window.requestAnimationFrame(tick);
    }

    function syncMultiplayerAirHockeyState() {
        if (!isMultiplayerAirHockeyActive()) {
            stopAirHockeyRuntime();
            airHockeyDisplayState = null;
            airHockeyLocalPredicted = null;
            airHockeyCountdownEndsAt = 0;
            airHockeyLastFinishedStateKey = '';
            return;
        }

        if (airHockeyAnimationFrame) {
            window.cancelAnimationFrame(airHockeyAnimationFrame);
            airHockeyAnimationFrame = null;
        }
        airHockeyLastFrame = 0;
        hideAirHockeyCountdown();

        const nextState = multiplayerActiveRoom.gameState;
        airHockeyState = {
            leftScore: Number(nextState.leftScore || 0),
            rightScore: Number(nextState.rightScore || 0),
            running: Boolean(nextState.running),
            servingSide: nextState.servingSide || 'left',
            width: Number(nextState.width || 720),
            height: Number(nextState.height || 360),
            left: { ...nextState.left },
            right: { ...nextState.right },
            puck: { ...nextState.puck },
            countdownActive: Boolean(nextState.countdownEndsAt && nextState.countdownEndsAt > Date.now()),
            finished: Boolean(nextState.finished),
            winner: nextState.winner || null,
            round: Number(nextState.round || 0)
        };

        const shouldSnap = !airHockeyDisplayState
            || airHockeyDisplayState.round !== airHockeyState.round
            || Math.abs(airHockeyDisplayState.puck.x - airHockeyState.puck.x) > 120
            || Math.abs(airHockeyDisplayState.puck.y - airHockeyState.puck.y) > 80;

        if (shouldSnap) {
            airHockeyDisplayState = JSON.parse(JSON.stringify(airHockeyState));
            airHockeyLocalPredicted = getMultiplayerAirHockeyRole() === 'right'
                ? { x: airHockeyState.right.x, y: airHockeyState.right.y }
                : { x: airHockeyState.left.x, y: airHockeyState.left.y };
        } else {
            airHockeyDisplayState.round = airHockeyState.round;
        }

        airHockeyCountdownEndsAt = Number(nextState.countdownEndsAt || 0);
        if (airHockeyCountdownEndsAt > Date.now()) {
            const remainingMs = Math.max(0, airHockeyCountdownEndsAt - Date.now());
            showAirHockeyCountdown(remainingMs > 1860 ? '3' : remainingMs > 1240 ? '2' : remainingMs > 620 ? '1' : 'GO');
        } else {
            hideAirHockeyCountdown();
        }
        airHockeyLeftScoreDisplay.textContent = String(airHockeyState.leftScore);
        airHockeyRightScoreDisplay.textContent = String(airHockeyState.rightScore);
        airHockeyModeButtons.forEach((button) => {
            button.classList.remove('is-active');
            button.disabled = true;
        });
        airHockeyStartButton.textContent = getCurrentMultiplayerPlayer()?.isHost ? 'Lancer' : 'En attente';
        airHockeyStartButton.disabled = !getCurrentMultiplayerPlayer()?.isHost || (multiplayerActiveRoom?.playerCount || 0) < 2;
        airHockeyHelpText.textContent = airHockeyState.finished
            ? (airHockeyState.winner === getMultiplayerAirHockeyRole() ? 'Victoire. Le palet finit dans les filets adverses.' : "D\u00e9faite. L'adversaire remporte le duel.")
            : (airHockeyState.running ? 'Déplace ton palet avec fluidité. Premier à 5.' : "Attends que l'hôte lance le duel.");

        if (airHockeyState.finished) {
            stopAirHockeyRuntime();
            resetMultiplayerAirHockeyInput();
        }

        renderAirHockey();
        if (!airHockeyState.finished) {
            ensureMultiplayerAirHockeyRenderLoop();
            pushMultiplayerAirHockeyInput();
        }

        if (!airHockeyState.finished) {
            airHockeyLastFinishedStateKey = '';
            return;
        }

        const finishedKey = `${airHockeyState.round}:${airHockeyState.winner || 'none'}`;
        if (finishedKey === airHockeyLastFinishedStateKey || activeGameTab !== 'airHockey') {
            return;
        }

        airHockeyLastFinishedStateKey = finishedKey;
        if (airHockeyState.winner === getMultiplayerAirHockeyRole()) {
            revealAirHockeyOutcomeMenu(
                'Victoire',
                'Tu remportes ce duel de Sea Hockey en ligne.',
                'Pont en liesse'
            );
        } else {
            revealAirHockeyOutcomeMenu(
                "C'est perdu",
                "L'adversaire remporte ce duel de Sea Hockey.",
                'Duel termin\u00e9'
            );
        }
    }

    function renderAirHockey() {
        const currentAirHockeyState = isMultiplayerAirHockeyActive() && airHockeyDisplayState ? airHockeyDisplayState : airHockeyState;

        if (!currentAirHockeyState) {
            return;
        }

        airHockeyLeftScoreDisplay.textContent = String(currentAirHockeyState.leftScore);
        airHockeyRightScoreDisplay.textContent = String(currentAirHockeyState.rightScore);
        airHockeyLeftPaddle.style.transform = `translate(${currentAirHockeyState.left.x - currentAirHockeyState.left.radius}px, ${currentAirHockeyState.left.y - currentAirHockeyState.left.radius}px)`;
        airHockeyRightPaddle.style.transform = `translate(${currentAirHockeyState.right.x - currentAirHockeyState.right.radius}px, ${currentAirHockeyState.right.y - currentAirHockeyState.right.radius}px)`;
        airHockeyPuck.style.transform = `translate(${currentAirHockeyState.puck.x - currentAirHockeyState.puck.radius}px, ${currentAirHockeyState.puck.y - currentAirHockeyState.puck.radius}px)`;
    }

    function stopAirHockeyRuntime() {
        if (airHockeyAnimationFrame) {
            window.cancelAnimationFrame(airHockeyAnimationFrame);
            airHockeyAnimationFrame = null;
        }
        if (airHockeyRenderAnimationFrame) {
            window.cancelAnimationFrame(airHockeyRenderAnimationFrame);
            airHockeyRenderAnimationFrame = null;
        }
        airHockeyLastFrame = 0;
        airHockeyRenderLastFrame = 0;
        hideAirHockeyCountdown();
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
        const maxSpeed = AIR_HOCKEY_PUCK_MAX_SPEED;

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

    function getAirHockeyRulesText() {
        return "Le joueur gauche se déplace avec ZQSD. En solo, la droite est pilotée par l'IA. En duo local, la droite se joue aux flèches. Premier à 5 buts.";
    }

    function renderAirHockeyMenu() {
        if (!airHockeyMenuOverlay || !airHockeyBoard) {
            return;
        }

        syncGameMenuOverlayBounds(airHockeyMenuOverlay, airHockeyBoard);
        airHockeyMenuOverlay.classList.toggle('hidden', !airHockeyMenuVisible);
        airHockeyMenuOverlay.classList.toggle('is-closing', airHockeyMenuClosing);
        airHockeyMenuOverlay.classList.toggle('is-entering', airHockeyMenuEntering);
        airHockeyBoard.classList.toggle('is-menu-open', airHockeyMenuVisible);

        if (!airHockeyMenuVisible) {
            return;
        }

        const hasResult = Boolean(airHockeyMenuResult);
        if (airHockeyMenuEyebrow) {
            airHockeyMenuEyebrow.textContent = airHockeyMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? airHockeyMenuResult.eyebrow : 'Duel de pont');
        }
        if (airHockeyMenuTitle) {
            airHockeyMenuTitle.textContent = airHockeyMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? airHockeyMenuResult.title : 'Sea Hockey');
        }
        if (airHockeyMenuText) {
            airHockeyMenuText.textContent = airHockeyMenuShowingRules
                ? getAirHockeyRulesText()
                : (hasResult
                    ? airHockeyMenuResult.text
                    : ((isMultiplayerAirHockeyActive() && !multiplayerActiveRoom?.gameLaunched)
                        ? 'Quand tous les joueurs sont pr\u00eats, le duel de Sea Hockey commence automatiquement.'
                        : 'Choisis ton mode puis engage le palet sur le pont glissant de la baie.'));
        }
        if (airHockeyMenuActionButton) {
            airHockeyMenuActionButton.textContent = airHockeyMenuShowingRules
                ? 'Retour'
                : ((isMultiplayerAirHockeyActive() && !multiplayerActiveRoom?.gameLaunched)
                    ? `${isCurrentPlayerMultiplayerReady() ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat'} (${getMultiplayerReadySummary()})`
                    : (hasResult ? 'Relancer le duel' : 'Lancer le duel'));
        }
        if (airHockeyMenuRulesButton) {
            airHockeyMenuRulesButton.textContent = 'R\u00e8gles';
            airHockeyMenuRulesButton.hidden = airHockeyMenuShowingRules;
        }
    }

    function closeAirHockeyMenu() {
        airHockeyMenuClosing = true;
        renderAirHockeyMenu();
        window.setTimeout(() => {
            airHockeyMenuClosing = false;
            airHockeyMenuVisible = false;
            airHockeyMenuShowingRules = false;
            airHockeyMenuEntering = false;
            airHockeyMenuResult = null;
            renderAirHockeyMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealAirHockeyOutcomeMenu(title, text, eyebrow) {
        airHockeyMenuVisible = true;
        airHockeyMenuResult = { title, text, eyebrow };
        airHockeyMenuShowingRules = false;
        airHockeyMenuClosing = false;
        airHockeyMenuEntering = true;
        airHockeyHelpText.textContent = text;
        renderAirHockeyMenu();
        window.setTimeout(() => {
            airHockeyMenuEntering = false;
            renderAirHockeyMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
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
        stopAirHockeyRuntime();
        airHockeyRenderLastFrame = 0;
        airHockeyDisplayState = null;
        airHockeyLocalPredicted = null;
        airHockeyMenuResult = null;
        airHockeyMenuShowingRules = false;
        airHockeyMenuClosing = false;
        airHockeyMenuEntering = false;

        if (isMultiplayerAirHockeyActive()) {
            syncMultiplayerAirHockeyState();
            return;
        }

        const { width, height } = getAirHockeyDimensions();
        airHockeyState = {
            leftScore: resetScores ? 0 : airHockeyState?.leftScore || 0,
            rightScore: resetScores ? 0 : airHockeyState?.rightScore || 0,
            running: false,
            left: { x: width * 0.16, y: height * 0.5, radius: AIR_HOCKEY_PADDLE_RADIUS, vx: 0, vy: 0 },
            right: { x: width * 0.84, y: height * 0.5, radius: AIR_HOCKEY_PADDLE_RADIUS, vx: 0, vy: 0 },
            puck: { x: width * 0.5, y: height * 0.5, vx: 0, vy: 0, radius: AIR_HOCKEY_PUCK_RADIUS },
            servingSide: 'left'
        };
        hideAirHockeyCountdown();
        positionAirHockeyPuck();
        airHockeyHelpText.textContent = 'La balle attend dans un camp. Clique sur Lancer pour engager la partie de Sea Hockey.';
        renderAirHockey();
        renderAirHockeyMenu();
    }

    function launchAirHockeyPuck() {
        if (isMultiplayerAirHockeyActive()) {
            if (!multiplayerSocket?.connected) {
                setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }

            if (!getCurrentMultiplayerPlayer()?.isHost) {
                setMultiplayerStatus("Seul l'hôte peut lancer le duel.");
                return;
            }

            multiplayerSocket.emit('airhockey:start');
            setMultiplayerStatus('Le duel de Sea Hockey se prepare pour tout le salon.');
            return;
        }

        if (airHockeyCountdownActive) {
            return;
        }

        airHockeyState.puck.vx = 0;
        airHockeyState.puck.vy = 0;
        airHockeyState.running = false;
        airHockeyHelpText.textContent = 'Pr\u00e9paration de l\u2019engagement\u2026';
        startAirHockeyCountdown(() => {
            airHockeyState.running = true;
            airHockeyHelpText.textContent = airHockeyState.servingSide === 'left'
                ? "Engagement à gauche. Va toucher la balle pour lancer l'action."
                : "Engagement à droite. Va toucher la balle pour lancer l'action.";
            if (!airHockeyAnimationFrame) {
                airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
            }
        });
    }

    function handleAirHockeyPoint(side) {
        airHockeyState[side === 'left' ? 'leftScore' : 'rightScore'] += 1;
        if (airHockeyState.leftScore >= AIR_HOCKEY_GOAL_SCORE || airHockeyState.rightScore >= AIR_HOCKEY_GOAL_SCORE) {
            airHockeyState.running = false;
            airHockeyState.puck.vx = 0;
            airHockeyState.puck.vy = 0;
            airHockeyKeys.clear();
            stopAirHockeyRuntime();
            const winnerLabel = airHockeyState.leftScore > airHockeyState.rightScore ? 'Le joueur gauche' : 'Le joueur droit';
            revealAirHockeyOutcomeMenu(
                'Duel termin\u00e9',
                `${winnerLabel} gagne ${airHockeyState.leftScore} a ${airHockeyState.rightScore}.`,
                'Pont en liesse'
            );
            return;
        }

        initializeAirHockey(false);
        positionAirHockeyPuck(side === 'left' ? 'right' : 'left');
        airHockeyHelpText.textContent = 'But marqu\u00e9. Nouvel engagement en pr\u00e9paration\u2026';
        startAirHockeyCountdown(() => {
            airHockeyState.running = true;
            airHockeyHelpText.textContent = airHockeyState.servingSide === 'left'
                ? "Engagement à gauche. Va toucher la balle pour lancer l'action."
                : "Engagement à droite. Va toucher la balle pour lancer l'action.";
            if (!airHockeyAnimationFrame) {
                airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
            }
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
        airHockeyState.left.x = Math.max(airHockeyState.left.radius, Math.min((width * 0.5) - AIR_HOCKEY_CENTER_GAP - airHockeyState.left.radius, airHockeyState.left.x));
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
        airHockeyState.right.x = Math.max((width * 0.5) + AIR_HOCKEY_CENTER_GAP + airHockeyState.right.radius, Math.min(width - airHockeyState.right.radius, airHockeyState.right.x));

        if (airHockeyState.running && !airHockeyCountdownActive) {

            const puck = airHockeyState.puck;
            puck.x += puck.vx * delta;
            puck.y += puck.vy * delta;
            puck.vx *= 0.9975;
            puck.vy *= 0.9975;
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
                    if (!airHockeyMenuVisible) {
                        airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
                    }
                    return;
                }

                puck.x = puck.radius;
                puck.vx = Math.abs(puck.vx);
            }

            if (puck.x >= width - puck.radius) {
                if (puckInGoalOpening) {
                    handleAirHockeyPoint('left');
                    renderAirHockey();
                    if (!airHockeyMenuVisible) {
                        airHockeyAnimationFrame = window.requestAnimationFrame(updateAirHockey);
                    }
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
                        puck.vx += nx * (44 + paddleSpeed * 0.1);
                        puck.vy += ny * (44 + paddleSpeed * 0.1);
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
        reactionTable?.classList.remove('is-armed', 'is-lit', 'is-extinguishing');
        reactionBestDisplay.textContent = reactionBestTime ? `${reactionBestTime} ms` : '-';
        reactionHelpText.textContent = "Attends que la lanterne s'allume, puis clique le plus vite possible.";
        reactionMenuResult = null;
        reactionMenuShowingRules = false;
        reactionMenuClosing = false;
        reactionMenuEntering = false;
        renderReactionMenu();
    }

    function getReactionRulesText() {
        return "Lance une veille puis attends que la lanterne s'allume. Clique uniquement au bon moment. Un clic trop tôt annule la manche.";
    }

    function getReactionPerformanceCopy(reactionTime, isRecord) {
        if (isRecord || reactionTime <= 220) {
            return {
                eyebrow: isRecord ? 'Meilleur temps' : 'Réflexe légendaire',
                title: isRecord ? 'Nouveau record' : 'Réflexe légendaire',
                text: `Réflexe éclair en ${reactionTime} ms. Le phare n'a même pas eu le temps de trembler.`
            };
        }

        if (reactionTime <= 300) {
            return {
                eyebrow: 'Tres bon temps',
                title: 'Veille termin\u00e9e',
                text: `Belle r\u00e9ponse en ${reactionTime} ms. Tu tiens bien la veille du pont.`
            };
        }

        if (reactionTime <= 420) {
            return {
                eyebrow: 'Reflexe valide',
                title: 'Veille termin\u00e9e',
                text: `Reflexe enregistre en ${reactionTime} ms. Relance pour aller chercher un meilleur temps.`
            };
        }

        return {
            eyebrow: 'Peut mieux faire',
            title: 'Veille termin\u00e9e',
            text: `Temps releve a ${reactionTime} ms. La prochaine lanterne peut tomber plus vite.`
        };
    }

    function renderReactionMenu() {
        if (!reactionMenuOverlay || !reactionTable) {
            return;
        }

        syncGameMenuOverlayBounds(reactionMenuOverlay, reactionTable);
        reactionMenuOverlay.classList.toggle('hidden', !reactionMenuVisible);
        reactionMenuOverlay.classList.toggle('is-closing', reactionMenuClosing);
        reactionMenuOverlay.classList.toggle('is-entering', reactionMenuEntering);
        reactionTable.classList.toggle('is-menu-open', reactionMenuVisible);

        if (!reactionMenuVisible) {
            return;
        }

        const hasResult = Boolean(reactionMenuResult);
        if (reactionMenuEyebrow) {
            reactionMenuEyebrow.textContent = reactionMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? reactionMenuResult.eyebrow : 'Veille au phare');
        }
        if (reactionMenuTitle) {
            reactionMenuTitle.textContent = reactionMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? reactionMenuResult.title : 'R\u00e9action');
        }
        if (reactionMenuText) {
            reactionMenuText.textContent = reactionMenuShowingRules
                ? getReactionRulesText()
                : (hasResult
                    ? reactionMenuResult.text
                    : "Reste calme sur le pont et clique dès que la lanterne s'allume pour signer le meilleur réflexe.");
        }
        if (reactionMenuActionButton) {
            reactionMenuActionButton.textContent = reactionMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la veille' : 'Lancer la veille');
        }
        if (reactionMenuRulesButton) {
            reactionMenuRulesButton.textContent = 'R\u00e8gles';
            reactionMenuRulesButton.hidden = reactionMenuShowingRules;
        }
    }

    function closeReactionMenu() {
        reactionMenuClosing = true;
        renderReactionMenu();
        window.setTimeout(() => {
            reactionMenuClosing = false;
            reactionMenuVisible = false;
            reactionMenuShowingRules = false;
            reactionMenuEntering = false;
            reactionMenuResult = null;
            renderReactionMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealReactionOutcomeMenu(title, text, eyebrow) {
        reactionMenuVisible = true;
        reactionMenuResult = { title, text, eyebrow };
        reactionMenuShowingRules = false;
        reactionMenuClosing = false;
        reactionMenuEntering = true;
        reactionHelpText.textContent = text;
        renderReactionMenu();
        window.setTimeout(() => {
            reactionMenuEntering = false;
            renderReactionMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function startReactionRound() {
        initializeReaction();
        reactionState = 'armed';
        reactionLantern.classList.add('is-armed');
        reactionTable?.classList.add('is-armed');
        reactionHelpText.textContent = "Patiente... la lanterne va s'allumer.";
        reactionTimeout = window.setTimeout(() => {
            reactionState = 'lit';
            reactionLantern.classList.remove('is-armed');
            reactionLantern.classList.add('is-lit');
            reactionTable?.classList.remove('is-armed');
            reactionTable?.classList.add('is-lit');
            reactionStartTime = performance.now();
            reactionHelpText.textContent = 'Clique vite, la lanterne est allumée.';
        }, 1200 + Math.random() * 2400);
    }

    function getRandomBaieBerryIndex() {
        return Math.floor(Math.random() * Math.min(4, BAIE_BERRY_FRUITS.length));
    }

    function getRandomBaieBerryObjective() {
        const targets = [
            { type: 'score', target: 1500, label: 'Atteins 1500 points' },
            { type: 'score', target: 3000, label: 'Atteins 3000 points' },
            { type: 'level', target: 6, label: 'Cree une Perle Marine' },
            { type: 'level', target: 7, label: 'Cree un Rubis des Flots' }
        ];
        return { ...targets[Math.floor(Math.random() * targets.length)], completed: false };
    }

    function refreshBaieBerryHud() {
        if (!baieBerryState) {
            return;
        }

        baieBerryScoreDisplay.textContent = String(baieBerryState.score);
        baieBerryBestDisplay.textContent = String(baieBerryBestScore);
        const nextFruit = BAIE_BERRY_FRUITS[baieBerryState.nextQueue[1]];
        baieBerryNextDisplay.style.setProperty('--baieberry-preview-color', nextFruit.color);
        baieBerryNextDisplay.setAttribute('aria-label', `Fruit suivant: ${nextFruit.name}`);
        baieBerryObjectiveDisplay.textContent = baieBerryState.objective.completed
            ? `${baieBerryState.objective.label} âœ“`
            : baieBerryState.objective.label;
    }

    function addBaieBerryParticles(x, y, color, count = 14) {
        if (!baieBerryState) {
            return;
        }

        for (let index = 0; index < count; index += 1) {
            const maxLife = 0.7 + (Math.random() * 0.45);
            baieBerryState.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 220,
                vy: -40 - (Math.random() * 180),
                life: maxLife,
                maxLife,
                size: 3 + (Math.random() * 7),
                color
            });
        }
    }

    function addBaieBerryScorePopup(x, y, text, color = '#f8fafc') {
        baieBerryState?.scorePopups.push({
            x,
            y,
            vy: -36,
            life: 1,
            text,
            color
        });
    }

    function updateBaieBerryObjective(lastMergedLevel = null) {
        if (!baieBerryState || baieBerryState.objective.completed) {
            return;
        }

        const { objective } = baieBerryState;
        if (objective.type === 'score' && baieBerryState.score >= objective.target) {
            objective.completed = true;
        }

        if (objective.type === 'level' && lastMergedLevel !== null && lastMergedLevel >= objective.target) {
            objective.completed = true;
        }

        if (objective.completed) {
            baieBerryHelpText.textContent = `Objectif accompli: ${objective.label}. Continue de faire grimper la r\u00e9colte.`;
            addBaieBerryScorePopup(baieBerryCanvas.width * 0.5, 108, 'Objectif atteint', '#fde68a');
            refreshBaieBerryHud();
        }
    }

    function updateBaieBerryDropGuide(positionX = null) {
        if (!baieBerryDropGuide || !baieBerryDropLine || !baieBerryState) {
            return;
        }

        const nextFruit = BAIE_BERRY_FRUITS[baieBerryState.nextQueue[0]];
        const guideSize = Math.max(28, nextFruit.radius * 1.6);
        const clampedX = positionX === null
            ? (baieBerryCanvas.width / 2)
            : Math.max(nextFruit.radius, Math.min(baieBerryCanvas.width - nextFruit.radius, positionX));
        const renderedBounds = baieBerryCanvas.getBoundingClientRect();
        const scaleX = (renderedBounds.width || baieBerryCanvas.width) / baieBerryCanvas.width;
        const scaleY = (renderedBounds.height || baieBerryCanvas.height) / baieBerryCanvas.height;
        const visualGuideSize = guideSize * Math.min(scaleX, scaleY);
        const visualX = clampedX * scaleX;

        baieBerryDropGuide.style.width = `${visualGuideSize}px`;
        baieBerryDropGuide.style.height = `${visualGuideSize}px`;
        baieBerryDropGuide.style.transform = `translateX(${visualX - (visualGuideSize / 2)}px)`;
        baieBerryDropGuide.style.setProperty('--baieberry-guide-color', nextFruit.color);
        baieBerryDropLine.style.height = `${Math.max(0, renderedBounds.height - visualGuideSize - 22)}px`;
        baieBerryDropLine.style.transform = `translateX(${visualX - 1}px)`;
        baieBerryDropLine.style.setProperty('--baieberry-guide-color', nextFruit.color);
        baieBerryDropLine.style.opacity = '0.92';
    }

    function drawBaieBerryFruit(context, fruit, alpha = 1) {
        const config = BAIE_BERRY_FRUITS[fruit.level];
        const mergeScale = fruit.mergeProgress ? (1 + (fruit.mergeProgress * 0.14)) : 1;
        const eyeOffsetX = config.radius * 0.22;
        const eyeY = -config.radius * 0.08;
        const blink = fruit.blink ? 0.18 : 1;
        const mouthCurve = fruit.expression === 'happy' ? 1 : fruit.expression === 'worried' ? -1 : 0;
        const pirateVariant = (fruit.id + fruit.level) % 5;
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

        if (pirateVariant === 1 || pirateVariant === 3) {
            const bandanaBase = pirateVariant === 1
                ? 'rgba(153, 27, 27, 0.96)'
                : 'rgba(30, 64, 175, 0.96)';
            const bandanaHighlight = pirateVariant === 1
                ? 'rgba(248, 113, 113, 0.34)'
                : 'rgba(147, 197, 253, 0.34)';

            context.beginPath();
            context.fillStyle = bandanaBase;
            context.moveTo(-config.radius * 0.88, -config.radius * 0.38);
            context.quadraticCurveTo(-config.radius * 0.3, -config.radius * 0.84, 0, -config.radius * 0.82);
            context.quadraticCurveTo(config.radius * 0.34, -config.radius * 0.82, config.radius * 0.88, -config.radius * 0.38);
            context.quadraticCurveTo(config.radius * 0.44, -config.radius * 0.08, 0, -config.radius * 0.14);
            context.quadraticCurveTo(-config.radius * 0.46, -config.radius * 0.08, -config.radius * 0.88, -config.radius * 0.38);
            context.closePath();
            context.fill();

            context.beginPath();
            context.strokeStyle = bandanaHighlight;
            context.lineWidth = Math.max(1.4, config.radius * 0.045);
            context.moveTo(-config.radius * 0.54, -config.radius * 0.4);
            context.quadraticCurveTo(0, -config.radius * 0.58, config.radius * 0.56, -config.radius * 0.4);
            context.stroke();

            context.beginPath();
            context.fillStyle = bandanaBase;
            context.ellipse(config.radius * 0.74, -config.radius * 0.04, config.radius * 0.1, config.radius * 0.22, -0.46, 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.fillStyle = bandanaBase;
            context.ellipse(config.radius * 0.86, config.radius * 0.12, config.radius * 0.07, config.radius * 0.18, -0.12, 0, Math.PI * 2);
            context.fill();
        } else if (pirateVariant === 4) {
            context.beginPath();
            context.fillStyle = 'rgba(68, 37, 20, 0.98)';
            context.moveTo(-config.radius * 0.78, -config.radius * 0.76);
            context.quadraticCurveTo(-config.radius * 0.48, -config.radius * 1.16, -config.radius * 0.06, -config.radius * 1.06);
            context.quadraticCurveTo(config.radius * 0.14, -config.radius * 1.4, config.radius * 0.34, -config.radius * 1.04);
            context.quadraticCurveTo(config.radius * 0.58, -config.radius * 1.12, config.radius * 0.8, -config.radius * 0.76);
            context.quadraticCurveTo(config.radius * 0.28, -config.radius * 0.92, -config.radius * 0.12, -config.radius * 0.88);
            context.quadraticCurveTo(-config.radius * 0.42, -config.radius * 0.86, -config.radius * 0.78, -config.radius * 0.76);
            context.closePath();
            context.fill();

            context.beginPath();
            context.fillStyle = 'rgba(51, 29, 16, 0.98)';
            context.ellipse(0, -config.radius * 0.74, config.radius * 0.82, config.radius * 0.14, -0.04, 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.strokeStyle = 'rgba(251, 191, 36, 0.68)';
            context.lineWidth = Math.max(1.2, config.radius * 0.036);
            context.moveTo(-config.radius * 0.3, -config.radius * 0.86);
            context.quadraticCurveTo(config.radius * 0.02, -config.radius * 0.96, config.radius * 0.28, -config.radius * 0.84);
            context.stroke();

            context.beginPath();
            context.fillStyle = 'rgba(245, 158, 11, 0.96)';
            context.fillRect(-config.radius * 0.06, -config.radius * 0.98, config.radius * 0.12, config.radius * 0.08);

            context.beginPath();
            context.fillStyle = 'rgba(255, 248, 220, 0.9)';
            context.arc(0, -config.radius * 0.94, Math.max(1.2, config.radius * 0.045), 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.strokeStyle = 'rgba(255,255,255,0.12)';
            context.lineWidth = Math.max(1, config.radius * 0.03);
            context.moveTo(-config.radius * 0.18, -config.radius * 1.02);
            context.quadraticCurveTo(config.radius * 0.02, -config.radius * 1.2, config.radius * 0.2, -config.radius * 1.04);
            context.stroke();
        } else {
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
        }

        context.fillStyle = 'rgba(15, 23, 42, 0.92)';
        if (pirateVariant === 2 || pirateVariant === 4) {
            context.beginPath();
            context.lineWidth = Math.max(1.5, config.radius * 0.048);
            context.strokeStyle = 'rgba(127, 29, 29, 0.88)';
            context.moveTo(-eyeOffsetX - (config.radius * 0.2), eyeY - (config.radius * 0.16));
            context.lineTo(-eyeOffsetX + (config.radius * 0.2), eyeY + (config.radius * 0.14));
            context.moveTo(-eyeOffsetX - (config.radius * 0.18), eyeY + (config.radius * 0.14));
            context.lineTo(-eyeOffsetX + (config.radius * 0.22), eyeY - (config.radius * 0.12));
            context.stroke();
        }

        if (pirateVariant === 3) {
            context.beginPath();
            context.strokeStyle = 'rgba(15, 23, 42, 0.78)';
            context.lineWidth = Math.max(1.6, config.radius * 0.05);
            context.moveTo(-config.radius * 0.68, eyeY - (config.radius * 0.08));
            context.lineTo(eyeOffsetX - (config.radius * 0.2), eyeY - (config.radius * 0.04));
            context.moveTo(eyeOffsetX + (config.radius * 0.2), eyeY - (config.radius * 0.04));
            context.lineTo(config.radius * 0.68, eyeY - (config.radius * 0.08));
            context.stroke();

            context.beginPath();
            context.fillStyle = 'rgba(17, 24, 39, 0.98)';
            context.ellipse(eyeOffsetX, eyeY, Math.max(4, config.radius * 0.19), Math.max(4, config.radius * 0.15), -0.08, 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.strokeStyle = 'rgba(255,255,255,0.14)';
            context.lineWidth = Math.max(0.9, config.radius * 0.024);
            context.moveTo(eyeOffsetX - (config.radius * 0.08), eyeY - (config.radius * 0.08));
            context.lineTo(eyeOffsetX + (config.radius * 0.06), eyeY - (config.radius * 0.16));
            context.stroke();
        } else {
            context.beginPath();
            context.ellipse(eyeOffsetX, eyeY, Math.max(2, config.radius * 0.1), Math.max(1.1, config.radius * 0.13 * blink), 0, 0, Math.PI * 2);
            context.fill();
        }

        context.beginPath();
        context.ellipse(-eyeOffsetX, eyeY, Math.max(2, config.radius * 0.1), Math.max(1.1, config.radius * 0.13 * blink), 0, 0, Math.PI * 2);
        context.fill();

        if (pirateVariant !== 3) {
            context.beginPath();
            context.ellipse(eyeOffsetX, eyeY, Math.max(2, config.radius * 0.1), Math.max(1.1, config.radius * 0.13 * blink), 0, 0, Math.PI * 2);
            context.fill();
        }

        context.beginPath();
        context.strokeStyle = 'rgba(15, 23, 42, 0.72)';
        context.lineWidth = Math.max(2, config.radius * 0.07);
        if (mouthCurve > 0) {
            context.arc(0, config.radius * 0.14, config.radius * 0.18, 0.15, Math.PI - 0.15);
        } else if (mouthCurve < 0) {
            context.arc(0, config.radius * 0.3, config.radius * 0.16, Math.PI * 1.12, Math.PI * 1.88);
        } else {
            context.moveTo(-config.radius * 0.14, config.radius * 0.22);
            context.lineTo(config.radius * 0.14, config.radius * 0.22);
        }
        context.stroke();

        if (pirateVariant === 0) {
            context.beginPath();
            context.strokeStyle = 'rgba(255,255,255,0.62)';
            context.lineWidth = Math.max(1, config.radius * 0.035);
            context.moveTo(config.radius * 0.1, config.radius * 0.02);
            context.lineTo(config.radius * 0.26, config.radius * 0.14);
            context.stroke();
        } else if (pirateVariant === 4) {
            context.beginPath();
            context.strokeStyle = 'rgba(120, 53, 15, 0.76)';
            context.lineWidth = Math.max(1.4, config.radius * 0.05);
            context.moveTo(config.radius * 0.04, config.radius * 0.02);
            context.quadraticCurveTo(config.radius * 0.18, config.radius * 0.16, config.radius * 0.34, config.radius * 0.08);
            context.stroke();
        }
        context.restore();
    }

    function drawBaieBerry() {
        if (!baieBerryContext || !baieBerryState) {
            return;
        }

        const context = baieBerryContext;

        context.clearRect(0, 0, baieBerryCanvas.width, baieBerryCanvas.height);
        const backdrop = context.createLinearGradient(0, 0, 0, baieBerryCanvas.height);
        backdrop.addColorStop(0, '#dbeafe');
        backdrop.addColorStop(0.18, '#93c5fd');
        backdrop.addColorStop(0.65, '#38bdf8');
        backdrop.addColorStop(1, '#0f766e');
        context.fillStyle = backdrop;
        context.fillRect(0, 0, baieBerryCanvas.width, baieBerryCanvas.height);

        context.fillStyle = 'rgba(255,255,255,0.14)';
        for (let bubbleIndex = 0; bubbleIndex < 16; bubbleIndex += 1) {
            const drift = ((baieBerryState.elapsed || 0) * (8 + bubbleIndex)) % (baieBerryCanvas.height + 80);
            const x = 26 + (bubbleIndex * 21) % (baieBerryCanvas.width - 52);
            const y = baieBerryCanvas.height + 30 - drift;
            const radius = 3 + (bubbleIndex % 4) * 1.7;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
        }

        for (let kelpIndex = 0; kelpIndex < 6; kelpIndex += 1) {
            const baseX = 34 + (kelpIndex * 58);
            const sway = Math.sin((baieBerryState.elapsed || 0) * 1.8 + kelpIndex) * 8;
            context.beginPath();
            context.moveTo(baseX, baieBerryCanvas.height - 16);
            context.quadraticCurveTo(baseX + sway, baieBerryCanvas.height - 92, baseX - (sway * 0.6), baieBerryCanvas.height - 164);
            context.strokeStyle = 'rgba(16, 185, 129, 0.28)';
            context.lineWidth = 8;
            context.lineCap = 'round';
            context.stroke();
        }

        const dangerRatio = Math.min(1, baieBerryState.dangerTime / BAIE_BERRY_DANGER_DURATION_MS);
        if (dangerRatio > 0) {
            context.fillStyle = `rgba(239, 68, 68, ${0.08 + (dangerRatio * 0.18)})`;
            context.fillRect(0, 0, baieBerryCanvas.width, BAIE_BERRY_DANGER_LINE_Y + 8);
        }

        context.fillStyle = 'rgba(255,255,255,0.1)';
        context.fillRect(18, 12, baieBerryCanvas.width - 36, 6);
        context.fillStyle = 'rgba(255,255,255,0.08)';
        context.fillRect(12, baieBerryCanvas.height - 28, baieBerryCanvas.width - 24, 12);
        context.fillStyle = 'rgba(239, 68, 68, 0.16)';
        context.fillRect(18, BAIE_BERRY_DANGER_LINE_Y - 4, baieBerryCanvas.width - 36, 8);
        context.strokeStyle = `rgba(254, 202, 202, ${0.5 + (dangerRatio * 0.45)})`;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(18, BAIE_BERRY_DANGER_LINE_Y);
        context.lineTo(baieBerryCanvas.width - 18, BAIE_BERRY_DANGER_LINE_Y);
        context.stroke();

        baieBerryState.fruits.forEach((fruit) => {
            drawBaieBerryFruit(context, fruit);
        });

        baieBerryState.particles.forEach((particle) => {
            context.save();
            context.globalAlpha = Math.max(0, particle.life / particle.maxLife);
            context.fillStyle = particle.color;
            context.beginPath();
            context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            context.fill();
            context.restore();
        });

        baieBerryState.scorePopups.forEach((popup) => {
            context.save();
            context.globalAlpha = popup.life;
            context.fillStyle = popup.color;
            context.font = '700 18px "Trebuchet MS", sans-serif';
            context.textAlign = 'center';
            context.fillText(popup.text, popup.x, popup.y);
            context.restore();
        });

    }

    function getBaieBerryRulesText() {
        return 'Glisse la récolte en cliquant ou en touchant la colonne voulue. Deux fruits identiques fusionnent au simple contact, mais la ligne rouge ne doit jamais rester occupée trop longtemps.';
    }

    function renderBaieBerryMenu() {
        if (!baieBerryMenuOverlay || !baieBerryTable) {
            return;
        }

        syncGameMenuOverlayBounds(baieBerryMenuOverlay, baieBerryGame);
        baieBerryMenuOverlay.classList.toggle('hidden', !baieBerryMenuVisible);
        baieBerryMenuOverlay.classList.toggle('is-closing', baieBerryMenuClosing);
        baieBerryMenuOverlay.classList.toggle('is-entering', baieBerryMenuEntering);
        baieBerryGame.classList.toggle('is-menu-open', baieBerryMenuVisible);
        if (baieBerryNextDisplay) {
            baieBerryNextDisplay.style.opacity = baieBerryMenuVisible ? '0' : '1';
        }
        if (baieBerryDropGuide) {
            baieBerryDropGuide.style.opacity = baieBerryMenuVisible ? '0' : '1';
        }
        if (baieBerryDropLine) {
            baieBerryDropLine.style.opacity = baieBerryMenuVisible ? '0' : '0.92';
        }

        if (!baieBerryMenuVisible) {
            return;
        }

        const currentScore = baieBerryState?.score ?? 0;
        const objectiveLabel = baieBerryState?.objective?.label ?? 'Atteins 1500 points';
        const objectiveStatus = baieBerryState?.objective?.completed ? 'Objectif accompli.' : `Objectif du jour: ${objectiveLabel}.`;

        if (baieBerryMenuEyebrow) {
            baieBerryMenuEyebrow.textContent = baieBerryMenuShowingRules ? 'R\u00e8gles' : (baieBerryMenuResult ? 'Fin de r\u00e9colte' : "Baie d'arcade");
        }
        if (baieBerryMenuTitle) {
            baieBerryMenuTitle.textContent = baieBerryMenuShowingRules
                ? 'Rappel rapide'
                : (baieBerryMenuResult ? 'Recolte termin\u00e9e' : 'BaieBerry');
        }
        if (baieBerryMenuText) {
            baieBerryMenuText.textContent = baieBerryMenuShowingRules
                ? getBaieBerryRulesText()
                : (baieBerryMenuResult
                    ? `Score ${currentScore}. ${objectiveStatus} La ligne rouge est restée occupée trop longtemps.`
                    : 'Prepare ta r\u00e9colte avant de laisser tomber les fruits dans le panier.');
        }
        if (baieBerryMenuActionButton) {
            baieBerryMenuActionButton.textContent = baieBerryMenuShowingRules
                ? 'Retour'
                : (baieBerryMenuResult ? 'Relancer la partie' : 'Lancer la partie');
        }
        if (baieBerryMenuRulesButton) {
            baieBerryMenuRulesButton.textContent = 'R\u00e8gles';
            baieBerryMenuRulesButton.hidden = baieBerryMenuShowingRules;
        }
    }

    function startBaieBerryLaunchSequence() {
        baieBerryMenuClosing = true;
        renderBaieBerryMenu();
        window.setTimeout(() => {
            baieBerryMenuClosing = false;
            baieBerryMenuVisible = false;
            baieBerryMenuShowingRules = false;
            baieBerryMenuEntering = false;
            baieBerryMenuResult = false;
            refreshBaieBerryHud();
            updateBaieBerryDropGuide(baieBerryLastPointerX ?? (baieBerryCanvas.width / 2));
            if (!baieBerryAnimationFrame) {
                baieBerryAnimationFrame = window.requestAnimationFrame(updateBaieBerry);
            }
            renderBaieBerryMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealBaieBerryOutcomeMenu() {
        baieBerryMenuShowingRules = false;
        baieBerryMenuClosing = false;
        baieBerryMenuEntering = true;
        baieBerryMenuVisible = true;
        baieBerryMenuResult = true;
        renderBaieBerryMenu();
        window.setTimeout(() => {
            baieBerryMenuEntering = false;
            renderBaieBerryMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function initializeBaieBerry() {
        closeGameOverModal();
        stopBaieBerry();
        if (baieBerryDropLineTimer) {
            window.clearTimeout(baieBerryDropLineTimer);
            baieBerryDropLineTimer = null;
        }
        baieBerryState = {
            fruits: [],
            nextQueue: [getRandomBaieBerryIndex(), getRandomBaieBerryIndex()],
            score: 0,
            gameOver: false,
            dangerTime: 0,
            comboCount: 0,
            comboExpiresAt: 0,
            objective: getRandomBaieBerryObjective(),
            particles: [],
            scorePopups: [],
            shake: 0,
            elapsed: 0
        };
        baieBerryLastFrame = 0;
        baieBerryLastPointerX = baieBerryCanvas.width / 2;
        baieBerryLastDropAt = 0;
        baieBerryMenuVisible = true;
        baieBerryMenuShowingRules = false;
        baieBerryMenuClosing = false;
        baieBerryMenuEntering = false;
        baieBerryMenuResult = false;
        refreshBaieBerryHud();
        baieBerryHelpText.textContent = 'Surveille la ligne rouge et vise une grande chaine de fusions.';
        updateBaieBerryDropGuide();
        drawBaieBerry();
        renderBaieBerryMenu();

    }

    function stopBaieBerry() {
        if (baieBerryAnimationFrame) {
            window.cancelAnimationFrame(baieBerryAnimationFrame);
            baieBerryAnimationFrame = null;
        }
        if (baieBerryDropLineTimer) {
            window.clearTimeout(baieBerryDropLineTimer);
            baieBerryDropLineTimer = null;
        }
        baieBerryLastFrame = 0;
        if (baieBerryStage) {
            baieBerryStage.style.transform = 'translate(0, 0)';
        }
    }

    function dropBaieBerryAt(x) {
        if (!baieBerryState || baieBerryState.gameOver) {
            return;
        }

        const now = performance.now();
        if ((now - baieBerryLastDropAt) < BAIE_BERRY_DROP_COOLDOWN_MS) {
            return;
        }
        baieBerryLastDropAt = now;
        if (!baieBerryAnimationFrame) {
            baieBerryAnimationFrame = window.requestAnimationFrame(updateBaieBerry);
        }

        baieBerryLastPointerX = x;
        if (baieBerryDropLine) {
            baieBerryDropLine.style.opacity = '0';
        }
        if (baieBerryDropLineTimer) {
            window.clearTimeout(baieBerryDropLineTimer);
            baieBerryDropLineTimer = null;
        }

        const level = baieBerryState.nextQueue[0];
        const radius = BAIE_BERRY_FRUITS[level].radius;
        baieBerryState.fruits.push({
            id: baieBerryNextFruitId++,
            x: Math.max(radius, Math.min(baieBerryCanvas.width - radius, x)),
            y: radius + 4,
            vx: 0,
            vy: 0,
            spawnedAt: now,
            rotation: 0,
            mergeProgress: 0,
            blink: 1,
            expression: 'focused',
            level
        });
        baieBerryState.nextQueue = [baieBerryState.nextQueue[1], getRandomBaieBerryIndex()];
        refreshBaieBerryHud();
        updateBaieBerryDropGuide(baieBerryLastPointerX ?? x);
        if (baieBerryDropLine) {
            baieBerryDropLine.style.opacity = '0';
        }
        baieBerryDropLineTimer = window.setTimeout(() => {
            baieBerryDropLineTimer = null;
            if (!baieBerryState?.gameOver && !baieBerryMenuVisible && !baieBerryMenuClosing) {
                updateBaieBerryDropGuide(baieBerryLastPointerX ?? x);
            }
        }, 220);
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
        baieBerryState.elapsed += delta;

        if (!baieBerryState.gameOver) {
            baieBerryState.fruits.forEach((fruit) => {
                const radius = BAIE_BERRY_FRUITS[fruit.level].radius;
                fruit.vy += 620 * delta;
                fruit.x += fruit.vx * delta;
                fruit.y += fruit.vy * delta;
                fruit.rotation = (fruit.rotation || 0) + ((fruit.vx * delta) / Math.max(12, radius));
                fruit.vx *= fruit.y >= baieBerryCanvas.height - radius - 1 ? 0.992 : 0.998;
                fruit.mergeProgress = 0;
                fruit.blink = Math.sin((baieBerryState.elapsed * 2.4) + fruit.id) > 0.96 ? 0.18 : 1;
                fruit.expression = Math.abs(fruit.vy) < 35 ? 'happy' : 'focused';

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

                        if (fruitA.level === fruitB.level && fruitA.level < BAIE_BERRY_FRUITS.length - 1) {
                            const nextLevel = fruitA.level + 1;
                            const now = performance.now();
                            baieBerryState.comboCount = baieBerryState.comboExpiresAt > now
                                ? baieBerryState.comboCount + 1
                                : 1;
                            baieBerryState.comboExpiresAt = now + BAIE_BERRY_COMBO_WINDOW_MS;
                            const comboBonus = baieBerryState.comboCount > 1 ? baieBerryState.comboCount * 35 : 0;
                            baieBerryState.score += BAIE_BERRY_FRUITS[nextLevel].score + comboBonus;
                            const mergeX = (fruitA.x + fruitB.x) / 2;
                            const mergeY = (fruitA.y + fruitB.y) / 2;
                            baieBerryState.fruits.splice(compareIndex, 1);
                            baieBerryState.fruits.splice(index, 1, {
                                id: baieBerryNextFruitId++,
                                x: mergeX,
                                y: mergeY,
                                vx: (fruitA.vx + fruitB.vx) * 0.15,
                                vy: Math.min(fruitA.vy, fruitB.vy, 0) - 90,
                                rotation: ((fruitA.rotation || 0) + (fruitB.rotation || 0)) / 2,
                                mergeProgress: 0.9,
                                blink: 1,
                                expression: 'happy',
                                level: nextLevel
                            });
                            addBaieBerryParticles(mergeX, mergeY, BAIE_BERRY_FRUITS[nextLevel].color, 18 + (baieBerryState.comboCount * 3));
                            addBaieBerryScorePopup(
                                mergeX,
                                mergeY - 10,
                                comboBonus ? `+${BAIE_BERRY_FRUITS[nextLevel].score + comboBonus}` : `+${BAIE_BERRY_FRUITS[nextLevel].score}`,
                                '#fde68a'
                            );
                            if (baieBerryState.comboCount > 1) {
                                addBaieBerryScorePopup(
                                    mergeX,
                                    mergeY - 34,
                                    `x${baieBerryState.comboCount}`,
                                    '#e2e8f0'
                                );
                            }
                            baieBerryState.shake = Math.min(18, 8 + (nextLevel * 1.8) + (baieBerryState.comboCount * 1.5));
                            baieBerryHelpText.textContent = baieBerryState.comboCount > 1
                                ? `Combo x${baieBerryState.comboCount}. Les fusions s enchainent.`
                                : `Fusion ${BAIE_BERRY_FRUITS[nextLevel].name}. Continue la r\u00e9colte.`;
                            refreshBaieBerryHud();
                            updateBaieBerryObjective(nextLevel);
                            if (baieBerryState.score > baieBerryBestScore) {
                                baieBerryBestScore = baieBerryState.score;
                                window.localStorage.setItem(BAIE_BERRY_BEST_KEY, String(baieBerryBestScore));
                            }
                            break;
                        }
                    }
                }
            }

            const dangerNow = performance.now();
            const touchesDangerLine = baieBerryState.fruits.some((fruit) => (
                (dangerNow - (fruit.spawnedAt || 0)) >= BAIE_BERRY_DANGER_GRACE_MS
                && (fruit.y - BAIE_BERRY_FRUITS[fruit.level].radius) <= BAIE_BERRY_DANGER_LINE_Y
            ));
            baieBerryState.dangerTime = touchesDangerLine
                ? Math.min(BAIE_BERRY_DANGER_DURATION_MS, baieBerryState.dangerTime + (delta * 1000))
                : Math.max(0, baieBerryState.dangerTime - (delta * 700));

            baieBerryState.particles = baieBerryState.particles.filter((particle) => {
                particle.x += particle.vx * delta;
                particle.y += particle.vy * delta;
                particle.vy += 220 * delta;
                particle.life -= delta;
                return particle.life > 0;
            });

            baieBerryState.scorePopups = baieBerryState.scorePopups.filter((popup) => {
                popup.y += popup.vy * delta;
                popup.life -= delta * 1.2;
                return popup.life > 0;
            });

            baieBerryState.shake *= BAIE_BERRY_SHAKE_DECAY;
            if (baieBerryStage) {
                const intensity = baieBerryState.shake;
                baieBerryStage.style.transform = intensity > 0.2
                    ? `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px)`
                    : 'translate(0, 0)';
            }

            if (baieBerryState.dangerTime >= BAIE_BERRY_DANGER_DURATION_MS) {
                baieBerryState.gameOver = true;
                baieBerryHelpText.textContent = `Récolte terminée. Score ${baieBerryState.score}. La ligne rouge est restée occupée trop longtemps.`;
                revealBaieBerryOutcomeMenu();
            }
        }

        drawBaieBerry();
        baieBerryAnimationFrame = window.requestAnimationFrame(updateBaieBerry);
    }

    function drawBreakoutRoundedRect(context, x, y, width, height, radius) {
        const clampedRadius = Math.min(radius, width / 2, height / 2);
        context.beginPath();
        context.moveTo(x + clampedRadius, y);
        context.lineTo(x + width - clampedRadius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + clampedRadius);
        context.lineTo(x + width, y + height - clampedRadius);
        context.quadraticCurveTo(x + width, y + height, x + width - clampedRadius, y + height);
        context.lineTo(x + clampedRadius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - clampedRadius);
        context.lineTo(x, y + clampedRadius);
        context.quadraticCurveTo(x, y, x + clampedRadius, y);
        context.closePath();
    }

    function createBreakoutBricks() {
        const rows = 5;
        const cols = 8;
        const sidePadding = 38;
        const topOffset = 28;
        const gapX = 10;
        const gapY = 8;
        const brickWidth = ((breakoutCanvas.width - (sidePadding * 2)) - (gapX * (cols - 1))) / cols;
        const brickHeight = 16;
        const rowThemes = [
            { top: '#facc15', bottom: '#d97706' },
            { top: '#fb7185', bottom: '#be123c' },
            { top: '#38bdf8', bottom: '#2563eb' },
            { top: '#34d399', bottom: '#0f766e' },
            { top: '#c084fc', bottom: '#7c3aed' }
        ];

        return Array.from({ length: rows }, (_, row) => (
            Array.from({ length: cols }, (_, col) => ({
                x: sidePadding + col * (brickWidth + gapX),
                y: topOffset + row * (brickHeight + gapY),
                width: brickWidth,
                height: brickHeight,
                alive: true,
                theme: rowThemes[row % rowThemes.length]
            }))
        )).flat();
    }

    function drawBreakoutBackdrop() {
        const skyGradient = breakoutContext.createLinearGradient(0, 0, 0, breakoutCanvas.height);
        skyGradient.addColorStop(0, '#7dd3fc');
        skyGradient.addColorStop(0.48, '#38bdf8');
        skyGradient.addColorStop(0.72, '#0f766e');
        skyGradient.addColorStop(1, '#082f49');
        breakoutContext.fillStyle = skyGradient;
        breakoutContext.fillRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);

        const sunGlow = breakoutContext.createRadialGradient(118, 88, 12, 118, 88, 92);
        sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        sunGlow.addColorStop(0.4, 'rgba(251, 191, 36, 0.42)');
        sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        breakoutContext.fillStyle = sunGlow;
        breakoutContext.beginPath();
        breakoutContext.arc(118, 88, 92, 0, Math.PI * 2);
        breakoutContext.fill();

        breakoutContext.fillStyle = 'rgba(255, 255, 255, 0.68)';
        breakoutContext.beginPath();
        breakoutContext.ellipse(154, 74, 28, 14, 0, 0, Math.PI * 2);
        breakoutContext.ellipse(186, 72, 34, 18, 0, 0, Math.PI * 2);
        breakoutContext.ellipse(216, 78, 24, 12, 0, 0, Math.PI * 2);
        breakoutContext.fill();

        breakoutContext.fillStyle = 'rgba(15, 23, 42, 0.26)';
        breakoutContext.beginPath();
        breakoutContext.moveTo(0, breakoutCanvas.height * 0.68);
        breakoutContext.lineTo(86, breakoutCanvas.height * 0.54);
        breakoutContext.lineTo(148, breakoutCanvas.height * 0.62);
        breakoutContext.lineTo(222, breakoutCanvas.height * 0.48);
        breakoutContext.lineTo(304, breakoutCanvas.height * 0.67);
        breakoutContext.lineTo(0, breakoutCanvas.height * 0.67);
        breakoutContext.closePath();
        breakoutContext.fill();

        breakoutContext.fillStyle = 'rgba(15, 23, 42, 0.38)';
        breakoutContext.beginPath();
        breakoutContext.moveTo(breakoutCanvas.width * 0.58, breakoutCanvas.height * 0.68);
        breakoutContext.lineTo(breakoutCanvas.width * 0.68, breakoutCanvas.height * 0.56);
        breakoutContext.lineTo(breakoutCanvas.width * 0.78, breakoutCanvas.height * 0.61);
        breakoutContext.lineTo(breakoutCanvas.width * 0.88, breakoutCanvas.height * 0.5);
        breakoutContext.lineTo(breakoutCanvas.width, breakoutCanvas.height * 0.68);
        breakoutContext.closePath();
        breakoutContext.fill();

        breakoutContext.strokeStyle = 'rgba(255,255,255,0.18)';
        breakoutContext.lineWidth = 2;
        for (let wave = 0; wave < 5; wave += 1) {
            const waveY = breakoutCanvas.height - 86 + wave * 13;
            breakoutContext.beginPath();
            breakoutContext.moveTo(0, waveY);
            for (let x = 0; x <= breakoutCanvas.width; x += 36) {
                breakoutContext.quadraticCurveTo(x + 18, waveY - 8, x + 36, waveY);
            }
            breakoutContext.stroke();
        }
    }

    function drawBreakoutBrick(brick) {
        const gradient = breakoutContext.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.height);
        gradient.addColorStop(0, brick.theme.top);
        gradient.addColorStop(1, brick.theme.bottom);

        drawBreakoutRoundedRect(breakoutContext, brick.x, brick.y, brick.width, brick.height, 6);
        breakoutContext.fillStyle = gradient;
        breakoutContext.fill();
        breakoutContext.strokeStyle = 'rgba(255, 248, 220, 0.28)';
        breakoutContext.lineWidth = 1;
        breakoutContext.stroke();

        breakoutContext.fillStyle = 'rgba(255, 255, 255, 0.18)';
        breakoutContext.fillRect(brick.x + 7, brick.y + 3, brick.width - 14, 3);
    }

    function drawBreakoutPaddle() {
        const { paddle } = breakoutState;
        const hullGradient = breakoutContext.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
        hullGradient.addColorStop(0, '#f59e0b');
        hullGradient.addColorStop(1, '#7c2d12');

        drawBreakoutRoundedRect(breakoutContext, paddle.x, paddle.y, paddle.width, paddle.height, 8);
        breakoutContext.fillStyle = hullGradient;
        breakoutContext.fill();

        breakoutContext.fillStyle = 'rgba(255, 248, 220, 0.9)';
        breakoutContext.fillRect(paddle.x + paddle.width * 0.48, paddle.y - 14, 3, 14);
        breakoutContext.beginPath();
        breakoutContext.moveTo(paddle.x + paddle.width * 0.5, paddle.y - 14);
        breakoutContext.lineTo(paddle.x + paddle.width * 0.7, paddle.y - 6);
        breakoutContext.lineTo(paddle.x + paddle.width * 0.5, paddle.y + 2);
        breakoutContext.closePath();
        breakoutContext.fill();
    }

    function drawBreakoutBall() {
        const { ball } = breakoutState;
        const ballGradient = breakoutContext.createRadialGradient(ball.x - 2, ball.y - 2, 2, ball.x, ball.y, ball.radius + 2);
        ballGradient.addColorStop(0, '#fef3c7');
        ballGradient.addColorStop(0.42, '#facc15');
        ballGradient.addColorStop(1, '#b45309');

        breakoutContext.beginPath();
        breakoutContext.fillStyle = ballGradient;
        breakoutContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        breakoutContext.fill();
        breakoutContext.strokeStyle = 'rgba(120, 53, 15, 0.52)';
        breakoutContext.lineWidth = 1.2;
        breakoutContext.stroke();
    }

    function drawBreakout() {
        if (!breakoutContext || !breakoutState) {
            return;
        }

        breakoutContext.clearRect(0, 0, breakoutCanvas.width, breakoutCanvas.height);
        drawBreakoutBackdrop();

        breakoutState.bricks.forEach((brick) => {
            if (!brick.alive) {
                return;
            }
            drawBreakoutBrick(brick);
        });

        drawBreakoutPaddle();
        drawBreakoutBall();
    }

    function getBreakoutRulesText() {
        return 'Déplace la raquette avec Q, D ou les flèches. La balle rebondit selon la zone touchée sur le bateau. Casse toutes les briques sans perdre tes trois vies.';
    }

    function renderBreakoutMenu() {
        if (!breakoutMenuOverlay || !breakoutTable) {
            return;
        }

        syncGameMenuOverlayBounds(breakoutMenuOverlay, breakoutTable);
        breakoutMenuOverlay.classList.toggle('hidden', !breakoutMenuVisible);
        breakoutMenuOverlay.classList.toggle('is-closing', breakoutMenuClosing);
        breakoutTable.classList.toggle('is-menu-open', breakoutMenuVisible);

        if (!breakoutMenuVisible) {
            return;
        }

        const hasResult = Boolean(breakoutMenuResult);

        if (breakoutMenuEyebrow) {
            breakoutMenuEyebrow.textContent = breakoutMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? breakoutMenuResult.eyebrow : 'Baie d arcade');
        }
        if (breakoutMenuTitle) {
            breakoutMenuTitle.textContent = breakoutMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? breakoutMenuResult.title : 'Break It');
        }
        if (breakoutMenuText) {
            breakoutMenuText.textContent = breakoutMenuShowingRules
                ? getBreakoutRulesText()
                : (hasResult
                    ? breakoutMenuResult.text
                    : "Prépare ta traversée avant d'envoyer la balle sur les briques.");
        }
        if (breakoutMenuActionButton) {
            breakoutMenuActionButton.textContent = breakoutMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
        }
        if (breakoutMenuRulesButton) {
            breakoutMenuRulesButton.textContent = 'R\u00e8gles';
            breakoutMenuRulesButton.hidden = breakoutMenuShowingRules;
        }
    }

    function startBreakoutLaunchSequence() {
        breakoutMenuClosing = true;
        renderBreakoutMenu();
        window.setTimeout(() => {
            breakoutMenuClosing = false;
            breakoutMenuVisible = false;
            breakoutMenuShowingRules = false;
            breakoutMenuResult = null;
            if (breakoutState) {
                breakoutState.running = true;
            }
            if (!breakoutAnimationFrame) {
                breakoutAnimationFrame = window.requestAnimationFrame(updateBreakout);
            }
            renderBreakoutMenu();
            drawBreakout();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function initializeBreakout() {
        const paddleWidth = 92;
        const paddleHeight = 11;
        closeGameOverModal();
        stopBreakout();
        breakoutState = {
            score: 0,
            lives: 3,
            running: false,
            paddle: {
                x: (breakoutCanvas.width - paddleWidth) / 2,
                y: breakoutCanvas.height - 34,
                width: paddleWidth,
                height: paddleHeight
            },
            ball: {
                x: breakoutCanvas.width / 2,
                y: breakoutCanvas.height * 0.62,
                vx: 0,
                vy: 0,
                radius: 7
            },
            bricks: createBreakoutBricks()
        };
        breakoutRemainingBricks = breakoutState.bricks.length;
        resetBreakoutBall();
        breakoutScoreDisplay.textContent = '0';
        breakoutLivesDisplay.textContent = '3';
        breakoutHelpText.textContent = `Record actuel: ${breakoutBestScore}. Lance la balle quand tu veux.`;
        breakoutMenuVisible = true;
        breakoutMenuShowingRules = false;
        breakoutMenuClosing = false;
        breakoutMenuResult = null;
        renderBreakoutMenu();
        drawBreakout();

    }

    function revealBreakoutOutcomeMenu(title, text, eyebrow) {
        breakoutMenuVisible = true;
        breakoutMenuShowingRules = false;
        breakoutMenuClosing = false;
        breakoutMenuResult = { title, text, eyebrow };
        renderBreakoutMenu();
    }

    function stopBreakout() {
        if (breakoutAnimationFrame) {
            window.cancelAnimationFrame(breakoutAnimationFrame);
            breakoutAnimationFrame = null;
        }
        breakoutLastFrame = 0;
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

            const maxDistance = Math.max(
                Math.abs(breakoutState.ball.vx),
                Math.abs(breakoutState.ball.vy)
            ) * delta;
            const stepCount = Math.max(1, Math.ceil(maxDistance / BREAKOUT_MAX_STEP_DISTANCE));
            const stepDelta = delta / stepCount;

            for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
                const previousX = breakoutState.ball.x;
                const previousY = breakoutState.ball.y;

                breakoutState.ball.x += breakoutState.ball.vx * stepDelta;
                breakoutState.ball.y += breakoutState.ball.vy * stepDelta;

                if (breakoutState.ball.x <= breakoutState.ball.radius) {
                    breakoutState.ball.x = breakoutState.ball.radius;
                    breakoutState.ball.vx = Math.abs(breakoutState.ball.vx);
                } else if (breakoutState.ball.x >= breakoutCanvas.width - breakoutState.ball.radius) {
                    breakoutState.ball.x = breakoutCanvas.width - breakoutState.ball.radius;
                    breakoutState.ball.vx = -Math.abs(breakoutState.ball.vx);
                }

                if (breakoutState.ball.y <= breakoutState.ball.radius) {
                    breakoutState.ball.y = breakoutState.ball.radius;
                    breakoutState.ball.vy = Math.abs(breakoutState.ball.vy);
                }

                if (breakoutState.ball.y + breakoutState.ball.radius >= breakoutState.paddle.y
                    && breakoutState.ball.y - breakoutState.ball.radius <= breakoutState.paddle.y + breakoutState.paddle.height
                    && breakoutState.ball.x + breakoutState.ball.radius >= breakoutState.paddle.x
                    && breakoutState.ball.x - breakoutState.ball.radius <= breakoutState.paddle.x + breakoutState.paddle.width
                    && breakoutState.ball.vy > 0) {
                    breakoutState.ball.y = breakoutState.paddle.y - breakoutState.ball.radius;
                    const normalizedOffset = Math.max(-1, Math.min(1, (
                        breakoutState.ball.x - (breakoutState.paddle.x + breakoutState.paddle.width / 2)
                    ) / (breakoutState.paddle.width / 2)));
                    const bounceAngle = normalizedOffset * (Math.PI / 3);
                    setBreakoutBallVelocity(Math.sin(bounceAngle), -Math.cos(bounceAngle));
                }

                const collidedBrick = breakoutState.bricks.find((brick) => (
                    brick.alive
                    && breakoutState.ball.x + breakoutState.ball.radius > brick.x
                    && breakoutState.ball.x - breakoutState.ball.radius < brick.x + brick.width
                    && breakoutState.ball.y + breakoutState.ball.radius > brick.y
                    && breakoutState.ball.y - breakoutState.ball.radius < brick.y + brick.height
                ));

                if (collidedBrick) {
                    collidedBrick.alive = false;
                    breakoutRemainingBricks = Math.max(0, breakoutRemainingBricks - 1);
                    resolveBreakoutBrickCollision(collidedBrick, previousX, previousY);
                    breakoutState.score += 25;
                    breakoutScoreDisplay.textContent = String(breakoutState.score);
                    if (breakoutState.score > breakoutBestScore) {
                        breakoutBestScore = breakoutState.score;
                        window.localStorage.setItem(BREAKOUT_BEST_KEY, String(breakoutBestScore));
                    }
                }

                if (breakoutState.ball.y - breakoutState.ball.radius > breakoutCanvas.height) {
                    breakoutState.lives -= 1;
                    breakoutLivesDisplay.textContent = String(breakoutState.lives);
                    breakoutState.running = false;
                    resetBreakoutBall();
                    breakoutHelpText.textContent = breakoutState.lives > 0 ? 'Balle perdue. Clique relancer.' : `Partie termin\u00e9e. Score ${breakoutState.score}.`;
                    if (breakoutState.lives <= 0) {
                        revealBreakoutOutcomeMenu(
                            'Partie termin\u00e9e',
                            `Score ${breakoutState.score}. Record ${breakoutBestScore}.`,
                            'Pont en cale seche'
                        );
                    }
                    stopBreakout();
                    drawBreakout();
                    break;
                }

                if (breakoutRemainingBricks === 0) {
                    breakoutState.running = false;
                    breakoutHelpText.textContent = `Victoire ! Score ${breakoutState.score}.`;
                    revealBreakoutOutcomeMenu(
                        'Victoire',
                        `Toutes les briques sont tombees. Score ${breakoutState.score}. Record ${breakoutBestScore}.`,
                        'Pont en liesse'
                    );
                    stopBreakout();
                    drawBreakout();
                    break;
                }
            }
        }

        drawBreakout();
        if (breakoutState.running) {
            breakoutAnimationFrame = window.requestAnimationFrame(updateBreakout);
        } else {
            breakoutAnimationFrame = null;
        }
    }

    function createBlockBlastPiece(template) {
        return {
            id: `${template.key}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            key: template.key,
            color: template.color,
            cells: template.cells.map(([x, y]) => ({ x, y })),
            width: Math.max(...template.cells.map(([x]) => x)) + 1,
            height: Math.max(...template.cells.map(([, y]) => y)) + 1
        };
    }

    function createBlockBlastBoard() {
        return Array.from({ length: BLOCK_BLAST_SIZE }, () => Array.from({ length: BLOCK_BLAST_SIZE }, () => null));
    }

    function generateBlockBlastPieces() {
        const pool = [...BLOCK_BLAST_SHAPES];
        const picks = [];

        while (picks.length < 3) {
            const index = Math.floor(Math.random() * pool.length);
            const [template] = pool.splice(index, 1);
            picks.push(createBlockBlastPiece(template));
        }

        return picks;
    }

    function canPlaceBlockBlastPiece(piece, anchorRow, anchorCol) {
        if (!piece || !blockBlastState) {
            return false;
        }

        return piece.cells.every((cell) => {
            const row = anchorRow + cell.y;
            const col = anchorCol + cell.x;
            return row >= 0
                && row < BLOCK_BLAST_SIZE
                && col >= 0
                && col < BLOCK_BLAST_SIZE
                && !blockBlastState.board[row][col];
        });
    }

    function canAnyBlockBlastPieceFit() {
        if (!blockBlastState) {
            return false;
        }

        return blockBlastState.pieces.some((piece) => {
            if (!piece) {
                return false;
            }

            for (let row = 0; row < BLOCK_BLAST_SIZE; row += 1) {
                for (let col = 0; col < BLOCK_BLAST_SIZE; col += 1) {
                    if (canPlaceBlockBlastPiece(piece, row, col)) {
                        return true;
                    }
                }
            }

            return false;
        });
    }

    function updateBlockBlastHud() {
        if (!blockBlastState) {
            return;
        }

        blockBlastScoreDisplay.textContent = String(blockBlastState.score);
        blockBlastComboDisplay.textContent = `x${Math.max(1, blockBlastState.combo)}`;
    }

    function clearBlockBlastPreview(shouldRender = true) {
        if (!blockBlastPreview) {
            return;
        }

        blockBlastPreview = null;
        if (shouldRender) {
            renderBlockBlastBoard();
        }
    }

    function updateBlockBlastPreview(piece, anchorRow, anchorCol) {
        if (!piece || !Number.isInteger(anchorRow) || !Number.isInteger(anchorCol)) {
            clearBlockBlastPreview();
            return false;
        }

        const keys = piece.cells
            .map((cell) => ({ row: anchorRow + cell.y, col: anchorCol + cell.x }))
            .filter((cell) => (
                cell.row >= 0
                && cell.row < BLOCK_BLAST_SIZE
                && cell.col >= 0
                && cell.col < BLOCK_BLAST_SIZE
            ))
            .map((cell) => `${cell.row}-${cell.col}`);
        const valid = canPlaceBlockBlastPiece(piece, anchorRow, anchorCol);
        const nextPreview = { keys, valid, row: anchorRow, col: anchorCol };
        const previewChanged = !blockBlastPreview
            || blockBlastPreview.valid !== nextPreview.valid
            || blockBlastPreview.row !== nextPreview.row
            || blockBlastPreview.col !== nextPreview.col
            || blockBlastPreview.keys.length !== nextPreview.keys.length
            || blockBlastPreview.keys.some((key, index) => key !== nextPreview.keys[index]);

        blockBlastPreview = nextPreview;
        if (previewChanged) {
            renderBlockBlastBoard();
        }

        return valid;
    }

    function getBlockBlastAnchorFromPoint(clientX, clientY) {
        if (!blockBlastBoard) {
            return null;
        }

        const bounds = blockBlastBoard.getBoundingClientRect();
        if (clientX < bounds.left || clientX > bounds.right || clientY < bounds.top || clientY > bounds.bottom) {
            return null;
        }

        const relativeX = (clientX - bounds.left) / bounds.width;
        const relativeY = (clientY - bounds.top) / bounds.height;

        return {
            row: Math.max(0, Math.min(BLOCK_BLAST_SIZE - 1, Math.floor(relativeY * BLOCK_BLAST_SIZE))),
            col: Math.max(0, Math.min(BLOCK_BLAST_SIZE - 1, Math.floor(relativeX * BLOCK_BLAST_SIZE)))
        };
    }

    function stopBlockBlastDrag() {
        blockBlastDragState = null;
        clearBlockBlastPreview();
    }

    function renderBlockBlastPieces() {
        if (!blockBlastPieces || !blockBlastState) {
            return;
        }

        blockBlastPieces.innerHTML = blockBlastState.pieces.map((piece, index) => {
            if (!piece) {
                return '<div class="blockblast-piece-slot is-empty"></div>';
            }

            return `
                <button
                    type="button"
                    class="blockblast-piece${blockBlastSelectedPieceIndex === index ? ' is-selected' : ''}"
                    data-blockblast-piece="${index}"
                    style="--piece-columns:${piece.width}; --piece-rows:${piece.height};"
                    aria-label="Piece ${index + 1}"
                >
                    ${piece.cells.map((cell) => `<span class="blockblast-piece-cell is-${piece.color}" style="grid-column:${cell.x + 1}; grid-row:${cell.y + 1};"></span>`).join('')}
                </button>
            `;
        }).join('');
    }

    function renderBlockBlastBoard() {
        if (!blockBlastBoard || !blockBlastState) {
            return;
        }

        const previewKeys = new Set(blockBlastPreview?.keys || []);
        const previewClassName = blockBlastPreview
            ? (blockBlastPreview.valid ? ' is-preview-valid' : ' is-preview-invalid')
            : '';

        blockBlastBoard.innerHTML = blockBlastState.board.map((row, rowIndex) => row.map((cell, colIndex) => {
            const clearing = blockBlastState.clearingCells?.some((entry) => entry.row === rowIndex && entry.col === colIndex);
            const preview = previewKeys.has(`${rowIndex}-${colIndex}`);
            return `
                <button
                    type="button"
                    class="blockblast-cell${cell ? ` is-filled is-${cell.color}` : ''}${clearing ? ' is-clearing' : ''}${preview ? previewClassName : ''}"
                    data-blockblast-row="${rowIndex}"
                    data-blockblast-col="${colIndex}"
                    aria-label="Case ${rowIndex + 1}-${colIndex + 1}"
                ></button>
            `;
        }).join('')).join('');
    }

    function renderBlockBlast() {
        updateBlockBlastHud();
        renderBlockBlastBoard();
        renderBlockBlastPieces();
    }

    function finishBlockBlast() {
        if (!blockBlastState) {
            return;
        }

        blockBlastHelpText.textContent = `Le pont est saturé. Score final ${blockBlastState.score}. Record ${blockBlastBestScore}.`;
        revealBlockBlastOutcomeMenu(
            'Pont saturé',
            `Plus aucune pièce ne rentre. Score final : ${blockBlastState.score}. Record : ${blockBlastBestScore}.`,
            'Marée bloquée'
        );
    }

    function refillBlockBlastPiecesIfNeeded() {
        if (!blockBlastState) {
            return;
        }

        if (blockBlastState.pieces.every((piece) => !piece)) {
            blockBlastState.pieces = generateBlockBlastPieces();
            blockBlastSelectedPieceIndex = null;
            blockBlastHelpText.textContent = 'Nouvelle cargaison sur le quai. Continue a liberer des lignes.';
        }
    }

    function clearBlockBlastLines() {
        if (!blockBlastState) {
            return;
        }

        const rowsToClear = [];
        const colsToClear = [];

        for (let row = 0; row < BLOCK_BLAST_SIZE; row += 1) {
            if (blockBlastState.board[row].every(Boolean)) {
                rowsToClear.push(row);
            }
        }

        for (let col = 0; col < BLOCK_BLAST_SIZE; col += 1) {
            if (blockBlastState.board.every((row) => row[col])) {
                colsToClear.push(col);
            }
        }

        const uniqueCells = new Map();
        rowsToClear.forEach((row) => {
            for (let col = 0; col < BLOCK_BLAST_SIZE; col += 1) {
                uniqueCells.set(`${row}-${col}`, { row, col });
            }
        });
        colsToClear.forEach((col) => {
            for (let row = 0; row < BLOCK_BLAST_SIZE; row += 1) {
                uniqueCells.set(`${row}-${col}`, { row, col });
            }
        });

        const cleared = [...uniqueCells.values()];
        blockBlastState.clearingCells = cleared;

        if (!cleared.length) {
            blockBlastState.combo = 1;
            blockBlastHelpText.textContent = 'Pose les formes pour préparer un gros nettoyage.';
            return;
        }

        cleared.forEach(({ row, col }) => {
            blockBlastState.board[row][col] = null;
        });

        blockBlastState.score += cleared.length * 12 * Math.max(1, blockBlastState.combo);
        blockBlastState.combo += 1;

        if (blockBlastState.score > blockBlastBestScore) {
            blockBlastBestScore = blockBlastState.score;
            window.localStorage.setItem(BLOCK_BLAST_BEST_KEY, String(blockBlastBestScore));
        }

        blockBlastHelpText.textContent = `${cleared.length} cases liberees. La mer reprend de l air.`;
        renderBlockBlast();

        window.setTimeout(() => {
            if (!blockBlastState) {
                return;
            }
            blockBlastState.clearingCells = [];
            renderBlockBlastBoard();
        }, 220);
    }

    function placeBlockBlastPieceAtIndex(pieceIndex, row, col) {
        if (!blockBlastState || pieceIndex === null) {
            return;
        }

        const piece = blockBlastState.pieces[pieceIndex];
        if (!piece || !canPlaceBlockBlastPiece(piece, row, col)) {
            blockBlastHelpText.textContent = 'Cette forme ne rentre pas ici. Cherche un autre coin du plateau.';
            return;
        }

        piece.cells.forEach((cell) => {
            blockBlastState.board[row + cell.y][col + cell.x] = { color: piece.color };
        });

        blockBlastState.score += piece.cells.length * 4;
        blockBlastState.pieces[pieceIndex] = null;
        blockBlastSelectedPieceIndex = null;
        clearBlockBlastPreview(false);
        clearBlockBlastLines();
        refillBlockBlastPiecesIfNeeded();
        renderBlockBlast();

        if (!canAnyBlockBlastPieceFit()) {
            finishBlockBlast();
        }
    }

    function placeBlockBlastPiece(row, col) {
        if (blockBlastSelectedPieceIndex === null) {
            return;
        }

        placeBlockBlastPieceAtIndex(blockBlastSelectedPieceIndex, row, col);
    }

    function getBlockBlastRulesText() {
        return 'Fais glisser une pi\u00e8ce de la r\u00e9serve sur le pont. Remplis une ligne ou une colonne enti\u00e8re pour la nettoyer et faire grimper le combo. La partie s\u2019arr\u00eate d\u00e8s qu\u2019aucune pi\u00e8ce ne peut plus \u00eatre pos\u00e9e.';
    }

    function renderBlockBlastMenu() {
        if (!blockBlastMenuOverlay || !blockBlastTable) return;
        syncGameMenuOverlayBounds(blockBlastMenuOverlay, blockBlastTable);
        blockBlastMenuOverlay.classList.toggle('hidden', !blockBlastMenuVisible);
        blockBlastMenuOverlay.classList.toggle('is-closing', blockBlastMenuClosing);
        blockBlastMenuOverlay.classList.toggle('is-entering', blockBlastMenuEntering);
        blockBlastTable.classList.toggle('is-menu-open', blockBlastMenuVisible);
        if (!blockBlastMenuVisible) return;
        const hasResult = Boolean(blockBlastMenuResult);
        if (blockBlastMenuEyebrow) blockBlastMenuEyebrow.textContent = blockBlastMenuShowingRules ? 'R\u00e8gles' : (hasResult ? blockBlastMenuResult.eyebrow : 'Ligne de cargaison');
        if (blockBlastMenuTitle) blockBlastMenuTitle.textContent = blockBlastMenuShowingRules ? 'Rappel rapide' : (hasResult ? blockBlastMenuResult.title : 'Block Line');
        if (blockBlastMenuText) blockBlastMenuText.textContent = blockBlastMenuShowingRules ? getBlockBlastRulesText() : (hasResult ? blockBlastMenuResult.text : 'Pose les pi\u00e8ces de cargaison sur le pont pour former des lignes et colonnes compl\u00e8tes. Tiens le plus longtemps possible.');
        if (blockBlastMenuActionButton) blockBlastMenuActionButton.textContent = blockBlastMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la mar\u00e9e' : 'Lancer la mar\u00e9e');
        if (blockBlastMenuRulesButton) { blockBlastMenuRulesButton.textContent = 'R\u00e8gles'; blockBlastMenuRulesButton.hidden = blockBlastMenuShowingRules; }
    }

    function closeBlockBlastMenu() {
        blockBlastMenuClosing = true;
        renderBlockBlastMenu();
        window.setTimeout(() => {
            blockBlastMenuClosing = false;
            blockBlastMenuVisible = false;
            blockBlastMenuShowingRules = false;
            blockBlastMenuEntering = false;
            blockBlastMenuResult = null;
            renderBlockBlastMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealBlockBlastOutcomeMenu(title, text, eyebrow) {
        blockBlastMenuVisible = true;
        blockBlastMenuResult = { title, text, eyebrow };
        blockBlastMenuShowingRules = false;
        blockBlastMenuClosing = false;
        blockBlastMenuEntering = true;
        if (blockBlastHelpText) blockBlastHelpText.textContent = text;
        renderBlockBlastMenu();
        window.setTimeout(() => { blockBlastMenuEntering = false; renderBlockBlastMenu(); }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function initializeBlockBlast() {
        closeGameOverModal();
        blockBlastState = {
            board: createBlockBlastBoard(),
            pieces: generateBlockBlastPieces(),
            score: 0,
            combo: 1,
            clearingCells: []
        };
        blockBlastSelectedPieceIndex = null;
        clearBlockBlastPreview(false);
        stopBlockBlastDrag();
        blockBlastHelpText.textContent = 'Fais glisser une forme sur le pont. Efface des lignes pour garder la baie dégagée.';
        blockBlastMenuResult = null;
        blockBlastMenuShowingRules = false;
        blockBlastMenuClosing = false;
        blockBlastMenuEntering = false;
        renderBlockBlastMenu();
        renderBlockBlast();
    }

    function showUnoEvent(message) {
        if (!unoEventBanner) {
            return;
        }

        unoEventBanner.textContent = message;
        unoEventBanner.classList.remove('is-pop');
        void unoEventBanner.offsetWidth;
        unoEventBanner.classList.add('is-pop');

        if (unoEventBannerTimer) {
            window.clearTimeout(unoEventBannerTimer);
        }

        unoEventBannerTimer = window.setTimeout(() => {
            unoEventBanner?.classList.remove('is-pop');
            unoEventBannerTimer = null;
        }, 1200);
    }

    function shuffleUnoDeck(cards) {
        const deck = [...cards];
        for (let index = deck.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
        }
        return deck;
    }

    function createUnoCard(color, value, type = 'number') {
        return {
            id: `${color}-${value}-${type}-${Math.random().toString(16).slice(2, 10)}`,
            color,
            value,
            type
        };
    }

    function createUnoDeck() {
        const deck = [];

        UNO_COLORS.forEach((color) => {
            deck.push(createUnoCard(color, '0'));
            for (let value = 1; value <= 9; value += 1) {
                deck.push(createUnoCard(color, String(value)));
                deck.push(createUnoCard(color, String(value)));
            }
            ['skip', 'reverse', 'draw2'].forEach((action) => {
                deck.push(createUnoCard(color, action, action));
                deck.push(createUnoCard(color, action, action));
            });
        });

        for (let index = 0; index < 4; index += 1) {
            deck.push(createUnoCard('wild', 'wild', 'wild'));
            deck.push(createUnoCard('wild', 'wildDraw4', 'wildDraw4'));
        }

        return shuffleUnoDeck(deck);
    }

    function cloneUnoState(state) {
        return {
            players: state.players.map((player) => ({
                ...player,
                hand: player.hand.map((card) => ({ ...card }))
            })),
            drawPile: state.drawPile.map((card) => ({ ...card })),
            discardPile: state.discardPile.map((card) => ({ ...card })),
            currentPlayerIndex: state.currentPlayerIndex,
            direction: state.direction,
            currentColor: state.currentColor,
            winner: state.winner,
            pendingColorChoice: state.pendingColorChoice ? { ...state.pendingColorChoice } : null,
            drawPenalty: Number(state.drawPenalty || 0),
            turnCount: Number(state.turnCount || 1),
            lastAction: state.lastAction || ''
        };
    }

    function buildSoloUnoState() {
        const deck = createUnoDeck();
        const players = [
            { id: 'you', name: 'Toi', hand: [] },
            { id: 'ai-1', name: 'Baiely', hand: [] }
        ];

        for (let index = 0; index < 7; index += 1) {
            players.forEach((player) => {
                player.hand.push(deck.pop());
            });
        }

        let topCard = deck.pop();
        while (topCard.type === 'wildDraw4') {
            deck.unshift(topCard);
            topCard = deck.pop();
        }

        return {
            players,
            drawPile: deck,
            discardPile: [topCard],
            currentPlayerIndex: 0,
            direction: 1,
            currentColor: topCard.color === 'wild' ? 'red' : topCard.color,
            winner: null,
            pendingColorChoice: null,
            drawPenalty: 0,
            turnCount: 1,
            lastAction: 'La traversee commence.'
        };
    }

    function getUnoTopCard(state = unoState) {
        return state?.discardPile?.[state.discardPile.length - 1] || null;
    }

    function ensureUnoDrawPile(state) {
        if (state.drawPile.length) {
            return;
        }

        state.drawPile = createUnoDeck();
    }

    function drawUnoCards(state, playerIndex, amount) {
        const cards = [];
        ensureUnoDrawPile(state);

        for (let index = 0; index < amount; index += 1) {
            ensureUnoDrawPile(state);
            const card = state.drawPile.pop();
            if (!card) {
                break;
            }
            state.players[playerIndex].hand.push(card);
            cards.push(card);
        }

        return cards;
    }

    function isUnoCardPlayable(card, state = unoState) {
        if (!card || !state || state.winner || state.pendingColorChoice) {
            return false;
        }

        const topCard = getUnoTopCard(state);
        if (!topCard) {
            return true;
        }

        if (Number(state.drawPenalty || 0) > 0) {
            if (card.type === 'wildDraw4') {
                return true;
            }

            if (card.type === 'draw2') {
                return true;
            }

            return false;
        }

        if (card.color === 'wild') {
            return true;
        }

        const activeColor = ['wild', 'wildDraw4'].includes(topCard.type)
            ? state.currentColor
            : topCard.color;

        if (card.type === 'number') {
            if (topCard.type !== 'number') {
                return card.color === activeColor;
            }

            return card.color === activeColor || card.value === topCard.value;
        }

        if (card.type === 'draw2') {
            if (topCard.type === 'wildDraw4') {
                return card.color === state.currentColor;
            }

            return card.color === activeColor || topCard.type === 'draw2';
        }

        if (card.type === 'skip' || card.type === 'reverse') {
            return card.color === activeColor || card.type === topCard.type;
        }

        return card.color === activeColor;
    }

    function hasUnoPenaltyResponse(player, state = unoState) {
        if (!player || Number(state?.drawPenalty || 0) <= 0) {
            return false;
        }

        return (player.hand || []).some((card) => (
            card?.type === 'draw2' || card?.type === 'wildDraw4'
        ));
    }

    function maybeAutoResolveUnoPenalty() {
        if (!unoState || unoState.winner || unoState.pendingColorChoice || unoDrawRequestPending) {
            return false;
        }

        const currentPlayer = unoState.players?.[unoState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.id !== 'you' || Number(unoState.drawPenalty || 0) <= 0) {
            return false;
        }

        if (hasUnoPenaltyResponse(currentPlayer, unoState)) {
            return false;
        }

        unoDrawRequestPending = true;
        window.setTimeout(() => {
            if (isMultiplayerUnoActive()) {
                multiplayerSocket?.emit('uno:draw-card');
                return;
            }

            drawSoloUnoCard();
        }, 240);

        return true;
    }

    function getNextUnoPlayerIndex(state, step = 1) {
        const total = state.players.length;
        const offset = (state.currentPlayerIndex + (state.direction * step)) % total;
        return offset < 0 ? offset + total : offset;
    }

    function getUnoDisplayColor(color) {
        return {
            red: 'Rouge',
            yellow: 'Jaune',
            green: 'Vert',
            blue: 'Bleu',
            wild: 'Libre'
        }[color] || '-';
    }

    function getUnoReadySummary() {
        const readyCount = Number(multiplayerActiveRoom?.unoReadyCount || 0);
        const readyTotal = Number(multiplayerActiveRoom?.unoReadyTotal || multiplayerActiveRoom?.playerCount || 0);
        return `${readyCount}/${readyTotal || 0}`;
    }

    function getUnoRulesText() {
        return "Pose une carte de même couleur ou de même valeur. Les +2 et +4 peuvent s'empiler. La carte Couleur change la teinte du tour. Si tu ne peux rien jouer, tu pioches.";
    }

    function renderUnoMenu() {
        if (!unoMenuOverlay || !unoGame || !unoTable) {
            return;
        }

        syncGameMenuOverlayBounds(unoMenuOverlay, unoTable);
        const isOnline = isMultiplayerUnoActive();
        const roomStarted = Boolean(multiplayerActiveRoom?.unoStarted);
        const currentPlayer = multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
        const readyLabel = currentPlayer?.unoReady ? 'Retirer pr\u00eat' : 'Mettre pr\u00eat';
        const actionLabel = isOnline ? `${readyLabel} (${getUnoReadySummary()})` : 'Lancer la partie';
        const baseText = isOnline
            ? 'Quand tout le monde est pr\u00eat, la travers\u00e9e commence automatiquement.'
            : 'Lance une nouvelle manche quand tu es prêt.';

        unoMenuVisible = isOnline ? !roomStarted : unoMenuVisible;
        unoMenuOverlay.classList.toggle('hidden', !unoMenuVisible);
        unoMenuOverlay.classList.toggle('is-closing', unoMenuClosing);
        unoTable.classList.toggle('is-menu-open', unoMenuVisible);

        if (!unoMenuVisible) {
            return;
        }

        if (unoMenuEyebrow) {
            unoMenuEyebrow.textContent = unoMenuShowingRules ? 'R\u00e8gles' : (isOnline ? 'Salle multijoueur' : 'Baie des cartes');
        }
        if (unoMenuTitle) {
            unoMenuTitle.textContent = unoMenuShowingRules ? 'Rappel rapide' : 'Buno';
        }
        if (unoMenuText) {
            unoMenuText.textContent = unoMenuShowingRules ? getUnoRulesText() : baseText;
        }
        if (unoMenuActionButton) {
            unoMenuActionButton.textContent = unoMenuShowingRules ? 'Retour' : actionLabel;
        }
        if (unoMenuRulesButton) {
            unoMenuRulesButton.textContent = 'R\u00e8gles';
            unoMenuRulesButton.hidden = unoMenuShowingRules;
        }
    }

    function startUnoLaunchSequence() {
        unoMenuClosing = true;
        renderUnoMenu();
        window.setTimeout(() => {
            unoMenuClosing = false;
            unoMenuVisible = false;
            unoMenuShowingRules = false;
            renderUnoMenu();
            renderUno();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function getUnoCardSortWeight(card) {
        const colorOrder = {
            red: 0,
            yellow: 1,
            green: 2,
            blue: 3,
            wild: 4
        };
        const typeOrder = {
            number: 0,
            skip: 20,
            reverse: 21,
            draw2: 22,
            wild: 40,
            wildDraw4: 41
        };
        const baseColor = colorOrder[card.color] ?? 9;
        const baseType = typeOrder[card.type] ?? 99;
        const numericValue = card.type === 'number' ? Number(card.value) || 0 : 0;
        return (baseColor * 100) + baseType + numericValue;
    }

    function applyUnoCardEffects(state, card, actorName) {
        if (card.type === 'reverse') {
            state.direction *= -1;
            if (state.players.length === 2) {
                state.currentPlayerIndex = getNextUnoPlayerIndex(state, 2);
            } else {
                state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
            }
            state.lastAction = `${actorName} inverse le sens.`;
            return;
        }

        if (card.type === 'skip') {
            state.currentPlayerIndex = getNextUnoPlayerIndex(state, 2);
            state.lastAction = `${actorName} bloqu\u00e9 le tour.`;
            return;
        }

        if (card.type === 'draw2') {
            state.drawPenalty = Number(state.drawPenalty || 0) + 2;
            state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
            state.lastAction = `${actorName} met +${state.drawPenalty}.`;
            return;
        }

        if (card.type === 'wildDraw4') {
            state.drawPenalty = Number(state.drawPenalty || 0) + 4;
            state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
            state.lastAction = `${actorName} met +${state.drawPenalty}.`;
            return;
        }

        if (card.type === 'wild') {
            state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
            state.lastAction = `${actorName} change la couleur.`;
            return;
        }

        state.currentPlayerIndex = getNextUnoPlayerIndex(state, 1);
        state.lastAction = `${actorName} joue ${card.value}.`;
    }

    function finalizeUnoPlay(state, playerIndex, cardIndex, chosenColor = null) {
        const player = state.players[playerIndex];
        const [card] = player.hand.splice(cardIndex, 1);
        state.discardPile.push(card);
        state.currentColor = card.color === 'wild' ? (chosenColor || 'red') : card.color;
        state.turnCount += 1;
        unoLastPlayedCardId = card.id;
        unoLastDrawnCardId = '';

        if (!player.hand.length) {
            state.winner = player.id;
            state.lastAction = `${player.name} remporte la traversee.`;
            return card;
        }

        applyUnoCardEffects(state, card, player.name);
        return card;
    }

    function renderUnoCard(card, options = {}) {
        if (!card) {
            return '<div class="uno-card-face is-empty"></div>';
        }

        const displayColor = options.displayColor || card.color;
        const label = card.type === 'skip'
            ? 'STOP'
            : (card.type === 'reverse'
                ? 'Reverse'
                : (card.type === 'draw2'
                    ? '+2'
                    : (card.type === 'wildDraw4' ? '+4' : (card.type === 'wild' ? 'Couleur' : card.value))));
        const visualLabel = card.type === 'skip'
            ? '\u2298'
            : (card.type === 'reverse'
                ? '\u27F2'
                : (card.type === 'wild' ? '' : label));
        const isWildFamily = card.type === 'wild' || card.type === 'wildDraw4';
        const wildIcon = `
            <span class="uno-card-wild-icon${card.type === 'wildDraw4' ? ' is-draw4' : ''}">
                <span class="uno-card-wild-dot is-red"></span>
                <span class="uno-card-wild-dot is-yellow"></span>
                <span class="uno-card-wild-dot is-green"></span>
                <span class="uno-card-wild-dot is-blue"></span>
            </span>
        `;

        return `
            <button
                type="button"
                class="uno-card-face is-${displayColor}${options.playable ? ' is-playable' : ''}${options.compact ? ' is-compact' : ''}${isWildFamily ? ' is-wild-card' : ''}${options.extraClass ? ` ${options.extraClass}` : ''}"
                ${options.buttonAttrs || ''}
            >
                <span class="uno-card-corner">${card.type === 'wildDraw4' ? '+4' : (isWildFamily ? '' : visualLabel)}</span>
                <span class="uno-card-center">${isWildFamily ? wildIcon : visualLabel}</span>
            </button>
        `;
    }

    function renderUnoCardBack(compact = false) {
        return `
            <div class="uno-card-face is-back${compact ? ' is-back-compact' : ''}">
                <span class="card-back-emblem uno-card-back-mark"></span>
            </div>
        `;
    }

    function animateUnoCardTravel(cardHtml, fromElement, toElement, extraClass = '') {
        const startRect = fromElement?.getBoundingClientRect?.();
        const endRect = toElement?.getBoundingClientRect?.();
        if (!startRect || !endRect) {
            return;
        }

        const ghost = document.createElement('div');
        ghost.className = `uno-card-travel${extraClass ? ` ${extraClass}` : ''}`;
        ghost.innerHTML = cardHtml;

        const startX = startRect.left + (startRect.width / 2) - 49;
        const startY = startRect.top + (startRect.height / 2) - 72;
        const endX = endRect.left + (endRect.width / 2) - 49;
        const endY = endRect.top + (endRect.height / 2) - 72;

        ghost.style.left = `${startX}px`;
        ghost.style.top = `${startY}px`;
        ghost.style.setProperty('--uno-travel-x', `${endX - startX}px`);
        ghost.style.setProperty('--uno-travel-y', `${endY - startY}px`);
        document.body.appendChild(ghost);

        window.requestAnimationFrame(() => {
            ghost.classList.add('is-active');
        });

        window.setTimeout(() => {
            ghost.remove();
        }, 540);
    }

    function getUnoOpponentSourceElement(playerId, seats = {}) {
        if (!playerId) {
            return null;
        }

        if (seats.topOpponent?.id === playerId) {
            return unoOpponentsTop?.querySelector('.uno-opponent-cards');
        }

        if (seats.leftOpponent?.id === playerId) {
            return unoOpponentsLeft?.querySelector('.uno-opponent-cards');
        }

        if (seats.rightOpponent?.id === playerId) {
            return unoOpponentsRight?.querySelector('.uno-opponent-cards');
        }

        return null;
    }

    function playUnoPendingOpponentDrawAnimations(seats = {}) {
        if (!unoPendingOpponentDrawAnimations.size || !unoDrawButton) {
            return;
        }

        unoPendingOpponentDrawAnimations.forEach((drawCount, playerId) => {
            const destination = getUnoOpponentSourceElement(playerId, seats);
            if (!destination) {
                return;
            }

            const totalAnimations = Math.min(Number(drawCount) || 0, 4);
            for (let index = 0; index < totalAnimations; index += 1) {
                window.setTimeout(() => {
                    animateUnoCardTravel(renderUnoCardBack(), unoDrawButton, destination, 'is-opponent-drawn');
                }, index * 90);
            }
        });

        unoPendingOpponentDrawAnimations = new Map();
    }

    function getUnoDealTargetElement(playerId, kind = 'opponent') {
        if (kind === 'self') {
            return unoHand;
        }

        const me = unoState?.players?.find((player) => player.id === 'you' || player.isYou) || unoState?.players?.[0];
        const opponents = (unoState?.players || []).filter((player) => player.id !== me?.id);
        const topOpponent = opponents.length === 1
            ? opponents[0]
            : (opponents.length >= 3 ? opponents[0] : null);
        const leftOpponent = opponents.length === 2
            ? opponents[0]
            : (opponents.length >= 3 ? opponents[1] : null);
        const rightOpponent = opponents.length === 2
            ? opponents[1]
            : (opponents.length >= 3 ? opponents[2] : null);

        return getUnoOpponentSourceElement(playerId, { topOpponent, leftOpponent, rightOpponent });
    }

    function renderUnoOpponent(player, isActive = false, orientation = 'top') {
        const count = player.handCount ?? player.hand?.length ?? 0;
        const backCount = Math.min(count, orientation === 'top' ? 10 : 8);
        const drawFxCount = Math.min(unoOpponentDrawFx.get(player.id) || 0, backCount);
        return `
            <div class="uno-opponent uno-opponent-${orientation}${isActive ? ' is-active' : ''}${player.isYou ? ' is-you' : ''}">
                <div class="uno-opponent-head">
                    <span class="uno-opponent-name">${player.name}</span>
                    <strong class="uno-opponent-count">${count} cartes</strong>
                </div>
                <div class="uno-opponent-cards ${orientation === 'top' ? 'is-top' : 'is-side'}">
                    ${Array.from({ length: backCount }, (_, index) => {
                        const extraClass = index >= (backCount - drawFxCount) ? ' is-opponent-drawn' : '';
                        return `<div class="uno-opponent-back-shell${extraClass}">${renderUnoCardBack(true)}</div>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function maybeOpenUnoOutcomeModal() {
        if (!unoState?.winner) {
            unoLastWinnerKey = '';
            return;
        }

        const winnerKey = `${unoMode}:${unoState.turnCount}:${unoState.winner}`;
        if (winnerKey === unoLastWinnerKey) {
            return;
        }

        unoLastWinnerKey = winnerKey;
        const winner = unoState.players.find((player) => player.id === unoState.winner);
        const isVictory = winner?.id === 'you' || winner?.isYou;
        openGameOverModal(isVictory ? 'Victoire' : 'Partie termin\u00e9e', `${winner?.name || 'Un joueur'} remporte la manche de Buno.`);
    }

    function updateUnoHud() {
        if (!unoState) {
            return;
        }

        const me = unoState.players.find((player) => player.id === 'you' || player.isYou) || unoState.players[0];
        const currentPlayer = unoState.players[unoState.currentPlayerIndex];
        unoModeDisplay.textContent = isMultiplayerUnoActive() ? 'Online' : 'Solo IA';
        unoHandCountDisplay.textContent = String((unoMenuVisible && !unoMenuClosing) ? 0 : (me?.hand?.length || 0));
        unoTurnDisplay.textContent = currentPlayer ? `A ${currentPlayer.name} de jouer !` : '-';
        unoHelpText.textContent = unoState.winner
            ? `${unoState.players.find((player) => player.id === unoState.winner)?.name || 'Un joueur'} a gagné la manche.`
            : (isMultiplayerUnoActive()
                ? 'Pose une carte valide quand la main est à toi. Les autres mains restent cachées.'
                : 'Clique une carte jouable ou pioche si tu es bloqu\u00e9.');
        unoModeButtons.forEach((button) => {
            button.classList.toggle('is-active', (button.dataset.unoMode === 'online') === isMultiplayerUnoActive() && (!isMultiplayerUnoActive() || button.dataset.unoMode === 'online'));
            if (isMultiplayerUnoActive()) {
                button.disabled = true;
            } else {
                button.disabled = false;
                button.classList.toggle('is-active', button.dataset.unoMode === unoMode);
            }
        });
    }

    function renderUno() {
        if (!unoState) {
            renderUnoMenu();
            return;
        }

        if (maybeAutoResolveUnoPenalty()) {
            updateUnoHud();
            renderUnoMenu();
            return;
        }

        const me = unoState.players.find((player) => player.id === 'you' || player.isYou) || unoState.players[0];
        const currentPlayer = unoState.players[unoState.currentPlayerIndex];
        const topCard = getUnoTopCard();
        const myTurn = currentPlayer?.id === me?.id;
        const opponents = unoState.players.filter((player) => player.id !== me?.id);
        const topOpponent = opponents.length === 1
            ? opponents[0]
            : (opponents.length >= 3 ? opponents[0] : null);
        const leftOpponent = opponents.length === 2
            ? opponents[0]
            : (opponents.length >= 3 ? opponents[1] : null);
        const rightOpponent = opponents.length === 2
            ? opponents[1]
            : (opponents.length >= 3 ? opponents[2] : null);
        let opponentPlayedCard = null;
        const shouldMaskCardsForMenu = unoMenuVisible || unoMenuClosing;

        opponents.forEach((player) => {
            const count = player.handCount ?? player.hand?.length ?? 0;
            const previous = unoPreviousOpponentCounts.get(player.id);
            if (Number.isFinite(previous) && count > previous) {
                const drawCount = count - previous;
                unoOpponentDrawFx.set(player.id, drawCount);
                unoPendingOpponentDrawAnimations.set(player.id, drawCount);
            }
            if (Number.isFinite(previous) && count < previous && topCard?.id && topCard.id !== unoLastRenderedTopCardId) {
                opponentPlayedCard = player;
            }
            unoPreviousOpponentCounts.set(player.id, count);
        });

        if (unoOpponentsTop) {
            unoOpponentsTop.innerHTML = topOpponent
                ? renderUnoOpponent({
                    ...topOpponent,
                    handCount: topOpponent.handCount
                }, unoState.players[unoState.currentPlayerIndex]?.id === topOpponent.id, 'top')
                : '';
        }

        if (unoOpponentsLeft) {
            unoOpponentsLeft.innerHTML = leftOpponent
                ? renderUnoOpponent({
                    ...leftOpponent,
                    handCount: leftOpponent.handCount
                }, unoState.players[unoState.currentPlayerIndex]?.id === leftOpponent.id, 'left')
                : '';
            unoOpponentsLeft.classList.toggle('hidden', !leftOpponent);
        }

        if (unoOpponentsRight) {
            unoOpponentsRight.innerHTML = rightOpponent
                ? renderUnoOpponent({
                    ...rightOpponent,
                    handCount: rightOpponent.handCount
                }, unoState.players[unoState.currentPlayerIndex]?.id === rightOpponent.id, 'right')
                : '';
            unoOpponentsRight.classList.toggle('hidden', !rightOpponent);
        }

        unoDrawButton.innerHTML = `
            <span class="uno-draw-stack" aria-hidden="true"></span>
            <span class="uno-draw-label">PIOCHE</span>
        `;
        unoDiscardPile.innerHTML = shouldMaskCardsForMenu
            ? renderUnoCardBack()
            : renderUnoCard(topCard, {
                compact: false,
                displayColor: (topCard?.type === 'wild' || topCard?.type === 'wildDraw4') ? unoState.currentColor : topCard?.color
            });
        const sortedHand = (me?.hand || [])
            .map((card, index) => ({ card, originalIndex: index }))
            .sort((left, right) => getUnoCardSortWeight(left.card) - getUnoCardSortWeight(right.card));
        const visibleHand = sortedHand;
        unoHand.innerHTML = visibleHand.map(({ card, originalIndex }) => {
            if (shouldMaskCardsForMenu) {
                return renderUnoCardBack();
            }
            const playable = myTurn && isUnoCardPlayable(card);
            return renderUnoCard(card, {
                playable,
                extraClass: `${card.id === unoLastDrawnCardId ? 'is-drawn' : ''}${!playable ? ' is-unplayable' : ''}`.trim(),
                buttonAttrs: `data-uno-card-index="${originalIndex}"`
            });
        }).join('');

        if (!shouldMaskCardsForMenu && topCard?.id === unoLastPlayedCardId) {
            unoDiscardPile.querySelector('.uno-card-face')?.classList.add('is-played');
        }

        if (!shouldMaskCardsForMenu && !visibleHand.length && !me?.hand?.length) {
            unoHand.innerHTML = '<p class="uno-empty-hand">En attente de la fin de manche...</p>';
        }

        if (unoPendingPlayAnimation) {
            const discardCard = unoDiscardPile.querySelector('.uno-card-face');
            if (discardCard) {
                animateUnoCardTravel(unoPendingPlayAnimation, unoHand, unoDiscardPile);
            }
            unoPendingPlayAnimation = null;
        } else if (opponentPlayedCard && topCard) {
            const opponentSource = getUnoOpponentSourceElement(opponentPlayedCard.id, { topOpponent, leftOpponent, rightOpponent });
            if (opponentSource) {
                animateUnoCardTravel(renderUnoCard(topCard, {
                    displayColor: (topCard.type === 'wild' || topCard.type === 'wildDraw4') ? unoState.currentColor : topCard.color
                }), opponentSource, unoDiscardPile);
            }
        }

        if (unoPendingDrawAnimation) {
            animateUnoCardTravel(renderUnoCardBack(), unoDrawButton, unoHand);
            unoPendingDrawAnimation = false;
        }

        if (!shouldMaskCardsForMenu) {
            playUnoPendingOpponentDrawAnimations({ topOpponent, leftOpponent, rightOpponent });
        }

        unoDrawButton.disabled = !myTurn || Boolean(unoState.pendingColorChoice) || Boolean(unoState.winner) || unoDrawRequestPending;
        unoColorPicker.classList.toggle('hidden', !(unoState.pendingColorChoice && unoState.pendingColorChoice.playerId === me?.id));
        unoColorPicker.classList.toggle('is-waiting', unoColorChoicePending);
        unoDrawButton.classList.toggle('is-pulse', myTurn && !unoState.winner);
        unoEventBanner.textContent = unoState.lastAction || '';
        if (unoOpponentDrawFx.size) {
            window.setTimeout(() => {
                unoOpponentDrawFx.clear();
                if (activeGameTab === 'uno') {
                    renderUno();
                }
            }, 420);
        }
        unoLastRenderedTopCardId = topCard?.id || '';
        updateUnoHud();
        renderUnoMenu();
        maybeOpenUnoOutcomeModal();
    }

    function chooseUnoAiColor(hand) {
        const counts = new Map(UNO_COLORS.map((color) => [color, 0]));
        hand.forEach((card) => {
            if (counts.has(card.color)) {
                counts.set(card.color, counts.get(card.color) + 1);
            }
        });
        return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] || 'red';
    }

    function runSoloUnoAiTurn() {
        if (!unoState || isMultiplayerUnoActive() || unoState.winner) {
            return;
        }

        const currentPlayer = unoState.players[unoState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.id === 'you') {
            return;
        }

        const playableIndex = currentPlayer.hand.findIndex((card) => isUnoCardPlayable(card, unoState));

        if (playableIndex !== -1) {
            const chosenCard = currentPlayer.hand[playableIndex];
            const chosenColor = chosenCard.color === 'wild' ? chooseUnoAiColor(currentPlayer.hand) : null;
            finalizeUnoPlay(unoState, unoState.currentPlayerIndex, playableIndex, chosenColor);
            showUnoEvent(unoState.lastAction);
            renderUno();
        } else {
            const penalty = Math.max(1, Number(unoState.drawPenalty || 0));
            drawUnoCards(unoState, unoState.currentPlayerIndex, penalty);
            unoState.lastAction = `${currentPlayer.name} pioche ${penalty}.`;
            unoState.drawPenalty = 0;
            const drawnIndex = currentPlayer.hand.length - 1;
            if (penalty === 1 && isUnoCardPlayable(currentPlayer.hand[drawnIndex], unoState)) {
                const card = currentPlayer.hand[drawnIndex];
                finalizeUnoPlay(unoState, unoState.currentPlayerIndex, drawnIndex, card.color === 'wild' ? chooseUnoAiColor(currentPlayer.hand) : null);
            } else {
                unoState.currentPlayerIndex = getNextUnoPlayerIndex(unoState, 1);
            }
            showUnoEvent(unoState.lastAction);
            renderUno();
        }

        if (!unoState.winner && unoState.players[unoState.currentPlayerIndex]?.id !== 'you') {
            if (unoAiTimeout) {
                window.clearTimeout(unoAiTimeout);
            }
            unoAiTimeout = window.setTimeout(() => {
                unoAiTimeout = null;
                runSoloUnoAiTurn();
            }, 650);
        }
    }

    function handleSoloUnoCardPlay(cardIndex) {
        if (!unoState || unoState.winner) {
            return;
        }

        const currentPlayer = unoState.players[unoState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.id !== 'you') {
            return;
        }

        const card = currentPlayer.hand[cardIndex];
        if (!isUnoCardPlayable(card)) {
            return;
        }

        if (card.color === 'wild') {
            unoPendingColorContext = { cardIndex };
            unoColorPicker.classList.remove('hidden');
            unoState.pendingColorChoice = { playerId: 'you', cardId: card.id };
            renderUno();
            return;
        }

        unoPendingPlayAnimation = renderUnoCard(card, {
            displayColor: card.color,
            playable: false
        });
        finalizeUnoPlay(unoState, unoState.currentPlayerIndex, cardIndex);
        showUnoEvent(unoState.lastAction);
        renderUno();

        if (!unoState.winner && unoState.players[unoState.currentPlayerIndex]?.id !== 'you') {
            unoAiTimeout = window.setTimeout(() => {
                unoAiTimeout = null;
                runSoloUnoAiTurn();
            }, 650);
        }
    }

    function drawSoloUnoCard() {
        if (!unoState || unoState.winner) {
            unoDrawRequestPending = false;
            return;
        }

        const currentPlayer = unoState.players[unoState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.id !== 'you') {
            unoDrawRequestPending = false;
            return;
        }

        const amount = Math.max(1, Number(unoState.drawPenalty || 0));
        const drawn = drawUnoCards(unoState, unoState.currentPlayerIndex, amount);
        if (!drawn.length) {
            unoDrawRequestPending = false;
            return;
        }

        unoLastDrawnCardId = drawn[0].id;
        unoPendingDrawAnimation = true;
        unoState.lastAction = amount > 1 ? `Tu pioches ${amount}.` : 'Tu pioches 1.';
        showUnoEvent(unoState.lastAction);
        if (amount > 1 || !isUnoCardPlayable(drawn[0])) {
            unoState.currentPlayerIndex = getNextUnoPlayerIndex(unoState, 1);
        }
        unoState.drawPenalty = 0;
        renderUno();
        unoDrawRequestPending = false;

        if (!unoState.winner && unoState.players[unoState.currentPlayerIndex]?.id !== 'you') {
            unoAiTimeout = window.setTimeout(() => {
                unoAiTimeout = null;
                runSoloUnoAiTurn();
            }, 650);
        }
    }

    function chooseSoloUnoColor(color) {
        if (!unoPendingColorContext || !unoState || unoColorChoicePending) {
            return;
        }

        unoColorChoicePending = true;
        unoColorPicker.classList.add('is-waiting');
        showUnoEvent(`Couleur ${getUnoDisplayColor(color).toLowerCase()} choisie...`);
        renderUno();

        if (unoColorChoiceTimer) {
            window.clearTimeout(unoColorChoiceTimer);
        }

        unoColorChoiceTimer = window.setTimeout(() => {
            unoColorChoiceTimer = null;
            unoColorChoicePending = false;
            unoState.pendingColorChoice = null;
            finalizeUnoPlay(unoState, unoState.currentPlayerIndex, unoPendingColorContext.cardIndex, color);
            unoPendingPlayAnimation = renderUnoCard(unoState.discardPile[unoState.discardPile.length - 1], {
                displayColor: unoState.currentColor,
                playable: false
            });
            unoPendingColorContext = null;
            showUnoEvent(unoState.lastAction);
            renderUno();

            if (!unoState.winner && unoState.players[unoState.currentPlayerIndex]?.id !== 'you') {
                unoAiTimeout = window.setTimeout(() => {
                    unoAiTimeout = null;
                    runSoloUnoAiTurn();
                }, 650);
            }
        }, 500);
    }

    function setUnoMode(nextMode) {
        if (isMultiplayerUnoActive()) {
            setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
            return;
        }

        unoMode = nextMode === 'online' ? 'online' : 'solo';
        initializeUno();
    }

    function isMultiplayerUnoActive() {
        return multiplayerActiveRoom?.gameId === 'uno' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function syncMultiplayerUnoState() {
        if (!isMultiplayerUnoActive()) {
            if (unoMode === 'online' && activeGameTab === 'uno' && !multiplayerActiveRoom) {
                initializeUno();
            }
            return;
        }

        const shouldResetUnoVisualTrackers = !unoState || unoMode !== 'online';
        unoMode = 'online';
        unoPendingColorContext = null;
        unoColorChoicePending = false;
        if (shouldResetUnoVisualTrackers) {
            unoPreviousOpponentCounts = new Map();
            unoOpponentDrawFx = new Map();
            unoPendingOpponentDrawAnimations = new Map();
            unoPendingPlayAnimation = null;
            unoPendingDrawAnimation = false;
            unoLastRenderedTopCardId = '';
        }
        unoDrawRequestPending = false;
        unoState = cloneUnoState(multiplayerActiveRoom.gameState);
        unoLastDrawnCardId = '';
        if (multiplayerActiveRoom?.unoStarted && unoMenuVisible) {
            startUnoLaunchSequence();
            return;
        }
        renderUno();
    }

    const BOMB_LOCAL_SYLLABLES = [
        'ba', 'be', 'bi', 'bo', 'bu',
        'ca', 'ce', 'ci', 'co',
        'da', 'de', 'di', 'do',
        'fa', 'fe', 'fi', 'fo',
        'ga', 'ge', 'go',
        'la', 'le', 'li', 'lo', 'lu',
        'ma', 'me', 'mi', 'mo', 'mu',
        'na', 'ne', 'ni', 'no',
        'pa', 'pe', 'pi', 'po',
        'ra', 're', 'ri', 'ro',
        'sa', 'se', 'si', 'so',
        'ta', 'te', 'ti', 'to',
        'ou', 'on', 'an', 'eu', 'oi'
    ];
    const BOMB_LOCAL_TURN_MS = 12000;
    const BOMB_LOCAL_MIN_TURN_MS = 5000;
    const BOMB_LOCAL_TURN_STEP_MS = 280;
    const BOMB_LOCAL_RANDOM_EXPLOSION_MS = 800;
    const BOMB_LOCAL_MIN_BEFORE_RANDOM_MS = 2500;
    const BOMB_LOCAL_WORD_HISTORY_LIMIT = 24;

    function normalizeBombWordLocal(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
    }

    function pickRandomBombSyllable() {
        return BOMB_LOCAL_SYLLABLES[Math.floor(Math.random() * BOMB_LOCAL_SYLLABLES.length)];
    }

    function isBombLocalActive() {
        return !isMultiplayerBombActive() && Boolean(bombLocalState);
    }

    function getBombLocalRulesText() {
        return 'Les deux capitaines partagent le clavier. Tape un mot contenant la syllabe imprim\u00e9e sur la bombe, puis appuie sur Entr\u00e9e ou clique sur Envoyer pour passer la bombe \u00e0 l\u2019autre. La m\u00e8che raccourcit \u00e0 chaque tour et la bombe peut exploser sans pr\u00e9venir. Celui qui la tient au moment du boum a perdu.';
    }

    function createBombLocalState() {
        const syllable = pickRandomBombSyllable();
        const now = Date.now();
        return {
            players: [
                { id: 'local-1', name: 'Capitaine 1', eliminated: false, lives: 1 },
                { id: 'local-2', name: 'Capitaine 2', eliminated: false, lives: 1 }
            ],
            currentPlayerIndex: 0,
            currentSyllable: syllable,
            usedWords: [],
            usedWordsMap: {},
            winner: null,
            statusMessage: `Tour du Capitaine 1. Trouve un mot contenant \u00ab ${syllable.toUpperCase()} \u00bb.`,
            turnCount: 0,
            round: 1,
            turnDurationMs: BOMB_LOCAL_TURN_MS,
            turnDeadlineAt: now + BOMB_LOCAL_TURN_MS,
            fuseStart: now,
            lastWord: '',
            lastWordBy: null
        };
    }

    function startBombLocalRound() {
        bombLocalState = createBombLocalState();
        bombState = bombLocalState;
        startBombTimerLoop();
        renderBomb();
        window.setTimeout(() => {
            bombWordInput?.focus();
        }, 40);
    }

    function finishBombLocal(loserIndex, reason = 'explosion') {
        if (!bombLocalState) return;
        const loser = bombLocalState.players[loserIndex];
        const winner = bombLocalState.players[(loserIndex + 1) % 2];
        bombLocalState.winner = winner.id;
        bombLocalState.turnDeadlineAt = 0;
        bombLocalState.statusMessage = reason === 'timeout'
            ? `Temps écoulé. La bombe explose sur ${loser.name}. ${winner.name} remporte le duel.`
            : `BOUM ! La bombe saute sur ${loser.name}. ${winner.name} tient bon jusqu'à la fin.`;
        renderBomb();
        revealBombOutcomeMenu(
            `${winner.name} s'en sort`,
            `${loser.name} garde la bombe au moment de l'explosion. ${winner.name} remporte le duel.`,
            'Duel terminé'
        );
    }

    function handleBombLocalSubmit(word) {
        if (!bombLocalState || bombLocalState.winner) return;
        const trimmed = String(word || '').trim();
        if (!trimmed) return;
        const normalized = normalizeBombWordLocal(trimmed);
        const normalizedSyllable = normalizeBombWordLocal(bombLocalState.currentSyllable);

        if (normalized.length < 3) {
            bombLocalState.statusMessage = 'Trouve un mot d\u2019au moins 3 lettres.';
            renderBomb();
            return;
        }
        if (!normalized.includes(normalizedSyllable)) {
            bombLocalState.statusMessage = `Le mot doit contenir \u00ab ${bombLocalState.currentSyllable.toUpperCase()} \u00bb.`;
            renderBomb();
            return;
        }
        if (bombLocalState.usedWordsMap[normalized]) {
            bombLocalState.statusMessage = 'Ce mot a d\u00e9j\u00e0 \u00e9t\u00e9 utilis\u00e9.';
            renderBomb();
            return;
        }

        const currentPlayer = bombLocalState.players[bombLocalState.currentPlayerIndex];
        bombLocalState.usedWordsMap[normalized] = true;
        bombLocalState.usedWords.unshift({
            value: trimmed.slice(0, 32),
            normalized,
            by: currentPlayer.id
        });
        if (bombLocalState.usedWords.length > BOMB_LOCAL_WORD_HISTORY_LIMIT) {
            const removed = bombLocalState.usedWords.pop();
            if (removed?.normalized) {
                delete bombLocalState.usedWordsMap[removed.normalized];
            }
        }
        bombLocalState.lastWord = trimmed.slice(0, 32);
        bombLocalState.lastWordBy = currentPlayer.id;

        bombLocalState.currentPlayerIndex = (bombLocalState.currentPlayerIndex + 1) % 2;
        bombLocalState.currentSyllable = pickRandomBombSyllable();
        bombLocalState.turnCount += 1;
        const nextDuration = Math.max(
            BOMB_LOCAL_MIN_TURN_MS,
            BOMB_LOCAL_TURN_MS - bombLocalState.turnCount * BOMB_LOCAL_TURN_STEP_MS
        );
        bombLocalState.turnDurationMs = nextDuration;
        const now = Date.now();
        bombLocalState.turnDeadlineAt = now + nextDuration;
        bombLocalState.fuseStart = now;
        const nextPlayer = bombLocalState.players[bombLocalState.currentPlayerIndex];
        bombLocalState.statusMessage = `${currentPlayer.name} joue \u00ab ${bombLocalState.lastWord} \u00bb. Tour de ${nextPlayer.name}.`;
        renderBomb();
    }

    function tickBombLocal() {
        if (!bombLocalState || bombLocalState.winner) return;
        const now = Date.now();
        if (now >= bombLocalState.turnDeadlineAt) {
            finishBombLocal(bombLocalState.currentPlayerIndex, 'timeout');
            return;
        }
        const elapsed = now - (bombLocalState.fuseStart || now);
        if (elapsed >= BOMB_LOCAL_MIN_BEFORE_RANDOM_MS) {
            if (Math.random() < BOMB_LOCAL_RANDOM_EXPLOSION_MS / 60000) {
                finishBombLocal(bombLocalState.currentPlayerIndex, 'explosion');
            }
        }
    }

    function cloneBombState(state) {
        if (!state) {
            return null;
        }

        return {
            players: Array.isArray(state.players) ? state.players.map((player) => ({ ...player })) : [],
            currentPlayerIndex: Number(state.currentPlayerIndex ?? -1),
            currentSyllable: String(state.currentSyllable || ''),
            usedWords: Array.isArray(state.usedWords) ? state.usedWords.map((entry) => ({ ...entry })) : [],
            winner: state.winner || null,
            statusMessage: String(state.statusMessage || ''),
            turnCount: Number(state.turnCount || 0),
            round: Number(state.round || 0),
            turnDurationMs: Number(state.turnDurationMs || 0),
            turnDeadlineAt: Number(state.turnDeadlineAt || 0),
            lastWord: String(state.lastWord || ''),
            lastWordBy: state.lastWordBy || null
        };
    }

    function isMultiplayerBombActive() {
        return multiplayerActiveRoom?.gameId === 'bomb' && Boolean(multiplayerActiveRoom?.gameState);
    }

    function stopBombTimerLoop() {
        if (bombTimerInterval) {
            window.clearInterval(bombTimerInterval);
            bombTimerInterval = null;
        }
    }

    function startBombTimerLoop() {
        stopBombTimerLoop();
        bombTimerInterval = window.setInterval(() => {
            if (activeGameTab === 'bomb') {
                if (isBombLocalActive()) {
                    tickBombLocal();
                }
                renderBomb();
            }
        }, 200);
    }

    function getBombCurrentPlayer() {
        return bombState?.players?.[bombState.currentPlayerIndex] || null;
    }

    function getBombTimerSecondsLeft() {
        if (!bombState?.turnDeadlineAt) {
            return null;
        }

        return Math.max(0, Math.ceil((bombState.turnDeadlineAt - Date.now()) / 1000));
    }

    function maybeOpenBombOutcomeModal() {
        if (!bombState?.winner) {
            bombLastFinishedStateKey = '';
            return;
        }
        if (isBombLocalActive()) {
            return;
        }

        const finishedKey = `${bombState.round}:${bombState.winner}`;
        if (finishedKey === bombLastFinishedStateKey) {
            return;
        }

        bombLastFinishedStateKey = finishedKey;
        const winner = bombState.players.find((player) => player.id === bombState.winner);
        const isVictory = Boolean(multiplayerActiveRoom?.players?.find((player) => player.isYou)?.id === bombState.winner);
        openGameOverModal(isVictory ? 'Victoire' : 'Partie terminée', `${winner?.name || 'Un joueur'} remporte la manche de la Bombe.`);
    }

    function renderBombPlayers() {
        if (!bombPlayersBoard) {
            return;
        }

        if (!bombState?.players?.length) {
            bombPlayersBoard.textContent = 'Les joueurs de la room apparaitront ici.';
            return;
        }

        const currentPlayer = getBombCurrentPlayer();
        const currentRoomPlayer = multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
        bombPlayersBoard.innerHTML = bombState.players.map((player) => {
            const classes = ['bomb-player-chip'];
            if (currentPlayer?.id === player.id) {
                classes.push('is-active');
            }
            if (currentRoomPlayer?.id === player.id) {
                classes.push('is-you');
            }
            if (player.eliminated) {
                classes.push('is-eliminated');
            }

            return `
                <div class="${classes.join(' ')}">
                    <div class="bomb-player-head">
                        <span class="bomb-player-name">${player.name}</span>
                        <span class="bomb-player-role">${currentRoomPlayer?.id === player.id ? 'Toi' : (currentPlayer?.id === player.id ? 'Actif' : 'En veille')}</span>
                    </div>
                    <div class="bomb-player-meta">
                        <span>Vies: ${Math.max(0, Number(player.lives || 0))}</span>
                        <span>${player.eliminated ? 'Explosé' : 'Encore à bord'}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderBombUsedWords() {
        if (!bombUsedWords) {
            return;
        }

        if (!bombState?.usedWords?.length) {
            bombUsedWords.textContent = 'Aucun mot valide pour le moment.';
            return;
        }

        bombUsedWords.innerHTML = bombState.usedWords.slice(0, 16).map((entry) => {
            return `<span class="bomb-used-word-chip">${entry.value}</span>`;
        }).join('');
    }

    function renderBomb() {
        if (!bombGame) {
            return;
        }

        const isOnline = isMultiplayerBombActive();
        const isLocal = isBombLocalActive();
        const currentPlayer = getBombCurrentPlayer();
        const you = multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
        const isYourTurn = isLocal
            ? Boolean(currentPlayer && !bombState?.winner)
            : Boolean(currentPlayer?.id && currentPlayer.id === you?.id);
        const secondsLeft = getBombTimerSecondsLeft();
        const waitingForReady = isOnline && !multiplayerActiveRoom?.gameLaunched;
        const winner = bombState?.players?.find((player) => player.id === bombState?.winner) || null;

        bombSyllableDisplay.textContent = bombState?.currentSyllable?.toUpperCase?.() || '-';
        bombSpotlightSyllable.textContent = bombState?.currentSyllable?.toUpperCase?.() || '-';
        bombTurnDisplay.textContent = currentPlayer?.name || '-';
        bombTimerDisplay.textContent = secondsLeft === null ? '--' : `${secondsLeft}s`;
        bombSpotlightPlayer.textContent = winner
            ? `${winner.name} garde son calme jusqu'au bout.`
            : (currentPlayer ? `${currentPlayer.name} doit répondre maintenant.` : "En attente d'équipage");
        bombStatusBanner.textContent = waitingForReady
            ? "Quand tout le monde est prêt, la bombe s'allume dans la room."
            : (bombState?.statusMessage || (isLocal ? 'Passe la bombe en envoyant un mot valide.' : 'Rejoins un salon pour lancer la bombe.'));
        bombHelpText.textContent = isLocal
            ? (winner
                ? `Manche terminée. ${winner.name} remporte le duel local.`
                : `Tour de ${currentPlayer?.name || 'Capitaine'}. Mot avec ${bombState?.currentSyllable?.toUpperCase?.() || '-'} puis Entrée.`)
            : (isOnline
                ? (isYourTurn
                    ? `A toi de jouer. Entre un mot avec ${bombState?.currentSyllable?.toUpperCase?.() || '-'} avant l'explosion.`
                    : `Observe la manche. ${currentPlayer?.name || 'Un joueur'} tient la bombe.`)
                : "Duel local ou multijoueur. Choisis ton mode depuis le menu pour lancer la bombe.");
        bombWordInput.disabled = !((isOnline && !waitingForReady && isYourTurn && !bombState?.winner) || (isLocal && !bombState?.winner));
        bombWordSubmitButton.disabled = bombWordInput.disabled;
        bombRestartButton.disabled = isOnline
            ? (waitingForReady || !Boolean(bombState?.winner))
            : !isLocal;

        renderBombPlayers();
        renderBombUsedWords();
        maybeOpenBombOutcomeModal();
        renderBombMenu();
    }

    function getBombRulesText() {
        return getBombLocalRulesText();
    }

    function renderBombMenu() {
        if (!bombMenuOverlay || !bombTable) return;
        syncGameMenuOverlayBounds(bombMenuOverlay, bombTable);
        bombMenuOverlay.classList.toggle('hidden', !bombMenuVisible);
        bombMenuOverlay.classList.toggle('is-closing', bombMenuClosing);
        bombMenuOverlay.classList.toggle('is-entering', bombMenuEntering);
        bombTable.classList.toggle('is-menu-open', bombMenuVisible);

        bombMenuModeButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.bombMode === bombSelectedMode);
        });

        if (!bombMenuVisible) return;

        const hasResult = Boolean(bombState?.winner);

        if (bombMenuEyebrow) {
            bombMenuEyebrow.textContent = bombMenuShowingRules
                ? 'R\u00e8gles'
                : (hasResult ? 'Fin de manche' : 'La Bombe du bord');
        }
        if (bombMenuTitle) {
            bombMenuTitle.textContent = bombMenuShowingRules
                ? 'Rappel rapide'
                : (hasResult ? 'Manche terminée' : 'Bombe');
        }
        if (bombMenuText) {
            if (bombMenuShowingRules) {
                bombMenuText.textContent = getBombRulesText();
            } else if (hasResult) {
                const winner = bombState.players.find((player) => player.id === bombState.winner);
                bombMenuText.textContent = winner
                    ? `${winner.name} garde son calme et remporte le duel.`
                    : 'La manche est terminée.';
            } else {
                bombMenuText.textContent = bombSelectedMode === 'local'
                    ? 'Duel local : deux capitaines partagent le clavier. Passe la bombe avant qu\u2019elle n\u2019explose.'
                    : 'Multijoueur en ligne : rejoins ou cr\u00e9e un salon dans le navire Jeux pour affronter d\u2019autres capitaines.';
            }
        }
        if (bombMenuActionButton) {
            bombMenuActionButton.textContent = bombMenuShowingRules
                ? 'Retour'
                : (hasResult ? 'Rejouer un duel' : (bombSelectedMode === 'local' ? 'Allumer la mèche' : 'Aller au lobby'));
        }
        if (bombMenuRulesButton) {
            bombMenuRulesButton.textContent = 'R\u00e8gles';
            bombMenuRulesButton.hidden = bombMenuShowingRules;
        }
    }

    function closeBombMenu() {
        bombMenuClosing = true;
        renderBombMenu();
        window.setTimeout(() => {
            bombMenuClosing = false;
            bombMenuVisible = false;
            bombMenuShowingRules = false;
            bombMenuEntering = false;
            renderBombMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function revealBombOutcomeMenu(title, text, eyebrow) {
        bombMenuVisible = true;
        bombMenuShowingRules = false;
        bombMenuClosing = false;
        bombMenuEntering = true;
        renderBombMenu();
        if (bombMenuEyebrow && eyebrow) bombMenuEyebrow.textContent = eyebrow;
        if (bombMenuTitle && title) bombMenuTitle.textContent = title;
        if (bombMenuText && text) bombMenuText.textContent = text;
        window.setTimeout(() => {
            bombMenuEntering = false;
            renderBombMenu();
        }, UNO_MENU_CLOSE_DURATION_MS);
    }

    function syncMultiplayerBombState() {
        if (!isMultiplayerBombActive()) {
            if (activeGameTab === 'bomb') {
                initializeBomb();
            }
            return;
        }

        bombState = cloneBombState(multiplayerActiveRoom.gameState);
        startBombTimerLoop();
        renderBomb();
        const currentPlayer = getBombCurrentPlayer();
        const you = multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
        if (activeGameTab === 'bomb' && currentPlayer?.id === you?.id && !bombState?.winner) {
            window.setTimeout(() => {
                bombWordInput?.focus();
                bombWordInput?.select?.();
            }, 40);
        }
    }

    function initializeBomb() {
        closeGameOverModal();
        bombMenuShowingRules = false;
        bombMenuClosing = false;
        bombMenuEntering = false;
        if (isMultiplayerBombActive()) {
            bombLocalState = null;
            bombMenuVisible = false;
            syncMultiplayerBombState();
            if (bombWordInput && multiplayerActiveRoom?.gameLaunched) {
                const currentPlayer = getBombCurrentPlayer();
                const you = multiplayerActiveRoom?.players?.find((player) => player.isYou) || null;
                if (currentPlayer?.id === you?.id) {
                    window.setTimeout(() => bombWordInput.focus(), 60);
                }
            }
            return;
        }

        stopBombTimerLoop();
        bombLocalState = null;
        bombState = null;
        renderBomb();
    }

    function initializeUno() {
        closeGameOverModal();
        if (unoAiTimeout) {
            window.clearTimeout(unoAiTimeout);
            unoAiTimeout = null;
        }
        if (unoColorChoiceTimer) {
            window.clearTimeout(unoColorChoiceTimer);
            unoColorChoiceTimer = null;
        }

        if (isMultiplayerUnoActive()) {
            unoMenuVisible = !Boolean(multiplayerActiveRoom?.unoStarted);
            unoMenuShowingRules = false;
            syncMultiplayerUnoState();
            return;
        }

        unoMode = 'solo';
        unoMenuVisible = true;
        unoMenuShowingRules = false;
        unoPendingColorContext = null;
        unoLastWinnerKey = '';
        unoLastPlayedCardId = '';
        unoLastDrawnCardId = '';
        unoPreviousOpponentCounts = new Map();
        unoOpponentDrawFx = new Map();
        unoPendingOpponentDrawAnimations = new Map();
        unoColorChoicePending = false;
        unoPendingPlayAnimation = null;
        unoPendingDrawAnimation = false;
        unoDrawRequestPending = false;
        unoLastRenderedTopCardId = '';
        unoState = buildSoloUnoState();
        renderUno();
    }

    function openSelectedGame(nextTab) {
        cleanupActiveGameForNavigation(nextTab);

        if (MULTIPLAYER_SUPPORTED_GAMES[nextTab]) {
            setSelectedMultiplayerGame(nextTab);
        }

        showGamePanel(nextTab);

        if (nextTab === 'snake') {
            snakeMenuVisible = true;
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
            sudokuMenuVisible = true;
            initializeSudoku(false);
            return;
        }

        if (nextTab === 'aim') {
            aimMenuVisible = true;
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
            battleshipMenuVisible = true;
            initializeBattleship();
            return;
        }

        if (nextTab === 'tetris') {
            tetrisMenuVisible = true;
            initializeTetris();
            return;
        }

        if (nextTab === 'pacman') {
            pacmanMenuVisible = true;
            initializePacman();
            return;
        }

        if (nextTab === 'solitaire') {
            solitaireMenuVisible = true;
            initializeSolitaire();
            return;
        }

        if (nextTab === 'connect4') {
            initializeConnect4();
            return;
        }

        if (nextTab === 'rhythm') {
            rhythmMenuVisible = true;
            initializeRhythm();
            return;
        }

        if (nextTab === 'flappy') {
            initializeFlappy();
            return;
        }

        if (nextTab === 'flowFree') {
            flowFreeMenuVisible = true;
            initializeFlowFree();
            return;
        }

        if (nextTab === 'magicSort') {
            magicSortMenuVisible = true;
            initializeMagicSort();
            return;
        }

        if (nextTab === 'mentalMath') {
            initializeMentalMath();
            return;
        }

        if (nextTab === 'candyCrush') {
            candyCrushMenuVisible = true;
            initializeCandyCrush();
            return;
        }

        if (nextTab === 'harborRun') {
            harborRunMenuVisible = true;
            initializeHarborRun();
            return;
        }

        if (nextTab === 'stacker') {
            stackerMenuVisible = true;
            initializeStacker();
            return;
        }

        if (nextTab === 'coinClicker') {
            coinClickerMenuVisible = true;
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
            airHockeyMenuVisible = true;
            initializeAirHockey();
            return;
        }

        if (nextTab === 'reaction') {
            reactionMenuVisible = true;
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

        if (nextTab === 'blockBlast') {
            blockBlastMenuVisible = true;
            initializeBlockBlast();
            return;
        }

        if (nextTab === 'uno') {
            initializeUno();
            return;
        }

        if (nextTab === 'bomb') {
            bombMenuVisible = true;
            initializeBomb();
            return;
        }

        initializeGame();
    }

    gameHomeTiles.forEach((tile) => {
        tile.addEventListener('click', () => {
            if (tile.dataset.multiplayerGameSelect) {
                setSelectedMultiplayerGame(tile.dataset.multiplayerGameSelect);
                setMultiplayerEntryMode('create');
                return;
            }

            openSelectedGame(tile.dataset.openGame);
        });
    });

    gamesSectionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            showGamesSection(button.dataset.gamesSection || 'home');
        });
    });

    gamesFilterSearchInput?.addEventListener('input', () => {
        updateGamesFilters();
    });

    gamesFilterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeGamesFilter = button.dataset.gamesFilter || 'all';
            gamesFilterButtons.forEach((chip) => {
                chip.classList.toggle('is-active', chip === button);
            });
            updateGamesFilters();
        });
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

    minesweeperMenuActionButton?.addEventListener('click', () => {
        if (minesweeperMenuShowingRules) {
            minesweeperMenuShowingRules = false;
            renderMinesweeperMenu();
            return;
        }

        initializeGame();
        closeMinesweeperMenu();
    });

    minesweeperMenuRulesButton?.addEventListener('click', () => {
        minesweeperMenuShowingRules = true;
        renderMinesweeperMenu();
    });

    snakeStartButton.addEventListener('click', () => {
        startSnake();
    });

    snakeMenuActionButton?.addEventListener('click', () => {
        if (snakeMenuShowingRules) {
            snakeMenuShowingRules = false;
            renderSnakeMenu();
            return;
        }

        startSnake();
        closeSnakeMenu();
    });

    snakeMenuRulesButton?.addEventListener('click', () => {
        snakeMenuShowingRules = true;
        renderSnakeMenu();
    });

    pongMenuActionButton?.addEventListener('click', () => {
        if (pongMenuShowingRules) {
            pongMenuShowingRules = false;
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
        pongMenuShowingRules = !pongMenuShowingRules;
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

        sudokuSelectedCell = { row, col };
        renderSudoku();
    });

    sudokuRestartButton.addEventListener('click', () => {
        initializeSudoku(!sudokuMenuVisible);
    });

    sudokuDifficultyButton?.addEventListener('click', () => {
        sudokuDifficultyIndex = (sudokuDifficultyIndex + 1) % SUDOKU_DIFFICULTIES.length;
        initializeSudoku(!sudokuMenuVisible);
    });

    sudokuMenuActionButton?.addEventListener('click', () => {
        if (sudokuMenuShowingRules) {
            sudokuMenuShowingRules = false;
            renderSudokuMenu();
            return;
        }

        initializeSudoku(true);
        closeSudokuMenu();
    });

    sudokuMenuRulesButton?.addEventListener('click', () => {
        sudokuMenuShowingRules = true;
        renderSudokuMenu();
    });

    game2048RestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initialize2048();
    });

    game2048MenuActionButton?.addEventListener('click', () => {
        if (game2048MenuShowingRules) {
            game2048MenuShowingRules = false;
            render2048Menu();
            return;
        }

        if (game2048MenuResult) {
            initialize2048();
            close2048Menu();
            return;
        }

        close2048Menu();
    });

    game2048MenuRulesButton?.addEventListener('click', () => {
        game2048MenuShowingRules = !game2048MenuShowingRules;
        render2048Menu();
    });

    game2048Board?.addEventListener('touchstart', (event) => {
        if (game2048MenuVisible || activeGameTab !== '2048') {
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch) {
            return;
        }

        game2048TouchStartX = touch.clientX;
        game2048TouchStartY = touch.clientY;
    }, { passive: true });

    game2048Board?.addEventListener('touchend', (event) => {
        if (game2048MenuVisible || activeGameTab !== '2048') {
            game2048TouchStartX = null;
            game2048TouchStartY = null;
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch || game2048TouchStartX === null || game2048TouchStartY === null) {
            game2048TouchStartX = null;
            game2048TouchStartY = null;
            return;
        }

        const deltaX = touch.clientX - game2048TouchStartX;
        const deltaY = touch.clientY - game2048TouchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const minSwipeDistance = 24;
        let direction = null;

        if (Math.max(absX, absY) >= minSwipeDistance) {
            direction = absX > absY
                ? (deltaX > 0 ? 'right' : 'left')
                : (deltaY > 0 ? 'down' : 'up');
        }

        game2048TouchStartX = null;
        game2048TouchStartY = null;

        if (direction) {
            event.preventDefault();
            move2048(direction);
        }
    }, { passive: false });

    snakeBoard?.addEventListener('touchstart', (event) => {
        if (activeGameTab !== 'snake') {
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch) {
            return;
        }

        snakeTouchStartX = touch.clientX;
        snakeTouchStartY = touch.clientY;
    }, { passive: true });

    snakeBoard?.addEventListener('touchend', (event) => {
        if (activeGameTab !== 'snake') {
            snakeTouchStartX = null;
            snakeTouchStartY = null;
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch || snakeTouchStartX === null || snakeTouchStartY === null) {
            snakeTouchStartX = null;
            snakeTouchStartY = null;
            return;
        }

        const deltaX = touch.clientX - snakeTouchStartX;
        const deltaY = touch.clientY - snakeTouchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const minSwipeDistance = 20;

        snakeTouchStartX = null;
        snakeTouchStartY = null;

        if (Math.max(absX, absY) < minSwipeDistance) {
            return;
        }

        queueSnakeDirectionInput(
            absX > absY
                ? (deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 })
                : (deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 })
        );
        event.preventDefault();
    }, { passive: false });

    pacmanBoard?.addEventListener('touchstart', (event) => {
        if (activeGameTab !== 'pacman' || pacmanMenuVisible || pacmanMenuClosing) {
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch) {
            return;
        }

        pacmanTouchStartX = touch.clientX;
        pacmanTouchStartY = touch.clientY;
    }, { passive: true });

    pacmanBoard?.addEventListener('touchend', (event) => {
        if (activeGameTab !== 'pacman' || pacmanMenuVisible || pacmanMenuClosing) {
            pacmanTouchStartX = null;
            pacmanTouchStartY = null;
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch || pacmanTouchStartX === null || pacmanTouchStartY === null) {
            pacmanTouchStartX = null;
            pacmanTouchStartY = null;
            return;
        }

        const deltaX = touch.clientX - pacmanTouchStartX;
        const deltaY = touch.clientY - pacmanTouchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const minSwipeDistance = 20;

        pacmanTouchStartX = null;
        pacmanTouchStartY = null;

        if (Math.max(absX, absY) < minSwipeDistance) {
            return;
        }

        pacmanNextDirection = absX > absY
            ? (deltaX > 0 ? { row: 0, col: 1 } : { row: 0, col: -1 })
            : (deltaY > 0 ? { row: 1, col: 0 } : { row: -1, col: 0 });
        event.preventDefault();
    }, { passive: false });

    tetrisBoard?.addEventListener('touchstart', (event) => {
        if (activeGameTab !== 'tetris' || tetrisMenuVisible || tetrisMenuClosing) {
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch) {
            return;
        }

        tetrisTouchStartX = touch.clientX;
        tetrisTouchStartY = touch.clientY;
    }, { passive: true });

    tetrisBoard?.addEventListener('touchend', (event) => {
        if (activeGameTab !== 'tetris' || tetrisMenuVisible || tetrisMenuClosing) {
            tetrisTouchStartX = null;
            tetrisTouchStartY = null;
            return;
        }

        const touch = event.changedTouches[0];
        if (!touch || tetrisTouchStartX === null || tetrisTouchStartY === null) {
            tetrisTouchStartX = null;
            tetrisTouchStartY = null;
            return;
        }

        const deltaX = touch.clientX - tetrisTouchStartX;
        const deltaY = touch.clientY - tetrisTouchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const minSwipeDistance = 20;

        tetrisTouchStartX = null;
        tetrisTouchStartY = null;

        if (Math.max(absX, absY) < minSwipeDistance) {
            rotateTetrisPiece();
            event.preventDefault();
            return;
        }

        if (absX > absY) {
            moveTetrisHorizontally(deltaX > 0 ? 1 : -1);
        } else if (deltaY > 0) {
            dropTetrisStep();
        } else {
            rotateTetrisPiece();
        }

        event.preventDefault();
    }, { passive: false });

    aimMenuActionButton?.addEventListener('click', () => {
        if (aimMenuShowingRules) {
            aimMenuShowingRules = false;
            renderAimMenu();
            return;
        }
        initializeAim();
        closeAimMenu();
        window.setTimeout(() => { startAimRound(); }, UNO_MENU_CLOSE_DURATION_MS);
    });

    aimMenuRulesButton?.addEventListener('click', () => {
        aimMenuShowingRules = true;
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
        if (aimMenuVisible || aimMenuClosing) return;
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

    memoryMenuActionButton?.addEventListener('click', () => {
        if (memoryMenuShowingRules) {
            memoryMenuShowingRules = false;
            renderMemoryMenu();
            return;
        }

        closeGameOverModal();
        initializeMemory();
        startMemoryLaunchSequence();
    });

    memoryMenuRulesButton?.addEventListener('click', () => {
        memoryMenuShowingRules = !memoryMenuShowingRules;
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
        if (ticTacToeMenuShowingRules) {
            ticTacToeMenuShowingRules = false;
            renderTicTacToeMenu();
            return;
        }

        if (ticTacToeMenuResult) {
            if (isMultiplayerTicTacToeActive()) {
                multiplayerSocket?.emit('tictactoe:restart');
                ticTacToeMenuVisible = false;
                ticTacToeMenuResult = null;
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

        ticTacToeMenuResult = null;
        closeTicTacToeMenu();
    });

    ticTacToeMenuRulesButton?.addEventListener('click', () => {
        ticTacToeMenuShowingRules = !ticTacToeMenuShowingRules;
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

        handleTicTacToeMove(
            Number(cellButton.dataset.index),
            ticTacToeMode === 'duo' ? ticTacToeCurrentPlayer : 'anchor'
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
        if (battleshipMenuShowingRules) {
            battleshipMenuShowingRules = false;
            renderBattleshipMenu();
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
        battleshipMenuShowingRules = true;
        renderBattleshipMenu();
    });

    tetrisStartButton.addEventListener('click', () => {
        startTetris();
    });

    tetrisMenuActionButton?.addEventListener('click', () => {
        if (tetrisMenuShowingRules) {
            tetrisMenuShowingRules = false;
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
        tetrisMenuShowingRules = true;
        renderTetrisMenu();
    });

    pacmanStartButton.addEventListener('click', () => {
        startPacman();
    });

    pacmanMenuActionButton?.addEventListener('click', () => {
        if (pacmanMenuShowingRules) {
            pacmanMenuShowingRules = false;
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
        pacmanMenuShowingRules = true;
        renderPacmanMenu();
    });

    solitaireMenuActionButton?.addEventListener('click', () => {
        if (solitaireMenuShowingRules) {
            solitaireMenuShowingRules = false;
            renderSolitaireMenu();
            return;
        }
        initializeSolitaire();
        closeSolitaireMenu();
    });

    solitaireMenuRulesButton?.addEventListener('click', () => {
        solitaireMenuShowingRules = true;
        renderSolitaireMenu();
    });

    solitaireRestartButton.addEventListener('click', () => {
        initializeSolitaire();
    });

    connect4MenuActionButton?.addEventListener('click', () => {
        if (connect4MenuShowingRules) {
            connect4MenuShowingRules = false;
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
            connect4MenuVisible = false;
            connect4MenuResult = false;
            renderConnect4Menu();
            return;
        }

        initializeConnect4();
        startConnect4LaunchSequence();
    });

    connect4MenuRulesButton?.addEventListener('click', () => {
        connect4MenuShowingRules = !connect4MenuShowingRules;
        renderConnect4Menu();
    });

    connect4ModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setConnect4Mode(button.dataset.connect4Mode);
        });
    });

    rhythmMenuActionButton?.addEventListener('click', () => {
        if (rhythmMenuShowingRules) {
            rhythmMenuShowingRules = false;
            renderRhythmMenu();
            return;
        }
        closeRhythmMenu();
        window.setTimeout(() => { startRhythm(); }, UNO_MENU_CLOSE_DURATION_MS);
    });

    rhythmMenuRulesButton?.addEventListener('click', () => {
        rhythmMenuShowingRules = true;
        renderRhythmMenu();
    });

    rhythmStartButton.addEventListener('click', () => {
        startRhythm();
    });

    flappyMenuActionButton?.addEventListener('click', () => {
        if (flappyMenuShowingRules) {
            flappyMenuShowingRules = false;
            renderFlappyMenu();
            return;
        }

        initializeFlappy();
        startFlappyLaunchSequence();
    });

    flappyMenuRulesButton?.addEventListener('click', () => {
        flappyMenuShowingRules = !flappyMenuShowingRules;
        renderFlappyMenu();
    });

    flowFreeMenuActionButton?.addEventListener('click', () => {
        if (flowFreeMenuShowingRules) {
            flowFreeMenuShowingRules = false;
            renderFlowFreeMenu();
            return;
        }
        initializeFlowFree();
        closeFlowFreeMenu();
    });

    flowFreeMenuRulesButton?.addEventListener('click', () => {
        flowFreeMenuShowingRules = true;
        renderFlowFreeMenu();
    });

    flowFreeRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeFlowFree();
    });

    magicSortMenuActionButton?.addEventListener('click', () => {
        if (magicSortMenuShowingRules) {
            magicSortMenuShowingRules = false;
            renderMagicSortMenu();
            return;
        }
        initializeMagicSort();
        closeMagicSortMenu();
    });

    magicSortMenuRulesButton?.addEventListener('click', () => {
        magicSortMenuShowingRules = true;
        renderMagicSortMenu();
    });

    magicSortRestartButton.addEventListener('click', () => {
        closeGameOverModal();
        initializeMagicSort();
    });

    mentalMathMenuActionButton?.addEventListener('click', () => {
        if (mentalMathMenuShowingRules) {
            mentalMathMenuShowingRules = false;
            renderMentalMathMenu();
            return;
        }

        initializeMentalMath();
        startMentalMathLaunchSequence();
    });

    mentalMathMenuRulesButton?.addEventListener('click', () => {
        mentalMathMenuShowingRules = !mentalMathMenuShowingRules;
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
        if (activeGameTab !== 'mentalMath' || mentalMathMenuVisible || mentalMathMenuClosing) {
            return;
        }

        if (!mentalMathRoundRunning) {
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
        if (candyCrushMenuShowingRules) {
            candyCrushMenuShowingRules = false;
            renderCandyCrushMenu();
            return;
        }

        initializeCandyCrush();
        closeCandyCrushMenu();
    });

    candyCrushMenuRulesButton?.addEventListener('click', () => {
        candyCrushMenuShowingRules = true;
        renderCandyCrushMenu();
    });

    harborRunStartButton.addEventListener('click', () => {
        closeGameOverModal();
        startHarborRun();
    });

    harborRunMenuActionButton?.addEventListener('click', () => {
        if (harborRunMenuShowingRules) {
            harborRunMenuShowingRules = false;
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
        harborRunMenuShowingRules = true;
        renderHarborRunMenu();
    });

    stackerStartButton.addEventListener('click', () => {
        dropStackerLayer();
    });

    stackerMenuActionButton?.addEventListener('click', () => {
        if (stackerMenuShowingRules) {
            stackerMenuShowingRules = false;
            renderStackerMenu();
            return;
        }

        initializeStacker();
        closeStackerMenu();
    });

    stackerMenuRulesButton?.addEventListener('click', () => {
        stackerMenuShowingRules = true;
        renderStackerMenu();
    });

    coinClickerButton?.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) {
            return;
        }

        if (coinClickerMenuVisible || coinClickerMenuClosing) {
            return;
        }

        coinClickerState.coins += getCoinClickerCoinsPerClick();
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
        if (coinClickerMenuShowingRules) {
            coinClickerMenuShowingRules = false;
            renderCoinClickerMenu();
            return;
        }

        closeCoinClickerMenu();
    });

    coinClickerMenuRulesButton?.addEventListener('click', () => {
        coinClickerMenuShowingRules = true;
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
                ? 'Ton butin vaut plus à chaque clic.'
                : 'Tes clics frappent plus fort sur la caisse.');
        saveCoinClickerState();
        renderCoinClicker();
    });

    chessMenuActionButton?.addEventListener('click', () => {
        if (chessMenuShowingRules) {
            chessMenuShowingRules = false;
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
        chessMenuShowingRules = !chessMenuShowingRules;
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
        if (chessSuppressNextClick) {
            chessSuppressNextClick = false;
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
        if (checkersMenuShowingRules) {
            checkersMenuShowingRules = false;
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
            checkersMenuVisible = false;
            checkersMenuResult = false;
            renderCheckersMenu();
            return;
        }

        initializeCheckers();
        startCheckersLaunchSequence();
    });

    checkersMenuRulesButton?.addEventListener('click', () => {
        checkersMenuShowingRules = !checkersMenuShowingRules;
        renderCheckersMenu();
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
            if (isMultiplayerAirHockeyActive()) {
                setMultiplayerStatus('Le mode est piloté par le salon en ligne.');
                return;
            }

            airHockeyMode = button.dataset.airhockeyMode;
            airHockeyModeButtons.forEach((item) => item.classList.toggle('is-active', item === button));
            airHockeyHelpText.textContent = airHockeyMode === 'solo'
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
        if (airHockeyMenuShowingRules) {
            airHockeyMenuShowingRules = false;
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
        airHockeyMenuShowingRules = true;
        renderAirHockeyMenu();
    });

    reactionMenuActionButton?.addEventListener('click', () => {
        if (reactionMenuShowingRules) {
            reactionMenuShowingRules = false;
            renderReactionMenu();
            return;
        }

        startReactionRound();
        closeReactionMenu();
    });

    reactionMenuRulesButton?.addEventListener('click', () => {
        reactionMenuShowingRules = true;
        renderReactionMenu();
    });

    function handleReactionAttempt() {
        if (reactionState === 'armed') {
            window.clearTimeout(reactionTimeout);
            initializeReaction();
            revealReactionOutcomeMenu(
                'Faux départ',
                "Trop tôt. Attends vraiment l'allumage de la lanterne avant de cliquer.",
                'Veille annulée'
            );
            return;
        }

        if (reactionState !== 'lit') {
            return;
        }

        const reactionTime = Math.round(performance.now() - reactionStartTime);
        reactionState = 'done';
        reactionLantern.classList.remove('is-lit');
        reactionTable?.classList.remove('is-lit');
        reactionTable?.classList.add('is-extinguishing');
        window.setTimeout(() => {
            reactionTable?.classList.remove('is-extinguishing');
        }, 430);
        reactionLastDisplay.textContent = `${reactionTime} ms`;
        const isRecord = !reactionBestTime || reactionTime < reactionBestTime;
        if (!reactionBestTime || reactionTime < reactionBestTime) {
            reactionBestTime = reactionTime;
            window.localStorage.setItem(REACTION_BEST_KEY, String(reactionBestTime));
        }
        reactionBestDisplay.textContent = reactionBestTime ? `${reactionBestTime} ms` : '-';
        const reactionCopy = getReactionPerformanceCopy(reactionTime, isRecord);
        revealReactionOutcomeMenu(reactionCopy.title, reactionCopy.text, reactionCopy.eyebrow);
    }

    reactionLantern?.addEventListener('click', (event) => {
        event.stopPropagation();
        handleReactionAttempt();
    });

    reactionTable?.addEventListener('click', (event) => {
        if (reactionMenuVisible || reactionMenuClosing) {
            return;
        }

        if (event.target === reactionMenuOverlay) {
            return;
        }

        handleReactionAttempt();
    });

    baieBerryMenuActionButton?.addEventListener('click', () => {
        if (baieBerryMenuShowingRules) {
            baieBerryMenuShowingRules = false;
            renderBaieBerryMenu();
            return;
        }

        initializeBaieBerry();
        startBaieBerryLaunchSequence();
    });

    baieBerryMenuRulesButton?.addEventListener('click', () => {
        baieBerryMenuShowingRules = !baieBerryMenuShowingRules;
        renderBaieBerryMenu();
    });

    baieBerryCanvas?.addEventListener('pointermove', (event) => {
        if (baieBerryMenuVisible || baieBerryMenuClosing) {
            return;
        }
        const bounds = baieBerryCanvas.getBoundingClientRect();
        const scaleX = baieBerryCanvas.width / bounds.width;
        const x = (event.clientX - bounds.left) * scaleX;
        baieBerryLastPointerX = x;
        updateBaieBerryDropGuide(x);
    });

    baieBerryCanvas?.addEventListener('click', (event) => {
        if (baieBerryMenuVisible || baieBerryMenuClosing) {
            return;
        }
        const bounds = baieBerryCanvas.getBoundingClientRect();
        const scaleX = baieBerryCanvas.width / bounds.width;
        dropBaieBerryAt((event.clientX - bounds.left) * scaleX);
    });

    breakoutMenuActionButton?.addEventListener('click', () => {
        if (breakoutMenuShowingRules) {
            breakoutMenuShowingRules = false;
            renderBreakoutMenu();
            return;
        }

        if (breakoutMenuResult) {
            initializeBreakout();
            startBreakoutLaunchSequence();
            return;
        }

        initializeBreakout();
        startBreakoutLaunchSequence();
    });

    breakoutMenuRulesButton?.addEventListener('click', () => {
        breakoutMenuShowingRules = !breakoutMenuShowingRules;
        renderBreakoutMenu();
    });

    blockBlastMenuActionButton?.addEventListener('click', () => {
        if (blockBlastMenuShowingRules) {
            blockBlastMenuShowingRules = false;
            renderBlockBlastMenu();
            return;
        }
        initializeBlockBlast();
        closeBlockBlastMenu();
    });

    blockBlastMenuRulesButton?.addEventListener('click', () => {
        blockBlastMenuShowingRules = true;
        renderBlockBlastMenu();
    });

    blockBlastStartButton?.addEventListener('click', () => {
        initializeBlockBlast();
    });

    blockBlastPieces?.addEventListener('pointerdown', (event) => {
        if (blockBlastMenuVisible || blockBlastMenuClosing) return;
        const pieceButton = event.target.closest('[data-blockblast-piece]');
        if (!pieceButton || !blockBlastState) {
            return;
        }

        const index = Number(pieceButton.dataset.blockblastPiece);
        const piece = blockBlastState.pieces[index];
        if (!piece) {
            return;
        }

        event.preventDefault();
        blockBlastSuppressClick = false;
        stopBlockBlastDrag();
        blockBlastDragState = {
            pointerId: event.pointerId,
            pieceIndex: index,
            piece,
            sourceElement: pieceButton,
            startX: event.clientX,
            startY: event.clientY,
            moved: false
        };
    });

    document.addEventListener('pointermove', (event) => {
        if (!blockBlastDragState || event.pointerId !== blockBlastDragState.pointerId) {
            return;
        }

        const dragDistance = Math.hypot(
            event.clientX - blockBlastDragState.startX,
            event.clientY - blockBlastDragState.startY
        );
        if (dragDistance > 6) {
            blockBlastDragState.moved = true;
            blockBlastSuppressClick = true;
        }

        const anchor = getBlockBlastAnchorFromPoint(event.clientX, event.clientY);
        if (!anchor) {
            clearBlockBlastPreview();
            return;
        }

        updateBlockBlastPreview(blockBlastDragState.piece, anchor.row, anchor.col);
    });

    document.addEventListener('pointerup', (event) => {
        if (!blockBlastDragState || event.pointerId !== blockBlastDragState.pointerId) {
            return;
        }

        const anchor = getBlockBlastAnchorFromPoint(event.clientX, event.clientY);
        const shouldPlace = blockBlastDragState.moved
            && anchor
            && canPlaceBlockBlastPiece(blockBlastDragState.piece, anchor.row, anchor.col);
        const draggedPieceIndex = blockBlastDragState.pieceIndex;

        stopBlockBlastDrag();

        if (shouldPlace) {
            placeBlockBlastPieceAtIndex(draggedPieceIndex, anchor.row, anchor.col);
        }

        if (blockBlastSuppressClick) {
            window.setTimeout(() => {
                blockBlastSuppressClick = false;
            }, 0);
        }
    });

    document.addEventListener('pointercancel', (event) => {
        if (!blockBlastDragState || event.pointerId !== blockBlastDragState.pointerId) {
            return;
        }

        stopBlockBlastDrag();
        blockBlastSuppressClick = false;
    });

    blockBlastPieces?.addEventListener('click', (event) => {
        if (blockBlastSuppressClick) {
            blockBlastSuppressClick = false;
            return;
        }

        const pieceButton = event.target.closest('[data-blockblast-piece]');
        if (!pieceButton || !blockBlastState) {
            return;
        }

        const index = Number(pieceButton.dataset.blockblastPiece);
        if (!blockBlastState.pieces[index]) {
            return;
        }

        blockBlastSelectedPieceIndex = blockBlastSelectedPieceIndex === index ? null : index;
        clearBlockBlastPreview();
        renderBlockBlastPieces();
    });

    blockBlastBoard?.addEventListener('click', (event) => {
        if (blockBlastMenuVisible || blockBlastMenuClosing) return;
        if (blockBlastSuppressClick) {
            blockBlastSuppressClick = false;
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
        if (unoDrawRequestPending) {
            return;
        }

        if (isMultiplayerUnoActive()) {
            unoDrawRequestPending = true;
            unoPendingDrawAnimation = true;
            multiplayerSocket?.emit('uno:draw-card');
            return;
        }

        unoDrawRequestPending = true;
        drawSoloUnoCard();
    });

    unoMenuActionButton?.addEventListener('click', () => {
        if (unoMenuShowingRules) {
            unoMenuShowingRules = false;
            renderUnoMenu();
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
        unoMenuShowingRules = !unoMenuShowingRules;
        renderUnoMenu();
    });

    unoColorChoiceButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const color = button.dataset.unoColor;
            if (!color) {
                return;
            }

            if (isMultiplayerUnoActive()) {
                if (unoColorChoicePending) {
                    return;
                }
                unoColorChoicePending = true;
                unoColorPicker.classList.add('is-waiting');
                showUnoEvent(`Couleur ${getUnoDisplayColor(color).toLowerCase()} choisie...`);
                if (unoColorChoiceTimer) {
                    window.clearTimeout(unoColorChoiceTimer);
                }
                unoColorChoiceTimer = window.setTimeout(() => {
                    unoColorChoiceTimer = null;
                    multiplayerSocket?.emit('uno:choose-color', { color });
                }, 500);
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
            unoPendingPlayAnimation = cardButton.outerHTML;
            multiplayerSocket?.emit('uno:play-card', { cardIndex });
            return;
        }

        handleSoloUnoCardPlay(cardIndex);
    });

    bombWordForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        if (bombMenuVisible || bombMenuClosing) {
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

        if (isBombLocalActive() || bombLocalState) {
            startBombLocalRound();
        }
    });

    bombMenuModeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const mode = button.dataset.bombMode;
            if (mode === 'local' || mode === 'online') {
                bombSelectedMode = mode;
                renderBombMenu();
            }
        });
    });

    bombMenuActionButton?.addEventListener('click', () => {
        if (bombMenuShowingRules) {
            bombMenuShowingRules = false;
            renderBombMenu();
            return;
        }

        if (bombSelectedMode === 'local') {
            startBombLocalRound();
            closeBombMenu();
            return;
        }

        bombLocalState = null;
        bombState = null;
        stopBombTimerLoop();
        closeBombMenu();
        renderBomb();
    });

    bombMenuRulesButton?.addEventListener('click', () => {
        bombMenuShowingRules = true;
        renderBombMenu();
    });

    battleshipEnemyBoard.addEventListener('click', (event) => {
        if (battleshipMenuVisible || battleshipMenuClosing) {
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
        if (solitaireMenuVisible || solitaireMenuClosing) return;
        const actionButton = event.target.closest('[data-solitaire-action]');

        if (!actionButton) {
            return;
        }

        drawSolitaireCard();
    });

    solitaireWaste.addEventListener('click', (event) => {
        if (solitaireMenuVisible || solitaireMenuClosing) return;
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
        if (solitaireMenuVisible || solitaireMenuClosing) return;
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
        if (solitaireMenuVisible || solitaireMenuClosing) return;
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
        if (rhythmMenuVisible || rhythmMenuClosing) return;
        const pad = event.target.closest('[data-rhythm-lane]');

        if (!pad) {
            return;
        }

        handleRhythmHit(Number(pad.dataset.rhythmLane));
    });

    flappyBoard.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        if (flappyMenuVisible || flappyMenuClosing) {
            return;
        }
        flapFlappyBird();
    });

    flowFreeBoard.addEventListener('pointerdown', (event) => {
        if (flowFreeMenuVisible || flowFreeMenuClosing) return;
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

    document.addEventListener('pointerup', (event) => {
        if (flowFreePointerDown) {
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
        if (flowFreePointerDown) {
            flushFlowFreePendingTarget();
            stopFlowFreePath();
        }
    });

    magicSortBoard.addEventListener('pointerdown', (event) => {
        if (magicSortMenuVisible || magicSortMenuClosing) return;
        const tubeButton = event.target.closest('[data-magic-sort-tube]');
        if (!tubeButton) {
            return;
        }

        handleMagicSortTubeClick(Number(tubeButton.dataset.magicSortTube));
    });

    candyCrushBoard.addEventListener('pointerdown', (event) => {
        if (candyCrushMenuVisible || candyCrushMenuClosing) {
            return;
        }
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
        if (candyCrushMenuVisible || candyCrushMenuClosing) {
            candyCrushPointerStart = null;
            return;
        }
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
        if (harborRunMenuVisible || harborRunMenuClosing) {
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

    catalogDirectorFilterInput?.addEventListener('input', (event) => {
        catalogDirectorTerm = event.target.value;
        renderCatalog();
    });

    catalogReleaseFilterSelect?.addEventListener('change', (event) => {
        catalogReleaseFilter = event.target.value;
        renderCatalog();
    });

    catalogLetterFilterSelect?.addEventListener('change', (event) => {
        catalogLetterFilter = event.target.value;
        renderCatalog();
    });

    catalogRatingFilterSelect?.addEventListener('change', (event) => {
        catalogMinimumRatingFilter = event.target.value;
        renderCatalog();
    });

    catalogSortFilterSelect?.addEventListener('change', (event) => {
        catalogSortMode = event.target.value;
        renderCatalog();
    });

    catalogGenreFilterGroup?.addEventListener('change', (event) => {
        const genreInput = event.target.closest('input[name="catalogGenreFilter"]');
        if (!genreInput) {
            return;
        }

        if (genreInput.checked) {
            catalogSelectedGenres.add(genreInput.value);
        } else {
            catalogSelectedGenres.delete(genreInput.value);
        }
        renderCatalog();
    });

    catalogResetFiltersButton?.addEventListener('click', () => {
        catalogSelectedGenres = new Set();
        catalogReleaseFilter = 'all';
        catalogLetterFilter = 'all';
        catalogMinimumRatingFilter = 'all';
        catalogSortMode = 'title-asc';
        catalogDirectorTerm = '';
        searchTerm = '';

        if (searchInput) {
            searchInput.value = '';
        }

        renderCatalogFilters();
        renderCatalog();
    });

    confirmModal.addEventListener('click', (event) => {
        if (event.target.dataset.closeModal === 'true') {
            closeDeleteModal();
        }
    });

    legalNoticeModal?.addEventListener('click', (event) => {
        if (event.target.dataset.closeLegalNotice === 'true') {
            closeLegalNoticeModal();
        }
    });

    openLegalNoticeButton?.addEventListener('click', () => {
        openLegalNoticeModal();
    });

    closeLegalNoticeButton?.addEventListener('click', () => {
        closeLegalNoticeModal();
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

        if (event.key === 'Escape' && legalNoticeModal && !legalNoticeModal.classList.contains('hidden')) {
            closeLegalNoticeModal();
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
            queueSnakeDirectionInput(nextDirection);
            return;
        }

        if (activeGameTab === 'pong' && ['ArrowUp', 'ArrowDown', 'z', 'Z', 's', 'S'].includes(event.key)) {
            event.preventDefault();
            pongKeys.add(event.key);
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

            if (pongPaused) {
                resumePong();
            } else {
                pausePong();
            }

            return;
        }

        if (activeGameTab === 'tetris') {
            if (tetrisMenuVisible || tetrisMenuClosing) {
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
            if (pacmanMenuVisible || pacmanMenuClosing) {
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
                pacmanNextDirection = nextPacmanDirection;
                return;
            }
        }

        if (activeGameTab === 'rhythm') {
            if (rhythmMenuVisible || rhythmMenuClosing) return;
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
            if (harborRunMenuVisible || harborRunMenuClosing) {
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
                airHockeyKeys.add(normalizedKey);
                if (isMultiplayerAirHockeyActive()) {
                    pushMultiplayerAirHockeyInput();
                }
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
                if (!breakoutAnimationFrame) {
                    breakoutAnimationFrame = window.requestAnimationFrame(updateBreakout);
                }
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
        if (activeGameTab === 'pong' && isMultiplayerPongActive()) {
            pushMultiplayerPongInput();
        }
        airHockeyKeys.delete(event.key.toLowerCase());
        if (activeGameTab === 'airHockey' && isMultiplayerAirHockeyActive()) {
            pushMultiplayerAirHockeyInput();
        }
        breakoutKeys.delete(event.key.toLowerCase());
    });

    window.addEventListener('resize', () => {
        if (resizeFrame !== null) {
            window.cancelAnimationFrame(resizeFrame);
        }

        resizeFrame = window.requestAnimationFrame(() => {
            resizeFrame = null;
            syncAllGameMenuOverlayBounds();

        if (activeGameTab === 'snake') {
            renderSnake();
        }

        if (activeGameTab === 'pong') {
            if (isMultiplayerPongActive()) {
                syncMultiplayerPongState();
            } else {
                resetPongRound();
            }
        }

        if (activeGameTab === 'airHockey') {
            initializeAirHockey(false);
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
    });

    multiplayerCreateRoomButton?.addEventListener('click', () => {
        createMultiplayerRoom();
    });

    multiplayerJoinRoomButton?.addEventListener('click', () => {
        joinMultiplayerRoom();
    });

    multiplayerCreateModeButton?.addEventListener('click', () => {
        setMultiplayerEntryMode('create');
    });

    multiplayerJoinModeButton?.addEventListener('click', () => {
        setMultiplayerEntryMode('join');
    });

    multiplayerCopyCodeButton?.addEventListener('click', () => {
        copyMultiplayerRoomCode();
    });

    multiplayerJoinRoomCodeInput?.addEventListener('input', () => {
        multiplayerJoinRoomCodeInput.value = multiplayerJoinRoomCodeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    });
    multiplayerChatForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        sendMultiplayerChatMessage();
    });

    multiplayerCreatePlayerNameInput?.addEventListener('input', () => {
        syncMultiplayerPlayerNames('create');
    });

    multiplayerJoinPlayerNameInput?.addEventListener('input', () => {
        syncMultiplayerPlayerNames('join');
    });

    renderAll();
    importMoviesFromExcel();
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
    initializeConverter();
    activateMathPanel('mathCalculatorPanel');
    activateMusicPanel('musicHomePanel');
    renderPiano();
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







