import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Form from './Components/FormView';
import { CarouselModel } from './Models/CarouselModel';
import { CarouselSchema } from './Models/Schemas/CarouselSchema';
import api from '../../components/Api';

import MyForm from './../../components/myForm';

const { __ } = wp.i18n;
const pluginUrl = wpPostsCarouselPluginData.pluginUrl;

const Create = ( props ) => {
	const [ carousel, setCarousel ] = useState( );

	useEffect( async () => {
		let values = [];

		await api.get( '/wp-json/wp-posts-carousel/v1/admin/defaultSettings', {} )
			.then( ( response ) => {
				if ( response.status == 200 && response.data ) {
					values.data = response.data;
					values.values = response.data.default_values ? response.data.default_values : [];
					setCarousel( values );
					console.log(values)
					props.store.setFormValues( {
						options: values.data.dictionaries,
						values: values.values
					} );
				}
			} )
			.catch( ( error ) => {
				props.store.enqueueSnackbar( {
					message: __( 'Failed fetching data.', 'wp-posts-carousel' ),
					options: {
						variant: 'error',
					},
				} );
			} );
		return;
	}, [] );

	return (
		<Container component="main">
			<Typography component="h1" variant="h5">
				{ __( 'Add new carousel', 'wp-posts-carousel' ) }
			</Typography>

			{ carousel && (
				<MyForm
					model={ CarouselModel }
					schema={ CarouselSchema }
					response={ carousel }
					enableReinitialize={ true }
					onSubmit={ ( values ) => {
						api.post( '/wp-json/wp-posts-carousel/v1/admin/carousel', values )
							.then( ( response ) => {
								if ( response.status == 200 && response.data ) {
									props.store.enqueueSnackbar( {
										message: __( 'Carousel was saved', 'wp-posts-carousel' ),
										options: {
											variant: 'success',
											autoHideDuration: 1000,
											onExit: () => {
												props.history.push(
													`${ pluginUrl }&subpage=carousels&action=edit&id=${ response.data.ID }`
												);
											},
										},
									} );
								}
							} )
							.catch( ( error ) => {
								props.store.enqueueSnackbar( {
									message: __( 'Failed save carousel', 'wp-posts-carousel' ),
									options: {
										variant: 'error',
									},
								} );
							} );
					} }
					props={ props }
					form={ Form }
				/>
			) }
		</Container>
	);
};

export default observer( Create );
