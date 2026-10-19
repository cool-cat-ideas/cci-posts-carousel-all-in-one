<?php
// Isolated public feature-filter contract. No database, WordPress install or network.
define( 'ABSPATH', __DIR__ );
function __( $text, $domain = '' ) {
	return $text; }
function sanitize_key( $value ) {
	return preg_replace( '/[^a-z0-9_-]/', '', strtolower( $value ) ); }
function sanitize_text_field( $value ) {
	return strip_tags( (string) $value ); }
function apply_filters( $hook, $value, ...$args ) {
	if ( $hook === 'wp_posts_carousel_features' ) {
		$value['external_adapter'] = [
			'label'   => 'External',
			'source'  => 'addon',
			'enabled' => true,
			'author'  => '<b>Example company</b>',
			'version' => '2.3.4',
		];
		$value['paid_adapter']     = [
			'label'   => 'Paid',
			'source'  => 'addon',
			'plan'    => 'paid',
			'enabled' => true,
			'author'  => 'Example company',
			'version' => '1.2.0',
		];
	}
	return $value;
}
require dirname( __DIR__, 2 ) . '/includes/features/class-features.php';
$features = WP_Posts_Carousel_Features::public_data();
if ( $features['external_adapter']['author'] !== 'Example company' || $features['external_adapter']['version'] !== '2.3.4' ) {
	throw new RuntimeException( 'Registered add-on metadata was discarded or not sanitized.' );
}
if ( $features['paid_adapter']['enabled'] || $features['paid_adapter']['version'] !== '1.2.0' ) {
	throw new RuntimeException( 'Metadata changed paid feature gates.' );
}
echo "PASS Public add-on author and version survive normalization without changing feature gates.\n";
