# Build a responsive WordPress carousel

A row of three article cards can work on a desktop and become difficult to read on a phone. Set a different number of visible cards at each width while keeping one saved carousel on the page.

This workflow is included in the free version of CCI Posts Carousel All In One. It does not require Pro or a separate template extension.

## Try the existing example

[Open the responsive article carousel](https://wordpress-demo.coolcatideas.com/cci-posts-carousel-demo/#wpc-demo-free).

The example uses the Default template, Owl Carousel and six selected posts. Its rules show one card from 320 px, two from 760 px and three from 1100 px. Resize the browser and use the arrows to inspect the remaining posts. The visible card count is different from the total number of slides.

## Set the responsive item counts

1. Open **CCI Posts Carousel All In One > Dashboard** and edit a saved carousel, or follow [Getting started](./user-guide.md).
2. Open **General** and find **Responsive items**.
3. Use **New breakpoint** and **Add breakpoint** to add any missing widths. Set **Items** to `1` at `320`, `2` at `760` and `3` at `1100`.
4. Remove any extra rules that would override these values at the widths you want to test. The largest matching breakpoint applies. These values override the global preset for this carousel only.
5. Keep **Default** under **Design > Template** and **Owl Carousel 2** under **General > Engine** to reproduce the example.
6. Set the carousel status to **Published**, then click **Save**.
7. In the WordPress page editor, insert the **CCI Posts Carousel All In One** block and select the saved carousel. Publish or update the page.

You can also reuse its generated shortcode. Use the ID shown for your saved carousel; the demo's ID belongs to a different WordPress installation.

## Check the published page

Open the page at 390 px, 800 px and 1280 px. Expect one, two and three visible cards with these rules. Check titles, images, arrow controls and touch navigation. Make sure the page does not scroll sideways.

Test the actual placement, especially a sidebar or a narrow content column. Screen width and available content width are not always the same. Adjust the item counts if the cards are too narrow in your theme.

## If the count does not change

- Confirm that the page embeds the carousel you edited, then save the carousel again.
- Check for another breakpoint between the widths you are testing.
- Confirm that there are enough matching posts. A query returning two posts cannot display three different posts.
- Clear the page cache and test the published page rather than relying only on the editor preview.
- If the arrows do not work, follow [Troubleshooting](./troubleshooting.md) to check theme and script conflicts.

## Continue with your content

[Choose posts from a category](./category-post-carousel.md), or build a [WooCommerce product carousel](./woocommerce-products.md) when the row needs current prices and purchase actions.

[View CCI Posts Carousel All In One](https://coolcatideas.com/products/cci-posts-carousel-all-in-one/).

## Use global breakpoints

**Settings > Global breakpoints** defines the starting values for new carousels. At least one global breakpoint is required; the last row keeps a disabled Remove button.

A new carousel loads that global preset into its local responsive settings. Its saved local rows then override the global preset. To return to global settings, remove every local row under **General > Responsive items**. The information panel confirms that the carousel inherits the global rules. Save the carousel. Later changes to the global preset now apply to it automatically.

An empty local list is valid. It does not mean zero slides or disable responsiveness. Add a local breakpoint again to give that carousel its own rules.
