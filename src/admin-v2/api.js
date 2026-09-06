export const pluginData = window.wpPostsCarouselPluginData || {};

export function apiFetch( path, options = {} ) {
	return fetch( path, {
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': pluginData.nonce || '',
			...( options.headers || {} ),
		},
		...options,
	} ).then( ( response ) => {
		if ( ! response.ok ) {
			return response
				.json()
				.catch( () => ( {} ) )
				.then( ( error ) => {
					const requestError = new Error(
						error.message || error.code || `WP Posts Carousel API request failed (${ response.status }).`
					);

					requestError.code = error.code || '';
					requestError.status = response.status;
					requestError.details = error.details || error.data?.details || '';
					requestError.data = error.data || {};

					throw requestError;
				} );
		}

		return response.json();
	} );
}
