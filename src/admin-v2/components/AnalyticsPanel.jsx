import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Eye, ExternalLink, Layers3, MousePointerClick, TrendingUp } from 'lucide-react';
import { apiFetch, pluginData } from '../api';
import { __ } from '../i18n';
import LoadingState from './LoadingState';
import MetricCard from './MetricCard';
import ProBadge from './ProBadge';
import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';

function parseConfig(carousel) {
    try {
        return carousel.params ? JSON.parse(carousel.params) : {};
    } catch (error) {
        return {};
    }
}

function countBy(items, callback) {
    return items.reduce((result, item) => {
        const key = callback(item) || __('Unknown', 'wp-posts-carousel');
        result[key] = (result[key] || 0) + 1;

        return result;
    }, {});
}

function labelValue(value, fallback = __('Unknown', 'wp-posts-carousel')) {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }

    if (Array.isArray(value)) {
        const labels = value.map((item) => labelValue(item, '')).filter(Boolean);
        return labels.length ? labels.join(', ') : fallback;
    }

    if (typeof value === 'object') {
        return value.label || value.title || value.template_name || value.name || value.value || value.slug || fallback;
    }

    return String(value);
}

function getConfigValue(config, keys, fallback) {
    for (const key of keys) {
        const value = key.split('.').reduce((current, part) => current?.[part], config);

        if (value !== null && value !== undefined && value !== '') {
            return labelValue(value, fallback);
        }
    }

    return fallback;
}

function topEntries(value) {
    return Object.entries(value).sort((first, second) => second[1] - first[1]);
}

function numberValue(value) {
    return Number(value || 0).toLocaleString();
}

export default function AnalyticsPanel({ setNotice }) {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/wp-json/wp-posts-carousel/v1/admin/carousels')
            .then((response) => setCarousels(Array.isArray(response) ? response : []))
            .catch(() => {
                setCarousels([]);
                setNotice({
                    type: 'error',
                    message: __('Failed loading analytics data.', 'wp-posts-carousel'),
                });
            })
            .finally(() => setLoading(false));
    }, [setNotice]);

    const stats = useMemo(() => {
        const configs = carousels.map((carousel) => ({
            carousel,
            config: parseConfig(carousel),
        }));
        const published = carousels.filter((carousel) => carousel.post_status === 'publish').length;
        const slideCounts = configs.map((item) => item.config?.post_selection_options?.posts?.length || 0);
        const totalSlides = slideCounts.reduce((sum, value) => sum + value, 0);

        return {
            total: carousels.length,
            published,
            drafts: Math.max(0, carousels.length - published),
            totalSlides,
            averageSlides: carousels.length ? Math.round((totalSlides / carousels.length) * 10) / 10 : 0,
            engines: topEntries(
                countBy(configs, (item) =>
                    getConfigValue(
                        item.config,
                        ['carousel_type', 'carousel_engine', 'engine.name', 'engine', 'carousel_options.engine'],
                        'owl-carousel'
                    )
                )
            ),
            renderers: topEntries(
                countBy(configs, (item) =>
                    getConfigValue(
                        item.config,
                        ['renderer', 'frontend_renderer', 'rendering.renderer'],
                        __('PHP renderer', 'wp-posts-carousel')
                    )
                )
            ),
            templates: topEntries(
                countBy(configs, (item) =>
                    getConfigValue(
                        item.config,
                        ['template.name', 'template', 'template_name', 'display_options.template', 'layout.template'],
                        __('Default Template', 'wp-posts-carousel')
                    )
                )
            ),
        };
    }, [carousels]);

    if (loading) {
        return (
            <Card>
                <LoadingState label={__('Loading analytics...', 'wp-posts-carousel')} variant='block' rows={3} />
            </Card>
        );
    }

    return (
        <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
            <Card>
                <div className='tw-grid tw-grid-cols-1 tw-gap-3 tw-p-4 lg:tw-grid-cols-3'>
                    <MetricCard
                        icon={Layers3}
                        label={__('Carousels', 'wp-posts-carousel')}
                        value={stats.total}
                        description={__('All saved carousel definitions', 'wp-posts-carousel')}
                        tone='primary'
                    />
                    <MetricCard
                        icon={BarChart3}
                        label={__('Published', 'wp-posts-carousel')}
                        value={stats.published}
                        description={`${__('Drafts', 'wp-posts-carousel')}: ${stats.drafts}`}
                    />
                    <MetricCard
                        icon={TrendingUp}
                        label={__('Manual slides', 'wp-posts-carousel')}
                        value={stats.totalSlides}
                        description={`${__('Average per carousel', 'wp-posts-carousel')}: ${stats.averageSlides}`}
                    />
                </div>

                <div className='tw-grid tw-grid-cols-1 tw-gap-3 tw-p-4 lg:tw-grid-cols-3'>
                    <Breakdown title={__('Engines', 'wp-posts-carousel')} items={stats.engines} />
                    <Breakdown title={__('Renderers', 'wp-posts-carousel')} items={stats.renderers} />
                    <Breakdown title={__('Templates', 'wp-posts-carousel')} items={stats.templates} />
                </div>
            </Card>

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
                    {items.slice(0, 5).map(([label, count]) => (
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
                <p className='tw-m-0 tw-mt-2 tw-text-sm tw-text-cci-wpc-muted'>{__('No data yet.', 'wp-posts-carousel')}</p>
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
                    <h2>{__('Engagement analytics', 'wp-posts-carousel')}</h2>
                    <p>
                        {__(
                            'Runtime tracking, retention controls, CTR reports and audience breakdowns are delivered by WP Posts Carousel Pro.',
                            'wp-posts-carousel'
                        )}
                    </p>
                </div>
                {upgradeUrl && (
                    <Button variant='outlineAccent' asChild>
                        <a href={upgradeUrl} target='_blank' rel='noreferrer'>
                            {__('View Pro features', 'wp-posts-carousel')}
                            <ExternalLink aria-hidden='true' />
                        </a>
                    </Button>
                )}
            </CardHeader>
            <div className='tw-grid tw-grid-cols-1 tw-gap-3 tw-p-4 lg:tw-grid-cols-3'>
                <ProMetric icon={Eye} label={__('Impressions', 'wp-posts-carousel')} />
                <ProMetric icon={MousePointerClick} label={__('Clicks', 'wp-posts-carousel')} />
                <ProMetric icon={TrendingUp} label={__('CTR trends', 'wp-posts-carousel')} />
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
                <div className='tw-mt-1 tw-text-2xl tw-font-bold tw-leading-none tw-text-cci-wpc-text'>{numberValue(0)}</div>
                <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                    {__('Available in Pro with optional frontend tracking.', 'wp-posts-carousel')}
                </p>
            </div>
            <ProBadge className='tw-absolute tw-right-3 tw-top-3' />
        </div>
    );
}
