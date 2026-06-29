import type { Connector } from "../../../packages/connector-sdk/src/index.js";

export const anthropicConnector: Connector = {
  manifest: {
    id: "anthropic",
    name: "Anthropic Claude",
    category: "ai-provider",
    description: "Anthropic Claude model provider connector.",
    authType: "api-key",
    permissions: [
      {
        id: "anthropic.chat",
        label: "Use Claude models",
        level: "sensitive",
        description: "Allows approved agents to call configured Claude models.",
      },
    ],
  },
  actions: [],
  async health() {
    return {
      state: process.env.ANTHROPIC_API_KEY ? "online" : "not-configured",
      message: process.env.ANTHROPIC_API_KEY ? "Anthropic key found in environment." : "ANTHROPIC_API_KEY is not configured.",
      checkedAt: new Date().toISOString(),
    };
  },
};
