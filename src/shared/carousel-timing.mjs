function milliseconds(value, fallback) {
  if (value === '' || value === null || value === undefined) {
    return fallback;
  }

  const duration = Number(value);
  return Number.isFinite(duration) && duration >= 0 ? duration : fallback;
}

export function carouselTimings(options = {}) {
  const navigation = milliseconds(options.nav_speed, 300);

  return {
    autoplay: milliseconds(options.auto_play_speed, navigation),
    delay: Math.max(500, milliseconds(options.auto_play_timeout, 1200)),
    dots: milliseconds(options.dots_speed, navigation),
    navigation,
  };
}
