import test from 'node:test';
import assert from 'node:assert/strict';
import {
  recentCarousels,
  sortCarousels,
  carouselSummary,
  carouselContentSummary,
  carouselConfigurationStats,
} from '../src/admin-v2/lib/carousel-statistics.mjs';

const item = (status, config = {}) => ({ post_status: status, params: JSON.stringify(config) });

test('saved totals exclude deleted and automatic drafts without calling private or scheduled items drafts', () => {
  const input = [
    'publish',
    'draft',
    'private',
    'pending',
    'future',
    'trash',
    'auto-draft',
    'inherit',
  ].map((s) => item(s));
  assert.deepEqual(carouselSummary(input), { total: 5, published: 1, unpublished: 4 });
  assert.deepEqual(carouselSummary([]), { total: 0, published: 0, unpublished: 0 });
});

test('current and legacy manual selections count together, query leftovers do not', () => {
  const result = carouselConfigurationStats([
    item('publish', {
      source: { mode: 'manual' },
      curation: { items: [{ id: 1 }, { id: 2 }, { type: 'image' }] },
      engine: { name: 'swiper' },
    }),
    item('draft', {
      post_selection_options: { posts: [{ value: 3 }, { value: 4 }] },
      carousel_type: 'owl-carousel',
    }),
    item('publish', { source: { mode: 'query' }, curation: { items: [{ id: 9 }] } }),
    item('trash', { post_selection_options: { posts: [1, 2, 3] } }),
  ]);
  assert.equal(result.total, 3);
  assert.equal(result.totalSlides, 5);
  assert.equal(result.manualCarousels, 2);
  assert.equal(result.averageSlides, 2.5);
  assert.deepEqual(result.engines, [
    ['owl-carousel', 2],
    ['swiper', 1],
  ]);
  assert.deepEqual(result.renderers, [['php', 3]]);
});

test('unreadable configurations do not invent default engine, renderer or template counts', () => {
  const result = carouselConfigurationStats([
    { post_status: 'publish', params: 'broken' },
    item('draft', null),
    item('draft', []),
  ]);
  assert.equal(result.total, 3);
  assert.equal(result.invalidConfigs, 3);
  assert.equal(result.totalSlides, 0);
  assert.equal(result.averageSlides, 0);
  assert.deepEqual(result.engines, []);
});

test('canonical configuration wins over stale aliases and object-valued settings are accepted', () => {
  const result = carouselConfigurationStats([
    {
      post_status: 'publish',
      params: {
        engine: { name: 'swiper' },
        carousel_type: 'owl-carousel',
        template: { name: 'aurora' },
        renderer: 'react',
        source: { mode: 'manual' },
        curation: { items: [] },
      },
    },
  ]);
  assert.deepEqual(result.engines, [['swiper', 1]]);
  assert.deepEqual(result.templates, [['aurora', 1]]);
  assert.deepEqual(result.renderers, [['react', 1]]);
  assert.equal(result.manualCarousels, 1);
  assert.equal(result.averageSlides, 0);
});

test('recent work follows configuration updates rather than creation IDs and does not mutate the full list', () => {
  const rows = [
    { ID: 90, post_status: 'publish', post_modified: '2026-01-01 10:00:00' },
    {
      ID: 1,
      post_status: 'draft',
      post_modified: '2026-01-01 10:00:00',
      carousel_modified: '2026-11-10 10:00:00',
    },
    { ID: 99, post_status: 'trash', post_modified: '2026-12-01 10:00:00' },
    { ID: 2, post_status: 'publish', post_modified: '2026-11-10 09:00:00' },
  ];
  assert.deepEqual(
    recentCarousels(rows, 2).map((row) => row.ID),
    [1, 2],
  );
  assert.deepEqual(
    rows.map((row) => row.ID),
    [90, 1, 99, 2],
  );
});

test('management sorting handles numeric titles and shortcode IDs without changing the source list', () => {
  const rows = [
    {
      ID: 10,
      post_status: 'draft',
      post_title: 'Carousel 10',
      modified_by_name: 'Zoë',
      post_modified: '2026-10-10 11:00:00',
    },
    {
      ID: 2,
      post_status: 'publish',
      post_title: 'carousel 2',
      modified_by_name: 'Anna',
      carousel_modified: '2026-11-10 11:00:00',
    },
  ];
  assert.deepEqual(
    sortCarousels(rows, { key: 'title', direction: 'asc' }, 'en').map((row) => row.ID),
    [2, 10],
  );
  assert.deepEqual(
    sortCarousels(rows, { key: 'shortcode', direction: 'desc' }, 'en').map((row) => row.ID),
    [10, 2],
  );
  assert.deepEqual(
    sortCarousels(rows, { key: 'date', direction: 'desc' }, 'en').map((row) => row.ID),
    [2, 10],
  );
  assert.deepEqual(
    rows.map((row) => row.ID),
    [10, 2],
  );
});
test('editor sorting keeps unrecorded users last in both directions and ties deterministic', () => {
  const rows = [
    { ID: 1, post_status: 'publish', modified_by_name: '' },
    { ID: 2, post_status: 'draft', modified_by_name: 'Anna' },
    { ID: 3, post_status: 'publish', modified_by_name: 'anna' },
    { ID: 4, post_status: 'publish', modified_by_name: 'Zoë' },
  ];
  assert.deepEqual(
    sortCarousels(rows, { key: 'editor', direction: 'asc' }, 'en').map((row) => row.ID),
    [3, 2, 4, 1],
  );
  assert.deepEqual(
    sortCarousels(rows, { key: 'editor', direction: 'desc' }, 'en').map((row) => row.ID),
    [4, 3, 2, 1],
  );
  assert.deepEqual(
    sortCarousels(rows, { key: 'status', direction: 'asc' }, 'en').map((row) => row.ID),
    [2, 4, 3, 1],
  );
});

test('Dashboard content describes saved selections without inventing live query counts', () => {
  assert.deepEqual(
    carouselContentSummary({
      params: { source: { mode: 'manual' }, curation: { items: [{ id: 1 }, { id: 2 }] } },
    }),
    { mode: 'manual', types: [], selected: 2 },
  );
  assert.deepEqual(
    carouselContentSummary({
      params: {
        source: { mode: 'query', post_types: ['product'] },
        curation: { items: [{ id: 1 }] },
      },
    }),
    { mode: 'query', types: ['product'], selected: null },
  );
  assert.deepEqual(
    carouselContentSummary({
      params: {
        source: { mode: 'hybrid', post_types: ['post'] },
        curation: { items: [{ id: 1 }] },
      },
    }),
    { mode: 'hybrid', types: ['post'], selected: null },
  );
  assert.deepEqual(
    carouselContentSummary({
      params: JSON.stringify({
        post_selection_options: {
          mode: 'manual',
          post_types: [{ value: 'page' }],
          posts: [{ id: 4 }],
        },
      }),
    }),
    { mode: 'manual', types: ['page'], selected: 1 },
  );
  assert.equal(carouselContentSummary({ params: 'invalid' }), null);
  assert.equal(carouselContentSummary({ params: {} }), null);
});
