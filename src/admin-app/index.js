import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './App';
import store from './store';

import './assets/scss/style.scss';

ReactDOM.render(
	<Provider store={ store }>
		<BrowserRouter basename="/wp-admin">
			<App { ...wpPostsCarouselPluginData } />
		</BrowserRouter>		
	</Provider>,
	document.getElementById( 'wp-posts-carousel-react-admin' )
);
