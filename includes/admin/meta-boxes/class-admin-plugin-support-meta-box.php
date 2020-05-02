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
class WP_Posts_Carousel_Plugin_Support_Meta_Box {

    /**
     * output the metabox
     */
    public static function output( ) {
        include( 'views/html-plugin-support-meta-box.php' );
    }
}