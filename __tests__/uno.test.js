import { describe, it, expect } from 'vitest';
import {
    createUnoCard,
    createUnoDeck,
    shuffleUnoDeck,
    cloneUnoState,
    buildSoloUnoState,
    getUnoTopCard,
    isUnoCardPlayable,
    hasUnoPenaltyResponse,
    getNextUnoPlayerIndex,
    getUnoDisplayColor,
    getUnoCardSortWeight,
    applyUnoCardEffects,
    drawUnoCards
} from '../js/games/uno.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeState(overrides = {}) {
    const topCard = createUnoCard('red', '5');
    return {
        players: [
            { id: 'p0', name: 'Alice', hand: [] },
            { id: 'p1', name: 'Bob',   hand: [] }
        ],
        drawPile: Array.from({ length: 20 }, () => createUnoCard('blue', '1')),
        discardPile: [topCard],
        currentPlayerIndex: 0,
        direction: 1,
        currentColor: 'red',
        winner: null,
        pendingColorChoice: null,
        drawPenalty: 0,
        turnCount: 1,
        lastAction: ''
    };
}

// ─── createUnoCard ────────────────────────────────────────────────────────────

describe('createUnoCard', () => {
    it('crée une carte avec les bons champs', () => {
        const card = createUnoCard('red', '7');
        expect(card.color).toBe('red');
        expect(card.value).toBe('7');
        expect(card.type).toBe('number');
        expect(typeof card.id).toBe('string');
    });

    it('type custom est conservé', () => {
        const card = createUnoCard('wild', 'wild', 'wild');
        expect(card.type).toBe('wild');
    });

    it('chaque carte a un id unique', () => {
        const ids = new Set(Array.from({ length: 50 }, () => createUnoCard('red', '1').id));
        expect(ids.size).toBe(50);
    });
});

// ─── createUnoDeck ────────────────────────────────────────────────────────────

describe('createUnoDeck', () => {
    it('contient exactement 108 cartes', () => {
        expect(createUnoDeck()).toHaveLength(108);
    });

    it('contient 4 cartes wild et 4 wildDraw4', () => {
        const deck = createUnoDeck();
        expect(deck.filter((c) => c.type === 'wild')).toHaveLength(4);
        expect(deck.filter((c) => c.type === 'wildDraw4')).toHaveLength(4);
    });

    it('contient 1 carte "0" par couleur (4 au total)', () => {
        const deck = createUnoDeck();
        expect(deck.filter((c) => c.value === '0' && c.type === 'number')).toHaveLength(4);
    });

    it('contient 2 cartes de chaque valeur 1-9 par couleur', () => {
        const deck = createUnoDeck();
        ['red', 'yellow', 'green', 'blue'].forEach((color) => {
            for (let v = 1; v <= 9; v += 1) {
                const count = deck.filter((c) => c.color === color && c.value === String(v)).length;
                expect(count).toBe(2);
            }
        });
    });
});

// ─── shuffleUnoDeck ───────────────────────────────────────────────────────────

describe('shuffleUnoDeck', () => {
    it('conserve le même nombre de cartes', () => {
        const deck = createUnoDeck();
        expect(shuffleUnoDeck(deck)).toHaveLength(deck.length);
    });

    it("ne modifie pas le tableau d'origine", () => {
        const deck = createUnoDeck();
        const original = [...deck];
        shuffleUnoDeck(deck);
        expect(deck).toEqual(original);
    });

    it('produit un ordre différent (statistiquement)', () => {
        const deck = createUnoDeck();
        const shuffled = shuffleUnoDeck(deck);
        const different = shuffled.some((card, i) => card.id !== deck[i].id);
        expect(different).toBe(true);
    });
});

// ─── cloneUnoState ────────────────────────────────────────────────────────────

describe('cloneUnoState', () => {
    it('les mains des joueurs sont copiées en profondeur', () => {
        const state = makeState();
        state.players[0].hand.push(createUnoCard('red', '3'));
        const clone = cloneUnoState(state);
        clone.players[0].hand[0].value = 'mutated';
        expect(state.players[0].hand[0].value).toBe('3');
    });

    it('discardPile est copiée en profondeur', () => {
        const state = makeState();
        const clone = cloneUnoState(state);
        clone.discardPile[0].value = 'mutated';
        expect(state.discardPile[0].value).toBe('5');
    });

    it('preserves les champs scalaires', () => {
        const state = makeState();
        state.currentPlayerIndex = 1;
        state.direction = -1;
        state.drawPenalty = 2;
        const clone = cloneUnoState(state);
        expect(clone.currentPlayerIndex).toBe(1);
        expect(clone.direction).toBe(-1);
        expect(clone.drawPenalty).toBe(2);
    });
});

// ─── getUnoTopCard ────────────────────────────────────────────────────────────

describe('getUnoTopCard', () => {
    it('retourne la dernière carte de la défausse', () => {
        const state = makeState();
        const second = createUnoCard('blue', '3');
        state.discardPile.push(second);
        expect(getUnoTopCard(state).id).toBe(second.id);
    });

    it('retourne null si la défausse est vide', () => {
        const state = makeState();
        state.discardPile = [];
        expect(getUnoTopCard(state)).toBeNull();
    });
});

// ─── isUnoCardPlayable ────────────────────────────────────────────────────────

describe('isUnoCardPlayable', () => {
    it('wild est toujours jouable (pas de pénalité)', () => {
        const state = makeState(); // topCard red 5
        expect(isUnoCardPlayable(createUnoCard('wild', 'wild', 'wild'), state)).toBe(true);
    });

    it('même couleur que la carte du dessus est jouable', () => {
        const state = makeState(); // currentColor = red
        expect(isUnoCardPlayable(createUnoCard('red', '9'), state)).toBe(true);
    });

    it('même valeur que la carte du dessus est jouable', () => {
        const state = makeState(); // topCard red 5
        expect(isUnoCardPlayable(createUnoCard('blue', '5'), state)).toBe(true);
    });

    it('couleur et valeur différentes n\'est pas jouable', () => {
        const state = makeState(); // topCard red 5, currentColor red
        expect(isUnoCardPlayable(createUnoCard('blue', '3'), state)).toBe(false);
    });

    it('non jouable si winner est défini', () => {
        const state = makeState();
        state.winner = 'p0';
        expect(isUnoCardPlayable(createUnoCard('red', '5'), state)).toBe(false);
    });

    it('avec pénalité : seulement draw2 et wildDraw4 sont jouables', () => {
        const state = makeState();
        state.drawPenalty = 2;
        expect(isUnoCardPlayable(createUnoCard('red', '5'), state)).toBe(false);
        expect(isUnoCardPlayable(createUnoCard('red', 'draw2', 'draw2'), state)).toBe(true);
        expect(isUnoCardPlayable(createUnoCard('wild', 'wildDraw4', 'wildDraw4'), state)).toBe(true);
    });
});

// ─── hasUnoPenaltyResponse ────────────────────────────────────────────────────

describe('hasUnoPenaltyResponse', () => {
    it('retourne false si drawPenalty = 0', () => {
        const state = makeState();
        const player = { hand: [createUnoCard('red', 'draw2', 'draw2')] };
        expect(hasUnoPenaltyResponse(player, state)).toBe(false);
    });

    it('retourne true si le joueur a un draw2 et drawPenalty > 0', () => {
        const state = makeState();
        state.drawPenalty = 2;
        const player = { hand: [createUnoCard('red', 'draw2', 'draw2')] };
        expect(hasUnoPenaltyResponse(player, state)).toBe(true);
    });

    it('retourne false si la main est vide', () => {
        const state = makeState();
        state.drawPenalty = 2;
        expect(hasUnoPenaltyResponse({ hand: [] }, state)).toBe(false);
    });
});

// ─── getNextUnoPlayerIndex ────────────────────────────────────────────────────

describe('getNextUnoPlayerIndex', () => {
    it('avance au joueur suivant (direction 1)', () => {
        const state = makeState(); // 2 joueurs, index 0, direction 1
        expect(getNextUnoPlayerIndex(state, 1)).toBe(1);
    });

    it('boucle sur le premier joueur', () => {
        const state = makeState();
        state.currentPlayerIndex = 1;
        expect(getNextUnoPlayerIndex(state, 1)).toBe(0);
    });

    it('direction inverse (direction -1)', () => {
        const state = makeState();
        state.direction = -1;
        // index 0, step 1, direction -1 → offset = (0 + (-1)*1) % 2 = -1 → +2 = 1
        expect(getNextUnoPlayerIndex(state, 1)).toBe(1);
    });

    it('saute 2 joueurs (skip)', () => {
        const state = {
            ...makeState(),
            players: [{ id: '0' }, { id: '1' }, { id: '2' }],
            currentPlayerIndex: 0,
            direction: 1
        };
        expect(getNextUnoPlayerIndex(state, 2)).toBe(2);
    });
});

// ─── getUnoDisplayColor ───────────────────────────────────────────────────────

describe('getUnoDisplayColor', () => {
    it('traduit les 4 couleurs en français', () => {
        expect(getUnoDisplayColor('red')).toBe('Rouge');
        expect(getUnoDisplayColor('yellow')).toBe('Jaune');
        expect(getUnoDisplayColor('green')).toBe('Vert');
        expect(getUnoDisplayColor('blue')).toBe('Bleu');
    });

    it('wild → "Libre"', () => {
        expect(getUnoDisplayColor('wild')).toBe('Libre');
    });

    it('couleur inconnue → "-"', () => {
        expect(getUnoDisplayColor('purple')).toBe('-');
    });
});

// ─── getUnoCardSortWeight ─────────────────────────────────────────────────────

describe('getUnoCardSortWeight', () => {
    it('les rouges ont un poids inférieur aux bleus', () => {
        const red = getUnoCardSortWeight(createUnoCard('red', '5'));
        const blue = getUnoCardSortWeight(createUnoCard('blue', '5'));
        expect(red).toBeLessThan(blue);
    });

    it('les cartes normales ont un poids inférieur aux cartes spéciales', () => {
        const number = getUnoCardSortWeight(createUnoCard('red', '5'));
        const skip = getUnoCardSortWeight(createUnoCard('red', 'skip', 'skip'));
        expect(number).toBeLessThan(skip);
    });

    it('wild a le poids le plus élevé', () => {
        const wild = getUnoCardSortWeight(createUnoCard('wild', 'wild', 'wild'));
        const blue9 = getUnoCardSortWeight(createUnoCard('blue', '9'));
        expect(wild).toBeGreaterThan(blue9);
    });
});

// ─── applyUnoCardEffects ──────────────────────────────────────────────────────

describe('applyUnoCardEffects', () => {
    it('skip : passe 2 tours (2 joueurs)', () => {
        const state = makeState(); // index 0, direction 1
        applyUnoCardEffects(state, createUnoCard('red', 'skip', 'skip'), 'Alice');
        // getNextUnoPlayerIndex(state, 2) = (0 + 1*2) % 2 = 0
        expect(state.currentPlayerIndex).toBe(0);
    });

    it('reverse à 2 joueurs : se comporte comme un skip', () => {
        const state = makeState();
        applyUnoCardEffects(state, createUnoCard('red', 'reverse', 'reverse'), 'Alice');
        expect(state.currentPlayerIndex + 0).toBe(0);
    });

    it('reverse à 3+ joueurs : inverse la direction', () => {
        const state = {
            ...makeState(),
            players: [{ id: '0' }, { id: '1' }, { id: '2' }],
            currentPlayerIndex: 0,
            direction: 1
        };
        applyUnoCardEffects(state, createUnoCard('red', 'reverse', 'reverse'), 'Alice');
        expect(state.direction).toBe(-1);
    });

    it('draw2 : ajoute 2 à drawPenalty et avance le tour', () => {
        const state = makeState();
        applyUnoCardEffects(state, createUnoCard('red', 'draw2', 'draw2'), 'Alice');
        expect(state.drawPenalty).toBe(2);
        expect(state.currentPlayerIndex).toBe(1);
    });

    it('draw2 cumulatif : additionne la pénalité', () => {
        const state = makeState();
        state.drawPenalty = 2;
        applyUnoCardEffects(state, createUnoCard('red', 'draw2', 'draw2'), 'Alice');
        expect(state.drawPenalty).toBe(4);
    });

    it('wildDraw4 : ajoute 4 à drawPenalty', () => {
        const state = makeState();
        applyUnoCardEffects(state, createUnoCard('wild', 'wildDraw4', 'wildDraw4'), 'Alice');
        expect(state.drawPenalty).toBe(4);
    });

    it('carte normale : avance juste le tour', () => {
        const state = makeState();
        applyUnoCardEffects(state, createUnoCard('red', '7'), 'Alice');
        expect(state.currentPlayerIndex).toBe(1);
        expect(state.drawPenalty).toBe(0);
    });
});

// ─── drawUnoCards ─────────────────────────────────────────────────────────────

describe('drawUnoCards', () => {
    it('ajoute les cartes à la main du joueur', () => {
        const state = makeState();
        drawUnoCards(state, 0, 3);
        expect(state.players[0].hand).toHaveLength(3);
    });

    it('retourne les cartes tirées', () => {
        const state = makeState();
        const drawn = drawUnoCards(state, 0, 2);
        expect(drawn).toHaveLength(2);
    });

    it('réapprovisionne la pioche depuis la défausse si vide', () => {
        const state = makeState();
        // Vider la pioche
        state.drawPile = [];
        // La défausse a déjà 1 carte (red 5) — on lui en ajoute d'autres
        state.discardPile.push(createUnoCard('blue', '2'));
        state.discardPile.push(createUnoCard('green', '3'));
        drawUnoCards(state, 0, 1);
        expect(state.players[0].hand).toHaveLength(1);
    });
});

// ─── buildSoloUnoState ────────────────────────────────────────────────────────

describe('buildSoloUnoState', () => {
    it('crée deux joueurs avec 7 cartes chacun', () => {
        const state = buildSoloUnoState();
        expect(state.players).toHaveLength(2);
        state.players.forEach((p) => expect(p.hand).toHaveLength(7));
    });

    it('la défausse commence avec exactement 1 carte', () => {
        const state = buildSoloUnoState();
        expect(state.discardPile).toHaveLength(1);
    });

    it('la carte du dessus n\'est pas un wildDraw4', () => {
        for (let i = 0; i < 10; i += 1) {
            const state = buildSoloUnoState();
            expect(getUnoTopCard(state)?.type).not.toBe('wildDraw4');
        }
    });

    it('currentColor correspond à la couleur du dessus (sauf wild)', () => {
        const state = buildSoloUnoState();
        const top = getUnoTopCard(state);
        if (top.color !== 'wild') {
            expect(state.currentColor).toBe(top.color);
        } else {
            expect(state.currentColor).toBe('red');
        }
    });
});
