import React from './wp-element-react';

export const Fragment = React.Fragment;

export function jsx(type, props, key) {
	const config = props == null ? {} : { ...props };

	if (key !== undefined) {
		config.key = key;
	}

	return React.createElement(type, config);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
