import { ConfiguredProvider, type ProviderConfig } from "./provider-client.js";
import { ProviderRegistry } from "./provider-registry.js";

export const defaultProviderConfigs: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI ChatGPT",
    defaultModel: "gpt-4.1-mini",
    apiKeyEnv: "OPENAI_API_KEY",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    defaultModel: "claude-opus-4.1",
    apiKeyEnv: "ANTHROPIC_API_KEY",
  },
  {
    id: "xai",
    name: "xAI Grok",
    defaultModel: "grok-4",
    apiKeyEnv: "XAI_API_KEY",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    defaultModel: "gemini-2.5-pro",
    apiKeyEnv: "GEMINI_API_KEY",
  },
  {
    id: "ollama",
    name: "Ollama Local",
    defaultModel: "llama3.1",
  },
];

export function buildDefaultProviderRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();

  for (const config of defaultProviderConfigs) {
    registry.register(new ConfiguredProvider(config));
  }

  return registry;
}
