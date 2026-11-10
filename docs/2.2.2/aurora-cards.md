# Aurora Cards template

Aurora Cards for CCI Posts Carousel is a standalone product distributed without a paid license. It gives posts,
pages, manual items and WooCommerce products the same card style, with a soft
aurora background, a clear content order and compact pill actions.

## Install and use it

1. Install and activate **CCI Posts Carousel All In One 2.0.0 or newer**.
2. Install and activate **Aurora Cards for CCI Posts Carousel**.
3. Open **CCI Posts Carousel All In One > Dashboard** and create a carousel or edit an existing one.
4. Under **General**, use the **PHP** renderer and **Owl Carousel** engine. Aurora Cards does not supply a Swiper/React template.
5. Under **Query**, choose the content types and filters for an automatic selection, or choose **Manual slides** and add items under **Slides**.
6. Under **Design > Template**, select **Aurora Cards**.
7. Set **Status** to **Published** and save the carousel.
8. Add the main plugin's Gutenberg block to a page and select your saved carousel, or paste its generated shortcode into a **Shortcode** block. Publish the page and check it as a visitor. See [Publishing](./publishing.md).

Under **General > Responsive items**, set the number of visible cards for the available page width. Use fewer cards in a narrow content column. Navigation and autoplay settings are also under **General**. Choose visible titles, descriptions, images, categories and tags under **Design**.

Add featured images and excerpts to your posts. Aurora Cards uses a placeholder when an image is unavailable. A fresh site needs published content or manual slides before the carousel can display cards.

Aurora Cards works without Pro or a licence key and does not add a separate settings page. Activating it does not create or publish a carousel automatically.

If the template is missing, check **Plugins > Installed Plugins**: both Aurora Cards and CCI Posts Carousel 2.0.0 or newer must be active. Reload the editor after activation and check the PHP/Owl settings. If the carousel is empty, check its publication status, query filters and selected slides, then confirm that the page block or shortcode uses the correct saved carousel.

For help, [open a support request](./support.md#choose-the-right-support-channel) with both installed plugin versions and a screenshot of **Design > Template**.

## Base and Pro behavior

The template keeps the same base/Pro boundary as the main plugin:

- The base plugin renders post cards and generic product cards linking to product pages.
- Pro supplies live WooCommerce price, rating, sale state and add-to-cart data.
- The same template PHP handles both variants; missing commercial fields are
  treated as optional.
- Enabled categories and tags link to their public WordPress archive pages.
- Taxonomy links, titles, media, actions and navigation provide visible pointer
  hover and keyboard focus states.
- The second live Aurora example enables Owl dots, autoplay and the optional Pro
  progress indicator to demonstrate the responsive control styling.

## Live examples

- [Aurora Editorial Cards](https://wordpress-demo.coolcatideas.com/wp-posts-carousel-demo/#wpc-demo-carousel-aurora-blog-showcase): article cards that work without Pro.
- [Aurora Product Cards](https://wordpress-demo.coolcatideas.com/wp-posts-carousel-demo/#wpc-demo-carousel-aurora-products-showcase): optional WooCommerce prices and cart actions supplied by Pro.

## Package structure

```text
aurora-cards-for-cci-posts-carousel/
  aurora-cards-for-cci-posts-carousel.php
  templates/
    aurora-cards/
      template.json
      views/template.php
      assets/css/style.css
      screenshot.png
```

The entrypoint registers its template root with
`wp_posts_carousel_templates_paths`. The template reads the standard public
slide payload, so projects can enrich it with
`wp_posts_carousel_slide_view_model` without coupling the template to a private
service class.

## Change slide data

```php
add_filter(
    'wp_posts_carousel_slide_view_model',
    function (array $slide, WP_Post $post, array $params, array $config): array {
        if (($config['template']['name'] ?? '') !== 'aurora-cards') {
            return $slide;
        }

        $slide['display']['eyebrow'] = get_post_meta($post->ID, 'eyebrow', true);

        return $slide;
    },
    10,
    4
);
```

The filter receives and returns the public slide array. Keep custom keys
optional so posts, products and manual items continue to render safely.
