import React, { useEffect, useState } from 'react';
import { __ } from '../i18n';
import { normalizePostOption } from '../utils';
import { TooltipHelp } from './ui/tooltip';
import { Button } from './ui/button';
import { Field } from './ui/field';
import { Input } from './ui/input';

function typePattern(value) {
    return String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function postKey(post) {
    return `${post.postType || post.post_type}-${post.id}`;
}

function reorderByTypePattern(posts, pattern) {
    const buckets = posts.reduce((result, post) => {
        const type = post.postType || post.post_type || 'post';
        result[type] = result[type] || [];
        result[type].push(post);
        return result;
    }, {});
    const next = [];
    let changed = true;

    while (next.length < posts.length && changed) {
        changed = false;
        pattern.forEach((type) => {
            if (next.length >= posts.length || !buckets[type]?.length) {
                return;
            }

            next.push(buckets[type].shift());
            changed = true;
        });
    }

    const used = new Set(next.map(postKey));
    const leftovers = posts.filter((post) => !used.has(postKey(post)));

    return [...next, ...leftovers];
}

function withEditorialLayout(posts) {
    const spans = [2, 1, 1, 2, 1, 1];

    return posts.map((post, index) =>
        normalizePostOption({
            ...post,
            span: spans[index % spans.length],
            group: spans[index % spans.length] > 1 ? `feature-${Math.floor(index / spans.length) + 1}` : '',
            crop_x: 0,
            crop_y: 0,
        })
    );
}

function withStripLayout(posts) {
    const crops = [-75, -25, 25, 75];

    return posts.map((post, index) =>
        normalizePostOption({
            ...post,
            span: 1,
            group: `strip-${Math.floor(index / crops.length) + 1}`,
            crop_x: crops[index % crops.length],
            crop_y: 0,
        })
    );
}

function resetLayout(posts) {
    return posts.map((post) =>
        normalizePostOption({
            ...post,
            span: 1,
            group: '',
            crop_x: 0,
            crop_y: 0,
        })
    );
}

export default function CompositionTools({ posts, postTypes, pattern, onPostsChange, onPatternChange, setNotice }) {
    const defaultRhythm =
        postTypes.length > 1 ? `${postTypes[0]},${postTypes[0]},${postTypes[1]}` : postTypes[0] || 'post';
    const [rhythm, setRhythm] = useState(pattern?.rhythm?.join?.(',') || defaultRhythm);

    useEffect(() => {
        if (!rhythm && defaultRhythm) {
            setRhythm(defaultRhythm);
        }
    }, [defaultRhythm, rhythm]);

    const applyRhythm = () => {
        const parsed = typePattern(rhythm);

        if (!parsed.length || !posts.length) {
            return;
        }

        onPostsChange(reorderByTypePattern(posts, parsed).map(normalizePostOption));
        onPatternChange({ rhythm: parsed, preset: 'type-rhythm' });
        setNotice({
            type: 'success',
            message: __('Composition rhythm applied.', 'wp-posts-carousel'),
        });
    };

    const applyPreset = (preset, mapper) => {
        onPostsChange(mapper(posts));
        onPatternChange({
            ...(pattern || {}),
            preset,
        });
    };

    return (
        <div className='tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3'>
            <div className='tw-grid tw-gap-1'>
                <strong className='tw-inline-flex tw-items-center tw-gap-1.5 tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                    {__('Arrangement helpers', 'wp-posts-carousel')}
                    <TooltipHelp
                        text={__(
                            'Optional helpers that reorder slides or apply visual presets. They do not change your query, only the selected slide order and layout values.',
                            'wp-posts-carousel'
                        )}
                    />
                </strong>
                <span className='tw-text-xs tw-leading-5 tw-text-cci-wpc-muted'>
                    {__('Optional shortcuts for mixed sources and visual story layouts.', 'wp-posts-carousel')}
                </span>
            </div>

            <div className='tw-grid tw-gap-3'>
                <div className='tw-grid tw-grid-cols-[minmax(0,1fr)_auto] tw-items-end tw-gap-2'>
                    <Field
                        label={
                            <span className='tw-inline-flex tw-items-center tw-gap-1.5'>
                                {__('Post type pattern', 'wp-posts-carousel')}
                                <TooltipHelp
                                    text={__(
                                        'Comma-separated post type pattern. Example: post,post,product repeats two posts followed by one product.',
                                        'wp-posts-carousel'
                                    )}
                                />
                            </span>
                        }
                    >
                        <Input
                            value={rhythm}
                            onChange={(event) => setRhythm(event.target.value)}
                            placeholder='post,post,product'
                        />
                    </Field>
                    <Button variant='primary' onClick={applyRhythm} disabled={!posts.length}>
                        {__('Apply', 'wp-posts-carousel')}
                    </Button>
                </div>

                <div className='tw-grid tw-grid-cols-1 tw-gap-2 xl:tw-grid-cols-3'>
                    <Button onClick={() => applyPreset('editorial', withEditorialLayout)} disabled={!posts.length}>
                        {__('Featured rhythm', 'wp-posts-carousel')}
                        <TooltipHelp
                            text={__(
                                'Makes every few slides slightly wider to create a magazine-like rhythm.',
                                'wp-posts-carousel'
                            )}
                        />
                    </Button>
                    <Button onClick={() => applyPreset('strip', withStripLayout)} disabled={!posts.length}>
                        {__('Connected image strip', 'wp-posts-carousel')}
                        <TooltipHelp
                            text={__(
                                'Groups slides and shifts image crops so several slides can feel like connected parts of one image.',
                                'wp-posts-carousel'
                            )}
                        />
                    </Button>
                    <Button onClick={() => applyPreset('reset', resetLayout)} disabled={!posts.length}>
                        {__('Reset layout', 'wp-posts-carousel')}
                        <TooltipHelp
                            text={__(
                                'Clears custom width, group and crop values for all selected slides.',
                                'wp-posts-carousel'
                            )}
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
}
