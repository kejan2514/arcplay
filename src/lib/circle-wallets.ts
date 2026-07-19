import "server-only";

import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

export const CIRCLE_BLOCKCHAIN = "ARC-TESTNET" as const;

export function getCircleConfiguration() {
  return {
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET,
    walletSetId: process.env.CIRCLE_WALLET_SET_ID,
    walletId: process.env.CIRCLE_WALLET_ID,
    walletAddress: process.env.CIRCLE_WALLET_ADDRESS,
  };
}

export function isCircleConfigured() {
  const config = getCircleConfiguration();
  return Boolean(config.apiKey && config.entitySecret);
}

export function getCircleClient() {
  const { apiKey, entitySecret } = getCircleConfiguration();

  if (!apiKey || !entitySecret) {
    throw new Error("Circle developer-controlled wallets are not configured.");
  }

  return initiateDeveloperControlledWalletsClient({ apiKey, entitySecret });
}
