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

    const PONG_TARGET_SCORE = 7;
    const CONNECT4_ROWS = 6;
    const CONNECT4_COLS = 7;
    const BATTLESHIP_SIZE = 8;
    const UNO_COLORS = ['red', 'yellow', 'green', 'blue'];
    const BATTLESHIP_SHIPS = [4, 3, 3, 2, 2];
    const CHESS_SIZE = 8;
    const CHECKERS_SIZE = 8;
    const AIR_HOCKEY_GOAL_SCORE = 5;
    const AIR_HOCKEY_SPEED = 340;
    const AIR_HOCKEY_CENTER_GAP = 8;
    const AIR_HOCKEY_PADDLE_RADIUS = 34;
    const AIR_HOCKEY_PUCK_RADIUS = 22;
    const AIR_HOCKEY_PUCK_MAX_SPEED = 700;
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
    let sessionTimeout = null;
    let activeGameTab = 'home';
    // Bridge pour les modules ESM : expose l'onglet actif courant.
    if (typeof window !== 'undefined') {
        window.__baieActiveGameTab = () => activeGameTab;
    }
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
    let game2048TouchStartX = null;
    let game2048TouchStartY = null;
    let snakeTouchStartX = null;
    let snakeTouchStartY = null;
    let pacmanTouchStartX = null;
    let pacmanTouchStartY = null;
    let tetrisTouchStartX = null;
    let tetrisTouchStartY = null;
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
            battleshipMenuVisible = true;
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
            airHockeyMenuVisible = true;
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
            battleshipMenuVisible = true;
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
            airHockeyMenuVisible = true;
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

        pongKeys.delete(event.key);
        if (activeGameTab === 'pong' && isMultiplayerPongActive()) {
            pushMultiplayerPongInput();
        }
        airHockeyKeys.delete(event.key.toLowerCase());
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







