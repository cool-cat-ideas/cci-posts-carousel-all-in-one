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
 * Wp_Posts_Carousel_Settings class
 */
class WP_Posts_Carousel_Settings {
    public $settings = array();

    /**
     * constructor
     */
    public function __construct() {
        add_action( 'admin_init', array( $this, 'register_settings' ) );

        $this->set_settings();
    }

    /**
     * register settings
     */
    public function register_settings() {
        register_setting( 'wp-posts-carousel', 'wp-posts-carousel_settings' );
    }

    /**
     * get default settings
     */
    public function get_default_settings() {
        return array(
            'include_font_awesome'       => false,
            'include_admin_font_awesome' => false,
            'include_in_footer'          => false,
	        'is_debug_mode'              => false,
        );
    }

    /**
     * set settings
     */
    public function set_settings() {
        $this->settings = array_merge( $this->get_default_settings(), get_option( 'wp-posts-carousel_settings' ) ? get_option( 'wp-posts-carousel_settings' ) : array() );
    }

    /**
     * get settings
     */
    public function get_settings() {
        return $this->settings;
    }

    /**
     * manage settings
     */
    public static function manage_settings() {
        global $WP_Posts_Carousel;
        $settings = $WP_Posts_Carousel->settings;

	    $current_tab = in_array( isset( $_GET[ 'tab' ] ), array( 'general', 'support' ) ) ? sanitize_key( $_GET[ 'tab' ] ) : 'general';

        include_once( 'views/html-settings-page.php' );
    }
}
