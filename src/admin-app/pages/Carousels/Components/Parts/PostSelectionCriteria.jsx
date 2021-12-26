import React from 'react';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import api from '../../../../components/Api';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import IconButton from '@mui/material/IconButton';
// import Input from '@mui/material/Input';
// import FilledInput from '@mui/material/FilledInput';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { CustomAutocomplete, customAutocompleteDefaultValue } from '../../../../components/Forms';

import { myFormDefaultValue } from './../../../../components/myForm';

import MyTooltip from './../../../../components/Tooltip';

import { useFormikContext } from 'formik';

const { __ } = wp.i18n;
const permalinkStructure = wpPostsCarouselPluginData.permalinkStructure;

const PostSelectionCriteria = ( props ) => {
	const [ postsOptions, setPostsOptions ] = useState( [] );
	const [ search, setSearch ] = useState( '' );
	const [ loading, setLoading ] = useState( false );

	const {
		values,
		touched,
		errors,
		isSubmitting,
		handleChange,
		handleBlur,
		handleSubmit,
		setFieldValue,
	} = useFormikContext();

	const endpoints = {
		posts: '/wp-json/wp-posts-carousel/v1/admin/posts?s=',
		categories: '/wp-json/wp/v2/categories?_fields=id,name,taxonomy&name=',
		tags: '/wp-json/wp/v2/tags?search=',
	};

	const { classes, data, panelName, expanded, handleExpand, store } = props;

	const searchPosts = async ( endpoint ) => {
		if ( endpoint ) {
			setLoading( {posts: true} );
			await api
				.post( endpoint + search, values )
				.then( ( response ) => {
					if ( response.status == 200 && response.data ) {
						let data = response.data;

						// if ( typeof props.customProps.renderOptions === 'function' ) {
						// 	data = data.map( props.customProps.renderOptions );
						// }

						setPostsOptions( data );
					}
				} )
				.catch( ( error ) => {
					props.store.enqueueSnackbar( {
						message: __( 'Failed get data from API', 'wp-posts-carousel' ),
						options: {
							variant: 'error',
						},
					} );
				} );
		}
		setLoading( {posts: false}  );
	};

	useEffect( () => {
		setPostsOptions( data.dictionaries.posts );
	}, [ data.dictionaries.posts ] );
	// useEffect( () => {
	// 	//if(store.formValues) {
	// 	let v = [];

	// 	let newStoreValues = store.formValues;

	// 	if ( newStoreValues.values.length === undefined ) {
	// 		Object.keys( newStoreValues.values ).map( function ( key, index ) {
	// 			const item = newStoreValues.values[ key ];
	// 			if ( typeof item === 'object' ) {
	// 				console.log( newStoreValues.options );
	// 				// newStoreValues.options[key].filter( ( option ) => item.includes( option.value ) );
	// 			} else {
	// 				//item.find( ( option ) => option.value.toLowerCase() === item.toLowerCase() );
	// 			}
	// 			//newStoreValues.values[key] = ;
	// 		} );
	// 		// (newStoreValues.values).map(field => {
	// 		// 	if ( typeof field === 'object' ) {
	// 		// 		 options.filter( ( option ) => field.includes( option.value ) );
	// 		// 	} else {
	// 		// 		 options.find( ( option ) => option.value.toLowerCase() === field.toLowerCase() );
	// 		// 	}
	// 		// })

	// 	}

	// 	// store.setFormValues({store, ...newStore})
	// 	//}
	// }, [ store.formValues ] );


	return (
		<>
			<Accordion defaultExpanded onChange={ handleExpand( panelName ) }>
				<AccordionSummary
					// expandIcon={  }
					aria-controls="panel1bh-content"
					id="panel1bh-header"
				>
					<Typography className={ classes.heading }>
						{ __( 'Post selection criteria', 'wp-posts-carousel' ) }
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<table cellSpacing="0" cellPadding="0" className="wp-posts-carousel-table">
						<tbody>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_post_types', array() ) ?> */ }
							<tr>
								<th>
									{ __( 'Post types', 'wp-posts-carousel' ) }
									<span className={ classes.required }>*</span>
								</th>
								<td>
									<CustomAutocomplete
										name="post_types"
										multiple
										options={ data.dictionaries.taxonomies }
										value={ customAutocompleteDefaultValue(
											data.dictionaries.taxonomies,
											values[ 'post_types' ]
										) }
										onChange={ ( event, newFormikValue ) => {
											if ( newFormikValue.length < values[ 'post_types' ].length ) {
												let v = [];
												let newPostsOptions = [];

												newPostsOptions = postsOptions.filter( ( option ) => {
													if ( newFormikValue.includes( option.post_type ) ) {
														v.push( option.value );
														return true;
													}
													return false;
												} );
												setFieldValue( 'posts', v );
											}
											setFieldValue( 'post_types', newFormikValue );
										} }
										// classes={classes}
									/>
								</td>
							</tr>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_post_types', array() ) ?> */ }
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_show', array() ) ?> */ }
							<tr>
								<th>{ __( 'Show posts', 'wp-posts-carousel' ) }</th>
								<td className="wp-posts-carousel-table-col">
									<table
										cellSpacing="0"
										cellPadding="0"
										className="wp-posts-carousel-table"
									>
										<tbody>
											<tr>
												<th>{ __( 'Order by', 'wp-posts-carousel' ) }</th>
												<td>
													<CustomAutocomplete
														name="order_by"
														options={ data.dictionaries.order_by }
													/>
												</td>
											</tr>
											<tr>
												<th>{ __( 'Posts', 'wp-posts-carousel' ) }</th>
												<td>
													<CustomAutocomplete
														name="posts"
														multiple
														options={ postsOptions }
														value={ customAutocompleteDefaultValue(
															postsOptions,
															values[ 'posts' ]
														) }
														onOpen={ () => {
															searchPosts( endpoints.posts );
														} }
														onInputChange={ ( event, newValue ) => {
															setSearch( newValue );
															searchPosts( endpoints.posts, newValue );
														} }
														noOptionsText={ __(
															'No posts',
															'wp-posts-carousel'
														) }
														groupBy={ ( option ) =>
															data.dictionaries.taxonomies.find(
																( item ) => item.value === option.post_type
															)?.label
														}
														disabled={ ! values[ 'post_types' ] }
														store={ props.store }
														loading={loading.posts}
														// loading={loading}
														// { ...props }
													/>
												</td>
											</tr>
											<tr>
												<th>{ __( 'Exclude Posts', 'wp-posts-carousel' ) }</th>
												<td>
													{ /* <CustomAutocomplete
														name="exclude"
														multiple
														size="small"
														fullWidth
														value={ values.exclude }
														setSearchEndpoint={ endpoints.posts }
														renderOptions={ ( item ) => {
															return {
																value: item.id,
																label: item.title.rendered,
															};
														} }
														noOptionsText={ __(
															'No posts',
															'wp-posts-carousel'
														) }
														{ ...props }
													/> */ }
												</td>
											</tr>
											<tr>
												<th>
													{ __( 'Posts with Categories', 'wp-posts-carousel' ) }
												</th>
												<td>
													{ /* <CustomAutocomplete
														name="categories"
														multiple
														size="small"
														fullWidth
														value={ values.categories }
														setSearchEndpoint={ endpoints.categories }
														renderOptions={ ( item ) => {
															return {
																value: item.id,
																label: item.name,
															};
														} }
														noOptionsText={ __(
															'No posts',
															'wp-posts-carousel'
														) }
														{ ...props }
													/> */ }
												</td>
											</tr>
											<tr>
												<th></th>
												<td>
													<FormControl
														variant="outlined"
														className={ classes.formControl }
														fullWidth
														size="small"
													>
														<Select
															id="relation"
															value={ data && values ? values.relation : '' }
															onChange={ handleChange }
															displayEmpty
														>
															{ data &&
																data.dictionaries.relations &&
																data.dictionaries.relations.map(
																	( item, index ) => {
																		return (
																			<MenuItem
																				value={ item.value }
																				key={ `relation-${ index }` }
																			>
																				{ item.label }
																			</MenuItem>
																		);
																	}
																) }
														</Select>
													</FormControl>
												</td>
											</tr>
											<tr>
												<th>{ __( 'Posts with Tags', 'wp-posts-carousel' ) }</th>
												<td>
													{ /* <CustomAutocomplete
														name="tags"
														multiple
														size="small"
														fullWidth
														value={ values.tags }
														setSearchEndpoint={ endpoints.posts }
														renderOptions={ ( item ) => {
															return {
																value: item.id,
																label: item.title.rendered,
															};
														} }
														noOptionsText={ __(
															'No posts',
															'wp-posts-carousel'
														) }
														{ ...props }
													/> */ }
												</td>
											</tr>

											{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_in_show', array() ); ?> */ }
										</tbody>
									</table>
								</td>
							</tr>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_show', array() ) ?> */ }
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_posts_limit', array() ) ?> */ }
							<tr>
								<th>
									{ __( 'Posts limit', 'wp-posts-carousel' ) }
									<span className={ classes.required }>*</span>
								</th>
								<td>
									<FormControl
										className={ clsx( classes.margin, classes.textField ) }
										variant="outlined"
										fullWidth
									>
										<TextField
											id="outlined-all_items"
											name="all_items"
											value={ values.all_items || '' }
											onChange={ handleChange }
											variant="outlined"
											aria-describedby="outlined-all_items-helper-text"
											type="number"
											helperText={ touched.all_items ? errors.all_items : '' }
											error={ touched.all_items && Boolean( errors.all_items ) }
										/>
									</FormControl>
								</td>
							</tr>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_posts_limit', array() ) ?> */ }
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_ordering', array() ) ?> */ }
							<tr>
								<th>
									<label htmlFor="ordering">
										{ __( 'Ordering', 'wp-posts-carousel' ) }
										<span className={ classes.required }>*</span>
									</label>
								</th>
								<td>
									<FormControl
										variant="outlined"
										className={ classes.formControl }
										fullWidth
										size="small"
									>
										<Select
											id="ordering"
											name="ordering"
											value={ data && values ? values.ordering : '' }
											onChange={ handleChange }
											displayEmpty
											required
										>
											{ data &&
												data.dictionaries.ordering &&
												data.dictionaries.ordering.map( ( item, index ) => {
													return (
														<MenuItem
															value={ item.value }
															key={ `ordering${ index }` }
														>
															{ item.label }
														</MenuItem>
													);
												} ) }
										</Select>
										{ touched.ordering && Boolean( errors.ordering ) && (
											<FormHelperText>{ errors.ordering }</FormHelperText>
										) }
									</FormControl>
								</td>
							</tr>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_ordering', array() ) ?> */ }
						</tbody>
					</table>
				</AccordionDetails>
			</Accordion>
		</>
	);
};
export default observer( PostSelectionCriteria );
