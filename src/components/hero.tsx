const actions = [
  { label: "Launch Agent", href: "#agent-dashboard" },
  { label: "Bridge USDC", href: "#bridge" },
  { label: "Create Workflow", href: "#workflow-builder" },
  { label: "View Dashboard", href: "#agent-dashboard" },
];

const workflow = [
  { label: "Wallet", accent: "from-cyan-500/25 to-cyan-400/10" },
  { label: "AI Agent", accent: "from-fuchsia-500/25 to-fuchsia-400/10" },
  { label: "Workflow", accent: "from-cyan-500/25 to-fuchsia-500/10" },
  { label: "Merchant", accent: "from-slate-700/80 to-slate-800/80" },
  { label: "Settlement", accent: "from-emerald-500/20 to-cyan-500/10" },
];

export default function Hero() {
  return (
    <section className="mx-auto mb-8 max-w-7xl">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_90px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.2),_transparent_36%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">ArcPay</div>
            <h1 className="mt-5 text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">ArcPay</h1>
            <p className="mt-4 text-lg font-semibold uppercase tracking-[0.35em] text-fuchsia-300/90 sm:text-xl">The Agentic Commerce Layer on Arc</p>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">Build autonomous payment workflows using Arc Testnet, Circle USDC, Vyper smart contracts and AI Agents.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <a key={action.label} href={action.href} className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300">{action.label}</a>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(34,211,238,0.32),rgba(217,70,239,0.22),rgba(34,211,238,0.32))] blur-3xl" />
            <div className="relative rounded-[2rem] border border-cyan-400/20 bg-slate-900/70 p-5 shadow-[0_0_70px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400"><span>Workflow</span><span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-emerald-300">Live</span></div>
              <div className="mt-6 flex flex-col items-center gap-3">
                {workflow.map((step, index) => (
                  <div key={step.label} className="w-full">
                    <div className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${step.accent} p-[1px]`}><div className="rounded-[15px] bg-slate-950/90 px-4 py-3 text-center text-sm font-semibold text-white">{step.label}</div></div>
                    {index < workflow.length - 1 && <div className="my-1 flex justify-center text-cyan-300/80">↓</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
