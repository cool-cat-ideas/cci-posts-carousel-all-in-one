/*
 * Author: Marcin Gierada
 * Author URI: http://www.teastudio.pl/
 * Author Email: m.gierada@teastudio.pl
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

var tb_position;
jQuery(document).ready(function($) {

    /**
     * js messages
     */
    var Wp_Posts_Carousel_Message = function(options) {
        var params = {
            's' : 5,
            'type' : 'error'
        }

        $.extend(params, options);

        if ( !params.type || !params.message ) {
            alert(wp_posts_carousel.error_detected);
            return false;
        }

        if ( $.inArray(params.type, ['success', 'error']) == -1 ) {
            params.type = 'error';
        }

        var message_id = 'wp-posts-carousel-js-message-' + Math.floor((Math.random() * 1000) + 1);
        var html = '<div id="' + message_id + '" class="wp-posts-carousel-js-message wp-posts-carousel-js-message-' + params.type + '" style="display:none;">';
                html += '<span class="wp-posts-carousel-js-message-icon"></span>' + params.message;
                html += '<p class="wp-posts-carousel-js-message-notice">' + wp_posts_carousel.hide_in + ' <span class="wp-posts-carousel-js-message-counter">' + params.s + '</span>s</p>';
            html += '</div>';

        $('body').append(html);

        var obj = $('#' + message_id);
        obj.slideDown();

        setInterval(function() {
            var time = params.s--;
            $('.wp-posts-carousel-js-message-counter', obj).html(time);

            if ( time == 1 ) {
                $(obj).slideUp(function() {
                    $(this).remove();
                });
            }
        }, 1000);
    };

    /**
     * open modal window with shortcodes
     */
    $('body').on('click', '.wp-posts-carousel-editor-button', function() {
        tb_show('WP Posts Carousel','admin-ajax.php?action=wp_posts_carousel');
        return false;
    });

    /*
     * insert the carousel shortcode
     */
    $('body').on('click', '#TB_ajaxContent .wp-posts-carousel-insert', function(event) {
        var shortcode = null,
            row = $(this).parents('tr'),
            win = window.dialogArguments || opener || parent || top;

        if ( $('.wp-posts-carousel-shortcode-sample', row).is(':visible') ) {
            shortcode = $('.wp-posts-carousel-shortcode-sample', row).html();

            win.send_to_editor(shortcode);
            tb_remove();
            Wp_Posts_Carousel_Message({
                'type' : 'success',
                'message' : wp_posts_carousel.shortcode_placed
            });
        } else {
            Wp_Posts_Carousel_Message({
                'type' : 'error',
                'message' : wp_posts_carousel.shortcode_missing
            });
        }
    });

    /**
     * disable metabox sorting
     */
    if ( $('body.post-type-wp-posts-carousel').is(':visible') ) {
        $('body.post-type-wp-posts-carousel #postbox-container-2 .meta-box-sortables').sortable({
            disabled: true
        });
    }

    /**
     * field listener
     */
    $('body').on('change keyup', '.wp-posts-carousel-field.field-validate', function(event) {
        var plugin_field = $(this);

        if ( plugin_field.val() != '' ) {
            if ( typeof plugin_field.attr('pattern') !== typeof undefined && plugin_field.attr('pattern') !== false ) {
                var reg = new RegExp( plugin_field.attr('pattern') );
                if ( reg.test( plugin_field.val() ) ) {
                    $(this).removeClass('field-invalid');
                } else {
                    $(this).addClass('field-invalid');
                }
            }
        } else {
            if ( typeof plugin_field.attr('required') !== typeof undefined && plugin_field.attr('required') !== false ) {
                $(this).addClass('field-invalid');
            } else {
                $(this).removeClass('field-invalid');
            }
        }
    });

    /**
     * validate the plugin forms
     */
    $('body.post-type-wp-posts-carousel').on('click', '#publish', function(event) {
        var elem = $('#post');

        if ( $('.field-invalid', elem).length > 0 ) {
            Wp_Posts_Carousel_Message({
                'type' : 'error',
                'message' : wp_posts_carousel.error_detected + '\n' + wp_posts_carousel.fields_invalid
            });
            return false;
        } else if ( $('.wp-posts-carousel-breakpoint', elem).length === 0 ) {
            Wp_Posts_Carousel_Message({
                'type' : 'error',
                'message' : wp_posts_carousel.error_detected + '\n' + wp_posts_carousel.breakpoints_invalid
            });
            return false;
        } else if ( $('#wp-posts-carousel-templates input:checked', elem).length === 0 ) {
            Wp_Posts_Carousel_Message({
                'type' : 'error',
                'message' : wp_posts_carousel.error_detected + '\n' + wp_posts_carousel.templates_invalid
            });
            return false;
        }
        return true;
    });



    /*
     * save the widget
     */
    $('body').on('click', '.widget form .widget-control-save', function(event) {
        var id = $(this).attr('id'),
            elem = $(this).parents('form');

        if ( id.includes('wp_posts_carousel-') ) {
            if ( $('.field-required option:selected[value=""]', elem ).length > 0 ) {
                Wp_Posts_Carousel_Message({
                    'type' : 'error',
                    'message' : wp_posts_carousel.error_detected + '\n' + wp_posts_carousel.fields_invalid
                });
                $('.field-required', elem ).addClass('field-invalid');
                return false;
            } else {
                $('.field-required', elem ).removelass('field-invalid');
            }
        }
        return true;
    });

    /**
     * fix to tb width
     */
    tb_position = function() {
        var tbWindow = $('#TB_window'),
            width = $(window).width(),
            height = $(window).height(),
            H = height,
            W = ( 1240 < width ) ? 1040 : width,
            adminbar_height = 0;

        if ( $('#wpadminbar').length ) {
            adminbar_height = parseInt( $('#wpadminbar').css('height'), 10 );
        }

        if ( tbWindow.size() ) {
            tbWindow.width( W - 50 ).height( H - 45 - adminbar_height );
            $('#TB_ajaxContent').width( W -50 ).height( H - 45 - adminbar_height );
            tbWindow.css({'margin-left': '-' + parseInt( ( ( W - 50 ) / 2 ), 10 ) + 'px'});
            if ( typeof document.body.style.maxWidth !== 'undefined' ) {
                tbWindow.css({'top': 20 + adminbar_height + 'px', 'margin-top': '0'});
            }
        }
    };

    $(window).resize(function(){ tb_position(); });
});
