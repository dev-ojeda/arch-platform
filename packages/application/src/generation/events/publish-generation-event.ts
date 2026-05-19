// packages/application/src/generation/events/publish-generation-event.ts

import type { GenerationContext, GenerationEventName } from "@arch/contracts";

export async function publishGenerationEvent(
  context: GenerationContext,

  name: GenerationEventName,

  payload?: Readonly<Record<string, unknown>>
): Promise<void> {
  await context.eventBus.publish({
    name,

    payload,

    timestamp: Date.now(),
  });
}
