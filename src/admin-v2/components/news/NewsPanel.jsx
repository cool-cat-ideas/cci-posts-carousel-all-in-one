import React from 'react';
import { ProductNewsView, normalizeProductNews } from '@cci/admin-ui/product-panels';
import { pluginData } from '../../api/api';
import { __ } from '../../i18n/i18n';
import { useMarketplaceJson } from '../../catalog/marketplace';

export default function NewsPanel() {
  // The WordPress proxy needs the authenticated REST transport.
  const feed = useMarketplaceJson(pluginData.newsEndpoint || pluginData.marketplaceFeedEndpoint);
  const unavailable = Boolean(
    feed.error ||
    feed.data?._meta?.stale ||
    feed.data?._meta?.ok === false ||
    feed.data?._meta?.source === 'empty' ||
    (!feed.loading && !Array.isArray(feed.data?.news)),
  );
  const news = unavailable
    ? []
    : normalizeProductNews(
        feed.data?.news || [],
        pluginData.adminDate?.locale,
        pluginData.adminDate,
      );
  return (
    <ProductNewsView
      t={(text) => __(text, 'cci-posts-carousel')}
      news={news}
      loading={feed.loading}
      error={unavailable ? feed.error || 'Feed unavailable' : ''}
      retrying={feed.retrying}
      onRefresh={() => feed.refresh()}
    />
  );
}
