import { test, expect } from '@playwright/test';

const uniqueEmail = `student-${Date.now()}-${Math.random()}@example.com`;
const uniqueUsername = `student-${Date.now()}`;

const userName = 'iryna123';
const userEmail = 'iryna123@example.com';
const userPassword = 'password123';

//const userName = uniqueUsername;
//const userEmail = uniqueEmail;
//const userPassword = `password123`;

test.describe('Registration', { tag: '@auth' }, () => {

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/register');
  });

  test('user registers with valid data', async ({ page }) => {
    await page.getByTestId('auth-username').fill(uniqueUsername);
    await page.getByTestId('auth-email').fill(uniqueEmail);
    await page.getByTestId('auth-password').fill(userPassword);
    await page.getByTestId('register-confirm-password').fill(userPassword);
    await page.getByTestId('register-terms').check();

    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByTestId('article-list-empty')).toContainText('No articles here yet.');
    await expect(page.getByTestId('nav-home')).toContainText('Home');
    await expect(page.getByTestId('nav-new-article')).toContainText('New article');
    await expect(page.getByTestId('nav-profile')).toContainText(uniqueUsername);
    await page.getByTestId('nav-profile').click();
    await expect(page.getByTestId('profile-username')).toContainText(uniqueUsername);
  });

  test('user registers with invalid data (existing email)', async ({ page }) => {
    await page.getByTestId('auth-username').fill(userName);
    await page.getByTestId('auth-email').fill(userEmail);
    await page.getByTestId('auth-password').fill(userPassword);
    await page.getByTestId('register-confirm-password').fill(userPassword);
    await page.getByTestId('register-terms').check();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByTestId('error-messages')).toContainText('body email або username вже зайняті');
  });

  test('user registers with invalid data (empty fields)', async ({ page }) => {
    await page.getByTestId('auth-username').fill('');
    await page.getByTestId('auth-email').fill('');
    await page.getByTestId('auth-password').fill('');
    await page.getByTestId('register-confirm-password').fill('');
    await page.getByTestId('register-terms').check();
    await expect(page.getByTestId('auth-submit')).toContainText('Create account');
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages')).toContainText('username ім\'я має містити щонайменше 3 символи');
    await expect(page.getByTestId('error-messages')).toContainText('email некоректний email');
    await expect(page.getByTestId('error-messages')).toContainText('password пароль має містити щонайменше 6 символів');
  });
});

test.describe('Login', { tag: '@auth' }, () => {
  test.beforeEach(async ({ page, context }) => {
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
