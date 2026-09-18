const configuredChainId = Number(
  process.env.NEXT_PUBLIC_ARC_CHAIN_ID ?? "5042",
);

export const ARC_NETWORK = {
  chainId: configuredChainId,
  chainIdHex: `0x${configuredChainId.toString(16)}`,
  chainName: process.env.NEXT_PUBLIC_ARC_CHAIN_NAME ?? "Arc Mainnet",
  rpcUrl:
    process.env.NEXT_PUBLIC_ARC_RPC_URL ??
    "https://rpc.mainnet.arc.io",
  explorerUrl:
    process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ??
    "https://explorer.arc.io",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
} as const;
