const element = window.wp && window.wp.element ? window.wp.element : {};

export default element;

export const createPortal = element.createPortal;
export const createRoot = element.createRoot;
export const flushSync = element.flushSync;
export const render = element.render;
export const unmountComponentAtNode = element.unmountComponentAtNode;
