// packages\core\src\errors\validation\validation-errors.ts
import { BaseError, type ErrorOptions } from '../base/base-error.js';
import type { ValidationErrorCode } from '../codes/validation.codes.js';

export abstract class ValidationError<TMetadata = unknown> extends BaseError<TMetadata> {
  readonly code: ValidationErrorCode;

  protected constructor(
    message: string,
    code: ValidationErrorCode,
    options?: ErrorOptions<TMetadata>,
  ) {
    super(message, options);

    this.code = code;
  }
}
