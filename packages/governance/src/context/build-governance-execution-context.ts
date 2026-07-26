// src/context/build-governance-execution-context.ts

import { buildCodeAnalysisContext } from '../analysis/code-analysis/build-code-analysis-context.js';
import { CodeAnalysisAdapter } from '../analysis/code-analysis/code-analysis-adapter.js';

import type { GovernanceContext, GovernanceExecutionContext } from './governance-context.js';

export function buildGovernanceExecutionContext(
  context: GovernanceContext,
): GovernanceExecutionContext {
  return buildCodeAnalysisContext(context, new CodeAnalysisAdapter());
}
