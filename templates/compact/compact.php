<?php
/**
 * Plugin Name: Compact Template for WP Posts Carousel
 * Plugin URI: http://www.teastudio.pl/en/product/wp-posts-carousel/
 * Description: Free, compact template
 * Tags: carousel, posts carousel, wordpress carousel, wordpress owl carousel, owl carousel, wp posts carousel compact, compact theme, clean theme, flat theme
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * Version: 1.1.0
 * Requires WP Posts Carousel at least: 1.3.7
 * Requires at least: 4.1
 * Tested up to: 4.3
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

if ( ! class_exists( 'WP_Posts_Carousel_Compact_Template' ) ) :

/**
 * WP_Posts_Carousel_Compact_Template class
 */
class WP_Posts_Carousel_Compact_Template extends WP_Posts_Carousel_Template {

    /**
     * instance of this class
     */
    protected static $instance = null;

    /**
     * constructor
     */
    public function __construct() {
        $this->template_details = parent::set_template_details( __FILE__ );
    }

    /**
     * return an instance of this class
     */
    public static function get_instance() {
        // if the single instance hasn't been set, set it now
        if ( null == self::$instance ) {
            self::$instance = new self;
        }

        return self::$instance;
    }
}

return WP_Posts_Carousel_Compact_Template::get_instance();
endif;
