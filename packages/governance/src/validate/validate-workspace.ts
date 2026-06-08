// packages/governance/src/validate/validate-workspace.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';
import { GovernanceEngine } from '../engine/governance-engine.js';
import { createDefaultGovernanceRules } from '../rules/default-governance-rules.js';
import { buildGovernanceContext } from '../workspace/build-governance-context.js';

export async function validateWorkspace(workspaceRoot: string): Promise<Diagnostic[]> {
  const context = await buildGovernanceContext(workspaceRoot);

  const result = await new GovernanceEngine(createDefaultGovernanceRules()).run(context);

  return [...result.diagnostics];
}
