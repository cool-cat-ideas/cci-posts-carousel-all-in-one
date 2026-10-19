import assert from 'node:assert/strict';
import test from 'node:test';
import { carouselTimings } from '../../src/shared/carousel-timing.mjs';
import { installSwiperTiming } from '../../src/front-app/engines/swiper-timing.mjs';

test('saved timing values remain independent and accept zero duration', () => {
  assert.deepEqual(
    carouselTimings({
      auto_play_timeout: 5000,
      auto_play_speed: 1200,
      nav_speed: 300,
      dots_speed: 800,
    }),
    {
      autoplay: 1200,
      delay: 5000,
      dots: 800,
      navigation: 300,
    },
  );
  assert.equal(carouselTimings({ nav_speed: 1200, auto_play_speed: 0 }).autoplay, 0);
  assert.deepEqual(
    carouselTimings({
      nav_speed: '',
      auto_play_timeout: -2,
      auto_play_speed: 'invalid',
      dots_speed: Infinity,
    }),
    {
      autoplay: 300,
      delay: 1200,
      dots: 300,
      navigation: 300,
    },
  );
});

function swiperFixture(loop = false) {
  const calls = [];
  const bullets = [{}, {}, {}];
  const listeners = new Map();
  const pagination = {
    addEventListener: (name, handler, capture) => listeners.set(`${name}-${capture}`, handler),
    removeEventListener: (name, handler, capture) => {
      assert.equal(listeners.get(`${name}-${capture}`), handler);
      listeners.delete(`${name}-${capture}`);
    },
  };
  const instance = {
    params: { loop, slidesPerGroup: 1, pagination: { clickable: true, type: 'bullets' } },
    pagination: { bullets },
    ...Object.fromEntries(
      ['slideNext', 'slidePrev', 'slideTo', 'slideToLoop'].map((name) => [
        name,
        function (...args) {
          assert.equal(this, instance);
          calls.push({ name, args });
          return true;
        },
      ]),
    ),
  };
  return { calls, bullets, listeners, pagination, instance };
}

test('native autoplay uses its own speed in both directions and at the last slide', () => {
  const { instance, calls, pagination, listeners } = swiperFixture();
  const original = instance.slideNext;
  const restore = installSwiperTiming(
    instance,
    carouselTimings({ auto_play_speed: 1200, nav_speed: 300 }),
    pagination,
  );
  instance.slideNext(300, true, true);
  instance.slidePrev(300, true, true);
  instance.slideTo(0, 300, true, true);
  assert.deepEqual(
    calls.map((call) => call.args[call.name === 'slideTo' ? 1 : 0]),
    [1200, 1200, 1200],
  );
  instance.slideNext(300);
  instance.slideTo(2, 0, false, true);
  assert.equal(calls[3].args[0], 300);
  assert.equal(calls[4].args[1], 0);
  instance.slideNext(0, true, true);
  instance.slideTo(0, 0, true, true);
  assert.equal(calls[5].args[0], 1200);
  assert.equal(calls[6].args[1], 1200);
  restore();
  assert.equal(instance.slideNext, original);
  assert.equal(listeners.size, 0);
});

for (const loop of [false, true]) {
  test(`pagination uses its own speed once with loop=${loop}`, () => {
    const { instance, calls, pagination, listeners, bullets } = swiperFixture(loop);
    const restore = installSwiperTiming(
      instance,
      carouselTimings({ nav_speed: 300, dots_speed: 900 }),
      pagination,
    );
    let prevented = 0;
    let stopped = 0;
    listeners.get('click-true')({
      target: { closest: () => bullets[2] },
      preventDefault: () => prevented++,
      stopImmediatePropagation: () => stopped++,
    });
    assert.deepEqual(calls, [{ name: loop ? 'slideToLoop' : 'slideTo', args: [2, 900] }]);
    assert.equal(prevented, 1);
    assert.equal(stopped, 1);
    restore();
  });
}
