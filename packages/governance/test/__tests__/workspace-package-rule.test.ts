// packages\governance\test\__tests__\workspace-package-rule.test.ts

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { WorkspacePackageRule } from '../../src/workspace/workspace-package-rule.js';

describe('CreateTestWorkspacePackageRule', () => {
  const temporaryDirectories: string[] = [];

  afterEach(async () => {
    await Promise.all(
      temporaryDirectories.map((directory) =>
        fs.rm(directory, {
          recursive: true,
          force: true,
        }),
      ),
    );

    temporaryDirectories.length = 0;
  });
  it('does not report diagnostics when root package.json exists', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'governance-workspace-'));

    temporaryDirectories.push(workspaceRoot);

    await fs.writeFile(path.join(workspaceRoot, 'package.json'), '{}', 'utf8');

    const diagnostics = await new WorkspacePackageRule().run({
      workspaceRoot,
      packages: [],
    });

    expect(diagnostics).toEqual([]);
  });
  it('reports diagnostics when root package.json is missing', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'governance-workspace-'));

    temporaryDirectories.push(workspaceRoot);

    const diagnostics = await new WorkspacePackageRule().run({
      workspaceRoot,
      packages: [],
    });

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'WORKSPACE_PACKAGE_JSON_MISSING',

      severity: 'error',

      source: 'workspace-package-rule',
    });
  });
});
