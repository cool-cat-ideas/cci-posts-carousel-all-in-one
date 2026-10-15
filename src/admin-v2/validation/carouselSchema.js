import { z } from 'zod';
import { __ } from '../i18n/i18n';

const slideSchema = z
	.object( {
		label: z.string().optional(),
		span: z.any().optional(),
		crop_x: z.any().optional(),
		crop_y: z.any().optional(),
	} )
	.passthrough()
	.superRefine( ( slide, context ) => {
		const span = Number( slide.span );

		if ( slide.span !== undefined && ( Number.isNaN( span ) || span < 1 || span > 6 ) ) {
			context.addIssue( {
				code: 'custom',
				path: [ 'span' ],
				message: __( 'Slide width must be between 1 and 6 columns.', 'wp-posts-carousel' ),
			} );
		}

		[ 'crop_x', 'crop_y' ].forEach( ( key ) => {
			const offset = Number( slide[ key ] );

			if ( slide[ key ] !== undefined && ( Number.isNaN( offset ) || offset < -100 || offset > 100 ) ) {
				context.addIssue( {
					code: 'custom',
					path: [ key ],
					message: __( 'Image offset must be between -100% and 100%.', 'wp-posts-carousel' ),
				} );
			}
		} );
	} );

const carouselSchema = z
	.object( {
		title: z.string().trim().min( 1, __( 'Carousel title is required.', 'wp-posts-carousel' ) ),
		status: z.enum( [ 'draft', 'publish' ] ),
		post_selection_options: z.object( {
			posts: z.array( slideSchema ),
		} ).passthrough(),
		carousel_options: z.object( {} ).passthrough().optional(),
	} )
	.passthrough()
	.superRefine( ( form, context ) => {
        const selection = form.post_selection_options;
        const mode = selection.mode || (selection.posts.length ? 'manual' : 'query');
        if (mode === 'manual' && !selection.posts.length) {
            context.addIssue({ code: 'custom', path: ['post_selection_options', 'posts'], message: __('Add at least one slide.', 'wp-posts-carousel') });
        }
        if (mode === 'query' && (!selection.post_types?.length || !(Number(selection.all_items) > 0))) {
            context.addIssue({ code: 'custom', path: ['post_selection_options'], message: __('Choose a post type and a positive posts limit.', 'wp-posts-carousel') });
        }
        const options = form.carousel_options || {};
		const minimums = {
			slide_by: 1,
			start_position: 0,
			margin: 0,
			stage_padding: 0,
			auto_play_timeout: 0,
			auto_play_speed: 0,
			nav_speed: 0,
			dots_speed: 0,
			lazy_load_eager: 0,
			mousewheel_sensitivity: 0.1,
			touch_ratio: 0,
		};

		Object.entries( minimums ).forEach( ( [ key, min ] ) => {
			if ( options[ key ] === '' || options[ key ] === undefined || options[ key ] === null ) {
				return;
			}

			const value = Number( options[ key ] );

			if ( Number.isNaN( value ) || value < min ) {
				context.addIssue( {
					code: 'custom',
					path: [ 'carousel_options', key ],
					message:
						min === 0
							? __( 'Carousel numeric values cannot be negative.', 'wp-posts-carousel' )
							: __( 'Slide by must be at least 1.', 'wp-posts-carousel' ),
				} );
			}
		} );

		const responsive = options.items_to_show || options.breakpoints || {};

		Object.entries( responsive ).forEach( ( [ breakpoint, items ] ) => {
			const width = Number( breakpoint );
			const count = Number( typeof items === 'object' ? items.items : items );

			if ( Number.isNaN( width ) || width < 1 ) {
				context.addIssue( {
					code: 'custom',
					path: [ 'carousel_options', 'items_to_show', breakpoint ],
					message: __( 'Breakpoint width must be greater than 0.', 'wp-posts-carousel' ),
				} );
			}

			if ( Number.isNaN( count ) || count < 1 ) {
				context.addIssue( {
					code: 'custom',
					path: [ 'carousel_options', 'items_to_show', breakpoint ],
					message: __( 'Responsive items must be at least 1.', 'wp-posts-carousel' ),
				} );
			}
		} );

		const autoplayIndicatorModes = [ 'none', 'progress', 'countdown', 'both' ];

		if (
			options.autoplay_indicator &&
			! autoplayIndicatorModes.includes( String( options.autoplay_indicator ) )
		) {
			context.addIssue( {
				code: 'custom',
				path: [ 'carousel_options', 'autoplay_indicator' ],
				message: __( 'Choose a valid autoplay progress indicator.', 'wp-posts-carousel' ),
			} );
		}
	} );

export function validateCarouselForm( form ) {
	const result = carouselSchema.safeParse( form );

	if ( result.success ) {
		return {
			valid: true,
			messages: [],
			fields: {},
		};
	}

	const fields = result.error.issues.reduce( ( errors, issue ) => {
		const key = issue.path.join( '.' ) || 'form';

		return {
			...errors,
			[ key ]: errors[ key ] || issue.message,
		};
	}, {} );

	return {
		valid: false,
		messages: Array.from( new Set( result.error.issues.map( ( issue ) => issue.message ) ) ),
		fields,
	};
}
