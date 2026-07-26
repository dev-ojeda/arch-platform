// packages/code-analysis/src/architecture/architecture-rule-engine.ts

import type { ArchitectureRuleResult } from './architecture-rule-result.js';
import type { ArchitectureRule } from './architecture-rule.js';
import type { SymbolGraph } from '../symbols/graph/symbol-graph-types.js';

export class ArchitectureRuleEngine {
  constructor(private readonly rules: readonly ArchitectureRule[]) {}

  analyze(graph: SymbolGraph): readonly ArchitectureRuleResult[] {
    return this.rules.map((rule) => rule.validate(graph));
  }
}
