# Custom Swiper control HTML

Available in 2.2.0 for horizontal and vertical Swiper carousels. Replace the control HTML when you want your own wrappers, text or layout. No JavaScript slider implementation is required: the plugin binds your elements to the existing Swiper instance.

For a position-only change, [vertical carousel CSS variables](./vertical-carousels.md) are usually sufficient.

## Create a child-theme partial

Create `wp-content/themes/your-child-theme/cci-posts-carousel/controls.php`:

```php
<?php
defined( 'ABSPATH' ) || exit;
/** @var array $args */
// Limit this example to one carousel. Empty output keeps its default controls.
if ( 42 !== $args['post_id'] ) {
    return;
}
$options = $args['config']['engine']['options'];
$navigation = filter_var( $options['nav'] ?? true, FILTER_VALIDATE_BOOLEAN );
$pagination = filter_var( $options['dots'] ?? true, FILTER_VALIDATE_BOOLEAN );
?>
<nav class="reading-list-controls" aria-label="<?php esc_attr_e( 'Reading list navigation', 'your-child-theme' ); ?>">
    <?php if ( $navigation ) : ?>
        <button type="button" data-wpc-control="previous">
            <?php esc_html_e( 'Previous guide', 'your-child-theme' ); ?>
        </button>
    <?php endif; ?>
    <?php if ( $pagination ) : ?>
        <div class="reading-list-pagination" data-wpc-control="pagination"></div>
    <?php endif; ?>
    <?php if ( $navigation ) : ?>
        <button type="button" data-wpc-control="next">
            <?php esc_html_e( 'Next guide', 'your-child-theme' ); ?>
        </button>
    <?php endif; ?>
</nav>
```

Replace `42` with a published carousel ID. This partial replaces all default controls for that instance. Keep the pagination container empty: Swiper creates its bullets, fraction or progress bar according to the saved setting.

The three attributes are the binding contract:

| Attribute | Purpose |
| --- | --- |
| `data-wpc-control="previous"` | Previous slide button |
| `data-wpc-control="next"` | Next slide button |
| `data-wpc-control="pagination"` | Swiper pagination container |

Use real buttons with visible text or an accessible label. You can place these elements inside your own wrappers, change their order or omit a control. Keep at most one of each per carousel. The binding is scoped to the current carousel, so duplicate instances do not control each other. Links and arbitrary selectors outside the carousel are not used as controls.

## Place your HTML below a vertical carousel

Add this to the child-theme stylesheet:

```css
.reading-list .cci-wpc-render-preview[data-wpc-direction='vertical'] {
  --wpc-vertical-columns: minmax(0, 1fr);
}
.reading-list-controls {
  grid-area: 3 / 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.reading-list .reading-list-controls [data-wpc-control='pagination'] {
  position: static;
  transform: none;
  display: flex;
  justify-content: center;
  gap: 4px;
  width: auto;
}
.reading-list-controls button {
  min-height: 44px;
}
```

Your theme supplies button colors, borders and focus styles. To place the toolbar above the cards, change `grid-area` to `1 / 1`. To put the two arrows in separate cells above and below, output separate wrappers from the PHP partial and assign those cells in CSS.

## Template files and filters

Resolution order is child/parent theme `cci-posts-carousel/controls.php`, then `controls.php` inside the selected carousel template directory. Empty output or an invalid path leaves the default controls in place.

`wp_posts_carousel_controls_template` runs before the partial is included. It receives `(string $path, array $args)` and returns a readable, trusted local PHP path, or an empty string to skip the file. `wp_posts_carousel_controls_html` runs after the partial, including when no file was found. It receives `(string $html, array $args)` and returns replacement HTML; an empty string keeps the default controls.

Both filters receive `post_id` (int, 0 for an unsaved preview), `instance_id` (string identifying this placement), `config` (normalized carousel configuration) and `template` (selected template descriptor) in `$args`. They run while the Swiper response is prepared, for frontend requests and editor previews. Scope changes by carousel ID and escape dynamic values in your HTML.

```php
add_filter( 'wp_posts_carousel_controls_template', function ( $path, $args ) {
    if ( 42 === $args['post_id'] ) {
        return get_stylesheet_directory() . '/cci-posts-carousel/reading-list-controls.php';
    }
    return $path;
}, 10, 2 );
```

Never choose a PHP file from a request parameter. Keep overrides in your child theme or a site plugin, not inside the installed product. These hooks target Swiper; they do not replace Owl's native controls or the separate Pro group toolbar API.
