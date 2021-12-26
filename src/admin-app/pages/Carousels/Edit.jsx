import React, { useEffect, useState } from 'react';
import queryString from 'queryString';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Form from './Components/FormView';
import { EditCarouselModel } from './Models/EditCarouselModel';
import { EditCarouselSchema } from './Models/Schemas/EditCarouselSchema';
import api from '../../components/Api';

import MyForm from './../../components/myForm';

const { __ } = wp.i18n;
const pluginUrl = wpPostsCarouselPluginData.pluginUrl;

const Edit = ( props ) => {
	const [ carousel, setCarousel ] = useState();

	useEffect( async () => {
		let values = [];
		const query = queryString.parse( props.location.search );

		await api
			.get( '/wp-json/wp-posts-carousel/v1/admin/carousel/' + query.id, {} )
			.then( ( response ) => {
				if ( response.status == 200 && response.data ) {
					values.data = response.data;

					values.values = [];
					values.values.id = response.data.post.ID;
					values.values.title = response.data.post.post_title;

					const carousel_data = response.data.post.params
						? JSON.parse( response.data.post.params )
						: response.data.default_values;
					values.values = Object.assign( values.values, carousel_data );

					setCarousel( values );
					props.store.setFormValues( {
						options: values.data.dictionaries,
						values: carousel_data
					} );
					//console.log(values)
				}
			} )
			.catch( ( error ) => {
				props.store.enqueueSnackbar( {
					message: __( 'Failed fetching data', 'wp-posts-carousel' ),
					options: {
						variant: 'error',
					},
				} );
			} );
		return () => setCarousel( [] );
	}, [] );

	return (
		<Container component="main">
			<Typography component="h1" variant="h5">
				{ __( 'Edit carousel', 'wp-posts-carousel' ) }
			</Typography>
			{ carousel && (
				<MyForm
					model={ EditCarouselModel }
					schema={ EditCarouselSchema }
					response={ carousel }
					enableReinitialize={ true }
					onSubmit={ ( values ) => {
						api.put(
							`/wp-json/wp-posts-carousel/v1/admin/carousel/${ carousel.values.id }`,
							values
						)
							.then( ( response ) => {
								if ( response.status == 200 && response.data ) {
									props.store.enqueueSnackbar( {
										message: __( 'Carousel was saved', 'wp-posts-carousel' ),
										options: {
											variant: 'success',
											autoHideDuration: 1000,
											onExiting: () => {
												props.history.push(
													`${ pluginUrl }&subpage=carousels&action=edit&id=${ carousel.values.id }`
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

export default observer( Edit );
