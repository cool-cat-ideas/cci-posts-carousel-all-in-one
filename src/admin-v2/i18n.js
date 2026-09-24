import { pluginData } from './api';

export const __ = window.wp?.i18n?.__ || ( ( text ) => text );

export function licenseString( text ) {
	if ( text === 'License active' ) {
		return __( 'License active', 'wp-posts-carousel' );
	}

	if ( text === 'License inactive' ) {
		return __( 'License inactive', 'wp-posts-carousel' );
	}

	if ( text === 'Enter your license key to unlock Pro add-ons on this domain.' ) {
		return __( 'Enter your license key to unlock Pro add-ons on this domain.', 'wp-posts-carousel' );
	}

	if ( text === 'License key' ) {
		return __( 'License key', 'wp-posts-carousel' );
	}

	if ( text === 'Activate license' ) {
		return __( 'Activate license', 'wp-posts-carousel' );
	}

	if ( text === 'Activating...' ) {
		return __( 'Activating...', 'wp-posts-carousel' );
	}

	if ( text === 'Already have a key? Paste it here and activate Pro in seconds.' ) {
		return __( 'Already have a key? Paste it here and activate Pro in seconds.', 'wp-posts-carousel' );
	}

	return __( text, 'wp-posts-carousel' );
}

export function coreString( key, fallback ) {
	return pluginData.i18n?.[ key ] || __( fallback );
}
