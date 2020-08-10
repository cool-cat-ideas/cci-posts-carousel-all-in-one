import React from 'react';
import { useEffect, useState } from 'react';

import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const { __ } = wp.i18n;
const permalinkStructure = pluginData.permalinkStructure;

const PostSelectionCriteria = ( props ) => {
	const [ state, setState ] = useState( {
		open: false,
		filed: null,
	} );
	const [ options, setOptions ] = useState( [] );
	const [ search, setSearch ] = useState( '' );
	const loading = open && ( options.length === 0 || search !== '' );

	useEffect( () => {
		let active = true;

		if ( ! loading ) {
			return undefined;
		}

		( async () => {
			// TODO sprawdzenie permalinkStructure != '', najlepiej w osobnej funkcji https://developer.wordpress.org/rest-api/key-concepts/
			const response = await fetch(
				'http://teastudio.test/wp-json/wp/v2/posts?_fields=id,title&title=' + search
			);

			const posts = await response.json();

			if ( active && posts ) {
				setOptions( posts );
				setSearch( '' );
			}
		} )();

		return () => {
			active = false;
		};
	}, [ loading, open, search ] );

	// useEffect( () => {
	// 	if ( ! open ) {
	// 	//	setOptions( [] );
	// 	}
	// }, [ open, search ] );

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
		handleReset,

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
					{ /* <Typography className={ classes.secondaryHeading }>
						
					</Typography> */ }
				</AccordionSummary>
				<AccordionDetails>
					<table cellSpacing="0" cellPadding="0" className="wp-posts-carousel-table">
						<tbody>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_post_types', array() ) ?> */ }
							<tr>
								<th>
									{ __( 'Post types', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'You can select multiple post types.', 'wp-posts-carousel' ) ); ?> */ }
								</th>
								<td>
									<Autocomplete
										multiple
										size="small"
										filterSelectedOptions
										fullWidth
										open={ state.open && state.field == 'post_types' }
										onOpen={ () => {
											setState( { open: true, field: 'post_types' } );
										} }
										onInputChange={ ( event, newValue ) => {
											setSearch( newValue );
										} }
										onClose={ () => {
											setState( { open: false, field: null } );
										} }
										options={
											data && data.dictionaries.taxonomies
												? data.dictionaries.taxonomies
												: []
										}
										noOptionsText={ __( 'No posts', 'wp-posts-carousel' ) }
										// getOptionSelected={ ( option, value ) => String( option.id ) === values.id }
										getOptionLabel={ ( option ) => option.name }
										className={ clsx( classes.margin, classes.textField ) }
										loading={ loading }
										renderInput={ ( params ) => (
											<TextField
												{ ...params }
												label=""
												variant="outlined"
												InputProps={ {
													...params.InputProps,
													endAdornment: (
														<React.Fragment>
															{ loading ? (
																<CircularProgress
																	color="inherit"
																	size={ 20 }
																/>
															) : null }
															{ params.InputProps.endAdornment }
														</React.Fragment>
													),
													autoComplete: 'new-password', // disable autocomplete and autofill
												} }
												fullWidth
											/>
										) }
									/>
									{ /* <select class="select wp-posts-carousel-field" name="wp_posts_carousel[post_types][]" id="post_types" multiple="multiple" size="4" required>
                <?php
                    $taxonomies = WP_Posts_Carousel_Utils::get_taxonomies();
                    foreach( $taxonomies as $key => $type ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( ( is_array( $data['post_types'] ) && in_array( esc_attr( $key ), $data['post_types'] ) ) ? 'selected="selected"' : null ) . '>' . esc_attr( $type->label ) . '</option>';
                    }
                ?>
                </select> */ }
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
													>
														<Select
															id="order_by"
															value={ values.order_by }
															onChange={ handleChange }
															displayEmpty
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
													</FormControl>
												</td>
											</tr>
											<tr>
												<th>
													{ __( 'Show Posts with IDs', 'wp-posts-carousel' ) }
													{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Please enter Post IDs with comma seperated.', 'wp-posts-carousel' ) ); ?> */ }
												</th>
												<td>
													<Autocomplete
														multiple
														size="small"
														filterSelectedOptions
														fullWidth
														open={ state.open && state.field == 'posts_id' }
														onOpen={ () => {
															setState( { open: true, field: 'posts_id' } );
														} }
														onInputChange={ ( event, newValue ) => {
															setSearch( newValue );
														} }
														onClose={ () => {
															setState( { open: false, field: null } );
														} }
														options={ options }
														noOptionsText={ __(
															'No posts',
															'wp-posts-carousel'
														) }
														//getOptionSelected={ ( option, value ) => String( option.id ) === values.id }
														getOptionLabel={ ( option ) => option.title.rendered }
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
																		<React.Fragment>
																			{ loading ? (
																				<CircularProgress
																					color="inherit"
																					size={ 20 }
																				/>
																			) : null }
																			{ params.InputProps.endAdornment }
																		</React.Fragment>
																	),
																	autoComplete: 'new-password', // disable autocomplete and autofill
																} }
																fullWidth
															/>
														) }
													/>
													{ /* <textarea class="widefat wp-posts-carousel-field field-validate" name="wp_posts_carousel[posts]" id="posts" pattern="^[1-9](0*)(,?[1-9](0*))*$"><?php echo esc_html( $data['posts'] ); ?></textarea> */ }
												</td>
											</tr>
											<tr>
												<th>
													{ __( 'Exclude Posts with IDs', 'wp-posts-carousel' ) }
													{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Please enter Post IDs with comma seperated.', 'wp-posts-carousel' ) ); ?> */ }
												</th>
												<td>
													{ /* <textarea class="widefat wp-posts-carousel-field field-validate" name="wp_posts_carousel[exclude]" id="exclude" pattern="^[1-9](0*)(,?[1-9](0*))*$"><?php echo esc_html( $data['exclude'] ); ?></textarea> */ }
												</td>
											</tr>
											<tr>
												<th>
													{ __( 'Posts with Category IDs', 'wp-posts-carousel' ) }
													{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Please enter Category IDs with comma seperated.', 'wp-posts-carousel' ) ); ?> */ }
												</th>
												<td>
													{ /* <textarea class="widefat wp-posts-carousel-field field-validate" name="wp_posts_carousel[categories]" id="categories" pattern="^[1-9](0*)(,?[1-9](0*))*$"><?php echo esc_html( $data['categories'] ); ?></textarea> */ }
												</td>
											</tr>
											<tr>
												<th></th>
												<td>
													{ /* <select class="select wp-posts-carousel-field" name="wp_posts_carousel[relation]" id="relation">
                                <?php
                                    $relation_list = WP_Posts_Carousel_Utils::get_relations();
                                    foreach( $relation_list as $key => $list ) {
                                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['relation'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) .'>'. esc_html( $list ) .'</option>';
                                    }
                                ?>
                                </select> */ }
												</td>
											</tr>
											<tr>
												<th>
													{ __( 'Posts with Tag names', 'wp-posts-carousel' ) }
													{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Please enter Tag names with comma seperated.', 'wp-posts-carousel' ) ); ?> */ }
												</th>
												<td>
													{ /* <textarea class="widefat wp-posts-carousel-field field-validate" name="wp_posts_carousel[tags]" id="tags" pattern="^[a-zA-z0-9](,?[a-zA-Z0-9])*$"><?php echo esc_html( $data['tags'] ); ?></textarea> */ }
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
								<th>{ __( 'Posts limit', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControl
										className={ clsx( classes.margin, classes.textField ) }
										variant="outlined"
										fullWidth
									>
										<OutlinedInput
											id="outlined-all_items"
											value={ values.all_items }
											onChange={ handleChange( 'all_items' ) }
											aria-describedby="outlined-all_items-helper-text"
											type="number"
										/>
									</FormControl>
									{ /* <input class="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[all_items]" id="all_items" value="<?php echo esc_attr( $data['all_items'] ); ?>" size="5" required min="1" pattern="^\d+$" /> */ }
								</td>
							</tr>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_posts_limit', array() ) ?> */ }
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_ordering', array() ) ?> */ }
							<tr>
								<th>
									<label htmlFor="ordering">
										{ __( 'Ordering', 'wp-posts-carousel' ) }
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
											value={ values.ordering }
											onChange={ handleChange }
											displayEmpty
										>
											{ data &&
												data.dictionaries.ordering &&
												data.dictionaries.ordering.map( ( item, index ) => {
													return (
														<MenuItem
															value={ item.id }
															key={ `order_by${ index }` }
														>
															{ item.name }
														</MenuItem>
													);
												} ) }
										</Select>
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
