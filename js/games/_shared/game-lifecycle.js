import { showGamePanel } from './navigation.js';
import { closeGameOverModal } from '../../core/modals.js';
import { MULTIPLAYER_SUPPORTED_GAMES } from '../../core/constants.js';

export function cleanupActiveGameForNavigation(nextTab, activeGameTab, modules = {}) {
    const prev = activeGameTab;

    if (prev === 'minesweeper' && nextTab !== 'minesweeper') {
        modules.minesweeper?.setMinesweeperMenuVisible(true);
        modules.minesweeper?.initializeGame();
    }

    if (prev === 'snake' && nextTab !== 'snake') {
        modules.snake?.setSnakeMenuVisible(true);
        modules.snake?.stopSnake();
        modules.snake?.initializeSnake();
    }

    if (prev === 'pong' && nextTab !== 'pong') {
        modules.pong?.stopPong();
        modules.pong?.initializePong();
    }

    if (prev === 'sudoku' && nextTab !== 'sudoku') {
        modules.sudoku?.setSudokuMenuVisible(true);
        modules.sudoku?.initializeSudoku(false);
    }

    if (prev === '2048' && nextTab !== '2048') {
        modules.game2048?.initialize2048();
    }

    if (prev === 'aim' && nextTab !== 'aim') {
        modules.aim?.setAimMenuVisible(true);
        modules.aim?.initializeAim();
    }

    if (prev === 'memory' && nextTab !== 'memory') {
        modules.memory?.initializeMemory();
    }

    if (prev === 'ticTacToe' && nextTab !== 'ticTacToe') {
        modules.ticTacToe?.initializeTicTacToe();
    }

    if (prev === 'battleship' && nextTab !== 'battleship') {
        modules.battleship?.setBattleshipMenuVisible(true);
        modules.battleship?.initializeBattleship();
    }

    if (prev === 'tetris' && nextTab !== 'tetris') {
        modules.tetris?.setTetrisMenuVisible(true);
        modules.tetris?.initializeTetris();
    }

    if (prev === 'pacman' && nextTab !== 'pacman') {
        modules.pacman?.setPacmanMenuVisible(true);
        modules.pacman?.initializePacman();
    }

    if (prev === 'solitaire' && nextTab !== 'solitaire') {
        modules.solitaire?.setSolitaireMenuVisible(true);
        modules.solitaire?.initializeSolitaire();
    }

    if (prev === 'connect4' && nextTab !== 'connect4') {
        modules.connect4?.initializeConnect4();
    }

    if (prev === 'rhythm' && nextTab !== 'rhythm') {
        modules.rhythm?.setRhythmMenuVisible(true);
        modules.rhythm?.initializeRhythm();
    }

    if (prev === 'flappy' && nextTab !== 'flappy') {
        modules.flappy?.initializeFlappy();
    }

    if (prev === 'flowFree' && nextTab !== 'flowFree') {
        modules.flowFree?.setFlowFreeMenuVisible(true);
        modules.flowFree?.initializeFlowFree();
    }

    if (prev === 'magicSort' && nextTab !== 'magicSort') {
        modules.magicSort?.setMagicSortMenuVisible(true);
        modules.magicSort?.initializeMagicSort();
    }

    if (prev === 'mentalMath' && nextTab !== 'mentalMath') {
        modules.mentalMath?.initializeMentalMath();
    }

    if (prev === 'candyCrush' && nextTab !== 'candyCrush') {
        modules.candyCrush?.setCandyCrushMenuVisible(true);
        modules.candyCrush?.initializeCandyCrush();
    }

    if (prev === 'harborRun' && nextTab !== 'harborRun') {
        modules.harborRun?.setHarborRunMenuVisible(true);
        modules.harborRun?.initializeHarborRun();
    }

    if (prev === 'stacker' && nextTab !== 'stacker') {
        modules.stacker?.setStackerMenuVisible(true);
        modules.stacker?.initializeStacker();
    }

    if (prev === 'coinClicker' && nextTab !== 'coinClicker') {
        modules.coinClicker?.saveCoinClickerState();
        modules.coinClicker?.setCoinClickerMenuVisible(true);
    }

    if (prev === 'chess' && nextTab !== 'chess') {
        modules.chess?.initializeChess();
    }

    if (prev === 'checkers' && nextTab !== 'checkers') {
        modules.checkers?.initializeCheckers();
    }

    if (prev === 'airHockey' && nextTab !== 'airHockey') {
        modules.airHockey?.setAirHockeyMenuVisible(true);
        if (modules.airHockey?.isMultiplayerAirHockeyActive()) {
            modules.airHockey?.stopAirHockeyRuntime();
        } else {
            modules.airHockey?.initializeAirHockey();
        }
    }

    if (prev === 'reaction' && nextTab !== 'reaction') {
        modules.reaction?.setReactionMenuVisible(true);
        modules.reaction?.initializeReaction();
    }

    if (prev === 'baieBerry' && nextTab !== 'baieBerry') {
        modules.baieBerry?.stopBaieBerry();
        modules.baieBerry?.initializeBaieBerry();
    }

    if (prev === 'breakout' && nextTab !== 'breakout') {
        modules.breakout?.setBreakoutMenuVisible(true);
        modules.breakout?.stopBreakout();
        modules.breakout?.initializeBreakout();
    }

    if (prev === 'uno' && nextTab !== 'uno') {
        modules.uno?.initializeUno();
    }

    if (prev === 'bomb' && nextTab !== 'bomb') {
        modules.bomb?.stopBombTimerLoop();
        modules.bomb?.setBombLocalState(null);
        modules.bomb?.setBombMenuVisible(true);
        modules.bomb?.initializeBomb();
    }
}

export function openSelectedGame(nextTab, activeGameTab, modules = {}, options = {}) {
    const { setSelectedMultiplayerGame } = options;

    cleanupActiveGameForNavigation(nextTab, activeGameTab, modules);

    if (MULTIPLAYER_SUPPORTED_GAMES[nextTab] && typeof setSelectedMultiplayerGame === 'function') {
        setSelectedMultiplayerGame(nextTab);
    }

    showGamePanel(nextTab);

    if (nextTab === 'snake') {
        modules.snake?.setSnakeMenuVisible(true);
        modules.snake?.initializeSnake();
        closeGameOverModal();
        return;
    }

    if (nextTab === 'pong') {
        modules.pong?.initializePong();
        closeGameOverModal();
        return;
    }

    if (nextTab === '2048') {
        modules.game2048?.initialize2048();
        return;
    }

    if (nextTab === 'sudoku') {
        modules.sudoku?.setSudokuMenuVisible(true);
        modules.sudoku?.initializeSudoku(false);
        return;
    }

    if (nextTab === 'aim') {
        modules.aim?.setAimMenuVisible(true);
        modules.aim?.initializeAim();
        return;
    }

    if (nextTab === 'memory') {
        modules.memory?.initializeMemory();
        return;
    }

    if (nextTab === 'ticTacToe') {
        modules.ticTacToe?.initializeTicTacToe();
        return;
    }

    if (nextTab === 'battleship') {
        modules.battleship?.setBattleshipMenuVisible(true);
        modules.battleship?.initializeBattleship();
        return;
    }

    if (nextTab === 'tetris') {
        modules.tetris?.setTetrisMenuVisible(true);
        modules.tetris?.initializeTetris();
        return;
    }

    if (nextTab === 'pacman') {
        modules.pacman?.setPacmanMenuVisible(true);
        modules.pacman?.initializePacman();
        return;
    }

    if (nextTab === 'solitaire') {
        modules.solitaire?.setSolitaireMenuVisible(true);
        modules.solitaire?.initializeSolitaire();
        return;
    }

    if (nextTab === 'connect4') {
        modules.connect4?.initializeConnect4();
        return;
    }

    if (nextTab === 'rhythm') {
        modules.rhythm?.setRhythmMenuVisible(true);
        modules.rhythm?.initializeRhythm();
        return;
    }

    if (nextTab === 'flappy') {
        modules.flappy?.initializeFlappy();
        return;
    }

    if (nextTab === 'flowFree') {
        modules.flowFree?.setFlowFreeMenuVisible(true);
        modules.flowFree?.initializeFlowFree();
        return;
    }

    if (nextTab === 'magicSort') {
        modules.magicSort?.setMagicSortMenuVisible(true);
        modules.magicSort?.initializeMagicSort();
        return;
    }

    if (nextTab === 'mentalMath') {
        modules.mentalMath?.initializeMentalMath();
        return;
    }

    if (nextTab === 'candyCrush') {
        modules.candyCrush?.setCandyCrushMenuVisible(true);
        modules.candyCrush?.initializeCandyCrush();
        return;
    }

    if (nextTab === 'harborRun') {
        modules.harborRun?.setHarborRunMenuVisible(true);
        modules.harborRun?.initializeHarborRun();
        return;
    }

    if (nextTab === 'stacker') {
        modules.stacker?.setStackerMenuVisible(true);
        modules.stacker?.initializeStacker();
        return;
    }

    if (nextTab === 'coinClicker') {
        modules.coinClicker?.setCoinClickerMenuVisible(true);
        modules.coinClicker?.initializeCoinClicker();
        return;
    }

    if (nextTab === 'chess') {
        modules.chess?.initializeChess();
        return;
    }

    if (nextTab === 'checkers') {
        modules.checkers?.initializeCheckers();
        return;
    }

    if (nextTab === 'airHockey') {
        modules.airHockey?.setAirHockeyMenuVisible(true);
        modules.airHockey?.initializeAirHockey();
        return;
    }

    if (nextTab === 'reaction') {
        modules.reaction?.setReactionMenuVisible(true);
        modules.reaction?.initializeReaction();
        return;
    }

    if (nextTab === 'baieBerry') {
        modules.baieBerry?.initializeBaieBerry();
        return;
    }

    if (nextTab === 'breakout') {
        modules.breakout?.initializeBreakout();
        return;
    }

    if (nextTab === 'blockBlast') {
        modules.blockBlast?.setBlockBlastMenuVisible(true);
        modules.blockBlast?.initializeBlockBlast();
        return;
    }

    if (nextTab === 'uno') {
        modules.uno?.initializeUno();
        return;
    }

    if (nextTab === 'bomb') {
        modules.bomb?.setBombMenuVisible(true);
        modules.bomb?.initializeBomb();
        return;
    }

    modules.minesweeper?.initializeGame();
}
