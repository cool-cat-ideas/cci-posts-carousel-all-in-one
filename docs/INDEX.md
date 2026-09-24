# WP Posts Carousel All In One documentation

Use these guides to build a carousel, publish it, adapt it to a theme and
extend it with WordPress hooks. The documentation describes shipped behavior
for version 2.0.0; release ZIP packages do not include this `docs/` directory.

## Start here

- [User guide](./2.0.0/user-guide.md) — create and publish a saved carousel.
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
- [Maintained extensions](./2.0.0/extensions.md#maintained-standalone-examples)
  — how the separate Related Content and Aurora Cards products use the public
  query and template contracts.
- [Developer guide](./2.0.0/developer-guide.md) — architecture, saved data
  flow and supported customization paths.
- [Filters and actions](./2.0.0/hooks-and-api.md) — descriptions, arguments and
  examples for the public filters and actions.
- [PHP API](./2.0.0/method-reference.md) — lower-level PHP services and method
  contracts.
- [Extension contract](./2.0.0/extensions.md) — register templates, integrations
  and optional features through the public API.
- [Frontend extension contract](./2.0.0/frontend-extension-contract.md) — register
  JavaScript renderers and respond to browser events.

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

## Working with the source

- [Publishing and versioning](./publishing-and-versioning.md)
- [Release notes](../readme.txt)
- [Building from source](./building-from-source.md)

Guides under `2.0.0/` describe that version of the plugin. The source build and
publishing guides apply to the repository and are kept outside the version folder.
