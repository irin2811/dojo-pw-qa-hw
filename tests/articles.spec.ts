import { test, expect } from '@playwright/test';
import { userRegistration, userLogout, createArticle, subscribeToAuthor, randomEmail, randomUserName } from './pageActions';

test('Creating Articles', async ({ page }) => {
  // user data
  const uniqueEmail = await randomEmail();
  const uniqueUserName = await randomUserName();
  const userPassword = `password123`;

  // article data
  const articleDescription = 'New Article Description'; 
  const articleBody = 'New Article Body';
  const articleTags = 'Article_tag';

  await userRegistration(page, uniqueUserName, uniqueEmail, userPassword);
  await expect(page.getByTestId('nav-profile')).toContainText(uniqueUserName);

  let articleTitles = [];
  for(let i = 1; i <= 10; i++) {
    const randomArticleTitle = `New Article Title ${i}-${Math.floor(Math.random() * 1000)}`;
    await createArticle(page, randomArticleTitle, articleDescription, articleBody, articleTags);
    articleTitles.push(randomArticleTitle);
    await expect(page.getByTestId('article-title')).toContainText(randomArticleTitle);
  }

  await userLogout(page);
  //await userLogin(page, uniqueEmail, userPassword);
  const uniqueEmail2 = await randomEmail();
  const uniqueUserName2 = await randomUserName();
  await userRegistration(page, uniqueUserName2, uniqueEmail2, userPassword);
  await expect(page.getByTestId('nav-profile')).toContainText(uniqueUserName2);
  await subscribeToAuthor(page, articleTitles[0]);
  await page.getByTestId('nav-home').click();
  for(const articleTitle of articleTitles) {
    const articlePreview = page.getByTestId('preview-title').filter({ hasText: articleTitle });
    await expect(articlePreview).toBeVisible();
  }
});

/*const userEmail = 'olena@example.com';
const userPassword = 'password';
const userName = 'olena';

async function login(page: any, email: string, password: string) {
  await page.getByTestId('auth-email').fill(email);
  await page.getByTestId('auth-password').fill(password);
  await page.getByTestId('auth-submit').click();
}

test.describe('Login', { tag: '@auth' }, () => {

  test.beforeEach(async ({ page, context }) => {
      await context.clearCookies();
      await page.goto('/articles/login');
      await login(page, userEmail, userPassword);
    });

  test('user logs in with valid data', async ({ page }) => {
      await expect(page.getByTestId('nav-home')).toContainText('Home');
      await expect(page.getByTestId('nav-new-article')).toContainText('New article');
      await expect(page.getByTestId('nav-profile')).toContainText(userName);
  });

  test('create a new article', async ({ page }) => {
    const randomArticleTitle = `New Article Title ${Math.floor(Math.random() * 1000)}`;
    const articleDescription = 'New Article Description'; 
    const articleBody = 'New Article Body';
    const articleTags = 'Article_tag';

    await page.getByTestId('nav-new-article').click();
    await page.getByTestId('editor-title').fill(randomArticleTitle);
    await page.getByTestId('editor-description').fill(articleDescription);
    await page.getByTestId('editor-body').fill(articleBody);
    await page.getByTestId('editor-tags').fill(articleTags);
    await page.getByTestId('editor-submit').click();

    await page.getByTestId('nav-profile').click();
    await expect(page.getByTestId('article-list')).toBeVisible();
    await expect(page.getByTestId('preview-title')).toContainText(randomArticleTitle);


    //await expect(page.getByRole('heading')).toContainText(randomArticleTitle);
  });
});*/
