# Installation

## Updating from 1.x

Version 2.x rewrites the carousel data model, editor, widgets and shortcode
configuration. Existing 1.x carousels are not automatically converted.
Recreate them in the new editor and replace every old placement with the new
shortcode or a block/widget selecting the new carousel. Follow
[Upgrade from 1.x to 2.x](./upgrading-from-1.x.md) before updating a live site.

## Requirements

- Declared WordPress compatibility: 6.2 through 7.1.4.
- PHP 7.4 or newer.
- Administrator access for plugin installation.
- For WooCommerce product carousels: WooCommerce installed and active.
- For Pro features: the compatible `cci-posts-carousel-pro` 2.0.x package and an active license. An already active Pro 2.0.0 under its previous package name is also supported during the rename update below.

## Base plugin

1. Download the current base ZIP from the [product page](https://coolcatideas.com/products/cci-posts-carousel-all-in-one/), then upload it in **Plugins > Add New > Upload Plugin**. If the previous WP Posts Carousel plugin is already installed, use the rename update procedure below.
2. Activate `CCI Posts Carousel All In One`.
3. Open `CCI Posts Carousel All In One` in the WordPress admin menu.
4. Follow [Getting started](./getting-started.md) to create and publish a saved carousel.
5. Follow [Publishing](./publishing.md) to add it to a page with the block or shortcode.

Manual filesystem install:

```text
wp-content/plugins/cci-posts-carousel/
```

After a manual upload, activate the plugin from the WordPress admin.

## Pro plugin

Install order:

```text
wp-content/plugins/
  cci-posts-carousel/
  cci-posts-carousel-pro/
```

1. Activate the base plugin first.
2. Activate **CCI Posts Carousel All In One Pro**.
3. Activate the domain license in the CCI Posts Carousel All In One sidebar. See [Activate Pro](./license-activation.md) for the steps.
4. Open a saved carousel. Commerce Luxe, Story Commerce, Video Showcase and WooCommerce product options are already included in this Pro plugin.
5. Select a saved carousel from the bundled Elementor widget when Elementor is active.

## Gutenberg and Elementor

The base plugin includes the Gutenberg block. The block shows a selector of saved carousels and renders the selected carousel in the editor and on the frontend.

Elementor integration is Pro. Install and activate **CCI Posts Carousel All In One Pro** before using the Elementor widget.

## Asset settings

The plugin can load bundled Owl Carousel, Swiper and FontAwesome assets or reuse assets already loaded by the theme. If a site already provides a library, configure the asset source in the plugin settings or use filters documented in [Filters and actions](./developer-api.md).

FontAwesome is registered under the plugin handle:

```text
wp-posts-carousel-font-awesome
```

Do not register a conflicting global handle such as `wp-font-awesome` from an add-on.

## Updating to 2.2.2

Update the base plugin in place. Existing 2.x carousels and their shortcodes stay
saved; do not uninstall the plugin to update it. Clear any cache that keeps old
JavaScript or CSS after replacing plugin files. Open Dashboard and Carousels,
then check a saved preview and a published placement. The base plugin and Pro
keep separate version numbers.

## Updates

The base plugin and Pro are updated separately and their version numbers do not
need to match. For the category autocomplete and automatic query previews in
this guide, use base plugin **2.0.3 or newer**.

Open **Dashboard > Updates** or **Plugins > Installed Plugins** in WordPress to
check for available updates. After updating, save a carousel and check its
published page. Please [contact support](./support.md#choose-the-right-support-channel)
if an expected update is missing, with the installed base and Pro versions.

Updating Pro updates its bundled commercial templates and integrations.

## Production domain checklist

CCI Posts Carousel All In One does not connect the domain. Domain routing belongs to WordPress, the host and DNS.

Before launch:

1. Point DNS records to the production host.
2. Set `home` and `siteurl` to the production domain.
3. Enable SSL and force HTTPS if the host supports it.
4. Regenerate permalinks.
5. Clear page cache and object cache.
6. Open each page that embeds a carousel and confirm images, videos, REST URLs and add-to-cart actions use the final domain.

If the site moved from staging, rebuild carousel demo URLs and custom slide links that were saved as absolute staging URLs.

## Uninstall

Deactivate Pro, then the base plugin if the site no longer uses the product.
Removing the base plugin also removes the runtime required by Pro.


## Updating from the previous package name

CCI Posts Carousel All In One was previously named WP Posts Carousel All In One. The name and package slug changed following WordPress’s decision about the plugin name and slug. Your saved carousel IDs, settings, Gutenberg blocks and existing `[wp_posts_carousel]` shortcodes remain supported. You can also use `[cci_posts_carousel]`.

### From the previous package name to 2.2.2

Update directly to 2.2.2; no intermediate release or carousel recreation is required. This procedure is different from the 1.x upgrade at the top of this page.

1. Make a restorable backup of your WordPress files and database. Try the update on a staging copy first.
2. Download `cci-posts-carousel-2.2.2.zip` from the product page. In **Plugins → Add New Plugin → Upload Plugin**, upload and install it. Leave the previous plugin installed and active during this step. The new `cci-posts-carousel` folder is separate from `wp-posts-carousel`; two plugin entries at this point are expected.
3. Click **Activate** for **CCI Posts Carousel All In One**. It switches WordPress from the old base package to the new one. Saved carousel IDs and settings stay in the same database. Do not manually deactivate or delete the old base plugin as a migration step.
4. If you use Pro, check that its license is active. Existing Pro 2.0.0 can remain active while you update to its renamed ZIP; the base and Pro version numbers do not need to match. Install and activate renamed Pro or add-on ZIPs when you have them. Each installed replacement switches its own previous package out of the active plugin list.
5. Clear the page cache and open the carousel list. Check a published page that already uses `[wp_posts_carousel]`, its images and navigation, and any Pro layouts or WooCommerce actions you use. Existing placements keep their IDs; you do not need to replace their shortcodes or re-enter an active license.
6. Keep your backup until the check is complete. Old inactive folders may remain while you verify the site. If you remove them later, use your hosting file manager or SFTP, after confirming that the renamed replacements are active. Do not click **Delete** on the old plugin entry in WordPress: its uninstall routine may remove shared saved data.

Pinning is available under **Query → Content selection → Pinned slides + automatic fill**. The optional second image is under **Design → Second image on hover** and is off by default. Updating does not enable it on existing carousels.

If a carousel is missing, check that you opened the same WordPress site and that its saved ID matches the shortcode. If you need to roll back, restore the files and database from the same backup.
