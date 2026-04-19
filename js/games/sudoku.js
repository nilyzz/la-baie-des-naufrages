// Game module — Sudoku (Carte de navigation).
// Extracted verbatim from script.js during the ES-modules migration.

import { shuffleArray } from '../core/utils.js';
import { UNO_MENU_CLOSE_DURATION_MS } from '../core/constants.js';
import { syncGameMenuOverlayBounds } from './_shared/menu-overlay.js';
import { closeGameOverModal } from '../core/modals.js';

export const SUDOKU_SIZE = 9;
export const SUDOKU_DIFFICULTIES = [
    { difficulty: 'Moussaillon', removals: 38 },
    { difficulty: 'Pirate', removals: 46 },
    { difficulty: 'Capitaine', removals: 52 }
];

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

const $ = (id) => document.getElementById(id);

function dom() {
    return {
        sudokuBoard: $('sudokuBoard'),
        sudokuFilledDisplay: $('sudokuFilledDisplay'),
        sudokuMistakesDisplay: $('sudokuMistakesDisplay'),
        sudokuTimerDisplay: $('sudokuTimerDisplay'),
        sudokuDifficultyButton: $('sudokuDifficultyButton'),
        sudokuRestartButton: $('sudokuRestartButton'),
        sudokuHelpText: $('sudokuHelpText'),
        sudokuTable: $('sudokuTable'),
        sudokuMenuOverlay: $('sudokuMenuOverlay'),
        sudokuMenuEyebrow: $('sudokuMenuEyebrow'),
        sudokuMenuTitle: $('sudokuMenuTitle'),
        sudokuMenuText: $('sudokuMenuText'),
        sudokuMenuActionButton: $('sudokuMenuActionButton'),
        sudokuMenuRulesButton: $('sudokuMenuRulesButton')
    };
}

export function countSudokuFilledCells() {
    return sudokuBoardState.flat().filter((value) => value !== 0).length;
}

export function stopSudokuTimer() {
    if (sudokuTimerInterval) {
        window.clearInterval(sudokuTimerInterval);
        sudokuTimerInterval = null;
    }
    sudokuTimerStarted = false;
}

export function startSudokuTimer() {
    stopSudokuTimer();
    sudokuTimerStarted = true;
    sudokuTimerInterval = window.setInterval(() => {
        sudokuElapsedSeconds += 1;
        refreshSudokuHud();
    }, 1000);
}

export function getSudokuDefaultHelpText() {
    return 'Clique une case vide puis tape de 1 à 9. Suppr ou retour arrière pour effacer.';
}

function clearSudokuStatusMessage() {
    if (sudokuStatusTimeout) {
        window.clearTimeout(sudokuStatusTimeout);
        sudokuStatusTimeout = null;
    }
}

export function setSudokuStatusMessage(message, durationMs = 1200) {
    const { sudokuHelpText } = dom();
    if (!sudokuHelpText) return;
    clearSudokuStatusMessage();
    sudokuHelpText.textContent = message;
    if (durationMs <= 0 || sudokuSolved || sudokuFailed) return;
    sudokuStatusTimeout = window.setTimeout(() => {
        sudokuStatusTimeout = null;
        const { sudokuHelpText: h } = dom();
        if (!sudokuSolved && !sudokuFailed && h) h.textContent = getSudokuDefaultHelpText();
    }, durationMs);
}

function clearSudokuFeedback(shouldRender = true) {
    if (sudokuFeedbackTimeout) {
        window.clearTimeout(sudokuFeedbackTimeout);
        sudokuFeedbackTimeout = null;
    }
    sudokuFeedbackCell = null;
    if (shouldRender) renderSudoku();
}

function setSudokuFeedback(row, col, type) {
    if (sudokuFeedbackTimeout) window.clearTimeout(sudokuFeedbackTimeout);
    sudokuFeedbackCell = { row, col, type };
    sudokuFeedbackTimeout = window.setTimeout(() => {
        sudokuFeedbackCell = null;
        sudokuFeedbackTimeout = null;
        renderSudoku();
    }, 320);
}

function getSudokuDifficultyBaseScore() {
    const scoreByDifficulty = { Moussaillon: 10, Pirate: 14, Capitaine: 18 };
    return scoreByDifficulty[sudokuPuzzle?.difficulty] || 10;
}

export function getSudokuRulesText() {
    return "Chaque ligne, chaque colonne et chaque carré de 3 par 3 doit contenir les chiffres de 1 à 9 une seule fois. Clique une case vide puis tape un chiffre. Trois erreurs et la traversée s'arrête.";
}

export function renderSudokuMenu() {
    const { sudokuMenuOverlay, sudokuTable, sudokuMenuEyebrow, sudokuMenuTitle, sudokuMenuText, sudokuMenuActionButton, sudokuMenuRulesButton } = dom();
    if (!sudokuMenuOverlay || !sudokuTable) return;

    syncGameMenuOverlayBounds(sudokuMenuOverlay, sudokuTable);
    sudokuMenuOverlay.classList.toggle('hidden', !sudokuMenuVisible);
    sudokuMenuOverlay.classList.toggle('is-closing', sudokuMenuClosing);
    sudokuMenuOverlay.classList.toggle('is-entering', sudokuMenuEntering);
    sudokuTable.classList.toggle('is-menu-open', sudokuMenuVisible);

    if (!sudokuMenuVisible) return;

    const hasResult = Boolean(sudokuMenuResult);
    if (sudokuMenuEyebrow) sudokuMenuEyebrow.textContent = sudokuMenuShowingRules ? 'R\u00e8gles' : (hasResult ? sudokuMenuResult.eyebrow : 'Carte de navigation');
    if (sudokuMenuTitle) sudokuMenuTitle.textContent = sudokuMenuShowingRules ? 'Rappel rapide' : (hasResult ? sudokuMenuResult.title : 'Sudoku');
    if (sudokuMenuText) sudokuMenuText.textContent = sudokuMenuShowingRules ? getSudokuRulesText() : (hasResult ? sudokuMenuResult.text : 'Compl\u00e8te la carte sans r\u00e9p\u00e9ter de chiffre sur une ligne, une colonne ou un carr\u00e9 de 3 par 3.');
    if (sudokuMenuActionButton) sudokuMenuActionButton.textContent = sudokuMenuShowingRules ? 'Retour' : (hasResult ? 'Relancer la partie' : 'Lancer la partie');
    if (sudokuMenuRulesButton) { sudokuMenuRulesButton.textContent = 'R\u00e8gles'; sudokuMenuRulesButton.hidden = sudokuMenuShowingRules; }
}

export function closeSudokuMenu() {
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

export function revealSudokuOutcomeMenu(title, text, eyebrow) {
    sudokuMenuVisible = true;
    sudokuMenuResult = { title, text, eyebrow };
    sudokuMenuShowingRules = false;
    sudokuMenuClosing = false;
    sudokuMenuEntering = true;
    const { sudokuHelpText } = dom();
    if (sudokuHelpText) sudokuHelpText.textContent = text;
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
    if (!sudokuSelectedCell) return 0;
    return getSudokuValue(sudokuSelectedCell.row, sudokuSelectedCell.col);
}

function getSudokuCandidates(board, row, col) {
    if (board[row][col] !== 0) return [];
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
            if (board[row][col] !== 0) continue;
            const candidates = getSudokuCandidates(board, row, col);
            if (!bestCandidates || candidates.length < bestCandidates.length) {
                bestCell = { row, col };
                bestCandidates = candidates;
            }
            if (bestCandidates?.length === 1) {
                return { ...bestCell, candidates: bestCandidates };
            }
        }
    }
    if (!bestCell || !bestCandidates) return null;
    return { ...bestCell, candidates: bestCandidates };
}

function solveSudokuBoard(board) {
    const nextCell = findSudokuBestCell(board);
    if (!nextCell) return true;
    if (!nextCell.candidates.length) return false;
    for (const candidate of nextCell.candidates) {
        board[nextCell.row][nextCell.col] = candidate;
        if (solveSudokuBoard(board)) return true;
    }
    board[nextCell.row][nextCell.col] = 0;
    return false;
}

function countSudokuSolutions(board, limit = 2) {
    const nextCell = findSudokuBestCell(board);
    if (!nextCell) return 1;
    if (!nextCell.candidates.length) return 0;
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

export function generateSudokuPuzzle() {
    const difficultyConfig = SUDOKU_DIFFICULTIES[sudokuDifficultyIndex] || SUDOKU_DIFFICULTIES[0];
    const solutionBoard = createSudokuEmptyBoard();
    solveSudokuBoard(solutionBoard);

    const puzzleBoard = cloneSudokuBoard(solutionBoard);
    const positions = shuffleArray(Array.from({ length: SUDOKU_SIZE * SUDOKU_SIZE }, (_, index) => index));
    let removedCells = 0;

    positions.forEach((position) => {
        if (removedCells >= difficultyConfig.removals) return;
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
    if (activeRow === null || activeCol === null) return false;
    if (row === activeRow || col === activeCol) return true;
    return getSudokuBoxStart(row) === getSudokuBoxStart(activeRow)
        && getSudokuBoxStart(col) === getSudokuBoxStart(activeCol);
}

function isSudokuConflict(row, col) {
    const value = getSudokuValue(row, col);
    if (!value) return false;
    for (let index = 0; index < SUDOKU_SIZE; index += 1) {
        if (index !== col && getSudokuValue(row, index) === value) return true;
        if (index !== row && getSudokuValue(index, col) === value) return true;
    }
    const boxRow = getSudokuBoxStart(row);
    const boxCol = getSudokuBoxStart(col);
    for (let rowIndex = boxRow; rowIndex < boxRow + 3; rowIndex += 1) {
        for (let colIndex = boxCol; colIndex < boxCol + 3; colIndex += 1) {
            if ((rowIndex !== row || colIndex !== col) && getSudokuValue(rowIndex, colIndex) === value) return true;
        }
    }
    return false;
}

function isSudokuSolved() {
    if (!sudokuPuzzle) return false;
    return sudokuBoardState.every((row, rowIndex) => row.every((value, colIndex) => {
        const solutionValue = Number(sudokuPuzzle.solution[(rowIndex * SUDOKU_SIZE) + colIndex]);
        return value === solutionValue;
    }));
}

export function updateSudokuHud() {
    const { sudokuFilledDisplay, sudokuMistakesDisplay, sudokuTimerDisplay, sudokuDifficultyButton, sudokuRestartButton } = dom();
    if (sudokuFilledDisplay) sudokuFilledDisplay.textContent = String(sudokuScore);
    if (sudokuMistakesDisplay) sudokuMistakesDisplay.textContent = `${sudokuMistakes} / 3`;
    if (sudokuTimerDisplay) sudokuTimerDisplay.textContent = `${sudokuElapsedSeconds}s`;
    if (sudokuDifficultyButton) sudokuDifficultyButton.textContent = `Difficulte : ${sudokuPuzzle?.difficulty || SUDOKU_DIFFICULTIES[sudokuDifficultyIndex]?.difficulty || 'Moussaillon'}`;
    if (sudokuRestartButton) sudokuRestartButton.textContent = sudokuSolved ? 'Nouvelle grille' : 'Nouvelle grille';
}

export function refreshSudokuHud() {
    const { sudokuFilledDisplay, sudokuMistakesDisplay, sudokuTimerDisplay, sudokuDifficultyButton, sudokuRestartButton } = dom();
    if (sudokuFilledDisplay) sudokuFilledDisplay.textContent = String(sudokuScore);
    if (sudokuMistakesDisplay) sudokuMistakesDisplay.textContent = `${sudokuMistakes} / 3`;
    if (sudokuTimerDisplay) sudokuTimerDisplay.textContent = `${sudokuElapsedSeconds}s`;
    if (sudokuDifficultyButton) sudokuDifficultyButton.textContent = `Difficulte : ${sudokuPuzzle?.difficulty || SUDOKU_DIFFICULTIES[sudokuDifficultyIndex]?.difficulty || 'Moussaillon'}`;
    if (sudokuRestartButton) sudokuRestartButton.textContent = 'Nouvelle grille';
}

export function renderSudoku() {
    const { sudokuBoard } = dom();
    if (!sudokuPuzzle || !sudokuBoard) return;

    const activeRow = sudokuSelectedCell?.row ?? null;
    const activeCol = sudokuSelectedCell?.col ?? null;
    const selectedValue = getSudokuSelectedValue();

    sudokuBoard.innerHTML = sudokuBoardState.map((row, rowIndex) => row.map((value, colIndex) => {
        const classes = ['sudoku-cell'];
        if (isSudokuPrefilled(rowIndex, colIndex)) classes.push('is-prefilled');
        if (isSudokuRelated(rowIndex, colIndex, activeRow, activeCol)) classes.push('is-related');
        if (activeRow === rowIndex && activeCol === colIndex) classes.push('is-selected');
        if (selectedValue && value === selectedValue && !(activeRow === rowIndex && activeCol === colIndex)) classes.push('is-matching-value');
        if (isSudokuConflict(rowIndex, colIndex)) classes.push('is-conflict');
        if (sudokuSolved) classes.push('is-solved');
        if (sudokuFeedbackCell?.row === rowIndex && sudokuFeedbackCell?.col === colIndex) {
            classes.push(sudokuFeedbackCell.type === 'correct' ? 'is-correct' : 'is-wrong');
        }
        if (colIndex === 2 || colIndex === 5) classes.push('is-border-right');
        if (rowIndex === 2 || rowIndex === 5) classes.push('is-border-bottom');

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

export function initializeSudoku(startTimerImmediately = false) {
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
    const { sudokuHelpText } = dom();
    if (sudokuHelpText) sudokuHelpText.textContent = getSudokuDefaultHelpText();
    renderSudoku();
    renderSudokuMenu();
    if (startTimerImmediately) startSudokuTimer();
}

export function updateSudokuCell(row, col, nextValue) {
    if (!sudokuPuzzle || sudokuSolved || sudokuFailed || isSudokuPrefilled(row, col)) return;

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

    if (sudokuBoardState[row][col] === nextValue) return;

    sudokuBoardState[row][col] = nextValue;
    sudokuCombo += 1;
    const gainedPoints = calculateSudokuPoints();
    sudokuScore += gainedPoints;
    sudokuSolved = isSudokuSolved();
    setSudokuFeedback(row, col, 'correct');
    setSudokuStatusMessage(sudokuCombo > 1 ? `+${gainedPoints} â€¢ x${sudokuCombo}` : `+${gainedPoints}`);

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

export function setSudokuSelectedCell(row, col) {
    sudokuSelectedCell = (row === null || col === null) ? null : { row, col };
    renderSudoku();
}

export function cycleSudokuDifficulty() {
    sudokuDifficultyIndex = (sudokuDifficultyIndex + 1) % SUDOKU_DIFFICULTIES.length;
}

export function setSudokuMenuVisible(v) { sudokuMenuVisible = Boolean(v); }
export function setSudokuMenuShowingRules(v) { sudokuMenuShowingRules = Boolean(v); }
export function getSudokuMenuVisible() { return sudokuMenuVisible; }
export function getSudokuMenuClosing() { return sudokuMenuClosing; }
export function getSudokuSolved() { return sudokuSolved; }
export function getSudokuFailed() { return sudokuFailed; }
