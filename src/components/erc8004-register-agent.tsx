"use client";

import { useState } from "react";
import {
  createPublicClient,
  decodeEventLog,
  encodeFunctionData,
  http,
  type Address,
  type Hash,
} from "viem";
import { arcTestnet } from "viem/chains";
import {
  ARC_ERC8004,
  ERC8004_IDENTITY_REGISTRY_ABI,
} from "@/lib/erc8004-arc";

type RegistrationResult = {
  txHash: Hash;
  agentId?: string;
};

const chainIdHex = `0x${ARC_ERC8004.chainId.toString(16)}`;

async function ensureArcTestnet() {
  if (!window.ethereum) throw new Error("Browser wallet not found");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code !== 4902) throw error;

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainIdHex,
          chainName: "Arc Testnet",
          nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
          rpcUrls: ["https://rpc.testnet.arc.network"],
          blockExplorerUrls: ["https://testnet.arcscan.app"],
        },
      ],
    });
  }
}

export default function ERC8004RegisterAgent() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function registerAgent() {
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      if (!window.ethereum) throw new Error("Install or unlock an EVM browser wallet first.");
      await ensureArcTestnet();

      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });
      const account = accounts[0] as Address | undefined;
      if (!account) throw new Error("No wallet account available.");

      const agentURI = `${window.location.origin}/api/agent-registration`;
      const data = encodeFunctionData({
        abi: ERC8004_IDENTITY_REGISTRY_ABI,
        functionName: "register",
        args: [agentURI],
      });

      const txHash = await window.ethereum.request<Hash>({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: ARC_ERC8004.identityRegistry,
            data,
          },
        ],
      });

      const client = createPublicClient({ chain: arcTestnet, transport: http() });
      const receipt = await client.waitForTransactionReceipt({ hash: txHash });

      let agentId: string | undefined;
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== ARC_ERC8004.identityRegistry.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({
            abi: ERC8004_IDENTITY_REGISTRY_ABI,
            eventName: "Registered",
            data: log.data,
            topics: log.topics,
          });
          agentId = decoded.args.agentId.toString();
          break;
        } catch {
          // Ignore unrelated registry logs.
        }
      }

      setResult({ txHash, agentId });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Register ArcPay Agent on Arc Testnet</p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
            This calls the official ERC-8004 IdentityRegistry with ArcPay&apos;s live registration JSON. Your wallet shows the transaction before anything is signed.
          </p>
        </div>
        <button
          onClick={registerAgent}
          disabled={busy}
          className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Waiting for wallet…" : "Register on Arc Testnet"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

      {result && (
        <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-slate-300">
          <p className="font-semibold text-emerald-300">Registration transaction confirmed.</p>
          {result.agentId && (
            <p className="mt-2">Agent ID: <code className="text-white">{result.agentId}</code></p>
          )}
          <a
            className="mt-2 inline-block text-cyan-300 hover:text-cyan-200"
            href={`https://testnet.arcscan.app/tx/${result.txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View transaction on Arcscan ↗
          </a>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            After registration, set ERC8004_AGENT_ID to the confirmed Agent ID in the deployment environment so the public registration JSON can advertise the onchain identity.
          </p>
        </div>
      )}
    </div>
  );
}
