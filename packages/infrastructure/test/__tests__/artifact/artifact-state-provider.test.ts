import { afterEach, describe, expect, it } from 'vitest';

import { ArtifactStateProvider } from '@arch-platform/infrastructure';

import {
  ensureDirAsync,
  removePathWithRetry,
  writeTextFile,
} from '../../../src/filesystem/io/fs-async.js';
import { packagePath } from '../../../src/filesystem/io/path-utils.js';
import { createTestFilesystemRoot } from '../../helpers/create-filesystem-root.js';

describe('ArtifactStateProvider', () => {
  let workspaceRoot: string | undefined;

  afterEach(async () => {
    if (workspaceRoot) {
      await removePathWithRetry(workspaceRoot);
      workspaceRoot = undefined;
    }
  });

  it('does not throw when artifact state exists', async () => {
    workspaceRoot = createTestFilesystemRoot('arch-artifact-state-');
    const stateDirectory = packagePath(workspaceRoot, '.arch-platform');
    await ensureDirAsync(stateDirectory);
    await writeTextFile(
      packagePath(stateDirectory, 'artifact-state.json'),
      JSON.stringify({ schemaVersion: 1, artifacts: {} }),
    );

    await expect(
      new ArtifactStateProvider().assertArtifactStateExistsForWorkspace(workspaceRoot),
    ).resolves.toBeUndefined();
  });

  it('throws explicitly when artifact state does not exist', async () => {
    workspaceRoot = createTestFilesystemRoot('arch-artifact-state-');

    await expect(
      new ArtifactStateProvider().assertArtifactStateExistsForWorkspace(workspaceRoot),
    ).rejects.toThrow(
      `Compliance requires artifact state file "/.arch-platform/artifact-state.json" in workspace "${workspaceRoot}".`,
    );
  });
});
