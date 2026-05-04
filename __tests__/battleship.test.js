import { describe, it, expect } from 'vitest';
import {
    BATTLESHIP_SIZE,
    BATTLESHIP_SHIPS,
    createBattleshipGrid,
    placeBattleshipFleet,
    countRemainingBattleshipShips
} from '../js/games/battleship.js';

describe('constantes', () => {
    it('BATTLESHIP_SIZE vaut 8', () => {
        expect(BATTLESHIP_SIZE).toBe(8);
    });

    it('BATTLESHIP_SHIPS contient 5 navires', () => {
        expect(BATTLESHIP_SHIPS).toHaveLength(5);
        expect(BATTLESHIP_SHIPS).toEqual([4, 3, 3, 2, 2]);
    });
});

describe('createBattleshipGrid', () => {
    it('retourne une grille 8×8', () => {
        const grid = createBattleshipGrid();
        expect(grid).toHaveLength(BATTLESHIP_SIZE);
        grid.forEach((row) => expect(row).toHaveLength(BATTLESHIP_SIZE));
    });

    it('toutes les cellules sont vides au départ', () => {
        const grid = createBattleshipGrid();
        grid.forEach((row) => {
            row.forEach((cell) => {
                expect(cell.hasShip).toBe(false);
                expect(cell.hit).toBe(false);
                expect(cell.shipId).toBeNull();
            });
        });
    });

    it('retourne des objets distincts à chaque appel', () => {
        const a = createBattleshipGrid();
        const b = createBattleshipGrid();
        a[0][0].hasShip = true;
        expect(b[0][0].hasShip).toBe(false);
    });
});

describe('placeBattleshipFleet', () => {
    it('place exactement BATTLESHIP_SHIPS.length navires distincts', () => {
        const grid = createBattleshipGrid();
        placeBattleshipFleet(grid);
        const shipIds = new Set();
        grid.forEach((row) => row.forEach((cell) => {
            if (cell.shipId !== null) shipIds.add(cell.shipId);
        }));
        expect(shipIds.size).toBe(BATTLESHIP_SHIPS.length);
    });

    it('place le bon nombre total de cases de navires', () => {
        const grid = createBattleshipGrid();
        placeBattleshipFleet(grid);
        const total = grid.flat().filter((cell) => cell.hasShip).length;
        const expected = BATTLESHIP_SHIPS.reduce((sum, len) => sum + len, 0);
        expect(total).toBe(expected);
    });

    it('aucune cellule non-navire n\'a de shipId', () => {
        const grid = createBattleshipGrid();
        placeBattleshipFleet(grid);
        grid.forEach((row) => row.forEach((cell) => {
            if (!cell.hasShip) expect(cell.shipId).toBeNull();
        }));
    });
});

describe('countRemainingBattleshipShips', () => {
    it('retourne 0 sur une grille vide', () => {
        expect(countRemainingBattleshipShips(createBattleshipGrid())).toBe(0);
    });

    it('retourne le nombre de navires après placement', () => {
        const grid = createBattleshipGrid();
        placeBattleshipFleet(grid);
        expect(countRemainingBattleshipShips(grid)).toBe(BATTLESHIP_SHIPS.length);
    });

    it('décrémente quand toutes les cases d\'un navire sont touchées', () => {
        const grid = createBattleshipGrid();
        placeBattleshipFleet(grid);
        const initialCount = countRemainingBattleshipShips(grid);

        // Toucher toutes les cases du premier navire (shipId 0)
        grid.forEach((row) => row.forEach((cell) => {
            if (cell.shipId === 0) cell.hit = true;
        }));

        expect(countRemainingBattleshipShips(grid)).toBe(initialCount - 1);
    });

    it('ne décrémente pas si le navire est seulement partiellement touché', () => {
        const grid = createBattleshipGrid();
        placeBattleshipFleet(grid);
        const initialCount = countRemainingBattleshipShips(grid);

        // Toucher seulement la première case d'un navire
        const firstShipCell = grid.flat().find((cell) => cell.shipId === 0);
        if (firstShipCell) firstShipCell.hit = true;

        expect(countRemainingBattleshipShips(grid)).toBe(initialCount);
    });
});
