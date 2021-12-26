import React from 'react';
import queryString from 'queryString';
import { observer } from 'mobx-react';

class Settings extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		let query = queryString.parse( this.props.location.search );
		let action = query.action ? query.action : 'List';
		let component = 'Edit';

		const ReturnComponent = require( './' + component ).default;
		
		return <ReturnComponent { ...this.props } action={ action } />;
	}
}

export default observer(Settings);
