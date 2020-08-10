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
 * WP_Posts_Carousel_Meta_Boxes class
 */
class WP_Posts_Carousel_Meta_Boxes {

    /**
     * constructor
     */
    public function __construct() {
        // include
        $this->includes();

        // reset postions
        add_action( 'add_meta_boxes', array( $this, 'reset_positions' ), 10 );

        // remove all meta boxes / saved order
        add_action( 'add_meta_boxes',  array( $this, 'remove_meta_boxes' ), 20 );

        // add plugin's meta boxes
        add_action( 'add_meta_boxes', array( $this, 'register_meta_boxes' ), 30 );
    }

    public function includes() {
        include_once( WP_POSTS_CAROUSEL_DIR_PATH . 'includes/admin/meta-boxes/class-admin-plugin-info-meta-box.php' );
        include_once( WP_POSTS_CAROUSEL_DIR_PATH . 'includes/admin/meta-boxes/class-admin-plugin-support-meta-box.php' );
    }

    /**
     * reset postions
     */
    public function reset_positions() {
        global $wpdb, $current_screen;

        if ( $current_screen->post_type !== 'wp-posts-carousel' ) {
            return;
        }

        $query = $wpdb->prepare( 'DELETE FROM ' . $wpdb->usermeta . ' WHERE meta_key LIKE %s AND user_id = %d', '%_wp-posts-carousel', get_current_user_id() );
        $wpdb->query( $query );
    }

    /**
     * register meta boxes
     */
    public function register_meta_boxes() {
        global $current_screen;

        if ( $current_screen->post_type !== 'wp-posts-carousel' ) {
            return;
        }

        include_once( WP_POSTS_CAROUSEL_DIR_PATH . 'includes/admin/meta-boxes/class-admin-post-criteria-meta-box.php' );
        add_meta_box( 'wp-posts-carousel-post-criteria-meta-box', __( 'Post Selection Criteria', 'wp-posts-carousel' ),  'WP_Posts_Carousel_Post_Criteria_Meta_Box::output', 'wp-posts-carousel', 'normal' );

        include_once( WP_POSTS_CAROUSEL_DIR_PATH . 'includes/admin/meta-boxes/class-admin-display-meta-box.php' );
        add_meta_box( 'wp-posts-carousel-display-meta-box', __( 'Display options', 'wp-posts-carousel' ),  'WP_Posts_Carousel_Display_Meta_Box::output', 'wp-posts-carousel', 'normal' );

        include_once( WP_POSTS_CAROUSEL_DIR_PATH . 'includes/admin/meta-boxes/class-admin-carousel-meta-box.php' );
        add_meta_box( 'wp-posts-carousel-carousel-meta-box', __( 'Carousel options', 'wp-posts-carousel' ),  'WP_Posts_Carousel_Carousel_Meta_Box::output', 'wp-posts-carousel', 'normal' );


        add_meta_box( 'wp-posts-carousel-plugin-support-meta-box', 'Support',  'WP_Posts_Carousel_Plugin_Support_Meta_Box::output', 'wp-posts-carousel', 'side' );
    }

    /**
     * remove all meta boxes but save ordering
     */
    public function remove_meta_boxes() {
        global $wp_meta_boxes, $current_screen;

        if ( $current_screen->post_type !== 'wp-posts-carousel' ) {
            return;
        }

        $type = 'wp-posts-carousel';

        foreach ( $wp_meta_boxes[$type] as $position => $position_boxes ) {
            if ( ! empty ($position_boxes)) {
                foreach( $position_boxes as $priority => $priority_boxes ) {
                    if ( ! empty ($priority_boxes)) {
                        foreach( $priority_boxes as $name => $box ) {
                            if ( strpos( $name, 'wp-posts-carousel-' ) !== false || strpos( $name, 'submitdiv' ) !== false ) {
                                $boxes[$type][$position][$priority][$name] = $box;
                            }
                        }
                    }
                }
            }
        }

        $wp_meta_boxes = $boxes;
        return;
    }

}

return new WP_Posts_Carousel_Meta_Boxes();