import assert from "node:assert/strict";
import test from "node:test";
import proof from "../.test-dist/payment-proof.js";
import orders from "../.test-dist/demo-orders.js";
import recovery from "../.test-dist/check-payment.js";
const { verifyPaymentProof, paymentErrorMessage, isProofRequest, USDC_INTERFACE } = proof;
const hash = `0x${"a".repeat(64)}`, blockHash = `0x${"b".repeat(64)}`;
const sender = `0x${"1".repeat(40)}`, other = `0x${"2".repeat(40)}`;
const request = { hash, sender, kind: "wallet" };
function fixture(overrides = {}) {
  const receipt = { status: "0x1", transactionHash: hash, blockHash, blockNumber: "0x64", gasUsed: "0x5208", effectiveGasPrice: "0x3b9aca00", logs: [], ...overrides.receipt };
  const tx = { hash, from: sender, to: sender, value: "0x0", input: "0x", blockHash, ...overrides.tx };
  return async (method) => {
    if (overrides.fail) throw new Error("network timeout");
    if (method === "eth_chainId") return overrides.chainId ?? "0x4cef52";
    if (method === "eth_getTransactionReceipt") return overrides.pending ? null : receipt;
    if (method === "eth_getTransactionByHash") return tx;
    if (method === "eth_getBlockByNumber") return { hash: overrides.canonicalHash ?? blockHash };
    throw new Error(`Unexpected ${method}`);
  };
}
test("confirmed proof includes independently checked amount, parties, block and actual fee", async () => {
  const result = await verifyPaymentProof(request, fixture());
  assert.equal(result.status, "confirmed");
  assert.equal(result.receipt.amount, "0");
  assert.equal(result.receipt.networkFee, "0.000021");
  assert.equal(result.receipt.blockNumber, "100");
  assert.equal(result.receipt.recipient, sender);
});
test("pending and RPC failure never become successful receipts", async () => {
  assert.equal((await verifyPaymentProof(request, fixture({ pending: true }))).status, "pending");
  assert.equal((await verifyPaymentProof(request, fixture({ fail: true }))).status, "unavailable");
});
test("wrong network, sender, recipient, amount, hash and calldata are rejected", async () => {
  for (const overrides of [
    { chainId: "0x1" }, { tx: { from: other } }, { tx: { to: other } },
    { tx: { value: "0x1" } }, { tx: { hash: blockHash } }, { tx: { input: "0x1234" } },
    { receipt: { transactionHash: blockHash } },
  ]) assert.equal((await verifyPaymentProof(request, fixture(overrides))).status, "mismatch");
});
test("reverted and unknown receipt statuses cannot pass", async () => {
  assert.equal((await verifyPaymentProof(request, fixture({ receipt: { status: "0x0" } }))).status, "reverted");
  assert.equal((await verifyPaymentProof(request, fixture({ receipt: { status: undefined } }))).status, "unavailable");
});
test("a receipt on an inconsistent block stays pending", async () => {
  assert.equal((await verifyPaymentProof(request, fixture({ canonicalHash: hash }))).status, "pending");
});
test("Circle native transfer must be exactly 0.01 USDC at 18 decimals", async () => {
  const input = { ...request, kind: "circle" };
  assert.equal((await verifyPaymentProof(input, fixture({ tx: { value: `0x${(10n ** 16n).toString(16)}` } }))).status, "confirmed");
  assert.equal((await verifyPaymentProof(input, fixture({ tx: { value: "0x2710" } }))).status, "mismatch");
});
test("Circle ERC-20 transfer checks canonical contract, parties and six-decimal amount", async () => {
  const log = { address: USDC_INTERFACE, topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", `0x${sender.slice(2).padStart(64, "0")}`, `0x${sender.slice(2).padStart(64, "0")}`], data: "0x2710" };
  const input = { ...request, kind: "circle" };
  const run = (event) => verifyPaymentProof(input, fixture({ tx: { to: USDC_INTERFACE, input: "0xa9059cbb" }, receipt: { logs: [event] } }));
  assert.equal((await run(log)).status, "confirmed");
  assert.equal((await run({ ...log, address: other })).status, "mismatch");
  assert.equal((await run({ ...log, data: "0x1" })).status, "mismatch");
});
test("wallet cancellation and insufficient funds have actionable messages", () => {
  assert.match(paymentErrorMessage({ code: 4001 }), /cancelled/);
  assert.match(paymentErrorMessage({ code: -32002 }), /already waiting/);
  assert.match(paymentErrorMessage({ message: "insufficient funds for gas" }), /network fee/);
});
test("invalid proof inputs are rejected before an RPC request", async () => {
  assert.equal(isProofRequest({ ...request, hash: "bad" }), false);
  assert.equal((await verifyPaymentProof({}, () => { throw new Error("must not call"); })).status, "mismatch");
});
const order = { id: hash, game: "Game", product: "Pack", playerId: "demo", transactionHash: hash, createdAt: "2026-09-18T00:00:00Z", kind: "wallet", sender, status: "pending" };
test("history upserts repeated proof checks instead of duplicating the same transaction", () => {
  assert.equal(orders.upsertDemoOrder([order], { ...order, status: "confirmed" }).length, 1);
  assert.equal(orders.upsertDemoOrder([order], { ...order, id: "another-id" }).length, 1);
});
test("malformed local history is ignored and legacy hashes are not certified", () => {
  for (const value of ["{", "{}", "null", '[null,42,{}]']) assert.deepEqual(orders.parseDemoOrders(value), []);
  const legacy = orders.parseDemoOrders(JSON.stringify([{ ...order, status: undefined, receipt: { version: 1 } }]));
  assert.equal(legacy[0].receipt, undefined);
});
test("storage failure returns false without throwing after a successful send", () => {
  const previous = globalThis.window;
  globalThis.window = { localStorage: { getItem: () => null, setItem: () => { throw new Error("quota"); } } };
  try { assert.equal(orders.saveDemoOrder(order), false); } finally { globalThis.window = previous; }
});
test("Circle recovery only queries existing ID and verifies its hash; never creates a payment", async () => {
  const original = globalThis.fetch, calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push([url, init?.method ?? "GET"]);
    return Response.json(url.startsWith("/api/circle") ? { transaction: { state: "COMPLETE", txHash: hash, sender } } : { status: "pending", message: "Pending" });
  };
  try {
    const result = await recovery.checkPayment({ ...order, kind: "circle", circleId: "11111111-1111-4111-8111-111111111111", transactionHash: "" });
    assert.equal(result.result.status, "pending");
    assert.deepEqual(calls.map((c) => c[1]), ["GET", "POST"]);
    assert.equal(calls[1][0], "/api/payment-proof");
    assert.equal(result.order.transactionHash, hash);
  } finally { globalThis.fetch = original; }
});
test("a retry with unavailable RPC preserves the same hash and does not claim confirmation", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("offline"); };
  try {
    const result = await recovery.checkPayment(order);
    assert.equal(result.order.transactionHash, hash);
    assert.equal(result.order.status, "pending");
    assert.equal(result.result.status, "unavailable");
  } finally { globalThis.fetch = original; }
});
