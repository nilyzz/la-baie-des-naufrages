#!/usr/bin/env node
// Build minifie pour La Baie des Naufrages.
// - Minifie style.css -> style.min.css
// - Minifie script.js -> script.min.js
// - Bundle js/main.js -> js/main.bundle.min.js
// - Maintient une version visible du site et les cles de cache associees.

import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const VERSION_STATE_PATH = 'site-version.json';
const TRACKED_ROOT_FILES = [
    'index.html',
    'confidentialite.html',
    'mentions-legales.html',
    'style.css',
    'script.js',
    'server.js',
    'sw.js',
    'site.webmanifest',
    'sitemap.xml',
    'robots.txt',
    'ads.txt',
    'film.xlsx',
    'package.json'
];
const TRACKED_DIRECTORIES = ['assets', 'js'];
const IGNORED_TRACKED_FILES = new Set([
    'style.min.css',
    'js/main.bundle.min.js',
    VERSION_STATE_PATH
]);
const IGNORED_TRACKED_DIRS = new Set(['js/chunks']);

function gzipSize(filePath) {
    const buffer = readFileSync(filePath);
    return { raw: buffer.length, gz: gzipSync(buffer, { level: 9 }).length };
}

function formatKilobytes(value) {
    return `${(value / 1024).toFixed(1)} KB`;
}

function getBaseVersion() {
    try {
        const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
        const [majorRaw = '1', minorRaw = '0'] = String(packageJson.version || '1.0.0').split('.');
        const major = Number.parseInt(majorRaw, 10);
        const minor = Number.parseInt(minorRaw, 10);
        return {
            major: Number.isInteger(major) ? major : 1,
            minor: Number.isInteger(minor) ? Math.min(Math.max(minor, 0), 99) : 0
        };
    } catch {
        return { major: 1, minor: 0 };
    }
}

function readVersionState() {
    const baseVersion = getBaseVersion();
    if (!existsSync(VERSION_STATE_PATH)) {
        return { ...baseVersion, sourceHash: null };
    }

    try {
        const parsed = JSON.parse(readFileSync(VERSION_STATE_PATH, 'utf8'));
        const major = Number.parseInt(parsed.major, 10);
        const minor = Number.parseInt(parsed.minor, 10);
        return {
            major: Number.isInteger(major) ? major : baseVersion.major,
            minor: Number.isInteger(minor) ? Math.min(Math.max(minor, 0), 99) : baseVersion.minor,
            sourceHash: typeof parsed.sourceHash === 'string' ? parsed.sourceHash : null
        };
    } catch {
        return { ...baseVersion, sourceHash: null };
    }
}

function incrementVersion({ major, minor }) {
    const nextMinor = minor + 1;
    if (nextMinor <= 99) {
        return { major, minor: nextMinor };
    }

    return { major: major + 1, minor: 0 };
}

function formatDisplayVersion({ major, minor }) {
    return `${major}.${String(minor).padStart(2, '0')}`;
}

function walkDirectory(directoryPath) {
    if (!existsSync(directoryPath)) {
        return [];
    }

    return readdirSync(directoryPath, { withFileTypes: true })
        .flatMap((entry) => {
            const entryPath = path.join(directoryPath, entry.name);
            const normalizedEntryPath = entryPath.replace(/\\/g, '/');

            if (entry.isDirectory()) {
                if (IGNORED_TRACKED_DIRS.has(normalizedEntryPath)) {
                    return [];
                }
                return walkDirectory(entryPath);
            }

            if (IGNORED_TRACKED_FILES.has(normalizedEntryPath)) {
                return [];
            }

            return [normalizedEntryPath];
        });
}

function getTrackedSourceFiles() {
    const rootFiles = TRACKED_ROOT_FILES.filter((filePath) => existsSync(filePath));
    const directoryFiles = TRACKED_DIRECTORIES.flatMap((directoryPath) => walkDirectory(directoryPath));
    return [...new Set([...rootFiles, ...directoryFiles])].sort();
}

function normalizeIndexContent(content) {
    return content
        .replace(/style\.min\.css\?v=[^"'\s>]+/g, 'style.min.css?v=__SITE_CACHE_KEY__')
        .replace(/\/js\/main\.bundle\.min\.js\?v=[^"'\s>]+/g, '/js/main.bundle.min.js?v=__SITE_CACHE_KEY__')
        .replace(/\/js\/core\/consent\.js\?v=[^"'\s>]+/g, '/js/core/consent.js?v=__SITE_CACHE_KEY__')
        .replace(/\/js\/core\/sw-register\.js\?v=[^"'\s>]+/g, '/js/core/sw-register.js?v=__SITE_CACHE_KEY__')
        .replace(/(<span id="siteVersionDisplay"[^>]*>)([^<]*)(<\/span>)/, '$1Version __SITE_VERSION__$3')
        .replace(/    <!-- PREFETCH_LINKS_START -->[\s\S]*?<!-- PREFETCH_LINKS_END -->/, '    <!-- PREFETCH_LINKS_START -->\n    <!-- PREFETCH_LINKS_END -->');
}

function normalizeSwContent(content) {
    return content
        .replace(/const CACHE_NAME = 'baie-des-naufrages-v[^']+';/, "const CACHE_NAME = 'baie-des-naufrages-v__SITE_CACHE_KEY__';")
        .replace(/\/style\.min\.css\?v=[^']+/g, '/style.min.css?v=__SITE_CACHE_KEY__')
        .replace(/\/js\/main\.bundle\.min\.js\?v=[^']+/g, '/js/main.bundle.min.js?v=__SITE_CACHE_KEY__')
        .replace(/\/js\/core\/consent\.js\?v=[^']+/g, '/js/core/consent.js?v=__SITE_CACHE_KEY__')
        .replace(/\/js\/core\/sw-register\.js\?v=[^']+/g, '/js/core/sw-register.js?v=__SITE_CACHE_KEY__')
        // Neutraliser les chemins de chunks pour le calcul du hash (ils changent à chaque build)
        .replace(/\/\/ CHUNKS_START[\s\S]*?\/\/ CHUNKS_END/, '// CHUNKS_START\n    // CHUNKS_END');
}

function getNormalizedFileContent(filePath) {
    const buffer = readFileSync(filePath);
    if (filePath === 'index.html') {
        return Buffer.from(normalizeIndexContent(buffer.toString('utf8')), 'utf8');
    }

    if (filePath === 'sw.js') {
        return Buffer.from(normalizeSwContent(buffer.toString('utf8')), 'utf8');
    }

    return buffer;
}

function computeSourceHash() {
    const hash = createHash('sha256');

    for (const filePath of getTrackedSourceFiles()) {
        hash.update(filePath);
        hash.update('\n');
        hash.update(getNormalizedFileContent(filePath));
        hash.update('\n');
    }

    return hash.digest('hex');
}

function applyVersionToIndex(content, displayVersion, cacheKey) {
    return content
        .replace(/style\.min\.css\?v=[^"'\s>]+/g, `style.min.css?v=${cacheKey}`)
        .replace(/\/js\/main\.bundle\.min\.js\?v=[^"'\s>]+/g, `/js/main.bundle.min.js?v=${cacheKey}`)
        .replace(/\/js\/core\/consent\.js\?v=[^"'\s>]+/g, `/js/core/consent.js?v=${cacheKey}`)
        .replace(/\/js\/core\/sw-register\.js\?v=[^"'\s>]+/g, `/js/core/sw-register.js?v=${cacheKey}`)
        .replace(/(<span id="siteVersionDisplay"[^>]*>)([^<]*)(<\/span>)/, `$1Version ${displayVersion}$3`);
}

function applyVersionToSw(content, cacheKey) {
    return content
        .replace(/const CACHE_NAME = 'baie-des-naufrages-[^']+';/, `const CACHE_NAME = 'baie-des-naufrages-${cacheKey}';`)
        .replace(/\/style\.min\.css\?v=[^']+/g, `/style.min.css?v=${cacheKey}`)
        .replace(/\/js\/main\.bundle\.min\.js\?v=[^']+/g, `/js/main.bundle.min.js?v=${cacheKey}`)
        .replace(/\/js\/core\/consent\.js\?v=[^']+/g, `/js/core/consent.js?v=${cacheKey}`)
        .replace(/\/js\/core\/sw-register\.js\?v=[^']+/g, `/js/core/sw-register.js?v=${cacheKey}`);
}

function updateVersionedFiles(displayVersion, cacheKey) {
    const indexContent = readFileSync('index.html', 'utf8');
    const swContent = readFileSync('sw.js', 'utf8');

    writeFileSync('index.html', applyVersionToIndex(indexContent, displayVersion, cacheKey), 'utf8');
    writeFileSync('sw.js', applyVersionToSw(swContent, cacheKey), 'utf8');
}

function writeVersionState(version, sourceHash) {
    const displayVersion = formatDisplayVersion(version);
    const cacheKey = `v${displayVersion.replace('.', '-')}`;
    const payload = {
        major: version.major,
        minor: version.minor,
        displayVersion,
        cacheKey,
        sourceHash,
        updatedAt: new Date().toISOString()
    };

    writeFileSync(VERSION_STATE_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
    const previousState = readVersionState();
    const sourceHash = computeSourceHash();
    const shouldBumpVersion = previousState.sourceHash !== sourceHash;
    const nextVersion = shouldBumpVersion ? incrementVersion(previousState) : {
        major: previousState.major,
        minor: previousState.minor
    };
    const displayVersion = formatDisplayVersion(nextVersion);
    const cacheKey = `v${displayVersion.replace('.', '-')}`;

    updateVersionedFiles(displayVersion, cacheKey);
    writeVersionState(nextVersion, sourceHash);

    // Nettoyer les chunks obsolètes avant de rebuilder
    if (existsSync('js/chunks')) {
        rmSync('js/chunks', { recursive: true, force: true });
    }

    const before = {
        script: gzipSize('script.js'),
        css: gzipSize('style.css')
    };

    await build({
        entryPoints: { 'main.bundle.min': 'script.js' },
        bundle: true,
        splitting: true,
        minify: true,
        format: 'esm',
        target: ['es2020'],
        outdir: 'js',
        entryNames: '[name]',
        chunkNames: 'chunks/[name]-[hash]',
        legalComments: 'none',
        pure: ['console.log', 'console.debug', 'console.info'],
        logLevel: 'info'
    });

    await build({
        entryPoints: ['style.css'],
        bundle: false,
        minify: true,
        outfile: 'style.min.css',
        legalComments: 'none',
        logLevel: 'info'
    });

    // Injecter les chunks dans sw.js pour le précache PWA offline
    const chunkPaths = readdirSync('js/chunks')
        .sort()
        .map((f) => `    '/js/chunks/${f}',`);
    const swContent = readFileSync('sw.js', 'utf8');
    const swUpdated = swContent.replace(
        /\/\/ CHUNKS_START[\s\S]*?\/\/ CHUNKS_END/,
        `// CHUNKS_START\n${chunkPaths.join('\n')}\n    // CHUNKS_END`
    );
    writeFileSync('sw.js', swUpdated, 'utf8');

    const after = {
        bundle: gzipSize('js/main.bundle.min.js'),
        css: gzipSize('style.min.css')
    };

    // Injecter les prefetch links dans index.html (chunks JS uniquement)
    const chunkFiles = readdirSync('js/chunks').sort();
    const chunkPrefetchLinks = chunkFiles.map((f) => `    <link rel="prefetch" href="/js/chunks/${f}" as="script" crossorigin>`);
    const prefetchBlock = chunkPrefetchLinks.join('\n');
    const indexFinal = readFileSync('index.html', 'utf8').replace(
        /    <!-- PREFETCH_LINKS_START -->[\s\S]*?<!-- PREFETCH_LINKS_END -->/,
        `    <!-- PREFETCH_LINKS_START -->\n${prefetchBlock}\n    <!-- PREFETCH_LINKS_END -->`
    );
    writeFileSync('index.html', indexFinal, 'utf8');

    console.log('\n=== Version ===');
    console.log(`Version site    : ${displayVersion}${shouldBumpVersion ? ' (mise a jour)' : ' (inchangée)'}`);
    console.log(`Cle de cache    : ${cacheKey}`);

    console.log('\n=== Tailles ===');
    console.log(`script.js       : ${formatKilobytes(before.script.raw)} raw / ${formatKilobytes(before.script.gz)} gz`);
    console.log(`main.bundle.min : ${formatKilobytes(after.bundle.raw)} raw / ${formatKilobytes(after.bundle.gz)} gz  (bundle principal)`);
    console.log(`style.css       : ${formatKilobytes(before.css.raw)} raw / ${formatKilobytes(before.css.gz)} gz`);
    console.log(`style.min.css   : ${formatKilobytes(after.css.raw)} raw / ${formatKilobytes(after.css.gz)} gz`);
    const savedCssGzip = before.css.gz - after.css.gz;
    console.log(`\nGain CSS gz     : ${formatKilobytes(savedCssGzip)} (-${(100 * savedCssGzip / before.css.gz).toFixed(1)}%)`);
    console.log(`\nPrefetch injectés : ${chunkFiles.length} chunks JS`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
