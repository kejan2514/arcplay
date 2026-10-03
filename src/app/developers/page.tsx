import type { Metadata } from "next";
import CircleWalletInfrastructure from "@/components/circle-wallet-infrastructure";
import DeveloperStack from "@/components/developer-stack";
import ERC8004AgentIdentity from "@/components/erc8004-agent-identity";
import LiveArcNetwork from "@/components/live-arc-network";
export const metadata: Metadata = { title: "Infrastructure | ArcPlay" };
export default function DevelopersPage() {
  return <><div className="mx-auto mb-8 max-w-7xl"><h1 className="text-3xl font-bold">ArcPay infrastructure</h1><p className="mt-3 text-sm leading-7 text-slate-400">Network telemetry, agent identity and Circle wallet tools behind the ArcPlay demo.</p></div><LiveArcNetwork /><ERC8004AgentIdentity /><CircleWalletInfrastructure /><DeveloperStack /></>;
}
