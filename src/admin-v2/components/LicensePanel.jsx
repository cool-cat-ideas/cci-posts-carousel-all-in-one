import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Crown, Download, RefreshCw, ShieldCheck } from 'lucide-react';
import { formatAdminDateTime } from '@cci/admin-ui/wp-carousel';
import { apiFetch, pluginData } from '../api';
import { __ } from '../i18n';
import { readableValue, useMarketplaceJson } from '../marketplace';
import { compactLicenseError } from '../utils';
import { cn } from '../lib/cn';
import ConfirmLicenseDeactivateModal from './ConfirmLicenseDeactivateModal';
import { Button } from './ui/button';
import { Field } from './ui/field';
import InfoCallout from './ui/info-callout';
import { Input } from './ui/input';
import { Card, CardHeader } from './ui/card';

export default function LicensePanel({ license: controlledLicense, onLicenseChange, setNotice, showManage = true }) {
    const [localLicense, setLocalLicense] = useState(pluginData.license || {});
    const [licenseKey, setLicenseKey] = useState('');
    const [saving, setSaving] = useState(false);
    const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
    const productFeed = useMarketplaceJson(pluginData.marketplaceFeedEndpoint, {
        enabled: Boolean(pluginData.marketplaceFeedEndpoint),
    });
    const license = controlledLicense || localLicense;
    const isPro = license.status === 'active' || Boolean(pluginData.isPro);
    const hasProductFeed = Boolean(productFeed.data?.product) && productFeed.data?._meta?.source !== 'empty';
    const product = hasProductFeed ? productFeed.data?.product || {} : {};
    const upgradeUrl = readableValue(product?.pro?.url || pluginData.upgradeUrl);
    const installedVersion = readableValue(pluginData.pluginVersion);
    const latestVersion = readableValue(product?.latestVersion || product?.free?.version);
    const updateUrl = readableValue(
        product?.free?.urls?.download || product?.free?.urls?.wordpress || product?.pro?.url || pluginData.upgradeUrl
    );
    const hasUpdate = compareVersions(latestVersion, installedVersion) > 0;
    const hasVersionFeed = Boolean(latestVersion);
    const apiBase = license.apiBase || '';
    const canManage = Boolean(license.canManage && apiBase);
    const ctaLabel = __('View Pro features', 'wp-posts-carousel');
    const ctaIcon = <ArrowRight aria-hidden='true' />;
    const licenseMascotUrl =
        typeof window !== 'undefined' && window.wp_posts_carousel_url
            ? `${window.wp_posts_carousel_url}assets/images/license-activation-mascot.png`
            : '';
    const licenseActivationStyle = licenseMascotUrl
        ? {
              backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.96) 54%, rgba(255,255,255,0.78) 100%), url("${licenseMascotUrl}")`,
              backgroundPosition: 'right 1.25rem top 4.5rem',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'clamp(8rem, 24vw, 13rem) auto',
          }
        : undefined;

    const applyLicense = (nextLicense) => {
        const normalized = nextLicense || {};

        pluginData.license = normalized;
        pluginData.isPro = normalized.status === 'active';
        setLocalLicense(normalized);

        if (onLicenseChange) {
            onLicenseChange(normalized);
        }
    };

    const sendLicenseRequest = (endpoint, body = {}, successMessage = '') => {
        setSaving(true);

        apiFetch(`${apiBase}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(body),
        })
            .then((response) => {
                applyLicense(response.license);

                if (successMessage && setNotice) {
                    setNotice({
                        type: response.warning ? 'warning' : 'success',
                        message: successMessage,
                        details: response.warning || '',
                    });
                }
            })
            .catch((error) => {
                const message = compactLicenseError(
                    error,
                    __('License server is temporarily unavailable. Please try again later.', 'wp-posts-carousel'),
                    __('License request failed.', 'wp-posts-carousel')
                );

                if (setNotice) {
                    setNotice({
                        type: 'error',
                        message: __('License request failed.', 'wp-posts-carousel'),
                        details: message,
                    });
                }
            })
            .finally(() => setSaving(false));
    };

    const activateLicense = () => {
        sendLicenseRequest('/license/activate', { licenseKey }, __('Pro license was activated.', 'wp-posts-carousel'));
    };

    const checkLicense = () => {
        sendLicenseRequest('/license/check', {}, __('License status was refreshed.', 'wp-posts-carousel'));
    };

    const deactivateLicense = () => {
        setDeactivateModalOpen(true);
    };

    const confirmDeactivateLicense = () => {
        setDeactivateModalOpen(false);
        sendLicenseRequest('/license/deactivate', {}, __('Pro license was deactivated.', 'wp-posts-carousel'));
    };

    return (
        <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
            <ConfirmLicenseDeactivateModal
                open={deactivateModalOpen}
                saving={saving}
                onCancel={() => setDeactivateModalOpen(false)}
                onConfirm={confirmDeactivateLicense}
            />
            <Card>
                <CardHeader className='tw-py-3'>
                    <div className='tw-flex tw-items-center tw-gap-3'>
                        <span
                            className={cn(
                                'tw-inline-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid',
                                isPro
                                    ? 'tw-border-amber-200 tw-bg-amber-50 tw-text-amber-700'
                                    : 'tw-border-cci-wpc-brandBorder tw-bg-cci-wpc-brandSoft tw-text-cci-wpc-brand'
                            )}
                            aria-hidden='true'
                        >
                            {isPro ? <Crown /> : <ShieldCheck />}
                        </span>
                        <div>
                            <span className='tw-inline-flex tw-items-center tw-gap-1.5 tw-text-sm tw-text-cci-wpc-text'>
                                {__('Module status', 'wp-posts-carousel')}
                            </span>
                            <h2>{isPro ? __('Pro', 'wp-posts-carousel') : __('Free', 'wp-posts-carousel')}</h2>
                        </div>
                    </div>
                </CardHeader>

                <div className='tw-grid tw-gap-3 tw-p-4'>
                    <InfoCallout
                        icon={hasUpdate ? <Download aria-hidden='true' /> : <CheckCircle2 aria-hidden='true' />}
                        title={
                            hasUpdate
                                ? __('New version available', 'wp-posts-carousel')
                                : hasVersionFeed
                                  ? __('You are up to date', 'wp-posts-carousel')
                                  : __('Version feed is unavailable', 'wp-posts-carousel')
                        }
                    >
                        {hasUpdate
                            ? __('Review and install the latest release when you are ready.', 'wp-posts-carousel')
                            : isPro
                              ? __('Pro access is active and premium features can be used on this site.', 'wp-posts-carousel')
                              : __('This site is using the base carousel plugin.', 'wp-posts-carousel')}
                    </InfoCallout>

                    <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
                        <VersionStat label={__('Installed', 'wp-posts-carousel')} value={installedVersion || '-'} />
                        <VersionStat
                            label={__('Latest', 'wp-posts-carousel')}
                            value={latestVersion || '-'}
                            active={hasUpdate}
                        />
                    </div>

                    {hasUpdate && updateUrl && (
                        <Button variant='outlineAccent' size='sm' className='cci-wpc-full' asChild>
                            <a href={updateUrl} target='_blank' rel='noreferrer'>
                                <Download aria-hidden='true' />
                                {__('View update', 'wp-posts-carousel')}
                            </a>
                        </Button>
                    )}

                    <div className='tw-grid tw-gap-2'>
                        {license.checkedAt && (
                            <CompactMeta label={__('Last check', 'wp-posts-carousel')} value={formatAdminDateTime(license.checkedAt, pluginData.adminDate)} />
                        )}
                        {license.nextCheckAt && (
                            <CompactMeta label={__('Next check', 'wp-posts-carousel')} value={formatAdminDateTime(license.nextCheckAt, pluginData.adminDate)} />
                        )}
                        {license.expires && (
                            <CompactMeta label={__('Expires', 'wp-posts-carousel')} value={formatAdminDateTime(license.expires, pluginData.adminDate, false)} />
                        )}
                    </div>
                </div>
            </Card>

            {canManage && showManage && (
                <Card className='tw-overflow-hidden tw-border-cci-wpc-brandBorder tw-bg-white'>
                    <div className='tw-grid tw-gap-4 tw-p-4 sm:tw-p-5' style={licenseActivationStyle}>
                        <CardHeader className='tw-border-0 tw-p-0'>
                            <div className='tw-max-w-[28rem]'>
                                <span className='tw-inline-flex tw-items-center tw-gap-1.5 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-brand'>
                                    <ShieldCheck aria-hidden='true' />
                                    {__('License activation', 'wp-posts-carousel')}
                                </span>
                                <h2 className='tw-mt-2'>
                                    {isPro
                                        ? __('Manage Pro access', 'wp-posts-carousel')
                                        : __('Activate Pro', 'wp-posts-carousel')}
                                </h2>
                                <p className='tw-mb-0 tw-mt-2 tw-max-w-md tw-text-sm tw-leading-6 tw-text-cci-wpc-muted'>
                                    {isPro
                                        ? __('Your Pro license is active for this site.', 'wp-posts-carousel')
                                        : __(
                                              'Activate your license to unlock Pro add-ons and premium tools on this site.',
                                              'wp-posts-carousel'
                                          )}
                                </p>
                            </div>
                        </CardHeader>

                        <div className='tw-grid tw-max-w-[28rem] tw-gap-3'>
                            {!isPro && (
                                <Field label={__('License key', 'wp-posts-carousel')}>
                                    <Input
                                        type='password'
                                        value={licenseKey}
                                        placeholder='WPC-XXXX-XXXX'
                                        onChange={(event) => setLicenseKey(event.target.value)}
                                    />
                                </Field>
                            )}

                            {license.message && (
                                <p className='tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>{license.message}</p>
                            )}
                            {license.lastError && (
                                <p className='tw-m-0 tw-text-xs tw-font-semibold tw-leading-5 tw-text-cci-wpc-danger'>
                                    {license.lastError}
                                </p>
                            )}

                            <div className='tw-flex tw-flex-wrap tw-gap-2'>
                                {isPro ? (
                                    <>
                                        <Button variant='outlineAccent' onClick={checkLicense} disabled={saving}>
                                            <RefreshCw aria-hidden='true' />
                                            {saving
                                                ? __('Checking...', 'wp-posts-carousel')
                                                : __('Check license', 'wp-posts-carousel')}
                                        </Button>
                                        <Button variant='danger' onClick={deactivateLicense} disabled={saving}>
                                            {__('Deactivate', 'wp-posts-carousel')}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant='primary'
                                        className='tw-w-full'
                                        onClick={activateLicense}
                                        disabled={saving || !licenseKey.trim()}
                                    >
                                        {saving
                                            ? __('Activating...', 'wp-posts-carousel')
                                            : __('Activate license', 'wp-posts-carousel')}
                                    </Button>
                                )}
                            </div>

                            {!isPro && (
                                <p className='tw-m-0 tw-text-sm tw-leading-6 tw-text-cci-wpc-muted'>
                                    {__(
                                        'Already have a license key? Paste it above and activate Pro in a few seconds.',
                                        'wp-posts-carousel'
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            )}

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

function VersionStat({ label, value, active = false }) {
    return (
        <div
            className={cn(
                'tw-rounded-md tw-border tw-border-solid tw-p-3',
                active ? 'tw-border-cci-wpc-brandBorder tw-bg-cci-wpc-brandSoft' : 'tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft'
            )}
        >
            <span className='tw-block tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted'>
                {label}
            </span>
            <strong className='tw-mt-2 tw-block tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>{value}</strong>
        </div>
    );
}

function CompactMeta({ label, value }) {
    return (
        <div className='tw-grid tw-grid-cols-[minmax(0,1fr)_auto] tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-px-3 tw-py-2'>
            <span className='tw-text-xs tw-text-cci-wpc-muted'>{label}</span>
            <strong className='tw-text-right tw-text-xs tw-font-semibold tw-text-cci-wpc-text'>{value}</strong>
        </div>
    );
}

function compareVersions(nextVersion, currentVersion) {
    const next = normalizeVersion(nextVersion);
    const current = normalizeVersion(currentVersion);

    if (!next.length || !current.length) {
        return 0;
    }

    const length = Math.max(next.length, current.length);

    for (let index = 0; index < length; index += 1) {
        const nextPart = next[index] || 0;
        const currentPart = current[index] || 0;

        if (nextPart > currentPart) {
            return 1;
        }

        if (nextPart < currentPart) {
            return -1;
        }
    }

    return 0;
}

function normalizeVersion(version) {
    const value = String(version || '').match(/\d+(?:\.\d+)*/)?.[0] || '';

    if (!value) {
        return [];
    }

    return value.split('.').map((part) => Number(part) || 0);
}
