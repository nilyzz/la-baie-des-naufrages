// Navire Cinéma — import Excel, parsing, formatage et affichage catalogue.
// Extracted verbatim from script.js during the ES-modules migration.
//
// Scope actuel : parsing/formatage Excel + rendu/filtrage du catalogue.
// script.js garde encore l'etat local et passe un contexte DOM/state a ces
// fonctions pendant la migration progressive.

import { EXCEL_FILE_CANDIDATES } from '../core/constants.js';

export const DEFAULT_POSTER_URL = 'https://placehold.co/600x900/0f172a/f8fafc?text=Affiche';

const XLSX_CDN = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
let _xlsxLoadPromise = null;

function loadXlsx() {
    if (window.XLSX) return Promise.resolve();
    if (_xlsxLoadPromise) return _xlsxLoadPromise;
    _xlsxLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = XLSX_CDN;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Chargement xlsx échoué.'));
        document.head.appendChild(script);
    });
    return _xlsxLoadPromise;
}

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

export function formatDuration(minutes) {
    const value = Number(minutes);

    if (!value) {
        return 'xxhxx';
    }

    const hours = Math.floor(value / 60);
    const remainingMinutes = value % 60;

    if (!hours) {
        return `${remainingMinutes} min`;
    }

    if (!remainingMinutes) {
        return `${hours}h`;
    }

    return `${hours}h${String(remainingMinutes).padStart(2, '0')}`;
}

export function sanitizeImageUrl(url, fallbackUrl = DEFAULT_POSTER_URL) {
    const value = String(url || '').trim();

    if (!value) {
        return fallbackUrl;
    }

    try {
        const parsedUrl = new URL(value, window.location.href);
        if (['http:', 'https:'].includes(parsedUrl.protocol)) {
            return parsedUrl.href;
        }
    } catch (_error) {
        return fallbackUrl;
    }

    return fallbackUrl;
}

export function buildDirectorSearchUrl(directorName, fallbackUrl = '') {
    const normalizedName = String(directorName || '').trim();

    if (normalizedName) {
        return `https://www.google.com/search?q=${encodeURIComponent(normalizedName)}`;
    }

    return String(fallbackUrl || '').trim();
}

export function normalizeCatalogText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

export function getMovieGenreTokens(movie) {
    return Array.from(new Set(
        String(movie?.genre || '')
            .split(/[,/;|]+/)
            .map((entry) => entry.trim())
            .filter(Boolean)
    ));
}

export function getMovieReleaseYear(movie) {
    const directYear = Number(String(movie?.releaseDate || '').slice(0, 4));
    if (Number.isFinite(directYear) && directYear > 1800) {
        return directYear;
    }

    const fallbackMatch = String(movie?.releaseDisplay || '').match(/(19|20)\d{2}/);
    return fallbackMatch ? Number(fallbackMatch[0]) : null;
}

export function getMovieRatingOutOfTwenty(movie) {
    const rating = Number(movie?.rating);
    const scale = Number(movie?.ratingScale || 20);
    if (!Number.isFinite(rating) || !Number.isFinite(scale) || scale <= 0) {
        return null;
    }
    return (rating / scale) * 20;
}

export function getMovieTitleLetter(movie) {
    const normalizedTitle = normalizeCatalogText(movie?.title);
    if (!normalizedTitle) {
        return '#';
    }

    const firstCharacter = normalizedTitle.charAt(0).toUpperCase();
    return /[A-Z]/.test(firstCharacter) ? firstCharacter : '#';
}

export function setExcelImportFeedback(target, message, type = '') {
    if (!target) {
        return;
    }

    target.textContent = message;
    target.classList.remove('feedback-success', 'feedback-error');

    if (type === 'success') {
        target.classList.add('feedback-success');
    }

    if (type === 'error') {
        target.classList.add('feedback-error');
    }
}

export async function enrichMoviesWithRemotePosters(importedMovies, options = {}) {
    const { defaultPoster = DEFAULT_POSTER_URL } = options;
    const moviesNeedingPoster = importedMovies.filter((movie) => !movie.posterUrl || movie.posterUrl === defaultPoster);

    if (!moviesNeedingPoster.length) {
        return importedMovies;
    }

    try {
        const response = await fetch('/api/posters/resolve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movies: moviesNeedingPoster.map((movie) => ({
                    id: movie.id,
                    title: movie.title,
                    releaseDate: movie.releaseDate,
                    releaseDisplay: movie.releaseDisplay
                }))
            })
        });

        if (!response.ok) {
            return importedMovies;
        }

        const payload = await response.json();
        const posterUrlsById = new Map(
            Array.isArray(payload?.resolutions)
                ? payload.resolutions.map((item) => [item.id, item.posterUrl])
                : []
        );

        return importedMovies.map((movie) => {
            const resolvedPosterUrl = posterUrlsById.get(movie.id);
            return resolvedPosterUrl ? { ...movie, posterUrl: resolvedPosterUrl } : movie;
        });
    } catch (_error) {
        return importedMovies;
    }
}

export async function importMoviesFromExcel(context = {}) {
    const {
        excelImportStatus,
        excelSourceName,
        defaultPoster = DEFAULT_POSTER_URL,
        setMovies,
        renderAll,
        loadMovies = () => []
    } = context;

    const applyMovies = (nextMovies) => {
        if (typeof setMovies === 'function') {
            setMovies(nextMovies);
        }
    };

    const rerender = () => {
        if (typeof renderAll === 'function') {
            renderAll();
        }
    };

    try {
        await loadXlsx();
    } catch (_err) {
        // window.XLSX restera falsy, géré ci-dessous
    }

    if (!window.XLSX) {
        setExcelImportFeedback(excelImportStatus, 'Lecture Excel indisponible pour le moment.', 'error');
        rerender();
        return;
    }

    setExcelImportFeedback(excelImportStatus, 'Recherche du fichier Excel du cinema...', '');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
        for (const fileName of EXCEL_FILE_CANDIDATES) {
            if (controller.signal.aborted) {
                break;
            }
            try {
                const response = await fetch(fileName, { cache: 'no-store', signal: controller.signal });

                if (!response.ok) {
                    continue;
                }

                const fileBuffer = await response.arrayBuffer();
                const importedMovies = await enrichMoviesWithRemotePosters(parseMoviesFromWorkbook(fileBuffer), {
                    defaultPoster
                });

                applyMovies(importedMovies);
                rerender();
                setExcelImportFeedback(
                    excelImportStatus,
                    importedMovies.length
                        ? `${importedMovies.length} film${importedMovies.length > 1 ? 's import\u00e9s' : ' import\u00e9'} depuis Excel.`
                        : "Le fichier Excel a \u00e9t\u00e9 trouv\u00e9, mais aucune ligne film exploitable n'a \u00e9t\u00e9 lue.",
                    importedMovies.length ? 'success' : 'error'
                );

                if (excelSourceName) {
                    excelSourceName.textContent = `Source d\u00e9tect\u00e9e : ${fileName}`;
                }

                return;
            } catch (error) {
                if (error?.name === 'AbortError') {
                    break;
                }
                console.error(`Impossible de lire ${fileName}.`, error);
            }
        }

        applyMovies(loadMovies());
        rerender();
        setExcelImportFeedback(
            excelImportStatus,
            'Aucun fichier Excel trouv\u00e9. Place un fichier film.xlsx \u00e0 la racine du d\u00e9p\u00f4t pour importer des films.',
            'error'
        );

        if (excelSourceName) {
            excelSourceName.textContent = 'Ajoute par exemple film.xlsx ou film.xls \u00e0 c\u00f4t\u00e9 de index.html.';
        }
    } finally {
        window.clearTimeout(timeoutId);
    }
}

export function syncCatalogSelectOptions(selectElement, options, currentValue) {
    if (!selectElement) {
        return;
    }

    const previousValue = currentValue ?? selectElement.value;
    selectElement.textContent = '';
    const fragment = document.createDocumentFragment();

    options.forEach(({ value, label }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        fragment.appendChild(option);
    });

    selectElement.appendChild(fragment);
    selectElement.value = options.some((option) => option.value === previousValue)
        ? previousValue
        : (options[0]?.value || '');
}

export function renderCatalogFilters(context) {
    const {
        movies = [],
        catalogGenreFilterGroup,
        catalogReleaseFilterSelect,
        catalogRatingFilterSelect,
        catalogSortFilterSelect,
        catalogDirectorSuggestions,
        catalogDirectorFilterInput,
        catalogDirectorFilterBlock,
        catalogReleaseFilterBlock,
        catalogRatingFilterBlock,
        catalogDirectorTerm = ''
    } = context;
    let catalogSelectedGenres = context.catalogSelectedGenres || new Set();
    let catalogReleaseFilter = context.catalogReleaseFilter || 'all';
    let catalogMinimumRatingFilter = context.catalogMinimumRatingFilter || 'all';
    let catalogSortMode = context.catalogSortMode || 'default';
    const genreCounts = new Map();
    const directorNames = new Set();

    movies.forEach((movie) => {
        getMovieGenreTokens(movie).forEach((genre) => {
            genreCounts.set(genre, Number(genreCounts.get(genre) || 0) + 1);
        });

        if (movie.director) {
            directorNames.add(movie.director);
        }
    });

    catalogSelectedGenres = new Set([...catalogSelectedGenres].filter((genre) => genreCounts.has(genre)));

    if (catalogGenreFilterGroup) {
        catalogGenreFilterGroup.textContent = '';
        const fragment = document.createDocumentFragment();
        const sortedGenres = [...genreCounts.entries()].sort((left, right) => left[0].localeCompare(right[0], 'fr'));

        if (!sortedGenres.length) {
            const empty = document.createElement('p');
            empty.className = 'catalog-filter-empty';
            empty.textContent = "Les genres appara\u00eetront ici apr\u00e8s l'import.";
            fragment.appendChild(empty);
        } else {
            sortedGenres.forEach(([genre, count]) => {
                const label = document.createElement('label');
                label.className = 'catalog-genre-option';

                const input = document.createElement('input');
                input.type = 'checkbox';
                input.name = 'catalogGenreFilter';
                input.value = genre;
                input.checked = catalogSelectedGenres.has(genre);

                const copy = document.createElement('span');
                copy.className = 'catalog-genre-option-copy';
                copy.textContent = genre;

                const meta = document.createElement('span');
                meta.className = 'catalog-genre-option-count';
                meta.textContent = String(count);

                label.append(input, copy, meta);
                fragment.appendChild(label);
            });
        }

        catalogGenreFilterGroup.appendChild(fragment);
    }

    syncCatalogSelectOptions(catalogReleaseFilterSelect, [
        { value: 'all', label: 'Toutes les p\u00e9riodes' },
        { value: '2020+', label: "2020 \u00e0 aujourd'hui" },
        { value: '2010s', label: 'Ann\u00e9es 2010' },
        { value: '2000s', label: 'Ann\u00e9es 2000' },
        { value: '1990s', label: 'Ann\u00e9es 1990' },
        { value: '1980s', label: 'Ann\u00e9es 1980' },
        { value: 'before-1980', label: 'Avant 1980' }
    ], catalogReleaseFilter);
    catalogReleaseFilter = catalogReleaseFilterSelect?.value || 'all';

    syncCatalogSelectOptions(catalogRatingFilterSelect, [
        { value: 'all', label: 'Toutes les notes' },
        { value: '16', label: '16 / 20 et plus' },
        { value: '14', label: '14 / 20 et plus' },
        { value: '12', label: '12 / 20 et plus' },
        { value: '10', label: '10 / 20 et plus' },
        { value: '8', label: '8 / 20 et plus' }
    ], catalogMinimumRatingFilter);
    catalogMinimumRatingFilter = catalogRatingFilterSelect?.value || 'all';

    syncCatalogSelectOptions(catalogSortFilterSelect, [
        { value: 'default', label: 'Ordre du catalogue' },
        { value: 'rating-desc', label: 'Note d\u00e9croissante' },
        { value: 'rating-asc', label: 'Note croissante' },
        { value: 'release-desc', label: 'Sortie la plus r\u00e9cente' },
        { value: 'release-asc', label: 'Sortie la plus ancienne' },
        { value: 'director-asc', label: 'R\u00e9alisateur A \u00e0 Z' }
    ], catalogSortMode);
    catalogSortMode = catalogSortFilterSelect?.value || 'default';

    if (catalogDirectorSuggestions) {
        catalogDirectorSuggestions.textContent = '';
        const fragment = document.createDocumentFragment();
        [...directorNames].sort((left, right) => left.localeCompare(right, 'fr')).forEach((directorName) => {
            const option = document.createElement('option');
            option.value = directorName;
            fragment.appendChild(option);
        });
        catalogDirectorSuggestions.appendChild(fragment);
    }

    if (catalogDirectorFilterInput && catalogDirectorFilterInput.value !== catalogDirectorTerm) {
        catalogDirectorFilterInput.value = catalogDirectorTerm;
    }

    catalogDirectorFilterBlock?.classList.toggle('hidden', catalogSortMode !== 'director-asc');
    catalogReleaseFilterBlock?.classList.toggle('hidden', !['release-desc', 'release-asc'].includes(catalogSortMode));
    catalogRatingFilterBlock?.classList.toggle('hidden', !['rating-desc', 'rating-asc'].includes(catalogSortMode));

    return {
        catalogSelectedGenres,
        catalogReleaseFilter,
        catalogMinimumRatingFilter,
        catalogSortMode
    };
}

export function updateCatalogResultsSummary(context, filteredMovies) {
    const {
        catalogResultsSummary,
        movies = [],
        searchTerm = '',
        catalogSortMode = 'default',
        catalogDirectorTerm = '',
        catalogReleaseFilter = 'all',
        catalogMinimumRatingFilter = 'all',
        catalogSelectedGenres = new Set()
    } = context;

    if (!catalogResultsSummary) {
        return;
    }

    const activeFilters = [
        searchTerm,
        catalogSortMode === 'director-asc' ? catalogDirectorTerm : '',
        ['release-desc', 'release-asc'].includes(catalogSortMode) && catalogReleaseFilter !== 'all' ? catalogReleaseFilter : '',
        ['rating-desc', 'rating-asc'].includes(catalogSortMode) && catalogMinimumRatingFilter !== 'all' ? catalogMinimumRatingFilter : '',
        catalogSortMode !== 'default' ? catalogSortMode : '',
        catalogSelectedGenres.size ? 'genres' : ''
    ].filter(Boolean).length;

    if (!movies.length) {
        catalogResultsSummary.textContent = 'Le panneau sera pr\u00eat d\u00e8s que les films seront import\u00e9s.';
        return;
    }

    catalogResultsSummary.textContent = activeFilters
        ? `${filteredMovies.length} film${filteredMovies.length > 1 ? 's correspondent' : ' correspond'} aux filtres sur ${movies.length}.`
        : `${movies.length} film${movies.length > 1 ? 's disponibles' : ' disponible'} dans le catalogue.`;
}

export function getFilteredMovies(context) {
    const {
        movies = [],
        searchTerm = '',
        catalogSortMode = 'default',
        catalogDirectorTerm = '',
        catalogMinimumRatingFilter = 'all',
        catalogSelectedGenres = new Set(),
        catalogReleaseFilter = 'all'
    } = context;
    const normalizedSearch = normalizeCatalogText(searchTerm);
    const normalizedDirectorSearch = catalogSortMode === 'director-asc'
        ? normalizeCatalogText(catalogDirectorTerm)
        : '';
    const minimumRating = ['rating-desc', 'rating-asc'].includes(catalogSortMode) && catalogMinimumRatingFilter !== 'all'
        ? Number(catalogMinimumRatingFilter)
        : null;

    const filteredMovies = movies.filter((movie) => {
        if (normalizedSearch) {
            const titleMatches = normalizeCatalogText(movie.title).includes(normalizedSearch);
            const directorMatches = normalizeCatalogText(movie.director).includes(normalizedSearch);
            if (!titleMatches && !directorMatches) {
                return false;
            }
        }

        if (normalizedDirectorSearch && !normalizeCatalogText(movie.director).includes(normalizedDirectorSearch)) {
            return false;
        }

        if (catalogSelectedGenres.size) {
            const movieGenres = new Set(getMovieGenreTokens(movie));
            if (![...catalogSelectedGenres].every((genre) => movieGenres.has(genre))) {
                return false;
            }
        }

        const releaseYear = getMovieReleaseYear(movie);
        if (['release-desc', 'release-asc'].includes(catalogSortMode)) {
            if (catalogReleaseFilter === '2020+' && (!releaseYear || releaseYear < 2020)) {
                return false;
            }
            if (catalogReleaseFilter === '2010s' && (!releaseYear || releaseYear < 2010 || releaseYear > 2019)) {
                return false;
            }
            if (catalogReleaseFilter === '2000s' && (!releaseYear || releaseYear < 2000 || releaseYear > 2009)) {
                return false;
            }
            if (catalogReleaseFilter === '1990s' && (!releaseYear || releaseYear < 1990 || releaseYear > 1999)) {
                return false;
            }
            if (catalogReleaseFilter === '1980s' && (!releaseYear || releaseYear < 1980 || releaseYear > 1989)) {
                return false;
            }
            if (catalogReleaseFilter === 'before-1980' && (!releaseYear || releaseYear >= 1980)) {
                return false;
            }
        }

        if (minimumRating !== null) {
            const ratingOnTwenty = getMovieRatingOutOfTwenty(movie);
            if (!Number.isFinite(ratingOnTwenty) || ratingOnTwenty < minimumRating) {
                return false;
            }
        }

        return true;
    });

    const compareText = (left, right) => String(left || '').localeCompare(String(right || ''), 'fr', { sensitivity: 'base' });

    filteredMovies.sort((left, right) => {
        if (catalogSortMode === 'rating-desc') {
            return (getMovieRatingOutOfTwenty(right) ?? -Infinity) - (getMovieRatingOutOfTwenty(left) ?? -Infinity);
        }
        if (catalogSortMode === 'rating-asc') {
            return (getMovieRatingOutOfTwenty(left) ?? Infinity) - (getMovieRatingOutOfTwenty(right) ?? Infinity);
        }
        if (catalogSortMode === 'release-desc') {
            return (getMovieReleaseYear(right) ?? -Infinity) - (getMovieReleaseYear(left) ?? -Infinity);
        }
        if (catalogSortMode === 'release-asc') {
            return (getMovieReleaseYear(left) ?? Infinity) - (getMovieReleaseYear(right) ?? Infinity);
        }
        if (catalogSortMode === 'director-asc') {
            return compareText(left.director, right.director) || compareText(left.title, right.title);
        }
        return 0;
    });

    return filteredMovies;
}

export function renderStats(context) {
    const { movies = [], movieCount, averageRating } = context;
    const count = movies.length;
    const ratedMovies = movies.filter((movie) => Number.isFinite(Number(movie.rating)));
    const total = ratedMovies.reduce((sum, movie) => sum + Number(movie.rating), 0);
    const average = ratedMovies.length ? (total / ratedMovies.length).toFixed(1) : null;
    const ratingScale = ratedMovies[0]?.ratingScale || movies[0]?.ratingScale || 20;

    if (movieCount) {
        movieCount.textContent = `${count} film${count > 1 ? 's' : ''}`;
    }
    if (averageRating) {
        averageRating.textContent = average ? `${average} / ${ratingScale}` : 'Non note';
    }
}

export function renderCatalog(context) {
    const {
        catalogGrid,
        emptyCatalogMessage,
        defaultPoster = DEFAULT_POSTER_URL
    } = context;

    if (!catalogGrid) {
        return [];
    }

    const filteredMovies = getFilteredMovies(context);
    updateCatalogResultsSummary(context, filteredMovies);
    catalogGrid.textContent = '';
    const fragment = document.createDocumentFragment();

    filteredMovies.forEach((movie) => {
        const article = document.createElement('article');
        article.className = 'movie-card';

        const posterShell = document.createElement('div');
        posterShell.className = 'movie-poster-shell';

        const ratingBadge = document.createElement('span');
        ratingBadge.className = `rating-badge rating-badge-floating ${getRatingBadgeTone(movie.rating, movie.ratingScale)}`;
        ratingBadge.textContent = formatRatingWithScale(movie.rating, movie.ratingScale);

        const poster = document.createElement('img');
        poster.className = 'movie-poster';
        poster.src = sanitizeImageUrl(movie.posterUrl, defaultPoster);
        poster.alt = `Affiche de ${movie.title}`;
        poster.loading = 'lazy';
        poster.addEventListener('error', () => {
            poster.src = defaultPoster;
        }, { once: true });

        posterShell.append(ratingBadge, poster);

        const body = document.createElement('div');
        body.className = 'card movie-card-body';

        const title = document.createElement('h4');
        title.textContent = movie.title;

        const meta = document.createElement('div');
        meta.className = 'movie-meta';

        const releaseAndDuration = document.createElement('p');
        releaseAndDuration.textContent = `${movie.releaseDisplay || formatDate(movie.releaseDate)} \u2022 ${formatDuration(movie.duration)}`;

        const genre = document.createElement('p');
        genre.textContent = movie.genre || 'Inconnu';

        const director = document.createElement('p');
        if (movie.directorLink) {
            const directorLink = document.createElement('a');
            directorLink.href = buildDirectorSearchUrl(movie.director, movie.directorLink);
            directorLink.target = '_blank';
            directorLink.rel = 'noreferrer noopener';
            directorLink.textContent = movie.director || 'Inconnu';
            director.appendChild(directorLink);
        } else {
            director.textContent = movie.director || 'Inconnu';
        }

        meta.append(releaseAndDuration, genre, director);

        body.append(title, meta);
        article.append(posterShell, body);
        fragment.appendChild(article);
    });

    catalogGrid.appendChild(fragment);
    emptyCatalogMessage?.classList.toggle('hidden', filteredMovies.length > 0);
    return filteredMovies;
}

export function renderManageList(context) {
    const { movies = [], manageList } = context;

    if (!manageList) {
        return;
    }

    if (!movies.length) {
        manageList.innerHTML = '<p class="empty-state">Aucun film import\u00e9 pour le moment.</p>';
        return;
    }

    manageList.textContent = '';
    const fragment = document.createDocumentFragment();

    movies.forEach((movie) => {
        const article = document.createElement('article');
        article.className = 'manage-item';

        const copy = document.createElement('div');
        copy.className = 'manage-item-copy';

        const title = document.createElement('h4');
        title.textContent = movie.title;

        const details = document.createElement('p');
        details.textContent = `${movie.genre || 'Genre inconnu'} | ${movie.director || 'Realisateur inconnu'} | ${formatDuration(movie.duration)} | ${formatRatingWithScale(movie.rating, movie.ratingScale)}`;

        copy.append(title, details);
        article.appendChild(copy);
        fragment.appendChild(article);
    });

    manageList.appendChild(fragment);
}

export function renderAll(context) {
    const nextFilters = renderCatalogFilters(context);
    const nextContext = { ...context, ...nextFilters };
    renderStats(nextContext);
    renderCatalog(nextContext);
    renderManageList(nextContext);
    return nextFilters;
}

export function bindCinemaCatalogControls(options = {}) {
    const {
        getContext,
        setState,
        renderCatalog: renderCatalogCallback,
        renderCatalogFilters: renderCatalogFiltersCallback
    } = options;

    const readContext = () => (typeof getContext === 'function' ? getContext() : {});
    const updateState = (nextState) => {
        if (typeof setState === 'function') {
            setState(nextState);
        }
    };
    const refreshCatalog = () => {
        if (typeof renderCatalogCallback === 'function') {
            renderCatalogCallback();
            return;
        }
        renderCatalog(readContext());
    };
    const refreshFilters = () => {
        if (typeof renderCatalogFiltersCallback === 'function') {
            renderCatalogFiltersCallback();
            return;
        }
        updateState(renderCatalogFilters(readContext()));
    };

    const context = readContext();
    const {
        searchInput,
        catalogDirectorFilterInput,
        catalogReleaseFilterSelect,
        catalogRatingFilterSelect,
        catalogSortFilterSelect,
        catalogGenreFilterGroup,
        catalogResetFiltersButton
    } = context;

    searchInput?.addEventListener('input', (event) => {
        updateState({ searchTerm: event.target.value });
        refreshCatalog();
    });

    catalogDirectorFilterInput?.addEventListener('input', (event) => {
        updateState({ catalogDirectorTerm: event.target.value });
        refreshCatalog();
    });

    catalogReleaseFilterSelect?.addEventListener('change', (event) => {
        updateState({ catalogReleaseFilter: event.target.value });
        refreshCatalog();
    });

    catalogRatingFilterSelect?.addEventListener('change', (event) => {
        updateState({ catalogMinimumRatingFilter: event.target.value });
        refreshCatalog();
    });

    catalogSortFilterSelect?.addEventListener('change', (event) => {
        updateState({ catalogSortMode: event.target.value });
        refreshFilters();
        refreshCatalog();
    });

    catalogGenreFilterGroup?.addEventListener('change', (event) => {
        const genreInput = event.target.closest('input[name="catalogGenreFilter"]');
        if (!genreInput) {
            return;
        }

        const selectedGenres = new Set(readContext().catalogSelectedGenres || []);
        if (genreInput.checked) {
            selectedGenres.add(genreInput.value);
        } else {
            selectedGenres.delete(genreInput.value);
        }

        updateState({ catalogSelectedGenres: selectedGenres });
        refreshCatalog();
    });

    catalogResetFiltersButton?.addEventListener('click', () => {
        updateState({
            catalogSelectedGenres: new Set(),
            catalogReleaseFilter: 'all',
            catalogMinimumRatingFilter: 'all',
            catalogSortMode: 'default',
            catalogDirectorTerm: '',
            searchTerm: ''
        });

        const nextContext = readContext();
        if (nextContext.searchInput) {
            nextContext.searchInput.value = '';
        }

        refreshFilters();
        refreshCatalog();
    });
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

// ---------------------------------------------------------------------------
// Catalog state — owned by this module after initCinemaCatalogState() is called
// ---------------------------------------------------------------------------

let _movies = [];
let _searchTerm = '';
let _catalogSelectedGenres = new Set();
let _catalogReleaseFilter = 'all';
let _catalogMinimumRatingFilter = 'all';
let _catalogSortMode = 'default';
let _catalogDirectorTerm = '';
let _moviesLoadStarted = false;
let _catalogDomRefs = null;

export function initCinemaCatalogState() {
    _catalogDomRefs = {
        catalogGrid: document.getElementById('catalogGrid'),
        emptyCatalogMessage: document.getElementById('emptyCatalogMessage'),
        catalogResultsSummary: document.getElementById('catalogResultsSummary'),
        catalogGenreFilterGroup: document.getElementById('catalogGenreFilterGroup'),
        catalogDirectorFilterBlock: document.getElementById('catalogDirectorFilterBlock'),
        catalogReleaseFilterBlock: document.getElementById('catalogReleaseFilterBlock'),
        catalogRatingFilterBlock: document.getElementById('catalogRatingFilterBlock'),
        catalogReleaseFilterSelect: document.getElementById('catalogReleaseFilterSelect'),
        catalogRatingFilterSelect: document.getElementById('catalogRatingFilterSelect'),
        catalogSortFilterSelect: document.getElementById('catalogSortFilterSelect'),
        catalogDirectorFilterInput: document.getElementById('catalogDirectorFilterInput'),
        catalogDirectorSuggestions: document.getElementById('catalogDirectorSuggestions'),
        manageList: document.getElementById('manageList'),
        excelImportStatus: document.getElementById('excelImportStatus'),
        excelSourceName: document.getElementById('excelSourceName'),
        movieCount: document.getElementById('movieCount'),
        averageRating: document.getElementById('averageRating')
    };
}

export function getCinemaCatalogContext() {
    return {
        movies: _movies,
        searchTerm: _searchTerm,
        catalogSelectedGenres: _catalogSelectedGenres,
        catalogReleaseFilter: _catalogReleaseFilter,
        catalogMinimumRatingFilter: _catalogMinimumRatingFilter,
        catalogSortMode: _catalogSortMode,
        catalogDirectorTerm: _catalogDirectorTerm,
        defaultPoster: DEFAULT_POSTER_URL,
        ..._catalogDomRefs
    };
}

export function applyCinemaCatalogState(nextState = {}) {
    _searchTerm = nextState.searchTerm ?? _searchTerm;
    _catalogSelectedGenres = nextState.catalogSelectedGenres || _catalogSelectedGenres;
    _catalogReleaseFilter = nextState.catalogReleaseFilter || _catalogReleaseFilter;
    _catalogMinimumRatingFilter = nextState.catalogMinimumRatingFilter || _catalogMinimumRatingFilter;
    _catalogSortMode = nextState.catalogSortMode || _catalogSortMode;
    _catalogDirectorTerm = nextState.catalogDirectorTerm ?? _catalogDirectorTerm;
}

export function renderCinemaCatalogAll() {
    applyCinemaCatalogState(renderAll(getCinemaCatalogContext()));
}

export function ensureMoviesLoaded() {
    if (_moviesLoadStarted) return;
    _moviesLoadStarted = true;
    importMoviesFromCinema();
}

export async function importMoviesFromCinema() {
    return importMoviesFromExcel({
        ..._catalogDomRefs,
        defaultPoster: DEFAULT_POSTER_URL,
        setMovies: (nextMovies) => { _movies = nextMovies; },
        renderAll: renderCinemaCatalogAll,
        loadMovies: () => []
    });
}
