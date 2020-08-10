import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import queryString from 'queryString';
import DashboardHoc from './DashboardHoc';

class App extends React.Component {
	render( props ) {
		return (
			<Router basename="/wp-admin">
				<Route
					path="*"
					render={ ( routeProps ) => {
						let query = queryString.parse(
							routeProps.location.search
						);
						let page = query.subpage
							? query.subpage.slice( 0, 1 ).toUpperCase() +
							  query.subpage.slice( 1, query.subpage.length )
							: 'Dashboard';

						const ReturnComponent = require( './pages/' + page )
							.default;
						const Hoc = DashboardHoc( ReturnComponent );

						return <Hoc { ...routeProps } page={page} />;
					} }
				/>
			</Router>
		);
	}
}

export default App;
