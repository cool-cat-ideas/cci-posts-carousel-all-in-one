import React, { useEffect, useState } from 'react';
import queryString from 'queryString';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { withStyles, makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Button from '@mui/material/Button';
// import AddIcon from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import api from '../../components/Api';
import { CustomTooltip } from '../../components/Tooltip';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const { __ } = wp.i18n;
const pluginUrl = wpPostsCarouselPluginData.pluginUrl;

const List = ( props ) => {
	const [ list, setList ] = useState( [] );
	const [ hoveringOver, setHoveringOver ] = useState( '' );
	const handleRowHover = ( event, id ) => setHoveringOver( id );
	const handleRowHoverLeave = ( event, id ) => setHoveringOver( '' );

	const [ openDeleteDialog, setOpenDeleteDialog ] = useState( false );
	const [ selectedCarousel, setSelectedCarousel ] = useState( null );
	const handleOpenDeleteDialog = ( event, item ) => {
		setOpenDeleteDialog( true );
		setSelectedCarousel( item );
	};

	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog( false );
		setSelectedCarousel( null );
	};

	const [ copiedShortcode, setCopiedShortcode ] = useState( false );

	const handleCopyShortcode = () => {
		setCopiedShortcode( true );
		props.store.enqueueSnackbar( {
			message: __(
				'Skopiowano krótki kod,\nMożesz wkleić go w dowolnym miejscu na stronie',
				'wp-posts-carousel'
			),
			options: {
				variant: 'success',
			},
		} );
	};

	const handleGetCarousels = () => {
		let values = [];
		//const query = queryString.parse( props.location.search );

		api.get( '/wp-json/wp-posts-carousel/v1/admin/carousels', {} )
			.then( ( response ) => {
				if ( response.status == 200 && response.data ) {
					setList( response.data );
				}
			} )
			.catch( ( error ) => {
				props.store.enqueueSnackbar( {
					message: __( 'Failed fetching data', 'wp-posts-carousel' ),
					options: {
						variant: 'error',
					},
				} );
			} );
	};

	useEffect( () => {
		return handleGetCarousels();
	}, [] );

	const handleDeleteCarousel = () => {
		api.delete( `/wp-json/wp-posts-carousel/v1/admin/carousel/${ selectedCarousel.ID }`, {} )
			.then( ( response ) => {
				handleCloseDeleteDialog();

				if ( response.status == 200 && response.data ) {
					props.store.enqueueSnackbar( {
						message: __( 'Carousel was deleted', 'wp-posts-carousel' ),
						options: {
							variant: 'success',
						},
					} );
					handleGetCarousels();
				}
			} )
			.catch( ( error ) => {
				props.store.enqueueSnackbar( {
					message: __( 'Failed delete carousel', 'wp-posts-carousel' ),
					options: {
						variant: 'error',
					},
				} );
			} );
	};

	const CustomTableRow = withStyles( ( theme ) => ( {
		root: {
			verticalAlign: 'top',
		},
	} ) )( TableRow );

	return (
		<>
			<Button
				size="small"
				variant="contained"
				color="primary"
				// startIcon={ /*<AddIcon />*/ }
				component={ Link }
				to={ `admin.php?page=wp-posts-carousel&subpage=carousels&action=add-new` }
			>
				{ __( 'Add new carousel', 'wp-posts-carousel' ) }
			</Button>

			<Grid container spacing={ 3 } style={ { marginTop: '20px' } }>
				{ /* Chart */ }
				<Grid item xs={ 12 } md={ 12 } lg={ 12 }>
					<Paper>
						<TableContainer>
							<Table stickyHeader aria-label=" table">
								<TableHead>
									<TableRow>
										<TableCell key={ 'post_title' }>
											{ __( 'Title', 'wp-posts-carousel' ) }
										</TableCell>
										<TableCell
											key={ 'user_nicename' }
											style={ {
												width: 250,
											} }
										>
											{ __( 'Author', 'wp-posts-carousel' ) }
										</TableCell>
										<TableCell
											key={ 'shortcode' }
											style={ {
												width: 250,
												maxWidth: 300,
											} }
										>
											Shortcode
										</TableCell>
										<TableCell
											key={ 'post_date' }
											style={ {
												width: 150,
												maxWidth: 200,
											} }
										>
											{ __( 'Date', 'wp-posts-carousel' ) }
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{ list.length > 0 &&
										list.map( ( row ) => {
											return (
												<CustomTableRow
													hover
													role="checkbox"
													tabIndex={ -1 }
													key={ row.ID }
													onMouseEnter={ ( e ) => handleRowHover( e, row.ID ) }
													onMouseLeave={ ( e ) => handleRowHoverLeave( e, row.ID ) }
												>
													<TableCell key={ 'post_title' }>
														<span>{ row.post_title }</span>
														<br />
														{ hoveringOver === row.ID && (
															<>
																<Button
																	size="small"
																	variant="contained"
																	color="primary"
																	// startIcon={ /*<EditIcon />*/ }
																	component={ Link }
																	to={ `${ pluginUrl }&subpage=carousels&action=edit&id=${ row.ID }` }
																>
																	{ __( 'Edytuj', 'wp-posts-carousel' ) }
																</Button>
																{ ' | ' }
																<Button
																	size="small"
																	variant="contained"
																	color="secondary"
																	// startIcon={ /*<DeleteIcon />*/ }
																	onClick={ ( e ) =>
																		handleOpenDeleteDialog( e, row )
																	}
																>
																	{ __( 'Usuń', 'wp-posts-carousel' ) }
																</Button>
															</>
														) }
													</TableCell>
													<TableCell key={ 'user_nicename' }>
														{ row.user_nicename }
													</TableCell>
													<TableCell key={ 'shortcode' }>
														<CustomTooltip
															title={ __(
																'Kliknij aby skopiować kod',
																'wp-posts-carousel'
															) }
														>
															{ /* <CopyToClipboard
															text={ `[wp_posts_carousel id=${ row.ID }]` }
															onCopy={ handleCopyShortcode }
														> */ }
															<Chip
																color="default"
																label={ `[wp_posts_carousel id=${ row.ID }]` }
																clickable={ true }
															/>
															{ /* </CopyToClipboard> */ }
														</CustomTooltip>
													</TableCell>
													<TableCell key={ 'post_date' }>
														<span>
															{ __( row.post_status, 'wp-posts-carousel' ) }
														</span>
														<br />
														{ row.post_date }
													</TableCell>
												</CustomTableRow>
											);
										} ) }
								</TableBody>
							</Table>
						</TableContainer>

						<Dialog
							open={ openDeleteDialog }
							onClose={ handleCloseDeleteDialog }
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">
								{ __( 'Czy na pewno chcesz ununąć ten element?', 'wp-posts-carousel' ) }
							</DialogTitle>
							<DialogContent>
								{ selectedCarousel ? selectedCarousel.post_title : '' }
							</DialogContent>
							<DialogActions>
								<Button
									onClick={ handleCloseDeleteDialog }
									variant="contained"
									color="default"
								>
									{ __( 'Anuluj', 'wp-posts-carousel' ) }
								</Button>
								<Button
									onClick={ handleDeleteCarousel }
									variant="contained"
									color="secondary"
									autoFocus
								>
									{ __( 'Tak', 'wp-posts-carousel' ) }
								</Button>
							</DialogActions>
						</Dialog>
					</Paper>
				</Grid>
			</Grid>
		</>
	);
};
export default observer( List );
