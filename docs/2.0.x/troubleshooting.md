# Troubleshooting

Use this page when a carousel does not render, does not move or looks different
between admin and frontend.

## Carousels stopped working after updating from 1.x

Version 2.x is a rewrite. Old carousel settings, widgets and shortcode
configuration are not automatically converted. Create replacement carousels
in **WP Posts Carousel > Dashboard > New carousel**, save and publish them,
then replace every old placement with the new shortcode or select the new
carousel in the current block/widget. Clearing cache alone cannot migrate
the old configuration.

Follow [Upgrade from 1.x to 2.x](upgrading-from-1.x) for the steps and a
screenshot of the new dashboard.

## Changing speed does not change the transition

1. Confirm whether you are testing the editor preview or the published page.
   The fallback preview uses a fixed 260 ms track transition; it does not
   demonstrate the individual engine duration settings.
2. Save the carousel and test its actual page. Clear the page/asset cache if
   the page still uses previous settings.
3. Check the selected engine. For **Owl**, change Autoplay speed for automatic
   movement, Navigation speed for arrows, and Dots speed for dot clicks.
   For **Swiper**, change Navigation speed; the current integration uses it
   as the shared duration. Dots speed does not apply to Swiper.
4. Use the standard **Slide** effect and compare 300 ms with 1200 ms. Keep
   Autoplay timeout at 5000 ms and use more posts than visible items.
5. If movement is still unchanged on the published page, check for reduced
   motion preferences and theme CSS overriding `transition` or `animation`.
   A fade or template animation can have a separate CSS duration.

If the problem persists, send the plugin version, selected engine, template,
renderer, timing values, whether the test is in preview or on the published
page, and a public/staging URL if available. Do not send site credentials.

See [timing controls](settings-reference#understand-the-four-timing-controls).

## I cannot find a category selector

Category selection is under **Query > Taxonomy filters**, rather than in
**Carousel settings**. Choose **Query (automatic)** and select **Posts** first,
then choose **Categories**, type a name in **Search categories** and select a
suggestion. Results refresh automatically. Use **×** on a selected chip to
remove one category. No PHP is required. Follow the
[category recipe](recipes#latest-guides-from-one-category).

If the taxonomy section is absent even with Posts selected, provide the
installed version and a screenshot of the Query tab. An unavailable control
needs investigation; adding PHP is not the normal workaround for a missing
category selector.

## The carousel is empty

Check:

1. The saved carousel ID exists.
2. The shortcode or block references the correct ID.
3. The selected source returns posts/products for the current filters.
4. The selected template is available.
5. Pro is active if the template requires a Pro feature.

For React/Swiper payloads, open:

```text
/wp-json/wp-posts-carousel/v1/carousel/{id}
```

The response should include slides and runtime configuration.

## The editor preview is empty

Check:

- the block has a selected saved carousel,
- the REST request returns `200`,
- the editor page loaded frontend preview assets,
- browser cache or admin asset cache was cleared,
- the selected renderer is supported by the template.

If the preview fails but the frontend works, collect the editor URL, carousel ID
and failed REST response before reporting it.

## Styles differ between backend and frontend

This usually means one of these is true:

- the editor iframe did not receive the same template CSS,
- a theme stylesheet overrides template selectors on the frontend,
- a cache/minifier is serving old CSS,
- the template CSS is scoped too broadly,
- another carousel template overrides global Owl or Swiper classes.

Template CSS should be scoped to:

```text
.cci-wpc-{template}-template-theme
```

Avoid global overrides such as:

```css
.owl-nav button { ... }
.swiper-button-next { ... }
```

## Arrows are blank

The plugin expects FontAwesome arrow markup for Owl controls:

```html
<i class="fa fa-angle-left" aria-hidden="true"></i>
<i class="fa fa-angle-right" aria-hidden="true"></i>
```

Check:

- `wp-posts-carousel-font-awesome` is enqueued or an existing FontAwesome asset
  is available,
- `navText` is not empty,
- the template is not drawing arrows with `::before` pseudo-elements,
- cache/minification did not remove icon classes.

## Slides are clipped or bleed outside the viewport

Check:

- the template owns its `overflow` and border buffer,
- `--wpc-carousel-gap` is set correctly,
- the card width is stable at the tested breakpoint,
- inactive slides are not positioned over the active viewport,
- borders and focus rings are not hidden by `overflow: hidden` on the wrong
  element.

Always test 1, 2, 3 and 5+ slides. A layout that works for three slides can
still fail for one or many.

## WooCommerce buttons change size after add to cart

WooCommerce can add a `View cart` link after `Add to cart`. The template must
reserve enough space for both states.

Check:

- the CTA row can wrap,
- long button labels do not overflow,
- price and sale price fit on mobile,
- category badges are not styled as fake links when they are not clickable.

## Video playlist starts at the wrong moment

For video templates, check the saved slide data:

- provider type is correct,
- YouTube/Vimeo/direct URL is valid,
- start time is saved as a number of seconds where the template expects it,
- the playlist item updates the local video state, not the outer carousel slide.

In Video Showcase, clicking a playlist item should change the active video
inside the current campaign slide. Owl/Swiper arrows should move to another
campaign slide.

## A JSON error appears in the editor

Collect:

- request URL,
- response status,
- response body,
- carousel ID,
- selected renderer,
- selected template.

Then check whether a PHP warning or notice is printed before JSON. WordPress
REST responses must not contain HTML notices before the JSON body.

## Frontend filters reload the page

The stable core contract is URL/query based filtering. A full reload can be
valid behavior when filters are rendered as normal links or forms.

If the site needs background updates, implement that as a renderer enhancement
or add-on while keeping the same query parameter contract:

```text
wpcf_{taxonomy}=term_id
```
