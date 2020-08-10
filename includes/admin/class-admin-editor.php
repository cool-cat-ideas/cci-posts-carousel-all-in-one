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
 * WP_Posts_Carousel_Editor class
 */
class WP_Posts_Carousel_Editor {

    /**
     * constructor
     */
    public function __construct() {
        // check user permissions
        if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
            return false;
        }

        add_action( 'media_buttons', array( $this, 'add_wp_posts_carousel_button' ), 11 );
        add_action( 'wp_ajax_wp_posts_carousel', array( $this, 'editor_carousels_page' ) );
    }

    /**
     * insert the button to editors
     */
    public function add_wp_posts_carousel_button() {
        $screen = get_current_screen();

        if( $screen->parent_base != 'gf_edit_forms' ) {
            echo '<a href="javascript:void(0);" class="button add_media wp-posts-carousel-editor-button"><span class="wp-posts-carousel-editor-button-icon"></span> Add Carousel</a>';
        }
    }

    /**
     * shortcode generator
     */
    public function editor_carousels_page() {
        include_once( 'class-admin-shortcodes-table.php' );
        $table = new WP_Posts_Carousel_Shortcodes_Table();
        include_once( 'views/html-editor-carousels-page.php' );
        exit;
    }
}

return new WP_Posts_Carousel_Editor();