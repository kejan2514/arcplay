const steps = [
  { icon: "⚡", title: "Trigger", bullets: ["Wallet receives USDC", "Weekly schedule", "API webhook"], accent: "from-cyan-500/20 to-cyan-400/10" },
  { icon: "🤖", title: "AI Agent", bullets: ["Validate request", "Check reputation", "Decide action"], accent: "from-fuchsia-500/20 to-fuchsia-400/10" },
  { icon: "💳", title: "Payment", bullets: ["Circle USDC", "Arc Testnet", "Vyper Contract"], accent: "from-violet-500/20 to-cyan-500/10" },
  { icon: "✅", title: "Settlement", bullets: ["Merchant paid", "Receipt generated", "Transaction stored"], accent: "from-emerald-500/20 to-cyan-500/10" },
];

const templates = [
  { icon: "🎮", title: "Auto Buy Game Credits", body: "Automatically buy PUBG UC whenever wallet receives test USDC." },
  { icon: "💳", title: "Subscription Agent", body: "Pay recurring subscriptions every month." },
  { icon: "🤖", title: "Merchant Automation", body: "Automatically settle payments and generate receipts." },
];

export default function WorkflowBuilder() {
  return (
    <section id="workflow-builder" className="mx-auto mb-8 max-w-7xl scroll-mt-8">
      <div className="rounded-[2.25rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 text-center sm:text-left">
          <div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Agentic Workflow Builder</p><h2 className="mt-2 text-3xl font-bold text-white">Create autonomous payment workflows powered by Arc.</h2></div>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">Orchestrate secure onchain actions from wallet triggers to merchant settlement in one elegant flow.</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {steps.map((card, index) => (
            <div key={card.title} className="flex flex-1 flex-col items-center lg:items-stretch">
              <div className={`w-full rounded-[1.6rem] border border-slate-800 bg-gradient-to-br ${card.accent} p-[1px] transition duration-200 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(34,211,238,0.14)]`}>
                <div className="rounded-[1.5rem] border border-slate-800/80 bg-slate-950/85 p-5">
                  <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-200">{card.icon}</div><h3 className="text-lg font-semibold text-white">{card.title}</h3></div>
                  <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-300">{card.bullets.map((bullet) => <li key={bullet} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />{bullet}</li>)}</ul>
                </div>
              </div>
              {index < steps.length - 1 && <div className="my-3 flex justify-center text-cyan-300/80">↓</div>}
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {templates.map((template) => (
            <div key={template.title} className="rounded-[1.4rem] border border-slate-800 bg-slate-900/70 p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 text-2xl text-fuchsia-200">{template.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-white">{template.title}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{template.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
