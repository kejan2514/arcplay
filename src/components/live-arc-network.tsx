"use client";

import { useEffect, useMemo, useState } from "react";

type ArcTelemetry = {
  network: string;
  status: "online" | "unavailable";
  chainId: number;
  latestBlock?: string;
  blockTimestamp?: string;
  blockAgeSeconds?: number;
  rpcLatencyMs?: number;
  explorerUrl: string;
  rpcHost?: string;
  updatedAt: string;
};

const fallbackCards = [
  { title: "Arc Testnet", value: "Connecting…", detail: "Waiting for RPC", accent: "from-emerald-500/20 to-cyan-500/10" },
  { title: "Latest Block", value: "—", detail: "Live RPC", accent: "from-cyan-500/20 to-cyan-400/10" },
  { title: "RPC Latency", value: "—", detail: "Measured server-side", accent: "from-fuchsia-500/20 to-fuchsia-400/10" },
  { title: "Chain ID", value: "5042002", detail: "Arc Testnet", accent: "from-violet-500/20 to-cyan-500/10" },
  { title: "Block Age", value: "—", detail: "Latest observed block", accent: "from-emerald-500/20 to-emerald-400/10" },
  { title: "Explorer", value: "ArcScan", detail: "testnet.arcscan.app", accent: "from-cyan-500/20 to-fuchsia-500/10" },
];

export default function LiveArcNetwork() {
  const [telemetry, setTelemetry] = useState<ArcTelemetry | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/arc-network", { cache: "no-store" });
        if (!response.ok) throw new Error("Arc RPC unavailable");
        const data = (await response.json()) as ArcTelemetry;
        if (active) {
          setTelemetry(data);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    }

    void load();
    const timer = window.setInterval(load, 15_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const cards = useMemo(() => {
    if (!telemetry) return fallbackCards;
    return [
      {
        title: "Arc Testnet",
        value: telemetry.status === "online" ? "Online" : "Unavailable",
        detail: telemetry.rpcHost || "Official Arc RPC",
        accent: "from-emerald-500/20 to-cyan-500/10",
      },
      {
        title: "Latest Block",
        value: telemetry.latestBlock ? `#${Number(telemetry.latestBlock).toLocaleString()}` : "—",
        detail: "Live RPC",
        accent: "from-cyan-500/20 to-cyan-400/10",
      },
      {
        title: "RPC Latency",
        value: telemetry.rpcLatencyMs != null ? `${telemetry.rpcLatencyMs} ms` : "—",
        detail: "Server-side round trip",
        accent: "from-fuchsia-500/20 to-fuchsia-400/10",
      },
      {
        title: "Chain ID",
        value: String(telemetry.chainId),
        detail: "Verified from RPC",
        accent: "from-violet-500/20 to-cyan-500/10",
      },
      {
        title: "Block Age",
        value: telemetry.blockAgeSeconds != null ? `${telemetry.blockAgeSeconds}s` : "—",
        detail: telemetry.blockTimestamp ? new Date(telemetry.blockTimestamp).toLocaleTimeString() : "Latest observed block",
        accent: "from-emerald-500/20 to-emerald-400/10",
      },
      {
        title: "Explorer",
        value: "ArcScan",
        detail: "Open live testnet explorer",
        accent: "from-cyan-500/20 to-fuchsia-500/10",
      },
    ];
  }, [telemetry]);

  const readiness = [
    { label: "Wallet connectivity", state: "Implemented" },
    { label: "Circle wallet backend", state: "Implemented" },
    { label: "USDC bridge flow", state: "Implemented" },
    { label: "Live Arc telemetry", state: telemetry?.status === "online" ? "Live" : "Connecting" },
  ];

  return (
    <section className="mx-auto mb-8 max-w-7xl">
      <div className="rounded-[2.25rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Live Arc Network</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Real-time Arc Testnet telemetry</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              ArcPay now reads Arc Testnet directly through a server-side JSON-RPC route and refreshes this panel every 15 seconds.
            </p>
          </div>
          <span className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold ${error ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"}`}>
            {error ? "RPC unavailable" : telemetry ? "Live • Testnet" : "Connecting…"}
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className={`rounded-[1.4rem] border border-slate-800 bg-gradient-to-br ${card.accent} p-[1px]`}>
              <div className="rounded-[1.3rem] border border-slate-800/80 bg-slate-950/85 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{card.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
                  </div>
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${error ? "bg-rose-300" : "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]"}`} />
                </div>
                <p className="mt-4 text-sm text-slate-400">{card.detail}</p>
                {card.title === "Explorer" && telemetry?.explorerUrl ? (
                  <a className="mt-3 inline-block text-sm font-semibold text-cyan-300 hover:text-cyan-200" href={telemetry.explorerUrl} target="_blank" rel="noreferrer">
                    Open explorer ↗
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.4rem] border border-slate-800 bg-slate-950/75 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Integration readiness</p>
              <p className="mt-1 text-sm text-slate-400">
                Live network data comes from the Arc Testnet RPC; payment and wallet modules remain testnet-only.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              {telemetry?.updatedAt ? `Updated ${new Date(telemetry.updatedAt).toLocaleTimeString()}` : "Live data"}
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {readiness.map((item) => {
              const ready = item.state === "Implemented" || item.state === "Live";
              return (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className={`mt-2 text-sm font-semibold ${ready ? "text-emerald-300" : "text-amber-300"}`}>
                    {ready ? "● " : "○ "}{item.state}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
