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
 * WP_Posts_Carousel_Widget class
 */
class WP_Posts_Carousel_Widget extends WP_Widget {

    /**
     * constructor
     */
    public function __construct() {
        parent::__construct(
            'wp_posts_carousel',
            'WP Posts Carousel',
            array(
                'classname'   => 'widget_wp_posts_carousel',
                'description' =>  __( 'Show posts in Wp Posts Carousel', 'wp-posts-carousel' )
            )
        );
    }

    public function widget( $args, $instance ) {
        $title = apply_filters( 'widget_title', $instance['title'] );

        echo $args['before_widget'];

        if ( $title ) {
            echo $args['before_title'] . $title . $args['after_title'];
        }
        echo 'gg';

        //$generator = new Wp_Posts_Carousel_Generator();
        //echo $generator->generate( $instance );

        echo $args['after_widget'];
    }

    /*
     * the configuration form.
     */
    public function form( $instance ) {

    ?>
        <div class="wp-posts-carousel-widget-form">
            <p>
                <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title' ); ?>:</label>
                <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( array_key_exists( 'title', $instance ) ? $instance['title'] : '' ); ?>" />
            </p>
            <p>
                <label for="<?php echo $this->get_field_id( 'carousel' ); ?>"><?php _e( 'Carousel', 'wp-posts-carousel' ); ?>:</label>
                <br />
                <select class="select widefat wp-posts-carousel-field field-required" name="<?php echo $this->get_field_name( 'carousel' ); ?>" id="<?php echo $this->get_field_id( 'carousel' ); ?>" size="1" required>
                    <option value=""></option>
                <?php
                    $carousels = WP_Posts_Carousel_Utils::get_carousels();
                    foreach( $carousels as $carousel ) {
                        echo '<option value="' . esc_attr( $carousel->ID ) . '" ' . ( ( is_array( $instance['carousel'] ) && in_array( esc_attr( $carousel->ID ), $instance['carousel'] ) || $instance['carousel']  == esc_attr( $carousel->ID ) ) ? 'selected="selected"' : null ) . '>' . esc_attr( $carousel->post_title ) . '</option>';
                    }
                ?>
                </select>
            </p>
        </div>
<?php
    }
}

//function wp_posts_carousel_init_widget () {
//	return register_widget('Wp_Posts_Carousel_Widget');
//}
add_action("widgets_init", function() {
	return register_widget('Wp_Posts_Carousel_Widget');
});

//add_action( 'widgets_init', 'wp_posts_carousel_init_widget' );
?>
