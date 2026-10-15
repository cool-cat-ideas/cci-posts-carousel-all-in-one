<?php
// Run inside a local WordPress container: php tests/php/rest-rendering.php /var/www/html/wp-load.php.
if (PHP_SAPI !== 'cli' || empty($argv[1]) || !is_file($argv[1])) {
    throw new RuntimeException('Pass the bootstrap path of a local WordPress test installation.');
}
if (isset($argv[2]) && $argv[2] === '--admin-assets') {
    define('WP_ADMIN', true);
}
require $argv[1];
set_exception_handler(function ($error) {
    fwrite(STDERR, $error->getMessage() . "\n");
    exit(1);
});
if (!in_array(wp_get_environment_type(), array('local', 'development'), true)) {
    throw new RuntimeException('This check requires a local or development WordPress installation.');
}

function wpc_assert($condition, $message)
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

$passes = 0;
$counter = function ($args) use (&$passes) {
    ++$passes;
    return $args;
};
add_filter('wp_posts_carousel_query_args', $counter, 999);
$checked = 0;
foreach (WP_Posts_Carousel_Repository::all() as $carousel) {
    if ($carousel['post_status'] !== 'publish') {
        continue;
    }
    $passes = 0;
    $request = new WP_REST_Request('GET', '/wp-posts-carousel/v1/carousel/' . $carousel['ID']);
    $response = rest_do_request($request);
    if ($response->get_status() !== 200) {
        continue;
    }
    $data = $response->get_data();
    wpc_assert($passes <= 1, 'JSON and HTML must not run the same content query twice.');
    wpc_assert(strpos(wp_json_encode($data), '_render_context') === false, 'Internal render data must not enter the REST payload.');
    wpc_assert(isset($data['html']) && is_string($data['html']), 'The public response must preserve HTML.');
    wpc_assert($data['engine']['options']['post_count'] === count($data['slides']), 'Slide counts must agree.');
    if (!empty($data['slides']) && strpos($data['html'], 'data-wpc-react-mode="full"') === false) {
        wpc_assert(strpos($data['html'], 'id="' . esc_attr($data['engine']['options']['id']) . '"') !== false, 'HTML and JSON must share the placement ID.');
    }
    $style = isset($data['template']['stylesheet']) ? $data['template']['stylesheet'] : null;
    wpc_assert($style === null || (!empty($style['handle']) && !empty($style['url']) && isset($style['version'])), 'Dynamic templates need a valid stylesheet descriptor.');
    ++$checked;
    if ($passes === 1 && !empty($data['slides'])) {
        $sample = $request;
    }
}
wpc_assert($checked > 0 && isset($sample), 'Seed at least one published, available query-based carousel.');

// A runtime extension may change the query. Its changed configuration must not
// reuse slides prepared for the original REST configuration.
$runtime_filter = function ($config) {
    $config['source']['limit'] = 1;
    return $config;
};
add_filter('wp_posts_carousel_runtime_config', $runtime_filter);
$passes = 0;
rest_do_request($sample);
wpc_assert($passes === 2, 'A changed runtime configuration must rebuild its own slides.');
remove_filter('wp_posts_carousel_runtime_config', $runtime_filter);

$admins = get_users(array('role' => 'administrator', 'number' => 1, 'fields' => 'ID'));
wpc_assert(!empty($admins), 'Create an administrator in the local test installation.');
wp_set_current_user((int) $admins[0]);
// Register the routes as the authenticated editor, as in a separate HTTP request.
global $wp_rest_server;
$wp_rest_server = null;
$id = (int) basename($sample->get_route());
$passes = 0;
$preview = rest_do_request(new WP_REST_Request('GET', '/wp-posts-carousel/v1/admin/carousel/' . $id . '/preview'));
wpc_assert($preview->get_status() === 200 && $passes === 1, 'Saved editor previews must reuse their prepared slides: status=' . $preview->get_status() . ', queries=' . $passes);
$config = WP_Posts_Carousel_Repository::get_config($id);
$draft = new WP_REST_Request('POST', '/wp-posts-carousel/v1/admin/carousel/preview');
$draft->set_header('Content-Type', 'application/json');
$draft->set_body(wp_json_encode($config));
$passes = 0;
$preview = rest_do_request($draft);
wpc_assert($preview->get_status() === 200 && $passes === 1, 'Unsaved editor previews must reuse their prepared slides: status=' . $preview->get_status() . ', queries=' . $passes);
wp_set_current_user(0);
remove_filter('wp_posts_carousel_query_args', $counter, 999);
if (is_admin()) {
    $frontend = new WP_Posts_Carousel_Frontend();
    $frontend->enqueue_editor_scripts();
    foreach (WP_Posts_Carousel_Templates::discover_templates() as $template) {
        if (!empty($template['style']) && is_file($template['style'])) {
            wpc_assert(wp_style_is('wp-posts-carousel-template-' . sanitize_key($template['name']), 'enqueued'), 'Editor previews must keep every available template stylesheet.');
        }
    }
    echo "PASS: editor keeps all available template styles.\n";
}
echo 'PASS: ' . $checked . " public carousels, saved/unsaved editor previews, shared queries, placement IDs, stylesheet data and runtime-filter fallback.\n";

$tests = array();
$tests['query mode never persists preview posts as manual selection'] = function () {
    $config = WP_Posts_Carousel_Config::normalize(array('post_selection_options' => array(
        'mode' => 'query',
        'post_types' => array(array('value' => 'post', 'label' => 'Posts')),
        'posts' => array(array('value' => '123', 'label' => 'Preview only')),
        'all_items' => 4,
    )));
    wpc_assert($config['source']['mode'] === 'query', 'Query mode changed to manual.');
    wpc_assert($config['curation']['items'] === array(), 'Query preview leaked into saved manual items.');
    wpc_assert(WP_Posts_Carousel_Config::to_form_values($config)['post_selection_options']['mode'] === 'query', 'Query mode did not round-trip.');
};
$tests['legacy manual selections retain their mode and IDs'] = function () {
    $config = WP_Posts_Carousel_Config::normalize(array('post_selection_options' => array(
        'posts' => array(array('value' => '123', 'label' => 'Existing manual slide')),
    )));
    wpc_assert($config['source']['mode'] === 'manual', 'Legacy manual carousel changed to query.');
    wpc_assert((int) $config['curation']['items'][0]['id'] === 123, 'Legacy manual slide was lost.');
};

foreach ($tests as $name => $run) { $run(); echo "PASS: " . $name . PHP_EOL; }
