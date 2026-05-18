import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  //Arrange
  await page.goto('https://playwright.dev/');

  //Act
  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  //Assert
  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  await page.goto('https://solitaire-ngs.net/DKI/Module/User/Login.aspx');
  await page.getByRole('textbox', { name: 'Company ID' }).click();
  await page.getByRole('textbox', { name: 'Company ID' }).fill('73732');
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill('usertest');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('textbox', { name: 'Password' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456Ab');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('https://solitaire-ngs.net/DKI/Next/Home/');
  await page.getByRole('link', { name: '#', exact: true }).click();
  await page.locator('#border-1bb8cfc0-a8ea-ef81-1b1a-90df65fb452f').click();
  await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_comboBox_LossCategory_Arrow').click();
  await page.getByText('commercial').click();await page.getByText('commercial').click();
});
