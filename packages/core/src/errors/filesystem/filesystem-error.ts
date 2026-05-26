// packages\core\src\errors\filesystem\filesystem-error.ts
import { BaseError, type ErrorOptions } from '../base/base-error.js';
import type { FilesystemErrorCode } from '../codes/filesystem.codes.js';

export abstract class FilesystemError<TMetadata = unknown> extends BaseError<TMetadata> {
  readonly code: FilesystemErrorCode;

  protected constructor(
    message: string,
    code: FilesystemErrorCode,
    options?: ErrorOptions<TMetadata>,
  ) {
    super(message, options);

    this.code = code;
  }
}
