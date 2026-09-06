# Popular Posts integration

The base plugin includes an integration with WordPress Popular Posts. Use it
when a carousel should automatically show articles with the most views instead
of a list maintained by hand.

## Before you start

Install and activate:

1. **WP Posts Carousel All In One 2.0.0**.
2. **WordPress Popular Posts**.

There is no separate CCI integration ZIP to install. WP Posts Carousel reads
the statistics already collected by WordPress Popular Posts and does not create
a second view counter.

## Create a most-read carousel

1. Open **WP Posts Carousel > Carousels**.
2. Create a carousel or edit an existing one.
3. Choose the posts or pages you want to display.
4. In the ordering field, select a WordPress Popular Posts option.
5. Choose the period, for example 24 hours, one week or one month.
6. Set the item limit and template.
7. Save the carousel and check the preview.
8. Publish it with the Gutenberg block or shortcode.

If no posts appear, first check whether WordPress Popular Posts has already
recorded views for the selected content and period. A new site may need real
visits before the ranking contains enough items.

## What the integration changes

The integration changes the query order. The selected template still controls
the card layout, and the carousel continues to use the same responsive,
publishing and frontend-engine settings as other saved carousels.
