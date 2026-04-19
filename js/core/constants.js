// Shared cross-module constants for La Baie des Naufragés.
// Extracted verbatim from script.js during the ES-modules migration.
// The original declarations inside script.js's IIFE are preserved for now;
// both versions coexist without conflict (different scopes).

export const LEGAL_NOTICE_ANIMATION_MS = 220;

export const SESSION_KEY = 'baie-des-naufrages-session';
export const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000;

export const EXCEL_FILE_CANDIDATES = [
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

export const MULTIPLAYER_SUPPORTED_GAMES = {
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

export const GAME_FILTER_TAGS = {
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

export const UNO_MENU_CLOSE_DURATION_MS = 260;
export const GRID_OUTCOME_MENU_DELAY_MS = 650;
