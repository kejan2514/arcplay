import BridgeToArc from "@/components/bridge-to-arc";
import ArcPayCheckout from "@/components/arcpay-checkout";
import OrderHistory from "@/components/order-history";
import WalletBalance from "@/components/wallet-balance";
import WalletConnect from "@/components/wallet-connect";

export default function GameGrid() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
      <div className="w-full rounded-[2rem] border border-cyan-400/20 bg-slate-950/75 p-6 shadow-[0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-xl sm:p-8 lg:p-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">ArcPay Commerce Demo</p>
            <h2 className="text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-8xl">Game credits</h2>
            <p className="mt-5 max-w-xl text-lg text-slate-300 sm:text-xl">Try the ArcPay checkout flow with Arc Testnet and test USDC.</p>
            <div className="mt-8 flex flex-col items-start gap-3"><WalletConnect /><div className="flex flex-wrap gap-3"><a href="#games" className="inline-flex h-fit items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300">Explore Games</a><a href="#bridge" className="inline-flex h-fit items-center justify-center rounded-full border border-fuchsia-400/40 px-6 py-3 text-sm font-semibold text-fuchsia-200 transition hover:border-fuchsia-300 hover:text-white">Bridge to Arc</a></div></div>
          </div>
          <WalletBalance />
        </div>
        <ArcPayCheckout />
        <BridgeToArc />
        <OrderHistory />
      </div>
    </section>
  );
}
