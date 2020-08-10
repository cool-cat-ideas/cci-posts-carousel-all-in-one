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

/*
 * check if WordPress Popular Posts is active
 */
// include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
// if ( ! is_plugin_active( 'wordpress-popular-posts/wordpress-popular-posts.php' ) ) {
//     echo '<div class="error"><p>' . __( 'The <strong>WP Posts Carousel</strong> plugin may require <a href="https://wordpress.org/plugins/wordpress-popular-posts/" target="_blank" title="WordPress Popular Posts">WordPress Popular Posts</a> plugin to display popular posts in carousel. Please install or active this plugin.', 'wp-posts-carousel' ) . '</p></div>';
// }


?>
<div class="wrap">
    <h2><?php _e( 'Settings', 'wp-posts-carousel' ); ?></h2>


    <div class="wp-posts-carousel-columns">

        <ul class="nav-tab-wrapper">
            <a href="<?php echo admin_url( 'admin.php?page=settings') ?>" class="nav-tab <?php echo ( $current_tab == 'general' ? 'nav-tab-active' : '' ) ?>"><?php _e( 'General', 'wp-posts-carousel' ) ?></a>
            <a href="<?php echo admin_url( 'admin.php?page=settings&tab=support' ) ?>" class="nav-tab <?php echo ( $current_tab == 'support' ? 'nav-tab-active' : '' ) ?>"><?php _e( 'Support', 'wp-posts-carousel' ) ?></a>
        </ul>

        <?php if ( $current_tab == 'general' ): ?>

            <div class="wp-posts-carousel-column-1">
                <form method="post" action="options.php">
                    <?php settings_fields( 'wp-posts-carousel' ); ?>

                    <table class="form-table">
                        <tbody>
                            <tr valign="top">
                                <th scope="row">Font Awesome</th>
                                <td>
                                    <p>
                                        <label for="wp-posts-carousel_include_font_awesome">
                                            <input type="checkbox" name="wp-posts-carousel_settings[include_font_awesome]" id="wp-posts-carousel_include_font_awesome" value="1" <?php array_key_exists( 'include_font_awesome', $settings ) ? checked( ( bool ) $settings['include_font_awesome'], true ): null; ?> />
                                            <?php echo sprintf( __( 'Include "%s" library', 'wp-posts-carousel' ) , 'Font Awesome' ); ?>
                                        </label>
                                    </p>
                                    <p>
                                        <label for="wp-posts-carousel_include_admin_font_awesome">
                                            <input type="checkbox" name="wp-posts-carousel_settings[include_admin_font_awesome]" id="wp-posts-carousel_include_admin_font_awesome" value="1" <?php array_key_exists( 'include_admin_font_awesome', $settings ) ? checked( ( bool ) $settings['include_admin_font_awesome'], true ): null; ?> />
                                            <?php echo sprintf( __( 'Include "%s" library in Admin panel', 'wp-posts-carousel' ) , 'Font Awesome' ); ?>
                                        </label>
                                    </p>
                                    <p class="description"><?php echo sprintf( __( 'Select this option if you would like to include this font and stylesheet, or uncheck if you are already using it.<br />Learn more about %s.', 'wp-posts-carousel' ), '<a href="http://fortawesome.github.io/Font-Awesome/" target="_blank"><b>Font Awesome</b></a>' ); ?></p>
                                </td>
                            </tr>
                            <tr valign="top">
                                <th scope="row"><?php _e( 'Scripts', 'wp-posts-carousel' ); ?></th>
                                <td>
                                    <label for="wp-posts-carousel_include_in_footer">
                                        <input type="checkbox" name="wp-posts-carousel_settings[include_in_footer]" id="wp-posts-carousel_include_in_footer" value="1" <?php array_key_exists( 'include_in_footer', $settings ) ? checked( ( bool ) $settings['include_in_footer'], true ): null; ?> />
                                        <?php _e( 'Include plugin\'s scripts in "footer" section', 'wp-posts-carousel' ); ?>
                                    </label>
                                    <p class="description"><?php _e( 'Select if you want to include plugin\'s scripts in "footer" section, otherwise they will be included in "head" section.', 'wp-posts-carousel' ); ?></p>
                                </td>
                            </tr>
                            <tr valign="top">
                                <th scope="row"><?php _e( 'Debug mode', 'wp-posts-carousel' ); ?></th>
                                <td>
                                    <label for="wp-posts-carousel_is_debug_mode">
                                        <input type="checkbox" name="wp-posts-carousel_settings[is_debug_mode]" id="wp-posts-carousel_is_debug_mode" value="1" <?php array_key_exists( 'is_debug_mode', $settings ) ? checked( ( bool ) $settings['is_debug_mode'], true ): null; ?> />
                                        <?php _e( 'Debug mode', 'wp-posts-carousel' ); ?>
                                    </label>
                                    <p class="description"><?php _e( 'Select if you have problems with carousels and you want to show plugin\'s error messages on your site source code.', 'wp-posts-carousel' ); ?></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                    <?php submit_button( '', 'primary', 'submit', true ); ?>
                </form>

                <?php
                    /*
                        <div class="wp-posts-carousel-message wp-posts-carousel-message-info"></div>
                    */
                ?>
            </div>

            <div class="wp-posts-carousel-column-2">
                <?php WP_Posts_Carousel_Plugin_Info_Meta_Box::output(); ?>
                <?php WP_Posts_Carousel_Plugin_Support_Meta_Box::output(); ?>
            </div>

	    <?php elseif ( $current_tab == 'support' ): ?>
            <div class="wp-posts-carousel-column-1">
                <?php
                    global $wpdb, $wp_version;

                    $current_theme = wp_get_theme();
                    $plugins = get_plugins();
                    $plugin_names = [];

                    foreach( $plugins as $main_file => $plugin_meta ) {
	                    if (is_plugin_active( $main_file ) ) {
		                    $plugin_names[] = sanitize_text_field( $plugin_meta['Name'] . ' (' . $plugin_meta['Version'] .')' );
	                    }
                    }
                ?>
                <div id="support-site-info">

                    <div id="help-intro" class="card">
                        <div class="card-body">
                            <h2><?php _e( 'Need help?', 'wp-posts-carousel' ); ?></h2>
                            <h3 style="text-align: center;">
                                <?php _e( 'If you need any help with this plugin or with Wordpress, check out our support options', 'wp-posts-carousel' ); ?>:
                            </h3>
                            <p style="text-align: center;">
                                <a href="https://wordpress.org/support/plugin/wp-posts-carousel/" class="button button-hero wp-posts-carousel-button-support"><?php _e( 'Plugin support forum (free)', 'wp-posts-carousel' ); ?></a>
                                <span><?php _e( 'or', 'wp-posts-carousel' ); ?></span>
                                <a href="#" class="button button-hero wp-posts-carousel-button-premium-support"><i class="dashicons dashicons-awards"></i> <?php _e( 'Premium support', 'wp-posts-carousel' ); ?></a>
                            </p>

                            <br />
                            <hr />
                            <br />

                            <p style="text-align: center;">
	                            <?php _e( 'This data may be needed to solve your problem, so please copy and share with technical support.', 'wp-posts-carousel' ) ?>
                            </p>

                            <div id="support-site-data">
                                <p>
                                    <strong>Site domain:</strong> <?php echo get_site_url(); ?>
                                </p>
                                <p>
                                    <strong>User agent:</strong> <?php echo sanitize_text_field( $_SERVER["HTTP_USER_AGENT"] );  ?>
                                </p>
                                <p>
                                    <strong>WordPress version:</strong> <?php echo $wp_version; ?>
                                </p>
                                <p>
                                    <strong>Multisite:</strong> <?php echo ( function_exists('is_multisite') && is_multisite() ) ? 'Yes' : 'No'; ?>
                                </p>
                                <p>
                                    <strong>Current theme:</strong> <?php echo $current_theme->get('Name') . ' (' . $current_theme->get('Version') . ') by ' . $current_theme->get('Author'); ?>
                                </p>
                                <p>
                                    <strong>Active plugins:</strong> <?php echo implode(', ', $plugin_names); ?>
                                </p>

                                <p>
                                    <strong>PHP version:</strong> <?php echo phpversion(); ?>
                                </p>
                                <p>
                                    <strong>PHP extensions:</strong> <?php echo implode(', ', get_loaded_extensions()); ?>
                                </p>

                                <p>
                                    <strong>Database version:</strong> <?php echo $wpdb->get_var("SELECT VERSION();"); ?>
                                </p>
                                <p>
                                    <strong>InnoDB availability:</strong> <?php echo $wpdb->get_var("SELECT SUPPORT FROM INFORMATION_SCHEMA.ENGINES WHERE ENGINE = 'InnoDB';"); ?>
                                </p>
                            </div>
                        </div>
                    </div>


                </div>


            </div>

            <div class="wp-posts-carousel-column-2">

            </div>

        <?php endif ?>
    </div>
</div>
