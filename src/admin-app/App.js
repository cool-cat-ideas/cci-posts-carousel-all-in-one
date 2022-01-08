import React from 'react';
import { observer, inject } from 'mobx-react';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from './routes';

// defaultTheme
import themes from './themes';

// project imports
import NavigationScroll from './layout/NavigationScroll';

const App = (props) => {

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes()}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes  { ...props } />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default inject( 'store' )( observer ( App ) );



// import React from 'react';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import queryString from 'queryString';
// import { observer, inject } from 'mobx-react';

// import api from './components/Api';
// import DashboardHoc from './DashboardHoc';

// class App extends React.Component {
// 	constructor( props ) {
// 		super( props );

// 		console.log( 'app' );

// 		api.interceptors.request.use(
// 			function ( config ) {
// 				console.log( 'loader start' );
// 				props.store.setLoading( true );
// 				return config;
// 			},
// 			function ( error ) {
// 				console.log( 'loader start error' );
// 				return Promise.reject( error );
// 			}
// 		);

// 		api.interceptors.response.use(
// 			function ( response ) {
// 				console.log( 'loader stop' );
// 				props.store.setLoading( false );

// 				return response;
// 			},
// 			function ( error ) {
// 				console.log( 'loader stop error' );
// 				props.store.setLoading( false );
// 				return Promise.reject( error );
// 			}
// 		);
// 	}

// 	render() {
// 		return (
// 			<Router basename="/wp-admin">
// 				<Route
// 					path="*"
// 					render={ ( routeProps ) => {
// 						let query = queryString.parse( routeProps.location.search );
// 						let page = query.subpage
// 							? query.subpage.slice( 0, 1 ).toUpperCase() +
// 							  query.subpage.slice( 1, query.subpage.length )
// 							: 'Dashboard';

// 						const ReturnComponent = require( './pages/' + page ).default;
// 						const Hoc = DashboardHoc( ReturnComponent );

// 						return <Hoc { ...routeProps } page={ page } />;
// 					} }
// 				/>
// 			</Router>
// 		);
// 	}
// }