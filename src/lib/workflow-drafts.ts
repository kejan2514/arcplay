import { GAMES } from "./game-catalog";

export const WORKFLOW_STORAGE_KEY = "arcplay-workflow-drafts-v1";
export type WorkflowDraft = {
  id: string;
  gameId: string;
  productId: string;
  playerId: string;
  recipient: string;
  cadence: "weekly" | "monthly";
  day: number;
  perPaymentLimit: string;
  monthlyLimit: string;
  state: "draft" | "paused";
  updatedAt: string;
};

export function validateDraft(draft: WorkflowDraft): string | null {
  const game = GAMES.find((item) => item.id === draft.gameId);
  const product = game?.products.find((item) => item.id === draft.productId);
  if (!product) return "Choose a valid game and package.";
  if (!draft.playerId.trim() || draft.playerId.length > 200) return "Enter a demo player ID or email (up to 200 characters).";
  if (!/^0x[0-9a-fA-F]{40}$/.test(draft.recipient) || /^0x0{40}$/i.test(draft.recipient)) return "Enter a non-zero recipient wallet address (0x + 40 hexadecimal characters).";
  if (!["weekly", "monthly"].includes(draft.cadence)) return "Choose a weekly or monthly schedule.";
  if (!Number.isInteger(draft.day) || draft.day < (draft.cadence === "weekly" ? 0 : 1) || draft.day > (draft.cadence === "weekly" ? 6 : 28)) return "Choose a valid schedule day.";
  if (![draft.perPaymentLimit, draft.monthlyLimit].every((value) => /^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0 && Number(value) <= 10000)) return "Budgets must be between 0.01 and 10,000 test USDC, with at most two decimal places.";
  if (Number(draft.perPaymentLimit) < Number(product.price)) return "The per-payment limit must cover the selected catalog price.";
  if (Number(draft.monthlyLimit) < Number(draft.perPaymentLimit)) return "The monthly limit must be at least the per-payment limit.";
  return null;
}

export function parseDrafts(raw: string | null): WorkflowDraft[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is WorkflowDraft => {
      if (!item || typeof item !== "object") return false;
      const d = item as WorkflowDraft;
      return typeof d.id === "string" && d.id.length < 100 && typeof d.gameId === "string" && typeof d.productId === "string" && typeof d.playerId === "string" && typeof d.recipient === "string" && typeof d.perPaymentLimit === "string" && typeof d.monthlyLimit === "string" && ["draft", "paused"].includes(d.state) && typeof d.updatedAt === "string" && Number.isFinite(Date.parse(d.updatedAt)) && validateDraft(d) === null;
    }).slice(0, 50);
  } catch { return []; }
}
