# WP Posts Carousel All In One 2.0.x user guide

WP Posts Carousel stores each carousel as one reusable definition. Change the
definition once and every Gutenberg, shortcode, PHP or Elementor placement
using it receives the new content and layout.

## Updating from 1.x

Version 2.x rewrites the carousel data model, editor, widgets and shortcode
configuration. Existing 1.x carousels are not automatically converted.
Recreate them in the new editor, save and publish them, then replace every
old placement. Follow [Upgrade from 1.x to 2.x](./upgrading-from-1.x.md) for
the workflow and a screenshot of the dashboard.

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

Declared compatibility: **WordPress 6.2 through 7.1.3** and **PHP 7.4 or later**. WooCommerce is
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

See [WooCommerce product carousels](./woocommerce-products.md) for the
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
[Practical recipes](./recipes.md) and
[Templates and add-ons](./templates-and-addons.md).

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

## External services and reviews

Opening the plugin admin can automatically refresh product news and the
marketplace catalog from Cool Cat Ideas. The request includes the product,
language and news limit, along with the server IP address and standard
WordPress HTTP headers, which normally include the WordPress version and site
URL. Cached results reduce repeat requests. An unavailable feed does not stop
saved carousels from working.

**Add review** opens a form with a consent checkbox. Only accepting that consent
and clicking **Save feedback** submits the review to Cool Cat Ideas for
moderation and possible publication. The submission also includes site and
plugin information and the consent record; it is not published automatically.
The consent text is supplied with the plugin, without a separate external
request when the form opens.

Compatibility settings use local icon files by default. Choosing **CDN** loads
the selected icon library from jsDelivr or BootstrapCDN in visitors' browsers.

See [External services in readme.txt](../../readme.txt) for the endpoints, data
sent, privacy policies and terms of use.

## Troubleshooting and support

When a carousel is empty, first confirm the source query, selected terms,
publication state and item limit. When styling differs from the preview,
inspect the active template root and theme rules before adding another global
override.

For support include plugin versions, WordPress/PHP versions, active theme,
carousel name, source, template, engine, page URL, exported configuration,
screenshots and browser console errors.
