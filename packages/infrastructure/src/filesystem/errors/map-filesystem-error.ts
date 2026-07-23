// packages/infrastructure/src/filesystem/errors/map-filesystem-error.ts

import { formatPathForMessage } from '../paths/format-path-for-message.js';

import { isErrnoException } from './errno-utils.js';
import { FileSystemError } from './filesystem-error.js';

export function mapFileSystemError(error: unknown, operation = 'filesystem'): FileSystemError {
  if (!isErrnoException(error)) {
    return new FileSystemError('Unknown filesystem error', operation, undefined, error);
  }

  switch (error.code) {
    case 'ENOENT':
      return new FileSystemError(
        `File not found: ${formatPathForError(error.path)}`,
        operation,
        error.path,
        error,
      );

    case 'EEXIST':
      return new FileSystemError(
        `Path already exists: ${formatPathForError(error.path)}`,
        operation,
        error.path,
        error,
      );

    case 'EISDIR':
      return new FileSystemError(
        `Cannot write file over directory: ${formatPathForError(error.path)}`,
        operation,
        error.path,
        error,
      );

    default:
      return new FileSystemError(error.message, operation, error.path, error);
  }
}

function formatPathForError(path?: string): string {
  return path ? formatPathForMessage(path) : '<unknown>';
}
