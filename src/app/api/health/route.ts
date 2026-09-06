import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { arcTestnet } from "viem/chains";
import { getArcHealthStatus, isFreshArcBlock } from "@/lib/arc-health";

const ARC_RPC_URL = process.env.ARC_TESTNET_RPC_URL || "https://rpc.testnet.arc.network";

export async function GET() {
  const client = createPublicClient({
    chain: arcTestnet,
    transport: http(ARC_RPC_URL, { timeout: 8_000 }),
  });

  const startedAt = Date.now();

  try {
    const blockNumber = await client.getBlockNumber();
    const block = await client.getBlock({ blockNumber });
    const latencyMs = Date.now() - startedAt;
    const blockTimestampMs = Number(block.timestamp) * 1000;
    const blockAgeSeconds = Math.max(0, Math.round((Date.now() - blockTimestampMs) / 1000));
    const status = getArcHealthStatus(blockAgeSeconds);
    const healthy = status === "ok";

    return NextResponse.json(
      {
        service: "ArcPay",
        status,
        network: "Arc Testnet",
        chainId: arcTestnet.id,
        latestBlock: blockNumber.toString(),
        blockAgeSeconds,
        rpcLatencyMs: latencyMs,
        checks: {
          rpcReachable: true,
          blockFresh: isFreshArcBlock(blockAgeSeconds),
        },
        updatedAt: new Date().toISOString(),
      },
      {
        status: healthy ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("ArcPay health check failed", error);

    return NextResponse.json(
      {
        service: "ArcPay",
        status: getArcHealthStatus(Number.POSITIVE_INFINITY, false),
        network: "Arc Testnet",
        chainId: arcTestnet.id,
        checks: {
          rpcReachable: false,
          blockFresh: false,
        },
        updatedAt: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
