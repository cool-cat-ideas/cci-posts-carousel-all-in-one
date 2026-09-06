const { createAdminTheme, SHARED_UI_SAFELIST } = require('@cci/admin-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: 'tw-',
    corePlugins: {
        preflight: false,
    },
    content: [
        './src/admin-v2/**/*.{js,jsx}',
        '../../cci_admin_framework/packages/admin-ui/src/**/*.{js,jsx}',
        '../../cci_admin_framework/packages/admin-ui/dist/**/*.js',
    ],
    safelist: [...SHARED_UI_SAFELIST, 'tw-hidden'],
    theme: {
        extend: createAdminTheme('cci-wpc'),
    },
};
