import { ARC_ERC8004 } from "@/lib/erc8004-arc";

const trustModels = [
  { title: "Identity", body: "Portable agent metadata shaped for ERC-8004 registration files." },
  { title: "Reputation", body: "Arc Testnet ReputationRegistry is wired as an official trust surface without inventing scores." },
  { title: "Validation", body: "Arc Testnet ValidationRegistry is configured for future independent validation evidence." },
];

const registries = [
  ["IdentityRegistry", ARC_ERC8004.identityRegistry],
  ["ReputationRegistry", ARC_ERC8004.reputationRegistry],
  ["ValidationRegistry", ARC_ERC8004.validationRegistry],
] as const;

export default function ERC8004AgentIdentity() {
  return (
    <section id="erc-8004" className="mx-auto mb-8 max-w-7xl scroll-mt-8">
      <div className="rounded-[2.25rem] border border-emerald-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(52,211,153,0.1)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">ERC-8004 Agent Identity</p>
            <h2 className="mt-2 text-3xl font-bold text-white">ArcPay is wired to the official ERC-8004 registries on Arc Testnet.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              The registration endpoint follows the ERC-8004 registration-v1 shape and the app now carries the official Arc Testnet Identity, Reputation, and Validation registry addresses. ArcPay still does not claim an agent ID until a real onchain registration is completed.
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

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Official Arc Testnet registries</p>
          <div className="mt-4 space-y-3 text-sm">
            {registries.map(([name, address]) => (
              <div key={name} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-slate-200">{name}</span>
                <code className="break-all text-xs text-slate-400">{address}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm leading-7 text-slate-400">
          <span className="font-semibold text-slate-200">Safety:</span> official registry addresses are configured, but ArcPay only publishes a registration entry after a real agent ID is supplied from an onchain registration.
        </div>
      </div>
    </section>
  );
}
