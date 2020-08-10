<?php
/**
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * WP_Posts_Carousel_Admin class
 */
class WP_Posts_Carousel_Frontend
{

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('init', array( $this, 'includes' ));

        add_action('enqueue_scripts', array( $this, 'enqueue_scripts' ), 99);
    }

    public function includes()
    {
        include_once('class-carousel-generator.php');
        include_once('class-shortcode-decode.php');
    }

    /**
     * enqueue scripts and styles
     */
    public function enqueue_scripts()
    {
        global $WP_Posts_Carousel;

        $include_in_footer = array_key_exists('include_in_footer', $this->settings) ? true  : false;

        wp_register_script('owl.carousel', WP_POSTS_CAROUSEL_DIR_URL . 'libaries/owl.carousel/owl.carousel.min.js', array( 'jquery' ), '2.1.4', $include_in_footer);
        wp_register_script('jquery-mousewheel', WP_POSTS_CAROUSEL_DIR_URL . 'libraries/owl.carousel/jquery.mousewheel.min.js', array( 'jquery' ), '3.1.12', $include_in_footer);
        wp_register_style('owl.carousel.style', WP_POSTS_CAROUSEL_DIR_URL . 'libraries/owl.carousel/assets/owl.carousel.min.css');

        wp_enqueue_script('jquery-effects-core');
        wp_enqueue_script('owl.carousel');
        wp_enqueue_script('jquery-mousewheel');
        wp_enqueue_style('owl.carousel.style');

        /*
         * include Font Awesome library from Bootstrap CDN
         */
        if (array_key_exists('include_font_awesome', $this->settings) && $this->settings['include_font_awesome'] == 1) {
            wp_enqueue_style('wp-font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');
        }

        do_action('wp_posts_carousel_after_enqueue_scripts', array());
    }
}

return new WP_Posts_Carousel_Frontend();
