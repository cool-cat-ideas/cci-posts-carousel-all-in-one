# Practical recipes

Start with the editor workflows below. Selecting posts from a category does
not require PHP, a paid edition or a developer.

Only the recipes explicitly labelled PHP require code. Put those snippets in
a small site plugin or the child theme's `functions.php`. Put CSS in a
child-theme stylesheet loaded after the carousel styles.

## Latest guides from one category

This is a no-code workflow in the saved-carousel editor (2.0.3 and later):

1. Open **WP Posts Carousel > Dashboard** and create or edit a carousel.
2. Open the **Query** tab. Set **Content selection** to **Query (automatic)**.
3. Under **Post types**, select **Posts** (`post`).
4. Under **Taxonomy filters**, set **Taxonomy** to **Categories** (`category`).
5. Set **Operator** to **In**. This includes posts assigned to the categories you select.
6. Click **Search categories** to browse suggestions, or type a category name
   such as `Guides`. Click the matching suggestion, or use the arrow keys and
   Enter. Guides is an example; choose a category that exists on your site.
7. Confirm the category appears as a selected chip. Use the chip's **×** to
   remove that one category. The trash button removes the entire taxonomy filter.
8. Set **Order by** to date, **Order** to descending and **Posts limit** to
   the number of posts you want. The **Query preview** refreshes automatically.
9. Save or publish the carousel and check its embedded page.

Typing a name searches categories; it does not search post titles and does
not select a category until you choose a suggestion. New posts matching the
saved query can appear automatically. Query preview results are not saved as
manual slide IDs.

For a fixed selection, choose **Use these posts as manual slides** or switch
**Content selection** to **Manual slides**, then open **Slides** to add
and arrange items. Switching back to Query clears the manual selection after
confirmation; it does not delete the original posts or media.

If **Taxonomy filters** is missing, check that **Posts** is selected in
**Post types**. Only taxonomies for selected post types are available. If
Categories is still missing, please [open a support request](./support.md#choose-the-right-support-channel).
Include your installed plugin version and a screenshot of **Query** so we can
help you find the cause. You can find the version under **Plugins > Installed Plugins**.

**Taxonomy filters** choose what the carousel contains. **Advanced > Frontend
filters** adds visitor-facing controls. A PHP filter is a separate developer
extension point; none is needed for this category selection.

### Optional PHP: exclude sticky posts

Use a PHP filter only for an extra rule the editor cannot express. For example,
exclude sticky posts from one saved carousel:

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

1. Open **Query** and set **Content selection** to **Manual slides**.
2. Open **Slides**. Choose **Products** under **Manual slide post types**.
3. Search for products and select the ones you want to add.
4. Drag the selected cards into your preferred order.
5. Choose a template under **Design**, then save and check the published page.

This changes only the carousel sequence; it does not edit or delete the
WooCommerce products. Product links work with the base plugin. Current prices
and purchase actions need [Pro](./woocommerce-products.md).

### Optional PHP: custom merchandising order

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
multiple sites. Continue with [Extensions](./extensions.md) and
[Styles and templates](./templates-and-addons.md).
