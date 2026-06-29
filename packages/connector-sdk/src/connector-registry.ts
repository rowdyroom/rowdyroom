import type { Connector } from "./types.js";

export class ConnectorRegistry {
  private readonly connectors = new Map<string, Connector>();

  register(connector: Connector): void {
    const id = connector.manifest.id;

    if (this.connectors.has(id)) {
      throw new Error(`Connector already registered: ${id}`);
    }

    this.connectors.set(id, connector);
  }

  get(id: string): Connector | undefined {
    return this.connectors.get(id);
  }

  require(id: string): Connector {
    const connector = this.get(id);

    if (!connector) {
      throw new Error(`Connector not found: ${id}`);
    }

    return connector;
  }

  list(): Connector[] {
    return [...this.connectors.values()].sort((a, b) => a.manifest.name.localeCompare(b.manifest.name));
  }

  listByCategory(category: string): Connector[] {
    return this.list().filter((connector) => connector.manifest.category === category);
  }
}
