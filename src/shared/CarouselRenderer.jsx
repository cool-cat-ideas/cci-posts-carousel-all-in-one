import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	cropPosition,
	descriptionText,
	itemSpan,
	stripHtml,
	truthy,
} from './carousel-view-utils';
import './carousel-renderer.css';
import { carouselTimings } from './carousel-timing.mjs';

function fallbackReadMore() {
	return window.wp?.i18n?.__( 'read more', 'wp-posts-carousel' ) || 'read more';
}

function buttonLabel( slide ) {
	const text = stripHtml( slide.actions?.buttons_html );

	return text || fallbackReadMore();
}

function slideTrackingId( slide, index = 0 ) {
	const sourceKind = slide?.source?.kind || '';
	const sourceId = slide?.source?.id ?? '';
	const slideId = slide?.id ?? '';
	const type = slide?.type || 'slide';
	const raw = sourceKind && sourceId !== ''
		? `${ sourceKind }-${ sourceId }`
		: slideId !== ''
			? `${ type }-${ slideId }`
			: `slide-${ index + 1 }`;

	return String( raw )
		.replace( /[^a-zA-Z0-9_-]+/g, '-' )
		.replace( /^[-_]+|[-_]+$/g, '' )
		.slice( 0, 64 ) || `slide-${ index + 1 }`;
}

function templateClassName( templateName ) {
	const normalized = String( templateName || 'default' )
		.toLowerCase()
		.replace( /[^a-z0-9_-]+/g, '-' )
		.replace( /^-+|-+$/g, '' );

	return normalized || 'default';
}

function normalizeItemsValue( value ) {
	if ( value && typeof value === 'object' ) {
		return Number( value.items || value.value || 1 );
	}

	return Number( value || 1 );
}

function itemsForWidth( options, width ) {
	const source = options.items_to_show || options.breakpoints || {};

	if ( ! source || typeof source !== 'object' ) {
		return Math.max( 1, normalizeItemsValue( options.items || 1 ) );
	}

	const breakpoints = Object.keys( source )
		.map( ( key ) => Number( key ) )
		.filter( ( key ) => ! Number.isNaN( key ) )
		.sort( ( a, b ) => a - b );

	if ( ! breakpoints.length ) {
		return Math.max( 1, normalizeItemsValue( options.items || 1 ) );
	}

	const matched = breakpoints.reduce(
		( result, breakpoint ) => ( width >= breakpoint ? breakpoint : result ),
		breakpoints[ 0 ]
	);

	return Math.max( 1, normalizeItemsValue( source[ matched ] ) );
}

function useResponsiveItems( options, rootRef ) {
	const [ width, setWidth ] = useState( () =>
		typeof window === 'undefined' ? 1024 : window.innerWidth
	);

	useEffect( () => {
		if ( typeof window === 'undefined' ) {
			return undefined;
		}

		const preview = rootRef.current?.closest( '[data-wpc-preview-viewport]' );
		if ( preview ) {
			const updateWidth = () => setWidth( preview.clientWidth );
			const observer = new ResizeObserver( updateWidth );
			updateWidth();
			observer.observe( preview );
			return () => observer.disconnect();
		}
		const updateWidth = () => setWidth( window.innerWidth );
		window.addEventListener( 'resize', updateWidth );

		return () => window.removeEventListener( 'resize', updateWidth );
	}, [ rootRef ] );

	return useMemo( () => itemsForWidth( options, width ), [ options, width ] );
}

function usePrefersReducedMotion() {
	const [ reducedMotion, setReducedMotion ] = useState( false );

	useEffect( () => {
		if ( typeof window === 'undefined' || ! window.matchMedia ) {
			return undefined;
		}

		const media = window.matchMedia( '(prefers-reduced-motion: reduce)' );
		const update = () => setReducedMotion( media.matches );

		update();
		if ( media.addEventListener ) {
			media.addEventListener( 'change', update );
		} else {
			media.addListener( update );
		}

		return () => {
			if ( media.removeEventListener ) {
				media.removeEventListener( 'change', update );
			} else {
				media.removeListener( update );
			}
		};
	}, [] );

	return reducedMotion;
}

const FALLBACK_ICON_LIBRARIES = {
	fontawesome: {
		classBase: 'fa',
		classPrefix: 'fa-',
		defaults: {
			previous: 'angle-left',
			next: 'angle-right',
			up: 'angle-up',
			down: 'angle-down',
		},
	},
	tabler: {
		classBase: 'ti',
		classPrefix: 'ti-',
		defaults: {
			previous: 'chevron-left',
			next: 'chevron-right',
			up: 'chevron-up',
			down: 'chevron-down',
		},
	},
};

function sanitizeIconName( value ) {
	return String( value || '' )
		.trim()
		.replace( /\s+/g, '-' )
		.replace( /[^A-Za-z0-9_-]/g, '' );
}

function fallbackNavigationIcon( options, direction ) {
	const navigationIcons = options.navigation_icons || {};
	const libraryKey = sanitizeIconName( options.nav_icon_library || navigationIcons.library || 'fontawesome' ).toLowerCase();
	const library = FALLBACK_ICON_LIBRARIES[ libraryKey ] || FALLBACK_ICON_LIBRARIES.fontawesome;
	const name = sanitizeIconName(
		options[ `nav_icon_${ direction }` ] || library.defaults[ direction ]
	);
	const className = `${ library.classBase } ${ library.classPrefix }${ name }`.trim();

	return {
		className,
		direction,
		library: libraryKey,
		name,
	};
}

function navigationIcon( options, direction ) {
	const navigationIcons = options.navigation_icons || {};
	const configured = navigationIcons[ direction ];

	if ( configured && typeof configured === 'object' ) {
		return configured;
	}

	return fallbackNavigationIcon( options, direction );
}

function navigationIconPair( options, isVerticalDirection ) {
	return {
		previous: navigationIcon( options, isVerticalDirection ? 'up' : 'previous' ),
		next: navigationIcon( options, isVerticalDirection ? 'down' : 'next' ),
	};
}

function NavigationIcon( { icon } ) {
	if ( icon?.html ) {
		return (
			<span
				className="cci-wpc-navigation-icon"
				dangerouslySetInnerHTML={ { __html: icon.html } }
			/>
		);
	}

	const fallback = fallbackNavigationIcon( {}, 'next' );

	return <i className={ icon?.className || fallback.className } aria-hidden="true" />;
}

function SlideCard( {
	className = '',
	imageFetchPriority,
	imageLoading,
	interactive,
	showButton,
	showDescription,
	showImage,
	showTitle,
	slide,
	style,
	index = 0,
} ) {
	const woocommerceCard = slide.html?.woocommerce_card || '';

	if ( woocommerceCard ) {
		return (
				<article
					className={ `cci-wpc-render-preview-slide cci-wpc-render-preview-slide-woocommerce ${ className }` }
					data-wpc-slide-id={ slideTrackingId( slide, index ) }
					style={ style }
				>
				<div
					className="cci-wpc-render-preview-woocommerce-inner"
					dangerouslySetInnerHTML={ { __html: woocommerceCard } }
				/>
			</article>
		);
	}

	return (
		<article className={ `cci-wpc-card cci-wpc-card-react cci-wpc-render-preview-slide ${ className }` } data-wpc-slide-id={ slideTrackingId( slide, index ) } style={ style }>
			{ showImage && (
				<div className="cci-wpc-card-media cci-wpc-render-preview-image">
					{ slide.image?.src ? (
						<img
							src={ slide.image.src }
							alt={ slide.image.alt || slide.title?.text || '' }
							decoding="async"
							fetchPriority={ imageFetchPriority }
							loading={ imageLoading }
							style={ { objectPosition: cropPosition( slide ) } }
						/>
					) : (
						<span>{ slide.title?.text ? slide.title.text.charAt( 0 ) : '?' }</span>
					) }
				</div>
			) }

			<div className="cci-wpc-card-body cci-wpc-render-preview-body">
				<small className="cci-wpc-card-taxonomy">{ slide.post_type || slide.type }</small>
				{ showTitle && <strong className="cci-wpc-card-title">{ slide.title?.text || slide.id }</strong> }
				{ showDescription && descriptionText( slide ) && (
					<p className="cci-wpc-card-description">{ descriptionText( slide ) }</p>
				) }
				{ showButton && slide.url && interactive && (
					<a className="cci-wpc-card-actions cci-wpc-render-preview-button" href={ slide.url }>
						{ buttonLabel( slide ) }
					</a>
				) }
				{ showButton && slide.url && ! interactive && (
					<span className="cci-wpc-card-actions cci-wpc-render-preview-button">{ buttonLabel( slide ) }</span>
				) }
			</div>
		</article>
	);
}

function templateExtensionRenderer( templateName ) {
	const registry = typeof window !== 'undefined' ? window.wpPostsCarouselTemplateRenderers : null;
	const renderer = registry?.[ templateName ];

	return typeof renderer === 'function' ? renderer : null;
}

function ExtensionTemplateCard( {
	carousel,
	className = '',
	index = 0,
	interactive,
	isActive = false,
	renderer,
	slide,
	style,
	templateName,
} ) {
	if ( ! renderer ) {
		return null;
	}

	const html = renderer( {
		carousel,
		className,
		index,
		interactive,
		isActive,
		slide,
		slideTrackingId: slideTrackingId( slide, index ),
		templateName,
	} );

	if ( ! html ) {
		return null;
	}

	return (
		<article
			className={ `cci-wpc-render-preview-slide cci-wpc-extension-template-slide ${ className }` }
			data-wpc-slide-id={ slideTrackingId( slide, index ) }
			style={ style }
			dangerouslySetInnerHTML={ { __html: String( html ) } }
		/>
	);
}


function dispatchSourceEvent( sourceElement, name, detail ) {
	if ( ! sourceElement || typeof CustomEvent !== 'function' ) {
		return;
	}

	sourceElement.dispatchEvent(
		new CustomEvent( name, {
			bubbles: true,
			detail,
		} )
	);
}

export default function CarouselRenderer( {
	carousel,
	engineAdapter = null,
	engineName = 'fallback',
	interactive = false,
	labels = {},
	layout = 'grid',
	limit = 10,
	sourceElement = null,
} ) {
	const templateName = carousel?.template?.name || carousel?.template_name || '';
	const [ extensionRegistryVersion, setExtensionRegistryVersion ] = useState( 0 );
	const extensionSlideRenderer = useMemo( () => templateExtensionRenderer( templateName ), [ templateName, extensionRegistryVersion ] );
	const normalizedTemplateName = templateClassName( templateName );
	const rawOptions = carousel?.engine?.options || {};
	const options = useMemo( () => rawOptions, [ rawOptions ] );
	const rootRef = useRef( null );
	const responsiveItems = useResponsiveItems( options, rootRef );
	const reducedMotion = usePrefersReducedMotion();
	const paginationRef = useRef( null );
	const prevRef = useRef( null );
	const nextRef = useRef( null );
	const engineInstanceRef = useRef( null );
	const [ activeIndex, setActiveIndex ] = useState( 0 );
	const [ adapterFailed, setAdapterFailed ] = useState( false );
	const [ paused, setPaused ] = useState( false );
	const [ transitionKind, setTransitionKind ] = useState( 'navigation' );

	useEffect( () => {
		if ( typeof window === 'undefined' ) {
			return undefined;
		}

		const refreshTemplateExtensions = () => setExtensionRegistryVersion( ( version ) => version + 1 );
		window.addEventListener( 'wp-posts-carousel:template-renderers-updated', refreshTemplateExtensions );

		return () => {
			window.removeEventListener( 'wp-posts-carousel:template-renderers-updated', refreshTemplateExtensions );
		};
	}, [] );

	const slides = Array.isArray( carousel?.slides ) ? carousel.slides : [];
	const visibleSlides = limit ? slides.slice( 0, limit ) : slides;
	const isCarousel = layout === 'carousel';
	const items = extensionSlideRenderer ? 1 : Math.min( Math.max( 1, responsiveItems ), Math.max( 1, visibleSlides.length ) );
	const maxIndex = Math.max( 0, visibleSlides.length - items );
	const loop = truthy( options.loop, true );
	const canNavigate = visibleSlides.length > items;
	const usesEngineAdapter = ! adapterFailed && interactive && isCarousel && engineAdapter?.mount && engineName !== 'fallback';
	const activeEngineName = usesEngineAdapter ? engineName : 'fallback';
	const autoplay = ! usesEngineAdapter && interactive && isCarousel && canNavigate && ! reducedMotion && truthy( options.auto_play, true );
	const timings = carouselTimings( options );
	const autoplayTimeout = timings.delay;
	const stopOnHover = truthy( options.stop_on_hover, true );

	useEffect( () => {
		setActiveIndex( ( current ) => Math.min( current, maxIndex ) );
	}, [ maxIndex ] );

	useEffect( () => {
		setAdapterFailed( false );
		engineInstanceRef.current = null;
	}, [ engineAdapter, engineName ] );

	useEffect( () => {
		if ( ! autoplay || paused ) {
			return undefined;
		}

		const timer = window.setInterval( () => {
			setTransitionKind( 'autoplay' );
			setActiveIndex( ( current ) => {
				if ( current >= maxIndex ) {
					return loop ? 0 : current;
				}

				return current + 1;
			} );
		}, autoplayTimeout );

		return () => window.clearInterval( timer );
	}, [ autoplay, autoplayTimeout, loop, maxIndex, paused ] );

	useEffect( () => {
		if ( ! usesEngineAdapter || ! rootRef.current ) {
			return undefined;
		}

		let cleanup = null;
		let cancelled = false;
		const result = engineAdapter.mount( {
			carousel,
			labels,
			nextEl: nextRef.current,
			onActiveIndexChange: ( index ) => setActiveIndex( Math.max( 0, Math.min( maxIndex, Number( index ) || 0 ) ) ),
			onReady: ( instance ) => {
				engineInstanceRef.current = instance || null;
			},
			options,
			paginationEl: paginationRef.current,
			prevEl: prevRef.current,
			root: rootRef.current,
			slidesCount: visibleSlides.length,
		} );

		Promise.resolve( result )
			.then( ( destroy ) => {
				if ( typeof destroy !== 'function' ) {
					return;
				}

				if ( cancelled ) {
					destroy();
					return;
				}

				cleanup = destroy;
				sourceElement?.setAttribute( 'data-wpc-engine-state', 'ready' );
				dispatchSourceEvent( sourceElement, 'wp-posts-carousel:engine-ready', {
					carousel,
					engine: engineName,
				} );
			} )
			.catch( ( error ) => {
				if ( ! cancelled ) {
					sourceElement?.setAttribute( 'data-wpc-engine-state', 'fallback' );
					dispatchSourceEvent( sourceElement, 'wp-posts-carousel:engine-error', {
						carousel,
						engine: engineName,
						error,
						fallback: true,
					} );
					setAdapterFailed( true );
				}
			} );

		return () => {
			cancelled = true;
			engineInstanceRef.current = null;

			if ( cleanup ) {
				cleanup();
			}
		};
	}, [ carousel, engineAdapter, engineName, labels, maxIndex, options, sourceElement, usesEngineAdapter, visibleSlides.length ] );

	if ( ! carousel ) {
		return null;
	}

	const showImage = truthy( options.show_featured_image, true );
	const showTitle = truthy( options.show_title, true );
	const showDescription = options.show_description && options.show_description !== 'false';
	const showButton = truthy( options.show_more_button, true );
	const showCategories = truthy( options.show_categories, true );
	const showTags = truthy( options.show_tags, false );
	const showAuthor = truthy( options.show_author, false );
	const autoWidth = truthy( options.auto_width, false );
	const previousLabel = labels.previous || 'previous';
	const nextLabel = labels.next || 'next';
	const isVerticalDirection = String( options.direction || 'horizontal' ) === 'vertical';
	const navIcons = navigationIconPair( options, isVerticalDirection );
	const SlideComponent = extensionSlideRenderer ? ExtensionTemplateCard : SlideCard;
	const lazyImages = truthy( options.lazy_images, true );
	const firstImageEager = truthy( options.first_image_eager, false );

	const goTo = ( index, kind = 'navigation' ) => {
		if ( ! canNavigate ) {
			return;
		}
		setTransitionKind( kind );

		if ( usesEngineAdapter && engineInstanceRef.current ) {
			const target = Math.max( 0, Math.min( maxIndex, index ) );
			const instance = engineInstanceRef.current;

			if ( loop && typeof instance.slideToLoop === 'function' ) {
				instance.slideToLoop( target, reducedMotion ? 0 : timings[ kind ] );
			} else if ( typeof instance.slideTo === 'function' ) {
				instance.slideTo( target, reducedMotion ? 0 : timings[ kind ] );
			}

			setActiveIndex( target );
			return;
		}

		if ( loop ) {
			if ( index > maxIndex ) {
				setActiveIndex( 0 );
				return;
			}

			if ( index < 0 ) {
				setActiveIndex( maxIndex );
				return;
			}

			setActiveIndex( index );
			return;
		}

		setActiveIndex( Math.max( 0, Math.min( maxIndex, index ) ) );
	};

	const previous = () => goTo( activeIndex - 1 );
	const next = () => goTo( activeIndex + 1 );
	const resumeWhenFocusLeaves = ( event ) => {
		if ( event.currentTarget.contains( event.relatedTarget ) ) {
			return;
		}

		if ( usesEngineAdapter ) {
			engineInstanceRef.current?.autoplay?.resume?.();
			return;
		}

		setPaused( false );
	};
	const pauseForInteraction = () => {
		if ( usesEngineAdapter ) {
			engineInstanceRef.current?.autoplay?.pause?.();
			return;
		}

		setPaused( true );
	};
	const pauseFallbackOnHover = () => {
		if ( stopOnHover && ! usesEngineAdapter ) {
			setPaused( true );
		}
	};
	const resumeFallbackAfterHover = () => {
		if ( stopOnHover && ! usesEngineAdapter ) {
			setPaused( false );
		}
	};
	const paginationItems = Math.max( 1, maxIndex + 1 );
	const rootStyle = {
		'--wpc-render-items': items,
		'--wpc-transition-duration': `${ reducedMotion ? 0 : timings[ transitionKind ] }ms`,
	};

	return (
		<div
			className={ `cci-wpc-render-preview cci-wpc-${ layout } cci-wpc-engine-${ activeEngineName } cci-wpc-template-${ normalizedTemplateName }${ autoWidth ? ' cci-wpc-auto-width' : '' }` }
			data-wpc-engine-adapter={ activeEngineName }
			data-wpc-react-view="carousel"
			data-wpc-template={ normalizedTemplateName }
			onBlur={ resumeWhenFocusLeaves }
			onFocus={ pauseForInteraction }
			onMouseEnter={ pauseFallbackOnHover }
			onMouseLeave={ resumeFallbackAfterHover }
			style={ rootStyle }
		>
			{ isCarousel ? (
				<div
					ref={ rootRef }
					className={ `cci-wpc-render-preview-viewport${ usesEngineAdapter ? ' swiper' : '' }` }
				>
					<div
						className={ `cci-wpc-render-preview-track${ usesEngineAdapter ? ' swiper-wrapper' : '' }` }
						style={ {
							transform: usesEngineAdapter
								? undefined
								: isVerticalDirection
									? `translate3d(0, -${ activeIndex * ( 100 / items ) }%, 0)`
									: `translate3d(-${ activeIndex * ( 100 / items ) }%, 0, 0)`,
						} }
					>
						{ visibleSlides.map( ( slide, index ) => (
							<SlideComponent
								key={ `${ slide.id }-${ index }` }
								interactive={ interactive }
								index={ index }
								imageFetchPriority={ firstImageEager && index === 0 ? 'high' : undefined }
								imageLoading={ firstImageEager && index === 0 ? 'eager' : lazyImages ? 'lazy' : undefined }
								carousel={ carousel }
								renderer={ extensionSlideRenderer }
								showButton={ showButton }
								showAuthor={ showAuthor }
								showCategories={ showCategories }
								showDescription={ showDescription }
								showImage={ showImage }
								showTags={ showTags }
								showTitle={ showTitle }
								allSlides={ visibleSlides }
								activeIndex={ activeIndex }
								className={ usesEngineAdapter ? 'swiper-slide' : '' }
								isActive={ index === activeIndex }
								onSelectSlide={ goTo }
								slide={ slide }
								templateName={ templateName }
							/>
						) ) }
					</div>
				</div>
			) : (
				<div className="cci-wpc-render-preview-stage">
					{ visibleSlides.map( ( slide, index ) => (
						<SlideComponent
							key={ `${ slide.id }-${ index }` }
							interactive={ interactive }
							index={ index }
							imageFetchPriority={ firstImageEager && index === 0 ? 'high' : undefined }
							imageLoading={ firstImageEager && index === 0 ? 'eager' : lazyImages ? 'lazy' : undefined }
							carousel={ carousel }
							renderer={ extensionSlideRenderer }
							showButton={ showButton }
							showAuthor={ showAuthor }
							showCategories={ showCategories }
							showDescription={ showDescription }
							showImage={ showImage }
							showTags={ showTags }
							showTitle={ showTitle }
							allSlides={ visibleSlides }
							activeIndex={ activeIndex }
							isActive={ index === activeIndex }
							onSelectSlide={ goTo }
							slide={ slide }
							templateName={ templateName }
							style={ {
								gridColumn: `span ${ itemSpan( slide ) }`,
							} }
						/>
					) ) }
				</div>
			) }

			<div
				className="cci-wpc-render-preview-chrome"
				aria-hidden={ interactive && isCarousel ? undefined : 'true' }
			>
				{ truthy( options.nav, true ) && (
					<div className="cci-wpc-render-preview-nav">
							{ interactive && isCarousel ? (
								<>
									<button
										ref={ prevRef }
										type="button"
										className="cci-wpc-render-preview-prev"
										aria-label={ previousLabel }
										disabled={ usesEngineAdapter ? undefined : ! canNavigate || ( ! loop && activeIndex === 0 ) }
										onClick={ ! usesEngineAdapter ? previous : undefined }
									>
										<NavigationIcon icon={ navIcons.previous } />
									</button>
									<button
										ref={ nextRef }
										type="button"
										className="cci-wpc-render-preview-next"
										aria-label={ nextLabel }
										disabled={ usesEngineAdapter ? undefined : ! canNavigate || ( ! loop && activeIndex >= maxIndex ) }
										onClick={ ! usesEngineAdapter ? next : undefined }
									>
										<NavigationIcon icon={ navIcons.next } />
									</button>
								</>
						) : (
							<>
								<span><NavigationIcon icon={ navIcons.previous } /></span>
								<span><NavigationIcon icon={ navIcons.next } /></span>
							</>
						) }
					</div>
				) }
				{ truthy( options.dots, true ) && (
					usesEngineAdapter ? (
						<div ref={ paginationRef } className="cci-wpc-render-preview-dots swiper-pagination" />
					) : (
						<div className="cci-wpc-render-preview-dots">
							{ visibleSlides.slice( 0, Math.max( 1, maxIndex + 1 ) ).map( ( slide, index ) => (
								interactive && isCarousel ? (
									<button
										key={ `${ slide.id }-${ index }` }
										type="button"
										aria-label={ `${ index + 1 }` }
										className={ index === activeIndex ? 'cci-wpc-active' : '' }
										onClick={ () => goTo( index, 'dots' ) }
									/>
								) : (
									<span key={ `${ slide.id }-${ index }` } />
								)
							) ) }
						</div>
					)
				) }
			</div>
		</div>
	);
}
