import React from 'react';
import { ProUpgradeModal as SharedProUpgradeModal } from '@cci/admin-ui/wp-carousel';
import { pluginData } from '../api';
import { __ } from '../i18n';

export default function ProUpgradeModal({
    featureName,
    description,
    benefits = [],
    productUrl = '',
    open,
    onClose,
    onActivateLicense,
}) {
    const label = featureName || __('Pro feature', 'wp-posts-carousel');

    return (
        <SharedProUpgradeModal
            open={open}
            productName='WP Posts Carousel'
            featureName={label}
            description={description}
            benefits={benefits}
            productUrl={productUrl || pluginData.upgradeUrl || ''}
            productUrlLabel={__('View product page', 'wp-posts-carousel')}
            activateLabel={__('Activate license here', 'wp-posts-carousel')}
            cancelLabel={__('Maybe later', 'wp-posts-carousel')}
            title={`${__('Available in Pro', 'wp-posts-carousel')}: ${label}`}
            message={__('Upgrade WP Posts Carousel to unlock this workflow in the builder.', 'wp-posts-carousel')}
            licenseHint={__(
                'Already have a license? Activate it here in the plugin settings to unlock Pro features on this domain.',
                'wp-posts-carousel'
            )}
            onActivateLicense={onActivateLicense}
            onClose={onClose}
        />
    );
}
