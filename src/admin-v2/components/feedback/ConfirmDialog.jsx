import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { __ } from '../../i18n/i18n';
import { Button } from '../ui/button';

export default function ConfirmDialog({ dialog, onCancel, onConfirm }) {
    if (!dialog) {
        return null;
    }

    return (
        <div className='tw-fixed tw-inset-0 tw-z-[100000] tw-grid tw-place-items-center tw-p-6' role='presentation'>
            <button
                type='button'
                className='tw-absolute tw-inset-0 tw-cursor-default tw-border-0 tw-bg-slate-900/35 tw-p-0'
                onClick={onCancel}
                aria-label={__('Cancel', 'wp-posts-carousel')}
            />
            <div
                className='tw-relative tw-grid tw-w-[min(440px,calc(100vw-32px))] tw-gap-4 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-5'
                role='dialog'
                aria-modal='true'
                aria-labelledby='cci-wpc-confirm-title'
            >
                <Button
                    size='iconSm'
                    type='button'
                    className='tw-absolute tw-right-3 tw-top-3'
                    onClick={onCancel}
                    aria-label={__('Cancel', 'wp-posts-carousel')}
                >
                    <X aria-hidden='true' />
                </Button>
                <div
                    className='tw-inline-flex tw-h-11 tw-w-11 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-dangerBorder tw-bg-cci-wpc-dangerBg tw-text-cci-wpc-danger [&_svg]:tw-h-5 [&_svg]:tw-w-5'
                    aria-hidden='true'
                >
                    <AlertTriangle />
                </div>
                <div className='tw-grid tw-gap-2 tw-pr-8'>
                    <strong
                        id='cci-wpc-confirm-title'
                        className='tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text'
                    >
                        {dialog.title}
                    </strong>
                    {dialog.message && (
                        <p className='tw-m-0 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>{dialog.message}</p>
                    )}
                </div>
                <div className='tw-flex tw-justify-end tw-gap-2'>
                    <Button onClick={onCancel}>{dialog.cancelLabel || __('Cancel', 'wp-posts-carousel')}</Button>
                    <Button variant={dialog.variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
                        {dialog.confirmLabel || __('Confirm', 'wp-posts-carousel')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
