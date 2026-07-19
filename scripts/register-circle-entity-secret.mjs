import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";

const envPath = ".env.local";
const apiKey = process.env.CIRCLE_API_KEY;

if (!apiKey) {
  throw new Error("CIRCLE_API_KEY is missing from .env.local.");
}

const existingEnv = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";

if (/^CIRCLE_ENTITY_SECRET=.+$/m.test(existingEnv)) {
  throw new Error("CIRCLE_ENTITY_SECRET already exists. Refusing to overwrite it.");
}

const entitySecret = randomBytes(32).toString("hex");
const recoveryPath = "./recovery";

mkdirSync(recoveryPath, { recursive: true });

try {
  await registerEntitySecretCiphertext({
    apiKey,
    entitySecret,
    recoveryFileDownloadPath: recoveryPath,
  });

  appendFileSync(envPath, `\nCIRCLE_ENTITY_SECRET=${entitySecret}\n`, { mode: 0o600 });

  console.log("Circle entity secret registered successfully.");
  console.log("The secret was saved to .env.local and was not printed.");
  console.log("Move the recovery file from ./recovery to secure private storage.");
} catch (error) {
  const response = error && typeof error === "object" && "response" in error
    ? error.response
    : undefined;
  const status = response && typeof response === "object" && "status" in response
    ? response.status
    : undefined;
  const data = response && typeof response === "object" && "data" in response
    ? response.data
    : undefined;
  const code = data && typeof data === "object" && "code" in data ? data.code : undefined;
  const message = data && typeof data === "object" && "message" in data
    ? data.message
    : error instanceof Error
      ? error.message
      : "Unknown Circle error";

  console.error(`Circle registration failed${status ? ` (HTTP ${status})` : ""}${code ? ` [${code}]` : ""}: ${message}`);
  process.exitCode = 1;
}
