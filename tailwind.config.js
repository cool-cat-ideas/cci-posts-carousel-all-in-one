const { createTailwindConfig } = require('@cci/admin-theme');

const addonSafelist = require('@cci/admin-theme/src/addon-safelist.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = createTailwindConfig({
  namespace: 'cci-wpc',
  safelistMode: 'shared-ui',
  safelist: [...addonSafelist, 'tw-hidden'],
});
