import type { ConnectorActionContext, ConnectorActionResult } from "./types.js";
import { ConnectorRegistry } from "./connector-registry.js";
import { EventBus } from "./event-bus.js";

export class ActionBus {
  constructor(
    private readonly registry: ConnectorRegistry,
    private readonly events: EventBus
  ) {}

  async run<Output = unknown>(connectorId: string, actionId: string, input: unknown, context: Omit<ConnectorActionContext, "connectorId">): Promise<ConnectorActionResult<Output>> {
    const connector = this.registry.require(connectorId);
    const action = connector.actions.find((candidate) => candidate.id === actionId);

    if (!action) {
      return { ok: false, error: `Action not found: ${connectorId}.${actionId}` };
    }

    const result = await action.run(input, { ...context, connectorId });

    for (const event of result.events ?? []) {
      await this.events.publish(event);
    }

    return result as ConnectorActionResult<Output>;
  }

  listActions() {
    return this.registry.list().flatMap((connector) =>
      connector.actions.map((action) => ({
        connectorId: connector.manifest.id,
        connectorName: connector.manifest.name,
        actionId: action.id,
        label: action.label,
        description: action.description,
        sensitive: Boolean(action.sensitive),
        permissionIds: action.permissionIds,
      }))
    );
  }
}
