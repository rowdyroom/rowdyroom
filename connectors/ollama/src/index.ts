import type { Connector } from "../../../packages/connector-sdk/src/index.js";

export const ollamaConnector: Connector = {
  manifest: {
    id: "ollama",
    name: "Ollama Local",
    category: "ai-provider",
    description: "Local model provider connector for private/offline tasks.",
    authType: "local",
    permissions: [
      {
        id: "ollama.chat",
        label: "Use local models",
        level: "read",
        description: "Allows approved agents to call local Ollama models.",
      },
    ],
  },
  actions: [],
  async health() {
    return {
      state: "not-configured",
      message: "Ollama shell created. Runtime health check will be added next.",
      checkedAt: new Date().toISOString(),
    };
  },
};
