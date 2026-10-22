import React from 'react';
import { __ } from '../../i18n/i18n';
import { Field } from '../ui/field';
import { Select } from '../ui/select';
import { CheckboxField } from '../ui/checkbox';

function boolValue(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

export default function ImageSettings({ form, onChange }) {
  const performanceOptions = form.performance_options || {};
  const imageHover = form.image_hover || {};
  const updatePerformance = (patch) =>
    onChange({
      performance_options: { ...performanceOptions, ...patch },
    });
  return (
    <div className="tw-grid tw-gap-5">
      <div className="tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3">
        <Field label={__('Image fitting', 'cci-posts-carousel')}>
          <Select
            ariaLabel={__('Image fitting', 'cci-posts-carousel')}
            value={performanceOptions.image_fit || 'inherit'}
            onValueChange={(imageFit) => updatePerformance({ image_fit: imageFit })}
            options={[
              { value: 'inherit', label: __('Keep template layout', 'cci-posts-carousel') },
              { value: 'contain', label: __('Show whole image', 'cci-posts-carousel') },
              { value: 'cover', label: __('Fill area and crop', 'cci-posts-carousel') },
            ]}
          />
        </Field>
        <p className="tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
          {__(
            'Show the whole image with space around it, or crop the edges to fill the image area.',
            'cci-posts-carousel',
          )}
        </p>
      </div>
      <div className="tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3">
        <div>
          <div className="tw-text-sm tw-font-semibold tw-text-cci-wpc-text">
            {__('Second image on hover', 'cci-posts-carousel')}
          </div>
          <p className="tw-m-0 tw-mt-1 tw-text-xs tw-leading-5 tw-text-cci-wpc-muted">
            {__(
              'Moving the pointer over a slide shows a second image. Touch screens and slides without a second image keep the main image.',
              'cci-posts-carousel',
            )}
          </p>
        </div>
        <CheckboxField
          checked={boolValue(imageHover.enabled)}
          onCheckedChange={(checked) =>
            onChange({ image_hover: { ...imageHover, enabled: checked === true } })
          }
        >
          {__('Show a second image on hover', 'cci-posts-carousel')}
        </CheckboxField>
        {boolValue(imageHover.enabled) && (
          <Field
            label={__('Second image source', 'cci-posts-carousel')}
            note={__(
              'A hover image selected in the slide editor takes priority. Custom slides use their own image as primary.',
              'cci-posts-carousel',
            )}
          >
            <Select
              value={imageHover.source || 'content'}
              ariaLabel={__('Second image source', 'cci-posts-carousel')}
              onValueChange={(source) => onChange({ image_hover: { ...imageHover, source } })}
              options={[
                {
                  value: 'content',
                  label: __('First different image in the content', 'cci-posts-carousel'),
                },
                {
                  value: 'gallery',
                  label: __('WooCommerce product gallery', 'cci-posts-carousel'),
                },
                {
                  value: 'manual',
                  label: __('Selected in the slide editor', 'cci-posts-carousel'),
                },
              ]}
            />
          </Field>
        )}
      </div>
    </div>
  );
}
