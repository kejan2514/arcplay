"use client";

import { useEffect, useState } from "react";

type TrustStatus = {
  status: "ok" | "unavailable";
  network: string;
  chainId: number;
  agentId: number;
  reputation?: {
    count: number;
    score: string | null;
    decimals: number;
    clientCount: number;
  };
  validation?: {
    count: number;
    averageResponse: number;
    requestCount: number;
  };
  updatedAt: string;
  error?: string;
};

export default function ERC8004TrustStatus() {
  const [data, setData] = useState<TrustStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/agent-trust", { cache: "no-store" });
        const payload = (await response.json()) as TrustStatus;
        if (active) setData(payload);
      } catch {
        if (active) setData(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    const timer = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Live ERC-8004 trust state</p>
          <p className="mt-1 text-sm text-slate-400">
            Reads the official Arc Testnet ReputationRegistry and ValidationRegistry without inventing scores.
          </p>
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
          {loading ? "Loading" : data?.status === "ok" ? "Onchain" : "Unavailable"}
        </span>
      </div>

      {data?.status === "ok" && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Agent ID</p>
            <p className="mt-2 text-xl font-semibold text-white">{data.agentId}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Reputation</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {data.reputation?.count ?? 0} feedback
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Score: {data.reputation?.score ?? "No signal yet"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Validation</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {data.validation?.count ?? 0} responses
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Requests: {data.validation?.requestCount ?? 0} · Avg: {data.validation?.averageResponse ?? 0}/100
            </p>
          </div>
        </div>
      )}

      {!loading && data?.status === "unavailable" && (
        <p className="mt-4 text-sm text-amber-200">
          Trust registry reads are temporarily unavailable. No reputation or validation value is inferred locally.
        </p>
      )}

      {!loading && !data && (
        <p className="mt-4 text-sm text-amber-200">Unable to load the trust endpoint.</p>
      )}
    </div>
  );
}
