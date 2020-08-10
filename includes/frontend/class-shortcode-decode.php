<?php
/*
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class Wp_Posts_Carousel_Shortcode_Decode {
    private static $index = 0;

    public static function initialize( $atts, $content = null, $code = '' ) {
        self::$index++;

        $generator = new Wp_Posts_Carousel_Generator();
        return $generator->generate( $atts, self::$index );
    }
}
add_shortcode( 'wp_posts_carousel', array( 'Wp_Posts_Carousel_Shortcode_Decode', 'initialize' ) );
?>
