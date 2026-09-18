import { test, expect, type Page } from "@playwright/test";
const sender = `0x${"1".repeat(40)}`;
async function setup(page: Page, mode = "success") {
  await page.route("https://pay.google.com/**", (route) => route.abort());
  await page.route("**/api/agent-trust", (route) => route.fulfill({ json: { configured: false } }));
  await page.addInitScript(({ sender, mode }) => {
    const target = window as unknown as { ethereum: unknown; sends: number };
    target.sends = 0;
    target.ethereum = {
      on() {}, removeListener() {},
      async request({ method }: { method: string }) {
        if (method === "eth_accounts" || method === "eth_requestAccounts") return [sender];
        if (method === "eth_chainId") return mode === "wrong-network" ? "0x1" : "0x4cef52";
        if (method === "eth_getBalance") return "0xde0b6b3a7640000";
        if (method === "eth_sendTransaction") {
          if (mode === "cancel") throw { code: 4001 };
          if (mode === "insufficient") throw { message: "insufficient funds for gas" };
          target.sends++;
          return `0x${(mode === "pending" ? "c" : mode === "reverted" ? "d" : "a").repeat(64)}`;
        }
        throw new Error(`Unsupported wallet method ${method}`);
      },
    };
  }, { sender, mode });
  await page.goto("/");
  await page.locator("#account-id").fill("demo-player");
}

test("checkout reaches real server verifier, renders receipt and downloads JSON", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await setup(page);
  await page.getByRole("button", { name: "Create test order", exact: true }).click();
  await expect(page.getByText("Self-transfer confirmed on Arc Testnet. No product was delivered.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Payment proof verified" })).toBeVisible();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.getByText("0 test USDC / 0.000021 test USDC").first()).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download proof JSON" }).first().click();
  expect((await download).suggestedFilename()).toMatch(/^arc-proof-0x/);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("arcplay-demo-orders")!)[0].status)).toBe("confirmed");
  expect(errors).toEqual([]);
});

test("pending checkout survives reload; recheck never resends or claims success", async ({ page }) => {
  await setup(page, "pending");
  await page.getByRole("button", { name: "Create test order", exact: true }).click();
  await expect(page.getByText("Confirmation is still pending.", { exact: false })).toBeVisible({ timeout: 25_000 });
  await expect(page.getByRole("heading", { name: "Payment proof verified" })).toHaveCount(0);
  expect(await page.evaluate(() => (window as unknown as { sends: number }).sends)).toBe(1);
  await page.reload();
  await expect(page.getByText("Awaiting confirmation", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Check status · no new transaction", exact: true }).click();
  await expect(page.getByText("Awaiting an onchain receipt.", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { sends: number }).sends)).toBe(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("arcplay-demo-orders")!).length)).toBe(1);
});

for (const [mode, message] of [["cancel", "Transaction cancelled in your wallet."], ["insufficient", "Not enough test USDC"], ["reverted", "The transaction reverted."]]) {
  test(`${mode} does not display a successful payment`, async ({ page }) => {
    await setup(page, mode);
    await page.getByRole("button", { name: "Create test order", exact: true }).click();
    await expect(page.getByText(message, { exact: false })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Payment proof verified" })).toHaveCount(0);
  });
}

test("wrong network disables checkout and mobile page fits the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page, "wrong-network");
  await expect(page.getByRole("button", { name: "Switch to Arc to Pay" })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("API rejects malformed requests and live telemetry reads the configured RPC", async ({ request }) => {
  const invalid = await request.post("/api/payment-proof", { data: { hash: "oops" } });
  expect(invalid.status()).toBe(400);
  const network = await request.get("/api/arc-network");
  expect(await network.json()).toMatchObject({ chainId: 5042002, latestBlock: "100", status: "online" });
});
