import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://pay.google.com/**", (route) => route.abort());
});

test("catalog selection hands off to a saved, editable draft without creating a payment", async ({ page }) => {
  const writes: string[] = [];
  const errors: string[] = [];
  page.on("request", (request) => { if (request.method() === "POST") writes.push(request.url()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your next game.");
  await page.getByRole("button", { name: /Free Fire Diamonds/ }).click();
  await page.getByRole("button", { name: "520 Diamonds 6.99 test USDC", exact: true }).click();
  await page.getByRole("link", { name: "Create a recurring draft for this package →" }).click();
  await expect(page.getByLabel("Game", { exact: true })).toHaveValue("free-fire");
  await expect(page.getByLabel("Package", { exact: true })).toHaveValue("520-diamonds");
  await page.getByLabel("Demo Player ID", { exact: true }).fill("sample-player");
  await page.getByLabel("Allowed recipient wallet").fill(`0x${"2".repeat(40)}`);
  await page.getByLabel("Per-payment limit (test USDC)").fill("1.00");
  await page.getByRole("button", { name: "Save workflow draft" }).click();
  await expect(page.getByRole("status")).toContainText("must cover the selected catalog price");
  await page.getByLabel("Per-payment limit (test USDC)").fill("7.00");
  await page.getByRole("button", { name: "Save workflow draft" }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved in this browser");
  await page.reload();
  await expect(page.getByText("Draft · not running", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Edit draft" }).click();
  await expect(page.getByLabel("Demo Player ID", { exact: true })).toHaveValue("sample-player");
  await page.getByLabel("Repeat", { exact: true }).selectOption("monthly");
  await page.getByLabel("Schedule day").selectOption("15");
  await page.getByRole("button", { name: "Save changes to draft" }).click();
  await page.getByRole("button", { name: "Pause draft" }).click();
  await expect(page.getByText("Paused draft", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Paused draft", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Restore draft" }).click();
  await expect(page.getByText("Monthly on day 15", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("arcplay-workflow-drafts-v1")!).length)).toBe(1);
  expect(writes).toEqual([]);
  expect(errors).toEqual([]);
});

test("template navigation refreshes the builder and damaged storage is ignored", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("arcplay-workflow-drafts-v1", "corrupt"));
  await page.goto("/automations");
  await page.getByRole("link", { name: /Monthly gaming budget/ }).click();
  await expect(page.getByLabel("Game", { exact: true })).toHaveValue("steam");
  await expect(page.getByLabel("Repeat", { exact: true })).toHaveValue("monthly");
  await expect(page.getByText("Save your first draft above to review it here.")).toBeVisible();
});

test("all product screens fit a phone and bridge IDs are unique", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/automations", "/bridge", "/activity", "/developers", "/ecosystem"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
  }
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Bridge", exact: true }).click();
  await expect(page.locator("#bridge")).toHaveCount(1);
  await expect(page.locator("#bridge-amount")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Bridge", exact: true })).toHaveAttribute("aria-current", "page");
});

test("missing trust observations do not become a zero validation score", async ({ page }) => {
  await page.route("**/api/agent-trust", (route) => route.fulfill({ json: { status: "ok", chainId: 5042002, agentId: 892445, identity: { owner: `0x${"1".repeat(40)}`, uriMatches: true }, reputation: { count: 0, score: null }, validation: { count: 0, averageResponse: 0, requestCount: 0 } } }));
  await page.goto("/developers");
  await expect(page.getByText("No validation signal yet", { exact: false })).toBeVisible();
  await expect(page.getByText("Avg: 0/100", { exact: false })).toHaveCount(0);
});
