import type { DemoOrder } from "./demo-orders";
import { isHash, type ProofResult } from "./payment-proof";

/** Read-only retry: never calls a wallet send method or the Circle creation endpoint. */
export async function checkPayment(order: DemoOrder): Promise<{ order: DemoOrder; result: ProofResult }> {
  let current = order;
  try {
    if (order.kind === "circle" && order.circleId) {
      const response = await fetch(`/api/circle/payments?id=${encodeURIComponent(order.circleId)}`, { cache: "no-store", signal: AbortSignal.timeout(12_000) });
      const data = await response.json();
      if (!response.ok || !data.transaction) throw new Error("Circle lookup unavailable");
      if (["FAILED", "DENIED", "CANCELLED"].includes(data.transaction.state)) return { order: { ...order, status: "reverted", receipt: undefined }, result: { status: "reverted", message: "Circle reports that this transaction did not complete." } };
      current = { ...order, transactionHash: data.transaction.txHash || order.transactionHash, sender: data.transaction.sender };
    }
    if (!isHash(current.transactionHash)) return { order: current, result: { status: "pending", message: "Circle has not published a transaction hash yet. Check again without creating another proof." } };
    if (!current.sender || !current.kind) return { order: current, result: { status: "mismatch", message: "This older order has no saved proof details. Inspect the transaction in the explorer." } };
    const response = await fetch("/api/payment-proof", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: current.transactionHash, sender: current.sender, kind: current.kind }), signal: AbortSignal.timeout(30_000),
    });
    const result = await response.json() as ProofResult;
    if (!response.ok && result.status !== "unavailable") throw new Error("Proof lookup unavailable");
    if (result.status === "confirmed") current = { ...current, status: "confirmed", receipt: result.receipt };
    else current = { ...current, status: result.status === "reverted" || result.status === "mismatch" ? result.status : "pending", receipt: undefined };
    return { order: current, result };
  } catch {
    return { order: { ...current, status: "pending", receipt: undefined }, result: { status: "unavailable", message: "Verification is temporarily unavailable. Check this saved transaction again without resending it." } };
  }
}
