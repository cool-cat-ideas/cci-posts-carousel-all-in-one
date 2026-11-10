<?php
// Feature lookup regression: public flags stay cheap; paid flags always use current license rules.
define( 'ABSPATH', __DIR__ );
function __( $text, $domain = '' ) {
	return $text; }
function sanitize_key( $value ) {
	return preg_replace( '/[^a-z0-9_-]/', '', strtolower( $value ) ); }
function sanitize_text_field( $value ) {
	return strip_tags( (string) $value ); }
$definitions      = array();
$allowed          = array();
$license_calls    = array();
$definition_calls = 0;
function apply_filters( $hook, $value, ...$args ) {
	global $definitions, $allowed, $license_calls, $definition_calls;
	if ( $hook === 'wp_posts_carousel_features' ) {
		++$definition_calls;
		return array_replace( $value, $definitions );
	}
	if ( $hook === 'wp_posts_carousel_paid_feature_keys' ) {
		return array( 'reserved_by_addon' );
	}
	if ( $hook === 'wp_posts_carousel_license_allows_feature' ) {
		$license_calls[] = $args[0];
		return ! empty( $allowed[ $args[0] ] );
	}
	return $value;
}
require dirname( __DIR__, 2 ) . '/includes/features/class-features.php';
function check_feature( $condition, $message ) {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
	echo 'PASS: ' . $message . "\n";
}
$definitions = array(
	'paid_adapter'      => array(
		'enabled' => true,
		'plan'    => 'paid',
	),
	'video_slides'      => array(
		'enabled' => true,
		'plan'    => 'free',
	),
	'reserved_by_addon' => array( 'enabled' => true ),
	'custom_public'     => array( 'enabled' => true ),
	'custom_dependent'  => array(
		'enabled'  => true,
		'requires' => array( 'paid_adapter' ),
	),
);
check_feature( WP_Posts_Carousel_Features::enabled( 'react_frontend' ), 'Independent public renderer remains enabled' );
check_feature( $license_calls === array() && $definition_calls === 1, 'Public lookup runs its definition filter once without unrelated license checks' );
$definitions['react_frontend'] = array( 'enabled' => false );
check_feature( ! WP_Posts_Carousel_Features::enabled( 'react_frontend' ), 'A later definition filter can disable a public feature in the same request' );
unset( $definitions['react_frontend'] );
check_feature( ! WP_Posts_Carousel_Features::enabled( 'missing' ), 'Unknown features remain disabled' );
foreach ( array(
	array(),
	array(
		'paid_adapter'      => true,
		'video_slides'      => true,
		'reserved_by_addon' => true,
	),
) as $allowed ) {
	foreach ( array( 'react_frontend', 'paid_adapter', 'video_slides', 'reserved_by_addon', 'custom_public', 'custom_dependent' ) as $key ) {
		$all = WP_Posts_Carousel_Features::all();
		check_feature( WP_Posts_Carousel_Features::enabled( $key ) === $all[ $key ]['enabled'], 'Matches complete registry for ' . $key . ' with current license state' );
	}
}
$allowed = array();
check_feature( ! WP_Posts_Carousel_Features::enabled( 'paid_adapter' ), 'Revoked license is rechecked in the same request' );
$definitions['react_frontend'] = array(
	'enabled'     => true,
	'requiresPro' => true,
);
check_feature( ! WP_Posts_Carousel_Features::enabled( 'react_frontend' ), 'Extensions cannot turn a Pro requirement into an unlicensed public feature' );
$definitions['react_frontend'] = array(
	'enabled'           => true,
	'required_features' => array( 'paid_adapter' ),
);
check_feature( ! WP_Posts_Carousel_Features::enabled( 'react_frontend' ), 'A dependency added to a public feature still enforces its license' );
