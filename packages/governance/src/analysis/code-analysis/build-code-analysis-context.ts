// packages/governance/src/analysis/code-analysis/build-code-analysis-context.ts

import type { CodeAnalysisAdapter } from './code-analysis-adapter.js';
import type {
  GovernanceContext,
  GovernanceExecutionContext,
} from '../../context/governance-context.js';


export function buildCodeAnalysisContext(
  context: GovernanceContext,
  adapter: CodeAnalysisAdapter,
): GovernanceExecutionContext {
  const analysis = adapter.analyze(context);
  return {
    ...context,
    analysis,
  };
}
