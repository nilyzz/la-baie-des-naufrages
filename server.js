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
const CHECKERS_DIRECTIONS = {
  red: [[-1, -1], [-1, 1]],
  black: [[1, -1], [1, 1]]
};
const MAX_PLAYERS_BY_GAME = {
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
      symbol: room.gameId === 'ticTacToe'
        ? getTicTacToePlayerSymbol(room, player.id)
        : (room.gameId === 'connect4'
          ? getConnect4PlayerSymbol(room, player.id)
          : (room.gameId === 'chess'
            ? getChessPlayerColor(room, player.id)
            : (room.gameId === 'checkers' ? getCheckersPlayerColor(room, player.id) : null)))
    })),
    gameState: ['ticTacToe', 'connect4', 'chess', 'checkers'].includes(room.gameId) ? room.gameState : null
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

  if (room.gameId === 'ticTacToe') {
    resetTicTacToeRound(room, false);
  } else if (room.gameId === 'connect4') {
    resetConnect4Round(room, false);
  } else if (room.gameId === 'chess') {
    resetChessRound(room);
  } else if (room.gameId === 'checkers') {
    resetCheckersRound(room);
  }

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
      gameState: String(request.body?.gameId || 'lobby').trim() === 'ticTacToe'
        ? createTicTacToeState()
        : (String(request.body?.gameId || 'lobby').trim() === 'connect4'
          ? createConnect4State()
          : (String(request.body?.gameId || 'lobby').trim() === 'chess'
            ? createChessState()
            : (String(request.body?.gameId || 'lobby').trim() === 'checkers' ? createCheckersState() : null)))
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

    if (room.gameId === 'ticTacToe') {
      resetTicTacToeRound(room, false);
    } else if (room.gameId === 'connect4') {
      resetConnect4Round(room, false);
    } else if (room.gameId === 'chess') {
      resetChessRound(room);
    } else if (room.gameId === 'checkers') {
      resetCheckersRound(room);
    }

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
    if (room.gameId === 'ticTacToe') {
      resetTicTacToeRound(room, false);
    } else if (room.gameId === 'connect4') {
      resetConnect4Round(room, false);
    } else if (room.gameId === 'chess') {
      resetChessRound(room);
    } else if (room.gameId === 'checkers') {
      resetCheckersRound(room);
    }
    socket.join(room.code);
    socket.data.roomCode = room.code;

    emitRoomUpdate(room);
    socket.emit('room:joined', buildRoomPayload(room, socket.id));
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

server.listen(PORT, () => {
  console.log(`La Baie des Naufrages multiplayer server listening on port ${PORT}`);
  console.log(`CORS origin: ${Array.isArray(CORS_ORIGIN) ? CORS_ORIGIN.join(', ') : CORS_ORIGIN}`);
});
