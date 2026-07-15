import WalletConnect from "@/components/wallet-connect";
import PubgTestCheckout from "@/components/pubg-test-checkout";
import WalletBalance from "@/components/wallet-balance";
import OrderHistory from "@/components/order-history";
import { GAMES } from "@/lib/game-catalog";

export default function Home() {
  const games = GAMES;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.2),_transparent_30%),#020617] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-cyan-400/20 bg-slate-950/75 p-6 shadow-[0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-xl sm:p-8 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">
                ArcPlay
              </p>
              <h1 className="text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-8xl">
                ArcPlay
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-300 sm:text-xl">
                Buy game credits using Arc blockchain and USDC
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <WalletConnect />
                <a
                  href="#games"
                  className="inline-flex h-fit items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  Explore Games
                </a>
              </div>
            </div>

            <WalletBalance />
          </div>

          <div id="games" className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games.map((game) => (
              <article
                key={game.name}
                className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 text-xl">
                  {game.icon}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{game.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {game.description}
                </p>
                <a
                  href="#checkout"
                  className="mt-4 inline-flex text-sm font-medium text-cyan-300 transition group-hover:text-cyan-200"
                >
                  Buy credits →
                </a>
              </article>
            ))}
          </div>

          <PubgTestCheckout />
          <OrderHistory />
        </div>
      </section>
    </main>
  );
}
