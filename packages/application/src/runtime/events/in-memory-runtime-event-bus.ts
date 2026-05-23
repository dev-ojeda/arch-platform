// packages/application/src/runtime/events/in-memory-runtime-event-bus.ts
import type { RuntimeEventBus } from './runtime-event-bus.js';
import type { RuntimeEventListener } from './runtime-event-listener.js';
import type { RuntimeEvent } from './runtime-event.js';

export class InMemoryRuntimeEventBus implements RuntimeEventBus {
  private readonly listeners = new Set<RuntimeEventListener>();

  async emit(event: RuntimeEvent): Promise<void> {
    await Promise.all([...this.listeners].map((listener) => listener.onEvent(event)));
  }

  subscribe(listener: RuntimeEventListener): void {
    this.listeners.add(listener);
  }

  unsubscribe(listener: RuntimeEventListener): void {
    this.listeners.delete(listener);
  }
}
