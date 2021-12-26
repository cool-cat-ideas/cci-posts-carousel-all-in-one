import React from 'react';

import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OutlinedInput from '@mui/material/OutlinedInput';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const { __ } = wp.i18n;

const DisplayOptions = ( props ) => {
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
					// expandIcon={ }
					aria-controls="panel1bh-content"
					id="panel1bh-header"
				>
					<Typography className={ classes.heading }>
						{ __( 'Display options', 'wp-posts-carousel' ) }
					</Typography>
					{ /* <Typography className={ classes.secondaryHeading }>
						
					</Typography> */ }
				</AccordionSummary>
				<AccordionDetails>
					<table cellSpacing="0" cellPadding="0" className="wp-posts-carousel-table">
						<tbody>
							<tr>
								<th>{ __( 'Template', 'wp-posts-carousel' ) }</th>
								<td>
									{ /* <?php echo WP_Posts_Carousel_Templates::render_templates_list() ?> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show title', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="show_title" checked={ values.show_title } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_title]" id="show_title" <?php checked( ( bool ) $data['show_title'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show author', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="show_author" checked={ values.show_author } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_author]" id="show_author" <?php checked( ( bool ) $data['show_author'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show created date', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="show_created_date" checked={ values.show_created_date } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_created_date]" id="show_created_date" <?php checked( ( bool ) $data['show_created_date'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show description', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControl
										variant="outlined"
										className={ classes.formControl }
										fullWidth
										size="small"
									>
										<Select
											id="show_description"
											value={ values.show_description || '' }
											onChange={ handleChange }
											displayEmpty
											name="show_description"
										>
											{ data &&
												data.dictionaries.description &&
												data.dictionaries.description.map( ( item, index ) => {
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
									{ /* <select className="select wp-posts-carousel-field" name="wp_posts_carousel[show_description]" id="show_description" className="select" >
									<?php
										$description_list = WP_Posts_Carousel_Utils::get_descriptions();
										foreach( $description_list as $key => $list ) {
											echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['show_description'] ) == esc_attr( $key ) ? 'selected="selected"' : null) . '>' . esc_attr( $list ) . '</option>';
										}
									?>
									</select> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Allow shortcodes in full content', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="allow_shortcodes" checked={ values.allow_shortcodes } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[allow_shortcodes]" id="allow_shortcodes" <?php checked( ( bool ) $data['allow_shortcodes'], true ); ?>/> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show category', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="show_category" checked={ values.show_category } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_category]" id="show_category" <?php checked( ( bool ) $data['show_category'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show tags', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="show_tags" checked={ values.show_tags } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_tags]" id="show_tags" <?php checked( ( bool ) $data['show_tags'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show more button', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="show_more_button" checked={ values.show_more_button } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_more_button]" id="show_more_button" <?php checked( ( bool ) $data['show_more_button'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show featured image', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="show_featured_image" checked={ values.show_featured_image } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_featured_image]" id="show_featured_image" <?php checked( ( bool ) $data['show_featured_image'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Image source', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControl
										variant="outlined"
										className={ classes.formControl }
										fullWidth
										size="small"
									>
										<Select
											id="image_source"
											value={ values.image_source || '' }
											onChange={ handleChange }
											displayEmpty
											name="image_source"
										>
											{ data &&
												data.dictionaries.image_sourses &&
												data.dictionaries.image_sourses.map( ( item, index ) => {
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
									{ /* <select className="select wp-posts-carousel-field" name="wp_posts_carousel[image_source]" id="image_source">
									<?php
										$source_list = WP_Posts_Carousel_Utils::get_image_sources();
										foreach( $source_list as $key => $list ) {
											echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['image_source'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_attr( $list ) . '</option>';
										}
									?>
									</select> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Image width', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControl
										className={ clsx( classes.margin, classes.textField ) }
										variant="outlined"
									>
										<OutlinedInput
											id="outlined-image_width"
											name="image_width"
											value={ values.image_width }
											onChange={ handleChange( 'image_width' ) }
											aria-describedby="outlined-image_width-helper-text"
											type="number"
										/>
									</FormControl>

									<FormControl
										variant="outlined"
										className={ classes.formControl }
										style={ { marginLeft: '5px' } }
										size="small"
									>
										<Select
											id="image_width_unit"
											value={ values.image_width_unit || '' }
											onChange={ handleChange }
											displayEmpty
											name="image_width_unit"
										>
											{ data &&
												data.dictionaries.image_units &&
												data.dictionaries.image_units.map( ( item, index ) => {
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

									{ /* <input className="wp-posts-carousel-field field-validate" type="text" name="wp_posts_carousel[image_width]" id="image_width" value="<?php echo esc_attr( $data['image_width'] ); ?>" size="5" required pattern="^[0-9](\.?[0-9])*$" />
									<select className="select wp-posts-carousel-field" name="wp_posts_carousel[image_width_unit]" id="image_width_unit">
									<?php
										$unit_list = WP_Posts_Carousel_Utils::get_units();
										foreach( $unit_list as $key => $list ) {
											echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['image_width_unit'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_attr( $list ) . '</option>';
										}
									?>
									</select> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Image height', 'wp-posts-carousel' ) }</th>
								<td>
								<FormControl
										className={ clsx( classes.margin, classes.textField ) }
										variant="outlined"
									>
										<OutlinedInput
											id="outlined-image_height"
											name="image_height"
											value={ values.image_height }
											onChange={ handleChange( 'image_height' ) }
											aria-describedby="outlined-image_height-helper-text"
											type="number"
										/>
									</FormControl>

									<FormControl
										variant="outlined"
										className={ classes.formControl }
										style={ { marginLeft: '5px' } }
										size="small"
									>
										<Select
											id="image_height_unit"
											value={ values.image_height_unit || '' }
											onChange={ handleChange }
											displayEmpty
											name="image_height_unit"
										>
											{ data &&
												data.dictionaries.image_units &&
												data.dictionaries.image_units.map( ( item, index ) => {
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
									{ /* <input className="wp-posts-carousel-field field-validate" type="text" name="wp_posts_carousel[image_height]" id="image_height" value="<?php echo esc_attr( $data['image_height'] ); ?>" size="5" required pattern="^[0-9](\.?[0-9])*$" />
									<select className="select wp-posts-carousel-field" name="wp_posts_carousel[image_height_unit]" id="image_height_unit">
									<?php
										$unit_list = WP_Posts_Carousel_Utils::get_units();
										foreach( $unit_list as $key => $list ) {
											echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['image_height_unit'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_attr( $list ) . '</option>';
										}
									?>
									</select> */ }
								</td>
							</tr>

							{ /* <?php apply_filters( 'wp-posts-carousel-display-meta-box', array() ); ?> */ }
						</tbody>
					</table>
				</AccordionDetails>
			</Accordion>
		</>
	);
};
export default DisplayOptions;
