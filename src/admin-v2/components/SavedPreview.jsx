import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { __ } from '../i18n';
import CarouselRenderer from '../../shared/CarouselRenderer';
import { Button } from './ui/button';

export default function SavedPreview({ preview, open, onClose }) {
    const bodyRef = useRef(null);
    const hasFrontendHtml = typeof preview?.html === 'string';
    const html = hasFrontendHtml ? preview.html : '';

    useEffect(() => {
        if (!open || !html || !bodyRef.current) {
            return;
        }

        bodyRef.current.querySelectorAll('script').forEach((script) => {
            const nextScript = document.createElement('script');

            Array.from(script.attributes).forEach((attribute) => {
                nextScript.setAttribute(attribute.name, attribute.value);
            });

            nextScript.text = script.textContent || '';
            script.parentNode.replaceChild(nextScript, script);
        });
    }, [open, html]);

    if (!open) {
        return null;
    }

    const slides = Array.isArray(preview?.slides) ? preview.slides : [];

    return (
        <div
            className='tw-fixed tw-inset-0 tw-z-[100000] tw-grid tw-place-items-end tw-bg-slate-900/35'
            role='dialog'
            aria-modal='true'
            aria-label={__('Carousel preview', 'wp-posts-carousel')}
        >
            <button
                type='button'
                className='tw-absolute tw-inset-0 tw-cursor-default tw-border-0 tw-bg-transparent tw-p-0'
                onClick={onClose}
            >
                <span className='tw-sr-only'>{__('Close preview', 'wp-posts-carousel')}</span>
            </button>
            <div className='tw-relative tw-grid tw-h-[calc(100vh-32px)] tw-w-full tw-grid-rows-[auto_minmax(0,1fr)] tw-border-0 tw-border-l tw-border-solid tw-border-cci-wpc-border tw-bg-white lg:tw-w-[min(1180px,calc(100vw-220px))]'>
                <div className='tw-flex tw-items-center tw-justify-between tw-gap-4 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-5 tw-py-4'>
                    <div>
                        <strong className='tw-block tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text'>
                            {__('Carousel preview', 'wp-posts-carousel')}
                        </strong>
                        <span className='tw-mt-1 tw-block tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                            {preview?.title || __('Saved carousel', 'wp-posts-carousel')}
                            {slides.length ? ` · ${slides.length} ${__('slides', 'wp-posts-carousel')}` : ''}
                        </span>
                    </div>
                    <Button
                        size='icon'
                        type='button'
                        onClick={onClose}
                    >
                        <X aria-hidden='true' />
                        <span className='tw-sr-only'>{__('Close preview', 'wp-posts-carousel')}</span>
                    </Button>
                </div>

                <div className='tw-min-h-0 tw-overflow-auto tw-bg-cci-wpc-bg tw-p-6' ref={bodyRef}>
                    {preview ? (
                        html ? (
                            <div className='tw-min-w-0' dangerouslySetInnerHTML={{ __html: html }} />
                        ) : hasFrontendHtml ? (
                            <div className='tw-grid tw-min-h-52 tw-place-items-center tw-p-8 tw-text-center tw-text-sm tw-text-cci-wpc-muted'>
                                {__(
                                    'Frontend preview is not available for this carousel configuration. Check template requirements, Pro license status or frontend asset settings.',
                                    'wp-posts-carousel'
                                )}
                            </div>
                        ) : (
                            <CarouselRenderer
                                carousel={preview}
                                interactive={true}
                                labels={{
                                    previous: __('previous', 'wp-posts-carousel'),
                                    next: __('next', 'wp-posts-carousel'),
                                }}
                                layout='carousel'
                                limit={0}
                            />
                        )
                    ) : (
                        <div className='tw-grid tw-min-h-52 tw-place-items-center tw-p-8 tw-text-center tw-text-sm tw-text-cci-wpc-muted'>
                            {__('Preview is loading...', 'wp-posts-carousel')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
