import type { Connector } from "../../../packages/connector-sdk/src/index.js";

export const openAiConnector: Connector = {
  manifest: {
    id: "openai",
    name: "OpenAI",
    category: "ai-provider",
    description: "OpenAI model provider connector.",
    authType: "api-key",
    permissions: [
      {
        id: "openai.chat",
        label: "Use OpenAI models",
        level: "sensitive",
        description: "Allows approved agents to call configured OpenAI models.",
      },
    ],
  },
  actions: [],
  async health() {
    return {
      state: process.env.OPENAI_API_KEY ? "online" : "not-configured",
      message: process.env.OPENAI_API_KEY ? "OpenAI key found in environment." : "OPENAI_API_KEY is not configured.",
      checkedAt: new Date().toISOString(),
    };
  },
};
