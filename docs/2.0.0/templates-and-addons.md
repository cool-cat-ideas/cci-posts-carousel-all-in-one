# WP Posts Carousel templates and add-ons

WP Posts Carousel templates are manifest-based packages. A template can live in
the core plugin, a child theme, uploads or an add-on plugin.

## Template lookup order

The core scans:

```text
wp-content/plugins/wp-posts-carousel/templates/
wp-content/themes/{active-child-theme}/wp-posts-carousel/templates/
wp-content/uploads/wp-posts-carousel/templates/
```

Add-ons can add paths through:

```php
add_filter('wp_posts_carousel_templates_paths', function ($paths) {
    $paths[plugin_dir_path(__FILE__) . 'templates'] = plugin_dir_url(__FILE__) . 'templates';

    return $paths;
});
```

## Override an existing template

Copy the template folder to a child theme:

```text
wp-content/themes/your-child-theme/wp-posts-carousel/templates/{template-name}/
```

Keep the same `name` in `template.json` if the override should replace the saved
carousel template. Use a new `name` when you want a separate selectable
template.

## Create a new template

Minimal directory:

```text
templates/
  my-template/
    template.json
    views/
      template.php
    assets/
      css/
        style.css
    screenshot.png
```

Minimal manifest:

```json
{
  "name": "my-template",
  "title": "My Template",
  "description": "A focused carousel template.",
  "version": "1.0.0",
  "author": "Your Company",
  "author_url": "https://example.com/",
  "tags": ["carousel", "posts"],
  "render": "views/template.php",
  "style": "assets/css/style.css",
  "screenshot": "screenshot.png",
  "supports": {
    "renderers": ["php"],
    "engines": ["owl-carousel"],
    "itemTypes": ["post", "product", "custom"],
    "manualComposition": true,
    "connectedImages": false,
    "videoSlides": false
  },
  "fields": [],
  "pro": false
}
```

Paid templates set a feature key:

```json
{
  "feature": "my_template_feature",
  "pro": true
}
```

The core marks the template as locked until
`wp_posts_carousel_license_allows_feature` allows that key.

## PHP view contract

The view is included inside `WP_Posts_Carousel_Generator`. It receives the
generator as `$this`; prepared data is available in `$this->slide` and through
the mapped legacy properties used by bundled templates. There is no standalone
`$slide` variable. It should render HTML only and avoid heavy queries.

```php
<?php
if (!defined('ABSPATH')) {
    exit;
}

$slide = is_array($this->slide ?? null) ? $this->slide : array();
?>

<article class="my-template-card">
    <?php if (!empty($slide['image']['src'])) : ?>
        <img
            src="<?php echo esc_url($slide['image']['src']); ?>"
            alt="<?php echo esc_attr($slide['image']['alt'] ?? ''); ?>"
            loading="lazy"
        >
    <?php endif; ?>

    <h3><?php echo esc_html($slide['title']['text'] ?? ''); ?></h3>
</article>
```

The include may echo markup or return a string. The generator buffers echoed
markup and appends a returned string. Prefer one style per template and do not
run another post query for data already present in `$this->slide`.

For complete child-theme and installable add-on walkthroughs, see the
[extension cookbook](./extension-cookbook.md).

## CSS contract

Scope template CSS to the template root class. Do not style global Owl, Swiper
or core classes without the template namespace.

Good:

```css
.cci-wpc-my-template-template-theme .owl-nav button {
  width: 38px;
  height: 38px;
}
```

Risky:

```css
.owl-nav button { ... }
.cci-wpc-carousel .owl-dot { ... }
```

Every template must own:

- card layout,
- typography,
- media ratio,
- CTA style,
- hover and focus states,
- Owl arrows,
- Swiper/React arrows where supported,
- dots or pagination,
- responsive behavior.

## Runtime classes and variables

Common root classes:

```text
.cci-wpc-carousel
.cci-wpc-engine-owl
.cci-wpc-engine-swiper
.cci-wpc-{template}-template-theme
```

Useful CSS variables:

```text
--wpc-carousel-gap
--wpc-control-axis-y
--wpc-crop-x
--wpc-crop-y
--wpc-slide-accent
```

Use `--wpc-control-axis-y` for arrow placement so controls align to the actual
carousel viewport, not to the entire section wrapper.

## Icons and arrows

Owl navigation should receive real FontAwesome markup:

```html
<i class="fa fa-angle-left" aria-hidden="true"></i>
<span class="screen-reader-text">previous</span>
```

and:

```html
<i class="fa fa-angle-right" aria-hidden="true"></i>
<span class="screen-reader-text">next</span>
```

Do not draw arrows with `.owl-prev::before` or `.owl-next::before`.

## Responsive checklist

Before shipping a template, test:

- desktop and mobile widths,
- 1, 2, 3 and 5+ slides,
- long titles,
- no featured image,
- product price plus sale price,
- WooCommerce `View cart` state after add to cart,
- Owl and Swiper/React if the manifest supports both,
- arrows, dots and keyboard focus,
- inactive slides not bleeding into the viewport,
- card borders not being clipped.

## Bundled templates

| Template | Package | Version | Notes |
| --- | --- | --- | --- |
| `default` | Core plugin | 2.0.0 | General card template for posts and products. |
| `simple` | Core plugin | 2.0.0 | Cleaner content cards. |
| `light` | Core plugin | 2.0.0 | Lighter editorial cards. |
| `aurora-cards` | WP Posts Carousel Aurora Cards | 1.0.0 | No-cost external template for editorial content and products. |
| `commerce-luxe` | WP Posts Carousel Pro | 2.0.0 | Pro commerce shelf. |
| `story-commerce` | WP Posts Carousel Pro | 2.0.0 | Pro mixed-format guided buying sequence. |
| `video-showcase` | WP Posts Carousel Pro | 2.0.0 | Pro video campaign player with local playlists. |
