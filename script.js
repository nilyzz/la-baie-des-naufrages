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
    let sessionTimeout = null;
    let activeGameTab = 'home';
    // Bridge pour les modules ESM : expose l'onglet actif courant.
    if (typeof window !== 'undefined') {
        window.__baieActiveGameTab = () => activeGameTab;
    }
    let game2048TouchStartX = null;
    let game2048TouchStartY = null;
    let snakeTouchStartX = null;
    let snakeTouchStartY = null;
    let pacmanTouchStartX = null;
    let pacmanTouchStartY = null;
    let tetrisTouchStartX = null;
    let tetrisTouchStartY = null;
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
            __mw.setMinesweeperMenuVisible(true);
            initializeGame();
        }

        if (previousTab === 'snake' && nextTab !== 'snake') {
            __sn.setSnakeMenuVisible(true);
            stopSnake();
            initializeSnake();
        }

        if (previousTab === 'pong' && nextTab !== 'pong') {
            stopPong();
            initializePong();
        }

        if (previousTab === 'sudoku' && nextTab !== 'sudoku') {
            __su.setSudokuMenuVisible(true);
            initializeSudoku(false);
        }

        if (previousTab === '2048' && nextTab !== '2048') {
            initialize2048();
        }

        if (previousTab === 'aim' && nextTab !== 'aim') {
            __am.setAimMenuVisible(true);
            initializeAim();
        }

        if (previousTab === 'memory' && nextTab !== 'memory') {
            initializeMemory();
        }

        if (previousTab === 'ticTacToe' && nextTab !== 'ticTacToe') {
            initializeTicTacToe();
        }

        if (previousTab === 'battleship' && nextTab !== 'battleship') {
            __bs.setBattleshipMenuVisible(true);
            initializeBattleship();
        }

        if (previousTab === 'tetris' && nextTab !== 'tetris') {
            __tt.setTetrisMenuVisible(true);
            initializeTetris();
        }

        if (previousTab === 'pacman' && nextTab !== 'pacman') {
            __pm.setPacmanMenuVisible(true);
            initializePacman();
        }

        if (previousTab === 'solitaire' && nextTab !== 'solitaire') {
            __sol.setSolitaireMenuVisible(true);
            initializeSolitaire();
        }

        if (previousTab === 'connect4' && nextTab !== 'connect4') {
            initializeConnect4();
        }

        if (previousTab === 'rhythm' && nextTab !== 'rhythm') {
            __rh.setRhythmMenuVisible(true);
            initializeRhythm();
        }

        if (previousTab === 'flappy' && nextTab !== 'flappy') {
            initializeFlappy();
        }

        if (previousTab === 'flowFree' && nextTab !== 'flowFree') {
            __ff.setFlowFreeMenuVisible(true);
            initializeFlowFree();
        }

        if (previousTab === 'magicSort' && nextTab !== 'magicSort') {
            __ms.setMagicSortMenuVisible(true);
            initializeMagicSort();
        }

        if (previousTab === 'mentalMath' && nextTab !== 'mentalMath') {
            initializeMentalMath();
        }

        if (previousTab === 'candyCrush' && nextTab !== 'candyCrush') {
            __cc2.setCandyCrushMenuVisible(true);
            initializeCandyCrush();
        }

        if (previousTab === 'harborRun' && nextTab !== 'harborRun') {
            __hr.setHarborRunMenuVisible(true);
            initializeHarborRun();
        }

        if (previousTab === 'stacker' && nextTab !== 'stacker') {
            __st.setStackerMenuVisible(true);
            initializeStacker();
        }

        if (previousTab === 'coinClicker' && nextTab !== 'coinClicker') {
            saveCoinClickerState();
            __cc.setCoinClickerMenuVisible(true);
        }

        if (previousTab === 'chess' && nextTab !== 'chess') {
            initializeChess();
        }

        if (previousTab === 'checkers' && nextTab !== 'checkers') {
            initializeCheckers();
        }

        if (previousTab === 'airHockey' && nextTab !== 'airHockey') {
            __ah.setAirHockeyMenuVisible(true);
            if (isMultiplayerAirHockeyActive()) {
                stopAirHockeyRuntime();
            } else {
                initializeAirHockey();
            }
        }

        if (previousTab === 'reaction' && nextTab !== 'reaction') {
            __rx.setReactionMenuVisible(true);
            initializeReaction();
        }

        if (previousTab === 'baieBerry' && nextTab !== 'baieBerry') {
            stopBaieBerry();
            initializeBaieBerry();
        }

        if (previousTab === 'breakout' && nextTab !== 'breakout') {
            __bk.setBreakoutMenuVisible(true);
            stopBreakout();
            initializeBreakout();
        }

        if (previousTab === 'uno' && nextTab !== 'uno') {
            initializeUno();
        }

        if (previousTab === 'bomb' && nextTab !== 'bomb') {
            stopBombTimerLoop();
            __bm.setBombLocalState(null);
            __bm.setBombMenuVisible(true);
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





    function openSelectedGame(nextTab) {
        cleanupActiveGameForNavigation(nextTab);

        if (MULTIPLAYER_SUPPORTED_GAMES[nextTab]) {
            setSelectedMultiplayerGame(nextTab);
        }

        showGamePanel(nextTab);

        if (nextTab === 'snake') {
            __sn.setSnakeMenuVisible(true);
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
            __su.setSudokuMenuVisible(true);
            initializeSudoku(false);
            return;
        }

        if (nextTab === 'aim') {
            __am.setAimMenuVisible(true);
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
            __bs.setBattleshipMenuVisible(true);
            initializeBattleship();
            return;
        }

        if (nextTab === 'tetris') {
            __tt.setTetrisMenuVisible(true);
            initializeTetris();
            return;
        }

        if (nextTab === 'pacman') {
            __pm.setPacmanMenuVisible(true);
            initializePacman();
            return;
        }

        if (nextTab === 'solitaire') {
            __sol.setSolitaireMenuVisible(true);
            initializeSolitaire();
            return;
        }

        if (nextTab === 'connect4') {
            initializeConnect4();
            return;
        }

        if (nextTab === 'rhythm') {
            __rh.setRhythmMenuVisible(true);
            initializeRhythm();
            return;
        }

        if (nextTab === 'flappy') {
            initializeFlappy();
            return;
        }

        if (nextTab === 'flowFree') {
            __ff.setFlowFreeMenuVisible(true);
            initializeFlowFree();
            return;
        }

        if (nextTab === 'magicSort') {
            __ms.setMagicSortMenuVisible(true);
            initializeMagicSort();
            return;
        }

        if (nextTab === 'mentalMath') {
            initializeMentalMath();
            return;
        }

        if (nextTab === 'candyCrush') {
            __cc2.setCandyCrushMenuVisible(true);
            initializeCandyCrush();
            return;
        }

        if (nextTab === 'harborRun') {
            __hr.setHarborRunMenuVisible(true);
            initializeHarborRun();
            return;
        }

        if (nextTab === 'stacker') {
            __st.setStackerMenuVisible(true);
            initializeStacker();
            return;
        }

        if (nextTab === 'coinClicker') {
            __cc.setCoinClickerMenuVisible(true);
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
            __ah.setAirHockeyMenuVisible(true);
            initializeAirHockey();
            return;
        }

        if (nextTab === 'reaction') {
            __rx.setReactionMenuVisible(true);
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
            __bb.setBlockBlastMenuVisible(true);
            initializeBlockBlast();
            return;
        }

        if (nextTab === 'uno') {
            initializeUno();
            return;
        }

        if (nextTab === 'bomb') {
            __bm.setBombMenuVisible(true);
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

    game2048Board?.addEventListener('touchstart', (event) => {
        if (__g2.get2048MenuVisible() || activeGameTab !== '2048') {
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
        if (__g2.get2048MenuVisible() || activeGameTab !== '2048') {
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
        if (activeGameTab !== 'pacman' || __pm.getPacmanMenuVisible() || __pm.getPacmanMenuClosing()) {
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
        if (activeGameTab !== 'pacman' || __pm.getPacmanMenuVisible() || __pm.getPacmanMenuClosing()) {
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

        __pm.setPacmanNextDirection(absX > absY
            ? (deltaX > 0 ? { row: 0, col: 1 } : { row: 0, col: -1 })
            : (deltaY > 0 ? { row: 1, col: 0 } : { row: -1, col: 0 }));
        event.preventDefault();
    }, { passive: false });

    tetrisBoard?.addEventListener('touchstart', (event) => {
        if (activeGameTab !== 'tetris' || __tt.getTetrisMenuVisible() || __tt.getTetrisMenuClosing()) {
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
        if (activeGameTab !== 'tetris' || __tt.getTetrisMenuVisible() || __tt.getTetrisMenuClosing()) {
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

        __pg.getPongKeys().delete(event.key);
        if (activeGameTab === 'pong' && isMultiplayerPongActive()) {
            pushMultiplayerPongInput();
        }
        __ah.getAirHockeyKeys().delete(event.key.toLowerCase());
        if (activeGameTab === 'airHockey' && isMultiplayerAirHockeyActive()) {
            pushMultiplayerAirHockeyInput();
        }
        __bk.getBreakoutKeys().delete(event.key.toLowerCase());
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







