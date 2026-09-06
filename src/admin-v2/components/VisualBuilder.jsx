import React, { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Eye,
    Gauge,
    ListPlus,
    Palette,
    PanelsTopLeft,
    Save,
    Search,
    Settings2,
    SlidersHorizontal,
} from 'lucide-react';
import { apiFetch } from '../api';
import { __, coreString } from '../i18n';
import { openMediaPicker } from '../media';
import {
    carouselDefaults,
    mergeDisplayOptions,
    moveItem,
    normalizePostOption,
    normalizeTaxonomyGroups,
    selectedValues,
    useQueryParam,
} from '../utils';
import { validateCarouselForm } from '../validation/carouselSchema';
import CarouselSettings from './CarouselSettings';
import CompositionTools from './CompositionTools';
import CompositionPreview from './CompositionPreview';
import CustomSlideForm from './CustomSlideForm';
import DisplaySettings from './DisplaySettings';
import LoadingState from './LoadingState';
import PostSearch from './PostSearch';
import SavedPreview from './SavedPreview';
import TaxonomyFilters from './TaxonomyFilters';
import TemplatePicker from './TemplatePicker';
import { Button } from './ui/button';
import { CheckboxField } from './ui/checkbox';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Card, CardHeader } from './ui/card';
import { Select } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export default function VisualBuilder({ setNotice, confirmAction }) {
    const id = useQueryParam('id');
    const [savedId, setSavedId] = useState(id);
    const isEdit = Boolean(savedId);
    const [settings, setSettings] = useState(null);
    const [form, setForm] = useState(carouselDefaults());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [preview, setPreview] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [activePanel, setActivePanel] = useState('setup');
    const [validationErrors, setValidationErrors] = useState({});
    const [showValidation, setShowValidation] = useState(false);

    const fetchDraftPreview = () => {
        setPreviewLoading(true);
        setPreview(null);

        return apiFetch('/wp-json/wp-posts-carousel/v1/admin/carousel/preview', {
            method: 'POST',
            body: JSON.stringify(form),
        })
            .then((response) => {
                setPreview(response);
            })
            .catch(() => {
                setNotice({
                    type: 'error',
                    message: __('Failed loading carousel preview.', 'wp-posts-carousel'),
                });
            })
            .finally(() => setPreviewLoading(false));
    };

    useEffect(() => {
        const request = isEdit
            ? apiFetch(`/wp-json/wp-posts-carousel/v1/admin/carousel/${savedId}`)
            : apiFetch('/wp-json/wp-posts-carousel/v1/admin/defaultSettings');

        request
            .then((response) => {
                const defaults = response.default_values || {};
                let values = defaults;

                if (response.post) {
                    values = {
                        ...defaults,
                        id: response.post.ID,
                        title: response.post.post_title,
                        status: response.post.post_status,
                        ...(response.post.params ? JSON.parse(response.post.params) : {}),
                    };
                }

                setSettings({
                    default_values: defaults,
                    dictionaries: response.dictionaries || {},
                });

                const dictionaries = response.dictionaries || {};

        setForm({
                    ...carouselDefaults(),
                    ...defaults,
                    ...values,
                    post_selection_options: {
                        ...carouselDefaults().post_selection_options,
                        ...(defaults.post_selection_options || {}),
                        ...(values.post_selection_options || {}),
                        posts: (values.post_selection_options?.posts || []).map(normalizePostOption),
                        taxonomies: normalizeTaxonomyGroups(values.post_selection_options?.taxonomies || []),
                    },
                    carousel_options: {
                        ...(defaults.carousel_options || {}),
                        ...(values.carousel_options || {}),
                    },
                    display_options: mergeDisplayOptions(
                        dictionaries.display_options || {},
                        defaults.display_options || {},
                        values.display_options || {}
                    ),
                    curation_pattern: {
                        ...(defaults.curation_pattern || {}),
                        ...(values.curation_pattern || {}),
                    },
                    frontend_filters: {
                        ...(defaults.frontend_filters || {}),
                        ...(values.frontend_filters || {}),
                    },
                    performance_options: {
                        ...(defaults.performance_options || {}),
                        ...(values.performance_options || {}),
                    },
                    field_mapping: {
                        ...(defaults.field_mapping || {}),
                        ...(values.field_mapping || {}),
                    },
                });
            })
            .catch(() => {
                setNotice({
                    type: 'error',
                    message: __('Failed loading editor data.', 'wp-posts-carousel'),
                });
            })
            .finally(() => setLoading(false));
    }, [savedId, isEdit, setNotice]);

    const dictionaries = settings?.dictionaries || {};
    const posts = form.post_selection_options.posts || [];
    const postTypes = selectedValues(form.post_selection_options.post_types);
    const engineRequiresReact = form.carousel_type === 'swiper';
    const safeSelectedIndex = posts.length ? Math.min(selectedIndex, posts.length - 1) : 0;

    useEffect(() => {
        if (!showValidation) {
            return;
        }

        setValidationErrors(validateCarouselForm(form).fields);
    }, [form, showValidation]);

    useEffect(() => {
        if (!engineRequiresReact || form.renderer === 'react') {
            return;
        }

        setForm((current) => ({
            ...current,
            renderer: 'react',
        }));
    }, [engineRequiresReact, form.renderer]);

    useEffect(() => {
        if (selectedIndex >= posts.length && posts.length) {
            setSelectedIndex(posts.length - 1);
        }
    }, [posts.length, selectedIndex]);

    const updatePostSelection = (patch) => {
        setForm((current) => ({
            ...current,
            post_selection_options: {
                ...current.post_selection_options,
                ...patch,
            },
        }));
    };

    const togglePostType = (postType, checked) => {
        const value = String(postType.value);
        const nextValues = checked
            ? Array.from(new Set([...postTypes, value]))
            : postTypes.filter((selected) => String(selected) !== value);

        updatePostSelection({
            post_types: (dictionaries.post_types || [])
                .filter((option) => nextValues.includes(String(option.value)))
                .map((option) => ({
                    value: option.value,
                    label: option.label,
                })),
        });
    };

    const updateCurationPattern = (curationPattern) => {
        setForm((current) => ({
            ...current,
            curation_pattern: curationPattern,
        }));
    };

    const addPost = (post) => {
        const nextPost = normalizePostOption(post);

        if (
            nextPost.type !== 'custom' &&
            posts.some(
                (item) =>
                    String(item.id) === String(nextPost.id) &&
                    String(item.postType || item.post_type || 'post') === String(nextPost.postType || nextPost.post_type || 'post')
            )
        ) {
            return;
        }

        updatePostSelection({
            posts: [...posts, nextPost],
        });
        setSelectedIndex(posts.length);
    };

    const updatePost = (post, patch, targetIndex = null) => {
        updatePostSelection({
            posts: posts.map((item, index) =>
                (targetIndex !== null ? index === targetIndex : item.id === post.id)
                    ? normalizePostOption({ ...item, ...patch })
                    : item
            ),
        });
    };

    const removePost = async (post, targetIndex) => {
        if (!post || targetIndex < 0 || targetIndex >= posts.length) {
            return false;
        }

        if (confirmAction) {
            const confirmed = await confirmAction({
                title: __('Remove slide?', 'wp-posts-carousel'),
                message: __(
                    'This slide will be removed from the manual carousel order. The original post or media item will not be deleted.',
                    'wp-posts-carousel'
                ),
                confirmLabel: __('Remove slide', 'wp-posts-carousel'),
                cancelLabel: __('Keep slide', 'wp-posts-carousel'),
                variant: 'danger',
            });

            if (!confirmed) {
                return false;
            }
        }

        const nextPosts = posts.filter((_, index) => index !== targetIndex);

        updatePostSelection({
            posts: nextPosts,
        });
        setSelectedIndex((currentIndex) => {
            if (!nextPosts.length) {
                return 0;
            }

            if (targetIndex < currentIndex) {
                return Math.max(0, currentIndex - 1);
            }

            if (targetIndex === currentIndex) {
                return Math.min(targetIndex, nextPosts.length - 1);
            }

            return currentIndex;
        });
        setDraggingIndex(null);
        setDragOverIndex(null);

        return true;
    };

    const chooseCustomImage = (post, index) => {
        const opened = openMediaPicker((url) =>
            updatePost(
                post,
                {
                    image_url: url,
                    thumbnail: url,
                },
                index
            )
        );

        if (!opened) {
            setNotice({
                type: 'error',
                message: __('Media library is not available.', 'wp-posts-carousel'),
            });
        }
    };

    const executeQuery = () => {
        setLoading(true);
        apiFetch('/wp-json/wp-posts-carousel/v1/admin/postsFromQuery', {
            method: 'POST',
            body: JSON.stringify(form),
        })
            .then((response) => {
                updatePostSelection({
                    posts: response.map(normalizePostOption),
                });
                setNotice({
                    type: 'success',
                    message: __('Query results loaded.', 'wp-posts-carousel'),
                });
            })
            .catch(() => {
                setNotice({
                    type: 'error',
                    message: __('Failed fetching posts from query.', 'wp-posts-carousel'),
                });
            })
            .finally(() => setLoading(false));
    };

    const loadPreview = () => {
        setPreviewOpen(true);
        fetchDraftPreview();
    };

    const validateBeforeSave = () => {
        const validation = validateCarouselForm(form);
        setShowValidation(true);
        setValidationErrors(validation.fields);

        if (!validation.valid) {
            setNotice({
                type: 'error',
                message: __('Fix carousel settings before saving.', 'wp-posts-carousel'),
                details: validation.messages.join(' '),
            });
            return false;
        }

        return true;
    };

    const save = () => {
        if (!validateBeforeSave()) {
            return;
        }

        setSaving(true);
        const path = isEdit
            ? `/wp-json/wp-posts-carousel/v1/admin/carousel/${savedId}`
            : '/wp-json/wp-posts-carousel/v1/admin/carousel';

        apiFetch(path, {
            method: isEdit ? 'PUT' : 'POST',
            body: JSON.stringify(form),
        })
            .then((response) => {
                setNotice({
                    type: 'success',
                    message: __('Carousel was saved.', 'wp-posts-carousel'),
                });

                if (!isEdit && response.ID) {
                    setSavedId(response.ID);
                    window.history.replaceState(
                        null,
                        '',
                        `admin.php?page=wp-posts-carousel&action=edit&id=${response.ID}`
                    );
                }
            })
            .catch((error) => {
                setNotice({
                    type: 'error',
                    message: error.message || __('Failed saving carousel.', 'wp-posts-carousel'),
                    details: error.details || '',
                });
            })
            .finally(() => setSaving(false));
    };

    const reorder = (toIndex) => {
        if (draggingIndex === null || draggingIndex === toIndex) {
            return;
        }

        updatePostSelection({
            posts: moveItem(posts, draggingIndex, toIndex),
        });
        setSelectedIndex(toIndex);
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const startDragging = (event, index) => {
        setDraggingIndex(index);
        setSelectedIndex(index);
        event.dataTransfer.effectAllowed = 'move';
    };

    const stopDragging = () => {
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    const panelCopy = {
        setup: {
            title: __('Carousel settings', 'wp-posts-carousel'),
            description: __('Choose how this carousel renders and behaves on the front end.', 'wp-posts-carousel'),
        },
        query: {
            title: __('Content query', 'wp-posts-carousel'),
            description: __('Select post types, filters and ordering before loading slides.', 'wp-posts-carousel'),
        },
        design: {
            title: __('Design settings', 'wp-posts-carousel'),
            description: __('Pick a template and decide which slide elements should be visible.', 'wp-posts-carousel'),
        },
        content: {
            title: __('Manual slides', 'wp-posts-carousel'),
            description: __('Search posts or add custom slides for manual carousel composition.', 'wp-posts-carousel'),
        },
        advanced: {
            title: __('Advanced publishing', 'wp-posts-carousel'),
            description: __('Tune frontend filters, performance, field mapping and compatible visual options.', 'wp-posts-carousel'),
        },
    }[activePanel];

    if (loading && !settings) {
        return (
            <Card>
                <LoadingState label={__('Loading editor...', 'wp-posts-carousel')} variant='block' />
            </Card>
        );
    }

    return (
        <Card className='tw-overflow-hidden'>
            <CardHeader>
                <div>
                    <Button asChild variant='ghost' className='tw-font-semibold tw-text-cci-wpc-text'>
                        <a href='admin.php?page=wp-posts-carousel'>
                            <ArrowLeft aria-hidden='true' />
                            {__('Back to all carousels', 'wp-posts-carousel')}
                        </a>
                    </Button>
                </div>
                <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-2.5'>
                    <label className='tw-grid tw-grid-cols-[auto_160px] tw-items-center tw-gap-2'>
                        <span className='tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted'>
                            {coreString('status', 'Status')}
                        </span>
                        <Select
                            value={form.status || 'draft'}
                            onValueChange={(status) => setForm({ ...form, status })}
                            options={[
                                { value: 'draft', label: coreString('draft', 'Draft') },
                                { value: 'publish', label: coreString('published', 'Published') },
                            ]}
                        />
                    </label>
                    <Button variant='save' onClick={save} disabled={saving}>
                        <Save aria-hidden='true' />
                        {saving ? __('Saving...', 'wp-posts-carousel') : __('Save', 'wp-posts-carousel')}
                    </Button>
                </div>
            </CardHeader>

            <div className='tw-grid tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-5 tw-py-4'>
                <label className='tw-sr-only' htmlFor='cci-wpc-carousel-title'>
                    {coreString('title', 'Title')}
                </label>
                <Input
                    id='cci-wpc-carousel-title'
                    className='tw-min-h-[52px] tw-text-xl tw-font-semibold'
                    invalid={Boolean(validationErrors.title)}
                    aria-invalid={validationErrors.title ? 'true' : undefined}
                    aria-describedby={validationErrors.title ? 'cci-wpc-carousel-title-error' : undefined}
                    value={form.title}
                    placeholder={__('Add carousel title', 'wp-posts-carousel')}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
                {validationErrors.title && (
                    <span
                        className='tw-text-xs tw-font-semibold tw-leading-5 tw-text-cci-wpc-danger'
                        id='cci-wpc-carousel-title-error'
                    >
                        {validationErrors.title}
                    </span>
                )}
            </div>

            <Tabs value={activePanel} onValueChange={setActivePanel}>
                <TabsList aria-label={__('Editor sections', 'wp-posts-carousel')}>
                    <BuilderTab value='setup' icon={Settings2} label={__('General', 'wp-posts-carousel')} />
                    <BuilderTab value='query' icon={Search} label={__('Query', 'wp-posts-carousel')} />
                    <BuilderTab value='design' icon={Palette} label={__('Design', 'wp-posts-carousel')} />
                    <BuilderTab value='content' icon={ListPlus} label={__('Slides', 'wp-posts-carousel')} />
                    <BuilderTab value='advanced' icon={Gauge} label={__('Advanced', 'wp-posts-carousel')} />
                </TabsList>
            </Tabs>

            <div className='tw-p-4'>
                <div className='tw-grid tw-grid-cols-1 tw-gap-4 2xl:tw-grid-cols-[420px_minmax(0,1fr)]'>
                    <section className='tw-min-w-0 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white'>
                        <div className='tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-4'>
                            <h2 className='tw-m-0 tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text'>
                                {panelCopy.title}
                            </h2>
                            <p className='tw-m-0 tw-mt-1 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                                {panelCopy.description}
                            </p>
                        </div>
                        <div className='tw-grid tw-gap-4 tw-p-4'>
                            {activePanel === 'setup' && (
                                <>
                                    <Field label={__('Renderer', 'wp-posts-carousel')}>
                                        <Select
                                            value={engineRequiresReact ? 'react' : form.renderer || 'php'}
                                            onValueChange={(renderer) => setForm({ ...form, renderer })}
                                            options={(dictionaries.frontend_renderers || []).map((renderer) => ({
                                                value: renderer.name,
                                                label: renderer.label,
                                                disabled:
                                                    !renderer.enabled ||
                                                    (engineRequiresReact && renderer.name !== 'react'),
                                            }))}
                                        />
                                        {engineRequiresReact && (
                                            <small className='tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                                                {__(
                                                    'Swiper uses the React renderer on the frontend.',
                                                    'wp-posts-carousel'
                                                )}
                                            </small>
                                        )}
                                        {!engineRequiresReact && form.renderer === 'react' && (
                                            <small className='tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                                                {__(
                                                    'Owl keeps the PHP carousel engine and React only adds enhancements.',
                                                    'wp-posts-carousel'
                                                )}
                                            </small>
                                        )}
                                    </Field>

                                    <CarouselSettings
                                        carouselTypes={dictionaries.carousel_types || []}
                                        value={form.carousel_type || 'owl-carousel'}
                                        options={form.carousel_options || {}}
                                        animations={dictionaries.animations || []}
                                        iconLibraries={dictionaries.icon_libraries || []}
                                        onTypeChange={(carouselType) =>
                                            setForm({
                                                ...form,
                                                carousel_type: carouselType,
                                                renderer: carouselType === 'swiper' ? 'react' : form.renderer,
                                            })
                                        }
                                        onOptionsChange={(carouselOptions) =>
                                            setForm({
                                                ...form,
                                                carousel_options: carouselOptions,
                                            })
                                        }
                                        errors={validationErrors}
                                        confirmAction={confirmAction}
                                    />
                                </>
                            )}

                            {activePanel === 'query' && (
                                <>
                                    <Field label={__('Post types', 'wp-posts-carousel')}>
                                        <div className='tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2'>
                                            {(dictionaries.post_types || []).map((postType) => (
                                                <CheckboxField
                                                    key={postType.value}
                                                    checked={postTypes.includes(String(postType.value))}
                                                    onCheckedChange={(checked) =>
                                                        togglePostType(postType, Boolean(checked))
                                                    }
                                                >
                                                    {postType.label}
                                                </CheckboxField>
                                            ))}
                                        </div>
                                    </Field>

                                    <Field label={__('Posts limit', 'wp-posts-carousel')}>
                                        <Input
                                            type='number'
                                            min='1'
                                            value={form.post_selection_options.all_items || 10}
                                            onChange={(event) =>
                                                updatePostSelection({ all_items: Number(event.target.value || 1) })
                                            }
                                        />
                                    </Field>

                                    <div className='tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2'>
                                        <Field label={__('Order by', 'wp-posts-carousel')}>
                                            <Select
                                                value={form.post_selection_options.order_by || 'id'}
                                                onValueChange={(orderBy) => updatePostSelection({ order_by: orderBy })}
                                                options={dictionaries.order_by || []}
                                            />
                                        </Field>

                                        <Field label={__('Order', 'wp-posts-carousel')}>
                                            <Select
                                                value={form.post_selection_options.ordering || 'desc'}
                                                onValueChange={(ordering) => updatePostSelection({ ordering })}
                                                options={dictionaries.ordering || []}
                                            />
                                        </Field>
                                    </div>

                                    <Button variant='primary' className='cci-wpc-full' onClick={executeQuery}>
                                        <SlidersHorizontal aria-hidden='true' />
                                        {__('Load posts from query', 'wp-posts-carousel')}
                                    </Button>

                                    <TaxonomyFilters
                                        taxonomiesByPostType={dictionaries.taxonomies || {}}
                                        operators={dictionaries.operators || []}
                                        postTypes={postTypes}
                                        value={form.post_selection_options.taxonomies || []}
                                        relation={form.post_selection_options.relation || 'or'}
                                        onChange={(taxonomies) => updatePostSelection({ taxonomies })}
                                        onRelationChange={(relation) => updatePostSelection({ relation })}
                                        setNotice={setNotice}
                                    />
                                </>
                            )}

                            {activePanel === 'design' && (
                                <>
                                    <DisplaySettings
                                        definitions={dictionaries.display_options || {}}
                                        postTypes={postTypes}
                                        value={form.display_options || {}}
                                        onChange={(displayOptions) =>
                                            setForm({
                                                ...form,
                                                display_options: displayOptions,
                                            })
                                        }
                                    />

                                    <TemplatePicker
                                        templates={dictionaries.templates || []}
                                        value={normalizeTemplateName(form.template || 'default')}
                                        onChange={(templateName) => setForm({ ...form, template: templateName })}
                                    />
                                </>
                            )}

                            {activePanel === 'content' && (
                                <>
                                    <PostSearch
                                        postTypes={postTypes}
                                        availablePostTypes={dictionaries.post_types || []}
                                        selectedPosts={posts}
                                        onAdd={addPost}
                                        setNotice={setNotice}
                                    />

                                    <CustomSlideForm onAdd={addPost} setNotice={setNotice} />
                                </>
                            )}

                            {activePanel === 'advanced' && (
                                <AdvancedSettings
                                    dictionaries={dictionaries}
                                    postTypes={postTypes}
                                    form={form}
                                    onChange={(patch) =>
                                        setForm((current) => ({
                                            ...current,
                                            ...patch,
                                        }))
                                    }
                                />
                            )}
                        </div>
                    </section>

                    <section className='tw-min-w-0'>
                        <div className='tw-min-w-0'>
                            <div className='tw-grid tw-min-h-full tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white'>
                                <div className='tw-flex tw-items-start tw-justify-between tw-gap-4 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-4'>
                                    <div>
                                        <strong className='tw-inline-flex tw-items-center tw-gap-2 tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text [&_svg]:tw-h-5 [&_svg]:tw-w-5 [&_svg]:tw-text-cci-wpc-brand'>
                                            <PanelsTopLeft aria-hidden='true' />
                                            {__('Visual slide order', 'wp-posts-carousel')}
                                        </strong>
                                        <span className='tw-mt-1 tw-block tw-max-w-3xl tw-text-sm tw-leading-5 tw-text-cci-wpc-muted'>
                                            {__(
                                                'Drag slides to set the sequence. Click a slide to edit width, grouping and image offset in a clean modal.',
                                                'wp-posts-carousel'
                                            )}
                                        </span>
                                    </div>
                                    <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
                                        <span className='tw-inline-flex tw-items-center tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-brandBorder tw-bg-cci-wpc-brandSoft tw-px-3 tw-py-1.5 tw-text-xs tw-font-bold tw-text-cci-wpc-brandStrong'>
                                            {posts.length} {__('slides', 'wp-posts-carousel')}
                                        </span>
                                        <Button onClick={() => loadPreview()} disabled={previewLoading}>
                                            <Eye aria-hidden='true' />
                                            {previewLoading
                                                ? __('Loading preview...', 'wp-posts-carousel')
                                                : __('Open preview', 'wp-posts-carousel')}
                                        </Button>
                                    </div>
                                </div>

                                <div className='tw-grid tw-gap-4 tw-p-4'>
                                    <CompositionTools
                                        posts={posts}
                                        postTypes={postTypes}
                                        pattern={form.curation_pattern || {}}
                                        onPostsChange={(nextPosts) => updatePostSelection({ posts: nextPosts })}
                                        onPatternChange={updateCurationPattern}
                                        setNotice={setNotice}
                                    />

                                    <CompositionPreview
                                        posts={posts}
                                        selectedIndex={safeSelectedIndex}
                                        draggingIndex={draggingIndex}
                                        dragOverIndex={dragOverIndex}
                                        onSelect={setSelectedIndex}
                                        onUpdate={updatePost}
                                        onChooseImage={chooseCustomImage}
                                        onDragStart={startDragging}
                                        onDragEnter={setDragOverIndex}
                                        onDrop={reorder}
                                        onDragEnd={stopDragging}
                                        onRemove={removePost}
                                    />

                                    {posts.length === 0 && (
                                        <div className='tw-grid tw-min-h-40 tw-place-items-center tw-rounded-md tw-border tw-border-dashed tw-border-cci-wpc-border tw-p-6 tw-text-center tw-text-sm tw-text-cci-wpc-muted'>
                                            {__(
                                                'Load posts from the query or add manual slides to start arranging this carousel.',
                                                'wp-posts-carousel'
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <SavedPreview preview={preview} open={previewOpen} onClose={() => setPreviewOpen(false)} />
        </Card>
    );
}

function BuilderTab({ value, icon: Icon, label }) {
    return (
        <TabsTrigger value={value}>
            <Icon aria-hidden='true' />
            <span>{label}</span>
        </TabsTrigger>
    );
}

function boolValue(value, fallback = false) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    return value === true || value === 'true' || value === 1 || value === '1';
}

function taxonomyOptionsForPostTypes(taxonomiesByPostType, postTypes) {
    const selected = postTypes.length ? postTypes : Object.keys(taxonomiesByPostType || {});
    const seen = new Set();

    return selected.flatMap((postType) => taxonomiesByPostType?.[postType] || [])
        .filter((taxonomy) => {
            if (!taxonomy?.name || seen.has(taxonomy.name)) {
                return false;
            }

            seen.add(taxonomy.name);
            return true;
        })
        .map((taxonomy) => ({
            value: taxonomy.name,
            label: taxonomy.label || taxonomy.name,
        }));
}

function AdvancedSettings({ dictionaries, postTypes, form, onChange }) {
    const frontendFilters = form.frontend_filters || {};
    const performanceOptions = form.performance_options || {};
    const fieldMapping = form.field_mapping || {};
    const taxonomyOptions = taxonomyOptionsForPostTypes(dictionaries.taxonomies || {}, postTypes);
    const selectedTaxonomies = Array.isArray(frontendFilters.taxonomies) ? frontendFilters.taxonomies : [];

    const updateFrontendFilters = (patch) =>
        onChange({
            frontend_filters: {
                ...frontendFilters,
                ...patch,
            },
        });
    const updatePerformance = (patch) =>
        onChange({
            performance_options: {
                ...performanceOptions,
                ...patch,
            },
        });
    const updateFieldMapping = (key, value) =>
        onChange({
            field_mapping: {
                ...fieldMapping,
                [key]: value,
            },
        });

    const toggleTaxonomy = (taxonomy, checked) => {
        updateFrontendFilters({
            taxonomies: checked
                ? Array.from(new Set([...selectedTaxonomies, taxonomy]))
                : selectedTaxonomies.filter((item) => item !== taxonomy),
        });
    };

    return (
        <div className='tw-grid tw-gap-5'>
            <div className='tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3'>
                <div>
                    <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                        {__('Frontend filters', 'wp-posts-carousel')}
                    </div>
                    <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                        {__('Expose selected taxonomies above the carousel. The filter reloads the page and works with Owl, Swiper and SEO-friendly server output.', 'wp-posts-carousel')}
                    </p>
                </div>
                <CheckboxField
                    checked={boolValue(frontendFilters.enabled)}
                    onCheckedChange={(checked) => updateFrontendFilters({ enabled: checked === true })}
                >
                    {__('Show filters on frontend', 'wp-posts-carousel')}
                </CheckboxField>

                {taxonomyOptions.length > 0 && (
                    <div className='tw-grid tw-gap-2'>
                        <span className='tw-text-xs tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted'>
                            {__('Filter taxonomies', 'wp-posts-carousel')}
                        </span>
                        <div className='tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2'>
                            {taxonomyOptions.map((taxonomy) => (
                                <CheckboxField
                                    key={taxonomy.value}
                                    checked={selectedTaxonomies.includes(taxonomy.value)}
                                    onCheckedChange={(checked) => toggleTaxonomy(taxonomy.value, checked === true)}
                                >
                                    {taxonomy.label}
                                </CheckboxField>
                            ))}
                        </div>
                    </div>
                )}

                <div className='tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-3'>
                    <Field label={__('All label', 'wp-posts-carousel')}>
                        <Input
                            value={frontendFilters.all_label || 'All'}
                            onChange={(event) => updateFrontendFilters({ all_label: event.target.value })}
                        />
                    </Field>
                    <Field label={__('URL prefix', 'wp-posts-carousel')}>
                        <Input
                            value={frontendFilters.param_prefix || 'wpcf_'}
                            onChange={(event) => updateFrontendFilters({ param_prefix: event.target.value })}
                        />
                    </Field>
                    <Field label={__('Terms per taxonomy', 'wp-posts-carousel')}>
                        <Input
                            min='1'
                            max='50'
                            type='number'
                            value={frontendFilters.term_limit || 12}
                            onChange={(event) => updateFrontendFilters({ term_limit: Number(event.target.value || 1) })}
                        />
                    </Field>
                </div>
            </div>

            <div className='tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3'>
                <div>
                    <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                        {__('Performance', 'wp-posts-carousel')}
                    </div>
                    <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                        {__('Control image loading behavior and the image size used by post-based slides.', 'wp-posts-carousel')}
                    </p>
                </div>
                <div className='tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2'>
                    <CheckboxField
                        checked={boolValue(performanceOptions.lazy_images, true)}
                        onCheckedChange={(checked) => updatePerformance({ lazy_images: checked === true })}
                    >
                        {__('Lazy load slide images', 'wp-posts-carousel')}
                    </CheckboxField>
                    <CheckboxField
                        checked={boolValue(performanceOptions.first_image_eager)}
                        onCheckedChange={(checked) => updatePerformance({ first_image_eager: checked === true })}
                    >
                        {__('Prioritize first image', 'wp-posts-carousel')}
                    </CheckboxField>
                </div>
                <Field label={__('Image size override', 'wp-posts-carousel')}>
                    <Select
                        value={performanceOptions.image_size || 'inherit'}
                        onValueChange={(imageSize) => updatePerformance({ image_size: imageSize })}
                        options={dictionaries.performance_image_sizes || []}
                    />
                </Field>
            </div>

            <div className='tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3'>
                <div>
                    <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                        {__('Custom field mapping', 'wp-posts-carousel')}
                    </div>
                    <p className='tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                        {__('Map post meta or ACF field names into carousel fields without writing PHP filters.', 'wp-posts-carousel')}
                    </p>
                </div>
                <div className='tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2'>
                    {(dictionaries.field_mapping_targets || []).map((target) => (
                        <Field key={target.value} label={target.label}>
                            <Input
                                value={fieldMapping[target.value] || ''}
                                placeholder={__('Meta key', 'wp-posts-carousel')}
                                onChange={(event) => updateFieldMapping(target.value, event.target.value)}
                            />
                        </Field>
                    ))}
                </div>
            </div>
        </div>
    );
}

function normalizeTemplateName(templateName) {
    return templateName === 'wp-posts-carousel-default-template' ? 'default' : templateName;
}
