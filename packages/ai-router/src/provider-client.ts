import type { ModelProviderId } from "./types.js";

export type ModelMessageRole = "system" | "user" | "assistant" | "tool";

export interface ModelMessage {
  role: ModelMessageRole;
  content: string;
}

export interface ModelRequest {
  messages: ModelMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, unknown>;
}

export interface ModelResponse {
  provider: ModelProviderId;
  model: string;
  text: string;
  raw?: unknown;
}

export interface ModelProvider {
  id: ModelProviderId;
  name: string;
  defaultModel: string;
  isConfigured(): boolean;
  complete(request: ModelRequest): Promise<ModelResponse>;
}

export interface ProviderConfig {
  id: ModelProviderId;
  name: string;
  defaultModel: string;
  baseUrl?: string;
  apiKeyEnv?: string;
}

export class ConfiguredProvider implements ModelProvider {
  readonly id: ModelProviderId;
  readonly name: string;
  readonly defaultModel: string;

  constructor(private readonly config: ProviderConfig) {
    this.id = config.id;
    this.name = config.name;
    this.defaultModel = config.defaultModel;
  }

  isConfigured(): boolean {
    if (!this.config.apiKeyEnv) return true;
    return Boolean(process.env[this.config.apiKeyEnv]);
  }

  async complete(request: ModelRequest): Promise<ModelResponse> {
    if (!this.isConfigured()) {
      throw new Error(`${this.name} is not configured. Missing ${this.config.apiKeyEnv}.`);
    }

    return {
      provider: this.id,
      model: request.model ?? this.defaultModel,
      text: "Provider transport is not wired yet. This is the routing boundary.",
      raw: {
        baseUrl: this.config.baseUrl,
        messageCount: request.messages.length,
      },
    };
  }
}
