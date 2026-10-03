import type { Metadata } from "next";
import BridgeToArc from "@/components/bridge-to-arc";
import WalletConnect from "@/components/wallet-connect";

export const metadata: Metadata = { title: "Bridge | ArcPlay" };
export default function BridgePage() {
  return <div className="mx-auto max-w-7xl"><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Fund your test wallet</p><h1 className="mt-3 text-3xl font-bold">One bridge. Native test USDC.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Connect your wallet, choose a route and review the amount. Every source transaction requires your wallet approval.</p><div className="mt-5"><WalletConnect /></div></div><BridgeToArc /></div>;
}
