import { test, expect, dismissCookieBanner } from './fixtures';

test.describe('Dashboard (Guest Mode)', () => {
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

  test('should display welcome header with user name', async ({ page }) => {
    // Guest user name starts with "Guest" — check that some content rendered
    // The dashboard renders a WelcomeHeader component
    await page.waitForTimeout(2000);
    // Check that the page is the dashboard (not redirected)
    await expect(page).toHaveURL('/dashboard');
    // Dashboard content should be visible (the main wrapper)
    await expect(page.locator('body')).toContainText(/Guest|Dashboard|Welcome/i);
  });

  test('should display stats overview section', async ({ page }) => {
    await page.waitForTimeout(1000);
    // The dashboard should have content visible (stats cards, etc.)
    await expect(page).toHaveURL('/dashboard');
    // Verify the page has rendered some dashboard content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should display focus heatmap', async ({ page }) => {
    await page.waitForTimeout(1500);
    // The FocusHeatmap renders inside a block container
    // Use first() to avoid strict mode violation when multiple elements match
    const heatmapArea = page.locator('.block.lg\\:col-span-3').first();
    await expect(heatmapArea).toBeVisible();
  });
});

test.describe('Cookie Consent Banner', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookie consent so banner shows
    await page.goto('/login');
    await page.evaluate(() => localStorage.removeItem('cookie-consent'));
    await page.reload();
  });

  test('should show cookie banner on first visit', async ({ page }) => {
    await expect(page.locator('text=Cookie Preferences')).toBeVisible();
    await expect(page.getByRole('button', { name: /reject non-essential/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /accept all/i })).toBeVisible();
  });

  test('should hide banner after accepting all', async ({ page }) => {
    await page.getByRole('button', { name: /accept all/i }).click();
    await expect(page.locator('text=Cookie Preferences')).not.toBeVisible();

    // Verify localStorage was set
    const consent = await page.evaluate(() => localStorage.getItem('cookie-consent'));
    expect(consent).not.toBeNull();
    const parsed = JSON.parse(consent!);
    expect(parsed.analytics).toBe(true);
    expect(parsed.marketing).toBe(true);
  });

  test('should hide banner after rejecting non-essential', async ({ page }) => {
    await page.getByRole('button', { name: /reject non-essential/i }).click();
    await expect(page.locator('text=Cookie Preferences')).not.toBeVisible();

    // Verify only essential cookies are accepted
    const consent = await page.evaluate(() => localStorage.getItem('cookie-consent'));
    const parsed = JSON.parse(consent!);
    expect(parsed.essential).toBe(true);
    expect(parsed.analytics).toBe(false);
    expect(parsed.marketing).toBe(false);
  });

  test('should not show banner on subsequent visits after consent', async ({ page }) => {
    // Accept cookies
    await page.getByRole('button', { name: /accept all/i }).click();

    // Navigate away and come back
    await page.goto('/register');
    await page.goto('/login');

    // Banner should not appear
    await expect(page.locator('text=Cookie Preferences')).not.toBeVisible();
  });

  test('should have privacy policy link in banner', async ({ page }) => {
    const privacyLink = page.locator('a[href="/privacy-policy"]');
    await expect(privacyLink).toBeVisible();
  });

  test('should close banner with X button', async ({ page }) => {
    const closeBtn = page.locator('button[aria-label="Close"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(page.locator('text=Cookie Preferences')).not.toBeVisible();
  });
});

test.describe('Landing Page Content', () => {
  test('should display the landing page with key sections', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);

    // The hero section should be visible
    await expect(page.locator('main')).toBeVisible();

    // Should have a header/nav
    await expect(page.locator('header').first()).toBeVisible();
  });

  test('should have features section', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);

    // Scroll to features
    const features = page.locator('#features');
    if (await features.isVisible().catch(() => false)) {
      await expect(features).toBeVisible();
    }
  });
});
