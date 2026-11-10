import React, { useMemo, useState } from 'react';
import { formatAdminDateTime } from '@cci/admin-ui';
import { pluginData } from '../../api/api';
import { __, _n, coreString } from '../../i18n/i18n';
import { cn } from '../../lib/cn';
import {
  carouselModified,
  sortCarousels,
  carouselContentSummary,
} from '../../lib/carousel-statistics.mjs';
import ShortcodeButton from '../builder/ShortcodeButton';
import { DataTable, TableRow, TableCell, RowPrimary, RowAction } from '../ui/data-table';

/** Management rows reuse the shared table, title links and hover actions. */
export default function CarouselTable({
  carousels,
  overview = false,
  onPreview,
  onCopied,
  onDuplicate,
  onDelete,
  emptyState,
}) {
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' });
  const locale = document.documentElement.lang || undefined;
  const rows = useMemo(
    () => (overview ? carousels : sortCarousels(carousels, sort, locale)),
    [carousels, overview, sort, locale],
  );
  const changeSort = (key) =>
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  return (
    <DataTable
      label={__('Carousels', 'cci-posts-carousel')}
      compact={overview}
      columns={[
        {
          id: 'title',
          label: coreString('title', 'Title'),
          className: overview ? 'tw-w-[34%] sm:tw-w-auto' : 'tw-min-w-[220px]',
        },
        ...(!overview ? [{ id: 'shortcode', label: __('Shortcode', 'cci-posts-carousel') }] : []),
        {
          id: 'status',
          label: coreString('status', 'Status'),
          className: overview ? 'tw-w-[35%] sm:tw-w-[120px]' : undefined,
        },
        {
          id: 'date',
          label: __('Updated', 'cci-posts-carousel'),
          className: overview ? 'tw-w-[31%] sm:tw-w-[160px]' : undefined,
        },
        ...(!overview
          ? [
              {
                id: 'editor',
                label: __('Modified by', 'cci-posts-carousel'),
                className: 'tw-min-w-[140px]',
              },
            ]
          : []),
      ].map((column) => ({
        ...column,
        sortable: !overview,
        sortDirection:
          sort.key === column.id ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none',
        sortIcon: sort.key === column.id ? (sort.direction === 'asc' ? '↑' : '↓') : '↕',
        onSort: () => changeSort(column.id),
      }))}
      emptyState={emptyState}
    >
      {rows.map((carousel) => {
        const href = 'admin.php?page=cci-posts-carousel&action=edit&id=' + carousel.ID;
        const date = carouselModified(carousel);
        return (
          <TableRow key={carousel.ID}>
            <TableCell>
              <RowPrimary
                href={href}
                label={carousel.post_title || __('(no title)', 'cci-posts-carousel')}
                description={overview ? contentDescription(carousel) : undefined}
                actionsLabel={__('Carousel actions', 'cci-posts-carousel')}
                actions={
                  <>
                    <RowAction
                      href={href}
                      separator={Boolean(onPreview || onDuplicate || onDelete)}
                    >
                      {coreString('edit', 'Edit')}
                    </RowAction>
                    {onPreview && (
                      <RowAction
                        onClick={() => onPreview(carousel)}
                        separator={Boolean(onDuplicate || onDelete)}
                      >
                        {__('Preview', 'cci-posts-carousel')}
                      </RowAction>
                    )}
                    {onDuplicate && (
                      <RowAction
                        onClick={() => onDuplicate(carousel)}
                        separator={Boolean(onDelete)}
                      >
                        {coreString('duplicate', 'Duplicate')}
                      </RowAction>
                    )}
                    {onDelete && (
                      <RowAction onClick={() => onDelete(carousel)} tone="danger">
                        {coreString('delete', 'Delete')}
                      </RowAction>
                    )}
                  </>
                }
              />
            </TableCell>
            {!overview && (
              <TableCell>
                <ShortcodeButton id={carousel.ID} onCopied={onCopied} />
              </TableCell>
            )}
            <TableCell className={overview ? undefined : 'tw-py-5'}>
              <span
                className={cn(
                  'tw-inline-flex tw-rounded-full tw-border tw-border-solid tw-px-2 tw-py-1 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none',
                  overview && 'tw-whitespace-nowrap tw-text-[10px] sm:tw-text-[11px]',
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
            </TableCell>
            <TableCell className="tw-text-cci-wpc-muted">
              <time
                className={overview ? undefined : 'tw-whitespace-nowrap'}
                dateTime={date?.replace(' ', 'T')}
              >
                {formatAdminDateTime(date, pluginData.adminDate) || '—'}
              </time>
            </TableCell>
            {!overview && (
              <TableCell className="tw-text-cci-wpc-muted">
                {carousel.modified_by_name || __('Not recorded', 'cci-posts-carousel')}
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </DataTable>
  );
}

function contentDescription(carousel) {
  const summary = carouselContentSummary(carousel);
  if (!summary) return null;
  if (summary.mode === 'manual')
    return (
      __('Manual selection', 'cci-posts-carousel') +
      ' · ' +
      _n('%d selected slide', '%d selected slides', summary.selected, 'cci-posts-carousel').replace(
        '%d',
        String(summary.selected),
      )
    );
  const labels = {
    post: __('Posts', 'cci-posts-carousel'),
    page: __('Pages', 'cci-posts-carousel'),
    product: __('Products', 'cci-posts-carousel'),
  };
  const types =
    summary.types.length && summary.types.every((type) => labels[type])
      ? summary.types.map((type) => labels[type]).join(' / ')
      : __('Content', 'cci-posts-carousel');
  return (
    types +
    ' · ' +
    (summary.mode === 'hybrid'
      ? __('Pinned + automatic', 'cci-posts-carousel')
      : __('Automatic', 'cci-posts-carousel'))
  );
}
