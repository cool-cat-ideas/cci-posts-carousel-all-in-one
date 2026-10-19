<?php

/**
 * Isolated marketplace regression checks. Run: php tests/php/marketplace-feed.php
 * No WordPress database, HTTP requests, or plugin activation is involved.
 */
define( 'ABSPATH', __DIR__ . '/' );
define( 'DAY_IN_SECONDS', 86400 );
putenv( 'WP_POSTS_CAROUSEL_MARKETPLACE_API_BASE' );

class WP_REST_Request {

	private $params;
	public function __construct( $params = array() ) {
		$this->params = $params; }
	public function get_param( $key ) {
		return $this->params[ $key ] ?? null; }
}

class WP_REST_Response {

	private $data;
	public function __construct( $data, $status = 200 ) {
		$this->data = $data; }
	public function get_data() {
		return $this->data; }
}

class WP_Error {

	private $message;
	public function __construct( $message ) {
		$this->message = $message; }
	public function get_error_message() {
		return $this->message; }
}

function add_action() {}
function __( $text, $domain = '' ) {
	return $text; }
function absint( $value ) {
	return abs( (int) $value ); }
function rest_sanitize_boolean( $value ) {
	return filter_var( $value, FILTER_VALIDATE_BOOLEAN ); }
function sanitize_key( $value ) {
	return preg_replace( '/[^a-z0-9_-]/', '', strtolower( $value ) ); }
function sanitize_text_field( $value ) {
	return strip_tags( (string) $value ); }
function get_user_locale() {
	return 'en_US'; }
function apply_filters( $name, $value ) {
	return $value; }
function esc_url_raw( $value ) {
	return $value; }
function wp_parse_url( $value ) {
	return parse_url( $value ); }
function untrailingslashit( $value ) {
	return rtrim( $value, '/' ); }
function trailingslashit( $value ) {
	return rtrim( $value, '/' ) . '/'; }
function add_query_arg( $args, $url ) {
	return $url . '?' . http_build_query( $args ); }
function current_time( $format ) {
	return '2026-09-14 12:00:00'; }
function is_wp_error( $value ) {
	return $value instanceof WP_Error; }
function wp_remote_retrieve_response_code( $response ) {
	return $response['status']; }
function wp_remote_retrieve_body( $response ) {
	return $response['body']; }
function get_transient( $key ) {
	return $GLOBALS['feed_test']['cache'][ $key ] ?? false; }
function set_transient( $key, $value, $ttl ) {
	$GLOBALS['feed_test']['cache'][ $key ]  = $value;
	$GLOBALS['feed_test']['writes'][ $key ] = $ttl;
	return true;
}
function wp_remote_get( $url, $args ) {
	$GLOBALS['feed_test']['requests'][] = $url;
	if ( ! $GLOBALS['feed_test']['responses'] ) {
		throw new RuntimeException( 'Unexpected remote request; no network access is permitted in tests.' );
	}
	return array_shift( $GLOBALS['feed_test']['responses'] );
}

require dirname( __DIR__, 2 ) . '/includes/api/class-api.php';
require dirname( __DIR__, 2 ) . '/includes/admin/class-admin.php';

$api       = ( new ReflectionClass( 'WP_Posts_Carousel_API' ) )->newInstanceWithoutConstructor();
$admin     = ( new ReflectionClass( 'WP_Posts_Carousel_Admin' ) )->newInstanceWithoutConstructor();
$bootstrap = new ReflectionMethod( $admin, 'marketplace_initial_feed' );
$bootstrap->setAccessible( true );
$cache_key        = 'wpc_marketplace_feed_' . md5( 'en|5' );
$stale_key        = $cache_key . '_stale';
$fresh            = array(
	'product' => array( 'slug' => 'cci-posts-carousel-all-in-one' ),
	'news'    => array(
		array(
			'id'    => 'new',
			'title' => 'New announcement',
		),
	),
);
$old              = array(
	'product' => $fresh['product'],
	'news'    => array(
		array(
			'id'    => 'old',
			'title' => 'Cached announcement',
		),
	),
);
$empty            = array(
	'product' => $fresh['product'],
	'news'    => array(),
);
$bind_origin_feed = array(
	'product'    => array(
		'slug' => 'cci-posts-carousel-all-in-one',
		'pro'  => array( 'url' => 'https://0.0.0.0:3000/products/cci-posts-carousel-all-in-one' ),
		'free' => array( 'urls' => array( 'wordpress' => 'https://wordpress.org/plugins/wp-posts-carousel/' ) ),
	),
	'templates'  => array(
		array(
			'title' => 'Do not replace https://0.0.0.0:3000 in content.',
			'urls'  => array(
				'documentation' => 'https://0.0.0.0:3000/en/docs/cci-posts-carousel-all-in-one/2.0.0/?source=plugin#templates',
				'download'      => 'https://github.com/cool-cat-ideas/cci-posts-carousel-aurora-cards/releases/tag/v1.0.0',
			),
		),
	),
	'extensions' => array( array( 'urls' => array( 'demo' => 'https://0.0.0.0:3000/products/cci-posts-carousel-all-in-one/#related-content' ) ) ),
	'news'       => array( array( 'url' => 'https://coolcatideas.com/products/cci-posts-carousel-all-in-one/news/1/' ) ),
);
$tests            = array();

function reset_feed_test( $cache = array(), $responses = array() ) {
	$GLOBALS['feed_test'] = array(
		'cache'     => $cache,
		'responses' => $responses,
		'requests'  => array(),
		'writes'    => array(),
	);
}
function remote_feed( $data, $status = 200 ) {
	return array(
		'status' => $status,
		'body'   => json_encode( $data ),
	);
}
function check_feed( $condition, $message ) {
	if ( ! $condition ) {
		throw new RuntimeException( $message ); }
}

$tests['ordinary first GET refreshes expired data without manual retry'] = function () use ( $api, $stale_key, $cache_key, $old, $fresh ) {
	reset_feed_test( array( $stale_key => $old ), array( remote_feed( $fresh ) ) );
	$result = $api->get_plugin_feed( new WP_REST_Request() )->get_data();
	check_feed( count( $GLOBALS['feed_test']['requests'] ) === 1, 'Expired cache prevented the first remote request.' );
	check_feed( $result['news'] === $fresh['news'] && $result['_meta']['ok'] === true, 'Fresh news was not returned.' );
	check_feed( get_transient( $cache_key )['news'] === $fresh['news'] && get_transient( $stale_key )['news'] === $fresh['news'], 'Both cache tiers must receive the refreshed feed.' );
};

$tests['fresh cache avoids remote request'] = function () use ( $api, $cache_key, $fresh ) {
	reset_feed_test( array( $cache_key => $fresh ) );
	$result = $api->get_plugin_feed( new WP_REST_Request() )->get_data();
	check_feed( $result['news'] === $fresh['news'] && $result['_meta']['source'] === 'cache', 'Fresh cache was not used.' );
	check_feed( ! $GLOBALS['feed_test']['requests'] && ! $GLOBALS['feed_test']['writes'], 'Fresh cache triggered remote work.' );
};

$tests['manual refresh bypasses fresh cache'] = function () use ( $api, $cache_key, $old, $fresh ) {
	reset_feed_test( array( $cache_key => $old ), array( remote_feed( $fresh ) ) );
	$result = $api->get_plugin_feed( new WP_REST_Request( array( 'force' => '1' ) ) )->get_data();
	check_feed( $result['news'] === $fresh['news'] && count( $GLOBALS['feed_test']['requests'] ) === 1, 'Forced refresh returned cached news.' );
};

$tests['actual network failure may return stale news'] = function () use ( $api, $stale_key, $old ) {
	reset_feed_test( array( $stale_key => $old ), array( new WP_Error( 'Connection timed out.' ) ) );
	$result = $api->get_plugin_feed( new WP_REST_Request() )->get_data();
	check_feed( count( $GLOBALS['feed_test']['requests'] ) === 1 && $result['news'] === $old['news'], 'Fallback happened without attempting remote refresh.' );
	check_feed( $result['_meta']['ok'] === false && $result['_meta']['stale'] === true, 'A stale fallback was reported as current.' );
	check_feed( ! $GLOBALS['feed_test']['writes'], 'A failed refresh poisoned the cache.' );
};

$invalid_responses = array(
	'malformed JSON'    => array(
		'status' => 200,
		'body'   => '{invalid',
	),
	'missing news'      => remote_feed( array( 'product' => $fresh['product'] ) ),
	'invalid news type' => remote_feed(
		array(
			'product' => $fresh['product'],
			'news'    => null,
		)
	),
	'missing product'   => remote_feed( array( 'news' => array() ) ),
	'business failure'  => remote_feed( array_merge( $empty, array( 'success' => false ) ) ),
	'failed metadata'   => remote_feed( array_merge( $empty, array( '_meta' => array( 'ok' => false ) ) ) ),
	'stale metadata'    => remote_feed( array_merge( $empty, array( '_meta' => array( 'stale' => true ) ) ) ),
	'HTTP error'        => remote_feed( $fresh, 503 ),
);
foreach ( $invalid_responses as $name => $response ) {
	$tests[ 'REST rejects ' . $name . ' without caching it as empty' ] = function () use ( $api, $response ) {
		reset_feed_test( array(), array( $response ) );
		$result = $api->get_plugin_feed( new WP_REST_Request() )->get_data();
		check_feed( $result['_meta']['ok'] === false && ! empty( $result['_meta']['error'] ), 'An invalid feed became a successful empty state.' );
		check_feed( ! $GLOBALS['feed_test']['writes'], 'Invalid remote data was cached.' );
	};
	$tests[ 'bootstrap rejects ' . $name ]                             = function () use ( $admin, $bootstrap, $response ) {
		reset_feed_test( array(), array( $response ) );
		check_feed( $bootstrap->invoke( $admin ) === null, 'Invalid bootstrap data was accepted.' );
		check_feed( ! $GLOBALS['feed_test']['writes'], 'Invalid bootstrap data was cached.' );
	};
}

$tests['invalid legacy fresh cache is refreshed automatically'] = function () use ( $api, $cache_key, $fresh ) {
	reset_feed_test( array( $cache_key => array( 'news' => array() ) ), array( remote_feed( $fresh ) ) );
	$result = $api->get_plugin_feed( new WP_REST_Request() )->get_data();
	check_feed( $result['news'] === $fresh['news'] && count( $GLOBALS['feed_test']['requests'] ) === 1, 'Invalid legacy cache blocked recovery.' );
};

$tests['REST accepts and caches a legitimate empty news list'] = function () use ( $api, $cache_key, $empty ) {
	reset_feed_test( array(), array( remote_feed( $empty ) ) );
	$result = $api->get_plugin_feed( new WP_REST_Request() )->get_data();
	check_feed( $result['_meta']['ok'] === true && $result['news'] === array(), 'A genuine empty feed became an error.' );
	check_feed( get_transient( $cache_key )['news'] === array(), 'A valid empty feed was not cached.' );
};

$tests['bootstrap accepts a legitimate empty news list'] = function () use ( $admin, $bootstrap, $cache_key, $empty ) {
	reset_feed_test( array(), array( remote_feed( $empty ) ) );
	$result = $bootstrap->invoke( $admin );
	check_feed( $result['_meta']['ok'] === true && $result['news'] === array(), 'A genuine empty bootstrap became an error.' );
	check_feed( get_transient( $cache_key )['news'] === array(), 'A valid empty bootstrap was not cached.' );
};

$tests['bootstrap supplies fresh cache without blocking on network'] = function () use ( $admin, $bootstrap, $cache_key, $fresh ) {
	reset_feed_test( array( $cache_key => $fresh ) );
	$result = $bootstrap->invoke( $admin );
	check_feed( $result['news'] === $fresh['news'] && $result['_meta']['ok'] === true, 'Fresh bootstrap cache was not used.' );
	check_feed( ! $GLOBALS['feed_test']['requests'], 'Fresh bootstrap triggered remote work.' );
};

$tests['bootstrap may supply stale news while subsequent GET refreshes'] = function () use ( $admin, $bootstrap, $api, $stale_key, $old, $fresh ) {
	reset_feed_test( array( $stale_key => $old ), array( remote_feed( $fresh ) ) );
	$initial = $bootstrap->invoke( $admin );
	check_feed( $initial['news'] === $old['news'] && $initial['_meta']['stale'] === true, 'Bootstrap failed to mark expired data.' );
	check_feed( ! $GLOBALS['feed_test']['requests'], 'Stale bootstrap blocked on network.' );
	$result = $api->get_plugin_feed( new WP_REST_Request() )->get_data();
	check_feed( $result['news'] === $fresh['news'] && $result['_meta']['stale'] === false, 'The first GET kept returning bootstrap stale data.' );
};

$tests['catalog links repair bind origins while preserving external URLs and content'] = function () use ( $bind_origin_feed ) {
	$result = WP_Posts_Carousel_API::normalize_marketplace_feed_urls( $bind_origin_feed );
	check_feed( $result['product']['pro']['url'] === WP_Posts_Carousel_API::MARKETPLACE_PRODUCT_URL, 'Pro CTA retained the server listen address.' );
	check_feed( $result['templates'][0]['urls']['documentation'] === 'https://coolcatideas.com/en/docs/cci-posts-carousel-all-in-one/2.0.0/?source=plugin#templates', 'Documentation path, query or fragment changed.' );
	check_feed( $result['extensions'][0]['urls']['demo'] === WP_Posts_Carousel_API::MARKETPLACE_PRODUCT_URL . '/#related-content', 'Extension demo link was not repaired.' );
	check_feed( $result['product']['free'] === $bind_origin_feed['product']['free'], 'WordPress link changed.' );
	check_feed( $result['templates'][0]['urls']['download'] === $bind_origin_feed['templates'][0]['urls']['download'], 'GitHub download link changed.' );
	check_feed( $result['templates'][0]['title'] === $bind_origin_feed['templates'][0]['title'], 'Feed content was globally rewritten.' );
	check_feed( $result['news'] === $bind_origin_feed['news'], 'Valid news links changed.' );
};

$tests['catalog links preserve intentional development and demo destinations'] = function () {
	$urls   = array(
		'demo'          => 'http://localhost:3000/products/example/',
		'documentation' => 'https://demo.example.com/docs/example/',
		'download'      => 'http://127.0.0.1:8080/package.zip',
	);
	$result = WP_Posts_Carousel_API::normalize_marketplace_feed_urls( array( 'product' => array( 'free' => array( 'urls' => $urls ) ) ) );
	check_feed( $result['product']['free']['urls'] === $urls, 'Valid development or demo links were rewritten.' );
};

$tests['catalog URL validation rejects invalid schemes and limits rebasing to known paths'] = function () {
	$urls   = array(
		'script'      => 'javascript:alert(1)',
		'credentials' => 'https://user:pass@example.com/products/example/',
		'unrelated'   => 'https://0.0.0.0:3000/private-route/',
		'relative'    => '/products/example/?source=plugin#details',
		'ipv6'        => 'http://[::]:3000/docs/example/',
		'similarHost' => 'https://0.0.0.0.example.com/products/example/',
	);
	$result = WP_Posts_Carousel_API::normalize_marketplace_feed_urls( array( 'product' => array( 'free' => array( 'urls' => $urls ) ) ) )['product']['free']['urls'];
	check_feed( $result['script'] === '' && $result['credentials'] === '' && $result['unrelated'] === '', 'Unsafe or unrecognized links were exposed.' );
	check_feed( $result['relative'] === 'https://coolcatideas.com/products/example/?source=plugin#details', 'Relative catalog link did not resolve against the public origin.' );
	check_feed( $result['ipv6'] === 'https://coolcatideas.com/docs/example/', 'IPv6 listen address remained in the catalog link.' );
	check_feed( $result['similarHost'] === $urls['similarHost'], 'A public hostname was treated as a listen address substring.' );
};

foreach ( array( 'fresh', 'remote', 'stale' ) as $source ) {
	$tests[ 'REST repairs catalog links from ' . $source . ' data' ]      = function () use ( $api, $cache_key, $stale_key, $bind_origin_feed, $source ) {
		$cache     = $source === 'remote' ? array() : array( ( $source === 'fresh' ? $cache_key : $stale_key ) => $bind_origin_feed );
		$responses = $source === 'fresh' ? array() : array( $source === 'remote' ? remote_feed( $bind_origin_feed ) : new WP_Error( 'Connection timed out.' ) );
		reset_feed_test( $cache, $responses );
		$result = $api->get_plugin_feed( new WP_REST_Request() )->get_data();
		check_feed( $result['product']['pro']['url'] === WP_Posts_Carousel_API::MARKETPLACE_PRODUCT_URL, 'REST returned a broken Pro link.' );
		if ( $source === 'remote' ) {
			check_feed( get_transient( $cache_key )['product']['pro']['url'] === WP_Posts_Carousel_API::MARKETPLACE_PRODUCT_URL, 'REST cached an invalid public link.' );
		}
	};
	$tests[ 'bootstrap repairs catalog links from ' . $source . ' data' ] = function () use ( $admin, $bootstrap, $cache_key, $stale_key, $bind_origin_feed, $source ) {
		$cache = $source === 'remote' ? array() : array( ( $source === 'fresh' ? $cache_key : $stale_key ) => $bind_origin_feed );
		reset_feed_test( $cache, $source === 'remote' ? array( remote_feed( $bind_origin_feed ) ) : array() );
		$result = $bootstrap->invoke( $admin );
		check_feed( $result['product']['pro']['url'] === WP_Posts_Carousel_API::MARKETPLACE_PRODUCT_URL, 'Initial admin data returned a broken Pro link.' );
		if ( $source === 'remote' ) {
			check_feed( get_transient( $cache_key )['product']['pro']['url'] === WP_Posts_Carousel_API::MARKETPLACE_PRODUCT_URL, 'Bootstrap cached an invalid public link.' );
		}
	};
}

$failed = 0;
foreach ( $tests as $name => $test ) {
	try {
		$test();
		echo 'PASS ' . $name . PHP_EOL;
	} catch ( Throwable $error ) {
		$failed++;
		fwrite( STDERR, 'FAIL ' . $name . ': ' . $error->getMessage() . PHP_EOL );
	}
}
echo count( $tests ) . ' checks, ' . $failed . ' failures.' . PHP_EOL;
exit( $failed ? 1 : 0 );
