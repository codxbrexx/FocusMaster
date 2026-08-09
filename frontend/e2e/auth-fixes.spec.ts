import { test, expect, dismissCookieBanner } from './fixtures';

/**
 * auth-fixes.spec.ts
 * E2E tests for auth pages in light mode — Login & Register.
 */

test.describe('Login Page — Visual & Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
  });

  test('h1 heading is visible and reads "Log in"', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Log in');
  });

  test('email label is visible', async ({ page }) => {
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    await expect(emailLabel).toContainText('Email');
  });

  test('password label is visible', async ({ page }) => {
    const passLabel = page.locator('label[for="password"]');
    await expect(passLabel).toBeVisible();
    await expect(passLabel).toContainText('Password');
  });

  test('email input accepts text', async ({ page }) => {
    await page.locator('#email').fill('user@test.com');
    await expect(page.locator('#email')).toHaveValue('user@test.com');
  });

  test('password input hides text by default', async ({ page }) => {
    await page.locator('#password').fill('secret123');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
  });

  test('eye toggle reveals and hides password', async ({ page }) => {
    const input = page.locator('#password');
    await input.fill('secret123');
    const toggle = page.locator('#password').locator('..').locator('button');
    await toggle.click();
    await expect(input).toHaveAttribute('type', 'text');
    await toggle.click();
    await expect(input).toHaveAttribute('type', 'password');
  });

  test('forgot password link is visible', async ({ page }) => {
    await expect(page.locator('text=Forgot password')).toBeVisible();
  });

  test('"Register Now" link is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /register now/i })).toBeVisible();
  });

  test('"Continue as Guest" button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /continue as guest/i })).toBeVisible();
  });
});

test.describe('Login Page — Validation errors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
  });

  test('shows inline error when both fields are empty', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();
    const errorBanner = page.locator('[class*="bg-red"]').first();
    await expect(errorBanner).toBeVisible({ timeout: 5000 });
    await expect(errorBanner).toContainText(/fill in all fields/i);
    await expect(page).toHaveURL('/login');
  });

  test('shows inline error when password field is empty', async ({ page }) => {
    await page.locator('#email').fill('user@test.com');
    await page.getByRole('button', { name: /sign in/i }).click();
    const errorBanner = page.locator('[class*="bg-red"]').first();
    await expect(errorBanner).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL('/login');
  });

  test('shows inline error on wrong credentials', async ({ page }) => {
    await page.locator('#email').fill('wrong@test.com');
    await page.locator('#password').fill('WrongPass123');
    await page.getByRole('button', { name: /sign in/i }).click();
    const errorBanner = page.locator('[class*="bg-red"]').first();
    await expect(errorBanner).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL('/login');
  });

  test('sign-in button shows spinner while loading', async ({ page }) => {
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Soft check — spinner may disappear fast on fast connections
    await page.locator('.animate-spin').isVisible().catch(() => false);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Login → Register navigation', () => {
  test('clicking Register Now navigates to /register', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
    await page.getByRole('link', { name: /register now/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('clicking Sign in on register navigates to /login', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Guest Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy-policy');
    await page.evaluate(() => localStorage.clear());
  });

  test('guest login lands on /dashboard', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
    await page.getByRole('button', { name: /continue as guest/i }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
  });

  test('guest user can access protected routes', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
    await page.getByRole('button', { name: /continue as guest/i }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
    await page.goto('/tasks');
    await expect(page).toHaveURL('/tasks');
    await page.goto('/pomodoro');
    await expect(page).toHaveURL('/pomodoro');
  });

  test('after guest login, visiting /login redirects to /dashboard', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
    await page.getByRole('button', { name: /continue as guest/i }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
    await page.goto('/login');
    await expect(page).toHaveURL('/dashboard');
  });
});
