import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { useFormikContext } from 'formik';

import PostSelectionCriteria from './Parts/PostSelectionCriteria';
import TemplateOptions from './Parts/TemplateOptions';
import DisplayOptions from './Parts/DisplayOptions';
import CarouselOptions from './Parts/CarouselOptions';

const { __ } = wp.i18n;

const Form = ( props ) => {
	const classes = props.classes;

	const [ expanded, setExpanded ] = React.useState( false );

	const handleExpand = ( panel ) => ( event, isExpanded ) => {
		setExpanded( isExpanded ? panel : false );
	};

	const { values, touched, errors, isSubmitting, handleChange, handleBlur } = useFormikContext();
	const { data } = props;

	return (
		<Grid container spacing={ 3 }>
			<Grid item xs={ 12 } md={ 8 } lg={ 8 }>
				<Grid container spacing={ 3 }>
					<Grid item xs={ 12 } md={ 12 } lg={ 12 }>
						<Paper id="wp-posts-carousel-right-sidebar-anchor" sx={ { p: 1 } }>
							<TextField
								id="title"
								label="Title"
								value={ values.title || '' }
								onChange={ handleChange }
								onBlur={ handleBlur }
								helperText={ touched.title ? errors.title : '' }
								error={ touched.title && Boolean( errors.title ) }
								margin="dense"
								variant="outlined"
								fullWidth
								required
								InputLabelProps={ {
									shrink: true,
								} }
							/>
						</Paper>
					</Grid>
					<Grid item xs={ 12 } md={ 12 } lg={ 12 }>
						<PostSelectionCriteria
							{ ...props }
							panelName="panel-1"
							expanded={ expanded }
							handleExpand={ handleExpand }
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={ 12 } md={ 4 } lg={ 4 }>
				<div id="wp-posts-carousel-right-sidebar" ref={ props.rightSidebar }>
					<Paper>
						{ data && data.post && (
							<>
								{ ' ' }
								{ data.post.user_nicename }
								<hr />
							</>
						) }

						<Button type="submit" color="primary" disabled={ isSubmitting }>
							SUBMIT
						</Button>
					</Paper>
				</div>
			</Grid>
			<Grid item xs={ 12 } md={ 12 } lg={ 12 }>
				<TemplateOptions
					{ ...props }
					panelName="panel-2"
					expanded={ expanded }
					handleExpand={ handleExpand }
				/>
			</Grid>
			<Grid item xs={ 12 } md={ 8 } lg={ 8 }>
				<DisplayOptions
					{ ...props }
					panelName="panel-3"
					expanded={ expanded }
					handleExpand={ handleExpand }
				/>

				<CarouselOptions
					{ ...props }
					panelName="panel-4"
					expanded={ expanded }
					handleExpand={ handleExpand }
				/>
			</Grid>
		</Grid>
	);
};

export default Form;
