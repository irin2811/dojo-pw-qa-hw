import { Page } from '@playwright/test';

export async function randomEmail() {
  return `student-${Date.now()}-${Math.random()}@example.com`;
}

export async function randomUserName() {
  return `student-${Date.now()}-${Math.random()}`;
}

export async function userRegistration(page: Page, userName: string, userEmail: string, userPassword: string) {
  await page.goto('/articles/register');
  await page.getByTestId('auth-username').fill(userName);
  await page.getByTestId('auth-email').fill(userEmail);
  await page.getByTestId('auth-password').fill(userPassword);
  await page.getByTestId('register-confirm-password').fill(userPassword);
  await page.getByTestId('register-terms').check();
  await page.getByRole('button', { name: 'Create account' }).click();
}

export async function userLogout(page: Page) {
  await page.getByTestId('nav-profile').click();
  await page.getByText('Edit profile').click();
  await page.getByRole('button', { name: 'Log out' }).click();
}

export async function userLogin(page: Page, userEmail: string, userPassword: string) {
  await page.goto('/articles/login');
  await page.getByTestId('auth-email').fill(userEmail);
  await page.getByTestId('auth-password').fill(userPassword);
  await page.getByTestId('auth-submit').click();
}

export async function createArticle(page: Page, title: string, description: string, body: string, tags: string) {
  await page.getByTestId('nav-new-article').click();
  await page.getByTestId('editor-title').fill(title);
  await page.getByTestId('editor-description').fill(description);
  await page.getByTestId('editor-body').fill(body);
  await page.getByTestId('editor-tags').fill(tags);
  await page.getByTestId('editor-submit').click();
}

export async function subscribeToAuthor(page: Page, articleTitle: string) {
  await page.getByRole('button', { name: 'Global feed' }).click();
  await page.getByTestId('home-search-input').fill(articleTitle);
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByText(articleTitle).click();
  await page.getByTestId('article-follow-button').click();
}