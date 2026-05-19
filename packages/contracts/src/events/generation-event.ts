// packages/contracts/src/events/generation-event.ts

import type { GenerationEventName } from "./generation-event-name.js";

export interface GenerationEvent {
  readonly name: GenerationEventName;

  readonly timestamp: number;

  readonly payload?: Record<string, unknown>;
}
