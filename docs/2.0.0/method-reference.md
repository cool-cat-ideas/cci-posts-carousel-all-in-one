# WP Posts Carousel All In One 2.0.0 PHP API

This file lists public methods that are visible in the current Free plugin
codebase. Public does not automatically mean stable extension API; the stable
extension surface is documented in [Filters and actions](./hooks-and-api.md) and
[Templates and add-ons](./templates-and-addons.md).

## Plugin Bootstrap

### `WP_Posts_Carousel`

- `__construct()`
- `includes()`
- `deactivation()`
- `init()`
- `load_plugin_textdomain()`

### `WP_Posts_Carousel_Init`

- `__construct()`
- `register_post_type()`
- `create_table()`
- `carousel_updated_messages($messages)`

### `WP_Posts_Carousel_Admin`

- `__construct()`
- `includes()`
- `wp_head()`
- `register_scripts()`

### `WP_Posts_Carousel_Admin_Menu`

- `__construct()`
- `admin_menu()`
- `parent_file($parent_file)`

### `WP_Posts_Carousel_Admin_Settings`

- `__construct()`
- `register_settings()`

### `WP_Posts_Carousel_Admin_Plugins_Page`

- `__construct()`
- `print_styles()`
- `plugin_row_meta($links, $file, $plugin_data, $status)`
- `base_plugin_action_links($links)`
- `plugin_action_links($links, $plugin_file)`
- `render_summary_notices()`

## Carousel Storage And Runtime

### `WP_Posts_Carousel_Carousel_Config`

- `defaults()`
- `normalize($input)`
- `from_form_values($values)`
- `to_form_values($config)`
- `missing_required_features($config, $context)`
- `requirements_met($config, $context)`

### `WP_Posts_Carousel_Repository`

- `table_name()`
- `all()`
- `get($post_id)`
- `get_config($post_id)`
- `create($title, $params)`
- `update($post_id, $title, $params)`
- `delete($post_id)`
- `duplicate($post_id)`

### `WP_Posts_Carousel_Data`

- `get($post_id, $args)`
- `from_config($config, $args)`
- `slides($config, $runtime_params)`
- `runtime_params($config, $instance_id)`
- `template($config)`

### `WP_Posts_Carousel_Slide_View_Model`

- `from_post($post, $params, $config)`
- `from_custom_item($item, $params, $config)`
- `public_data($slide)`

### `WP_Posts_Carousel_Query_Builder`

- `build($config)`
- `frontend_filter_taxonomies($config)`

### `WP_Posts_Carousel_Generator`

- `generate($atts, $index)`
- `generate_from_config($config, $args)`

### `WP_Posts_Carousel_Shortcode_Decode`

- `initialize($atts, $content, $code)`

## Templates And Integrations

### `WP_Posts_Carousel_Templates`

- `__construct()`
- `includes()`
- `get_templates()`
- `get_defaults_templates()`

### `WP_Posts_Carousel_Template`

- `__construct()`
- `set_template_details($path)`
- `check_template($template_details)`

### `WP_Posts_Carousel_Integrations`

- `__construct()`
- `includes()`
- `get_integrations()`
- `get_default_integrations()`
- `get_others_integrations()`

### `WP_Posts_Carousel_Integration`

- `__construct()`
- `set_integration_details($path)`
- `check_integration($integration_details)`

### `WP_Posts_Carousel_Features`

- `all()`
- `enabled($key)`
- `public_data()`
- `template_status($template)`
- `license_allows($feature_key, $context)`
- `paid_feature_keys()`

## Admin UI Helpers

### `WP_Posts_Carousel_Admin_Carousels`

- `__construct()`
- `save_carousel($post_ID)`

### `WP_Posts_Carousel_Admin_Carousels_Table`

- `__construct()`
- `get_columns()`
- `get_sortable_columns()`
- `column_cb($item)`
- `column_title($item)`
- `column_shortcode($item)`
- `column_status($item)`
- `column_date($item)`
- `prepare_items()`
- `init()`

### `WP_Posts_Carousel_Admin_Shortcodes_Table`

- `get_columns()`
- `column_title($item)`
- `column_shortcode($item)`
- `column_status($item)`
- `column_date($item)`
- `column_options($item)`
- `search_box()`
- `views()`
- `prepare_items()`
- `init()`

### `WP_Posts_Carousel_Admin_Meta_Boxes`

- `__construct()`
- `includes()`
- `reset_positions()`
- `register_meta_boxes()`
- `remove_meta_boxes()`

### `WP_Posts_Carousel_Admin_Editor`

- `__construct()`
- `add_wp_posts_carousel_button()`
- `editor_carousels_page()`

### `WP_Posts_Carousel_Blocks`

- `__construct()`
- `register()`
- `render($attributes)`

### `WP_Posts_Carousel_Widget`

- `__construct()`
- `widget($args, $instance)`
- `form($instance)`

## REST API Controller

### `WP_Posts_Carousel_API`

- `__construct()`
- `prepare_post_option($post)`
- `checkPermissions($permission)`
- `get_custom_posts($request)`
- `prepare_term_option($tag)`
- `get_custom_terms($request)`
- `get_posts_from_query($request)`
- `get_public_carousel($request)`
- `get_carousel_preview($request)`
- `preview_carousel_draft($request)`
- `get_default_settings($request, $post)`
- `get_settings($request)`
- `submit_review_feedback($request)`
- `update_settings($request)`
- `get_diagnostics($request)`
- `get_templates($request)`
- `get_plugin_feed($request)`
- `get_carousels($request)`
- `create_carousel($request)`
- `get_carousel($request)`
- `prepare_posts_options($settings, $post)`
- `update_carousel($request)`
- `delete_carousel($request)`
- `duplicate_carousel($request)`

## Frontend

### `WP_Posts_Carousel_Frontend`

- `__construct()`
- `includes()`
- `enqueue_scripts()`
- `enqueue_editor_scripts()`
- `enqueue_block_canvas_assets()`

## Preferred Extension Surface

For new work, prefer filters/actions and manifest-based templates over direct
method calls. Direct calls are acceptable for internal plugin code and tests,
but third-party add-ons should rely on the documented hooks whenever possible.
