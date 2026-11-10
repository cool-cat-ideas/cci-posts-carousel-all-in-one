# Troubleshooting

If a carousel is not appearing or behaves differently from the preview, start
with the matching section below. If a step is unclear, we are happy to help:
[choose a support channel](./support.md#choose-the-right-support-channel). You do not
need to diagnose the cause before contacting us.

## Carousels stopped working after updating from 1.x

Version 2.x is a rewrite. Old carousel settings, widgets and shortcode
configuration are not automatically converted. Create replacement carousels
in **CCI Posts Carousel All In One > Dashboard > New carousel**, save and publish them,
then replace every old placement with the new shortcode or select the new
carousel in the current block/widget. Clearing cache alone cannot migrate
the old configuration.

Follow [Upgrade from 1.x to 2.x](./upgrading-from-1.x.md) for the steps and a
screenshot of the new dashboard.

## Changing speed does not change the transition

1. Open **Plugins > Installed Plugins** and check that the base plugin is
   **2.0.4 or newer**. Earlier versions could ignore transition duration in
   the fallback editor preview and share one duration across Swiper interactions.
2. Under **General**, use Autoplay speed for automatic movement, Navigation
   speed for arrows and Dots speed for dot clicks. These settings work
   independently in Owl, Swiper and the fallback editor preview.
3. Use the standard **Slide** effect and compare 300 ms with 1200 ms. Keep
   Autoplay timeout at 5000 ms and use more posts than visible items. Test
   autoplay, an arrow and a dot separately.
4. Save the carousel and check its published page. Clear the page/asset cache
   if it still uses previous settings. For Owl's Fade effect, use one visible item.
5. If movement is still unchanged, check reduced-motion preferences and theme
   CSS overriding `transition` or `animation`. Custom template animations can
   have a separate duration.

If the published page still behaves the same, please
[open a support request](./support.md#choose-the-right-support-channel). Include a
screenshot of the timing settings under **General**, your installed plugin
version and whether you tested the preview or the actual page. A public example
URL helps if one is available; please keep private site details in the account form.

See [timing controls](./settings-reference.md#understand-the-four-timing-controls).

## I cannot find a category selector

Category selection is under **Query > Taxonomy filters**, rather than in
**Carousel settings**. Choose **Query (automatic)** and select **Posts** first,
then choose **Categories**, type a name in **Search categories** and select a
suggestion. Results refresh automatically. Use **×** on a selected chip to
remove one category. No PHP is required. Follow the
[category recipe](./recipes.md#latest-guides-from-one-category).

If the selector is still missing, open **Plugins > Installed Plugins** and check
that the base plugin is version **2.0.3 or newer**. After updating, reopen the
carousel and check **Query** again. If you would like us to take a look,
[open a support request](./support.md#choose-the-right-support-channel) with that
version and a screenshot of the tab. No PHP change is needed to select a category.

## The carousel is empty

1. Open **CCI Posts Carousel All In One > Dashboard** and edit the affected carousel.
2. Under **Query**, check the selected post types, categories and **Posts limit**. For an automatic query, matching published content should appear in **Query preview**. For **Manual slides**, check the selection under **Slides**.
3. Choose an installed template under **Design**. Commerce Luxe, Story Commerce and Video Showcase need Pro; Default, Simple and Light do not.
4. Set **Status** to **Published** and click **Save**.
5. Edit the page and confirm that its block selects this carousel, or replace its shortcode with the one copied from the dashboard.
6. Update the page and clear its page cache if your site uses one. Open the actual page again.

If a developer is helping you check the public carousel data, this is the REST
path. Replace `{id}` with the saved ID from the shortcode:

```text
/wp-json/wp-posts-carousel/v1/carousel/{id}
```

The response should include slides and runtime configuration. You can also
[ask us for help](./support.md#choose-the-right-support-channel) with the carousel
name or shortcode and a screenshot; reading REST data is not a requirement.

## The editor preview is empty

In the carousel editor, **Query preview** lists the posts matching an automatic
query. Check **Query > Post types**, the category selection and **Posts limit**
if that list is empty. For a fixed selection, use **Slides** instead.

In the WordPress page editor, the carousel block needs a saved carousel. Save
and publish the carousel first, then choose it in the block's selector. If the
published page works but the editor preview does not, please
[open a support request](./support.md#choose-the-right-support-channel). Let us know
which preview is affected and include its screenshot and carousel name.

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

First check **General > Navigation** in the carousel editor, then save the
carousel. Open **CCI Posts Carousel All In One > Settings > Compatibility** and check
**Navigation icon library** and **Icon source**. If your theme does not supply
the selected icons, choose **Local plugin files**, save the settings and clear
the page cache before testing the published page.

The plugin supports Font Awesome and Tabler Icons; it does not always require
Font Awesome. For developers checking a Font Awesome configuration, Owl's
default icon markup includes:

```html
<i class="fa fa-angle-left" aria-hidden="true"></i>
<i class="fa fa-angle-right" aria-hidden="true"></i>
```

For a theme or template override, also check:

- `wp-posts-carousel-font-awesome` is enqueued or an existing FontAwesome asset
  is available when Font Awesome is selected,
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

Please open **CCI Posts Carousel All In One > Settings > Diagnostics** and look for a
message corresponding to the failed action. You can
[open a support request](./support.md#choose-the-right-support-channel) with the
error text, the action you tried and the carousel name. You do not need to
collect browser network data before asking.

For a developer investigating the request, useful details are:

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
