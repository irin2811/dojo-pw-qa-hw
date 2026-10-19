import { test, expect } from '@playwright/test';
import { fillContactForm } from './contact.form.helper';

const contactFormData = [
  {
    scenario: 'all data',
    name: 'all data',
    email: 'user@example.com',
    message: 'This is a test message',
    topic: 'Повідомити про ваду',
    priority: 'medium',
    attachment: 'tests/fixtures/test-file.txt',
    copyMe: true
  },
  {
    scenario: 'required data',
    name: 'required data',
    email: 'user@example.com',
    message: 'This is a test message'
  },
  {
    scenario: 'optional data',
    topic: 'Повідомити про ваду',
    priority: 'low',
    attachment: 'tests/fixtures/test-file.txt',
    copyMe: true
  }
]

test.describe('Contact form submission', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/articles/contact');
    await expect(page.locator('h1')).toContainText('Зворотний зв\'язок');
  });

  test('Contact form submission: all data', async ({ page }) => {
    await fillContactForm(page, contactFormData[0]);
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-success')).toContainText('Ваше звернення надіслано.');
  });

  test('Contact form submission: required data', async ({ page }) => {
    await fillContactForm(page, contactFormData[1]);
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-success')).toContainText('Ваше звернення надіслано.');
  });

  test('Contact form submission: optional data', async ({ page }) => {
    await fillContactForm(page, contactFormData[2]);
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('error-messages')).toContainText(`name обов'язкове поле`);
    await expect(page.getByTestId('error-messages')).toContainText(`email некоректний email`);
    await expect(page.getByTestId('error-messages')).toContainText(`message обов'язкове поле`);
  });
});
