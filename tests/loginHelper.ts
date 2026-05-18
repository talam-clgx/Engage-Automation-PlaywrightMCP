import { Browser } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

export async function performLogin(browser: Browser): Promise<any> {
  return LoginPage.performLogin(browser);
}
