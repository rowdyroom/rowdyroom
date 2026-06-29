const providers = [
  { name: "ChatGPT / OpenAI", env: "OPENAI_API_KEY", use: "planning, tools, general assistant" },
  { name: "Claude", env: "ANTHROPIC_API_KEY", use: "coding, review, refactoring" },
  { name: "Grok", env: "XAI_API_KEY", use: "stream host, live room energy" },
  { name: "Gemini", env: "GEMINI_API_KEY", use: "research, vision, large context" },
  { name: "Ollama", env: "OLLAMA_BASE_URL", use: "private local fallback" },
];

const modules = [
  "Executive AI",
  "Connector SDK",
  "AI Router",
  "Stream Host AI",
  "Voice AI",
  "Supabase Memory",
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Rowdy Room Enterprise Engine</p>
        <h1>Mission Control</h1>
        <p className="lead">
          Local dashboard for the Rowdy Room AI operating system. This page confirms the dev server is alive at localhost.
        </p>
      </section>

      <section className="grid">
        <div className="card wide">
          <h2>System Status</h2>
          <p className="status">Online</p>
          <p>Next.js is running. The provider router and connector framework are being wired underneath this dashboard.</p>
        </div>

        <div className="card">
          <h2>Modules</h2>
          <ul>
            {modules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
        </div>

        <div className="card wide">
          <h2>Provider Setup</h2>
          <div className="providerList">
            {providers.map((provider) => (
              <div className="provider" key={provider.name}>
                <strong>{provider.name}</strong>
                <span>{provider.env}</span>
                <p>{provider.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
