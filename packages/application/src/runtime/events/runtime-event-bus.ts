// packages/application/src/runtime/events/runtime-event-bus.ts
import type { RuntimeEventListener } from './runtime-event-listener.js';
import type { RuntimeEvent } from './runtime-event.js';

export interface RuntimeEventBus {
  emit(event: RuntimeEvent): Promise<void>;

  subscribe(listener: RuntimeEventListener): void;

  unsubscribe(listener: RuntimeEventListener): void;
}
