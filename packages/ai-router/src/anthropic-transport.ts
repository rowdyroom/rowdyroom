import type { ModelProvider, ModelRequest, ModelResponse } from "./provider-client.js";

interface AnthropicResponse {
  content?: Array<{ type?: string; text?: string }>;
}

function toAnthropicMessages(request: ModelRequest) {
  const systemMessages = request.messages.filter((message) => message.role === "system");
  const conversationMessages = request.messages.filter((message) => message.role !== "system");

  return {
    system: systemMessages.map((message) => message.content).join("\n\n") || undefined,
    messages: conversationMessages.map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    })),
  };
}

export class AnthropicTransport implements ModelProvider {
  readonly id = "anthropic" as const;
  readonly name = "Anthropic Claude";
  readonly defaultModel = "claude-opus-4.1";

  isConfigured(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  }

  async complete(request: ModelRequest): Promise<ModelResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error("Anthropic Claude is not configured. Missing ANTHROPIC_API_KEY.");
    }

    const converted = toAnthropicMessages(request);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: request.model ?? this.defaultModel,
        max_tokens: request.maxTokens ?? 1200,
        temperature: request.temperature,
        system: converted.system,
        messages: converted.messages,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Anthropic request failed with ${response.status}: ${body}`);
    }

    const json = (await response.json()) as AnthropicResponse;
    const text = json.content?.map((part) => part.text ?? "").filter(Boolean).join("\n") ?? "";

    return {
      provider: this.id,
      model: request.model ?? this.defaultModel,
      text,
      raw: json,
    };
  }
}
