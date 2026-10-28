const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const webpack = require('webpack');
const { chromium, expect } = require('playwright/test');

const productRoot = path.resolve(__dirname, '../..');
let browser, temporaryDirectory;
before(async () => {
  temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'cci-query-search-'));
  await new Promise((resolve, reject) => {
    const compiler = webpack({
      context: productRoot,
      mode: 'development',
      devtool: false,
      entry: path.join(__dirname, 'fixtures/query-search.jsx'),
      output: { path: temporaryDirectory, filename: 'fixture.js' },
      resolve: { extensions: ['.js', '.jsx', '.mjs', '.json'] },
      module: {
        rules: [
          { test: /\.jsx?$/, exclude: /node_modules/, loader: require.resolve('babel-loader') },
        ],
      },
    });
    compiler.run((error, stats) =>
      compiler.close((closeError) => {
        if (error || closeError || stats.hasErrors())
          reject(error || closeError || new Error(stats.toString({ all: false, errors: true })));
        else resolve();
      }),
    );
  });
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox'],
  });
});
after(async () => {
  await browser?.close();
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true });
});

async function fixture(handler) {
  const page = await browser.newPage();
  await page.route('https://query.test/', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><div id="root"></div>' }),
  );
  await page.route('https://query.test/site/**', async (route) => {
    const url = new URL(route.request().url());
    assert.ok(url.searchParams.get('rest_route').startsWith('/wp-posts-carousel/v1/admin/'));
    assert.equal(route.request().headers()['x-wp-nonce'], 'test-nonce');
    await handler(route, route.request().postDataJSON(), url.searchParams.get('rest_route'));
  });
  await page.goto('https://query.test/');
  await page.evaluate(() => {
    window.wpPostsCarouselPluginData = {
      restRoot: 'https://query.test/site/?rest_route=/',
      nonce: 'test-nonce',
    };
  });
  await page.addScriptTag({ path: path.join(temporaryDirectory, 'fixture.js') });
  return page;
}

const term = { value: '42', label: 'Łódź & News', post_type: 'category' };

const post = (label) => ({ value: '64', label, post_type: 'post' });

function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

test('categories work through a plain-permalink REST root and keyboard selection', async () => {
  const requests = [];
  const page = await fixture(async (r, body) => {
    requests.push(body);
    await r.fulfill({ json: [term] });
  });
  try {
    const input = page.getByRole('combobox', { name: 'Search categories' });
    await input.fill('Łódź & News');
    await expect(page.getByRole('option', { name: term.label })).toBeVisible();
    await input.press('ArrowDown');
    await input.press('Enter');
    await expect(page.getByLabel('Selected terms')).toHaveText(term.label);
    assert.equal(requests.at(-1).taxonomy, 'category');
    assert.equal(requests.at(-1).s, 'Łódź & News');
  } finally {
    await page.close();
  }
});
test('numeric-keyed term responses from older integrations remain selectable', async () => {
  const page = await fixture((r) => r.fulfill({ json: { 9: term } }));
  try {
    await page.getByRole('combobox', { name: 'Search categories' }).click();
    await page.getByRole('option', { name: term.label }).click();
    await expect(page.getByLabel('Selected terms')).toHaveText(term.label);
  } finally {
    await page.close();
  }
});
test('denied term searches explain HTTP 403 and retry without blurring the field', async () => {
  let attempts = 0;
  const page = await fixture((r) =>
    ++attempts === 1
      ? r.fulfill({ status: 403, json: { code: 'rest_forbidden', message: 'Denied.' } })
      : r.fulfill({ json: [term] }),
  );
  try {
    await page.getByRole('combobox', { name: 'Search categories' }).click();
    await expect(page.getByText(/Term search was denied \(HTTP 403\)/)).toBeVisible();
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByRole('option', { name: term.label })).toBeVisible();
    assert.equal(attempts, 2);
  } finally {
    await page.close();
  }
});
test('expired WordPress nonces show a sign-in instruction', async () => {
  const page = await fixture((r) =>
    r.fulfill({
      status: 403,
      json: { code: 'rest_cookie_invalid_nonce', message: 'Cookie check failed.' },
    }),
  );
  try {
    await page.getByRole('combobox', { name: 'Search categories' }).click();
    await expect(
      page.getByText('Your session has expired. Reload the page and sign in again.'),
    ).toBeVisible();
  } finally {
    await page.close();
  }
});
test('server failures are shown separately from an empty search', async () => {
  const page = await fixture((r) =>
    r.fulfill({ status: 503, json: { code: 'terms_unavailable', message: 'Unavailable.' } }),
  );
  try {
    await page.getByRole('combobox', { name: 'Search categories' }).fill('missing');
    await expect(
      page.getByText('The server could not load terms. Check the server logs and try again.'),
    ).toBeVisible();
    await expect(page.getByText('No matching terms.')).toHaveCount(0);
  } finally {
    await page.close();
  }
});
test('a slow category request cannot overwrite results after switching taxonomy', async () => {
  const old = deferred();
  let oldStarted = false;
  const page = await fixture(async (r, body) => {
    if (body.taxonomy === 'category') {
      oldStarted = true;
      await old.promise;
      await r.fulfill({ json: [term] }).catch(() => {});
    } else
      await r.fulfill({ json: [{ value: '43', label: 'Current tag', post_type: 'post_tag' }] });
  });
  try {
    await page.getByRole('combobox', { name: 'Search categories' }).click();
    await expect.poll(() => oldStarted).toBe(true);
    await page.getByRole('button', { name: 'Switch to tags' }).click();
    await page.getByRole('combobox', { name: 'Search tags' }).click();
    await expect(page.getByRole('option', { name: 'Current tag' })).toBeVisible();
    old.resolve();
    await expect(page.getByRole('option', { name: term.label })).toHaveCount(0);
  } finally {
    old.resolve();
    await page.close();
  }
});
test('slower manual-post searches cannot replace newer results', async () => {
  const old = deferred();
  let oldStarted = false;
  const page = await fixture(async (r, body) => {
    if (body.s === 'older') {
      oldStarted = true;
      await old.promise;
      await r.fulfill({ json: [post('Old post')] }).catch(() => {});
    } else await r.fulfill({ json: [post('Current post')] });
  });
  try {
    const input = page.getByLabel('Add specific post');
    await input.fill('older');
    await expect.poll(() => oldStarted).toBe(true);
    await input.fill('current');
    await expect(page.getByRole('button', { name: /Current post/ })).toBeVisible();
    old.resolve();
    await expect(page.getByRole('button', { name: /Old post/ })).toHaveCount(0);
    assert.deepEqual(await page.evaluate(() => window.searchNotices), []);
  } finally {
    old.resolve();
    await page.close();
  }
});
test('clearing a pending post search prevents its results from reappearing', async () => {
  const pending = deferred();
  let started = false;
  const page = await fixture(async (r) => {
    started = true;
    await pending.promise;
    await r.fulfill({ json: [post('Old post')] }).catch(() => {});
  });
  try {
    const input = page.getByLabel('Add specific post');
    await input.fill('older');
    await expect.poll(() => started).toBe(true);
    await input.fill('');
    pending.resolve();
    await expect(page.getByRole('button', { name: /Old post/ })).toHaveCount(0);
    await input.fill('a');
    await expect(page.getByText('Searching...', { exact: true })).toHaveCount(0);
    assert.deepEqual(await page.evaluate(() => window.searchNotices), []);
  } finally {
    pending.resolve();
    await page.close();
  }
});
