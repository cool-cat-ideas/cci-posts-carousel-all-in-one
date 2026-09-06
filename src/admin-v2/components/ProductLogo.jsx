import React from 'react';
import { ProductLogo as SharedProductLogo } from '@cci/admin-ui/wp-carousel';
import { pluginData } from '../api';

export default function ProductLogo({ homeUrl = pluginData.pluginUrl || pluginData.upgradeUrl || pluginData.documentationUrl || '', ...props }) {
    return (
        <SharedProductLogo
            {...props}
            homeUrl={homeUrl}
        />
    );
}
