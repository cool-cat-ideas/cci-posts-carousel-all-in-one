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
 * Wp_Posts_Carousel_Settings
 */
class WP_Posts_Carousel_Carousels {

    /**
     * constructor
     */
    public function __construct() {
        // save plugin's data
        add_action( 'save_post', array( $this, 'save_carousel' ) );
    }

    /**
     * manage carousels
     */
    public static function manage() {
        //include_once( 'class-admin-carousels-table.php' );
        //$table = new WP_Posts_Carousel_Table();

        include_once( 'views/html-carousels-page.php' );
    }

    /**
     * save carousel data
     */
    public function save_carousel( $post_ID ) {
        // verify if this is an auto save
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
            return;

        // check user credentals
        if ( ! current_user_can( 'edit_wp_posts_carousel', $post_ID ) ) {
            return;
        }

        // check if the user intended to change this value
        if ( ! isset( $_POST['wp_posts_carousel'] ) ) {
          return;
        }

        // check the post type
        if ( get_post_type( $post_ID ) !== 'wp-posts-carousel' ) {
            return;
        }

        $carousel_params = wp_json_encode( $_POST['wp_posts_carousel'] );

        // save
        update_post_meta( $post_ID, 'wp_posts_carousel', $carousel_params);
    }
}

return new WP_Posts_Carousel_Carousels();
