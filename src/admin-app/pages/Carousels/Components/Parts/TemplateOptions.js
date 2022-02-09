import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';

import { CustomAutocomplete } from '../../../../components/Forms';

import MyTooltip from '../../../../components/Tooltip';

import { useFormikContext } from 'formik';

const { __ } = wp.i18n;
const permalinkStructure = wpPostsCarouselPluginData.permalinkStructure;

const TemplateOptions = ( props ) => {
	const { values, touched, errors, handleChange, setFieldValue } = useFormikContext();

	const endpoints = {
		posts: '/wp-json/wp-posts-carousel/v1/admin/posts?s=',
		categories: '/wp-json/wp-posts-carousel/v1/admin/categories?s=',
		tags: '/wp-json/wp-posts-carousel/v1/admin/tags?s=',
	};

	const { classes, data, panelName, handleExpand, store } = props;

	useEffect( () => {
		let posts = [];

		if ( values[ 'posts' ] && values[ 'posts' ].length > 0 ) {
			posts = values[ 'posts' ].filter( ( option ) =>
				values[ 'post_types' ].some( ( postType ) => option.post_type === postType.value )
			);
		}

		setFieldValue( 'posts', posts );
	}, [ values[ 'post_types' ] ] );

	return (
		<>
			<Accordion defaultExpanded onChange={ handleExpand( panelName ) }>
				<AccordionSummary
					expandIcon={ <ExpandMoreIcon /> }
					aria-controls={`${panelName}-content`}
					id={`${panelName}-header`}
				>
					<Typography>{ __( 'Template', 'wp-posts-carousel' ) }</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Box
						sx={ {
							display: 'flex',
							flexWrap: 'wrap',
							'& > :not(style)': {
								m: 1,
								width: 128,
								height: 128,
							},
						} }
					>
						<Paper elevation={ 1 } />
						<Paper elevation={ 1 } />
					</Box>
				</AccordionDetails>
			</Accordion>
		</>
	);
};
export default observer( TemplateOptions );
