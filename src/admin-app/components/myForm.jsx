import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useFormikContext, Form, Formik } from 'formik';

const { __ } = wp.i18n;

const MyForm = ( props ) => {
	const Component = props.form;
	const filteredModel = props.model;

	if ( props.response.values != null ) {
		Object.keys( props.model ).map( ( key ) => {
			filteredModel[ key ] = props.response.values[ key ] || filteredModel[ key ];
		} );
	}

	// const formik = useFormik( {
	// 	initialValues: filteredModel,
	// 	enableReinitialize: props.enableReinitialize || false,
	// 	validationSchema: props.schema || {},
	// 	onSubmit: ( values ) => {
	// 		props.onSubmit( values );
	// 	},
	// } );
	// const { errors, isSubmitting } = useFormikContext();
	// useEffect( () => {
		

	// 	if ( Object.keys( errors ).length > 0 && isSubmitting === true ) {
	// 		props.props.store.enqueueSnackbar( {
	// 			message: __(
	// 				'Form contains errors.\nPlease check fields marked in red',
	// 				'wp-posts-carousel'
	// 			),
	// 			options: {
	// 				variant: 'error',
	// 			},
	// 		} );
	// 	}
	// 	return null;
	// }, [ errors, isSubmitting ] );

	return (
		<Formik
			initialValues={ filteredModel }
			enableReinitialize={ props.enableReinitialize || false }
			validationSchema={ props.schema || {} }
			onSubmit={ ( values, actions ) => {	
				props.onSubmit( values );
			} }
		>
			<Form noValidate>
				<Component {...props.props } data={ props.response.data } />
			</Form>
		</Formik>
	);
};

MyForm.propTypes = {
	model: PropTypes.object.isRequired,
	schema: PropTypes.object.isRequired,
	onSubmit: PropTypes.func.isRequired,
	form: PropTypes.elementType.isRequired,
};

export default MyForm;
