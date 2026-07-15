"use client";

import { useEffect, useState } from "react";
import { ARC_NETWORK } from "@/lib/arc-network";
import {
  DEMO_ORDER_EVENT,
  type DemoOrder,
  readDemoOrders,
} from "@/lib/demo-orders";

function shortHash(hash: string) {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<DemoOrder[]>([]);

  useEffect(() => {
    const refresh = () => setOrders(readDemoOrders());
    const initialRead = window.setTimeout(refresh, 0);
    window.addEventListener(DEMO_ORDER_EVENT, refresh);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener(DEMO_ORDER_EVENT, refresh);
    };
  }, []);

  return (
    <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">
          Local history
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">Demo orders</h2>
        <p className="mt-2 text-sm text-slate-400">
          Stored only in this browser. No real game credits are delivered.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 px-5 py-8 text-center text-sm text-slate-500">
          Your successful ArcPlay test orders will appear here.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <article
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white">{order.game || "PUBG Mobile"} · {order.product}</span>
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">
                    Verified
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Player {order.playerId} · {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <a
                href={`${ARC_NETWORK.explorerUrl}/tx/${order.transactionHash}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                {shortHash(order.transactionHash)} ↗
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
