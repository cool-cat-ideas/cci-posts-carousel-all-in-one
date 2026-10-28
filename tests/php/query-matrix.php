<?php
/** Native WordPress query regression matrix. Temporary records are removed in finally. */
if ( PHP_SAPI !== 'cli' || empty( $argv[1] ) ) {
	throw new RuntimeException( 'Pass a local wp-load.php path.' );
}
require $argv[1];
if ( ! in_array( wp_parse_url( home_url(), PHP_URL_HOST ), array( 'localhost', '127.0.0.1' ), true ) ) {
	throw new RuntimeException( 'Local WordPress required.' );
}

$created       = array();
$terms         = array();
$failures      = array();
$checks        = 0;
$previous_user = get_current_user_id();
$previous_get  = $_GET;
$type          = 'cci_wpc_matrix';
$assert        = static function ( $condition, $label ) use ( &$failures, &$checks ) {
	++$checks;
	if ( ! $condition ) {
		$failures[] = $label;
		fwrite( STDERR, 'FAIL: ' . $label . PHP_EOL );
	}
};
$ids           = static function ( $config ) {
	$query = new WP_Query( WP_Posts_Carousel_Query_Builder::build( $config ) );
	return array_map( 'intval', wp_list_pluck( $query->posts, 'ID' ) );
};
$slides        = static function ( $config ) {
	return WP_Posts_Carousel_Data::slides( $config, WP_Posts_Carousel_Data::runtime_params( $config ) );
};
register_post_type(
	$type,
	array(
		'public'     => true,
		'taxonomies' => array( 'category', 'post_tag' ),
	)
);
wp_set_current_user( 0 );
try {
	foreach ( array( 'category', 'post_tag' ) as $taxonomy ) {
		for ( $i = 0; $i < 2; ++$i ) {
			$term = wp_insert_term( 'CCI matrix ' . wp_generate_uuid4(), $taxonomy );
			if ( is_wp_error( $term ) ) {
				throw new RuntimeException( $term->get_error_message() );
			}
			$terms[ $taxonomy ][] = (int) $term['term_id'];
		}
	}
	$fixtures = array();
	for ( $i = 0; $i < 8; ++$i ) {
		$id = wp_insert_post(
			array(
				'post_type'    => $type,
				'post_status'  => 'publish',
				'post_title'   => sprintf( 'Matrix %02d', 8 - $i ),
				'post_date'    => sprintf( '2020-01-%02d 12:00:00', $i + 1 ),
				'post_content' => 'Matrix public content.',
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			throw new RuntimeException( $id->get_error_message() );
		}
		$created[] = $id;
		$category  = ( $i & 1 ) === 1;
		$tag       = ( $i & 2 ) === 2;
		wp_set_post_terms( $id, array( $terms['category'][ $category ? 0 : 1 ] ), 'category' );
		wp_set_post_terms( $id, array( $terms['post_tag'][ $tag ? 0 : 1 ] ), 'post_tag' );
		$fixtures[] = array(
			'id'       => $id,
			'category' => $category,
			'tag'      => $tag,
			'index'    => $i,
		);
	}
	$base = WP_Posts_Carousel_Config::normalize(
		array(
			'post_selection_options' => array(
				'mode'       => 'query',
				'post_types' => array( array( 'value' => $type ) ),
				'all_items'  => 15,
				'order_by'   => 'id',
				'ordering'   => 'asc',
			),
		)
	);
	foreach ( array( 'and', 'or' ) as $relation ) {
		foreach ( array( 'in', 'not in' ) as $category_operator ) {
			foreach ( array( 'in', 'not in' ) as $tag_operator ) {
				foreach ( array( 'ID', 'post_date', 'post_title' ) as $order_by ) {
					foreach ( array( 'ASC', 'DESC' ) as $order ) {
						foreach ( array( 1, 3, 15 ) as $limit ) {
							$config           = $base;
							$config['source'] = array_merge(
								$base['source'],
								array(
									'relation'   => $relation,
									'order_by'   => $order_by,
									'order'      => $order,
									'limit'      => $limit,
									'taxonomies' => array(
										array(
											'post_type'  => $type,
											'taxonomies' => array(
												array(
													'name' => 'category',
													'operator' => $category_operator,
													'terms' => array( array( 'value' => $terms['category'][0] ) ),
												),
												array(
													'name' => 'post_tag',
													'operator' => $tag_operator,
													'terms' => array( array( 'value' => $terms['post_tag'][0] ) ),
												),
											),
										),
									),
								)
							);
							$expected         = array_values(
								array_filter(
									$fixtures,
									static function ( $item ) use ( $relation, $category_operator, $tag_operator ) {
										$a = $category_operator === 'in' ? $item['category'] : ! $item['category'];
										$b = $tag_operator === 'in' ? $item['tag'] : ! $item['tag'];
										return $relation === 'and' ? $a && $b : $a || $b;
									}
								)
							);
							if ( ( $order === 'DESC' ) !== ( $order_by === 'post_title' ) ) {
								$expected = array_reverse( $expected );
							}
							$expected  = array_column( array_slice( $expected, 0, $limit ), 'id' );
							$label     = implode( '/', array( $relation, $category_operator, $tag_operator, $order_by, $order, $limit ) );
							$roundtrip = WP_Posts_Carousel_Config::normalize( WP_Posts_Carousel_Config::to_form_values( $config ) );
							$assert( $ids( $roundtrip ) === $expected, 'Taxonomy/order/limit round trip: ' . $label );
						}
					}
				}
			}
		}
	}
	$empty                     = $base;
	$empty['source']['mode']   = 'manual';
	$empty['curation']['mode'] = 'manual';
	$assert( $slides( $empty ) === array(), 'Empty manual selection never falls back to automatic posts.' );
	$manual                      = $empty;
	$manual['curation']['items'] = array(
		array(
			'type'      => 'post',
			'post_type' => $type,
			'id'        => $created[5],
		),
		array(
			'type'      => 'post',
			'post_type' => $type,
			'id'        => $created[1],
		),
	);
	$assert( array_column( $slides( $manual ), 'id' ) === array( $created[5], $created[1] ), 'Manual selection keeps its explicit sequence.' );
	$excluded                      = $manual;
	$excluded['source']['exclude'] = array( $created[5] );
	$assert( array_column( $slides( $excluded ), 'id' ) === array( $created[1] ), 'Manual selection respects exclusions.' );
	$excluded['source']['exclude'][] = $created[1];
	$assert( $slides( $excluded ) === array(), 'Excluding every manual post never falls back to automatic posts.' );
	foreach ( array( 'owl-carousel', 'swiper' ) as $engine ) {
		foreach ( array( 1, 2 ) as $rows ) {
			foreach ( array( 'horizontal', 'vertical' ) as $direction ) {
				foreach ( array( 'php', 'react' ) as $renderer ) {
					foreach ( array( 'default', 'light', 'simple' ) as $template ) {
						$config                     = $base;
						$config['renderer']         = $renderer;
						$config['template']['name'] = $template;
						$config['engine']           = array(
							'name'    => $engine,
							'options' => array(
								'rows'            => $rows,
								'direction'       => $direction,
								'vertical_height' => 520,
								'auto_play'       => false,
								'navigation'      => true,
								'pagination'      => true,
							),
						);
						$config                     = WP_Posts_Carousel_Config::normalize( $config );
						$again                      = WP_Posts_Carousel_Config::normalize( WP_Posts_Carousel_Config::to_form_values( $config ) );
						$label                      = implode( '/', array( $engine, $rows, $direction, $renderer, $template ) );
						$assert( $config['engine'] === $again['engine'] && $config['renderer'] === $again['renderer'], 'Engine settings survive editor round trip: ' . $label );
						$data = WP_Posts_Carousel_Data::from_config( $again );
						$assert( count( $data['slides'] ) === 8 && $data['engine']['options']['post_count'] === 8, 'Renderer/engine data keeps every original card: ' . $label );
					}
				}
			}
		}
	}
	$_GET['wpcf_category']        = (string) $terms['category'][0];
	$filtered                     = $base;
	$filtered['frontend_filters'] = array(
		'enabled'      => true,
		'taxonomies'   => array( 'category' ),
		'param_prefix' => 'wpcf_',
	);
	$assert( $ids( $filtered ) === array_column( array_filter( $fixtures, static fn( $item ) => $item['category'] ), 'id' ), 'Visitor filters narrow the query.' );
	unset( $_GET['wpcf_category'] );
	$secret    = wp_insert_post(
		array(
			'post_type'     => $type,
			'post_status'   => 'publish',
			'post_password' => 'matrix-password',
			'post_title'    => 'Protected matrix',
			'post_content'  => 'CCI_PRIVATE_MATRIX_CONTENT',
		),
		true
	);
	$created[] = $secret;
	$private   = wp_insert_post(
		array(
			'post_type'   => $type,
			'post_status' => 'private',
			'post_title'  => 'Private matrix',
		),
		true
	);
	$created[] = $private;
	foreach ( array( 'query', 'manual', 'hybrid' ) as $mode ) {
		$config                     = $base;
		$config['source']['mode']   = $mode;
		$config['curation']['mode'] = $mode;
		$config['template']['display']['post']['show_description'] = 'content';
		if ( $mode !== 'query' ) {
			$config['curation']['items'] = array_map(
				static fn( $id ) => array(
					'type'      => 'post',
					'post_type' => $type,
					'id'        => $id,
				),
				array( $secret, $private, $created[0] )
			);
		}
		$result = $slides( $config );
		$assert( ! in_array( $secret, array_column( $result, 'id' ), true ) && strpos( wp_json_encode( $result ), 'CCI_PRIVATE_MATRIX_CONTENT' ) === false, 'Password-protected content stays out of public ' . $mode . ' slides.' );
		$assert( ! in_array( $private, array_column( $result, 'id' ), true ), 'Private content stays out of public ' . $mode . ' slides.' );
	}
	echo wp_json_encode(
		array(
			'checks'   => $checks,
			'failures' => $failures,
		),
		JSON_PRETTY_PRINT
	) . PHP_EOL;
} finally {
	$_GET = $previous_get;
	wp_set_current_user( $previous_user );
	foreach ( $created as $id ) {
		if ( is_int( $id ) && $id > 0 ) {
			wp_delete_post( $id, true );
		}
	}
	foreach ( $terms as $taxonomy => $values ) {
		foreach ( $values as $id ) {
			wp_delete_term( $id, $taxonomy );
		}
	}
	unregister_post_type( $type );
}
exit( $failures ? 1 : 0 );
