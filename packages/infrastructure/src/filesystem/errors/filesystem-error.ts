// packages/infrastructure/src/filesystem/errors/filesystem-error.ts

export class FileSystemError extends Error {
  constructor(
    message: string,
    readonly operation: string,
    readonly path?: string,
    override readonly cause?: unknown,
  ) {
    super(message);

    this.name = 'FileSystemError';
  }
}
