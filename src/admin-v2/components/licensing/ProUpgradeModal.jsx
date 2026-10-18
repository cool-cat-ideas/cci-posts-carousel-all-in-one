import React from 'react';
import { ProUpgradeModal as SharedProUpgradeModal } from '@cci/admin-ui/wp-carousel';
import { pluginData } from '../../api/api';
import { __ } from '../../i18n/i18n';

export default function ProUpgradeModal({
    featureName,
    description,
    benefits = [],
    productUrl = '',
    open,
    onClose,
    onActivateLicense,
}) {
    const label = featureName || __('Pro feature', 'cci-posts-carousel');

    return (
        <SharedProUpgradeModal
            open={open}
            productName='CCI Posts Carousel All In One'
            featureName={label}
            description={description}
            benefits={benefits}
            productUrl={productUrl || pluginData.upgradeUrl || ''}
            productUrlLabel={__('View product page', 'cci-posts-carousel')}
            activateLabel={__('Activate license here', 'cci-posts-carousel')}
            cancelLabel={__('Maybe later', 'cci-posts-carousel')}
            title={`${__('Available in Pro', 'cci-posts-carousel')}: ${label}`}
            message={__('Upgrade CCI Posts Carousel All In One to unlock this workflow in the builder.', 'cci-posts-carousel')}
            licenseHint={__(
                'Already have a license? Activate it here in the plugin settings to unlock Pro features on this domain.',
                'cci-posts-carousel'
            )}
            onActivateLicense={onActivateLicense}
            onClose={onClose}
        />
    );
}
