# WP Posts Carousel - pricing strategy

Status: internal recommendation for product, checkout and LLM context.
Updated: 2026-07-15.
Primary currency: USD. Polish storefront prices use fixed PLN psychological
pricing, stored net in the Payload seed and displayed gross with Polish VAT.
Billing model: yearly recurring Stripe subscriptions unless noted otherwise.

These prices are commercial recommendations, not tax or accounting advice.
The business owner is a Polish JDG, so VAT/OSS, invoices, reverse charge and
Stripe settlement details should be confirmed with an accountant before launch.

## Recommended public prices

| Product | Scope | 1 site | 3 sites | Agency / unlimited |
| --- | --- | ---: | ---: | ---: |
| WP Posts Carousel All In One Pro | Complete Pro plugin: WooCommerce Products, Commerce Luxe, Story Commerce, Video Showcase, Elementor, analytics, autoplay indicators and Multisite | $79/year / 399 PLN gross | $149/year / 699 PLN gross | $299/year / 1299 PLN gross |

There is one commercial offer and one Pro ZIP. Do not introduce All Access,
template bundles or WooCommerce surcharges. The license tier changes only the
number of covered sites; every tier has the same feature set.

## No separately sold WPC modules

Commerce Luxe, Story Commerce, Video Showcase, Elementor and WooCommerce
Products are internal feature modules of `wp-posts-carousel-pro`. They remain
separate classes and template directories in source code, but are shipped in the
same ZIP, enabled by the same license and must not appear as separate store or
catalog purchases.

## Optional checkout services

| Service | Price | Billing |
| --- | ---: | --- |
| Installation and launch | $49 / 199 PLN gross | one-time |
| Additional technical intervention, up to 2 hours | $149 / 599 PLN gross | one-time |

These are optional checkout add-ons, not plugin licenses.

## Stripe and Polish JDG notes

- Use USD prices in Stripe Products/Prices for the international checkout.
- Show prices as tax-exclusive unless the storefront explicitly handles tax.
- Stripe is a payment processor, not automatically a merchant of record. For EU
  B2C digital sales, confirm VAT/OSS obligations or use a MoR platform.
- Stripe Poland standard card pricing is percentage plus fixed-fee based. As of
  2026-07-12, visible public pricing is 1.5% + 1.00 zl for standard EEA cards,
  2.5% + 1.00 zl for UK cards, 3.25% + 1.00 zl for international cards and an
  additional 2% when currency conversion is required.
- If settlement is not in USD, account for currency conversion in margin.
- Keep renewal pricing simple at launch. Existing seed data uses a 35% renewal
  discount; only expose it publicly if renewals are manual. For auto-renewing
  Stripe subscriptions, prefer same-price annual renewals and occasional coupons.

## Benchmark context checked

The pricing range is based on common WordPress premium plugin anchors checked on
2026-07-12:

- Slider Revolution pricing: https://account.sliderrevolution.com/portal/pricing/
- Smart Slider 3 pricing: https://smartslider3.com/pricing/
- MetaSlider pricing: https://www.metaslider.com/upgrade/
- Elementor pricing/reference plans: https://elementor.com/pricing/
- Stripe Poland pricing: https://stripe.com/en-pl/pricing

Visible anchors still support a $79/year Pro entry. Slider Revolution currently presents yearly licenses around EUR 45 for one
site, EUR 89 for 3 sites and EUR 209 for a 250-site Scale plan. Smart Slider 3
still anchors a one-time Standard plan at $49 and Premium around $99+. MetaSlider
shows a $79/year 1-site list price discounted to $39.50/year, with 5-site and
unlimited tiers discounted from $99/year and $199/year. Elementor remains a
broader builder reference rather than a direct carousel competitor, but confirms
that annual, site-count-based WordPress pricing is normal.

WP Posts Carousel should not race to the bottom because it includes a builder,
templates, Owl/Swiper rendering, WooCommerce use cases and Pro campaign layouts.

## Implementation guidance

- Keep USD and PLN values in `docs/api-seed-content.json` and Payload seeds aligned with this document.
- Public product copy should mention annual licenses, updates and support.
- Do not auto-convert local storefront prices exactly. Use fixed psychological
  pricing and keep PLN gross values consistent across product cards, product
  pages and checkout.
