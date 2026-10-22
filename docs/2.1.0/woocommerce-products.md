# Create a WooCommerce product carousel

Help readers move from a product recommendation to a purchase without searching the shop again. A store carousel can show the current price and the appropriate purchase action beside each product.

## Try the existing example

[Open the Commerce Luxe product carousel](https://wordpress-demo.coolcatideas.com/cci-posts-carousel-demo/#wpc-demo-carousel-commerce-luxe-products).

The example uses the Commerce Luxe template included in Pro and a curated selection of WooCommerce products. Compare the cards, prices and quantity controls, then try the purchase action. This is a demonstration store; do not enter real payment or customer details.

Commerce Luxe is part of the single Pro package. It is not a separate plugin purchase. The base plugin, WooCommerce and an active Pro license are required for this example.

## Know what the base plugin does

WooCommerce registers products as the public `product` post type. The base
edition can query that post type, so it can show a product image, title, excerpt
and link with a standard content-card template. It does not turn that card into
an active store card: current price, sale state, rating and add-to-cart behavior
are not available without Pro.

## Build a store carousel with Pro

1. Install and activate WooCommerce and CCI Posts Carousel All In One.
2. Install the single `cci-posts-carousel-pro` ZIP and activate its license.
3. Create or edit a carousel. Under **Query**, select **Products** in **Post types**.
4. For a curated shelf like the demo, choose **Manual slides** and add products under **Slides**. For a row that updates automatically, choose **Query (automatic)** and set the query, ordering and total limit.
5. Use Default, Simple or Light for a regular store-aware card, or choose
   **Commerce Luxe** for a stronger campaign shelf.
6. Enable the fields you need: price, sale badge, image, title, description and action.
7. Set the [responsive item counts](./responsive-carousel.md), set the carousel status to **Published** and click **Save**.
8. Edit the destination page in Gutenberg, insert the **CCI Posts Carousel All In One** block and select the saved carousel. Publish or update the page. You can also use its generated shortcode or the Elementor integration included in Pro.

Pro supplies the current WooCommerce price, promotion, rating and purchase
action. It also adds best seller, top rated, lowest-price and highest-price
ordering. No separate WooCommerce integration plugin is required.

## Choose the right layout

- Use a core card template for a normal product shelf that should match other content carousels.
- Use Commerce Luxe for launches, promotions and curated recommendations where the product and buying action are the focus.
- Use Story Commerce for a manually ordered sequence that explains the need, gives advice, introduces the product, adds proof and finishes with an offer.

## If product data is missing

Confirm that WooCommerce, the base plugin and Pro are active, the Pro license is
valid for the current domain, and the selected source is `product`. Clear any
full-page or object cache after changing plugin activation or the license.

## Check the shopping behavior

Test on your staging site with a simple product and, if your shop uses them, a variable product. Compare the displayed price with the product page. A product that needs a variation selection should lead to that choice rather than silently adding an unspecified variation.

For a purchasable simple product, check the quantity and cart result. Then test on a phone and make sure the purchase controls remain reachable. Stock, product type and WooCommerce settings affect the available action.

## Continue

For article recommendations without buying controls, follow [Posts from a category](./category-post-carousel.md).

[View the editions and license options](https://coolcatideas.com/products/cci-posts-carousel-all-in-one/).
