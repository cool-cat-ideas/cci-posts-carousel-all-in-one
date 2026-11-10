# Filters and actions

Use WordPress hooks when the builder or a child-theme template cannot express
the required behavior. Filters receive a value and must return the documented
type. Actions run at a specific moment and are for output or side effects.

Do not start by scanning every hook. First choose the smallest supported
extension surface for the result you need.


## Continuous-row actions and template filter (Pro preview)

The upcoming Pro edition exposes the cci_posts_carousel_pro_flow_template
filter and eight action positions around its toolbars, controls and rows.
See [Control hooks and templates](./continuous-row-templates.md) for signatures,
argument types, lifecycle, return values and executable child-theme examples.


## Start with the right extension path

| Goal | Recommended mechanism | Guide |
| --- | --- | --- |
| CSS only | Child-theme CSS for spacing, colors and typography | [Template development](./template-development.md) |
| Card HTML or layout | Child-theme template for one site; template add-on for distribution | [Template development](./template-development.md) |
| Swiper arrows and pagination HTML | Child-theme `controls.php` or scoped control filters | [Custom Swiper control HTML](./swiper-controls.md) |
| Loading placeholder HTML | Child-theme `skeleton.php` or skeleton filters | [Loading skeletons](./loading-skeleton.md) |
| Installable add-on | Separate WordPress plugin for a template, source or integration | [Extensions](./extensions.md) |
| Query or slide data | Narrowly scoped WordPress filter | Continue with this page |
| Extra card markup | WordPress action before or after standard card content | [Card elements and final markup](#card-elements-and-final-markup) |
| Frontend renderer | Renderer add-on | [Extensions](./extensions.md) |

If you are creating a custom template, you normally need a manifest, a PHP
view and scoped CSS—not a renderer and not the complete hook list. If you are
creating an installable extension, build the plugin package first and use this
page only to select the public integration points it needs.

Put project-only snippets in a small site plugin or the child theme's
`functions.php`. Keep conditions narrow so one customization does not change
every saved carousel.

## Choose a hook by its place in the data flow

| Stage | Public extension point | Result |
| --- | --- | --- |
| Content query | `wp_posts_carousel_query_args` | Final arguments passed to `WP_Query` |
| Saved ordering | `wp_posts_carousel_order_by_map`, then `wp_posts_carousel_query_args` | Adds the option and translates it into query arguments |
| Post/product slide | `wp_posts_carousel_slide_view_model` | Normalized data available to every compatible template |
| Manual slide | `wp_posts_carousel_custom_slide_view_model` | Normalized data for custom or campaign items |
| Card fragment | A matching `wp_posts_carousel_item_*` filter | Title, image, author, description, buttons or another prepared fragment |
| Card wrapper content | `wp_posts_carousel_before_item_content` or `wp_posts_carousel_after_item_content` | Additional HTML inside each compatible PHP card |
| Taxonomy controls | `wp_posts_carousel_frontend_filterbar_html` | Complete filter-bar HTML |
| Swiper controls | `wp_posts_carousel_controls_template`, `wp_posts_carousel_controls_html` | Theme-owned arrows and pagination; [parameters and examples](./swiper-controls.md) |
| Loading skeleton | `wp_posts_carousel_skeleton_template`, `wp_posts_carousel_skeleton_html` | Placeholder HTML; [parameters and examples](./loading-skeleton.md) |
| Template discovery | `wp_posts_carousel_templates_paths` | Adds a location scanned for template manifests |
| Renderer selection | `wp_posts_carousel_frontend_renderers` and `wp_posts_carousel_frontend_renderer` | Available renderer modes and the renderer selected at runtime |
| Shared assets | `wp_posts_carousel_load_*` and asset-handle filters | Prevents duplicate Owl, Swiper or icon assets |

Filters must return the documented value type. Actions run at a defined moment
and normally echo markup or perform a side effect. Prefer one focused hook over
filtering the final carousel HTML.

## Query and ordering

### `wp_posts_carousel_query_args`

Use it to change the final `WP_Query` arguments for a saved carousel.

Receives: `$args`, `$config`.

Returns: the complete query arguments array.

```php
add_filter('wp_posts_carousel_query_args', function (array $args, array $config): array {
    if ((int) ($config['id'] ?? 0) !== 123) {
        return $args;
    }

    $args['post__not_in'] = get_option('sticky_posts', array());
    return $args;
}, 10, 2);
```

### `wp_posts_carousel_order_by_map`

Adds a sanitized order key understood by saved configuration. It does not
change `WP_Query` by itself; pair it with `wp_posts_carousel_query_args`.

Receives and returns: the complete order-key map.

### Builder source filters

- `wp_posts_carousel_post_type_taxonomies` changes selectable taxonomies for a
  post type. Receives `$taxonomies`, `$post_type`; returns an array.
- `wp_posts_carousel_prepare_post_option` changes one post search result.
  Receives `$post_options`, `$post`; returns an array.
- `wp_posts_carousel_prepare_term_option` changes one term search result.
  Receives `$term_options`, `$term`; returns an array.
- `wp_posts_carousel_carousels_in_admin_query` changes the admin carousel list
  query. Receives and returns query arguments.
- `wp_posts_carousel_post_type_display_defaults` defines default visible fields
  for a post type. Receives `$defaults`, `$post_type`; returns an array.
- `wp_posts_carousel_post_type_display_params` changes prepared display data
  for a post type. Receives `$display_params`, `$post_type`, `$post`, `$params`,
  `$config`; returns an array.
- `wp_posts_carousel_post_type_card_html` replaces the complete custom post
  type card. Receives `$html`, `$post`, `$post_type`, `$display_params`,
  `$config`, `$context`; returns HTML.

## Query filter arguments and return value

Use `wp_posts_carousel_query_args` for a data-selection rule the editor cannot
express. Choosing a category normally needs no code: use **Query > Taxonomy
filters** as described in [Practical recipes](./recipes.md#latest-guides-from-one-category).

The filter runs after the plugin builds its post query arguments, before
they are passed to `WP_Query`. It receives two arguments and must return an
array of query arguments. It changes selected posts, not rendered HTML.
The query builder is also used to load query results in admin, so keep the
callback free of output and unintended side effects.

| Argument | Type and useful keys |
| --- | --- |
| `$args` | `array<string, mixed>`: WordPress query arguments. Initially includes `post_type` (`string[]`), `post_status` (`'publish'`), `posts_per_page` (`int`), `orderby` (`string`), `order` (`'ASC'` or `'DESC'`), `post__not_in` (`int[]`) and `no_found_rows` (`true`). May include `tax_query` (`array`) and manual selection through `post__in` (`int[]`). |
| `$config` | `array<string, mixed>`: normalized carousel configuration. `id` identifies a saved carousel when present; unsaved admin queries may not have one. `source` includes `mode` (`'query'` or `'manual'`), `post_types` (`string[]`), `limit` (`int`), `order_by` (`string`), `order` (`'ASC'` or `'DESC'`), `exclude` (`int[]`), `relation` (`'and'` or `'or'`) and `taxonomies` (post-type groups containing taxonomy names, operators and selected terms). `curation.items` holds selected manual items. |
| Return | `array<string, mixed>`: the final arguments for `WP_Query`. Return `$args` unchanged for other carousels. |

The accepted query parameters are WordPress parameters, not an undocumented
plugin-only list. See the [WordPress WP_Query reference](https://developer.wordpress.org/reference/classes/wp_query/)
for category, taxonomy, author, date and custom-field arguments.

For example, require category ID `12` in carousel `123`, preserving existing
taxonomy conditions. Replace both IDs with values from your own site:

```php
add_filter('wp_posts_carousel_query_args', function (array $args, array $config): array {
    if ((int) ($config['id'] ?? 0) !== 123) {
        return $args;
    }

    $category = array(
        'taxonomy' => 'category',
        'field' => 'term_id',
        'terms' => array(12),
        'operator' => 'IN',
    );
    $existing = $args['tax_query'] ?? array();
    $args['tax_query'] = empty($existing)
        ? array($category)
        : array('relation' => 'AND', $existing, $category);

    return $args;
}, 10, 2);
```

Place the snippet in a small site plugin or the child theme's `functions.php`.
It also restricts manual selections to that category; use query mode when
the carousel should follow newly published posts automatically.

## Slide data

### `wp_posts_carousel_slide_view_model`

Adds or changes normalized data for a post/product slide before template
rendering.

Receives: `$slide`, `$post`, `$params`, `$config`.

Returns: the complete slide array.

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

### `wp_posts_carousel_custom_slide_view_model`

The equivalent extension point for a manual/custom item. Receives `$slide`,
`$item`, `$params`, `$config`; returns the complete slide array.

### Prepared and public data filters

- `wp_posts_carousel_slide_html_parts` changes the prepared HTML-fragment map.
  Receives `$html`, `$slide`, `$params`, `$config`; returns an array.
- `wp_posts_carousel_public_slide_data` changes sanitized data sent to the
  React/Swiper frontend. Receives and returns one slide array.
- `wp_posts_carousel_public_carousel_data` changes the complete public payload.
  Receives `$data`, `$post_id`, `$config`; returns an array.
- `wp_posts_carousel_preview_data` changes builder preview data only. Receives
  `$data`, `$config`, `$args`; returns an array.
- `wp_posts_carousel_runtime_params` changes normalized render parameters.
  Receives `$params`, `$config`; returns an array.
- `wp_posts_carousel_template_runtime_config` changes configuration after the
  manifest is resolved. Receives `$config`, `$template`; returns an array.
- `wp_posts_carousel_runtime_config` changes one PHP generator instance.
  Receives `$config`, `$template`, `$carousel_id`, `$generator`; returns an
  array.

## Card elements and final markup

Compatible PHP templates expose focused element filters:

- `wp_posts_carousel_item_featured_image`
- `wp_posts_carousel_item_categories`
- `wp_posts_carousel_item_title`
- `wp_posts_carousel_item_created_date`
- `wp_posts_carousel_item_author`
- `wp_posts_carousel_item_description`
- `wp_posts_carousel_item_tags`
- `wp_posts_carousel_item_buttons`

Each receives the prepared HTML/value and a context array, and must return a
replacement string.

```php
add_filter('wp_posts_carousel_item_title', function (string $html, array $context): string {
    return '<div class="cci-wpc-site-title">' . $html . '</div>';
}, 10, 2);
```

`wp_posts_carousel_rendered` receives the final `$html`, `$config` and saved
carousel ID. Return the complete HTML string. Prefer an element filter or
template override; use this final filter only when neither can express the
change safely.

`wp_posts_carousel_frontend_filterbar_html` receives `$html`, `$config`,
`$post_id`, `$carousel_id` and returns the complete frontend taxonomy bar.

`wp_posts_carousel_video_media_allowed` returns a boolean deciding whether
prepared video media may render. `wp_posts_carousel_video_media_html` returns
the final media HTML for a compatible video slide.

## Template discovery

- `wp_posts_carousel_templates_paths` adds scan roots. It receives and returns
  a map of filesystem paths to public base URLs.
- `wp_posts_carousel_templates` changes the collection after manifest
  discovery.
- `wp_posts_carousel_template` changes one normalized manifest and receives
  `$template`, `$template_name`.
- `wp_posts_carousel_template_aliases` maps old/synonym names to current names.
- `wp_posts_carousel_template_fallback` selects a safe fallback when the saved
  template is missing or unavailable. It receives `$fallback`, `$template`,
  `$config`.

```php
add_filter('wp_posts_carousel_templates_paths', function (array $paths): array {
    $paths[plugin_dir_path(__FILE__) . 'templates'] =
        plugin_dir_url(__FILE__) . 'templates';
    return $paths;
});
```

## Builder configuration

These hooks extend the React builder or normalized saved payload:

- `wp_posts_carousel_config` — normalized config; return an array.
- `wp_posts_carousel_sanitize_custom_item` — one custom item after sanitizing;
  receives `$sanitized`, `$item`.
- `wp_posts_carousel_item_form_option` — one manual item option.
- `wp_posts_carousel_default_values` — new-carousel values.
- `wp_posts_carousel_dictionaries` — builder dictionaries.
- `wp_posts_carousel_default_settings` — complete initial settings payload.
- `wp_posts_carousel_carousel_options` — selectable carousel options.
- `wp_posts_carousel_carousel_breakpoint_item_options` — breakpoint item
  choices.
- `wp_posts_carousel_carousel_types` — available carousel types.
- `wp_posts_carousel_carousel_display_options` — visible field options.
- `wp_posts_carousel_field_mapping_targets` — supported post-meta mapping
  destinations.
- `wp_posts_carousel_performance_image_sizes` — selectable WordPress image
  sizes.
- `wp_posts_carousel_global_breakpoints` — default global breakpoint map.
- `wp_posts_carousel_sanitized_settings` — final global settings before save.

Return the complete collection and sanitize new values. Do not add a builder
option without also implementing its save and runtime behavior.

## Renderers and assets

- `wp_posts_carousel_frontend_renderers` registers allowed renderer names and
  receives `$renderers`, `$config`, `$atts`.
- `wp_posts_carousel_frontend_renderers_dictionary` changes names shown in the
  builder.
- `wp_posts_carousel_frontend_renderer` selects one renderer for the current
  config and shortcode attributes.
- `wp_posts_carousel_react_render_mode` selects the React enhancement/fallback
  mode.
- `wp_posts_carousel_block_editor_renderer` selects the Gutenberg preview
  renderer.

Asset controls:

- `wp_posts_carousel_load_owl_assets`
- `wp_posts_carousel_load_owl_css`
- `wp_posts_carousel_load_mousewheel_asset`
- `wp_posts_carousel_load_swiper_css`
- `wp_posts_carousel_owl_script_handle`
- `wp_posts_carousel_mousewheel_script_handle`
- `wp_posts_carousel_owl_style_handle`
- `wp_posts_carousel_swiper_source`
- `wp_posts_carousel_frontend_runtime_config`
- `wp_posts_carousel_asset_diagnostics`

Return `false` from a load filter only when a compatible replacement is
already available. Handle filters must return a registered WordPress handle.

## Icons

- `wp_posts_carousel_icon_libraries` and
  `wp_posts_carousel_icon_sources` extend the icon registry.
- `wp_posts_carousel_icon_settings` changes resolved icon settings.
- `wp_posts_carousel_load_font_awesome` and
  `wp_posts_carousel_load_icon_assets` control loading.
- `wp_posts_carousel_navigation_icons` changes the direction map.
- `wp_posts_carousel_navigation_icon` changes one normalized icon.
- `wp_posts_carousel_navigation_icon_html` changes final accessible markup.
- `wp_posts_carousel_build_navigation_icon` changes normalized icon data before
  HTML generation.

Do not replace arrows with CSS pseudo-elements; preserve real icon markup and
screen-reader text.

## Lifecycle actions

### `wp_posts_carousel_before_item_content`

Runs before standard PHP template card content and receives `$params`.
Callbacks may echo scoped markup.

### `wp_posts_carousel_after_item_content`

Runs after standard PHP template card content and receives `$params`.

```php
add_action('wp_posts_carousel_after_item_content', function (array $params): void {
    echo '<span class="cci-wpc-site-card-end" aria-hidden="true"></span>';
});
```

### Other lifecycle actions

- `wp_posts_carousel_after_enqueue_scripts` runs after frontend carousel,
  template and icon assets are enqueued. Receives a context array.
- `wp_posts_carousel_in_admin_after_enqueue_scripts` runs after admin assets.
- `wp_posts_carousel_admin_preview_assets` runs after preview assets are
  prepared and receives global settings.
- `wp_posts_carousel_slide_prepared` runs after the PHP generator prepares a
  slide and receives `$generator_slide`, `$post`, `$config`, `$generator`.
  Prefer a slide filter when data must be replaced.
- `wp_posts_carousel_review_feedback_submitted` runs after valid review
  feedback is accepted and is unrelated to carousel output.

Legacy meta-box placement actions remain available for older integrations,
but new integrations should extend the React dictionaries/config instead.

## Browser runtime

The public global is `window.wpPostsCarousel`. It provides hook registration
and engine/renderer registration:

```js
window.wpPostsCarousel.registerRenderer('my_renderer', {
    mount(element, carousel, runtime) {
        element.classList.add('cci-wpc-my-renderer-enhanced');
    },
});
```

Runtime filters include `carouselRenderer`, `carouselData`, `reactEngine` and
`reactRendererMode`. Runtime actions include `engineRegistered`,
`rendererRegistered`, `rendererMounted`, `carouselReady` and `carouselError`.

Keep PHP-rendered markup as the SEO/accessibility fallback. Browser renderers
should enhance it rather than making the carousel client-only.

## Commercial capability hooks

`wp_posts_carousel_features`, `wp_posts_carousel_paid_feature_keys`,
`wp_posts_carousel_license_allows_feature`,
`wp_posts_carousel_missing_required_features` and
`wp_posts_carousel_pre_save_error` exist for Pro/add-on integration. They are
not needed for normal theme customization. A paid add-on may declare a feature,
but only the Pro authority may allow a reserved paid key.

For lower-level service method arguments and REST routes, see
[PHP method reference](./php-method-reference.md). For complete extension packaging,
see [Extensions](./extensions.md).


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

## Argument reference by extension stage

The tables below preserve argument order. The first argument is the value a filter must return; additional arguments are context. Set accepted_args to the callback parameter count. Actions return nothing. See the workflow sections above before choosing a lower-level hook.

### Template filters

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_templates_paths` | array | `$paths` |
| `wp_posts_carousel_templates` | array | `$templates` |
| `wp_posts_carousel_template` | array | `$template`, `$template_name` |
| `wp_posts_carousel_template_aliases` | array | `$aliases` |
| `wp_posts_carousel_template_fallback` | array/string | `$fallback`, `$template`, `$config` |

### Data, query and slide filters

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

### Data, query and slide filters

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

### Feature and license filters

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_features` | array | `$features` |
| `wp_posts_carousel_license_allows_feature` | bool | `$allowed`, `$feature_key`, `$context` |
| `wp_posts_carousel_paid_feature_keys` | array | `$feature_keys` |
| `wp_posts_carousel_missing_required_features` | array | `$missing`, `$config`, `$context` |
| `wp_posts_carousel_pre_save_error` | `WP_Error|null` | `$error`, `$params`, `$request`, `$operation` |
| `wp_posts_carousel_is_pro` | bool | `$is_pro` |
| `wp_posts_carousel_license_data` | array | `$license` |

### Renderer and asset filters

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

### Icon filters

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

### Admin, review and marketplace filters

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

### Bundled integration filters

| Hook | Return | Parameters |
| --- | --- | --- |
| `wp_posts_carousel_wordpress_popular_posts_shows_custom_interval` | string/null | `$interval`, optional `$context` |

Integration cards use feature descriptors with `source => 'addon'`, a stable feature key, `label`, `description`, `author` and the add-on's own `version`. These fields do not create a settings page or implement query behavior. The React editor does not emit the classic meta-box before/after/in rendering actions; use the documented dictionary, query and saved-config filters. See the [integration-card example](./extensions.md#show-an-installed-integration-card).

## REST authentication and public carousel data

Administrative endpoints require authenticated users with the relevant carousel capabilities. Cookie-authenticated requests must include a valid `X-WP-Nonce` for `wp_rest`. Access is checked when each request is dispatched. Operations on an existing carousel also check its type, author and publication state; publishing requires `publish_wp_posts_carousels`. Roles editing or deleting published carousels need `edit_published_wp_posts_carousels` or `delete_published_wp_posts_carousels`. Access to another author's carousels requires the corresponding `edit_others_wp_posts_carousels` or `delete_others_wp_posts_carousels` capability.

The anonymous `GET /wp-posts-carousel/v1/carousel/{id}` endpoint serves published carousels only. Its `config` contains rendering settings (`version`, `renderer`, `engine`, `template`, `style`, `performance` when present), not the editorial source, curation or field mapping. Build frontend integrations from `slides`, `engine`, `template` and `html`; use the authenticated admin API to edit a full configuration.
