// src/context/build-governance-execution-context.ts

import { CodeAnalysisAdapter } from '../analysis/code-analysis/code-analysis-adapter.js';
import { createGovernanceAnalysisContext } from '../analysis/code-analysis/create-governance-analysis-context.js';

import type { GovernanceContext, GovernanceExecutionContext } from './governance-context.js';

export async function buildGovernanceExecutionContext(
  context: GovernanceContext,
): Promise<GovernanceExecutionContext> {
  return await createGovernanceAnalysisContext(context, new CodeAnalysisAdapter());
}
