import AIAgentDashboard from "@/components/ai-agent-dashboard";
import DeveloperStack from "@/components/developer-stack";
import Footer from "@/components/footer";
import GameGrid from "@/components/game-grid";
import Hero from "@/components/hero";
import LiveArcNetwork from "@/components/live-arc-network";
import WorkflowBuilder from "@/components/workflow-builder";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.2),_transparent_30%),#020617] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <Hero />
      <AIAgentDashboard />
      <WorkflowBuilder />
      <LiveArcNetwork />
      <DeveloperStack />
      <GameGrid />
      <Footer />
    </main>
  );
}
