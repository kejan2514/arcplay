# ArcPay

**The Agentic Commerce Layer on Arc.**

ArcPay is an open-source reference demo for agentic commerce on Arc. It combines autonomous payment workflows, wallet connectivity, Circle USDC bridging, a game-credit checkout, and transaction history in one dark, responsive developer experience.

> ArcPay is an experimental testnet project. It is not a production payment service and must not be used with real funds.

## Features

- Agentic workflow visualization from trigger to settlement
- AI agent status, reputation, and analytics dashboard
- Wallet connection and testnet USDC balance display
- Circle Bridge Kit flow for bridging USDC to Arc
- Game-credit catalog and PUBG test checkout
- Local order history for completed demo purchases
- Arc network and developer-stack showcase
- Responsive, glassmorphism-based Arc visual theme

## Architecture

```text
Wallet / Schedule / Webhook
            ↓
         AI Agent
            ↓
   Payment Workflow Rules
            ↓
 Arc Testnet + Circle USDC
            ↓
 Merchant Settlement + Receipt
```

The App Router page composes focused sections from `src/components`. Existing interactive wallet, checkout, bridge, balance, and history components remain isolated client components, while the surrounding presentation is server-rendered.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- viem
- Circle Bridge Kit and Circle viem adapter
- Arc Testnet and test USDC

The interface also presents Vyper and ERC-8004 as part of the project roadmap and agentic-commerce architecture; they are not yet implemented as production integrations.

## Local setup

### Prerequisites

- Node.js 20 or newer
- npm
- A browser wallet configured for the supported test networks

### Run the app

```bash
git clone <your-repository-url>
cd arcplay
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
npm run build
```

No environment variables are required for the current demo. Wallet transactions still require a compatible wallet and testnet funds.

## Testnet disclaimer

ArcPay is demonstration software. Network metrics and AI-agent analytics shown in the showcase sections are illustrative unless explicitly connected to a live provider. Contract addresses, token details, and wallet prompts must be independently verified before signing. Never send production assets or real USDC to testnet contracts or addresses.

## Roadmap

- [x] Arc-themed landing page and commerce demo
- [x] Wallet connection, balance, checkout, bridge, and order history
- [x] Reusable component architecture
- [ ] Connect dashboard metrics to live Arc data
- [ ] Implement Vyper payment-policy contracts
- [ ] Add ERC-8004-compatible agent identity and reputation
- [ ] Ship a configurable workflow builder and merchant SDK
- [ ] Add automated tests and audited production safeguards

## License

This project is available under the [MIT License](LICENSE).
