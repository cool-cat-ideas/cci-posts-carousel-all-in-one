const path = require('path');
const { chromium } = require('playwright');

const demoUrl = 'http://localhost:4060/wp-posts-carousel-demo/';
const screenshotDir = path.resolve(__dirname, '..', '..', 'dist', 'playwright-screenshots');

async function inspectPage(browser, viewport, screenshotName) {
	const page = await browser.newPage({ viewportSize: viewport });
	const failedAssets = [];

	page.on('requestfailed', (request) => {
		const assetUrl = new URL(request.url());
		const isLocalAsset = ['localhost', '127.0.0.1'].includes(assetUrl.hostname);

		if (isLocalAsset && /\.(?:css|woff2?|ttf)(?:\?|$)/i.test(request.url())) {
			failedAssets.push(request.url());
		}
	});

	const response = await page.goto(demoUrl, {
		waitUntil: 'domcontentloaded',
		timeout: 45_000,
	});

	await page.waitForLoadState('networkidle', { timeout: 25_000 }).catch(() => {});

	const result = await page.evaluate(() => {
		const controls = Array.from(document.querySelectorAll('.owl-prev, .owl-next'));
		const commerceRoots = Array.from(document.querySelectorAll('.cci-wpc-commerce-luxe-template-theme'));
		const commerceCards = commerceRoots.flatMap((root) => Array.from(root.querySelectorAll('.cci-wpc-commerce-luxe-card')));
		const oldOwnedClasses = Array.from(document.querySelectorAll('[class]'))
			.flatMap((element) => Array.from(element.classList))
			.filter((className) => /^(?:wp-posts-carousel|wpc-)/.test(className));
		const badControls = controls.filter((control) => {
			const icon = control.querySelector('i.fa');
			const iconBefore = icon ? getComputedStyle(icon, '::before') : null;
			const controlBefore = getComputedStyle(control, '::before');
			const fontFamily = icon ? getComputedStyle(icon).fontFamily : '';
			const glyph = iconBefore ? iconBefore.content : '';

			return !icon
				|| !/FontAwesome/i.test(fontFamily)
				|| !glyph
				|| glyph === 'none'
				|| glyph === 'normal'
				|| (controlBefore.content && !['none', 'normal', '\"\"'].includes(controlBefore.content));
		});

		return {
			badControls: badControls.length,
			commerceCards: commerceCards.length,
			commerceOverflow: commerceCards.filter((card) => card.scrollWidth > card.clientWidth + 1).length,
			commerceRoots: commerceRoots.length,
			controls: controls.length,
			horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
			oldOwnedClasses: Array.from(new Set(oldOwnedClasses)),
		};
	});

	await page.screenshot({
		path: path.join(screenshotDir, screenshotName),
		fullPage: false,
	});
	await page.close();

	return {
		...result,
		failedAssets,
		status: response ? response.status() : 0,
		viewport,
	};
}

(async () => {
	const browser = await chromium.launch({
		headless: true,
		args: ['--host-resolver-rules=MAP localhost 127.0.0.1'],
	});

	try {
		const results = [
			await inspectPage(browser, { width: 1440, height: 1000 }, 'wpc-demo-desktop.png'),
			await inspectPage(browser, { width: 390, height: 844 }, 'wpc-demo-mobile.png'),
		];

		console.log(JSON.stringify(results, null, 2));

		if (results.some((result) => (
			result.status !== 200
			|| result.controls < 1
			|| result.badControls > 0
			|| result.commerceRoots < 1
			|| result.commerceCards < 1
			|| result.commerceOverflow > 0
			|| result.oldOwnedClasses.length > 0
			|| result.failedAssets.length > 0
			|| result.horizontalOverflow > 0
		))) {
			process.exitCode = 1;
		}
	} finally {
		await browser.close();
	}
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
