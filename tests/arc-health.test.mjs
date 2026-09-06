import assert from "node:assert/strict";
import test from "node:test";
import healthPolicy from "../.test-dist/arc-health.js";

const {
  STALE_BLOCK_THRESHOLD_SECONDS,
  getArcHealthStatus,
  isFreshArcBlock,
} = healthPolicy;

test("healthy Arc blocks stay OK through the freshness threshold", () => {
  assert.equal(getArcHealthStatus(0), "ok");
  assert.equal(getArcHealthStatus(STALE_BLOCK_THRESHOLD_SECONDS), "ok");
  assert.equal(isFreshArcBlock(STALE_BLOCK_THRESHOLD_SECONDS), true);
});

test("stale Arc blocks degrade health", () => {
  const staleAge = STALE_BLOCK_THRESHOLD_SECONDS + 1;
  assert.equal(getArcHealthStatus(staleAge), "degraded");
  assert.equal(isFreshArcBlock(staleAge), false);
});

test("unreachable Arc RPC reports unavailable", () => {
  assert.equal(getArcHealthStatus(0, false), "unavailable");
  assert.equal(getArcHealthStatus(Number.POSITIVE_INFINITY, false), "unavailable");
});
