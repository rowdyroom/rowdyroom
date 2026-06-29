import type { ModelProvider, ModelRequest, ModelResponse } from "./provider-client.js";
import type { ModelProviderId } from "./types.js";

export interface OpenAiCompatibleTransportConfig {
  id: ModelProviderId;
  name: string;
  defaultModel: string;
  baseUrl: string;
  apiKeyEnv: string;
  extraHeaders?: Record<string, string>;
}

interface ChatCompletionChoice {
  message?: {
    content?: string | Array<{ type?: string; text?: string }>;
  };
}

interface ChatCompletionResponse {
  choices?: ChatCompletionChoice[];
}

function extractText(response: ChatCompletionResponse): string {
  const content = response.choices?.[0]?.message?.content;

  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => part.text ?? "")
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

export class OpenAiCompatibleTransport implements ModelProvider {
  readonly id: ModelProviderId;
  readonly name: string;
  readonly defaultModel: string;

  constructor(private readonly config: OpenAiCompatibleTransportConfig) {
    this.id = config.id;
    this.name = config.name;
    this.defaultModel = config.defaultModel;
  }

  isConfigured(): boolean {
    return Boolean(process.env[this.config.apiKeyEnv]);
  }

  async complete(request: ModelRequest): Promise<ModelResponse> {
    const apiKey = process.env[this.config.apiKeyEnv];

    if (!apiKey) {
      throw new Error(`${this.name} is not configured. Missing ${this.config.apiKeyEnv}.`);
    }

    const endpoint = `${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        ...this.config.extraHeaders,
      },
      body: JSON.stringify({
        model: request.model ?? this.defaultModel,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`${this.name} request failed with ${response.status}: ${body}`);
    }

    const json = (await response.json()) as ChatCompletionResponse;

    return {
      provider: this.id,
      model: request.model ?? this.defaultModel,
      text: extractText(json),
      raw: json,
    };
  }
}
