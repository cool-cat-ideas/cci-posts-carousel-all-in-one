# Loading skeletons and custom HTML

Available in Free 2.2.0 and in carousels used with Pro. A skeleton appears while a lazy-loaded carousel or a full React renderer fetches its cards. Ordinary server-rendered cards remain visible; they are not hidden to show a placeholder. The skeleton works independently of the selected Owl or Swiper engine.

## Enable deferred loading

Publish the carousel and use its ID:

```text
[cci_posts_carousel id="42" lazy="true"]
```

The placeholder follows the saved responsive column counts and two-row phone settings. Loading begins when the carousel approaches the viewport. In the full React renderer, it remains visible until both the cards and the carousel engine are ready. A failed content request displays a translated error and a **Try again** button instead of leaving a permanent skeleton.

Server-rendered cards use a responsive initial grid while Owl or Swiper loads. This uses the carousel's saved column counts, row count and spacing, so the cards do not first appear as a full-width vertical list. The library takes over the same cards when it is ready. This also applies to compatible custom templates whose slide wrapper is `.cci-wpc-slide`.

## Replace the skeleton HTML in a child theme

Create `wp-content/themes/your-child-theme/cci-posts-carousel/skeleton.php`:

```php
<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
/** @var array $args */
?>
<div class="my-carousel-loading">
    <div class="my-carousel-loading__image"></div>
    <p><?php esc_html_e( 'Preparing your reading list…', 'your-child-theme' ); ?></p>
</div>
```

Style `.my-carousel-loading` in the child theme stylesheet. This file replaces the inner HTML only. The plugin keeps the loading state, responsive wrapper, accessibility status and retry behavior. The placeholder is decorative (`aria-hidden` and `inert`); do not place links, forms or other interactive controls inside it.

For the default responsive card grid, output `.cci-wpc-skeleton-card` elements directly and loop up to `$args['card_count']`. For a single custom block like the example above, use `.cci-wpc-skeleton .my-carousel-loading { grid-column: 1 / -1; }`.

Override order: child/parent theme `cci-posts-carousel/skeleton.php`, then `skeleton.php` in the selected carousel template directory, then the plugin default. Do not edit files inside the installed plugin.

## Use different HTML for one carousel

Add this filter in the child theme `functions.php` or a site plugin:

```php
add_filter( 'wp_posts_carousel_skeleton_template', function ( $path, $args ) {
    if ( 42 === $args['post_id'] ) {
        return get_stylesheet_directory() . '/cci-posts-carousel/reading-list-skeleton.php';
    }
    return $path;
}, 10, 2 );
```

Create the referenced PHP file using the same example. Return a readable local PHP file path; an invalid path falls back to the built-in skeleton. Use trusted theme/plugin files only, never a path taken from a request.

## Filter the rendered HTML

`wp_posts_carousel_skeleton_html` runs after the template renders. It receives `(string $html, array $args)` and must return an HTML string:

```php
add_filter( 'wp_posts_carousel_skeleton_html', function ( $html, $args ) {
    if ( 42 !== $args['post_id'] ) {
        return $html;
    }
    return '<div class="my-carousel-loading">'
        . esc_html__( 'Preparing recommendations…', 'your-child-theme' )
        . '</div>';
}, 10, 2 );
```

Both filters receive the same `$args`: `post_id` (int, 0 for an unsaved configuration), `instance_id` (string, identifies this placement), `config` (normalized carousel configuration), `template` (selected template descriptor), `rows` (int, 1 or 2) and `card_count` (int, at most 24). The file override also receives this variable. Escape dynamic text and URLs yourself; this is a developer-owned HTML extension point.

## Change only the placeholder styling

```css
.cci-wpc-skeleton {
    --wpc-skeleton-color: #e8ebef;
    --wpc-skeleton-image-height: 180px;
}
```

The default uses static blocks, without a shimmer animation. No database migration is needed for theme overrides.

## Reserve space for a custom layout

A skeleton must occupy the space that the finished carousel will use. The built-in placeholder uses the configured image height where it is expressed in pixels. Vertical Swiper carousels reserve their viewport and standard navigation space. A custom card with longer text, a different image ratio or custom controls can need a different height.

Add `reading-list` to the parent Group block's **Additional CSS class(es)** and set a responsive minimum height in the child theme:

```css
.reading-list {
    --wpc-loading-height: 420px;
    --wpc-skeleton-image-height: 180px;
}

@media (min-width: 768px) {
    .reading-list {
        --wpc-loading-height: 480px;
    }
}
```

These are example values: measure your finished layout at each breakpoint. `--wpc-loading-height` reserves space for the deferred source and the full React renderer; it is a minimum height, so longer content can still expand. Match your custom skeleton to those dimensions. Keep image dimensions or aspect ratios explicit and load the site's fonts consistently. A placeholder alone cannot prevent shifts caused by a later font swap or content that is taller than the reserved space.
