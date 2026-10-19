const owlEngine = {
  label: 'Owl Carousel',
  supportsReactRenderer: false,
  available() {
    return Boolean(window.jQuery?.fn?.owlCarousel);
  },
};

export default owlEngine;
