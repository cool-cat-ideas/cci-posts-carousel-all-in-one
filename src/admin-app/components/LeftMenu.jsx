import React from 'react';
import { Link } from 'react-router-dom';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AmpStoriesIcon from '@material-ui/icons/AmpStories';
import AppsIcon from '@material-ui/icons/Apps';
import ChatIcon from '@material-ui/icons/Chat';
import InfoIcon from '@material-ui/icons/Info';
import LayersIcon from '@material-ui/icons/Layers';
import SettingsIcon from '@material-ui/icons/Settings';
import { Badge } from '@material-ui/core';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Button from '@material-ui/core/Button';

const { __ } = wp.i18n;
const pluginUrl = pluginData.pluginUrl;

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
					<ListSubheader>
						{ __( 'Main', 'wp-posts-carousel' ) }
					</ListSubheader>
					<ListItem
						button
						component={ Link }
						to={ pluginUrl }
						onClick={ () => this.props.setSubpage( '' ) }
					>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText
							primary={ __( 'Dashboard', 'wp-posts-carousel' ) }
						/>
					</ListItem>
					<ListItem
						button
						component={ Link }
						to={ `${ pluginUrl }&subpage=carousels` }
					>
						<ListItemIcon>
							<AmpStoriesIcon />
						</ListItemIcon>
						<ListItemText
							primary={ __( 'Carousels', 'wp-posts-carousel' ) }
						/>
						<Badge
							badgeContent={ 4 }
							max={ 99 }
							showZero={ false }
							color="primary"
						/>
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<LayersIcon />
						</ListItemIcon>
						<ListItemText
							primary={ __(
								'Integrations',
								'wp-posts-carousel'
							) }
						/>
						<Badge
							badgeContent={ 1 }
							max={ 99 }
							showZero={ false }
							color="primary"
						/>
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<AppsIcon />
						</ListItemIcon>
						<ListItemText
							primary={ __( 'Addons', 'wp-posts-carousel' ) }
						/>
						<Badge badgeContent="New" color="primary" />
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<SettingsIcon />
						</ListItemIcon>
						<ListItemText
							primary={ __( 'Settings', 'wp-posts-carousel' ) }
						/>
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListSubheader>
						{ __( 'Others', 'wp-posts-carousel' ) }
					</ListSubheader>

					<ListItem button>
						<ListItemIcon>
							<InfoIcon />
						</ListItemIcon>
						<ListItemText
							primary={ __(
								'Knowledge Base',
								'wp-posts-carousel'
							) }
						/>
					</ListItem>
				</List>
				<Button
					className={ classes.button }
					startIcon={ <StarBorderIcon /> }
				>
					{ __( 'Premium Support', 'wp-posts-carousel' ) }
				</Button>
			</>
		);
	}
}

export default LeftMenu;
