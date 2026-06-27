// packages/governance/src/workspace/workspace-package-rule.ts

import { stat } from 'node:fs/promises';
import { join } from 'node:path';

import { GovernanceRuleId } from '../engine/governance-rule-id.js';
import type { GovernanceRule } from '../engine/governance-rule.js';
import type { Diagnostic } from '../types/diagnostic.js';
import type { GovernanceContext } from '../types/governance-context.js';

export class WorkspacePackageRule implements GovernanceRule {
  readonly id = GovernanceRuleId.WorkspacePackageRule;
  readonly name = 'workspace-package-rule';

  async run(context: GovernanceContext): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = [];

    const packageJsonPath = join(context.workspaceRoot, 'package.json');

    try {
      await stat(packageJsonPath);
    } catch {
      diagnostics.push({
        code: 'WORKSPACE_PACKAGE_JSON_MISSING',

        severity: 'error',

        source: this.name,

        message: 'Root package.json not found',

        location: {
          file: packageJsonPath,
        },

        hint: 'Initialize the workspace with a root package.json file.',
      });
    }

    return diagnostics;
  }
}
