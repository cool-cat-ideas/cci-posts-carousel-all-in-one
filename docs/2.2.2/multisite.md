# WordPress Multisite (Pro)

CCI Posts Carousel All In One Pro initializes storage, analytics and license checks per
network site. Saved carousel definitions and license tokens remain site-local.

## Setup

1. Network-activate Free and Pro.
2. Activate/check Pro from every site dashboard covered by the license.
3. Create carousels in the site that owns the source content.

A network super administrator can list sites and copy a saved definition to
selected targets. Every target is checked for its own active `multisite`
capability before the copy is created.

Open **Network Admin > Settings > Carousel Multisite**, choose a source site
and saved carousel, select target sites, and run the copy. Each successful
target receives an independent definition; partial failures are reported.

Query sources run against the target site's posts, terms and products. Manual
IDs are preserved, so review them after copying. A Multisite network does not
turn a one-site license into an unlimited license; activation limits still
follow the purchased plan.
