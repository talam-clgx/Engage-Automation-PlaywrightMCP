import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import {
  JOB_NAME_SELECTOR,
  OPEN_CALENDAR_LINK_NAME,
  LOSS_TYPE_ARROW_SELECTOR,
  LOSS_CATEGORY_ARROW_SELECTOR,
  SOURCE_OF_LOSS_ARROW_SELECTOR,
  JOB_SIZE_ARROW_SELECTOR,
  CUSTOMER_ARROW_SELECTOR,
  LOSS_TYPE_WATER,
  LOSS_CATEGORY_COMMERCIAL,
  SOURCE_FIRE_HYDRANT,
  JOB_SIZE_LARGE,
  CUSTOMER_CELL_NAME,
  SAME_AS_CUSTOMER_CHECKBOX,
  INTERNAL_PARTICIPANT_ADMIN,
  INTERNAL_PARTICIPANT_ROBINSON,
  INTERNAL_PARTICIPANT_PENA,
  INTERNAL_PARTICIPANT_DHAGE,
  EXTERNAL_PARTICIPANT_SQUAD,
  CHECKBOX_WATER_MITIGATION,
  CHECKBOX_ROOFING,
  LOSS_DESCRIPTION_FIELD,
  SPECIAL_INSTRUCTIONS_FIELD,
  BASEMENT_TEXT,
  TO_RIGHT_LINK,
  SAVE_BUTTON_NAME,
} from '../locators/CreateJob';

const INTERNAL_PARTICIPANT_SELECTORS = [
  'ctl00',
  'ctl01',
  'ctl02',
  'ctl03',
];

export class CreateJobPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async fillJobName(name: string) {
    await this.page.waitForSelector(JOB_NAME_SELECTOR, { state: 'visible', timeout: 30000 });
    await this.page.locator(JOB_NAME_SELECTOR).click();
    await this.page.locator(JOB_NAME_SELECTOR).fill(name);
  }

  async openCalendarAndSelectDay(dayStr: string) {
    await this.page.getByRole('link', { name: OPEN_CALENDAR_LINK_NAME, exact: true }).click();
    await this.handlePopups();
    await this.page.getByRole('link', { name: dayStr, exact: true }).click();
  }

  async selectLossTypeWater() {
    await this.page.locator(LOSS_TYPE_ARROW_SELECTOR).click();
    await this.page.getByText(LOSS_TYPE_WATER, { exact: true }).click();
  }

  async selectReportedByCustomer() {
    await this.page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_DropDown_ReportedBY_Arrow').click();
    await this.page
      .locator('#ctl00_ContentPlaceHolder1_JobParentInformation_GenaralInfo_DropDown_ReportedBY_DropDown')
      .getByText('Customer')
      .click();
  }

  async selectLossCategoryCommercial() {
    await this.page.locator(LOSS_CATEGORY_ARROW_SELECTOR).click();
    await this.page.getByText(LOSS_CATEGORY_COMMERCIAL).click();
  }

  async selectSourceOfLossFireHydrant() {
    await this.page.locator(SOURCE_OF_LOSS_ARROW_SELECTOR).click();
    await this.page.getByText(SOURCE_FIRE_HYDRANT).click();
  }

  async selectJobSizeLarge() {
    await this.page.locator(JOB_SIZE_ARROW_SELECTOR).click();
    await this.page.getByText(JOB_SIZE_LARGE, { exact: true }).click();
  }

  async chooseCustomer() {
    await this.page.locator(CUSTOMER_ARROW_SELECTOR).click();
    await this.page.getByRole('cell', { name: CUSTOMER_CELL_NAME }).click();
  }

  async checkSameAsCustomer() {
    await this.page.getByRole('checkbox', { name: SAME_AS_CUSTOMER_CHECKBOX }).check();
  }

  private internalParticipantSelector(index: number) {
    const participantKey = INTERNAL_PARTICIPANT_SELECTORS[index];
    return `#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_${participantKey}_EstimatorComboBox_Arrow`;
  }

  private internalParticipantDropdown(index: number) {
    const participantKey = INTERNAL_PARTICIPANT_SELECTORS[index];
    return `#ctl00_ContentPlaceHolder1_JobParentInformation_InternalParticpantsControl_InternalParticipantsList_${participantKey}_EstimatorComboBox_DropDown`;
  }

  async selectInternalParticipant(index: number, participantName: string) {
    await this.page.locator(this.internalParticipantSelector(index)).click();
    await this.page.locator(this.internalParticipantDropdown(index)).getByText(participantName).click();
  }

  async selectInternalParticipantAdmin() {
    await this.selectInternalParticipant(0, INTERNAL_PARTICIPANT_ADMIN);
  }

  async selectInternalParticipantRobinson() {
    await this.selectInternalParticipant(3, INTERNAL_PARTICIPANT_ROBINSON);
  }

  async selectInternalParticipantPena() {
    await this.selectInternalParticipant(1, INTERNAL_PARTICIPANT_PENA);
  }

  async selectInternalParticipantDhage() {
    await this.selectInternalParticipant(2, INTERNAL_PARTICIPANT_DHAGE);
  }

  async selectExternalParticipantSquad() {
    await this.page.locator('#ctl00_ContentPlaceHolder1_JobParentInformation_ExternalParticipants_SystemIndividualParticipantCombobox_4_Arrow').click();
    await this.page.getByText(EXTERNAL_PARTICIPANT_SQUAD).click();
  }

  async checkWaterMitigation() {
    await this.page.getByRole('checkbox', { name: CHECKBOX_WATER_MITIGATION }).check();
  }

  async checkRoofing() {
    await this.page.getByRole('checkbox', { name: CHECKBOX_ROOFING }).check();
  }

  async fillLossDescription(firstText: string, secondText: string) {
    const field = this.page.getByRole('textbox', { name: LOSS_DESCRIPTION_FIELD });
    await field.click();
    await field.fill(firstText);
    await field.press('Tab');
    await field.fill(secondText);
  }

  async fillSpecialInstructions(text: string) {
    await this.page.getByRole('textbox', { name: SPECIAL_INSTRUCTIONS_FIELD }).fill(text);
  }

  async clickBasement() {
    await this.page.getByText(BASEMENT_TEXT).click();
  }

  async clickToRight() {
    await this.page.getByRole('link', { name: TO_RIGHT_LINK }).click();
  }

  async clickSave() {
    await this.page.getByRole('button', { name: SAVE_BUTTON_NAME }).click();
  }
}
