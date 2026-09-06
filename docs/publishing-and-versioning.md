# Publishing and versioning documentation

## Recommendation

Keep documentation inside the repository and inside the product directory it
describes:

```text
wp-posts-carousel/docs/
wp-posts-carousel-pro/docs/
wp-posts-carousel-related-content/docs/
wp-posts-carousel-aurora-cards/docs/
```

Publish customer-facing documentation on the product site. Keep GitLab Wiki for
internal notes, release checklists and technical decisions, not as the main
customer documentation.

## Release flow

1. Code changes and documentation changes go through the same review.
2. Each released product ships its own `CHANGELOG.md`; release ZIP files do not
   include `docs/`.
3. The site renders Markdown/MDX from the versioned product docs kept in the
   repository.
4. Public documentation URLs are versioned per product.

Example:

```text
https://coolcatideas.com/docs/wp-posts-carousel-all-in-one/2.0.0/
https://coolcatideas.com/docs/wp-posts-carousel-all-in-one/2.0.0/pro-features/
```

## Release artifacts

Each product builds independently. Release ZIP files should be written to the
shared release directory:

```text
wp-content/plugins/releases/
wp-posts-carousel-2.0.0.zip
wp-posts-carousel-pro-2.0.0.zip
```

Do not keep generated `dist/` directories in product folders unless the product
explicitly requires them.

## What should block a release

Block the release if:

- `readme.txt` has a different version than the plugin header,
- a released product has no `CHANGELOG.md`,
- a product changed public behavior without a matching `docs/{version}` update
  for the website,
- a public hook, endpoint, template manifest, license payload or saved carousel
  payload changed without documentation,
- a Pro add-on describes a feature implemented by another product,
- demo copy claims a use case that the installed template cannot actually show.

## Product responsibility

| Product | Owns |
| --- | --- |
| `wp-posts-carousel` | Base runtime, shortcode, Gutenberg block, REST admin, included templates and core hooks. |
| `wp-posts-carousel-pro` | License layer, WooCommerce Products, Commerce Luxe, Story Commerce, Video Showcase, Elementor, analytics and Pro contract. Each feature remains a separate class/template module inside this plugin. |

## Version policy before production

Until production release:

- `wp-posts-carousel` starts at `2.0.0`,
- `wp-posts-carousel-pro` starts at `2.0.0`,
- Related Content and Aurora Cards start at `1.0.0`,
- all built-in Pro modules are released as part of `wp-posts-carousel-pro` `2.0.0`.

Do not create artificial patch changelogs while the product is still in active
development.
