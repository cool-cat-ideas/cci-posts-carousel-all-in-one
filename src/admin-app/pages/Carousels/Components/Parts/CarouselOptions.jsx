import React from 'react';

import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TextField from '@material-ui/core/TextField';

const { __ } = wp.i18n;

const CarouselOptions = ( props ) => {
	const {
		classes,
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
						{ __('Carousel options', 'wp-posts-carousel') }
					</Typography>
					{/* <Typography className={ classes.secondaryHeading }>
						
					</Typography> */}
				</AccordionSummary>
				<AccordionDetails>
					
				</AccordionDetails>
			</Accordion>
		</>
	);
};
export default CarouselOptions;
