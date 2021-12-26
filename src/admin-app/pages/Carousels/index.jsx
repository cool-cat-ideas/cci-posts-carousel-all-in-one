import React from 'react';
import queryString from 'queryString';
import { observer } from 'mobx-react';
import  List  from './List'
import  Create  from './Create'
import  Edit  from './Edit'

function Carousels( props ) {
	let query = queryString.parse( props.location.search );
	let action = query.action ? query.action : 'List';
	let ReturnComponent = null;

	switch ( action.toLowerCase() ) {
		case 'add-new':
			ReturnComponent = Create;
			break;
		case 'edit':
			ReturnComponent = Edit;
			break;
		default:
			ReturnComponent = List;
			break;
	}

	//const ReturnComponent = require( './' + component ).default;

	return (
		<ReturnComponent { ...props } page={ props.page } action={ action } />
	);
}

export default (Carousels);
