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
 * WP_Posts_Carousel_Menu class
 */
class WP_Posts_Carousel_Menu {

    /**
     * constructor
     */
    public function __construct() {
        add_action( 'admin_menu', array( $this, 'admin_menu' ) );
        add_filter( 'parent_file', array( $this, 'parent_file' ) );
    }

    /**
     * add menu
     */
    public function admin_menu() {
        global $menu, $submenu;

//        if ( ! current_user_can( 'edit_wp_posts_carousels' ) ) {
//            return;
//        }

        add_menu_page(
            'WP Posts Carousel',
            'WP Posts Carousel',
            'edit_wp_posts_carousels',
            'wp-posts-carousel',
            array( 'WP_Posts_Carousel_Carousels', 'manage' )
        );


        add_submenu_page(
            'wp-posts-carousel',
            'Add Carousel',
            'Add Carousel',
            'edit_wp_posts_carousels',
            'post-new.php?post_type=wp-posts-carousel'
        );

        add_submenu_page(
            'wp-posts-carousel',
            __( 'Settings', 'wp-posts-carousel' ),
            __( 'Settings', 'wp-posts-carousel' ),
            'manage_wp_posts_carousel_options',
            'settings',
            array( 'WP_Posts_Carousel_Settings', 'manage_settings' )
        );

        add_submenu_page(
            'wp-posts-carousel',
            'WP Posts Carousel ' . __( 'Add-Ons', 'wp-posts-carousel' ),
            __( 'Add-ons', 'wp-posts-carousel' ),
            'manage_wp_posts_carousel_options',
            'templates',
            array( 'WP_Posts_Carousel_Templates', 'manage_templates' )
        );

    }

    /**
     * select menu
     */
    public function parent_file( $parent_file ) {
        global $submenu_file;

        if ($submenu_file == 'edit.php?post_type=wp-posts-carousel') {
           $submenu_file = 'wp-posts-carousel';
           $parent_file = 'wp-posts-carousel';
       }

        return $parent_file;
    }    
}

return new WP_Posts_Carousel_Menu();