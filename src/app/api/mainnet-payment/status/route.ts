import { NextResponse } from "next/server";
import { isAddress } from "@/lib/payment-proof";

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  const enabled = process.env.ARC_ENABLE_MAINNET_PAYMENTS === "true";
  const merchantAddress = process.env.ARC_MERCHANT_ADDRESS ?? "";
  const maxPaymentUsdc = Number(process.env.ARC_MAX_PAYMENT_USDC ?? "25");
  const configured = enabled && isAddress(merchantAddress) && Number.isFinite(maxPaymentUsdc) && maxPaymentUsdc > 0;

  return NextResponse.json({
    enabled: configured,
    chainId: 5042,
    merchantConfigured: isAddress(merchantAddress),
    maxPaymentUsdc: Number.isFinite(maxPaymentUsdc) && maxPaymentUsdc > 0 ? maxPaymentUsdc : null,
  }, { headers });
}
