// packages\governance\test\__tests__\detect-cycles-rule.test.ts

import { describe, expect, it } from 'vitest';

import { DetectCyclesRule } from '../../src/analysis/graph/detect-cycles-rule.js';
import type { GovernanceContext } from '../../src/types/governance-context.js';

describe('DetectCyclesRule', () => {
  it('returns no diagnostics when no cycles exist', async () => {
    const context: GovernanceContext = {
      workspaceRoot: '/workspace',

      packages: [
        {
          name: '@arch/a',
          rootPath: '/workspace/packages/a',
          manifestPath: '/workspace/packages/a/package.json',

          manifest: {
            name: '@arch/a',
          },

          internalDependencies: ['@arch/b'],
        },
        {
          name: '@arch/b',
          rootPath: '/workspace/packages/b',
          manifestPath: '/workspace/packages/b/package.json',

          manifest: {
            name: '@arch/b',
          },

          internalDependencies: [],
        },
      ],
    };

    const diagnostics = await new DetectCyclesRule().run(context);

    expect(diagnostics).toEqual([]);
  });

  it('reports detected cycles', async () => {
    const context: GovernanceContext = {
      workspaceRoot: '/workspace',

      packages: [
        {
          name: '@arch/a',
          rootPath: '/workspace/packages/a',
          manifestPath: '/workspace/packages/a/package.json',

          manifest: {
            name: '@arch/a',
          },

          internalDependencies: ['@arch/b'],
        },
        {
          name: '@arch/b',
          rootPath: '/workspace/packages/b',
          manifestPath: '/workspace/packages/b/package.json',

          manifest: {
            name: '@arch/b',
          },

          internalDependencies: ['@arch/a'],
        },
      ],
    };

    const diagnostics = await new DetectCyclesRule().run(context);

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]?.source).toBe('detect-cycles-rule');
    expect(diagnostics[0]).toMatchObject({
      code: 'CYCLE_DETECTED',
      severity: 'error',
    });

    expect(diagnostics[0]?.metadata).toEqual({
      cycle: ['@arch/a', '@arch/b', '@arch/a'],
    });
  });
});
