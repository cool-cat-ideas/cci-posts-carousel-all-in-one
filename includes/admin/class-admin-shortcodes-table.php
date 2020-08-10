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

include_once( 'class-admin-carousels-table.php' );

/**
 * WP_Posts_Carousel_Table class
 */
class WP_Posts_Carousel_Shortcodes_Table extends WP_Posts_Carousel_Table
{

    protected function get_table_classes() {
        return array( 'widefat', 'striped', $this->_args['plural'] );
    }

    /**
     * get list columns
     */
    public function get_columns() {
        return array(
            'title'        => __( 'Name', 'wp-posts-carousel' ),
            'shortcode'    => __( 'Shortcode', 'wp-posts-carousel' ),
            'status'       => __( 'Status' ),
            'date'         => __( 'Date' ),
            'options'      => __( 'Options' ),
        );
    }

    /**
     * Return title column
     * @param  object $webhook
     * @return string
     */
    public function column_title( $item ) {
        $edit_link        = admin_url( 'post.php?post=' . $item->ID . '&action=edit' );
        $title            = _draft_or_post_title( $item );
        $post_type_object = get_post_type_object( $item->post_type );
        $post_status      = $item->post_status;


        if ( $post_status == 'trash' ) {
            $output = esc_html( $title );
        } else {
            $output = '<a href="' . esc_url( $edit_link ) . '" class="row-title">' . esc_html( $title ) . '</a>';
        }

        return $output;
    }

    /**
     * return shortcode column
     */
    public function column_shortcode( $item ) {
        return '<span class="wp-posts-carousel-shortcode-sample">[wp-posts-carousel id="' . $item->ID . '"]</span>';
    }

    /**
     * return status column
     */
    public function column_status( $item ) {
        if ( $item->post_status === 'publish' ) {
            $status = __( 'Published' );
        } elseif ( $item->post_status === 'future' ) {
            $status = __( 'Scheduled' );
        } else {
            $status = __( ucfirst( $item->post_status ) );
        }
        return $status;
    }

    /**
     * return date column
     */
    public function column_date( $item ) {
        return __( 'Last Modified' ) . '<br />' . date_i18n( get_option( 'date_format' ), strtotime( $item->post_date ) );
    }

    /**
     * return options column
     */
    public function column_options( $item ) {
        return '<a href="javascript:void(0);" class="wp-posts-carousel-insert button button-primary" title="'. __( 'Insert this carousel to the post', 'wp-posts-carousel' ) .'">'. __( 'Insert Carousel', 'wp-posts-carousel' ) .'</a>';
    }

    /**
     * table list views
     */
    protected function get_views() {
        $status_links    = array();
        $num_posts       = wp_count_posts( 'wp-posts-carousel', 'readable' );
        $class           = '';
        $total_posts     = array_sum( (array) $num_posts );


        // Subtract post types that are not included in the admin all list.
        foreach ( get_post_stati( array( 'show_in_admin_all_list' => false ) ) as $state ) {
            $total_posts -= $num_posts->$state;
        }

        $class = empty( $class ) && empty( $_REQUEST['status'] ) ? ' class="current"' : '';
        $status_links['all'] = '<a href="' . admin_url( 'admin.php?page=wp-posts-carousel' ) . '"' . $class . '>' . sprintf( _nx( 'All <span class="count">(%s)</span>', 'All <span class="count">(%s)</span>', $total_posts, 'carousels', 'woocommerce' ), number_format_i18n( $total_posts ) ) . '</a>';

        foreach ( get_post_stati( array( 'show_in_admin_status_list' => true ), 'objects' ) as $status ) {
            $class = '';
            $status_name = $status->name;

            if ( ! in_array( $status_name, array( 'publish', 'draft', 'trash' ) ) || empty( $num_posts->$status_name ) ) {
                continue;
            }

            if ( isset( $_REQUEST['status'] ) && $status_name == $_REQUEST['status'] ) {
                $class = ' class="current"';
            }

            $status_links[ $status_name ] = '<a href="' . admin_url( 'admin.php?page=wp-posts-carousel&status=' . $status_name ) . '"' . $class .'>' . sprintf( translate_nooped_plural( $status->label_count, $num_posts->$status_name ), number_format_i18n( $num_posts->$status_name ) ) . '</a>';
        }

        return $status_links;
    }

    /**
     * get bulk actions
     */
    protected function get_bulk_actions() {
        return array();
    }

    public function search_box() {
        return null;
    }

    public function views() {
        return null;
    }

    /**
     * prepare table list items
     */
    public function prepare_items() {
        $columns  = $this->get_columns();
        $hidden   = array();
        $sortable = array();

        // column headers
        $this->_column_headers = array( $columns, $hidden, $sortable );
        $this->items = WP_Posts_Carousel_Utils::get_carousels();
    }


    public function init() {
        $this->prepare_items();
        $this->views();
        $this->display();
    }
}