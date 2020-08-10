import React from 'react';
import { Link } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const { __ } = wp.i18n;

class Carousels extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const { classes } = this.props;
		const columns = [
			{ id: 'name', label: 'Name', minWidth: 170 },
			{ id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
			{
				id: 'population',
				label: 'Population',
				minWidth: 170,
				align: 'right',
				format: ( value ) => value.toLocaleString( 'en-US' ),
			},
			{
				id: 'size',
				label: 'Size\u00a0(km\u00b2)',
				minWidth: 170,
				align: 'right',
				format: ( value ) => value.toLocaleString( 'en-US' ),
			},
			{
				id: 'density',
				label: 'Density',
				minWidth: 170,
				align: 'right',
				format: ( value ) => value.toFixed( 2 ),
			},
		];

		const rows = [
			{
				name: 'India',
				code: 'IN',
				population: 1324171354,
				size: 3287263,
				density: 67,
			},
		];

		return (
			<>
				<Button
					size="small"
					variant="contained"
					color="primary"
					startIcon={ <AddIcon /> }
					component={ Link }
					to={ `admin.php?page=wp-posts-carousel&subpage=carousels&action=add-new` }
				>
					{ __( 'Add new carousel', 'wp-posts-carousel' ) }
				</Button>
				<Grid container spacing={ 3 }>
					{ /* Chart */ }
					<Grid item xs={ 12 } md={ 12 } lg={ 12 }>
						<Paper className={ this.props.fixedHeightPaper }>
							<TableContainer>
								<Table stickyHeader aria-label="sticky table">
									<TableHead>
										<TableRow>
											{ columns.map( ( column ) => (
												<TableCell
													key={ column.id }
													align={ column.align }
													style={ {
														minWidth:
															column.minWidth,
													} }
												>
													{ column.label }
												</TableCell>
											) ) }
										</TableRow>
									</TableHead>
									<TableBody>
										{ rows.map( ( row ) => {
											return (
												<TableRow
													hover
													role="checkbox"
													tabIndex={ -1 }
													key={ row.code }
												>
													{ columns.map(
														( column ) => {
															const value =
																row[
																	column.id
																];
															return (
																<TableCell
																	key={
																		column.id
																	}
																	align={
																		column.align
																	}
																>
																	{ column.format &&
																	typeof value ===
																		'number'
																		? column.format(
																				value
																		  )
																		: value }
																</TableCell>
															);
														}
													) }
												</TableRow>
											);
										} ) }
									</TableBody>
								</Table>
							</TableContainer>
							{ /* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */ }
						</Paper>
					</Grid>
				</Grid>
			</>
		);
	}
}
export default Carousels;
