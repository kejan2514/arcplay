import type { Metadata } from "next";
import AIAgentDashboard from "@/components/ai-agent-dashboard";
import WorkflowBuilder from "@/components/workflow-builder";

export const metadata: Metadata = { title: "Automations | ArcPlay" };
export default async function AutomationsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const game = typeof params.game === "string" ? params.game : undefined;
  const product = typeof params.product === "string" ? params.product : undefined;
  const cadence = params.cadence === "monthly" ? "monthly" : "weekly";
  const day = Number(params.day);
  const validDay = Number.isInteger(day) && day >= (cadence === "weekly" ? 0 : 1) && day <= (cadence === "weekly" ? 6 : 28) ? day : cadence === "weekly" ? 5 : 1;
  return <><AIAgentDashboard /><WorkflowBuilder key={`${game}-${product}-${cadence}-${validDay}`} initialGameId={game} initialProductId={product} initialCadence={cadence} initialDay={validDay} /></>;
}
