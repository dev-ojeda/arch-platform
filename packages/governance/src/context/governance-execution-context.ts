// packages/governance/src/context/governance-execution-context.ts

import type { AnalysisContext } from '@arch/code-analysis';

import type { GovernanceContext } from './governance-context.js';

export interface GovernancePackageAnalysis {
  readonly packageName: string;
  readonly analysis: AnalysisContext;
}

export interface GovernanceExecutionContext extends GovernanceContext {
  readonly analyses: readonly GovernancePackageAnalysis[];
}
