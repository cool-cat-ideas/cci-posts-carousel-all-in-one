<?php
/**
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

/**
 * WP_Posts_Carousel_Admin class
 */
class WP_Posts_Carousel_API {
    protected $site_url = 'http://demuo.wp-api.org/wp-json/wp/v2/';

    /**
     * Constructor
     */
    public function __construct() {

    }

    /**
     * get templates list
     */
    public function get_templates() {
        $templates = array();
        // $args = 'posts/?page=2';        
        // $json = @ file_get_contents( $this->site_url . $args );

        // if ( $json ) {
        //     $templates = json_decode($json);
        // }
        // echo'<pre>';print_r($templates);exit;
        return $templates;
    }

    /**
     * get integrations list
     */
    public function get_integrations() {
        $integrations = array();
        // $args = 'posts/?page=2';        
        // $json = @ file_get_contents( $this->site_url . $args );

        // if ( $json ) {
        //     $integrations = json_decode($json);
        // }
        // echo'<pre>';print_r($integrations);exit;
        return $integrations;
    }
}

return new WP_Posts_Carousel_API();