const configuredChainId = Number(
  process.env.NEXT_PUBLIC_ARC_CHAIN_ID ?? "5042002",
);

export const ARC_NETWORK = {
  chainId: configuredChainId,
  chainIdHex: `0x${configuredChainId.toString(16)}`,
  chainName: process.env.NEXT_PUBLIC_ARC_CHAIN_NAME ?? "Arc Testnet",
  rpcUrl:
    process.env.NEXT_PUBLIC_ARC_RPC_URL ??
    "https://rpc.testnet.arc.network",
  explorerUrl:
    process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ??
    "https://testnet.arcscan.app",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
} as const;
