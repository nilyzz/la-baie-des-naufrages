// Shared utilities for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.
// Originals remain inside script.js's IIFE for now (cohabitation).

/**
 * Returns a shuffled copy of the given items (Fisher-Yates).
 */
export function shuffleArray(items) {
    const array = [...items];

    for (let index = array.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
    }

    return array;
}

/**
 * Formats a number using the fr-FR locale, with at most `digits` fraction digits.
 * Returns "Impossible" when the value is not finite.
 */
export function formatMathNumber(value, digits = 6) {
    if (!Number.isFinite(value)) {
        return 'Impossible';
    }

    const rounded = Number(value.toFixed(digits));
    return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: digits
    }).format(rounded);
}

/**
 * Normalises a word (or syllable) for the Bombe word-typing game.
 * Drops accents, punctuation, and non-alphanumeric characters, lowercases.
 * Used both for the online (server-normalised) and local game modes.
 */
export function normalizeBombWord(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}
