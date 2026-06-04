// packages/application/src/runtime/execution/events/publish-generation-event.ts

import type { GenerationEventName } from '@arch/contracts/events';
import type { GenerationContext } from '@arch/contracts/generation';

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
