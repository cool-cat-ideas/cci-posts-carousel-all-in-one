<?php
/**
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * WP_Posts_Carousel_Init class
 */
class WP_Posts_Carousel_Init {

    /**
     * constructor
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_post_type' ), 5 );
        add_filter( 'post_updated_messages', array( $this, 'carousel_updated_messages' ) );
    }

    /**
     * register post type
     */
    public function register_post_type() {
        if ( post_type_exists('wp_posts_carousel') ) {
            return;
        }

        $carousel_cap = array(
            'edit_post'              => 'edit_wp_posts_carousel',
            'read_post'              => 'read_wp_posts_carousel',
            'delete_post'            => 'delete_wp_posts_carousel',
            'edit_posts'             => 'edit_wp_posts_carousels',
            'delete_posts'           => 'delete_wp_posts_carousels',
            'edit_others_posts'      => 'edit_others_wp_posts_carousels',
            'publish_posts'          => 'publish_wp_posts_carousels',
            'delete_published_posts' => 'delete_published_wp_posts_carousels',
            'read_private_posts'     => 'read_private_wp_posts_carousels',
            'create_posts'           => 'create_wp_posts_carousels',
            'manage_options'         => 'manage_wp_posts_carousel_options',
        );


	    // get the the role object
	    $admin_role = get_role( 'administrator' );
		// grant the unfiltered_html capability
	    foreach($carousel_cap as $cap) {
		    $admin_role->add_cap( $cap, true );
	    }

         register_post_type(
            'wp-posts-carousel',
            array(
                'labels'             => array(
                    'name'               => __( 'WP Posts Carousel', 'wp-posts-carousel' ),
                    'singular_name'      => __( 'Carousel', 'wp-posts-carousel' ),
                    'menu_name'          => __( 'WP Posts Carousel', 'wp-posts-carousel' ),
                    'name_admin_bar'     => __( 'Carousel', 'wp-posts-carousel' ),
                    'add_new'            => __( 'Add Carousel', 'wp-posts-carousel' ),
                    'add_new_item'       => __( 'Add new Carousel', 'wp-posts-carousel' ),
                    'new_item'           => __( 'New Carousel', 'wp-posts-carousel' ),
                    'edit_item'          => __( 'Edit Carousel', 'wp-posts-carousel' ),
                    'view_item'          => __( 'View ', 'wp-posts-carousel' ),
                    'all_items'          => __( 'WP Posts Carousel', 'wp-posts-carousel' ),
                    'search_items'       => __( 'Search Carousels', 'wp-posts-carousel' ),
                    'not_found'          => __( 'Not found any Carousels', 'wp-posts-carousel' ),
                    'not_found_in_trash' => __( 'Not found in trash', 'wp-posts-carousel' )
                ),
                'description'         => null,
                'public'              => false,
                'publicly_queryable'  => false,
                'exclude_from_search' => true,
                'show_ui'             => true,
                'show_in_menu'        => false,
                'show_in_nav_menus' => false,
                'show_in_admin_bar' => false,
                'query_var'           => 'wp-posts-carousel',
                'has_archive'         => false,
                'hierarchical'        => false,
                'rewrite'             => false,
                'menu_icon'           => 'dashicons-groups',
                'supports'            => array( 'title' ),
                '_builtin' =>  false,
                'capability_type'     => 'page',
                'capabilities'        => $carousel_cap,
            )
        );


    }

    /*
     * messages
     */
    public function carousel_updated_messages( $messages ) {
        global $post, $post_ID;

        $messages['wp-posts-carousel'] = array(
            0  => '',
            1  => __( 'Carousel updated.', 'wp-posts-carousel' ),
            2  => '',
            3  => '',
            4  => __( 'Carousel updated.', 'wp-posts-carousel' ),
            5  => isset( $_GET['revision'] ) ? sprintf( __( 'Carousel restored to revision from %s', 'wp-posts-carousel' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
            6  => __( 'Carousel published.', 'wp-posts-carousel' ),
            7  => __( 'Carousel saved.', 'wp-posts-carousel' ),
            8  => __( 'Carousel submitted.', 'wp-posts-carousel' ),
            9  => sprintf(
                __( 'Carousel scheduled for: <strong>%1$s</strong>.', 'wp-posts-carousel' ),
                date_i18n( __( 'M j, Y @ G:i' ), strtotime( $post->post_date ) )
            ),
            10 => __( 'Carousel draft updated.', 'wp-posts-carousel' )
        );

        return $messages;
    }
}

return new WP_Posts_Carousel_Init();
