"use client";
import { useEffect, useRef, useState } from "react";
import { DEMO_ORDER_EVENT, type DemoOrder, readDemoOrders, saveDemoOrder } from "@/lib/demo-orders";
import { checkPayment } from "@/lib/check-payment";
import { isHash } from "@/lib/payment-proof";
import PaymentReceiptCard from "@/components/payment-receipt";

export default function OrderHistory() {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [checking, setChecking] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  useEffect(() => {
    const refresh = () => setOrders(readDemoOrders());
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(DEMO_ORDER_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener(DEMO_ORDER_EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  async function check(order: DemoOrder) {
    if (busy.current) return;
    busy.current = true; setChecking(order.id); setMessage("");
    try {
      const result = await checkPayment(order);
      const saved = saveDemoOrder(result.order);
      setMessage((result.result.status === "confirmed" ? "Self-transfer confirmed. The receipt is ready." : result.result.message) + (saved ? "" : " Browser storage is unavailable."));
    } finally { busy.current = false; setChecking(null); }
  }
  return <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">Local history</p>
    <h2 className="mt-2 text-2xl font-bold text-white">Demo orders & transaction proofs</h2>
    <p className="mt-2 text-sm text-slate-400">Stored only in this browser. Saved receipts are local records, not merchant payment authorizations. Recheck to read the chain again.</p>
    {message ? <p role="status" className="mt-3 text-sm text-cyan-200">{message}</p> : null}
    {!orders.length ? <p className="mt-6 rounded-2xl border border-dashed border-slate-700 px-5 py-8 text-center text-sm text-slate-500">Submitted proofs and demo orders will appear here.</p> : <div className="mt-6 space-y-3">{orders.map((order) => {
      const onchain = isHash(order.transactionHash) || Boolean(order.circleId);
      const label = order.receipt ? "Confirmed · saved receipt" : order.status === "pending" ? "Awaiting confirmation" : order.status === "reverted" ? "Failed" : order.status === "mismatch" ? "Proof mismatch" : onchain ? "Legacy · unverified" : "Simulation · no payment";
      return <article key={order.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-semibold text-white">{order.game} · {order.product}</p><span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">{label}</span></div>
        <p className="mt-2 text-xs text-slate-500">Player {order.playerId} · {new Date(order.createdAt).toLocaleString()}</p>
        <div className="mt-3 flex flex-wrap gap-4">
          {isHash(order.transactionHash) ? <a href={`https://testnet.arcscan.app/tx/${order.transactionHash}`} target="_blank" rel="noreferrer" className="text-sm text-cyan-300">View transaction ↗</a> : null}
          {order.kind && (order.sender || order.circleId) ? <button type="button" disabled={checking !== null} onClick={() => void check(order)} className="text-sm text-cyan-200 disabled:opacity-50">{checking === order.id ? "Checking…" : "Check status · no new transaction"}</button> : null}
        </div>
        {order.circleId && !isHash(order.transactionHash) ? <p className="mt-2 break-all text-xs text-slate-500">Circle reference: {order.circleId}</p> : null}
        {order.receipt ? <details className="mt-3"><summary className="cursor-pointer text-sm text-emerald-300">View receipt & download</summary><PaymentReceiptCard receipt={order.receipt} /></details> : null}
      </article>;
    })}</div>}
  </section>;
}
