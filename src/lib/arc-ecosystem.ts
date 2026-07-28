export type EcosystemCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  projects: EcosystemProject[];
};

export type EcosystemProject = {
  name: string;
  handle: string;
  status: "available" | "explore";
};

const project = (
  name: string,
  handle: string,
  status: EcosystemProject["status"] = "explore",
): EcosystemProject => ({ name, handle, status });

export const ECOSYSTEM_CATEGORIES: EcosystemCategory[] = [
  {
    id: "bridges",
    title: "Bridges",
    description: "Move assets between Arc and connected ecosystems.",
    icon: "↔",
    projects: [
      project("Across", "AcrossProtocol"),
      project("Stargate", "StargateFinance"),
      project("LI.FI", "lifiprotocol"),
      project("Relay", "RelayProtocol"),
      project("Gas.zip", "gasdotzip"),
      project("LayerZero", "LayerZero_Core"),
    ],
  },
  {
    id: "launchpads",
    title: "Launchpads",
    description: "Explore early token and community launch experiences.",
    icon: "↗",
    projects: [
      project("Flutch", "Flutchdotfun"),
      project("AstraPump", "AstraPump"),
      project("Warp on Arc", "warponarc"),
      project("Act Fun", "actfunxyz"),
      project("Sharc Fun", "SharcFun"),
      project("Onmi", "onmidotfun"),
    ],
  },
  {
    id: "swaps",
    title: "Swap & liquidity",
    description: "Discover token exchange and liquidity venues around Arc.",
    icon: "⇄",
    projects: [
      project("ArcSwap", "arcswapexchenge"),
      project("Oku", "okutrade"),
      project("Uniswap", "Uniswap"),
      project("Odos", "odosprotocol"),
      project("1inch", "1inch"),
      project("ArcDEXScan", "ArcDEXScan"),
      project("Tower Exchange", "TowerExchange"),
      project("Curve", "CurveFinance"),
      project("Balancer", "Balancer"),
      project("CoW Swap", "CoWSwap"),
      project("OpenOcean", "OpenOceanGlobal"),
    ],
  },
  {
    id: "defi",
    title: "Lending & yield",
    description: "Research stablecoin lending, yield and onchain finance tools.",
    icon: "%",
    projects: [
      project("Morpho", "Morpho"),
      project("Pendle", "pendle_fi"),
      project("Ethena", "ethena"),
      project("Lido", "LidoFinance"),
      project("Ondo", "OndoFinance"),
      project("Xylon", "Xylonet_"),
      project("Lunex", "lunexfinance"),
      project("ACH Protocol", "AchProtocol"),
      project("UnitFlow", "UnitFlowFinance"),
      project("SwapArc", "swaparc_app"),
      project("Synthra", "synthra_finance"),
      project("WizPay", "wizpay_arc"),
    ],
  },
  {
    id: "nfts",
    title: "NFT & identity",
    description: "Community collections and early onchain identity experiments.",
    icon: "◇",
    projects: [
      project("Onchain Sharc", "onchainsharc"),
      project("Orixa", "Orixaxyz"),
      project("Kynera", "KyneraOnArc"),
      project("Arc Citizens", "ArcCitizens"),
      project("ARChitects", "ARChitects_xyz"),
      project("Arc Voxeel", "arcvoxeel"),
      project("Arc Punks", "Arc_Punks"),
      project("ArcPunks NFT", "ArcPunksNFT"),
      project("Punk on Arc", "punkonarc"),
      project("Arc Gizmo", "arcgizmo"),
      project("Unemployee on Arc", "unemployeeonarc"),
    ],
  },
  {
    id: "wallets",
    title: "Wallets",
    description: "Connect to ArcPay or explore other entry points to Arc.",
    icon: "▣",
    projects: [
      project("Circle Wallets", "circle", "available"),
      project("Arc Wallet", "wallet", "available"),
      project("MetaMask", "MetaMask", "available"),
      project("Rabby", "Rabby_io"),
      project("Trust Wallet", "TrustWallet"),
    ],
  },
];

