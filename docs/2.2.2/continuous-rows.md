# Continuous rows

> Pro preview. These features are in preparation and are not included in the base 2.2.0 download. Pro is not yet available to buy or download.


Show two collections together, with the first row moving left and the second
moving right. Each row uses a saved carousel, so it can have its own products,
posts and card template. This display mode is included in Pro.

## Example: workdays and weekends

An accessories shop can show desk lamps, phone docks and headphones in the first
row, with bags, coffee accessories and casual clothing in the second. Customers
can browse both collections without changing tabs. Pause and manual controls
give them time to inspect a product before following its link or adding it to
the cart. Movement alone does not establish an increase in sales; use Analytics
to compare engagement with each collection.

For a publication, the same layout can show the latest articles above practical
guides. Keep card text short so that readers can identify an interesting article
before pausing the row.

## Set up two rows

1. Create and publish two individual carousels. Choose Default, Light, Simple
   or Commerce Luxe. Story Commerce and Video Showcase have their own navigation
   and are not supported in this mode.
2. Open **CCI Posts Carousel → Connected carousels → Create continuous rows**.
3. Enter a group title, then a visible title and a published carousel for each row.
4. Start with a speed of **24 pixels per second**. The supported range is 8 to 60.
5. Publish the group, save it and copy its shortcode into a page:

   ```text
   [cci_carousel_group id="123"]
   ```

Replace `123` with the saved group's ID. Both the group and its source carousels
must be published and must not be password protected. Pro must have an active
license. No separate database migration is required for this feature.

Each row uses its saved **Owl Carousel or Swiper** engine, breakpoint settings,
spacing, card template and image settings. You may use the same library for
both rows or mix them. Native library instances handle transitions, looping,
dragging and responsive sizing; Pro coordinates the two rows and their pause
controls. This is not a third carousel engine.

The group sets a horizontal single row, loop and continuous autoplay for each
collection, with opposite directions and the chosen motion speed. Source filters,
effects and the source row count do not apply inside this composition. The saved
source settings remain unchanged when that carousel is used elsewhere.

Provide more items than the largest visible column count. For three columns,
use at least four items per row. The example uses three columns from 1100 pixels,
two from 768 pixels and one on smaller screens, as saved in its source carousels.

## Browsing and accessibility

The default pause control appears above the rows. A child theme or site plugin
can [move it beside the arrows or customize the toolbar](./continuous-row-templates.md)
without changing the carousel engine. The demo uses this API to place synchronized
pause controls next to each row's arrows.

- **Pause motion** stops both rows; **Resume motion** starts them again.
- Hovering over a row or focusing a link in it pauses that row.
- Dragging a row or using its arrows pauses automatic movement until the visitor
  selects Resume motion. Each row has its own previous and next controls.
- Vertical touch gestures remain available for scrolling the page.
- The operating system's reduced-motion preference disables automatic movement.
  Manual arrows remain available.
- Animation pauses when the group is outside the viewport or the browser tab is hidden.

Cards keep their links, template styling and image fitting. Native loop clones
retain source slide IDs so that the analytics deduplication also covers cloned
cards.

## Which carousel receives a click?

Analytics events retain the **source carousel ID** and **slide ID**. Choose a
different saved carousel for each row to compare their results in Analytics.
Even when the same product appears in both, the source carousel distinguishes
the events. Reusing the same saved carousel in both rows or elsewhere on the page
combines its results; the group and row position are not separate report dimensions.

Tracking must be enabled in Analytics. With **Require analytics consent before
tracking** enabled (the default), tracking waits for analytics consent. This is
a configurable tracking rule, not a statement that every possible aggregate
counter requires consent. See the [analytics data and consent notes](./pro-features.md#engagement-analytics)
before changing it. Dragging and
navigation arrows are not content clicks. Each carousel click and each slide
click is counted once per page load, so these are deduplicated engagement counts,
not a count of every repeated click or a sales attribution report.

See also: [Connected carousels](./connected-carousels.md) and
[Analytics setup](./pro-features.md).
