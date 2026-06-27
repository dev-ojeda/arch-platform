// packages/governance/src/analysis/code-analysis/build-code-analysis-context.ts

import type {
  GovernanceContext,
  GovernanceExecutionContext,
} from '../../types/governance-context.js';

import type { CodeAnalysisAdapter } from './code-analysis-adapter.js';

export async function buildCodeAnalysisContext(
  context: GovernanceContext,
  adapter: CodeAnalysisAdapter,
  tsConfigFilePath: string,
): Promise<GovernanceExecutionContext> {
  const analysis = await adapter.analyze(context, tsConfigFilePath);

  return {
    ...context,
    analysis,
  };
}
