<?php
/**
 * Isolated schema, template and public-filter regressions.
 * Run: php tests/php/schema-and-template.php
 * No database or network connection is used.
 */
define('ABSPATH', __DIR__ . '/');
define('WP_POSTS_CAROUSEL_VERSION', '2.0.0');

class WP_Error
{
    public $code;
    public $message;
    public function __construct($code, $message = '', $data = array())
    {
        $this->code = $code;
        $this->message = $message;
    }
}

class Schema_Test_Database
{
    public $prefix = 'wp_test_';
    public $last_error = '';
    public $table_exists = false;
    public $fail_schema = false;
    public $schema_runs = 0;
    public $rows = array();
    public $queries = array();

    public function get_charset_collate() { return 'DEFAULT CHARACTER SET utf8mb4'; }
    public function esc_like($value) { return addcslashes($value, '_%\\'); }
    public function prepare($query, $value) { return str_replace('%s', "'" . addslashes($value) . "'", $query); }
    public function get_var($query)
    {
        $this->queries[] = $query;
        return $this->table_exists ? $this->prefix . 'wp_posts_carousel' : null;
    }
}

function add_action() {}
function __($text, $domain = '') { return $text; }
function get_option($key) { return $GLOBALS['schema_options'][$key] ?? false; }
function update_option($key, $value, $autoload = null) { $GLOBALS['schema_options'][$key] = $value; }
function dbDelta($sql)
{
    $database = $GLOBALS['wpdb'];
    $database->schema_runs++;
    $database->last_error = $database->fail_schema ? 'Simulated schema failure.' : '';
    if (!$database->fail_schema) $database->table_exists = true;
    return $database->fail_schema ? array() : array('Schema checked.');
}
function absint($value) { return abs((int) $value); }
function sanitize_text_field($value) { return strip_tags((string) $value); }
function wp_unslash($value)
{
    return is_array($value) ? array_map('wp_unslash', $value) : stripslashes((string) $value);
}
function map_deep($value, $callback)
{
    if (!is_array($value)) return $callback($value);
    return array_map(function ($item) use ($callback) { return map_deep($item, $callback); }, $value);
}
function check($condition, $message)
{
    if (!$condition) throw new RuntimeException($message);
}
function reset_schema($exists = false, $version = false)
{
    $GLOBALS['wpdb'] = new Schema_Test_Database();
    $GLOBALS['wpdb']->table_exists = $exists;
    $GLOBALS['schema_options'] = $version === false ? array() : array(WP_Posts_Carousel_Init::SCHEMA_VERSION_OPTION => $version);
    return $GLOBALS['wpdb'];
}

$initializer = require dirname(__DIR__, 2) . '/includes/class-init.php';
require dirname(__DIR__, 2) . '/includes/class-template.php';
require dirname(__DIR__, 2) . '/includes/frontend/class-carousel-query-builder.php';
require dirname(__DIR__, 2) . '/includes/frontend/class-carousel-generator.php';

$tests = array();
$tests['fresh install creates and versions the table once'] = function () use ($initializer) {
    $db = reset_schema();
    $initializer->create_table();
    check($db->table_exists && $db->schema_runs === 1, 'Fresh installation did not create the schema.');
    check(get_option(WP_Posts_Carousel_Init::SCHEMA_VERSION_OPTION) === WP_Posts_Carousel_Init::SCHEMA_VERSION, 'Successful schema was not recorded.');
    $initializer->create_table();
    check($db->schema_runs === 1, 'Current schema ran dbDelta again.');
};
$tests['existing unversioned table is checked once without losing rows'] = function () use ($initializer) {
    $db = reset_schema(true);
    $db->rows = array(array('post_id' => 42, 'params' => '{"title":"Existing carousel"}'));
    $rows = $db->rows;
    $initializer->create_table();
    $initializer->create_table();
    check($db->schema_runs === 1 && $db->rows === $rows, 'Existing installation was not upgraded once or its data changed.');
};
$tests['outdated schema version is upgraded'] = function () use ($initializer) {
    $db = reset_schema(true, '0');
    $initializer->create_table();
    check($db->schema_runs === 1 && get_option(WP_Posts_Carousel_Init::SCHEMA_VERSION_OPTION) === '1', 'Outdated schema marker skipped upgrade.');
};
$tests['current marker cannot hide a missing table'] = function () use ($initializer) {
    $db = reset_schema(false, WP_Posts_Carousel_Init::SCHEMA_VERSION);
    $initializer->create_table();
    check($db->table_exists && $db->schema_runs === 1, 'Missing table was skipped because its marker was current.');
};
$tests['failed creation does not record success and is retried'] = function () use ($initializer) {
    $db = reset_schema();
    $db->fail_schema = true;
    check($initializer->create_table() instanceof WP_Error, 'Failed creation did not return an error.');
    check(get_option(WP_Posts_Carousel_Init::SCHEMA_VERSION_OPTION) === false, 'Failed creation was recorded as successful.');
    $db->fail_schema = false;
    $initializer->create_table();
    check($db->schema_runs === 2 && $db->table_exists, 'Failed creation was not retried.');
};
$tests['failed upgrade keeps the previous schema version'] = function () use ($initializer) {
    $db = reset_schema(true, '0');
    $db->fail_schema = true;
    check($initializer->create_table() instanceof WP_Error, 'Failed upgrade did not return an error.');
    check(get_option(WP_Posts_Carousel_Init::SCHEMA_VERSION_OPTION) === '0', 'Failed upgrade advanced the schema version.');
};
$tests['template minimum versions use semantic ordering in the correct direction'] = function () {
    $template = new WP_Posts_Carousel_Template();
    foreach (array('' => true, '1.10.0' => true, '2.0.0' => true, '2.0.1' => false, '10.0.0' => false) as $required => $compatible) {
        $result = $template->check_template(array('requires_wp_posts_carousel_at_least' => $required, 'template_name' => 'Example'));
        check($result['status'] === $compatible, 'Incorrect compatibility for minimum ' . $required);
    }
};
$tests['public filters reject nested arrays and preserve selected numeric terms'] = function () {
    $generator = new WP_Posts_Carousel_Generator();
    $query_method = new ReflectionMethod('WP_Posts_Carousel_Query_Builder', 'request_term_ids');
    $render_method = new ReflectionMethod('WP_Posts_Carousel_Generator', 'active_filter_terms');
    $query_method->setAccessible(true);
    $render_method->setAccessible(true);
    foreach (array(array('2', array('99'), '3', '2', 'invalid'), '2,3,2,invalid') as $input) {
        $_GET = array('wpcf_topic' => $input);
        check($query_method->invoke(null, 'wpcf_topic') === array(2, 3), 'Query filter accepted malformed IDs.');
        check($render_method->invoke($generator, 'wpcf_topic') === array(2, 3), 'Rendered filter disagrees with the query.');
    }
};

foreach ($tests as $name => $run) {
    $run();
    echo "PASS: " . $name . PHP_EOL;
}
echo count($tests) . " checks passed." . PHP_EOL;

