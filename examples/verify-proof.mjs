/** Read-only example: never requests a private key or sends a transaction. */
const [baseUrl = "http://localhost:3000", hash, sender, kind = "wallet"] = process.argv.slice(2);
if (!/^0x[\da-f]{64}$/i.test(hash ?? "") || !/^0x[\da-f]{40}$/i.test(sender ?? "") || !["wallet", "circle"].includes(kind)) {
  console.error("Usage: node examples/verify-proof.mjs <app-url> <transaction-hash> <sender-address> [wallet|circle]");
  process.exitCode = 1;
} else {
  try {
    const response = await fetch(new URL("/api/payment-proof", baseUrl), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash, sender, kind }), signal: AbortSignal.timeout(30_000),
    });
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = response.ok && result.status === "confirmed" ? 0 : result.status === "pending" ? 2 : 1;
  } catch (error) {
    console.error(`Verification unavailable: ${error.message}. Do not resend the transaction.`);
    process.exitCode = 1;
  }
}
