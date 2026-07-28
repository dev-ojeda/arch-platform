// packages/core/src/errors/registry/registry-errors.ts

import { BaseError, type ErrorOptions } from '../base/base-error.js';
import type { RegistryErrorCode } from '../codes/registry.codes.js';

export abstract class RegistryError<TMetadata = unknown> extends BaseError<TMetadata> {
  readonly code: RegistryErrorCode;

  protected constructor(
    message: string,
    code: RegistryErrorCode,
    options?: ErrorOptions<TMetadata>,
  ) {
    super(message, options);

    this.code = code;
  }
}
