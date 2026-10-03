import type { Metadata } from "next";
import OrderHistory from "@/components/order-history";
export const metadata: Metadata = { title: "Activity | ArcPlay" };
export default function ActivityPage() {
  return <div className="mx-auto max-w-7xl"><h1 className="text-3xl font-bold">Your demo activity</h1><p className="mt-3 text-sm text-slate-400">Review saved orders, recheck pending proofs and download confirmed receipts.</p><OrderHistory /></div>;
}
