import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class FlashcardsPage extends BasePage {
  readonly flashcardsList: Locator;
  readonly addFlashcardButton: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly pagination: Locator;
  readonly deckSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.flashcardsList = this.page.locator('[data-testid="flashcards-list"]');
    this.addFlashcardButton = this.page.locator('[data-testid="add-flashcard-button"]');
    this.searchInput = this.page.locator('[data-testid="search-input"]');
    this.statusFilter = this.page.locator('[data-testid="status-filter"]');
    this.pagination = this.page.locator('[data-testid="pagination"]');
    this.deckSelect = this.page.locator('[data-testid="deck-select"]');
  }

  async goto() {
    await super.goto("/flashcards");
  }

  async searchFlashcards(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press("Enter");
  }

  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status);
  }

  async selectDeck(deckName: string) {
    await this.deckSelect.selectOption(deckName);
  }

  async getFlashcardCount() {
    return await this.flashcardsList.locator('[data-testid="flashcard-item"]').count();
  }

  async clickFlashcard(index: number) {
    await this.flashcardsList.locator('[data-testid="flashcard-item"]').nth(index).click();
  }

  async expectFlashcardsVisible() {
    await this.expectToBeVisible(this.flashcardsList);
  }
}
