const cards = [
  { title: "Agent Status", lines: ["Running", "Online indicator", "Last execution: 2 min ago"], accent: "from-cyan-500/20 to-cyan-400/10" },
  { title: "Wallet", lines: ["Connected", "Arc Testnet", "Native USDC"], accent: "from-fuchsia-500/20 to-fuchsia-400/10" },
  { title: "Reputation", lines: ["Builder Score: 965", "Verified Architect", "42 successful workflows"], accent: "from-violet-500/20 to-cyan-500/10" },
  { title: "Today's Analytics", lines: ["Payments: 18", "USDC Volume: 245", "Active Agents: 3"], accent: "from-emerald-500/20 to-cyan-500/10" },
];

const examples = ["Bridge 20 USDC to Arc", "Buy PUBG UC every Friday", "Pay Netflix every month", "Send receipt to Discord"];

export default function AIAgentDashboard() {
  return (
    <section id="agent-dashboard" className="mx-auto mb-8 max-w-7xl scroll-mt-8">
      <div className="rounded-[2.25rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">AI Agent Dashboard</p><h2 className="mt-2 text-2xl font-bold text-white">Autonomous commerce at a glance</h2></div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Online</div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${card.accent} p-[1px]`}>
              <div className="rounded-[15px] border border-slate-800/80 bg-slate-950/85 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold text-white">{card.title}</h3><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" /></div>
                <div className="mt-4 space-y-2 text-sm text-slate-300">{card.lines.map((line) => <p key={line} className="leading-6">{line}</p>)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-[1.5rem] border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-slate-900/70 to-fuchsia-500/10 p-4 shadow-[0_0_45px_rgba(34,211,238,0.1)] sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />Ask ArcPay</div>
          <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-slate-950/80 px-4 py-4 shadow-[inset_0_0_25px_rgba(34,211,238,0.08)]">
            <p className="text-sm text-slate-400">Ask ArcPay...</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-300">{examples.map((example) => <span key={example} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-cyan-200">{example}</span>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
