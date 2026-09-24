const { createAdminTheme, createSharedUiSafelist, SHARED_UI_SAFELIST, resolveAdminUiContentGlobs } = require('@cci/admin-theme');

const addonSafelist = require('@cci/admin-theme/src/addon-safelist.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: 'tw-',
    corePlugins: {
        preflight: false,
    },
    content: [
        './src/admin-v2/**/*.{js,jsx}',
        ...resolveAdminUiContentGlobs(),
    ],
    safelist: [...SHARED_UI_SAFELIST, ...addonSafelist, ...createSharedUiSafelist('cci-wpc'), ...createSharedUiSafelist('cci-nm'), 'tw-hidden'],
    theme: {
        extend: { ...createAdminTheme('cci-wpc'), colors: { ...createAdminTheme('cci-wpc').colors, ...createAdminTheme('cci-nm').colors } },
    },
};
