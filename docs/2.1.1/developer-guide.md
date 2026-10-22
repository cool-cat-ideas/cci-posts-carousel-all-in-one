# CCI Posts Carousel All In One developer guide

CCI Posts Carousel All In One stores reusable carousel definitions and renders them through the Free core. The single Pro plugin adds commercial capabilities without changing the saved-carousel workflow.

## Choose the smallest customization surface

| Goal | Supported approach |
| --- | --- |
| Change colors, spacing or typography | [Child-theme CSS loaded after the template stylesheet](./recipes.md#override-colors-and-typography) |
| Change card markup for one site | [Child-theme template override](./recipes.md#override-the-complete-card-template) |
| Add a reusable visual layout | [Manifest-based template in an extension plugin](./templates-and-addons.md) |
| Change selected content | [A query filter](./recipes.md#optional-php-exclude-sticky-posts), after checking the no-code Query settings |
| Add normalized slide data | [A slide-data filter](./recipes.md#add-data-to-each-post-slide) |
| Insert markup around a card | [A WordPress action](./recipes.md#add-markup-around-standard-card-content) |
| Publish with another editor | [Reuse the saved carousel ID through the public renderer](./user-guide.md#publish-the-saved-carousel) |
| Distribute behavior to many sites | [A separate extension plugin using public contracts](./extensions.md) |

Do not edit installed plugin files. Do not call internal admin classes from a theme when a public filter, action, shortcode or template contract exists.

## Runtime structure

```text
wp-posts-carousel/
  includes/
    class-carousel-repository.php
    class-carousel-data.php
    class-slide-view-model.php
    class-templates.php
    frontend/
      class-carousel-query-builder.php
      class-carousel-generator.php
      class-frontend.php
  templates/
  assets/
  src/

cci-posts-carousel-pro/
  includes/features/
  templates/
  assets/
```

The Free core owns storage, querying, normalized slide data, PHP fallback output, Owl/Swiper integration, Gutenberg publishing and public extension contracts. Pro loads each commercial capability from a separate class file but ships as one plugin, ZIP and license.

## Saved definition flow

1. The repository loads a saved carousel by ID.
2. Configuration is normalized and checked for required capabilities.
3. Query or manual composition produces source items.
4. The slide view-model converts items to renderer-neutral data.
5. The selected template prepares PHP fallback markup.
6. Owl Carousel or the Swiper/React renderer enhances the same definition.
7. Gutenberg, shortcode, PHP and Elementor placements reuse that saved ID.

This flow keeps frontend output consistent across publishing methods. A customization should target the earliest stable layer that can express the requirement.

## Free and Pro extension boundary

Free may query posts, pages, custom post types and the WooCommerce `product` post type. A Free product item remains a generic content card.

The single Pro package adds current WooCommerce prices, sale state, ratings, purchase actions and merchandising sources together with Commerce Luxe, Story Commerce, Video Showcase, Elementor, analytics, autoplay indicators and Multisite. These are internal Pro modules, not separate add-ons.

An external extension may register an independent template, source or renderer. It cannot unlock reserved Pro capabilities or replace the encoded Pro license decision.

## Build a site-specific query customization

Keep snippets in a small site plugin or child theme and limit them to one saved carousel:

```php
add_filter(
    'wp_posts_carousel_query_args',
    function (array $args, array $config): array {
        if ((int) ($config['id'] ?? 0) !== 123) {
            return $args;
        }

        $args['post__not_in'] = get_option('sticky_posts', []);
        return $args;
    },
    10,
    2
);
```

Use [Filters and actions](./hooks-and-api.md) for the complete parameter and return contracts.

## Build a reusable extension

A distributable extension should own one responsibility and keep each functionality in a separate class:

```text
my-wpc-extension/
  my-wpc-extension.php
  includes/
    class-my-wpc-extension-feature.php
  templates/
    my-template/
      template.json
      views/template.php
      assets/css/style.css
  assets/
```

Register only public paths and hooks from the bootstrap. Keep renderer logic, data integration and admin metadata in their own classes. See [External extension API](external-extension-api) and [Extensions](./extensions.md).

## Compatibility and safety

- Sanitize saved configuration on the server.
- Escape final HTML unless the contract explicitly returns prepared safe markup.
- Keep CSS scoped to the template/extension root.
- Preserve PHP fallback output for SEO and accessibility.
- Avoid remote requests during carousel rendering.
- Do not store raw license keys in extensions.
- Test both configured engines when an extension declares support for both.
- Treat public PHP classes as implementation services unless the PHP API marks a method as a supported extension surface.

Use [PHP API](php-method-reference) for method signatures, [Filters and actions](./hooks-and-api.md) for stable WordPress extension points, and [Styles and templates](./templates-and-addons.md) for theme-level changes.

## Pinned selection and automatic fill (2.1.0)

Use `source.mode = 'hybrid'` and `curation.mode = 'hybrid'`. `curation.items` contains the ordered pins, using the existing post/custom item schema. `source.limit` is the combined limit. The form/REST editor representation uses `post_selection_options.mode = 'hybrid'` and the existing `posts` list for pins.

The runtime resolves eligible published pins first, skips excluded or unavailable posts, and applies the existing query filters to the remaining places. It excludes pinned post IDs from that query and removes repeated IDs from its result. Manual pins do not inherit the automatic taxonomy filters. Do not use them for per-visitor private content. The JSON carousel data, PHP output and both engines consume the same resolved slide sequence.

The existing `wp_posts_carousel_query_args` hook receives the automatic-fill query with the remaining limit and excluded pin IDs. There is no new license requirement, database table or schema migration. Do not convert existing `manual` or `query` modes when upgrading.

## Optional hover images (base plugin)

The schema stays at version 2. `image_hover` is a per-carousel section:

```php
$config['image_hover'] = array('enabled' => true, 'source' => 'content');
// source: content, gallery (WooCommerce public API), or manual.
$config['curation']['items'][0]['hover_image_url'] = 'https://example.com/alternate.jpg';
```

The item override takes priority only while the carousel setting is enabled.
The normal view model keeps `image` unchanged and exposes the validated secondary
URL in `hover_image.src`. `html.featured_image` and the main image in shared post-type
cards carry `data-wpc-hover-src`. No second `<img>` is added. The delegated runtime
covers PHP output, React cards, lazy rendering and Owl clones. It waits for a
successful image load before replacing `src`, temporarily removes `srcset` and
`sizes`, and restores all three attributes on pointer exit. Touch pointers are
ignored. The initial image box is retained during the preview.

Custom templates can output the shared HTML part or copy the escaped URL to
`data-wpc-hover-src` on their primary image inside `.cci-wpc-slide` or
`.cci-wpc-render-preview-slide`. Keep the primary image's accessible description.
To provide another resolver, use `wp_posts_carousel_hover_image_url` with five arguments: the resolved URL, slide, config, post (or null), and item. Return an HTTP(S) image URL or an empty string. This filter runs only when hover is enabled. Do not execute arbitrary shortcodes merely
to discover an image. Never fetch candidate images from PHP during rendering.

## Pinned-slide styling contract

`WP_Posts_Carousel_Data::slides()` sets the public `pinned` boolean after resolving
the hybrid selection. Only the pins included in the current result are marked.
PHP templates obtain `cci-wpc-slide-pinned` through `slide_layout_classes()`.
React renderers receive the same class through the slide `className` prop; custom
template components should retain that prop on their slide container. The flag
is available in the REST response, including custom pinned slides.
