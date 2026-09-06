import { createHooks } from './hooks';

const globalName = 'wpPostsCarousel';
const existing = window[ globalName ] || {};
const engines = existing.engines || {};
const renderers = existing.renderers || {};
const hooks = existing.hooks || createHooks();

function normalizeName( name ) {
	return String( name || '' )
		.toLowerCase()
		.replace( /[^a-z0-9_-]/g, '' );
}

function normalizeRenderer( renderer ) {
	if ( typeof renderer === 'function' ) {
		return {
			mount: renderer,
		};
	}

	return renderer && typeof renderer.mount === 'function' ? renderer : null;
}

const runtime = {
	...existing,
	engines,
	hooks,
	renderers,
	getEngine( name ) {
		return engines[ normalizeName( name ) ] || null;
	},
	getRenderer( name ) {
		return renderers[ normalizeName( name ) ] || null;
	},
	registerEngine( name, engine ) {
		const engineName = normalizeName( name );

		if ( ! engineName || ! engine ) {
			return;
		}

		engines[ engineName ] = {
			name: engineName,
			...engine,
		};
		hooks.doAction( 'engineRegistered', engineName, engines[ engineName ] );
	},
	registerRenderer( name, renderer ) {
		const rendererName = normalizeName( name );
		const normalized = normalizeRenderer( renderer );

		if ( ! rendererName || ! normalized ) {
			return;
		}

		renderers[ rendererName ] = normalized;
		hooks.doAction( 'rendererRegistered', rendererName, normalized );
	},
	mountRenderer( name, element, carousel ) {
		const renderer = runtime.getRenderer( name );

		if ( ! renderer ) {
			return false;
		}

		renderer.mount( element, carousel, runtime );
		hooks.doAction( 'rendererMounted', name, element, carousel );

		return true;
	},
};

window[ globalName ] = runtime;

export default runtime;
