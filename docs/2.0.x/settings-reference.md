# Settings reference

This page explains the main saved-carousel settings and how they map to runtime
behavior.

## Source

To restrict a carousel to one category, use **Query > Taxonomy filters** in
the saved-carousel editor. Select **Posts**, choose **Categories**, type a name
and select an autocomplete suggestion. The matching posts refresh automatically. This is not a PHP filter. Follow the
[one-category recipe](recipes#latest-guides-from-one-category) for every step.

The source controls where slides come from:

| Source | Use when |
| --- | --- |
| Posts/pages | The carousel should follow WordPress content. |
| Custom post type | The site has portfolios, listings, events or another CPT. |
| WooCommerce products | The carousel should show store products. |
| Manual selection | The order must be controlled by the editor. |
| Custom slides | The carousel needs campaign cards that are not WordPress posts. |
| Integration source | Another plugin supplies ordering or metrics. |

The query can be filtered with:

```php
wp_posts_carousel_query_args
```

## Manual composition

Manual composition is useful when the carousel is a campaign sequence rather
than a normal query.

Use manual composition for:

- launch sequences,
- guided buying stories,
- mixed article/product rows,
- video campaign playlists,
- curated product shelves.

Do not use manual composition for normal "latest posts" rows unless the order
really needs editorial control.

## Engine

Supported engines:

| Engine | Notes |
| --- | --- |
| Owl Carousel | Stable jQuery carousel engine used by PHP templates. |
| Swiper | Modern engine used by React/Swiper-capable templates. |

Do not assume every template supports both engines. Check the template manifest
before forcing a renderer or engine.

## Template

The template controls HTML, CSS, arrows, dots, responsive card layout and
template-specific fields.

Core templates:

```text
default
simple
light
```

Templates included in the single Pro package:

```text
commerce-luxe
story-commerce
video-showcase
```

## Compatible visual preset

Compatible visual presets are minor tuning modes for templates that support
them. They are not separate templates.

Typical meaning:

| Preset | Practical use |
| --- | --- |
| `clean` | Neutral post or page row. |
| `editorial` | More article-like spacing and text rhythm. |
| `commerce` | Price and CTA clarity for product rows. |
| `contrast` | Higher contrast for campaign sections. |

If the selected template does not support a preset, the setting should have no
visible effect. Do not sell presets as separate templates.

## Frontend filters

Frontend filters expose selected taxonomies above the carousel. The default
contract is URL/query based so filtered states can be linked and crawled:

```text
wpcf_{taxonomy}=term_id
```

The query is then applied when the carousel is rendered. A custom renderer or
future add-on can enhance this to background updates, but the stable contract is
the query parameter and `WP_Query` integration.

## Performance

Image performance settings:

| Setting | Notes |
| --- | --- |
| Lazy images | Use for most carousels below the first viewport. |
| First image eager | Use when the carousel is near the top of the page. |
| Image size | Choose a WordPress image size that matches the card layout. |

Avoid using `full` images for dense product rows unless the layout really needs
it.

## Custom field mapping

Map post meta or ACF field names into carousel fields:

```json
{
  "field_mapping": {
    "eyebrow": "campaign_badge",
    "kicker": "campaign_kicker",
    "story_step": "story_step",
    "duration": "video_duration",
    "accent": "accent_color",
    "price_text": "price_text",
    "button_label": "cta_label",
    "url": "custom_url",
    "image_url": "custom_image_url"
  }
}
```

This reads post meta. It does not require the ACF API.

## Which setting should solve the problem?

- Use taxonomy/source settings when the carousel should update automatically.
- Choose **Content selection > Manual slides** when editorial order is the requirement.
- Use Frontend filters when visitors should narrow the current query.
- Use field mapping when content already exists in post meta or ACF.
- Use a template for markup and visual structure.
- Use child-theme CSS for project colors, spacing and typography.
- Use a PHP filter only when the builder cannot express the data/query rule.

Locked Pro settings remain visible with their Pro label. Install/activate the
required product only when the project needs that behavior; normal post,
product and manual carousels do not require a feature-key configuration.

## Movement, controls and responsive layout

Open a saved carousel and its carousel settings. Change one group at a time,
preview, save, then check the published page; the editor is not the final theme.

| Control | What it changes | First test |
| --- | --- | --- |
| Responsive item counts | Number of visible cards at each configured viewport width | Start with 1 on a phone, 2 on a tablet, 3 on desktop. Test just above and below each breakpoint. |
| Gap | Space between cards, in pixels | Try 24. Change this field instead of overriding the runtime inline gap variable. |
| Slide by | Number of slides advanced by navigation | Use 1 for a reading sequence. |
| Start position | Initial slide index, starting at 0 | Leave 0 unless the carousel must start later. |
| Loop | Repeats the sequence continuously | Check with more items than fit in the viewport. |
| Rewind | Returns to the start at the end of a non-looping sequence | Test separately from Loop. |
| Autoplay | Advances without a click | Leave off for reading-heavy cards. |
| Autoplay timeout | Interval between automatic advances, in milliseconds | 5000 means five seconds; it does not make the movement itself last five seconds. |
| Autoplay speed | Owl's duration for an automatic transition | Try 1200 for a visibly slower movement. See the Swiper distinction below. |
| Navigation speed | Duration for arrow navigation; also Owl's general movement speed and Swiper's shared transition duration | 300 is a short transition; 1200 is a slower one. |
| Dots speed | Owl's duration when a visitor clicks a pagination dot | Enable Dots and click a different dot. It does not change autoplay or arrow navigation. |
| Pause on hover | Pauses autoplay while a pointer is over the carousel | Confirm the behavior in the chosen engine; phones have no hover. |
| Navigation / Dots | Shows arrows / pagination controls | Keep an operable navigation method when autoplay is off. |
| Stage padding | Visible space beside the carousel stage | Check that partial adjacent cards are intentional. |
| Auto width / Auto height | Lets slide content affect dimensions | Keep off for a uniform card grid until the template has been tested with varied content. |
| Mouse drag / Touch drag | Enables pointer / touch swiping | Check that links still open after a normal tap. |
| Keyboard control | Swiper keyboard navigation | Test focus and arrow behavior on the published page. |

Engine-specific fields are marked in the editor. Dots speed, Lazy load eager
and Pull drag apply to Owl; Touch ratio, Mousewheel sensitivity and Keyboard
control apply to Swiper. Do not assume the same numeric setting has identical
behavior in both engines. Autoplay progress indicators require Pro; autoplay
itself does not.

### Understand the four timing controls

All four fields use milliseconds: **1000 ms = 1 second**. A larger duration
means a slower transition. A larger timeout means less frequent automatic
advances. These controls do not select the animation effect or create a
continuous scrolling ticker.

**Owl Carousel:** Autoplay timeout sets the automatic advance interval;
Autoplay speed sets automatic transition duration; Navigation speed controls
arrow transitions and the general/drag-end speed; Dots speed controls dot
click transitions. Test each control using the interaction it applies to.
Use positive values when comparing durations. Zero is not a reliable way to
request an instant transition because Owl can fall back to its general speed.

**Swiper:** the current integration uses Navigation speed as one shared
transition duration, including autoplay and dot clicks. Autoplay speed is
used only as a fallback when Navigation speed is zero/unset; it is not an
independent autoplay duration when Navigation speed is positive. Dots speed
is Owl-only. Autoplay timeout still sets the autoplay delay.

**Editor/fallback preview:** when the React preview uses the fallback engine,
its track has a fixed 260 ms CSS transition. Timeout can change there while
the three duration fields appear ineffective. Check the saved carousel on
its published page with its actual engine before judging these fields.

### Try a visible timing difference

Use the standard **Slide** effect, at least four matching posts and one
visible item. Set Autoplay timeout to **5000** and Navigation speed to
**1200**. For Owl, also set Autoplay speed and Dots speed to **1200**. Enable
Autoplay, Navigation and Dots, then save and open the embedded page.

Observe an automatic advance without hovering or focusing the carousel;
then test an arrow and a dot. Compare durations of **300** and **1200** using
the same interaction. Keep each duration below the autoplay interval for
this test. If only timeout changes, follow
[transition troubleshooting](troubleshooting#changing-speed-does-not-change-the-transition).

## Test a change without changing every page

Duplicate the saved carousel before experimenting. Embeds share the saved ID,
so editing the original changes every page using it. Use the duplicate on a
staging page, test long titles and missing images, then apply the tested settings
to the original.
