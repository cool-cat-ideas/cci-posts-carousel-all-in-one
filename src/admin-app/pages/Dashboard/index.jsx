import React from 'react';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const { __ } = wp.i18n;

class Dashboard extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		return (
			<>
				<Grid container spacing={ 3 }>
					{ /* Chart */ }
					<Grid item xs={ 12 } md={ 8 } lg={ 9 }>
						<Paper className={ this.props.fixedHeightPaper }>chart</Paper>
					</Grid>
					{ /* Recent Deposits */ }
					<Grid item xs={ 12 } md={ 4 } lg={ 3 }>
						<Paper className={ this.props.fixedHeightPaper }>deposit</Paper>
					</Grid>
					{ /* Recent Orders */ }
					<Grid item xs={ 12 }>
						<Paper className={ this.props.fixedHeightPaper }>orders</Paper>
					</Grid>
				</Grid>
			</>
		);
	}
}
export default Dashboard;
