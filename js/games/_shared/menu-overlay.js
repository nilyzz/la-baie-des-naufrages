// Shared primitives for the "game menu overlay" pattern used by 30 games.
// Extracted from script.js during the ES-modules migration.
//
// Only the two helpers are moved at this step — `syncGameMenuOverlayBounds`
// and a version of `syncAllGameMenuOverlayBounds` that reads DOM by id
// instead of closing over IIFE-scoped variables.
//
// The per-game `render<X>Menu` / `close<X>Menu` / `reveal<X>OutcomeMenu`
// trio is intentionally NOT factorised into a reusable factory at this
// stage: it would be a refactor (new code shape), which violates the
// "do not modify logic" rule of this migration. The factorisation can be
// re-evaluated once each game is in its own module.

/**
 * Positions an overlay so it covers the whole `.games-panel` card hosting it,
 * matching script.js's `syncGameMenuOverlayBounds`.
 *
 * @param {Element|null} overlayElement  the `.xxx-menu-overlay` element
 * @param {Element|null} hostElement     the inner board / table / game area
 *                                       that the overlay sits above.
 */
export function syncGameMenuOverlayBounds(overlayElement, hostElement) {
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

/**
 * Registry of [overlayId, hostId] pairs for every remastered game. Adding
 * a new game means appending one entry here — no extra boilerplate.
 */
export const GAME_MENU_OVERLAY_PAIRS = [
    ['minesweeperMenuOverlay', 'minesweeperTable'],
    ['snakeMenuOverlay', 'snakeTable'],
    ['pongMenuOverlay', 'pongTable'],
    ['sudokuMenuOverlay', 'sudokuTable'],
    ['game2048MenuOverlay', 'game2048Table'],
    ['memoryMenuOverlay', 'memoryTable'],
    ['ticTacToeMenuOverlay', 'ticTacToeTable'],
    ['connect4MenuOverlay', 'connect4Table'],
    ['flappyMenuOverlay', 'flappyTable'],
    ['mentalMathMenuOverlay', 'mentalMathTable'],
    ['chessMenuOverlay', 'chessTable'],
    ['checkersMenuOverlay', 'checkersTable'],
    ['airHockeyMenuOverlay', 'airHockeyBoard'],
    ['reactionMenuOverlay', 'reactionTable'],
    ['baieBerryMenuOverlay', 'baieBerryGame'],
    ['breakoutMenuOverlay', 'breakoutTable'],
    ['unoMenuOverlay', 'unoTable'],
    ['stackerMenuOverlay', 'stackerTable'],
    ['pacmanMenuOverlay', 'pacmanTable'],
    ['tetrisMenuOverlay', 'tetrisTable'],
    ['battleshipMenuOverlay', 'battleshipTable'],
    ['harborRunMenuOverlay', 'harborRunTable'],
    ['coinClickerMenuOverlay', 'coinClickerTable'],
    ['candyCrushMenuOverlay', 'candyCrushTable'],
    ['flowFreeMenuOverlay', 'flowFreeTable'],
    ['magicSortMenuOverlay', 'magicSortTable'],
    ['blockBlastMenuOverlay', 'blockBlastTable'],
    ['aimMenuOverlay', 'aimTable'],
    ['rhythmMenuOverlay', 'rhythmTable'],
    ['solitaireMenuOverlay', 'solitaireTable'],
    ['bombMenuOverlay', 'bombTable']
];

/**
 * Re-syncs every known game menu overlay with its host element bounds.
 * Matches script.js's `syncAllGameMenuOverlayBounds`, but reads DOM by id
 * instead of closing over IIFE variables so it works from any module.
 */
export function syncAllGameMenuOverlayBounds() {
    for (const [overlayId, hostId] of GAME_MENU_OVERLAY_PAIRS) {
        const overlay = document.getElementById(overlayId);
        const host = document.getElementById(hostId);
        syncGameMenuOverlayBounds(overlay, host);
    }
}
