import { vi } from 'vitest';

import type { FileSystemAsyncPort } from '@arch-platform/contracts';

export function createFilesystem() {
  return {
    copy: vi.fn().mockResolvedValue(undefined),
    createDirectory: vi.fn().mockResolvedValue(undefined),
    exists: vi.fn().mockResolvedValue(false),
    read: vi.fn(),
    readJson: vi.fn(),
    readBuffer: vi.fn(),
    remove: vi.fn().mockResolvedValue(undefined),
    readDirectory: vi.fn().mockResolvedValue([]),
    rename: vi.fn().mockResolvedValue(undefined),
    write: vi.fn().mockResolvedValue(undefined),
    writeJson: vi.fn().mockResolvedValue(undefined),
  } satisfies FileSystemAsyncPort;
}
