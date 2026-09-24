import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import NewsPanel from '../../../src/admin-v2/components/NewsPanel';
import { pluginData } from '../../../src/admin-v2/api';
import { useMarketplaceJson } from '../../../src/admin-v2/marketplace';

function FeedState() {
    const feed = useMarketplaceJson(pluginData.newsEndpoint);
    useEffect(() => {
        window.marketplaceState = {
            loading: feed.loading,
            retrying: feed.retrying,
            error: feed.error,
        };
    }, [feed.loading, feed.retrying, feed.error]);
    return null;
}

const root = createRoot(document.getElementById('root'));
window.unmountMarketplace = () => root.unmount();
root.render(<><FeedState /><NewsPanel /></>);
