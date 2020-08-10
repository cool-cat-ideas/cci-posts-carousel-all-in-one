<?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_table', array() ) ?>

<table cellspacing="0" cellpadding="0" class="wp-posts-carousel-table">
    <tbody>
        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_post_types', array() ) ?>
        <tr>
            <th>
                <?php _e( 'Post types', 'wp-posts-carousel' ); ?>
                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'You can select multiple post types.', 'wp-posts-carousel' ) ); ?>
            </th>
            <td>
                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[post_types][]" id="post_types" multiple="multiple" size="4" required>
                <?php
                    $taxonomies = WP_Posts_Carousel_Utils::get_taxonomies();
                    foreach( $taxonomies as $key => $type ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( ( is_array( $data['post_types'] ) && in_array( esc_attr( $key ), $data['post_types'] ) ) ? 'selected="selected"' : null ) . '>' . esc_attr( $type->label ) . '</option>';
                    }
                ?>
                </select>
            </td>
        </tr>
        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_post_types', array() ) ?>
        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_show', array() ) ?>
        <tr>
            <th><?php _e( 'Show posts', 'wp-posts-carousel' ); ?></th>
            <td class="wp-posts-carousel-table-col">
                <table cellspacing="0" cellpadding="0" class="wp-posts-carousel-table">
                    <tbody>
                        <tr>
                            <th><?php _e( 'Order by', 'wp-posts-carousel' ); ?></th>
                            <td >
                                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[order_by]" id="order_by">
                                <?php
                                    $show_list = WP_Posts_Carousel_Utils::get_orders_by();
                                    foreach( $show_list as $key => $list ) {
                                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['order_by'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_html( $list ) . '</option>';
                                    }
                                ?>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <?php _e( 'Show Posts with IDs', 'wp-posts-carousel' ); ?>
                                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Please enter Post IDs with comma seperated.', 'wp-posts-carousel' ) ); ?>
                            </th>
                            <td>
                                <textarea class="widefat wp-posts-carousel-field field-validate" name="wp_posts_carousel[posts]" id="posts" pattern="^[1-9](0*)(,?[1-9](0*))*$"><?php echo esc_html( $data['posts'] ); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <?php _e( 'Exclude Posts with IDs', 'wp-posts-carousel' ); ?>
                                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Please enter Post IDs with comma seperated.', 'wp-posts-carousel' ) ); ?>
                            </th>
                            <td>
                                <textarea class="widefat wp-posts-carousel-field field-validate" name="wp_posts_carousel[exclude]" id="exclude" pattern="^[1-9](0*)(,?[1-9](0*))*$"><?php echo esc_html( $data['exclude'] ); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <?php _e( 'Posts with Category IDs', 'wp-posts-carousel' ); ?>
                                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Please enter Category IDs with comma seperated.', 'wp-posts-carousel' ) ); ?>
                            </th>
                            <td>
                                <textarea class="widefat wp-posts-carousel-field field-validate" name="wp_posts_carousel[categories]" id="categories" pattern="^[1-9](0*)(,?[1-9](0*))*$"><?php echo esc_html( $data['categories'] ); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th></th>
                            <td>
                                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[relation]" id="relation">
                                <?php
                                    $relation_list = WP_Posts_Carousel_Utils::get_relations();
                                    foreach( $relation_list as $key => $list ) {
                                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['relation'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) .'>'. esc_html( $list ) .'</option>';
                                    }
                                ?>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <?php _e( 'Posts with Tag names', 'wp-posts-carousel' ); ?>
                                <?php echo WP_Posts_Carousel_Utils::get_tip( __( 'Please enter Tag names with comma seperated.', 'wp-posts-carousel' ) ); ?>
                            </th>
                            <td>
                                <textarea class="widefat wp-posts-carousel-field field-validate" name="wp_posts_carousel[tags]" id="tags" pattern="^[a-zA-z0-9](,?[a-zA-Z0-9])*$"><?php echo esc_html( $data['tags'] ); ?></textarea>
                            </td>
                        </tr>

                        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_in_show', array() ); ?>
                    </tbody>
                </table>
            </td>
        </tr>
        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_show', array() ) ?>
        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_posts_limit', array() ) ?>
        <tr>
            <th>
                <?php _e( 'Posts limit', 'wp-posts-carousel' ); ?>
            </th>
            <td>
                <input class="wp-posts-carousel-field field-validate" type="number" name="wp_posts_carousel[all_items]" id="all_items" value="<?php echo esc_attr( $data['all_items'] ); ?>" size="5" required min="1" pattern="^\d+$" />
            </td>
        </tr>
        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_posts_limit', array() ) ?>
        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_before_ordering', array() ) ?>
        <tr>
            <th><?php _e( 'Ordering', 'wp-posts-carousel' ); ?></th>
            <td>
                <select class="select wp-posts-carousel-field" name="wp_posts_carousel[ordering]" id="ordering" class="select">
                <?php
                    $ordering_list = WP_Posts_Carousel_Utils::get_orderings();
                    foreach( $ordering_list as $key => $list ) {
                        echo '<option value="' . esc_attr( $key ) . '" ' . ( esc_attr( $data['ordering'] ) == esc_attr( $key ) ? 'selected="selected"' : null ) . '>' . esc_html( $list ) . '</option>';
                    }
                ?>
                </select>
            </td>
        </tr>
        <?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_ordering', array() ) ?>
    </tbody>
</table>

<?php do_action( 'wp_posts_carousel_post_criteria_meta_box_after_table', array() ) ?>
