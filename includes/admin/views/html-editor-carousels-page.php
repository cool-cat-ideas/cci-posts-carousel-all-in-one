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
<div class="wp-posts-carousel-page">
    <h1 class="wp-posts-carousel-page-title">
        <?php _e( 'Insert Carousel', 'wp-posts-carousel' ) ?>
        <span><?php _e( 'or', 'wp-posts-carousel' ) ?></span>
        <a href="<?php echo admin_url() ?>post-new.php?post_type=wp-posts-carousel" class="page-title-action button button-secondary"><?php _e( 'Add New' ); ?></a>
    </h1>

    <div class="wp-posts-carousel-page-content">
            <?php $table->init() ?>
    </div>
</div>