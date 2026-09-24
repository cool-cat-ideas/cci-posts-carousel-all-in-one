import { ProductStatusPanel } from '@cci/admin-ui/product-panels';
import React from 'react';
import { ArrowRight, CheckCircle2, Crown } from 'lucide-react';
import { pluginData } from '../api';
import { __ } from '../i18n';
import { readableValue, useMarketplaceJson } from '../marketplace';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function LicensePanel({ license: controlledLicense }) {
    const productFeed = useMarketplaceJson(pluginData.marketplaceFeedEndpoint, {
        enabled: Boolean(pluginData.marketplaceFeedEndpoint),
    });
    const license = controlledLicense || pluginData.license || {};
    const isPro = license.status === 'active' || Boolean(pluginData.isPro);
    const hasProductFeed = Boolean(productFeed.data?.product) && productFeed.data?._meta?.source !== 'empty';
    const product = hasProductFeed ? productFeed.data?.product || {} : {};
    const upgradeUrl = readableValue(product?.pro?.url || pluginData.upgradeUrl);
    const installedVersion = readableValue(pluginData.pluginVersion);
    const latestVersion = readableValue(product?.latestVersion || product?.free?.version);
    const updateUrl = readableValue(
        product?.free?.urls?.download || product?.free?.urls?.wordpress || product?.pro?.url || pluginData.upgradeUrl
    );
    const ctaLabel = __('View Pro features', 'wp-posts-carousel');
    const ctaIcon = <ArrowRight aria-hidden='true' />;
    return (
        <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
            <ProductStatusPanel t={text => __(text, 'wp-posts-carousel')} isPro={isPro}
                licenseStatus={license.status} licenseMessage={license.message}
                installedVersion={installedVersion} latestVersion={latestVersion} updateUrl={updateUrl}
                checkedAt={license.checkedAt} nextCheckAt={license.nextCheckAt} adminDate={pluginData.adminDate} expires={license.expires} />

            {!isPro && (
                <Card className='tw-overflow-hidden tw-border-cci-wpc-brandBorder tw-bg-white'>
                    <div className='tw-grid tw-gap-4 tw-p-4'>
                        <div className='tw-flex tw-items-start tw-gap-3'>
                            <span
                                className='tw-inline-flex tw-h-10 tw-w-10 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-amber-200 tw-bg-amber-50 tw-text-amber-700 [&_svg]:tw-h-5 [&_svg]:tw-w-5'
                                aria-hidden='true'
                            >
                                <Crown />
                            </span>
                            <div className='tw-grid tw-min-w-0 tw-gap-1'>
                                <span className='tw-text-sm tw-font-semibold tw-leading-5 tw-text-amber-700'>
                                    {__('WP Posts Carousel Pro', 'wp-posts-carousel')}
                                </span>
                                <span className='tw-m-0 tw-block tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text'>
                                    {__('Build carousels that help visitors choose', 'wp-posts-carousel')}
                                </span>
                            </div>
                        </div>
                        <p className='tw-m-0 tw-max-w-[240px] tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                            {__(
                                'Add product data, commercial layouts, Elementor publishing and consent-aware engagement reports.',
                                'wp-posts-carousel'
                            )}
                        </p>
                        <ul className='tw-m-0 tw-grid tw-list-none tw-gap-2.5 tw-border-0 tw-p-0'>
                            {[
                                __('Premium carousel templates', 'wp-posts-carousel'),
                                __('Current WooCommerce data and buying actions', 'wp-posts-carousel'),
                                __('Elementor publishing and Multisite tools', 'wp-posts-carousel'),
                                __('Engagement analytics and autoplay progress', 'wp-posts-carousel'),
                            ].map((feature) => (
                                <li
                                    key={feature}
                                    className='tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-items-start tw-gap-2 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'
                                >
                                    <CheckCircle2
                                        className='tw-mt-0.5 tw-h-4 tw-w-4 tw-text-amber-500'
                                        aria-hidden='true'
                                    />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {upgradeUrl ? (
                            <Button variant='primary' className='cci-wpc-full' asChild>
                                <a href={upgradeUrl} target='_blank' rel='noreferrer'>
                                    {ctaLabel}
                                    {ctaIcon}
                                </a>
                            </Button>
                        ) : (
                            <Button variant='primary' className='cci-wpc-full' disabled>
                                {ctaLabel}
                                {ctaIcon}
                            </Button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
