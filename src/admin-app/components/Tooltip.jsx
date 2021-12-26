import React from 'react';
import { makeStyles } from '@mui/styles';
// import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const useStylesBootstrap = makeStyles( ( theme ) => ( {
	arrow: {
		color: theme.palette.dark.main,
	},
	tooltip: {
		backgroundColor: theme.palette.dark.main,
		fontSize: 12,
	},
} ) );

export const CustomTooltip = ( props ) => {
	const classes = useStylesBootstrap();

	return (
		<Tooltip arrow {...props}>
			{ props.helpIcon ? (
				<IconButton aria-label="help">
					{/* <HelpIcon /> */}
				</IconButton>
			) : (
				props.children
			) }
		</Tooltip>
	);
};
