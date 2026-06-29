import { ActionBus } from "./action-bus.js";
import { ConnectorRegistry } from "./connector-registry.js";
import { EventBus } from "./event-bus.js";
import { HealthMonitor } from "./health-monitor.js";
import type { Connector } from "./types.js";

export class ConnectorManager {
  readonly registry = new ConnectorRegistry();
  readonly events = new EventBus();
  readonly actions = new ActionBus(this.registry, this.events);
  readonly health = new HealthMonitor(this.registry);

  register(connector: Connector): void {
    this.registry.register(connector);
  }

  listConnectors() {
    return this.registry.list().map((connector) => connector.manifest);
  }

  listActions() {
    return this.actions.listActions();
  }
}
