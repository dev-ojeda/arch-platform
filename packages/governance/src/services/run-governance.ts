// packages/governance/src/services/run-governance.ts

import type { WorkspaceProvider } from '@arch/platform-model';

import { GovernanceCompositionRoot } from '../composition/governance-composition-root.js';
import { buildGovernanceContext } from '../context/build-governance-context.js';
import { buildGovernanceExecutionContext } from '../context/build-governance-execution-context.js';
import type { GovernanceScope } from '../context/governance-scope.js';
import type { GovernanceEngineResult } from '../engine/governance-engine-result.js';

export async function runGovernance(
  scope: GovernanceScope,
  workspaceProvider: WorkspaceProvider,
): Promise<GovernanceEngineResult> {
  const workspace = await workspaceProvider.discover(scope.root);

  const governanceContext = buildGovernanceContext(scope, workspace);

  const executionContext = buildGovernanceExecutionContext(governanceContext);

  const engine = new GovernanceCompositionRoot().createEngine();

  const result = await engine.run(executionContext);

  return result;
}
