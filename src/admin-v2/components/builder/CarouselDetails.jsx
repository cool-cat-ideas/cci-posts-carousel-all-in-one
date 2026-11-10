import React from 'react';
import { formatAdminDateTime } from '@cci/admin-ui';
import { pluginData } from '../../api/api';
import { __ } from '../../i18n/i18n';
import { Card } from '../ui/card';

export default function CarouselDetails({ metadata }) {
  const groups = metadata
    ? [
        {
          dateLabel: __('Created', 'cci-posts-carousel'),
          date: metadata.created_at,
          userLabel: __('Created by', 'cci-posts-carousel'),
          user: metadata.created_by_name,
        },
        {
          dateLabel: __('Updated', 'cci-posts-carousel'),
          date: metadata.modified_at,
          userLabel: __('Modified by', 'cci-posts-carousel'),
          user: metadata.modified_by_name,
        },
      ]
    : [];
  return (
    <section
      className="tw-grid tw-max-w-xl tw-gap-3"
      aria-labelledby="cci-carousel-details-heading"
    >
      <h2
        id="cci-carousel-details-heading"
        className="tw-m-0 tw-text-base tw-font-semibold tw-leading-6 tw-text-cci-wpc-text"
      >
        {__('Carousel details', 'cci-posts-carousel')}
      </h2>
      {metadata ? (
        <div className="tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2">
          {groups.map((group) => (
            <Card key={group.dateLabel} className="tw-min-w-0 tw-p-3">
              <dl className="tw-m-0 tw-grid tw-gap-2">
                <div>
                  <dt className="tw-text-xs tw-font-normal tw-leading-5 tw-text-cci-wpc-muted">
                    {group.dateLabel}
                  </dt>
                  <dd className="tw-m-0 tw-text-sm tw-font-medium tw-leading-5 tw-text-cci-wpc-text">
                    {group.date ? (
                      <time className="tw-tabular-nums" dateTime={group.date.replace(' ', 'T')}>
                        {formatAdminDateTime(group.date, pluginData.adminDate) || '—'}
                      </time>
                    ) : (
                      __('Not recorded', 'cci-posts-carousel')
                    )}
                  </dd>
                </div>
                <div className="tw-flex tw-flex-wrap tw-gap-x-1 tw-text-xs tw-leading-5">
                  <dt className="tw-font-normal tw-text-cci-wpc-muted">{group.userLabel}:</dt>
                  <dd className="tw-m-0 tw-min-w-0 tw-break-words tw-font-medium tw-text-cci-wpc-text">
                    {group.user || __('Not recorded', 'cci-posts-carousel')}
                  </dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      ) : (
        <p className="tw-m-0 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted">
          {__('Save the carousel to record its creation and editor details.', 'cci-posts-carousel')}
        </p>
      )}
    </section>
  );
}
