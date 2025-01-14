# 01 Config

In this example we are going to add a basic setup needed to support end to end testing with Playwright.

We will start from `00-boilerplate`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

# Libraries

We are going to install the main library which we base all our unit tests, [Playwright](https://playwright.dev/).

```bash
npm init playwright@latest
```

The previous command will ask us to install and add the default configuration for the project:

- Where to put your end-to-end tests? · e2e
- Add a GitHub Actions workflow? (y/N) · false
- Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true

> Review `playwright.config.ts` file
>
> Review `e2e` folder
>
> Remove `tests-examples` folder

We can just add the `e2e` command for development:

_./package.json_

```diff
"scripts": {
...
    "postinstall": "cd ./server && npm install",
+   "test:e2e": "playwright test --ui"
  },
```

Run it:

```bash
npm run test:e2e
```

Update `baseUrl` and `webServer` in playwright config:

_./playwright.config.ts_

```diff
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

+ const BASE_URL = 'http://localhost:8080';

export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
-   // baseURL: 'http://127.0.0.1:3000',
+   baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
- // webServer: {
- //   command: 'npm run start',
- //   url: 'http://127.0.0.1:3000',
- //   reuseExistingServer: !process.env.CI,
- // },
+ webServer: {
+   command: 'npm start',
+   url: BASE_URL,
+   reuseExistingServer: !process.env.CI,
+ },
});

```

> [Web server config](https://playwright.dev/docs/api/class-testconfig#test-config-web-server)

Add `hotel-collection` specs inside `e2e` folder:

_./e2e/hotel-collection.spec.ts_

```javascript
import { test, expect } from "@playwright/test";

test("should fetch hotel list and show it in screen when visit /hotel-collection url", async ({
  page,
}) => {
  // Arrange

  // Act
  await page.goto("#/hotel-collection");

  // Assert
  await expect(page.getByRole("listitem")).toHaveCount(10);
});
```

> Remove `example.spec.ts` file
>
> Notice that we are using `JavaScript async/await` syntax to handle promises.

Running:

```bash
npm run test:e2e

```

Since playwright is making screenshots of the current page state, sometimes it looks like the page is not loading properly, but it's just the screenshot that is taken too early.

For a better experience, you can add breakpoints in your tests and use the `JavaScript Debug Terminal` to run:

```bash
npm run test:e2e

```

When we have to use a real backend server and there is a slow connection (we will simulate it with a delay):

_./server/src/index.ts_

```diff
app.get('/api/hotels', async (context) => {
+ await delay(6000);
  return context.json(db.hotels);
});

```

> By default the timeout is 5 seconds, so we need to increase it.

We can wait for the request to finish before asserting:

_./e2e/hotel-collection.spec.ts_

```diff
import { test, expect } from "@playwright/test";

test("should fetch hotel list and show it in screen when visit /hotel-collection url", async ({
  page,
}) => {
  // Arrange

  // Act
  await page.goto("#/hotel-collection");

  // Assert
+ await page.waitForResponse('/api/hotels');
  await expect(page.getByRole("listitem")).toHaveCount(10);
});
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
