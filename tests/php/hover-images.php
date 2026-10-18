<?php
// Real WordPress/WooCommerce integration. Only temporary posts are written.
if (PHP_SAPI !== 'cli' || empty($argv[1])) throw new RuntimeException('Pass local wp-load.php.');
if (in_array('--without-pro', $argv, true)) {
    define('ABSPATH', dirname(realpath($argv[1])) . '/');
    require_once ABSPATH . 'wp-includes/plugin.php';
    // Request-local plugin selection: does not deactivate or change installed plugins.
    add_filter('option_active_plugins', static function ($plugins) {
        return array_values(array_filter($plugins, static function ($plugin) {
            return strpos($plugin, 'cci-posts-carousel-pro/') !== 0;
        }));
    });
}
require $argv[1];
if (!in_array(parse_url(home_url(), PHP_URL_HOST), array('localhost', '127.0.0.1'), true)) throw new RuntimeException('Local demo only.');
$created = array(); $checks = array();
$check = static function ($ok, $label) use (&$checks) {
    if (!$ok) throw new RuntimeException($label);
    $checks[] = $label;
};
try {
    if (in_array('--without-pro', $argv, true)) {
        $check(!defined('WP_POSTS_CAROUSEL_PRO_VERSION'), 'The Pro plugin is absent in this request; installed plugins are unchanged');
    }
    $images = get_posts(array('post_type' => 'attachment', 'post_mime_type' => 'image', 'numberposts' => 3, 'fields' => 'ids'));
    if (count($images) < 3) throw new RuntimeException('Three demo images required.');
    $primary = wp_get_attachment_image_url($images[0], 'large');
    $secondary = wp_get_attachment_image_url($images[1], 'large');
    $override = wp_get_attachment_image_url($images[2], 'large');
    $post_id = wp_insert_post(array('post_title' => 'Temporary hover test', 'post_status' => 'publish',
        'post_content' => '[wpc_hover_fixture]' . wp_get_attachment_image($images[0], 'medium') .
            '<img src="javascript:alert(1)">' . wp_get_attachment_image($images[1], 'large')));
    $created[] = $post_id;
    set_post_thumbnail($post_id, $images[0]);
    $executed = false;
    add_shortcode('wpc_hover_fixture', static function () use (&$executed) { $executed = true; return ''; });
    $config = WP_Posts_Carousel_Config::defaults();
    $config['template']['display']['post']['featured_image_source'] = 'large';
    $params = array('featured_image_source' => 'large');
    $render = static function ($config) use ($post_id, $params) { return WP_Posts_Carousel_Slide_View_Model::from_post($post_id, $params, $config); };
    $check(empty($render($config)['hover_image']), 'Existing carousels stay off by default');
    $config['image_hover']['enabled'] = true;
    $slide = $render($config);
    $check($slide['image']['src'] === $primary && $slide['hover_image']['src'] === $secondary, 'Featured image remains primary; first different content image is secondary');
    $check(!$executed, 'Content discovery does not execute shortcodes');
    $check(strpos($slide['html']['featured_image'], 'data-wpc-hover-src=') !== false && substr_count($slide['html']['featured_image'], '<img') === 1, 'PHP output has one accessible image with deferred hover data');
    $config['curation']['items'] = array(array('type' => 'post', 'id' => $post_id, 'hover_image_url' => $override));
    $config['source']['mode'] = 'hybrid';
    $config['curation']['mode'] = 'hybrid';
    $check($render($config)['hover_image']['src'] === $override, 'Per-slide manual image overrides automatic discovery');
    $roundtrip = WP_Posts_Carousel_Config::from_form_values(WP_Posts_Carousel_Config::to_form_values($config));
    $check($roundtrip['image_hover']['enabled'] && $roundtrip['curation']['items'][0]['hover_image_url'] === $override, 'Source and per-slide image survive editor round-trip');
    $config['curation']['items'] = array();
    $config['image_hover']['source'] = 'manual';
    $check(empty($render($config)['hover_image']), 'Manual source without an image keeps the featured image');
    $config['image_hover']['source'] = 'content';
    wp_update_post(array('ID' => $post_id, 'post_content' => '<img src="data:image/svg+xml,unsafe">' . wp_get_attachment_image($images[0], 'medium')));
    $check(empty($render($config)['hover_image']), 'Unsafe URLs and another size of the featured image are ignored');
    delete_post_thumbnail($post_id);
    wp_update_post(array('ID' => $post_id, 'post_content' => wp_get_attachment_image($images[1], 'large')));
    $check(empty($render($config)['hover_image']), 'Missing featured image does not swap a placeholder');
    $item = array('type' => 'custom', 'id' => 'fixture-hover', 'label' => 'Fixture', 'image_url' => $primary, 'hover_image_url' => $secondary);
    $check(WP_Posts_Carousel_Slide_View_Model::from_custom_item($item, $params, $config)['hover_image']['src'] === $secondary, 'Custom image slides support manual hover images in the base plugin');
    $config['image_hover']['source'] = 'gallery';
    $config['template']['display']['product']['featured_image_source'] = 'large';
    $product = new WC_Product_Simple(); $product->set_name('Temporary hover product'); $product->set_status('publish');
    $product->set_image_id($images[0]); $product->set_gallery_image_ids(array($images[0], $images[1])); $product->save(); $created[] = $product->get_id();
    $slide = WP_Posts_Carousel_Slide_View_Model::from_post($product->get_id(), $params, $config);
    $check($slide['image']['src'] === $primary && $slide['hover_image']['src'] === $secondary, 'WooCommerce public gallery API supplies the first different gallery image');
    $product->set_gallery_image_ids(array()); $product->save();
    $check(empty(WP_Posts_Carousel_Slide_View_Model::from_post($product->get_id(), $params, $config)['hover_image']), 'An empty product gallery keeps the featured image');
    echo json_encode(array('passed' => count($checks), 'checks' => $checks), JSON_PRETTY_PRINT) . "\n";
} finally {
    foreach ($created as $id) wp_delete_post($id, true);
    remove_shortcode('wpc_hover_fixture');
}
