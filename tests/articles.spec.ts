import { test, expect } from '@playwright/test';
import { userRegistration, userLogout, createArticle, subscribeToAuthor, randomEmail, randomUserName } from './pageActions';

test('Creating Articles', async ({ page }) => {
  // user 1 data
  const uniqueEmail1 = await randomEmail();
  const uniqueUserName1 = await randomUserName();
  const userPassword = `password123`;

  // article data
  const articleDescription = 'New Article Description'; 
  const articleBody = 'New Article Body';
  const articleTags = 'Article_tag';

  await userRegistration(page, uniqueUserName1, uniqueEmail1, userPassword);
  await expect(page.getByTestId('nav-profile')).toContainText(uniqueUserName1);

  let articleTitles = [];
  for(let i = 1; i <= 10; i++) {
    const randomArticleTitle = `New Article Title ${i}-${Math.floor(Math.random() * 1000)}`;
    await createArticle(page, randomArticleTitle, articleDescription, articleBody, articleTags);
    articleTitles.push(randomArticleTitle);
    await expect(page.getByTestId('article-title')).toContainText(randomArticleTitle);
  }

  await userLogout(page);
  // user 2 data
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

