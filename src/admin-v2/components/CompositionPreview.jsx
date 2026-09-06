import React, { useState } from 'react';
import { CheckCircle2, GripVertical, Info, Trash2, X } from 'lucide-react';
import { pluginData } from '../api';
import { __ } from '../i18n';
import { TooltipHelp } from './ui/tooltip';
import { Button } from './ui/button';
import { Field } from './ui/field';
import { Input, Textarea } from './ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './ui/input-group';
import { Select } from './ui/select';

function cropPosition(post) {
    const x = Math.max(0, Math.min(100, 50 + Number(post.crop_x || 0) / 2));
    const y = Math.max(0, Math.min(100, 50 + Number(post.crop_y || 0) / 2));

    return `${x}% ${y}%`;
}

function previewImage(post) {
    return post.media_kind === 'video' ? post.video_poster || post.thumbnail || post.image_url : post.thumbnail;
}

export default function CompositionPreview({
    posts,
    selectedIndex,
    draggingIndex,
    dragOverIndex,
    onSelect,
    onUpdate,
    onChooseImage,
    onDragStart,
    onDragEnter,
    onDrop,
    onDragEnd,
    onRemove,
}) {
    const [editingIndex, setEditingIndex] = useState(null);
    const hasVideoSlides = Boolean(pluginData.features?.video_slides?.enabled || pluginData.isPro);
    const mediaOptions = [
        { value: 'image', label: __('Image', 'wp-posts-carousel') },
        ...(hasVideoSlides ? [{ value: 'video', label: __('Video', 'wp-posts-carousel') }] : []),
    ];

    if (!posts.length) {
        return null;
    }

    const editingPost = editingIndex === null ? null : posts[editingIndex] || null;

    const openSlideEditor = (index) => {
        onSelect(index);
        setEditingIndex(index);
    };

    const closeSlideEditor = () => setEditingIndex(null);

    const updateEditingPost = (updates) => {
        if (!editingPost) {
            return;
        }

        onUpdate(editingPost, updates, editingIndex);
    };

    const removeSlide = async (index) => {
        if (!onRemove || !posts[index]) {
            return;
        }

        const removed = await onRemove(posts[index], index);

        if (!removed) {
            return;
        }

        if (editingIndex === index) {
            closeSlideEditor();
            return;
        }

        if (editingIndex !== null && index < editingIndex) {
            setEditingIndex(editingIndex - 1);
        }
    };

    return (
        <div className='tw-grid tw-gap-3'>
            <div>
                <div>
                    <strong className='tw-inline-flex tw-items-center tw-gap-1.5 tw-text-lg tw-font-semibold tw-text-cci-wpc-text'>
                        {__('Slides', 'wp-posts-carousel')}
                        <TooltipHelp
                            text={__(
                                'Drag slides here to reorder the manual sequence. Click a slide to edit its layout settings.',
                                'wp-posts-carousel'
                            )}
                        />
                    </strong>
                    <span className='tw-mt-1 tw-block tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                        {__(
                            'Drag to reorder. Click a slide to edit width, group and image offset.',
                            'wp-posts-carousel'
                        )}
                    </span>
                </div>
            </div>

            <div className='tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-3'>
                {posts.map((post, index) => (
                    <div
                        className={`tw-relative tw-grid tw-min-h-[168px] tw-cursor-grab tw-overflow-hidden tw-rounded-md tw-border tw-border-solid tw-bg-white tw-text-left tw-transition-colors tw-duration-150 ${
                            selectedIndex === index
                                ? 'tw-border-cci-wpc-brand tw-bg-cci-wpc-brandSoft'
                                : dragOverIndex === index && draggingIndex !== index
                                  ? 'tw-border-cci-wpc-action tw-bg-cci-wpc-actionSoft'
                                  : draggingIndex === index
                                    ? 'tw-border-cci-wpc-brandBorder tw-opacity-60'
                                    : 'tw-border-cci-wpc-border hover:tw-border-cci-wpc-brandBorder hover:tw-bg-cci-wpc-brandSoft'
                        }`}
                        key={`${post.id}-${index}`}
                        draggable
                        role='button'
                        tabIndex='0'
                        aria-label={`${__('Edit slide settings', 'wp-posts-carousel')} ${index + 1}`}
                        title={post.label}
                        style={{
                            gridColumn: `span ${Math.max(1, Math.min(3, Number(post.span || 1)))}`,
                        }}
                        onClick={() => openSlideEditor(index)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                openSlideEditor(index);
                            }
                        }}
                        onDragStart={(event) => onDragStart(event, index)}
                        onDragEnter={() => onDragEnter(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => onDrop(index)}
                        onDragEnd={onDragEnd}
                    >
                        <span
                            className='tw-absolute tw-left-2 tw-top-2 tw-z-10 tw-inline-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white/95 tw-text-cci-wpc-muted [&_svg]:tw-h-4 [&_svg]:tw-w-4'
                            aria-hidden='true'
                        >
                            <GripVertical />
                        </span>
                        {onRemove && (
                            <Button size='iconSm'
                                variant='danger'
                                className='tw-absolute tw-right-2 tw-top-2 tw-z-10'
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    removeSlide(index);
                                }}
                                onMouseDown={(event) => event.stopPropagation()}
                                onPointerDown={(event) => event.stopPropagation()}
                                aria-label={__('Remove slide', 'wp-posts-carousel')}
                                title={__('Remove slide', 'wp-posts-carousel')}
                            >
                                <Trash2 aria-hidden='true' />
                            </Button>
                        )}
                        {previewImage(post) ? (
                            <img
                                className='tw-h-[118px] tw-w-full tw-object-cover'
                                src={previewImage(post)}
                                alt={post.thumbnail_alt}
                                style={{ objectPosition: cropPosition(post) }}
                            />
                        ) : (
                            <div className='tw-grid tw-h-[118px] tw-place-items-center tw-bg-cci-wpc-surfaceSoft tw-text-3xl tw-font-semibold tw-text-cci-wpc-brand'>
                                {post.label ? post.label.charAt(0) : '?'}
                            </div>
                        )}
                        <div className='tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-items-center tw-gap-2 tw-p-3'>
                            <span className='tw-inline-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-full tw-bg-cci-wpc-brand tw-text-xs tw-font-bold tw-text-white'>
                                {index + 1}
                            </span>
                            <div>
                                <strong className='tw-block tw-truncate tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                    {post.label}
                                </strong>
                                {post.group && (
                                    <small className='tw-block tw-truncate tw-text-xs tw-text-cci-wpc-muted'>
                                        {post.group}
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className='tw-m-0 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                {__(
                    'Click any slide to open its settings. The modal keeps this workspace clean on smaller admin screens.',
                    'wp-posts-carousel'
                )}
            </p>

            {editingPost && (
                <div
                    className='tw-fixed tw-inset-0 tw-z-[100000] tw-grid tw-place-items-center tw-p-6'
                    role='presentation'
                >
                    <button
                        type='button'
                        className='tw-absolute tw-inset-0 tw-cursor-default tw-border-0 tw-bg-slate-900/35 tw-p-0'
                        onClick={closeSlideEditor}
                        aria-label={__('Close', 'wp-posts-carousel')}
                    />
                    <div
                        className='tw-relative tw-grid tw-max-h-[calc(100vh-64px)] tw-w-[min(920px,calc(100vw-32px))] tw-grid-rows-[auto_minmax(0,1fr)_auto] tw-overflow-hidden tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white'
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='cci-wpc-slide-settings-title'
                    >
                        <div className='tw-flex tw-items-center tw-justify-between tw-gap-4 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-5 tw-py-4'>
                            <div>
                                <span className='tw-inline-flex tw-items-center tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-brandBorder tw-bg-cci-wpc-brandSoft tw-px-2.5 tw-py-1 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-brandStrong'>
                                    {editingPost.postType || editingPost.type || 'post'}
                                </span>
                                <strong
                                    className='tw-mt-2 tw-block tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text'
                                    id='cci-wpc-slide-settings-title'
                                >
                                    {editingPost.label}
                                </strong>
                                <small className='tw-mt-1 tw-block tw-text-xs tw-text-cci-wpc-muted'>
                                    {__('Slide', 'wp-posts-carousel')} {editingIndex + 1} / {posts.length}
                                </small>
                            </div>
                            <Button
                                size='icon'
                                type='button'
                                onClick={closeSlideEditor}
                                aria-label={__('Close', 'wp-posts-carousel')}
                            >
                                <X aria-hidden='true' />
                            </Button>
                        </div>

                        <div className='tw-min-h-0 tw-overflow-auto tw-p-5'>
                            <div className='tw-grid tw-grid-cols-1 tw-gap-5 lg:tw-grid-cols-[300px_minmax(0,1fr)]'>
                                <aside className='tw-grid tw-content-start tw-gap-3'>
                                    <div className='tw-grid tw-aspect-[4/3] tw-place-items-center tw-overflow-hidden tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-text-3xl tw-font-semibold tw-text-cci-wpc-brand'>
                                        {previewImage(editingPost) ? (
                                            <img
                                                className='tw-h-full tw-w-full tw-object-cover'
                                                src={previewImage(editingPost)}
                                                alt={editingPost.thumbnail_alt}
                                                style={{ objectPosition: cropPosition(editingPost) }}
                                            />
                                        ) : (
                                            <span>{editingPost.label ? editingPost.label.charAt(0) : '?'}</span>
                                        )}
                                    </div>
                                    <dl className='tw-m-0 tw-grid tw-grid-cols-2 tw-gap-2 tw-text-xs'>
                                        <div className='tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-2.5'>
                                            <dt className='tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted'>
                                                {__('Position', 'wp-posts-carousel')}
                                            </dt>
                                            <dd className='tw-m-0 tw-mt-1 tw-font-semibold tw-text-cci-wpc-text'>
                                                {editingIndex + 1} / {posts.length}
                                            </dd>
                                        </div>
                                        <div className='tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-2.5'>
                                            <dt className='tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted'>
                                                {__('Width', 'wp-posts-carousel')}
                                            </dt>
                                            <dd className='tw-m-0 tw-mt-1 tw-font-semibold tw-text-cci-wpc-text'>
                                                {editingPost.span || 1} {__('cols', 'wp-posts-carousel')}
                                            </dd>
                                        </div>
                                        <div className='tw-col-span-2 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-2.5'>
                                            <dt className='tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted'>
                                                {__('Source', 'wp-posts-carousel')}
                                            </dt>
                                            <dd className='tw-m-0 tw-mt-1 tw-truncate tw-font-semibold tw-text-cci-wpc-text'>
                                                {editingPost.media_kind === 'video'
                                                    ? __('Video slide', 'wp-posts-carousel')
                                                    : editingPost.type === 'custom'
                                                      ? __('Custom slide', 'wp-posts-carousel')
                                                      : editingPost.postType || __('Post', 'wp-posts-carousel')}
                                            </dd>
                                        </div>
                                    </dl>
                                </aside>

                                <div className='tw-grid tw-content-start tw-gap-5'>
                                    <div className='tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-infoBorder tw-bg-cci-wpc-infoBg tw-p-3 tw-text-cci-wpc-infoText'>
                                        <Info className='tw-mt-0.5 tw-h-4 tw-w-4' aria-hidden='true' />
                                        <div>
                                            <strong className='tw-block tw-text-sm tw-font-semibold'>
                                                {__('Slide-level settings', 'wp-posts-carousel')}
                                            </strong>
                                            <p className='tw-m-0 tw-mt-1 tw-text-sm tw-leading-5'>
                                                {__(
                                                    'Changes here affect this single slide in the manual sequence. Use layout fields for featured items, connected image strips and precise image crops.',
                                                    'wp-posts-carousel'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {editingPost.type === 'custom' ? (
                                        <EditorSection
                                            title={__('Content', 'wp-posts-carousel')}
                                            description={__(
                                                'Edit the text and destination used by this custom slide.',
                                                'wp-posts-carousel'
                                            )}
                                        >
                                            <div className='tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-2'>
                                                <Field label={__('Title', 'wp-posts-carousel')}>
                                                    <Input
                                                        value={editingPost.label || ''}
                                                        onChange={(event) =>
                                                            updateEditingPost({ label: event.target.value })
                                                        }
                                                    />
                                                </Field>
                                                <Field label={__('Link URL', 'wp-posts-carousel')}>
                                                    <Input
                                                        value={editingPost.url || ''}
                                                        onChange={(event) =>
                                                            updateEditingPost({ url: event.target.value })
                                                        }
                                                    />
                                                </Field>
                                                <Field
                                                    className='md:tw-col-span-2'
                                                    label={__('Description', 'wp-posts-carousel')}
                                                >
                                                    <Textarea
                                                        value={editingPost.description || ''}
                                                        onChange={(event) =>
                                                            updateEditingPost({ description: event.target.value })
                                                        }
                                                    />
                                                </Field>
                                            </div>
                                        </EditorSection>
                                    ) : (
                                        <div className='tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3'>
                                            <strong className='tw-block tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                                {__('Post content is read from WordPress', 'wp-posts-carousel')}
                                            </strong>
                                            <p className='tw-m-0 tw-mt-1 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                                                {__(
                                                    'Edit the source post to change title, excerpt or featured image. This modal controls only placement inside this carousel.',
                                                    'wp-posts-carousel'
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {editingPost.type === 'custom' && (
                                        <EditorSection
                                            title={__('Media', 'wp-posts-carousel')}
                                            description={__(
                                                'Choose whether this slide uses an image, a video embed or a direct video file.',
                                                'wp-posts-carousel'
                                            )}
                                        >
                                            <div className='tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-2'>
                                                <Field label={__('Media type', 'wp-posts-carousel')}>
                                                    <Select
                                                        value={hasVideoSlides ? editingPost.media_kind || 'image' : 'image'}
                                                        onValueChange={(mediaKind) =>
                                                            updateEditingPost({
                                                                media_kind: mediaKind,
                                                                ...(mediaKind === 'image'
                                                                    ? { video_url: '', video_poster: '' }
                                                                    : {}),
                                                            })
                                                        }
                                                        options={mediaOptions}
                                                    />
                                                </Field>
                                                {hasVideoSlides && editingPost.media_kind === 'video' && (
                                                    <Field
                                                        label={__('Video URL', 'wp-posts-carousel')}
                                                        note={__(
                                                            'Supports YouTube, Vimeo and direct video files.',
                                                            'wp-posts-carousel'
                                                        )}
                                                    >
                                                        <Input
                                                            value={editingPost.video_url || ''}
                                                            placeholder='https://www.youtube.com/watch?v=...'
                                                            onChange={(event) =>
                                                                updateEditingPost({
                                                                    video_url: event.target.value,
                                                                    video_poster: '',
                                                                    image_url: '',
                                                                    thumbnail: '',
                                                                })
                                                            }
                                                        />
                                                    </Field>
                                                )}
                                                <Field
                                                    className={
                                                        editingPost.media_kind === 'video' ? '' : 'md:tw-col-span-2'
                                                    }
                                                    label={
                                                        editingPost.media_kind === 'video'
                                                            ? __('Poster / image URL', 'wp-posts-carousel')
                                                            : __('Image URL', 'wp-posts-carousel')
                                                    }
                                                >
                                                    <div className='tw-grid tw-grid-cols-[minmax(0,1fr)_auto] tw-gap-2'>
                                                        <Input
                                                            value={editingPost.image_url || ''}
                                                            onChange={(event) =>
                                                                updateEditingPost({
                                                                    image_url: event.target.value,
                                                                    thumbnail: event.target.value,
                                                                })
                                                            }
                                                        />
                                                        <Button
                                                            variant='outlineAccent'
                                                            onClick={() => onChooseImage(editingPost, editingIndex)}
                                                        >
                                                            {__('Choose', 'wp-posts-carousel')}
                                                        </Button>
                                                    </div>
                                                </Field>
                                                {editingPost.media_kind === 'video' && (
                                                    <Field
                                                        className='md:tw-col-span-2'
                                                        label={__('Poster URL override', 'wp-posts-carousel')}
                                                        note={__(
                                                            'Leave empty when the server can fetch the thumbnail automatically.',
                                                            'wp-posts-carousel'
                                                        )}
                                                    >
                                                        <Input
                                                            value={editingPost.video_poster || ''}
                                                            placeholder={__(
                                                                'Leave empty to use video thumbnail',
                                                                'wp-posts-carousel'
                                                            )}
                                                            onChange={(event) =>
                                                                updateEditingPost({
                                                                    video_poster: event.target.value,
                                                                    image_url: event.target.value,
                                                                    thumbnail: event.target.value,
                                                                })
                                                            }
                                                        />
                                                    </Field>
                                                )}
                                            </div>
                                        </EditorSection>
                                    )}

                                    <EditorSection
                                        title={__('Layout in carousel', 'wp-posts-carousel')}
                                        description={__(
                                            'Tune only how this item appears in the visual order.',
                                            'wp-posts-carousel'
                                        )}
                                    >
                                        <div className='tw-grid tw-grid-cols-1 tw-gap-3 md:tw-grid-cols-2'>
                                            <Field
                                                label={
                                                    <span className='tw-inline-flex tw-items-center tw-gap-1.5'>
                                                        {__('Width', 'wp-posts-carousel')}
                                                        <TooltipHelp
                                                            text={__(
                                                                'How many layout columns this slide uses in Visual order. Use 1 for a normal slide and higher values for featured slides.',
                                                                'wp-posts-carousel'
                                                            )}
                                                        />
                                                    </span>
                                                }
                                            >
                                                <InputGroup>
                                                    <InputGroupInput
                                                        type='number'
                                                        min='1'
                                                        max='6'
                                                        value={editingPost.span || 1}
                                                        onChange={(event) =>
                                                            updateEditingPost({ span: event.target.value })
                                                        }
                                                    />
                                                    <InputGroupAddon align='inline-end' className='tw-min-w-12'>
                                                        <InputGroupText>{__('cols', 'wp-posts-carousel')}</InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Field>
                                            <Field
                                                label={
                                                    <span className='tw-inline-flex tw-items-center tw-gap-1.5'>
                                                        {__('Group', 'wp-posts-carousel')}
                                                        <TooltipHelp
                                                            text={__(
                                                                'Optional label for slides that belong together, for example a connected image strip or a promotional sequence.',
                                                                'wp-posts-carousel'
                                                            )}
                                                        />
                                                    </span>
                                                }
                                            >
                                                <Input
                                                    value={editingPost.group || ''}
                                                    placeholder={__('No group', 'wp-posts-carousel')}
                                                    onChange={(event) =>
                                                        updateEditingPost({ group: event.target.value })
                                                    }
                                                />
                                            </Field>
                                            <Field
                                                label={
                                                    <span className='tw-inline-flex tw-items-center tw-gap-1.5'>
                                                        {__('Offset X', 'wp-posts-carousel')}
                                                        <TooltipHelp
                                                            text={__(
                                                                'Moves the image crop left or right. Useful when multiple slides show different parts of one image.',
                                                                'wp-posts-carousel'
                                                            )}
                                                        />
                                                    </span>
                                                }
                                            >
                                                <InputGroup>
                                                    <InputGroupInput
                                                        type='number'
                                                        min='-100'
                                                        max='100'
                                                        value={editingPost.crop_x || 0}
                                                        onChange={(event) =>
                                                            updateEditingPost({ crop_x: event.target.value })
                                                        }
                                                    />
                                                    <InputGroupAddon align='inline-end' className='tw-min-w-12'>
                                                        <InputGroupText>%</InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Field>
                                            <Field
                                                label={
                                                    <span className='tw-inline-flex tw-items-center tw-gap-1.5'>
                                                        {__('Offset Y', 'wp-posts-carousel')}
                                                        <TooltipHelp
                                                            text={__(
                                                                'Moves the image crop up or down when the important part of the image is not centered.',
                                                                'wp-posts-carousel'
                                                            )}
                                                        />
                                                    </span>
                                                }
                                            >
                                                <InputGroup>
                                                    <InputGroupInput
                                                        type='number'
                                                        min='-100'
                                                        max='100'
                                                        value={editingPost.crop_y || 0}
                                                        onChange={(event) =>
                                                            updateEditingPost({ crop_y: event.target.value })
                                                        }
                                                    />
                                                    <InputGroupAddon align='inline-end' className='tw-min-w-12'>
                                                        <InputGroupText>%</InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Field>
                                        </div>
                                    </EditorSection>
                                </div>
                            </div>
                        </div>

                        <div className='tw-flex tw-items-center tw-justify-between tw-gap-4 tw-border-0 tw-border-t tw-border-solid tw-border-cci-wpc-border tw-px-5 tw-py-4'>
                            <span className='tw-inline-flex tw-items-center tw-gap-1.5 tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-actionBorder tw-bg-cci-wpc-actionSoft tw-px-3 tw-py-1.5 tw-text-xs tw-font-bold tw-text-cci-wpc-actionText [&_svg]:tw-h-4 [&_svg]:tw-w-4'>
                                <CheckCircle2 aria-hidden='true' />
                                {__('Changes apply immediately', 'wp-posts-carousel')}
                            </span>
                            <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
                                {onRemove && (
                                    <Button variant='danger' onClick={() => removeSlide(editingIndex)}>
                                        <Trash2 aria-hidden='true' />
                                        {__('Remove slide', 'wp-posts-carousel')}
                                    </Button>
                                )}
                                <Button variant='primary' onClick={closeSlideEditor}>
                                    {__('Done', 'wp-posts-carousel')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function EditorSection({ title, description, children }) {
    return (
        <section className='tw-grid tw-gap-3 tw-border-0 tw-border-t tw-border-solid tw-border-cci-wpc-border tw-pt-4'>
            <div>
                <h3 className='tw-m-0 tw-text-base tw-font-semibold tw-leading-tight tw-text-cci-wpc-text'>{title}</h3>
                {description && (
                    <p className='tw-m-0 tw-mt-1 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>{description}</p>
                )}
            </div>
            {children}
        </section>
    );
}
