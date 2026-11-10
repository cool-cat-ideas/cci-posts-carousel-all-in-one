# External extension API

Use this contract only for an independently maintained template, data source or renderer that is not part of the CCI Posts Carousel All In One Pro license.

## Package layout

Keep every feature in a clearly named class and give templates their own directory:

```text
my-wpc-extension/
  my-wpc-extension.php
  includes/
    class-my-wpc-extension-feature.php
  assets/
  templates/
    my-template/
      template.json
      views/template.php
      assets/css/style.css
```

Register templates with `wp_posts_carousel_templates_paths`, extend slide data with `wp_posts_carousel_slide_view_model` and use namespaced feature keys. Never reuse the reserved keys of modules bundled with Pro.

An external commercial extension must let the encoded Pro plugin make the final license decision. It must not copy the Pro license runtime, store raw license keys or unlock reserved Pro features by itself.

For general filters, actions, arguments and examples, see [Filters and actions](./developer-api.md). For packaging and distribution, see [Extensions](./extensions.md).
