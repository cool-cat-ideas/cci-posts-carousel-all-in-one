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
import {observer} from "mobx-react";
const { __ } = wp.i18n;


const MainSettings = ( props ) => {
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
			<Accordion defaultExpanded onChange={ handleExpand( panelName ) } id="wp-posts-carousel-right-sidebar-anchor">
				<AccordionSummary
				
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
								<th>{ __( 'Show title', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="include_font_awesome" checked={ values.include_font_awesome } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_title]" id="show_title" <?php checked( ( bool ) $data['show_title'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show author', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="include_admin_font_awesome" checked={ values.include_admin_font_awesome } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_author]" id="show_author" <?php checked( ( bool ) $data['show_author'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'Show created date', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="include_in_footer" checked={ values.include_in_footer } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_created_date]" id="show_created_date" <?php checked( ( bool ) $data['show_created_date'], true ); ?> /> */ }
								</td>
							</tr>
							<tr>
								<th>{ __( 'is_debug_mode', 'wp-posts-carousel' ) }</th>
								<td>
									<FormControlLabel
										control={ <Switch color="primary" name="is_debug_mode" checked={ values.is_debug_mode } onChange={ handleChange } /> }
									/>
									{ /* <input className="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_created_date]" id="show_created_date" <?php checked( ( bool ) $data['show_created_date'], true ); ?> /> */ }
								</td>
							</tr>							
							
						</tbody>
					</table>
				</AccordionDetails>
			</Accordion>
		</>
	);
};
export default MainSettings;
