import React, { useEffect, useState } from 'react';
import { Bell, Megaphone } from 'lucide-react';
import { formatAdminDateTime } from '@cci/admin-ui/wp-carousel';
import { pluginData } from '../api';
import { __ } from '../i18n';
import { collectionFromResponse, readableValue, useMarketplaceJson } from '../marketplace';
import LoadingState from './LoadingState';
import MarketplaceStatus from './MarketplaceStatus';
import { Card, CardHeader } from './ui/card';

export default function NewsPanel() {
    const remoteNewsEndpoint = pluginData.newsEndpoint || pluginData.marketplaceFeedEndpoint;
    const hasRemoteNews = Boolean(remoteNewsEndpoint);
    const [news, setNews] = useState([]);
    const newsFeed = useMarketplaceJson(remoteNewsEndpoint, {
        enabled: hasRemoteNews,
    });

    useEffect(() => {
        if (!newsFeed.data) {
            return;
        }

        const docs = collectionFromResponse(newsFeed.data, [
            'announcements',
            'news',
            'releaseNotes',
            'productAnnouncements',
        ]);
        const nextNews = docs.map((item) => normalizeNews(item, pluginData.adminDate)).filter(Boolean);

        setNews(nextNews.length ? nextNews.slice(0, 4) : []);
    }, [newsFeed.data]);

    const loading = newsFeed.loading;

    return (
        <Card>
            <CardHeader>
                <div className='tw-flex tw-items-center tw-gap-3'>
                    <span
                        className='tw-inline-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-brandBorder tw-bg-cci-wpc-brandSoft tw-text-cci-wpc-brand [&_svg]:tw-h-4 [&_svg]:tw-w-4'
                        aria-hidden='true'
                    >
                        <Bell aria-hidden='true' />
                    </span>
                    <div className='tw-min-w-0'>
                        <h2 className='tw-m-0 tw-grid tw-gap-0.5 tw-leading-tight'>
                            <span className='tw-text-sm tw-font-normal tw-leading-tight tw-text-cci-wpc-text'>
                                {__('News', 'wp-posts-carousel')}
                            </span>
                            <span className='tw-text-xl tw-font-semibold tw-leading-6 tw-text-cci-wpc-brand'>
                                Cool Cat Ideas
                            </span>
                        </h2>
                    </div>
                </div>
            </CardHeader>

            {loading ? (
                <LoadingState label={__('Loading updates...', 'wp-posts-carousel')} variant='news' />
            ) : (
                <div className='tw-grid tw-gap-3 tw-p-4'>
                    <MarketplaceStatus
                        error={newsFeed.error}
                        retrying={newsFeed.retrying}
                        onRefresh={newsFeed.refresh}
                        label={__('Product updates could not be loaded.', 'wp-posts-carousel')}
                        description={__(
                            'The plugin will retry automatically. No placeholder updates will be shown while the store is unavailable.',
                            'wp-posts-carousel'
                        )}
                        showDetails={false}
                    />
                    {news.length ? (
                        news.map((item) => (
                            <article
                                key={item.id || item.title}
                                className='tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3'
                            >
                                <span
                                    className='tw-inline-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-md tw-bg-cci-wpc-brand tw-text-white [&_svg]:tw-h-4 [&_svg]:tw-w-4'
                                    aria-hidden='true'
                                >
                                    <Megaphone />
                                </span>
                                <div>
                                    <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                        {item.title}
                                    </strong>
                                    <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                                        {item.excerpt}
                                    </p>
                                </div>
                                {item.date && (
                                    <time className='tw-col-start-2 tw-text-xs tw-leading-none tw-text-cci-wpc-muted'>
                                        {item.date}
                                    </time>
                                )}
                            </article>
                        ))
                    ) : (
                        <div className='tw-grid tw-min-h-32 tw-place-items-center tw-gap-2 tw-p-6 tw-text-center'>
                            <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                {__('No product updates yet.', 'wp-posts-carousel')}
                            </strong>
                            <p className='tw-m-0 tw-text-sm tw-text-cci-wpc-muted'>
                                {__('When your store publishes plugin news, it will appear here.', 'wp-posts-carousel')}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

function normalizeNews(item, adminDate) {
    if (!item || typeof item !== 'object') {
        return null;
    }

    return {
        id: item.id || item.slug || item.title,
        title: readableValue(item.title || item.name),
        excerpt: readableValue(item.excerpt || item.summary || item.description || item.content),
        date: normalizeDate(item.publishedAt || item.createdAt || item.date || item.updatedAt, adminDate),
    };
}

function normalizeDate(value, adminDate) {
    if (!value) {
        return '';
    }

    return formatAdminDateTime(value, adminDate, false);
}
