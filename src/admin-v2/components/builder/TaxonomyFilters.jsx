import React, { useEffect, useMemo, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { __ } from '../../i18n/i18n';
import { normalizeTaxonomyGroups, normalizeTermOption } from '../../lib/utils';
import { Button } from '../ui/button';
import { Field } from '../ui/field';
import TermAutocomplete from './TermAutocomplete';
import { Select } from '../ui/select';

function getGroup(groups, postType) {
    return groups.find((group) => group.post_type === postType);
}

function getFilter(group, taxonomyName) {
    return group?.taxonomies?.find((taxonomy) => taxonomy.name === taxonomyName);
}

export default function TaxonomyFilters({
    taxonomiesByPostType,
    operators,
    postTypes,
    value,
    relation,
    onChange,
    onRelationChange,
    setNotice,
}) {
    const [activeTaxonomy, setActiveTaxonomy] = useState('');
    const groups = normalizeTaxonomyGroups(value);

    const availableTaxonomies = useMemo(() => {
        const unique = new Map();

        postTypes.forEach((postType) => {
            (taxonomiesByPostType[postType] || []).forEach((taxonomy) => {
                if (!unique.has(taxonomy.name)) {
                    unique.set(taxonomy.name, {
                        ...taxonomy,
                        post_type: postType,
                    });
                }
            });
        });

        return Array.from(unique.values());
    }, [postTypes.join('|'), taxonomiesByPostType]);

    useEffect(() => {
        if (availableTaxonomies.length && !activeTaxonomy) {
            setActiveTaxonomy(availableTaxonomies[0].name);
        }
    }, [availableTaxonomies, activeTaxonomy]);

    const updateGroups = (nextGroups) => onChange(normalizeTaxonomyGroups(nextGroups));

    const upsertFilter = (taxonomy, patch) => {
        const postType = taxonomy.post_type;
        const nextGroups = [...groups];
        let group = getGroup(nextGroups, postType);

        if (!group) {
            group = { post_type: postType, taxonomies: [] };
            nextGroups.push(group);
        }

        const existing = getFilter(group, taxonomy.name);
        if (existing) {
            group.taxonomies = group.taxonomies.map((item) =>
                item.name === taxonomy.name ? { ...item, ...patch } : item
            );
        } else {
            group.taxonomies = [
                ...group.taxonomies,
                {
                    name: taxonomy.name,
                    label: taxonomy.label,
                    operator: 'in',
                    terms: [],
                    ...patch,
                },
            ];
        }

        updateGroups(nextGroups);
    };

    const removeFilter = (postType, taxonomyName) => {
        updateGroups(
            groups
                .map((group) =>
                    group.post_type === postType
                        ? {
                              ...group,
                              taxonomies: group.taxonomies.filter((taxonomy) => taxonomy.name !== taxonomyName),
                          }
                        : group
                )
                .filter((group) => group.taxonomies.length)
        );
    };

    const addTerm = (taxonomy, term) => {
        const group = getGroup(groups, taxonomy.post_type);
        const filter = getFilter(group, taxonomy.name);
        const terms = filter?.terms || [];
        const nextTerm = normalizeTermOption(term);

        if (terms.some((item) => item.value === nextTerm.value)) {
            return;
        }

        upsertFilter(taxonomy, {
            terms: [...terms, nextTerm],
        });
    };

    const removeTerm = (taxonomy, termValue) => {
        const filter = getFilter(getGroup(groups, taxonomy.post_type), taxonomy.name);

        const remaining = (filter?.terms || []).filter((term) => term.value !== termValue);
        if (!remaining.length) {
            removeFilter(taxonomy.post_type, taxonomy.name);
            return;
        }
        upsertFilter(taxonomy, { terms: remaining });
    };

    if (!availableTaxonomies.length) {
        return null;
    }

    const active = availableTaxonomies.find((taxonomy) => taxonomy.name === activeTaxonomy) || availableTaxonomies[0];
    const activeFilter = getFilter(getGroup(groups, active.post_type), active.name);
    const selectedTermValues = (activeFilter?.terms || []).map((term) => term.value);

    return (
        <div className='tw-grid tw-gap-3'>
            <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                {__('Taxonomy filters', 'cci-posts-carousel')}
            </div>

            <Field label={__('Relation', 'cci-posts-carousel')}>
                <Select
                    value={relation || 'or'}
                    onValueChange={onRelationChange}
                    options={[
                        { value: 'or', label: __('Or', 'cci-posts-carousel') },
                        { value: 'and', label: __('And', 'cci-posts-carousel') },
                    ]}
                />
            </Field>

            <Field label={__('Taxonomy', 'cci-posts-carousel')}>
                <Select
                    value={active.name}
                    onValueChange={setActiveTaxonomy}
                    options={availableTaxonomies.map((taxonomy) => ({
                        value: taxonomy.name,
                        label: taxonomy.label,
                    }))}
                />
            </Field>

            <div className='tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2'>
                <Field label={__('Operator', 'cci-posts-carousel')}>
                    <Select
                        value={activeFilter?.operator || 'in'}
                        onValueChange={(operator) => upsertFilter(active, { operator })}
                        options={operators || []}
                    />
                </Field>

                <Field label={active.name === 'category' ? __('Search categories', 'cci-posts-carousel') : active.name === 'post_tag' ? __('Search tags', 'cci-posts-carousel') : __('Search terms', 'cci-posts-carousel')}>
                    <TermAutocomplete key={active.post_type + ':' + active.name} taxonomy={active} selectedValues={selectedTermValues} onSelect={(term) => addTerm(active, term)} />
                </Field>
            </div>

            {groups.length > 0 && (
                <div className='tw-grid tw-gap-2'>
                    {groups.map((group) =>
                        group.taxonomies.map((taxonomy) => (
                            <div
                                className='tw-grid tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3'
                                key={`${group.post_type}-${taxonomy.name}`}
                            >
                                <div className='tw-flex tw-items-center tw-justify-between tw-gap-2'>
                                    <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                                        {taxonomy.label || taxonomy.name}
                                    </strong>
                                    <Button size='icon'
                                        variant='danger'
                                        onClick={() => removeFilter(group.post_type, taxonomy.name)}
                                        aria-label={__('Remove filter', 'cci-posts-carousel')}
                                        title={__('Remove filter', 'cci-posts-carousel')}
                                    >
                                        <Trash2 aria-hidden='true' />
                                    </Button>
                                </div>
                                <div className='tw-flex tw-flex-wrap tw-gap-2'>
                                    {taxonomy.terms.map((term) => (
                                        <button
                                            type='button'
                                            aria-label={__('Remove term', 'cci-posts-carousel') + ': ' + term.label}
                                            title={__('Remove term', 'cci-posts-carousel') + ': ' + term.label}
                                            className='tw-inline-flex tw-items-center tw-gap-1.5 tw-cursor-pointer tw-rounded-full tw-border tw-border-solid tw-border-cci-wpc-brandBorder tw-bg-white tw-px-3 tw-py-1.5 tw-text-xs tw-font-semibold tw-text-cci-wpc-brandStrong hover:tw-bg-cci-wpc-brandSoft'
                                            key={term.value}
                                            onClick={() =>
                                                removeTerm({ ...taxonomy, post_type: group.post_type }, term.value)
                                            }
                                        >
                                            {term.label}
                                            <X aria-hidden='true' className='tw-h-3.5 tw-w-3.5' />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
