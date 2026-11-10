# Customize continuous-row controls

> Pro preview. These features are in preparation and are not included in the base 2.2.0 download. Pro is not yet available to buy or download.


These hooks and PHP template parts belong to Pro's continuous-row composition.
The individual cards still use their saved Free or Pro template and native Owl/Swiper engine.
Publication and license checks run before any template or hook.

## Choose the smallest customization

| What you need | Use |
| --- | --- |
| Add text or a form without replacing controls | An action at the relevant position |
| Move pause beside the existing arrows | Empty shared toolbar plus the before-row-controls action below |
| Change button classes, icon or label markup | Override pause.php |
| Change row title and button order | Override row-toolbar.php |
| Choose a fragment conditionally from a site plugin | The template-path filter |

## Override a fragment in a child theme

Copy only the files you need from the plugin's `templates/connected/` directory
into `your-child-theme/cci-posts-carousel-pro/connected/`. The child theme takes
precedence over the parent theme; missing files use the plugin defaults.
Never edit the installed plugin files.

| File | Responsibility |
| --- | --- |
| `flow.php` | Composition wrapper and order of rows |
| `toolbar.php` | Shared toolbar above the rows |
| `row.php` | One row, its toolbar and original cards |
| `row-toolbar.php` | Row title and actions |
| `controls.php` | Previous/next buttons for one row |
| `pause.php` | Shared pause/resume button |

Each file receives `$args`: `group_id`, `instance_id`, `title`, `layout`, `rows`
and `rendered`. Row fragments additionally receive `row_index` (zero-based),
`row` and `content`. Render another fragment with `$args['render']('pause')`.
The renderer returns HTML. Escape any custom text and attributes yourself.

## Put pause beside the arrows

Create an empty `toolbar.php` in the child-theme directory above:

```php
<?php
defined('ABSPATH') || exit;
// The shared pause control is rendered in the row toolbar instead.
```

Add this to the child theme's `functions.php` or a site plugin:

```php
add_action('cci_posts_carousel_pro_flow_before_row_controls', function ($args) {
    echo $args['render']('pause');
});
```

This renders a pause beside the arrows in both rows. Both buttons control the
same composition and stay synchronized. To show it only in the first row, check
`$args['row_index'] === 0` inside the callback. For one saved group only, check
`$args['group_id']`; scope the empty toolbar override to that group too.

For precise ordering, override `row-toolbar.php`, placing `pause` and `controls`
inside the existing `cci-flow-row-actions` flex container. Use `pause.php` to
change button classes, label translations or add an icon. Put the changing text
in a child element with `data-flow-label` to preserve surrounding icon markup.

## Insert your own content

All actions receive the same `$args` context:

| Action suffix (prefix: `cci_posts_carousel_pro_flow_`) | Location |
| --- | --- |
| `before_toolbar`, `after_toolbar` | Around the shared toolbar |
| `before_row_toolbar`, `after_row_toolbar` | Around each row toolbar |
| `before_row_controls`, `after_row_controls` | Beside row navigation |
| `after_row_content` | Below each row's cards |
| `after_rows` | Below both rows, inside the composition |

For example, output a form shortcode from `after_rows`. Its plugin must handle
submission permissions, nonces and validation. Hooks do not process form data.
No HTML sanitization is applied to trusted PHP template/hook output, so forms
and their attributes are preserved.

Site plugins can select a file with the `cci_posts_carousel_pro_flow_template`
filter, which receives `$path`, `$part`, `$args`. Return a readable local PHP
file; invalid paths fall back to the bundled part. Never derive the path from
request parameters or visitor input.

## Preserve the runtime contract

- Keep `data-cci-flow`, `data-flow-speed` and the unique wrapper `instance_id`.
- Keep each viewport and its previous/next controls inside its `data-flow-row`.
- Preserve `data-flow-controls`, `data-flow-prev`, `data-flow-next`, row direction
  and the original `content` markup. Do not move controls between rows.
- Pause buttons can appear anywhere **inside the composition wrapper**. Keep
  `data-flow-toggle`, the three `data-*-label` attributes and `type="button"`.
  Render them before initialization, not by moving them to another group later.
- Multiple pause buttons synchronize within their own composition only. When
  no pause control is rendered, autoplay stays off and manual navigation works.
- Preserve `hidden` initialization and visible keyboard focus. Reduced-motion
  preference disables autoplay regardless of where the pause buttons appear.

Hooks used by an overridden fragment must be retained there if you want its
extensions to continue running. The default templates remain the reference for
markup compatibility when updating Pro.

## Context and return contracts

Every action receives one array argument, $args. Actions run during server-side
rendering after group publication, source visibility and Pro license checks.
They return nothing; echoed HTML is inserted at the named position. Group actions
run once per composition, while row actions run once per row. Repeated shortcode
placements receive different instance IDs even when their saved group ID matches.

| Key | Type and meaning |
| --- | --- |
| group_id | int: saved group post ID |
| instance_id | string: unique DOM ID for this rendered composition |
| title | string: saved group title; escape before custom output |
| layout | array with mode (string) and speed (int, pixels per second) |
| rows | array of the two saved row definitions |
| rendered | string[] of original source-carousel HTML |
| render | callable(string $part, array $overrides = []): string, renders an allowlisted part with merged context |
| row_index | int, 0 or 1; only present for row fragments and row actions |
| row | array with carousel_id (int) and title (string); row context only |
| content | string of original source-carousel HTML; row context only |

The template filter receives (string $path, string $part, array $args) and returns
string: a readable local PHP filename. It runs immediately before a fragment is
included, after child/parent-theme lookup. Invalid paths use the bundled fragment.
Allowed part names are flow, toolbar, row, row-toolbar, controls and pause.
The filter runs before the render helper is assigned to the current fragment;
use the context for decisions rather than calling render from this filter.

### Add content below each row or after both rows

The same one-argument callback contract applies to every action in the table
above. For example, add a caption after each row's cards:

```php
add_action('cci_posts_carousel_pro_flow_after_row_content', function (array $args): void {
    printf('<p class="collection-caption">%s</p>', esc_html($args['row']['title']));
}, 10, 1);
```

Or render a form provided by a form plugin after both rows. Replace 123 with a
published Contact Form 7 form ID; the callback does nothing if that shortcode
provider is inactive:

```php
add_action('cci_posts_carousel_pro_flow_after_rows', function (array $args): void {
    if (shortcode_exists('contact-form-7')) {
        echo do_shortcode('[contact-form-7 id="123"]');
    }
}, 10, 1);
```

The form provider remains responsible for validation, permissions and submission.
To use another position, register the callback for the full action name formed
from the prefix and suffix above. Row-only keys are unavailable in group actions.

### Select a template from a site plugin

Place a trusted PHP fragment at templates/carousel-pause.php beside the site
plugin's main PHP file. Keep the pause markup contract described above:

```php
add_filter('cci_posts_carousel_pro_flow_template', function (string $path, string $part, array $args): string {
    if ($part === 'pause') {
        $custom = __DIR__ . '/templates/carousel-pause.php';
        return is_readable($custom) ? $custom : $path;
    }
    return $path;
}, 10, 3);
```
