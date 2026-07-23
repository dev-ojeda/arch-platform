// packages/infrastructure/src/filesystem/errors/errno-exception.ts

export interface ErrnoException extends Error {
  readonly errno?: number;
  readonly code?: string;
  readonly path?: string;
  readonly syscall?: string;
  readonly dest?: string;
}
