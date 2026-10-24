<?php
/** Refresh only the marked local two-row example, never on plugin activation. */
if ( PHP_SAPI !== 'cli' ) {
	exit; }
require '/var/www/html/wp-load.php';
if ( ! in_array( wp_parse_url( home_url(), PHP_URL_HOST ), array( 'localhost', '127.0.0.1' ), true ) ) {
	throw new RuntimeException( 'This example is restricted to the local WordPress stack.' );
}
$admins = get_users(
	array(
		'role'    => 'administrator',
		'orderby' => 'ID',
		'order'   => 'ASC',
		'number'  => 1,
	)
);
wp_set_current_user( $admins[0]->ID );
function cci_two_row_example_id( $type, $key ) {
	$posts = get_posts(
		array(
			'post_type'   => $type,
			'post_status' => array( 'publish', 'draft' ),
			'meta_key'    => '_cci_two_row_example',
			'meta_value'  => $key,
			'numberposts' => 1,
		)
	);
	return $posts ? $posts[0]->ID : 0;
}
$products = get_posts(
	array(
		'post_type'   => 'product',
		'post_status' => 'publish',
		'numberposts' => 8,
		'meta_query'  => array(
			array(
				'key'     => '_thumbnail_id',
				'compare' => 'EXISTS',
			),
		),
		'orderby'     => 'ID',
		'order'       => 'ASC',
	)
);
if ( count( $products ) < 8 ) {
	throw new RuntimeException( 'The example needs eight published sample products with images.' ); }
$ids = array();
// Retain the original example keys so refreshing does not create duplicate carousels.
foreach ( array(
	'owl-carousel' => 2,
	'swiper'       => 1,
) as $example_key => $rows ) {
	$config   = array(
		'version'     => 2,
		'status'      => 'publish',
		'renderer'    => 'php',
		'source'      => array(
			'mode'       => 'manual',
			'post_types' => array( 'product' ),
			'limit'      => 8,
		),
		'curation'    => array(
			'mode'  => 'manual',
			'items' => array_map(
				static function ( $post ) {
					return array(
						'type'      => 'post',
						'id'        => $post->ID,
						'post_type' => 'product',
					); },
				$products
			),
		),
		'engine'      => array(
			'name'    => 'owl-carousel',
			'options' => array(
				'rows'            => $rows,
				'mobile_rows'     => 1,
				'rows_mobile_max' => 767,
				'row_gap'         => 24,
				'loop'            => false,
				'auto_play'       => false,
				'nav'             => true,
				'dots'            => true,
				'margin'          => 24,
				'slide_by'        => 1,
				'breakpoints'     => array(
					320  => 1,
					768  => 2,
					1100 => 3,
				),
			),
		),
		'template'    => array(
			'name'    => 'default',
			'display' => array(
				'product' => array(
					'show_title'                 => true,
					'show_created_date'          => false,
					'show_categories'            => false,
					'show_author'                => false,
					'featured_image_height'      => 156,
					'featured_image_height_unit' => 'px',
					'title_length'               => 0,
					'show_featured_image'        => true,
					'show_description'           => '',
					'show_more_button'           => true,
					'featured_image_source'      => 'large',
				),
			),
		),
		'performance' => array(
			'image_size' => 'large',
			'image_fit'  => 'contain',
		),
	);
	$id       = cci_two_row_example_id( 'wp-posts-carousel', $example_key );
	$title    = 'New arrivals: ' . ( $rows === 2 ? 'two rows' : 'one row' );
	$carousel = $id ? WP_Posts_Carousel_Repository::update( $id, $title, $config ) : WP_Posts_Carousel_Repository::create( $title, $config );
	if ( is_wp_error( $carousel ) ) {
		throw new RuntimeException( $carousel->get_error_message() ); }
	update_post_meta( $carousel->ID, '_cci_two_row_example', $example_key );
	$ids[] = $carousel->ID;
}
$content = '<!-- wp:paragraph --><p>Show more of your collection before shoppers start browsing. Compare two rows with one row, using the same products and the Default template.</p><!-- /wp:paragraph -->' .
'<!-- wp:heading {"style":{"typography":{"fontSize":"32px","lineHeight":"1.2"},"spacing":{"margin":{"top":"48px","bottom":"16px"}}}} --><h2 class="wp-block-heading" style="margin-top:48px;margin-bottom:16px;font-size:32px;line-height:1.2">New arrivals</h2><!-- /wp:heading -->' .
'<!-- wp:paragraph --><p>Six products in view on desktop. Use the arrows or drag to explore all eight new arrivals. Both rows move together.</p><!-- /wp:paragraph -->' .
'<!-- wp:shortcode -->[cci_posts_carousel id="' . $ids[0] . '"]<!-- /wp:shortcode -->' .
'<!-- wp:heading {"style":{"typography":{"fontSize":"32px","lineHeight":"1.2"},"spacing":{"margin":{"top":"48px","bottom":"16px"}}}} --><h2 class="wp-block-heading" style="margin-top:48px;margin-bottom:16px;font-size:32px;line-height:1.2">The same collection in one row</h2><!-- /wp:heading -->' .
'<!-- wp:paragraph --><p>The same eight products, card design and column width. Only three products are visible at once on desktop, so visitors need more browsing to see the collection.</p><!-- /wp:paragraph -->' .
'<!-- wp:shortcode -->[cci_posts_carousel id="' . $ids[1] . '"]<!-- /wp:shortcode -->' .
'<!-- wp:heading {"style":{"typography":{"fontSize":"32px","lineHeight":"1.2"},"spacing":{"margin":{"top":"48px","bottom":"16px"}}}} --><h2 class="wp-block-heading" style="margin-top:48px;margin-bottom:16px;font-size:32px;line-height:1.2">Use this layout in your shop</h2><!-- /wp:heading -->' .
'<!-- wp:paragraph --><p>Open your carousel, go to General and set Rows to Two rows. Keep three columns on desktop to show six cards. Choose one row on phones for larger product photos, or keep two if you prefer a denser collection. This demo switches to one row on phones.</p><!-- /wp:paragraph -->' .
'<!-- wp:paragraph --><p>Both examples use the Default template. Two rows are included in Free; the prices and shopping buttons shown here come from Pro. Product links open the sample catalogue. Orders are disabled on this site.</p><!-- /wp:paragraph -->' .
'<!-- wp:paragraph --><p>Want shoppers to choose an inspiration photo and see a matching collection? <a href="' . esc_url( home_url( '/cci-connected-carousels-demo/' ) ) . '">Explore connected carousels in Pro.</a></p><!-- /wp:paragraph -->';
$page    = wp_insert_post(
	array(
		'ID'           => cci_two_row_example_id( 'page', 'page' ),
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'Two-row carousels',
		'post_name'    => 'cci-two-row-carousel-demo',
		'post_content' => $content,
		'meta_input'   => array( '_cci_two_row_example' => 'page' ),
	),
	true
);
if ( is_wp_error( $page ) ) {
	throw new RuntimeException( $page->get_error_message() ); }
echo wp_json_encode(
	array(
		'carousels' => $ids,
		'page'      => $page,
		'url'       => get_permalink( $page ),
	)
) . "\n";
