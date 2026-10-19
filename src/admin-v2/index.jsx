import React from 'react';
import App from './app/App';
import { TooltipProvider } from './components/ui/tooltip';
import './styles/tailwind.css';

const container = document.getElementById('wp-posts-carousel-admin-v2');
const wpElement = window.wp && window.wp.element ? window.wp.element : {};
const root = (
  <TooltipProvider>
    <App />
  </TooltipProvider>
);

if (container && wpElement.createRoot) {
  wpElement.createRoot(container).render(root);
} else if (container && wpElement.render) {
  wpElement.render(root, container);
}
