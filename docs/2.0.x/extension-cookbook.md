# CCI Posts Carousel All In One extension cookbook

This guide turns the public 2.0.x extension contract into complete, testable
recipes. Use it together with [Hooks and API](./hooks-and-api.md) for signatures
and [Templates and add-ons](./templates-and-addons.md) for the manifest schema.

## Choose the smallest extension surface

Use a child theme when only visual style changes. Use a template add-on when
card markup or supported content changes. Use an integration add-on when the
source query, slide data or renderer changes. Do not edit the core plugin.

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

Create any settings page with the normal WordPress settings APIs. No arbitrary integration-settings schema or automatic Configure button is registered by this filter. Paid capabilities still need the supported server-side license check described in the [extension contract](./extensions.md#paid-template-or-pro-add-ons).

## Override carousel styles from a child theme

### 1. Find the template name

Inspect the carousel root. A carousel using `default` has a class similar to:

```html
<div class="wp-posts-carousel cci-wpc-default-template-theme">
```

### 2. Enqueue a stylesheet after the plugin

Add this to the child theme `functions.php`:

```php
<?php
add_action('wp_enqueue_scripts', function (): void {
    wp_enqueue_style(
        'my-theme-wpc-overrides',
        get_stylesheet_directory_uri() . '/assets/css/wpc-overrides.css',
        array('cci-wpc-frontend'),
        (string) wp_get_theme()->get('Version')
    );
}, 30);
```

Create `assets/css/wpc-overrides.css`:

```css
.cci-wpc-default-template-theme .cci-wpc-card {
  border: 1px solid #dfe4ea;
  border-radius: 14px;
  background: #fff;
}

.cci-wpc-default-template-theme .owl-nav button,
.cci-wpc-default-template-theme .cci-wpc-render-preview-nav button {
  width: 40px;
  height: 40px;
}
```

The selectors cover the PHP/Owl frontend and React/Swiper preview without
styling other templates. Clear caches and test desktop, mobile and keyboard
focus.

## Replace one card element with `add_filter()`

```php
<?php
add_filter(
    'wp_posts_carousel_item_author',
    function (string $html, array $context): string {
        if ($html === '') {
            return $html;
        }

        return sprintf(
            '<span class="my-wpc-author"><span class="screen-reader-text">%s </span>%s</span>',
            esc_html__('Author:', 'my-wpc-customizations'),
            wp_kses_post($html)
        );
    },
    10,
    2
);
```

Always return a string. Available element filters and their context are listed
in [Hooks and API](./hooks-and-api.md).

## Insert markup with `add_action()`

The before/after item actions run inside each bundled PHP card. Action
callbacks echo markup because WordPress actions do not return it.

```php
<?php
add_action(
    'wp_posts_carousel_before_item_content',
    function (array $params): void {
        unset($params);

        echo '<span class="my-wpc-item-label">'
            . esc_html__('Featured', 'my-wpc-customizations')
            . '</span>';
    }
);
```

Use an element filter to replace existing HTML and an action only to add a new
element.

## Change the source query

This integration adds a saved ordering key and converts it to `WP_Query` args:

```php
<?php
add_filter('wp_posts_carousel_order_by_map', function (array $map): array {
    $map['my_popularity'] = 'my_popularity';
    return $map;
});

add_filter(
    'wp_posts_carousel_query_args',
    function (array $args, array $config): array {
        if (($config['source']['order_by'] ?? '') !== 'my_popularity') {
            return $args;
        }

        $args['meta_key'] = '_my_popularity_score';
        $args['orderby'] = 'meta_value_num';
        $args['order'] = 'DESC';
        return $args;
    },
    10,
    2
);
```

Append builder dictionary options when the key must be selectable. Never
replace the complete dictionary.

## Enrich prepared slide data

```php
<?php
add_filter(
    'wp_posts_carousel_slide_view_model',
    function (array $slide, WP_Post $post, array $params, array $config): array {
        unset($params, $config);
        $score = get_post_meta($post->ID, '_my_popularity_score', true);
        $slide['display']['popularity_score'] = is_numeric($score) ? (int) $score : 0;
        return $slide;
    },
    10,
    4
);
```

Namespace new fields. Do not change the types of core `id`, `url`, `image`,
`title`, `html` or `layout` fields.

## Create a child-theme template

### 1. Create the directory

```text
wp-content/themes/my-child-theme/wp-posts-carousel/templates/my-editorial/
  template.json
  views/template.php
  assets/css/style.css
  screenshot.png
```

### 2. Add the manifest

```json
{
  "name": "my-editorial",
  "title": "My Editorial",
  "description": "Editorial cards for articles and manual slides.",
  "version": "1.0.0",
  "author": "My Company",
  "author_url": "https://example.com/",
  "tags": ["editorial", "posts"],
  "render": "views/template.php",
  "style": "assets/css/style.css",
  "screenshot": "screenshot.png",
  "supports": {
    "renderers": ["php"],
    "engines": ["owl-carousel"],
    "itemTypes": ["post", "custom"],
    "manualComposition": true,
    "connectedImages": false,
    "videoSlides": false
  },
  "fields": [],
  "pro": false
}
```

### 3. Render prepared data

The PHP file is included in `WP_Posts_Carousel_Generator` scope. It receives
`$this`; there is no standalone `$slide` variable.

```php
<?php
if (!defined('ABSPATH')) {
    exit;
}

$slide = is_array($this->slide ?? null) ? $this->slide : array();
$title = (string) ($slide['title']['text'] ?? '');
$url = (string) ($slide['url'] ?? '');
$image = is_array($slide['image'] ?? null) ? $slide['image'] : array();
?>
<article class="my-editorial-card">
    <?php if (!empty($image['src'])) : ?>
        <a class="my-editorial-card__media" href="<?php echo esc_url($url); ?>">
            <img src="<?php echo esc_url($image['src']); ?>"
                 alt="<?php echo esc_attr($image['alt'] ?? $title); ?>"
                 loading="lazy">
        </a>
    <?php endif; ?>
    <h3><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($title); ?></a></h3>
</article>
```

The include may echo markup or return a string. Prefer one approach. Do not
query posts again; the generator has already prepared them.

### 4. Scope CSS and validate discovery

```css
.cci-wpc-my-editorial-template-theme .my-editorial-card {
  height: 100%;
  border: 1px solid #dfe4ea;
  border-radius: 14px;
  background: #fff;
}
```

Open **CCI Posts Carousel All In One > Templates**, then create a carousel and test the
live frontend. A catalog screenshot alone does not validate the renderer.

The valid manifest appears automatically in **Installed templates**. It does
not appear in **Available in store**, because that tab is a remote marketplace
feed rather than a local filesystem scan.

## Package the template as an add-on

```text
my-wpc-template/
  my-wpc-template.php
  templates/my-editorial/
    template.json
    views/template.php
    assets/css/style.css
    screenshot.png
```

```php
<?php
/**
 * Plugin Name: My WPC Editorial Template
 * Version: 1.0.0
 * Requires Plugins: cci-posts-carousel
 */
if (!defined('ABSPATH')) {
    exit;
}

add_filter('wp_posts_carousel_templates_paths', function (array $paths): array {
    $paths[plugin_dir_path(__FILE__) . 'templates'] = plugin_dir_url(__FILE__) . 'templates';
    return $paths;
});
```

The template name is a saved identifier. Renaming it creates another template
and does not migrate existing carousels.

## Gate a paid template or integration

Use an add-on-owned key in `template.json` and register it without replacing
the reserved paid-key list:

```php
<?php
add_filter('wp_posts_carousel_paid_feature_keys', function (array $keys): array {
    $keys[] = 'my_company_editorial';
    return array_values(array_unique($keys));
});

add_filter('wp_posts_carousel_features', function (array $features): array {
    $key = 'my_company_editorial';
    $features[$key] = array(
        'label' => __('My Editorial', 'my-wpc-template'),
        'description' => __('Premium editorial template.', 'my-wpc-template'),
        'enabled' => (bool) apply_filters(
            'wp_posts_carousel_license_allows_feature',
            false,
            $key,
            array('type' => 'template', 'addon' => plugin_basename(__FILE__))
        ),
        'source' => 'my-wpc-template',
        'plan' => 'paid',
    );
    return $features;
});
```

The Pro plugin remains the license authority. Do not force a paid key
to enabled.

## Create a browser renderer

Expose it in PHP and load its script after the frontend runtime:

```php
<?php
add_filter('wp_posts_carousel_frontend_renderers', function (array $items): array {
    $items[] = 'my_renderer';
    return array_values(array_unique($items));
});

add_filter('wp_posts_carousel_frontend_renderers_dictionary', function (array $items): array {
    $items[] = array(
        'name' => 'my_renderer',
        'label' => __('My renderer', 'my-wpc-integration'),
        'description' => __('Enhances prepared carousel HTML.', 'my-wpc-integration'),
        'feature' => '',
        'enabled' => true,
    );
    return $items;
});

add_action('wp_posts_carousel_after_enqueue_scripts', function (): void {
    wp_enqueue_script(
        'my-wpc-renderer',
        plugins_url('assets/my-renderer.js', __FILE__),
        array('cci-wpc-frontend-loader'),
        '1.0.0',
        true
    );
});
```

```js
(function registerMyRenderer() {
  const runtime = window.wpPostsCarousel;
  if (!runtime) return;

  runtime.registerRenderer('my_renderer', {
    mount(element, carousel) {
      element.classList.add('cci-wpc-my-renderer-ready');
      element.dataset.slideCount = String(carousel.slides?.length || 0);
    },
  });
})();
```

The renderer must tolerate repeated mounts and preserve accessible fallback
HTML.

## Observe the browser runtime

```js
const { hooks } = window.wpPostsCarousel;

hooks.addFilter('carouselData', 'my-company/add-source', (data) => ({
  ...data,
  extensionSource: 'my-company',
}));

hooks.addAction('carouselReady', 'my-company/analytics', (data, element) => {
  element.dataset.myCompanyReady = String(data.id || 'yes');
});

hooks.removeFilter('carouselData', 'my-company/add-source');
hooks.removeAction('carouselReady', 'my-company/analytics');
```

Use a unique namespace. Runtime filters, actions and DOM events are listed in
[Hooks and API](./hooks-and-api.md).

## Troubleshooting

1. Confirm the core and add-on are active and PHP has no syntax error.
2. Validate `template.json`; manifest paths are relative to the template directory.
3. Confirm `render` resolves to a real file.
4. Confirm a paid key is allowed for the current domain.
5. Inspect `/wp-json/wp-posts-carousel/v1/carousel/{id}` for React data issues.
6. Test every renderer and engine claimed by the manifest.
7. Check failed requests, console output and computed styles on the live page.
