// packages/application/src/generation/runtime/assert-not-cancelled.ts

import type { GenerationCancellationReason } from '@arch/contracts';
import { GenerationCancelledError } from '@arch/core';

export function assertNotCancelled(
  signal?: AbortSignal,

  reason: GenerationCancellationReason = 'USER_ABORT',
): void {
  if (!signal?.aborted) {
    return;
  }

  throw new GenerationCancelledError(reason);
}
