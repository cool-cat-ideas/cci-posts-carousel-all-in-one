# WP Posts Carousel All In One documentation

Use these guides to build a carousel, publish it, adapt it to a theme and
extend it with WordPress hooks. The documentation describes shipped behavior
for version 2.0.0; release ZIP packages do not include this `docs/` directory.

## Start here

- [User guide](./USER_GUIDE.md) — create and publish a saved carousel.
- [Practical recipes](./2.0.0/recipes.md) — latest posts, category rows,
  curated products, frontend filters and theme overrides.
- [WooCommerce product carousels](./2.0.0/woocommerce-products.md) — understand
  the Free/Pro boundary and configure a real store-aware product shelf.
- [Popular Posts integration](./2.0.0/popular-posts-integration.md) — order a
  carousel with statistics already collected by WordPress Popular Posts.
- [Templates and add-ons](./2.0.0/templates-and-addons.md) — override an
  existing template or create a new one.
- [Extension cookbook](./2.0.0/extension-cookbook.md) — change queries and
  slide data, insert markup and package an extension.
- [Related Content example](../../wp-posts-carousel-related-content/docs/1.0.0/developer.md)
  — a working no-cost query/source extension with public filters.
- [Aurora Cards example](../../wp-posts-carousel-aurora-cards/docs/1.0.0/template-guide.md)
  — a working no-cost universal template for posts and products.
- [Developer guide](./2.0.0/developer-guide.md) — architecture, saved data
  flow and supported customization paths.
- [Filters and actions](./2.0.0/hooks-and-api.md) — descriptions, arguments and
  examples for the public filters and actions.
- [PHP API](./2.0.0/method-reference.md) — lower-level PHP services and method
  contracts.

## Common paths

Choose the shortest path for the job:

- Change colors, spacing or typography: enqueue child-theme CSS after the
  selected template stylesheet.
- Change card markup for one project: override the template in the child
  theme.
- Add a reusable visual design: create a new manifest-based template.
- Change which posts are selected: use `wp_posts_carousel_query_args`.
- Add data to every prepared slide: use
  `wp_posts_carousel_slide_view_model`.
- Add markup around card content: use
  `wp_posts_carousel_before_item_content` or
  `wp_posts_carousel_after_item_content`.
- Distribute the change to many sites: package it as an extension plugin.

## Product and maintenance documents

- [Free/Pro and extension contract](./EXTENSIONS.md)
- [Publishing and versioning](./publishing-and-versioning.md)
- [Store product copy](./store-product-copy.md)
- [Pricing strategy](./pricing-strategy.md)
- [Core changelog](../CHANGELOG.md)
- [Pro documentation](../../wp-posts-carousel-pro/docs/INDEX.md)

License transport, marketplace feed internals and release encoding are
maintenance topics. They belong in developer or Pro maintenance documents and
must not replace the task-based guides above.

## Documentation rules

- Document only behavior that exists in the current code.
- Explain each public filter/action with its use case, parameters and return
  contract, then show a minimal working example.
- Prefer short sections and lists over wide API tables.
- Keep the published Payload documents under
  `docs/products/wp-posts-carousel-*` synchronized with these source files.
