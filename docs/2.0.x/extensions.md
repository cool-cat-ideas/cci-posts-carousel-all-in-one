# WP Posts Carousel 2.0.x extension contract

This document summarizes the extension surfaces implemented by
`wp-posts-carousel` 2.0.x. Detailed hook tables are in
[Filters and actions](./hooks-and-api.md); this file is the product-level contract for
building templates, integrations and commercial add-ons.

Copyable end-to-end examples are in the
[extension cookbook](./extension-cookbook.md), including child-theme CSS, element filters,
actions, source integrations, template packaging and browser renderers.

## Installed versus store views

- A valid manifest from a core, child-theme, uploads or filtered add-on path is
  discovered automatically and appears in **Installed templates**.
- An integration appears as an installed product card only when it contributes
  a namespaced feature with `source => 'addon'`. Query/slide filters can work
  without a card.
- **Available in store** is populated only from the remote marketplace feed.
  Local activation never publishes an item to that feed.
- Matching stable identities let the store card display **Installed**.

## Extension Types

| Type | Primary hook/filter | Output |
| --- | --- | --- |
| Template add-on | `wp_posts_carousel_templates_paths` | Adds one or more `template.json` based templates. |
| Integration add-on | `wp_posts_carousel_query_args`, dictionaries and slide filters | Adds source/query behavior or enriches slide data. |
| Renderer add-on | `wp_posts_carousel_frontend_renderers`, JS `registerRenderer()` | Adds a PHP/React/runtime rendering mode. |
| Feature/license add-on | `wp_posts_carousel_features`, `wp_posts_carousel_license_allows_feature` | Registers paid or optional capabilities. |
| Asset compatibility add-on | asset loading filters | Reuses theme/plugin Owl, Swiper or icon assets. |

## Maintained standalone examples

Two no-cost products provide working, installable examples of the contracts in
this guide:

- `wp-posts-carousel-related-content` adds an ordering choice, uses
  `wc_get_related_products()` for product-only rows, prioritizes the Yoast SEO
  primary term through `yoast_get_primary_term_id()` and falls back to shared
  public taxonomy terms. The cookbook explains the underlying
  [query extension contract](./extension-cookbook.md#change-the-source-query).
- `wp-posts-carousel-aurora-cards` registers a universal template path with a
  manifest, PHP view, scoped CSS and screenshot. It renders blog cards with
  Free, links enabled public categories and tags from the standard slide
  payload, and consumes advanced WooCommerce fields only when Pro supplies
  them. Its interaction styles cover pointer hover and keyboard focus without
  requiring template-specific JavaScript.
  The cookbook explains how to
  [package a template as an add-on](./extension-cookbook.md#package-the-template-as-an-add-on).

Both are separate products with their own versioned ZIP. They are not internal
modules of `wp-posts-carousel-pro` and do not have matching `-pro` packages.

## Template Add-Ons

Templates are discovered from directories returned by
`wp_posts_carousel_templates_paths`. Each template folder must contain a
`template.json` manifest.

Minimal add-on registration:

```php
add_filter('wp_posts_carousel_templates_paths', function ($paths) {
    $paths[MY_ADDON_DIR . 'templates'] = MY_ADDON_URL . 'templates';

    return $paths;
});
```

Minimal structure:

```text
my-template-addon/
  includes/
  templates/
    my-template/
      template.json
      views/template.php
      assets/css/style.css
      screenshot.png
```

Common `template.json` fields:

```json
{
  "name": "my-template",
  "title": "My Template",
  "description": "A focused carousel template.",
  "version": "1.0.0",
  "author": "Cool Cat Ideas",
  "render": "views/template.php",
  "style": "assets/css/style.css",
  "screenshot": "screenshot.png",
  "feature": "my_template_feature",
  "pro": false,
  "tags": ["commerce"],
  "supports": {
    "renderers": ["php"],
    "engines": ["owl-carousel"],
    "itemTypes": ["post", "custom"],
    "manualComposition": true,
    "connectedImages": false,
    "videoSlides": false
  }
}
```

Template names are normalized with `sanitize_key()`. Keep names stable because
saved carousels reference them.

## Paid Template Or Pro Add-Ons

Register the feature and gate it through the license filter. The base plugin
may discover a paid template or integration, but paid feature keys remain
disabled unless `wp-posts-carousel-pro` validates the license
for the current domain.

```php
add_filter('wp_posts_carousel_features', function ($features) {
    $features['my_template_feature'] = array(
        'label' => __('My Template', 'my-addon'),
        'description' => __('Premium carousel template.', 'my-addon'),
        'enabled' => (bool) apply_filters(
            'wp_posts_carousel_license_allows_feature',
            false,
            'my_template_feature',
            array(
                'addon' => plugin_basename(__FILE__),
                'type' => 'template',
                'version' => '1.0.0',
            )
        ),
        'source' => 'addon',
        'plan' => 'paid',
    );

    return $features;
});
```

If the feature is disabled, the core template registry marks the template as
locked. Do not hide locked templates with custom admin logic unless the product
explicitly needs that.

Do not remove or replace the core list of paid feature keys. Add-ons may extend
it through `wp_posts_carousel_paid_feature_keys`, but the base plugin always
keeps its reserved paid keys protected. Do not rely on `enabled => true` inside
an add-on; the feature registry recalculates paid features after filters and
requires the Pro license gate to allow the specific key.

## Integration Add-Ons

Integrations should modify data through filters instead of replacing the core
renderer.

Typical filters:

- `wp_posts_carousel_query_args`
- `wp_posts_carousel_order_by_map`
- `wp_posts_carousel_post_criteria_meta_box_orders_by`
- `wp_posts_carousel_slide_view_model`
- `wp_posts_carousel_custom_slide_view_model`
- `wp_posts_carousel_public_slide_data`
- `wp_posts_carousel_dictionaries`

Example:

```php
add_filter('wp_posts_carousel_query_args', function ($args, $config) {
    if (($config['source']['order_by'] ?? '') !== 'my_metric') {
        return $args;
    }

    $args['meta_key'] = '_my_metric';
    $args['orderby'] = 'meta_value_num';
    $args['order'] = 'DESC';

    return $args;
}, 10, 2);
```

## Frontend Renderers

PHP is the SEO fallback. JavaScript renderers should progressively enhance the
existing carousel output.

Expose the renderer in PHP:

```php
add_filter('wp_posts_carousel_frontend_renderers', function ($renderers) {
    $renderers[] = 'my_renderer';

    return $renderers;
});

add_filter('wp_posts_carousel_frontend_renderers_dictionary', function ($renderers) {
    $renderers[] = array(
        'name' => 'my_renderer',
        'label' => __('My renderer', 'my-addon'),
        'description' => __('Custom frontend enhancement.', 'my-addon'),
        'feature' => 'my_renderer_feature',
        'enabled' => true,
    );

    return $renderers;
});
```

Register the browser runtime:

```js
window.wpPostsCarousel.registerRenderer('my_renderer', {
    mount(element, carousel, runtime) {
        element.classList.add('cci-wpc-renderer-enhanced');
    },
});
```

The public JS runtime also exposes:

- `hooks.addAction(name, namespace, callback, priority)`
- `hooks.doAction(name, ...args)`
- `hooks.addFilter(name, namespace, callback, priority)`
- `hooks.removeAction(name, namespace)`
- `hooks.removeFilter(name, namespace)`
- `hooks.applyFilters(name, value, ...args)`
- `registerEngine(name, engine)`
- `getEngine(name)`
- `getRenderer(name)`
- `mountRenderer(name, element, carousel)`

## Asset Compatibility

The core plugin can load bundled Owl Carousel, Swiper and icon assets, or reuse
assets already registered by the theme or another plugin.

Relevant filters:

- `wp_posts_carousel_should_enqueue_frontend_assets`
- `wp_posts_carousel_load_owl_assets`
- `wp_posts_carousel_load_owl_css`
- `wp_posts_carousel_load_mousewheel_asset`
- `wp_posts_carousel_owl_script_handle`
- `wp_posts_carousel_mousewheel_script_handle`
- `wp_posts_carousel_owl_style_handle`
- `wp_posts_carousel_swiper_source`
- `wp_posts_carousel_load_swiper_css`
- `wp_posts_carousel_asset_diagnostics`

Do not register global handles that conflict with common themes. Use plugin or
add-on specific handles unless intentionally pointing to an existing asset.

### Loading assets for a programmatic render

Use `wp_posts_carousel_should_enqueue_frontend_assets` when a theme or add-on
calls the shortcode or generator from a PHP template instead of storing a WPC
shortcode/block in post content. It runs during `wp_enqueue_scripts`.

- Value: `bool $should_enqueue`
- Additional argument: `WP_Post[] $posts` inspected for the current request
- Return: `true` to enqueue the frontend runtime and template assets; otherwise
  return the incoming value

```php
add_filter(
    'wp_posts_carousel_should_enqueue_frontend_assets',
    function ($should_enqueue, $posts) {
        return is_front_page() ? true : $should_enqueue;
    },
    10,
    2
);
```

## Pro analytics request limits

The public, consent-aware event collector limits requests by a hashed client
fingerprint. These filters run before an accepted batch is stored:

- `wp_posts_carousel_pro_analytics_rate_limit`: maximum events in the active
  window; receives `int $limit` and `WP_REST_Request $request`; return an integer
  greater than zero.
- `wp_posts_carousel_pro_analytics_rate_window`: window duration in seconds;
  receives `int $seconds` and `WP_REST_Request $request`; return an integer
  greater than zero.

```php
add_filter('wp_posts_carousel_pro_analytics_rate_limit', function ($limit, $request) {
    return 120;
}, 10, 2);

add_filter('wp_posts_carousel_pro_analytics_rate_window', function ($seconds, $request) {
    return 2 * MINUTE_IN_SECONDS;
}, 10, 2);
```

## Marketplace API URL

The plugin has one production marketplace API base:

```text
https://coolcatideas.com
```

Marketplace endpoints are built under
`/api/products/wp-posts-carousel-all-in-one/`.
The product page URL is separate:

```text
https://coolcatideas.com/products/wp-posts-carousel-all-in-one
```

For local development, set `WP_POSTS_CAROUSEL_MARKETPLACE_API_BASE` or use the
`wp_posts_carousel_marketplace_api_base` filter. Do not add localhost, Docker
or WSL fallback URLs to release code.

## Extension compatibility and security

- Sanitize all values added to admin dictionaries or REST payloads.
- Escape template output with WordPress escaping helpers.
- Every WPC-owned public class uses `cci-wpc-<element>-<state>`, lowercase ASCII
  and single hyphens, for example `.cci-wpc-template-my-template` and
  `.cci-wpc-card-title`. Do not use `wpc-*`, `wp-posts-carousel-*`, BEM
  separators or standalone `is-*` state classes. Keep WordPress, WooCommerce
  and third-party library classes unchanged.
- Do not rely on another template's private class names.
- Keep manual slide data and field mapping backward compatible.
- Use feature keys for paid behavior instead of hard-coding Pro checks.

## Documentation Pointers

- [Filters and actions](./hooks-and-api.md): full filter/action list.
- [Templates and add-ons](./templates-and-addons.md): template manifest and add-on packaging.
- [Frontend extension contract](./frontend-extension-contract.md): JavaScript renderer runtime.
