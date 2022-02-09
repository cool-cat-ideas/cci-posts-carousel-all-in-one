import React from 'react';
import { observer } from 'mobx-react';

import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Switch from '@mui/material/Switch';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';

import { CustomAutocomplete } from '../../../../components/Forms';

import { useFormikContext } from 'formik';

const { __ } = wp.i18n;

const DisplayOptions = ( props ) => {
	const { values, handleChange } = useFormikContext();

	const { data, panelName, handleExpand, store } = props;

	return (
		<>
			<Accordion defaultExpanded onChange={ handleExpand( panelName ) }>
				<AccordionSummary
					expandIcon={ <ExpandMoreIcon /> }
					aria-controls={ `${ panelName }-content` }
					id={ `${ panelName }-header` }
				>
					<Typography>{ __( 'Display options', 'wp-posts-carousel' ) }</Typography>
					{ /* <Typography className={ classes.secondaryHeading }>
						
					</Typography> */ }
				</AccordionSummary>
				<AccordionDetails>
					<Box sx={ { flexGrow: 1 } }>
						<Grid container spacing={ 2 }>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_post_types', array() ) ?> */ }
							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel required htmlFor="template">
									{ __( 'Theme', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }></Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel htmlFor="show_title">
									{ __( 'Show title', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<FormControlLabel
									label=""
									control={
										<Switch
											name={ 'show_title' }
											checked={ values[ 'show_title' ] }
											onChange={ handleChange }
											value={ true }
											inputProps={ {
												'aria-label': __( 'Show title', 'wp-posts-carousel' ),
											} }
										/>
									}
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel htmlFor="show_author">
									{ __( 'Show author', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<FormControlLabel
									label=""
									control={
										<Switch
											name={ 'show_author' }
											checked={ values[ 'show_author' ] }
											onChange={ handleChange }
											value={ true }
											inputProps={ {
												'aria-label': __( 'Show author', 'wp-posts-carousel' ),
											} }
										/>
									}
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel htmlFor="show_created_date">
									{ __( 'Show created date', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<FormControlLabel
									label=""
									control={
										<Switch
											name={ 'show_created_date' }
											checked={ values[ 'show_created_date' ] }
											onChange={ handleChange }
											value={ true }
											inputProps={ {
												'aria-label': __( 'Show created date', 'wp-posts-carousel' ),
											} }
										/>
									}
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel required htmlFor="show_description">
									{ __( 'Show description', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<CustomAutocomplete
									name="show_description"
									options={ data.dictionaries.description }
									value={ values[ 'show_description' ] }
								/>
							</Grid>

							{ values[ 'show_description' ].value === 'content' && (
								<>
									<Grid item xs={ 12 } sm={ 3 }>
										<InputLabel htmlFor="allow_shortcodes">
											{ __( 'Allow shortcodes in full content', 'wp-posts-carousel' ) }
										</InputLabel>
									</Grid>
									<Grid item xs={ 12 } sm={ 9 }>
										<FormControlLabel
											label=""
											control={
												<Switch
													name={ 'allow_shortcodes' }
													checked={ values[ 'allow_shortcodes' ] }
													onChange={ handleChange }
													value={ true }
													inputProps={ {
														'aria-label': __(
															'Allow shortcodes in full content',
															'wp-posts-carousel'
														),
													} }
												/>
											}
										/>
									</Grid>
								</>
							) }

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel htmlFor="show_category">
									{ __( 'Show category', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<FormControlLabel
									label=""
									control={
										<Switch
											name={ 'show_category' }
											checked={ values[ 'show_category' ] }
											onChange={ handleChange }
											value={ true }
											inputProps={ {
												'aria-label': __( 'Show category', 'wp-posts-carousel' ),
											} }
										/>
									}
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel htmlFor="show_tags">
									{ __( 'Show tags', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<FormControlLabel
									label=""
									control={
										<Switch
											name={ 'show_tags' }
											checked={ values[ 'show_tags' ] }
											onChange={ handleChange }
											inputProps={ {
												'aria-label': __( 'Show tags', 'wp-posts-carousel' ),
											} }
										/>
									}
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel htmlFor="show_more_button">
									{ __( 'Show more button', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<FormControlLabel
									label=""
									control={
										<Switch
											name={ 'show_more_button' }
											checked={ values[ 'show_more_button' ] }
											onChange={ handleChange }
											value={ true }
											inputProps={ {
												'aria-label': __( 'Show more button', 'wp-posts-carousel' ),
											} }
										/>
									}
								/>
							</Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								<InputLabel htmlFor="show_featured_image">
									{ __( 'Show featured image', 'wp-posts-carousel' ) }
								</InputLabel>
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								<FormControlLabel
									label=""
									control={
										<Switch
											name={ 'show_featured_image' }
											checked={ values[ 'show_featured_image' ] }
											onChange={ handleChange }
											value={ true }
											inputProps={ {
												'aria-label': __(
													'Show featured image',
													'wp-posts-carousel'
												),
											} }
										/>
									}
								/>
							</Grid>

							{ values[ 'show_featured_image' ] && (
								<>
									<Grid item xs={ 12 } sm={ 3 }>
										<InputLabel htmlFor="image_source">
											{ __( 'Image source', 'wp-posts-carousel' ) }
										</InputLabel>
									</Grid>
									<Grid item xs={ 12 } sm={ 9 }>
										<CustomAutocomplete
											name="image_source"
											options={ data.dictionaries.image_sources }
											value={ values[ 'image_source' ] }
										/>
									</Grid>

									<Grid item xs={ 12 } sm={ 3 }>
										<InputLabel htmlFor="image_width">
											{ __( 'Image width', 'wp-posts-carousel' ) }
										</InputLabel>
									</Grid>
									<Grid item xs={ 12 } sm={ 9 }>
										<FormControl variant="outlined">
											<OutlinedInput
												id="image_width"
												name="image_width"
												value={ values[ 'image_width' ] }
												onChange={ handleChange( 'image_width' ) }
												aria-describedby="outlined-image_width-helper-text"
												type="number"
											/>
										</FormControl>

										<CustomAutocomplete
											name="image_width_unit"
											fullWidth={ false }
											options={ data.dictionaries.image_units }
											value={ values[ 'image_width_unit' ] }
											sx={ { width: '70px', display: 'inline-flex', ml: 1 } }
										/>
									</Grid>

									<Grid item xs={ 12 } sm={ 3 }>
										<InputLabel htmlFor="image_height">
											{ __( 'Image height', 'wp-posts-carousel' ) }
										</InputLabel>
									</Grid>
									<Grid item xs={ 12 } sm={ 9 }>
										<FormControl variant="outlined">
											<OutlinedInput
												id="image_height"
												name="image_height"
												value={ values[ 'image_height' ] }
												onChange={ handleChange( 'image_height' ) }
												aria-describedby="outlined-image_height-helper-text"
												type="number"
											/>
										</FormControl>

										<CustomAutocomplete
											name="image_height_unit"
											fullWidth={ false }
											options={ data.dictionaries.image_units }
											value={ values[ 'image_height_unit' ] }
											sx={ { width: '70px', display: 'inline-flex', ml: 1 } }
										/>
									</Grid>									
								</>
							) }
						</Grid>
					</Box>
				</AccordionDetails>
			</Accordion>
		</>
	);
};
export default observer( DisplayOptions );

// { __( 'Image width', 'wp-posts-carousel' ) }

// 		<FormControl
// 			className={ clsx( classes.margin, classes.textField ) }
// 			variant="outlined"
// 		>
// 			<OutlinedInput
// 				id="outlined-image_width"
// 				name="image_width"
// 				value={ values.image_width }
// 				onChange={ handleChange( 'image_width' ) }
// 				aria-describedby="outlined-image_width-helper-text"
// 				type="number"
// 			/>
// 		</FormControl>

// 		<FormControl
// 			variant="outlined"
// 			className={ classes.formControl }
// 			style={ { marginLeft: '5px' } }
// 			size="small"
// 		>
// 			<Select
// 				id="image_width_unit"
// 				value={ values.image_width_unit || '' }
// 				onChange={ handleChange }
// 				displayEmpty
// 				name="image_width_unit"
// 			>
// 				{ data &&
// 					data.dictionaries.image_units &&
// 					data.dictionaries.image_units.map( ( item, index ) => {
// 						return (
// 							<MenuItem
// 								value={ item.id }
// 								key={ `order_by${ index }` }
// 							>
// 								{ item.name }
// 							</MenuItem>
// 						);
// 					} ) }
// 			</Select>
// 		</FormControl>

// { __( 'Image height', 'wp-posts-carousel' ) }

// <FormControl
// 		className={ clsx( classes.margin, classes.textField ) }
// 		variant="outlined"
// 	>
// 		<OutlinedInput
// 			id="outlined-image_height"
// 			name="image_height"
// 			value={ values.image_height }
// 			onChange={ handleChange( 'image_height' ) }
// 			aria-describedby="outlined-image_height-helper-text"
// 			type="number"
// 		/>
// 	</FormControl>

// 	<FormControl
// 		variant="outlined"
// 		className={ classes.formControl }
// 		style={ { marginLeft: '5px' } }
// 		size="small"
// 	>
// 		<Select
// 			id="image_height_unit"
// 			value={ values.image_height_unit || '' }
// 			onChange={ handleChange }
// 			displayEmpty
// 			name="image_height_unit"
// 		>
// 			{ data &&
// 				data.dictionaries.image_units &&
// 				data.dictionaries.image_units.map( ( item, index ) => {
// 					return (
// 						<MenuItem
// 							value={ item.id }
// 							key={ `order_by${ index }` }
// 						>
// 							{ item.name }
// 						</MenuItem>
// 					);
// 				} ) }
// 		</Select>
// 	</FormControl>
