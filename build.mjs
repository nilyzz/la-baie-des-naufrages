#!/usr/bin/env node
// Build minifié pour La Baie des Naufrages.
// - Bundle js/main.js (ESM tree) → js/main.bundle.min.js
// - Minify script.js → script.min.js
// Les sources restent inchangées ; seuls les .min.js sont servis en prod.

import { build } from 'esbuild';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const ROOT = new URL('./', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

function gzipSize(path) {
    const buf = readFileSync(path);
    return { raw: buf.length, gz: gzipSync(buf, { level: 9 }).length };
}

function fmt(n) { return (n / 1024).toFixed(1) + ' KB'; }

async function main() {
    const before = {
        script: gzipSize('script.js'),
        main: gzipSize('js/main.js'),
        css: gzipSize('style.css')
    };

    // 1. Bundle l'arbre ESM (main.js + ~45 modules) → un seul fichier.
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

    // 2. Minify le monolithe script.js (sans bundling — pas d'imports).
    await build({
        entryPoints: ['script.js'],
        bundle: false,
        minify: true,
        target: ['es2020'],
        outfile: 'script.min.js',
        legalComments: 'none',
        logLevel: 'info'
    });

    // 3. Minify style.css (aucun @import a resoudre, pas de bundling requis).
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

    console.log('\n=== Tailles ===');
    console.log(`script.js       : ${fmt(before.script.raw)} raw / ${fmt(before.script.gz)} gz`);
    console.log(`script.min.js   : ${fmt(after.script.raw)} raw / ${fmt(after.script.gz)} gz`);
    console.log(`main.js (seul)  : ${fmt(before.main.raw)} raw / ${fmt(before.main.gz)} gz`);
    console.log(`main.bundle.min : ${fmt(after.main.raw)} raw / ${fmt(after.main.gz)} gz  (inclut ~45 modules)`);
    console.log(`style.css       : ${fmt(before.css.raw)} raw / ${fmt(before.css.gz)} gz`);
    console.log(`style.min.css   : ${fmt(after.css.raw)} raw / ${fmt(after.css.gz)} gz`);

    const savedGz = (before.script.gz - after.script.gz);
    const savedCssGz = (before.css.gz - after.css.gz);
    console.log(`\nGain script.js gz : ${fmt(savedGz)} (-${(100 * savedGz / before.script.gz).toFixed(1)}%)`);
    console.log(`Gain CSS gz       : ${fmt(savedCssGz)} (-${(100 * savedCssGz / before.css.gz).toFixed(1)}%)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
