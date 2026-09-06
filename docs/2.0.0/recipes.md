# WP Posts Carousel practical recipes

These recipes use public settings and extension points available in 2.0.0.
Put PHP snippets in a small site plugin or the child theme's `functions.php`.
Put CSS in the child theme and enqueue it after the carousel/template styles.

## Latest guides from one category

Create a query carousel with the Posts source, select the Guides category,
order by date descending and set the limit. This is configuration-only and
updates automatically when a guide is published.

Use `wp_posts_carousel_query_args` only when the builder cannot express the
rule. This example excludes sticky posts for one saved carousel:

```php
add_filter('wp_posts_carousel_query_args', function (array $args, array $config): array {
    if ((int) ($config['id'] ?? 0) !== 123) {
        return $args;
    }

    $args['post__not_in'] = get_option('sticky_posts', array());
    return $args;
}, 10, 2);
```

## Curated WooCommerce shelf

Choose Manual composition, add products with the search picker and drag them
into campaign order. Prefer this over a query when merchandising order must
not change after new products are published.

To add a numeric merchandising score as another query order:

```php
add_filter('wp_posts_carousel_order_by_map', function (array $map): array {
    $map['merchandising_score'] = 'merchandising_score';
    return $map;
});

add_filter('wp_posts_carousel_query_args', function (array $args, array $config): array {
    if (($config['source']['order_by'] ?? '') !== 'merchandising_score') {
        return $args;
    }

    $args['meta_key'] = '_merchandising_score';
    $args['orderby'] = 'meta_value_num';
    $args['order'] = 'DESC';
    return $args;
}, 10, 2);
```

## Category filters visitors can bookmark

Enable **Advanced > Frontend filters**, select Categories and keep the default
`wpcf_` prefix. A selected category is represented by:

```text
https://example.com/guides/?wpcf_category=12
```

Change only the wrapper markup while preserving links and names:

```php
add_filter(
    'wp_posts_carousel_frontend_filterbar_html',
    function (string $html, array $config, int $post_id, int $carousel_id): string {
        if ($carousel_id !== 123 || $html === '') {
            return $html;
        }

        return '<nav class="cci-wpc-site-filterbar" aria-label="Filter guides">'
            . $html
            . '</nav>';
    },
    10,
    4
);
```

## Override colors and typography in a child theme

Enqueue a stylesheet after the plugin frontend handle:

```php
add_action('wp_enqueue_scripts', function (): void {
    wp_enqueue_style(
        'my-site-wpc-overrides',
        get_stylesheet_directory_uri() . '/assets/css/wpc-overrides.css',
        array('wp-posts-carousel-frontend'),
        wp_get_theme()->get('Version')
    );
}, 30);
```

Scope styles to the selected template instead of changing all carousels:

```css
.cci-wpc-default-template-theme {
  --wpc-carousel-gap: 24px;
  font-family: var(--wp--preset--font-family--body, sans-serif);
}

.cci-wpc-default-template-theme .cci-wpc-card-title a:hover {
  color: var(--wp--preset--color--accent, #1d4ed8);
  text-decoration: underline;
}
```

## Override an existing template

Copy the complete template directory into the child theme:

```text
wp-content/themes/my-child-theme/wp-posts-carousel/templates/default/
  template.json
  views/template.php
  assets/css/style.css
  screenshot.png
```

Keep `name: "default"` in `template.json` to replace that template. Give it a
new name to make both designs selectable. Never edit the plugin copy.

## Add reading time to prepared slide data

```php
add_filter(
    'wp_posts_carousel_slide_view_model',
    function (array $slide, WP_Post $post, array $params, array $config): array {
        $slide['meta']['reading_time'] = (string) get_post_meta(
            $post->ID,
            'reading_time',
            true
        );
        return $slide;
    },
    10,
    4
);
```

The template can read `$slide['meta']['reading_time']`. Escape it before
output.

## Add markup before and after every card

Actions are for side effects and echo output; they do not replace filtered
values:

```php
add_action('wp_posts_carousel_before_item_content', function (array $params): void {
    echo '<span class="cci-wpc-site-card-kicker">Editor pick</span>';
});

add_action('wp_posts_carousel_after_item_content', function (array $params): void {
    echo '<span class="cci-wpc-site-card-end" aria-hidden="true"></span>';
});
```

Use a template override when the markup depends on detailed slide data or
belongs at a precise point inside the card.

## Create a reusable template or extension

Use a child-theme template for one project. Use an installable add-on when the
template must be enabled on multiple sites or must ship with query filters,
assets or its own update lifecycle. The complete manifest and entrypoint are in
[Templates and add-ons](./templates-and-addons.md) and
[Extension cookbook](./extension-cookbook.md).
