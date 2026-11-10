# Connected carousels

> Pro preview. These features are in preparation and are not included in the base 2.2.0 download. Pro is not yet available to buy or download.


Connect an inspiration photo to a collection visitors can explore immediately.
For example, a home office shop can show three situations: a compact desk,
a space for focused work and a shared office. Selecting a scene shows its
assigned product carousel. The visitor can browse products without leaving
the inspiration section.

## Set up a group

1. Create and publish the individual carousels in the normal carousel editor.
   Choose their products or posts, ordering, template and responsive settings.
2. Open **CCI Posts Carousel All In One → Connected carousels**.
3. Select **Create connected carousel**, enter a group title and add 2 to 12 scenes.
4. For each scene choose an image, write a title and short description, and select
   the published carousel that belongs to it. The same carousel can be reused.
5. Set the group status to **Published**, save it and copy its shortcode:

```text
[cci_carousel_group id="123"]
```

Use the saved group's ID, not the ID of an individual carousel. Insert the
shortcode into a WordPress Shortcode block. Images attached to draft, private
or password protected content cannot be used for public scenes.

## How it works

The top carousel displays selectable scenes. On a phone, swipe it or use the
arrows. Selecting a scene shows the assigned carousel below; that carousel has
its own navigation and retains its normal product links and buying actions.
Arrow keys, Home and End navigate scene choices with keyboard focus.

Each group on the page works independently. Scene selection does not navigate
to another page or change an unrelated group. The same shortcode can be used
more than once. Without JavaScript, the scene links point to their collections
further down the page.

The group and its referenced carousels must be published. A carousel later
made private, password protected or moved to trash disappears from the group.
Deleting a group does not delete the carousels or images it references.
An active Pro license is required. The base plugin remains available separately.

This feature connects scenes to collections. The separate two-row card layout
is included in Free, under **General > Rows** in the individual carousel editor.
A connected group's child carousel can use that layout too. Pro adds the
relationship between an inspiration scene and its assigned collection.

## Home office demonstration

For a home office shop, assign a different collection to each scene:

- **A desk in a small apartment:** a desk lamp, phone dock and cable organizer.
- **A space for focused work:** headphones, a desk lamp and a coffee set.
- **An office for two:** a phone dock, headphones, a desk lamp and an organizer.

The benefit is concrete: visitors choose their situation before browsing
a relevant selection. A merchant can curate the collection instead of asking
visitors to find every accessory across separate categories.
The photos are inspiration images; the demonstration does not claim that the
sample catalog sells the exact furniture shown.

## Storage and access

Groups use WordPress posts and post metadata; no new database table or schema
migration is needed. The admin endpoints require the carousel settings
capability or WordPress administrator capability. Standard WordPress REST nonce
checks protect authenticated browser requests. Pro license checks also run
on the server when saving or deleting a group.
