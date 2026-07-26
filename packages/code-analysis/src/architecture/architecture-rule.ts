// packages/code-analysis/src/architecture/architecture-rule.ts

import type { ArchitectureRuleResult } from './architecture-rule-result.js';
import type { SymbolGraph } from '../symbols/graph/symbol-graph-types.js';

export interface ArchitectureRule {
  id: string;

  description: string;

  validate(graph: SymbolGraph): ArchitectureRuleResult;
}
