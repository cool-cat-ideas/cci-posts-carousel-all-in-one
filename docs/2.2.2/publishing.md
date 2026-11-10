# Publishing carousels

CCI Posts Carousel All In One stores reusable carousel definitions. Publishing methods
should reference the saved carousel ID rather than duplicating configuration in
page content.

## Gutenberg block

First save the carousel with **Status > Published** in its editor. You can then
add the same carousel to one or more pages:

1. Edit a WordPress page or post.
2. Click the block inserter **+** and search for **CCI Posts Carousel All In One**.
3. Add the block and choose your saved carousel by name.
4. Publish or update the page, then open the page to check the result.

The block's technical identifier is:

```text
wp-posts-carousel/carousel
```

The block shows a selector of saved carousels. Select the carousel by name. Do
not manually type an ID unless a custom integration intentionally exposes that
field.

The editor preview uses the same saved carousel data as the frontend. If the
selected carousel is changed later, every block using that saved carousel is
updated.

## Shortcode

Open **CCI Posts Carousel All In One > Dashboard** and copy the carousel's shortcode from
the **Shortcode** column. In a page or post, add a **Shortcode** block and paste
it there. Publish or update the page.

For example:

```text
[cci_posts_carousel id="123"]
```

`123` is an example. Use the shortcode copied from your own carousel.

Optional renderer override:

```text
[cci_posts_carousel id="123" renderer="php"]
```

Only use a renderer override when the selected template supports it.

## PHP template code

For theme files or custom templates:

```php
<?php echo do_shortcode('[cci_posts_carousel id="123"]'); ?>
```

Keep this in a child theme or custom plugin. Editing a parent theme directly can
be lost during theme updates.

## Elementor

Elementor integration is a Pro feature. Install and activate
`cci-posts-carousel-pro`, then use the CCI Posts Carousel All In One Elementor widget and
select a saved carousel from the widget controls.

If a page builder preview does not execute all frontend scripts, check the
published page before treating the carousel as broken.

## REST payload for React/Swiper

React/Swiper output reads public carousel data from:

```text
GET /wp-json/wp-posts-carousel/v1/carousel/{id}
```

The endpoint can receive active frontend filter query values, for example:

```text
?wpcf_category=12
```

## Publishing checklist

- The saved carousel exists.
- The embedded ID matches the saved carousel.
- The selected template is available and not locked by a missing Pro feature.
- The selected renderer is supported by the template manifest.
- Required assets are enabled or already provided by the theme.
- Cache/minification was cleared after changing assets or templates.

## Shortcode requirements

Use `[cci_posts_carousel id="123"]` for new placements, replacing `123` with the
saved carousel ID. The legacy `[wp_posts_carousel id="123"]` alias remains
supported for existing placements. Publish the carousel before placing it on a public page. Both aliases load the same assets, including in Elementor shortcode content. An ID is required. Draft and private carousels remain hidden from visitors; an authorized editor can preview a draft.
