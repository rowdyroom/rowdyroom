export type ConnectorCategory =
  | "ai-provider"
  | "streaming"
  | "content"
  | "development"
  | "business"
  | "storage"
  | "smart-home"
  | "system";

export type ConnectorHealthState =
  | "online"
  | "offline"
  | "needs-auth"
  | "degraded"
  | "not-configured";

export type ConnectorPermissionLevel = "read" | "write" | "admin" | "sensitive";

export interface ConnectorPermission {
  id: string;
  label: string;
  level: ConnectorPermissionLevel;
  description: string;
}

export interface ConnectorActionDefinition<Input = unknown, Output = unknown> {
  id: string;
  label: string;
  description: string;
  permissionIds: string[];
  sensitive?: boolean;
  run(input: Input, context: ConnectorActionContext): Promise<ConnectorActionResult<Output>>;
}

export interface ConnectorActionContext {
  connectorId: string;
  requestId: string;
  actor: "executive-ai" | "agent" | "user" | "workflow";
  dryRun?: boolean;
}

export interface ConnectorActionResult<Output = unknown> {
  ok: boolean;
  data?: Output;
  error?: string;
  events?: ConnectorEvent[];
}

export interface ConnectorEvent {
  id: string;
  type: string;
  source: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface ConnectorHealth {
  state: ConnectorHealthState;
  message?: string;
  checkedAt: string;
}

export interface ConnectorManifest {
  id: string;
  name: string;
  category: ConnectorCategory;
  description: string;
  authType: "none" | "api-key" | "oauth" | "local" | "manual";
  permissions: ConnectorPermission[];
}

export interface Connector {
  manifest: ConnectorManifest;
  actions: ConnectorActionDefinition[];
  health(): Promise<ConnectorHealth>;
}
