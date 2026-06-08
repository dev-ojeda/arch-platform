// packages/governance/src/validate/validate-workspace.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';
import { GovernanceEngine } from '../engine/governance-engine.js';
import { PackageJsonRule } from '../rules/package-json-rule.js';
import { buildGovernanceContext } from '../workspace/build-governance-context.js';

export async function validateWorkspace(workspaceRoot: string): Promise<Diagnostic[]> {
  const context = await buildGovernanceContext(workspaceRoot);

  const result = await new GovernanceEngine([new PackageJsonRule()]).run(context);

  return [...result.diagnostics];
}
