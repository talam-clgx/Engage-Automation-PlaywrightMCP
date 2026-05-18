import { BrowserContext, Page, Browser } from '@playwright/test';

export async function performLogin(browser: Browser): Promise<any> {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://solitaire-ngs.net/DKI/Module/User/Login.aspx');
  await page.getByRole('textbox', { name: 'Company ID' }).fill('73732');
  await page.getByRole('textbox', { name: 'User Name' }).fill('usertest');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456Ab');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL('https://solitaire-ngs.net/DKI/Next/Home/');
  
  const storageState = await context.storageState();
  await context.close();
  
  return storageState;
}
