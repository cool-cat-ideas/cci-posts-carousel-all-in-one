const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const webpack = require('webpack');
const { chromium, expect } = require('playwright/test');

const productRoot = path.resolve(__dirname, '../..');
const feedEndpoint = 'https://marketplace.test/feed';
const currentFeed = { news: [{ id: 1, title: 'Published product news' }], _meta: { ok: true } };
let browser;
let temporaryDirectory;

before(async () => {
  temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'wpc-marketplace-regression-'));
  await new Promise((resolve, reject) => {
    const compiler = webpack({
      context: productRoot,
      mode: 'development',
      devtool: false,
      entry: path.join(__dirname, 'fixtures/marketplace-feed.jsx'),
      output: { path: temporaryDirectory, filename: 'fixture.js' },
      resolve: { extensions: ['.js', '.jsx', '.json'] },
      module: {
        rules: [
          { test: /\.jsx?$/, exclude: /node_modules/, loader: require.resolve('babel-loader') },
        ],
      },
    });
    compiler.run((error, stats) =>
      compiler.close((closeError) => {
        if (error || closeError || stats.hasErrors()) {
          reject(error || closeError || new Error(stats.toString({ all: false, errors: true })));
        } else {
          resolve();
        }
      }),
    );
  });
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  });
});

after(async () => {
  await browser?.close();
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true });
});

async function openFixture(initialFeed, onRequest) {
  const page = await browser.newPage();
  await page.route('https://marketplace.test/', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><div id="root"></div>',
    }),
  );
  await page.route(/https:\/\/marketplace\.test\/feed(?:\?|$)/, onRequest);
  await page.goto('https://marketplace.test/');
  await page.evaluate(
    ({ endpoint, initial }) => {
      window.wpPostsCarouselPluginData = {
        newsEndpoint: endpoint,
        marketplaceFeedEndpoint: endpoint,
        marketplaceInitialFeed: initial,
        nonce: 'test-nonce',
      };
    },
    { endpoint: feedEndpoint, initial: initialFeed },
  );
  await page.addScriptTag({ path: path.join(temporaryDirectory, 'fixture.js') });
  return page;
}

function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

test('a valid hydrated feed stays visible during the initial background refresh', async () => {
  const response = deferred();
  const requests = [];
  const page = await openFixture(currentFeed, async (route) => {
    requests.push(route.request());
    await route.fulfill({ json: await response.promise });
  });
  try {
    await expect.poll(() => requests.length).toBe(1);
    await expect(page.getByRole('heading', { name: 'Published product news' })).toBeVisible();
    await expect(page.getByText('Product updates could not be loaded.')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Retry now' })).toHaveCount(0);
    await page.waitForFunction(() => window.marketplaceState?.retrying === false);
    response.resolve(currentFeed);
    await page.waitForFunction(() => window.marketplaceState?.loading === false);
    assert.equal(requests[0].headers()['x-wp-nonce'], 'test-nonce');
  } finally {
    response.resolve(currentFeed);
    await page.close();
  }
});

test('stale bootstrap fetches fresh data immediately without manual Retry', async () => {
  const response = deferred();
  const requests = [];
  const stale = {
    ...currentFeed,
    _meta: { ok: false, stale: true, source: 'bootstrap-stale-cache' },
  };
  const page = await openFixture(stale, async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ json: await response.promise });
  });
  try {
    await expect.poll(() => requests.length).toBe(1);
    assert.equal(new URL(requests[0]).searchParams.get('force'), '1');
    await expect(page.getByText('Loading updates...')).toBeVisible();
    await expect(page.getByText('No product updates yet.')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Retry now' })).toHaveCount(0);
    response.resolve(currentFeed);
    await expect(page.getByRole('heading', { name: 'Published product news' })).toBeVisible();
  } finally {
    response.resolve(currentFeed);
    await page.close();
  }
});

test('a first visit without bootstrap stays loading until the feed is received', async () => {
  const response = deferred();
  const page = await openFixture(null, async (route) =>
    route.fulfill({ json: await response.promise }),
  );
  try {
    await expect(page.getByText('Loading updates...')).toBeVisible();
    await expect(page.getByText('No product updates yet.')).toHaveCount(0);
    response.resolve(currentFeed);
    await expect(page.getByRole('heading', { name: 'Published product news' })).toBeVisible();
  } finally {
    response.resolve(currentFeed);
    await page.close();
  }
});

test('a successful empty feed displays the empty state without an error', async () => {
  const page = await openFixture(null, (route) =>
    route.fulfill({ json: { news: [], _meta: { ok: true } } }),
  );
  try {
    await expect(page.getByText('No product updates yet.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry now' })).toHaveCount(0);
  } finally {
    await page.close();
  }
});

test('an unavailable feed without error text is not reported as an empty publication list', async () => {
  let calls = 0;
  const urls = [];
  const page = await openFixture(null, (route) => {
    urls.push(route.request().url());
    return route.fulfill({
      json: ++calls === 1 ? { news: [], _meta: { ok: false } } : currentFeed,
    });
  });
  try {
    await expect(page.getByText('Product updates could not be loaded.')).toBeVisible();
    await expect(page.getByText('No product updates yet.')).toHaveCount(0);
    await page.getByRole('button', { name: 'Retry now' }).click();
    await expect(page.getByRole('heading', { name: 'Published product news' })).toBeVisible();
    assert.equal(new URL(urls[1]).searchParams.get('force'), '1');
  } finally {
    await page.close();
  }
});

test('a response missing the news array is unavailable, never a successful empty feed', async () => {
  for (const payload of [null, { product: { slug: 'carousel' } }]) {
    const page = await openFixture(null, (route) =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(payload) }),
    );
    try {
      await expect(page.getByText('Product updates could not be loaded.')).toBeVisible();
      await expect(page.getByText('No product updates yet.')).toHaveCount(0);
    } finally {
      await page.close();
    }
  }
});

test('a pending request cannot schedule retries after the panel unmounts', async () => {
  const response = deferred();
  let calls = 0;
  const page = await openFixture(null, async (route) => {
    ++calls;
    await route.fulfill({ json: await response.promise });
  });
  try {
    await expect.poll(() => calls).toBe(1);
    await page.clock.install();
    await page.evaluate(() => window.unmountMarketplace());
    const finished = page.waitForResponse((url) => url.url().includes('/feed'));
    response.resolve({ news: [], _meta: { ok: false } });
    await (await finished).finished();
    await page.clock.runFor(120001);
    assert.equal(calls, 1);
  } finally {
    response.resolve(currentFeed);
    await page.close();
  }
});
