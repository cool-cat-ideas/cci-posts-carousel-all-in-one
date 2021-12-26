import React from 'react';
import { withSnackbar } from 'notistack';
import { inject, observer } from 'mobx-react';
import { autorun } from 'mobx';

class Notifier extends React.Component {
	constructor( props ) {
		super( props );

		this._isMounted = false;
		this.displayed = [];
	}

	storeDisplayed = ( id ) => {
		this.displayed = [ ...this.displayed, id ];
	};

	componentDidMount() {
		this._isMounted = true;

		autorun( () => {
			if ( this._isMounted ) {
				const { notifications = [] } = this.props.store;

				notifications.forEach( ( notification ) => {
					if ( this.displayed.includes( notification.key ) ) return;

					if ( notification.options.variant === 'error' ) {
						notification.message = 'Ups... ' + notification.message;
					}

					this.props.enqueueSnackbar( notification.message, {
						style: { whiteSpace: 'pre-line' },
						...notification.options,
					} );
					this.storeDisplayed( notification.key );
					this.props.store.removeSnackbar( notification.key );
				} );
			}
		} );
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return null;
	}
}

export default withSnackbar( inject( 'store' )( observer( Notifier ) ) );
