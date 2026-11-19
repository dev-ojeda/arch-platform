// packages/infrastructure/src/filesystem/errors/map-filesystem-error.ts

import { isErrnoException } from './errno-utils.js';
import { FileSystemError } from './filesystem-error.js';
import { formatPathForMessage } from '../paths/format-path-for-message.js';

export function mapFileSystemError(error: unknown, operation = 'filesystem'): FileSystemError {
  if (!isErrnoException(error)) {
    const message = error instanceof Error ? error.message : 'Unknown filesystem error';

    return new FileSystemError(message, operation, undefined, error);
  }

  const path = formatPathForError(error.path);

  switch (error.code) {
    case 'ENOENT':
      return new FileSystemError(`File not found: ${path}`, operation, error.path, error);

    case 'EEXIST':
      return new FileSystemError(`Path already exists: ${path}`, operation, error.path, error);

    case 'EISDIR':
      return new FileSystemError(
        `Cannot write file over directory: ${path}`,
        operation,
        error.path,
        error,
      );

    case 'EACCES':
    case 'EPERM':
      return new FileSystemError(`Permission denied: ${path}`, operation, error.path, error);

    default:
      return new FileSystemError(
        `Filesystem operation failed (${error.code})`,
        operation,
        error.path,
        error,
      );
  }
}

function formatPathForError(path?: string): string {
  return path ? formatPathForMessage(path) : '<unknown>';
}
