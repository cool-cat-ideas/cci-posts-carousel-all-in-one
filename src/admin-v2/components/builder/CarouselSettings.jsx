import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { pluginData } from '../../api/api';
import { __ } from '../../i18n/i18n';
import ProBadge from '../licensing/ProBadge';
import { TooltipHelp } from '../ui/tooltip';
import { Button } from '../ui/button';
import { CheckboxField } from '../ui/checkbox';
import { Field } from '../ui/field';
import InfoCallout from '../ui/info-callout';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../ui/input-group';
import { Select } from '../ui/select';

const NUMBER_FIELDS = [
  { name: 'slide_by', label: 'Slide by', min: 1, unit: 'slides' },
  { name: 'start_position', label: 'Start position', min: 0, unit: 'index' },
  { name: 'margin', label: 'Gap', min: 0, unit: 'px' },
  { name: 'stage_padding', label: 'Stage padding', min: 0, unit: 'px' },
  { name: 'auto_play_timeout', label: 'Autoplay timeout', min: 0, unit: 'ms' },
  { name: 'auto_play_speed', label: 'Autoplay speed', min: 0, unit: 'ms' },
  { name: 'nav_speed', label: 'Navigation speed', min: 0, unit: 'ms' },
  { name: 'dots_speed', label: 'Dots speed', min: 0, unit: 'ms' },
  {
    name: 'lazy_load_eager',
    label: 'Lazy load eager',
    min: 0,
    unit: 'slides',
    engines: ['owl-carousel'],
  },
  {
    name: 'mousewheel_sensitivity',
    label: 'Mousewheel sensitivity',
    min: 0.1,
    step: 0.1,
    unit: 'x',
    engines: ['swiper'],
  },
  { name: 'touch_ratio', label: 'Touch ratio', min: 0, step: 0.1, unit: 'x', engines: ['swiper'] },
];

const TOGGLE_FIELDS = [
  { name: 'rtl', label: 'RTL' },
  { name: 'loop', label: 'Loop' },
  { name: 'rewind', label: 'Rewind' },
  { name: 'center', label: 'Center active slide' },
  { name: 'auto_play', label: 'Autoplay' },
  { name: 'stop_on_hover', label: 'Pause on hover' },
  { name: 'nav', label: 'Navigation' },
  { name: 'dots', label: 'Dots' },
  { name: 'mouse_wheel', label: 'Mousewheel' },
  { name: 'mouse_drag', label: 'Mouse drag' },
  { name: 'touch_drag', label: 'Touch drag' },
  { name: 'pull_drag', label: 'Pull drag', engines: ['owl-carousel'] },
  { name: 'free_drag', label: 'Free drag' },
  { name: 'lazy_load', label: 'Lazy load', engines: ['owl-carousel'] },
  { name: 'auto_width', label: 'Auto width' },
  { name: 'auto_height', label: 'Auto height' },
  { name: 'keyboard', label: 'Keyboard control', engines: ['swiper'] },
  { name: 'grab_cursor', label: 'Grab cursor', engines: ['swiper'] },
  {
    name: 'mousewheel_release_on_edges',
    label: 'Release mousewheel on edges',
    engines: ['swiper'],
  },
  { name: 'mousewheel_force_to_axis', label: 'Force mousewheel axis', engines: ['swiper'] },
  { name: 'watch_overflow', label: 'Disable when not enough slides', engines: ['swiper'] },
];

const SELECT_FIELDS = [
  {
    name: 'direction',
    label: 'Direction',
    engines: ['swiper'],
    options: [
      { value: 'horizontal', label: 'Horizontal' },
      { value: 'vertical', label: 'Vertical' },
    ],
  },
  {
    name: 'pagination_type',
    label: 'Pagination type',
    engines: ['swiper'],
    options: [
      { value: 'bullets', label: 'Bullets' },
      { value: 'fraction', label: 'Fraction' },
      { value: 'progressbar', label: 'Progress bar' },
    ],
  },
];

const OWL_TRANSITION_EFFECTS = [
  { value: 'slide', label: 'Slide' },
  { value: 'fade', label: 'Fade' },
];

const SWIPER_TRANSITION_EFFECTS = [
  { value: 'slide', label: 'Slide' },
  { value: 'fade', label: 'Fade' },
  { value: 'coverflow', label: 'Coverflow' },
  { value: 'flip', label: 'Flip' },
  { value: 'cube', label: 'Cube' },
  { value: 'cards', label: 'Cards' },
  { value: 'creative', label: 'Creative' },
];

const AUTOPLAY_INDICATOR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'progress', label: 'Progress bar' },
  { value: 'countdown', label: 'Countdown' },
  { value: 'both', label: 'Progress bar + countdown' },
];

const FALLBACK_ICON_LIBRARIES = [
  {
    value: 'fontawesome',
    label: 'Font Awesome',
    defaults: {
      previous: 'angle-left',
      next: 'angle-right',
      up: 'angle-up',
      down: 'angle-down',
    },
    example: 'angle-left',
  },
  {
    value: 'tabler',
    label: 'Tabler Icons',
    defaults: {
      previous: 'chevron-left',
      next: 'chevron-right',
      up: 'chevron-up',
      down: 'chevron-down',
    },
    example: 'chevron-left',
  },
];

const NAV_ICON_FIELDS = [
  { name: 'previous', label: 'Previous icon' },
  { name: 'next', label: 'Next icon' },
  { name: 'up', label: 'Up icon' },
  { name: 'down', label: 'Down icon' },
];
const GLOBAL_ICON_LIBRARY_VALUE = '__global__';

function boolValue(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function normalizeItemsToShow(value) {
  const source = value && typeof value === 'object' ? value : {};
  const widths = Object.keys(source).sort((first, second) => Number(first) - Number(second));

  return widths.reduce((result, width) => {
    const item = source[width];
    const items = item && typeof item === 'object' ? item.items : item;

    result[width] = Number(items || 1);

    return result;
  }, {});
}

function transitionEffectOptions(engine) {
  return engine === 'swiper' ? SWIPER_TRANSITION_EFFECTS : OWL_TRANSITION_EFFECTS;
}

function normalizeTransitionEffect(engine, effect) {
  const allowed = transitionEffectOptions(engine).map((option) => option.value);

  return allowed.includes(effect) ? effect : 'slide';
}

function supportsEngine(field, engine) {
  return !field.engines || field.engines.includes(engine);
}

function normalizeIconLibraries(libraries) {
  const source = Array.isArray(libraries) && libraries.length ? libraries : FALLBACK_ICON_LIBRARIES;

  return source
    .filter((library) => library?.value)
    .map((library) => ({
      ...library,
      defaults: library.defaults || {},
      example: library.example || library.defaults?.previous || '',
    }));
}

export default function CarouselSettings({
  carouselTypes,
  value,
  options,
  animations = [],
  iconLibraries = [],
  onTypeChange,
  onOptionsChange,
  errors = {},
  confirmAction,
  supportsTwoRows = true,
}) {
  const [newBreakpoint, setNewBreakpoint] = useState('');
  const [newBreakpointError, setNewBreakpointError] = useState('');
  const updateOption = (name, nextValue) => {
    onOptionsChange({
      ...options,
      [name]: nextValue,
    });
  };
  const itemsToShow = normalizeItemsToShow(options.items_to_show || options.breakpoints);
  const transitionEffect = normalizeTransitionEffect(
    value,
    options.transition_effect || (options.animate_out === 'fadeOut' ? 'fade' : 'slide'),
  );
  const rows = Number(options.rows) === 2 ? 2 : 1;
  const twoRows = rows === 2 && supportsTwoRows;
  const visibleToggles = TOGGLE_FIELDS.filter(
    (field) =>
      supportsEngine(field, value) &&
      (!twoRows || !['center', 'auto_width', 'auto_height'].includes(field.name)),
  );
  const visibleNumbers = NUMBER_FIELDS.filter((field) => supportsEngine(field, value));
  const visibleSelects = SELECT_FIELDS.filter(
    (field) => supportsEngine(field, value) && (!twoRows || field.name !== 'direction'),
  );
  const easingOptions = animations.length
    ? animations
    : [
        { value: 'linear', label: 'linear' },
        { value: 'swing', label: 'swing' },
      ];
  const autoplayIndicatorFeature = pluginData.features?.autoplay_progress_indicator || {};
  const hasAutoplayIndicator = Boolean(autoplayIndicatorFeature.enabled || pluginData.isPro);
  const autoplayIndicatorValue = options.autoplay_indicator || 'none';
  const autoplayEnabled = boolValue(options.auto_play);
  const normalizedIconLibraries = normalizeIconLibraries(iconLibraries);
  const navIconLibrary = options.nav_icon_library || '';
  const activeIconLibrary =
    normalizedIconLibraries.find((library) => library.value === navIconLibrary) ||
    normalizedIconLibraries[0];

  const updateBreakpoint = (width, items) => {
    updateOption('items_to_show', {
      ...itemsToShow,
      [width]: Number(items || 1),
    });
  };
  const addBreakpoint = () => {
    const width = Number(newBreakpoint);

    if (!width || width < 1) {
      setNewBreakpointError(__('Breakpoint width must be greater than 0.', 'cci-posts-carousel'));
      return;
    }

    updateBreakpoint(String(width), 1);
    setNewBreakpoint('');
    setNewBreakpointError('');
  };
  const removeBreakpoint = async (width) => {
    if (confirmAction) {
      const confirmed = await confirmAction({
        title: __('Delete breakpoint?', 'cci-posts-carousel'),
        message: `${__('This removes the responsive rule for', 'cci-posts-carousel')} ${width}px.`,
        confirmLabel: __('Delete breakpoint', 'cci-posts-carousel'),
        cancelLabel: __('Keep breakpoint', 'cci-posts-carousel'),
        variant: 'danger',
      });

      if (!confirmed) {
        return;
      }
    }

    const nextItems = { ...itemsToShow };

    delete nextItems[width];
    updateOption('items_to_show', nextItems);
  };
  const updateTransitionEffect = (effect) => {
    const normalized = normalizeTransitionEffect(value, effect);
    const nextOptions = {
      ...options,
      transition_effect: normalized,
    };

    if (value !== 'swiper') {
      nextOptions.animate_out = normalized === 'fade' ? 'fadeOut' : '';
      nextOptions.animate_in = '';
    }

    onOptionsChange(nextOptions);
  };

  return (
    <div className="tw-grid tw-gap-4">
      <div>
        <div className="tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
          {__('Carousel engine', 'cci-posts-carousel')}
        </div>
        <p className="tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
          {__(
            'Choose the JavaScript engine and interaction behavior used by this carousel.',
            'cci-posts-carousel',
          )}
        </p>
      </div>

      <Field label={__('Engine', 'cci-posts-carousel')}>
        <Select
          value={value || 'owl-carousel'}
          onValueChange={onTypeChange}
          options={carouselTypes.map((type) => ({
            value: type.name,
            label: type.carousel_name || type.name,
          }))}
        />
      </Field>

      <Field label={__('Rows', 'cci-posts-carousel')}>
        <Select
          ariaLabel={__('Rows', 'cci-posts-carousel')}
          value={String(rows)}
          onValueChange={(nextValue) => updateOption('rows', Number(nextValue))}
          options={[
            { value: '1', label: __('One row', 'cci-posts-carousel') },
            { value: '2', label: __('Two rows', 'cci-posts-carousel') },
          ]}
        />
      </Field>
      {rows === 2 && !supportsTwoRows && (
        <InfoCallout className="alert-info tw-my-4">
          {__(
            'This template uses one row. Select a compatible card template to use two rows.',
            'cci-posts-carousel',
          )}
        </InfoCallout>
      )}
      {twoRows && (
        <>
          <Field label={__('Rows on phones', 'cci-posts-carousel')}>
            <Select
              ariaLabel={__('Rows on phones', 'cci-posts-carousel')}
              value={String(options.mobile_rows || 1)}
              onValueChange={(nextValue) => updateOption('mobile_rows', Number(nextValue))}
              options={[
                { value: '1', label: __('One row', 'cci-posts-carousel') },
                { value: '2', label: __('Two rows', 'cci-posts-carousel') },
              ]}
            />
          </Field>
          {[
            {
              name: 'rows_mobile_max',
              label: __('Phone layout up to', 'cci-posts-carousel'),
              min: 320,
              max: 1024,
              fallback: 767,
            },
            {
              name: 'row_gap',
              label: __('Gap between rows', 'cci-posts-carousel'),
              min: 0,
              max: 100,
              fallback: 24,
            },
          ].map((field) => (
            <Field
              label={field.label}
              key={field.name}
              error={errors[`carousel_options.${field.name}`]}
            >
              <InputGroup invalid={Boolean(errors[`carousel_options.${field.name}`])}>
                <InputGroupInput
                  aria-label={field.label}
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={options[field.name] ?? field.fallback}
                  onChange={(event) => updateOption(field.name, Number(event.target.value))}
                />
                <InputGroupAddon>
                  <InputGroupText>px</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          ))}
          <InfoCallout className="alert-info tw-my-4">
            {__(
              'Both rows move together. The breakpoint item counts become column counts: 3 columns show 6 slides. Slides fill each column from top to bottom. This layout uses horizontal sliding and equal widths, without merged slides.',
              'cci-posts-carousel',
            )}
          </InfoCallout>
        </>
      )}
      {!twoRows && (
        <Field label={__('Transition effect', 'cci-posts-carousel')}>
          <Select
            value={transitionEffect}
            onValueChange={updateTransitionEffect}
            options={transitionEffectOptions(value).map((effect) => ({
              ...effect,
              label: __(effect.label, 'cci-posts-carousel'),
            }))}
          />
          <small className="tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {value === 'swiper'
              ? __(
                  'Swiper supports native transition effects. Fade, cube, flip, cards and creative use one visible slide.',
                  'cci-posts-carousel',
                )
              : __(
                  'Owl supports the standard slide transition and a fade transition using Owl animation classes.',
                  'cci-posts-carousel',
                )}
          </small>
        </Field>
      )}

      {value !== 'swiper' && (
        <Field label={__('Easing', 'cci-posts-carousel')}>
          <Select
            value={options.fallback_easing || 'linear'}
            onValueChange={(fallbackEasing) => updateOption('fallback_easing', fallbackEasing)}
            options={easingOptions}
          />
        </Field>
      )}

      {visibleSelects.length > 0 && (
        <div className="tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2">
          {visibleSelects.map((field) => (
            <Field key={field.name} label={__(field.label, 'cci-posts-carousel')}>
              <Select
                value={options[field.name] || field.options[0].value}
                onValueChange={(nextValue) => updateOption(field.name, nextValue)}
                options={field.options.map((option) => ({
                  ...option,
                  label: __(option.label, 'cci-posts-carousel'),
                }))}
              />
            </Field>
          ))}
        </div>
      )}

      <div className="tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2">
        {visibleToggles.map((field) => (
          <CheckboxField
            key={field.name}
            checked={boolValue(options[field.name])}
            onCheckedChange={(checked) => updateOption(field.name, checked === true)}
          >
            {__(field.label, 'cci-posts-carousel')}
          </CheckboxField>
        ))}
      </div>

      <div className="tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3">
        <div>
          <div className="tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
            {__('Navigation icons', 'cci-posts-carousel')}
          </div>
          <p className="tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'Override arrow icons for this carousel. Leave fields empty to use the selected library defaults.',
              'cci-posts-carousel',
            )}
          </p>
        </div>

        <Field label={__('Icon library override', 'cci-posts-carousel')}>
          <Select
            value={navIconLibrary || GLOBAL_ICON_LIBRARY_VALUE}
            onValueChange={(nextLibrary) =>
              updateOption(
                'nav_icon_library',
                nextLibrary === GLOBAL_ICON_LIBRARY_VALUE ? '' : nextLibrary,
              )
            }
            options={[
              {
                value: GLOBAL_ICON_LIBRARY_VALUE,
                label: __('Global setting', 'cci-posts-carousel'),
              },
              ...normalizedIconLibraries.map((library) => ({
                value: library.value,
                label: library.label || library.value,
              })),
            ]}
          />
        </Field>

        <div className="tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2">
          {NAV_ICON_FIELDS.map((field) => (
            <Field
              key={field.name}
              label={__(field.label, 'cci-posts-carousel')}
              error={errors[`carousel_options.nav_icon_${field.name}`]}
            >
              <InputGroup invalid={Boolean(errors[`carousel_options.nav_icon_${field.name}`])}>
                <InputGroupInput
                  invalid={Boolean(errors[`carousel_options.nav_icon_${field.name}`])}
                  placeholder={
                    activeIconLibrary.defaults?.[field.name] || activeIconLibrary.example || ''
                  }
                  value={options[`nav_icon_${field.name}`] || ''}
                  onChange={(event) => updateOption(`nav_icon_${field.name}`, event.target.value)}
                />
              </InputGroup>
            </Field>
          ))}
        </div>

        <p className="tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
          {__('Use icon names without the CSS prefix, for example:', 'cci-posts-carousel')}{' '}
          {activeIconLibrary.example || 'angle-left'}.
        </p>
      </div>

      <div className="tw-grid tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3">
        <div>
          <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
            {__('Autoplay progress indicator', 'cci-posts-carousel')}
            <ProBadge />
          </div>
          <p className="tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'Show visitors how long remains before autoplay advances to the next slide.',
              'cci-posts-carousel',
            )}
          </p>
        </div>
        <Field label={__('Indicator style', 'cci-posts-carousel')}>
          <Select
            value={hasAutoplayIndicator ? autoplayIndicatorValue : 'none'}
            onValueChange={(nextValue) => {
              if (hasAutoplayIndicator) {
                updateOption('autoplay_indicator', nextValue);
              }
            }}
            options={AUTOPLAY_INDICATOR_OPTIONS.map((option) => ({
              ...option,
              label: __(option.label, 'cci-posts-carousel'),
            }))}
            disabled={!hasAutoplayIndicator}
          />
        </Field>
        {!hasAutoplayIndicator && (
          <p className="tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'Activate a Pro license that includes autoplay progress indicators to use this option.',
              'cci-posts-carousel',
            )}
          </p>
        )}
        {hasAutoplayIndicator && !autoplayEnabled && autoplayIndicatorValue !== 'none' && (
          <p className="tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'Enable Autoplay for the indicator to appear on the frontend.',
              'cci-posts-carousel',
            )}
          </p>
        )}
      </div>

      <p className="tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
        {__(
          'Autoplay timeout sets the interval between automatic advances. Autoplay speed, Navigation speed and Dots speed set the transition duration for each interaction. All four values use milliseconds.',
          'cci-posts-carousel',
        )}
      </p>

      <div className="tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2">
        {visibleNumbers.map((field) => (
          <Field
            key={field.name}
            label={__(field.label, 'cci-posts-carousel')}
            error={errors[`carousel_options.${field.name}`]}
          >
            <InputGroup invalid={Boolean(errors[`carousel_options.${field.name}`])}>
              <InputGroupInput
                type="number"
                min={field.min}
                step={field.step || 1}
                invalid={Boolean(errors[`carousel_options.${field.name}`])}
                value={options[field.name] ?? ''}
                onChange={(event) =>
                  updateOption(
                    field.name,
                    event.target.value === '' ? '' : Number(event.target.value),
                  )
                }
              />
              <InputGroupAddon align="inline-end" className="tw-min-w-12">
                <InputGroupText>{field.unit}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        ))}
      </div>

      <div className="tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3">
        <div className="tw-inline-flex tw-items-center tw-gap-1.5 tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
          {__('Responsive items', 'cci-posts-carousel')}
          <TooltipHelp
            text={__(
              'Define how many slides are visible from each screen width. The largest matching breakpoint is used on the frontend.',
              'cci-posts-carousel',
            )}
          />
        </div>
        <p className="tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
          {__(
            'These values override the global responsive preset only for this carousel.',
            'cci-posts-carousel',
          )}
        </p>
        <div className="tw-grid tw-gap-2">
          {!Object.keys(itemsToShow).length && (
            <InfoCallout tone="info" className="tw-my-1">
              {__(
                'Using global responsive settings. Changes in Settings will apply to this carousel.',
                'cci-posts-carousel',
              )}
            </InfoCallout>
          )}
          {Object.keys(itemsToShow).map((width) => (
            <div
              className="tw-grid tw-grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] tw-items-end tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-2"
              key={width}
            >
              <Field label={__('Breakpoint', 'cci-posts-carousel')}>
                <InputGroup readOnly>
                  <InputGroupInput type="number" value={width} readOnly />
                  <InputGroupAddon align="inline-end" className="tw-min-w-12">
                    <InputGroupText>px</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field
                label={__('Items', 'cci-posts-carousel')}
                error={errors[`carousel_options.items_to_show.${width}`]}
              >
                <InputGroup invalid={Boolean(errors[`carousel_options.items_to_show.${width}`])}>
                  <InputGroupInput
                    type="number"
                    min="1"
                    invalid={Boolean(errors[`carousel_options.items_to_show.${width}`])}
                    value={itemsToShow[width]}
                    onChange={(event) => updateBreakpoint(width, event.target.value)}
                  />
                  <InputGroupAddon align="inline-end" className="tw-min-w-12">
                    <InputGroupText>{__('items', 'cci-posts-carousel')}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Button
                size="icon"
                variant="danger"
                onClick={() => removeBreakpoint(width)}
                aria-label={__('Remove breakpoint', 'cci-posts-carousel')}
                title={__('Remove breakpoint', 'cci-posts-carousel')}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
        <div className="tw-grid tw-grid-cols-[minmax(0,1fr)_auto] tw-items-end tw-gap-2">
          <Field label={__('New breakpoint', 'cci-posts-carousel')} error={newBreakpointError}>
            <InputGroup invalid={Boolean(newBreakpointError)}>
              <InputGroupInput
                type="number"
                min="1"
                placeholder="1440"
                invalid={Boolean(newBreakpointError)}
                value={newBreakpoint}
                onChange={(event) => {
                  setNewBreakpoint(event.target.value);
                  setNewBreakpointError('');
                }}
              />
              <InputGroupAddon align="inline-end" className="tw-min-w-12">
                <InputGroupText>px</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Button variant="outlineAccent" onClick={addBreakpoint}>
            <Plus aria-hidden="true" />
            {__('Add breakpoint', 'cci-posts-carousel')}
          </Button>
        </div>
      </div>
    </div>
  );
}
