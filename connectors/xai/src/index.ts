import type { Connector } from "../../../packages/connector-sdk/src/index.js";

export const xaiConnector: Connector = {
  manifest: {
    id: "xai",
    name: "xAI Grok",
    category: "ai-provider",
    description: "xAI Grok model provider connector.",
    authType: "api-key",
    permissions: [
      {
        id: "xai.chat",
        label: "Use Grok models",
        level: "sensitive",
        description: "Allows approved agents to call configured Grok models.",
      },
    ],
  },
  actions: [],
  async health() {
    return {
      state: process.env.XAI_API_KEY ? "online" : "not-configured",
      message: process.env.XAI_API_KEY ? "xAI key found in environment." : "XAI_API_KEY is not configured.",
      checkedAt: new Date().toISOString(),
    };
  },
};
