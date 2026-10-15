import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { InfoCallout } from '@cci/admin-ui/wp-carousel';
import { pluginData } from '../api/api';
import { __ } from '../i18n/i18n';
import { useQueryParam } from '../lib/utils';
import { Button } from '../components/ui/button';
import { CheckboxField } from '../components/ui/checkbox';
import { Field, FieldLabel } from '../components/ui/field';
import { Select } from '../components/ui/select';
import ProBadge from '../components/licensing/ProBadge';
import ConfirmDialog from '../components/feedback/ConfirmDialog';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import LoadingState from '../components/feedback/LoadingState';
import Notice from '../components/feedback/Notice';

const AnalyticsPanel = lazy(() => import('../components/analytics/AnalyticsPanel'));
const CarouselsList = lazy(() => import('../components/carousels/CarouselsList'));
const CompatibilitySettings = lazy(() => import('../components/settings/CompatibilitySettings'));
const IntegrationsPanel = lazy(() => import('../components/integrations/IntegrationsPanel'));
const LicensePanel = lazy(() => import('../components/licensing/LicensePanel'));
const NewsPanel = lazy(() => import('../components/news/NewsPanel'));
const TemplatesPanel = lazy(() => import('../components/templates/TemplatesPanel'));
const VisualBuilder = lazy(() => import('../components/builder/VisualBuilder'));
const ReviewPrompt = lazy(() => import('../components/feedback/ReviewPrompt'));

const SIDEBAR_STORAGE_KEY = 'wp_posts_carousel_admin_sidebar_collapsed';
const ANALYTICS_ADMIN_UI = { Button, CheckboxField, Field, FieldLabel, ProBadge, Select, InfoCallout, LoadingState };

function getInitialSidebarCollapsed() {
    if (typeof window === 'undefined') {
        return false;
    }

    const stored = window.localStorage?.getItem(SIDEBAR_STORAGE_KEY);

    if (stored === '1' || stored === '0') {
        return stored === '1';
    }

    return window.matchMedia?.('(max-width: 1180px)').matches || false;
}

export default function App() {
    const action = useQueryParam('action');
    const [currentAction, setCurrentAction] = useState(action);
    const [notices, setNotices] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [license, setLicense] = useState(pluginData.license || {});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialSidebarCollapsed);
    const isBuilder = currentAction === 'add-new' || currentAction === 'edit';
    const isPro = license.status === 'active' || Boolean(pluginData.isPro);
    const pageHeader = getPageHeader(activeSection, Boolean(isPro && window.wpPostsCarouselProAdmin?.AnalyticsPanel));
    const shellStyle = {
        gridTemplateColumns: sidebarCollapsed ? '76px minmax(0, 1fr)' : '270px minmax(0, 1fr)',
    };

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage?.setItem(SIDEBAR_STORAGE_KEY, sidebarCollapsed ? '1' : '0');
    }, [sidebarCollapsed]);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return undefined;
        }

        const media = window.matchMedia('(max-width: 960px)');
        const collapseForCompactViewport = () => {
            if (media.matches) {
                setSidebarCollapsed(true);
            }
        };

        collapseForCompactViewport();
        media.addEventListener?.('change', collapseForCompactViewport);
        media.addListener?.(collapseForCompactViewport);

        return () => {
            media.removeEventListener?.('change', collapseForCompactViewport);
            media.removeListener?.(collapseForCompactViewport);
        };
    }, []);

    const setNotice = useCallback((notice) => {
        if (!notice) {
            setNotices([]);
            return;
        }

        setNotices((current) => [
            ...current.slice(-3),
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                type: notice.type || 'info',
                message: notice.message,
                details: notice.details || '',
                duration: Number(notice.duration || 0),
                sticky: Boolean(notice.sticky),
            },
        ]);
    }, []);

    const closeNotice = useCallback((id) => {
        setNotices((current) => current.filter((notice) => notice.id !== id));
    }, []);

    const updateLicense = useCallback((nextLicense) => {
        const normalized = nextLicense || {};

        pluginData.license = normalized;
        pluginData.isPro = normalized.status === 'active';
        setLicense(normalized);
    }, []);

    const confirmAction = useCallback(
        (options) =>
            new Promise((resolve) => {
                setConfirmDialog({
                    variant: 'danger',
                    ...options,
                    resolve,
                });
            }),
        []
    );

    const closeConfirm = useCallback((result) => {
        setConfirmDialog((current) => {
            if (current?.resolve) {
                current.resolve(result);
            }

            return null;
        });
    }, []);

    const handleSidebarSelect = useCallback((section) => {
        setCurrentAction(null);
        setActiveSection(section);

        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        url.searchParams.delete('id');
        window.history.replaceState(null, '', url.toString());
    }, []);

    return (
        <div
            className='cci-wpc-admin-shell tw-ml-[-20px] tw-grid tw-min-h-[calc(100vh-32px)] tw-items-stretch tw-bg-cci-wpc-bg tw-font-sans tw-text-sm tw-leading-[1.45] tw-text-cci-wpc-text'
            style={shellStyle}
        >
            <DashboardSidebar
                activeSection={isBuilder ? 'dashboard' : activeSection}
                collapsed={sidebarCollapsed}
                isPro={isPro}
                license={license}
                onCollapsedChange={setSidebarCollapsed}
                onLicenseChange={updateLicense}
                onSelect={handleSidebarSelect}
                setNotice={setNotice}
            />

            <main className='tw-min-w-0 tw-px-[34px] tw-pb-[42px] tw-pt-[30px]'>
                {!isBuilder && (
                    <header className='tw-mb-5 tw-flex tw-items-end tw-justify-between tw-gap-4'>
                        <div>
                            <h1 className='tw-mb-0 tw-mt-0 tw-text-3xl tw-font-medium tw-leading-tight tw-text-cci-wpc-text'>
                                {pageHeader.title}
                            </h1>
                            {pageHeader.description && (
                                <p className='tw-mb-0 tw-mt-1.5 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                                    {pageHeader.description}
                                </p>
                            )}
                        </div>
                        {pluginData.documentationUrl && (
                            <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-2.5'>
                                <Button asChild variant='secondary'>
                                    <a href={pluginData.documentationUrl} target='_blank' rel='noreferrer'>
                                        <BookOpen aria-hidden='true' />
                                        {__('Documentation')}
                                    </a>
                                </Button>
                            </div>
                        )}
                    </header>
                )}

                <Notice notices={notices} onClose={closeNotice} />

                <Suspense fallback={<LoadingState label={__('Loading section...', 'wp-posts-carousel')} />}>
                    {isBuilder ? (
                        <div className='tw-grid tw-gap-4'>
                            <VisualBuilder setNotice={setNotice} confirmAction={confirmAction} />
                            <ReviewPrompt
                                section={currentAction === 'edit' ? 'builder-edit' : 'builder-add-new'}
                                setNotice={setNotice}
                            />
                        </div>
                    ) : (
                        <DashboardSection
                            activeSection={activeSection}
                            setNotice={setNotice}
                            confirmAction={confirmAction}
                            isPro={isPro}
                            license={license}
                            onLicenseChange={updateLicense}
                            onOpenSettings={() => handleSidebarSelect('settings')}
                        />
                    )}
                </Suspense>
            </main>
            <ConfirmDialog
                dialog={confirmDialog}
                onCancel={() => closeConfirm(false)}
                onConfirm={() => closeConfirm(true)}
            />
            </div>
    );
}

function getPageHeader(activeSection, hasProAnalytics) {
    const pages = {
        dashboard: {
            title: __('WP Posts Carousel All In One', 'wp-posts-carousel'),
            description: __('Create, manage and embed carousel definitions.', 'wp-posts-carousel'),
        },
        integrations: {
            title: __('Carousel data integrations', 'wp-posts-carousel'),
            description: __('Connect add-ons that extend carousel sources and ordering.', 'wp-posts-carousel'),
        },
        templates: {
            title: __('Carousel template library', 'wp-posts-carousel'),
            description: __('Manage installed layouts and browse templates from your store.', 'wp-posts-carousel'),
        },
        analytics: {
            title: hasProAnalytics ? __('Carousel engagement analytics', 'wp-posts-carousel') : __('Carousel usage overview', 'wp-posts-carousel'),
            description: hasProAnalytics
                ? __('Review tracked carousel views, clicks and click rates.', 'wp-posts-carousel')
                : __('Review local configuration insights without visitor tracking.', 'wp-posts-carousel'),
        },
        settings: {
            title: __('Carousel settings', 'wp-posts-carousel'),
            description: __('Configure compatibility, assets and global carousel defaults.', 'wp-posts-carousel'),
        },
    };

    return pages[activeSection] || pages.dashboard;
}

function DashboardSection({ activeSection, setNotice, confirmAction, isPro, license, onLicenseChange, onOpenSettings }) {
    if (activeSection === 'settings') {
        return (
            <div className='tw-grid tw-grid-cols-1 tw-items-start tw-gap-4 xl:tw-grid-cols-[minmax(0,1fr)_320px]'>
                <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                    {pluginData.canManageSettings && (
                        <CompatibilitySettings setNotice={setNotice} confirmAction={confirmAction} />
                    )}
                </div>
                <aside className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                    <LicensePanel
                        license={license}
                    />
                    <ReviewPrompt section='settings' setNotice={setNotice} compact />
                </aside>
            </div>
        );
    }

    if (activeSection === 'integrations') {
        return (
            <IntegrationsPanel
                license={license}
                onLicenseChange={onLicenseChange}
                onOpenSettings={onOpenSettings}
                setNotice={setNotice}
            />
        );
    }

    if (activeSection === 'templates') {
        return (
            <TemplatesPanel
                license={license}
                onLicenseChange={onLicenseChange}
                onOpenSettings={onOpenSettings}
                setNotice={setNotice}
            />
        );
    }

    if (activeSection === 'analytics') {
        const ProAnalyticsPanel =
            isPro && typeof window !== 'undefined' ? window.wpPostsCarouselProAdmin?.AnalyticsPanel : null;
        const AnalyticsComponent = ProAnalyticsPanel || AnalyticsPanel;

        return (
            <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                <AnalyticsComponent setNotice={setNotice} adminUi={ANALYTICS_ADMIN_UI} />
                <ReviewPrompt section='analytics' setNotice={setNotice} />
            </div>
        );
    }

    return (
        <div className='tw-grid tw-grid-cols-1 tw-items-start tw-gap-4 xl:tw-grid-cols-[minmax(0,1fr)_320px]'>
            <div className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                <CarouselsList
                    setNotice={setNotice}
                    confirmAction={confirmAction}
                    reviewSlot={<ReviewPrompt section='dashboard' setNotice={setNotice} />}
                />
            </div>
            <aside className='tw-grid tw-content-start tw-gap-4 tw-self-start'>
                <LicensePanel
                    license={license}
                />
                <NewsPanel />
            </aside>
        </div>
    );
}
