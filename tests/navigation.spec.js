const { test, expect } = require("@playwright/test");

test.describe("Navigation Component Tests", () => {
  test.beforeAll(async () => {
    console.log("Setup before all tests");
  });

  test.afterAll(async () => {
    console.log("Cleanup after all tests");
  });

  test.beforeEach(async ({ page }) => {
    console.log("Before each test open browser");
    await page.goto("http://localhost:3000/");
  });

  test.afterEach(async ({ page }) => {
    console.log("After each test close browser");
    await page.close();
  });

  test("Navigation renders correctly", async ({ page }) => {
    console.log("Checking navigation bar visibility");
    const header = await page.locator("header");
    const sidebar = await page.locator("aside");
    await expect(header).toBeVisible();
    await expect(sidebar).toBeVisible();
  });

  test("Navigation links", async ({ page }) => {
    console.log("Testing navigation links");
    const calendarLink = await page.locator('a:has-text("Calendar")');
    await expect(calendarLink).toHaveAttribute("href", "/");
    await calendarLink.click();
    await expect(page).toHaveURL("http://localhost:3000/");

    const signInLink = await page.locator('a:has-text("Sign In")');
    await expect(signInLink).toHaveAttribute("href", "/public/user/signin");
    await signInLink.click();
    await expect(page).toHaveURL("http://localhost:3000/public/user/signin");
  });

  test("User section visibility", async ({ page }) => {
    console.log("Checking user section");
    const userSection = await page.locator(".p-4.border-t");
    const userProfileLink = await page.locator('a:has-text("Profile")');
    const signOutLink = await page.locator('a:has-text("Sign Out")');

    // Assuming mock authentication for testing purposes
    if (await userSection.isVisible()) {
      await expect(userProfileLink).toBeVisible();
      await expect(signOutLink).toBeVisible();
    } else {
      const signInLink = await page.locator('a:has-text("Sign In")');
      const registerLink = await page.locator('a:has-text("Register")');
      await expect(signInLink).toBeVisible();
      await expect(registerLink).toBeVisible();
    }
  });
});
