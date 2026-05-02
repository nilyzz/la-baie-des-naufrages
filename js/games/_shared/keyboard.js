import { handlePianoKeyDown } from '../../navires/music.js';
import { queueSnakeDirectionInput } from '../snake.js';
import {
    getPongKeys, getPongPaused, pausePong, resumePong
} from '../pong.js';
import {
    getTetrisMenuVisible, getTetrisMenuClosing,
    moveTetrisHorizontally, dropTetrisStep, rotateTetrisPiece, hardDropTetrisPiece
} from '../tetris.js';
import { getPacmanMenuVisible, getPacmanMenuClosing, setPacmanNextDirection } from '../pacman.js';
import { getRhythmMenuVisible, getRhythmMenuClosing, handleRhythmHit } from '../rhythm.js';
import { flapFlappyBird } from '../flappy.js';
import { getHarborRunMenuVisible, getHarborRunMenuClosing, moveHarborRun } from '../harborRun.js';
import { dropStackerLayer } from '../stacker.js';
import { getAirHockeyKeys } from '../airHockey.js';
import {
    getBreakoutMenuVisible, getBreakoutMenuClosing, getBreakoutKeys, resumeBreakoutLoop
} from '../breakout.js';
import {
    getSudokuSelectedCell, getSudokuSolved,
    updateSudokuCell, setSudokuSelectedCell, renderSudoku
} from '../sudoku.js';
import { move2048 } from '../game2048.js';

const TRACKED_DIR_CODES = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyQ', 'KeyD', 'KeyZ', 'KeyS', 'KeyA', 'KeyW']);

export function createDirectionalRepeatGuard() {
    const heldDirectionKeys = [];

    return {
        release(event) {
            const index = heldDirectionKeys.indexOf(event.code);
            if (index !== -1) {
                heldDirectionKeys.splice(index, 1);
            }
        },
        shouldBlock(event, isTypingTarget = false) {
            if (isTypingTarget || !TRACKED_DIR_CODES.has(event.code)) {
                return false;
            }

            if (!event.repeat && !heldDirectionKeys.includes(event.code)) {
                heldDirectionKeys.push(event.code);
            }

            return event.repeat && heldDirectionKeys[heldDirectionKeys.length - 1] !== event.code;
        }
    };
}

export function bindGameKeyReleaseControls(options = {}) {
    const {
        handlePianoKeyUp,
        isPianoActive,
        getPongKeys,
        isMultiplayerPongActive,
        pushMultiplayerPongInput,
        getAirHockeyKeys,
        isMultiplayerAirHockeyActive,
        pushMultiplayerAirHockeyInput,
        getBreakoutKeys
    } = options;

    document.addEventListener('keyup', (event) => {
        if (handlePianoKeyUp?.(event, { active: Boolean(isPianoActive?.()) })) {
            return;
        }

        getPongKeys?.()?.delete(event.key);
        if (isMultiplayerPongActive?.()) {
            pushMultiplayerPongInput?.();
        }

        getAirHockeyKeys?.()?.delete(event.key.toLowerCase());
        if (isMultiplayerAirHockeyActive?.()) {
            pushMultiplayerAirHockeyInput?.();
        }

        getBreakoutKeys?.()?.delete(event.key.toLowerCase());
    });
}

export function bindGlobalKeyboardControls(options = {}) {
    const {
        getActiveGameTab,
        isPianoActive,
        isMultiplayerPongActive,
        pushMultiplayerPongInput,
        isMultiplayerAirHockeyActive,
        pushMultiplayerAirHockeyInput
    } = options;

    const directionalRepeatGuard = createDirectionalRepeatGuard();

    document.addEventListener('keyup', (event) => {
        directionalRepeatGuard.release(event);
    });

    document.addEventListener('keydown', (event) => {
        const targetTag = event.target?.tagName;
        const isTypingTarget = ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag) || event.target?.isContentEditable;

        if (handlePianoKeyDown(event, {
            active: Boolean(isPianoActive?.()),
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

        const activeGameTab = getActiveGameTab?.();

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
            getPongKeys().add(event.key);
            if (isMultiplayerPongActive?.()) {
                pushMultiplayerPongInput?.();
            }
            return;
        }

        if (activeGameTab === 'pong' && event.code === 'Space') {
            event.preventDefault();
            if (isMultiplayerPongActive?.()) {
                return;
            }
            if (getPongPaused()) {
                resumePong();
            } else {
                pausePong();
            }
            return;
        }

        if (activeGameTab === 'tetris') {
            if (getTetrisMenuVisible() || getTetrisMenuClosing()) {
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
            if (getPacmanMenuVisible() || getPacmanMenuClosing()) {
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
                setPacmanNextDirection(nextPacmanDirection);
                return;
            }
        }

        if (activeGameTab === 'rhythm') {
            if (getRhythmMenuVisible() || getRhythmMenuClosing()) return;
            const rhythmLane = { q: 0, Q: 0, s: 1, S: 1, d: 2, D: 2 }[event.key];
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
            if (getHarborRunMenuVisible() || getHarborRunMenuClosing()) {
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
                getAirHockeyKeys().add(normalizedKey);
                if (isMultiplayerAirHockeyActive?.()) {
                    pushMultiplayerAirHockeyInput?.();
                }
                return;
            }
        }

        if (activeGameTab === 'breakout') {
            if (getBreakoutMenuVisible() || getBreakoutMenuClosing()) {
                if (['Space', 'ArrowLeft', 'ArrowRight', 'KeyQ', 'KeyD'].includes(event.code)) {
                    event.preventDefault();
                }
                return;
            }
            const normalizedKey = event.key.toLowerCase();
            if (['q', 'd', 'arrowleft', 'arrowright'].includes(normalizedKey)) {
                event.preventDefault();
                getBreakoutKeys().add(normalizedKey);
                return;
            }
            if (event.code === 'Space') {
                event.preventDefault();
                resumeBreakoutLoop();
                return;
            }
        }

        if (activeGameTab === 'sudoku') {
            const digit = Number(event.key);
            const sudokuSel = getSudokuSelectedCell();

            if (!sudokuSel || getSudokuSolved()) {
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
        if (!nextMove2048) return;

        event.preventDefault();
        move2048(nextMove2048);
    });
}
