import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './App';
import store from './store';

ReactDOM.render(
	<Provider store={ store }>
		<App { ...wpPostsCarouselPluginData } />
	</Provider>,
	document.getElementById( 'wp-posts-carousel-react-admin' )
);
