// packages/governance/src/rules/validate-workspace.ts

import { buildGovernanceExecutionContext } from '../context/build-governance-execution-context.js';
import { GovernanceEngine } from '../engine/governance-engine.js';
import type { Diagnostic } from '../types/diagnostic.js';

import { createDefaultGovernanceRules } from './default-governance-rules.js';

export async function validateWorkspace(workspaceRoot: string): Promise<Diagnostic[]> {
  const context = await buildGovernanceExecutionContext(workspaceRoot);

  const engine = new GovernanceEngine(createDefaultGovernanceRules());

  const result = await engine.run(context);

  return [...result.diagnostics];
}
