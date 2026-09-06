import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { __ } from '../i18n';
import { normalizePostOption } from '../utils';
import { CheckboxField } from './ui/checkbox';
import { Field } from './ui/field';
import { Input } from './ui/input';

function postKey(post) {
    return `${post.postType || post.post_type || 'post'}:${post.id}`;
}

function normalizeTypeOptions(availablePostTypes, postTypes) {
    const source = Array.isArray(availablePostTypes) && availablePostTypes.length
        ? availablePostTypes
        : postTypes.map((postType) => ({ value: postType, label: postType }));

    return source
        .map((postType) => ({
            value: String(postType.value || postType),
            label: String(postType.label || postType.value || postType),
        }))
        .filter((postType) => postType.value);
}

export default function PostSearch({ postTypes, availablePostTypes = [], selectedPosts, onAdd, setNotice }) {
    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const typeOptions = normalizeTypeOptions(availablePostTypes, postTypes);
    const [manualPostTypes, setManualPostTypes] = useState(() => {
        const allowed = new Set(typeOptions.map((postType) => postType.value));
        const initial = postTypes.filter((postType) => allowed.has(String(postType))).map(String);

        return initial.length ? initial : typeOptions.slice(0, 1).map((postType) => postType.value);
    });
    const manualPostTypesKey = manualPostTypes.join('|');
    const typeOptionsKey = typeOptions.map((postType) => postType.value).join('|');

    useEffect(() => {
        const allowed = new Set(typeOptions.map((postType) => postType.value));
        const next = manualPostTypes.filter((postType) => allowed.has(postType));

        if (next.length !== manualPostTypes.length) {
            setManualPostTypes(next);
        }
    }, [manualPostTypes, typeOptions, typeOptionsKey]);

    useEffect(() => {
        const query = term.trim();

        if (query.length < 2 || !manualPostTypes.length) {
            setResults([]);
            return undefined;
        }

        const timeout = window.setTimeout(() => {
            setSearching(true);
            apiFetch('/wp-json/wp-posts-carousel/v1/admin/posts', {
                method: 'POST',
                body: JSON.stringify({
                    post_types: manualPostTypes,
                    s: query,
                }),
            })
                .then((response) => setResults(response.map(normalizePostOption)))
                .catch(() => {
                    setNotice({
                        type: 'error',
                        message: __('Failed searching posts.', 'wp-posts-carousel'),
                    });
                })
                .finally(() => setSearching(false));
        }, 250);

        return () => window.clearTimeout(timeout);
    }, [term, manualPostTypesKey, setNotice]);

    const selectedKeys = selectedPosts.map(postKey);

    const togglePostType = (postType, checked) => {
        setManualPostTypes((current) => {
            if (checked) {
                return Array.from(new Set([...current, postType]));
            }

            return current.filter((selected) => selected !== postType);
        });
    };

    return (
        <div className='tw-grid tw-gap-3'>
            {typeOptions.length > 1 && (
                <Field label={__('Manual slide post types', 'wp-posts-carousel')}>
                    <div className='tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2'>
                        {typeOptions.map((postType) => {
                            const checked = manualPostTypes.includes(postType.value);

                            return (
                                <CheckboxField
                                    checked={checked}
                                    key={postType.value}
                                    onCheckedChange={(isChecked) => togglePostType(postType.value, Boolean(isChecked))}
                                >
                                    {postType.label}
                                </CheckboxField>
                            );
                        })}
                    </div>
                </Field>
            )}

            <Field label={__('Add specific post', 'wp-posts-carousel')}>
                <Input
                    value={term}
                    placeholder={__('Type at least 2 characters...', 'wp-posts-carousel')}
                    onChange={(event) => setTerm(event.target.value)}
                />
            </Field>

            {term.trim().length >= 2 && (
                <div className='tw-grid tw-gap-2'>
                    {searching && (
                        <div className='tw-rounded-md tw-bg-cci-wpc-surfaceSoft tw-p-3 tw-text-sm tw-text-cci-wpc-muted'>
                            {__('Searching...', 'wp-posts-carousel')}
                        </div>
                    )}

                    {!searching &&
                        results.map((post) => {
                            const isSelected = selectedKeys.includes(postKey(post));

                            return (
                                <button
                                    type='button'
                                    className='tw-grid tw-w-full tw-cursor-pointer tw-grid-cols-[auto_minmax(0,1fr)_auto] tw-items-center tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-white tw-p-3 tw-text-left hover:tw-border-cci-wpc-brandBorder hover:tw-bg-cci-wpc-brandSoft disabled:tw-cursor-not-allowed disabled:tw-opacity-60'
                                    key={`${post.postType}-${post.id}`}
                                    disabled={isSelected}
                                    onClick={() => onAdd(post)}
                                >
                                    <span className='tw-rounded-full tw-bg-cci-wpc-surfaceMuted tw-px-2 tw-py-1 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-text-cci-wpc-muted'>
                                        {post.postType}
                                    </span>
                                    <strong className='tw-min-w-0 tw-truncate tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                        {post.label}
                                    </strong>
                                    <small className='tw-text-xs tw-font-semibold tw-text-cci-wpc-brandStrong'>
                                        {isSelected ? __('Added', 'wp-posts-carousel') : __('Add', 'wp-posts-carousel')}
                                    </small>
                                </button>
                            );
                        })}

                    {!searching && results.length === 0 && (
                        <div className='tw-rounded-md tw-bg-cci-wpc-surfaceSoft tw-p-3 tw-text-sm tw-text-cci-wpc-muted'>
                            {__('No matching posts.', 'wp-posts-carousel')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
