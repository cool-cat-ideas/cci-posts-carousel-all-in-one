import React from 'react';
import { LoadingState as SharedLoadingState } from '@cci/admin-ui/wp-carousel';
import { __ } from '../../i18n/i18n';

export default function LoadingState({ label = __('Loading...', 'cci-posts-carousel'), ...props }) {
    return <SharedLoadingState label={label} {...props} />;
}
