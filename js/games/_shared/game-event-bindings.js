import * as minesweeper from '../minesweeper.js';
import * as snake from '../snake.js';
import * as pong from '../pong.js';
import * as sudoku from '../sudoku.js';
import * as _2048 from '../game2048.js';
import * as aim from '../aim.js';
import * as memory from '../memory.js';
import * as ticTacToe from '../ticTacToe.js';
import * as battleship from '../battleship.js';
import * as tetris from '../tetris.js';
import * as pacman from '../pacman.js';
import * as solitaire from '../solitaire.js';
import * as connect4 from '../connect4.js';
import * as rhythm from '../rhythm.js';
import * as flappy from '../flappy.js';
import * as flowFree from '../flowFree.js';
import * as magicSort from '../magicSort.js';
import * as mentalMath from '../mentalMath.js';
import * as candyCrush from '../candyCrush.js';
import * as harborRun from '../harborRun.js';
import * as stacker from '../stacker.js';
import * as coinClicker from '../coinClicker.js';
import * as chess from '../chess.js';
import * as checkers from '../checkers.js';
import * as airHockey from '../airHockey.js';
import * as reaction from '../reaction.js';
import * as baieBerry from '../baieBerry.js';
import * as breakout from '../breakout.js';
import * as blockBlast from '../blockBlast.js';
import * as uno from '../uno.js';
import * as bomb from '../bomb.js';
import { bindTouchGameControls } from './touch-controls.js';
import { UNO_MENU_CLOSE_DURATION_MS } from '../../core/constants.js';

// options: { getSocket, getActiveRoom, getActiveGameTab,
//   isMultiplayerLaunchPending, toggleMultiplayerReady, setMultiplayerStatus,
//   showGamePanel, showGamesSection, setSelectedMultiplayerGame,
//   setMultiplayerEntryMode, openSelectedGame, closeGameOverModal }
export function bindAllGameEventControls(options = {}) {
    document.getElementById('minesweeperBoard').addEventListener('click', (event) => {
        const cellButton = event.target.closest('.minesweeper-cell');
    
        if (!cellButton) {
            return;
        }
    
        const row = Number(cellButton.dataset.row);
        const col = Number(cellButton.dataset.col);
        minesweeper.revealCell(row, col);
    });
    
    document.getElementById('minesweeperBoard').addEventListener('contextmenu', (event) => {
        event.preventDefault();
    
        const cellButton = event.target.closest('.minesweeper-cell');
    
        if (!cellButton) {
            return;
        }
        minesweeper.toggleFlag(Number(cellButton.dataset.row), Number(cellButton.dataset.col));
    });
    
    document.getElementById('restartGameButton').addEventListener('click', () => {
        minesweeper.initializeGame();
    });
    
    document.getElementById('minesweeperMenuActionButton')?.addEventListener('click', () => {
        if (minesweeper.getMinesweeperMenuShowingRules()) {
            minesweeper.setMinesweeperMenuShowingRules(false);
            minesweeper.renderMinesweeperMenu();
            return;
        }
    
        minesweeper.initializeGame();
        minesweeper.closeMinesweeperMenu();
    });
    
    document.getElementById('minesweeperMenuRulesButton')?.addEventListener('click', () => {
        minesweeper.setMinesweeperMenuShowingRules(true);
        minesweeper.renderMinesweeperMenu();
    });
    
    document.querySelectorAll('[data-minesweeper-grid-size]').forEach((button) => {
        button.addEventListener('click', () => {
            minesweeper.setMinesweeperGridSize(button.dataset.minesweeperGridSize);
        });
    });
    
    document.getElementById('snakeStartButton').addEventListener('click', () => {
        snake.startSnake();
    });
    
    document.getElementById('snakeMenuActionButton')?.addEventListener('click', () => {
        if (snake.getSnakeMenuShowingRules()) {
            snake.setSnakeMenuShowingRules(false);
            snake.renderSnakeMenu();
            return;
        }

        snake.startSnakeLaunchSequence();
    });
    
    document.getElementById('snakeMenuRulesButton')?.addEventListener('click', () => {
        snake.setSnakeMenuShowingRules(true);
        snake.renderSnakeMenu();
    });
    
    document.querySelectorAll('[data-snake-grid-size]').forEach((button) => {
        button.addEventListener('click', () => {
            snake.setSnakeGridSize(button.dataset.snakeGridSize);
        });
    });
    
    document.getElementById('pongMenuActionButton')?.addEventListener('click', () => {
        if (pong.getPongMenuShowingRules()) {
            pong.setPongMenuShowingRules(false);
            pong.renderPongMenu();
            return;
        }

        pong.initializePong();
        pong.startPongLaunchSequence(() => {
            pong.startPong();
        });
    });
    
    document.getElementById('pongMenuRulesButton')?.addEventListener('click', () => {
        pong.setPongMenuShowingRules(!pong.getPongMenuShowingRules());
        pong.renderPongMenu();
    });
    
    document.querySelectorAll('[data-pong-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            pong.setPongMode(button.dataset.pongMode);
        });
    });
    
    document.getElementById('sudokuBoard').addEventListener('click', (event) => {
        const cellButton = event.target.closest('.sudoku-cell');
    
        if (!cellButton) {
            return;
        }
    
        const row = Number(cellButton.dataset.row);
        const col = Number(cellButton.dataset.col);
    
        sudoku.setSudokuSelectedCell(row, col);
        sudoku.renderSudoku();
    });
    
    document.getElementById('sudokuRestartButton').addEventListener('click', () => {
        sudoku.initializeSudoku(!sudoku.getSudokuMenuVisible());
    });
    
    document.getElementById('sudokuDifficultyButton')?.addEventListener('click', () => {
        sudoku.cycleSudokuDifficulty();
        sudoku.initializeSudoku(!sudoku.getSudokuMenuVisible());
    });
    
    document.getElementById('sudokuMenuActionButton')?.addEventListener('click', () => {
        if (sudoku.getSudokuMenuShowingRules()) {
            sudoku.setSudokuMenuShowingRules(false);
            sudoku.renderSudokuMenu();
            return;
        }
    
        sudoku.initializeSudoku(true);
        sudoku.closeSudokuMenu();
    });
    
    document.getElementById('sudokuMenuRulesButton')?.addEventListener('click', () => {
        sudoku.setSudokuMenuShowingRules(true);
        sudoku.renderSudokuMenu();
    });
    
    document.getElementById('game2048RestartButton').addEventListener('click', () => {
        options.closeGameOverModal();
        _2048.initialize2048();
    });
    
    document.getElementById('game2048MenuActionButton')?.addEventListener('click', () => {
        if (_2048.get2048MenuShowingRules()) {
            _2048.set2048MenuShowingRules(false);
            _2048.render2048Menu();
            return;
        }
    
        if (_2048.get2048MenuResult()) {
            _2048.initialize2048();
            _2048.close2048Menu();
            return;
        }
    
        _2048.close2048Menu();
    });
    
    document.getElementById('game2048MenuRulesButton')?.addEventListener('click', () => {
        _2048.set2048MenuShowingRules(!_2048.get2048MenuShowingRules());
        _2048.render2048Menu();
    });
    
    bindTouchGameControls({
        getActiveGameTab: options.getActiveGameTab,
        is2048Blocked: () => _2048.get2048MenuVisible(),
        move2048: _2048.move2048,
        queueSnakeDirectionInput: snake.queueSnakeDirectionInput,
        isPacmanBlocked: () => pacman.getPacmanMenuVisible() || pacman.getPacmanMenuClosing(),
        setPacmanNextDirection: (direction) => pacman.setPacmanNextDirection(direction),
        isTetrisBlocked: () => tetris.getTetrisMenuVisible() || tetris.getTetrisMenuClosing(),
        moveTetrisHorizontally: tetris.moveTetrisHorizontally,
        dropTetrisStep: tetris.dropTetrisStep,
        rotateTetrisPiece: tetris.rotateTetrisPiece,
        setPongTouchInput: pong.setPongTouchInput,
        clearPongTouchInput: pong.clearPongTouchInput,
        setAirHockeyTouchPos: airHockey.setAirHockeyTouchPos,
        clearAirHockeyTouchPos: airHockey.clearAirHockeyTouchPos
    });
    
    document.getElementById('aimMenuActionButton')?.addEventListener('click', () => {
        if (aim.getAimMenuShowingRules()) {
            aim.setAimMenuShowingRules(false);
            aim.renderAimMenu();
            return;
        }
        aim.startAimLaunchSequence();
    });
    
    document.getElementById('aimMenuRulesButton')?.addEventListener('click', () => {
        aim.setAimMenuShowingRules(true);
        aim.renderAimMenu();
    });
    
    document.getElementById('aimStartButton').addEventListener('click', () => {
        options.closeGameOverModal();
        aim.initializeAim();
    });
    
    document.querySelectorAll('[data-aim-duration]').forEach((button) => {
        button.addEventListener('click', () => {
            options.closeGameOverModal();
            aim.setAimRoundDuration(Number(button.dataset.aimDuration));
        });
    });
    
    document.getElementById('aimBoard').addEventListener('pointerdown', (event) => {
        if (aim.getAimMenuVisible() || aim.getAimMenuClosing()) return;
        event.preventDefault();
        aim.startAimRound();
        const targetButton = event.target.closest('.aim-target-shell[data-target-id]');
        const targetId = targetButton?.dataset.targetId;
    
        if (targetId) {
            aim.handleAimTargetHit(targetId);
            return;
        }
    
        aim.handleAimMiss();
    });
    
    document.getElementById('memoryMenuActionButton')?.addEventListener('click', () => {
        if (memory.getMemoryMenuShowingRules()) {
            memory.setMemoryMenuShowingRules(false);
            memory.renderMemoryMenu();
            return;
        }
    
        options.closeGameOverModal();
        memory.initializeMemory();
        memory.startMemoryLaunchSequence();
    });
    
    document.getElementById('memoryMenuRulesButton')?.addEventListener('click', () => {
        memory.setMemoryMenuShowingRules(!memory.getMemoryMenuShowingRules());
        memory.renderMemoryMenu();
    });
    
    document.getElementById('memoryBoard').addEventListener('click', (event) => {
        const cardButton = event.target.closest('.memory-card-tile');
    
        if (!cardButton) {
            return;
        }
    
        memory.handleMemoryCardFlip(Number(cardButton.dataset.index));
    });
    
    document.getElementById('ticTacToeRestartButton').addEventListener('click', () => {
        if (ticTacToe.isMultiplayerTicTacToeActive()) {
            if (!options.getSocket()?.connected) {
                options.setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }
    
            options.getSocket().emit('tictactoe:restart');
            return;
        }
    
        ticTacToe.initializeTicTacToe();
    });
    
    document.getElementById('ticTacToeMenuActionButton')?.addEventListener('click', () => {
        if (ticTacToe.getTicTacToeMenuShowingRules()) {
            ticTacToe.setTicTacToeMenuShowingRules(false);
            ticTacToe.renderTicTacToeMenu();
            return;
        }
    
        if (ticTacToe.getTicTacToeMenuResult()) {
            if (ticTacToe.isMultiplayerTicTacToeActive()) {
                options.getSocket()?.emit('tictactoe:restart');
                ticTacToe.setTicTacToeMenuVisible(false);
                ticTacToe.setTicTacToeMenuResult(null);
                ticTacToe.renderTicTacToeMenu();
                return;
            }
    
            ticTacToe.initializeTicTacToe(false);
            return;
        }
    
        if (ticTacToe.isMultiplayerTicTacToeActive() && options.isMultiplayerLaunchPending('ticTacToe')) {
            options.toggleMultiplayerReady();
            return;
        }
    
        ticTacToe.setTicTacToeMenuResult(null);
        ticTacToe.closeTicTacToeMenu();
    });
    
    document.getElementById('ticTacToeMenuRulesButton')?.addEventListener('click', () => {
        ticTacToe.setTicTacToeMenuShowingRules(!ticTacToe.getTicTacToeMenuShowingRules());
        ticTacToe.renderTicTacToeMenu();
    });
    
    document.querySelectorAll('[data-tictactoe-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            ticTacToe.setTicTacToeMode(button.dataset.tictactoeMode);
        });
    });
    
    document.getElementById('ticTacToeBoard').addEventListener('click', (event) => {
        const cellButton = event.target.closest('.tictactoe-cell');
    
        if (!cellButton) {
            return;
        }
    
        const mode = ticTacToe.getTicTacToeMode();
        ticTacToe.handleTicTacToeMove(
            Number(cellButton.dataset.index),
            mode === 'duo' ? ticTacToe.getTicTacToeCurrentPlayer() : 'anchor'
        );
    });
    
    document.getElementById('battleshipRestartButton').addEventListener('click', () => {
        options.closeGameOverModal();
        if (battleship.isMultiplayerBattleshipActive()) {
            options.getSocket()?.emit('battleship:restart');
            return;
        }
        battleship.initializeBattleship();
    });
    
    document.getElementById('battleshipMenuActionButton')?.addEventListener('click', () => {
        if (battleship.getBattleshipMenuShowingRules()) {
            battleship.setBattleshipMenuShowingRules(false);
            battleship.renderBattleshipMenu();
            return;
        }
    
        if (battleship.isMultiplayerBattleshipActive() && options.isMultiplayerLaunchPending('battleship')) {
            options.toggleMultiplayerReady();
            return;
        }
    
        if (battleship.isMultiplayerBattleshipActive()) {
            options.getSocket()?.emit('battleship:restart');
        } else {
            battleship.initializeBattleship();
        }
        battleship.closeBattleshipMenu();
    });
    
    document.getElementById('battleshipMenuRulesButton')?.addEventListener('click', () => {
        battleship.setBattleshipMenuShowingRules(true);
        battleship.renderBattleshipMenu();
    });
    
    document.getElementById('tetrisStartButton').addEventListener('click', () => {
        tetris.startTetris();
    });
    
    document.getElementById('tetrisMenuActionButton')?.addEventListener('click', () => {
        if (tetris.getTetrisMenuShowingRules()) {
            tetris.setTetrisMenuShowingRules(false);
            tetris.renderTetrisMenu();
            return;
        }
    
        tetris.initializeTetris();
        tetris.closeTetrisMenu();
        window.setTimeout(() => {
            tetris.startTetris();
        }, UNO_MENU_CLOSE_DURATION_MS);
    });
    
    document.getElementById('tetrisMenuRulesButton')?.addEventListener('click', () => {
        tetris.setTetrisMenuShowingRules(true);
        tetris.renderTetrisMenu();
    });
    
    document.getElementById('pacmanStartButton').addEventListener('click', () => {
        pacman.startPacman();
    });
    
    document.getElementById('pacmanMenuActionButton')?.addEventListener('click', () => {
        if (pacman.getPacmanMenuShowingRules()) {
            pacman.setPacmanMenuShowingRules(false);
            pacman.renderPacmanMenu();
            return;
        }
    
        pacman.initializePacman();
        pacman.closePacmanMenu();
        window.setTimeout(() => {
            pacman.startPacman();
        }, UNO_MENU_CLOSE_DURATION_MS);
    });
    
    document.getElementById('pacmanMenuRulesButton')?.addEventListener('click', () => {
        pacman.setPacmanMenuShowingRules(true);
        pacman.renderPacmanMenu();
    });
    
    document.getElementById('solitaireMenuActionButton')?.addEventListener('click', () => {
        if (solitaire.getSolitaireMenuShowingRules()) {
            solitaire.setSolitaireMenuShowingRules(false);
            solitaire.renderSolitaireMenu();
            return;
        }
        solitaire.initializeSolitaire();
        solitaire.closeSolitaireMenu();
    });
    
    document.getElementById('solitaireMenuRulesButton')?.addEventListener('click', () => {
        solitaire.setSolitaireMenuShowingRules(true);
        solitaire.renderSolitaireMenu();
    });
    
    document.getElementById('solitaireRestartButton').addEventListener('click', () => {
        solitaire.initializeSolitaire();
    });
    
    document.getElementById('connect4MenuActionButton')?.addEventListener('click', () => {
        if (connect4.getConnect4MenuShowingRules()) {
            connect4.setConnect4MenuShowingRules(false);
            connect4.renderConnect4Menu();
            return;
        }
    
        if (connect4.isMultiplayerConnect4Active()) {
            if (!options.getSocket()?.connected) {
                options.setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }
    
            if (options.isMultiplayerLaunchPending('connect4')) {
                options.toggleMultiplayerReady();
                return;
            }
    
            options.getSocket().emit('connect4:restart');
            connect4.setConnect4MenuVisible(false);
            connect4.setConnect4MenuResult(false);
            connect4.renderConnect4Menu();
            return;
        }
    
        connect4.initializeConnect4();
        connect4.startConnect4LaunchSequence();
    });
    
    document.getElementById('connect4MenuRulesButton')?.addEventListener('click', () => {
        connect4.setConnect4MenuShowingRules(!connect4.getConnect4MenuShowingRules());
        connect4.renderConnect4Menu();
    });
    
    document.querySelectorAll('[data-connect4-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            connect4.setConnect4Mode(button.dataset.connect4Mode);
        });
    });
    
    document.getElementById('rhythmMenuActionButton')?.addEventListener('click', () => {
        if (rhythm.getRhythmMenuShowingRules()) {
            rhythm.setRhythmMenuShowingRules(false);
            rhythm.renderRhythmMenu();
            return;
        }
        rhythm.closeRhythmMenu();
        window.setTimeout(() => { rhythm.startRhythm(); }, UNO_MENU_CLOSE_DURATION_MS);
    });
    
    document.getElementById('rhythmMenuRulesButton')?.addEventListener('click', () => {
        rhythm.setRhythmMenuShowingRules(true);
        rhythm.renderRhythmMenu();
    });
    
    document.getElementById('rhythmStartButton').addEventListener('click', () => {
        rhythm.startRhythm();
    });
    
    document.getElementById('flappyMenuActionButton')?.addEventListener('click', () => {
        if (flappy.getFlappyMenuShowingRules()) {
            flappy.setFlappyMenuShowingRules(false);
            flappy.renderFlappyMenu();
            return;
        }
    
        flappy.initializeFlappy();
        flappy.startFlappyLaunchSequence();
    });
    
    document.getElementById('flappyMenuRulesButton')?.addEventListener('click', () => {
        flappy.setFlappyMenuShowingRules(!flappy.getFlappyMenuShowingRules());
        flappy.renderFlappyMenu();
    });
    
    document.getElementById('flowFreeMenuActionButton')?.addEventListener('click', () => {
        if (flowFree.getFlowFreeMenuShowingRules()) {
            flowFree.setFlowFreeMenuShowingRules(false);
            flowFree.renderFlowFreeMenu();
            return;
        }
        flowFree.initializeFlowFree();
        flowFree.closeFlowFreeMenu();
    });
    
    document.getElementById('flowFreeMenuRulesButton')?.addEventListener('click', () => {
        flowFree.setFlowFreeMenuShowingRules(true);
        flowFree.renderFlowFreeMenu();
    });
    
    document.getElementById('flowFreeRestartButton').addEventListener('click', () => {
        options.closeGameOverModal();
        flowFree.initializeFlowFree();
    });
    
    document.getElementById('magicSortMenuActionButton')?.addEventListener('click', () => {
        if (magicSort.getMagicSortMenuShowingRules()) {
            magicSort.setMagicSortMenuShowingRules(false);
            magicSort.renderMagicSortMenu();
            return;
        }
        magicSort.initializeMagicSort();
        magicSort.closeMagicSortMenu();
    });
    
    document.getElementById('magicSortMenuRulesButton')?.addEventListener('click', () => {
        magicSort.setMagicSortMenuShowingRules(true);
        magicSort.renderMagicSortMenu();
    });
    
    document.getElementById('magicSortRestartButton').addEventListener('click', () => {
        options.closeGameOverModal();
        magicSort.initializeMagicSort();
    });
    
    document.getElementById('mentalMathMenuActionButton')?.addEventListener('click', () => {
        if (mentalMath.getMentalMathMenuShowingRules()) {
            mentalMath.setMentalMathMenuShowingRules(false);
            mentalMath.renderMentalMathMenu();
            return;
        }
    
        mentalMath.initializeMentalMath();
        mentalMath.startMentalMathLaunchSequence();
    });
    
    document.getElementById('mentalMathMenuRulesButton')?.addEventListener('click', () => {
        mentalMath.setMentalMathMenuShowingRules(!mentalMath.getMentalMathMenuShowingRules());
        mentalMath.renderMentalMathMenu();
    });
    
    document.getElementById('mentalMathForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        mentalMath.submitMentalMathAnswer();
    });
    
    document.querySelectorAll('[data-mental-math-key], [data-mental-math-action]').forEach((button) => {
        button.addEventListener('click', () => {
            const key = button.dataset.mentalMathKey;
            const action = button.dataset.mentalMathAction;
    
            if (key) {
                mentalMath.handleMentalMathKeypadInput(key);
                return;
            }
    
            if (action) {
                mentalMath.handleMentalMathKeypadAction(action);
            }
        });
    });
    
    document.getElementById('mentalMathAnswerInput')?.addEventListener('input', () => {
        document.getElementById('mentalMathAnswerInput').value = document.getElementById('mentalMathAnswerInput').value.replace(/\D/g, '');
    });
    
    document.addEventListener('keydown', (event) => {
        if (options.getActiveGameTab() !== 'mentalMath' || mentalMath.getMentalMathMenuVisible() || mentalMath.getMentalMathMenuClosing()) {
            return;
        }
    
        if (!mentalMath.getMentalMathRoundRunning()) {
            return;
        }
    
        if (/^\d$/.test(event.key)) {
            event.preventDefault();
            mentalMath.handleMentalMathKeypadInput(event.key);
            return;
        }
    
        if (event.key === 'Backspace') {
            event.preventDefault();
            mentalMath.handleMentalMathKeypadAction('backspace');
            return;
        }
    
        if (event.key === 'Delete') {
            event.preventDefault();
            mentalMath.handleMentalMathKeypadAction('clear');
            return;
        }
    
        if (event.key === 'Enter') {
            event.preventDefault();
            mentalMath.submitMentalMathAnswer();
        }
    });
    
    document.getElementById('candyCrushRestartButton').addEventListener('click', () => {
        options.closeGameOverModal();
        candyCrush.initializeCandyCrush();
    });
    
    document.getElementById('candyCrushMenuActionButton')?.addEventListener('click', () => {
        if (candyCrush.getCandyCrushMenuShowingRules()) {
            candyCrush.setCandyCrushMenuShowingRules(false);
            candyCrush.renderCandyCrushMenu();
            return;
        }
    
        candyCrush.initializeCandyCrush();
        candyCrush.closeCandyCrushMenu();
    });
    
    document.getElementById('candyCrushMenuRulesButton')?.addEventListener('click', () => {
        candyCrush.setCandyCrushMenuShowingRules(true);
        candyCrush.renderCandyCrushMenu();
    });
    
    document.getElementById('harborRunStartButton').addEventListener('click', () => {
        options.closeGameOverModal();
        harborRun.startHarborRun();
    });
    
    document.getElementById('harborRunMenuActionButton')?.addEventListener('click', () => {
        if (harborRun.getHarborRunMenuShowingRules()) {
            harborRun.setHarborRunMenuShowingRules(false);
            harborRun.renderHarborRunMenu();
            return;
        }
    
        harborRun.initializeHarborRun();
        harborRun.closeHarborRunMenu();
        window.setTimeout(() => {
            harborRun.startHarborRun();
        }, UNO_MENU_CLOSE_DURATION_MS);
    });
    
    document.getElementById('harborRunMenuRulesButton')?.addEventListener('click', () => {
        harborRun.setHarborRunMenuShowingRules(true);
        harborRun.renderHarborRunMenu();
    });
    
    document.getElementById('stackerStartButton').addEventListener('click', () => {
        stacker.dropStackerLayer();
    });
    
    document.getElementById('stackerMenuActionButton')?.addEventListener('click', () => {
        if (stacker.getStackerMenuShowingRules()) {
            stacker.setStackerMenuShowingRules(false);
            stacker.renderStackerMenu();
            return;
        }
    
        stacker.startStackerLaunchSequence();
    });
    
    document.getElementById('stackerMenuRulesButton')?.addEventListener('click', () => {
        stacker.setStackerMenuShowingRules(true);
        stacker.renderStackerMenu();
    });
    
    document.getElementById('coinClickerButton')?.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) {
            return;
        }
    
        if (coinClicker.getCoinClickerMenuVisible() || coinClicker.getCoinClickerMenuClosing()) {
            return;
        }
    
        const state = coinClicker.getCoinClickerState();
        state.coins += coinClicker.getCoinClickerCoinsPerClick();
        coinClicker.saveCoinClickerState();
        coinClicker.renderCoinClicker();
    });
    
    document.getElementById('coinClickerButton')?.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
        }
    });
    
    document.getElementById('coinClickerResetButton')?.addEventListener('click', () => {
        coinClicker.initializeCoinClicker(true);
    });
    
    document.getElementById('coinClickerMenuActionButton')?.addEventListener('click', () => {
        if (coinClicker.getCoinClickerMenuShowingRules()) {
            coinClicker.setCoinClickerMenuShowingRules(false);
            coinClicker.renderCoinClickerMenu();
            return;
        }
    
        coinClicker.closeCoinClickerMenu();
    });
    
    document.getElementById('coinClickerMenuRulesButton')?.addEventListener('click', () => {
        coinClicker.setCoinClickerMenuShowingRules(true);
        coinClicker.renderCoinClickerMenu();
    });
    
    document.getElementById('coinClickerShop')?.addEventListener('click', (event) => {
        const upgradeButton = event.target.closest('[data-coin-upgrade]');
    
        if (!upgradeButton) {
            return;
        }
    
        const upgrade = coinClicker.COIN_CLICKER_UPGRADES.find((item) => item.id === upgradeButton.dataset.coinUpgrade);
    
        if (!upgrade) {
            return;
        }
    
        const cost = coinClicker.getCoinClickerUpgradeCost(upgrade);
        const state = coinClicker.getCoinClickerState();
    
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
        document.getElementById('coinClickerHelpText').textContent = upgrade.effectType === 'auto'
            ? 'Le butin tombe maintenant tout seul dans la cale.'
            : (upgrade.effectType === 'multiplier'
                ? 'Ton butin vaut plus à chaque clic.'
                : 'Tes clics frappent plus fort sur la caisse.');
        coinClicker.saveCoinClickerState();
        coinClicker.renderCoinClicker();
    });
    
    document.getElementById('chessMenuActionButton')?.addEventListener('click', () => {
        if (chess.getChessMenuShowingRules()) {
            chess.setChessMenuShowingRules(false);
            chess.renderChessMenu();
            return;
        }
    
        if (options.getActiveRoom()?.gameId === 'chess') {
            options.toggleMultiplayerReady();
            return;
        }
    
        chess.initializeChess();
        chess.startChessLaunchSequence();
    });
    
    document.getElementById('chessMenuRulesButton')?.addEventListener('click', () => {
        chess.setChessMenuShowingRules(!chess.getChessMenuShowingRules());
        chess.renderChessMenu();
    });
    
    document.querySelectorAll('[data-chess-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            chess.setChessMode(button.dataset.chessMode);
        });
    });
    
    document.getElementById('chessBoard')?.addEventListener('pointerdown', (event) => {
        const piece = event.target.closest('[data-chess-piece]');
        if (!piece) {
            return;
        }
    
        const [row, col] = piece.dataset.chessPiece.split('-').map(Number);
        chess.handleChessPiecePointerDown(event, row, col);
    });
    
    window.addEventListener('pointermove', chess.handleChessPointerMove);
    window.addEventListener('pointerup', chess.handleChessPointerUp);
    window.addEventListener('pointercancel', chess.handleChessPointerUp);
    
    document.getElementById('chessBoard')?.addEventListener('click', (event) => {
        if (chess.getChessSuppressNextClick()) {
            chess.setChessSuppressNextClick(false);
            return;
        }
    
        const cell = event.target.closest('[data-chess-cell]');
    
        if (!cell) {
            return;
        }
    
        const [row, col] = cell.dataset.chessCell.split('-').map(Number);
        chess.handleChessCellClick(row, col);
    });

    document.getElementById('chessPromotionOverlay')?.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-chess-promote]');
        if (!btn) return;
        chess.handleChessPromotion(btn.dataset.chessPromote);
    });

    document.getElementById('checkersMenuActionButton')?.addEventListener('click', () => {
        if (checkers.getCheckersMenuShowingRules()) {
            checkers.setCheckersMenuShowingRules(false);
            checkers.renderCheckersMenu();
            return;
        }
    
        if (checkers.isMultiplayerCheckersActive()) {
            if (!options.getSocket()?.connected) {
                options.setMultiplayerStatus('Connexion au serveur multijoueur interrompue.');
                return;
            }
    
            if (options.isMultiplayerLaunchPending('checkers')) {
                options.toggleMultiplayerReady();
                return;
            }
    
            options.getSocket().emit('checkers:restart');
            checkers.setCheckersMenuVisible(false);
            checkers.setCheckersMenuResult(false);
            checkers.renderCheckersMenu();
            return;
        }
    
        checkers.initializeCheckers();
        checkers.startCheckersLaunchSequence();
    });
    
    document.getElementById('checkersMenuRulesButton')?.addEventListener('click', () => {
        checkers.setCheckersMenuShowingRules(!checkers.getCheckersMenuShowingRules());
        checkers.renderCheckersMenu();
    });
    
    document.querySelectorAll('[data-checkers-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            checkers.setCheckersMode(button.dataset.checkersMode);
        });
    });
    
    document.getElementById('checkersBoard')?.addEventListener('pointerdown', (event) => {
        const piece = event.target.closest('[data-checkers-piece]');
        if (!piece) {
            return;
        }
    
        const [row, col] = piece.dataset.checkersPiece.split('-').map(Number);
        checkers.handleCheckersPiecePointerDown(event, row, col);
    });
    
    window.addEventListener('pointermove', checkers.handleCheckersPointerMove);
    window.addEventListener('pointerup', checkers.handleCheckersPointerUp);
    window.addEventListener('pointercancel', checkers.handleCheckersPointerUp);
    
    document.getElementById('checkersBoard')?.addEventListener('click', (event) => {
        if (checkers.getCheckersSuppressNextClick()) {
            checkers.setCheckersSuppressNextClick(false);
            return;
        }
    
        const cell = event.target.closest('[data-checkers-cell]');
    
        if (!cell) {
            return;
        }
    
        const [row, col] = cell.dataset.checkersCell.split('-').map(Number);
        checkers.handleCheckersCellClick(row, col);
    });
    
    document.querySelectorAll('[data-airhockey-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            const mode = button.dataset.airhockeyMode;
            airHockey.setAirHockeyMode(mode);
            document.querySelectorAll('[data-airhockey-mode]').forEach((item) => item.classList.toggle('is-active', item === button));
            document.getElementById('airHockeyHelpText').textContent = mode === 'solo'
                ? "Joueur gauche : ZQSD. La droite est pilotée par l'IA."
                : 'Joueur gauche : ZQSD. Joueur droit : flèches directionnelles.';
            airHockey.initializeAirHockey();
        });
    });

    document.getElementById('airHockeyStartButton')?.addEventListener('click', () => {
        airHockey.initializeAirHockey(false);
        airHockey.launchAirHockeyPuck();
    });

    document.getElementById('airHockeyMenuActionButton')?.addEventListener('click', () => {
        if (airHockey.getAirHockeyMenuShowingRules()) {
            airHockey.setAirHockeyMenuShowingRules(false);
            airHockey.renderAirHockeyMenu();
            return;
        }

        airHockey.startAirHockeyLaunchSequence();
    });
    
    document.getElementById('airHockeyMenuRulesButton')?.addEventListener('click', () => {
        airHockey.setAirHockeyMenuShowingRules(true);
        airHockey.renderAirHockeyMenu();
    });
    
    document.getElementById('reactionMenuActionButton')?.addEventListener('click', () => {
        if (reaction.getReactionMenuShowingRules()) {
            reaction.setReactionMenuShowingRules(false);
            reaction.renderReactionMenu();
            return;
        }
    
        reaction.startReactionRound();
        reaction.closeReactionMenu();
    });
    
    document.getElementById('reactionMenuRulesButton')?.addEventListener('click', () => {
        reaction.setReactionMenuShowingRules(true);
        reaction.renderReactionMenu();
    });
    
    document.getElementById('reactionLantern')?.addEventListener('click', (event) => {
        event.stopPropagation();
        reaction.handleReactionAttempt();
    });
    
    document.getElementById('reactionTable')?.addEventListener('click', (event) => {
        if (reaction.getReactionMenuVisible() || reaction.getReactionMenuClosing()) {
            return;
        }
    
        if (event.target === document.getElementById('reactionMenuOverlay')) {
            return;
        }
    
        reaction.handleReactionAttempt();
    });
    
    document.getElementById('baieBerryMenuActionButton')?.addEventListener('click', () => {
        if (baieBerry.getBaieBerryMenuShowingRules()) {
            baieBerry.setBaieBerryMenuShowingRules(false);
            baieBerry.renderBaieBerryMenu();
            return;
        }
    
        baieBerry.initializeBaieBerry();
        baieBerry.startBaieBerryLaunchSequence();
    });
    
    document.getElementById('baieBerryMenuRulesButton')?.addEventListener('click', () => {
        baieBerry.setBaieBerryMenuShowingRules(!baieBerry.getBaieBerryMenuShowingRules());
        baieBerry.renderBaieBerryMenu();
    });
    
    document.getElementById('baieBerryCanvas')?.addEventListener('pointermove', (event) => {
        if (baieBerry.getBaieBerryMenuVisible() || baieBerry.getBaieBerryMenuClosing()) {
            return;
        }
        const bounds = document.getElementById('baieBerryCanvas').getBoundingClientRect();
        const scaleX = document.getElementById('baieBerryCanvas').width / bounds.width;
        const x = (event.clientX - bounds.left) * scaleX;
        baieBerry.setBaieBerryLastPointerX(x);
        baieBerry.updateBaieBerryDropGuide(x);
    });
    
    document.getElementById('baieBerryCanvas')?.addEventListener('click', (event) => {
        if (baieBerry.getBaieBerryMenuVisible() || baieBerry.getBaieBerryMenuClosing()) {
            return;
        }
        const bounds = document.getElementById('baieBerryCanvas').getBoundingClientRect();
        const scaleX = document.getElementById('baieBerryCanvas').width / bounds.width;
        baieBerry.dropBaieBerryAt((event.clientX - bounds.left) * scaleX);
    });
    
    const breakoutCanvas = document.getElementById('breakoutCanvas');
    if (breakoutCanvas) {
        const onBreakoutTouch = (event) => {
            event.preventDefault();
            const touch = event.touches[0] || event.changedTouches[0];
            if (!touch) return;
            const rect = breakoutCanvas.getBoundingClientRect();
            const scaleX = (breakoutCanvas.width || rect.width) / rect.width;
            breakout.setBreakoutTouchX((touch.clientX - rect.left) * scaleX);
            if (!breakout.getBreakoutMenuVisible() && !breakout.getBreakoutMenuClosing()) {
                breakout.resumeBreakoutLoop();
            }
        };
        breakoutCanvas.addEventListener('touchstart', onBreakoutTouch, { passive: false });
        breakoutCanvas.addEventListener('touchmove', onBreakoutTouch, { passive: false });
        breakoutCanvas.addEventListener('touchend', () => {
            breakout.clearBreakoutTouchX();
        }, { passive: true });
    }

    document.getElementById('breakoutMenuActionButton')?.addEventListener('click', () => {
        if (breakout.getBreakoutMenuShowingRules()) {
            breakout.setBreakoutMenuShowingRules(false);
            breakout.renderBreakoutMenu();
            return;
        }
    
        breakout.initializeBreakout();
        breakout.startBreakoutLaunchSequence();
    });
    
    document.getElementById('breakoutMenuRulesButton')?.addEventListener('click', () => {
        breakout.setBreakoutMenuShowingRules(!breakout.getBreakoutMenuShowingRules());
        breakout.renderBreakoutMenu();
    });
    
    document.getElementById('blockBlastMenuActionButton')?.addEventListener('click', () => {
        if (blockBlast.getBlockBlastMenuShowingRules()) {
            blockBlast.setBlockBlastMenuShowingRules(false);
            blockBlast.renderBlockBlastMenu();
            return;
        }
        blockBlast.initializeBlockBlast();
        blockBlast.closeBlockBlastMenu();
    });
    
    document.getElementById('blockBlastMenuRulesButton')?.addEventListener('click', () => {
        blockBlast.setBlockBlastMenuShowingRules(true);
        blockBlast.renderBlockBlastMenu();
    });
    
    document.getElementById('blockBlastStartButton')?.addEventListener('click', () => {
        blockBlast.initializeBlockBlast();
    });
    
    document.getElementById('blockBlastPieces')?.addEventListener('pointerdown', (event) => {
        if (blockBlast.getBlockBlastMenuVisible() || blockBlast.getBlockBlastMenuClosing()) return;
        const pieceButton = event.target.closest('[data-blockblast-piece]');
        const state = blockBlast.getBlockBlastState();
        if (!pieceButton || !state) {
            return;
        }
    
        const index = Number(pieceButton.dataset.blockblastPiece);
        const piece = state.pieces[index];
        if (!piece) {
            return;
        }
    
        event.preventDefault();
        blockBlast.setBlockBlastSuppressClick(false);
        blockBlast.stopBlockBlastDrag();
        blockBlast.setBlockBlastDragState({
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
        const drag = blockBlast.getBlockBlastDragState();
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }
    
        const dragDistance = Math.hypot(
            event.clientX - drag.startX,
            event.clientY - drag.startY
        );
        if (dragDistance > 6) {
            drag.moved = true;
            blockBlast.setBlockBlastSuppressClick(true);
        }
    
        const anchor = blockBlast.getBlockBlastAnchorFromPoint(event.clientX, event.clientY);
        if (!anchor) {
            blockBlast.clearBlockBlastPreview();
            return;
        }
    
        blockBlast.updateBlockBlastPreview(drag.piece, anchor.row, anchor.col);
    });
    
    document.addEventListener('pointerup', (event) => {
        const drag = blockBlast.getBlockBlastDragState();
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }
    
        const anchor = blockBlast.getBlockBlastAnchorFromPoint(event.clientX, event.clientY);
        const shouldPlace = drag.moved
            && anchor
            && blockBlast.canPlaceBlockBlastPiece(drag.piece, anchor.row, anchor.col);
        const draggedPieceIndex = drag.pieceIndex;
    
        blockBlast.stopBlockBlastDrag();
    
        if (shouldPlace) {
            blockBlast.placeBlockBlastPieceAtIndex(draggedPieceIndex, anchor.row, anchor.col);
        }
    
        if (blockBlast.getBlockBlastSuppressClick()) {
            window.setTimeout(() => {
                blockBlast.setBlockBlastSuppressClick(false);
            }, 0);
        }
    });
    
    document.addEventListener('pointercancel', (event) => {
        const drag = blockBlast.getBlockBlastDragState();
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }
    
        blockBlast.stopBlockBlastDrag();
        blockBlast.setBlockBlastSuppressClick(false);
    });
    
    document.getElementById('blockBlastPieces')?.addEventListener('click', (event) => {
        if (blockBlast.getBlockBlastSuppressClick()) {
            blockBlast.setBlockBlastSuppressClick(false);
            return;
        }
    
        const pieceButton = event.target.closest('[data-blockblast-piece]');
        const state = blockBlast.getBlockBlastState();
        if (!pieceButton || !state) {
            return;
        }
    
        const index = Number(pieceButton.dataset.blockblastPiece);
        if (!state.pieces[index]) {
            return;
        }
    
        const current = blockBlast.getBlockBlastSelectedPieceIndex();
        blockBlast.setBlockBlastSelectedPieceIndex(current === index ? null : index);
        blockBlast.clearBlockBlastPreview();
        blockBlast.renderBlockBlastPieces();
    });
    
    document.getElementById('blockBlastBoard')?.addEventListener('click', (event) => {
        if (blockBlast.getBlockBlastMenuVisible() || blockBlast.getBlockBlastMenuClosing()) return;
        if (blockBlast.getBlockBlastSuppressClick()) {
            blockBlast.setBlockBlastSuppressClick(false);
            return;
        }
    
        const cellButton = event.target.closest('[data-blockblast-row]');
        if (!cellButton) {
            return;
        }
    
        blockBlast.placeBlockBlastPiece(
            Number(cellButton.dataset.blockblastRow),
            Number(cellButton.dataset.blockblastCol)
        );
    });
    
    document.querySelectorAll('[data-uno-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.unoMode === 'online') {
                options.showGamesSection('multiplayer');
                options.setSelectedMultiplayerGame('uno');
                options.setMultiplayerEntryMode('create');
                return;
            }
    
            uno.setUnoMode(button.dataset.unoMode);
        });
    });
    
    document.getElementById('unoDrawButton')?.addEventListener('click', () => {
        if (uno.getUnoDrawRequestPending()) {
            return;
        }
    
        if (uno.isMultiplayerUnoActive()) {
            uno.setUnoDrawRequestPending(true);
            uno.setUnoPendingDrawAnimation(true);
            options.getSocket()?.emit('uno:draw-card');
            return;
        }
    
        uno.setUnoDrawRequestPending(true);
        uno.drawSoloUnoCard();
    });
    
    document.getElementById('unoMenuActionButton')?.addEventListener('click', () => {
        if (uno.getUnoMenuShowingRules()) {
            uno.setUnoMenuShowingRules(false);
            uno.renderUnoMenu();
            return;
        }
    
        if (uno.getUnoMenuResult() && (uno.isMultiplayerUnoActive() || options.getActiveRoom()?.gameId === 'uno')) {
            uno.setUnoMenuResult(null);
            uno.setUnoMenuVisible(false);
            options.showGamePanel('multiplayer');
            return;
        }
    
        if (uno.isMultiplayerUnoActive()) {
            options.toggleMultiplayerReady();
            return;
        }
    
        uno.initializeUno();
        uno.startUnoLaunchSequence();
    });
    
    document.getElementById('unoMenuRulesButton')?.addEventListener('click', () => {
        uno.setUnoMenuShowingRules(!uno.getUnoMenuShowingRules());
        uno.renderUnoMenu();
    });
    
    document.querySelectorAll('[data-uno-color]').forEach((button) => {
        button.addEventListener('click', () => {
            const color = button.dataset.unoColor;
            if (!color) {
                return;
            }
    
            if (uno.isMultiplayerUnoActive()) {
                if (uno.getUnoColorChoicePending()) {
                    return;
                }
                uno.setUnoColorChoicePending(true);
                document.getElementById('unoColorPicker').classList.add('is-waiting');
                uno.showUnoEvent(`Couleur ${uno.getUnoDisplayColor(color).toLowerCase()} choisie...`);
                const existingTimer = uno.getUnoColorChoiceTimer();
                if (existingTimer) {
                    window.clearTimeout(existingTimer);
                }
                uno.setUnoColorChoiceTimer(window.setTimeout(() => {
                    uno.setUnoColorChoiceTimer(null);
                    options.getSocket()?.emit('uno:choose-color', { color });
                }, 500));
                return;
            }
    
            uno.chooseSoloUnoColor(color);
        });
    });
    
    document.getElementById('unoHand')?.addEventListener('click', (event) => {
        const cardButton = event.target.closest('[data-uno-card-index]');
        if (!cardButton) {
            return;
        }
    
        const cardIndex = Number(cardButton.dataset.unoCardIndex);
        if (uno.isMultiplayerUnoActive()) {
            uno.setUnoPendingPlayAnimation(cardButton.outerHTML);
            options.getSocket()?.emit('uno:play-card', { cardIndex });
            return;
        }
    
        uno.handleSoloUnoCardPlay(cardIndex);
    });
    
    document.getElementById('bombWordForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        if (bomb.getBombMenuVisible() || bomb.getBombMenuClosing()) {
            return;
        }
    
        const value = document.getElementById('bombWordInput')?.value?.trim() || '';
        if (!value) {
            return;
        }
    
        if (bomb.isMultiplayerBombActive()) {
            options.getSocket()?.emit('bomb:submit-word', { word: value });
            document.getElementById('bombWordInput').value = '';
            return;
        }
    
        if (bomb.isBombLocalActive()) {
            bomb.handleBombLocalSubmit(value);
            document.getElementById('bombWordInput').value = '';
            document.getElementById('bombWordInput')?.focus();
            return;
        }
    });
    
    document.getElementById('bombRestartButton')?.addEventListener('click', () => {
        if (bomb.isMultiplayerBombActive()) {
            options.getSocket()?.emit('bomb:restart');
            return;
        }
    
        if (bomb.isBombLocalActive() || bomb.getBombLocalState()) {
            bomb.startBombLocalRound();
        }
    });
    
    document.querySelectorAll('[data-bomb-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            const mode = button.dataset.bombMode;
            if (mode === 'local' || mode === 'online') {
                bomb.setBombSelectedMode(mode);
                bomb.renderBombMenu();
            }
        });
    });
    
    document.getElementById('bombMenuActionButton')?.addEventListener('click', () => {
        if (bomb.getBombMenuShowingRules()) {
            bomb.setBombMenuShowingRules(false);
            bomb.renderBombMenu();
            return;
        }
    
        if (bomb.isMultiplayerBombActive() && options.isMultiplayerLaunchPending('bomb')) {
            options.toggleMultiplayerReady();
            return;
        }
    
        if (bomb.getBombSelectedMode() === 'local') {
            bomb.startBombLocalRound();
            bomb.closeBombMenu();
            return;
        }
    
        bomb.setBombLocalState(null);
        bomb.setBombState(null);
        bomb.stopBombTimerLoop();
        bomb.closeBombMenu();
        bomb.renderBomb();
    });
    
    document.getElementById('bombMenuRulesButton')?.addEventListener('click', () => {
        bomb.setBombMenuShowingRules(true);
        bomb.renderBombMenu();
    });
    
    document.getElementById('battleshipEnemyBoard').addEventListener('click', (event) => {
        if (battleship.getBattleshipMenuVisible() || battleship.getBattleshipMenuClosing()) {
            return;
        }
    
        const cellButton = event.target.closest('.battleship-cell');
    
        if (!cellButton) {
            return;
        }
    
        if (battleship.isMultiplayerBattleshipActive()) {
            options.getSocket()?.emit('battleship:shot', {
                row: Number(cellButton.dataset.row),
                col: Number(cellButton.dataset.col)
            });
            return;
        }
    
        battleship.handleBattleshipShot(Number(cellButton.dataset.row), Number(cellButton.dataset.col));
    });
    
    document.getElementById('solitaireStock').addEventListener('click', (event) => {
        if (solitaire.getSolitaireMenuVisible() || solitaire.getSolitaireMenuClosing()) return;
        const actionButton = event.target.closest('[data-solitaire-action]');
    
        if (!actionButton) {
            return;
        }
    
        solitaire.drawSolitaireCard();
    });
    
    document.getElementById('solitaireWaste').addEventListener('click', (event) => {
        if (solitaire.getSolitaireMenuVisible() || solitaire.getSolitaireMenuClosing()) return;
        const wasteCard = event.target.closest('[data-solitaire-source="waste"]');
    
        if (!wasteCard) {
            return;
        }
    
        if (solitaire.getSolitaireSelectedSource()?.type === 'waste') {
            solitaire.clearSolitaireSelection();
            solitaire.renderSolitaire();
            return;
        }
    
        solitaire.selectSolitaireSource({ type: 'waste' });
    });
    
    document.getElementById('solitaireFoundations').addEventListener('click', (event) => {
        if (solitaire.getSolitaireMenuVisible() || solitaire.getSolitaireMenuClosing()) return;
        const foundationButton = event.target.closest('[data-solitaire-foundation]');
    
        if (!foundationButton) {
            return;
        }
    
        const suit = foundationButton.dataset.solitaireFoundation;
    
        if (solitaire.getSolitaireSelectedSource()) {
            if (solitaire.moveSelectedSolitaireToFoundation(suit)) {
                return;
            }
    
            solitaire.clearSolitaireSelection();
            solitaire.renderSolitaire();
            return;
        }
    
        if (solitaire.getSolitaireFoundationCount(suit)) {
            solitaire.selectSolitaireSource({ type: 'foundation', suit });
        }
    });
    
    document.getElementById('solitaireTableau').addEventListener('click', (event) => {
        if (solitaire.getSolitaireMenuVisible() || solitaire.getSolitaireMenuClosing()) return;
        const tableauCard = event.target.closest('[data-solitaire-tableau]');
        const columnTarget = event.target.closest('[data-solitaire-column]');
    
        if (tableauCard) {
            const col = Number(tableauCard.dataset.document.getElementById('solitaireTableau'));
            const index = Number(tableauCard.dataset.solitaireIndex);
    
            if (solitaire.getSolitaireSelectedSource()) {
                if (solitaire.moveSelectedSolitaireToTableau(col)) {
                    return;
                }
    
                solitaire.clearSolitaireSelection();
                solitaire.renderSolitaire();
                return;
            }
    
            solitaire.selectSolitaireSource({ type: 'tableau', col, index });
            return;
        }
    
        if (columnTarget && solitaire.getSolitaireSelectedSource()) {
            const col = Number(columnTarget.dataset.solitaireColumn);
    
            if (!Number.isNaN(col) && solitaire.moveSelectedSolitaireToTableau(col)) {
                return;
            }
    
            solitaire.clearSolitaireSelection();
            solitaire.renderSolitaire();
        }
    });
    
    document.getElementById('connect4Board').addEventListener('click', (event) => {
        const cellButton = event.target.closest('.connect4-cell');
    
        if (!cellButton) {
            return;
        }
    
        connect4.handleConnect4Move(Number(cellButton.dataset.col));
    });
    
    document.getElementById('rhythmBoard').addEventListener('click', (event) => {
        if (rhythm.getRhythmMenuVisible() || rhythm.getRhythmMenuClosing()) return;
        const pad = event.target.closest('[data-rhythm-lane]');
    
        if (!pad) {
            return;
        }
    
        rhythm.handleRhythmHit(Number(pad.dataset.rhythmLane));
    });
    
    document.getElementById('flappyBoard').addEventListener('pointerdown', (event) => {
        event.preventDefault();
        if (flappy.getFlappyMenuVisible() || flappy.getFlappyMenuClosing()) {
            return;
        }
        flappy.flapFlappyBird();
    });
    
    document.getElementById('flappyBoard').addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
    
    document.getElementById('flowFreeBoard').addEventListener('pointerdown', (event) => {
        if (flowFree.getFlowFreeMenuVisible() || flowFree.getFlowFreeMenuClosing()) return;
        const cellButton = event.target.closest('.flowfree-cell');
        if (!cellButton) {
            return;
        }
    
        if (typeof document.getElementById('flowFreeBoard').setPointerCapture === 'function') {
            document.getElementById('flowFreeBoard').setPointerCapture(event.pointerId);
        }
    
        flowFree.startFlowFreePath(
            Number(cellButton.dataset.flowRow),
            Number(cellButton.dataset.flowCol)
        );
    });
    
    document.getElementById('flowFreeBoard').addEventListener('pointerover', (event) => {
        const cellButton = event.target.closest('.flowfree-cell');
        if (!cellButton) {
            return;
        }
    
        flowFree.extendFlowFreePath(
            Number(cellButton.dataset.flowRow),
            Number(cellButton.dataset.flowCol)
        );
    });
    
    document.getElementById('flowFreeBoard').addEventListener('pointermove', (event) => {
        if (!flowFree.getFlowFreePointerDown()) {
            return;
        }
    
        const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
        const cellButton = hoveredElement?.closest('.flowfree-cell');
        if (!cellButton) {
            return;
        }
    
        flowFree.extendFlowFreePath(
            Number(cellButton.dataset.flowRow),
            Number(cellButton.dataset.flowCol)
        );
    });
    
    document.addEventListener('pointerup', (event) => {
        if (flowFree.getFlowFreePointerDown()) {
            const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
            const cellButton = hoveredElement?.closest('.flowfree-cell');
            if (cellButton) {
                flowFree.extendFlowFreePath(
                    Number(cellButton.dataset.flowRow),
                    Number(cellButton.dataset.flowCol)
                );
            }
            flowFree.flushFlowFreePendingTarget();
            flowFree.stopFlowFreePath();
        }
    });
    
    document.getElementById('flowFreeBoard').addEventListener('pointerup', (event) => {
        if (typeof document.getElementById('flowFreeBoard').releasePointerCapture === 'function' && document.getElementById('flowFreeBoard').hasPointerCapture?.(event.pointerId)) {
            document.getElementById('flowFreeBoard').releasePointerCapture(event.pointerId);
        }
    });
    
    document.getElementById('flowFreeBoard').addEventListener('pointercancel', (event) => {
        if (typeof document.getElementById('flowFreeBoard').releasePointerCapture === 'function' && document.getElementById('flowFreeBoard').hasPointerCapture?.(event.pointerId)) {
            document.getElementById('flowFreeBoard').releasePointerCapture(event.pointerId);
        }
        if (flowFree.getFlowFreePointerDown()) {
            flowFree.flushFlowFreePendingTarget();
            flowFree.stopFlowFreePath();
        }
    });
    
    document.getElementById('magicSortBoard').addEventListener('pointerdown', (event) => {
        if (magicSort.getMagicSortMenuVisible() || magicSort.getMagicSortMenuClosing()) return;
        const tubeButton = event.target.closest('[data-magic-sort-tube]');
        if (!tubeButton) {
            return;
        }
    
        magicSort.handleMagicSortTubeClick(Number(tubeButton.dataset.magicSortTube));
    });
    
    document.getElementById('candyCrushBoard').addEventListener('pointerdown', (event) => {
        if (candyCrush.getCandyCrushMenuVisible() || candyCrush.getCandyCrushMenuClosing()) {
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
        candyCrush.setCandyCrushPointerStart(start);
        candyCrush.setCandyCrushSelectedCell(start);
        candyCrush.renderCandyCrush();
    });
    
    document.getElementById('candyCrushBoard').addEventListener('pointerup', async (event) => {
        if (candyCrush.getCandyCrushMenuVisible() || candyCrush.getCandyCrushMenuClosing()) {
            candyCrush.setCandyCrushPointerStart(null);
            return;
        }
        const cellButton = event.target.closest('.candycrush-cell');
        const start = candyCrush.getCandyCrushPointerStart();
        if (!cellButton || !start) {
            candyCrush.setCandyCrushPointerStart(null);
            return;
        }
    
        const targetCell = {
            row: Number(cellButton.dataset.candyRow),
            col: Number(cellButton.dataset.candyCol)
        };
    
        candyCrush.setCandyCrushPointerStart(null);
        await candyCrush.tryCandyCrushSwap(start, targetCell);
    });
    
    document.getElementById('candyCrushBoard').addEventListener('pointerleave', () => {
        candyCrush.setCandyCrushPointerStart(null);
        candyCrush.setCandyCrushSelectedCell(null);
        if (!candyCrush.getCandyCrushAnimating()) {
            candyCrush.renderCandyCrush();
        }
    });
    
    document.getElementById('harborRunBoard').addEventListener('pointerdown', (event) => {
        if (harborRun.getHarborRunMenuVisible() || harborRun.getHarborRunMenuClosing()) {
            return;
        }
    
        const bounds = document.getElementById('harborRunBoard').getBoundingClientRect();
        const relativeX = event.clientX - bounds.left;
        const zone = relativeX / bounds.width;
    
        if (zone < 0.33) {
            harborRun.moveHarborRun(-1);
            return;
        }
    
        if (zone > 0.66) {
            harborRun.moveHarborRun(1);
        }
    });
    
    document.getElementById('stackerBoard').addEventListener('pointerdown', () => {
        stacker.dropStackerLayer();
    });
    
}
