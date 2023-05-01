import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  await page.locator('#about').getByText('yarn').click();
  await page.locator('#about').getByText('npm').click();
  await page.locator('#about').getByText('npm', { exact: true }).click();
  await page.locator('#about').getByText('yarn').click();
  await page.getByText('yarn').nth(2).click();
  await page.getByText('yarn').nth(4).click();
  await page.locator('#usage').getByText('npx').click();
  await page.getByText('bash').click();
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/.*#about/);
  await page.getByRole('link', { name: 'Install' }).click();
  await expect(page).toHaveURL(/.*#install/);
  await page.getByRole('link', { name: 'Usage' }).click();
  await expect(page).toHaveURL(/.*#usage/);
  await page.getByRole('link', { name: 'Examples' }).click();
  await expect(page).toHaveURL(/.*#examples/);
});
