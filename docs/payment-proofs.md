# Verifiable ArcPay transaction proofs

ArcPlay is the repository; ArcPay is the demo application name. This feature extends the existing application. It is not a merchant SDK or a production checkout.

## What is verified

Browser Wallet submits a **zero-value self-transfer** on Arc Testnet. Circle Wallet submits a daily-idempotent **0.01 test USDC self-transfer**. Neither pays the catalog price or delivers game credits.

`POST /api/payment-proof` independently reads the server-configured RPC. It checks:

- Arc Testnet chain ID `5042002`;
- successful execution (`0x1`), matching transaction hash, and a consistent canonical block;
- the expected sender, same-wallet recipient and exact proof amount;
- an empty-input native transfer, or (Circle only) a matching USDC Transfer event from the canonical ERC-20 interface;
- actual gas usage and gas price to calculate the network fee.

Native USDC uses **18 decimals**; the ERC-20 interface uses **6 decimals**. The token interface address is `0x3600000000000000000000000000000000000000`. See [Circle's Arc USDC explanation](https://www.arc.io/blog/building-with-usdc-on-arc-one-token-two-interfaces).

A submitted hash is not a successful payment. Missing receipts stay pending. RPC timeouts stay unavailable. Reverted and mismatched transactions are never shown as confirmed.

## Read-only API

```http
POST /api/payment-proof
Content-Type: application/json

{"hash":"0x…64 hex characters…","sender":"0x…40 hex characters…","kind":"wallet"}
```

Kinds: `wallet` (0 USDC) and `circle` (0.01 USDC).

Responses:

| Status | Meaning |
| --- | --- |
| `confirmed` | Includes a receipt with parties, actual amount, block, hash, fee and verification time. |
| `pending` | Receipt is not available or block reads are not yet consistent. |
| `reverted` | Execution failed. |
| `mismatch` | Wrong chain, sender, recipient, amount or transaction. |
| `unavailable` | RPC failed or returned unusable data. HTTP 503; safe to retry the read. |

Malformed requests return HTTP 400. The client supplies expectations, not trusted order authorization. Anyone can inspect public transaction data. This endpoint never signs or sends a transaction.

Run the reusable example against a running local app:

```bash
node examples/verify-proof.mjs http://localhost:3000 "$TX_HASH" "$SENDER_ADDRESS" wallet
```

The example only checks an existing transaction; it needs no private key. It exits with 0 for confirmed, 2 for pending, and 1 otherwise.

## Recovery and local history

The UI saves the transaction hash immediately after wallet submission, or the Circle transaction ID immediately after Circle accepts creation. On timeout it displays **Check status · no new transaction**. History provides the same read-only action after a reload. Circle status lookups are restricted to the configured wallet's ArcPay test proofs.

Repeated checks update the existing record instead of creating duplicate orders. Old records that only contain a hash are marked **Legacy · unverified**. Malformed browser storage is ignored; storage failures must not turn a submitted transaction into a failed payment. Download the proof while the page is open if storage is unavailable.

Receipts are local, editable JSON records. They are not signed attestations, ownership proofs, unique order bindings, or authorizations to deliver goods. Recheck the chain when current evidence is needed. A production merchant must persist server-owned orders, bind each transaction to one order and enforce unique settlement in durable storage.

## Tests

```bash
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Unit tests cover successful proofs, pending/reverted/malformed receipts, wrong networks, sender/recipient/value mismatches, both decimal representations, RPC failures, wallet cancellation, duplicate history and read-only retries. Browser tests use a simulated wallet and deterministic RPC fixtures: no funds move and no live Circle credentials are required.
