import test from 'node:test';
import assert from 'node:assert/strict';
import { CURATED_CATALOG } from '../data/catalog';
import {
  getTrackStats,
  parseStoredTrack,
  removeFromTrack,
  toggleResourceInTrack,
  updateTrackNote,
  updateTrackStatus,
} from './trackStorage';

test('track storage lifecycle: add, status change, note update, serialize/parse, remove', () => {
  const sample = CURATED_CATALOG[0];
  let list = toggleResourceInTrack([], sample, '2026-11-22T10:00:00.000Z');
  assert.equal(list.length, 1);
  assert.equal(list[0].status, 'planned');

  list = updateTrackStatus(list, sample.id, 'in-progress');
  assert.equal(list[0].status, 'in-progress');

  list = updateTrackNote(list, sample.id, 'Регистрация до 15 декабря');
  assert.equal(list[0].deadlineNote, 'Регистрация до 15 декабря');

  const stats = getTrackStats(list);
  assert.deepEqual(stats, {
    total: 1,
    planned: 0,
    inProgress: 1,
    completed: 0,
  });

  const roundTrip = parseStoredTrack(JSON.stringify(list));
  assert.equal(roundTrip.length, 1);
  assert.equal(roundTrip[0].deadlineNote, 'Регистрация до 15 декабря');

  list = removeFromTrack(list, sample.id);
  assert.equal(list.length, 0);
});

test('parseStoredTrack safely rejects malformed JSON', () => {
  assert.deepEqual(parseStoredTrack('{invalid-json'), []);
  assert.deepEqual(parseStoredTrack('null'), []);
});
