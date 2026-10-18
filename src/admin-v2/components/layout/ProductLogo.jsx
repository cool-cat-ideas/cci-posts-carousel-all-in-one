import React from 'react';
import { ProductLogo as SharedProductLogo } from '@cci/admin-ui/wp-carousel';
import { pluginData } from '../../api/api';

export default function ProductLogo({ homeUrl = pluginData.pluginUrl || pluginData.upgradeUrl || pluginData.documentationUrl || '', ...props }) {
    return (
        <SharedProductLogo
            {...props}
            homeUrl={homeUrl}
            logoUrl={`${pluginData.assetsUrl}assets/images/cci-posts-carousel-logo.png`}
            iconUrl={`${pluginData.assetsUrl}assets/images/cci-posts-carousel-icon.png`}
        />
    );
}
