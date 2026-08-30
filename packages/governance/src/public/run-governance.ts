// packages/governance/src/public/run-governance.ts

import { GovernanceCompositionRoot } from '../composition/governance-composition-root.js';
import { buildGovernanceContext } from '../context/build-governance-context.js';

import type { GovernanceOptions } from './governance-options.js';
import type { GovernanceResult } from './governance-result.js';

export async function runGovernance(options: GovernanceOptions): Promise<GovernanceResult> {
  const {
    architectureProvider,
    workspaceProvider,

    createGovernanceExecutionContext,
    engine,
  } = new GovernanceCompositionRoot().create();

  const architecture = await architectureProvider.load(options.workspaceRoot);
  const workspace = await workspaceProvider.discover(options.workspaceRoot);

  const context = buildGovernanceContext(options, architecture, workspace);

  const executionContext = await createGovernanceExecutionContext(context);

  const result = await engine.run(executionContext);

  return result;
}
