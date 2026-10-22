# CCI Posts Carousel All In One PHP API

Use the smallest supported surface: shortcode for HTML, public data for an
integration, template metadata for discovery, filters for behavior changes.
Do not subclass plugin services or invoke admin/bootstrap/install methods.
Repository writes, license internals and demo helpers are not public APIs.

## Render a saved carousel in a PHP theme

The WordPress shortcode accepts a positive saved carousel ID and returns the
complete HTML wrapper, slides and controls. Use the saved ID rather than
constructing a generator directly. The output contains prepared HTML; escaping
the entire result would display markup as text.

```php
if (shortcode_exists('cci_posts_carousel')) {
    echo do_shortcode('[cci_posts_carousel id="123"]');
}
```

Put this in a theme template after WordPress has loaded. Replace 123 with the
published carousel ID. Assets and behavior follow its saved settings. Do not
run this from an early plugin bootstrap or place it inside a per-post loop.

## Read public carousel data

`WP_Posts_Carousel_Data::get($post_id, $args = []): ?array`

Use this for an integration that needs structured data rather than HTML.
$post_id is a positive integer. $args accepts context (use view on public pages)
and instance_id (a unique string for this placement). The default instance ID is
wp-posts-carousel_{id}-api. A successful result includes id, title, status,
config, engine, template and slides. Missing, unpublished or unavailable
carousels return null, not WP_Error. It does not print markup.

The public template descriptor includes `stylesheet`: either null when the
template has no stylesheet, or an object with `handle` (string), `url` (public
stylesheet URL) and `version` (string for cache invalidation). The frontend
loader uses this descriptor to load the selected template before mounting a
dynamically inserted carousel. No server filesystem path is exposed.

```php
$data = null;
if (class_exists('WP_Posts_Carousel_Data')) {
    $data = WP_Posts_Carousel_Data::get(123, [
        'context' => 'view',
        'instance_id' => 'homepage-guides',
    ]);
}
if (is_array($data)) {
    $slides = $data['slides'];
    // Pass the data to your renderer; escape final HTML fields there.
}
```

Do not select an editor context in a public endpoint to expose drafts. Prefer
[Filters and actions](hooks-and-api.md) when you only need to modify the normal
frontend data rather than create another renderer.

## Inspect available templates

`WP_Posts_Carousel_Templates::get_template($template_name): ?array`
accepts a sanitized template name and returns a descriptor or null. It does not
enqueue styles or print HTML. Descriptors include name, render (absolute PHP
path), style, style_url, supports, feature, pro, availability and locked. Keep
filesystem paths server-side. Respect the locked state; this method is not a
license bypass.

```php
$template = WP_Posts_Carousel_Templates::get_template('default');
if ($template && !$template['locked']) {
    $supportedEngines = $template['supports']['engines'] ?? [];
}
```

`WP_Posts_Carousel_Templates::discover_templates(): array`
returns the descriptor list in discovery order. Since 2.0.1 the active theme
wins over the bundled root, then uploads and appended extension roots follow.
Invalid PHP views are skipped. Use the templates_paths filter to contribute
roots and templates filter to modify the discovered map. Do not edit this method.

```php
$names = array_column(WP_Posts_Carousel_Templates::discover_templates(), 'name');
```

## Override behavior, not implementation classes

- Queries: wp_posts_carousel_query_args.
- Post slide data: wp_posts_carousel_slide_view_model.
- Manual slide data: wp_posts_carousel_custom_slide_view_model.
- Markup: a child-theme template or an item filter.
- Reusable layout: an extension owning a manifest, view and stylesheet.

See [Practical recipes](recipes.md), [Styles and templates](templates-and-addons.md)
and [Filters and actions](hooks-and-api.md) for arguments and working examples.
