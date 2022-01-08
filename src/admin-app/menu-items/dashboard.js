// assets
import { IconDashboard } from '@tabler/icons';

// constant
const icons = { IconDashboard };
const pluginUrl = `/${wpPostsCarouselPluginData.pluginUrl}`;

// ==============================|| DASHBOARD MENU ITEMS ||============================== //
const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: `${pluginUrl}`,
            icon: icons.IconDashboard,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
