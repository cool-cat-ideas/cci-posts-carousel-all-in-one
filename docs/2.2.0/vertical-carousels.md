# Vertical carousels with Swiper

Available in Free 2.2.0. Use a vertical carousel for a reading list beside an article, a narrow recommendation area or a compact sequence of announcements.

## Configure the carousel

1. Open the carousel and select **General → Engine → Swiper**.
2. Choose **One row**, then **Direction → Vertical**.
3. Set **Vertical viewport height**, for example 480 px.
4. Set one visible item at each breakpoint to show a complete card. If you show several items, increase the viewport height and check that the card text fits.
5. Enable navigation, publish the carousel and place `[cci_posts_carousel id="42"]` on the page.

The arrows use the configured up/down icons. Visitors can also drag vertically or swipe when mouse/touch dragging is enabled. Mousewheel navigation is optional: enable it together with **Release mousewheel on edges** if visitors should continue scrolling the page at the first or last card.

The height is bounded between 240 and 1600 px. Auto height is disabled for a vertical Swiper so the viewport does not grow to include every slide. Check the height and card content on a phone, especially when titles wrap.

## Engine and layout limits

Owl does not support this vertical mode. Selecting Owl shows an information message explaining that Swiper is required. Switching from Swiper to Owl restores horizontal scrolling; the plugin does not silently switch libraries.

Two-row carousels move horizontally. Choose One row before selecting Vertical. Vertical scrolling does not require Pro, a custom demo template or another slider engine.

## Example

The **A vertical reading list** demo places home office guides beside an article in a narrow column. It uses a 400 px viewport, native Swiper up/down navigation and autoplay disabled. The same page also shows the other templates, each with a viewport height suited to its cards.

For an asynchronous placeholder, use `[cci_posts_carousel id="42" lazy="true"]`. See [Loading skeletons and custom HTML](./loading-skeleton.md) for a child-theme override.

## Width and control placement with CSS

The shortcode fills its parent column. Place it in a WordPress Column or Group block to choose its width. The demo's narrow column is page styling, not a restriction built into the plugin.

The default vertical layout places the previous arrow above the cards, the next arrow below them, and pagination beside them. The controls occupy separate grid cells and do not cover card content. Add CSS to your child theme or custom carousel template:

```css
.reading-list .cci-wpc-render-preview[data-wpc-direction='vertical'] {
  --wpc-vertical-max-width: 420px;
  --wpc-vertical-controls-gap: 12px;
  --wpc-vertical-control-size: 44px;
}
```

Here `.reading-list` is a class on the Group block containing the shortcode. Keep buttons large enough for touch use.

To place bullet pagination below the bottom arrow, without changing HTML:

```css
.reading-list .cci-wpc-render-preview[data-wpc-direction='vertical'] {
  --wpc-vertical-columns: minmax(0, 1fr);
  --wpc-vertical-dots-area: 4 / 1;
  --wpc-vertical-dots-direction: row;
}
```

These variables affect the default control layout. Fraction and progress-bar pagination have different shapes; style those selectors in your template if you change their position. There is no separate pagination-position dropdown in the editor.

## Keep your own card template

Vertical Swiper renders the selected PHP card template and then moves those cards with Swiper. Existing image settings, item hooks and theme overrides remain available. Put custom template files in the child theme's `wp-posts-carousel/templates/your-template/` directory and register them using the existing template manifest contract.

Keep the slide's outer element and its `data-wpc-slide-id` attribute from `$this->slide_layout_attributes()`. The renderer uses those boundaries to preserve each card as one slide. Scope vertical-specific CSS with `[data-wpc-direction='vertical']` so horizontal carousels retain their design. The plugin supplies layout and controls; the template owns card markup, colors, type and button appearance.

For control markup as well as styling, see [Custom Swiper control HTML](./swiper-controls.md).
