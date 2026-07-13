import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeCategoryTotal, computeGrandTotal, formatCurrency } from '../js/budget.js';

test('computeCategoryTotal sums item amounts', () => {
  const items = [{ amount: 100 }, { amount: 250 }, { amount: 50 }];
  assert.equal(computeCategoryTotal(items), 400);
});

test('computeCategoryTotal returns 0 for an empty list', () => {
  assert.equal(computeCategoryTotal([]), 0);
});

test('computeGrandTotal sums totals across categories', () => {
  const categories = [
    { name: '交通', items: [{ amount: 300 }, { amount: 200 }] },
    { name: '住宿', items: [{ amount: 800 }] },
  ];
  assert.equal(computeGrandTotal(categories), 1300);
});

test('formatCurrency formats with thousands separator and default currency symbol', () => {
  assert.equal(formatCurrency(12345), '¥12,345');
});

test('formatCurrency accepts a custom currency symbol', () => {
  assert.equal(formatCurrency(999, '$'), '$999');
});

test('formatCurrency rounds fractional amounts', () => {
  assert.equal(formatCurrency(99.6), '¥100');
});
