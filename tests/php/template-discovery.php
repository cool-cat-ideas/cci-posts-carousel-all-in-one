<?php
// Run: php tests/php/template-discovery.php. Uses only disposable local fixtures.
define('ABSPATH', __DIR__);
$fixture = sys_get_temp_dir() . '/cci-wpc-templates-' . bin2hex(random_bytes(6));
define('WP_POSTS_CAROUSEL_DIR_PATH', $fixture . '/core/');
define('WP_POSTS_CAROUSEL_DIR_URL', 'https://example.test/core/');
function get_stylesheet_directory() { return $GLOBALS['fixture'] . '/child'; }
function get_stylesheet_directory_uri() { return 'https://example.test/child'; }
function wp_upload_dir($time = null, $create = false) {
    return array('basedir' => $GLOBALS['fixture'] . '/uploads', 'baseurl' => 'https://example.test/uploads');
}
function trailingslashit($value) { return rtrim($value, '/\\') . '/'; }
function sanitize_key($value) { return preg_replace('/[^a-z0-9_-]/', '', strtolower($value)); }
function sanitize_text_field($value) { return strip_tags($value); }
function esc_url_raw($value) { return $value; }
function apply_filters($name, $value) { return $value; }
class WP_Posts_Carousel_Features {
    public static function template_status($template) { return array('locked' => false); }
}
require dirname(__DIR__, 2) . '/includes/templates/class-templates.php';
$files = array();
$directories = array();
function make_template($root, $folder, $name, $with_view = true) {
    $dir = $root . '/' . $folder;
    if (!is_dir($dir)) {
        $missing = $dir;
        while (!is_dir($missing)) {
            $GLOBALS['directories'][] = $missing;
            $missing = dirname($missing);
        }
        mkdir($dir, 0700, true);
    }
    $manifest = $dir . '/template.json';
    file_put_contents($manifest, json_encode(array('name' => $name, 'render' => 'view.php')));
    $GLOBALS['files'][] = $manifest;
    if ($with_view) {
        file_put_contents($dir . '/view.php', '<?php echo "fixture";');
        $GLOBALS['files'][] = $dir . '/view.php';
    }
    return $dir;
}
function check($condition, $message) {
    if (!$condition) throw new RuntimeException($message);
    echo 'PASS: ' . $message . PHP_EOL;
}
try {
    $core = make_template($fixture . '/core/templates', 'default', 'default');
    $child = make_template($fixture . '/child/wp-posts-carousel/templates', 'default', 'default');
    check(WP_Posts_Carousel_Templates::get_template('default')['dir'] === $child, 'Child theme overrides core');
    unlink($child . '/view.php');
    check(WP_Posts_Carousel_Templates::get_template('default')['dir'] === $core, 'Incomplete override falls back to core');
    make_template($fixture . '/uploads/wp-posts-carousel/templates', 'missing-view', 'missing-view', false);
    check(WP_Posts_Carousel_Templates::get_template('missing-view') === null, 'Missing view is not offered as usable');
    make_template($fixture . '/uploads/wp-posts-carousel/templates', 'empty-name', '!!!');
    check(WP_Posts_Carousel_Templates::get_template('') === null, 'Empty sanitized names are rejected');
    $custom = make_template($fixture . '/child/wp-posts-carousel/templates', 'custom', 'custom');
    check(WP_Posts_Carousel_Templates::get_template('custom')['dir'] === $custom, 'New child-theme templates remain discoverable');
    check(count(WP_Posts_Carousel_Templates::discover_templates()) === 2, 'Only usable unique templates are listed');
} finally {
    foreach (array_unique($files) as $file) if (is_file($file)) unlink($file);
    $directories = array_unique($directories);
    usort($directories, function ($a, $b) { return strlen($b) - strlen($a); });
    foreach ($directories as $directory) rmdir($directory);
}
