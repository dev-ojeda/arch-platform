// packages/governance/test/rules/public-api/deep-import-boundary.test.ts

import { describe, expect, it } from 'vitest';

import { OnlyPublicApiRule } from '../../../src/rules/public-api/only-public-api.rule.js';
import type { GovernanceExecutionContext } from '../../../src/types/governance-context.js';

function createDeepImportContext(): GovernanceExecutionContext {
  return {
    workspaceRoot: '',

    packages: [
      {
        name: '@arch/application',

        rootPath: '',

        manifestPath: '',

        manifest: {
          name: '@arch/application',
        },

        internalDependencies: ['@arch/domain'],
      },

      {
        name: '@arch/domain',

        rootPath: '',

        manifestPath: '',

        manifest: {
          name: '@arch/domain',

          exports: {
            '.': './dist/index.js',
          },
        },

        boundaries: {
          private: ['internal'],
        },

        internalDependencies: [],
      },
    ],

    analysis: {
      packageGraph: {} as never,

      symbolGraph: {
        nodes: [
          {
            id: 'UserService',
            name: 'UserService',
            package: '@arch/application',
            exported: true,
            kind: 'function',
            sourceFile: 'user.service.ts',
          },

          {
            id: 'UserValidator',
            name: 'UserValidator',
            package: '@arch/domain',
            exported: true,
            kind: 'function',
            sourceFile: 'internal/user-validator.ts',
          },
        ],

        edges: [
          {
            from: 'UserService',

            to: 'UserValidator',

            type: 'import',

            kind: 'import',

            importPath: '@arch/domain/internal/user-validator',
          },
        ],
      },
    },
  };
}

describe('OnlyPublicApiRule deep imports', () => {
  it('rejects private deep imports', async () => {
    const diagnostics = await new OnlyPublicApiRule().run(createDeepImportContext());
    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'ARCH_PRIVATE_API_ACCESS',

      severity: 'error',
    });
  });
});
