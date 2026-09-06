export const ERC8004_REGISTRATION_TYPE =
  "https://eips.ethereum.org/EIPS/eip-8004#registration-v1";

export type AgentService = {
  name: string;
  endpoint: string;
  version?: string;
};

export type AgentRegistration = {
  type: string;
  name: string;
  description: string;
  image: string;
  services: AgentService[];
  x402Support: boolean;
  active: boolean;
  registrations: Array<{
    agentId: number;
    agentRegistry: string;
  }>;
  supportedTrust: string[];
};

export function buildArcPayAgentRegistration(baseUrl: string): AgentRegistration {
  const registryAddress = process.env.ERC8004_IDENTITY_REGISTRY_ADDRESS?.trim();
  const agentId = Number(process.env.ERC8004_AGENT_ID ?? "0");
  const chainId = Number(process.env.NEXT_PUBLIC_ARC_CHAIN_ID ?? "5042002");

  const registrations =
    registryAddress && Number.isSafeInteger(agentId) && agentId > 0
      ? [
          {
            agentId,
            agentRegistry: `eip155:${chainId}:${registryAddress}`,
          },
        ]
      : [];

  return {
    type: ERC8004_REGISTRATION_TYPE,
    name: "ArcPay Agent",
    description:
      "Approval-first agentic commerce demo for Arc Testnet with Circle USDC workflows and live Arc telemetry.",
    image: `${baseUrl}/globe.svg`,
    services: [
      { name: "web", endpoint: baseUrl },
      { name: "health", endpoint: `${baseUrl}/api/health`, version: "v1" },
      { name: "Arc RPC telemetry", endpoint: `${baseUrl}/api/arc-network`, version: "v1" },
    ],
    x402Support: false,
    active: true,
    registrations,
    supportedTrust: ["reputation", "validation"],
  };
}
