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


            $template .= apply_filters( 'wp_posts_carousel_item_featured_image', $this->featured_image, array(
                'post_url' => $this->post_url,
                'post'     => $this->post,
                'image'    => $this->image[0],
                'params'   => $this->params,
            ) );


            $template .= '<div class="wp-posts-carousel-details">';

                $template .= apply_filters( 'wp_posts_carousel_item_title', $this->title, array(
                    'post_url' => $this->post_url,
                    'post'     => $this->post,
                    'params'   => $this->params,
                ) );


                $template .= apply_filters( 'wp_posts_carousel_item_categories', $this->category, array(
                    'categories_list' => $this->categories_list,
                    'post'            => $this->post,
                    'params'          => $this->params,
                ) );


                $template .= apply_filters( 'wp_posts_carousel_item_description', $this->description, array(
                    'post'    => $this->post,
                    'params'  => $this->params,
                ) );

                $template .= apply_filters( 'wp_posts_carousel_item_created_date', $this->created_date, array(
                    'post'    => $this->post,
                    'params'  => $this->params,
                ) );

                $template .= apply_filters( 'wp_posts_carousel_item_author', $this->author, array(
                    'post'    => $this->post,
                    'params'  => $this->params,
                ) );

                $template .= apply_filters( 'wp_posts_carousel_item_tags', $this->tags, array(
                    'tags_list' => $this->tags_list,
                    'post'      => $this->post,
                    'params'    => $this->params,
                ) );

                $template .= apply_filters( 'wp_posts_carousel_item_buttons', $this->buttons, array(
                    'post'      => $this->post,
                    'post_url'  => $this->post_url,
                    'params'    => $this->params,
                ) );

            $template .= '</div>';

        $template .= do_action( 'wp_posts_carousel_after_item_content', $this->params );
    $template .= '</div>';
$template .= '</div>';

return $template;