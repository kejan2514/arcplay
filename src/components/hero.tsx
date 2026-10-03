import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto mb-8 max-w-7xl">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,70,239,0.14),transparent_65%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Gaming payments on Arc</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Your next game.<br /><span className="bg-gradient-to-r from-cyan-200 to-fuchsia-300 bg-clip-text text-transparent">Powered by USDC.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Explore gaming credits, try a testnet checkout and turn your selection into a payment workflow draft.</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#games" className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">Try the demo →</a>
              <Link href="/automations" className="text-sm font-semibold text-slate-300 hover:text-cyan-200">Explore automations →</Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Test tokens only. No real charge or game-credit delivery.</p>
          </div>
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Your first demo in three steps</p>
            <ol className="mt-5 space-y-5">
              {[["Choose your game", "Pick a game and credit package."], ["Review the test payment", "See the exact transfer and approve in your wallet."], ["Keep your proof", "Check the transaction and download a verified receipt."]].map(([title, detail], i) => <li key={title} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-sm text-cyan-200">{i + 1}</span><div><p className="text-sm font-semibold text-white">{title}</p><p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p></div></li>)}
            </ol>
            <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-500">Payments powered by ArcPay · Arc + Circle USDC</div>
          </div>
        </div>
      </div>
    </section>
  );
}
