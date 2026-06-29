export type ModelProviderId = "openai" | "anthropic" | "xai" | "gemini" | "ollama" | "custom";

export type TaskKind = "planning" | "coding" | "review" | "research" | "streamHost" | "vision" | "voice" | "privateLocal";

export interface ModelRoute {
  provider: ModelProviderId;
  model: string;
  reason: string;
}

export interface RouterPolicy {
  defaultRoute: ModelRoute;
  routes: Partial<Record<TaskKind, ModelRoute>>;
}

export interface RouteRequest {
  task: TaskKind;
  privacy?: "normal" | "sensitive";
  needsVision?: boolean;
  needsLowLatency?: boolean;
}
