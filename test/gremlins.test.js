const { test } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, '../config/.env'),
});

const BASE_URL = process.env.FRONT_URL;

if (!BASE_URL) {
  throw new Error('❌ FRONT_URL not found');
}

test.use({ headless: false });

test('run gremlins.ts', async ({ page }) => {
  test.setTimeout(0);

  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

  await page.addInitScript({
    path: path.resolve(__dirname, '../node_modules/gremlins.js/dist/gremlins.min.js'),
  });

  await page.goto(`${BASE_URL}/auth`);
  await page.fill('#email', 'admin@admin.com');
  await page.fill('#password', 'admin');
  await page.click('button[type="submit"]');

  await page.evaluate(() =>
    gremlins
      .createHorde({
        callbacks: {
          onBeforeUnleash: () => console.log('Gremlins: Initiating attack'),
          onAfterUnleash: () => console.log('Gremlins: Attack completed'),
          onError: (err) => console.error('Gremlins: Error detected', err),

          onBeforeAction: (gremlin, action) => console.log('Before action:', action),
          onAfterAction: (gremlin, action) => console.log('After action:', action),
        },
        strategies: [
          gremlins.strategies.allTogether({
            nb: 100000,
            delay: 32,
          }),
        ],
        randomizer: new gremlins.Chance(123456789),
      })
      .unleash()
  );
});
