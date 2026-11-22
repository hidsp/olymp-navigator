import test from 'node:test';
import assert from 'node:assert/strict';
import { CURATED_CATALOG } from '../data/catalog';
import {
  buildQueryFromFilters,
  countBySubject,
  DEFAULT_FILTERS,
  filterResources,
  formatGradesRange,
  hasActiveFilters,
} from './filters';

test('curated catalog covers all 5 subjects with at least 4 items each', () => {
  const counts = countBySubject(CURATED_CATALOG);
  assert.equal(counts.all, CURATED_CATALOG.length);
  assert.ok(counts.math >= 4);
  assert.ok(counts.physics >= 4);
  assert.ok(counts.informatics >= 4);
  assert.ok(counts.law >= 4);
  assert.ok(counts.english >= 4);
});

test('filterResources filters accurately by subject, format, level, and search text', () => {
  const physicsOnly = filterResources(CURATED_CATALOG, {
    ...DEFAULT_FILTERS,
    subject: 'physics',
  });
  assert.ok(physicsOnly.length > 0);
  assert.ok(physicsOnly.every((item) => item.subject === 'physics'));

  const lawArchives = filterResources(CURATED_CATALOG, {
    ...DEFAULT_FILTERS,
    subject: 'law',
    format: 'archive',
  });
  assert.ok(lawArchives.length >= 2);
  assert.ok(
    lawArchives.every((item) => item.subject === 'law' && item.format === 'archive')
  );

  const searchHse = filterResources(CURATED_CATALOG, {
    ...DEFAULT_FILTERS,
    localSearch: 'Высшая проба',
  });
  assert.ok(searchHse.length >= 2);
});

test('hasActiveFilters detects any active filter state', () => {
  assert.equal(hasActiveFilters(DEFAULT_FILTERS), false);
  assert.equal(
    hasActiveFilters({ ...DEFAULT_FILTERS, grade: 10 }),
    true
  );
  assert.equal(
    hasActiveFilters({ ...DEFAULT_FILTERS, localSearch: 'МФТИ' }),
    true
  );
});

test('buildQueryFromFilters constructs readable Russian search query', () => {
  const query = buildQueryFromFilters({
    ...DEFAULT_FILTERS,
    subject: 'law',
    format: 'intensive',
    grade: 10,
    level: 'vseros',
  });
  assert.ok(query.includes('Право'));
  assert.ok(query.includes('10 класс'));
  assert.ok(query.includes('интенсив'));
});

test('formatGradesRange formats contiguous and non-contiguous grade arrays', () => {
  assert.equal(formatGradesRange([9, 10, 11]), '9–11 кл.');
  assert.equal(formatGradesRange([10]), '10 кл.');
  assert.equal(formatGradesRange([9, 11]), '9, 11 кл.');
});
