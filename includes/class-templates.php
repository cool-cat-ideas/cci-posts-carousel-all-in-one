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
 * WP_Posts_Carousel_Templates class
 */
class WP_Posts_Carousel_Templates {

    protected $templates = array();

    /**
     * constructor
     */
    public function __construct() {
        $this->includes();


    }

    /**
     *
     */
    public function includes() {
        include_once( 'class-template.php' );
    }

    public function get_templates() {
        // return templates as objects list
        $this->templates = $this->get_defaults_templates();;

        return $this->templates;
    }


    /**
     *
     */
    public function get_defaults_templates() {
        $templates = array();
        $directory = WP_POSTS_CAROUSEL_DIR_PATH . 'templates';

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
                        $template_obj = include_once ( $dir );
                        if ( $template_obj->template_details ) {
                            $templates = array_merge( $templates, $template_obj->template_details );
                        }
                    }
                }
            }
        }

        return $templates;
    }

    // /**
    //  * get plugin's templates from teastudio.pl API
    //  */
    // public function get_others_templates() {
    //     $templates = array();

    //     if ( class_exists( 'WP_Posts_Carousel_API' ) ) {
    //         $api = new WP_Posts_Carousel_API();
    //         $api->get_templates();
    //     }
    //     return $templates;
    // }
    
    public function add_template( $template_file ) {
        // $output = array(
        //     'status' => null,
        //     'error'  => null,
        // );

        if ( $template_file == false ) {
            $WP_Posts_Carousel_Template = new WP_Posts_Carousel_Template();

            $template_details = reset( $WP_Posts_Carousel_Template->set_template_details( $template_file ) );

            if ( array_key_exists( 'compatible', $template_details ) && $template_details['compatible']['status'] === true ) {
                array_merge( $this->templates, $template_details );
            }
            return $template_details['compatible'];              
        } 

        return array(
            'status' => true,
            'error'  => null
        );    
    }

    public function remove_template( $template ) {
        unset($this->templates[$template] );
    }

    /**
     *
     */
    public static function find_template123( $template_name ) {
        $output = array(
            'status'   => null,
            'error'    => null,
            'template' => null,
        );
        $template_name = str_replace('.css', '', $template_name);
        $current_template = null;

        if ( ! $template_name ) {
            return array(
                'status' => false,
                'error'  => sprintf( __( 'Template name is not valid: "%s"', 'wp-posts-carousel' ) , $template_name ),
            );
        }

        // check if template file exists
        $template_in = null;
        $plugin_template_dir = plugin_dir_path( __FILE__ ) . '../templates/' . $template_name . '/';
        $plugin_template_url = WP_POSTS_CAROUSEL_DIR_URL  . 'templates/' . $template_name . '/';


        $site_template_dir = get_stylesheet_directory() . 'css/wp-posts-carousel/' . $template_name . '/';
        $site_template_url = get_stylesheet_directory_uri() . 'css/wp-posts-carousel/' . $template_name . '/';


        if ( is_dir( $plugin_template_dir ) ) {
            if (  ! @ file_exists( $plugin_template_dir . $template_file ) ) {
                return array(
                    'status' => false,
                    'error'  => sprintf( __( 'The template file "%s" is missing in plugin folder', 'wp-posts-carousel' ) , $template_file ),
                );
            } else if (  ! @ file_exists( $plugin_template_dir . $template_stylesheet ) ) {
                return array(
                    'status' => false,
                    'error'  => sprintf( __( 'The template stylesheet "%s" is missing in plugin folder', 'wp-posts-carousel' ) , $template_stylesheet ),
                );
            }

            $template_in = 'plugin';

        } else if ( is_dir( $site_template_dir ) ) {
            if (  ! @ file_exists( $site_template_dir . self::$template_file ) ) {
                return array(
                    'status' => false,
                    'error'  => sprintf( __( 'The template file "%s" is missing in your themes folder', 'wp-posts-carousel' ) , self::$template_file ),
                );
            } else if (  ! @ file_exists( $site_template_dir . self::$template_stylesheet ) ) {
                return array(
                    'status' => false,
                    'error'  => sprintf( __( 'The template stylesheet "%s" is missing in your themes folder', 'wp-posts-carousel' ) , self::$template_stylesheet ),
                );
            }

            $template_in = 'theme';

        } else {
            return array(
                'status' => false,
                'error'  => sprintf( __( 'The template with the name "%s" is missing', 'wp-posts-carousel' ) , $template_name ),
            );
        }

        if ( $template_in != null ) {
            if ( $template_in === 'plugin' ) {
                $template_details = self::getTemplateInfo( $plugin_template_dir, $template_name );
            } else {
                $template_details = self::getTemplateInfo( $site_template_dir, $template_name );
            }

            if ( empty( $template_details ) ) {
                return array(
                    'status' => false,
                    'error'  => sprintf( __( 'Could not read the template info "%s"', 'wp-posts-carousel' ) , $template_name ),
                );
            }

        }

        if ( $template_details['compatible']['status'] === false ) {
            return array(
                'status' => false,
                'error'  => $template_details['compatible']['error'],
            );
        }

        if ( $template_in === 'plugin' ) {
            wp_enqueue_style( 'wp_posts_carousel-carousel-style-' . $template_name, $plugin_template_url . self::$template_stylesheet, true );
        } else if ( $template_in === 'theme' ) {
            wp_enqueue_style( 'wp_posts_carousel-carousel-style-' . $template_name, $site_template_url . self::$template_stylesheet , true );
        }

        return array(
            'status'   => true,
            'error'    => null,
            'template' => $template_details,
        );
    }



    public static function render_templates_list() {
        global $WP_Posts_Carousel;
        global $post;

        $carousel_params = WP_Posts_Carousel_Utils::get_carousel_params( $post->ID );
        $templates_list = $WP_Posts_Carousel->templates;
        $out = '';


        if ( empty( $templates_list ) ) {
            $out .= '<div class="wp-posts-carousel-message wp-posts-carousel-message-eror">';
                $out .= '<p>';
                    $out .= __( "Ups, something is wrong, couldn't get the templates list.", 'wp-posts-carousel' );
                $out .= '</p>';
            $out .= '</div>';
        }

        $out .= '<ul id="wp-posts-carousel-templates">';
            if ( ! empty( $templates_list ) ) {
                foreach ( $templates_list as $name => $file_info) {
                    $out .= '<li>';
                        $out .= '<div class="wp-posts-carousel-template ' . ( $file_info['compatible'] === false ? 'wp-posts-carousel-template-warning' : null ) . '">';
                            $out .= '<div class="wp-posts-carousel-template-screenshot">';
                                $out .= '<img src="' . esc_attr( $file_info['screenshot'] ) . '" alt="' . __( 'Template screenshot', 'wp-posts-carousel' ) . '" />';
                            $out .= '</div>';

                            $out .= '<p class="wp-posts-carousel-template-details">';
                                $out .= __( 'Author' ) . ': ';
                                if ( $file_info['author_url'] != '' ) {
                                    $out .= '<a href="' . ( $file_info['author_url'] != '' ? $file_info['author_url'] : null ) . '" target="_blank">' . $file_info['author'] . '</a>';
                                } else {
                                    $out .= $file_info['author'];
                                }
                                $out .= ( $file_info['description'] != '' ? WP_Posts_Carousel_Utils::get_tooltip( $file_info['description'] ) : null );
                            $out .= '</p>';

                            $out .= '<label for="template-' . esc_attr( $name ) . '">';
                                if ( $file_info['compatible']['status'] === true ) {
                                    $checked = ( array_key_exists( 'template', $carousel_params) && $carousel_params['template'] === esc_attr( $name ) ? 'checked="checked"' : null );
                                    $out .= '<input type="radio" name="wp_posts_carousel[template]" id="template-' . esc_attr( $name ) . '" value="' . esc_attr( $name ) . '" class="checkbox wp-posts-carousel-field" ' . $checked . ' />';
                                }
                                $out .= esc_html( $file_info['template_name'] );

                                if ( $file_info['compatible']['status'] === true ) {
                                    $out .= WP_Posts_Carousel_Utils::get_tooltip( $file_info['compatible']['error'], 'warning' );
                                }
                            $out .= '</label>';
                        $out .= '</div>';
                    $out .= '</li>';
                }
            }
            $out .= '<li class="promotion">';
                $out .= '<div class="wp-posts-carousel-template">';
                    $out .= '';
                $out .= '</div>';
            $out .= '</li>';
        $out .= '</ul>';

        return $out;
    }

    public static function find_template( $template_name ) {
        $template = array(
            'status' => false,
            'error'  => sprintf( __( 'Could not found the template: "%s"', 'wp-posts-carousel' ) , $template_name ),
        );

        global $WP_Posts_Carousel;
        $templates = $WP_Posts_Carousel->templates;

        $template_name = str_replace('.css', '', $template_name);

        if ( array_key_exists( $template_name, $templates) ) {
            $template = $templates[ $template_name ];
        }

        return $template;
    }
}
?>
