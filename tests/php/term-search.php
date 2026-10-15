<?php
/** Run: php tests/php/term-search.php. No database or network access. */
define('ABSPATH', __DIR__ . '/');
define('DAY_IN_SECONDS', 86400);
function add_action() {}

class WP_REST_Request extends ArrayObject {}
class WP_REST_Response
{
    private $data;
    public function __construct($data, $status = 200) { $this->data = $data; }
    public function get_data() { return $this->data; }
}
function sanitize_text_field($value) { return strip_tags((string) $value); }
function apply_filters($name, $value) { return $value; }
function wp_reset_postdata() {}
function get_terms($args)
{
    // Model the WP_Term_Query contract: taxonomy selects the vocabulary;
    // 'search' narrows it. The WP_Query 's' argument has no effect here.
    $fixtures = array(
        (object) array('term_id' => 1, 'name' => 'Blog category demo', 'taxonomy' => 'category'),
        (object) array('term_id' => 2, 'name' => 'Business', 'taxonomy' => 'category'),
        (object) array('term_id' => 3, 'name' => 'Blog tag', 'taxonomy' => 'post_tag'),
    );
    return array_values(array_filter($fixtures, function ($term) use ($args) {
        return $term->taxonomy === $args['taxonomy']
            && (empty($args['search']) || stripos($term->name, $args['search']) !== false);
    }));
}
require __DIR__ . '/../../includes/api/class-api.php';
$api = (new ReflectionClass('WP_Posts_Carousel_API'))->newInstanceWithoutConstructor();
foreach (array(
    array('category', 'blog', array('Blog category demo')),
    array('category', '', array('Blog category demo', 'Business')),
    array('category', 'missing-term', array()),
    array('post_tag', 'blog', array('Blog tag')),
) as $case) {
    $request = new WP_REST_Request(array('post_type' => 'post', 'taxonomy' => $case[0], 's' => $case[1]));
    $actual = array_column($api->get_custom_terms($request)->get_data(), 'label');
    if ($actual !== $case[2]) {
        throw new RuntimeException('Term search did not respect the selected taxonomy and search phrase.');
    }
}
echo "Term search: 4 cases passed.\n";
