import { formatAdminDateTime } from '@cci/admin-ui';
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bug, Clipboard, RefreshCw, Plus, Settings, Trash2 } from 'lucide-react';
import { apiFetch, pluginData } from '../api';
import { __ } from '../i18n';
import { Button } from './ui/button';
import { CheckboxField } from './ui/checkbox';
import { Field } from './ui/field';
import { Textarea } from './ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './ui/input-group';
import { Card, CardHeader } from './ui/card';
import { Select } from './ui/select';
import { Tabs, TabsList, TabsPanel, TabsTrigger } from './ui/tabs';

const defaultSettings = {
    load_owl_assets: true,
    load_owl_css: true,
    load_mousewheel_asset: true,
    swiper_source: 'bundled',
    load_swiper_css: true,
    icon_library: 'fontawesome',
    icon_source: 'local',
    global_breakpoints: {
        320: 2,
        480: 3,
        768: 3,
        1024: 4,
        1200: 4,
    },
};

const defaultIconLibraries = [
    { value: 'fontawesome', label: 'Font Awesome' },
    { value: 'tabler', label: 'Tabler Icons' },
];

const defaultIconSources = [
    { value: 'local', label: 'Local plugin files' },
    { value: 'cdn', label: 'CDN' },
    { value: 'existing', label: 'Already loaded by theme or plugin' },
];

function normalizeBreakpoints(value) {
    const source = value && typeof value === 'object' ? value : defaultSettings.global_breakpoints;

    return Object.keys(source)
        .sort((first, second) => Number(first) - Number(second))
        .reduce((result, width) => {
            const item = source[width];
            result[width] = Number(item && typeof item === 'object' ? item.items : item) || 1;

            return result;
        }, {});
}

function browserAssetDiagnostics(settings = defaultSettings) {
    if (typeof window === 'undefined') {
        return [];
    }

    const diagnostics = [];
    const ownOwlExpected = Boolean(settings.load_owl_assets);
    const ownSwiperExpected = settings.swiper_source === 'bundled';
    const iconAssetNodes = Array.from(document.querySelectorAll('link[href], script[src]'));

    const hasExternalAsset = (needles) => iconAssetNodes.some((node) => {
        const source = String(node.href || node.src || '').toLowerCase();

        return source && !source.includes('/wp-posts-carousel/') && needles.some((needle) => source.includes(needle));
    });

    if (window.jQuery?.fn?.owlCarousel && !ownOwlExpected) {
        diagnostics.push({
            library: 'owl',
            assetType: 'script',
            handle: 'window.jQuery.fn.owlCarousel',
            source: 'browser',
        });
    }

    if (window.Swiper && !ownSwiperExpected) {
        diagnostics.push({
            library: 'swiper',
            assetType: 'script',
            handle: 'window.Swiper',
            source: 'browser',
        });
    }

    if (settings.icon_library === 'fontawesome' && hasExternalAsset(['font-awesome', 'fontawesome', 'kit.fontawesome'])) {
        diagnostics.push({
            library: 'fontawesome',
            assetType: 'style',
            handle: 'fontawesome asset on page',
            source: 'browser',
        });
    }

    if (settings.icon_library === 'tabler' && hasExternalAsset(['tabler-icons', '@tabler/icons'])) {
        diagnostics.push({
            library: 'tabler',
            assetType: 'style',
            handle: 'tabler asset on page',
            source: 'browser',
        });
    }

    return diagnostics;
}

function mergeDiagnostics(...groups) {
    const seen = new Set();

    return groups.flat().filter((diagnostic) => {
        const key = [
            diagnostic.library,
            diagnostic.assetType,
            diagnostic.handle,
            diagnostic.src,
            diagnostic.source,
        ].join('|');

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function isDiagnosticRelevant(diagnostic, settings) {
    if (diagnostic.library === 'owl') {
        return Boolean(settings.load_owl_assets || settings.load_owl_css);
    }

    if (diagnostic.library === 'swiper') {
        return settings.swiper_source === 'bundled' || Boolean(settings.load_swiper_css);
    }

    if (diagnostic.library === 'fontawesome' || diagnostic.library === 'tabler') {
        return settings.icon_source !== 'existing' && settings.icon_library === diagnostic.library;
    }

    return false;
}

function diagnosticCopy(diagnostic) {
    if (diagnostic.library === 'owl') {
        return {
            title: __('Detected another Owl Carousel asset.', 'wp-posts-carousel'),
            message: __(
                'If your theme or another plugin already loads Owl Carousel, disable bundled Owl assets here to avoid version conflicts.',
                'wp-posts-carousel'
            ),
        };
    }

    if (diagnostic.library === 'fontawesome' || diagnostic.library === 'tabler') {
        return {
            title: __('Detected another icon library asset.', 'wp-posts-carousel'),
            message: __(
                'If your theme or another plugin already loads this icon library, switch icon source to the existing asset option.',
                'wp-posts-carousel'
            ),
        };
    }

    return {
        title: __('Detected another Swiper asset.', 'wp-posts-carousel'),
        message: __(
            'If your theme or another plugin already loads Swiper, switch Swiper source to the global window.Swiper option or disable bundled Swiper CSS when needed.',
            'wp-posts-carousel'
        ),
    };
}

export default function CompatibilitySettings({ setNotice, confirmAction }) {
    const [activeTab, setActiveTab] = useState('compatibility');
    const [settings, setSettings] = useState(defaultSettings);
    const [iconLibraries, setIconLibraries] = useState(defaultIconLibraries);
    const [iconSources, setIconSources] = useState(defaultIconSources);
    const [assetDiagnostics, setAssetDiagnostics] = useState([]);
    const [diagnostics, setDiagnostics] = useState(null);
    const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
    const [diagnosticsError, setDiagnosticsError] = useState('');
    const [diagnosticsRequested, setDiagnosticsRequested] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newBreakpoint, setNewBreakpoint] = useState('');
    const [newBreakpointError, setNewBreakpointError] = useState('');

    useEffect(() => {
        apiFetch('/wp-json/wp-posts-carousel/v1/admin/settings')
            .then((response) => {
                const nextSettings = {
                    ...defaultSettings,
                    ...(response.settings || {}),
                };

                setSettings(nextSettings);
                setIconLibraries(response.iconLibraries?.length ? response.iconLibraries : defaultIconLibraries);
                setIconSources(response.iconSources?.length ? response.iconSources : defaultIconSources);
                setAssetDiagnostics(mergeDiagnostics(response.assetDiagnostics || [], browserAssetDiagnostics(nextSettings)));
            })
            .catch(() => {
                setAssetDiagnostics(browserAssetDiagnostics(defaultSettings));
                setNotice({
                    type: 'error',
                    message: __('Failed loading compatibility settings.', 'wp-posts-carousel'),
                });
            })
            .finally(() => setLoading(false));
    }, [setNotice]);

    useEffect(() => {
        if (activeTab !== 'diagnostics' || diagnosticsRequested) {
            return;
        }

        loadDiagnostics();
    }, [activeTab, diagnosticsRequested]);

    const update = (key, value) => {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));
    };
    const breakpoints = normalizeBreakpoints(settings.global_breakpoints);
    const canRemoveBreakpoint = Object.keys(breakpoints).length > 1;
    const relevantDiagnostics = assetDiagnostics.filter((diagnostic) => isDiagnosticRelevant(diagnostic, settings));

    const updateBreakpoint = (width, items) => {
        update('global_breakpoints', {
            ...breakpoints,
            [width]: Number(items || 1),
        });
    };

    const addBreakpoint = () => {
        const width = Number(newBreakpoint);

        if (!width || width < 1) {
            setNewBreakpointError(__('Breakpoint width must be greater than 0.', 'wp-posts-carousel'));
            return;
        }

        updateBreakpoint(String(width), 1);
        setNewBreakpoint('');
        setNewBreakpointError('');
    };

    const removeBreakpoint = async (width) => {
        if (confirmAction) {
            const confirmed = await confirmAction({
                title: __('Delete global breakpoint?', 'wp-posts-carousel'),
                message: `${__('New carousels will no longer use this responsive rule by default:', 'wp-posts-carousel')} ${width}px.`,
                confirmLabel: __('Delete breakpoint', 'wp-posts-carousel'),
                cancelLabel: __('Keep breakpoint', 'wp-posts-carousel'),
                variant: 'danger',
            });

            if (!confirmed) {
                return;
            }
        }

        const nextBreakpoints = { ...breakpoints };
        delete nextBreakpoints[width];
        update('global_breakpoints', nextBreakpoints);
    };

    const save = () => {
        setSaving(true);

        apiFetch('/wp-json/wp-posts-carousel/v1/admin/settings', {
            method: 'POST',
            body: JSON.stringify(settings),
        })
            .then((response) => {
                setSettings({
                    ...defaultSettings,
                    ...(response.settings || {}),
                });
                setNotice({
                    type: 'success',
                    message: __('Compatibility settings were saved.', 'wp-posts-carousel'),
                });
            })
            .catch((error) => {
                setNotice({
                    type: 'error',
                    message: __('Failed saving compatibility settings.', 'wp-posts-carousel'),
                    details: error.message,
                });
            })
            .finally(() => setSaving(false));
    };

    const loadDiagnostics = () => {
        setDiagnosticsRequested(true);
        setDiagnosticsLoading(true);
        setDiagnosticsError('');

        apiFetch('/wp-json/wp-posts-carousel/v1/admin/diagnostics')
            .then((response) => setDiagnostics(response || {}))
            .catch((error) => {
                const message = error.message || __('Failed loading diagnostics.', 'wp-posts-carousel');

                setDiagnosticsError(message);
                setNotice({
                    type: 'error',
                    message: __('Failed loading diagnostics.', 'wp-posts-carousel'),
                    details: message,
                });
            })
            .finally(() => setDiagnosticsLoading(false));
    };

    const copyDiagnostics = () => {
        if (!diagnostics) {
            return;
        }

        const text = JSON.stringify(diagnostics, null, 2);

        if (!navigator.clipboard) {
            setNotice({
                type: 'error',
                message: __('Clipboard is not available in this browser.', 'wp-posts-carousel'),
            });
            return;
        }

        navigator.clipboard
            .writeText(text)
            .then(() => {
                setNotice({
                    type: 'success',
                    message: __('Diagnostics copied to clipboard.', 'wp-posts-carousel'),
                });
            })
            .catch(() => {
                setNotice({
                    type: 'error',
                    message: __('Failed copying diagnostics.', 'wp-posts-carousel'),
                });
            });
    };

    if (loading) {
        return (
            <Card>
                <div className='tw-grid tw-min-h-52 tw-place-items-center tw-p-8 tw-text-center tw-text-sm tw-text-cci-wpc-muted'>
                    {__('Loading compatibility settings...', 'wp-posts-carousel')}
                </div>
            </Card>
        );
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList aria-label={__('Settings sections', 'wp-posts-carousel')}>
                <TabsTrigger value='compatibility'>
                    <Settings aria-hidden='true' />
                    {__('Compatibility', 'wp-posts-carousel')}
                </TabsTrigger>
                <TabsTrigger value='diagnostics'>
                    <Bug aria-hidden='true' />
                    {__('Diagnostics', 'wp-posts-carousel')}
                    <span className='tw-inline-flex tw-min-w-6 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-px-2 tw-py-1 tw-text-[11px] tw-leading-none tw-text-cci-wpc-muted'>
                        {diagnostics?.logs?.length || 0}
                    </span>
                </TabsTrigger>
            </TabsList>

            <TabsPanel value='compatibility'>
                <CardHeader>
                    <div>
                        <h2>{__('Compatibility', 'wp-posts-carousel')}</h2>
                        <p>
                            {__(
                                'Control bundled carousel libraries when the theme already loads its own versions.',
                                'wp-posts-carousel'
                            )}
                        </p>
                    </div>
                    <Button variant='save' onClick={save} disabled={saving}>
                        {saving ? __('Saving...', 'wp-posts-carousel') : __('Save settings', 'wp-posts-carousel')}
                    </Button>
                </CardHeader>

                {relevantDiagnostics.length > 0 && (
                    <div className='tw-grid tw-gap-3 tw-p-4'>
                        {relevantDiagnostics.map((diagnostic) => {
                            const copy = diagnosticCopy(diagnostic);

                            return (
                                <div
                                    className='tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-warningBorder tw-bg-cci-wpc-warningBg tw-p-3 tw-text-cci-wpc-warningText [&_svg]:tw-mt-0.5 [&_svg]:tw-h-4 [&_svg]:tw-w-4'
                                    key={[
                                        diagnostic.library,
                                        diagnostic.assetType,
                                        diagnostic.handle,
                                        diagnostic.src,
                                        diagnostic.source,
                                    ].join('-')}
                                >
                                    <AlertTriangle aria-hidden='true' />
                                    <div>
                                        <strong className='tw-text-sm tw-font-semibold'>{copy.title}</strong>
                                        <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5'>{copy.message}</p>
                                        <small className='tw-mt-1 tw-block tw-text-xs tw-leading-5'>
                                            {diagnostic.handle ||
                                                diagnostic.src ||
                                                __('Detected on this page.', 'wp-posts-carousel')}
                                        </small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className='tw-grid tw-grid-cols-1 tw-gap-3 tw-p-4 lg:tw-grid-cols-2'>
                    <CheckboxField
                        checked={Boolean(settings.load_owl_assets)}
                        onCheckedChange={(checked) => update('load_owl_assets', checked === true)}
                    >
                        {__('Load bundled Owl Carousel JS', 'wp-posts-carousel')}
                    </CheckboxField>

                    <CheckboxField
                        checked={Boolean(settings.load_owl_css)}
                        onCheckedChange={(checked) => update('load_owl_css', checked === true)}
                    >
                        {__('Load bundled Owl Carousel CSS', 'wp-posts-carousel')}
                    </CheckboxField>

                    <CheckboxField
                        checked={Boolean(settings.load_mousewheel_asset)}
                        onCheckedChange={(checked) => update('load_mousewheel_asset', checked === true)}
                    >
                        {__('Load bundled mousewheel plugin', 'wp-posts-carousel')}
                    </CheckboxField>

                    <Field label={__('Swiper source', 'wp-posts-carousel')}>
                        <Select
                            value={settings.swiper_source || 'bundled'}
                            onValueChange={(value) => update('swiper_source', value)}
                            options={[
                                { value: 'bundled', label: __('Bundled with plugin', 'wp-posts-carousel') },
                                { value: 'global', label: __('Use global window.Swiper', 'wp-posts-carousel') },
                            ]}
                        />
                    </Field>

                    <Field label={__('Navigation icon library', 'wp-posts-carousel')}>
                        <Select
                            value={settings.icon_library || 'fontawesome'}
                            onValueChange={(value) => update('icon_library', value)}
                            options={iconLibraries.map((library) => ({
                                value: library.value,
                                label: library.label || library.value,
                            }))}
                        />
                    </Field>

                    <Field label={__('Icon source', 'wp-posts-carousel')}>
                        <Select
                            value={settings.icon_source || 'local'}
                            onValueChange={(value) => update('icon_source', value)}
                            options={iconSources.map((source) => ({
                                value: source.value,
                                label: source.label || source.value,
                            }))}
                        />
                        <small className='tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                            {__(
                                'Use existing assets when the active theme or another plugin already loads the selected icon library.',
                                'wp-posts-carousel'
                            )}
                        </small>
                    </Field>

                    <CheckboxField
                        checked={Boolean(settings.load_swiper_css)}
                        onCheckedChange={(checked) => update('load_swiper_css', checked === true)}
                    >
                        {__('Load bundled Swiper CSS', 'wp-posts-carousel')}
                    </CheckboxField>
                </div>

                <div className='tw-grid tw-gap-3 tw-border-0 tw-border-t tw-border-solid tw-border-cci-wpc-border tw-p-4'>
                    <div>
                        <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                            {__('Global breakpoints', 'wp-posts-carousel')}
                        </div>
                        <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                            {__(
                                'Default responsive items for new carousels. Each carousel can still override these values in its editor.',
                                'wp-posts-carousel'
                            )}
                        </p>
                    </div>

                    <div className='tw-grid tw-gap-2'>
                        {Object.keys(breakpoints).map((width) => (
                            <div
                                className='tw-grid tw-grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] tw-items-end tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-2'
                                key={width}
                            >
                                <Field label={__('Breakpoint', 'wp-posts-carousel')}>
                                    <InputGroup readOnly>
                                        <InputGroupInput type='number' value={width} readOnly />
                                        <InputGroupAddon align='inline-end' className='tw-min-w-12'>
                                            <InputGroupText>px</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>
                                <Field label={__('Items', 'wp-posts-carousel')}>
                                    <InputGroup>
                                        <InputGroupInput
                                            type='number'
                                            min='1'
                                            value={breakpoints[width]}
                                            onChange={(event) => updateBreakpoint(width, event.target.value)}
                                        />
                                        <InputGroupAddon align='inline-end' className='tw-min-w-12'>
                                            <InputGroupText>{__('items', 'wp-posts-carousel')}</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Field>
                                {canRemoveBreakpoint && (
                                    <Button size='icon'
                                        variant='danger'
                                        onClick={() => removeBreakpoint(width)}
                                        aria-label={__('Remove breakpoint', 'wp-posts-carousel')}
                                        title={__('Remove breakpoint', 'wp-posts-carousel')}
                                    >
                                        <Trash2 aria-hidden='true' />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className='tw-grid tw-grid-cols-[minmax(0,1fr)_auto] tw-items-end tw-gap-2'>
                        <Field label={__('New breakpoint', 'wp-posts-carousel')} error={newBreakpointError}>
                            <InputGroup invalid={Boolean(newBreakpointError)}>
                                <InputGroupInput
                                    type='number'
                                    min='1'
                                    placeholder='1440'
                                    invalid={Boolean(newBreakpointError)}
                                    value={newBreakpoint}
                                    onChange={(event) => {
                                        setNewBreakpoint(event.target.value);
                                        setNewBreakpointError('');
                                    }}
                                />
                                <InputGroupAddon align='inline-end' className='tw-min-w-12'>
                                    <InputGroupText>px</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Button variant='outlineAccent' onClick={addBreakpoint}>
                            <Plus aria-hidden='true' />
                            {__('Add breakpoint', 'wp-posts-carousel')}
                        </Button>
                    </div>
                </div>
            </TabsPanel>
            <TabsPanel value='diagnostics'>
                <DiagnosticsPanel
                    diagnostics={diagnostics}
                    loading={diagnosticsLoading}
                    error={diagnosticsError}
                    onRefresh={loadDiagnostics}
                    onCopy={copyDiagnostics}
                />
            </TabsPanel>
        </Tabs>
    );
}

function DiagnosticsPanel({ diagnostics, loading, error, onRefresh, onCopy }) {
    const json = diagnostics ? JSON.stringify(diagnostics, null, 2) : '';
    const logs = Array.isArray(diagnostics?.logs) ? diagnostics.logs : [];
    const activePlugins = Array.isArray(diagnostics?.activePlugins) ? diagnostics.activePlugins : [];
    const assetDiagnostics = Array.isArray(diagnostics?.assetDiagnostics) ? diagnostics.assetDiagnostics : [];

    return (
        <section>
            <CardHeader>
                <div>
                    <h2>{__('Diagnostics and logs', 'wp-posts-carousel')}</h2>
                    <p>
                        {__(
                            'Copy this report when you contact paid support. It excludes license keys and tokens.',
                            'wp-posts-carousel'
                        )}
                    </p>
                </div>
                <div className='tw-flex tw-flex-wrap tw-gap-2'>
                    <Button onClick={onRefresh} disabled={loading}>
                        <RefreshCw aria-hidden='true' />
                        {loading ? __('Refreshing...', 'wp-posts-carousel') : __('Refresh', 'wp-posts-carousel')}
                    </Button>
                    <Button variant='outlineAccent' onClick={onCopy} disabled={!diagnostics || loading}>
                        <Clipboard aria-hidden='true' />
                        {__('Copy report', 'wp-posts-carousel')}
                    </Button>
                </div>
            </CardHeader>

            {error && (
                <div className='tw-grid tw-gap-3 tw-p-4'>
                    <div className='tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-warningBorder tw-bg-cci-wpc-warningBg tw-p-3 tw-text-cci-wpc-warningText [&_svg]:tw-mt-0.5 [&_svg]:tw-h-4 [&_svg]:tw-w-4'>
                        <AlertTriangle aria-hidden='true' />
                        <div>
                            <strong className='tw-text-sm tw-font-semibold'>
                                {__('Diagnostics could not be loaded.', 'wp-posts-carousel')}
                            </strong>
                            <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5'>{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading && !diagnostics ? (
                <div className='tw-grid tw-min-h-52 tw-place-items-center tw-p-8 tw-text-center tw-text-sm tw-text-cci-wpc-muted'>
                    {__('Loading diagnostics...', 'wp-posts-carousel')}
                </div>
            ) : (
                <div className='tw-grid tw-gap-4 tw-p-4'>
                    <div className='tw-grid tw-gap-1 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-infoBorder tw-bg-cci-wpc-infoBg tw-p-3 tw-text-cci-wpc-infoText'>
                        <strong className='tw-text-sm tw-font-semibold'>
                            {__('Support note', 'wp-posts-carousel')}
                        </strong>
                        <span className='tw-text-xs tw-leading-5'>
                            {__(
                                'This report helps verify versions, active add-ons, asset conflicts and the last license status without exposing your private license key.',
                                'wp-posts-carousel'
                            )}
                        </span>
                    </div>

                    <div className='tw-grid tw-grid-cols-1 tw-gap-3 lg:tw-grid-cols-3'>
                        <DiagnosticCard
                            label={__('Plugin', 'wp-posts-carousel')}
                            values={[
                                [__('Free version', 'wp-posts-carousel'), diagnostics?.plugin?.version || '-'],
                                [
                                    __('Pro active', 'wp-posts-carousel'),
                                    diagnostics?.plugin?.isPro
                                        ? __('Yes', 'wp-posts-carousel')
                                        : __('No', 'wp-posts-carousel'),
                                ],
                                [__('License status', 'wp-posts-carousel'), diagnostics?.license?.status || '-'],
                            ]}
                        />
                        <DiagnosticCard
                            label={__('Environment', 'wp-posts-carousel')}
                            values={[
                                [__('WordPress', 'wp-posts-carousel'), diagnostics?.wordpress?.version || '-'],
                                [__('PHP', 'wp-posts-carousel'), diagnostics?.server?.phpVersion || '-'],
                                [__('Theme', 'wp-posts-carousel'), diagnostics?.theme?.name || '-'],
                            ]}
                        />
                        <DiagnosticCard
                            label={__('Checks', 'wp-posts-carousel')}
                            values={[
                                [__('Active plugins', 'wp-posts-carousel'), String(activePlugins.length)],
                                [__('Asset warnings', 'wp-posts-carousel'), String(assetDiagnostics.length)],
                                [__('Logs', 'wp-posts-carousel'), String(logs.length)],
                            ]}
                        />
                    </div>

                    <div className='tw-grid tw-gap-3'>
                        <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                            {__('Recent logs', 'wp-posts-carousel')}
                        </div>
                        {logs.length ? (
                            <ul className='tw-m-0 tw-grid tw-list-none tw-gap-2 tw-p-0'>
                                {logs.map((log, index) => (
                                    <li
                                        className='tw-grid tw-gap-1 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3'
                                        key={`${log.type || 'log'}-${index}`}
                                    >
                                        <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                            {log.type || __('Log', 'wp-posts-carousel')}
                                        </strong>
                                        <span className='tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>{log.message}</span>
                                        {log.date && <small className='tw-text-xs tw-text-cci-wpc-muted'>{formatAdminDateTime(log.date, pluginData.adminDate)}</small>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className='tw-m-0 tw-text-sm tw-text-cci-wpc-muted'>
                                {__('No recent license or compatibility logs were recorded.', 'wp-posts-carousel')}
                            </p>
                        )}
                    </div>

                    <label className='tw-grid tw-gap-1.5'>
                        <span className='tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-slate-600'>
                            {__('Raw diagnostic report', 'wp-posts-carousel')}
                        </span>
                        <Textarea readOnly value={json} rows='16' />
                    </label>
                </div>
            )}
        </section>
    );
}

function DiagnosticCard({ label, values }) {
    return (
        <div className='tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-4'>
            <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>{label}</strong>
            <dl className='tw-m-0 tw-mt-3 tw-grid tw-gap-2'>
                {values.map(([name, value]) => (
                    <div className='tw-flex tw-items-center tw-justify-between tw-gap-3' key={name}>
                        <dt className='tw-text-xs tw-text-cci-wpc-muted'>{name}</dt>
                        <dd className='tw-m-0 tw-text-right tw-text-xs tw-font-semibold tw-text-cci-wpc-text'>{value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
