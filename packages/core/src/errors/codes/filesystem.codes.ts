// packages/core/src/errors/codes/filesystem.codes.ts
export const FILESYSTEM_ERROR_CODES = {
  FILE_ALREADY_EXISTS: 'ARCH-FS-001',

  WRITE_FAILED: 'ARCH-FS-002',

  INVALID_PATH: 'ARCH-FS-003',
} as const;

export type FilesystemErrorCode =
  (typeof FILESYSTEM_ERROR_CODES)[keyof typeof FILESYSTEM_ERROR_CODES];
