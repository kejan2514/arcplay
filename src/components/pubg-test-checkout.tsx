"use client";

import { useState } from "react";
import { ARC_NETWORK } from "@/lib/arc-network";
import { saveDemoOrder } from "@/lib/demo-orders";

const packages = [
  { credits: "60 UC", price: "1.00 test USDC" },
  { credits: "325 UC", price: "5.00 test USDC" },
  { credits: "660 UC", price: "10.00 test USDC" },
];

type CheckoutStatus = "idle" | "confirming" | "pending" | "success" | "error";

type TransactionReceipt = {
  status?: string;
};

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function errorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = Number(error.code);
    if (code === 4001) return "Transaction cancelled in your wallet.";
    if (code === -32002) return "A wallet request is already waiting for approval.";
  }
  return "The demo transaction could not be completed.";
}

export default function PubgTestCheckout() {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [playerId, setPlayerId] = useState("");
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [message, setMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  async function createTestOrder() {
    const provider = window.ethereum;
    if (!provider) {
      setStatus("error");
      setMessage("Connect an EIP-1193 browser wallet first.");
      return;
    }
    if (!playerId.trim()) {
      setStatus("error");
      setMessage("Enter a demo player ID.");
      return;
    }

    setStatus("confirming");
    setMessage("");
    setTransactionHash("");

    try {
      const accounts = await provider.request<string[]>({ method: "eth_accounts" });
      const address = accounts[0];
      if (!address) throw new Error("Wallet is not connected");

      const chainId = await provider.request<string>({ method: "eth_chainId" });
      if (chainId.toLowerCase() !== ARC_NETWORK.chainIdHex.toLowerCase()) {
        setStatus("error");
        setMessage(`Switch your wallet to ${ARC_NETWORK.chainName} first.`);
        return;
      }

      // The MVP sends a zero-value self-transaction. It proves the Arc checkout
      // flow onchain without transferring funds to a merchant or promising UC.
      const hash = await provider.request<string>({
        method: "eth_sendTransaction",
        params: [{ from: address, to: address, value: "0x0" }],
      });
      setTransactionHash(hash);
      setStatus("pending");

      for (let attempt = 0; attempt < 30; attempt += 1) {
        const receipt = await provider.request<TransactionReceipt | null>({
          method: "eth_getTransactionReceipt",
          params: [hash],
        });
        if (receipt) {
          if (receipt.status === "0x0") throw new Error("Transaction reverted");
          saveDemoOrder({
            id: `${hash}-${Date.now()}`,
            product: packages[selectedPackage].credits,
            playerId: playerId.trim(),
            transactionHash: hash,
            createdAt: new Date().toISOString(),
          });
          setStatus("success");
          setMessage("Demo order verified on Arc Testnet. No game credits were delivered.");
          return;
        }
        await wait(1_000);
      }

      setStatus("success");
      setMessage("Transaction submitted. Open ArcScan to check its final status.");
    } catch (error) {
      setStatus("error");
      setMessage(errorMessage(error));
    }
  }

  const isBusy = status === "confirming" || status === "pending";

  return (
    <section
      id="pubg-checkout"
      className="mt-12 scroll-mt-8 rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6 sm:p-8"
    >
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Testnet checkout
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">PUBG Mobile demo order</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            This test creates an onchain proof on Arc Testnet. It does not charge the
            package price and does not deliver real UC.
          </p>
        </div>
        <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
          Demo only
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <label className="text-sm font-medium text-slate-200" htmlFor="player-id">
            Demo player ID
          </label>
          <input
            id="player-id"
            value={playerId}
            onChange={(event) => setPlayerId(event.target.value)}
            placeholder="Example: 5123456789"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          <p className="mt-5 text-sm font-medium text-slate-200">Choose a test package</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {packages.map((item, index) => (
              <button
                key={item.credits}
                type="button"
                onClick={() => setSelectedPackage(index)}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedPackage === index
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-950/50 hover:border-slate-500"
                }`}
              >
                <span className="block font-semibold text-white">{item.credits}</span>
                <span className="mt-1 block text-xs text-slate-400">{item.price}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-fuchsia-500/20 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Order summary</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Product</span>
              <span className="text-white">{packages[selectedPackage].credits}</span>
            </div>
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Test charge</span>
              <span className="text-emerald-300">0 USDC</span>
            </div>
            <div className="flex justify-between gap-4 text-slate-400">
              <span>Network</span>
              <span className="text-white">Arc Testnet</span>
            </div>
          </div>

          <button
            type="button"
            onClick={createTestOrder}
            disabled={isBusy}
            className="mt-6 w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70"
          >
            {status === "confirming"
              ? "Confirm in wallet…"
              : status === "pending"
                ? "Verifying on Arc…"
                : "Create test order"}
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            The order charge is zero. Your wallet may spend a small amount of testnet
            USDC as the Arc network gas fee.
          </p>

          {message && (
            <p
              className={`mt-4 text-sm leading-6 ${status === "error" ? "text-rose-300" : "text-emerald-300"}`}
              role="status"
            >
              {message}
            </p>
          )}
          {transactionHash && (
            <a
              href={`${ARC_NETWORK.explorerUrl}/tx/${transactionHash}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              View transaction on ArcScan →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
