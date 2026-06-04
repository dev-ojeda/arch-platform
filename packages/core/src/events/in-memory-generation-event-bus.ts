// packages/core/src/events/in-memory-generation-event-bus.ts

import type {
  GenerationEvent,
  GenerationEventBus,
  GenerationEventHandler,
} from '@arch/contracts/events';

export class InMemoryGenerationEventBus implements GenerationEventBus {
  private readonly handlers: GenerationEventHandler[] = [];

  subscribe(handler: GenerationEventHandler): void {
    this.handlers.push(handler);
  }

  async publish(event: GenerationEvent): Promise<void> {
    for (const handler of this.handlers) {
      await handler.handle(event);
    }
  }
}
