import { Page, Locator } from '@playwright/test';

export class DonationsPage {
  readonly page: Page;
  readonly newDonationButton: Locator;
  readonly searchInput: Locator;
  readonly filterStatus: Locator;
  readonly filterCategory: Locator;
  readonly donationCards: Locator;
  readonly viewToggle: Locator;

  // Form fields
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly quantityInput: Locator;
  readonly conditionSelect: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly provinceInput: Locator;
  readonly postalCodeInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newDonationButton = page.locator('a[href*="/donations/new"], button:has-text("Nueva")');
    this.searchInput = page.locator('input[placeholder*="Buscar"]');
    this.filterStatus = page.locator('select[name="status"], [data-testid="status-filter"]');
    this.filterCategory = page.locator('select[name="category"], [data-testid="category-filter"]');
    this.donationCards = page.locator('[data-testid="donation-card"], .donation-item');
    this.viewToggle = page.locator('[aria-label*="view"], [data-testid="view-toggle"]');

    // Form
    this.titleInput = page.locator('input[name="title"]');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.categorySelect = page.locator('select[name="category_id"]');
    this.quantityInput = page.locator('input[name="quantity"]');
    this.conditionSelect = page.locator('select[name="condition"]');
    this.streetInput = page.locator('input[name="street"], input[id="street"]');
    this.cityInput = page.locator('input[name="city"], input[id="city"]');
    this.provinceInput = page.locator('input[name="province"], input[id="province"]');
    this.postalCodeInput = page.locator('input[name="postal_code"], input[id="postal_code"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancelar"), a:has-text("Cancelar")');
  }

  async goto() {
    await this.page.goto('/dashboard/donations');
    await this.page.waitForLoadState('networkidle');
  }

  async createNewDonation(data: {
    title: string;
    description: string;
    category: string;
    quantity: number;
    condition: string;
    address: {
      street: string;
      city: string;
      province: string;
      postal_code: string;
    };
  }) {
    await this.newDonationButton.click();
    await this.page.waitForURL('**/donations/new');

    await this.titleInput.fill(data.title);
    await this.descriptionInput.fill(data.description);
    await this.categorySelect.selectOption({ label: data.category });
    await this.quantityInput.fill(data.quantity.toString());
    await this.conditionSelect.selectOption(data.condition);

    await this.streetInput.fill(data.address.street);
    await this.cityInput.fill(data.address.city);
    await this.provinceInput.fill(data.address.province);
    await this.postalCodeInput.fill(data.address.postal_code);

    await this.submitButton.click();
  }

  async searchDonations(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(status: string) {
    await this.filterStatus.selectOption(status);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByCategory(category: string) {
    await this.filterCategory.selectOption(category);
    await this.page.waitForLoadState('networkidle');
  }

  async getDonationsCount(): Promise<number> {
    return await this.donationCards.count();
  }

  async viewDonation(index: number) {
    const cards = await this.donationCards.all();
    if (cards[index]) {
      await cards[index].locator('a, button:has-text("Ver")').first().click();
    }
  }

  async editDonation(index: number) {
    const cards = await this.donationCards.all();
    if (cards[index]) {
      await cards[index].locator('a[href*="edit"], button:has-text("Editar")').first().click();
    }
  }

  async deleteDonation(index: number) {
    const cards = await this.donationCards.all();
    if (cards[index]) {
      await cards[index].locator('button:has-text("Eliminar"), button:has-text("Delete")').first().click();
      // Confirm deletion in modal
      await this.page.locator('button:has-text("Confirmar")').click();
    }
  }
}