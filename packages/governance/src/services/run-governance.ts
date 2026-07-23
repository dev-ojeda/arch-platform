// packages/governance/src/services/run-governance.ts

import type { Diagnostic, WorkspaceProvider } from '@arch/platform-model';

import { createGovernanceRules } from '../composition/governance-rules.js';
import { buildGovernanceContext } from '../context/build-governance-context.js';
import { buildGovernanceExecutionContext } from '../context/build-governance-execution-context.js';
import type { GovernanceScope } from '../context/governance-scope.js';
import { GovernanceEngine } from '../engine/governance-engine.js';

export async function runGovernance(
  scope: GovernanceScope,
  workspaceProvider: WorkspaceProvider,
): Promise<Diagnostic[]> {
  const workspace = await workspaceProvider.discover(scope.root);

  const governanceContext = buildGovernanceContext(workspace);

  const executionContext = await buildGovernanceExecutionContext(governanceContext);

  const engine = new GovernanceEngine(createGovernanceRules());

  const result = await engine.run(executionContext);

  return [...result.diagnostics];
}
