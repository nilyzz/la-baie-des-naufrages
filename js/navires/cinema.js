// Navire Cinéma — import Excel, parsing, formatage et affichage catalogue.
// Extracted verbatim from script.js during the ES-modules migration.
//
// Scope à cette étape : les fonctions PURES de parsing/formatage
// (normalizeMovieRow, parseMoviesFromWorkbook, formatters) + la boucle
// d'import Excel avec timeout. Ces fonctions sont les plus faciles à
// isoler — elles prennent des données et retournent des données.
//
// DIFFÉRÉ : renderCatalog, renderCatalogFilters, renderStats, renderAll,
// getFilteredMovies — fortement couplés aux variables d'état du catalogue
// (movies, searchTerm, catalogSelectedGenres, etc.) qui vivent dans l'IIFE
// de script.js. Extraction complète quand on dédiera une étape à l'état
// du catalogue ou lors du cutover final.

import { EXCEL_FILE_CANDIDATES } from '../core/constants.js';

export const DEFAULT_POSTER_URL = 'https://placehold.co/600x900/0f172a/f8fafc?text=Affiche';

// --- formatters ---

export function formatDate(dateString) {
    if (!dateString) {
        return 'Date inconnue';
    }

    if (/^\d{4}$/.test(String(dateString).trim())) {
        return String(dateString).trim();
    }

    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'Date inconnue';
    }

    return new Intl.DateTimeFormat('fr-FR').format(parsedDate);
}

export function formatExcelDisplayValue(value) {
    if (!value && value !== 0) {
        return '';
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Intl.DateTimeFormat('fr-FR').format(value);
    }

    return String(value).trim();
}

export function formatRating(value) {
    return formatRatingWithScale(value, 20);
}

export function formatRatingWithScale(value, scale = 20) {
    const rating = Number(value);
    const normalizedScale = Number(scale);

    if (!Number.isFinite(rating)) {
        return 'Non note';
    }

    const formattedRating = Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
    return `${formattedRating} / ${Number.isFinite(normalizedScale) && normalizedScale > 0 ? normalizedScale : 20}`;
}

export function getRatingBadgeTone(value, scale = 20) {
    const rating = Number(value);
    const normalizedScale = Number(scale);
    const safeScale = Number.isFinite(normalizedScale) && normalizedScale > 0 ? normalizedScale : 20;

    if (!Number.isFinite(rating)) {
        return 'is-unrated';
    }

    const ratio = Math.max(0, Math.min(1, rating / safeScale));

    if (ratio < 0.3) return 'is-poor';
    if (ratio < 0.5) return 'is-rough';
    if (ratio < 0.65) return 'is-fair';
    if (ratio < 0.8) return 'is-good';
    if (ratio < 0.9) return 'is-great';
    return 'is-excellent';
}

// --- row parsers ---

function normalizeHeader(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');
}

function getFirstFilledValue(record, keys) {
    for (const key of keys) {
        const value = record[key];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return value;
        }
    }
    return '';
}

function parseNumberValue(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    const normalizedValue = String(value || '').replace(',', '.').trim();
    const parsedValue = Number(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

function parseDurationToMinutes(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const str = String(value || '').trim();
    const hm = str.match(/^(\d+)h(\d*)$/i);
    if (hm) return parseInt(hm[1], 10) * 60 + (parseInt(hm[2], 10) || 0);
    const m = str.match(/^(\d+)\s*min$/i);
    if (m) return parseInt(m[1], 10);
    const n = parseFloat(str.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
}

function parseExcelDateValue(value) {
    if (!value && value !== 0) {
        return '';
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }

    if (typeof value === 'number' && window.XLSX?.SSF) {
        const parsedCode = window.XLSX.SSF.parse_date_code(value);
        if (parsedCode) {
            const month = String(parsedCode.m).padStart(2, '0');
            const day = String(parsedCode.d).padStart(2, '0');
            return `${parsedCode.y}-${month}-${day}`;
        }
    }

    const normalizedValue = String(value).trim();
    if (!normalizedValue) return '';
    if (/^\d{4}$/.test(normalizedValue)) return normalizedValue;

    const isoMatch = normalizedValue.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (isoMatch) {
        const [, year, month, day] = isoMatch;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    const frenchMatch = normalizedValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (frenchMatch) {
        const [, day, month, year] = frenchMatch;
        const normalizedYear = year.length === 2 ? `20${year}` : year;
        return `${normalizedYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    const parsedDate = new Date(normalizedValue);
    if (Number.isNaN(parsedDate.getTime())) return '';
    return parsedDate.toISOString().slice(0, 10);
}

export function normalizeMovieRow(row) {
    const normalizedRecord = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
    );
    const title = String(getFirstFilledValue(normalizedRecord, [
        'titre', 'title', 'nom', 'film', 'films'
    ])).trim();

    if (!title) return null;

    const ratingValue = parseNumberValue(getFirstFilledValue(normalizedRecord, [
        'note', 'rating', 'score', 'notesur20', 'notesur5'
    ]));
    const hasNoteSur5Column = 'notesur5' in normalizedRecord;
    const hasNoteSur20Column = 'notesur20' in normalizedRecord;
    const ratingScale = hasNoteSur20Column || (Number.isFinite(ratingValue) && ratingValue > 5)
        ? 20
        : (hasNoteSur5Column ? 5 : 20);
    const durationValue = parseDurationToMinutes(getFirstFilledValue(normalizedRecord, [
        'duree', 'duration', 'temps'
    ]));
    const releaseDate = parseExcelDateValue(getFirstFilledValue(normalizedRecord, [
        'date', 'datesortie', 'sortie', 'releasedate'
    ]));
    const genre = String(getFirstFilledValue(normalizedRecord, [
        'genre', 'categorie', 'type'
    ])).trim();
    const director = String(getFirstFilledValue(normalizedRecord, [
        'realisateur', 'director', 'auteur'
    ])).trim();
    const directorLink = String(getFirstFilledValue(normalizedRecord, [
        'realisateurlink', 'directorlink', 'auteurlink'
    ])).trim();
    const posterUrl = String(getFirstFilledValue(normalizedRecord, [
        'affiche', 'poster', 'posterurl', 'image', 'img'
    ])).trim();
    const releaseDisplay = formatExcelDisplayValue(getFirstFilledValue(normalizedRecord, [
        'dateaffichage', 'date', 'datesortie', 'sortie', 'releasedate'
    ]));

    return {
        id: crypto.randomUUID(),
        title,
        director,
        directorLink,
        genre,
        releaseDate,
        releaseDisplay,
        ratingScale,
        duration: durationValue || 0,
        rating: ratingValue,
        posterUrl: posterUrl || DEFAULT_POSTER_URL
    };
}

function parseMoviesFromFixedColumns(worksheet) {
    if (!worksheet?.['!ref'] || !window.XLSX?.utils) return [];

    const range = window.XLSX.utils.decode_range(worksheet['!ref']);
    const moviesFromColumns = [];
    const columnMap = {
        films: 'CA',
        date: 'CB',
        dateaffichage: 'CB',
        genre: 'CC',
        duree: 'CD',
        realisateur: 'CE',
        realisateurlink: 'CE',
        notesur20: 'CF'
    };

    for (let rowNumber = 2; rowNumber <= range.e.r + 1; rowNumber += 1) {
        const row = Object.fromEntries(Object.entries(columnMap).map(([key, column]) => {
            const cell = worksheet[`${column}${rowNumber}`];
            if (key === 'dateaffichage') return [key, cell?.w ?? cell?.v ?? ''];
            if (key === 'realisateurlink') return [key, cell?.l?.Target ?? ''];
            return [key, cell?.v ?? ''];
        }));
        const normalizedMovie = normalizeMovieRow(row);
        if (normalizedMovie) moviesFromColumns.push(normalizedMovie);
    }

    return moviesFromColumns;
}

function parseMoviesFromWorksheetRows(worksheet) {
    if (!worksheet?.['!ref'] || !window.XLSX?.utils) return [];

    const range = window.XLSX.utils.decode_range(worksheet['!ref']);
    const headersByColumn = new Map();
    const moviesFromRows = [];

    for (let columnIndex = range.s.c; columnIndex <= range.e.c; columnIndex += 1) {
        const headerCellAddress = window.XLSX.utils.encode_cell({ c: columnIndex, r: range.s.r });
        const headerValue = worksheet[headerCellAddress]?.v;
        if (headerValue !== undefined && headerValue !== null && String(headerValue).trim() !== '') {
            headersByColumn.set(columnIndex, normalizeHeader(headerValue));
        }
    }

    for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex += 1) {
        const rowRecord = {};
        headersByColumn.forEach((headerKey, columnIndex) => {
            const cellAddress = window.XLSX.utils.encode_cell({ c: columnIndex, r: rowIndex });
            const cell = worksheet[cellAddress];
            if (!cell) {
                rowRecord[headerKey] = '';
                return;
            }
            rowRecord[headerKey] = cell.v ?? '';
            if (headerKey === 'date') rowRecord.dateaffichage = cell.w ?? cell.v ?? '';
            if (headerKey === 'realisateur' && cell.l?.Target) rowRecord.realisateurlink = cell.l.Target;
        });
        const normalizedMovie = normalizeMovieRow(rowRecord);
        if (normalizedMovie) moviesFromRows.push(normalizedMovie);
    }

    return moviesFromRows;
}

/**
 * Parse an xlsx workbook array buffer into a list of movies.
 * Tries header-based row parsing first, falls back to fixed columns.
 */
export function parseMoviesFromWorkbook(arrayBuffer) {
    if (!window.XLSX) return [];

    const workbook = window.XLSX.read(arrayBuffer, {
        type: 'array',
        cellDates: true
    });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!worksheet) return [];

    const byRows = parseMoviesFromWorksheetRows(worksheet);
    if (byRows.length) return byRows;

    const fallbackRows = parseMoviesFromFixedColumns(worksheet);
    const shouldUseTwentyPointScale = fallbackRows.some((movie) => Number(movie.rating) > 5);
    return shouldUseTwentyPointScale
        ? fallbackRows.map((movie) => ({ ...movie, ratingScale: 20 }))
        : fallbackRows;
}

/**
 * Lists the candidate Excel file names that `importMoviesFromExcel` tries in
 * order — exposed so code that doesn't import `core/constants.js` directly
 * can still reference the same source of truth.
 */
export { EXCEL_FILE_CANDIDATES };
