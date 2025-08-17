import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.locator('input[type="email"]');
    this.passwordInput = this.page.locator('input[type="password"]');
    this.loginButton = this.page.locator('button[type="submit"]');
    this.errorMessage = this.page.locator('.text-red-500, .text-destructive, [role="alert"]');
    this.registerLink = this.page.locator('a[href="/register"]');
  }

  async goto() {
    await super.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorMessage(message: string) {
    await this.expectToHaveText(this.errorMessage, message);
  }

  async goToRegister() {
    await this.registerLink.click();
  }
}
