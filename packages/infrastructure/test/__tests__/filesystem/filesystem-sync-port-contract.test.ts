// packages\infrastructure\test\__tests__\filesystem-sync-port-contract.test.ts

import { createTestFilesystemRoot, runFileSystemSyncPortContract } from '@arch/testing';

import { NodeSyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-sync-filesystem-adapter.js';

runFileSystemSyncPortContract(() => {
  const root = createTestFilesystemRoot('sync-filesystem');
  return new NodeSyncFileSystemAdapter({
    root,
  });
});
