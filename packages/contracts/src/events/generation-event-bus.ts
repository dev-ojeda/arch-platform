// packages/contracts/src/events/generation-event-bus.ts

import type { GenerationEvent } from "./generation-event.js";

import type { GenerationEventHandler } from "./generation-event-handler.js";

export interface GenerationEventBus {
  publish(event: GenerationEvent): Promise<void>;

  subscribe(handler: GenerationEventHandler): void;
}
