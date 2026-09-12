import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  CIRCLE_BLOCKCHAIN,
  getCircleClient,
  getCircleConfiguration,
  isCircleConfigured,
} from "@/lib/circle-wallets";

export const runtime = "nodejs";

const PROOF_AMOUNT = "0.01";

function dailyIdempotencyKey(walletId: string) {
  const date = new Date().toISOString().slice(0, 10);
  const bytes = Buffer.from(createHash("sha256").update(`arcpay-circle-proof:${walletId}:${date}`).digest());
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.subarray(0, 16).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function publicTransaction(transaction: {
  id: string;
  state: string;
  txHash?: string;
  networkFee?: string;
  errorReason?: string;
}) {
  return {
    id: transaction.id,
    state: transaction.state,
    txHash: transaction.txHash ?? null,
    networkFee: transaction.networkFee ?? null,
    error: transaction.errorReason ?? null,
    amount: PROOF_AMOUNT,
    blockchain: CIRCLE_BLOCKCHAIN,
  };
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "A valid Circle transaction ID is required." }, { status: 400 });
  }

  try {
    const response = await getCircleClient().getTransaction({ id });
    const transaction = response.data?.transaction;
    if (!transaction) throw new Error("Circle transaction was not found.");
    return NextResponse.json({ transaction: publicTransaction(transaction) });
  } catch (error) {
    console.error("Circle payment status lookup failed", error);
    return NextResponse.json({ error: "Circle transaction status could not be loaded." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const { walletId, walletAddress } = getCircleConfiguration();
  if (!isCircleConfigured() || !walletId || !walletAddress) {
    return NextResponse.json({ error: "Circle payment wallet is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { confirmed?: boolean } | null;
  if (body?.confirmed !== true) {
    return NextResponse.json({ error: "Test payment confirmation is required." }, { status: 400 });
  }

  try {
    const client = getCircleClient();
    const balanceResponse = await client.getWalletTokenBalance({ id: walletId, includeAll: true });
    const usdc = (balanceResponse.data?.tokenBalances ?? [])
      .filter((balance) => balance.token?.symbol === "USDC" && balance.token?.id)
      .sort((left, right) => Number(right.amount) - Number(left.amount))[0];

    if (!usdc?.token?.id || Number(usdc.amount) < Number(PROOF_AMOUNT)) {
      return NextResponse.json({ error: "The Circle wallet needs at least 0.01 test USDC." }, { status: 409 });
    }

    const date = new Date().toISOString().slice(0, 10);
    const response = await client.createTransaction({
      walletId,
      tokenId: usdc.token.id,
      destinationAddress: walletAddress,
      amount: [PROOF_AMOUNT],
      refId: `arcpay-daily-proof-${date}`,
      idempotencyKey: dailyIdempotencyKey(walletId),
      fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    });
    const transaction = response.data;
    if (!transaction?.id) throw new Error("Circle did not return a transaction ID.");

    return NextResponse.json({
      transaction: {
        id: transaction.id,
        state: transaction.state,
        txHash: null,
        amount: PROOF_AMOUNT,
        blockchain: CIRCLE_BLOCKCHAIN,
      },
      note: "Daily capped self-transfer proof; no product price was charged.",
    });
  } catch (error) {
    console.error("Circle payment proof creation failed", error);
    return NextResponse.json({ error: "Circle could not create the test payment proof." }, { status: 502 });
  }
}
