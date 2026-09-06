import { createCatalogComponents } from '@cci/admin-ui';
import { __ } from '../i18n';

export const { CatalogEmptyState, CatalogGrid, CatalogProductCard } = createCatalogComponents('wpCarousel', {
    labels: {
        requiresPro: __('Requires Pro', 'wp-posts-carousel'),
        installed: __('Installed', 'wp-posts-carousel'),
        available: __('Available', 'wp-posts-carousel'),
        viewInStore: __('View in store', 'wp-posts-carousel'),
        comingSoon: __('Coming soon', 'wp-posts-carousel'),
        tags: __('Tags', 'wp-posts-carousel'),
    },
});
