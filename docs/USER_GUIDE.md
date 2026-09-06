# WP Posts Carousel All In One user guide

WP Posts Carousel stores each carousel as one reusable definition. Change the
definition once and every Gutenberg, shortcode, PHP or Elementor placement
using it receives the new content and layout.

## Install And Publish A First Carousel

1. Open **Plugins > Add New > Upload Plugin**.
2. Upload the base plugin ZIP and activate **WP Posts Carousel All In One**.
3. Open **WP Posts Carousel > Carousels** and click **Add New**.
4. Enter an internal name, choose **Posts** and keep the newest-first order.
5. Pick a template and set the desktop, tablet and mobile item counts.
6. Check the preview and save.
7. Edit a page, add the **WP Posts Carousel** block and choose the saved
   carousel.
8. Publish the page and check it on desktop and mobile.

If the block is empty, confirm that the selected post type has published items,
the chosen terms contain posts and the item limit is above zero.

Install Pro later when the site needs current WooCommerce data and buying
actions, Commerce Luxe, Story Commerce, Video Showcase, Elementor, reports or
Multisite. All of these tools come in one Pro plugin.

WordPress and PHP requirements are listed on the release page. WooCommerce is
optional and is needed only for product sources and commerce features.

## Create a latest-posts carousel

1. Click **Add New** and enter an internal name such as `Homepage guides`.
2. Choose **Query** composition and the **Posts** source.
3. Select the post type, category or taxonomy terms that should be included.
4. Order by publication date, descending.
5. Set the item limit.
6. Choose `default`, `simple` or `light`.
7. Choose Owl Carousel or Swiper.
8. Set the desktop, tablet and mobile item counts and gap.
9. Check the live preview and save.

Use query composition for content that should update automatically when new
posts are published.

## Create a curated product shelf

The base plugin can select WooCommerce products because `product` is a public custom post
type, but it renders them as ordinary linked content cards. For current price,
sale state, rating, buying action and merchandising ordering, activate Pro.

1. Choose **Manual** composition.
2. Search for WooCommerce products and add them to the sequence.
3. Drag the slides into the required merchandising order.
4. Open a slide only when it needs a custom crop, width or per-slide setting.
5. Select a product-compatible template and verify regular and sale prices.
6. Save and test both **Add to cart** and the WooCommerce **View cart** state.

See [WooCommerce product carousels](./2.0.0/woocommerce-products.md) for the
store-aware setup and layout choices. No separate WooCommerce WPC add-on is needed.

Manual composition changes only the carousel order. It does not edit or delete
the selected products/posts.

## Add filters above a carousel

Frontend filters let visitors narrow a query carousel by taxonomy while
keeping linkable, server-rendered URLs.

1. Edit a query-based carousel and open **Advanced > Frontend filters**.
2. Enable **Show filters on frontend**.
3. Select one or more taxonomies, for example Categories or Product
   categories.
4. Set the **All label**, URL prefix and number of terms to show.
5. Save and open the final page.

The default URL contract is:

```text
?wpcf_category=12
?wpcf_product_cat=34
```

The page reload is intentional: the selected state works with PHP output, Owl
and Swiper and can be linked directly. Developers can replace the bar markup
with `wp_posts_carousel_frontend_filterbar_html` or adjust the query with
`wp_posts_carousel_query_args`.

## Map custom fields

In **Advanced > Custom field mapping**, map post meta or ACF field names to
supported slide fields such as eyebrow, kicker, duration, CTA label, custom
URL or image URL. The plugin reads the saved post meta; ACF does not need to be
active at render time.

Example mapping:

```json
{
  "eyebrow": "campaign_badge",
  "duration": "reading_time",
  "button_label": "carousel_cta_label",
  "url": "carousel_target_url"
}
```

## Publish the saved carousel

### Gutenberg

Insert the **WP Posts Carousel** block and choose the saved carousel from the
selector. The block stores the definition ID, not a copy of its settings.

### Shortcode

Copy the shortcode displayed in the carousel list:

```text
[wp_posts_carousel id="123"]
```

On a long page, keep the first visible carousel eager and defer carousels below
the fold with the public `lazy` attribute:

```text
[wp_posts_carousel id="123" lazy="true"]
```

The lazy placement reserves its space and requests the rendered carousel as it
approaches the viewport. Do not use it for the primary above-the-fold example.

### Theme PHP

Use the shortcode runtime so the theme receives the same output:

```php
echo do_shortcode('[wp_posts_carousel id="123"]');
```

### Elementor (Pro)

Add the WP Posts Carousel widget and choose the saved definition. Manual ID
typing is only a fallback; the normal workflow uses the searchable selector.

## Change appearance safely

Start with the smallest override:

1. CSS-only change for colors, spacing or typography.
2. Child-theme template override when card markup must change for one site.
3. New template when users should choose the design independently.
4. Add-on plugin when the template, query or renderer will be distributed.

Do not edit files inside the installed plugin. Updates replace them. See
[Practical recipes](./2.0.0/recipes.md) and
[Templates and add-ons](./2.0.0/templates-and-addons.md).

## Performance settings

- Enable lazy images for carousels below the first viewport.
- Enable eager loading for the first image when the carousel is near the top.
- Choose an image size close to the rendered card dimensions instead of
  loading `full` images for dense rows.
- If the theme already loads a compatible Owl/Swiper asset, use compatibility
  settings instead of loading the library twice.

## Before publishing

Check the final page, not only the admin preview:

- desktop and mobile widths,
- 1 slide and more slides than fit in the viewport,
- long titles and missing featured images,
- arrow, dot and keyboard focus states,
- active frontend filter URLs,
- product sale prices and **View cart**,
- video playback for video templates.

## Add templates and integrations

Install add-ons as normal WordPress plugins. After activation, a valid local
template appears under installed templates and in the carousel template
selector. A source integration adds its source/order options according to its
documentation.

Local add-ons do not automatically become marketplace products. The store
catalog and installed extensions are separate data sets.

## Troubleshooting and support

When a carousel is empty, first confirm the source query, selected terms,
publication state and item limit. When styling differs from the preview,
inspect the active template root and theme rules before adding another global
override.

For support include plugin versions, WordPress/PHP versions, active theme,
carousel name, source, template, engine, page URL, exported configuration,
screenshots and browser console errors.
