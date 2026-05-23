// packages/contracts/src/events/generation-event-handler.ts

import type { GenerationEvent } from './generation-event.js';

export interface GenerationEventHandler {
  handle(event: GenerationEvent): Promise<void>;
}
