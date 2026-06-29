import type { ConnectorHealth } from "./types.js";
import { ConnectorRegistry } from "./connector-registry.js";

export class HealthMonitor {
  constructor(private readonly registry: ConnectorRegistry) {}

  async checkAll(): Promise<Record<string, ConnectorHealth>> {
    const entries = await Promise.all(
      this.registry.list().map(async (connector) => {
        try {
          return [connector.manifest.id, await connector.health()] as const;
        } catch (error) {
          return [
            connector.manifest.id,
            {
              state: "offline",
              message: error instanceof Error ? error.message : String(error),
              checkedAt: new Date().toISOString(),
            },
          ] as const;
        }
      })
    );

    return Object.fromEntries(entries);
  }
}
