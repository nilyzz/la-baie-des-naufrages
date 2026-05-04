import { describe, it, expect } from 'vitest';
import {
    SESSION_KEY,
    SESSION_TIMEOUT_MS,
    EXCEL_FILE_CANDIDATES,
    MULTIPLAYER_SUPPORTED_GAMES,
    GAME_FILTER_TAGS,
    UNO_MENU_CLOSE_DURATION_MS,
    GRID_OUTCOME_MENU_DELAY_MS,
    LEGAL_NOTICE_ANIMATION_MS
} from '../js/core/constants.js';

describe('constants', () => {
    it('SESSION_KEY est correct', () => {
        expect(SESSION_KEY).toBe('baie-des-naufrages-session');
    });

    it('SESSION_TIMEOUT_MS vaut 2 heures en ms', () => {
        expect(SESSION_TIMEOUT_MS).toBe(2 * 60 * 60 * 1000);
        expect(SESSION_TIMEOUT_MS).toBe(7_200_000);
    });

    it('EXCEL_FILE_CANDIDATES contient les 9 formats attendus', () => {
        expect(EXCEL_FILE_CANDIDATES).toHaveLength(9);
        expect(EXCEL_FILE_CANDIDATES).toContain('film.xlsx');
        expect(EXCEL_FILE_CANDIDATES).toContain('cinema.xlsm');
        expect(new Set(EXCEL_FILE_CANDIDATES).size).toBe(EXCEL_FILE_CANDIDATES.length);
    });

    it('MULTIPLAYER_SUPPORTED_GAMES contient les 9 jeux', () => {
        const ids = Object.keys(MULTIPLAYER_SUPPORTED_GAMES);
        expect(ids).toHaveLength(9);
        expect(ids).toContain('chess');
        expect(ids).toContain('connect4');
        expect(ids).toContain('pong');
        expect(ids).toContain('uno');
        expect(ids).toContain('bomb');
    });

    it('MULTIPLAYER_SUPPORTED_GAMES noms en français', () => {
        expect(MULTIPLAYER_SUPPORTED_GAMES.pong).toBe('Pong');
        expect(MULTIPLAYER_SUPPORTED_GAMES.connect4).toBe('Coin 4');
        expect(MULTIPLAYER_SUPPORTED_GAMES.ticTacToe).toBe('Morpion');
    });

    it('GAME_FILTER_TAGS couvre 31 jeux', () => {
        expect(Object.keys(GAME_FILTER_TAGS)).toHaveLength(31);
    });

    it('GAME_FILTER_TAGS chaque jeu a au moins un tag', () => {
        for (const [id, tags] of Object.entries(GAME_FILTER_TAGS)) {
            expect(tags.length, `${id} doit avoir au moins un tag`).toBeGreaterThan(0);
        }
    });

    it('GAME_FILTER_TAGS tags connus uniquement', () => {
        const validTags = new Set(['arcade', 'reflexe', 'puzzle', 'strategie', 'table', 'carte']);
        for (const [id, tags] of Object.entries(GAME_FILTER_TAGS)) {
            for (const tag of tags) {
                expect(validTags.has(tag), `${id}: tag inconnu "${tag}"`).toBe(true);
            }
        }
    });

    it('UNO_MENU_CLOSE_DURATION_MS = 260', () => {
        expect(UNO_MENU_CLOSE_DURATION_MS).toBe(260);
    });

    it('GRID_OUTCOME_MENU_DELAY_MS = 650', () => {
        expect(GRID_OUTCOME_MENU_DELAY_MS).toBe(650);
    });

    it('LEGAL_NOTICE_ANIMATION_MS = 220', () => {
        expect(LEGAL_NOTICE_ANIMATION_MS).toBe(220);
    });
});
