import { test, expect } from '@playwright/test';

const userPassword = `password123`;

async function userRegistration(page: any, userName: string, userEmail: string, userPassword: string) {
  await page.goto('/register');
  await page.getByTestId('auth-username').fill(userName);
  await page.getByTestId('auth-email').fill(userEmail);
  await page.getByTestId('auth-password').fill(userPassword);
  await page.getByTestId('register-confirm-password').fill(userPassword);
  await page.getByTestId('register-terms').check();
  await page.getByRole('button', { name: 'Create account' }).click();
}

test.describe('Registration', { tag: '@auth' }, () => {
  let uniqueEmail: string;
  let uniqueUserName: string;

  test.beforeEach(async ({ page, context }) => {
    uniqueEmail = `student-${Date.now()}-${Math.random()}@example.com`;
    uniqueUserName = `student-${Date.now()}`;

    await context.clearCookies();
    await page.goto('/register');
  });

  test('user registers with valid data', async ({ page }) => {
    await userRegistration(page, uniqueUserName, uniqueEmail, userPassword);
    await expect(page.getByTestId('nav-profile')).toContainText(uniqueUserName);
  });

  test('user registers with invalid data (existing email)', async ({ page, context }) => {
    await userRegistration(page, uniqueUserName, uniqueEmail, userPassword);
    await expect(page.getByTestId('nav-profile')).toContainText(uniqueUserName);

    await context.clearCookies();
    await page.goto('/register');

    await userRegistration(page, uniqueUserName, uniqueEmail, userPassword);
    await expect(page.getByTestId('error-messages')).toContainText('body email або username вже зайняті');
  });

  test('user registers with invalid data (empty fields)', async ({ page }) => {
    await userRegistration(page, '', '', '');

    await expect(page.getByTestId('error-messages')).toContainText('username ім\'я має містити щонайменше 3 символи');
    await expect(page.getByTestId('error-messages')).toContainText('email некоректний email');
    await expect(page.getByTestId('error-messages')).toContainText('password пароль має містити щонайменше 6 символів');
  });
});

test.describe('Login', { tag: '@auth' }, () => {
  let userEmail: string;
  let userName: string;

  test.beforeEach(async ({ page, context }) => {
    userEmail = `student-${Date.now()}-${Math.random()}@example.com`;
    userName = `student-${Date.now()}`;

    await context.clearCookies();
    await userRegistration(page, userName, userEmail, userPassword);

    await context.clearCookies();
    await page.goto('/login');
  });

  test('user logs in with valid data', async ({ page }) => {
    await expect(page.getByRole('heading')).toContainText('Sign in');

    await page.getByTestId('auth-email').fill(userEmail);
    await page.getByTestId('auth-password').fill(userPassword);
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('nav-home')).toContainText('Home');
    await expect(page.getByTestId('nav-new-article')).toContainText('New article');
    await expect(page.getByTestId('nav-profile')).toContainText(userName);
    await page.getByTestId('nav-profile').click();
    await expect(page.getByTestId('profile-username')).toContainText(userName);
  });

  test('user logs in with invalid password', async ({ page }) => {
    await expect(page.getByRole('heading')).toContainText('Sign in');

    await page.getByTestId('auth-email').pressSequentially(userEmail);
    await page.getByTestId('auth-password').pressSequentially('wrongpassword');
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages')).toContainText('email or password неправильні');
  });

  test('user logs in with non-existent email', async ({ page }) => {
    await expect(page.getByRole('heading')).toContainText('Sign in');

    await page.getByTestId('auth-email').pressSequentially('nonexistent@example.com');
    await page.getByTestId('auth-password').pressSequentially(userPassword);
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages')).toContainText('email or password неправильні');
  });
});
