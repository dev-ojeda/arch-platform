// packages/contracts/src/events/generation-event-bus.ts

import type { GenerationEventHandler } from './generation-event-handler.js';
import type { GenerationEvent } from './generation-event.js';

export interface GenerationEventBus {
  publish(event: GenerationEvent): Promise<void>;

  subscribe(handler: GenerationEventHandler): void;
}
