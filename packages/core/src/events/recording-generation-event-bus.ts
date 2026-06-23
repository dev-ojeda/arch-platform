// packages/core/src/events/recording-generation-event-bus.ts

import type { GenerationEvent, GenerationEventBus, GenerationEventHandler } from '@arch/contracts';

export class RecordingGenerationEventBus implements GenerationEventBus {
  readonly events: GenerationEvent[] = [];

  private readonly handlers: GenerationEventHandler[] = [];

  subscribe(handler: GenerationEventHandler): void {
    this.handlers.push(handler);
  }

  async publish(event: GenerationEvent): Promise<void> {
    this.events.push(event);

    for (const handler of this.handlers) {
      await handler.handle(event);
    }
  }
}
