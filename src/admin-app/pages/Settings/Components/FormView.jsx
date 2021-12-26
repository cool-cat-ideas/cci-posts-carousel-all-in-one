import React from 'react';
import Button from '@mui/material/Button';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import MainSettings from './Parts/MainSettings';

const { __ } = wp.i18n;


const Form = ( props ) => {
	const classes = props.classes;

	const [ expanded, setExpanded ] = React.useState( false );

	const handleExpand = ( panel ) => ( event, isExpanded ) => {
		setExpanded( isExpanded ? panel : false );
	};
	const {
		values,
		touched,
		errors,
		isSubmitting,
		handleChange,
		handleBlur,
		handleSubmit,
		handleReset,
	} = props;

	return (
		<div>
			<Grid container spacing={ 3 }>
				<Grid item xs={ 12 } md={ 8 } lg={ 8 }>
					<Grid container spacing={ 3 }>		
						<Grid item xs={ 12 } md={ 12 } lg={ 12 }>	
							<MainSettings
								{ ...props }
								panelName="panel-2"
								expanded={ expanded }
								handleExpand={ handleExpand }
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={ 12 } md={ 4 } lg={ 4 }>
					<div id="wp-posts-carousel-right-sidebar" ref={ props.rightSidebar }>
					<Paper className={ classes.paper }>
						<Button type="submit" color="primary" disabled={ isSubmitting }>
							SUBMIT
						</Button>
					</Paper>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

export default Form;
