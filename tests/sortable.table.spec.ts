import { test, expect } from '@playwright/test';

// Сортування і зміну порядку
test('sorting table test', async ({ page }) => {
  await page.goto('/laboratory/interactions');
  await expect(page.locator('//*[@data-testid="nav-practice"]/following-sibling::span')).toHaveText('Laboratory');
  await expect(page.locator('//h2[contains(text(), "Sortable table")]/ancestor::section')).toBeVisible();

  await expect(page.locator('//button[@data-testid="interactions-sort-name"]')).toContainText('Тест');

  const columnValueBeforeSorting = await page.locator('//table/tbody/tr[1]/td[2]').textContent();
  console.log('Column value before sorting:', columnValueBeforeSorting);
  await page.locator('//button[@data-testid="interactions-sort-name"]').click();

  const columnValueAfterSorting = await page.locator('//table/tbody/tr[1]/td[2]').textContent();
  console.log('Column value after sorting:', columnValueAfterSorting);
  expect(columnValueBeforeSorting).not.toBe(columnValueAfterSorting);

  await page.locator('//button[@data-testid="interactions-sort-name"]').click();
  const columnValueAfterSecondSorting = await page.locator('//table/tbody/tr[1]/td[2]').textContent();
  console.log('Column value after second sorting:', columnValueAfterSecondSorting);
  expect(columnValueBeforeSorting).toBe(columnValueAfterSecondSorting);
});

// Перевірте роботу з чек боксами - збільшення кількості Вибраних елементів
test('marking checkboxes test', async ({ page }) => {
  await page.goto('/laboratory/interactions');
  await expect(page.locator('//*[@data-testid="nav-practice"]/following-sibling::span')).toHaveText('Laboratory');
  await expect(page.locator('//h2[contains(text(), "Sortable table")]/ancestor::section')).toBeVisible();

  await expect(page.locator('//*[@data-testid="interactions-selected-count"]')).toHaveText('Вибрано: 0');
  await page.locator('//h2[contains(text(), "Sortable table")]/ancestor::section//input[@type="checkbox"]').first().check();
  await expect(page.locator('//*[@data-testid="interactions-selected-count"]')).toHaveText('Вибрано: 1');
  await page.locator('//h2[contains(text(), "Sortable table")]/ancestor::section//input[@type="checkbox"]').first().uncheck();
  await expect(page.locator('//*[@data-testid="interactions-selected-count"]')).toHaveText('Вибрано: 0');
});
