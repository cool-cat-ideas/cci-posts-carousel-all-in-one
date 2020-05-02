<?php
/*
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class Wp_Posts_Carousel_Generator {
    private $old_shortcode_version = false;
    private $carousel = null;
    private $carousel_id = null;
    private $carousel_params = null;

    private $template = '';
    private $post = null;
    private $post_title = '';
    private $post_date = '';
    private $post_image = '';
    private $post_description = '';
    private $post_tags = '';
    private $post_category = '';
    private $post_author = '';
    private $post_buttons = '';

    /**
     * generate carousel id
     */
    private function generate_id( $atts, $index ) {
        if ( $this->old_shortcode_version === true ) {
            $id = md5( uniqid( rand(), true) );
        } else {
            $id = $atts['id'];
        }
        return 'wp-posts-carousel_' . $id . '-' . $index;
    }

    /**
     * generate carousel
     */
    public function generate( $atts, $index ) {
        /**
         * detect version of shortcode
         */
        if ( ! array_key_exists( 'id', $atts ) ) {
            $this->old_shortcode_version = true;
        } else {
            /**
             * get the new carousel settings
             */
            $this->carousel = WP_Posts_Carousel_Utils::get_carousel( $atts['id'] );
            if ( $this->carousel !== null ) {
                $this->carousel_params = json_decode( get_post_meta( $this->carousel->ID, "wp_posts_carousel", true ), true );

                if ( ! $this->carousel_params ) {
                    return false;
                }
            } else {
                return false;
            }
        }


        /**
         * set carousel id
         */
        $this->carousel_id = $this->generate_id( $atts, $index );

        /**
         * prepare params
         */
        $this->carousel_params = $this->prepare_params( $atts );

        /*
         * template
         */

        $template_name = strtolower( $this->carousel_params['template'] );
        $this->template = WP_Posts_Carousel_Templates::find_template( $template_name );

        if ( array_key_exists( 'status', $this->template ) && $this->template['status'] === false ) {
            return '<div class="error"><p>' . $this->template['error'] . '</p></div>';
        } else if ( $this->template['compatible']['status'] === false ) {
            return '<div class="error"><p>' . $this->template['compatible']['error'] . '</p></div>';
        }


        /*
         * prepare html and the loop
         */
        $out = '<div id="wp-posts-carousel-' . $this->carousel_params['id'] . '" class="' . $this->template['name'] . '-theme wp-posts-carousel owl-carousel">';


        /*
         * post types
         */
        if ( ! is_array( $this->carousel_params['post_types'] ) ) {
            $post_types = explode( ',', $this->carousel_params['post_types'] );
        } else {
            $post_types = $this->carousel_params['post_types'];
        }

        /*
         * prepare sql query
         */
        $query_args = array(
            'post_type'      => $post_types,
            'post_status'    => 'publish',
            'posts_per_page' => $this->carousel_params['all_items'],
            'no_found_rows'  => 1
        );

        $sql_i = 0;

        /*
         * include posts
         */
        if ( $this->carousel_params['posts'] != '' ) {
            $query_args['post__in'] = explode( ',', $this->carousel_params['posts'] );
        }
        /*
         * excelude posts
         */
        if ( $this->carousel_params['exclude'] != "") {
            $query_args['post_not_in'] = explode( ',', $this->carousel_params['exclude'] );
        }

        if ( $this->carousel_params['categories'] != "" || $this->carousel_params['tags'] != "" ) {
            $query_args['tax_query'] = array( 'relation' => strtoupper( $this->carousel_params['relation'] ), array() );

            foreach ( $post_types as $post_type ) {
                if ( $taxonomies = get_object_taxonomies($post_type, 'objects') ) {
                    foreach( $taxonomies as $taxonomy ) {
                        if ( $this->carousel_params['categories'] != "" && ( preg_match( '/category/', $taxonomy->name ) || preg_match( '/\_cat\b/i', $taxonomy->name ) || preg_match( '/\-cat\b/i', $taxonomy->name ) ) ) {
                            $query_args['tax_query'][$sql_i++] = array(
                                'taxonomy' => $taxonomy->name,
                                'field'    => 'id',
                                'terms'    => explode( ',', $this->carousel_params['categories'] ) ,
                                'operator' => 'IN'
                            );
                        }
                        if ( $this->carousel_params['tags'] != '' && preg_match( '/tag/', $taxonomy->name) ) {
                            $query_args['tax_query'][$sql_i++] = array(
                            'taxonomy' => $taxonomy->name,
                            'field'    => 'name',
                            'terms'    => explode( ',', $this->carousel_params['tags'] ) ,
                            'operator' => 'IN'
                            );
                        }
                    }
                }
            }
        }

        if ( $this->carousel_params['posts'] != "" ) {
            $query_args['orderby'] = 'ID';
        } else {
            switch ( $this->carousel_params['order_by'] ) {
                case "id":
                    $query_args['orderby'] = 'ID';
                    break;

                case "newest":
                    $query_args['orderby'] = 'post_date';
                    break;

                case "title":
                default:
                    $query_args['orderby'] = 'post_title';
                    break;
            }
        }

        if ( in_array( $this->carousel_params['ordering'], array( 'asc','desc' ) ) ) {
            $query_args['order'] = $this->carousel_params['ordering'];
        } else {
            $query_args['order'] = 'desc';
        }

        /*
         * end sql query
         */

        /*
         * display popular posts from Wordrpess Popular Posts
         * default period: 1 MONTH from now
         */
        include_once ( ABSPATH . 'wp-admin/includes/plugin.php' );
        if ( $this->carousel_params['order_by'] == 'popular' && is_plugin_active( 'wordpress-popular-posts/wordpress-popular-posts.php' ) ) {
            /*
             * include custom queries
             */
            require_once ( 'includes/wp-posts-carousel-popular-posts-query.class.php' );
            $loop = new WP_Posts_Carousel_Popular_Posts_Query( apply_filters( 'wp_posts_carousel_query', $query_args, array(
                    'params' => $this->carousel_params,
                ) ),
	            $this->carousel_params
            );
        } else {
            $loop = new WP_Query( apply_filters( 'wp_posts_carousel_query', $query_args, array(
                'params' => $this->carousel_params,
            ) ) );
        }

        /*
         * if random, we shuffle array
         */
        if ( $this->carousel_params['ordering'] == 'random' ) {
            shuffle( $loop->posts );
        }

        /*
         * check if there are more then one item
         */
        $this->carousel_params['post_count'] = $loop->post_count;
        if ( ! $this->carousel_params['post_count'] > 1 ) {
            return false;
        }

        /*
         * products loop
         */
        global $post;

        while ( $loop->have_posts() ) {
            $loop->the_post();

            $this->post = $post;
            $this->post_url = get_permalink( $post->ID );
            $this->title = '';
            $this->featured_image = '';
            $this->description = '';
            $this->tags = '';
            $this->created_date = '';
            $this->author = '';
            $this->categories = '';
            $this->buttons = '';

            $post_type = get_post_type( $this->post );
            $post_type_category = 'category';
            $post_type_tag = 'post_tag';
            if ( $taxonomies = get_object_taxonomies( $post_type, 'objects' ) ) {
                foreach( $taxonomies as $taxonomy ) {
                    if ( preg_match( '/category/', $taxonomy->name ) || preg_match( '/\b_cat\b/i', $taxonomy->name ) || preg_match( '/\b-cat\b/i', $taxonomy->name ) ) {
                        $post_type_category = $taxonomy->name;
                    } else if ( preg_match( '/tag/', $taxonomy->name ) ) {
                        $post_type_tag = $taxonomy->name;
                    }
                }
            }

            $this->image = wp_get_attachment_image_src( get_post_thumbnail_id( $this->post->ID ) , $this->carousel_params['image_source'] );

            /*
             * if no featured image for the product
            */
            if ( $this->image[0] === '' || $this->image[0] === '/' ) {
                $this->image[0] = apply_filters( 'wp_posts_carousel_item_featured_image_placeholder', plugin_dir_url( __FILE__ ) . 'images/placeholder.png' );
            }

            /*
             * show featured image
             */
            if ( $this->carousel_params['show_featured_image'] === 'true' ) {
                $data_src = 'src="' . $this->image[0] . '"';
                $image_class = null;

                if ( $this->carousel_params['lazy_load'] === 'true' ) {
                    $data_src = 'data-src="' . $this->image[0] . '" data-src-retina="' . $this->image[0] . '"';
                    $image_class = 'class="owl-lazy"';
                }

                $featured_image = '<a href="' . $this->post_url . '" title="' . __( 'Read more about', 'wp-posts-carousel' ) . ' ' . $this->post->post_title . '">';
                    $featured_image .= '<img alt="' . $this->post->post_title . '" style="max-width:' . $this->carousel_params['image_width'] . ( $this->carousel_params['image_width_unit'] !== '' ? $this->carousel_params['image_width_unit'] : '%' ) . ';height:' . $this->carousel_params['image_height'] . ( $this->carousel_params['image_height_unit'] !== '' ? $this->carousel_params['image_height_unit'] : '%' ) . ';" ' . $data_src . $image_class . '>';
                $featured_image .= '</a>';

                $this->featured_image = $featured_image;
            }

            /*
             * show title
             */
            if ( $this->carousel_params['show_title'] === 'true' ) {
                $this->title .= '<a href="' . $this->post_url . '" title="' . __( 'Read more about', 'wp-posts-carousel' ) . ' ' . $this->post->post_title . '">' . $this->post->post_title . '</a>';
            }

            /*
             * show category
             */
            $this->categories_list = array();
            if ( $this->carousel_params['show_category'] === 'true' ) {
                $this->categories_list = get_the_terms( $this->post->ID, $post_type_category );

                if ( count( $this->categories_list) > 0 ) {
                    foreach ( $this->categories_list as $cat ) {
                        $this->categories .= '<a href="' . get_category_link( $cat->term_id ) . '" title="' . esc_attr( sprintf( __( 'View all items in %s', 'wp-posts-carousel' ) , $cat->name ) ) . '">' . $cat->name . '</a>';
                        if ( count( $this->categories_list) > 1 ) {
                            $this->categories .= '<span>, </span>';
                        }
                    }
                    if ( count( $this->categories_list) > 1 ) {
                        $this->categories = substr( $this->categories, 0, -15 );
                    }
                }
            }

            /*
             * show tags
             */
            $this->tags_list = array();
            if ( $this->carousel_params['show_tags'] === 'true' ) {
                $this->tags_list = get_the_term_list( $this->post->ID , $post_type_tag, '', ' ', '' );
                $this->tags = $this->tags_list;
            }

            /*
             * show created date
             */
            if ( $this->carousel_params['show_created_date'] === 'true' ) {
                $this->created_date = get_the_date();
            }

            /*
             * show author
             */
            if ( $this->carousel_params['show_author'] === 'true' ) {
                $this->author = get_the_author();
            }

            /*
             * show excerpt or full content
             */
            if ( $this->carousel_params['show_description'] !== 'false' ) {
                if ( $this->carousel_params['show_description'] === 'excerpt' ) {
                    $this->description = get_the_excerpt();
                } else if ( $this->carousel_params['show_description'] === 'content' ) {
                    $this->description = ( $this->carousel_params['allow_shortcodes'] == 'true' ? do_shortcode( get_the_content( '', true ) ) : get_the_content() );
                }
            }

            /*
             * show button
             */
            if ( $this->carousel_params['show_more_button'] === 'true' ) {
                $this->buttons  .= '<a href="' . $this->post_url . '" class="wp-posts-carousel-more-button button" title="' . __( 'Read more about', 'wp-posts-carousel' ) . ' ' . $post->post_title . '">' . __( 'read more', 'wp-posts-carousel' ) . '</a>';
            }

            /*
             * template
             */
            $out .= include( $this->template['dir'] . '/views/template.php' );
        }

        /*
         * reset wordpress query
         */
        wp_reset_postdata();

        $out .= '</div>';

        /*
         * generate jQuery script for OwlCarousel
         */
        $out .= $this->carousel( $this->carousel_params );
        return $out;
    }

    private function carousel( $params = array() ) {
        if ( empty( $params ) ) {
            return false;
        }
        $mouse_wheel = null;

        if ( $params['mouse_wheel'] == 'true' ) {
            $mouse_wheel = 'wpPostsCarousel' . $params['id'] . '.on("mousewheel", ".owl-stage", function(e) {
                if (e.deltaY > 0) {
                    wpPostsCarousel' . $params['id'] . '.trigger("next.owl");
                } else {
                    wpPostsCarousel' . $params['id'] . '.trigger("prev.owl");
                }
                e.preventDefault();
            });';
        }

	    $debug_message = null;
        $jQuery_missing_message = __( 'WP Posts Carousel plugin require jQuery library. Please make sure you have the latest version on your website.', 'wp-posts-carousel' );
		if(WP_POSTS_CAROUSEL_DEBUG == true) {
			$debug_message = WP_Posts_Carousel_Utils::debug_message( $jQuery_missing_message, true );
		}


        $out = '<script type="text/javascript">
					if( typeof jQuery == "undefined" ) {
					    '. $debug_message .'
					} else {
	                    jQuery(window).load(function(e) {
	                        var carousel = jQuery("#' . $params['id'] . '");
	                        carousel.owlCarousel({
	                            rtl: ' . $params['rtl'] . ',
	                            loop: ' . ( $params['post_count'] > 1 ? $params['loop'] : 'false' ) . ',
	                            nav: ' . $params['nav'] . ',
	                            navSpeed: ' . $params['nav_speed'] . ',
	                            dots: ' . $params['dots'] . ',
	                            dotsSpeed: ' . $params['dots_speed'] . ',
	                            lazyLoad: ' . $params['lazy_load'] . ',
	                            autoplay: ' . $params['auto_play'] . ',
	                            autoplayHoverPause: ' . $params['stop_on_hover'] . ',
	                            autoplayTimeout: ' . $params['auto_play_timeout'] . ',
	                            autoplaySpeed:  ' . $params['auto_play_speed'] . ',
	                            stagePadding: ' . $params['stage_padding'] . ',
	                            margin: ' . $params['margin'] . ',
	                            freeDrag: false,
	                            mouseDrag: ' . $params['mouse_drag'] . ',
	                            touchDrag: ' . $params['touch_drag'] . ',
	                            slideBy: ' . $params['slide_by'] . ',
	                            fallbackEasing: "' . $params['easing'] . '",
	                            responsiveClass: true,
	                            navText: [ "' . __( 'previous', 'wp-posts-carousel' ) . '", "' . __( 'next', 'wp-posts-carousel' ) . '" ],
	                            responsive:{
	                                0:{items:1}' . WP_Posts_Carousel_Utils::parse_breakpoints( $params ) . '
	                            },
	                            autoWidth: ' . $params['auto_width'] . ',
	                            autoHeight: ' . $params['auto_height'] . '
	                        });
	                        ' . $mouse_wheel . '
	                    });
                    }
                </script>';

        return $out;
    }

    private function prepare_params( $atts ) {
        $carousel_default_params = WP_Posts_Carousel_Utils::get_carousel_default_params();

        $params = array_merge($atts,$this->carousel_params);

        foreach ( $carousel_default_params as $k => $v ) {
            if ( ! array_key_exists( $k, $params)  ) {
                if ( $k == 'post_types' ) {
                    $params[$k] = array_key_exists( 'post_type', $params ) ? $params['post_type'] : $carousel_default_params[$k];
                    unset( $params['post_type'] );
                } else {
                    if ( in_array( $carousel_default_params[$k], array('true', 'false') ) ) {
                        $params[$k] = ( $carousel_default_params[$k] === 'true' ? true : false);
                    } else {
                        $params[$k] = $carousel_default_params[$k];
                    }
                }
            }
        }

        $params['id'] = $this->carousel_id;

        return $params;
    }
}
