// packages\governance\test\__tests__\validate-package-structure-rule.test.ts

import { describe, expect, it } from 'vitest';

import { ValidatePackageStructureRule } from '../../src/rules/validate-package-structure.rule.js';
import { createGovernanceContext } from '../fixtures/governance/create-governance-context.js';
import { createPackageDescriptor } from '../fixtures/workspace/create-package-descriptor.js';
import { createPackageLayout } from '../fixtures/workspace/create-package-layout.js';
import { createWorkspaceDescriptor } from '../fixtures/workspace/create-workspace-descriptor.js';

describe('ValidatePackageStructureRule', () => {
  it('does not report diagnostics when src directory exists', async () => {
    const context = createGovernanceContext({
      workspace: createWorkspaceDescriptor({
        packages: [
          createPackageDescriptor({
            layout: createPackageLayout({
              hasSourceDirectory: true,
              hasDistributionDirectory: false,
              hasTestsDirectory: false,
            }),
          }),
        ],
      }),
    });

    const diagnostics = await new ValidatePackageStructureRule().run(context);

    expect(diagnostics).toEqual([]);
  });

  it('reports diagnostics when src directory is missing', async () => {
    const context = createGovernanceContext({
      workspace: createWorkspaceDescriptor({
        packages: [
          createPackageDescriptor({
            layout: createPackageLayout({
              hasSourceDirectory: false,
              hasDistributionDirectory: false,
              hasTestsDirectory: false,
            }),
          }),
        ],
      }),
    });

    const diagnostics = await new ValidatePackageStructureRule().run(context);

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'PACKAGE_SRC_DIRECTORY_MISSING',
      severity: 'error',
      source: 'validate-package-structure',
      hint: 'Create a src directory for the package.',
    });
  });
});
