const networkCards = [
  { title: "Arc Testnet", value: "Configured", detail: "Demo network target", accent: "from-emerald-500/20 to-cyan-500/10" },
  { title: "Wallet Layer", value: "Ready", detail: "Browser wallet + Circle DCW", accent: "from-cyan-500/20 to-cyan-400/10" },
  { title: "Settlement Asset", value: "USDC", detail: "Testnet-only flows", accent: "from-fuchsia-500/20 to-fuchsia-400/10" },
  { title: "Payment Policy", value: "Rules", detail: "Limits + approvals", accent: "from-violet-500/20 to-cyan-500/10" },
  { title: "Bridge Layer", value: "Circle", detail: "Bridge Kit integration", accent: "from-emerald-500/20 to-emerald-400/10" },
  { title: "Agent Runtime", value: "Demo", detail: "Workflow orchestration", accent: "from-cyan-500/20 to-fuchsia-500/10" },
];

const readiness = [
  { label: "Wallet connectivity", state: "Implemented" },
  { label: "Circle wallet backend", state: "Implemented" },
  { label: "USDC bridge flow", state: "Implemented" },
  { label: "Live Arc telemetry", state: "Roadmap" },
];

export default function LiveArcNetwork() {
  return (
    <section className="mx-auto mb-8 max-w-7xl">
      <div className="rounded-[2.25rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Arc Infrastructure</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Integration readiness</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              This panel reports what ArcPay has implemented. It intentionally avoids presenting hard-coded demo numbers as live network telemetry.
            </p>
          </div>
          <span className="inline-flex items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200">
            Testnet • Demo
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {networkCards.map((card) => (
            <div key={card.title} className={`rounded-[1.4rem] border border-slate-800 bg-gradient-to-br ${card.accent} p-[1px]`}>
              <div className="rounded-[1.3rem] border border-slate-800/80 bg-slate-950/85 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-400">{card.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
                  </div>
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                </div>
                <p className="mt-4 text-sm text-slate-400">{card.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.4rem] border border-slate-800 bg-slate-950/75 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Production-readiness checklist</p>
              <p className="mt-1 text-sm text-slate-400">Live Arc RPC metrics remain a roadmap item until a verified provider is connected.</p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Data provenance</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {readiness.map((item) => {
              const implemented = item.state === "Implemented";
              return (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className={`mt-2 text-sm font-semibold ${implemented ? "text-emerald-300" : "text-amber-300"}`}>
                    {implemented ? "● " : "○ "}{item.state}
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
