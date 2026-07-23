// packages\governance\test\__tests__\workspace-package-rule.test.ts

import { describe, expect, it } from 'vitest';

import { WorkspacePackageRule } from '../../src/workspace/workspace-package-rule.js';
import { createGovernanceContext } from '../fixtures/governance/create-governance-context.js';
import { createWorkspaceDescriptor } from '../fixtures/workspace/create-workspace-descriptor.js';
import { createWorkspaceLayout } from '../fixtures/workspace/create-workspace-layout.js';

describe('WorkspacePackageRule', () => {
  it('does not report diagnostics when root package.json exists', async () => {
    const context = createGovernanceContext();

    const diagnostics = await new WorkspacePackageRule().run(context);

    expect(diagnostics).toEqual([]);
  });

  it('reports diagnostics when root package.json is missing', async () => {
    const context = createGovernanceContext({
      workspace: createWorkspaceDescriptor({
        layout: createWorkspaceLayout({
          hasPackageManifest: false,
        }),
      }),
    });

    const diagnostics = await new WorkspacePackageRule().run(context);

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'WORKSPACE_PACKAGE_JSON_MISSING',
      severity: 'error',
      source: 'workspace-package-rule',
    });
  });
});
