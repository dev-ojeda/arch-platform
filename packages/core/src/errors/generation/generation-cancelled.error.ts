// packages\core\src\errors\generation\generation-cancelled.error.ts

import type { GenerationCancellationReason } from '@arch/contracts';

import { GENERATION_ERROR_CODES } from '../codes/generation.codes.js';

import { GenerationError } from './generation-errors.js';

import type { ErrorOptions } from '../base/base-error.js';

export interface GenerationCancelledMetadata {
  reason: GenerationCancellationReason;
}

export class GenerationCancelledError extends GenerationError<GenerationCancelledMetadata> {
  constructor(
    reason: GenerationCancellationReason,
    options?: ErrorOptions<GenerationCancelledMetadata>,
  ) {
    super(
      `Generation cancelled: ${reason}`,

      GENERATION_ERROR_CODES.GENERATION_CANCELLED,

      {
        ...options,

        metadata: {
          ...options?.metadata,

          reason,
        },
      },
    );
  }
}
