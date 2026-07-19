import { NextResponse } from "next/server";
import { CIRCLE_BLOCKCHAIN, getCircleConfiguration, isCircleConfigured } from "@/lib/circle-wallets";

export const runtime = "nodejs";

export function GET() {
  const { walletSetId } = getCircleConfiguration();

  return NextResponse.json({
    configured: isCircleConfigured(),
    blockchain: CIRCLE_BLOCKCHAIN,
    walletSetConfigured: Boolean(walletSetId),
  });
}
