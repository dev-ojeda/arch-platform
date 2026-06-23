// packages/application/src/runtime/execution/events/publish-generation-event.ts

import type { GenerationContext, GenerationEventName } from '@arch/contracts';

export async function publishGenerationEvent(
  context: Pick<GenerationContext, 'eventBus'>,
  name: GenerationEventName,
  payload?: Readonly<Record<string, unknown>>,
): Promise<void> {
  await context.eventBus.publish({
    name,
    payload,
    timestamp: Date.now(),
  });
}
