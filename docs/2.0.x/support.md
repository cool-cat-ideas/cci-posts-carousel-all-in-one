# Support

If something is unclear or a carousel is not working as expected, we are happy
to help. You can describe what you see in your own words. You do not need to
find the cause before asking.

## Choose the right support channel

| What you need | Where to go |
| --- | --- |
| A usage question or a problem you can describe publicly | [Open a CCI Posts Carousel All In One issue on GitHub](https://github.com/cool-cat-ideas/cci-posts-carousel-all-in-one/issues/new). Questions are welcome too. |
| Help with an existing WordPress.org topic | [CCI Posts Carousel All In One support forum](https://wordpress.org/support/plugin/wp-posts-carousel/). Please continue in your existing topic rather than posting the same request twice. |
| A licence, order or private support request | [Services and support in your Cool Cat Ideas account](https://coolcatideas.com/en/account/services/). |
| An unclear instruction or broken documentation link | Use **Report an issue** on the [online documentation page](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.0.x/support/). It opens the documentation feedback form and includes the page address. |
| A security vulnerability | [Email info@coolcatideas.com](mailto:info@coolcatideas.com). Please keep vulnerability details out of public issues. |

### Ask a question or report a problem publicly

1. Open the [GitHub issue form](https://github.com/cool-cat-ideas/cci-posts-carousel-all-in-one/issues/new) and sign in to GitHub if asked.
2. Enter a short title, for example `Category suggestions do not appear`.
3. Describe what you wanted to do, the steps you tried and what happened instead.
4. Add your installed plugin version and a screenshot if it helps explain the problem.
5. Submit the issue. You can read and reply to our messages in that same issue.

If you prefer WordPress.org, open the [support forum](https://wordpress.org/support/plugin/wp-posts-carousel/)
and choose **Log in to Create a Topic**. Use your WordPress.org account there;
it is separate from your Cool Cat Ideas account.

### Send a private request

1. Open [Services and support](https://coolcatideas.com/en/account/services/) and sign in with your purchase account.
2. Under **Contact the team**, choose **General question** for an order or licence question, or **Technical support for a licence** when your licence includes active support.
3. For technical support, choose the relevant **Licence**. Add a subject, describe the issue and attach a screenshot if useful.
4. Click **Send message**. The conversation opens after submission; you can also find it later under **Your conversations** on the same account page.

If the technical support option is unavailable, you can still send a general
question. For a purchased installation or technical intervention, open that
service under **Purchased services** and continue in its linked conversation.

Please keep passwords, access tokens, full licence keys and customer data out
of messages and screenshots. Selecting your licence in the account form is
enough to identify it.

## Information that helps us

Start with the steps you tried and what you expected to see. These details are
helpful when available:

- **Installed version:** open **Plugins > Installed Plugins** in WordPress and find CCI Posts Carousel All In One. Include the Pro version too if Pro is installed.
- **Affected carousel:** open **CCI Posts Carousel All In One > Dashboard** and copy its name or the shortcode from the **Shortcode** column.
- **Screenshot:** capture the affected editor tab or the part of the page that looks wrong. Please hide private details first.
- **Page address:** share a public example when possible. If the page is private, mention that in your private request instead.
- **What changed:** tell us whether the issue started after an update, theme change or site move.

For a phone layout issue, the phone model or approximate screen width helps.
You can leave out technical details you do not know; we can ask for them later.

## Diagnostics for a developer or site administrator

Open **CCI Posts Carousel All In One > Settings > Diagnostics** to inspect the recorded
messages. A screenshot of a relevant error can help us; there is no need to
understand every entry before contacting support.

If you are comfortable collecting more detail, include the selected engine and
renderer under **General**, the template name, WordPress/PHP versions, theme
name and any browser console error. REST integration details are in
[Filters and actions](./hooks-and-api.md). Admin REST requests need WordPress
authentication and a REST nonce; opening an admin endpoint URL alone may
return a permission error.

## License issues

For Pro activation issues, include the displayed error message and the domain
shown in the license panel. Please send these through the
[private account form](https://coolcatideas.com/en/account/services/).

You do not need to paste the licence key into the message. See
[Activate Pro](https://coolcatideas.com/docs/cci-posts-carousel-all-in-one/2.0.x/license-activation/) for the activation steps.

## Domain and migration issues

CCI Posts Carousel All In One stores carousel definitions in WordPress and renders them on the current site domain. It does not change DNS, SSL or WordPress domain settings.

After changing a site domain:

- confirm WordPress `home` and `siteurl`,
- regenerate permalinks,
- clear caches,
- check custom slide URLs saved in manual carousels,
- check YouTube, Vimeo and direct video URLs,
- check product CTA URLs if WooCommerce products were imported or migrated,
- inspect REST responses for stale staging domains.

If a carousel works in the editor but not on its page after a move, use the
[private account form](https://coolcatideas.com/en/account/services/) and include
the old domain, new domain and one affected carousel name or shortcode.

## Paid services

Installation and technical intervention are optional services for work on a
particular site. They are separate from licence support and are not required
to ask a public question. See the
[product page](https://coolcatideas.com/products/cci-posts-carousel-all-in-one/)
for available services. After purchase, delivery details and messages are kept
under [Services and support](https://coolcatideas.com/en/account/services/).
