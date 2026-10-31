import { afterEach, describe, expect, it, vi } from 'vitest';

import { ensureDirAsync, removePathWithRetry } from '../../../src/filesystem/io/fs-async.js';
import { writeTextFileSync } from '../../../src/filesystem/io/fs-sync.js';
import { joinPath } from '../../../src/filesystem/io/path-utils.js';
import { NodeWorkspaceProvider } from '../../../src/workspace/node-workspace-provider.js';
import { createTestFilesystemRoot } from '../../helpers/create-filesystem-root.js';

describe('NodeWorkspaceProvider', () => {
  let workspaceRoot: string | undefined;

  afterEach(async () => {
    if (workspaceRoot) {
      await removePathWithRetry(workspaceRoot);
      workspaceRoot = undefined;
    }

    vi.restoreAllMocks();
  });

  async function createWorkspace(): Promise<string> {
    workspaceRoot = createTestFilesystemRoot('arch-workspace-provider-');

    writeTextFileSync(
      joinPath(workspaceRoot, 'pnpm-workspace.yaml'),
      'packages:\n  - packages/*\n',
    );
    writeTextFileSync(
      joinPath(workspaceRoot, 'package.json'),
      JSON.stringify({ name: 'workspace-fixture', private: true }),
    );

    writeTextFileSync(
      joinPath(workspaceRoot, 'tsconfig.json'),
      JSON.stringify({ compilerOptions: {} }),
    );

    await ensureDirAsync(joinPath(workspaceRoot, 'config'));

    writeTextFileSync(joinPath(workspaceRoot, 'config', 'arch.manifest.json'), JSON.stringify({}));
    return workspaceRoot;
  }

  function createPackageProvider() {
    return {
      discover: vi.fn().mockResolvedValue([]),
    };
  }

  it('detects scripts/git when the directory exists', async () => {
    const root = await createWorkspace();

    await ensureDirAsync(joinPath(root, 'scripts', 'git'));

    const provider = new NodeWorkspaceProvider(createPackageProvider());
    const workspace = await provider.discover(root);

    expect(workspace.layout.scriptPath).toBe(joinPath(root, 'scripts', 'git'));
    expect(workspace.layout.hasScriptPath).toBe(true);
  });

  it('reports scripts/git as unavailable when the directory does not exist', async () => {
    const root = await createWorkspace();

    const provider = new NodeWorkspaceProvider(createPackageProvider());
    const workspace = await provider.discover(root);
    expect(workspace.layout.scriptPath).toBe(joinPath(root, 'scripts', 'git'));
    expect(workspace.layout.hasScriptPath).toBe(false);
  });
});
