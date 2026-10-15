import { createApiError } from '@cci/admin-ui';
import { resolveApiUrl } from './api-url.mjs';
export const pluginData = window.wpPostsCarouselPluginData || {};

export function apiFetch( path, options = {} ) {
	return fetch( resolveApiUrl(path, pluginData.restRoot), {
		credentials: 'same-origin',
		...options,
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': pluginData.nonce || '',
			...( options.headers || {} ),
		},
	} ).then( ( response ) => {
		if ( ! response.ok ) {
			return response
				.json()
				.catch( () => ( {} ) )
				.then( ( error ) => {
					throw createApiError(error, response.status, `WP Posts Carousel API request failed (${response.status}).`);
				} );
		}

		return response.json().then((payload) => {
            if (payload?.success === false) {
                throw createApiError(payload, response.status, `WP Posts Carousel API request failed (${response.status}).`);
            }
            return payload;
        });
	} );
}
