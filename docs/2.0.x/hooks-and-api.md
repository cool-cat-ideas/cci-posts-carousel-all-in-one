# WP Posts Carousel All In One 2.0.x filters and actions

This document explains the public filters, actions, PHP services and browser
runtime exposed by the Free core. Do not start by scanning every hook. First
choose the smallest supported extension surface for the result you need.

## Start with the right extension path

| Goal | Recommended mechanism | Guide |
| --- | --- | --- |
| CSS only | Child-theme CSS for spacing, colors and typography | [Extension cookbook](./extension-cookbook.md#override-carousel-styles-from-a-child-theme) |
| Card HTML or layout | Child-theme template or installable template add-on | [Templates and add-ons](./templates-and-addons.md) |
| Installable add-on | Separate WordPress plugin for a template, source or integration | [Extension cookbook](./extension-cookbook.md) |
| Query or slide data | Narrowly scoped WordPress filter | Continue with this document |
| Extra card markup | WordPress action before or after standard content | [Extension cookbook](./extension-cookbook.md#insert-markup-with-add_action) |
| Frontend renderer | Renderer add-on | [Templates and add-ons](./templates-and-addons.md) |

A custom template normally needs a manifest, a PHP view and scoped CSS—not a
renderer and not the complete hook list. An installable extension needs a
plugin entrypoint first; use the reference below only for the public contracts
that extension actually consumes.

## Choose a hook by its place in the data flow

| Point in the carousel flow | Public extension point | Result |
| --- | --- | --- |
| Select posts or products | `wp_posts_carousel_query_args` | Final `WP_Query` arguments |
| Add a saved ordering option | `wp_posts_carousel_order_by_map`, then `wp_posts_carousel_query_args` | UI/config key translated into query arguments |
| Prepare a post or product slide | `wp_posts_carousel_slide_view_model` | Normalized data for compatible templates |
| Prepare a manual slide | `wp_posts_carousel_custom_slide_view_model` | Normalized custom/campaign data |
| Replace one card fragment | A matching `wp_posts_carousel_item_*` filter | Prepared title, image, author, description or button HTML |
| Insert markup around card content | `wp_posts_carousel_before_item_content` or `wp_posts_carousel_after_item_content` | Additional HTML inside compatible PHP cards |
| Change taxonomy controls | `wp_posts_carousel_frontend_filterbar_html` | Complete frontend filter-bar HTML |
| Register a template location | `wp_posts_carousel_templates_paths` | Additional manifest scan root |
| Register or select a renderer | `wp_posts_carousel_frontend_renderers` and `wp_posts_carousel_frontend_renderer` | Available renderer modes and runtime selection |
| Reuse theme-owned assets | `wp_posts_carousel_load_*` and asset-handle filters | Prevents duplicate Owl, Swiper or icon assets |

Use `wp_posts_carousel_rendered` only when a focused slide, element or template
extension point cannot express the change safely.

Filters receive a value, must return a value of the documented type and should
leave unrelated carousels unchanged. Actions run at a moment in the render or
asset lifecycle; callbacks normally echo markup or perform a side effect and
do not return a replacement value.

### Example: change one saved carousel query

```php
add_filter('wp_posts_carousel_query_args', function (array $args, array $config): array {
    if ((int) ($config['id'] ?? 0) !== 123) {
        return $args;
    }

    $args['meta_key'] = '_editorial_score';
    $args['orderby'] = 'meta_value_num';
    $args['order'] = 'DESC';
    return $args;
}, 10, 2);
```

### Example: enrich a slide without querying in the template

```php
add_filter(
    'wp_posts_carousel_slide_view_model',
    function (array $slide, WP_Post $post, array $params, array $config): array {
        $slide['meta']['reading_time'] = (string) get_post_meta(
            $post->ID,
            'reading_time',
            true
        );
        return $slide;
    },
    10,
    4
);
```

### Example: append markup after standard card content

```php
add_action('wp_posts_carousel_after_item_content', function (array $params): void {
    echo '<span class="cci-wpc-site-card-end" aria-hidden="true"></span>';
});
```

## Supported PHP calls

Use [PHP API](method-reference.md) for supported callable helpers. Internal bootstrap, repository mutations and admin classes are not extension APIs.

## Shortcode and block

Shortcode:

```text
[wp_posts_carousel id="123" renderer="php"]
```

Dynamic Gutenberg block:

```text
wp-posts-carousel/carousel
```

Attributes:

| Attribute | Type | Notes |
| --- | --- | --- |
| `carouselId` | integer | Saved carousel ID. |
| `renderer` | string | Optional renderer override. |

## REST API

Admin namespace:

```text
wp-posts-carousel/v1/admin
```

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/carousels` | List saved carousel definitions. |
| `POST` | `/carousel` | Create a carousel definition. |
| `GET` | `/carousel/{id}` | Read one carousel definition. |
| `PUT` | `/carousel/{id}` | Update a carousel definition. |
| `DELETE` | `/carousel/{id}` | Delete a carousel definition. |
| `POST` | `/carousel/{id}/duplicate` | Duplicate a definition. |
| `GET` | `/carousel/{id}/preview` | Preview a saved carousel. |
| `POST` | `/carousel/preview` | Preview unsaved configuration. |
| `POST` | `/posts` | Search posts for the admin UI. |
| `POST` | `/terms` | Search terms for the admin UI. |
| `POST` | `/postsFromQuery` | Fetch query-based posts. |
| `GET` | `/templates` | List discovered templates. |
| `GET` | `/defaultSettings` | Read builder defaults. |
| `GET` | `/settings` | Read global settings. |
| `POST` | `/settings` | Save global settings. |
| `GET` | `/diagnostics` | Read diagnostics. |
| `GET` | `/plugin-feed` | Fetch product feed data. |
| `POST` | `/review-feedback` | Store review feedback. |

Pro Multisite namespace:

```text
wp-posts-carousel-pro/v1
```

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/multisite/sites` | List network sites for a licensed super administrator. |
| `POST` | `/multisite/carousels/{id}/copy` | Copy a definition to selected licensed target sites. Returns per-site results. |

Public namespace:

```text
wp-posts-carousel/v1
```

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/carousel/{id}` | Public payload for React/Swiper. Supports active frontend filter query args such as `wpcf_category=12`. |

## Template filters

Use these filters when a child theme, uploads directory or add-on supplies
template manifests:

- `wp_posts_carousel_templates_paths` adds scan roots. Return the complete map
  of filesystem paths to public base URLs.
- `wp_posts_carousel_templates` changes the discovered template collection
  after manifests have been loaded.
- `wp_posts_carousel_template` changes one normalized manifest selected by
  name.
- `wp_posts_carousel_template_aliases` maps historical/synonym names to the
  current template name.
- `wp_posts_carousel_template_fallback` chooses safe fallback metadata when a
  saved template is missing or unavailable.

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_templates_paths` | array | `$paths` |
| `wp_posts_carousel_templates` | array | `$templates` |
| `wp_posts_carousel_template` | array | `$template`, `$template_name` |
| `wp_posts_carousel_template_aliases` | array | `$aliases` |
| `wp_posts_carousel_template_fallback` | array/string | `$fallback`, `$template`, `$config` |

## Data, query and slide filters

The most useful data filters are:

- `wp_posts_carousel_query_args`: receives final `WP_Query` arguments and the
  normalized saved config. Return the complete arguments array.
- `wp_posts_carousel_slide_view_model`: receives prepared data for a WordPress
  post/product before template rendering. Add normalized display data here.
- `wp_posts_carousel_custom_slide_view_model`: the same extension point for a
  manual/custom item.
- `wp_posts_carousel_slide_html_parts`: changes the prepared HTML fragment map
  shared by compatible PHP templates.
- `wp_posts_carousel_public_slide_data`: removes or adds sanitized data sent to
  the public React/Swiper payload.
- `wp_posts_carousel_public_carousel_data`: changes the complete public payload
  for one saved carousel.
- `wp_posts_carousel_preview_data`: changes preview-only data in the builder.
- `wp_posts_carousel_runtime_params`: changes normalized engine/template
  parameters for the current render.
- `wp_posts_carousel_runtime_config`: changes normalized config for one PHP
  generator instance. Avoid changing saved semantics here.
- `wp_posts_carousel_rendered`: receives the final HTML string. Use it only
  when a template override or element filter cannot express the change.
- `wp_posts_carousel_frontend_filterbar_html`: replaces the taxonomy filter bar
  while keeping the query-parameter contract under the extension's control.
- `wp_posts_carousel_post_type_card_html`: supplies complete HTML for a custom
  post type card when generic slide fields are not enough.

Option/dictionary filters such as `wp_posts_carousel_prepare_post_option`,
`wp_posts_carousel_prepare_term_option` and
`wp_posts_carousel_post_type_taxonomies` change what the React builder can
select. Their output is admin data and must be sanitized and translatable.

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_query_args` | array | `$args`, `$config` |
| `wp_posts_carousel_prepare_post_option` | array | `$post_options`, `$post` |
| `wp_posts_carousel_prepare_term_option` | array | `$term_options`, `$term` |
| `wp_posts_carousel_carousels_in_admin_query` | array | `$args` |
| `wp_posts_carousel_post_type_taxonomies` | array | `$taxonomies`, `$post_type` |
| `wp_posts_carousel_post_type_display_defaults` | array | `$defaults`, `$post_type` |
| `wp_posts_carousel_post_type_display_params` | array | `$display_params`, `$post_type`, `$post`, `$params`, `$config` |
| `wp_posts_carousel_post_type_card_html` | string | `$html`, `$post`, `$post_type`, `$display_params`, `$config`, `$context` |
| `wp_posts_carousel_slide_view_model` | array | `$slide`, `$post`, `$params`, `$config` |
| `wp_posts_carousel_custom_slide_view_model` | array | `$slide`, `$item`, `$params`, `$config` |
| `wp_posts_carousel_slide_html_parts` | array | `$html`, `$slide`, `$params`, `$config` |
| `wp_posts_carousel_public_slide_data` | array | `$slide` |
| `wp_posts_carousel_public_carousel_data` | array | `$data`, `$post_id`, `$config` |
| `wp_posts_carousel_preview_data` | array | `$data`, `$config`, `$args` |
| `wp_posts_carousel_runtime_params` | array | `$params`, `$config` |
| `wp_posts_carousel_template_runtime_config` | array | `$config`, `$template` |
| `wp_posts_carousel_runtime_config` | array | `$config`, `$template`, `$carousel_id`, `$generator` |
| `wp_posts_carousel_rendered` | string | `$out`, `$config`, `$post_id` |
| `wp_posts_carousel_video_media_allowed` | bool | `$allowed`, `$item`, `$context` |
| `wp_posts_carousel_video_media_html` | string | `$html`, `$media`, `$slide`, `$featured_image`, `$kind` |
| `wp_posts_carousel_frontend_filterbar_html` | string | `$html`, `$config`, `$post_id`, `$carousel_id` |
| `wp_posts_carousel_item_featured_image_placeholder` | string | `$placeholder_url` |

Configuration and builder payload filters:

Use these only when an integration needs to expose a value in the builder or
normalize saved data. `wp_posts_carousel_config` runs after config
normalization; `wp_posts_carousel_default_settings` changes the new-carousel
payload; `wp_posts_carousel_field_mapping_targets` adds a supported mapping
destination; `wp_posts_carousel_performance_image_sizes` controls selectable
WordPress image sizes. Dictionary filters must return the entire dictionary,
not only the new entry.

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_config` | array | `$config` |
| `wp_posts_carousel_sanitize_custom_item` | array | `$sanitized`, `$item` |
| `wp_posts_carousel_item_form_option` | array | `$option`, `$item` |
| `wp_posts_carousel_order_by_map` | array | `$map` |
| `wp_posts_carousel_default_values` | array | `$values`, `$post` |
| `wp_posts_carousel_dictionaries` | array | `$dictionaries`, `$post` |
| `wp_posts_carousel_default_settings` | array | `$settings`, `$post` |
| `wp_posts_carousel_carousel_options` | array | `$options` |
| `wp_posts_carousel_carousel_breakpoint_item_options` | array | `$options` |
| `wp_posts_carousel_carousel_types` | array | `$types` |
| `wp_posts_carousel_carousel_display_options` | array | `$options` |
| `wp_posts_carousel_field_mapping_targets` | array | `$targets` |
| `wp_posts_carousel_performance_image_sizes` | array | `$sizes` |
| `wp_posts_carousel_params_defaults` | array | `$params` |
| `wp_posts_carousel_params_breakpoints` | array | `$breakpoints` |

Legacy builder dictionary filters remain available for integrations migrating
from the classic meta-box UI:

```text
wp_posts_carousel_post_criteria_meta_box_taxonomies
wp_posts_carousel_post_criteria_meta_box_operators
wp_posts_carousel_post_criteria_meta_box_orders_by
wp_posts_carousel_post_criteria_meta_box_get_orderings
wp_posts_carousel_display_meta_box_get_descriptions
wp_posts_carousel_display_meta_box_get_image_sources
wp_posts_carousel_carousel_meta_box_get_animations
```

Each receives the current dictionary array and must return the complete array.

## PHP template element filters

These filters are used by PHP templates that follow the core element contract:

```text
wp_posts_carousel_item_featured_image
wp_posts_carousel_item_categories
wp_posts_carousel_item_title
wp_posts_carousel_item_created_date
wp_posts_carousel_item_author
wp_posts_carousel_item_description
wp_posts_carousel_item_tags
wp_posts_carousel_item_buttons
```

Each filter receives the already prepared HTML/value as its first argument and
a context array as its second argument. Return a replacement string. Use them
for focused changes such as wrapping the title, changing the CTA label or
adding accessible markup without copying the entire template.

```php
add_filter('wp_posts_carousel_item_title', function (string $html, array $context): string {
    return '<div class="cci-wpc-site-title">' . $html . '</div>';
}, 10, 2);
```

## Feature and license filters

These hooks are for Pro/add-on capability integration, not normal theme
customization. A paid add-on may declare its feature through
`wp_posts_carousel_features`, but only the Pro authority may allow a reserved
paid key through `wp_posts_carousel_license_allows_feature`. Frontend rendering
must not perform remote license requests.

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_features` | array | `$features` |
| `wp_posts_carousel_license_allows_feature` | bool | `$allowed`, `$feature_key`, `$context` |
| `wp_posts_carousel_paid_feature_keys` | array | `$feature_keys` |
| `wp_posts_carousel_missing_required_features` | array | `$missing`, `$config`, `$context` |
| `wp_posts_carousel_pre_save_error` | `WP_Error|null` | `$error`, `$params`, `$request`, `$operation` |
| `wp_posts_carousel_is_pro` | bool | `$is_pro` |
| `wp_posts_carousel_license_data` | array | `$license` |

## Renderer and asset filters

Renderer filters control how already prepared data is mounted:

- `wp_posts_carousel_frontend_renderers` registers allowed renderer names.
- `wp_posts_carousel_frontend_renderer` selects the renderer for the current
  carousel and shortcode attributes.
- `wp_posts_carousel_react_render_mode` selects enhancement/fallback behavior
  for a React renderer.
- `wp_posts_carousel_block_editor_renderer` controls the renderer used by the
  Gutenberg preview.

Asset filters let a theme reuse compatible libraries instead of loading a
second copy. Return `false` from `wp_posts_carousel_load_owl_assets`,
`wp_posts_carousel_load_owl_css` or `wp_posts_carousel_load_swiper_css` only
when the replacement is already registered and compatible. Handle filters
must return a registered WordPress handle.

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_frontend_renderers` | array | `$renderers`, `$config`, `$atts` |
| `wp_posts_carousel_frontend_renderers_dictionary` | array | `$renderers` |
| `wp_posts_carousel_frontend_renderer` | string | `$renderer`, `$config`, `$atts` |
| `wp_posts_carousel_react_render_mode` | string | `$mode`, `$renderer`, `$config`, `$atts` |
| `wp_posts_carousel_block_editor_renderer` | string | `$renderer`, `$attributes`, `$carousel_id` |
| `wp_posts_carousel_load_owl_assets` | bool | `$load`, `$settings` |
| `wp_posts_carousel_load_owl_css` | bool | `$load`, `$settings` |
| `wp_posts_carousel_load_mousewheel_asset` | bool | `$load`, `$settings` |
| `wp_posts_carousel_owl_script_handle` | string | `$handle`, `$settings` |
| `wp_posts_carousel_mousewheel_script_handle` | string | `$handle`, `$settings` |
| `wp_posts_carousel_owl_style_handle` | string | `$handle`, `$settings` |
| `wp_posts_carousel_swiper_source` | string | `$source`, `$settings` |
| `wp_posts_carousel_load_swiper_css` | bool | `$load`, `$settings` |
| `wp_posts_carousel_asset_diagnostics` | array | `$diagnostics` |
| `wp_posts_carousel_frontend_runtime_config` | array | `$runtime_config`, `$settings` |
| `wp_posts_carousel_global_breakpoints` | array | `$breakpoints` |
| `wp_posts_carousel_settings_global_breakpoints` | array | `$breakpoints`, `$settings`, `$base` |
| `wp_posts_carousel_sanitized_settings` | array | `$sanitized`, `$settings`, `$base` |

## Icon filters

Use the registry filters to add an icon library/source. Use
`wp_posts_carousel_navigation_icons` to change the direction-to-icon map for a
carousel and `wp_posts_carousel_navigation_icon_html` for final accessible
markup. Do not draw navigation arrows with CSS pseudo-elements.

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_icon_libraries` | array | `$libraries` |
| `wp_posts_carousel_icon_sources` | array | `$sources` |
| `wp_posts_carousel_icon_settings` | array | `$settings`, `$saved_settings` |
| `wp_posts_carousel_load_font_awesome` | bool | `$load`, `$settings` |
| `wp_posts_carousel_load_icon_assets` | bool | `$load`, `$settings`, `$library`, `$context` |
| `wp_posts_carousel_navigation_icons` | array | `$icons`, `$params`, `$config`, `$settings` |
| `wp_posts_carousel_navigation_icon` | array | `$icon`, `$direction`, `$params` |
| `wp_posts_carousel_navigation_icon_html` | string | `$html`, `$direction`, `$params`, `$icon` |
| `wp_posts_carousel_build_navigation_icon` | array | `$data`, `$direction`, `$library_key`, `$library` |

Register another icon library by extending the registry and its sources. Do
not add renderer-specific hard-coded branches.

## Admin, review and marketplace filters

These hooks integrate the admin shell with diagnostics, documentation, review
and marketplace services. They are not required to create, style or publish a
carousel. Product/add-on authors normally need only
`wp_posts_carousel_documentation_url`, `wp_posts_carousel_diagnostics` or the
marketplace base/locale filters during controlled integration work.

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_license_data` | array | `$license` |
| `wp_posts_carousel_diagnostics` | array | `$diagnostics`, `$request` |
| `wp_posts_carousel_review_feedback_payload` | array | `$payload`, `$request` |
| `wp_posts_carousel_review_feedback_remote_endpoint` | string | `$endpoint`, `$payload`, `$request`; defaults to the marketplace `/api/product-reviews/submit` endpoint |
| `wp_posts_carousel_wordpress_review_url` | string | `$url` |
| `wp_posts_carousel_review_url` | string | `$url` |
| `wp_posts_carousel_documentation_url` | string | `$url` |
| `wp_posts_carousel_upgrade_url` | string | `$url` |
| `wp_posts_carousel_marketplace_api_base` | string | `$base_url` |
| `wp_posts_carousel_marketplace_locale` | string | `$locale` |

## Bundled integration filters

This filter is public but applies only to the named optional workflow:

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_wordpress_popular_posts_shows_custom_interval` | string/null | `$interval`, optional `$context` |

The Popular Posts interval is an SQL interval fragment such as `1 YEAR`; return
`null` to omit the date restriction.

## Actions

Current lifecycle actions:

- `wp_posts_carousel_after_enqueue_scripts` runs after frontend carousel,
  template and icon assets are enqueued. Use it to enqueue a dependent
  storefront asset.
- `wp_posts_carousel_in_admin_after_enqueue_scripts` runs after admin assets.
  Use it for an add-on's builder support bundle.
- `wp_posts_carousel_admin_preview_assets` runs after preview assets are
  prepared and receives saved global settings.
- `wp_posts_carousel_slide_prepared` runs after the PHP generator prepares the
  current slide. Prefer the slide view-model filter when data must be changed;
  use this action for observation or side effects.
- `wp_posts_carousel_before_item_content` and
  `wp_posts_carousel_after_item_content` run around standard PHP template card
  content. Callbacks may echo scoped markup.
- `wp_posts_carousel_review_feedback_submitted` runs only after the configured
  marketplace endpoint confirms the feedback write. It receives the submitted
  payload, the REST request and the decoded remote response. It is unrelated to
  carousel rendering.

| Hook | Parameters | Timing |
| --- | --- | --- |
| `wp_posts_carousel_after_enqueue_scripts` | `$context` | After frontend assets are enqueued. |
| `wp_posts_carousel_in_admin_after_enqueue_scripts` | `$context` | After admin assets are enqueued. |
| `wp_posts_carousel_admin_preview_assets` | `$settings` | After admin preview assets are prepared. |
| `wp_posts_carousel_slide_prepared` | `$generator_slide`, `$post`, `$config`, `$generator` | After a PHP generator slide is prepared. |
| `wp_posts_carousel_review_feedback_submitted` | `$payload`, `$request`, `$remote_response` | After the review service confirms creation of the pending product review and its consent snapshot. |
| `wp_posts_carousel_before_item_content` | `$params` | Before PHP template item content. |
| `wp_posts_carousel_after_item_content` | `$params` | After PHP template item content. |

Classic meta-box actions are also public for integrations that still render
fields in the legacy editor:

```text
wp_posts_carousel_post_criteria_meta_box_before_table
wp_posts_carousel_post_criteria_meta_box_before_post_types
wp_posts_carousel_post_criteria_meta_box_after_post_types
wp_posts_carousel_post_criteria_meta_box_before_show
wp_posts_carousel_post_criteria_meta_box_in_show
wp_posts_carousel_post_criteria_meta_box_after_show
wp_posts_carousel_post_criteria_meta_box_before_posts_limit
wp_posts_carousel_post_criteria_meta_box_after_posts_limit
wp_posts_carousel_post_criteria_meta_box_before_ordering
wp_posts_carousel_post_criteria_meta_box_after_ordering
wp_posts_carousel_post_criteria_meta_box_after_table
```

They receive the current empty context array. New integrations should prefer
the React dictionaries and saved-config filters unless legacy UI support is a
requirement.

## JavaScript runtime

Global:

```js
window.wpPostsCarousel
```

Methods:

```js
window.wpPostsCarousel.hooks.addAction(name, namespace, callback, priority);
window.wpPostsCarousel.hooks.removeAction(name, namespace);
window.wpPostsCarousel.hooks.doAction(name, ...args);
window.wpPostsCarousel.hooks.addFilter(name, namespace, callback, priority);
window.wpPostsCarousel.hooks.removeFilter(name, namespace);
window.wpPostsCarousel.hooks.applyFilters(name, value, ...args);
window.wpPostsCarousel.registerEngine(name, engine);
window.wpPostsCarousel.getEngine(name);
window.wpPostsCarousel.registerRenderer(name, renderer);
window.wpPostsCarousel.getRenderer(name);
window.wpPostsCarousel.mountRenderer(name, element, carousel);
```

Renderer example:

```js
window.wpPostsCarousel.registerRenderer('my_renderer', {
    mount(element, carousel, runtime) {
        element.classList.add('cci-wpc-my-renderer');
    },
});
```

Runtime filters:

- `carouselRenderer`: receives the renderer name, element and carousel data.
- `carouselData`: receives public data and the current element.
- `reactEngine`: receives the preferred engine, element and carousel data.
- `reactRendererMode`: receives the mode, source element and carousel data.

Runtime actions:

- `engineRegistered`: engine name and adapter.
- `rendererRegistered`: renderer name and renderer object.
- `rendererMounted`: renderer name, element and carousel data.
- `carouselReady`: carousel data and current element.
- `carouselError`: error and current element.

DOM events bubble from the carousel element:

```text
wp-posts-carousel:ready
wp-posts-carousel:error
wp-posts-carousel:fallback
wp-posts-carousel:engine-ready
wp-posts-carousel:engine-error
```

See [Extension cookbook](./extension-cookbook.md) for registration, cleanup and
end-to-end examples.



## Worked examples for builder and asset filters

### Give newly created carousels a site-specific default

wp_posts_carousel_default_values receives the complete values array and the
current WP_Post (or null for an unsaved entry). It returns the complete array;
existing saved carousels are not rewritten. Inspect the builder's existing
shape rather than adding unsupported fields. For a simple navigation rule,
change the runtime settings for one saved carousel instead:

```php
add_filter('wp_posts_carousel_runtime_params', function (array $params, array $config): array {
    if ((int) ($config['id'] ?? 0) === 123) {
        $params['nav'] = true;
        $params['dots'] = false;
    }
    return $params;
}, 10, 2);
```

This affects render parameters, not database settings. Test the configured
engine. Remove the filter to return to the editor's saved behavior.

### Change the navigation icon markup

wp_posts_carousel_navigation_icon_html receives string $html, string $direction,
array $params and array $icon and returns HTML. Prefer the menu's icon settings for ordinary changes.
For a project-wide policy that disables the bundled FontAwesome request, the
load filter below receives bool $load and array $settings and returns bool:

```php
add_filter('wp_posts_carousel_load_font_awesome', function (bool $load, array $settings): bool {
    // Disable only when the theme already enqueues a compatible icon library.
    return wp_style_is('my-theme-font-awesome', 'enqueued') ? false : $load;
}, 10, 2);
```

Disable the force-include FontAwesome setting first; when enabled it overrides this load decision. Replace the handle with the one actually registered by the theme. Returning
false does not load a replacement and can leave blank arrows. The equivalent
load_owl_assets filter also receives bool $load, array $settings; do not disable
Owl unless the configured script/style handle filters point at compatible assets.

### Add data to a manual slide

wp_posts_carousel_custom_slide_view_model receives array $slide, array $item,
array $params and array $config and returns the entire normalized slide array.
It runs for manual/custom items, whereas slide_view_model runs for post objects.

```php
add_filter('wp_posts_carousel_custom_slide_view_model', function (
    array $slide, array $item, array $params, array $config
): array {
    if ((int) ($config['id'] ?? 0) === 123) {
        $slide['meta']['campaign_label'] = 'Summer guide';
    }
    return $slide;
}, 10, 4);
```

Read the added value from $this->slide in a PHP template and escape it with
esc_html(). Adding a data key does not automatically display a new label.

### Add a template alias after renaming a custom layout

wp_posts_carousel_template_aliases receives and returns an array mapping old
names to current manifest names. It is applied during template-name resolution.
It does not copy files, register a manifest or change saved carousel IDs.

```php
add_filter('wp_posts_carousel_template_aliases', function (array $aliases): array {
    $aliases['old-editorial'] = 'site-editorial';
    return $aliases;
});
```

Keep the target template installed and verify an existing saved carousel using
the old name. Do not alias a paid template to a base template to change its
capability requirements.
