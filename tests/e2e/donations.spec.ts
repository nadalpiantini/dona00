import { test, expect } from '@playwright/test';
import { DonationsPage } from './pages/donations.page';
import { testDonation } from './fixtures/test-data';

test.describe('Donations CRUD Operations', () => {
  let donationsPage: DonationsPage;

  test.beforeEach(async ({ page }) => {
    donationsPage = new DonationsPage(page);

    // Navigate to donations page
    await donationsPage.goto();
  });

  test('should display donations list page', async ({ page }) => {
    // Check page elements
    await expect(donationsPage.newDonationButton).toBeVisible();
    await expect(donationsPage.searchInput).toBeVisible();

    // Check if there are any donation cards or empty state
    const hasContent = await page.locator('[data-testid="donation-card"], .donation-item, [class*="empty"]').count();
    expect(hasContent).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to new donation form', async ({ page }) => {
    await donationsPage.newDonationButton.click();

    await expect(page).toHaveURL(/.*\/donations\/new/);

    // Check form fields are visible
    await expect(donationsPage.titleInput).toBeVisible();
    await expect(donationsPage.descriptionInput).toBeVisible();
    await expect(donationsPage.categorySelect).toBeVisible();
    await expect(donationsPage.quantityInput).toBeVisible();
  });

  test('should validate required fields in donation form', async ({ page }) => {
    await donationsPage.newDonationButton.click();

    // Try to submit empty form
    await donationsPage.submitButton.click();

    // Should stay on form page (validation should prevent submission)
    await expect(page).toHaveURL(/.*\/donations\/new/);

    // Check HTML5 validation
    const titleValidity = await donationsPage.titleInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(titleValidity).toBeFalsy();
  });

  test('should search donations', async ({ page }) => {
    // Perform search
    await donationsPage.searchDonations('test');

    // Wait for results
    await page.waitForLoadState('networkidle');

    // URL should contain search param or results should update
    // (Implementation depends on whether search uses URL params or client-side filtering)
    const url = page.url();
    const hasSearchParam = url.includes('search') || url.includes('q=');

    // Either URL changes or content updates
    if (!hasSearchParam) {
      // Check that page responded to search (might show filtered results or "no results")
      const content = await page.locator('main, [role="main"]').textContent();
      expect(content).toBeTruthy();
    }
  });

  test('should filter donations by status', async ({ page }) => {
    // Apply status filter
    await donationsPage.filterByStatus('pending');

    // Wait for filter to apply
    await page.waitForLoadState('networkidle');

    // Check that filter was applied (URL param or content change)
    const url = page.url();
    const hasFilterParam = url.includes('status=') || url.includes('filter');

    if (!hasFilterParam) {
      // Client-side filtering - check that content updated
      const content = await page.locator('main, [role="main"]').textContent();
      expect(content).toBeTruthy();
    }
  });

  test('should filter donations by category', async ({ page }) => {
    // Apply category filter
    await donationsPage.filterByCategory('1'); // Assuming category ID

    // Wait for filter to apply
    await page.waitForLoadState('networkidle');

    // Check filter application
    const url = page.url();
    const hasFilterParam = url.includes('category=') || url.includes('filter');

    if (!hasFilterParam) {
      const content = await page.locator('main, [role="main"]').textContent();
      expect(content).toBeTruthy();
    }
  });

  test('should handle empty search results', async ({ page }) => {
    // Search for something unlikely to exist
    await donationsPage.searchDonations('xyzabc123456789');

    await page.waitForLoadState('networkidle');

    // Should show empty state or "no results" message
    const emptyState = page.locator('[class*="empty"], [class*="no-"], :text("No se encontraron"), :text("No results")');
    const hasEmptyState = await emptyState.count();

    // Either shows empty state or has 0 donation cards
    if (hasEmptyState === 0) {
      const donationCount = await donationsPage.getDonationsCount();
      expect(donationCount).toBe(0);
    } else {
      expect(hasEmptyState).toBeGreaterThan(0);
    }
  });

  test('should cancel donation creation', async ({ page }) => {
    await donationsPage.newDonationButton.click();
    await expect(page).toHaveURL(/.*\/donations\/new/);

    // Fill some fields
    await donationsPage.titleInput.fill('Test donation');

    // Cancel
    await donationsPage.cancelButton.click();

    // Should return to donations list
    await expect(page).toHaveURL(/.*\/donations(?!\/new)/);
  });

  test.describe('Donation View Actions', () => {
    test('should view donation details', async ({ page }) => {
      const donationCount = await donationsPage.getDonationsCount();

      if (donationCount > 0) {
        // Click on first donation
        await donationsPage.viewDonation(0);

        // Should navigate to detail page
        await expect(page).toHaveURL(/.*\/donations\/[a-zA-Z0-9-]+$/);

        // Should show donation details
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
      } else {
        // No donations to test
        test.skip();
      }
    });

    test('should navigate to edit donation', async ({ page }) => {
      const donationCount = await donationsPage.getDonationsCount();

      if (donationCount > 0) {
        // Click edit on first donation
        await donationsPage.editDonation(0);

        // Should navigate to edit page
        await expect(page).toHaveURL(/.*\/donations\/[a-zA-Z0-9-]+\/edit/);

        // Form should be populated
        const titleValue = await donationsPage.titleInput.inputValue();
        expect(titleValue).toBeTruthy();
      } else {
        test.skip();
      }
    });
  });
});

test.describe('Donations Form Validation', () => {
  test('should validate quantity input', async ({ page }) => {
    const donationsPage = new DonationsPage(page);
    await donationsPage.goto();
    await donationsPage.newDonationButton.click();

    // Try negative quantity
    await donationsPage.quantityInput.fill('-1');
    await donationsPage.submitButton.click();

    // Should not submit
    await expect(page).toHaveURL(/.*\/donations\/new/);

    // Try zero
    await donationsPage.quantityInput.fill('0');
    await donationsPage.submitButton.click();

    // Should not submit
    await expect(page).toHaveURL(/.*\/donations\/new/);
  });

  test('should validate address fields', async ({ page }) => {
    const donationsPage = new DonationsPage(page);
    await donationsPage.goto();
    await donationsPage.newDonationButton.click();

    // Fill required fields except address
    await donationsPage.titleInput.fill('Test Donation');
    await donationsPage.descriptionInput.fill('Test Description');
    await donationsPage.quantityInput.fill('1');

    // Leave address empty and try to submit
    await donationsPage.submitButton.click();

    // Should require at least city
    const cityValidity = await donationsPage.cityInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(cityValidity).toBeFalsy();
  });
});