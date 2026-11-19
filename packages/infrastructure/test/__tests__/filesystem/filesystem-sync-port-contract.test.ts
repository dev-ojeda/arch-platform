// packages\infrastructure\test\__tests__\filesystem-sync-port-contract.test.ts

import { NodeSyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-sync-filesystem-adapter.js';
import { removePathSync } from '../../../src/filesystem/io/fs-sync.js';
import { defineFileSystemPortContract } from '../../helpers/create-filesystem-port-contract.js';
import { createTestFilesystemRoot } from '../../helpers/create-filesystem-root.js';

let root = '';

defineFileSystemPortContract({
  name: 'NodeSyncFileSystemAdapter',
  create: () => {
    root = createTestFilesystemRoot('arch-sync-filesystem');
    return new NodeSyncFileSystemAdapter({ root });
  },
  cleanup: () => removePathSync(root),
});
