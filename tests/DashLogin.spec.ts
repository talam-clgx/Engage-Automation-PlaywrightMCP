import { test, chromium } from '@playwright/test';
import { performLogin } from './loginHelper';

test.describe('Login Tests', () => {
  let storageState: any;

  test.beforeAll(async ({ browser }) => {
    storageState = await performLogin(browser);
  });

  test('Dash_Login', async ({ browser }) => {
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    await page.goto('https://solitaire-ngs.net/DKI/Next/Home/');
    // Add assertions or further steps if needed
    await context.close();
  });

  test('LoginPage_Validation', async ({ browser }) => {
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    await page.goto('https://solitaire-ngs.net/DKI/Next/Home/');
    await page.locator('.sprite-dash-support').click();
    await page.getByText('Welcome').click();
    await page.locator('b').filter({ hasText: /^User$/ }).click();
    await page.goto('https://solitaire-ngs.net/DKI/Next/Home/');
    await page.goto('https://solitaire-ngs.net/DKI/Next/Home/');
    await context.close();
  });
});