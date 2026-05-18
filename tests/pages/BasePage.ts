import { Page, BrowserContext } from '@playwright/test';
import {
  handlePagePopups,
  closeChildPages,
  restoreMainPage,
  registerChildPopupHandler,
} from '../windowUtils';

export class BasePage {
  constructor(public page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async handlePopups() {
    await handlePagePopups(this.page);
  }

  async closeChildPages(context: BrowserContext) {
    await closeChildPages(context, this.page);
  }

  async restoreMainPage() {
    await restoreMainPage(this.page);
  }

  registerChildPopupHandler(context: BrowserContext) {
    registerChildPopupHandler(context, this.page);
  }
}
