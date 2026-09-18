import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", testMatch: "**/*.spec.ts", fullyParallel: false, workers: 1,
  timeout: 45_000, use: { baseURL: "http://127.0.0.1:4318", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    { command: "node tests/e2e/rpc-fixture.mjs", url: "http://127.0.0.1:4319", reuseExistingServer: false },
    { command: "NEXT_PUBLIC_ARC_CHAIN_ID=5042002 NEXT_PUBLIC_ARC_CHAIN_NAME=\"Arc Testnet\" NEXT_PUBLIC_ARC_RPC_URL=http://127.0.0.1:4319 NEXT_PUBLIC_ARC_EXPLORER_URL=https://testnet.arcscan.app npm run build && npm run start -- --port 4318 --hostname 127.0.0.1", url: "http://127.0.0.1:4318", reuseExistingServer: false, timeout: 120_000,
      env: { NEXT_PUBLIC_ARC_CHAIN_ID: "5042002", NEXT_PUBLIC_ARC_CHAIN_NAME: "Arc Testnet", NEXT_PUBLIC_ARC_RPC_URL: "http://127.0.0.1:4319", NEXT_PUBLIC_ARC_EXPLORER_URL: "https://testnet.arcscan.app", ARC_TESTNET_RPC_URL: "http://127.0.0.1:4319", CIRCLE_API_KEY: "", CIRCLE_ENTITY_SECRET: "" } },
  ],
});
