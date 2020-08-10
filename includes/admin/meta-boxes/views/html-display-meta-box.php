<table cellspacing="0" cellpadding="0" class="wp-posts-carousel-table">
    <tbody>
        <tr>
        	<th>
        		<?php _e( 'Template', 'wp-posts-carousel' ); ?>
        	</th>
            <td>
                <?php echo WP_Posts_Carousel_Templates::render_templates_list() ?>
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show title', 'wp-posts-carousel' ); ?>
        	</th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_title]" id="show_title" <?php checked( ( bool ) $data['show_title'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show author', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_author]" id="show_author" <?php checked( ( bool ) $data['show_author'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show created date', 'wp-posts-carousel' ); ?>
        	</th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_created_date]" id="show_created_date" <?php checked( ( bool ) $data['show_created_date'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show description', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[show_description]" id="show_description" class="select" >
                <?php
                    $description_list = WP_Posts_Carousel_Utils::get_descriptions();
                    foreach( $description_list as $key => $list ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['show_description'] ) == esc_attr( $key ) ? 'selected="selected"' : null) . '>' . esc_attr( $list ) . '</option>';
                    }
                ?>
                </select>
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Allow shortcodes in full content', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[allow_shortcodes]" id="allow_shortcodes" <?php checked( ( bool ) $data['allow_shortcodes'], true ); ?>/>
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show category', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_category]" id="show_category" <?php checked( ( bool ) $data['show_category'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show tags', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_tags]" id="show_tags" <?php checked( ( bool ) $data['show_tags'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show more button', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_more_button]" id="show_more_button" <?php checked( ( bool ) $data['show_more_button'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Show featured image', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="checkbox wp-posts-carousel-field" type="checkbox" value="1" name="wp_posts_carousel[show_featured_image]" id="show_featured_image" <?php checked( ( bool ) $data['show_featured_image'], true ); ?> />
            </td>
        </tr>
        <tr>
            <th>
            	<?php echo _e( 'Image source', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[image_source]" id="image_source">
                <?php
                    $source_list = WP_Posts_Carousel_Utils::get_image_sources();
                    foreach( $source_list as $key => $list ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['image_source'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_attr( $list ) . '</option>';
                    }
                ?>
                </select>
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Image width', 'wp-posts-carousel' ); ?>
        	</th>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="text" name="wp_posts_carousel[image_width]" id="image_width" value="<?php echo esc_attr( $data['image_width'] ); ?>" size="5" required pattern="^[0-9](\.?[0-9])*$" />
                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[image_width_unit]" id="image_width_unit">
                <?php
                    $unit_list = WP_Posts_Carousel_Utils::get_units();
                    foreach( $unit_list as $key => $list ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['image_width_unit'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_attr( $list ) . '</option>';
                    }
                ?>
                </select>
            </td>
        </tr>
        <tr>
            <th>
            	<?php _e( 'Image height', 'wp-posts-carousel' ); ?>
        	</th>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="text" name="wp_posts_carousel[image_height]" id="image_height" value="<?php echo esc_attr( $data['image_height'] ); ?>" size="5" required pattern="^[0-9](\.?[0-9])*$" />
                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[image_height_unit]" id="image_height_unit">
                <?php
                    $unit_list = WP_Posts_Carousel_Utils::get_units();
                    foreach( $unit_list as $key => $list ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['image_height_unit'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_attr( $list ) . '</option>';
                    }
                ?>
                </select>
            </td>
        </tr>

        <?php apply_filters( 'wp-posts-carousel-display-meta-box', array() ); ?>
    </tbody>
</table>
