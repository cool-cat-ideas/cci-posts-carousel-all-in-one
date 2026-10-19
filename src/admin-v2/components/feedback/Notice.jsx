import React from 'react';
import { Notice as SharedNotice } from '@cci/admin-ui/wp-carousel';
import { __ } from '../../i18n/i18n';

export default function Notice({
  closeLabel = __('Close notification', 'cci-posts-carousel'),
  ...props
}) {
  return <SharedNotice closeLabel={closeLabel} {...props} />;
}
