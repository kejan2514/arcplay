"use client";

import { useMemo, useState } from "react";
import { BridgeKit } from "@circle-fin/bridge-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";
import type { EIP1193Provider } from "viem";

type ProviderDetail = {
  info: { uuid: string; name: string; icon: string; rdns: string };
  provider: EIP1193Provider;
};

type BridgeEvent = { method?: string; values?: { name?: string; state?: string; data?: { explorerUrl?: string } } };

async function discoverWallets(): Promise<ProviderDetail[]> {
  const providers = new Map<string, ProviderDetail>();
  const onProvider = (event: Event) => {
    const detail = (event as CustomEvent<ProviderDetail>).detail;
    providers.set(detail.info.uuid, detail);
  };
  window.addEventListener("eip6963:announceProvider", onProvider);
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  await new Promise((resolve) => window.setTimeout(resolve, 300));
  window.removeEventListener("eip6963:announceProvider", onProvider);
  return [...providers.values()];
}

function short(address: string) {
  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

export default function USDCBridge() {
  const kit = useMemo(() => new BridgeKit(), []);
  const [wallet, setWallet] = useState<ProviderDetail | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState("1.00");
  const [status, setStatus] = useState("Connect a browser wallet first. Wallet approval and bridge signing are always user-triggered.");
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);

  async function connectWallet() {
    setStatus("Looking for browser wallets…");
    try {
      const providers = await discoverWallets();
      const selected = providers.find((item) => item.info.rdns === "io.metamask" || item.info.name === "MetaMask") ?? providers[0];
      if (!selected) throw new Error("No EIP-6963 browser wallet found. Install MetaMask or another compatible wallet.");
      await selected.provider.request({ method: "eth_requestAccounts", params: undefined });
      const accounts = await selected.provider.request({ method: "eth_accounts", params: undefined }) as string[];
      const connected = accounts[0];
      if (!connected) throw new Error("Wallet connected but no account was returned.");
      setWallet(selected);
      setAddress(connected);
      setStatus(`${selected.info.name} connected. Review the amount before starting the bridge.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Wallet connection failed.");
    }
  }

  async function bridge() {
    if (!wallet || !address) {
      setStatus("Connect your browser wallet before starting a bridge.");
      return;
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setStatus("Enter a valid USDC amount.");
      return;
    }

    setRunning(true);
    setEvents([]);
    setExplorerUrl(null);
    setStatus("Preparing bridge. Your wallet may ask for approval and transaction signatures. Review every prompt before confirming.");

    try {
      const adapter = await createViemAdapterFromProvider({ provider: wallet.provider });
      const listener = (payload: unknown) => {
        const event = payload as BridgeEvent;
        const label = event.values?.name ?? event.method ?? "bridge step";
        const state = event.values?.state ?? "processing";
        setEvents((current) => [`${label}: ${state}`, ...current].slice(0, 8));
        const url = event.values?.data?.explorerUrl;
        if (url) setExplorerUrl(url);
      };
      kit.on("*", listener);

      let result = await kit.bridge({
        from: { adapter, chain: "Ethereum_Sepolia" },
        to: { adapter, chain: "Arc_Testnet" },
        amount,
      });

      if (result.state === "error") {
        result = await kit.retry(result, { from: adapter, to: adapter });
      }

      const steps = Array.isArray(result.steps) ? result.steps : [];
      const lastUrl = [...steps].reverse().map((step: unknown) => {
        const candidate = step as { data?: { explorerUrl?: string }; explorerUrl?: string };
        return candidate.data?.explorerUrl ?? candidate.explorerUrl;
      }).find(Boolean);
      if (lastUrl) setExplorerUrl(lastUrl);

      if (result.state === "error") {
        setStatus("Bridge returned an error. No success is being claimed; review the wallet and event details below.");
      } else {
        setStatus("Bridge flow completed. Verify the returned transaction steps in the explorer before treating it as settled.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Bridge failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section id="bridge" className="mx-auto mb-8 max-w-7xl scroll-mt-8">
      <div className="rounded-[2.25rem] border border-emerald-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(16,185,129,0.1)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Circle USDC Bridge</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Browser-wallet approval flow</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">Bridge test USDC from Ethereum Sepolia to Arc Testnet. Wallet connection and bridging are separate actions so every approval remains explicit.</p>
          </div>
          <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200">Testnet only</span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-sm font-semibold text-white">1. Connect wallet</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">ArcPay requests account access only after you press the button.</p>
            <button type="button" onClick={connectWallet} className="mt-5 w-full rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20">{address ? `${wallet?.info.name}: ${short(address)}` : "Connect browser wallet"}</button>

            <label className="mt-6 block text-sm font-medium text-slate-300" htmlFor="bridge-amount">2. USDC amount</label>
            <input id="bridge-amount" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-emerald-400" />

            <button type="button" onClick={bridge} disabled={!address || running} className="mt-5 w-full rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50">{running ? "Bridge in progress…" : "Review & bridge to Arc Testnet"}</button>
            <p className="mt-4 text-xs leading-5 text-slate-500">Never approve a transaction you do not understand. This flow uses testnet assets only and does not custody your private key.</p>
          </div>

          <aside className="rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/5 p-6">
            <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-white">Bridge activity</p><span className="text-xs uppercase tracking-[0.25em] text-slate-500">Sepolia → Arc</span></div>
            <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300" role="status">{status}</p>
            <div className="mt-4 space-y-2">
              {events.length ? events.map((event, index) => <div key={`${event}-${index}`} className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">{event}</div>) : <div className="rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">Bridge lifecycle events will appear here.</div>}
            </div>
            {explorerUrl ? <a href={explorerUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full border border-emerald-400/40 px-4 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/10">Verify transaction step ↗</a> : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
