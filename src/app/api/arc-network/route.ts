import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { arcTestnet } from "viem/chains";

const ARC_RPC_URL = process.env.ARC_TESTNET_RPC_URL || "https://rpc.testnet.arc.network";

export async function GET() {
  const client = createPublicClient({
    chain: arcTestnet,
    transport: http(ARC_RPC_URL, { timeout: 10_000 }),
  });

  const startedAt = Date.now();

  try {
    const [blockNumber, chainId] = await Promise.all([
      client.getBlockNumber(),
      client.getChainId(),
    ]);
    const block = await client.getBlock({ blockNumber });
    const latencyMs = Date.now() - startedAt;
    const blockTimestampMs = Number(block.timestamp) * 1000;
    const blockAgeSeconds = Math.max(0, Math.round((Date.now() - blockTimestampMs) / 1000));

    return NextResponse.json(
      {
        network: "Arc Testnet",
        status: "online",
        chainId,
        latestBlock: blockNumber.toString(),
        blockTimestamp: new Date(blockTimestampMs).toISOString(),
        blockAgeSeconds,
        rpcLatencyMs: latencyMs,
        explorerUrl: "https://testnet.arcscan.app",
        rpcHost: new URL(ARC_RPC_URL).host,
        updatedAt: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Arc Testnet telemetry request failed", error);
    return NextResponse.json(
      {
        network: "Arc Testnet",
        status: "unavailable",
        chainId: arcTestnet.id,
        explorerUrl: "https://testnet.arcscan.app",
        updatedAt: new Date().toISOString(),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
