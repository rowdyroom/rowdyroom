export type AgentId = "executive" | "architect" | "developer" | "reviewer" | "qa" | "streamHost" | "memory" | "voice";

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  requestedBy: "user" | "workflow" | "agent";
  priority: "low" | "normal" | "high" | "urgent";
  metadata?: Record<string, unknown>;
}

export interface AgentResult {
  ok: boolean;
  summary: string;
  nextActions: string[];
  data?: Record<string, unknown>;
  error?: string;
}

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  canHandle(task: AgentTask): boolean;
  run(task: AgentTask): Promise<AgentResult>;
}
