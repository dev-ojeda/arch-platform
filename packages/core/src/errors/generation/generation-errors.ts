// packages/core/src/errors/generation/generation-errors.ts

import { BaseError, type ErrorOptions } from '../base/base-error.js';
import type { GenerationErrorCode } from '../codes/generation.codes.js';

export abstract class GenerationError<TMetadata = unknown> extends BaseError<TMetadata> {
  readonly code: GenerationErrorCode;

  protected constructor(
    message: string,
    code: GenerationErrorCode,
    options?: ErrorOptions<TMetadata>,
  ) {
    super(message, options);

    this.code = code;
  }
}
