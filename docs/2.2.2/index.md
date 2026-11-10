# CCI Posts Carousel All In One

Create one saved carousel definition and reuse it in Gutenberg, a shortcode,
theme PHP or Elementor Pro. Editing the definition updates every placement.


## Find and preview saved carousels

Use [Dashboard and Carousels](./dashboard-and-carousels.md) to return to recent work,
manage the full collection, copy shortcodes and preview a saved layout at your
content column width. The editor's Information tab shows creation and update
dates and recorded authors of those changes.

For two rows, vertical scrolling and template-owned controls, follow
[Two-row carousels](./two-row-carousels.md), [Vertical carousels](./vertical-carousels.md),
[Custom control HTML](./swiper-controls.md) and [Loading skeletons](./loading-skeleton.md).

Pro is in preparation and is not yet available to buy or download. Its previews
cover [independent moving collections](./continuous-rows.md),
[scenes linked to collections](./connected-carousels.md), and
[template overrides and control hooks](./continuous-row-templates.md).
The base 2.2.2 package does not include these Pro features.


## Versions covered

This guide covers base plugin 2.2.2, including pinned slides with automatic fill. The category search and automatic
query-preview instructions use **base plugin 2.0.3 or newer**. Check your version
under **Plugins > Installed Plugins** and follow [Installation and updates](./installation.md)
if your editor looks different.

The base plugin and Pro have separate version numbers; they do not need to
match. The examples use English interface labels. WordPress may show their
translations when your administration language is different.

## Choose what you want to do

- Set different card counts on phones, tablets and desktops: follow
  [Responsive carousel](./responsive-carousel.md) and compare the working example.
- Keep an article row supplied from a chosen category: follow
  [Posts from a category](./category-post-carousel.md).
- Show current product prices and buying actions: follow
  [WooCommerce product carousel](./woocommerce-products.md).
- Restore carousels after updating from 1.x: follow
  [Upgrade from 1.x to 2.x](./upgrading-from-1.x.md).
- Build an automatically updating article row: start with
  [Getting started](./getting-started.md).
- Curate products or campaign slides in a fixed order: use Manual composition
  in [Carousel settings](./settings-reference.md).
- Let visitors filter by category or another taxonomy: see
  [Practical recipes](./recipes.md#category-filters-visitors-can-bookmark).
- Publish the saved definition: see [Publishing](./publishing.md).
- Ask a question or report a problem: choose a direct contact link in [Support](./support.md).
- Change colors or card markup without editing the plugin: see
  [Styles and templates](./template-development.md).
- Understand the runtime and choose a supported customization path: see
  [Developer guide](./developer-guide.md).
- Change a query, add slide data or insert markup: see
  [Filters and actions](./developer-api.md).
- Check lower-level service signatures: see [PHP API](./php-method-reference.md).
- Check everything included with the paid edition: see
  [Features included in Pro](./pro-features.md).
- Configure the maintained companion packages inside this product guide:
  [Related Content](./related-content.md) and
  [Aurora Cards](./aurora-cards.md).
- Show the most-read posts using statistics already collected by WordPress
  Popular Posts: see [Popular Posts integration](./popular-posts-integration.md).
- Distribute a template or integration to other sites: see
  [Extensions](./extensions.md).

## First useful carousel

1. Open **CCI Posts Carousel All In One > Dashboard** and click **New carousel**.
2. Enter an internal name.
3. Open **Query**. Choose **Query (automatic)** for posts that follow saved rules, or **Manual slides** for a fixed selection.
4. Select the post types, categories, ordering and **Posts limit** for a query. For manual selection, add content under **Slides**.
5. Under **Design**, choose a template. Under **General**, choose the engine and responsive item counts.
6. Set the carousel status to **Published** and click **Save**.
7. Follow [Publishing](./publishing.md) to add the carousel to a page. Saving the carousel alone does not add it to your website.

## What the base plugin covers

- posts, pages, custom post types and manual/custom slides,
- WooCommerce product sources when WooCommerce is active,
- taxonomy selection, ordering and frontend taxonomy filters,
- custom field/ACF post-meta mapping,
- `default`, `simple` and `light` templates,
- built-in ordering from WordPress Popular Posts statistics,
- Owl Carousel and Swiper,
- Gutenberg selection, shortcode and PHP embedding,
- child-theme template overrides and installable extensions.

Two standalone reference implementations show both supported extension directions. Each is distributed as its own installable package without a paid license:
[Related Content](./related-content.md) changes the query, while
[Aurora Cards](./aurora-cards.md) adds a reusable card template.

Pro adds current WooCommerce product data and buying actions, Commerce Luxe,
Story Commerce, Video Showcase, Elementor, autoplay indicators, engagement
analytics and Multisite tools. They are built into the same Pro plugin and
license.

## Safe customization rule

Do not edit installed plugin files. Use child-theme CSS for visual tuning, a
child-theme template override for project-specific markup, or an extension
plugin for reusable/distributed behavior.

License transport, marketplace feeds, stored options and release encoding are
maintenance topics and are intentionally outside this main user path.

For image size and fitting, see [Carousel settings](./settings-reference.md#keep-images-sharp-and-show-the-whole-picture).
