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
 * WP_Posts_Carousel_Utils class
 */
class WP_Posts_Carousel_Utils {

    /**
     * get defaults
     */
    public static function get_carousel_default_params() {
        $params = apply_filters( 'wp_posts_carousel_params_defaults', array(
            'template'            => 'default',
            'post_types'          => array( 'post' ),
            'order_by'            => 'id',
            'ordering'            => 'asc',
            'posts'               => '',
            'exclude'             => '',
            'categories'          => '',
            'relation'            => 'or',
            'tags'                => '',
            'all_items'           => 10,

            'show_title'          => true,
            'show_created_date'   => true,
            'show_description'    => 'excerpt',
            'allow_shortcodes'    => false,
            'show_category'       => true,
            'show_tags'           => false,
            'show_more_button'    => true,
            'show_featured_image' => true,
            'show_author'         => false,
            'image_source'        => 'thumbnail',
            'image_width'         => 100,
            'image_width_unit'    => '%',
            'image_height'        => 100,
            'image_height_unit'   => '%',

            'rtl'                 => false,
            'loop'                => true,
            'auto_play'           => true,
            'stop_on_hover'       => true,
            'auto_play_timeout'   => 1200,
            'auto_play_speed'     => 800,
            'nav'                 => true,
            'nav_speed'           => 800,
            'dots'                => true,
            'dots_speed'          => 800,
            'stage_padding'       => 0,
            'margin'              => 5,
            'lazy_load'           => false,
            'mouse_drag'          => true,
            'mouse_wheel'         => true,
            'touch_drag'          => true,
            'slide_by'            => 1,
            'easing'              => 'linear',
            'auto_width'          => false,
            'auto_height'         => true,
        ));

        $breakpoints = apply_filters( 'wp_posts_carousel_params_breakpoints', array(
            'items_to_show' => array(
                320  => 2,
                480  => 3,
                768  => 3,
                1024 => 4,
                1200 => 4,
            )
        ));

        return array_merge( $params, $breakpoints );
    }

    public static function get_taxonomies() {
        $array = get_post_types( array(
            'public'            => 'true',
            'show_in_nav_menus' => true
        ), 'objects' );

        return $array;
    }

    public static function get_orders_by() {
        $array = array(
            'id'     => __( 'By id', 'wp-posts-carousel' ),
            'title'  => __( 'By title', 'wp-posts-carousel' ),
            'newest' => __( 'Newest', 'wp-posts-carousel' ),
        );

        return apply_filters( 'wp_posts_carousel_post_criteria_meta_box_orders_by', $array );
    }

    public static function get_orderings() {
        $array = array(
            'asc'    => __( 'Ascending', 'wp-posts-carousel' ),
            'desc'   => __( 'Descending', 'wp-posts-carousel' ),
            'random' => __( 'Random', 'wp-posts-carousel' )
        );

        return apply_filters( 'wp_posts_carousel_post_criteria_meta_box_get_orderings', $array );
    }

    public static function get_descriptions() {
        $array = array(
            'false'   => __( 'No', 'wp-posts-carousel' ),
            'excerpt' => __( 'Excerpt', 'wp-posts-carousel' ),
            'content' => __( 'Full content', 'wp-posts-carousel' )
        );

        return apply_filters( 'wp_posts_carousel_display_meta_box_get_descriptions', $array );
    }

    public static function get_image_sources() {
        $array = array(
            'thumbnail' => __( 'Thumbnail', 'wp-posts-carousel' ),
            'medium'    => __( 'Medium', 'wp-posts-carousel' ),
            'large'     => __( 'Large', 'wp-posts-carousel' ),
            'full'      => __( 'Full', 'wp-posts-carousel' )
        );

        return apply_filters( 'wp_posts_carousel_display_meta_box_get_image_sources', $array );
    }

    public static function get_animations() {
        $array = array(
            'linear'           => 'linear',
            'swing'            => 'swing',
            'easeInQuad'       => 'easeInQuad',
            'easeOutQuad'      => 'easeOutQuad',
            'easeInOutQuad'    => 'easeInOutQuad',
            'easeInCubic'      => 'easeInCubic',
            'easeOutCubic'     => 'easeOutCubic',
            'easeInOutCubic'   => 'easeInOutCubic',
            'easeInQuart'      => 'easeInQuart',
            'easeOutQuart'     => 'easeOutQuart',
            'easeInOutQuart'   => 'easeInOutQuart',
            'easeInQuint'      => 'easeInQuint',
            'easeOutQuint'     => 'easeOutQuint',
            'easeInOutQuint'   => 'easeInOutQuint',
            'easeInExpo'       => 'easeInExpo',
            'easeOutExpo'      => 'easeOutExpo',
            'easeInOutExpo'    => 'easeInOutExpo',
            'easeInSine'       => 'easeInSine',
            'easeOutSine'      => 'easeOutSine',
            'easeInOutSine'    => 'easeInOutSine',
            'easeInCirc'       => 'easeInCirc',
            'easeOutCirc'      => 'easeOutCirc',
            'easeInOutCirc'    => 'easeInOutCirc',
            'easeInElastic'    => 'easeInElastic',
            'easeOutElastic'   => 'easeOutElastic',
            'easeInOutElastic' => 'easeInOutElastic',
            'easeInBack'       => 'easeInBack',
            'easeOutBack'      => 'easeOutBack',
            'easeInOutBack'    => 'easeInOutBack',
            'easeInBounce'     => 'easeInBounce',
            'easeOutBounce'    => 'easeOutBounce',
            'easeInOutBounce'  => 'easeInOutBounce'
        );

        return apply_filters( 'wp_posts_carousel_carousel_meta_box_get_animations', $array );
    }

    public static function get_relations() {
        return array(
            'and' => __( 'And', 'wp-posts-carousel' ),
            'or'  => __( 'Or', 'wp-posts-carousel' ),
        );
    }

    public static function get_units() {
        return array(
            '%'  => '%',
            'px' => 'px'
        );
    }

    public static function get_tooltip( $text = null, $type = 'help' ) {
        if( $text == null ) {
            return null;
        }

        if ( in_array( $type, array( 'help', 'warning' ) ) ) {
            switch ( $type ) {
                case 'warning':
                    $type = 'warning';
                    break;
                case 'help':
                default:
                    $type = 'editor-help';
                    break;
            }
        }
        return '<a href="" title="' . esc_html( $text ) . '" class="wp-posts-carousel-tooltip tooltip-' . esc_html( $type ) . '"><span class="dashicons dashicons-' . esc_attr( $type ) . '" title="' . __( 'Hint', 'wp-posts-carousel' ) . '"></span></a>';
    }

    public static function get_tip( $text = null, $type = 'help' ) {
        if( $text == null || ! in_array( $type, array( 'help', 'warning' ) ) ) {
            return null;
        }
        return '<p class="wp-posts-carousel-tip tip-' . esc_html( $type ) . '">' . $text . '</p>';
    }

    public static function parse_breakpoints( $params ) {
        if ( ! $params) {
            return null;
        }
        $out = '';
        $plugin_options = get_option( 'wp-posts-carousel_options' );
        $breakpoints = array();
        $default_breakpoints = '320:{items:2},480:{items:3},768:{items:3},1024:{items:4},1200:{items:4}';

        if ( array_key_exists( 'items_to_show', $params ) ) {
            if ( is_string( $params['items_to_show'] ) && $params['items_to_show'] !== '' ) {
                $data = explode( ',', $params['items_to_show'] );
                foreach ( $data as $points ) {
                    preg_match( '/(\d+):(\d+)/', $points, $matches);

                    if ( array_key_exists( 1, $matches ) && array_key_exists( 2, $matches ) ) {
                        $breakpoints[$matches[1]] = $matches[2];
                    }
                }
            } else if ( is_array( $params['items_to_show'] ) && ! empty( $params['items_to_show'] ) ) {
                $breakpoints = $params['items_to_show'];
            }

            ksort($breakpoints);

            if ( count( $breakpoints ) > 0 ) {
                foreach ( $breakpoints as $width => $items ) {
                    if ( intval( $width ) > 0 && intval( $items ) > 0 ) {
                        $out .= ',' . intval( $width ) . ':{items:' . intval( $items ) . '}';
                    }
                }
            }
        }

        if ( $out !== '') {
            return $out;
        } else {
            return $default_breakpoints;
        }
    }

    public static function get_breakpoints( ) {
        $breakpoints = array();
        $defaults = self::get_carousel_default_params();

        $items_to_show = $defaults['items_to_show'];

        if ( ! empty( $items_to_show ) ) {
            ksort( $items_to_show);

            foreach( $items_to_show as $width => $items ) {
                if ( $width < 768 ) {
                    $breakpoints['mobile'][$width] = $items;
                } else if ( $width < 1024 ) {
                    $breakpoints['tablet'][$width] = $items;
                } else {
                    $breakpoints['laptop'][$width] = $items;
                }
            }
        }
        return $breakpoints;
    }

    public static function get_carousels() {
        // query args
        $args = array(
            'post_type'           => 'wp-posts-carousel',
            'ignore_sticky_posts' => true,
            'orderby'             => 'id',
            'order'               => 'desc',
            'post_status'         => array( 'publish' ),
        );

        $args = apply_filters( 'wp_posts_carousel_carousels_in_admin_query', $args );

        // get the result
        $result = new WP_Query( $args );
        return $result->posts;
    }

    /**
     * get carousel
     */
    public static function get_carousel( $id ) {
        if ( ! $id ) {
            return null;
        }

        // query args
        $args = array(
            'post_type'           => 'wp-posts-carousel',
            'ignore_sticky_posts' => true,
            'orderby'             => 'id',
            'order'               => 'desc',
            'post_status'         => array( 'publish' ),
            'p'                   => $id,
        );

        // get the result
        $result = new WP_Query( $args );

        if ( $result->found_posts === 1 ) {
            return reset($result->posts);
        } else {
            return null;
        }
    }

    /**
     * get carousel params
     */
    public static function get_carousel_params( $id ) {
        $carousel_params = array();

        if ( ! $id ) {
            return $carousel_params;
        }

        $post_meta = get_post_meta( $id, 'wp_posts_carousel' );

        if ( ! empty( $post_meta ) && array_key_exists( 0, $post_meta) ) {
            $carousel_params = (array) json_decode( $post_meta[0] );
        }

        return $carousel_params;
    }

    /**
     * debug message
     */
    public static function debug_message( $msg, $is_comment = false ) {
    	$out = null;

    	if ( $is_comment == true ) {
    		$out .= "\r\n";
		    $out .= "/**\r\n";
		    $out .= "*\r\n";
		    $out .= "* WP Posts Carousel DEBUG MESSAGE\r\n";
		    $out .= "* version: ". WP_POSTS_CAROUSEL_VERSION . "\r\n";
		    $out .= "* message: ". $msg . "\r\n";
		    $out .= "*\r\n";
		    $out .= "*/\r\n";
	    }

    	return $out;

    }
}
