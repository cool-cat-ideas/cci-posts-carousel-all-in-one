import React from 'react';
import clsx from 'clsx';
import queryString from 'queryString';

import {
	withStyles,
	ThemeProvider,
	CssBaseline,
	Drawer,
	Box,
} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import LeftMenu from './components/LeftMenu';
import { styles, theme } from './components/styles';

const { __ } = wp.i18n;

const DashboardHoc = ( Component ) => {
	class Dashboard extends React.Component {
		constructor( props ) {
			super( props );

			this.state = {
				open: true,
				title: '',
				page: this.props.page,
			};

			this.handleLeftMenuDrawer = this.handleLeftMenuDrawer.bind( this );
			this.setSubpage = this.setSubpage.bind( this );
		}

		handleLeftMenuDrawer = () =>
			this.setState( { open: ! this.state.open } );

		setSubpage() {
			let query = queryString.parse( this.props.location.search );
			let page = query.subpage
				? query.subpage.slice( 0, 1 ).toUpperCase() +
				  query.subpage.slice( 1, query.subpage.length )
				: 'Dashboard';
			this.setState( { page: page } );
		}

		render() {
			const { classes } = this.props;
			const fixedHeightPaper = clsx( classes.paper, classes.fixedHeight );

			return (
				<div className={ classes.root }>
					<CssBaseline />
					<ThemeProvider theme={ theme }>
						<AppBar
							position="absolute"
							className={ clsx(
								classes.appBar,
								this.state.open && classes.appBarShift
							) }
						>
							<Toolbar className={ classes.toolbar }>
								<IconButton
									edge="start"
									color="inherit"
									aria-label="open drawer"
									onClick={ this.handleLeftMenuDrawer }
									className={ clsx( classes.menuButton ) }
								>
									{ this.state.open ? (
										<ChevronLeftIcon />
									) : (
										<MenuIcon />
									) }
								</IconButton>

								<Typography
									component="h1"
									variant="h6"
									color="inherit"
									noWrap
									className={ classes.title }
								>
									{ __(
										this.state.page,
										'wp-posts-carousel'
									) }
								</Typography>
								<IconButton color="inherit">
									<Badge badgeContent={ 4 } color="secondary">
										<NotificationsIcon />
									</Badge>
								</IconButton>
							</Toolbar>
						</AppBar>
						<Drawer
							variant="persistent"
							classes={ {
								paper: clsx(
									classes.drawerPaper,
									! this.state.open &&
										classes.drawerPaperClose
								),
							} }
							open={ this.state.open }
						>
							<p>Logo</p>
							<LeftMenu
								classes={ classes }
								setSubpage={ this.setSubpage }
							/>
						</Drawer>
						<main className={ classes.content }>
							<div className={ classes.appBarSpacer } />
							<Container
								maxWidth="lg"
								className={ classes.container }
							>
								<div
									className={
										this.props.classes.fixedHeightPaper
									}
								>
									<Component
										{ ...this.props }
										state={ this.state }
										fixedHeightPaper={ fixedHeightPaper }
									/>
								</div>

								<Box pt={ 4 }>
									<Typography
										variant="body2"
										color="textSecondary"
										align="center"
									>
										{ 'Copyright © ' }
										<Link
											color="inherit"
											to="https://teastudio.pl/en/"
										>
											teastudio.pl
										</Link>{ ' ' }
										{ new Date().getFullYear() }
										{ '.' }
									</Typography>
								</Box>
							</Container>
						</main>
					</ThemeProvider>
				</div>
			);
		}
	}

	return withStyles( styles )( Dashboard );
};

export default DashboardHoc;
