import { Browser } from '@playwright/test';
import { BasePage } from './BasePage';
import {
  COMPANY_ID_LABEL,
  USER_NAME_LABEL,
  PASSWORD_LABEL,
  LOGIN_BUTTON_NAME,
} from '../locators/loginLocators';

export class LoginPage {
  static async performLogin(browser: Browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const base = new BasePage(page);

    await base.goto('https://solitaire-ngs.net/DKI/Module/User/Login.aspx');
    await page.getByRole('textbox', { name: COMPANY_ID_LABEL }).fill('73732');
    await page.getByRole('textbox', { name: USER_NAME_LABEL }).fill('usertest');
    await page.getByRole('textbox', { name: PASSWORD_LABEL }).fill('123456Ab');
    await page.getByRole('button', { name: LOGIN_BUTTON_NAME }).click();
    await page.waitForURL('https://solitaire-ngs.net/DKI/Next/Home/');

    const storageState = await context.storageState();
    await context.close();
    return storageState;
  }
}
