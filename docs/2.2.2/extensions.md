# Extensions

Extensions are installable WordPress plugins that add templates, source integrations, renderers, feature gates or asset compatibility. Checkout services such as installation or paid support are not plugin extensions.

## Installed versus store catalog

- A valid template registered through `wp_posts_carousel_templates_paths`
  appears automatically in **Installed templates**.
- A data/source add-on appears in **Installed products/integrations** only when
  it registers a namespaced feature through `wp_posts_carousel_features` with
  `source` set to `addon`. Filters alone change behavior but do not
  create a catalog card.
- **Available in store** comes only from the remote marketplace feed. Installing
  a local ZIP never publishes it to that feed.
- When an installed identity matches a store item, the store card is marked
  **Installed**; the two tab counts still describe two different data sets.

## Extension types

| Type | Primary contract | What it adds |
| --- | --- | --- |
| Template add-on | `wp_posts_carousel_templates_paths` plus `template.json` | New visual templates. |
| Source integration | `wp_posts_carousel_query_args` and slide model filters | New source or ordering behavior. |
| Renderer add-on | `wp_posts_carousel_frontend_renderers` and JS `registerRenderer()` | New frontend renderer mode. |
| Feature add-on | `wp_posts_carousel_features` | Optional capability with a feature key. |
| Asset compatibility add-on | asset loading filters | Reuse theme/plugin Owl, Swiper or icon assets. |

## Working examples

- [Related Content](./related-content.md) is a standalone source extension distributed without a paid license. It
  adds a real ordering option, uses native WooCommerce related products for
  product-only rows, prioritizes the Yoast SEO primary term when available and
  falls back to other shared public terms.
- [Aurora Cards](./aurora-cards.md) is a standalone template extension distributed without a paid license. It uses
  the public slide payload for posts and generic product links, then progressively
  displays prices, ratings and cart actions when Pro supplies WooCommerce data.

Try both packages in the [public WordPress demo](https://wordpress-demo.coolcatideas.com/wp-posts-carousel-demo/).

## Minimal plugin structure

```text
my-wpc-extension/
  my-wpc-extension.php
  includes/
  assets/
  templates/
    my-template/
      template.json
      views/template.php
      assets/css/style.css
      screenshot.png
  docs/
    README.md
  CHANGELOG.md
```

## Register a template path

```php
add_filter('wp_posts_carousel_templates_paths', function ($paths) {
    $paths[plugin_dir_path(__FILE__) . 'templates'] = plugin_dir_url(__FILE__) . 'templates';

    return $paths;
});
```

Template details are covered in [Template development](./template-development.md).

## Installable add-on entrypoint

The following `my-wpc-extension.php` registers the template folder, a visible
installed feature and an optional query order. The template itself still needs
the manifest/view files shown above.

```php
<?php
/**
 * Plugin Name: My WPC Editorial Extension
 * Version: 2.0.0
 * Requires Plugins: wp-posts-carousel
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('wp_posts_carousel_templates_paths', function (array $paths): array {
    $paths[plugin_dir_path(__FILE__) . 'templates'] =
        plugin_dir_url(__FILE__) . 'templates';

    return $paths;
});

add_filter('wp_posts_carousel_features', function (array $features): array {
    $features['my_company_editorial_order'] = array(
        'label' => __('Editorial score ordering', 'my-wpc-extension'),
        'description' => __('Orders slides by the editorial score field.', 'my-wpc-extension'),
        'enabled' => true,
        'source' => 'addon',
        'author' => 'Your company',
        'version' => '1.0.0',
        'plan' => 'free',
        'internal' => array('addon' => 'my-wpc-extension'),
    );

    return $features;
});

add_filter('wp_posts_carousel_query_args', function (array $args, array $config): array {
    if (($config['source']['order_by'] ?? '') !== 'my_company_editorial_score') {
        return $args;
    }

    $args['meta_key'] = '_my_company_editorial_score';
    $args['orderby'] = 'meta_value_num';
    $args['order'] = 'DESC';

    return $args;
}, 10, 2);
```

After activation, the valid manifest appears in **Installed templates**. The
namespaced feature with `source => 'addon'` appears in the installed
products/integrations data. A filter without that feature still works but has no
integration card.

## Register a feature

```php
add_filter('wp_posts_carousel_features', function ($features) {
    $features['my_extension_feature'] = array(
        'label' => __('My extension feature', 'my-wpc-extension'),
        'description' => __('Enables my extension behavior.', 'my-wpc-extension'),
        'enabled' => true,
        'source' => 'addon',
        'author' => 'Your company',
        'version' => '1.0.0',
        'internal' => array('addon' => 'my-wpc-extension'),
    );

    return $features;
});
```

Paid add-ons must not set a reserved paid feature to enabled by themselves. They must ask the Pro license gate:

```php
$enabled = (bool) apply_filters(
    'wp_posts_carousel_license_allows_feature',
    false,
    'my_paid_feature',
    array(
        'addon' => plugin_basename(__FILE__),
        'type' => 'template',
        'version' => '2.0.0',
    )
);
```

## Extend the query

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

## Extend slide data

```php
add_filter('wp_posts_carousel_slide_view_model', function ($slide, $post, $params, $config) {
    $slide['meta']['reading_time'] = get_post_meta($post->ID, 'reading_time', true);

    return $slide;
}, 10, 4);
```

For custom/manual slides:

```php
add_filter('wp_posts_carousel_custom_slide_view_model', function ($slide, $item, $params, $config) {
    $slide['meta']['campaign_id'] = sanitize_text_field($item['campaign_id'] ?? '');

    return $slide;
}, 10, 4);
```

## Recover from a loading error

A failed request emits `wp-posts-carousel:error` and sets the placement's
`data-wpc-lazy-state` to `error`. Once the connection is restored, call
`window.wpPostsCarouselLazyLoad.load(element)` to retry the same placement.
It returns a Promise that resolves to the rendered carousel element. Handle a
rejection in your interface; retries are explicit so an unavailable endpoint
does not cause an endless request loop.

```js
const element = document.querySelector('.cci-wpc-carousel[data-wpc-api]');
if (element && element.dataset.wpcLazyState === 'error') {
    window.wpPostsCarouselLazyLoad.load(element).catch(() => {
        // Keep the retry control available until the connection is restored.
    });
}
```

Public pages load styles for the templates they use. A dynamically inserted
carousel waits for its selected template stylesheet before rendering. Editor
previews keep all available template styles so changing a template updates the
preview without reloading the editor.

## Add a frontend renderer

Expose the renderer in PHP:

```php
add_filter('wp_posts_carousel_frontend_renderers', function ($renderers) {
    $renderers[] = 'my_renderer';

    return $renderers;
});
```

Register the browser runtime:

```js
window.wpPostsCarousel.registerRenderer('my_renderer', {
    mount(element, carousel, runtime) {
        element.classList.add('cci-wpc-my-renderer-enhanced');
    },
});
```

The PHP renderer should remain the SEO fallback. JavaScript renderers should enhance existing markup instead of replacing all content with client-only output.

## Catalog metadata

A store catalog item should include:

```json
{
  "codeName": "my-template-pack",
  "itemKind": "template",
  "availability": "included_pro",
  "requiresPro": true,
  "requiresProductVersion": "2.0.0",
  "version": "2.0.0"
}
```

Use:

- `template` for visual template products,
- `integration` for source/data integrations,
- `extension` for technical feature packages.

Do not list checkout services as plugin extensions.

## Security rules

- Sanitize all values added to REST payloads.
- Escape template output with WordPress escaping helpers.
- Scope CSS under the template root class.
- Do not perform remote license checks during frontend rendering.
- Keep feature keys, template names and saved payload structures stable after release.

## Show an installed integration card

Create a separate plugin file, for example `wp-content/plugins/my-company-wpc/my-company-wpc.php`. Start with:

```php
<?php
/**
 * Plugin Name: My Company Carousel Integration
 * Version: 1.0.0
 * Author: Your company
 */
if (!defined('ABSPATH')) { exit; }

add_filter('wp_posts_carousel_features', static function (array $features): array {
    $features['my_company_content_source'] = [
        'label' => 'My content source',
        'description' => 'Adds our content source to carousel queries.',
        'source' => 'addon',
        'enabled' => true,
        'plan' => 'free',
        'author' => 'Your company',
        'version' => '1.0.0',
    ];
    return $features;
});
```

Activate the plugin, then open **CCI Posts Carousel All In One → Integrations → Installed integrations**. Check its name, author and version. This registers the card only. Add the query behavior using the recipe below before distributing the integration. If it depends on another plugin, compute `enabled` from the documented API that you use, rather than leaving it `true`.

The feature key must be unique and stable. A missing card usually means that the plugin is inactive, the filter callback did not run, or its descriptor has a different `source` value. The store tab comes from the remote catalog; activating a local plugin does not publish a store product.

Create any settings page with the normal WordPress settings APIs. No arbitrary integration-settings schema or automatic Configure button is registered by this filter. Paid capabilities still need the supported server-side license check described in the [feature and license contract](./developer-api.md#feature-and-license-filters).
