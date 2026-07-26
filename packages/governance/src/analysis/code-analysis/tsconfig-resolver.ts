// packages/governance/src/analysis/code-analysis/tsconfig-resolver.ts

import type { GovernanceContext } from '../../context/governance-context.js';

export interface TsConfigResolver {
  resolve(context: GovernanceContext): string;
}
