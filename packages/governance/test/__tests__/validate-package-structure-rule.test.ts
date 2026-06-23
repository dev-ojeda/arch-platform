// packages\governance\test\__tests__\validate-package-structure-rule.test.ts

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { ValidatePackageStructureRule } from '../../src/rules/validate-package-structure.rule.js';
import type { GovernanceContext } from '../../src/types/governance-context.js';

describe('CreateTestValidatePackageStructureRule', () => {
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
  it('does not report diagnostics when src directory exists', async () => {
    const packageRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'governance-package-'));

    temporaryDirectories.push(packageRoot);

    await fs.mkdir(path.join(packageRoot, 'src'));

    const context: GovernanceContext = {
      workspaceRoot: packageRoot,

      packages: [
        {
          name: '@arch/example',

          rootPath: packageRoot,

          manifestPath: path.join(packageRoot, 'package.json'),

          manifest: {
            name: '',
          },
          internalDependencies: [],
        },
      ],
    };

    const diagnostics = await new ValidatePackageStructureRule().run(context);

    expect(diagnostics).toEqual([]);
  });
  it('reports diagnostics when src directory is missing', async () => {
    const packageRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'governance-package-'));

    temporaryDirectories.push(packageRoot);

    const diagnostics = await new ValidatePackageStructureRule().run({
      workspaceRoot: packageRoot,

      packages: [
        {
          name: '@arch/example',

          rootPath: packageRoot,

          manifestPath: path.join(packageRoot, 'package.json'),

          manifest: {
            name: '',
          },
          internalDependencies: [],
        },
      ],
    });

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'PACKAGE_SRC_DIRECTORY_MISSING',

      severity: 'error',

      source: 'validate-package-structure',

      hint: 'Create a src directory for the package.',
    });
  });
});
