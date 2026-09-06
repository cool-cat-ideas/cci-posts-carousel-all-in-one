# Frontend Extension Contract

WP Posts Carousel renders SEO-friendly PHP markup first. JavaScript enhancements are progressive and load only when a carousel enters the viewport.

## PHP renderer registration

Add-ons can allow additional shortcode renderer names:

```php
add_filter('wp_posts_carousel_frontend_renderers', function ($renderers) {
    $renderers[] = 'my_renderer';

    return $renderers;
});
```

Add-ons can expose renderer choices in the admin UI:

```php
add_filter('wp_posts_carousel_frontend_renderers_dictionary', function ($renderers) {
    $renderers[] = array(
        'name' => 'my_renderer',
        'label' => __('My renderer', 'my-addon'),
        'description' => __('Custom frontend enhancement loaded by my add-on.', 'my-addon'),
        'feature' => 'my_renderer',
        'enabled' => true,
    );

    return $renderers;
});
```

They can also choose a renderer dynamically:

```php
add_filter('wp_posts_carousel_frontend_renderer', function ($renderer, $config, $atts) {
    return $renderer;
}, 10, 3);
```

## JavaScript runtime

The public runtime is available as:

```js
window.wpPostsCarousel
```

It exposes:

- `hooks.addAction(name, namespace, callback, priority)`
- `hooks.doAction(name, ...args)`
- `hooks.addFilter(name, namespace, callback, priority)`
- `hooks.applyFilters(name, value, ...args)`
- `registerRenderer(name, renderer)`
- `getRenderer(name)`
- `mountRenderer(name, element, carousel)`

Renderer can be an object with `mount` or a mount function:

```js
window.wpPostsCarousel.registerRenderer('my_renderer', {
    mount(element, carousel, runtime) {
        element.classList.add('cci-wpc-my-renderer-enhanced');
    },
});
```

## Lazy loading and control metrics

Frontend enhancement is lazy-loaded with `IntersectionObserver`. Carousels with
`data-wpc-api` mount their renderer when they approach the viewport (`rootMargin:
220px 0px`). If `IntersectionObserver` is not available, the runtime loads them
immediately.

The shortcode also accepts `lazy="true"`. In this mode PHP emits an empty,
height-reserved carousel root and the loader inserts the REST-rendered HTML when
the placement approaches the viewport. This is intended for below-the-fold
placements; keep the first meaningful carousel server-rendered.

The loader also synchronizes carousel control geometry for PHP/Owl and React/Swiper
markup. It observes each carousel root and writes these CSS custom properties:

- `--wpc-control-axis-y` - vertical center of `.owl-stage-outer` or
  `.cci-wpc-render-preview-viewport` relative to the carousel root.

Template CSS should use these variables for arrow placement instead of hard-coding
the midpoint of the whole carousel wrapper. This keeps arrows aligned to the actual
slide viewport when headings, metadata or descriptions change the root height.
Template-specific geometry variables should be written by the template package
itself.

For templates with visible card borders, keep clipping and border buffering local to
the template scope. A template may add a small internal viewport buffer to avoid
clipped borders, but it must also prevent inactive Owl/Swiper slides from visibly
bleeding into the viewport.

## Frontend hooks

Available hook names:

- `carouselData` filter: receives REST payload before it is stored on the element.
- `carouselRenderer` filter: receives renderer name before mounting.
- `carouselReady` action: fires after REST data is loaded.
- `carouselError` action: fires when REST or renderer loading fails.
- `rendererRegistered` action: fires when a renderer is registered.
- `rendererMounted` action: fires after a renderer mounts.

Example:

```js
window.wpPostsCarousel.hooks.addFilter(
    'carouselRenderer',
    'my-addon/use-renderer',
    function (rendererName, element, carousel) {
        if (element.dataset.wpcTemplate === 'my-template') {
            return 'my_renderer';
        }

        return rendererName;
    }
);
```
