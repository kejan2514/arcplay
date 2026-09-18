# Mainnet readiness

This release keeps checkout, Circle wallet creation, bridge configuration and identity integration on **Arc Testnet**. It does not move funds or provision a production wallet. Changing a chain ID environment variable is not a mainnet migration: proof verification explicitly rejects other chains.

Before enabling a production checkout:

1. Verify current chain parameters and supported Circle Wallets / Bridge Kit network identifiers against [Arc documentation](https://docs.arc.io) and [Circle documentation](https://developers.circle.com). Validate each endpoint's returned chain ID. Keep testnet and mainnet profiles complete and separate.
2. Define the merchant recipient, product delivery rules and refund process. The current demo self-transfers cannot settle a merchant purchase.
3. Replace browser-only history with authenticated, durable server-side orders, unique transaction-to-order binding, replay protection and idempotent settlement. Add rate limits and authentication to public wallet-mutating endpoints; the current Circle proof route is an intentionally public, daily-capped testnet demo, not a production authorization model.
4. Establish the production credential owner and wallet authorization policy. Independently review spending limits, keys, webhook authentication, retries and reconciliation. Do not reuse testnet credentials or enable an arbitrary public transfer endpoint.
5. Complete security review and dependency remediation, then test the full flow in staging. Test amount precision, gas affordability, wallet/network changes, unavailable RPC, dropped or replaced transactions, restart recovery and reconciliation.
6. Obtain explicit approval for the real recipient, amount limits and production release before any funded smoke test.

Already delivered in this iteration: server-side proof verification, downloadable receipts, recovery without resending, error tests and chain/staleness-aware telemetry. Remaining items above require production architecture and operator configuration; no claim of production readiness is made.
