import React from 'react';
import Button from '@material-ui/core/Button';
// import CssBaseline from "@material-ui/core/CssBaseline";
import { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';

// import { Formik } from 'formik';

import Form from './Components/FormView';
import { CarouselModel } from './Models/CarouselModel';
import { CreateCarouselSchema } from './Models/Schemas/CreateCarouselSchema';

import useFetch from './../../components/useFetch';
import MyForm from './../../components/myForm';

const { __ } = wp.i18n;

const Create = ( props ) => {
	function getDefaultValues() {
		let values = [];
		let response = useFetch( '/wp-json/wp-posts-carousel/v1/defaultSettings', {} );

		if ( response.isLoading == false && response.data ) {
			values.data = response.data;
			values.values = response.data.default_values ? response.data.default_values : [];
		}

		return values;
	}
	const response = getDefaultValues();

	const { classes, handleSubmit } = props;
	return (
		<Container component="main">
			<div>
				<Typography component="h1" variant="h5">
					{ __( 'Add new carousel', 'wp-posts-carousel' ) }
				</Typography>

				<MyForm
					model={ CarouselModel }
					schema={ CreateCarouselSchema }
					response={ response }
					enableReinitialize={ true }
					onSubmit={ ( values ) => {
						console.log( 'submit' );
						console.log( values );
					} }
					props={ props }
					form={ Form }
				/>
			</div>
		</Container>
	);
};

export default Create;
