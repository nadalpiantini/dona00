import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly statsCards: Locator;
  readonly navigationMenu: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  // Navigation links
  readonly donationsLink: Locator;
  readonly centersLink: Locator;
  readonly beneficiariesLink: Locator;
  readonly deliveriesLink: Locator;
  readonly messagesLink: Locator;
  readonly reportsLink: Locator;
  readonly profileLink: Locator;
  readonly settingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1').first();
    this.statsCards = page.locator('[class*="stat"], [class*="card"]');
    this.navigationMenu = page.locator('nav, [role="navigation"]');
    this.userMenu = page.locator('[aria-label*="user"], [class*="user-menu"]');
    this.logoutButton = page.locator('button:has-text("Cerrar"), button:has-text("Logout")');

    // Navigation
    this.donationsLink = page.locator('a[href*="/donations"]');
    this.centersLink = page.locator('a[href*="/centers"]');
    this.beneficiariesLink = page.locator('a[href*="/beneficiaries"]');
    this.deliveriesLink = page.locator('a[href*="/deliveries"]');
    this.messagesLink = page.locator('a[href*="/messages"]');
    this.reportsLink = page.locator('a[href*="/reports"]');
    this.profileLink = page.locator('a[href*="/profile"]');
    this.settingsLink = page.locator('a[href*="/settings"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async navigateTo(section: 'donations' | 'centers' | 'beneficiaries' | 'deliveries' | 'messages' | 'reports' | 'profile' | 'settings') {
    const links = {
      donations: this.donationsLink,
      centers: this.centersLink,
      beneficiaries: this.beneficiariesLink,
      deliveries: this.deliveriesLink,
      messages: this.messagesLink,
      reports: this.reportsLink,
      profile: this.profileLink,
      settings: this.settingsLink
    };

    await links[section].click();
    await this.page.waitForLoadState('networkidle');
  }

  async getStatsCount(): Promise<number> {
    return await this.statsCards.count();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  async waitForDashboardLoad() {
    await this.page.waitForSelector('h1', { timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }
}