import { createCatalogComponents } from '@cci/admin-ui';
import { __ } from '../../i18n/i18n';

export const { CatalogEmptyState, CatalogGrid, CatalogProductCard } = createCatalogComponents(
  'wpCarousel',
  {
    labels: {
      author: __('Author', 'cci-posts-carousel'),
      requiresPro: __('Requires Pro', 'cci-posts-carousel'),
      installed: __('Installed', 'cci-posts-carousel'),
      available: __('Available', 'cci-posts-carousel'),
      viewInStore: __('View in store', 'cci-posts-carousel'),
      comingSoon: __('Coming soon', 'cci-posts-carousel'),
      tags: __('Tags', 'cci-posts-carousel'),
    },
  },
);
