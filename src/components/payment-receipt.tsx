"use client";
import type { PaymentReceipt } from "@/lib/payment-proof";

export default function PaymentReceiptCard({ receipt }: { receipt: PaymentReceipt }) {
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `arc-proof-${receipt.transactionHash}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm">
    <p className="font-semibold text-emerald-300">Confirmed testnet self-transfer</p>
    <p className="mt-1 text-xs text-slate-400">This is a transaction proof. No merchant was paid and no game credits were delivered.</p>
    <dl className="mt-3 grid gap-2 text-slate-300">
      <div><dt className="text-slate-500">Transferred / network fee</dt><dd>{receipt.amount} test USDC / {receipt.networkFee} test USDC</dd></div>
      <div><dt className="text-slate-500">Sender</dt><dd className="break-all font-mono text-xs">{receipt.sender}</dd></div>
      <div><dt className="text-slate-500">Recipient (same wallet)</dt><dd className="break-all font-mono text-xs">{receipt.recipient}</dd></div>
      <div><dt className="text-slate-500">Network / block</dt><dd>{receipt.network} · {receipt.chainId} · #{receipt.blockNumber}</dd></div>
      <div><dt className="text-slate-500">Transaction</dt><dd className="break-all font-mono text-xs">{receipt.transactionHash}</dd></div>
      <div><dt className="text-slate-500">Last checked</dt><dd>{new Date(receipt.verifiedAt).toLocaleString()}</dd></div>
    </dl>
    <button type="button" onClick={download} className="mt-3 rounded-full border border-emerald-400/30 px-3 py-2 text-xs font-semibold text-emerald-200">Download proof JSON</button>
  </div>;
}
