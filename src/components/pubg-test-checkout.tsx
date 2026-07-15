"use client";

import { useEffect, useState } from "react";
import { ARC_NETWORK } from "@/lib/arc-network";
import { saveDemoOrder } from "@/lib/demo-orders";
import { GAMES } from "@/lib/game-catalog";

type PaymentMethod = "apple" | "google" | "wallet";
type CheckoutStatus = "idle" | "confirming" | "pending" | "success" | "error";
type TransactionReceipt = { status?: string };

const methods = [
  { id: "apple" as const, icon: "●", name: "Apple Pay", detail: "Fiat preview", demo: true },
  { id: "google" as const, icon: "G", name: "Google Pay", detail: "Fiat preview", demo: true },
  { id: "wallet" as const, icon: "◇", name: "USDC Wallet", detail: "Arc Testnet", demo: false },
];

function wait(ms: number) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }
function errorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = Number(error.code);
    if (code === 4001) return "Transaction cancelled in your wallet.";
    if (code === -32002) return "A wallet request is already waiting for approval.";
  }
  return "The demo transaction could not be completed.";
}

export default function PubgTestCheckout() {
  const [gameId, setGameId] = useState(GAMES[0].id);
  const [productId, setProductId] = useState(GAMES[0].products[0].id);
  const [accountId, setAccountId] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("wallet");
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [message, setMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletReady, setWalletReady] = useState(false);
  const [demoModal, setDemoModal] = useState<"Apple Pay" | "Google Pay" | null>(null);

  const game = GAMES.find((item) => item.id === gameId) ?? GAMES[0];
  const product = game.products.find((item) => item.id === productId) ?? game.products[0];
  const isBusy = status === "confirming" || status === "pending";

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;
    const sync = async () => {
      try {
        const [accounts, chainId] = await Promise.all([provider.request<string[]>({ method: "eth_accounts" }), provider.request<string>({ method: "eth_chainId" })]);
        setWalletConnected(Boolean(accounts[0]));
        setWalletReady(Boolean(accounts[0]) && chainId.toLowerCase() === ARC_NETWORK.chainIdHex.toLowerCase());
      } catch { setWalletConnected(false); setWalletReady(false); }
    };
    void sync();
    provider.on?.("accountsChanged", sync);
    provider.on?.("chainChanged", sync);
    return () => { provider.removeListener?.("accountsChanged", sync); provider.removeListener?.("chainChanged", sync); };
  }, []);

  function selectGame(nextId: string) {
    const nextGame = GAMES.find((item) => item.id === nextId) ?? GAMES[0];
    setGameId(nextGame.id); setProductId(nextGame.products[0].id); setStatus("idle"); setMessage(""); setTransactionHash("");
  }

  function selectMethod(next: PaymentMethod) {
    setMethod(next); setStatus("idle"); setMessage("");
    if (next === "apple") setDemoModal("Apple Pay");
    if (next === "google") setDemoModal("Google Pay");
  }

  async function createTestOrder() {
    if (method !== "wallet") { setDemoModal(method === "apple" ? "Apple Pay" : "Google Pay"); return; }
    const provider = window.ethereum;
    if (!provider) { setStatus("error"); setMessage("Connect an EIP-1193 browser wallet first."); return; }
    if (!accountId.trim()) { setStatus("error"); setMessage(`Enter a demo ${game.accountLabel.toLowerCase()}.`); return; }
    setStatus("confirming"); setMessage(""); setTransactionHash("");
    try {
      const accounts = await provider.request<string[]>({ method: "eth_accounts" });
      const address = accounts[0];
      if (!address) throw new Error("Wallet is not connected");
      const chainId = await provider.request<string>({ method: "eth_chainId" });
      if (chainId.toLowerCase() !== ARC_NETWORK.chainIdHex.toLowerCase()) { setStatus("error"); setMessage(`Switch your wallet to ${ARC_NETWORK.chainName} first.`); return; }
      const hash = await provider.request<string>({ method: "eth_sendTransaction", params: [{ from: address, to: address, value: "0x0" }] });
      setTransactionHash(hash); setStatus("pending");
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const receipt = await provider.request<TransactionReceipt | null>({ method: "eth_getTransactionReceipt", params: [hash] });
        if (receipt) {
          if (receipt.status === "0x0") throw new Error("Transaction reverted");
          saveDemoOrder({ id: hash, game: game.name, product: product.label, playerId: accountId.trim(), transactionHash: hash, createdAt: new Date().toISOString() });
          setStatus("success"); setMessage("Demo order verified on Arc Testnet. No product was delivered."); return;
        }
        await wait(1_000);
      }
      setStatus("success"); setMessage("Transaction submitted. Open ArcScan to check its final status.");
    } catch (error) { setStatus("error"); setMessage(errorMessage(error)); }
  }

  return (
    <section id="checkout" className="mt-12 scroll-mt-8 rounded-[2rem] border border-cyan-400/20 bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">ArcPay product checkout</p><h2 className="mt-2 text-2xl font-bold text-white">Choose a game and payment method</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Browse demo products, preview fiat payment methods, or create a zero-value proof on Arc Testnet.</p></div>
        <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">Demo only</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((item) => <button key={item.id} type="button" onClick={() => selectGame(item.id)} className={`rounded-2xl border p-4 text-left transition ${game.id === item.id ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.12)]" : "border-slate-800 bg-slate-950/55 hover:border-cyan-400/30"}`}><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 text-lg">{item.icon}</span><div><p className="font-semibold text-white">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.description}</p></div></div></button>)}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-semibold text-white">1. Choose package</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">{game.products.map((item) => <button key={item.id} type="button" onClick={() => setProductId(item.id)} className={`rounded-xl border p-4 text-left transition ${product.id === item.id ? "border-fuchsia-400/60 bg-fuchsia-400/10" : "border-slate-700 bg-slate-950/50 hover:border-slate-500"}`}><span className="block font-semibold text-white">{item.label}</span><span className="mt-1 block text-xs text-slate-400">{item.price} test USDC</span></button>)}</div>
          <label className="mt-6 block text-sm font-medium text-slate-200" htmlFor="account-id">2. {game.accountLabel}</label>
          <input id="account-id" value={accountId} onChange={(event) => setAccountId(event.target.value)} placeholder={game.accountPlaceholder} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400" />
          <p className="mt-6 text-sm font-semibold text-white">3. Choose payment method</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">{methods.map((item) => <button key={item.id} type="button" onClick={() => selectMethod(item.id)} className={`relative rounded-2xl border p-4 text-left transition ${method === item.id ? "border-cyan-400/60 bg-cyan-400/10" : "border-slate-800 bg-slate-950/60 hover:border-cyan-400/30"}`}><span className="text-xl font-bold text-white">{item.icon}</span><p className="mt-3 font-semibold text-white">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p>{item.demo ? <span className="absolute right-3 top-3 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">Demo</span> : null}</button>)}</div>
        </div>

        <aside className="rounded-3xl border border-fuchsia-500/20 bg-slate-950/70 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Checkout summary</p>
          <div className="mt-5 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 text-xl">{game.icon}</span><div><p className="font-semibold text-white">{game.name}</p><p className="text-sm text-slate-400">{product.label}</p></div></div>
          <dl className="mt-6 space-y-3 border-y border-slate-800 py-5 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-400">Merchant</dt><dd className="text-white">ArcPlay Store</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-400">Displayed price</dt><dd className="text-white">{product.price} USDC</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-400">Test charge</dt><dd className="text-emerald-300">0 USDC</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-400">Network</dt><dd className="text-white">Arc Testnet</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-400">Method</dt><dd className="text-white">{methods.find((item) => item.id === method)?.name}</dd></div></dl>
          <button type="button" onClick={createTestOrder} disabled={isBusy || (method === "wallet" && !walletReady)} className="mt-6 w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-55">{method !== "wallet" ? `Preview ${method === "apple" ? "Apple Pay" : "Google Pay"}` : !walletConnected ? "Connect Wallet to Pay" : !walletReady ? "Switch to Arc to Pay" : status === "confirming" ? "Confirm in wallet…" : status === "pending" ? "Verifying on Arc…" : "Create test order"}</button>
          <p className="mt-3 text-xs leading-5 text-slate-500">Fiat methods are visual demos. Wallet checkout sends only a zero-value self-transaction and never delivers real products.</p>
          {message ? <p className={`mt-4 text-sm leading-6 ${status === "error" ? "text-rose-300" : "text-emerald-300"}`} role="status">{message}</p> : null}
          {transactionHash ? <a href={`${ARC_NETWORK.explorerUrl}/tx/${transactionHash}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200">View transaction on ArcScan →</a> : null}
        </aside>
      </div>

      {demoModal ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="demo-title"><div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-slate-900 p-6 shadow-[0_0_80px_rgba(34,211,238,0.15)]"><div className="flex items-center justify-between"><span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">Demo only</span><button type="button" onClick={() => setDemoModal(null)} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:border-cyan-400 hover:text-white">Close</button></div><h3 id="demo-title" className="mt-5 text-2xl font-bold text-white">{demoModal} preview</h3><p className="mt-3 leading-7 text-slate-300">Demo payment flow — fiat-to-USDC settlement on Arc will be added later. No card sheet opens and no payment is collected.</p><div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm"><div className="flex justify-between"><span className="text-slate-400">Product</span><span className="text-white">{game.shortName} · {product.label}</span></div><div className="mt-3 flex justify-between"><span className="text-slate-400">Preview total</span><span className="text-white">{product.price} USDC</span></div></div><button type="button" onClick={() => setDemoModal(null)} className="mt-6 w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">Return to checkout</button></div></div> : null}
    </section>
  );
}
