// packages\testing\src\filesystem\create-memory-filesystem.ts

import { MemoryFileSystemAdapter } from '@arch/infrastructure';

export function createMemoryFilesystem() {
  return new MemoryFileSystemAdapter();
}
