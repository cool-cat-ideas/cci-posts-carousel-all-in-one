const excludedStatuses = new Set(['trash', 'auto-draft', 'inherit']);

export function savedCarousels(items) {
  return (Array.isArray(items) ? items : []).filter(
    (item) => item && !excludedStatuses.has(item.post_status),
  );
}

export function carouselSummary(items) {
  const carousels = savedCarousels(items);
  const published = carousels.filter((item) => item.post_status === 'publish').length;
  return { total: carousels.length, published, unpublished: carousels.length - published };
}

function readConfig(carousel) {
  if (carousel.params && typeof carousel.params === 'object' && !Array.isArray(carousel.params))
    return carousel.params;
  try {
    const config = JSON.parse(carousel.params);
    return config && typeof config === 'object' && !Array.isArray(config) ? config : null;
  } catch {
    return null;
  }
}

function configValue(config, paths, fallback) {
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], config);
    if (typeof value === 'string' && value.trim()) return value;
  }
  return fallback;
}

function breakdown(configs, paths, fallback) {
  const counts = new Map();
  for (const config of configs) {
    const key = configValue(config, paths, fallback);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function carouselConfigurationStats(items) {
  const carousels = savedCarousels(items);
  const configs = carousels.map(readConfig).filter(Boolean);
  let totalSlides = 0;
  let manualCarousels = 0;
  for (const config of configs) {
    // Current stored configs use curation.items; older form configs use posts.
    const selected = Array.isArray(config.curation?.items)
      ? config.curation.items
      : Array.isArray(config.post_selection_options?.posts)
        ? config.post_selection_options.posts
        : [];
    const mode =
      config.source?.mode ?? config.curation?.mode ?? (selected.length ? 'manual' : 'query');
    if (mode === 'manual') {
      manualCarousels += 1;
      totalSlides += selected.length;
    }
  }
  return {
    ...carouselSummary(carousels),
    totalSlides,
    manualCarousels,
    averageSlides: manualCarousels ? Math.round((totalSlides / manualCarousels) * 10) / 10 : 0,
    invalidConfigs: carousels.length - configs.length,
    engines: breakdown(
      configs,
      ['engine.name', 'carousel_type', 'carousel_engine', 'engine', 'carousel_options.engine'],
      'owl-carousel',
    ),
    renderers: breakdown(configs, ['renderer', 'frontend_renderer', 'rendering.renderer'], 'php'),
    templates: breakdown(
      configs,
      ['template.name', 'template', 'template_name', 'display_options.template', 'layout.template'],
      'default',
    ),
  };
}
