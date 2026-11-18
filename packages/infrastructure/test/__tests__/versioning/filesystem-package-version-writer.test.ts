import { describe, expect, it } from 'vitest';

import { NodeAsyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-async-filesystem-adapter.js';
import { removePath } from '../../../src/filesystem/io/fs-async.js';
import { FilesystemPackageVersionWriter } from '../../../src/versioning/filesystem-package-version-writer.js';
import { createTestFilesystemRoot } from '../../helpers/create-filesystem-root.js';

const manifest = {
  name: '@arch-platform/contracts',
  version: '0.1.0',
  type: 'module',
  types: './dist/index.d.ts',
  exports: {
    '.': {
      types: './dist/index.d.ts',
    },
  },
  files: ['dist'],
  arch: {
    artifactType: 'declaration',
    build: {
      builder: 'tsc-declaration',
      outputs: ['dist'],
    },
    kind: 'tooling',
  },
  scripts: {
    build: 'pnpm build:dts',
    'build:dts': 'tsc -p tsconfig.build.json',
    arch: 'arch build --package @arch-platform/contracts',
    clean: 'arch clean',
    compliance: 'arch compliance --package @arch-platform/contracts --env dev',
    typecheck: 'arch typecheck',
  },
};

describe('FilesystemPackageVersionWriter', () => {
  it('actualiza solamente la versión del package.json', async () => {
    const root = createTestFilesystemRoot('package-version-writer');

    try {
      const filesystem = new NodeAsyncFileSystemAdapter({ root });

      await filesystem.writeJson('/package.json', manifest);

      const writer = new FilesystemPackageVersionWriter(filesystem);

      await writer.write('/package.json', '0.2.0');

      const result = await filesystem.readJson<Record<string, unknown>>('/package.json');
      expect(result).toEqual({
        ...manifest,
        version: '0.2.0',
      });
    } finally {
      await removePath(root);
    }
  });
});
