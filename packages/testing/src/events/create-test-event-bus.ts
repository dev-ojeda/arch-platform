// packages/testing/src/events/create-test-event-bus.ts

import type {
  GenerationEvent,
  GenerationEventBus,
  GenerationEventHandler,
} from '@arch/contracts/events';

export interface TestEventBus extends GenerationEventBus {
  readonly publishedEvents: readonly GenerationEvent[];
}

export function createTestEventBus(): TestEventBus {
  const publishedEvents: GenerationEvent[] = [];

  const handlers = new Set<GenerationEventHandler>();

  return {
    publishedEvents,

    async publish(event: GenerationEvent): Promise<void> {
      publishedEvents.push(event);

      await Promise.all(
        [...handlers].map(async (handler) => {
          await handler.handle(event);
        }),
      );
    },

    subscribe(handler: GenerationEventHandler): void {
      handlers.add(handler);
    },
  };
}
