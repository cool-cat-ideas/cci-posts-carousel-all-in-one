import test from 'node:test';
import assert from 'node:assert/strict';
import { carouselSummary, carouselConfigurationStats } from '../src/admin-v2/lib/carousel-statistics.mjs';
const item = (status, config = {}) => ({ post_status: status, params: JSON.stringify(config) });

test('saved totals exclude deleted and automatic drafts without calling private or scheduled items drafts', () => {
    const input = ['publish','draft','private','pending','future','trash','auto-draft','inherit'].map(s => item(s));
    assert.deepEqual(carouselSummary(input), { total: 5, published: 1, unpublished: 4 });
    assert.deepEqual(carouselSummary([]), { total: 0, published: 0, unpublished: 0 });
});

test('current and legacy manual selections count together, query leftovers do not', () => {
    const result = carouselConfigurationStats([
        item('publish', {source:{mode:'manual'},curation:{items:[{id:1},{id:2},{type:'image'}]},engine:{name:'swiper'}}),
        item('draft', {post_selection_options:{posts:[{value:3},{value:4}]},carousel_type:'owl-carousel'}),
        item('publish', {source:{mode:'query'},curation:{items:[{id:9}]}}),
        item('trash', {post_selection_options:{posts:[1,2,3]}}),
    ]);
    assert.equal(result.total, 3);
    assert.equal(result.totalSlides, 5);
    assert.equal(result.manualCarousels, 2);
    assert.equal(result.averageSlides, 2.5);
    assert.deepEqual(result.engines, [['owl-carousel',2],['swiper',1]]);
    assert.deepEqual(result.renderers, [['php',3]]);
});

test('unreadable configurations do not invent default engine, renderer or template counts', () => {
    const result = carouselConfigurationStats([{post_status:'publish',params:'broken'}, item('draft',null), item('draft',[])]);
    assert.equal(result.total,3);
    assert.equal(result.invalidConfigs,3);
    assert.equal(result.totalSlides,0);
    assert.equal(result.averageSlides,0);
    assert.deepEqual(result.engines,[]);
});

test('canonical configuration wins over stale aliases and object-valued settings are accepted', () => {
    const result = carouselConfigurationStats([{post_status:'publish',params:{engine:{name:'swiper'},carousel_type:'owl-carousel',template:{name:'aurora'},renderer:'react',source:{mode:'manual'},curation:{items:[]}}}]);
    assert.deepEqual(result.engines,[['swiper',1]]);
    assert.deepEqual(result.templates,[['aurora',1]]);
    assert.deepEqual(result.renderers,[['react',1]]);
    assert.equal(result.manualCarousels,1);
    assert.equal(result.averageSlides,0);
});
