import type { Connector } from "../../../packages/connector-sdk/src/index.js";

export const geminiConnector: Connector = {
  manifest: {
    id: "gemini",
    name: "Google Gemini",
    category: "ai-provider",
    description: "Google Gemini model provider connector.",
    authType: "api-key",
    permissions: [
      {
        id: "gemini.chat",
        label: "Use Gemini models",
        level: "sensitive",
        description: "Allows approved agents to call configured Gemini models.",
      },
    ],
  },
  actions: [],
  async health() {
    const configured = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    return {
      state: configured ? "online" : "not-configured",
      message: configured ? "Gemini key found in environment." : "GEMINI_API_KEY is not configured.",
      checkedAt: new Date().toISOString(),
    };
  },
};
