import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveApiUrl } from '../../src/admin-v2/api/api-url.mjs';

const path = '/wp-json/wp-posts-carousel/v1/admin/posts?search=red%20cat&type=post&type=page';

test('plain permalinks preserve the REST route and query parameters', () => {
  const result = new URL(resolveApiUrl(path, 'https://example.test/site/?rest_route=/'));
  assert.equal(result.pathname, '/site/');
  assert.equal(result.searchParams.get('rest_route'), '/wp-posts-carousel/v1/admin/posts');
  assert.equal(result.searchParams.get('search'), 'red cat');
  assert.deepEqual(result.searchParams.getAll('type'), ['post', 'page']);
});

test('pretty permalinks support subdirectories and custom REST prefixes', () => {
  const result = new URL(resolveApiUrl(path, 'https://example.test/site/custom-api/'));
  assert.equal(result.pathname, '/site/custom-api/wp-posts-carousel/v1/admin/posts');
  assert.equal(result.searchParams.get('search'), 'red cat');
});

test('already resolved endpoints and non-REST paths stay unchanged', () => {
  for (const endpoint of ['https://example.test/?rest_route=/reviews', '/admin-ajax.php']) {
    assert.equal(resolveApiUrl(endpoint, 'https://example.test/wp-json/'), endpoint);
  }
  assert.equal(resolveApiUrl(path, undefined), path);
});
