import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { __ } from '../../i18n/i18n';
import CarouselRenderer from '../../../shared/CarouselRenderer';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../ui/input-group';

export default function SavedPreview({ preview, open, onClose }) {
  const bodyRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const widthId = useId();
  const [previewWidth, setPreviewWidth] = useState('full');
  const [customWidth, setCustomWidth] = useState('640');
  const hasFrontendHtml = typeof preview?.html === 'string';
  const html = useMemo(() => {
    if (typeof preview?.html !== 'string') return '';
    const fragment = document.createElement('template');
    fragment.innerHTML = preview.html;
    // The admin endpoint already supplied the saved/draft data. Do not fetch public data again.
    fragment.content
      .querySelectorAll('[data-wpc-api]')
      .forEach((root) => root.removeAttribute('data-wpc-api'));
    return fragment.innerHTML;
  }, [preview?.html]);
  const options = preview?.engine?.options || {};
  const breakpoints = options.items_to_show || options.breakpoints || {};
  useEffect(() => {
    if (!open) return undefined;
    const trigger = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () =>
      [
        ...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]'),
      ].filter((el) => !el.disabled && el.getClientRects().length);
    focusable()[1]?.focus();
    const keydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key === 'Tab') {
        const elements = focusable(),
          first = elements[0],
          last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    dialog.addEventListener('keydown', keydown);
    return () => {
      dialog.removeEventListener('keydown', keydown);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open]);

  // Breakpoints describe item counts, not the width of the column containing a carousel.
  const widths = Object.keys(breakpoints)
    .map(Number)
    .filter((width) => Number.isFinite(width) && width > 0)
    .sort((a, b) => a - b);
  const selectedWidth =
    previewWidth === 'custom' || widths.includes(Number(previewWidth)) ? previewWidth : 'full';
  const canvasWidth =
    selectedWidth === 'full'
      ? '100%'
      : `${selectedWidth === 'custom' ? Math.max(160, Math.min(3840, Number(customWidth) || 640)) : selectedWidth}px`;

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
    if (!open || !html || !canvas || !preview) return undefined;
    const roots = [...canvas.querySelectorAll('.cci-wpc-carousel')];
    let disposed = false;
    const dispose = (root) => {
      window.wpPostsCarousel?.getRenderer('react')?.unmount?.(root);
      if (window.jQuery?.(root).data('owl.carousel'))
        window.jQuery(root).trigger('destroy.owl.carousel');
    };
    roots.forEach((root) => {
      // Vertical previews contain original PHP cards; the shared React renderer mounts Swiper around them.
      if (preview.engine?.name === 'swiper' && options.direction === 'vertical') {
        root.dataset.wpcRenderer = 'react';
        root.dataset.wpcReactMode = 'full';
      }
      Promise.resolve(window.wpPostsCarouselLazyLoad?.render(root, preview, {}))
        .then(() => {
          if (disposed) dispose(root);
        })
        .catch(() => {
          if (!disposed) {
            root.setAttribute('role', 'alert');
            root.textContent = __(
              'Could not initialize the preview. Close it and try again.',
              'cci-posts-carousel',
            );
          }
        });
    });
    return () => {
      disposed = true;
      roots.forEach(dispose);
    };
  }, [open, html, preview, options.direction]);

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
      ref={dialogRef}
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
                'Match the preview to your content column. This does not change carousel settings.',
                'cci-posts-carousel',
              )}
            </p>
          </div>
          <div className="tw-grid tw-gap-2">
            <Select
              id={widthId}
              ariaLabel={__('Preview width', 'cci-posts-carousel')}
              value={selectedWidth}
              onValueChange={setPreviewWidth}
              options={[
                { value: 'full', label: __('Full width', 'cci-posts-carousel') },
                ...widths.map((width) => ({ value: String(width), label: `${width} px` })),
                { value: 'custom', label: __('Custom width', 'cci-posts-carousel') },
              ]}
            />
            {selectedWidth === 'custom' && (
              <InputGroup>
                <InputGroupInput
                  type="number"
                  min="160"
                  max="3840"
                  step="1"
                  aria-label={__('Width in pixels', 'cci-posts-carousel')}
                  value={customWidth}
                  onChange={(event) => setCustomWidth(event.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>px</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            )}
          </div>
        </div>
        <div className="tw-min-h-0 tw-min-w-0 tw-overflow-auto tw-bg-cci-wpc-bg tw-p-5">
          <div
            ref={bodyRef}
            id={canvasId}
            data-wpc-preview-viewport="true"
            className="tw-mx-auto tw-min-w-0"
            style={{ width: canvasWidth }}
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
