// Navire Maths — calculatrice scientifique, convertisseur, outils.
// Extracted verbatim from script.js during the ES-modules migration.
//
// DOM refs (calculatorDisplay, converterCategory, etc.) are resolved
// lazily inside each function.

import { formatMathNumber } from '../core/utils.js';

export const UNIT_GROUPS = {
    length: {
        label: 'Longueur',
        units: [
            { value: 'mm', label: 'Millimetre', factor: 0.001 },
            { value: 'cm', label: 'Centimetre', factor: 0.01 },
            { value: 'm', label: 'Metre', factor: 1 },
            { value: 'km', label: 'Kilometre', factor: 1000 }
        ]
    },
    mass: {
        label: 'Masse',
        units: [
            { value: 'mg', label: 'Milligramme', factor: 0.000001 },
            { value: 'g', label: 'Gramme', factor: 0.001 },
            { value: 'kg', label: 'Kilogramme', factor: 1 },
            { value: 't', label: 'Tonne', factor: 1000 }
        ]
    },
    time: {
        label: 'Temps',
        units: [
            { value: 's', label: 'Seconde', factor: 1 },
            { value: 'min', label: 'Minute', factor: 60 },
            { value: 'h', label: 'Heure', factor: 3600 },
            { value: 'd', label: 'Jour', factor: 86400 }
        ]
    },
    temperature: {
        label: 'Temperature',
        units: [
            { value: 'c', label: 'Celsius' },
            { value: 'f', label: 'Fahrenheit' },
            { value: 'k', label: 'Kelvin' }
        ]
    }
};

// --- Calculator ---

export function normalizeCalculatorExpression(expression) {
    const mathFunctions = ['sqrt', 'cbrt', 'abs', 'exp', 'log', 'log2', 'log10', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'floor', 'ceil', 'round', 'sign'];
    let normalized = expression
        .replace(/(\d),(\d)/g, '$1.$2')
        .replace(/[xÃ—]/gi, '*')
        .replace(/[Ã·]/g, '/')
        .replace(/\bpi\b/gi, 'Math.PI')
        .replace(/\be\b/g, 'Math.E')
        .replace(/\^/g, '**');

    mathFunctions.forEach((name) => {
        normalized = normalized.replace(new RegExp(`\\b${name}\\(`, 'gi'), `Math.${name}(`);
    });

    return normalized;
}

export function evaluateCalculatorExpression() {
    const calculatorDisplay = document.getElementById('calculatorDisplay');
    const calculatorStatus = document.getElementById('calculatorStatus');
    if (!calculatorDisplay || !calculatorStatus) {
        return;
    }

    const rawExpression = calculatorDisplay.value.trim();

    if (!rawExpression) {
        calculatorStatus.textContent = 'Entre une expression à calculer.';
        calculatorStatus.classList.remove('feedback-success');
        calculatorStatus.classList.add('feedback-error');
        return;
    }

    const normalizedExpression = normalizeCalculatorExpression(rawExpression);

    if (!/^(?:[0-9+\-*/().%\s]|Math\.(?:PI|E|abs|sqrt|cbrt|exp|log|log2|log10|sin|cos|tan|asin|acos|atan|floor|ceil|round|sign))+$/.test(normalizedExpression)) {
        calculatorStatus.textContent = 'Expression invalide.';
        calculatorStatus.classList.remove('feedback-success');
        calculatorStatus.classList.add('feedback-error');
        return;
    }

    try {
        const result = Function(`"use strict"; return (${normalizedExpression});`)();

        if (!Number.isFinite(result)) {
            throw new Error('Resultat non fini');
        }

        calculatorDisplay.value = String(Number(result.toFixed(10)));
        calculatorStatus.textContent = `Résultat : ${formatMathNumber(result, 10)}`;
        calculatorStatus.classList.remove('feedback-error');
        calculatorStatus.classList.add('feedback-success');
    } catch (_error) {
        calculatorStatus.textContent = "Calcul impossible. Vérifie l'expression.";
        calculatorStatus.classList.remove('feedback-success');
        calculatorStatus.classList.add('feedback-error');
    }
}

// --- Converter ---

export function populateConverterUnits(categoryKey) {
    const converterFrom = document.getElementById('converterFrom');
    const converterTo = document.getElementById('converterTo');
    const group = UNIT_GROUPS[categoryKey];

    if (!group || !converterFrom || !converterTo) {
        return;
    }

    const optionsMarkup = group.units.map((unit) => `
        <option value="${unit.value}">${unit.label}</option>
    `).join('');

    converterFrom.innerHTML = optionsMarkup;
    converterTo.innerHTML = optionsMarkup;
    converterTo.selectedIndex = Math.min(1, group.units.length - 1);
}

export function convertTemperature(value, from, to) {
    let celsiusValue = value;

    if (from === 'f') {
        celsiusValue = (value - 32) * (5 / 9);
    } else if (from === 'k') {
        celsiusValue = value - 273.15;
    }

    if (to === 'f') {
        return (celsiusValue * 9 / 5) + 32;
    }

    if (to === 'k') {
        return celsiusValue + 273.15;
    }

    return celsiusValue;
}

export function convertUnits() {
    const converterCategory = document.getElementById('converterCategory');
    const converterValue = document.getElementById('converterValue');
    const converterFrom = document.getElementById('converterFrom');
    const converterTo = document.getElementById('converterTo');
    const converterResult = document.getElementById('converterResult');

    if (!converterCategory || !converterValue || !converterFrom || !converterTo || !converterResult) {
        return;
    }

    const categoryKey = converterCategory.value;
    const group = UNIT_GROUPS[categoryKey];
    const value = Number(converterValue.value);

    if (!group || Number.isNaN(value)) {
        converterResult.textContent = 'Entre une valeur valide pour convertir.';
        return;
    }

    const from = converterFrom.value;
    const to = converterTo.value;
    let result = value;

    if (categoryKey === 'temperature') {
        result = convertTemperature(value, from, to);
    } else {
        const fromUnit = group.units.find((unit) => unit.value === from);
        const toUnit = group.units.find((unit) => unit.value === to);

        if (!fromUnit || !toUnit) {
            converterResult.textContent = 'Conversion indisponible.';
            return;
        }

        result = (value * fromUnit.factor) / toUnit.factor;
    }

    const fromLabel = group.units.find((unit) => unit.value === from)?.label || from;
    const toLabel = group.units.find((unit) => unit.value === to)?.label || to;
    converterResult.textContent = `${formatMathNumber(value)} ${fromLabel} = ${formatMathNumber(result)} ${toLabel}`;
}

export function initializeConverter() {
    const converterCategory = document.getElementById('converterCategory');
    if (!converterCategory) {
        return;
    }

    converterCategory.innerHTML = Object.entries(UNIT_GROUPS).map(([value, group]) => `
        <option value="${value}">${group.label}</option>
    `).join('');

    populateConverterUnits(converterCategory.value || 'length');
}

// --- Tools ---

export function calculatePercentage() {
    const percentageRate = document.getElementById('percentageRate');
    const percentageBase = document.getElementById('percentageBase');
    const percentageResult = document.getElementById('percentageResult');
    if (!percentageRate || !percentageBase || !percentageResult) {
        return;
    }
    const rate = Number(percentageRate.value);
    const base = Number(percentageBase.value);

    if (Number.isNaN(rate) || Number.isNaN(base)) {
        percentageResult.textContent = 'Entre un pourcentage et une valeur valides.';
        return;
    }

    const result = (rate / 100) * base;
    percentageResult.textContent = `${formatMathNumber(rate)}% de ${formatMathNumber(base)} = ${formatMathNumber(result)}`;
}

export function calculateRuleOfThree() {
    const ruleThreeA = document.getElementById('ruleThreeA');
    const ruleThreeB = document.getElementById('ruleThreeB');
    const ruleThreeC = document.getElementById('ruleThreeC');
    const ruleThreeResult = document.getElementById('ruleThreeResult');
    if (!ruleThreeA || !ruleThreeB || !ruleThreeC || !ruleThreeResult) {
        return;
    }
    const a = Number(ruleThreeA.value);
    const b = Number(ruleThreeB.value);
    const c = Number(ruleThreeC.value);

    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(c) || a === 0) {
        ruleThreeResult.textContent = 'Entre trois valeurs valides et un a différent de 0.';
        return;
    }

    const result = (b * c) / a;
    ruleThreeResult.textContent = `Si ${formatMathNumber(a)} correspond à ${formatMathNumber(b)}, alors ${formatMathNumber(c)} correspond à ${formatMathNumber(result)}.`;
}

export function calculateCircle() {
    const circleRadius = document.getElementById('circleRadius');
    const circleResult = document.getElementById('circleResult');
    if (!circleRadius || !circleResult) {
        return;
    }
    const radius = Number(circleRadius.value);

    if (Number.isNaN(radius) || radius < 0) {
        circleResult.textContent = 'Entre un rayon valide.';
        return;
    }

    const diameter = radius * 2;
    const circumference = 2 * Math.PI * radius;
    const area = Math.PI * radius * radius;

    circleResult.textContent = `Diamètre : ${formatMathNumber(diameter)} | Circonférence : ${formatMathNumber(circumference)} | Aire : ${formatMathNumber(area)}`;
}
