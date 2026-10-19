import fallbackEngine from './fallback';
import owlEngine from './owl';
import swiperEngine from './swiper';

function normalizeEngineName(name) {
  const value = String(name || '').toLowerCase();

  if (value.includes('swiper')) {
    return 'swiper';
  }

  if (value.includes('owl')) {
    return 'owl';
  }

  return value.replace(/[^a-z0-9_-]/g, '') || 'fallback';
}

export function registerDefaultEngines(runtime) {
  runtime.registerEngine('fallback', fallbackEngine);
  runtime.registerEngine('owl', owlEngine);
  runtime.registerEngine('swiper', swiperEngine);
}

export function preferredEngineName(element, carousel) {
  return normalizeEngineName(
    element?.dataset?.wpcEngine ||
      carousel?.engine?.name ||
      carousel?.config?.engine?.name ||
      'fallback',
  );
}

export function resolveReactEngineName(runtime, element, carousel) {
  const preferred = preferredEngineName(element, carousel);
  const filtered = normalizeEngineName(
    runtime.hooks.applyFilters('reactEngine', preferred, element, carousel),
  );
  const engine = runtime.getEngine(filtered);

  if (engine?.supportsReactRenderer && (!engine.available || engine.available())) {
    return filtered;
  }

  return 'fallback';
}
