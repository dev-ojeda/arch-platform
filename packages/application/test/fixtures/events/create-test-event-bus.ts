import type {
  GenerationEvent,
  GenerationEventBus,
  GenerationEventHandler,
} from '@arch-platform/contracts';

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

      for (const handler of handlers) {
        await handler.handle(event);
      }
    },

    subscribe(handler: GenerationEventHandler): void {
      handlers.add(handler);
    },
  };
}
