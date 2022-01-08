import React, { useEffect, useState, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'queryString';
// import { observer } from 'mobx-react';

import {formClasses} from '../../components/styles';

import Loadable from '../../ui-component/Loadable';

const List = Loadable( lazy( () => import( './List' ) ) );
const Create = Loadable( lazy( () => import( './Create' ) ) );
const Edit = Loadable( lazy( () => import( './Edit' ) ) );

const Carousels = ( props  ) => {
	let location = useLocation();
	let query = queryString.parse( location.search );
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

	return (
		<ReturnComponent { ...props } classes={formClasses()} action={ action } />
	);
}



export default (Carousels);
