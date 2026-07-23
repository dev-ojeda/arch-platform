// packages/governance/test/__tests__/forbidden-dependency-rule.test.ts

import { describe, expect, it } from 'vitest';

import { ForbiddenDependencyRule } from '../../src/rules/forbidden-dependency-rule.js';
import { createGovernanceContext } from '../fixtures/governance/create-governance-context.js';
import { createPackageDescriptor } from '../fixtures/workspace/create-package-descriptor.js';

describe('ForbiddenDependencyRule', () => {
  it('reports diagnostics for forbidden dependencies', async () => {
    const context = createGovernanceContext({
      workspace: {
        root: '/workspace',
        layout: undefined,

        packages: [
          createPackageDescriptor({
            name: '@arch/application',
            boundaries: {
              forbiddenDependencies: ['@arch/infra'],
            },
            internalDependencies: ['@arch/contracts', '@arch/infra'],
          }),
        ],
      },
    });

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
    const context = createGovernanceContext({
      workspace: {
        root: '/workspace',
        layout: undefined,
        packages: [
          createPackageDescriptor({
            name: '@arch/application',
            boundaries: {
              forbiddenDependencies: ['@arch/infra'],
            },
            internalDependencies: ['@arch/contracts'],
          }),
        ],
      },
    });

    const diagnostics = await new ForbiddenDependencyRule().run(context);

    expect(diagnostics).toEqual([]);
  });

  it('ignores packages without boundaries configuration', async () => {
    const context = createGovernanceContext({
      workspace: {
        root: '/workspace',
        layout: undefined,
        packages: [
          createPackageDescriptor({
            name: '@arch/application',
            internalDependencies: ['@arch/infra'],
          }),
        ],
      },
    });

    const diagnostics = await new ForbiddenDependencyRule().run(context);

    expect(diagnostics).toEqual([]);
  });
});
