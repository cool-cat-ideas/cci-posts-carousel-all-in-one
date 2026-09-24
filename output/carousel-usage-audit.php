<?php
$_SERVER['HTTP_HOST']='localhost:4060';
require '/var/www/html/wp-load.php';
$carousels=get_posts(['post_type'=>'wp-posts-carousel','post_status'=>'any','numberposts'=>-1]);
foreach($carousels as $p) echo json_encode(['id'=>$p->ID,'title'=>$p->post_title,'status'=>$p->post_status,'key'=>get_post_meta($p->ID,'_wp_posts_carousel_demo_key',true)])."\n";
echo "PAGES\n";
$posts=get_posts(['post_type'=>['post','page','wp_block','wp_template','wp_template_part','product'],'post_status'=>'publish','numberposts'=>-1]);
foreach($posts as $p) {echo json_encode(['id'=>$p->ID,'type'=>$p->post_type,'url'=>get_permalink($p),'content'=>str_contains($p->post_content,'carousel') ? $p->post_content : null])."\n";}
echo "WIDGETS\n";echo json_encode(['sidebars'=>get_option('sidebars_widgets'),'carousel'=>get_option('widget_wp_posts_carousel')]);
