import test from "node:test";
import assert from "node:assert/strict";
import {
  ARCPAY_ERC8004_AGENT_ID,
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

test("publishes the confirmed Arc Testnet ERC-8004 identity", () => {
  const oldRegistry = process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS;
  const oldAgentId = process.env.ERC8004_AGENT_ID;

  delete process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS;
  delete process.env.ERC8004_AGENT_ID;

  try {
    const registration = buildArcPayAgentRegistration("https://arcpay.example");
    assert.deepEqual(registration.registrations, [
      {
        agentId: ARCPAY_ERC8004_AGENT_ID,
        agentRegistry:
          "eip155:5042002:0x8004A818BFB912233c491871b3d84c89A494BD9e",
      },
    ]);
  } finally {
    if (oldRegistry === undefined) delete process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS;
    else process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS = oldRegistry;
    if (oldAgentId === undefined) delete process.env.ERC8004_AGENT_ID;
    else process.env.ERC8004_AGENT_ID = oldAgentId;
  }
});

test("allows deployment configuration to override the agent identity", () => {
  const oldRegistry = process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS;
  const oldAgentId = process.env.ERC8004_AGENT_ID;

  process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS =
    "0x1111111111111111111111111111111111111111";
  process.env.ERC8004_AGENT_ID = "123";

  try {
    const registration = buildArcPayAgentRegistration("https://arcpay.example");
    assert.deepEqual(registration.registrations, [
      {
        agentId: 123,
        agentRegistry:
          "eip155:5042002:0x1111111111111111111111111111111111111111",
      },
    ]);
  } finally {
    if (oldRegistry === undefined) delete process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS;
    else process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS = oldRegistry;
    if (oldAgentId === undefined) delete process.env.ERC8004_AGENT_ID;
    else process.env.ERC8004_AGENT_ID = oldAgentId;
  }
});
