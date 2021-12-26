import axios from 'axios';

const api = axios.create({
    headers: {
        'content-type': 'application/json',
        'X-WP-Nonce': wpPostsCarouselPluginData.nonce
    }
})

export default api;
