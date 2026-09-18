import { NextResponse } from "next/server";
import { isProofRequest, verifyPaymentProof, type RpcRequest } from "@/lib/payment-proof";

const headers = { "Cache-Control": "no-store" };
export async function POST(request: Request) {
  const input: unknown = await request.json().catch(() => null);
  if (!isProofRequest(input)) return NextResponse.json({ error: "Provide a transaction hash, sender address and wallet/circle kind." }, { status: 400, headers });
  const rpc: RpcRequest = async <T,>(method: string, params: unknown[] = []) => {
    const response = await fetch(process.env.ARC_TESTNET_RPC_URL || "https://rpc.testnet.arc.network", {
      method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }), signal: AbortSignal.timeout(8_000),
    });
    const data = await response.json();
    if (!response.ok || data.error || !("result" in data)) throw new Error("RPC unavailable");
    return data.result as T;
  };
  const result = await verifyPaymentProof(input, rpc);
  return NextResponse.json(result, { status: result.status === "unavailable" ? 503 : 200, headers });
}
