import js from '@eslint/js';
import globals from 'globals';

export default [
    // Fichiers à ignorer
    {
        ignores: [
            'js/chunks/**',
            'js/main.bundle.min.js',
            'style.min.css',
            'node_modules/**'
        ]
    },

    // Modules ES côté client (js/ sauf server.js)
    {
        files: ['js/**/*.js', 'script.js', '__tests__/*.test.js'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021
            }
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
            'no-undef': 'error',
            'no-console': 'off',
            'eqeqeq': ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'warn',
            'no-duplicate-imports': 'error'
        }
    },

    // CommonJS côté serveur
    {
        files: ['server.js', 'build.mjs'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.es2021
            }
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
            'no-undef': 'error',
            'eqeqeq': ['error', 'always'],
            'no-var': 'off',
            'no-console': 'off'
        }
    },

    // build.mjs est ESM
    {
        files: ['build.mjs', 'vitest.config.js', 'eslint.config.js'],
        languageOptions: {
            sourceType: 'module',
            globals: { ...globals.node }
        }
    }
];
