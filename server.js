const path = require('path');
const http = require('http');
const cors = require('cors');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CORS_ORIGIN = parseCorsOrigin(process.env.CORS_ORIGIN);
const CONNECT4_ROWS = 6;
const CONNECT4_COLS = 7;
const CHESS_SIZE = 8;
const CHECKERS_SIZE = 8;
const PONG_TARGET_SCORE = 7;
const PONG_BOARD_WIDTH = 700;
const PONG_BOARD_HEIGHT = Math.round(PONG_BOARD_WIDTH * 9 / 16);
const PONG_PADDLE_HEIGHT = 92;
const PONG_PADDLE_WIDTH = 14;
const PONG_BALL_SIZE = 16;
const PONG_PADDLE_OFFSET = 22;
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
const CHECKERS_DIRECTIONS = {
  red: [[-1, -1], [-1, 1]],
  black: [[1, -1], [1, 1]]
};
const MAX_PLAYERS_BY_GAME = {
  pong: 2,
  airHockey: 2,
  ticTacToe: 2,
  connect4: 2,
  chess: 2,
  checkers: 2
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

const rooms = new Map();

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

app.use(express.json());
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST']
}));
app.use(express.static(path.join(__dirname)));

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
  const nextName = String(name || '').trim().slice(0, 24);
  return nextName || fallback;
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

function createChessState() {
  return {
    board: createInitialChessBoard(),
    turn: 'white',
    winner: null,
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

function createGameState(gameId) {
  if (gameId === 'pong') {
    return createPongState();
  }

  if (gameId === 'airHockey') {
    return createAirHockeyState();
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
    round: Number(room.gameState?.round || 0) + 1
  };
}

function resetCheckersRound(room) {
  room.gameState = {
    board: createInitialCheckersBoard(),
    turn: 'red',
    winner: null,
    round: Number(room.gameState?.round || 0) + 1
  };
}

function resetRoomGame(room, keepScores = false) {
  if (room.gameId === 'pong') {
    resetPongRound(room, keepScores);
    return;
  }

  if (room.gameId === 'airHockey') {
    resetAirHockeyRound(room, keepScores);
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

  if (room.gameId === 'chess') {
    resetChessRound(room);
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

  if (room.gameState.countdownEndsAt && Date.now() < room.gameState.countdownEndsAt) {
    return changed;
  }

  if (room.gameState.countdownEndsAt) {
    room.gameState.countdownEndsAt = 0;
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

  const hitsLeft = room.gameState.ballX <= leftPaddleX + PONG_PADDLE_WIDTH
    && room.gameState.ballX + PONG_BALL_SIZE >= leftPaddleX
    && room.gameState.ballY + PONG_BALL_SIZE >= room.gameState.leftY
    && room.gameState.ballY <= room.gameState.leftY + PONG_PADDLE_HEIGHT
    && room.gameState.ballVelocityX < 0;

  if (hitsLeft) {
    const impact = ((room.gameState.ballY + (PONG_BALL_SIZE / 2)) - (room.gameState.leftY + (PONG_PADDLE_HEIGHT / 2))) / (PONG_PADDLE_HEIGHT / 2);
    room.gameState.ballX = leftPaddleX + PONG_PADDLE_WIDTH;
    room.gameState.ballVelocityX = Math.abs(room.gameState.ballVelocityX) + 20;
    room.gameState.ballVelocityY = getPongBounceVelocityY(impact);
  }

  const hitsRight = room.gameState.ballX + PONG_BALL_SIZE >= rightPaddleX
    && room.gameState.ballX <= rightPaddleX + PONG_PADDLE_WIDTH
    && room.gameState.ballY + PONG_BALL_SIZE >= room.gameState.rightY
    && room.gameState.ballY <= room.gameState.rightY + PONG_PADDLE_HEIGHT
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

  return moves;
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

function getCheckersMoves(state, row, col) {
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
      symbol: room.gameId === 'pong'
        ? getPongPlayerRole(room, player.id)
        : (room.gameId === 'airHockey'
          ? getAirHockeyPlayerRole(room, player.id)
        : (room.gameId === 'ticTacToe'
        ? getTicTacToePlayerSymbol(room, player.id)
        : (room.gameId === 'connect4'
          ? getConnect4PlayerSymbol(room, player.id)
          : (room.gameId === 'chess'
            ? getChessPlayerColor(room, player.id)
            : (room.gameId === 'checkers' ? getCheckersPlayerColor(room, player.id) : null)))))
    })),
    gameState: ['pong', 'airHockey', 'ticTacToe', 'connect4', 'chess', 'checkers'].includes(room.gameId) ? room.gameState : null
  };
}

function getRoom(code) {
  return rooms.get(String(code || '').trim().toUpperCase()) || null;
}

function emitRoomUpdate(room) {
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

  resetRoomGame(room, false);

  emitRoomUpdate(room);
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, rooms: rooms.size });
});

app.post('/api/rooms', (request, response) => {
  try {
    const roomCode = createUniqueRoomCode();
    const room = {
      code: roomCode,
      gameId: String(request.body?.gameId || 'lobby').trim() || 'lobby',
      hostId: null,
      players: [],
      gameState: createGameState(String(request.body?.gameId || 'lobby').trim() || 'lobby')
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
  socket.on('room:create', ({ code, playerName }) => {
    const room = getRoom(code);

    if (!room) {
      socket.emit('room:error', { message: 'Cette room n existe pas.' });
      return;
    }

    if (room.players.length >= getRoomMaxPlayers(room)) {
      socket.emit('room:error', { message: 'Cette room est deja pleine.' });
      return;
    }

    if (room.players.some((player) => player.id === socket.id)) {
      socket.emit('room:joined', buildRoomPayload(room, socket.id));
      return;
    }

    const player = {
      id: socket.id,
      name: sanitizePlayerName(playerName, room.players.length ? `Pirate ${room.players.length + 1}` : 'Capitaine')
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
      socket.emit('room:error', { message: 'La room est complete.' });
      return;
    }

    if (room.players.some((player) => player.id === socket.id)) {
      socket.emit('room:joined', buildRoomPayload(room, socket.id));
      return;
    }

    const player = {
      id: socket.id,
      name: sanitizePlayerName(playerName, `Pirate ${room.players.length + 1}`)
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
      socket.emit('room:error', { message: 'Seul l hote peut changer le jeu du salon.' });
      return;
    }

    if (!MAX_PLAYERS_BY_GAME[nextGameId]) {
      socket.emit('room:error', { message: 'Ce jeu n est pas disponible en multijoueur.' });
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
      socket.emit('room:error', { message: 'Seul l hote peut lancer le duel.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: 'Attends qu un deuxieme joueur rejoigne le salon.' });
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
      socket.emit('room:error', { message: 'Aucune partie d Air Hockey active.' });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('room:error', { message: 'Seul l hote peut lancer le duel.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: 'Attends qu un deuxieme joueur rejoigne le salon.' });
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

  socket.on('tictactoe:move', ({ index }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'ticTacToe') {
      socket.emit('room:error', { message: 'Aucune partie de morpion active.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: 'Attends qu un deuxieme joueur rejoigne la room.' });
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
      socket.emit('room:error', { message: 'Attends qu un deuxieme joueur rejoigne la room.' });
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
      socket.emit('room:error', { message: 'Aucune partie d echecs active.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: 'Attends qu un deuxieme joueur rejoigne la room.' });
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

    const nextPiece = { ...movingPiece };
    const capturedPiece = room.gameState.board[toRow][toCol];
    room.gameState.board[toRow][toCol] = nextPiece;
    room.gameState.board[fromRow][fromCol] = null;

    if (nextPiece.type === 'pawn' && (toRow === 0 || toRow === CHESS_SIZE - 1)) {
      room.gameState.board[toRow][toCol] = createChessPiece('queen', nextPiece.color);
    }

    if (capturedPiece?.type === 'king') {
      room.gameState.winner = nextPiece.color;
    } else {
      room.gameState.turn = room.gameState.turn === 'white' ? 'black' : 'white';
      if (!getChessAllMoves(room.gameState, room.gameState.turn).length) {
        room.gameState.winner = nextPiece.color;
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

  socket.on('checkers:move', ({ fromRow, fromCol, toRow, toCol }) => {
    const room = getRoom(socket.data.roomCode);

    if (!room || room.gameId !== 'checkers') {
      socket.emit('room:error', { message: 'Aucune partie de dames active.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: 'Attends qu un deuxieme joueur rejoigne la room.' });
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
    room.gameState.board[fromRow][fromCol] = null;
    room.gameState.board[toRow][toCol] = nextPiece;

    if (move.capture) {
      room.gameState.board[move.capture.row][move.capture.col] = null;
    }

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

  socket.on('room:launch-game', () => {
    const room = getRoom(socket.data.roomCode);

    if (!room) {
      socket.emit('room:error', { message: 'Aucune room active a lancer.' });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('room:error', { message: 'Seul l hote peut lancer la partie.' });
      return;
    }

    if (room.players.length < 2) {
      socket.emit('room:error', { message: 'Il faut au moins deux joueurs pour lancer cette partie.' });
      return;
    }

    io.to(room.code).emit('room:game:start', {
      code: room.code,
      gameId: room.gameId
    });
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

server.listen(PORT, () => {
  console.log(`La Baie des Naufrages multiplayer server listening on port ${PORT}`);
  console.log(`CORS origin: ${Array.isArray(CORS_ORIGIN) ? CORS_ORIGIN.join(', ') : CORS_ORIGIN}`);
});
