import React, { useEffect, useMemo, useState } from 'react';
import { CountBadge, reconcileCatalogItems } from '@cci/admin-ui';
import { BadgeCheck, Image, LayoutTemplate, ShoppingBag } from 'lucide-react';
import { apiFetch, pluginData } from '../../api/api';
import { __ } from '../../i18n/i18n';
import {
    collectionFromResponse,
    isPaidProduct,
    mediaUrl,
    normalizeTags,
    productUrl,
    readableValue,
    useMarketplaceJson,
} from '../../catalog/marketplace';
import { CatalogEmptyState, CatalogGrid, CatalogProductCard } from '../catalog/CatalogCards';
import LicensePanel from '../licensing/LicensePanel';
import LoadingState from '../feedback/LoadingState';
import MarketplaceStatus from '../catalog/MarketplaceStatus';
import MetricCard from '../feedback/MetricCard';
import ProUpgradeModal from '../licensing/ProUpgradeModal';
import ReviewPrompt from '../feedback/ReviewPrompt';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

const installedTab = 'installed';
const storeTab = 'store';

export default function TemplatesPanel({ license, onLicenseChange, onOpenSettings, setNotice }) {
    const [activeTab, setActiveTab] = useState(installedTab);
    const [installedTemplates, setInstalledTemplates] = useState([]);
    const [storeTemplates, setStoreTemplates] = useState([]);
    const [installedLoading, setInstalledLoading] = useState(true);
    const [proFeature, setProFeature] = useState(null);
    const storeFeed = useMarketplaceJson(pluginData.templateStoreEndpoint, {
        enabled: Boolean(pluginData.templateStoreEndpoint),
    });

    const loadInstalled = () => {
        setInstalledLoading(true);
        apiFetch('/wp-json/wp-posts-carousel/v1/admin/templates')
            .then((response) => {
                const templates = Array.isArray(response?.templates) ? response.templates : response;
                setInstalledTemplates(Array.isArray(templates) ? templates.map(normalizeInstalledTemplate) : []);
            })
            .catch(() => {
                setNotice({
                    type: 'error',
                    message: __('Failed loading installed templates.', 'cci-posts-carousel'),
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

        const templates = collectionFromResponse(storeFeed.data, [
            'templates',
            'productCatalogItems',
            'catalogItems',
            'items',
        ]);

        setStoreTemplates(templates.map(normalizeStoreTemplate).filter(Boolean));
    }, [storeFeed.data]);

    const onTabChange = (nextTab) => {
        setActiveTab(nextTab);
    };

    const reconciledStoreTemplates = useMemo(
        () => reconcileCatalogItems(storeTemplates, installedTemplates),
        [installedTemplates, storeTemplates]
    );
    const installedCount = installedTemplates.length;
    const storeCount = reconciledStoreTemplates.length;
    const activeTemplates = activeTab === installedTab ? installedTemplates : reconciledStoreTemplates;
    const storeLoading = storeFeed.loading;
    const loading = activeTab === installedTab ? installedLoading : storeLoading;
    const storeStatus = (
        <MarketplaceStatus
            error={storeFeed.error}
            retrying={storeFeed.retrying}
            label={__('Template store is temporarily unavailable.', 'cci-posts-carousel')}
            description={__(
                'The plugin will retry automatically. Last known store templates remain visible when available.',
                'cci-posts-carousel'
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
                            icon={LayoutTemplate}
                            label={__('Installed', 'cci-posts-carousel')}
                            value={installedLoading ? '-' : installedCount}
                            description={__('Ready to use in carousel settings', 'cci-posts-carousel')}
                            tone='primary'
                        />
                        <MetricCard
                            icon={ShoppingBag}
                            label={__('Store', 'cci-posts-carousel')}
                            value={storeLoading ? '-' : storeCount}
                            description={
                                pluginData.templateStoreEndpoint
                                    ? __('Loaded from your store', 'cci-posts-carousel')
                                    : __('Connect a store endpoint', 'cci-posts-carousel')
                            }
                        />
                    </div>

                    <ReviewPrompt section='templates' setNotice={setNotice} />

                    <Tabs value={activeTab} onValueChange={onTabChange}>
                        <TabsList aria-label={__('Template sections', 'cci-posts-carousel')}>
                            <TabsTrigger value={installedTab}>
                                <BadgeCheck aria-hidden='true' />
                                {__('Installed templates', 'cci-posts-carousel')}
                                <CountBadge>{installedCount}</CountBadge>
                            </TabsTrigger>
                            <TabsTrigger value={storeTab}>
                                <ShoppingBag aria-hidden='true' />
                                {__('Available in store', 'cci-posts-carousel')}
                                <CountBadge>{storeCount}</CountBadge>
                            </TabsTrigger>
                        </TabsList>

                        <Card as='div' transparent>
                            {loading ? (
                                <LoadingState
                                    label={
                                        activeTab === installedTab
                                            ? __('Loading installed templates...', 'cci-posts-carousel')
                                            : __('Loading store templates...', 'cci-posts-carousel')
                                    }
                                    variant='block'
                                    rows={4}
                                />
                            ) : (
                                <TemplateGrid
                                    templates={activeTemplates}
                                    mode={activeTab}
                                    notice={activeTab === storeTab ? storeStatus : null}
                                    hasStoreEndpoint={Boolean(pluginData.templateStoreEndpoint)}
                                    onGoToStore={() => onTabChange(storeTab)}
                                    onLockedTemplate={setProFeature}
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
                        __('Unlock premium carousel templates for this domain.', 'cci-posts-carousel'),
                        __('Keep the builder focused while template packs extend visual layouts.', 'cci-posts-carousel'),
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
                            icon={LayoutTemplate}
                            label={__('Installed', 'cci-posts-carousel')}
                            value={installedLoading ? '-' : installedCount}
                            description={__('Ready to use in carousel settings', 'cci-posts-carousel')}
                            tone='primary'
                        />
                        <MetricCard
                            icon={ShoppingBag}
                            label={__('Store', 'cci-posts-carousel')}
                            value={storeLoading ? '-' : storeCount}
                            description={
                                pluginData.templateStoreEndpoint
                                    ? __('Loaded from your store', 'cci-posts-carousel')
                                    : __('Connect a store endpoint', 'cci-posts-carousel')
                            }
                        />
                    </div>

                <ReviewPrompt section='templates' setNotice={setNotice} />

                <Tabs value={activeTab} onValueChange={onTabChange}>
                    <TabsList aria-label={__('Template sections', 'cci-posts-carousel')}>
                        <TabsTrigger value={installedTab}>
                            <BadgeCheck aria-hidden='true' />
                            {__('Installed templates', 'cci-posts-carousel')}
                            <CountBadge>{installedCount}</CountBadge>
                        </TabsTrigger>
                        <TabsTrigger value={storeTab}>
                            <ShoppingBag aria-hidden='true' />
                            {__('Available in store', 'cci-posts-carousel')}
                            <CountBadge>{storeCount}</CountBadge>
                        </TabsTrigger>
                    </TabsList>

                    <Card as='div' transparent>
                        {loading ? (
                            <LoadingState
                                label={
                                    activeTab === installedTab
                                        ? __('Loading installed templates...', 'cci-posts-carousel')
                                        : __('Loading store templates...', 'cci-posts-carousel')
                                }
                                variant='block'
                                rows={4}
                            />
                        ) : (
                            <TemplateGrid
                                templates={activeTemplates}
                                mode={activeTab}
                                notice={activeTab === storeTab ? storeStatus : null}
                                hasStoreEndpoint={Boolean(pluginData.templateStoreEndpoint)}
                                onGoToStore={() => onTabChange(storeTab)}
                                onLockedTemplate={setProFeature}
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
                    __('Unlock premium carousel templates for this domain.', 'cci-posts-carousel'),
                    __('Keep the builder focused while template packs extend visual layouts.', 'cci-posts-carousel'),
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

function TemplateGrid({ templates, mode, notice, hasStoreEndpoint, onGoToStore, onLockedTemplate }) {
    return (
        <CatalogGrid notice={notice}>
            {!templates.length ? (
            <CatalogEmptyState
                embedded
                icon={Image}
                title={
                    mode === storeTab && !hasStoreEndpoint
                        ? __('Template store is not connected yet.', 'cci-posts-carousel')
                        : mode === installedTab
                          ? __('No templates are installed for this site yet.', 'cci-posts-carousel')
                          : __('No templates found.', 'cci-posts-carousel')
                }
                description={
                    mode === storeTab && !hasStoreEndpoint
                        ? __(
                              'The template store is temporarily unavailable. Installed templates remain ready to use.',
                              'cci-posts-carousel'
                          )
                        : mode === installedTab
                          ? __('No template packs are installed for this site yet.', 'cci-posts-carousel')
                          : __('Template packs from your store will appear here.', 'cci-posts-carousel')
                }
                actionLabel={
                    mode === installedTab && onGoToStore && hasStoreEndpoint
                        ? __('Go to available templates', 'cci-posts-carousel')
                        : ''
                }
                onAction={mode === installedTab && hasStoreEndpoint ? onGoToStore : null}
            />
            ) : (
                templates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        mode={mode}
                        onLockedTemplate={onLockedTemplate}
                    />
                ))
            )}
        </CatalogGrid>
    );
}

function TemplateCard({ template, mode, onLockedTemplate }) {
    return (
        <CatalogProductCard
            item={{
                title: template.title,
                version: template.version,
                author: template.author,
                description: template.description || __('Reusable carousel layout.', 'cci-posts-carousel'),
                screenshot: template.screenshot,
                tags: template.tags,
                pro: template.pro,
                locked: template.locked,
                lockedMessage:
                    template.availabilityMessage ||
                    __(
                        'Installed, but requires an active CCI Posts Carousel All In One Pro license for this domain.',
                        'cci-posts-carousel'
                    ),
      metaSecondary: template.price,
                url: template.url,
                installed: template.installed || mode !== storeTab,
            }}
            mode={mode}
            fallbackIcon={Image}
            lockedActionUrl={pluginData.upgradeUrl}
            lockedActionLabel={__('Requires Pro', 'cci-posts-carousel')}
            storeLabel={template.includedInPro ? __('Included in Pro', 'cci-posts-carousel') : undefined}
            onLockedClick={onLockedTemplate}
        />
    );
}

function normalizeInstalledTemplate(template) {
    return {
        id: template.name || template.template_name,
        title:
            template.template_name || template.title || template.name || __('Untitled template', 'cci-posts-carousel'),
        description: template.description || '',
        version: template.version || '',
        author: template.author || '',
        tags: normalizeTags(template.tags),
        price: '',
        pro: Boolean(template.pro),
        locked: Boolean(template.locked),
        availabilityMessage: template.availability?.message || '',
        screenshot: template.screenshot || '',
        selected: template.name === 'default',
        url: '',
    };
}

function normalizeStoreTemplate(template) {
    if (!template || typeof template !== 'object') {
        return null;
    }

    const id = readableValue(template.id || template.slug || template.name);
    if (id === 'showcase-templates' || id === 'wp-posts-carousel-showcase-templates') {
        return null;
    }

    const title = readableValue(template.title || template.template_name || template.name);
    const price = readableValue(
        template.priceFormatted ||
            template.priceLabel ||
            template.price ||
            template.regularPrice ||
            template.pricing?.price
    );
    const availability = readableValue(template.availability).toLowerCase();
    const pro = Boolean(template.requiresPro) || isPaidProduct(template);

    return {
        id: id || title,
        title: title || __('Untitled template', 'cci-posts-carousel'),
        description: readableValue(
            template.description || template.excerpt || template.summary || template.shortDescription
        ),
        version: readableValue(template.version),
        author: readableValue(template.author || template.vendor),
        tags: normalizeTags(template.tags || template.categories),
        price,
        pro,
        includedInPro: availability === 'included_pro',
        locked: false,
        screenshot: mediaUrl(
            template.screenshot ||
                template.image ||
                template.cover ||
                template.thumbnail ||
                template.preview ||
                template.featuredImage ||
                template.media
        ),
        url: productUrl(template),
    };
}
