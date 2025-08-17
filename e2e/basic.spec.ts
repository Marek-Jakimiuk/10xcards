import { test, expect } from "@playwright/test";

test.describe("Basic Application Tests", () => {
  test("should load the application", async ({ page }) => {
    await page.goto("/");

    // Should redirect to login or flashcards and have a title
    await expect(page).toHaveTitle(/10x Cards|Logowanie|Fiszki/);
  });

  test("should have navigation elements", async ({ page }) => {
    await page.goto("/login");

    // Should have logo/brand name
    await expect(page.locator("text=10x Cards")).toBeVisible();

    // Should have login form
    await expect(page.locator("h1")).toContainText("Logowanie");
  });

  test("should handle form interactions", async ({ page }) => {
    await page.goto("/login");

    // Find form elements by their type
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Elements should be visible
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Should be able to type in inputs
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");

    // Should have proper values
    await expect(emailInput).toHaveValue("test@example.com");
    await expect(passwordInput).toHaveValue("password123");
  });

  test("should have proper form validation", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Email field should have email validation
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(emailInput).toHaveAttribute("required");

    // Password field should have proper attributes
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(passwordInput).toHaveAttribute("required");
  });
});
