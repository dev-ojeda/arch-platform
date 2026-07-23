// packages/infrastructure/src/filesystem/errors/errno-utils.ts

import type { ErrnoException } from './errno-exception.js';

export function isErrnoException(error: unknown): error is ErrnoException {
  return error instanceof Error && 'code' in error;
}

export function hasErrorCode(error: unknown, ...codes: readonly string[]): error is ErrnoException {
  return isErrnoException(error) && codes.includes(String(error.code));
}
