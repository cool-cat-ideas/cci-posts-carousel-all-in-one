import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { observer } from 'mobx-react';

const useStyles = makeStyles( ( theme ) =>
	createStyles( {
		loader: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(255,255,255,0.4)',
			zIndex: 9999,
		},
		loaderConteiner: {
			position: 'fixed',
			top: '50%',
			left: '50%',
		},
		bottom: {
			color: '#FAFAFA',
		},
		top: {
			color: '#A9D040',
			animationDuration: '550ms',
			position: 'absolute',
			left: 0,
		},
		circle: {
			strokeLinecap: 'round',
		},
	} )
);

const Loader = ( props ) => {
	const classes = useStyles();

	return (
		props.store.loading && (
			<div className={ classes.loader }>
				<div className={ classes.loaderConteiner }>
					<CircularProgress
						variant="determinate"
						className={ classes.bottom }
						size={ 40 }
						thickness={ 4 }
						value={ 100 }
					/>
					<CircularProgress
						variant="indeterminate"
						disableShrink
						className={ classes.top }
						classes={ {
							circle: classes.circle,
						} }
						size={ 40 }
						thickness={ 4 }
					/>
				</div>
			</div>
		)
	);
};

export default observer( Loader );