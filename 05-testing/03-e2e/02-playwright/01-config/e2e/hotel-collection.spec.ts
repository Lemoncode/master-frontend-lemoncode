import { test, expect } from '@playwright/test';

test('should fetch hotel list and show it in screen when visit /hotel-collection url', async ({
  page,
}) => {
  // Arrange

  // Act
  await page.goto('#/hotel-collection');

  // Assert
  await page.waitForResponse('/api/hotels');
  await expect(page.getByRole('listitem')).toHaveCount(10);
});
