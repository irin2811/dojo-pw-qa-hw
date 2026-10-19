import { Page } from '@playwright/test';

export async function fillContactForm(page: Page, data: {
  name?: string;
  email?: string;
  message?: string;
  topic?: string;
  priority?: string;
  attachment?: string;
  copyMe?: boolean;
}) {
  if (data.name) {
    await page.getByTestId('contact-name').fill(data.name);
  }
  if (data.email) {
    await page.getByTestId('contact-email').fill(data.email);
  }
  if (data.message) {
    await page.getByTestId('contact-message').fill(data.message);
  }
  if (data.topic) {
    await page.getByTestId('contact-subject').selectOption(data.topic);
  }
  if (data.priority) {
    await page.getByTestId(`contact-priority-${data.priority}`).check();
  }
  if (data.attachment) {
    await page.getByTestId('contact-attachments').setInputFiles(data.attachment);
  }
  if (data.copyMe) {
    await page.getByTestId('contact-copy-me').check();
  }
}