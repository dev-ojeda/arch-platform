// packages\core\src\errors\generation\generation-cancelled.error.ts

import type { GenerationCancellationReason } from '@arch/contracts';

import { GENERATION_ERROR_CODES } from './generation-error-codes.js';
import { GenerationError } from './generation-errors.js';

export class GenerationCancelledError extends GenerationError {
  readonly reason: GenerationCancellationReason;

  constructor(reason: GenerationCancellationReason) {
    super(
      `Generation cancelled: ${reason}`,

      GENERATION_ERROR_CODES.GENERATION_CANCELLED,
    );

    this.reason = reason;
  }
}
