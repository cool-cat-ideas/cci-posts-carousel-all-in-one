# Changelog

All notable changes to WP Posts Carousel All In One are documented in this file.

## Unreleased

- Made Owl arrows native buttons and added keyboard-operable, labelled pagination dots without modifying the bundled Owl library.
- Limited frontend asset loading to requests that contain a carousel, with an opt-in filter for programmatic theme renders.
- Added responsive image candidates to attachment-backed slides and reduced-motion fallbacks to bundled templates.
- Removed local-site demo media from the distributable package and centralized generated release artifacts outside the plugin directory.
- Standardized bundled template carousel controls as stable 44px brand-colored targets with consistent hover and keyboard-focus states.
- Standardized the Free package metadata and release archive on GPL-2.0-or-later.
- Added a dynamic Gutenberg block for embedding saved carousels in the base plugin.
- Added a saved-carousel selector to the Gutenberg block and removed manual-ID fallback entry points.
- Added frontend taxonomy filters that work with PHP/Owl and React/Swiper renderers.
- Added performance controls for lazy images, first-image priority and post image size override.
- Removed the experimental style-mode selector and demo rows because they changed cosmetic tone without a clear user workflow.
- Curated the generated demo page so generic duplicate rows were removed and every remaining carousel section has a specific product advantage or workflow role.
- Added custom field/ACF meta mapping for badges, CTAs, URLs, image URLs, accents, durations and commerce display fields.
- Added local WooCommerce product photos and a cleaner demo-page frame for product carousel examples.
- Removed Pro-only generated demo carousels from the Free seed so premium templates live in their own packages.
- Rewrote the generated Free vs Pro copy around the actual core plugin, free add-ons and premium add-ons.
- Added sales-oriented per-carousel add-on cards showing the package, Free/Pro level, version, requirements, runtime engine, integrations, add-on page and support link, with the demo hero reduced to a single homepage button.
- Refreshed the generated demo page into a sales-oriented Free vs Pro showcase and removed technical implementation summaries from public demo sections.
- Documented the current template UI contract: template-scoped arrows, dots, hover/focus states, viewport masking and border-safe slide framing.
- Documented viewport-gated autoplay behavior for YouTube/Vimeo iframes and HTML5 media cards.
- Documented runtime control metric CSS variables used by templates, including dynamic vertical dots metrics for Vertical Product Rail.
- Updated bundled template notes for Default Template, Light Template, Simple Template and Vertical Product Rail.

## 2.0.0 - 2026-06-14

- Rebuilt the admin experience with a React-based dashboard and carousel editor.
- Added dedicated carousel storage instead of legacy post meta.
- Added Owl Carousel and Swiper support with asset compatibility controls.
- Added SEO-friendly PHP rendering with optional React frontend enhancement.
- Added manual slide ordering, responsive breakpoints and template selection.
- Added bundled free templates: Light Template, Simple Template and Default Template.
- Added marketplace feed support for product news, templates and integrations.
- Added diagnostics data for support without exposing license secrets.
- Reset public changelog for the 2.0.0 line.
