// packages/governance/src/workspace/workspace-package-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceContext } from '../context/governance-context.js';
import { GOVERNANCE_RULE_ID } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { GovernanceScope } from '../public/governance-scope.js';

export class WorkspacePackageRule implements GovernanceRule {
  readonly id = GOVERNANCE_RULE_ID.WorkspacePackageRule;
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

  private validatePackageTsConfig(context: GovernanceContext): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    for (const { layout, manifest } of context.packages.all()) {
      if (layout.hasTsconfig) {
        continue;
      }
      diagnostics.push({
        code: 'PACKAGE_TS_CONFIG_REQUIRED',

        severity: 'error',

        source: this.name,

        message: `Package "${manifest.name}" requires a tsconfig.json file".`,

        location: {
          file: layout.tsconfigPath,
        },

        hint: 'Add a tsconfig.json file to the package root.',
      });
    }

    return diagnostics;
  }
}
