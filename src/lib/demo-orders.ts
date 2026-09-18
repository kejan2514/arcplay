import { isAddress, isHash, type PaymentReceipt, type ProofKind } from "./payment-proof";
export const DEMO_ORDERS_KEY = "arcplay-demo-orders";
export const DEMO_ORDER_EVENT = "arcplay:demo-order-created";
export const BALANCE_REFRESH_EVENT = "arcplay:balance-refresh";
export type DemoOrder = {
  id: string; game: string; product: string; playerId: string; transactionHash: string; createdAt: string;
  kind?: ProofKind; sender?: string; circleId?: string;
  status?: "pending" | "confirmed" | "reverted" | "mismatch";
  receipt?: PaymentReceipt;
};
export function parseDemoOrders(stored: string | null): DemoOrder[] {
  try {
    const data: unknown = JSON.parse(stored ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.filter((v): v is DemoOrder => v && typeof v === "object" &&
      ["id", "game", "product", "playerId", "transactionHash", "createdAt"].every((key) => typeof v[key] === "string") &&
      (v.sender === undefined || isAddress(v.sender)) &&
      (v.kind === undefined || v.kind === "wallet" || v.kind === "circle") &&
      (v.circleId === undefined || (typeof v.circleId === "string" && /^[\da-f-]{36}$/i.test(v.circleId))))
      .slice(0, 50).map((v) => ({ ...v, receipt: isStoredReceipt(v.receipt, v.transactionHash) ? v.receipt : undefined }));
  } catch { return []; }
}
function isStoredReceipt(value: unknown, hash: string): value is PaymentReceipt {
  if (!value || typeof value !== "object") return false;
  const r = value as PaymentReceipt;
  return r.version === 1 && r.chainId === 5042002 && isHash(hash) && r.transactionHash === hash &&
    isAddress(r.sender) && isAddress(r.recipient) && typeof r.amount === "string" &&
    typeof r.networkFee === "string" && typeof r.blockNumber === "string" &&
    typeof r.verifiedAt === "string" && (r.kind === "wallet" || r.kind === "circle");
}
export function readDemoOrders(): DemoOrder[] {
  try { return parseDemoOrders(window.localStorage.getItem(DEMO_ORDERS_KEY)); } catch { return []; }
}
export function upsertDemoOrder(orders: DemoOrder[], order: DemoOrder): DemoOrder[] {
  return [order, ...orders.filter((old) => old.id !== order.id && (!isHash(order.transactionHash) || old.transactionHash !== order.transactionHash))].slice(0, 50);
}
/** A storage failure must never turn a submitted transaction into a payment failure. */
export function saveDemoOrder(order: DemoOrder): boolean {
  try {
    window.localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(upsertDemoOrder(readDemoOrders(), order)));
    window.dispatchEvent(new Event(DEMO_ORDER_EVENT));
    window.dispatchEvent(new Event(BALANCE_REFRESH_EVENT));
    return true;
  } catch { return false; }
}
