"use client";

import { useEffect, useState } from "react";

type CircleStatus = {
  configured: boolean;
  blockchain: string;
  walletSetConfigured: boolean;
};

type CreatedWallet = {
  id: string;
  address: string;
  blockchain: string;
  accountType?: string;
};

function shortAddress(address: string) {
  return `${address.slice(0, 10)}…${address.slice(-8)}`;
}

export default function CircleWalletInfrastructure() {
  const [status, setStatus] = useState<CircleStatus | null>(null);
  const [wallet, setWallet] = useState<CreatedWallet | null>(null);
  const [walletSetId, setWalletSetId] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/circle/status")
      .then((response) => response.json() as Promise<CircleStatus>)
      .then(setStatus)
      .catch(() => setMessage("Circle configuration status could not be loaded."));
  }, []);

  async function createWallet() {
    setCreating(true);
    setMessage("");

    try {
      const response = await fetch("/api/circle/wallets", { method: "POST" });
      const data = await response.json() as {
        wallet?: CreatedWallet;
        walletSetId?: string;
        createdWalletSet?: boolean;
        error?: string;
      };

      if (!response.ok || !data.wallet || !data.walletSetId) {
        throw new Error(data.error || "Wallet creation failed.");
      }

      setWallet(data.wallet);
      setWalletSetId(data.walletSetId);
      setMessage(data.createdWalletSet
        ? "Wallet and wallet set created. Save the wallet set ID in CIRCLE_WALLET_SET_ID before creating another wallet."
        : "Arc Testnet wallet created in the configured wallet set.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Wallet creation failed.");
    } finally {
      setCreating(false);
    }
  }

  const configured = status?.configured === true;

  return (
    <section className="mx-auto mb-8 max-w-7xl">
      <div className="rounded-[2.25rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Circle Wallet Infrastructure</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Server-controlled wallets for ArcPay</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">Create an EOA wallet on Arc Testnet through Circle’s server-side SDK. API credentials and the entity secret never reach the browser.</p>
          </div>
          <span className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${configured ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-amber-400/30 bg-amber-400/10 text-amber-200"}`}>
            {status === null ? "Checking…" : configured ? "Configured" : "Setup required"}
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-sm font-semibold text-white">Secure backend flow</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Circle API", "ARC-TESTNET", "EOA wallet"].map((item, index) => (
                <div key={item} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">0{index + 1}</p>
                  <p className="mt-2 font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={createWallet} disabled={!configured || creating} className="mt-6 w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">
              {!configured ? "Add Circle credentials to continue" : creating ? "Creating wallet securely…" : "Create Arc Testnet wallet"}
            </button>
            {message ? <p className="mt-4 text-sm leading-6 text-slate-300" role="status">{message}</p> : null}
          </div>

          <aside className="rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">Wallet result</p>
            {wallet ? (
              <dl className="mt-5 space-y-4 text-sm">
                <div><dt className="text-slate-500">Address</dt><dd className="mt-1 font-mono text-white" title={wallet.address}>{shortAddress(wallet.address)}</dd></div>
                <div><dt className="text-slate-500">Network</dt><dd className="mt-1 text-white">{wallet.blockchain}</dd></div>
                <div><dt className="text-slate-500">Account</dt><dd className="mt-1 text-white">{wallet.accountType || "EOA"}</dd></div>
                <div><dt className="text-slate-500">Wallet set ID</dt><dd className="mt-1 break-all font-mono text-xs text-cyan-200">{walletSetId}</dd></div>
              </dl>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-700 px-5 py-8 text-center text-sm leading-6 text-slate-500">No Circle wallet has been created in this session.</div>
            )}
            <p className="mt-5 text-xs leading-5 text-slate-500">Testnet only. Creating a wallet does not fund it or execute a payment.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
