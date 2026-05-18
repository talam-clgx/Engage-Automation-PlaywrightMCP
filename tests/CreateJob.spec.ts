import { test } from '@playwright/test';
import { performLogin } from './loginHelper';
import { CreateJobPage } from './pages/CreateJobPage';
import { BasePage } from './pages/BasePage';

// Generates Job names ---------
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

test.describe('Create Job Tests', () => {
  let storageState: any;

  test.beforeAll(async ({ browser }) => {
    storageState = await performLogin(browser);
  });

  test('Create_Job', async ({ browser }) => {
    const context = await browser.newContext({ storageState });
    let page = await context.newPage();
    const base = new BasePage(page);
    const createJob = new CreateJobPage(page);
    base.registerChildPopupHandler(context);
    page.on('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.dismiss().catch(() => {});
    });

    await page.goto('https://solitaire-ngs.net/DKI/Next/Home/');
    await page.waitForLoadState('domcontentloaded');
    await base.closeChildPages(context);
    await base.restoreMainPage();
    await base.handlePopups();

    await createJob.goto('https://solitaire-ngs.net/DKI/Module/Job/CreateJob.aspx');
    await base.closeChildPages(context);
    await base.restoreMainPage();
    await base.handlePopups();

    await createJob.fillJobName(nextAutomationName());
    // select the day before the current date (yesterday)
    const prevDate = new Date();
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDayStr = String(prevDate.getDate());
    // give the calendar a moment and close any popups if needed
    await base.handlePopups();
    await createJob.openCalendarAndSelectDay(prevDayStr);
    // short wait to allow any popups or navigations to settle
    await page.waitForTimeout(500);
    // recover if the page was closed by a popup handler or navigation
    if (page.isClosed && page.isClosed()) {
      const pages = context.pages();
      const newMain = pages.find(p => !p.isClosed());
      if (!newMain) throw new Error('Main page was closed and no replacement page found');
      page = newMain;
      // recreate page object wrappers for the new page
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newBase = new BasePage(page);
      // reassign createJob so subsequent calls use the active page
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newCreateJob = new CreateJobPage(page);
      await newBase.restoreMainPage();
      await newBase.handlePopups();
    }

    await createJob.selectLossTypeWater();
    await createJob.selectReportedByCustomer();
    await createJob.selectLossCategoryCommercial();
    await createJob.selectSourceOfLossFireHydrant();
    await createJob.selectJobSizeLarge();
    await createJob.chooseCustomer();
    await createJob.checkSameAsCustomer();
    await createJob.selectInternalParticipantAdmin();
    await createJob.selectInternalParticipantRobinson();
    await createJob.selectInternalParticipantPena();
    await createJob.selectInternalParticipantDhage();
    await createJob.selectExternalParticipantSquad();
    await createJob.checkWaterMitigation();
    await createJob.checkRoofing();
    await createJob.fillLossDescription('Test1', 'Test1Test2');
    await createJob.fillSpecialInstructions('Test3');

    await createJob.clickBasement();
    await createJob.clickToRight();
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await createJob.clickSave();

    await page.pause();

    await context.close();
  });
});