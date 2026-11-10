<?php
// Local WordPress regression: record the actual editor, not the post author.
if ( PHP_SAPI !== 'cli' ) {
	exit;
}
require '/var/www/html/wp-load.php';
if ( ! in_array( wp_parse_url( home_url(), PHP_URL_HOST ), array( 'localhost', '127.0.0.1' ), true ) ) {
	throw new RuntimeException( 'Local WordPress required.' );
}
$original_user = get_current_user_id();
$fixtures      = array();
$checks        = 0;
function editor_check( $condition, $message ) {
	global $checks;
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
	++$checks;
}
try {
	$admins = get_users(
		array(
			'role'   => 'administrator',
			'number' => 1,
		)
	);
	editor_check( count( $admins ) === 1, 'A local administrator is required.' );
	wp_set_current_user( 0 );
	$post = WP_Posts_Carousel_Repository::create( 'Editor regression fixture', array( 'status' => 'draft' ) );
	editor_check( $post instanceof WP_Post, 'Fixture creation failed.' );
	$fixtures[] = $post->ID;
	editor_check( ! get_post_meta( $post->ID, '_edit_last', true ), 'Do not invent an editor for a CLI write.' );
	wp_set_current_user( $admins[0]->ID );
	$result = WP_Posts_Carousel_Repository::update( $post->ID, 'Edited fixture', array( 'status' => 'draft' ) );
	editor_check( ! is_wp_error( $result ), 'Authenticated update failed.' );
	editor_check( (int) get_post_meta( $post->ID, '_edit_last', true ) === $admins[0]->ID, 'Store the actual editor.' );
	editor_check( (int) get_post( $post->ID )->post_author !== $admins[0]->ID, 'The author and editor must remain distinct.' );
	$rows = WP_Posts_Carousel_Repository::all();
	$row  = array_values(
		array_filter(
			$rows,
			static function ( $row ) use ( $post ) {
				return (int) $row['ID'] === $post->ID;
			}
		)
	)[0];
	editor_check( $row['modified_by_name'] === $admins[0]->display_name, 'The table must show the actual user record.' );
	wp_set_current_user( 0 );
	WP_Posts_Carousel_Repository::update( $post->ID, 'CLI fixture', array( 'status' => 'draft' ) );
	editor_check( ! get_post_meta( $post->ID, '_edit_last', true ), 'An unknown later writer must not be attributed to a previous editor.' );
	wp_set_current_user( $admins[0]->ID );
	$created = WP_Posts_Carousel_Repository::create( 'Created fixture', array( 'status' => 'draft' ) );
	editor_check( $created instanceof WP_Post, 'Authenticated creation failed.' );
	$fixtures[] = $created->ID;
	editor_check( (int) get_post_meta( $created->ID, '_edit_last', true ) === $admins[0]->ID, 'Record the initial editor on creation.' );
	$request = new WP_REST_Request( 'GET', '/wp-posts-carousel/v1/admin/carousel/' . $post->ID );
	$response = rest_do_request( $request );
	editor_check( $response->get_status() === 200, 'Authorized editor details must load.' );
	$metadata = $response->get_data()['post']['metadata'];
	editor_check( $metadata['created_by_name'] === '', 'Unknown creators must not inherit the current user.' );
	editor_check( $metadata['modified_by_name'] === '', 'Unknown CLI writers must remain unknown in editor details.' );
	$created_at = $metadata['created_at'];
	// Simulate core advancing the draft publication date after its initial save.
	global $wpdb;
	$wpdb->update( $wpdb->posts, array( 'post_date' => '2020-01-02 03:04:05' ), array( 'ID' => $post->ID ) );
	clean_post_cache( $post->ID );
	$request = new WP_REST_Request( 'PUT', '/wp-posts-carousel/v1/admin/carousel/' . $post->ID );
	$request->set_header( 'Content-Type', 'application/json' );
	$request->set_body( wp_json_encode( array( 'title' => 'Updated metadata fixture', 'status' => 'draft' ) ) );
	$response = rest_do_request( $request );
	editor_check( $response->get_status() === 200, 'Authenticated REST update failed.' );
	$metadata = $response->get_data()['metadata'];
	editor_check( $metadata['created_at'] === $created_at, 'Saving must preserve the creation date.' );
	editor_check( $metadata['modified_by_name'] === $admins[0]->display_name, 'Save response must refresh the actual editor.' );
	editor_check( $metadata['created_by_name'] === '', 'Saving must preserve the unknown creator.' );
	$request = new WP_REST_Request( 'GET', '/wp-posts-carousel/v1/admin/carousel/' . $created->ID );
	$response = rest_do_request( $request );
	$metadata = $response->get_data()['post']['metadata'];
	editor_check( $metadata['created_by_name'] === $admins[0]->display_name, 'Read the actual creator display name.' );
	wp_set_current_user( 0 );
	$response = rest_do_request( $request );
	editor_check( $response->get_status() === 401 || $response->get_status() === 403, 'Anonymous requests must not expose editor details.' );

} finally {
	foreach ( $fixtures as $id ) {
		WP_Posts_Carousel_Repository::delete( $id );
	}
	wp_set_current_user( $original_user );
}
echo json_encode( array( 'passed' => $checks ) ) . "\n";
