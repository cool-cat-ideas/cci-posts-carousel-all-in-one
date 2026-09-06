import { pluginData } from './api';

export const __ = window.wp?.i18n?.__ || ( ( text ) => text );

export function coreString( key, fallback ) {
	return pluginData.i18n?.[ key ] || __( fallback );
}
