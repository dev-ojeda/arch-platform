// packages/core/src/generation/cancellation/assert-not-cancelled.ts

import { GenerationCancelledError } from "../../errors/generation/generation-cancelled.error.js";

import type { GenerationCancellationReason } from "@arch/contracts";

export function assertNotCancelled(
  signal?: AbortSignal,

  reason: GenerationCancellationReason = "USER_ABORT"
): void {
  if (!signal?.aborted) {
    return;
  }

  throw new GenerationCancelledError(reason);
}
