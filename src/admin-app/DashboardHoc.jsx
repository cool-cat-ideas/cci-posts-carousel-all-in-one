import React from 'react';
import clsx from 'clsx';
import queryString from 'queryString';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@mui/styles';
import { ThemeProvider } from '@mui/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
// import MenuIcon from '@material-ui/icons/Menu';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import NotificationsIcon from '@material-ui/icons/Notifications';

import { SnackbarProvider } from 'notistack';

import LeftMenu from './components/LeftMenu';
import Loader from './components/Loader';
import Notifier from './components/Notifier';

import { theme, styles } from './components/styles';

const { __ } = wp.i18n;
const wpadminbarPosition = document.getElementById( 'wpadminbar' ).getBoundingClientRect();

const DashboardHoc = ( Component ) => {
	@inject( 'store' )
	@observer
	class Dashboard extends React.Component {
		constructor( props ) {
			super( props );

			this.state = {
				open: true,
				title: '',
				page: this.props.page,
				sidebarScrollPos: 0,
				rightSidebarScrollPos: 0,
				lastScrollY: 0,
			};

			this.handleLeftMenuDrawer = this.handleLeftMenuDrawer.bind( this );
			this.setSubpage = this.setSubpage.bind( this );
			this.mainSidebar = React.createRef();
			this.rightSidebar = React.createRef();
		}

		handleLeftMenuDrawer = () => this.setState( { open: ! this.state.open } );

		setSubpage() {
			let query = queryString.parse( this.props.location.search );
			let page = query.subpage
				? query.subpage.slice( 0, 1 ).toUpperCase() + query.subpage.slice( 1, query.subpage.length )
				: 'Dashboard';
			this.setState( { page: page } );
		}

		getOffset( element ) {
			if ( ! element ) {
				return null;
			}

			const position = element.getBoundingClientRect();
			return {
				left: position.left + window.scrollX,
				top: position.top + window.scrollY,
			};
		}

		componentDidMount() {
			window.addEventListener( 'scroll', this.handleScroll );
			this.mainSidebarPosition = this.getOffset(
				document.getElementById( 'wp-posts-carousel-main-sidebar' )
			);
			this.rightSidebarPosition = document.getElementById( 'wp-posts-carousel-right-sidebar' )
				? this.getOffset( document.getElementById( 'wp-posts-carousel-right-sidebar' ) )
				: null;
			this.wpContentPosition = this.getOffset( document.getElementById( 'wpcontent' ) );
			this.containerPosition = this.getOffset(
				document.getElementById( 'wp-posts-carousel-react-admin' )
			);
			this.mainPosition = document.getElementById( 'wp-posts-carousel-right-sidebar-anchor' )
				? this.getOffset( document.getElementById( 'wp-posts-carousel-right-sidebar-anchor' ) )
				: null;
		}

		componentWillUnmount() {
			window.removeEventListener( 'scroll', this.handleScroll );
		}

		handleScroll = () => {
			// const { lastScrollY } = this.state;
			// let scrollDirection = null;

			// if ( lastScrollY > window.scrollY ) {
			// 	scrollDirection = 'UP';
			// } else if ( lastScrollY < window.scrollY ) {
			// 	scrollDirection = 'DOWN';
			// }
			// this.setState( { lastScrollY: window.scrollY } );

			// const sidebar = this.mainSidebar.current;
			// sidebar.style = '';
			// const rightSidebar = this.rightSidebar.current;
			// const currentScrollPos = window.scrollY;

			// if ( rightSidebar ) {
			// 	rightSidebar.style = '';
			// }
				
			// 	if ( scrollDirection == 'DOWN' ) {
			// 		if ( parseInt( currentScrollPos ) >= parseInt( this.containerPosition.top ) ) {
			// 			sidebar.classList.add( clsx( this.props.classes.sticky ) );

			// 			if ( parseInt( currentScrollPos ) >= this.containerPosition.height ) {
			// 				sidebar.style.position = 'absolute';
			// 				sidebar.style.bottom = 20 + 'px';
			// 			} else {
			// 				sidebar.style.top = wpadminbarPosition.height + 'px';
			// 			}
			// 		}

			// 		if ( rightSidebar && this.rightSidebarPosition && this.mainPosition ) {
			// 			if ( parseInt( currentScrollPos ) >= parseInt( this.mainPosition.top ) ) {
			// 				rightSidebar.classList.add( clsx( this.props.classes.sticky ) );
			// 				rightSidebar.style.top = parseInt( wpadminbarPosition.height + 20 ) + 'px';
			// 			}
			// 		}
			// 	} else {
			// 		if ( parseInt( currentScrollPos ) > parseInt( this.containerPosition.top ) ) {
			// 			sidebar.classList.add( clsx( this.props.classes.sticky ) );
			// 			sidebar.style.top = wpadminbarPosition.height + 'px';
			// 		} else {
			// 			sidebar.classList.remove( clsx( this.props.classes.sticky ) );
			// 			sidebar.style = '';
			// 		}

			// 		if (rightSidebar && this.rightSidebarPosition && this.mainPosition ) {
			// 			if ( parseInt( currentScrollPos ) > parseInt( this.mainPosition.top ) ) {
			// 				rightSidebar.classList.add( clsx( this.props.classes.sticky ) );
			// 				rightSidebar.style.top = parseInt( wpadminbarPosition.height + 20 ) + 'px';
			// 			} else {
			// 				rightSidebar.classList.remove( clsx( this.props.classes.sticky ) );
			// 				rightSidebar.style = '';
			// 			}
			// 		}
			// 	}
			
		};

		render() {
			const { classes } = this.props;
			const fixedHeightPaper = clsx( classes.paper, classes.fixedHeight );

			return (
				<div className={ classes.root }>					
					<ThemeProvider theme={ theme }>
						<CssBaseline />
						<SnackbarProvider
							maxSnack={ 3 }
							dense={ true }
							autoHideDuration={ 5000 }
							anchorOrigin={ { horizontal: 'left', vertical: 'bottom' } }
							classes={ {
								containerRoot: classes.snackbarContainer,
							} }
						>
							<Notifier />
							<Loader { ...this.props } />
							<AppBar
								position="absolute"
								className={ clsx( classes.appBar, this.state.open && classes.appBarShift ) }
							>
								<Toolbar className={ classes.toolbar }>
									{/* <IconButton
										edge="start"
										color="inherit"
										aria-label="open drawer"
										onClick={ this.handleLeftMenuDrawer }
										className={ clsx( classes.menuButton ) }
									>
										{ this.state.open ? <ChevronLeftIcon /> : <MenuIcon /> }
									</IconButton> */}

									<Typography
										component="h1"
										variant="h6"
										color="inherit"
										noWrap
										className={ classes.title }
									>
										{ __( this.state.page, 'wp-posts-carousel' ) }
									</Typography>
									{/* <IconButton color="inherit">
										<Badge badgeContent={ 4 } color="secondary">
											<NotificationsIcon />
										</Badge>
									</IconButton> */}
								</Toolbar>
							</AppBar>
							<Drawer
								variant="permanent"
								classes={ {
									paper: clsx(
										classes.drawerPaper,
										! this.state.open && classes.drawerPaperClose
									),
								} }
								open={ this.state.open }
							>
								<div id="wp-posts-carousel-main-sidebar" ref={ this.mainSidebar }>
									<p>Logo</p>
									<LeftMenu classes={ classes } setSubpage={ this.setSubpage } />
								</div>
							</Drawer>
							<main className={ classes.content }>
								<div className={ classes.appBarSpacer } />
								<Container maxWidth="lg" className={ classes.container }>
									<div className={ this.props.classes.fixedHeightPaper }>
										<Component
											{ ...this.props }
											state={ this.state }
											rightSidebar={ this.rightSidebar }
											fixedHeightPaper={ fixedHeightPaper }
										/>
									</div>

									<Box pt={ 4 }>
										<Typography variant="body2" color="textSecondary" align="center">
											{ 'Copyright © ' }
											<Link color="inherit" to="https://teastudio.pl/en/">
												teastudio.pl
											</Link>{ ' ' }
											{ new Date().getFullYear() }
											{ '.' }
										</Typography>
									</Box>
								</Container>
							</main>
						</SnackbarProvider>
					</ThemeProvider>
				</div>
			);
		}
	}

	return withStyles( styles )( Dashboard );
};

export default DashboardHoc;
