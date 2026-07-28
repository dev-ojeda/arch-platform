// packages/core/src/errors/filesystem/filesystem-invalid-path.error.ts

import type { ErrorOptions } from '../base/base-error.js';
import { FILESYSTEM_ERROR_CODES } from '../codes/filesystem.codes.js';

import { FilesystemError } from './filesystem-error.js';

export interface InvalidPathMetadata {
  path: string;
}

export class InvalidPathError extends FilesystemError<InvalidPathMetadata> {
  constructor(path: string, options?: ErrorOptions<InvalidPathMetadata>) {
    super(
      `Invalid filesystem path: ${path}`,

      FILESYSTEM_ERROR_CODES.INVALID_PATH,

      {
        ...options,

        metadata: {
          ...options?.metadata,

          path,
        },
      },
    );
  }
}
