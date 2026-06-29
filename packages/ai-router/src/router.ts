import type { ModelRoute, RouteRequest, RouterPolicy } from "./types.js";

export class AiRouter {
  constructor(private readonly policy: RouterPolicy) {}

  route(request: RouteRequest): ModelRoute {
    if (request.privacy === "sensitive" && this.policy.routes.privateLocal) {
      return {
        ...this.policy.routes.privateLocal,
        reason: "Sensitive task routed to local model when available.",
      };
    }

    if (request.needsVision && this.policy.routes.vision) {
      return {
        ...this.policy.routes.vision,
        reason: "Vision task routed to vision-capable model.",
      };
    }

    return this.policy.routes[request.task] ?? this.policy.defaultRoute;
  }
}

export const defaultRouterPolicy: RouterPolicy = {
  defaultRoute: {
    provider: "openai",
    model: "gpt-4.1-mini",
    reason: "Default general-purpose route.",
  },
  routes: {
    planning: { provider: "openai", model: "gpt-4.1-mini", reason: "General planning route." },
    coding: { provider: "anthropic", model: "claude-opus-4.1", reason: "Coding and refactoring route." },
    review: { provider: "anthropic", model: "claude-opus-4.1", reason: "Code review route." },
    research: { provider: "gemini", model: "gemini-2.5-pro", reason: "Research and large-context route." },
    streamHost: { provider: "xai", model: "grok-4", reason: "Live stream personality and chat route." },
    vision: { provider: "gemini", model: "gemini-2.5-pro", reason: "Vision-capable route." },
    voice: { provider: "xai", model: "grok-4", reason: "Voice and live response route." },
    privateLocal: { provider: "ollama", model: "llama3.1", reason: "Local/private fallback route." },
  },
};
