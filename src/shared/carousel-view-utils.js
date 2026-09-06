export function truthy( value, fallback = true ) {
	if ( value === undefined || value === null || value === '' ) {
		return fallback;
	}

	return value === true || value === 'true' || value === 1 || value === '1';
}

export function cropPosition( slide ) {
	const layout = slide.layout || {};
	const x = Math.max( 0, Math.min( 100, 50 + Number( layout.crop_x || 0 ) / 2 ) );
	const y = Math.max( 0, Math.min( 100, 50 + Number( layout.crop_y || 0 ) / 2 ) );

	return `${ x }% ${ y }%`;
}

export function itemSpan( slide ) {
	return Math.max( 1, Math.min( 6, Number( slide.layout?.span || 1 ) ) );
}

export function stripHtml( value ) {
	const node = document.createElement( 'div' );
	node.innerHTML = value || '';

	return node.textContent || node.innerText || '';
}

export function descriptionText( slide ) {
	if ( slide.description?.text ) {
		return slide.description.text;
	}

	return stripHtml( slide.description?.html );
}
