import { NextResponse } from "next/server";
import { CIRCLE_BLOCKCHAIN, getCircleConfiguration, isCircleConfigured } from "@/lib/circle-wallets";

export const runtime = "nodejs";

export function GET() {
  const { walletSetId, walletId, walletAddress } = getCircleConfiguration();

  return NextResponse.json({
    configured: isCircleConfigured(),
    blockchain: CIRCLE_BLOCKCHAIN,
    walletSetConfigured: Boolean(walletSetId),
    walletSetId: walletSetId || null,
    walletConfigured: Boolean(walletId && walletAddress),
    walletAddress: walletAddress || null,
  });
}
