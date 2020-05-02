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
 * WP_Posts_Carousel_Integrations class
 */
class WP_Posts_Carousel_Integrations {

    protected $integrations = array();

    /**
     * constructor
     */
    public function __construct() {
        $this->includes();

        // load default integrations
        $defaults = $this->get_default_integrations();

        // load installed integrations
        $installed_integrations = array();

        // load integrations from API
        $others_integrations = array();
        if ( is_admin() ) {
            $others_integrations = $this->get_others_integrations();
        }

        // return integrations as objects list
        $this->integrations = array_merge( $defaults, $installed_integrations, $others_integrations );
    }

    /**
     *
     */
    public function includes() {
        include_once( 'class-integration.php' );
    }

    public function get_integrations() {
        return $this->integrations;
    }

    /**
     *
     */
    public function get_default_integrations() {
        $integrations = array();
        $directory = WP_POSTS_CAROUSEL_DIR_PATH . 'integrations';

        if ( is_dir( $directory ) ) {
            $folders = scandir( $directory );

            if ( count( $folders ) > 0 ) {
                if ( array_key_exists( 0, $folders ) ) {
                    unset( $folders[0] );
                }
                if ( array_key_exists( 1, $folders ) ) {
                    unset( $folders[1] );
                }

                foreach ( $folders as $folder ) {
                    $dir = $directory . '/' . $folder . '/' . $folder . '.php';

                    if ( file_exists( $dir ) ) {
                        $integration_obj = include_once ( $dir );

                        if ( is_object( $integration_obj ) && $integration_obj->integration_details ) {
                            $integrations = array_merge( $integrations, $integration_obj->integration_details );
                        }
                    }
                }
            }
        }

        return $integrations;
    }

    /**
     * get plugin's integrations from teastudio.pl API
     */
    public function get_others_integrations() {
        $integrations = array();

        if ( class_exists( 'WP_Posts_Carousel_API' ) ) {
            $api = new WP_Posts_Carousel_API();
            $api->get_integrations();
        }
        return $integrations;
    }





    // public static function render_integrations_list() {
    //     $WP_Posts_Carousel = WP_Posts_Carousel();
    //     $integrations_list = $WP_Posts_Carousel->integrations;

    //     $out = '';

    //     if ( empty( $integrations_list ) ) {
    //         $out .= '<div class="wp-posts-carousel-message wp-posts-carousel-message-eror">';
    //             $out .= '<p>';
    //                 $out .= __( "Ups, something is wrong, couldn't get the templates list.", 'wp-posts-carousel' );
    //             $out .= '</p>';
    //         $out .= '</div>';
    //     }

    //     $out .= '<ul id="wp-posts-carousel-templates">';
    //         if ( ! empty( $templates_list ) ) {
    //             foreach ( $templates_list as $name => $file_info) {
    //                 $out .= '<li>';
    //                     $out .= '<div class="wp-posts-carousel-template ' . ( $file_info['compatible'] === false ? 'wp-posts-carousel-template-warning' : null ) . '">';
    //                         $out .= '<div class="wp-posts-carousel-template-screenshot">';
    //                             $out .= '<img src="' . esc_attr( $file_info['screenshot'] ) . '" alt="' . __( 'Template screenshot', 'wp-posts-carousel' ) . '" />';
    //                         $out .= '</div>';

    //                         $out .= '<p class="wp-posts-carousel-template-details">';
    //                             $out .= __( 'Author' ) . ': ';
    //                             if ( $file_info['author_url'] != '' ) {
    //                                 $out .= '<a href="' . ( $file_info['author_url'] != '' ? $file_info['author_url'] : null ) . '" target="_blank">' . $file_info['author'] . '</a>';
    //                             } else {
    //                                 $out .= $file_info['author'];
    //                             }
    //                             $out .= ( $file_info['description'] != '' ? WP_Posts_Carousel_Utils::getTooltip( $file_info['description'] ) : null );
    //                         $out .= '</p>';

    //                         $out .= '<label for="template-' . esc_attr( $name ) . '">';
    //                             if ( $file_info['compatible']['status'] === true ) {
    //                                 $out .= '<input type="radio" name="wp_posts_carousel[template]" id="template-' . esc_attr( $name ) . '" value="' . esc_attr( $name ) . '" class="checkbox wp-posts-carousel-field" />';
    //                             }
    //                             $out .= esc_html( $file_info['template_name'] );

    //                             if ( $file_info['compatible']['status'] === true ) {
    //                                 $out .= WP_Posts_Carousel_Utils::getTooltip( $file_info['compatible']['error'], 'warning' );
    //                             }
    //                         $out .= '</label>';
    //                     $out .= '</div>';
    //                 $out .= '</li>';
    //             }
    //         }
    //         $out .= '<li class="promotion">';
    //             $out .= '<div class="wp-posts-carousel-template">';
    //                 $out .= '';
    //             $out .= '</div>';
    //         $out .= '</li>';
    //     $out .= '</ul>';

    //     return $out;
    // }
}
?>