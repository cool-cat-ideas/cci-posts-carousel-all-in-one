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

?>
<div class="wp-posts-carousel-box <?php echo $new_version !== null ? 'wp-posts-carousel-box-new-version' : 'wp-posts-carousel-box-latest-version'; ?>">
    <div class="wp-posts-carousel-box-content wp-posts-carousel-box-separator">
        <h3 class="wp-posts-carousel-box-separator">
            <?php _e( 'Version', 'wp-posts-carousel' ); ?>: <?php echo WP_POSTS_CAROUSEL_VERSION; ?>
        </h3>

        <?php if ( $new_version !== null ): ?>
            <i class="dashicons dashicons-update"></i>
            <p><strong><?php _e( 'New update is available', 'wp-posts-carousel' ); ?></strong></p>
            <p><?php echo sprintf( __( 'There is a new version (%s) available to download', 'wp-posts-carousel' ), $new_version ); ?>.</p>
            <p>
                <a class="button button-primary" href=""><?php _e( 'Update' ) ?></a>
                <a class="button button-link" href="https://wordpress.org/plugins/loco-translate/installation/" target="_blank"><?php _e( 'See details', 'wp-posts-carousel' ); ?></a>
            </p>
        <?php else: ?>
            <i class="dashicons dashicons-thumbs-up"></i>
            <p><strong><?php _e( 'Good job!', 'wp-posts-carousel' ); ?></strong></p>
            <p><?php _e( 'You have the latest version', 'wp-posts-carousel' ); ?>.</p>
        <?php endif; ?>
    </div>


<?php /*
    <div class="wp-posts-carousel-box-rating">
        <p>
            <a href="https://wordpress.org/plugins/wp-posts-carousel/" target="_blank" title="<?php _e( 'Leave your review at wordpress.org', 'wp-posts-carousel' ); ?>">
                <?php _e( 'You can also leave a good review', 'wp-posts-carousel' ); ?><br />
                <span class="dashicons dashicons-star-filled"></span>
                <span class="dashicons dashicons-star-filled"></span>
                <span class="dashicons dashicons-star-filled"></span>
                <span class="dashicons dashicons-star-filled"></span>
                <span class="dashicons dashicons-star-filled"></span>
            </a>
        </p>
    </div>
 */?>
</div>