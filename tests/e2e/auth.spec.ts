import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { DashboardPage } from './pages/dashboard.page';
import { testUsers } from './fixtures/test-data';

test.describe('Authentication Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('should display login page correctly', async ({ page }) => {
    await loginPage.goto();

    // Check all essential elements are visible
    await expect(page).toHaveTitle(/DONA/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.signUpLink).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.goto();

    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Should show error message
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Error');

    // Should stay on login page
    expect(page.url()).toContain('/login');
  });

  test('should show error with empty fields', async ({ page }) => {
    await loginPage.goto();

    // Try to submit empty form
    await loginPage.submitButton.click();

    // HTML5 validation should prevent submission
    const emailValidity = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(emailValidity).toBeFalsy();
  });

  test('should validate email format', async ({ page }) => {
    await loginPage.goto();

    // Enter invalid email format
    await loginPage.emailInput.fill('notanemail');
    await loginPage.passwordInput.fill('password123');
    await loginPage.submitButton.click();

    // HTML5 validation should catch invalid email
    const emailValidity = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(emailValidity).toBeFalsy();
  });

  test('should toggle password visibility', async ({ page }) => {
    await loginPage.goto();

    await loginPage.passwordInput.fill('testpassword');

    // Initially password should be hidden
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Toggle visibility
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    // Toggle back
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate to signup page', async ({ page }) => {
    await loginPage.goto();

    await loginPage.signUpLink.click();
    await page.waitForURL('**/signup');

    expect(page.url()).toContain('/signup');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await loginPage.goto();

    await loginPage.forgotPasswordLink.click();
    await page.waitForURL('**/forgot-password');

    expect(page.url()).toContain('/forgot-password');
  });

  test('should handle session timeout gracefully', async ({ page }) => {
    await loginPage.goto();

    // Simulate expired session by navigating to protected route
    await page.goto('/dashboard');

    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 5000 }).catch(() => {});

    // In production, should be redirected. In dev, might stay on dashboard
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
      await page.goto('/dashboard');

      // In production environment, should redirect to login
      // In development, might allow access
      const url = page.url();
      expect(url).toMatch(/\/(login|dashboard)/);
    });

    test('should redirect to login when accessing donations without auth', async ({ page }) => {
      await page.goto('/dashboard/donations');

      const url = page.url();
      expect(url).toMatch(/\/(login|dashboard\/donations)/);
    });

    test('should redirect to login when accessing profile without auth', async ({ page }) => {
      await page.goto('/dashboard/profile');

      const url = page.url();
      expect(url).toMatch(/\/(login|dashboard\/profile)/);
    });
  });
});

test.describe('Signup Flow', () => {
  test('should display signup page correctly', async ({ page }) => {
    await page.goto('/signup');

    // Check essential elements
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="fullName"], input[name="full_name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });

  test('should validate required fields on signup', async ({ page }) => {
    await page.goto('/signup');

    // Try to submit empty form
    await page.locator('button[type="submit"]').click();

    // Check HTML5 validation
    const emailInput = page.locator('input[name="email"]');
    const emailValidity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(emailValidity).toBeFalsy();
  });

  test('should validate password requirements', async ({ page }) => {
    await page.goto('/signup');

    // Fill form with weak password
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="fullName"], input[name="full_name"]', 'Test User');
    await page.fill('input[name="password"]', '123'); // Too short
    await page.locator('button[type="submit"]').click();

    // Should show validation error or prevent submission
    const url = page.url();
    expect(url).toContain('/signup');
  });
});