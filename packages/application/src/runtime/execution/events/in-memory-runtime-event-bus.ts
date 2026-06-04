// packages/application/src/runtime/execution/events/in-memory-runtime-event-bus.ts
import type { RuntimeEventBus } from './runtime-event-bus.js';
import type { RuntimeEventListener } from './runtime-event-listener.js';
import type { RuntimeEvent } from './runtime-event.js';

export class InMemoryRuntimeEventBus implements RuntimeEventBus {
  readonly #listeners = new Set<RuntimeEventListener>();

  emit(event: RuntimeEvent): Promise<void> {
    for (const listener of this.#listeners) {
      void listener.onEvent(event);
    }

    return Promise.resolve();
  }

  subscribe(listener: RuntimeEventListener): void {
    this.#listeners.add(listener);
  }

  unsubscribe(listener: RuntimeEventListener): void {
    this.#listeners.delete(listener);
  }
}
