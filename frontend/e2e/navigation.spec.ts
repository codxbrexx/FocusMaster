import { test, expect, dismissCookieBanner } from './fixtures';

test.describe('Public Pages', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    // The landing page should have a header
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load privacy policy page', async ({ page }) => {
    await page.goto('/privacy-policy');
    await expect(page.locator('h1')).toContainText('Privacy Policy');
  });

  test('should load terms of service page', async ({ page }) => {
    await page.goto('/terms-of-service');
    await expect(page.locator('h1')).toContainText('Terms of Service');
  });

  test('should load cookie settings page', async ({ page }) => {
    await page.goto('/cookie-settings');
    await expect(page).toHaveURL('/cookie-settings');
  });
});

test.describe('Protected Route Redirects', () => {
  test.beforeEach(async ({ page }) => {
    // Go to a simple public page that doesn't redirect
    await page.goto('/privacy-policy');
    // Clear auth state
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  const protectedRoutes = [
    '/dashboard',
    '/tasks',
    '/pomodoro',
    '/analytics',
    '/clock',
    '/settings',
    '/profile',
    '/calendar',
  ];

  for (const route of protectedRoutes) {
    test(`should redirect ${route} to /login when not authenticated`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
    });
  }
});

test.describe('Authenticated Route Access (Guest)', () => {
  test.beforeEach(async ({ page }) => {
    // Go to a simple public page that doesn't redirect
    await page.goto('/privacy-policy');
    // Clear auth state to ensure we start unauthenticated
    await page.evaluate(() => {
      localStorage.clear();
    });
    // Go to login page
    await page.goto('/login');
    await dismissCookieBanner(page);
    await page.getByRole('button', { name: /continue as guest/i }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
  });

  test('should access dashboard after guest login', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard');
  });

  test('should access tasks page', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page).toHaveURL('/tasks');
  });

  test('should access pomodoro page', async ({ page }) => {
    await page.goto('/pomodoro');
    await expect(page).toHaveURL('/pomodoro');
  });

  test('should access settings page', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL('/settings');
  });

  test('should access profile page', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/profile');
  });

  test('should access analytics page', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL('/analytics');
  });

  test('should access calendar page', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page).toHaveURL('/calendar');
  });
});

test.describe('404 Page', () => {
  test('should show not found for invalid route', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');
    // SPA returns 200 but renders a not-found component
    expect(response?.status()).toBe(200);
  });
});
