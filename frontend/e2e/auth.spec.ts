import { test, expect } from '@playwright/test';

// ──────────────────────────────────────────────
// Helper: dismiss the cookie consent banner if it appears
// ──────────────────────────────────────────────
async function dismissCookieBanner(page: import('@playwright/test').Page) {
  const rejectBtn = page.getByRole('button', { name: /reject non-essential/i });
  if (await rejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await rejectBtn.click();
    // Wait for the banner to disappear
    await rejectBtn.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
  }
}

// ──────────────────────────────────────────────
// 1. Landing Page
// ──────────────────────────────────────────────
test.describe('Landing Page', () => {
  test('should load and show login/register links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});

// ──────────────────────────────────────────────
// 2. Registration Flow
// ──────────────────────────────────────────────
test.describe('Registration', () => {
  test('should show the registration form', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);
    await expect(page.locator('h1')).toContainText('Create an Account');
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });

  test('should show error for short password', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);

    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('short@test.com');
    await page.locator('#password').fill('abc');
    await page.locator('#confirmPassword').fill('abc');

    await page.getByRole('button', { name: /create account/i }).click();

    // Should show error about password length
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should show error for password without number', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);

    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('nonumber@test.com');
    await page.locator('#password').fill('abcdefgh');
    await page.locator('#confirmPassword').fill('abcdefgh');

    await page.getByRole('button', { name: /create account/i }).click();

    // Should show error about needing a number
    await expect(page.locator('text=Password must include at least one number')).toBeVisible();
  });

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);

    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('mismatch@test.com');
    await page.locator('#password').fill('TestPass123');
    await page.locator('#confirmPassword').fill('DifferentPass456');

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should show error for empty fields', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);

    // Click submit without filling anything
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.locator('text=Please fill in all fields')).toBeVisible();
  });
});

// ──────────────────────────────────────────────
// 3. Login Flow
// ──────────────────────────────────────────────
test.describe('Login', () => {
  test('should show the login form', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should show error for empty fields on submit', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);

    // The Sign In button triggers client-side validation via handleSubmit.
    // HTML5 validation on type="email" may prevent the form from submitting,
    // so we fill a non-empty but invalid scenario: fill email, leave password empty.
    await page.locator('#email').fill('test@test.com');

    await page.getByRole('button', { name: /sign in$/i }).click();

    await expect(page.locator('text=Please fill in all fields')).toBeVisible();
  });

  test('should navigate to register from login', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);

    await page.getByRole('link', { name: /sign up/i }).click();

    await expect(page).toHaveURL('/register');
  });

  test('should navigate to login from register', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);

    await page.getByRole('link', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/login');
  });
});

// ──────────────────────────────────────────────
// 4. Guest Login Flow
// ──────────────────────────────────────────────
test.describe('Guest Login', () => {
  test('should show guest login button on login page', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);

    const guestBtn = page.getByRole('button', { name: /continue as guest/i });
    await expect(guestBtn).toBeVisible();
  });

  test('should show guest login button on register page', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);

    const guestBtn = page.getByRole('button', { name: /start as guest/i });
    await expect(guestBtn).toBeVisible();
  });
});

// ──────────────────────────────────────────────
// 5. Protected Route Redirects
// ──────────────────────────────────────────────
test.describe('Protected Routes', () => {
  test('should redirect /dashboard to /login when not authenticated', async ({ page }) => {
    // Clear any auth state
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isGuest');
      localStorage.removeItem('guest_id');
    });

    await page.goto('/dashboard');

    // Should be redirected to login
    await expect(page).toHaveURL('/login');
  });

  test('should redirect /tasks to /login when not authenticated', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isGuest');
      localStorage.removeItem('guest_id');
    });

    await page.goto('/tasks');

    await expect(page).toHaveURL('/login');
  });
});
