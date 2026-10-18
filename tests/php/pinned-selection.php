<?php
// Local WordPress integration test; every created record is removed in finally.
if (PHP_SAPI !== 'cli' || empty($argv[1])) throw new RuntimeException('Pass a local wp-load.php path.');
require $argv[1];
if (!in_array(parse_url(home_url(), PHP_URL_HOST), array('localhost', '127.0.0.1'), true)) throw new RuntimeException('Local demo only.');
$created = array(); $term_id = 0; $carousel_id = 0; $checks = array();
$check = static function ($condition, $message) use (&$checks) {
    if (!$condition) throw new RuntimeException($message);
    $checks[] = $message;
};
try {
    $term = wp_insert_term('WPC pin verification ' . wp_generate_uuid4(), 'category');
    if (is_wp_error($term)) throw new RuntimeException('Cannot create fixture category.');
    $term_id = (int) $term['term_id'];
    for ($i = 1; $i <= 8; $i++) {
        $id = wp_insert_post(array('post_title' => 'Pin test ' . $i, 'post_type' => 'post', 'post_status' => 'publish', 'post_date' => sprintf('2020-01-%02d 12:00:00', $i)), true);
        if (is_wp_error($id)) throw new RuntimeException('Cannot create fixture post.');
        $created[] = $id;
        wp_set_post_terms($id, array($term_id), 'category');
    }
    $draft = wp_insert_post(array('post_title' => 'Unavailable pin', 'post_status' => 'draft'), true); $created[] = $draft;
    $private = wp_insert_post(array('post_title' => 'Private pin', 'post_status' => 'private'), true); $created[] = $private;
    $protected = wp_insert_post(array('post_title' => 'Protected pin', 'post_status' => 'publish', 'post_password' => 'fixture-only'), true); $created[] = $protected;
    $form = array('post_selection_options' => array(
        'mode' => 'hybrid', 'post_types' => array(array('value' => 'post')),
        'posts' => array(array('value' => $created[3]), array('value' => $created[0]), array('value' => $created[3]), array('value' => $draft), array('value' => $private), array('value' => $protected)),
        'taxonomies' => array(array('taxonomies' => array(array('name' => 'category', 'terms' => array(array('value' => $term_id)))))),
        'order_by' => 'post_date', 'ordering' => 'desc', 'all_items' => 6,
    ));
    $config = WP_Posts_Carousel_Config::normalize($form);
    $roundtrip = WP_Posts_Carousel_Config::to_form_values($config);
    $check($roundtrip['post_selection_options']['mode'] === 'hybrid', 'Editor mode survives config round-trip');
    $selection = WP_Posts_Carousel_Data::pinned_selection($config);
    $check(array_column($selection['items'], 'id') === array($created[3], $created[0]), 'Pin order is preserved; duplicate and unavailable pins are skipped');
    $automatic = array_map(static fn($post) => (int) $post->ID, $selection['automatic']);
    $check($automatic === array($created[7], $created[6], $created[5], $created[4]), 'Automatic results use the remaining limit and query order');
    $slides = WP_Posts_Carousel_Data::slides($config, WP_Posts_Carousel_Data::runtime_params($config));
    $expected = array_merge(array($created[3], $created[0]), $automatic);
    $check(array_column($slides, 'id') === $expected, 'Public slides share the resolved sequence without duplicates');
    $check(array_column($slides, 'pinned') === array(true, true, false, false, false, false), 'Only actual pinned slides carry the public pinned flag');
    $limited = $config; $limited['source']['limit'] = 1;
    $selection = WP_Posts_Carousel_Data::pinned_selection($limited);
    $check(count($selection['items']) === 1 && !$selection['automatic'], 'Pins obey the total limit');
    $excluded = $config; $excluded['source']['exclude'] = array($created[3]);
    $selection = WP_Posts_Carousel_Data::pinned_selection($excluded);
    $check(array_column($selection['items'], 'id') === array($created[0]) && count($selection['automatic']) === 5, 'Explicit exclusions skip a pin and free its place');
    $custom = $config; $custom['curation']['items'] = array(array('type' => 'custom', 'id' => 'fixture-promo', 'label' => 'Promotion', 'title' => 'Promotion'));
    $selection = WP_Posts_Carousel_Data::pinned_selection($custom);
    $check(count($selection['items']) === 1 && count($selection['automatic']) === 5, 'Custom pins also reserve one place');
    $empty = $config; $empty['curation']['items'] = array();
    $check(count(WP_Posts_Carousel_Data::pinned_selection($empty)['automatic']) === 6, 'No pins behaves like the automatic query');
    register_post_type('wpc_pin_public', array('public' => true, 'exclude_from_search' => true));
    register_post_type('wpc_pin_private', array('public' => false));
    $public_cpt = wp_insert_post(array('post_title' => 'Public custom content pin', 'post_type' => 'wpc_pin_public', 'post_status' => 'publish'), true); $created[] = $public_cpt;
    $private_cpt = wp_insert_post(array('post_title' => 'Non-public custom content pin', 'post_type' => 'wpc_pin_private', 'post_status' => 'publish'), true); $created[] = $private_cpt;
    $cpt_config = $config;
    $cpt_config['curation']['items'] = array(array('type' => 'post', 'id' => $public_cpt), array('type' => 'post', 'id' => $private_cpt));
    $selection = WP_Posts_Carousel_Data::pinned_selection($cpt_config);
    $check(array_column($selection['items'], 'id') === array($public_cpt) && count($selection['automatic']) === 5, 'Public content excluded from search can be pinned; non-public types stay private');
    foreach (array('query', 'manual') as $mode) {
        $previous = $form; $previous['post_selection_options']['mode'] = $mode;
        $legacy = WP_Posts_Carousel_Config::normalize($previous);
        $check($legacy['source']['mode'] === $mode, 'Existing ' . $mode . ' mode is retained');
    }
    $carousel = WP_Posts_Carousel_Repository::create('Temporary pin verification', array_merge($config, array('status' => 'publish')));
    if (is_wp_error($carousel)) throw new RuntimeException('Cannot create fixture carousel.');
    $carousel_id = (int) $carousel->ID;
    $request = new WP_REST_Request('GET', '/wp-posts-carousel/v1/carousel/' . $carousel_id);
    $response = rest_do_request($request); $data = $response->get_data();
    $check($response->get_status() === 200 && array_column($data['slides'], 'id') === $expected, 'Anonymous REST output preserves pin order and fill');
    $check(is_string($data['html']) && strpos($data['html'], 'wp-posts-carousel_') !== false, 'PHP HTML is returned alongside the same slide data');
    $check(substr_count($data['html'], 'cci-wpc-slide-pinned') === 2, 'PHP output marks exactly the two pinned cards for custom styling');
    echo json_encode(array('passed' => count($checks), 'checks' => $checks), JSON_PRETTY_PRINT) . "\n";
} finally {
    if ($carousel_id) WP_Posts_Carousel_Repository::delete($carousel_id);
    foreach ($created as $id) if (is_int($id) && $id > 0) wp_delete_post($id, true);
    if ($term_id) wp_delete_term($term_id, 'category');
    if (post_type_exists('wpc_pin_public')) unregister_post_type('wpc_pin_public');
    if (post_type_exists('wpc_pin_private')) unregister_post_type('wpc_pin_private');
}
