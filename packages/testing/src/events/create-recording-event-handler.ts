// packages/testing/src/events/recording-generation-event-handler.ts

import type { GenerationEvent, GenerationEventHandler } from '@arch/contracts';

export class RecordingGenerationEventHandler implements GenerationEventHandler {
  readonly events: GenerationEvent[] = [];

  async handle(event: GenerationEvent): Promise<void> {
    this.events.push(event);
  }

  clear(): void {
    this.events.length = 0;
  }
}
