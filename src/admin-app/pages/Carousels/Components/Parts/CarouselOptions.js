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
import InputAdornment from '@mui/material/InputAdornment';

import { CustomAutocomplete } from '../../../../components/Forms';

import { useFormikContext } from 'formik';

const { __ } = wp.i18n;

const CarouselOptions = ( props ) => {
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
					<Typography>{ __( 'Carousel options', 'wp-posts-carousel' ) }</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Box sx={ { flexGrow: 1 } }>
						<Grid container spacing={ 2 }>
							{ /* <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_post_types', array() ) ?> */ }
							<Grid item xs={ 12 } sm={ 3 }>
								{/* <InputLabel required htmlFor="template">
									{ __( 'Theme', 'wp-posts-carousel' ) }
								</InputLabel> */}
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }></Grid>

							<Grid item xs={ 12 } sm={ 3 }>
								{/* <InputLabel htmlFor="show_title">
									{ __( 'Show title', 'wp-posts-carousel' ) }
								</InputLabel> */}
							</Grid>
							<Grid item xs={ 12 } sm={ 9 }>
								{/* <FormControlLabel
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
								/> */}
							</Grid>
						</Grid>
					</Box>

					<table cellSpacing="0" cellPadding="0" className="wp-posts-carousel-table">
						<tbody>
							<tr>
								<th>
									{ __( 'Items to show on different devices', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( sprintf( __( 'If you need you can create more breakpoints. See <a href="%s" target="_blank" title="See how to create custom breakpoints">FAQ</a>', 'wp-posts-carousel' ), 'http://www.teastudio.pl/en/' ) ); ?> */ }
								</th>
								<td className="wp-posts-carousel-table-col">
									<table
										cellSpacing="0"
										cellPadding="0"
										className="wp-posts-carousel-rwd-table"
									>
										<tbody>
											{ data &&
											data.default_values.items_to_show &&
											data.dictionaries.breakpoints ? (
												Object.keys( data.dictionaries.breakpoints ).map(
													( device, index ) => {
														return (
															<tr key={ `device-${ device }` }>
																<th
																	className={ `wp-posts-carousel-rwd-table-device wp-posts-carousel-rwd-table-device-${ device }` }
																>
																	<i className={ `fa fa-${ device }` }></i>
																</th>
																<td>
																	<table cellSpacing="0" cellPadding="0">
																		<tbody>
																			{ Object.entries(
																				data.dictionaries.breakpoints[
																					device
																				]
																			).map(
																				( deviceDetails, index ) => {
																					return (
																						<tr
																							key={ `deviceWidth-${ deviceDetails[ 0 ] }` }
																						>
																							<th>
																								{
																									deviceDetails[ 0 ]
																								}
																								px
																							</th>
																							<td>
																								<FormControl																									
																									variant="outlined"
																								>
																									<OutlinedInput
																										id={ `outlined-items_to_show_${ deviceDetails[ 0 ] }` }
																										name={ `items_to_show[${ deviceDetails[ 0 ] }]` }
																										value={
																											values
																												.items_to_show[
																												deviceDetails[ 0 ]
																											]
																										}
																										onChange={
																											handleChange
																										}
																										aria-describedby="outlined-items_to_show-helper-text"
																										type="number"
																										endAdornment={
																											<InputAdornment position="end">
																												{ __(
																													'items',
																													'wp-posts-carousel'
																												) }
																											</InputAdornment>
																										}
																										inputProps={ {
																											min: 1,
																										} }
																									/>
																								</FormControl>
																							</td>
																						</tr>
																					);
																				}
																			) }
																		</tbody>
																	</table>
																</td>
															</tr>
														);
													}
												)
											) : (
												<tr>
													<td>
														<div className="wp-posts-carousel-message wp-posts-carousel-message-eror">
															<p>
																{ __(
																	'Ups, make sure that you defined correctly breakpints in your filter "wp_posts_carousel_breakpoints".',
																	'wp-posts-carousel'
																) }
															</p>
														</div>
													</td>
												</tr>
											) }
										</tbody>
									</table>
								</td>
							</tr>
							<tr>
								<th>
									{ __( 'Slide by', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Number of items to slide.', 'wp-posts-carousel' ) ); ?> */ }
								</th>
								<td>
									<FormControl
										variant="outlined"
									>
										<OutlinedInput
											id="outlined-slide_by"
											name="slide_by"
											value={ values.slide_by }
											onChange={ handleChange }
											aria-describedby="outlined-slide_by-helper-text"
											type="number"
											endAdornment={
												<InputAdornment position="end">
													{ __( 'items', 'wp-posts-carousel' ) }
												</InputAdornment>
											}
											inputProps={ { min: 1 } }
										/>
									</FormControl>
									{ /* <input className="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[slide_by]" id="slide_by" value="<?php echo esc_attr( $data['slide_by'] ); ?>" size="5" min="1" required pattern="^\d+$" />[<?php _e( 'items', 'wp-posts-carousel' ); ?>] */ }
								</td>
							</tr>
							<tr>
								<th>
									{ __( 'RTL', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Change direction from Right to Left.', 'wp-posts-carousel' ) ); ?> */ }
								</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="rtl"
												checked={ values.rtl }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[rtl]" id="rtl" <?php checked( ( bool ) $data['rtl'], false ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>
									{ __( 'Stage padding', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Padding left and right on stage (can see prev and next posts).', 'wp-posts-carousel' ) ); ?> */ }
								</th>
								<td>
									<FormControl
										variant="outlined"
									>
										<OutlinedInput
											id="outlined-stage_padding"
											name="stage_padding"
											value={ values.stage_padding }
											onChange={ handleChange }
											aria-describedby="outlined-stage_padding-helper-text"
											type="number"
											endAdornment={
												<InputAdornment position="end">px</InputAdornment>
											}
											inputProps={ { min: 1 } }
										/>
									</FormControl>
									{ /* <input className="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[stage_padding]" id="stage_padding" value="<?php echo esc_attr( $data['stage_padding'] ); ?>" size="5" min="0" required pattern="^\d+$" />[px] */ }
								</td>
							</tr>
							<tr>
								<th>
									{ __( 'Margin', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Margin between items.', 'wp-posts-carousel' ) ); ?> */ }
								</th>
								<td>
									<FormControl
										variant="outlined"
									>
										<OutlinedInput
											id="outlined-margin"
											name="margin"
											value={ values.stage_padding }
											onChange={ handleChange }
											aria-describedby="outlined-margin-helper-text"
											type="number"
											endAdornment={
												<InputAdornment position="end">px</InputAdornment>
											}
										/>
									</FormControl>
									{ /* <input className="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[margin]" id="margin" value="<?php echo esc_attr( $data['margin'] ); ?>" size="5" min="0" required pattern="^\d+$" />[px] */ }
								</td>
							</tr>
							<tr>
								<th>
									{ __( 'Inifnity loop', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Duplicate last and first items to get loop illusion.', 'wp-posts-carousel' ) ); ?> */ }
								</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="loop"
												checked={ values.loop }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[loop]" id="loop" <?php checked( ( bool ) $data['loop'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Pause on mouse hover', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="stop_on_hover"
												checked={ values.stop_on_hover }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[stop_on_hover]" id="stop_on_hover" <?php checked( ( bool ) $data['stop_on_hover'], true ); ?> /> */ }
								</td>
							</tr>

							<tr>
								<th>{ __( 'Auto play', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="auto_play"
												checked={ values.auto_play }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[auto_play]" id="auto_play" <?php checked( ( bool ) $data['auto_play'], true ); ?> /> */ }
								</td>
							</tr>
							{ values.auto_play && (
								<tr>
									<th>{ __( 'Autoplay interval timeout', 'wp-posts-carousel' ) }</th>
									<td>
										<FormControl
											variant="outlined"
										>
											<OutlinedInput
												id="outlined-auto_play_timeout"
												name="auto_play_timeout"
												value={ values.auto_play_timeout }
												onChange={ handleChange }
												aria-describedby="outlined-auto_play_timeout-helper-text"
												type="number"
												endAdornment={
													<InputAdornment position="end">ms</InputAdornment>
												}
												inputProps={ { min: 1 } }
											/>
										</FormControl>
										{ /* <input className="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[auto_play_timeout]" id="auto_play_timeout" value="<?php echo esc_attr( $data['auto_play_timeout'] ); ?>" size="5" min="1" required pattern="^\d+$" />[ms] */ }
									</td>
								</tr>
							) }

							<tr>
								<th>{ __( 'Show "next" and "prev" buttons', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="nav"
												checked={ values.nav }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[nav]" id="nav" <?php checked( ( bool ) $data['nav'], true ); ?> /> */ }
								</td>
							</tr>
							{ values.nav && (
								<tr>
									<th>{ __( 'Navigation speed', 'wp-posts-carousel' ) }</th>
									<td>
										<FormControl
											variant="outlined"
										>
											<OutlinedInput
												id="outlined-nav_speed"
												name="nav_speed"
												value={ values.nav_speed }
												onChange={ handleChange }
												aria-describedby="outlined-nav_speed-helper-text"
												type="number"
												endAdornment={
													<InputAdornment position="end">ms</InputAdornment>
												}
												inputProps={ { min: 1 } }
											/>
										</FormControl>
										{ /* <input className="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[nav_speed]" id="nav_speed" value="<?php echo esc_attr( $data['nav_speed'] ); ?>" size="5" min="1" required pattern="^\d+$" />[ms] */ }
									</td>
								</tr>
							) }

							<tr>
								<th>{ __( 'Show dots navigation', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="dots"
												checked={ values.dots }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[dots]" id="dots" <?php checked( ( bool ) $data['dots'], true ); ?> /> */ }
								</td>
							</tr>
							{ values.dots && (
								<tr>
									<th>{ __( 'Dots speed', 'wp-posts-carousel' ) }</th>
									<td>
										<FormControl
											variant="outlined"
										>
											<OutlinedInput
												id="outlined-dots_speed"
												name="dots_speed"
												value={ values.dots_speed }
												onChange={ handleChange }
												aria-describedby="outlined-dots_speed-helper-text"
												type="number"
												endAdornment={
													<InputAdornment position="end">ms</InputAdornment>
												}
												inputProps={ { min: 1 } }
											/>
										</FormControl>

										{ /* <input className="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[dots_speed]" id="dots_speed" value="<?php echo esc_attr( $data['dots_speed'] ); ?>" size="5" min="1" required pattern="^\d+$" />[ms] */ }
									</td>
								</tr>
							) }

							<tr>
								<th>
									{ __( 'Delays loading of images', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Images outside of viewport won\'t be loaded before user scrolls to them. Great for mobile devices to speed up page loadings.', 'wp-posts-carousel' ) ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'With some themes or servers it might cause problems. If you have problem with your carousel (e.g: one of the images did not show, etc.), please uncheck this option.', 'wp-posts-carousel' ), 'warning' ); ?> */ }
								</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="lazy_load"
												checked={ values.lazy_load }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[lazy_load]" id="lazy_load" <?php checked( ( bool ) $data['lazy_load'], false ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Mouse events', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="mouse_drag"
												checked={ values.mouse_drag }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[mouse_drag]" id="mouse_drag" <?php checked( ( bool ) $data['mouse_drag'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>
									{ __( 'Mousewheel scrolling', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'With some themes or servers it might cause problems. If you have problem with your carousel or site (e.g: you can\'t scroll the page, etc.), please uncheck this option.', 'wp-posts-carousel' ), 'warning' ); ?> */ }
								</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="mouse_wheel"
												checked={ values.mouse_wheel }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[mouse_wheel]" id="mouse_wheel" <?php checked( ( bool ) $data['mouse_wheel'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Touch events', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="touch_drag"
												checked={ values.touch_drag }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[touch_drag]" id="touch_drag" <?php checked( ( bool ) $data['touch_drag'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Animation', 'wp-posts-carousel' ) }</th>
								<td>
									{ /* <select className="select wp-posts-carousel-field" name="wp_posts_carousel[easing]" id="easing">
                <?php
                    $animation_list = WP_Posts_Carousel_Utils::get_animations();
                    foreach( $animation_list as $key => $list ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['easing'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_attr( $list ) . '</option>';
                    }
                ?>
                </select> */ }
								</td>
							</tr>
							<tr>
								<th>
									{ __( 'Auto width', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'It\'s recommended to set width on divs, but sometimes you may want this option :)', 'wp-posts-carousel' ) ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'With some themes or servers it might cause problems. If you have problem with your carousel (e.g: one of the images did not show, etc.), please uncheck this option.', 'wp-posts-carousel' ), 'warning' ); ?> */ }
								</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="auto_width"
												checked={ values.auto_width }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[auto_width]" id="auto_width" <?php checked( ( bool ) $data['auto_width'], false ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>
									{ __( 'Auto height', 'wp-posts-carousel' ) }
									{ /* <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Height adjusted dynamically to highest displayed item.', 'wp-posts-carousel' ) ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'With some themes or servers it might cause problems. If you have problem with your carousel (e.g: one of the images did not show, etc.), please uncheck this option.', 'wp-posts-carousel' ), 'warning' ); ?> */ }
								</th>
								<td>
									<FormControlLabel
									label=""
										control={
											<Switch
												color="primary"
												name="auto_height"
												checked={ values.auto_height }
												onChange={ handleChange }
											/>
										}
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[auto_height]" id="auto_height" <?php checked( ( bool ) $data['auto_height'], true ); ?> /> */ }
								</td>
							</tr>

							{ /* <?php apply_filters( 'wp-posts-carousel-carousel-meta-box', array() ); ?> */ }
						</tbody>
					</table>
				</AccordionDetails>
			</Accordion>
		</>
	);
};
export default CarouselOptions;
