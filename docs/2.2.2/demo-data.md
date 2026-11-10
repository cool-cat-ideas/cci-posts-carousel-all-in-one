# Demo data

Demo data is for local development and public demo preparation. Do not enable demo seeding on production client sites.

## What the seed creates

The WordPress demo seed creates:

- demo posts,
- demo WooCommerce products when WooCommerce is available,
- media attachments,
- saved carousel definitions,
- the main CCI Posts Carousel All In One demo page,
- the long-form demo article page,
- metadata used by demo sections and screenshots.

## WP-CLI command

When WP-CLI is available in the WordPress runtime:

```bash
wp wp-posts-carousel seed-demo
```

If WordPress runs in a container, execute the same command through the
container's WP-CLI installation. Direct PHP calls to the internal demo seeder
are not a supported integration API.

## Enable seed only in development

```php
add_filter('wp_posts_carousel_enable_demo_seed', function ($enabled, $environment) {
    return wp_get_environment_type() === 'development';
}, 10, 2);
```

## Safety rules

- Run the seed only on a local or staging site.
- Back up manual demo edits before reseeding.
- Keep product, article and carousel copy aligned with the installed templates.
- Do not seed claims for features that are not implemented.
- Do not include private customer data in demo content.
