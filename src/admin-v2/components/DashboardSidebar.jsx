import { ActiveLicenseCard, InactiveLicenseCard } from '@cci/admin-ui';
import React from 'react';
import {
    BarChart3,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    LayoutTemplate,
    Plug,
    Settings,
} from 'lucide-react';
import { apiFetch, pluginData } from '../api';
import { __, coreString, licenseString } from '../i18n';
import { cn } from '../lib/cn';
import { compactLicenseError } from '../utils';
import ProductLogo from './ProductLogo';
import ConfirmLicenseDeactivateModal from './ConfirmLicenseDeactivateModal';
import { Button } from './ui/button';

const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, core: true },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings, core: true },
];

const sidebarItemBase = [
    '!tw-appearance-none !tw-shadow-none !tw-outline-none !tw-no-underline',
    '!tw-m-0 tw-flex tw-min-h-[42px] tw-w-full tw-cursor-pointer tw-items-center tw-gap-2.5',
    'tw-rounded-md !tw-border tw-border-solid tw-px-3 tw-py-0 tw-text-left tw-text-sm tw-font-semibold tw-leading-none',
    'tw-transition-colors tw-duration-150',
    '[&_svg]:tw-h-[18px] [&_svg]:tw-w-[18px] [&_svg]:tw-shrink-0',
    'focus-visible:!tw-outline focus-visible:!tw-outline-2 focus-visible:tw-outline-offset-1 focus-visible:tw-outline-cci-wpc-brand',
].join(' ');

export default function DashboardSidebar({
    activeSection,
    collapsed = false,
    onCollapsedChange,
    onSelect,
    isPro,
    license,
    onLicenseChange,
    setNotice,
}) {
    const visibleItems = items.filter((item) => !item.proOnly || isPro);
    const showLicenseBox = Boolean(license?.canManage && license?.apiBase);
    const showUpgradeBanner = !showLicenseBox && !isPro;
    const toggleLabel = collapsed
        ? __('Expand sidebar', 'wp-posts-carousel')
        : __('Collapse sidebar', 'wp-posts-carousel');
    const renderItem = (item) => {
        const Icon = item.icon;
        const itemLabel = item.core ? coreString(item.id, item.label) : __(item.label, 'wp-posts-carousel');

        return (
            <Button
                variant='unstyled'
                type='button'
                key={item.id}
                aria-label={itemLabel}
                title={collapsed ? itemLabel : undefined}
                className={cn(
                    sidebarItemBase,
                    collapsed && 'tw-justify-center tw-gap-0 tw-px-0',
                    activeSection === item.id
                        ? '!tw-border-cci-wpc-brandBorder !tw-bg-cci-wpc-brandSoft !tw-text-cci-wpc-brandStrong hover:!tw-border-cci-wpc-brand hover:!tw-bg-white'
                        : '!tw-border-transparent !tw-bg-transparent !tw-text-slate-700 hover:!tw-border-cci-wpc-brandBorder hover:!tw-bg-cci-wpc-brandSoft hover:!tw-text-cci-wpc-brandStrong'
                )}
                onClick={() => onSelect(item.id)}
            >
                <Icon aria-hidden='true' />
                {!collapsed && <span>{itemLabel}</span>}
            </Button>
        );
    };

    return (
        <aside
            data-collapsed={collapsed ? "true" : "false"}
            className={cn(
                'cci-wpc-admin-sidebar tw-grid tw-h-auto tw-min-h-full tw-self-stretch tw-grid-rows-[auto_minmax(0,1fr)] tw-overflow-hidden tw-border-0 tw-border-r tw-border-solid tw-border-cci-wpc-border tw-bg-white',
                collapsed ? 'tw-gap-4 tw-px-3 tw-py-5' : 'tw-gap-5 tw-px-4 tw-py-6'
            )}
        >
            <div className={cn(collapsed ? 'tw-grid tw-justify-items-center tw-gap-2' : 'tw-relative tw-pt-10')}>
                <ProductLogo
                    compact={collapsed}
                    expandedWidth={240}
                    className={collapsed ? 'tw-min-h-[42px]' : 'tw-w-full tw-px-0 tw-pb-0'}
                    onClick={(event) => {
                        event.preventDefault();
                        onSelect('dashboard');
                    }}
                />
                <Button
                    type='button'
                    variant='builder'
                    size='iconSm'
                    className={collapsed ? '' : 'tw-absolute tw-right-0 tw-top-0'}
                    aria-label={toggleLabel}
                    title={toggleLabel}
                    onClick={() => onCollapsedChange?.(!collapsed)}
                >
                    {collapsed ? <ChevronRight aria-hidden='true' /> : <ChevronLeft aria-hidden='true' />}
                </Button>
            </div>

            <div className='tw-grid tw-min-h-0 tw-content-start tw-gap-2.5 tw-overflow-y-auto tw-pr-1'>
                {!collapsed && (
                    <span className='tw-px-2.5 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-tracking-normal tw-text-cci-wpc-muted'>
                        {coreString('menu', 'Menu')}
                    </span>
                )}
                <nav className='tw-grid tw-content-start tw-gap-1.5' aria-label={coreString('menu', 'Menu')}>
                    {visibleItems.map(renderItem)}
                </nav>
                {!collapsed && showLicenseBox && (
                    <SidebarLicenseBox
                        isPro={isPro}
                        license={license}
                        onLicenseChange={onLicenseChange}
                        setNotice={setNotice}
                    />
                )}
                {!collapsed && showUpgradeBanner && (
                    <div className='tw-mt-2 tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-amber-200 tw-bg-gradient-to-br tw-from-amber-50 tw-via-white tw-to-white tw-p-3.5 tw-text-cci-wpc-text'>
                        <div className='tw-grid tw-gap-1.5'>
                            <strong className='tw-text-sm tw-font-semibold tw-leading-5 tw-text-cci-wpc-text'>
                                {__('Need more carousel options?', 'wp-posts-carousel')}
                            </strong>
                            <p className='tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                                {__(
                                    'This site is using the base plugin. After you install WP Posts Carousel Pro, license activation will appear here.',
                                    'wp-posts-carousel'
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

function SidebarLicenseBox({ isPro, license, onLicenseChange, setNotice }) {
    const [licenseKey, setLicenseKey] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const [touched, setTouched] = React.useState(false);
    const [error, setError] = React.useState('');
    const [errorTone, setErrorTone] = React.useState('error');
    const [fieldError, setFieldError] = React.useState('');
    const [deactivateModalOpen, setDeactivateModalOpen] = React.useState(false);
    const apiBase = license?.apiBase || '';
    const licensedSite = license?.domain || license?.customerEmail || '';
    const environmentLabel = license?.environment ? String(license.environment) : '';
    const validateLicenseKey = (key) => {
        const value = key.trim();

        if (!value) {
            return __('Enter your license key.', 'wp-posts-carousel');
        }

        if (value.length < 8) {
            return __('License key looks too short.', 'wp-posts-carousel');
        }

        return '';
    };

    const applyLicense = (nextLicense) => {
        const normalized = nextLicense || {};

        pluginData.license = normalized;
        pluginData.isPro = normalized.status === 'active';

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
                setError(response.warning || '');
                setErrorTone(response.warning ? 'warning' : 'error');

                if (response.license?.status === 'active') {
                    setLicenseKey('');
                }

                if (successMessage && setNotice) {
                    setNotice({
                        type: response.warning ? 'warning' : 'success',
                        message: response.warning || successMessage,
                        details: '',
                    });
                }
            })
            .catch((requestError) => {
                const message = compactLicenseError(
                    requestError,
                    __('License server is temporarily unavailable. Please try again later.', 'wp-posts-carousel'),
                    __('License request failed.', 'wp-posts-carousel'),
                );

                setError(message);
                setErrorTone('error');

                if (setNotice) {
                    setNotice({
                        type: 'error',
                        message,
                        details: '',
                    });
                }
            })
            .finally(() => setSaving(false));
    };

    const activateLicense = () => {
        const validationError = validateLicenseKey(licenseKey);

        setTouched(true);
        setError('');
        setFieldError(validationError);

        if (validationError) {
            setNotice?.({ type: 'error', message: validationError, details: '' });
            return false;
        }

        sendLicenseRequest(
            '/license/activate',
            { licenseKey: licenseKey.trim() },
            __('Pro license was activated.', 'wp-posts-carousel'),
        );
    };

    const deactivateLicense = () => {
        setDeactivateModalOpen(true);
    };

    const confirmDeactivateLicense = () => {
        setDeactivateModalOpen(false);
        sendLicenseRequest('/license/deactivate', {}, __('Pro license was deactivated.', 'wp-posts-carousel'));
    };

    if (isPro) {
        return (
            <ActiveLicenseCard
                t={licenseString}
                productName={__('WP Posts Carousel Pro', 'wp-posts-carousel')}
                site={licensedSite}
                environment={environmentLabel}
                saving={saving}
                onDeactivate={deactivateLicense}
                error={error}
                errorTone={errorTone}
            >
                <ConfirmLicenseDeactivateModal
                    open={deactivateModalOpen}
                    saving={saving}
                    onCancel={() => setDeactivateModalOpen(false)}
                    onConfirm={confirmDeactivateLicense}
                />
            </ActiveLicenseCard>
        );
    }

    return (
        <InactiveLicenseCard
            t={licenseString}
            productName={__('WP Posts Carousel Pro', 'wp-posts-carousel')}
            licenseKey={licenseKey}
            keyPlaceholder="WPC-XXXX-XXXX"
            saving={saving}
            onActivate={activateLicense}
            onKeyBlur={() => {
                setTouched(true);
                setFieldError(validateLicenseKey(licenseKey));
            }}
            onKeyChange={(nextValue) => {
                setLicenseKey(nextValue);
                setError('');

                if (touched) {
                    setFieldError(validateLicenseKey(nextValue));
                }
            }}
            error={error}
            errorTone={errorTone}
            fieldError={fieldError}
            message={license?.message}
        />
    );
}
