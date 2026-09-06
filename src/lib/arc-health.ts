export const STALE_BLOCK_THRESHOLD_SECONDS = 120;

export type ArcHealthStatus = "ok" | "degraded" | "unavailable";

export function getArcHealthStatus(
  blockAgeSeconds: number,
  rpcReachable = true,
): ArcHealthStatus {
  if (!rpcReachable) return "unavailable";
  return blockAgeSeconds <= STALE_BLOCK_THRESHOLD_SECONDS ? "ok" : "degraded";
}

export function isFreshArcBlock(blockAgeSeconds: number): boolean {
  return getArcHealthStatus(blockAgeSeconds) === "ok";
}
