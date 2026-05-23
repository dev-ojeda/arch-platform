import { BaseError } from '../base/base-error.js';

import type { ValidationErrorCode } from './validation-error-codes.js';

export abstract class ValidationError extends BaseError {
  readonly code: ValidationErrorCode;

  constructor(
    message: string,
    code: ValidationErrorCode,
    options?: {
      cause?: unknown;
      metadata?: unknown;
    },
  ) {
    super(message, options);

    this.code = code;
  }
}
