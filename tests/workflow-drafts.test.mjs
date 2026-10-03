import test from "node:test";
import assert from "node:assert/strict";
import { parseDrafts, validateDraft } from "../.test-dist/workflow-drafts.js";
const draft = { id: "sample", gameId: "pubg", productId: "60-uc", playerId: "demo-player", recipient: `0x${"1".repeat(40)}`, cadence: "weekly", day: 5, perPaymentLimit: "1.00", monthlyLimit: "5.00", state: "draft", updatedAt: "2026-10-03T10:00:00.000Z" };

test("workflow rejects unknown packages, invalid recipients and underfunded policies", () => {
  assert.equal(validateDraft(draft), null);
  for (const patch of [{ productId: "invalid" }, { recipient: `0x${"0".repeat(40)}` }, { recipient: "merchant" }, { playerId: " " }, { perPaymentLimit: "0.99" }, { monthlyLimit: "0.50" }, { perPaymentLimit: "Infinity" }, { perPaymentLimit: "1.001" }, { monthlyLimit: "10001" }]) assert.ok(validateDraft({ ...draft, ...patch }));
});
test("workflow days stay valid for weekly and monthly drafts", () => {
  assert.equal(validateDraft({ ...draft, day: 0 }), null);
  assert.equal(validateDraft({ ...draft, cadence: "monthly", day: 28 }), null);
  for (const patch of [{ day: 7 }, { day: 2.5 }, { cadence: "monthly", day: 0 }, { cadence: "monthly", day: 31 }]) assert.ok(validateDraft({ ...draft, ...patch }));
});
test("corrupt or unsupported stored drafts never render as runnable workflows", () => {
  for (const value of [null, "bad json", "{}", '[null,{},1,"draft"]']) assert.deepEqual(parseDrafts(value), []);
  const raw = JSON.stringify([draft, { ...draft, state: "active" }, { ...draft, monthlyLimit: "bad" }, { ...draft, updatedAt: "bad" }]);
  assert.deepEqual(parseDrafts(raw), [draft]);
  assert.equal(parseDrafts(JSON.stringify(Array.from({ length: 60 }, () => draft))).length, 50);
});
