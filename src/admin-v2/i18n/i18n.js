import { pluginData } from '../api/api';

export const __ = window.wp?.i18n?.__ || ((text) => text);

export function licenseString(text) {
  if (text === 'License active') {
    return __('License active', 'cci-posts-carousel');
  }

  if (text === 'License inactive') {
    return __('License inactive', 'cci-posts-carousel');
  }

  if (text === 'Enter your license key to unlock Pro add-ons on this domain.') {
    return __('Enter your license key to unlock Pro add-ons on this domain.', 'cci-posts-carousel');
  }

  if (text === 'License key') {
    return __('License key', 'cci-posts-carousel');
  }

  if (text === 'Activate license') {
    return __('Activate license', 'cci-posts-carousel');
  }

  if (text === 'Activating...') {
    return __('Activating...', 'cci-posts-carousel');
  }

  if (text === 'Already have a key? Paste it here and activate Pro in seconds.') {
    return __(
      'Already have a key? Paste it here and activate Pro in seconds.',
      'cci-posts-carousel',
    );
  }

  return __(text, 'cci-posts-carousel');
}

export function coreString(key, fallback) {
  return pluginData.i18n?.[key] || __(fallback);
}
