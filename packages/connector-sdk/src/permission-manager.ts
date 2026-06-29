import type { ConnectorActionDefinition, ConnectorPermission } from "./types.js";

export interface PermissionDecision {
  allowed: boolean;
  reason: string;
  approvalRequired: boolean;
}

export class PermissionManager {
  decide(action: ConnectorActionDefinition, permissions: ConnectorPermission[]): PermissionDecision {
    const required = permissions.filter((permission) => action.permissionIds.includes(permission.id));
    const sensitive = action.sensitive || required.some((permission) => permission.level === "sensitive" || permission.level === "admin");

    if (sensitive) {
      return {
        allowed: false,
        reason: "Sensitive action requires explicit approval.",
        approvalRequired: true,
      };
    }

    return {
      allowed: true,
      reason: "Action allowed by current connector policy.",
      approvalRequired: false,
    };
  }
}
