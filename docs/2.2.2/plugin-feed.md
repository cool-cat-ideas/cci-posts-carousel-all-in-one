# Plugin feed

The plugin feed lets the WordPress admin show product news, available templates, integrations and extension products without hard-coding catalog data in the plugin.

## Production base

```text
https://coolcatideas.com
```

The product page URL is separate:

```text
https://coolcatideas.com/products/cci-posts-carousel-all-in-one
```

## Combined endpoint

```text
GET /api/products/cci-posts-carousel-all-in-one/plugin-feed/?locale=en&limit=20
```

Expected top-level sections:

- `product`,
- `latestVersion`,
- `freeVersion`,
- `news`,
- `templates`,
- `integrations`,
- `extensions`,
- `documentationUrl`,
- `productUrl`.

## Partial endpoints

```text
GET /api/products/cci-posts-carousel-all-in-one/news?locale=en&limit=20
GET /api/products/cci-posts-carousel-all-in-one/templates?locale=en&limit=20
GET /api/products/cci-posts-carousel-all-in-one/integrations?locale=en&limit=20
GET /api/products/cci-posts-carousel-all-in-one/extensions?locale=en&limit=20
```

## Admin override for development

Use a constant:

```php
define('WP_POSTS_CAROUSEL_MARKETPLACE_API_BASE', 'http://host.docker.internal:3000');
```

or a filter:

```php
add_filter('wp_posts_carousel_marketplace_api_base', function ($base) {
    return 'http://host.docker.internal:3000';
});
```

Do not add localhost fallback URLs to release code.

## Failure behavior

The feed is not required for frontend rendering. When the feed is unavailable, the admin should show a non-blocking empty state or cached data. Saved carousel output must still render from local WordPress data.

## Documentation URLs

Published documentation links should point to English docs:

```text
/en/docs/cci-posts-carousel-all-in-one/
```

Product pages in other locales may link to the same English documentation until translated documentation is deliberately introduced.
