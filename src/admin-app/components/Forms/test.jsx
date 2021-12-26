import React from 'react';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { CustomAutocomplete } from '../../../../components/Forms';

import { myFormDefaultValue } from './../../../../components/myForm';

import MyTooltip from './../../../../components/Tooltip';

const { __ } = wp.i18n;
const permalinkStructure = wpPostsCarouselPluginData.permalinkStructure;

const PostSelectionCriteria = ( props ) => {
	const [ search, setSearch ] = useState( '' );

	useEffect( () => {
		let active = true;
		let url = null;
		setLoading( true );

		switch ( state.field ) {
			case 'posts':
			case 'exclude':
				url = 'http://teastudio.test/wp-json/wp/v2/posts?_fields=id,title&title=' + search;
				break;
			case 'categories':
				url =
					'http://teastudio.test/wp-json/wp/v2/categories?_fields=id,name,taxonomy&name=' +
					search +
					'&taxonomy';
				break;
			case 'tags':
				url = 'http://teastudio.test/wp-json/wp/v2/tags?search=' + search;
				break;
		}

		// TODO sprawdzenie permalinkStructure != '', najlepiej w osobnej funkcji https://developer.wordpress.org/rest-api/key-concepts/
		if ( url ) {
			( async () => {
				const response = await fetch( url );
				const data = await response.json();

				if ( active && data ) {
					let fieldOptions = [];
					options[ state.field ] = data;
					setOptions( options );
					setSearch( '' );
					setLoading( false );
				}
			} )();
		} else {
			setSearch( '' );
			setState( { open: false, field: null } );
			setLoading( false );
		}

		return () => {
			active = false;
		};
	}, [ state.open, state.field, search ] );

	const {
		classes,
		data,
		values,
		touched,
		errors,
		isSubmitting,
		handleChange,
		handleBlur,
		handleSubmit,

		setFieldValue,
		panelName,
		expanded,
		handleExpand,
	} = props;

	return (
		<>
			<Accordion defaultExpanded onChange={ handleExpand( panelName ) }>
				<AccordionSummary
					expandIcon={ <ExpandMoreIcon /> }
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
									{/* <Autocomplete
										name="post_types"
										multiple
										size="small"
										filterSelectedOptions
										fullWidth
										onOpen={ () => {
											setState( { open: true, field: 'post_types' } );
										} }
										onChange={ ( e, value ) => {
											setFieldValue(
												'post_types',
												value.map( ( item ) => item.id ) ?? null
											);
										} }
										onClose={ () => {
											setState( { open: false, field: null } );
										} }
										value={
											values.post_types && data && data.dictionaries
												? data.dictionaries.taxonomies.filter( ( item ) =>
														values.post_types.includes( item.id )
												  )
												: ''
										}
										options={
											data && data.dictionaries ? data.dictionaries.taxonomies : []
										}
										getOptionLabel={ ( option ) => option.name }
										getOptionSelected={ ( option, value ) => option.id === value.id }
										noOptionsText={ __( 'No taxonomies', 'wp-posts-carousel' ) }
										className={ clsx( classes.margin, classes.textField ) }
										loading={ loading }
										required
										renderInput={ ( params ) => (
											<TextField
												{ ...params }
												helperText={ touched.post_types ? errors.post_types : '' }
												error={ touched.post_types && Boolean( errors.post_types ) }
												label=""
												variant="outlined"
												InputProps={ {
													...params.InputProps,
													endAdornment: (
														<>
															{ loading && state.field === 'post_types' ? (
																<CircularProgress
																	color="inherit"
																	size={ 20 }
																/>
															) : null }
															{ params.InputProps.endAdornment }
														</>
													),
													autoComplete: 'post_types',
												} }
												fullWidth
												required
											/>
										) }
									/> */}
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
													<FormControl
														variant="outlined"
														className={ classes.formControl }
														fullWidth
														size="small"
														error={
															touched.order_by && Boolean( errors.order_by )
														}
													>
														<Select
															id="order_by"
															name="order_by"
															value={ data && values ? values.order_by : '' }
															onChange={ handleChange }
															displayEmpty
															required
														>
															{ data &&
																data.dictionaries.order_by &&
																data.dictionaries.order_by.map(
																	( item, index ) => {
																		return (
																			<MenuItem
																				value={ item.id }
																				key={ `order_by${ index }` }
																			>
																				{ item.name }
																			</MenuItem>
																		);
																	}
																) }
														</Select>
														{ touched.order_by && Boolean( errors.order_by ) && (
															<FormHelperText>
																{ errors.order_by }
															</FormHelperText>
														) }
													</FormControl>
												</td>
											</tr>
											<tr>
												<th>{ __( 'Posts', 'wp-posts-carousel' ) }</th>
												<td>
													<CustomAutocomplete
														name="posts"
														multiple
														size="small"
														fullWidth
														onOpen={ () => {
															setState( { open: true, field: 'posts' } );
														} }
														onInputChange={ ( event, newValue ) => {
															setSearch( newValue );
														} }
														onChange={ ( e, values ) => {
															setFieldValue( 'posts', values );
														} }
														onClose={ () => {
															setState( { open: false, field: null } );
														} }
														value={ values.posts }
														options={
															options[ 'posts' ] ? options[ 'posts' ] : []
														}
														filterSelectedOptions
														filterOptions={ createFilterOptions( {
															matchFrom: 'start',
															stringify: ( option ) => option.title.rendered,
														} ) }
														getOptionLabel={ ( option ) =>
															option && option.title
																? option.title.rendered
																: null
														}
														getOptionSelected={ ( option, value ) =>
															option.id === value.id
														}
														noOptionsText={ __(
															'No posts',
															'wp-posts-carousel'
														) }
														className={ clsx(
															classes.margin,
															classes.textField
														) }
														loading={ loading }
														renderInput={ ( params ) => (
															<TextField
																{ ...params }
																label=""
																variant="outlined"
																InputProps={ {
																	...params.InputProps,
																	endAdornment: (
																		<>
																			{ loading &&
																			state.field === 'posts' ? (
																				<CircularProgress
																					color="inherit"
																					size={ 20 }
																				/>
																			) : null }
																			{ params.InputProps.endAdornment }
																		</>
																	),
																	autoComplete: 'posts',
																} }
																fullWidth
															/>
														) }
													/>
												</td>
											</tr>
											<tr>
												<th>{ __( 'Exclude Posts', 'wp-posts-carousel' ) }</th>
												<td>
													{/* <Autocomplete
														name="exclude"
														multiple
														size="small"
														filterSelectedOptions
														fullWidth
														onOpen={ () => {
															setState( { open: true, field: 'exclude' } );
														} }
														onInputChange={ ( event, newValue ) => {
															setSearch( newValue );
														} }
														onChange={ ( e, values ) => {
															setFieldValue( 'exclude', values );
														} }
														onClose={ () => {
															setState( { open: false, field: null } );
														} }
														value={
															values.exclude.length > 0
																? values.exclude.map( ( value ) => {
																		return {
																			id: value.id,
																			title: {
																				rendered:
																					value.title.rendered,
																			},
																		};
																  } )
																: []
														}
														options={
															options[ 'exclude' ] ? options[ 'exclude' ] : []
														}
														getOptionLabel={ ( option ) =>
															option && option.title
																? option.title.rendered
																: null
														}
														getOptionSelected={ ( option, value ) =>
															option.id === value.id
														}
														noOptionsText={ __(
															'No posts',
															'wp-posts-carousel'
														) }
														className={ clsx(
															classes.margin,
															classes.textField
														) }
														loading={ loading }
														renderInput={ ( params ) => (
															<TextField
																{ ...params }
																label=""
																variant="outlined"
																InputProps={ {
																	...params.InputProps,
																	endAdornment: (
																		<>
																			{ loading &&
																			state.field === 'exclude' ? (
																				<CircularProgress
																					color="inherit"
																					size={ 20 }
																				/>
																			) : null }
																			{ params.InputProps.endAdornment }
																		</>
																	),
																	autoComplete: 'exclude',
																} }
																fullWidth
															/>
														) }
													/> */}
												</td>
											</tr>
											<tr>
												<th>
													{ __( 'Posts with Categories', 'wp-posts-carousel' ) }
												</th>
												<td>
													{/* <Autocomplete
														name="categories"
														multiple
														size="small"
														filterSelectedOptions
														fullWidth
														open={ state.open && state.field == 'categories' }
														onOpen={ () => {
															setState( { open: true, field: 'categories' } );
														} }
														onInputChange={ ( event, newValue ) => {
															setSearch( newValue );
														} }
														onChange={ ( e, values ) => {
															let newValues = [];
															values.map( ( value ) =>
																newValues.push( value )
															);
															if ( values.length === newValues.length ) {
																setFieldValue( 'categories', newValues );
															}
														} }
														onClose={ () => {
															setState( { open: false, field: null } );
														} }
														value={
															values.categories.length > 0
																? values.categories.map( ( value ) => {
																		return {
																			id: value.id,
																			name: value.name,
																		};
																  } )
																: []
														}
														options={
															options[ 'categories' ]
																? options[ 'categories' ]
																: []
														}
														getOptionLabel={ ( option ) => option.name ?? null }
														getOptionSelected={ ( option, value ) =>
															option.id === value.id
														}
														noOptionsText={ __(
															'No categories',
															'wp-posts-carousel'
														) }
														className={ clsx(
															classes.margin,
															classes.textField
														) }
														loading={ loading }
														renderInput={ ( params ) => (
															<TextField
																{ ...params }
																label=""
																variant="outlined"
																InputProps={ {
																	...params.InputProps,
																	endAdornment: (
																		<>
																			{ loading &&
																			state.field === 'categories' ? (
																				<CircularProgress
																					color="inherit"
																					size={ 20 }
																				/>
																			) : null }
																			{ params.InputProps.endAdornment }
																		</>
																	),
																	autoComplete: 'categories',
																} }
																fullWidth
															/>
														) }
													/> */}
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
																				value={ item.id }
																				key={ `relation-${ index }` }
																			>
																				{ item.name }
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
													{/* <Autocomplete
														name="tags"
														multiple
														size="small"
														filterSelectedOptions
														fullWidth
														open={ state.open && state.field == 'tags' }
														onOpen={ () => {
															setState( { open: true, field: 'tags' } );
														} }
														onInputChange={ ( event, newValue ) => {
															setSearch( newValue );
														} }
														onChange={ ( e, values ) => {
															let newValues = [];
															values.map( ( value ) =>
																newValues.push( value )
															);
															if ( values.length === newValues.length ) {
																setFieldValue( 'tags', newValues );
															}
														} }
														onClose={ () => {
															setState( { open: false, field: null } );
														} }
														value={
															values.tags.length > 0
																? values.tags.map( ( value ) => {
																		return {
																			id: value.id,
																			name: value.name,
																		};
																  } )
																: []
														}
														options={ options[ 'tags' ] ? options[ 'tags' ] : [] }
														getOptionLabel={ ( option ) => option.name ?? null }
														getOptionSelected={ ( option, value ) =>
															option.id === value.id
														}
														noOptionsText={ __( 'No tags', 'wp-posts-carousel' ) }
														className={ clsx(
															classes.margin,
															classes.textField
														) }
														loading={ loading }
														renderInput={ ( params ) => (
															<TextField
																{ ...params }
																label=""
																variant="outlined"
																InputProps={ {
																	...params.InputProps,
																	endAdornment: (
																		<>
																			{ loading &&
																			state.field === 'tags' ? (
																				<CircularProgress
																					color="inherit"
																					size={ 20 }
																				/>
																			) : null }
																			{ params.InputProps.endAdornment }
																		</>
																	),
																	autoComplete: 'tags',
																} }
																fullWidth
															/>
														) }
													/> */}
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
															value={ item.id }
															key={ `ordering${ index }` }
														>
															{ item.name }
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
export default PostSelectionCriteria;
