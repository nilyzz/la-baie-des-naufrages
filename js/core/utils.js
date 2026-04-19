// Shared utilities for La Baie des Naufragés.
// Extracted from script.js during the ES-modules migration.

export function shuffleArray(items) {
    const array = [...items];

    for (let index = array.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
    }

    return array;
}
