<?php

/**
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

/**
 * WP_Posts_Carousel_Admin class
 */
class WP_Posts_Carousel_API
{
	protected $site_url = 'http://demuo.wp-api.org/wp-json/wp/v2/';

	/**
	 * Constructor
	 */
	public function __construct()
	{
		add_action('rest_api_init', array($this, 'prefix_register_my_comment_route'));
	}


	function prefix_register_my_comment_route()
	{
		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/posts',
			array(
				array(
					'methods'  => 'post',
					'callback' => array($this, 'get_custom_posts'),
					'permission_callback' => $this->checkPermissions(['read_wp_posts_carousel', 'create_wp_posts_carousels']),
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/categories',
			array(
				array(
					'methods'  => 'post',
					'callback' => array($this, 'get_custom_categories'),
					'permission_callback' => $this->checkPermissions(['read_wp_posts_carousel', 'create_wp_posts_carousels']),
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/tags',
			array(
				array(
					'methods'  => 'post',
					'callback' => array($this, 'get_custom_tags'),
					'permission_callback' => $this->checkPermissions(['read_wp_posts_carousel', 'create_wp_posts_carousels']),
				),
			)
		);		

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/defaultSettings',
			array(
				array(
					'methods'  => 'GET',
					'callback' => array($this, 'get_default_settings'),
					'permission_callback' => $this->checkPermissions(['read_wp_posts_carousel', 'create_wp_posts_carousels'])
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/settings',
			array(
				array(
					'methods'  => 'GET',
					'callback' => array($this, 'get_settings'),
					'permission_callback' => $this->checkPermissions('manage_wp_posts_carousel_options')
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/settings',
			array(
				array(
					'methods'  => 'POST',
					'callback' => array($this, 'update_settings'),
					'permission_callback' => $this->checkPermissions('manage_wp_posts_carousel_options')
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/carousel',
			array(
				array(
					'methods'  => 'POST',
					'callback' => array($this, 'create_carousel'),
					'permission_callback' => $this->checkPermissions('create_wp_posts_carousels')
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/carousel/(?P<id>\d+)',
			array(
				array(
					'methods'  => 'GET',
					'callback' => array($this, 'get_carousel'),
					'permission_callback' => $this->checkPermissions('read_wp_posts_carousel'),
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/carousel/(?P<id>\d+)',
			array(
				array(
					'methods'  => 'PUT',
					'callback' => array($this, 'update_carousel'),
					'permission_callback' => $this->checkPermissions('edit_wp_posts_carousel'),
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/carousel/(?P<id>\d+)',
			array(
				array(
					'methods'  => 'DELETE',
					'callback' => array($this, 'delete_carousel'),
					'permission_callback' => $this->checkPermissions('delete_wp_posts_carousel'),
				),
			)
		);

		register_rest_route(
			'wp-posts-carousel/v1/admin',
			'/carousels',
			array(
				array(
					'methods'  => 'GET',
					'callback' => array($this, 'get_carousels'),
					'permission_callback' => $this->checkPermissions('read_wp_posts_carousel'),
				),
			)
		);
	}

	public function prepare_post_option($post) {
		$post_options = array('value' => strval($post->ID), 'label' => $post->post_title, 'post' => $post, 'post_type' => $post->post_type);

		return apply_filters('wp_posts_carousel_prepare_post_option', $post_options, $post);
	}

	public function checkPermissions($permission)
	{
		if ($permission) {
			if (is_array($permission)) {
				foreach ($permission as $value) {
					if (!current_user_can($value)) {
						return '__return_false';
					}
				}
				return '__return_true';
			} else if (current_user_can($permission)) {
				return '__return_true';
			}
		}
		return '__return_false';
	}

	public function get_custom_posts(WP_REST_Request $request)
	{
		$post_types = array();
		if($request['post_types']) {
			foreach($request['post_types'] as $post_type) {
				array_push($post_types, $post_type['value']);
			}
		}

		$args = array(
            'post_type' => $post_types,
			'orderby' => 'post_title'		
        );

		if( isset($request['s']) && !empty($request['s']) ) {
			$args['s'] = sanitize_text_field( $request['s'] );
		}

		$query = new WP_Query( $args );
		$posts = $query->posts;

		$result = array_map(array($this, 'prepare_post_option'), $posts);
		wp_reset_postdata();

		return new WP_REST_Response($result, 200);
	}


	public function prepare_category_option($category) {
		$post_options = array('value' => strval($category->name), 'label' => $category->label, 'post_type' => $category->object_type[0]);

		return apply_filters('wp_posts_carousel_prepare_category_option', $post_options, $category);
	}

	public function get_custom_categories(WP_REST_Request $request)
	{

		$post_types = array();
		if($request['post_types']) {
			foreach($request['post_types'] as $post_type) {
				array_push($post_types, $post_type['value']);
			}
		}

		$search = '';
		if( isset($request['s']) && !empty($request['s']) ) {
			$search = sanitize_text_field( $request['s'] );
		}

		$filtered_taxonomies = array();
		$all_taxonomies = get_object_taxonomies($post_types, 'objects');

		if($all_taxonomies) {
			foreach($all_taxonomies as $item) {
				$search_pos = strpos(strtolower($item->label), strtolower($search));	
				$tag_pos = strpos($item->name, '_tag');
				
				if($item->public === true && $item->show_ui === true && $tag_pos === false) {
			
					if($search !== '' && $search_pos !== false)	{				
						array_push($filtered_taxonomies, $item);
					} else {
						array_push($filtered_taxonomies, $item);
					}
					
				}	
			}
		}
		
		$result = array_map(array($this, 'prepare_category_option'), $filtered_taxonomies);

		return new WP_REST_Response($result, 200);
	}

	public function prepare_tag_option($tag) {
		$post_options = array('value' => strval($tag->term_id), 'label' => $tag->name, 'post_type' => $tag->taxonomy);

		return apply_filters('wp_posts_carousel_prepare_tag_option', $post_options, $tag);
	}

	public function get_custom_tags(WP_REST_Request $request)
	{
		$post_types = array();
		if($request['post_types']) {
			foreach($request['post_types'] as $post_type) {
				array_push($post_types, $post_type['value']);
			}
		}

		$filtered_taxonomies = array();
		$all_taxonomies = get_object_taxonomies($post_types, 'objects');

		if($all_taxonomies) {
			foreach($all_taxonomies as $item) {				
				$tag_pos = strpos($item->name, '_tag');

				if($item->public === true && $item->show_ui === true && $tag_pos !== false) {					
					array_push($filtered_taxonomies, $item->name);	
				}	
			}
		}

		$args = array(
            'taxonomy' => $filtered_taxonomies,
			'hide_empty' => false,	
        );

		if( isset($request['s']) && !empty($request['s']) ) {
			$args['s'] = sanitize_text_field( $request['s'] );
		}
		$tags = get_terms($args);	

		$result = array_map(array($this, 'prepare_tag_option'), $tags);
		wp_reset_postdata();

		return new WP_REST_Response($result, 200);
	}


	public function get_default_settings(WP_REST_Request $request, $post = null)
	{
		$dictionaries = array(
			'taxonomies' => WP_Posts_Carousel_Utils::get_post_types(),
			'order_by' =>  WP_Posts_Carousel_Utils::get_orders_by(),
			'ordering' => WP_Posts_Carousel_Utils::get_orderings(),
			'description' =>  WP_Posts_Carousel_Utils::get_descriptions(),
			'image_sources' => WP_Posts_Carousel_Utils::get_image_sources(),
			'image_units' => WP_Posts_Carousel_Utils::get_units(),
			'relations' => WP_Posts_Carousel_Utils::get_relations(),
			'breakpoints' => WP_Posts_Carousel_Utils::get_breakpoints(),
			'animations' => ''
		);

		$settings = array(
			'default_values' => apply_filters('wp_posts_carousel_default_values', WP_Posts_Carousel_Utils::get_carousel_default_params(), $post),
			'dictionaries'   => apply_filters('wp_posts_carousel_dictionaries', $dictionaries, $post)
		);

		return apply_filters('wp_posts_carousel_default_settings', $settings, $post);
	}

	public function get_settings(WP_REST_Request $request)
	{
		$settings = new WP_Posts_Carousel_Settings();
		$data = array(
			'settings' => $settings->get_settings(),
		);
		return $data;
	}

	public function update_settings(WP_REST_Request $request)
	{
		print_r($request);
		$settings = array();
		// $settings = array(
		// 	'industry' => $request->get_param( 'industry' ),
		// 	'amount' => $request->get_param( 'amount' )
		// );
		Apex_Settings::save_settings($settings);
		return rest_ensure_response(Apex_Settings::get_settings())->set_status(201);
	}

	/**
	 * get templates list
	 */
	public function get_templates()
	{
		$templates = array();
		// $args = 'posts/?page=2';
		// $json = @ file_get_contents( $this->site_url . $args );

		// if ( $json ) {
		// $templates = json_decode($json);
		// }
		// echo'<pre>';print_r($templates);exit;
		return $templates;
	}

	/**
	 * get integrations list
	 */
	// public function get_integrations() {
	// 	$integrations = array();
	// 	// $args = 'posts/?page=2';
	// 	// $json = @ file_get_contents( $this->site_url . $args );

	// 	// if ( $json ) {
	// 	// $integrations = json_decode($json);
	// 	// }
	// 	// echo'<pre>';print_r($integrations);exit;
	// 	return $integrations;
	// }

	public function get_carousels(WP_REST_Request $request)
	{
		//$params = $request->get_query_params();

		$result = array();
		global $wpdb;
		$posts_table = $wpdb->prefix . 'posts';
		$table = $wpdb->prefix . 'wp_posts_carousel';
		$users_table = $wpdb->prefix . 'users';
		$query = $wpdb->prepare("SELECT p.*, wpc.params, u.user_nicename FROM $posts_table p JOIN $table wpc ON p.ID = wpc.post_ID JOIN $users_table u ON p.post_author = u.ID ORDER BY p.ID DESC");

		$wpdb->hide_errors();
		$result = $wpdb->get_results($query, ARRAY_A);

		if ($wpdb->last_error) {
			return new WP_Error(__('Failed get carousel', 'wp-posts-carousel'), $request, array('status' => 500));
		}

		return new WP_REST_Response($result, 200);
	}

	public function create_carousel(WP_REST_Request $request)
	{
		$post = array(
			'post_author' => get_current_user_id(),
			'post_title'    => sanitize_text_field($request['title']),
			'post_name' => sanitize_title($request['title']),
			'post_status'   => 'publish',
			'post_type' => 'wp_posts_carousel'
		);

		$post_id = wp_insert_post($post);

		if ($post_id) {
			$post = get_post($post_id);

			unset($request['title']);
			$post_data = array();
			$post_data['post_id'] = $post_id;
			$post_data['params'] = wp_json_encode($request->get_params());

			global $wpdb;
			$table = $wpdb->prefix . 'wp_posts_carousel';
			$result = $wpdb->insert($table, $post_data, null);

			if ($result) {
				return new WP_REST_Response($post, 200);
			} else {
				return new WP_Error(__('Failed save carousel params', 'wp-posts-carousel'), $post_data, array('status' => 500));
			}
		}


		return new WP_Error(__('Failed save carousel', 'wp-posts-carousel'), $request, array('status' => 500));
	}

	public function get_carousel(WP_REST_Request $request)
	{
		$result = array();
		global $wpdb;
		$post_id = sanitize_text_field($request['id']);
		$posts_table = $wpdb->prefix . 'posts';
		$table = $wpdb->prefix . 'wp_posts_carousel';
		$users_table = $wpdb->prefix . 'users';

		$wpdb->show_errors = true;
		$query = $wpdb->prepare("SELECT p.*, wpc.params, u.user_nicename FROM $posts_table p JOIN $table wpc ON p.ID = wpc.post_ID JOIN $users_table u ON p.post_author = u.ID WHERE p.ID = $post_id LIMIT 1");

		$result['post'] = $wpdb->get_row($query, ARRAY_A);

		if (!empty($result['post'])) {
			add_filter('wp_posts_carousel_dictionaries', array($this, 'prepare_posts_options'), 10, 2);
			$settings = $this->get_default_settings($request, $result['post']);

			return new WP_REST_Response(array_merge($result, $settings), 200);
		}

		return new WP_Error(__('Failed get carousel', 'wp-posts-carousel'), $request, array('status' => 500));
	}

	public function prepare_posts_options($settings, $post) {
		$params = json_decode($post['params']);
			
		$array = array(
			'posts' => array_map(array($this, 'prepare_post_option'), get_posts(array(
				'post__in' => $params->posts,
				'post_type' => $params->post_types
			))),
			'exclude' => array_map(array($this, 'prepare_post_option'), get_posts(array(
				'post__in' => $params->exclude,
				'post_type' => $params->post_types
			)))
		);			

		return array_merge($settings,  $array);
	}



	public function update_carousel(WP_REST_Request $request)
	{
		$carousel = $this->get_carousel($request);
		if (!$carousel) {
			return new WP_Error(__('Carousel not found', 'wp-posts-carousel'), $request, array('status' => 500));
		}

		$post = array(
			'ID' => sanitize_text_field($request['id']),
			'post_title'    => sanitize_text_field($request['title']),
			'post_name' => sanitize_title($request['title']),
		);

		$post_id = wp_update_post($post);

		if ($post_id) {
			unset($request['title'], $request['id']);
			$post_data = array();
			$post_data['params'] = wp_json_encode($request->get_params());
			$post_data['post_modified'] = current_datetime()->format('Y-m-d H:i:s');

			global $wpdb;
			$table = $wpdb->prefix . 'wp_posts_carousel';

			if ($wpdb->update($table, $post_data, ['post_id' => $post_id])) {
				return new WP_REST_Response($post, 200);
			} else {
				return new WP_Error(__('Failed update carousel params', 'wp-posts-carousel'), $post_data, array('status' => 500));
			}
		}

		return new WP_Error(__('Failed update carousel', 'wp-posts-carousel'), $request, array('status' => 500));
	}

	public function delete_carousel(WP_REST_Request $request)
	{
		global $wpdb;
		$post_id = sanitize_text_field($request['id']);
		$table = $wpdb->prefix . 'wp_posts_carousel';


		if (wp_delete_post($post_id, true)) {
			if ($wpdb->delete($table, array('post_id' => $post_id))) {
				return new WP_REST_Response(true, 200);
			} else {
				return new WP_Error(__('Failed delete carousel params', 'wp-posts-carousel'), $request, array('status' => 500));
			}
		}

		return new WP_Error(__('Failed delete carousel', 'wp-posts-carousel'), $request, array('status' => 500));
	}
}

return new WP_Posts_Carousel_API();
