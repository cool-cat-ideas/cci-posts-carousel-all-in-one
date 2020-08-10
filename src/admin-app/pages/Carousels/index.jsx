import React from 'react';
import queryString from 'queryString';

function Carousels( props ) {
	let query = queryString.parse( props.location.search );
	let action = query.action ? query.action : 'List';
	let component = 'List';

	switch ( action.toLowerCase() ) {
		case 'add-new':
			component = 'Create';
			break;
		case 'edit':
			component = 'Edit';
			break;
	}

	const ReturnComponent = require( './' + component ).default;

	return (
		<ReturnComponent { ...props } page={ props.page } action={ action } />
	);
}

export default Carousels;
