// packages/code-analysis/src/architecture/architecture-rule.ts

import type { SymbolGraph } from '../symbol-graph/symbol-graph-types.js';

import type { ArchitectureRuleResult } from './architecture-rule-result.js';

export interface ArchitectureRule {
  id: string;

  description: string;

  validate(graph: SymbolGraph): ArchitectureRuleResult;
}
