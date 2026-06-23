// packages/application/src/generation/runtime/enforce-timeout-policy.ts

import type { GenerationContext } from '@arch/contracts';

export function enforceTimeoutPolicy(context: GenerationContext): void {
  const timeout = context.timeoutPolicy?.timeout;

  if (!timeout) {
    return;
  }

  setTimeout(() => {
    context.cancelled = true;

    context.cancellationReason = 'TIMEOUT';

    /*
     * Cooperative cancellation
     */

    context.signal?.throwIfAborted?.();
  }, timeout);
}
