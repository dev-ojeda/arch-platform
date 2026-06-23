// packages/testing/src/filesystem/create-mock-filesystem.ts

import type { WriteFileOptions } from '@arch/contracts';
import { vi } from 'vitest';

import { createMemoryFilesystem } from './create-memory-filesystem.js';

export function createMockFilesystem() {
  const filesystem = createMemoryFilesystem();

  return {
    ...filesystem,

    read: vi.fn((targetPath: string) => filesystem.read(targetPath)),

    exists: vi.fn((targetPath: string) => filesystem.exists(targetPath)),

    remove: vi.fn((targetPath: string) => filesystem.remove(targetPath)),

    copy: vi.fn((source: string, destination: string) => filesystem.copy(source, destination)),

    write: vi.fn((targetPath: string, content: string, options?: WriteFileOptions) =>
      filesystem.write(targetPath, content, options),
    ),
  };
}
