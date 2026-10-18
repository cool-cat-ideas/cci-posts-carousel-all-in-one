# CCI Posts Carousel All In One 2.1.0 user guide

CCI Posts Carousel All In One stores each carousel as one reusable definition. Change the
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
2. Upload the base plugin ZIP and activate **CCI Posts Carousel All In One**.
3. Open **CCI Posts Carousel All In One > Dashboard** and click **New carousel**.
4. Enter a name. Under **Query**, choose **Query (automatic)**, select **Posts** and keep the newest-first order.
5. Pick a template and set the desktop, tablet and mobile item counts.
6. Check the query preview, set **Status** to **Published** and click **Save**.
7. Edit a page, add the **CCI Posts Carousel All In One** block and choose the saved
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

### Select a category in the Query tab

Choose **Query (automatic)** under **Content selection**, then select **Posts**.
In **Taxonomy filters**, choose **Categories**, set **Operator** to **In**, type a name in **Search
categories** and select an autocomplete suggestion. Use the arrow keys and
Enter for keyboard selection. The post preview updates automatically when
you change terms, ordering or the limit.

Remove individual terms using **×** on their selected chips. The trash button
clears an entire taxonomy filter. Query results stay automatic after saving;
new matching posts can appear without rebuilding a manual selection.

For a fixed list, choose **Use these posts as manual slides** or switch
**Content selection** to **Manual slides**, then add or arrange slides in
**Slides**. Switching back to Query asks before clearing that manual selection.

Choose a template, configure the engine and responsive item counts, save or
publish, then check the embedded page.

## Keep pinned slides first and fill the remaining places

This option is included in the base plugin. Use it when a few articles, pages or custom slides must stay first while the rest updates automatically.

1. Open or create a carousel. Under **Query → Content selection**, select **Pinned slides + automatic fill**.
2. Choose the post types, categories, ordering and **Posts limit** for automatic results.
3. Click **Pin slide** on a query-preview card. You can also open **Slides** and add a post or custom slide.
4. Drag cards in **Pinned slides** to set their order. Their existing width, crop and grouping options remain available.
5. Check **Automatic results**, then save and preview the published page.

The posts limit counts both groups. With two pins and a limit of six, up to four automatic posts follow the pins. A pinned post is excluded from automatic results, even when it matches the query. New matching posts can appear on later requests without saving the carousel again; a full-page cache may need its normal refresh.

Pins are selected independently of the automatic categories and ordering. Frontend taxonomy filters narrow the automatic results, while the pins stay first. Explicitly excluded, missing, unpublished or password-protected pinned posts do not appear and do not use a place. Custom slides count as pins. If pins fill the limit, no automatic posts are added; extra pins stay saved until you increase the limit.

Remove a pin to let that post appear among automatic results again when it matches. Switching to **Query (automatic)** asks before clearing pins. Switching to **Manual slides** freezes the currently previewed selection. Existing automatic and manual carousels remain unchanged after updating.

## Create a curated product shelf

The base plugin can select WooCommerce products because `product` is a public custom post
type, but it renders them as ordinary linked content cards. For current price,
sale state, rating, buying action and merchandising ordering, activate Pro.

1. Under **Query > Content selection**, choose **Manual slides**.
2. Open **Slides**, select **Products** under **Manual slide post types**, search for products and add them to the sequence.
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

Insert the **CCI Posts Carousel All In One** block and choose the saved carousel from the
selector. The block stores the definition ID, not a copy of its settings.

### Shortcode

Copy the shortcode displayed in the carousel list:

```text
[cci_posts_carousel id="123"]
```

On a long page, keep the first visible carousel eager and defer carousels below
the fold with the public `lazy` attribute:

```text
[cci_posts_carousel id="123" lazy="true"]
```

The lazy placement reserves its space and requests the rendered carousel as it
approaches the viewport. Do not use it for the primary above-the-fold example.

### Theme PHP

Use the shortcode runtime so the theme receives the same output:

```php
echo do_shortcode('[cci_posts_carousel id="123"]');
```

### Elementor (Pro)

Add the CCI Posts Carousel All In One widget and choose the saved definition. Manual ID
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

If you would like help, follow [Support](./support.md) for direct contact links,
the steps to send a message and where to read the reply. Start with what you
tried, the installed plugin version and a screenshot if useful. You do not need
to diagnose the issue or collect developer logs before asking.

## Show a second image on hover

This option is included in the base plugin and is off by default. The featured
image remains the main image of a post or product. A custom slide keeps its own
selected image as the main image.

1. Edit a carousel and open **Advanced > Image on hover**.
2. Enable **Change image on hover**.
3. Choose **Second image source**:
   - **First different image in the content** reads the article or product description.
     An image that repeats the featured image is skipped. Use an image stored in
     the content, such as a WordPress Image or Gallery block. Shortcode output and
     dynamically rendered blocks are not scanned.
   - **WooCommerce product gallery** uses the first gallery image different from
     the product's featured image. WooCommerce must be active; Pro is not required.
   - **Selected in the slide editor** uses only images you pick yourself.
4. To override a single slide, click its pencil button under **Slides** and use **Hover image URL >
   Choose from media library**. This image takes priority over the automatic source. Remove its URL
   to return to the selected source. Automatic query cards must be pinned before
   you can save an individual override.
5. Click **Save**, open the page and move your mouse over a slide. Move away to
   restore the featured image. Check the same page on a phone.

The second image loads only after a mouse enters the slide. Touch screens keep
the main image. A missing, duplicate or failed second image leaves the main image
visible. Posts without a featured image keep their placeholder. Video slides are
not changed. Links, image descriptions and card dimensions stay the same.

The bundled Default, Light and Simple templates support this setting with both
PHP and React output. A third-party template must retain the shared featured-image
HTML or forward the `hover_image.src` value to `data-wpc-hover-src` on its main
image. Do not use a second image to communicate information available nowhere
else: touch and keyboard visitors must be able to find it on the linked page.

Try [A second image on hover](https://wordpress-demo.coolcatideas.com/wp-posts-carousel-demo/#wpc-demo-carousel-image-hover-free).

## Style pinned slides

The visible pinned slides have the class `cci-wpc-slide-pinned` on the outer
slide element. It is available in PHP output, React output and the live preview.
Use it in your theme stylesheet or custom CSS area, for example:

```css
.cci-wpc-slide-pinned .cci-wpc-card,
.cci-wpc-slide-pinned.cci-wpc-card {
  border-color: #5b2cff;
}
```

The class follows the saved pin selection, including custom image slides. It
marks pins that actually fit within the total slide limit. The REST slide data
also contains `pinned: true` for pins and `pinned: false` for automatic results.
The demo shows purple borders using CSS scoped to that example.

Choose how many items to pin by adding or removing pins. **Posts limit** controls
the total number of selected slides, including pins. **Responsive items** controls
how many are visible at once at each screen width. For example, six selected
slides can include two pins while the desktop shows three cards at a time.

## Open slide settings

Click the pencil button on a pinned or manual slide to edit its settings. Clicking
the image or title does not open the editor. Drag the card to change its position.
The pencil button also works with Tab followed by Enter or Space.

Automatic result cards have a pin button. Pin a result first if you want to edit
its placement or choose a hover image. The trash button removes a slide from the
selection; it does not delete the original WordPress post or media file.

Choose **Done** to apply the changes from the slide window to the carousel editor.
Choose **Cancel**, the close button or the backdrop to discard changes from that
window. This also applies to images chosen from the media library. Then use
**Save** on the carousel page to store any applied changes.



## Updating from the previous package name

CCI Posts Carousel All In One was previously named WP Posts Carousel All In One. The name and package slug changed following WordPress’s decision about the plugin name and slug. Your saved carousel IDs, settings, Gutenberg blocks and existing `[wp_posts_carousel]` shortcodes remain supported. You can also use `[cci_posts_carousel]`.

### From 2.0.x to 2.1.0

Update directly to 2.1.0; no intermediate release or carousel recreation is required. This procedure is different from the 1.x upgrade described earlier in this guide.

1. Make a restorable backup of your WordPress files and database. Try the update on a staging copy first.
2. Download `cci-posts-carousel-2.1.0.zip` from the product page. In **Plugins → Add New Plugin → Upload Plugin**, upload and install it. Leave the previous plugin installed and active during this step. The new `cci-posts-carousel` folder is separate from `wp-posts-carousel`; two plugin entries at this point are expected.
3. Click **Activate** for **CCI Posts Carousel All In One**. It switches WordPress from the old base package to the new one. Saved carousel IDs and settings stay in the same database. Do not manually deactivate or delete the old base plugin as a migration step.
4. If you use Pro, check that its license is active. Existing Pro 2.0.0 can remain active while you update to its renamed ZIP; the base and Pro version numbers do not need to match. Install and activate renamed Pro or add-on ZIPs when you have them. Each installed replacement switches its own previous package out of the active plugin list.
5. Clear the page cache and open the carousel list. Check a published page that already uses `[wp_posts_carousel]`, its images and navigation, and any Pro layouts or WooCommerce actions you use. Existing placements keep their IDs; you do not need to replace their shortcodes or re-enter an active license.
6. Keep your backup until the check is complete. Old inactive folders may remain while you verify the site. If you remove them later, use your hosting file manager or SFTP, after confirming that the renamed replacements are active. Do not click **Delete** on the old plugin entry in WordPress: its uninstall routine may remove shared saved data.

Pinning is available under **Query → Content selection → Pinned slides + automatic fill**. The optional second image is under **Advanced → Image on hover** and is off by default. Updating does not enable it on existing carousels.

If a carousel is missing, check that you opened the same WordPress site and that its saved ID matches the shortcode. If you need to roll back, restore the files and database from the same backup.
