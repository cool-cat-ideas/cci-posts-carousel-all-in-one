<?php
/**
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
/*
 *
 * DUE TO THE OPTIMIZATION
 * PLEASE DON'T REMOVE ANY STATEMENTS
 *
 */
$template = null;

$template .= '<div class="wp-posts-carousel-slide slides-' . $this->params['all_items'] . '">';
    $template .= '<div class="wp-posts-carousel-container">';
        $template .= do_action( 'wp_posts_carousel_before_item_content', $this->params );

            /*
             * show featured image
             */
            if ( $this->params['show_featured_image'] === 'true' ) {
                $template .= '<div class="wp-posts-carousel-image">';
                    $template .= apply_filters( 'wp_posts_carousel_item_featured_image', $this->featured_image, array(
                        'post_url' => $this->post_url,
                        'post'     => $this->post,
                        'image'    => $this->image[0],
                        'params'   => $this->params,
                    ) );
                $template .= '</div>';
            }

            /*
             * show category
             */
            if ( $this->params['show_category'] === 'true' ) {
                $template .= '<p class="wp-posts-carousel-categories">';
                    $template .= apply_filters( 'wp_posts_carousel_item_categories', $this->categories, array(
                        'categories_list' => $this->categories_list,
                        'post'            => $this->post,
                        'params'          => $this->params,
                    ) );
                $template .= '</p>';
            }

            $template .= '<div class="wp-posts-carousel-details">';
                /*
                 * show title
                 */
                if ( $this->params['show_title'] === 'true' ) {
                    $template .= '<h3 class="wp-posts-carousel-title">';
                        $template .= apply_filters( 'wp_posts_carousel_item_title', $this->title, array(
                            'post_url' => $this->post_url,
                            'post'     => $this->post,
                            'params'   => $this->params,
                        ) );
                    $template .= '</h3>';
                }

                if ( $this->params['show_created_date'] === 'true' || $this->params['show_author'] === 'true' ) {
                    $template .= '<p class="wp-posts-carousel-post-details">';

                        /*
                         * show created date
                         */
                        if ( $this->params['show_created_date'] === 'true' ) {
                            $template .= '<span class="wp-posts-carousel-created-date">';
                                $template .= apply_filters( 'wp_posts_carousel_item_created_date', $this->created_date, array(
                                    'post'    => $this->post,
                                    'params'  => $this->params,
                                ) );
                            $template .= '</span>';
                        }

                        if ( $this->params['show_created_date'] === 'true' && $this->params['show_author'] === 'true' ) {
                            $template .= '<span class="wp-posts-carousel-post-details-separator">,</span>';
                        }

                        /*
                         * show author
                         */
                        if ( $this->params['show_author'] === 'true' ) {
                            $template .= '<span class="wp-posts-carousel-author">';
                                $template .= apply_filters( 'wp_posts_carousel_item_author', $this->author, array(
                                    'post'    => $this->post,
                                    'params'  => $this->params,
                                ) );
                            $template .= '</span>';
                        }

                    $template .= '</p>';
                }

                /*
                 * show description
                 */
                if ( $this->params['show_description'] !== 'false' ) {
                    $template .= '<div class="wp-posts-carousel-description">';
                        $template .= apply_filters( 'wp_posts_carousel_item_description', $this->description, array(
                            'post'    => $this->post,
                            'params'  => $this->params,
                        ) );
                    $template .= '</div>';
                }

                /*
                 * show tags
                 */
                if ( $this->params['show_tags'] === 'true' ) {
                    $template .= '<p class="wp-posts-carousel-tags">';
                        $template .= apply_filters( 'wp_posts_carousel_item_tags', $this->tags, array(
                            'tags_list' => $this->tags_list,
                            'post'      => $this->post,
                            'params'    => $this->params,
                        ) );
                    $template .= '</p>';
                }

                /*
                 * show button
                 */
                if ( $this->params['show_more_button'] === 'true' ) {
                    $template .= '<p class="wp-posts-carousel-buttons">';
                        $template .= apply_filters( 'wp_posts_carousel_item_buttons', $this->buttons, array(
                            'post'      => $this->post,
                            'post_url'  => $this->post_url,
                            'params'    => $this->params,
                        ) );
                    $template .= '</p>';
                }

            $template .= '</div>';

        $template .= do_action( 'wp_posts_carousel_after_item_content', $this->params );
    $template .= '</div>';
$template .= '</div>';

return $template;