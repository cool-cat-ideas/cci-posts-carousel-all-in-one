import { __ } from '../i18n/i18n';

export function openMediaPicker( onSelect ) {
	if ( ! window.wp?.media ) {
		return false;
	}

	const frame = window.wp.media( {
		title: __( 'Select image', 'cci-posts-carousel' ),
		button: {
			text: __( 'Use image', 'cci-posts-carousel' ),
		},
		library: {
			type: 'image',
		},
		multiple: false,
	} );

	frame.on( 'select', () => {
		const attachment = frame.state().get( 'selection' ).first()?.toJSON();

		if ( attachment?.url ) {
			onSelect( attachment.url, attachment );
		}
	} );

	frame.open();

	return true;
}
