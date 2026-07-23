// packages/governance/src/analysis/code-analysis/build-code-analysis-context.ts

import type {
  GovernanceContext,
  GovernanceExecutionContext,
} from '../../context/governance-context.js';

import type { CodeAnalysisAdapter } from './code-analysis-adapter.js';

export async function buildCodeAnalysisContext(
  context: GovernanceContext,
  adapter: CodeAnalysisAdapter,
): Promise<GovernanceExecutionContext> {
  const analysis = await adapter.analyze(context);

  return {
    ...context,
    analysis,
  };
}
