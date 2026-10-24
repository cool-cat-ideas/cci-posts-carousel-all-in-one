export function installTwoRows(runtime) {
  const instances = new Map();
  const truthy = (value, fallback = false) =>
    value == null ? fallback : [true, 1, '1', 'true'].includes(value);
  const number = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const node = (tag, className) => Object.assign(document.createElement(tag), { className });

  function mount(root, data) {
    instances.get(root)?.destroy();
    const cards = Array.from(root.children).filter((child) => child.matches('.cci-wpc-slide'));
    if (!cards.length) return;
    const saved = data.engine.options;
    const engine = data.engine.name === 'swiper' ? 'swiper' : 'owl-carousel';
    const preview = root.closest('[data-wpc-preview-viewport]');
    const width = () => (preview ? preview.clientWidth : window.innerWidth);
    const desiredRows = () => (width() <= saved.rows_mobile_max ? saved.mobile_rows : 2);
    let rows = 0;
    let cleanup = null;
    let generation = 0;
    let firstCard = Math.max(0, number(saved.start_position, 0));
    let disposed = false;
    root.classList.add('cci-two-rows');
    root.style.setProperty('--cci-row-gap', saved.row_gap + 'px');

    async function rebuild() {
      if (disposed || desiredRows() === rows) return;
      const ticket = ++generation;
      cleanup?.();
      cleanup = null;
      rows = desiredRows();
      root.dataset.rows = rows;
      root.style.setProperty('--cci-rows', rows);
      root.replaceChildren();
      const viewport = node('div', 'cci-rows-viewport');
      const track = node('div', 'cci-rows-track');
      // Reuse the PHP templates' navigation contract for both engines.
      const previous = node('button', 'cci-rows-prev owl-prev');
      const next = node('button', 'cci-rows-next owl-next');
      const pagination = node('div', 'cci-rows-pagination owl-dots');
      if (engine === 'swiper') pagination.classList.add('cci-wpc-render-preview-dots');
      const controls = node('div', 'cci-rows-controls owl-nav');
      for (const [button, direction] of [
        [previous, 'previous'],
        [next, 'next'],
      ]) {
        button.type = 'button';
        button.setAttribute(
          'aria-label',
          root.dataset[direction === 'previous' ? 'wpcPrevLabel' : 'wpcNextLabel'] || direction,
        );
        const icon = saved.navigation_icons?.[direction];
        if (icon?.html) button.innerHTML = icon.html;
        else if (icon?.className) button.append(node('i', icon.className));
        else {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('aria-hidden', 'true');
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', direction === 'previous' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6');
          svg.append(path);
          button.append(svg);
        }
      }
      controls.append(previous, next);
      viewport.append(track);
      root.append(viewport, controls, pagination);
      const columns = [];
      for (let i = 0; i < cards.length; i += rows) {
        const column = node('div', 'cci-rows-column');
        column.append(...cards.slice(i, i + rows));
        track.append(column);
        columns.push(column);
      }
      const options = {
        ...saved,
        start_position: Math.floor(firstCard / rows),
        direction: 'horizontal',
        transition_effect: 'slide',
        auto_width: false,
        auto_height: false,
        center: false,
        animate_in: '',
        animate_out: '',
      };
      previous.hidden = next.hidden = !truthy(saved.nav, true);
      controls.hidden = !truthy(saved.nav, true);
      pagination.hidden = !truthy(saved.dots, true);
      const access = () =>
        requestAnimationFrame(() => {
          if (!root.isConnected || disposed || ticket !== generation) return;
          const bounds = viewport.getBoundingClientRect();
          root.querySelectorAll('.cci-rows-column').forEach((column) => {
            const rect = column.getBoundingClientRect();
            const visible = rect.right > bounds.left + 2 && rect.left < bounds.right - 2;
            column.inert = !visible;
            column.setAttribute('aria-hidden', String(!visible));
          });
        });
      try {
        if (engine === 'swiper') {
          viewport.classList.add('swiper');
          track.classList.add('swiper-wrapper');
          columns.forEach((column) => column.classList.add('swiper-slide'));
          const destroy = await runtime.getEngine('swiper').mount({
            root: viewport,
            options,
            slidesCount: columns.length,
            prevEl: previous,
            nextEl: next,
            paginationEl: pagination,
            onReady(instance) {
              if (instance) instance.on('transitionEnd resize', access);
            },
            onActiveIndexChange(index) {
              firstCard = index * rows;
              access();
            },
          });
          if (disposed || ticket !== generation) {
            destroy?.();
            return;
          }
          cleanup = destroy;
        } else {
          if (!window.jQuery?.fn?.owlCarousel) throw new Error('Owl Carousel is unavailable.');
          const $ = window.jQuery;
          track.classList.add('owl-carousel');
          const responsive = Object.fromEntries(
            Object.entries(saved.items_to_show || saved.breakpoints || { 0: 1 }).map(
              ([key, value]) => [key, { items: Math.max(1, number(value?.items ?? value, 1)) }],
            ),
          );
          $(track).on('changed.owl.carousel.cciRows', (event) => {
            const owl = $(track).data('owl.carousel');
            if (owl && event.property?.name === 'position')
              firstCard = owl.relative(event.property.value) * rows;
            access();
          });
          $(track).on('translated.owl.carousel.cciRows refreshed.owl.carousel.cciRows', access);
          $(track).owlCarousel({
            responsive,
            responsiveBaseElement: preview || window,
            items: 1,
            margin: number(saved.margin, 0),
            loop: truthy(saved.loop),
            rewind: truthy(saved.rewind),
            rtl: truthy(saved.rtl),
            startPosition: options.start_position,
            slideBy: Math.max(1, number(saved.slide_by, 1)),
            stagePadding: number(saved.stage_padding, 0),
            mouseDrag: truthy(saved.mouse_drag, true),
            touchDrag: truthy(saved.touch_drag, true),
            pullDrag: truthy(saved.pull_drag, true),
            freeDrag: truthy(saved.free_drag),
            autoplay: truthy(saved.auto_play) && !reduced(),
            autoplayTimeout: Math.max(1000, number(saved.auto_play_timeout, 5000)),
            autoplayHoverPause: truthy(saved.stop_on_hover, true),
            autoplaySpeed: reduced() ? 0 : number(saved.auto_play_speed, 400),
            smartSpeed: reduced() ? 0 : number(saved.nav_speed, 400),
            nav: false,
            dots: truthy(saved.dots, true),
            dotsContainer: pagination,
            dotsSpeed: reduced() ? 0 : number(saved.dots_speed, 400),
            onInitialized: access,
          });
          const prevClick = () => $(track).trigger('prev.owl.carousel');
          const nextClick = () => $(track).trigger('next.owl.carousel');
          previous.addEventListener('click', prevClick);
          next.addEventListener('click', nextClick);
          const sync = () => {
            const owl = $(track).data('owl.carousel');
            if (!owl) return;
            const position = owl.relative(owl.current());
            const allFit = columns.length <= owl.settings.items;
            previous.disabled =
              allFit || (!owl.settings.loop && !owl.settings.rewind && position === 0);
            next.disabled =
              allFit ||
              (!owl.settings.loop && !owl.settings.rewind && position >= owl.maximum(true));
            pagination.querySelectorAll('button').forEach((dot, index) => {
              dot.type = 'button';
              const label =
                window.wpPostsCarouselRuntimeConfig?.labels?.goToSlide || 'Go to slide %d';
              dot.setAttribute('aria-label', label.replace('%d', index + 1));
              dot.setAttribute('aria-current', dot.classList.contains('active') ? 'true' : 'false');
            });
          };
          $(track).on('changed.owl.carousel.cciRows refreshed.owl.carousel.cciRows', sync);
          sync();
          cleanup = () => {
            previous.removeEventListener('click', prevClick);
            next.removeEventListener('click', nextClick);
            $(track).off('.cciRows');
            $(track).trigger('destroy.owl.carousel');
          };
        }
        access();
        root.dataset.rowsReady = 'true';
        root.dispatchEvent(
          new CustomEvent('wp-posts-carousel:engine-ready', {
            bubbles: true,
            detail: { carousel: data, engine },
          }),
        );
      } catch (error) {
        if (disposed || ticket !== generation) return;
        cleanup?.();
        cleanup = null;
        root.replaceChildren(...cards);
        root.dataset.rowsReady = 'fallback';
        root.dispatchEvent(
          new CustomEvent('wp-posts-carousel:engine-error', { bubbles: true, detail: { error } }),
        );
      }
    }
    const onResize = () => {
      rebuild();
    };
    const observer = preview ? new ResizeObserver(onResize) : null;
    observer?.observe(preview);
    window.addEventListener('resize', onResize);
    instances.set(root, {
      destroy() {
        disposed = true;
        generation++;
        cleanup?.();
        observer?.disconnect();
        window.removeEventListener('resize', onResize);
        root.replaceChildren(...cards);
        instances.delete(root);
      },
    });
    rebuild();
  }
  runtime.hooks.addFilter('carouselRenderer', 'cci-two-rows', (renderer, root, data) =>
    data?.engine?.options?.rows === 2 ? 'cci-two-rows' : renderer,
  );
  runtime.registerRenderer('cci-two-rows', { mount });
  new MutationObserver(() => {
    for (const [root, instance] of instances) if (!root.isConnected) instance.destroy();
  }).observe(document.documentElement, { childList: true, subtree: true });
}
