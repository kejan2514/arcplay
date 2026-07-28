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
  website?: string;
  status: "available" | "explore";
  arcSupport: "verified" | "unconfirmed" | "unavailable";
};

const project = (
  name: string,
  handle: string,
  status: EcosystemProject["status"] = "explore",
  website?: string,
  arcSupport: EcosystemProject["arcSupport"] = "unconfirmed",
): EcosystemProject => ({ name, handle, status, website, arcSupport });

export const ECOSYSTEM_CATEGORIES: EcosystemCategory[] = [
  {
    id: "bridges",
    title: "Bridges",
    description: "Move assets between Arc and connected ecosystems.",
    icon: "↔",
    projects: [
      project("Across", "AcrossProtocol", "explore", "https://app.across.to/", "unavailable"),
      project("Stargate", "StargateFinance", "explore", "https://stargate.finance/transfer", "unavailable"),
      project("LI.FI", "lifiprotocol", "explore", "https://jumper.exchange/", "verified"),
      project("Relay", "RelayProtocol", "explore", "https://relay.link/bridge", "unavailable"),
      project("Gas.zip", "gasdotzip", "explore", "https://www.gas.zip/"),
      project("LayerZero", "LayerZero_Core", "explore", "https://layerzero.network/"),
    ],
  },
  {
    id: "launchpads",
    title: "Launchpads",
    description: "Explore early token and community launch experiences.",
    icon: "↗",
    projects: [
      project("Flutch", "Flutchdotfun"),
      project("AstraPump", "AstraPump", "explore", "https://astrapump.org/"),
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
      project("Oku", "okutrade", "explore", "https://oku.trade/"),
      project("Uniswap", "Uniswap", "explore", "https://app.uniswap.org/"),
      project("Odos", "odosprotocol", "explore", "https://app.odos.xyz/"),
      project("1inch", "1inch", "explore", "https://app.1inch.io/"),
      project("ArcDEXScan", "ArcDEXScan"),
      project("Tower Exchange", "TowerExchange"),
      project("Curve", "CurveFinance", "explore", "https://curve.finance/"),
      project("Balancer", "Balancer", "explore", "https://balancer.fi/"),
      project("CoW Swap", "CoWSwap", "explore", "https://swap.cow.fi/"),
      project("OpenOcean", "OpenOceanGlobal", "explore", "https://app.openocean.finance/"),
    ],
  },
  {
    id: "defi",
    title: "Lending & yield",
    description: "Research stablecoin lending, yield and onchain finance tools.",
    icon: "%",
    projects: [
      project("Morpho", "Morpho", "explore", "https://app.morpho.org/"),
      project("Pendle", "pendle_fi", "explore", "https://app.pendle.finance/"),
      project("Ethena", "ethena", "explore", "https://app.ethena.fi/"),
      project("Lido", "LidoFinance", "explore", "https://stake.lido.fi/"),
      project("Ondo", "OndoFinance", "explore", "https://ondo.finance/"),
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
      project("Circle Wallets", "circle", "available", "https://console.circle.com/wallets", "verified"),
      project("Arc Wallet", "wallet", "available"),
      project("MetaMask", "MetaMask", "available", "https://portfolio.metamask.io/", "verified"),
      project("Rabby", "Rabby_io", "explore", "https://rabby.io/"),
      project("Trust Wallet", "TrustWallet", "explore", "https://wallet.trustwallet.com/"),
    ],
  },
];
