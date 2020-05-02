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

if( ! class_exists( 'WP_List_Table' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

/**
 * WP_Posts_Carousel_Table class
 */
class WP_Posts_Carousel_Table extends WP_List_Table
{

    /**
     * constructor
     */
    public function __construct() {
        parent::__construct( array(
            'singular' => __( 'carousel', 'wp-posts-carousel' ),
            'plural'   => __( 'carousels', 'wp-posts-carousel' ),
            'ajax'     => false
        ) );
    }

    /**
     * get list columns
     */
    public function get_columns() {
        return array(
            'cb'           => '<input type="checkbox" />',
            'title'        => __( 'Name', 'wp-posts-carousel' ),
            'shortcode'    => __( 'Shortcode', 'wp-posts-carousel' ),
            'status'       => __( 'Status' ),
            'date'         => __( 'Date' ),
        );
    }

    /**
     * get sortable columns
     */
    public function get_sortable_columns() {
        return array(
            'title' => array('title', false),
            'date' => array('post_date', false),
        );
    }

    /**
     * column cb
     */
    public function column_cb( $item ) {
        return sprintf( '<input type="checkbox" name="%1$s[]" value="%2$s" />', $this->_args['singular'], $item->ID );
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

        // Title

        if ( $post_status == 'trash' ) {
            $output = esc_html( $title );
        } else {
            $output = '<a href="' . esc_url( $edit_link ) . '" class="row-title">' . esc_html( $title ) . '</a>';
        }


        // Get actions
        $actions = array(
            'id' => sprintf( __( 'ID: %s' ), $item->ID )
        );

        if ( current_user_can( $post_type_object->cap->edit_post, $item->ID ) && $post_status !== 'trash' ) {
            $actions['edit'] = '<a href="' . esc_url( $edit_link ) . '">' . __( 'Edit' ) . '</a>';
        }

        if ( current_user_can( $post_type_object->cap->delete_post, $item->ID ) ) {
            if ( $post_status == 'trash' ) {
                $actions['untrash'] = '<a title="' . esc_attr( __( 'Restore this item from the Trash' ) ). '" href="' . wp_nonce_url( admin_url( sprintf( $post_type_object->_edit_link . '&amp;action=untrash', $item->ID ) ), 'untrash-post_' . $item->ID ) . '">' . __( 'Restore' ) . '</a>';
            } elseif ( EMPTY_TRASH_DAYS ) {
                $actions['trash'] = '<a class="submitdelete" title="' . esc_attr( __( 'Move this item to the Trash' ) ) . '" href="' . get_delete_post_link( $item->ID ) . '">' . __( 'Trash' ) . '</a>';
            }
            if ( $post_status == 'trash' || ! EMPTY_TRASH_DAYS ) {
                $actions['delete'] = '<a class="submitdelete" title="' . esc_attr( __( 'Delete this item permanently' ) ) . '" href="' . get_delete_post_link( $item->ID, '', true ) . '">' . __( 'Delete Permanently' ) . '</a>';
            }
        }

        $row_actions = array();

        foreach ( $actions as $action => $link ) {
            $row_actions[] = '<span class="' . esc_attr( $action ) . '">' . $link . '</span>';
        }

        $output .= '<div class="row-actions">' . implode(  ' | ', $row_actions ) . '</div>';

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
        if ( isset( $_GET['status'] ) && 'trash' == $_GET['status'] ) {
            return array(
                'untrash' => __( 'Restore' ),
                'delete'  => __( 'Delete Permanently' )
            );
        }

        return array(
            'trash' => __( 'Move to Trash' )
        );
    }

    /**
     * prepare table list items
     */
    public function prepare_items() {
        $per_page = 10;
        $columns  = $this->get_columns();
        $hidden   = array();
        $sortable = $this->get_sortable_columns();
        $order    = ! empty( $_REQUEST['order'] ) ? esc_sql( $_REQUEST['order'] ) : 'desc';
        $order_by = ! empty( $_REQUEST['orderby'] ) ? esc_sql( $_REQUEST['orderby'] ) : 'id';

        // column headers
        $this->_column_headers = array( $columns, $hidden, $sortable );

        $current_page = $this->get_pagenum();

        // query args
        $args = array(
            'post_type'           => 'wp-posts-carousel',
            'posts_per_page'      => $per_page,
            'ignore_sticky_posts' => true,
            'paged'               => $current_page,
            'orderby'             => $order_by,
            'order'               => $order,
        );

        // handle the status query
        if ( ! empty( $_REQUEST['status'] ) ) {
            $args['post_status'] = sanitize_text_field( $_REQUEST['status'] );
        }

        if ( ! empty( $_REQUEST['s'] ) ) {
            $args['s'] = sanitize_text_field( $_REQUEST['s'] );
        }

        // get the result
        $result    = new WP_Query( $args );
        $this->items = $result->posts;

        // set the pagination
        $this->set_pagination_args( array(
            'total_items' => $result->found_posts,
            'per_page'    => $per_page,
            'total_pages' => $result->max_num_pages
        ) );
    }


    public function init() {
        $this->prepare_items();
        $this->views();
        $this->search_box( __( 'Search' ), 'carousel' );
        $this->display();
    }
}