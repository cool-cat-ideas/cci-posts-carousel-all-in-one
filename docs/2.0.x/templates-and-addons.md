# Template development

WP Posts Carousel templates are manifest-based packages. A template can live in the core plugin, a child theme, uploads or an add-on plugin.

## Template lookup order

Since base plugin 2.0.1, discovery uses the following precedence. The first usable manifest for a name wins:

```text
wp-content/themes/{active-child-theme}/wp-posts-carousel/templates/
wp-content/plugins/wp-posts-carousel/templates/
wp-content/uploads/wp-posts-carousel/templates/
```

Additional paths appended by extensions follow these roots. A path filter can deliberately change the order. Missing/unreadable PHP views and empty sanitized names are skipped, so an incomplete override falls back to the next usable template. On 2.0.0, the bundled template took precedence; update the base plugin before following the override guide.

Add-ons can add paths through:

```php
add_filter('wp_posts_carousel_templates_paths', function ($paths) {
    $paths[plugin_dir_path(__FILE__) . 'templates'] = plugin_dir_url(__FILE__) . 'templates';

    return $paths;
});
```

## Where a custom template appears

A valid local manifest discovered from any scan root appears automatically in
**Templates > Installed templates** and in the template selector used by the
carousel editor. It does not need a marketplace record.

**Available in store** is a separate remote catalog feed. A local template does
not appear there unless its publisher also creates and publishes the matching
store catalog item. The admin reconciles matching identities only to mark that
store item as already installed.

Discovery requirements are strict: the folder must contain valid JSON, a unique
sanitized `name`, and an existing `render` PHP file. Missing optional CSS or a
screenshot does not prevent discovery; an invalid/missing render file prevents
the template from being usable.

## Override an existing template

To override a template from a child theme, copy its folder to:

```text
wp-content/themes/your-child-theme/wp-posts-carousel/templates/{template-name}/
```

Example:

```text
wp-content/themes/my-theme/wp-posts-carousel/templates/default/
  template.json
  views/template.php
  assets/css/style.css
  screenshot.png
```

Keep the same `name` in `template.json` if the override should replace the saved carousel template. Use a new `name` when you want a separate selectable template.

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
  "version": "2.0.0",
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

The core marks the template as locked until `wp_posts_carousel_license_allows_feature` allows that key.

## PHP view contract

The view is included in the generator method scope. It receives the generator
as `$this`; there is no standalone `$slide` variable. Copy prepared data from
`$this->slide`, render HTML only and avoid queries.

Use WordPress escaping helpers:

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

<article class="cci-wpc-my-template-card">
    <?php if (!empty($image['src'])) : ?>
        <a href="<?php echo esc_url($url); ?>">
            <img
                src="<?php echo esc_url($image['src']); ?>"
                alt="<?php echo esc_attr($image['alt'] ?? $title); ?>"
                loading="lazy"
            >
        </a>
    <?php endif; ?>

    <h3><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($title); ?></a></h3>

    <?php if (!empty($slide['excerpt']['text'])) : ?>
        <p><?php echo esc_html($slide['excerpt']['text']); ?></p>
    <?php endif; ?>
</article>
```

The include may echo markup or return a string; use one approach consistently.

## CSS contract

Scope template CSS to the template root class. Do not style global Owl, Swiper or core classes without the template namespace.

Good:

```css
.cci-wpc-my-template-template-theme .owl-nav button {
  width: 38px;
  height: 38px;
}

.cci-wpc-my-template-template-theme .cci-wpc-card-title a:hover {
  text-decoration: underline;
}
```

Risky:

```css
.owl-nav button { ... }
.site-carousel .owl-dot { ... }
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

## Runtime classes and CSS variables

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

Use `--wpc-control-axis-y` for arrow placement so controls align to the actual carousel viewport, not to the entire section wrapper.

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

## Connected image strips

For panoramic/offset layouts, keep one image source and vary crop position per slide. Slide data can use:

```json
{
  "group": "campaign-panorama",
  "crop_x": -45,
  "crop_y": 0,
  "span": 1
}
```

The CSS should apply:

```css
object-position: var(--wpc-crop-x, 50%) var(--wpc-crop-y, 50%);
```

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

Template versions below come from each template manifest. They are separate from the version of the plugin that includes the template.

| Template | Package | Template version | Notes |
| --- | --- | --- | --- |
| `default` | Core plugin | 2.0.0 | General card template for posts and products. |
| `simple` | Core plugin | 2.0.0 | Cleaner content cards. |
| `light` | Core plugin | 2.0.0 | Lighter editorial cards. |
| `aurora-cards` | WP Posts Carousel Aurora Cards | 1.0.0 | Separately installable external template for editorial content and products; no paid license required. |
| `commerce-luxe` | WP Posts Carousel Pro | 2.0.0 | Pro commerce shelf. |
| `story-commerce` | WP Posts Carousel Pro | 2.0.0 | Pro mixed-format guided buying sequence. |
| `video-showcase` | WP Posts Carousel Pro | 2.0.0 | Bundled Pro video campaign player with local playlists. |
