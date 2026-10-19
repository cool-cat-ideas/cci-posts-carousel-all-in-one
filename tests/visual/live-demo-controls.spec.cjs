const fs = require('fs');
const path = require('path');
const { test, expect } = require('playwright/test');

const rootDir = path.resolve(__dirname, '..', '..');
const screenshotDir = path.join(rootDir, 'dist', 'playwright-screenshots');
const demoUrl = process.env.WPC_LIVE_DEMO_URL || 'http://localhost:4060/wp-posts-carousel-demo/';
const primaryYouTubeId = 'N_OcJBvvecU';

test.setTimeout(180_000);

function boxesIntersect(first, second) {
  return !(
    first.right <= second.left ||
    first.left >= second.right ||
    first.bottom <= second.top ||
    first.top >= second.bottom
  );
}

async function boxInfo(locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();

    return {
      bottom: rect.bottom,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width,
    };
  });
}

async function expectActiveContentWithinRoot(locator, activeSelector) {
  const layout = await locator.evaluate((root, selector) => {
    const tolerance = 2;
    const rootRect = root.getBoundingClientRect();
    const activeItems = Array.from(root.querySelectorAll(selector));
    const visibleBad = [];
    const className = (element) => {
      if (typeof element.className === 'string') {
        return element.className;
      }

      return element.getAttribute('class') || '';
    };

    for (const activeItem of activeItems) {
      for (const element of [activeItem, ...activeItem.querySelectorAll('*')]) {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          rect.width <= 0 ||
          rect.height <= 0
        ) {
          continue;
        }

        if (rect.right < rootRect.left || rect.left > rootRect.right) {
          continue;
        }

        if (rect.left < rootRect.left - tolerance || rect.right > rootRect.right + tolerance) {
          visibleBad.push({
            className: className(element),
            left: rect.left,
            right: rect.right,
            tag: element.tagName,
          });
        }
      }
    }

    return {
      activeCount: activeItems.length,
      bad: visibleBad.slice(0, 12),
      rootWidth: rootRect.width,
    };
  }, activeSelector);

  expect(layout.rootWidth).toBeGreaterThan(0);
  expect(layout.activeCount).toBeGreaterThan(0);
  expect(layout.bad).toEqual([]);
}

async function expectContextualProductCarousel(rail) {
  const layout = await rail.evaluate((element) => {
    const root = element.querySelector('.cci-wpc-carousel');
    const activeSelector =
      root.dataset.wpcEngine === 'swiper' ? '.swiper-slide-active' : '.owl-item.active';
    const activeItems = Array.from(root.querySelectorAll(activeSelector));
    const card = root.querySelector(
      `${activeSelector} .cci-wpc-aurora-card, ` +
        `${activeSelector} .cci-wpc-vertical-product-card, ` +
        `${activeSelector} .cci-wpc-commerce-luxe-card`,
    );
    const rootRect = root.getBoundingClientRect();
    const cardRect = card ? card.getBoundingClientRect() : null;
    const visibleDots = Array.from(
      root.querySelectorAll('.owl-dots, .cci-wpc-render-preview-dots'),
    ).filter((node) => {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);

      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width > 0 &&
        rect.height > 0
      );
    });
    const overflowing = Array.from(root.querySelectorAll(`${activeSelector} *`)).filter((node) => {
      const box = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);

      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        box.width > 0 &&
        box.height > 0 &&
        (box.left < rootRect.left - 2 || box.right > rootRect.right + 2)
      );
    });

    return {
      activeCount: activeItems.length,
      cardWidth: cardRect ? cardRect.width : 0,
      cardShadow: card ? window.getComputedStyle(card).boxShadow : '',
      demoKey: root.dataset.wpcDemoKey || '',
      dots: visibleDots.length,
      engine: root.dataset.wpcEngine || '',
      navigationControls: root.querySelectorAll(
        '.owl-prev, .owl-next, .cci-wpc-render-preview-prev, .cci-wpc-render-preview-next',
      ).length,
      overflowCount: overflowing.length,
      rootWidth: rootRect.width,
    };
  });

  expect([
    'contextual-product-showcase',
    'vertical-product-rail-showcase',
    'aurora-products-showcase',
    'commerce-luxe-products',
  ]).toContain(layout.demoKey);
  expect(layout.activeCount).toBe(1);
  expect(layout.cardWidth).toBeGreaterThan(220);
  expect(layout.cardShadow).toBe('none');
  expect(layout.dots).toBe(0);
  expect(layout.navigationControls).toBe(2);
  expect(layout.rootWidth).toBeLessThanOrEqual(430);
  expect(layout.overflowCount).toBe(0);

  const root = rail.locator('.cci-wpc-carousel').first();
  await expectActiveContentWithinRoot(
    root,
    layout.engine === 'swiper' ? '.swiper-slide-active' : '.owl-item.active',
  );
}

async function controlInfo(locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const icon = element.querySelector('i.fa');

    return {
      bottom: rect.bottom,
      height: rect.height,
      iconClasses: icon ? Array.from(icon.classList) : [],
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width,
    };
  });
}

async function expectBrandNavigation(root) {
  const prev = root.locator('.owl-prev');
  const next = root.locator('.owl-next');
  await root.scrollIntoViewIfNeeded();
  await expect(prev).toBeVisible();
  await expect(next).toBeVisible();

  const normal = await prev.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return {
      background: style.backgroundColor,
      color: style.color,
      height: Math.round(rect.height),
      opacity: style.opacity,
      width: Math.round(rect.width),
    };
  });

  expect(normal).toEqual({
    background: 'rgb(255, 255, 255)',
    color: 'rgb(86, 48, 197)',
    height: 44,
    opacity: '1',
    width: 44,
  });

  await prev.hover();
  await root.page().waitForTimeout(200);
  const hover = await prev.evaluate((element) => {
    const style = window.getComputedStyle(element);

    return {
      background: style.backgroundColor,
      boxShadow: style.boxShadow,
      color: style.color,
    };
  });

  expect(hover).toEqual({
    background: 'rgb(241, 237, 255)',
    boxShadow: 'none',
    color: 'rgb(86, 48, 197)',
  });
}

async function expectOwlKeyboardAccessibility(root) {
  await root.scrollIntoViewIfNeeded();
  const prev = root.locator('.owl-prev').first();
  const next = root.locator('.owl-next').first();

  await expect(prev).toHaveAttribute('type', 'button');
  await expect(next).toHaveAttribute('type', 'button');
  await expect(prev).toHaveAttribute('aria-label', 'Previous slide');
  await expect(next).toHaveAttribute('aria-label', 'Next slide');
  await expect(prev).toHaveAttribute('aria-controls', /.+/);
  await expect(next).toHaveAttribute('aria-controls', /.+/);
  expect(await prev.evaluate((element) => element.tagName)).toBe('BUTTON');
  expect(await next.evaluate((element) => element.tagName)).toBe('BUTTON');

  await root.evaluate((element) => {
    const carousel = element.matches('.cci-wpc-carousel')
      ? element
      : element.querySelector('.cci-wpc-carousel');
    window.jQuery?.(carousel).trigger('stop.owl.autoplay');
  });

  const dots = root.locator('.owl-dots .owl-dot');
  const dotCount = await dots.count();
  expect(dotCount).toBeGreaterThan(1);

  for (let index = 0; index < dotCount; index++) {
    const dot = dots.nth(index);
    await expect(dot).toHaveAttribute('role', 'button');
    await expect(dot).toHaveAttribute('tabindex', '0');
    await expect(dot).toHaveAttribute('aria-label', `Go to slide ${index + 1}`);
  }

  const second = dots.nth(1);
  await second.focus();
  await expect(second).toBeFocused();
  await second.press('Enter');
  await expect(second).toHaveClass(/active/);
  await expect(second).toHaveAttribute('aria-current', 'true');

  const first = dots.first();
  await first.focus();
  await expect(first).toBeFocused();
  await first.press('Space');
  await expect(first).toHaveClass(/active/);
  await expect(first).toHaveAttribute('aria-current', 'true');
}

async function expectAllOwlControlsAccessible(page) {
  const result = await page.evaluate(() => {
    const controls = Array.from(document.querySelectorAll('.owl-prev, .owl-next'));
    const dots = Array.from(document.querySelectorAll('.owl-dots .owl-dot'));
    const invalidControls = controls.filter((control) => {
      const icon = control.querySelector('i.fa');
      const iconStyle = icon ? getComputedStyle(icon) : null;
      const glyph = icon ? getComputedStyle(icon, '::before').content : '';

      return (
        control.tagName !== 'BUTTON' ||
        control.getAttribute('type') !== 'button' ||
        !control.getAttribute('aria-label') ||
        !icon ||
        !/FontAwesome/i.test(iconStyle?.fontFamily || '') ||
        !glyph ||
        glyph === 'none' ||
        glyph === '""'
      );
    });
    const invalidDots = dots.filter(
      (dot) =>
        dot.getAttribute('role') !== 'button' ||
        dot.getAttribute('tabindex') !== '0' ||
        !dot.getAttribute('aria-label'),
    );

    return {
      controls: controls.length,
      dots: dots.length,
      invalidControls: invalidControls.length,
      invalidDots: invalidDots.length,
    };
  });

  expect(result.controls).toBeGreaterThan(0);
  expect(result.dots).toBeGreaterThan(0);
  expect(result.invalidControls).toBe(0);
  expect(result.invalidDots).toBe(0);
}

async function expectHorizontalOwl(page, config) {
  const root = page.locator(config.selector).first();
  await root.scrollIntoViewIfNeeded();
  await expect(root.locator('.owl-prev')).toBeVisible();
  await expect(root.locator('.owl-next')).toBeVisible();

  if (config.expectedFirstYouTubeId) {
    const firstRealSlide = root.locator('.owl-item:not(.cloned)').first();
    const iframe = firstRealSlide.locator('iframe').first();
    await expect(iframe).toBeVisible();
    const expectedEmbed = new RegExp(`/embed/${config.expectedFirstYouTubeId}\\b`);
    const deferredSrc = await iframe.getAttribute('data-wpc-src');

    if (deferredSrc) {
      await expect(iframe).toHaveAttribute('data-wpc-src', expectedEmbed);
    }

    await expect
      .poll(async () => iframe.getAttribute('src') || iframe.getAttribute('data-wpc-src') || '')
      .toMatch(expectedEmbed);

    const frameSrc = await iframe.getAttribute('src');
    if (frameSrc && frameSrc.includes('autoplay=1')) {
      expect(frameSrc).toContain('mute=1');
    }
  }

  const prev = await controlInfo(root.locator('.owl-prev'));
  const next = await controlInfo(root.locator('.owl-next'));
  const dots = await boxInfo(root.locator('.owl-dots'));
  const viewport = await boxInfo(root.locator('.owl-stage-outer'));

  expect(Math.round(prev.width)).toBe(config.navSize);
  expect(Math.round(prev.height)).toBe(config.navSize);
  expect(Math.round(next.width)).toBe(config.navSize);
  expect(Math.round(next.height)).toBe(config.navSize);
  expect(prev.iconClasses).toContain('fa-angle-left');
  expect(next.iconClasses).toContain('fa-angle-right');
  expect(prev.left).toBeGreaterThanOrEqual(viewport.left - 1);
  expect(next.right).toBeLessThanOrEqual(viewport.right + 1);
  expect(dots.top).toBeGreaterThanOrEqual(viewport.bottom + 8);
  expect(boxesIntersect(prev, dots)).toBe(false);
  expect(boxesIntersect(next, dots)).toBe(false);
}

async function expectVerticalRail(page, selector) {
  const rootSelector = selector;
  const root = page.locator(rootSelector).first();
  await root.scrollIntoViewIfNeeded();
  await expect(root).toBeVisible();
  await expect(root.locator('.swiper-slide-active .cci-wpc-vertical-product-card')).toBeVisible();
  await expect(root.locator('.cci-wpc-render-preview-dots')).toBeVisible();
  await page.waitForFunction((activeRootSelector) => {
    const element = document.querySelector(activeRootSelector);
    if (!element) {
      return false;
    }

    const prev = element
      .querySelector('.cci-wpc-render-preview-nav button:first-child')
      ?.getBoundingClientRect();
    const next = element
      .querySelector('.cci-wpc-render-preview-nav button:last-child')
      ?.getBoundingClientRect();
    const dots = element.querySelector('.cci-wpc-render-preview-dots')?.getBoundingClientRect();

    return prev && next && dots && dots.top > prev.bottom && next.top > dots.bottom;
  }, rootSelector);
  await root.evaluate((element) => {
    window.wpPostsCarouselLazyLoad?.syncControls?.(element);
  });
  await page.waitForTimeout(120);

  const prevLocator = root.locator('.cci-wpc-render-preview-nav button').first();
  const nextLocator = root.locator('.cci-wpc-render-preview-nav button').last();
  await expect(prevLocator).toBeVisible();
  await expect(nextLocator).toBeVisible();

  const prev = await controlInfo(prevLocator);
  const next = await controlInfo(nextLocator);
  const dots = await boxInfo(root.locator('.cci-wpc-render-preview-dots'));
  const viewport = await boxInfo(root.locator('.cci-wpc-render-preview-viewport'));
  const metrics = await root.evaluate((element) => {
    const chrome = element.querySelector('.cci-wpc-render-preview-chrome').getBoundingClientRect();
    const viewport = element
      .querySelector('.cci-wpc-render-preview-viewport')
      .getBoundingClientRect();
    const title = element
      .querySelector('.swiper-slide-active .cci-wpc-vertical-product-title')
      ?.getBoundingClientRect();
    const button = element
      .querySelector(
        '.swiper-slide-active .cci-wpc-vertical-product-actions a, ' +
          '.swiper-slide-active .cci-wpc-vertical-product-button, ' +
          '.swiper-slide-active .button',
      )
      ?.getBoundingClientRect();
    const intersects = (first, second) =>
      Boolean(first && second) &&
      first.left < second.right &&
      first.right > second.left &&
      first.top < second.bottom &&
      first.bottom > second.top;

    return {
      chromeBottom: chrome.bottom,
      chromeHeight: chrome.height,
      chromeTop: chrome.top,
      buttonChromeOverlap: intersects(button, chrome),
      renderedDots: element.querySelectorAll(
        '.cci-wpc-render-preview-dots .swiper-pagination-bullet',
      ).length,
      pagination: element.querySelector('.cci-wpc-render-preview-dots')?.textContent?.trim() || '',
      titleChromeOverlap: intersects(title, chrome),
      viewportBottom: viewport.bottom,
      viewportRight: viewport.right,
      viewportTop: viewport.top,
    };
  });

  expect(metrics.renderedDots).toBe(0);
  expect(metrics.pagination).toMatch(/^1\s*\/\s*\d+$/);
  expect(Math.round(prev.width)).toBe(42);
  expect(Math.round(prev.height)).toBe(42);
  expect(Math.round(next.width)).toBe(42);
  expect(Math.round(next.height)).toBe(42);
  expect(prev.iconClasses).toContain('fa-angle-up');
  expect(next.iconClasses).toContain('fa-angle-down');
  expect(dots.top - prev.bottom).toBeGreaterThanOrEqual(8);
  expect(dots.top - prev.bottom).toBeLessThanOrEqual(16);
  expect(next.top - dots.bottom).toBeGreaterThanOrEqual(8);
  expect(next.top - dots.bottom).toBeLessThanOrEqual(16);
  expect(metrics.chromeHeight).toBeGreaterThan(0);
  expect(metrics.chromeHeight).toBeLessThanOrEqual(viewport.height - 24);
  expect(metrics.chromeTop).toBeGreaterThanOrEqual(metrics.viewportTop);
  expect(metrics.chromeBottom).toBeLessThanOrEqual(metrics.viewportBottom);
  expect(metrics.titleChromeOverlap).toBe(false);
  expect(metrics.buttonChromeOverlap).toBe(false);
  expect(prev.right).toBeLessThanOrEqual(viewport.right - 12);
  expect(dots.right).toBeLessThanOrEqual(viewport.right - 12);
  expect(boxesIntersect(prev, dots)).toBe(false);
  expect(boxesIntersect(next, dots)).toBe(false);

  const bulletCount = await root
    .locator('.cci-wpc-render-preview-dots .swiper-pagination-bullet')
    .count();
  if (bulletCount > 1) {
    await root
      .locator('.cci-wpc-render-preview-dots .swiper-pagination-bullet')
      .nth(bulletCount - 1)
      .click();
    await page.waitForTimeout(900);

    const mask = await root.evaluate((element) => {
      const viewportNode = element.querySelector('.cci-wpc-render-preview-viewport');
      const activeSlide = element.querySelector('.swiper-slide-active');
      const viewport = viewportNode.getBoundingClientRect();
      const viewportStyle = window.getComputedStyle(viewportNode);
      const contentTop = viewport.top + Number.parseFloat(viewportStyle.borderTopWidth || '0');
      const contentBottom =
        viewport.bottom - Number.parseFloat(viewportStyle.borderBottomWidth || '0');
      const active = activeSlide.getBoundingClientRect();
      const bleedingSlides = Array.from(element.querySelectorAll('.cci-wpc-render-preview-slide'))
        .filter((slide) => !slide.classList.contains('swiper-slide-active'))
        .map((slide) => {
          const box = slide.getBoundingClientRect();
          return {
            bottom: box.bottom,
            className: slide.className,
            top: box.top,
          };
        })
        .filter((slide) => slide.bottom > contentTop + 0.75 && slide.top < contentBottom - 0.75);

      return {
        activeBottomGap: contentBottom - active.bottom,
        activeTopGap: active.top - contentTop,
        bleedingSlides,
      };
    });

    expect(Math.abs(mask.activeTopGap)).toBeLessThanOrEqual(1);
    expect(Math.abs(mask.activeBottomGap)).toBeLessThanOrEqual(1);
    expect(mask.bleedingSlides).toEqual([]);
  }
}

async function expectVerticalProductRailLinks(page) {
  const products = page.locator('.cci-wpc-demo-vertical-product-rail-showcase').first();
  await products.scrollIntoViewIfNeeded();
  await expect(
    products.locator('.swiper-slide-active .cci-wpc-vertical-product-card'),
  ).toBeVisible();

  const productLinks = await products.evaluate((element) => {
    const active = element.querySelector('.swiper-slide-active');
    const links = (selector) =>
      Array.from(active.querySelectorAll(selector)).map((link) => ({
        href: link.getAttribute('href') || '',
        text: link.textContent.trim(),
      }));

    return {
      categories: links('.cci-wpc-vertical-product-meta-list a'),
    };
  });

  expect(productLinks.categories.length).toBeGreaterThan(0);
  expect(productLinks.categories.every((link) => link.href && link.text)).toBe(true);
}

async function expectVideoShowcaseSwiper(page) {
  const root = page.locator('.cci-wpc-demo-pro-video-showcase-swiper').first();
  await root.scrollIntoViewIfNeeded();
  await expect(root.locator('.cci-wpc-render-preview-viewport.swiper')).toBeVisible();
  await expect(root.locator('.cci-wpc-render-preview-slide')).toHaveCount(2);
  await expect(root.locator('.cci-wpc-render-preview-prev')).toBeVisible();
  await expect(root.locator('.cci-wpc-render-preview-next')).toBeVisible();
  await expectHorizontalSwiperControls(root, 44);
  await root.evaluate((element) => {
    element.querySelector('.swiper')?.swiper?.autoplay?.stop();
  });

  const before = await root.evaluate((element) => {
    const swiper = element.querySelector('.swiper')?.swiper;

    return {
      activeIndex: swiper?.activeIndex ?? null,
      pagination: element.querySelector('.swiper-pagination')?.textContent?.trim() || '',
      title: element.querySelector('.swiper-slide-active')?.textContent?.trim() || '',
    };
  });

  expect(before.activeIndex).toBe(0);
  expect(before.pagination).toBe('1 / 2');
  expect(before.title).toContain('Product education video playlist');
  await expectSwiperActiveSlideFramed(root);

  await root.locator('.cci-wpc-render-preview-next').click();
  await page.waitForFunction(() => {
    const root = document.querySelector('.cci-wpc-demo-pro-video-showcase-swiper');
    const swiper = root?.querySelector('.swiper')?.swiper;

    return swiper?.activeIndex === 1;
  });
  await page.waitForFunction(() => {
    const root = document.querySelector('.cci-wpc-demo-pro-video-showcase-swiper');
    const viewport = root?.querySelector('.swiper');
    const activeSlide = root?.querySelector('.swiper-slide-active');

    if (!viewport || !activeSlide) {
      return false;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const activeRect = activeSlide.getBoundingClientRect();

    return (
      Math.abs(activeRect.left - viewportRect.left) <= 2 &&
      Math.abs(activeRect.right - viewportRect.right) <= 2
    );
  });

  const after = await root.evaluate((element) => {
    const swiper = element.querySelector('.swiper')?.swiper;
    const rect = (node) => {
      const box = node.getBoundingClientRect();

      return {
        bottom: box.bottom,
        left: box.left,
        right: box.right,
        top: box.top,
        width: box.width,
      };
    };
    const dots = element.querySelector('.swiper-pagination');
    const viewport = element.querySelector('.cci-wpc-render-preview-viewport');

    return {
      activeIndex: swiper?.activeIndex ?? null,
      dots: rect(dots),
      pagination: element.querySelector('.swiper-pagination')?.textContent?.trim() || '',
      title: element.querySelector('.swiper-slide-active h3')?.textContent?.trim() || '',
      viewport: rect(viewport),
    };
  });

  expect(after.activeIndex).toBe(1);
  expect(after.pagination).toBe('2 / 2');
  expect(after.title).toContain('Landing page video section');
  expect(
    Math.abs(
      (after.dots.left + after.dots.right) / 2 - (after.viewport.left + after.viewport.right) / 2,
    ),
  ).toBeLessThanOrEqual(2);
  expect(after.dots.top - after.viewport.bottom).toBeGreaterThanOrEqual(8);
  expect(after.dots.top - after.viewport.bottom).toBeLessThanOrEqual(48);
  await expectSwiperActiveSlideFramed(root);
  await expectVideoShowcaseMediaContained(root, '.swiper-slide-active');

  const thirdPlaylistItem = root
    .locator('.swiper-slide-active .cci-wpc-video-showcase-playlist-button')
    .nth(2);
  await thirdPlaylistItem.dispatchEvent('click');
  await expect(thirdPlaylistItem).toHaveAttribute('aria-current', 'true');
  await expect(root.locator('.swiper-slide-active .cci-wpc-video-showcase-copy h3')).toHaveText(
    'Pair with products',
  );
  await expectVideoShowcaseMediaContained(root, '.swiper-slide-active');

  await root.locator('.cci-wpc-render-preview-prev').click();
  await page.waitForFunction(() => {
    const root = document.querySelector('.cci-wpc-demo-pro-video-showcase-swiper');
    const swiper = root?.querySelector('.swiper')?.swiper;

    return swiper?.activeIndex === 0;
  });
  await root.locator('.cci-wpc-render-preview-next').click();
  await page.waitForFunction(() => {
    const root = document.querySelector('.cci-wpc-demo-pro-video-showcase-swiper');
    const swiper = root?.querySelector('.swiper')?.swiper;

    return swiper?.activeIndex === 1;
  });
  await expect(
    root.locator('.swiper-slide-active .cci-wpc-video-showcase-playlist-button').first(),
  ).toHaveAttribute('aria-current', 'true');
  await expectVideoShowcaseMediaContained(root, '.swiper-slide-active');
}

async function expectVideoShowcaseMediaContained(root, activeSelector) {
  const layout = await root.evaluate((element, selector) => {
    const activeSlide = element.querySelector(selector);
    const stage = activeSlide?.querySelector('.cci-wpc-video-showcase-stage');
    const iframe = stage?.querySelector('iframe');
    const playlist = activeSlide?.querySelector('.cci-wpc-video-showcase-playlist');
    const rect = (node) => {
      const box = node?.getBoundingClientRect();

      return box
        ? {
            bottom: box.bottom,
            height: box.height,
            left: box.left,
            right: box.right,
            top: box.top,
            width: box.width,
          }
        : null;
    };

    return {
      iframe: rect(iframe),
      legacyStageCount: activeSlide?.querySelectorAll('.wpc-video-showcase-stage').length || 0,
      playlist: rect(playlist),
      playlistItems:
        playlist?.querySelectorAll('.cci-wpc-video-showcase-playlist-item').length || 0,
      stage: rect(stage),
      stageOverflow: stage ? window.getComputedStyle(stage).overflow : '',
      stagePosition: stage ? window.getComputedStyle(stage).position : '',
    };
  }, activeSelector);

  expect(layout.legacyStageCount).toBe(0);
  expect(layout.playlistItems).toBeGreaterThan(1);
  expect(layout.stagePosition).toBe('relative');
  expect(layout.stageOverflow).toBe('hidden');
  expect(layout.stage).not.toBeNull();
  expect(layout.iframe).not.toBeNull();
  expect(layout.playlist).not.toBeNull();
  expect(layout.iframe.left).toBeGreaterThanOrEqual(layout.stage.left - 1);
  expect(layout.iframe.right).toBeLessThanOrEqual(layout.stage.right + 1);
  expect(layout.iframe.top).toBeGreaterThanOrEqual(layout.stage.top - 1);
  expect(layout.iframe.bottom).toBeLessThanOrEqual(layout.stage.bottom + 1);
  expect(boxesIntersect(layout.iframe, layout.playlist)).toBe(false);
}

async function expectHorizontalSwiperControls(root, navSize) {
  const prev = await controlInfo(root.locator('.cci-wpc-render-preview-prev'));
  const next = await controlInfo(root.locator('.cci-wpc-render-preview-next'));
  const dots = await boxInfo(root.locator('.cci-wpc-render-preview-dots'));
  const viewport = await boxInfo(root.locator('.cci-wpc-render-preview-viewport'));

  expect(Math.round(prev.width)).toBe(navSize);
  expect(Math.round(prev.height)).toBe(navSize);
  expect(Math.round(next.width)).toBe(navSize);
  expect(Math.round(next.height)).toBe(navSize);
  expect(prev.iconClasses).toContain('fa-angle-left');
  expect(next.iconClasses).toContain('fa-angle-right');
  expect(prev.left).toBeGreaterThanOrEqual(viewport.left - 1);
  expect(next.right).toBeLessThanOrEqual(viewport.right + 1);
  expect(dots.top).toBeGreaterThanOrEqual(viewport.bottom + 8);
  expect(dots.top - viewport.bottom).toBeLessThanOrEqual(48);
  expect(boxesIntersect(prev, dots)).toBe(false);
  expect(boxesIntersect(next, dots)).toBe(false);
}

async function expectSwiperActiveSlideFramed(root) {
  let layout = null;

  await expect
    .poll(
      async () => {
        layout = await root.evaluate((element) => {
          const tolerance = 2;
          const viewport = element.querySelector('.swiper');
          const activeSlide = element.querySelector('.swiper-slide-active');
          const viewportRect = viewport.getBoundingClientRect();
          const activeRect = activeSlide.getBoundingClientRect();

          return {
            activeLeft: activeRect.left,
            activeRight: activeRect.right,
            activeWidth: activeRect.width,
            framed:
              activeRect.width > viewportRect.width * 0.92 &&
              activeRect.left >= viewportRect.left - tolerance &&
              activeRect.right <= viewportRect.right + tolerance,
            viewportLeft: viewportRect.left,
            viewportRight: viewportRect.right,
            viewportWidth: viewportRect.width,
          };
        });

        return layout.framed;
      },
      { timeout: 5000 },
    )
    .toBe(true);

  layout = await root.evaluate((element) => {
    const viewport = element.querySelector('.swiper');
    const activeSlide = element.querySelector('.swiper-slide-active');
    const viewportRect = viewport.getBoundingClientRect();
    const activeRect = activeSlide.getBoundingClientRect();

    return {
      activeLeft: activeRect.left,
      activeRight: activeRect.right,
      activeWidth: activeRect.width,
      viewportLeft: viewportRect.left,
      viewportRight: viewportRect.right,
      viewportWidth: viewportRect.width,
    };
  });

  expect(layout.activeWidth).toBeGreaterThan(layout.viewportWidth * 0.92);
  expect(layout.activeLeft).toBeGreaterThanOrEqual(layout.viewportLeft - 2);
  expect(layout.activeRight).toBeLessThanOrEqual(layout.viewportRight + 2);
}

async function expectEditorialListMasksInactiveSlides(page) {
  const root = page.locator('.cci-wpc-demo-light-editorial').first();
  await root.scrollIntoViewIfNeeded();
  await expect(root.locator('.owl-item.active .cci-wpc-slide').first()).toBeVisible();

  const layout = await root.evaluate((element) => {
    const stageOuter = element.querySelector('.owl-stage-outer');
    const stageRect = stageOuter.getBoundingClientRect();

    return Array.from(element.querySelectorAll('.owl-item:not(.active)'))
      .map((item, index) => {
        const rect = item.getBoundingClientRect();
        const style = window.getComputedStyle(item);
        const intersectionWidth = Math.max(
          0,
          Math.min(rect.right, stageRect.right) - Math.max(rect.left, stageRect.left),
        );
        const intersectionHeight = Math.max(
          0,
          Math.min(rect.bottom, stageRect.bottom) - Math.max(rect.top, stageRect.top),
        );

        return {
          index,
          intersectionHeight,
          intersectionWidth,
          visibility: style.visibility,
        };
      })
      .filter((item) => item.intersectionWidth > 0.5 && item.intersectionHeight > 0.5);
  });

  expect(layout.every((item) => item.visibility === 'hidden')).toBe(true);
}

async function styleSnapshot(locator) {
  return locator.evaluate((element) => {
    const style = window.getComputedStyle(element);

    return {
      backgroundColor: style.backgroundColor,
      borderBottomColor: style.borderBottomColor,
      borderTopColor: style.borderTopColor,
      color: style.color,
      cursor: style.cursor,
      filter: style.filter,
      opacity: style.opacity,
      textDecorationColor: style.textDecorationColor,
      textDecorationLine: style.textDecorationLine,
      transform: style.transform,
    };
  });
}

async function actionStyleSnapshot(locator) {
  return locator.evaluate((element) => {
    const style = window.getComputedStyle(element);

    return {
      backgroundColor: style.backgroundColor,
      borderRadius: style.borderRadius,
      borderTopColor: style.borderTopColor,
      borderTopWidth: style.borderTopWidth,
      color: style.color,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      minHeight: style.minHeight,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      textDecorationLine: style.textDecorationLine,
    };
  });
}

async function expectMatchingActionStyles(page, config) {
  const root = page.locator(config.root).first();
  await root.scrollIntoViewIfNeeded();

  const first = root.locator(config.first).first();
  const second = root.locator(config.second).first();
  await expect(first).toBeVisible();
  await expect(second).toBeVisible();

  const firstStyle = await actionStyleSnapshot(first);
  const secondStyle = await actionStyleSnapshot(second);

  expect(secondStyle).toEqual(firstStyle);
}

async function expectHoverChange(page, config) {
  const placeholder = page.locator(config.root).first();
  await placeholder.scrollIntoViewIfNeeded();
  const reactRoot = page.locator(`[data-wpc-react-root="true"]${config.root}:visible`).first();
  await reactRoot.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
  const root = (await reactRoot.isVisible().catch(() => false))
    ? reactRoot
    : page.locator(`${config.root}:visible`).first();
  await expect(root).toBeVisible();

  const hoverCandidates = root.locator(config.hover);
  const targetCandidates = root.locator(config.target || config.hover);
  const visibleIndex = await hoverCandidates.evaluateAll((elements) => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    return elements.findIndex((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return (
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < viewportHeight &&
        rect.left < viewportWidth
      );
    });
  });
  const index = Math.max(0, visibleIndex);
  const hoverTarget = hoverCandidates.nth(index);
  const styleTarget = targetCandidates.nth(index);
  await expect(hoverTarget).toBeVisible();
  await expect(styleTarget).toBeVisible();

  const before = await styleSnapshot(styleTarget);
  const cursor = await hoverTarget.evaluate((element) => window.getComputedStyle(element).cursor);
  await hoverTarget.hover();
  await page.waitForTimeout(120);
  const after = await styleSnapshot(styleTarget);
  const changed = [
    'backgroundColor',
    'borderBottomColor',
    'borderTopColor',
    'color',
    'filter',
    'opacity',
    'textDecorationColor',
    'textDecorationLine',
    'transform',
  ].some((property) => before[property] !== after[property]);

  expect(cursor).toBe('pointer');
  expect(changed, `${config.root} ${config.hover} should change style on hover`).toBe(true);
}

test('live demo carousel controls match rendered Owl and Swiper markup', async ({ page }) => {
  fs.mkdirSync(screenshotDir, { recursive: true });
  const failedAssets = [];
  page.on('requestfailed', (request) => {
    if (['font', 'stylesheet'].includes(request.resourceType())) {
      failedAssets.push(request.url());
    }
  });
  await page.setViewportSize({ width: 1510, height: 1000 });
  await page.goto(demoUrl, { waitUntil: 'domcontentloaded' });

  await expectOwlKeyboardAccessibility(page.locator('.cci-wpc-demo-default-visual').first());
  await expectAllOwlControlsAccessible(page);
  expect(await page.locator('.cci-wpc-carousel img[srcset][sizes]').count()).toBeGreaterThan(0);
  expect(failedAssets).toEqual([]);

  await expectVideoShowcaseSwiper(page);
  await expectHorizontalOwl(page, {
    selector: '.cci-wpc-demo-pro-video-showcase',
    navSize: 44,
    expectedFirstYouTubeId: primaryYouTubeId,
  });

  for (const selector of [
    '.cci-wpc-demo-default-visual',
    '.cci-wpc-demo-aurora-blog-showcase',
    '.cci-wpc-demo-story-commerce-showcase',
    '.cci-wpc-demo-commerce-luxe-products',
    '.cci-wpc-demo-pro-video-showcase',
  ]) {
    await expectBrandNavigation(page.locator(selector).first());
  }

  await page.screenshot({
    fullPage: true,
    path: path.join(screenshotDir, 'live-demo-controls.png'),
  });
});

test('live demo Owl controls remain accessible on mobile', async ({ page }) => {
  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto(demoUrl, { waitUntil: 'domcontentloaded' });

  expect(response.status()).toBe(200);
  await expectAllOwlControlsAccessible(page);
  const defaultCarousel = page.locator('.cci-wpc-demo-default-visual').first();
  await expect(defaultCarousel).toBeVisible();
  await defaultCarousel.scrollIntoViewIfNeeded();
  await expect(defaultCarousel.locator('.owl-dots')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBe(0);
  await page.screenshot({
    path: path.join(screenshotDir, 'live-demo-controls-mobile.png'),
  });
});

test('live demo distinguishes Free and Pro without repeating package metadata', async ({
  page,
}) => {
  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.setViewportSize({ width: 1360, height: 900 });
  await page.goto(demoUrl, { waitUntil: 'domcontentloaded' });

  const sectionCount = await page.locator('.cci-wpc-demo-section').count();
  const info = page.locator('.cci-wpc-demo-carousel-info');
  const hero = page.locator('.cci-wpc-demo-hero');
  await expect(info).toHaveCount(sectionCount);
  await expect(hero.getByRole('link', { name: 'Free examples' })).toHaveAttribute(
    'href',
    '#wpc-demo-free',
  );
  await expect(hero.getByRole('link', { name: 'Pro examples' })).toHaveAttribute(
    'href',
    '#wpc-demo-pro',
  );
  await expect(hero.getByRole('link', { name: 'WordPress carousel guide' })).toBeVisible();
  await expect(hero.locator('.cci-wpc-demo-hero-panel')).toHaveCount(0);
  expect(sectionCount).toBe(10);
  await expect(page.locator('#wpc-demo-free')).toBeVisible();
  await expect(page.locator('#wpc-demo-pro')).toBeVisible();

  const framedSections = await page.locator('.cci-wpc-demo-section').evaluateAll((sections) =>
    sections
      .map((section) => {
        const styles = getComputedStyle(section);

        return {
          background: styles.backgroundColor,
          borderTopWidth: styles.borderTopWidth,
          id: section.id,
          inlineStyle: section.getAttribute('style') || '',
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
          paddingTop: styles.paddingTop,
        };
      })
      .filter(
        (section) =>
          section.background !== 'rgba(0, 0, 0, 0)' ||
          section.borderTopWidth !== '0px' ||
          section.inlineStyle !== '' ||
          section.paddingBottom !== '0px' ||
          section.paddingLeft !== '0px' ||
          section.paddingRight !== '0px' ||
          section.paddingTop !== '0px',
      ),
  );
  expect(framedSections).toEqual([]);
  await expect(
    page.locator(
      '.cci-wpc-demo-section > h3, .cci-wpc-demo-section > .wp-block-group__inner-container > h3',
    ),
  ).toHaveCount(0);

  const rows = await info.evaluateAll((elements) =>
    elements.map((element) => {
      const metadata = {};
      const actions = Array.from(element.querySelectorAll('.cci-wpc-demo-addon-action')).map(
        (link) => ({
          classes: Array.from(link.classList),
          href: link.getAttribute('href') || '',
          iconClasses: Array.from(link.querySelector('i.fa')?.classList || []),
          text: Array.from(link.querySelectorAll('span:not([aria-hidden="true"])'))
            .map((span) => span.textContent.trim())
            .filter(Boolean)
            .join(' '),
        }),
      );

      for (const item of element.querySelectorAll('.cci-wpc-demo-carousel-meta > div')) {
        const label = item.querySelector('dt')?.textContent?.trim();
        const value = item.querySelector('dd')?.textContent?.trim();

        if (label && value) {
          metadata[label] = value;
        }
      }

      return {
        title: element.querySelector('.cci-wpc-demo-addon-title')?.textContent?.trim(),
        package: element.querySelector('.cci-wpc-demo-addon-package')?.textContent?.trim(),
        tier: element.querySelector('.cci-wpc-demo-tier-badge')?.textContent?.trim(),
        type: element.querySelector('.cci-wpc-demo-addon-type')?.textContent?.trim(),
        useCase: element.querySelector('.cci-wpc-demo-use-case p')?.textContent?.trim(),
        metadata,
        hasCrown: Boolean(element.querySelector('.cci-wpc-demo-tier-badge-icon')),
        hasVersion: Boolean(element.querySelector('.cci-wpc-demo-addon-version')),
        hasDescription: Boolean(element.querySelector('.cci-wpc-demo-addon-description')),
        actions,
      };
    }),
  );
  const duplicateTitles = rows
    .map((row) => row.title)
    .filter((title, index, titles) => titles.indexOf(title) !== index);

  expect(duplicateTitles).toEqual([]);

  for (const row of rows) {
    expect(row.title).toBeTruthy();
    expect(row.package).toContain('CCI Posts Carousel');
    expect(row.tier).toMatch(/^(Free|Pro)$/);
    expect(row.type).toMatch(/^(Core plugin|Add-on|Integration|Template|Pro module)$/);
    expect(row.useCase).toBeTruthy();
    expect(row.metadata.Source).toBeTruthy();
    expect(row.metadata.Engine).toMatch(/^(Owl Carousel|Swiper)$/);
    expect(row.metadata.Template).toBeTruthy();
    expect(Object.keys(row.metadata).sort()).toEqual(['Engine', 'Source', 'Template']);
    expect(row.hasVersion).toBe(false);
    expect(row.hasDescription).toBe(false);
    expect(row.hasCrown).toBe(row.tier === 'Pro');
    expect(row.actions).toHaveLength(2);
    expect(
      row.actions.some(
        (link) =>
          link.text === 'Product page' &&
          link.classes.includes('cci-wpc-demo-addon-action-primary') &&
          link.iconClasses.includes('fa-shopping-bag') &&
          /^https:\/\/coolcatideas\.com\/products\/|^http:\/\/localhost:3000\/products\//.test(
            link.href,
          ),
      ),
    ).toBe(true);
    expect(
      row.actions.some(
        (link) =>
          link.text === 'Documentation' &&
          link.classes.includes('cci-wpc-demo-addon-action-success') &&
          link.iconClasses.includes('fa-book') &&
          /^https:\/\/coolcatideas\.com\/docs\/|^http:\/\/localhost:3000\/docs\//.test(link.href),
      ),
    ).toBe(true);
  }

  expect(rows.filter((row) => row.tier === 'Free')).toHaveLength(7);
  expect(rows.filter((row) => row.tier === 'Pro')).toHaveLength(4);
  expect(rows.some((row) => row.type === 'Core plugin')).toBe(true);
  expect(rows.some((row) => row.type === 'Template')).toBe(true);
  expect(rows.some((row) => row.type === 'Integration')).toBe(true);
  expect(rows.filter((row) => row.metadata.Template === 'Media Editorial')).toHaveLength(0);
  expect(
    rows.some(
      (row) =>
        row.title === 'Homepage Feature Story Cards' &&
        row.metadata.Template === 'Default Template' &&
        row.package === 'CCI Posts Carousel All In One' &&
        row.tier === 'Free' &&
        row.type === 'Core plugin',
    ),
  ).toBe(true);
  expect(
    rows.some(
      (row) => row.package === 'CCI Posts Carousel All In One' && row.type === 'Integration',
    ),
  ).toBe(true);
  expect(
    rows.some(
      (row) =>
        row.package === 'CCI Posts Carousel All In One Pro WooCommerce Merchandising Integration',
    ),
  ).toBe(false);
  await expect(page.locator('.cci-wpc-demo-media-editorial-video-feature')).toHaveCount(0);
  await expect(page.locator('.cci-wpc-demo-video-learning-reel')).toHaveCount(0);
  await expect(page.locator('.cci-wpc-demo-pro-video-showcase')).toHaveCount(1);
  await expect(page.locator('.cci-wpc-demo-pro-video-showcase-swiper')).toHaveCount(1);

  const desktopOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(desktopOverflow).toBe(0);

  await info.first().screenshot({
    path: path.join(screenshotDir, 'live-demo-carousel-info-desktop.png'),
  });

  await page.setViewportSize({ width: 390, height: 900 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.cci-wpc-demo-carousel-info').first()).toBeVisible();

  const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(mobileOverflow).toBe(0);

  await page
    .locator('.cci-wpc-demo-carousel-info')
    .first()
    .screenshot({
      path: path.join(screenshotDir, 'live-demo-carousel-info-mobile.png'),
    });
});

test('live demo long-form article embeds contextual carousels', async ({ page }) => {
  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 980 });
  await page.goto(demoUrl, { waitUntil: 'domcontentloaded' });

  const articleLink = page.getByRole('link', { name: 'WordPress carousel guide', exact: true });
  await expect(articleLink).toBeVisible();
  await expect(articleLink).toHaveAttribute('href', /wp-posts-carousel-long-form-demo/);

  const articleUrl = new URL('/wp-posts-carousel-long-form-demo/', demoUrl).toString();
  const response = await page.goto(articleUrl, { waitUntil: 'domcontentloaded' });
  expect(response.status()).toBe(200);
  await expect(
    page.getByRole('heading', {
      name: /CCI Posts Carousel: a practical WordPress carousel module/,
    }),
  ).toBeVisible();
  expect(await page.content()).not.toContain('[cci_posts_carousel');

  const rail = page.locator('.cci-wpc-demo-article-rail').first();
  const railCopy = rail.locator('.cci-wpc-demo-article-copy').first();
  const railAside = rail.locator('.cci-wpc-demo-article-aside').first();
  await rail.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const root = document.querySelector('.cci-wpc-demo-article-rail .cci-wpc-carousel');

    return (
      root &&
      window.getComputedStyle(root).visibility !== 'hidden' &&
      (root.querySelector('.owl-item.active .cci-wpc-slide') ||
        root.querySelector('.swiper-slide-active'))
    );
  });
  await expect(rail.locator('.cci-wpc-demo-article-unavailable')).toHaveCount(0);

  const railLayout = await rail.evaluate((element) => {
    const copy = element.querySelector('.cci-wpc-demo-article-copy').getBoundingClientRect();
    const aside = element.querySelector('.cci-wpc-demo-article-aside').getBoundingClientRect();

    return {
      asideLeft: aside.left,
      asideWidth: aside.width,
      copyRight: copy.right,
    };
  });
  expect(railLayout.asideLeft).toBeGreaterThan(railLayout.copyRight);
  expect(railLayout.asideWidth).toBeLessThanOrEqual(430);
  await expectContextualProductCarousel(rail);

  const article = await boxInfo(page.locator('.cci-wpc-demo-article').first());
  const videoSection = page.locator('.cci-wpc-demo-article-video').first();
  await videoSection.scrollIntoViewIfNeeded();
  const video = await boxInfo(videoSection);
  expect(video.width).toBeGreaterThan(article.width + 160);
  await expect(
    page.locator('.cci-wpc-demo-article-video .owl-item.active iframe').first(),
  ).toBeVisible();
  await expectActiveContentWithinRoot(
    videoSection.locator('.cci-wpc-carousel').first(),
    '.owl-item.active',
  );

  const products = page.locator('.cci-wpc-demo-article-products').first();
  await products.scrollIntoViewIfNeeded();
  await expect(products.locator('.cci-wpc-carousel').first()).toBeVisible();
  await expect(products.locator('.owl-prev, .cci-wpc-render-preview-prev').first()).toBeVisible();
  await expectActiveContentWithinRoot(
    products.locator('.cci-wpc-carousel').first(),
    '.owl-item.active',
  );

  const desktopOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(desktopOverflow).toBe(0);
  await page.screenshot({
    fullPage: true,
    path: path.join(screenshotDir, 'live-demo-long-form-article-desktop.png'),
  });

  await page.setViewportSize({ width: 390, height: 920 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(
    page.locator('.cci-wpc-demo-article-rail .cci-wpc-demo-article-aside'),
  ).toBeVisible();
  await rail.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const root = document.querySelector('.cci-wpc-demo-article-rail .cci-wpc-carousel');

    return (
      root &&
      window.getComputedStyle(root).visibility !== 'hidden' &&
      (root.querySelector('.owl-item.active .cci-wpc-slide') ||
        root.querySelector('.swiper-slide-active'))
    );
  });
  const mobileRail = await rail.evaluate((element) => {
    const copy = element.querySelector('.cci-wpc-demo-article-copy').getBoundingClientRect();
    const aside = element.querySelector('.cci-wpc-demo-article-aside').getBoundingClientRect();

    return {
      asideTop: aside.top,
      copyBottom: copy.bottom,
    };
  });
  expect(mobileRail.asideTop).toBeGreaterThan(mobileRail.copyBottom);
  await expectContextualProductCarousel(rail);
  const mobileVideoSection = page.locator('.cci-wpc-demo-article-video').first();
  await mobileVideoSection.scrollIntoViewIfNeeded();
  await expect(mobileVideoSection.locator('.owl-item.active iframe').first()).toBeVisible();
  await expectActiveContentWithinRoot(
    mobileVideoSection.locator('.cci-wpc-carousel').first(),
    '.owl-item.active',
  );
  const mobileProducts = page.locator('.cci-wpc-demo-article-products').first();
  await mobileProducts.scrollIntoViewIfNeeded();
  await expect(mobileProducts.locator('.cci-wpc-carousel').first()).toBeVisible();
  await expect(
    mobileProducts.locator('.owl-item.active, .swiper-slide-active').first(),
  ).toBeVisible();
  await expectActiveContentWithinRoot(
    mobileProducts.locator('.cci-wpc-carousel').first(),
    '.owl-item.active',
  );
  const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(mobileOverflow).toBe(0);
  await page.screenshot({
    fullPage: true,
    path: path.join(screenshotDir, 'live-demo-long-form-article-mobile.png'),
  });
});

test('live demo clickable elements expose template hover states', async ({ page }) => {
  await page.setViewportSize({ width: 1510, height: 1000 });
  await page.goto(demoUrl, { waitUntil: 'domcontentloaded' });

  await expectHoverChange(page, {
    root: '.cci-wpc-demo-default-visual',
    hover: '.owl-item.active .cci-wpc-more-button',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-default-visual',
    hover: '.owl-next',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-default-visual',
    hover: '.owl-item.active .cci-wpc-image a',
    target: '.owl-item.active .cci-wpc-image a img',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-popular-posts',
    hover: '.owl-item.active .cci-wpc-more-button',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-popular-posts',
    hover: '.owl-item.active .cci-wpc-image a',
    target: '.owl-item.active .cci-wpc-image a img',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-popular-posts',
    hover: '.owl-item.active .cci-wpc-categories a',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-popular-posts',
    hover: '.owl-item.active .cci-wpc-title a',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-popular-posts',
    hover: '.owl-next',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-popular-posts',
    hover: '.owl-dot:not(.active)',
    target: '.owl-dot:not(.active) span',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-light-editorial',
    hover: '.owl-item.active .cci-wpc-more-button',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-light-editorial',
    hover: '.owl-item.active .cci-wpc-image a',
    target: '.owl-item.active .cci-wpc-image a img',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-light-editorial',
    hover: '.owl-item.active .cci-wpc-categories a',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-campaign-strip-showcase',
    hover: '.owl-next',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-campaign-strip-showcase',
    hover: '.owl-dot:not(.active)',
    target: '.owl-dot:not(.active) span',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-pro-video-showcase',
    hover: '.owl-next',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-vertical-product-rail-showcase',
    hover: '.swiper-slide-active .cci-wpc-vertical-product-title a',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-vertical-product-rail-showcase',
    hover: '.swiper-slide-active .cci-wpc-vertical-product-meta-list a',
  });
  await expectHoverChange(page, {
    root: '.cci-wpc-demo-vertical-product-rail-showcase',
    hover: '.swiper-slide-active .cci-wpc-vertical-product-actions a',
  });
});
