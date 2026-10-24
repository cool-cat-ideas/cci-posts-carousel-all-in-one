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
} from 'lucide-react';
import { apiFetch } from '../../api/api';
import { __, coreString } from '../../i18n/i18n';
import { openMediaPicker } from '../../lib/media';
import {
  carouselDefaults,
  mergeDisplayOptions,
  moveItem,
  normalizePostOption,
  normalizeTaxonomyGroups,
  selectedValues,
  useQueryParam,
} from '../../lib/utils';
import { validateCarouselForm } from '../../validation/carouselSchema';
import CarouselSettings from './CarouselSettings';
import CompositionTools from './CompositionTools';
import CompositionPreview from './CompositionPreview';
import CustomSlideForm from './CustomSlideForm';
import DisplaySettings from './DisplaySettings';
import ImageSettings from './ImageSettings';
import LoadingState from '../feedback/LoadingState';
import PostSearch from './PostSearch';
import SavedPreview from './SavedPreview';
import TaxonomyFilters from './TaxonomyFilters';
import TemplatePicker from './TemplatePicker';
import { Button } from '../ui/button';
import { CheckboxField } from '../ui/checkbox';
import { Field, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Card, CardHeader } from '../ui/card';
import { Select } from '../ui/select';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

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
  const [queryPosts, setQueryPosts] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(false);
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
          message: __('Failed loading carousel preview.', 'cci-posts-carousel'),
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

        const frontendFilters = {
          ...(defaults.frontend_filters || {}),
          ...(values.frontend_filters || {}),
        };
        if (frontendFilters.all_label === 'All') frontendFilters.all_label = '';

        setForm({
          ...carouselDefaults(),
          ...defaults,
          ...values,
          post_selection_options: {
            ...carouselDefaults().post_selection_options,
            ...(defaults.post_selection_options || {}),
            ...(values.post_selection_options || {}),
            posts: (values.post_selection_options?.posts || []).map(normalizePostOption),
            mode:
              values.post_selection_options?.mode ||
              (values.post_selection_options?.posts?.length ? 'manual' : 'query'),
            taxonomies: normalizeTaxonomyGroups(values.post_selection_options?.taxonomies || []),
          },
          carousel_options: {
            ...(defaults.carousel_options || {}),
            ...(values.carousel_options || {}),
          },
          display_options: mergeDisplayOptions(
            dictionaries.display_options || {},
            defaults.display_options || {},
            values.display_options || {},
          ),
          curation_pattern: {
            ...(defaults.curation_pattern || {}),
            ...(values.curation_pattern || {}),
          },
          frontend_filters: frontendFilters,
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
          message: __('Failed loading editor data.', 'cci-posts-carousel'),
        });
      })
      .finally(() => setLoading(false));
  }, [savedId, isEdit, setNotice]);

  const dictionaries = settings?.dictionaries || {};
  const posts = form.post_selection_options.posts || [];
  const postTypes = selectedValues(form.post_selection_options.post_types);
  const selectionMode = form.post_selection_options.mode || (posts.length ? 'manual' : 'query');
  const isManual = selectionMode === 'manual';
  const isHybrid = selectionMode === 'hybrid';
  const visiblePosts = isManual ? posts : queryPosts;
  const queryKey = JSON.stringify({
    ...form.post_selection_options,
    posts: isHybrid
      ? posts.map(({ id, type, postType, post_type }) => ({ value: id, type, postType, post_type }))
      : [],
    mode: isHybrid ? 'hybrid' : 'query',
  });

  useEffect(() => {
    if (!settings || isManual) return undefined;
    const controller = new AbortController();
    let current = true;
    setQueryLoading(true);
    setQueryError(false);
    setQueryPosts([]);
    const timer = window.setTimeout(() => {
      apiFetch('/wp-json/wp-posts-carousel/v1/admin/postsFromQuery', {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify({ ...form, post_selection_options: JSON.parse(queryKey) }),
      })
        .then((response) => {
          if (current) setQueryPosts(response.map(normalizePostOption));
        })
        .catch((error) => {
          if (current && error.name !== 'AbortError') setQueryError(true);
        })
        .finally(() => {
          if (current) setQueryLoading(false);
        });
    }, 250);
    return () => {
      current = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [queryKey, isManual, settings]);
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
        ...(Object.prototype.hasOwnProperty.call(patch, 'posts')
          ? {
              mode:
                patch.mode ||
                (current.post_selection_options.mode === 'hybrid' ? 'hybrid' : 'manual'),
            }
          : {}),
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
          String(item.postType || item.post_type || 'post') ===
            String(nextPost.postType || nextPost.post_type || 'post'),
      )
    ) {
      return;
    }

    updatePostSelection({
      posts: [...posts, nextPost],
    });
    setSelectedIndex(posts.length);
  };

  const pinPost = (post) => {
    const nextPost = normalizePostOption(post);
    if (posts.some((item) => item.type !== 'custom' && String(item.id) === String(nextPost.id)))
      return;
    updatePostSelection({ mode: 'hybrid', posts: [...posts, nextPost] });
    setSelectedIndex(posts.length);
  };

  const updatePost = (post, patch, targetIndex = null) => {
    updatePostSelection({
      posts: posts.map((item, index) =>
        (targetIndex !== null ? index === targetIndex : item.id === post.id)
          ? normalizePostOption({ ...item, ...patch })
          : item,
      ),
    });
  };

  const removePost = async (post, targetIndex) => {
    if (!post || targetIndex < 0 || targetIndex >= posts.length) {
      return false;
    }

    if (confirmAction) {
      const confirmed = await confirmAction({
        title: __('Remove slide?', 'cci-posts-carousel'),
        message: __(
          'This slide will be removed from the manual carousel order. The original post or media item will not be deleted.',
          'cci-posts-carousel',
        ),
        confirmLabel: __('Remove slide', 'cci-posts-carousel'),
        cancelLabel: __('Keep slide', 'cci-posts-carousel'),
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

  const chooseCustomImage = (post, index, field = 'image_url', onChoose) => {
    const opened = openMediaPicker((url) => {
      const updates = {
        [field]: url,
        ...(field === 'image_url' ? { thumbnail: url } : {}),
      };
      if (onChoose) onChoose(updates);
      else updatePost(post, updates, index);
    });

    if (!opened) {
      setNotice({
        type: 'error',
        message: __('Media library is not available.', 'cci-posts-carousel'),
      });
    }
  };

  const changeSelectionMode = async (mode) => {
    if (mode === selectionMode) return;
    if (mode === 'query' && posts.length && confirmAction) {
      const confirmed = await confirmAction({
        title: __('Use automatic query results?', 'cci-posts-carousel'),
        message: __(
          'The manual slide selection will be cleared. Posts and media will not be deleted.',
          'cci-posts-carousel',
        ),
        confirmLabel: __('Use query results', 'cci-posts-carousel'),
        cancelLabel: __('Keep manual slides', 'cci-posts-carousel'),
      });
      if (!confirmed) return;
    }
    setForm((current) => ({
      ...current,
      post_selection_options: {
        ...current.post_selection_options,
        mode,
        posts:
          mode === 'hybrid'
            ? posts
            : mode === 'manual'
              ? isHybrid
                ? [...posts, ...queryPosts].slice(
                    0,
                    Number(form.post_selection_options.all_items) || 10,
                  )
                : queryPosts
              : [],
      },
    }));
    setSelectedIndex(0);
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
        message: __('Fix carousel settings before saving.', 'cci-posts-carousel'),
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
          message: __('Carousel was saved.', 'cci-posts-carousel'),
        });

        if (!isEdit && response.ID) {
          setSavedId(response.ID);
          window.history.replaceState(
            null,
            '',
            `admin.php?page=cci-posts-carousel&action=edit&id=${response.ID}`,
          );
        }
      })
      .catch((error) => {
        setNotice({
          type: 'error',
          message: error.message || __('Failed saving carousel.', 'cci-posts-carousel'),
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
      title: __('Carousel settings', 'cci-posts-carousel'),
      description: __(
        'Choose how this carousel renders and behaves on the front end.',
        'cci-posts-carousel',
      ),
    },
    query: {
      title: __('Content query', 'cci-posts-carousel'),
      description: __(
        'Choose post types, categories and ordering. Query results update automatically.',
        'cci-posts-carousel',
      ),
    },
    design: {
      title: __('Design settings', 'cci-posts-carousel'),
      description: __(
        'Pick a template and decide which slide elements should be visible.',
        'cci-posts-carousel',
      ),
    },
    content: {
      title: __('Manual slides', 'cci-posts-carousel'),
      description: __(
        'Search posts or add custom slides for manual carousel composition.',
        'cci-posts-carousel',
      ),
    },
    advanced: {
      title: __('Advanced publishing', 'cci-posts-carousel'),
      description: __(
        'Tune frontend filters, performance, field mapping and compatible visual options.',
        'cci-posts-carousel',
      ),
    },
  }[activePanel];

  if (loading && !settings) {
    return (
      <Card>
        <LoadingState label={__('Loading editor...', 'cci-posts-carousel')} variant="block" />
      </Card>
    );
  }

  return (
    <Card className="tw-overflow-hidden">
      <CardHeader>
        <div>
          <Button asChild variant="ghost" className="tw-font-semibold tw-text-cci-wpc-text">
            <a href="admin.php?page=cci-posts-carousel">
              <ArrowLeft aria-hidden="true" />
              {__('Back to all carousels', 'cci-posts-carousel')}
            </a>
          </Button>
        </div>
        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2.5">
          <label className="tw-grid tw-grid-cols-[auto_160px] tw-items-center tw-gap-2">
            <span className="tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted">
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
          <Button variant="save" onClick={save} disabled={saving}>
            <Save aria-hidden="true" />
            {saving ? __('Saving...', 'cci-posts-carousel') : __('Save', 'cci-posts-carousel')}
          </Button>
        </div>
      </CardHeader>

      <div className="tw-grid tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-5 tw-py-4">
        <label className="tw-sr-only" htmlFor="cci-wpc-carousel-title">
          {coreString('title', 'Title')}
        </label>
        <Input
          id="cci-wpc-carousel-title"
          className="tw-min-h-[52px] tw-text-xl tw-font-semibold"
          invalid={Boolean(validationErrors.title)}
          aria-invalid={validationErrors.title ? 'true' : undefined}
          aria-describedby={validationErrors.title ? 'cci-wpc-carousel-title-error' : undefined}
          value={form.title}
          placeholder={__('Add carousel title', 'cci-posts-carousel')}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
        {validationErrors.title && (
          <span
            className="tw-text-xs tw-font-semibold tw-leading-5 tw-text-cci-wpc-danger"
            id="cci-wpc-carousel-title-error"
          >
            {validationErrors.title}
          </span>
        )}
      </div>

      <Tabs value={activePanel} onValueChange={setActivePanel}>
        <TabsList aria-label={__('Editor sections', 'cci-posts-carousel')}>
          <BuilderTab value="setup" icon={Settings2} label={__('General', 'cci-posts-carousel')} />
          <BuilderTab value="query" icon={Search} label={__('Query', 'cci-posts-carousel')} />
          <BuilderTab value="design" icon={Palette} label={__('Design', 'cci-posts-carousel')} />
          <BuilderTab value="content" icon={ListPlus} label={__('Slides', 'cci-posts-carousel')} />
          <BuilderTab value="advanced" icon={Gauge} label={__('Advanced', 'cci-posts-carousel')} />
        </TabsList>
      </Tabs>

      <div className="tw-p-4">
        <div className="tw-grid tw-grid-cols-1 tw-gap-4 2xl:tw-grid-cols-[420px_minmax(0,1fr)]">
          <section className="tw-min-w-0 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white">
            <div className="tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-4">
              <h2 className="tw-m-0 tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text">
                {panelCopy.title}
              </h2>
              <p className="tw-m-0 tw-mt-1 tw-text-sm tw-leading-5 tw-text-cci-wpc-muted">
                {panelCopy.description}
              </p>
            </div>
            <div className="tw-grid tw-gap-4 tw-p-4">
              {activePanel === 'setup' && (
                <>
                  <Field label={__('Renderer', 'cci-posts-carousel')}>
                    <Select
                      value={engineRequiresReact ? 'react' : form.renderer || 'php'}
                      onValueChange={(renderer) => setForm({ ...form, renderer })}
                      options={(dictionaries.frontend_renderers || []).map((renderer) => ({
                        value: renderer.name,
                        label: renderer.label,
                        disabled:
                          !renderer.enabled || (engineRequiresReact && renderer.name !== 'react'),
                      }))}
                    />
                    {engineRequiresReact && (
                      <small className="tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
                        {__(
                          'Swiper uses the React renderer on the frontend.',
                          'cci-posts-carousel',
                        )}
                      </small>
                    )}
                    {!engineRequiresReact && form.renderer === 'react' && (
                      <small className="tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
                        {__(
                          'Owl keeps the PHP carousel engine and React only adds enhancements.',
                          'cci-posts-carousel',
                        )}
                      </small>
                    )}
                  </Field>

                  <CarouselSettings
                    carouselTypes={dictionaries.carousel_types || []}
                    supportsTwoRows={(
                      dictionaries.two_row_templates || ['default', 'light', 'simple']
                    ).includes(normalizeTemplateName(form.template || 'default'))}
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
                  <Field label={__('Content selection', 'cci-posts-carousel')}>
                    <Select
                      value={selectionMode}
                      onValueChange={changeSelectionMode}
                      options={[
                        { value: 'query', label: __('Query (automatic)', 'cci-posts-carousel') },
                        { value: 'manual', label: __('Manual slides', 'cci-posts-carousel') },
                        {
                          value: 'hybrid',
                          label: __('Pinned slides + automatic fill', 'cci-posts-carousel'),
                        },
                      ]}
                    />
                  </Field>
                  {isManual && (
                    <p className="tw-m-0 tw-text-sm tw-text-cci-wpc-muted">
                      {__(
                        'Manual slides keep a fixed selection. Choose Query for automatically updated posts.',
                        'cci-posts-carousel',
                      )}
                    </p>
                  )}
                  {isHybrid && (
                    <p className="tw-m-0 tw-text-sm tw-text-cci-wpc-muted">
                      {__(
                        'Pinned slides appear first. Query results fill the remaining places without repeating pinned posts. The posts limit includes both.',
                        'cci-posts-carousel',
                      )}
                    </p>
                  )}
                  <Field label={__('Post types', 'cci-posts-carousel')}>
                    <div className="tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2">
                      {(dictionaries.post_types || []).map((postType) => (
                        <CheckboxField
                          key={postType.value}
                          checked={postTypes.includes(String(postType.value))}
                          onCheckedChange={(checked) => togglePostType(postType, Boolean(checked))}
                        >
                          {postType.label}
                        </CheckboxField>
                      ))}
                    </div>
                  </Field>

                  <Field label={__('Posts limit', 'cci-posts-carousel')}>
                    <Input
                      type="number"
                      min="1"
                      value={form.post_selection_options.all_items || 10}
                      onChange={(event) =>
                        updatePostSelection({ all_items: Number(event.target.value || 1) })
                      }
                    />
                  </Field>

                  <div className="tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2">
                    <Field label={__('Order by', 'cci-posts-carousel')}>
                      <Select
                        value={form.post_selection_options.order_by || 'id'}
                        onValueChange={(orderBy) => updatePostSelection({ order_by: orderBy })}
                        options={dictionaries.order_by || []}
                      />
                    </Field>

                    <Field label={__('Order', 'cci-posts-carousel')}>
                      <Select
                        value={form.post_selection_options.ordering || 'desc'}
                        onValueChange={(ordering) => updatePostSelection({ ordering })}
                        options={dictionaries.ordering || []}
                      />
                    </Field>
                  </div>

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
                    imageSizeOverride={form.performance_options?.image_size}
                    onChange={(displayOptions, { clearImageSizeOverride = false } = {}) =>
                      setForm((current) => ({
                        ...current,
                        display_options: displayOptions,
                        ...(clearImageSizeOverride
                          ? {
                              performance_options: {
                                ...current.performance_options,
                                image_size: 'inherit',
                              },
                            }
                          : {}),
                      }))
                    }
                  />

                  <ImageSettings
                    form={form}
                    onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
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

          <section className="tw-min-w-0">
            <div className="tw-min-w-0">
              <div className="tw-grid tw-min-h-full tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white">
                <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-start tw-justify-between tw-gap-4 tw-border-0 tw-border-b tw-border-solid tw-border-cci-wpc-border tw-px-4 tw-py-4">
                  <div>
                    <strong className="tw-inline-flex tw-items-center tw-gap-2 tw-text-lg tw-font-semibold tw-leading-tight tw-text-cci-wpc-text [&_svg]:tw-h-5 [&_svg]:tw-w-5 [&_svg]:tw-text-cci-wpc-brand">
                      <PanelsTopLeft aria-hidden="true" />
                      {isHybrid
                        ? __('Pinned slides + automatic fill', 'cci-posts-carousel')
                        : isManual
                          ? __('Visual slide order', 'cci-posts-carousel')
                          : __('Query preview', 'cci-posts-carousel')}
                    </strong>
                    <span className="tw-mt-1 tw-block tw-max-w-3xl tw-text-sm tw-leading-5 tw-text-cci-wpc-muted">
                      {__(
                        isHybrid
                          ? 'Arrange your pinned slides first. New matching posts automatically fill the remaining places.'
                          : isManual
                            ? 'Drag slides to set the sequence. Use the pencil button to edit width, grouping and image offset.'
                            : 'Matching posts update automatically. Save the carousel to apply these query rules to your site.',
                        'cci-posts-carousel',
                      )}
                    </span>
                  </div>
                  <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                    <span className="tw-inline-flex tw-items-center tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-brandBorder tw-bg-cci-wpc-brandSoft tw-px-3 tw-py-1.5 tw-text-xs tw-font-bold tw-text-cci-wpc-brandStrong">
                      {isHybrid
                        ? Math.min(
                            posts.length + queryPosts.length,
                            Number(form.post_selection_options.all_items) || 10,
                          )
                        : visiblePosts.length}{' '}
                      {__('slides', 'cci-posts-carousel')}
                    </span>
                    <Button onClick={() => loadPreview()} disabled={previewLoading}>
                      <Eye aria-hidden="true" />
                      {previewLoading
                        ? __('Loading preview...', 'cci-posts-carousel')
                        : __('Open preview', 'cci-posts-carousel')}
                    </Button>
                  </div>
                </div>

                <div className="tw-grid tw-gap-4 tw-p-4">
                  {isManual && (
                    <CompositionTools
                      posts={posts}
                      postTypes={postTypes}
                      pattern={form.curation_pattern || {}}
                      onPostsChange={(nextPosts) => updatePostSelection({ posts: nextPosts })}
                      onPatternChange={updateCurationPattern}
                      setNotice={setNotice}
                    />
                  )}

                  {isHybrid && posts.length > 0 && (
                    <CompositionPreview
                      title={__('Pinned slides', 'cci-posts-carousel')}
                      description={__(
                        'These slides stay at the beginning. Drag to change their order; remove a pin to let the post return to automatic results.',
                        'cci-posts-carousel',
                      )}
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
                  )}
                  {isHybrid && posts.length >= Number(form.post_selection_options.all_items) && (
                    <p role="status" className="tw-m-0 tw-text-sm tw-text-cci-wpc-muted">
                      {__(
                        'Pinned slides fill the posts limit. Increase the limit to include automatic results. Extra pins stay saved but are not shown.',
                        'cci-posts-carousel',
                      )}
                    </p>
                  )}
                  {!isManual && queryLoading && (
                    <LoadingState label={__('Loading matching posts...', 'cci-posts-carousel')} />
                  )}
                  {!isManual && queryError && (
                    <p role="alert">
                      {__(
                        'Could not load matching posts. Change a query setting to try again.',
                        'cci-posts-carousel',
                      )}
                    </p>
                  )}
                  {!isManual && !queryLoading && !queryError && (
                    <Button onClick={() => changeSelectionMode('manual')}>
                      {__('Use these posts as manual slides', 'cci-posts-carousel')}
                    </Button>
                  )}
                  <CompositionPreview
                    title={isHybrid ? __('Automatic results', 'cci-posts-carousel') : undefined}
                    onPin={!isManual ? pinPost : undefined}
                    readOnly={!isManual}
                    posts={visiblePosts}
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

                  {visiblePosts.length === 0 &&
                    !queryLoading &&
                    !queryError &&
                    (!isHybrid || posts.length === 0) && (
                      <div className="tw-grid tw-min-h-40 tw-place-items-center tw-rounded-md tw-border tw-border-dashed tw-border-cci-wpc-border tw-p-6 tw-text-center tw-text-sm tw-text-cci-wpc-muted">
                        {__(
                          isManual
                            ? 'Add manual slides to start arranging this carousel.'
                            : 'No published posts match these query settings.',
                          'cci-posts-carousel',
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
      <Icon aria-hidden="true" />
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

  return selected
    .flatMap((postType) => taxonomiesByPostType?.[postType] || [])
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
  const selectedTaxonomies = Array.isArray(frontendFilters.taxonomies)
    ? frontendFilters.taxonomies
    : [];

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
    <div className="tw-grid tw-gap-5">
      <div className="tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3">
        <div>
          <div className="tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
            {__('Frontend filters', 'cci-posts-carousel')}
          </div>
          <p className="tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'Expose selected taxonomies above the carousel. The filter reloads the page and works with Owl, Swiper and SEO-friendly server output.',
              'cci-posts-carousel',
            )}
          </p>
        </div>
        <CheckboxField
          checked={boolValue(frontendFilters.enabled)}
          onCheckedChange={(checked) => updateFrontendFilters({ enabled: checked === true })}
        >
          {__('Show filters on frontend', 'cci-posts-carousel')}
        </CheckboxField>

        {taxonomyOptions.length > 0 && (
          <div className="tw-grid tw-gap-2">
            <span className="tw-text-xs tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted">
              {__('Filter taxonomies', 'cci-posts-carousel')}
            </span>
            <div className="tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2">
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

        <div className="tw-grid tw-gap-4">
          <Field
            label={__('Category/tag reset button text (optional)', 'cci-posts-carousel')}
            note={__(
              'Leave empty for labels such as "All categories" or "All tags" in the visitor\'s language. Custom text replaces this option in every filter group and needs its own translation.',
              'cci-posts-carousel',
            )}
          >
            <Input
              aria-label={__('Category/tag reset button text (optional)', 'cci-posts-carousel')}
              value={frontendFilters.all_label || ''}
              placeholder={__('Automatic: All categories, All tags…', 'cci-posts-carousel')}
              onChange={(event) => updateFrontendFilters({ all_label: event.target.value })}
            />
          </Field>
          <Field
            label={__('URL prefix', 'cci-posts-carousel')}
            note={__(
              'Prefix for filter parameters in the page address. Keep the default unless another filter uses the same prefix.',
              'cci-posts-carousel',
            )}
          >
            <Input
              aria-label={__('URL prefix', 'cci-posts-carousel')}
              value={frontendFilters.param_prefix || 'wpcf_'}
              onChange={(event) => updateFrontendFilters({ param_prefix: event.target.value })}
            />
          </Field>
          <Field
            label={__('Terms per taxonomy', 'cci-posts-carousel')}
            note={__(
              'Maximum number of choices shown for each taxonomy (1–50).',
              'cci-posts-carousel',
            )}
          >
            <Input
              aria-label={__('Terms per taxonomy', 'cci-posts-carousel')}
              min="1"
              max="50"
              type="number"
              value={frontendFilters.term_limit || 12}
              onChange={(event) =>
                updateFrontendFilters({ term_limit: Number(event.target.value || 1) })
              }
            />
          </Field>
        </div>
      </div>

      <div className="tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3">
        <div>
          <div className="tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
            {__('Performance', 'cci-posts-carousel')}
          </div>
          <p className="tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {__('Control when slide images load.', 'cci-posts-carousel')}
          </p>
        </div>
        <div className="tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2">
          <CheckboxField
            checked={boolValue(performanceOptions.lazy_images, true)}
            onCheckedChange={(checked) => updatePerformance({ lazy_images: checked === true })}
          >
            {__('Lazy load slide images', 'cci-posts-carousel')}
          </CheckboxField>
          <CheckboxField
            checked={boolValue(performanceOptions.first_image_eager)}
            onCheckedChange={(checked) =>
              updatePerformance({ first_image_eager: checked === true })
            }
          >
            {__('Prioritize first image', 'cci-posts-carousel')}
          </CheckboxField>
        </div>
      </div>

      <div className="tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3">
        <div>
          <div className="tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
            {__('Custom field mapping', 'cci-posts-carousel')}
          </div>
          <p className="tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'Map post meta or ACF field names into carousel fields without writing PHP filters.',
              'cci-posts-carousel',
            )}
          </p>
        </div>
        <div className="tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2">
          {(dictionaries.field_mapping_targets || []).map((target) => (
            <Field key={target.value} label={target.label}>
              <Input
                value={fieldMapping[target.value] || ''}
                placeholder={__('Meta key', 'cci-posts-carousel')}
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
