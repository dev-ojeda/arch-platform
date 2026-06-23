// packages/testing/src/events/recording-generation-event-handler.ts

import type { GenerationEvent, GenerationEventHandler } from '@arch/contracts';

export class RecordingGenerationEventHandler implements GenerationEventHandler {
  readonly events: GenerationEvent[] = [];

  handle(event: GenerationEvent): Promise<void> {
    this.events.push(event);
    return Promise.resolve();
  }

  clear(): void {
    this.events.length = 0;
  }
}
