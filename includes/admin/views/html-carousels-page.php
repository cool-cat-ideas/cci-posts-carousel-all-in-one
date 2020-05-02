<?php
/*
Author: Marcin Gierada
Author URI: http://www.teastudio.pl/
Author Email: m.gierada@teastudio.pl
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
?>
<div class="wrap">
    <h1>
        <?php _e( 'Carousels', 'wp-posts-carousel' ); ?>
        <a href="<?php echo admin_url() ?>post-new.php?post_type=wp-posts-carousel" class="page-title-action"><?php _e( 'Add New' ); ?></a>
    </h1>

    <div class="wp-posts-carousel-columns">
        <div class="wp-posts-carousel-column-1">
            <form method="post" action="">
                <?php $table->init(); ?>
            </form>
        </div>

        <div class="wp-posts-carousel-column-2">
            <?php WP_Posts_Carousel_Plugin_Info_Meta_Box::output(); ?>
            <?php WP_Posts_Carousel_Plugin_Support_Meta_Box::output(); ?>
        </div>
    </div>
</div>
