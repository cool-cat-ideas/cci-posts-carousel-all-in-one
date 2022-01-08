import React, { useEffect, useState, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import queryString from 'queryString';

// project imports
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';

const Dashboard = Loadable( lazy( () => import( '../views/dashboard/index' ) ) );
const Carousels = Loadable( lazy( () => import( '../pages/Carousels/index' ) ) );

const AppHocRoutes = ( props ) => {
	let location = useLocation();
	let query = queryString.parse( location.search );
	let subpage = query.subpage ? query.subpage : 'dashboard';
	let ReturnComponent = null;

	switch ( subpage ) {
		default:
		case 'dashboard':
			ReturnComponent = Dashboard;
			break;
		case 'carousels':
			ReturnComponent = Carousels;
			break;
			case 'settings':
			ReturnComponent = Carousels;
			break;
	}

	return (
		<ReturnComponent { ...props } />
	);
}

const AppRoutes = (props) => {
	return (
		<Routes>
			<Route exact path="/" element={ <MainLayout  { ...props } /> }>
				<Route path="*" element={ <AppHocRoutes  { ...props } /> } />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
