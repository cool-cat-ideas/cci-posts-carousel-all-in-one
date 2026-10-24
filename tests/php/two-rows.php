<?php
/** Local WordPress integration regression; all created records are removed. */
if ( PHP_SAPI !== 'cli' ) {
	exit; }
require '/var/www/html/wp-load.php';
if ( ! in_array( wp_parse_url( home_url(), PHP_URL_HOST ), array( 'localhost', '127.0.0.1' ), true ) ) {
	throw new RuntimeException( 'Local WordPress required.' ); }
$count        = 0;
$posts        = array();
$carousel_ids = array();
function cci_rows_expect( $condition, $label ) {
	global $count;
	if ( ! $condition ) {
		throw new RuntimeException( $label ); }
	++$count;
}
try {
	for ( $i = 0; $i < 7; $i++ ) {
		$posts[] = wp_insert_post(
			array(
				'post_type'    => 'post',
				'post_status'  => 'publish',
				'post_title'   => 'Row fixture ' . $i,
				'post_content' => 'A visible card.',
			)
		);
	}
	$base   = array(
		'version'  => 2,
		'status'   => 'publish',
		'source'   => array(
			'mode'       => 'manual',
			'post_types' => array( 'post' ),
			'limit'      => 7,
		),
		'curation' => array(
			'mode'  => 'manual',
			'items' => array_map(
				static function ( $id ) {
					return array(
						'type' => 'post',
						'id'   => $id,
					); },
				$posts
			),
		),
		'engine'   => array(
			'name'    => 'owl-carousel',
			'options' => array(
				'rows'            => 2,
				'mobile_rows'     => 1,
				'row_gap'         => 20,
				'rows_mobile_max' => 767,
				'breakpoints'     => array(
					320  => 1,
					1000 => 3,
				),
				'auto_play'       => false,
			),
		),
		'template' => array( 'name' => 'default' ),
	);
	$legacy = WP_Posts_Carousel_Config::normalize(
		array(
			'carousel_type'    => 'owl-carousel',
			'carousel_options' => array( 'rows' => '2' ),
		)
	);
	cci_rows_expect( $legacy['engine']['options']['rows'] === 2, 'Legacy admin values normalize to two rows' );
	$default = WP_Posts_Carousel_Config::normalize( array() );
	cci_rows_expect( $default['engine']['options']['rows'] === 1, 'Existing carousels default to one row' );
	$bad                      = $base;
	$bad['engine']['options'] = array(
		'rows'            => array( 2 ),
		'mobile_rows'     => 9,
		'rows_mobile_max' => -10,
		'row_gap'         => 900,
	);
	$normalized               = WP_Posts_Carousel_Config::normalize( $bad );
	cci_rows_expect( $normalized['engine']['options']['rows'] === 1 && $normalized['engine']['options']['mobile_rows'] === 1, 'Invalid row counts cannot activate layout' );
	cci_rows_expect( $normalized['engine']['options']['rows_mobile_max'] === 320 && $normalized['engine']['options']['row_gap'] === 100, 'Layout bounds enforced' );
	foreach ( array( 'owl-carousel', 'swiper' ) as $engine ) {
		foreach ( array( 'default', 'light', 'simple' ) as $template ) {
			$config                     = $base;
			$config['engine']['name']   = $engine;
			$config['template']['name'] = $template;
			$saved                      = WP_Posts_Carousel_Repository::create( 'Two-row regression', $config );
			cci_rows_expect( ! is_wp_error( $saved ), 'Create fixture' );
			$carousel_ids[] = $saved->ID;
			$roundtrip      = WP_Posts_Carousel_Repository::get_config( $saved->ID );
			cci_rows_expect( $roundtrip['engine']['options']['rows'] === 2, 'Rows survive repository round trip' );
			$data = WP_Posts_Carousel_Data::get( $saved->ID );
			cci_rows_expect( count( $data['slides'] ) === 7 && $data['engine']['options']['rows'] === 2, 'Public data preserves seven distinct cards' );
			$html = ( new WP_Posts_Carousel_Generator() )->generate_from_config(
				$roundtrip,
				array(
					'id'                    => $saved->ID,
					'force_editor_renderer' => true,
				)
			);
			cci_rows_expect( strpos( $html, 'data-wpc-renderer="php"' ) !== false && substr_count( $html, 'data-wpc-slide-id=' ) === 7, 'Preview renders original template cards before grouping' );
			cci_rows_expect( strpos( $html, '.owlCarousel(' ) === false, 'Owl cannot initialize before cards are grouped' );
		}
	}
	$single                              = $base;
	$single['engine']['options']['rows'] = 1;
	$html                                = ( new WP_Posts_Carousel_Generator() )->generate_from_config( $single );
	cci_rows_expect( strpos( $html, '.owlCarousel(' ) !== false, 'Single-row Owl initializer unchanged' );
	$unsupported                     = $base;
	$unsupported['template']['name'] = 'video-showcase';
	cci_rows_expect( ! WP_Posts_Carousel_Config::uses_two_rows( $unsupported ), 'Specialist templates keep their own layout' );
	$private_id = $carousel_ids[0];
	wp_update_post(
		array(
			'ID'          => $private_id,
			'post_status' => 'private',
		)
	);
	wp_set_current_user( 0 );
	$response = rest_get_server()->dispatch( new WP_REST_Request( 'GET', '/wp-posts-carousel/v1/carousel/' . $private_id ) );
	cci_rows_expect( $response->get_status() >= 400, 'Two-row data cannot expose private carousels' );
	echo wp_json_encode( array( 'passed' => $count ) ) . "\n";
} finally {
	foreach ( $carousel_ids as $id ) {
		WP_Posts_Carousel_Repository::delete( $id ); }
	foreach ( $posts as $id ) {
		wp_delete_post( $id, true ); }
}
