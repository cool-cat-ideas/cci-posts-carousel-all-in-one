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
class WP_Posts_Carousel_Display_Meta_Box {

    /**
     * output the metabox
     */
    public static function output( ) {
        global $post;

        $carousel_default_params = WP_Posts_Carousel_Utils::get_carousel_default_params();
        $carousel_params = WP_Posts_Carousel_Utils::get_carousel_params( $post->ID );

        $data = array_replace( $carousel_default_params, $carousel_params );

        include( 'views/html-display-meta-box.php' );
    }
}
