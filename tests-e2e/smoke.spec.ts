import { test, expect } from '@playwright/test';

test('home loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Insuro')).toBeVisible();
  await expect(page.getByRole('link', { name: '30 Gün Ücretsiz Başla' })).toBeVisible();
});
