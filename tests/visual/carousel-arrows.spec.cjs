const fs = require('fs');
const path = require('path');
const { test, expect } = require('playwright/test');

const rootDir = path.resolve(__dirname, '..', '..');
const screenshotDir = path.join(rootDir, 'dist', 'playwright-screenshots');

test.setTimeout(60_000);

const templates = [
	{
		name: 'default',
		css: 'templates/default/assets/css/style.css',
		rootClass: 'cci-wpc-default-template-theme',
		prevIconClass: 'fa-angle-left',
		nextIconClass: 'fa-angle-right',
		navSize: 40,
		activeDotColor: 'rgb(37, 99, 235)',
		inactiveDotColor: 'rgb(203, 213, 225)',
		dotControlHeight: 18,
		dotControlWidth: 18,
		dotVisualHeight: 8,
		dotVisualWidth: 8,
		hiddenOnMobile: true,
	},
	{
		name: 'light',
		css: 'templates/light/assets/css/style.css',
		rootClass: 'cci-wpc-light-template-theme',
		prevIconClass: 'fa-angle-left',
		nextIconClass: 'fa-angle-right',
		navSize: 38,
		activeDotColor: 'rgb(17, 24, 39)',
		inactiveDotColor: 'rgb(203, 213, 225)',
		dotControlHeight: 18,
		dotControlWidth: 24,
		dotVisualHeight: 8,
		dotVisualWidth: 8,
		hiddenOnMobile: true,
	},
	{
		name: 'simple',
		css: 'templates/simple/assets/css/style.css',
		rootClass: 'cci-wpc-simple-template-theme',
		prevIconClass: 'fa-angle-left',
		nextIconClass: 'fa-angle-right',
		navSize: 36,
		activeDotColor: 'rgb(17, 24, 39)',
		inactiveDotColor: 'rgb(203, 213, 225)',
		dotControlHeight: 18,
		dotControlWidth: 18,
		dotVisualHeight: 8,
		dotVisualWidth: 8,
		hiddenOnMobile: true,
	},
	{
		name: 'vertical-product-rail',
		css: 'templates/vertical-product-rail/assets/css/style.css',
		rootClass: 'cci-wpc-vertical-product-rail-template-theme',
		prevIconClass: 'fa-angle-up',
		nextIconClass: 'fa-angle-down',
		navSize: 38,
		activeDotColor: 'rgb(37, 99, 235)',
		inactiveDotColor: 'rgb(203, 213, 225)',
		controlGap: 8,
		dotCount: 5,
		dotControlHeight: 18,
		dotControlWidth: 18,
		dotVisualHeight: 8,
		dotVisualWidth: 8,
		hiddenOnMobile: false,
	},
];

function readCss(relativePath) {
	return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function fixtureHtml() {
	const css = [
		readCss('src/shared/carousel-renderer.css'),
		...templates.map((template) => readCss(template.css)),
	].join('\n\n');

	const sections = templates.map((template) => {
		const verticalClass = template.name === 'vertical-product-rail' ? ' cci-wpc-template-vertical-product-rail cci-wpc-vertical-product-rail-template-theme' : '';
		const reactTemplateClass = `cci-wpc-template-${template.name}${verticalClass}`;
		const dotCount = template.dotCount || 3;
		const dotsBlock = (dotCount * template.dotControlHeight) + (Math.max(0, dotCount - 1) * 8);
		const verticalStyle = template.name === 'vertical-product-rail'
			? ` style="--wpc-vr-dots-block: ${dotsBlock}px; --wpc-vr-dots-count: ${dotCount}; --wpc-vr-dots-half: ${dotsBlock / 2}px;"`
			: '';
		const owlDots = Array.from({ length: dotCount }, (_, index) => `
						<button type="button" class="owl-dot${index === 0 ? ' active' : ''}"><span>${index + 1}</span></button>`).join('');
		const owlTextDots = Array.from({ length: dotCount }, (_, index) => `
						<button type="button" class="owl-dot${index === 0 ? ' active' : ''}"><span></span></button>`).join('');
		const reactDots = Array.from({ length: dotCount }, (_, index) => `
								<button type="button"${index === 0 ? ' class="cci-wpc-active"' : ''}>${index + 1}</button>`).join('');
		const staticDots = Array.from({ length: dotCount }, (_, index) => `
								<span>${index + 1}</span>`).join('');
		const swiperDots = Array.from({ length: dotCount }, (_, index) => `
								<span class="swiper-pagination-bullet${index === 0 ? ' swiper-pagination-bullet-active' : ''}">${index + 1}</span>`).join('');

		return `
			<section class="cci-wpc-fixture-section" data-template-section="${template.name}">
				<h2>${template.name}</h2>

				<div data-template="${template.name}" data-variant="owl" class="cci-wpc-fixture-carousel ${template.rootClass} cci-wpc-carousel owl-carousel"${verticalStyle}>
					<div class="owl-stage-outer">
						<div class="owl-stage">
							<div class="owl-item">
								<article class="cci-wpc-slide">
									<div class="cci-wpc-container">
										<div class="cci-wpc-details">
											<h3 class="cci-wpc-title">Fixture slide</h3>
										</div>
									</div>
								</article>
							</div>
						</div>
					</div>
					<div class="owl-nav">
						<div class="owl-prev"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'up' : 'left'}" aria-hidden="true"></i><span class="screen-reader-text">previous</span></div>
						<div class="owl-next"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'down' : 'right'}" aria-hidden="true"></i><span class="screen-reader-text">next</span></div>
					</div>
					<div class="owl-dots">
${owlDots}
					</div>
				</div>

				<div data-template="${template.name}" data-variant="owl-text" class="cci-wpc-fixture-carousel ${template.rootClass} cci-wpc-carousel owl-carousel"${verticalStyle}>
					<div class="owl-stage-outer">
						<div class="owl-stage">
							<div class="owl-item">
								<article class="cci-wpc-slide">
									<div class="cci-wpc-container">
										<div class="cci-wpc-details">
											<h3 class="cci-wpc-title">Fixture slide</h3>
										</div>
									</div>
								</article>
							</div>
						</div>
					</div>
					<div class="owl-nav">
						<div class="owl-prev"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'up' : 'left'}" aria-hidden="true"></i><span class="screen-reader-text">previous</span></div>
						<div class="owl-next"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'down' : 'right'}" aria-hidden="true"></i><span class="screen-reader-text">next</span></div>
					</div>
					<div class="owl-dots">
${owlTextDots}
					</div>
				</div>

				<div data-template="${template.name}" data-variant="react" class="${template.rootClass}">
					<div class="cci-wpc-fixture-carousel cci-wpc-render-preview cci-wpc-carousel cci-wpc-engine-fallback ${reactTemplateClass}"${verticalStyle}>
						<div class="cci-wpc-render-preview-viewport">
							<div class="cci-wpc-render-preview-track">
								<article class="cci-wpc-card cci-wpc-card-react cci-wpc-render-preview-slide">
									<div class="cci-wpc-card-body cci-wpc-render-preview-body">
										<strong class="cci-wpc-card-title">Fixture slide</strong>
									</div>
								</article>
							</div>
						</div>
						<div class="cci-wpc-render-preview-chrome">
							<div class="cci-wpc-render-preview-nav">
								<button type="button" aria-label="previous"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'up' : 'left'}" aria-hidden="true"></i></button>
								<button type="button" aria-label="next"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'down' : 'right'}" aria-hidden="true"></i></button>
							</div>
							<div class="cci-wpc-render-preview-dots">
${reactDots}
							</div>
						</div>
					</div>
				</div>

				<div data-template="${template.name}" data-variant="static" class="${template.rootClass}">
					<div class="cci-wpc-fixture-carousel cci-wpc-render-preview cci-wpc-carousel cci-wpc-engine-fallback ${reactTemplateClass}"${verticalStyle}>
						<div class="cci-wpc-render-preview-viewport">
							<div class="cci-wpc-render-preview-track">
								<article class="cci-wpc-card cci-wpc-card-react cci-wpc-render-preview-slide">
									<div class="cci-wpc-card-body cci-wpc-render-preview-body">
										<strong class="cci-wpc-card-title">Static fixture</strong>
									</div>
								</article>
							</div>
						</div>
						<div class="cci-wpc-render-preview-chrome">
							<div class="cci-wpc-render-preview-nav">
								<span><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'up' : 'left'}" aria-hidden="true"></i></span>
								<span><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'down' : 'right'}" aria-hidden="true"></i></span>
							</div>
							<div class="cci-wpc-render-preview-dots">
${staticDots}
							</div>
						</div>
					</div>
				</div>

				<div data-template="${template.name}" data-variant="swiper" class="${template.rootClass}">
					<div class="cci-wpc-fixture-carousel cci-wpc-render-preview cci-wpc-carousel cci-wpc-engine-swiper ${reactTemplateClass}"${verticalStyle}>
						<div class="cci-wpc-render-preview-viewport">
							<div class="cci-wpc-render-preview-track">
								<article class="cci-wpc-card cci-wpc-card-react cci-wpc-render-preview-slide">
									<div class="cci-wpc-card-body cci-wpc-render-preview-body">
										<strong class="cci-wpc-card-title">Swiper fixture</strong>
									</div>
								</article>
							</div>
						</div>
						<div class="cci-wpc-render-preview-chrome">
							<div class="cci-wpc-render-preview-nav">
								<button type="button" aria-label="previous"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'up' : 'left'}" aria-hidden="true"></i></button>
								<button type="button" aria-label="next"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'down' : 'right'}" aria-hidden="true"></i></button>
							</div>
							<div class="cci-wpc-render-preview-dots swiper-pagination">
${swiperDots}
							</div>
						</div>
					</div>
				</div>

				<div data-template="${template.name}" data-variant="swiper-fraction" class="${template.rootClass}">
					<div class="cci-wpc-fixture-carousel cci-wpc-render-preview cci-wpc-carousel cci-wpc-engine-swiper ${reactTemplateClass}"${verticalStyle}>
						<div class="cci-wpc-render-preview-viewport">
							<div class="cci-wpc-render-preview-track">
								<article class="cci-wpc-card cci-wpc-card-react cci-wpc-render-preview-slide">
									<div class="cci-wpc-card-body cci-wpc-render-preview-body">
										<strong class="cci-wpc-card-title">Fraction fixture</strong>
									</div>
								</article>
							</div>
						</div>
						<div class="cci-wpc-render-preview-chrome">
							<div class="cci-wpc-render-preview-nav">
								<button type="button" aria-label="previous"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'up' : 'left'}" aria-hidden="true"></i></button>
								<button type="button" aria-label="next"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'down' : 'right'}" aria-hidden="true"></i></button>
							</div>
							<div class="cci-wpc-render-preview-dots swiper-pagination swiper-pagination-fraction">
								<span class="swiper-pagination-current">1</span>
								/
								<span class="swiper-pagination-total">${dotCount}</span>
							</div>
						</div>
					</div>
				</div>

				<div data-template="${template.name}" data-variant="swiper-progressbar" class="${template.rootClass}">
					<div class="cci-wpc-fixture-carousel cci-wpc-render-preview cci-wpc-carousel cci-wpc-engine-swiper ${reactTemplateClass}"${verticalStyle}>
						<div class="cci-wpc-render-preview-viewport">
							<div class="cci-wpc-render-preview-track">
								<article class="cci-wpc-card cci-wpc-card-react cci-wpc-render-preview-slide">
									<div class="cci-wpc-card-body cci-wpc-render-preview-body">
										<strong class="cci-wpc-card-title">Progress fixture</strong>
									</div>
								</article>
							</div>
						</div>
						<div class="cci-wpc-render-preview-chrome">
							<div class="cci-wpc-render-preview-nav">
								<button type="button" aria-label="previous"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'up' : 'left'}" aria-hidden="true"></i></button>
								<button type="button" aria-label="next"><i class="fa fa-angle-${template.name === 'vertical-product-rail' ? 'down' : 'right'}" aria-hidden="true"></i></button>
							</div>
							<div class="cci-wpc-render-preview-dots swiper-pagination swiper-pagination-progressbar${template.name === 'vertical-product-rail' ? ' swiper-pagination-vertical' : ' swiper-pagination-horizontal'}">
								<span class="swiper-pagination-progressbar-fill"></span>
							</div>
						</div>
					</div>
				</div>
			</section>
		`;
	}).join('\n');

	return `<!doctype html>
		<html>
			<head>
				<meta charset="utf-8">
				<style>
					${css}

					body {
						background: #f3f4f6;
						color: #111827;
						font-family: Arial, sans-serif;
						margin: 0;
						padding: 24px;
					}

					.cci-wpc-fixture-section {
						margin: 0 0 36px;
					}

					.cci-wpc-fixture-section h2 {
						font-size: 14px;
						margin: 0 0 10px;
					}

					.cci-wpc-fixture-carousel {
						background: #fff;
						margin-bottom: 16px;
						min-height: 220px;
						position: relative;
					}

					.screen-reader-text {
						clip: rect(1px, 1px, 1px, 1px);
						clip-path: inset(50%);
						height: 1px;
						margin: -1px;
						overflow: hidden;
						padding: 0;
						position: absolute;
						width: 1px;
						word-wrap: normal;
					}

					[data-template="vertical-product-rail"].cci-wpc-fixture-carousel,
					[data-template="vertical-product-rail"] .cci-wpc-fixture-carousel {
						min-height: 640px;
					}
				</style>
			</head>
			<body>${sections}</body>
		</html>`;
}

async function navButtonInfo(page, selector) {
	return page.locator(selector).evaluate((element) => {
		const style = window.getComputedStyle(element);
		const before = window.getComputedStyle(element, '::before');
		const rect = element.getBoundingClientRect();
		const childSpan = element.querySelector('span');
		const icon = element.querySelector('i.fa');

		return {
			beforeContent: before.content,
			display: style.display,
			fontSize: style.fontSize,
			height: rect.height,
			iconClasses: icon ? Array.from(icon.classList) : [],
			iconDisplay: icon ? window.getComputedStyle(icon).display : null,
			iconFontSize: icon ? window.getComputedStyle(icon).fontSize : null,
			lineHeight: style.lineHeight,
			overflow: style.overflow,
			rect: {
				bottom: rect.bottom,
				left: rect.left,
				right: rect.right,
				top: rect.top,
			},
			spanDisplay: childSpan ? window.getComputedStyle(childSpan).display : null,
			textIndent: style.textIndent,
			width: rect.width,
		};
	});
}

async function expectArrowButton(page, selector, expectedIconClass, options = {}) {
	const info = await navButtonInfo(page, selector);

	expect(info.display).not.toBe('none');
	expect(info.beforeContent).toBe('none');
	expect(parseFloat(info.fontSize)).toBeGreaterThanOrEqual(12);
	expect(info.lineHeight).not.toBe('0px');
	expect(info.overflow).toBe('hidden');
	expect(Math.round(info.width)).toBe(options.size);
	expect(Math.round(info.height)).toBe(options.size);
	expect(info.iconClasses).toContain('fa');
	expect(info.iconClasses).toContain(expectedIconClass);
	expect(info.iconDisplay).not.toBe('none');
	expect(parseFloat(info.iconFontSize)).toBeGreaterThanOrEqual(14);

	if (options.hasChildSpan) {
		expect(['none', 'block', 'inline']).toContain(info.spanDisplay);
	}
}

async function placementInfo(page, selector) {
	return page.locator(selector).evaluate((element) => {
		const rect = element.getBoundingClientRect();
		const carousel = element.closest('.cci-wpc-fixture-carousel');
		const carouselRect = carousel ? carousel.getBoundingClientRect() : null;

		return {
			rect: {
				bottom: rect.bottom,
				height: rect.height,
				left: rect.left,
				right: rect.right,
				top: rect.top,
				width: rect.width,
			},
			carouselRect: carouselRect
				? {
					bottom: carouselRect.bottom,
					height: carouselRect.height,
					left: carouselRect.left,
					right: carouselRect.right,
					top: carouselRect.top,
					width: carouselRect.width,
				}
				: null,
		};
	});
}

async function expectInsideCarousel(page, selector, options = {}) {
	const info = await placementInfo(page, selector);
	const bleed = options.bleed === undefined ? 1 : options.bleed;

	expect(info.carouselRect).not.toBeNull();
	expect(info.rect.left).toBeGreaterThanOrEqual(info.carouselRect.left - bleed);
	expect(info.rect.right).toBeLessThanOrEqual(info.carouselRect.right + bleed);
	expect(info.rect.top).toBeGreaterThanOrEqual(info.carouselRect.top - bleed);
	expect(info.rect.bottom).toBeLessThanOrEqual(info.carouselRect.bottom + bleed);
}

function boxesIntersect(first, second) {
	return !(
		first.right <= second.left ||
		first.left >= second.right ||
		first.bottom <= second.top ||
		first.top >= second.bottom
	);
}

async function expectNoOverlap(page, firstSelector, secondSelector) {
	const first = await placementInfo(page, firstSelector);
	const second = await placementInfo(page, secondSelector);

	expect(boxesIntersect(first.rect, second.rect)).toBe(false);
}

async function dotInfo(page, selector) {
	return page.locator(selector).evaluate((element) => {
		const style = window.getComputedStyle(element);
		const before = window.getComputedStyle(element, '::before');
		const rect = element.getBoundingClientRect();
		const childSpan = element.querySelector(':scope > span');
		const childStyle = childSpan ? window.getComputedStyle(childSpan) : null;
		const childRect = childSpan ? childSpan.getBoundingClientRect() : null;

		return {
			backgroundColor: style.backgroundColor,
			beforeBackgroundColor: before.backgroundColor,
			beforeContent: before.content,
			beforeHeight: before.height,
			beforeWidth: before.width,
			childBackgroundColor: childStyle ? childStyle.backgroundColor : null,
			childDisplay: childStyle ? childStyle.display : null,
			childFontSize: childStyle ? childStyle.fontSize : null,
			childHeight: childRect ? childRect.height : null,
			childWidth: childRect ? childRect.width : null,
			display: style.display,
			fontSize: style.fontSize,
			height: rect.height,
			lineHeight: style.lineHeight,
			opacity: style.opacity,
			overflow: style.overflow,
			textIndent: style.textIndent,
			width: rect.width,
		};
	});
}

async function expectDotControl(page, selector, template, options = {}) {
	const info = await dotInfo(page, selector);
	const expectedColor = options.active ? template.activeDotColor : template.inactiveDotColor;
	const expectedControlHeight = template.dotControlHeight;
	const expectedControlWidth = template.dotControlWidth;
	const expectedVisualHeight = template.dotVisualHeight;
	const expectedVisualWidth = template.dotVisualWidth;

	expect(info.display).not.toBe('none');
	expect(info.backgroundColor).toBe('rgba(0, 0, 0, 0)');
	expect(info.fontSize).toBe('0px');
	expect(info.lineHeight).toBe('0px');
	expect(info.opacity).toBe('1');
	expect(info.overflow).toBe('hidden');
	expect(Math.round(info.width)).toBe(expectedControlWidth);
	expect(Math.round(info.height)).toBe(expectedControlHeight);

	if (options.hasChildSpan) {
		expect(info.childDisplay).toBe('block');
		expect(info.childFontSize).toBe('0px');
		expect(Math.round(info.childWidth)).toBe(expectedVisualWidth);
		expect(Math.round(info.childHeight)).toBe(expectedVisualHeight);
		expect(info.childBackgroundColor).toBe(expectedColor);
		return;
	}

	expect(info.beforeContent).toBe('""');
	expect(parseFloat(info.beforeWidth)).toBe(expectedVisualWidth);
	expect(parseFloat(info.beforeHeight)).toBe(expectedVisualHeight);
	expect(info.beforeBackgroundColor).toBe(expectedColor);
}

async function expectTemplateDots(page, template) {
	await expectDotSequence(
		page,
		template,
		'owl',
		'.owl-dot',
		{ hasChildSpan: true }
	);
	await expectDotSequence(
		page,
		template,
		'owl-text',
		'.owl-dot',
		{ hasChildSpan: true }
	);
	await expectDotSequence(
		page,
		template,
		'react',
		'.cci-wpc-render-preview-dots button'
	);
	await expectDotSequence(
		page,
		template,
		'static',
		'.cci-wpc-render-preview-dots > span'
	);
	await expectDotSequence(
		page,
		template,
		'swiper',
		'.swiper-pagination-bullet'
	);
}

async function paginationTextInfo(page, selector) {
	return page.locator(selector).evaluate((element) => {
		const style = window.getComputedStyle(element);
		const before = window.getComputedStyle(element, '::before');
		const rect = element.getBoundingClientRect();

		return {
			beforeContent: before.content,
			display: style.display,
			fontSize: style.fontSize,
			height: rect.height,
			lineHeight: style.lineHeight,
			overflow: style.overflow,
			text: element.textContent,
			textIndent: style.textIndent,
			width: rect.width,
		};
	});
}

async function progressbarInfo(page, selector) {
	return page.locator(selector).evaluate((element) => {
		const style = window.getComputedStyle(element);
		const rect = element.getBoundingClientRect();
		const fill = element.querySelector('.swiper-pagination-progressbar-fill');
		const fillStyle = fill ? window.getComputedStyle(fill) : null;
		const fillBefore = fill ? window.getComputedStyle(fill, '::before') : null;
		const fillRect = fill ? fill.getBoundingClientRect() : null;

		return {
			backgroundColor: style.backgroundColor,
			display: style.display,
			height: rect.height,
			overflow: style.overflow,
			width: rect.width,
			fillBeforeContent: fillBefore ? fillBefore.content : null,
			fillDisplay: fillStyle ? fillStyle.display : null,
			fillHeight: fillRect ? fillRect.height : null,
			fillWidth: fillRect ? fillRect.width : null,
		};
	});
}

async function expectTemplateSwiperPagination(page, template) {
	await expectSwiperFraction(page, template);
	await expectSwiperProgressbar(page, template);
}

async function expectSwiperFraction(page, template) {
	const rootSelector = `[data-template="${template.name}"][data-variant="swiper-fraction"]`;
	const currentSelector = `${rootSelector} .swiper-pagination-current`;
	const totalSelector = `${rootSelector} .swiper-pagination-total`;
	const expectedTotal = String(template.dotCount || 3);

	await expectInsideCarousel(page, `${rootSelector} .cci-wpc-render-preview-dots`);

	for (const selector of [currentSelector, totalSelector]) {
		const info = await paginationTextInfo(page, selector);

		expect(info.display).not.toBe('none');
		expect(parseFloat(info.fontSize)).toBeGreaterThan(0);
		expect(info.lineHeight).not.toBe('0px');
		expect(info.overflow).toBe('visible');
		expect(info.textIndent).toBe('0px');
		expect(info.beforeContent).toBe('none');
		expect(Math.round(info.width)).toBeLessThan(template.dotControlWidth);
		expect(Math.round(info.height)).toBeLessThanOrEqual(template.dotControlHeight);
	}

	await expect(page.locator(currentSelector)).toHaveText('1');
	await expect(page.locator(totalSelector)).toHaveText(expectedTotal);
}

async function expectSwiperProgressbar(page, template) {
	const rootSelector = `[data-template="${template.name}"][data-variant="swiper-progressbar"]`;
	const progressbarSelector = `${rootSelector} .swiper-pagination-progressbar`;
	const info = await progressbarInfo(page, progressbarSelector);

	await expectInsideCarousel(page, progressbarSelector);
	expect(info.display).toBe('block');
	expect(info.backgroundColor).toBe(template.inactiveDotColor);
	expect(info.overflow).toBe('hidden');
	expect(info.fillBeforeContent).toBe('none');
	expect(info.fillDisplay).toBe('block');

	if (template.name === 'vertical-product-rail') {
		expect(Math.round(info.width)).toBe(4);
		expect(Math.round(info.height)).toBe(120);
		expect(Math.round(info.fillWidth)).toBe(4);
		expect(Math.round(info.fillHeight)).toBe(120);
		return;
	}

	expect(Math.round(info.width)).toBe(180);
	expect(Math.round(info.height)).toBe(4);
	expect(Math.round(info.fillWidth)).toBe(180);
	expect(Math.round(info.fillHeight)).toBe(4);
}

async function expectDotSequence(page, template, variant, itemSelector, options = {}) {
	const rootSelector = `[data-template="${template.name}"][data-variant="${variant}"]`;
	const dotSelector = `${rootSelector} ${itemSelector}`;
	const dots = page.locator(dotSelector);
	const expectedCount = template.dotCount || 3;

	await expect(dots).toHaveCount(expectedCount);

	for (let index = 1; index <= expectedCount; index += 1) {
		await expectDotControl(
			page,
			`${dotSelector}:nth-child(${index})`,
			template,
			{
				active: index === 1,
				hasChildSpan: options.hasChildSpan,
			}
		);
		await expectInsideCarousel(page, `${dotSelector}:nth-child(${index})`);
	}

	await expectDotLayout(page, dotSelector, template);
}

async function expectDotLayout(page, dotSelector, template) {
	const boxes = await page.locator(dotSelector).evaluateAll((elements) => elements.map((element) => {
		const rect = element.getBoundingClientRect();

		return {
			left: rect.left,
			top: rect.top,
		};
	}));

	if (template.name === 'vertical-product-rail') {
		for (let index = 1; index < boxes.length; index += 1) {
			expect(Math.abs(boxes[0].left - boxes[index].left)).toBeLessThanOrEqual(1);
			expect(boxes[index].top).toBeGreaterThan(boxes[index - 1].top);
		}
		return;
	}

	for (let index = 1; index < boxes.length; index += 1) {
		expect(Math.abs(boxes[0].top - boxes[index].top)).toBeLessThanOrEqual(1);
		expect(boxes[index].left).toBeGreaterThan(boxes[index - 1].left);
	}
}

async function expectTemplateControlPlacement(page, template, variant) {
	const rootSelector = `[data-template="${template.name}"][data-variant="${variant}"]`;
	const isOwlVariant = variant === 'owl' || variant === 'owl-text';
	const dotsSelector = isOwlVariant
		? `${rootSelector} .owl-dots`
		: `${rootSelector} .cci-wpc-render-preview-dots`;
	const prevSelector = isOwlVariant
		? `${rootSelector} .owl-prev`
		: variant === 'static'
			? `${rootSelector} .cci-wpc-render-preview-nav span:first-child`
			: `${rootSelector} .cci-wpc-render-preview-nav button:first-child`;
	const nextSelector = isOwlVariant
		? `${rootSelector} .owl-next`
		: variant === 'static'
			? `${rootSelector} .cci-wpc-render-preview-nav span:last-child`
			: `${rootSelector} .cci-wpc-render-preview-nav button:last-child`;

	const arrowBleed = template.name === 'vertical-product-rail' ? 1 : (template.navSize / 2) + 1;

	await expectInsideCarousel(page, prevSelector, { bleed: arrowBleed });
	await expectInsideCarousel(page, nextSelector, { bleed: arrowBleed });
	await expectInsideCarousel(page, dotsSelector);
	await expectNoOverlap(page, prevSelector, dotsSelector);
	await expectNoOverlap(page, nextSelector, dotsSelector);

	const placement = await page.locator(rootSelector).evaluate((root, selectors) => {
		const rectFor = (element) => {
			const rect = element.getBoundingClientRect();

			return {
				bottom: rect.bottom,
				height: rect.height,
				left: rect.left,
				right: rect.right,
				top: rect.top,
				width: rect.width,
			};
		};
		const centerX = (rect) => rect.left + rect.width / 2;
		const centerY = (rect) => rect.top + rect.height / 2;
		const carousel = root.matches('.cci-wpc-fixture-carousel') ? root : root.querySelector('.cci-wpc-fixture-carousel');
		const viewport = root.querySelector('.owl-stage-outer, .cci-wpc-render-preview-viewport');
		const prev = document.querySelector(selectors.prevSelector);
		const next = document.querySelector(selectors.nextSelector);
		const dots = document.querySelector(selectors.dotsSelector);
		const carouselRect = rectFor(carousel);
		const viewportRect = rectFor(viewport);
		const prevRect = rectFor(prev);
		const nextRect = rectFor(next);
		const dotsRect = rectFor(dots);

		return {
			carouselBottomToDotsBottom: carouselRect.bottom - dotsRect.bottom,
			carouselCenterXToDotsCenterX: centerX(carouselRect) - centerX(dotsRect),
			dotsBottom: dotsRect.bottom,
			dotsCenterX: centerX(dotsRect),
			dotsTop: dotsRect.top,
			nextCenterX: centerX(nextRect),
			nextCenterY: centerY(nextRect),
			nextTop: nextRect.top,
			prevBottom: prevRect.bottom,
			prevCenterX: centerX(prevRect),
			prevCenterY: centerY(prevRect),
			viewportLeft: viewportRect.left,
			viewportRight: viewportRect.right,
			viewportCenterY: centerY(viewportRect),
		};
	}, { dotsSelector, nextSelector, prevSelector });

	if (template.name === 'vertical-product-rail') {
		const expectedGap = template.controlGap || 8;

		expect(Math.abs(placement.prevCenterX - placement.dotsCenterX), `${template.name}/${variant} previous arrow x`).toBeLessThanOrEqual(1);
		expect(Math.abs(placement.nextCenterX - placement.dotsCenterX), `${template.name}/${variant} next arrow x`).toBeLessThanOrEqual(1);
		expect(Math.abs((placement.dotsTop - placement.prevBottom) - expectedGap), `${template.name}/${variant} previous arrow gap`).toBeLessThanOrEqual(1);
		expect(Math.abs((placement.nextTop - placement.dotsBottom) - expectedGap), `${template.name}/${variant} next arrow gap`).toBeLessThanOrEqual(1);
		return;
	}

	expect(Math.abs(placement.prevCenterY - placement.viewportCenterY), `${template.name}/${variant} previous arrow y`).toBeLessThanOrEqual(1);
	expect(Math.abs(placement.nextCenterY - placement.viewportCenterY), `${template.name}/${variant} next arrow y`).toBeLessThanOrEqual(1);
	expect(Math.abs(placement.prevCenterX - placement.viewportLeft), `${template.name}/${variant} previous arrow x`).toBeLessThanOrEqual(1);
	expect(Math.abs(placement.nextCenterX - placement.viewportRight), `${template.name}/${variant} next arrow x`).toBeLessThanOrEqual(1);
	expect(Math.abs(placement.carouselCenterXToDotsCenterX), `${template.name}/${variant} dots x`).toBeLessThanOrEqual(1);
	expect(Math.abs(placement.carouselBottomToDotsBottom), `${template.name}/${variant} dots bottom`).toBeLessThanOrEqual(1);
}

async function expectTemplateArrows(page, template, variant) {
	const rootSelector = `[data-template="${template.name}"][data-variant="${variant}"]`;
	const isOwlVariant = variant === 'owl' || variant === 'owl-text';
	const usesStaticSpans = variant === 'static';
	const prevSelector = isOwlVariant
		? `${rootSelector} .owl-prev`
		: usesStaticSpans
			? `${rootSelector} .cci-wpc-render-preview-nav span:first-child`
			: `${rootSelector} .cci-wpc-render-preview-nav button:first-child`;
	const nextSelector = isOwlVariant
		? `${rootSelector} .owl-next`
		: usesStaticSpans
			? `${rootSelector} .cci-wpc-render-preview-nav span:last-child`
			: `${rootSelector} .cci-wpc-render-preview-nav button:last-child`;

	await expectArrowButton(
		page,
		prevSelector,
		template.prevIconClass,
		{ hasChildSpan: variant === 'owl', size: template.navSize }
	);
	await expectArrowButton(
		page,
		nextSelector,
		template.nextIconClass,
		{ hasChildSpan: variant === 'owl', size: template.navSize }
	);
}

async function loadFixture(page, viewport) {
	await page.setViewportSize(viewport);
	await page.setContent(fixtureHtml(), { waitUntil: 'load' });
	await syncFixtureControlMetrics(page);
}

async function syncFixtureControlMetrics(page) {
	await page.evaluate(() => {
		document.querySelectorAll('.cci-wpc-fixture-carousel').forEach((carousel) => {
			const viewport = carousel.querySelector('.owl-stage-outer, .cci-wpc-render-preview-viewport');

			if (!viewport) {
				return;
			}

			const carouselRect = carousel.getBoundingClientRect();
			const viewportRect = viewport.getBoundingClientRect();
			const axis = Math.round(Math.max(0, viewportRect.top - carouselRect.top + viewportRect.height / 2) * 100) / 100;

			carousel.style.setProperty('--wpc-control-axis-y', `${axis}px`);

			const isVerticalRail = carousel.matches('.cci-wpc-vertical-product-rail-template-theme, .vertical-product-rail-theme, .cci-wpc-render-preview.cci-wpc-template-vertical-product-rail');

			if (!isVerticalRail) {
				return;
			}

			const dots = carousel.querySelector('.owl-dots, .cci-wpc-render-preview-dots');

			if (!dots) {
				return;
			}

			const dotsRect = dots.getBoundingClientRect();
			const dotsBlock = Math.round(dotsRect.height * 100) / 100;
			const dotsCount = carousel.querySelectorAll([
				'.owl-dot',
				'.cci-wpc-render-preview-dots > button',
				'.cci-wpc-render-preview-dots .swiper-pagination-bullet',
				'.cci-wpc-render-preview-dots > span:not(.swiper-pagination-current):not(.swiper-pagination-total):not(.swiper-pagination-progressbar-fill):not(.swiper-pagination-bullet)',
			].join(',')).length || 1;

			carousel.style.setProperty('--wpc-vr-dots-block', `${dotsBlock}px`);
			carousel.style.setProperty('--wpc-vr-dots-count', `${dotsCount}`);
			carousel.style.setProperty('--wpc-vr-dots-half', `${Math.round((dotsBlock / 2) * 100) / 100}px`);
		});
	});
}

test('carousel controls render correctly on desktop', async ({ page }) => {
	fs.mkdirSync(screenshotDir, { recursive: true });
	await loadFixture(page, { width: 1280, height: 2200 });

	for (const template of templates) {
		await expectTemplateArrows(page, template, 'owl');
		await expectTemplateArrows(page, template, 'owl-text');
		await expectTemplateArrows(page, template, 'react');
		await expectTemplateArrows(page, template, 'static');
		await expectTemplateArrows(page, template, 'swiper');
		await expectTemplateArrows(page, template, 'swiper-fraction');
		await expectTemplateArrows(page, template, 'swiper-progressbar');
		await expectTemplateDots(page, template);
		await expectTemplateSwiperPagination(page, template);
		await expectTemplateControlPlacement(page, template, 'owl');
		await expectTemplateControlPlacement(page, template, 'owl-text');
		await expectTemplateControlPlacement(page, template, 'react');
		await expectTemplateControlPlacement(page, template, 'static');
		await expectTemplateControlPlacement(page, template, 'swiper');
		await expectTemplateControlPlacement(page, template, 'swiper-fraction');
		await expectTemplateControlPlacement(page, template, 'swiper-progressbar');
	}

	await page.screenshot({
		fullPage: true,
		path: path.join(screenshotDir, 'carousel-controls-desktop.png'),
	});
});

test('carousel controls match mobile template rules', async ({ page }) => {
	fs.mkdirSync(screenshotDir, { recursive: true });
	await loadFixture(page, { width: 430, height: 2200 });

	for (const template of templates) {
		if (template.hiddenOnMobile) {
			await expect(page.locator(`[data-template="${template.name}"][data-variant="owl"] .owl-nav`)).toHaveCSS('display', 'none');
			await expect(page.locator(`[data-template="${template.name}"][data-variant="owl-text"] .owl-nav`)).toHaveCSS('display', 'none');
			await expect(page.locator(`[data-template="${template.name}"][data-variant="react"] .cci-wpc-render-preview-nav`)).toHaveCSS('display', 'none');
			await expect(page.locator(`[data-template="${template.name}"][data-variant="static"] .cci-wpc-render-preview-nav`)).toHaveCSS('display', 'none');
			await expect(page.locator(`[data-template="${template.name}"][data-variant="swiper"] .cci-wpc-render-preview-nav`)).toHaveCSS('display', 'none');
			await expect(page.locator(`[data-template="${template.name}"][data-variant="swiper-fraction"] .cci-wpc-render-preview-nav`)).toHaveCSS('display', 'none');
			await expect(page.locator(`[data-template="${template.name}"][data-variant="swiper-progressbar"] .cci-wpc-render-preview-nav`)).toHaveCSS('display', 'none');
			await expectTemplateDots(page, template);
			await expectTemplateSwiperPagination(page, template);
			continue;
		}

		await expectTemplateArrows(page, template, 'owl');
		await expectTemplateArrows(page, template, 'owl-text');
		await expectTemplateArrows(page, template, 'react');
		await expectTemplateArrows(page, template, 'static');
		await expectTemplateArrows(page, template, 'swiper');
		await expectTemplateArrows(page, template, 'swiper-fraction');
		await expectTemplateArrows(page, template, 'swiper-progressbar');
		await expectTemplateDots(page, template);
		await expectTemplateSwiperPagination(page, template);
		await expectTemplateControlPlacement(page, template, 'owl');
		await expectTemplateControlPlacement(page, template, 'owl-text');
		await expectTemplateControlPlacement(page, template, 'react');
		await expectTemplateControlPlacement(page, template, 'static');
		await expectTemplateControlPlacement(page, template, 'swiper');
		await expectTemplateControlPlacement(page, template, 'swiper-fraction');
		await expectTemplateControlPlacement(page, template, 'swiper-progressbar');
	}

	await page.screenshot({
		fullPage: true,
		path: path.join(screenshotDir, 'carousel-controls-mobile.png'),
	});
});
