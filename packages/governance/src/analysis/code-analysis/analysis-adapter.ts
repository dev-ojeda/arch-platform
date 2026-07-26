// packages/governance/src/analysis/code-analysis/analysis-adapter.ts

import type { AnalysisContext } from '@arch/code-analysis';
import type { MaybePromise } from '@arch/platform-model';

import type { GovernanceContext } from '../../context/governance-context.js';

export interface AnalysisAdapter {
  analyze(context: GovernanceContext): MaybePromise<AnalysisContext>;
}
