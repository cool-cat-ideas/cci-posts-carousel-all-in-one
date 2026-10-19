<?php
// Pure activation-state regression tests. No WordPress database is loaded.
define( 'ABSPATH', '/tmp/' );
define( 'WP_PLUGIN_DIR', '/tmp/cci-carousel-identity-fixture' );
function add_action() {}
$filters = array();
function add_filter( $name, $callback ) {
	global $filters;
	$filters[ $name ] = $callback;}
require $argv[1];
$old    = 'wp-posts-carousel/wp-posts-carousel.php';
$new    = CCI_Carousel_Identity::PACKAGES[ $old ];
$checks = 0;
function check( $actual, $expected, $message ) {
	global $checks;
	if ($actual !== $expected)throw new RuntimeException( $message );
	$checks++;}
check( CCI_Carousel_Identity::migrateList( array( 'unrelated/a.php', $old, 'other/b.php' ), array( $new ) ), array( 'unrelated/a.php', $new, 'other/b.php' ), 'Preserve unrelated plugins and activation order.' );
check( CCI_Carousel_Identity::migrateList( array( $old ), array() ), array( $old ), 'Keep old activation when new package is absent.' );
check( CCI_Carousel_Identity::migrateList( array( $old, $new ), array( $new ) ), array( $new ), 'Do not activate both identities.' );
check( CCI_Carousel_Identity::migrateList( array( 'wp-posts-carousel-evil/a.php' ), array( $new ) ), array( 'wp-posts-carousel-evil/a.php' ), 'Match exact package paths only.' );
check( CCI_Carousel_Identity::migrateList( array( $new ), array( $new ) ), array( $new ), 'Repeated migration is stable.' );
$state = array(
	'active_plugins'            => array( 'unrelated/a.php', $old, $new ),
	'wp-posts-carousel_options' => array( 'preserved' => true ),
);
function is_multisite() {
	return false;}
function get_current_blog_id() {
	return 1;}
function get_option( $key, $default = false ) {
	global $state;
	return $state[ $key ] ?? $default;}
function update_option( $key, $value ) {
	global $state;
	$state[ $key ] = $value;}
function add_option( $key, $value ) {
	global $state;
	$state[ $key ] = $value;}
@mkdir( WP_PLUGIN_DIR . '/cci-posts-carousel', 0777, true );
file_put_contents( WP_PLUGIN_DIR . '/' . $new, '<?php' );
CCI_Carousel_Identity::activate( false, $new );
check( $state['active_plugins'], array( 'unrelated/a.php', $new ), 'Activation transfers the package entry.' );
check( $state['wp-posts-carousel_options'], array( 'preserved' => true ), 'Saved plugin settings survive activation.' );
check( $state['cci_carousel_identity_backup']['activePlugins'], array( 'unrelated/a.php', $old ), 'Rollback snapshot keeps the previous active list.' );
check( $filters['wp_plugin_dependencies_slug']( 'wp-posts-carousel' ), 'cci-posts-carousel', 'Native WordPress dependency alias.' );
check( $filters['wp_plugin_dependencies_slug']( 'unrelated' ), 'unrelated', 'Unrelated dependencies are unchanged.' );
unlink( WP_PLUGIN_DIR . '/' . $new );
rmdir( WP_PLUGIN_DIR . '/cci-posts-carousel' );
rmdir( WP_PLUGIN_DIR );
echo json_encode( array( 'passed' => $checks ) ) . PHP_EOL;
