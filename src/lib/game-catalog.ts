export type GameProduct = {
  id: string;
  label: string;
  price: string;
};

export type Game = {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  accountLabel: string;
  accountPlaceholder: string;
  products: GameProduct[];
};

export const GAMES: Game[] = [
  { id: "pubg", name: "PUBG Mobile", shortName: "PUBG", icon: "🎮", description: "UC packs and battle pass credits.", accountLabel: "Player ID", accountPlaceholder: "Example: 5123456789", products: [{ id: "60-uc", label: "60 UC", price: "1.00" }, { id: "325-uc", label: "325 UC", price: "5.00" }, { id: "660-uc", label: "660 UC", price: "10.00" }] },
  { id: "free-fire", name: "Free Fire", shortName: "Free Fire", icon: "🔥", description: "Diamonds for bundles and upgrades.", accountLabel: "Player ID", accountPlaceholder: "Enter Free Fire player ID", products: [{ id: "100-diamonds", label: "100 Diamonds", price: "1.49" }, { id: "520-diamonds", label: "520 Diamonds", price: "6.99" }, { id: "1060-diamonds", label: "1,060 Diamonds", price: "13.49" }] },
  { id: "mobile-legends", name: "Mobile Legends", shortName: "MLBB", icon: "⚔️", description: "Diamonds for heroes and skins.", accountLabel: "User ID / Zone ID", accountPlaceholder: "Example: 12345678 / 1234", products: [{ id: "86-diamonds", label: "86 Diamonds", price: "1.99" }, { id: "429-diamonds", label: "429 Diamonds", price: "8.99" }, { id: "963-diamonds", label: "963 Diamonds", price: "18.99" }] },
  { id: "valorant", name: "Valorant", shortName: "Valorant", icon: "✦", description: "VP for premium weapon bundles.", accountLabel: "Riot ID", accountPlaceholder: "Example: Player#TAG", products: [{ id: "475-vp", label: "475 VP", price: "4.99" }, { id: "1000-vp", label: "1,000 VP", price: "9.99" }, { id: "2050-vp", label: "2,050 VP", price: "19.99" }] },
  { id: "steam", name: "Steam Wallet", shortName: "Steam", icon: "◉", description: "Demo wallet codes for PC games.", accountLabel: "Email", accountPlaceholder: "Delivery email (demo only)", products: [{ id: "steam-5", label: "$5 Wallet", price: "5.00" }, { id: "steam-10", label: "$10 Wallet", price: "10.00" }, { id: "steam-25", label: "$25 Wallet", price: "25.00" }] },
  { id: "riot", name: "Riot Points", shortName: "Riot", icon: "◆", description: "Points for League of Legends.", accountLabel: "Riot ID", accountPlaceholder: "Example: Player#TAG", products: [{ id: "575-rp", label: "575 RP", price: "4.99" }, { id: "1380-rp", label: "1,380 RP", price: "10.99" }, { id: "2800-rp", label: "2,800 RP", price: "21.99" }] },
  { id: "playstation", name: "PlayStation", shortName: "PlayStation", icon: "△", description: "Demo PlayStation Store credit.", accountLabel: "Email", accountPlaceholder: "Delivery email (demo only)", products: [{ id: "ps-10", label: "$10 Store Credit", price: "10.00" }, { id: "ps-25", label: "$25 Store Credit", price: "25.00" }, { id: "ps-50", label: "$50 Store Credit", price: "50.00" }] },
  { id: "xbox", name: "Xbox", shortName: "Xbox", icon: "ⓧ", description: "Demo Xbox gift balance.", accountLabel: "Email", accountPlaceholder: "Delivery email (demo only)", products: [{ id: "xbox-10", label: "$10 Gift Card", price: "10.00" }, { id: "xbox-25", label: "$25 Gift Card", price: "25.00" }, { id: "xbox-50", label: "$50 Gift Card", price: "50.00" }] },
  { id: "discord", name: "Discord Nitro", shortName: "Discord", icon: "◌", description: "Demo Nitro subscription codes.", accountLabel: "Email", accountPlaceholder: "Delivery email (demo only)", products: [{ id: "nitro-basic", label: "Nitro Basic", price: "2.99" }, { id: "nitro-month", label: "Nitro · 1 Month", price: "9.99" }, { id: "nitro-year", label: "Nitro · 1 Year", price: "99.99" }] },
];
