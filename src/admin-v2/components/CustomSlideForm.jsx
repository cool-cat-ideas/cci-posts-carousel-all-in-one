import React, { useState } from 'react';
import { pluginData } from '../api';
import { __ } from '../i18n';
import { openMediaPicker } from '../media';
import { normalizePostOption } from '../utils';
import { Button } from './ui/button';
import { Field } from './ui/field';
import { Input, Textarea } from './ui/input';
import { Select } from './ui/select';

const EMPTY = {
    label: '',
    description: '',
    url: '',
    image_url: '',
    media_kind: 'image',
    video_url: '',
    video_poster: '',
    button_label: '',
};

export default function CustomSlideForm({ onAdd, setNotice }) {
    const [values, setValues] = useState(EMPTY);
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const hasVideoSlides = Boolean(pluginData.features?.video_slides?.enabled || pluginData.isPro);
    const mediaOptions = [
        { value: 'image', label: __('Image', 'wp-posts-carousel') },
        ...(hasVideoSlides ? [{ value: 'video', label: __('Video', 'wp-posts-carousel') }] : []),
    ];

    const update = (name, value) => {
        setValues({
            ...values,
            [name]: value,
        });
    };
    const errors = {
        label: !values.label.trim() ? __('Custom slide title is required.', 'wp-posts-carousel') : '',
    };
    const showError = (name) => (submitted || touched[name]) && errors[name];

    const add = () => {
        setSubmitted(true);

        if (errors.label) {
            setNotice({
                type: 'error',
                message: __('Fix custom slide fields before adding.', 'wp-posts-carousel'),
                details: errors.label,
            });
            return;
        }

        const id = `custom-${Date.now()}`;

        onAdd(
            normalizePostOption({
                ...values,
                type: 'custom',
                post_type: 'custom',
                postType: 'custom',
                id,
                value: id,
            })
        );
        setValues(EMPTY);
        setTouched({});
        setSubmitted(false);
    };

    const chooseImage = () => {
        const opened = openMediaPicker((url) => update('image_url', url));

        if (!opened) {
            setNotice({
                type: 'error',
                message: __('Media library is not available.', 'wp-posts-carousel'),
            });
        }
    };

    return (
        <div className='tw-grid tw-gap-3'>
            <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                {__('Custom slide', 'wp-posts-carousel')}
            </div>

            <Field label={__('Title', 'wp-posts-carousel')} error={showError('label') ? errors.label : ''}>
                <Input
                    invalid={Boolean(showError('label'))}
                    value={values.label}
                    onBlur={() => setTouched({ ...touched, label: true })}
                    onChange={(event) => update('label', event.target.value)}
                />
            </Field>

            <Field label={__('Media type', 'wp-posts-carousel')}>
                <Select
                    value={hasVideoSlides ? values.media_kind : 'image'}
                    onValueChange={(mediaKind) => update('media_kind', mediaKind)}
                    options={mediaOptions}
                />
            </Field>

            {values.media_kind === 'video' && (
                <Field
                    label={__('Video URL', 'wp-posts-carousel')}
                    note={__(
                        'Supports YouTube, Vimeo and direct MP4/WebM/Ogg files. If poster URL is empty, the server will try to use the video thumbnail.',
                        'wp-posts-carousel'
                    )}
                >
                    <Input
                        value={values.video_url}
                        placeholder='https://www.youtube.com/watch?v=...'
                        onChange={(event) =>
                            setValues({
                                ...values,
                                video_url: event.target.value,
                                video_poster: '',
                                image_url: '',
                            })
                        }
                    />
                </Field>
            )}

            <Field label={__('Image URL', 'wp-posts-carousel')}>
                <div className='tw-grid tw-grid-cols-[minmax(0,1fr)_auto] tw-gap-2'>
                    <Input value={values.image_url} onChange={(event) => update('image_url', event.target.value)} />
                    <Button variant='outlineAccent' onClick={chooseImage}>
                        {__('Choose', 'wp-posts-carousel')}
                    </Button>
                </div>
            </Field>

            {values.media_kind === 'video' && (
                <Field label={__('Poster URL', 'wp-posts-carousel')}>
                    <Input
                        value={values.video_poster}
                        placeholder={__('Leave empty to use video thumbnail', 'wp-posts-carousel')}
                        onChange={(event) => update('video_poster', event.target.value)}
                    />
                </Field>
            )}

            {values.image_url && (
                <div className='tw-overflow-hidden tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft'>
                    <img className='tw-h-auto tw-max-h-44 tw-w-full tw-object-cover' src={values.image_url} alt='' />
                </div>
            )}

            <Field label={__('Link URL', 'wp-posts-carousel')}>
                <Input value={values.url} onChange={(event) => update('url', event.target.value)} />
            </Field>

            <Field label={__('Description', 'wp-posts-carousel')}>
                <Textarea value={values.description} onChange={(event) => update('description', event.target.value)} />
            </Field>

            <Field label={__('Button label', 'wp-posts-carousel')}>
                <Input value={values.button_label} onChange={(event) => update('button_label', event.target.value)} />
            </Field>

            <Button variant='primary' className='cci-wpc-full' onClick={add}>
                {__('Add custom slide', 'wp-posts-carousel')}
            </Button>
        </div>
    );
}
