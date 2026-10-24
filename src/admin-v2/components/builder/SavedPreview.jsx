import React, { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { __ } from '../../i18n/i18n';
import CarouselRenderer from '../../../shared/CarouselRenderer';
import { Button } from '../ui/button';
import { Select } from '../ui/select';

export default function SavedPreview({ preview, open, onClose }) {
  const bodyRef = useRef(null);
  const widthId = useId();
  const [previewWidth, setPreviewWidth] = useState('full');
  const hasFrontendHtml = typeof preview?.html === 'string';
  const html = hasFrontendHtml ? preview.html : '';
  const options = preview?.engine?.options || {};
  const breakpoints = options.items_to_show || options.breakpoints || {};
  const widths = Object.keys(breakpoints)
    .map(Number)
    .filter((width) => Number.isFinite(width) && width > 0)
    .sort((a, b) => a - b);
  const selectedWidth = widths.includes(Number(previewWidth)) ? previewWidth : 'full';
  const canvasId = `wpc-preview-${widthId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

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

  useEffect(() => {
    const canvas = bodyRef.current;
    if (open && html && options.rows === 2 && canvas) {
      const root = canvas.querySelector('.cci-wpc-carousel');
      if (root) window.wpPostsCarouselLazyLoad?.render(root, preview, {});
    }
  }, [open, html, preview, options.rows]);

  useEffect(() => {
    const canvas = bodyRef.current;
    if (!open || !canvas) {
      return;
    }

    // Owl listens to window resizing, but changing the preview column does
    // not resize the window. Refresh its measured width without remounting.
    let previousWidth;
    let frame;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        canvas.querySelectorAll('.owl-carousel').forEach((element) => {
          const carousel = window.jQuery?.(element).data('owl.carousel');
          if (carousel) {
            carousel.options.responsiveBaseElement = canvas;
            carousel.invalidate('width');
            carousel.refresh();
          }
        });
      });
    };
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width === previousWidth) {
        return;
      }
      previousWidth = width;
      refresh();
    });
    window.jQuery?.(canvas).on('initialized.owl.carousel', refresh);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.jQuery?.(canvas).off('initialized.owl.carousel', refresh);
    };
  }, [open, html]);

  if (!open) {
    return null;
  }

  const slides = Array.isArray(preview?.slides) ? preview.slides : [];

  return (
    <div
      className="cci-wpc-saved-preview tw-fixed tw-inset-0 tw-z-[100000] tw-grid tw-grid-cols-[minmax(0,1fr)] tw-place-items-end tw-bg-slate-900/35"
      role="dialog"
      aria-modal="true"
      aria-label={__('Carousel preview', 'cci-posts-carousel')}
    >
      <button
        type="button"
        className="tw-absolute tw-inset-0 tw-cursor-default tw-border-0 tw-bg-transparent tw-p-0"
        onClick={onClose}
      >
        <span className="tw-sr-only">{__('Close preview', 'cci-posts-carousel')}</span>
      </button>
      <div className="tw-relative tw-grid tw-min-w-0 tw-h-[calc(100vh-32px)] tw-w-full tw-grid-cols-[minmax(0,1fr)] tw-grid-rows-[auto_auto_minmax(0,1fr)] tw-border-0 tw-border-l tw-border-solid tw-border-cci-wpc-border tw-bg-white lg:tw-w-[min(1180px,calc(100vw-220px))]">
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-4 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-5 tw-py-4">
          <div>
            <strong className="tw-block tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text">
              {__('Carousel preview', 'cci-posts-carousel')}
            </strong>
            <span className="tw-mt-1 tw-block tw-text-sm tw-leading-5 tw-text-cci-wpc-muted">
              {preview?.title || __('Saved carousel', 'cci-posts-carousel')}
              {slides.length ? ` · ${slides.length} ${__('slides', 'cci-posts-carousel')}` : ''}
            </span>
          </div>
          <Button size="icon" type="button" onClick={onClose}>
            <X aria-hidden="true" />
            <span className="tw-sr-only">{__('Close preview', 'cci-posts-carousel')}</span>
          </Button>
        </div>

        <div className="tw-grid tw-gap-3 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-5 tw-py-3 sm:tw-grid-cols-[minmax(0,1fr)_240px] sm:tw-items-center sm:tw-gap-6">
          <div className="tw-min-w-0">
            <label
              htmlFor={widthId}
              className="tw-block tw-text-sm tw-font-semibold tw-leading-5 tw-text-cci-wpc-text"
            >
              {__('Preview width', 'cci-posts-carousel')}
            </label>
            <p className="tw-m-0 tw-mt-1 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted">
              {__(
                'Check the responsive widths configured for this carousel.',
                'cci-posts-carousel',
              )}
            </p>
          </div>
          <Select
            id={widthId}
            ariaLabel={__('Preview width', 'cci-posts-carousel')}
            value={selectedWidth}
            onValueChange={setPreviewWidth}
            options={[
              { value: 'full', label: __('Full width', 'cci-posts-carousel') },
              ...widths.map((width) => ({ value: String(width), label: `${width} px` })),
            ]}
          />
        </div>
        <div className="tw-min-h-0 tw-min-w-0 tw-overflow-auto tw-bg-cci-wpc-bg tw-p-5">
          <div
            ref={bodyRef}
            id={canvasId}
            data-wpc-preview-viewport="true"
            className="tw-mx-auto tw-min-w-0"
            style={{ width: selectedWidth === 'full' ? '100%' : `${selectedWidth}px` }}
          >
            {preview ? (
              html ? (
                <div className="tw-min-w-0" dangerouslySetInnerHTML={{ __html: html }} />
              ) : hasFrontendHtml ? (
                <div className="tw-grid tw-min-h-52 tw-place-items-center tw-p-8 tw-text-center tw-text-sm tw-text-cci-wpc-muted">
                  {__(
                    'Frontend preview is not available for this carousel configuration. Check template requirements, Pro license status or frontend asset settings.',
                    'cci-posts-carousel',
                  )}
                </div>
              ) : (
                <CarouselRenderer
                  carousel={preview}
                  interactive={true}
                  labels={{
                    previous: __('previous', 'cci-posts-carousel'),
                    next: __('next', 'cci-posts-carousel'),
                  }}
                  layout="carousel"
                  limit={0}
                />
              )
            ) : (
              <div className="tw-grid tw-min-h-52 tw-place-items-center tw-p-8 tw-text-center tw-text-sm tw-text-cci-wpc-muted">
                {__('Preview is loading...', 'cci-posts-carousel')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
