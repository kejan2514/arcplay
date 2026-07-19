import { existsSync, readFileSync, writeFileSync } from "node:fs";

if (!existsSync(".circle-wallet.json")) {
  throw new Error(".circle-wallet.json is missing. Provision a wallet first.");
}

const metadata = JSON.parse(readFileSync(".circle-wallet.json", "utf8"));
const envPath = ".env.local";
let env = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const values = {
  CIRCLE_WALLET_SET_ID: metadata.walletSetId,
  CIRCLE_WALLET_ID: metadata.wallet?.id,
  CIRCLE_WALLET_ADDRESS: metadata.wallet?.address,
};

for (const [key, value] of Object.entries(values)) {
  if (!value) throw new Error(`${key} is missing from local wallet metadata.`);
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  env = pattern.test(env) ? env.replace(pattern, line) : `${env.trimEnd()}\n${line}\n`;
}

writeFileSync(envPath, env, { mode: 0o600 });
console.log("Existing Circle wallet metadata synced to .env.local.");
