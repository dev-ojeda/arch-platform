// packages/governance/test/__tests__/forbidden-dependency-rule.test.ts

import { describe, expect, it } from 'vitest';

import { ForbiddenDependencyRule } from '../../src/rules/forbidden-dependency-rule.js';
import type { GovernanceContext } from '../../src/types/governance-context.js';

describe('ForbiddenDependencyRule', () => {
  it('reports diagnostics for forbidden dependencies', async () => {
    const context: GovernanceContext = {
      workspaceRoot: '/workspace',

      packages: [
        {
          name: '@arch/application',

          rootPath: '/workspace/packages/application',

          manifestPath: '/workspace/packages/application/package.json',

          manifest: {
            name: '',
          },

          boundaries: {
            forbiddenDependencies: ['@arch/infra'],
          },

          internalDependencies: ['@arch/contracts', '@arch/infra'],
        },
      ],
    };

    const diagnostics = await new ForbiddenDependencyRule().run(context);

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'FORBIDDEN_DEPENDENCY',

      severity: 'error',

      metadata: {
        package: '@arch/application',

        dependency: '@arch/infra',
      },
    });
  });
  it('does not report diagnostics when dependencies are allowed', async () => {
    const context: GovernanceContext = {
      workspaceRoot: '/workspace',

      packages: [
        {
          name: '@arch/application',

          rootPath: '/workspace/packages/application',

          manifestPath: '/workspace/packages/application/package.json',

          manifest: {
            name: '',
          },

          boundaries: {
            forbiddenDependencies: ['@arch/infra'],
          },

          internalDependencies: ['@arch/contracts'],
        },
      ],
    };

    const diagnostics = await new ForbiddenDependencyRule().run(context);

    expect(diagnostics).toEqual([]);
  });
  it('ignores packages without boundaries configuration', async () => {
    const context: GovernanceContext = {
      workspaceRoot: '/workspace',

      packages: [
        {
          name: '@arch/application',

          rootPath: '/workspace/packages/application',

          manifestPath: '/workspace/packages/application/package.json',

          manifest: {
            name: '',
          },
          internalDependencies: ['@arch/infra'],
        },
      ],
    };

    const diagnostics = await new ForbiddenDependencyRule().run(context);

    expect(diagnostics).toEqual([]);
  });
});
