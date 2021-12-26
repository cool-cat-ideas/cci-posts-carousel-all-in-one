<?php
/**
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * WP_Posts_Carousel_Admin class
 */
class WP_Posts_Carousel_Admin {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'includes' ) );


		add_action( 'admin_enqueue_scripts', array( $this, 'register_scripts' ), 99 );
		add_action( 'admin_head', array( $this, 'wp_head' ) );
	}

	public function includes() {
		include_once 'class-admin-meta-boxes.php';
		include_once 'class-admin-carousels.php';
		include_once 'class-admin-menu.php';
		include_once 'class-admin-editor.php';
	}

	/**
	 * Add the plugin url in the head tag
	 */
	public function wp_head() {
		echo '<script>var wp_posts_carousel_url="' . WP_POSTS_CAROUSEL_DIR_URL . '";</script>';
	}

	/**
	 * Register scripts and styles
	 */
	public function register_scripts() {
		// global $current_screen;
		global $WP_Posts_Carousel;

		// if ( ! in_array( $current_screen->id, array( 'toplevel_page_wp-posts-carousel', 'wp-posts-carousel' ) ) ) {
		// return;
		// }

		wp_register_script( 'wp-posts-carousel-js', WP_POSTS_CAROUSEL_DIR_URL . 'assets/js/wp-posts-carousel.js', array( 'jquery' ), '1.0.0', true );
		wp_localize_script(
			'wp-posts-carousel-js',
			'wp_posts_carousel',
			array(
				'error_detected'      => __( 'Error detected.', 'wp-posts-carousel' ),
				'fields_invalid'      => __( 'Please correct your form and try again', 'wp-posts-carousel' ),
				'templates_invalid'   => __( 'Please choose one of the available templates for this carousel', 'wp-posts-carousel' ),
				'breakpoints_invalid' => __( 'Please correct your breakpoints and try again', 'wp-posts-carousel' ),

				'shortcode_missing'   => __( 'Could not find the shortcode. Please try again', 'wp-posts-carousel' ),
				'shortcode_placed'    => __( 'Carousel shortcode has been placed', 'wp-posts-carousel' ),
				'hide_in'             => __( 'hide in', 'wp-posts-carousel' ),
			)
		);
		wp_enqueue_script( 'wp-posts-carousel-js' );

		wp_register_style( 'wp-posts-carousel-css', WP_POSTS_CAROUSEL_DIR_URL . 'assets/css/wp-posts-carousel.css' );
		wp_enqueue_style( 'wp-posts-carousel-css' );

		// include Font Awesome library from Bootstrap's CDN
	//	if ( property_exists( $WP_Posts_Carousel->settings, 'include_admin_font_awesome' ) && $WP_Posts_Carousel->settings['include_admin_font_awesome'] == 1 ) {
			wp_register_style( 'wp-font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css' );
			wp_enqueue_style( 'wp-font-awesome' );
		//}

		wp_register_script( 'wp-posts-carousel-js-react', WP_POSTS_CAROUSEL_DIR_URL . 'assets/js/admin.js', array( 'wp-i18n' ), '1.0.0', true );
		wp_localize_script(
			'wp-posts-carousel-js-react',
			'wpPostsCarouselPluginData',
			array(
				'pluginUrl' => 'admin.php?page=wp-posts-carousel',
				'permalinkStructure' => get_option('permalink_structure'),
				'nonce' => wp_create_nonce( 'wp_rest' )
			)
		);

		wp_enqueue_script( 'wp-posts-carousel-js-react' );

		wp_set_script_translations( 'wp-posts-carousel-js-react', 'wp-posts-carousel', WP_POSTS_CAROUSEL_DIR_PATH . 'languages' );
		do_action( 'wp_posts_carousel_in_admin_after_enqueue_scripts', array() );
	}
}

return new WP_Posts_Carousel_Admin();
