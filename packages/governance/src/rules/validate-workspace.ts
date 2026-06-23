// packages/governance/src/rules/validate-workspace.ts

import { buildGovernanceContext } from '../context/build-governance-context.js';
import type { Diagnostic } from '../diagnostics/diagnostic.js';
import { GovernanceEngine } from '../engine/governance-engine.js';
import { createDefaultGovernanceRules } from '../rules/default-governance-rules.js';

export async function validateWorkspace(workspaceRoot: string): Promise<Diagnostic[]> {
  const context = await buildGovernanceContext(workspaceRoot);

  const result = await new GovernanceEngine(createDefaultGovernanceRules()).run(context);

  return [...result.diagnostics];
}
