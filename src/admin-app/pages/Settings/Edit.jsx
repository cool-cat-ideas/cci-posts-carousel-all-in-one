import React from 'react';
import Button from '@mui/material/Button';
// import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
// import { makeStyles } from "@mui/styles";
import Container from '@mui/material/Container';

// import { Formik } from 'formik';
import { observer } from 'mobx-react';
import Form from './Components/FormView';
import { SettingsModel } from './Models/SettingsModel';
import { SettingsSchema } from './Models/Schemas/SettingsSchema';

import api from '../../components/Api';
import MyForm from './../../components/myForm';

const { __ } = wp.i18n;

const Edit = ( props ) => {
	const [ settings, setSettings ] = useState( [] );

	useEffect( () => {
		let values = settings;
		let response = api
			.get( '/wp-json/wp-posts-carousel/v1/settings', {} )
			.then( ( res ) => setSettings( res.data ) )
			.catch( ( error ) =>
				props.store.enqueueSnackbar( {
					message: __( 'Failed fetching data.', 'wp-posts-carousel' ),
					options: {
						variant: 'error',
					},
				} )
			);

		if ( response.loading == false && response.data ) {
			values.data = response.data;
			values.values = response.data.default_values ? response.data.default_values : [];
			setSettings( values );
		}
	}, [ setSettings ] );

	return (
		<Container component="main">
			<Typography component="h1" variant="h5">
				{ __( 'Edit settings', 'wp-posts-carousel' ) }
			</Typography>

			<MyForm
				model={ SettingsModel }
				schema={ SettingsSchema }
				response={ settings }
				enableReinitialize={ true }
				onSubmit={ ( values ) => {
					console.log( 'submit' );
					console.log( values );
				} }
				props={ props }
				form={ Form }
			/>
		</Container>
	);
};

export default Edit;
