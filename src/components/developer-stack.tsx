const stack = [
  { title: "Arc", description: "The execution layer for agentic commerce.", icon: "⧉", accent: "from-cyan-500/20 to-cyan-400/10" },
  { title: "Circle USDC", description: "Native programmable payments.", icon: "◉", accent: "from-fuchsia-500/20 to-fuchsia-400/10" },
  { title: "Vyper", description: "Secure smart contracts.", icon: "⌘", accent: "from-violet-500/20 to-cyan-500/10" },
  { title: "ERC-8004", description: "Agent identity standard.", icon: "◌", accent: "from-emerald-500/20 to-cyan-500/10" },
  { title: "WalletConnect", description: "Secure wallet connections.", icon: "⬢", accent: "from-cyan-500/20 to-fuchsia-500/10" },
  { title: "GitHub", description: "Open-source development.", icon: "⌂", accent: "from-slate-700/80 to-slate-800/80" },
];

export default function DeveloperStack() {
  return (
    <section className="mx-auto mb-8 max-w-7xl">
      <div className="rounded-[2.25rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 text-center sm:text-left">
          <div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Built on the Arc Ecosystem</p><h2 className="mt-2 text-3xl font-bold text-white">ArcPay combines the best infrastructure for autonomous commerce.</h2></div>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">A modern stack of execution, payments, contracts, identity, and developer tooling.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stack.map((card) => (
            <div key={card.title} className={`rounded-[1.5rem] border border-slate-800 bg-gradient-to-br ${card.accent} p-[1px] transition duration-200 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(34,211,238,0.14)]`}>
              <div className="rounded-[1.4rem] border border-slate-800/80 bg-slate-950/85 p-5 backdrop-blur-xl"><div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-200">{card.icon}</div><h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{card.description}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
