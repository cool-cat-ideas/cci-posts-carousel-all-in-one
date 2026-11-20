=== CCI Posts Carousel All In One ===
Contributors: coolcatideas
Tags: carousel, slider, posts, gutenberg, custom post types
Requires at least: 6.2
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 2.2.3
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Create carousels for posts, pages and custom post types. Preview slides in the editor and add them with a Gutenberg block or shortcode.

== Description ==

![CCI Posts Carousel All In One logo](https://raw.githubusercontent.com/cool-cat-ideas/cci-posts-carousel-all-in-one/main/assets/images/cci-posts-carousel-logo.png)

Show recent articles on your homepage or bring selected guides together on a landing page. With **CCI Posts Carousel All In One**, you choose what appears, preview the cards and save the carousel for reuse. Add it to a WordPress page with a Gutenberg block or shortcode. When you edit the saved carousel, every page that uses it shows the updated version.

[See the two-row example](https://wordpress-demo.coolcatideas.com/cci-free-two-row-example/) | [Browse live demos](https://wordpress-demo.coolcatideas.com/) | [Read the setup guide](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.2.2/)

= Build a two-row post carousel in Gutenberg =

1. On the plugin dashboard, click **New carousel** and select the articles you want to show.
2. Open **General > Rows**, choose **Two rows** and set **Rows on phones** to **One row**. Check the desktop and phone previews, then save the carousel.
3. In the WordPress block editor, add **CCI Posts Carousel All In One**, select the saved carousel and publish your page.

The visual editor, Gutenberg block and two-row layout are included in this plugin. The [two-row guide](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.2.2/two-row-carousels/) shows how to set columns and spacing.

= Choose what your visitors can browse =

* **Keep recent posts in view.** Select post types, categories and tags. Pin key posts or custom slides first and let matching posts fill the remaining places without duplicates.
* **Build a hand-picked collection.** Select posts or pages individually and drag them into order. Add your own image slides for featured links.
* **Fit the carousel to the page.** Choose Default, Light or Simple. Set responsive columns, arrows and autoplay, and preview your changes with Owl Carousel or Swiper.
* **Add context to cards.** Choose titles and excerpts, use ACF or post meta for card fields, and optionally show a second image on mouse hover. Touch screens keep the primary image.
* **Help readers find more content.** Add category or tag filters above the carousel. Use popular post ordering if [WordPress Popular Posts](https://wordpress.org/plugins/wordpress-popular-posts/) is installed.

The base plugin can show WooCommerce products as linked content cards.

= Preview CCI Posts Carousel All In One Pro =

Pro is currently in preview. See how shoppers can browse bestsellers or top-rated products with current WooCommerce prices, sale labels, ratings and Add to cart buttons. **Commerce Luxe** gives featured products their own layout, while **Story Commerce** lets you present products across a sequence of slides.

**Video Showcase** pairs a video with a playlist. Pro also adds an Elementor widget for saved carousels, reports on carousel views and clicks, autoplay progress indicators and tools for copying carousels between licensed WordPress Multisite sites. These features are included in one separate Pro plugin.

[Try Commerce Luxe](https://wordpress-demo.coolcatideas.com/cci-posts-carousel-demo/#wpc-demo-carousel-commerce-luxe-products) | [See Video Showcase](https://wordpress-demo.coolcatideas.com/cci-posts-carousel-demo/#wpc-demo-carousel-pro-video-showcase) | [Get notified when Pro goes on sale](https://coolcatideas.com/products/cci-posts-carousel-all-in-one/#configurator)

= Optional extensions =

[Aurora Cards](https://coolcatideas.com/products/cci-posts-carousel-aurora-cards/) adds a card template, and [Related Content](https://coolcatideas.com/products/cci-posts-carousel-related-content/) adds a source for related posts or products. Screenshots below identify examples that use Pro or an extension.

= Support and developer documentation =

[Ask a question in the WordPress support forum](https://wordpress.org/support/plugin/wp-posts-carousel/) or [report an issue on GitHub](https://github.com/cool-cat-ideas/cci-posts-carousel-all-in-one/issues). Include what you tried and your WordPress and plugin versions. Keep license keys and account details private.

The [developer guide](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.2.2/) explains the hooks and filters for extending queries, templates and integrations. For help with a specific setup, [contact Cool Cat Ideas](https://coolcatideas.com/contact/).

== Installation ==

Requires WordPress 6.2 or later and PHP 7.4 or later.

1. In **Plugins > Add New**, search for **CCI Posts Carousel All In One**, install it and activate it. If you downloaded the ZIP, choose **Upload Plugin**.
2. Open the plugin dashboard and click **New carousel**. Choose the content and a template, check the preview and save.
3. Add the **CCI Posts Carousel All In One** block to your page and select the carousel. You can also paste its shortcode into a Shortcode block.
4. Preview the page on desktop and mobile, then publish it.

For a walkthrough, see the [getting started guide](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.2.2/).

== Frequently Asked Questions ==

= Can a slide show another image on hover? =

Yes, in the base plugin. Open **Design > Second image on hover**, enable **Show a second image on hover** and choose the content, WooCommerce gallery or manual source. The featured image stays primary. To override a slide, use Hover image URL in the slide editor. Paste an image URL or click Choose from media library. Save and check the page with a mouse. The second image loads on demand; touch screens and missing or failed images keep the primary image. This option is off by default.


= Can I keep selected slides first and update the rest automatically? =

Yes. Open Query > Content selection and choose Pinned slides + automatic fill. Set the post types, categories, ordering and Posts limit. Click the pin button on a preview card, then drag pinned cards into your preferred order. Save the carousel. With two pins and a limit of six, up to four matching posts follow the pins without repeating them. This option is included in the base plugin. Remove a pin to let that post return to automatic results when it matches the query.

= How do I update the plugin? =

Install the current package over the installed plugin and check existing carousels after clearing the site cache. For upgrades from a previous package name or from 1.x, follow the [installation and upgrade guide](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.2.2/installation/).

= Why did my carousels stop working after upgrading from 1.x to 2.x? =

Version 2.x is a rewrite of the plugin, including the carousel data model, editor, widgets and shortcode configuration. Settings from 1.x are not automatically converted. Open CCI Posts Carousel All In One > Dashboard, click New carousel, recreate each carousel, then save and publish it. Replace every old shortcode and select the new carousel in the current block or widget wherever it was displayed. Creating a replacement alone does not reconnect those placements. Clear cache after saving and check the published pages on desktop and mobile. The [upgrade guide](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.0.x/upgrading-from-1.x/) includes the steps and a screenshot of the new dashboard.

= Can I reuse the same carousel on several pages? =

Yes. Select the same saved carousel in the Gutenberg block or reuse its shortcode. Changes to that carousel apply everywhere it is used.

= Can I choose how the carousel looks on mobile? =

Yes. Use responsive settings to adjust the layout for different screen widths and check the result in the editor preview.

= Does it work if my theme already loads Owl Carousel or Swiper? =

Yes. Compatibility settings can disable bundled Owl assets, use a global Swiper instance and show warnings when another Owl/Swiper asset is detected.

= Is Pro required? =

No. The base plugin creates and renders content carousels, including linked cards for the WooCommerce `product` post type. Pro is needed for current store data, buying actions and the other paid tools listed above.

= Can templates and integrations be installed as add-ons? =

Other no-cost plugins can add templates or content sources. The paid WPC tools are already part of the single Pro plugin and are not bought as separate packages.

= Does the WordPress Popular Posts integration require another CCI add-on? =

No. The integration is built into the base plugin. Activate WordPress Popular Posts, then choose one of its ordering options in the carousel editor.

= Can developers change queries and output? =

Yes. The [developer documentation](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.2.2/) describes supported actions and filters for queries, templates and integrations.

= Why is my carousel empty? =

Check that the selected content is published, the chosen categories or tags contain matching items, and the item limit is greater than zero.

== Screenshots ==

1. Return to five recently edited carousels from Dashboard, with content details, publication status, update dates and saved previews.
2. Browse integrations that extend the available content sources and ordering options.
3. Compare installed templates and browse additional layouts. The demo includes Pro templates and optional extensions.
4. Control carousel libraries and icon assets, and set the default responsive breakpoints.
5. Choose the rendering engine and slide behavior, then drag cards to arrange the carousel sequence.
6. Pin selected posts first and fill the remaining places automatically.
7. Choose which card elements appear and set title and excerpt limits.
8. Search for existing content or add a custom image slide, then arrange its position in the sequence.
9. Configure frontend filters, performance options, field mapping and publishing behavior.
10. Preview article cards and test the carousel at different widths.
11. Two pinned posts lead this six-slide example. Four more are selected automatically; three cards are visible on desktop.
12. Present WordPress articles as image cards with excerpts and links to the full posts.
13. Aurora Cards is an optional template extension. The displayed prices, sale badges and Add to cart actions are supplied by Pro.
14. The optional Aurora Cards extension presents article images, excerpts and navigation.
15. The base plugin can show a second image on mouse hover. Touch screens retain the featured image.
16. Story Commerce combines a wide opening slide and supporting cards into a numbered shopping story. Included in Pro.
17. Video Showcase pairs the active video with a playlist of entries and timestamps. Included in Pro.
18. Commerce Luxe presents product images, sale prices, quantity controls and Add to cart buttons on a dark carousel background. Included in Pro.
19. Reorder pinned posts and let the query fill the remaining places without duplicate posts.
20. Set a second image for a manual slide by pasting its URL or choosing it from the media library.
21. Sort the full carousel collection, copy shortcodes and check updates and editors in separate columns.
22. Check creation dates, update dates, creators and recorded editors on the Information tab.

== External services ==

= Product news and catalog =

The plugin admin fetches news, templates and integrations from [Cool Cat Ideas](https://coolcatideas.com/) when its cached catalog needs refreshing. Requests include the product identifier, language and news limit. The service receives the server IP; catalog image hosts receive the browser IP and request headers. Feed requests do not add the site URL or WordPress version. Your saved carousels keep working if the service is unavailable. [Privacy policy](https://coolcatideas.com/privacy-policy/) | [Store terms](https://coolcatideas.com/terms-and-conditions/).

= Optional feedback =

Only when you accept the review consent and click **Save feedback**, the plugin sends your rating and comment to Cool Cat Ideas for moderation. The submission includes product and site context (versions, platform, website URL, language, environment and Pro status), the admin section, time, review-page preferences, consent details and a duplicate-prevention hash. [Privacy policy](https://coolcatideas.com/privacy-policy/).

= Optional icon CDN =

Icons are local by default. Choosing **CDN** in compatibility settings loads Font Awesome from BootstrapCDN or Tabler Icons from jsDelivr. These hosts receive the browser IP and request headers, potentially including the referrer. [CDN service](https://www.jsdelivr.com/) | [Privacy policy](https://www.jsdelivr.com/terms/privacy-policy) | [Terms of use](https://www.jsdelivr.com/terms/terms-of-use).

== Source code ==

[Plugin source](https://github.com/cool-cat-ideas/cci-posts-carousel-all-in-one) | [Build instructions](https://github.com/cool-cat-ideas/cci-posts-carousel-all-in-one/blob/main/docs/building-from-source.md) | [CCI Admin UI source (v1.0.0)](https://github.com/cool-cat-ideas/cci-admin-ui/tree/v1.0.0)

The plugin includes compiled JavaScript and CSS. The repositories above contain the readable sources and build tools; the product lockfile pins the shared UI packages.

== Changelog ==

= 2.2.3 =

* Update build dependencies.
* Prepare the base plugin for the upcoming Pro release.

= 2.2.2 =
* Reduce repeated template checks on pages with several carousels while preserving template filters, theme overrides and license checks.
* Reduce feature checks during rendering while preserving license checks for paid features and their dependencies.
* Return to recently edited carousels from a compact Dashboard table with saved content details and preview saved carousels without opening the editor. Manage, sort and copy shortcodes on the Carousels page, with separate update and editor columns.
* Check creation dates, update dates, creators and recorded editors on the Information tab in the carousel editor.

= 2.2.1 =

* Tested with WordPress 7.1.4.
* Fixed category and tag searches failing when integrations return term lists with numeric gaps. Failed searches now show a clear session, permission or server message and a retry button.
* Limited taxonomy suggestions to 50 results and preserved searches for the phrase "0".
* Fixed outdated manual-post search responses replacing newer results or reappearing after clearing the search.
* Fixed selected ordering labels disappearing after saving and reopening a carousel, including manual ordering and registered extension options.
* Fixed empty manual selections falling back to automatic posts and manual selections ignoring excluded posts.
* Excluded password-protected posts from automatic and manual carousel output, including full-content descriptions. Non-public post types cannot appear in public slides.

= 2.2.0 =

* Reduced layout shifts during startup: server-rendered cards keep their responsive layout while Owl or Swiper loads, and React placeholders remain visible until the engine is ready.
* Added theme overrides for Swiper control HTML: arrange arrows and pagination in your own markup without writing a slider implementation.
* Added vertical scrolling with a configurable viewport height for Swiper. Owl and two-row layouts keep horizontal scrolling.
* Added responsive loading skeletons for lazy-loaded and React-rendered carousels, with theme HTML overrides and loading-error retry controls.
* Fixed two-row startup on pages where another carousel has already loaded Owl styles.
* Fixed PHP templates displaying the author and publication date when those fields were disabled.
* Allow Pro compositions to reuse original template cards and the configured Owl or Swiper library without starting a second carousel instance.
* Added two-row carousels to Free: both rows move together, with separate phone row counts and spacing. Existing carousels keep one row.

= 2.1.1 =

* Simplified image settings in Design: choose the image file size next to its width and height, then choose whether to show the whole image or crop it. The second image on hover is also configured in Design.
* Category and tag filters above the carousel now use complete labels such as "All categories" and "All tags", translated into the visitor's language. These buttons clear the selection in their filter group.
* Fixed REST authorization so administrative requests are checked after authentication and cookie nonce validation.
* Restricted carousel operations to the correct post type and the user's permissions for that carousel.
* Removed editorial selection data from public REST responses to protect titles of unpublished content.

* Fixed automatic asset loading for the cci_posts_carousel shortcode alias, including Elementor content.
* Fixed React slide images ignoring the image fitting setting.
* Fixed carousel startup when responsive rules are empty or invalid. Empty carousel rules now inherit global settings, while the final global rule cannot be removed.
* Fixed image size overrides being replaced by per-post-type image settings.
* Added an image fitting setting for slide images: show the entire image or fill and crop. Existing carousels keep their template setting.
* New post and product carousels use large images by default to reduce thumbnail enlargement.

= 2.1.0 =
* Renamed WP Posts Carousel All In One to CCI Posts Carousel All In One following WordPress's decision about the plugin name and slug. Existing shortcodes, saved carousels, settings and license rights remain supported.
* Use normal page scrolling for long administration lists and editors, without extra sidebar scrollbars.
* Added optional image changes on mouse hover in the base plugin, with content, WooCommerce gallery and manual sources. Featured images remain primary; touch screens keep the primary image.
* Add pinned slides with automatic query fill in the base plugin.
* Preserve pin order and layout settings while keeping automatic results free of duplicate pinned posts.
* Count pinned and automatic slides within one total limit; skip unavailable pinned posts.
* Add pin actions and separate pinned/automatic previews in the editor.
* Show author and version on shared integration and template cards.
* Clarify extension registration and supported hooks in developer documentation.

= 2.0.4 =
* Apply separate autoplay, arrow and dot transition speeds in Swiper and the editor preview.
* Make Owl fade animations follow the selected transition duration.

= 2.0.3 =
* Find matching categories and tags as you type, with keyboard selection and individual remove buttons.
* Refresh query previews automatically when filters, ordering or the post limit change.
* Keep automatic queries separate from manual slide selections so newly published posts can appear.
* Fix taxonomy searches returning unrelated results.
* Clarify category selection, transition timing and query filter arguments.
* Separate version information from license verification dates and identify overdue verification.
* Keep category and tag suggestions visible outside the editor panels and within the viewport.

= 2.0.2 =
* Fix retrying a carousel after a temporary API or template stylesheet loading error.
* Reuse slide data when a REST response includes both JSON and HTML, avoiding a duplicate content query.
* Load only the template styles used on the page, including carousels added dynamically. Keep all template styles available in editor previews.
* Declare compatibility with WordPress 7.1.3.

= 2.0.1 =
* Fix child-theme template precedence. Incomplete overrides fall back to the bundled template.
* Exclude manifests without a usable PHP view from template discovery.
* Clarify settings, stylesheet overrides and supported extension contracts.

= 2.0.0 =
* Added a redesigned visual administration experience.
* Added dedicated carousel storage instead of relying on post meta.
* Added visual carousel editor with responsive settings and manual slide order.
* Added Owl Carousel and Swiper renderer support.
* Added compatibility controls for bundled Owl/Swiper assets.
* Added bundled templates and an add-on-ready template registry.
* Added Gutenberg block with saved-carousel selector, frontend filters, performance controls and custom field mapping.
* Added marketplace endpoint support for official Cool Cat Ideas product feeds.
* Added Pro-ready feature and license gating hooks.

== Upgrade Notice ==

= 2.2.1 =
Tested with WordPress 7.1.4. See the changelog for content selection, search and ordering fixes.
