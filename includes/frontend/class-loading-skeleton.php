<?php

defined( 'ABSPATH' ) || exit;

/** Loading presentation for carousels whose cards arrive asynchronously. */
class WP_Posts_Carousel_Loading_Skeleton {
	public static function render( $config, $post_id, $instance_id, $template ) {
		$options = $config['engine']['options'];
		$breakpoints = ! empty( $options['items_to_show'] ) ? $options['items_to_show'] : array( 0 => 1 );
		$rows = WP_Posts_Carousel_Config::uses_two_rows( $config ) ? 2 : 1;
		$vertical = ( $config['engine']['name'] ?? '' ) === 'swiper' && ( $options['direction'] ?? '' ) === 'vertical';
		if ( $vertical ) {
			$breakpoints = array( 0 => 1 );
		}
		$args = array(
			'post_id' => absint( $post_id ),
			'instance_id' => $instance_id,
			'config' => $config,
			'template' => $template,
			'rows' => $rows,
			'card_count' => min( 24, max( 1, max( array_values( $breakpoints ) ) ) * $rows ),
		);
		$default = WP_POSTS_CAROUSEL_DIR_PATH . 'templates/partials/skeleton.php';
		$path = locate_template( array( 'cci-posts-carousel/skeleton.php' ), false, false );
		if ( ! $path && is_readable( $template['dir'] . '/skeleton.php' ) ) {
			$path = $template['dir'] . '/skeleton.php';
		}
		$path = apply_filters( 'wp_posts_carousel_skeleton_template', $path ?: $default, $args );
		if ( ! is_string( $path ) || ! is_file( $path ) || ! is_readable( $path ) ) {
			$path = $default;
		}
		ob_start();
		include $path;
		$html = ob_get_clean();
		$filtered = apply_filters( 'wp_posts_carousel_skeleton_html', $html, $args );
		$html = is_string( $filtered ) ? $filtered : $html;
		$selector = '[data-wpc-skeleton-for="' . sanitize_html_class( $instance_id ) . '"]';
		$rules = '';
		if ( $vertical ) {
			$rules = $selector . '{min-height:' . absint( $options['vertical_height'] ?? 480 ) . 'px;}';
		}
		foreach ( $breakpoints as $width => $columns ) {
			$columns = max( 1, min( 12, absint( $columns ) ) );
			$rules .= '@media(min-width:' . absint( $width ) . 'px){' . $selector . '{--wpc-skeleton-columns:' . $columns . ';}' . $selector . ' .cci-wpc-skeleton-card{display:block;}' . $selector . ' .cci-wpc-skeleton-card:nth-child(n+' . ( $columns * $rows + 1 ) . '){display:none;}}';
		}
		if ( $rows === 2 && ( $options['mobile_rows'] ?? 1 ) === 1 ) {
			foreach ( $breakpoints as $width => $columns ) {
				$rules .= '@media(min-width:' . absint( $width ) . 'px) and (max-width:' . absint( $options['rows_mobile_max'] ?? 767 ) . 'px){' . $selector . ' .cci-wpc-skeleton-card:nth-child(n+' . ( min( 12, absint( $columns ) ) + 1 ) . '){display:none;}}';
			}
		}
		return '<div data-wpc-loading-presentation data-wpc-loading-state="loading">'
			. '<style>' . $rules . '</style>'
			. '<div data-wpc-skeleton-for="' . esc_attr( $instance_id ) . '" class="cci-wpc-skeleton" aria-hidden="true" inert>' . $html . '</div>'
			. '<p class="screen-reader-text" data-wpc-loading-message role="status" data-wpc-error-label="' . esc_attr__( 'The carousel could not be loaded.', 'cci-posts-carousel' ) . '" data-wpc-loading-label="' . esc_attr__( 'Loading carousel…', 'cci-posts-carousel' ) . '">' . esc_html__( 'Loading carousel…', 'cci-posts-carousel' ) . '</p>'
			. '<button type="button" data-wpc-loading-retry hidden>' . esc_html__( 'Try again', 'cci-posts-carousel' ) . '</button>'
			. '</div>';
	}
}
