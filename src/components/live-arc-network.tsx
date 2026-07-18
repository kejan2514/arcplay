const networkCards = [
  { title: "Arc Testnet Status", value: "Online", detail: "Healthy", accent: "from-emerald-500/20 to-cyan-500/10" },
  { title: "Latest Block", value: "#184932", detail: "7.2s ago", accent: "from-cyan-500/20 to-cyan-400/10" },
  { title: "RPC Latency", value: "18ms", detail: "Fast sync", accent: "from-fuchsia-500/20 to-fuchsia-400/10" },
  { title: "Connected Wallet", value: "0xA91F…7C2B", detail: "Arc Testnet", accent: "from-violet-500/20 to-cyan-500/10" },
  { title: "Native USDC Balance", value: "245.00", detail: "USDC", accent: "from-emerald-500/20 to-emerald-400/10" },
  { title: "Active AI Agents", value: "3", detail: "Running", accent: "from-cyan-500/20 to-fuchsia-500/10" },
];

export default function LiveArcNetwork() {
  return (
    <section className="mx-auto mb-8 max-w-7xl">
      <div className="rounded-[2.25rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Live Arc Network</p><h2 className="mt-2 text-3xl font-bold text-white">Real-time infrastructure status</h2></div>
          <span className="inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">Testnet preview</span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {networkCards.map((card) => (
            <div key={card.title} className={`rounded-[1.4rem] border border-slate-800 bg-gradient-to-br ${card.accent} p-[1px]`}>
              <div className="rounded-[1.3rem] border border-slate-800/80 bg-slate-950/85 p-5">
                <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-400">{card.title}</p><p className="mt-2 text-2xl font-semibold text-white">{card.value}</p></div><div className="relative flex h-3.5 w-3.5 items-center justify-center"><span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-cyan-400/70" /><span className="relative h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" /></div></div>
                <p className="mt-4 text-sm text-slate-400">{card.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
