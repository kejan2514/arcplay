"use client";

import { useCallback, useEffect, useState } from "react";
import { ARC_NETWORK } from "@/lib/arc-network";
import { BALANCE_REFRESH_EVENT } from "@/lib/demo-orders";

type BalanceStatus = "disconnected" | "wrong-network" | "loading" | "ready" | "error";

function formatUsdcBalance(value: string) {
  const amount = BigInt(value);
  const base = BigInt(10) ** BigInt(18);
  const whole = amount / base;
  const fraction = ((amount % base) * BigInt(10_000)) / base;
  return `${whole.toLocaleString("en-US")}.${fraction.toString().padStart(4, "0")}`;
}

export default function WalletBalance() {
  const [balance, setBalance] = useState("0.0000");
  const [status, setStatus] = useState<BalanceStatus>("loading");

  const loadBalance = useCallback(async () => {
    const provider = window.ethereum;
    if (!provider) {
      setStatus("disconnected");
      return;
    }

    try {
      const [accounts, chainId] = await Promise.all([
        provider.request<string[]>({ method: "eth_accounts" }),
        provider.request<string>({ method: "eth_chainId" }),
      ]);
      if (!accounts[0]) {
        setStatus("disconnected");
        return;
      }
      if (chainId.toLowerCase() !== ARC_NETWORK.chainIdHex.toLowerCase()) {
        setStatus("wrong-network");
        return;
      }

      setStatus("loading");
      const value = await provider.request<string>({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      setBalance(formatUsdcBalance(value));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const provider = window.ethereum;
    const refresh = () => void loadBalance();
    const handleAccountsChanged = () => refresh();
    const handleChainChanged = () => refresh();

    const initialRead = window.setTimeout(refresh, 0);
    provider?.on?.("accountsChanged", handleAccountsChanged);
    provider?.on?.("chainChanged", handleChainChanged);
    window.addEventListener(BALANCE_REFRESH_EVENT, refresh);

    return () => {
      window.clearTimeout(initialRead);
      provider?.removeListener?.("accountsChanged", handleAccountsChanged);
      provider?.removeListener?.("chainChanged", handleChainChanged);
      window.removeEventListener(BALANCE_REFRESH_EVENT, refresh);
    };
  }, [loadBalance]);

  const statusText = {
    disconnected: "Connect wallet to view",
    "wrong-network": "Switch to Arc Testnet",
    loading: "Reading Arc Testnet…",
    ready: "Native USDC balance",
    error: "Balance unavailable",
  }[status];

  return (
    <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 p-5 sm:min-w-[280px]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live balance</p>
        <span className={`h-2.5 w-2.5 rounded-full ${status === "ready" ? "bg-emerald-400" : "bg-slate-600"}`} />
      </div>
      <div className="mt-3 flex items-end justify-between gap-4">
        <span className="text-3xl font-semibold text-white">
          {status === "ready" ? balance : "—"}
        </span>
        <span className="text-sm font-medium text-cyan-300">USDC</span>
      </div>
      <p className="mt-4 text-sm text-slate-400">{statusText}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        Read directly from the connected wallet on Arc Testnet.
      </p>
    </div>
  );
}
