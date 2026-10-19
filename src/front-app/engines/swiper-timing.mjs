/** Keep native Swiper autoplay while giving each interaction its saved duration. */
export function installSwiperTiming(instance, timings, paginationEl) {
  const originals = new Map();
  for (const [method, speedIndex, internalIndex] of [
    ['slideNext', 0, 2],
    ['slidePrev', 0, 2],
    ['slideTo', 1, 3],
  ]) {
    const original = instance[method];
    originals.set(method, original);
    instance[method] = function (...args) {
      // Autoplay uses callbacks; internal loop repairs pass runCallbacks=false.
      if (args[internalIndex] === true && args[speedIndex + 1] !== false) {
        args[speedIndex] = timings.autoplay;
      }
      return original.apply(this, args);
    };
  }

  const selectPage = (event) => {
    if (instance.destroyed || instance.enabled === false) {
      return;
    }
    const bullet = event.target?.closest?.('.swiper-pagination-bullet');
    const page = Array.from(instance.pagination?.bullets || []).indexOf(bullet);
    if (page < 0) {
      return;
    }
    // Handle this click once instead of also running Swiper's shared-speed handler.
    event.preventDefault();
    event.stopImmediatePropagation();
    const index = page * instance.params.slidesPerGroup;
    if (instance.params.loop) {
      instance.slideToLoop(index, timings.dots);
    } else {
      instance.slideTo(index, timings.dots);
    }
  };
  const pagination =
    typeof instance.params.pagination === 'object' ? instance.params.pagination : {};
  if (pagination.clickable && pagination.type === 'bullets') {
    paginationEl?.addEventListener('click', selectPage, true);
  }

  return () => {
    paginationEl?.removeEventListener('click', selectPage, true);
    for (const [method, original] of originals) {
      instance[method] = original;
    }
  };
}
