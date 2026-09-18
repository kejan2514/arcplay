/** Read-only proof verification. A confirmed self-transfer is not a merchant payment. */
export const PROOF_CHAIN_ID = 5042002;
export const USDC_INTERFACE = "0x3600000000000000000000000000000000000000";
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
export type ProofKind = "wallet" | "circle";
export type ProofRequest = { hash: string; sender: string; kind: ProofKind };
export type PaymentReceipt = {
  version: 1; chainId: number; network: string; transactionHash: string;
  sender: string; recipient: string; amount: string; currency: "USDC";
  kind: ProofKind; blockNumber: string; blockHash: string; networkFee: string;
  verifiedAt: string; explorerUrl: string;
};
export type ProofResult = {
  status: "confirmed"; receipt: PaymentReceipt;
} | { status: "pending" | "reverted" | "mismatch" | "unavailable"; message: string };
export type RpcRequest = <T>(method: string, params?: unknown[]) => Promise<T>;
export function isHash(value: unknown): value is string { return typeof value === "string" && /^0x[\da-f]{64}$/i.test(value); }
export function isAddress(value: unknown): value is string { return typeof value === "string" && /^0x[\da-f]{40}$/i.test(value); }
export function isProofRequest(value: unknown): value is ProofRequest {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<ProofRequest>;
  return isHash(v.hash) && isAddress(v.sender) && (v.kind === "wallet" || v.kind === "circle");
}
function same(a: string | null | undefined, b: string) { return a?.toLowerCase() === b.toLowerCase(); }
function units(value: bigint, decimals = 18) {
  const scale = 10n ** BigInt(decimals);
  const fraction = (value % scale).toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${value / scale}${fraction ? `.${fraction}` : ""}`;
}
type RpcReceipt = { status: string; transactionHash: string; blockHash: string; blockNumber: string; gasUsed: string; effectiveGasPrice: string; logs: { address: string; topics: string[]; data: string }[] };
type RpcTransaction = { hash: string; from: string; to: string | null; value: string; input: string; blockHash: string | null };

export async function verifyPaymentProof(input: ProofRequest, rpc: RpcRequest): Promise<ProofResult> {
  if (!isProofRequest(input)) return { status: "mismatch", message: "Invalid proof request." };
  try {
    const chainId = await rpc<string>("eth_chainId");
    if (BigInt(chainId) !== BigInt(PROOF_CHAIN_ID)) return { status: "mismatch", message: "RPC is not connected to Arc Testnet." };
    const receipt = await rpc<RpcReceipt | null>("eth_getTransactionReceipt", [input.hash]);
    if (!receipt) return { status: "pending", message: "Awaiting an onchain receipt. Check again without sending another transaction." };
    if (!same(receipt.transactionHash, input.hash) || !isHash(receipt.blockHash)) return { status: "mismatch", message: "Receipt does not match the requested transaction." };
    if (receipt.status === "0x0") return { status: "reverted", message: "The transaction reverted. No proof was confirmed." };
    if (receipt.status !== "0x1") return { status: "unavailable", message: "The receipt has no successful execution status." };
    const [tx, block] = await Promise.all([
      rpc<RpcTransaction | null>("eth_getTransactionByHash", [input.hash]),
      rpc<{ hash: string } | null>("eth_getBlockByNumber", [receipt.blockNumber, false]),
    ]);
    if (!tx || !block || !same(block.hash, receipt.blockHash) || !same(tx.blockHash, receipt.blockHash)) return { status: "pending", message: "Waiting for a consistent block and transaction receipt." };
    if (!same(tx.hash, input.hash) || !same(tx.from, input.sender)) return { status: "mismatch", message: "Transaction sender does not match this proof." };
    const amount = input.kind === "wallet" ? "0" : "0.01";
    const expectedNative = input.kind === "wallet" ? 0n : 10n ** 16n;
    const nativeMatch = same(tx.to, input.sender) && BigInt(tx.value) === expectedNative && tx.input === "0x";
    // Circle may use either native USDC (18 decimals) or its ERC-20 interface (6).
    const tokenMatch = input.kind === "circle" && same(tx.to, USDC_INTERFACE) && BigInt(tx.value) === 0n && receipt.logs.some((log) =>
      same(log.address, USDC_INTERFACE) && log.topics.length === 3 && same(log.topics[0], TRANSFER_TOPIC) &&
      same(log.topics[1], `0x${input.sender.slice(2).padStart(64, "0")}`) &&
      same(log.topics[2], `0x${input.sender.slice(2).padStart(64, "0")}`) && BigInt(log.data) === 10_000n,
    );
    if (!nativeMatch && !tokenMatch) return { status: "mismatch", message: "Recipient or amount does not match the expected self-transfer proof." };
    return { status: "confirmed", receipt: {
      version: 1, chainId: PROOF_CHAIN_ID, network: "Arc Testnet", transactionHash: input.hash,
      sender: tx.from, recipient: input.sender, amount, currency: "USDC", kind: input.kind,
      blockNumber: BigInt(receipt.blockNumber).toString(), blockHash: receipt.blockHash,
      networkFee: units(BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice)),
      verifiedAt: new Date().toISOString(), explorerUrl: `https://testnet.arcscan.app/tx/${input.hash}`,
    } };
  } catch {
    return { status: "unavailable", message: "Arc verification is temporarily unavailable. Keep this transaction and check again; do not resend it." };
  }
}

export function paymentErrorMessage(error: unknown) {
  const e = error as { code?: number; message?: string; cause?: { code?: number } } | null;
  const code = Number(e?.code ?? e?.cause?.code);
  if (code === 4001) return "Transaction cancelled in your wallet. Nothing was submitted.";
  if (code === -32002) return "A wallet request is already waiting for approval.";
  if (/insufficient funds/i.test(e?.message ?? "")) return "Not enough test USDC to cover the network fee. Fund your wallet from the testnet faucet.";
  return "The wallet request could not be completed. Check your wallet activity before trying again.";
}
