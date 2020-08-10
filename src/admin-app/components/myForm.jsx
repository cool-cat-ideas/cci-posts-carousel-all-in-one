import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

const MyForm = ( props ) => {
	const Component = props.form;

	const filteredModel = props.model;

	props.response.values != null
		? Object.keys( props.model ).map( ( key ) => {
				filteredModel[ key ] = props.response.values[ key ] ? props.response.values[ key ] : '';
		  } )
		: props.model;

	return (
		<Formik
			initialValues={ filteredModel }
			enableReinitialize={ props.enableReinitialize ? props.enableReinitialize : false }
			validationSchema={ props.schema ? props.schema : {} }
			onSubmit={ props.onSubmit }
		>
			{ ( formikProps ) => <Component { ...props.props } { ...formikProps } data={props.response.data}/> }
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
