import React, { useEffect, useMemo, useState } from 'react';
import { reconcileCatalogItems } from '@cci/admin-ui';
import { BadgeCheck, Plug, ShoppingBag } from 'lucide-react';
import { apiFetch, pluginData } from '../api';
import { __ } from '../i18n';
import {
    collectionFromResponse,
    isPaidProduct,
    mediaUrl,
    productUrl,
    readableValue,
    useMarketplaceJson,
} from '../marketplace';
import { CatalogEmptyState, CatalogGrid, CatalogProductCard } from './CatalogCards';
import LicensePanel from './LicensePanel';
import LoadingState from './LoadingState';
import MarketplaceStatus from './MarketplaceStatus';
import MetricCard from './MetricCard';
import ProUpgradeModal from './ProUpgradeModal';
import ReviewPrompt from './ReviewPrompt';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

const installedTab = 'installed';
const storeTab = 'store';

export default function IntegrationsPanel({ license, onLicenseChange, onOpenSettings, setNotice }) {
    const [activeTab, setActiveTab] = useState(installedTab);
    const [features, setFeatures] = useState({});
    const [installedLoading, setInstalledLoading] = useState(true);
    const [storeIntegrations, setStoreIntegrations] = useState([]);
    const [proFeature, setProFeature] = useState(null);
    const storeFeed = useMarketplaceJson(pluginData.integrationStoreEndpoint, {
        enabled: Boolean(pluginData.integrationStoreEndpoint),
    });

    const loadInstalled = () => {
        setInstalledLoading(true);
        apiFetch('/wp-json/wp-posts-carousel/v1/admin/defaultSettings')
            .then((response) => setFeatures(response?.features || {}))
            .catch(() => {
                setNotice({
                    type: 'error',
                    message: __('Failed loading integrations.', 'wp-posts-carousel'),
                });
            })
            .finally(() => setInstalledLoading(false));
    };

    useEffect(() => {
        loadInstalled();
    }, []);

    useEffect(() => {
        if (!storeFeed.data) {
            return;
        }

        const integrations = collectionFromResponse(storeFeed.data, [
            'extensions',
            'integrations',
            'productCatalogItems',
            'catalogItems',
            'items',
        ]);

        setStoreIntegrations(integrations.map(normalizeStoreIntegration).filter(Boolean));
    }, [storeFeed.data]);

    const integrations = useMemo(() => normalizeIntegrations(features), [features]);
    const installed = useMemo(() => {
        const addOns = integrations.filter((integration) => integration.installed);

        if (!pluginData.isPro) {
            return addOns;
        }

        return [
            {
                key: 'wp-posts-carousel-pro',
                label: 'WP Posts Carousel All In One Pro',
                description: __('Core Pro product and license for premium carousel modules.', 'wp-posts-carousel'),
                enabled: true,
                source: 'product',
                plan: 'paid',
                installed: true,
            },
            ...addOns,
        ];
    }, [integrations]);
    const reconciledStoreIntegrations = useMemo(
        () => reconcileCatalogItems(storeIntegrations, installed),
        [installed, storeIntegrations]
    );
    const storeCount = reconciledStoreIntegrations.length;

    const onTabChange = (nextTab) => {
        setActiveTab(nextTab);
    };

    const activeItems = activeTab === installedTab ? installed : reconciledStoreIntegrations;
    const storeLoading = storeFeed.loading;
    const loading = activeTab === installedTab ? installedLoading : storeLoading;
    const storeStatus = (
        <MarketplaceStatus
            error={storeFeed.error}
            retrying={storeFeed.retrying}
            label={__('Integration store is temporarily unavailable.', 'wp-posts-carousel')}
            description={__(
                'The plugin will retry automatically. Last known store integrations remain visible when available.',
                'wp-posts-carousel'
            )}
            showDetails={false}
        />
    );
    if (!pluginData.isPro) {
        return (
            <div className='tw-grid tw-grid-cols-1 tw-items-start tw-gap-4 xl:tw-grid-cols-[minmax(0,1fr)_320px]'>
                <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                    <div className='tw-grid tw-grid-cols-1 tw-gap-3 lg:tw-grid-cols-2'>
                        <MetricCard
                            icon={Plug}
                            label={__('Installed', 'wp-posts-carousel')}
                            value={installedLoading ? '-' : installed.length}
                            description={__('Installed product packages detected on this site', 'wp-posts-carousel')}
                            tone='primary'
                        />
                        <MetricCard
                            icon={ShoppingBag}
                            label={__('Store', 'wp-posts-carousel')}
                            value={storeLoading ? '-' : storeCount}
                            description={
                                pluginData.integrationStoreEndpoint
                                    ? __('Loaded from your store', 'wp-posts-carousel')
                                    : __('Connect a store endpoint', 'wp-posts-carousel')
                            }
                        />
                    </div>

                    <ReviewPrompt section='integrations' setNotice={setNotice} />

                    <Tabs value={activeTab} onValueChange={onTabChange}>
                        <TabsList aria-label={__('Integration sections', 'wp-posts-carousel')}>
                            <TabsTrigger value={installedTab}>
                                <BadgeCheck aria-hidden='true' />
                                {__('Installed products', 'wp-posts-carousel')}
                                <span className='tw-inline-flex tw-min-w-6 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-px-2 tw-py-1 tw-text-[11px] tw-leading-none tw-text-cci-wpc-muted'>
                                    {installed.length}
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value={storeTab}>
                                <ShoppingBag aria-hidden='true' />
                                {__('Products in store', 'wp-posts-carousel')}
                                <span className='tw-inline-flex tw-min-w-6 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-px-2 tw-py-1 tw-text-[11px] tw-leading-none tw-text-cci-wpc-muted'>
                                    {storeCount}
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        <Card as='div' transparent>
                            {loading ? (
                                <LoadingState
                                    label={
                                        activeTab === installedTab
                                            ? __('Loading installed integrations...', 'wp-posts-carousel')
                                            : __('Loading store integrations...', 'wp-posts-carousel')
                                    }
                                    variant='block'
                                    rows={4}
                                />
                            ) : (
                                <IntegrationGrid
                                    items={activeItems}
                                    mode={activeTab}
                                    notice={activeTab === storeTab ? storeStatus : null}
                                    hasStoreEndpoint={Boolean(pluginData.integrationStoreEndpoint)}
                                    onGoToStore={() => onTabChange(storeTab)}
                                    onLockedIntegration={setProFeature}
                                />
                            )}
                        </Card>
                    </Tabs>
                </div>

                <aside className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                    <LicensePanel
                        license={license}
                    />
                </aside>
                <ProUpgradeModal
                    open={Boolean(proFeature)}
                    featureName={proFeature?.featureName || ''}
                    description={proFeature?.description || ''}
                    productUrl={proFeature?.productUrl || ''}
                    benefits={[
                        __('Unlock premium data sources and editor integrations for this domain.', 'wp-posts-carousel'),
                        __('Keep the core plugin lean while Pro modules extend commerce and analytics workflows.', 'wp-posts-carousel'),
                    ]}
                    onActivateLicense={() => {
                        setProFeature(null);
                        onOpenSettings?.();
                    }}
                    onClose={() => setProFeature(null)}
                />
            </div>
        );
    }

    return (
            <div className='tw-grid tw-grid-cols-1 tw-items-start tw-gap-4 xl:tw-grid-cols-[minmax(0,1fr)_320px]'>
                <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                    <div className='tw-grid tw-grid-cols-1 tw-gap-3 lg:tw-grid-cols-2'>
                        <MetricCard
                            icon={Plug}
                            label={__('Installed', 'wp-posts-carousel')}
                            value={installedLoading ? '-' : installed.length}
                            description={__('Installed product packages detected on this site', 'wp-posts-carousel')}
                            tone='primary'
                        />
                        <MetricCard
                            icon={ShoppingBag}
                            label={__('Store', 'wp-posts-carousel')}
                            value={storeLoading ? '-' : storeCount}
                            description={
                                pluginData.integrationStoreEndpoint
                                    ? __('Loaded from your store', 'wp-posts-carousel')
                                    : __('Connect a store endpoint', 'wp-posts-carousel')
                            }
                        />
                    </div>

                <ReviewPrompt section='integrations' setNotice={setNotice} />

                <Tabs value={activeTab} onValueChange={onTabChange}>
                    <TabsList aria-label={__('Integration sections', 'wp-posts-carousel')}>
                        <TabsTrigger value={installedTab}>
                            <BadgeCheck aria-hidden='true' />
                            {__('Installed products', 'wp-posts-carousel')}
                            <span className='tw-inline-flex tw-min-w-6 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-px-2 tw-py-1 tw-text-[11px] tw-leading-none tw-text-cci-wpc-muted'>
                                {installed.length}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value={storeTab}>
                            <ShoppingBag aria-hidden='true' />
                            {__('Products in store', 'wp-posts-carousel')}
                            <span className='tw-inline-flex tw-min-w-6 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-px-2 tw-py-1 tw-text-[11px] tw-leading-none tw-text-cci-wpc-muted'>
                                {storeCount}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <Card as='div' transparent>
                        {loading ? (
                            <LoadingState
                                label={
                                    activeTab === installedTab
                                        ? __('Loading installed integrations...', 'wp-posts-carousel')
                                        : __('Loading store integrations...', 'wp-posts-carousel')
                                }
                                variant='block'
                                rows={4}
                            />
                        ) : (
                            <IntegrationGrid
                                items={activeItems}
                                mode={activeTab}
                                notice={activeTab === storeTab ? storeStatus : null}
                                hasStoreEndpoint={Boolean(pluginData.integrationStoreEndpoint)}
                                onGoToStore={() => onTabChange(storeTab)}
                                onLockedIntegration={setProFeature}
                            />
                        )}
                    </Card>
                </Tabs>
            </div>

            <aside className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                <LicensePanel
                    license={license}
                />
            </aside>
            <ProUpgradeModal
                open={Boolean(proFeature)}
                featureName={proFeature?.featureName || ''}
                description={proFeature?.description || ''}
                productUrl={proFeature?.productUrl || ''}
                benefits={[
                    __('Unlock premium data sources and editor integrations for this domain.', 'wp-posts-carousel'),
                    __('Keep the core plugin lean while Pro modules extend commerce and analytics workflows.', 'wp-posts-carousel'),
                ]}
                onActivateLicense={() => {
                    setProFeature(null);
                    onOpenSettings?.();
                }}
                onClose={() => setProFeature(null)}
            />
        </div>
    );
}

function IntegrationGrid({ items, mode, notice, hasStoreEndpoint, onGoToStore, onLockedIntegration }) {
    return (
        <CatalogGrid notice={notice}>
            {!items.length ? (
            <CatalogEmptyState
                embedded
                icon={Plug}
                title={
                    mode === installedTab
                        ? __('No integration add-ons detected.', 'wp-posts-carousel')
                        : hasStoreEndpoint
                          ? __('No store integrations found.', 'wp-posts-carousel')
                          : __('Integration store is not connected yet.', 'wp-posts-carousel')
                }
                description={
                    mode === installedTab
                        ? __('No integrations are installed on this site yet.', 'wp-posts-carousel')
                        : hasStoreEndpoint
                          ? __('Add integration products in your store and they will appear here.', 'wp-posts-carousel')
                          : __(
                                'The integration store is temporarily unavailable. Installed integrations remain ready to use.',
                                'wp-posts-carousel'
                            )
                }
                actionLabel={
                    mode === installedTab && onGoToStore && hasStoreEndpoint
                        ? __('Go to available integrations', 'wp-posts-carousel')
                        : ''
                }
                onAction={mode === installedTab && hasStoreEndpoint ? onGoToStore : null}
            />
            ) : (
                items.map((item) => (
                    <IntegrationCard key={item.key} item={item} onLockedIntegration={onLockedIntegration} />
                ))
            )}
        </CatalogGrid>
    );
}

function IntegrationCard({ item, onLockedIntegration }) {
    const locked = item.source !== 'store' && !item.enabled && item.plan === 'paid';

    return (
        <CatalogProductCard
            item={{
                title: item.label,
                description:
                    item.description || __('Adds capabilities to carousel configuration.', 'wp-posts-carousel'),
                screenshot: item.screenshot,
                pro: item.plan === 'paid',
                locked,
                lockedMessage: __(
                    'Installed, but requires an active WP Posts Carousel Pro license before premium options are enabled.',
                    'wp-posts-carousel'
                ),
                url: item.url,
                installed: item.installed || item.source !== 'store',
            }}
            mode={item.source === 'store' ? storeTab : installedTab}
            fallbackIcon={Plug}
            lockedActionUrl={pluginData.upgradeUrl}
            lockedActionLabel={__('Requires Pro license', 'wp-posts-carousel')}
            availableLabel={__('Available', 'wp-posts-carousel')}
            storeLabel={item.statusLabel || __('Available', 'wp-posts-carousel')}
            onLockedClick={onLockedIntegration}
        />
    );
}

function normalizeIntegrations(features) {
    return Object.entries(features || {})
        .filter(([, feature]) => feature.source === 'addon')
        .map(([key, feature]) => ({
            key,
            catalogKeys: integrationCatalogKeys(key),
            label: feature.label || key,
            description: feature.description || '',
            enabled: Boolean(feature.enabled),
            source: feature.source || 'addon',
            plan: feature.plan || (feature.source === 'pro' ? 'paid' : 'free'),
            statusLabel:
                feature.source === 'pro'
                    ? __('Requires Pro', 'wp-posts-carousel')
                    : __('Available', 'wp-posts-carousel'),
            installed: feature.source === 'addon' || Boolean(feature.enabled),
        }));
}

function integrationCatalogKeys(key) {
    const aliases = {
        popular_posts_integration: ['wordpress-popular-posts-integration'],
        woocommerce_advanced: ['woocommerce-merchandising-integration'],
    };

    return aliases[key] || [];
}

function normalizeStoreIntegration(integration) {
    if (!integration || typeof integration !== 'object') {
        return null;
    }

    const availability = readableValue(integration.availability).toLowerCase();
    const includedInPro = availability === 'included_pro';
    const plan = Boolean(integration.requiresPro) || isPaidProduct(integration) ? 'paid' : 'free';

    return {
        key: readableValue(
            integration.slug || integration.key || integration.id || integration.name || integration.title
        ),
        label: readableValue(integration.title || integration.label || integration.name),
        description: readableValue(integration.description || integration.excerpt || integration.summary, ''),
        enabled: false,
        source: 'store',
        plan,
        statusLabel: includedInPro
            ? __('Included in Pro', 'wp-posts-carousel')
            : plan === 'paid'
              ? __('Paid add-on', 'wp-posts-carousel')
              : __('Free add-on', 'wp-posts-carousel'),
        installed: false,
        screenshot: mediaUrl(
            integration.screenshot ||
                integration.image ||
                integration.thumbnail ||
                integration.cover ||
                integration.featuredImage ||
                integration.media
        ),
        url: productUrl(integration),
    };
}
