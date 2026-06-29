import { test, expect, dismissCookieBanner } from './fixtures';

// AUTH E2E TESTS — Login, Register, Guest, Password Validation

test.describe('Registration Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);
  });

  test('should display all form fields and buttons', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Create an Account');
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /start as guest/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('should reject empty form submission', async ({ page }) => {
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('text=Please fill in all fields')).toBeVisible();
  });

  test('should reject password shorter than 8 characters', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('short@test.com');
    await page.locator('#password').fill('abc12');
    await page.locator('#confirmPassword').fill('abc12');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should reject password without a letter', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('noletter@test.com');
    await page.locator('#password').fill('12345678');
    await page.locator('#confirmPassword').fill('12345678');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('text=Password must include at least one letter')).toBeVisible();
  });

  test('should reject password without a number', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('nonumber@test.com');
    await page.locator('#password').fill('abcdefgh');
    await page.locator('#confirmPassword').fill('abcdefgh');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('text=Password must include at least one number')).toBeVisible();
  });

  test('should reject mismatched passwords', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('mismatch@test.com');
    await page.locator('#password').fill('TestPass123');
    await page.locator('#confirmPassword').fill('Different456');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.locator('#password').fill('abc');
    // The PasswordStrengthIndicator should render
    await expect(page.locator('text=weak')).toBeVisible();

    await page.locator('#password').fill('abcdefgh');
    await expect(page.locator('text=fair')).toBeVisible();
  });

  test('should show passwords match indicator', async ({ page }) => {
    await page.locator('#password').fill('TestPass123');
    await page.locator('#confirmPassword').fill('TestPass123');
    await expect(page.locator('text=Passwords match')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await passwordInput.fill('TestPass123');

    // Initially hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click eye button to show
    await page.locator('#password ~ button, [id="password"] + button, #password').locator('..').locator('button').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/login');
  });
});


test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
  });

  test('should display all form fields and buttons', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue as guest/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
  });

  test('should reject empty password on submit', async ({ page }) => {
    await page.locator('#email').fill('user@test.com');
    await page.getByRole('button', { name: /sign in$/i }).click();
    await expect(page.locator('text=Please fill in all fields')).toBeVisible();
  });

  test('should reject empty email on submit', async ({ page }) => {
    await page.locator('#password').fill('password123');
    // Browser HTML5 validation on type="email" will prevent submission,
    // so we need to remove the type attribute first
    await page.locator('#email').evaluate((el) => el.removeAttribute('type'));
    await page.getByRole('button', { name: /sign in$/i }).click();
    await expect(page.locator('text=Please fill in all fields')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await passwordInput.fill('TestPass123');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the eye toggle button
    await page.locator('#password').locator('..').locator('button').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should have remember me checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
  });

  test('should have forgot password link', async ({ page }) => {
    await expect(page.locator('text=Forgot password?')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL('/register');
  });
});

test.describe('Guest Login', () => {
  test('should have guest button on login page', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);
    await expect(page.getByRole('button', { name: /continue as guest/i })).toBeVisible();
  });

  test('should have guest button on register page', async ({ page }) => {
    await page.goto('/register');
    await dismissCookieBanner(page);
    await expect(page.getByRole('button', { name: /start as guest/i })).toBeVisible();
  });

  test('should login as guest and reach dashboard', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieBanner(page);

    const guestBtn = page.getByRole('button', { name: /continue as guest/i });
    await guestBtn.click();

    // Should navigate to dashboard (may take a moment for API call)
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
  });
});

test.describe('Full Registration + Login Flow', () => {
  const timestamp = Date.now();
  const testUser = {
    name: 'E2E Full Flow User',
    email: `e2e_fullflow_${timestamp}@test.focusmaster`,
    password: 'SecurePass123',
  };

  test('should register → land on dashboard → logout → login again', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await dismissCookieBanner(page);

    await page.locator('#name').fill(testUser.name);
    await page.locator('#email').fill(testUser.email);
    await page.locator('#password').fill(testUser.password);
    await page.locator('#confirmPassword').fill(testUser.password);
    await page.getByRole('button', { name: /create account/i }).click();

    // 2. Should land on dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });

    // 3. Logout — navigate to login
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isGuest');
    });
    await page.reload();

    // 4. Should be on login page
    await expect(page).toHaveURL('/login');

    // 5. Login with same credentials
    await dismissCookieBanner(page);
    await page.locator('#email').fill(testUser.email);
    await page.locator('#password').fill(testUser.password);
    await page.getByRole('button', { name: /sign in$/i }).click();

    // 6. Should land on dashboard again
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
  });
});
