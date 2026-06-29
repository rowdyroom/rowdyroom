import type { ProviderConfig } from "./provider-client.js";
import { ProviderRegistry } from "./provider-registry.js";
import { OpenAiCompatibleTransport } from "./openai-compatible-transport.js";
import { AnthropicTransport } from "./anthropic-transport.js";

export const defaultProviderConfigs: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI ChatGPT",
    defaultModel: "gpt-4.1-mini",
    baseUrl: "https://api.openai.com/v1",
    apiKeyEnv: "OPENAI_API_KEY",
  },
  {
    id: "xai",
    name: "xAI Grok",
    defaultModel: "grok-4",
    baseUrl: "https://api.x.ai/v1",
    apiKeyEnv: "XAI_API_KEY",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    defaultModel: "gemini-2.5-pro",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKeyEnv: "GEMINI_API_KEY",
  },
];

export function buildDefaultProviderRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();

  for (const config of defaultProviderConfigs) {
    if (!config.baseUrl || !config.apiKeyEnv) continue;
    registry.register(
      new OpenAiCompatibleTransport({
        id: config.id,
        name: config.name,
        defaultModel: config.defaultModel,
        baseUrl: config.baseUrl,
        apiKeyEnv: config.apiKeyEnv,
      })
    );
  }

  registry.register(new AnthropicTransport());

  return registry;
}
