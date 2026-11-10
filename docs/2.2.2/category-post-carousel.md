# Show WordPress posts from a category

Keep a homepage or a topic page supplied with relevant articles without selecting each new post by hand. A saved category query updates its results as matching posts are published.

Category selection and Gutenberg publishing are included in the free version of CCI Posts Carousel All In One. You do not need PHP or Pro for this workflow.

## Choose automatic selection or pinned stories

Use **Query (automatic)** when every position should follow the saved query. Use pinned slides with automatic fill when selected stories must stay at the beginning.

Pinned slides with automatic fill require base plugin 2.1.0 or newer. Category autocomplete and the query preview require 2.0.3 or newer.

[Open the pinned stories and category example](https://wordpress-demo.coolcatideas.com/cci-posts-carousel-demo/#wpc-demo-carousel-pinned-auto-fill).

The existing example has two pinned posts and a total limit of six. Posts from the **CCI Carousel Demo** category fill the remaining places. It demonstrates the pinned variant, not a purely automatic row. On your own website, choose your real category rather than copying the demo category name.

## Create an automatic category carousel

1. Open **CCI Posts Carousel All In One > Dashboard** and click **New carousel**.
2. Enter a name that describes the placement, such as `Homepage guides`.
3. Under **Query**, set **Content selection** to **Query (automatic)** and **Post types** to **Posts**.
4. Under **Taxonomy filters**, choose **Categories** and the **In** operator.
5. Type the category name in **Search categories** and select its suggestion. Typing text without selecting a result does not add the category.
6. Check **Query preview**. Set **Posts limit** to `6` and choose newest posts first.
7. Choose **Default** under **Design > Template** and set the [responsive item counts](./responsive-carousel.md).
8. Set the carousel status to **Published** and click **Save**.

## Keep selected stories first

To reproduce the pinned demo, change **Content selection** to **Pinned slides + automatic fill**, retaining the category query. Add two posts in **Slides** and arrange their order. Keep the total slide limit at six.

The pinned posts lead the row. The query supplies the remaining positions and avoids repeating pinned posts. If there are too few matching posts, the row can contain fewer than six items. A fully manual selection does not automatically pick up new articles.

## Add it in Gutenberg

1. Edit the destination WordPress page.
2. Insert the **CCI Posts Carousel All In One** block.
3. Select the saved carousel and publish or update the page.
4. Open the published page and check the article links.

Reusing the same saved carousel on another page keeps the query and design in sync. Create another saved carousel when a different category or order is needed.

## Check that the query stays current

Publish a test article in the selected category on your test site. Reload the carousel page after clearing any page cache. The article should enter the automatic results according to the selected order and limit; pinned posts should stay first.

If the row is empty, check the category selection, post publication status, post type and other taxonomy filters. Use **Query preview** to separate content selection problems from frontend display problems.

[Read the query and selection settings](./settings-reference.md) or [view the product](https://coolcatideas.com/products/cci-posts-carousel-all-in-one/).
