// packages/infrastructure/src/filesystem/io/retryable-errors.ts

const RETRYABLE_FS_ERRORS = new Set(['EBUSY', 'EPERM', 'EACCES']);
export function isRetryableFsError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && RETRYABLE_FS_ERRORS.has(String(error.code));
}
