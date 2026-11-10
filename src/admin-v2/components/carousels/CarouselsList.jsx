import { ResourceListHeader } from '@cci/admin-ui';
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { CheckCircle2, FilePenLine, Layers3 } from 'lucide-react';
import { apiFetch } from '../../api/api';
import { __, coreString } from '../../i18n/i18n';
import LoadingState from '../feedback/LoadingState';
import {
  carouselSummary,
  savedCarousels,
  recentCarousels,
} from '../../lib/carousel-statistics.mjs';
import MetricCard from '../feedback/MetricCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import CarouselTable from './CarouselTable';

const SavedPreview = lazy(() => import('../builder/SavedPreview'));

export default function CarouselsList({
  setNotice,
  confirmAction,
  reviewSlot = null,
  overview = false,
}) {
  const [preview, setPreview] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewRequest = useRef(null);
  useEffect(() => () => previewRequest.current?.abort(), []);
  const closePreview = () => {
    previewRequest.current?.abort();
    setPreviewOpen(false);
    setPreview(null);
  };
  const openPreview = (carousel) => {
    previewRequest.current?.abort();
    const request = new AbortController();
    previewRequest.current = request;
    setPreview(null);
    setPreviewOpen(true);
    apiFetch('/wp-json/wp-posts-carousel/v1/admin/carousel/' + carousel.ID + '/preview', {
      signal: request.signal,
    })
      .then((data) => {
        if (!request.signal.aborted) setPreview(data);
      })
      .catch((error) => {
        if (!request.signal.aborted) {
          setPreviewOpen(false);
          setNotice({
            type: 'error',
            message: error.message || __('Failed loading carousel preview.', 'cci-posts-carousel'),
          });
        }
      });
  };
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
    <div className="tw-grid tw-min-w-0 tw-grid-cols-1 tw-gap-4">
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
      <Card>
        <ResourceListHeader
          title={
            overview
              ? __('Recently edited carousels', 'cci-posts-carousel')
              : __('Carousels', 'cci-posts-carousel')
          }
          description={
            overview
              ? undefined
              : __('Create, edit and copy embed codes for every carousel.', 'cci-posts-carousel')
          }
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
          <CarouselTable
            carousels={overview ? recentCarousels(carousels) : carousels}
            overview={overview}
            onPreview={openPreview}
            onDuplicate={overview ? undefined : duplicate}
            onDelete={overview ? undefined : remove}
            onCopied={() =>
              setNotice({ type: 'success', message: __('Shortcode copied.', 'cci-posts-carousel') })
            }
            emptyState={
              carousels.length === 0 && (
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
              )
            }
          />
        )}
        {overview && (
          <div className="tw-border-0 tw-border-t tw-border-solid tw-border-cci-wpc-border tw-px-5 tw-py-3">
            <Button asChild variant="secondary">
              <a href="admin.php?page=cci-posts-carousel&section=carousels">
                {__('View all carousels', 'cci-posts-carousel')}
              </a>
            </Button>
          </div>
        )}
      </Card>

      {!overview && carousels.length > 0 && (
        <div className="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-border-0 tw-px-5 tw-pt-0 tw-pb-4 tw-text-center">
          <p className="tw-m-0 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'That is all for now. Create your next carousel or copy a shortcode into any post, page or widget area.',
              'cci-posts-carousel',
            )}
          </p>
        </div>
      )}
      {reviewSlot}
      {previewOpen && (
        <Suspense fallback={null}>
          <SavedPreview preview={preview} open={previewOpen} onClose={closePreview} />
        </Suspense>
      )}
    </div>
  );
}
