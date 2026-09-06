import test from "node:test";
import assert from "node:assert/strict";
import {
  ERC8004_REGISTRATION_TYPE,
  buildArcPayAgentRegistration,
} from "../.test-dist/erc8004.js";

test("builds an ERC-8004 registration-v1 document", () => {
  const registration = buildArcPayAgentRegistration("https://arcpay.example");

  assert.equal(registration.type, ERC8004_REGISTRATION_TYPE);
  assert.equal(registration.name, "ArcPay Agent");
  assert.equal(registration.active, true);
  assert.equal(registration.x402Support, false);
  assert.deepEqual(registration.supportedTrust, ["reputation", "validation"]);
  assert.equal(registration.services[0].endpoint, "https://arcpay.example");
});

test("does not fabricate an onchain identity when registry config is absent", () => {
  const oldRegistry = process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS;
  const oldAgentId = process.env.ERC8004_AGENT_ID;

  delete process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS;
  delete process.env.ERC8004_AGENT_ID;

  try {
    const registration = buildArcPayAgentRegistration("https://arcpay.example");
    assert.deepEqual(registration.registrations, []);
  } finally {
    if (oldRegistry === undefined) delete process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS;
    else process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS = oldRegistry;
    if (oldAgentId === undefined) delete process.env.ERC8004_AGENT_ID;
    else process.env.ERC8004_AGENT_ID = oldAgentId;
  }
});
