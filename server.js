const path = require('path');
const http = require('http');
const fs = require('fs/promises');
const cors = require('cors');
const express = require('express');
const { Server } = require('socket.io');
const compression = require('compression');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CORS_ORIGIN = parseCorsOrigin(process.env.CORS_ORIGIN);
const CONNECT4_ROWS = 6;
const CONNECT4_COLS = 7;
const CHESS_SIZE = 8;
const CHECKERS_SIZE = 8;
const BATTLESHIP_SIZE = 8;
const BATTLESHIP_SHIPS = [4, 3, 3, 2, 2];
const PONG_TARGET_SCORE = 7;
const PONG_BOARD_WIDTH = 700;
const PONG_BOARD_HEIGHT = Math.round(PONG_BOARD_WIDTH * 9 / 16);
const PONG_PADDLE_HEIGHT = 104;
const PONG_PADDLE_WIDTH = 24;
const PONG_BALL_SIZE = 20;
const PONG_PADDLE_OFFSET = 22;
const PONG_COLLISION_MARGIN = 2;
const PONG_PLAYER_SPEED = 380;
const PONG_BALL_SPEED_X = 388;
const PONG_COUNTDOWN_MS = 2320;
const PONG_TICK_MS = 1000 / 60;
const AIR_HOCKEY_GOAL_SCORE = 5;
const AIR_HOCKEY_WIDTH = 720;
const AIR_HOCKEY_HEIGHT = 360;
const AIR_HOCKEY_PADDLE_RADIUS = 27;
const AIR_HOCKEY_PUCK_RADIUS = 22;
const AIR_HOCKEY_SPEED = 280;
const AIR_HOCKEY_COUNTDOWN_MS = 2120;
const AIR_HOCKEY_TICK_MS = 1000 / 60;
const BOMB_TURN_MS = 14000;
const BOMB_MIN_TURN_MS = 7000;
const BOMB_TURN_STEP_MS = 350;
const BOMB_STARTING_LIVES = 3;
const BOMB_WORD_HISTORY_LIMIT = 24;
const ROOM_CHAT_LIMIT = 40;
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_SEARCH_BASE_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const POSTERS_CACHE_PATH = path.join(__dirname, 'posters-cache.json');
const CHECKERS_DIRECTIONS = {
  red: [[-1, -1], [-1, 1]],
  black: [[1, -1], [1, 1]]
};
const MAX_PLAYERS_BY_GAME = {
  pong: 2,
  airHockey: 2,
  battleship: 2,
  ticTacToe: 2,
  connect4: 2,
  chess: 2,
  checkers: 2,
  uno: 4,
  bomb: 6
};

const BOMB_SYLLABLES = [
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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

const rooms = new Map();
let postersCache = null;
let postersPersistTimer = null;
const roomCreationRateMap = new Map();

function parseCorsOrigin(value) {
  const origins = String(value || '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!origins.length || origins.includes('*')) {
    return '*';
  }

  return origins;
}

app.use(compression());
app.use(express.json());
app.use((err, _request, response, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'invalid-json' });
  }
  return next(err);
});
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST']
}));

const SENSITIVE_FILE_RE = /^\/(?:server\.js|package(?:-lock)?\.json|film\.xlsx|posters-cache\.json|render\.yaml|readme\.md|cname|\.env|node_modules)/i;

app.use((req, res, next) => {
  if (SENSITIVE_FILE_RE.test(req.path)) {
    return res.status(403).end();
  }

  next();
});

app.use(express.static(path.join(__dirname)));

function normalizePosterCacheKey(title, year = '') {
  return `${String(title || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()}|${String(year || '').trim()}`;
}

function extractMovieYear(movie = {}) {
  const rawValue = String(movie.releaseDisplay || movie.releaseDate || '').trim();
  const yearMatch = rawValue.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : '';
}

async function ensurePostersCacheLoaded() {
  if (postersCache) {
    return postersCache;
  }

  try {
    const cacheContent = await fs.readFile(POSTERS_CACHE_PATH, 'utf8');
    postersCache = JSON.parse(cacheContent);
  } catch (_error) {
    postersCache = {};
  }

  return postersCache;
}

async function persistPostersCache() {
  if (!postersCache) {
    return;
  }

  try {
    await fs.writeFile(POSTERS_CACHE_PATH, JSON.stringify(postersCache, null, 2));
  } catch (error) {
    console.error('Impossible de persister posters-cache.json.', error);
  }
}

function schedulePersistPostersCache() {
  if (postersPersistTimer) {
    return;
  }

  postersPersistTimer = setTimeout(() => {
    postersPersistTimer = null;
    persistPostersCache();
  }, 10000);
}

async function searchTmdbPoster(title, year = '') {
  if (!TMDB_API_KEY || !title) {
    return '';
  }

  const attempts = [
    { query: title, year },
    { query: title, year: '' }
  ];

  for (const attempt of attempts) {
    const searchParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: attempt.query,
      include_adult: 'false',
      language: 'fr-FR'
    });

    if (attempt.year) {
      searchParams.set('year', attempt.year);
    }

    const response = await fetch(`${TMDB_SEARCH_BASE_URL}?${searchParams.toString()}`);

    if (!response.ok) {
      continue;
    }

    const payload = await response.json();
    const bestMatch = Array.isArray(payload?.results)
      ? payload.results.find((item) => item?.poster_path) || payload.results[0]
      : null;

    if (bestMatch?.poster_path) {
      return `${TMDB_IMAGE_BASE_URL}${bestMatch.poster_path}`;
    }
  }

  return '';
}

async function resolvePosterForMovie(movie = {}) {
  const title = String(movie.title || '').trim();
  const year = extractMovieYear(movie);

  if (!title) {
    return '';
  }

  const cache = await ensurePostersCacheLoaded();
  const cacheKey = normalizePosterCacheKey(title, year);

  if (cacheKey in cache) {
    return cache[cacheKey];
  }

  const resolvedPosterUrl = await searchTmdbPoster(title, year);
  cache[cacheKey] = resolvedPosterUrl;
  schedulePersistPostersCache();
  return resolvedPosterUrl;
}

function generateRoomCode() {
  let code = '';

  for (let index = 0; index < ROOM_CODE_LENGTH; index += 1) {
    const alphabetIndex = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length);
    code += ROOM_CODE_ALPHABET[alphabetIndex];
  }

  return code;
}

function createUniqueRoomCode() {
  let attempts = 0;

  while (attempts < 1000) {
    const code = generateRoomCode();
    if (!rooms.has(code)) {
      return code;
    }
    attempts += 1;
  }

  throw new Error('Impossible de generer un code de room unique.');
}

function sanitizePlayerName(name, fallback = 'Pirate') {
  const nextName = String(name || '')
    .normalize('NFKC')
    .replace(/[<>&"'`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);

  return nextName || fallback;
}

function getNextPirateFallback(room) {
  const pirateCount = room.players.filter((player) => player.id !== room.hostId).length;
  return `Pirate ${pirateCount + 1}`;
}

function sanitizeChatMessage(message) {
  return String(message || '')
    .normalize('NFKC')
    .replace(/[<>&"'`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

function createRoomChatMessage(player, message) {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    playerId: player.id,
    playerName: player.name,
    text: sanitizeChatMessage(message),
    createdAt: Date.now()
  };
}

function appendRoomChatMessage(room, player, message) {
  const nextMessage = createRoomChatMessage(player, message);
  if (!nextMessage.text) {
    return false;
  }

  room.chatMessages.push(nextMessage);
  if (room.chatMessages.length > ROOM_CHAT_LIMIT) {
    room.chatMessages = room.chatMessages.slice(-ROOM_CHAT_LIMIT);
  }
  return true;
}

function createTicTacToeState() {
  return {
    board: Array(9).fill(''),
    currentPlayer: 'anchor',
    finished: false,
    winner: null,
    scores: {
      anchor: 0,
      skull: 0
    },
    round: 1
  };
}

function createConnect4State() {
  return {
    board: Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(null)),
    currentPlayer: 'player',
    finished: false,
    winner: null,
    winningLine: null,
    lastMove: null,
    scores: {
      player: 0,
      ai: 0
    },
    round: 1
  };
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

function createChessState() {
  return {
    board: createInitialChessBoard(),
    turn: 'white',
    winner: null,
    lastMove: null,
    round: 1
  };
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

function createCheckersState() {
  return {
    board: createInitialCheckersBoard(),
    turn: 'red',
    winner: null,
    lastMove: null,
    round: 1
  };
}

function normalizeBombWord(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '');
}

function getRandomBombSyllable(previousSyllable = '') {
  const pool = BOMB_SYLLABLES.filter((syllable) => syllable !== previousSyllable);
  const source = pool.length ? pool : BOMB_SYLLABLES;
  return source[Math.floor(Math.random() * source.length)] || 'ba';
}

function getNextActiveBombPlayerIndex(state, startIndex) {
  const total = state.players.length;
  if (!total) {
    return -1;
  }

  for (let step = 1; step <= total; step += 1) {
    const nextIndex = (startIndex + step) % total;
    if (!state.players[nextIndex]?.eliminated) {
      return nextIndex;
    }
  }

  return -1;
}

function getBombAlivePlayers(state) {
  return state.players.filter((player) => !player.eliminated);
}

function getBombTurnDurationMs(state) {
  const reduction = Math.max(0, Number(state.turnCount || 1) - 1) * BOMB_TURN_STEP_MS;
  return Math.max(BOMB_MIN_TURN_MS, BOMB_TURN_MS - reduction);
}

function startBombTurn(state, nextPlayerIndex, statusMessage) {
  state.currentPlayerIndex = nextPlayerIndex;
  state.currentSyllable = getRandomBombSyllable(state.currentSyllable);
  state.turnDurationMs = getBombTurnDurationMs(state);
  state.turnDeadlineAt = Date.now() + state.turnDurationMs;
  state.statusMessage = statusMessage || `${state.players[nextPlayerIndex]?.name || 'Un joueur'} prend la bombe.`;
}

function createBombState(players = [], options = {}) {
  const statePlayers = players.map((player) => ({
    id: player.id,
    name: player.name,
    lives: BOMB_STARTING_LIVES,
    eliminated: false
  }));
  const state = {
    players: statePlayers,
    currentPlayerIndex: statePlayers.length ? 0 : -1,
    currentSyllable: getRandomBombSyllable(),
    usedWords: [],
    usedWordsMap: {},
    winner: null,
    statusMessage: 'La bombe attend encore le signal de départ.',
    turnCount: 1,
    round: Number(options.round || 1),
    turnDurationMs: BOMB_TURN_MS,
    turnDeadlineAt: 0,
    lastWord: '',
    lastWordBy: null
  };

  if (options.started && statePlayers.length >= 2) {
    startBombTurn(state, 0, `${statePlayers[0].name} ouvre la manche. La bombe est allumee.`);
  }

  return state;
}

function createBattleshipGrid() {
  return Array.from({ length: BATTLESHIP_SIZE }, () => Array.from({ length: BATTLESHIP_SIZE }, () => ({
    hasShip: false,
    hit: false,
    shipId: null
  })));
}

function canPlaceBattleshipShip(grid, row, col, length, horizontal) {
  for (let index = 0; index < length; index += 1) {
    const nextRow = row + (horizontal ? 0 : index);
    const nextCol = col + (horizontal ? index : 0);

    if (!isInsideGameGrid(nextRow, nextCol, BATTLESHIP_SIZE) || grid[nextRow][nextCol].hasShip) {
      return false;
    }
  }

  return true;
}

function placeBattleshipFleet(grid) {
  BATTLESHIP_SHIPS.forEach((length, shipIndex) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 1000) {
      attempts += 1;
      const horizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * BATTLESHIP_SIZE);
      const col = Math.floor(Math.random() * BATTLESHIP_SIZE);

      if (!canPlaceBattleshipShip(grid, row, col, length, horizontal)) {
        continue;
      }

      for (let index = 0; index < length; index += 1) {
        const nextRow = row + (horizontal ? 0 : index);
        const nextCol = col + (horizontal ? index : 0);
        grid[nextRow][nextCol].hasShip = true;
        grid[nextRow][nextCol].shipId = shipIndex;
      }

      placed = true;
    }
  });
}

function countRemainingBattleshipShips(grid) {
  const ships = new Map();

  grid.forEach((row) => {
    row.forEach((cell) => {
      if (!cell.hasShip || cell.shipId === null) {
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

function sanitizeBattleshipOwnGrid(grid) {
  return grid.map((row) => row.map((cell) => ({
    hasShip: Boolean(cell.hasShip),
    hit: Boolean(cell.hit),
    shipId: cell.shipId
  })));
}

function sanitizeBattleshipEnemyGrid(grid) {
  return grid.map((row) => row.map((cell) => ({
    hasShip: Boolean(cell.hit && cell.hasShip),
    hit: Boolean(cell.hit),
    shipId: cell.hit ? cell.shipId : null
  })));
}

function createBattleshipState() {
  const captain1Grid = createBattleshipGrid();
  const captain2Grid = createBattleshipGrid();
  placeBattleshipFleet(captain1Grid);
  placeBattleshipFleet(captain2Grid);

  return {
    captain1Grid,
    captain2Grid,
    currentTurn: 'captain1',
    winner: null,
    lastShot: null,
    round: 1
  };
}

function createPongRoundSnapshot(previousState = null) {
  const serveDirection = Math.random() > 0.5 ? 1 : -1;
  const verticalDirection = (Math.random() * 2) - 1;
  const centerY = (PONG_BOARD_HEIGHT - PONG_PADDLE_HEIGHT) / 2;
  const nextRound = Number(previousState?.round || 0) + 1;

  return {
    boardWidth: PONG_BOARD_WIDTH,
    boardHeight: PONG_BOARD_HEIGHT,
    paddleHeight: PONG_PADDLE_HEIGHT,
    paddleWidth: PONG_PADDLE_WIDTH,
    paddleOffset: PONG_PADDLE_OFFSET,
    ballSize: PONG_BALL_SIZE,
    leftY: centerY,
    rightY: centerY,
    leftInput: 0,
    rightInput: 0,
    ballX: (PONG_BOARD_WIDTH - PONG_BALL_SIZE) / 2,
    ballY: (PONG_BOARD_HEIGHT - PONG_BALL_SIZE) / 2,
    ballVelocityX: PONG_BALL_SPEED_X * serveDirection,
    ballVelocityY: 228 * verticalDirection,
    leftScore: previousState?.leftScore || 0,
    rightScore: previousState?.rightScore || 0,
    running: false,
    countdownEndsAt: 0,
    finished: false,
    winner: null,
    round: nextRound
  };
}

function createPongState() {
  return createPongRoundSnapshot(null);
}

function createAirHockeyRoundSnapshot(previousState = null) {
  const nextRound = Number(previousState?.round || 0) + 1;

  return {
    width: AIR_HOCKEY_WIDTH,
    height: AIR_HOCKEY_HEIGHT,
    leftScore: previousState?.leftScore || 0,
    rightScore: previousState?.rightScore || 0,
    running: false,
    countdownEndsAt: 0,
    finished: false,
    winner: null,
    round: nextRound,
    servingSide: Math.random() > 0.5 ? 'left' : 'right',
    leftInput: { x: 0, y: 0 },
    rightInput: { x: 0, y: 0 },
    left: { x: AIR_HOCKEY_WIDTH * 0.16, y: AIR_HOCKEY_HEIGHT * 0.5, radius: AIR_HOCKEY_PADDLE_RADIUS, vx: 0, vy: 0 },
    right: { x: AIR_HOCKEY_WIDTH * 0.84, y: AIR_HOCKEY_HEIGHT * 0.5, radius: AIR_HOCKEY_PADDLE_RADIUS, vx: 0, vy: 0 },
    puck: {
      x: (Math.random() > 0.5 ? AIR_HOCKEY_WIDTH * 0.25 : AIR_HOCKEY_WIDTH * 0.75),
      y: AIR_HOCKEY_HEIGHT * 0.5,
      vx: 0,
      vy: 0,
      radius: AIR_HOCKEY_PUCK_RADIUS
    }
  };
}

function createAirHockeyState() {
  return createAirHockeyRoundSnapshot(null);
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
  const colors = ['red', 'yellow', 'green', 'blue'];

  colors.forEach((color) => {
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

function ensureUnoDrawPile(state) {
  if (state.drawPile.length) {
    return;
  }

  if (state.discardPile.length > 1) {
    const topCard = state.discardPile.pop();
    const reshuffled = shuffleUnoDeck(state.discardPile.splice(0));
    state.drawPile = reshuffled;
    state.discardPile = [topCard];
    return;
  }

  state.drawPile = createUnoDeck();
}

function drawUnoCards(state, playerIndex, amount) {
  const drawnCards = [];

  for (let index = 0; index < amount; index += 1) {
    ensureUnoDrawPile(state);
    const card = state.drawPile.pop();
    if (!card) {
      break;
    }
    state.players[playerIndex].hand.push(card);
    drawnCards.push(card);
  }

  return drawnCards;
}

function getUnoTopCard(state) {
  return state.discardPile[state.discardPile.length - 1] || null;
}

function isUnoCardPlayable(card, state) {
  if (!card || state.winner || state.pendingColorChoice) {
    return false;
  }

  const topCard = getUnoTopCard(state);
  if (!topCard) {
    return true;
  }

  if (card.color === 'wild') {
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

function getNextUnoPlayerIndex(state, step = 1) {
  const total = state.players.length;
  if (!total) {
    return 0;
  }

  const offset = (state.currentPlayerIndex + (state.direction * step)) % total;
  return offset < 0 ? offset + total : offset;
}

function applyUnoCardEffects(state, card, actorName) {
  if (card.type === 'reverse') {
    state.direction *= -1;
    state.currentPlayerIndex = getNextUnoPlayerIndex(state, state.players.length === 2 ? 2 : 1);
    state.lastAction = `${actorName} inverse le sens.`;
    return;
  }

  if (card.type === 'skip') {
    state.currentPlayerIndex = getNextUnoPlayerIndex(state, 2);
    state.lastAction = `${actorName} bloque le tour.`;
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

function createUnoState(players = []) {
  const deck = createUnoDeck();
  const statePlayers = players.map((player) => ({
    id: player.id,
    name: player.name,
    hand: []
  }));

  for (let turn = 0; turn < 7; turn += 1) {
    statePlayers.forEach((player) => {
      const card = deck.pop();
      if (card) {
        player.hand.push(card);
      }
    });
  }

  let topCard = deck.pop() || createUnoCard('red', '0');
  while (topCard.type === 'wildDraw4') {
    deck.unshift(topCard);
    topCard = deck.pop() || createUnoCard('red', '0');
  }

  return {
    players: statePlayers,
    drawPile: deck,
    discardPile: [topCard],
    currentPlayerIndex: 0,
    direction: 1,
    currentColor: topCard.color === 'wild' ? 'red' : topCard.color,
    winner: null,
    pendingColorChoice: null,
    drawPenalty: 0,
    lastAction: 'La traversee commence.',
    turnCount: 1,
    round: 1
  };
}

function getUnoPlayerIndex(room, socketId) {
  return room.players.findIndex((player) => player.id === socketId);
}

function buildUnoStateForPlayer(room, socketId) {
  const playerIndex = getUnoPlayerIndex(room, socketId);

  return {
    players: room.gameState.players.map((player, index) => ({
      id: player.id,
      name: player.name,
      isYou: player.id === socketId,
      hand: player.id === socketId ? player.hand.map((card) => ({ ...card })) : [],
      handCount: player.hand.length,
      seat: index
    })),
    drawPile: Array.from({ length: room.gameState.drawPile.length }, () => ({ hidden: true })),
    discardPile: room.gameState.discardPile.map((card) => ({ ...card })),
    currentPlayerIndex: room.gameState.currentPlayerIndex,
    direction: room.gameState.direction,
    currentColor: room.gameState.currentColor,
    winner: room.gameState.winner,
    pendingColorChoice: room.gameState.pendingColorChoice
      ? { ...room.gameState.pendingColorChoice }
      : null,
    drawPenalty: Number(room.gameState.drawPenalty || 0),
    lastAction: room.gameState.lastAction,
    turnCount: room.gameState.turnCount,
    round: room.gameState.round,
    youIndex: playerIndex
  };
}

function createGameState(gameId) {
  if (gameId === 'uno') {
    return createUnoState([]);
  }

  if (gameId === 'bomb') {
    return createBombState([]);
  }

  if (gameId === 'pong') {
    return createPongState();
  }

  if (gameId === 'airHockey') {
    return createAirHockeyState();
  }

  if (gameId === 'battleship') {
    return createBattleshipState();
  }

  if (gameId === 'ticTacToe') {
    return createTicTacToeState();
  }

  if (gameId === 'connect4') {
    return createConnect4State();
  }

  if (gameId === 'chess') {
    return createChessState();
  }

  if (gameId === 'checkers') {
    return createCheckersState();
  }

  return null;
}

function resetTicTacToeRound(room, keepScores = true) {
  const previousScores = keepScores && room.gameState?.scores
    ? room.gameState.scores
    : { anchor: 0, skull: 0 };

  room.gameState = {
    board: Array(9).fill(''),
    currentPlayer: 'anchor',
    finished: false,
    winner: null,
    scores: previousScores,
    round: Number(room.gameState?.round || 0) + 1
  };
}

function resetBattleshipRound(room) {
  room.gameState = {
    ...createBattleshipState(),
    round: Number(room.gameState?.round || 0) + 1
  };
}

function resetPongRound(room, keepScores = true) {
  const previousState = keepScores ? room.gameState : null;
  room.gameState = createPongRoundSnapshot(previousState);
}

function resetAirHockeyRound(room, keepScores = true) {
  const previousState = keepScores ? room.gameState : null;
  room.gameState = createAirHockeyRoundSnapshot(previousState);
}

function resetConnect4Round(room, keepScores = true) {
  const previousScores = keepScores && room.gameState?.scores
    ? room.gameState.scores
    : { player: 0, ai: 0 };

  room.gameState = {
    board: Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(null)),
    currentPlayer: 'player',
    finished: false,
    winner: null,
    winningLine: null,
    lastMove: null,
    scores: previousScores,
    round: Number(room.gameState?.round || 0) + 1
  };
}

function resetChessRound(room) {
  room.gameState = {
    board: createInitialChessBoard(),
    turn: 'white',
    winner: null,
    lastMove: null,
    round: Number(room.gameState?.round || 0) + 1
  };
}

function resetCheckersRound(room) {
  room.gameState = {
    board: createInitialCheckersBoard(),
    turn: 'red',
    winner: null,
    lastMove: null,
    round: Number(room.gameState?.round || 0) + 1
  };
}

function resetUnoRound(room) {
  room.gameState = {
    ...createUnoState(room.players),
    round: Number(room.gameState?.round || 0) + 1
  };
}

function resetBombRound(room, started = false) {
  room.gameState = createBombState(room.players, {
    started,
    round: Number(room.gameState?.round || 0) + 1
  });
}

function resetUnoReadyState(room) {
  room.unoReadyPlayerIds = [];
  room.unoStarted = false;
}

function resetChessReadyState(room) {
  room.chessReadyPlayerIds = [];
  room.chessStarted = false;
}

function resetRoomReadyState(room) {
  room.readyPlayerIds = [];
}

function syncRoomReadyState(room) {
  const activePlayerIds = new Set(room.players.map((player) => player.id));
  room.readyPlayerIds = (room.readyPlayerIds || []).filter((playerId) => activePlayerIds.has(playerId));

  if (room.gameId === 'uno') {
    room.unoReadyPlayerIds = [...room.readyPlayerIds];
  }

  if (room.gameId === 'chess') {
    room.chessReadyPlayerIds = [...room.readyPlayerIds];
  }
}

function emitRoomGameStart(room) {
  io.to(room.code).emit('room:game:start', {
    code: room.code,
    gameId: room.gameId
  });
}

function launchRoomGame(room) {
  room.gameLaunched = true;

  if (room.gameId === 'uno') {
    room.unoStarted = true;
    room.unoReadyPlayerIds = [...room.readyPlayerIds];
    resetUnoRound(room);
  }

  if (room.gameId === 'chess') {
    room.chessStarted = true;
    room.chessReadyPlayerIds = [...room.readyPlayerIds];
    resetChessRound(room);
  }

  if (room.gameId === 'bomb') {
    resetBombRound(room, true);
  }

  emitRoomGameStart(room);
}

function toggleRoomReady(room, socketId) {
  if (!room.players.some((player) => player.id === socketId)) {
    return false;
  }

  if (room.players.length < 2 || room.gameLaunched) {
    syncRoomReadyState(room);
    return false;
  }

  const readyPlayers = new Set(room.readyPlayerIds || []);
  if (readyPlayers.has(socketId)) {
    readyPlayers.delete(socketId);
  } else {
    readyPlayers.add(socketId);
  }

  room.readyPlayerIds = room.players
    .map((player) => player.id)
    .filter((playerId) => readyPlayers.has(playerId));
  syncRoomReadyState(room);

  if (room.readyPlayerIds.length >= 2 && room.readyPlayerIds.length === room.players.length) {
    launchRoomGame(room);
    return true;
  }

  return false;
}

function resetRoomGame(room, keepScores = false) {
  room.gameLaunched = false;
  resetRoomReadyState(room);

  if (room.gameId === 'uno') {
    resetUnoReadyState(room);
    resetUnoRound(room);
    return;
  }

  if (room.gameId === 'chess') {
    resetChessReadyState(room);
    resetChessRound(room);
    return;
  }

  if (room.gameId === 'bomb') {
    resetBombRound(room, false);
    return;
  }

  if (room.gameId === 'pong') {
    resetPongRound(room, keepScores);
    return;
  }

  if (room.gameId === 'airHockey') {
    resetAirHockeyRound(room, keepScores);
    return;
  }

  if (room.gameId === 'battleship') {
    resetBattleshipRound(room);
    return;
  }

  if (room.gameId === 'ticTacToe') {
    resetTicTacToeRound(room, keepScores);
    return;
  }

  if (room.gameId === 'connect4') {
    resetConnect4Round(room, keepScores);
    return;
  }

  if (room.gameId === 'checkers') {
    resetCheckersRound(room);
    return;
  }

  room.gameState = null;
}

function getRoomMaxPlayers(room) {
  return MAX_PLAYERS_BY_GAME[room.gameId] || 4;
}

function getTicTacToePlayerSymbol(room, socketId) {
  const playerIndex = room.players.findIndex((player) => player.id === socketId);

  if (playerIndex === 0) {
    return 'anchor';
  }

  if (playerIndex === 1) {
    return 'skull';
  }

  return null;
}

function getPongPlayerRole(room, socketId) {
  const playerIndex = room.players.findIndex((player) => player.id === socketId);

  if (playerIndex === 0) {
    return 'left';
  }

  if (playerIndex === 1) {
    return 'right';
  }

  return null;
}

function getAirHockeyPlayerRole(room, socketId) {
  const playerIndex = room.players.findIndex((player) => player.id === socketId);

  if (playerIndex === 0) {
    return 'left';
  }

  if (playerIndex === 1) {
    return 'right';
  }

  return null;
}

function getBattleshipPlayerRole(room, socketId) {
  const playerIndex = room.players.findIndex((player) => player.id === socketId);

  if (playerIndex === 0) {
    return 'captain1';
  }

  if (playerIndex === 1) {
    return 'captain2';
  }

  return null;
}

function getConnect4PlayerSymbol(room, socketId) {
  const playerIndex = room.players.findIndex((player) => player.id === socketId);

  if (playerIndex === 0) {
    return 'player';
  }

  if (playerIndex === 1) {
    return 'ai';
  }

  return null;
}

function getChessPlayerColor(room, socketId) {
  const playerIndex = room.players.findIndex((player) => player.id === socketId);

  if (playerIndex === 0) {
    return 'white';
  }

  if (playerIndex === 1) {
    return 'black';
  }

  return null;
}

function getCheckersPlayerColor(room, socketId) {
  const playerIndex = room.players.findIndex((player) => player.id === socketId);

  if (playerIndex === 0) {
    return 'red';
  }

  if (playerIndex === 1) {
    return 'black';
  }

  return null;
}

function isInsideGameGrid(row, col, size = 8) {
  return row >= 0 && row < size && col >= 0 && col < size;
}

function getConnect4DropRow(board, col) {
  for (let row = CONNECT4_ROWS - 1; row >= 0; row -= 1) {
    if (!board[row][col]) {
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

function getPongBounceVelocityY(impact) {
  const clampedImpact = Math.max(-1, Math.min(1, impact));
  const nextVelocityY = clampedImpact * 305;

  if (Math.abs(nextVelocityY) < 115) {
    return (clampedImpact >= 0 ? 1 : -1) * 115;
  }

  return nextVelocityY;
}

function clampPongPaddleY(y) {
  return Math.max(0, Math.min(y, PONG_BOARD_HEIGHT - PONG_PADDLE_HEIGHT));
}

function startPongRound(room) {
  if (!room?.gameState || room.players.length < 2) {
    return;
  }

  room.gameState.running = true;
  room.gameState.finished = false;
  room.gameState.winner = null;
  room.gameState.countdownEndsAt = Date.now() + PONG_COUNTDOWN_MS;
}

function handlePongScore(room, scoringRole) {
  if (!room?.gameState) {
    return;
  }

  if (scoringRole === 'left') {
    room.gameState.leftScore += 1;
  } else {
    room.gameState.rightScore += 1;
  }

  if (room.gameState.leftScore >= PONG_TARGET_SCORE || room.gameState.rightScore >= PONG_TARGET_SCORE) {
    room.gameState.running = false;
    room.gameState.countdownEndsAt = 0;
    room.gameState.finished = true;
    room.gameState.winner = room.gameState.leftScore >= PONG_TARGET_SCORE ? 'left' : 'right';
    return;
  }

  resetPongRound(room, true);
  startPongRound(room);
}

function getAirHockeyGoalBounds() {
  const goalHeight = AIR_HOCKEY_HEIGHT * 0.48;
  const top = (AIR_HOCKEY_HEIGHT - goalHeight) / 2;

  return {
    top,
    bottom: top + goalHeight
  };
}

function clampAirHockeyPuckSpeed(state) {
  const puck = state?.puck;

  if (!puck) {
    return;
  }

  const speed = Math.hypot(puck.vx, puck.vy);
  const maxSpeed = 520;

  if (!speed || speed <= maxSpeed) {
    return;
  }

  const scale = maxSpeed / speed;
  puck.vx *= scale;
  puck.vy *= scale;
}

function buildBattleshipStateForPlayer(room, socketId) {
  const role = getBattleshipPlayerRole(room, socketId);

  if (!room?.gameState || !role) {
    return null;
  }

  const yourGrid = role === 'captain1' ? room.gameState.captain1Grid : room.gameState.captain2Grid;
  const enemyGrid = role === 'captain1' ? room.gameState.captain2Grid : room.gameState.captain1Grid;

  return {
    yourBoard: sanitizeBattleshipOwnGrid(yourGrid),
    enemyBoard: sanitizeBattleshipEnemyGrid(enemyGrid),
    yourRemainingShips: countRemainingBattleshipShips(yourGrid),
    enemyRemainingShips: countRemainingBattleshipShips(enemyGrid),
    currentTurn: room.gameState.currentTurn,
    winner: room.gameState.winner,
    lastShot: room.gameState.lastShot
      ? { ...room.gameState.lastShot }
      : null,
    round: room.gameState.round
  };
}

function clampAirHockeyPaddle(paddle, side) {
  paddle.y = Math.max(paddle.radius, Math.min(AIR_HOCKEY_HEIGHT - paddle.radius, paddle.y));

  if (side === 'left') {
    paddle.x = Math.max(paddle.radius, Math.min((AIR_HOCKEY_WIDTH * 0.5) - 30 - paddle.radius, paddle.x));
  } else {
    paddle.x = Math.max((AIR_HOCKEY_WIDTH * 0.5) + 30 + paddle.radius, Math.min(AIR_HOCKEY_WIDTH - paddle.radius, paddle.x));
  }
}

function startAirHockeyRound(room) {
  if (!room?.gameState || room.players.length < 2) {
    return;
  }

  room.gameState.running = true;
  room.gameState.finished = false;
  room.gameState.winner = null;
  room.gameState.countdownEndsAt = Date.now() + AIR_HOCKEY_COUNTDOWN_MS;
  room.gameState.puck.vx = 0;
  room.gameState.puck.vy = 0;
}

function handleAirHockeyScore(room, scoringSide) {
  if (!room?.gameState) {
    return;
  }

  if (scoringSide === 'left') {
    room.gameState.leftScore += 1;
  } else {
    room.gameState.rightScore += 1;
  }

  if (room.gameState.leftScore >= AIR_HOCKEY_GOAL_SCORE || room.gameState.rightScore >= AIR_HOCKEY_GOAL_SCORE) {
    room.gameState.running = false;
    room.gameState.countdownEndsAt = 0;
    room.gameState.finished = true;
    room.gameState.winner = room.gameState.leftScore >= AIR_HOCKEY_GOAL_SCORE ? 'left' : 'right';
    room.gameState.leftInput = { x: 0, y: 0 };
    room.gameState.rightInput = { x: 0, y: 0 };
    room.gameState.left.vx = 0;
    room.gameState.left.vy = 0;
    room.gameState.right.vx = 0;
    room.gameState.right.vy = 0;
    room.gameState.puck.vx = 0;
    room.gameState.puck.vy = 0;
    return;
  }

  const nextServingSide = scoringSide === 'left' ? 'right' : 'left';
  resetAirHockeyRound(room, true);
  room.gameState.servingSide = nextServingSide;
  room.gameState.puck.x = nextServingSide === 'left' ? AIR_HOCKEY_WIDTH * 0.25 : AIR_HOCKEY_WIDTH * 0.75;
  room.gameState.puck.y = AIR_HOCKEY_HEIGHT * 0.5;
  room.gameState.puck.vx = 0;
  room.gameState.puck.vy = 0;
  startAirHockeyRound(room);
}

function updateAirHockeyRoom(room, deltaSeconds) {
  if (!room || room.gameId !== 'airHockey' || !room.gameState) {
    return false;
  }

  if (room.players.length < 2) {
    if (room.gameState.running || room.gameState.leftInput.x || room.gameState.leftInput.y || room.gameState.rightInput.x || room.gameState.rightInput.y) {
      room.gameState.running = false;
      room.gameState.countdownEndsAt = 0;
      room.gameState.leftInput = { x: 0, y: 0 };
      room.gameState.rightInput = { x: 0, y: 0 };
      room.gameState.left.vx = 0;
      room.gameState.left.vy = 0;
      room.gameState.right.vx = 0;
      room.gameState.right.vy = 0;
      return true;
    }

    return false;
  }

  if (!room.gameState.running || room.gameState.finished) {
    return false;
  }

  let changed = false;
  const countdownActive = room.gameState.countdownEndsAt && Date.now() < room.gameState.countdownEndsAt;
  const movePaddle = (paddle, input, side) => {
    if (countdownActive) {
      paddle.vx = 0;
      paddle.vy = 0;
      return false;
    }

    const magnitude = Math.hypot(input.x, input.y);
    const moveX = magnitude > 1 ? input.x / magnitude : input.x;
    const moveY = magnitude > 1 ? input.y / magnitude : input.y;
    const previousX = paddle.x;
    const previousY = paddle.y;

    paddle.x += moveX * AIR_HOCKEY_SPEED * deltaSeconds;
    paddle.y += moveY * AIR_HOCKEY_SPEED * deltaSeconds;
    clampAirHockeyPaddle(paddle, side);
    paddle.vx = deltaSeconds ? (paddle.x - previousX) / deltaSeconds : 0;
    paddle.vy = deltaSeconds ? (paddle.y - previousY) / deltaSeconds : 0;

    return paddle.x !== previousX || paddle.y !== previousY;
  };

  changed = movePaddle(room.gameState.left, room.gameState.leftInput, 'left') || changed;
  changed = movePaddle(room.gameState.right, room.gameState.rightInput, 'right') || changed;

  if (countdownActive) {
    return changed;
  }

  if (room.gameState.countdownEndsAt) {
    room.gameState.countdownEndsAt = 0;
    changed = true;
  }

  const puck = room.gameState.puck;
  puck.x += puck.vx * deltaSeconds;
  puck.y += puck.vy * deltaSeconds;
  puck.vx *= 0.996;
  puck.vy *= 0.996;

  if (puck.y <= puck.radius || puck.y >= AIR_HOCKEY_HEIGHT - puck.radius) {
    puck.vy *= -1;
    puck.y = Math.max(puck.radius, Math.min(AIR_HOCKEY_HEIGHT - puck.radius, puck.y));
  }

  const goalBounds = getAirHockeyGoalBounds();
  const puckInGoalOpening = puck.y >= goalBounds.top + puck.radius && puck.y <= goalBounds.bottom - puck.radius;

  if (puck.x <= puck.radius) {
    if (puckInGoalOpening) {
      handleAirHockeyScore(room, 'right');
      return true;
    }

    puck.x = puck.radius;
    puck.vx = Math.abs(puck.vx);
  }

  if (puck.x >= AIR_HOCKEY_WIDTH - puck.radius) {
    if (puckInGoalOpening) {
      handleAirHockeyScore(room, 'left');
      return true;
    }

    puck.x = AIR_HOCKEY_WIDTH - puck.radius;
    puck.vx = -Math.abs(puck.vx);
  }

  [room.gameState.left, room.gameState.right].forEach((paddle, index) => {
    const dx = puck.x - paddle.x;
    const dy = puck.y - paddle.y;
    const rawDistance = Math.hypot(dx, dy);
    const distance = rawDistance || 0.001;
    const minDistance = puck.radius + paddle.radius;

    if (distance >= minDistance) {
      return;
    }

    let nx = dx / distance;
    let ny = dy / distance;
    const paddleMotion = Math.hypot(paddle.vx, paddle.vy);

    if (rawDistance < 0.5) {
      if (paddleMotion > 1) {
        nx = paddle.vx / paddleMotion;
        ny = paddle.vy / paddleMotion;
      } else {
        nx = index === 0 ? 1 : -1;
        ny = 0;
      }
    }

    const overlap = minDistance - distance;
    puck.x += nx * (overlap + 0.5);
    puck.y += ny * (overlap + 0.5);

    const relativeVx = puck.vx - paddle.vx;
    const relativeVy = puck.vy - paddle.vy;
    const approachSpeed = (relativeVx * nx) + (relativeVy * ny);
    const carry = Math.min(220, paddleMotion * 0.55);

    if (approachSpeed < 0) {
      const bounce = -(1.35 * approachSpeed);
      puck.vx += (bounce + carry) * nx + (paddle.vx * 0.32);
      puck.vy += (bounce + carry) * ny + (paddle.vy * 0.32);
    } else {
      puck.vx += nx * (28 + paddleMotion * 0.08);
      puck.vy += ny * (28 + paddleMotion * 0.08);
    }

    clampAirHockeyPuckSpeed(room.gameState);
  });

  return changed || true;
}

function updatePongRoom(room, deltaSeconds) {
  if (!room || room.gameId !== 'pong' || !room.gameState) {
    return false;
  }

  if (room.players.length < 2) {
    if (room.gameState.running || room.gameState.leftInput || room.gameState.rightInput) {
      room.gameState.running = false;
      room.gameState.countdownEndsAt = 0;
      room.gameState.leftInput = 0;
      room.gameState.rightInput = 0;
      return true;
    }
    return false;
  }

  if (!room.gameState.running || room.gameState.finished) {
    return false;
  }

  let changed = false;
  if (room.gameState.countdownEndsAt && Date.now() < room.gameState.countdownEndsAt) {
    return false;
  }

  if (room.gameState.countdownEndsAt) {
    room.gameState.countdownEndsAt = 0;
    changed = true;
  }

  const previousLeftY = room.gameState.leftY;
  const previousRightY = room.gameState.rightY;
  const previousBallX = room.gameState.ballX;
  const previousBallY = room.gameState.ballY;
  const previousVelocityX = room.gameState.ballVelocityX;
  const previousVelocityY = room.gameState.ballVelocityY;

  room.gameState.leftY = clampPongPaddleY(room.gameState.leftY + (room.gameState.leftInput * PONG_PLAYER_SPEED * deltaSeconds));
  room.gameState.rightY = clampPongPaddleY(room.gameState.rightY + (room.gameState.rightInput * PONG_PLAYER_SPEED * deltaSeconds));

  if (room.gameState.leftY !== previousLeftY || room.gameState.rightY !== previousRightY) {
    changed = true;
  }

  room.gameState.ballX += room.gameState.ballVelocityX * deltaSeconds;
  room.gameState.ballY += room.gameState.ballVelocityY * deltaSeconds;

  if (room.gameState.ballY < 0) {
    room.gameState.ballY = Math.abs(room.gameState.ballY);
    room.gameState.ballVelocityY = Math.abs(room.gameState.ballVelocityY);
  }

  const maxBallY = PONG_BOARD_HEIGHT - PONG_BALL_SIZE;
  if (room.gameState.ballY > maxBallY) {
    room.gameState.ballY = maxBallY - (room.gameState.ballY - maxBallY);
    room.gameState.ballVelocityY = -Math.abs(room.gameState.ballVelocityY);
  }

  const leftPaddleX = PONG_PADDLE_OFFSET;
  const rightPaddleX = PONG_BOARD_WIDTH - PONG_PADDLE_OFFSET - PONG_PADDLE_WIDTH;
  const pongCollisionMargin = PONG_COLLISION_MARGIN;

  const hitsLeft = room.gameState.ballX <= leftPaddleX + PONG_PADDLE_WIDTH + pongCollisionMargin
    && room.gameState.ballX + PONG_BALL_SIZE >= leftPaddleX - pongCollisionMargin
    && room.gameState.ballY + PONG_BALL_SIZE >= room.gameState.leftY - pongCollisionMargin
    && room.gameState.ballY <= room.gameState.leftY + PONG_PADDLE_HEIGHT + pongCollisionMargin
    && room.gameState.ballVelocityX < 0;

  if (hitsLeft) {
    const impact = ((room.gameState.ballY + (PONG_BALL_SIZE / 2)) - (room.gameState.leftY + (PONG_PADDLE_HEIGHT / 2))) / (PONG_PADDLE_HEIGHT / 2);
    room.gameState.ballX = leftPaddleX + PONG_PADDLE_WIDTH;
    room.gameState.ballVelocityX = Math.abs(room.gameState.ballVelocityX) + 20;
    room.gameState.ballVelocityY = getPongBounceVelocityY(impact);
  }

  const hitsRight = room.gameState.ballX + PONG_BALL_SIZE >= rightPaddleX - pongCollisionMargin
    && room.gameState.ballX <= rightPaddleX + PONG_PADDLE_WIDTH + pongCollisionMargin
    && room.gameState.ballY + PONG_BALL_SIZE >= room.gameState.rightY - pongCollisionMargin
    && room.gameState.ballY <= room.gameState.rightY + PONG_PADDLE_HEIGHT + pongCollisionMargin
    && room.gameState.ballVelocityX > 0;

  if (hitsRight) {
    const impact = ((room.gameState.ballY + (PONG_BALL_SIZE / 2)) - (room.gameState.rightY + (PONG_PADDLE_HEIGHT / 2))) / (PONG_PADDLE_HEIGHT / 2);
    room.gameState.ballX = rightPaddleX - PONG_BALL_SIZE;
    room.gameState.ballVelocityX = -(Math.abs(room.gameState.ballVelocityX) + 20);
    room.gameState.ballVelocityY = getPongBounceVelocityY(impact);
  }

  if (room.gameState.ballX + PONG_BALL_SIZE < 0) {
    handlePongScore(room, 'right');
    return true;
  }

  if (room.gameState.ballX > PONG_BOARD_WIDTH) {
    handlePongScore(room, 'left');
    return true;
  }

  return changed
    || room.gameState.ballX !== previousBallX
    || room.gameState.ballY !== previousBallY
    || room.gameState.ballVelocityX !== previousVelocityX
    || room.gameState.ballVelocityY !== previousVelocityY;
}

function updateBombRoom(room) {
  const state = room?.gameState;
  if (!room || room.gameId !== 'bomb' || !state || !room.gameLaunched || state.winner || !Number(state.turnDeadlineAt || 0)) {
    return false;
  }

  if (Date.now() < state.turnDeadlineAt) {
    return false;
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  if (!currentPlayer || currentPlayer.eliminated) {
    const nextIndex = getNextActiveBombPlayerIndex(state, Math.max(0, state.currentPlayerIndex));
    if (nextIndex === -1) {
      return false;
    }
    startBombTurn(state, nextIndex, `${state.players[nextIndex].name} reprend la bombe.`);
    return true;
  }

  currentPlayer.lives = Math.max(0, Number(currentPlayer.lives || 0) - 1);
  if (currentPlayer.lives <= 0) {
    currentPlayer.eliminated = true;
  }

  const alivePlayers = getBombAlivePlayers(state);
  if (alivePlayers.length <= 1) {
    state.winner = alivePlayers[0]?.id || null;
    state.turnDeadlineAt = 0;
    state.statusMessage = currentPlayer.eliminated
      ? `${currentPlayer.name} explose. ${alivePlayers[0]?.name || 'Plus personne'} gagne la manche.`
      : `${currentPlayer.name} manque de temps. ${alivePlayers[0]?.name || 'Plus personne'} gagne la manche.`;
    return true;
  }

  const nextPlayerIndex = getNextActiveBombPlayerIndex(state, state.currentPlayerIndex);
  state.turnCount += 1;
  startBombTurn(
    state,
    nextPlayerIndex,
    currentPlayer.eliminated
      ? `${currentPlayer.name} explose et quitte la manche. ${state.players[nextPlayerIndex].name} enchaine.`
      : `${currentPlayer.name} explose. ${state.players[nextPlayerIndex].name} attrape la bombe.`
  );
  return true;
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

function cloneChessBoard(board) {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function isChessKingInCheck(state, color) {
  const opponent = color === 'white' ? 'black' : 'white';
  let kingRow = -1;
  let kingCol = -1;

  for (let row = 0; row < CHESS_SIZE; row += 1) {
    for (let col = 0; col < CHESS_SIZE; col += 1) {
      const piece = state.board[row][col];
      if (piece?.type === 'king' && piece.color === color) {
        kingRow = row;
        kingCol = col;
      }
    }
  }

  if (kingRow === -1) {
    return false;
  }

  for (let row = 0; row < CHESS_SIZE; row += 1) {
    for (let col = 0; col < CHESS_SIZE; col += 1) {
      const attacker = state.board[row][col];
      if (!attacker || attacker.color !== opponent) {
        continue;
      }

      if (getChessAttackMoves(state, row, col).some((move) => move.row === kingRow && move.col === kingCol)) {
        return true;
      }
    }
  }

  return false;
}

function simulateChessMove(state, fromRow, fromCol, toRow, toCol) {
  const board = cloneChessBoard(state.board);
  const piece = board[fromRow][fromCol];

  if (piece) {
    board[toRow][toCol] = { ...piece, hasMoved: true };
  } else {
    board[toRow][toCol] = null;
  }
  board[fromRow][fromCol] = null;

  if (piece?.type === 'king' && Math.abs(toCol - fromCol) === 2) {
    const rookFromCol = toCol > fromCol ? CHESS_SIZE - 1 : 0;
    const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
    const rook = board[toRow][rookFromCol];
    if (rook) {
      board[toRow][rookToCol] = { ...rook, hasMoved: true };
      board[toRow][rookFromCol] = null;
    }
  }

  return { ...state, board };
}

function getChessMoves(state, row, col) {
  const piece = state?.board[row][col];

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
  const getOpponentColor = (color) => (color === 'white' ? 'black' : 'white');
  const isSquareUnderAttack = (targetRow, targetCol, attackerColor) => {
    for (let attackRow = 0; attackRow < CHESS_SIZE; attackRow += 1) {
      for (let attackCol = 0; attackCol < CHESS_SIZE; attackCol += 1) {
        const attacker = state?.board?.[attackRow]?.[attackCol];
        if (!attacker || attacker.color !== attackerColor) {
          continue;
        }

        if (getChessAttackMoves(state, attackRow, attackCol).some((move) => move.row === targetRow && move.col === targetCol)) {
          return true;
        }
      }
    }

    return false;
  };
  const isKingInCheck = (color) => {
    for (let kingRow = 0; kingRow < CHESS_SIZE; kingRow += 1) {
      for (let kingCol = 0; kingCol < CHESS_SIZE; kingCol += 1) {
        const king = state?.board?.[kingRow]?.[kingCol];
        if (king?.type === 'king' && king.color === color) {
          return isSquareUnderAttack(kingRow, kingCol, getOpponentColor(color));
        }
      }
    }

    return false;
  };
  const canCastle = (side) => {
    if (piece.type !== 'king' || piece.hasMoved) {
      return null;
    }

    const rookCol = side === 'king' ? CHESS_SIZE - 1 : 0;
    const rook = state.board[row]?.[rookCol];
    if (!rook || rook.type !== 'rook' || rook.color !== piece.color || rook.hasMoved) {
      return null;
    }

    const direction = side === 'king' ? 1 : -1;
    const targetCol = col + (direction * 2);

    for (let nextCol = col + direction; nextCol !== rookCol; nextCol += direction) {
      if (state.board[row][nextCol]) {
        return null;
      }
    }

    if (isKingInCheck(piece.color)) {
      return null;
    }

    for (let step = 1; step <= 2; step += 1) {
      const passingCol = col + (direction * step);
      if (isSquareUnderAttack(row, passingCol, getOpponentColor(piece.color))) {
        return null;
      }
    }

    return { row, col: targetCol, castle: side };
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
    const kingSideCastle = canCastle('king');
    const queenSideCastle = canCastle('queen');
    if (kingSideCastle) {
      moves.push(kingSideCastle);
    }
    if (queenSideCastle) {
      moves.push(queenSideCastle);
    }
  }

  return moves.filter((move) => {
    const simulated = simulateChessMove(state, row, col, move.row, move.col);
    return !isChessKingInCheck(simulated, piece.color);
  });
}

function getChessAllMoves(state, color) {
  const moves = [];

  for (let row = 0; row < CHESS_SIZE; row += 1) {
    for (let col = 0; col < CHESS_SIZE; col += 1) {
      const piece = state.board[row][col];
      if (!piece || piece.color !== color) {
        continue;
      }

      const legalMoves = getChessMoves(state, row, col);
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

function getCheckersPseudoMoves(state, row, col) {
  const piece = state?.board[row][col];

  if (!piece || piece.color !== state.turn || state.winner) {
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

    const target = state.board[nextRow][nextCol];
    if (!target) {
      moves.push({ row: nextRow, col: nextCol, capture: null });
      return;
    }

    if (target.color === piece.color) {
      return;
    }

    const jumpRow = nextRow + rowStep;
    const jumpCol = nextCol + colStep;
    if (isInsideGameGrid(jumpRow, jumpCol, CHECKERS_SIZE) && !state.board[jumpRow][jumpCol]) {
      moves.push({ row: jumpRow, col: jumpCol, capture: { row: nextRow, col: nextCol } });
    }
  });

  return moves;
}

function hasAnyCheckersCapture(state, color) {
  for (let row = 0; row < CHECKERS_SIZE; row += 1) {
    for (let col = 0; col < CHECKERS_SIZE; col += 1) {
      const piece = state.board[row][col];
      if (!piece || piece.color !== color) {
        continue;
      }
      if (getCheckersPseudoMoves(state, row, col).some((move) => move.capture)) {
        return true;
      }
    }
  }
  return false;
}

function getCheckersMoves(state, row, col) {
  const pseudoMoves = getCheckersPseudoMoves(state, row, col);
  if (!pseudoMoves.length) {
    return pseudoMoves;
  }

  const piece = state.board[row][col];
  if (hasAnyCheckersCapture(state, piece.color)) {
    return pseudoMoves.filter((move) => move.capture);
  }
  return pseudoMoves;
}

function getCheckersAllMoves(state, color) {
  const moves = [];

  for (let row = 0; row < CHECKERS_SIZE; row += 1) {
    for (let col = 0; col < CHECKERS_SIZE; col += 1) {
      const piece = state.board[row][col];
      if (!piece || piece.color !== color) {
        continue;
      }

      getCheckersMoves(state, row, col).forEach((move) => {
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

function buildRoomPayload(room, socketId = null) {
  return {
    code: room.code,
    gameId: room.gameId,
    hostId: room.hostId,
    maxPlayers: getRoomMaxPlayers(room),
    playerCount: room.players.length,
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      isHost: player.id === room.hostId,
      isYou: player.id === socketId,
      roomReady: Boolean(room.readyPlayerIds?.includes(player.id)),
      unoReady: room.gameId === 'uno' ? Boolean(room.readyPlayerIds?.includes(player.id)) : false,
      chessReady: room.gameId === 'chess' ? Boolean(room.readyPlayerIds?.includes(player.id)) : false,
      symbol: room.gameId === 'pong'
        ? getPongPlayerRole(room, player.id)
        : (room.gameId === 'airHockey'
          ? getAirHockeyPlayerRole(room, player.id)
        : (room.gameId === 'battleship'
          ? getBattleshipPlayerRole(room, player.id)
        : (room.gameId === 'ticTacToe'
        ? getTicTacToePlayerSymbol(room, player.id)
        : (room.gameId === 'connect4'
          ? getConnect4PlayerSymbol(room, player.id)
          : (room.gameId === 'chess'
            ? getChessPlayerColor(room, player.id)
            : (room.gameId === 'checkers'
              ? getCheckersPlayerColor(room, player.id)
              : (room.gameId === 'uno' ? `seat-${getUnoPlayerIndex(room, player.id) + 1}` : null)))))))
    })),
    gameState: room.gameId === 'battleship'
      ? buildBattleshipStateForPlayer(room, socketId)
      : (room.gameId === 'uno'
        ? buildUnoStateForPlayer(room, socketId)
        : (['pong', 'airHockey', 'ticTacToe', 'connect4', 'chess', 'checkers', 'bomb'].includes(room.gameId) ? room.gameState : null)),
    readyCount: Number(room.readyPlayerIds?.length || 0),
    readyTotal: Number(room.players.length || 0),
    unoReadyCount: room.gameId === 'uno' ? Number(room.readyPlayerIds?.length || 0) : 0,
    unoReadyTotal: room.gameId === 'uno' ? Number(room.players.length || 0) : 0,
    unoStarted: room.gameId === 'uno' ? Boolean(room.unoStarted) : false,
    chessReadyCount: room.gameId === 'chess' ? Number(room.readyPlayerIds?.length || 0) : 0,
    chessReadyTotal: room.gameId === 'chess' ? Number(room.players.length || 0) : 0,
    chessStarted: room.gameId === 'chess' ? Boolean(room.chessStarted) : false,
    gameLaunched: Boolean(room.gameLaunched),
    chatMessages: Array.isArray(room.chatMessages)
      ? room.chatMessages.map((message) => ({
        ...message,
        isYou: message.playerId === socketId
      }))
      : []
  };
}

function getRoom(code) {
  return rooms.get(String(code || '').trim().toUpperCase()) || null;
}

function emitRoomUpdate(room) {
  room.lastActivityAt = Date.now();
  room.players.forEach((player) => {
    io.to(player.id).emit('room:updated', buildRoomPayload(room, player.id));
  });
}

function removePlayerFromRoom(room, socketId) {
  room.players = room.players.filter((player) => player.id !== socketId);

  if (!room.players.length) {
    rooms.delete(room.code);
    return;
  }

  if (room.hostId === socketId) {
    room.hostId = room.players[0].id;
  }

  syncRoomReadyState(room);
  resetRoomGame(room, false);

  emitRoomUpdate(room);
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, rooms: rooms.size });
});

app.post('/api/posters/resolve', async (request, response) => {
  try {
    const movies = Array.isArray(request.body?.movies) ? request.body.movies : [];
    const resolutions = await Promise.all(movies.map(async (movie) => ({
      id: movie.id,
      posterUrl: await resolvePosterForMovie(movie)
    })));

    response.json({ resolutions });
  } catch (error) {
    console.error('Impossible de resoudre les affiches TMDb.', error);
    response.status(500).json({ error: 'poster-resolution-failed' });
  }
});

setInterval(() => {
  const cutoff = Date.now() - 60000;

  for (const [ip, entry] of roomCreationRateMap) {
    if (entry.windowStart < cutoff) {
      roomCreationRateMap.delete(ip);
    }
  }
}, 60000);

app.post('/api/rooms', (request, response) => {
  const clientIp = request.ip || 'unknown';
  const now = Date.now();
  const rateLimitEntry = roomCreationRateMap.get(clientIp) || { count: 0, windowStart: now };

  if (now - rateLimitEntry.windowStart >= 60000) {
    rateLimitEntry.count = 0;
    rateLimitEntry.windowStart = now;
  }

  rateLimitEntry.count += 1;
  roomCreationRateMap.set(clientIp, rateLimitEntry);

  if (rateLimitEntry.count > 10) {
    return response.status(429).json({ error: 'too-many-requests' });
  }

  const requestedGameId = String(request.body?.gameId || '').trim();

  if (!requestedGameId || !MAX_PLAYERS_BY_GAME[requestedGameId]) {
    return response.status(400).json({ error: 'invalid-game-id' });
  }

  try {
    const roomCode = createUniqueRoomCode();
    const room = {
      code: roomCode,
      gameId: requestedGameId,
      hostId: null,
      players: [],
      readyPlayerIds: [],
      unoReadyPlayerIds: [],
      unoStarted: false,
      chessReadyPlayerIds: [],
      chessStarted: false,
      gameLaunched: false,
      chatMessages: [],
      gameState: createGameState(requestedGameId),
      createdAt: Date.now(),
      lastActivityAt: Date.now()
    };

    rooms.set(roomCode, room);
    response.status(201).json({ code: roomCode, gameId: room.gameId });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get('/api/rooms/:code', (request, response) => {
  const room = getRoom(request.params.code);

  if (!room) {
    response.status(404).json({ error: 'Room introuvable.' });
    return;
  }

  response.json(buildRoomPayload(room));
});

io.on('connection', (socket) => {
  const socketRateLimit = { count: 0, windowStart: Date.now(), warned: false };

  socket.use(([_event, ..._args], next) => {
    const now = Date.now();

    if (now - socketRateLimit.windowStart >= 1000) {
      socketRateLimit.count = 0;
      socketRateLimit.windowStart = now;
      socketRateLimit.warned = false;
    }

    socketRateLimit.count += 1;

    if (socketRateLimit.count > 120) {
      if (!socketRateLimit.warned) {
        socket.emit('room:error', { message: 'Trop de requêtes. Attends un instant.' });
        socketRateLimit.warned = true;
      }
      return;
    }

    next();
  });

  socket.on('room:create', ({ code, playerName }) => {
    const room = getRoom(code);

    if (!room) {
      socket.emit('room:error', { message: "Cette room n'existe pas." });
      return;
    }

    if (room.players.length >= getRoomMaxPlayers(room)) {
      socket.emit('room:error', { message: 'Cette room est déjà pleine.' });
      return;
    }

    if (room.players.some((player) => player.id === socket.id)) {
      socket.emit('room:joined', buildRoomPayload(room, socket.id));
      return;
    }

    const player = {
      id: socket.id,
      name: sanitizePlayerName(playerName, room.players.length ? getNextPirateFallback(room) : 'Capitaine')
    };

    room.players.push(player);
    if (!room.hostId) {
      room.hostId = player.id;
    }

    resetRoomGame(room, false);

    socket.join(room.code);
    socket.data.roomCode = room.code;
    emitRoomUpdate(room);
    socket.emit('room:joined', buildRoomPayload(room, socket.id));
  });

  socket.on('room:join', ({ code, playerName }) => {
    const room = getRoom(code);

    if (!room) {
      socket.emit('room:error', { message: 'Code de room invalide.' });
      return;
    }

    if (room.players.length >= getRoomMaxPlayers(room)) {
      socket.emit('room:error', { message: 'La room est complète.' });
      return;
    }

    if (room.players.some((player) => player.id === socket.id)) {
      socket.emit('room:joined', buildRoomPayload(room, socket.id));
      return;
    }

    const player = {
      id: socket.id,
      name: sanitizePlayerName(playerName, getNextPirateFallback(room))
    };

    room.players.push(player);
    resetRoomGame(room, false);
    socket.join(room.code);
    socket.data.roomCode = room.code;

    emitRoomUpdate(room);
    socket.emit('room:joined', buildRoomPayload(room, socket.id));
  });

  socket.on('room:update-game', ({ gameId }) => {
    const room = getRoom(socket.data.roomCode);
    const nextGameId = String(gameId || '').trim();

    if (!room) {
      socket.emit('room:error', { message: 'Aucun salon actif.' });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('room:error', { message: "Seul l'hôte peut changer le jeu du salon." });
      return;
    }

    if (!MAX_PLAYERS_BY_GAME[nextGameId]) {
      socket.emit('room:error', { message: "Ce jeu n'est pas disponible en multijoueur." });
      return;
    }

    if (room.gameId === nextGameId) {
      emitRoomUpdate(room);
      return;
    }

    room.gameId = nextGameId;
    room.gameState = createGameState(nextGameId);
    resetRoomGame(room, false);
    emitRoomUpdate(room);
  });

  socket.on('pong:start', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'pong') {
      socket.emit('room:error', { message: 'Aucune partie de Pong active.' });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('room:error', { message: "Seul l'hôte peut lancer le duel." });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends qu'un deuxième joueur rejoigne le salon." });
      return;
    }

    resetPongRound(room, true);
    startPongRound(room);
    emitRoomUpdate(room);
  });

  socket.on('pong:input', ({ direction }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'pong' || !room.gameState) {
      return;
    }

    const role = getPongPlayerRole(room, socket.id);
    if (!role) {
      return;
    }

    const normalizedDirection = Number(direction);
    const nextDirection = normalizedDirection > 0 ? 1 : (normalizedDirection < 0 ? -1 : 0);

    if (role === 'left') {
      room.gameState.leftInput = nextDirection;
    } else {
      room.gameState.rightInput = nextDirection;
    }
  });

  socket.on('airhockey:start', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'airHockey') {
      socket.emit('room:error', { message: "Aucune partie d'Air Hockey active." });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('room:error', { message: "Seul l'hôte peut lancer le duel." });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends qu'un deuxième joueur rejoigne le salon." });
      return;
    }

    resetAirHockeyRound(room, true);
    startAirHockeyRound(room);
    emitRoomUpdate(room);
  });

  socket.on('airhockey:input', ({ x, y }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'airHockey' || !room.gameState) {
      return;
    }

    const role = getAirHockeyPlayerRole(room, socket.id);
    if (!role) {
      return;
    }

    const nextInput = {
      x: Math.max(-1, Math.min(1, Number(x) || 0)),
      y: Math.max(-1, Math.min(1, Number(y) || 0))
    };

    if (role === 'left') {
      room.gameState.leftInput = nextInput;
    } else {
      room.gameState.rightInput = nextInput;
    }
  });

  socket.on('battleship:shot', ({ row, col }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'battleship') {
      socket.emit('room:error', { message: 'Aucune partie de Bataille active.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends qu'un deuxième joueur rejoigne la room." });
      return;
    }

    const playerRole = getBattleshipPlayerRole(room, socket.id);
    const targetRow = Number(row);
    const targetCol = Number(col);

    if (!playerRole) {
      socket.emit('room:error', { message: 'Tu ne fais pas partie de cette manche.' });
      return;
    }

    if (!Number.isInteger(targetRow) || !Number.isInteger(targetCol) || !isInsideGameGrid(targetRow, targetCol, BATTLESHIP_SIZE)) {
      socket.emit('room:error', { message: 'Case invalide.' });
      return;
    }

    if (room.gameState.winner || room.gameState.currentTurn !== playerRole) {
      return;
    }

    const targetGrid = playerRole === 'captain1' ? room.gameState.captain2Grid : room.gameState.captain1Grid;
    const targetCell = targetGrid[targetRow][targetCol];

    if (!targetCell || targetCell.hit) {
      return;
    }

    targetCell.hit = true;
    room.gameState.lastShot = {
      row: targetRow,
      col: targetCol,
      by: playerRole,
      hit: Boolean(targetCell.hasShip)
    };

    const remainingShips = countRemainingBattleshipShips(targetGrid);

    if (remainingShips === 0) {
      room.gameState.winner = playerRole;
      emitRoomUpdate(room);
      return;
    }

    room.gameState.currentTurn = playerRole === 'captain1' ? 'captain2' : 'captain1';
    emitRoomUpdate(room);
  });

  socket.on('battleship:restart', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'battleship') {
      return;
    }

    if (!room.players.some((player) => player.id === socket.id)) {
      return;
    }

    resetBattleshipRound(room);
    emitRoomUpdate(room);
  });

  socket.on('tictactoe:move', ({ index }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'ticTacToe') {
      socket.emit('room:error', { message: 'Aucune partie de morpion active.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends qu'un deuxième joueur rejoigne la room." });
      return;
    }

    const playerSymbol = getTicTacToePlayerSymbol(room, socket.id);
    const cellIndex = Number(index);

    if (!playerSymbol) {
      socket.emit('room:error', { message: 'Tu ne fais pas partie de cette manche.' });
      return;
    }

    if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex > 8) {
      socket.emit('room:error', { message: 'Case invalide.' });
      return;
    }

    if (room.gameState.finished || room.gameState.currentPlayer !== playerSymbol || room.gameState.board[cellIndex]) {
      return;
    }

    room.gameState.board[cellIndex] = playerSymbol;

    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    const hasWinner = lines.some(([a, b, c]) => {
      return room.gameState.board[a]
        && room.gameState.board[a] === room.gameState.board[b]
        && room.gameState.board[a] === room.gameState.board[c];
    });

    if (hasWinner) {
      room.gameState.finished = true;
      room.gameState.winner = playerSymbol;
      room.gameState.scores[playerSymbol] += 1;
      emitRoomUpdate(room);
      return;
    }

    if (room.gameState.board.every(Boolean)) {
      room.gameState.finished = true;
      room.gameState.winner = 'draw';
      emitRoomUpdate(room);
      return;
    }

    room.gameState.currentPlayer = playerSymbol === 'anchor' ? 'skull' : 'anchor';
    emitRoomUpdate(room);
  });

  socket.on('tictactoe:restart', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'ticTacToe') {
      return;
    }

    if (!room.players.some((player) => player.id === socket.id)) {
      return;
    }

    resetTicTacToeRound(room, true);
    emitRoomUpdate(room);
  });

  socket.on('connect4:move', ({ col }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'connect4') {
      socket.emit('room:error', { message: 'Aucune partie de Puissance 4 active.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends qu'un deuxième joueur rejoigne la room." });
      return;
    }

    const playerSymbol = getConnect4PlayerSymbol(room, socket.id);
    const columnIndex = Number(col);

    if (!playerSymbol) {
      socket.emit('room:error', { message: 'Tu ne fais pas partie de cette manche.' });
      return;
    }

    if (!Number.isInteger(columnIndex) || columnIndex < 0 || columnIndex >= CONNECT4_COLS) {
      socket.emit('room:error', { message: 'Colonne invalide.' });
      return;
    }

    if (room.gameState.finished || room.gameState.currentPlayer !== playerSymbol) {
      return;
    }

    const rowIndex = getConnect4DropRow(room.gameState.board, columnIndex);

    if (rowIndex === -1) {
      return;
    }

    room.gameState.board[rowIndex][columnIndex] = playerSymbol;
    room.gameState.lastMove = { row: rowIndex, col: columnIndex, token: playerSymbol };

    const winningLine = getConnect4Winner(room.gameState.board, playerSymbol);

    if (winningLine) {
      room.gameState.finished = true;
      room.gameState.winner = playerSymbol;
      room.gameState.winningLine = winningLine;
      room.gameState.scores[playerSymbol] += 1;
      emitRoomUpdate(room);
      return;
    }

    if (room.gameState.board.every((line) => line.every(Boolean))) {
      room.gameState.finished = true;
      room.gameState.winner = 'draw';
      room.gameState.winningLine = null;
      emitRoomUpdate(room);
      return;
    }

    room.gameState.currentPlayer = playerSymbol === 'player' ? 'ai' : 'player';
    room.gameState.winningLine = null;
    emitRoomUpdate(room);
  });

  socket.on('connect4:restart', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'connect4') {
      return;
    }

    if (!room.players.some((player) => player.id === socket.id)) {
      return;
    }

    resetConnect4Round(room, true);
    emitRoomUpdate(room);
  });

  socket.on('chess:move', ({ fromRow, fromCol, toRow, toCol }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'chess') {
      socket.emit('room:error', { message: "Aucune partie d'échecs active." });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends qu'un deuxième joueur rejoigne la room." });
      return;
    }

    const playerColor = getChessPlayerColor(room, socket.id);

    if (!playerColor || playerColor !== room.gameState.turn || room.gameState.winner) {
      return;
    }

    const movingPiece = room.gameState.board[fromRow]?.[fromCol];
    if (!movingPiece || movingPiece.color !== room.gameState.turn) {
      return;
    }

    const legalMove = getChessMoves(room.gameState, fromRow, fromCol).find((candidate) => candidate.row === toRow && candidate.col === toCol);
    if (!legalMove) {
      return;
    }

    const nextPiece = { ...movingPiece, hasMoved: true };
    const capturedPiece = room.gameState.board[toRow][toCol];
    room.gameState.board[toRow][toCol] = nextPiece;
    room.gameState.board[fromRow][fromCol] = null;

    if (nextPiece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
      const rookFromCol = toCol > fromCol ? CHESS_SIZE - 1 : 0;
      const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
      const rookPiece = room.gameState.board[toRow][rookFromCol];
      if (rookPiece) {
        room.gameState.board[toRow][rookToCol] = { ...rookPiece, hasMoved: true };
        room.gameState.board[toRow][rookFromCol] = null;
      }
    }

    if (nextPiece.type === 'pawn' && (toRow === 0 || toRow === CHESS_SIZE - 1)) {
      room.gameState.board[toRow][toCol] = createChessPiece('queen', nextPiece.color);
    }

    room.gameState.lastMove = {
      fromRow,
      fromCol,
      toRow,
      toCol,
      pieceType: movingPiece.type,
      capture: capturedPiece ? { row: toRow, col: toCol } : null,
      captureColor: capturedPiece?.color || null
    };

    room.gameState.turn = room.gameState.turn === 'white' ? 'black' : 'white';

    if (!getChessAllMoves(room.gameState, room.gameState.turn).length) {
      if (isChessKingInCheck(room.gameState, room.gameState.turn)) {
        room.gameState.winner = nextPiece.color;
      } else {
        room.gameState.winner = 'draw';
      }
    }

    emitRoomUpdate(room);
  });

  socket.on('chess:restart', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'chess') {
      return;
    }

    if (!room.players.some((player) => player.id === socket.id)) {
      return;
    }

    resetChessRound(room);
    emitRoomUpdate(room);
  });

  socket.on('chess:toggle-ready', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'chess') {
      return;
    }

    toggleRoomReady(room, socket.id);
    emitRoomUpdate(room);
  });

  socket.on('checkers:move', ({ fromRow, fromCol, toRow, toCol }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'checkers') {
      socket.emit('room:error', { message: 'Aucune partie de dames active.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends qu'un deuxième joueur rejoigne la room." });
      return;
    }

    const playerColor = getCheckersPlayerColor(room, socket.id);

    if (!playerColor || playerColor !== room.gameState.turn || room.gameState.winner) {
      return;
    }

    const movingPiece = room.gameState.board[fromRow]?.[fromCol];
    if (!movingPiece || movingPiece.color !== room.gameState.turn) {
      return;
    }

    const move = getCheckersMoves(room.gameState, fromRow, fromCol).find((candidate) => candidate.row === toRow && candidate.col === toCol);
    if (!move) {
      return;
    }

    const nextPiece = { ...movingPiece };
    const capturedPiece = move.capture ? room.gameState.board[move.capture.row][move.capture.col] : null;
    room.gameState.board[fromRow][fromCol] = null;
    room.gameState.board[toRow][toCol] = nextPiece;

    if (move.capture) {
      room.gameState.board[move.capture.row][move.capture.col] = null;
    }

    room.gameState.lastMove = {
      fromRow,
      fromCol,
      toRow,
      toCol,
      pieceType: movingPiece.king ? 'king' : 'checker',
      capture: move.capture ? { ...move.capture } : null,
      captureColor: capturedPiece?.color || null
    };

    if ((nextPiece.color === 'red' && toRow === 0) || (nextPiece.color === 'black' && toRow === CHECKERS_SIZE - 1)) {
      nextPiece.king = true;
    }

    const redCount = room.gameState.board.flat().filter((item) => item?.color === 'red').length;
    const blackCount = room.gameState.board.flat().filter((item) => item?.color === 'black').length;

    if (!redCount || !blackCount) {
      room.gameState.winner = redCount ? 'red' : 'black';
    } else {
      room.gameState.turn = room.gameState.turn === 'red' ? 'black' : 'red';
      if (!getCheckersAllMoves(room.gameState, room.gameState.turn).length) {
        room.gameState.winner = nextPiece.color;
      }
    }

    emitRoomUpdate(room);
  });

  socket.on('checkers:restart', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'checkers') {
      return;
    }

    if (!room.players.some((player) => player.id === socket.id)) {
      return;
    }

    resetCheckersRound(room);
    emitRoomUpdate(room);
  });

  socket.on('uno:play-card', ({ cardIndex }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'uno') {
      socket.emit('room:error', { message: 'Aucune partie de Uno active.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: 'Attends encore des joueurs dans le salon.' });
      return;
    }

    const playerIndex = getUnoPlayerIndex(room, socket.id);
    if (playerIndex === -1) {
      socket.emit('room:error', { message: 'Tu ne fais pas partie de cette manche.' });
      return;
    }

    if (room.gameState.winner || room.gameState.currentPlayerIndex !== playerIndex || room.gameState.pendingColorChoice) {
      return;
    }

    const normalizedIndex = Number(cardIndex);
    const player = room.gameState.players[playerIndex];
    const card = player.hand[normalizedIndex];

    if (!Number.isInteger(normalizedIndex) || !card || !isUnoCardPlayable(card, room.gameState)) {
      return;
    }

    const [playedCard] = player.hand.splice(normalizedIndex, 1);
    room.gameState.discardPile.push(playedCard);
    room.gameState.turnCount += 1;

    if (playedCard.color === 'wild') {
      room.gameState.pendingColorChoice = {
        playerId: socket.id,
        playerIndex,
        card: { ...playedCard }
      };
      room.gameState.lastAction = `${player.name} choisit une couleur.`;
      emitRoomUpdate(room);
      return;
    }

    room.gameState.currentColor = playedCard.color;
    if (!player.hand.length) {
      room.gameState.winner = player.id;
      room.gameState.lastAction = `${player.name} remporte la manche.`;
      emitRoomUpdate(room);
      return;
    }

    applyUnoCardEffects(room.gameState, playedCard, player.name);
    emitRoomUpdate(room);
  });

  socket.on('uno:choose-color', ({ color }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'uno' || !room.gameState?.pendingColorChoice) {
      return;
    }

    if (room.gameState.pendingColorChoice.playerId !== socket.id) {
      return;
    }

    const nextColor = ['red', 'yellow', 'green', 'blue'].includes(color) ? color : 'red';
    const { playerIndex, card } = room.gameState.pendingColorChoice;
    const player = room.gameState.players[playerIndex];
    room.gameState.pendingColorChoice = null;
    room.gameState.currentColor = nextColor;

    if (!player.hand.length) {
      room.gameState.winner = player.id;
      room.gameState.lastAction = `${player.name} finit en ${nextColor}.`;
      emitRoomUpdate(room);
      return;
    }

    applyUnoCardEffects(room.gameState, card, player.name);
    room.gameState.lastAction = `${player.name} met ${nextColor}.`;
    emitRoomUpdate(room);
  });

  socket.on('uno:draw-card', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'uno') {
      socket.emit('room:error', { message: 'Aucune partie de Uno active.' });
      return;
    }

    const playerIndex = getUnoPlayerIndex(room, socket.id);
    if (playerIndex === -1 || room.gameState.winner || room.gameState.currentPlayerIndex !== playerIndex || room.gameState.pendingColorChoice) {
      return;
    }

    const amount = Math.max(1, Number(room.gameState.drawPenalty || 0));
    const drawnCards = drawUnoCards(room.gameState, playerIndex, amount);
    const player = room.gameState.players[playerIndex];
    room.gameState.lastAction = `${player.name} pioche ${amount}.`;
    room.gameState.drawPenalty = 0;

    if (amount > 1 || !drawnCards.length || !isUnoCardPlayable(drawnCards[0], room.gameState)) {
      room.gameState.currentPlayerIndex = getNextUnoPlayerIndex(room.gameState, 1);
    }

    emitRoomUpdate(room);
  });

  socket.on('uno:restart', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'uno') {
      return;
    }

    if (!room.players.some((player) => player.id === socket.id)) {
      return;
    }

    resetUnoRound(room);
    emitRoomUpdate(room);
  });

  socket.on('uno:toggle-ready', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'uno') {
      return;
    }

    toggleRoomReady(room, socket.id);
    emitRoomUpdate(room);
  });

  socket.on('bomb:submit-word', ({ word }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'bomb') {
      socket.emit('room:error', { message: 'Aucune partie de la Bombe active.' });
      return;
    }

    if (room.players.length < 2 || !room.gameLaunched) {
      socket.emit('room:error', { message: 'Attends que la room soit complète et prête.' });
      return;
    }

    const state = room.gameState;
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== socket.id || currentPlayer.eliminated || state.winner) {
      return;
    }

    const normalizedWord = normalizeBombWord(word);
    const normalizedSyllable = normalizeBombWord(state.currentSyllable);

    if (normalizedWord.length < 3) {
      socket.emit('room:error', { message: 'Entre un mot plus long.' });
      return;
    }

    if (!normalizedWord.includes(normalizedSyllable)) {
      socket.emit('room:error', { message: `Ton mot doit contenir la syllabe ${state.currentSyllable.toUpperCase()}.` });
      return;
    }

    if (state.usedWordsMap[normalizedWord]) {
      socket.emit('room:error', { message: 'Ce mot a déjà été utilisé dans cette manche.' });
      return;
    }

    state.usedWordsMap[normalizedWord] = true;
    state.usedWords.unshift({
      value: String(word || '').trim().slice(0, 32),
      normalized: normalizedWord,
      by: currentPlayer.id
    });
    if (state.usedWords.length > BOMB_WORD_HISTORY_LIMIT) {
      const removedWord = state.usedWords.pop();
      if (removedWord?.normalized) {
        delete state.usedWordsMap[removedWord.normalized];
      }
    }

    state.lastWord = String(word || '').trim().slice(0, 32);
    state.lastWordBy = currentPlayer.id;

    const alivePlayers = getBombAlivePlayers(state);
    if (alivePlayers.length <= 1) {
      state.winner = alivePlayers[0]?.id || currentPlayer.id;
      state.turnDeadlineAt = 0;
      state.statusMessage = `${currentPlayer.name} tient jusqu au bout et remporte la manche.`;
      emitRoomUpdate(room);
      return;
    }

    const nextPlayerIndex = getNextActiveBombPlayerIndex(state, state.currentPlayerIndex);
    state.turnCount += 1;
    startBombTurn(state, nextPlayerIndex, `${currentPlayer.name} joue "${state.lastWord}". ${state.players[nextPlayerIndex].name} prend la bombe.`);
    emitRoomUpdate(room);
  });

  socket.on('bomb:restart', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'bomb') {
      return;
    }

    if (!room.players.some((player) => player.id === socket.id)) {
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends au moins un autre joueur pour relancer la manche." });
      return;
    }

    room.gameLaunched = true;
    resetBombRound(room, true);
    emitRoomUpdate(room);
  });

  socket.on('room:toggle-ready', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room) {
      socket.emit('room:error', { message: 'Aucune room active.' });
      return;
    }

    toggleRoomReady(room, socket.id);
    emitRoomUpdate(room);
  });

  socket.on('room:launch-game', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room) {
      socket.emit('room:error', { message: "Aucune room active à lancer." });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('room:error', { message: "Seul l'hôte peut lancer le jeu." });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: "Attends au moins un autre joueur avant de lancer le jeu." });
      return;
    }

    launchRoomGame(room);
  });

  socket.on('room:chat:send', ({ message }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room) {
      socket.emit('room:error', { message: 'Aucun salon actif pour envoyer un message.' });
      return;
    }

    if (!room.gameLaunched) {
      socket.emit('room:error', { message: 'Le chat sera disponible quand toute la room sera prête.' });
      return;
    }

    const player = room.players.find((entry) => entry.id === socket.id);
    if (!player) {
      return;
    }

    if (!appendRoomChatMessage(room, player, message)) {
      return;
    }

    emitRoomUpdate(room);
  });

  socket.on('room:leave', () => {
    const roomCode = socket.data.roomCode;

    if (!roomCode) {
      socket.emit('room:left');
      return;
    }

    const room = getRoom(roomCode);
    socket.leave(roomCode);
    socket.data.roomCode = null;

    if (room) {
      removePlayerFromRoom(room, socket.id);
    }

    socket.emit('room:left');
  });

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) {
      return;
    }

    const room = getRoom(roomCode);
    if (!room) {
      return;
    }

    removePlayerFromRoom(room, socket.id);
  });
});

setInterval(() => {
  rooms.forEach((room) => {
    if (room.gameId !== 'pong') {
      return;
    }

    if (updatePongRoom(room, PONG_TICK_MS / 1000)) {
      emitRoomUpdate(room);
    }
  });
}, PONG_TICK_MS);

setInterval(() => {
  rooms.forEach((room) => {
    if (room.gameId !== 'airHockey') {
      return;
    }

    if (updateAirHockeyRoom(room, AIR_HOCKEY_TICK_MS / 1000)) {
      emitRoomUpdate(room);
    }
  });
}, AIR_HOCKEY_TICK_MS);

setInterval(() => {
  rooms.forEach((room) => {
    if (room.gameId !== 'bomb') {
      return;
    }

    if (updateBombRoom(room)) {
      emitRoomUpdate(room);
    }
  });
}, 250);

const ROOM_INACTIVITY_TTL_MS = 30 * 60 * 1000;
setInterval(() => {
  const cutoff = Date.now() - ROOM_INACTIVITY_TTL_MS;
  for (const [code, room] of rooms) {
    if ((room.lastActivityAt || room.createdAt || 0) < cutoff) {
      rooms.delete(code);
    }
  }
}, 5 * 60 * 1000);

process.on('SIGTERM', async () => {
  if (postersPersistTimer) {
    clearTimeout(postersPersistTimer);
    postersPersistTimer = null;
  }

  await persistPostersCache();
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`La Baie des Naufrages multiplayer server listening on port ${PORT}`);
  console.log(`CORS origin: ${Array.isArray(CORS_ORIGIN) ? CORS_ORIGIN.join(', ') : CORS_ORIGIN}`);
});
