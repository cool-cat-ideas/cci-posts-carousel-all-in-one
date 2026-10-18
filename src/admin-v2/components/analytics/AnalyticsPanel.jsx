import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InfoCallout } from '@cci/admin-ui/wp-carousel';
import { carouselConfigurationStats } from '../../lib/carousel-statistics.mjs';
import { BarChart3, Eye, ExternalLink, Layers3, MousePointerClick, TrendingUp } from 'lucide-react';
import { apiFetch, pluginData } from '../../api/api';
import { __ } from '../../i18n/i18n';
import LoadingState from '../feedback/LoadingState';
import MetricCard from '../feedback/MetricCard';
import ProBadge from '../licensing/ProBadge';
import { Button } from '../ui/button';
import { Card, CardHeader } from '../ui/card';

export default function AnalyticsPanel({ setNotice }) {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);
    const load = useCallback(() => {
        setLoading(true);
        setError(false);
        apiFetch('/wp-json/wp-posts-carousel/v1/admin/carousels')
            .then((response) => {
                if (!Array.isArray(response)) throw new Error('Invalid carousel list response.');
                setCarousels(response);
            })
            .catch(() => {
                setError(true);
                setNotice({
                    type: 'error',
                    message: __('Failed loading analytics data.', 'cci-posts-carousel'),
                });
            })
            .finally(() => setLoading(false));
    }, [setNotice]);
    useEffect(load, [load]);

    const stats = useMemo(() => carouselConfigurationStats(carousels), [carousels]);

    if (loading) {
        return (
            <Card>
                <LoadingState label={__('Loading analytics...', 'cci-posts-carousel')} variant='block' rows={3} />
            </Card>
        );
    }

    if (error) {
        return <InfoCallout tone='error' title={__('Failed loading analytics data.', 'cci-posts-carousel')} actions={<Button onClick={load}>{__('Retry', 'cci-posts-carousel')}</Button>} />;
    }

    return (
        <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
            <Card>
                <div className='tw-grid tw-grid-cols-1 tw-gap-3 tw-p-4 lg:tw-grid-cols-3'>
                    <MetricCard
                        icon={Layers3}
                        label={__('Carousels', 'cci-posts-carousel')}
                        value={stats.total}
                        description={__('All saved carousel definitions', 'cci-posts-carousel')}
                        tone='primary'
                    />
                    <MetricCard
                        icon={BarChart3}
                        label={__('Published', 'cci-posts-carousel')}
                        value={stats.published}
                        description={`${__('Unpublished', 'cci-posts-carousel')}: ${stats.unpublished}`}
                    />
                    <MetricCard
                        icon={TrendingUp}
                        label={__('Manual slides', 'cci-posts-carousel')}
                        value={stats.totalSlides}
                        description={`${__('Average per manual carousel', 'cci-posts-carousel')}: ${stats.averageSlides}`}
                    />
                </div>

                <div className='tw-grid tw-grid-cols-1 tw-gap-3 tw-p-4 lg:tw-grid-cols-3'>
                    <Breakdown title={__('Engines', 'cci-posts-carousel')} items={stats.engines} />
                    <Breakdown title={__('Renderers', 'cci-posts-carousel')} items={stats.renderers} />
                    <Breakdown title={__('Templates', 'cci-posts-carousel')} items={stats.templates} />
                </div>
            </Card>

            {stats.invalidConfigs > 0 && <InfoCallout tone='warning' title={__('Some carousel settings could not be read.', 'cci-posts-carousel')}>{__('Configuration totals exclude unreadable settings.', 'cci-posts-carousel')}</InfoCallout>}

            <ProAnalyticsUpsell />
        </div>
    );
}

function Breakdown({ title, items }) {
    return (
        <div className='tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-4'>
            <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>{title}</strong>
            {items.length ? (
                <ul className='tw-m-0 tw-mt-3 tw-grid tw-list-none tw-gap-2 tw-p-0'>
                    {items.map(([label, count]) => (
                        <li
                            key={label}
                            className='tw-flex tw-items-center tw-justify-between tw-gap-3 tw-rounded-md tw-bg-cci-wpc-surfaceSoft tw-px-3 tw-py-2 tw-text-sm'
                        >
                            <span className='tw-min-w-0 tw-truncate tw-text-cci-wpc-muted'>{label}</span>
                            <b className='tw-font-semibold tw-text-cci-wpc-text'>{count}</b>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='tw-m-0 tw-mt-2 tw-text-sm tw-text-cci-wpc-muted'>{__('No data yet.', 'cci-posts-carousel')}</p>
            )}
        </div>
    );
}

function ProAnalyticsUpsell() {
    const upgradeUrl = pluginData.upgradeUrl || '';

    return (
        <Card>
            <CardHeader>
                <div>
                    <ProBadge />
                    <h2>{__('Engagement analytics', 'cci-posts-carousel')}</h2>
                    <p>
                        {__(
                            'Runtime tracking, retention controls, CTR reports and audience breakdowns are delivered by CCI Posts Carousel All In One Pro.',
                            'cci-posts-carousel'
                        )}
                    </p>
                </div>
                {upgradeUrl && (
                    <Button variant='outlineAccent' asChild>
                        <a href={upgradeUrl} target='_blank' rel='noreferrer'>
                            {__('View Pro features', 'cci-posts-carousel')}
                            <ExternalLink aria-hidden='true' />
                        </a>
                    </Button>
                )}
            </CardHeader>
            <div className='tw-grid tw-grid-cols-1 tw-gap-3 tw-p-4 lg:tw-grid-cols-3'>
                <ProMetric icon={Eye} label={__('Impressions', 'cci-posts-carousel')} />
                <ProMetric icon={MousePointerClick} label={__('Clicks', 'cci-posts-carousel')} />
                <ProMetric icon={TrendingUp} label={__('CTR trends', 'cci-posts-carousel')} />
            </div>
        </Card>
    );
}

function ProMetric({ icon: Icon, label }) {
    return (
        <div className='tw-relative tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-4'>
            <span
                className='tw-inline-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-brandBorder tw-bg-cci-wpc-brandSoft tw-text-cci-wpc-brand [&_svg]:tw-h-5 [&_svg]:tw-w-5'
                aria-hidden='true'
            >
                <Icon />
            </span>
            <div>
                <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>{label}</strong>
                <div className='tw-mt-1 tw-text-2xl tw-font-bold tw-leading-none tw-text-cci-wpc-text'>{__('Not available', 'cci-posts-carousel')}</div>
                <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                    {__('Available in Pro with optional frontend tracking.', 'cci-posts-carousel')}
                </p>
            </div>
            <ProBadge className='tw-absolute tw-right-3 tw-top-3' />
        </div>
    );
}
