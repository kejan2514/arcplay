import Link from "next/link";
import ArcPayCheckout from "@/components/arcpay-checkout";
import WalletBalance from "@/components/wallet-balance";
import WalletConnect from "@/components/wallet-connect";

export default function GameGrid() {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Get ready for your test payment</p>
          <WalletConnect />
          <p className="mt-3 text-xs leading-6 text-slate-400">Need test USDC? <Link href="/bridge" className="font-semibold text-cyan-300 hover:text-cyan-200">Open the bridge →</Link></p>
        </div>
        <WalletBalance />
      </div>
      <ArcPayCheckout />
    </section>
  );
}
