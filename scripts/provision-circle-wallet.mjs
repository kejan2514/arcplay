import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const envPath = ".env.local";
const apiKey = process.env.CIRCLE_API_KEY;
const entitySecret = process.env.CIRCLE_ENTITY_SECRET;

if (!apiKey || !entitySecret) {
  throw new Error("CIRCLE_API_KEY and CIRCLE_ENTITY_SECRET are required in .env.local.");
}

const client = initiateDeveloperControlledWalletsClient({ apiKey, entitySecret });
const walletSetResponse = await client.createWalletSet({ name: "ArcPay Testnet" });
const walletSetId = walletSetResponse.data?.walletSet?.id;

if (!walletSetId) {
  throw new Error("Circle did not return a wallet set ID.");
}

const walletResponse = await client.createWallets({
  walletSetId,
  blockchains: ["ARC-TESTNET"],
  count: 1,
  accountType: "EOA",
});
const wallet = walletResponse.data?.wallets?.[0];

if (!wallet?.id || !wallet.address) {
  throw new Error("Circle did not return a wallet.");
}

const currentEnv = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const walletSetLine = `CIRCLE_WALLET_SET_ID=${walletSetId}`;
let nextEnv = /^CIRCLE_WALLET_SET_ID=.*$/m.test(currentEnv)
  ? currentEnv.replace(/^CIRCLE_WALLET_SET_ID=.*$/m, walletSetLine)
  : `${currentEnv.trimEnd()}\n${walletSetLine}\n`;
for (const [key, value] of [["CIRCLE_WALLET_ID", wallet.id], ["CIRCLE_WALLET_ADDRESS", wallet.address]]) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  nextEnv = pattern.test(nextEnv) ? nextEnv.replace(pattern, line) : `${nextEnv.trimEnd()}\n${line}\n`;
}

writeFileSync(envPath, nextEnv, { mode: 0o600 });
writeFileSync(".circle-wallet.json", JSON.stringify({
  walletSetId,
  wallet: {
    id: wallet.id,
    address: wallet.address,
    blockchain: wallet.blockchain,
    accountType: wallet.accountType,
  },
}, null, 2), { mode: 0o600 });

console.log("Circle Arc Testnet wallet provisioned successfully.");
console.log(`Wallet address: ${wallet.address}`);
console.log("Wallet set ID saved to .env.local.");
console.log("Local wallet metadata saved to .circle-wallet.json.");
