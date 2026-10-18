import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, Image, LockKeyhole, Search, X } from 'lucide-react';
import { __ } from '../../i18n/i18n';
import ProBadge from '../licensing/ProBadge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const FILTERS = ['all', 'free', 'pro'];

export default function TemplatePicker({ templates, value, onChange }) {
    const [open, setOpen] = useState(false);
    const [pendingValue, setPendingValue] = useState(value);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const dialogRef = useRef(null);
    const searchRef = useRef(null);
    const titleId = useId();
    const descriptionId = useId();
    const selectedTemplate = useMemo(
        () => templates.find((template) => template.name === value) || null,
        [templates, value]
    );
    const pendingTemplate = useMemo(
        () => templates.find((template) => template.name === pendingValue) || selectedTemplate,
        [pendingValue, selectedTemplate, templates]
    );
    const filteredTemplates = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase();

        return templates
            .filter((template) => {
                if (filter === 'free' && template.pro) {
                    return false;
                }

                if (filter === 'pro' && !template.pro) {
                    return false;
                }

                if (!normalizedQuery) {
                    return true;
                }

                return [template.template_name, template.name, template.description]
                    .filter(Boolean)
                    .some((field) => String(field).toLocaleLowerCase().includes(normalizedQuery));
            })
            .sort((left, right) => {
                if (left.name === value) {
                    return -1;
                }

                if (right.name === value) {
                    return 1;
                }

                return String(left.template_name || left.name).localeCompare(String(right.template_name || right.name));
            });
    }, [filter, query, templates, value]);

    const closePicker = useCallback(() => setOpen(false), []);

    const openPicker = () => {
        setPendingValue(value);
        setQuery('');
        setFilter('all');
        setOpen(true);
    };

    const applyTemplate = () => {
        if (!pendingTemplate || pendingTemplate.locked) {
            return;
        }

        if (pendingTemplate.name !== value) {
            onChange(pendingTemplate.name);
        }

        closePicker();
    };

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        const previousActiveElement = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        const focusTimer = window.setTimeout(() => searchRef.current?.focus(), 0);

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closePicker();
                return;
            }

            if (event.key !== 'Tab' || !dialogRef.current) {
                return;
            }

            const focusableElements = Array.from(
                dialogRef.current.querySelectorAll(
                    'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
                )
            );

            if (!focusableElements.length) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previousActiveElement?.focus?.();
        };
    }, [closePicker, open]);

    if (!templates.length) {
        return null;
    }

    return (
        <div className='tw-grid tw-gap-3' data-slot='template-picker'>
            <div>
                <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                    {__('Template', 'cci-posts-carousel')}
                </div>
                <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                    {__('Choose the visual layout used by this carousel.', 'cci-posts-carousel')}
                </p>
            </div>

            <div
                className='tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3 sm:tw-grid-cols-[112px_minmax(0,1fr)_auto] sm:tw-items-center'
                data-slot='template-picker-summary'
            >
                <TemplatePreview template={selectedTemplate} compact />
                <div className='tw-min-w-0'>
                    <strong className='tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                        {templateLabel(selectedTemplate, value)}
                        {selectedTemplate?.pro && <ProBadge>{__('Pro', 'cci-posts-carousel')}</ProBadge>}
                    </strong>
                    {selectedTemplate?.description && (
                        <p className='tw-m-0 tw-mt-1 tw-line-clamp-2 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                            {selectedTemplate.description}
                        </p>
                    )}
                </div>
                <Button type='button' variant='outlineAccent' size='sm' onClick={openPicker}>
                    {__('Change', 'cci-posts-carousel')}
                </Button>
            </div>

            {open && (
                <div
                    className='tw-fixed tw-inset-0 tw-z-[100000] tw-grid tw-place-items-center tw-p-4'
                    role='presentation'
                >
                    <button
                        type='button'
                        className='tw-absolute tw-inset-0 tw-cursor-default tw-border-0 tw-bg-slate-950/40 tw-p-0'
                        aria-label={__('Close template picker', 'cci-posts-carousel')}
                        onClick={closePicker}
                    />
                    <div
                        ref={dialogRef}
                        className='tw-relative tw-grid tw-max-h-[calc(100vh-32px)] tw-w-[min(1120px,calc(100vw-32px))] tw-grid-rows-[auto_auto_minmax(0,1fr)_auto] tw-overflow-hidden tw-rounded-lg tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-shadow-2xl'
                        data-slot='template-picker-dialog'
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                    >
                        <header className='tw-relative tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-p-5 tw-pr-14'>
                            <h2
                                id={titleId}
                                className='tw-m-0 tw-text-xl tw-font-semibold tw-leading-tight tw-text-cci-wpc-text'
                            >
                                {__('Choose a template', 'cci-posts-carousel')}
                            </h2>
                            <p
                                id={descriptionId}
                                className='tw-m-0 tw-mt-1 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'
                            >
                                {__(
                                    'Preview installed layouts and confirm the template you want to use.',
                                    'cci-posts-carousel'
                                )}
                            </p>
                            <Button
                                type='button'
                                size='iconSm'
                                className='tw-absolute tw-right-4 tw-top-4'
                                aria-label={__('Close template picker', 'cci-posts-carousel')}
                                onClick={closePicker}
                            >
                                <X aria-hidden='true' />
                            </Button>
                        </header>

                        <div className='tw-flex tw-flex-col tw-gap-3 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-4 md:tw-flex-row md:tw-items-center md:tw-justify-between'>
                            <div className='tw-relative tw-w-full md:tw-max-w-sm'>
                                <span
                                    aria-hidden='true'
                                    className='tw-pointer-events-none tw-absolute tw-inset-y-0 tw-left-3 tw-flex tw-items-center'
                                >
                                    <Search className='tw-h-4 tw-w-4 tw-shrink-0 tw-text-cci-wpc-muted' />
                                </span>
                                <Input
                                    ref={searchRef}
                                    type='search'
                                    className='tw-bg-white !tw-pl-10'
                                    value={query}
                                    placeholder={__('Search templates', 'cci-posts-carousel')}
                                    aria-label={__('Search templates', 'cci-posts-carousel')}
                                    onChange={(event) => setQuery(event.target.value)}
                                />
                            </div>
                            <div
                                className='tw-flex tw-flex-wrap tw-gap-2'
                                role='group'
                                aria-label={__('Template type', 'cci-posts-carousel')}
                            >
                                {FILTERS.map((filterValue) => (
                                    <Button
                                        key={filterValue}
                                        type='button'
                                        size='sm'
                                        variant={filter === filterValue ? 'primary' : 'secondary'}
                                        aria-pressed={filter === filterValue}
                                        onClick={() => setFilter(filterValue)}
                                    >
                                        {filterLabel(filterValue)}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className='tw-min-h-0 tw-overflow-y-auto tw-p-4 md:tw-p-5'>
                            {filteredTemplates.length ? (
                                <div className='tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-2 lg:tw-grid-cols-3'>
                                    {filteredTemplates.map((template) => (
                                        <TemplateOption
                                            key={template.name}
                                            template={template}
                                            selected={template.name === pendingTemplate?.name}
                                            current={template.name === value}
                                            onSelect={() => setPendingValue(template.name)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className='tw-grid tw-min-h-48 tw-place-items-center tw-rounded-md tw-border tw-border-dashed tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-6 tw-text-center'>
                                    <div>
                                        <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                            {__('No matching templates', 'cci-posts-carousel')}
                                        </strong>
                                        <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                                            {__('Try another search phrase or template type.', 'cci-posts-carousel')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <footer className='tw-grid tw-gap-2 tw-border-0 tw-border-t tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3 sm:tw-gap-3 sm:tw-p-4 md:tw-grid-cols-[minmax(0,1fr)_auto] md:tw-items-center'>
                            <div className='tw-min-w-0'>
                                <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
                                    <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                        {templateLabel(pendingTemplate, pendingValue)}
                                    </strong>
                                    {pendingTemplate?.pro && <ProBadge>{__('Pro', 'cci-posts-carousel')}</ProBadge>}
                                </div>
                                {pendingTemplate?.locked ? (
                                    <p className='tw-m-0 tw-mt-1 tw-hidden tw-text-xs tw-leading-5 tw-text-cci-wpc-brandStrong sm:tw-block'>
                                        {pendingTemplate.availability?.message ||
                                            __(
                                                'This template requires an active Pro license for this domain.',
                                                'cci-posts-carousel'
                                            )}
                                    </p>
                                ) : pendingTemplate?.description ? (
                                    <p className='tw-m-0 tw-mt-1 tw-hidden tw-line-clamp-2 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted sm:tw-block'>
                                        {pendingTemplate.description}
                                    </p>
                                ) : null}
                            </div>
                            <div className='tw-grid tw-grid-cols-2 tw-gap-2 sm:tw-flex sm:tw-flex-row sm:tw-justify-end'>
                                <Button type='button' variant='secondary' className='tw-w-full' onClick={closePicker}>
                                    {__('Cancel', 'cci-posts-carousel')}
                                </Button>
                                <Button
                                    type='button'
                                    variant={
                                        !pendingTemplate || pendingTemplate.locked || pendingTemplate.name === value
                                            ? 'secondary'
                                            : 'primary'
                                    }
                                    className={`tw-w-full ${
                                        !pendingTemplate || pendingTemplate.locked || pendingTemplate.name === value
                                            ? 'cci-wpc-subtle disabled:!tw-opacity-100'
                                            : ''
                                    }`}
                                    disabled={
                                        !pendingTemplate || pendingTemplate.locked || pendingTemplate.name === value
                                    }
                                    onClick={applyTemplate}
                                >
                                    {pendingTemplate?.locked
                                        ? __('Requires Pro', 'cci-posts-carousel')
                                        : pendingTemplate?.name === value
                                          ? __('Current template', 'cci-posts-carousel')
                                          : __('Use template', 'cci-posts-carousel')}
                                </Button>
                            </div>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}

function TemplateOption({ template, selected, current, onSelect }) {
    return (
        <button
            type='button'
            className={`tw-relative tw-grid tw-min-w-0 tw-cursor-pointer tw-gap-3 tw-overflow-hidden tw-rounded-md tw-border tw-border-solid tw-bg-white tw-p-0 tw-text-left tw-shadow-none tw-transition-colors focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-cci-wpc-brand ${
                selected
                    ? 'tw-border-cci-wpc-brand tw-ring-2 tw-ring-cci-wpc-brandSoft'
                    : 'tw-border-cci-wpc-border hover:tw-border-cci-wpc-brandBorder'
            }`}
            aria-pressed={selected}
            data-slot='template-picker-option'
            data-template-name={template.name}
            onClick={onSelect}
        >
            <TemplatePreview template={template} />
            <span className='tw-grid tw-gap-2 tw-px-3 tw-pb-3'>
                <span className='tw-flex tw-min-w-0 tw-items-start tw-justify-between tw-gap-2'>
                    <strong className='tw-min-w-0 tw-text-sm tw-font-semibold tw-leading-5 tw-text-cci-wpc-text'>
                        {templateLabel(template)}
                    </strong>
                    {selected && (
                        <span className='tw-grid tw-h-6 tw-w-6 tw-shrink-0 tw-place-items-center tw-rounded-full tw-bg-cci-wpc-brand tw-text-white'>
                            <Check aria-hidden='true' className='tw-h-4 tw-w-4' />
                            <span className='tw-sr-only'>{__('Selected', 'cci-posts-carousel')}</span>
                        </span>
                    )}
                </span>
                <span className='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
                    {template.pro ? (
                        <ProBadge>{__('Pro', 'cci-posts-carousel')}</ProBadge>
                    ) : (
                        <span className='tw-text-xs tw-text-cci-wpc-muted'>{__('Free', 'cci-posts-carousel')}</span>
                    )}
                    {current && (
                        <span className='tw-text-xs tw-font-semibold tw-text-cci-wpc-brandStrong'>
                            {__('Current', 'cci-posts-carousel')}
                        </span>
                    )}
                    {template.locked && (
                        <span className='tw-inline-flex tw-items-center tw-gap-1 tw-text-xs tw-font-semibold tw-text-cci-wpc-brandStrong'>
                            <LockKeyhole aria-hidden='true' className='tw-h-3.5 tw-w-3.5' />
                            {__('Locked', 'cci-posts-carousel')}
                        </span>
                    )}
                </span>
            </span>
        </button>
    );
}

function TemplatePreview({ template, compact = false }) {
    const label = templateLabel(template);

    return (
        <span
            className={`tw-grid tw-place-items-center tw-overflow-hidden tw-bg-cci-wpc-surfaceSoft tw-text-cci-wpc-muted ${
                compact ? 'tw-aspect-[16/9] tw-w-full tw-rounded-md' : 'tw-aspect-[16/9] tw-w-full'
            }`}
        >
            {template?.screenshot ? (
                <img
                    className='tw-h-full tw-w-full tw-object-cover'
                    src={template.screenshot}
                    alt={
                        label
                            ? __('Preview of %s', 'cci-posts-carousel').replace('%s', label)
                            : __('Template preview', 'cci-posts-carousel')
                    }
                />
            ) : (
                <Image aria-hidden='true' className='tw-h-6 tw-w-6' />
            )}
        </span>
    );
}

function templateLabel(template, fallback = '') {
    return template?.template_name || template?.name || fallback || __('Unknown template', 'cci-posts-carousel');
}

function filterLabel(value) {
    if (value === 'free') {
        return __('Free', 'cci-posts-carousel');
    }

    if (value === 'pro') {
        return __('Pro', 'cci-posts-carousel');
    }

    return __('All', 'cci-posts-carousel');
}
