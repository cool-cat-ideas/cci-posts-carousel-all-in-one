const installed = new WeakSet();

/** One delegated handler also covers lazy output and Owl's cloned slides. */
export function installHoverImages(doc = document) {
  if (installed.has(doc)) return;
  installed.add(doc);
  const view = doc.defaultView;
  const media = view.matchMedia('(hover: hover) and (pointer: fine)');
  const states = new WeakMap();
  const active = new Set();
  const cardSelector = '.cci-wpc-slide, .cci-wpc-render-preview-slide';
  const restore = (img) => {
    const state = states.get(img);
    if (!state) return;
    state.active = false;
    active.delete(img);
    if (!state.swapped) return;
    for (const [name, value] of Object.entries(state.original)) {
      if (value === null) img.removeAttribute(name);
      else img.setAttribute(name, value);
    }
    img.style.height = state.height;
    img.removeAttribute('data-wpc-hover-active');
    state.swapped = false;
  };
  const swap = (img, state) => {
    if (!state.active || !img.isConnected || !media.matches) return;
    // Keep the primary image's box even if the second image has another ratio.
    state.height = img.style.height;
    img.style.height = `${img.getBoundingClientRect().height}px`;
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.setAttribute('src', state.url);
    img.setAttribute('data-wpc-hover-active', 'true');
    state.swapped = true;
  };
  doc.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse' || !media.matches) return;
    const card = event.target.closest?.(cardSelector);
    if (!card || card.contains(event.relatedTarget)) return;
    card.querySelectorAll('img[data-wpc-hover-src]').forEach((img) => {
      const url = img.getAttribute('data-wpc-hover-src');
      let state = states.get(img);
      if (state?.failed || state?.active) return;
      if (!state) {
        state = {
          url,
          original: Object.fromEntries(
            ['src', 'srcset', 'sizes'].map((key) => [key, img.getAttribute(key)]),
          ),
        };
        states.set(img, state);
      }
      state.active = true;
      active.add(img);
      if (state.ready) return swap(img, state);
      if (state.loading) return;
      state.loading = true;
      const preload = new view.Image();
      preload.decoding = 'async';
      preload.onload = () => {
        state.ready = true;
        swap(img, state);
      };
      preload.onerror = () => {
        state.failed = true;
        restore(img);
      };
      preload.src = url;
    });
  });
  doc.addEventListener('pointerout', (event) => {
    const card = event.target.closest?.(cardSelector);
    if (!card || card.contains(event.relatedTarget)) return;
    card.querySelectorAll('img[data-wpc-hover-src]').forEach(restore);
  });
  const reset = () => Array.from(active).forEach(restore);
  view.addEventListener('blur', reset);
  media.addEventListener('change', reset);
}
