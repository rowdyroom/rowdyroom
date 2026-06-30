import { ApiReliabilityPanel } from "../components/ApiReliabilityPanel";
import { LocalBridgePanel } from "../components/LocalBridgePanel";
import { MissionActions } from "../components/MissionActions";
import { MissionChat } from "../components/MissionChat";
import { SongfinderGuardFinal } from "../components/SongfinderGuardFinal";
import { TikTokControlPlan } from "../components/TikTokControlPlan";

const providers = [
  { name: "ChatGPT", status: "Ready for key", route: "Planning + tools" },
  { name: "Claude", status: "Ready for key", route: "Code + review" },
  { name: "Grok", status: "Ready for key", route: "Stream host" },
  { name: "Gemini", status: "Ready for key", route: "Research + vision" },
];

const agents = [
  "Executive AI",
  "Mission Control",
  "Connector SDK",
  "AI Router",
  "Stream Host AI",
  "Supabase Memory",
];

export default function HomePage() {
  return (
    <main className="dashboard">
      <section className="heroPanel">
        <div className="heroCopy">
          <p className="eyebrow">Rowdy Room Enterprise Engine</p>
          <h1>AI Mission Control</h1>
          <p className="lead">
            Your local command center for ChatGPT, Grok, Claude, Gemini, stream tools, memory, and automation.
          </p>
          <div className="heroActions">
            <a href="#local-bridge">PC Helper</a>
            <a href="#songfinder-guard">Songfinder Guard</a>
            <a href="#api-reliability">API Health</a>
            <a href="#tiktok-control-plan">TikTok Control</a>
            <a href="#action-center">Action Center</a>
            <a href="#chat-console">Open Chat Console</a>
          </div>
        </div>
        <div className="pulseOrb" aria-hidden="true">
          <span>RR</span>
        </div>
      </section>

      <section className="statusBar">
        <div>
          <span className="label">Local Server</span>
          <strong>Online</strong>
        </div>
        <div>
          <span className="label">Dashboard</span>
          <strong>Loaded</strong>
        </div>
        <div>
          <span className="label">Mode</span>
          <strong>Development</strong>
        </div>
      </section>

      <section className="contentGrid">
        <LocalBridgePanel />
        <SongfinderGuardFinal />
        <ApiReliabilityPanel />
        <TikTokControlPlan />
        <MissionActions />

        <article className="panel large" id="providers">
          <div className="panelHeader">
            <p className="eyebrow">AI Providers</p>
            <h2>Router Targets</h2>
          </div>
          <div className="providerGrid">
            {providers.map((provider) => (
              <div className="providerCard" key={provider.name}>
                <strong>{provider.name}</strong>
                <span>{provider.status}</span>
                <p>{provider.route}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel" id="agents">
          <div className="panelHeader">
            <p className="eyebrow">Core Agents</p>
            <h2>System Stack</h2>
          </div>
          <div className="agentList">
            {agents.map((agent) => (
              <div className="agentRow" key={agent}>
                <span />
                {agent}
              </div>
            ))}
          </div>
        </article>

        <MissionChat />
      </section>
    </main>
  );
}
