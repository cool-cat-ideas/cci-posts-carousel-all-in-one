import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'dist', 'playwright-screenshots');
const baseUrl = process.env.WPC_WP_URL || 'http://localhost:4060';
const username = process.env.WPC_WP_USER || '';
const password = process.env.WPC_WP_PASS || '';
const adminUrl = `${baseUrl}/wp-admin/admin.php?page=cci-posts-carousel`;
const executablePath =
  process.env.PLAYWRIGHT_CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!username || !password) {
  throw new Error('Set WPC_WP_USER and WPC_WP_PASS before running the visual admin check.');
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath,
});
const context = await browser.newContext({
  viewport: { width: 1600, height: 1200 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
page.setDefaultTimeout(45000);

try {
  await login();
  await capture('01-dashboard');

  await openSection(/Templates|Szablony/i);
  await capture('02-templates');

  await openSection(/Integrations|Integracje/i);
  await capture('03-integrations');

  await openSection(/Settings|Ustawienia/i);
  await capture('04-settings');

  await page.goto(`${adminUrl}&action=add-new`, { waitUntil: 'domcontentloaded' });
  await waitForApp();
  await capture('05-builder-general');

  await clickFirst('.cci-wpc-builder-tab', /Design|Wygląd|Projekt/i);
  await capture('06-builder-design');

  const report = await layoutReport();
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}

async function login() {
  await page.goto(`${baseUrl}/wp-login.php`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');
  await page.waitForURL(/wp-admin/, { timeout: 45000 });
  await page.goto(adminUrl, { waitUntil: 'domcontentloaded' });
  await waitForApp();
}

async function waitForApp() {
  await page.waitForSelector('.cci-wpc-admin', { timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(700);
}

async function openSection(pattern) {
  await clickFirst('.cci-wpc-dashboard-nav-item', pattern);
  await waitForApp();
}

async function clickFirst(selector, pattern) {
  const locator = page.locator(selector).filter({ hasText: pattern }).first();
  await locator.waitFor({ state: 'visible' });
  await locator.click();
}

async function capture(name) {
  await waitForApp();
  const file = path.join(outputDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`saved ${file}`);
}

async function layoutReport() {
  return page.evaluate(() => {
    const selectors = [
      '.cci-wpc-product-card',
      '.cci-wpc-template-card',
      '.cci-wpc-ui-button',
      '.cci-wpc-ui-select-trigger',
      '.cci-wpc-ui-input',
    ];
    const overflowing = [];

    for (const selector of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        if (
          element.scrollWidth > element.clientWidth + 2 ||
          element.scrollHeight > element.clientHeight + 2
        ) {
          overflowing.push({
            selector,
            text: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 90),
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            clientHeight: element.clientHeight,
            scrollHeight: element.scrollHeight,
          });
        }

        if (overflowing.length >= 12) {
          break;
        }
      }

      if (overflowing.length >= 12) {
        break;
      }
    }

    return {
      url: window.location.href,
      viewport: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      },
      documentWidth: document.documentElement.scrollWidth,
      horizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      overflowing,
    };
  });
}
