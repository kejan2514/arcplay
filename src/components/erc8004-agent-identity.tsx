const trustModels = [
  { title: "Identity", body: "Portable agent metadata shaped for ERC-8004 registration files." },
  { title: "Reputation", body: "Advertises reputation as a supported trust signal without fabricating scores." },
  { title: "Validation", body: "Ready to link independent validation evidence when an Arc registry is configured." },
];

export default function ERC8004AgentIdentity() {
  return (
    <section id="erc-8004" className="mx-auto mb-8 max-w-7xl scroll-mt-8">
      <div className="rounded-[2.25rem] border border-emerald-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(52,211,153,0.1)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">ERC-8004 Agent Identity</p>
            <h2 className="mt-2 text-3xl font-bold text-white">ArcPay now publishes a trust-ready agent registration profile.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              The registration endpoint follows the ERC-8004 registration-v1 shape and exposes real ArcPay services. Onchain registry fields stay empty until a verified Arc deployment is configured.
            </p>
          </div>
          <a
            href="/api/agent-registration"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/20"
          >
            View registration JSON ↗
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {trustModels.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-[1px]">
              <div className="h-full rounded-[15px] bg-slate-950/90 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">✓</span>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-400">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm leading-7 text-slate-400">
          <span className="font-semibold text-slate-200">Safety:</span> this integration does not claim an onchain ERC-8004 identity until a real Identity Registry address and agent ID are supplied through server configuration.
        </div>
      </div>
    </section>
  );
}
