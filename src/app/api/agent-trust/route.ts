import { NextResponse } from "next/server";
import { createPublicClient, http, type Address } from "viem";
import { arcTestnet } from "viem/chains";
import {
  ARC_ERC8004,
  ERC8004_REPUTATION_REGISTRY_ABI,
  ERC8004_VALIDATION_REGISTRY_ABI,
} from "@/lib/erc8004-arc";
import { ARCPAY_ERC8004_AGENT_ID } from "@/lib/erc8004";

export const dynamic = "force-dynamic";

function formatFixedPoint(value: bigint, decimals: number) {
  if (decimals <= 0) return value.toString();
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const raw = absolute.toString().padStart(decimals + 1, "0");
  const whole = raw.slice(0, -decimals);
  const fraction = raw.slice(-decimals).replace(/0+$/, "");
  const formatted = fraction ? `${whole}.${fraction}` : whole;
  return negative ? `-${formatted}` : formatted;
}

export async function GET() {
  const agentId = BigInt(
    Number(process.env.ERC8004_AGENT_ID ?? ARCPAY_ERC8004_AGENT_ID),
  );
  const rpcUrl = process.env.ARC_TESTNET_RPC_URL?.trim();
  const client = createPublicClient({
    chain: arcTestnet,
    transport: rpcUrl ? http(rpcUrl) : http(),
  });

  try {
    const clients = await client.readContract({
      address: ARC_ERC8004.reputationRegistry as Address,
      abi: ERC8004_REPUTATION_REGISTRY_ABI,
      functionName: "getClients",
      args: [agentId],
    });

    let reputation = {
      count: 0,
      score: null as string | null,
      decimals: 0,
      clientCount: clients.length,
    };

    if (clients.length > 0) {
      const [count, summaryValue, summaryValueDecimals] =
        await client.readContract({
          address: ARC_ERC8004.reputationRegistry as Address,
          abi: ERC8004_REPUTATION_REGISTRY_ABI,
          functionName: "getSummary",
          args: [agentId, [...clients], "", ""],
        });

      reputation = {
        count: Number(count),
        score: formatFixedPoint(summaryValue, summaryValueDecimals),
        decimals: summaryValueDecimals,
        clientCount: clients.length,
      };
    }

    const [validationCount, averageResponse] = await client.readContract({
      address: ARC_ERC8004.validationRegistry as Address,
      abi: ERC8004_VALIDATION_REGISTRY_ABI,
      functionName: "getSummary",
      args: [agentId, [], ""],
    });

    const requestHashes = await client.readContract({
      address: ARC_ERC8004.validationRegistry as Address,
      abi: ERC8004_VALIDATION_REGISTRY_ABI,
      functionName: "getAgentValidations",
      args: [agentId],
    });

    return NextResponse.json(
      {
        status: "ok",
        network: ARC_ERC8004.network,
        chainId: ARC_ERC8004.chainId,
        agentId: Number(agentId),
        reputation,
        validation: {
          count: Number(validationCount),
          averageResponse: Number(averageResponse),
          requestCount: requestHashes.length,
        },
        registries: {
          reputation: ARC_ERC8004.reputationRegistry,
          validation: ARC_ERC8004.validationRegistry,
        },
        updatedAt: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unavailable",
        network: ARC_ERC8004.network,
        chainId: ARC_ERC8004.chainId,
        agentId: Number(agentId),
        error: error instanceof Error ? error.message : "Unable to read ERC-8004 trust registries",
        updatedAt: new Date().toISOString(),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
