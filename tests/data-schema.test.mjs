import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tripData } from '../js/data.js';

test('tripData has the required top-level sections', () => {
  assert.ok(tripData.trip, 'missing trip');
  assert.ok(Array.isArray(tripData.days), 'days must be an array');
  assert.ok(tripData.route && Array.isArray(tripData.route.waypoints), 'route.waypoints must be an array');
  assert.ok(tripData.budget && Array.isArray(tripData.budget.categories), 'budget.categories must be an array');
  assert.ok(Array.isArray(tripData.destinations), 'destinations must be an array');
});

test('trip has title, coverImage and tagline', () => {
  const { trip } = tripData;
  assert.equal(typeof trip.title, 'string');
  assert.equal(typeof trip.coverImage, 'string');
  assert.equal(typeof trip.tagline, 'string');
});

test('each day has a date and a non-empty items array', () => {
  for (const day of tripData.days) {
    assert.equal(typeof day.date, 'string');
    assert.ok(Array.isArray(day.items) && day.items.length > 0, `day ${day.date} needs items`);
  }
});

test('each route waypoint has x, y and a label', () => {
  for (const point of tripData.route.waypoints) {
    assert.equal(typeof point.x, 'number');
    assert.equal(typeof point.y, 'number');
    assert.equal(typeof point.label, 'string');
  }
});

test('each budget category has a name and items with numeric amounts', () => {
  for (const category of tripData.budget.categories) {
    assert.equal(typeof category.name, 'string');
    for (const item of category.items) {
      assert.equal(typeof item.label, 'string');
      assert.equal(typeof item.amount, 'number');
    }
  }
});

test('each destination has name, image and summary', () => {
  for (const dest of tripData.destinations) {
    assert.equal(typeof dest.name, 'string');
    assert.equal(typeof dest.image, 'string');
    assert.equal(typeof dest.summary, 'string');
  }
});
