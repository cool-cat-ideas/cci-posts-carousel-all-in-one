import React, { useEffect, useState } from 'react';
import { CheckCircle2, FilePenLine, Layers3, Plus, Sparkles } from 'lucide-react';
import { apiFetch } from '../api';
import { __, coreString } from '../i18n';
import { cn } from '../lib/cn';
import LoadingState from './LoadingState';
import MetricCard from './MetricCard';
import ShortcodeButton from './ShortcodeButton';
import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';

export default function CarouselsList({ setNotice, confirmAction, reviewSlot = null }) {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        apiFetch('/wp-json/wp-posts-carousel/v1/admin/carousels')
            .then((response) => setCarousels(Array.isArray(response) ? response : []))
            .catch(() => {
                setCarousels([]);
                setNotice({
                    type: 'error',
                    message: __('Failed fetching carousels.', 'wp-posts-carousel'),
                });
            })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const remove = async (carousel) => {
        const confirmed = await confirmAction({
            title: __('Delete carousel?', 'wp-posts-carousel'),
            message: `${__('This action cannot be undone.', 'wp-posts-carousel')} ${carousel.post_title || ''}`,
            confirmLabel: coreString('delete', 'Delete'),
            cancelLabel: __('Keep carousel', 'wp-posts-carousel'),
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
                    message: __('Carousel was deleted.', 'wp-posts-carousel'),
                });
                load();
            })
            .catch(() => {
                setNotice({
                    type: 'error',
                    message: __('Failed deleting carousel.', 'wp-posts-carousel'),
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
                    message: __('Carousel was duplicated as draft.', 'wp-posts-carousel'),
                });

                if (response?.ID) {
                    window.location.href = `admin.php?page=wp-posts-carousel&action=edit&id=${response.ID}`;
                    return;
                }

                load();
            })
            .catch(() => {
                setNotice({
                    type: 'error',
                    message: __('Failed duplicating carousel.', 'wp-posts-carousel'),
                });
            });
    };

    const publishedCount = carousels.filter((carousel) => carousel.post_status === 'publish').length;
    const draftCount = Math.max(0, carousels.length - publishedCount);

    return (
        <>
            <div className='tw-grid tw-grid-cols-1 tw-gap-3 lg:tw-grid-cols-3'>
                <MetricCard
                    icon={Layers3}
                    label={__('Total carousels', 'wp-posts-carousel')}
                    value={loading ? '-' : carousels.length}
                    description={__('All saved configurations', 'wp-posts-carousel')}
                    tone='primary'
                />
                <MetricCard
                    icon={CheckCircle2}
                    label={coreString('published', 'Published')}
                    value={loading ? '-' : publishedCount}
                    description={__('Visible on your site', 'wp-posts-carousel')}
                />
                <MetricCard
                    icon={FilePenLine}
                    label={__('Drafts', 'wp-posts-carousel')}
                    value={loading ? '-' : draftCount}
                    description={__('Still being prepared', 'wp-posts-carousel')}
                />
            </div>

            {reviewSlot}

            <Card>
                <CardHeader>
                    <div>
                        <h2>{__('Your carousels', 'wp-posts-carousel')}</h2>
                        <p>{__('Create, edit and copy embed codes for every carousel.', 'wp-posts-carousel')}</p>
                    </div>
                    <Button asChild variant='accent'>
                        <a href='admin.php?page=wp-posts-carousel&action=add-new'>
                            <Plus aria-hidden='true' />
                            {coreString('addNew', 'Add New')}
                        </a>
                    </Button>
                </CardHeader>

                {loading ? (
                    <LoadingState label={__('Loading carousels...', 'wp-posts-carousel')} variant='table' rows={2} />
                ) : (
                    <div className='tw-overflow-x-auto'>
                        <table className='tw-w-full tw-min-w-[760px] tw-border-collapse'>
                            <thead className='tw-bg-cci-wpc-surfaceSoft'>
                                <tr>
                                    <th className='tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-3 tw-text-left tw-text-[11px] tw-font-bold tw-uppercase tw-text-cci-wpc-muted'>
                                        {coreString('title', 'Title')}
                                    </th>
                                    <th className='tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-3 tw-text-left tw-text-[11px] tw-font-bold tw-uppercase tw-text-cci-wpc-muted'>
                                        {__('Shortcode', 'wp-posts-carousel')}
                                    </th>
                                    <th className='tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-3 tw-text-left tw-text-[11px] tw-font-bold tw-uppercase tw-text-cci-wpc-muted'>
                                        {coreString('status', 'Status')}
                                    </th>
                                    <th className='tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-3 tw-text-left tw-text-[11px] tw-font-bold tw-uppercase tw-text-cci-wpc-muted'>
                                        {coreString('date', 'Date')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {carousels.map((carousel) => (
                                    <tr
                                        key={carousel.ID}
                                        className='tw-group tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border last:tw-border-b-0'
                                    >
                                        <td className='tw-px-4 tw-py-4 tw-align-middle'>
                                            <a
                                                className='tw-font-semibold tw-text-cci-wpc-text tw-no-underline hover:tw-text-cci-wpc-brandStrong hover:tw-underline'
                                                href={`admin.php?page=wp-posts-carousel&action=edit&id=${carousel.ID}`}
                                            >
                                                {carousel.post_title || __('(no title)', 'wp-posts-carousel')}
                                            </a>
                                            <div
                                                className='tw-mt-1 tw-flex tw-flex-wrap tw-items-center tw-leading-5 tw-opacity-100 tw-transition-opacity md:tw-opacity-0 md:group-hover:tw-opacity-100 md:group-focus-within:tw-opacity-100'
                                                aria-label={__('Carousel actions', 'wp-posts-carousel')}
                                            >
                                                <a
                                                    className='tw-inline-flex tw-text-[13px] tw-font-medium tw-text-cci-wpc-brand tw-no-underline hover:tw-text-cci-wpc-brandStrong hover:tw-underline after:tw-mx-2 after:tw-text-cci-wpc-borderStrong after:tw-content-["|"]'
                                                    href={`admin.php?page=wp-posts-carousel&action=edit&id=${carousel.ID}`}
                                                >
                                                    {coreString('edit', 'Edit')}
                                                </a>
                                                <button
                                                    type='button'
                                                    className='tw-inline-flex tw-cursor-pointer tw-border-0 tw-bg-transparent tw-p-0 tw-text-[13px] tw-font-medium tw-text-cci-wpc-brand tw-no-underline hover:tw-text-cci-wpc-brandStrong hover:tw-underline after:tw-mx-2 after:tw-text-cci-wpc-borderStrong after:tw-content-["|"]'
                                                    onClick={() => duplicate(carousel)}
                                                >
                                                    {coreString('duplicate', 'Duplicate')}
                                                </button>
                                                <button
                                                    type='button'
                                                    className='tw-inline-flex tw-cursor-pointer tw-border-0 tw-bg-transparent tw-p-0 tw-text-[13px] tw-font-medium tw-text-cci-wpc-danger tw-no-underline hover:tw-text-cci-wpc-dangerText hover:tw-underline'
                                                    onClick={() => remove(carousel)}
                                                >
                                                    {coreString('delete', 'Delete')}
                                                </button>
                                            </div>
                                        </td>
                                        <td className='tw-px-4 tw-py-5 tw-align-middle'>
                                            <ShortcodeButton
                                                id={carousel.ID}
                                                onCopied={() =>
                                                    setNotice({
                                                        type: 'success',
                                                        message: __('Shortcode copied.', 'wp-posts-carousel'),
                                                    })
                                                }
                                            />
                                        </td>
                                        <td className='tw-px-4 tw-py-5 tw-align-middle'>
                                            <span
                                                className={cn(
                                                    'tw-inline-flex tw-rounded-full tw-border tw-border-solid tw-px-2 tw-py-1 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none',
                                                    carousel.post_status === 'publish'
                                                        ? 'tw-border-cci-wpc-successBorder tw-bg-cci-wpc-successBg tw-text-cci-wpc-successText'
                                                        : 'tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceMuted tw-text-cci-wpc-muted'
                                                )}
                                            >
                                                {carousel.post_status === 'publish'
                                                    ? coreString('published', 'Published')
                                                    : coreString('draft', 'Draft')}
                                            </span>
                                        </td>
                                        <td className='tw-whitespace-nowrap tw-px-4 tw-py-5 tw-align-middle tw-text-cci-wpc-muted'>
                                            {carousel.post_date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {carousels.length === 0 && (
                            <div className='tw-grid tw-min-h-52 tw-place-items-center tw-gap-2 tw-p-8 tw-text-center'>
                                <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                    {__('No carousels yet.', 'wp-posts-carousel')}
                                </strong>
                                <p className='tw-m-0 tw-text-sm tw-text-cci-wpc-muted'>
                                    {__(
                                        'Create your first carousel and its shortcode will appear here.',
                                        'wp-posts-carousel'
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {carousels.length > 0 && (
                <div className='tw-flex tw-items-center tw-justify-center tw-gap-3 tw-border-0 tw-px-5 tw-pt-0 tw-pb-4 tw-text-center'>
                    <p className='tw-m-0 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                        {__(
                            'That is all for now. Create your next carousel or copy a shortcode into any post, page or widget area.',
                            'wp-posts-carousel'
                        )}
                    </p>
                </div>
            )}
        </>
    );
}
