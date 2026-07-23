// packages/infrastructure/src/filesystem/options/default-filesystem-option.ts

import type { FileSystemAdapterOptions } from './filesystem-options.js';

export const DEFAULT_FILE_SYSTEM_OPTIONS = {
  root: process.cwd(),
} as const satisfies Required<FileSystemAdapterOptions>;
