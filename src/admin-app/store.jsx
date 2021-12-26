import { observable, action, makeObservable } from 'mobx';

class AppStore {
	@observable loading = false;
	@observable notifications = [];
	@observable formValues = [];

	constructor() {
		makeObservable( this );
	}

	@action setLoading( value ) {
		this.loading = value;
	}

	@action enqueueSnackbar( note ) {
		this.notifications.push( {
			key: new Date().getTime() + Math.random(),
			...note,
		} );
	}

	@action removeSnackbar( key ) {
		this.notifications = this.notifications.filter( ( notification ) => notification.key !== key );
	}

	@action setFormValues( values ) {
		this.formValues = values;
	}

	@action clearFormValues( ) {
		this.formValues = [];
	}	
}
export default new AppStore();
