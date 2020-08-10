<table cellspacing="0" cellpadding="0" class="wp-posts-carousel-table">
    <tbody>
        <tr>
        	<th>
        		<?php _e( 'Items to show on different devices', 'wp-posts-carousel' ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( sprintf( __( 'If you need you can create more breakpoints. See <a href="%s" target="_blank" title="See how to create custom breakpoints">FAQ</a>', 'wp-posts-carousel' ), 'http://www.teastudio.pl/en/' ) ); ?>
        	</th>
        	<td class="wp-posts-carousel-table-col">
                <?php $breakpoints = WP_Posts_Carousel_Utils::get_breakpoints( ); ?>
                <table cellspacing="0" cellpadding="0" class="wp-posts-carousel-rwd-table">
                    <?php if ( count( $breakpoints ) > 0 ): ?>
                        <?php foreach ( $breakpoints as $device => $widths ): ?>
                            <tr>
                                <th class="wp-posts-carousel-rwd-table-device wp-posts-carousel-rwd-table-device-<?php echo esc_attr( $device ); ?>">
                                    <i class="fa fa-<?php echo esc_attr( $device ); ?>"></i>
                                </th>
                                <td>
                                    <table cellspacing="0" cellpadding="0">
                                        <?php foreach ( $widths as $width => $items ): ?>
                                            <tr>
                                                <th><?php echo esc_html( $width ) . 'px' ?></th>
                                                <td>
                                                    <input class="wp-posts-carousel-field wp-posts-carousel-breakpoint field-validate" size="5" id="items_to_show_<?php echo esc_attr( $width ); ?>" name="wp_posts_carousel[items_to_show][<?php echo esc_attr( $width ); ?>]" type="number" value="<?php echo ( esc_attr( $data['items_to_show']->$width)  ? esc_attr( $data['items_to_show']->$width ) : esc_attr( $items ) ); ?>" min="1" required pattern="^\d+$" />
                                                    [<?php _e( 'items', 'wp-posts-carousel' ); ?>]
                                                </td>
                                            </tr>
                                        <?php endforeach ?>
                                    </table>
                                </td>
                            </tr>
                        <?php endforeach ?>
                    <?php else: ?>
                        <tr>
                            <td>
                                <div class="wp-posts-carousel-message wp-posts-carousel-message-eror">
                                    <p>
                                        <?php _e( 'Ups, make sure that you defined correctly breakpints in your filter "wp_posts_carousel_breakpoints".', 'wp-posts-carousel' ); ?>
                                    </p>
                                </div>
                            </td>
                        </tr>
                    <?php endif ?>
                </table>
        	</td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Slide by', 'wp-posts-carousel' ); ?>
            	<?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Number of items to slide.', 'wp-posts-carousel' ) ); ?>
            </tdh>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[slide_by]" id="slide_by" value="<?php echo esc_attr( $data['slide_by'] ); ?>" size="5" min="1" required pattern="^\d+$" />[<?php _e( 'items', 'wp-posts-carousel' ); ?>]
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'RTL', 'wp-posts-carousel' ); ?>
            	<?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Change direction from Right to Left.', 'wp-posts-carousel' ) ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[rtl]" id="rtl" <?php checked( ( bool ) $data['rtl'], false ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Stage padding', 'wp-posts-carousel' ); ?>
            	<?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Padding left and right on stage (can see prev and next posts).', 'wp-posts-carousel' ) ); ?>
            </th>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[stage_padding]" id="stage_padding" value="<?php echo esc_attr( $data['stage_padding'] ); ?>" size="5" min="0" required pattern="^\d+$" />[px]
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Margin', 'wp-posts-carousel' ); ?>
            	<?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Margin between items.', 'wp-posts-carousel' ) ); ?>
            </th>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[margin]" id="margin" value="<?php echo esc_attr( $data['margin'] ); ?>" size="5" min="0" required pattern="^\d+$" />[px]
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Inifnity loop', 'wp-posts-carousel' ); ?>
            	<?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Duplicate last and first items to get loop illusion.', 'wp-posts-carousel' ) ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[loop]" id="loop" <?php checked( ( bool ) $data['loop'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Pause on mouse hover', 'wp-posts-carousel' ); ?>
        	</th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[stop_on_hover]" id="stop_on_hover" <?php checked( ( bool ) $data['stop_on_hover'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Auto play', 'wp-posts-carousel' ); ?>
        	</th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[auto_play]" id="auto_play" <?php checked( ( bool ) $data['auto_play'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Autoplay interval timeout', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[auto_play_timeout]" id="auto_play_timeout" value="<?php echo esc_attr( $data['auto_play_timeout'] ); ?>" size="5" min="1" required pattern="^\d+$" />[ms]
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show "next" and "prev" buttons', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[nav]" id="nav" <?php checked( ( bool ) $data['nav'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Navigation speed', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[nav_speed]" id="nav_speed" value="<?php echo esc_attr( $data['nav_speed'] ); ?>" size="5" min="1" required pattern="^\d+$" />[ms]
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show dots navigation', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[dots]" id="dots" <?php checked( ( bool ) $data['dots'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Dots speed', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[dots_speed]" id="dots_speed" value="<?php echo esc_attr( $data['dots_speed'] ); ?>" size="5" min="1" required pattern="^\d+$" />[ms]
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Delays loading of images', 'wp-posts-carousel' ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Images outside of viewport won\'t be loaded before user scrolls to them. Great for mobile devices to speed up page loadings.', 'wp-posts-carousel' ) ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'With some themes or servers it might cause problems. If you have problem with your carousel (e.g: one of the images did not show, etc.), please uncheck this option.', 'wp-posts-carousel' ), 'warning' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[lazy_load]" id="lazy_load" <?php checked( ( bool ) $data['lazy_load'], false ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Mouse events', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[mouse_drag]" id="mouse_drag" <?php checked( ( bool ) $data['mouse_drag'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Mousewheel scrolling', 'wp-posts-carousel' ); ?>
            	<?php echo WP_Posts_Carousel_Utils::get_tip( __( 'With some themes or servers it might cause problems. If you have problem with your carousel or site (e.g: you can\'t scroll the page, etc.), please uncheck this option.', 'wp-posts-carousel' ), 'warning' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[mouse_wheel]" id="mouse_wheel" <?php checked( ( bool ) $data['mouse_wheel'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Touch events', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[touch_drag]" id="touch_drag" <?php checked( ( bool ) $data['touch_drag'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php echo _e( 'Animation', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[easing]" id="easing">
                <?php
                    $animation_list = WP_Posts_Carousel_Utils::get_animations();
                    foreach( $animation_list as $key => $list ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['easing'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_attr( $list ) . '</option>';
                    }
                ?>
                </select>
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Auto width', 'wp-posts-carousel' ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'It\'s recommended to set width on divs, but sometimes you may want this option :)', 'wp-posts-carousel' ) ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'With some themes or servers it might cause problems. If you have problem with your carousel (e.g: one of the images did not show, etc.), please uncheck this option.', 'wp-posts-carousel' ), 'warning' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[auto_width]" id="auto_width" <?php checked( ( bool ) $data['auto_width'], false ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Auto height', 'wp-posts-carousel' ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Height adjusted dynamically to highest displayed item.', 'wp-posts-carousel' ) ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'With some themes or servers it might cause problems. If you have problem with your carousel (e.g: one of the images did not show, etc.), please uncheck this option.', 'wp-posts-carousel' ), 'warning' ); ?>
          	</th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[auto_height]" id="auto_height" <?php checked( ( bool ) $data['auto_height'], true ); ?> />
            </td>
        </tr>

        <?php apply_filters( 'wp-posts-carousel-carousel-meta-box', array() ); ?>
    </tbody>
</table>
