import React from 'react';
import { Link } from 'react-router-dom';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import AmpStoriesIcon from '@mui/icons-material/AmpStories';
// import AppsIcon from '@mui/icons-material/Apps';
// import ChatIcon from '@mui/icons-material/Chat';
// import InfoIcon from '@mui/icons-material/Info';
// import LayersIcon from '@mui/icons-material/Layers';
// import SettingsIcon from '@mui/icons-material/Settings';
import { Badge } from '@mui/material';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
import Button from '@mui/material/Button';
import clsx from 'clsx';
const { __ } = wp.i18n;
const pluginUrl = wpPostsCarouselPluginData.pluginUrl;

class LeftMenu extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const { classes } = this.props;

		return (
			<>
				<Divider className={ classes.appBarDivider } />
				<List>
					<ListSubheader>{ __( 'Main', 'wp-posts-carousel' ) }</ListSubheader>
					<ListItem
						button
						component={ Link }
						to={ pluginUrl }
						onClick={ () => this.props.setSubpage( '' ) }
					>
						<ListItemIcon className={ clsx( classes.menuIcon ) }>
							{/* <DashboardIcon /> */}
						</ListItemIcon>
						<ListItemText primary={ __( 'Dashboard', 'wp-posts-carousel' ) } />
					</ListItem>
					<ListItem button component={ Link } to={ `${ pluginUrl }&subpage=carousels` }>
						<ListItemIcon className={ clsx( classes.menuIcon ) }>
							{/* <AmpStoriesIcon /> */}
						</ListItemIcon>
						<ListItemText primary={ __( 'Carousels', 'wp-posts-carousel' ) } />
						<Badge badgeContent={ 4 } max={ 99 } showZero={ false } color="primary" />
					</ListItem>
					<ListItem button>
						<ListItemIcon className={ clsx( classes.menuIcon ) }>
							{/* <LayersIcon /> */}
						</ListItemIcon>
						<ListItemText primary={ __( 'Integrations', 'wp-posts-carousel' ) } />
						<Badge badgeContent={ 1 } max={ 99 } showZero={ false } color="primary" />
					</ListItem>
					<ListItem button>
						<ListItemIcon className={ clsx( classes.menuIcon ) }>
							{/* <AppsIcon /> */}
						</ListItemIcon>
						<ListItemText primary={ __( 'Addons', 'wp-posts-carousel' ) } />
						<Badge badgeContent="New" color="primary" />
					</ListItem>
					<ListItem button component={ Link } to={ `${ pluginUrl }&subpage=settings` }>
						<ListItemIcon className={ clsx( classes.menuIcon ) }>
							{/* <SettingsIcon /> */}
						</ListItemIcon>
						<ListItemText primary={ __( 'Settings', 'wp-posts-carousel' ) } />
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListSubheader>{ __( 'Others', 'wp-posts-carousel' ) }</ListSubheader>

					<ListItem button>
						<ListItemIcon className={ clsx( classes.menuIcon ) }>
							{/* <InfoIcon /> */}
						</ListItemIcon>
						<ListItemText primary={ __( 'Knowledge Base', 'wp-posts-carousel' ) } />
					</ListItem>
				</List>
				<Button className={ clsx( classes.premiumSupportButton ) } >
					<span className={ clsx( 'premiumSupportButtonText' ) }>
						{ __( 'Premium Support', 'wp-posts-carousel' ) }
					</span>
				</Button>
			</>
		);
	}
}

export default LeftMenu;
