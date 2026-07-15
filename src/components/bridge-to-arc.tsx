"use client";

import { useState } from "react";
import type { EIP1193Provider } from "viem";
import type { BridgeResult } from "@circle-fin/bridge-kit";

type SourceChain = "Ethereum_Sepolia" | "Base_Sepolia" | "Arbitrum_Sepolia";
type BridgeStatus = "idle" | "connecting" | "bridging" | "success" | "error";

type BridgeStepView = {
  name: string;
  state: string;
  explorerUrl?: string;
  txHash?: string;
};

const SOURCE_CHAINS: Array<{ id: SourceChain; name: string; badge: string }> = [
  { id: "Ethereum_Sepolia", name: "Ethereum Sepolia", badge: "ETH" },
  { id: "Base_Sepolia", name: "Base Sepolia", badge: "BASE" },
  { id: "Arbitrum_Sepolia", name: "Arbitrum Sepolia", badge: "ARB" },
];

function bridgeErrorMessage(error: unknown) {
  if (typeof error === "object" && error) {
    if ("code" in error && Number(error.code) === 4001) {
      return "The request was cancelled in your wallet.";
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return "The testnet bridge could not be completed. Check your balance and try again.";
}

export default function BridgeToArc() {
  const [sourceChain, setSourceChain] = useState<SourceChain>("Ethereum_Sepolia");
  const [amount, setAmount] = useState("1.00");
  const [status, setStatus] = useState<BridgeStatus>("idle");
  const [message, setMessage] = useState("");
  const [steps, setSteps] = useState<BridgeStepView[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [retryResult, setRetryResult] = useState<BridgeResult | null>(null);

  const amountNumber = Number(amount);
  const isValidAmount = Number.isFinite(amountNumber) && amountNumber > 0;
  const isBusy = status === "connecting" || status === "bridging";

  async function bridgeUSDC() {
    if (!confirmed || !isValidAmount || isBusy) return;

    const provider = window.ethereum;
    if (!provider) {
      setStatus("error");
      setMessage("Install or open an EIP-1193 wallet such as MetaMask first.");
      return;
    }

    setStatus("connecting");
    setMessage("Connecting to your wallet…");
    setSteps([]);
    setRetryResult(null);

    try {
      const [{ BridgeKit }, { createViemAdapterFromProvider }] = await Promise.all([
        import("@circle-fin/bridge-kit"),
        import("@circle-fin/adapter-viem-v2"),
      ]);

      const adapter = await createViemAdapterFromProvider({
        provider: provider as EIP1193Provider,
        capabilities: { addressContext: "user-controlled" },
      });

      setStatus("bridging");
      setMessage("Approve the USDC transfer in your wallet. Circle CCTP will burn on the source and mint on Arc Testnet.");

      const result = await new BridgeKit().bridge({
        from: { adapter, chain: sourceChain },
        to: { adapter, chain: "Arc_Testnet", useForwarder: true },
        amount,
      });

      setRetryResult(result.state === "success" ? null : result);
      setSteps(
        result.steps.map((step) => ({
          name: step.name,
          state: step.state,
          explorerUrl: step.explorerUrl,
          txHash: step.txHash,
        })),
      );
      setStatus(result.state === "success" ? "success" : "error");
      setMessage(
        result.state === "success"
          ? `${result.amount} USDC arrived on Arc Testnet.`
          : "The bridge finished without a success confirmation. Review the steps below.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(bridgeErrorMessage(error));
    }
  }

  async function retryBridge() {
    const provider = window.ethereum;
    if (!provider || !retryResult || isBusy) return;

    setStatus("bridging");
    setMessage("Resuming the existing transfer from its failed step. No new burn will be created.");

    try {
      const [{ BridgeKit }, { createViemAdapterFromProvider }] = await Promise.all([
        import("@circle-fin/bridge-kit"),
        import("@circle-fin/adapter-viem-v2"),
      ]);
      const adapter = await createViemAdapterFromProvider({
        provider: provider as EIP1193Provider,
        capabilities: { addressContext: "user-controlled" },
      });
      const result = await new BridgeKit().retry(retryResult, { from: adapter, to: adapter });
      setRetryResult(result.state === "success" ? null : result);
      setSteps(result.steps.map((step) => ({ name: step.name, state: step.state, explorerUrl: step.explorerUrl, txHash: step.txHash })));
      setStatus(result.state === "success" ? "success" : "error");
      setMessage(result.state === "success" ? `${result.amount} USDC arrived on Arc Testnet.` : "The transfer is still incomplete. Review the latest step and retry when ready.");
    } catch (error) {
      setStatus("error");
      setMessage(bridgeErrorMessage(error));
    }
  }

  return (
    <section id="bridge" className="mt-12 scroll-mt-8 rounded-[2rem] border border-fuchsia-400/20 bg-slate-900/70 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-300">Circle CCTP bridge</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Bridge USDC to Arc</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Move native test USDC to Arc Testnet without wrapped tokens or a liquidity pool. Every transaction is approved in your wallet.</p>
        </div>
        <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">Testnet only</span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold text-white">1. Source network</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {SOURCE_CHAINS.map((chain) => (
              <button key={chain.id} type="button" onClick={() => setSourceChain(chain.id)} className={`rounded-2xl border p-4 text-left transition ${sourceChain === chain.id ? "border-fuchsia-400/60 bg-fuchsia-400/10 shadow-[0_0_24px_rgba(217,70,239,0.12)]" : "border-slate-800 bg-slate-950/55 hover:border-fuchsia-400/30"}`}>
                <span className="text-xs font-bold tracking-wider text-fuchsia-300">{chain.badge}</span>
                <span className="mt-2 block text-sm font-semibold text-white">{chain.name}</span>
              </button>
            ))}
          </div>

          <label htmlFor="bridge-amount" className="mt-6 block text-sm font-semibold text-white">2. Amount</label>
          <div className="mt-3 flex items-center rounded-2xl border border-slate-700 bg-slate-950/70 px-4 focus-within:border-cyan-400">
            <input id="bridge-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} className="min-w-0 flex-1 bg-transparent py-4 text-xl font-bold text-white outline-none" placeholder="1.00" />
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-300">USDC</span>
          </div>
          {!isValidAmount && amount ? <p className="mt-2 text-xs text-rose-300">Enter an amount greater than zero.</p> : null}

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
            <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 h-4 w-4 accent-cyan-400" />
            <span className="text-sm leading-6 text-slate-400">I understand this uses testnet tokens, may require source-chain gas, and does not move real funds.</span>
          </label>
        </div>

        <aside className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Bridge route</p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div><p className="text-xs text-slate-500">From</p><p className="mt-1 font-semibold text-white">{SOURCE_CHAINS.find((chain) => chain.id === sourceChain)?.name}</p></div>
            <span className="text-xl text-cyan-300">→</span>
            <div className="text-right"><p className="text-xs text-slate-500">To</p><p className="mt-1 font-semibold text-white">Arc Testnet</p></div>
          </div>
          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Asset</span><span className="text-white">Native USDC</span></div>
            <div className="mt-3 flex justify-between"><span className="text-slate-400">Protocol</span><span className="text-white">CCTP + Forwarder</span></div>
            <div className="mt-3 flex justify-between"><span className="text-slate-400">Amount</span><span className="text-white">{isValidAmount ? amount : "—"} USDC</span></div>
          </div>
          <button type="button" onClick={bridgeUSDC} disabled={!confirmed || !isValidAmount || isBusy} className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{status === "connecting" ? "Connecting wallet…" : status === "bridging" ? "Bridge in progress…" : "Bridge to Arc Testnet"}</button>
          {retryResult ? <button type="button" onClick={retryBridge} disabled={isBusy} className="mt-3 w-full rounded-full border border-amber-400/40 px-5 py-3 text-sm font-bold text-amber-200 transition hover:border-amber-300 hover:text-white disabled:opacity-50">Retry failed step — no new burn</button> : null}
          <p className="mt-3 text-xs leading-5 text-slate-500">Bridge Kit may request approval and burn transactions. Circle Forwarder handles attestation and destination mint; its fee is deducted from the received test USDC.</p>

          {message ? <p className={`mt-4 text-sm leading-6 ${status === "error" ? "text-rose-300" : status === "success" ? "text-emerald-300" : "text-cyan-300"}`} role="status">{message}</p> : null}
          {steps.length > 0 ? <div className="mt-4 space-y-2">{steps.map((step, index) => <div key={`${step.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs"><span className="capitalize text-slate-300">{step.name}</span>{step.explorerUrl ? <a href={step.explorerUrl} target="_blank" rel="noreferrer" className="font-semibold text-cyan-300 hover:text-cyan-200">{step.state} ↗</a> : <span className="text-slate-500">{step.state}</span>}</div>)}</div> : null}
        </aside>
      </div>
    </section>
  );
}
