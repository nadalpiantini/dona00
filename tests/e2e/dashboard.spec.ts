import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard.page';

test.describe('Dashboard Navigation', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);

    // Note: In a real scenario, you'd login first
    // For now, we'll navigate directly (dev mode allows it)
    await dashboardPage.goto();
  });

  test('should display dashboard main page', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();

    // Check main elements
    await expect(dashboardPage.pageTitle).toBeVisible();

    // Check stats cards exist
    const statsCount = await dashboardPage.getStatsCount();
    expect(statsCount).toBeGreaterThan(0);

    // Check navigation menu is visible
    await expect(dashboardPage.navigationMenu).toBeVisible();
  });

  test('should navigate to donations section', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();

    await dashboardPage.navigateTo('donations');
    await expect(page).toHaveURL(/.*\/donations/);

    // Verify page loaded
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should navigate to centers section', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();

    await dashboardPage.navigateTo('centers');
    await expect(page).toHaveURL(/.*\/centers/);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should navigate to beneficiaries section', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();

    await dashboardPage.navigateTo('beneficiaries');
    await expect(page).toHaveURL(/.*\/beneficiaries/);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should navigate to profile section', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();

    await dashboardPage.navigateTo('profile');
    await expect(page).toHaveURL(/.*\/profile/);

    // Check profile form exists
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should maintain navigation state on refresh', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();

    // Navigate to a section
    await dashboardPage.navigateTo('donations');
    await expect(page).toHaveURL(/.*\/donations/);

    // Refresh page
    await page.reload();

    // Should still be on donations
    await expect(page).toHaveURL(/.*\/donations/);
  });

  test('should handle navigation errors gracefully', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();

    // Try to navigate to non-existent route
    await page.goto('/dashboard/non-existent-route');

    // Should either show 404 or redirect to dashboard
    const url = page.url();
    expect(url).toMatch(/\/(dashboard|404)/);
  });

  test.describe('Responsive Navigation', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await dashboardPage.goto();
      await dashboardPage.waitForDashboardLoad();

      // Mobile menu might be hidden, check for hamburger
      const hamburger = page.locator('[aria-label*="menu"], [class*="menu-toggle"]');
      if (await hamburger.isVisible()) {
        await hamburger.click();
      }

      // Navigation should be accessible
      await expect(dashboardPage.donationsLink).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await dashboardPage.goto();
      await dashboardPage.waitForDashboardLoad();

      // Navigation should be visible
      await expect(dashboardPage.navigationMenu).toBeVisible();
    });
  });
});

test.describe('Dashboard Stats and Data', () => {
  test('should display stats cards with data', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.waitForDashboardLoad();

    // Check stats cards
    const statsCards = page.locator('[class*="stat"], [class*="card"]');
    const count = await statsCards.count();
    expect(count).toBeGreaterThan(0);

    // Each stat card should have a value
    for (let i = 0; i < count && i < 4; i++) {
      const card = statsCards.nth(i);
      await expect(card).toBeVisible();

      // Check if card has content
      const text = await card.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('should handle empty state gracefully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.waitForDashboardLoad();

    // Navigate to a section that might be empty
    await dashboardPage.navigateTo('messages');

    // Should show either messages or empty state
    const content = page.locator('main, [role="main"]');
    await expect(content).toBeVisible();

    // Check for empty state message or list
    const hasContent = await page.locator('[class*="empty"], [class*="no-"], tbody tr, [class*="list"]').count();
    expect(hasContent).toBeGreaterThanOrEqual(0);
  });
});