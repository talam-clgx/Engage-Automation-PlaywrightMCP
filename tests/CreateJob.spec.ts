import { test, Page, BrowserContext } from '@playwright/test';
import { performLogin } from './loginHelper';

// Generates names like `Automation18/05/2026(1)`, `Automation18/05/2026(2)`, ...
let automationCounter = 0;
let automationDate = '';
function nextAutomationName() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  const formattedDate = `${day}/${month}/${year}`;
  if (automationDate !== formattedDate) {
    automationDate = formattedDate;
    automationCounter = 0;
  }
  automationCounter += 1;
  return `TestAutomation${formattedDate}(${automationCounter})`;
}

async function closeAllPopups(page: Page) {
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

async function removePopupOverlays(page: Page) {
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
      '[id*="walkme"]',
      '[class*="walkme"]',
      '[data-walkme]',
    ];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });
  });
}

async function handlePagePopups(page: Page) {
  for (let i = 0; i < 5; i++) {
    await closeAllPopups(page);
    await removePopupOverlays(page);
    await page.waitForTimeout(300);
  }
}

function registerChildPopupHandler(context: BrowserContext, mainPage: Page) {
  context.on('page', async newPage => {
    if (newPage === mainPage) return;
    await newPage.waitForLoadState('domcontentloaded').catch(() => {});
    await newPage.close().catch(() => {});
  });
}

async function closeChildPages(context: BrowserContext, mainPage: Page) {
  for (const otherPage of context.pages()) {
    if (otherPage !== mainPage && !otherPage.isClosed()) {
      await otherPage.close().catch(() => {});
    }
  }
}

async function restoreMainPage(mainPage: Page) {
  await mainPage.bringToFront().catch(() => {});
  await mainPage.waitForLoadState('domcontentloaded').catch(() => {});
}

test.describe('Create Job Tests', () => {
  let storageState: any;

  test.beforeAll(async ({ browser }) => {
    storageState = await performLogin(browser);
  });

  test('Create_Job', async ({ browser }) => {
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();
    registerChildPopupHandler(context, page);
    page.on('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.dismiss().catch(() => {});
    });

    await page.goto('https://solitaire-ngs.net/DKI/Next/Home/');
    await page.waitForLoadState('domcontentloaded');
    await closeChildPages(context, page);
    await restoreMainPage(page);
    await handlePagePopups(page);

    await page.goto('https://solitaire-ngs.net/DKI/Module/Job/CreateJob.aspx');
    await page.waitForLoadState('domcontentloaded');
    await closeChildPages(context, page);
    await restoreMainPage(page);
    await handlePagePopups(page);
    await page.waitForSelector('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_JobNameRadTextBox', { state: 'visible', timeout: 30000 });
    await closeChildPages(context, page);
    await restoreMainPage(page);
    await handlePagePopups(page);

    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_JobNameRadTextBox').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_JobNameRadTextBox').fill(nextAutomationName());
    await page.getByRole('link', { name: 'Open the Calendar Popup', exact: true }).click();
    // select the day before the current date (yesterday)
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDayStr = String(prevDate.getDate());
    // give the calendar a moment and close any popups if needed
    await handlePagePopups(page);
    await page.getByRole('link', { name: prevDayStr }).click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_comboBox_LossType_Arrow').click();
    await page.getByText('Water', { exact: true }).click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_DropDown_ReportedBY_Arrow').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_DropDown_ReportedBY_DropDown').getByText('Customer').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_comboBox_LossCategory_Arrow').click();
    await page.getByText('commercial').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_SourceOfLossComboBox_Arrow').click();
    await page.getByText('Fire Hydrant').click();
    
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_JobSizeComboBox_Arrow').click();
    await page.getByText('Large', { exact: true }).click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_DropDown_Customer_Arrow').click();
    await page.getByRole('cell', { name: 'Broker, Billy (BROKER COMPANY)' }).click();
    await page.getByRole('checkbox', { name: 'Same as Customer Address' }).check();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_ctl00_EstimatorComboBox_Arrow').click();
    await page.getByText('Admin, NGS').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_ctl03_EstimatorComboBox_Arrow').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_ctl03_EstimatorComboBox_DropDown').getByText('Robinson, Bill').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_ctl01_EstimatorComboBox_Arrow').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_ctl01_EstimatorComboBox_DropDown').getByText('Pena, Sue').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_ctl02_EstimatorComboBox_Arrow').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_ctl02_EstimatorComboBox_DropDown').getByText('dhage, Aboli').click();
    await page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_ExternalParticipants_SystemIndividualParticipantCombobox_4_Arrow').click();
    await page.getByText('Squad, Rogue').click();
    await page.getByRole('checkbox', { name: 'Water Mitigation' }).check();
    await page.getByRole('checkbox', { name: 'Roofing' }).check();
    await page.getByRole('textbox', { name: 'Enter Loss Description' }).click();
    await page.getByRole('textbox', { name: 'Enter Loss Description' }).fill('Test1');
    await page.getByRole('textbox', { name: 'Enter Loss Description' }).press('Tab');
    await page.getByRole('textbox', { name: 'Enter Loss Description' }).fill('Test1Test2');
    await page.getByRole('textbox', { name: 'Enter Special Instructions' }).fill('Test3');

    await page.getByText('Basement').click();
    await page.getByRole('link', { name: 'To Right' }).click();
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Save & Go to Slideboard' }).click();

    await page.pause();

    await context.close();
  });
});