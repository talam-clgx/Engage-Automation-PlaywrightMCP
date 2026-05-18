import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import {
  DASH_SUPPORT_SELECTOR,
  WELCOME_TEXT,
  USER_BOLD_FILTER,
} from '../locators/dashLocators';

export class DashPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openHome() {
    await this.goto('https://solitaire-ngs.net/DKI/Next/Home/');
  }

  async openSupportMenu() {
    await this.page.locator(DASH_SUPPORT_SELECTOR).click();
  }

  async clickWelcomeText() {
    await this.page.getByText(WELCOME_TEXT).click();
  }

  async clickUserBoldFilter() {
    await this.page.locator('b').filter({ hasText: new RegExp(USER_BOLD_FILTER) }).click();
  }
}
