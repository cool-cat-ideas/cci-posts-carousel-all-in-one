# Features included in Pro

CCI Posts Carousel All In One Pro 2.0.0 is one plugin and one license. It adds every commercial feature described below; none requires another WPC purchase, plugin or ZIP.


## Availability and new layout previews

Pro is in preparation and is not yet available to buy or download. This page
describes its planned capabilities; they are not included in the base 2.2.0 ZIP.

- [Independent rows](./continuous-rows.md): two collections, opposite directions,
  native Owl/Swiper navigation and synchronized pause controls.
- [Connected collections](./connected-carousels.md): choose a scene to display its
  assigned collection.
- [Control templates and hooks](./continuous-row-templates.md): change pause placement
  and markup, or insert content from a child theme or site plugin.

For shared two-row navigation available now, use the
[base plugin's two-row layout](./two-row-carousels.md).


## WooCommerce Products

The base plugin can query the WooCommerce `product` post type, but renders it
like generic linked content. Pro adds current prices, sale state, ratings,
purchase actions and bestseller, top-rated and price ordering. Follow
[WooCommerce product carousel](./woocommerce-products.md) for setup.

## Commerce Luxe

Commerce Luxe is a focused product-campaign card with prominent media, current price, promotion and purchase action.

## Story Commerce

Story Commerce combines different slide shapes into a manually ordered journey from context and advice to product, proof and offer.

## Video Showcase

One carousel slide represents one campaign and can contain a main YouTube, Vimeo or HTML5 video plus a local playlist. Playlist clicks change the video in the current slide; carousel arrows move between campaigns.

## Elementor

Add the CCI Posts Carousel All In One widget and select an existing saved carousel. Editors do not need to copy an ID or duplicate carousel settings in Elementor.

## Engagement analytics

1. Open **CCI Posts Carousel All In One → Analytics** with Pro active.
2. Enable **Enable frontend tracking**, **Track impressions** and **Track clicks**.
3. Leave **Require analytics consent before tracking** enabled and configure your consent banner. CCI Cookie Consent is detected automatically; tracking starts after the visitor accepts the Analytics category. Cookiebot, Complianz, Cookie Notice and the existing custom consent integration are also supported.
4. Click **Save settings**. Changing the report period or refreshing the report does not save or discard your edited settings.
5. If you cache full pages, clear that cache after changing tracking settings. Visit a published page, accept analytics consent, scroll to the carousel and click a slide link. Return to the report and refresh it.

| Metric | What is counted |
| --- | --- |
| Carousel impressions | One view per carousel ID per page load when at least 35% of the carousel is visible in an active browser tab. A slide link click also confirms a view if the visibility callback has not recorded one yet. |
| Carousel clicks | The first link click inside a slide, per carousel ID per page load. Repeated clicks on the same or another slide do not add another carousel click. |
| Slide impressions | One view per carousel ID and slide ID per page load, using the same visibility threshold or a link click. |
| Slide clicks | The first link click per carousel ID and slide ID per page load. Image, title, category and CTA links inside a slide all qualify. |
| Click rate | Carousel clicks divided by carousel impressions, multiplied by 100. Enable both tracking options for a meaningful rate. |

Arrows, pagination dots, swipes, autoplay transitions, video controls and clicks on non-link slide backgrounds are not link clicks. Navigation can reveal another slide and therefore produce a slide impression. Repeated carousel instances and loop clones share the same ID-based counters. Reloading the page starts a new count; these are not unique visitors or sessions.

The panel displays carousel totals and rankings. The report API also returns per-slide counters. Counters are aggregated in this WordPress site's database; no visitor identifier is stored. Tracking stops when analytics consent is withdrawn. Browser blockers, failed requests and request limits can reduce recorded totals, so these are engagement measurements rather than an exact traffic audit.

If the report stays empty, check the saved tracking setting, active Pro license, analytics consent, page cache and the `/wp-json/cci-posts-carousel-pro/v1/analytics/track` response in the browser's Network panel. A successful response includes a positive `tracked` count. A 403 response can indicate an origin check failure; 429 means the request limit was reached.

## Autoplay indicators

Autoplay can display a progress bar, countdown or both.

## Multisite

Network tools copy saved carousel definitions between sites. See [WordPress Multisite](./multisite.md) for the supported workflow.

## One installation

Install the base plugin and the single `cci-posts-carousel-pro` ZIP. Activating
the Pro license unlocks all commercial modules. Updating that ZIP updates every
feature on this page.
