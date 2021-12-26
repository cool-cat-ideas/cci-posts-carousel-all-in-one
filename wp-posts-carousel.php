<?php
/**
 * Plugin Name: Wp Posts Carousel
 * Plugin URI: http://www.teastudio.pl/en/product/wp-posts-carousel/
 * Description: WP Posts Carousel is a widget and a shortcode generator to displays posts in carousel by <a href="http://www.owlcarousel.owlgraphic.com/" target="_blank" title="OWL Carousel homepage">OWL Carousel</a>.
 * Version: 1.3.7
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Text Domain: wp-posts-carousel
 * Domain Path: /i18n/languages/
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/*
 * load i18n
 */
// add_action( 'init', 'wp_posts_carousel_init' );
// function wp_posts_carousel_init() {
// load_plugin_textdomain( 'wp-posts-carousel', false, dirname( plugin_basename( __FILE__ ) ) . '/i18n/languages/' );
// _e('read more', 'wp-posts-carousel');
// }

/**
 * Wp_Posts_Carousel class
 */
class WP_Posts_Carousel {
	public $version      = '1.3.7';
	public $settings     = array();
	public $templates    = array();
	public $integrations = array();

	/**
	 * constructor
	 */
	public function __construct() {
		$this->define_constants();
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * constants
	 */
	private function define_constants() {
		$this->define( 'WP_POSTS_CAROUSEL_FILE', __FILE__ );
		$this->define( 'WP_POSTS_CAROUSEL_BASENAME', plugin_basename( __FILE__ ) );
		$this->define( 'WP_POSTS_CAROUSEL_DIR_URL', plugin_dir_url( __FILE__ ) );
		$this->define( 'WP_POSTS_CAROUSEL_DIR_PATH', plugin_dir_path( __FILE__ ) );
		$this->define( 'WP_POSTS_CAROUSEL_VERSION', $this->version );
	}

	/**
	 * define constant
	 */
	private function define( $name, $value ) {
		if ( ! defined( $name ) ) {
			define( $name, $value );
		}
	}

	/**
	 * include files
	 */
	public function includes() {
		include_once 'includes/class-init.php';
		include_once 'includes/class-utils.php';
		include_once 'includes/class-api.php';
		include_once 'includes/class-widget.php';

		include_once 'includes/class-templates.php';
		// $WP_Posts_Carousel_Templates = new WP_Posts_Carousel_Templates();
		// $this->templates             = $WP_Posts_Carousel_Templates->get_templates();

		include_once 'includes/class-integrations.php';
		// $WP_Posts_Carousel_Integrations = new WP_Posts_Carousel_Integrations();
		// $this->integrations             = $WP_Posts_Carousel_Integrations->get_integrations();

		include_once 'includes/admin/class-admin-settings.php';
		$WP_Posts_Carousel_Settings = new WP_Posts_Carousel_Settings();
		// $this->settings = $WP_Posts_Carousel_Settings->get_settings();

		// $is_debug_mode = array_key_exists( 'debug', $this->settings ) ? true : false;
		// $this->define( 'WP_POSTS_CAROUSEL_DEBUG', $is_debug_mode );

		if ( is_admin() ) {
			include_once 'includes/admin/class-admin.php';
		} else {
			include_once 'includes/frontend/class-frontend.php';
		}
	}

	/**
	 * init hooks
	 */
	private function init_hooks() {
		add_action( 'init', array( $this, 'init' ), 0 );

		if ( is_admin() ) {

			// Add the options page and menu item.
			//add_action( 'admin_menu', array( $this, 'add_plugin_admin_menu' ) );

			// Add plugin action link point to settings page
			//add_filter( 'plugin_action_links_wp-posts-carousel', array( $this, 'add_action_links' ) );
			/*
			 * clear settings
			 */
			register_deactivation_hook( __FILE__, array( $this, 'deactivation' ) );
		}
	}

	/**
	 * deactivate the plugin
	 */
	public function deactivation() {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}
		delete_option( 'wp-posts-carousel_options' );
	}

	/**
	 * init
	 */
	public function init() {
		// i18n
		$this->load_plugin_textdomain();

		// settings
		 $this->settings = new Wp_Posts_Carousel_Settings();
	}

	/**
	 * load Localisation files.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( 'wp-posts-carousel', false, 'wp-posts-carousel/languages/' );
	}

}



function WP_Posts_Carousel() {
	global $WP_Posts_Carousel;

	if ( ! isset( $WP_Posts_Carousel ) ) {
		$WP_Posts_Carousel = new WP_Posts_Carousel();
	}

	return $WP_Posts_Carousel;
}
WP_Posts_Carousel();
