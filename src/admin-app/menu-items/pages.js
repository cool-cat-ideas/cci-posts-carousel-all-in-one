// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
    IconKey
};
const pluginUrl = `/${wpPostsCarouselPluginData.pluginUrl}`;
// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'carousels',
    title: 'Carousels',
    type: 'group',
    children: [
        {
            id: 'carousels',
            title: 'Carousels',
            type: 'item',
            url: `${pluginUrl}&subpage=carousels`,
            icon: IconKey,
            breadcrumbs: false
        },
    ]
};

export default pages;
