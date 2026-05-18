import { BrowserContext, Page } from '@playwright/test';

// Reusable popup handlers for the framework

export async function closeAllPopups(page: Page) {
  const popupSelectors = [
    '[role="dialog"] [aria-label="Close"]',
    '[role="dialog"] button:has-text("Close")',
    '[role="dialog"] button:has-text("Cancel")',
    '.ui-dialog-titlebar-close',
    '.k-window-action .k-i-close',
    '.modal-header button.close',
    '.modal button.close',
    '[aria-label="Close"]',
    'button:has-text("Close")',
    'button:has-text("Cancel")',
    'button:has-text("No")',
    'button:has-text("Yes")',
    'button:has-text("Ok")',
    'button:has-text("OK")',
    'button:has-text("×")',
  ];

  for (const selector of popupSelectors) {
    const locator = page.locator(selector);
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
      const element = locator.nth(i);
      if (await element.isVisible()) {
        await element.click({ force: true }).catch(() => {});
      }
    }
  }
}

export async function removePopupOverlays(page: Page) {
  await page.evaluate(() => {
    const selectors = [
      '[role="dialog"]',
      '.modal',
      '.ui-dialog',
      '.k-overlay',
      '.popup',
      '.rwWindow',
      '.radWindow',
      '.jqmWindow',
      '.overlay',
      '#walkme-overlay-all',
      '[id*=\"walkme\"]',
      '[class*=\"walkme\"]',
      '[data-walkme]',
    ];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });
  });
}

export async function handlePagePopups(page: Page) {
  for (let i = 0; i < 5; i++) {
    await closeAllPopups(page);
    await removePopupOverlays(page);
    await page.waitForTimeout(300);
  }
}


// Reusable child page handlers for the framework---

export function registerChildPopupHandler(context: BrowserContext, mainPage: Page) {
  context.on('page', async newPage => {
    if (newPage === mainPage) return;
    await newPage.waitForLoadState('domcontentloaded').catch(() => {});
    await newPage.close().catch(() => {});
  });
}

export async function closeChildPages(context: BrowserContext, mainPage: Page) {
  for (const otherPage of context.pages()) {
    if (otherPage !== mainPage && !otherPage.isClosed()) {
      await otherPage.close().catch(() => {});
    }
  }
}

export async function restoreMainPage(mainPage: Page) {
  await mainPage.bringToFront().catch(() => {});
  await mainPage.waitForLoadState('domcontentloaded').catch(() => {});
}
