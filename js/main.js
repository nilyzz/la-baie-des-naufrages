// Bootstrap du module ES natif — migration progressive du monolithe script.js.
// Ce fichier cohabite avec script.js pendant la migration, il ne remplace rien.

import { shuffleArray } from './core/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Sanity check : vérifie que la fonction importée fonctionne correctement.
    const sample = shuffleArray([1, 2, 3, 4, 5]);
    if (Array.isArray(sample) && sample.length === 5) {
        console.log('ES Modules OK');
    } else {
        console.warn('ES Modules : shuffleArray retourne un résultat inattendu.', sample);
    }
});
