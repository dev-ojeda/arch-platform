// packages/governance/src/workspace/workspace-package-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';
import { GovernanceRuleId } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceScope } from '../public/governance-scope.js';

export class WorkspacePackageRule implements GovernanceRule {
  readonly id = GovernanceRuleId.WorkspacePackageRule;
  readonly name = 'workspace-package-rule';

  run(context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const layout = context.workspace.layout;
    if (!layout.hasPackageManifest) {
      diagnostics.push({
        code: 'WORKSPACE_PACKAGE_JSON_MISSING',

        severity: 'error',

        source: this.name,

        message: 'Root package.json not found',

        location: {
          file: layout.packageJsonPath,
        },

        hint: 'Initialize the workspace with a root package.json file.',
      });
    }

    return diagnostics;
  }
  supports(scope: GovernanceScope): boolean {
    return scope.kind === 'workspace';
  }
}
