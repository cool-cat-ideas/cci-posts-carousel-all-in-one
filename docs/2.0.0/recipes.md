# Practical recipes

Put PHP snippets in a small site plugin or the child theme's `functions.php`.
Put CSS in a child-theme stylesheet loaded after the carousel styles.

## Latest guides from one category

Use Query composition with the Posts source, select the Guides category,
order by date descending and set the item limit. The carousel then updates
automatically when a guide is published.

If the builder cannot express an extra condition, change only the target saved
carousel query:

```php
add_filter('wp_posts_carousel_query_args', function (array $args, array $config): array {
    if ((int) ($config['id'] ?? 0) !== 123) {
        return $args;
    }

    $args['post__not_in'] = get_option('sticky_posts', array());
    return $args;
}, 10, 2);
```

## Curated product shelf

Choose Manual composition, find products with the search picker and drag them
into campaign order. This changes only the carousel sequence; it does not edit
or delete the WooCommerce products.

Add a reusable numeric merchandising order:

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

Open **Advanced > Frontend filters**, enable the filter bar and select
Categories. With the default prefix, the selected state is a normal URL:

```text
https://example.com/guides/?wpcf_category=12
```

The server applies the term to the query, so the link works with PHP output,
Owl and Swiper. Replace only the wrapper markup when needed:

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

## Override colors and typography

For a page using the default template, load a child-theme stylesheet after both the shared and default-template styles. This recipe intentionally depends on that template handle; use the selected template name if your page uses another template:

```php
add_action('wp_enqueue_scripts', function (): void {
    wp_enqueue_style(
        'my-site-wpc-overrides',
        get_stylesheet_directory_uri() . '/assets/css/wpc-overrides.css',
        array('wp-posts-carousel-frontend', 'wp-posts-carousel-template-default'),
        wp_get_theme()->get('Version')
    );
}, 30);
```

Scope the CSS to one template:

```css
.cci-wpc-default-template-theme {
  /* Set the gap in carousel settings; runtime writes it inline. */
  font-family: var(--wp--preset--font-family--body, sans-serif);
}

.cci-wpc-default-template-theme .cci-wpc-card-title a:hover {
  color: var(--wp--preset--color--accent, #1d4ed8);
  text-decoration: underline;
}
```

## Override the complete card template

Copy the template to the active child theme:

```text
wp-content/themes/my-child-theme/wp-posts-carousel/templates/default/
  template.json
  views/template.php
  assets/css/style.css
  screenshot.png
```

Keep `name: "default"` to replace the saved template. Use a new manifest name
to offer both designs in the carousel selector.

## Add data to each post slide

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

Read `$slide['meta']['reading_time']` in the template and escape it before
output.

## Add markup around standard card content

```php
add_action('wp_posts_carousel_before_item_content', function (array $params): void {
    echo '<span class="cci-wpc-site-card-kicker">Editor pick</span>';
});

add_action('wp_posts_carousel_after_item_content', function (array $params): void {
    echo '<span class="cci-wpc-site-card-end" aria-hidden="true"></span>';
});
```

Use a template override when the new markup belongs at a precise location
inside a card or requires detailed slide data.

## Turn the customization into an extension

Use a child-theme override for one project. Build an installable extension when
the same template, source or renderer needs its own version and update cycle on
multiple sites. Continue with [Extensions](extensions.md) and
[Styles and templates](templates-and-addons.md).
