import { formatAdminDateTime, ResourceListHeader } from '@cci/admin-ui';
import React, { useEffect, useState } from 'react';
import { CheckCircle2, FilePenLine, Layers3, Sparkles } from 'lucide-react';
import { apiFetch, pluginData } from '../../api/api';
import { __, coreString } from '../../i18n/i18n';
import { cn } from '../../lib/cn';
import LoadingState from '../feedback/LoadingState';
import { carouselSummary, savedCarousels } from '../../lib/carousel-statistics.mjs';
import MetricCard from '../feedback/MetricCard';
import ShortcodeButton from '../builder/ShortcodeButton';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export default function CarouselsList({ setNotice, confirmAction, reviewSlot = null }) {
  const [carousels, setCarousels] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch('/wp-json/wp-posts-carousel/v1/admin/carousels')
      .then((response) => setCarousels(savedCarousels(response)))
      .catch(() => {
        setCarousels([]);
        setNotice({
          type: 'error',
          message: __('Failed fetching carousels.', 'cci-posts-carousel'),
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (carousel) => {
    const confirmed = await confirmAction({
      title: __('Delete carousel?', 'cci-posts-carousel'),
      message: `${__('This action cannot be undone.', 'cci-posts-carousel')} ${carousel.post_title || ''}`,
      confirmLabel: coreString('delete', 'Delete'),
      cancelLabel: __('Keep carousel', 'cci-posts-carousel'),
      variant: 'danger',
    });

    if (!confirmed) {
      return;
    }

    apiFetch(`/wp-json/wp-posts-carousel/v1/admin/carousel/${carousel.ID}`, {
      method: 'DELETE',
    })
      .then(() => {
        setNotice({
          type: 'success',
          message: __('Carousel was deleted.', 'cci-posts-carousel'),
        });
        load();
      })
      .catch(() => {
        setNotice({
          type: 'error',
          message: __('Failed deleting carousel.', 'cci-posts-carousel'),
        });
      });
  };

  const duplicate = (carousel) => {
    apiFetch(`/wp-json/wp-posts-carousel/v1/admin/carousel/${carousel.ID}/duplicate`, {
      method: 'POST',
    })
      .then((response) => {
        setNotice({
          type: 'success',
          message: __('Carousel was duplicated as draft.', 'cci-posts-carousel'),
        });

        if (response?.ID) {
          window.location.href = `admin.php?page=cci-posts-carousel&action=edit&id=${response.ID}`;
          return;
        }

        load();
      })
      .catch(() => {
        setNotice({
          type: 'error',
          message: __('Failed duplicating carousel.', 'cci-posts-carousel'),
        });
      });
  };

  const { total, published, unpublished } = carouselSummary(carousels);

  return (
    <>
      <div className="tw-grid tw-grid-cols-1 tw-gap-3 lg:tw-grid-cols-3">
        <MetricCard
          icon={Layers3}
          label={__('Total carousels', 'cci-posts-carousel')}
          value={loading ? '-' : total}
          description={__('All saved configurations', 'cci-posts-carousel')}
          tone="primary"
        />
        <MetricCard
          icon={CheckCircle2}
          label={coreString('published', 'Published')}
          value={loading ? '-' : published}
          description={__('Published carousel definitions', 'cci-posts-carousel')}
        />
        <MetricCard
          icon={FilePenLine}
          label={__('Unpublished', 'cci-posts-carousel')}
          value={loading ? '-' : unpublished}
          description={__('Draft, pending, scheduled or private', 'cci-posts-carousel')}
        />
      </div>

      {reviewSlot}

      <Card>
        <ResourceListHeader
          title={__('Carousels', 'cci-posts-carousel')}
          description={__(
            'Create, edit and copy embed codes for every carousel.',
            'cci-posts-carousel',
          )}
          createLabel={__('New carousel', 'cci-posts-carousel')}
          createHref="admin.php?page=cci-posts-carousel&action=add-new"
        />

        {loading ? (
          <LoadingState
            label={__('Loading carousels...', 'cci-posts-carousel')}
            variant="table"
            rows={2}
          />
        ) : (
          <div className="tw-overflow-x-auto">
            <table className="tw-w-full tw-min-w-[760px] tw-border-collapse">
              <thead className="tw-bg-cci-wpc-surfaceSoft">
                <tr>
                  <th className="tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-bold tw-uppercase tw-text-cci-wpc-muted">
                    {coreString('title', 'Title')}
                  </th>
                  <th className="tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-bold tw-uppercase tw-text-cci-wpc-muted">
                    {__('Shortcode', 'cci-posts-carousel')}
                  </th>
                  <th className="tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-bold tw-uppercase tw-text-cci-wpc-muted">
                    {coreString('status', 'Status')}
                  </th>
                  <th className="tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-bold tw-uppercase tw-text-cci-wpc-muted">
                    {coreString('date', 'Date')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {carousels.map((carousel) => (
                  <tr
                    key={carousel.ID}
                    className="tw-group tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border last:tw-border-b-0"
                  >
                    <td className="tw-px-4 tw-py-4 tw-align-middle">
                      <a
                        className="tw-font-semibold tw-text-cci-wpc-text tw-no-underline hover:tw-text-cci-wpc-brandStrong hover:tw-underline"
                        href={`admin.php?page=cci-posts-carousel&action=edit&id=${carousel.ID}`}
                      >
                        {carousel.post_title || __('(no title)', 'cci-posts-carousel')}
                      </a>
                      <div
                        className="tw-mt-1 tw-flex tw-flex-wrap tw-items-center tw-leading-5 tw-opacity-100 tw-transition-opacity md:tw-opacity-0 md:group-hover:tw-opacity-100 md:group-focus-within:tw-opacity-100"
                        aria-label={__('Carousel actions', 'cci-posts-carousel')}
                      >
                        <a
                          className='tw-inline-flex tw-text-[13px] tw-font-medium tw-text-cci-wpc-brand tw-no-underline hover:tw-text-cci-wpc-brandStrong hover:tw-underline after:tw-mx-2 after:tw-text-cci-wpc-borderStrong after:tw-content-["|"]'
                          href={`admin.php?page=cci-posts-carousel&action=edit&id=${carousel.ID}`}
                        >
                          {coreString('edit', 'Edit')}
                        </a>
                        <button
                          type="button"
                          className='tw-inline-flex tw-cursor-pointer tw-border-0 tw-bg-transparent tw-p-0 tw-text-[13px] tw-font-medium tw-text-cci-wpc-brand tw-no-underline hover:tw-text-cci-wpc-brandStrong hover:tw-underline after:tw-mx-2 after:tw-text-cci-wpc-borderStrong after:tw-content-["|"]'
                          onClick={() => duplicate(carousel)}
                        >
                          {coreString('duplicate', 'Duplicate')}
                        </button>
                        <button
                          type="button"
                          className="tw-inline-flex tw-cursor-pointer tw-border-0 tw-bg-transparent tw-p-0 tw-text-[13px] tw-font-medium tw-text-cci-wpc-danger tw-no-underline hover:tw-text-cci-wpc-dangerText hover:tw-underline"
                          onClick={() => remove(carousel)}
                        >
                          {coreString('delete', 'Delete')}
                        </button>
                      </div>
                    </td>
                    <td className="tw-px-4 tw-py-5 tw-align-middle">
                      <ShortcodeButton
                        id={carousel.ID}
                        onCopied={() =>
                          setNotice({
                            type: 'success',
                            message: __('Shortcode copied.', 'cci-posts-carousel'),
                          })
                        }
                      />
                    </td>
                    <td className="tw-px-4 tw-py-5 tw-align-middle">
                      <span
                        className={cn(
                          'tw-inline-flex tw-rounded-full tw-border tw-border-solid tw-px-2 tw-py-1 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none',
                          carousel.post_status === 'publish'
                            ? 'tw-border-cci-wpc-successBorder tw-bg-cci-wpc-successBg tw-text-cci-wpc-successText'
                            : 'tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceMuted tw-text-cci-wpc-muted',
                        )}
                      >
                        {carousel.post_status === 'publish'
                          ? coreString('published', 'Published')
                          : carousel.post_status === 'draft'
                            ? coreString('draft', 'Draft')
                            : carousel.post_status === 'private'
                              ? __('Private', 'cci-posts-carousel')
                              : carousel.post_status === 'pending'
                                ? __('Pending', 'cci-posts-carousel')
                                : carousel.post_status === 'future'
                                  ? __('Scheduled', 'cci-posts-carousel')
                                  : __('Unpublished', 'cci-posts-carousel')}
                      </span>
                    </td>
                    <td className="tw-whitespace-nowrap tw-px-4 tw-py-5 tw-align-middle tw-text-cci-wpc-muted">
                      {formatAdminDateTime(carousel.post_date, pluginData.adminDate) || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {carousels.length === 0 && (
              <div className="tw-grid tw-min-h-52 tw-place-items-center tw-gap-2 tw-p-8 tw-text-center">
                <strong className="tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
                  {__('No carousels yet.', 'cci-posts-carousel')}
                </strong>
                <p className="tw-m-0 tw-text-sm tw-text-cci-wpc-muted">
                  {__(
                    'Create your first carousel and its shortcode will appear here.',
                    'cci-posts-carousel',
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {carousels.length > 0 && (
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-border-0 tw-px-5 tw-pt-0 tw-pb-4 tw-text-center">
          <p className="tw-m-0 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'That is all for now. Create your next carousel or copy a shortcode into any post, page or widget area.',
              'cci-posts-carousel',
            )}
          </p>
        </div>
      )}
    </>
  );
}
