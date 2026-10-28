import test from 'node:test';
import assert from 'node:assert/strict';
import { searchResults } from '../../src/admin-v2/api/search-results.mjs';

test('term/post lists remain usable when PHP filters preserve numeric keys', () => {
  const term = { value: '42', label: 'Category' };
  assert.deepEqual(searchResults([term]), [term]);
  assert.deepEqual(searchResults({ 9: term }), [term]);
  assert.deepEqual(searchResults({}), []);
});

test('error objects and non-list responses are not silently treated as results', () => {
  for (const payload of [
    null,
    false,
    'login page',
    { code: 'error', message: 'Failure' },
    { items: [] },
  ]) {
    assert.throws(() => searchResults(payload), /Invalid search response/);
  }
});
