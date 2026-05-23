// packages/application/src/runtime/events/runtime-event-listener.ts
import type { RuntimeEvent } from './runtime-event.js';

export interface RuntimeEventListener {
  onEvent(event: RuntimeEvent): void | Promise<void>;
}
