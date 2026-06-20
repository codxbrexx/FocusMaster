import { test as base, type Page } from '@playwright/test';

/**
 * Shared test fixtures and helpers for all E2E tests.
 */

// ──────────────────────────────────────────────
// Helper: dismiss the cookie consent banner
// ──────────────────────────────────────────────
export async function dismissCookieBanner(page: Page) {
  const rejectBtn = page.getByRole('button', { name: /reject non-essential/i });
  if (await rejectBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await rejectBtn.click();
    await rejectBtn.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
  }
}

// ──────────────────────────────────────────────
// Helper: clear all auth state from localStorage
// ──────────────────────────────────────────────
export async function clearAuthState(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guest_id');
    localStorage.removeItem('cookie-consent');
  });
}

// ──────────────────────────────────────────────
// Helper: accept cookies (so banner doesn't interfere)
// ──────────────────────────────────────────────
export async function preAcceptCookies(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify({
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
  });
}

// ──────────────────────────────────────────────
// Unique test user generator
// ──────────────────────────────────────────────
export function generateTestUser() {
  const id = Date.now();
  return {
    name: `E2E User ${id}`,
    email: `e2e_${id}@test.focusmaster`,
    password: 'TestPass123',
  };
}

// ──────────────────────────────────────────────
// Extended test fixture with pre-accepted cookies
// ──────────────────────────────────────────────
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    // Pre-accept cookies so they don't interfere
    await page.goto('/login');
    await preAcceptCookies(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
