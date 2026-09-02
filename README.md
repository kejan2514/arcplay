# ArcPay

[![CI](https://github.com/kejan2514/arcplay/actions/workflows/ci.yml/badge.svg)](https://github.com/kejan2514/arcplay/actions/workflows/ci.yml)

**The Agentic Commerce Layer on Arc.**

ArcPay is an open-source reference demo for agentic commerce on Arc. It combines autonomous payment workflows, wallet connectivity, Circle USDC bridging, a game-credit checkout, transaction history, and live Arc Testnet telemetry in one dark, responsive developer experience.

> ArcPay is an experimental testnet project. It is not a production payment service and must not be used with real funds.

## Features

- Agentic workflow visualization from trigger to settlement
- AI agent status, reputation, and analytics dashboard
- Wallet connection and testnet USDC balance display
- Circle Bridge Kit flow for bridging USDC to Arc
- Server-only Circle developer-controlled wallet integration for Arc Testnet
- Live Arc Testnet block, chain ID, block age, and RPC latency telemetry
- Game-credit catalog and PUBG test checkout
- Local order history for completed demo purchases
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

The App Router page composes focused sections from `src/components`. Existing interactive wallet, checkout, bridge, balance, history, and live-network components remain isolated, while server routes handle Arc RPC and Circle infrastructure concerns.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- viem
- Circle Bridge Kit and Circle viem adapter
- Arc Testnet and test USDC
- GitHub Actions CI

The interface also presents Vyper and ERC-8004 as part of the project roadmap and agentic-commerce architecture; they are not yet implemented as production integrations.

## Local setup

### Prerequisites

- Node.js 20 or newer
- npm
- A browser wallet configured for the supported test networks

### Run the app

```bash
git clone https://github.com/kejan2514/arcplay.git
cd arcplay
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

The same quality checks run in GitHub Actions for pushes and pull requests targeting `main`.

Wallet transactions still require a compatible wallet and testnet funds. The Circle wallet panel works in a safe unconfigured state by default.

### Live Arc Testnet telemetry

The `/api/arc-network` server route reads Arc Testnet using `viem` and exposes the latest block, chain ID, block age, RPC latency, explorer URL, and update time to the dashboard. Set `ARC_TESTNET_RPC_URL` to override the default public Arc Testnet RPC endpoint.

### Circle developer-controlled wallets

Copy `.env.example` to `.env.local`, then add credentials created in Circle Console:

```text
CIRCLE_API_KEY=your_api_key
CIRCLE_ENTITY_SECRET=your_registered_entity_secret
CIRCLE_WALLET_SET_ID=optional_existing_wallet_set_id
CIRCLE_WALLET_ID=provisioned_wallet_id
CIRCLE_WALLET_ADDRESS=provisioned_wallet_address
```

After adding only `CIRCLE_API_KEY`, register an entity secret without printing it:

```bash
npm run circle:register-secret
```

The command saves the secret to `.env.local` and a recovery file under the ignored `recovery/` directory. Move that recovery file to secure private storage immediately.

Provision the first Arc Testnet wallet and persist its wallet set ID locally:

```bash
npm run circle:provision-wallet
```

These values are server-only. Never add a `NEXT_PUBLIC_` prefix, paste them into browser code, commit `.env.local`, or share them in screenshots. If `CIRCLE_WALLET_SET_ID` is omitted, the first wallet request creates a wallet set and returns its ID; save it locally before creating additional wallets.

The current integration creates an EOA on `ARC-TESTNET`, reads its token balance, and links to the official Circle Faucet for manual test USDC funding. It does not transfer real USDC or deliver a product.

## Testnet disclaimer

ArcPay is demonstration software. Live Arc telemetry is read from Arc Testnet, while AI-agent analytics and other showcase metrics may still be illustrative unless explicitly connected to a live provider. Contract addresses, token details, and wallet prompts must be independently verified before signing. Never send production assets or real USDC to testnet contracts or addresses.

## Roadmap

- [x] Arc-themed landing page and commerce demo
- [x] Wallet connection, balance, checkout, bridge, and order history
- [x] Reusable component architecture
- [x] Circle developer-controlled Arc Testnet wallet backend
- [x] Connect dashboard metrics to live Arc Testnet telemetry
- [x] Add CI lint, TypeScript, and production-build gates
- [ ] Implement Vyper payment-policy contracts
- [ ] Add ERC-8004-compatible agent identity and reputation
- [ ] Ship a configurable workflow builder and merchant SDK
- [ ] Add automated application tests and audited production safeguards

## License

This project is available under the [MIT License](LICENSE).
