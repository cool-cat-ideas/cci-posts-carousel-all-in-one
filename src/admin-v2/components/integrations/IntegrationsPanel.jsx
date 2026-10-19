import React, { useEffect, useMemo, useState } from 'react';
import { CountBadge, reconcileCatalogItems } from '@cci/admin-ui';
import { BadgeCheck, Plug, ShoppingBag } from 'lucide-react';
import { apiFetch, pluginData } from '../../api/api';
import { __ } from '../../i18n/i18n';
import {
  collectionFromResponse,
  isPaidProduct,
  mediaUrl,
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
          message: __('Failed loading integrations.', 'cci-posts-carousel'),
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
        key: 'cci-posts-carousel-pro',
        label: 'CCI Posts Carousel All In One Pro',
        description: __(
          'Core Pro product and license for premium carousel modules.',
          'cci-posts-carousel',
        ),
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
    [installed, storeIntegrations],
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
      label={__('Integration store is temporarily unavailable.', 'cci-posts-carousel')}
      description={__(
        'The plugin will retry automatically. Last known store integrations remain visible when available.',
        'cci-posts-carousel',
      )}
      showDetails={false}
    />
  );
  if (!pluginData.isPro) {
    return (
      <div className="tw-grid tw-grid-cols-1 tw-items-start tw-gap-4 xl:tw-grid-cols-[minmax(0,1fr)_320px]">
        <div className="tw-grid tw-content-start tw-gap-4 tw-self-start">
          <div className="tw-grid tw-grid-cols-1 tw-gap-3 lg:tw-grid-cols-2">
            <MetricCard
              icon={Plug}
              label={__('Installed', 'cci-posts-carousel')}
              value={installedLoading ? '-' : installed.length}
              description={__(
                'Installed product packages detected on this site',
                'cci-posts-carousel',
              )}
              tone="primary"
            />
            <MetricCard
              icon={ShoppingBag}
              label={__('Store', 'cci-posts-carousel')}
              value={storeLoading ? '-' : storeCount}
              description={
                pluginData.integrationStoreEndpoint
                  ? __('Loaded from your store', 'cci-posts-carousel')
                  : __('Connect a store endpoint', 'cci-posts-carousel')
              }
            />
          </div>

          <ReviewPrompt section="integrations" setNotice={setNotice} />

          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList aria-label={__('Integration sections', 'cci-posts-carousel')}>
              <TabsTrigger value={installedTab}>
                <BadgeCheck aria-hidden="true" />
                {__('Installed products', 'cci-posts-carousel')}
                <CountBadge>{installed.length}</CountBadge>
              </TabsTrigger>
              <TabsTrigger value={storeTab}>
                <ShoppingBag aria-hidden="true" />
                {__('Products in store', 'cci-posts-carousel')}
                <CountBadge>{storeCount}</CountBadge>
              </TabsTrigger>
            </TabsList>

            <Card as="div" transparent>
              {loading ? (
                <LoadingState
                  label={
                    activeTab === installedTab
                      ? __('Loading installed integrations...', 'cci-posts-carousel')
                      : __('Loading store integrations...', 'cci-posts-carousel')
                  }
                  variant="block"
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

        <aside className="tw-grid tw-content-start tw-gap-4 tw-self-start">
          <LicensePanel license={license} />
        </aside>
        <ProUpgradeModal
          open={Boolean(proFeature)}
          featureName={proFeature?.featureName || ''}
          description={proFeature?.description || ''}
          productUrl={proFeature?.productUrl || ''}
          benefits={[
            __(
              'Unlock premium data sources and editor integrations for this domain.',
              'cci-posts-carousel',
            ),
            __(
              'Keep the core plugin lean while Pro modules extend commerce and analytics workflows.',
              'cci-posts-carousel',
            ),
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
    <div className="tw-grid tw-grid-cols-1 tw-items-start tw-gap-4 xl:tw-grid-cols-[minmax(0,1fr)_320px]">
      <div className="tw-grid tw-content-start tw-gap-4 tw-self-start">
        <div className="tw-grid tw-grid-cols-1 tw-gap-3 lg:tw-grid-cols-2">
          <MetricCard
            icon={Plug}
            label={__('Installed', 'cci-posts-carousel')}
            value={installedLoading ? '-' : installed.length}
            description={__(
              'Installed product packages detected on this site',
              'cci-posts-carousel',
            )}
            tone="primary"
          />
          <MetricCard
            icon={ShoppingBag}
            label={__('Store', 'cci-posts-carousel')}
            value={storeLoading ? '-' : storeCount}
            description={
              pluginData.integrationStoreEndpoint
                ? __('Loaded from your store', 'cci-posts-carousel')
                : __('Connect a store endpoint', 'cci-posts-carousel')
            }
          />
        </div>

        <ReviewPrompt section="integrations" setNotice={setNotice} />

        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList aria-label={__('Integration sections', 'cci-posts-carousel')}>
            <TabsTrigger value={installedTab}>
              <BadgeCheck aria-hidden="true" />
              {__('Installed products', 'cci-posts-carousel')}
              <CountBadge>{installed.length}</CountBadge>
            </TabsTrigger>
            <TabsTrigger value={storeTab}>
              <ShoppingBag aria-hidden="true" />
              {__('Products in store', 'cci-posts-carousel')}
              <CountBadge>{storeCount}</CountBadge>
            </TabsTrigger>
          </TabsList>

          <Card as="div" transparent>
            {loading ? (
              <LoadingState
                label={
                  activeTab === installedTab
                    ? __('Loading installed integrations...', 'cci-posts-carousel')
                    : __('Loading store integrations...', 'cci-posts-carousel')
                }
                variant="block"
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

      <aside className="tw-grid tw-content-start tw-gap-4 tw-self-start">
        <LicensePanel license={license} />
      </aside>
      <ProUpgradeModal
        open={Boolean(proFeature)}
        featureName={proFeature?.featureName || ''}
        description={proFeature?.description || ''}
        productUrl={proFeature?.productUrl || ''}
        benefits={[
          __(
            'Unlock premium data sources and editor integrations for this domain.',
            'cci-posts-carousel',
          ),
          __(
            'Keep the core plugin lean while Pro modules extend commerce and analytics workflows.',
            'cci-posts-carousel',
          ),
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

function IntegrationGrid({
  items,
  mode,
  notice,
  hasStoreEndpoint,
  onGoToStore,
  onLockedIntegration,
}) {
  return (
    <CatalogGrid notice={notice}>
      {!items.length ? (
        <CatalogEmptyState
          embedded
          icon={Plug}
          title={
            mode === installedTab
              ? __('No integration add-ons detected.', 'cci-posts-carousel')
              : hasStoreEndpoint
                ? __('No store integrations found.', 'cci-posts-carousel')
                : __('Integration store is not connected yet.', 'cci-posts-carousel')
          }
          description={
            mode === installedTab
              ? __('No integrations are installed on this site yet.', 'cci-posts-carousel')
              : hasStoreEndpoint
                ? __(
                    'Add integration products in your store and they will appear here.',
                    'cci-posts-carousel',
                  )
                : __(
                    'The integration store is temporarily unavailable. Installed integrations remain ready to use.',
                    'cci-posts-carousel',
                  )
          }
          actionLabel={
            mode === installedTab && onGoToStore && hasStoreEndpoint
              ? __('Go to available integrations', 'cci-posts-carousel')
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
        author: item.author,
        version: item.version,
        description:
          item.description ||
          __('Adds capabilities to carousel configuration.', 'cci-posts-carousel'),
        screenshot: item.screenshot,
        pro: item.plan === 'paid',
        locked,
        lockedMessage: __(
          'Installed, but requires an active CCI Posts Carousel All In One Pro license before premium options are enabled.',
          'cci-posts-carousel',
        ),
        url: item.url,
        installed: item.installed || item.source !== 'store',
      }}
      mode={item.source === 'store' ? storeTab : installedTab}
      fallbackIcon={Plug}
      lockedActionUrl={pluginData.upgradeUrl}
      lockedActionLabel={__('Requires Pro license', 'cci-posts-carousel')}
      availableLabel={__('Available', 'cci-posts-carousel')}
      storeLabel={item.statusLabel || __('Available', 'cci-posts-carousel')}
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
      author: readableValue(feature.author),
      version: readableValue(feature.version),
      enabled: Boolean(feature.enabled),
      source: feature.source || 'addon',
      plan: feature.plan || (feature.source === 'pro' ? 'paid' : 'free'),
      statusLabel:
        feature.source === 'pro'
          ? __('Requires Pro', 'cci-posts-carousel')
          : __('Available', 'cci-posts-carousel'),
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
      integration.slug ||
        integration.key ||
        integration.id ||
        integration.name ||
        integration.title,
    ),
    label: readableValue(integration.title || integration.label || integration.name),
    description: readableValue(
      integration.description || integration.excerpt || integration.summary,
      '',
    ),
    author: readableValue(integration.author || integration.vendor),
    version: readableValue(integration.version),
    enabled: false,
    source: 'store',
    plan,
    statusLabel: includedInPro
      ? __('Included in Pro', 'cci-posts-carousel')
      : plan === 'paid'
        ? __('Paid add-on', 'cci-posts-carousel')
        : __('Free add-on', 'cci-posts-carousel'),
    installed: false,
    screenshot: mediaUrl(
      integration.screenshot ||
        integration.image ||
        integration.thumbnail ||
        integration.cover ||
        integration.featuredImage ||
        integration.media,
    ),
    url: productUrl(integration),
  };
}
