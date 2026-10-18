import React from 'react';
import { Copy } from 'lucide-react';
import { __ } from '../../i18n/i18n';

export default function ShortcodeButton({ id, onCopied }) {
    const shortcode = `[cci_posts_carousel id=${id}]`;

    return (
        <button
            type='button'
            className='tw-inline-flex tw-min-h-[34px] tw-cursor-pointer tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-py-0 tw-pl-2.5 tw-pr-2 tw-text-cci-wpc-text tw-transition-colors tw-duration-150 hover:tw-border-cci-wpc-brandBorder hover:tw-bg-cci-wpc-brandSoft'
            aria-label={__('Copy shortcode', 'cci-posts-carousel')}
            title={__('Click to copy shortcode', 'cci-posts-carousel')}
            onClick={() => {
                navigator.clipboard?.writeText(shortcode);
                onCopied();
            }}
        >
            <span className='tw-font-mono tw-text-xs'>{shortcode}</span>
            <span className='tw-inline-flex tw-text-cci-wpc-brand [&_svg]:tw-h-4 [&_svg]:tw-w-4' aria-hidden='true'>
                <Copy />
            </span>
        </button>
    );
}
