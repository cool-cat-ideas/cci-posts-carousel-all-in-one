<?php
/**
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 *
 */
class WP_Posts_Carousel_Plugin_Info_Meta_Box {

    /**
     * output the metabox
     */
    public static function output( ) {
		$new_version = "2.3.3";

	    if( $updates = get_site_transient('update_plugins') ) {
		    if( isset( $updates->response[WP_POSTS_CAROUSEL_BASENAME] ) ) {
			    $latest = $updates->response[WP_POSTS_CAROUSEL_BASENAME]->new_version;

			    if( version_compare( WP_POSTS_CAROUSEL_VERSION, $latest, '<' ) ) {
				    $new_version = $latest;
			    }
		    }
	    }

        include( 'views/html-plugin-info-meta-box.php' );
    }
}