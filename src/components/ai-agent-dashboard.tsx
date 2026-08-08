"use client";

import { useEffect, useMemo, useState } from "react";

type ArcNetworkData = {
  network: string;
  status: "online" | "unavailable";
  chainId: number;
  latestBlock?: string;
  blockAgeSeconds?: number;
  rpcLatencyMs?: number;
  explorerUrl: string;
  updatedAt: string;
};

const examples = [
  "Bridge 20 USDC to Arc",
  "Buy PUBG UC every Friday",
  "Pay Netflix every month",
  "Send receipt to Discord",
];

function formatTime(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function AIAgentDashboard() {
  const [network, setNetwork] = useState<ArcNetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [workflowDraft, setWorkflowDraft] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/arc-network", { cache: "no-store" });
        const data = (await response.json()) as ArcNetworkData;
        if (active) setNetwork(data);
      } catch {
        if (active) setNetwork(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    const interval = window.setInterval(load, 15_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        title: "Arc Network",
        lines: [
          loading ? "Checking RPC…" : network?.status === "online" ? "Online" : "Unavailable",
          network?.network || "Arc Testnet",
          network?.latestBlock ? `Latest block: #${network.latestBlock}` : "Live block unavailable",
        ],
        accent: "from-cyan-500/20 to-cyan-400/10",
        online: network?.status === "online",
      },
      {
        title: "RPC Telemetry",
        lines: [
          network?.rpcLatencyMs != null ? `Latency: ${network.rpcLatencyMs} ms` : "Latency: —",
          network?.blockAgeSeconds != null ? `Block age: ${network.blockAgeSeconds}s` : "Block age: —",
          `Chain ID: ${network?.chainId ?? 5042002}`,
        ],
        accent: "from-fuchsia-500/20 to-fuchsia-400/10",
        online: network?.status === "online",
      },
      {
        title: "Agent Runtime",
        lines: ["Interactive workflow draft", "No autonomous signing", "Testnet-only execution"],
        accent: "from-violet-500/20 to-cyan-500/10",
        online: true,
      },
      {
        title: "Data Provenance",
        lines: ["Live: Arc RPC telemetry", "Local: workflow preview", `Updated: ${formatTime(network?.updatedAt)}`],
        accent: "from-emerald-500/20 to-cyan-500/10",
        online: network?.status === "online",
      },
    ],
    [loading, network],
  );

  function generateDraft(value?: string) {
    const request = (value ?? prompt).trim();
    if (!request) return;

    const lower = request.toLowerCase();
    const steps = ["Connect wallet", "Validate Arc Testnet", "Apply spending policy"];
    if (lower.includes("bridge")) steps.push("Prepare Circle USDC bridge flow");
    if (lower.includes("every") || lower.includes("month") || lower.includes("friday")) steps.push("Create recurring schedule");
    if (lower.includes("discord") || lower.includes("receipt")) steps.push("Generate receipt notification");
    steps.push("Require user approval before signing", "Settle on Arc Testnet");

    setPrompt(request);
    setWorkflowDraft(steps.map((step, index) => `${index + 1}. ${step}`).join("\n"));
  }

  return (
    <section id="agent-dashboard" className="mx-auto mb-8 max-w-7xl scroll-mt-8">
      <div className="rounded-[2.25rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">AI Agent Dashboard</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Live Arc telemetry + workflow preview</h2>
            <p className="mt-2 text-sm text-slate-400">Network values come from Arc Testnet RPC. Agent actions remain approval-first and testnet-only.</p>
          </div>
          <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${network?.status === "online" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}>
            {loading ? "Checking" : network?.status === "online" ? "Arc Online" : "RPC Unavailable"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${card.accent} p-[1px]`}>
              <div className="rounded-[15px] border border-slate-800/80 bg-slate-950/85 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                  <span className={`h-2.5 w-2.5 rounded-full ${card.online ? "bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" : "bg-amber-400"}`} />
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  {card.lines.map((line) => <p key={line} className="leading-6">{line}</p>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-slate-900/70 to-fuchsia-500/10 p-4 shadow-[0_0_45px_rgba(34,211,238,0.1)] sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />Ask ArcPay
          </div>
          <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-4 shadow-[inset_0_0_25px_rgba(34,211,238,0.08)]">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") generateDraft(); }}
                placeholder="Describe a testnet payment workflow..."
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              />
              <button onClick={() => generateDraft()} className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20">
                Build draft
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-300">
              {examples.map((example) => (
                <button key={example} onClick={() => generateDraft(example)} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-cyan-200 transition hover:bg-cyan-400/20">
                  {example}
                </button>
              ))}
            </div>
            {workflowDraft && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/90 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-white">Generated workflow preview</p>
                  <a href="#workflow-builder" className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Open builder →</a>
                </div>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">{workflowDraft}</pre>
                <p className="mt-3 text-xs leading-5 text-slate-500">Preview only. ArcPay does not sign or broadcast a transaction without an explicit wallet approval flow.</p>
              </div>
            )}
          </div>
        </div>

        {network?.explorerUrl && (
          <div className="mt-4 text-right">
            <a href={network.explorerUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">Open Arc Testnet Explorer ↗</a>
          </div>
        )}
      </div>
    </section>
  );
}
