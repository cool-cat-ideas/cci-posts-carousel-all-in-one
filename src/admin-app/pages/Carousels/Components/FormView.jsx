import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

//import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import PostSelectionCriteria from './Parts/PostSelectionCriteria';
import DisplayOptions from './Parts/DisplayOptions';
import CarouselOptions from './Parts/CarouselOptions';

const { __ } = wp.i18n;

const useStyles = makeStyles( ( theme ) => ( {
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem( 15 ),
		flexBasis: '33.33%',
		flexShrink: 0,
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem( 15 ),
		color: theme.palette.text.secondary,
	},
} ) );

const Form = ( props ) => {
	const classes = Object.assign( props.classes, useStyles() );

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
			{ /* <CssBaseline /> */ }
			<Grid container spacing={ 3 }>
				<Grid item xs={ 12 } md={ 8 } lg={ 9 }>
					<Grid container spacing={ 3 }>
						<Grid item xs={ 12 } md={ 12 } lg={ 12 }>
							<Paper className={ classes.paper }>
								<TextField
									id="title"
									label="Title"
									value={ values.title }
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
								panelName="panel1"
								expanded={ expanded }
								handleExpand={ handleExpand }
							/>

							<DisplayOptions
								{ ...props }
								panelName="panel2"
								expanded={ expanded }
								handleExpand={ handleExpand }
							/>

							<CarouselOptions
								{ ...props }
								panelName="panel2"
								expanded={ expanded }
								handleExpand={ handleExpand }
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={ 12 } md={ 4 } lg={ 3 }>
					<Paper className={ classes.paper }>
						<Button type="submit" color="primary" disabled={ isSubmitting }>
							SUBMIT
						</Button>
					</Paper>
				</Grid>
			</Grid>
			{ /* <Grid container spacing={ 3 }>
				<Grid item xs={ 12 } md={ 12 } lg={ 12 }>
					<Card className={ classes.card }>
						<CardContent>
							place for ads
						</CardContent>
						<CardActions className={ classes.actions }>
							
						</CardActions>
					</Card>
				</Grid>
			</Grid> */ }
		</div>
	);
};

export default Form;
