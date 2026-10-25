# Two-row carousels

Two rows are included in the base plugin from version 2.2.0. They show more cards in one section and move
together with the same arrows, dots and dragging gestures. No new shortcode
or Pro license is required.

## Set up the layout

1. Open an existing carousel and select **General**.
2. Under **Rows**, select **Two rows**.
3. Choose **Rows on phones**. The default is one row up to 767 px. You can keep
   two rows on phones and change this width between 320 and 1024 px.
4. Adjust **Gap between rows** in pixels.
5. Keep or edit the existing breakpoints. Their item counts now mean columns:
   three columns with two rows display six cards.
6. Save, open the preview under **Slides**, and check desktop and phone widths.

Keep using `[cci_posts_carousel id="123"]` with the saved carousel's ID.
The carousel must be published for visitors to see it.

Cards fill each column from top to bottom, in the saved order: cards 1 and 2
form the first column, 3 and 4 the second. Both rows move together. An odd
last card leaves the lower cell empty; the product is not duplicated.

Default, Light and Simple support this layout with both Owl and Swiper.
Commerce Luxe also supports it when Pro is installed and licensed. Specialist
templates such as Story Commerce and Video Showcase keep their own layouts.
Two rows use horizontal sliding, equal column widths and no merged slides.
Single-row settings are retained when returning to one row.

## Example: home office guides

Show six guides in three columns and two rows: arranging a small desk, sharing a
workspace, choosing lighting and keeping cables organized. Use eight articles
so visitors can browse further with the shared arrows. On phones, choose one
row and one column to keep each article easy to read.

The same layout works for linked products. Product prices and buying buttons
belong to Pro; the base plugin can display linked product content cards.

Two rows differ from Pro's connected carousels: a connected group uses an
inspiration image to choose which separate product collection appears below.
Pro's continuous rows instead show two independent collections moving in
opposite directions. Those Pro features are previews of the upcoming edition.

## Extension notes

Options live in `engine.options`: `rows`, `mobile_rows`, `rows_mobile_max` and
`row_gap`. Legacy editor values use the same keys under `carousel_options`.
Existing configurations default to one row. No schema migration is needed.

Template authors can add their tested card template name using
`wp_posts_carousel_two_row_templates`. Original PHP card markup and tracking
IDs are retained. The layout groups cards into columns before mounting the
selected engine. Navigation and pagination reuse the selected template styles,
including their mobile behavior. See the native [Owl options](https://owlcarousel2.github.io/OwlCarousel2/docs/api-options.html)
and [Swiper API](https://swiperjs.com/swiper-api) for their navigation behavior.


### Register a compatible template

Use the wp_posts_carousel_two_row_templates filter after testing a custom
card template with both supported engines. It receives one string[] of template
names and must return string[]. It changes the supported-template list, not the
saved row count or card markup. Register it in a site plugin or child theme:

```php
add_filter('wp_posts_carousel_two_row_templates', function (array $templates): array {
    $templates[] = 'my-card-template';
    return array_values(array_unique($templates));
});
```

Replace my-card-template with the registered name of your tested template.
