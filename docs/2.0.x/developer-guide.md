# WP Posts Carousel developer guide

WP Posts Carousel All In One stores reusable carousel definitions and renders them through the Free core. The single Pro plugin adds commercial capabilities without changing the saved-carousel workflow.

## Runtime structure

```text
wp-posts-carousel/
  includes/
    class-carousel-repository.php
    class-carousel-data.php
    class-slide-view-model.php
    class-templates.php
    frontend/
      class-carousel-query-builder.php
      class-carousel-generator.php
      class-frontend.php
  templates/
  assets/
  src/

wp-posts-carousel-pro/
  includes/features/
  templates/
  assets/
```

The Free core owns storage, querying, normalized slide data, PHP fallback output, Owl/Swiper integration, Gutenberg publishing and public extension contracts. Pro loads each commercial capability from a separate class file but ships as one plugin, ZIP and license.

## Choose the smallest customization surface

| Goal | Supported approach |
| --- | --- |
| Change colors, spacing or typography | Child-theme CSS loaded after the template stylesheet |
| Change card markup for one site | Child-theme template override |
| Add a reusable visual layout | Manifest-based template in an extension plugin |
| Change selected content | A query filter |
| Add normalized slide data | A slide-data filter |
| Insert markup around a card | A WordPress action |
| Publish with another editor | Reuse the saved carousel ID through the public renderer |
| Distribute behavior to many sites | A separate extension plugin using public contracts |

Do not edit installed plugin files. Do not call internal admin classes from a theme when a public filter, action, shortcode or template contract exists.

## Saved definition flow

1. The repository loads a saved carousel by ID.
2. Configuration is normalized and checked for required capabilities.
3. Query or manual composition produces source items.
4. The slide view-model converts items to renderer-neutral data.
5. The selected template prepares PHP fallback markup.
6. Owl Carousel or the Swiper/React renderer enhances the same definition.
7. Gutenberg, shortcode, PHP and Elementor placements reuse that saved ID.

This flow keeps frontend output consistent across publishing methods. A customization should target the earliest stable layer that can express the requirement.

## Base and Pro extension boundary

The base plugin may query posts, pages, custom post types and the WooCommerce
`product` post type. A product item from the base plugin remains a generic
content card.

The single Pro package adds current WooCommerce prices, sale state, ratings,
purchase actions and merchandising sources together with Commerce Luxe, Story
Commerce, Video Showcase, Elementor, analytics, autoplay indicators and
Multisite. These are internal Pro modules, not separate add-ons.

An external extension may register an independent template, source or renderer. It cannot unlock reserved Pro capabilities or replace the Pro license decision.

## Build a site-specific query customization

Keep snippets in a small site plugin or child theme and limit them to one saved carousel:

```php
add_filter(
    'wp_posts_carousel_query_args',
    function (array $args, array $config): array {
        if ((int) ($config['id'] ?? 0) !== 123) {
            return $args;
        }

        $args['post__not_in'] = get_option('sticky_posts', []);
        return $args;
    },
    10,
    2
);
```

Use [Filters and actions](./hooks-and-api.md) for the complete parameter and return contracts.

## Build a reusable extension

A distributable extension should own one responsibility and keep each functionality in a separate class:

```text
my-wpc-extension/
  my-wpc-extension.php
  includes/
    class-my-wpc-extension-feature.php
  templates/
    my-template/
      template.json
      views/template.php
      assets/css/style.css
  assets/
```

Register only public paths and hooks from the bootstrap. Keep renderer logic, data integration and admin metadata in their own classes. See [External extension API](./frontend-extension-contract.md) and [Extensions](./extensions.md).

## Compatibility and safety

- Sanitize saved configuration on the server.
- Escape final HTML unless the contract explicitly returns prepared safe markup.
- Keep CSS scoped to the template/extension root.
- Preserve PHP fallback output for SEO and accessibility.
- Avoid remote requests during carousel rendering.
- Do not store raw license keys in extensions.
- Test both configured engines when an extension declares support for both.
- Treat public PHP classes as implementation services unless the PHP API marks a method as a supported extension surface.

Use [PHP API](./method-reference.md) for method signatures, [Filters and actions](./hooks-and-api.md) for stable WordPress extension points, and [Styles and templates](./templates-and-addons.md) for theme-level changes.
