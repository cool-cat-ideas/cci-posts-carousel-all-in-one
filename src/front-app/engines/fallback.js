const fallbackEngine = {
	label: 'Fallback React',
	supportsReactRenderer: true,
	available() {
		return true;
	},
};

export default fallbackEngine;
