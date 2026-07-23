// packages\governance\test\__tests__\detect-cycles-rule.test.ts

import { describe, expect, it } from 'vitest';

import { DetectCyclesRule } from '../../src/analysis/graph/detect-cycles-rule.js';
import { createGovernanceContext } from '../fixtures/governance/create-governance-context.js';
import { createPackageDescriptor } from '../fixtures/workspace/create-package-descriptor.js';
import { createWorkspaceDescriptor } from '../fixtures/workspace/create-workspace-descriptor.js';

describe('DetectCyclesRule', () => {
  it('returns no diagnostics when no cycles exist', async () => {
    const context = createGovernanceContext({
      workspace: createWorkspaceDescriptor({
        packages: [
          createPackageDescriptor({
            name: '@arch/a',
            internalDependencies: ['@arch/b'],
          }),
          createPackageDescriptor({
            name: '@arch/b',
            internalDependencies: [],
          }),
        ],
      }),
    });

    const diagnostics = await new DetectCyclesRule().run(context);

    expect(diagnostics).toEqual([]);
  });

  it('reports detected cycles', async () => {
    const context = createGovernanceContext({
      workspace: createWorkspaceDescriptor({
        packages: [
          createPackageDescriptor({
            name: '@arch/a',
            internalDependencies: ['@arch/b'],
          }),
          createPackageDescriptor({
            name: '@arch/b',
            internalDependencies: ['@arch/a'],
          }),
        ],
      }),
    });

    const diagnostics = await new DetectCyclesRule().run(context);

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'CYCLE_DETECTED',
      severity: 'error',
      source: 'detect-cycles-rule',
    });

    expect(diagnostics[0]?.metadata).toEqual({
      cycle: ['@arch/a', '@arch/b', '@arch/a'],
    });
  });
});
