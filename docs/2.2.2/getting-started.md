# Getting started

This guide creates a saved carousel that can be reused on multiple pages.

## Before you start

Install and activate the base `cci-posts-carousel` plugin. Add
`cci-posts-carousel-pro` only when you need current WooCommerce data and buying
actions, Pro templates, Elementor, reports or Multisite tools.

Install a template or source add-on only when you plan to use it.

The base plugin is enough for posts, pages, custom post types and linked product
cards.

## Create the first carousel

1. Open **CCI Posts Carousel All In One > Dashboard** in WordPress admin.
2. Click **New carousel**.
3. Enter a clear internal name, for example `Homepage feature story cards`.
4. Open **Query**. Keep **Content selection** set to **Query (automatic)** and select **Posts** under **Post types**.
5. Set **Posts limit**, then choose date order from newest to oldest. The **Query preview** shows the matching posts.
6. Under **Design > Template**, choose **Default**. Under **General > Engine**, choose **Owl Carousel 2**.
7. Set the desktop, tablet and mobile item counts in the responsive settings.
8. Set **Status** to **Published** and click **Save**.
9. Edit the WordPress page where the carousel should appear. Click the block inserter **+**, search for **CCI Posts Carousel All In One** and add the block.
10. Choose your saved carousel in the block, then publish or update the page.
11. Open the actual page on desktop and mobile. The editor preview helps you check the selection; the published page shows the theme and engine behavior.

If the carousel is empty, confirm that the selected content is published, the
chosen category or taxonomy contains items and the item limit is above zero.
If you would like help, [choose a support channel](./support.md#choose-the-right-support-channel)
and include the carousel name or shortcode and a screenshot of **Query**.

## Return to a saved carousel

Dashboard shows recent work. Open **Carousels** for the full sortable list,
shortcodes and saved previews. See [Dashboard and Carousels](./dashboard-and-carousels.md).

## Recommended first use cases

### Show posts from one category without PHP

Open the saved carousel's **Query** tab, choose **Query (automatic)** and
select **Posts**. Under **Taxonomy filters**, choose **Categories** and set
**Operator** to **In**. Type a name in **Search categories** and select a
suggestion. The matching post preview refreshes automatically. Save the
carousel to apply the query to its published placements.

Remove one category with its chip's **×**, or remove the whole filter with
the trash button. For a fixed selection, use **Use these posts as manual
slides**. See the [category recipe](./recipes.md#latest-guides-from-one-category).

### Choose a starting template

| Use case | Content selection | Template and requirements |
| --- | --- | --- |
| Homepage article row | Query (automatic), Posts | Default, Simple or Light are included. Aurora Cards needs its separate template plugin. |
| Product links | Query (automatic), Products | Core cards work with the base plugin. Aurora Cards is an optional template plugin. |
| Product shelf with prices and cart actions | Products, automatic or manual | Requires Pro. Use a core card or Commerce Luxe. |
| Buying guide with product picks | Manual slides | Story Commerce is included in Pro. |
| Video campaign playlist | Manual slides | Video Showcase is included in Pro. |

## Template vs preset

A template controls the actual markup and CSS contract. Examples:
`default`, `commerce-luxe`, `story-commerce`, `video-showcase`.

A compatible visual preset is a smaller tuning layer for templates that support
it. It can adjust density, accent and some compatible details, but it is not a
different template. If a template does not support the preset, the setting
should not change its layout.

## Save once, reuse everywhere

The Gutenberg block and shortcode reference a saved carousel ID. Editing the
saved carousel updates every embed that uses that ID.

Shortcode:

```text
[cci_posts_carousel id="123"]
```

Use a separate saved carousel when a page needs different content, different
template behavior or different tracking.

## Check before publishing

Open the final page and check:

- desktop and mobile layout,
- first and last slide,
- long title wrapping,
- arrow and dot visibility,
- product price and sale price,
- WooCommerce `View cart` state after adding to cart,
- video playback when the carousel includes video slides.

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



## Show a second image on hover

This option is included in the base plugin and is off by default. The featured
image remains the main image of a post or product. A custom slide keeps its own
selected image as the main image.

1. Edit a carousel and open **Design > Second image on hover**.
2. Enable **Show a second image on hover**.
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
