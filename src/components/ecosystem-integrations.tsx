import { ECOSYSTEM_CATEGORIES } from "@/lib/arc-ecosystem";

const totalProjects = ECOSYSTEM_CATEGORIES.reduce(
  (total, category) => total + category.projects.length,
  0,
);

export default function EcosystemIntegrations() {
  return (
    <section
      id="ecosystem"
      className="mx-auto mt-10 max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-6 shadow-[0_0_80px_rgba(34,211,238,0.08)] backdrop-blur sm:p-10"
    >
      <div className="flex flex-col gap-5 border-b border-slate-800 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.35em] text-cyan-300">
            ARC ECOSYSTEM
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Explore apps around ArcPay
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Discover bridges, swaps, DeFi, NFT communities and wallets from one
            dashboard. ArcPay&apos;s Circle wallet and payment flow remain the core;
            listed projects open in their official X profiles for research.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-200 lg:self-auto">
          <span className="h-2 w-2 rounded-full bg-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.9)]" />
          {totalProjects} community-listed apps
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {ECOSYSTEM_CATEGORIES.map((category) => (
          <article
            key={category.id}
            className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-cyan-400/35 hover:bg-cyan-400/[0.03] sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-xl font-bold text-cyan-200">
                {category.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {category.projects.map((item) => (
                <div
                  key={`${category.id}-${item.handle}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 transition hover:border-cyan-400/35"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-100">{item.name}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">@{item.handle}</p>
                    </div>
                    {item.status === "available" && (
                      <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                        Ready
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <a
                      href={`https://x.com/${item.handle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                      aria-label={`${item.name} official X profile`}
                    >
                      X profile ↗
                    </a>
                    {item.website ? (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-cyan-400/35 bg-cyan-400/10 px-3 py-2 text-center text-xs font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/15"
                        aria-label={`Open ${item.name} application`}
                      >
                        Open app ↗
                      </a>
                    ) : (
                      <span className="cursor-not-allowed rounded-lg border border-slate-800 px-3 py-2 text-center text-xs font-semibold text-slate-600">
                        App coming soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-5 py-4 text-sm leading-6 text-amber-100/80">
        Community directory, not an endorsement. External protocols are not yet
        connected to ArcPay transactions; verify contracts, network support and
        risk before using them.
      </div>
    </section>
  );
}
