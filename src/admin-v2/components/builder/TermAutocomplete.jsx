import React, { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { autoUpdate, flip, hide, offset, shift, size, useFloating } from '@floating-ui/react-dom';
import { apiFetch } from '../../api/api';
import { __ } from '../../i18n/i18n';
import { normalizeTermOption } from '../../lib/utils';
import { Input } from '../ui/input';

export default function TermAutocomplete({ taxonomy, selectedValues, onSelect }) {
    const listId = useId();
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const { refs, floatingStyles, middlewareData } = useFloating({
        open,
        placement: 'bottom-start',
        strategy: 'fixed',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(4),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
            size({
                padding: 8,
                apply({ availableHeight, availableWidth, rects, elements }) {
                    Object.assign(elements.floating.style, {
                        width: `${Math.min(rects.reference.width, Math.max(0, availableWidth))}px`,
                        maxHeight: `${Math.min(256, Math.max(0, availableHeight))}px`,
                    });
                },
            }),
            hide(),
        ],
    });
    const label = taxonomy.name === 'category'
        ? __('Search categories', 'cci-posts-carousel')
        : taxonomy.name === 'post_tag'
            ? __('Search tags', 'cci-posts-carousel')
            : __('Search terms', 'cci-posts-carousel');
    const available = results.filter((term) => !selectedValues.includes(term.value));

    useEffect(() => {
        if (!open) return undefined;
        const dismissOutside = (event) => {
            if (!refs.reference.current?.contains(event.target) && !refs.floating.current?.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', dismissOutside);
        return () => document.removeEventListener('pointerdown', dismissOutside);
    }, [open, refs]);

    useEffect(() => {
        if (open && activeIndex >= 0) {
            document.getElementById(listId + '-' + activeIndex)?.scrollIntoView({ block: 'nearest' });
        }
    }, [open, activeIndex, listId]);

    useEffect(() => {
        if (!open) return undefined;
        const controller = new AbortController();
        let current = true;
        setLoading(true);
        setError(false);
        setResults([]);
        setActiveIndex(-1);
        const timer = window.setTimeout(() => {
            apiFetch('/wp-json/wp-posts-carousel/v1/admin/terms', {
                method: 'POST',
                signal: controller.signal,
                body: JSON.stringify({ post_type: taxonomy.post_type, taxonomy: taxonomy.name, s: search.trim() }),
            }).then((response) => {
                if (current) setResults(response.map(normalizeTermOption));
            }).catch((failure) => {
                if (current && failure.name !== 'AbortError') setError(true);
            }).finally(() => {
                if (current) setLoading(false);
            });
        }, 250);
        return () => { current = false; window.clearTimeout(timer); controller.abort(); };
    }, [open, search, taxonomy.name, taxonomy.post_type]);

    const choose = (term) => {
        onSelect(term);
        setSearch('');
        setOpen(false);
        setResults([]);
        setActiveIndex(-1);
    };
    const navigate = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
            if (available.length) setActiveIndex((index) =>
                event.key === 'ArrowDown' ? (index + 1) % available.length : (index <= 0 ? available.length - 1 : index - 1));
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (open && !loading && available.length) choose(available[Math.max(0, Math.min(activeIndex, available.length - 1))]);
            else setOpen(true);
        }
    };

    return (
        <div className='tw-relative tw-min-w-0' onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget) && !refs.floating.current?.contains(event.relatedTarget)) setOpen(false);
        }}>
            <Input
                ref={refs.setReference}
                role='combobox'
                aria-label={label}
                aria-autocomplete='list'
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={open && available[activeIndex] ? listId + '-' + activeIndex : undefined}
                autoComplete='off'
                placeholder={label}
                value={search}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                onChange={(event) => { setSearch(event.target.value); setOpen(true); setResults([]); setActiveIndex(-1); }}
                onKeyDown={navigate}
            />
            {open && createPortal(
                <div
                    ref={refs.setFloating}
                    style={{ ...floatingStyles, visibility: middlewareData.hide?.referenceHidden ? 'hidden' : undefined }}
                    className='tw-z-[100000] tw-box-border tw-max-h-64 tw-overflow-y-auto tw-overscroll-contain tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-1'
                >
                    <div role='status' aria-live='polite' className='tw-text-sm tw-text-cci-wpc-muted'>
                        {(loading || error || !available.length) && (
                            <p className='tw-m-0 tw-px-3 tw-py-2'>
                                {loading ? __('Searching...', 'cci-posts-carousel') : error
                                    ? __('Could not load terms. Focus the field to try again.', 'cci-posts-carousel')
                                    : __('No matching terms.', 'cci-posts-carousel')}
                            </p>
                        )}
                    </div>
                    <div id={listId} role='listbox' aria-label={label} aria-busy={loading}>
                        {!loading && !error && available.map((term, index) => (
                            <button
                                key={term.value}
                                id={listId + '-' + index}
                                type='button'
                                role='option'
                                aria-selected={index === activeIndex}
                                tabIndex={-1}
                                className={'tw-block tw-w-full tw-cursor-pointer tw-rounded-sm tw-border-0 tw-px-3 tw-py-2 tw-text-left tw-text-sm tw-text-cci-wpc-text hover:tw-bg-cci-wpc-brandSoft ' + (index === activeIndex ? 'tw-bg-cci-wpc-brandSoft' : 'tw-bg-white')}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => choose(term)}
                            >{term.label}</button>
                        ))}
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}
