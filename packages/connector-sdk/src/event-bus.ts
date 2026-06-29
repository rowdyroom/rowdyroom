import type { ConnectorEvent } from "./types.js";

export type EventHandler = (event: ConnectorEvent) => void | Promise<void>;

export class EventBus {
  private readonly handlers = new Map<string, Set<EventHandler>>();
  private readonly history: ConnectorEvent[] = [];

  subscribe(type: string, handler: EventHandler): () => void {
    const handlers = this.handlers.get(type) ?? new Set<EventHandler>();
    handlers.add(handler);
    this.handlers.set(type, handlers);

    return () => {
      handlers.delete(handler);
    };
  }

  async publish(event: ConnectorEvent): Promise<void> {
    this.history.push(event);

    const directHandlers = this.handlers.get(event.type) ?? new Set<EventHandler>();
    const wildcardHandlers = this.handlers.get("*") ?? new Set<EventHandler>();

    for (const handler of [...directHandlers, ...wildcardHandlers]) {
      await handler(event);
    }
  }

  recent(limit = 50): ConnectorEvent[] {
    return this.history.slice(-limit);
  }
}
