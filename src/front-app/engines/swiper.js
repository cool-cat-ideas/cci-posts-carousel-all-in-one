const swiperEngine = {
	label: 'Swiper',
	supportsReactRenderer: true,
	available() {
		if ( swiperSource() === 'global' ) {
			return Boolean( globalSwiper() );
		}

		return true;
	},
	mount( context ) {
		return loadSwiper().then( ( { Swiper, modules } ) => {
			if ( ! context.root ) {
				return null;
			}

			const options = context.options || {};
			const previousDirection = context.root.getAttribute( 'dir' );
			const {
				Autoplay,
				EffectCards,
				EffectCoverflow,
				EffectCreative,
				EffectCube,
				EffectFade,
				EffectFlip,
				FreeMode,
				Keyboard,
				Mousewheel,
				Navigation,
				Pagination,
			} = modules;
			const effect = swiperEffect( options );
			const effectModule =
				{
					cards: EffectCards,
					coverflow: EffectCoverflow,
					creative: EffectCreative,
					cube: EffectCube,
					fade: EffectFade,
					flip: EffectFlip,
				}[ effect ] || null;
			const singleSlideEffect = swiperUsesSingleSlide( effect );
			const loopEnabled = context.slidesCount > 1 && truthy( options.loop, true );
			const rewindEnabled = ! loopEnabled && context.slidesCount > 1 && truthy( options.rewind, false );
			const hasNavigation = Boolean( truthy( options.nav, true ) && context.prevEl && context.nextEl );

			if ( truthy( options.rtl, false ) ) {
				context.root.setAttribute( 'dir', 'rtl' );
			}

			const instance = new Swiper( context.root, {
				modules: [ Autoplay, effectModule, FreeMode, Keyboard, Mousewheel, Navigation, Pagination ].filter( Boolean ),
				allowTouchMove: truthy( options.touch_drag, true ),
				autoHeight: truthy( options.auto_height, true ),
				autoplay: autoplayOptions( options ),
				breakpoints: singleSlideEffect || truthy( options.auto_width, false ) ? {} : breakpoints( options ),
				cardsEffect: {
					slideShadows: false,
				},
				centeredSlides: truthy( options.center, false ),
				coverflowEffect: {
					depth: 120,
					modifier: 1,
					rotate: 32,
					slideShadows: false,
					stretch: 0,
				},
				creativeEffect: {
					limitProgress: 2,
					next: {
						opacity: 0.55,
						scale: 0.94,
						translate: [ '92%', 0, -120 ],
					},
					prev: {
						opacity: 0.55,
						scale: 0.94,
						translate: [ '-92%', 0, -120 ],
					},
				},
				effect,
				fadeEffect: {
					crossFade: true,
				},
				freeMode: truthy( options.free_drag, false ),
				grabCursor: truthy( options.grab_cursor, false ),
				initialSlide: Math.max( 0, numberOption( options.start_position, 0 ) ),
				direction: swiperDirection( options ),
				keyboard: truthy( options.keyboard, false )
					? {
							enabled: true,
							onlyInViewport: true,
					  }
					: false,
				loop: loopEnabled,
				mousewheel: mousewheelOptions( options ),
				navigation: false,
				observer: true,
				observeParents: true,
				pagination:
					truthy( options.dots, true ) && context.paginationEl
						? {
								clickable: true,
								el: context.paginationEl,
								type: paginationType( options ),
						  }
						: false,
				preventClicks: false,
				preventClicksPropagation: false,
				resistanceRatio: 0.78,
				rewind: rewindEnabled,
				simulateTouch: truthy( options.mouse_drag, true ),
				slidesOffsetAfter: numberOption( options.stage_padding, 0 ),
				slidesOffsetBefore: numberOption( options.stage_padding, 0 ),
				slidesPerGroup: singleSlideEffect ? 1 : Math.max( 1, numberOption( options.slide_by, 1 ) ),
				slidesPerView: singleSlideEffect
					? 1
					: truthy( options.auto_width, false )
						? 'auto'
						: currentItemsForWidth( options ),
				spaceBetween: numberOption( options.margin, 0 ),
				speed: numberOption( options.nav_speed || options.auto_play_speed, 300 ),
				touchRatio: numberOption( options.touch_ratio, 1 ),
				watchOverflow: truthy( options.watch_overflow, true ),
				watchSlidesProgress: effect === 'cards' || effect === 'coverflow' || effect === 'creative',
			} );

			const notifyActiveIndex = () => {
				if ( typeof context.onActiveIndexChange !== 'function' ) {
					return;
				}

				const realIndex = Number.isFinite( instance.realIndex )
					? instance.realIndex
					: instance.activeIndex;

				context.onActiveIndexChange( realIndex );
			};
			const slidePrevious = () => {
				if ( context.prevEl?.getAttribute( 'aria-disabled' ) === 'true' ) {
					return;
				}

				instance.slidePrev();
			};
			const slideNext = () => {
				if ( context.nextEl?.getAttribute( 'aria-disabled' ) === 'true' ) {
					return;
				}

				instance.slideNext();
			};
			let lastPointerNavigationAt = 0;
			const shouldSkipSyntheticClick = () => {
				return Date.now() - lastPointerNavigationAt < 350;
			};
			const managedPreviousPointerUp = ( event ) => {
				event.preventDefault();
				lastPointerNavigationAt = Date.now();
				slidePrevious();
			};
			const managedNextPointerUp = ( event ) => {
				event.preventDefault();
				lastPointerNavigationAt = Date.now();
				slideNext();
			};
			const managedPreviousClick = ( event ) => {
				event.preventDefault();

				if ( shouldSkipSyntheticClick() ) {
					return;
				}

				slidePrevious();
			};
			const managedNextClick = ( event ) => {
				event.preventDefault();

				if ( shouldSkipSyntheticClick() ) {
					return;
				}

				slideNext();
			};
			const setNavigationDisabled = ( element, disabled ) => {
				if ( ! element ) {
					return;
				}

				element.classList.toggle( 'swiper-button-disabled', disabled );
				element.setAttribute( 'aria-disabled', disabled ? 'true' : 'false' );

				if ( 'disabled' in element ) {
					element.disabled = disabled;
				}
			};
			const updateManagedNavigationState = () => {
				if ( ! hasNavigation ) {
					return;
				}

				const locked = Boolean( instance.isLocked );
				const disablePrevious = locked || ( ! loopEnabled && ! rewindEnabled && instance.isBeginning );
				const disableNext = locked || ( ! loopEnabled && ! rewindEnabled && instance.isEnd );

				context.prevEl.classList.toggle( 'swiper-button-lock', locked );
				context.nextEl.classList.toggle( 'swiper-button-lock', locked );
				setNavigationDisabled( context.prevEl, disablePrevious );
				setNavigationDisabled( context.nextEl, disableNext );
			};
			const navigationStateEvents = [
				'breakpoint',
				'fromEdge',
				'lock',
				'observerUpdate',
				'reachBeginning',
				'reachEnd',
				'resize',
				'slideChange',
				'unlock',
			];

			if ( hasNavigation ) {
				context.prevEl?.addEventListener( 'pointerup', managedPreviousPointerUp );
				context.nextEl?.addEventListener( 'pointerup', managedNextPointerUp );
				context.prevEl?.addEventListener( 'click', managedPreviousClick );
				context.nextEl?.addEventListener( 'click', managedNextClick );
				navigationStateEvents.forEach( ( eventName ) => {
					instance.on( eventName, updateManagedNavigationState );
				} );
				updateManagedNavigationState();
			}

			if ( typeof context.onReady === 'function' ) {
				context.onReady( instance );
			}

			instance.on( 'slideChange', notifyActiveIndex );
			notifyActiveIndex();

			return () => {
				if ( hasNavigation ) {
					context.prevEl?.removeEventListener( 'pointerup', managedPreviousPointerUp );
					context.nextEl?.removeEventListener( 'pointerup', managedNextPointerUp );
					context.prevEl?.removeEventListener( 'click', managedPreviousClick );
					context.nextEl?.removeEventListener( 'click', managedNextClick );
					navigationStateEvents.forEach( ( eventName ) => {
						instance.off( eventName, updateManagedNavigationState );
					} );
				}

				instance.off( 'slideChange', notifyActiveIndex );
				instance.destroy( true, true );
				if ( typeof context.onReady === 'function' ) {
					context.onReady( null );
				}

				if ( previousDirection === null ) {
					context.root.removeAttribute( 'dir' );
				} else {
					context.root.setAttribute( 'dir', previousDirection );
				}
			};
		} );
	},
};

function runtimeConfig() {
	return window.wpPostsCarouselRuntimeConfig || {};
}

function swiperSource() {
	return runtimeConfig()?.assets?.swiperSource === 'global' ? 'global' : 'bundled';
}

function shouldLoadSwiperCss() {
	return runtimeConfig()?.assets?.loadSwiperCss !== false;
}

function globalSwiper() {
	return window.Swiper?.default || window.Swiper || null;
}

function globalSwiperModules() {
	return window.SwiperModules || window.Swiper?.modules || {};
}

function loadSwiper() {
	if ( swiperSource() === 'global' ) {
		const Swiper = globalSwiper();

		if ( ! Swiper ) {
			return Promise.reject(
				new Error( 'WP Posts Carousel expected window.Swiper but it is not available.' )
			);
		}

		return Promise.resolve( {
			Swiper,
			modules: globalSwiperModules(),
		} );
	}

	const imports = [
		import( 'swiper' ),
		import( 'swiper/modules' ),
	];

	if ( shouldLoadSwiperCss() ) {
		imports.push(
			import( 'swiper/css' ),
			import( 'swiper/css/effect-cards' ),
			import( 'swiper/css/effect-coverflow' ),
			import( 'swiper/css/effect-creative' ),
			import( 'swiper/css/effect-cube' ),
			import( 'swiper/css/effect-fade' ),
			import( 'swiper/css/effect-flip' ),
			import( 'swiper/css/navigation' ),
			import( 'swiper/css/pagination' )
		);
	}

	return Promise.all( imports ).then( ( [ swiperPackage, modules ] ) => ( {
		Swiper: swiperPackage.default,
		modules,
	} ) );
}

function truthy( value, fallback = true ) {
	if ( value === undefined || value === null || value === '' ) {
		return fallback;
	}

	return value === true || value === 'true' || value === 1 || value === '1';
}

function numberOption( value, fallback ) {
	const number = Number( value );

	return Number.isFinite( number ) ? number : fallback;
}

function swiperEffect( options ) {
	const effect = String( options.transition_effect || options.effect || 'slide' )
		.toLowerCase()
		.replace( /[^a-z-]/g, '' );
	const allowed = [ 'slide', 'fade', 'cube', 'coverflow', 'flip', 'cards', 'creative' ];

	return allowed.includes( effect ) ? effect : 'slide';
}

function swiperDirection( options ) {
	return String( options.direction || 'horizontal' ) === 'vertical' ? 'vertical' : 'horizontal';
}

function paginationType( options ) {
	const type = String( options.pagination_type || 'bullets' )
		.toLowerCase()
		.replace( /[^a-z]/g, '' );
	const allowed = [ 'bullets', 'fraction', 'progressbar' ];

	return allowed.includes( type ) ? type : 'bullets';
}

function mousewheelOptions( options ) {
	if ( ! truthy( options.mouse_wheel, false ) ) {
		return false;
	}

	return {
		forceToAxis: truthy( options.mousewheel_force_to_axis, false ),
		releaseOnEdges: truthy( options.mousewheel_release_on_edges, false ),
		sensitivity: Math.max( 0.1, numberOption( options.mousewheel_sensitivity, 1 ) ),
	};
}

function swiperUsesSingleSlide( effect ) {
	return [ 'fade', 'cube', 'flip', 'cards', 'creative' ].includes( effect );
}

function autoplayOptions( options ) {
	if ( ! truthy( options.auto_play, true ) || prefersReducedMotion() ) {
		return false;
	}

	return {
		delay: Math.max( 500, numberOption( options.auto_play_timeout, 1200 ) ),
		disableOnInteraction: false,
		pauseOnMouseEnter: truthy( options.stop_on_hover, true ),
	};
}

function prefersReducedMotion() {
	return Boolean(
		window.matchMedia &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
	);
}

function normalizeItemsValue( value ) {
	if ( value && typeof value === 'object' ) {
		return Number( value.items || value.value || 1 );
	}

	return Number( value || 1 );
}

function currentItemsForWidth( options ) {
	const source = options.items_to_show || options.breakpoints || {};

	if ( ! source || typeof source !== 'object' ) {
		return Math.max( 1, normalizeItemsValue( options.items || 1 ) );
	}

	const width =
		typeof window !== 'undefined' && Number.isFinite( window.innerWidth )
			? window.innerWidth
			: 1024;
	const breakpointsList = Object.keys( source )
		.map( ( key ) => Number( key ) )
		.filter( ( key ) => Number.isFinite( key ) )
		.sort( ( a, b ) => a - b );

	if ( ! breakpointsList.length ) {
		return Math.max( 1, normalizeItemsValue( options.items || 1 ) );
	}

	const matched = breakpointsList.reduce(
		( result, breakpoint ) => ( width >= breakpoint ? breakpoint : result ),
		breakpointsList[ 0 ]
	);

	return Math.max( 1, normalizeItemsValue( source[ matched ] ) );
}

function breakpoints( options ) {
	const source = options.items_to_show || options.breakpoints || {};

	if ( ! source || typeof source !== 'object' ) {
		return {};
	}

	return Object.keys( source ).reduce( ( result, width ) => {
		const parsedWidth = Number( width );
		const items = normalizeItemsValue( source[ width ] );

		if ( Number.isFinite( parsedWidth ) && items > 0 ) {
			result[ parsedWidth ] = {
				slidesPerView: items,
			};
		}

		return result;
	}, {} );
}

export default swiperEngine;
