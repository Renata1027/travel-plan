import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRoutePathD } from '../js/route-svg.js';

test('returns empty string for fewer than 2 waypoints', () => {
  assert.equal(buildRoutePathD([]), '');
  assert.equal(buildRoutePathD([{ x: 0, y: 0 }]), '');
});

test('builds a moveto + quadratic curve for two waypoints', () => {
  const d = buildRoutePathD([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
  assert.equal(d, 'M 0 0 Q 5.00 -3.00 10 0');
});

test('alternates wiggle direction across multiple segments', () => {
  const d = buildRoutePathD([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 20, y: 0 },
  ]);
  assert.equal(d, 'M 0 0 Q 5.00 -3.00 10 0 Q 15.00 3.00 20 0');
});

test('accepts a custom wiggle amount', () => {
  const d = buildRoutePathD([{ x: 0, y: 0 }, { x: 10, y: 0 }], { wiggle: 6 });
  assert.equal(d, 'M 0 0 Q 5.00 -6.00 10 0');
});
