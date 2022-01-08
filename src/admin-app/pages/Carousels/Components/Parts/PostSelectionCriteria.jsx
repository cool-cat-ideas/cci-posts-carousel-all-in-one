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

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';



import { CustomAutocomplete } from '../../../../components/Forms';

import MyTooltip from './../../../../components/Tooltip';

import { useFormikContext } from 'formik';

const { __ } = wp.i18n;
const permalinkStructure = wpPostsCarouselPluginData.permalinkStructure;

const PostSelectionCriteria = ( props ) => {
	const { values, touched, errors, handleChange, setFieldValue } = useFormikContext();

	const endpoints = {
		posts: '/wp-json/wp-posts-carousel/v1/admin/posts?s=',
		categories: '/wp-json/wp-posts-carousel/v1/admin/categories?s=',
		tags: '/wp-json/wp-posts-carousel/v1/admin/tags?s=',
	};

	const { classes, data, panelName, handleExpand, store } = props;

	useEffect( () => {
		let posts = [];

		if ( values[ 'posts' ] && values[ 'posts' ].length > 0 ) {
			posts = values[ 'posts' ].filter( ( option ) =>
				values[ 'post_types' ].some( ( postType ) => option.post_type === postType.value )
			);
		}

		setFieldValue( 'posts', posts );
	}, [ values[ 'post_types' ] ] );

	return (
		<>
			<Accordion defaultExpanded onChange={ handleExpand( panelName ) }>
				<AccordionSummary
					// expandIcon={  }
					aria-controls="panel1bh-content"
					id="panel1bh-header"
				>
					<Typography>{ __( 'Post selection criteria', 'wp-posts-carousel' ) }</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Box sx={ { flexGrow: 1 } }>
						<Grid container spacing={ 2 }>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_post_types', array() ) ?> */ }
							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel required htmlFor="post_types">
									{ __( 'Post types', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<CustomAutocomplete
									customProps={ {
										store: store,
									} }
									name="post_types"
									multiple
									options={ data.dictionaries.taxonomies }
									value={ values[ 'post_types' ] }
								/>
							</Grid>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_post_types', array() ) ?> */ }

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel required htmlFor="order_by">
									{ __( 'Order by', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<CustomAutocomplete
									customProps={ {
										store: store,
									} }
									name="order_by"
									options={ data.dictionaries.order_by }
									value={ values[ 'order_by' ] }
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel required htmlFor="ordering">
									{ __( 'Ordering', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<CustomAutocomplete
									customProps={ {
										store: store,
									} }
									name="ordering"
									options={ data.dictionaries.ordering }
									value={ values[ 'ordering' ] }
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel required htmlFor="all_items">
									{ __( 'Posts limit', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<FormControl variant="outlined" fullWidth>
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
							</Grid>

							<Grid item xs={ 12 }>
								<Paper sx={ { p: 1 } }>
									<Grid container spacing={ 2 }>
										<Grid item xs={ 12 } sm={ 3 }>
											<InputLabel required htmlFor="categories">
												{ __( 'Posts with Categories', 'wp-posts-carousel' ) }
											</InputLabel>
										</Grid>
										<Grid item xs={ 12 } sm={ 9 }>
											<CustomAutocomplete
												customProps={ {
													store: store,
												} }
												name="categories"
												multiple
												options={ data.dictionaries.categories ?? [] }
												value={ values[ 'categories' ] }
												onOpen={ ( searchApi ) => {
													searchApi( endpoints.categories, '', values );
												} }
												onInputChange={ ( event, newValue, values, searchApi ) => {
													searchApi( endpoints.categories, newValue, values, searchApi );
												} }
												noOptionsText={ __( 'No categories', 'wp-posts-carousel' ) }
												// groupBy={ ( option ) => {
												// 	return data.dictionaries.taxonomies.find(
												// 		( item ) => item.value === option.post_type
												// 	)?.label;
												// } }
												disabled={ ! values[ 'post_types' ] }
											/>
										</Grid>

										<Grid item xs={ 12 } sm={ 3 }>
											{/* <InputLabel required htmlFor="relation">
												{ __( 'or/and', 'wp-posts-carousel' ) }
											</InputLabel> */}
										</Grid>
										<Grid item xs={ 12 } sm={ 9 }>
											<CustomAutocomplete												
												name="relation"												
												options={ data.dictionaries.relations ?? [] }
												value={ values[ 'relation' ] }	
												disabled={ ! values[ 'post_types' ] }
											/>
										</Grid>

										<Grid item xs={ 12 } sm={ 3 }>
											<InputLabel required htmlFor="tags">
												{ __( 'Posts with Tags', 'wp-posts-carousel' ) }
											</InputLabel>
										</Grid>
										<Grid item xs={ 12 } sm={ 9 }>
											<CustomAutocomplete
												customProps={ {
													store: store,
												} }
												name="tags"
												multiple
												options={ data.dictionaries.tags ?? [] }
												value={ values[ 'tags' ] }
												onOpen={ ( searchApi ) => {
													searchApi( endpoints.tags, '', values );
												} }
												onInputChange={ ( event, newValue, values, searchApi ) => {
													searchApi( endpoints.tags, newValue, values, searchApi );
												} }
												noOptionsText={ __( 'No tags', 'wp-posts-carousel' ) }
												// groupBy={ ( option ) => {
												// 	return data.dictionaries.taxonomies.find(
												// 		( item ) => item.value === option.post_type
												// 	)?.label;
												// } }
												disabled={ ! values[ 'post_types' ] }
											/>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel required htmlFor="posts">
									{ __( 'Posts', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<CustomAutocomplete
									customProps={ {
										store: store,
									} }
									name="posts"
									multiple
									options={ data.dictionaries.posts ?? [] }
									value={ values[ 'posts' ] }
									onOpen={ ( searchApi ) => {
										searchApi( endpoints.posts, '', values );
									} }
									onInputChange={ ( event, newValue, values, searchApi ) => {
										searchApi( endpoints.posts, newValue, values, searchApi );
									} }
									noOptionsText={ __( 'No posts', 'wp-posts-carousel' ) }
									groupBy={ ( option ) => {
										return data.dictionaries.taxonomies.find(
											( item ) => item.value === option.post_type
										)?.label;
									} }
									disabled={ ! values[ 'post_types' ] }
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel required htmlFor="exclude">
									{ __( 'Exclude Posts', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<CustomAutocomplete
									customProps={ {
										store: store,
									} }
									name="exclude"
									multiple
									options={ data.dictionaries.exclude ?? [] }
									value={ values[ 'exclude' ] }
									onOpen={ ( searchApi ) => {
										searchApi( endpoints.posts, '', values );
									} }
									onInputChange={ ( event, newValue, values, searchApi ) => {
										searchApi( endpoints.posts, newValue, values, searchApi );
									} }
									noOptionsText={ __( 'No posts', 'wp-posts-carousel' ) }
									groupBy={ ( option ) => {
										return data.dictionaries.taxonomies.find(
											( item ) => item.value === option.post_type
										)?.label;
									} }
									disabled={ ! values[ 'post_types' ] }
								/>
							</Grid>
						</Grid>
					</Box>
				</AccordionDetails>
			</Accordion>
		</>
	);
};
export default observer( PostSelectionCriteria );
