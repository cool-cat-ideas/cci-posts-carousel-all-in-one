# Related Content add-on

Related Content for CCI Posts Carousel is a standalone product distributed without a paid license. It fills a
carousel with articles or products related to the page a visitor is viewing.
The extension excludes that page or product and chooses the strongest matching
strategy available.

## Which matching system is used?

1. Product-only carousels use WooCommerce's public
   `wc_get_related_products()` function. This keeps product matching compatible
   with WooCommerce categories, tags and related-product filters.
2. Posts, pages and other public post types prioritize the Yoast SEO primary
   term when `yoast_get_primary_term_id()` is available.
3. Remaining positions use other public taxonomy terms shared with the
   reference item.

Yoast SEO Premium's internal-linking suggestions are an editor feature. Yoast
does not expose them as a documented frontend related-products API, so this
add-on does not read Yoast database tables or private Premium services.

## Install and create a carousel

1. Install and activate **CCI Posts Carousel All In One 2.0.0 or later**.
2. Install and activate **Related Content for CCI Posts Carousel 1.0.0**.
3. Open **CCI Posts Carousel All In One > Dashboard** and click **New carousel** or edit an existing carousel.
4. Under **Query**, set **Content selection** to **Query (automatic)** and select the **Post types** you want to recommend.
5. Select **Related to the current post or product** under **Order by**.
6. Set **Posts limit**. Under **Design**, choose a template. Set responsive item counts under **General**, then save with **Status > Published**.
7. Follow [Publishing](./publishing.md) to place the carousel on an individual post, page or product.

The individual post or product being viewed supplies the reference item. Test
the published page, not just the editor preview. If the reference has no shared
public terms and WooCommerce returns no matching products, the row is empty.
On a page without a reference post or product, the carousel may show the
original query results. For recommendations tied to a particular item, place
the carousel on that item's page.

If you would like help with an empty row, [open a support request](./support.md#choose-the-right-support-channel)
with the page address, carousel name and a screenshot of **Query**.

## Live example

Open [Related Reading by Shared Topics](https://wordpress-demo.coolcatideas.com/wp-posts-carousel-demo/#wpc-demo-carousel-related-content-showcase)
on the public demo.
The seed pins a reference article so the example also works on the general demo
page.

For the product-specific path, open
[Native WooCommerce Related Products](https://wordpress-demo.coolcatideas.com/wp-posts-carousel-demo/#wpc-demo-carousel-related-products-showcase).

## Disable an optional integration

```php
add_filter(
    'wp_posts_carousel_related_content_use_woocommerce',
    '__return_false'
);

add_filter(
    'wp_posts_carousel_related_content_use_yoast_primary_term',
    '__return_false'
);
```

Each filter receives:

- `$enabled` (`bool`) — return whether the integration should run.
- `$reference` (`WP_Post`) — reference item.
- `$config` (`array`) — normalized carousel configuration.
- `$queryArgs` (`array`) — query arguments prepared by the core plugin.

## Reference item filter

`wp_posts_carousel_related_content_reference_post_id`

```php
add_filter(
    'wp_posts_carousel_related_content_reference_post_id',
    function (int $referenceId, array $config, array $queryArgs): int {
        return is_page('seasonal-picks') ? 123 : $referenceId;
    },
    10,
    3
);
```

Arguments:

- `$referenceId` (`int`) — detected reference ID or `0`.
- `$config` (`array`) — normalized carousel configuration.
- `$queryArgs` (`array`) — core query arguments before related terms are added.

Return a valid WordPress post ID.

## Final query filter

`wp_posts_carousel_related_content_query_args`

```php
add_filter(
    'wp_posts_carousel_related_content_query_args',
    function (array $args, WP_Post $reference, array $config): array {
        $args['posts_per_page'] = min(8, (int) $args['posts_per_page']);

        return $args;
    },
    10,
    3
);
```

Arguments:

- `$args` (`array`) — final `WP_Query` arguments; return this array.
- `$reference` (`WP_Post`) — reference item used to collect terms.
- `$config` (`array`) — normalized carousel configuration.

The add-on produces no HTML. The selected carousel template remains responsible
for every card.
