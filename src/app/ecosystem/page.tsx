import type { Metadata } from "next";
import EcosystemIntegrations from "@/components/ecosystem-integrations";
export const metadata: Metadata = { title: "Ecosystem | ArcPlay" };
export default function EcosystemPage() { return <><h1 className="mx-auto mb-6 max-w-7xl text-3xl font-bold">Explore the ecosystem</h1><EcosystemIntegrations /></>; }
