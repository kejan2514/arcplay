import Link from "next/link";

const templates = [
  { title: "Friday game night", detail: "PUBG Mobile · 60 UC · Every Friday", href: "/automations?game=pubg&product=60-uc&cadence=weekly&day=5#workflow-builder", icon: "🎮" },
  { title: "Monthly gaming budget", detail: "Steam Wallet · $5 Wallet · Day 1", href: "/automations?game=steam&product=steam-5&cadence=monthly&day=1#workflow-builder", icon: "◉" },
  { title: "Community subscription", detail: "Discord Nitro Basic · Day 1", href: "/automations?game=discord&product=nitro-basic&cadence=monthly&day=1#workflow-builder", icon: "◌" },
];
export default function AIAgentDashboard() {
  return <section id="agent-dashboard" className="mx-auto mb-8 max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Payment workflows</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">Plan your next payment.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Start with a template or build your own. Every workflow is a draft for review; no automated payment runs in this demo.</p><div className="mt-6 grid gap-4 md:grid-cols-3">{templates.map((template) => <Link key={template.title} href={template.href} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-300/50"><span aria-hidden="true" className="text-2xl">{template.icon}</span><h2 className="mt-4 font-semibold text-white">{template.title}</h2><p className="mt-2 text-sm text-slate-400">{template.detail}</p><p className="mt-4 text-sm font-semibold text-cyan-300">Customize draft →</p></Link>)}</div></section>;
}
