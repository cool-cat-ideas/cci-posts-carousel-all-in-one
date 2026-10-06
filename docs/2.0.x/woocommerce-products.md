# Create a WooCommerce product carousel

## Know what the base plugin does

WooCommerce registers products as the public `product` post type. The base
edition can query that post type, so it can show a product image, title, excerpt
and link with a standard content-card template. It does not turn that card into
an active store card: current price, sale state, rating and add-to-cart behavior
are not available without Pro.

## Build a store carousel with Pro

1. Install and activate WooCommerce and WP Posts Carousel All In One.
2. Install the single `wp-posts-carousel-pro` ZIP and activate its license.
3. Create or edit a carousel and set the content source/post type to **Products**.
4. Choose the products manually or configure the query and ordering.
5. Use Default, Simple or Light for a regular store-aware card, or choose
   **Commerce Luxe** for a stronger campaign shelf.
6. Enable the fields you need: price, sale badge, image, title, description and action.
7. Save the carousel and publish it with the Gutenberg block, shortcode or Elementor.

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
