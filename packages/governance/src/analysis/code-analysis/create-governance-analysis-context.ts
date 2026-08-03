// packages/governance/src/analysis/code-analysis/create-governance-analysis-context.ts

import type {
  GovernanceContext,
  GovernanceExecutionContext,
} from '../../context/governance-context.js';

import type { AnalysisAdapter } from './analysis-adapter.js';

export async function createGovernanceAnalysisContext(
  context: GovernanceContext,
  adapter: AnalysisAdapter,
): Promise<GovernanceExecutionContext> {
  const analysis = await adapter.analyze(context);

  return {
    ...context,
    analysis,
  };
}
