// packages/infrastructure/test/__tests__/filesystem-async-port-contract.test.ts

import { createTestFilesystemRoot, runFileSystemAsyncPortContract } from '@arch/testing';

import { NodeAsyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-async-filesystem-adapter.js';

runFileSystemAsyncPortContract(async () => {
  const root = createTestFilesystemRoot('async-filesystem');

  return new NodeAsyncFileSystemAdapter({
    root,
  });
});
