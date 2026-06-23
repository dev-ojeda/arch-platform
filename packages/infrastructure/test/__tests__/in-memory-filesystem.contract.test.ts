// packages/infrastructure/test/__tests__/in-memory-filesystem.contract.test.ts

import { describeFilesystemPortContract } from '@arch/testing';

import { MemoryFileSystemAdapter } from '../../src/filesystem/memory-filesystem.adapter.js';

describeFilesystemPortContract({
  createFilesystem: () => new MemoryFileSystemAdapter(),
});
