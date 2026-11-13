// packages/infrastructure/test/__tests__/filesystem-async-port-contract.test.ts

import { NodeAsyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-async-filesystem-adapter.js';
import { removePath } from '../../../src/filesystem/io/fs-async.js';
import { defineFileSystemPortContract } from '../../helpers/create-filesystem-port-contract.js';
import { createTestFilesystemRoot } from '../../helpers/create-filesystem-root.js';

let root = '';

defineFileSystemPortContract({
  name: 'NodeAsyncFileSystemAdapter',
  create: () => {
    root = createTestFilesystemRoot('arch-async-filesystem');
    return new NodeAsyncFileSystemAdapter({ root });
  },
  cleanup: () => removePath(root),
});
