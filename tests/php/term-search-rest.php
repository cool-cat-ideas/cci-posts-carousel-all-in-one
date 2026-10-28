<?php
/** Real WordPress REST regression. Run in the dev container with a wp-load.php path. */
if ( PHP_SAPI !== 'cli' || empty( $argv[1] ) ) {
	throw new RuntimeException( 'Pass the local wp-load.php path.' );
}
require $argv[1];
$admin = get_users(
	array(
		'role'   => 'administrator',
		'number' => 1,
		'fields' => 'ID',
	)
);
if ( empty( $admin ) ) {
	throw new RuntimeException( 'A local administrator is required.' );
}
$previous_user = get_current_user_id();
wp_set_current_user( (int) $admin[0] );
$created      = array();
$prefix       = 'CCI term regression ' . wp_generate_uuid4();
$mode         = '';
$count        = 0;
$query_args   = array();
$assert       = function ( $condition, $message ) use ( &$count ) {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
	++$count;
	echo 'PASS: ' . $message . PHP_EOL;
};
$request      = function ( $params ) {
	$request = new WP_REST_Request( 'POST', '/wp-posts-carousel/v1/admin/terms' );
	$request->set_header( 'Content-Type', 'application/json' );
	$request->set_body( wp_json_encode( $params ) );
	return rest_do_request( $request );
};
$args_filter  = function ( $args ) use ( &$query_args ) {
	$query_args = $args;
	return $args;
};
$terms_filter = function ( $terms, $taxonomies, $args ) use ( &$mode, $prefix ) {
	if ( ( $args['search'] ?? '' ) !== $prefix ) {
		return $terms;
	}
	if ( 'error' === $mode ) {
		return new WP_Error( 'fixture_terms_unavailable', 'Temporary term query failure.', array( 'status' => 503 ) );
	}
	if ( 'invalid' === $mode ) {
		return false;
	}
	if ( 'sparse' === $mode && is_array( $terms ) ) {
		return array_combine( range( 10, 9 + count( $terms ) ), $terms );
	}
	return $terms;
};
add_filter( 'get_terms_args', $args_filter, 999 );
add_filter( 'get_terms', $terms_filter, 999, 3 );
try {
	foreach ( array( 'category', 'post_tag' ) as $taxonomy ) {
		$term = wp_insert_term( $prefix, $taxonomy );
		if ( is_wp_error( $term ) ) {
			throw new RuntimeException( $term->get_error_message() );
		}
		$created[] = array( $term['term_id'], $taxonomy );
	}
	$params   = array(
		'taxonomy'  => 'category',
		'post_type' => 'post',
		's'         => $prefix,
	);
	$response = $request( $params );
	$data     = $response->get_data();
	$assert( 200 === $response->get_status() && 1 === count( $data ) && 'category' === $data[0]['post_type'], 'Authenticated category search returns the matching native term.' );
	$assert( 50 === $query_args['number'] && false === $query_args['hide_empty'], 'Term search is bounded and includes categories without posts.' );
	$tags = $request( array_merge( $params, array( 'taxonomy' => 'post_tag' ) ) )->get_data();
	$assert( 1 === count( $tags ) && 'post_tag' === $tags[0]['post_type'], 'Tag search stays inside the requested taxonomy.' );
	$empty = $request( array_merge( $params, array( 's' => $prefix . ' missing' ) ) );
	$assert( 200 === $empty->get_status() && array() === $empty->get_data(), 'No matches return an empty JSON list.' );
	$mode   = 'sparse';
	$sparse = $request( $params );
	$assert( 200 === $sparse->get_status() && '[' === substr( wp_json_encode( $sparse->get_data() ), 0, 1 ), 'Filtered term arrays with nonzero keys remain JSON lists.' );
	$mode    = 'error';
	$failure = $request( $params );
	$assert( 503 === $failure->get_status() && 'fixture_terms_unavailable' === $failure->get_data()['code'], 'Native WP_Error preserves its status and code without a PHP fatal error.' );
	$mode    = 'invalid';
	$invalid = $request( $params );
	$assert( 500 === $invalid->get_status() && 'wp_posts_carousel_invalid_terms' === $invalid->get_data()['code'], 'Unexpected term-filter output becomes a structured server error.' );
	$mode = '';
	foreach ( array(
		array( 'post_type' => 'post' ),
		array(
			'taxonomy'  => 'cci_missing_taxonomy',
			'post_type' => 'post',
		),
		array(
			'taxonomy'  => array( 'category' ),
			'post_type' => 'post',
		),
		array(
			'taxonomy'  => 'category',
			'post_type' => 'page',
		),
		array(
			'taxonomy'  => 'category',
			'post_type' => array( 'post' ),
		),
		array(
			'taxonomy' => 'category',
			's'        => array( 'text' ),
		),
	) as $invalid_params ) {
		$assert( 400 === $request( $invalid_params )->get_status(), 'Invalid taxonomy/type/search input returns HTTP 400.' );
	}
	$request( array_merge( $params, array( 's' => '0' ) ) );
	$assert( '0' === $query_args['search'], 'The search phrase 0 is not discarded as empty.' );
	$assert(
		200 === $request(
			array(
				'taxonomy' => 'category',
				's'        => $prefix,
			)
		)->get_status(),
		'Legacy requests that supply taxonomy without post type still work.'
	);
	foreach ( WP_Posts_Carousel_Utils::get_orders_by() as $option ) {
		$config = WP_Posts_Carousel_Config::normalize( array( 'post_selection_options' => array( 'order_by' => $option['value'] ) ) );
		$form   = WP_Posts_Carousel_Config::to_form_values( $config );
		$assert( $option['value'] === $form['post_selection_options']['order_by'], 'Ordering option survives normalization and editor reload: ' . $option['value'] );
		$again = WP_Posts_Carousel_Config::normalize( $form );
		$assert( $config['source']['order_by'] === $again['source']['order_by'], 'Ordering normalization retains existing query behavior: ' . $option['value'] );
	}
	wp_set_current_user( 0 );
	$assert( 401 === $request( $params )->get_status(), 'Anonymous visitors cannot search private editor endpoints.' );
	echo 'Native term search: ' . $count . ' checks passed.' . PHP_EOL;
} finally {
	remove_filter( 'get_terms_args', $args_filter, 999 );
	remove_filter( 'get_terms', $terms_filter, 999 );
	foreach ( $created as $term ) {
		wp_delete_term( $term[0], $term[1] );
	}
	wp_set_current_user( $previous_user );
}
