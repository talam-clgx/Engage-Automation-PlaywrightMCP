import { test } from '@playwright/test';
import { performLogin } from './loginHelper';
import { DashPage } from './pages/DashPage';

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
    const dash = new DashPage(page);

    await dash.openHome();
    await dash.openSupportMenu();
    await dash.clickWelcomeText();
    await dash.clickUserBoldFilter();
    await dash.openHome();
    await dash.openHome();
    await context.close();
  });
});