import React from 'react';
import { __ } from '../i18n';
import { CheckboxField } from './ui/checkbox';
import { Field } from './ui/field';
import { Input } from './ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './ui/input-group';
import { Select } from './ui/select';

function boolValue(value, fallback = false) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    return value === true || value === 'true' || value === 1 || value === '1';
}

function fieldValue(values, field) {
    if (Object.prototype.hasOwnProperty.call(values, field.name)) {
        return values[field.name];
    }

    return field.default_value ?? '';
}

function unitForField(field) {
    const name = String(field.name || '').toLowerCase();
    const label = String(field.label || '').toLowerCase();
    const source = `${name} ${label}`;

    if (field.unit) {
        return field.unit;
    }

    if (/percent|percentage|opacity|crop|position/.test(source)) {
        return '%';
    }

    if (/width|height|padding|margin|gap|radius|size|spacing|offset/.test(source)) {
        return 'px';
    }

    return '';
}

function unitFieldFor(field, fields) {
    return fields.find((item) => item.name === `${field.name}_unit` && item.type === 'select');
}

function FieldControl({ field, values, onChange }) {
    if (field.type === 'radio') {
        return (
            <CheckboxField
                checked={boolValue(fieldValue(values, field), Boolean(field.default_value))}
                onCheckedChange={(checked) => onChange(field.name, checked === true)}
            >
                {field.label}
            </CheckboxField>
        );
    }

    if (field.type === 'select') {
        return (
            <Field label={field.label}>
                <Select
                    value={fieldValue(values, field)}
                    onValueChange={(value) => onChange(field.name, value)}
                    options={field.options || []}
                />
            </Field>
        );
    }

	if (field.type === 'number') {
		const unit = unitForField(field);
		const min = field.min ?? field.min_value ?? undefined;
		const max = field.max ?? field.max_value ?? undefined;
		const step = field.step ?? 1;

		return (
			<Field label={field.label || field.name}>
				{unit ? (
					<InputGroup>
						<InputGroupInput
							max={max}
							min={min}
							step={step}
							type='number'
							value={fieldValue(values, field)}
							onChange={(event) =>
								onChange(field.name, event.target.value === '' ? '' : Number(event.target.value))
							}
                        />
                        <InputGroupAddon align='inline-end' className='tw-min-w-12'>
                            <InputGroupText>{unit}</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                ) : (
					<Input
						max={max}
						min={min}
						step={step}
						type='number'
						value={fieldValue(values, field)}
						onChange={(event) =>
							onChange(field.name, event.target.value === '' ? '' : Number(event.target.value))
						}
                    />
                )}
            </Field>
        );
    }

    return null;
}

function GroupControl({ field, values, onChange }) {
    const unitPairs = new Set();
    const controls = (field.fields || [])
        .map((child) => {
            const unitField = child.type === 'number' ? unitFieldFor(child, field.fields || []) : null;

            if (!unitField) {
                return null;
            }

            unitPairs.add(child.name);
            unitPairs.add(unitField.name);

            return (
                <Field label={field.label || child.label || child.name} key={child.name}>
                    <InputGroup>
                        <InputGroupInput
                            type='number'
                            value={fieldValue(values, child)}
                            onChange={(event) =>
                                onChange(child.name, event.target.value === '' ? '' : Number(event.target.value))
                            }
                        />
                        <InputGroupAddon align='inline-end' className='tw-w-[92px] tw-p-0'>
                            <Select
                                value={fieldValue(values, unitField)}
                                onValueChange={(value) => onChange(unitField.name, value)}
                                aria-label={__('Unit', 'wp-posts-carousel')}
                                className='tw-min-h-10 tw-w-full tw-min-w-0 tw-rounded-none tw-border-0 tw-bg-transparent tw-px-2.5 focus:tw-border-0 focus:tw-bg-transparent focus:tw-outline-none focus-visible:tw-border-0 focus-visible:tw-bg-transparent focus-visible:tw-outline-none'
                                options={unitField.options || []}
                            />
                        </InputGroupAddon>
                    </InputGroup>
                </Field>
            );
        })
        .filter(Boolean);
    const remainingFields = (field.fields || []).filter((child) => !unitPairs.has(child.name));

    return (
        <div className='tw-grid tw-gap-2'>
            {!controls.length && <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>{field.label}</div>}
            <div className='tw-grid tw-grid-cols-1 tw-gap-3 sm:tw-grid-cols-2'>
                {controls}
                {remainingFields.map((child) => (
                    <FieldControl key={child.name} field={child} values={values} onChange={onChange} />
                ))}
            </div>
        </div>
    );
}

export default function DisplaySettings({ definitions, postTypes, value, onChange }) {
    const fallbackDefinition = definitions.post || [];
    const selectedGroups = postTypes.filter(Boolean);
    const groups = selectedGroups.length ? selectedGroups : ['post'].filter((postType) => definitions[postType]);

    const updateGroup = (groupName, fieldName, nextValue) => {
        onChange({
            ...value,
            [groupName]: {
                ...(value[groupName] || {}),
                [fieldName]: nextValue,
            },
        });
    };

    if (!groups.length) {
        return null;
    }

    return (
        <div className='tw-grid tw-gap-4'>
            <div className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>
                {__('Slide display', 'wp-posts-carousel')}
            </div>

            {groups.map((groupName) => {
                const fields = definitions[groupName] || fallbackDefinition;
                const values = value[groupName] || {};

                return (
                    <div
                        className='tw-grid tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-cci-wpc-border tw-bg-cci-wpc-surfaceSoft tw-p-3'
                        key={groupName}
                    >
                        <div>
                            <strong className='tw-text-sm tw-font-semibold tw-text-cci-wpc-text'>{groupName}</strong>
                        </div>

                        <div className='tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2'>
                            {fields
                                .filter((field) => field.type === 'radio')
                                .map((field) => (
                                    <FieldControl
                                        key={field.name}
                                        field={field}
                                        values={values}
                                        onChange={(name, nextValue) => updateGroup(groupName, name, nextValue)}
                                    />
                                ))}
                        </div>

                        <div className='tw-grid tw-grid-cols-1 tw-gap-3'>
                            {fields
                                .filter((field) => field.type !== 'radio')
                                .map((field) =>
                                    field.type === 'group' ? (
                                        <GroupControl
                                            key={field.name}
                                            field={field}
                                            values={values}
                                            onChange={(name, nextValue) => updateGroup(groupName, name, nextValue)}
                                        />
                                    ) : (
                                        <FieldControl
                                            key={field.name}
                                            field={field}
                                            values={values}
                                            onChange={(name, nextValue) => updateGroup(groupName, name, nextValue)}
                                        />
                                    )
                                )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
