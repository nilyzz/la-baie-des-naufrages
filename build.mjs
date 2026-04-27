#!/usr/bin/env node
// Build minifie pour La Baie des Naufrages.
// - Minifie style.css -> style.min.css
// - Minifie script.js -> script.min.js
// - Bundle js/main.js -> js/main.bundle.min.js
// - Maintient une version visible du site et les cles de cache associees.

import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
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
    'script.min.js',
    'style.min.css',
    'js/main.bundle.min.js',
    VERSION_STATE_PATH
]);

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
        .replace(/script\.min\.js\?v=[^"'\s>]+/g, 'script.min.js?v=__SITE_CACHE_KEY__')
        .replace(/\/js\/main\.bundle\.min\.js\?v=[^"'\s>]+/g, '/js/main.bundle.min.js?v=__SITE_CACHE_KEY__')
        .replace(/(<span id="siteVersionDisplay"[^>]*>)([^<]*)(<\/span>)/, '$1Version __SITE_VERSION__$3');
}

function normalizeSwContent(content) {
    return content
        .replace(/const CACHE_NAME = 'baie-des-naufrages-v[^']+';/, "const CACHE_NAME = 'baie-des-naufrages-v__SITE_CACHE_KEY__';")
        .replace(/\/style\.min\.css\?v=[^']+/g, '/style.min.css?v=__SITE_CACHE_KEY__')
        .replace(/\/script\.min\.js\?v=[^']+/g, '/script.min.js?v=__SITE_CACHE_KEY__')
        .replace(/\/js\/main\.bundle\.min\.js\?v=[^']+/g, '/js/main.bundle.min.js?v=__SITE_CACHE_KEY__');
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
        .replace(/script\.min\.js\?v=[^"'\s>]+/g, `script.min.js?v=${cacheKey}`)
        .replace(/\/js\/main\.bundle\.min\.js\?v=[^"'\s>]+/g, `/js/main.bundle.min.js?v=${cacheKey}`)
        .replace(/(<span id="siteVersionDisplay"[^>]*>)([^<]*)(<\/span>)/, `$1Version ${displayVersion}$3`);
}

function applyVersionToSw(content, cacheKey) {
    return content
        .replace(/const CACHE_NAME = 'baie-des-naufrages-[^']+';/, `const CACHE_NAME = 'baie-des-naufrages-${cacheKey}';`)
        .replace(/\/style\.min\.css\?v=[^']+/g, `/style.min.css?v=${cacheKey}`)
        .replace(/\/script\.min\.js\?v=[^']+/g, `/script.min.js?v=${cacheKey}`)
        .replace(/\/js\/main\.bundle\.min\.js\?v=[^']+/g, `/js/main.bundle.min.js?v=${cacheKey}`);
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

    const before = {
        script: gzipSize('script.js'),
        main: gzipSize('js/main.js'),
        css: gzipSize('style.css')
    };

    await build({
        entryPoints: ['js/main.js'],
        bundle: true,
        minify: true,
        format: 'esm',
        target: ['es2020'],
        outfile: 'js/main.bundle.min.js',
        legalComments: 'none',
        logLevel: 'info'
    });

    await build({
        entryPoints: ['script.js'],
        bundle: false,
        minify: true,
        target: ['es2020'],
        outfile: 'script.min.js',
        legalComments: 'none',
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

    const after = {
        script: gzipSize('script.min.js'),
        main: gzipSize('js/main.bundle.min.js'),
        css: gzipSize('style.min.css')
    };

    const savedScriptGzip = before.script.gz - after.script.gz;
    const savedCssGzip = before.css.gz - after.css.gz;

    console.log('\n=== Version ===');
    console.log(`Version site    : ${displayVersion}${shouldBumpVersion ? ' (mise a jour)' : ' (inchangée)'}`);
    console.log(`Cle de cache    : ${cacheKey}`);

    console.log('\n=== Tailles ===');
    console.log(`script.js       : ${formatKilobytes(before.script.raw)} raw / ${formatKilobytes(before.script.gz)} gz`);
    console.log(`script.min.js   : ${formatKilobytes(after.script.raw)} raw / ${formatKilobytes(after.script.gz)} gz`);
    console.log(`main.js (seul)  : ${formatKilobytes(before.main.raw)} raw / ${formatKilobytes(before.main.gz)} gz`);
    console.log(`main.bundle.min : ${formatKilobytes(after.main.raw)} raw / ${formatKilobytes(after.main.gz)} gz  (inclut ~45 modules)`);
    console.log(`style.css       : ${formatKilobytes(before.css.raw)} raw / ${formatKilobytes(before.css.gz)} gz`);
    console.log(`style.min.css   : ${formatKilobytes(after.css.raw)} raw / ${formatKilobytes(after.css.gz)} gz`);
    console.log(`\nGain script.js gz : ${formatKilobytes(savedScriptGzip)} (-${(100 * savedScriptGzip / before.script.gz).toFixed(1)}%)`);
    console.log(`Gain CSS gz       : ${formatKilobytes(savedCssGzip)} (-${(100 * savedCssGzip / before.css.gz).toFixed(1)}%)`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
